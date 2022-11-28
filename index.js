// const http = require("http");
// const express = require("express");
// const cros = require("cors");
// const socketIO = require("socket.io");
// const { log } = require("console");

// const app = express();
// const port =process.env.PORT;
// const users = [{}];

// app.use(cros());
// app.get("/", (req, res) => {
//   res.send("HELL ITS WORKING");
// });

// const server =http.createServer(app);

// const io = socketIO(server);
// let clients = 0;
// io.on("connection", (socket) => {
//   console.log("New Connection ");
//   clients++;
//   io.sockets.emit("broadcast", { clients });
//   socket.on("disconnect", function () {
//     clients--;
//     io.sockets.emit("broadcast", { clients });
//   });
//   socket.on("joined", ({ user }) => {
//     users[socket.id] = user;
//     // console.log(`${user} has joined`);
//     socket.emit("welcome", {
//       user: "Admin",
//       message: `welcome to the chat ${users[socket.id]}`
//     });
//     io.sockets.emit("joinandleft", {
//       user: "Admin",
//       message: `${user} has joined`,
//       m: user
//     });
//     socket.on("disconnect", function () {
//       io.sockets.emit("joinandleft", {
//         user: "Admin",
//         message: `${user} has left`,
//         m: user
//       });
//     });

//   });
//   socket.on("message", ({ message, id }) => {
//     io.emit("sentMessage", { user: users[id], message, id });
//   });
//   socket.on("disconnect", () => {
//     console.log(`${users[socket.id]} has left`);
//   });
// });

// server.listen(port, () => {
//   console.log(`http://localhost:4000`);
// });

// const http = require("http");
// const express = require("express");
// const cros = require("cors");
// const socketIO = require("socket.io");
// const { log } = require("console");

// const app = express();
// const port =process.env.PORT;
// const users = [{}];

// app.use(cros());
// app.get("/", (req, res) => {
//   res.send("HELL ITS WORKING");
// });

// const server = http.createServer(app);

// const io = socketIO(server);
// var clients = 0;
// io.on("connection", (socket) => {
//   console.log("New Connection ");
//   var online = Object.keys(io.engine.clients);
//   io.emit('server message', JSON.stringify(online));

//   socket.on('disconnect', function(){
//     var online = Object.keys(io.engine.clients);
//     io.emit('server message', JSON.stringify(online));
//     });
//   clients++;
//   io.sockets.emit("broadcast", { clients });
//   socket.on("disconnect", function () {
//     clients--;
//     io.sockets.emit("broadcast", { clients });
//   });
//   socket.on("joined", ({ user }) => {
//     users[socket.id] = user;
//     console.log(`${user} has joined`);

//     io.sockets.emit("joinandleft", {
//       user: "Admin",
//       message: `${user} has joined`,
//       j: user
//     });
//     socket.on("disconnect", function () {
//       io.sockets.emit("joinandleft", {
//         user: "Admin",
//         message: `${user} has left`,
//         l: user
//       });
//     });
//     socket.emit("welcome", {
//       user: "Admin",
//       message: `welcome to the chat ${users[socket.id]}`
//     });
//   });
//   socket.on("message", ({ message, id }) => {
//     io.emit("sentMessage", { user: users[id], message, id });
//   });
//   socket.on("disconnect", () => {
//     console.log(`${users[socket.id]} has left`);
//   });
// });

// server.listen(port, () => {
//   console.log(`http://localhost:${port}`);
// });

const http = require("http");
const express = require("express");
const cros = require("cors");
const socketIO = require("socket.io");
const { log } = require("console");
// const { addUser, removeUser, getUser,getUsersInRoom } = require("./users");

const users1 = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();
  const existingUser = users1.find((user) => {
    user.room === room && user.name === name;
  });
  if (existingUser) {
    return { error: "Username is taken" };
  }
  const user = { id, name, room };
  users1.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users1.findIndex((user) => {
    user.id === id;
  });

  if (index !== -1) {
    return users1.splice(index, 1)[0];
  }
};

const getUser = (id) => users1.find((user) => user.id === id);
const getUsersInRoom = (room) => users1.filter((user) => user.room === room);


//----------------------------------------------------->
const app = express();
const port =process.env.PORT;
const users = [{}];

app.use(cros());
app.get("/", (req, res) => {
  res.send("HELL ITS WORKING");
});



var server = http.createServer(app);
const expressWs = require('express-ws')(app);

const io = socketIO(server);
var clients = 0;
io.on("connection", (socket) => {
  // const { error, user } = addUser({ id: socket.id, name, room });

  console.log("New Connection ");
  var online = Object.keys(io.engine.clients);
  io.emit("server message", JSON.stringify(online));

  socket.on("disconnect", function () {
    var online = Object.keys(io.engine.clients);
    io.emit("server message", JSON.stringify(online));
  });
  clients++;
  io.sockets.emit("broadcast", { clients });
  socket.on("disconnect", function () {
    clients--;
    io.sockets.emit("broadcast", { clients });
  });
  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    console.log(`${user} has joined`);

    io.sockets.emit("joinandleft", {
      user: "Admin",
      message: `${user} has joined`,
      j: user
    });
    socket.on("disconnect", function () {
      // const user = removeUser(socket.id); //----------------------------------------------------------------------------------------------
      io.sockets.emit("joinandleft", {
        user: "Admin",
        message: `${user} has left`,
        l: user
      });
    });
    socket.emit("welcome", {
      user: "Admin",
      message: `welcome to the chat ${users[socket.id]}`
    });

    // io.to(user.room).emit("roomData", {
    //   //-------------------------------------------------------------------------------------------------
    //   room: user.room,
    //   users: getUsersInRoom(user.room)
    // });
  });

  socket.on("onlinename", ({ nameOnline }) => {
    console.log(nameOnline);
    io.emit("finalname", { nameOnline });
  });
  socket.on("message", ({ message, id }) => {
    const user = getUser(socket.id); //-----------------------------------------------------------
    io.emit("sentMessage", { user: users[id], message, id });

    // io.to(user.room).emit("roomData", {
    //   //-----------------------------------------------
    //   room: user.room,
    //   users: getUsersInRoom(user.room)
    // });
  });
  socket.on("disconnect", () => {
    console.log(`${users[socket.id]} has left`);
  });
});

server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});




