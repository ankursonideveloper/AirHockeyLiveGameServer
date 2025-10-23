import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import authRoutes from "./routes/authRoutes.js";
import {
  addPlayerInAvailablePlayers,
  fetchAllAvailableUsers,
  deletePlayerFromAvailablePlayers,
} from "./Services/realTimeServices/realTimeServices.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error: No token provided."));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid token."));
  }
});

io.on("connection", async (socket) => {
  console.log("A client connected:", socket.user);
  await addPlayerInAvailablePlayers(socket.user.id, socket.id);

  const allAvailablePlayers = await fetchAllAvailableUsers();
  io.emit("availableUsersUpdate", allAvailablePlayers);
  console.log(`All Players: ${allAvailablePlayers}`);

  socket.on("messageFromClient", (data) => {
    console.log("Received from frontend:", data);
  });

  socket.on("disconnect", async () => {
    await deletePlayerFromAvailablePlayers(socket.user.id);
    console.log("Client disconnected:", socket.id);
  });
});

httpServer.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
