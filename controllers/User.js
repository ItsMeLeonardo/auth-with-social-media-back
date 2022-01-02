const bcrypt = require("bcrypt");
const router = require("express").Router();
const User = require("../models/User");

router.post("/", async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    username,
    email,
    passwordHash,
  });
  try {
    const savedUser = await user?.save();
    res.json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
