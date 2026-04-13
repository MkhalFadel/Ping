import styles from "./chatItem.module.css";

function ChatItem({ name, last, active, time, unreadCount }) {

   const formattedTime = new Date(time).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
   })

   return (
      <div className={`${styles.chatItem} ${active ? styles.active : ""}`}>
         <div className={styles.avatar}></div>

         <div className={styles.chatInfo}>
            <div className={styles.topRow}>
            <div className={styles.chatName}>{name}</div>

            <div className={styles.rightSide}>
               <div className={styles.time}>{formattedTime}</div>

               {unreadCount > 0 && (
                  <div className={styles.badge}>{unreadCount}</div>
               )}
            </div>
         </div>

            <div className={styles.chatLast}>{last}</div>
         </div>
      </div>
);
}

export default ChatItem;