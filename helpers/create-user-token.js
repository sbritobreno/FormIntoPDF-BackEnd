const jwt = require("jsonwebtoken");

const createUserToken = async (user, req, res) => {
  const token = jwt.sign(
    {
      name: user.name,
      id: user.id,
    },
    "f2psecret"
  );

  // return token
  res.status(200).json({
    message: "You are now Logged in!",
    token: token,
    userId: user.id,
  });
};

module.exports = createUserToken;
