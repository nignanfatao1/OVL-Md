const { ovlcmd } = require("../framework/ovlcmd");
const axios = require('axios');

async function fetchYoutubeData(query) {
    try {
        // Construction de l'URL de l'API avec le terme de recherche
        const apiUrl = `https://bk9.fun/download/youtube?url=${encodeURIComponent(query)}`;
        
        // Requête à l'API
        const response = await axios.get(apiUrl);
        
        if (!response.data.status) {
            return { error: true, message: "Erreur dans la récupération des données." };
        }

        const data = response.data.BK9;

        // Extraction des informations audio et vidéo
        const audioUrl = data.audio?.url;
        const videoUrl = data.video?.url;
        const title = data.audio?.title || data.video?.title;
        const thumb = data.audio?.thumb || data.video?.thumb;
        const author = data.audio?.channel || data.video?.channel;
        const published = data.audio?.published || data.video?.published;
        const views = data.audio?.views || data.video?.views;

        return {
            title,
            audioUrl,
            videoUrl,
            thumb,
            author,
            published,
            views,
        };
    } catch (error) {
        console.error("Erreur lors de la récupération des informations:", error);
        return { error: true, message: "Erreur lors de la récupération des informations." };
    }
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

        if (!arg.length) {
            return await ovl.sendMessage(ms_org, { text: "Veuillez spécifier un titre de chanson ou un lien YouTube." });
        }

        const query = arg.join(" ");
        const ytResponse = await fetchYoutubeData(query);

        if (ytResponse.error || !ytResponse.audioUrl) {
            return await ovl.sendMessage(ms_org, { text: ytResponse.message || "Erreur lors de la récupération des informations de la chanson." });
        }

        const { title, audioUrl, author, thumb } = ytResponse;

        const caption = `╭──── 〔 OVL-MD SONG 〕 ─⬣
⬡ Titre: ${title}
⬡ Auteur: ${author}
⬡ Vues: ${ytResponse.views}
⬡ Publié: ${ytResponse.published}
╰────────⬣`;

        await ovl.sendMessage(ms_org, { text: caption });

        await ovl.sendMessage(ms_org, {
            audio: { url: audioUrl },
            mimetype: 'audio/mp4',
            fileName: `${title}.mp3`
        }, { quoted: ms });
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
        const ytResponse = await fetchYoutubeData(query);

        if (ytResponse.error || !ytResponse.videoUrl) {
            return await ovl.sendMessage(ms_org, { text: ytResponse.message || "Erreur lors de la récupération des informations de la vidéo." });
        }

        const { title, videoUrl, author, thumb } = ytResponse;

        const caption = `╭──── 〔 OVL-MD VIDEO 〕 ─⬣
⬡ Titre: ${title}
⬡ Auteur: ${author}
⬡ Vues: ${ytResponse.views}
⬡ Publié: ${ytResponse.published}
╰────────⬣`;

        await ovl.sendMessage(ms_org, { text: caption });

        await ovl.sendMessage(ms_org, {
            video: { url: videoUrl },
            mimetype: 'video/mp4',
            fileName: `${title}.mp4`
        }, { quoted: ms });
    }
);
