/* CITY BUILDER */
const COLS = 10, ROWS = 8;
const BLDGS = { house: { icon: '🏠', cost: 30, pop: 4, income: 5, happy: 2, green: 0, label: 'منزل' }, building: { icon: '🏢', cost: 80, pop: 20, income: 15, happy: 0, green: -2, label: 'مبنى' }, shop: { icon: '🏪', cost: 60, pop: 0, income: 25, happy: 5, green: -1, label: 'متجر' }, school: { icon: '🏫', cost: 120, pop: 0, income: -5, happy: 15, green: 3, label: 'مدرسة' }, hospital: { icon: '🏥', cost: 150, pop: 0, income: -8, happy: 20, green: 2, label: 'مستشفى' }, park: { icon: '🌳', cost: 40, pop: 0, income: 0, happy: 10, green: 10, label: 'حديقة' }, road: { icon: '🛣️', cost: 10, pop: 0, income: 0, happy: 0, green: -1, label: 'طريق' }, mosque: { icon: '🕌', cost: 90, pop: 0, income: 0, happy: 18, green: 1, label: 'مسجد' }, solar: { icon: '⚡', cost: 200, pop: 0, income: 20, happy: 5, green: 20, label: 'طاقة شمسية' }, office: { icon: '🏗️', cost: 130, pop: 0, income: 12, happy: 8, green: 0, label: 'بلدية' }, erase: { icon: '🗑️', cost: 0, pop: 0, income: 0, happy: 0, green: 0, label: 'هدم' } };
let city = { money: 500, pop: 0, happy: 50, green: 0, income: 0, score: 0, level: 1, bldgs: 0, grid: Array(ROWS * COLS).fill(null), tool: 'house' };
function initCity() { const g = document.getElementById('gGrid'); g.style.gridTemplateColumns = `repeat(${COLS},1fr)`; g.innerHTML = ''; for (let i = 0; i < ROWS * COLS; i++) {
    const c = document.createElement('div');
    c.className = 'g-cell';
    c.id = 'gc-' + i;
    c.onclick = () => buildOn(i);
    g.appendChild(c);
} }
function selTool(t) { city.tool = t; document.querySelectorAll('.bld-btn').forEach(b => b.classList.remove('sel')); document.getElementById('bb-' + t).classList.add('sel'); const b = BLDGS[t]; document.getElementById('gmsg').textContent = t === 'erase' ? '🗑️ اضغط مبنىً لهدمه' : '📌 ' + b.label + ' — ' + b.cost + ' دج'; }
function buildOn(idx) { const t = city.tool, ex = city.grid[idx]; if (t === 'erase') {
    if (!ex) {
        showToast('⚠️ الخلية فارغة');
        return;
    }
    const r = Math.floor(BLDGS[ex.type].cost * .5);
    remCell(idx, ex);
    city.money += r;
    showToast('🗑️ هُدم — ' + r + ' دج');
    updCity();
    return;
} if (ex) {
    showToast('⚠️ مشغولة!');
    return;
} const b = BLDGS[t]; if (city.money < b.cost) {
    showToast('💸 تحتاج ' + b.cost + ' دج');
    return;
} city.money -= b.cost; city.grid[idx] = { type: t, icon: b.icon, label: b.label }; city.pop += b.pop; city.income += b.income; city.happy = Math.min(100, Math.max(0, city.happy + b.happy)); city.green = Math.min(100, Math.max(0, city.green + b.green)); if (t !== 'road' && t !== 'erase')
    city.bldgs++; city.score += Math.floor(b.cost / 10) + 5; const cell = document.getElementById('gc-' + idx); cell.style.transform = 'scale(1.3)'; setTimeout(() => cell.style.transform = '', 200); cell.textContent = b.icon; if (t === 'road')
    cell.classList.add('road'); const lbl = document.createElement('span'); lbl.className = 'cl'; lbl.textContent = b.label; cell.appendChild(lbl); chkLevel(); updCity(); showToast('✅ ' + b.label + '!'); }
