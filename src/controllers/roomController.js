const chatRoom = require("../models/chatRoom");

// Create new room and save to the database
const addRoom = async (name) => {
  try {
    // Check if room already exists in database
    const existingRoom = await chatRoom.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // Case-insensitive regex
    });

    if (existingRoom) {
      // If already exists, return existing room
      return existingRoom;
    }

    // If doesn't exist, create new room
    const room = new chatRoom({ name });
    // Save new room to database
    await room.save();
    console.log("Room saved to the database");
    return room;
  } catch (error) {
    console.error("Error saving room to the database:", error);
    return { error: "Failed to save room to the database" };
  }
};

module.exports = { addRoom };
