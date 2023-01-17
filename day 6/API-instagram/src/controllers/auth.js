const db = require("../database/config");

const authController = {
  login: (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    const q = `select id, username,avatar_url,name,description,password from users
     where username = '${username}'  and password = '${password}' `;
    db.query(q, (error, result) => {
      try {
        if (result.length) {
          return res.status(200).json({
            message: "user successfully logged in",
            result: result[0],
          });
        }
        return res.status(400).json({
          message: "user failed logged in",
        });
      } catch (err) {
        console.log(err);
        res.status(400).json({
          message: error,
        });
      }
    });
  },
  register: (req, res) => {
    console.log(req.body);
    const { email, name, username, password } = req.body;
    const q = `insert into users (email,name,username,password) values ('${email}','${name}','${username}','${password}')`;
    db.query(q, (error, result) => {
      try {
        if (error) {
          return res.status(400).json({
            message: "register failed",
          });
        }
        res.status(201).json({
          message: "new user registered",
        });
      } catch (err) {
        console.log(err);
        res.status(400).json({
          message: error,
        });
      }
    });
  },
  getUserByUsername: (req, res) => {
    const { username } = req.query;
    const q = `select * from users where username = '${username}'`;
    console.log(username);

    db.query(q, (err, result) => {
      if (err) {
        return res.status(400).json({
          message: err,
        });
      }

      return res.status(200).json({
        message: "fetched user",
        result: result[0],
      });
    });
  },
};

module.exports = authController;
