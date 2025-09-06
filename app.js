import { auth, db } from "./firebase.js";
import {  
  createUserWithEmailAndPassword,  
  signInWithEmailAndPassword,  
  signOut  
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {  
  ref, set, update, get  
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

(function(){
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  if(location.pathname.endsWith("index.html") || location.pathname=="/" ){
    const introSeen = sessionStorage.getItem("introSeen");
    if(!introSeen){
      const l = document.getElementById("global-loader");
      l.classList.remove("hidden");
      setTimeout(()=>{  
        l.classList.add("hidden");  
        sessionStorage.setItem("introSeen","1");  
      }, 5000);
    }
  }

  $$("a[href$='.html']").forEach(a=>{
    a.addEventListener("click", e=>{
      const l = document.getElementById("global-loader");  
      if(!l) return;
      l.classList.remove("hidden");
      setTimeout(()=>{}, 200);
    });
  });

  const dict = {
    ar: {
      home:"الرئيسية", payments:"سحب/إيداع", profile:"الملف", login:"دخول", lang:"EN",
      balance_card_title:"الرصيد الحالي", profit_card_title:"أرباحك من التجارة",
      actions_deposit:"إيداع", actions_withdraw:"سحب", actions_buy:"شراء", actions_sell:"بيع",
      actions_trades:"صفقاتي", actions_spin:"سبين", actions_rewards:"مكافآتي",
      earnings:"أرباح مستخدمين", orders:"عدد طلبات", view_all:"عرض الكل", market:"السوق"
    },
    en: {
      home:"Home", payments:"Payments", profile:"Profile", login:"Login", lang:"AR",
      balance_card_title:"Current Balance", profit_card_title:"Your Trading Profit",
      actions_deposit:"Deposit", actions_withdraw:"Withdraw", actions_buy:"Buy", actions_sell:"Sell",
      actions_trades:"My Trades", actions_spin:"Spin", actions_rewards:"Rewards",
      earnings:"Users Earnings", orders:"Orders Count", view_all:"View All", market:"Market"
    }
  };

  const langToggle = $("#langToggle");
  if(langToggle){
    langToggle.addEventListener("click", ()=>{
      const current = document.body.getAttribute("lang") || "ar";
      const next = current==="ar" ? "en" : "ar";
      document.body.setAttribute("lang", next);
      $$("[data-i18n]").forEach(el=>{
        const key = el.getAttribute("data-i18n");
        if(dict[next][key]) el.textContent = dict[next][key];
      });
      langToggle.textContent = dict[next].lang;
    });
  }
})();

// Firebase Functions
export async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    await set(ref(db, 'users/' + uid), {
      email: email,
      balance: 0,
      role: "user"
    });
    alert("User Registered!");
  } catch (error) {
    alert("Error: " + error.message);
  }
}

export async function loginUser(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Logged in!");
  } catch (error) {
    alert("Error: " + error.message);
  }
}

export async function logoutUser() {
  await signOut(auth);
  alert("Logged out!");
}

export async function getUsersCount() {
  const snapshot = await get(ref(db, 'users'));
  if (snapshot.exists()) {
    const users = snapshot.val();
    return Object.keys(users).length;
  }
  return 0;
}

export async function sendProfit(uid, amount) {
  const userRef = ref(db, 'users/' + uid);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    let currentBalance = snapshot.val().balance || 0;
    await update(userRef, { balance: currentBalance + amount });
    alert(`Profit sent: ${amount}`);
  } else {
    alert("User not found");
  }
}

export async function setCurrencyPrice(symbol, price) {
  await set(ref(db, 'currencies/' + symbol), {
    price: price
  });
  alert(`${symbol} price updated: ${price}`);
}

export async function getCurrencyPrice(symbol) {
  const snapshot = await get(ref(db, 'currencies/' + symbol));
  if (snapshot.exists()) {
    return snapshot.val().price;
  }
  return null;
    }
    
