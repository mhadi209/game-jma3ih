/* ===== تقزيرة: ألعاب وأدوات إضافية =====
   الرسم مع الامبوستر، سين جيم، فاميلي فيود، النرد 3D، الأكواب، القارورة، العملة، تقسيم الفرق */
(function () {
'use strict';

/* ---------- أدوات مشتركة ---------- */
function mkScreen(id, title) {
  const d = el('div', 'screen'); d.id = id;
  const top = el('div', 'top');
  const back = el('button', 'back', '→'); back.onclick = () => { renderHome(); show('home'); };
  const h = el('h1', '', title);
  const help = el('button', 'back help', '📖 شرح'); help.onclick = openHelp;
  top.append(back, h, help);
  const body = el('div', ''), bottom = el('div', 'bottom'), row = el('div', 'row');
  bottom.appendChild(row); d.append(top, body, bottom);
  document.body.insertBefore(d, document.querySelector('script'));
  return { el: d, h, body, row, back };
}
function stepper(label, get, set, min, max, fmt) {
  const t = el('div', 'toggle'); t.appendChild(el('b', '', label));
  const st = el('div', 'stepper'), m = el('button', 'ghost', '−'), v = el('span', ''), p = el('button', 'ghost', '+');
  const upd = () => { v.textContent = fmt ? fmt(get()) : get(); };
  m.onclick = () => { set(Math.max(min(), get() - 1)); upd(); save(); };
  p.onclick = () => { set(Math.min(max(), get() + 1)); upd(); save(); };
  st.append(m, v, p); t.appendChild(st); upd(); return t;
}
function chipSet(box, all, sel, max, onChange) {
  box.innerHTML = '';
  all.forEach(c => {
    const b = el('button', 'chip' + (sel.includes(c) ? ' sel' : ''), c);
    b.onclick = () => {
      if (sel.includes(c)) sel.splice(sel.indexOf(c), 1);
      else { if (max && sel.length >= max) { buzz(80); return; } sel.push(c); }
      chipSet(box, all, sel, max, onChange); onChange && onChange();
    };
    box.appendChild(b);
  });
}
const teamNames = () => { S.teams = S.teams || ['الفريق الأول', 'الفريق الثاني']; return S.teams; };
function teamInputs(box) {
  box.innerHTML = ''; box.appendChild(el('h2', '', 'الفرق 👥'));
  teamNames().forEach((n, i) => {
    const inp = el('input'); inp.type = 'text'; inp.value = n; inp.maxLength = 16; inp.style.marginBottom = '8px'; inp.style.width = '100%';
    inp.oninput = () => { S.teams[i] = inp.value.trim() || ('الفريق ' + (i + 1)); save(); };
    box.appendChild(inp);
  });
}
function scoreHead(box, teams, turn) {
  box.innerHTML = '';
  const r = el('div', 'tscore');
  teams.forEach((t, i) => {
    const d = el('div', 'tbox' + (i === turn ? ' turn' : ''));
    d.append(el('div', 'tn', t.n), el('div', 'ts', t.s));
    if (Array.isArray(t.life)) { const l = el('div', 'tl'); t.life.forEach(k => l.appendChild(el('span', '', SJL[k].n.split(' ')[0]))); if (!t.life.length) l.appendChild(el('span', 'used', '—')); d.appendChild(l); }
    r.appendChild(d);
  });
  box.appendChild(r);
}

/* ---------- CSS إضافي ---------- */
const css = document.createElement('style');
css.textContent = `
.tscore{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
.tbox{background:var(--card);border:2px solid var(--line);border-radius:14px;padding:8px;text-align:center;box-shadow:var(--sh);opacity:.7}
.tbox.turn{opacity:1;background:var(--yel);color:var(--txt)}
body.dark .tbox.turn{color:#1c1611}
.tbox .tn{font-weight:700;font-size:15px}.tbox .ts{font-family:'Lalezar';font-size:30px;line-height:1.1}
.tbox .tl{display:flex;justify-content:center;gap:6px;font-size:15px}.tbox .tl .used{opacity:.25;filter:grayscale(1)}
.sjrow{background:var(--card);border:2px solid var(--line);border-radius:14px;padding:8px;margin-bottom:10px;box-shadow:var(--sh)}
.sjrow .cn{font-family:'Lalezar';font-size:18px;margin-bottom:6px}
.sjcells{display:grid;grid-template-columns:repeat(6,1fr);gap:5px}
.sjcells button{padding:8px 0;font-size:16px;box-shadow:2px 2px 0 var(--line);border-radius:9px}
.sjcells button.l200{background:var(--grn)}.sjcells button.l400{background:var(--yel);color:#2b1d12}.sjcells button.l600{background:var(--red)}
.sjcells button:disabled{background:var(--paper)!important;color:var(--dash)!important;box-shadow:none;text-decoration:line-through}
.life{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;width:100%}
.life button{font-size:15px;padding:9px 4px}
.ans{font-family:'Lalezar';font-size:30px;color:var(--grn);line-height:1.4;overflow-wrap:anywhere;word-break:break-word;max-width:100%}
#sjQ .bigcard .txt{overflow-wrap:anywhere;max-width:100%}
.hintx{background:var(--paper);border:2px dashed var(--yel);border-radius:10px;padding:6px 12px;font-weight:700}
.dblx{background:var(--red);color:var(--cream);border-radius:14px;padding:2px 12px;font-family:'Lalezar';font-size:16px;line-height:1.6}
.paper{background:#fffdf7;border:2px solid var(--line);border-radius:14px;box-shadow:var(--sh);touch-action:none;display:block;margin:0 auto;
 background-image:linear-gradient(#e7eef7 1px,transparent 1px);background-size:100% 28px}
.dot{display:inline-block;width:16px;height:16px;border-radius:50%;border:2px solid var(--line);vertical-align:middle;margin-left:6px}
.feud{display:grid;grid-template-columns:1fr;gap:7px;width:100%}
.ftile{display:flex;justify-content:space-between;align-items:center;background:#1f3b63;color:#fff;border:2px solid var(--line);border-radius:10px;padding:10px 14px;font-weight:700;font-size:18px;box-shadow:2px 2px 0 var(--line);cursor:pointer}
.ftile.hid{justify-content:center;font-family:'Lalezar';font-size:22px;background:repeating-linear-gradient(135deg,#1f3b63 0 12px,#244575 12px 24px)}
.ftile.open{background:var(--paper);color:var(--txt)}
.ftile .pt{font-family:'Lalezar';background:var(--yel);color:#2b1d12;border-radius:8px;padding:0 10px}
.ftile.miss{opacity:.65}
.strikes{font-size:40px;letter-spacing:6px;color:var(--red);min-height:48px;font-family:'Lalezar'}
.bank{font-family:'Lalezar';font-size:22px}
.dicewrap{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin:6px 0}
.dicewrap canvas{width:150px;height:150px;cursor:pointer}
.total{font-family:'Lalezar';font-size:44px;text-align:center;line-height:1.2;direction:ltr}
.cupstage{position:relative;height:200px;margin:20px 0 10px;user-select:none}
.cup{position:absolute;left:0;bottom:20px;width:80px;height:100px;cursor:pointer;z-index:2}
.cup svg{width:100%;height:100%;filter:drop-shadow(3px 3px 0 rgba(0,0,0,.35))}
.ball{position:absolute;bottom:22px;width:34px;height:34px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ffe28a,#d79a35 60%,#8a5a12);border:2px solid var(--line);z-index:1}
.table{position:absolute;left:0;right:0;bottom:0;height:24px;border-radius:12px;background:#7a4a24;border:2px solid var(--line)}
.bottlebox{position:relative;width:min(88vw,380px);height:min(88vw,380px);margin:4px auto 10px}
.bottlebox .nm{position:absolute;z-index:2;transform:translate(-50%,-50%);background:var(--card);border:2px solid var(--line);border-radius:999px;padding:2px 10px;font-weight:700;font-size:14px;white-space:nowrap;box-shadow:2px 2px 0 var(--line);transition:.3s}
.bottlebox .nm.hitA{background:var(--grn);color:#fff;transform:translate(-50%,-50%) scale(1.25)}
.bottlebox .nm.hitB{background:var(--red);color:#fff;transform:translate(-50%,-50%) scale(1.25)}
.bottle{position:absolute;left:50%;top:50%;width:52px;height:190px;margin:-95px 0 0 -26px;filter:drop-shadow(6px 8px 4px rgba(0,0,0,.4))}
.woodtable{position:absolute;inset:6%;border-radius:50%;background:repeating-radial-gradient(circle at 50% 50%,#9a6236 0 6px,#8a5530 6px 9px,#a86c3d 9px 15px),radial-gradient(circle,#b07445,#6b3d1e);border:6px solid #4a2a12;box-shadow:inset 0 0 30px rgba(0,0,0,.45),0 8px 0 #2b1d12}
.wheelWrap{position:relative;width:max-content;margin:6px auto}
.wPtr{position:absolute;top:-6px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:16px solid transparent;border-right:16px solid transparent;border-top:34px solid var(--red);filter:drop-shadow(0 3px 0 #2b1d12)}
.coin3d{width:170px;height:170px;margin:20px auto;perspective:800px}
.coin3d .in{width:100%;height:100%;position:relative;transform-style:preserve-3d;transition:transform 2s cubic-bezier(.2,.7,.2,1)}
.coin3d .f{position:absolute;inset:0;border-radius:50%;backface-visibility:hidden;-webkit-backface-visibility:hidden;display:flex;align-items:center;justify-content:center;font-family:'Lalezar';font-size:34px;color:#5a3b06;
 background:radial-gradient(circle at 35% 30%,#fff2b8,#e3b13e 55%,#a8761a);border:5px solid #8a5a12;box-shadow:inset 0 0 0 8px rgba(255,255,255,.25)}
.coin3d .f.b{transform:rotateY(180deg)}
.teamcol{border:2px solid var(--line);border-radius:14px;padding:10px;margin-bottom:10px;box-shadow:var(--sh)}
.teamcol h2{margin-bottom:6px}
.teamcol .pl{display:inline-flex;margin:3px}
.picker{font-family:'Lalezar';font-size:40px;text-align:center;min-height:60px;color:var(--red)}
`;
document.head.appendChild(css);

/* =================================================================
   🎨 الرسم مع الامبوستر
   ================================================================= */
const DRAW_CATS = ['حيوانات 🐾', 'أكل وشرب 🍽️', 'نباتات وفواكه وخضار 🌿', 'سيارات ومواصلات 🚗', 'أماكن 📍', 'أغراض 🏠', 'أجهزة 🔌', 'جسم الإنسان 🫀', 'فضاء وطبيعة 🌙', 'مهن 👨‍⚕️', 'ملابس وماركات 👕', 'شخصيات كرتون 📺'].filter(c => TOPICS[c]);
const COLORS = ['#d7263d', '#1b6ca8', '#2e8b57', '#f29e0c', '#7b2cbf', '#e75a9c', '#00a6a6', '#6b4226', '#222222', '#8db600'];
const dS = mkScreen('drawSetup', '🎨 ارسم وصيد الامبوستر');
const dP = mkScreen('drawPlay', '🎨 الرسم');
function drawSetup() {
  S.dcats = (S.dcats || DRAW_CATS.slice()).filter(c => DRAW_CATS.includes(c)); if (!S.dcats.length) S.dcats = DRAW_CATS.slice();
  S.drounds = S.drounds || 2;
  const b = dS.body; b.innerHTML = '';
  const box1 = el('div', 'box'); const h = el('h2', '', 'المواضيع'); const all = btn('الكل', 'ghost small', () => { S.dcats = S.dcats.length === DRAW_CATS.length ? [] : DRAW_CATS.slice(); drawSetup(); }); all.style.flex = 'none'; h.appendChild(all);
  const chips = el('div', 'chips'); box1.append(h, chips); chipSet(chips, DRAW_CATS, S.dcats, 0, save);
  const box2 = el('div', 'box');
  box2.appendChild(stepper('عدد الجولات (كل واحد يرسم خط بكل جولة)', () => S.drounds, v => S.drounds = v, () => 1, () => 5));
  box2.appendChild(stepper('عدد الامبوسترز', () => Math.min(S.imps, impMax()), v => S.imps = v, () => 1, () => impMax()));
  const tg = el('div', 'toggle'); tg.append(el('div', '', ''), el('div', 'sw' + (S.hint ? ' on' : ''))); tg.firstChild.innerHTML = '<b>الامبوستر يعرف الموضوع</b><small>يشوف "حيوانات" بس بدون الكلمة</small>';
  tg.lastChild.onclick = () => { S.hint = !S.hint; save(); drawSetup(); }; box2.appendChild(tg);
  const err = el('div', 'err', ''); b.append(box1, box2, err);
  setBtns2(dS.row, [btn('ابدأ 🎨', '', () => { if (!S.dcats.length) { err.textContent = 'اختار موضوع واحد على الأقل'; return; } drawRound(); })]);
  save(); show('drawSetup');
}
function setBtns2(row, list) { row.innerHTML = ''; list.forEach(b => row.appendChild(b)); }
function drawRound() {
  const [cat, word] = topicWord(S.dcats);
  const n = Math.min(S.imps, impMax());
  const imps = shuffle(S.players.map((_, i) => i)).slice(0, n);
  G = { cat, word, imps, order: S.players.slice(), round: 0, out: [], again: drawRound, setup: drawSetup, img: null };
  const items = G.order.map((p, i) => ({ name: p, html: imps.includes(i)
    ? '<div class="emo">🤫</div><div class="t2 bad">إنت الامبوستر!</div><div class="t1">' + (S.hint ? 'الموضوع: <b>' + esc(cat) + '</b>' : 'ارسم شي عام وحاول تفهم ويش يرسمون') + '</div>'
    : '<div class="emo">🎨</div><div class="t1">' + esc(cat) + '</div><div class="t2 good">' + esc(word) + '</div><div class="desc">' + esc(descOf(cat, word)) + '</div><div class="t1">ارسم خط واحد يساعد ربعك، بس لا تفضحها للامبوستر!</div>' }));
  startReveal('🎨 ارسم وصيد الامبوستر', items, 'يلا نرسم 🎨', drawStart, 'drawSetup');
}
let DR = null;
function drawStart() {
  const order = shuffle(G.order), turns = [];
  for (let r = 0; r < S.drounds; r++) order.forEach(p => turns.push({ p, r }));
  const col = {}; G.order.forEach((p, i) => col[p] = COLORS[i % COLORS.length]);
  DR = { turns, t: 0, strokes: [], col, cur: null, done: false };
  const b = dP.body; b.innerHTML = '';
  const info = el('div', 'sub'); info.id = 'drInfo';
  const cv = el('canvas', 'paper'); cv.id = 'drCanvas';
  const w = Math.min(window.innerWidth - 32, TABW(488)), h = Math.round(w * 1.15);
  const dpr = window.devicePixelRatio || 1; cv.width = w * dpr; cv.height = h * dpr; cv.style.width = w + 'px'; cv.style.height = h + 'px';
  b.append(info, cv);
  const pos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
  cv.addEventListener('pointerdown', e => { if (DR.done) return; e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (_) {} DR.cur = { c: DR.col[DR.turns[DR.t].p], pts: [pos(e)] }; DR.strokes.push(DR.cur); paint(); });
  cv.addEventListener('pointermove', e => { if (!DR.cur) return; DR.cur.pts.push(pos(e)); paint(); });
  const up = () => { if (!DR.cur) return; DR.cur = null; DR.done = true; beep(800, .05); drawTurnUI(); };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  show('drawPlay'); drawTurnUI(); paint();
}
function paint() {
  const cv = $('drCanvas'); if (!cv) return; const x = cv.getContext('2d'), W = cv.width, H = cv.height;
  x.clearRect(0, 0, W, H); x.lineCap = 'round'; x.lineJoin = 'round'; x.lineWidth = Math.max(4, W / 90);
  DR.strokes.forEach(s => { x.strokeStyle = s.c; x.beginPath(); s.pts.forEach((p, i) => i ? x.lineTo(p[0] * W, p[1] * H) : x.moveTo(p[0] * W, p[1] * H)); if (s.pts.length === 1) x.lineTo(s.pts[0][0] * W + .1, s.pts[0][1] * H); x.stroke(); });
}
function drawTurnUI() {
  const t = DR.turns[DR.t], nxt = DR.turns[DR.t + 1];
  const info = $('drInfo'); info.innerHTML = '';
  const d = el('span', 'dot'); d.style.background = DR.col[t.p];
  const nm = el('b', '', t.p); nm.style.fontSize = '22px'; nm.style.color = DR.col[t.p];
  info.append(d, el('span', '', 'دور '), nm, el('br'), el('span', '', 'الجولة ' + (t.r + 1) + ' من ' + S.drounds + (S.hint ? ' · الموضوع: ' + G.cat : '') + ' · ' + (DR.done ? 'تم ✓' : 'ارسم خط واحد بس')));
  const undo = btn('↩️ تراجع', 'ghost', () => { if (!DR.done) return; DR.strokes.pop(); DR.done = false; paint(); drawTurnUI(); });
  undo.disabled = !DR.done;
  const next = btn(nxt ? 'تم ← عطه لـ ' + nxt.p : 'خلصنا، يلا نصوت 🗳️', '', () => { if (nxt) { DR.t++; DR.done = false; drawTurnUI(); } else drawVote(); }, 2);
  next.disabled = !DR.done;
  const stop = btn('🗳️ وقفوا', 'ghost', drawVote);
  setBtns2(dP.row, [stop, undo, next]);
}
function drawVote() { const cv = $('drCanvas'); try { const o = document.createElement('canvas'); o.width = cv.width; o.height = cv.height; const x = o.getContext('2d'); x.fillStyle = '#fffdf7'; x.fillRect(0, 0, o.width, o.height); x.drawImage(cv, 0, 0); G.img = o.toDataURL('image/jpeg', .8); } catch (e) { } goVote(); }

/* =================================================================
   🧠 سين جيم
   ================================================================= */
const sjS = mkScreen('sjSetup', '🧠 سين جيم');
const sjB = mkScreen('sjBoard', '🧠 سين جيم');
const sjQ = mkScreen('sjQ', '🧠 سين جيم');
const SJCATS = Object.keys(SJ);
let SG = null;
/* وسائل المساعدة مثل اللعبة الأصلية: كل فريق يختار ٣ */
const SJL = {
  two: { n: '✌️ جاوب جوابين', d: 'قولوا جوابين، وإدا واحد منهم صح تنحسب لكم', when: 'q' },
  call: { n: '📞 اتصال بصديق', d: 'دقوا على رفيقكم اللي يعرف كل شي، عندكم ٣٠ ثانية', when: 'q' },
  pit: { n: '🕳️ الحفرة', d: 'قبل ما تشوفون السؤال: إدا جاوبتوا صح تنخصم نفس النقاط من الفريق الثاني', when: 'b' },
  rest: { n: '🪑 استريح', d: 'اختاروا أشطر واحد ضدكم وخلوه يستريح عن هالسؤال', when: 'q' },
  trap: { n: '🪤 الفخ', d: 'ما عرفتوا؟ عطوا السؤال للفريق الثاني، وإدا جاوبوا غلط تنخصم منهم نقاطه', when: 'q' },
  dbl: { n: '✖️٢ دبل', d: 'نقاط السؤال تتضاعف إدا جاوبتوا صح', when: 'q' },
  hint: { n: '💡 تلميح', d: 'يطلع لكم تلميح للجواب', when: 'q' }
};
const SJL_DEF = ['two', 'call', 'pit'];
function sjSetup() {
  S.sjcats = (S.sjcats || []).filter(c => SJ[c]);
  if (!Array.isArray(S.sjlife) || S.sjlife.length !== 2) S.sjlife = [SJL_DEF.slice(), SJL_DEF.slice()];
  S.sjlife = S.sjlife.map(a => (a || []).filter(k => SJL[k]));
  const b = sjS.body; b.innerHTML = '';
  const tb = el('div', 'box'); teamInputs(tb);
  const cb = el('div', 'box'); const h = el('h2', '', ''); const cnt = el('span', '', ''); h.append(cnt);
  const rnd6 = btn('🎲 عشوائي', 'ghost small', () => { S.sjcats = []; const used = new Set(); while (S.sjcats.length < 6) { const c = draw('sjcats', SJCATS); if (!used.has(c)) { used.add(c); S.sjcats.push(c); } } sjSetup(); }); rnd6.style.flex = 'none'; h.appendChild(rnd6);
  const chips = el('div', 'chips'); cb.append(h, chips);
  const upd = () => { cnt.textContent = 'المواضيع (' + S.sjcats.length + ' من ٦)'; save(); };
  chipSet(chips, SJCATS, S.sjcats, 6, upd); upd();
  const lb = el('div', 'box'); lb.appendChild(el('h2', '', 'وسائل المساعدة 🛟'));
  lb.appendChild(el('div', 'lab', 'كل فريق يختار ٣ وسائل، وكل وسيلة تنستخدم مرة وحدة باللعبة.'));
  const names = Object.keys(SJL).map(k => SJL[k].n), keyOf = n => Object.keys(SJL).find(k => SJL[k].n === n);
  [0, 1].forEach(ti => {
    const t = el('div', 'lab', ''); t.style.cssText = 'font-weight:700;margin:10px 0 6px;color:var(--txt)';
    const cc = el('div', 'chips'); const sel = S.sjlife[ti].map(k => SJL[k].n);
    const u = () => { S.sjlife[ti] = sel.map(keyOf); t.textContent = teamNames()[ti] + ' (' + sel.length + ' من ٣)'; save(); };
    chipSet(cc, names, sel, 3, u); u(); lb.append(t, cc);
  });
  const ex = el('div', 'lab', ''); ex.style.cssText = 'margin-top:10px;line-height:1.9;text-align:right';
  ex.innerHTML = Object.keys(SJL).map(k => '<b>' + SJL[k].n + '</b>: ' + SJL[k].d).join('<br>'); lb.appendChild(ex);
  const err = el('div', 'err', '');
  b.append(tb, cb, lb, err);
  setBtns2(sjS.row, [btn('ابدأ 🎯', '', () => { if (S.sjcats.length < 1) { err.textContent = 'اختار موضوع واحد على الأقل'; return; } sjStart(); })]);
  show('sjSetup');
}
function sjStart() {
  const cats = S.sjcats.slice(), cells = {};
  cats.forEach(c => { cells[c] = {}; [200, 400, 600].forEach(l => { const a = draw('sj_' + c + '_' + l, SJ[c][l]); let b2 = draw('sj_' + c + '_' + l, SJ[c][l]); cells[c][l] = [a, b2]; }); });
  const lf = (S.sjlife || [SJL_DEF, SJL_DEF]);
  SG = { cats, cells, used: {}, turn: 0, pit: false, teams: teamNames().map((n, i) => ({ n, s: 0, life: (lf[i] || SJL_DEF).slice() })) };
  sjBoard();
}
function sjBoard() {
  const b = sjB.body; b.innerHTML = '';
  const t = SG.teams[SG.turn];
  const hd = el('div', ''); scoreHead(hd, SG.teams, SG.turn); b.appendChild(hd);
  b.appendChild(el('div', 'sub', 'دور ' + t.n + ': اختاروا سؤال'));
  let left = 0;
  SG.cats.forEach(c => {
    const r = el('div', 'sjrow'); r.appendChild(el('div', 'cn', c));
    const g = el('div', 'sjcells');
    [200, 200, 400, 400, 600, 600].forEach((l, i) => {
      const k = c + '|' + l + '|' + (i % 2); const used = SG.used[k];
      const bt = btn(String(l), 'l' + l, () => sjAsk(c, l, i % 2)); bt.disabled = !!used; if (!used) left++;
      g.appendChild(bt);
    });
    r.appendChild(g); b.appendChild(r);
  });
  if (t.life.includes('pit') || SG.pit) {
    const pb = btn(SG.pit ? '🕳️ الحفرة شغالة! اختاروا السؤال (اضغط للإلغاء)' : '🕳️ احفروا لهم قبل لا تختارون السؤال', SG.pit ? 'red' : 'ghost', () => { SG.pit = !SG.pit; sjBoard(); });
    pb.style.cssText = 'width:100%;margin-top:12px'; b.appendChild(pb);
  }
  setBtns2(sjB.row, [btn('إنهاء اللعبة 🏁', 'ghost', sjEnd)]);
  show('sjBoard');
  if (!left) sjEnd();
}
function sjAsk(c, l, i) {
  const t = SG.teams[SG.turn], o = SG.teams[1 - SG.turn];
  const q = SG.cells[c][l][i]; let revealed = false;
  const on = {}; // الوسائل المستخدمة في هالسؤال
  if (SG.pit) { on.pit = true; SG.pit = false; t.life = t.life.filter(k => k !== 'pit'); }
  let callEnd = 0;
  const use = k => { if (!t.life.includes(k) || on[k]) return; t.life = t.life.filter(x => x !== k); on[k] = true; if (k === 'call') callEnd = Date.now() + 30000; window.SFX && SFX.ding ? SFX.ding() : beep(900, .1); render(); };
  const render = () => {
    stopTimer();
    const b = sjQ.body; b.innerHTML = '';
    const hd = el('div', ''); scoreHead(hd, SG.teams, SG.turn); b.appendChild(hd);
    const card = el('div', 'bigcard'); b.appendChild(card);
    card.appendChild(el('div', 'lab', c + ' · ' + l + ' نقطة'));
    const tags = [];
    if (on.pit) tags.push('🕳️ الحفرة: إدا جاوب ' + t.n + ' صح ينخصم ' + l + ' من ' + o.n);
    if (on.dbl) tags.push('دبل ✖️٢ = ' + (l * 2));
    if (on.two) tags.push('✌️ ' + t.n + ' يقولون جوابين');
    if (on.rest) tags.push('🪑 واحد من ' + o.n + ' يستريح وما يشارك');
    if (on.trap) tags.push('🪤 فخ! السؤال صار على ' + o.n + '، وإدا غلطوا ينخصم منهم ' + l);
    tags.forEach(x => card.appendChild(el('span', 'dblx', x)));
    card.appendChild(el('div', 'txt', q.q));
    if (on.hint && q.h) card.appendChild(el('div', 'hintx', '💡 ' + q.h));
    if (!revealed) {
      const tm = el('div', 'timer'); tm.id = 'sjT'; card.appendChild(tm);
      if (on.call && callEnd > Date.now()) { card.insertBefore(el('div', 'lab', '📞 اتصال بصديق: عندكم ٣٠ ثانية'), tm); countdownTimer(Math.ceil((callEnd - Date.now()) / 1000), 'sjT', () => {}); }
      else countdownTimer(TIME('sj'), 'sjT', () => {});
      const avail = t.life.filter(k => SJL[k].when === 'q' && !(on.trap) && !(k === 'hint' && !q.h));
      if (avail.length) {
        const life = el('div', 'life'); avail.forEach(k => life.appendChild(btn(SJL[k].n, 'ghost', () => use(k))));
        card.appendChild(el('div', 'lab', 'وسائل ' + t.n + ':')); card.appendChild(life);
      }
      setBtns2(sjQ.row, [btn('اكشف الجواب 👀', '', () => { revealed = true; render(); })]);
    } else {
      card.appendChild(el('div', 'lab', 'الجواب'));
      card.appendChild(el('div', 'ans', q.a));
      const fin = () => { SG.used[c + '|' + l + '|' + i] = 1; SG.turn = 1 - SG.turn; sjBoard(); };
      const ti = SG.turn, oi = 1 - SG.turn;
      if (on.trap) {
        card.appendChild(el('div', 'lab', o.n + ' جاوبوا صح؟'));
        setBtns2(sjQ.row, [btn('صح ✅ (+' + l + ')', 'grn', () => { o.s += l; beep(1200, .15); fin(); }), btn('غلط ❌ (−' + l + ')', 'red', () => { o.s -= l; beep(250, .25); fin(); })]);
      } else {
        card.appendChild(el('div', 'lab', 'منهو جاوب صح؟'));
        const done = who => {
          if (who === ti) { t.s += on.dbl ? l * 2 : l; if (on.pit) o.s -= l; beep(1200, .15); }
          else if (who === oi) { o.s += l; beep(1200, .15); }
          else beep(250, .25);
          fin();
        };
        setBtns2(sjQ.row, [btn(SG.teams[0].n + ' ✅', 'grn', () => done(0)), btn(SG.teams[1].n + ' ✅', 'grn', () => done(1)), btn('ولا أحد ❌', 'ghost', () => done(null))]);
      }
    }
  };
  show('sjQ'); render();
}
function sjEnd() {
  const b = sjB.body; b.innerHTML = '';
  const [a, c] = SG.teams; const card = el('div', 'bigcard');
  card.append(el('div', 'lab', 'النتيجة النهائية'));
  if (a.s === c.s) card.append(el('div', 'win', 'تعادل! 🤝')); else card.append(el('div', 'win good', '🏆 ' + (a.s > c.s ? a.n : c.n)));
  card.append(el('div', 'txt', a.n + ': ' + a.s), el('div', 'txt', c.n + ': ' + c.s));
  b.appendChild(card);
  setBtns2(sjB.row, [btn('تعديل', 'ghost', sjSetup), btn('لعبة جديدة 🔄', '', sjStart, 2)]);
  show('sjBoard');
}

/* =================================================================
   👨‍👩‍👧 فاميلي فيود
   ================================================================= */
const fS = mkScreen('feudSetup', '👨‍👩‍👧 فاميلي فيود');
const fP = mkScreen('feudPlay', '👨‍👩‍👧 فاميلي فيود');
let FG = null;
function feudSetup() {
  S.frounds = S.frounds || 5;
  const b = fS.body; b.innerHTML = '';
  const tb = el('div', 'box'); teamInputs(tb);
  const ob = el('div', 'box'); ob.appendChild(stepper('عدد الجولات', () => S.frounds, v => S.frounds = v, () => 1, () => 10));
  b.append(tb, ob);
  setBtns2(fS.row, [btn('ابدأ 🎤', '', () => { FG = { teams: teamNames().map(n => ({ n, s: 0 })), r: 0 }; feudRound(); })]);
  show('feudSetup');
}
function feudRound() {
  FG.r++; const q = draw('feud', FEUD);
  FG.q = q; FG.open = q.a.map(() => false); FG.bank = 0; FG.strikes = 0; FG.play = null; FG.phase = 'pick'; FG.mult = FG.r === S.frounds && S.frounds > 1 ? 2 : 1;
  feudDraw(); show('feudPlay');
}
function feudDraw() {
  const b = fP.body; b.innerHTML = '';
  const hd = el('div', ''); scoreHead(hd, FG.teams, FG.play === null ? -1 : FG.play); b.appendChild(hd);
  const card = el('div', 'bigcard'); card.style.gap = '8px';
  card.append(el('div', 'lab', 'الجولة ' + FG.r + ' من ' + S.frounds + (FG.mult > 1 ? ' · نقاط دبل ✖️٢' : '')), el('div', 'lab', 'سألنا ١٠٠ شخص:'), el('div', 'txt', FG.q.q + '؟'));
  const bd = el('div', 'feud');
  FG.q.a.forEach((a, i) => {
    const t = el('div', 'ftile ' + (FG.open[i] ? 'open' : 'hid'));
    if (FG.open[i]) { t.append(el('span', '', a.t), el('span', 'pt', a.p)); if (FG.open[i] === 'miss') t.classList.add('miss'); }
    else t.textContent = i + 1;
    t.onclick = () => {
      if (FG.open[i] || FG.phase === 'pick' || FG.phase === 'end') return;
      FG.open[i] = true; FG.bank += a.p; if (window.SFX) SFX.ding(); else beep(1100, .12);
      if (FG.phase === 'steal') { feudFinish(1 - FG.play); return; }
      if (FG.open.every(x => x)) { feudFinish(FG.play); return; }
      feudDraw();
    };
    bd.appendChild(t);
  });
  card.appendChild(bd);
  card.append(el('div', 'bank', 'مجموع الجولة: ' + FG.bank * FG.mult), el('div', 'strikes', '✖'.repeat(FG.strikes)));
  b.appendChild(card);
  if (FG.phase === 'pick') {
    card.appendChild(el('div', 'lab', 'اللي يضغط الجرس أول ويجاوب أحسن، فريقه يلعب. منهو بيلعب؟'));
    setBtns2(fP.row, FG.teams.map((t, i) => btn(t.n + ' 🎤', '', () => { FG.play = i; FG.phase = 'play'; feudDraw(); })));
  } else if (FG.phase === 'play') {
    card.appendChild(el('div', 'lab', 'لما يقولون جواب موجود، اضغطوا عليه. إدا غلط، اضغطوا ✖'));
    setBtns2(fP.row, [btn('✖ غلط', 'red', () => { FG.strikes++; beep(140, .5, .3); buzz(300); if (FG.strikes >= 3) { FG.phase = 'steal'; } feudDraw(); })]);
  } else if (FG.phase === 'steal') {
    card.appendChild(el('div', 'lab', '٣ أغلاط! فرصة ' + FG.teams[1 - FG.play].n + ' يسرقون النقاط بجواب واحد. إدا جاوبوا صح اضغطوا على الجواب.'));
    setBtns2(fP.row, [btn('ما سرقوها ❌', 'ghost', () => feudFinish(FG.play))]);
  } else {
    setBtns2(fP.row, [btn(FG.r >= S.frounds ? 'النتيجة النهائية 🏆' : 'الجولة الجاية ←', '', () => FG.r >= S.frounds ? feudEnd() : feudRound())]);
  }
}
function feudFinish(team) {
  const pts = FG.bank * FG.mult; FG.teams[team].s += pts; FG.phase = 'end';
  FG.q.a.forEach((_, i) => { if (!FG.open[i]) FG.open[i] = 'miss'; });
  feudDraw();
  const card = fP.body.querySelector('.bigcard'); card.insertBefore(el('div', 'win good', '+' + pts + ' لـ ' + FG.teams[team].n), card.children[3]);
}
function feudEnd() {
  const b = fP.body; b.innerHTML = ''; const [a, c] = FG.teams; const card = el('div', 'bigcard');
  card.append(el('div', 'lab', 'النتيجة النهائية'), el('div', 'win good', a.s === c.s ? 'تعادل! 🤝' : '🏆 ' + (a.s > c.s ? a.n : c.n)), el('div', 'txt', a.n + ': ' + a.s), el('div', 'txt', c.n + ': ' + c.s));
  b.appendChild(card);
  setBtns2(fP.row, [btn('تعديل', 'ghost', feudSetup), btn('لعبة جديدة 🔄', '', () => { FG = { teams: teamNames().map(n => ({ n, s: 0 })), r: 0 }; feudRound(); }, 2)]);
}

/* =================================================================
   🎲 النرد 3D
   ================================================================= */
const PHI = (1 + Math.sqrt(5)) / 2;
const V = {
  sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  mul: (a, k) => [a[0] * k, a[1] * k, a[2] * k], dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  len: a => Math.hypot(a[0], a[1], a[2]), norm: a => { const l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; }
};
const Qt = {
  mul: (a, b) => [a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3], a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2], a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1], a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0]],
  axis: (ax, ang) => { const s = Math.sin(ang / 2), n = V.norm(ax); return [Math.cos(ang / 2), n[0] * s, n[1] * s, n[2] * s]; },
  rot: (q, v) => { const p = Qt.mul(Qt.mul(q, [0, v[0], v[1], v[2]]), [q[0], -q[1], -q[2], -q[3]]); return [p[1], p[2], p[3]]; },
  norm: q => { const l = Math.hypot(...q); return q.map(x => x / l); },
  slerp: (a, b, t) => { let d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]; if (d < 0) { b = b.map(x => -x); d = -d; } if (d > .9995) return Qt.norm(a.map((x, i) => x + (b[i] - x) * t)); const th = Math.acos(d), s = Math.sin(th); return a.map((x, i) => (x * Math.sin((1 - t) * th) + b[i] * Math.sin(t * th)) / s); },
  fromTo: (u, v) => { u = V.norm(u); v = V.norm(v); const d = V.dot(u, v); if (d < -.9999) { let ax = V.cross([1, 0, 0], u); if (V.len(ax) < .01) ax = V.cross([0, 1, 0], u); return Qt.axis(ax, Math.PI); } const c = V.cross(u, v); return Qt.norm([1 + d, c[0], c[1], c[2]]); }
};
function polyFrom(verts, faces) { // يرتب الأوجه ويحسب العمودي
  const fs = faces.map(f => { const c = V.mul(f.reduce((a, i) => V.add(a, verts[i]), [0, 0, 0]), 1 / f.length); let n = V.norm(V.cross(V.sub(verts[f[1]], verts[f[0]]), V.sub(verts[f[2]], verts[f[0]]))); if (V.dot(n, c) < 0) { f = f.slice().reverse(); n = V.mul(n, -1); } return { f, n, c }; });
  const s = 1 / Math.max(...verts.map(V.len)); return { v: verts.map(p => V.mul(p, s)), faces: fs.map(o => ({ f: o.f, n: o.n, c: V.mul(o.c, s) })) };
}
function triFaces(verts, edge) { const f = [], n = verts.length, e2 = edge * edge; for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) for (let c = b + 1; c < n; c++) { const d = (i, j) => { const x = V.sub(verts[i], verts[j]); return V.dot(x, x); }; if (Math.abs(d(a, b) - e2) < 1e-6 && Math.abs(d(b, c) - e2) < 1e-6 && Math.abs(d(a, c) - e2) < 1e-6) f.push([a, b, c]); } return f; }
function orderRing(idx, pts, axis) { const c = V.mul(idx.reduce((a, i) => V.add(a, pts[i]), [0, 0, 0]), 1 / idx.length); let u = V.norm(V.sub(pts[idx[0]], c)); const w = V.norm(V.cross(axis, u)); return idx.slice().sort((i, j) => { const ai = Math.atan2(V.dot(V.sub(pts[i], c), w), V.dot(V.sub(pts[i], c), u)), aj = Math.atan2(V.dot(V.sub(pts[j], c), w), V.dot(V.sub(pts[j], c), u)); return ai - aj; }); }
const SHAPES = {};
(function () {
  SHAPES[4] = polyFrom([[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]], [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]]);
  const cv = []; for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) cv.push([x, y, z]);
  const cf = []; for (let ax = 0; ax < 3; ax++) for (const sg of [-1, 1]) { const idx = cv.map((p, i) => p[ax] === sg ? i : -1).filter(i => i >= 0); const n = [0, 0, 0]; n[ax] = sg; cf.push(orderRing(idx, cv, n)); }
  SHAPES[6] = polyFrom(cv, cf);
  const ov = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]], of = [];
  for (const a of [0, 1]) for (const b of [2, 3]) for (const c of [4, 5]) of.push([a, b, c]);
  SHAPES[8] = polyFrom(ov, of);
  const iv = []; for (const a of [-1, 1]) for (const b of [-PHI, PHI]) iv.push([0, a, b], [a, b, 0], [b, 0, a]);
  const ifc = triFaces(iv, 2); SHAPES[20] = polyFrom(iv, ifc);
  const centers = ifc.map(f => V.mul(f.reduce((a, i) => V.add(a, iv[i]), [0, 0, 0]), 1 / 3));
  const df = iv.map((v, vi) => orderRing(ifc.map((f, fi) => f.includes(vi) ? fi : -1).filter(x => x >= 0), centers, V.norm(v)));
  SHAPES[12] = polyFrom(centers, df);
  const h = 1, ring = [], a = h * (1 - Math.cos(Math.PI / 5)) / (1 + Math.cos(Math.PI / 5));
  for (let i = 0; i < 10; i++) { const t = i * Math.PI / 5; ring.push([Math.cos(t), Math.sin(t), i % 2 ? -a : a]); }
  const tv = [[0, 0, h], [0, 0, -h], ...ring], tf = [];
  for (let k = 0; k < 5; k++) { tf.push([0, 2 + 2 * k, 2 + (2 * k + 1) % 10, 2 + (2 * k + 2) % 10]); tf.push([1, 2 + (2 * k + 1) % 10, 2 + (2 * k + 2) % 10, 2 + (2 * k + 3) % 10]); }
  SHAPES[10] = polyFrom(tv, tf);
})();
const DCOL = { 4: '#c94a3b', 6: '#f3ead6', 8: '#2c7a6b', 10: '#d79a35', 12: '#5b4a9c', 20: '#1f4f8a' };
const PIPS = { 1: [[0, 0]], 2: [[-.5, -.5], [.5, .5]], 3: [[-.5, -.5], [0, 0], [.5, .5]], 4: [[-.5, -.5], [.5, -.5], [-.5, .5], [.5, .5]], 5: [[-.5, -.5], [.5, -.5], [0, 0], [-.5, .5], [.5, .5]], 6: [[-.5, -.6], [-.5, 0], [-.5, .6], [.5, -.6], [.5, 0], [.5, .6]] };
// يرسم النرد بمنظور حقيقي: إضاءة ولمعة، نقاط على D6، والأرقام مرسومة على سطح الوجه نفسه
function renderDie(cv, sides, q, label, opt) {
  opt = opt || {};
  const sh = SHAPES[sides], x = cv.getContext('2d'), W = cv.width, H = cv.height;
  const R = W * 0.3 * (opt.s || 1), cx = W / 2 + (opt.dx || 0) * W, cy = H * 0.47 + (opt.dy || 0) * H, F = 3.4;
  const proj = p => { const k = F / (F - p[2]); return [cx + p[0] * R * k, cy - p[1] * R * k]; };
  x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, H);
  // ظل على الأرض (يصغر لما النرد يطير)
  const hgt = opt.h || 0;
  x.fillStyle = 'rgba(0,0,0,' + (0.28 * (1 - hgt * 0.7)) + ')'; x.beginPath(); x.ellipse(W / 2 + (opt.dx || 0) * W + R * .12, H * 0.47 + R * 1.12, R * (0.85 - hgt * .3), R * (0.2 - hgt * .06), 0, 0, 7); x.fill();
  const pv = sh.v.map(p => Qt.rot(q, p));
  const base = DCOL[sides], L = V.norm([-0.45, 0.65, 1]), Hh = V.norm(V.add(L, [0, 0, 1]));
  const faces = sh.faces.map((f, i) => ({ i, f, n: Qt.rot(q, f.n), c: Qt.rot(q, f.c) }))
    .filter(o => V.dot(o.n, V.sub([0, 0, F], o.c)) > 0).sort((a, b) => a.c[2] - b.c[2]);
  faces.forEach(o => {
    const lam = Math.max(0, V.dot(o.n, L)), spec = Math.pow(Math.max(0, V.dot(o.n, Hh)), 24);
    const pts = o.f.f.map(vi => proj(pv[vi]));
    x.beginPath(); pts.forEach((p, k) => k ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.closePath();
    x.fillStyle = shade(base, 0.25 + 0.75 * lam); x.fill();
    // لمعة
    const pc = proj(o.c), gr = x.createRadialGradient(pc[0] - R * .15, pc[1] - R * .15, 0, pc[0], pc[1], R * .9);
    gr.addColorStop(0, 'rgba(255,255,255,' + (0.55 * spec + 0.08) + ')'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = gr; x.fill();
    x.strokeStyle = 'rgba(0,0,0,.28)'; x.lineWidth = W / 160; x.lineJoin = 'round'; x.stroke();
    const vis = Math.min(1, V.dot(o.n, V.norm(V.sub([0, 0, F], o.c))) * 1.8);
    const num = label(o.i);
    if (sides === 6) {
      const v0 = pv[o.f.f[0]], v1 = pv[o.f.f[1]], v3 = pv[o.f.f[3]], U = V.mul(V.sub(v1, v0), .5), Wv = V.mul(V.sub(v3, v0), .5);
      const Un = V.norm(U), Wn = V.norm(Wv), rr = V.len(U) * .17;
      x.fillStyle = (num === 1 ? '#c0392b' : '#1d1d1d'); x.globalAlpha = vis;
      (PIPS[num] || []).forEach(([a, b]) => {
        const pc2 = V.add(o.c, V.add(V.mul(U, a), V.mul(Wv, b)));
        x.beginPath(); for (let k = 0; k <= 14; k++) { const t = k / 14 * Math.PI * 2, p = proj(V.add(pc2, V.add(V.mul(Un, Math.cos(t) * rr), V.mul(Wn, Math.sin(t) * rr)))); k ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]); }
        x.fill();
      });
      x.globalAlpha = 1;
    } else {
      const v0 = pv[o.f.f[0]], up = V.norm(V.sub(v0, o.c)), right = V.norm(V.cross(up, o.n));
      const ts = (sides >= 12 ? .3 : sides === 10 ? .28 : sides === 4 ? .34 : .42) * V.len(V.sub(v0, o.c));
      const c0 = proj(V.add(o.c, V.mul(up, -ts * 0.05))), px = proj(V.add(o.c, V.mul(right, ts))), py = proj(V.sub(o.c, V.mul(up, ts)));
      x.setTransform((px[0] - c0[0]) / 100, (px[1] - c0[1]) / 100, (py[0] - c0[0]) / 100, (py[1] - c0[1]) / 100, c0[0], c0[1]);
      x.font = 'bold 120px Lalezar, Tajawal, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.globalAlpha = vis; x.fillStyle = 'rgba(0,0,0,.35)'; x.fillText(num, 4, 6); x.fillStyle = '#fff'; x.fillText(num, 0, 0);
      if ((num === 6 || num === 9) && sides > 6) x.fillRect(-30, 52, 60, 9);
      x.globalAlpha = 1; x.setTransform(1, 0, 0, 1, 0, 0);
    }
  });
}
// حركة واقعية: النرد يلف حول محورين ويبطّي شوي شوي لين يوقف بالضبط على الرقم (بدون قفزة)، ويتنطط على الطاولة
function animateRoll(list, done) {
  const fast = window.__fast, T = fast ? 10 : 1500, t0 = performance.now();
  list.forEach(d => { d.tq = targetQ(d, d.val); d.a1 = V.norm([Math.random() - .5, Math.random() - .5, Math.random() - .5]); d.a2 = V.norm([Math.random() - .5, Math.random() - .5, Math.random() - .5]); d.th1 = (2.5 + Math.random() * 1.5) * Math.PI * 2; d.th2 = (1 + Math.random()) * Math.PI * 2; d.bx = (Math.random() - .5) * .12; });
  let hits = 0; if (window.SFX) SFX.dice();
  const f = now => {
    const u = Math.max(0, Math.min(1, (now - t0) / T)), e = 1 - Math.pow(1 - u, 3);
    list.forEach(d => {
      const q = Qt.mul(Qt.axis(d.a1, d.th1 * (1 - e)), Qt.mul(Qt.axis(d.a2, d.th2 * (1 - e)), d.tq)); d.q = Qt.norm(q);
      const h = Math.abs(Math.sin(u * Math.PI * 3.2)) * Math.pow(1 - u, 2) * 0.9;
      renderDie(d.cv, d.sides, d.q, i => i + 1, { dy: -h * 0.16, h, dx: d.bx * (1 - e), s: 1 + h * 0.06 });
    });
    const nh = Math.floor(u * 3.2); if (nh > hits && u < .95) { hits = nh; if (window.SFX) SFX.diceHit(); }
    if (u < 1) requestAnimationFrame(f); else done && done();
  };
  requestAnimationFrame(f);
}
function shade(hex, k) { const n = parseInt(hex.slice(1), 16); const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255; const f = v => Math.round(Math.min(255, v * (0.55 + 0.6 * k))); return 'rgb(' + f(r) + ',' + f(g) + ',' + f(b) + ')'; }
const dcS = mkScreen('dice', '🎲 النرد');
let DICE = [];
function diceScreen() {
  S.dside = S.dside || 6; S.dcount = S.dcount || 1;
  const b = dcS.body; b.innerHTML = '';
  const box = el('div', 'box'); const ch = el('div', 'chips');
  [4, 6, 8, 10, 12, 20].forEach(n => { const c = el('button', 'chip' + (S.dside === n ? ' sel' : ''), 'D' + n); c.onclick = () => { S.dside = n; save(); diceScreen(); }; ch.appendChild(c); });
  box.append(el('h2', '', 'نوع النرد'), ch, stepper('چم نرد', () => S.dcount, v => { S.dcount = v; diceScreen(); }, () => 1, () => 4));
  const wrap = el('div', 'dicewrap'), tot = el('div', 'total', ''); tot.id = 'dTot';
  b.append(box, wrap, tot);
  DICE = [];
  for (let i = 0; i < S.dcount; i++) {
    const cv = el('canvas'); const dpr = window.devicePixelRatio || 1; cv.width = 150 * dpr; cv.height = 150 * dpr; cv.onclick = rollDice;
    wrap.appendChild(cv);
    const d = { cv, q: Qt.norm([1, .3, .5, .2]), val: null, sides: S.dside }; d.qe = d.q;
    d.q = targetQ(d, 1 + rnd(S.dside)); DICE.push(d); renderDie(cv, d.sides, d.q, fi => fi + 1);
  }
  setBtns2(dcS.row, [btn('ارمي 🎲', '', rollDice)]);
  show('dice');
}
function targetQ(d, val) { const sh = SHAPES[d.sides], f = sh.faces[val - 1]; let q = Qt.fromTo(f.n, [0, 0, 1]); const up = Qt.rot(q, V.norm(V.sub(sh.v[f.f[0]], f.c))); q = Qt.mul(Qt.axis([0, 0, 1], Math.atan2(up[0], up[1]) + (Math.random() - .5) * 0.35), q); q = Qt.mul(Qt.axis([1, -1, 0], d.sides === 4 ? 0.2 : 0.32), q); return Qt.norm(q); }
let rolling = false;
function rollDice() {
  if (rolling) return; rolling = true; $('dTot').textContent = '';
  DICE.forEach(d => { d.val = 1 + rnd(d.sides); });
  animateRoll(DICE, () => { rolling = false; buzz(60); const vals = DICE.map(d => d.val); $('dTot').textContent = vals.length > 1 ? vals.join(' + ') + ' = ' + vals.reduce((a, b) => a + b) : vals[0]; });
}

