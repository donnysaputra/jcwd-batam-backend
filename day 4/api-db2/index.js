const express = require("express");
const app = express();
app.use(express.json());
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  password: "terserah",
  user: "root",
  database: "jcwd0106",
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("db connected");
  }
});

app.get("/", (req, res) => {
  const qString = "Select * from Student";
  db.query(qString, (err, result) => {
    if (err) {
      res.status(400).json({
        message: "query error",
      });
    }
    res.status(200).json({
      message: "data fetched",
      result: result,
    });
  });
});

app.listen(2000, () => {
  console.log("api is running");
});
