const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Unique, lowercase username for the user
    username: { type: String, lowercase: true, required: true, unique: true },
    // Indicates whether the user is currently active
    is_active: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);