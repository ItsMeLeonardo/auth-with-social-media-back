const bcrypt = require("bcrypt");
const router = require("express").Router();
const User = require("../models/User");
const generateJwt = require("../utils/generateJwt");

const facebookAuth = require("./facebookAuth");
const twitterAuth = require("./twitterAuth");
const googleAuth = require("./googleAuth");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  const passwordIsValid =
    user && (await bcrypt.compare(password, user.passwordHash));

  if (!user || !passwordIsValid) {
    return res.status(401).send({ error: "Invalid credentials" });
  }

  const token = generateJwt({ email, id: user?._id });

  res.status(200).json({
    token,
    user,
  });
});

router.use("/facebook", facebookAuth);
router.use("/twitter", twitterAuth);
router.use("/google", googleAuth);

module.exports = router;
