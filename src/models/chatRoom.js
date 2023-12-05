const mongoose = require("mongoose");
const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const chatRoomSchema = new mongoose.Schema(
  {
    // Unique, lowercase name of the chat room
    name: { type: String, unique: true, lowercase: true },
    // Array of users associated with the chat room
    users: [{ type: ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ChatRoom", chatRoomSchema);
