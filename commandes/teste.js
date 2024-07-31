ovl({ nomCom: "tagall", 
     categorie: "Groupe",
     reaction: "📣" }, async (dest, ovl, commandeOptions) => {

  const { ms, repondre, arg, verifGroupe, nomGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser } = commandeOptions

 if (!verifGroupe) { repondre("❌ Commandes reservé aux groupes"); return; }
  if (!arg || arg === ' ') {
  mess = 'Aucun Message'
  } else {
    mess = arg.join(' ')
  } ;
  let membresGroupe = verifGroupe ? await infosGroupe.participants : ""
  var tag = ""; 
  tag += `╔══════════════╗
║👤 Auteur : *${nomAuteurMessage}* 
║💬 Message : *${mess}*
╚══════════════╝\n
\n

` ;
 let emoji = ['🔅', '💤', '🔷', '❌', '✔️', '🥱', '⚙️', '🀄', '🎊', '🏀', '🙏🎧', '⛔️', '🔋','🏮','🎐','🦦']
  let random = Math.floor(Math.random() * (emoji.length - 1))


  for (const membre of membresGroupe) {
    tag += `${emoji[random]}      @${membre.id.split("@")[0]}\n`
  }

 
 if (verifAdmin) {

  ovl.sendMessage(dest, { text: tag, mentions: membresGroupe.map((i) => i.id) }, { quoted: ms })

   } else { repondre('commande utilisable seulement par les admins du group')}

});
