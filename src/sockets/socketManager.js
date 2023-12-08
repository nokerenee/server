// configures a Socket.IO server, defines event handlers for user actions such as joining a room, sending messages, and retrieving existing messages, and then exports the configured socket for use in a Node.js application

const { Server } = require("socket.io");
const { addUser } = require("../controllers/userController");
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

  // Function to handle user joining room
  const handleJoinRoom = async (socket, data, callback) => {
    try {
      // Attempt to add user to specified room
      const { user, error } = await addUser(data.username);
      if (error) {
        console.error("Error adding user:", error);
        socket.emit("join_error", { error });
      } else {
        // Add user to room, join room, and notify other users
        const room = await addRoom(data.room);
        console.log("data.room", data.room);
        socket.join(data.room);
        console.log(`User with ID: ${socket.id} joined room: ${data.room}`);
        callback({ user, room });
        socket.to(data.room).emit("user_joined", { user });
      }
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("join_error", { error: "Internal server error" });
    }
  };

  // Function to handle sending new message
  const handleSendMessage = async (socket, data) => {
    console.log("data", data);

    try {
      // Save new message to database
      const newMessage = new Message({
        message: data.message,
        sender: data.sender._id,
        room: data.room._id,
      });
      await newMessage.save();
    } catch (error) {
      console.error("Error saving new message:", error);
    }

    // Broadcast new message to other clients in same room
    console.log(`Broadcasting message to room: ${data.room.name}`);
    const sockets = await io.in(data.room.name).fetchSockets();
    // const users = io.sockets.clients(data.room._id);
    console.log(
      "socketIds",
      sockets.map((s) => s.id)
    );
    socket.to(data.room.name).emit("receive_message", data);
  };

  // Function to handle retrieving existing messages in room
  const handleGetMessages = async (socket, room, callback) => {
    try {
      // Fetch existing messages in specified room and invoke callback
      const messages = await fetchMessagesByRoomId(room._id);
      callback(messages);
    } catch (error) {
      console.error("Error fetching previous messages:", error);
    }
  };

  // Event handler for new client connection
  io.on("connection", async (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Event handler for user joining room
    socket.on("join_room", async (data, callback) => {
      await handleJoinRoom(socket, data, callback);
      callback({ success: true, message: "Successfully joined the room" });
    });

    // Event handler for sending new message
    socket.on("send_message", async (data) => {
      await handleSendMessage(socket, data);
    });

    // Event handler for user requesting existing messages in room
    socket.on("get_messages", async (room, callback) => {
      await handleGetMessages(socket, room, callback);
    });

    // Event handler for client disconnection
    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);
    });
  });

  // Return configured socket
  return io;
};

module.exports = configureSocket;
