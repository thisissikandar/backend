import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

// Routes
import authRoutes from "./routes/auth.routes.js";
import orderRoutes from "./routes/order.routes.js";
import connectDB from "./db/connectDB.js";
import logger from "./logger/winston.logger.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
console.log("Socket.io server initialized");

// Middleware
app.use(cors({
  origin:"https://frontend-egxb.vercel.app"
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log("Setting req.io"); // Debug log
  req.io = io;
  next();
});
// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
connectDB()
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    logger.error("server starting error", err);
  });
