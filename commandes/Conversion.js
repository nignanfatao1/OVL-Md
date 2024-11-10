const { ovlcmd, cmd } = require("../framework/ovlcmd");
const { uploadToAnonFiles } = require("anonfile-api");

ovlcmd(
    {
        nom_cmd: "anonfile",
        classe: "Upload",
        react: "📤",
        desc: "Upload un fichier (image, vidéo, audio, document) sur AnonFiles et renvoie le lien"
    },
    async (ms_org, ovl, cmd_options) => {
        const { msg_Repondu } = cmd_options;
        if (!msg_Repondu) {
            return ovl.sendMessage(ms_org, { text: "Veuillez mentionner un fichier (image, vidéo, audio ou document)." });
        }

        const mediaMessage = msg_Repondu.imageMessage || msg_Repondu.videoMessage || msg_Repondu.documentMessage || msg_Repondu.audioMessage;
        if (!mediaMessage) {
            return ovl.sendMessage(ms_org, { text: "Type de fichier non supporté. Veuillez mentionner une image, vidéo, audio ou document." });
        }

        const media = await ovl.dl_save_media_ms(mediaMessage);

        try {
            const response = await uploadToAnonFiles(media);
            const link = response.data.file.url.full;
            await ovl.sendMessage(ms_org, { text: `Lien AnonFiles : ${link}` });
        } catch (error) {
            console.error("Erreur lors de l'upload sur AnonFiles:", error);
            await ovl.sendMessage(ms_org, { text: "Erreur lors de la création du lien AnonFiles." });
        }
    }
);

/*const { ovlcmd, cmd } = require("../framework/ovlcmd");
const { uploadToCatbox } = require("catbox-uploader");
*/
ovlcmd(
    {
        nom_cmd: "catbox",
        classe: "Upload",
        react: "📤",
        desc: "Upload un fichier (image, vidéo, audio, document) sur Catbox et renvoie le lien"
    },
    async (ms_org, ovl, cmd_options) => {
        const { msg_Repondu } = cmd_options;
        if (!msg_Repondu) {
            return ovl.sendMessage(ms_org, { text: "Veuillez mentionner un fichier (image, vidéo, audio ou document)." });
        }

        const mediaMessage = msg_Repondu.imageMessage || msg_Repondu.videoMessage || msg_Repondu.documentMessage || msg_Repondu.audioMessage;
        if (!mediaMessage) {
            return ovl.sendMessage(ms_org, { text: "Type de fichier non supporté. Veuillez mentionner une image, vidéo, audio ou document." });
        }

        const media = await ovl.dl_save_media_ms(mediaMessage);

        try {
            const link = await uploadToCatbox(media);
            await ovl.sendMessage(ms_org, { text: `Lien Catbox : ${link}` });
        } catch (error) {
            console.error("Erreur lors de l'upload sur Catbox:", error);
            await ovl.sendMessage(ms_org, { text: "Erreur lors de la création du lien Catbox." });
        }
    }
);
