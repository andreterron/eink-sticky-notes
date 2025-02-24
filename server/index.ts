import express from "express";

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
  res.sendFile("./image.png", { root: __dirname });
});

app.listen(5002, () => {
  console.log("LISTENING");
});
