const { DataTypes } = require("sequelize");
const db = require("../../db/conn");

const ReinstatementSheetHoleSequence = db.define("hole_sequence", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  coordinates: {
    type: DataTypes.STRING,
    required: true,
  },
  length: {
    type: DataTypes.SMALLINT,
    required: true,
  },
  width: {
    type: DataTypes.SMALLINT,
    required: true,
  },
  area: {
    type: DataTypes.SMALLINT,
    required: true,
  },
  surface_category: {
    type: DataTypes.STRING,
    required: true,
  },
  reinstatement: {
    type: DataTypes.STRING,
    required: true,
  },
  status: {
    type: DataTypes.STRING,
    required: true,
  },
  date_complete: {
    type: DataTypes.DATE,
    required: true,
  },
});

module.exports = ReinstatementSheetHoleSequence;
