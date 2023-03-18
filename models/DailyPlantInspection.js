const { DataTypes } = require("sequelize");
const db = require("../db/conn");

const DailyPlantInspection = db.define("daily_plant_inspection", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tool_name: {
    type: DataTypes.STRING,
    required: true,
  },
  monday: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
  tuesday: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
  wednesday: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
  thrusday: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
  friday: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
  saturday: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
  sunday: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
});

module.exports = DailyPlantInspection;
