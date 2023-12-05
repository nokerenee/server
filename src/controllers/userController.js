const User = require("../models/user");

// Create a new user and save it to the database (if needed)
const addUser = async (username) => {
  try {
    // Check if the username is taken in the database
    const existingUser = await User.findOne({
      name: { $regex: new RegExp(`^${username}$`, "i") }, // Case-insensitive regex
    });

    if (existingUser) {
      return { error: "Username has already been taken" };
    }

    let user = await User.findOneAndUpdate(
      { username },
      { $set: { is_active: true } },
      { new: true, upsert: true } // Create if not exists
    );

    if (!user) {
      user = new User({ username, is_active: true });
      await user.save();
    }

    console.log("User saved to the database");
    return { user };
  } catch (error) {
    if (error.code === 11000) {
      console.log(`Username ${username} is already taken`);
      return { error: "Username is already taken" };
    }
    console.error("Error saving user to the database:", error);
    return { error: "Failed to save user to the database" };
  }
};

const getUser = async (id) => {
  try {
    const user = await User.findOne({ id });
    return user;
  } catch (error) {
    console.error("Error getting user from the database", error);
    return null;
  }
};

const deleteUser = async (id) => {
  try {
    const deleteUser = await User.findOneAndDelete({ id });
    return deleteUser;
  } catch (error) {
    console.error("Error deleting user from the database", error);
    return null;
  }
};

const getUsers = async (room) => {
  try {
    const users = await User.find({ room });
    return users;
  } catch (error) {
    console.error("Error getting users from the database", error);
    return [];
  }
};

module.exports = {
  addUser,
  getUser,
  deleteUser,
  getUsers,
};
