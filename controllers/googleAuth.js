const router = require("express").Router();
const passport = require("passport");
const generateJwt = require("../utils/generateJwt");

require("../socialMediaAuth/google")();

router.get(
  "/",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/fail_uwu" }),
  (req, res) => {
    const user = req.user;
    const { id, email } = user;
    res.status(200).json({
      user,
      token: generateJwt({ id, email }),
    });
  }
);

module.exports = router;
