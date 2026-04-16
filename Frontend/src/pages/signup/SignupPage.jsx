import styles from "./signupPage.module.css";
import AuthForm from "../../components/auth/AuthForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function SignupPage() {
   const navigate = useNavigate();

   function handleSignup(data) {
      const userData = {
         id: crypto.randomUUID(),
         username: data.username,
         email: data.email,
      };

      login(userData);
      navigate("/chat");
   }

   return (
      <div className={styles.page}>
         <AuthForm type="signup" onSubmit={handleSignup} />
      </div>
   );
}

export default SignupPage;