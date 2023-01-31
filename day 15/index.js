const express = require("express");
const mysql = require("mysql2");
const app = express();

app.get("/", (req, res) => {
  res.send("hello world");
});

const db = mysql.createConnection({
  host: "mysql_server",
  // host: "host.docker.internal",
  // host: "localhost",
  user: "user",
  password: "password",
  database: "exercise",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("db connected");
  }
});

app.get("/nama", (req, res) => {
  db.query("select * from user", (err, result) => {
    if (err) {
      return res.status(400).send(err.toString());
    }
    res.status(200).send(result);
  });
});

app.listen(2600, () => {
  console.log("server is running on port 2500");
});
