import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const serviceAccount = JSON.parse(
  fs.readFileSync("./config/serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const auth = admin.auth();
export const db = admin.firestore();






