import express from "express";
import { verifyToken } from "./middleware/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

//middleware call (?)
app.use(express.json());

app.use("/", authRoutes);

app.get("/protected", verifyToken, (req, res) =>{
    res.json({message: `Welcome, ${req.user.email}`});
});

// check if server running
app.get("/", (req, res) => {
  res.send("Firebase backend running!");
});

// server start
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});