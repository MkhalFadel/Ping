const API_URL = "http://localhost:5000/api/auth";

export async function register(data) {
   const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
   });

   const result = await res.json();

   if (!res.ok) {
      throw new Error(result.message || "Register failed");
   }

   return result;
}

export async function login(data) {
   const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
   });

   const result = await res.json();

   if (!res.ok) {
      throw new Error(result.message || "Login failed");
   }

   return result;
}