// sockets/socketManager.js
const { Server } = require("socket.io");
const { addUser } = require("../controllers/userController"); // Import user controller or functions for interacting with the database
const Message = require("../models/message");
const { addRoom } = require("../controllers/roomController");
const { fetchMessagesByRoomId } = require("../controllers/messageController");

// Function to configure the socket and handle socket events
const configureSocket = (server) => {
  // Create new instance of Socket.IO server
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  // Handle connection event when new user connects
  io.on("connection", async (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Handle event when user joins a room
    socket.on("join_room", async (data, callback) => {
      try {
        // Add user to database and handle any errors
        const { user, error } = await addUser(data.username);
        if (error) {
          console.log(error);
          socket.emit("join_error", { error });
        } else {
          // Add room to database, join socket to room, and broadcast user join
          const room = await addRoom(data.room);
          socket.join(data.room);
          console.log(room);
          console.log(`User with ID: ${socket.id} joined room: ${data}`);
          // Broadcast to everyone in room that a new user joined
          callback({ user, room });
        }
      } catch (error) {
        console.log("Error joining room:", error);
        socket.emit("join_error", { error: "Internal server error" });
      }
    });

    // Handle event when user sends a message
    socket.on("send_message", async (data) => {
      console.log("data", data);

      // Save new message to database
      try {
        const newMessage = new Message({
          message: data.message,
          sender: data.sender._id,
          room: data.room._id,
        });
        await newMessage.save();
      } catch (error) {
        console.error("Error saving new message:", error);
      }

      // Broadcast new message to other clients in the same room
      socket.to(data.room).emit("receive_message", data);
    });

    // Handle event when user requests existing messages in room
    socket.on("get_messages", async (room, callback) => {
      try {
        const messages = await fetchMessagesByRoomId(room._id);
        callback(messages);
      } catch (e) {
        console.log(e);
      }
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);
    });
  });

  // Return configured socket
  return io;
};

module.exports = configureSocket;
