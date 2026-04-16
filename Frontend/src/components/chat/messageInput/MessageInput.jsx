import styles from "./messageInput.module.css";
import { useState } from "react";

function MessageInput({ setMessages, currentUserId, chatId, setChats, onSend }) {

   const [message, setMessage] = useState("");

   function sendMessage() {
      if (!message.trim()) return;

      const messageObj = {
         id: Date.now(),
         chatId: chatId,
         senderId: currentUserId,
         content: message.trim(),
         createdAt: new Date().toISOString(),
         status: "sent"
      }

      onSend();
      setMessages(m => [...m, messageObj]);

      setChats((prevChats) => {
      const updated = prevChats.map((chat) =>
         chat.id === chatId
            ? {
               ...chat,
               lastMessage: message.trim(),
               lastMessageTime: new Date().toISOString(),
            }
            : chat
      );

      function updateMessageStatus(messageId, status) {
      setMessages((prev) =>
         prev.map((msg) =>
            msg.id === messageId ? { ...msg, status } : msg
         )
      );
   }

      setTimeout(() => {
         updateMessageStatus(messageObj.id, "delivered");
         }, 1000);

      setTimeout(() => {
         updateMessageStatus(messageObj.id, "read");
         }, 2000);

      const active = updated.find((c) => c.id === chatId);
      const others = updated.filter((c) => c.id !== chatId);

      return [active, ...others];
   });

      setMessage("")
   }

   return (
      <div className={styles.inputBox}>
         <input
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendMessage() }}
            value={message}
            className={styles.input}
            type="text"
            placeholder="Type a message..."
         />
         <button className={styles.button} onClick={sendMessage}>Send</button>
      </div>
   );
}

export default MessageInput;