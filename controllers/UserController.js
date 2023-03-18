const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const default_user_img = "profile_img_default.png";

// helpers
const getUserByToken = require("../helpers/get-user-by-token");
const getToken = require("../helpers/get-token");
const createUserToken = require("../helpers/create-user-token");
const { imageUpload } = require("../helpers/image-upload");

module.exports = class UserController {
  static async register(req, res) {
    const name = req.body.name?.trim();
    const email = req.body.email?.toLowerCase().trim();
    const roleFirstLetter = req.body.role?.trim().charAt(0).toUpperCase();
    const roleRemainingLetters = req.body.role?.toLowerCase().trim().slice(1);
    const role = roleFirstLetter + roleRemainingLetters;
    const phone = req.body.phone?.replaceAll(" ", "");
    const admin = req.body.admin;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;

    // validations
    if (!name) {
      res.status(422).json({ message: "Name is needed" });
      return;
    } else if (name.length > 25) {
      res
        .status(422)
        .json({ message: "Name has to be less than 25 characters" });
      return;
    }

    if (!email) {
      res.status(422).json({ message: "Email is needed" });
      return;
    } else if (email.length > 50) {
      res
        .status(422)
        .json({ message: "Email has to be less than 50 characters" });
      return;
    }

    if (!role) {
      res.status(422).json({ message: "Role is needed" });
      return;
    } else if (role.length > 20) {
      res
        .status(422)
        .json({ message: "Role has to be less than 20 characters" });
      return;
    }

    if (!phone) {
      res.status(422).json({ message: "Phone is needed" });
      return;
    } else if (phone.length > 20) {
      res.status(422).json({
        message: "Phone number seems to be invalid (Number too long)",
      });
      return;
    }

    if (!password) {
      res.status(422).json({ message: "Password is needed" });
      return;
    } else if (password.length < 8 || password.length > 40) {
      res.status(422).json({
        error: "Password must be min 8, max 40 characters long!",
      });
      return;
    }

    if (!confirmpassword) {
      res.status(422).json({ message: "Password confirmation is needed" });
      return;
    }

    if (password != confirmpassword) {
      res.status(422).json({
        message: "Password and password confirmation have to be the same!",
      });
      return;
    }

    // check if user exists
    const userExistsEmail = await User.findOne({ where: { email: email } });

    if (userExistsEmail) {
      res.status(422).json({ message: "This email is already taken!" });
      return;
    }

    // create password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // create user
    const user = new User({
      name: name,
      email: email,
      role: role,
      phone: phone,
      admin: admin,
      password: passwordHash,
      image: default_user_img,
    });

    try {
      await user.save();
      res.status(200).json({ message: `User ${name} created successfully!` });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
};
