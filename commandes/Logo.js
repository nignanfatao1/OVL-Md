const { ovlcmd } = require("../framework/ovlcmd");
//const maker = require('mumaker');
/*
function addTextproCommand(nom_cmd, text_pro_url, desc) {
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
                return await ovl.sendMessage(ms_org, { text: "Vous devez fournir un texte" }, { quoted: ms } );
            }
            try {
                let logo_url = await maker(text_pro_url, query);
              console.log(logo_url.image);
              console.log(logo_url);
               await ovl.sendMessage(ms_org, { image: { url: logo_url.image }, caption: "\`\`\`Powered By OVL-MD\`\`\`" }, { quoted: ms });
            } catch (error) {
                console.error(`Erreur avec la commande ${nom_cmd}:`, error.message || error);
            }
        }
    );
}

addTextproCommand("deepsea", "https://textpro.me/create-3d-deep-sea-metal-text-effect-online-1053.html", "Créez un effet de texte 3D sur le thème de la mer profonde.");
addTextproCommand("horror", "https://textpro.me/horror-blood-text-effect-online-883.html", "Créez un effet de texte avec du sang pour un style d'horreur.");
addTextproCommand("whitebear", "https://textpro.me/online-black-and-white-bear-mascot-logo-creation-1012.html", "Créez un logo de mascotte de ours noir et blanc.");
addTextproCommand("joker", "https://textpro.me/create-logo-joker-online-934.html", "Créez un logo avec le texte du Joker.");
addTextproCommand("metallic", "https://textpro.me/create-a-metallic-text-effect-free-online-1041.html", "Créez un effet de texte métallique.");
addTextproCommand("steel", "https://textpro.me/steel-text-effect-online-921.html", "Créez un effet de texte en acier.");
addTextproCommand("harrypotter", "https://textpro.me/create-harry-potter-text-effect-online-1025.html", "Créez un effet de texte inspiré de Harry Potter.");
addTextproCommand("underwater", "https://textpro.me/3d-underwater-text-effect-generator-online-1013.html", "Créez un effet de texte 3D sous-marin.");
addTextproCommand("luxury", "https://textpro.me/3d-luxury-gold-text-effect-online-1003.html", "Créez un effet de texte avec de l'or 3D luxe.");
addTextproCommand("glue", "https://textpro.me/create-3d-glue-text-effect-with-realistic-style-986.html", "Créez un effet de texte avec de la colle en 3D.");
addTextproCommand("fabric", "https://textpro.me/fabric-text-effect-online-964.html", "Créez un effet de texte avec un tissu.");
addTextproCommand("toxic", "https://textpro.me/toxic-text-effect-online-901.html", "Créez un effet de texte toxique.");
addTextproCommand("ancient", "https://textpro.me/3d-golden-ancient-text-effect-online-free-1060.html", "Créez un effet de texte doré ancien.");
addTextproCommand("cloud", "https://textpro.me/create-a-cloud-text-effect-on-the-sky-online-1004.html", "Créez un effet de texte dans les nuages.");
addTextproCommand("transformer", "https://textpro.me/create-a-transformer-text-effect-online-1035.html", "Créez un effet de texte inspiré des Transformers.");
addTextproCommand("thunder", "https://textpro.me/online-thunder-text-effect-generator-1031.html", "Créez un effet de texte avec un éclair.");
addTextproCommand("scifi", "https://textpro.me/create-3d-sci-fi-text-effect-online-1050.html", "Créez un effet de texte de science-fiction.");
addTextproCommand("sand", "https://textpro.me/write-in-sand-summer-beach-free-online-991.html", "Créez un effet de texte écrit dans le sable.");
addTextproCommand("rainbow", "https://textpro.me/3d-rainbow-color-calligraphy-text-effect-1049.html", "Créez un effet de texte arc-en-ciel.");
addTextproCommand("pencil", "https://textpro.me/create-pencil-drawing-text-effect-online-999.html", "Créez un effet de texte dessiné au crayon.");
addTextproCommand("neon", "https://textpro.me/create-3d-neon-light-text-effect-online-1028.html", "Créez un effet de texte avec des lumières néon.");
addTextproCommand("magma", "https://textpro.me/create-a-magma-hot-text-effect-online-1030.html", "Créez un effet de texte avec du magma brûlant.");
addTextproCommand("leaves", "https://textpro.me/natural-leaves-text-effect-931.html", "Créez un effet de texte avec des feuilles naturelles.");
addTextproCommand("glitch", "https://textpro.me/create-impressive-glitch-text-effects-online-1027.html", "Créez un effet de texte glitch impressionnant.");
addTextproCommand("discovery", "https://textpro.me/create-space-text-effects-online-free-1042.html", "Créez un effet de texte inspiré de l'espace.");
addTextproCommand("christmas", "https://textpro.me/christmas-tree-text-effect-online-free-1057.html", "Créez un effet de texte inspiré de Noël.");
addTextproCommand("candy", "https://textpro.me/create-christmas-candy-cane-text-effect-1056.html", "Créez un effet de texte avec des cannes de Noël.");
addTextproCommand("1917", "https://textpro.me/1917-style-text-effect-online-980.html", "Créez un effet de texte inspiré du style de 1917.");
addTextproCommand("blackpink", "https://textpro.me/create-blackpink-logo-style-online-1001.html", "Créez un logo inspiré du style Blackpink.");
addTextproCommand("cat", "https://textpro.me/write-text-on-foggy-window-online-free-1015.html#google_vignette", "Créez un effet de texte sur une fenêtre brumeuse.");
addTextproCommand("pottery", "https://textpro.me/create-3d-pottery-text-effect-online-1088.html", "Créez un effet de texte en poterie 3D.");
addTextproCommand("slice", "https://textpro.me/create-light-glow-sliced-text-effect-online-1068.html", "Créez un effet de texte tranché avec lumière et éclat.");
*/

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

