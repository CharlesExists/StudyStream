import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const serviceAccount = JSON.parse(
  fs.readFileSync("./config/serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "studystreamnyu.firebasestorage.app"
});

console.log("Firebase Admin initialized for project:", serviceAccount.project_id);

export const auth = admin.auth();
export const db = admin.firestore();
export const bucket = admin.storage().bucket();

/* =====================================================
   Helper: Convert Firestore Timestamp → ISO string
   (Friends system expects this)
===================================================== */
export function tsToISO(ts) {
  if (!ts) return null;

  // Firestore Timestamp object
  if (ts.toDate) {
    return ts.toDate().toISOString();
  }

  // JavaScript Date object
  if (ts instanceof Date) {
    return ts.toISOString();
  }

  // Anything else: return as-is
  return ts;
}

/* =====================================================
   Test Firestore connection
===================================================== */
const testConnection = async () => {
  try {
    const docRef = db.collection("connectionTest").doc("adminCheck");
    await docRef.set({ success: true, time: new Date() });
    console.log("Firestore write successful");
  } catch (err) {
    console.error("Firestore test failed:", err);
  }
};

testConnection();
