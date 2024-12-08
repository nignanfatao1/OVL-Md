const { ovlcmd } = require("../framework/ovlcmd");
const fancy = require("../framework/style");
const fs = require('fs');
const axios = require('axios');

ovlcmd(
    {
        nom_cmd: "fliptext",
        classe: "Fun",
        desc: "Inverse le texte fourni.",
    },
    async (ms_org, ovl, cmd_options) => {
        const { arg, ms } = cmd_options;
        const text = arg.join(" ");
        if (!text) {
            return await ovl.sendMessage(ms_org, { text: "Veuillez fournir un texte à inverser !" });
        }
        const flipped = text.split("").reverse().join("");
        await ovl.sendMessage(ms_org, { text: flipped }, { quoted: ms });
    }
);

ovlcmd(
    {
        nom_cmd: "readmore",
        classe: "Fun",
        desc: "Ajoute un effet 'voir plus' au texte.",
    },
    async (ms_org, ovl, cmd_options) => {
        const { arg, ms } = cmd_options;
        const text = arg.join(" ");
        if (!text) {
            return await ovl.sendMessage(ms_org, { text: "Veuillez fournir un texte" });
        }
        const hiddenText = `${text.split(" ").join(" ")}${String.fromCharCode(8206).repeat(4001)}`;
        await ovl.sendMessage(ms_org, { text: hiddenText }, { quoted: ms });
    }
);

ovlcmd(
    {
        nom_cmd: "ship",
        classe: "Fun",
        desc: "Test de compatibilité entre deux personnes",
        alias: ["match"],
    },
    async (ms_org, ovl, cmd_options) => {
        const { auteur_Msg_Repondu, auteur_Message, arg, ms } = cmd_options;
        const tags = auteur_Msg_Repondu || (arg[0]?.includes("@") && `${arg[0].replace("@", "")}@s.whatsapp.net`);
         if (tags.length === 0) {
            return await ovl.sendMessage(ms_org, { text: "Mentionne une personne" });
         }
        const randomPercentage = Math.floor(Math.random() * 101);
        let comment;
        if (randomPercentage <= 30) {
            comment = "💔 Pas vraiment compatibles... 😢";
        } else if (randomPercentage <= 70) {
            comment = "🤔 Il y a du potentiel, mais cela demande du travail !";
        } else {
            comment = "💖 Vous êtes faits l'un pour l'autre ! 🌹";

        }

        await ovl.sendMessage(ms_org, {
            text: `💘 *Ship*\n\n @${tags.split("@")[0]} & @${auteur_Message.split("@")[0]}, ${comment}.\n💖Compatibilité :*${randomPercentage}%*`,
            mentions: [tags[0], auteur_Message],
        });
    }
);
 
ovlcmd(
    {
        nom_cmd: "couplepp",
        classe: "Fun",
        desc: "Envoie des photos de couple animées.",
        alias: ["cpp"],
    },
    async (ms_org, ovl) => {
        try {
            const { data } = await axios.get("https://raw.githubusercontent.com/iamriz7/kopel_/main/kopel.json");
            const randomPicture = data[Math.floor(Math.random() * data.length)];
            await ovl.sendMessage(ms_org, {
                image: { url: randomPicture.female },
                caption: "❤️ *Pour Madame 💁🏻‍♀️*",
            });
            await ovl.sendMessage(ms_org, {
                image: { url: randomPicture.male },
                caption: "❤️ *Pour Monsieur 💁🏻‍♂️*",
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
            await ovl.sendMessage(ms_org, {
                text: "❗ Impossible de récupérer les images. Réessaie plus tard.",
            });
        }
    }
);

ovlcmd(
  {
    nom_cmd: "fancy",
    classe: "Fun",
    react: "✍️",
    desc: "Applique un style fancy au texte",
  },
  async (ms_org, ovl, cmd_options) => {
    const { arg, repondre } = cmd_options;
    const id = parseInt(arg[0], 10);
    const text = arg.slice(1).join(" ");
    const prefixe = config.PREFIXE;

    if (isNaN(id) || !text) {
      return await repondre(
        `\nExemple : ${prefixe}fancy 10 OVL-MD\n` +
          String.fromCharCode(8206).repeat(4001) +
          fancy.list("ovl-md", fancy)
      );
    }

    try {
      const selectedStyle = fancy[id - 1];
      if (selectedStyle) {
        return await repondre(fancy.apply(selectedStyle, text));
      } else {
        return await repondre(`_Style introuvable pour l'ID : ${id}_`);
      }
    } catch (error) {
      console.error("Erreur lors de l'application du style :", error);
      return await repondre("_Une erreur s'est produite :(_");
    }
  }
);

ovlcmd(
    {
        nom_cmd: "blague",
        classe: "Funn",
        react: "😂",
        desc: "Renvoie une blague"
    },
    async (ms_org, ovl) => {
        try {
            let apiUrl = `https://v2.jokeapi.dev/joke/Any?lang=fr`;
            let response = await axios.get(apiUrl);
            let data = response.data;

            if (data.type === 'single') {
                ovl.sendMessage(ms_org, { text: `*Blague du jour :* ${data.joke}` });
            } else if (data.type === 'twopart') {
                ovl.sendMessage(ms_org, { text: `*Blague du jour :* ${data.setup}\n\n*Réponse :* ${data.delivery}` });
            } else {
                ovl.sendMessage(ms_org, { text: "Désolé, je n'ai pas trouvé de blague à vous raconter." });
            }
        } catch (error) {
            ovl.sendMessage(ms_org, { text: "Une erreur s'est produite lors de la récupération de la blague." });
        }
    }
);

ovlcmd(
    {
        nom_cmd: "citation",
        classe: "Fun",
        react: "💬",
        desc: "Renvoie une citation"
    },
    async (ms_org, ovl) => {
        try {
            let apiUrl = `https://api.frankfurter.app/citations/random`;
            let response = await axios.get(apiUrl);
            let data = response.data;

            if (data.quote) {
                ovl.sendMessage(ms_org, { text: `*Citation du jour :*\n"${data.quote}"\n\n*Auteur :* ${data.author}` });
            } else {
                ovl.sendMessage(ms_org, { text: "Désolé, je n'ai pas trouvé de citation à vous donner." });
            }
        } catch (error) {
            ovl.sendMessage(ms_org, { text: "Une erreur s'est produite lors de la récupération de la citation." });
        }
    }
);

