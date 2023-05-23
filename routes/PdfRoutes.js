const router = require("express").Router();
const PdfController = require("../controllers/PdfController");

// middleware
const verifyToken = require("../helpers/verify-token");

router.get("/download/:id", verifyToken, PdfController.downloadPDF);
router.get("/download/:id/reinstatementsheet", verifyToken, PdfController.downloadReinstatementSheet);

module.exports = router;
