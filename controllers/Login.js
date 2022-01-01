const bcrypt = require("bcrypt");
const router = require("express").Router();
const User = require("../models/User");

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  const passwordIsValid =
    user && (await bcrypt.compare(password, user.passwordHash));

  if (!user || !passwordIsValid) {
    return res.status(401).send({ error: "Invalid credentials" });
  }

  res.status(200).json(user);
});

module.exports = router;
