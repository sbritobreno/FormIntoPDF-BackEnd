const fs = require("fs");
const path = require("path");
const hbs = require("hbs");
const pdf = require("html-pdf-node");
const PDFMerger = require("pdf-merger-js");

const Document = require("../models/Document/Document");
const SiteAttendance = require("../models/Document/SiteAttendance");
const Hazards = require("../models/Document/Hazards");
const DMSandTMC = require("../models/Document/DailyMethodStatementAndTrafficManagementChecks");
const Emergencies = require("../models/Document/Emergencies");
const TrafficManagementComplianceChecksheet = require("../models/Document/TrafficManagementComplianceChecksheet");
const TrafficManagementSlgChecklist = require("../models/Document/TrafficManagementSlgChecklist");
const ApprovedForm = require("../models/Document/ApprovedForm");
const HotWorkPermit = require("../models/Document/HotWorkPermit");
const DailyPlantInspection = require("../models/Document/DailyPlantInspection");
const NearMissReport = require("../models/Document/NearMissReport");
const FutherHazarsAndControls = require("../models/Document/FutherHazarsAndControls");
const MethodStatementsJobInfo = require("../models/Document/MethodStatementsJobInfo");
const ReinstatementSheet = require("../models/Document/ReinstatementSheet");
const ReinstatementSheetHoleSequence = require("../models/Document/ReinstatementSheetHoleSequence");
const ReinstatementImages = require("../models/Document/ReinstatementImages");

module.exports = class PdfController {
  static async downloadPDF(req, res) {
    const id = req.params.id;

    const document = await Document.findOne({
      where: { id: id },
      include: [
        { model: SiteAttendance },
        { model: Hazards },
        { model: DMSandTMC },
        { model: Emergencies },
        { model: TrafficManagementComplianceChecksheet },
        { model: TrafficManagementSlgChecklist },
        { model: ApprovedForm },
        { model: HotWorkPermit },
        { model: DailyPlantInspection },
        { model: NearMissReport },
        { model: FutherHazarsAndControls },
        { model: MethodStatementsJobInfo },
        {
          model: ReinstatementSheet,
          include: [
            {
              model: ReinstatementSheetHoleSequence,
              include: [{ model: ReinstatementImages }],
            },
          ],
        },
      ],
    });

    if (!document) {
      res.status(404).json({
        message: "Document not found!",
      });
      return;
    }

    try {
      const data = document.toJSON();
      const options = { format: "A4" };

      // Site Attendance 1
      const templatePage1Path = path.join(
        __dirname,
        "../public/pdfTemplate/siteAttendance1.hbs"
      );
      const templatePage1 = fs.readFileSync(templatePage1Path, "utf8");
      const compiledPage1 = hbs.compile(templatePage1);
      const htmlPage1 = compiledPage1(data);

      // Site Attendance 2
      const templatePage2Path = path.join(
        __dirname,
        "../public/pdfTemplate/siteAttendance2.hbs"
      );
      const templatePage2 = fs.readFileSync(templatePage2Path, "utf8");
      const compiledPage2 = hbs.compile(templatePage2);
      const htmlPage2 = compiledPage2(data);

      // Site Attendance 3
      const templatePage3Path = path.join(
        __dirname,
        "../public/pdfTemplate/siteAttendance3.hbs"
      );
      const templatePage3 = fs.readFileSync(templatePage3Path, "utf8");
      const compiledPage3 = hbs.compile(templatePage3);
      const htmlPage3 = compiledPage3(data);

      // Concatenate all HTML pages
      const html = htmlPage1 + htmlPage2 + htmlPage3;

      pdf
        .generatePdf({ content: html }, options)
        .then((pdfBuffer) => {
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=document.pdf"
          );
          res.send(pdfBuffer);
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send("Error generating PDF");
        });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  // Download ReinstatementSheet
  static async downloadReinstatementSheet(req, res) {
    const id = req.params.id;
    const reinstatementSheet = await ReinstatementSheet.findOne({
      where: { DocumentId: id },
    });

    if (!reinstatementSheet) {
      res.status(404).json({
        message:
          "Reinstatement sheet not found. It might not have been initialized yet!",
      });
      return;
    }

    try {
      res
        .status(200)
        .json({ message: "Reinstatement Sheet downloaded successfully!" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
};
