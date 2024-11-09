const { ovlcmd, cmd } = require("../framework/ovlcmd");
const { upload } = require("telegra.ph");

ovlcmd(
    {
        nom_cmd: "telegraph_upload",
        classe: "upload",
        react: "📤",
        desc: "Upload une image ou vidéo sur Telegraph et renvoie le lien"
    },
    async (ms_org, ovl, cmd_options) => {
      const msg_Repondu = cmd_options;
        if (!msg_Repondu.imageMessage || !msg_Repondu.videoMessage) {
            return ovl.sendMessage(ms_org, { text: "Veuillez mentionner une image ou une vidéo" });
        }
        const mediaMessage = msg_Repondu.imageMessage || msg_Repondu.videoMessage;
        const media = await ovl.dl_save_media_ms(mediaMessage);

        try {
            const response = await upload(media, "media.jpg");
            const link = response.url;
            await ovl.sendMessage(ms_org, { text: link });
        } catch (error) {
            console.error("Erreur lors de l'upload sur Telegraph:", error);
            await ovl.sendMessage(ms_org, { text: "Erreur lors de la création du lien Telegraph." });
        }
    }
);
