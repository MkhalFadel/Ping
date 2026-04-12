import styles from "./chatList.module.css";
import ChatItem from "../chatItem/ChatItem";

function ChatList({ onSelectChat }) {
   return (
      <div className={styles.chatList}>
         <div onClick={onSelectChat}>
         <ChatItem active name="John Doe" last="Hey, how are you?" />
         </div>

         <div onClick={onSelectChat}>
         <ChatItem name="Alice" last="See you later" />
         </div>
      </div>
   );
}

export default ChatList;