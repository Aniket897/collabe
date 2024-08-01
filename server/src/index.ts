import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { v4 } from "uuid";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// temp map
const map = new Map();

io.on("connection", (socket) => {
  console.log("new connection", socket.id);

  socket.on("create", ({ userId, username }) => {
    const newRoomID = v4();
    const newRoom = {
      owner: userId,
      data: [],
      users: [{ userId, username, socketId: socket.id }],
    };

    console.log(newRoomID, newRoom);
    map.set(newRoomID, newRoom);
    io.to(socket.id).emit("joined", {
      sessionId: newRoomID,
    });
  });

  // socket.on("join", ({ userId, sessionId }) => {});

  // disconnetion
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
