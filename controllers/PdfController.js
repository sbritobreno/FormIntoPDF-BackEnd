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

      //3. Job Safety Plan
      const templatePage3Path = path.join(
        __dirname,
        "../public/pdfTemplate/jobSafetyPlan.hbs"
      );
      const templatePage3 = fs.readFileSync(templatePage3Path, "utf8");
      const compiledPage3 = hbs.compile(templatePage3);
      const htmlPage3 = compiledPage3(data);

      //4. Method Statement 1
      const templatePage4Path = path.join(
        __dirname,
        "../public/pdfTemplate/methodStatement1.hbs"
      );
      const templatePage4 = fs.readFileSync(templatePage4Path, "utf8");
      const compiledPage4 = hbs.compile(templatePage4);
      const htmlPage4 = compiledPage4(data);

      //5. Method Statement 2
      const templatePage5Path = path.join(
        __dirname,
        "../public/pdfTemplate/methodStatement2.hbs"
      );
      const templatePage5 = fs.readFileSync(templatePage5Path, "utf8");
      const compiledPage5 = hbs.compile(templatePage5);
      const htmlPage5 = compiledPage5(data);

      //6. Further Hazards
      const templatePage6Path = path.join(
        __dirname,
        "../public/pdfTemplate/furtherHazards.hbs"
      );
      const templatePage6 = fs.readFileSync(templatePage6Path, "utf8");
      const compiledPage6 = hbs.compile(templatePage6);
      const htmlPage6 = compiledPage6(data);

      //7. Site Specific Requirements
      const templatePage7Path = path.join(
        __dirname,
        "../public/pdfTemplate/siteSpecificRequirements.hbs"
      );
      const templatePage7 = fs.readFileSync(templatePage7Path, "utf8");
      const compiledPage7 = hbs.compile(templatePage7);
      const htmlPage7 = compiledPage7(data);

      //8. Method Statement 3
      const templatePage8Path = path.join(
        __dirname,
        "../public/pdfTemplate/methodStatement3.hbs"
      );
      const templatePage8 = fs.readFileSync(templatePage8Path, "utf8");
      const compiledPage8 = hbs.compile(templatePage8);
      const htmlPage8 = compiledPage8(data);

      //9. Method Statement 4
      const templatePage9Path = path.join(
        __dirname,
        "../public/pdfTemplate/methodStatement4.hbs"
      );
      const templatePage9 = fs.readFileSync(templatePage9Path, "utf8");
      const compiledPage9 = hbs.compile(templatePage9);
      const htmlPage9 = compiledPage9(data);

      //10. Method Statement 5
      const templatePage10Path = path.join(
        __dirname,
        "../public/pdfTemplate/methodStatement5.hbs"
      );
      const templatePage10 = fs.readFileSync(templatePage10Path, "utf8");
      const compiledPage10 = hbs.compile(templatePage10);
      const htmlPage10 = compiledPage10(data);

      //11. Method Statement 6
      const templatePage11Path = path.join(
        __dirname,
        "../public/pdfTemplate/methodStatement6.hbs"
      );
      const templatePage11 = fs.readFileSync(templatePage11Path, "utf8");
      const compiledPage11 = hbs.compile(templatePage11);
      const htmlPage11 = compiledPage11(data);

      //12. Method Statement 7
      const templatePage12Path = path.join(
        __dirname,
        "../public/pdfTemplate/methodStatement7.hbs"
      );
      const templatePage12 = fs.readFileSync(templatePage12Path, "utf8");
      const compiledPage12 = hbs.compile(templatePage12);
      const htmlPage12 = compiledPage12(data);

      //13. Method Statement 8
      const templatePage13Path = path.join(
        __dirname,
        "../public/pdfTemplate/methodStatement8.hbs"
      );
      const templatePage13 = fs.readFileSync(templatePage13Path, "utf8");
      const compiledPage13 = hbs.compile(templatePage13);
      const htmlPage13 = compiledPage13(data);

      //14. Method Statement 9
      const templatePage14Path = path.join(
        __dirname,
        "../public/pdfTemplate/methodStatement9.hbs"
      );
      const templatePage14 = fs.readFileSync(templatePage14Path, "utf8");
      const compiledPage14 = hbs.compile(templatePage14);
      const htmlPage14 = compiledPage14(data);

      //15. Method Statement 10
      const templatePage15Path = path.join(
        __dirname,
        "../public/pdfTemplate/methodStatement10.hbs"
      );
      const templatePage15 = fs.readFileSync(templatePage15Path, "utf8");
      const compiledPage15 = hbs.compile(templatePage15);
      const htmlPage15 = compiledPage15(data);

      //16. Method Statement 11
      const templatePage16Path = path.join(
        __dirname,
        "../public/pdfTemplate/methodStatement11.hbs"
      );
      const templatePage16 = fs.readFileSync(templatePage16Path, "utf8");
      const compiledPage16 = hbs.compile(templatePage16);
      const htmlPage16 = compiledPage16(data);

      //17. Method Statement 12
      const templatePage17Path = path.join(
        __dirname,
        "../public/pdfTemplate/methodStatement12.hbs"
      );
      const templatePage17 = fs.readFileSync(templatePage17Path, "utf8");
      const compiledPage17 = hbs.compile(templatePage17);
      const htmlPage17 = compiledPage17(data);

      //18. Method Statement 13
      const templatePage18Path = path.join(
        __dirname,
        "../public/pdfTemplate/methodStatement13.hbs"
      );
      const templatePage18 = fs.readFileSync(templatePage18Path, "utf8");
      const compiledPage18 = hbs.compile(templatePage18);
      const htmlPage18 = compiledPage18(data);

      //19. Method Statement 13
      const templatePage19Path = path.join(
        __dirname,
        "../public/pdfTemplate/permitToDigChecklist.hbs"
      );
      const templatePage19 = fs.readFileSync(templatePage19Path, "utf8");
      const compiledPage19 = hbs.compile(templatePage19);
      const htmlPage19 = compiledPage19(data);

      // Concatenate all HTML pages
      const html =
        htmlPage1 +
        htmlPage2 +
        htmlPage3 +
        htmlPage4 +
        htmlPage5 +
        htmlPage6 +
        htmlPage7 +
        htmlPage8 +
        htmlPage9 +
        htmlPage10 +
        htmlPage11 +
        htmlPage12 +
        htmlPage13 +
        htmlPage14 +
        htmlPage15 +
        htmlPage16 +
        htmlPage17 +
        htmlPage18 +
        htmlPage19;

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
