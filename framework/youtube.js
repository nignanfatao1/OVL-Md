const axios = require("axios");

async function youtubedl(link) {
  try {
    const response = await axios.post("https://www.yt1s.com/api/ajaxSearch/index", new URLSearchParams({
      q: link,
      vt: "home"
    }), {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Referer": "https://www.yt1s.com",
        "Origin": "https://www.yt1s.com"
      }
    });

    const data = response.data;
    if (data.status !== "ok" || !data.links) {
      console.error("No valid data received.");
      return { error: "Invalid data received." };
    }

    const result = {
      title: data.title,
      duration: parseDuration(data.t),
      author: data.a,
      thumbnail: `https://i.ytimg.com/vi/${data.vid}/0.jpg`
    };

    const resultUrl = {
      video: (await Promise.all(Object.values(data.links.mp4 || []).map(async v => {
        const downloadBuffer = await downloadAsBuffer(data.vid, v.k);
        if (!downloadBuffer) return null;
        return {
          size: v.size,
          format: v.f,
          quality: v.q,
          download: downloadBuffer
        };
      }))).filter(Boolean),

      audio: (await Promise.all(Object.values(data.links.mp3 || []).map(async v => {
        const downloadBuffer = await downloadAsBuffer(data.vid, v.k);
        if (!downloadBuffer) return null;
        return {
          size: v.size,
          format: v.f,
          quality: v.q,
          download: downloadBuffer
        };
      }))).filter(Boolean)
    };

    return { result, resultUrl };

  } catch (error) {
    console.error(`Error: ${error.response ? error.response.status : error.message}`);
    return { error: `Error: ${error.response ? error.response.status : error.message}` };
  }
}

async function downloadAsBuffer(id, k) {
  try {
    const response = await axios.post("https://www.yt1s.com/api/ajaxConvert/convert", new URLSearchParams({
      vid: id,
      k
    }), {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Referer": "https://www.yt1s.com/",
        "Origin": "https://www.yt1s.com"
      }
    });

    const data = response.data;

    if (data.status === "ok" && data.c_status === "CONVERTED") {
      const fileResponse = await axios.get(data.dlink, { responseType: 'arraybuffer' });
      return Buffer.from(fileResponse.data);
    } else {
      console.error(`Error in download: ${data.mess}`);
      return null;
    }
  } catch (error) {
    console.error(`Error during download: ${error.message}`);
    return null;
  }
}

function parseDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
}

module.exports = { youtubedl };
