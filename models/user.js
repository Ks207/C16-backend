const { sequelize, Sequelize } = require("../config/database");

const defaultProfileImg = "https://firebasestorage.googleapis.com/v0/b/dropbox-clone-736fa.appspot.com/o/users%2Fuser_2aNC9F2HWDn5x5KjMBi9Y9ywEQX%2Ffiles%2Fdefaultprofile.png?alt=media"

const User = sequelize.define(
  "User",
  {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    firstname: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    lastname: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    rut: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    },
    birthday: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
    gender: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    region: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    comuna: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    photo: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: defaultProfileImg
    },
    completed: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    roleId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 3,
    },
    enabled: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

module.exports = User;
