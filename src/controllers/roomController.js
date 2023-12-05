const chatRoom = require("../models/chatRoom");

// Create a new room and save it to the database (if needed)
const addRoom = async (name) => {
  try {
    // Check if the room is taken in the database
    const existingRoom = await chatRoom.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // Case-insensitive regex
    });

    if (existingRoom) {
      return existingRoom;
    }

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
