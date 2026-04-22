const prisma = require("../database/prisma");

// Get messages for a chat
const getMessages = async (req, res) => {
   const { chatId } = req.params;

   try {
      const messages = await prisma.message.findMany({
         where: { chatId },
         orderBy: { createdAt: "asc" },
      });

      res.json(messages);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
   };

   // Send message
   const sendMessage = async (req, res) => {
   const { chatId, content } = req.body;
   const senderId = req.user.id;

   try {
      const message = await prisma.message.create({
         data: {
         chatId,
         content,
         senderId,
         },
      });

      res.status(201).json(message);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
};

module.exports = {
   getMessages,
   sendMessage,
};