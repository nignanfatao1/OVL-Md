const { exec } = require("child_process");
const { ovlcmd } = require("../framework/ovlcmd");

ovlcmd(
  {
    nom_cmd: "exec",
    classe: "Owner",
    react: "⚙️",
    desc: "Exécute une commande shell sur le serveur"
  },
  async (ms_org, ovl, cmd_options) => {
    const { arg, prenium_id } = cmd_options;

    if (!prenium_id) {
      return ovl.sendMessage(ms_org, { text: "Vous n'avez pas l'autorisation d'exécuter des commandes." });
    }

    if (!arg[0]) {
      return ovl.sendMessage(ms_org, { text: "Veuillez fournir une commande shell à exécuter." });
    }

    exec(arg.join(" "), (err, stdout, stderr) => {
      if (err) {
        return ovl.sendMessage(ms_org, { text: `Erreur d'exécution: ${err.message}` });
      }
      if (stderr) {
        return ovl.sendMessage(ms_org, { text: `Erreur: ${stderr}` });
      }
      ovl.sendMessage(ms_org, { text: `Resultat: \n${stdout}` });
    });
  }
);

ovlcmd(
  {
    nom_cmd: "eval",
    classe: "Owner",
    react: "📝",
    desc: "Exécute du code JavaScript sur le serveur"
  },
  async (ms_org, ovl, cmd_options) => {
    const { arg, prenium_id } = cmd_options;

    if (!prenium_id) {
      return;
    }

    if (!arg[0]) {
      return ovl.sendMessage(ms_org, { text: "Veuillez fournir du code JavaScript à exécuter." });
    }

    try {
      let result = await eval(arg.join(" "));
      if (typeof result === "object") {
        result = JSON.stringify(result);
      }
      ovl.sendMessage(ms_org, { text: `Résultat: \n${result}` });
    } catch (err) {
      return ovl.sendMessage(ms_org, { text: `Erreur lors de l'exécution du code JavaScript: ${err.message}` });
    }
  }
);

ovlcmd(
    {
        nom_cmd: "vv",
        classe: "Général",
        react: "🤲🏿",
        desc: "Afficher un message en vue unique",
        alias: ['voir']
    },
    async (_ms_org, ovl, _cmd_options) => {
        const { ms, msg_Repondu, repondre } = _cmd_options;

        if (!msg_Repondu) {
            return repondre("Veuillez mentionner un message en mode vue unique.");
        }

        let _vue_Unique_Message = msg_Repondu.viewOnceMessage ?? msg_Repondu.viewOnceMessageV2 ?? msg_Repondu.viewOnceMessageV2Extension;

        if (!_vue_Unique_Message) {
            return repondre("Le message sélectionné n'est pas en mode vue unique.");
        }

        try {
            let _media;
            let options = { quoted: ms };

            if (_vue_Unique_Message.message.imageMessage) {
                _media = await ovl.dl_save_media_ms(_vue_Unique_Message.message.imageMessage);
                await ovl.sendMessage(_ms_org, { image: { url: _media }, caption: _vue_Unique_Message.message.imageMessage.caption }, options);

            } else if (_vue_Unique_Message.message.videoMessage) {
                _media = await ovl.dl_save_media_ms(_vue_Unique_Message.message.videoMessage);
                await ovl.sendMessage(_ms_org, { video: { url: _media }, caption: _vue_Unique_Message.message.videoMessage.caption }, options);

            } else if (_vue_Unique_Message.message.audioMessage) {
                _media = await ovl.dl_save_media_ms(_vue_Unique_Message.message.audioMessage);
                await ovl.sendMessage(_ms_org, { audio: { url: _media }, mimetype: "audio/mp4", ptt: false }, options);

            } else {
                return repondre("Ce type de message n'est pas pris en charge");
            }
        } catch (_error) {
            console.error("Erreur lors de l'envoi du message en vue unique :", _error.message || _error);
        }
    }
);
