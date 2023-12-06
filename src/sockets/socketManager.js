const { Server } = require("socket.io");
const { addUser } = require("../controllers/userController");
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

  const handleJoinRoom = async (socket, data, callback) => {
    try {
      const { user, error } = await addUser(data.username);
      if (error) {
        console.error("Error adding user:", error);
        socket.emit("join_error", { error });
      } else {
        const room = await addRoom(data.room);
        console.log('data.room', data.room);
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
  

  const handleSendMessage = async (socket, data) => {
    console.log("data", data);
  
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
    console.log(`Broadcasting message to room: ${data.room.name}`);
    // todo: figure out why this doesn't emit
    const sockets = await io.in(data.room.name).fetchSockets();
    // const users = io.sockets.clients(data.room._id);
    console.log('socketIds',sockets.map(s=>s.id));
    socket.to(data.room.name).emit("receive_message", data);
  };
  
  const handleGetMessages = async (socket, room, callback) => {
    try {
      const messages = await fetchMessagesByRoomId(room._id);
      callback(messages);
    } catch (error) {
      console.error("Error fetching previous messages:", error);
    }
  };
  

  io.on("connection", async (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", async (data, callback) => {
      await handleJoinRoom(socket, data, callback);
      callback({ success: true, message: "Successfully joined the room" });
    });

    socket.on("send_message", async (data) => {
      await handleSendMessage(socket, data);
    });

    socket.on("get_messages", async (room, callback) => {
      await handleGetMessages(socket, room, callback);
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = configureSocket;
