const axios = require('axios');

function parseDuration(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor(s / 60) % 60;
  s = Math.floor(s) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, "0")).join(":");
}

async function youtubedl(link) {
  const { data } = await axios.post("https://www.yt1s.com/api/ajaxSearch/index", new URLSearchParams({
    q: link,
    vt: "home"
  }), {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0"
    }
  });
  const result = {
    title: data.title,
    duration: parseDuration(data.t),
    author: data.a
  };
  
  const resultUrl = {
    video: data.links?.mp4 ? Object.values(data.links.mp4) : [],
    audio: data.links?.mp3 ? Object.values(data.links.mp3) : []
  };

  for (const i in resultUrl) {
    resultUrl[i] = resultUrl[i].map(v => ({
      size: v.size,
      format: v.f,
      quality: v.q,
      download: () => `https://www.yt1s.com/download/${data.vid}/${v.k}`
    })).sort((a, b) => parseInt(a.quality) - parseInt(b.quality));
  }
  
  return {
    result, 
    resultUrl
  };
}

module.exports = { youtubedl };
