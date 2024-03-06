/*const baileys_1 = require("@whiskeysockets/baileys");
const logger_1 = require("@whiskeysockets/baileys/lib/Utils/logger");
const logger = logger_1.default.child({});
logger.level = 'silent';
const boom_1 = require("@hapi/boom");
const conf = require("./set");
const axios = require("axios");
const pino = require("pino");
const { toBuffer } = require("qrcode");
const path = require('path');
const fs = require("fs-extra");
const session = conf.SESSION_ID || "";
const prefixe = conf.PREFIXE || "";

async function authentification() {
    try {
        if (!fs.existsSync(__dirname + "/auth_info_baileys/creds.json")) {
            console.log("connexion en cours ...");
            await fs.writeFileSync(__dirname + "/auth_info_baileys/creds.json", atob(session), "utf8");
        } else if (fs.existsSync(__dirname + "/auth_info_baileys/creds.json") && session !== "ovl") {
            await fs.writeFileSync(__dirname + "/auth_info_baileys/creds.json", atob(session), "utf8");
        }
    } catch (e) {
        console.error(e);
        console.log("Session Invalide " + e);
        return;
    }
}

authentification();

const store = baileys_1.makeInMemoryStore({
    logger: pino().child({ level: "silent", stream: "store" }),
});
setTimeout(async () => {
    async function main() {
        const { version, isLatest } = await baileys_1.fetchLatestBaileysVersion();
        const { state, saveCreds } = await baileys_1.useMultiFileAuthState(__dirname + "/auth_info_baileys");
        const sockOptions = {
            version,
            logger: pino({ level: "silent" }),
            browser: ['ovl-Md', "safari", "0.0.1"],
            printQRInTerminal: true,
            fireInitQueries: false,
            shouldSyncHistoryMessage: true,
            downloadHistory: true,
            syncFullHistory: true,
            generateHighQualityLinkPreview: true,
            markOnlineOnConnect: false,
            keepAliveIntervalMs: 30_000,
            auth: {
                creds: state.creds,
                keys: baileys_1.makeCacheableSignalKeyStore(state.keys, logger),
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
        };

        const ovl = baileys_1.default(sockOptions);

        ovl.ev.on("messages.upsert", async (m) => {
            const { messages } = m;
            const ms = messages[0];
            if (!ms.message) return;
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
                //ms.message.extendedTextMessage?.contextInfo?.mentionedJid
                // ms.message.extendedTextMessage?.contextInfo?.quotedMessage.
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
                    console.log("message provenant du groupe : " + nomGroupe);
                }
                console.log("message envoyé par : " + "[" + nomAuteurMessage + " : " + auteurMessage.split("@s.whatsapp.net")[0] + " ]");
                console.log("type de message : " + mtype);
                console.log("------ contenu du message ------");
                console.log(texte);
function repondre(mes) {
                ovl.sendMessage(origineMessage, { text: mes }, { quoted: ms });
            }

            // connections
            ovl.ev.on("connection.update", async (con) => {
                const { lastDisconnect, connection , receivedPendingNotifications } = con;
                if (connection === "connecting") {
                    console.log("ℹ️ Connexion en cours...");
                }
                else if (connection === 'open') {

    

                    console.log("✅ connexion reussie! ☺️");
                    console.log("--");
                    await (0, baileys_1.delay)(200);
                    console.log("------");
                    await (0, baileys_1.delay)(300);
                    console.log("------------------/-----");
                    console.log("le bot est en ligne 🕸\n\n");
                    //chargement des commandes 
                    console.log("chargement des commandes ...\n");
                    fs.readdirSync(__dirname + "/commandes").forEach((fichier) => {
                        if (path.extname(fichier).toLowerCase() == (".js")) {
                            try {
                                require(__dirname + "/commandes/" + fichier);
                                console.log(fichier + " installé ✔️");
                            }
                            catch (e) {
                                console.log(`${fichier} n'a pas pu être chargé pour les raisons suivantes : ${e}`);
                            } /* require(__dirname + "/commandes/" + fichier);
                             console.log(fichier + " installé ✔️")*/
                            (0, baileys_1.delay)(300);
                        }
                    });
                    (0, baileys_1.delay)(700);

                 /*   var md;
                    if ((conf.MODE).toLowerCase() === "oui") {
                        md = "public";
                    }
                    else if ((conf.MODE).toLowerCase() === "non") {
                        md = "privé";
                    }
                    else {
                        md = "indéfini";
                    }*/
                    console.log("chargement des commandes terminé ✅");

                //    await activateCrons();
                   
           //      if((conf.DP).toLowerCase() === 'oui') {
                    let cmsg = `╔════◇
    ║ 『OVL-𝐌𝐃』
    ║    Prefix : [ ${prefixe} ]
    ║    Mode :
    ║    Nombre total de Commandes : ${evt.cm.length}︎
    ╚══════════════════╝
    
    ╔═════◇
    ║『𝗯𝘆 Fatao』
    ║ 
    ╚══════════════════╝`;
                   
                    await ovl.sendMessage(ovl.user.id, { text: cmsg });
                 }
                else if (connection == "close") {
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
                    main(); //console.log(session)
                }
            });
            //fin événement connexion
            //événement authentification 
            ovl.ev.on("creds.update", saveCreds);
    console.log("Chargement des commandes...");
 /*   const commandsDir = path.join(__dirname, 'commandes');
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
        });
    }
        main()
});*/





const baileys_1 = require("@whiskeysockets/baileys");
const logger_1 = require("@whiskeysockets/baileys/lib/Utils/logger");
const logger = logger_1.default.child({});
logger.level = 'silent';
const conf = require("./set");
const fs = require("fs-extra");
const pino = require("pino");
const path = require('path');

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
        const sockOptions = {
            version,
            logger: pino({ level: "silent" }),
            browser: ['ovl-Md', "safari", "0.0.1"],
            printQRInTerminal: true,
            fireInitQueries: false,
            shouldSyncHistoryMessage: true,
            downloadHistory: true,
            syncFullHistory: true,
            generateHighQualityLinkPreview: true,
            markOnlineOnConnect: false,
            keepAliveIntervalMs: 30_000,
            auth: {
                creds: state.creds,
                keys: baileys_1.makeCacheableSignalKeyStore(state.keys, logger),
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
                 }
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
        ovl.ev.on("creds.update", saveCreds);
    } catch (error) {
        console.error("Erreur principale:", error);
    }
}

main();


