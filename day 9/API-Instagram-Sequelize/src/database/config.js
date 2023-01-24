const db = require("mysql2");

const config = process.env;
module.exports = db.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  port: config.mysql_port,
  database: config.database,
  multipleStatements: true,
});
