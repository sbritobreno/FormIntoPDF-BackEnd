const { DataTypes } = require("sequelize");
const db = require("../db/conn");

const MethodStatementsJobInfo = db.define("method_statements_job_information", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ms_id: {
    type: DataTypes.STRING,
    required: true,
  },
  ms_revision: {
    type: DataTypes.STRING,
    required: true,
  },
  ms_project: {
    type: DataTypes.STRING,
    required: true,
  },
  ms_site: {
    type: DataTypes.STRING,
    required: true,
  },
  ms_client: {
    type: DataTypes.STRING,
    required: true,
  },
  loc_photograph_image: {
    type: DataTypes.STRING,
    required: true,
  },
});

module.exports = MethodStatementsJobInfo;
