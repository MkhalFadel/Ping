import styles from "./chatPage.module.css";
import { useState, useEffect } from "react";
import { useIsMobile } from "../../../hooks/useIsMobile";
import logo from '../../../../public/Images/logo.svg'
import { useAuth } from "../../../context/AuthContext";
import { getChats } from "../../../API/chat";
import { getMessages } from "../../../API/message";
import socket from "../../../socket";

import ChatList from "../../../components/chat/chatList/ChatList";
import ChatHeader from "../../../components/chat/chatHeader/ChatHeader";
import MessageList from "../../../components/chat/messageList/MessageList";
import MessageInput from "../../../components/chat/messageInput/MessageInput";

function ChatPage() {
   const isMobile = useIsMobile();

   const [view, setView] = useState("list");
   const [activeChatId, setActiveChatId] = useState("chat_1");
   const [forceScroll, setForceScroll] = useState(false);
   const [isTyping, setIsTyping] = useState(false)
   
   const { token, user } = useAuth();
   const currentUserId = user?.id;
   
   const [chats, setChats] = useState([]);
   const [messages, setMessages] = useState([]);
   const [loading, setLoading] = useState(true);

   const isChatVisible = !isMobile || view === "chat";

   useEffect(() => {
      socket.on("connect", () => {
         console.log("Connected:", socket.id);
      });

      return () => {
         socket.off("connect");
      };
   }, []);

   useEffect(() => {
      if (token) {
         socket.auth = { token }; // attach token
         socket.connect();

      }

      return () => {
         socket.disconnect();
      };
   }, [token]);

   useEffect(() => {
      if (activeChatId) {
         socket.emit("join_chat", activeChatId);
      }
   }, [activeChatId]);

   useEffect(() => {
      const handleTyping = ({ chatId }) => {
         if (chatId === activeChatId) {
            setIsTyping(true);
         }
      };

      const handleStopTyping = ({ chatId }) => {
         if (chatId === activeChatId) {
            setIsTyping(false);
         }
      };

      socket.on("user_typing", handleTyping);
      socket.on("user_stop_typing", handleStopTyping);

      return () => {
         socket.off("user_typing", handleTyping);
         socket.off("user_stop_typing", handleStopTyping);
      };
   }, [activeChatId]);

   useEffect(() => {
      const handleMessage = (message) => {
         console.log("Received in frontend:", message);

         setChats(prevChats =>
            prevChats.map(chat => {
               if (chat.id !== message.chatId) return chat;

               const isCurrentChat = message.chatId === activeChatId && isChatVisible;
               const isIncoming = message.senderId !== currentUserId;

               return {
                  ...chat,
                  lastMessage: message.content,
                  lastMessageTime: message.createdAt,
                  unreadCount:
                     isCurrentChat || !isIncoming
                        ? 0
                        : (chat.unreadCount || 0) + 1,
               };
            })
         );

         if (message.chatId === activeChatId && message.senderId !== currentUserId) {
            setMessages(prev => [...prev, message]);
         }

         if (message.senderId !== user.id) {
            socket.emit("message_delivered", {
               messageId: message.id,
               chatId: message.chatId,
            });
         }
      };

      socket.on("receive_message", handleMessage);

      return () => {
         socket.off("receive_message", handleMessage);
      };
   }, [activeChatId, currentUserId, isChatVisible, user.id]);

   // Force scroll when user send a message
   useEffect(() => {
      if (forceScroll) {
         const timeout = setTimeout(() => {
            setForceScroll(false);
         }, 100);

         return () => clearTimeout(timeout);
      }
   }, [forceScroll]);

   // get new messages
   useEffect(() => {
      async function fetchMessages() {
         try {
            const data = await getMessages(activeChatId, token);

            setMessages(data);

            // 🔥 sync chat preview from backend messages
            syncChatPreview(activeChatId, data);

         } catch (err) {
            console.error(err);
         }
      }

      if (activeChatId && token) {
         fetchMessages();
      }
   }, [activeChatId, token]);

   // get chats list
   useEffect(() => {
      async function fetchChats() {
         try {
            const data = await getChats(token);

            const formatted = data.map(chat => {
               const otherUser = chat.members.find(
                  m => m.user.id !== user.id
               )?.user;

               return {
                  id: chat.id,
                  name: otherUser?.username || "Unknown",
                  lastMessage: chat.messages[0]?.content || "",
                  lastMessageTime: chat.messages[0]?.createdAt,
                  unreadCount: chat.unreadCount ?? 0,
               };
            });

            setChats(formatted);

            if (formatted.length > 0) {
               setActiveChatId(formatted[0].id);
            }

         } catch (err) {
            console.error(err);
         } finally {
            setLoading(false);
         }
      }

      if (token && user) fetchChats();
   }, [token, user]);

   useEffect(() => {
      const handleDelivered = ({ messageId }) => {
         setMessages(prev =>
            prev.map(msg =>
               msg.id === messageId
                  ? { ...msg, status: "delivered" }
                  : msg
            )
         );
      };

      socket.on("message_delivered_update", handleDelivered);

      return () => {
         socket.off("message_delivered_update", handleDelivered);
      };
   }, []);

   useEffect(() => {
      if (!activeChatId || !isChatVisible) return;

      const unreadMessages = messages.filter(
         m =>
            m.chatId === activeChatId &&
            m.senderId !== user.id &&
            m.status !== "read"
      );

      unreadMessages.forEach(message => {
         socket.emit("message_read", {
            messageId: message.id,
            chatId: activeChatId,
         });
      });
   }, [activeChatId, messages, user.id, isChatVisible]);

   useEffect(() => {
      const handleRead = ({ messageId }) => {
         setMessages(prev =>
            prev.map(msg =>
               msg.id === messageId
                  ? { ...msg, status: "read" }
                  : msg
            )
         );
      };

      socket.on("message_read_update", handleRead);

      return () => {
         socket.off("message_read_update", handleRead);
      };
   }, []);

   function syncChatPreview(chatId, messages) {
      const lastMessage = messages
         .filter(m => m.chatId === chatId)
         .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

      if (!lastMessage) return;

      setChats(prev => {
         const updated = prev.map(chat =>
            chat.id === chatId
               ? {
                  ...chat,
                  lastMessage: lastMessage.content,
                  lastMessageTime: lastMessage.createdAt,
               }
               : chat
         );

         const active = updated.find(c => c.id === chatId);
         const others = updated.filter(c => c.id !== chatId);

         return [active, ...others];
      });
   }


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
            <MessageList messages={filteredMessages} currentUserId={currentUserId} forceScroll={forceScroll} isTyping={isTyping} />
            <MessageInput setMessages={setMessages} currentUserId={currentUserId} chatId={activeChatId} setChats={setChats} onSend={() => setForceScroll(true)} />
         </main>
         )}

      </div>
   );
}

export default ChatPage;