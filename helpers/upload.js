const multer = require("multer");
const path = require("path");

// Destination to store image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "";

    if (req.baseUrl.includes("user")) {
      folder = "images/users";
    } else if (req.baseUrl.includes("document")) {
      folder = "images/documents";
    } else if (req.baseUrl.includes("file")) {
      folder = "files";
    }
    cb(null, `public/${folder}/`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  },
});

const imageUpload = multer({
  storage: storage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please, upload only .png or .jpg!"));
    }
    cb(undefined, true);
  },
});

const fileUpload = multer({
  storage: storage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(pdf)$/)) {
      // upload only pdf format
      return cb(new Error("Please, upload only .pdf!"));
    }
    cb(undefined, true);
  },
});

module.exports = { imageUpload, fileUpload };
