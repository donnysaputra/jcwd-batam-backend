const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());

const db = require("./database/config");
const { authRoute, postsRoute } = require("./routes");

app.use("/auth", authRoute);
app.use("/posts", postsRoute);

db.connect((err) => {
  if (err) {
    return console.log(err);
  }

  console.log(process.env.database);

  console.log("db connected");
});

app.listen(PORT, () => {
  console.log(`API IS RUNNING ON PORT ${PORT}`);
});
