"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.user = require("./user")(sequelize, Sequelize);
db.comment = require("./comment")(sequelize, Sequelize);
db.post_comment = require("./post_comment")(sequelize, Sequelize);
db.post_like = require("./post_like")(sequelize, Sequelize);
db.post = require("./post")(sequelize, Sequelize);

//post
db.post.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "User",
});

//comment
db.comment.belongsTo(db.user, { foreignKey: "user_id" });

//post like
db.post.belongsToMany(db.user, { through: db.post_like, as: "Likes" });
db.user.belongsToMany(db.post, { through: db.post_like });

//post comment
db.comment.belongsToMany(db.post, {
  through: db.post_comment,
  foreignKey: "comment_id",
});

db.post.belongsToMany(db.comment, {
  through: db.post_comment,
  foreignKey: "post_id",
});
sequelize;

module.exports = db;
