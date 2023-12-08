// Created a model named "Message" including message with content, 
// a sender reference to the "User" model, 
// room reference to the "ChatRoom" model

const mongoose = require("mongoose");
const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const messageSchema = new mongoose.Schema(
  {
    // Content of message
    message: { type: String },
    // Sender of message, reference to "User" model
    sender: { type: ObjectId, ref: "User", required: true },
    // Chat room where message belongs, reference to "ChatRoom" model
    room: { type: ObjectId, ref: "ChatRoom" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
