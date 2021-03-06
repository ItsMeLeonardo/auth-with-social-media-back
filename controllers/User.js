const bcrypt = require("bcrypt");
const userExtractor = require("../middlewares/userExtractor");
const router = require("express").Router();
const User = require("../models/User");
const multer = require("multer");
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single("avatar");

const generateJwt = require("../utils/generateJwt");
const saveBlob = require("../services/saveBlob");

// register a new user
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
    avatar: process.env.DEFAULT_AVATAR,
  });

  try {
    const savedUser = await user?.save();
    const { id, email } = savedUser;
    const token = generateJwt({ id, email });
    res.status(201).json({ user: savedUser, token });
  } catch (error) {
    console.log({ error });
    res.status(400).json({ error: error.errors });
  }
});

// get data of user
router.get("/", userExtractor, async (req, res) => {
  const id = req.idUser;
  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    console.log({ error });
    res.status(400).json({ error: error.errors });
  }
});

// update user data
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
