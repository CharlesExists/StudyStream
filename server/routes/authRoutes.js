import express from "express";
import { auth } from "../firebase.js";

const router = express.Router();

router.post("/create-user", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await auth.createUser({ email, password });
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

export default router;




