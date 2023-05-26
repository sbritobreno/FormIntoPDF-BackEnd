const fs = require("fs");
const path = require("path");
const hbs = require("hbs");
const pdf = require("html-pdf-node");
const PDFMerger = require("pdf-merger-js");

const Document = require("../models/Document/Document");
const SiteAttendance = require("../models/Document/SiteAttendance");
const JobSpecificSafetyPlan = require("../models/Document/JobSpecificSafetyPlan");
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

    hbs.registerHelper("inc", function (value) {
      return parseInt(value) + 1;
    });

    hbs.registerHelper("formatDate", function (dateStr) {
      const date = new Date(dateStr);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear().toString();
      return `${day}/${month}/${year}`;
    });

    hbs.registerHelper("check", function (value) {
      if (value === true) {
        return new hbs.SafeString("✔");
      } else {
        return "";
      }
    });

    hbs.registerHelper("checkHWP", function (value) {
      if (value === true) {
        return new hbs.SafeString("&#10004;"); // Checkmark symbol: ✔
      } else {
        return new hbs.SafeString("&#x2717;"); // Cross mark symbol: ✗
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

    hbs.registerHelper("checkDPI", function (list, toolName, day) {
      var tool = list.find((tool) => tool.tool_name === toolName);
      if (tool && tool[day]) {
        return new hbs.SafeString("✔");
      } else {
        return "";
      }
    });

    const document = await Document.findOne({
      where: { id: id },
      include: [
        { model: SiteAttendance },
        { model: JobSpecificSafetyPlan },
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

    function getPath(fileName) {
      return path.join(__dirname, `../public/pdfTemplate/${fileName}`);
    }

    function generatePdfPage(templatePath, data) {
      const template = fs.readFileSync(templatePath, "utf8");
      const compiled = hbs.compile(template);
      const html = compiled(data);
      return html;
    }

    try {
      const data = document.toJSON();
      console.log(data);
      const options = { format: "A4" };

      //1. Site Attendance 1
      const templatePage1Path = getPath("siteAttendance1.hbs");
      const htmlPage1 = generatePdfPage(templatePage1Path, data);

      //2. Site Attendance 2
      const templatePage2Path = getPath("siteAttendance2.hbs");
      const htmlPage2 = generatePdfPage(templatePage2Path, data);

      //3. Job Safety Plan
      const templatePage3Path = getPath("jobSafetyPlan.hbs");
      const htmlPage3 = generatePdfPage(templatePage3Path, data);

      //4. Method Statement 1
      const templatePage4Path = getPath("methodStatement1.hbs");
      const htmlPage4 = generatePdfPage(templatePage4Path, data);

      //5. Method Statement 2
      const templatePage5Path = getPath("methodStatement2.hbs");
      const htmlPage5 = generatePdfPage(templatePage5Path, data);

      //6. Further Hazards
      const templatePage6Path = getPath("furtherHazards.hbs");
      const htmlPage6 = generatePdfPage(templatePage6Path, data);

      //7. Site Specific Requirements
      const templatePage7Path = getPath("siteSpecificRequirements.hbs");
      const htmlPage7 = generatePdfPage(templatePage7Path, data);

      //8. Method Statement 3
      const templatePage8Path = getPath("methodStatement3.hbs");
      const htmlPage8 = generatePdfPage(templatePage8Path, data);

      //9. Method Statement 4
      const templatePage9Path = getPath("methodStatement4.hbs");
      const htmlPage9 = generatePdfPage(templatePage9Path, data);

      //10. Method Statement 5
      const templatePage10Path = getPath("methodStatement5.hbs");
      const htmlPage10 = generatePdfPage(templatePage10Path, data);

      //11. Method Statement 6
      const templatePage11Path = getPath("methodStatement6.hbs");
      const htmlPage11 = generatePdfPage(templatePage11Path, data);

      //12. Method Statement 7
      const templatePage12Path = getPath("methodStatement7.hbs");
      const htmlPage12 = generatePdfPage(templatePage12Path, data);

      //13. Method Statement 8
      const templatePage13Path = getPath("methodStatement8.hbs");
      const htmlPage13 = generatePdfPage(templatePage13Path, data);

      //14. Method Statement 9
      const templatePage14Path = getPath("methodStatement9.hbs");
      const htmlPage14 = generatePdfPage(templatePage14Path, data);

      //15. Method Statement 10
      const templatePage15Path = getPath("methodStatement10.hbs");
      const htmlPage15 = generatePdfPage(templatePage15Path, data);

      //16. Method Statement 11
      const templatePage16Path = getPath("methodStatement11.hbs");
      const htmlPage16 = generatePdfPage(templatePage16Path, data);

      //17. Method Statement 12
      const templatePage17Path = getPath("methodStatement12.hbs");
      const htmlPage17 = generatePdfPage(templatePage17Path, data);

      //18. Method Statement 13
      const templatePage18Path = getPath("methodStatement13.hbs");
      const htmlPage18 = generatePdfPage(templatePage18Path, data);

      //19. Method Statement 13
      const templatePage19Path = getPath("permitToDigChecklist.hbs");
      const htmlPage19 = generatePdfPage(templatePage19Path, data);

      //20. Daily Plant Inspection 1
      const templatePage20Path = getPath("dailyPlantInspection1.hbs");
      const htmlPage20 = generatePdfPage(templatePage20Path, data);

      //21. Daily Plant Inspection 2
      const templatePage21Path = getPath("dailyPlantInspection2.hbs");
      const htmlPage21 = generatePdfPage(templatePage21Path, data);

      //22. Near Miss Report
      const templatePage22Path = getPath("nearMissReport.hbs");
      const htmlPage22 = generatePdfPage(templatePage22Path, data);

      //23. Approved Form 1
      const templatePage23Path = getPath("approvedForm1.hbs");
      const htmlPage23 = generatePdfPage(templatePage23Path, data);

      //24. Approved Form 2
      const templatePage24Path = getPath("approvedForm2.hbs");
      const htmlPage24 = generatePdfPage(templatePage24Path, data);

      //25. Hot Work Permit
      const templatePage25Path = getPath("hotWorkPermit.hbs");
      const htmlPage25 = generatePdfPage(templatePage25Path, data);

      //26. Traffic Management SLG Checklist 1
      const templatePage26Path = getPath("trafficManagementSLGChecklist1.hbs");
      const htmlPage26 = generatePdfPage(templatePage26Path, data);

      //27.  Traffic Management SLG Checklist 2
      const templatePage27Path = getPath("trafficManagementSLGChecklist2.hbs");
      const htmlPage27 = generatePdfPage(templatePage27Path, data);

      //28. Reinstatement Sheet 1
      const templatePage28Path = getPath("reinstatementSheet1.hbs");
      const htmlPage28 = generatePdfPage(templatePage28Path, data);

      //29. Reinstatement Sheet 2
      const templatePage29Path = getPath("reinstatementSheet2.hbs");
      const htmlPage29 = generatePdfPage(templatePage29Path, data);

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
        htmlPage19 +
        htmlPage20 +
        htmlPage21 +
        htmlPage22 +
        htmlPage23 +
        htmlPage24 +
        htmlPage25 +
        htmlPage26 +
        htmlPage27 +
        htmlPage28 +
        htmlPage29;

      function getFilePath(fileName) {
        return path.join(__dirname, `../public/files/${fileName}`);
      }

      // generate PDF from HTML content
      pdf
        .generatePdf({ content: html }, options)
        .then(async (pdfBuffer1) => {
          const pdfPath = path.join(
            __dirname,
            `../public/files/${data.file_attached}`
          );

          // Check if the file exists
          if (fs.existsSync(pdfPath)) {
            // Load existing PDF from public folder
            const pdfBuffer2 = fs.readFileSync(pdfPath);

            // Merge PDFs
            const merger = new PDFMerger();
            await merger.add(pdfBuffer1);
            await merger.add(pdfBuffer2);
            const mergedPdf = await merger.saveAsBuffer();

            // Send merged PDF to frontend
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
              "Content-Disposition",
              "attachment; filename=document.pdf"
            );
            res.send(mergedPdf);
          } else {
            // Send PDF generated from HTML to frontend
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
              "Content-Disposition",
              "attachment; filename=document.pdf"
            );
            res.send(pdfBuffer1);
          }
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

    hbs.registerHelper("inc", function (value) {
      return parseInt(value) + 1;
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

      // Page 1
      const templatePath1 = path.join(
        __dirname,
        `../public/pdfTemplate/reinstatementSheet1.hbs`
      );
      const templatePage1 = fs.readFileSync(templatePath1, "utf8");
      const compiledPage1 = hbs.compile(templatePage1);
      const htmlPage1 = compiledPage1(data);

      // Page 2
      const templatePath2 = path.join(
        __dirname,
        `../public/pdfTemplate/reinstatementSheet2.hbs`
      );
      const templatePage2 = fs.readFileSync(templatePath2, "utf8");
      const compiledPage2 = hbs.compile(templatePage2);
      const htmlPage2 = compiledPage2(data);

      // Concatenate all HTML pages
      const html = htmlPage1 + htmlPage2;

      pdf
        .generatePdf({ content: html }, options)
        .then((pdfBuffer) => {
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=reinstatementSheet.pdf"
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
};
