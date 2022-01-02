const jwt = require("jsonwebtoken");

const getTokenFromHeaders = (req) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.split(" ")[0] === "Bearer") {
    return authorization.split(" ")[1];
  }
  return null;
};

const userExtractor = (req, res, next) => {
  const token = getTokenFromHeaders(req);

  try {
    if (!token) throw new Error("No token provided");
    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!decodedToken) throw new Error("Invalid token");
    const { id } = decodedToken;
    req.idUser = id;

    next();
  } catch (err) {
    console.log({ err });
    return res.status(401).json({ error: err.message });
  }
};

module.exports = userExtractor;