ovlcmd(
    {
        nom_cmd: "logo",
        classe: "Logo",
        react: "✨",
        desc: "Génère un logo avec un effet stylisé et l'envoie sur WhatsApp"
    },
    async (ms_org, ovl, cmd_options) => {
        const { arg } = cmd_options;

        // Vérifier si un texte est fourni
        if (!arg || arg.length === 0) {
            return ovl.sendMessage(ms_org, { text: "❌ Veuillez fournir un texte pour générer un logo. Exemple : *logo Salut*" });
        }

        const text = arg.join(" "); // Combine les arguments pour former le texte
        const baseUrl = "https://textpro.me/create-a-magma-hot-text-effect-online-1030.html";

        let response, token, postResponse, imageUrl, imageResponse;

        try {
            // Étape 1 : Obtenir la page initiale
            try {
                 response = await axios.get('https://textpro.me/create-a-magma-hot-text-effect-online-1030.html', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'fr-FR,fr;q=0.9',
                'Cookie': 'PHPSESSID=o3a0cngk34kmn581ajnbr2for7; _ga=GA1.1.1271155986.1732471989'
            }
        });
        console.log("Page récupérée avec succès :", response.data);
    } catch (err) {
        console.error("Erreur lors de la récupération de la page :", err.response?.status || err.message);
            }
            const $ = cheerio.load(response.data);
            token = $('input[name="token"]').attr('value');

            // Vérifier si le token est présent
            if (!token) {
                console.error("Erreur : Token introuvable.");
                return ovl.sendMessage(ms_org, { text: "❌ Impossible de récupérer le token. Réessayez plus tard." });
            }

            // Étape 2 : Soumettre le texte pour générer le logo
            try {
                postResponse = await axios.post(baseUrl, new URLSearchParams({
                    text1: text,
                    token
                }).toString(), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Cookie': response.headers['set-cookie']?.join('; ') || ''
                    }
                });
            } catch (err) {
                console.error("Erreur lors de la soumission du texte :", err);
                return ovl.sendMessage(ms_org, { text: "❌ Une erreur est survenue lors de la soumission du texte." });
            }

            // Étape 3 : Trouver l'URL de l'image générée
            try {
                const resultPage = cheerio.load(postResponse.data);
                imageUrl = resultPage('img').attr('src');

                if (!imageUrl) {
                    console.error("Erreur : URL de l'image introuvable.");
                    return ovl.sendMessage(ms_org, { text: "❌ Impossible de générer le logo. Réessayez plus tard." });
                }
            } catch (err) {
                console.error("Erreur lors de l'analyse de la réponse HTML :", err);
                return ovl.sendMessage(ms_org, { text: "❌ Une erreur est survenue lors de l'analyse de la réponse." });
            }

            // Étape 4 : Télécharger l'image localement
            try {
                imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            } catch (err) {
                console.error("Erreur lors du téléchargement de l'image :", err);
                return ovl.sendMessage(ms_org, { text: "❌ Une erreur est survenue lors du téléchargement de l'image." });
            }

            const outputPath = path.join(__dirname, 'logo.png');
            fs.writeFileSync(outputPath, imageResponse.data);

            // Étape 5 : Envoyer l'image via le bot
            try {
                await ovl.sendMessage(ms_org, {
                    image: { url: outputPath },
                    caption: `✨ Voici votre logo pour : *${text}*`
                });
            } catch (err) {
                console.error("Erreur lors de l'envoi de l'image :", err);
                return ovl.sendMessage(ms_org, { text: "❌ Une erreur est survenue lors de l'envoi de l'image." });
            }
        } catch (globalErr) {
            console.error("Erreur globale lors de l'exécution de la commande logo :", globalErr);
            return ovl.sendMessage(ms_org, { text: "❌ Une erreur inattendue est survenue." });
        }
    }
);
