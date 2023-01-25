const jwt = require("jsonwebtoken");
const secret = process.env.secret_key;
const db = require("../models");
const User = db.user;

const checkRole = async (req, res, next) => {
  const result = await User.findOne({
    where: {
      username: req.body.username,
    },
  });
  if (!result?.isAdmin) {
    return res.status(401).json({
      message: "access denied",
    });
  }

  next();
};

module.exports = { checkRole };
