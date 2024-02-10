const TelegramBot = require('node-telegram-bot-api');

// Remplacez 'YOUR_TOKEN' par le token de votre bot
const token = '6467806947:AAGL74S28MeTHz9qNwjA1cnb-f8sgUewPnM';

// Créer un bot qui utilise le token d'authentification
const bot = new TelegramBot(token, { polling: true });

   function repondre(mes) { bot.sendMessage(chatId, mes);
}
function image(mes1,mes2) { bot.sendPhoto(chatId, mes1 , { caption: mes2 });
  }
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

  // Répondre à un message specifique
  if (textReceived.toLowerCase().includes('salut')) {
    // Envoyer un message de salutation avec une image
    bot.sendPhoto(chatIdl, 'https://telegra.ph/file/2d1eabc6e026cdb542395.jpg' , { caption: 'Salut! Voici une image.' });
  }
});
               const arg = 
                var idBot = decodeJid(zk.user.id);
                var servBot = idBot.split('@')[0];
                const nomAuteurMessage = msg.pushName;
                const fatao = '5829888322' ;
                const white = '6912879147' ;
                const superUser = [servBot, fatao, white, Conf.SUDO_ID | "");
                
                console.log("[][]...{NEOverse-Md}...[][]");
                console.log("=========== Nouveau message ===========");
                console.log(`message envoyé par : ${nomAuteurMessage}`);
                console.log("------ contenu du message ------");
                console.log(textReceived);
function mybotpic() {
   const liens = 
      // Générer un indice aléatoire entre 0 (inclus) et la longueur du tableau (exclus)
      const indiceAleatoire = Math.floor(Math.random() * liens.length);
      // Récupérer le lien correspondant à l'indice aléatoire
      const lienAleatoire = liens[indiceAleatoire];
      return lienAleatoire;
    }


var commandeOptions = {
                    superUser, dev, arg, 
                   mybotpic, image
                
                };
