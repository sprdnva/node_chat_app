const socket = io();

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("newMessage", message => {
    console.log(message);
    const li = $("<li></li>");
    li.text(`${message.from}: ${message.text}`);
    $("#message-list").append(li);
  });

  socket.on("newLocationMessage", message => {
    const li = $("<li></li>");
    const a = $("<a target='_blank'>My current location</a>");

    li.text(`${message.from}: `);
    a.attr("href", message.url);
    li.append(a);
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

const locationButton = $("#send-location");
locationButton.on("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      console.log(position);
    },
    () => {
      alert("Unable to fetch location.");
    }
  );
});
