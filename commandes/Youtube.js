const { ovlcmd } = require("../framework/ovlcmd");
const ytdl = require("ytdl-core");
const ytsr = require("ytsr");
const fs = require("fs");
const path = require("path");

ovlcmd(
    {
        nom_cmd: "song",
        classe: "Téléchargement",
        react: "🎵",
        desc: "Télécharge une chanson depuis YouTube avec un terme de recherche",
        alias: ["aud"],
    },
    async (ms_org, ovl, cmd_options) => {
        const { repondre, arg } = cmd_options;
        try {
            const query = arg.join(" ");
            if (!query) {
                return await ovl.sendMessage(ms_org, { text: "Veuillez spécifier un titre de chanson." });
            }

            const searchResults = await ytsr(query, { limit: 1 });
            const song = searchResults.items[0];

            if (!song || !song.url) {
                return await ovl.sendMessage(ms_org, { text: "Aucun résultat trouvé pour la recherche." });
            }

            const title = song.title;
            const url = song.url;
            const duration = song.duration;
            const filePath = path.join(__dirname, `${title}.mp3`);

            await ovl.sendMessage(ms_org, { text: `OVL-MD SONG_DOWNLOAD\n\n> Titre : ${title}\n\n> Durée : ${duration}\n\n> Lien : ${url}\n` });
            const stream = ytdl(url, { filter: "audioonly" });
            const fileStream = fs.createWriteStream(filePath);
            stream.pipe(fileStream);

            fileStream.on("finish", async () => {
                await ovl.sendMessage(ms_org, {
                    audio: { url: filePath },
                    caption: `${title}`,
                });
                fs.unlinkSync(filePath);
            });

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
        react: "🎵",
        desc: "Télécharge une vidéo depuis YouTube avec un terme de recherche",
        alias: ["vid"],
    },
    async (ms_org, ovl, cmd_options) => {
        const { repondre, arg } = cmd_options;
        try {
            const query = arg.join(" ");
            if (!query) {
                return await ovl.sendMessage(ms_org, { text: "Veuillez spécifier un titre de vidéo." });
            }

            const searchResults = await ytsr(query, { limit: 1 });
            const video = searchResults.items[0];

            if (!video || !video.url) {
                return await ovl.sendMessage(ms_org, { text: "Aucun résultat trouvé pour la recherche." });
            }

            const title = video.title;
            const url = video.url;
            const duration = video.duration;
            const filePath = path.join(__dirname, `${title}.mp4`);

            await ovl.sendMessage(ms_org, { text: `OVL-MD VIDEO_DOWNLOAD\n\n> Titre : ${title}\n\n> Durée : ${duration}\n\n> Lien : ${url}\n` });
            const stream = ytdl(url, { filter: "videoandaudio" });
            const fileStream = fs.createWriteStream(filePath);
            stream.pipe(fileStream);

            fileStream.on("finish", async () => {
                await ovl.sendMessage(ms_org, {
                    video: { url: filePath },
                    caption: `${title}`,
                });
                fs.unlinkSync(filePath);
            });

        } catch (error) {
            console.error("Erreur lors du téléchargement de la vidéo :", error.message || error);
            await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement de la vidéo." });
        }
    }
);

ovlcmd(
    {
        nom_cmd: "yt_vid",
        classe: "Téléchargement",
        react: "📹",
        desc: "Télécharge une vidéo depuis YouTube avec un lien",
        alias: ["vid_dl"],
    },
    async (ms_org, ovl, cmd_options) => {
        const { repondre, arg } = cmd_options;
        try {
            const url = arg.join(" ");
            if (!ytdl.validateURL(url)) {
                return await ovl.sendMessage(ms_org, { text: "Lien YouTube invalide." });
            }

            const videoInfo = await ytdl.getInfo(url);
            const title = videoInfo.videoDetails.title;
            const duration = videoInfo.videoDetails.lengthSeconds;
            const filePath = path.join(__dirname, `${title}.mp4`);

            await ovl.sendMessage(ms_org, { text: `OVL-MD VIDEO_DOWNLOAD\n\n> Titre : ${title}\n\n> Durée : ${duration}\n\n> Lien : ${url}\n` });
            const stream = ytdl(url, { filter: "videoandaudio" });
            const fileStream = fs.createWriteStream(filePath);
            stream.pipe(fileStream);

            fileStream.on("finish", async () => {
                await ovl.sendMessage(ms_org, {
                    video: { url: filePath },
                    caption: `${title}`,
                });
                fs.unlinkSync(filePath);
            });

        } catch (error) {
            console.error("Erreur lors du téléchargement de la vidéo :", error.message || error);
            await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement de la vidéo." });
        }
    }
);

ovlcmd(
    {
        nom_cmd: "yt_song",
        classe: "Téléchargement",
        react: "🎥",
        desc: "Télécharge une chanson depuis YouTube avec un lien",
        alias: ["song_dl"],
    },
    async (ms_org, ovl, cmd_options) => {
        const { repondre, arg } = cmd_options;
        try {
            const url = arg.join("");
            if (!ytdl.validateURL(url)) {
                return await ovl.sendMessage(ms_org, { text: "Lien YouTube invalide." });
            }

            const videoInfo = await ytdl.getInfo(url);
            const title = videoInfo.videoDetails.title;
            const duration = videoInfo.videoDetails.lengthSeconds;
            const filePath = path.join(__dirname, `${title}.mp3`);

            await ovl.sendMessage(ms_org, { text: `OVL-MD SONG_DOWNLOAD\n\n> Titre : ${title}\n\n> Durée : ${duration}\n\n> Lien : ${url}\n` });
            const stream = ytdl(url, { filter: "audioonly" });
            const fileStream = fs.createWriteStream(filePath);
            stream.pipe(fileStream);

            fileStream.on("finish", async () => {
                await ovl.sendMessage(ms_org, {
                    audio: { url: filePath },
                    caption: `${title}`,
                });
                fs.unlinkSync(filePath);
            });

        } catch (error) {
            console.error("Erreur lors du téléchargement de la chanson :", error.message || error);
            await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement de la chanson." });
        }
    }
);
