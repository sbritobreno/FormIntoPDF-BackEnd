const { DataTypes } = require("sequelize");
const db = require("../../db/conn");
const ApprovedForm = require("./ApprovedForm");
const DMSAndTMC = require("./DailyMethodStatementAndTrafficManagementChecks");
const DailyPlantInspection = require("./DailyPlantInspection");
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
  last_updated_by: {
    type: DataTypes.STRING,
    required: true,
  },
  permit_to_dig_sketch_image: {
    type: DataTypes.STRING,
    required: true,
  },
});

Document.hasMany(ApprovedForm, { foreignKey: "DocumentId" });
Document.hasMany(SiteAttendance, { foreignKey: "DocumentId" });
Document.hasMany(Hazards, { foreignKey: "DocumentId" });
Document.hasMany(DailyPlantInspection, { foreignKey: "DocumentId" });
Document.hasMany(FutherHazarsAndControls, { foreignKey: "DocumentId" });
Document.hasOne(DMSAndTMC, { foreignKey: "DocumentId" });
Document.hasOne(Emergencies, { foreignKey: "DocumentId" });
Document.hasOne(HotWorkPermit, { foreignKey: "DocumentId" });
Document.hasOne(MethodStatementsJobInfo, { foreignKey: "DocumentId" });
Document.hasOne(NearMissReport, { foreignKey: "DocumentId" });
Document.hasOne(ReinstatementSheet, { foreignKey: "DocumentId" });
Document.hasOne(TrafficManagementComplianceChecksheet, { foreignKey: "DocumentId" });
Document.hasOne(TrafficManagementSlgChecklist, { foreignKey: "DocumentId" });

ApprovedForm.belongsTo(Document);
SiteAttendance.belongsTo(Document);
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
