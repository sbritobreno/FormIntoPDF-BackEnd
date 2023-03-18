const { DataTypes } = require("sequelize");
const db = require("../db/conn");

const ReinstatementSheet = db.define("reinstatement_sheet", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  esbn_hole_number: {
    type: DataTypes.STRING,
    required: true,
  },
  location: {
    type: DataTypes.STRING,
    required: true,
  },
  local_authority_licence_number: {
    type: DataTypes.STRING,
    required: true,
  },
  traffic_impact_number: {
    type: DataTypes.STRING,
    required: true,
  },
  comments: {
    type: DataTypes.STRING,
    required: true,
  },
});

module.exports = ReinstatementSheet;
