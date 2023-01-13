const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  password: "terserah",
  user: "root",
  database: "db_expenses",
});

module.exports = db;
