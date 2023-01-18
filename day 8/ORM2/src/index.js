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

// User.sync({ alter: true });

app.post("/users", async (req, res) => {
  const { firstName, lastName, address } = req.body;
  const result = await User.create({
    firstName: firstName,
    lastName: lastName,
    address: address,
  });

  console.log(result);
  res.send(result);
});

app.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  const result = await User.findAll({
    // attributes: ["firstName", "lastName"],
    attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "test"]],
    where: {
      //   id: {
      //     [Op.eq]: 1,
      //   },
      [Op.or]: [{ id: 1 }, { id: 3 }],
    },
  });
  //   console.log(result);
  res.send(result);
});

app.delete("/users", async (req, res) => {
  const result = await User.destroy({
    where: {
      id: 2,
    },
  });
  res.status(200).json({
    message: "data deleted",
    result: result,
  });
});

app.patch("/users", async (req, res) => {
  const result = await User.update(
    {
      firstName: "narutu",
    },
    {
      where: {
        id: 1,
      },
    }
  );
  res.status(200).json({
    message: "data updated",
    result: result,
  });
});

//insert result => data baru
//delete result => 0
//update return => 1
app.listen(PORT, () => {
  console.log("api is running");
});
