import styles from "./messageBubble.module.css";

function MessageBubble({ text, type, createdAt, status }) {
   
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
         
         <div className={styles.meta}>
            <span className={styles.time}>{time}</span>

            {type === "sent" && (
               <span className={`${styles.status} ${status === 'read' ? styles.read : ""}`}>
                  {status === "sent" && "✓"}
                  {status === "delivered" && "✓✓"}
                  {status === "read" && "✓✓"}
               </span>
            )}
         </div>
      </div>
   );
}

export default MessageBubble;