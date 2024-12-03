const { ovlcmd } = require("../framework/ovlcmd");
const axios = require("axios");
const ytsr = require('@distube/ytsr');

ovlcmd(
    {
        nom_cmd: "song",
        classe: "Téléchargement",
        react: "🎵",
        desc: "Télécharge une chanson depuis YouTube avec un terme de recherche ou un lien YouTube",
        alias: ["play"],
    },
    async (ms_org, ovl, cmd_options) => {
        const { repondre, arg, ms } = cmd_options;

        if (!arg.length) {
            return await ovl.sendMessage(ms_org, { text: "Veuillez spécifier un titre de chanson ou un lien YouTube." });
        }

        const query = arg.join(" ");
        const isYouTubeLink = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(arg[0]);

        try {
            let videoInfo;

            if (isYouTubeLink) {
                videoInfo = { url: query }; // Si c'est un lien, on prend directement l'URL
            } else {
                const searchResults = await ytsr(query, { limit: 1 });
                if (searchResults.items.length === 0) {
                    return await ovl.sendMessage(ms_org, { text: "Aucun résultat trouvé pour cette recherche." });
                }
                const song = searchResults.items[0];
                videoInfo = {
                    url: song.url,
                    title: song.name,
                    views: song.views,
                    duration: song.duration,
                    thumbnail: song.thumbnail
                };
            }

            const caption = `╭─── 〔 OVL-MD SONG 〕 ──⬣
⬡ Titre: ${videoInfo.title}
⬡ URL: ${videoInfo.url}
⬡ Vues: ${videoInfo.views}
⬡ Durée: ${videoInfo.duration}
╰───────────────────⬣`;

            await ovl.sendMessage(ms_org, { image: { url: videoInfo.thumbnail }, caption: caption }); 
                    const audioResponse = await axios.get(`https://api-znjo.onrender.com/api/v2/ytmp3?url=${videoInfo.url}?si=EmeS9fJvS_OkDk7p&apikey=ln5mhaiphf7je7n6aanq`, {
                        responseType: 'arraybuffer'
                    });

                    await ovl.sendMessage(ms_org, {
                        audio: Buffer.from(audioResponse.data),
                        mimetype: 'audio/mp4',
                        fileName: `${videoInfo.title}.mp3`
                    }, { quoted: ms });
        } catch (error) {
            console.error("Erreur générale :", error.message || error);
            await ovl.sendMessage(ms_org, { text: "Une erreur est survenue lors du traitement de votre commande." });
        }
    }
);


ovlcmd(
    {
        nom_cmd: "video",
        classe: "Téléchargement",
        react: "🎥",
        desc: "Télécharge une vidéo depuis YouTube avec un terme de recherche ou un lien YouTube"
    },
    async (ms_org, ovl, cmd_options) => {
        const { repondre, arg, ms } = cmd_options;

        if (!arg.length) {
            return await ovl.sendMessage(ms_org, { text: "Veuillez spécifier un titre de vidéo ou un lien YouTube." });
        }

        const query = arg.join(" ");
        const isYouTubeLink = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(arg[0]);

        try {
            let videoInfo;

            if (isYouTubeLink) {
                videoInfo = { url: query }; // Si c'est un lien, on prend directement l'URL
            } else {
                const searchResults = await ytsr(query, { limit: 1 });
                if (searchResults.items.length === 0) {
                    return await ovl.sendMessage(ms_org, { text: "Aucun résultat trouvé pour cette recherche." });
                }
                const video = searchResults.items[0];
                videoInfo = {
                    url: video.url,
                    title: video.name,
                    views: video.views,
                    duration: video.duration,
                    thumbnail: video.thumbnail
                };
            

            const caption = `╭─── 〔 OVL-MD VIDEO 〕 ──⬣
⬡ Titre: ${videoInfo.title}
⬡ URL: ${videoInfo.url}
⬡ Vues: ${videoInfo.views}
⬡ Durée: ${videoInfo.duration}
╰───────────────────⬣`;

            await ovl.sendMessage(ms_org, { image: { url: videoInfo.thumbnail }, caption: caption });
            };
            // Téléchargement de la vidéo
            const videoResponse = await axios.get(`https://api-znjo.onrender.com/api/v2/ytmp4?url=${videoInfo.url}?si=EmeS9fJvS_OkDk7p&apikey=ln5mhaiphf7je7n6aanq`, {
                responseType: 'arraybuffer'
            });

            await ovl.sendMessage(ms_org, {
                video: Buffer.from(videoResponse.data),
                mimetype: 'video/mp4',
                fileName: `${videoInfo.title}.mp4`
            }, { quoted: ms });

        } catch (error) {
            console.error("Erreur lors du téléchargement de la vidéo :", error.message || error);
            await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement de la vidéo." });
        }
    }
);

