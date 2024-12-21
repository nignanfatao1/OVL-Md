const { ovlcmd } = require("../framework/ovlcmd");
const axios = require("axios");
const ytsr = require('@distube/ytsr');

// Constantes API globales
const API_URL = 'https://api-rv21.onrender.com';
const API_KEY = '9zue2v4aembd292lhfrwqo';

// Fonction pour effectuer un téléchargement avec tentatives multiples
async function attemptDownload(url, maxRetries = 5) {
    let attempts = 0;
    while (attempts < maxRetries) {
        try {
            console.log(`Tentative ${attempts + 1} de téléchargement...`);
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            return response.data;
        } catch (error) {
            attempts++;
            console.error(`Erreur tentative ${attempts}:`, error.message || error);
            if (attempts >= maxRetries) throw new Error('Échec après plusieurs tentatives.');
        }
    }
}

// Commande Song
ovlcmd(
    {
        nom_cmd: "song",
        classe: "Téléchargement",
        react: "🎵",
        desc: "Télécharge une chanson depuis YouTube avec un terme de recherche ou un lien YouTube",
        alias: ["play"],
    },
    async (ms_org, ovl, cmd_options) => {
        const { arg, ms } = cmd_options;
        if (!arg.length) {
            return await ovl.sendMessage(ms_org, {
                text: "Veuillez spécifier un titre de chanson ou un lien YouTube.",
            });
        }

        const query = arg.join(" ");
        try {
            const searchResults = await ytsr(query, { limit: 1 });
            if (searchResults.items.length === 0) {
                return await ovl.sendMessage(ms_org, { text: "Aucun résultat trouvé." });
            }

            const song = searchResults.items[0];
            const videoInfo = {
                url: song.url,
                title: song.name,
                views: song.views,
                duration: song.duration,
                thumbnail: song.thumbnail,
            };

            const caption = `╭─── 〔 OVL-MD SONG 〕 ──⬣\n⬡ Titre: ${videoInfo.title}\n⬡ URL: ${videoInfo.url}\n⬡ Vues: ${videoInfo.views}\n⬡ Durée: ${videoInfo.duration}\n╰───────────────────⬣`;

            await ovl.sendMessage(ms_org, { image: { url: videoInfo.thumbnail }, caption });

            const downloadUrl = `${API_URL}/api/v2/ytmp3?url=${videoInfo.url}&apikey=${API_KEY}`;
            const audioBuffer = await attemptDownload(downloadUrl);

            await ovl.sendMessage(ms_org, {
                audio: Buffer.from(audioBuffer),
                mimetype: 'audio/mp4',
                fileName: `${videoInfo.title}.mp3`,
            }, { quoted: ms });
        } catch (error) {
            console.error("Erreur Song Downloader:", error.message);
            await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement." });
        }
    }
);
// Commande 1: Recherche et téléchargement de vidéo depuis YouTube
ovlcmd(
    {
        nom_cmd: "video",
        classe: "Téléchargement",
        react: "🎥",
        desc: "Télécharge une vidéo depuis YouTube avec un terme de recherche ou un lien YouTube",
    },
    async (ms_org, ovl, cmd_options) => {
        const { repondre, arg, ms } = cmd_options;

        if (!arg.length) {
            return await ovl.sendMessage(ms_org, {
                text: "Veuillez spécifier un titre de vidéo ou un lien YouTube.",
            });
        }

        const query = arg.join(" ");
        try {
            const searchResults = await ytsr(query, { limit: 1 });
            if (searchResults.items.length === 0) {
                return await ovl.sendMessage(ms_org, { text: "Aucun résultat trouvé pour cette recherche." });
            }

            const video = searchResults.items[0];
            const videoInfo = {
                url: video.url,
                title: video.name,
                views: video.views,
                duration: video.duration,
                thumbnail: video.thumbnail,
            };

            const caption = `╭─── 〔 OVL-MD VIDEO 〕 ──⬣\n⬡ Titre: ${videoInfo.title}\n⬡ URL: ${videoInfo.url}\n⬡ Vues: ${videoInfo.views}\n⬡ Durée: ${videoInfo.duration}\n╰───────────────────⬣`;

            await ovl.sendMessage(ms_org, {
                image: { url: videoInfo.thumbnail },
                caption: caption,
            });
            const url = `${API_URL}/api/v2/ytmp4?url=${videoInfo.url}&apikey=${API_KEY}`;
            const videoBuffer = await attemptDownload(url);
            await ovl.sendMessage(
                ms_org,
                {
                    video: Buffer.from(videoBuffer),
                    mimetype: 'video/mp4',
                    fileName: `${videoInfo.title}.mp4`,
                    caption: "```Powered By OVL-MD```",
                },
                { quoted: ms }
            );
        } catch (error) {
            await ovl.sendMessage(ms_org, {
                text: "Une erreur est survenue lors du traitement de votre commande.",
            });
        }
    }
);

