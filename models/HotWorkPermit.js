const { DataTypes } = require("sequelize");
const db = require("../db/conn");

const HotWorkPermit = db.define("hot_work_permit", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  site: {
    type: DataTypes.STRING,
    required: true,
  },
  floor_level: {
    type: DataTypes.DATE,
    required: true,
  },
  nature_of_work: {
    type: DataTypes.STRING,
    required: true,
  },
  date: {
    type: DataTypes.DATE,
    required: true,
  },
  permit_precautions_one: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
  permit_precautions_two: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
  permit_precautions_three: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
  permit_precautions_four: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
  permit_precautions_five: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
  permit_precautions_six: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
  permit_precautions_seven: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
  permit_precautions_eight: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
  permit_precautions_nine: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
  permit_precautions_ten: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
  permit_precautions_eleven: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
  permit_issued_by_company: {
    type: DataTypes.STRING,
    required: true,
  },
  permit_issued_by_person: {
    type: DataTypes.STRING,
    required: true,
  },
  permit_issued_by_person_signature: {
    type: DataTypes.STRING,
    required: true,
  },
  permit_received_by_company: {
    type: DataTypes.STRING,
    required: true,
  },
  permit_received_by_person: {
    type: DataTypes.STRING,
    required: true,
  },
  permit_received_by_person_signature: {
    type: DataTypes.STRING,
    required: true,
  },
  final_check_time: {
    type: DataTypes.TIME,
    required: true,
  },
  final_check_name: {
    type: DataTypes.STRING,
    required: true,
  },
  final_check_signature: {
    type: DataTypes.STRING,
    required: true,
  },
});

module.exports = HotWorkPermit;
