const { ovlcmd } = require("../framework/ovlcmd");
const { Catbox } = require('node-catbox');
const fs = require("fs");
const { Canvas, loadImage, createCanvas } = require("@napi-rs/canvas");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const { execSync } = require("child_process");
const catbox = new Catbox();

async function uploadToCatbox(filePath) {
  try {
    const link = await catbox.uploadFile({ path: filePath });
    return link;
  } catch (error) {
    console.error("Erreur lors de l'upload sur Catbox:", error);
    throw new Error("Une erreur est survenue lors de l'upload du fichier.");
  }
}


 const alea = (ext) => `${Math.floor(Math.random() * 10000)}${ext}`;
 
const isSupportedFile = (path) => {
    const validExtensions = [".jpg", ".jpeg", ".png", ".webp", ".mp4", ".gif"];
    return validExtensions.some((ext) => path.endsWith(ext));
  };

ovlcmd(
  {
    nom_cmd: "url",
    classe: "Conversion",
    react: "📤",
    desc: "Upload un fichier (image, vidéo, audio) sur Catbox et renvoie le lien"
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

    try {
      const media = await ovl.dl_save_media_ms(mediaMessage);
      const link = await uploadToCatbox(media);
      await ovl.sendMessage(ms_org, { text: link });
    } catch (error) {
      console.error("Erreur lors de l'upload sur Catbox:", error);
      await ovl.sendMessage(ms_org, { text: "Erreur lors de la création du lien Catbox." });
    }
  }
);
  // Commande Sticker
  ovlcmd(
  {
    nom_cmd: "sticker",
    classe: "Conversion",
    react: "📄",
    desc: "Crée un sticker à partir d'une image, vidéo ou GIF",
    alias: ["s", "stick"]
  },
  async (ms_org, ovl, cmd_options) => {
    const { msg_Repondu, arg, ms } = cmd_options;
    
    if (!msg_Repondu) {
      return ovl.sendMessage(ms_org, {
        text: "Répondez à une image, vidéo ou GIF pour créer un sticker.",
      });
    }

    let media;
    try {
      const mediaMessage =
        msg_Repondu.imageMessage ||
        msg_Repondu.videoMessage ||
        msg_Repondu.stickerMessage;

      if (!mediaMessage) {
        return ovl.sendMessage(ms_org, {
          text: "Veuillez répondre à une image, vidéo ou GIF valide.",
        });
      }

      media = await ovl.dl_save_media_ms(mediaMessage);

      if (!media) {
        throw new Error("Impossible de télécharger le fichier.");
      }

      const buffer = fs.readFileSync(media);

      const sticker = new Sticker(buffer, {
        pack: "wa-bot",
        author: "OVL-MD",
        type: StickerTypes.FULL,
        quality: 100,
      });

      const stickerFileName = `${Math.floor(Math.random() * 10000)}.webp`;
      await sticker.toFile(stickerFileName);

      await ovl.sendMessage(
        ms_org,
        { sticker: fs.readFileSync(stickerFileName) },
        { quoted: ms }
      );

      fs.unlinkSync(media);
      fs.unlinkSync(stickerFileName);
    } catch (error) {
      console.error("Erreur lors de la création du sticker:", error);
      await ovl.sendMessage(ms_org, {
        text: `Erreur lors de la création du sticker : ${error.message}`,
      });
    }
  }
);


  // Commande Take
  ovlcmd(
    {
      nom_cmd: "take",
      classe: "Conversion",
      react: "✍️",
      desc: "Modifie le nom d'un sticker",
    },
    async (ms_org, ovl, cmd_options) => {
      const { msg_Repondu, arg, nom_Auteur_Message, ms } = cmd_options;
      if (!msg_Repondu || !msg_Repondu.stickerMessage) {
        return ovl.sendMessage(ms_org, { text: "Répondez à un sticker." });
      }
      
      try {
        const stickerBuffer = await ovl.dl_save_media_ms(msg_Repondu.stickerMessage);
        const sticker = new Sticker(stickerBuffer, {
          pack: arg.join(' ') ? arg : nom_Auteur_Message,
          author: "OVL Bot",
          type: StickerTypes.FULL,
        });

        const stickerFileName = alea(".webp");
        await sticker.toFile(stickerFileName);
        await ovl.sendMessage(
          ms_org,
          { sticker: fs.readFileSync(stickerFileName) },
          { quoted: ms }
        );
        fs.unlinkSync(stickerFileName);
      } catch (error) {
        await ovl.sendMessage(ms_org, {
          text: `Erreur lors du renommage du sticker : ${error.message}`,
        });
      }
    }
  );

  // Commande Write
