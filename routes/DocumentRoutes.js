const router = require("express").Router();
const DocumentController = require("../controllers/DocumentController");

// middleware
const verifyToken = require("../helpers/verify-token");
const { imageUpload } = require("../helpers/image-upload");

router.post(
  "/new",
  verifyToken,
  imageUpload.array("images"),
  DocumentController.newDocument
);

module.exports = router;
