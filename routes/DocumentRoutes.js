const router = require("express").Router();
const DocumentController = require("../controllers/DocumentController");

// middleware
const verifyToken = require("../helpers/verify-token");
const { imageUpload } = require("../helpers/upload");
const { fileUpload } = require("../helpers/upload");

router.get("/all_documents", verifyToken, DocumentController.getAllDocuments);
router.get("/get/:id", verifyToken, DocumentController.getDocumentById);
router.delete(
  "/remove/:id",
  verifyToken,
  DocumentController.removeDocumentById
);
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
router.get(
  "/all_reinstatementsheets",
  verifyToken,
  DocumentController.getAllReinstatementSheets
);
router.get(
  "/reinstatementsheet/:id",
  verifyToken,
  DocumentController.getReinstatementSheetById
);
router.delete(
  "/remove_reinstatementsheet/:id",
  verifyToken,
  DocumentController.removeReinstatementSheetById
);
router.post(
  "/new_holesequence/:id",
  verifyToken,
  imageUpload.array("images"),
  DocumentController.newHoleSequence
);
router.patch(
  "/update_holesequence/:id",
  verifyToken,
  DocumentController.updateHoleSequence
);
router.delete(
  "/remove_holesequence/:id",
  verifyToken,
  DocumentController.removeHoleSequenceById
);

// router.patch("/add_file/:id", verifyToken, fileUpload.single("file"), DocumentController.addFileToDocument);
// router.get("/download_reinstatementsheet/:id", verifyToken, DocumentController.downloadReinstatementSheet);
// router.get("/download_pdf/:id", verifyToken, DocumentController.downloadPdf);

//https://www.ultimateakash.com/blog-details/IixTQGAKYAo=/How-to-Generate-PDF-in-Node.js-2022

module.exports = router;
