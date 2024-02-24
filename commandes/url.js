const { bot} = require('../fonctions');
// Fonction pour gérer la commande /url
function handleUrlCommand(msg) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    // Vérifier s'il y a des photos dans le message
    if (msg.photo) {
        const photoUrls = msg.photo.map(photo => photo.file_id);
        bot.sendMessage(chatId, `URLs des photos : ${photoUrls.join('\n')}`);
    }

    // Vérifier s'il y a une vidéo dans le message
    if (msg.video) {
        const videoUrl = msg.video.file_id;
        bot.sendMessage(chatId, `URL de la vidéo : ${videoUrl}`);
    }

    // Autres types de fichiers média peuvent être traités de la même manière

    // Répondre au message original pour éviter la duplication
    bot.deleteMessage(chatId, messageId);
}

// Gestion de la commande /url
bot.onText(/^\/url/, handleUrlCommand);


// Commande pour taguer tous les membres d'un groupe
bot.onText(/^\/tagall/, (msg) => {
    const chatId = msg.chat.id;
    const groupId = msg.chat.type === 'group' ? chatId : null;
    
    // Récupérer la liste des membres du groupe
    bot.getChatMembersCount(groupId).then((count) => {
        // Taguer chaque membre du groupe
        for (let i = 0; i < count; i++) {
            bot.sendMessage(chatId, `@[${i}]`, { parse_mode: 'MarkdownV2' });
        }
    }).catch((error) => {
        console.error('Erreur lors de la récupération des membres du groupe:', error);
    });
});

