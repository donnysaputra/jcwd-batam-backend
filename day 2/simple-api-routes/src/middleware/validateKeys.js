const validateKeys = (req, res, next) => {
  //   console.log(process.env.key);
  if (req.headers["x-secret-key"] === process.env.key) {
    console.log("user validated");
    next();
    return;
  }

  res.status(401).json({
    message: "user unauthorized",
  });
  return;
};

module.exports = validateKeys;
