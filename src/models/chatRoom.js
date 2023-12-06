const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema(
  {
    // Unique, lowercase name of the chat room
    name: { type: String, unique: true, lowercase: true }
  },
  {
    timestamps: true, // Automatically generate createdAt and updatedAt timestamps
  }
);

module.exports = mongoose.model("ChatRoom", chatRoomSchema);
