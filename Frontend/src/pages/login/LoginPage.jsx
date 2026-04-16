import styles from './loginPage.module.css'
import AuthForm from "../../components/auth/AuthForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function LoginPage() {
   const navigate = useNavigate();
   const { login } = useAuth();

   function handleLogin(data) {
      // fake user (backend later replaces this)
      const userData = {
         id: "user_1",
         email: data.email,
      };

      login(userData);
      navigate("/chat");
   }

   return(
      <div className={styles.page}>
         <AuthForm type="login" onSubmit={handleLogin} />
      </div>
   )
}

export default LoginPage;