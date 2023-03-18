const { DataTypes } = require("sequelize");
const db = require("../../db/conn");

const ReinstatementSheetImages = db.define("reinstatement_sheet_images", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  image: {
    type: DataTypes.STRING,
    required: true,
  },
});

module.exports = ReinstatementSheetImages;
