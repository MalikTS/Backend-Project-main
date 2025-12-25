const { Schema, model, default: mongoose } = require("mongoose");

const User = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: [{ type: String, ref: "Role" }],
  avatar: { type: String },
});

module.exports = mongoose.model("User", User);
