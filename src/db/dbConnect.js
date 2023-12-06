"use strict";

const Mongoose = require("mongoose");

// Define MongoDB connection URI
const uri =
  process.env.DB_URI || // Use provided environment variable or
  `mongodb://dbadmin:Password1@localhost:27018/chatDB?authSource=admin`; // default values

//Connect to MongoDB
Mongoose.connect(uri)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log("MongoDB Error: " + error.message));

// Get the default connection
const db = Mongoose.connection;

// Bind connection to error event
db.on("error", console.error.bind(console, "MongoDB connection error:"));

exports.Mongoose = Mongoose;
