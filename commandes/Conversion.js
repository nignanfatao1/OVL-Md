const axios = require('axios');
const FormData = require('form-data');
const { ovlcmd } = require("../framework/ovlcmd");

const uploadToCatbox = async (filePath) => {
  const form = new FormData();
  form.append('file', require('fs').createReadStream(filePath));

  try {
    const response = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders()
    });
    return response.data.url; // Retourne le lien du fichier sur Catbox
  } catch (error) {
    console.error("Erreur lors de l'upload sur Catbox:", error);
    throw new Error("Erreur lors de l'upload sur Catbox.");
  }
};

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
      await ovl.sendMessage(ms_org, { text: "Erreur lors de l'upload sur Catbox." });
    }
  }
);

/*const axios = require('axios');
const FormData = require('form-data');
const { ovlcmd } = require("../framework/ovlcmd");*/

const uploadToAnonFiles = async (filePath) => {
  const form = new FormData();
  form.append('file', require('fs').createReadStream(filePath));

  try {
    const response = await axios.post('https://api.anonfiles.com/upload', form, {
      headers: form.getHeaders()
    });

    if (response.data.status === 'success') {
      return response.data.data.file.url.full; // Retourne le lien du fichier sur AnonFiles
    } else {
      throw new Error('Erreur lors de l\'upload sur AnonFiles');
    }
  } catch (error) {
    console.error("Erreur lors de l'upload sur AnonFiles:", error);
    throw new Error("Erreur lors de l'upload sur AnonFiles.");
  }
};

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
      const link = await uploadToAnonFiles(media);
      await ovl.sendMessage(ms_org, { text: `Lien AnonFiles : ${link}` });
    } catch (error) {
      await ovl.sendMessage(ms_org, { text: "Erreur lors de l'upload sur AnonFiles." });
    }
  }
);

