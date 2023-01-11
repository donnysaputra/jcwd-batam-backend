const db = require("../database/data.json");
const fs = require("fs");

const savedJSON = require("../database/write-json");

const usersController = {
  getUsers: (req, res) => {
    res.status(200).json({
      message: "users data fetched",
      result: db.users,
    });
  },
  createUser: (req, res) => {
    const data = req.body;
    db.users.push(data);
    savedJSON(db);
    res.status(200).json({
      message: "new user added",
      result: data,
    });
  },
  editUser: (req, res) => {
    const data = req.body;
    const id = req.params.id;

    const findIndex = db.users.findIndex((val) => {
      return val.id == id;
    });

    if (findIndex == -1) {
      res.status(400).json({
        message: "id not found",
      });
    }

    db.users[findIndex] = {
      ...db.users[findIndex],
      ...data,
    };

    savedJSON(db);
    res.status(200).json({
      message: "user edited",
      result: db.users[findIndex],
    });
  },
  deleteUser: (req, res) => {
    const data = req.body;
    const id = req.params.id;

    const findIndex = db.users.findIndex((val) => {
      return val.id == id;
    });

    if (findIndex == -1) {
      res.status(400).json({
        message: "id not found",
      });
    }

    db.users.splice(findIndex, 1);

    savedJSON(db);
    res.status(200).json({
      message: "user deleted",
    });
  },
};
module.exports = usersController;
