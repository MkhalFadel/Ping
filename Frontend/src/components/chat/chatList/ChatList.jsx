import styles from "./chatList.module.css";
import ChatItem from "../chatItem/ChatItem";

function ChatList({ chats, activeChatId, onSelectChat }) {

   console.log(activeChatId)

   const chatListEl = chats.map(c => (
      <div key={c.id} onClick={() => onSelectChat(c.id)}>
         <ChatItem 
            active={c.id === activeChatId} 
            name={c.name}
            last={c.lastMessage}
            time={c.lastMessageTime}
         />
      </div>
      ))

   return (
      <div className={styles.chatList}>
         {chatListEl}
      </div>
   );
}

export default ChatList;