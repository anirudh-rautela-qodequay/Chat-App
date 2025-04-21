import { Server } from "socket.io";
import { Server as HttpServer } from "http";
const socketFile = (server: HttpServer) => {
  // console.log("Socket file here");
  const emailToSocketId = new Map<string, string>();
  const socketIdToEmail = new Map<string, string>();

  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://ins-verbal-triangle-der.trycloudflare.com",
      ],
      methods: ["GET", "POST"],
      credentials: true, // cookie,headers
    },
  });

  io.on("connection", (socket) => {
    console.log("User Connected");
    console.log("Id", socket.id);

    socket.on("message", ({ room, message }) => {
      console.log({ room, message });
      io.to(room).emit("reveive-message", message);
    });

    socket.on("Room:Join", (data) => {
      const { email, room } = data;
      emailToSocketId.set(email, socket.id);
      socketIdToEmail.set(socket.id, email);
      console.log({ email, room });
      socket.join(room);
      // Get all socket IDs in the room
      const roomSockets = io.sockets.adapter.rooms.get(room);
      const usersInRoom = [];

      if (roomSockets) {
        for (const socketId of roomSockets) {
          // const userSocket = io.sockets.sockets.get(socketId);
          // console.log("userSocket",userSocket)
          usersInRoom.push({
            email: socketIdToEmail.get(socketId),
            id: socketId,
          }); // You can customize with more data if you store it
        }
      }

      console.log("Users in room: ", room, " =>", usersInRoom);
      if (usersInRoom.length > 1) {
        socket.to(room).emit("User:Joined", { email, id: socket.id });
      }
      io.to(socket.id).emit("Room:Join", data);
    });
    socket.on("User:Call", ({ to, offer }) => {
      io.to(to).emit("User:Incomming Call", { from: socket.id, offer });
    });
    socket.on("User:Call Accepted", ({ to, ans }) => {
      io.to(to).emit("User:Call Accepted", { from: socket.id, ans });
    });
    socket.on("peer:nego:needed", ({ to, offer }) => {
      console.log("peer:nego:needed", offer);
      io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    });

    socket.on("peer:nego:done", ({ to, ans }) => {
      console.log("peer:nego:done", ans);
      io.to(to).emit("peer:nego:final", { from: socket.id, ans });
    });
    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  });
};
export default socketFile;
