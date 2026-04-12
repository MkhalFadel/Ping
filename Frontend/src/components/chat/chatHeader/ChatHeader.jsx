import styles from "./chatHeader.module.css";
import { useTheme } from "../../../context/ThemeContext";

function ChatHeader({ onBack }) {
   const { theme, toggleTheme } = useTheme();

   return (
      <div className={styles.header}>

         {/* Back button (mobile only later) */}
         <button className={styles.backBtn} onClick={onBack}>
         ←
         </button>

         <div className={styles.avatar}></div>

         <div className={styles.title}>
            <div className={styles.name}>John Doe</div>
            <div className={styles.status}>Online</div>
         </div>

         <button className={styles.themeBtn} onClick={toggleTheme}>
         {theme === "dark" ? "🌙" : "☀️"}
         </button>
      </div>
   );
}

export default ChatHeader;