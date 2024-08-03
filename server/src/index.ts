import express , {Request , Response}  from "express";
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

// Health route
app.get("/health" , (req :Request , resp : Response ) => {
  resp.status(200).json({
    message : "Server is up and running"
  })
})

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// temp map for storing sessions
const map = new Map();

io.on("connection", (socket) => {
  console.log("new connection", socket.id);

  // creating a new room
  socket.on("create", ({ userId, username }) => {
    const newRoomID = v4();
    const newRoom = {
      owner: userId,
      data: [],
      messages: [],
      users: [{ userId, username, socketId: socket.id }],
    };
    map.set(newRoomID, newRoom);
    socket.join(newRoomID);
    io.to(socket.id).emit("joined", {
      sessionId: newRoomID,
      data: [],
    });
  });

  // joining existing room
  socket.on("join", ({ userId, username, sessionId }) => {
    if (map.has(sessionId)) {
      const room = map.get(sessionId);
      room.users.push({ userId, username, socketId: socket.id });
      map.set(sessionId, room);
      socket.join(sessionId);

      io.to(socket.id).emit("joined", {
        sessionId,
        data: room.data,
        users: room.users,
      });

      room.users.forEach((user: { socketId: string | string[] }) => {
        if (user.socketId !== socket.id) {
          io.to(user.socketId).emit("user-joined", {
            user: { userId, username, sessionId },
          });
        }
      });
    } else {
      io.to(socket.id).emit("error", {
        message: "Session not found",
      });
    }
  });

  // drawing on whiteboard
  socket.on("drawing", ({ data, sessionId, userId }) => {
    const room = map.get(sessionId);

    if (room) {
      room.data = data;
      map.set(sessionId, room);

      room.users.forEach((user: { socketId: string | string[] }) => {
        if (user.socketId !== socket.id) {
          io.to(user.socketId).emit("drawing", {
            userId,
            data,
          });
        }
      });
    }
  });

  // getting all connected users to a session
  socket.on("get-connected-users", ({ sessionId }) => {
    const room = map.get(sessionId);
    if (room) {
      io.to(socket.id).emit("get-connected-users", {
        users: room.users,
      });
    }
  });

  // handling Message
  socket.on("send-message", ({ userId, username, sessionId, text }) => {
    const room = map.get(sessionId);
    if (room) {
      room.messages = [...room.messages, { userId, username, sessionId, text }];
      map.set(sessionId, room);

      room.users.forEach((user: { socketId: string | string[] }) => {
        if (user.socketId !== socket.id) {
          io.to(user.socketId).emit("new-message", {
            username,
            text,
          });
        }
      });
    }
  });

  // getting all existing messages
  socket.on("sync-messages", ({ sessionId }) => {
    const room = map.get(sessionId);
    if (room) {
      io.to(socket.id).emit("sync-messages", {
        messages: room.messages,
      });
    }
  });

  // handling cursors
  socket.on("cursor-move", ({ username, userId, x, y, sessionId }) => {
    const room = map.get(sessionId);
    if (room) {
      room.users.forEach(
        (user: { userId: any; socketId: string | string[] }) => {
          if (user.userId !== userId) {
            io.to(user.socketId).emit("cursor-move", {
              username,
              userId,
              x,
              y,
            });
          }
        }
      );
    }
    socket.broadcast
      .to(sessionId)
      .emit("cursor-move", { userId, x, y, username });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);

    map.forEach((room, sessionId) => {
      const userIndex = room.users.findIndex(
        (user: { socketId: string }) => user.socketId === socket.id
      );
      if (userIndex !== -1) {
        const user = room.users.splice(userIndex, 1)[0];
        map.set(sessionId, room);

        room.users.forEach((remainingUser: { socketId: string | string[] }) => {
          io.to(remainingUser.socketId).emit("user-left", {
            userId: user.userId,
            username: user.username,
            sessionId,
          });
        });

        // Remove the room if no users are left
        if (room.users.length === 0) {
          map.delete(sessionId);
        }
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
