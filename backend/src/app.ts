import { createServer } from "http";
import { Server } from "socket.io";

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "*", // or 3000 if CRA, depends on your frontend port
    methods: ["GET", "POST"]
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

server.listen(5001, () => {
  console.log("Server running on http://localhost:5001");
});