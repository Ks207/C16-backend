const { sequelize, Sequelize } = require("../config/database");

const Resource = sequelize.define(
  "Resource",
  {
    userId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    comuna: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    highlighted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    image:{
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

module.exports = Resource;