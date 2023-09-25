import { load } from "cheerio";
import axios, { all } from "axios";
import Torrent from "./types";

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

/* MAGNET_DL Torrents */
export const magnetDLTorrents = async (query: string, page: string = "1") => {
  const url =
    page === "" || page === "1"
      ? `https://magnetdl.abcproxy.org/search/?q=${query}&m=1`
      : `https://magnetdl.proxyninja.org/search/?q=${query}&m=1`;

  let html;
  const options = {
    method: "GET",
    url,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.87 Mobile Safari/537.36",
    },
  };
  try {
    html = await axios.request(options);
  } catch (err) {
    return [];
  }

  const $ = load(html.data);

  let torrents: Torrent[] = [];
  $(".download tbody tr").each((_, element) => {
    let torrent: Torrent = {
      name: $(element).find("td").eq(1).find("a").text().trim(),
      size: $(element).find("td").eq(5).text(),
      dateUploaded: $(element).find("td").eq(2).text(),
      category: $(element).find("td").eq(3).text(),
      seeders: Number($(element).find("td").eq(6).text()),
      leechers: Number($(element).find("td").eq(7).text()),
      url: `https://www.magnetdl.com${$(element)
        .find("td")
        .eq(1)
        .find("a")
        .attr("href")}`,
      magnet: $(element).find("td").eq(0).find("a").attr("href"),
    };
    if (torrent.name !== "") {
      torrents.push(torrent);
    }
  });
  return torrents;
};

/* ETTV Torrents - Blocked by Indian Govt */
export const ettvTorrents = async (query: string, page: string = "1") => {
  const allUrls: string[] = [];
  const torrents: Torrent[] = [];
  const url = `http://www.ettvcentral.com/torrents-search.php?search=${query}&page=${page}`;
  let html;
  try {
    html = await axios.get(url);
  } catch (err) {
    return [];
  }

  const $ = load(html.data);
  $("table tbody").each((_, element) => {
    $("tr").each((_, el) => {
      const td = $(el).children("td");
      let torrent: Torrent = {
        name: $(td).eq(1).find("a b").text(),
        category: $(td).eq(0).find("a img").attr("title"),
        dateUploaded: $(td).eq(2).text(),
        size: $(td).eq(3).text(),
        seeders: Number($(td).eq(5).text()),
        leechers: Number($(td).eq(6).text()),
        url: `https://www.ettvcentral.com${$(td).eq(1).find("a").attr("href")}`,
        author: $(td).eq(7).text(),
      };
      if (torrent.name !== "") {
        allUrls.push(torrent?.url || "");
        torrents.push(torrent);
      }
    });
  });
  await Promise.all(
    allUrls.map(async (url) => {
      for (let i = 0; i < torrents.length; i++) {
        if (torrents[i]["url"] === url) {
          let html;
          try {
            html = await axios.get(url);
          } catch (err) {
            return null;
          }
          let $ = load(html.data);
          try {
            torrents[i].poster = $("div .torrent_data")
              .find("center img")
              .attr("src");

            torrents[i].magnet = $(
              "#downloadbox > table > tbody > tr > td:nth-child(1) > a"
            ).attr("href");
          } catch (err) {
            return [];
          }
        }
      }
    })
  );

  return torrents;
};

