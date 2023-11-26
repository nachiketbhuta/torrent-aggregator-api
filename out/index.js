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
const cors = require("cors");
const torrent_aggregator_1 = require("./torrent-aggregator");
const apicache_1 = __importDefault(require("apicache"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(cors());
let cache = apicache_1.default.middleware;
app.use(cache("30 minutes"));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let query = req.query.query;
    let results = [];
    try {
        results = (yield (0, torrent_aggregator_1.combineAllTorrents)(query)).flat(1);
    }
    catch (error) {
        console.log(error);
    }
    console.log(results);
    // Sorting based on Seeders
    results.sort((a, b) => (b.seeders || 0) - (a.seeders || 0));
    res.send({
        data: results.filter((res) => res !== null),
    });
}));
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
