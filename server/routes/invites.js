import express from "express";
import admin from "firebase-admin";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
const db = admin.firestore();

/* =========================================
   SEND STUDY SESSION INVITE
   POST /invites/send
========================================= */
router.post("/invites/send", verifyToken, async (req, res) => {
  try {
    const fromUserId = req.user.uid;
    const { toUserId, sessionId, message } = req.body;

    if (!toUserId || !sessionId) {
      return res.status(400).json({ error: "toUserId and sessionId are required" });
    }

    if (fromUserId === toUserId) {
      return res.status(400).json({ error: "You cannot invite yourself" });
    }

    // prevent duplicate pending invites
    const existing = await db
      .collection("sessionInvites")
      .where("fromUserId", "==", fromUserId)
      .where("toUserId", "==", toUserId)
      .where("sessionId", "==", sessionId)
      .where("status", "==", "pending")
      .get();

    if (!existing.empty) {
      return res.status(400).json({ error: "Invite already sent" });
    }

    const inviteRef = await db.collection("sessionInvites").add({
      fromUserId,
      toUserId,
      sessionId,
      message: message || "",
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      message: "Session invite sent",
      inviteId: inviteRef.id,
    });
  } catch (err) {
    console.error("Send session invite error:", err);
    res.status(500).json({ error: "Failed to send session invite" });
  }
});

/* =========================================
   GET MY SESSION INVITES
   GET /invites
========================================= */
router.get("/invites", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;

    const snapshot = await db
      .collection("sessionInvites")
      .where("toUserId", "==", uid)
      .where("status", "==", "pending")
      .get();

    const invites = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(invites);
  } catch (err) {
    console.error("Fetch session invites error:", err);
    res.status(500).json({ error: "Failed to fetch invites" });
  }
});

/* =========================================
   ACCEPT SESSION INVITE
   POST /invites/:inviteId/accept
========================================= */
router.post("/invites/:inviteId/accept", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { inviteId } = req.params;

    const inviteRef = db.collection("sessionInvites").doc(inviteId);
    const snap = await inviteRef.get();

    if (!snap.exists) {
      return res.status(404).json({ error: "Invite not found" });
    }

    const invite = snap.data();

    if (invite.toUserId !== uid) {
      return res.status(403).json({ error: "Not authorized to accept this invite" });
    }

    await inviteRef.update({
      status: "accepted",
      acceptedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({
      message: "Session invite accepted",
      sessionId: invite.sessionId,
    });
  } catch (err) {
    console.error("Accept invite error:", err);
    res.status(500).json({ error: "Failed to accept invite" });
  }
});

/* =========================================
   DECLINE SESSION INVITE
   POST /invites/:inviteId/decline
========================================= */
router.post("/invites/:inviteId/decline", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { inviteId } = req.params;

    const inviteRef = db.collection("sessionInvites").doc(inviteId);
    const snap = await inviteRef.get();

    if (!snap.exists) {
      return res.status(404).json({ error: "Invite not found" });
    }

    const invite = snap.data();

    if (invite.toUserId !== uid) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await inviteRef.update({
      status: "declined",
    });

    res.json({ message: "Session invite declined" });
  } catch (err) {
    console.error("Decline invite error:", err);
    res.status(500).json({ error: "Failed to decline invite" });
  }
});

export default router;
