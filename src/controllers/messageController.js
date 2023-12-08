// defines a function fetchMessagesByRoomId that retrieves messages associated with a specific room from database

const message = require("../models/message");

// Create new room and save to database (if needed)
const fetchMessagesByRoomId = async (roomId) => {
  try {
    // Check if room is taken in database
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
