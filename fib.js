/* ===== 🤥 الچدبة: معلومة ناقصة، كل واحد يكتب جواب غلط يصدقونه، وبعدين الكل يدور الصح ===== */
(function () {
'use strict';
const { mkScreen, setBtns2 } = window.UI;
// السؤال | الجواب الصح | ٣ أجوبة غلط للبوت
const FIB = `چم قلب عند الأخطبوط؟ | 3 | 2 | 5 | 8
ويش لون دم الأخطبوط؟ | أزرق | أخضر | أسود | بنفسجي
الحيوان الوحيد اللي ما يقدر ينط هو… | الفيل | الزرافة | التمساح | السلحفاة
الأكل الوحيد اللي ما يخرب أبد هو… | العسل | الملح | الرز | التمر
الفاكهة الوحيدة اللي بذورها من برا هي… | الفراولة | الكيوي | الرمان | التين
البطريق لين يبغى يخطب، يعطي حبيبته… | حصاة | سمكة | ريشة | صدفة
في فرس البحر، اللي يحمل ويولد هو… | الأب | الأم | الجدة | الاثنين مع بعض
شي في النعامة أكبر من مخها. ويش هو؟ | عينها | رجلها | منقارها | بيضتها
الربيان قلبه موجود في… | راسه | ذيله | بطنه | رجوله
حيوان بصمة أصابعه تشبه بصمة الإنسان واجد. ويش هو؟ | الكوالا | القرد | الباندا | الدب
الفلامنجو لونه وردي بسبب… | أكله | الشمس | الماي المالح | عمره
أكبر دولة في العالم ما فيها ولا نهر هي… | السعودية | مصر | ليبيا | أستراليا
الدولة اللي فيها أكثر أهرامات في العالم هي… | السودان | مصر | المكسيك | العراق
الكاتشب أول ما طلع كانوا يبيعونه كـ… | دوا | صبغ | عصير | صابون
الجزر قبل مئات السنين كان لونه… | بنفسجي | أبيض | أخضر | أسود
أغلى بهار في العالم هو… | الزعفران | الهيل | الفانيلا | القرفة
برج إيفل يطول في الصيف من الحر. چم سانتي تقريباً؟ | 15 | 2 | 50 | 100
الطفل ينولد وعنده تقريباً چم عظمة؟ | 300 | 206 | 150 | 500
شي في فمك له بصمة ما تتكرر مثل الأصبع. ويش هو؟ | اللسان | الأسنان | الشفايف | اللثة
شي ما تقدر تسويه وعيونك مفتوحة. ويش هو؟ | تعطس | تبلع | تصفر | تتثاوب
الكوكب اللي يومه أطول من سنته هو… | الزهرة | عطارد | زحل | المريخ
شركة نوكيا قبل التلفونات كانت تصنع… | ورق | راديوات | جواتي | ساعات
شركة سامسونج أول ما بدت كانت تبيع… | سمك مجفف | تلفزيونات | قماش | سيايير
شركة نينتندو أول ما بدت كانت تصنع… | ورق لعب | ألعاب خشب | ساعات | حلاو
شركة لامبورغيني قبل السيايير الرياضية كانت تصنع… | تراكتورات | سياكل | طيارات | ثلاجات
أول فيديو نزل في يوتيوب كان مصور في… | حديقة حيوانات | مطبخ | مدرسة | ملعب كورة
مخترع علبة البرينجلز وصّى إن رماده ينحط في… | علبة برينجلز | البحر | مصنعه | صندوق ذهب
أكثر دولة تاكل شوكولاتة في العالم هي… | سويسرا | أمريكا | بلجيكا | ألمانيا
الكرواسون أصله مو من فرنسا، أصله من… | النمسا | إيطاليا | تركيا | بلجيكا
علم الدولة الوحيد اللي مو مربع ولا مستطيل هو علم… | نيبال | سويسرا | قطر | اليابان
أكثر دولة فيها جزر في العالم هي… | السويد | إندونيسيا | الفلبين | اليابان
في أستراليا فيه حيوان عدده أكثر من الناس. ويش هو؟ | الكنغر | الكوالا | الخروف | التمساح
في نيوزيلندا فيه حيوان عدده أكثر من الناس بواجد. ويش هو؟ | الخروف | البقرة | الكيوي | الأرنب
الحيوان الوطني لاسكتلندا هو… | اليونيكورن | الأسد | الحصان | التنين
في اليابان يزرعون البطيخ بشكل… | مربع | مثلث | قلب | نجمة
النملة تقدر تشيل وزنها چم مرة تقريباً؟ | 50 | 5 | 10 | 1000
الصرصور يقدر يعيش بدون راس لمدة… | أسبوع | ساعة | يوم | شهر
البعوض اللي يقرص هو بس… | الأنثى | الذكر | الصغار | الكبار
السنور ما يقدر يحس بطعم… | الحلو | المالح | الحامض | المر
سنام الجمل مو فيه ماي، فيه… | دهن | لحم | هوا | عظم
القرش ما عنده ولا… | عظمة | سن | عين | لسان
التمساح ما يقدر يطلع… | لسانه | ذيله | صوته | عيونه
أكثر حرف مستخدم في اللغة الإنجليزية هو… | E | A | S | T
الموناليزا في اللوحة ما عندها… | حواجب | أذون | أصابع | رقبة
أول شي انباع في موقع أمازون كان… | كتاب | تلفون | جوتي | سي دي
ماريو في اللعبة شغلته… | سباك | نجار | طباخ | كهربائي
شكل باك مان مأخوذ من… | بيتزا ناقصة قطعة | كورة صفرا | وجه مبتسم | قمر
لعبة تتريس اخترعوها في… | روسيا | اليابان | أمريكا | ألمانيا
المايكرويف انكتشف لين ذاب شي في مخبا المخترع. ويش هو؟ | شوكولاتة | زبدة | آيس كريم | علك
اللي اخترع الكوكاكولا كان شغله… | صيدلي | طباخ | مزارع | مهندس
الشوكولاتة سم لحيوان معروف. ويش هو؟ | الكلب | السنور | الأرنب | الحصان
أكثر أكل ينباق من المحلات في العالم هو… | الجبن | الشوكولاتة | اللحم | العلك
أكثر دولة تنتج قهوة في العالم هي… | البرازيل | اليمن | كولومبيا | إثيوبيا
أكثر شعب يشرب قهوة في العالم هم أهل… | فنلندا | إيطاليا | تركيا | البرازيل
شجرة الحياة في البحرين عمرها تقريباً چم سنة؟ | 400 | 100 | 1000 | 50
الاسم القديم للبحرين قبل آلاف السنين هو… | دلمون | أوال | سومر | بابل
لعبة الشطرنج طلعت أول مرة في… | الهند | الصين | إيران | روسيا
الأخطبوط عنده چم مخ؟ | 9 | 1 | 2 | 3
الحصان ما يقدر… | يرجّع | يعطس | يسبح | يرمش
أقصر حرب في التاريخ استمرت تقريباً چم دقيقة؟ | 38 | 5 | 90 | 200
حرب "المئة عام" استمرت بالضبط چم سنة؟ | 116 | 100 | 99 | 150
ضوء الشمس يوصل للأرض في چم دقيقة تقريباً؟ | 8 | 1 | 30 | 60
الحلزون يقدر ينام لين… | 3 سنين | أسبوع | شهر | 10 سنين
الخيار چم في المية منه ماي تقريباً؟ | 96 | 50 | 70 | 80
أول منتخب فاز بكأس العالم هو… | الأوروغواي | البرازيل | إيطاليا | ألمانيا
البلايستيشن الأول نزل سنة… | 1994 | 1989 | 1999 | 2001
البطاط المقلي (فرنش فرايز) أصله مو من فرنسا، أصله من… | بلجيكا | أمريكا | هولندا | ألمانيا
الفول السوداني مو من المكسرات، هو من… | البقوليات | الفواكه | الخضار | الحبوب
الدلفين ينام ونص … صاحي | مخه | جسمه | ذيله | قلبه
التفاح يطفو فوق الماي لأن ربعه… | هوا | ماي | سكر | قشر
الزرافة لسانها لونه… | أزرق غامق | وردي | أحمر | أبيض
الدب القطبي جلده تحت الفرو الأبيض لونه… | أسود | أبيض | وردي | رمادي`.split('\n').map(l => l.split('|').map(x => x.trim())).filter(p => p.length === 5).map(p => ({ q: p[0], a: p[1], f: p.slice(2) }));

const nrm = s => String(s).trim().replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/^ال/, '').replace(/[\s.،!؟?%٪]/g, '').toLowerCase();
const isTruth = (q, t) => { const a = nrm(q.a), b = nrm(t); return !!b && (a === b || (a.length >= 3 && b.length >= 3 && (a.indexOf(b) >= 0 || b.indexOf(a) >= 0)) || (/^\d+$/.test(a) && b.replace(/\D/g, '') === a && b.replace(/\d/g, '').length <= 4)); };
const WT = () => window.__fast ? 1 : 50, VT = () => window.__fast ? 1 : 35;

/* ---------- المحرك (نفسه للعادي والأونلاين) ---------- */
function fNew(ids, total) { const g = { ids: ids.slice(), total, k: 0, pts: {}, over: false }; ids.forEach(i => g.pts[i] = 0); fRound(g); return g; }
function fRound(g) { g.k++; g.q = draw('fib', FIB); g.lies = {}; g.rej = {}; g.votes = {}; g.opts = null; g.phase = 'write'; }
// يرجع 'truth' إدا كتب الجواب الصح (ما ينقبل)
function fWrite(g, id, txt) {
  if (g.phase !== 'write' || g.lies[id] !== undefined) return;
  txt = String(txt || '').trim().slice(0, 40);
  if (txt && isTruth(g.q, txt)) { g.rej[id] = (g.rej[id] || 0) + 1; return 'truth'; }
  g.lies[id] = txt;
}
function fToVote(g) {
  if (g.phase !== 'write') return;
  const opts = [{ t: g.q.a, truth: true, by: [] }];
  g.ids.forEach(id => { const t = g.lies[id]; if (!t) return; const o = opts.find(x => !x.truth && nrm(x.t) === nrm(t)); if (o) o.by.push(id); else opts.push({ t, by: [id] }); });
  // البوت يكمل الأجوبة إدا كانت قليلة
  const fk = shuffle(g.q.f.slice()); while (opts.length < 5 && fk.length) { const t = fk.pop(); if (!opts.some(x => nrm(x.t) === nrm(t))) opts.push({ t, by: [], bot: true }); }
  g.opts = shuffle(opts); g.phase = 'vote';
}
function fVote(g, id, i) { if (g.phase !== 'vote' || g.votes[id] !== undefined) return; const o = g.opts[i]; if (!o || o.by.includes(id)) return; g.votes[id] = i; }
function fReveal(g) {
  if (g.phase !== 'vote') return;
  g.gain = {}; g.ids.forEach(i => g.gain[i] = 0);
  Object.entries(g.votes).forEach(([id, i]) => { const o = g.opts[i]; if (o.truth) g.gain[id]++; else o.by.forEach(a => { if (a !== id) g.gain[a]++; }); });
  g.ids.forEach(i => g.pts[i] += g.gain[i]); g.phase = 'res';
}
function fNext(g) { if (g.k >= g.total) { g.over = true; g.phase = 'over'; const mx = Math.max(...g.ids.map(i => g.pts[i])); g.winners = g.ids.filter(i => g.pts[i] === mx); } else fRound(g); }
const resRows = (g, nm) => g.opts.map((o, i) => { const who = Object.keys(g.votes).filter(id => g.votes[id] === i).map(nm); return [(o.truth ? '✅ ' : '🤥 ') + o.t + (o.truth ? '' : ' — ' + (o.bot ? 'البوت 🤖' : o.by.map(nm).join(' و '))), who.length ? who.join('، ') : '—', !!o.truth]; }).sort((a, b) => b[2] - a[2]);

/* ---------- اللعب على تلفون واحد ---------- */
const P = mkScreen('fib', '🤥 الچدبة'); let F = null, tmr = null;
const stop = () => { clearInterval(tmr); tmr = null; };
P.back.onclick = () => { stop(); renderHome(); show('home'); };
const cardEl = () => { P.body.innerHTML = ''; const c = el('div', 'bigcard'); P.body.appendChild(c); return c; };
function timer(c, sec, onEnd) { stop(); const d = el('div', 'timer', String(sec)); c.appendChild(d); let left = sec; tmr = setInterval(() => { if (!$('fib').classList.contains('on')) return stop(); left--; d.textContent = Math.max(0, left); if (left <= 5 && left > 0 && window.SFX) SFX.count(); if (left <= 0) { stop(); if (window.SFX) SFX.timesUp(); onEnd(); } }, window.__fast ? 30 : 1000); }
function setup() {
  stop(); P.body.innerHTML = '';
  const b = el('div', 'box'); b.appendChild(el('h2', '', 'چم جولة؟'));
  const ch = el('div', 'chips'); [5, 10, 15, 20].forEach(n => { const c = el('button', 'chip' + ((S.fibRounds || 10) === n ? ' sel' : ''), String(n)); c.onclick = () => { S.fibRounds = n; save(); ch.querySelectorAll('.chip').forEach(x => x.classList.remove('sel')); c.classList.add('sel'); }; ch.appendChild(c); });
  b.appendChild(ch); b.appendChild(el('div', 'sub', 'كل واحد يكتب جوابه والباقين ما يشوفون. والأحسن تلعبونها أونلاين من "سوّ غرفة" عشان كل واحد يكتب في تلفونه.'));
  P.body.appendChild(b);
  setBtns2(P.row, [btn('ابدأ ▶', '', () => { if (S.players.length < 2) { buzz(80); return; } F = fNew(S.players, S.fibRounds || 10); wi = 0; writeTurn(); })]);
  show('fib');
}
let wi = 0;
function hand(name, txt, go) { stop(); const c = cardEl(); c.append(el('div', 'lab', 'جولة ' + F.k + ' من ' + F.total), el('div', 'lab', 'عط التلفون لـ'), el('div', 'nm', name), el('div', 'lab', txt)); setBtns2(P.row, [btn('أنا ' + name + ' ▶', '', go)]); }
function writeTurn() {
  if (wi >= F.ids.length) { fToVote(F); wi = 0; return voteTurn(); }
  const id = F.ids[wi];
  hand(id, 'اكتب جواب غلط يصدقونه 🤥', () => {
    const c = cardEl(); c.append(el('div', 'lab', id + '، كمّل المعلومة بچدبة مقنعة'), el('div', 'txt', F.q.q));
    const inp = el('input'); inp.type = 'text'; inp.className = 'bigin'; inp.maxLength = 40; inp.placeholder = 'اكتب جوابك…'; const msg = el('div', 'err', '');
    c.append(inp, msg);
    const send = force => { const r = fWrite(F, id, inp.value); if (r === 'truth' && !force) { msg.textContent = '😲 هدا الجواب الصح! اكتب چدبة غيره'; inp.value = ''; if (window.SFX) SFX.correct(); return; } if (r === 'truth') F.lies[id] = ''; if (!inp.value.trim() && !force) { buzz(60); return; } stop(); wi++; writeTurn(); };
    timer(c, WT(), () => send(true));
    setBtns2(P.row, [btn('خلصت ✓', 'grn', () => send(false))]); setTimeout(() => inp.focus(), 50);
  });
}
function voteTurn() {
  if (wi >= F.ids.length) { fReveal(F); return result(); }
  const id = F.ids[wi];
  hand(id, 'دوّر الجواب الصح 🔎', () => {
    const c = cardEl(); c.append(el('div', 'lab', id + '، أي واحد هو الصح؟'), el('div', 'txt', F.q.q));
    const o = el('div', 'opts'); F.opts.forEach((op, i) => { if (op.by.includes(id)) return; o.appendChild(btn(op.t, '', () => { fVote(F, id, i); stop(); wi++; voteTurn(); })); }); c.appendChild(o);
    timer(c, VT(), () => { wi++; voteTurn(); }); setBtns2(P.row, []);
  });
}
function scoreList(c) { const r = el('div', 'reslist'); const mx = Math.max(...F.ids.map(i => F.pts[i])); F.ids.slice().sort((a, b) => F.pts[b] - F.pts[a]).forEach(i => { const d = el('div', F.pts[i] === mx && mx > 0 ? 'best' : ''); d.append(el('span', '', i + (F.gain && F.gain[i] && !F.over ? '  (+' + F.gain[i] + ')' : '')), el('b', '', F.pts[i])); r.appendChild(d); }); c.appendChild(r); }
function result() {
  stop(); const c = cardEl(); c.append(el('div', 'lab', F.q.q), el('div', 'lab', 'الجواب الصح'), el('div', 'txt good', F.q.a));
  const r = el('div', 'reslist'); resRows(F, x => x).forEach(([a, b2, best]) => { const d = el('div', best ? 'best' : ''); d.append(el('span', '', a), el('b', '', b2)); r.appendChild(d); }); c.appendChild(r);
  c.appendChild(el('div', 'lab', 'النقاط')); scoreList(c); if (window.SFX) SFX.reveal();
  setBtns2(P.row, [btn(F.k >= F.total ? 'النتيجة النهائية 🏆' : 'الجولة الجاية ←', '', () => { fNext(F); if (F.over) return finalS(); wi = 0; writeTurn(); })]);
}
function finalS() { const c = cardEl(); c.append(el('div', 'win good', '🏆 ' + F.winners.join(' و ') + (F.winners.length > 1 ? ' فازوا!' : ' فاز!'))); scoreList(c); setBtns2(P.row, [btn('لعبة جديدة 🔄', '', setup)]); }

/* ---------- أونلاين: كل واحد يكتب في تلفونه ---------- */
const O = window.ONL, onm = id => (O.P(id) || {}).name || '؟', isOn = id => O.P(id) && O.P(id).on;
function makeFib() {
  const G = {}; const T = '🤥 الچدبة'; let g = null;
  const later = (ms, fn) => setTimeout(() => { if (O.host() && O.host().game === G) { fn(); O.push(); } }, ms);
  const arm = () => { const k = g.k, ph = g.phase; G.end = Date.now() + (ph === 'write' ? WT() : VT()) * 1000; later((ph === 'write' ? WT() : VT()) * 1000 + 400, () => { if (g.k !== k || g.phase !== ph) return; if (ph === 'write') { fToVote(g); arm(); } else reveal(); }); };
  const reveal = () => { fReveal(g); g.ids.forEach(i => { const p = O.P(i); if (p) p.score += g.gain[i]; }); };
  const need = () => g.ids.filter(isOn);
  G.start = () => { g = G.g = fNew(O.active().map(p => p.id), S.fibRounds || 10); arm(); };
  G.join = p => { if (g && !g.ids.includes(p.id)) { g.ids.push(p.id); g.pts[p.id] = 0; if (g.gain) g.gain[p.id] = 0; } };
  const cdItem = () => ({ t: 'cd', left: Math.max(0, Math.round((G.end - Date.now()) / 1000)) });
  const pts = () => g.ids.filter(i => O.P(i)).map(i => [onm(i) + (g.phase === 'res' && g.gain[i] ? '  (+' + g.gain[i] + ')' : ''), g.pts[i], false]).sort((a, b) => b[1] - a[1]);
  G.view = p => {
    const head = [{ t: 'lab', v: 'جولة ' + g.k + ' من ' + g.total }, { t: 'txt', v: g.q.q }];
    if (g.phase === 'over') return { title: T, items: [{ t: 'win good', v: '🏆 ' + g.winners.map(onm).join(' و ') }, { t: 'list', v: pts() }], scores: O.scoresList() };
    if (g.phase === 'write') {
      if (g.lies[p.id] !== undefined) return { title: T, items: head.concat([{ t: 'win good', v: 'كتبت ✓' }, cdItem()]), status: ['ننتظر الباقين… (' + need().filter(i => g.lies[i] !== undefined).length + ' من ' + need().length + ')'] };
      return { title: T, items: head.concat(g.rej[p.id] ? [{ t: 'win', v: '😲 هدا الجواب الصح! اكتب چدبة غيره' }] : [{ t: 'lab', v: 'اكتب جواب غلط يصدقونه 🤥' }]).concat([cdItem()]), input: { kind: 'text', ph: 'اكتب چدبتك…', btn: 'أرسل ✓', key: 'fib' + g.k + ':' + (g.rej[p.id] || 0) } };
    }
    if (g.phase === 'vote') {
      if (!g.ids.includes(p.id)) return { title: T, items: head.concat([{ t: 'lab', v: 'تتفرج 👀' }]) };
      if (g.votes[p.id] !== undefined) return { title: T, items: head.concat([{ t: 'win good', v: 'اخترت ✓' }, cdItem()]), status: ['ننتظر الباقين…'] };
      return { title: T, items: head.concat([{ t: 'lab', v: 'أي واحد هو الصح؟ 🔎' }, cdItem()]), opts: g.opts.map((o, i) => ({ id: i, label: o.t, mine: o.by.includes(p.id) })).filter(o => !o.mine) };
    }
    return { title: T, items: head.concat([{ t: 'lab', v: 'الجواب الصح' }, { t: 'txt good', v: g.q.a }, { t: 'list', v: resRows(g, onm) }, { t: 'lab', v: 'النقاط' }, { t: 'list', v: pts() }]) };
  };
  G.hostBtns = () => g.phase === 'write' ? [{ id: 'h:skip', label: 'يكفي، صوّتوا', cls: 'ghost' }] : g.phase === 'vote' ? [{ id: 'h:rev', label: 'اكشف', cls: 'ghost' }] : g.phase === 'res' ? [{ id: 'h:next', label: g.k >= g.total ? 'النتيجة النهائية 🏆' : 'الجولة الجاية ←', flex: 2 }] : [{ id: 'h:again', label: 'لعبة جديدة 🔄', flex: 2 }];
  G.act = (p, m) => {
    if (m.v === 'h:again') return G.start();
    if (m.v === 'h:skip' && g.phase === 'write') { fToVote(g); return arm(); }
    if (m.v === 'h:rev' && g.phase === 'vote') return reveal();
    if (m.v === 'h:next' && g.phase === 'res') { fNext(g); if (!g.over) arm(); return; }
    if (!g.ids.includes(p.id)) return;
    if (m.a === 'input' && g.phase === 'write') { if (!String(m.v).trim()) return; fWrite(g, p.id, m.v); if (need().every(i => g.lies[i] !== undefined)) { fToVote(g); arm(); } return; }
    if (m.a === 'opt' && g.phase === 'vote') { fVote(g, p.id, +m.v); if (need().every(i => g.votes[i] !== undefined)) reveal(); }
  };
  return G;
}
O.register('fib', { e: '🤥', n: 'الچدبة', d: 'اكتب جواب غلط يصدقونه، ودوّر الصح', min: 2, make: makeFib });

/* ---------- تسجيل ---------- */
const k = GAMES.findIndex(x => x.id === 'imp');
GAMES.splice(k + 1, 0, { id: 'fib', e: '🤥', n: 'الچدبة', d: 'اكتب جواب غلط يصدقونه… ودوّر الصح', min: 2, t: '١٥ دقيقة' });
RULES.fib = ['تطلع معلومة غريبة ناقصة، مثل: "چم قلب عند الأخطبوط؟".', 'كل واحد يكتب جواب غلط بس مقنع، عشان الباقين يصدقونه. فيه وقت، واللي ما يكتب يروح عليه.', 'إدا كتبت الجواب الصح بالصدفة، اللعبة تقول لك إنه صح وتكتب غيره.', 'بعدين تطلع كل الأجوبة ومعاهم الجواب الصح، وكل واحد يختار اللي يشوفه صح.', 'اخترت الصح؟ تاخد نقطة. وكل واحد يصدّق چدبتك تاخد عليه نقطة زيادة.', 'إدا عددكم قليل، البوت 🤖 يزيد أجوبة غلط من عنده.', 'بعد آخر جولة، أكثر واحد نقاط هو الفايز 🏆.'];
window.EXTRA.fib = setup;
window.__fib = () => ({ F, FIB, fNew, fWrite, fToVote, fVote, fReveal, fNext, isTruth });

// خيار "أسئلة أسهل" في الإعدادات
window.EASY_UI = () => {
  const box = el('div', 'box'); box.appendChild(el('h2', '', '🧠 صعوبة الأسئلة'));
  const ch = el('div', 'chips'); [['أسهل 👍', true], ['عادية (أصعب)', false]].forEach(([t, v]) => { const c = el('button', 'chip' + ((S.easyQ !== false) === v ? ' sel' : ''), t); c.onclick = () => { S.easyQ = v; save(); ch.querySelectorAll('.chip').forEach(x => x.classList.remove('sel')); c.classList.add('sel'); }; ch.appendChild(c); });
  box.append(ch, el('div', 'sub', 'تأثر على سين جيم ومن سيربح المليون.')); return box;
};
renderHome();
})();
