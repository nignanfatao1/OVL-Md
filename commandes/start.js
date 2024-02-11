async (bot, commandeOptions) => {
    let { repondre } = commandeOptions;
    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        const nomAuteurMessage = msg.pushName;
        let nss = `${nomAuteurMessage} salut je suis votre bot telegram`;
        repondre(chatId, nss);
    });
};
