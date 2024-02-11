const TelegramBot = require('node-telegram-bot-api');
const conf = require('../set');

// Remplacez 'YOUR_TOKEN' par le token de votre bot
const token = '6467806947:AAGL74S28MeTHz9qNwjA1cnb-f8sgUewPnM';

// Créer un bot qui utilise le token d'authentification
const bot = new TelegramBot(token, { polling: true });

// Liste des super utilisateurs
const superUser = ['@NEOverse_2k24_bot', '5829888322', '6912879147', conf.SUDO_ID || ''];

// Déclaration des variables globales
let chatId, textReceived, userId, nomAuteurMessage;

// Fonction pour répondre à un message
function repondre(message) {
    bot.sendMessage(chatId, message);
}

// Fonction pour envoyer une image avec une légende
function image(imageUrl, caption) {
    bot.sendPhoto(chatId, imageUrl, { caption: caption });
}
// Fonction pour envoyer une video avec une légende
function video(videoUrl, caption) {
    bot.sendVideo(chatId, videoUrl, { caption: caption });
}

// Fonction pour obtenir un lien aléatoire
function mybotpic() {
    const liens = ['https://telegra.ph/file/e4f27e467089eb3e31463.jpg', 'https://telegra.ph/file/00fd279ccd45bef04b52a.jpg', 'https://telegra.ph/file/d8a070a1d819297ed8b29.jpg', 'https://telegra.ph/file/e9128988e705cc33ce72f.jpg'];
    const indiceAleatoire = Math.floor(Math.random() * liens.length);
    const lienAleatoire = liens[indiceAleatoire];
    return lienAleatoire;
}

// Événement déclenché lorsque le bot reçoit un message texte
bot.on('message', (msg) => {
    // Mise à jour des variables globales
     chatId = msg.chat.id;
     textReceived = msg.text;
     userId = msg.from.id; // if (superUser.includes(userId))
     nomAuteurMessage = msg.pushName;

    // Extraction des parties du message, en excluant le premier élément (la commande)
    const arg = textReceived.split(' ').slice(1);

    // Affichage des informations sur le message reçu
    console.log("[][]...{NEOverse-Md}...[][]");
    console.log("=========== Nouveau message ===========");
    console.log(`Message envoyé par : ${nomAuteurMessage}`);
    console.log("------ Contenu du message ------");
    console.log(textReceived);
    // Autres traitements en fonction du message reçu...
});

// Options de commande
const commandeOptions = {
    superUser, // Utilisateurs ayant des privilèges spéciaux
    arg, // Arguments de la commande (extrait du message texte)
    mybotpic, // Fonction pour obtenir un lien aléatoire
    image, // Fonction pour envoyer une image
    video, //Fonction pour envoyer une video
    userId,
    repondre // Fonction pour répondre à un message
};

