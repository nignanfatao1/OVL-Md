const fs = require('fs');
const pino = require("pino");
const path = require('path');
const axios = require("axios");
const { exec } = require("child_process");
const { default: makeWASocket, useMultiFileAuthState, delay, makeCacheableSignalKeyStore, jidDecode, getContentType, downloadContentFromMessage, makeInMemoryStore, fetchLatestBaileysVersion, DisconnectReason } = require("@whiskeysockets/baileys");
const boom = require("@hapi/boom");
const config = require("./set");
const session = config.SESSION_ID || "";
let evt = require(__dirname + "/framework/ovlcmd");
const FileType = require('file-type')
const prefixe = config.PREFIXE;
 
async function ovlAuth(session) {
    let sessionId;
    try {
        if (session.startsWith("Ovl-MD_") && session.endsWith("_SESSION-ID")) {
            sessionId = session.slice(7, -11);
        }
        console.log(sessionId);
        const response = await axios.get('https://pastebin.com/raw/' + sessionId);
        const data = response.data;
        const filePath = path.join(__dirname, 'auth', 'creds.json');

        // Vérifie si le fichier creds.json n'existe pas
        if (!fs.existsSync(filePath)) {
            console.log("connexion au bot en cours");
            await fs.writeFileSync(filePath, data, 'utf8');
            
            // Lit et affiche le contenu du fichier creds.json
            const sess = fs.readFileSync(filePath, 'utf8');
            console.log(sess);
        } else if (fs.existsSync(filePath) && session !== "ovl") {
            await fs.writeFileSync(filePath, data, 'utf8');
        }
    } catch (e) {
        console.log("Session invalide: " + e);
    }
}
// Appelez la fonction avec votre variable session
ovlAuth(session);

