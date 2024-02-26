const baileys = require("@whiskeysockets/baileys");
const logger = require("@whiskeysockets/baileys/lib/Utils/logger").default.child({});
logger.level = 'silent';
const boom = require("@hapi/boom");
const conf = require("./set"); // Supposons que 'set.js' contient la configuration nécessaire
const axios = require("axios");
const pino = require("pino");
const { toBuffer } = require("qrcode");
const path = require('path');
const fs = require("fs-extra");

const session = conf.SESSION_ID || "";

async function authentication() {
    try {
        if (!fs.existsSync(__dirname + "/auth_info_baileys/creds.json")) {
            console.log("Connexion en cours ...");
            await fs.writeFileSync(__dirname + "/auth_info_baileys/creds.json", atob(session), "utf8");
        } else if (fs.existsSync(__dirname + "/auth_info_baileys/creds.json") && session !== "ovl") {
            await fs.writeFileSync(__dirname + "/auth_info_baileys/creds.json", atob(session), "utf8");
        }
    } catch (e) {
        console.log("Session invalide " + e);
        return;
    }
}

authentication();

const store = baileys.makeInMemoryStore({
    logger: pino().child({ level: "silent", stream: "store" }),
});

async function main() {
    try {
        const { version, isLatest } = await baileys.fetchLatestBaileysVersion();
        const { state, saveCreds } = await baileys.useMultiFileAuthState(__dirname + "/auth_info_baileys");
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
                keys: baileys.makeCacheableSignalKeyStore(state.keys, logger),
            },
            getMessage: async (key) => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id, undefined);
                    return msg.message || undefined;
                }
                return {
                    conversation: 'Une erreur s\'est produite. Veuillez répéter la commande.'
                };
            }
        };

        const ovl = baileys.default(sockOptions);

        ovl.ev.on("messages.upsert", async (m) => {
            const { messages } = m;
            const ms = messages[0];
            if (!ms.message) return;

            // Logique de traitement des messages ici

            console.log("=========== Nouveau message ===========");
            console.log("Type de message : " + mtype);
            console.log("Contenu du message : " + texte);
            console.log("=======================================");
        });
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
   loadCommands();     
    } catch (error) {
        console.error("Une erreur s'est produite :", error);
    }
}

main();


