// controllers define functions for interacting with a MongoDB database using Mongoose models

const message = require("../models/message");

// defines function to retrieve messages associated with a specific room
const fetchMessagesByRoomId = async (roomId) => {
  try {
    const messages = await message.find({ room: roomId });
    // Log a success message
    console.log("Room saved to the database");
    // Return fetched messages
    return messages;
  } catch (error) {
    console.error("Error saving room to the database:", error);
    return { error: "Failed to save room to the database" };
  }
};

module.exports = { fetchMessagesByRoomId };