async function main() {
    const { version, isLatest } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'auth'));
        try {
        const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store"
  })
});
        const ovl = makeWASocket({
            version, 
            printQRInTerminal: true,
            logger: pino({ level: "silent" }),
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            fireInitQueries: false,
            shouldSyncHistoryMessage: true,
            downloadHistory: true,
            syncFullHistory: true,
            generateHighQualityLinkPreview: true,
            markOnlineOnConnect: false,
            keepAliveIntervalMs: 30000,
            auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" }))
        },
           getMessage: async (key) => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id, undefined);
                    return msg.message || undefined;
                }
                return {
                    conversation: 'An Error Occurred, Repeat Command!'
                };
           }
        });

         ovl.ev.on("messages.upsert", async (m) => {
    const { messages } = m;
    const ms = messages[0];
    if (!ms.message) return;
    
    const decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return (decode.user && decode.server && `${decode.user}@${decode.server}`) || jid;
        }
        return jid;
    };

    var mtype = getContentType(ms.message);
    var texte = mtype === "conversation" ? ms.message.conversation :
        mtype === "imageMessage" ? ms.message.imageMessage?.caption :
        mtype === "videoMessage" ? ms.message.videoMessage?.caption :
        mtype === "extendedTextMessage" ? ms.message.extendedTextMessage?.text :
        mtype === "buttonsResponseMessage" ? ms.message.buttonsResponseMessage?.selectedButtonId :
        mtype === "listResponseMessage" ? ms.message.listResponseMessage?.singleSelectReply?.selectedRowId :
        mtype === "messageContextInfo" ? (ms.message.buttonsResponseMessage?.selectedButtonId || ms.message.listResponseMessage?.singleSelectReply?.selectedRowId || ms.text) : "";

    var ms_org = ms.key.remoteJid;
    var id_Bot = decodeJid(ovl.user.id);
    const verif_Groupe = ms_org?.endsWith("@g.us");
    var infos_Groupe = verif_Groupe ? await ovl.groupMetadata(ms_org) : "";
    var nom_Groupe = verif_Groupe ? infos_Groupe.subject : "";
    var msg_Repondu = ms.message.extendedTextMessage?.contextInfo?.quotedMessage;
    var auteur_Msg_Repondu = decodeJid(ms.message.extendedTextMessage?.contextInfo?.participant);
    var mr = ms.message.extendedTextMessage?.contextInfo?.mentionedJid;
    var user = mr || msg_Repondu ? auteur_Msg_Repondu : "";
    var auteur_Message = verif_Groupe ? ms.key.participant || ms.participant : ms_org;
    if (ms.key.fromMe) {
        auteur_Message = id_Bot;
    }

    var membre_Groupe = verif_Groupe ? ms.key.participant : '';
    const nom_Auteur_Message = ms.pushName;
    const arg = texte ? texte.trim().split(/ +/).slice(1) : null;
    const verif_Cmd = texte ? texte.startsWith(prefixe) : false;
    const cmds = verif_Cmd ? texte.slice(1).trim().split(/ +/).shift().toLowerCase() : false;

    function groupe_Admin(membre_Groupe) {
        let admin = [];
        for (let m of membre_Groupe) {
            if (m.admin != null) admin.push(m.id);
        }
        return admin;
    }

    function bot_pic() {
        const indiceAleatoire = Math.floor(Math.random() * liens.length);
        return liens[indiceAleatoire];
    }

    const mbre_membre = verif_Groupe ? await infos_Groupe.participants : '';
    let admins = verif_Groupe ? groupe_Admin(mbre_membre) : '';
    const verif_Admin = verif_Groupe ? admins.includes(auteur_Message) : false;
    const verif_Ovl_Admin = verif_Groupe ? admins.includes(id_Bot) : false;

    const cmd_options = {
        verif_Groupe,
        mbre_membre,
        membre_Groupe,
        verif_Admin,
        infos_Groupe,
        nom_Groupe,
        auteur_Message,
        nom_Auteur_Message,
        id_Bot,
        verif_Ovl_Admin,
        prefixe,
        arg,
        repondre,
        groupe_Admin,
        msg_Repondu,
        auteur_Msg_Repondu,
        ms, 
        ms_org, 
        bot_pic
    };

    console.log("{}=={} OVL-MD LOG-MESSAGES {}=={}");
    if (verif_Groupe) {
        console.log("Groupe: " + nom_Groupe);
    }
    console.log("Auteur message: " + `[${nom_Auteur_Message} : ${auteur_Message.split("@s.whatsapp.net")[0]}]`);
    console.log("Message:");
    console.log(texte);

    function repondre(message) {
        ovl.sendMessage(ms_org, { text: message }, { quoted: ms });
    }

    if (verif_Cmd) { 
        const cd = evt.cmd.find((ovlcmd) => ovlcmd.nom_cmd === cmds || (ovlcmd.alias && ovlcmd.alias.includes(cmds)));
        
        if (cd) {
            try { 
                await ovl.sendMessage(ms_org, { react: { text: cd.reaction, key: ms.key } });
                cd.fonction(ms_org, ovl, cmd_options);
            } catch (e) {
                console.log("Erreur: " + e);
                ovl.sendMessage(ms_org, { text: "Erreur: " + e }, { quoted: ms });
            }
        }
    }
}); //fin événement message 

        const Disconnection = (raisonDeconnexion) => {
    switch (raisonDeconnexion) {
        case DisconnectReason.badSession:
            console.log('Session ID incorrecte, veuillez obtenir une nouvelle session via QR-code/Pairing.');
            break;
        case DisconnectReason.connectionClosed:
            console.log('Connexion fermée, tentative de reconnexion...');
            main();
            break;
        case DisconnectReason.connectionLost:
            console.log('Connexion au serveur perdue. Reconnexion en cours...');
            main();
            break;
        case DisconnectReason.connectionReplaced:
            console.log('Connexion remplacée. Une autre session est déjà active.');
            break;
        case DisconnectReason.loggedOut:
            console.log('Déconnecté. Veuillez obtenir une nouvelle session via QR-code/Pairing.');
            break;
        case DisconnectReason.restartRequired:
            console.log('Redémarrage requis. Redémarrage du bot...');
            main();
            break;
        default:
            console.log('Erreur inconnue:', raisonDeconnexion);
            exec("pm2 restart all");
    }
};

