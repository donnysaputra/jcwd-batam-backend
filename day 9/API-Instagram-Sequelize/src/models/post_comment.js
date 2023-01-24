const { post_comment } = require(".");

module.exports = (sequelize, Sequelize) => {
  const post_comment = sequelize.define("post_comment", {}, {});
  return post_comment;
};
