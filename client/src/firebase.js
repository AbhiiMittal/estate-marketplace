// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "estate-mern-10c9b.firebaseapp.com",
  projectId: "estate-mern-10c9b",
  storageBucket: "estate-mern-10c9b.appspot.com",
  messagingSenderId: "923723530304",
  appId: "1:923723530304:web:5f644113bbfa33180c9fa5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);