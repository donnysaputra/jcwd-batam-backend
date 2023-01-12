const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const expensesRoute = require("./routes/expenses");

app.use("/expenses", expensesRoute);

app.get("/", (req, res) => {
  res.send("api is running");
});

app.listen(PORT, () => {
  console.log("API is running on port " + PORT);
});
