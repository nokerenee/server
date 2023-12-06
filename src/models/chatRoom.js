const mongoose = require("mongoose");
// Destructure to extract Schema object from mongoose
const { Schema } = mongoose;
// Extract ObjectId type from Schema.Types
const ObjectId = Schema.Types.ObjectId;

const chatRoomSchema = new mongoose.Schema(
  {
    // Unique, lowercase name of the chat room
    name: { type: String, unique: true, lowercase: true },
    // Array of users associated with chat room, reference to "User" model
    users: [{ type: ObjectId, ref: "User" }],
  },
  {
    timestamps: true, // Automatically generate createdAt and updatedAt timestamps
  }
);

module.exports = mongoose.model("ChatRoom", chatRoomSchema);