/* Kickass Torrents */
export const kickassTorrents = async (query: string, page: string = "1") => {
  let torrents: Torrent[] = [];
  let allUrls: string[] = [];
  const url = `https://kickasstorrents.to/usearch/${query}/${page}/`;

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
  } catch (err) {
    return [];
  }

  const $ = load(html.data);

  $("tbody tr").each((i, element) => {
    if (i > 2) {
      let url = `https://kickasstorrents.to${$(element)
        .find("a.cellMainLink")
        .attr("href")}`;
      if (!url.endsWith("undefined")) {
        allUrls.push(url);
        let torrent: Torrent = {
          name: $(element).find("a.cellMainLink").text().trim(),
          size: $(element).find("td").eq(1).text().trim(),
          uploadedBy: $(element).find("td").eq(2).text().trim(),
          age: Number($(element).find("td").eq(3).text().trim()),
          seeders: Number($(element).find("td").eq(4).text().trim()),
          leechers: Number($(element).find("td").eq(5).text().trim()),
          url,
        };
        torrents.push(torrent);
      }
    }
  });

  await Promise.all(
    allUrls.map(async (url) => {
      for (let i = 0; i < torrents.length; i++) {
        if (torrents[i]["url"] === url) {
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
          } catch (err) {
            return [];
          }
          const $ = load(html.data);
          torrents[i].magnet = $("a.kaGiantButton").attr("href");
        }
      }
    })
  );
  return torrents;
};

/* GloDLS Torrents */
export const glodLSTorrents = async (query: string, page: string = "1") => {
  const url = `https://glodls.to/search_results.php?search=${query}&sort=seeders&order=desc&page=${page}`;
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
  } catch (err) {
    return [];
  }

  const $ = load(html.data);

  let torrents: Torrent[] = [];
  $(".ttable_headinner tr").each((_, element) => {
    let torrent: Torrent = {
      name: $(element).find("td").eq(1).find("a").text().trim(),
      size: $(element).find("td").eq(4).text(),
      author: $(element).find("td").eq(7).find("a b font").text(),
      seeders: Number($(element).find("td").eq(5).find("font b").text()),
      leechers: Number($(element).find("td").eq(6).find("font b").text()),
      url: `https://glodls.to"${$(element)
        .find("td")
        .eq(1)
        .find("a")
        .next()
        .attr("href")}`,
      torrentLink: `https://glodls.to${$(element)
        .find("td")
        .eq(2)
        .find("a")
        .attr("href")}`,
      magnet: $(element).find("td").eq(3).find("a").attr("href"),
    };
    if (torrent.name !== "") {
      torrents.push(torrent);
    }
  });
  return torrents;
};

/* Lime Torrents */
export const limeTorrents = async (query: string, page: string = "1") => {
  const url = `https://www.limetorrents.pro/search/all/${query}/seeds/${page}/`;
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
  } catch (err) {
    return [];
  }

  const $ = load(html.data);

  let torrents: Torrent[] = [];

  $(".table2 tbody tr").each((i, element) => {
    if (i > 0) {
      let category_and_age = $(element)
        .find("td")
        .eq(1)
        .text()
        .trim()
        .split("-");

      let age = category_and_age[0].trim();
      let category = category_and_age[1].replace("in", "").trim();
      let torrent: Torrent = {
        name: $(element).find("div.tt-name").text().trim(),
        size: $(element).find("td").eq(2).text().trim(),
        category: category,
        age: age,
        seeders: Number($(element).find("td").eq(3).text().trim()),
        leechers: Number($(element).find("td").eq(4).text().trim()),
        torrentLink: $(element).find("div.tt-name a").attr("href"),
        url: `https://www.limetorrents.pro${$(element)
          .find("div.tt-name a")
          .next()
          .attr("href")}`,
      };
      torrents.push(torrent);
    }
  });
  return torrents;
};

/* NyaaSI Torrents */
export const nyaaSITorrents = async (query: string, page: string = "1") => {
  const url = `https://nyaa.si/?f=0&c=0_0&q=${query}&p=${page}`;
  let html = null;
  try {
    html = await axios.get(url);
  } catch {
    return [];
  }
  const regex = /.comments/gi;

  const $ = load(html.data);
  let torrents: Torrent[] = [];
  $("tbody tr").each((_, element) => {
    let torrent: Torrent = {};

    const $find = $(element);
    $find.each((_, element) => {
      const td = $(element).children("td");
      torrent.category = $(element).find("a").attr("title");
      torrent.url = (
        "https://nyaa.si" + $(element).find('td[colspan="2"] a').attr("href")
      ).replace(regex, "");

      $find.each((_, element) => {
        torrent.size = $(td).eq(3).text();
        torrent.dateUploaded = $(td).eq(4).text();
        torrent.seeders = Number($(td).eq(5).text());
        torrent.leechers = Number($(td).eq(6).text());
        torrent.downloads = $(td).eq(7).text();
        torrent.torrentLink =
          "https://nyaa.si" + $(element).find(".text-center a").attr("href");
        torrent.magnet = $(element).find(".text-center a").next().attr("href");
      });
    });
    torrents.push(torrent);
  });

  return torrents;
};

