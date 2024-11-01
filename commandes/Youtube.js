const { ovlcmd } = require("../framework/ovlcmd");
const ytsr = require("@distube/ytsr");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Fonction pour télécharger via une API externe
async function downloadMedia(url, type = "audio") {
    try {
        const apiEndpoint = type === "audio" 
            ? `https://Ironman.koyeb.app/Ironman/dl/ytdl2?url=${url}`
            : `https://Ironman.koyeb.app/Ironman/dl/ytdl2?url=${url}`;
        
        const { data } = await axios.get(apiEndpoint);
        return {
            status: !!data[type],
            ...data
        };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
}

// Commande pour télécharger une chanson par recherche YouTube
ovlcmd(
    {
        nom_cmd: "song",
        classe: "Téléchargement",
        react: "🎵",
        desc: "Télécharge une chanson depuis YouTube avec un terme de recherche",
        alias: ["aud"],
    },
    async (ms_org, ovl, cmd_options) => {
        const { arg } = cmd_options;
        const query = arg.join(" ");
        if (!query) return await ovl.sendMessage(ms_org, { text: "Veuillez spécifier un titre de chanson." });

        const searchResults = await ytsr(query, { limit: 1 });
        const song = searchResults.items[0];

        if (!song || !song.url) return await ovl.sendMessage(ms_org, { text: "Aucun résultat trouvé." });

        const audioData = await downloadMedia(song.url, "audio");
        if (!audioData.status) return await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement." });

        await ovl.sendMessage(ms_org, {
            image: { url: audioData.thumbnail },
            caption: `OVL-MD SONG_DOWNLOAD\n\n> Titre : ${audioData.title}\nDurée : ${audioData.duration}\nLien : ${audioData.url}`
        });

        const filePath = path.join(__dirname, `${audioData.title}.mp3`);
        const fileStream = fs.createWriteStream(filePath);
        const response = await axios.get(audioData.audio, { responseType: 'stream' });
        response.data.pipe(fileStream);

        fileStream.on("finish", async () => {
            await ovl.sendMessage(ms_org, { audio: { url: filePath }, caption: `${audioData.title}` });
            fs.unlinkSync(filePath);
        });
    }
);

// Commande pour télécharger une vidéo par recherche YouTube
ovlcmd(
    {
        nom_cmd: "video",
        classe: "Téléchargement",
        react: "🎥",
        desc: "Télécharge une vidéo depuis YouTube avec un terme de recherche",
        alias: ["vid"],
    },
    async (ms_org, ovl, cmd_options) => {
        const { arg } = cmd_options;
        const query = arg.join(" ");
        if (!query) return await ovl.sendMessage(ms_org, { text: "Veuillez spécifier un titre de vidéo." });

        const searchResults = await ytsr(query, { limit: 1 });
        const video = searchResults.items[0];

        if (!video || !video.url) return await ovl.sendMessage(ms_org, { text: "Aucun résultat trouvé." });

        const videoData = await downloadMedia(video.url, "video");
        if (!videoData.status) return await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement." });

        await ovl.sendMessage(ms_org, {
            image: { url: videoData.thumbnail },
            caption: `OVL-MD VIDEO_DOWNLOAD\n\n> Titre : ${videoData.title}\nDurée : ${videoData.duration}\nLien : ${videoData.url}`
        });

        const filePath = path.join(__dirname, `${videoData.title}.mp4`);
        const fileStream = fs.createWriteStream(filePath);
        const response = await axios.get(videoData.video, { responseType: 'stream' });
        response.data.pipe(fileStream);

        fileStream.on("finish", async () => {
            await ovl.sendMessage(ms_org, { video: { url: filePath }, caption: `${videoData.title}` });
            fs.unlinkSync(filePath);
        });
    }
);

// Commande pour télécharger l'audio d'une URL YouTube
ovlcmd(
    {
        nom_cmd: "audio",
        classe: "Téléchargement",
        react: "🎶",
        desc: "Télécharge l'audio depuis une URL YouTube",
        alias: ["mp3"],
    },
    async (ms_org, ovl, cmd_options) => {
        const { arg } = cmd_options;
        const url = arg[0];
        const audioData = await downloadMedia(url, "audio");
        if (!audioData.status) return await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement." });

        await ovl.sendMessage(ms_org, {
            image: { url: audioData.thumbnail },
            caption: `OVL-MD AUDIO_DOWNLOAD\n\n> Titre : ${audioData.title}\nDurée : ${audioData.duration}\nLien : ${audioData.url}`
        });

        const filePath = path.join(__dirname, `${audioData.title}.mp3`);
        const fileStream = fs.createWriteStream(filePath);
        const response = await axios.get(audioData.audio, { responseType: 'stream' });
        response.data.pipe(fileStream);

        fileStream.on("finish", async () => {
            await ovl.sendMessage(ms_org, { audio: { url: filePath }, caption: `${audioData.title}` });
            fs.unlinkSync(filePath);
        });
    }
);

// Commande pour télécharger la vidéo d'une URL YouTube
ovlcmd(
    {
        nom_cmd: "dl",
        classe: "Téléchargement",
        react: "📹",
        desc: "Télécharge la vidéo depuis une URL YouTube",
        alias: ["mp4"],
    },
    async (ms_org, ovl, cmd_options) => {
        const { arg } = cmd_options;
        const url = arg[0];
        const videoData = await downloadMedia(url, "video");
        if (!videoData.status) return await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement." });

        await ovl.sendMessage(ms_org, {
            image: { url: videoData.thumbnail },
            caption: `OVL-MD VIDEO_DOWNLOAD\n\n> Titre : ${videoData.title}\nLien : ${url}`
        });

        const filePath = path.join(__dirname, `${videoData.title}.mp4`);
        const fileStream = fs.createWriteStream(filePath);
        const response = await axios.get(videoData.video, { responseType: 'stream' });
        response.data.pipe(fileStream);

        fileStream.on("finish", async () => {
            await ovl.sendMessage(ms_org, { video: { url: filePath }, caption: `${videoData.title}` });
            fs.unlinkSync(filePath);
        });
    }
);
