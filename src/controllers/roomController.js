const chatRoom = require("../models/chatRoom");

// Defines function to add room
const addRoom = async (name) => {
  try {
    // checks if already exists in database
    const existingRoom = await chatRoom.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // Case-insensitive regex
    });

    if (existingRoom) {
      // either return existing room
      return existingRoom;
    }

    // or save new room
    const room = new chatRoom({ name });
    await room.save();
    console.log("Room saved to the database");
    return room;
  } catch (error) {
    console.error("Error saving room to the database:", error);
    return { error: "Failed to save room to the database" };
  }
};

module.exports = { addRoom };
