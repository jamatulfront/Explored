import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

let activeUsers = [];

const addNewUser = (username, socketId) => {
  !activeUsers.some((user) => user.username === username) &&
    activeUsers.push({ username, socketId });
};

const removeUser = (socketId) => {
  activeUsers = activeUsers.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
  socket.on("user:active", (user) => {
    addNewUser(user.username, socket.id);
    io.emit("notifier:active-friends", {
      activeFriends: activeUsers,
    });
  });
  socket.on("message:send", ({ receiverSocketId, message }) => {
    io.to(receiverSocketId).emit("message:receive", {
      sender: "anymorus",
      message,
    });
  });
  socket.on("disconnect", () => {
    activeUsers.filter((usr) => {
      if (usr.socketId === socket.id) console.log(usr);
    });
    removeUser(socket.id);
    io.emit("notifier:active-friends", {
      activeFriends: activeUsers,
    });
  });
});

io.listen(8000);
