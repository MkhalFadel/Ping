import styles from "./chatPage.module.css";
import { useState, useEffect } from "react";
import { useIsMobile } from "../../../hooks/useIsMobile";
import logo from '../../../../public/Images/logo.svg'

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
         lastMessageTime: new Date().toISOString(),
         unreadCount: 0,
      },
      {
         id: "chat_2",
         name: "Alice",
         lastMessage: "See you later",
         lastMessageTime: new Date().toISOString(),
         unreadCount: 0,
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

   useEffect(() => {
   const interval = setInterval(() => {
      const randomChat =
         chats[Math.floor(Math.random() * chats.length)];

      const fakeMessage = {
         id: crypto.randomUUID(),
         chatId: randomChat.id,
         senderId: "user_2", // simulate another user
         content: "New message " + Math.floor(Math.random() * 100),
         createdAt: new Date().toISOString(),
      };

      // ✅ Add message
      setMessages((prev) => [...prev, fakeMessage]);

      // ✅ Update chat preview
      setChats((prevChats) => {
      const updated = prevChats.map((chat) => {
         if (chat.id === randomChat.id) {
            return {
            ...chat,
            lastMessage: fakeMessage.content,
            lastMessageTime: fakeMessage.createdAt,

            // 🔥 increase unread count ONLY if not active chat
            unreadCount:
               activeChatId === chat.id
                  ? 0
                  : (chat.unreadCount || 0) + 1,
            };
         }

         return chat;
      });

      const active = updated.find((c) => c.id === randomChat.id);
      const others = updated.filter((c) => c.id !== randomChat.id);

      return [active, ...others];
});

   }, 5000); // every 5 seconds

   return () => clearInterval(interval);
}, [chats]);

   const openChat = (chatId) => {
      setActiveChatId(chatId);
      setChats((prev) =>
      prev.map((chat) =>
         chat.id === chatId
         ? { ...chat, unreadCount: 0 }
         : chat
         )
      );
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
               <img className={styles.logo} src={logo} alt="ping logo" />Ping
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