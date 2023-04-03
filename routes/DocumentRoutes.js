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
router.patch(
  "/update/:id",
  verifyToken,
  imageUpload.array("images"),
  DocumentController.updateDocument
);

module.exports = router;
