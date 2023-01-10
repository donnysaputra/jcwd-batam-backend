const express = require("express");
const router = express.Router();

const users = [
  {
    id: 1,
    nama: "udin",
    email: "udin@mail.com",
  },
  {
    id: 2,
    nama: "sasuke",
    email: "sasuke@mail.com",
  },
];

router.get("/", (req, res) => {
  res.status(200).json({
    message: "user data fetched",
    result: users,
  });
});

module.exports = router;
