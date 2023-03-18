const { DataTypes } = require("sequelize");
const db = require("../db/conn");

const Document = db.define("Document", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  file_attached: {
    type: DataTypes.STRING,
    required: true,
  },
  last_updated_by: {
    type: DataTypes.STRING,
    required: true,
  },
  permit_to_dig_sketch_image: {
    type: DataTypes.STRING,
    required: true,
  },
});

module.exports = Document;