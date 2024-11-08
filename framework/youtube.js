const axios = require('axios');

function parseDuration(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor(s / 60) % 60;
  s = Math.floor(s) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, "0")).join(":");
}

async function youtubedl(link) {
  try {
    const response = await axios.post("https://www.yt1s.com/api/ajaxSearch/index", new URLSearchParams({
      q: link,
      vt: "home"
    }), {
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Referer": "https://www.yt1s.com",
        "Origin": "https://www.yt1s.com/en2aef"
      }
    });

    const data = response.data;

    const result = {
      title: data.title,
      duration: parseDuration(data.t),
      author: data.a
    };

    const resultUrl = {
      video: await Promise.all(Object.values(data.links.mp4).map(async v => ({
        size: v.size,
        format: v.f,
        quality: v.q,
        download: await downloadAsBuffer(data.vid, v.k) // Convertir le lien en buffer
      }))),
      audio: await Promise.all(Object.values(data.links.mp3).map(async v => ({
        size: v.size,
        format: v.f,
        quality: v.q,
        download: await downloadAsBuffer(data.vid, v.k) // Convertir le lien en buffer
      })))
    };

    // Retourner le résultat avec les buffers de téléchargement
    return {
      result,
      resultUrl
    };

  } catch (error) {
    console.error(`Error: ${error.response ? error.response.status : error.message}`);
    return { error: `Error: ${error.response ? error.response.status : error.message}` };
  }
}

async function downloadAsBuffer(id, k) {
  try {
    // Récupération du lien direct de téléchargement
    const response = await axios.post("https://www.yt1s.com/api/ajaxConvert/convert", new URLSearchParams({
      vid: id,
      k
    }), {
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Referer": "https://www.yt1s.com/",
        "Origin": "https://www.yt1s.com"
      }
    });

    const data = response.data;

    if (data.status === "ok" && data.c_status === "CONVERTED") {
      // Téléchargement du fichier en tant que buffer
      const fileResponse = await axios.get(data.dlink, { responseType: 'arraybuffer' });
      return Buffer.from(fileResponse.data); // Retourner le buffer du fichier
    } else {
      console.error(`Error in download: ${data.mess}`);
      return null;
    }
  } catch (error) {
    console.error(`Error: ${error.response ? error.response.status : error.message}`);
    return null;
  }
}

module.exports = { youtubedl };
