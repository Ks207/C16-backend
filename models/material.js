const { sequelize, Sequelize } = require("../config/database");

const Material = sequelize.define("Material", {
  userId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  materialURL: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  duration: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Material;
