const { ovlcmd } = require("../framework/ovlcmd");
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { Antilink } = require("../DataBase/antilink");

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
                        type: StickerTypes.FULL,
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

ovlcmd(
  {
    nom_cmd: "kick",
    classe: "Groupe",
    react: "🛑",
    desc: "Supprime un membre du groupe.",
  },
  async (ms_org, ovl, cmd_options) => {
    const { verif_Groupe, auteur_Msg_Repondu, arg, infos_Groupe, verif_Admin, verif_Ovl_Admin, prenium_id } = cmd_options;
    if (!verif_Groupe) return ovl.sendMessage(ms_org, { text: "Commande utilisable uniquement dans les groupes." });
    if (prenium_id || verif_Admin) {
    const membres = await infos_Groupe.participants;
    const admins = membres.filter((m) => m.admin).map((m) => m.id);
    const membre = auteur_Msg_Repondu || (arg[0]?.includes("@") && `${arg[0].replace("@", "")}@s.whatsapp.net`);
      if (!verif_Ovl_Admin)
      return ovl.sendMessage(ms_org, { text: "Je dois être administrateur pour effectuer cette action." });

     if (!membre || !membres.find((m) => m.id === membre))
      return ovl.sendMessage(ms_org, { text: "Membre introuvable dans ce groupe." });
    if (admins.includes(membre))
      return ovl.sendMessage(ms_org, { text: "Impossible d'exclure un administrateur du groupe." });

    try {
      await ovl.groupParticipantsUpdate(ms_org, [membre], "remove");
      ovl.sendMessage(ms_org, { text: `@${membre.split("@")[0]} a été exclu.`, mentions: [membre] });
    } catch (err) {
      console.error("Erreur :", err);
      ovl.sendMessage(ms_org, { text: "Une erreur est survenue lors de l'exclusion." });
    }
    } else { return ovl.sendMessage(ms_org, { text: "Vous n'avez pas la permission d'utiliser cette commande." });
           };
  }
);

ovlcmd(
  {
    nom_cmd: "promote",
    classe: "Groupe",
    react: "⬆️",
    desc: "Promouvoir un membre comme administrateur.",
  },
  async (ms_org, ovl, cmd_options) => {
    const { verif_Groupe, auteur_Msg_Repondu, arg, infos_Groupe, verif_Admin, prenium_id, verif_Ovl_Admin } = cmd_options;
    if (!verif_Groupe) return ovl.sendMessage(ms_org, { text: "Commande utilisable uniquement dans les groupes." });
    if (verif_Admin || prenium_id) {
    const membres = await infos_Groupe.participants;
    const admins = membres.filter((m) => m.admin).map((m) => m.id);
    const membre = auteur_Msg_Repondu || (arg[0]?.includes("@") && `${arg[0].replace("@", "")}@s.whatsapp.net`);
    if (!verif_Ovl_Admin)
      return ovl.sendMessage(ms_org, { text: "Je dois être administrateur pour effectuer cette action." });
    if (!membre) return ovl.sendMessage(ms_org, { text: "Veuillez mentionner un membre à promouvoir." });
    if (!membres.find((m) => m.id === membre))
      return ovl.sendMessage(ms_org, { text: "Membre introuvable dans ce groupe." });
    if (admins.includes(membre))
      return ovl.sendMessage(ms_org, { text: "ce membre est déjà un administrateur du groupe." });

    try {
      await ovl.groupParticipantsUpdate(ms_org, [membre], "promote");
      ovl.sendMessage(ms_org, { text: `@${membre.split("@")[0]} a été promu administrateur.`, mentions: [membre] });
    } catch (err) {
      console.error("Erreur :", err);
      ovl.sendMessage(ms_org, { text: "Une erreur est survenue lors de la promotion." });
    }
    } else { return ovl.sendMessage(ms_org, { text: "Vous n'avez pas la permission d'utiliser cette commande." });
           }
  }
);

