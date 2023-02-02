const { request } = require("express");
const express = require("express");
const hymn = require("./models/hymn");
const app = express();
const port = 3000;
const db = require("./models"); // 특정 디렉토리만 적어줘도 그 아래에 있는 index.js 파일을 자동으로 찾음
const { Hymn } = db;
const cors = require("cors");
const { where } = require("sequelize");

app.use(cors());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log("listening on port", port);
});

app.get("/api/themes", async (req, res) => {
  const { key } = req.query;
  let where = {};
  if (key) {
    where["key"] = key;
  }
  const themes = await Hymn.findAll({
    attributes: ["theme"],
    where: where,
    group: "theme",
  });
  let result = themes.map((theme) => theme.get("theme")).sort();
  console.log(result);
  res.send(result);
});

app.get("/api/keys", async (req, res) => {
  const { theme } = req.query;
  console.log("@@@@", theme);
  let where = {};
  if (theme) {
    where["theme"] = theme;
  }

  const keys = await Hymn.findAll({
    attributes: ["key"],
    where: where,
    group: "key",
  });

  let result = keys.map((key) => key.get("key")).sort();
  console.log(result);
  res.send(result);
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

  if (hymns.length == 0) {
    res.send({ name: "error" });
  } else if (isRandom) {
    console.log(1);
    console.log(hymns[Math.floor(Math.random() * hymns.length)]);
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
