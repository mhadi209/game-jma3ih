/* ===== تقزيرة: باقي الألعاب أونلاين (كل واحد على جواله) ===== */
(function () {
'use strict';
const O = window.ONL, R = O.renderers;
const nm = id => (O.P(id) || {}).name || '؟';
const act = () => O.active();
const ids = () => act().map(p => p.id);
const on = id => O.P(id) && O.P(id).on;
const addScore = (id, v) => { const p = O.P(id); if (p) p.score += v; };
const live = G => O.host() && O.host().game === G;
const later = (G, ms, fn) => setTimeout(() => { if (live(G)) { fn(); O.push(); } }, window.__fast ? Math.min(ms, 30) : ms);
const css = document.createElement('style');
css.textContent = `
.cdown{font-family:'Lalezar';font-size:46px;direction:ltr;line-height:1}
.cdown.low{color:var(--red)}
.qopt{display:grid;grid-template-columns:1fr 1fr;gap:8px;width:100%}
.qopt button{min-height:64px;font-size:17px;color:#fff;border-radius:14px}
.qopt button:nth-child(1){background:#d64541}.qopt button:nth-child(2){background:#2f73c9}.qopt button:nth-child(3){background:#e0a400}.qopt button:nth-child(4){background:#2e8b57}
.qopt button.dim{opacity:.25}.qopt button.right{outline:4px solid #fff;box-shadow:0 0 0 7px #2e8b57}
.letin{display:flex;flex-direction:column;gap:6px;width:100%}
.letin label{display:flex;gap:6px;align-items:center;font-weight:700}
.letin label span{width:70px;flex:none}
.letin input{flex:1}
.ltab{width:100%;border-collapse:collapse;font-size:13px}
.ltab td,.ltab th{border:1px solid var(--dash);padding:4px;text-align:center}
.ltab td.u{background:#d6efe3}.ltab td.d{background:#fbeec2}.ltab td.z{color:var(--mut);text-decoration:line-through}
body.dark .ltab td.u{background:#1f3b31}body.dark .ltab td.d{background:#4a3f1f}
.bigcard .ludoWrap{width:100%}
.xoO{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:min(80vw,300px);margin:6px auto;direction:ltr}
.xoO button{aspect-ratio:1;background:var(--paper);border-radius:14px;padding:0;font-family:'Lalezar';font-size:54px;color:var(--txt)}
.xoO button.X{color:#c94a3b}.xoO button.O{color:#1f4f8a}.xoO button.w{background:var(--yel)}
.hand2{display:flex;overflow-x:auto;padding:16px 6px 6px;width:100%}
.hand2 .ucard{margin-left:-20px;cursor:pointer}.hand2 .ucard:first-child{margin-left:0}
.hand2 .ucard.ok{transform:translateY(-10px);box-shadow:0 0 0 3px #ffd54a}
.hand2 .ucard.no{filter:brightness(.6)}
.cbO .tl{display:grid;gap:4px;justify-content:center;direction:ltr;margin:4px auto}
.cbO .tl.rtl{direction:rtl}
.cbO .tt{width:36px;height:36px;border:2px solid var(--line);border-radius:8px;background:var(--paper);display:flex;align-items:center;justify-content:center;font-family:'Lalezar';font-size:20px}
.cbO .tt.g{background:#2f8f5b;color:#fff}.cbO .tt.y{background:#d7a632;color:#2b1d12}
.cbO .kb2{display:flex;flex-wrap:wrap;gap:4px;justify-content:center;margin-top:6px}
.cbO .kb2 button{min-width:30px;padding:8px 4px;font-size:17px;background:var(--paper);color:var(--txt);box-shadow:1px 1px 0 var(--line)}
.cbO .kb2 button.g{background:#2f8f5b;color:#fff}.cbO .kb2 button.y{background:#d7a632}
.sjB{display:grid;gap:4px;width:100%}
.sjB .r{display:grid;grid-template-columns:90px repeat(6,1fr);gap:3px;align-items:center}
.sjB .r b{font-size:11px}
.sjB button{padding:6px 0;font-size:13px;border-radius:7px;box-shadow:1px 1px 0 var(--line)}
.sjB button:disabled{opacity:.25}
`;
document.head.appendChild(css);

/* ---------- عرض مشترك ---------- */
R.cd = (it, c) => { const d = el('div', 'cdown'); c.appendChild(d); const end = Date.now() + it.left * 1000; let lt = null; const tick = () => { if (!d.isConnected) return; const t = Math.max(0, Math.ceil((end - Date.now()) / 1000)); d.textContent = t; d.classList.toggle('low', t <= 5); if (t !== lt) { if (lt !== null && t <= 5 && t > 0 && window.SFX) SFX.count(); if (lt !== null && t === 0 && window.SFX) SFX.timesUp(); lt = t; } if (t > 0) setTimeout(tick, 250); }; tick(); };
R.qopt = (it, c, send) => { const g = el('div', 'qopt'); it.opts.forEach((o, i) => { const b = btn(o, (it.right !== undefined ? (i === it.right ? 'right' : 'dim') : '') + (it.mine === i ? ' right' : ''), () => { g.querySelectorAll('button').forEach(x => x.disabled = true); b.classList.add('right'); send({ a: 'opt', v: i }); }); b.disabled = it.dis || it.right !== undefined; g.appendChild(b); }); c.appendChild(g); };
R.big = (it, c) => { const d = el('div', it.cls || 'flagBig', it.v); c.appendChild(d); };
R.html = (it, c) => { const d = el('div', ''); d.innerHTML = it.v; c.appendChild(d); };
const cd = left => ({ t: 'cd', left: Math.max(0, Math.round(left)) });
const left = end => (end - Date.now()) / 1000;

/* ======================================================
   🔥 صراحة ولا جرأة / 🪑 الكرسي الساخن / 🤔 لو خيروك / 👉 مين أكثر / 🙈 ولا مرة
   ====================================================== */
function makeTod() { const G = {};
  G.start = () => { const L = ids(); G.p = draw('ontodp', L); G.asker = pick(L.filter(x => x !== G.p)) || G.p; G.kind = null; G.q = null; };
  G.view = p => {
    const items = [{ t: 'lab', v: 'الدور على' }, { t: 'nm', v: nm(G.p) }, { t: 'lab', v: 'والسؤال من ' + nm(G.asker) }];
    if (!G.kind) { if (p.id === G.p) return { title: '🔥 صراحة ولا جرأة', items: items.concat([{ t: 'txt', v: 'اختار!' }]), btns: [{ id: 'truth', label: 'صراحة 💬', cls: 'grn' }, { id: 'dare', label: 'جرأة 🔥', cls: 'red' }] };
      return { title: '🔥 صراحة ولا جرأة', items: items.concat([{ t: 'lab', v: nm(G.p) + ' يختار… 🤔' }]) }; }
    const v = { title: '🔥 صراحة ولا جرأة', items: items.concat([{ t: 'lab', v: G.kind === 'truth' ? 'صراحة 💬' : 'جرأة 🔥' }, { t: 'txt', v: G.q }]) };
    if (p.id === G.p || p.id === G.asker) v.btns = [{ id: 'chg', label: 'غيّر 🔄', cls: 'ghost' }];
    return v;
  };
  G.hostBtns = () => [{ id: 'h:next', label: 'اللي بعده ←', flex: 2 }];
  G.act = (p, m) => { if (m.v === 'h:next') return G.start(); if (p.id === G.p && (m.v === 'truth' || m.v === 'dare') && !G.kind) { G.kind = m.v; G.q = draw(m.v, m.v === 'truth' ? TRUTH : DARE); } if (m.v === 'chg' && G.kind && (p.id === G.p || p.id === G.asker)) G.q = draw(G.kind, G.kind === 'truth' ? TRUTH : DARE); };
  return G; }
function makeHot() { const G = {};
  G.start = () => { G.p = draw('onhot', ids()); G.q = draw('truth', TRUTH); G.end = 0; };
  G.view = p => { const items = [{ t: 'lab', v: 'على الكرسي الساخن 🪑' }, { t: 'nm', v: nm(G.p) }];
    if (p.id === G.p) items.push({ t: 'lab', v: 'جاوب بسرعة وبصراحة! 😅' }); else items.push({ t: 'lab', v: 'اسألوه أي شي! فكرة:' }, { t: 'txt', v: G.q });
    if (G.end) items.push(left(G.end) > 0 ? cd(left(G.end)) : { t: 'win', v: 'خلص الوقت! 🔥' });
    return { title: '🪑 الكرسي الساخن', items, btns: p.id !== G.p ? [{ id: 'q', label: 'فكرة سؤال ثانية 💡', cls: 'ghost' }] : [] }; };
  G.hostBtns = () => G.end ? [{ id: 'h:next', label: 'اللي بعده ←', flex: 2 }] : [{ id: 'h:go', label: 'ابدأ الوقت ⏱️', flex: 2 }, { id: 'h:next', label: 'غيّر اللاعب', cls: 'ghost' }];
  G.act = (p, m) => { if (m.v === 'h:next') return G.start(); if (m.v === 'h:go' && !G.end) { G.end = Date.now() + TIME('hot') * 1000; later(G, TIME('hot') * 1000 + 200, () => { }); } if (m.v === 'q') G.q = draw('truth', TRUTH); };
  return G; }
function makeVoteQ(kind) { // wyr | ml | nhie
  const G = {}; const T = { wyr: '🤔 لو خيروك', ml: '👉 مين أكثر واحد', nhie: '🙈 ولا مرة' }[kind];
  G.start = () => { G.q = kind === 'wyr' ? draw('wyr', WYR) : kind === 'ml' ? draw('ml', ML) : draw('nhie', NHIE); G.v = {}; G.res = false; G.ids = ids(); };
  G.view = p => {
    const qt = kind === 'wyr' ? [{ t: 'lab', v: 'لو خيروك بين' }, { t: 'txt', v: G.q[0] }, { t: 'or', v: 'ولا' }, { t: 'txt', v: G.q[1] }] : kind === 'ml' ? [{ t: 'lab', v: 'مين أكثر واحد ممكن…' }, { t: 'txt', v: G.q + '؟' }] : [{ t: 'lab', v: 'ولا مرة…' }, { t: 'txt', v: G.q }];
    if (G.res) {
      const cnt = {}; Object.values(G.v).forEach(x => cnt[x] = (cnt[x] || 0) + 1);
      let list;
      if (kind === 'wyr') list = [0, 1].map(k => [G.q[k] + ' (' + (cnt[k] || 0) + ')', Object.keys(G.v).filter(i => G.v[i] === k).map(nm).join('، ') || '—', false]);
      else if (kind === 'ml') { const mx = Math.max(0, ...Object.values(cnt)); list = Object.entries(cnt).sort((a, b) => b[1] - a[1]).map(([i, n]) => [nm(i) + (n === mx ? ' 👑' : ''), n, n === mx]); }
      else list = [['🙋 سووها', Object.keys(G.v).filter(i => G.v[i] === 1).map(nm).join('، ') || 'ولا أحد 😇', false], ['🙅 ما سووها', Object.keys(G.v).filter(i => G.v[i] === 0).map(nm).join('، ') || 'ولا أحد', false]];
      return { title: T, items: qt.concat([{ t: 'list', v: list }]) };
    }
    if (G.v[p.id] !== undefined) return { title: T, items: qt.concat([{ t: 'win good', v: 'تم ✓' }]), status: ['ننتظر الباقين… (' + Object.keys(G.v).length + ' من ' + G.ids.filter(on).length + ')'] };
    const opts = kind === 'wyr' ? G.q.map((t, i) => ({ id: i, label: t })) : kind === 'ml' ? G.ids.filter(i => i !== p.id && on(i)).map(i => ({ id: i, label: nm(i) })) : [{ id: 1, label: '🙋 سويتها' }, { id: 0, label: '🙅 ما سويتها' }];
    return { title: T, items: qt, opts };
  };
  G.hostBtns = () => G.res ? [{ id: 'h:next', label: 'السؤال اللي بعده ←', flex: 2 }] : [{ id: 'h:res', label: 'اكشف', cls: 'ghost' }];
  G.act = (p, m) => { if (m.v === 'h:next') return G.start(); if (m.v === 'h:res') { G.res = true; return; } if (m.a === 'opt' && !G.res && G.v[p.id] === undefined) { G.v[p.id] = m.v; if (G.ids.filter(on).every(i => G.v[i] !== undefined)) G.res = true; } };
  return G; }

/* ======================================================
   🎭 تمثيل / 🚫 الكلمة الممنوعة / ❓ خمن الشي / ⏱️ ٥ ثواني
   ====================================================== */
function makeActing(kind) { // cha | tab
  const G = {}; const T = kind === 'cha' ? '🎭 تمثيل بدون كلام' : '🚫 الكلمة الممنوعة';
  G.start = () => { G.p = draw('onact', ids()); G.end = 0; G.got = 0; G.card = null; G.done = false; };
  const nextCard = () => { if (kind === 'cha') { const [c, w] = topicWord(Object.keys(TOPICS)); G.card = { c, w, d: descOf(c, w) }; } else { const t = draw('taboo', TABOO); G.card = { w: t[0], f: t.slice(1) }; } };
  G.view = p => {
    const me = p.id === G.p;
    if (!G.end) return { title: T, items: [{ t: 'lab', v: 'الدور على' }, { t: 'nm', v: nm(G.p) }, { t: 'lab', v: me ? 'عندك ' + TIME(kind) + ' ثانية. اضغط ابدأ لما تكون جاهز' : 'استعدوا تخمنون!' }], btns: me ? [{ id: 'go', label: 'أنا جاهز ▶', flex: 2 }] : [] };
    if (G.done) return { title: T, items: [{ t: 'win', v: 'خلص الوقت ⏰' }, { t: 'nm', v: nm(G.p) }, { t: 'txt', v: G.got + ' نقطة' }], scores: O.scoresList() };
    const it = [cd(left(G.end)), { t: 'lab', v: 'النقاط: ' + G.got }];
    if (me) { it.push({ t: 'txt', v: G.card.w }); if (G.card.d) it.push({ t: 'desc', v: G.card.d }); if (G.card.f) it.push({ t: 'lab', v: '🚫 ممنوع: ' + G.card.f.join(' · ') }); }
    else it.push({ t: 'txt', v: nm(G.p) + (kind === 'cha' ? ' يمثّل… خمّنوا! 🗣️' : ' يوصف… خمّنوا! 🗣️') });
    const b = me ? [{ id: 'skip', label: 'تخطي ⏭️', cls: 'ghost' }].concat(kind === 'tab' ? [{ id: 'oops', label: 'قالها ❌', cls: 'red' }] : []).concat([{ id: 'got', label: 'جابوها ✅', cls: 'grn', flex: 1.4 }]) : [];
    return { title: T, items: it, btns: b };
  };
  G.hostBtns = () => G.done ? [{ id: 'h:next', label: 'اللي بعده ←', flex: 2 }] : [];
  G.act = (p, m) => {
    if (m.v === 'h:next') return G.start();
    if (p.id !== G.p || G.done) return;
    if (m.v === 'go' && !G.end) { G.end = Date.now() + TIME(kind) * 1000; nextCard(); later(G, TIME(kind) * 1000, () => { G.done = true; addScore(G.p, G.got); }); return; }
    if (!G.end) return;
    if (m.v === 'got') { G.got++; nextCard(); } else if (m.v === 'skip') nextCard(); else if (m.v === 'oops') { G.got--; nextCard(); }
  };
  return G; }
function makeG20() { const G = {};
  G.start = () => { G.p = draw('ong20', ids()); [G.c, G.w] = topicWord(Object.keys(TOPICS)); G.n = 0; G.res = null; };
  G.view = p => { const me = p.id === G.p; const it = [{ t: 'lab', v: 'اللي يعرف الشي' }, { t: 'nm', v: nm(G.p) }, { t: 'lab', v: 'الموضوع: ' + G.c }];
    if (G.res) return { title: '❓ خمن الشي', items: it.concat([{ t: 'win', v: G.res }, { t: 'txt good', v: G.w }, { t: 'desc', v: descOf(G.c, G.w) }]) };
    if (me) it.push({ t: 'txt good', v: G.w }, { t: 'desc', v: descOf(G.c, G.w) }, { t: 'lab', v: 'جاوب على أسئلتهم بـ إيه أو لا بس' });
    else it.push({ t: 'lab', v: 'اسألوه أسئلة جوابها إيه أو لا' });
    it.push({ t: 'bigLetter', v: G.n + '/20' });
    return { title: '❓ خمن الشي', items: it, btns: me ? [{ id: 'q', label: 'سؤال +1', cls: '' }, { id: 'got', label: 'جابوها ✅', cls: 'grn' }, { id: 'give', label: 'استسلموا 🏳️', cls: 'ghost' }] : [] }; };
  G.hostBtns = () => G.res ? [{ id: 'h:next', label: 'اللي بعده ←', flex: 2 }] : [];
  G.act = (p, m) => { if (m.v === 'h:next') return G.start(); if (p.id !== G.p || G.res) return; if (m.v === 'q' && G.n < 20) G.n++; if (m.v === 'got') { G.res = 'جابوها في ' + G.n + ' سؤال 🎉'; } if (m.v === 'give' || G.n >= 20 && m.v === 'q') G.res = 'ما جابوها 😅'; };
  return G; }
function makeFive() { const G = {};
  G.start = () => { G.p = draw('onfive', ids()); G.q = draw('five', FIVE_SEC); G.end = 0; G.done = false; G.v = {}; G.res = null; };
  G.view = p => { const me = p.id === G.p; const it = [{ t: 'lab', v: 'الدور على' }, { t: 'nm', v: nm(G.p) }, { t: 'txt', v: G.q }];
    if (!G.end) return { title: '⏱️ ' + TIME('five') + ' ثواني', items: it, btns: me ? [{ id: 'go', label: 'ابدأ ⏱️', flex: 2 }] : [] };
    if (!G.done) return { title: '⏱️', items: it.concat([cd(left(G.end))]) };
    if (G.res) return { title: '⏱️', items: it.concat([{ t: 'win ' + (G.res === 'yes' ? 'good' : 'bad'), v: G.res === 'yes' ? 'قالها! +١' : 'ما لحق 😅' }]), scores: O.scoresList() };
    if (me) return { title: '⏱️', items: it.concat([{ t: 'lab', v: 'الجماعة يصوتون… قلتها؟ 😏' }]) };
    if (G.v[p.id] !== undefined) return { title: '⏱️', items: it.concat([{ t: 'win good', v: 'صوّتت ✓' }]) };
    return { title: '⏱️', items: it.concat([{ t: 'lab', v: 'قالها كلها قبل لا يخلص الوقت؟' }]), opts: [{ id: 1, label: 'قالها ✅' }, { id: 0, label: 'ما لحق ❌' }] }; };
  const decide = () => { const y = Object.values(G.v).filter(x => x === 1).length, n = Object.values(G.v).filter(x => x === 0).length; G.res = y >= n ? 'yes' : 'no'; if (G.res === 'yes') addScore(G.p, 1); };
  G.hostBtns = () => G.res ? [{ id: 'h:next', label: 'اللي بعده ←', flex: 2 }] : G.done ? [{ id: 'h:res', label: 'النتيجة', cls: 'ghost' }] : [];
  G.act = (p, m) => { if (m.v === 'h:next') return G.start(); if (m.v === 'go' && p.id === G.p && !G.end) { G.end = Date.now() + TIME('five') * 1000; later(G, TIME('five') * 1000, () => { G.done = true; }); return; }
    if (m.v === 'h:res' && G.done && !G.res) return decide();
    if (m.a === 'opt' && G.done && !G.res && p.id !== G.p) { G.v[p.id] = m.v; if (ids().filter(i => i !== G.p).every(i => G.v[i] !== undefined)) decide(); } };
  return G; }

/* ======================================================
   💣 القنبلة: تنتقل من جوال لجوال
   ====================================================== */
function makeBomb() { const G = {};
  G.start = () => { G.order = shuffle(ids()); G.h = 0; G.q = draw('bomb', BOMB); G.boom = null; G.run = false; G.lost = G.lost || {}; };
  const holder = () => G.order[G.h % G.order.length];
  G.view = p => {
    if (G.boom) return { title: '💣 القنبلة', items: [{ t: 'big', v: '💥', cls: 'bomb' }, { t: 'win bad', v: 'بوووم! ' + nm(G.boom) }], beep: 120, scores: O.scoresList() };
    const it = [{ t: 'big', v: '💣', cls: 'bomb' + (G.run ? ' tick' : '') }, { t: 'txt', v: G.q }];
    if (!G.run) return { title: '💣 القنبلة', items: it.concat([{ t: 'lab', v: 'تبدأ عند ' + nm(holder()) }]) };
    if (p.id === holder()) return { title: '💣 القنبلة', items: it.concat([{ t: 'win bad', v: 'القنبلة عندك! قول كلمة ومرّرها بسرعة!' }]), btns: [{ id: 'pass', label: 'مرّر 💣 لـ ' + nm(G.order[(G.h + 1) % G.order.length]), cls: 'red', flex: 2 }], beep: 900 };
    return { title: '💣 القنبلة', items: it.concat([{ t: 'lab', v: '💣 عند ' + nm(holder()) }]) };
  };
  G.hostBtns = () => G.boom ? [{ id: 'h:again', label: 'جولة ثانية 🔄', flex: 2 }] : G.run ? [] : [{ id: 'h:go', label: 'شغّل القنبلة 🔥', flex: 2 }];
  G.act = (p, m) => {
    if (m.v === 'h:again') return G.start();
    if (m.v === 'h:go' && !G.run) { G.run = true; const lo = Math.min(TIME('bombMin'), TIME('bombMax')), hi = Math.max(TIME('bombMin'), TIME('bombMax')); later(G, (lo + Math.random() * (hi - lo)) * 1000, () => { G.boom = holder(); G.run = false; addScore(G.boom, -1); }); return; }
    if (m.v === 'pass' && G.run && p.id === holder()) { G.h++; while (!on(holder())) G.h++; }
  };
  return G; }

/* ======================================================
   🔤 إنسان حيوان نبات (كل واحد يكتب على جواله)
   ====================================================== */
const LC = { key: null, v: {}, sent: null };
R.letin = (it, c, send) => {
  if (LC.key !== it.key) { LC.key = it.key; LC.v = {}; LC.sent = null; }
  const doSend = () => { if (LC.sent === it.key) return; LC.sent = it.key; const o = {}; it.cats.forEach(k => o[k] = (LC.v[k] || '').trim()); send({ a: 'ans', v: JSON.stringify(o) }); };
  if (it.auto) { c.appendChild(el('div', 'lab', 'جاري إرسال أجوبتك…')); setTimeout(doSend, 0); return; }
  const f = el('div', 'letin');
  it.cats.forEach(k => { const l = el('label', ''); const i = el('input'); i.type = 'text'; i.maxLength = 25; i.dataset.k = 'let:' + it.key + ':' + k; i.value = LC.v[k] || ''; i.oninput = () => { LC.v[k] = i.value; }; i.onkeydown = e => { if (e.key === 'Enter') { const n = l.nextElementSibling; if (n) n.querySelector('input').focus(); } }; l.append(el('span', '', k), i); f.appendChild(l); });
  const go = btn('خلصت ✋', 'grn', () => { go.disabled = true; doSend(); });
  go.style.width = '100%'; go.style.marginTop = '8px'; c.append(f, go);
};
let LT_SIG = '';
R.ltab = (it, c) => { const sg = JSON.stringify(it.cells); if (sg !== LT_SIG) { LT_SIG = sg; if (window.SFX) SFX.reveal(); }
  const t = el('table', 'ltab'); const h = el('tr'); h.appendChild(el('th', '', '')); it.players.forEach(n => h.appendChild(el('th', '', n))); t.appendChild(h);
  it.cats.forEach((k, ci) => { const r = el('tr'); r.appendChild(el('th', '', k)); it.cells[ci].forEach(([w, s]) => { const d = el('td', s === 10 ? 'u' : s === 5 ? 'd' : 'z', (w || '—') + (w ? ' (' + s + ')' : '')); r.appendChild(d); }); t.appendChild(r); });
  const tr = el('tr'); tr.appendChild(el('th', '', 'المجموع')); it.tot.forEach(v => tr.appendChild(el('th', '', v))); t.appendChild(tr);
  const w = el('div', ''); w.style.overflowX = 'auto'; w.style.width = '100%'; w.appendChild(t); c.appendChild(w);
};
function makeLetters() { const G = {}; const nrm = s => s.replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').trim();
  G.start = () => { G.key = Math.random().toString(36).slice(2, 8); G.closing = false; G.L = draw('letters', LETTERS); G.cats = letCats().slice(); G.ans = {}; G.end = Date.now() + TIME('let') * 1000; G.res = null; G.ids = ids(); G.stopper = null; later(G, TIME('let') * 1000 + 300, () => { G.closing = true; }); };
  const startsOk = w => { const n = nrm(w).replace(/^ال/, ''), L = nrm(G.L === 'هـ' ? 'ه' : G.L); return n.startsWith(L) || nrm(w).startsWith(L); };
  const score = () => {
    G.res = { cells: [], tot: G.ids.map(() => 0) };
    G.cats.forEach(k => { const row = G.ids.map(id => { const w = (G.ans[id] || {})[k] || ''; return [w, w && startsOk(w) ? nrm(w).replace(/^ال/, '') : null]; });
      G.res.cells.push(row.map(([w, n], j) => { if (!n) return [w, 0]; const dup = row.filter(x => x[1] === n).length > 1; const s = dup ? 5 : 10; G.res.tot[j] += s; return [w, s]; })); });
    G.ids.forEach((id, j) => addScore(id, G.res.tot[j]));
  };
  G.view = p => {
    const head = [{ t: 'lab', v: 'الحرف' }, { t: 'bigLetter', v: G.L }];
    if (G.res) return { title: '🔤 إنسان حيوان نبات', items: head.concat([{ t: 'lab', v: G.stopper ? '✋ ' + nm(G.stopper) + ' خلص أول' : 'خلص الوقت' }, { t: 'ltab', cats: G.cats, players: G.ids.map(nm), cells: G.res.cells, tot: G.res.tot }]), scores: O.scoresList() };
    if (G.closing && G.ans[p.id] === undefined) return { title: '🔤', items: head.concat([{ t: 'win', v: '✋ وقفوا الأقلام!' }, { t: 'letin', cats: G.cats, key: G.key, auto: true }]) };
    if (G.ans[p.id] !== undefined) return { title: '🔤', items: head.concat([{ t: 'win good', v: 'أرسلت ✓' }]), status: ['ننتظر الباقين…'] };
    return { title: '🔤 إنسان حيوان نبات', items: head.concat([cd(left(G.end)), { t: 'letin', cats: G.cats, key: G.key }]) };
  };
  G.hostBtns = () => G.res ? [{ id: 'h:next', label: 'حرف جديد 🎲', flex: 2 }] : [{ id: 'h:score', label: 'صحّح الحين', cls: 'ghost' }];
  G.act = (p, m) => {
    if (m.v === 'h:next') return G.start();
    if (m.v === 'h:score' && !G.res) return score();
    if (G.res) return;
    if (m.a === 'ans') { let o = {}; try { o = JSON.parse(m.v); } catch (e) { } if (G.ans[p.id] === undefined) { G.ans[p.id] = o; if (!G.stopper && !G.closing) { G.stopper = p.id; G.closing = true; } } if (G.ids.filter(on).every(i => G.ans[i] !== undefined)) score(); }
  };
  return G; }

/* ======================================================
   🧠 مسابقات: أسئلة سريعة، خمن الدولة، من سيربح المليون (البقاء)
   ====================================================== */
function makeQuiz(kind) { // triv | flags | mil
  const G = {}; const T = { triv: '⚡ مسابقة سريعة', flags: '🚩 خمن الدولة', mil: '💰 من سيبقى للمليون' }[kind];
  const total = kind === 'mil' ? 15 : 10, secs = kind === 'flags' ? TIME('flag') : 20;
  const newQ = () => {
    if (kind === 'flags') { const mode = Math.random() < .55 ? 'flag' : 'emoji'; let shown, right, pool; if (mode === 'flag') { const f = draw('flags', FLAGS); shown = flagEmoji(f.code); right = f.name; pool = FLAGS.map(x => x.name); } else { const f = draw('emojic', EMOJI_COUNTRIES); shown = f.e; right = f.name; pool = FLAGS.map(x => x.name).concat(EMOJI_COUNTRIES.map(x => x.name)); } const opts = shuffle([right, ...shuffle([...new Set(pool)].filter(x => x !== right)).slice(0, 3)]); return { q: mode === 'flag' ? 'علم أي دولة؟' : 'أي دولة؟', show: shown, cls: mode === 'flag' ? 'flagBig' : 'emojiBig', opts, r: opts.indexOf(right) }; }
    const q = kind === 'mil' && G.k >= 10 ? draw('milhard', MIL_HARD) : draw('triv', TRIVIA); const opts = shuffle(q.slice(1)); return { q: q[0], opts, r: opts.indexOf(q[1]) };
  };
  G.start = () => { G.k = 0; G.alive = {}; ids().forEach(i => G.alive[i] = true); G.pts = {}; G.next(); };
  G.next = () => { G.Q = newQ(); G.ans = {}; G.t0 = Date.now(); G.end = G.t0 + secs * 1000; G.reveal = false; const k = G.k; later(G, secs * 1000 + 300, () => { if (G.k === k && !G.reveal) G.doReveal(); }); };
  G.doReveal = () => { G.reveal = true; Object.entries(G.ans).forEach(([id, a]) => { if (a.i === G.Q.r) { const sp = Math.max(0, 1 - (a.t - G.t0) / (secs * 1000)); const pts = kind === 'mil' ? 1 : Math.round(500 + 500 * sp); G.pts[id] = (G.pts[id] || 0) + pts; } else if (kind === 'mil') G.alive[id] = false; }); if (kind === 'mil') ids().forEach(i => { if (G.alive[i] && !G.ans[i]) G.alive[i] = false; }); };
  const board = () => Object.keys(G.alive).map(i => [nm(i) + (kind === 'mil' && !G.alive[i] ? ' ❌' : ''), G.pts[i] || 0]).sort((a, b) => b[1] - a[1]);
  G.view = p => {
    if (G.over) return { title: T, items: [{ t: 'win good', v: '🏆 ' + G.winner }, { t: 'list', v: board().map(x => [x[0], x[1], false]) }], scores: O.scoresList() };
    const head = [{ t: 'lab', v: 'سؤال ' + (G.k + 1) + ' من ' + total }];
    if (G.Q.show) head.push({ t: 'big', v: G.Q.show, cls: G.Q.cls });
    head.push({ t: 'txt', v: G.Q.q });
    const a = G.ans[p.id], out = kind === 'mil' && !G.alive[p.id];
    if (G.reveal) { const ok = a && a.i === G.Q.r; return { title: T, items: head.concat([{ t: 'qopt', opts: G.Q.opts, right: G.Q.r }, { t: 'win ' + (ok ? 'good' : 'bad'), v: out && !a ? 'طالع 👀' : ok ? 'صح! 🎉' : 'غلط 😅' }, { t: 'list', v: board().slice(0, 8).map(x => [x[0], x[1], false]) }]) }; }
    if (out) return { title: T, items: head.concat([{ t: 'lab', v: 'طلعت من المسابقة 😢 تتفرج' }, cd(left(G.end))]) };
    if (a) return { title: T, items: head.concat([{ t: 'win good', v: 'جاوبت ✓ انتظر…' }, cd(left(G.end))]) };
    return { title: T, items: head.concat([cd(left(G.end)), { t: 'qopt', opts: G.Q.opts }]) };
  };
  G.hostBtns = () => G.over ? [{ id: 'h:again', label: 'مسابقة جديدة 🔄', flex: 2 }] : G.reveal ? [{ id: 'h:next', label: G.k + 1 >= total || (kind === 'mil' && !Object.values(G.alive).some(x => x)) ? 'النتيجة 🏆' : 'السؤال اللي بعده ←', flex: 2 }] : [{ id: 'h:rev', label: 'اكشف الجواب', cls: 'ghost' }];
  const finish = () => { G.over = true; const b = board(); G.winner = b.length ? b[0][0].replace(' ❌', '') : '—'; const best = b.length ? b[0][1] : 0; Object.keys(G.alive).forEach(i => { if ((G.pts[i] || 0) === best && best > 0) addScore(i, 2); }); };
  G.act = (p, m) => {
    if (m.v === 'h:again') { G.over = false; return G.start(); }
    if (m.v === 'h:rev' && !G.reveal) return G.doReveal();
    if (m.v === 'h:next' && G.reveal) { G.k++; if (G.k >= total || (kind === 'mil' && !Object.values(G.alive).some(x => x))) return finish(); return G.next(); }
    if (m.a === 'opt' && !G.reveal && !G.ans[p.id] && (kind !== 'mil' || G.alive[p.id])) { G.ans[p.id] = { i: +m.v, t: Date.now() }; const need = Object.keys(G.alive).filter(i => on(i) && (kind !== 'mil' || G.alive[i])); if (need.every(i => G.ans[i])) G.doReveal(); }
  };
  return G; }

/* ======================================================
   🔀 الحروف المخربطة (سباق)  /  🔗 سلسلة الكلمات
   ====================================================== */
function makeScr() { const G = {}; const nrm = s => s.replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/\s/g, '');
  G.start = () => { for (let k = 0; k < 50; k++) { const [c, w] = topicWord(Object.keys(TOPICS)); const n = [...w].length; if (!/\s|\(/.test(w) && n >= 3 && n <= 7) { G.c = c; G.w = w; break; } } let sh; for (let k = 0; k < 10; k++) { sh = shuffle([...G.w]); if (sh.join('') !== G.w) break; } G.sh = sh; G.win = null; G.end = Date.now() + TIME('scr') * 1000; G.tries = {}; const w = G.w; later(G, TIME('scr') * 1000, () => { if (G.w === w && !G.win) G.win = '—'; }); };
  G.view = p => { const it = [{ t: 'lab', v: 'الموضوع: ' + G.c }, { t: 'html', v: '<div class="scr">' + G.sh.map(ch => '<span>' + esc(ch) + '</span>').join('') + '</div>' }];
    if (G.win) return { title: '🔀 الحروف المخربطة', items: it.concat([{ t: 'txt good', v: G.w }, { t: 'win', v: G.win === '—' ? 'ما أحد جابها ⏰' : '🎉 ' + nm(G.win) + ' جابها!' }]), scores: O.scoresList() };
    return { title: '🔀 الحروف المخربطة', items: it.concat([cd(left(G.end))]).concat(G.tries[p.id] ? [{ t: 'lab', v: '❌ ' + G.tries[p.id] + ' غلط' }] : []), input: { kind: 'text', ph: 'اكتب الكلمة…', btn: 'جاوب', key: 'scr' + G.sh.join('') + (G.tries[p.id] || 0) } }; };
  G.hostBtns = () => G.win ? [{ id: 'h:next', label: 'كلمة جديدة ←', flex: 2 }] : [{ id: 'h:show', label: 'اكشف', cls: 'ghost' }];
  G.act = (p, m) => { if (m.v === 'h:next') return G.start(); if (m.v === 'h:show') { G.win = '—'; return; } if (m.a === 'input' && !G.win) { if (nrm(String(m.v)) === nrm(G.w)) { G.win = p.id; addScore(p.id, 1); } else G.tries[p.id] = (G.tries[p.id] || 0) + 1; } };
  return G; }
function makeChain() { const G = {}; const nrm = s => s.replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي');
  const LET = ['ب', 'ت', 'ج', 'ح', 'د', 'ر', 'س', 'ش', 'ع', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];
  G.start = () => { G.alive = shuffle(ids()); G.ptr = 0; G.used = new Set(); G.letter = pick(LET); G.last = ''; G.msg = ''; G.over = null; G.turnStart(); };
  G.turnStart = () => { G.end = Date.now() + TIME('chain') * 1000; const tok = G.tok = Math.random(); later(G, TIME('chain') * 1000 + 200, () => { if (G.tok === tok && !G.over) G.out(G.alive[G.ptr], 'خلص وقته ⏰'); }); };
  G.out = (id, why) => { const i = G.alive.indexOf(id); if (i < 0) return; G.alive.splice(i, 1); G.msg = '💥 ' + nm(id) + ' طلع (' + why + ')'; if (G.ptr >= G.alive.length) G.ptr = 0; if (G.alive.length <= 1) { G.over = G.alive[0]; if (G.over) addScore(G.over, 2); return; } G.turnStart(); };
  G.leave = p => { if (!G.over && G.alive.includes(p.id)) G.out(p.id, 'طلع من الغرفة'); };
  G.view = p => { if (G.over) return { title: '🔗 سلسلة الكلمات', items: [{ t: 'win good', v: '🏆 ' + nm(G.over) }, { t: 'lab', v: 'عدد الكلمات: ' + G.used.size }], scores: O.scoresList() };
    const cur = G.alive[G.ptr]; const it = [{ t: 'lab', v: G.msg || (G.last ? 'الكلمة اللي قبل: ' + G.last : 'أول كلمة') }, { t: 'lab', v: 'كلمة تبدأ بحرف' }, { t: 'bigLetter', v: G.letter }, cd(left(G.end)), { t: 'lab', v: 'الدور على ' + nm(cur) }];
    if (p.id === cur) return { title: '🔗 سلسلة الكلمات', items: it, input: { kind: 'text', ph: 'اكتب كلمة…', btn: 'تم ✓', key: 'ch' + G.used.size + G.msg }, btns: [{ id: 'give', label: 'ما عرفت ❌', cls: 'ghost' }] };
    return { title: '🔗 سلسلة الكلمات', items: it.concat(G.alive.includes(p.id) ? [] : [{ t: 'lab', v: 'طلعت 👀 تتفرج' }]) }; };
  G.hostBtns = () => G.over ? [{ id: 'h:again', label: 'جولة جديدة 🔄', flex: 2 }] : [];
  G.act = (p, m) => { if (m.v === 'h:again') return G.start(); if (G.over || p.id !== G.alive[G.ptr]) return;
    if (m.v === 'give') return G.out(p.id, 'ما عرف');
    if (m.a === 'input') { const w = String(m.v).trim(), n = nrm(w); const L = nrm(G.letter);
      if ([...w].length < 2 || !(n.startsWith(L) || n.replace(/^ال/, '').startsWith(L))) { G.msg = '⚠️ ' + w + ' ما تبدأ بحرف ' + G.letter; return; }
      if (G.used.has(n)) { G.msg = '⚠️ ' + w + ' انقالت قبل!'; return; }
      G.used.add(n); G.last = w; const s = n.replace(/[^ء-ي]/g, ''); let ch = s[s.length - 1]; if (ch === 'ء') ch = s[s.length - 2] || 'ا'; G.letter = ch || pick(LET); G.msg = ''; G.ptr = (G.ptr + 1) % G.alive.length; G.turnStart(); } };
  return G; }

/* ======================================================
   🔐 الرقم السري / 🔤 الكلمة السرية — سباق
   ====================================================== */
const nrmC = s => s.replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/ة/g, 'ه');
function scoreC(guess, secret) { const g = [...guess].map(nrmC), s = [...secret].map(nrmC), res = Array(g.length).fill('x'), left = {}; s.forEach((ch, i) => { if (g[i] === ch) res[i] = 'g'; else left[ch] = (left[ch] || 0) + 1; }); g.forEach((ch, i) => { if (res[i] !== 'g' && left[ch] > 0) { res[i] = 'y'; left[ch]--; } }); return res; }
const CBC = { k: null, cur: '', rows: 0 };
R.cbrace = (it, c, send) => {
  const w = el('div', 'cbO'); w.style.width = '100%'; const ck = it.key + ':' + it.rows.length; if (it.rows.length > CBC.rows && CBC.k && CBC.k.split(':')[0] === String(it.key) && window.SFX) for (let i = 0; i < it.L; i++) setTimeout(() => SFX.flip(), i * 90); CBC.rows = it.rows.length; if (CBC.k !== ck) { CBC.k = ck; CBC.cur = ''; } let cur = CBC.cur;
  const tl = el('div', 'tl' + (it.num ? '' : ' rtl')); tl.style.gridTemplateColumns = 'repeat(' + it.L + ',36px)';
  const draw2 = () => { tl.innerHTML = ''; it.rows.forEach(r => [...r.w].forEach((ch, i) => tl.appendChild(el('div', 'tt ' + r.r[i], ch)))); if (it.can) for (let i = 0; i < it.L; i++) tl.appendChild(el('div', 'tt', cur[i] || '')); };
  draw2(); w.appendChild(tl);
  if (it.can) {
    const keys = it.num ? '1234567890'.split('') : 'ضصثقفغعهخحجشسيبلاتنمكطذءرىةوزظدأ'.split('');
    const kb = el('div', 'kb2'); const st = {}; it.rows.forEach(r => [...r.w].forEach((ch, i) => { const n = nrmC(ch), v = r.r[i]; if (v === 'g' || (v === 'y' && st[n] !== 'g')) st[n] = v; }));
    keys.forEach(k => { const b = btn(k, st[nrmC(k)] || '', () => { if (cur.length < it.L) { cur += k; CBC.cur = cur; draw2(); } }); kb.appendChild(b); });
    const del = btn('⌫', 'ghost', () => { cur = cur.slice(0, -1); CBC.cur = cur; draw2(); }); const ok = btn('دخّل ✓', 'grn', () => { if (cur.length !== it.L) { buzz(80); return; } send({ a: 'input', v: cur }); ok.disabled = true; });
    kb.append(del, ok); w.appendChild(kb);
  }
  c.appendChild(w);
};
function makeCode(mode) { const G = {}; const T = mode === 'num' ? '🔐 الرقم السري' : '🔤 الكلمة السرية';
  G.start = () => { G.L = mode === 'num' ? Math.min(8, Math.max(3, S.cbLen || 4)) : Math.min(5, Math.max(3, S.cbLen || 4)); G.secret = mode === 'num' ? Array.from({ length: G.L }, () => rnd(10)).join('') : pick(SECRET_WORDS[G.L]); G.key = Math.random().toString(36).slice(2, 8); G.rows = {}; G.done = {}; G.rank = []; G.max = mode === 'num' ? 10 : 8; G.over = false; };
  G.view = p => { const rows = G.rows[p.id] || [], d = G.done[p.id];
    const items = [{ t: 'lab', v: (mode === 'num' ? G.L + ' أرقام' : G.L + ' حروف') + ' · كل واحد يخمن على جواله، وأسرع واحد يفوز' }, { t: 'list', v: Object.keys(O.host().players.reduce((a, q) => (q.on && (a[q.id] = 1), a), {})).map(i => [nm(i), G.done[i] === 'win' ? '✅ (' + (G.rows[i] || []).length + ')' : G.done[i] ? '❌' : (G.rows[i] || []).length + ' محاولات', G.done[i] === 'win']) }];
    if (G.over) items.push({ t: 'lab', v: mode === 'num' ? 'الرقم كان' : 'الكلمة كانت' }, { t: 'txt good', v: G.secret });
    else if (d) items.push({ t: 'win ' + (d === 'win' ? 'good' : 'bad'), v: d === 'win' ? 'جبتها! 🎉 المركز ' + (G.rank.indexOf(p.id) + 1) : 'خلصت محاولاتك 😅' });
    items.push({ t: 'cbrace', key: G.key, rows, L: G.L, num: mode === 'num', can: !G.over && !d });
    return { title: T, items, scores: G.over ? O.scoresList() : null }; };
  G.hostBtns = () => G.over ? [{ id: 'h:again', label: 'جولة جديدة 🔄', flex: 2 }] : [{ id: 'h:end', label: 'خلّصوا', cls: 'ghost' }];
  const finish = () => { G.over = true; G.rank.forEach((id, i) => addScore(id, Math.max(1, 3 - i))); };
  G.act = (p, m) => { if (m.v === 'h:again') return G.start(); if (m.v === 'h:end') return finish(); if (G.over || G.done[p.id] || m.a !== 'input') return;
    const w = String(m.v); if ([...w].length !== G.L) return; const r = scoreC(w, G.secret); (G.rows[p.id] = G.rows[p.id] || []).push({ w, r });
    if (r.every(x => x === 'g')) { G.done[p.id] = 'win'; G.rank.push(p.id); } else if (G.rows[p.id].length >= G.max) G.done[p.id] = 'lose';
    if (ids().every(i => G.done[i])) finish(); };
  return G; }

/* ======================================================
   🔢 سودوكو — سباق
   ====================================================== */
R.sdrace = (it, c, send) => {
  if (it.done) { if ($('sudoku').classList.contains('on')) show('online'); c.appendChild(el('div', 'lab', '')); return; }
  const SD = window.SUDOKU.SD;
  if (!SD || SD.key !== it.key) {
    window.SUDOKU.sdStart(it.pz, 'online', { progress: n => send({ a: 'prog', v: n }), finish: (won, secs) => send({ a: 'fin', v: won ? 1 : 0 }) });
    window.SUDOKU.SD.key = it.key;
  }
  window.SUDOKU.setOthers(it.others);
  c.appendChild(el('div', 'lab', 'اللغز مفتوح 🔢')); c.appendChild(btn('رجّعني للسودوكو', '', () => show('sudoku')));
};
function makeSudoku() { const G = {};
  G.start = () => { G.pz = window.SUDOKU.makePuzzle(S.sdLvl || 0); G.key = Math.random(); G.prog = {}; G.fin = []; G.lost = {}; G.over = false; };
  G.view = p => {
    if (G.over) return { title: '🔢 سودوكو', items: [{ t: 'sdrace', done: true }, { t: 'win good', v: G.fin.length ? '🏆 ' + nm(G.fin[0]) : 'خلصت' }, { t: 'list', v: G.fin.map((id, i) => [(i + 1) + '. ' + nm(id), '✅', i === 0]) }], scores: O.scoresList() };
    return { title: '🔢 سودوكو', items: [{ t: 'sdrace', pz: G.pz, key: G.key, others: ids().filter(i => i !== p.id).map(i => ({ name: nm(i), v: G.prog[i] || 0 })) }] };
  };
  G.hostBtns = () => G.over ? [{ id: 'h:again', label: 'لغز جديد 🔄', flex: 2 }] : [{ id: 'h:end', label: 'خلّصوا', cls: 'ghost' }];
  G.act = (p, m) => { if (m.v === 'h:again') return G.start(); if (m.v === 'h:end') { G.over = true; return; }
    if (m.a === 'prog') { G.prog[p.id] = +m.v; return; }
    if (m.a === 'fin') { if (+m.v && !G.fin.includes(p.id)) { G.fin.push(p.id); addScore(p.id, G.fin.length === 1 ? 3 : 1); } else G.lost[p.id] = 1; if (ids().every(i => G.fin.includes(i) || G.lost[i])) G.over = true; } };
  return G; }

/* ======================================================
   ❌⭕ إكس أو
   ====================================================== */
let XO_N = 0;
R.xo = (it, c, send) => { const n = it.b.filter(Boolean).length; if (n > XO_N && window.SFX) SFX.place(); XO_N = n; const g = el('div', 'xoO'); it.b.forEach((v, i) => { const b = btn(v || '', (v || '') + (it.w && it.w.includes(i) ? ' w' : ''), () => send({ a: 'opt', v: i })); b.disabled = !it.can || !!v; g.appendChild(b); }); c.appendChild(g); };
function makeXO() { const G = {}; const L = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  G.start = () => { const a = ids(); G.round = (G.round || 0) + 1; const pair = G.pair && on(G.pair[0]) && on(G.pair[1]) && G.round % 2 === 0 ? [G.pair[1], G.pair[0]] : shuffle(a).slice(0, 2); G.pair = pair; G.b = Array(9).fill(null); G.t = 'X'; G.w = null; G.res = null; };
  G.view = p => { const me = G.pair.indexOf(p.id), sym = me === 0 ? 'X' : me === 1 ? 'O' : null;
    const it = [{ t: 'lab', v: '❌ ' + nm(G.pair[0]) + '  ضد  ⭕ ' + nm(G.pair[1]) }, { t: 'lab', v: G.res || (sym ? (G.t === sym ? 'دورك! أنت ' + (sym === 'X' ? '❌' : '⭕') : 'دور ' + nm(G.pair[G.t === 'X' ? 0 : 1])) : 'تتفرج 👀') }, { t: 'xo', b: G.b, w: G.w, can: !G.res && sym === G.t }];
    return { title: '❌⭕ إكس أو', items: it, scores: G.res ? O.scoresList() : null }; };
  G.hostBtns = () => G.res ? [{ id: 'h:again', label: 'جولة جديدة 🔄', flex: 2 }] : [];
  G.act = (p, m) => { if (m.v === 'h:again') return G.start(); if (G.res || m.a !== 'opt') return; const me = G.pair.indexOf(p.id); if ((me === 0 ? 'X' : me === 1 ? 'O' : null) !== G.t) return; const i = +m.v; if (G.b[i]) return; G.b[i] = G.t;
    for (const l of L) if (G.b[l[0]] && G.b[l[0]] === G.b[l[1]] && G.b[l[1]] === G.b[l[2]]) { G.w = l; G.res = '🎉 ' + nm(p.id) + ' فاز!'; addScore(p.id, 1); return; }
    if (G.b.every(x => x)) { G.res = 'تعادل 🤝'; return; } G.t = G.t === 'X' ? 'O' : 'X'; };
  return G; }

/* ======================================================
   🃏 أونو أونلاين
   ====================================================== */
let UNO_TOP = '';
R.unoT = (it, c, send) => {
  const sig = JSON.stringify(it.top) + it.msg; if (sig !== UNO_TOP) { if (UNO_TOP && window.SFX) { SFX.flip(); if (/أونو/.test(it.msg)) SFX.uno(); } UNO_TOP = sig; }
  const U = window.UNOK, t = el('div', 'unoTable'); t.style.width = '100%';
  const ops = el('div', 'opps'); it.opps.forEach(o => { const d = el('div', 'opp' + (o.turn ? ' turn' : '')); d.append(el('div', '', o.name + ' · ' + o.n)); ops.appendChild(d); }); t.appendChild(ops);
  const ctr = el('div', 'center'); const dk = U.backEl(); if (it.canDraw) { dk.style.cursor = 'pointer'; dk.onclick = () => send({ a: 'btn', v: 'draw' }); } ctr.append(dk, U.cardEl(it.top, true)); t.appendChild(ctr);
  const cc = el('div', 'unoMsg'); cc.innerHTML = 'اللون: <span class="curColor" style="background:' + U.UCOL[it.color] + '"></span> ' + U.UC[it.color]; t.appendChild(cc);
  t.appendChild(el('div', 'unoMsg', it.msg || ''));
  const h = el('div', 'hand2'); it.hand.forEach((card, i) => { const d = U.cardEl(card); if (it.my) d.classList.add(card.ok ? 'ok' : 'no'); if (it.my && card.ok) d.onclick = () => { if (card.c === 'w') { const cp = el('div', 'colorPick'); 'rgby'.split('').forEach(cl => { const b = btn(U.UC[cl], '', () => send({ a: 'opt', v: i + ':' + cl })); b.style.background = U.UCOL[cl]; cp.appendChild(b); }); t.appendChild(cp); cp.scrollIntoView({ behavior: 'smooth' }); } else send({ a: 'opt', v: String(i) }); }; h.appendChild(d); });
  t.appendChild(h); c.appendChild(t);
};
function makeUno() { const G = {};
  G.start = () => { const U = window.UNOK; G.deck = U.newDeck(); G.pile = []; G.dir = 1; G.pl = shuffle(ids()).map(id => ({ id, hand: [] })); G.pl.forEach(p => { for (let i = 0; i < 7; i++) p.hand.push(G.deck.pop()); }); let top; do { top = G.deck.pop(); if (top.c === 'w' || isNaN(+top.v)) G.deck.unshift(top); } while (top.c === 'w' || isNaN(+top.v)); G.pile.push(top); G.color = top.c; G.ti = rnd(G.pl.length); G.drew = false; G.msg = ''; G.over = null; };
  const top = () => G.pile[G.pile.length - 1];
  const ok = c => c.c === 'w' || c.c === G.color || c.v === top().v;
  const draw1 = p => { if (!G.deck.length) { const t = G.pile.pop(); G.deck = shuffle(G.pile.map(c => ({ c: c.c, v: c.v }))); G.pile = [t]; } if (G.deck.length) p.hand.push(G.deck.pop()); };
  const nxt = k => { const n = G.pl.length; return ((G.ti + G.dir * (k || 1)) % n + n) % n; };
  const adv = k => { G.ti = nxt(k); G.drew = false; let guard = 0; while (!on(G.pl[G.ti].id) && guard++ < 10) G.ti = nxt(1); };
  G.leave = p => { if (!G.over && G.pl[G.ti] && G.pl[G.ti].id === p.id) adv(1); };
  G.view = p => {
    const U = window.UNOK, i = G.pl.findIndex(q => q.id === p.id), me = G.pl[i];
    if (G.over) return { title: '🃏 أونو', items: [{ t: 'win good', v: '🏆 ' + nm(G.over) + ' فاز!' }], scores: O.scoresList() };
    const my = i === G.ti;
    const v = { title: '🃏 أونو', items: [{ t: 'unoT', opps: G.pl.filter(q => q.id !== p.id).map(q => ({ name: nm(q.id), n: q.hand.length, turn: q === G.pl[G.ti] })), top: top(), color: G.color, msg: G.msg || (my ? 'دورك!' : 'دور ' + nm(G.pl[G.ti].id)), hand: me ? me.hand.map(c => Object.assign({ ok: my && ok(c) }, c)) : [], my, canDraw: my && !G.drew }] };
    if (my) v.btns = G.drew ? [{ id: 'pass', label: 'مرر ⏭️', cls: 'ghost' }] : [{ id: 'draw', label: 'اسحب ورقة 🃏', cls: me.hand.some(ok) ? 'ghost' : '' }];
    return v;
  };
  G.hostBtns = () => G.over ? [{ id: 'h:again', label: 'جولة جديدة 🔄', flex: 2 }] : [];
  G.act = (p, m) => {
    if (m.v === 'h:again') return G.start();
    if (G.over) return; const i = G.pl.findIndex(q => q.id === p.id); if (i !== G.ti) return; const me = G.pl[i];
    if (m.v === 'draw' && !G.drew) { draw1(me); G.drew = true; G.msg = nm(p.id) + ' سحب'; if (!me.hand.some(ok)) { G.msg = nm(p.id) + ' سحب ومرر'; adv(1); } return; }
    if (m.v === 'pass' && G.drew) { G.msg = nm(p.id) + ' مرر'; adv(1); return; }
    if (m.a === 'opt') { const [ks, col] = String(m.v).split(':'); const k = +ks, card = me.hand[k]; if (!card || !ok(card) || (card.c === 'w' && !'rgby'.includes(col || 'x'))) return;
      me.hand.splice(k, 1); const pc = { c: card.c, v: card.v }; if (card.c === 'w') pc.chosen = col; G.pile.push(pc); G.color = card.c === 'w' ? col : card.c;
      G.msg = nm(p.id) + ' لعب ' + window.UNOK.sym(card.v) + (me.hand.length === 1 ? ' — أونو! 📢' : '');
      if (!me.hand.length) { G.over = p.id; let pts = 0; G.pl.forEach(o => o.hand.forEach(c => pts += c.c === 'w' ? 50 : isNaN(+c.v) ? 20 : +c.v)); addScore(p.id, Math.max(1, Math.round(pts / 20))); return; }
      let skip = 1;
      if (card.v === 'skip') skip = 2; else if (card.v === 'rev') { if (G.pl.length === 2) skip = 2; else G.dir *= -1; }
      else if (card.v === '+2' || card.v === '+4') { const n = G.pl[nxt()]; for (let j = 0; j < (card.v === '+2' ? 2 : 4); j++) draw1(n); G.msg += ' · ' + nm(n.id) + ' سحب ' + (card.v === '+2' ? 2 : 4); skip = 2; }
      adv(skip); }
  };
  return G; }

/* ======================================================
   🎲 لودو أونلاين
   ====================================================== */
let LUDO_MSG = '';
R.ludoO = (it, c, send) => {
  const L = window.LUDO; const wrap = el('div', 'ludoWrap'); wrap.innerHTML = L.svg(); c.appendChild(wrap);
  const g = wrap.querySelector('#toks'); let s = ''; const occ = {};
  it.pl.forEach(P => P.tok.forEach((st, t) => { let pos; if (st < 0) pos = L.YARD[P.c][t]; else if (st >= 56) pos = L.FIN[P.c]; else { const [r, cc] = L.cellOf(P.c, st); pos = [r + .5, cc + .5]; } const k = pos.join(); (occ[k] = occ[k] || []).push([P.c, t, pos]); }));
  const items = []; Object.values(occ).forEach(list => list.forEach(([cl, t, pos], k) => { const off = list.length > 1 ? (k - (list.length - 1) / 2) * .24 : 0; const can = it.mov && cl === it.myc && it.mov.includes(t); items.push({ y: pos[0], svg: `<g class="tok${can ? ' can' : ''}" data-t="${t}" data-c="${cl}">` + L.pawn(cl, pos[1] + off, pos[0] + off * .3 - .05, list.length > 2 ? .75 : .95, can) + `<rect x="${pos[1] + off - .45}" y="${pos[0] - .55}" width=".9" height="1.05" fill="transparent"/></g>` }); }));
  items.sort((a, b) => a.y - b.y).forEach(i => s += i.svg); g.innerHTML = s;
  g.querySelectorAll('.tok.can').forEach(t => t.addEventListener('click', () => send({ a: 'opt', v: +t.dataset.t })));
  const bar = el('div', 'ludoBar'); const who = el('div', 'who', it.who); who.style.color = L.LC[it.turnc]; const cv = el('canvas'); const dpr = window.devicePixelRatio || 1; cv.width = 100 * dpr; cv.height = 100 * dpr;
  bar.append(who, cv); c.insertBefore(bar, wrap);
  if (it.roll) { if (it.anim) window.DIE.roll(cv, it.roll); else window.DIE.draw(cv, it.roll); } else window.DIE.draw(cv, 6);
  if (it.canRoll) cv.onclick = () => send({ a: 'btn', v: 'roll' });
};
function makeLudo() { const G = {}; const L = () => window.LUDO;
  G.start = () => { const a = shuffle(ids()).slice(0, 4); const cols = a.length === 2 ? [0, 2] : [0, 1, 2, 3].slice(0, a.length); G.pl = a.map((id, i) => ({ id, c: cols[i], tok: [-1, -1, -1, -1] })); G.ti = 0; G.roll = null; G.mov = null; G.sixes = 0; G.msg = ''; G.over = null; G.rollId = 0; };
  const cur = () => G.pl[G.ti];
  const legal = (P, v) => P.tok.map((s, t) => s >= 56 ? -1 : s < 0 ? (v === 6 ? t : -1) : s + v <= 56 ? t : -1).filter(t => t >= 0);
  const next = () => { G.sixes = 0; G.roll = null; G.mov = null; let g = 0; do { G.ti = (G.ti + 1) % G.pl.length; } while (!on(cur().id) && g++ < 5); };
  const again = () => { G.roll = null; G.mov = null; };
  G.leave = p => { if (!G.over && cur().id === p.id) next(); };
  G.view = p => { const P = cur(), me = G.pl.find(q => q.id === p.id);
    if (G.over) return { title: '🎲 لودو', items: [{ t: 'win good', v: '🏆 ' + nm(G.over) + ' فاز!' }], scores: O.scoresList() };
    const my = me && me === P;
    const it = { t: 'ludoO', pl: G.pl.map(q => ({ c: q.c, tok: q.tok })), myc: me ? me.c : -1, mov: my && G.mov ? G.mov : null, who: my ? 'دورك!' : 'دور ' + nm(P.id), turnc: P.c, roll: G.roll, anim: G.anim === G.rollId, canRoll: my && G.roll === null };
    return { title: '🎲 لودو', items: [it, { t: 'lab', v: G.msg || (my ? (G.roll === null ? 'اضغط على النرد 🎲' : 'اختار القطعة') : '') }, { t: 'lab', v: G.pl.map(q => ['🔴', '🟢', '🟡', '🔵'][q.c] + ' ' + nm(q.id)).join('  ') }], btns: my && G.roll === null ? [{ id: 'roll', label: 'ارمي النرد 🎲', flex: 2 }] : [] }; };
  G.hostBtns = () => G.over ? [{ id: 'h:again', label: 'لعبة جديدة 🔄', flex: 2 }] : [];
  const move = t => { const P = cur(), v = G.roll; P.tok[t] = P.tok[t] < 0 ? 0 : P.tok[t] + v; let extra = v === 6; G.msg = '';
    const s = P.tok[t];
    if (s <= 50) { const cell = (L().START[P.c] + s) % 52; if (!L().SAFE.includes(cell)) G.pl.forEach(o => { if (o === P) return; o.tok.forEach((os, ot) => { if (os >= 0 && os <= 50 && (L().START[o.c] + os) % 52 === cell) { o.tok[ot] = -1; extra = true; G.msg = '💥 ' + nm(P.id) + ' أكل قطعة ' + nm(o.id) + '!'; } }); }); }
    if (s === 56) { extra = true; G.msg = '🏠 قطعة وصلت البيت!'; }
    if (P.tok.every(x => x >= 56)) { G.over = P.id; addScore(P.id, 3); return; }
    extra ? again() : next(); };
  G.act = (p, m) => {
    if (m.v === 'h:again') return G.start();
    if (G.over || cur().id !== p.id) return;
    if (m.v === 'roll' && G.roll === null) { const v = 1 + rnd(6); G.roll = v; G.rollId++; G.anim = G.rollId; if (v === 6) G.sixes++; else G.sixes = 0;
      if (G.sixes === 3) { G.msg = '٣ ستات ورا بعض! يروح الدور'; later(G, 1500, next); return; }
      const mv = legal(cur(), v); if (!mv.length) { G.msg = 'طلع ' + v + '، ما فيه حركة'; later(G, 1500, () => { G.anim = -1; v === 6 ? again() : next(); }); return; }
      G.mov = mv; const uniq = [...new Set(mv.map(t => cur().tok[t]))]; if (uniq.length === 1) later(G, 1300, () => { if (G.roll === v && G.mov) { G.anim = -1; move(mv[0]); } }); return; }
    if (m.a === 'opt' && G.mov && G.mov.includes(+m.v)) { G.anim = -1; move(+m.v); }
  };
  return G; }

/* ======================================================
   🔪 المافيا أونلاين (التطبيق هو الراوي)
   ====================================================== */
function makeMafia() { const G = {}; const RN = { maf: '🔪 مافيا', doc: '💉 الدكتور', cop: '🕵️ الشرطي', cit: '👤 مواطن' };
  G.start = () => { const a = shuffle(ids()); const nm2 = Math.max(1, Math.floor(a.length / 4)); G.role = {}; a.forEach((id, i) => G.role[id] = i < nm2 ? 'maf' : i === nm2 ? 'doc' : (i === nm2 + 1 && a.length >= 5) ? 'cop' : 'cit'); G.alive = {}; a.forEach(i => G.alive[i] = true); G.day = 1; G.phase = 'roles'; G.seen = {}; G.log = []; G.copRes = {}; G.over = null; };
  const aliveIds = () => Object.keys(G.alive).filter(i => G.alive[i] && on(i));
  const has = r => aliveIds().some(i => G.role[i] === r);
  const check = () => { const m = aliveIds().filter(i => G.role[i] === 'maf').length, o = aliveIds().length - m; if (!m) { G.over = 'cit'; } else if (m >= o) G.over = 'maf'; if (G.over) { G.phase = 'over'; Object.keys(G.role).forEach(i => { if ((G.over === 'maf') === (G.role[i] === 'maf')) addScore(i, 2); }); } };
  const night = () => { G.phase = 'night'; G.mv = {}; G.save = null; G.chk = null; G.res = ''; };
  const nightDone = () => (!has('maf') || aliveIds().filter(i => G.role[i] === 'maf').every(i => G.mv[i])) && (!has('doc') || G.save) && (!has('cop') || G.chk);
  const dawn = () => { const votes = {}; Object.values(G.mv).forEach(t => votes[t] = (votes[t] || 0) + 1); const mx = Math.max(0, ...Object.values(votes)); const tops = Object.keys(votes).filter(t => votes[t] === mx); const kill = tops.length ? pick(tops) : null;
    if (kill && kill !== G.save) { G.alive[kill] = false; G.res = '☠️ المافيا طلّعت ' + nm(kill) + ' بالليل'; } else G.res = kill ? '💉 الدكتور أنقذ اللي استهدفته المافيا! ما مات أحد' : 'ليلة هادية… ما مات أحد';
    G.log.push('الليلة ' + G.day + ': ' + G.res); G.phase = 'day'; G.dv = {}; check(); };
  const dayDone = () => aliveIds().every(i => G.dv[i]);
  const execute = () => { const c = {}; Object.values(G.dv).forEach(t => { if (t !== 'skip') c[t] = (c[t] || 0) + 1; }); const mx = Math.max(0, ...Object.values(c)); const tops = Object.keys(c).filter(t => c[t] === mx);
    if (tops.length === 1 && mx > 0) { G.alive[tops[0]] = false; G.res = '⚖️ الجماعة طلّعوا ' + nm(tops[0]) + ' وكان ' + RN[G.role[tops[0]]]; } else G.res = '⚖️ ما اتفقتوا، ما طلع أحد';
    G.log.push('النهار ' + G.day + ': ' + G.res); G.day++; check(); if (!G.over) { G.phase = 'dusk'; } };
  G.view = p => {
    const T = '🔪 المافيا', r = G.role[p.id], alive = G.alive[p.id];
    if (!r) return { title: T, items: [{ t: 'lab', v: 'الجولة بدأت قبل لا تدخل 👀' }] };
    const myRole = { t: 'lab', v: 'دورك: ' + RN[r] + (r === 'maf' && Object.keys(G.role).filter(i => G.role[i] === 'maf' && i !== p.id).length ? ' (ربعك: ' + Object.keys(G.role).filter(i => G.role[i] === 'maf' && i !== p.id).map(nm).join('، ') + ')' : '') + (alive ? '' : ' — ☠️ طلعت') };
    if (G.phase === 'over') return { title: T, items: [{ t: 'win good', v: G.over === 'maf' ? '🔪 المافيا فازت!' : '👤 المواطنين فازوا!' }, { t: 'list', v: Object.keys(G.role).map(i => [nm(i), RN[G.role[i]], false]) }, { t: 'lab', v: G.log.join(' · ') }], scores: O.scoresList() };
    if (G.phase === 'roles') return { title: T, items: [{ t: 'lab', v: 'دورك السري (لا تخلي أحد يشوف!)' }], secret: '<div style="font-family:Lalezar;font-size:34px">' + RN[r] + '</div>', btns: G.seen[p.id] ? [] : [{ id: 'seen', label: 'شفت ✓' }], status: G.seen[p.id] ? ['ننتظر الباقين…'] : null };
    const others = aliveIds().filter(i => i !== p.id);
    if (G.phase === 'night') {
      const it = [{ t: 'txt', v: '🌙 الليلة ' + G.day }, myRole];
      if (!alive) return { title: T, items: it.concat([{ t: 'lab', v: 'تتفرج 👀' }]) };
      if (r === 'maf' && !G.mv[p.id]) return { title: T, items: it.concat([{ t: 'lab', v: 'مين تطلّعون الليلة؟' }]), opts: others.filter(i => G.role[i] !== 'maf').map(i => ({ id: i, label: nm(i) })) };
      if (r === 'doc' && !G.save) return { title: T, items: it.concat([{ t: 'lab', v: 'مين تنقذ الليلة؟ (تقدر تنقذ نفسك)' }]), opts: aliveIds().map(i => ({ id: i, label: nm(i) })) };
      if (r === 'cop' && !G.chk) return { title: T, items: it.concat([{ t: 'lab', v: 'مين تبي تعرف عنه؟' }]), opts: others.map(i => ({ id: i, label: nm(i) })) };
      return { title: T, items: it.concat(r === 'cop' && G.chk ? [{ t: 'win', v: nm(G.chk) + (G.role[G.chk] === 'maf' ? ' مافيا! 🔪' : ' مو مافيا 👍') }] : []).concat([{ t: 'lab', v: 'غمّض عيونك… 😴 ننتظر الباقين' }]) };
    }
    if (G.phase === 'day') {
      const it = [{ t: 'txt', v: '☀️ صباح الخير' }, { t: 'win', v: G.res }, myRole, { t: 'lab', v: 'تناقشوا وصوتوا مين تطلّعون' }];
      if (!alive) return { title: T, items: it.concat([{ t: 'lab', v: 'تتفرج 👀' }]) };
      if (G.dv[p.id]) return { title: T, items: it.concat([{ t: 'win good', v: 'صوّتت ✓' }]), status: ['ننتظر الباقين… (' + Object.keys(G.dv).length + ' من ' + aliveIds().length + ')'] };
      return { title: T, items: it, opts: others.map(i => ({ id: i, label: nm(i) })).concat([{ id: 'skip', label: 'ما أطلّع أحد', cls: 'ghost' }]) };
    }
    return { title: T, items: [{ t: 'win', v: G.res }, myRole, { t: 'lab', v: 'الأحياء: ' + aliveIds().map(nm).join('، ') }] };
  };
  G.hostBtns = () => G.phase === 'roles' ? [{ id: 'h:night', label: 'ابدأ الليل 🌙', flex: 2 }] : G.phase === 'night' ? [{ id: 'h:dawn', label: 'صباح الخير ☀️ (حتى لو باقي أحد)', cls: 'ghost' }] : G.phase === 'day' ? [{ id: 'h:exec', label: 'اكشف التصويت ⚖️', cls: 'ghost' }] : G.phase === 'dusk' ? [{ id: 'h:night', label: 'الليل 🌙', flex: 2 }] : G.phase === 'over' ? [{ id: 'h:again', label: 'لعبة جديدة 🔄', flex: 2 }] : [];
  G.act = (p, m) => { const r = G.role[p.id];
    if (m.v === 'h:again') return G.start();
    if (G.phase === 'roles') { if (m.v === 'seen') G.seen[p.id] = 1; if (m.v === 'h:night' || Object.keys(G.role).every(i => G.seen[i] || !on(i))) night(); return; }
    if (G.phase === 'dusk' && m.v === 'h:night') return night();
    if (G.phase === 'night') { if (m.v === 'h:dawn') return dawn(); if (!G.alive[p.id] || m.a !== 'opt') return;
      if (r === 'maf' && G.alive[m.v] && G.role[m.v] !== 'maf') G.mv[p.id] = m.v; if (r === 'doc' && !G.save && G.alive[m.v]) G.save = m.v; if (r === 'cop' && !G.chk && G.alive[m.v]) G.chk = m.v;
      if (nightDone()) later(G, 2500, () => { if (G.phase === 'night') dawn(); }); return; }
    if (G.phase === 'day') { if (m.v === 'h:exec') return execute(); if (G.alive[p.id] && m.a === 'opt' && !G.dv[p.id]) { G.dv[p.id] = m.v; if (dayDone()) execute(); } }
  };
  return G; }

/* ======================================================
   🧠 سين جيم أونلاين (فريقين)
   ====================================================== */
R.sjB = (it, c, send) => { const b = el('div', 'sjB'); it.cats.forEach((cat, ci) => { const r = el('div', 'r'); r.appendChild(el('b', '', cat)); [200, 200, 400, 400, 600, 600].forEach((l, k) => { const used = it.used[ci + '|' + l + '|' + (k % 2)]; const x = btn(String(l), l === 200 ? 'grn' : l === 400 ? 'yel' : 'red', () => send({ a: 'opt', v: ci + '|' + l + '|' + (k % 2) })); x.disabled = used || !it.can; r.appendChild(x); }); b.appendChild(r); }); c.appendChild(b); };
function makeSJ() { const G = {};
  G.start = () => { const a = shuffle(ids()); G.team = {}; a.forEach((id, i) => G.team[id] = i % 2); const cats = []; while (cats.length < 6) { const c = draw('sjcats', Object.keys(SJ)); if (!cats.includes(c)) cats.push(c); } G.cats = cats; G.cells = {}; cats.forEach((c, ci) => [200, 400, 600].forEach(l => { G.cells[ci + '|' + l + '|0'] = draw('sj_' + c + '_' + l, SJ[c][l]); G.cells[ci + '|' + l + '|1'] = draw('sj_' + c + '_' + l, SJ[c][l]); })); G.used = {}; G.turn = 0; G.sc = [0, 0]; G.life = [{ swap: 1, dbl: 1, hint: 1 }, { swap: 1, dbl: 1, hint: 1 }]; G.q = null; G.over = false; };
  const tn = t => t ? 'الفريق الأزرق 🔵' : 'الفريق الأحمر 🔴';
  const members = t => Object.keys(G.team).filter(i => G.team[i] === t).map(nm).join('، ');
  G.join = p => { if (G.team[p.id] === undefined) G.team[p.id] = Object.values(G.team).filter(x => x === 0).length <= Object.values(G.team).filter(x => x === 1).length ? 0 : 1; };
  G.view = p => { const t = G.team[p.id]; const head = [{ t: 'list', v: [[tn(0) + ': ' + members(0), G.sc[0], G.turn === 0], [tn(1) + ': ' + members(1), G.sc[1], G.turn === 1]] }];
    if (G.over) return { title: '🧠 سين جيم', items: head.concat([{ t: 'win good', v: G.sc[0] === G.sc[1] ? 'تعادل 🤝' : '🏆 ' + tn(G.sc[0] > G.sc[1] ? 0 : 1) }]), scores: O.scoresList() };
    if (!G.q) return { title: '🧠 سين جيم', items: head.concat([{ t: 'lab', v: 'أنت في ' + tn(t) }, { t: 'lab', v: 'دور ' + tn(G.turn) + ': اختاروا سؤال' }, { t: 'sjB', cats: G.cats, used: G.used, can: t === G.turn }]) };
    const q = G.q, it = head.concat([{ t: 'lab', v: G.cats[q.ci] + ' · ' + q.l + ' نقطة' + (q.dbl ? ' · دبل ✖️٢' : '') }, { t: 'txt', v: q.q.q }]);
    if (q.hint) it.push({ t: 'hintx', v: '💡 ' + q.q.h });
    if (q.rev) it.push({ t: 'lab', v: 'الجواب' }, { t: 'ans', v: q.q.a });
    else it.push(cd(left(q.end)));
    const b = !q.rev && t === G.turn ? [{ id: 'swap', label: '🔄 غيّر', cls: 'ghost' }, { id: 'dbl', label: '✖️٢ دبل', cls: 'ghost' }, { id: 'hint', label: '💡 تلميح', cls: 'ghost' }].filter(x => G.life[t][x.id] && !(x.id === 'dbl' && q.dbl) && !(x.id === 'hint' && q.hint)) : [];
    return { title: '🧠 سين جيم', items: it, btns: b }; };
  G.hostBtns = () => G.over ? [{ id: 'h:again', label: 'لعبة جديدة 🔄', flex: 2 }] : !G.q ? [{ id: 'h:end', label: 'إنهاء 🏁', cls: 'ghost' }] : !G.q.rev ? [{ id: 'h:rev', label: 'اكشف الجواب 👀', flex: 2 }] : [{ id: 'h:t0', label: '🔴 جاوب صح', cls: 'red' }, { id: 'h:t1', label: '🔵 جاوب صح' }, { id: 'h:none', label: 'ولا أحد', cls: 'ghost' }];
  G.act = (p, m) => { const t = G.team[p.id];
    if (m.v === 'h:again') return G.start(); if (m.v === 'h:end') { G.over = true; return; }
    if (!G.q) { if (m.a === 'opt' && t === G.turn && !G.used[m.v] && G.cells[m.v]) { const [ci, l] = m.v.split('|').map(Number); G.q = { key: m.v, ci, l, q: G.cells[m.v], end: Date.now() + TIME('sj') * 1000 }; } return; }
    const q = G.q;
    if (!q.rev && t === G.turn) { if (m.v === 'swap' && G.life[t].swap) { G.life[t].swap = 0; q.q = draw('sj_' + G.cats[q.ci] + '_' + q.l, SJ[G.cats[q.ci]][q.l]); } if (m.v === 'dbl' && G.life[t].dbl) { G.life[t].dbl = 0; q.dbl = true; } if (m.v === 'hint' && G.life[t].hint) { G.life[t].hint = 0; q.hint = true; } }
    if (m.v === 'h:rev') q.rev = true;
    if (q.rev && /^h:(t0|t1|none)$/.test(m.v)) { const w = m.v === 'h:t0' ? 0 : m.v === 'h:t1' ? 1 : -1; if (w >= 0) { const pts = (w === G.turn && q.dbl) ? q.l * 2 : q.l; G.sc[w] += pts; Object.keys(G.team).forEach(i => { if (G.team[i] === w) addScore(i, Math.round(pts / 200)); }); } G.used[q.key] = 1; G.q = null; G.turn = 1 - G.turn; if (Object.keys(G.cells).every(k => G.used[k])) G.over = true; }
  };
  return G; }

/* ======================================================
   👨‍👩‍👧 فاميلي فيود أونلاين (المضيف يدير، والكل يشوف اللوحة)
   ====================================================== */
R.feudB = (it, c) => { const b = el('div', 'feud'); it.a.forEach((a, i) => { const t = el('div', 'ftile ' + (a ? 'open' : 'hid')); if (a) t.append(el('span', '', a.t), el('span', 'pt', a.p)); else t.textContent = i + 1; b.appendChild(t); }); c.appendChild(b); };
function makeFeud() { const G = {};
  G.start = () => { const a = shuffle(ids()); G.team = {}; a.forEach((id, i) => G.team[id] = i % 2); G.sc = [0, 0]; G.r = 0; G.round(); };
  G.round = () => { G.r++; G.q = draw('feud', FEUD); G.open = G.q.a.map(() => false); G.bank = 0; G.x = 0; G.play = null; G.phase = 'pick'; };
  const tn = t => t ? '🔵 الأزرق' : '🔴 الأحمر';
  G.view = p => { const it = [{ t: 'list', v: [[tn(0), G.sc[0], G.play === 0], [tn(1), G.sc[1], G.play === 1]] }, { t: 'lab', v: 'أنت في ' + tn(G.team[p.id]) + ' · الجولة ' + G.r }, { t: 'lab', v: 'سألنا ١٠٠ شخص:' }, { t: 'txt', v: G.q.q + '؟' }, { t: 'feudB', a: G.q.a.map((a, i) => G.open[i] || G.phase === 'end' ? a : null) }, { t: 'bank', v: 'مجموع الجولة: ' + G.bank }, { t: 'strikes', v: '✖'.repeat(G.x) }];
    it.push({ t: 'lab', v: G.phase === 'pick' ? 'قولوا أجوبتكم بصوت عالي! المضيف يختار الفريق اللي بيلعب' : G.phase === 'steal' ? 'فرصة ' + tn(1 - G.play) + ' يسرقون!' : G.phase === 'end' ? '' : 'دور ' + tn(G.play) });
    if (p.id === 'host' && (G.phase === 'play' || G.phase === 'steal')) it.push({ t: 'lab', v: '👇 اضغط على الجواب اللي قالوه' }, { t: 'hb', b: G.q.a.map((a, i) => G.open[i] ? null : { id: 'h:o' + i, label: (i + 1) + '. ' + a.t + ' (' + a.p + ')' }).filter(Boolean) });
    return { title: '👨‍👩‍👧 فاميلي فيود', items: it, scores: G.phase === 'end' ? O.scoresList() : null }; };
  G.hostBtns = () => { if (G.phase === 'pick') return [{ id: 'h:p0', label: '🔴 يلعب', cls: 'red' }, { id: 'h:p1', label: '🔵 يلعب' }]; if (G.phase === 'end') return [{ id: 'h:next', label: 'الجولة الجاية ←', flex: 2 }];
    return G.phase === 'steal' ? [{ id: 'h:nosteal', label: 'ما سرقوها ❌' }] : [{ id: 'h:x', label: '✖ غلط', cls: 'red' }]; };
  const fin = t => { G.sc[t] += G.bank; Object.keys(G.team).forEach(i => { if (G.team[i] === t) addScore(i, Math.round(G.bank / 50)); }); G.phase = 'end'; };
  G.act = (p, m) => { if (m.v === 'h:next') return G.round(); if (G.phase === 'pick' && /^h:p[01]$/.test(m.v)) { G.play = +m.v[3]; G.phase = 'play'; return; }
    if (/^h:o\d$/.test(m.v)) { const i = +m.v.slice(3); if (G.open[i]) return; G.open[i] = true; G.bank += G.q.a[i].p; if (G.phase === 'steal') return fin(1 - G.play); if (G.open.every(x => x)) fin(G.play); return; }
    if (m.v === 'h:x' && G.phase === 'play') { G.x++; if (G.x >= 3) G.phase = 'steal'; return; }
    if (m.v === 'h:nosteal' && G.phase === 'steal') fin(G.play); };
  return G; }
R.hb = (it, c, send) => { const o = el('div', 'opts'); o.style.gridTemplateColumns = '1fr 1fr'; it.b.forEach(x => o.appendChild(btn(x.label, x.cls || 'ghost', () => send({ a: 'btn', v: x.id })))); c.appendChild(o); };
R.ans = (it, c) => c.appendChild(el('div', 'ans', it.v));
R.hintx = (it, c) => c.appendChild(el('div', 'hintx', it.v));
R.bank = (it, c) => c.appendChild(el('div', 'bank', it.v));
R.strikes = (it, c) => c.appendChild(el('div', 'strikes', it.v));
R.or = (it, c) => c.appendChild(el('div', 'or', it.v));

/* ======================================================
   🔄 الكلام المعكوس أونلاين (الصوت ينتقل بين الجوالات)
   ====================================================== */
function bufTo(buf, rate) { // نصغر الصوت عشان ينرسل بسرعة
  const src = buf.getChannelData(0), ratio = buf.sampleRate / rate, n = Math.floor(src.length / ratio), out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = src[Math.floor(i * ratio)];
  const ab = new ArrayBuffer(44 + n * 2), v = new DataView(ab), w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) { const x = Math.max(-1, Math.min(1, out[i])); v.setInt16(44 + i * 2, x < 0 ? x * 0x8000 : x * 0x7fff, true); }
  let s = ''; const u8 = new Uint8Array(ab); for (let i = 0; i < u8.length; i += 8192) s += String.fromCharCode.apply(null, u8.subarray(i, i + 8192)); return 'data:audio/wav;base64,' + btoa(s);
}
async function urlToBuf(url) { const ab = await (await fetch(url)).arrayBuffer(); return await new Promise((res, rej) => { const p = audioCtx().decodeAudioData(ab, res, rej); if (p && p.then) p.then(res, rej); }); }
R.recO = (it, c, send) => {
  const box = el('div', 'recbtns'); let mine = null, theirs = null; const err = el('div', 'err', ''); err.id = 'micErr';
  if (it.audio) { const bRev = el('button', 'yel'); bRev.innerHTML = '<span>🔁</span>صوته معكوس'; bRev.onclick = async () => { theirs = theirs || await urlToBuf(it.audio); playBuf(reverseBuf(theirs)); }; box.appendChild(bRev);
    if (it.normal) { const bN = el('button', 'ghost'); bN.innerHTML = '<span>▶️</span>صوته طبيعي'; bN.onclick = async () => { theirs = theirs || await urlToBuf(it.audio); playBuf(theirs); }; box.appendChild(bN); } }
  if (it.rec) { const bRec = el('button', ''); bRec.innerHTML = '<span>🎙️</span>تسجيل'; const bR = el('button', 'yel'); bR.innerHTML = '<span>🔁</span>المعكوس'; const bN2 = el('button', 'ghost'); bN2.innerHTML = '<span>▶️</span>الطبيعي'; bR.disabled = bN2.disabled = true;
    bRec.onclick = () => recToggle(bRec, buf => { mine = buf; bR.disabled = bN2.disabled = false; if (it.send) { sendB.disabled = false; } }); bR.onclick = () => playBuf(reverseBuf(mine)); bN2.onclick = () => playBuf(mine);
    box.append(bRec, bR, bN2); var sendB = btn('أرسل التسجيل 📤', 'grn', () => { if (!mine) return; sendB.disabled = true; sendB.textContent = 'جاري الإرسال…'; send({ a: 'audio', v: bufTo(mine, 11025) }); }); sendB.disabled = true; sendB.style.width = '100%'; sendB.style.marginTop = '8px';
    c.appendChild(box); if (it.send) c.appendChild(sendB); c.appendChild(err); return; }
  c.appendChild(box);
};
function makeRev() { const G = {};
  G.start = () => { const a = ids(); G.A = draw('onrev', a); G.B = pick(a.filter(x => x !== G.A)) || G.A; [G.c, G.w] = topicWord(Object.keys(TOPICS)); G.audio = null; G.res = null; G.rev = false; };
  G.view = p => { const T = '🔄 الكلام المعكوس', it = [{ t: 'lab', v: nm(G.A) + ' يسجّل 🎙️ و ' + nm(G.B) + ' يخمّن 🤔' }, { t: 'lab', v: 'الموضوع: ' + G.c }];
    if (G.rev) return { title: T, items: it.concat([{ t: 'lab', v: 'الكلمة' }, { t: 'txt good', v: G.w }, { t: 'win', v: G.res || '' }, { t: 'recO', audio: G.audio, normal: true }]), scores: O.scoresList() };
    if (p.id === G.A && !G.audio) return { title: T, items: it.concat([{ t: 'lab', v: 'كلمتك السرية:' }, { t: 'txt good', v: G.w }, { t: 'lab', v: 'سجّل نفسك وأنت تقولها بوضوح، وبعدين أرسل' }, { t: 'recO', rec: true, send: true }]) };
    if (p.id === G.B && G.audio) return { title: T, items: it.concat([{ t: 'lab', v: '١) اسمع صوت ' + nm(G.A) + ' معكوس' }, { t: 'recO', audio: G.audio }, { t: 'lab', v: '٢) قلّده وسجّل، واسمع تقليدك معكوس' }, { t: 'recO', rec: true }, { t: 'lab', v: '٣) قول تخمينك بصوت عالي!' }]) };
    if (G.audio) return { title: T, items: it.concat([{ t: 'lab', v: nm(G.B) + ' يحاول يخمن… اسمعوا معه:' }, { t: 'recO', audio: G.audio }]) };
    return { title: T, items: it.concat([{ t: 'lab', v: nm(G.A) + ' يسجّل…' }]) }; };
  G.hostBtns = () => G.rev ? [{ id: 'h:next', label: 'اللي بعده ←', flex: 2 }] : G.audio ? [{ id: 'h:yes', label: 'خمنها ✅', cls: 'grn' }, { id: 'h:no', label: 'ما خمنها ❌', cls: 'ghost' }] : [];
  G.act = (p, m) => { if (m.v === 'h:next') return G.start(); if (m.a === 'audio' && p.id === G.A && !G.audio && /^data:audio\/wav;base64,/.test(m.v) && m.v.length < 3e6) { G.audio = m.v; return; }
    if (m.v === 'h:yes' && G.audio && !G.rev) { G.rev = true; G.res = '🎉 ' + nm(G.B) + ' خمنها!'; addScore(G.A, 1); addScore(G.B, 1); } if (m.v === 'h:no' && G.audio && !G.rev) { G.rev = true; G.res = 'ما خمنها 😅'; } };
  return G; }

