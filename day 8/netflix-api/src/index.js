const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

const db = require("./models");
const { sequelize } = require("./models");
const User = db.User;
const { Op } = require("sequelize");

// db.sequelize.sync({ alter: true });

const moviesRoutes = require("./routes/movies");
app.use("/movies", moviesRoutes);

app.get("/", (req, res) => {
  res.send("api netflix");
});

app.listen(PORT, () => {
  console.log("api is running");
});
