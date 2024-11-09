const { ovlcmd } = require("../framework/ovlcmd");
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

ovlcmd(
    {
        nom_cmd: "tagall",
        classe: "Groupe",
        react: "💬",
        desc: "Commande pour taguer tous les membres d'un groupe"
    },
    async (dest, ovl, cmd_options) => {
        try {
            const { ms, repondre, arg, verif_Groupe, infos_Groupe, nom_Auteur_Message, verif_Admin } = cmd_options;

            if (!verif_Groupe) {
                return repondre("Cette commande ne fonctionne que dans les groupes");
            }

            const messageTexte = arg && arg.length > 0 ? arg.join(' ') : '';
            const membresGroupe = verif_Groupe ? await infos_Groupe.participants : [];
            
            let tagMessage = `╭───〔  TAG ALL 〕───⬣\n`;
            tagMessage += `│👤 Auteur : *${nom_Auteur_Message}*\n`;
            tagMessage += `│💬 Message : *${messageTexte}*\n│\n`;

            membresGroupe.forEach(membre => {
                tagMessage += `│◦❒ @${membre.id.split("@")[0]}\n`;
            });
            tagMessage += `╰═══════════════⬣\n`;

            if (verif_Admin) {
                await ovl.sendMessage(dest, { text: tagMessage, mentions: membresGroupe.map(m => m.id) }, { quoted: ms });
            } else {
                repondre('Seuls les administrateurs peuvent utiliser cette commande');
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi du message avec tagall :", error);
        }
    });

ovlcmd(
    {
        nom_cmd: "tag",
        classe: "Groupe",
        react: "💬",
        desc: "partager un message à tous les membres d'un groupe"

    },
    async (dest, ovl, cmd_options) => {
        const { repondre, msg_Repondu, verif_Groupe, arg, verif_Admin } = cmd_options;

        if (!verif_Groupe) {
            repondre("Cette commande ne fonctionne que dans les groupes");
            return;
        }

        if (verif_Admin) {
            let metadata_groupe = await ovl.groupMetadata(dest);
            let membres_Groupe = metadata_groupe.participants.map(participant => participant.id);
            let contenu_msg;

            if (msg_Repondu) {
                if (msg_Repondu.imageMessage) {
                    let media_image = await ovl.dl_save_media_ms(msg_Repondu.imageMessage);
                    contenu_msg = {
                        image: { url: media_image },
                        caption: msg_Repondu.imageMessage.caption,
                        mentions: membres_Groupe
                    };
                } else if (msg_Repondu.videoMessage) {
                    let media_video = await ovl.dl_save_media_ms(msg_Repondu.videoMessage);
                    contenu_msg = {
                        video: { url: media_video },
                        caption: msg_Repondu.videoMessage.caption,
                        mentions: membres_Groupe
                    };
                } else if (msg_Repondu.audioMessage) {
                    let media_audio = await ovl.dl_save_media_ms(msg_Repondu.audioMessage);
                    contenu_msg = {
                        audio: { url: media_audio },
                        mimetype: 'audio/mp4',
                        mentions: membres_Groupe
                    };
                } else if (msg_Repondu.stickerMessage) {
                    let media_sticker = await ovl.dl_save_media_ms(msg_Repondu.stickerMessage);
                    let sticker_msg = new Sticker(media_sticker, {
                        pack: 'OVL-MD Hidtag',
                        type: StickerTypes.CROPPED,
                        categories: ["🎊", "🎈"],
                        id: "tag_sticker",
                        quality: 80,
                        background: "transparent",
                    });
                    const sticker_buffer = await sticker_msg.toBuffer();
                    contenu_msg = { sticker: sticker_buffer, mentions: membres_Groupe };
                } else {
                    contenu_msg = {
                        text: msg_Repondu.conversation,
                        mentions: membres_Groupe
                    };
                }

                ovl.sendMessage(dest, contenu_msg);
            } else {
                if (!arg || !arg[0]) {
                    repondre("Veuillez inclure ou mentionner un message à partager.");
                    return;
                }

                ovl.sendMessage(dest, {
                    text: arg.join(' '),
                    mentions: membres_Groupe
                });
            }
        } else {
            repondre("Cette commande est réservée aux administrateurs du groupe");
        }
    }
);