/* =================================================================
   🥤 الأكواب
   ================================================================= */
const cpS = mkScreen('cups', '🥤 وين الكورة؟');
const CUP_SVG = '<svg viewBox="0 0 80 100"><path d="M10 92 L18 10 Q40 2 62 10 L70 92 Z" fill="#c94a3b" stroke="#2b1d12" stroke-width="4"/><path d="M18 10 Q40 18 62 10" fill="none" stroke="#2b1d12" stroke-width="3"/><path d="M14 60 L66 60" stroke="#f3ead6" stroke-width="6"/><rect x="6" y="88" width="68" height="8" rx="4" fill="#a63a2d" stroke="#2b1d12" stroke-width="3"/></svg>';
let CP = null;
function cupsScreen() {
  S.cupsN = S.cupsN || 3; S.cupsLvl = S.cupsLvl || 1;
  const b = cpS.body; b.innerHTML = '';
  const box = el('div', 'box');
  box.appendChild(stepper('عدد الأكواب', () => S.cupsN, v => { S.cupsN = v; cupsScreen(); }, () => 3, () => 5));
  box.appendChild(stepper('الصعوبة', () => S.cupsLvl, v => S.cupsLvl = v, () => 1, () => 3, v => ['', 'سهل', 'متوسط', 'صعب'][v]));
  const info = el('div', 'sub', ''); info.id = 'cpInfo';
  const stage = el('div', 'cupstage'); stage.id = 'cpStage';
  b.append(box, info, stage);
  CP = { n: S.cupsN, slots: [], ball: 0, busy: true, streak: CP ? CP.streak : 0, best: LS.get('cupsBest', 0) };
  const W = Math.min(window.innerWidth - 32, TABW(488)), gap = W / CP.n;
  stage.appendChild(el('div', 'table'));
  const ball = el('div', 'ball'); ball.id = 'cpBall'; stage.appendChild(ball);
  CP.cups = [];
  for (let i = 0; i < CP.n; i++) { const c = el('div', 'cup'); c.innerHTML = CUP_SVG; c.dataset.i = i; stage.appendChild(c); CP.cups.push(c); CP.slots.push(i); c.onclick = () => cupPick(i); }
  const cw = Math.min(80, gap - 8); CP.cw = cw; CP.cups.forEach(c => { c.style.width = cw + 'px'; c.style.height = (cw * 1.25) + 'px'; });
  CP.x = s => gap * s + gap / 2 - cw / 2;
  CP.cups.forEach((c, i) => c.style.transform = 'translate(' + CP.x(i) + 'px,0)');
  ball.style.left = (CP.x(0) + CP.cw / 2 - 17) + 'px'; ball.style.visibility = 'hidden';
  info.textContent = 'السلسلة: ' + CP.streak + ' · أحسن سلسلة: ' + CP.best;
  setBtns2(cpS.row, [btn('ابدأ 🔀', '', cupsGo)]);
  show('cups');
}
const wait = ms => new Promise(r => setTimeout(r, ms));
function lift(i, up) { const c = CP.cups[i]; const x = CP.x(CP.slots[i]); return c.animate([{ transform: c.style.transform }, { transform: 'translate(' + x + 'px,' + (up ? -70 : 0) + 'px)' }], { duration: 350, fill: 'forwards', easing: 'ease-out' }).finished.then(() => { c.style.transform = 'translate(' + x + 'px,' + (up ? -70 : 0) + 'px)'; }); }
async function cupsGo() {
  if (!CP) return; CP.busy = true; setBtns2(cpS.row, []);
  const ball = $('cpBall'); CP.ball = rnd(CP.n);
  ball.style.left = (CP.x(CP.slots[CP.ball]) + CP.cw / 2 - 17) + 'px'; ball.style.visibility = 'visible';
  $('cpInfo').textContent = 'ركّز… الكورة تحت هدا الكوب 👀';
  await lift(CP.ball, true); await wait(900); await lift(CP.ball, false); ball.style.visibility = 'hidden';
  const L = S.cupsLvl, swaps = [6, 11, 18][L - 1] + rnd(3), dur = [520, 360, 240][L - 1];
  $('cpInfo').textContent = 'لا ترمش! 🔀';
  for (let k = 0; k < swaps; k++) {
    let a = rnd(CP.n), b = rnd(CP.n - 1); if (b >= a) b++;
    const sa = CP.slots[a], sb = CP.slots[b]; CP.slots[a] = sb; CP.slots[b] = sa;
    const A = CP.cups[a], B = CP.cups[b], xa = CP.x(sa), xb = CP.x(sb), mid = (xa + xb) / 2;
    A.style.zIndex = 3; B.style.zIndex = 2;
    const pa = A.animate([{ transform: 'translate(' + xa + 'px,0)' }, { transform: 'translate(' + mid + 'px,18px) scale(1.06)' }, { transform: 'translate(' + xb + 'px,0)' }], { duration: dur, easing: 'ease-in-out', fill: 'forwards' }).finished;
    const pb = B.animate([{ transform: 'translate(' + xb + 'px,0)' }, { transform: 'translate(' + mid + 'px,-18px) scale(.94)' }, { transform: 'translate(' + xa + 'px,0)' }], { duration: dur, easing: 'ease-in-out', fill: 'forwards' }).finished;
    if (window.SFX) SFX.swish();
    await Promise.all([pa, pb]); A.style.transform = 'translate(' + xb + 'px,0)'; B.style.transform = 'translate(' + xa + 'px,0)';
  }
  CP.busy = false; $('cpInfo').textContent = 'وين الكورة؟ اضغط على الكوب 👇';
}
async function cupPick(i) {
  if (!CP || CP.busy) return; CP.busy = true;
  const ball = $('cpBall'); ball.style.left = (CP.x(CP.slots[CP.ball]) + CP.cw / 2 - 17) + 'px'; ball.style.visibility = 'visible';
  await lift(i, true);
  if (i === CP.ball) { CP.streak++; if (CP.streak > CP.best) { CP.best = CP.streak; LS.set('cupsBest', CP.best); } beep(1200, .2); $('cpInfo').textContent = 'صح! 🎉 السلسلة: ' + CP.streak + ' · أحسن سلسلة: ' + CP.best; }
  else { await lift(CP.ball, true); CP.streak = 0; beep(200, .4); buzz(200); $('cpInfo').textContent = 'غلط 😅 الكورة كانت اهني · أحسن سلسلة: ' + CP.best; }
  setBtns2(cpS.row, [btn('مرة ثانية 🔀', '', async () => { await Promise.all(CP.cups.map((_, k) => lift(k, false))); $('cpBall').style.visibility = 'hidden'; cupsGo(); })]);
}

