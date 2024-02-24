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
