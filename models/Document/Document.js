const { DataTypes } = require("sequelize");
const db = require("../../db/conn");
const ApprovedForm = require("./ApprovedForm");
const DMSAndTMC = require("./DailyMethodStatementAndTrafficManagementChecks");
const DailyPlantInspection = require("./DailyPlantInspection");
const JobSpecificSafetyPlan = require("./JobSpecificSafetyPlan");
const Emergencies = require("./Emergencies");
const FutherHazarsAndControls = require("./FutherHazarsAndControls");
const Hazards = require("./Hazards");
const HotWorkPermit = require("./HotWorkPermit");
const MethodStatementsJobInfo = require("./MethodStatementsJobInfo");
const NearMissReport = require("./NearMissReport");
const ReinstatementSheet = require("./ReinstatementSheet");
const SiteAttendance = require("./SiteAttendance");
const TrafficManagementComplianceChecksheet = require("./TrafficManagementComplianceChecksheet");
const TrafficManagementSlgChecklist = require("./TrafficManagementSlgChecklist");

const Document = db.define("Document", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  file_attached: {
    type: DataTypes.STRING,
    required: true,
  },
  created_by: {
    type: DataTypes.STRING,
    required: true,
  },
  last_updated_by: {
    type: DataTypes.STRING,
    required: true,
  },
  permit_to_dig_sketch_image: {
    type: DataTypes.STRING,
    required: true,
  },
  sections_completed: {
    type: DataTypes.SMALLINT,
    required: true,
  },
});

Document.hasMany(ApprovedForm, {
  onDelete: "CASCADE",
  foreignKey: "DocumentId",
});
Document.hasMany(SiteAttendance, {
  onDelete: "CASCADE",
  foreignKey: "DocumentId",
});
Document.hasMany(Hazards, { onDelete: "CASCADE", foreignKey: "DocumentId" });
Document.hasMany(DailyPlantInspection, {
  onDelete: "CASCADE",
  foreignKey: "DocumentId",
});
Document.hasMany(FutherHazarsAndControls, {
  onDelete: "CASCADE",
  foreignKey: "DocumentId",
});
Document.hasOne(JobSpecificSafetyPlan, {
  onDelete: "CASCADE",
  foreignKey: "DocumentId",
});
Document.hasOne(DMSAndTMC, { onDelete: "CASCADE", foreignKey: "DocumentId" });
Document.hasOne(Emergencies, { onDelete: "CASCADE", foreignKey: "DocumentId" });
Document.hasOne(HotWorkPermit, {
  onDelete: "CASCADE",
  foreignKey: "DocumentId",
});
Document.hasOne(MethodStatementsJobInfo, {
  onDelete: "CASCADE",
  foreignKey: "DocumentId",
});
Document.hasOne(NearMissReport, {
  onDelete: "CASCADE",
  foreignKey: "DocumentId",
});
Document.hasOne(ReinstatementSheet, {
  onDelete: "CASCADE",
  foreignKey: "DocumentId",
});
Document.hasOne(TrafficManagementComplianceChecksheet, {
  onDelete: "CASCADE",
  foreignKey: "DocumentId",
});
Document.hasOne(TrafficManagementSlgChecklist, {
  onDelete: "CASCADE",
  foreignKey: "DocumentId",
});

ApprovedForm.belongsTo(Document);
SiteAttendance.belongsTo(Document);
JobSpecificSafetyPlan.belongsTo(Document);
Hazards.belongsTo(Document);
DailyPlantInspection.belongsTo(Document);
FutherHazarsAndControls.belongsTo(Document);
DMSAndTMC.belongsTo(Document);
Emergencies.belongsTo(Document);
HotWorkPermit.belongsTo(Document);
MethodStatementsJobInfo.belongsTo(Document);
NearMissReport.belongsTo(Document);
ReinstatementSheet.belongsTo(Document);
TrafficManagementComplianceChecksheet.belongsTo(Document);
TrafficManagementSlgChecklist.belongsTo(Document);

module.exports = Document;