/* =================================================================
   🍾 لف القارورة
   ================================================================= */
const btS = mkScreen('bottle', '🍾 لف الغرشة');
const BOTTLE_SVG = `<svg viewBox="0 0 60 220" xmlns="http://www.w3.org/2000/svg"><defs>
<linearGradient id="gl" x1="0" x2="1"><stop offset="0" stop-color="#0d4d2c"/><stop offset=".22" stop-color="#2f9e62"/><stop offset=".42" stop-color="#7fe0a8"/><stop offset=".55" stop-color="#2c8a56"/><stop offset="1" stop-color="#0b3d23"/></linearGradient>
<linearGradient id="cap" x1="0" x2="1"><stop offset="0" stop-color="#8a6416"/><stop offset=".45" stop-color="#f6d77a"/><stop offset="1" stop-color="#8a6416"/></linearGradient>
<linearGradient id="lb" x1="0" x2="1"><stop offset="0" stop-color="#d9c08f"/><stop offset=".5" stop-color="#fff4d6"/><stop offset="1" stop-color="#c9ad78"/></linearGradient></defs>
<rect x="22" y="2" width="16" height="16" rx="3" fill="url(#cap)" stroke="#3a2a08" stroke-width="1.5"/>
<path d="M23 18 L23 62 Q8 80 8 104 L8 206 Q8 216 18 216 L42 216 Q52 216 52 206 L52 104 Q52 80 37 62 L37 18 Z" fill="url(#gl)" stroke="#06301a" stroke-width="2" opacity=".96"/>
<rect x="8" y="120" width="44" height="52" fill="url(#lb)" stroke="#6b5326" stroke-width="1"/>
<text x="30" y="150" font-size="13" text-anchor="middle" fill="#7a1f15" font-family="Lalezar,Tajawal">تقزيرة</text>
<path d="M15 96 Q13 150 15 204" stroke="rgba(255,255,255,.55)" stroke-width="4" fill="none" stroke-linecap="round"/>
<path d="M27 24 L27 58" stroke="rgba(255,255,255,.5)" stroke-width="2.5" stroke-linecap="round"/>
<ellipse cx="30" cy="212" rx="18" ry="3" fill="rgba(0,0,0,.25)"/></svg>`;
let BT = { ang: 0, spinning: false };
function bottleScreen() {
  const b = btS.body; b.innerHTML = '';
  const box = el('div', 'bottlebox'); const n = S.players.length;
  const table = el('div', 'woodtable'); box.appendChild(table);
  S.players.forEach((p, i) => { const a = i / n * 2 * Math.PI - Math.PI / 2; const d = el('div', 'nm', p); d.style.left = (50 + 42 * Math.cos(a)) + '%'; d.style.top = (50 + 42 * Math.sin(a)) + '%'; box.appendChild(d); });
  const bt = el('div', 'bottle'); bt.innerHTML = BOTTLE_SVG; bt.style.transform = 'rotate(' + BT.ang + 'deg)'; box.appendChild(bt);
  const res = el('div', 'sub', 'رأس الغرشة 🟢 يجاوب · وتحتها 🔴 يسأل'); res.id = 'btRes';
  b.append(box, res);
  const idx = a => Math.round((((a % 360) + 360) % 360) / 360 * n) % n;
  setBtns2(btS.row, [btn('لف 🔄', '', () => {
    if (BT.spinning) return; BT.spinning = true;
    const from = BT.ang, add = 1440 + rnd(1440) + Math.random() * 360, T = window.__fast ? 10 : 4200, t0 = performance.now(); let last = idx(from);
    box.querySelectorAll('.nm').forEach(x => x.className = 'nm'); $('btRes').textContent = '…'; if (window.SFX) SFX.whoosh();
    const f = now => {
      const u = Math.max(0, Math.min(1, (now - t0) / T)), e = 1 - Math.pow(1 - u, 4); BT.ang = from + add * e; bt.style.transform = 'rotate(' + BT.ang + 'deg)';
      const k = idx(BT.ang); if (k !== last) { last = k; beep(900 + 300 * (1 - u), .02, .05); }
      if (u < 1) return requestAnimationFrame(f);
      BT.spinning = false;
      const A = idx(BT.ang), B0 = idx(BT.ang + 180); const B = B0 === A ? (A + Math.floor(n / 2)) % n : B0;
      const nms = box.querySelectorAll('.nm'); nms[A].classList.add('hitA'); nms[B].classList.add('hitB');
      $('btRes').innerHTML = ''; $('btRes').append(el('b', 'bad', S.players[B]), ' يسأل 👉 ', el('b', 'good', S.players[A])); if (window.SFX) SFX.ding(); else beep(1200, .15); buzz(80);
    };
    requestAnimationFrame(f);
  })]);
  show('bottle');
}

