/* ===== تقزيرة: كود نيمز (تلفون واحد + أونلاين) ===== */
(function () {
'use strict';
const { mkScreen, setBtns2 } = window.UI;
const css = document.createElement('style');
css.textContent = `
.cnHead{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;margin-bottom:10px}
.cnTeam{border:2px solid var(--line);border-radius:12px;padding:6px;text-align:center;font-weight:700;color:#fff;box-shadow:var(--sh);opacity:.6}
.cnTeam.r{background:linear-gradient(135deg,#e2504a,#a51f1a)}.cnTeam.b{background:linear-gradient(135deg,#3f8ae0,#1b4f99)}
.cnTeam.on{opacity:1;outline:3px solid var(--yel);outline-offset:2px}
.cnTeam .n{font-family:'Lalezar';font-size:28px;line-height:1}
.cnClue{background:var(--paper);border:2px solid var(--line);border-radius:12px;padding:6px 10px;text-align:center;font-weight:700;margin-bottom:10px}
.cnClue b{font-family:'Lalezar';font-size:22px;color:var(--red)}
.cnGrid{display:grid;grid-template-columns:repeat(5,1fr);gap:5px}
.cnCard{aspect-ratio:1.25;border-radius:9px;border:2px solid #8a7550;background:linear-gradient(180deg,#f8eed6,#e6d6b0);display:flex;align-items:center;justify-content:center;text-align:center;font-weight:800;font-size:12.5px;line-height:1.15;padding:3px;color:#2b1d12;box-shadow:0 3px 0 #8a7550;cursor:pointer;position:relative;user-select:none;-webkit-user-select:none;transition:transform .15s;overflow:hidden;word-break:break-word}
.cnCard.sel{transform:scale(1.06);box-shadow:0 0 0 3px var(--yel),0 3px 0 #8a7550}
.cnCard.k-r{background:linear-gradient(180deg,#f7cfcc,#eaa29d);box-shadow:inset 0 0 0 3px #d63a33,0 3px 0 #8a7550}.cnCard.k-b{background:linear-gradient(180deg,#d3e3f8,#a5c4ee);box-shadow:inset 0 0 0 3px #2f73c9,0 3px 0 #8a7550}.cnCard.k-x{background:linear-gradient(180deg,#555,#222);color:#fff;box-shadow:inset 0 0 0 3px #000,0 3px 0 #8a7550}.cnCard.k-n{box-shadow:inset 0 0 0 3px #b8a98a,0 3px 0 #8a7550}
.cnCard.v-r{background:linear-gradient(135deg,#e2504a,#a51f1a);color:#fff;border-color:#6d120e}
.cnCard.v-b{background:linear-gradient(135deg,#3f8ae0,#1b4f99);color:#fff;border-color:#0f2f5e}
.cnCard.v-n{background:linear-gradient(135deg,#d8ccb0,#b5a685);color:#5b4d33;border-color:#7a6a4a}
.cnCard.v-x{background:linear-gradient(135deg,#333,#000);color:#fff;border-color:#000}
.cnCard.v-r,.cnCard.v-b,.cnCard.v-n,.cnCard.v-x{animation:cnflip .45s ease}
.cnCard .ic{position:absolute;bottom:1px;left:3px;font-size:13px;opacity:.85}
@keyframes cnflip{0%{transform:rotateY(90deg)}100%{transform:rotateY(0)}}
.cnKey{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;width:min(70vw,260px);margin:8px auto}
.cnKey i{aspect-ratio:1;border-radius:6px;border:2px solid var(--line)}
`;
document.head.appendChild(css);

/* ---------- المحرك (مشترك) ---------- */
function cnPool() {
  const all = [];
  Object.entries(TOPICS).forEach(([c, ws]) => ws.forEach(w => { if (!/[\s()]/.test(w) && [...w].length >= 2 && [...w].length <= 8 && !all.includes(w)) all.push(w); }));
  return all;
}
const POOL = cnPool();
function cnNew() {
  const words = []; while (words.length < 25) { const w = draw('cnwords', POOL); if (!words.includes(w)) words.push(w); }
  const start = Math.random() < .5 ? 'r' : 'b', other = start === 'r' ? 'b' : 'r';
  const key = shuffle([...Array(9).fill(start), ...Array(8).fill(other), ...Array(7).fill('n'), 'x']);
  return { words, key, rev: Array(25).fill(false), turn: start, start, clue: null, left: { r: start === 'r' ? 9 : 8, b: start === 'b' ? 9 : 8 }, over: null, log: '' };
}
const other = t => t === 'r' ? 'b' : 'r';
const TN = { r: 'الأحمر', b: 'الأزرق' };
function cnReveal(g, i) {
  if (g.over || g.rev[i]) return;
  g.rev[i] = true; const k = g.key[i], t = g.turn, w = g.words[i];
  if (k === 'x') { g.over = { win: other(t), why: 'فريق ' + TN[t] + ' كشف الكلمة القاتلة 💀' }; g.log = '💀 ' + w; return 'x'; }
  if (k === t) { g.left[t]--; g.log = '✅ ' + w + ' صح!'; if (!g.left[t]) g.over = { win: t, why: 'كشفوا كل كلماتهم' }; return 'ok'; }
  if (k === 'n') { g.log = '😐 ' + w + ' محايدة، الدور انتقل'; cnEnd(g); return 'n'; }
  g.left[k]--; g.log = '❌ ' + w + ' كانت لفريق ' + TN[k]; if (!g.left[k]) { g.over = { win: k, why: 'الخصم كشف آخر كلماتهم!' }; return 'o'; } cnEnd(g); return 'o';
}
function cnEnd(g) { g.turn = other(g.turn); g.clue = null; }

/* ---------- تلفون واحد ---------- */
const cS = mkScreen('cn', '🕵️‍♂️ كود نيمز');
let CN = null, sel = -1, showKey = false;
function cnStart() { CN = cnNew(); sel = -1; showKey = false; cnDraw(); show('cn'); }
function cnDraw() {
  const b = cS.body; b.innerHTML = '';
  const hd = el('div', 'cnHead');
  const tm = t => { const d = el('div', 'cnTeam ' + t + (CN.turn === t && !CN.over ? ' on' : '')); d.append(el('div', '', 'فريق ' + TN[t]), el('div', 'n', CN.left[t])); return d; };
  hd.append(tm('r'), el('div', 'lab', 'باقي'), tm('b')); b.appendChild(hd);
  const cl = el('div', 'cnClue');
  if (CN.over) cl.innerHTML = '🏆 <b>فريق ' + TN[CN.over.win] + ' فاز!</b><br>' + esc(CN.over.why);
  else cl.innerHTML = 'دور فريق <b>' + TN[CN.turn] + '</b>' + (CN.clue ? ' · التلميح: <b>' + esc(CN.clue) + '</b>' : ' · القائد يقول التلميح') + (CN.log ? '<br><small>' + esc(CN.log) + '</small>' : '');
  b.appendChild(cl);
  const g = el('div', 'cnGrid');
  CN.words.forEach((w, i) => {
    const c = el('div', 'cnCard' + (CN.rev[i] || CN.over ? ' v-' + CN.key[i] : (showKey ? ' k-' + CN.key[i] : '')) + (sel === i ? ' sel' : ''), w);
    if (CN.rev[i] && CN.key[i] === 'x') c.appendChild(el('span', 'ic', '💀'));
    c.onclick = () => { if (CN.over || CN.rev[i] || showKey) return; if (sel !== i) { sel = i; beep(700, .03); return cnDraw(); } sel = -1; const r = cnReveal(CN, i); if (window.SFX) SFX[r === 'ok' ? 'correct' : r === 'x' ? 'boom' : 'wrong'](); else beep(1100, .15); if (r !== 'ok') buzz(r === 'x' ? 400 : 100); cnDraw(); };
    g.appendChild(c);
  });
  b.appendChild(g);
  b.appendChild(el('div', 'sub', CN.over ? '' : 'اضغط على الكلمة مرتين عشان تكشفها'));
  if (CN.over) return setBtns2(cS.row, [btn('لعبة جديدة 🔄', '', cnStart)]);
  const kb = btn(showKey ? '🙈 خبّ المفتاح' : '🔑 مفتاح القادة', 'ghost', () => { showKey = !showKey; sel = -1; cnDraw(); });
  setBtns2(cS.row, [kb, btn('⏭️ خلصنا الدور', '', () => { cnEnd(CN); CN.log = ''; sel = -1; cnDraw(); }, 1.3)]);
}

/* ---------- أونلاين ---------- */
window.ONL.renderers.cnboard = (it, c, sendAct) => {
  const g = el('div', 'cnGrid'); g.style.width = '100%'; let s = -1;
  it.cells.forEach((cell, i) => {
    const d = el('div', 'cnCard' + (cell.r ? ' v-' + cell.k : cell.k ? ' k-' + cell.k : ''), cell.w);
    if (cell.r && cell.k === 'x') d.appendChild(el('span', 'ic', '💀'));
    if (it.click && !cell.r) d.onclick = () => { if (s !== i) { g.querySelectorAll('.sel').forEach(x => x.classList.remove('sel')); s = i; d.classList.add('sel'); beep(700, .03); return; } g.querySelectorAll('.cnCard').forEach(x => x.style.pointerEvents = 'none'); sendAct({ a: 'opt', v: i }); };
    g.appendChild(d);
  });
  c.appendChild(g);
};
window.ONL.renderers.cnhead = (it, c) => {
  const hd = el('div', 'cnHead'); hd.style.width = '100%';
  const tm = t => { const d = el('div', 'cnTeam ' + t + (it.turn === t ? ' on' : '')); d.append(el('div', '', TN[t] + ': ' + it.names[t]), el('div', 'n', it.left[t])); d.firstChild.style.fontSize = '11px'; return d; };
  hd.append(tm('r'), el('div', 'lab', 'باقي'), tm('b')); c.appendChild(hd);
};
function makeCN() {
  const O = window.ONL; const G = {};
  G.start = (keepTeams) => {
    const ps = O.active().map(p => p.id);
    if (!keepTeams || !G.team) { const sh = shuffle(ps); G.team = {}; sh.forEach((id, i) => G.team[id] = i % 2 ? 'b' : 'r'); G.spy = { r: sh[0], b: sh[1] }; }
    else { ps.forEach(id => { if (!G.team[id]) { const nr = Object.values(G.team).filter(t => t === 'r').length, nb = Object.values(G.team).filter(t => t === 'b').length; G.team[id] = nr <= nb ? 'r' : 'b'; } }); ['r', 'b'].forEach(t => { const mem = ps.filter(id => G.team[id] === t); if (mem.length) { const k = mem.indexOf(G.spy[t]); G.spy[t] = mem[(k + 1) % mem.length]; } }); }
    G.g = cnNew(); G.done = false;
  };
  const nm = id => (O.P(id) || {}).name || '؟';
  const names = () => { const o = { r: [], b: [] }; Object.entries(G.team).forEach(([id, t]) => { if (O.P(id) && O.P(id).on) o[t].push(nm(id) + (G.spy[t] === id ? '🔑' : '')); }); return { r: o.r.join('، '), b: o.b.join('، ') }; };
  G.join = p => { if (!G.team[p.id]) { const nr = Object.values(G.team).filter(t => t === 'r').length, nb = Object.values(G.team).filter(t => t === 'b').length; G.team[p.id] = nr <= nb ? 'r' : 'b'; } };
  G.view = p => {
    const g = G.g, t = G.team[p.id], spy = G.spy[t] === p.id, mine = t === g.turn;
    const head = { t: 'cnhead', turn: g.over ? '' : g.turn, left: g.left, names: names() };
    const clue = g.over ? { t: 'win good', v: '🏆 فريق ' + TN[g.over.win] + ' فاز! ' + g.over.why } : { t: 'lab', v: 'دور فريق ' + TN[g.turn] + (g.clue ? ' · التلميح: «' + g.clue + '»' : ' · ننتظر تلميح القائد 🔑') + (g.log ? ' · ' + g.log : '') };
    const cells = g.words.map((w, i) => ({ w, r: g.rev[i] || !!g.over, k: (g.rev[i] || g.over || spy) ? g.key[i] : '' }));
    const v = { title: '🕵️‍♂️ كود نيمز', items: [head, { t: 'lab', v: 'إنت في فريق ' + (TN[t] || '؟') + (spy ? ' وإنت القائد 🔑 (تشوف المفتاح)' : '') }, clue, { t: 'cnboard', cells, click: !g.over && mine && !spy && !!g.clue }] };
    if (!g.over && spy && mine && !g.clue) v.input = { kind: 'text', ph: 'اكتب التلميح ورقم، مثل: بحر ٢', btn: 'أرسل التلميح ✓' };
    if (!g.over && mine && !spy && g.clue) v.btns = [{ id: 'endturn', label: '⏭️ خلصنا الدور', cls: 'ghost' }];
    if (g.over) v.scores = O.scoresList();
    return v;
  };
  G.hostBtns = () => G.g.over ? [{ id: 'h:again', label: 'لعبة جديدة 🔄', flex: 2 }] : [];
  G.act = (p, m) => {
    const g = G.g, t = G.team[p.id], spy = G.spy[t] === p.id;
    if (m.v === 'h:again') return G.start(true);
    if (g.over) return;
    if (m.a === 'input' && spy && t === g.turn && !g.clue) { g.clue = String(m.v).slice(0, 30); g.log = ''; return; }
    if (m.a === 'opt' && t === g.turn && !spy && g.clue) { cnReveal(g, +m.v); if (g.over && !G.done) { G.done = true; Object.entries(G.team).forEach(([id, tt]) => { if (tt === g.over.win && O.P(id)) O.P(id).score++; }); } return; }
    if (m.v === 'endturn' && t === g.turn && !spy) { cnEnd(g); g.log = ''; }
  };
  return G;
}
window.ONL.register('cn', { e: '🕵️‍♂️', n: 'كود نيمز', d: 'فريقين وقادة يشوفون المفتاح', min: 4, make: makeCN });

/* ---------- تسجيل ---------- */
const k = GAMES.findIndex(x => x.id === 'sj');
GAMES.splice(k + 1, 0, { id: 'cn', e: '🕵️‍♂️', n: 'كود نيمز', d: 'فريقين، وقائد يعطي تلميح بكلمة ورقم', min: 0, t: '٢٠ دقيقة' });
RULES.cn = ['تنقسمون فريقين: الأحمر والأزرق، وكل فريق يختار قائد 🔑.', 'فيه ٢٥ كلمة على الطاولة. القائد بس يعرف كلمات فريقه (المفتاح): كلمات فريقه، كلمات الخصم، كلمات محايدة، وكلمة قاتلة 💀 وحدة.', 'دور القائد يعطي فريقه تلميح: كلمة وحدة ورقم، مثل "بحر ٢" يعني فيه كلمتين لها علاقة بالبحر.', 'الفريق يختار الكلمات (اضغط مرتين عشان تكشفها). إدا طلعت لكم كملوا، إدا طلعت محايدة أو للخصم ينتهي دوركم.', 'إدا كشفتوا الكلمة القاتلة 💀 تخسرون على طول! والفريق اللي يكشف كل كلماته أول يفوز.', 'على تلفون واحد: القادة يضغطون "🔑 مفتاح القادة" يشوفون الألوان، والباقين يغمضون. وفي الأونلاين القادة يشوفون المفتاح على تلفوناتهم.'];
window.EXTRA.cn = cnStart;
window.__cn = () => ({ CN, cnReveal, cnNew });
renderHome();
})();
