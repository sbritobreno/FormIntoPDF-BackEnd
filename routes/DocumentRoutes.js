const router = require("express").Router();
const DocumentController = require("../controllers/DocumentController");
const multer  = require('multer');

// middleware
const verifyToken = require("../helpers/verify-token");
const { imageUpload, fileUpload } = require("../helpers/upload");
const upload = multer()

router.get("/all_documents", verifyToken, DocumentController.getAllDocuments);
router.get("/get/:id", verifyToken, DocumentController.getDocumentById);
router.delete("/remove/:id",verifyToken,DocumentController.removeDocumentById);
router.post("/new", verifyToken, DocumentController.newDocument);
router.post("/:id/add/attendance", verifyToken, DocumentController.addAttendance);
router.delete("/remove/attendance/:id", verifyToken, DocumentController.removeAttendance);
router.patch("/:id/update/sitesetup", verifyToken, upload.any(), DocumentController.updateSiteSetup);
router.patch("/:id/update/sitesetup/add_sketch_image", verifyToken, imageUpload.single("image"), DocumentController.updateSiteSetupAddImage)
router.patch("/:id/update/approvedform", verifyToken, upload.any(), DocumentController.updateApprovedForm);
router.patch("/:id/update/forms", verifyToken, upload.any(), DocumentController.updateForms);
router.patch("/:id/update/methodstatements", verifyToken, imageUpload.single("loc_photograph_image"), DocumentController.updateMethodStatements);
router.get("/:id/reinstatementsheet", verifyToken, DocumentController.getReinstatementSheetByDocumentId);
router.patch("/:id/update/reinstatementsheetinfo", verifyToken, DocumentController.editReinstatementSheetInfo);
router.post("/:id/new_holesequence", verifyToken, imageUpload.array("images"), DocumentController.newHoleSequence);
router.get("/holesequence/:holeSequenceId", verifyToken, DocumentController.getHoleSequence);
router.patch("/:id/update_holesequence/:holeSequenceId", verifyToken, imageUpload.array("images"), DocumentController.updateHoleSequence);
router.delete("/holesequence/remove_image/:id", verifyToken, DocumentController.removeHoleSequenceImage);
router.delete("/remove_holesequence/:id", verifyToken, DocumentController.removeHoleSequenceById);
router.patch("/attach_file/:id", verifyToken, fileUpload.single("file"), DocumentController.attachFileToDocument);

module.exports = router;
