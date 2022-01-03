const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require("passport");
const router = require("express").Router();
const User = require("../models/User");

const facebookAuth = require("./facebookAuth");
const twitterAuth = require("./twitterAuth");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  const passwordIsValid =
    user && (await bcrypt.compare(password, user.passwordHash));

  if (!user || !passwordIsValid) {
    return res.status(401).send({ error: "Invalid credentials" });
  }

  const userForToken = {
    id: user._id,
    email: user.email,
  };
  const token = jwt.sign(userForToken, process.env.SECRET);

  res.status(200).json({
    token,
    user,
  });
});

router.use("/facebook", facebookAuth);
router.use("/twitter", twitterAuth);

module.exports = router;
