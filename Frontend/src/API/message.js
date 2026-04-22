const API_URL = "http://localhost:5000/API/messages";

export async function getMessages(chatId, token) {
   const res = await fetch(`${API_URL}/${chatId}`, {
      headers: {
         Authorization: `Bearer ${token}`,
      },
   });

   return res.json();
}

export async function sendMessage(data, token) {
   const res = await fetch(API_URL, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
   });

   return res.json();
}