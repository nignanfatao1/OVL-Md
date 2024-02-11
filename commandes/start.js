const { bot/*, repondre*/ } = require('../fonctions');
 bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        const nomAuteurMessage = msg.from.first_name;
        let nss = `${nomAuteurMessage} salut je suis NEOverse-Md un bot telegram developpé par @Fatao_2580`;
        bot.sendMessage(chatId, nss);
    });
