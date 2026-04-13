import styles from "./chatPage.module.css";
import { useState } from "react";
import { useIsMobile } from "../../../hooks/useIsMobile";

import ChatList from "../../../components/chat/chatList/ChatList";
import ChatHeader from "../../../components/chat/chatHeader/ChatHeader";
import MessageList from "../../../components/chat/messageList/MessageList";
import MessageInput from "../../../components/chat/messageInput/MessageInput";

function ChatPage() {
   const isMobile = useIsMobile();

   const [view, setView] = useState("list"); 

   const currentUserId = "user_1";

   const [messages, setMessages] = useState([
      {
         id: "1",
         chatId: "chat_1",
         senderId: "user_2",
         content: "Hello 👋",
         createdAt: new Date().toISOString(),
      },
      {
         id: "2",
         chatId: "chat_1",
         senderId: "user_1",
         content: "Hey! What's up?",
         createdAt: new Date().toISOString(),
      },
   ]);

   console.log(messages)

   const openChat = () => {
      if (isMobile) setView("chat");
   };

   const goBack = () => {
      if (isMobile) setView("list");
   };

   return (
      <div className={styles.app}>

         {/* SIDEBAR */}
         {(!isMobile || view === "list") && (
         <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
               Ping
            </div>

            <ChatList onSelectChat={openChat} />
         </aside>
         )}

         {/* CHAT */}
         {(!isMobile || view === "chat") && (
         <main className={styles.chat}>
            <ChatHeader onBack={goBack} />
            <MessageList messages={messages} currentUserId={currentUserId} />
            <MessageInput setMessages={setMessages} currentUserId={currentUserId} />
         </main>
         )}

      </div>
   );
}

export default ChatPage;