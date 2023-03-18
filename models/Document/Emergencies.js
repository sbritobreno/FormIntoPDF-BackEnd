const { DataTypes } = require("sequelize");
const db = require("../../db/conn");

const Emergencies = db.define("Emergencies", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  emergencies_question_one: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
  emergency_location_of_assembly_point: {
    type: DataTypes.STRING,
    required: true,
  },
  emergency_name_of_first_aider: {
    type: DataTypes.STRING,
    required: true,
  },
  emergency_slg_operative: {
    type: DataTypes.STRING,
    required: true,
  },
});

module.exports = Emergencies;
