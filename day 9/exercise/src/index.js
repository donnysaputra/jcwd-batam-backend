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

const { userRoutes, expenseRoutes } = require("./routes");
app.use("/users", userRoutes);
app.use("/expenses", expenseRoutes);

app.get("/", (req, res) => {
  res.send("api expense");
});

app.listen(PORT, () => {
  console.log("api is running");
});
