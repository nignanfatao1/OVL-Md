const { bot/*, repondre*/ } = require('../fonctions');
 bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        const nomAuteurMessage = msg.pushName;
        let nss = `${nomAuteurMessage} salut je suis votre bot telegram`;
        bot.sendMessage(chatId, nss);
    });
