// sockets/socketManager.js
const { Server } = require("socket.io");
const { addUser } = require("../controllers/userController"); // Import user controller or functions for interacting with the database
const Message = require("../models/message");
const { addRoom } = require("../controllers/roomController");
const { fetchMessagesByRoomId } = require("../controllers/messageController");

const configureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", async (data, callback) => {
      try {
        const { user, error } = await addUser(data.username);
        if (error) {
          // Handle error, send an error message to the user, etc.
          console.log(error);
          socket.emit("join_error", { error });
        } else {
          const room = await addRoom(data.room);
          socket.join(data.room);
          console.log(room);
          console.log(`User with ID: ${socket.id} joined room: ${data}`);
          // Broadcast to everyone in the room that a new user has joined
          callback({ user, room });
          // io.to(data.room).emit("user_joined", { user });
        }
      } catch (error) {
        console.log("Error joining room:", error);
        socket.emit("join_error", { error: "Internal server error" });
      }
    });

    socket.on("send_message", async (data) => {
      console.log("data", data);

      // Save the new message to the database
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

      // Broadcast the new message to other clients in the same room
      socket.to(data.room).emit("receive_message", data);
    });

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

  return io;
};

module.exports = configureSocket;
