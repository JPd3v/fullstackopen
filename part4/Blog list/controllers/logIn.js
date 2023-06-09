const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = require("express").Router();
const User = require("../models/user");

router.post("/", async (request, response) => {
  const { username, password } = request.body;

  const foundUser = await User.findOne({ username });
  const isPasswordCorrect = foundUser === null ? false : await bcrypt.compare(password, foundUser.password);

  if (!foundUser || !isPasswordCorrect) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username: foundUser.username,
    id: foundUser._id,
  };

  const newToken = jwt.sign(userForToken, process.env.JWT_SECRET);
  return response
    .status(200)
    .json({ token: newToken, username: foundUser.username, name: foundUser.name });
});

module.exports = router;
