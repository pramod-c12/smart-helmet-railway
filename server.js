const express = require("express");
const WebSocket = require("ws");

const app = express();
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log("Server running on port", PORT);
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
