const jwt = require("jsonwebtoken");
const User = require("../models/User/User");

// get user by jwt token
const getUserByToken = async (token) => {
  try {
    if (!token) {
      throw new Error("Access denied! Token not found.");
    }

    // find user
    const decoded = jwt.verify(token, "f2psecret");
    const userId = decoded.id;
    const user = await User.findOne({ where: { id: userId } });

    return user;
  } catch (error) {
    throw new Error("Invalid token. " + error.message);
  }
};

module.exports = getUserByToken;
