import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import {
  torrent1337x,
  bitSearch,
  eztvTorrent,
  magnetDLTorrents,
  ettvTorrents,
  kickassTorrents,
  glodLSTorrents,
  limeTorrents,
  nyaaSITorrents,
  pirateBayTorrents,
  rarbgTorrents,
  torLock,
  torrentFunk,
  torrentGalaxy,
  torrentProject,
  zooqle,
} from "./torrent-aggregator";

import Torrent from "./types";
import apicache from "apicache";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

let cache = apicache.middleware;
app.use(cache("30 minutes"));

app.get("/", async (req: Request, res: Response) => {
  let query: string = req.query.query as string;
  const promises = [
    torrent1337x(query),
    bitSearch(query),
    eztvTorrent(query),
    magnetDLTorrents(query),
    ettvTorrents(query),
    kickassTorrents(query),
    glodLSTorrents(query),
    limeTorrents(query),
    nyaaSITorrents(query),
    pirateBayTorrents(query),
    rarbgTorrents(query),
    torLock(query),
    torrentFunk(query),
    torrentGalaxy(query),
    torrentProject(query),
    zooqle(query),
  ];

  let results: any[] = [];
  try {
    results = (await Promise.all(promises)).flat(1);
  } catch (error) {
    console.log(error);
  }

  // Sorting based on Seeders
  results.sort(
    (a, b) => ((b as Torrent).seeders || 0) - ((a as Torrent).seeders || 0)
  );

  res.send({
    data: results.filter((res) => res !== null),
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