/* ---------- تسجيل كل الألعاب الأونلاين ---------- */
const reg = (id, e, n, d, min, make) => O.register(id, { e, n, d, min, make });
reg('tod', '🔥', 'صراحة ولا جرأة', 'اللي عليه الدور يختار من جواله', 2, makeTod);
reg('hot', '🪑', 'الكرسي الساخن', 'الكل يسأل واحد', 3, makeHot);
reg('wyr', '🤔', 'لو خيروك', 'كل واحد يختار من جواله', 2, () => makeVoteQ('wyr'));
reg('ml', '👉', 'مين أكثر واحد', 'تصويت سري على بعض', 3, () => makeVoteQ('ml'));
reg('nhie', '🙈', 'ولا مرة', 'سويتها ولا لا؟', 2, () => makeVoteQ('nhie'));
reg('cha', '🎭', 'تمثيل بدون كلام', 'الكلمة تطلع على جوال الممثل', 2, () => makeActing('cha'));
reg('tab', '🚫', 'الكلمة الممنوعة', 'الكارت على جوال اللي يوصف', 2, () => makeActing('tab'));
reg('g20', '❓', 'خمن الشي', '٢٠ سؤال', 2, makeG20);
reg('five', '⏱️', '٥ ثواني', 'والباقين يحكمون', 3, makeFive);
reg('bomb', '💣', 'القنبلة', 'تنتقل من جوال لجوال!', 2, makeBomb);
reg('let', '🔤', 'إنسان حيوان نبات', 'كل واحد يكتب على جواله وتنصحح بروحها', 2, makeLetters);
reg('triv', '⚡', 'مسابقة سريعة', 'أسرع جواب ياخذ نقاط أكثر', 2, () => makeQuiz('triv'));
reg('flags', '🚩', 'خمن الدولة', 'أعلام وإيموجي، أسرع واحد', 2, () => makeQuiz('flags'));
reg('mil', '💰', 'من سيبقى للمليون', 'اللي يغلط يطلع', 2, () => makeQuiz('mil'));
reg('scrr', '🔀', 'الحروف المخربطة', 'أول واحد يكتبها صح', 2, makeScr);
reg('chain', '🔗', 'سلسلة الكلمات', 'كل واحد يكتب بدوره', 2, makeChain);
reg('num', '🔐', 'الرقم السري', 'سباق: مين يكشفه أول', 2, () => makeCode('num'));
reg('word', '🔤', 'الكلمة السرية', 'سباق وردل بالعربي', 2, () => makeCode('word'));
reg('sudoku', '🔢', 'سودوكو', 'سباق على نفس اللغز', 2, makeSudoku);
reg('xo', '❌', 'إكس أو', 'اثنين يلعبون والباقي يتفرج', 2, makeXO);
reg('uno', '🃏', 'أونو', 'كل واحد ورقه على جواله', 2, makeUno);
reg('ludo', '🎲', 'لودو', 'لين ٤ لاعبين', 2, makeLudo);
reg('mafia', '🔪', 'المافيا', 'التطبيق هو الراوي!', 4, makeMafia);
reg('sj', '🧠', 'سين جيم', 'فريقين، والمضيف يحكم', 2, makeSJ);
reg('feud', '👨‍👩‍👧', 'فاميلي فيود', 'المضيف يكشف الأجوبة', 2, makeFeud);
reg('rev', '🔄', 'الكلام المعكوس', 'الصوت ينتقل بين الجوالات', 2, makeRev);
window.__on2 = () => ({ scoreC });
})();
