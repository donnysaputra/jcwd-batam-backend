const express = require("express");
const app = express();
// const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;

const routes = require("./routes");

app.use(express.json());

// app.use(express.static("database"));

app.use("/users", routes.usersRoute);
app.use("/products", routes.productsRoute);

app.get("/", (req, res) => {
  res.send("api is running ");
});

app.listen(PORT, () => {
  console.log("api is running on port " + PORT);
});
