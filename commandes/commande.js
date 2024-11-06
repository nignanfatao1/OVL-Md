const { ovlcmd, cmd } = require("../framework/ovlcmd");
const conf = require("../sérieux");

ovlcmd(
    {
        nom_cmd: "test",
        classe: "Outils",
        react: "🔅",
        desc: "Test du bot", 
        alias: ["ts", "st"],
    },
    async (ms_org, ovl, cmd_options) => {
        try {
            const varmess = `👋 Salut! Je me nomme *OVL-MD*.\nJe suis un bot WhatsApp multi-device développé par *Fatao*.`;
            const img = 'https://telegra.ph/file/8173c870f9de5570db8c3.jpg';
            await ovl.sendMessage(ms_org, { 
                image: { url: img }, 
                caption: varmess 
            });
        } catch (error) {
            console.error("Erreur lors de l'envoi du message :", error.message || error);
        }
    }
);


ovlcmd(
    {
        nom_cmd: "description",
        classe: "Outils",
        desc: "Affiche la liste des commandes avec leurs descriptions",
        alias: ["desc", "help"],
    },
    async (ms_org, ovl, cmd_options) => {
        try {
            // Récupérer la liste des commandes enregistrées
            const commandes = cmd;
            
            // Construire le message de description
            let descriptionMsg = "📜 *Liste des commandes disponibles :*\n\n";
            commandes.forEach(cmd => {
                descriptionMsg += `nom commande: *${cmd.nom_cmd}*\nAlias: [${cmd.alias.join(", ")}]\ndescription: ${cmd.desc}\n\n`;
            });

            // Envoyer la liste des commandes
            await ovl.sendMessage(ms_org, { text: descriptionMsg });
        } catch (error) {
            console.error("Erreur lors de l'affichage des descriptions :", error.message || error);
        }
    }
);

ovlcmd(
    {
        nom_cmd: "menu",
        classe: "Outils",
        react: "🔅",
        desc: "affiche le menu du bot",
    },
    async (ms_org, ovl, cmd_options) => {
        const startTime = cmd_options;
        try {
            const uptimeMs = Date.now() - startTime;
            const s = Math.floor((uptimeMs / 1000) % 60);
            const m = Math.floor((uptimeMs / (1000 * 60)) % 60);
            const h = Math.floor((uptimeMs / (1000 * 60 * 60)) % 24);
            const j = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));
            
            let uptime = `${j} Jour, ${h} Heures, ${m} Minutes, ${s} Secondes`;
            const lien = "https://telegra.ph/file/4d918694f786d7acfa3bd.jpg";
            const commandes = cmd;
            let menu = `╭───❏ 🄾🅅🄻 🄼🄳 ❏
│ ✿ Prefixe => ${conf.prefixe}
│ ✿ Owner => ${conf.owner_name}
│ ✿ Commandes => ${commandes.length}
│ ✿ Uptime => ${uptime}
│ ✿ Développeur => Ainz
╰══════════════⊷\n\n`;
 const cmd_classe = {};
            commandes.forEach((cmd) => {
                if (!cmd_classe[cmd.classe]) {
                    cmd_classe[cmd.classe] = [];
                }
                cmd_classe[cmd.classe].push(cmd);
            });
            for (const [classe, cmds] of Object.entries(cmd_classe)) {
                menu += `╭───❏ ${classe} ❏\n`;
                cmds.forEach((cmd) => {
                    menu += `│☞ ${cmd.nom_cmd}\n`;
                });
                menu += `╰═══════════════⊷\n\n`;
            }

            menu += "> ©2024 OVL-MD WA-BOT By Ainz";
            await ovl.sendMessage(ms_org, { image: { url: lien }, caption: menu });
        } catch (error) {
            console.error("Erreur lors de la génération du menu :", error);
             }
    }
);