ovlcmd(
  {
    nom_cmd: "ecrire",
    classe: "Conversion",
    react: "📝",
    desc: "Ajoute du texte à une image, vidéo ou sticker",
  },
  async (ms_org, ovl, cmd_options) => {
    const { msg_Repondu, arg, ms, nom_Auteur_Message } = cmd_options;

    if (!msg_Repondu || !arg[0]) {
      return ovl.sendMessage(ms_org, {
        text: "Veuillez répondre à un fichier et fournir du texte.",
      });
    }

    const mediaMessage =
      msg_Repondu.imageMessage ||
      msg_Repondu.videoMessage ||
      msg_Repondu.stickerMessage;

    if (!mediaMessage) {
      return ovl.sendMessage(ms_org, {
        text: "Type de fichier non supporté. Veuillez mentionner une image, vidéo ou sticker.",
      });
    }

    try {
      const media = await ovl.dl_save_media_ms(mediaMessage);
      const image = await loadImage(media);

      const canvas = createCanvas(image.width, image.height);
      const context = canvas.getContext("2d");

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      context.font = "bold 36px Arial";
      context.fillStyle = "white";
      context.textAlign = "center";
      context.fillText(arg.join(" "), canvas.width / 2, canvas.height - 50);

      const outputBuffer = canvas.toBuffer("image/png");
      const sticker = new Sticker(outputBuffer, {
        pack: nom_Auteur_Message,
        author: "OVL Bot",
        type: StickerTypes.FULL,
      });

      const fileName = `${Math.floor(Math.random() * 10000)}.webp`;

      await sticker.toFile(fileName);

      await ovl.sendMessage(
        ms_org,
        { sticker: fs.readFileSync(fileName) },
        { quoted: ms }
      );

      fs.unlinkSync(fileName);
      fs.unlinkSync(media);
    } catch (error) {
      console.error("Erreur lors de l'ajout du texte à l'image:", error);
      await ovl.sendMessage(ms_org, {
        text: `Une erreur est survenue lors de l'ajout du texte : ${error.message}`,
      });
    }
  }
);

  // Commande ToImage
  ovlcmd(
  {
    nom_cmd: "toimage",
    classe: "Conversion",
    react: "🀄",
    desc: "Convertit un sticker en image",
    alias: ["toimg"],
  },
  async (ms_org, ovl, cmd_options) => {
    const { msg_Repondu, ms } = cmd_options;

    if (!msg_Repondu || !msg_Repondu.stickerMessage) {
      return ovl.sendMessage(ms_org, { text: "Répondez à un sticker." });
    }

    try {
      const stickerBuffer = await ovl.dl_save_media_ms(msg_Repondu.stickerMessage);
      const image = await loadImage(stickerBuffer);

      const canvas = createCanvas(image.width, image.height);
      const context = canvas.getContext("2d");

      context.drawImage(image, 0, 0);

      const outputBuffer = canvas.toBuffer("image/png");

      const fileName = alea(".png");
      fs.writeFileSync(fileName, outputBuffer);

      await ovl.sendMessage(
        ms_org,
        { image: fs.readFileSync(fileName) },
        { quoted: ms }
      );

      fs.unlinkSync(fileName);
    } catch (error) {
      console.error("Erreur lors de la conversion du sticker en image:", error);
      await ovl.sendMessage(ms_org, {
        text: `Erreur lors de la conversion en image : ${error.message}`,
      });
    }
  }
);
// tovideo

ovlcmd(
  {
    nom_cmd: "tovideo",
    classe: "Conversion",
    react: "🎥",
    desc: "Convertit un sticker animé en vidéo",
    alias: ["tovid"]
  },
  async (ms_org, ovl, cmd_options) => {
    const { msg_Repondu } = cmd_options;

    if (!msg_Repondu || !msg_Repondu.stickerMessage) {
      return ovl.sendMessage(ms_org, { text: "Répondez à un sticker animé." });
    }

    try {
      const stickerBuffer = await ovl.dl_save_media_ms(msg_Repondu.stickerMessage);
      const inputFileName = alea(".webp");
      const outputFileName = alea(".mp4");

      fs.writeFileSync(inputFileName, stickerBuffer);

      const { execSync } = require("child_process");
      execSync(`ffmpeg -i ${inputFileName} -movflags faststart -pix_fmt yuv420p ${outputFileName}`);

      await ovl.sendMessage(
        ms_org,
        { video: fs.readFileSync(outputFileName) },
        { quoted: ms_org }
      );

      fs.unlinkSync(inputFileName);
      fs.unlinkSync(outputFileName);
    } catch (error) {
      console.error("Erreur lors de la conversion du sticker en vidéo :", error);
      await ovl.sendMessage(ms_org, {
        text: `Erreur lors de la conversion en vidéo : ${error.message}`,
      });
    }
  }
);

//to audio

ovlcmd(
  {
    nom_cmd: "toaudio",
    classe: "Conversion",
    react: "🎵",
    desc: "Convertit une vidéo en fichier audio",
    alias: ["toaud"],
  },
  async (ms_org, ovl, cmd_options) => {
    const { msg_Repondu } = cmd_options;

    if (!msg_Repondu || !msg_Repondu.videoMessage) {
      return ovl.sendMessage(ms_org, { text: "Répondez à une vidéo pour la convertir en audio." });
    }

    try { 
      const videoBuffer = await ovl.dl_save_media_ms(msg_Repondu.videoMessage);
      const videoFileName = alea(".mp4");
      const audioFileName = alea(".mp3");

      fs.writeFileSync(videoFileName, videoBuffer);
      const { execSync } = require("child_process");
      execSync(`ffmpeg -i ${videoFileName} -q:a 0 -map a ${audioFileName}`);

      await ovl.sendMessage(
        ms_org,
        { audio: { url: audioFileName }, mimetype: "audio/mpeg" },
        { quoted: ms_org }
      );

      fs.unlinkSync(videoFileName);
      fs.unlinkSync(audioFileName);
    } catch (error) {
      console.error("Erreur lors de la conversion de vidéo en audio :", error);
      await ovl.sendMessage(ms_org, {
        text: `Erreur lors de la conversion en audio : ${error.message}`,
      });
    }
  }
);
