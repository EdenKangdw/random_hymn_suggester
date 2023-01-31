const { request } = require("express");
const express = require("express");
const hymn = require("./models/hymn");
const app = express();
const port = 3000;
const db = require("./models"); // 특정 디렉토리만 적어줘도 그 아래에 있는 index.js 파일을 자동으로 찾음
const { Hymn } = db;
const cors = require("cors");

app.use(cors());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log("listening on port", port);
});

app.get("/api/themes", async (req, res) => {
  const themes = await Hymn.findAll({
    attributes: ["theme"],
    group: "theme",
  });
  res.send(themes.map((theme) => theme.get("theme")).sort());
});

app.get("/api/keys", async (req, res) => {
  const keys = await Hymn.findAll({
    attributes: ["key"],
    group: "key",
  });
  res.send(keys.map((key) => key.get("key")).sort());
});

app.get("/api/hymns", async (req, res) => {
  const { theme, key, isRandom } = req.query;
  let where = {};
  if (theme) {
    where["theme"] = theme;
  }
  if (key) {
    where["key"] = key;
  }
  const hymns = await Hymn.findAll({
    where: where,
  });

  if (isRandom) {
    console.log(isRandom);

    console.log(hymns);
    res.send(hymns[Math.floor(Math.random() * hymns.length)]);
  } else {
    res.send(hymns);
  }
});

app.get("/db_status", (req, res) => {
  if (!pool) {
    const pool = db.createPool({
      host: "docker-mysql",
      user: "root",
      password: "password",
      database: "today_hymn",
      port: 3306,
    });
  }
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(err);
      res.send(err.message);
    } else {
      connection.release();
      res.send("connection established");
    }
  });
});
