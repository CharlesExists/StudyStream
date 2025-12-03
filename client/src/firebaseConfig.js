import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_r2GI-l-vG5L7fHTfKFu7TFnBnLWRUqU",
  authDomain: "studystreamnyu.firebaseapp.com",
  projectId: "studystreamnyu",
  storageBucket: "studystreamnyu.firebasestorage.app",
  messagingSenderId: "675939749953",
  appId: "1:675939749953:web:ae8161c7a277bea29d76c0",
  measurementId: "G-VBE8D3V6PH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and firestore
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);