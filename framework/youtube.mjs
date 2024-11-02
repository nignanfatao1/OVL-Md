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
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0",
        "Content-Type": "application/x-www-form-urlencoded",
        "Referer": "https://www.yt1s.com/",  // Ajouter le referer
        "Origin": "https://www.yt1s.com"     // Ajouter l'origine
      }
    });

    const data = response.data;

    const result = {
      title: data.title,
      duration: parseDuration(data.t),
      author: data.a
    };

    const resultUrl = {
      video: Object.values(data.links.mp4),
      audio: Object.values(data.links.mp3)
    };

    for (const i in resultUrl) {
      resultUrl[i] = resultUrl[i].map(v => ({
        size: v.size,
        format: v.f,
        quality: v.q,
        download: download.bind({}, data.vid, v.k)
      })).sort((a, b) => (a.quality.slice(0, -1) * 1) - (b.quality.slice(0, -1) * 1));
    }

    // Retourner le résultat
    return {
      result,
      resultUrl
    };

  } catch (error) {
    console.error(`Error: ${error.response ? error.response.status : error.message}`);
    if (error.response) {
      console.error(await error.response.data);
    }
    return;
  }
}

async function download(id, k) {
  try {
    const response = await axios.post("https://www.yt1s.com/api/ajaxConvert/convert", new URLSearchParams({
      vid: id,
      k
    }), {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0",
        "Content-Type": "application/x-www-form-urlencoded",
        "Referer": "https://www.yt1s.com/",  // Ajouter le referer
        "Origin": "https://www.yt1s.com"     // Ajouter l'origine
      }
    });

    const data = response.data;
    return data.dlink;
  } catch (error) {
    console.error(`Error: ${error.response ? error.response.status : error.message}`);
    return null;
  }
}

// Exporter la fonction youtubedl
module.exports = { youtubedl };
