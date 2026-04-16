import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   // 🔥 Load user from localStorage (future-proof for backend)
   useEffect(() => {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
         setUser(JSON.parse(savedUser));
      }

      setLoading(false);
   }, []);

   // 🔥 Login
   function login(userData) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
   }

   // 🔥 Logout
   function logout() {
      setUser(null);
      localStorage.removeItem("user");
   }

   return (
      <AuthContext.Provider value={{ user, login, logout, loading }}>
         {children}
      </AuthContext.Provider>
   );
}

// Hook for easy access
export function useAuth() {
   return useContext(AuthContext);
}