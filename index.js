const express = require("express");
const app = express();
const pino = require("pino");
const { toBuffer } = require("qrcode");
const path = require('path');
const fs = require("fs-extra");
const { Boom } = require("@hapi/boom");

const PORT = process.env.PORT || 5000;

async function authentification() {
        try {
            
            //console.log("le data "+data)
            if (!fs.existsSync(__dirname + "/auth_info_baileys/creds.json")) {
                console.log("connexion en cour ...");
                await fs.writeFileSync(__dirname + "/auth_info_baileys/creds.json", atob(session), "utf8");
                //console.log(session)
            }
            else if (fs.existsSync(__dirname + "/auth_info_baileys/creds.json") && session != "ovl") {
                await fs.writeFileSync(__dirname + "/auth_info_baileys/creds.json", atob(session), "utf8");
            }
        }
        catch (e) {
            console.log("Session Invalide " + e );
            return;
        }
    }
    authentification();
    const store = (0, baileys_1.makeInMemoryStore)({
        logger: pino().child({ level: "silent", stream: "store" }),
    });
    setTimeout(() => {
        async function main() {
            const { version, isLatest } = await (0, baileys_1.fetchLatestBaileysVersion)();
            const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)(__dirname + "/auth_info_baileys");
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
                /* auth: state*/ auth: {
                    creds: state.creds,
                    /** caching makes the store faster to send/recv messages */
                    keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, logger),
                },
                //////////
                getMessage: async (key) => {
                    if (store) {
                        const msg = await store.loadMessage(key.remoteJid, key.id, undefined);
                        return msg.message || undefined;
                    }
                    return {
                        conversation: 'An Error Occurred, Repeat Command!'
                    };
                }
                ///////
            };
            const ovl = (0, baileys_1.default)(sockOptions);

function repondre(mes) { ovl.sendMessage(origineMessage, { text: mes }, { quoted: ms }); }
               

