// // src/api/invites.js

// const BASE_URL = "/api"; // update if your backend lives somewhere else

// export async function createInvite(sessionId, toUserId, message) {
//   // 🌱 TEMP: if backend isn't ready, you can just log + fake a response:
//   // console.log("Mock createInvite", { sessionId, toUserId, message });
//   // return Promise.resolve({ id: "mock-id", sessionId, toUserId, status: "pending" });

//   const res = await fetch(`${BASE_URL}/study-sessions/${sessionId}/invites`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ toUserId, message }),
//   });

//   if (!res.ok) {
//     const text = await res.text();
//     console.error("Failed to create invite:", res.status, text);
//     throw new Error("Failed to create invite");
//   }

//   return res.json();
// }
