"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zooqle = exports.torrentProject = exports.torrentGalaxy = exports.torrentFunk = exports.torLock = exports.rarbgTorrents = exports.pirateBayTorrents = exports.nyaaSITorrents = exports.limeTorrents = exports.glodLSTorrents = exports.kickassTorrents = exports.ettvTorrents = exports.magnetDLTorrents = exports.eztvTorrent = exports.bitSearch = exports.torrent1337x = void 0;
const cheerio_1 = require("cheerio");
const axios_1 = __importDefault(require("axios"));
/* 1337x.to */
const torrent1337x = (query = "", page = "1") => __awaiter(void 0, void 0, void 0, function* () {
    let html;
    const url = `https://1337x.to/search/${query}/${page}/`;
    try {
        html = yield axios_1.default.get(url);
    }
    catch (_a) {
        return null;
    }
    const $ = (0, cheerio_1.load)(html.data);
    const links = $("td.name")
        .map((_, element) => {
        return `https://1337x.to${$(element).find("a").next().attr("href")}`;
    })
        .get();
    return yield Promise.all(links.map((element) => __awaiter(void 0, void 0, void 0, function* () {
        let torrent = {
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
        const labels = [
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
            const html = yield axios_1.default.get(element);
            const $ = (0, cheerio_1.load)(html.data);
            torrent.name = $(".box-info-heading h1").text().trim();
            torrent.magnet = $(".clearfix ul li a").attr("href") || "";
            const poster = $("div.torrent-image img").attr("src");
            if (typeof poster !== "undefined") {
                if (poster.startsWith("http")) {
                    torrent.poster = poster;
                }
                else {
                    torrent.poster = "https:" + poster;
                }
            }
            else {
                torrent.poster = "";
            }
            $("div .clearfix ul li > span").each((i, element) => {
                let list = $(element);
                torrent[labels[i]] = list.text();
            });
            torrent.url = element;
        }
        catch (error) {
            return error;
        }
        return torrent;
    })));
});
exports.torrent1337x = torrent1337x;
/* BitSearch Torrent */
const bitSearch = (query, page = "1") => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://bitsearch.to/search?q=${query}&page=${page}&sort=seeders`;
    const options = {
        method: "GET",
        url,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36",
        },
    };
    let html;
    try {
        html = yield axios_1.default.request(options);
    }
    catch (_b) {
        return null;
    }
    const $ = (0, cheerio_1.load)(html.data);
    let torrents = [];
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
                seeders: Number($(element)
                    .find(".info div div div.stats div:nth-child(3)")
                    .text()
                    .trim()),
                leechers: Number($(element)
                    .find(".info div div div.stats div:nth-child(4)")
                    .text()
                    .trim()),
                dateUploaded: $(element)
                    .find(".info div div div.stats div:nth-child(5)")
                    .text()
                    .trim(),
                url: "https://bitsearch.to" + $(element).find(".info h5 a").attr("href"),
                torrentLink: $(element).find(".links a").attr("href"),
                magnet: $(element).find(".links a").next().attr("href"),
                category: $(element).find(".info div div a.category").text().trim(),
            });
        }
    });
    return torrents;
});
exports.bitSearch = bitSearch;
/* EZTV Torrent */
const eztvTorrent = (query, page = "1") => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://eztv.re/search/${query}`;
    let html;
    try {
        html = yield axios_1.default.get(url);
    }
    catch (_c) {
        return null;
    }
    const $ = (0, cheerio_1.load)(html.data);
    let torrents = [];
    $("tbody tr.forum_header_border").each((_, element) => {
        const url = $(element).find("td:nth-child(2)").find("a").attr("href") || "";
        const name = $(element).find("td:nth-child(2)").find("a").text() || "";
        if (url !== "" || name !== "") {
            if (!name.match(new RegExp(query.replace(/(\W|\s)/gi, "(\\W|\\s|).?"), "ig"))) {
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
});
exports.eztvTorrent = eztvTorrent;
/* MAGNET_DL Torrents */
const magnetDLTorrents = (query, page = "1") => __awaiter(void 0, void 0, void 0, function* () {
    const url = page === "" || page === "1"
        ? `https://magnetdl.abcproxy.org/search/?q=${query}&m=1`
        : `https://magnetdl.proxyninja.org/search/?q=${query}&m=1`;
    let html;
    const options = {
        method: "GET",
        url,
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.87 Mobile Safari/537.36",
        },
    };
    try {
        html = yield axios_1.default.request(options);
    }
    catch (err) {
        return [];
    }
    const $ = (0, cheerio_1.load)(html.data);
    let torrents = [];
    $(".download tbody tr").each((_, element) => {
        let torrent = {
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
});
exports.magnetDLTorrents = magnetDLTorrents;
/* ETTV Torrents - Blocked by Indian Govt */
const ettvTorrents = (query, page = "1") => __awaiter(void 0, void 0, void 0, function* () {
    const allUrls = [];
    const torrents = [];
    const url = `http://www.ettvcentral.com/torrents-search.php?search=${query}&page=${page}`;
    let html;
    try {
        html = yield axios_1.default.get(url);
    }
    catch (err) {
        return [];
    }
    const $ = (0, cheerio_1.load)(html.data);
    $("table tbody").each((_, element) => {
        $("tr").each((_, el) => {
            const td = $(el).children("td");
            let torrent = {
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
                allUrls.push((torrent === null || torrent === void 0 ? void 0 : torrent.url) || "");
                torrents.push(torrent);
            }
        });
    });
    yield Promise.all(allUrls.map((url) => __awaiter(void 0, void 0, void 0, function* () {
        for (let i = 0; i < torrents.length; i++) {
            if (torrents[i]["url"] === url) {
                let html;
                try {
                    html = yield axios_1.default.get(url);
                }
                catch (err) {
                    return null;
                }
                let $ = (0, cheerio_1.load)(html.data);
                try {
                    torrents[i].poster = $("div .torrent_data")
                        .find("center img")
                        .attr("src");
                    torrents[i].magnet = $("#downloadbox > table > tbody > tr > td:nth-child(1) > a").attr("href");
                }
                catch (err) {
                    return [];
                }
            }
        }
    })));
    return torrents;
});
exports.ettvTorrents = ettvTorrents;
/* Kickass Torrents */
const kickassTorrents = (query, page = "1") => __awaiter(void 0, void 0, void 0, function* () {
    let torrents = [];
    let allUrls = [];
    const url = `https://kickasstorrents.to/usearch/${query}/${page}/`;
    const options = {
        method: "GET",
        url,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36",
        },
    };
    let html;
    try {
        html = yield axios_1.default.request(options);
    }
    catch (err) {
        return [];
    }
    const $ = (0, cheerio_1.load)(html.data);
    $("tbody tr").each((i, element) => {
        if (i > 2) {
            let url = `https://kickasstorrents.to${$(element)
                .find("a.cellMainLink")
                .attr("href")}`;
            if (!url.endsWith("undefined")) {
                allUrls.push(url);
                let torrent = {
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
    yield Promise.all(allUrls.map((url) => __awaiter(void 0, void 0, void 0, function* () {
        for (let i = 0; i < torrents.length; i++) {
            if (torrents[i]["url"] === url) {
                const options = {
                    method: "GET",
                    url,
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36",
                    },
                };
                let html;
                try {
                    html = yield axios_1.default.request(options);
                }
                catch (err) {
                    return [];
                }
                const $ = (0, cheerio_1.load)(html.data);
                torrents[i].magnet = $("a.kaGiantButton").attr("href");
            }
        }
    })));
    return torrents;
});
exports.kickassTorrents = kickassTorrents;
/* GloDLS Torrents */
const glodLSTorrents = (query, page = "1") => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://glodls.to/search_results.php?search=${query}&sort=seeders&order=desc&page=${page}`;
    const options = {
        method: "GET",
        url,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36",
        },
    };
    let html;
    try {
        html = yield axios_1.default.request(options);
    }
    catch (err) {
        return [];
    }
    const $ = (0, cheerio_1.load)(html.data);
    let torrents = [];
    $(".ttable_headinner tr").each((_, element) => {
        let torrent = {
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
});
exports.glodLSTorrents = glodLSTorrents;
/* Lime Torrents */
const limeTorrents = (query, page = "1") => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://www.limetorrents.pro/search/all/${query}/seeds/${page}/`;
    const options = {
        method: "GET",
        url,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36",
        },
    };
    let html;
    try {
        html = yield axios_1.default.request(options);
    }
    catch (err) {
        return [];
    }
    const $ = (0, cheerio_1.load)(html.data);
    let torrents = [];
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
            let torrent = {
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
});
exports.limeTorrents = limeTorrents;
/* NyaaSI Torrents */
const nyaaSITorrents = (query, page = "1") => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://nyaa.si/?f=0&c=0_0&q=${query}&p=${page}`;
    let html = null;
    try {
        html = yield axios_1.default.get(url);
    }
    catch (_d) {
        return [];
    }
    const regex = /.comments/gi;
    const $ = (0, cheerio_1.load)(html.data);
    let torrents = [];
    $("tbody tr").each((_, element) => {
        let torrent = {};
        const $find = $(element);
        $find.each((_, element) => {
            const td = $(element).children("td");
            torrent.category = $(element).find("a").attr("title");
            torrent.url = ("https://nyaa.si" + $(element).find('td[colspan="2"] a').attr("href")).replace(regex, "");
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
});
exports.nyaaSITorrents = nyaaSITorrents;
/* PirateBay Torrents */
const pirateBayTorrents = (query, page = "1") => __awaiter(void 0, void 0, void 0, function* () {
    let allTorrents = [];
    const url = `https://thehiddenbay.com/search/${query}/${page}/99/0`;
    let html;
    try {
        html = yield axios_1.default.get(url);
    }
    catch (_e) {
        return [];
    }
    const $ = (0, cheerio_1.load)(html.data);
    $("table#searchResult tr").each((_, element) => {
        var _a;
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
        let torrent = {
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
        if ((_a = torrent.name) === null || _a === void 0 ? void 0 : _a.length) {
            allTorrents.push(torrent);
        }
    });
    return allTorrents;
});
exports.pirateBayTorrents = pirateBayTorrents;
const rarbgTorrents = (query, page = "1") => __awaiter(void 0, void 0, void 0, function* () {
    let allUrls = [];
    let torrents = [];
    const url = `https://rargb.to/search/${page}/?search=${query}`;
    const options = {
        method: "GET",
        url,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36",
        },
    };
    let html;
    try {
        html = yield axios_1.default.request(options);
    }
    catch (err) {
        return [];
    }
    const $ = (0, cheerio_1.load)(html.data);
    $("table.lista2t tbody").each((_, element) => {
        $("tr.lista2").each((_, el) => {
            let torrent = {};
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
    yield Promise.all(allUrls.map((url) => __awaiter(void 0, void 0, void 0, function* () {
        for (let i = 0; i < torrents.length; i++) {
            if (torrents[i]["url"] === url) {
                const options = {
                    method: "GET",
                    url,
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36",
                    },
                };
                let html;
                try {
                    html = yield axios_1.default.request(options);
                }
                catch (err) {
                    return [];
                }
                let $ = (0, cheerio_1.load)(html.data);
                let poster = "https://rargb.to" +
                    $("tr:nth-child(4) > td:nth-child(2) > img:nth-child(1)").attr("src") || "";
                torrents[i].poster = !poster.endsWith("undefined") ? poster : "";
                torrents[i].magnet = $("tr:nth-child(1) > td:nth-child(2) > a:nth-child(3)").attr("href");
            }
        }
    })));
    return torrents;
});
exports.rarbgTorrents = rarbgTorrents;
/* Tor Lock Torrents - Blocked by Indian Govt */
const torLock = (query = "", page = "1") => __awaiter(void 0, void 0, void 0, function* () {
    let torrents = [];
    let allUrls = [];
    const url = encodeURI("https://www.torlock.com/all/torrents/" + query + "/" + page + ".html");
    let html;
    try {
        html = yield axios_1.default.get(url);
    }
    catch (error) {
        return [];
    }
    const $ = (0, cheerio_1.load)(html.data);
    $(".table tbody tr").each((i, element) => {
        if (i > 3) {
            let url = "https://www.torlock.com" +
                $(element).find("td").eq(0).find("div a").attr("href");
            allUrls.push(url);
            let torrent = {
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
    yield Promise.all(allUrls.map((url) => __awaiter(void 0, void 0, void 0, function* () {
        for (let i = 0; i < torrents.length; i++) {
            if (torrents[i]["url"] === url) {
                const options = {
                    method: "GET",
                    url,
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36",
                    },
                };
                let html;
                try {
                    html = yield axios_1.default.request(options);
                }
                catch (err) {
                    return [];
                }
                const $ = (0, cheerio_1.load)(html.data);
                torrents[i].torrentLink =
                    $("body > article > div:nth-child(6) > div > div:nth-child(2) > a").attr("href") || "";
                torrents[i].magnet = $("body > article > table:nth-child(5) > thead > tr > th > div:nth-child(2) > h4 > a:nth-child(1)").attr("href");
            }
        }
    })));
    return torrents;
});
exports.torLock = torLock;
/* Torrent Funk */
const torrentFunk = (query, page = "1") => __awaiter(void 0, void 0, void 0, function* () {
    let torrents = [];
    let allUrls = [];
    let url = "";
    if (page === "" || page === "1") {
        url = "https://www.torrentfunk.com/all/torrents/" + query + ".html";
    }
    else {
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
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36",
        },
    };
    let html;
    try {
        html = yield axios_1.default.request(options);
    }
    catch (err) {
        return [];
    }
    const $ = (0, cheerio_1.load)(html.data);
    $(".tmain tbody tr").each((i, element) => {
        if (i > 4) {
            let url = "https://www.torrentfunk.com" +
                $(element).find("td").eq(0).find("a").attr("href");
            allUrls.push(url);
            let torrent = {
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
    yield Promise.all(allUrls.map((url) => __awaiter(void 0, void 0, void 0, function* () {
        for (let i = 0; i < torrents.length; i++) {
            if (torrents[i]["url"] === url) {
                const options = {
                    method: "GET",
                    url,
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36",
                    },
                };
                let html;
                try {
                    html = yield axios_1.default.request(options);
                }
                catch (err) {
                    return [];
                }
                const $ = (0, cheerio_1.load)(html.data);
                torrents[i].torrent = $("#right > main > div.content > table:nth-child(3) > tbody > tr > td:nth-child(2) > a").attr("href");
            }
        }
    })));
    return torrents;
});
exports.torrentFunk = torrentFunk;
/* Torrent Galaxy */
const torrentGalaxy = (query = "", page = "0") => __awaiter(void 0, void 0, void 0, function* () {
    let currentPage = 0;
    if (page !== "0") {
        try {
            currentPage = Number(page) - 1;
        }
        catch (_f) {
            return [];
        }
    }
    let allTorrents = [];
    const url = "https://torrentgalaxy.to/torrents.php?search=" +
        query +
        "&sort=id&order=desc&page=" +
        currentPage;
    let html;
    try {
        html = yield axios_1.default.get(url);
    }
    catch (_g) {
        return [];
    }
    const $ = (0, cheerio_1.load)(html.data);
    $("div.tgxtablerow.txlight").each((_, element) => {
        const torrent = {};
        torrent.name = $(element).find(":nth-child(4) div a b").text();
        torrent.category = $(element).find(":nth-child(1) a small").text();
        torrent.url =
            "https://torrentgalaxy.to" + $(element).find("a.txlight").attr("href");
        torrent.uploadedBy = $(element).find(":nth-child(7) span a span").text();
        torrent.size = $(element).find(":nth-child(8)").text();
        torrent.seeders = Number($(element).find(":nth-child(11) span font:nth-child(1)").text());
        torrent.leechers = Number($(element).find(":nth-child(11) span font:nth-child(2)").text());
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
});
exports.torrentGalaxy = torrentGalaxy;
/* Torrent Project */
const torrentProject = (query, page = "0") => __awaiter(void 0, void 0, void 0, function* () {
    let torrents = [];
    let allUrls = [];
    const url = `https://torrentproject2.com/?t=${query}&p=${page}&orderby=seeders`;
    const options = {
        method: "GET",
        url,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36",
        },
    };
    let html;
    try {
        html = yield axios_1.default.request(options);
    }
    catch (err) {
        return [];
    }
    const $ = (0, cheerio_1.load)(html.data);
    $(".tt div").each((i, element) => {
        if (i > 1) {
            let url = "https://torrentproject2.com" +
                $(element).find("span").eq(0).find("a").attr("href");
            allUrls.push(url);
            let torrent = {
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
    yield Promise.all(allUrls.map((url) => __awaiter(void 0, void 0, void 0, function* () {
        for (let i = 0; i < torrents.length; i++) {
            if (torrents[i]["url"] === url) {
                const options = {
                    method: "GET",
                    url,
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36",
                    },
                };
                let html;
                try {
                    html = yield axios_1.default.request(options);
                }
                catch (err) {
                    return [];
                }
                const $ = (0, cheerio_1.load)(html.data);
                let magnet = $(".usite a").attr("href") || "";
                let startMagnetIdx = magnet.indexOf("magnet");
                magnet = magnet.slice(startMagnetIdx);
                torrents[i].magnet = decodeURIComponent(magnet);
            }
        }
    })));
    return torrents;
});
exports.torrentProject = torrentProject;
/* Zoogle */
const zooqle = (query = "", page = "1") => __awaiter(void 0, void 0, void 0, function* () {
    let torrents = [];
    const url = "https://zooqle.com/search?pg=" + page + "&q=" + query;
    const options = {
        method: "GET",
        url,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36",
        },
    };
    let html;
    try {
        html = yield axios_1.default.request(options);
    }
    catch (err) {
        return [];
    }
    const $ = (0, cheerio_1.load)(html.data);
    $("tbody tr").each((_, element) => {
        let seeders_leechers = $(element).find("td").eq(5).find("div").attr("title") ||
            "0|0".trim().split("|");
        let seeders = seeders_leechers[0].replace("Seeders:", "").trim();
        let leechers = seeders_leechers[1].replace("Leechers:", "").trim();
        let torrent = {
            name: $(element).find("td").eq(1).find("a").text().trim(),
            size: $(element).find("td").eq(3).find("div div").text().trim(),
            dateUploaded: $(element).find("td").eq(4).text().trim(),
            seeders: Number(seeders),
            leechers: Number(leechers),
            url: "https://zooqle.com" +
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
});
exports.zooqle = zooqle;
