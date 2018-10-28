const socket = io();

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("newMessage", message => {
    const formattedTime = moment(message.createdAt).format("h:mm a");
    console.log(message);
    const li = $("<li></li>");
    li.text(`${message.from} ${formattedTime}: ${message.text}`);
    $("#message-list").append(li);
  });

  socket.on("newLocationMessage", message => {
    const formattedTime = moment(message.createdAt).format("h:mm a");
    const li = $("<li></li>");
    const a = $("<a target='_blank'>My current location</a>");

    li.text(`${message.from} ${formattedTime}: `);
    a.attr("href", message.url);
    li.append(a);
    $("#message-list").append(li);
  });
});

$("#message-form").on("submit", e => {
  e.preventDefault();

  const messageTextbox = $("[name=message]");

  socket.emit(
    "createdMessage",
    {
      from: "user",
      text: messageTextbox.val()
    },
    () => {
      messageTextbox.val("");
    }
  );
});

const locationButton = $("#send-location");
locationButton.on("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  }
  locationButton.attr("disabled", "disabled").text("Sending location...");

  navigator.geolocation.getCurrentPosition(
    position => {
      locationButton.removeAttr("disabled").text("Send location"),
        socket.emit("createLocationMessage", {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      console.log(position);
    },
    () => {
      locationButton.removeAttr("disabled").text("Send location");
      alert("Unable to fetch location.");
    }
  );
});
