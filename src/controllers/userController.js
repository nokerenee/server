const User = require("../models/user");

// Defines functions to create new user
const addUser = async (username) => {
  try {
    // Check if username is taken in database
    const existingUser = await User.findOne({
      name: { $regex: new RegExp(`^${username}$`, "i") }, // Case-insensitive regex
    });

    if (existingUser) {
      // If username taken, return error
      return { error: "Username has already been taken" };
    }

    // Try to find the user by username
    let user = await User.findOneAndUpdate(
      { username },
      { $set: { is_active: true } },
      { new: true, upsert: true }
    );

    // If doesn't exist, create new user and save to the database
    if (!user) {
      user = new User({ username, is_active: true });
      await user.save();
    }

    console.log("User saved to the database");
    return { user };
  } catch (error) {
    // Handle specific error code indicating duplicate username
    if (error.code === 11000) {
      console.log(`Username ${username} is already taken`);
      return { error: "Username is already taken" };
    }
    console.error("Error saving user to the database:", error);
    return { error: "Failed to save user to the database" };
  }
};

// Fetch a user by ID
const getUser = async (id) => {
  try {
    const user = await User.findOne({ _id: id });
    return user;
  } catch (error) {
    console.error("Error getting user from the database", error);
    return null;
  }
};

// const deleteUser = async (id) => {
//   try {
//     const deleteUser = await User.findOneAndDelete({ id });
//     return deleteUser;
//   } catch (error) {
//     console.error("Error deleting user from the database", error);
//     return null;
//   }
// };

// Retrieves users in specified room
const getUsers = async (room) => {
  try {
    const users = await User.find({ room: room });
    return users;
  } catch (error) {
    console.error("Error getting users from the database", error);
    return [];
  }
};

module.exports = {
  addUser,
  getUser,
  // deleteUser,
  getUsers,
};
