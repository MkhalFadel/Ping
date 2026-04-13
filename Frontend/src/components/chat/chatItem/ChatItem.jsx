import styles from "./chatItem.module.css";

function ChatItem({ name, last, active }) {
   return (
      <div
         className={`${styles.chatItem} ${active ? styles.active : ""}`}
      >
         <div className={styles.avatar}></div>

         <div className={styles.chatInfo}>
            <div className={styles.chatName}>{name}</div>
            <div className={styles.chatLast}>{last}</div>
         </div>
      </div>
   );
}

export default ChatItem;