const { ovlcmd } = require("../framework/ovlcmd");
const { Catbox } = require('node-catbox');
const fs = require("fs");
const sharp = require("sharp");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");

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

      try {
        const media = await ovl.dl_save_media_ms(msg_Repondu);
        if (!media || !isSupportedFile(media)) {
          throw new Error("Fichier non supporté ou invalide.");
        }

        const buffer = fs.readFileSync(media);
        const sticker = new Sticker(buffer, {
          pack: "OVL-MD",
          author: "OVL Bot",
          type: arg.includes("-c") || arg.includes("crop")
            ? StickerTypes.CROPPED
            : StickerTypes.FULL,
          quality: 100,
        });

        const stickerFileName = alea(".webp");
        await sticker.toFile(stickerFileName);
        await ovl.sendMessage(
          ms_org,
          { sticker: fs.readFileSync(stickerFileName) },
          { quoted: ms }
        );
        fs.unlinkSync(media);
        fs.unlinkSync(stickerFileName);
      } catch (error) {
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
      const { msg_Repondu, arg, ms } = cmd_options;
      if (!msg_Repondu || !msg_Repondu.stickerMessage) {
        return ovl.sendMessage(ms_org, { text: "Répondez à un sticker." });
      }

      if (!arg) {
        return ovl.sendMessage(ms_org, {
          text: "Spécifiez un nouveau nom pour le sticker.",
        });
      }

      try {
        const stickerBuffer = await ovl.dl_save_media_ms(msg_Repondu.stickerMessage);
        const sticker = new Sticker(stickerBuffer, {
          pack: arg,
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
      react: "📝",
      desc: "Ajoute du texte à une image et crée un sticker",
    },
    async (ms_org, ovl, cmd_options) => {
      const { msg_Repondu, arg, ms } = cmd_options;
      if (!msg_Repondu || !arg) {
        return ovl.sendMessage(ms_org, {
          text: "Répondez à une image et fournissez du texte.",
        });
      }

      try {
        const media = await ovl.dl_save_media_ms(msg_Repondu.imageMessage);
        const buffer = fs.readFileSync(media);
        const editedImage = sharp(buffer)
          .composite([
            {
              input: Buffer.from(arg, "utf-8"),
              gravity: "southeast",
            },
          ])
          .toBuffer();

        const sticker = new Sticker(await editedImage, {
          pack: "OVL-MD",
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
        fs.unlinkSync(media);
        fs.unlinkSync(stickerFileName);
      } catch (error) {
        await ovl.sendMessage(ms_org, {
          text: `Erreur lors de l'édition de l'image : ${error.message}`,
        });
      }
    }
  );

  // Commande ToImage
  ovlcmd(
    {
      nom_cmd: "toimage",
      classe: "Conversion",
      react: "🖼️",
      desc: "Convertit un sticker en image",
      alias: ['toimg']
    },
    async (ms_org, ovl, cmd_options) => {
      const { msg_Repondu, ms} = cmd_options;
      if (!msg_Repondu || !msg_Repondu.stickerMessage) {
        return ovl.sendMessage(ms_org, { text: "Répondez à un sticker." });
      }

      try {
        const stickerBuffer = await ovl.dl_save_media_ms(msg_Repondu.stickerMessage);
        const fileName = alea(".png");
        fs.writeFileSync(fileName, stickerBuffer);

        await ovl.sendMessage(
          ms_org,
          { image: fs.readFileSync(fileName) },
          { quoted: ms }
        );
        fs.unlinkSync(fileName);
      } catch (error) {
        await ovl.sendMessage(ms_org, {
          text: `Erreur lors de la conversion en image : ${error.message}`,
        });
      }
    }
  );
};
