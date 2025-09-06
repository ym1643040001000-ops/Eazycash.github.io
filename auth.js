import { auth } from "./firebase.js";
import {
  signInAnonymously, onAuthStateChanged,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export const waitUser = () =>
  new Promise(res => onAuthStateChanged(auth, u => res(u)));

export async function ensureAuth() {
  let u = auth.currentUser;
  if (!u) await signInAnonymously(auth);
  return waitUser();
}

export async function register(email, pass){
  const c = await createUserWithEmailAndPassword(auth,email,pass);
  return c.user;
}
export async function login(email, pass){
  const c = await signInWithEmailAndPassword(auth,email,pass);
  return c.user;
}
export async function logout(){ await signOut(auth); }
