const axios = require("axios");
const { ovlcmd } = require("../framework/ovlcmd");

function addDownloadCommand(nom_cmd, apimode, apiType, desc, react, aliases = []) {
    ovlcmd(
        {
            nom_cmd: nom_cmd,
            classe: "Téléchargement",
            react: react || "⬇️",
            desc: desc,
            alias: aliases,
        },
        async (ms_org, ovl, cmd_options) => {
            const { repondre, arg, ms } = cmd_options;

            if (!arg.length) {
                return await ovl.sendMessage(ms_org, { text: "Veuillez fournir un lien ou un terme de recherche." });
            }

            const query = arg.join(" ");
            const isLink = /^https?:\/\//.test(query);
            let videoInfo;

            try {
                if (isLink) {
                    videoInfo = { url: query };
                } else {
                    const searchResponse = await axios.get(`https://api.vevioz.com/search`, { params: { query } });
                    if (!searchResponse.data || searchResponse.data.length === 0) {
                        return await ovl.sendMessage(ms_org, { text: "Aucun résultat trouvé pour cette recherche." });
                    }
                    const result = searchResponse.data[0];
                    videoInfo = {
                        url: result.url,
                        title: result.title,
                        views: result.views,
                        duration: result.duration,
                        thumbnail: result.thumbnail,
                    };
                }

                const caption = `╭─── 〔 Téléchargement 〕 ──⬣
⬡ Titre: ${videoInfo.title || "Inconnu"}
⬡ URL: ${videoInfo.url}
⬡ Vues: ${videoInfo.views || "Non spécifié"}
⬡ Durée: ${videoInfo.duration || "Non spécifiée"}
╰───────────────────⬣`;

                await ovl.sendMessage(ms_org, { image: { url: videoInfo.thumbnail }, caption: caption });

                const downloadResponse = await axios.get(`https://api.vevioz.com/download/${apimode}`, {
                    params: { url: videoInfo.url },
                    responseType: "arraybuffer",
                });

                const fileType = apiType === "audio" ? "audio/mp4" : "video/mp4";
                const fileName = `${videoInfo.title}.${apiType === "audio" ? "mp3" : "mp4"}`;

                await ovl.sendMessage(ms_org, {
                    [apiType]: Buffer.from(downloadResponse.data),
                    mimetype: fileType,
                    fileName,
                }, { quoted: ms });
            } catch (error) {
                console.error(`Erreur avec la commande ${nom_cmd} :`, error.message || error);
                await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement ou de la recherche." });
            }
        }
    );
}

addDownloadCommand(
    "song", 
    "mp3",
    "audio", 
    "Télécharge une chanson depuis YouTube, TikTok, ou autres plateformes prises en charge.",
    "🎵",
    ["play", "audio"]
);

addDownloadCommand(
    "video",
    "mp4",
    "video",
    "Télécharge une vidéo depuis YouTube, TikTok, Twitter, ou autres plateformes prises en charge.",
    "🎥",
    ["vid", "movie"]
);
