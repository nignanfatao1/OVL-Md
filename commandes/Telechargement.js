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

            let attempt = 0;
            let success = false;

            while (attempt < 3 && !success) {
                try {
                    // Téléchargement de l'audio
                    const audioResponse = await axios.get(`https://ironman.koyeb.app/ironman/dl/yta?url=${videoInfo.url}?si=EmeS9fJvS_OkDk7p&apikey=ln5mhaiphf7je7n6aanq`, {
                        responseType: 'arraybuffer'
                    });

                    await ovl.sendMessage(ms_org, {
                        audio: Buffer.from(audioResponse.data),
                        mimetype: 'audio/mp4',
                        fileName: `${videoInfo.title}.mp3`
                    }, { quoted: ms });

                    success = true; // Si le téléchargement réussit
                } catch (error) {
                    attempt++;
                    console.error(`Tentative ${attempt} échouée :`, error.message || error);
                    if (attempt >= 3) {
                        await ovl.sendMessage(ms_org, { text: "Échec du téléchargement après 3 tentatives. Veuillez réessayer plus tard." });
                    }
                }
            }
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
