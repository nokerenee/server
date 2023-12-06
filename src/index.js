const dbConnect = require("./db/dbConnect");
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");

// Add Cross-Origin Resource Sharing (CORS) middleware
app.use(cors());

// Load environment variables from .env file
require("dotenv").config();

// Create HTTP server using Express
const server = http.createServer(app);

// Import Mongoose model schemas
const User = require("./models/user");
const Message = require("./models/message");
const ChatRoom = require("./models/chatRoom");

// Initialize and configure Socket.IO server
const configureSocket = require("./sockets/socketManager");
const io = configureSocket(server);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Use environment variable for server port
const PORT = process.env.PORT || 3001;

// Server listens on specified port
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
