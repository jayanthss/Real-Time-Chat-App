import { Server } from "socket.io";

export const initializeSocket = (server) => {
 
 const onlineUsers = new Map();
 
 const io = new Server(server, {
   cors: {
     origin: "*",
     methods: ["GET", "POST"],
     credentials: true,
   },
 });
 
 io.on("connection", (socket) => {
 
 
   // Join Room
   socket.on("join-room", (roomid) => {
    //  console.log("someone id connected to socket",roomid)
     socket.join(roomid);
   });
 
   // Online users
   socket.on("add-user", (userId) => {
     onlineUsers.set(userId, socket.id);
     io.emit("online-users", [...onlineUsers.keys()]);
   });
 
   // Messaging
   socket.on("send-msg", (data) => {
     const sendUserSocket = onlineUsers.get(data.to);
     if (sendUserSocket) {
       socket.to(sendUserSocket).emit("msg-recieve", data.message);
     }
   });
 
   // Video Call
   socket.on("video-call", (from_to) => {
     const sendUserSocket = onlineUsers.get(from_to.reciver);
 
     if (sendUserSocket && io.sockets.sockets.get(sendUserSocket)) {
       socket.to(sendUserSocket).emit("video-call-by-someone", {
         from: from_to.caller,
         callerSocketId: socket.id,
       });
     }
   });
 
   socket.on("ready-to-get-offer", (roomId) => {
     socket.to(roomId).emit("reciver-ready", "yes");
   });
 
 
   socket.on("offer", (roomId, offer) => {
    //  console.log("Entered to offer")
     socket.to(roomId).emit("offer", offer);
   });
 
   socket.on("answer", (roomId, answer) => {
    //  console.log("entered to answer")
     socket.to(roomId).emit("answer", answer);
   });
 
   socket.on("ice-candidate", (roomId, candidate) => {
    //  console.log("enterd to ice-candate")
     socket.to(roomId).emit("candiate", candidate);
   });
 
   // Disconnect
   socket.on("disconnect", () => {
     for (let [userId, socketId] of onlineUsers.entries()) {
       if (socketId === socket.id) {
         onlineUsers.delete(userId);
         break;
       }
     }
     io.emit("online-users", [...onlineUsers.keys()]);
   });
 });

  return io;
};
