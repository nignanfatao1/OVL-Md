const fs = require('fs');
const pino = require("pino");
const path = require('path');
const { exec } = require("child_process");
const { default: makeWASocket, useMultiFileAuthState, delay, makeCacheableSignalKeyStore, jidDecode, getContentType, makeInMemoryStore, fetchLatestBaileysVersion, DisconnectReason } = require("@whiskeysockets/baileys");
const boom = require("@hapi/boom");
const conf = require("./set");
//const { jidDecode, getContentType } = require("@whiskeysockets/baileys");
const baileys_1 = require("@whiskeysockets/baileys");
//const logger_1 = require("@whiskeysockets/baileys/lib/Utils/logger");
//const boom_1 = require("@hapi/boom");
const session = conf.SESSION_ID || "";


async function ovlAuth() {
    try {
        const credsFilePath = './auth/creds.json';
        const sessionData = Buffer.from(session, 'base64').toString('utf8');

        if (!fs.existsSync(credsFilePath) || (fs.existsSync(credsFilePath) && session !== "ovl")) {
            console.log("Connexion en cours...");
            await fs.promises.writeFile(credsFilePath, sessionData, "utf8");
            //console.log('auth edité');

            // Vérification après écriture
            const writtenData = await fs.promises.readFile(credsFilePath, "utf8");
            if (writtenData === sessionData) {
                console.log("Les informations de connexion ont été correctement écrites dans le fichier.");
            } else {
                console.log("Erreur lors de l'écriture des informations de connexion dans le fichier.");
            }
        }
    } catch (error) {
        console.error(error);
        console.log("Session invalide: " + error);
        return;
    }
}


ovlAuth();

