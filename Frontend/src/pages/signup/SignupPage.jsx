import styles from './signupPage.module.css'
import AuthForm from "../../components/auth/AuthForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { register as registerRequest } from "../../API/auth";

function SignupPage() {
   const navigate = useNavigate();
   const { login } = useAuth();

   async function handleSignup(data) {
      try {
         const res = await registerRequest(data);

         login(res.user, res.token);

         navigate("/chat");
      } catch (err) {
         alert(err.message);
      }
   }

   return (
      <div className={styles.page}>
         <AuthForm type="signup" onSubmit={handleSignup} />;
      </div>
   ) 
}

export default SignupPage;