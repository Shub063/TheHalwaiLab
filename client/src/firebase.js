// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCqEEgpMHhoD-ysd51h0Rm-TDwwcpGm3rQ",
  authDomain: "the-halwai-lab.firebaseapp.com",
  projectId: "the-halwai-lab",
  storageBucket: "the-halwai-lab.firebasestorage.app",
  messagingSenderId: "48833489225",
  appId: "1:48833489225:web:890f70b25d2eb885879298",
  measurementId: "G-1NYLTKYGLF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, auth, analytics }; 