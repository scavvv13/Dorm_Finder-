// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import getStorage for Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyCttGMzaF2mxY-OU7uM2i32ngP2rUt0Rb4",
  authDomain: "villfinder-b5928.firebaseapp.com",
  projectId: "villfinder-b5928",
  storageBucket: "villfinder-b5928.appspot.com",
  messagingSenderId: "114974563943",
  appId: "1:114974563943:web:74bcc3b4b2401ce5793ec2",
  measurementId: "G-F644NBGP6R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage
const googleProvider = new GoogleAuthProvider();

// Set auth persistence to browser local
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

export { auth, db, storage, googleProvider }; // Export storage along with auth and db
