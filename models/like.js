const { sequelize, Sequelize } = require("../config/database");

const Like = sequelize.define("Like", {
  userId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  postId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Like;