/* =================================================================
   🎡 عجلة الحظ
   ================================================================= */
const whS = mkScreen('wheel', '🎡 عجلة الحظ');
const WCOL = ['#c94a3b', '#e0a400', '#2c7a6b', '#1f6fd1', '#7b2cbf', '#e75a9c', '#00a6a6', '#ff6b35', '#5b8c2a', '#8a5a12'];
let WH = { ang: 0, spinning: false };
function wheelScreen() {
  S.wheelItems = S.wheelItems && S.wheelItems.length ? S.wheelItems : (S.players.length ? S.players.slice() : ['خيار ١', 'خيار ٢', 'خيار ٣']);
  const b = whS.body; b.innerHTML = '';
  const wrap = el('div', 'wheelWrap'); const cv = el('canvas'); const sz = Math.min(window.innerWidth - 40, TABW(400)), dpr = window.devicePixelRatio || 1;
  cv.width = sz * dpr; cv.height = sz * dpr; cv.style.width = sz + 'px'; cv.style.height = sz + 'px'; cv.id = 'whCv';
  const ptr = el('div', 'wPtr'); wrap.append(cv, ptr); b.appendChild(wrap);
  const res = el('div', 'total', ''); res.id = 'whRes'; b.appendChild(res);
  const box = el('div', 'box'); box.appendChild(el('h2', '', 'الخيارات (' + S.wheelItems.length + ')'));
  const form = el('div', 'row'); const inp = el('input'); inp.type = 'text'; inp.placeholder = 'أضف خيار…'; inp.maxLength = 20;
  const add = () => { const v = inp.value.trim(); if (!v) return; S.wheelItems.push(v); inp.value = ''; save(); wheelScreen(); setTimeout(() => $('whIn') && $('whIn').focus(), 30); };
  inp.id = 'whIn'; inp.onkeydown = e => { if (e.key === 'Enter') add(); }; form.append(inp, btn('إضافة', '', add)); box.appendChild(form);
  const pl = el('div', 'players'); S.wheelItems.forEach((w, i) => { const d = el('div', 'pl'); d.appendChild(el('span', '', w)); const x = el('b', '', '×'); x.onclick = () => { S.wheelItems.splice(i, 1); save(); wheelScreen(); }; d.appendChild(x); pl.appendChild(d); }); box.appendChild(pl);
  const r2 = el('div', 'row'); r2.style.marginTop = '10px';
  r2.append(btn('👥 حط أسامي اللاعبين', 'ghost small', () => { S.wheelItems = S.players.slice(); save(); wheelScreen(); }), btn('🧹 امسح الكل', 'ghost small', () => { S.wheelItems = []; save(); wheelScreen(); }));
  box.appendChild(r2);
  const tg = el('div', 'toggle'); tg.innerHTML = '<div><b>شيل اللي يطلع</b><small>عشان ما يطلع نفس الشي مرتين</small></div>'; const sw = el('div', 'sw' + (S.wheelRemove ? ' on' : '')); sw.onclick = () => { S.wheelRemove = !S.wheelRemove; save(); sw.classList.toggle('on'); }; tg.appendChild(sw); box.appendChild(tg);
  b.appendChild(box);
  drawWheel(); setBtns2(whS.row, [btn('لف العجلة 🎡', '', spinWheel)]);
  show('wheel');
}
function drawWheel(hi) {
  const cv = $('whCv'); if (!cv) return; const x = cv.getContext('2d'), W = cv.width, R = W / 2 - W * .03, c = W / 2, it = S.wheelItems, n = Math.max(1, it.length), seg = Math.PI * 2 / n;
  x.clearRect(0, 0, W, W);
  x.save(); x.translate(c, c); x.rotate(WH.ang * Math.PI / 180);
  x.beginPath(); x.arc(0, 0, R + W * .02, 0, 7); x.fillStyle = '#2b1d12'; x.fill();
  it.forEach((w, i) => {
    const a0 = -Math.PI / 2 + i * seg; x.beginPath(); x.moveTo(0, 0); x.arc(0, 0, R, a0, a0 + seg); x.closePath();
    const g = x.createRadialGradient(0, 0, R * .1, 0, 0, R); const col = WCOL[i % WCOL.length]; g.addColorStop(0, shade(col, 1.2)); g.addColorStop(1, col);
    x.fillStyle = g; x.fill(); x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = W / 200; x.stroke();
    if (hi === i) { x.fillStyle = 'rgba(255,255,255,.35)'; x.fill(); }
    x.save(); x.rotate(a0 + seg / 2); x.textAlign = 'right'; x.textBaseline = 'middle'; x.fillStyle = '#fff';
    const fs = Math.min(W * .06, W * 0.9 / Math.max(6, n)); x.font = 'bold ' + fs + 'px Lalezar, Tajawal'; x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 4;
    x.fillText(w.length > 14 ? w.slice(0, 13) + '…' : w, R * .9, 0); x.restore();
  });
  for (let i = 0; i < n * 2; i++) { const a = i * Math.PI / n; x.beginPath(); x.arc(Math.cos(a) * (R + W * .01), Math.sin(a) * (R + W * .01), W * .008, 0, 7); x.fillStyle = '#f6d77a'; x.fill(); }
  x.restore();
  const g2 = x.createRadialGradient(c - W * .02, c - W * .02, 0, c, c, W * .09); g2.addColorStop(0, '#fff2b8'); g2.addColorStop(1, '#a8761a');
  x.beginPath(); x.arc(c, c, W * .08, 0, 7); x.fillStyle = g2; x.fill(); x.lineWidth = W / 120; x.strokeStyle = '#2b1d12'; x.stroke();
}
function spinWheel() {
  const it = S.wheelItems; if (it.length < 2 || WH.spinning) { buzz(80); return; } WH.spinning = true; $('whRes').textContent = ''; if (window.SFX) SFX.whoosh();
  const n = it.length, from = WH.ang, add = 1800 + rnd(1440) + Math.random() * 360, T = window.__fast ? 10 : 5000, t0 = performance.now();
  const at = a => { const r = ((-(a % 360) + 360) % 360) / 360 * n; return Math.floor(r) % n; };
  let last = at(from);
  const f = now => {
    const u = Math.max(0, Math.min(1, (now - t0) / T)), e = 1 - Math.pow(1 - u, 4); WH.ang = from + add * e; drawWheel();
    const k = at(WH.ang); if (k !== last) { last = k; beep(1000 + 400 * (1 - u), .02, .05); }
    if (u < 1) return requestAnimationFrame(f);
    WH.spinning = false; const w = at(WH.ang); drawWheel(w); WH.last = it[w];
    $('whRes').textContent = '🎉 ' + it[w]; if (window.SFX) SFX.cheer(); else beep(1200, .25); buzz(100);
    if (S.wheelRemove) setTimeout(() => { S.wheelItems.splice(w, 1); save(); wheelScreen(); $('whRes').textContent = '🎉 ' + WH.last; }, 1500);
  };
  requestAnimationFrame(f);
}

