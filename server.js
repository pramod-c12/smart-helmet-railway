const express = require("express");
const WebSocket = require("ws");

const app = express();

// Railway automatically gives PORT
const PORT = process.env.PORT || 3000;

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

// Attach WebSocket server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (data) => {
    // Broadcast incoming data to all connected clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
