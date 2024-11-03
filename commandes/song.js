const { ovlcmd } = require("../framework/ovlcmd"); 
const { youtubedl, youtubedlv2 } = require('@bochilteam/scraper');
const ytsr = require("@distube/ytsr");

ovlcmd(
    {
        nom_cmd: "songs",
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
        const q = '128kbps';
        const yt = await youtubedl(url).catch(async (_) => await youtubedlv2(url));
        const dl_url = await yt.audio[q].download();
          const doc = {
                        audio: { url: dl_url },
                        mimetype: 'audio/mpeg',
                        fileName: `${name}.mp3`,
                    };

                    await ovl.sendMessage(ms_org, doc, { quoted: ms });
        } catch (error) {
            console.error("Erreur lors du téléchargement de la chanson :", error.message || error);
            await ovl.sendMessage(ms_org, { text: "Erreur lors du téléchargement de la chanson." });
        }
    }
);

