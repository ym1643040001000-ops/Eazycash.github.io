import { db } from './firebase.js';
import { ref, onValue, update, get, push, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const PAIRS = ["BTC/EGP","ETH/EGP","USDT/EGP","SOL/EGP"];

async function getBalance(uid){
  const s = await get(ref(db, `users/${uid}/balance`));
  return s.exists()? s.val():0;
}

async function setBalance(uid, value){
  await update(ref(db, `users/${uid}`), { balance: value });
}

export function loadMarket(user){
  const grid = document.getElementById('marketGrid');
  grid.innerHTML='';
  PAIRS.forEach(p=>{
    const id = p.replace('/','_');
    const wrap = document.createElement('div');
    wrap.className='card';
    wrap.innerHTML = `
      <div class="row space">
        <div class="title">${p}</div>
        <div id="price-${id}" class="price">—</div>
      </div>
      <div class="row gap mt-1">
        <input id="qty-${id}" class="input" type="number" min="0.0001" step="0.0001" placeholder="الكمية"/>
      </div>
      <div class="row gap mt-1">
        <button class="btn" id="buy-${id}">شراء</button>
        <button class="btn ghost" id="sell-${id}">بيع</button>
      </div>
      <div id="msg-${id}" class="muted mt-1"></div>
    `;
    grid.appendChild(wrap);

    onValue(ref(db, `prices/${id.replace('/','_')}`), (s)=>{
      const el = document.getElementById(`price-${id}`);
      if(s.exists()){
        const {price,change=0}=s.val();
        el.innerHTML = `${Number(price).toLocaleString('ar-EG')} <span class="badge ${change>=0?'up':'down'}">${change>=0?'+':''}${change}%</span>`;
      }
    });

    const buyBtn  = wrap.querySelector(`#buy-${id}`);
    const sellBtn = wrap.querySelector(`#sell-${id}`);
    const qtyEl   = wrap.querySelector(`#qty-${id}`);
    const msgEl   = wrap.querySelector(`#msg-${id}`);

    async function trade(side){
      msgEl.textContent='';
      const s = await get(ref(db, `prices/${id}`));
      if(!s.exists()) { msgEl.textContent='لا يوجد سعر'; return; }
      const price = s.val().price;
      const qty   = parseFloat(qtyEl.value||'0');
      if(qty<=0){ msgEl.textContent='أدخل كمية صحيحة'; return; }
      const cost  = side==='BUY' ? price*qty : -(price*qty);
      const bal   = await getBalance(user.uid);
      if(side==='BUY' && bal < cost){ msgEl.textContent='رصيد غير كافٍ'; return; }
      await setBalance(user.uid, bal - cost);
      const ordRef = push(ref(db, `orders/${user.uid}`));
      await set(ordRef, { pair:p, side, qty, price, value: price*qty, ts: Date.now() });
      msgEl.textContent = side==='BUY' ? 'تم الشراء ✅' : 'تم البيع ✅';
    }

    buyBtn.onclick  = ()=> trade('BUY');
    sellBtn.onclick = ()=> trade('SELL');
  });
}
