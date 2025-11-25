import express from "express";
import multer from "multer";
import { db, bucket } from "../firebase.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import cors from "cors";

const router = express.Router();

/* --------------------------------------------------------
   FIX: Allow preflight OPTIONS request for file upload
   This MUST come BEFORE verifyToken blocks OPTIONS calls
--------------------------------------------------------- */
router.options("/materials/upload", (req, res) => {
    res.set("Access-Control-Allow-Origin", "http://localhost:3000");
    res.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.sendStatus(204);
  });

// Multer: node / express stuff used for dealing with file 
const upload = multer({ storage: multer.memoryStorage() });

// Uploading 
router.post("/materials/upload",
  upload.single("file"),  // <-- MUST come BEFORE verifyToken
  verifyToken,
  async (req, res) => {
    console.log("HIT /materials/upload ROUTE");
    
    try {
      const uid = req.user.uid;
      const file = req.file;
      const { title, isShared } = req.body;

      if (!file) {
        return res.status(400).json({ error: "File is required." });
      }
      
      const rawTitle = (title || "").trim();
      const finalTitle = rawTitle || file.originalname;
      
      const filename = `${uid}/${Date.now()}_${file.originalname}`;
      const fileUpload = bucket.file(filename);

      await fileUpload.save(file.buffer, {
        metadata: { contentType: file.mimetype },
      });

      const [fileUrl] = await fileUpload.getSignedUrl({
        action: "read",
        expires: "03-01-2030",
      });

      const sharedFlag = isShared === "true" || isShared === true;
      const sizeKB = Math.round(file.size / 1024);

      const newMaterial = {
        ownerId: uid,
        title: finalTitle,
        filename,
        fileUrl,
        fileType: file.mimetype,
        sizeKB,
        isShared: sharedFlag,
        createdAt: new Date(),
      };

      const docRef = await db
        .collection("users")
        .doc(uid)
        .collection("materials")
        .add(newMaterial);

      return res.json({
        message: "Material uploaded",
        id: docRef.id,
        material: newMaterial,
      });
    } catch (err) {
      console.error("Upload error:", err);
      return res.status(500).json({ error: err.message });
    }
  }
);

//  get materials
router.get("/materials", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
 // firestone 
    const materialsSnap = await db
      .collection("users")
      .doc(uid)
      .collection("materials")
      .orderBy("createdAt", "desc")
      .get();

    const materials = materialsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.json(materials);
  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(500).json({ error: err.message });
  }
});

//  delete
router.delete("/materials/:id", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { id } = req.params;

    // firestone
    const docRef = db
      .collection("users")
      .doc(uid)
      .collection("materials")
      .doc(id);

    const snap = await docRef.get();

    if (!snap.exists) {
      return res.status(404).json({ error: "Material not found." });
    }

    const data = snap.data();

    // Delete file from Storage if filename is present
    if (data.filename) {
      await bucket.file(data.filename).delete().catch((err) => {
        console.warn("Storage delete error:", err.message || err);
      });
    }

    // Delete Firestore doc
    await docRef.delete();

    return res.json({ message: "Material deleted." });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
