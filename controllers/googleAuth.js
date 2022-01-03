const router = require("express").Router();
const passport = require("passport");

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
    res.status(200).json(req.user);
  }
);

module.exports = router;
