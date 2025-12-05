import express from "express";
import { db, tsToISO } from "../firebase.js";
import { verifyToken } from "../middleware/authMiddleware.js";

// SINGLE router definition
const router = express.Router();

/* =========================================
   SEND FRIEND REQUEST
========================================= */
router.post("/friends/request", verifyToken, async (req, res) => {
  try {
    const fromUserId = req.user.uid;
    const { toUserId } = req.body;

    if (!toUserId)
      return res.status(400).json({ error: "toUserId is required" });

    if (fromUserId === toUserId)
      return res.status(400).json({ error: "You cannot friend yourself" });

    const friendsSnap = await db
      .collection("friends")
      .doc(fromUserId)
      .collection("userFriends")
      .doc(toUserId)
      .get();

    if (friendsSnap.exists)
      return res.status(400).json({ error: "Already friends" });

    const pendingSnap = await db
      .collection("friendRequests")
      .where("fromUserId", "==", fromUserId)
      .where("toUserId", "==", toUserId)
      .where("status", "==", "pending")
      .get();

    if (!pendingSnap.empty)
      return res.status(400).json({ error: "Request already sent" });

    const newRequest = {
      fromUserId,
      toUserId,
      status: "pending",
      createdAt: new Date(),
    };

    const docRef = await db.collection("friendRequests").add(newRequest);

    res.json({ id: docRef.id, ...newRequest, createdAt: newRequest.createdAt.toISOString() });
  } catch (err) {
    console.error("Send request error:", err);
    res.status(500).json({ error: "Failed to send friend request" });
  }
});

/* =========================================
   GET INCOMING FRIEND REQUESTS
========================================= */
router.get("/friends/requests", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;

    const snapshot = await db
      .collection("friendRequests")
      .where("toUserId", "==", uid)
      .where("status", "==", "pending")
      .get();

    const requests = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const senderDoc = await db.collection("users").doc(data.fromUserId).get();
        const sender = senderDoc.data() || {};

        return {
          requestId: doc.id,
          uid: data.fromUserId,
          name: sender.name || "",
          email: sender.email || "",
          createdAt: tsToISO(data.createdAt),
        };
      })
    );

    res.json(requests);
  } catch (err) {
    console.error("Incoming requests error:", err);
    res.status(500).json({ error: "Failed to fetch incoming friend requests" });
  }
});

/* =========================================
   GET OUTGOING FRIEND REQUESTS
========================================= */
router.get("/friends/requests/outgoing", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;

    const snapshot = await db
      .collection("friendRequests")
      .where("fromUserId", "==", uid)
      .where("status", "==", "pending")
      .get();

    const requests = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const targetUserDoc = await db.collection("users").doc(data.toUserId).get();
        const targetUser = targetUserDoc.data() || {};

        return {
          requestId: doc.id,
          uid: data.toUserId,
          name: targetUser.name || "",
          email: targetUser.email || "",
          createdAt: tsToISO(data.createdAt),
        };
      })
    );

    res.json(requests);
  } catch (err) {
    console.error("Outgoing requests error:", err);
    res.status(500).json({ error: "Failed to fetch outgoing friend requests" });
  }
});

/* =========================================
   ACCEPT FRIEND REQUEST
========================================= */
router.post("/friends/:requestId/accept", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { requestId } = req.params;

    const requestDoc = await db.collection("friendRequests").doc(requestId).get();
    if (!requestDoc.exists)
      return res.status(404).json({ error: "Request not found" });

    const request = requestDoc.data();
    if (request.toUserId !== uid)
      return res.status(403).json({ error: "Not authorized" });

    await requestDoc.ref.update({ status: "accepted" });

    // add both directions
    await db.collection("friends").doc(uid).collection("userFriends").doc(request.fromUserId).set({
      friendId: request.fromUserId,
      createdAt: new Date(),
    });

    await db.collection("friends").doc(request.fromUserId).collection("userFriends").doc(uid).set({
      friendId: uid,
      createdAt: new Date(),
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Accept request error:", err);
    res.status(500).json({ error: "Failed to accept request" });
  }
});

/* =========================================
   DECLINE FRIEND REQUEST
========================================= */
router.post("/friends/:requestId/decline", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { requestId } = req.params;

    const requestDoc = await db.collection("friendRequests").doc(requestId).get();
    if (!requestDoc.exists)
      return res.status(404).json({ error: "Request not found" });

    const request = requestDoc.data();
    if (request.toUserId !== uid)
      return res.status(403).json({ error: "Not authorized" });

    await requestDoc.ref.update({ status: "declined" });

    res.json({ success: true });
  } catch (err) {
    console.error("Decline request error:", err);
    res.status(500).json({ error: "Failed to decline request" });
  }
});

/* =========================================
   GET FRIENDS + FRIEND SINCE
========================================= */
router.get("/friends", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const snap = await db
      .collection("friends")
      .doc(uid)
      .collection("userFriends")
      .get();

    const friends = await Promise.all(
      snap.docs.map(async (doc) => {
        const data = doc.data();
        const friendId = data.friendId;
        const createdAt = tsToISO(data.createdAt);

        const userDoc = await db.collection("users").doc(friendId).get();
        const userData = userDoc.data() || {};

        return {
          uid: friendId,
          name: userData.name || "",
          email: userData.email || "",
          photoURL: userData.photoURL || null,
          friendSince: createdAt,
        };
      })
    );

    res.json(friends);
  } catch (err) {
    console.error("Get friends error:", err);
    res.status(500).json({ error: "Failed to fetch friends list" });
  }
});

/* =========================================
   REMOVE FRIEND
========================================= */
router.delete("/friends/:friendUid", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { friendUid } = req.params;

    await db.collection("friends").doc(uid).collection("userFriends").doc(friendUid).delete();
    await db.collection("friends").doc(friendUid).collection("userFriends").doc(uid).delete();

    res.json({ success: true });
  } catch (err) {
    console.error("Remove friend error:", err);
    res.status(500).json({ error: "Failed to remove friend" });
  }
});

export default router;
