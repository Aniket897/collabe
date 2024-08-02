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

  socket.on("join", ({ userId, username, sessionId }) => {
    if (map.has(sessionId)) {
      const room = map.get(sessionId);
      room.users.push({ userId, username, socketId: socket.id });
      map.set(sessionId, room);

      io.to(socket.id).emit("joined", {
        sessionId,
      });

      room.users.forEach((user: { socketId: string | string[] }) => {
        if (user.socketId !== socket.id) {
          io.to(user.socketId).emit("user-joined", {
            userId,
            username,
          });
        }
      });
    } else {
      console.error(`Session ${sessionId} not found`);
      io.to(socket.id).emit("error", {
        message: "Session not found",
      });
    }
  });

  socket.on("drawing", ({ data, sessionId, userId }) => {
    console.log(userId, "is drawing");
    const room = map.get(sessionId);

    if (room) {
      room.data = data;
      map.set(sessionId, room);

      room.users.forEach((user: { socketId: string | string[] }) => {
        // console.log(user)
        if (user.socketId !== socket.id) {
          io.to(user.socketId).emit("drawing", {
            userId,
            data,
          });
        }
      });
    }
  });

  // disconnetion
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
