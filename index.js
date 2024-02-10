const TelegramBot = require('node-telegram-bot-api');
const conf = require('../set');

// Remplacez 'YOUR_TOKEN' par le token de votre bot
const token = '6467806947:AAGL74S28MeTHz9qNwjA1cnb-f8sgUewPnM';

// Créer un bot qui utilise le token d'authentification
const bot = new TelegramBot(token, { polling: true });
let chatId, textReceived, userId, nomAuteurMessage;

// Événement déclenché lorsque le bot reçoit un message texte
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const textReceived = msg.text;
  const userId = msg.from.id;
  const nomAuteurMessage = msg.pushName;

function repondre(mes) { bot.sendMessage(chatId, mes);
};
function image(mes1,mes2) { bot.sendPhoto(chatId, mes1 , { caption: mes2 });
  };

  // Répondre à un message specifique
  //if (textReceived.toLowerCase().includes('salut'))
                const arg = textReceived.split(' ');
                const Bot = '@NEOverse_2k24_bot';
                const fatao = '5829888322';
                const white = '6912879147';
                const superUser = [Bot, fatao, white, conf.SUDO_ID || "");
                
                console.log("[][]...{NEOverse-Md}...[][]");
                console.log("=========== Nouveau message ===========");
                console.log(`message envoyé par : ${nomAuteurMessage}`);
                console.log("------ contenu du message ------");
                console.log(textReceived);
function mybotpic() {
   const liens = ['https://telegra.ph/file/e4f27e467089eb3e31463.jpg' , 'https://telegra.ph/file/00fd279ccd45bef04b52a.jpg', 'https://telegra.ph/file/d8a070a1d819297ed8b29.jpg', 'https://telegra.ph/file/e9128988e705cc33ce72f.jpg'].split(',');     
      // Générer un indice aléatoire entre 0 (inclus) et la longueur du tableau (exclus)
      const indiceAleatoire = Math.floor(Math.random() * liens.length);
      // Récupérer le lien correspondant à l'indice aléatoire
      const lienAleatoire = liens[indiceAleatoire];
      return lienAleatoire;
    }


const commandeOptions = {
                    superUser, dev, arg, 
                   mybotpic,image,bot,repondre
                
                };

});
