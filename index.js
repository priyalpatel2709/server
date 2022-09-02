const http = require("http");
const express = require("express");
const cros = require("cors");
const socketIO = require("socket.io");
const { log } = require("console");

const app = express();
const port =process.env.PORT;
const users = [{}];

app.use(cros());
app.get("/", (req, res) => {
  res.send("HELL ITS WORKING");
});

const server =http.createServer(app);

const io = socketIO(server);
let clients = 0;
io.on("connection", (socket) => {
  console.log("New Connection ");
  clients++;
  io.sockets.emit("broadcast", { clients });
  socket.on("disconnect", function () {
    clients--;
    io.sockets.emit("broadcast", { clients });
  });
  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    // console.log(`${user} has joined`);
    socket.emit("welcome", {
      user: "Admin",
      message: `welcome to the chat ${users[socket.id]}`
    });
    io.sockets.emit("joinandleft", {
      user: "Admin",
      message: `${user} has joined`,
      m: user
    });
    socket.on("disconnect", function () {
      io.sockets.emit("joinandleft", {
        user: "Admin",
        message: `${user} has left`,
        m: user
      });
    });

  });
  socket.on("message", ({ message, id }) => {
    io.emit("sentMessage", { user: users[id], message, id });
  });
  socket.on("disconnect", () => {
    console.log(`${users[socket.id]} has left`);
  });
});

server.listen(port, () => {
  console.log(`http://localhost:4000`);
});


