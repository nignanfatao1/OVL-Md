const { ovlcmd } = require("../framework/ovlcmd");
const { youtubedl } = require("../framework/youtube");
const axios = require("axios");

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
             
          /*  if (!audioLink) {
                return await ovl.sendMessage(ms_org, { text: "Aucun lien audio trouvé." });
            }*/

            const caption = `╭──── 〔 OVL-MD SONG 〕 ─⬣
⬡ Titre: ${title}
⬡ Durée: ${duration}
⬡ Auteur: ${author}
╰────────⬣`;

            await ovl.sendMessage(ms_org, {
                text: caption
            });

            const audioBuffer = axios.get(`https://ironman.koyeb.app/ironman/dl/yta?url=${query}`);

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

            const caption = `╭──── 〔 OVL-MD VIDEO 〕 ─⬣
⬡ Titre: ${title}
⬡ Durée: ${duration}
⬡ Auteur: ${author}
╰────────⬣`;

            await ovl.sendMessage(ms_org, {
                text: caption
            });

            const livid = axios.get(`https://ironman.koyeb.app/ironman/dl/yta?url=${query}`);
            await ovl.sendMessage(ms_org, {
                video: livid,
                mimetype: 'video/mp4',
                fileName: `${title}.mp4`
            }, { quoted: ms });

        } catch (error) {
            console.error("Erreur lors du téléchargement de la vidéo :", error.message || error);
            await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement de la vidéo." });
        }
    }
);
