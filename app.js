import { db } from "./firebase.js";
import { ensureAuth, login, logout } from "./auth.js";
import {
  ref, get, set, update, push, onValue, onChildAdded
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// ---------- helpers ----------
const $ = s => document.querySelector(s);
const uidPath = uid => `users/${uid}`;
const balRef = uid => ref(db, `${uidPath(uid)}/balance`);
const txCol = uid => ref(db, `transactions/${uid}`);
const tickerRef = ref(db, "ticker");
const pairsRef = ref(db, "pairs");

// ---------- boot (auth anon to read/write automatically) ----------
const user = await ensureAuth();
const uid = user.uid;

// ---------- seed (once) ----------
async function seedOnce(){
  const seeded = await get(ref(db,"meta/seeded"));
  if(!seeded.exists()){
    await set(pairsRef,{
      "BTC_EGP": {name:"BTC/EGP", price:1582766, dir:"up"},
      "ETH_EGP": {name:"ETH/EGP", price:376635, dir:"down"},
      "USDT_EGP": {name:"USDT/EGP", price:30.00, dir:"up"},
      "BNB_EGP": {name:"BNB/EGP", price:32463, dir:"down"}
    });
    await set(ref(db,`${uidPath(uid)}`),{ balance:0, createdAt:Date.now() });
    await set(ref(db,"meta/seeded"), true);
  } else {
    // تأكد للمستخدم الحالي
    const uSnap = await get(ref(db,uidPath(uid)));
    if(!uSnap.exists()) await set(ref(db,uidPath(uid)),{ balance:0, createdAt:Date.now() });
  }
}
await seedOnce();

// ---------- balance live ----------
onValue(balRef(uid),(s)=>{
  const v = s.exists()? s.val() : 0;
  $("#balance").textContent = `EGP ${Number(v).toLocaleString("en-EG")}`;
});

// ---------- deposit / withdraw ----------
$("#btnDeposit").addEventListener("click", async ()=>{
  const a = Number(prompt("قيمة الإيداع بالجنيه:", "500"))||0;
  if(a<=0) return;
  const cur = (await get(balRef(uid))).val()||0;
  await update(ref(db,uidPath(uid)),{ balance: cur + a });
  await push(txCol(uid),{ type:"deposit", amount:a, at:Date.now() });
});

$("#btnWithdraw").addEventListener("click", async ()=>{
  const a = Number(prompt("قيمة السحب بالجنيه:", "300"))||0;
  if(a<=0) return;
  const cur = (await get(balRef(uid))).val()||0;
  if(a>cur) return alert("الرصيد غير كافٍ");
  await update(ref(db,uidPath(uid)),{ balance: cur - a });
  await push(txCol(uid),{ type:"withdraw", amount:a, at:Date.now() });
});

// ---------- login/logout demo (بسيط) ----------
$("#loginBtn").addEventListener("click", async ()=>{
  const email = prompt("Email:"); const pass = prompt("Password:");
  if(!email||!pass) return;
  try{
    await login(email,pass);
    alert("تم تسجيل الدخول");
    $("#loginBtn").style.display="none"; $("#logoutBtn").style.display="inline-block";
  }catch{ alert("فشل الدخول"); }
});
$("#logoutBtn").addEventListener("click", async ()=>{
  await logout(); location.reload();
});

// ---------- ticker (أسماء ومبالغ عشوائية) ----------
const names = ["Ahmed","Youssef","Nour","Salma","Hossam","Omar","Mariam","Khaled","Hagar","Mostafa","Rana","Fares","Ali","Nada","Yara","Ziad"];
function randAmount(){
  const list = [1500,1650,1800,4613,6182,2440,5030,7921,3310,2845,1999,7250,4150,3666,9810];
  return list[Math.floor(Math.random()*list.length)];
}
function randRow(){
  const n = names[Math.floor(Math.random()*names.length)];
  const act = Math.random()>.5 ? "شراء" : "بيع";
  return { text:`${n} ${act} ${randAmount().toLocaleString("en-EG")} جنيه`, at:Date.now() };
}
// املأ تلقائيًا إن فاضي
(async ()=>{
  const snap = await get(tickerRef);
  if(!snap.exists()) for(let i=0;i<12;i++) await push(tickerRef, randRow());
})();
onChildAdded(tickerRef,(s)=>{
  const el = document.createElement("span");
  el.textContent = s.val().text;
  $("#tickerLane").appendChild(el);
});

// ---------- market pairs (4 أزواج متحركة من القاعدة) ----------
function drawPairs(obj){
  const host = $("#pairs"); host.innerHTML="";
  Object.entries(obj||{}).forEach(([k,v])=>{
    const d = document.createElement("div");
    d.className = "pair";
    d.innerHTML = `
      <div>
        <div class="title">${v.name}</div>
        <div class="sub ${v.dir==='up'?'up':'down'}">${v.dir==='up'?'▲':'▼'} ${v.price}</div>
      </div>
      <div class="row">
        <button class="chip buy" data-k="${k}">شراء</button>
        <button class="chip sell" data-k="${k}">بيع</button>
      </div>`;
    host.appendChild(d);
  });
}
onValue(pairsRef,(s)=> drawPairs(s.val()||{}));

// شراء/بيع بسيط يخصم/يزود الرصيد
document.addEventListener("click", async (e)=>{
  if(e.target.matches(".buy,.sell")){
    const k = e.target.getAttribute("data-k");
    const amt = Number(prompt(`المبلغ بالجنيه (${e.target.classList.contains('buy')?'شراء':'بيع'}) :`, "1000"))||0;
    if(amt<=0) return;
    const cur = (await get(balRef(uid))).val()||0;
    const isBuy = e.target.classList.contains("buy");
    const nb = isBuy ? cur - amt : cur + amt;
    if(isBuy && nb<0) return alert("الرصيد غير كافٍ");
    await update(ref(db,uidPath(uid)),{ balance: nb });
    await push(txCol(uid),{ type:isBuy?"buy":"sell", pair:k, amount:amt, at:Date.now() });
  }
});

// روابط تجريبية
$("#goSpin").addEventListener("click", ()=> location.href="./spin.html");
$("#goProfile").addEventListener("click", ()=> location.href="./profile.html");
$("#goBuy").addEventListener("click", ()=> alert("واجهة الشراء التفصيلية لاحقًا"));
$("#goSell").addEventListener("click", ()=> alert("واجهة البيع التفصيلية لاحقًا"));
    

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
    
