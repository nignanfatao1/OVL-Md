const { ovlcmd } = require("../framework/ovlcmd");
const mumaker = require('mumaker');

function addTextproCommand(nom_cmd, text_pro_url, desc, type) {
    ovlcmd(
        {
            nom_cmd: nom_cmd,
            classe: "Logo",
            react: "✨",
            desc: desc
        },
        async (ms_org, ovl, cmd_options) => {
            const { arg, ms } = cmd_options;
            const query = arg.join(' ');

            if (!query) {
                return await ovl.sendMessage(
                    ms_org,
                    { text: "Vous devez fournir un texte." },
                    { quoted: ms }
                );
            }

            try {
                let logo_url;

                switch (type) {
                    case 1:
                        // Type 1: Un seul mot ou texte
                        if (query.includes(';')) {
                            return await ovl.sendMessage(
                                ms_org,
                                { text: "Veuillez fournir un seul mot ou texte sans point-virgule (;) pour cette commande." },
                                { quoted: ms }
                            );
                        }
                        logo_url = await mumaker.ephoto(text_pro_url, query);
                        break;

                    case 2:
                        // Type 2: Deux mots ou plus séparés par des point-virgules (;)
                        const textParts = query.split(';');
                        if (textParts.length < 2) {
                            return await ovl.sendMessage(
                                ms_org,
                                { text: "Veuillez fournir exactement deux textes séparés par un point-virgule (;), par exemple : Salut;Ça va." },
                                { quoted: ms }
                            );
                        }
                        logo_url = await mumaker.ephoto(text_pro_url, textParts);
                        break;

                    default:
                        throw new Error(`Type ${type} non supporté.`);
                }

                // Envoyer l'image générée
                await ovl.sendMessage(
                    ms_org,
                    {
                        image: { url: logo_url.image },
                        caption: "\`\`\`Powered By OVL-MD\`\`\`"
                    },
                    { quoted: ms }
                );
            } catch (error) {
                console.error(`Erreur avec la commande ${nom_cmd}:`, error.message || error);
                await ovl.sendMessage(
                    ms_org,
                    { text: `Une erreur est survenue lors de la génération du logo : ${error.message}` },
                    { quoted: ms }
                );
            }
        }
    );
}

addTextproCommand(
    "dragonball", // Nom de la commande
    "https://ephoto360.com/tao-hieu-ung-chu-phong-cach-dragon-ball-truc-tuyen-1000.html", // URL du style
    "Créer un logo Dragon Ball", // Description de la commande
    1 // Type : cette commande accepte un seul mot ou texte
);
