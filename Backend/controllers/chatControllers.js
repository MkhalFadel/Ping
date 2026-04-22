const prisma = require("../database/prisma");

const getUserChats = async (req, res) => {
   try {
      const userId = req.user.id;

      const chats = await prisma.chat.findMany({
         where: {
         members: {
            some: {
               userId: userId,
            },
         },
         },
         include: {
         members: {
            include: {
               user: true,
            },
         },
         messages: {
            orderBy: {
               createdAt: "desc",
            },
            take: 1, // last message only
         },
         },
      });

      res.json(chats);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
};

// Create chat between users
const createChat = async (req, res) => {
   const { userId } = req.body; // user you want to chat with
   const currentUserId = req.user.id;

   try {
      // prevent chatting with yourself
      if (userId === currentUserId) {
         return res.status(400).json({ message: "Cannot chat with yourself" });
      }

      // check if chat already exists
      const existingChat = await prisma.chat.findFirst({
         where: {
         members: {
            every: {
               userId: {
               in: [currentUserId, userId],
               },
            },
         },
         },
         include: {
         members: true,
         },
      });

      if (existingChat && existingChat.members.length === 2) {
         return res.json(existingChat);
      }

      // create new chat
      const newChat = await prisma.chat.create({
         data: {
         members: {
            create: [
               { userId: currentUserId },
               { userId: userId },
            ],
         },
         },
         include: {
         members: {
            include: {
               user: true,
            },
         },
         },
      });

      res.status(201).json(newChat);

   } catch (err) {
      res.status(500).json({ error: err.message });
   }
};

module.exports = { getUserChats, createChat };