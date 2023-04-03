const { DataTypes } = require("sequelize");
const db = require("../../db/conn");
const ReinstatementSheetHoleSequence = require("./ReinstatementSheetHoleSequence");
const ReinstatementSheetImages = require("./ReinstatementSheetImages");

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

ReinstatementSheet.hasMany(ReinstatementSheetHoleSequence, {
  onDelete: "CASCADE",
});
ReinstatementSheet.hasMany(ReinstatementSheetImages, {
  onDelete: "CASCADE",
});

ReinstatementSheetHoleSequence.belongsTo(ReinstatementSheet);
ReinstatementSheetImages.belongsTo(ReinstatementSheet);

module.exports = ReinstatementSheet;