function remCell(idx, b) { const bt = BLDGS[b.type]; city.pop = Math.max(0, city.pop - bt.pop); city.income -= bt.income; city.happy = Math.max(0, city.happy - bt.happy); city.green = Math.max(0, city.green - bt.green); if (b.type !== 'road')
    city.bldgs = Math.max(0, city.bldgs - 1); city.grid[idx] = null; const c = document.getElementById('gc-' + idx); c.innerHTML = ''; c.classList.remove('road'); c.style.background = ''; }
function collectIncome() { const e = Math.max(0, city.income) + Math.floor(city.pop * .5); city.money += e; city.score += Math.floor(e / 5); chkLevel(); updCity(); showToast(e > 0 ? '💰 جمعت ' + e + ' دج!' : '⏳ دورة جديدة'); }
function chkLevel() { const l = Math.floor(city.score / 100) + 1; if (l > city.level) {
    city.level = l;
    city.money += 100;
    showToast('🎉 مستوى ' + l + '! +100 دج');
} }
function updCity() { document.getElementById('gm').textContent = city.money; document.getElementById('gp').textContent = city.pop; document.getElementById('gh').textContent = Math.round(city.happy); document.getElementById('gg').textContent = Math.round(city.green); document.getElementById('gbs').textContent = city.bldgs; document.getElementById('ginc').textContent = (city.income >= 0 ? '+' : '') + city.income; document.getElementById('gsc').textContent = city.score; document.getElementById('glv').textContent = city.level; }
function resetCity() { city = { money: 500, pop: 0, happy: 50, green: 0, income: 0, score: 0, level: 1, bldgs: 0, grid: Array(ROWS * COLS).fill(null), tool: 'house' }; initCity(); updCity(); selTool('house'); showToast('🔄 مدينة جديدة!'); }
/* QUIZ */
const QS = [{ q: 'ما هو تعريف التخطيط الحضري؟', opts: ['تنظيم استخدام الأراضي في المدن', 'علم بناء الجسور', 'إدارة الغابات', 'تصميم الطائرات'], ans: 0, cat: '🌆 العمران' }, { q: 'ما هو نظام GIS؟', opts: ['نظام المعلومات الجغرافية', 'نظام الإضاءة الذكية', 'جهاز قياس الزلازل', 'برنامج 3D'], ans: 0, cat: '🗺️ هندسة حضرية' }, { q: 'ما الفرق بين PDAU و POS؟', opts: ['PDAU للمدينة كلها، POS لقطاع محدد', 'POS أكبر من PDAU', 'كلاهما متطابقان', 'PDAU يخص الريف'], ans: 0, cat: '🌆 العمران' }, { q: 'ما هي المدينة المستدامة؟', opts: ['مدينة تلبي احتياجات الحاضر دون الإضرار بالمستقبل', 'مدينة من مواد طبيعية', 'مدينة صغيرة', 'مدينة بلا سيارات'], ans: 0, cat: '🏙️ تسيير المدينة' }, { q: 'ما وظيفة مدير المشروع الحضري؟', opts: ['تنسيق الأطراف وضمان الجودة والوقت', 'رسم المخططات', 'بناء المباني', 'شراء مواد البناء'], ans: 0, cat: '📐 إدارة المشاريع' }, { q: 'ما هو التراث العمراني؟', opts: ['المباني ذات القيمة التاريخية والثقافية', 'كل المباني القديمة', 'المناطق الريفية', 'الحدائق'], ans: 0, cat: '🏛️ المعمار' }, { q: 'ما الذي تقيسه الكثافة السكانية؟', opts: ['عدد السكان لكل وحدة مساحة', 'مجموع السكان', 'سرعة نمو السكان', 'توزيع الأعمار'], ans: 0, cat: '🌆 العمران' }, { q: 'أي من هذه أداة GIS؟', opts: ['Buffer Analysis', 'Photoshop', 'AutoCAD', 'Excel'], ans: 0, cat: '🗺️ هندسة حضرية' }, { q: 'ما الحي المختلط الاستخدامات؟', opts: ['حي يجمع السكن والتجارة والخدمات', 'حي سكني', 'منطقة صناعية', 'حي تاريخي'], ans: 0, cat: '🌆 العمران' }, { q: 'ما وظيفة البلدية في تسيير المدينة؟', opts: ['إدارة الخدمات المحلية وتطوير المدينة', 'بناء الطرق فقط', 'إصدار الجوازات', 'إدارة المدارس'], ans: 0, cat: '🏙️ تسيير المدينة' }, { q: 'ما الخريطة الطبوغرافية؟', opts: ['تظهر التضاريس وارتفاعات الأرض', 'خريطة السياحة', 'خريطة المناخ', 'خريطة السكان'], ans: 0, cat: '🗺️ هندسة حضرية' }, { q: 'ما وظيفة المساحات الخضراء؟', opts: ['تحسين الهواء وصحة السكان', 'موقع بناء', 'مواقف سيارات', 'بيعها'], ans: 0, cat: '🌳 البيئة' }, { q: 'ما WBS في إدارة المشاريع؟', opts: ['هيكل تقسيم العمل', 'جدول الأسعار', 'خريطة طريق', 'متطلبات العميل'], ans: 0, cat: '📐 إدارة المشاريع' }, { q: 'ما مبدأ البناء الأخضر؟', opts: ['تقليل الموارد وإعادة استخدامها', 'تخفيض التكاليف فقط', 'الفوز بجوائز', 'استهلاك أكبر طاقة'], ans: 0, cat: '🏗️ البناء' }, { q: 'ما شعار نادي رواد العمارة؟', opts: ['Building Today. Leading Tomorrow.', 'Urban First.', 'Smart Cities.', 'Think Green.'], ans: 0, cat: '👥 النادي' }];
let qIdx = 0, qSc = 0, qAns = false;
function renderQ() { if (qIdx >= QS.length) {
    document.getElementById('qBd').innerHTML = `<div style="text-align:center;padding:36px;color:#fff"><div style="font-size:56px">🏆</div><div style="font-size:20px;font-weight:800;margin:10px 0">النتيجة: ${qSc}/150</div><p style="color:rgba(255,255,255,.55);margin-bottom:20px">${qSc >= 120 ? 'ممتاز! رائد حضري حقيقي 🌟' : qSc >= 90 ? 'جيد جداً! واصل التعلم ⭐' : 'حاول مرة أخرى 💪'}</p><button class="xbtn xbtn-g" onclick="restartQ()" style="padding:9px 22px;font-size:13px">🔄 لعب من جديد</button></div>`;
    document.getElementById('qNB').style.display = 'none';
    return;
} qAns = false; document.getElementById('qN').textContent = qIdx + 1; document.getElementById('qPF').style.width = ((qIdx + 1) / QS.length * 100) + '%'; document.getElementById('qCat').textContent = QS[qIdx].cat; document.getElementById('qNB').style.display = 'none'; const q = QS[qIdx]; document.getElementById('qBd').innerHTML = `<div class="quiz-cat">${q.cat}</div><div class="quiz-q">${q.q}</div><div class="quiz-opts">${q.opts.map((o, i) => `<button class="quiz-opt" onclick="ansQ(${i})" id="qo${i}">${o}</button>`).join('')}</div><div class="quiz-fb" id="qFb"></div>`; }
function ansQ(i) { if (qAns)
    return; qAns = true; document.querySelectorAll('.quiz-opt').forEach(b => b.disabled = true); const q = QS[qIdx], fb = document.getElementById('qFb'); if (i === q.ans) {
    document.getElementById('qo' + i).classList.add('ok');
    qSc += 10;
    document.getElementById('qSc').textContent = qSc;
    fb.textContent = '✅ صحيح!';
    fb.style.cssText = 'background:rgba(45,120,74,.2);color:#7de8a6';
}
else {
    document.getElementById('qo' + i).classList.add('no');
    document.getElementById('qo' + q.ans).classList.add('ok');
    fb.textContent = '❌ ' + q.opts[q.ans];
    fb.style.cssText = 'background:rgba(180,60,60,.2);color:#f08080';
} document.getElementById('qNB').style.display = 'flex'; }
function nextQ() { qIdx++; renderQ(); }
function restartQ() { qIdx = 0; qSc = 0; document.getElementById('qSc').textContent = 0; renderQ(); }
/* ARCH */
const AQ = [{ icon: '🏛️', q: 'ما نوع هذا المبنى؟', desc: 'أعمدة كلاسيكية وقبة', choices: [{ icon: '🏛️', name: 'مبنى حكومي/أكاديمي', desc: 'الحوكمة', ok: true }, { icon: '🏪', name: 'مركز تجاري', desc: 'التسوق', ok: false }, { icon: '🏭', name: 'مصنع', desc: 'الإنتاج', ok: false }, { icon: '🏨', name: 'فندق', desc: 'الإقامة', ok: false }] }, { icon: '🌆', q: 'ما يميز المدينة الذكية؟', desc: 'تقنيات رقمية وشاشات ذكية', choices: [{ icon: '💻', name: 'ربط الخدمات بـ IoT', desc: 'المدن الذكية', ok: true }, { icon: '🌿', name: 'زراعة في المباني', desc: 'عمودية', ok: false }, { icon: '🚀', name: 'نقل فضائي', desc: 'مستقبل', ok: false }, { icon: '⚡', name: 'بلا كهرباء', desc: 'مستدام', ok: false }] }, { icon: '🗺️', q: 'ما هذه الأداة؟', desc: 'خريطة رقمية بطبقات', choices: [{ icon: '🗺️', name: 'نظام GIS', desc: 'معلومات جغرافية', ok: true }, { icon: '📸', name: 'تصوير جوي', desc: 'صور', ok: false }, { icon: '📊', name: 'إحصائيات', desc: 'أرقام', ok: false }, { icon: '✏️', name: 'مخطط يدوي', desc: 'تقليدي', ok: false }] }, { icon: '🏙️', q: 'وظيفة مدير تسيير المدينة؟', desc: 'يشرف على الخدمات الحضرية', choices: [{ icon: '🏙️', name: 'إدارة الخدمات المحلية', desc: 'الحوكمة', ok: true }, { icon: '🏗️', name: 'بناء المباني', desc: 'إنشائي', ok: false }, { icon: '🎨', name: 'تصميم الشعارات', desc: 'بصري', ok: false }, { icon: '📚', name: 'التدريس', desc: 'أكاديمي', ok: false }] }, { icon: '🌳', q: 'وظيفة المساحات الخضراء؟', desc: 'حدائق ومتنزهات', choices: [{ icon: '🌳', name: 'تحسين الهواء والصحة', desc: 'البيئة', ok: true }, { icon: '🏗️', name: 'موقع بناء', desc: 'تطوير', ok: false }, { icon: '🅿️', name: 'مواقف سيارات', desc: 'بنية تحتية', ok: false }, { icon: '💰', name: 'بيعها', desc: 'تمويل', ok: false }] }, { icon: '📐', q: 'ما WBS؟', desc: 'هيكل يقسم المشروع', choices: [{ icon: '📐', name: 'هيكل تقسيم العمل', desc: 'Work Breakdown', ok: true }, { icon: '📊', name: 'جدول الأسعار', desc: 'الميزانية', ok: false }, { icon: '🗺️', name: 'خريطة طريق', desc: 'Roadmap', ok: false }, { icon: '📋', name: 'متطلبات العميل', desc: 'User Stories', ok: false }] }, { icon: '🏘️', q: 'ما هذا النوع من السكن؟', desc: 'منازل صغيرة بحدائق', choices: [{ icon: '🏘️', name: 'حي سكني شعبي', desc: 'سكن للأسر', ok: true }, { icon: '🏢', name: 'أحياء فاخرة', desc: 'سكن راقٍ', ok: false }, { icon: '🏭', name: 'منطقة صناعية', desc: 'مصانع', ok: false }, { icon: '🌆', name: 'مركز أعمال', desc: 'تجارة', ok: false }] }, { icon: '🌉', q: 'وظيفة هذا الإنشاء؟', desc: 'هيكل معدني يعبر نهراً', choices: [{ icon: '🌉', name: 'جسر للمرور', desc: 'ربط الضفتين', ok: true }, { icon: '🏗️', name: 'رافعة بناء', desc: 'تشييد', ok: false }, { icon: '⚡', name: 'برج طاقة', desc: 'كهرباء', ok: false }, { icon: '🗼', name: 'برج إذاعة', desc: 'بث', ok: false }] }, { icon: '🏗️', q: 'ما مرحلة البناء هذه؟', desc: 'هيكل خرساني بلا جدران', choices: [{ icon: '🏗️', name: 'هيكل العظم', desc: 'الإنشاء', ok: true }, { icon: '🏠', name: 'التشطيبات', desc: 'الديكور', ok: false }, { icon: '🏛️', name: 'التسليم', desc: 'النهاية', ok: false }, { icon: '📐', name: 'التصميم', desc: 'الرسم', ok: false }] }, { icon: '🏛️', q: 'ما الهندسة المعمارية؟', desc: 'فن وعلم تصميم المباني', choices: [{ icon: '🏛️', name: 'تصميم المباني والفضاءات', desc: 'المعمار', ok: true }, { icon: '🌐', name: 'إنترنت الأشياء', desc: 'التقنية', ok: false }, { icon: '🌿', name: 'الزراعة الحضرية', desc: 'الغذاء', ok: false }, { icon: '⚖️', name: 'القانون الحضري', desc: 'التشريع', ok: false }] }];
let aIdx = 0, aSc = 0, aAns = false;
function renderArch() { if (aIdx >= AQ.length) {
    document.getElementById('aQ').innerHTML = `<div style="text-align:center;padding:18px;color:#fff"><div style="font-size:48px">🏆</div><h3 style="font-size:18px;margin:8px 0">النتيجة: ${aSc}/${AQ.length * 10}</h3><button class="xbtn xbtn-g" onclick="resetArch()" style="margin-top:12px">🔄 مجدداً</button></div>`;
    document.getElementById('aCh').innerHTML = '';
    document.getElementById('aNB').style.display = 'none';
    return;
} aAns = false; document.getElementById('aR').textContent = aIdx + 1; document.getElementById('aNB').style.display = 'none'; document.getElementById('aFb').textContent = ''; const q = AQ[aIdx]; document.getElementById('aQ').innerHTML = `<span class="arch-icon">${q.icon}</span><div class="arch-qt">${q.q}</div><div class="arch-qs">${q.desc}</div>`; document.getElementById('aCh').innerHTML = q.choices.map((c, i) => `<button class="arch-ch" onclick="ansArch(${i})" id="ac${i}"><span class="aci">${c.icon}</span><div class="acn">${c.name}</div><div class="acd">${c.desc}</div></button>`).join(''); }
function ansArch(i) { if (aAns)
    return; aAns = true; document.querySelectorAll('.arch-ch').forEach(b => b.disabled = true); const q = AQ[aIdx]; if (q.choices[i].ok) {
    document.getElementById('ac' + i).classList.add('ok');
    aSc += 10;
    document.getElementById('aSc').textContent = aSc;
    document.getElementById('aFb').textContent = '✅ ممتاز!';
    showToast('✅ +10');
}
else {
    document.getElementById('ac' + i).classList.add('no');
    q.choices.forEach((c, j) => { if (c.ok)
        document.getElementById('ac' + j).classList.add('ok'); });
    document.getElementById('aFb').textContent = '❌ خطأ!';
    showToast('❌ خطأ');
} document.getElementById('aNB').style.display = 'flex'; }
function nextArch() { aIdx++; renderArch(); }
function resetArch() { aIdx = 0; aSc = 0; document.getElementById('aSc').textContent = 0; renderArch(); }
/* PLAN */
const PCOLS = ['#132240', '#1c3560', '#c8901a', '#2d7a4a', '#1b6e8c', '#7a4a2d', '#5a2d7a'];
function updatePlan() { const h = +document.getElementById('ps-h').value, c = +document.getElementById('ps-c').value, g = +document.getElementById('ps-g').value, inf = +document.getElementById('ps-i').value, s = +document.getElementById('ps-s').value, m = +document.getElementById('ps-m').value; ['h', 'c', 'g', 'i', 's', 'm'].forEach((k, j) => { document.getElementById('pv-' + k).textContent = [h, c, g, inf, s, m][j]; }); const pop = Math.round((h * 120 + c * 30 + s * 50) / 100), happy = Math.round(g * .4 + s * .3 + inf * .2 + m * .1), econ = Math.round(c * .5 + inf * .3 + m * .2), env = Math.max(0, Math.round(g * .6 + h * .1 - c * .05 + s * .1)), gov = Math.round(m * .5 + s * .3 + inf * .2), total = Math.round((happy + econ + env + gov) / 4); const grade = total >= 85 ? 'A+' : total >= 75 ? 'A' : total >= 65 ? 'B+' : total >= 55 ? 'B' : total >= 45 ? 'C+' : 'C'; document.getElementById('pmPop').textContent = (pop > 999 ? Math.round(pop / 10) / 100 + 'K' : pop) + ''; document.getElementById('pmH').textContent = happy + '%'; document.getElementById('pmE').textContent = econ + '%'; document.getElementById('pmEn').textContent = env + '%'; document.getElementById('pmS').textContent = grade; document.getElementById('pmG').textContent = grade; document.getElementById('pSc').textContent = grade; const vis = document.getElementById('pVis'); vis.innerHTML = ''; const cnt = Math.min(Math.round(h / 12) + Math.round(c / 20) + Math.round(s / 25) + 1, 18); for (let i = 0; i < cnt; i++) {
    const b = document.createElement('div');
    b.className = 'plan-b';
    b.style.cssText = `height:${20 + Math.random() * 58 + Math.round((i % 3 === 0 ? c : i % 3 === 1 ? h : s) / 4)}px;width:${Math.random() > .5 ? 17 : 23}px;background:${PCOLS[i % PCOLS.length]};opacity:.88;`;
    vis.appendChild(b);
} for (let i = 0; i < Math.round(g / 18); i++) {
    const t = document.createElement('div');
    t.style.cssText = 'font-size:16px;align-self:flex-end;margin:0 2px;';
    t.textContent = '🌳';
    vis.appendChild(t);
} }
function resetPlan() { ['h', 'c', 'g', 'i', 's', 'm'].forEach((k, j) => { document.getElementById('ps-' + k).value = [50, 30, 20, 40, 35, 25][j]; }); updatePlan(); }
/* ACTIVITIES CMS */
let acts = [{ title: 'التحليل الحضري', desc: 'قراءة المخططات وتحليل النسيج العمراني للمدن الجزائرية.', emoji: '🔬', type: 'ورشة عمل', date: 'أسبوعياً' }, { title: 'نظم GIS والخرائط', desc: 'تعلم وتطبيق نظم المعلومات الجغرافية وإنتاج خرائط تحليلية.', emoji: '🗺️', type: 'تدريب', date: 'أسبوعياً' }, { title: 'ورشة التصميم المعماري', desc: 'ورشات تطبيقية في التصميم ببرامج متخصصة.', emoji: '✏️', type: 'ورشة عمل', date: 'أسبوعياً' }, { title: 'المدن الذكية', desc: 'دراسة تجارب المدن الذكية وكيفية تطبيقها في السياق الجزائري.', emoji: '🌐', type: 'محاضرة', date: 'شهرياً' }, { title: 'المسابقات العلمية', desc: 'المشاركة في مسابقات معمارية وعمرانية وطنية ودولية.', emoji: '🏆', type: 'مسابقة', date: 'سنوياً' }, { title: 'الزيارات الميدانية', desc: 'زيارات لمشاريع إنشائية وورش حضرية.', emoji: '🚌', type: 'زيارة ميدانية', date: 'فصلياً' }];
function renderActs() { const g = document.getElementById('actsGrid'); if (!acts.length) {
    g.innerHTML = '<div class="no-acts">لا توجد أنشطة بعد.</div>';
    return;
} g.innerHTML = acts.map((a, i) => `<div class="act-card"><span class="act-emoji">${a.emoji}</span><h4>${a.title}</h4><p>${a.desc}</p><div class="act-meta"><span class="act-date">📅 ${a.date}</span><span class="act-badge">${a.type}</span></div></div>`).join(''); }
function openModal() { document.getElementById('actModal').classList.add('open'); document.getElementById('mDate').valueAsDate = new Date(); }
function closeModal() { document.getElementById('actModal').classList.remove('open'); }
function saveAct() { const t = document.getElementById('mTitle').value.trim(); if (!t) {
    showToast('⚠️ أدخل عنوان النشاط');
    return;
} const d = document.getElementById('mDate').value; acts.push({ title: t, desc: document.getElementById('mDesc').value || '—', emoji: document.getElementById('mSpec').value, type: document.getElementById('mType').value, date: d ? new Date(d).toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' }) : document.getElementById('mType').value }); renderActs(); closeModal(); showToast('✅ تم حفظ النشاط!'); }
/* MISC */
function toggleFAQ(btn) { btn.closest('.faq-item').classList.toggle('open'); }
function swGame(id, btn) { document.querySelectorAll('.gpanel').forEach(p => p.classList.remove('active')); document.querySelectorAll('.gtab').forEach(t => t.classList.remove('active')); document.getElementById('gp-' + id).classList.add('active'); btn.classList.add('active'); }
let toastT;
function showToast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2800); }
/* SCROLL REVEAL */
const ro = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting)
    e.target.classList.add('visible'); }); }, { threshold: .08 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
/* STATS */
function countUp(el, t, d) { let s = 0, st = t / 60, ti = setInterval(() => { s += st; if (s >= t) {
    s = t;
    clearInterval(ti);
} el.textContent = Math.round(s); }, d / 60); }
let counted = false;
new IntersectionObserver(e => { if (e[0].isIntersecting && !counted) {
    counted = true;
    countUp(document.getElementById('sv1'), 17, 1200);
    countUp(document.getElementById('sv2'), 13, 1200);
} }, { threshold: .5 }).observe(document.querySelector('.stats-strip'));
/* NAV */
const mainNav = document.getElementById('mainNav');
window.addEventListener('scroll', () => mainNav.style.boxShadow = scrollY > 30 ? '0 4px 28px rgba(0,0,0,.3)' : 'none');
function toggleNav() { document.getElementById('mobNav').classList.toggle('open'); }
function closeNav() { document.getElementById('mobNav').classList.remove('open'); }
/* INIT */
window.addEventListener('load', () => { initCity(); updCity(); renderQ(); renderArch(); updatePlan(); renderActs(); });
