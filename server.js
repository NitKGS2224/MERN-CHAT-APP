import express from "express";
import "dotenv/config";
import cors from "cors"
import http from "http";
import { connectDB } from "./libs/db.js";
import { Server } from "socket.io"
import messageRouter from "./routes/messageRoutes.js";
import userRouter from "./routes/userRoute.js"


const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: { origin: "*" }
})
export const userSocketMap = {}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId
  console.log("User Connected", userId);
  if (userId) userSocketMap[userId] = socket.id;


  io.emit("getOnlineUsers", Object.keys(userSocketMap))
  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    delete userSocketMap[userId];

    io.emit("getOnlineUsers", Object.keys(userSocketMap))

  })
})

app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/status", ( res) => res.send("Server is live"))
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter)
async function startServer() {
  try {

    await connectDB()
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`);
    });

  } catch (err) {
    console.error("Could not start server:", err);

  }
}
startServer()