// Commande 2: Téléchargement d'audio YouTube depuis un lien
ovlcmd(
    {
        nom_cmd: "ytmp3",
        classe: "Téléchargement",
        react: "🎵",
        desc: "Télécharge un audio YouTube depuis un lien",
    },
    async (ms_org, ovl, cmd_options) => {
        const { arg, ms } = cmd_options;

        if (!arg.length) {
            return await ovl.sendMessage(ms_org, {
                text: "Veuillez spécifier un lien YouTube.",
            });
        }

        const url = `${API_URL}/api/v2/ytmp3?url=${arg.join(" ")}&apikey=${API_KEY}`;

        try {
            const audioBuffer = await attemptDownload(url);
            await ovl.sendMessage(
                ms_org,
                {
                    audio: Buffer.from(audioBuffer),
                    mimetype: 'audio/mp4',
                    fileName: `audio.mp3`,
                    caption: "```Powered By OVL-MD```",
                },
                { quoted: ms }
            );
        } catch (error) {
            await ovl.sendMessage(ms_org, {
                text: "Erreur lors du téléchargement de l'audio YouTube.",
            });
        }
    }
);

// Commande 3: Téléchargement de vidéo YouTube depuis un lien
ovlcmd(
    {
        nom_cmd: "ytmp4",
        classe: "Téléchargement",
        react: "🎥",
        desc: "Télécharge une vidéo YouTube depuis un lien",
    },
    async (ms_org, ovl, cmd_options) => {
        const { arg, ms } = cmd_options;

        if (!arg.length) {
            return await ovl.sendMessage(ms_org, {
                text: "Veuillez spécifier un lien YouTube.",
            });
        }

        const url = `${API_URL}/api/v2/ytmp4?url=${arg.join(" ")}&apikey=${API_KEY}`;

        try {
            const videoBuffer = await attemptDownload(url);
            await ovl.sendMessage(
                ms_org,
                {
                    video: Buffer.from(videoBuffer),
                    mimetype: 'video/mp4',
                    fileName: `video.mp4`,
                    caption: "```Powered By OVL-MD```",
                },
                { quoted: ms }
            );
        } catch (error) {
            await ovl.sendMessage(ms_org, {
                text: "Erreur lors du téléchargement de la vidéo YouTube.",
            });
        }
    }
);

// Commande TikTok
ovlcmd(
    {
        nom_cmd: "tiktokdl",
        classe: "Téléchargement",
        react: "🎥",
        desc: "Télécharge une vidéo TikTok depuis un lien",
        alias: ["tikdl"],
    },
    async (ms_org, ovl, cmd_options) => {
        const { arg, ms } = cmd_options;
        if (!arg.length) {
            return await ovl.sendMessage(ms_org, { text: "Veuillez spécifier un lien TikTok." });
        }
        const url = `${API_URL}/api/tiktokv2?url=${arg.join(" ")}&apikey=${API_KEY}`;

        try {
            const videoBuffer = await attemptDownload(url);
            await ovl.sendMessage(ms_org, {
                video: Buffer.from(videoBuffer),
                mimetype: 'video/mp4',
                fileName: 'video.mp4',
                caption: "```Powered By OVL-MD```",
            }, { quoted: ms });
        } catch (error) {
            console.error("Erreur TikTok Downloader:", error.message);
            await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement de la vidéo TikTok." });
        }
    }
);

