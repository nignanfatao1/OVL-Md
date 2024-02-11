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

function arg(text) {
    const arguments = text.split(' ').slice(1)
    return arguments;
}

module.exports = { bot, dev, repondre, image, video, arg };
