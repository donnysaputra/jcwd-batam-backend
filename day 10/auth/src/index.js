const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());

const authRoute = require("./routes/auth");

const db = require("./models");
// db.sequelize.sync({ alter: true });
app.use("/auth", authRoute);

app.listen(PORT, () => {
  console.log(`API IS RUNNING ON PORT ${PORT}`);
});
