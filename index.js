const express = require("express");
const app = express();
const pino = require("pino");
const { toBuffer } = require("qrcode");
const path = require('path');
const fs = require("fs-extra");
const { Boom } = require("@hapi/boom");

const PORT = process.env.PORT || 5000;
const MESSAGE = process.env.MESSAGE || "Merci d'avoir choisi Ovl-Md";

if (fs.existsSync('./auth_info_baileys')) {
  fs.emptyDirSync(__dirname + '/auth_info_baileys');
}

app.use("/", async (req, res) => {
  try {
    const { default: OvlWASocket, useMultiFileAuthState, Browsers, delay, DisconnectReason, makeInMemoryStore } = require("@sampandey001/baileys");
    const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

    async function ovl() {
      const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/auth_info_baileys');
      try {
        let ovl = OvlWASocket({ 
          printQRInTerminal: false,
          logger: pino({ level: "silent" }), 
          browser: Browsers.baileys("Desktop"),
          auth: state 
        });

        ovl.ev.on("connection.update", async (s) => {
          const { connection, lastDisconnect, qr } = s;
          if (qr) { 
            res.end(await toBuffer(qr));
          }

          if (connection === "open") {
            await delay(3000);
            let user = ovl.user.id;

            let CREDS = fs.readFileSync(__dirname + '/auth_info_baileys/creds.json')
            var Scan_Id = Buffer.from(CREDS).toString('base64')

            console.log(`
====================  SESSION ID  ==========================                   
SESSION-ID ==> ${Scan_Id}
-------------------   SESSION CLOSED   -----------------------
`)

            let msgsss = await ovl.sendMessage(user, { text: `Ovl;;; ${Scan_Id}` });
            await ovl.sendMessage(user, { text: MESSAGE }, { quoted: ms });
            await delay(1000);
            try {
              await fs.emptyDirSync(__dirname + '/auth_info_baileys');
            } catch (e) {}

            ovl.ev.on('creds.update', saveCreds)
          }

          if (connection === "close") {            
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode;

            if (reason === DisconnectReason.connectionClosed) {
              console.log("Connection fermée");
            } else if (reason === DisconnectReason.connectionLost) {
              console.log("Connexion perdue avec le serveur !");
            } else if (reason === DisconnectReason.restartRequired) {
              console.log("Redémarrage requis, redémarrage...");
              ovl().catch(err => console.log(err));
            } else if (reason === DisconnectReason.timedOut) {
              console.log("Connexion expirée !");
            } else {
              console.log('Connexion fermée avec le bot. Veuillez relancer.');
              console.log(reason);
            }
          }
        });
      } catch (err) {
        console.error('Erreur dans la fonction ovl :', err);
        await fs.emptyDirSync(__dirname + '/auth_info_baileys'); 
      }
    }

    ovl().catch(async (err) => {
      console.error('Erreur dans le traitement de la requête :', err);
      await fs.emptyDirSync(__dirname + '/auth_info_baileys'); 
    });
  } catch (error) {
    console.error('Erreur lors du traitement de la requête :', error);
    res.status(500).send('Erreur lors du traitement de la requête.');
  }
});

app.listen(PORT, () => console.log(`App écoutée sur http://localhost:${PORT}`));
