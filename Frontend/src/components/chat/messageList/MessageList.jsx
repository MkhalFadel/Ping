import styles from "./messageList.module.css";
import MessageBubble from "../messageBubble/MessageBubble";
import {useRef, useEffect} from 'react';

function MessageList({messages, currentUserId}) {
   const bottomRef = useRef(null)

   const messagesEl = messages.map(m => (
      <MessageBubble key={m.id}
                     text={m.content} 
                     type={currentUserId === m.senderId ? 'sent' : 'received'}
                     createdAt={m.createdAt} />
   ))

   useEffect(() => {
      bottomRef.current.scrollIntoView({behavior: 'smooth'})
   }, [messages])

   return (
      <div className={styles.messages}>
         {messagesEl}
         <div ref={bottomRef}></div>
      </div>
   );
}

export default MessageList;