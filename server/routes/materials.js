import express from "express";
import multer from "multer";
import admin from "firebase-admin";
import { db } from "../firebase.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Memory storage for multer
const upload = multer({ storage: multer.memoryStorage() });

// Firebase bucket
const bucket = admin.storage().bucket("studystreamnyu.firebasestorage.app");

/*
---------------------------------------------------------
   CREATE MATERIAL
   POST /materials/create
---------------------------------------------------------
*/

router.post(
  "/materials/create",
  verifyToken,
upload.single("file"),
  async (req, res) => {
    try {
      const uid = req.user.uid;
      const { type, title, shared } = req.body;

      if (!type || !title) {
        return res.status(400).json({ error: "Missing required fields." });
      }

      if (!["file", "flashcards"].includes(type)) {
        return res.status(400).json({ error: "Invalid material type." });
      }

      let fileUrl = null;
      let filePath = null;
      let flashcardsData = null;

      /* ===============================
         FILE MATERIAL
      =============================== */
      if (type === "file") {
        if (!req.file) {
          return res
            .status(400)
            .json({ error: "File upload required for type 'file'." });
        }

        const file = req.file;
        filePath = `materials/${uid}/${Date.now()}-${file.originalname}`;
        const fileRef = bucket.file(filePath);

        await fileRef.save(file.buffer, {
          metadata: { contentType: file.mimetype },
        });

        const [url] = await fileRef.getSignedUrl({
          action: "read",
          expires: "03-01-2035",
        });

        fileUrl = url;
      }

      /* ===============================
         FLASHCARDS MATERIAL
      =============================== */
      if (type === "flashcards") {
        try {
          flashcardsData = JSON.parse(req.body.flashcards);
        } catch (err) {
          return res.status(400).json({ error: "Invalid flashcards JSON." });
        }

        if (!Array.isArray(flashcardsData)) {
          return res
            .status(400)
            .json({ error: "Flashcards must be an array." });
        }
      }

      /* ===============================
          MATERIAL OBJECT
      =============================== */
      const materialData = {
        title,
        type,
        ownerId: uid,
        shared: shared === "true" || shared === true,
        fileUrl: fileUrl || null,
        filePath: filePath || null, // IMPORTANT
        flashcards: flashcardsData || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save under user collection
      const userRef = db
    .collection("users")
    .doc(uid)
    .collection("materials");

    const docRef = await userRef.add(materialData);

        // Add to shared list if shared
    if (materialData.shared) {
  await db.collection("sharedMaterials").doc(docRef.id).set({
    materialId: docRef.id,
    ownerId: uid,
    title,
    type,
    fileUrl,
    filePath,
    createdAt: materialData.createdAt,
  });
    }

      res.status(201).json({
        message: "Material created",
        materialId: docRef.id,
        material: materialData,
      });
    } catch (err) {
      console.error("Error creating material:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

/*
---------------------------------------------------------
   GET USER MATERIALS
---------------------------------------------------------
*/

router.get("/materials", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid; // <-- FIXED VARIABLE NAME

    const snap = await db
      .collection("users")
      .doc(uid)
      .collection("materials")
      .orderBy("createdAt", "desc")
      .get();

    const materials = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      message: "Materials fetched",
      materials,
    });
  } catch (err) {
    console.error("Error fetching materials:", err);
    res.status(500).json({ error: err.message });
  }
});

/*
---------------------------------------------------------
   GET SHARED MATERIALS
---------------------------------------------------------
*/

router.get("/materials/shared", verifyToken, async (req, res) => {
  try {
    const snap = await db
      .collection("sharedMaterials")
      .orderBy("createdAt", "desc")
      .get();

    const sharedMaterials = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      message: "Shared materials fetched",
      sharedMaterials,
    });
  } catch (err) {
    console.error("Error fetching shared materials:", err);
    res.status(500).json({ error: err.message });
  }
});

/*
---------------------------------------------------------
   DELETE MATERIAL
---------------------------------------------------------
*/

router.delete("/materials/:materialId", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { materialId } = req.params;

    const materialRef = db
      .collection("users")
      .doc(uid)
      .collection("materials")
      .doc(materialId);

    const materialSnap = await materialRef.get();

    if (!materialSnap.exists) {
      return res.status(404).json({ error: "Material not found." });
    }

    const material = materialSnap.data();

    // Delete file from storage properly using filePath
    if (material.type === "file" && material.filePath) {
      try {
        const file = bucket.file(material.filePath);
        await file.delete();
        console.log("Deleted file:", material.filePath);
      } catch (err) {
        console.warn(
          "Failed to delete file from storage (may already be removed)."
        );
      }
    }

    // Delete Firestore material
    await materialRef.delete();

    // Remove from sharedMaterials
    await db.collection("sharedMaterials").doc(materialId).delete().catch(() => {});

    res.status(200).json({
      message: "Material deleted",
      materialId,
    });
  } catch (err) {
    console.error("Error deleting material:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