/* PirateBay Torrents */
export const pirateBayTorrents = async (query: string, page: string = "1") => {
  let allTorrents: Torrent[] = [];
  const url = `https://thehiddenbay.com/search/${query}/${page}/99/0`;
  let html;
  try {
    html = await axios.get(url);
  } catch {
    return [];
  }
  const $ = load(html.data);

  $("table#searchResult tr").each((_, element) => {
    const data = $(element)
      .find("font.detDesc")
      .text()
      .replace(/(Size|Uploaded)/gi, "")
      .replace(/ULed/gi, "Uploaded")
      .split(",")
      .map((value) => value.trim());
    const date = data[0];
    const size = data[1];
    const uploader = $(element).find("font.detDesc a").text();

    let torrent: Torrent = {
      name: $(element).find("a.detLink").text(),
      size: size,
      dateUploaded: date,
      category: $(element).find("td.vertTh center a").eq(0).text(),
      seeders: Number($(element).find("td").eq(2).text()),
      leechers: Number($(element).find("td").eq(3).text()),
      uploadedBy: uploader,
      url: $(element).find("a.detLink").attr("href"),
      magnet: $(element).find("td div.detName").next().attr("href"),
    };

    if (torrent.name?.length) {
      allTorrents.push(torrent);
    }
  });

  return allTorrents;
};

export const rarbgTorrents = async (query: string, page: string = "1") => {
  let allUrls: string[] = [];
  let torrents: Torrent[] = [];
  const url = `https://rargb.to/search/${page}/?search=${query}`;
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
  } catch (err) {
    return [];
  }

  const $ = load(html.data);

  $("table.lista2t tbody").each((_, element) => {
    $("tr.lista2").each((_, el) => {
      let torrent: Torrent = {};
      const td = $(el).children("td");
      torrent.name = $(td).eq(1).find("a").attr("title");
      torrent.category = $(td).eq(2).find("a").text();
      torrent.dateUploaded = $(td).eq(3).text();
      torrent.size = $(td).eq(4).text();
      torrent.seeders = Number($(td).eq(5).find("font").text());
      torrent.leechers = Number($(td).eq(6).text());
      torrent.uploadedBy = $(td).eq(7).text();
      torrent.url = "https://rargb.to" + $(td).eq(1).find("a").attr("href");
      allUrls.push(torrent.url);
      torrents.push(torrent);
    });
  });

  await Promise.all(
    allUrls.map(async (url) => {
      for (let i = 0; i < torrents.length; i++) {
        if (torrents[i]["url"] === url) {
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
          } catch (err) {
            return [];
          }

          let $ = load(html.data);

          let poster =
            "https://rargb.to" +
              $("tr:nth-child(4) > td:nth-child(2) > img:nth-child(1)").attr(
                "src"
              ) || "";

          torrents[i].poster = !poster.endsWith("undefined") ? poster : "";
          torrents[i].magnet = $(
            "tr:nth-child(1) > td:nth-child(2) > a:nth-child(3)"
          ).attr("href");
        }
      }
    })
  );
  return torrents;
};

