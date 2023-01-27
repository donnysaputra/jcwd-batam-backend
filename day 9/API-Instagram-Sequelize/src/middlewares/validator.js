const { body, validationResult } = require("express-validator");

const userValidator = () => {
  return [
    body("email").isEmail().withMessage("bukan email"),
    body("password").isLength({ min: 5 }).withMessage("password kurang dari 5"),
    body("confirmation_password").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  ];
};

const validate2 = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array(),
    });
  }
  return next();
};

module.exports = {
  userValidator,
  validate2,
};
