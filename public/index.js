const socket = io();

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("newMessage", message => {
    console.log(message);
  });

  socket.emit("createdMessage", {
    from: "hagrid@hogwarts",
    text: "get here you",
    createdAt: Date.toString()
  });
});
