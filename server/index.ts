import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Jimp, JimpMime } from "jimp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const last_update = Date.now();

app.get("/data", (req, res) => {
  console.log("DATA", new Date());
  res.json({ last_update });
});
app.get("/task", (req, res) => {
  console.log("TASK", new Date());
  res.json({ name: "Update code", status: "active" });
});

app.get("/image.png", async (req, res) => {
  try {
    res.sendFile("./logo.png", { root: __dirname });
  } catch (e) {
    console.error(e);
  }
});

app.get("/image.bmp", async (req, res) => {
  try {
    const image = await Jimp.read(join(__dirname, "task.png"));
    image.posterize(2);
    const buffer = await image.getBuffer(JimpMime.bmp, { colors: 2 });
    res.contentType("bmp");
    res.send(buffer);
  } catch (e) {
    console.error(e);
  }
});

app.listen(5002, () => {
  console.log("LISTENING");
});
