import express from "express";
import { db } from "../firebase.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
// EXP
const XP_PER_MINUTE = 2; // you gain 2 xp points for every minute you are in a session

function xpRequiredForLevel(level) {
    const segment = Math.floor(level / 10);  // Math: account levels update upon session ending. Account levels increase in "difficulty" every 10 levels.
    return 60 * (segment + 1);               // for levels 1-10, you need 60 experience points (or 30 minutes) to level up. 
                                            // the amount of time will double every next level segment. so levels 11-20 will require 120 xp (one hour) per level,
                                            // so and so forth. 
  }



const ALLOWED_METHODS = {
    solo: ["notes", "flashcards", "quiz"],
    group: ["notes", "quiz"]   // updated group settings
  };

// session start
router.post("/session/start", verifyToken, async (req, res) => {
    try {
      const { sessionType, topic, method, duration } = req.body;
      const uid = req.user.uid;
  
   // validation 

      if (!sessionType || !topic || !method || !duration) {
        return res.status(400).json({ error: "Missing required fields." });
      }
  
      if (!ALLOWED_METHODS[sessionType]) {
        return res.status(400).json({ error: "Invalid session type." });
      }
  
    
      if (!ALLOWED_METHODS[sessionType].includes(method)) {
        return res.status(400).json({
          error: `${method} is not allowed for ${sessionType} sessions.`
        });
      }
  
      // Create session data
      const newSession = {
        sessionType,  
        topic,
        method,
        durationPlanned: duration,
        durationCompleted: 0,
        startTime: new Date(),
        endTime: null,
        groupId: null, //placeholder
        settingsSnapshot: {
          topic,
          method,
          timer: duration,
        },
      };
  
      // Save to Firestore in firebase
      const docRef = await db
        .collection("users")
        .doc(uid)
        .collection("sessions")
        .add(newSession);
  
      res.status(201).json({
        message: "Session started",
        sessionId: docRef.id,
        session: newSession,
      });
  
    } catch (err) {
      console.error("Error starting session:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // session end 
router.post("/session/end", verifyToken, async (req, res) => {
    try {
      const { sessionId } = req.body;

      const uid = req.user.uid;
  
      if (!sessionId) { // failsafe
        return res.status(400).json({ error: "sessionId is required." });
      }
  
    
      const sessionRef = db

        .collection("users")
        .doc(uid)
        .collection("sessions")
        .doc(sessionId);
  
      const sessionSnap = await sessionRef.get();
  // find session
      if (!sessionSnap.exists) {
        return res.status(404).json({ error: "Session not found." });
      }
  
      const sessionData = sessionSnap.data();
  
      // find time complete 
      const start = sessionData.startTime.toDate();
      const end = new Date();
      const durationCompleted = Math.floor((end - start) / 60000); // minutes
      
      // EXP earned

      const xpEarned = durationCompleted * XP_PER_MINUTE;  
      
      
      // Get user data and calculate xp levels
      const userRef = db.collection("users").doc(uid);
      const userSnap = await userRef.get();
      const user = userSnap.data();
  

      let currentXP = user.xp ?? 0;
      let currentLevel = user.level ?? 1;
      
      let newXP = currentXP + xpEarned;
      let newLevel = currentLevel;
      
  
      // loop for multi levellling 
      while (newXP >= xpRequiredForLevel(newLevel)) {
        newXP -= xpRequiredForLevel(newLevel);
        newLevel++;
      }
  

       
      // Update session with endTime + completed time
      await sessionRef.update({
        endTime: end,
        durationCompleted
      });

      // Update user levels
    await userRef.update({
        xp: newXP,
        level: newLevel
      });
   /// returning status with  info
      res.status(200).json({
        message: "Session ended",
        durationCompleted,
        xpEarned,
        xpAfter: newXP,
        newLevel,
        endTime: end
      });


    } catch (err) {
      console.error("Error ending session:", err);
      res.status(500).json({ error: err.message });
    }
  });
  
  
  export default router;