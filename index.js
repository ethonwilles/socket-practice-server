const express = require("express");
const socket = require("socket.io");

const app = express();
const server = app.listen(5000, () => {
  console.log("Listening on port 5000");
});

const io = socket(server);
let connectedUsers = {};

io.on("connection", socket => {
  console.log(`Made connection to socket: ${socket.id}`);
  socket.on("private_chat", data => {
    if (connectedUsers[socket.id] !== undefined) {
      for (item in connectedUsers) {
        if (connectedUsers[item].username === data.to) {
          connectedUsers[item].emit("private_message", {
            message: { msg: data.message, id: "res" }
          });
        }
      }
      //   io.sockets.emit("private_chat", {
      //     messageRecv: { msg: data.message, id: "recv" },
      //     messageBack: { msg: "working", id: "res" }
      //   });
    } else if (connectedUsers[socket.id] === undefined) {
      connectedUsers[socket.id] = socket;

      socket.username = data.username;
    }
  });
  socket.on("disconnect", data => {
    console.log(`socket ${socket.id} has disconnected.`);

    delete connectedUsers[socket.id];
  });
});
