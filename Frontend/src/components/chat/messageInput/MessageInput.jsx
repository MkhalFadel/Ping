import styles from "./messageInput.module.css";
import { useState } from "react";

function MessageInput({setMessages, currentUserId}) {

   const [message, setMessage] = useState("");

   function sendMessage()
   {
      if(!message.trim()) return;

      const messageObj = {
         id: Date.now(),
         chatId: 'chat_1',
         senderId: currentUserId,
         content: message.trim(),
         createdAt: new Date().toISOString()
      }
      setMessages(m => [...m, messageObj]);
      setMessage("")
   }

   return (
      <div className={styles.inputBox}>
         <input
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => {if(e.key === 'Enter') sendMessage()}}
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