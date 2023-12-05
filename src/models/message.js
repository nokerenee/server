const mongoose = require("mongoose");
const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const messageSchema = new mongoose.Schema(
  {
    // Content of the message
    message: { type: String },
    // Sender of the message (reference to User)
    sender: { type: ObjectId, ref: "User", required: true },
    // Chat room to which the message belongs (reference to ChatRoom)
    room: { type: ObjectId, ref: "ChatRoom" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
