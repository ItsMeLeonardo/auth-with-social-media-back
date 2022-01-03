const router = require("express").Router();
const passport = require("passport");

require("../socialMediaAuth/twitter")();

router.get("/", passport.authenticate("twitter"));

router.get(
  "/callback",
  passport.authenticate("twitter", {
    failureRedirect: "/fail_uwu",
  }),
  (req, res) => {
    const user = req.user;
    res.status(200).json(user);
  }
);

module.exports = router;
