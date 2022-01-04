const router = require("express").Router();
const passport = require("passport");
const generateJwt = require("../utils/generateJwt");

require("../socialMediaAuth/facebook")();

router.get("/", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/callback",
  passport.authenticate("facebook", { failureRedirect: "/fail" }),
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
