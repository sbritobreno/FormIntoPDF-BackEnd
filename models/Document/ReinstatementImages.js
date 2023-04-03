const { DataTypes } = require("sequelize");
const db = require("../../db/conn");

const ReinstatementImages = db.define("reinstatement_images", {
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

module.exports = ReinstatementImages;
