const path = require("path"),
  express = require("express"),
  http = require("http"),
  socketIO = require("socket.io");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on("connection", socket => {
  console.log("new user connected");
  socket.emit("newMessage", {
    form: "Admin",
    text: "Welcome to the chat app",
    createdAt: new Date().getTime().toString()
  });

  socket.broadcast.emit("newMessage", {
    from: "Admin",
    text: "New user joined",
    createdAt: new Date().getTime().toString()
  });

  socket.on("createdMessage", message => {
    console.log(message);
    io.emit("newMessage", {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime().toString()
    });
    // socket.broadcast.emit("newMessage", {
    //   from: "server",
    //   text: "broadcasting",
    //   createdAt: new Date().toLocaleDateString()
    // });
  });
});

app.use(express.static(publicPath));

server.listen(port);
