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
    from: "julie@gotit",
    text: "hey",
    createdAt: Date.toString()
  });

  socket.on("createdMessage", message => {
    console.log(message);
  });
});

app.use(express.static(publicPath));

server.listen(port);
