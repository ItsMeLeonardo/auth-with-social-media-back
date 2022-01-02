const bcrypt = require("bcrypt");
const userExtractor = require("../middlewares/userExtractor");
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
    res.status(201).json(savedUser);
  } catch (error) {
    console.log({ error });
    res.status(400).json({ error: error.errors });
  }
});

router.get("/:id", userExtractor, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    console.log({ error });
    res.status(400).json({ error: error.errors });
  }
});

router.put("/edit", userExtractor, async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(401).json({ error: "Please enter all fields" });
  }
});

module.exports = router;
