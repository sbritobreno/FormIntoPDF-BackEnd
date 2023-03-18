const { DataTypes } = require("sequelize");
const db = require("../../db/conn");

const NearMissReport = db.define("near_miss_report", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  details_comments: {
    type: DataTypes.STRING,
    required: true,
  },
  actions_taken_comments: {
    type: DataTypes.STRING,
    required: true,
  },
  suggestion_to_prevent_reoccurance_comments: {
    type: DataTypes.STRING,
    required: true,
  },
  report_signature: {
    type: DataTypes.STRING,
    required: true,
  },
});

module.exports = NearMissReport;
