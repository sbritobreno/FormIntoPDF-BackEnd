const { DataTypes } = require("sequelize");
const db = require("../../db/conn");

const Hazards = db.define("Hazards", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    required: true,
  },
  control: {
    type: DataTypes.STRING,
    required: true,
  },
  value: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
});

module.exports = Hazards;
