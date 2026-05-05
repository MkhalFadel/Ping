import styles from "./messageBubble.module.css";
import { TypingDotsLoader } from "@mkhalfadel/modoui-core";

function MessageBubble({ text, type, createdAt, status, isTyping }) {

   const time = createdAt
      ? new Date(createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
         })
      : "";

   return (
      <div
         className={`${styles.message} ${
            type === "sent" ? styles.sent : styles.received
         }`}
      >
         {/* CONTENT */}
         <div>
            {isTyping ? (
               <div className={styles.typingDots}>
                  <TypingDotsLoader />
               </div>
            ) : (
               text
            )}
         </div>

         {/* META (only for real messages) */}
         {!isTyping && (
            <div className={styles.meta}>
               <span className={styles.time}>{time}</span>

               {type === "sent" && (
                  <span
                     className={`${styles.status} ${
                        status === "read" ? styles.read : ""
                     }`}
                  >
                     {status === "sent" && "✓"}
                     {status === "delivered" && "✓✓"}
                     {status === "read" && "✓✓"}
                  </span>
               )}
            </div>
         )}
      </div>
   );
}

export default MessageBubble;