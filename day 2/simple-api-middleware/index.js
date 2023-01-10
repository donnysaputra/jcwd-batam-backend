const express = require("express");
const app = express();
const router = express.Router();
app.use(express.json());

const PORT = 2000;

app.use("/users", router);
//pertama kita akan masuk kedalam path /users. mau apapun bentuk methodnya

router.use("/users", (req, res, next) => {
  console.log("router use");
  next();
}); //middleware router untuk console.log
//next menuju method berikutnya

router.get("/", (req, res) => {
  res.send("halo ini user");
});
//setelah middleware maka akan lanjut ke router.get melakukan res.send
router.get("/1", (req, res) => {
  res.send("halo ini user 1");
});

//localhost:2000/users/

app.get(
  "/",
  (req, res, next) => {
    console.log("hello");
    // next();
  },
  //middleware
  (req, res) => {
    console.log("hello 2");
    res.send("hello");
  }
);

app.listen(PORT, () => {
  console.log("API is running " + PORT);
});
