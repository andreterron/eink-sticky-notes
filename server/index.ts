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

app.get("/image.xbm", async (req, res) => {
  try {
    const image = await Jimp.read(join(__dirname, "task.png"));
    image.posterize(2);

    // Calculate padded width (must be multiple of 8)
    const paddedWidth = Math.ceil(image.width / 8) * 8;
    const byteWidth = paddedWidth / 8;
    const buffer = Buffer.alloc(byteWidth * image.height);

    // Convert image to XBM format
    for (let y = 0; y < image.height; y++) {
      for (let x = 0; x < image.width; x++) {
        const color = image.getPixelColor(x, y);
        // Reverse the logic: dark pixels (low values) become 1, light pixels become 0
        const bit = ((color >> 24) & 0xff) > 127 ? 0 : 1;

        // Calculate position in buffer
        const byteIndex = y * byteWidth + Math.floor(x / 8);
        const bitIndex = x % 8;

        // Set bit in byte (little-endian)
        if (bit) {
          buffer[byteIndex] |= 1 << bitIndex;
        }
      }
    }

    res.contentType("image/x-xbitmap");
    res.send(buffer);
  } catch (e) {
    console.error(e);
  }
});

app.listen(5002, () => {
  console.log("LISTENING");
});
