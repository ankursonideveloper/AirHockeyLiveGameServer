import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

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

let availablePlayers = [
  { id: "p1", name: "Alice" },
  { id: "p2", name: "Bob" },
];

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("getAvailablePlayers", () => {
    socket.emit("availablePlayers", availablePlayers);
  });

  socket.on("addPlayer", (playerName) => {
    const newPlayer = {
      id: `p_${Date.now()}`,
      name: playerName,
    };
    availablePlayers.push(newPlayer);

    io.emit("availablePlayers", availablePlayers);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
