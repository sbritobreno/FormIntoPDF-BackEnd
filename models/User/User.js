const { DataTypes } = require("sequelize");
const db = require("../../db/conn");

const User = db.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  image: {
    type: DataTypes.STRING,
    required: true,
  },
  name: {
    type: DataTypes.STRING,
    required: true,
  },
  email: {
    type: DataTypes.STRING,
    required: true,
  },
  role: {
    type: DataTypes.STRING,
    required: true,
  },
  phone: {
    type: DataTypes.STRING,
    required: true,
  },
  admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    required: true,
  },
  password: {
    type: DataTypes.STRING,
    required: true,
  },
});

module.exports = User;