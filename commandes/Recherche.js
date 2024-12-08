const { ovlcmd, cmd } = require("../framework/ovlcmd");
const gis = require("g-i-s");

ovlcmd(
    {
        nom_cmd: "img",
        classe: "search",
        react: "🔍",
        desc: "Recherche d'images"
    },
    async (ms_org, ovl, cmd_options) => {
      const { arg } = cmd_options;
        const searchTerm = arg.join(" ");
        if (!searchTerm) {
            return ovl.sendMessage(ms_org, { text: "Veuillez fournir un terme de recherche, par exemple : img ovl-Md" });
        }

        gis(searchTerm, async (error, results) => {
            if (error) {
                console.error("Erreur lors de la recherche d'images:", error);
                return ovl.sendMessage(ms_org, { text: "Erreur lors de la recherche d'images." });
            }

            const images = results.slice(0, 5);
            if (images.length === 0) {
                return ovl.sendMessage(ms_org, { text: "Aucune image trouvée pour ce terme de recherche." });
            }

            for (const image of images) {
                try {
                    await ovl.sendMessage(ms_org, {
                        image: { url: image.url },
                        caption: `\`\`\`Powered By OVL-MD\`\`\``
                    });
                } catch (err) {
                    console.error("Erreur lors de l'envoi de l'image:", err);
                }
            }
        });
    }
);

ovlcmd(
    {
        nom_cmd: "horo",
        classe: "search",
        react: "♈",
        desc: "Donne les informations sur l'horoscope du jour."
    },
    async (ms_org, ovl, cmd_options) => {
        const { arg } = cmd_options;
        const signeFr = arg.join(" ").toLowerCase();
        
        // Mappage des signes français vers les signes anglais
        const signesMap = {
            "bélier": "aries",
            "taureau": "taurus",
            "gémeaux": "gemini",
            "cancer": "cancer",
            "lion": "leo",
            "vierge": "virgo",
            "balance": "libra",
            "scorpion": "scorpio",
            "sagittaire": "sagittarius",
            "capricorne": "capricorn",
            "verseau": "aquarius",
            "poissons": "pisces"
        };

        if (!signesMap[signeFr]) {
            return ovl.sendMessage(ms_org, { text: "Signe invalide. Veuillez utiliser un signe valide (ex: Bélier, Taureau, etc.)." });
        }

        const signeEn = signesMap[signeFr];

        try {
            const URL = `https://aztro.sameerkumar.website/?sign=${signeEn}&day=today`;
            
            // Utilisation de axios pour faire la requête HTTP
            const response = await axios.post(URL);

            if (response.status === 200) {
                const json = response.data;
                let textw = "";
                
                // Construction du message avec traduction des données
                textw += `*🌟 Horoscope du jour pour ${signeFr.charAt(0).toUpperCase() + signeFr.slice(1)}*\n\n`;
                textw += `*Date actuelle :* ${json.current_date}.\n`;
                textw += `*Signe :* ${signeFr.charAt(0).toUpperCase() + signeFr.slice(1)}.\n`;
                textw += `*Heure chanceuse :* ${json.lucky_time.trim()}.\n`;
                textw += `*Compatibilité :* ${json.compatibility.trim()}.\n`;
                textw += `*Numéro chanceux :* ${json.lucky_number.trim()}.\n`;
                textw += `*Couleur chanceuse :* ${json.color.trim()}.\n`;
                textw += `*Humeur du jour :* ${json.mood.trim()}.\n`;
                textw += `*Résumé :* ${json.description.trim()}.\n`;

                // Envoi du message
                ovl.sendMessage(ms_org, { text: textw });
            } else {
                ovl.sendMessage(ms_org, { text: "Une erreur s'est produite lors de la récupération de l'horoscope." });
            }
        } catch (e) {
            console.log(e);
            ovl.sendMessage(ms_org, { text: "Une erreur s'est produite." });
        }
    }
);

ovlcmd(
    {
        nom_cmd: "lyrics",
        classe: "search",
        react: "🎵",
        desc: "Cherche les paroles d'une chanson"
    },
    async (ms_org, ovl, cmd_options) => {
        const { arg } = cmd_options;
        const songName = arg.join(" ");
        if (!songName) {
            return ovl.sendMessage(ms_org, { text: 'Veuillez fournir un nom de chanson pour obtenir les paroles.' });
        }

        try {
            let apiUrl = `https://lyrist.vercel.app/api/${encodeURIComponent(songName)}`;
            let response = await axios.get(apiUrl);
            let data = response.data;

            if (data && data.lyrics) {
                await ovl.sendMessage(ms_org, {
                    image: { url: data.image },
                    caption: `*🎵 Titre :* ${data.title}\n*🎶 Paroles :*\n\n${data.lyrics}`
                });
            } else {
                ovl.sendMessage(ms_org, { text: "Désolé, je n'ai pas trouvé les paroles pour cette chanson." });
            }
        } catch (e) {
            console.log(e);
            ovl.sendMessage(ms_org, { text: "Une erreur s'est produite lors de la recherche des paroles." });
        }
    }
);

ovlcmd(
    {
        nom_cmd: "blague",
        classe: "fun",
        react: "😂",
        desc: "Renvoie une blague"
    },
    async (ms_org, ovl) => {
        try {
            let apiUrl = `https://v2.jokeapi.dev/joke/Any?lang=fr`;
            let response = await axios.get(apiUrl);
            let data = response.data;

            if (data.type === 'single') {
                ovl.sendMessage(ms_org, { text: `*Blague du jour :* ${data.joke}` });
            } else if (data.type === 'twopart') {
                ovl.sendMessage(ms_org, { text: `*Blague du jour :* ${data.setup}\n\n*Réponse :* ${data.delivery}` });
            } else {
                ovl.sendMessage(ms_org, { text: "Désolé, je n'ai pas trouvé de blague à vous raconter." });
            }
        } catch (error) {
            ovl.sendMessage(ms_org, { text: "Une erreur s'est produite lors de la récupération de la blague." });
        }
    }
);

ovlcmd(
    {
        nom_cmd: "citation",
        classe: "fun",
        react: "💬",
        desc: "Renvoie une citation"
    },
    async (ms_org, ovl) => {
        try {
            let apiUrl = `https://api.frankfurter.app/citations/random`;
            let response = await axios.get(apiUrl);
            let data = response.data;

            if (data.quote) {
                ovl.sendMessage(ms_org, { text: `*Citation du jour :*\n"${data.quote}"\n\n*Auteur :* ${data.author}` });
            } else {
                ovl.sendMessage(ms_org, { text: "Désolé, je n'ai pas trouvé de citation à vous donner." });
            }
        } catch (error) {
            ovl.sendMessage(ms_org, { text: "Une erreur s'est produite lors de la récupération de la citation." });
        }
    }
);

