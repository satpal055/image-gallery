const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true },
    name: String,
    email: String,
    photo: String,
    provider: { type: String, default: "google" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
