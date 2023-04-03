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
const ReinstatementSheetImages = require("../models/Document/ReinstatementSheetImages");

// helpers
const getUserByToken = require("../helpers/get-user-by-token");
const getToken = require("../helpers/get-token");
const createUserToken = require("../helpers/create-user-token");
const { imageUpload } = require("../helpers/image-upload");
const DailyMethodStatementAndTrafficManagementChecks = require("../models/Document/DailyMethodStatementAndTrafficManagementChecks");

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
            { model: ReinstatementSheetHoleSequence },
            { model: ReinstatementSheetImages },
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
            { model: ReinstatementSheetHoleSequence },
            { model: ReinstatementSheetImages },
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
            { model: ReinstatementSheetHoleSequence },
            { model: ReinstatementSheetImages },
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

  // Create new document
  static async newDocument(req, res) {
    const document = req.body.document;

    // get user
    const token = getToken(req);
    const user = await getUserByToken(token);

    // New document
    const newDocument = {
      file_attached: document.file_attached,
      created_by: user.name,
      last_updated_by: user.name,
      permit_to_dig_sketch_image: document.permit_to_dig_sketch_image,
      site_attendance: document.site_attendance,
      hazards: document.hazards,
      daily_method_statement_and_traffic_management_checks: {
        method_statement_for_the_day:
          document.daily_method_statement_and_traffic_management_checks
            .method_statement_for_the_day,
        daily_method_statement_question_one:
          document.daily_method_statement_and_traffic_management_checks
            .daily_method_statement_question_one,
        daily_method_statement_question_two:
          document.daily_method_statement_and_traffic_management_checks
            .daily_method_statement_question_two,
        daily_method_statement_question_three:
          document.daily_method_statement_and_traffic_management_checks
            .daily_method_statement_question_three,
      },
      emergencies: {
        emergencies_question_one: document.emergencies.emergencies_question_one,
        emergency_location_of_assembly_point:
          document.emergencies.emergency_location_of_assembly_point,
        emergency_name_of_first_aider:
          document.emergencies.emergency_name_of_first_aider,
        emergency_slg_operative: document.emergencies.emergency_slg_operative,
      },
      traffic_management_compliance_checksheet: {
        traffic_management_compliance_checksheet_tmp_number:
          document.traffic_management_compliance_checksheet
            .traffic_management_compliance_checksheet_tmp_number,
        traffic_management_compliance_checksheet_question_one:
          document.traffic_management_compliance_checksheet
            .traffic_management_compliance_checksheet_question_one,
        traffic_management_compliance_checksheet_question_two:
          document.traffic_management_compliance_checksheet
            .traffic_management_compliance_checksheet_question_two,
        traffic_management_compliance_checksheet_question_three:
          document.traffic_management_compliance_checksheet
            .traffic_management_compliance_checksheet_question_three,
        traffic_management_compliance_checksheet_question_sub_one:
          document.traffic_management_compliance_checksheet
            .traffic_management_compliance_checksheet_question_sub_one,
        traffic_management_compliance_checksheet_question_sub_two:
          document.traffic_management_compliance_checksheet
            .traffic_management_compliance_checksheet_question_sub_two,
        traffic_management_compliance_checksheet_question_sub_three:
          document.traffic_management_compliance_checksheet
            .traffic_management_compliance_checksheet_question_sub_three,
        traffic_management_compliance_checksheet_question_sub_four:
          document.traffic_management_compliance_checksheet
            .traffic_management_compliance_checksheet_question_sub_four,
      },
      traffic_management_slg_checklist: {
        installation_checks_one:
          document.traffic_management_slg_checklist.installation_checks_one,
        installation_checks_two:
          document.traffic_management_slg_checklist.installation_checks_two,
        installation_checks_three:
          document.traffic_management_slg_checklist.installation_checks_three,
        installation_checks_four:
          document.traffic_management_slg_checklist.installation_checks_four,
        installation_checks_five:
          document.traffic_management_slg_checklist.installation_checks_five,
        installation_checks_six:
          document.traffic_management_slg_checklist.installation_checks_six,
        operation_checks_one:
          document.traffic_management_slg_checklist.operation_checks_one,
        operation_checks_two:
          document.traffic_management_slg_checklist.operation_checks_two,
        operation_checks_three:
          document.traffic_management_slg_checklist.operation_checks_three,
        operation_checks_four:
          document.traffic_management_slg_checklist.operation_checks_four,
        operation_checks_five:
          document.traffic_management_slg_checklist.operation_checks_five,
        operation_checks_six:
          document.traffic_management_slg_checklist.operation_checks_six,
        operation_checks_seven:
          document.traffic_management_slg_checklist.operation_checks_seven,
        traffic_checks_one:
          document.traffic_management_slg_checklist.traffic_checks_one,
        traffic_checks_two:
          document.traffic_management_slg_checklist.traffic_checks_two,
        traffic_checks_three:
          document.traffic_management_slg_checklist.traffic_checks_three,
        traffic_checks_four:
          document.traffic_management_slg_checklist.traffic_checks_four,
        vulnerable_user_checks_one:
          document.traffic_management_slg_checklist.vulnerable_user_checks_one,
        vulnerable_user_checks_two:
          document.traffic_management_slg_checklist.vulnerable_user_checks_two,
        vulnerable_user_checks_three:
          document.traffic_management_slg_checklist
            .vulnerable_user_checks_three,
        vulnerable_user_checks_four:
          document.traffic_management_slg_checklist.vulnerable_user_checks_four,
        vulnerable_user_checks_five:
          document.traffic_management_slg_checklist.vulnerable_user_checks_five,
        work_complete_checks_one:
          document.traffic_management_slg_checklist.work_complete_checks_one,
        work_complete_checks_two:
          document.traffic_management_slg_checklist.work_complete_checks_two,
        work_complete_checks_three:
          document.traffic_management_slg_checklist.work_complete_checks_three,
      },
      approved_form: document.approved_form,
      hot_work_permit: {
        site: document.hot_work_permit.site,
        floor_level: document.hot_work_permit.floor_level,
        nature_of_work: document.hot_work_permit.nature_of_work,
        date: document.hot_work_permit.date,
        permit_precautions_one: document.hot_work_permit.permit_precautions_one,
        permit_precautions_two: document.hot_work_permit.permit_precautions_two,
        permit_precautions_three:
          document.hot_work_permit.permit_precautions_three,
        permit_precautions_four:
          document.hot_work_permit.permit_precautions_four,
        permit_precautions_five:
          document.hot_work_permit.permit_precautions_five,
        permit_precautions_six: document.hot_work_permit.permit_precautions_six,
        permit_precautions_seven:
          document.hot_work_permit.permit_precautions_seven,
        permit_precautions_eight:
          document.hot_work_permit.permit_precautions_eight,
        permit_precautions_nine:
          document.hot_work_permit.permit_precautions_nine,
        permit_precautions_ten: document.hot_work_permit.permit_precautions_ten,
        permit_precautions_eleven:
          document.hot_work_permit.permit_precautions_eleven,
        permit_issued_by_company:
          document.hot_work_permit.permit_issued_by_company,
        permit_issued_by_person:
          document.hot_work_permit.permit_issued_by_person,
        permit_issued_by_person_signature:
          document.hot_work_permit.permit_issued_by_person_signature,
        permit_received_by_company:
          document.hot_work_permit.permit_received_by_company,
        permit_received_by_person:
          document.hot_work_permit.permit_received_by_person,
        permit_received_by_person_signature:
          document.hot_work_permit.permit_received_by_person_signature,
        final_check_time: document.hot_work_permit.final_check_time,
        final_check_name: document.hot_work_permit.final_check_name,
        final_check_signature: document.hot_work_permit.final_check_signature,
      },
      daily_plant_inspection: document.daily_plant_inspection,
      near_miss_report: {
        details_comments: document.near_miss_report.details_comments,
        actions_taken_comments:
          document.near_miss_report.actions_taken_comments,
        suggestion_to_prevent_reoccurance_comments:
          document.near_miss_report.suggestion_to_prevent_reoccurance_comments,
        report_signature: document.near_miss_report.report_signature,
      },
      futher_hazards_and_controls_required:
        document.futher_hazards_and_controls_required,
      method_statements_job_information: {
        ms_id: document.method_statements_job_information.ms_id,
        ms_revision: document.method_statements_job_information.ms_revision,
        ms_project: document.method_statements_job_information.ms_project,
        ms_site: document.method_statements_job_information.ms_site,
        ms_client: document.method_statements_job_information.ms_client,
        loc_photograph_image:
          document.method_statements_job_information.loc_photograph_image,
      },
      reinstatement_sheet: {
        esbn_hole_number: document.reinstatement_sheet.esbn_hole_number,
        location: document.reinstatement_sheet.location,
        local_authority_licence_number:
          document.reinstatement_sheet.local_authority_licence_number,
        traffic_impact_number:
          document.reinstatement_sheet.traffic_impact_number,
        hole_sequence: document.reinstatement_sheet.hole_sequence,
        reinstatement_sheet_images:
          document.reinstatement_sheet.reinstatement_sheet_images,
        comments: document.reinstatement_sheet.comments,
      },
    };

    try {
      const doc = await Document.create(newDocument);

      // Set SiteAttendance
      newDocument.site_attendance.forEach(async (attendance) => {
        await SiteAttendance.create({
          name: attendance.name,
          signature: attendance.signature,
          date: attendance.date,
          time_in: attendance.time_in,
          time_out: attendance.time_out,
          DocumentId: doc.id,
        });
      });

      // Set Hazards
      newDocument.hazards.forEach(async (hazard) => {
        await Hazards.create({
          name: hazard.name,
          control: hazard.control,
          value: hazard.value,
          DocumentId: doc.id,
        });
      });

      // Set DailyMethodStatementAndTrafficManagementChecks
      await DMSandTMC.create({
        ...newDocument.daily_method_statement_and_traffic_management_checks,
        DocumentId: doc.id,
      });

      // Set Emergencies
      await Emergencies.create({
        ...newDocument.emergencies,
        DocumentId: doc.id,
      });

      // Set TrafficManagementComplianceChecksheet
      await TrafficManagementComplianceChecksheet.create({
        ...newDocument.traffic_management_compliance_checksheet,
        DocumentId: doc.id,
      });

      // Set TrafficManagementSlgChecklist
      await TrafficManagementSlgChecklist.create({
        ...newDocument.traffic_management_slg_checklist,
        DocumentId: doc.id,
      });

      // Set ApprovedForm
      newDocument.approved_form.forEach(async (element) => {
        await ApprovedForm.create({
          description_location: element.description_location,
          date_examination: element.date_examination,
          examination_result_state: element.examination_result_state,
          inspector_signature: element.inspector_signature,
          DocumentId: doc.id,
        });
      });

      // Set HotWorkPermit
      await HotWorkPermit.create({
        ...newDocument.hot_work_permit,
        DocumentId: doc.id,
      });

      // Set DailyPlantInspection
      newDocument.daily_plant_inspection.forEach(async (element) => {
        await DailyPlantInspection.create({
          tool_name: element.tool_name,
          monday: element.monday,
          tuesday: element.tuesday,
          wednesday: element.wednesday,
          thrusday: element.thrusday,
          friday: element.friday,
          saturday: element.saturday,
          sunday: element.sunday,
          DocumentId: doc.id,
        });
      });

      // Set NearMissReport
      await NearMissReport.create({
        ...newDocument.near_miss_report,
        DocumentId: doc.id,
      });

      // Set FutherHazarsAndControls
      newDocument.futher_hazards_and_controls_required.forEach(
        async (element) => {
          await FutherHazarsAndControls.create({
            name: element.name,
            control_required: element.control_required,
            DocumentId: doc.id,
          });
        }
      );

      // Set MethodStatementsJobInfo
      await MethodStatementsJobInfo.create({
        ...newDocument.method_statements_job_information,
        DocumentId: doc.id,
      });

      // Set ReinstatementSheet
      const reinstatementSheet = await ReinstatementSheet.create({
        ...newDocument.reinstatement_sheet,
        DocumentId: doc.id,
      });

      // Set ReinstatementSheetHoleSequence
      newDocument.reinstatement_sheet.hole_sequence.forEach(
        async (holeSequence) => {
          await ReinstatementSheetHoleSequence.create({
            coordinates: holeSequence.coordinates,
            length: holeSequence.length,
            width: holeSequence.width,
            area: holeSequence.area,
            surface_category: holeSequence.surface_category,
            reinstatement: holeSequence.reinstatement,
            status: holeSequence.status,
            date_complete: holeSequence.date_complete,
            reinstatementSheetId: reinstatementSheet.id,
          });
        }
      );

      // Set ReinstatementSheetImages
      newDocument.reinstatement_sheet.reinstatement_sheet_images.forEach(
        async (image) => {
          await ReinstatementSheetImages.create({
            image: image.image,
            reinstatementSheetId: reinstatementSheet.id,
          });
        }
      );

      res.status(200).json({
        message: "New document created successfully!",
        document: newDocument,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  // Update Document
  static async updateDocument(req, res) {
    const id = req.params.id;

    // check if document exists
    const document = await Document.findOne({ where: { id: id } });
    if (!document) {
      res.status(404).json({ message: "Document not found!" });
      return;
    }

    const dmsAndTmc =
      await DailyMethodStatementAndTrafficManagementChecks.findOne({
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

    // get user
    const token = getToken(req);
    const user = await getUserByToken(token);

    const documentUpdated = req.body.document;

    document.file_attached = documentUpdated.file_attached;
    document.last_updated_by = user.name;
    document.permit_to_dig_sketch_image =
      documentUpdated.permit_to_dig_sketch_image;

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
    hotWorkPermit.permit_issued_by_person_signature =
      documentUpdated.hot_work_permit.permit_issued_by_person_signature;
    hotWorkPermit.permit_received_by_company =
      documentUpdated.hot_work_permit.permit_received_by_company;
    hotWorkPermit.permit_received_by_person =
      documentUpdated.hot_work_permit.permit_received_by_person;
    hotWorkPermit.permit_received_by_person_signature =
      documentUpdated.hot_work_permit.permit_received_by_person_signature;
    hotWorkPermit.final_check_time =
      documentUpdated.hot_work_permit.final_check_time;
    hotWorkPermit.final_check_name =
      documentUpdated.hot_work_permit.final_check_name;
    hotWorkPermit.final_check_signature =
      documentUpdated.hot_work_permit.final_check_signature;

    nearMissReport.details_comments =
      documentUpdated.near_miss_report.details_comments;
    nearMissReport.actions_taken_comments =
      documentUpdated.near_miss_report.actions_taken_comments;
    nearMissReport.suggestion_to_prevent_reoccurance_comments =
      documentUpdated.near_miss_report.suggestion_to_prevent_reoccurance_comments;
    nearMissReport.report_signature =
      documentUpdated.near_miss_report.report_signature;

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
    methodStatementsJobInfo.loc_photograph_image =
      documentUpdated.method_statements_job_information.loc_photograph_image;

    reinstatementSheet.esbn_hole_number =
      documentUpdated.reinstatement_sheet.esbn_hole_number;
    reinstatementSheet.location = documentUpdated.reinstatement_sheet.location;
    reinstatementSheet.local_authority_licence_number =
      documentUpdated.reinstatement_sheet.local_authority_licence_number;
    reinstatementSheet.traffic_impact_number =
      documentUpdated.reinstatement_sheet.traffic_impact_number;
    reinstatementSheet.comments = documentUpdated.reinstatement_sheet.comments;

    try {
      await document.save();
      await dmsAndTmc.save();
      await emergencies.save();
      await tmcc.save();
      await tmsc.save();
      await hotWorkPermit.save();
      await nearMissReport.save();
      await methodStatementsJobInfo.save();
      await reinstatementSheet.save();

      // Recreate SiteAttendance
      await SiteAttendance.destroy({ where: { DocumentId: id } });
      documentUpdated.site_attendance.forEach(async (attendance) => {
        await SiteAttendance.create({
          name: attendance.name,
          signature: attendance.signature,
          date: attendance.date,
          time_in: attendance.time_in,
          time_out: attendance.time_out,
          DocumentId: id,
        });
      });

      // Recreate Hazards
      await Hazards.destroy({ where: { DocumentId: id } });
      documentUpdated.hazards.forEach(async (hazard) => {
        await Hazards.create({
          name: hazard.name,
          control: hazard.control,
          value: hazard.value,
          DocumentId: id,
        });
      });

      // Recreate ApprovedForm
      await ApprovedForm.destroy({ where: { DocumentId: id } });
      documentUpdated.approved_form.forEach(async (element) => {
        await ApprovedForm.create({
          description_location: element.description_location,
          date_examination: element.date_examination,
          examination_result_state: element.examination_result_state,
          inspector_signature: element.inspector_signature,
          DocumentId: id,
        });
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

      // Recreate ReinstatementSheetHoleSequence
      await ReinstatementSheetHoleSequence.destroy({
        where: { reinstatementSheetId: id },
      });
      documentUpdated.reinstatement_sheet.hole_sequence.forEach(
        async (holeSequence) => {
          await ReinstatementSheetHoleSequence.create({
            coordinates: holeSequence.coordinates,
            length: holeSequence.length,
            width: holeSequence.width,
            area: holeSequence.area,
            surface_category: holeSequence.surface_category,
            reinstatement: holeSequence.reinstatement,
            status: holeSequence.status,
            date_complete: holeSequence.date_complete,
            reinstatementSheetId: reinstatementSheet.id,
          });
        }
      );

      // Recreate ReinstatementSheetImages
      await ReinstatementSheetImages.destroy({
        where: { reinstatementSheetId: id },
      });
      documentUpdated.reinstatement_sheet.reinstatement_sheet_images.forEach(
        async (image) => {
          await ReinstatementSheetImages.create({
            image: image.image,
            reinstatementSheetId: reinstatementSheet.id,
          });
        }
      );

      res.status(200).json({
        message: "Document updated successfully!",
        document: documentUpdated,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
};
