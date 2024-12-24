const axios = require("axios");
const cheerio = require("cheerio");
const cookie = require("cookie");

async function fbdl(url) {
  try {
    const response = await axios.post(
      "https://www.getfvid.com/downloader",
      new URLSearchParams({
        url: url,
      }),
      {
        headers: {
          "accept": "*/*",
          "content-type": "application/x-www-form-urlencoded",
          "user-agent": "GoogleBot",
        },
      }
    );

    const $ = cheerio.load(response.data);

    const firstDownloadLink = $('a.btn-download').first().attr('href');
    
    if (!firstDownloadLink) {
      throw new Error('Aucun lien de téléchargement trouvé.');
    }

    return firstDownloadLink;
  } catch (error) {
    console.error('Error fetching the page:', error);
    throw new Error('Erreur lors de la récupération du lien de téléchargement.');
  }
}

async function ttdl(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get("https://ttdownloader.com", {
        headers: {
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-language": "en-US,en;q=0.9,id;q=0.8",
          "user-agent": "GoogleBot",
        },
        maxRedirects: 5,
      });

      const cookies = response.headers["set-cookie"];
      const initialCookies = cookies.map(cookieStr => cookie.parse(cookieStr)).reduce((acc, curr) => ({ ...acc, ...curr }), {});

      const $ = cheerio.load(response.data);
      const token = $('#token').attr('value');
      
      const sessionCookies = Object.entries({
        __cfduid: initialCookies.__cfduid,
        PHPSESSID: initialCookies.PHPSESSID,
      }).map(([key, value]) => cookie.serialize(key, value)).join("; ");

      const downloadResponse = await axios.post(
        "https://ttdownloader.com/search/",
        new URLSearchParams({
          url: url,
          format: "",
          token: token,
        }),
        {
          headers: {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9,id;q=0.8",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "user-agent": "GoogleBot",
            "cookie": sessionCookies,
          },
        }
      );

      const ch = cheerio.load(downloadResponse.data);
      const result = {
        status: downloadResponse.status,
        result: {
          nowatermark: ch('.result .download-link[href*="dl.php"]')?.attr('href'),
          audio: ch('.result .download-link[href*="mp3.php"]')?.attr('href'),
        },
      };

      if (result.result.nowatermark && result.result.audio) {
        resolve(result);
      } else {
        reject("Liens de téléchargement non trouvés");
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function igdl(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get("https://downloadgram.org/", {
        headers: {
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-language": "en-US,en;q=0.9,id;q=0.8",
          "user-agent": "GoogleBot",
        },
        maxRedirects: 5,
      });

      const cookies = response.headers["set-cookie"] || [];
      const initialCookies = cookies
        .map((cookieStr) => cookie.parse(cookieStr))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {});

      const $ = cheerio.load(response.data);
      const token = $("#token").attr("value");

      const sessionCookies = Object.entries({
        __cfduid: initialCookies.__cfduid || "",
        PHPSESSID: initialCookies.PHPSESSID || "",
      })
        .map(([key, value]) => cookie.serialize(key, value))
        .join("; ");

      const videoResponse = await axios.post(
        "https://api.downloadgram.org/media",
        new URLSearchParams({
          url: url,
          v: "3",
          lang: "en",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "User-Agent": "GoogleBot",
            "cookie": sessionCookies,
          },
        }
      );
      const videoPage = cheerio.load(videoResponse.data);
      let videoLink = videoPage("video source").attr("src");

      if (videoLink) {
        videoLink = videoLink.replace(/^\\\"|\\\"$/g, '');
        resolve({ status: videoResponse.status, result: { video: videoLink } });
     
      } else {
        reject("Lien de vidéo introuvable.");
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function twitterdl(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`https://twitsave.com/info?url=${url}`, {
        headers: {
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-language": "en-US,en;q=0.9,id;q=0.8",
          "user-agent": "GoogleBot",
        },
      });

      const $ = cheerio.load(response.data);
      const videoLink = $("video").attr("src");

      if (videoLink) {
        resolve({ status: response.status, result: { video: videoLink } });
      } else {
        reject("Lien vidéo introuvable.");
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function ytdl(url, format = "m4a") {
  try {
    const req = await axios.get(`https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}`);
    const id = req.data?.id;
    if (!id) {
      throw new Error("Impossible d'obtenir l'ID de téléchargement.");
    }

    const progressReq = await axios.get(`https://p.oceansaver.in/ajax/progress.php?id=${id}`);
    const downloadUrl = progressReq.data?.download_url;
    if (!downloadUrl) {
      throw new Error("Lien de téléchargement introuvable.");
    }

    return downloadUrl;
  } catch (error) {
    console.error("Erreur lors de la récupération du lien:", error.message);
    throw error;
  }
}

module.exports = { fbdl, ttdl, igdl, twitterdl, ytdl };
