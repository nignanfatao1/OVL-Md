const baileys_1 = require("@whiskeysockets/baileys");
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

async function authentification() {
    try {
        if (!fs.existsSync(__dirname + "/auth_info_baileys/creds.json")) {
            console.log("connexion en cours ...");
            await fs.writeFileSync(__dirname + "/auth_info_baileys/creds.json", atob(session), "utf8");
        } else if (fs.existsSync(__dirname + "/auth_info_baileys/creds.json") && session !== "ovl") {
            await fs.writeFileSync(__dirname + "/auth_info_baileys/creds.json", atob(session), "utf8");
        }
    } catch (e) {
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
            auth_info_baileys: {
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
        });
    }
        main()
});
