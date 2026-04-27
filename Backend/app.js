require("dotenv").config();
const express = require("express");
const cors = require("cors")
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const server = http.createServer(app);

const jwt = require("jsonwebtoken");
const prisma = require("./database/prisma");

const io = new Server(server, {
   cors: {
      origin: '*',
   },
});


app.use(cors({
   origin: 'http://localhost:5173'
}));

app.use(express.static(path.join(__dirname, "Frontend")));
app.use(express.urlencoded({extended: false}))
app.use(express.json());

app.use('/api/auth/', authRoutes);
app.use("/api/users/", userRoutes)
app.use("/api/chats/", chatRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 5000;

io.use(async (socket, next) => {
   try {
      const token = socket.handshake.auth.token;

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await prisma.user.findUnique({
         where: { id: decoded.id },
      });

      socket.user = user;

      next();
   } catch (err) {
      next(new Error("Authentication error"));
   }
});

io.on("connection", (socket) => {
   console.log("User connected:", socket.id);

   socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
   });

   socket.on("send_message", async (message) => {
      try {
         const { chatId, content } = message;

         // check membership
         const isMember = await prisma.chatMember.findFirst({
            where: {
            chatId,
            userId: socket.user.id,
            },
         });

         if (!isMember) {
            console.log(`❌ Unauthorized message attempt by ${socket.user.id}`);
            return;
         }

         const safeMessage = {
            ...message,
            senderId: socket.user.id,
         };

         socket.to(chatId).emit("receive_message", safeMessage);

      } catch (err) {
         console.log("Send message error:", err.message);
      }
   });

   socket.on("join_chat", async (chatId) => {
      try {
         // check if user is part of this chat
         const isMember = await prisma.chatMember.findFirst({
            where: {
            chatId,
            userId: socket.user.id,
            },
         });

         if (!isMember) {
            console.log(`❌ Unauthorized join attempt by ${socket.user.id}`);
            return; // silently ignore OR emit error
         }

         socket.join(chatId);
         console.log(`✅ ${socket.user.id} joined chat ${chatId}`);

      } catch (err) {
         console.log("Join chat error:", err.message);
      }
   });
});

server.listen(PORT, () => {
   console.log(`Server is running on ${PORT}`);
})