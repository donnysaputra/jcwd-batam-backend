const { body, validationResult } = require("express-validator");
const userValidationRules = () => {
  return [
    // username must be an email
    body("email").isEmail(),
    // password must be at least 5 chars long
    body("password").isLength({ min: 5 }),
  ];
};

const userValidator = () => {
  return [
    body("email").isEmail().withMessage("bukan email"),
    body("phone_number").isNumeric().withMessage("bukan nomor"),
    body("password").isLength({ min: 5 }).withMessage("password kurang dari 5"),
    body("confirmation_password").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
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

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  userValidationRules,
  validate,
  userValidator,
  validate2,
};
