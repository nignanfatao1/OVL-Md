const fs = require('fs');
const pino = require("pino");
const path = require('path');
const axios = require("axios");
const { default: makeWASocket, useMultiFileAuthState, getContentType, makeInMemoryStore, fetchLatestBaileysVersion, DisconnectReason } = require("@whiskeysockets/baileys");
const config = require("./set");
const session = config.SESSION_ID || "";
const evt = require(__dirname + "/framework/ovlcmd");
const prefixe = config.PREFIXE;

async function ovlAuth(session) {
    try {
        const sessionId = session.startsWith("Ovl-MD_") && session.endsWith("_SESSION-ID") ? session.slice(7, -11) : null;
        const response = await axios.get('https://pastebin.com/raw/' + sessionId);
        const filePath = path.join(__dirname, 'auth', 'creds.json');
        if (!fs.existsSync(filePath) || session !== "ovl") {
            fs.writeFileSync(filePath, response.data, 'utf8');
        }
    } catch (e) {
        console.log("Session invalide: " + e.message || e);
    }
}

ovlAuth(session);

async function main() {
    const { version } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'auth'));
    const store = makeInMemoryStore({ logger: pino().child({ level: "silent" }) });
    const ovl = makeWASocket({
        version,
        printQRInTerminal: true,
        logger: pino({ level: "silent" }),
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        auth: { creds: state.creds, keys: state.keys }
    });

    store.bind(ovl.ev);

    ovl.ev.on("messages.upsert", async (m) => {
        const ms = m.messages[0];
        if (!ms.message) return;
        const mtype = getContentType(ms.message);
        const texte = mtype === "conversation" ? ms.message.conversation : "";
        console.log('message: ', texte);
        if (texte.startsWith(prefixe)) {
            const cmds = texte.slice(prefixe.length).trim().split(/ +/).shift().toLowerCase();
            const cd = evt.cmd.find((cmd) => cmd.nom_cmd === cmds);
            if (cd) {
                try {
                    cd.fonction(ms.key.remoteJid, ovl, { texte, cmds });
                } catch (e) {
                    console.log("Erreur: " + e);
                }
            }
        }
    });

    ovl.ev.on("connection.update", async (con) => {
        const { connection, lastDisconnect } = con;
        if (connection === "open") console.log("✅ Bot connecté !");
        if (connection === "close" && lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
            main();
        }
    });

    setInterval(() => store.writeToFile(path.join(__dirname, "store.json")), 3000);
}

main();