/* Tor Lock Torrents - Blocked by Indian Govt */
export const torLock = async (query = "", page = "1") => {
  let torrents: Torrent[] = [];
  let allUrls: string[] = [];
  const url = encodeURI(
    "https://www.torlock.com/all/torrents/" + query + "/" + page + ".html"
  );
  let html;
  try {
    html = await axios.get(url);
  } catch (error) {
    return [];
  }

  const $ = load(html.data);

  $(".table tbody tr").each((i, element) => {
    if (i > 3) {
      let url =
        "https://www.torlock.com" +
        $(element).find("td").eq(0).find("div a").attr("href");
      allUrls.push(url);
      let torrent: Torrent = {
        name: $(element).find("td").eq(0).find("div a b").text().trim(),
        size: $(element).find("td").eq(2).text().trim(),
        dateUploaded: $(element).find("td").eq(1).text().trim(),
        seeders: Number($(element).find("td").eq(3).text().trim()),
        leechers: Number($(element).find("td").eq(4).text().trim()),
        url,
      };
      if (torrent.name !== "") {
        torrents.push(torrent);
      }
    }
  });

  await Promise.all(
    allUrls.map(async (url) => {
      for (let i = 0; i < torrents.length; i++) {
        if (torrents[i]["url"] === url) {
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
          } catch (err) {
            return [];
          }
          const $ = load(html.data);
          torrents[i].torrentLink =
            $(
              "body > article > div:nth-child(6) > div > div:nth-child(2) > a"
            ).attr("href") || "";
          torrents[i].magnet = $(
            "body > article > table:nth-child(5) > thead > tr > th > div:nth-child(2) > h4 > a:nth-child(1)"
          ).attr("href");
        }
      }
    })
  );

  return torrents;
};

/* Torrent Funk */
export const torrentFunk = async (query: string, page = "1") => {
  let torrents: Torrent[] = [];
  let allUrls: string[] = [];
  let url = "";
  if (page === "" || page === "1") {
    url = "https://www.torrentfunk.com/all/torrents/" + query + ".html";
  } else {
    url =
      "https://www.torrentfunk.com/all/torrents/" +
      query +
      "/" +
      page +
      ".html";
  }

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
  } catch (err) {
    return [];
  }

  const $ = load(html.data);

  $(".tmain tbody tr").each((i, element) => {
    if (i > 4) {
      let url =
        "https://www.torrentfunk.com" +
        $(element).find("td").eq(0).find("a").attr("href");
      allUrls.push(url);
      let torrent: Torrent = {
        name: $(element).find("td").eq(0).find("a").text().trim(),
        size: $(element).find("td").eq(2).text(),
        dateUploaded: $(element).find("td").eq(1).text(),
        author: $(element).find("td").eq(5).text(),
        seeders: Number($(element).find("td").eq(3).text()),
        leechers: Number($(element).find("td").eq(4).text()),
        url,
      };
      if (torrent.name !== "") {
        torrents.push(torrent);
      }
    }
  });

  await Promise.all(
    allUrls.map(async (url) => {
      for (let i = 0; i < torrents.length; i++) {
        if (torrents[i]["url"] === url) {
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
          } catch (err) {
            return [];
          }

          const $ = load(html.data);
          torrents[i].torrent = $(
            "#right > main > div.content > table:nth-child(3) > tbody > tr > td:nth-child(2) > a"
          ).attr("href");
        }
      }
    })
  );

  return torrents;
};

