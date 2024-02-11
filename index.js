const fs = require('fs');
const path = require('path');
const { bot } = require('./fonctions');

// Fonction pour charger les commandes depuis les fichiers externes
async function loadCommands() {
    console.log("Chargement des commandes...");
    const commandsDir = path.join(__dirname, 'commandes');
    try {
        const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            try {
                // Exécute la commande exportée depuis le fichier
                require(path.join(commandsDir, file))(bot);
                console.log(`${file} installé ✔️`);
                await delay(300); // Attend 300 millisecondes entre chaque chargement de commande
            } catch (error) {
                console.error(`Erreur lors du chargement de ${file}: ${error.message}`);
            }
        }
        console.log("Chargement des commandes terminé ✅");
    } catch (error) {
        console.error('Erreur lors du chargement des commandes:', error);
    }
}

// Fonction pour retarder l'exécution
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Appel à la fonction pour charger les commandes
loadCommands();

// Gestion des erreurs
bot.on('polling_error', (error) => {
    console.error('Erreur de polling:', error);
});

bot.on('webhook_error', (error) => {
    console.error('Erreur de webhook:', error);
});

// Affichage des messages reçus sur la console
bot.on('message', (msg) => {
    // Mise à jour des variables globales
    const chatId = msg.chat.id;
    const textReceived = msg.text;
    const userId = msg.from.id;
    const nomAuteurMessage = msg.from.first_name;

    // Affichage des informations sur le message reçu
    console.log("[][]...{NEOverse-Md}...[][]");
    console.log("=========== Nouveau message ===========");
    console.log(`Message envoyé par : ${nomAuteurMessage}`);
    console.log("Contenu du message : ", textReceived);
    console.log("=========== Fin du message ===========");
});

bot.on('error', (error) => {
    console.error('Erreur:', error);
});
