import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { combineAllTorrents } from "./torrent-aggregator";

import Torrent from "./types";
import apicache from "apicache";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

let cache = apicache.middleware;
app.use(cache("30 minutes"));

app.get("/torrents", async (req: Request, res: Response) => {
  let query: string = req.query.query as string;
  let results = [];
  try {
    results = (await combineAllTorrents(query)).flat(1);
  } catch (error) {
    console.log(error);
  }

  console.log(results);
  // Sorting based on Seeders
  results.sort(
    (a, b) => ((b as Torrent).seeders || 0) - ((a as Torrent).seeders || 0)
  );

  res.send({
    data: results.filter((res) => res !== null),
  });
});

app.get("/", async (req: Request, res: Response) => {
  res.send("Welcome to Torrent Search Engine API");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
