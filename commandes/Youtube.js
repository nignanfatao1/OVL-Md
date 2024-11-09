const { ovlcmd } = require("../framework/ovlcmd");
const { youtubedl } = require("../framework/youtube");

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
        const isYouTubeLink = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(arg[0]);

        try {
            // Utilise la fonction youtubedl pour obtenir les informations et le lien de téléchargement direct
            const ytResponse = await youtubedl(isYouTubeLink ? arg[0] : query, { format: "bestaudio" });

            if (ytResponse.error) {
                return await ovl.sendMessage(ms_org, { text: "Erreur lors de la récupération des informations de la chanson." });
            }

            const { title, duration, author, thumbnail, url: audioLink } = ytResponse.result;

            const caption = `╭──── 〔 OVL-MD SONG 〕 ─⬣
⬡ Titre: ${title}
⬡ Durée: ${duration}
⬡ Auteur: ${author}
╰────────⬣`;

            await ovl.sendMessage(ms_org, { image: { url: thumbnail }, caption: caption });

            // Envoie directement l'audio à partir du lien fourni par YouTubeDL
            await ovl.sendMessage(ms_org, {
                audio: { url: audioLink },
                mimetype: 'audio/mp4',
                fileName: `${title}.mp3`
            }, { quoted: ms });

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

        if (!arg.length) {
            return await ovl.sendMessage(ms_org, { text: "Veuillez spécifier un titre de vidéo ou un lien YouTube." });
        }

        const query = arg.join(" ");
        const isYouTubeLink = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(arg[0]);

        try {
            // Utilise la fonction youtubedl pour obtenir les informations et le lien de téléchargement direct
            const ytResponse = await youtubedl(isYouTubeLink ? arg[0] : query, { format: "bestvideo+bestaudio" });

            if (ytResponse.error) {
                return await ovl.sendMessage(ms_org, { text: "Erreur lors de la récupération des informations de la vidéo." });
            }

            const { title, duration, author, thumbnail, url: videoLink } = ytResponse.result;

            const caption = `╭──── 〔 OVL-MD VIDEO 〕 ─⬣
⬡ Titre: ${title}
⬡ Durée: ${duration}
⬡ Auteur: ${author}
╰────────⬣`;

            await ovl.sendMessage(ms_org, { image: { url: thumbnail }, caption: caption });

            // Envoie directement la vidéo à partir du lien fourni par YouTubeDL
            await ovl.sendMessage(ms_org, {
                video: { url: videoLink },
                mimetype: 'video/mp4',
                fileName: `${title}.mp4`
            }, { quoted: ms });

        } catch (error) {
            console.error("Erreur lors du téléchargement de la vidéo :", error.message || error);
            await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement de la vidéo." });
        }
    }
);
