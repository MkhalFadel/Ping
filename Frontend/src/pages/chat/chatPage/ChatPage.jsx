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
   const [activeChatId, setActiveChatId] = useState("chat_1");

   const currentUserId = "user_1";

   const [chats, setChats] = useState([
      {
         id: "chat_1",
         name: "John Doe",
         lastMessage: "Hey, how are you?",
         lastMessageTime: new Date().toISOString()
      },
      {
         id: "chat_2",
         name: "Alice",
         lastMessage: "See you later",
         lastMessageTime: new Date().toISOString()
      },
   ]);

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

   const openChat = (chatId) => {
      setActiveChatId(chatId);
      if (isMobile) setView("chat");
   };

   const goBack = () => {
      if (isMobile) setView("list");
   };

   const activeChat = chats.find(c => c.id === activeChatId)
   const filteredMessages = messages.filter(m => m.chatId === activeChatId);

   return (
      <div className={styles.app}>

         {/* SIDEBAR */}
         {(!isMobile || view === "list") && (
         <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
               Ping
            </div>

            <ChatList chats={chats} activeChatId={activeChatId} onSelectChat={openChat} />
         </aside>
         )}

         {/* CHAT */}
         {(!isMobile || view === "chat") && (
         <main className={styles.chat}>
            <ChatHeader onBack={goBack} name={activeChat?.name} />
            <MessageList messages={filteredMessages} currentUserId={currentUserId} />
            <MessageInput setMessages={setMessages} currentUserId={currentUserId} chatId={activeChatId} setChats={setChats} />
         </main>
         )}

      </div>
   );
}

export default ChatPage;