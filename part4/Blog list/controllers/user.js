const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");

router.post("/", async (req, res, next) => {
  const { username, password, name } = req.body;

  if (password.length < 3) {
    return res
      .status(400)
      .json({ error: "password should be at least 3 characters long" });
  }
  try {
    const usernameAlreadyInUse = await User.findOne({ username });
    if (usernameAlreadyInUse) {
      return res.status(400).json({ error: "username is already in use" });
    }

    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      password: hashedPassword,
      name,
    });

    await newUser.save();
    return res.status(201).json(newUser);
  } catch (error) {
    return next(error);
  }
});
router.get("/", async (req, res, next) => {
  try {
    const userList = await User.find({}).populate("blogs");

    return res.status(200).json(userList);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
