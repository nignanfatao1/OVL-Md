const { ovlcmd } = require("../framework/ovlcmd");
//const fetchYoutubeData = require("../framework/youtube");

const youtubedl = require('youtube-dl-exec');

async function fetchYoutubeData(query) {
    try {
        const result = await youtubedl(query, {
            dumpSingleJson: true,
            noWarnings: true,
            format: 'bestaudio[ext=m4a]/bestvideo[ext=mp4]',
        });

        const audioUrl = result.formats.find(format => format.ext === 'm4a')?.url;
        const videoUrl = result.formats.find(format => format.ext === 'mp4' && format.vcodec !== 'none')?.url;

        return {
            title: result.title,
            duration: result.duration,
            author: result.uploader,
            audioUrl,
            videoUrl,
        };
    } catch (error) {
        console.error("Erreur lors de la récupération des informations de YouTube:", error);
        return { error: true };
    }
}

//module.exports = fetchYoutubeData;

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
            return await ovl.sendMessage(ms_org, { text: "Erreur lors de la récupération des informations de la chanson." });
        }

        const { title, duration, author, audioUrl } = ytResponse;

        const caption = `╭──── 〔 OVL-MD SONG 〕 ─⬣
⬡ Titre: ${title}
⬡ Durée: ${duration}
⬡ Auteur: ${author}
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
            return await ovl.sendMessage(ms_org, { text: "Erreur lors de la récupération des informations de la vidéo." });
        }

        const { title, duration, author, videoUrl } = ytResponse;

        const caption = `╭──── 〔 OVL-MD VIDEO 〕 ─⬣
⬡ Titre: ${title}
⬡ Durée: ${duration}
⬡ Auteur: ${author}
╰────────⬣`;

        await ovl.sendMessage(ms_org, { text: caption });

        await ovl.sendMessage(ms_org, {
            video: { url: videoUrl },
            mimetype: 'video/mp4',
            fileName: `${title}.mp4`
        }, { quoted: ms });
    }
);
