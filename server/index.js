import "./firebase.js"; 
import express from "express";
import cors from "cors";
import { verifyToken } from "./middleware/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";


const app = express();

/* --- FIX ADDED: configure CORS explicitly for frontend on 3000 --- */
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors()); 




//middleware call (?)
app.use(express.json());

app.use("/", authRoutes);

app.use("/", sessionRoutes);

app.use("/", materialRoutes);


app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.email}` });
});

// check if server running
app.get("/", (req, res) => {
  res.send("Firebase backend running!");
});

// server start
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
