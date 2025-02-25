import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";

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

app.get("/image.png", (req, res) => {
  res.sendFile("./logo.png", { root: __dirname });
});

app.listen(5002, () => {
  console.log("LISTENING");
});
