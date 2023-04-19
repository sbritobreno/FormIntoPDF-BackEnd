const fs = require("fs");

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

// helpers
const getUserByToken = require("../helpers/get-user-by-token");
const getToken = require("../helpers/get-token");
const { all } = require("../routes/DocumentRoutes");

module.exports = class UserController {
  // Get all documents
  static async getAllDocuments(req, res) {
    const documents = await Document.findAll({
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
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      documents: documents,
    });
  }

  // Get single document by its ID
  static async getDocumentById(req, res) {
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
      res.status(404).json({ message: "Document not found!" });
      return;
    }

    res.status(200).json({
      document: document,
    });
  }

  // Remove document by its ID
  static async removeDocumentById(req, res) {
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
      res.status(404).json({ message: "Document not found!" });
      return;
    }

    await Document.destroy({ where: { id: id } });

    res.status(200).json({
      message: "Document removed successfully!",
      document: document,
    });
  }

  // Init new document
  static async newDocument(req, res) {
    // get user
    const token = getToken(req);
    const user = await getUserByToken(token);

    try {
      // New Document
      const document = await Document.create({
        created_by: user.name,
        last_updated_by: user.name,
        sections_completed: 0,
      });

      res.status(200).json({
        message: "New document created successfully!",
        document: document,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  // Add to Site Attendance  Section1 on document
  static async addAttendance(req, res) {
    const id = req.params.id;
    const data = req.body;

    // get user
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (
      !data.name ||
      !data.date ||
      !data.time_in ||
      !data.time_out ||
      !data.staff_signature
    ) {
      res.status(403).json({ message: "You need to enter all the inputs!" });
      return;
    }

    const base64String = data.staff_signature;
    const base64Image = base64String.replace(/^data:image\/\w+;base64,/, "");
    const binaryData = Buffer.from(base64Image, "base64");
    const path = `public/images/documents`;
    const fileName = `${Date.now()}.png`;

    fs.writeFileSync(`${path}/${fileName}`, binaryData, (err) => {
      if (err) throw err;
    });

    try {
      const newAttendance = {
        name: data.name,
        date: data.date,
        time_in: data.time_in,
        time_out: data.time_out,
        signature: fileName,
        DocumentId: id,
      };
      await SiteAttendance.create(newAttendance);

      const document = await Document.findOne({ where: { id: id } });
      if (document.sections_completed < 1) {
        document.sections_completed = 1; // SiteAttendance is now the first section to be completed
        document.last_updated_by = user.name;
        await document.save();
      }

      res.status(200).json({ message: `${data.name} added to the list!` });
    } catch (err) {
      res.status(500).json({ message: "Something went wrong!" });
    }
  }

  // Remove from Site Attendance Section1 on document
  static async removeAttendance(req, res) {
    const id = req.params.id;

    try {
      const attendance = await SiteAttendance.findOne({ where: { id: id } });
      await SiteAttendance.destroy({ where: { id: id } });
      res
        .status(200)
        .json({ message: `${attendance.name} removed from the list!` });
    } catch (err) {
      res.status(500).json({ message: "Something went wrong!" });
    }
  }

  // Update Site Setup Section2 on document
  static async updateSiteSetup(req, res, next) {
    const id = req.params.id;
    const data = req.body;

    const hazards = JSON.parse(data.Hazards);
    const dailyMethodStatement = JSON.parse(
      data.daily_method_statement_and_traffic_management_check
    );
    const emergency = JSON.parse(data.Emergency);
    const tmcc = JSON.parse(data.traffic_management_compliance_checksheet);
    const tmsc = JSON.parse(data.traffic_management_slg_checklist);

    // get user
    const token = getToken(req);
    const user = await getUserByToken(token);

    // check if document exists
    const document = await Document.findOne({ where: { id: id } });
    if (!document) {
      res.status(404).json({ message: "Document not found!" });
      return;
    }

    try {
      // Update Hazards
      hazards.forEach(async (element) => {
        const hz = await Hazards.findOne({
          where: { name: element.name, DocumentId: id },
        });
        if (hz) {
          hz.control = element.control;
          hz.value = element.value;
          await hz.save();
        } else {
          await Hazards.create({
            name: element.name,
            control: element.control,
            value: element.value,
            DocumentId: id,
          });
        }
      });

      // Update DailyMethodStatementAndTrafficManagementChecks
      let dmsAndTmc = await DMSandTMC.findOne({
        where: { DocumentId: id },
      });
      if (!dmsAndTmc) dmsAndTmc = await DMSandTMC.create({ DocumentId: id });

      dmsAndTmc.method_statement_for_the_day =
        dailyMethodStatement?.method_statement_for_the_day;
      dmsAndTmc.daily_method_statement_question_one =
        dailyMethodStatement?.daily_method_statement_question_one;
      dmsAndTmc.daily_method_statement_question_two =
        dailyMethodStatement?.daily_method_statement_question_two;
      dmsAndTmc.daily_method_statement_question_three =
        dailyMethodStatement?.daily_method_statement_question_three;
      await dmsAndTmc.save();

      // Update Emergencies
      let emergencies = await Emergencies.findOne({
        where: { DocumentId: id },
      });
      if (!emergencies)
        emergencies = await Emergencies.create({ DocumentId: id });

      emergencies.emergencies_question_one =
        emergency?.emergencies_question_one;
      emergencies.emergency_location_of_assembly_point =
        emergency?.emergency_location_of_assembly_point;
      emergencies.emergency_name_of_first_aider =
        emergency?.emergency_name_of_first_aider;
      emergencies.emergency_slg_operative = emergency?.emergency_slg_operative;
      await emergencies.save();

      // Update Traffic Management Compliance Checksheet
      let tmccData = await TrafficManagementComplianceChecksheet.findOne({
        where: { DocumentId: id },
      });
      if (!tmccData)
        tmccData = await TrafficManagementComplianceChecksheet.create({
          DocumentId: id,
        });

      tmccData.traffic_management_compliance_checksheet_tmp_number =
        tmcc?.traffic_management_compliance_checksheet_tmp_number;
      tmccData.traffic_management_compliance_checksheet_question_one =
        tmcc?.traffic_management_compliance_checksheet_question_one;
      tmccData.traffic_management_compliance_checksheet_question_two =
        tmcc?.traffic_management_compliance_checksheet_question_two;
      tmccData.traffic_management_compliance_checksheet_question_three =
        tmcc?.traffic_management_compliance_checksheet_question_three;
      tmccData.traffic_management_compliance_checksheet_question_sub_one =
        tmcc?.traffic_management_compliance_checksheet_question_sub_one;
      tmccData.traffic_management_compliance_checksheet_question_sub_two =
        tmcc?.traffic_management_compliance_checksheet_question_sub_two;
      tmccData.traffic_management_compliance_checksheet_question_sub_three =
        tmcc?.traffic_management_compliance_checksheet_question_sub_three;
      tmccData.traffic_management_compliance_checksheet_question_sub_four =
        tmcc?.traffic_management_compliance_checksheet_question_sub_four;
      await tmccData.save();

      // Update Traffic Management Slg Checklist
      let tmscData = await TrafficManagementSlgChecklist.findOne({
        where: { DocumentId: id },
      });
      if (!tmscData)
        tmscData = await TrafficManagementSlgChecklist.create({
          DocumentId: id,
        });

      tmscData.installation_checks_one = tmsc?.installation_checks_one;
      tmscData.installation_checks_two = tmsc?.installation_checks_two;
      tmscData.installation_checks_three = tmsc?.installation_checks_three;
      tmscData.installation_checks_four = tmsc?.installation_checks_four;
      tmscData.installation_checks_five = tmsc?.installation_checks_five;
      tmscData.installation_checks_six = tmsc?.installation_checks_six;
      tmscData.operation_checks_one = tmsc?.operation_checks_one;
      tmscData.operation_checks_two = tmsc?.operation_checks_two;
      tmscData.operation_checks_three = tmsc?.operation_checks_three;
      tmscData.operation_checks_four = tmsc?.operation_checks_four;
      tmscData.operation_checks_five = tmsc?.operation_checks_five;
      tmscData.operation_checks_six = tmsc?.operation_checks_six;
      tmscData.operation_checks_seven = tmsc?.operation_checks_seven;
      tmscData.traffic_checks_one = tmsc?.traffic_checks_one;
      tmscData.traffic_checks_two = tmsc?.traffic_checks_two;
      tmscData.traffic_checks_three = tmsc?.traffic_checks_three;
      tmscData.traffic_checks_four = tmsc?.traffic_checks_four;
      tmscData.vulnerable_user_checks_one = tmsc?.vulnerable_user_checks_one;
      tmscData.vulnerable_user_checks_two = tmsc?.vulnerable_user_checks_two;
      tmscData.vulnerable_user_checks_three =
        tmsc?.vulnerable_user_checks_three;
      tmscData.vulnerable_user_checks_four = tmsc?.vulnerable_user_checks_four;
      tmscData.vulnerable_user_checks_five = tmsc?.vulnerable_user_checks_five;
      tmscData.work_complete_checks_one = tmsc?.work_complete_checks_one;
      tmscData.work_complete_checks_two = tmsc?.work_complete_checks_two;
      tmscData.work_complete_checks_three = tmsc?.work_complete_checks_three;
      await tmscData.save();

      if (document.sections_completed < 2) document.sections_completed = 2; //SiteSetup section saved
      document.last_updated_by = user.name;
      await document.save();

      res.status(200).json({ message: "Site Setup saved successfully!" });
    } catch (err) {
      res.status(500).json({ message: "Something went wrong!" });
    }
  }

  // Add sketch image to sitesetup
  static async updateSiteSetupAddImage(req, res) {
    const id = req.params.id;
    const document = await Document.findOne({ where: { id: id } });

    if (req.file) {
      document.permit_to_dig_sketch_image = req.file.filename;
    }
    await document.save();
    res.status(200).json({ message: "Image uploaded!" });
  }

  // Update Approved Form Section3 on document
  static async updateApprovedForm(req, res) {
    const id = req.params.id;
    const data = req.body;
    const list = JSON.parse(data.approvedFormList);

    // get user
    const token = getToken(req);
    const user = await getUserByToken(token);

    // check if document exists
    const document = await Document.findOne({ where: { id: id } });
    if (!document) {
      res.status(404).json({ message: "Document not found!" });
      return;
    }

    function getImage(imageString) {
      const base64String = imageString;
      const base64Image = base64String.replace(/^data:image\/\w+;base64,/, "");
      const binaryData = Buffer.from(base64Image, "base64");
      const path = `public/images/documents`;
      const fileName = `${Date.now()}.png`;

      fs.writeFileSync(`${path}/${fileName}`, binaryData, (err) => {
        if (err) throw err;
      });

      return fileName;
    }

    try {
      list.forEach(async (element) => {
        const approvedForm = await ApprovedForm.findOne({
          where: {
            id: element.id !== undefined ? element.id : 0,
            DocumentId: id,
          },
        });

        if (approvedForm) {
          approvedForm.description_location = element.description_location;
          approvedForm.date_examination = element.date_examination;
          approvedForm.examination_result_state =
            element.examination_result_state;
          approvedForm.inspector_signature !== element.inspector_signature
            ? getImage(element.inspector_signature)
            : approvedForm.inspector_signature;
          await approvedForm.save();
        } else {
          await ApprovedForm.create({
            description_location: element.description_location,
            date_examination: element.date_examination,
            examination_result_state: element.examination_result_state,
            inspector_signature: getImage(element.inspector_signature),
            DocumentId: id,
          });
        }
      });

      // Delete in the database any item that is not on list
      const allApprovedForm = await ApprovedForm.findAll({
        where: { DocumentId: id },
      });
      allApprovedForm.forEach(async (element) => {
        const isElementStillOnList = list.filter((el) => el.id === element.id);
        if (isElementStillOnList.length === 0)
          await ApprovedForm.destroy({ where: { id: element.id } });
      });

      if (document.sections_completed < 3) document.sections_completed = 3; //ApprovedForm section saved
      document.last_updated_by = user.name;
      await document.save();

      res.status(200).json({ message: "Approved Form saved successfully!" });
    } catch (err) {
      res.status(500).json({ message: "Something went wrong!" });
    }
  }

  // Update Forms Section4 on document
  static async updateForms(req, res) {
    const id = req.params.id;
    const data = req.body;
    const hotWorkPermit = JSON.parse(data.hot_work_permit);
    const dailyPlantInspections = JSON.parse(data.daily_plant_inspections);
    const nearMissReport = JSON.parse(data.near_miss_report);
    const futherHazards = JSON.parse(
      data.futher_hazards_and_controls_requireds
    );

    // get user
    const token = getToken(req);
    const user = await getUserByToken(token);

    // check if document exists
    const document = await Document.findOne({ where: { id: id } });
    if (!document) {
      res.status(404).json({ message: "Document not found!" });
      return;
    }

    function getImage(imageString) {
      const base64String = imageString;
      const base64Image = base64String.replace(/^data:image\/\w+;base64,/, "");
      const binaryData = Buffer.from(base64Image, "base64");
      const path = `public/images/documents`;
      const fileName = `${Date.now()}.png`;

      fs.writeFileSync(`${path}/${fileName}`, binaryData, (err) => {
        if (err) throw err;
      });

      return fileName;
    }

    try {
      // Update HotWorkPermit
      let hwp = await HotWorkPermit.findOne({
        where: { DocumentId: id },
      });
      if (!hwp) hwp = await HotWorkPermit.create({ DocumentId: id });

      hwp.site = hotWorkPermit?.site;
      hwp.floor_level = hotWorkPermit?.floor_level;
      hwp.nature_of_work = hotWorkPermit?.nature_of_work;
      hwp.date = hotWorkPermit?.date;
      hwp.permit_precautions_one = hotWorkPermit?.permit_precautions_one;
      hwp.permit_precautions_two = hotWorkPermit?.permit_precautions_two;
      hwp.permit_precautions_three = hotWorkPermit?.permit_precautions_three;
      hwp.permit_precautions_four = hotWorkPermit?.permit_precautions_four;
      hwp.permit_precautions_five = hotWorkPermit?.permit_precautions_five;
      hwp.permit_precautions_six = hotWorkPermit?.permit_precautions_six;
      hwp.permit_precautions_seven = hotWorkPermit?.permit_precautions_seven;
      hwp.permit_precautions_eight = hotWorkPermit?.permit_precautions_eight;
      hwp.permit_precautions_nine = hotWorkPermit?.permit_precautions_nine;
      hwp.permit_precautions_ten = hotWorkPermit?.permit_precautions_ten;
      hwp.permit_issued_by_company = hotWorkPermit?.permit_issued_by_company;
      hwp.permit_issued_by_person = hotWorkPermit?.permit_issued_by_person;
      hwp.permit_issued_by_person_signature =
        hotWorkPermit?.permit_issued_by_person_signature.length > 100
          ? getImage(hotWorkPermit?.permit_issued_by_person_signature)
          : hwp.permit_issued_by_person_signature;
      hwp.permit_received_by_company = hotWorkPermit.permit_received_by_company;
      hwp.permit_received_by_person = hotWorkPermit.permit_received_by_person;
      hwp.permit_received_by_person_signature =
        hotWorkPermit?.permit_received_by_person_signature.length > 100
          ? getImage(hotWorkPermit?.permit_received_by_person_signature)
          : hwp.permit_received_by_person_signature;
      hwp.final_check_time = hotWorkPermit.final_check_time;
      hwp.final_check_name = hotWorkPermit.final_check_name;
      hwp.final_check_signature =
        hotWorkPermit?.final_check_signature.length > 100
          ? getImage(hotWorkPermit?.final_check_signature)
          : hwp.final_check_signature;
      await hwp.save();

      // Update Daily Plant Inspection
      dailyPlantInspections.forEach(async (element) => {
        const objName = Object.keys(element)[0]; // Get the name of the current object
        const dpi = await DailyPlantInspection.findOne({
          where: { tool_name: objName, DocumentId: id },
        });

        if (dpi) {
          dpi.monday = element[objName].monday;
          dpi.tuesday = element[objName].tuesday;
          dpi.wednesday = element[objName].wednesday;
          dpi.thrusday = element[objName].thrusday;
          dpi.friday = element[objName].friday;
          dpi.saturday = element[objName].saturday;
          dpi.sunday = element[objName].sunday;
          await dpi.save();
        } else {
          await DailyPlantInspection.create({
            tool_name: objName,
            monday: element.monday,
            tuesday: element.tuesday,
            wednesday: element.wednesday,
            thrusday: element.thrusday,
            friday: element.friday,
            saturday: element.saturday,
            sunday: element.sunday,
            DocumentId: id,
          });
        }
      });

      // Update Near Miss Report
      let nmr = await NearMissReport.findOne({
        where: { DocumentId: id },
      });
      if (!nmr) nmr = await NearMissReport.create({ DocumentId: id });

      nmr.details_comments = nearMissReport?.details_comments;
      nmr.actions_taken_comments = nearMissReport?.actions_taken_comments;
      nmr.suggestion_to_prevent_reoccurance_comments =
        nearMissReport?.suggestion_to_prevent_reoccurance_comments;
      nmr.report_signature =
        nearMissReport?.report_signature.length > 100
          ? getImage(nearMissReport?.report_signature)
          : nmr.report_signature;
      nmr.save();

      // Update Futher Hazards
      futherHazards.forEach(async (element) => {
        if (element.id !== undefined) {
          // Check if element has an 'id' property
          const fhz = await FutherHazarsAndControls.findOne({
            where: { id: element.id, DocumentId: id },
          });

          if (fhz) {
            fhz.name = element.name;
            fhz.control_required = element.control_required;
            await fhz.save();
          }
        } else {
          await FutherHazarsAndControls.create({
            name: element.name,
            control_required: element.control_required,
            DocumentId: id,
          });
        }
      });

      if (document.sections_completed < 4) document.sections_completed = 4; //ApprovedForm section saved
      document.last_updated_by = user.name;
      await document.save();

      res.status(200).json({ message: "Forms saved successfully!" });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }

  // Update Document
  static async updateDocument(req, res) {

    methodStatementsJobInfo.ms_id =
      documentUpdated.method_statements_job_information.ms_id;
    methodStatementsJobInfo.ms_revision =
      documentUpdated.method_statements_job_information.ms_revision;
    methodStatementsJobInfo.ms_project =
      documentUpdated.method_statements_job_information.ms_project;
    methodStatementsJobInfo.ms_site =
      documentUpdated.method_statements_job_information.ms_site;
    methodStatementsJobInfo.ms_client =
      documentUpdated.method_statements_job_information.ms_client;
    if (files && files["loc_photograph_image"])
      methodStatementsJobInfo.loc_photograph_image =
        files["loc_photograph_image"].filename;

  }

  // Get single ReinstatementSheet
  static async getReinstatementSheetByDocumentId(req, res) {
    const id = req.params.id;
    const reinstatementSheet = await ReinstatementSheet.findOne({
      where: { DocumentId: id },
      include: [
        {
          model: ReinstatementSheetHoleSequence,
          include: [{ model: ReinstatementImages }],
        },
      ],
    });

    if (!reinstatementSheet) {
      res.status(404).json({
        message: "Reinstatement Sheet not found!",
      });
      return;
    }

    res.status(200).json({
      reinstatementSheet: reinstatementSheet,
    });
  }

  // Edit Reinstatement Sheet info
  static async editReinstatementSheetInfo(req, res) {
    const id = req.params.id;
    const reinstatementSheetInfoUpdated = req.body;

    const document = await Document.findOne({
      where: { id: id },
    });
    if (!document) {
      res.status(404).json({
        message: "Document not found!",
      });
      return;
    }

    let reinstatementSheet = await ReinstatementSheet.findOne({
      where: { DocumentId: id },
    });

    if (!reinstatementSheet) {
      // creates a new one in case the previous is deleted
      reinstatementSheet = await ReinstatementSheet.create({ DocumentId: id });
    }

    try {
      reinstatementSheet.esbn_hole_number =
        reinstatementSheetInfoUpdated.esbn_hole_number;
      reinstatementSheet.location = reinstatementSheetInfoUpdated.location;
      reinstatementSheet.local_authority_licence_number =
        reinstatementSheetInfoUpdated.local_authority_licence_number;
      reinstatementSheet.traffic_impact_number =
        reinstatementSheetInfoUpdated.traffic_impact_number;

      await reinstatementSheet.save();

      res.status(200).json({
        message: "Reinstatement Sheet updated successfully!",
      });
    } catch (error) {
      res.status(403).json({
        message: error,
      });
    }
  }

  // Create HoleSequence
  static async newHoleSequence(req, res) {
    const id = req.params.id;
    const data = req.body;
    const images = req.files;

    const document = await Document.findOne({
      where: { id: id },
    });
    if (!document) {
      res.status(404).json({
        message: "Document not found!",
      });
      return;
    }

    let reinstatementSheet = await ReinstatementSheet.findOne({
      where: { DocumentId: id },
    });

    if (!reinstatementSheet) {
      // creates a new one in case the previous is deleted
      reinstatementSheet = await ReinstatementSheet.create({ DocumentId: id });
    }

    if (
      !data.coordinates ||
      !data.length ||
      !data.width ||
      !data.surface_category ||
      !data.reinstatement ||
      !data.status
    ) {
      res
        .status(422)
        .json({ message: "You have to enter value to all inputs!" });
      return;
    }

    const holeSequence = {
      coordinates: data.coordinates,
      length: data.length,
      width: data.width,
      area: data.length * data.width,
      surface_category: data.surface_category,
      reinstatement: data.reinstatement,
      status: data.status,
      date_complete: data.date_complete,
      comments: data.comments,
      reinstatementSheetId: reinstatementSheet.id,
    };

    try {
      const rshs = await ReinstatementSheetHoleSequence.create(holeSequence);

      images?.forEach(async (img) => {
        const newData = {
          image: img.filename,
          holeSequenceId: rshs.id,
        };
        await ReinstatementImages.create(newData);
      });

      res.status(200).json({
        message: "Hole Sequence created successfully!",
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  // Get hole sequence
  static async getHoleSequence(req, res) {
    const id = req.params.id;
    const holeSequence = await ReinstatementSheetHoleSequence.findOne({
      where: { id: id },
      include: ReinstatementImages,
    });

    if (!holeSequence) {
      res.status(404).json({
        message: "Hole sequence not found!",
      });
      return;
    }

    res.status(200).json({
      holeSequence: holeSequence,
    });
  }

  // Update hole sequence
  static async updateHoleSequence(req, res) {
    const id = req.params.id;
    const data = req.body;
    const images = req.files;

    const holeSequenceOld = await ReinstatementSheetHoleSequence.findOne({
      where: { id: id },
      include: ReinstatementImages,
    });

    if (!holeSequenceOld) {
      res.status(404).json({
        message: "Hole Sequence not found!",
      });
      return;
    }

    holeSequenceOld.coordinates = data.coordinates;
    holeSequenceOld.length = data.length;
    holeSequenceOld.width = data.width;
    holeSequenceOld.area = data.length * data.width;
    holeSequenceOld.surface_category = data.surface_category;
    holeSequenceOld.reinstatement = data.reinstatement;
    holeSequenceOld.status = data.status;
    holeSequenceOld.date_complete = data.date_complete;
    holeSequenceOld.comments = data.comments;

    try {
      await holeSequenceOld.save();

      // Save new images if any
      images?.forEach(async (img) => {
        const newData = {
          image: img.filename,
          holeSequenceId: holeSequenceOld.id,
        };
        await ReinstatementImages.create(newData);
      });

      res.status(200).json({
        message: "Hole Sequence updated successfully!",
        holeSequence: holeSequenceOld,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  // Remove hole sequence image
  static async removeHoleSequenceImage(req, res) {
    const id = req.params.id;
    try {
      await ReinstatementImages.destroy({ where: { id: id } });
    } catch (error) {
      return error;
    }
  }

  // Remove hole sequence
  static async removeHoleSequenceById(req, res) {
    const id = req.params.id;
    const holeSequence = await ReinstatementSheetHoleSequence.findOne({
      where: { id: id },
    });

    if (!holeSequence) {
      res.status(404).json({
        message: "Hole Sequence not found!",
      });
      return;
    }

    try {
      await ReinstatementSheetHoleSequence.destroy({
        where: { id: holeSequence.id },
      });

      res.status(200).json({
        message: "Hole Sequence removed successfully!",
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  // Attach file to the document
  static async attachFileToDocument(req, res) {
    const id = req.params.id;
    const file = req.file;
    const document = await Document.findOne({ where: { id: id } });

    if (!document) {
      res.status(404).json({
        message: "Document not found!",
      });
      return;
    }

    try {
      if (file) {
        if (document.file_attached) {
          // file path and name of the file to be deleted from the file system
          const filePath = `./public/files/${document.file_attached}`;
          // delete the file from the file system
          fs.unlink(filePath, (err) => {
            if (err) console.log("Error while deleting previous file: ", err);
          });
        }
        document.file_attached = file.filename;
        await document.save();
      }

      res.status(200).json({ message: "File attached successfully!" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  // Download PDF
  static async downloadPDF(req, res) {
    const id = req.params.id;
    const document = await Document.findOne({ where: { id: id } });

    if (!document) {
      res.status(404).json({
        message: "Document not found!",
      });
      return;
    }

    try {
      res.status(200).json({ message: "PDF downloaded successfully!" });
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
        message: "Reinstatement Sheet not found!",
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
