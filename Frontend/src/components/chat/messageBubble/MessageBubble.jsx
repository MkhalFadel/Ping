import styles from "./messageBubble.module.css";

function MessageBubble({ text, type }) {
   return (
      <div
         className={`${styles.message} ${
         type === "sent" ? styles.sent : styles.received
         }`}
      >
         {text}
      </div>
   );
}

export default MessageBubble;