async function main() {
    const { version, isLatest } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState("./auth");
    try {
        const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store"
  })
});
        let ovl = makeWASocket({
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
            keepAliveIntervalMs: 20000,
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
        
        /*ovl.ev.on("messages.upsert", async (m) => {
            const { messages } = m;
            const ms = messages[0];
            if (!ms.message) return;
            const decodeJid = (jid) => {
                if (!jid) return jid;
                if (/:\d+@/gi.test(jid)) {
                    let decode = jidDecode(jid) || {};
                    return decode.user && decode.server && `${decode.user}@${decode.server}` || jid;
                }
                return jid;
            };

            var mtype = getContentType(ms.message);
            var texte = mtype == "conversation" ? ms.message.conversation :
                mtype == "imageMessage" ? ms.message.imageMessage?.caption :
                mtype == "videoMessage" ? ms.message.videoMessage?.caption :
                mtype == "extendedTextMessage" ? ms.message?.extendedTextMessage?.text :
                mtype == "buttonsResponseMessage" ? ms?.message?.buttonsResponseMessage?.selectedButtonId :
                mtype == "listResponseMessage" ? ms.message?.listResponseMessage?.singleSelectReply?.selectedRowId :
                mtype == "message
                ContextInfo" ? (ms?.message?.buttonsResponseMessage?.selectedButtonId || ms.message?.listResponseMessage?.singleSelectReply?.selectedRowId || ms.text) : "";

            var origineMessage = ms.key.remoteJid;
            var idBot = decodeJid(ovl.user.id);
            var servBot = idBot.split('@')[0];
            const verifGroupe = origineMessage?.endsWith("@g.us");
            var infosGroupe = verifGroupe ? await ovl.groupMetadata(origineMessage) : "";
            var nomGroupe = verifGroupe ? infosGroupe.subject : "";
            var msgRepondu = ms.message.extendedTextMessage?.contextInfo?.quotedMessage;
            var auteurMsgRepondu = decodeJid(ms.message?.extendedTextMessage?.contextInfo?.participant);
            var mr = ms.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            var utilisateur = mr ? mr : msgRepondu ? auteurMsgRepondu : "";
            var auteurMessage = verifGroupe ? (ms.key.participant ? ms.key.participant : ms.participant) : origineMessage;
            if (ms.key.fromMe) {
                auteurMessage = idBot;
            }

            var membreGroupe = verifGroupe ? ms.key.participant : '';
            const nomAuteurMessage = ms.pushName;
            const verifCom = texte ? texte.startsWith(prefixe) : false;
            const com = verifCom ? texte.slice(1).trim().split(/ +/).shift().toLowerCase() : false;
            console.log("=========== Nouveau message ===========");
            if (verifGroupe) {
                console.log("Message provenant du groupe : " + nomGroupe);
            }
            console.log("Message envoyé par : " + "[" + nomAuteurMessage + " : " + auteurMessage.split("@s.whatsapp.net")[0] + " ]");
            console.log("Type de message : " + mtype);
            console.log("------ Contenu du message ------");
            console.log(texte);

            // Fonction pour répondre à un message
            function repondre(message) {
                ovl.sendMessage(origineMessage, { text: message }, { quoted: ms });
            }
        });*/

        ovl.ev.on("connection.update", async (con) => {
            const { connection, lastDisconnect } = con;
            if (connection === "connecting") {
                console.log("ℹ️ Connexion en cours...");
            } else if (connection === 'open')  {
                console.log("✅ Connexion réussie! ☺️");
                console.log("--");
                await delay(200);
                console.log("------");
                await delay(300);
                console.log("------------------/-----");
                console.log("Le bot est en ligne 🕸\n\n");
                console.log("Chargement des commandes ...\n");
                fs.readdirSync(path.join(__dirname, "commandes")).forEach((fichier) => {
                    if (path.extname(fichier).toLowerCase() == ".js") {
                        try {
                            require(path.join(__dirname, "commandes", fichier));
                            console.log(fichier + " installé ✔️");
                        } catch (e) {
                            console.log(`${fichier} n'a pas pu être chargé pour les raisons suivantes : ${e}`);
                        }
                    }
                    delay(300);
                });
                delay(700);
                let cmsg = `╔════◇
║ 『OVL-𝐌𝐃』
║    Prefix : [ ${prefixe} ]
║    Mode :
║    Nombre total de Commandes :︎
╚══════════════════╝

╔═════◇
║『𝗯𝘆 Fatao』
║ 
╚══════════════════╝`;
                await ovl.sendMessage(ovl.user.id, { text: cmsg });
            } else if (connection == "close") {
                let raisonDeconnexion = new boom.Boom(lastDisconnect?.error)?.output.statusCode;
                if (raisonDeconnexion === DisconnectReason.badSession) {
                    console.log('Session id érronée veuillez rescanner le qr svp ...');
                } else if (raisonDeconnexion === DisconnectReason.connectionClosed) {
                    console.log('!!! connexion fermée, reconnexion en cours ...');
                    main();
                } else if (raisonDeconnexion === DisconnectReason.connectionLost) {
                    console.log('connexion au serveur perdue 😞 ,,, reconnexion en cours ... ');
                    main();
                } else if (raisonDeconnexion === DisconnectReason.connectionReplaced) {
                    console.log('connexion réplacée ,,, une sesssion est déjà ouverte veuillez la fermer svp !!!');
                } else if (raisonDeconnexion === DisconnectReason.loggedOut) {
                    console.log('vous êtes déconnecté,,, veuillez rescanner le code qr svp');
                } else if (raisonDeconnexion === DisconnectReason.restartRequired) {
                    console.log('redémarrage en cours ▶️');
                    main();
                } else {
                    console.log('redemarrage sur le coup de l\'erreur ', raisonDeconnexion);
                    exec("pm2 restart all");
                }
                console.log("hum " + connection);
            }
        });

        // Gestion des mises à jour des identifiants
        ovl.ev.on("creds.update", saveCreds);
    } catch (error) {
        console.error("Erreur principale:", error);
    }
}

main();
