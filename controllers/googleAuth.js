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
  passport.authenticate("google", {
    failureRedirect: `${process.env.URL_REDIRECT}/login`,
  }),
  (req, res) => {
    const { id, email } = req.user;
    const token = generateJwt({ id, email });
    res.redirect(
      `${process.env.URL_REDIRECT}/auth/social_media?token=${token}`
    );
  }
);

module.exports = router;
