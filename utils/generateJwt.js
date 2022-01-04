const jwt = require("jsonwebtoken");
const generateJwt = (dataFromToken) => {
  return jwt.sign(dataFromToken, process.env.SECRET);
};

module.exports = generateJwt;