ovlcmd(
    {
        nom_cmd: "tiktok",
        classe: "Téléchargement",
        react: "🎥",
        desc: "Télécharge une vidéo TikTok depuis un lien",
        alias: ["ttdl"],
    },
    async (ms_org, ovl, cmd_options) => {
        const { arg, ms } = cmd_options;
        if (!arg.length) {
            return await ovl.sendMessage(ms_org, { text: "Veuillez spécifier un lien TikTok." });
        }
        const url = arg[0];
        try {
            const response = await axios.get(`https://api-znjo.onrender.com/api/tiktokv1?url=${url}&apikey=ln5mhaiphf7je7n6aanq`);
            const videoUrl = response.data.result || response.data.link;
            await ovl.sendMessage(ms_org, { video: { url: videoUrl }, caption: `\`\`\`Powered By OVL-MD\`\`\``});
        } catch (error) {
            console.error("Erreur TikTok Downloader :", error.message);
            await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement de la vidéo TikTok." });
        }
    }
);

ovlcmd(
    {
        nom_cmd: "facebook",
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
        const url = arg[0];
        try {
            const response = await axios.get(`https://api-znjo.onrender.com/api/facebook?url=${url}&apikey=ln5mhaiphf7je7n6aanq`);
            const videoUrl = response.data.result || response.data.link;
            await ovl.sendMessage(ms_org, { video: { url: videoUrl }, caption: `\`\`\`Powered By OVL-MD\`\`\``});
        } catch (error) {
            console.error("Erreur Facebook Downloader :", error.message);
            await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement de la vidéo Facebook." });
        }
    }
);

ovlcmd(
    {
        nom_cmd: "twitter",
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
        const url = arg[0];
        try {
            const response = await axios.get(`https://api-znjo.onrender.com/api/twitterdl?url=${url}&apikey=ln5mhaiphf7je7n6aanq`);
            const videoUrl = response.data.result || response.data.link;
            await ovl.sendMessage(ms_org, { video: { url: videoUrl }, caption:`\`\`\`Powered By OVL-MD\`\`\`` });
        } catch (error) {
            console.error("Erreur Twitter Downloader :", error.message);
            await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement de la vidéo Twitter." });
        }
    }
);

ovlcmd(
    {
        nom_cmd: "instagram",
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
        const url = arg[0];
        try {
            const response = await axios.get(`https://api-znjo.onrender.com/api/v1/igdl?url=${url}&apikey=ln5mhaiphf7je7n6aanq`);
            const mediaUrl = response.data.result || response.data.link;
            const type = response.data.type || "media";
            if (type === "video") {
                await ovl.sendMessage(ms_org, { video: { url: mediaUrl }, caption: `\`\`\`Powered By OVL-MD\`\`\`` });
            } else {
                await ovl.sendMessage(ms_org, { image: { url: mediaUrl }, caption: `\`\`\`Powered By OVL-MD\`\`\`` });
            }
        } catch (error) {
            console.error("Erreur Instagram Downloader :", error.message);
            await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement du média Instagram." });
        }
    }
);
