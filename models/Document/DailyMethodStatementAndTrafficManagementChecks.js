const { DataTypes } = require("sequelize");
const db = require("../../db/conn");

const DailyMethodStatementAndTrafficManagementChecks = db.define(
  "daily_method_statement_and_traffic_management_checks",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    method_statement_for_the_day: {
      type: DataTypes.STRING,
      required: true,
    },
    daily_method_statement_question_one: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    daily_method_statement_question_two: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
    daily_method_statement_question_three: {
      type: DataTypes.BOOLEAN,
      required: true,
    },
  }
);

module.exports = DailyMethodStatementAndTrafficManagementChecks;
