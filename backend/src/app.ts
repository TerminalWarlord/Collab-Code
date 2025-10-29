import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import { router } from "./routes/auth.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;


const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.on("connection", (client) => {
  console.log("Client connected:", client.id);

  client.on("event", (data) => {
    console.log("Received event:", data);
  });

  client.on("codeChange", (data) => {
    client.broadcast.emit("codeChange", data);
  });

  client.on("langChange", (data)=>{
    client.broadcast.emit("langChange", data);
  })

  client.on("disconnect", () => {
    console.log("Client disconnected:", client.id);
  });
});


app.use(router);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});