const { exec } = require("child_process");
const { ovlcmd } = require("../framework/ovlcmd");
const { Bans } = require('../DataBase/ban');

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
    nom_cmd: "ban",
    classe: "Owner",
    react: "🚫",
    desc: "Bannir ou débannir un utilisateur des commandes du bot",
  },
  async (jid, ovl, cmd_options) => {
    const { repondre, arg, auteur_Msg_Repondu } = cmd_options;

    try {
      const action = arg[0]?.toLowerCase();
      const estDeban = action === "del";
      const cible =
        auteur_Msg_Repondu || 
        (arg[estDeban ? 1 : 0]?.includes("@") && `${arg[estDeban ? 1 : 0].replace("@", "")}@s.whatsapp.net`);

      if (!cible) return repondre(`❌ Mentionnez un utilisateur valide pour ${estDeban ? "débannir" : "bannir"}.`);

      if (estDeban) {
        const suppression = await Bans.destroy({ where: { id: cible, type: "user" } });
        if (suppression === 0) return repondre("⚠️ Cet utilisateur n'est pas banni.");
        return repondre(`✅ Utilisateur @${cible.split("@")[0]} débanni avec succès.`);
      } else {
        const [ban] = await Bans.findOrCreate({
          where: { id: cible },
          defaults: { id: cible, type: "user" },
        });

        if (!ban._options.isNewRecord) return repondre("⚠️ Cet utilisateur est déjà banni !");
        return repondre(`✅ Utilisateur @${cible.split("@")[0]} banni avec succès.`);
      }
    } catch (error) {
      console.error("Erreur lors de l'exécution de la commande ban :", error);
      return repondre("❌ Une erreur s'est produite.");
    }
  }
);

ovlcmd(
  {
    nom_cmd: "bangroup",
    classe: "Owner",
    react: "🚫",
    desc: "Bannir ou débannir un groupe des commandes du bot",
  },
  async (jid, ovl, cmd_options) => {
    const { repondre, msg_org, arg, verif_Groupe } = cmd_options;

    try {
      if (!verif_Groupe) return repondre("❌ Cette commande fonctionne uniquement dans les groupes.");

      const action = arg[0]?.toLowerCase();
      const estDeban = action === "del";
      const cible = jid;

      if (!cible) return repondre("❌ Impossible de récupérer l'identifiant du groupe.");

      if (estDeban) {
        const suppression = await Bans.destroy({ where: { id: cible, type: "group" } });
        if (suppression === 0) return repondre("⚠️ Ce groupe n'est pas banni.");
        return repondre(`✅ Groupe débanni avec succès.`);
      } else {
        const [ban] = await Bans.findOrCreate({
          where: { id: cible },
          defaults: { id: cible, type: "group" },
        });

        if (!ban._options.isNewRecord) return repondre("⚠️ Ce groupe est déjà banni !");
        return repondre(`✅ Groupe banni avec succès.`);
      }
    } catch (error) {
      console.error("Erreur lors de l'exécution de la commande bangroup :", error);
      return repondre("❌ Une erreur s'est produite.");
    }
  }
);
