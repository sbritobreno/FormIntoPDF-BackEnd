const { DataTypes } = require("sequelize");
const db = require("../../db/conn");

const SiteAttendance = db.define("site_attendance", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    required: true,
  },
  signature: {
    type: DataTypes.STRING,
    required: true,
  },
  date: {
    type: DataTypes.DATE,
    required: true,
  },
  time_in: {
    type: DataTypes.TIME,
    required: true,
  },
  time_out: {
    type: DataTypes.TIME,
    required: true,
  },
});

module.exports = SiteAttendance;
