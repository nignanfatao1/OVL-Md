const { ovlcmd, cmd } = require("../framework/ovlcmd");
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

ovlcmd(
    {
        nom_cmd: "url",
        classe: "Converssion",
        react: "✨",
        desc: "Upload une image ou vidéo sur Telegraph et renvoie le lien"
    },
    async (ms_org, ovl, cmd_options) => {
        const { msg_Repondu } = cmd_options;

        if (!msg_Repondu) {
            return ovl.sendMessage(ms_org, { text: "Veuillez mentionner une image ou une vidéo" });
        }

        // Identifier le type de média (image ou vidéo)
        const mediaMessage = msg_Repondu.imageMessage || msg_Repondu.videoMessage;
        if (!mediaMessage) {
            return ovl.sendMessage(ms_org, { text: "Aucune image ou vidéo trouvée." });
        }

        // Télécharger le fichier média
        const media = await ovl.dl_save_media_ms(mediaMessage);
        const fileName = path.basename(media); // Extraire le nom du fichier
        const filePath = path.resolve(__dirname, fileName);

        try {
            // Créer le formulaire pour l'upload
            const form = new FormData();
            form.append('file', fs.createReadStream(filePath));  // Utiliser le fichier téléchargé

            // Effectuer la requête POST vers Telegraph
            const response = await axios.post('https://telegra.ph/upload', form, {
                headers: {
                    ...form.getHeaders(), // Ajouter les entêtes nécessaires pour le multipart/form-data
                },
            });

            // Vérifier la réponse et obtenir l'URL
            if (response.data && response.data[0] && response.data[0].src) {
                const link = `https://telegra.ph${response.data[0].src}`;
                await ovl.sendMessage(ms_org, { text: link });
            } else {
                console.error("Erreur de réponse de l'API Telegraph:", response.data);
                await ovl.sendMessage(ms_org, { text: "Erreur lors de la création du lien Telegraph." });
            }
        } catch (error) {
            console.error("Erreur lors de l'upload sur Telegraph:", error);
            await ovl.sendMessage(ms_org, { text: "Erreur lors de l'upload de l'image/vidéo." });
        }
    }
);
