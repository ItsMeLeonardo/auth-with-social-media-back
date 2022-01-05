const bcrypt = require("bcrypt");
const userExtractor = require("../middlewares/userExtractor");
const router = require("express").Router();
const User = require("../models/User");
const multer = require("multer");
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single("avatar");

const saveBlob = require("../services/saveBlob");

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

router.put("/edit", userExtractor, uploadStrategy, async (req, res) => {
  const id = req.idUser;
  const infoToUpdate = { ...req.body };

  try {
    const file = req.file;

    if (file) {
      const { originalname, buffer } = file;
      const [avatarUrl, error] = await saveBlob(originalname, buffer);

      if (error) {
        return res.status(400).json({ error: "cannot save your avatar" });
      }
      infoToUpdate.avatar = avatarUrl;
    }

    if (infoToUpdate.password) {
      infoToUpdate.password = await bcrypt.hash(infoToUpdate.password, 10);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { ...infoToUpdate },
      { new: true }
    );

    res.status(200).json(user);
  } catch (err) {
    console.log({ err });
    return res.status(401).json({ error: err.message });
  }
});

module.exports = router;