ovlcmd(
  {
    nom_cmd: "demote",
    classe: "Groupe",
    react: "⬇️",
    desc: "Retirer le rôle d'administrateur à un membre.",
  },
  async (ms_org, ovl, cmd_options) => {
    const { verif_Groupe, auteur_Msg_Repondu, arg, infos_Groupe, verif_Admin, prenium_id, verif_Ovl_Admin } = cmd_options;
    if (!verif_Groupe) return ovl.sendMessage(ms_org, { text: "Commande utilisable uniquement dans les groupes." });
    if (verif_Admin || prenium_id) { 
    const membres = await infos_Groupe.participants;
    const admins = membres.filter((m) => m.admin).map((m) => m.id);
    const membre = auteur_Msg_Repondu || (arg[0]?.includes("@") && `${arg[0].replace("@", "")}@s.whatsapp.net`);
    if (!verif_Ovl_Admin)
      return ovl.sendMessage(ms_org, { text: "Je dois être administrateur pour effectuer cette action." });
    if (!membre) return ovl.sendMessage(ms_org, { text: "Veuillez mentionner un membre à rétrograder." });
    if (!membres.find((m) => m.id === membre))
      return ovl.sendMessage(ms_org, { text: "Membre introuvable dans ce groupe." });
    if (!admins.includes(membre))
      return ovl.sendMessage(ms_org, { text: "ce membre n'est pas un administrateur du groupe." });

    try {
      await ovl.groupParticipantsUpdate(ms_org, [membre], "demote");
      ovl.sendMessage(ms_org, { text: `@${membre.split("@")[0]} a été rétrogradé.`, mentions: [membre] });
    } catch (err) {
      console.error("Erreur :", err);
      ovl.sendMessage(ms_org, { text: "Une erreur est survenue lors de la rétrogradation." });
    }
    } else { return ovl.sendMessage(ms_org, { text: "Vous n'avez pas la permission d'utiliser cette commande." });
           }
  }
);

ovlcmd(
  {
    nom_cmd: "del",
    classe: "Groupe",
    react: "🗑️",
    desc: "Supprimer un message dans le groupe.",
  },
  async (ms_org, ovl, cmd_options) => {
    const { msg_Repondu, auteur_Msg_Repondu, verif_Admin, prenium_id, verif_Ovl_Admin, ms } = cmd_options;
    if (!verif_Groupe) return ovl.sendMessage(ms_org, { text: "Commande utilisable uniquement dans les groupes." });
    if (verif_Admin || prenium_id) { 
    if(!verif_Ovl_Admin) return ovl.sendMessage(ms_org, { text: "Je dois être administrateur pour effectuer cette action." });
    if (!msg_Repondu) return ovl.sendMessage(ms_org, { text: "Veuillez répondre à un message pour le supprimer." });
  try { 
      const key = {
    remoteJid: ms_org,
    id: ms.key.id,
    participant: auteur_Msg_Repondu
      };
        await ovl.sendMessage(ms_org, { delete: msg_Repondu.key });
          } catch (err) {
      console.error("Erreur :", err);
      ovl.sendMessage(ms_org, { text: "Une erreur est survenue lors de la suppression du message." });
    }
    } else { return ovl.sendMessage(ms_org, { text: "Vous n'avez pas la permission d'utiliser cette commande." });
           }
  }
);


ovlcmd(
  {
    nom_cmd: "antilink",
    classe: "Groupe",
    react: "🔗",
    desc: "Active ou configure l'antilink pour les groupes",
  },
  async (jid, ovl, cmd_options) => {
      const { ms, repondre, arg, verif_Groupe, verif_Admin } = cmd_options;
    try {
      
      if (!verif_Groupe) {
        return repondre("Cette commande ne fonctionne que dans les groupes");
      }

      if (!verif_Admin) {
        return repondre("Seuls les administrateurs peuvent utiliser cette commande");
      }

      const sousCommande = arg[0]?.toLowerCase();
      const validModes = ['on', 'off'];
      const validTypes = ['supp', 'warn', 'kick'];

      const [settings] = await Antilink.findOrCreate({
        where: { id: jid },
        defaults: { id: jid, mode: 'non', type: 'supp' },
      });

      if (validModes.includes(sousCommande)) {
        const newMode = sousCommande === 'on' ? 'oui' : 'non';
        if (settings.mode === newMode) {
          return repondre(`L'Antilink est déjà ${sousCommande}`);
        }
        settings.mode = newMode;
        await settings.save();
        return repondre(`L'Antilink ${sousCommande === 'on' ? 'activé' : 'désactivé'} avec succès !`);
      }

      if (validTypes.includes(sousCommande)) {
        if (settings.mode !== 'oui') {
          return repondre("Veuillez activer l'antilink d'abord en utilisant `antilink on`");
        }
        if (settings.type === sousCommande) {
          return repondre(`L'action antilink est déjà définie sur ${sousCommande}`);
        }
        settings.type = sousCommande;
        await settings.save();
        return repondre(`L'Action de l'antilink définie sur ${sousCommande} avec succès !`);
      }

      return repondre(
        "Utilisation :\n" +
        "antilink on/off: Activer ou désactiver l'antilink\n" +
        "antilink supp/warn/kick: Configurer l'action antilink"
      );
    } catch (error) {
      console.error("Erreur lors de la configuration d'antilink :", error);
      repondre("Une erreur s'est produite lors de l'exécution de la commande.");
    }
  }
);

