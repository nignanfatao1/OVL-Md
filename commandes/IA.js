const { ovlcmd } = require("../framework/ovlcmd");
const axios = require("axios");

ovlcmd(
    {
        nom_cmd: "gpt4",
        classe: "IA",
        react: "💻",
        desc: "Gpt4-o"
    },
    async (ms_org, ovl, cmd_options) => {
        const { arg, ms } = cmd_options;
        if (!arg.length) {
            return ovl.sendMessage(ms_org, { text: "Veuillez entrer un texte à envoyer à l'IA." }, { quoted: ms });
        }
        const mess = arg.join(" ");
        const options = {
            method: "POST",
            url: "https://gpt-4o.p.rapidapi.com/chat/completions",
            headers: {
                "x-rapidapi-key": "66a4b7257cmsh2e35c611d4b6922p1d5949jsn2e4e9cf6a807",
                "x-rapidapi-host": "gpt-4o.p.rapidapi.com",
                "Content-Type": "application/json",
            },
            data: {
                model: "gpt-4o",
                messages: [
                    {
                        role: "user",
                        content: mess,
                    },
                ],
            },
        };
        try {
            const response = await axios.request(options);
            const replyContent = response.data;
            await ovl.sendMessage(ms_org, { text: replyContent }, { quoted: ms });
        } catch (error) {
            console.error(error);
            await ovl.sendMessage(ms_org, { text: "Une erreur s'est produite en essayant de contacter l'API." }, { quoted: ms });
        }
    }
);

/*ovlcmd(
    {
        nom_cmd: "test",
        classe: "IA",
        react: "💻",
        desc: "Gpt4-o"
    },
    async (ms_org, ovl, cmd_options) => {
        try {
                      
        } catch (error) {
            console.error("Erreur lors de l'envoi du message:", error.message || error);
        }
    }
);*/
