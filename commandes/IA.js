const { ovlcmd } = require("../framework/ovlcmd");
const axios = require("axios");

// Définir la clé API pour l'API erweima
const API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJncHQ0by11c2VyLTMyMzkyIiwicm5TdHIiOiJSUFFUb0Z3TldrZjJabGFpbkhHRjZ0aXRnU3JpZVd1cCJ9.zKrm9t5IBsircpubLEcp5Eyg5eNZJ_bOvXQwaOHk0Ac";
ovlcmd(
    {
        nom_cmd: "gpt",
        classe: "IA",
        react: "💬",
        desc: "Interagir avec GPT-4 et générer des images depuis la même API."
    },
    async (ms_org, ovl, cmd_options) => {
        const { arg, ms } = cmd_options;
        if (!arg.length) {
            return ovl.sendMessage(ms_org, { text: "Veuillez entrer un texte ou une description d'image." }, { quoted: ms });
        }

        const prompt = arg.join(" ");
        const apiUrl = "https://gpt4oso.erweima.ai/api/v1/gpt4o";

        try {
            const response = await axios.post(
                apiUrl,
                { input: prompt },
                { headers: { Authorization: API_KEY, "Content-Type": "application/json" } }
            );

            let textResponse = "";
            let imageUrl = null;

            for (const fragment of response.data) {
                const { data } = fragment;

                if (data.message_type === "text") {
                    textResponse += data.message;
                } else if (data.message_type === "image") {
                    imageUrl = data.url;
                }
            }

            // Si une image est générée
            if (imageUrl) {
                await ovl.sendMessage(ms_org, {
                    image: { url: imageUrl },
                    caption: textResponse.trim() || "Voici une image générée :",
                }, { quoted: ms });
            } else if (textResponse) {
                await ovl.sendMessage(ms_org, { text: textResponse.trim() }, { quoted: ms });
            } else {
                await ovl.sendMessage(ms_org, { text: "Aucune réponse valide n'a été retournée par l'API." }, { quoted: ms });
            }
        } catch (error) {
            console.error("Erreur API erweima :", error);
            await ovl.sendMessage(ms_org, { text: "Une erreur s'est produite lors de la communication avec l'API." }, { quoted: ms });
        }
    }
);
