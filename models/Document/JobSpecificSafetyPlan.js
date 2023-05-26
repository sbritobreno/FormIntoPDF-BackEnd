const { DataTypes } = require("sequelize");
const db = require("../../db/conn");

const JobSpecificSafetyPlan = db.define("job_specific_safety_plan", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  crew_leader: {
    type: DataTypes.STRING,
    required: true,
  },
  date: {
    type: DataTypes.DATE,
    required: true,
  },
  project_number: {
    type: DataTypes.STRING,
    required: true,
  },
  services_eletricity: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
  services_traffic_lights: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
  services_public_light: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
  services_gas: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
  services_telecom: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
  services_water: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
  services_no_services_found: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
});

module.exports = JobSpecificSafetyPlan;
