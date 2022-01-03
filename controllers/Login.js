const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require("passport");
const router = require("express").Router();
const User = require("../models/User");

require("../socialMediaAuth/facebook")();

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

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/fail" }),
  (req, res) => {
    const { name, email, picture } = req.user._json;

    const userFromFacebook = {
      name,
      email,
      avatar: picture.data.url,
      username: email.slice(0, 20),
    };
    res.status(200).json(userFromFacebook);
  }
);

module.exports = router;
