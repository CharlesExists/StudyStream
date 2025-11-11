import express from "express";
import { auth, db } from "../firebase.js";

console.log("authRoutes loaded");

const router = express.Router();

router.post("/create-user", async (req, res) => {
  try {
    const { name, identifier, password, confirmPassword } = req.body;

    //  Validate base fields
    if (!name || !identifier || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    // Split name
    const [firstName, ...rest] = name.trim().split(" ");
    const lastName = rest.join(" ");

    // 2 Determine identifier type (email, phone, or username)
    const isEmail = identifier.includes("@");
    const isPhone = /^\+?[0-9]+$/.test(identifier);
    const isUsername = !isEmail && !isPhone;

    // 3If username, make sure it's unique
    if (isUsername) {
      const usernameTaken = await db
        .collection("users")
        .where("username", "==", identifier)
        .get();
      if (!usernameTaken.empty) {
        return res.status(400).json({ error: "Username already taken." });
      }
    }

    //  Create Firebase Auth user (only for email/phone)
    let userRecord;
    if (isEmail || isPhone) {
      userRecord = await auth.createUser({
        email: isEmail ? identifier : undefined,
        phoneNumber: isPhone ? identifier : undefined,
        password,
        displayName: name,
      });
    } else {
      userRecord = { uid: `username_${identifier}_${Date.now()}` };
    }

    //  Store extended info in Firestore
    await db.collection("users").doc(userRecord.uid).set({
      firstName,
      lastName,
      username: isUsername ? identifier : null,
      email: isEmail ? identifier : null,
      phoneNumber: isPhone ? identifier : null,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        uid: userRecord.uid,
        name,
        identifier,
      },
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(400).json({ error: err.message });
  }
});

export default router;
