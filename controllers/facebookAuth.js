const router = require("express").Router();
const passport = require("passport");

require("../socialMediaAuth/facebook")();

router.get("/", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/callback",
  passport.authenticate("facebook", { failureRedirect: "/fail" }),
  (req, res) => {
    const user = req.user;
    res.status(200).json(user);
  }
);

module.exports = router;
