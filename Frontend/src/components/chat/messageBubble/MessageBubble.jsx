import styles from "./messageBubble.module.css";

function MessageBubble({ text, type, createdAt }) {
   
   const time = new Date(createdAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
   })

   return (
      <div
         className={`${styles.message} ${
         type === "sent" ? styles.sent : styles.received
         }`}
      >
         <div>
            {text}
         </div>
         <span className={styles.time}>{time}</span>
      </div>
   );
}

export default MessageBubble;