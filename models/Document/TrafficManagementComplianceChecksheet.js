const { DataTypes } = require("sequelize");
const db = require("../../db/conn");

const TrafficManagementComplianceChecksheet = db.define(
  "traffic_management_compliance_checksheet",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    traffic_management_compliance_checksheet_tmp_number: {
      type: DataTypes.STRING,
      required: true,
    },
    traffic_management_compliance_checksheet_question_one: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    traffic_management_compliance_checksheet_question_two: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    traffic_management_compliance_checksheet_question_three: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    traffic_management_compliance_checksheet_question_sub_one: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    traffic_management_compliance_checksheet_question_sub_two: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    traffic_management_compliance_checksheet_question_sub_three: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    traffic_management_compliance_checksheet_question_sub_four: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
  }
);

module.exports = TrafficManagementComplianceChecksheet;
