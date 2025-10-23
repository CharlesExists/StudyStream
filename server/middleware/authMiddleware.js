import { auth } from "../firebase.js";

export const verifyToken = async (req, res, next) => {
  const header = req.headers.authorization;

  // if no token provided
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = header.split(" ")[1];

  try {

    // Verify Firebase ID token
    const decoded = await auth.verifyIdToken(token);
    req.user = decoded;

    next(); 
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};