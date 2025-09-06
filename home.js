import { db } from './firebase.js';
import { ref, onValue, set, push } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const NAMES = ["Ahmed","Mohamed","Omar","Youssef","Hassan","Mostafa","Khaled","Hany","Mahmoud","Amr","Eslam","Yazan","Habiba","Nour","Mona","Nadine","Alaa","Ramy","Karim","Salma"];
function randAmount(){ return [1500,1650,1800,6182,4613,2350,2975,4120,5230,1990][Math.floor(Math.random()*10)]; }
function randName(){ return `${NAMES[Math.floor(Math.random()*NAMES.length)]} ${["A.","M.","S.","H.","K.","N."][Math.floor(Math.random()*6)]}`; }

export function loadHome(user){
  const balEl = document.getElementById('totalBalance');
  onValue(ref(db, `users/${user.uid}/balance`), (snap)=>{
    const v = snap.exists()? snap.val():0;
    balEl.textContent = `${Number(v).toLocaleString('ar-EG')} جنيه`;
  });

  const ticker = document.getElementById('ticker');
  function pushItem(){
    const isBuy = Math.random()>0.5;
    const item = document.createElement('span');
    item.className='badge ' + (isBuy?'up':'down');
    item.textContent = `${randName()} ${isBuy?'شراء':'بيع'} ${randAmount()} جنيه`;
    ticker.appendChild(item);
    if(ticker.children.length>30) ticker.removeChild(ticker.firstChild);
  }
  for(let i=0;i<25;i++) pushItem();
  setInterval(pushItem, 1200);

  const pairs = ["BTC/EGP","ETH/EGP","USDT/EGP","SOL/EGP"];
  const grid = document.getElementById('pairsGrid');
  pairs.forEach(p=>{
    const card = document.createElement('div');
    card.className='card';
    card.innerHTML = `
      <div class="row space">
        <div class="title">${p}</div>
        <div id="p-${p.replace('/','-')}" class="price">—</div>
      </div>
      <div class="row gap mt-1">
        <a class="btn" href="market.html">شراء</a>
        <a class="btn ghost" href="market.html">بيع</a>
      </div>`;
    grid.appendChild(card);
    onValue(ref(db, `prices/${p.replace('/','_')}`), (s)=>{
      const el = document.getElementById(`p-${p.replace('/','-')}`);
      if(s.exists()){
        const {price,change=0}=s.val();
        el.innerHTML = `${Number(price).toLocaleString('ar-EG')} <span class="badge ${change>=0?'up':'down'}">${change>=0?'+':''}${change}%</span>`;
      }else{
        el.textContent='—';
      }
    });
  });

  // optional first-run seed for prices
  const seedRef = ref(db, 'meta/seeded');
  onValue(seedRef,(s)=>{
    if(!s.exists()){
      const base = { "BTC_EGP": {price:2850000, change:1.2}, "ETH_EGP": {price:170000, change:-0.8}, "USDT_EGP": {price:50, change:0}, "SOL_EGP": {price:6500, change:2.1} };
      Object.entries(base).forEach(([k,v])=> set(ref(db, `prices/${k}`), v));
      set(seedRef, true);
    }
  }, {onlyOnce:true});
                                                                                                                           }
  
