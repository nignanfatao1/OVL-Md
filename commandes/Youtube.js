const { ovlcmd } = require("../framework/ovlcmd");
const ytdl = require("@distube/ytdl-core");
const ytsr = require("@distube/ytsr");
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

            const name = song.name;
            const url = song.url;
            const duration = song.duration;
            const lien = song.thumbnail; // Use song.thumbnail here
            const filePath = path.join(__dirname, `${name}.mp3`);

            await ovl.sendMessage(ms_org, { image: { url: lien }, 
                caption: `OVL-MD SONG_DOWNLOAD\n\n> Titre : ${name}\n\n> Durée : ${duration}\n\n> Lien : ${url}\n` });

            const stream = ytdl(url, { filter: "audioonly" });
            const fileStream = fs.createWriteStream(filePath);

            stream.pipe(fileStream);

            fileStream.on("finish", async () => {
                await ovl.sendMessage(ms_org, {
                    audio: { url: filePath },
                    caption: `${name}`,
                });
                fs.unlinkSync(filePath);
            });

            fileStream.on("error", (error) => {
                console.error("Erreur lors de l'écriture du fichier :", error.message);
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

            const name = video.name;
            const url = video.url;
            const duration = video.duration;
            const lien = video.thumbnail; // Corrected to use video.thumbnail
            const filePath = path.join(__dirname, `${name}.mp4`);

            await ovl.sendMessage(ms_org, { image: { url: lien }, 
                caption: `OVL-MD VIDEO_DOWNLOAD\n\n> Titre : ${name}\n\n> Durée : ${duration}\n\n> Lien : ${url}\n` });

            const stream = ytdl(url, { filter: "videoandaudio" });
            const fileStream = fs.createWriteStream(filePath);

            stream.pipe(fileStream);

            fileStream.on("finish", async () => {
                await ovl.sendMessage(ms_org, {
                    video: { url: filePath },
                    caption: `${name}`,
                });
                fs.unlinkSync(filePath);
            });

            fileStream.on("error", (error) => {
                console.error("Erreur lors de l'écriture du fichier :", error.message);
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
            const name = videoInfo.videoDetails.title; // Corrected to use title
            const lien = videoInfo.videoDetails.thumbnails[0].url; // Get the thumbnail correctly
            const duration = videoInfo.videoDetails.lengthSeconds;
            const filePath = path.join(__dirname, `${name}.mp4`);

            await ovl.sendMessage(ms_org, { image: { url: lien }, 
                caption: `OVL-MD VIDEO_DOWNLOAD\n\n> Titre : ${name}\n\n> Durée : ${duration}\n\n> Lien : ${url}\n` });

            const stream = ytdl(url, { filter: "videoandaudio" });
            const fileStream = fs.createWriteStream(filePath);

            stream.pipe(fileStream);

            fileStream.on("finish", async () => {
                await ovl.sendMessage(ms_org, {
                    video: { url: filePath },
                    caption: `${name}`,
                });
                fs.unlinkSync(filePath);
            });

            fileStream.on("error", (error) => {
                console.error("Erreur lors de l'écriture du fichier :", error.message);
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
            const url = arg.join(" "); // Changed to join with space
            if (!ytdl.validateURL(url)) {
                return await ovl.sendMessage(ms_org, { text: "Lien YouTube invalide." });
            }

            const videoInfo = await ytdl.getInfo(url);
            const name = videoInfo.videoDetails.title; // Corrected to use title
            const lien = videoInfo.videoDetails.thumbnails[0].url; // Get the thumbnail correctly
            const duration = videoInfo.videoDetails.lengthSeconds;
            const filePath = path.join(__dirname, `${name}.mp3`);

            await ovl.sendMessage(ms_org, { image: { url: lien }, 
                caption: `OVL-MD SONG_DOWNLOAD\n\n> Titre : ${name}\n\n> Durée : ${duration}\n\n> Lien : ${url}\n` });

            const stream = ytdl(url, { filter: "audioonly" });
            const fileStream = fs.createWriteStream(filePath);

            stream.pipe(fileStream);

            fileStream.on("finish", async () => {
                await ovl.sendMessage(ms_org, {
                    audio: { url: filePath },
                    caption: `${name}`,
                });
                fs.unlinkSync(filePath);
            });

            fileStream.on("error", (error) => {
                console.error("Erreur lors de l'écriture du fichier :", error.message);
            });

        } catch (error) {
            console.error("Erreur lors du téléchargement de la chanson :", error.message || error);
            await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement de la chanson." });
        }
    }
);
