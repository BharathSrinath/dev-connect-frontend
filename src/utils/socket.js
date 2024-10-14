// src/socket.js
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:3000";
export const socket = io(ENDPOINT, { transports: ["websocket"] });

socket.on("connect", () => {
  console.log("Connected to socket.io");
});

export default socket;
