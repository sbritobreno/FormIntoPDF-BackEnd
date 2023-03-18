const { DataTypes } = require("sequelize");
const db = require("../../db/conn");

const FutherHazarsAndControls = db.define(
  "futher_hazards_and_controls_required",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      required: true,
    },
    control_required: {
      type: DataTypes.STRING,
      required: true,
    },
  }
);

module.exports = FutherHazarsAndControls;
