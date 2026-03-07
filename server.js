const express = require("express");
const WebSocket = require("ws");

const app = express();

// Railway provides this automatically
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});

// Health endpoint so Railway keeps container alive
app.get("/", (req, res) => {
  res.send("Smart Helmet WebSocket Server Running");
});

const wss = new WebSocket.Server({ server });

let helmets = {};

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (data) => {
    try {
      const msg = JSON.parse(data);

      helmets[msg.helmetId] = msg;

      const payload = JSON.stringify({
        type: "update",
        helmets
      });

      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(payload);
        }
      });

    } catch (err) {
      console.error("Invalid message:", err);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
