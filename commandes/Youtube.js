const { ovlcmd } = require("../framework/ovlcmd"); 
const { youtubedl } = require("../framework/youtube");
const ytsr = require("@distube/ytsr");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

ovlcmd(
    {
        nom_cmd: "song",
        classe: "Téléchargement",
        react: "🎵",
        desc: "Télécharge une chanson depuis YouTube avec un terme de recherche",
        alias: ["aud"],
    },
    async (ms_org, ovl, cmd_options) => {
        const { repondre, arg, ms } = cmd_options;
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
            const lien = song.thumbnail;
            const caption = `╭──── 〔 OVL-MD SONG 〕 ─⬣
⬡ Titre: ${name}
⬡ Durée: ${duration}
⬡ Lien: ${url}
╰────────⬣`;

            await ovl.sendMessage(ms_org, {
                image: { url: lien },
                caption: caption,
            });

            // Obtenir l'URL de l'audio
            const yt = await youtubedl(url);
            console.log(yt);

            // Vérifiez que l'audio a été trouvé
            if (yt.resultUrl.audio.length > 0) {
                const audioUrl = yt.resultUrl.audio[0].download; // Utilisez le lien de téléchargement
               console.log(audioUrl)
                // Définir le chemin de sauvegarde
                const audioPath = path.join(__dirname, `audio_${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`);

                // Télécharger l'audio
                const response = await axios.get(audioUrl, { responseType: 'stream' });
                const writer = fs.createWriteStream(audioPath);

                response.data.pipe(writer);
                writer.on('finish', async () => {
                    console.log('Audio téléchargé avec succès');

                    // Envoyer le fichier audio
                    const doc = {
                        audio: { url: audioPath },
                        mimetype: 'audio/mp3',
                        fileName: `${name}.mp3`,
                    };

                    await ovl.sendMessage(ms_org, doc, { quoted: ms });

                    // Supprimer le fichier après l'envoi
                    fs.unlink(audioPath, (err) => {
                        if (err) {
                            console.error("Erreur lors de la suppression du fichier audio :", err);
                        } else {
                            console.log("Fichier audio supprimé avec succès.");
                        }
                    });
                });

                writer.on('error', (error) => {
                    console.error("Erreur lors du téléchargement de l'audio :", error);
                    await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement de l'audio." });
                });
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
        desc: "Télécharge une vidéo depuis YouTube avec un terme de recherche",
        alias: ["vid"],
    },
    async (ms_org, ovl, cmd_options) => {
        const { repondre, arg, ms } = cmd_options;
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
            const lien = video.thumbnail;
            const caption = `╭──── 〔 OVL-MD VIDEO 〕 ─⬣
⬡ Titre: ${name}
⬡ Durée: ${duration}
⬡ Lien: ${url}
╰────────⬣`;

            await ovl.sendMessage(ms_org, {
                image: { url: lien },
                caption: caption,
            });

            const yt = await youtubedl(url);
            const link = await yt.resultUrl.video[0].download();
            let doc = {
                video: { url: link },
                mimetype: 'video/mp4',
                fileName: `${name}.mp4`,
            };
            ovl.sendMessage(ms_org, doc, { quoted: ms });
        } catch (error) {
            console.error("Erreur lors du téléchargement de la vidéo :", error.message || error);
            await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement de la vidéo." });
        }
    }
);

ovlcmd(
    {
        nom_cmd: "yt_mp4",
        classe: "Téléchargement",
        react: "📹",
        desc: "Télécharger une vidéo depuis YouTube avec un lien",
        alias: ["vid_dl", "yt_vid"],
    },
    async (ms_org, ovl, cmd_options) => {
        const { repondre, arg, ms } = cmd_options;
        try {
            const url = arg[0];
            const yt = await youtubedl(url);
            if (!yt) {
                return await ovl.sendMessage(ms_org, { text: "Lien YouTube invalide." });
            }
            const caption = `╭──── 〔 OVL-MD VIDEO 〕 ─⬣
⬡ Titre: ${yt.result.title}
⬡ Durée: ${yt.result.duration}
⬡ Lien: ${url}
╰────────⬣`;

            await ovl.sendMessage(ms_org, {
                image: { url: yt.result.thumbnail },
                caption: caption,
            });

            const link = await yt.resultUrl.video[0].download();
            let doc = {
                video: { url: link },
                mimetype: 'video/mp4',
                fileName: `${yt.result.title}.mp4`,
            };
            ovl.sendMessage(ms_org, doc, { quoted: ms });
        } catch (error) {
            console.error("Erreur lors du téléchargement de la vidéo :", error.message || error);
            await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement de la vidéo." });
        }
    }
);

ovlcmd(
    {
        nom_cmd: "yt_mp3",
        classe: "Téléchargement",
        react: "🎶",
        desc: "Télécharger une chanson depuis YouTube avec un lien",
        alias: ["song_dl", "yt_song"],
    },
    async (ms_org, ovl, cmd_options) => {
        const { repondre, arg, ms } = cmd_options;
        try {
            const url = arg[0];
            const yt = await youtubedl(url);
            if (!yt) {
                return await ovl.sendMessage(ms_org, { text: "Lien YouTube invalide." });
            }
            const caption = `╭──── 〔 OVL-MD SONG 〕 ─⬣
⬡ Titre: ${yt.result.title}
⬡ Durée: ${yt.result.duration}
⬡ Lien: ${url}
╰────────⬣`;

            await ovl.sendMessage(ms_org, {
                image: { url: yt.result.thumbnail },
                caption: caption,
            });

            const link = await yt.resultUrl.audio[0].download();
            let doc = {
                audio: { url: link },
                mimetype: 'audio/mp4',
                fileName: `${yt.result.title}.mp3`,
            };
            ovl.sendMessage(ms_org, doc, { quoted: ms });
        } catch (error) {
            console.error("Erreur lors du téléchargement de la chanson :", error.message || error);
            await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement de la chanson." });
        }
    }
);
