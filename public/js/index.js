const socket = io();

const scrollToBottom = () => {
  let messages = $("#message-list");
  let newMessage = messages.children("li:last-child");
  let clientHeight = messages.prop("clientHeight");
  let scrollTop = messages.prop("scrollTop");
  let scrollHeight = messages.prop("scrollHeight");
  let newMessageHeight = newMessage.innerHeight();
  let lastMessageHeight = newMessage.prev().innerHeight();

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTop(scrollHeight);
  }
};

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("newMessage", message => {
    const formattedTime = moment(message.createdAt).format("h:mm a");
    const template = $("#message-template").html();
    const html = Mustache.render(template, {
      text: message.text,
      from: message.from,
      createdAt: formattedTime
    });
    $("#message-list").append(html);
    scrollToBottom();
  });

  socket.on("newLocationMessage", message => {
    const formattedTime = moment(message.createdAt).format("h:mm a");
    const template = $("#location-message-template").html();
    const html = Mustache.render(template, {
      from: message.from,
      url: message.url,
      createdAt: formattedTime
    });
    $("#message-list").append(html);
    scrollToBottom();
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
