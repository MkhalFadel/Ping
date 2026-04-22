import styles from './loginPage.module.css'
import AuthForm from "../../components/auth/AuthForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { login as loginRequest } from "../../API/auth";

function LoginPage() {
   const navigate = useNavigate();
   const { login } = useAuth();

   async function handleLogin(data) {
      try {
         const res = await loginRequest(data);

         login(res.user, res.token);

         navigate("/chat");
      } catch (err) {
         alert(err.message);
      }
   }

   return (
      <div className={styles.page}>
         <AuthForm type="login" onSubmit={handleLogin} />;
      </div>
   )
}

export default LoginPage;