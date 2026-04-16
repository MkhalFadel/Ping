import styles from "./authForm.module.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from '../../../public/Images/logo.svg'

function AuthForm({ type, onSubmit }) {
   const [username, setUsername] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");

   function handleSubmit(e) {
      e.preventDefault();

      if (type === "signup") {
         onSubmit({ username, email, password });
      } else {
         onSubmit({ email, password });
      }
   }

   return (
      <form className={styles.form} onSubmit={handleSubmit}>
         <div>
            <img src={logo} alt="pingLogo" className={styles.logo} />
         </div>
         <h2>{type === "login" ? "Login" : "Sign Up"}</h2>

         {/* 🔥 Username (ONLY for signup) */}
         {type === "signup" && (
         <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
         />
         )}

         <input
         type="email"
         placeholder="Email"
         value={email}
         onChange={(e) => setEmail(e.target.value)}
         />

         <input
         type="password"
         placeholder="Password"
         value={password}
         onChange={(e) => setPassword(e.target.value)}
         />

         <button type="submit">
         {type === "login" ? "Login" : "Create Account"}
         </button>

         <p>
         {type === "login" ? (
            <>
               Don’t have an account? <Link to="/signup">Sign up</Link>
            </>
         ) : (
            <>
               Already have an account? <Link to="/">Login</Link>
            </>
         )}
         </p>
      </form>
   );
}

export default AuthForm;