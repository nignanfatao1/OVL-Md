const { ovlcmd } = require("../framework/ovlcmd"); 
const axios = require("axios");

async function fetchSongInfo(query) {
    try {
        const searchResponse = await axios.get(`https://api.giftedtech.my.id/api/search/yts?apikey=gifted&query=${query}`);
        if (searchResponse.data.results && searchResponse.data.results.length > 0) {
            return searchResponse.data.results[0];
        }
    } catch (error) {
        console.warn("Échec de la première API de recherche, tentative avec la deuxième.");
    }

    try {
        const searchResponseV2 = await axios.get(`https://api.giftedtech.my.id/api/search/ytsv2?apikey=gifted&query=${query}`);
        if (searchResponseV2.data.results && searchResponseV2.data.results.length > 0) {
            return searchResponseV2.data.results[0];
        }
    } catch (error) {
        console.warn("Échec des deux API de recherche.");
    }

    return null;
}

ovlcmd(
    {
        nom_cmd: "song",
        classe: "Téléchargement",
        react: "🎵",
        desc: "Télécharge une chanson depuis YouTube avec un terme de recherche ou un lien YouTube",
        alias: ["aud"],
    },
    async (ms_org, ovl, cmd_options) => {
        const { repondre, arg, ms } = cmd_options;
        
        try {
            if (!arg.length) {
                return await ovl.sendMessage(ms_org, { text: "Veuillez spécifier un titre de chanson ou un lien YouTube." });
            }

            const query = arg.join(" ");
            let url, name, duration, lien;

            const isYouTubeLink = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(arg[0]);

            if (isYouTubeLink) {
                url = arg[0];

                const songInfoResponse = await axios.get(`https://api.giftedtech.my.id/api/info/yts?apikey=gifted&url=${url}`);
                const songInfo = songInfoResponse.data.results[0];

                if (!songInfo) {
                    return await ovl.sendMessage(ms_org, { text: "Impossible de récupérer les informations de la vidéo." });
                }

                name = songInfo.title;
                duration = songInfo.duration.timestamp;
                lien = songInfo.thumbnail;

            } else {
                const song = await fetchSongInfo(query);

                if (!song) {
                    return await ovl.sendMessage(ms_org, { text: "Aucun résultat trouvé pour cette recherche." });
                }

                name = song.title;
                url = song.url;
                duration = song.duration.timestamp;
                lien = song.thumbnail;
            }

            const caption = `╭──── 〔 OVL-MD SONG 〕 ─⬣
⬡ Titre: ${name}
⬡ Durée: ${duration}
⬡ Lien: ${url}
╰────────⬣`;

            await ovl.sendMessage(ms_org, {
                image: { url: lien },
                caption: caption,
            });

            const downloadResponse = await axios.get(`https://api.giftedtech.my.id/api/download/ytaudio?apikey=gifted&url=${url}`);
            const link = downloadResponse.data.result.download_url;

            if (link) {
                const doc = {
                    audio: { url: link },
                    mimetype: 'audio/mp4',
                    fileName: `${name}.mp3`,
                };

                await ovl.sendMessage(ms_org, doc, { quoted: ms });
            } else {
                await ovl.sendMessage(ms_org, { text: "Aucun lien audio trouvé." });
            }

        } catch (error) {
            console.error("Erreur lors du téléchargement de la chanson :", error.message || error);
            await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement de la chanson." });
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
        
        try {
            if (!arg.length) {
                return await ovl.sendMessage(ms_org, { text: "Veuillez spécifier un titre de vidéo ou un lien YouTube." });
            }

            const query = arg.join(" ");
            let url, name, duration, lien;

            const isYouTubeLink = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(arg[0]);

            if (isYouTubeLink) {
                url = arg[0];

                const videoInfoResponse = await axios.get(`https://api.giftedtech.my.id/api/info/yts?apikey=gifted&url=${url}`);
                const videoInfo = videoInfoResponse.data.results[0];

                if (!videoInfo) {
                    return await ovl.sendMessage(ms_org, { text: "Impossible de récupérer les informations de la vidéo." });
                }

                name = videoInfo.title;
                duration = videoInfo.duration.timestamp;
                lien = videoInfo.thumbnail;

            } else {
                const video = await fetchSongInfo(query);

                if (!video) {
                    return await ovl.sendMessage(ms_org, { text: "Aucun résultat trouvé pour cette recherche." });
                }

                name = video.title;
                url = video.url;
                duration = video.duration.timestamp;
                lien = video.thumbnail;
            }

            const caption = `╭──── 〔 OVL-MD VIDEO 〕 ─⬣
⬡ Titre: ${name}
⬡ Durée: ${duration}
⬡ Lien: ${url}
╰────────⬣`;

            await ovl.sendMessage(ms_org, {
                image: { url: lien },
                caption: caption,
            });

            const downloadResponse = await axios.get(`https://api.giftedtech.my.id/api/download/ytvideo?apikey=gifted&url=${url}`);
            const link = downloadResponse.data.result.download_url;

            if (link) {
                const doc = {
                    video: { url: link },
                    mimetype: 'video/mp4',
                    fileName: `${name}.mp4`,
                };

                await ovl.sendMessage(ms_org, doc, { quoted: ms });
            } else {
                await ovl.sendMessage(ms_org, { text: "Aucun lien vidéo trouvé." });
            }

        } catch (error) {
            console.error("Erreur lors du téléchargement de la vidéo :", error.message || error);
            await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement de la vidéo." });
        }
    }
);
