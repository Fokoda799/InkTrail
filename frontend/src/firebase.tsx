// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blogify-auth-893b7.firebaseapp.com",
  projectId: "blogify-auth-893b7",
  storageBucket: "blogify-auth-893b7.appspot.com",
  messagingSenderId: "362748339211",
  appId: "1:362748339211:web:4a89fedccf2abe52f9130e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);