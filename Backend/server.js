import { config } from "dotenv";
config();
import http from "http";
import app from "./app.js";
import db from "./db.js";
import { initializeSocket } from "./Socket/socket.js";


const PORT = process.env.PORT || 5000;


const server = http.createServer(app);

initializeSocket(server)



// start
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
