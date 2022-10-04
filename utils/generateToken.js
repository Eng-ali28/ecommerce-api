const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  const token = jwt.sign(payload, process.env.SECRET);
  return token;
};

module.exports = generateToken;
