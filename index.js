const TelegramBot = require('node-telegram-bot-api');

// Remplacez 'YOUR_TOKEN' par le token de votre bot
const token = '6467806947:AAGL74S28MeTHz9qNwjA1cnb-f8sgUewPnM';

// Créer un bot qui utilise le token d'authentification
const bot = new TelegramBot(token, { polling: true });

// Commande '/start'
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Salut! Je suis votre bot Telegram.');
});

// Commande '/hello'
bot.onText(/\/hello/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Bonjour! Comment allez-vous?');
});

// Commande '/info'
bot.onText(/\/info/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Voici quelques informations sur moi...');
});

// Événement déclenché lorsque le bot reçoit un message texte
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const textReceived = msg.text;

  // Répondre à un message spécifique
  if (textReceived.toLowerCase().includes('salut')) {
    // Envoyer un message de salutation avec une image
    bot.sendPhoto(chatId, 'https://telegra.ph/file/2d1eabc6e026cdb542395.jpg' , { caption: 'Salut! Voici une image.' });
  }
});
