/* eslint-disable no-param-reassign */
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, minLength: 3 },
  name: { type: String, required: true },
  password: { type: String, required: true },
  blogs: [{ type: mongoose.Types.ObjectId, ref: "Blogs" }],
});

userSchema.set("toJSON", {
  transform: (document, returnedDocument) => {
    returnedDocument.id = returnedDocument._id.toString();
    delete returnedDocument._id;
    delete returnedDocument.password;
    delete returnedDocument.__v;
  },
});

const User = mongoose.model("Users", userSchema);

module.exports = User;
