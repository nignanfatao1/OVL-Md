const { ovlcmd } = require("../framework/ovlcmd");

ovlcmd(
    {
        nomCom: "test",
        reaction: "🔅",
        nomFichier: __filename
    },
    async (dest, ovl, commandeOptions) => {
        try {
            let z = 'Salut👋 je me nomme *OVL-MD* \n\n ' + 'je suis un bot Whatsapp Multi-device';
            let d = ' developpé par *Fatao*';
            let varmess = z + d;
            var img = 'https://telegra.ph/file/8173c870f9de5570db8c3.jpg';
            await ovl.sendMessage(dest, { image: { url: img }, caption: varmess });
            //console.log("montest")
        } catch (error) {
            console.error("Erreur lors de l'envoi du message :", error);
        }
    }
);
//console.log("mon test");

ovlcmd(
    {
        nomCom: "tagall",
        categorie: "Groupe",
        reaction: "📣"
    },
    async (dest, ovl, commandeOptions) => {
        try {
            const { ms, repondre, arg, verifGroupe, nomGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser } = commandeOptions;

            if (!verifGroupe) {
                repondre("❌ Commande réservée aux groupes");
                return;
            }

            let mess = '';
            let membresGroupe = verifGroupe ? await infosGroupe.participants : "";
            let tag = `╔═════════════════╗
║ 🄾🅅🄻-🄼🄳 🅃🄰🄶🄰🄻🄻
║👤 Auteur : *${nomAuteurMessage}* 
║💬 Message : *${mess}*\n\n`;

           // tag += `╔═════════════════╗\n`;
            let emoji = ['🔅', '💤', '🔷', '❌', '✔️', '🥱', '⚙️', '🀄', '🎊', '🏀', '🙏', '🎧', '⛔️', '🔋','🏮','🎐','🦦'];
            let random = Math.floor(Math.random() * emoji.length);

            for (const membre of membresGroupe) {
                tag += `║${emoji[random]} @${membre.id.split("@")[0]}\n`;
            }
            tag += `╚═════════════════╝\n`;

            if (verifAdmin) {
                await ovl.sendMessage(dest, { text: tag, mentions: membresGroupe.map((i) => i.id) }, { quoted: ms });
            } else {
                repondre('Commande utilisable seulement par les admins du groupe');
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi du message :", error);
        }
    }
);
