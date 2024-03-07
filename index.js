const baileys_1 = require("@whiskeysockets/baileys");
const logger_1 = require("@whiskeysockets/baileys/lib/Utils/logger");
const logger = logger_1.default.child({});
logger.level = 'silent';
const conf = require("./set");
const fs = require("fs-extra");
const pino = require("pino");
const path = require('path');
const boom_1 = require("@hapi/boom");

const session = conf.SESSION_ID || "";
const prefixe = conf.PREFIXE || "";

async function authentication() {
    try {
        const credsFilePath = __dirname + "/auth_info_baileys/creds.json";
        if (!fs.existsSync(credsFilePath) || (fs.existsSync(credsFilePath) && session !== "ovl")) {
            console.log("Connexion en cours...");
            await fs.writeFileSync(credsFilePath, atob(session), "utf8");
        }
    } catch (error) {
        console.error(error);
        console.log("Session invalide: " + error);
        return;
    }
}

authentication();

const store = baileys_1.makeInMemoryStore({
    logger: pino().child({ level: "silent", stream: "store" }),
});

async function main() {
    try {
        const { version } = await baileys_1.fetchLatestBaileysVersion();
        const { state, saveCreds } = await baileys_1.useMultiFileAuthState(__dirname + "/auth_info_baileys");
        const { Browsers } = require("@sampandey001/baileys");

            const sockOptions = {
            version,
            logger: pino({ level: "silent" }),
            browser: Browsers.baileys("Desktop"),
            printQRInTerminal: true,
            fireInitQueries: false,
            shouldSyncHistoryMessage: true,
            downloadHistory: true,
            syncFullHistory: true,
            generateHighQualityLinkPreview: true,
            markOnlineOnConnect: false,
            keepAliveIntervalMs: 30_000,
            auth: state, 
            getMessage: async (key) => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id, undefined);
                    return msg.message || undefined;
                }
                return {
                    conversation: 'An Error Occurred, Repeat Command!'
                };
            }
        };

        const ovl = baileys_1.default(sockOptions);

        ovl.ev.on("messages.upsert", async (m) => {
            const { messages } = m;
            const ms = messages[0];
            if (!ms.message) return;

            // Votre logique de gestion de message ici

            const decodeJid = (jid) => {
                if (!jid)
                    return jid;
                if (/:\d+@/gi.test(jid)) {
                    let decode = (0, baileys_1.jidDecode)(jid) || {};
                    return decode.user && decode.server && decode.user + '@' + decode.server || jid;
                }
                else
                    return jid;
            };
            var mtype = (0, baileys_1.getContentType)(ms.message);
            var texte = mtype == "conversation" ? ms.message.conversation : mtype == "imageMessage" ? ms.message.imageMessage?.caption : mtype == "videoMessage" ? ms.message.videoMessage?.caption : mtype == "extendedTextMessage" ? ms.message?.extendedTextMessage?.text : mtype == "buttonsResponseMessage" ?
                ms?.message?.buttonsResponseMessage?.selectedButtonId : mtype == "listResponseMessage" ?
                ms.message?.listResponseMessage?.singleSelectReply?.selectedRowId : mtype == "messageContextInfo" ?
                (ms?.message?.buttonsResponseMessage?.selectedButtonId || ms.message?.listResponseMessage?.singleSelectReply?.selectedRowId || ms.text) : "";
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
        });

        // Gestion des événements de connexion
        ovl.ev.on("connection.update", async (con) => {
            const { connection, lastDisconnect } = con;
            if (connection === "connecting") {
                console.log("ℹ️ Connexion en cours...");
            } else if (connection === 'open') {
                console.log("✅ Connexion réussie! ☺️");
                console.log("--");
                await (0, baileys_1.delay)(200);
                console.log("------");
                await (0, baileys_1.delay)(300);
                console.log("------------------/-----");
                console.log("Le bot est en ligne 🕸\n\n");
                // Chargement des commandes 
                console.log("Chargement des commandes ...\n");
                fs.readdirSync(__dirname + "/commandes").forEach((fichier) => {
                    if (path.extname(fichier).toLowerCase() == (".js")) {
                        try {
                            require(__dirname + "/commandes/" + fichier);
                            console.log(fichier + " installé ✔️");
                        }
                        catch (e) {
                            console.log(`${fichier} n'a pas pu être chargé pour les raisons suivantes : ${e}`);
                        }
                    }
                    (0, baileys_1.delay)(300);
                });
                (0, baileys_1.delay)(700);
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
                    let raisonDeconnexion = new boom_1.Boom(lastDisconnect?.error)?.output.statusCode;
                    if (raisonDeconnexion === baileys_1.DisconnectReason.badSession) {
                        console.log('Session id érronée veuillez rescanner le qr svp ...');
                    }
                    else if (raisonDeconnexion === baileys_1.DisconnectReason.connectionClosed) {
                        console.log('!!! connexion fermée, reconnexion en cours ...');
                        main();
                    }
                    else if (raisonDeconnexion === baileys_1.DisconnectReason.connectionLost) {
                        console.log('connexion au serveur perdue 😞 ,,, reconnexion en cours ... ');
                        main();
                    }
                    else if (raisonDeconnexion === baileys_1.DisconnectReason?.connectionReplaced) {
                        console.log('connexion réplacée ,,, une sesssion est déjà ouverte veuillez la fermer svp !!!');
                    }
                    else if (raisonDeconnexion === baileys_1.DisconnectReason.loggedOut) {
                        console.log('vous êtes déconnecté,,, veuillez rescanner le code qr svp');
                    }
                    else if (raisonDeconnexion === baileys_1.DisconnectReason.restartRequired) {
                        console.log('redémarrage en cours ▶️');
                        main();
                    }
                    else {

                        console.log('redemarrage sur le coup de l\'erreur  ',raisonDeconnexion) ;         
                        //repondre("* Redémarrage du bot en cour ...*");

                                    const {exec}=require("child_process") ;

                                    exec("pm2 restart all");            
                    }
                    // sleep(50000)
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