// Commande Facebook
ovlcmd(
    {
        nom_cmd: "facebookdl",
        classe: "Téléchargement",
        react: "📘",
        desc: "Télécharge une vidéo Facebook depuis un lien",
        alias: ["fbdl"],
    },
    async (ms_org, ovl, cmd_options) => {
        const { arg, ms } = cmd_options;
        if (!arg.length) {
            return await ovl.sendMessage(ms_org, { text: "Veuillez spécifier un lien Facebook." });
        }
        const url = `${API_URL}/api/facebook?url=${arg.join(" ")}&apikey=${API_KEY}`;

        try {
            const response = await axios.get(url);
            const videoUrl = response?.data?.resultado?.data;
            if (!videoUrl) throw new Error("Lien vidéo manquant.");

            await ovl.sendMessage(ms_org, {
                video: { url: videoUrl },
                mimetype: 'video/mp4',
                fileName: 'video.mp4',
                caption: "```Powered By OVL-MD```",
            }, { quoted: ms });
        } catch (error) {
            console.error("Erreur Facebook Downloader:", error.message);
            await ovl.sendMessage(ms_org, { text: `Erreur lors du téléchargement : ${error.message}` });
        }
    }
);

// Commande Twitter
ovlcmd(
    {
        nom_cmd: "twitterdl",
        classe: "Téléchargement",
        react: "🐦",
        desc: "Télécharge une vidéo Twitter depuis un lien",
        alias: ["twtdl"],
    },
    async (ms_org, ovl, cmd_options) => {
        const { arg, ms } = cmd_options;
        if (!arg.length) {
            return await ovl.sendMessage(ms_org, { text: "Veuillez spécifier un lien Twitter." });
        }
        const url = `${API_URL}/api/twitterdl?url=${arg.join(" ")}&apikey=${API_KEY}`;

        try {
            const response = await axios.get(url);
            const media = response.data.resultado.media.find(item => item.type === 'video');
            if (!media) throw new Error("Aucune vidéo trouvée.");

            await ovl.sendMessage(ms_org, {
                video: { url: media.url },
                mimetype: 'video/mp4',
                fileName: 'video.mp4',
                caption: "```Powered By OVL-MD```",
            }, { quoted: ms });
        } catch (error) {
            console.error("Erreur Twitter Downloader:", error.message);
            await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement." });
        }
    }
);


/*ovlcmd(
    {
        nom_cmd: "instagramdl",
        classe: "Téléchargement",
        react: "📷",
        desc: "Télécharge une vidéo ou une image Instagram depuis un lien",
        alias: ["igdl"],
    },
    async (ms_org, ovl, cmd_options) => {
        const { arg, ms } = cmd_options;
        if (!arg.length) {
            return await ovl.sendMessage(ms_org, { text: "Veuillez spécifier un lien Instagram." });
        }
        const url = arg.join(" ");
        try {
            const response = await axios.get(`https://api-rv21.onrender.com/api/v1/igdl?url=${url}&apikey=9zue2v4aembd292lhfrwqo`, {
                responseType: 'arraybuffer'});
            const type = response.data.type || "media";
            if (type === "video") {
                await ovl.sendMessage(ms_org, { video: Buffer.from(response.data),
                                           mimetype: 'video/mp4',
                                           fileName: 'video.mp4',
                                           caption: `\`\`\`Powered By OVL-MD\`\`\``
                                           }, { quoted: ms });
                } else {
                 await ovl.sendMessage(ms_org, { video: Buffer.from(response.data),
                                           mimetype: 'image/png',
                                           fileName: 'image.png',
                                           caption: `\`\`\`Powered By OVL-MD\`\`\``
                                           }, { quoted: ms });
            }
        } catch (error) {
            console.error("Erreur Instagram Downloader :", error.message);
            await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement du média Instagram." });
        }
    }
);*/
