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
exports.eztvTorrent = exports.bitSearch = exports.torrent1337x = void 0;
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
