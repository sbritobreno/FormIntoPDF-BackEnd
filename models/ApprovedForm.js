const { DataTypes } = require("sequelize");
const db = require("../db/conn");

const ApprovedForm = db.define("approved_form", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  description_location: {
    type: DataTypes.STRING,
    required: true,
  },
  date_examination: {
    type: DataTypes.DATE,
    required: true,
  },
  examination_result_state: {
    type: DataTypes.STRING,
    required: true,
  },
  inspector_signature: {
    type: DataTypes.STRING,
    required: true,
  },
});

module.exports = ApprovedForm;
