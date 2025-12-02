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

console.log("Firebase Admin initialized for project:", serviceAccount.project_id); // log file to show that hte firebase is up and running for the project 

export const auth = admin.auth();
export const db = admin.firestore();
export const bucket = admin.storage().bucket();



const testConnection = async () => { // code that will show that the firebase
  // and github code are connected. if you run firebase.js in server in terminal, firestore write succesful should appear. 
  try {
    const docRef = db.collection("connectionTest").doc("adminCheck");
    await docRef.set({ success: true, time: new Date() });
    console.log("Firestore write successful");
  } catch (err) {
    console.error("Firestore test failed:", err);
  }
};
testConnection();


