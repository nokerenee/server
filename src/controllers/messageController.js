const message = require("../models/message");

// Create a new room and save it to the database (if needed)
const fetchMessagesByRoomId = async ( roomId) => {
  try {
    // Check if the room is taken in the database
    const messages = await message.find({room: roomId
    });
    console.log("Room saved to the database");
    return messages;
  } catch (error) {
    console.error("Error saving room to the database:", error);
    return { error: "Failed to save room to the database" };
  }
};

module.exports = { fetchMessagesByRoomId };
