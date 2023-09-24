import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { torrent1337x, bitSearch } from "./torrent-aggregator";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/", async (req: Request, res: Response) => {
  const query = "the lincoln lawyer";
  // res.send(await torrent1337x("the lincoln lawyer"));
  // res.send(await bitSearch("the lincoln lawyer"));
  const promises = [torrent1337x(query), bitSearch(query)];
  res.send({
    data: (await Promise.all(promises)).flat(1),
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
