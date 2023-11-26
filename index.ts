import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
const cors = require("cors");
import { combineAllTorrents } from "./torrent-aggregator";

import Torrent from "./types";
import apicache from "apicache";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors());

let cache = apicache.middleware;
app.use(cache("30 minutes"));

app.get("/", async (req: Request, res: Response) => {
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

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
