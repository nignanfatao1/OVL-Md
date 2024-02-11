const TelegramBot = require('node-telegram-bot-api');
const conf = require('./set');

// Remplacez 'YOUR_BOT_TOKEN' par le token de votre bot
const token = '6467806947:AAGL74S28MeTHz9qNwjA1cnb-f8sgUewPnM';
const bot = new TelegramBot(token, { polling: true });
const dev = ['5829888322', '6912879147', conf.SUDO_ID || ''];

function repondre(chatId, message) {
    bot.sendMessage(chatId, message);
}

function image(chatId, imageUrl, caption) {
    bot.sendPhoto(chatId, imageUrl, { caption: caption });
}

function video(chatId, videoUrl, caption) {
    bot.sendVideo(chatId, videoUrl, { caption: caption });
}

function arg(msg) {
    if (msg.text) {
        return msg.text.split(' ').slice(1);
    } else {
        return [];
    }
}

function mybotpic() {
    const liens = [
        'https://telegra.ph/file/e4f27e467089eb3e31463.jpg', 
        'https://telegra.ph/file/00fd279ccd45bef04b52a.jpg', 
        'https://telegra.ph/file/d8a070a1d819297ed8b29.jpg', 
        'https://telegra.ph/file/e9128988e705cc33ce72f.jpg'
    ];
    const indiceAleatoire = Math.floor(Math.random() * liens.length);
    const lienAleatoire = liens[indiceAleatoire];
    return lienAleatoire;
}

module.exports = { bot, dev, repondre, image, video, arg, mybotpic };