/* =================================================================
   🪙 العملة
   ================================================================= */
const coS = mkScreen('coin', '🪙 ملك ولا كتابة');
let CO = { rot: 0, a: 0, b: 0 };
function coinScreen() {
  const b = coS.body; b.innerHTML = '';
  const c = el('div', 'coin3d'), inn = el('div', 'in'); inn.innerHTML = '<div class="f">👑<br>ملك</div><div class="f b">كتابة</div>'; inn.style.transform = 'rotateY(' + CO.rot + 'deg)'; c.appendChild(inn);
  const res = el('div', 'total', ''); const st = el('div', 'sub', 'ملك: ' + CO.a + ' · كتابة: ' + CO.b);
  b.append(c, res, st);
  setBtns2(coS.row, [btn('اقلب 🪙', '', () => {
    const head = Math.random() < .5; const base = CO.rot - (CO.rot % 360) + 360 * (5 + rnd(3)); CO.rot = base + (head ? 0 : 180);
    inn.style.transform = 'rotateY(' + CO.rot + 'deg)'; res.textContent = ''; if (window.SFX) SFX.coinToss();
    setTimeout(() => { if (head) CO.a++; else CO.b++; res.textContent = head ? '👑 ملك' : '✍️ كتابة'; st.textContent = 'ملك: ' + CO.a + ' · كتابة: ' + CO.b; if (window.SFX) SFX.coinLand(); }, 2000);
  })]);
  show('coin');
}

