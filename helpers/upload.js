const multer = require("multer");
const path = require("path");

// Destination to store file
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/files/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      req.params.id +
        "_" +
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    );
  },
});

// Destination to store image
let id = 0;
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "";

    if (req.baseUrl.includes("user")) {
      id = req.body.id;
      folder = "users";
    } else if (req.baseUrl.includes("document")) {
      id = req.params.id;
      folder = "documents";
    }
    cb(null, `public/images/${folder}/`);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      id +
        "_" +
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    );
  },
});

const imageUpload = multer({
  storage: imageStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please, upload only .png or .jpg!"));
    }
    cb(undefined, true);
  },
});

const fileUpload = multer({
  storage: fileStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(pdf)$/)) {
      // upload only pdf format
      return cb(new Error("Please, upload only .pdf!"));
    }
    cb(undefined, true);
  },
});

module.exports = { imageUpload, fileUpload };
