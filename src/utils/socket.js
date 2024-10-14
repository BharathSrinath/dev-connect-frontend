// src/socket.js
import { io } from "socket.io-client";

const ENDPOINT = "https://dev-connect-backend-6vpt.onrender.com";
export const socket = io(ENDPOINT, { transports: ["websocket"] });

socket.on("connect", () => {
  console.log("Connected to socket.io");
});

export default socket;
