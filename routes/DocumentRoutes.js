const router = require("express").Router();
const DocumentController = require("../controllers/DocumentController");

// middleware
const verifyToken = require("../helpers/verify-token");
const { imageUpload } = require("../helpers/image-upload");

router.get("/all_documents", verifyToken, DocumentController.getAllDocuments);
router.get("/get/:id", verifyToken, DocumentController.getDocumentById);
router.delete("/remove/:id", verifyToken, DocumentController.removeDocumentById);
router.post(
  "/new",
  verifyToken,
  imageUpload.array("images"),
  DocumentController.newDocument
);
router.patch(
  "/update/:id",
  verifyToken,
  imageUpload.array("images"),
  DocumentController.updateDocument
);
router.get("/all_reinstatementsheets", verifyToken, DocumentController.getAllReinstatementSheets);
router.get("/reinstatementsheet/:id", verifyToken, DocumentController.getReinstatementSheetById);
router.delete("/remove_reinstatementsheet/:id", verifyToken, DocumentController.removeReinstatementSheetById);
router.post("/new_reinstatement", verifyToken, DocumentController.newReinstatement);
router.patch("/update_reinstatement/:id", verifyToken, imageUpload.array("images"), DocumentController.updateReinstatement);
router.delete("/remove_reinstatement/:id", verifyToken, DocumentController.removeReinstatementById);
// router.patch("/add_file/:id", verifyToken, DocumentController.addFileToDocument);
// router.get("/download_reinstatement/:id", verifyToken, DocumentController.downloadReinstatementSheet);
// router.get("/download_pdf/:id", verifyToken, DocumentController.downloadPdf);


module.exports = router;
