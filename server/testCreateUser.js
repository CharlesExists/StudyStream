import fetch from "node-fetch";

async function testCreateUser() {
  const response = await fetch("http://localhost:3000/create-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test User",
      identifier: "test@example.com",
      password: "123456",
      confirmPassword: "123456",
    }),
  });

  const data = await response.json();
  console.log("Response:", data);
}

testCreateUser().catch(console.error);
