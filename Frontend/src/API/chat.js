const API_URL = "http://localhost:5000/api/chats";

export async function getChats(token) {
   const res = await fetch(API_URL, {
      headers: {
         Authorization: `Bearer ${token}`,
      },
   });

   const data = await res.json();

   if (!res.ok) {
      throw new Error(data.message || "Failed to fetch chats");
   }

   return data;
}