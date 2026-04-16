import styles from "./messageList.module.css";
import MessageBubble from "../messageBubble/MessageBubble";
import { useEffect, useRef, useState } from "react";

function MessageList({ messages, currentUserId, forceScroll }) {
   const containerRef = useRef(null);
   const bottomRef = useRef(null);

   const [isNearBottom, setIsNearBottom] = useState(true);
   const [showScrollButton, setShowScrollButton] = useState(false);
   const prevMessageCount = useRef(messages.length);

   // Detect scroll position
   function handleScroll() {
      const el = containerRef.current;
      if (!el) return;

      const threshold = 100;

      const isBottom =
         el.scrollHeight - el.scrollTop - el.clientHeight < threshold;

      setIsNearBottom(isBottom);
   }

   // auto-scroll
   useEffect(() => {
      const isNewMessage = messages.length > prevMessageCount.current;

      if (isNewMessage) {
         if (isNearBottom) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
         } else {
            setShowScrollButton(true);
         }
      }

      
      prevMessageCount.current = messages.length;
   }, [messages, isNearBottom]);
   
   useEffect(() => {
      if (forceScroll) {
         bottomRef.current?.scrollIntoView({ behavior: "smooth" });
         setShowScrollButton(false)
      }
   }, [forceScroll]);

   function scrollToBottom() {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setShowScrollButton(false);
   }

   const messagesEl = messages.map((m) => (
      <MessageBubble
         key={m.id}
         text={m.content}
         type={currentUserId === m.senderId ? "sent" : "received"}
         createdAt={m.createdAt}
         status={m.status}
      />
   ));

   return (
      <>
         <div
            ref={containerRef}
            onScroll={handleScroll}
            className={styles.messages}
         >
            {messagesEl}
            <div ref={bottomRef}></div>
         </div>

         {showScrollButton && (
            <button
               className={styles.scrollButton}
               onClick={scrollToBottom}
            >
               ↓ New messages
            </button>
         )}
      </>
      
   );
}

export default MessageList;