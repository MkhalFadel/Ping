import styles from "./messageInput.module.css";
import { useState } from "react";
import { sendMessage } from "../../../API/message";
import { useAuth } from "../../../context/AuthContext";
import socket from "../../../socket";

function MessageInput({ setMessages, currentUserId, chatId, setChats, onSend }) {

   const [message, setMessage] = useState("");

   const { token, user } = useAuth();

   async function handleSend() {
      if (!message.trim()) return;

      const content = message.trim();

      const tempMessage = {
         id: Date.now(),
         chatId,
         senderId: user.id,
         content,
         createdAt: new Date().toISOString(),
         status: "sending"
      };

      // optimistic message
      setMessages(prev => [...prev, tempMessage]);
      setMessage("");
      onSend();

      // update chat preview immediately
      setChats(prevChats => {
         const updated = prevChats.map(chat =>
            chat.id === chatId
               ? {
                  ...chat,
                  lastMessage: content,
                  lastMessageTime: tempMessage.createdAt,
               }
               : chat
         );

         // move active chat to top
         const active = updated.find(c => c.id === chatId);
         const others = updated.filter(c => c.id !== chatId);

         return [active, ...others];
      });

      try {
         const realMessage = await sendMessage(
            { chatId, content },
            token
         );

         socket.emit("send_message", realMessage);

         // replace temp message
         setMessages(prev =>
            prev.map(m =>
               m.id === tempMessage.id ? realMessage : m
            )
         );

      } catch (err) {
         console.error(err);

         // mark failed
         setMessages(prev =>
            prev.map(m =>
               m.id === tempMessage.id
                  ? { ...m, status: "failed" }
                  : m
            )
         );
      }
   }

   return (
      <div className={styles.inputBox}>
         <input
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend() }}
            value={message}
            className={styles.input}
            type="text"
            placeholder="Type a message..."
         />
         <button className={styles.button} onClick={handleSend}>Send</button>
      </div>
   );
}

export default MessageInput;