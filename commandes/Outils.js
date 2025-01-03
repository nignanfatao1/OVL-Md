const { ovlcmd, cmd } = require("../framework/ovlcmd");
const config = require("../set");
const { translate } = require('@vitalets/google-translate-api');
const prefixe = config.PREFIXE;

ovlcmd(
    {
        nom_cmd: "test",
        classe: "Outils",
        react: "🌟",
        desc: "Tester la connectivité du bot"
    },
    async (ms_org, ovl, cmd_options) => {
        try {
            const mess = `🌐 Bienvenue sur *OVL-MD*, votre bot WhatsApp multi-device.🔍 Tapez *${prefixe}menu* pour voir toutes les commandes disponibles.\n> ©2024 OVL-MD By *AINZ*`;
            const img = 'https://telegra.ph/file/8173c870f9de5570db8c3.jpg';
            await ovl.sendMessage(ms_org, { 
                image: { url: img }, 
                caption: mess 
            });
        } catch (error) {
            console.error("Erreur lors de l'envoi du message de test :", error.message || error);
        }
    }
);


ovlcmd(
    {
        nom_cmd: "description",
        classe: "Outils",
        desc: "Affiche la liste des commandes avec leurs descriptions ou les détails d'une commande spécifique.",
        alias: ["desc", "help"],
    },
    async (ms_org, ovl, cmd_options) => {
        try {
            const { arg } = cmd_options;
            const commandes = cmd;

            if (arg.length) {
                const recherche = arg[0].toLowerCase();
                const commandeTrouvee = commandes.find(
                    (c) =>
                        c.nom_cmd.toLowerCase() === recherche ||
                        c.alias.some((alias) => alias.toLowerCase() === recherche)
                );

                if (commandeTrouvee) {
                    const message = `📜 *Détails de la commande :*\n\n` +
                        `Nom : *${commandeTrouvee.nom_cmd}*\n` +
                        `Alias : [${commandeTrouvee.alias.join(", ")}]\n` +
                        `Description : ${commandeTrouvee.desc}`;
                    return await ovl.sendMessage(ms_org, { text: message });
                } else {
                    return await ovl.sendMessage(ms_org, {
                        text: `❌ Commande ou alias "${recherche}" introuvable. Vérifiez et réessayez.`,
                    });
                }
            }

            let descriptionMsg = "📜 *Liste des commandes disponibles :*\n\n";
            commandes.forEach((cmd) => {
                descriptionMsg += `Nom : *${cmd.nom_cmd}*\nAlias : [${cmd.alias.join(", ")}]\nDescription : ${cmd.desc}\n\n`;
            });

            await ovl.sendMessage(ms_org, { text: descriptionMsg });
        } catch (error) {
            console.error("Erreur lors de l'affichage des descriptions :", error.message || error);
            await ovl.sendMessage(ms_org, { text: "Une erreur s'est produite lors de l'affichage des descriptions." });
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
        try {
            const seconds = process.uptime();
            const j = Math.floor(seconds / 86400);
            const h = Math.floor((seconds / 3600) % 24);
            const m = Math.floor((seconds % 3600) / 60);
            const s = Math.floor(seconds % 60);
            let uptime = '';
            if (j > 0) uptime += `${j}J `;
            if (h > 0) uptime += `${h}H `;
            if (m > 0) uptime += `${m}M `;
            if (s > 0) uptime += `${s}S`;

            const lien = `${config.MENU}`;
            const commandes = cmd;
            let menu = `╭───❏ 🄾🅅🄻 🄼🄳 ❏
│ ✿ Prefixe => ${config.PREFIXE}
│ ✿ Owner => ${config.NOM_OWNER}
│ ✿ Commandes => ${commandes.length}
│ ✿ Uptime => ${uptime.trim()}
│ ✿ Développeur => AINZ
╰══════════════⊷\n\n`;

            // Regrouper les commandes par classe
            const cmd_classe = {};
            commandes.forEach((cmd) => {
                if (!cmd_classe[cmd.classe]) {
                    cmd_classe[cmd.classe] = [];
                }
                cmd_classe[cmd.classe].push(cmd);
            });

            // Trier chaque classe par nom_cmd
            for (const [classe, cmds] of Object.entries(cmd_classe)) {
                cmd_classe[classe] = cmds.sort((a, b) =>
                    a.nom_cmd.localeCompare(b.nom_cmd, undefined, { numeric: true })
                );
            }

            // Générer le menu
            for (const [classe, cmds] of Object.entries(cmd_classe)) {
                menu += `╭───❏ ${classe} ❏\n`;
                cmds.forEach((cmd) => {
                    menu += `│☞ ${cmd.nom_cmd}\n`;
                });
                menu += `╰═══════════════⊷\n\n`;
            }

            menu += "> ©2024 OVL-MD WA-BOT";
            await ovl.sendMessage(ms_org, { image: { url: lien }, caption: menu });
        } catch (error) {
            console.error("Erreur lors de la génération du menu :", error);
        }
    }
);


ovlcmd(
    {
        nom_cmd: "vv",
        classe: "Outils",
        react: "👀",
        desc: "Affiche un message envoyé en vue unique",
    },
    async (_ms_org, ovl, _cmd_options) => {
        const { ms, msg_Repondu, repondre } = _cmd_options;

        if (!msg_Repondu) {
            return repondre("Veuillez mentionner un message en vue unique.");
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

ovlcmd(
    {
        nom_cmd: "ping",
        classe: "Outils",
        react: "🏓",
        desc: "Mesure la latence du bot.",
    },
    async (ms_org, ovl) => {
        const start = Date.now();
        await ovl.sendMessage(ms_org, { text: "Ping..." });
        const end = Date.now();
        const latency = end - start;
        await ovl.sendMessage(ms_org, { text: `🏓 Pong ! Latence : ${latency}ms` });
    }
);

ovlcmd(
    {
        nom_cmd: "uptime",
        classe: "Outils",
        react: "⏱️",
        desc: "Affiche le temps de fonctionnement du bot.",
        alias: ["upt"],
    },
    async (ms_org, ovl) => {
        const seconds = process.uptime();
        const j = Math.floor(seconds / 86400);
        const h = Math.floor((seconds / 3600) % 24);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        let uptime = '';
        if (j > 0) uptime += `${j}J `;
        if (h > 0) uptime += `${h}H `;
        if (m > 0) uptime += `${m}M `;
        if (s > 0) uptime += `${s}S`;
        await ovl.sendMessage(ms_org, { text: `⏳ Temps de fonctionnement : ${uptime}` });
    }
);

ovlcmd(
    {
        nom_cmd: "translate",
        classe: "Outils",
        react: "🌍",
        desc: "Traduit un texte dans la langue spécifiée.",
        alias: ["trt"],
    },
    async (ms_org, ovl, cmd_options) => {
        const { arg, ms, msg_Repondu } = cmd_options;
        let lang, text;

        if (msg_Repondu && arg.length === 1) {
            lang = arg[0];
            text = msg_Repondu.conversation || msg_Repondu.extendedTextMessage?.text;
        } else if (arg.length >= 2) {
            lang = arg[0];
            text = arg.slice(1).join(" ");
        } else {
            return await ovl.sendMessage(ms_org, { text: `Utilisation : ${prefixe}translate <langue> <texte> ou répondre à un message avec : ${prefixe}translate <langue>` });
        }

        try {
            const result = await translate(text, { to: lang });
            await ovl.sendMessage(ms_org, { text: `🌐Traduction (${lang}) :\n${result.text}` }, { quoted: ms });
        } catch (error) {
            console.error("Erreur lors de la traduction:", error);
            await ovl.sendMessage(ms_org, { text: "Erreur lors de la traduction. Vérifiez la langue et le texte fournis." });
        }
    }
);
