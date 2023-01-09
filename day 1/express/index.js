const express = require("express");
var bodyParser = require("body-parser");

const app = express();
const PORT = 2000;
app.use(express.json());

// const bodyParser = require("body-parser");

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

app.get("/", (req, res) => {
  res.send("this is simple API");
});

app.get("/users/:id", (req, res) => {
  let id = req.params.id;
  console.log(id);

  const filteredUser = users.find((val) => {
    return val.id == id;
  });

  console.log(filteredUser);

  res.status(200).json({
    message: "user data fetched",
    result: filteredUser,
  });
});

app.get("/users", (req, res) => {
  let nama = req.query.nama;

  if (!nama) {
    res.status(200).json({
      message: "user data fetched",
      result: users,
    });
  } else {
    const filteredUser = users.filter((val) => {
      return val.nama == nama;
    });
    res.status(200).json({
      message: "user data fetched",
      result: filteredUser,
    });
  }
});

app.post("/users", (req, res) => {
  const data = req.body;
  console.log(data);
  users.push(data);
  res.status(200).json({
    message: "new user added",
    result: data,
  });
});

app.patch("/users/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const findIndex = users.findIndex((val) => {
    return val.id == id;
  });

  if (findIndex == -1) {
    res.status(400).json({
      message: "user id " + id + " not found",
    });
    return;
  }

  users[findIndex] = {
    ...users[findIndex],
    ...data,
  };

  res.status(200).json({
    message: "user id " + id + " edited",
    result: users[findIndex],
  });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  const findIndex = users.findIndex((val) => {
    return val.id == id;
  });

  if (findIndex == -1) {
    res.status(400).json({
      message: "user id " + id + " not found",
    });
    return;
  }

  users.splice(findIndex, 1);

  res.status(200).json({
    message: "user id " + id + " deleted",
  });
});

app.listen(PORT, () => {
  console.log("server is running on PORT " + PORT);
});
