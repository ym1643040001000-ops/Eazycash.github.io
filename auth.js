import { auth, db } from "./firebase.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { ref, set, get } from "firebase/database";

export async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    await set(ref(db, "users/" + uid), {
      email: email,
      balance: 0,
      role: "user"
    });
    alert("تم التسجيل بنجاح ✅");
  } catch (error) {
    alert("خطأ: " + error.message);
  }
}

export async function loginUser(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("تم تسجيل الدخول ✅");
    window.location.href = "profile.html";
  } catch (error) {
    alert("خطأ: " + error.message);
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
    alert("تم تسجيل الخروج ✅");
    window.location.href = "login.html";
  } catch (error) {
    alert("خطأ: " + error.message);
  }
}

export function watchAuth() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("مستخدم مسجل:", user.email);
    } else {
      console.log("لا يوجد مستخدم مسجل دخول");
    }
  });
}
  
