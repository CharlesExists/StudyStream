const BASE_URL = "http://localhost:3001";

function getToken() {
  return auth.currentUser?.getIdToken();
}

export async function fetchFriends() {
  const token = await getToken();

  const res = await fetch(`${BASE_URL}/friends`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

export async function sendFriendRequest(toUserId) {
  const token = await getToken();

  const res = await fetch(`${BASE_URL}/friends/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ toUserId }),
  });

  return res.json();
}

export async function removeFriend(friendUid) {
  const token = await getToken();

  await fetch(`${BASE_URL}/friends/${friendUid}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