/* =================================================================
   👥 تقسيم الفرق + منهو يبدأ
   ================================================================= */
const tmS = mkScreen('teams', '👥 تقسيم الفرق');
const TCOL = ['#c94a3b', '#2c7a6b', '#c9861f', '#5b4a9c'];
function teamsScreen() {
  S.tcount = S.tcount || 2;
  const b = tmS.body; b.innerHTML = '';
  const box = el('div', 'box'); box.appendChild(stepper('عدد الفرق', () => S.tcount, v => S.tcount = v, () => 2, () => Math.max(2, Math.min(4, S.players.length))));
  const out = el('div', ''); out.id = 'tmOut'; const pk = el('div', 'picker', ''); pk.id = 'tmPick';
  b.append(box, pk, out);
  setBtns2(tmS.row, [btn('🎯 منهو يبدأ؟', 'ghost', () => {
    let k = 0; const n = 14 + rnd(6); const tick = () => { pk.textContent = pick(S.players); beep(700, .03); if (++k < n) setTimeout(tick, 60 + k * 12); else { pk.textContent = '👉 ' + pk.textContent; beep(1200, .15); } }; tick();
  }), btn('قسّم 🔀', '', () => {
    out.innerHTML = ''; const p = shuffle(S.players), T = [];
    for (let i = 0; i < S.tcount; i++) T.push([]);
    p.forEach((x, i) => T[i % S.tcount].push(x));
    T.forEach((t, i) => { const d = el('div', 'teamcol'); d.style.background = 'color-mix(in srgb, ' + TCOL[i] + ' 18%, var(--card))'; const h = el('h2', '', 'الفريق ' + (i + 1)); h.style.color = TCOL[i]; d.appendChild(h); t.forEach(x => d.appendChild(el('span', 'pl', x))); out.appendChild(d); });
    beep(1000, .1);
  }, 1.3)]);
  show('teams');
}

