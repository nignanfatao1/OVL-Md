/*const { ovlcmd } = require("../framework/ovlcmd");
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const fs = require('fs');
const path = require('path');


//console.log("mon test");

ovlcmd(
    {
        nomCom: "tagall",
        categorie: "Groupe",
        reaction: "💬"
    },
    async (dest, ovl, commandeOptions) => {
        try {
            const { ms, repondre, arg, verifGroupe, nomGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser } = commandeOptions;

            if (!verifGroupe) {
                repondre("❌ Commande réservée aux groupes");
                return;
            }

              if (!arg || arg === ' ') {
  mess = ''
  } else {
    mess = arg.join(' ')
              }
            let membresGroupe = verifGroupe ? await infosGroupe.participants : "";
            let tag = `╔═════════════════╗
║ 🄾🅅🄻-🄼🄳 🅃🄰🄶🄰🄻🄻
║👤 Auteur : *${nomAuteurMessage}* 
║💬 Message : *${mess}*\n║`;

           // tag += `╔═════════════════╗\n`;
            let emoji = ['🔅', '💤', '🔷', '❌', '✔️', '🥱', '⚙️', '🀄', '🎊', '🏀', '🙏', '🎧', '⛔️', '🔋','🏮','🎐','🦦'];
            let random = Math.floor(Math.random() * emoji.length);

            for (const membre of membresGroupe) {
                tag += `║${emoji[random]} @${membre.id.split("@")[0]}\n`;
            }
            tag += `╚═════════════════╝\n`;

            if (verifAdmin) {
                await ovl.sendMessage(dest, { text: tag, mentions: membresGroupe.map((i) => i.id) }, { quoted: ms });
            } else {
                repondre('Commande utilisable seulement par les admins du groupe');
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi du message :", error);
        }
    }
);


ovlcmd(
    {
        nomCom: "hidtag",
        reaction: "💬",
        },
    async (dest, ovl, commandeOptions) => {

 const {repondre,msgRepondu,verifGroupe,arg ,verifAdmin , superUser}=commandeOptions;

  if(!verifGroupe)  { repondre('veuillez l\'utiliser dans un groupe')} ;
  if (verifAdmin || superUser) { 

  let metadata = await ovl.groupMetadata(dest) ;

  //console.log(metadata.participants)
 let tag = [] ;
  for (const participant of metadata.participants ) {

      tag.push(participant.id) ;
  }
  //console.log(tag)

    if(msgRepondu) {
      console.log(msgRepondu)
      let msg ;

      if (msgRepondu.imageMessage) {

        

     let media  = await ovl.downloadAndSaveMediaMessage(msgRepondu.imageMessage) ;
     // console.log(msgRepondu) ;
     msg = {

       image : { url : media } ,
       caption : msgRepondu.imageMessage.caption,
       mentions :  tag
       
     }
    

      } else if (msgRepondu.videoMessage) {

        let media  = await ovl.downloadAndSaveMediaMessage(msgRepondu.videoMessage) ;

        msg = {

          video : { url : media } ,
          caption : msgRepondu.videoMessage.caption,
          mentions :  tag
          
        }

      } else if (msgRepondu.audioMessage) {
    
        let media  = await ovl.downloadAndSaveMediaMessage(msgRepondu.audioMessage) ;
       
        msg = {
   
          audio : { url : media } ,
          mimetype:'audio/mp4',
          mentions :  tag
           }     
        
      } else if (msgRepondu.stickerMessage) {

    
        let media  = await ovl.downloadAndSaveMediaMessage(msgRepondu.stickerMessage)

        let stickerMess = new Sticker(media, {
          pack: 'OVL hidtag message',
          type: StickerTypes.CROPPED,
          categories: ["🤩", "🎉"],
          id: "12345",
          quality: 70,
          background: "transparent",
        });
        const stickerBuffer2 = await stickerMess.toBuffer();
       
        msg = { sticker: stickerBuffer2 , mentions : tag}


      }  else {
          msg = {
             text : msgRepondu.conversation,
             mentions : tag
          }
      }

    ovl.sendMessage(dest,msg)

    } else {

        if(!arg || !arg[0]) { repondre('entrer ou taguer le message à annoncer') ; return} ;

   ovl.sendMessage(
         dest,
         {
          text : arg.join(' ') ,
          mentions : tag
         }     
      )
    }

} else {
  repondre('Commande reservée au admins')
}
});*/

