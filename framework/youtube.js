const axios = require('axios');
const fs = require('fs');
const path = require('path');

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
        "Cookie": "_ga=GA1.1.896277803.1730544317; _ga_SHGNTSN7T4=GS1.1.1730612568.5.0.1730612568.0.0.0",
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
    return data;

  } catch (error) {
    console.error(`Error: ${error.response ? error.response.status : error.message}`);
    if (error.response) {
      console.error(await error.response.data);
    }
    return { error: `Error: ${error.response ? error.response.status : error.message}` };
  }
}

async function download(id, k) {
  try {
    const response = await axios.post("https://www.yt1s.com/api/ajaxConvert/convert", new URLSearchParams({
      vid: id,
      k
    }), {
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
        "Cookie": "_ga=GA1.1.896277803.1730544317; _ga_SHGNTSN7T4=GS1.1.1730612887.0.0.0",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Referer": "https://www.yt1s.com/",
        "Origin": "https://www.yt1s.com"
      }
    });
    
    const data = response.data;
    return data.dlink;
  } catch (error) {
    console.error(`Error: ${error.response ? error.response.status : error.message}`);
    return null;
  }
}

async function downloadAudio(url, outputPath) {
  const writer = fs.createWriteStream(outputPath);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
    headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
        "Cookie": "cf_clearance=ZIVTQO3PgxOfD9crW7FHSQyAVBvjtg4EW4Ml1e4mpZ4-1730623057-1.2.1.1-OiT61U0gOORR8h78wbU_Nf7Xl_81IwyevF9nVIrjkjALT88HWBnY7Ol9IX5HH.kukcJm5pSJe.oTbnvlNLn094gZRKsTbYRvJZKBXKEoJTvA4LbUo6Y6efOK4WfRb6OpadkA6T4.849Sww1AaWzisi7FSZk8O_woxfhIFHzpazPe9z4j6ECuIUoNEwJMatRRRVfIbxvfby3A0UDwxo7WZYLnZeWehn0DJMwtoWZMltKrU58dAanQ9dW5UWnOL5KmMbqAaEOnCtEGIfDRTmHTEcQdMtxaH.3wsDNZzouljCfdZxgpGPsJBITvlqlQppK54XPApO0pymNk0TF3yr8h6SJT5or4LBrzLOUZtU2tlBo9OBkX44W2oFPMChiN0wdTD18YlqCp2u8DbzA6rMwaCbdB2C7PEQ8s7xhbKF1_2BUAITizOxhg5ZyFvaovVShh",
        "Content-Type": "audio/mpeg"
    }
  });
  
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

// Exporter la fonction youtubedl
module.exports = { youtubedl, downloadAudio };
