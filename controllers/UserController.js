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
  // Register
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

  // Login
  static async login(req, res) {
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password;

    if (!email) {
      res.status(422).json({ message: "You need to type your email!" });
      return;
    }

    if (!password) {
      res.status(422).json({ message: "You need to type your password!" });
      return;
    }

    // check if user exists
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(422).json({ message: "Account not found!" });
    }

    // check if password match
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(422).json({ message: "Email or Password invalid!" });
    }

    await createUserToken(user, req, res);
  }

  // Check User
  static async checkUser(req, res) {
    let currentUser;
    let decoded;

    if (req.headers.authorization) {
      const token = getToken(req);
      if (token != "null") {
        decoded = jwt.verify(token, "f2psecret");

        currentUser = await User.findByPk(decoded.id);
        currentUser.password = undefined;
      }
    } else {
      currentUser = null;
    }

    res.status(200).send(currentUser);
  }

  // Get user by id
  static async getUserById(req, res) {
    const id = req.params.id;
    const user = await User.findByPk(id);

    if (!user) {
      res.status(422).json({ message: "User not found!" });
      return;
    }

    res.status(200).json({ user });
  }

  // Edit user
  static async editUser(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const name = req.body.name?.trim();
    const phone = req.body.phone?.replaceAll(" ", "");
    const roleFirstLetter = req.body.role?.trim().charAt(0).toUpperCase();
    const roleRemainingLetters = req.body.role?.toLowerCase().trim().slice(1);
    const role = roleFirstLetter + roleRemainingLetters;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;

    if (req.file) {
      user.image = req.file.filename;
    }

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
    user.name = name;

    if (!phone) {
      res.status(422).json({ message: "Phone is needed" });
      return;
    } else if (phone.length > 20) {
      res.status(422).json({
        message: "Phone number seems to be invalid (Number too long)",
      });
      return;
    }
    user.phone = phone;

    if (!role) {
      res.status(422).json({ message: "Role is needed" });
      return;
    } else if (role.length > 20) {
      res
        .status(422)
        .json({ message: "Role has to be less than 20 characters" });
      return;
    }
    user.role = role;

    // Email is set to not be changed on the front-end

    // check if password match
    if (password != confirmpassword) {
      res.status(422).json({
        message: "Password and password confirmation have to be the same!",
      });
      return;
    } else if (
      password != null &&
      password.length < 8 &&
      password.length > 40
    ) {
      res.status(422).json({
        message: "Password must be min 8, max 40 characters long!",
      });
      return;
    } else if (password == confirmpassword && password != null) {
      // creating new password
      const salt = await bcrypt.genSalt(12);
      const reqPassword = req.body.password;
      const passwordHash = await bcrypt.hash(reqPassword, salt);
      user.password = passwordHash;
    }

    try {
      // returns updated data
      user.save();
      res.json({
        message: "User details updated!",
        data: user,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async deleteUserAccount(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    try {
      // Delete the user
      await User.destroy({ where: { id: user.id } });

      res.json({
        message: "Account deleted!",
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async deleteUserAccountByAdmin(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);
    const id = req.params.id;
    const userToBeDeleted = await User.findByPk(id);
    const userToBeDeletedName = userToBeDeleted?.name.split(" ")[0];

    if (!user.admin) {
      res
        .status(422)
        .json({ message: "Only an Admin can delete someone else account!" });
      return;
    }

    if (!userToBeDeleted) {
      res.status(422).json({ message: "User account not found!" });
      return;
    }

    try {
      // Delete the some user's account
      await User.destroy({ where: { id: userToBeDeleted.id } });

      res.json({
        message: `${userToBeDeletedName}'s Account deleted!`,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async toggleUserIsAdmin(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);
    const id = req.params.id;
    const targetUser = await User.findByPk(id);
    const targetUserName = targetUser?.name.split(" ")[0];

    if (!user.admin) {
      res
        .status(422)
        .json({ message: "Only an Admin can set or unset someone as Admin!" });
      return;
    }

    if (!targetUser) {
      res.status(422).json({ message: "User account not found!" });
      return;
    }
    targetUser.admin = !targetUser.admin;

    try {
      // Delete the some user's account
      await targetUser.save();

      res.json({
        message: `${targetUserName} was ${
          targetUser.admin ? "set" : "unset"
        } as Admin!`,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async resetUserPassword(req, res) {
    const email = req.body.email?.toLowerCase().trim();

    // validations
    if (!email) {
      res
        .status(422)
        .json({ message: "Email is needed in order to reset password!" });
      return;
    }

    // check if user exists
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res
        .status(422)
        .json({ message: "There is no user with this email!" });
    }

    // Create provisional password and send it to user's email
    function getRandom() {
      return Math.floor(
        Math.pow(10, 8 - 1) + Math.random() * 9 * Math.pow(10, 8 - 1)
      );
    }
    const salt = await bcrypt.genSalt(12);
    const newPassword = getRandom().toString();
    const passwordHash = await bcrypt.hash(newPassword, salt);
    user.password = passwordHash;

    try {
      // returns updated data
      user.save();
      //sendEmail(email, templates.resetPassword(newPassword));
      res.json({
        message: `A new passord was sent to ${email}!`,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
};
