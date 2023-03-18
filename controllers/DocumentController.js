const User = require("../models/User/User");
const Document = require("../models/Document/Document");

// helpers
const getUserByToken = require("../helpers/get-user-by-token");
const getToken = require("../helpers/get-token");
const createUserToken = require("../helpers/create-user-token");
const { imageUpload } = require("../helpers/image-upload");

module.exports = class UserController {
  // Create new document
  static async newDocument(req, res) {
    
  }
};
