const { sequelize, Sequelize } = require("../config/database");

const Report = sequelize.define(
  "Report",
  {
    userId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    postId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    author: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    content: {
      type: Sequelize.STRING(2000),
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: null,
    },
  },
  {
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

module.exports = Report;
