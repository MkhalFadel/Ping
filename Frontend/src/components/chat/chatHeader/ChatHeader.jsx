import styles from "./chatHeader.module.css";
import { useTheme } from "../../../context/ThemeContext";

function ChatHeader({ onBack, name }) {
   const { theme, toggleTheme } = useTheme();

   return (
      <div className={styles.header}>

         <button className={styles.backBtn} onClick={onBack}>
         ←
         </button>

         <div className={styles.avatar}></div>

         <div className={styles.title}>
            <div className={styles.name}>{name}</div>
            <div className={styles.status}>Online</div>
         </div>

         <button className={styles.themeBtn} onClick={toggleTheme}>
         {theme === "dark" ? "🌙" : "☀️"}
         </button>
      </div>
   );
}

export default ChatHeader;