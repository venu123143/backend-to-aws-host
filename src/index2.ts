import { Server } from "socket.io";

// interface Options {
//     origin: string[];
//     credentials: boolean;
//     withCredentials: boolean;
//     optionSuccessStatus: number;
// }
// const options: Options = {
//     origin: ['http://localhost:3000', 'http://localhost:5173'],
//     credentials: true,
//     withCredentials: true,
//     optionSuccessStatus: 200,
// }

// track mail to room
const emailToSocketMap = new Map();
const socketIdToEmailMap = new Map();

const io = new Server(8000, { cors: { origin: "*" } });
io.on("connection", (socket) => {
  console.log("socket connected with id ", socket.id);

  socket.on("send-message", (message, room) => {
    if (room === "") {
      console.log(message);
      socket.broadcast.emit("recieve-msg", message);
    } else {
      socket.to(room).emit("recieve-msg", message);
    }
  });
  socket.on('join-room',(room)=>{
        socket.join(room)
  })

  socket.on("room:join", (data) => {
    console.log(data);
    const { email, room } = data;
    emailToSocketMap.set(email, socket.id);
    socketIdToEmailMap.set(socket.id, email);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);

    io.to(socket.id).emit("room:join", data);
  });
  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });
  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { to: socket.id, ans });
  });
  socket.on("peer:nego:needed", ({ to, offer }) => {
    io.to(to).emit("call-accepted", { from: socket.id, offer });
  });
  socket.on("peer:nego:done", ({ to, ans }) => {
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });
});
