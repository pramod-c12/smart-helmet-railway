const express = require("express");
const WebSocket = require("ws");

const app = express();
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});

// IMPORTANT: HTTP route so Railway sees the server as active
app.get("/", (req, res) => {
  res.send("Smart Helmet WebSocket Server Running");
});

const wss = new WebSocket.Server({ server });

let helmets = {};

wss.on("connection", (ws) => {

  ws.on("message", (data) => {

    const msg = JSON.parse(data);

    helmets[msg.helmetId] = msg;

    const payload = JSON.stringify({
      type: "update",
      helmets: helmets
    });

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });

  });

});
