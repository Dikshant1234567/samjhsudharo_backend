import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import individualUserRoutes from "./routes/individualUserRoutes.js";
import groupUserRoutes from "./routes/groupUserRoutes.js";
import ngoRoutes from "./routes/ngoRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import postEventRoutes from "./routes/postEventRoutes.js";
import postVlogRoutes from "./routes/postVlogRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Make io accessible in controllers
app.set("io", io);

// Connect to database (non-blocking). See MONGODB_SETUP.md for setup.
connectDB();

app.use(cors());
app.use(express.json());

// Simple test routes
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Real API routes
app.use("/api/individual", individualUserRoutes);
app.use("/api/group", groupUserRoutes);
app.use("/api/ngo", ngoRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/post-events", postEventRoutes);
app.use("/api/post-vlogs", postVlogRoutes);
app.use("/api/chats", chatRoutes);

// Note: /api/posts endpoints provided via postRoutes

// Socket.io for real-time notifications
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
  socket.on("chat:join", (chatId) => {
    if (chatId) socket.join(String(chatId));
  });
});

// Root route
app.get("/", (req, res) => res.send("Samaj Sudharo API is running in development mode"));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
}).on('error', (err) => {
  if(err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try a different port.`);
  } else {
    console.error('Server error:', err);
  }
});
