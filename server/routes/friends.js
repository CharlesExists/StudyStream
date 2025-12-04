import express from "express";
import admin from "firebase-admin";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
const db = admin.firestore();

/* =========================================
   SEND FRIEND REQUEST
   POST /api/friends/request
========================================= */
router.post("/friends/request", verifyToken, async (req, res) => {
  try {
    const fromUserId = req.user.uid;
    const { toUserId } = req.body;

    if (!toUserId) {
      return res.status(400).json({ error: "toUserId is required" });
    }

    if (fromUserId === toUserId) {
      return res.status(400).json({ error: "You cannot friend yourself" });
    }

    // prevent duplicate requests 
    const existing = await db
      .collection("friendRequests")
      .where("fromUserId", "==", fromUserId)
      .where("toUserId", "==", toUserId)
      .where("status", "==", "pending")
      .get();

    if (!existing.empty) {
      return res.status(400).json({ error: "Friend request already sent" });
    }

    const requestRef = await db.collection("friendRequests").add({
      fromUserId,
      toUserId,
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({
      message: "Friend request sent",
      requestId: requestRef.id
    });
  } catch (err) {
    console.error("Send friend request error:", err);
    res.status(500).json({ error: "Failed to send friend request" });
  }
});

/* =========================================
   GET MY INCOMING FRIEND REQUESTS
   GET /api/friends/requests
========================================= */
router.get("/friends/requests", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;

    const snapshot = await db
      .collection("friendRequests")
      .where("toUserId", "==", uid)
      .where("status", "==", "pending")
      .get();

    const requests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(requests);
  } catch (err) {
    console.error("Fetch requests error:", err);
    res.status(500).json({ error: "Failed to fetch friend requests" });
  }
});

/* =========================================
   ACCEPT FRIEND REQUEST
   POST /api/friends/:requestId/accept
========================================= */
router.post("/friends/:requestId/accept", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { requestId } = req.params;

    const requestRef = db.collection("friendRequests").doc(requestId);
    const snap = await requestRef.get();

    if (!snap.exists) {
      return res.status(404).json({ error: "Request not found" });
    }

    const { fromUserId, toUserId } = snap.data();

    if (toUserId !== uid) {
      return res.status(403).json({ error: "Not authorized to accept this request" });
    }

    // add friends
    const batch = db.batch();

    const userAFriendRef = db
      .collection("users")
      .doc(fromUserId)
      .collection("friends")
      .doc(toUserId);

    const userBFriendRef = db
      .collection("users")
      .doc(toUserId)
      .collection("friends")
      .doc(fromUserId);

    batch.set(userAFriendRef, {
      since: admin.firestore.FieldValue.serverTimestamp()
    });

    batch.set(userBFriendRef, {
      since: admin.firestore.FieldValue.serverTimestamp()
    });

    batch.update(requestRef, {
      status: "accepted"
    });

    await batch.commit();

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    console.error("Accept request error:", err);
    res.status(500).json({ error: "Failed to accept request" });
  }
});

/* =========================================
   DECLINE FRIEND REQUEST
   POST /api/friends/:requestId/decline
========================================= */
router.post("/friends/:requestId/decline", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { requestId } = req.params;

    const requestRef = db.collection("friendRequests").doc(requestId);
    const snap = await requestRef.get();

    if (!snap.exists) {
      return res.status(404).json({ error: "Request not found" });
    }

    const { toUserId } = snap.data();
    if (toUserId !== uid) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await requestRef.update({ status: "declined" });

    res.json({ message: "Friend request declined" });
  } catch (err) {
    console.error("Decline request error:", err);
    res.status(500).json({ error: "Failed to decline request" });
  }
});

/* =========================================
   GET MY FRIEND LIST
   GET /api/friends
========================================= */
router.get("/friends", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;

    const snapshot = await db
      .collection("users")
      .doc(uid)
      .collection("friends")
      .get();

    const friends = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(friends);
  } catch (err) {
    console.error("Fetch friends error:", err);
    res.status(500).json({ error: "Failed to fetch friends" });
  }
});

/* =========================================
   REMOVE FRIEND (UNFRIEND)
   DELETE /api/friends/:friendUid
========================================= */
router.delete("/friends/:friendUid", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { friendUid } = req.params;

    const batch = db.batch();

    const yourRef = db
      .collection("users")
      .doc(uid)
      .collection("friends")
      .doc(friendUid);

    const theirRef = db
      .collection("users")
      .doc(friendUid)
      .collection("friends")
      .doc(uid);

    batch.delete(yourRef);
    batch.delete(theirRef);

    await batch.commit();

    res.json({ message: "Friend removed" });
  } catch (err) {
    console.error("Remove friend error:", err);
    res.status(500).json({ error: "Failed to remove friend" });
  }
});

export default router;
