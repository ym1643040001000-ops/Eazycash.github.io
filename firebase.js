import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
