const TelegramBot = require('node-telegram-bot-api');
const conf = require('./set');
const fs = require('fs');
const path = require('path');

// Remplacez 'YOUR_TOKEN' par le token de votre bot
const token = '6467806947:AAGL74S28MeTHz9qNwjA1cnb-f8sgUewPnM';
const bot = new TelegramBot(token, { polling: true });
async function main() {
// Fonction pour répondre à un message
function repondre(chatId, message) {
    bot.sendMessage(chatId, message);
}

// Fonction pour envoyer une image avec une légende
function image(chatId, imageUrl, caption) {
    bot.sendPhoto(chatId, imageUrl, { caption: caption });
}

// Fonction pour envoyer une vidéo avec une légende
function video(chatId, videoUrl, caption) {
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
    const chatId = msg.chat.id;
    const textReceived = msg.text;
  const  arg = textReceived.split(' ').slice(1);
    const userId = msg.from.id; // if (superUser.includes(userId))
    const nomAuteurMessage = msg.from.first_name;
  const  superUser = ['@NEOverse_2k24_bot', '5829888322', '6912879147', conf.SUDO_ID || ''];

    // Affichage des informations sur le message reçu
    console.log("[][]...{NEOverse-Md}...[][]");
    console.log("=========== Nouveau message ===========");
    console.log(`Message envoyé par : ${nomAuteurMessage}`);
    console.log("------ Contenu du message ------");
    console.log(textReceived);
    // Autres traitements en fonction du message reçu...

    // Options de commande
    const commandeOptions = {
        superUser,
        arg,
        mybotpic,
        image,
        userId,
        video,
        repondre
    };
});
    
async function loadCommands() {
    console.log("Chargement des commandes...");
    const commandsDir = path.join(__dirname, 'commandes');
    try {
        const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            try {
                require(path.join(commandsDir, file))(bot);
                console.log(`${file} installé ✔️`);
                await delay(300);
            } catch (error) {
                console.error(`Erreur lors du chargement de ${file}: ${error.message}`);
            }
        }
        console.log("Chargement des commandes terminé ✅");
    } catch (error) {
        console.error('Erreur lors du chargement des commandes:', error);
    }
}; loadCommands();
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Chargez les commandes lors de la connexion initiale du bot
bot.on('polling_error', (error) => {
    console.error('Erreur de polling:', error);
});

bot.on('webhook_error', (error) => {
    console.error('Erreur de webhook:', error);
});

bot.on('message', (msg) => {
    console.log('Message reçu:', msg);
});

bot.on('error', (error) => {
    console.error('Erreur:', error);
});

bot.on('polling_error', (error) => {
    console.error('Erreur de polling:', error);
});

bot.on('webhook_error', (error) => {
    console.error('Erreur de webhook:', error);
});

// Chargez les commandes lors de la connexion initiale du bot
main()
