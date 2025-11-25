

import express from "express";
import { db, bucket } from "../firebase.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

//
//  /calendar/event
 // Body: { title, description?, startTime, endTime }
 
router.post("/calendar/event", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { title, description, startTime, endTime } = req.body;

    if (!title || !startTime || !endTime) {
      return res.status(400).json({ error: "Missing required fields." });
    }


    // potential calendar event
    const event = {
      title,
      description: description || "",
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      source: "local",
      createdAt: new Date()
    };

    //firestone 
    const docRef = await db
      .collection("users")
      .doc(uid)
      .collection("calendarEvents")
      .add(event);

    res.status(201).json({
      message: "Event created",
      eventId: docRef.id,
      event
    });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: err.message });
  }
});


 //GET /calendar/events
 // Returns upcoming events sorted by startTime
 
router.get("/calendar/events", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;

    const snap = await db
      .collection("users")
      .doc(uid)
      .collection("calendarEvents")
      .orderBy("startTime", "asc")
      .get();

    const events = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({
      message: "Events fetched",
      count: events.length,
      events
    });
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: err.message });
  }
});


 //DELETE /calendar/event/:id
 
router.delete("/calendar/event/:id", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { id } = req.params;

    const ref = db
      .collection("users")
      .doc(uid)
      .collection("calendarEvents")
      .doc(id);

    await ref.delete();

    res.status(200).json({ message: "Event deleted" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
