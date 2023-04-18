const router = require("express").Router();
const DocumentController = require("../controllers/DocumentController");
const multer  = require('multer');

// middleware
const verifyToken = require("../helpers/verify-token");
const { imageUpload } = require("../helpers/upload");
const { fileUpload } = require("../helpers/upload");
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
// router
// updateDocument);
router.get("/:id/reinstatementsheet", verifyToken, DocumentController.getReinstatementSheetByDocumentId);
router.patch("/:id/update/reinstatementsheetinfo", verifyToken, DocumentController.editReinstatementSheetInfo);
router.post("/:id/new_holesequence", verifyToken, imageUpload.array("images"), DocumentController.newHoleSequence);
router.get("/holesequence/:id", verifyToken, DocumentController.getHoleSequence);
router.patch("/update_holesequence/:id", verifyToken, imageUpload.array("images"), DocumentController.updateHoleSequence);
router.delete("/holesequence/remove_image/:id", verifyToken, DocumentController.removeHoleSequenceImage);
router.delete("/remove_holesequence/:id", verifyToken, DocumentController.removeHoleSequenceById);
router.patch("/attach_file/:id", verifyToken, fileUpload.single("file"), DocumentController.attachFileToDocument);
router.get("/download_pdf/:id", verifyToken, DocumentController.downloadPDF);
router.get("/download/:id/reinstatementsheet", verifyToken, DocumentController.downloadReinstatementSheet);

//https://www.ultimateakash.com/blog-details/IixTQGAKYAo=/How-to-Generate-PDF-in-Node.js-2022

module.exports = router;
