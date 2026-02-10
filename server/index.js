import express from "express";
import http from "http";
import { Server } from "socket.io";
import { gameSocket } from "./sockets/gameSocket.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

gameSocket(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () =>
  console.log("🚀 Server running on", PORT)
);
