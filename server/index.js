import "./firebase.js"; 
import express from "express";
import cors from "cors";
import { verifyToken } from "./middleware/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import materials from "./routes/materials.js";
import calendarRoutes from "./routes/calendarRoutes.js";


const app = express();
 
// needs review: start
/* --- FIX ADDED: configure CORS explicitly for frontend on 3000 --- */ 

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions), (req, res) => {
  res.sendStatus(204); // terminate OPTIONS request);
});

// nneeds review: end

app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url, "Origin:", req.headers.origin, "Access-Control-Request-Headers:", req.headers['access-control-request-headers']);
  next();
});

//middleware call (?)
app.use(express.json());

app.use("/", authRoutes);

app.use("/", sessionRoutes);

app.use("/", materials);

app.use("/", calendarRoutes); 


app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.email}` });
});

// check if server running
app.get("/", (req, res) => {
  res.send("Firebase backend running!");
});

// server start
app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
