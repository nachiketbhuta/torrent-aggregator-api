import { load } from "cheerio";
import axios from "axios";

// 2UtUFYyELkcEtMWabgigD27R

interface TorrentBasicKeys {
  name?: string;
  magnet?: string;
  poster?: string;
  url?: string;
  torrentLink?: string;
}

interface TorrentKeys {
  category?: string;
  type?: string;
  language?: string;
  size?: string;
  uploadedBy?: string;
  downloads?: string;
  lastChecked?: string;
  dateUploaded?: string;
  seeders?: number;
  leechers?: number;
}

interface Torrent extends TorrentBasicKeys, TorrentKeys {
  [index: string | number]: number | string | undefined; // Index signature
}

/* 1337x.to */
export const torrent1337x = async (query = "", page = "1") => {
  let html;
  const url = `https://1337x.to/search/${query}/${page}/`;
  try {
    html = await axios.get(url);
  } catch {
    return null;
  }

  const $ = load(html.data);

  const links = $("td.name")
    .map((_, element) => {
      return `https://1337x.to${$(element).find("a").next().attr("href")}`;
    })
    .get();

  return await Promise.all(
    links.map(async (element) => {
      let torrent: Torrent = {
        name: "",
        magnet: "",
        poster: "",
        category: "",
        type: "",
        language: "",
        size: "0",
        uploadedBy: "",
        downloads: "",
        lastChecked: "",
        dateUploaded: "",
        seeders: 0,
        leechers: 0,
        url: "",
        torrentLink: "",
      };
      const labels: string[] = [
        "category",
        "type",
        "language",
        "size",
        "uploadedBy",
        "downloads",
        "lastChecked",
        "dateUploaded",
        "seeders",
        "leechers",
      ];

      try {
        const html = await axios.get(element);
        const $ = load(html.data);
        torrent.name = $(".box-info-heading h1").text().trim();
        torrent.magnet = $(".clearfix ul li a").attr("href") || "";
        const poster = $("div.torrent-image img").attr("src");

        if (typeof poster !== "undefined") {
          if (poster.startsWith("http")) {
            torrent.poster = poster;
          } else {
            torrent.poster = "https:" + poster;
          }
        } else {
          torrent.poster = "";
        }

        $("div .clearfix ul li > span").each((i, element) => {
          let list = $(element);
          torrent[labels[i]] = list.text();
        });
        torrent.url = element;
      } catch (error) {
        return error;
      }

      return torrent;
    })
  );
};

/* BitSearch Torrent */
export const bitSearch = async (query: string, page = "1") => {
  const url = `https://bitsearch.to/search?q=${query}&page=${page}&sort=seeders`;

  const options = {
    method: "GET",
    url,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36",
    },
  };
  let html;
  try {
    html = await axios.request(options);
  } catch {
    return null;
  }

  const $ = load(html.data);
  let torrents: Torrent[] = [];

  $("li.search-result").each((_, element) => {
    let size = $(element).find(".info div div").eq(2).text();

    if (size) {
      torrents.push({
        name: $(element).find(".info h5 a").text().trim(),
        downloads: $(element)
          .find(".info div div div.stats div:first-child")
          .text()
          .trim(),
        size: $(element)
          .find(".info div div div.stats div:nth-child(2)")
          .text()
          .trim(),
        seeders: Number(
          $(element)
            .find(".info div div div.stats div:nth-child(3)")
            .text()
            .trim()
        ),
        leechers: Number(
          $(element)
            .find(".info div div div.stats div:nth-child(4)")
            .text()
            .trim()
        ),
        dateUploaded: $(element)
          .find(".info div div div.stats div:nth-child(5)")
          .text()
          .trim(),
        url:
          "https://bitsearch.to" + $(element).find(".info h5 a").attr("href"),
        torrentLink: $(element).find(".links a").attr("href"),
        magnet: $(element).find(".links a").next().attr("href"),
        category: $(element).find(".info div div a.category").text().trim(),
      });
    }
  });

  return torrents;
};

/* EZTV Torrent */
export const eztvTorrent = async (query: string, page = "1") => {
  const url = `https://eztv.re/search/${query}`;
  let html;
  try {
    html = await axios.get(url);
  } catch {
    return null;
  }

  const $ = load(html.data);

  let torrents: Torrent[] = [];
  $("tbody tr.forum_header_border").each((_, element) => {
    const url = $(element).find("td:nth-child(2)").find("a").attr("href") || "";
    const name = $(element).find("td:nth-child(2)").find("a").text() || "";
    if (url !== "" || name !== "") {
      if (
        !name.match(
          new RegExp(query.replace(/(\W|\s)/gi, "(\\W|\\s|).?"), "ig")
        )
      ) {
        return;
      }
      torrents.push({
        name: name,
        size: $(element).find("td:nth-child(4)").text().trim(),
        dateUploaded: $(element).find("td:nth-child(5)").text().trim(),
        seeders: Number($(element).find("td:nth-child(6)").text().trim()),
        url: `https://eztv.io${url}`,
        torrentLink: $(element)
          .find("td:nth-child(3)")
          .find("a.download_1")
          .attr("href"),
        magnet: $(element)
          .find("td:nth-child(3)")
          .find("a.magnet")
          .attr("href"),
      });
    }
  });

  return torrents;
};
