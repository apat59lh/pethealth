// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEsqOEgFKZl_KO0zpj57x_VIYB4dKUrT8",
  authDomain: "pawtracker-app.firebaseapp.com",
  projectId: "pawtracker-app",
  storageBucket: "pawtracker-app.firebasestorage.app",
  messagingSenderId: "935331792213",
  appId: "1:935331792213:web:60d3c65d2108635461dbdc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;