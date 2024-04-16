const { sequelize, Sequelize } = require("../config/database");

const Partner = sequelize.define("Partner", {
  userId: {
    type: Sequelize.STRING,
    allowNull: false,          
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,
  }
},
{
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt"
});

module.exports = Partner;
