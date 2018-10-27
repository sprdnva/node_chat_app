const socket = io();

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("newMessage", message => {
    console.log(message);
    const li = $("<li></li>");
    li.text(`${message.from}: ${message.text}`);
    $("#message-list").append(li);
  });
});

$("#message-form").on("submit", e => {
  e.preventDefault();

  socket.emit(
    "createdMessage",
    {
      from: "user",
      text: $("[name=message]").val()
    },
    response => {
      console.log(response);
    }
  );
});
