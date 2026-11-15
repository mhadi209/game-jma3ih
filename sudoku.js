/* ===== تقزيرة: سودوكو (بروحك، ضد الكمبيوتر، أو سباق أونلاين) ===== */
(function () {
'use strict';
const { mkScreen, setBtns2 } = window.UI;
const css = document.createElement('style');
css.textContent = `
.sdInfo{display:flex;justify-content:space-between;align-items:center;font-weight:700;margin-bottom:8px;gap:8px}
.sdInfo .tm{font-family:'Lalezar';font-size:22px;direction:ltr}
.sdGrid{display:grid;grid-template-columns:repeat(9,1fr);width:min(94vw,440px);aspect-ratio:1;margin:0 auto;border:3px solid var(--line);border-radius:10px;overflow:hidden;background:var(--paper);direction:ltr;box-shadow:var(--sh)}
.sdC{border-right:1px solid #c9b994;border-bottom:1px solid #c9b994;display:flex;align-items:center;justify-content:center;font-family:'Lalezar','Tajawal';font-size:min(6.2vw,28px);color:#2457a3;position:relative;cursor:pointer;user-select:none;-webkit-user-select:none;background:#fffdf7}
body.dark .sdC{background:#2f261d;color:#7fb3ff;border-color:#5a4a37}
.sdC.g{color:#2b1d12;font-weight:700}
body.dark .sdC.g{color:#f1e6cc}
.sdC.c2{border-right:2px solid var(--line)}.sdC.r2{border-bottom:2px solid var(--line)}
.sdC.hl{background:#f3e7c7}.sdC.same{background:#f2d58f}.sdC.sel{background:#e9b949!important;color:#2b1d12}
body.dark .sdC.hl{background:#3d3226}body.dark .sdC.same{background:#5a4a2a}
.sdC.err{color:#d32f2f!important;background:#fbd9d6}
.sdC .nt{position:absolute;inset:2px;display:grid;grid-template-columns:repeat(3,1fr);font-size:min(2.4vw,10px);color:#7a6247;font-family:'Tajawal';line-height:1}
.sdC .nt span{display:flex;align-items:center;justify-content:center}
.sdC.pop{animation:pop .25s}
.sdPad{display:grid;grid-template-columns:repeat(9,1fr);gap:4px;width:min(94vw,440px);margin:10px auto 0;direction:ltr}
.sdPad button{padding:8px 0;font-family:'Lalezar';font-size:24px;display:flex;flex-direction:column;align-items:center;line-height:1;background:var(--paper);color:var(--txt);box-shadow:2px 2px 0 var(--line)}
.sdPad button small{font-family:'Tajawal';font-size:10px;color:var(--mut)}
.sdPad button.done{opacity:.3}
.sdTools{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;width:min(94vw,440px);margin:8px auto 0}
.sdTools button{font-size:14px;padding:8px 2px}
.sdTools button.on{background:var(--yel);color:#2b1d12}
.race{width:min(94vw,440px);margin:0 auto 8px}
.race .rr{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:700;margin-bottom:4px}
.race .rr span:first-child{width:80px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.race .bar{flex:1;height:14px;border:2px solid var(--line);border-radius:8px;background:var(--paper);overflow:hidden}
.race .bar i{display:block;height:100%;background:var(--grn);transition:width .4s}
.race .rr.bot .bar i{background:var(--red)}
`;
document.head.appendChild(css);

/* ---------- المولد والحل ---------- */
function solveCount(b, limit) { // b: مصفوفة ٨١ (٠ = فاضي)
  const rows = Array(9).fill(0), cols = Array(9).fill(0), box = Array(9).fill(0), empty = [];
  for (let i = 0; i < 81; i++) { const v = b[i]; if (v) { const m = 1 << v, r = i / 9 | 0, c = i % 9, x = (r / 3 | 0) * 3 + (c / 3 | 0); rows[r] |= m; cols[c] |= m; box[x] |= m; } else empty.push(i); }
  let count = 0;
  const rec = () => {
    if (count >= limit) return;
    let best = -1, bm = 0, bc = 10;
    for (const i of empty) { if (b[i]) continue; const r = i / 9 | 0, c = i % 9, x = (r / 3 | 0) * 3 + (c / 3 | 0); const m = ~(rows[r] | cols[c] | box[x]) & 0x3FE; let n = 0; for (let k = m; k; k &= k - 1) n++; if (n < bc) { bc = n; best = i; bm = m; if (!n) return; } }
    if (best < 0) { count++; return; }
    const r = best / 9 | 0, c = best % 9, x = (r / 3 | 0) * 3 + (c / 3 | 0);
    for (let v = 1; v <= 9; v++) if (bm & (1 << v)) { const m = 1 << v; b[best] = v; rows[r] |= m; cols[c] |= m; box[x] |= m; rec(); b[best] = 0; rows[r] &= ~m; cols[c] &= ~m; box[x] &= ~m; if (count >= limit) return; }
  };
  rec(); return count;
}
function fullGrid() {
  const b = Array(81).fill(0);
  const ok = (i, v) => { const r = i / 9 | 0, c = i % 9; for (let k = 0; k < 9; k++) { if (b[r * 9 + k] === v || b[k * 9 + c] === v) return false; } const br = (r / 3 | 0) * 3, bc = (c / 3 | 0) * 3; for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) if (b[(br + y) * 9 + bc + x] === v) return false; return true; };
  const rec = i => { if (i === 81) return true; for (const v of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) if (ok(i, v)) { b[i] = v; if (rec(i + 1)) return true; b[i] = 0; } return false; };
  rec(0); return b;
}
const LEVELS = [['سهل', 40], ['متوسط', 32], ['صعب', 27], ['خبير', 24]];
function makePuzzle(lvl) {
  const sol = fullGrid(), p = sol.slice(), target = LEVELS[lvl][1];
  let filled = 81;
  for (const i of shuffle([...Array(81).keys()])) {
    if (filled <= target) break;
    const v = p[i]; p[i] = 0;
    if (solveCount(p.slice(), 2) !== 1) p[i] = v; else filled--;
  }
  return { p, sol, lvl };
}

/* ---------- اللعبة ---------- */
const sS = mkScreen('sudokuSetup', '🔢 سودوكو');
const sP = mkScreen('sudoku', '🔢 سودوكو');
sP.back.onclick = () => { if (SD && SD.hooks && !SD.done) { show('online'); return; } if (SD && SD.hooks) { show('online'); return; } renderHome(); show('home'); };
let SD = null;
function sdSetup() {
  S.sdLvl = S.sdLvl || 0; S.sdMode = S.sdMode || 'solo';
  const b = sS.body; b.innerHTML = '';
  const box = el('div', 'box'); box.appendChild(el('h2', '', 'الصعوبة'));
  const ch = el('div', 'chips'); LEVELS.forEach(([n], i) => { const c = el('button', 'chip' + (S.sdLvl === i ? ' sel' : ''), n); c.onclick = () => { S.sdLvl = i; save(); sdSetup(); }; ch.appendChild(c); }); box.appendChild(ch);
  const box2 = el('div', 'box'); box2.appendChild(el('h2', '', 'طريقة اللعب'));
  const ch2 = el('div', 'chips'); [['solo', '🙋 بروحي'], ['bot', '🤖 سباق ضد الكمبيوتر']].forEach(([k, n]) => { const c = el('button', 'chip' + (S.sdMode === k ? ' sel' : ''), n); c.onclick = () => { S.sdMode = k; save(); sdSetup(); }; ch2.appendChild(c); }); box2.appendChild(ch2);
  box2.appendChild(el('div', 'lab', 'تبغى تتسابق مع ربعك؟ سوّ غرفة أونلاين واختار سودوكو 🌐'));
  const best = LS.get('sdBest', {}); const bb = el('div', 'box'); bb.appendChild(el('h2', '', 'أحسن وقت 🏆')); LEVELS.forEach(([n], i) => { const r = el('div', 'setrow'); r.append(el('b', '', n), el('span', '', best[i] ? fmtT(best[i]) : '—')); bb.appendChild(r); });
  b.append(box, box2, bb);
  setBtns2(sS.row, [btn('ابدأ ▶', '', () => sdStart(makePuzzle(S.sdLvl), S.sdMode))]);
  show('sudokuSetup');
}
const fmtT = s => { s = Math.floor(s); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
function sdStart(pz, mode, onlineHooks) {
  SD = { pz, cur: pz.p.slice(), notes: Array(81).fill(0), sel: -1, noteMode: false, err: 0, hints: 0, undo: [], t0: Date.now(), mode, done: false, bot: 0, hooks: onlineHooks || null, others: [] };
  if (mode === 'bot') { const total = pz.p.filter(v => !v).length; const secPer = [9, 13, 19, 26][pz.lvl]; SD.botTotal = total; SD.botNext = Date.now() + secPer * 1000 * (0.6 + Math.random() * .8); SD.botSec = secPer; }
  sdDraw(); show('sudoku');
  clearInterval(SD.tick); SD.tick = setInterval(sdTick, 500);
}
function sdTick() {
  if (!SD || SD.done || !$('sdT')) { if (SD && !$('sdT')) clearInterval(SD.tick); return; }
  $('sdT').textContent = fmtT((Date.now() - SD.t0) / 1000);
  if (SD.mode === 'bot' && Date.now() >= SD.botNext) { SD.bot++; SD.botNext = Date.now() + SD.botSec * 1000 * (0.5 + Math.random()); sdRace(); if (SD.bot >= SD.botTotal) sdEnd(false); }
}
const filledCount = () => SD.cur.filter((v, i) => !SD.pz.p[i] && v === SD.pz.sol[i]).length;
function sdRace() {
  const r = $('sdRace'); if (!r) return; r.innerHTML = '';
  const total = SD.pz.p.filter(v => !v).length;
  const row = (n, v, cls) => { const d = el('div', 'rr' + (cls ? ' ' + cls : '')); const bar = el('div', 'bar'), i = el('i'); i.style.width = Math.round(v / total * 100) + '%'; bar.appendChild(i); d.append(el('span', '', n), bar, el('span', '', v + '/' + total)); r.appendChild(d); };
  row('إنت', filledCount());
  if (SD.mode === 'bot') row('🤖 الكمبيوتر', SD.bot, 'bot');
  SD.others.forEach(o => row(o.name, o.v, 'bot'));
}
function sdDraw() {
  const b = sP.body; b.innerHTML = '';
  const info = el('div', 'sdInfo'); const tm = el('span', 'tm', fmtT((Date.now() - SD.t0) / 1000)); tm.id = 'sdT';
  info.append(el('span', '', LEVELS[SD.pz.lvl][0]), el('span', '', '❌ ' + SD.err + '/٣'), tm); b.appendChild(info);
  if (SD.mode !== 'solo') { const r = el('div', 'race'); r.id = 'sdRace'; b.appendChild(r); }
  const g = el('div', 'sdGrid'); const sv = SD.sel >= 0 ? SD.cur[SD.sel] : 0;
  for (let i = 0; i < 81; i++) {
    const r = i / 9 | 0, c = i % 9, v = SD.cur[i];
    let cls = 'sdC' + (SD.pz.p[i] ? ' g' : '') + (c === 2 || c === 5 ? ' c2' : '') + (r === 2 || r === 5 ? ' r2' : '');
    if (SD.sel >= 0) { const sr = SD.sel / 9 | 0, sc = SD.sel % 9; if (r === sr || c === sc || ((r / 3 | 0) === (sr / 3 | 0) && (c / 3 | 0) === (sc / 3 | 0))) cls += ' hl'; if (sv && v === sv) cls += ' same'; if (i === SD.sel) cls += ' sel'; }
    if (v && !SD.pz.p[i] && v !== SD.pz.sol[i]) cls += ' err';
    const d = el('div', cls, v ? String(v) : '');
    if (!v && SD.notes[i]) { const nt = el('div', 'nt'); for (let k = 1; k <= 9; k++) nt.appendChild(el('span', '', SD.notes[i] & (1 << k) ? k : '')); d.appendChild(nt); }
    if (i === SD.lastPut) d.classList.add('pop');
    d.onclick = () => { SD.sel = i; SD.lastPut = -1; sdDraw(); };
    g.appendChild(d);
  }
  b.appendChild(g);
  const pad = el('div', 'sdPad');
  for (let k = 1; k <= 9; k++) { const cnt = SD.cur.filter((v, i) => v === k && v === SD.pz.sol[i]).length; const bt = el('button', cnt >= 9 ? 'done' : ''); bt.append(el('span', '', k), el('small', '', 9 - cnt)); bt.onclick = () => sdPut(k); pad.appendChild(bt); }
  b.appendChild(pad);
  const tools = el('div', 'sdTools');
  tools.append(btn('↩️ تراجع', 'ghost', sdUndo), btn('🧽 امسح', 'ghost', () => sdPut(0)), btn('✏️ ملاحظات', SD.noteMode ? 'on' : 'ghost', () => { SD.noteMode = !SD.noteMode; sdDraw(); }), btn('💡 تلميح', 'ghost', sdHint));
  b.appendChild(tools);
  if (SD.mode !== 'solo') sdRace();
  setBtns2(sP.row, []);
}
function sdPut(k) {
  if (SD.done || SD.sel < 0 || SD.pz.p[SD.sel]) return; const i = SD.sel;
  if (SD.cur[i] === SD.pz.sol[i] && k) return;
  SD.undo.push([i, SD.cur[i], SD.notes[i]]);
  if (SD.noteMode && k) { SD.notes[i] ^= (1 << k); SD.cur[i] = 0; }
  else { SD.cur[i] = k; SD.notes[i] = 0; SD.lastPut = i;
    if (k && k !== SD.pz.sol[i]) { SD.err++; beep(200, .25); buzz(120); if (SD.err >= 3) { sdDraw(); return sdEnd(false, 'خلصت محاولاتك (٣ أغلاط)'); } }
    else if (k) { if (window.SFX) SFX.place(); else beep(900, .05); const r = i / 9 | 0, c = i % 9; for (let t = 0; t < 9; t++) { SD.notes[r * 9 + t] &= ~(1 << k); SD.notes[t * 9 + c] &= ~(1 << k); } const br = (r / 3 | 0) * 3, bc = (c / 3 | 0) * 3; for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) SD.notes[(br + y) * 9 + bc + x] &= ~(1 << k); }
  }
  sdDraw();
  if (SD.hooks) SD.hooks.progress(filledCount());
  if (SD.cur.every((v, j) => v === SD.pz.sol[j])) sdEnd(true);
}
function sdUndo() { const u = SD.undo.pop(); if (!u || SD.done) return; SD.cur[u[0]] = u[1]; SD.notes[u[0]] = u[2]; SD.sel = u[0]; sdDraw(); }
function sdHint() {
  if (SD.done) return; let i = SD.sel >= 0 && SD.cur[SD.sel] !== SD.pz.sol[SD.sel] ? SD.sel : -1;
  if (i < 0) { const em = []; SD.cur.forEach((v, j) => { if (v !== SD.pz.sol[j]) em.push(j); }); if (!em.length) return; i = pick(em); }
  SD.hints++; SD.sel = i; SD.noteMode = false; const k = SD.pz.sol[i]; SD.cur[i] = 0; sdPut(k);
}
function sdEnd(won, why) {
  if (SD.done) return; SD.done = true; clearInterval(SD.tick);
  const secs = (Date.now() - SD.t0) / 1000;
  if (won && SD.mode === 'solo' && !SD.hints) { const best = LS.get('sdBest', {}); if (!best[SD.pz.lvl] || secs < best[SD.pz.lvl]) { best[SD.pz.lvl] = secs; LS.set('sdBest', best); } }
  if (SD.hooks) SD.hooks.finish(won, secs);
  const c = el('div', 'bigcard'); c.style.marginTop = '12px';
  c.append(el('div', 'win ' + (won ? 'good' : 'bad'), won ? '🎉 حليتها!' : (why || '🤖 الكمبيوتر خلص قبلك!')), el('div', 'lab', 'الوقت: ' + fmtT(secs) + ' · أغلاط: ' + SD.err + ' · تلميحات: ' + SD.hints));
  sP.body.prepend(c); beep(won ? 1200 : 200, .3);
  if (!SD.hooks) setBtns2(sP.row, [btn('تعديل', 'ghost', sdSetup), btn('لعبة جديدة 🔄', '', () => sdStart(makePuzzle(SD.pz.lvl), SD.mode), 2)]);
}
window.SUDOKU = { makePuzzle, sdStart, setOthers: o => { if (SD) { SD.others = o; sdRace(); } }, get SD() { return SD; }, LEVELS, solveCount, end: (won, why) => sdEnd(won, why) };

/* ---------- تسجيل ---------- */
const k = GAMES.findIndex(x => x.id === 'xo');
GAMES.splice(k, 0, { id: 'sudoku', e: '🔢', n: 'سودوكو', d: '٤ مستويات، بروحك أو سباق ضد الكمبيوتر', min: 0, t: '١٠-٣٠ دقيقة' });
RULES.sudoku = ['عبّي المربعات بأرقام من ١ لين ٩، بحيث كل صف وكل عمود وكل مربع ٣×٣ ما يتكرر فيه رقم.', 'اضغط على المربع وبعدين على الرقم تحت. الأرقام الغلط تطلع حمرا، وبعد ٣ أغلاط تخسر.', '✏️ الملاحظات: تكتب أرقام صغيرة كاحتمالات. 💡 التلميح يحل لك مربع (بس ما ينحسب لك أحسن وقت).', 'سباق ضد الكمبيوتر: الكمبيوتر يحل نفس اللغز، والشريط يوريك وين وصل. خلّص قبله!', 'وأونلاين: كل واحد يحل نفس اللغز على تلفونه، وأول واحد يخلص يفوز.'];
window.EXTRA.sudoku = sdSetup;
renderHome();
})();
