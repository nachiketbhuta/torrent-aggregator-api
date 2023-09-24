import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { torrent1337x, bitSearch, eztvTorrent } from "./torrent-aggregator";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/", async (req: Request, res: Response) => {
  const query = "the lincoln lawyer";
  // res.send(await torrent1337x("the lincoln lawyer"));
  // res.send(await bitSearch("the lincoln lawyer"));
  // console.log(await );
  const promises = [torrent1337x(query), bitSearch(query), eztvTorrent(query)];
  const results = (await Promise.all(promises)).flat(1);
  console.log(results.length);
  res.send({
    data: results,
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
