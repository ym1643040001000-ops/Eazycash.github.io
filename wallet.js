import { db } from './firebase.js';
import { ref, push, set, get, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

async function getBalance(uid){
  const s = await get(ref(db, `users/${uid}/balance`));
  return s.exists()? s.val():0;
}
async function setBalance(uid, v){ await update(ref(db, `users/${uid}`), { balance:v }); }

export function setupWallet(user){
  const depAmount = document.getElementById('depAmount');
  const depMethod = document.getElementById('depMethod');
  const depBtn    = document.getElementById('depositBtn');
  const depMsg    = document.getElementById('depMsg');

  const wdAmount  = document.getElementById('wdAmount');
  const wdMethod  = document.getElementById('wdMethod');
  const wdBtn     = document.getElementById('withdrawBtn');
  const wdMsg     = document.getElementById('wdMsg');

  depBtn.onclick = async ()=>{
    depMsg.textContent='';
    const amt = Number(depAmount.value||0);
    if(amt<10) { depMsg.textContent='الحد الأدنى 10'; return; }
    const tx = push(ref(db, `transactions/${user.uid}`));
    await set(tx, { type:'DEPOSIT', amount:amt, method:depMethod.value, status:'✅', ts:Date.now() });
    const bal = await getBalance(user.uid);
    await setBalance(user.uid, bal + amt);
    depMsg.textContent='تم تسجيل الإيداع ✅';
    depAmount.value='';
  };

  wdBtn.onclick = async ()=>{
    wdMsg.textContent='';
    const amt = Number(wdAmount.value||0);
    if(amt<50) { wdMsg.textContent='الحد الأدنى 50'; return; }
    const bal = await getBalance(user.uid);
    if(bal<amt){ wdMsg.textContent='رصيد غير كافٍ'; return; }
    const tx = push(ref(db, `transactions/${user.uid}`));
    await set(tx, { type:'WITHDRAW', amount:amt, method:wdMethod.value, status:'⏳', ts:Date.now() });
    await setBalance(user.uid, bal - amt);
    wdMsg.textContent='تم إنشاء طلب السحب ⏳';
    wdAmount.value='';
  };
}
