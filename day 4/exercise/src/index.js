const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const expensesRoute = require("./routes/expenses");
const db = require("./database/config");
app.use("/expenses", expensesRoute);
db.connect((err) => {
  if (err) {
    console.log("database connection failed");
  }
  console.log("db connected");
});
app.get("/", (req, res) => {
  res.send("api is running");
});

app.listen(PORT, () => {
  console.log("API is running on port " + PORT);
});