/* Torrent Galaxy */
export const torrentGalaxy = async (query = "", page = "0") => {
  let currentPage: number = 0;
  if (page !== "0") {
    try {
      currentPage = Number(page) - 1;
    } catch {
      return [];
    }
  }
  let allTorrents: Torrent[] = [];
  const url =
    "https://torrentgalaxy.to/torrents.php?search=" +
    query +
    "&sort=id&order=desc&page=" +
    currentPage;
  let html;
  try {
    html = await axios.get(url);
  } catch {
    return [];
  }

  const $ = load(html.data);

  $("div.tgxtablerow.txlight").each((_, element) => {
    const torrent: Torrent = {};
    torrent.name = $(element).find(":nth-child(4) div a b").text();
    torrent.category = $(element).find(":nth-child(1) a small").text();
    torrent.url =
      "https://torrentgalaxy.to" + $(element).find("a.txlight").attr("href");
    torrent.uploadedBy = $(element).find(":nth-child(7) span a span").text();
    torrent.size = $(element).find(":nth-child(8)").text();
    torrent.seeders = Number(
      $(element).find(":nth-child(11) span font:nth-child(1)").text()
    );
    torrent.leechers = Number(
      $(element).find(":nth-child(11) span font:nth-child(2)").text()
    );
    torrent.dateUploaded = $(element).find(":nth-child(12)").text();
    torrent.torrentLink = $(element)
      .find(".tgxtablecell.collapsehide.rounded.txlight a")
      .attr("href");
    torrent.magnet = $(element)
      .find(".tgxtablecell.collapsehide.rounded.txlight a")
      .next()
      .attr("href");
    allTorrents.push(torrent);
  });
  return allTorrents;
};

/* Torrent Project */
export const torrentProject = async (query: string, page = "0") => {
  let torrents: Torrent[] = [];
  let allUrls: string[] = [];
  const url = `https://torrentproject2.com/?t=${query}&p=${page}&orderby=seeders`;
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
  } catch (err) {
    return [];
  }

  const $ = load(html.data);

  $(".tt div").each((i, element) => {
    if (i > 1) {
      let url =
        "https://torrentproject2.com" +
        $(element).find("span").eq(0).find("a").attr("href");
      allUrls.push(url);
      let torrent: Torrent = {
        name: $(element).find("span:nth-child(1)").text().trim(),
        size: $(element).find("span:nth-child(5)").text(),
        dateUploaded: $(element).find("span:nth-child(4)").text().trim(),
        seeders: Number($(element).find("span:nth-child(2)").text().trim()),
        leechers: Number($(element).find("span:nth-child(3)").text().trim()),
        url,
      };
      if (torrent.name !== "") {
        torrents.push(torrent);
      }
    }
  });

  await Promise.all(
    allUrls.map(async (url) => {
      for (let i = 0; i < torrents.length; i++) {
        if (torrents[i]["url"] === url) {
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
          } catch (err) {
            return [];
          }
          const $ = load(html.data);
          let magnet = $(".usite a").attr("href") || "";
          let startMagnetIdx = magnet.indexOf("magnet");
          magnet = magnet.slice(startMagnetIdx);
          torrents[i].magnet = decodeURIComponent(magnet);
        }
      }
    })
  );

  return torrents;
};

/* Zoogle */
export const zooqle = async (query = "", page = "1") => {
  let torrents: Torrent[] = [];
  const url = "https://zooqle.com/search?pg=" + page + "&q=" + query;
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
  } catch (err) {
    return [];
  }
  const $ = load(html.data);

  $("tbody tr").each((_, element) => {
    let seeders_leechers =
      $(element).find("td").eq(5).find("div").attr("title") ||
      "0|0".trim().split("|");
    let seeders = seeders_leechers[0].replace("Seeders:", "").trim();
    let leechers = seeders_leechers[1].replace("Leechers:", "").trim();

    let torrent: Torrent = {
      name: $(element).find("td").eq(1).find("a").text().trim(),
      size: $(element).find("td").eq(3).find("div div").text().trim(),
      dateUploaded: $(element).find("td").eq(4).text().trim(),
      seeders: Number(seeders),
      leechers: Number(leechers),
      url:
        "https://zooqle.com" +
        $(element).find("td").eq(1).find("a").attr("href"),
      magnet: $(element)
        .find("td")
        .eq(2)
        .find("ul")
        .find("li")
        .eq(1)
        .find("a")
        .attr("href"),
    };
    torrents.push(torrent);
  });
  return torrents;
};
