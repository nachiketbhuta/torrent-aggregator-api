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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const torrent_aggregator_1 = require("./torrent-aggregator");
const apicache_1 = __importDefault(require("apicache"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
let cache = apicache_1.default.middleware;
app.use(cache("30 minutes"));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let query = req.query.query;
    const promises = [
        (0, torrent_aggregator_1.torrent1337x)(query),
        (0, torrent_aggregator_1.bitSearch)(query),
        (0, torrent_aggregator_1.eztvTorrent)(query),
        (0, torrent_aggregator_1.magnetDLTorrents)(query),
        (0, torrent_aggregator_1.ettvTorrents)(query),
        (0, torrent_aggregator_1.kickassTorrents)(query),
        (0, torrent_aggregator_1.glodLSTorrents)(query),
        (0, torrent_aggregator_1.limeTorrents)(query),
        (0, torrent_aggregator_1.nyaaSITorrents)(query),
        (0, torrent_aggregator_1.pirateBayTorrents)(query),
        (0, torrent_aggregator_1.rarbgTorrents)(query),
        (0, torrent_aggregator_1.torLock)(query),
        (0, torrent_aggregator_1.torrentFunk)(query),
        (0, torrent_aggregator_1.torrentGalaxy)(query),
        (0, torrent_aggregator_1.torrentProject)(query),
        (0, torrent_aggregator_1.zooqle)(query),
    ];
    const results = (yield Promise.all(promises)).flat(1);
    // Sorting based on Seeders
    results.sort((a, b) => (b.seeders || 0) - (a.seeders || 0));
    res.send({
        data: results.filter((res) => res !== null),
    });
}));
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
