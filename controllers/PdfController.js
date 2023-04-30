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

    hbs.registerHelper("check", function (value) {
      if (value === true) {
        return new hbs.SafeString("✔");
      } else {
        return "";
      }
    });

    hbs.registerHelper("lessthen", function (list, n) {
      return list < n;
    });

    hbs.registerHelper("range", function (start, end) {
      var ret = [];
      for (var i = start; i < end; i++) {
        ret.push(i);
      }
      return ret;
    });

    hbs.registerHelper("checkHazard", function (name, hazards) {
      var hazard = hazards.find((hazard) => hazard.name === name);
      if (hazard && hazard.value === true) {
        return new hbs.SafeString("✔");
      } else {
        return "";
      }
    });

    hbs.registerHelper("controlHazard", function (name, hazards) {
      var hazard = hazards.find((hazard) => hazard.name === name);
      if (hazard && hazard.control) {
        return new hbs.SafeString(hazard.control);
      } else {
        return "";
      }
    });

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
      console.log(data);
      const options = { format: "A4" };

      //1. Site Attendance 1
      const templatePage1Path = path.join(
        __dirname,
        "../public/pdfTemplate/siteAttendance1.hbs"
      );
      const templatePage1 = fs.readFileSync(templatePage1Path, "utf8");
      const compiledPage1 = hbs.compile(templatePage1);
      const htmlPage1 = compiledPage1(data);

      //2. Site Attendance 2
      const templatePage2Path = path.join(
        __dirname,
        "../public/pdfTemplate/siteAttendance2.hbs"
      );
      const templatePage2 = fs.readFileSync(templatePage2Path, "utf8");
      const compiledPage2 = hbs.compile(templatePage2);
      const htmlPage2 = compiledPage2(data);

      //3. Site Attendance 3
      const templatePage3Path = path.join(
        __dirname,
        "../public/pdfTemplate/siteAttendance3.hbs"
      );
      const templatePage3 = fs.readFileSync(templatePage3Path, "utf8");
      const compiledPage3 = hbs.compile(templatePage3);
      const htmlPage3 = compiledPage3(data);

      //4. Job Safety Plan
      const templatePage4Path = path.join(
        __dirname,
        "../public/pdfTemplate/jobSafetyPlan.hbs"
      );
      const templatePage4 = fs.readFileSync(templatePage4Path, "utf8");
      const compiledPage4 = hbs.compile(templatePage4);
      const htmlPage4 = compiledPage4(data);

      //5. Method Statement 1
      const templatePage5Path = path.join(
        __dirname,
        "../public/pdfTemplate/methodStatement1.hbs"
      );
      const templatePage5 = fs.readFileSync(templatePage5Path, "utf8");
      const compiledPage5 = hbs.compile(templatePage5);
      const htmlPage5 = compiledPage5(data);

      //6. Method Statement 2
      const templatePage6Path = path.join(
        __dirname,
        "../public/pdfTemplate/methodStatement2.hbs"
      );
      const templatePage6 = fs.readFileSync(templatePage6Path, "utf8");
      const compiledPage6 = hbs.compile(templatePage6);
      const htmlPage6 = compiledPage6(data);

      //7. Further Hazards
      const templatePage7Path = path.join(
        __dirname,
        "../public/pdfTemplate/furtherHazards.hbs"
      );
      const templatePage7 = fs.readFileSync(templatePage7Path, "utf8");
      const compiledPage7 = hbs.compile(templatePage7);
      const htmlPage7 = compiledPage7(data);

      //8. Site Specific Requirements
      const templatePage8Path = path.join(
        __dirname,
        "../public/pdfTemplate/siteSpecificRequirements.hbs"
      );
      const templatePage8 = fs.readFileSync(templatePage8Path, "utf8");
      const compiledPage8 = hbs.compile(templatePage8);
      const htmlPage8 = compiledPage8(data);

      // Concatenate all HTML pages
      const html =
        htmlPage1 +
        htmlPage2 +
        htmlPage3 +
        htmlPage4 +
        htmlPage5 +
        htmlPage6 +
        htmlPage7 +
        htmlPage8;

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
