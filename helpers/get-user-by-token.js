const jwt = require("jsonwebtoken");
const User = require("../models/User");

// get user by jwt token
const getUserByToken = async (token) => {
  if (!token) return res.status(401).json({ error: "Access denied!" });

  // find user
  const decoded = jwt.verify(token, "f2psecret");
  const userId = decoded.id;
  const user = await User.findOne({ where: { id: userId } });

  return user;
};

module.exports = getUserByToken;
