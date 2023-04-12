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
const { imageUpload } = require("../helpers/upload");

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

  // Init new document with documents info and siteAttendance
  static async newDocument(req, res) {
    const document = req.body.document;
    const images = req.files;

    // get user
    const token = getToken(req);
    const user = await getUserByToken(token);

    try {
      // New Document
      const doc = await Document.create({
        created_by: user.name,
        last_updated_by: user.name,
        sections_completed: 1,
      });

      // Set SiteAttendance
      document.site_attendance.forEach(async (attendance, index) => {
        const newAttendance = {
          name: attendance.name,
          date: attendance.date,
          time_in: attendance.time_in,
          time_out: attendance.time_out,
          DocumentId: doc.id,
        };
        if (images)
          newAttendance.signature = images[`signature${index}`].filename;
        await SiteAttendance.create(newAttendance);
      });

      // Init other tables and update it later on
      await Hazards.create({ DocumentId: doc.id });
      await DMSandTMC.create({ DocumentId: doc.id });
      await Emergencies.create({ DocumentId: doc.id });
      await TrafficManagementComplianceChecksheet.create({
        DocumentId: doc.id,
      });
      await TrafficManagementSlgChecklist.create({ DocumentId: doc.id });
      await ApprovedForm.create({ DocumentId: doc.id });
      await HotWorkPermit.create({ DocumentId: doc.id });
      await DailyPlantInspection.create({ DocumentId: doc.id });
      await NearMissReport.create({ DocumentId: doc.id });
      await FutherHazarsAndControls.create({ DocumentId: doc.id });
      await MethodStatementsJobInfo.create({ DocumentId: doc.id });
      await ReinstatementSheet.create({ DocumentId: doc.id });

      res.status(200).json({
        message: "New document created successfully!",
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  // Update Document
  static async updateDocument(req, res) {
    const id = req.params.id;
    const files = req.files;

    // get user
    const token = getToken(req);
    const user = await getUserByToken(token);

    const documentUpdated = req.body.document;

    // check if document exists
    const document = await Document.findOne({ where: { id: id } });
    if (!document) {
      res.status(404).json({ message: "Document not found!" });
      return;
    }

    const dmsAndTmc = await DMSandTMC.findOne({
      where: { DocumentId: id },
    });
    const emergencies = await Emergencies.findOne({
      where: { DocumentId: id },
    });
    const tmcc = await TrafficManagementComplianceChecksheet.findOne({
      where: { DocumentId: id },
    });
    const tmsc = await TrafficManagementSlgChecklist.findOne({
      where: { DocumentId: id },
    });
    const hotWorkPermit = await HotWorkPermit.findOne({
      where: { DocumentId: id },
    });
    const nearMissReport = await NearMissReport.findOne({
      where: { DocumentId: id },
    });
    const methodStatementsJobInfo = await MethodStatementsJobInfo.findOne({
      where: { DocumentId: id },
    });
    const reinstatementSheet = await ReinstatementSheet.findOne({
      where: { DocumentId: id },
    });

    document.sections_completed = documentUpdated.sections_completed;
    document.last_updated_by = user.name;
    if (files && files["permit_to_dig_sketch_image"])
      document.permit_to_dig_sketch_image =
        files["permit_to_dig_sketch_image"].filename;

    dmsAndTmc.method_statement_for_the_day =
      documentUpdated.daily_method_statement_and_traffic_management_checks.method_statement_for_the_day;
    dmsAndTmc.daily_method_statement_question_one =
      documentUpdated.daily_method_statement_and_traffic_management_checks.daily_method_statement_question_one;
    dmsAndTmc.daily_method_statement_question_two =
      documentUpdated.daily_method_statement_and_traffic_management_checks.daily_method_statement_question_two;
    dmsAndTmc.daily_method_statement_question_three =
      documentUpdated.daily_method_statement_and_traffic_management_checks.daily_method_statement_question_three;

    emergencies.emergencies_question_one =
      documentUpdated.emergencies.emergencies_question_one;
    emergencies.emergency_location_of_assembly_point =
      documentUpdated.emergencies.emergency_location_of_assembly_point;
    emergencies.emergency_name_of_first_aider =
      documentUpdated.emergencies.emergency_name_of_first_aider;
    emergencies.emergency_slg_operative =
      documentUpdated.emergencies.emergency_slg_operative;

    tmcc.traffic_management_compliance_checksheet_tmp_number =
      documentUpdated.traffic_management_compliance_checksheet.traffic_management_compliance_checksheet_tmp_number;
    tmcc.traffic_management_compliance_checksheet_question_one =
      documentUpdated.traffic_management_compliance_checksheet.traffic_management_compliance_checksheet_question_one;
    tmcc.traffic_management_compliance_checksheet_question_two =
      documentUpdated.traffic_management_compliance_checksheet.traffic_management_compliance_checksheet_question_two;
    tmcc.traffic_management_compliance_checksheet_question_three =
      documentUpdated.traffic_management_compliance_checksheet.traffic_management_compliance_checksheet_question_three;
    tmcc.traffic_management_compliance_checksheet_question_sub_one =
      documentUpdated.traffic_management_compliance_checksheet.traffic_management_compliance_checksheet_question_sub_one;
    tmcc.traffic_management_compliance_checksheet_question_sub_two =
      documentUpdated.traffic_management_compliance_checksheet.traffic_management_compliance_checksheet_question_sub_two;
    tmcc.traffic_management_compliance_checksheet_question_sub_three =
      documentUpdated.traffic_management_compliance_checksheet.traffic_management_compliance_checksheet_question_sub_three;
    tmcc.traffic_management_compliance_checksheet_question_sub_four =
      documentUpdated.traffic_management_compliance_checksheet.traffic_management_compliance_checksheet_question_sub_four;

    tmsc.installation_checks_one =
      documentUpdated.traffic_management_slg_checklist.installation_checks_one;
    tmsc.installation_checks_two =
      documentUpdated.traffic_management_slg_checklist.installation_checks_two;
    tmsc.installation_checks_three =
      documentUpdated.traffic_management_slg_checklist.installation_checks_three;
    tmsc.installation_checks_four =
      documentUpdated.traffic_management_slg_checklist.installation_checks_four;
    tmsc.installation_checks_five =
      documentUpdated.traffic_management_slg_checklist.installation_checks_five;
    tmsc.installation_checks_six =
      documentUpdated.traffic_management_slg_checklist.installation_checks_six;
    tmsc.operation_checks_one =
      documentUpdated.traffic_management_slg_checklist.operation_checks_one;
    tmsc.operation_checks_two =
      documentUpdated.traffic_management_slg_checklist.operation_checks_two;
    tmsc.operation_checks_three =
      documentUpdated.traffic_management_slg_checklist.operation_checks_three;
    tmsc.operation_checks_four =
      documentUpdated.traffic_management_slg_checklist.operation_checks_four;
    tmsc.operation_checks_five =
      documentUpdated.traffic_management_slg_checklist.operation_checks_five;
    tmsc.operation_checks_six =
      documentUpdated.traffic_management_slg_checklist.operation_checks_six;
    tmsc.operation_checks_seven =
      documentUpdated.traffic_management_slg_checklist.operation_checks_seven;
    tmsc.traffic_checks_one =
      documentUpdated.traffic_management_slg_checklist.traffic_checks_one;
    tmsc.traffic_checks_two =
      documentUpdated.traffic_management_slg_checklist.traffic_checks_two;
    tmsc.traffic_checks_three =
      documentUpdated.traffic_management_slg_checklist.traffic_checks_three;
    tmsc.traffic_checks_four =
      documentUpdated.traffic_management_slg_checklist.traffic_checks_four;
    tmsc.vulnerable_user_checks_one =
      documentUpdated.traffic_management_slg_checklist.vulnerable_user_checks_one;
    tmsc.vulnerable_user_checks_two =
      documentUpdated.traffic_management_slg_checklist.vulnerable_user_checks_two;
    tmsc.vulnerable_user_checks_three =
      documentUpdated.traffic_management_slg_checklist.vulnerable_user_checks_three;
    tmsc.vulnerable_user_checks_four =
      documentUpdated.traffic_management_slg_checklist.vulnerable_user_checks_four;
    tmsc.vulnerable_user_checks_five =
      documentUpdated.traffic_management_slg_checklist.vulnerable_user_checks_five;
    tmsc.work_complete_checks_one =
      documentUpdated.traffic_management_slg_checklist.work_complete_checks_one;
    tmsc.work_complete_checks_two =
      documentUpdated.traffic_management_slg_checklist.work_complete_checks_two;
    tmsc.work_complete_checks_three =
      documentUpdated.traffic_management_slg_checklist.work_complete_checks_three;

    hotWorkPermit.site = documentUpdated.hot_work_permit.site;
    hotWorkPermit.floor_level = documentUpdated.hot_work_permit.floor_level;
    hotWorkPermit.nature_of_work =
      documentUpdated.hot_work_permit.nature_of_work;
    hotWorkPermit.date = documentUpdated.hot_work_permit.date;
    hotWorkPermit.permit_precautions_one =
      documentUpdated.hot_work_permit.permit_precautions_one;
    hotWorkPermit.permit_precautions_two =
      documentUpdated.hot_work_permit.permit_precautions_two;
    hotWorkPermit.permit_precautions_three =
      documentUpdated.hot_work_permit.permit_precautions_three;
    hotWorkPermit.permit_precautions_four =
      documentUpdated.hot_work_permit.permit_precautions_four;
    hotWorkPermit.permit_precautions_five =
      documentUpdated.hot_work_permit.permit_precautions_five;
    hotWorkPermit.permit_precautions_six =
      documentUpdated.hot_work_permit.permit_precautions_six;
    hotWorkPermit.permit_precautions_seven =
      documentUpdated.hot_work_permit.permit_precautions_seven;
    hotWorkPermit.permit_precautions_eight =
      documentUpdated.hot_work_permit.permit_precautions_eight;
    hotWorkPermit.permit_precautions_nine =
      documentUpdated.hot_work_permit.permit_precautions_nine;
    hotWorkPermit.permit_precautions_ten =
      documentUpdated.hot_work_permit.permit_precautions_ten;
    hotWorkPermit.permit_precautions_eleven =
      documentUpdated.hot_work_permit.permit_precautions_eleven;
    hotWorkPermit.permit_issued_by_company =
      documentUpdated.hot_work_permit.permit_issued_by_company;
    hotWorkPermit.permit_issued_by_person =
      documentUpdated.hot_work_permit.permit_issued_by_person;
    if (files && files["permit_issued_by_person_signature"])
      hotWorkPermit.permit_issued_by_person_signature =
        files["permit_issued_by_person_signature"].filename;
    hotWorkPermit.permit_received_by_company =
      documentUpdated.hot_work_permit.permit_received_by_company;
    hotWorkPermit.permit_received_by_person =
      documentUpdated.hot_work_permit.permit_received_by_person;
    if (files && files["permit_received_by_person_signature"])
      hotWorkPermit.permit_received_by_person_signature =
        files["permit_received_by_person_signature"].filename;
    hotWorkPermit.final_check_time =
      documentUpdated.hot_work_permit.final_check_time;
    hotWorkPermit.final_check_name =
      documentUpdated.hot_work_permit.final_check_name;
    if (files && files["final_check_signature"])
      hotWorkPermit.final_check_signature =
        files["final_check_signature"].filename;

    nearMissReport.details_comments =
      documentUpdated.near_miss_report.details_comments;
    nearMissReport.actions_taken_comments =
      documentUpdated.near_miss_report.actions_taken_comments;
    nearMissReport.suggestion_to_prevent_reoccurance_comments =
      documentUpdated.near_miss_report.suggestion_to_prevent_reoccurance_comments;
    if (files && files["report_signature"])
      nearMissReport.report_signature = files["report_signature"].filename;

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

    try {
      await document.save();
      await dmsAndTmc.save();
      await emergencies.save();
      await tmcc.save();
      await tmsc.save();
      await hotWorkPermit.save();
      await nearMissReport.save();
      await methodStatementsJobInfo.save();

      // Recreate SiteAttendance
      await SiteAttendance.destroy({ where: { DocumentId: id } });
      documentUpdated.site_attendance.forEach(async (attendance, index) => {
        const newData = {
          name: attendance.name,
          date: attendance.date,
          time_in: attendance.time_in,
          time_out: attendance.time_out,
          DocumentId: id,
        };
        if (files) newData.signature = files[`signature${index}`].filename;
        await SiteAttendance.create(newData);
      });

      // Recreate Hazards
      await Hazards.destroy({ where: { DocumentId: id } });
      documentUpdated.hazards.forEach(async (element) => {
        await Hazards.create({
          name: element.name,
          control: element.control,
          value: element.value,
          DocumentId: id,
        });
      });

      // Recreate ApprovedForm
      await ApprovedForm.destroy({ where: { DocumentId: id } });
      documentUpdated.approved_form.forEach(async (element, index) => {
        const newData = {
          description_location: element.description_location,
          date_examination: element.date_examination,
          examination_result_state: element.examination_result_state,
          DocumentId: id,
        };
        if (files)
          newData.inspector_signature =
            files[`inspector_signature${index}`].filename;
        await ApprovedForm.create(newData);
      });

      // Recreate DailyPlantInspection
      await DailyPlantInspection.destroy({ where: { DocumentId: id } });
      documentUpdated.daily_plant_inspection.forEach(async (element) => {
        await DailyPlantInspection.create({
          tool_name: element.tool_name,
          monday: element.monday,
          tuesday: element.tuesday,
          wednesday: element.wednesday,
          thrusday: element.thrusday,
          friday: element.friday,
          saturday: element.saturday,
          sunday: element.sunday,
          DocumentId: id,
        });
      });

      // Recreate FutherHazarsAndControls
      await FutherHazarsAndControls.destroy({ where: { DocumentId: id } });
      documentUpdated.futher_hazards_and_controls_required.forEach(
        async (element) => {
          await FutherHazarsAndControls.create({
            name: element.name,
            control_required: element.control_required,
            DocumentId: id,
          });
        }
      );

      // ReinstatementSheet, ReinstatementSheetHoleSequence and ReinstatementImages have their own method to update their values

      res.status(200).json({
        message: "Document updated successfully!",
        document: documentUpdated,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  // Get All ReinstatementSheets
  static async getAllReinstatementSheets(req, res) {
    const reinstatementSheets = await ReinstatementSheet.findAll({
      include: [
        {
          model: ReinstatementSheetHoleSequence,
          include: [{ model: ReinstatementImages }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      reinstatementSheets: reinstatementSheets,
    });
  }

  // Get single ReinstatementSheet
  static async getReinstatementSheetById(req, res) {
    const id = req.params.id;
    const reinstatementSheet = await ReinstatementSheet.findOne({
      where: { id: id },
      include: [
        {
          model: ReinstatementSheetHoleSequence,
          include: [{ model: ReinstatementImages }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!reinstatementSheet) {
      res.status(404).json({
        message: "ReinstatementSheet not found!",
      });
      return;
    }

    res.status(200).json({
      reinstatementSheet: reinstatementSheet,
    });
  }

  // Remove the whole reinstatement sheet by its Id
  static async removeReinstatementSheetById(req, res) {
    const id = req.params.id;
    const reinstatementSheet = await ReinstatementSheet.findOne({
      where: { id: id },
    });

    if (!reinstatementSheet) {
      res.status(404).json({
        message: "ReinstatementSheet not found!",
      });
      return;
    }

    await ReinstatementSheet.destroy({ where: { id: id } });

    res.status(200).json({
      message: "ReinstatementSheet removed successfully!",
    });
  }

  // Create HoleSequence with Reinstatement info if any
  static async newHoleSequence(req, res) {
    const id = req.params.id;
    const data = req.body.reinstatement_sheet;
    const files = req.files;

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

    reinstatementSheet.esbn_hole_number = data.esbn_hole_number;
    reinstatementSheet.location = data.location;
    reinstatementSheet.local_authority_licence_number =
      data.local_authority_licence_number;
    reinstatementSheet.traffic_impact_number = data.traffic_impact_number;

    await reinstatementSheet.save();

    const holeSequence = {
      coordinates: data.hole_sequence.coordinates,
      length: data.hole_sequence.length,
      width: data.hole_sequence.width,
      area: data.hole_sequence.area,
      surface_category: data.hole_sequence.surface_category,
      reinstatement: data.hole_sequence.reinstatement,
      status: data.hole_sequence.status,
      date_complete: data.hole_sequence.date_complete,
      comments: data.hole_sequence.comments,
      reinstatementSheetId: reinstatementSheet.id,
    };

    try {
      const rshs = await ReinstatementSheetHoleSequence.create(holeSequence);
      data.hole_sequence.reinstatement_images.forEach(async (img, index) => {
        if (files && files[`hole_sequence_image${index}`]) {
          const newData = {
            image: files[`hole_sequence_image${index}`].filename,
            holeSequenceId: rshs.id,
          };
          await ReinstatementImages.create(newData);
        }
      });

      res.status(200).json({
        message: "Hole Sequence created successfully!",
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  // Update hole sequence
  static async updateHoleSequence(req, res) {
    const id = req.params.id;
    const data = req.body.hole_sequence;
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
    holeSequenceOld.area = data.area;
    holeSequenceOld.surface_category = data.surface_category;
    holeSequenceOld.reinstatement = data.reinstatement;
    holeSequenceOld.status = data.status;
    holeSequenceOld.date_complete = data.date_complete;
    holeSequenceOld.comments = data.comments;

    try {
      await holeSequenceOld.save();

      res.status(200).json({
        message: "Hole Sequence updated successfully!",
        holeSequence: holeSequenceOld,
      });
    } catch (error) {
      res.status(500).json({ message: error });
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

  // Add image to the hole sequence
  static async addImageHoleSequence(req, res) {
    const id = req.params.id;
    const images = req.files;
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
      if (images) {
        images.forEach(async (img) => {
          const newImage = {
            image: img.filename,
            holeSequenceId: id,
          };
          await ReinstatementImages.create(newImage);
        });
      }

      res.status(200).json({ message: "Images Uploaded!" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  // Remove image from the hole sequence
  static async removeImageHoleSequence(req, res) {
    const id = req.params.id;
    const imageId = req.params.imageid;
    const holeSequence = await ReinstatementSheetHoleSequence.findOne({
      where: { id: id },
    });

    if (!holeSequence) {
      res.status(404).json({
        message: "Hole Sequence not found!",
      });
      return;
    }

    const img = await ReinstatementImages.findOne({ where: { id: imageId } });
    if (!img) {
      res.status(404).json({ message: "Image not found!" });
      return;
    }

    try {
      // file path and name of the image to be deleted from the file system
      const filePath = `./public/images/documents/${img.image}`;
      // delete the file from the file system
      fs.unlink(filePath, (err) => {
        if (err) console.log(err);
      });

      await ReinstatementImages.destroy({ where: { id: imageId } });

      res.status(200).json({ message: "Image deleted!" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  // Attach file to the document
  static async addFileToDocument(req, res) {
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
      where: { id: id },
    });

    if (!reinstatementSheet) {
      res.status(404).json({
        message: "Reinstatement Sheet not found!",
      });
      return;
    }

    try {
      res.status(200).json({ message: "Reinstatement Sheet downloaded successfully!" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
};
