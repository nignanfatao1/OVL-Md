const { ovlcmd } = require("../framework/ovlcmd");
const { Catbox } = require('node-catbox');
const fs = require("fs");
const { Canvas, loadImage, createCanvas } = require("@napi-rs/canvas");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const { execSync, exec } = require(
const path = require('path');
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
    react: "✍️",
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
    nom_cmd: "write",
    classe: "Conversion",
    react: "✍️",
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
    react: "✍️",
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

ovlcmd(
    {
        nom_cmd: "stovideo",
        classe: "Conversion",
        desc: "Convertit un sticker animé en vidéo.",
        alias: ["stovid"],
    },
    async (ms_org, ovl, cmd_options) => {
        const { msg_Repondu } = cmd_options;
    if (!msg_Repondu || !msg_Repondu.stickerMessage) {
      return ovl.sendMessage(ms_org, { text: "Répondez à un sticker." });
    }
        const media = await ovl.dl_save_media_ms(msg_Repondu.stickerMessage);
        const directory = path.join(__dirname, '../../.temp');
        const webpFilePath = path.join(directory, Math.random().toString(36).slice(2) + ".webp");
        const mp4FilePath = path.join(directory, Math.random().toString(36).slice(2) + ".mp4");

        try {
            fs.writeFileSync(webpFilePath, media);
            const ffmpegCommand = `ffmpeg -y -i ${webpFilePath} -movflags faststart -pix_fmt yuv420p -vf "scale=720:720" ${mp4FilePath}`;
            await new Promise((resolve, reject) => {
                exec(ffmpegCommand, (error) => {
                    if (error) return reject(error);
                    resolve();
                });
            });

            const videoBuffer = fs.readFileSync(mp4FilePath);
            await ovl.sendMessage(ms_org, { video: videoBuffer, caption: "🎥 Voici votre vidéo convertie." });
            fs.unlinkSync(webpFilePath);
            fs.unlinkSync(mp4FilePath);
        } catch {
            await ovl.sendMessage(ms_org, { text: "❗ Une erreur est survenue lors de la conversion du sticker." });
        }
    }
);

ovlcmd(
    {
        nom_cmd: "tovideo",
        classe: "Conversion",
        desc: "Convertit un fichier audio en une vidéo avec fond noir.",
        alias: ["tovid"],
    },
    async (ms_org, ovl, cmd_options) => {
     const { msg_Repondu } = cmd_options;
    if (!msg_Repondu || !msg_Repondu.audioMessage) {
        return ovl.sendMessage(ms_org, { text: "Répondez à un sticker." });
    }
        const media = await ovl.dl_save_media_ms(msg_Repondu.audioMessage);
        const directory = path.join(__dirname, '../../.temp');
        const audioPath = path.join(directory, Math.random().toString(36).slice(2) + ".mp3");
        const videoPath = path.join(directory, Math.random().toString(36).slice(2) + ".mp4");

        try {
            fs.writeFileSync(audioPath, media);
            const ffmpegCommand = `ffmpeg -y -f lavfi -i color=c=black:s=720x720:d=10 -i ${audioPath} -shortest -c:v libx264 -c:a aac -strict experimental ${videoPath}`;
            await new Promise((resolve, reject) => {
                exec(ffmpegCommand, (error) => {
                    if (error) return reject(error);
                    resolve();
                });
            });

            const videoBuffer = fs.readFileSync(videoPath);
            await ovl.sendMessage(ms_org, { video: videoBuffer, caption: "🎥 Voici votre vidéo générée." });
            fs.unlinkSync(audioPath);
            fs.unlinkSync(videoPath);
        } catch {
            await ovl.sendMessage(ms_org, { text: "❗ Une erreur est survenue lors de la conversion de l'audio." });
        }
    }
);

ovlcmd(
    {
        nom_cmd: "toaudio",
        classe: "Conversion",
        desc: "Extrait l'audio d'une vidéo et le convertit en MP3.",
        alias: ["toaud"],
    },
    async (ms_org, ovl, cmd_options) => {
        const { msg_Repondu } = cmd_options;
    if (!msg_Repondu || !msg_Repondu.videoMessage) {
       return ovl.sendMessage(ms_org, { text: "Répondez à un sticker." });
    }
        const media = await ovl.dl_save_media_ms(msg_Repondu.videoMessage);
        const directory = path.join(__dirname, '../../.temp');
        const videoPath = path.join(directory, Math.random().toString(36).slice(2) + ".mp4");
        const audioPath = path.join(directory, Math.random().toString(36).slice(2) + ".mp3");

        try {
            fs.writeFileSync(videoPath, media);
            const ffmpegCommand = `ffmpeg -y -i ${videoPath} -q:a 0 -map a ${audioPath}`;
            await new Promise((resolve, reject) => {
                exec(ffmpegCommand, (error) => {
                    if (error) return reject(error);
                    resolve();
                });
            });

            const audioBuffer = fs.readFileSync(audioPath);
            await ovl.sendMessage(ms_org, { audio: audioBuffer, mimetype: "audio/mp3", caption: "🎵 Voici votre audio extrait." });
            fs.unlinkSync(videoPath);
            fs.unlinkSync(audioPath);
        } catch {
            await ovl.sendMessage(ms_org, { text: "❗ Une erreur est survenue lors de l'extraction de l'audio." });
        }
    }
);
