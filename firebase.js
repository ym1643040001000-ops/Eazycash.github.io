import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAOGHBrIW5aLPyhqC6fbmbglRdOhWv0XXU",
  authDomain: "eazy-cash-8c5fa.firebaseapp.com",
  databaseURL: "https://eazy-cash-8c5fa-default-rtdb.firebaseio.com",
  projectId: "eazy-cash-8c5fa",
  storageBucket: "eazy-cash-8c5fa.firebasestorage.app",
  messagingSenderId: "693700754830",
  appId: "1:693700754830:web:2eb64b511ecc7d325338df",
  measurementId: "G-ZEHXF93PFJ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