ovl.ev.on("connection.update", async (con) => {
    const { connection, lastDisconnect } = con;

    if (connection === "connecting") {
        console.log("🌐 Connexion à WhatsApp en cours...");
    } else if (connection === 'open') {
        console.log("✅ Connexion établie ; Le bot est en ligne 🌐\n\n");
        
        console.log("Chargement des commandes...\n");
        const commandes = fs.readdirSync(path.join(__dirname, "commandes")).filter(fichier => path.extname(fichier).toLowerCase() === ".js");
        
        for (const fichier of commandes) {
            try {
                require(path.join(__dirname, "commandes", fichier));
                console.log(`${fichier} installé avec succès`);
                await  delay(300); // Pause de 300 ms
            } catch (e) {
                console.log(`Erreur lors du chargement de ${fichier} :    ${e}`);
            }
        }
        delay(700);
     let start_msg = `╭────《 OVL-MD 》─────⊷
⫸  *Préfixe*       : ${prefixe}
⫸  *Mode*          : Public
⫸  *Commandes*     : ${evt.cmd.length}

         𝙈𝙖𝙙𝙚 𝙗𝙮 Ainz`;
        await ovl.sendMessage(ovl.user.id, { text: start_msg });
        
    } else if (connection === "close") {
        const raisonDeconnexion = new boom.Boom(lastDisconnect?.error)?.output.statusCode;
        Disconnection(raisonDeconnexion);
        console.log("Statut de la connexion : " + connection);
    }
});

        
        // Gestion des mises à jour des identifiants
        ovl.ev.on("creds.update", saveCreds);

            //autre fonction de ovl
            ovl.dl_save_media_ms = async (message, filename = '', attachExtension = true, directory = './downloads') => {
    try {
        const quoted = message.msg || message;
        const mime = quoted.mimetype || '';
        const messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
        
        console.log(`Téléchargement du message de type: ${messageType}`);
        
        if (!mime) {
            throw new Error("Type MIME non spécifié ou non pris en charge.");
        }

        const stream = await downloadContentFromMessage(quoted, messageType);
        const bufferChunks = [];
        for await (const chunk of stream) {
            bufferChunks.push(chunk);
        }
        
        const buffer = Buffer.concat(bufferChunks);
        const type = await FileType.fromBuffer(buffer);
        if (!type) {
            throw new Error("Type de fichier non reconnu");
        }

        // Création du chemin du répertoire
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
        
        const trueFileName = attachExtension ? `${filename}.${type.ext}` : filename;
        const filePath = path.resolve(directory, trueFileName);

        // Écriture directe dans un fichier via un flux de création
        await fs.promises.writeFile(filePath, buffer);
        console.log(`Fichier sauvegardé à: ${filePath}`);
        
        return filePath;
    } catch (error) {
        console.error('Erreur lors du téléchargement et de la sauvegarde du fichier:', error);
        throw error;
    }
};
            //fin autre fonction ovl
    } catch (error) {
        console.error("Erreur principale:", error);
    }
}

main();


const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Assurez-vous d'ajouter cette ligne pour définir le port

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Page d'accueil pour OVL-MD Bot">
    <title>OVL-Bot Web Page</title>
    <style>
        /* Reset */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        /* Body styling */
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #121212;
            font-family: Arial, sans-serif;
            color: #ffffff;
            overflow: hidden;
        }

        /* Content box styling */
        .content {
            text-align: center;
            padding: 30px;
            background-color: #1e1e1e;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(255, 255, 255, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        /* Content hover effect */
        .content:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 30px rgba(255, 255, 255, 0.15);
        }

        /* Heading styling */
        h1 {
            font-size: 2em;
            color: #f0f0f0;
            margin-bottom: 15px;
            letter-spacing: 1px;
        }

        /* Text paragraph styling */
        p {
            font-size: 1.1em;
            color: #d3d3d3;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="content">
        <h1>Bienvenue sur OVL-MD</h1>
        <p>Votre assistant WhatsApp</p>
    </div>
</body>
</html>`);
});

app.listen(port, () => {
  console.log("Listening on port: " + port);
});
