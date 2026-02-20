import { io } from "socket.io-client";
import { host } from "./utils/ApiRoutes";

export const socket = io(host, {
  transports: ["websocket"],
  autoConnect: true,
});
