const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

const { authRoute, postsRoute } = require("./routes");

const db = require("./models");
// db.sequelize.sync({ alter: true });
app.use("/auth", authRoute);
app.use("/posts", postsRoute);

app.use("/post_image", express.static(`${__dirname}/public/POST`));

app.listen(PORT, () => {
  console.log(`API IS RUNNING ON PORT ${PORT}`);
});
