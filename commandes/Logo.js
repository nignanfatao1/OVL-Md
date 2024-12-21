const { ovlcmd } = require("../framework/ovlcmd");
//const mumaker = require('mumaker');
const axios = require("axios")
const cheerio = require("cheerio")
const FormData = require("form-data")


function addTextproCommand(nom_cmd, text_pro_url, desc, type) {
    ovlcmd(
        {
            nom_cmd: nom_cmd,
            classe: "Logo",
            react: "✨",
            desc: desc
        },
        async (ms_org, ovl, cmd_options) => {
            const { arg, ms } = cmd_options;
            const query = arg.join(' ');

            if (!query) {
                return await ovl.sendMessage(
                    ms_org,
                    { text: "Vous devez fournir un texte." },
                    { quoted: ms }
                );
            }

            try {
                let logo_url;

                switch (type) {
                    case 1:
                        // Type 1: Un seul mot ou texte
                        if (query.includes(';')) {
                            return await ovl.sendMessage(
                                ms_org,
                                { text: "Veuillez fournir un seul mot ou texte sans point-virgule (;) pour cette commande." },
                                { quoted: ms }
                            );
                        }
                        logo_url = await mumaker(text_pro_url, query);
                        break;

                    case 2:
                        // Type 2: Deux mots ou plus séparés par des point-virgules (;)
                        const textParts = query.split(';');
                        if (textParts.length < 2) {
                            return await ovl.sendMessage(
                                ms_org,
                                { text: "Veuillez fournir exactement deux textes séparés par un point-virgule (;), par exemple : Salut;Ça va." },
                                { quoted: ms }
                            );
                        }
                        logo_url = await mumaker(text_pro_url, textParts);
                        break;

                    default:
                        throw new Error(`Type ${type} non supporté.`);
                }

                // Envoyer l'image générée
                await ovl.sendMessage(
                    ms_org,
                    {
                        image: { url: logo_url.image },
                        caption: "\`\`\`Powered By OVL-MD\`\`\`"
                    },
                    { quoted: ms }
                );
            } catch (error) {
                console.error(`Erreur avec la commande ${nom_cmd}:`, error.message || error);
                await ovl.sendMessage(
                    ms_org,
                    { text: `Une erreur est survenue lors de la génération du logo : ${error.message}` },
                    { quoted: ms }
                );
            }
        }
    );
}

addTextproCommand(
    "dragonball", // Nom de la commande
    "https://ephoto360.com/tao-hieu-ung-chu-phong-cach-dragon-ball-truc-tuyen-1000.html", // URL du style
    "Créer un logo Dragon Ball", // Description de la commande
    1 // Type : cette commande accepte un seul mot ou texte
);

async function mumaker(url, text) {

   if (/https?:\/\/(ephoto360|photooxy|textpro)\/\.(com|me)/i.test(url)) throw new Error("URL Invalid")

   try {

      let a = await axios.get(url, {

         headers: {

            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",

            "Origin": (new URL(url)).origin,

            "Referer": url,

            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.188"

         }

      })



      let $ = cheerio.load(a.data)



      let server = $('#build_server').val()

      let serverId = $('#build_server_id').val()

      let token = $('#token').val()

      let submit = $('#create_effect').val()



      let types = [];

      $('input[name="radio0[radio]"]').each((i, elem) => {

         types.push($(elem).attr("value"));

      })



      let post;

      if (types.length != 0) {

         post = {

            'radio0[radio]': types[Math.floor(Math.random() * types.length)],

            'submit': submit,

            'token': token,

            'build_server': server,

            'build_server_id': Number(serverId)

         };

      }

      else {

         post = {

            'submit': submit,

            'token': token,

            'build_server': server,

            'build_server_id': Number(serverId)

         }

      }



      let form = new FormData()

      for (let i in post) {

         form.append(i, post[i])

      }

      if (typeof text == "string") text = [text]

      for (let i of text) form.append("text[]", i)



      let b = await axios.post(url, form, {

         headers: {

            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",

            "Origin": (new URL(url)).origin,

            "Referer": url,

            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.188", 

            "Cookie": a.headers.get("set-cookie").join("; "),

            ...form.getHeaders()

         }

      })



      $ = cheerio.load(b.data)

      let out = ($('#form_value').first().text() || $('#form_value_input').first().text() || $('#form_value').first().val() || $('#form_value_input').first().val())



      let c = await axios.post((new URL(url)).origin + "/effect/create-image", JSON.parse(out), {

         headers: {

            "Accept": "*/*",

            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",

            "Origin": (new URL(url)).origin,

            "Referer": url,

            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.188",

            "Cookie": a.headers.get("set-cookie").join("; ")

         }

      })



      return {

         status: c.data?.success,

         image: server + (c.data?.fullsize_image || c.data?.image || ""),

         session: c.data?.session_id

      }

   } catch (e) {

      throw e

   }

}
