const { ovlcmd, cmd } = require("../framework/ovlcmd");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

ovlcmd(
    {
        nom_cmd: "url",
        classe: "Conversion",
        react: "✨",
        desc: "Upload une image ou vidéo sur Telegraph et renvoie le lien"
    },
    async (ms_org, ovl, cmd_options) => {
        const { msg_Repondu } = cmd_options;
        if (!msg_Repondu) {
            return ovl.sendMessage(ms_org, { text: "Veuillez mentionner une image ou une vidéo" });
        }

        const mediaMessage = msg_Repondu.imageMessage || msg_Repondu.videoMessage;
        const media = await ovl.dl_save_media_ms(mediaMessage);

        // Fonction pour télécharger sur Telegraph
        async function uploadToTelegraph(mediaPath) {
            const formData = new FormData();
            formData.append('file', fs.createReadStream(mediaPath));

            try {
                const response = await axios.post('https://telegra.ph/upload', formData, {
                    headers: {
                        ...formData.getHeaders(),
                    },
                });
                return response.data[0].src;  // Renvoie l'URL de l'image/vidéo téléchargée
            } catch (error) {
                console.error('Erreur lors de l\'upload sur Telegraph:', error);
                throw new Error('Erreur lors de l\'upload');
            }
        }

        try {
            const link = await uploadToTelegraph(media);
            await ovl.sendMessage(ms_org, { text: `Voici votre lien : ${link}` });
        } catch (error) {
            console.error("Erreur lors de l'upload sur Telegraph:", error);
            await ovl.sendMessage(ms_org, { text: "Erreur lors de la création du lien Telegraph." });
        }
    }
);
