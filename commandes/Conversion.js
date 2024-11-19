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
    },
    async (ms_org, ovl, cmd_options) => {
      const { msg_Repondu, arg, ms } = cmd_options;
      if (!msg_Repondu) {
        return ovl.sendMessage(ms_org, {
          text: "Veuillez mentionner ou répondre à un fichier (image, vidéo ou GIF).",
        });
      }
      const mediaMessage =
        msg_Repondu.imageMessage || msg_Repondu.videoMessage;
      if (!mediaMessage) {
        return ovl.sendMessage(ms_org, {
          text: "Type de fichier non supporté. Veuillez mentionner une image, vidéo ou GIF.",
        });
      }
      const alea = (ext) => `${Math.floor(Math.random() * 10000)}${ext}`;
      const stickerFileName = alea(".webp");
      try {
        const media = await ovl.dl_save_media_ms(mediaMessage);
        const buffer = fs.readFileSync(media);
        const isVideo = mediaMessage.videoMessage !== undefined;
        const sticker = new Sticker(buffer, {
          pack: "OVL-MD",
          author: "OVL Bot",
          type: arg.includes("-c") || arg.includes("crop")
            ? StickerTypes.CROPPED
            : StickerTypes.FULL,
          quality: isVideo ? 40 : 100,
        });
        await sticker.toFile(stickerFileName);
        await ovl.sendMessage(
          ms_org,
          { sticker: fs.readFileSync(stickerFileName) },
          { quoted: ms }
        );
        fs.unlinkSync(stickerFileName);
        fs.unlinkSync(media);
      } catch {
        await ovl.sendMessage(ms_org, {
          text: "Erreur lors de la création du sticker.",
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
        return ovl.sendMessage(ms_org, { text: "Veuillez répondre à un sticker." });
      }
      if (!arg) {
        return ovl.sendMessage(ms_org, {
          text: "Veuillez fournir un nouveau nom pour le sticker.",
        });
      }
      const stickerBuffer = await ovl.dl_save_media_ms(msg_Repondu.stickerMessage);
      const sticker = new Sticker(stickerBuffer, {
        pack: arg,
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
    }
  );

  // Commande scrop
  ovlcmd(
    {
      nom_cmd: "scrop",
      classe: "Conversion",
      react: "✂️",
      desc: "Recadre un sticker existant",
    },
    async (ms_org, ovl, cmd_options) => {
      const { msg_Repondu, ms } = cmd_options;
      if (!msg_Repondu || !msg_Repondu.stickerMessage) {
        return ovl.sendMessage(ms_org, { text: "Veuillez répondre à un sticker." });
      }
      const stickerBuffer = await ovl.dl_save_media_ms(msg_Repondu.stickerMessage);
      const sticker = new Sticker(stickerBuffer, {
        pack: "OVL-MD",
        author: "OVL Bot",
        type: StickerTypes.CROPPED,
      });
      const fileName = `${Math.floor(Math.random() * 10000)}.webp`;
      await sticker.toFile(fileName);
      await ovl.sendMessage(
        ms_org,
        { sticker: fs.readFileSync(fileName) },
        { quoted: ms }
      );
      fs.unlinkSync(fileName);
    }
  );

  // Commande Write
  ovlcmd(
    {
      nom_cmd: "write",
      classe: "Conversion",
      react: "📝",
      desc: "Ajoute du texte à une image, vidéo ou sticker",
    },
    async (ms_org, ovl, cmd_options) => {
      const { msg_Repondu, arg, ms } = cmd_options;
      if (!msg_Repondu || !arg) {
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
      const media = await ovl.dl_save_media_ms(mediaMessage);
      const buffer = fs.readFileSync(media);
      const image = sharp(buffer).composite([
        { input: Buffer.from(arg), gravity: "southeast" },
      ]);
      const sticker = new Sticker(await image.toBuffer(), {
        pack: "OVL-MD",
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
      const { msg_Repondu, ms } = cmd_options;
      if (!msg_Repondu || !msg_Repondu.stickerMessage) {
        return ovl.sendMessage(ms_org, { text: "Veuillez répondre à un sticker." });
      }
      const stickerBuffer = await ovl.dl_save_media_ms(msg_Repondu.stickerMessage);
      const fileName = `${Math.floor(Math.random() * 10000)}.png`;
      fs.writeFileSync(fileName, stickerBuffer);
      await ovl.sendMessage(
        ms_org,
        { image: fs.readFileSync(fileName) },
        { quoted: ms }
      );
      fs.unlinkSync(fileName);
    }
  );