/* ---------- تسجيل الألعاب في الصفحة الرئيسية ---------- */
const add = (g, i) => { if (i === undefined) GAMES.push(g); else GAMES.splice(i, 0, g); };
const ti = GAMES.findIndex(g => g.id === 'triv'); if (ti >= 0) { GAMES[ti].n = 'أسئلة سريعة'; GAMES[ti].e = '⚡'; GAMES[ti].d = 'سؤال و٤ خيارات لكل لاعب'; }
add({ id: 'sj', e: '🧠', n: 'سين جيم', d: 'فريقين، ٦ مواضيع، ٢٠٠ و٤٠٠ و٦٠٠', min: 0, t: '٣٠-٤٥ دقيقة' }, 2);
add({ id: 'drw', e: '🎨', n: 'ارسم وصيد الامبوستر', d: 'كل واحد يرسم خط… والامبوستر يتظاهر', min: 3, t: '١٠ دقايق' }, 1);
add({ id: 'feud', e: '👨‍👩‍👧', n: 'فاميلي فيود', d: 'سألنا ١٠٠ شخص… خمنوا الأجوبة', min: 0, t: '٢٠ دقيقة' }, 4);
add({ id: 'dice', e: '🎲', n: 'النرد', d: 'من D4 لين D20، 3D', min: 0, tool: 1 });
add({ id: 'cups', e: '🥤', n: 'وين الكورة؟', d: 'تابع الكوب اللي تحته الكورة', min: 0, tool: 1 });
add({ id: 'bottle', e: '🍾', n: 'لف الغرشة', d: 'منهو يسأل منهو؟', min: 2, tool: 1 });
add({ id: 'coin', e: '🪙', n: 'ملك ولا كتابة', d: 'اقلب العملة', min: 0, tool: 1 });
add({ id: 'teams', e: '👥', n: 'تقسيم الفرق', d: 'قسّم الجماعة ومنهو يبدأ', min: 2, tool: 1 });
add({ id: 'wheel', e: '🎡', n: 'عجلة الحظ', d: 'اكتب الخيارات ولف العجلة', min: 0, tool: 1 });
Object.assign(RULES, {
  drw: ['كل واحد يسحب الشاشة ويشوف الكلمة، إلا الامبوستر ما يعرفها (وإدا شغلتوا الخيار يشوف الموضوع بس).', 'بعدين التلفون يدور: كل واحد يرسم **خط واحد بس** على نفس الورقة (تحط إصبعك وترسم وترفعه). كل لاعب له لون.', 'ارسم شي يثبت إنك تعرف الكلمة، بس لا تكون واضح واجد عشان الامبوستر ما يعرفها!', 'الامبوستر يحاول يرسم شي يمشي مع رسمتكم بدون ما ينكشف.', 'إدا غلطت، اضغط ↩️ تراجع وارسم من جديد قبل لا تعطي التلفون.', 'بعد آخر جولة، أو إدا ضغطتوا 🗳️ وقفوا، يبدأ التصويت السري ونفس نقاط الامبوستر: اللي يصوت صح +١، وكل صوت غلط +١ للامبوستر، والامبوستر +١ إدا خمّن الكلمة.'].map(x => x.replace(/\*\*/g, '')),
  sj: ['نفس اللعبة الكويتية المشهورة: فريقين، ٦ مواضيع، و٣٦ سؤال.', 'كل موضوع فيه ٦ أسئلة: ٢ بـ ٢٠٠ (مقدور عليها)، ٢ بـ ٤٠٠ (صعبة)، ٢ بـ ٦٠٠ (صعبة واجد).', 'الفريق اللي عليه الدور يختار سؤال من اللوحة، ويقراه واحد بصوت عالي، وعندهم وقت يفكرون. إدا ما عرفوا، الفريق الثاني يقدر يجاوب وياخد النقاط.', 'كل فريق يختار ٣ وسائل مساعدة قبل اللعبة، وكل وسيلة مرة وحدة: ✌️ جاوب جوابين، 📞 اتصال بصديق (٣٠ ثانية)، 🕳️ الحفرة (قبل ما تشوفون السؤال: إدا جاوبتوا صح تنخصم نقاطه من الفريق الثاني)، 🪑 استريح، 🪤 الفخ (تعطون السؤال للفريق الثاني وإدا غلطوا تنخصم منهم نقاطه)، وبعد ✖️٢ دبل و💡 تلميح.', 'اضغطوا "اكشف الجواب" وبعدين اختاروا منهو جاوب صح.', 'الدور ينتقل بعد كل سؤال، واللي عنده نقاط أكثر في الأخير يفوز. الأسئلة ما تتكرر لين تخلص.'],
  feud: ['تنقسمون فريقين. كل جولة فيها سؤال "سألنا ١٠٠ شخص" ووراه ٦ أجوبة مخفية بنقاطها.', 'بالبداية واحد من كل فريق يتواجهون، واللي يجاوب الجواب الأعلى يختار فريقه يلعب. اضغطوا على اسم الفريق اللي بيلعب.', 'الفريق يقول أجوبة: إدا الجواب موجود اضغطوا على مربعه ينكشف وتنضاف نقاطه، وإدا مو موجود اضغطوا ✖ غلط.', 'إدا كشفوا كل الأجوبة ياخدون نقاط الجولة. وإدا وصلوا ٣ أغلاط، الفريق الثاني عنده فرصة وحدة يسرق كل النقاط بجواب صح.', 'آخر جولة نقاطها دبل! واللي يجمع أكثر في الأخير يفوز.'],
  dice: ['اختار نوع النرد: D4 أو D6 أو D8 أو D10 أو D12 أو D20، وچم نرد تبغى (لين ٤).', 'اضغط "ارمي" أو اضغط على النرد نفسه، ويطلع المجموع تحت.'],
  cups: ['تشوف الكورة تحت كوب، بعدين الأكواب تتلخبط.', 'تابع الكوب بعيونك، ولما يوقفون اضغط على الكوب اللي تظن الكورة تحته.', 'كل ما جبتها صح تزيد سلسلتك. تقدر تزيد عدد الأكواب والصعوبة.'],
  bottle: ['حطوا التلفون على الطاولة بالنص، والأسامي حوله بنفس ترتيب قعدتكم تقريباً.', 'اضغطوا لف: رأس الغرشة 🟢 يأشر على اللي يجاوب، وتحتها 🔴 على اللي يسأل. تنفع مع صراحة ولا جرأة!'],
  coin: ['اضغط اقلب، والعملة تطير وتطيح على ملك أو كتابة. تنفع لما تختلفون على شي!'],
  wheel: ['اكتب الخيارات اللي تبغاها (أسامي، مطاعم، عقابات… أي شي)، أو اضغط "حط أسامي اللاعبين".', 'اضغط لف العجلة، والسهم فوق يأشر على اللي طلع.', 'إدا شغلت "شيل اللي يطلع"، الخيار يختفي بعد ما يطلع عشان ما يتكرر.'],
  teams: ['اختار چم فريق، واضغط قسّم: اللعبة توزع اللاعبين عشوائي وبالتساوي.', 'وزر "منهو يبدأ؟" يختار واحد عشوائي يبدأ اللعبة.']
});
RULES.triv = RULES.triv;
// نرد واحد يتدحرج على أي canvas (للودو)
window.DIE = {
  draw(cv, val) { const d = { sides: 6 }; renderDie(cv, 6, targetQ(d, val), i => i + 1); },
  roll(cv, val, cb) { const d = { cv, sides: 6, val }; animateRoll([d], cb); }
};
window.UI = { mkScreen, stepper, chipSet, setBtns2, teamInputs, scoreHead, teamNames };
window.__t = () => ({ DR, SG, FG, DICE, SHAPES, Qt, CP, CO, BT, WH });
window.EXTRA = { drw: drawSetup, sj: sjSetup, feud: feudSetup, dice: diceScreen, cups: cupsScreen, bottle: bottleScreen, coin: coinScreen, teams: teamsScreen, wheel: wheelScreen };
// الرجوع من شاشة الكشف في الرسم
renderHome();
})();
