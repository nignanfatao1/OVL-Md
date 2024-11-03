const { ovlcmd, cmd } = require("../framework/ovlcmd");

ovlcmd(
    {
        nom_cmd: "test",
        classe: "Outils",
        react: "🔅",
        desc: "Test du bot", 
        alias: ["ts", "st"],
    },
    async (ms_org, ovl, commandeOptions) => {
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
        react: "ℹ️",
        desc: "Affiche la liste des commandes avec leurs descriptions",
        alias: ["desc", "help"],
    },
    async (ms_org, ovl, commandeOptions) => {
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
