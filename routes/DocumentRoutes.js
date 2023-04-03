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
// router.patch("/add_file/:id", verifyToken, DocumentController.addFileToDocument);
router.get("/all_reinstatements", verifyToken, DocumentController.getAllReinstatements);
// router.get("/reinstatement/:id", verifyToken, DocumentController.getReinstatementSheetById);
// router.delete("/remove_reinstatement/:id", verifyToken, DocumentController.removeReinstatementSheetById);
// router.patch(
//   "/update_reinstatement/:id",
//   verifyToken,
//   imageUpload.array("images"),
//   DocumentController.updateReinstatementSheet
// );
// router.get("/download_reinstatement/:id", verifyToken, DocumentController.downloadReinstatementSheet);
// router.get("/download_pdf/:id", verifyToken, DocumentController.downloadPdf);


module.exports = router;
