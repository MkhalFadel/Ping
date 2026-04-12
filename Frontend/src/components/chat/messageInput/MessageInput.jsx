import styles from "./messageInput.module.css";

function MessageInput() {
   return (
      <div className={styles.inputBox}>
         <input
            className={styles.input}
            type="text"
            placeholder="Type a message..."
         />
         <button className={styles.button}>Send</button>
      </div>
   );
}

export default MessageInput;