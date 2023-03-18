const { DataTypes } = require("sequelize");
const db = require("../db/conn");

const TrafficManagementSlgChecklist = db.define(
  "traffic_management_slg_checklist",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    installation_checks_one: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    installation_checks_two: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    installation_checks_three: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    installation_checks_four: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    installation_checks_five: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    installation_checks_six: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    operation_checks_one: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    operation_checks_two: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    operation_checks_three: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    operation_checks_four: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    operation_checks_five: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    operation_checks_six: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    operation_checks_seven: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    traffic_checks_one: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    traffic_checks_two: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    traffic_checks_three: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    traffic_checks_four: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    vulnerable_user_checks_one: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    vulnerable_user_checks_two: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    vulnerable_user_checks_three: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    vulnerable_user_checks_four: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    vulnerable_user_checks_five: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    work_complete_checks_one: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    work_complete_checks_two: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    work_complete_checks_three: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
  }
);

module.exports = TrafficManagementSlgChecklist;
