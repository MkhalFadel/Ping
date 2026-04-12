import styles from "./messageList.module.css";
import MessageBubble from "../messageBubble/MessageBubble";

function MessageList() {
   return (
      <div className={styles.messages}>
         <MessageBubble text="Hello 👋" type="received" />
         <MessageBubble text="Hey! What's up?" type="sent" />
         <MessageBubble text="All good here" type="received" />
      </div>
   );
}

export default MessageList;