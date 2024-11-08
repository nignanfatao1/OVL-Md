const { ovlcmd } = require("../framework/ovlcmd");
const { youtubedl } = require("../framework/youtube"); // Assurez-vous que le chemin vers youtubedl est correct

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
        let isYouTubeLink = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(arg[0]);

        try {
            // Utilise la fonction youtubedl pour obtenir les informations
            const ytResponse = await youtubedl(isYouTubeLink ? arg[0] : query);

            if (ytResponse.error) {
                return await ovl.sendMessage(ms_org, { text: "Erreur lors de la récupération des informations de la chanson." });
            }

            const { title, duration, author } = ytResponse.result;
            const audioLink = ytResponse.resultUrl.audio[0]?.download;

            if (!audioLink) {
                return await ovl.sendMessage(ms_org, { text: "Aucun lien audio trouvé." });
            }

            const caption = `╭──── 〔 OVL-MD SONG 〕 ─⬣
⬡ Titre: ${title}
⬡ Durée: ${duration}
⬡ Auteur: ${author}
╰────────⬣`;

            await ovl.sendMessage(ms_org, {
                text: caption
            });

            const audioBuffer = audioLink; // Le lien est déjà un buffer grâce à downloadAsBuffer

            await ovl.sendMessage(ms_org, {
                audio: audioBuffer,
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
        let isYouTubeLink = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(arg[0]);

        try {
            // Utilise la fonction youtubedl pour obtenir les informations
            const ytResponse = await youtubedl(isYouTubeLink ? arg[0] : query);

            if (ytResponse.error) {
                return await ovl.sendMessage(ms_org, { text: "Erreur lors de la récupération des informations de la vidéo." });
            }

            const { title, duration, author } = ytResponse.result;
            const videoLink = ytResponse.resultUrl.video[0]?.download;

            if (!videoLink) {
                return await ovl.sendMessage(ms_org, { text: "Aucun lien vidéo trouvé." });
            }

            const caption = `╭──── 〔 OVL-MD VIDEO 〕 ─⬣
⬡ Titre: ${title}
⬡ Durée: ${duration}
⬡ Auteur: ${author}
╰────────⬣`;

            await ovl.sendMessage(ms_org, {
                text: caption
            });

            const videoBuffer = videoLink; // Le lien est déjà un buffer grâce à downloadAsBuffer

            await ovl.sendMessage(ms_org, {
                video: videoBuffer,
                mimetype: 'video/mp4',
                fileName: `${title}.mp4`
            }, { quoted: ms });

        } catch (error) {
            console.error("Erreur lors du téléchargement de la vidéo :", error.message || error);
            await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement de la vidéo." });
        }
    }
);
