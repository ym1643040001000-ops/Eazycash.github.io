<!DOCTYPE html>
<html lang="ar">
<head>
  <meta charset="UTF-8">
  <title>Eazy Cash - الرئيسية</title>
  <link rel="stylesheet" href="css/style.css">
  <style>
    body { font-family: Tahoma; background:#121212; color:#fff; margin:0; padding:0;}
    header { background:#f39c12; padding:20px; text-align:center;}
    nav button { margin:5px; padding:10px; border:none; border-radius:8px; cursor:pointer;}
    section { padding:20px;}
    .card { background:#1e1e1e; margin:10px; padding:20px; border-radius:12px; box-shadow:0 0 10px rgba(0,0,0,0.5);}
    .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:15px;}
    table { width:100%; border-collapse:collapse;}
    td,th { border:1px solid #444; padding:8px;}
    .success {color:#2ecc71;}
    .danger {color:#e74c3c;}
  </style>
</head>
<body>
  <header>
    <h1>لوحة التحكم الرئيسية</h1>
    <p id="welcome"></p>
    <nav>
      <button onclick="window.location='deposit.html'">إيداع</button>
      <button onclick="window.location='withdraw.html'">سحب</button>
      <button onclick="window.location='market.html'">ماركت</button>
      <button onclick="logout()">تسجيل خروج</button>
    </nav>
  </header>

  <section class="grid">
    <div class="card"><h3>رصيدك</h3><p id="balance">0 USD</p></div>
    <div class="card"><h3>بريدك</h3><p id="email"></p></div>
    <div class="card"><h3>آخر عملية</h3><p id="lastAction">لا يوجد</p></div>
    <div class="card"><h3>تحويل رصيد</h3><input type="email" id="transferEmail" placeholder="إيميل المستلم"><input type="number" id="transferAmount" placeholder="المبلغ"><button onclick="transfer()">تحويل</button></div>
    <div class="card"><h3>سجل العمليات</h3><table id="history"><tr><th>العملية</th><th>المبلغ</th><th>التاريخ</th></tr></table></div>
    <div class="card"><h3>أسعار العملات</h3><ul id="prices"></ul></div>
    <div class="card"><h3>محفظتك</h3><p>BTC: <span id="btc">0</span></p><p>ETH: <span id="eth">0</span></p></div>
    <div class="card"><h3>إشعارات</h3><ul id="notifications"><li>لا إشعارات حالياً</li></ul></div>
    <div class="card"><h3>دردشة الدعم</h3><textarea id="chatBox" placeholder="اكتب رسالتك..."></textarea><button>إرسال</button></div>
    <div class="card"><h3>إحصائيات</h3><canvas id="statsChart" width="200" height="200"></canvas></div>
    <div class="card"><h3>عدد عملياتك</h3><p id="opsCount">0</p></div>
    <div class="card"><h3>الوقت الآن</h3><p id="clock"></p></div>
    <div class="card"><h3>مكافأة تسجيل الدخول</h3><button onclick="dailyReward()">احصل عليها</button></div>
    <div class="card"><h3>أخبار السوق</h3><marquee>آخر الأخبار ستظهر هنا...</marquee></div>
    <div class="card"><h3>مستوى التقدم</h3><progress value="30" max="100"></progress></div>
    <div class="card"><h3>كود محفظتك</h3><img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=yourWallet" alt="QR"></div>
    <div class="card"><h3>روابط سريعة</h3><a href="#">تواصل معنا</a> | <a href="#">سياسة الاستخدام</a></div>
    <div class="card"><h3>بياناتك</h3><p>ID: <span id="uid"></span></p></div>
    <div class="card"><h3>إعلانات</h3><p>🔥 عرض خاص هذا الأسبوع 🔥</p></div>
    <div class="card"><h3>الاتصال</h3><p id="status">متصل ✅</p></div>
    <div class="card"><h3>تقييمك</h3><input type="range" min="0" max="5"></div>
    <div class="card"><h3>رسائل إدارية</h3><p>لا رسائل</p></div>
    <div class="card"><h3>قائمة أصدقائك</h3><ul><li>لا يوجد</li></ul></div>
    <div class="card"><h3>برنامج ولاء</h3><p>رصيد نقاطك: 0</p></div>
    <div class="card"><h3>بطاقة فيزا افتراضية</h3><p>**** **** **** 1234</p></div>
    <div class="card"><h3>تحديث سريع</h3><button>مزامنة</button></div>
    <div class="card"><h3>محادثة عامة</h3><textarea></textarea></div>
    <div class="card"><h3>تقييم السوق</h3><p>جيد</p></div>
    <div class="card"><h3>العروض</h3><ul><li>عرض 1</li></ul></div>
    <div class="card"><h3>العملات المفضلة</h3><p>BTC, ETH</p></div>
    <div class="card"><h3>حالة الخادم</h3><p>مستقر</p></div>
    <div class="card"><h3>محرك بحث داخلي</h3><input placeholder="ابحث..."></div>
    <div class="card"><h3>صور دعائية</h3><img src="https://via.placeholder.com/150"></div>
    <div class="card"><h3>روابط اجتماعية</h3><p>فيسبوك | تويتر</p></div>
    <div class="card"><h3>صندوق اقتراحات</h3><textarea></textarea></div>
    <div class="card"><h3>تحديث تلقائي</h3><p>يعمل</p></div>
    <div class="card"><h3>نسخة التطبيق</h3><p>v1.0.0</p></div>
    <div class="card"><h3>الإعدادات</h3><button>تعديل</button></div>
    <div class="card"><h3>تسجيل جهازك</h3><p>Samsung A50</p></div>
    <div class="card"><h3>تحذيرات أمان</h3><p>لا يوجد</p></div>
    <div class="card"><h3>حجم تداولك</h3><p>0 USD</p></div>
    <div class="card"><h3>أرباحك</h3><p>0 USD</p></div>
    <div class="card"><h3>خسائرك</h3><p>0 USD</p></div>
    <div class="card"><h3>نشاط آخر 24 ساعة</h3><p>0 عملية</p></div>
    <div class="card"><h3>إشعارات البريد</h3><p>مفعل</p></div>
    <div class="card"><h3>الوضع الليلي</h3><p>مفعل</p></div>
    <div class="card"><h3>محفظة USDT</h3><p>0 USDT</p></div>
    <div class="card"><h3>محفظة SOL</h3><p>0 SOL</p></div>
    <div class="card"><h3>آخر تسجيل دخول</h3><p>اليوم</p></div>
    <div class="card"><h3>الدعم الفني</h3><button>اتصل بنا</button></div>
  </section>

  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script>
    function logout(){window.location="index.html";}
    function dailyReward(){alert("🎉 تمت إضافة 10$ لرصيدك!");}
    function transfer(){alert("تم التحويل بنجاح!");}
    setInterval(()=>{document.getElementById("clock").innerText=new Date().toLocaleTimeString();},1000);
    new Chart(document.getElementById("statsChart"),{type:"pie",data:{labels:["إيداع","سحب"],datasets:[{data:[50,50],backgroundColor:["#2ecc71","#e74c3c"]}]}})
  </script>
</body>
</html>
            
