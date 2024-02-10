const TelegramBot = require('node-telegram-bot-api');

// Remplacez 'YOUR_TOKEN' par le token de votre bot
const token = '6467806947:AAGL74S28MeTHz9qNwjA1cnb-f8sgUewPnM';

// Créer un bot qui utilise le token d'authentification
const bot = new TelegramBot(token, { polling: true });

   function repondre(mes) { bot.sendMessage(chatId, mes);
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

                var idBot = decodeJid(zk.user.id);
                var servBot = idBot.split('@')[0];
                const verifGroupe = chatIdl?.endsWith("@g.us");
                var infosGroupe = verifGroupe ? await bot.groupMetadata(origineMessage) : "";
                var nomGroupe = verifGroupe ? infosGroupe.subject : "";
                var msgRepondu = ms.message.extendedTextMessage?.contextInfo?.quotedMessage;
                var auteurMsgRepondu = decodeJid(ms.message?.extendedTextMessage?.contextInfo?.participant);
                //ms.message.extendedTextMessage?.contextInfo?.mentionedJid
                // ms.message.extendedTextMessage?.contextInfo?.quotedMessage.
                var mr = ms.message?.extendedTextMessage?.contextInfo?.mentionedJid;
                var utilisateur = mr ? mr : msgRepondu ? auteurMsgRepondu : "";
                var auteurMessage = verifGroupe ? (ms.key.participant ? ms.key.participant : ms.participant) : origineMessage;
                if (ms.key.fromMe) {
                    auteurMessage = idBot;
                }
                
                var membreGroupe = verifGroupe ? ms.key.participant : '';
                const { getAllSudoNumbers } = require("./bdd/sudo");
                const nomAuteurMessage = msg.pushName;
                const fatao = '22651463203';
                const white = '2250748807131';
                const sudo = await getAllSudoNumbers();
                const superUserNumbers = [servBot, fatao, white, conf.NUMERO_OWNER].map((s) => s.replace(/[^0-9]/g) + "@s.whatsapp.net");
                const allAllowedNumbers = superUserNumbers.concat(sudo);
                const superUser = allAllowedNumbers.includes(auteurMessage);
                
                var dev = [fatao, white].map((t) => t.replace(/[^0-9]/g) + "@s.whatsapp.net").includes(auteurMessage);
               console.log("\t [][]...{NEOverse-Md}...[][]");
                console.log("=========== Nouveau message ===========");
                if (verifGroupe) {
                    console.log("message provenant du groupe : " + nomGroupe);
                }
                console.log("message envoyé par : " + "[" + nomAuteurMessage + " : " + auteurMessage.split("@s.whatsapp.net")[0] + " ]");
                console.log("------ contenu du message ------");
                console.log(textReceived);

const arg = textReceived ? textReceived.trim().split(/ +/).slice(1) : null;
                const verifCom = textReceived ? textReceived.startsWith(prefixe) : false;
                const com = verifCom ? textReceived.slice(1).trim().split(/ +/).shift().toLowerCase() : false;

const liens = conf.URL.split(',');

function mybotpic() {
      // Générer un indice aléatoire entre 0 (inclus) et la longueur du tableau (exclus)
      const indiceAleatoire = Math.floor(Math.random() * liens.length);
      // Récupérer le lien correspondant à l'indice aléatoire
      const lienAleatoire = liens[indiceAleatoire];
      return lienAleatoire;
    }


var commandeOptions = {
                    superUser, dev,
                    verifGroupe,
                    mbre,
                    membreGroupe,
                    verifAdmin,
                    infosGroupe,
                    nomGroupe,
                    auteurMessage,
                    nomAuteurMessage,
                    idBot,
                    verifZokouAdmin,
                    prefixe,
                    arg,
                    repondre,
                    mtype,
                    groupeAdmin,
                    msgRepondu,
                    auteurMsgRepondu,
                    ms,
                   mybotpic
                
                };
