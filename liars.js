/* ===== تقزيرة: بار الكذابين (جوال واحد مع كمبيوتر + أونلاين) =====
   ورق اللعبة: ٦ شايب، ٦ بنت، ٦ إكة، و٢ جوكر. الطاولة تختار ورقة، وكل واحد ينزل ١-٣ أوراق ويقول إنها منها.
   اللي بعده يصدق وينزل، أو يقول "كذاب!". اللي يخسر يسحب سلك من قنبلته 💣، وآخر واحد يبقى يفوز. */
(function () {
'use strict';
const { mkScreen, setBtns2 } = window.UI;
const css = document.createElement('style');
css.textContent = `
.lbTable{background:radial-gradient(ellipse at center,#5b3a22,#2e1c10 75%);border:3px solid var(--line);border-radius:22px;padding:12px;box-shadow:var(--sh);color:#f3e6cc}
.lbTop{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:8px}
.lbTop .tc{font-family:'Lalezar';font-size:22px}
.lbSeats{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px}
.lbSeat{background:rgba(0,0,0,.3);border:2px solid transparent;border-radius:12px;padding:5px 8px;font-size:13px;font-weight:700;display:flex;justify-content:space-between;align-items:center;gap:6px}
.lbSeat.turn{border-color:#ffd54a;background:rgba(255,213,74,.18)}
.lbSeat.dead{opacity:.35;text-decoration:line-through}
.lbSeat .bm{font-size:11px;letter-spacing:1px;direction:ltr}
.lbLast{min-height:96px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:rgba(0,0,0,.25);border-radius:14px;padding:8px;margin-bottom:8px;text-align:center}
.lbLast .row2{display:flex;gap:6px;justify-content:center}
.pcard{width:60px;height:88px;border-radius:7px;position:relative;box-shadow:0 3px 7px rgba(0,0,0,.5);user-select:none;-webkit-user-select:none;flex:none;transition:transform .18s,box-shadow .18s;cursor:pointer;background:#fffdf8}
.pcard svg{width:100%;height:100%;display:block;border-radius:7px}
.pcard.big{width:74px;height:108px}
.pcard.back{background-color:#8e2418;background-image:repeating-linear-gradient(45deg,rgba(255,214,90,.22) 0 1px,transparent 1px 7px),repeating-linear-gradient(-45deg,rgba(255,214,90,.22) 0 1px,transparent 1px 7px)}
.pcard.sel{transform:translateY(-14px);box-shadow:0 0 0 3px #ffd54a,0 8px 12px rgba(0,0,0,.55)}
.pcard.lie{box-shadow:0 0 0 4px #e53935,0 3px 7px rgba(0,0,0,.5)}.pcard.true{box-shadow:0 0 0 4px #2ecc71,0 3px 7px rgba(0,0,0,.5)}
.pcard.inn{animation:cardIn .35s ease-out both}
.pcard.flipIn{animation:cardFlip .45s ease-out both}
@keyframes cardIn{from{transform:translateY(40px) rotate(-8deg);opacity:0}to{transform:none;opacity:1}}
@keyframes cardFlip{0%{transform:rotateY(90deg)}100%{transform:rotateY(0)}}
.lbTop .tname{font-family:'Lalezar';font-size:26px;color:#ffd54a;text-shadow:0 2px 0 #000}
.lbSeat{flex-wrap:wrap;row-gap:3px}.lbSeat span:first-child{white-space:nowrap}.cnt{white-space:nowrap;font-family:Lalezar;font-size:14px;color:#ffd54a}
.mini{display:inline-block;width:9px;height:13px;border-radius:2px;background:#8e2418;border:1px solid #f3e6cc;vertical-align:-2px;margin-inline-start:3px}
.wires{display:inline-flex;gap:2px;direction:ltr;align-items:center}
.wires i{width:7px;height:7px;border-radius:50%;background:#3a2a1c;border:1px solid #f3e6cc66}
.wires i.cut{background:#e53935;border-color:#e53935}
.lbHand{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;padding-top:16px}
.lbMsg{text-align:center;font-family:'Lalezar';font-size:20px;color:#ffd54a;min-height:28px}
.bomb2{font-size:70px;line-height:1;text-align:center}
.bomb2.shake{animation:shake .15s infinite}
`;
document.head.appendChild(css);

/* ---------- المحرك ---------- */
const CARD = { K: ['♣', 'شايب', 'شياب'], Q: ['♥', 'بنت', 'بنات'], A: ['♠', 'إكة', 'إكك'], J: ['★', 'جوكر', 'جواكر'] };
const cname = (c, n) => n > 1 ? CARD[c][2] : CARD[c][1];
const isOk = (c, t) => c === t || c === 'J';
function lbNew(players) { // players: [{id,name,bot}]
  const g = { pl: players.map(p => ({ id: p.id, name: p.name, bot: !!p.bot, hand: [], alive: true, live: rnd(6), pulls: 0 })), round: 0, msg: '', phase: 'play' };
  lbRound(g, rnd(g.pl.length)); return g;
}
function lbRound(g, start) {
  const deck = shuffle([...Array(6).fill('K'), ...Array(6).fill('Q'), ...Array(6).fill('A'), 'J', 'J']);
  g.pl.forEach(p => p.hand = p.alive ? deck.splice(0, 5) : []);
  g.table = pick(['K', 'Q', 'A']); g.last = null; g.round++; g.phase = 'play'; g.res = null;
  let i = start; for (let k = 0; k < g.pl.length && !g.pl[i].alive; k++) i = (i + 1) % g.pl.length; g.turn = i;
  g.msg = 'جولة ' + g.round + ': ورقة الطاولة ' + CARD[g.table][1] + ' ' + CARD[g.table][0];
}
const aliveN = g => g.pl.filter(p => p.alive).length;
function nextTurn(g, from) {
  const n = g.pl.length;
  for (let k = 1; k <= n; k++) { const i = (from + k) % n; if (g.pl[i].alive && g.pl[i].hand.length && i !== from) return i; }
  for (let k = 1; k <= n; k++) { const i = (from + k) % n; if (g.pl[i].alive && i !== from) return i; }  // ما عنده ورق: لازم يقول كذاب
  return from;
}
const mustCall = g => g.last && !g.pl[g.turn].hand.length;
function lbPlay(g, pi, idxs) {
  const p = g.pl[pi]; if (g.phase !== 'play' || g.turn !== pi || !idxs.length || idxs.length > 3 || !p.hand.length) return false;
  const cards = idxs.sort((a, b) => b - a).map(i => p.hand.splice(i, 1)[0]);
  g.last = { pi, cards, n: cards.length };
  g.msg = p.name + ' نزّل ' + cards.length + (cards.length > 1 ? ' أوراق ويقول إنها ' : ' ورقة ويقول إنها ') + cname(g.table, cards.length);
  g.turn = nextTurn(g, pi); return true;
}
function lbCall(g, pi) {
  if (g.phase !== 'play' || g.turn !== pi || !g.last || g.last.pi === pi) return false;
  const lie = g.last.cards.some(c => !isOk(c, g.table));
  const loser = lie ? g.last.pi : pi; const L = g.pl[loser];
  const boom = L.pulls === L.live; if (boom) L.alive = false; else L.pulls++;
  g.res = { caller: pi, liar: g.last.pi, cards: g.last.cards, lie, loser, boom };
  g.phase = 'reveal';
  g.msg = g.pl[pi].name + ' قال: كذاب! 🫵';
  return true;
}
function lbAfter(g) { // بعد كشف النتيجة
  if (g.phase !== 'reveal') return;
  if (aliveN(g) <= 1) { g.phase = 'over'; g.winner = g.pl.findIndex(p => p.alive); return; }
  lbRound(g, g.pl[g.res.loser].alive ? g.res.loser : (g.res.loser + 1) % g.pl.length);
}
function lbBot(g) { // يقرر الكمبيوتر
  const pi = g.turn, p = g.pl[pi];
  if (g.last && g.last.pi !== pi) {
    if (mustCall(g)) return lbCall(g, pi);
    const own = p.hand.filter(c => isOk(c, g.table)).length;
    const possible = 8 - own;
    let prob = 0.12 + 0.16 * g.last.n + (own >= 4 ? 0.25 : 0) + (p.hand.length && own === 0 ? 0.08 : 0);
    if (g.last.n > possible) prob = 1;
    if (Math.random() < prob) return lbCall(g, pi);
  }
  const good = p.hand.map((c, i) => isOk(c, g.table) ? i : -1).filter(i => i >= 0);
  let idx;
  if (good.length) { const k = Math.min(good.length, 1 + rnd(Math.min(3, good.length))); idx = shuffle(good).slice(0, k); if (Math.random() < .2 && p.hand.length > idx.length && idx.length < 3) { const bad = p.hand.map((c, i) => !isOk(c, g.table) ? i : -1).filter(i => i >= 0); if (bad.length) idx.push(pick(bad)); } }
  else idx = [rnd(p.hand.length)];
  return lbPlay(g, pi, idx);
}

/* ---------- رسم الورق ---------- */
/* ---------- رسم الورق (SVG) ---------- */
const SUITP = {
  H: 'M5 9.4C5 9.4 0 5.9 0 3C0 1.3 1.2 0 2.8 0C3.8 0 4.6.6 5 1.4C5.4.6 6.2 0 7.2 0C8.8 0 10 1.3 10 3C10 5.9 5 9.4 5 9.4Z',
  S: 'M5 0C5 0 0 3.6 0 6.2C0 7.6 1.1 8.6 2.4 8.6C3.3 8.6 4.1 8.1 4.5 7.4C4.4 8.6 3.9 9.4 3.2 10H6.8C6.1 9.4 5.6 8.6 5.5 7.4C5.9 8.1 6.7 8.6 7.6 8.6C8.9 8.6 10 7.6 10 6.2C10 3.6 5 0 5 0Z',
  C: 'M5 0.2A2.4 2.4 0 1 1 5 5A2.4 2.4 0 1 1 5 0.2ZM2.5 3.7A2.4 2.4 0 1 1 2.5 8.5A2.4 2.4 0 1 1 2.5 3.7ZM7.5 3.7A2.4 2.4 0 1 1 7.5 8.5A2.4 2.4 0 1 1 7.5 3.7ZM4.4 6L3.4 10H6.6L5.6 6Z',
  R: 'M5 0L6.2 3.6L10 3.7L7 6L8.1 9.6L5 7.5L1.9 9.6L3 6L0 3.7L3.8 3.6Z'
};
const SUITOF = { K: 'C', Q: 'H', A: 'S', J: 'R' }, COLOF = { K: '#1d1d1d', Q: '#c62828', A: '#1d1d1d', J: '#7b2cbf' }, LETOF = { K: 'K', Q: 'Q', A: 'A', J: 'J' };
const suit = (k, x, y, s, col) => `<path d="${SUITP[k]}" fill="${col}" transform="translate(${x} ${y}) scale(${s / 10})"/>`;
function faceArt(c) {
  if (c === 'K') return `<rect x="9" y="13" width="42" height="60" rx="4" fill="#fbf1d6" stroke="#c9a227" stroke-width="1.4"/>
    <path d="M12 72Q12 55 30 53Q48 55 48 72Z" fill="#a8261c"/><path d="M30 54V72" stroke="#e8c547" stroke-width="3"/><path d="M14 64H46" stroke="#e8c547" stroke-width="1" opacity=".6"/>
    <circle cx="30" cy="40" r="9" fill="#f0c49a"/>
    <path d="M21 40Q22 56 30 57Q38 56 39 40Q35 46 30 46Q25 46 21 40Z" fill="#f4f4f4" stroke="#bdbdbd" stroke-width=".5"/>
    <path d="M25 45Q30 41.5 35 45Q30 43.6 25 45Z" fill="#dcdcdc"/>
    <circle cx="26.6" cy="38" r="1.1" fill="#2b1d12"/><circle cx="33.4" cy="38" r="1.1" fill="#2b1d12"/>
    <path d="M24.5 35.3L28 34.6M35.5 35.3L32 34.6" stroke="#eee" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M20 31.5V22L24.5 27.5L30 19L35.5 27.5L40 22V31.5Z" fill="#e8b923" stroke="#8a6510" stroke-width=".8"/>
    <circle cx="30" cy="27.5" r="1.7" fill="#c0392b"/><circle cx="24" cy="29.5" r="1.1" fill="#2e86de"/><circle cx="36" cy="29.5" r="1.1" fill="#2e86de"/>`;
  if (c === 'Q') return `<rect x="9" y="13" width="42" height="60" rx="4" fill="#fdeef2" stroke="#c9a227" stroke-width="1.4"/>
    <path d="M19.5 42Q18 26 30 25Q42 26 40.5 42L43 61Q30 63 17 61Z" fill="#5a3218"/>
    <path d="M13 72Q14 56 30 54Q46 56 47 72Z" fill="#c2185b"/><path d="M24 55Q30 61 36 55" stroke="#f8bbd0" stroke-width="1.6" fill="none"/>
    <circle cx="30" cy="40" r="8.6" fill="#f6d1b1"/>
    <path d="M21.4 38.5Q23.5 30 30 31Q36.5 30 38.6 38.5Q35 33.5 30 34.3Q25 33.5 21.4 38.5Z" fill="#5a3218"/>
    <circle cx="27" cy="40" r="1.05" fill="#2b1d12"/><circle cx="33" cy="40" r="1.05" fill="#2b1d12"/>
    <circle cx="25" cy="43.5" r="1.8" fill="#f48fb1" opacity=".5"/><circle cx="35" cy="43.5" r="1.8" fill="#f48fb1" opacity=".5"/>
    <ellipse cx="30" cy="45.3" rx="1.9" ry="1" fill="#d63c5e"/>
    <path d="M23 30.5L25 25.5L27.5 28.5L30 23.5L32.5 28.5L35 25.5L37 30.5Z" fill="#e8b923" stroke="#8a6510" stroke-width=".7"/><circle cx="30" cy="27.6" r="1.3" fill="#e91e63"/>
    ${suit('H', 26.5, 62, 7, '#fff')}`;
  if (c === 'A') return `<circle cx="30" cy="44" r="21" fill="none" stroke="#c9a227" stroke-width=".9" stroke-dasharray="2 2"/>
    <circle cx="30" cy="44" r="17.5" fill="none" stroke="#c9a227" stroke-width=".5"/>
    ${suit('S', 15, 28, 30, '#1d1d1d')}<circle cx="30" cy="43" r="2.2" fill="#c9a227"/>`;
  return `<rect x="9" y="13" width="42" height="60" rx="4" fill="#f6efff" stroke="#7b2cbf" stroke-width="1.4"/>
    <path d="M14 72V63L18 57L22 63L26 57L30 63L34 57L38 63L42 57L46 63V72Z" fill="#7b2cbf"/>
    <path d="M18 57L22 63L26 57L30 63L34 57L38 63L42 57" stroke="#f1c40f" stroke-width="1.2" fill="none"/>
    <circle cx="30" cy="47" r="8.2" fill="#fde3c8"/>
    <circle cx="27" cy="45.5" r="1" fill="#2b1d12"/><circle cx="33" cy="45.5" r="1" fill="#2b1d12"/><circle cx="30" cy="48" r="1.4" fill="#e74c3c"/>
    <path d="M26 50Q30 54 34 50" stroke="#c0392b" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <path d="M23 41Q16 31 12.5 24.5Q22 28 27 39Z" fill="#e74c3c"/><path d="M26.5 39Q28.5 27 30 17Q31.5 27 33.5 39Z" fill="#f1c40f"/><path d="M33 39Q38 28 47.5 24.5Q44 31 37 41Z" fill="#2980b9"/>
    <path d="M21.5 41.5Q30 36 38.5 41.5L38.5 43.5Q30 38.5 21.5 43.5Z" fill="#7b2cbf"/>
    <circle cx="12.5" cy="24.5" r="2.1" fill="#f1c40f"/><circle cx="30" cy="17" r="2.1" fill="#e74c3c"/><circle cx="47.5" cy="24.5" r="2.1" fill="#f1c40f"/>`;
}
function cardSVG(c) {
  const col = COLOF[c], k = SUITOF[c], L = LETOF[c];
  const corner = `<text x="7.5" y="13" font-size="11" font-weight="700" font-family="Georgia,'Times New Roman',serif" fill="${col}" text-anchor="middle">${L}</text>${suit(k, 4, 15.5, 7, col)}`;
  return `<svg viewBox="0 0 60 88" xmlns="http://www.w3.org/2000/svg"><rect x=".7" y=".7" width="58.6" height="86.6" rx="6" fill="#fffdf8" stroke="#bfae8c" stroke-width="1.4"/>
    ${faceArt(c)}${corner}<g transform="rotate(180 30 44)">${corner}</g>
    <text x="30" y="83.5" font-size="8.5" fill="${col}" text-anchor="middle" font-family="Lalezar,Tajawal,sans-serif">${CARD[c][1]}</text></svg>`;
}
const BACK = `<svg viewBox="0 0 60 88" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="52" height="80" rx="4" fill="none" stroke="#e8c547" stroke-width="1.3"/><rect x="7" y="7" width="46" height="74" rx="3" fill="none" stroke="#e8c547" stroke-width=".5" opacity=".7"/>
  <circle cx="30" cy="44" r="12" fill="#5a140d" stroke="#e8c547" stroke-width="1.2"/><circle cx="29" cy="46" r="6.2" fill="#1d1d1d"/><rect x="27.6" y="38" width="3.6" height="2.6" rx=".6" fill="#555"/>
  <path d="M30 38Q31 34 34.5 34.5" stroke="#e8c547" stroke-width="1" fill="none"/><circle cx="35" cy="34.3" r="1.6" fill="#ffb300"/><circle cx="26.8" cy="44" r="1.3" fill="#fff" opacity=".35"/></svg>`;
function pcard(c, cls) { const d = el('div', 'pcard ' + (c || 'back') + (cls ? ' ' + cls : '')); d.innerHTML = c ? cardSVG(c) : BACK; return d; }
const minis = n => '<span class="cnt"><span class="mini"></span>' + n + '</span>';
const wires = p => '<span class="wires">' + Array.from({ length: 6 }, (_, i) => '<i' + (i < p ? ' class="cut"' : '') + '></i>').join('') + '</span>';

/* ---------- جوال واحد ---------- */
const lS = mkScreen('liarsSetup', '🃏 بار الكذابين');
const lP = mkScreen('liars', '🃏 بار الكذابين');
let LB = null, picked = [], lastHuman = -1;
function liarsSetup() {
  S.lbBots = S.lbBots === undefined ? (S.players.length >= 2 ? 0 : 2) : S.lbBots;
  S.lbHum = S.lbHum || S.players.slice(0, 4);
  const b = lS.body; b.innerHTML = '';
  const box = el('div', 'box'); box.appendChild(el('h2', '', 'مين بيلعب؟ (لين ٤)'));
  const ch = el('div', 'chips'); S.players.forEach(p => { const c = el('button', 'chip' + (S.lbHum.includes(p) ? ' sel' : ''), p); c.onclick = () => { if (S.lbHum.includes(p)) S.lbHum.splice(S.lbHum.indexOf(p), 1); else if (S.lbHum.length + S.lbBots < 4) S.lbHum.push(p); else buzz(80); save(); liarsSetup(); }; ch.appendChild(c); });
  if (!S.players.length) ch.appendChild(el('div', 'lab', 'ما فيه لاعبين بالرئيسية، العب ضد الكمبيوتر'));
  box.appendChild(ch);
  box.appendChild(window.UI.stepper('🤖 كمبيوتر', () => S.lbBots, v => { S.lbBots = v; liarsSetup(); }, () => 0, () => Math.max(0, 4 - S.lbHum.length)));
  const err = el('div', 'err', '');
  b.append(box, err);
  setBtns2(lS.row, [btn('ابدأ 🃏', '', () => {
    const hum = S.lbHum.filter(p => S.players.includes(p)); const total = hum.length + S.lbBots;
    if (total < 2) { err.textContent = 'لازم لاعبين على الأقل (حتى لو كمبيوتر)'; return; }
    const pl = hum.map(n => ({ id: n, name: n })); const bn = ['🤖 سالم', '🤖 فهد', '🤖 مريم', '🤖 دانة'];
    for (let i = 0; i < S.lbBots; i++) pl.push({ id: 'bot' + i, name: bn[i], bot: true });
    if (!hum.length) pl.unshift({ id: 'me', name: 'أنت' });
    LB = lbNew(shuffle(pl)); lastHuman = -1; picked = []; liarsTurn();
  })]);
  show('liarsSetup');
}
const humans = () => LB.pl.filter(p => !p.bot).length;
function liarsTurn() {
  if (LB.phase === 'reveal') return liarsReveal();
  if (LB.phase === 'over') return liarsOver();
  const p = LB.pl[LB.turn]; picked = [];
  if (!p.bot && humans() > 1 && lastHuman !== LB.turn) return liarsPass(p);
  liarsDraw();
  if (p.bot) setTimeout(() => { if (!$('liars').classList.contains('on')) return; const n0 = LB.last; lbBot(LB); if (window.SFX) { if (LB.phase === 'reveal') SFX.liar(); else if (LB.last && LB.last !== n0) SFX.deal(LB.last.n); } liarsTurn(); }, (window.__fast ? 20 : 1300));
}
function liarsPass(p) {
  const b = lP.body; b.innerHTML = ''; const c = el('div', 'bigcard');
  c.append(el('div', 'lab', 'عط الجوال لـ'), el('div', 'nm', p.name), el('div', 'lab', 'وخل الباقين ما يشوفون ورقك 🤫'), el('div', 'lab', LB.msg));
  b.appendChild(c); setBtns2(lP.row, [btn('أنا ' + p.name + '، وريني ورقي 👀', '', () => { lastHuman = LB.turn; liarsDraw(); })]);
  show('liars');
}
function tableBox(viewer) {
  const t = el('div', 'lbTable');
  const top = el('div', 'lbTop'); top.append(el('div', 'tc', 'ورقة الطاولة'), pcard(LB.table, 'big'), el('div', 'tname', CARD[LB.table][1])); t.appendChild(top);
  const seats = el('div', 'lbSeats');
  LB.pl.forEach((p, i) => { const d = el('div', 'lbSeat' + (i === LB.turn && LB.phase === 'play' ? ' turn' : '') + (p.alive ? '' : ' dead')); const a = el('span', ''); a.innerHTML = esc(p.name) + ' ' + minis(p.hand.length); const bm = el('span', 'bm'); bm.innerHTML = '💣 ' + wires(p.pulls); d.append(a, bm); seats.appendChild(d); });
  t.appendChild(seats);
  const last = el('div', 'lbLast');
  if (LB.last) { last.appendChild(el('div', '', 'ورق ' + LB.pl[LB.last.pi].name + ' 👇')); const r = el('div', 'row2'); LB.last.cards.forEach((_, k) => { const pc = pcard(null, 'inn'); pc.style.animationDelay = k * .1 + 's'; r.appendChild(pc); }); last.appendChild(r); }
  else last.appendChild(el('div', '', 'ما أحد نزّل للحين'));
  t.appendChild(last);
  t.appendChild(el('div', 'lbMsg', LB.msg));
  return t;
}
function liarsDraw() {
  const b = lP.body; b.innerHTML = ''; const p = LB.pl[LB.turn];
  const me = p.bot ? (LB.pl.find(x => !x.bot && x.alive) || p) : p;
  const t = tableBox(me); b.appendChild(t);
  const isMine = !p.bot;
  t.appendChild(el('div', 'lbMsg', (isMine ? 'دورك يا ' : 'دور ') + p.name));
  const hand = el('div', 'lbHand');
  me.hand.forEach((c, i) => { const d = pcard(isMine || humans() === 1 ? c : null, picked.includes(i) ? 'sel' : ''); if (isMine) d.onclick = () => { if (picked.includes(i)) picked.splice(picked.indexOf(i), 1); else if (picked.length < 3) picked.push(i); else buzz(60); if (window.SFX) SFX.select(); liarsDraw(); }; hand.appendChild(d); });
  t.appendChild(hand);
  if (!isMine) { setBtns2(lP.row, [btn('🤖 ' + p.name + ' يفكر…', 'ghost', () => { })]); lP.row.querySelector('button').disabled = true; show('liars'); return; }
  const bs = [];
  if (LB.last && LB.last.pi !== LB.turn) bs.push(btn('كذاب! 🫵', 'red', () => { lbCall(LB, LB.turn); if (window.SFX) SFX.liar(); liarsTurn(); }));
  if (p.hand.length) { const pb = btn('نزّل ' + (picked.length || '') + ' ' + cname(LB.table, picked.length || 1) + ' ⬇️', '', () => { if (!picked.length) { buzz(80); return; } const n = picked.length; lbPlay(LB, LB.turn, picked.slice()); if (window.SFX) SFX.deal(n); liarsTurn(); }, 1.4); pb.disabled = !picked.length; bs.push(pb); }
  setBtns2(lP.row, bs); show('liars');
}
function liarsReveal() {
  const r = LB.res, b = lP.body; b.innerHTML = '';
  const t = tableBox(); b.appendChild(t);
  const last = t.querySelector('.lbLast'); last.innerHTML = '';
  last.appendChild(el('div', '', LB.pl[r.caller].name + ' قال كذاب على ' + LB.pl[r.liar].name + '!'));
  const row = el('div', 'row2'); r.cards.forEach((c, k) => { const pc = pcard(c, (isOk(c, LB.table) ? 'true' : 'lie') + ' flipIn'); pc.style.animationDelay = k * .15 + 's'; row.appendChild(pc); }); last.appendChild(row); if (window.SFX) { r.cards.forEach((_, k) => setTimeout(() => SFX.flip(), k * 150)); setTimeout(() => SFX[r.lie ? 'wrong' : 'correct'](), r.cards.length * 150 + 150); setTimeout(() => SFX.drumroll(1.4), 700); }
  last.appendChild(el('div', 'lbMsg', r.lie ? '😈 كان يكذب!' : '😇 كان صادق!'));
  const bomb = el('div', 'bomb2 shake', '💣'); t.appendChild(bomb);
  const out = el('div', 'lbMsg', LB.pl[r.loser].name + ' يسحب سلك من قنبلته…'); t.appendChild(out);
  setBtns2(lP.row, []);
  setTimeout(() => {
    bomb.classList.remove('shake');
    if (r.boom) { bomb.textContent = '💥'; out.textContent = 'بوووم! ' + LB.pl[r.loser].name + ' طلع من اللعبة'; if (window.SFX) SFX.boom(); buzz([300, 100, 400]); }
    else { bomb.textContent = '😮‍💨'; out.textContent = 'نجا ' + LB.pl[r.loser].name + '! (' + LB.pl[r.loser].pulls + ' من ٦ أسلاك)'; if (window.SFX) SFX.safe(); }
    setBtns2(lP.row, [btn('كمّل ←', '', () => { lbAfter(LB); lastHuman = -1; liarsTurn(); })]);
    if (LB.pl.every(p => p.bot || !p.alive)) setTimeout(() => { if (LB.phase === 'reveal' && $('liars').classList.contains('on')) { lbAfter(LB); liarsTurn(); } }, window.__fast ? 20 : 1500);
  }, window.__fast ? 20 : 2300);
  show('liars');
}
function liarsOver() {
  const b = lP.body; b.innerHTML = ''; const c = el('div', 'bigcard');
  c.append(el('div', 'bomb2', '🏆'), el('div', 'win good', LB.pl[LB.winner].name + ' فاز!'), el('div', 'lab', 'آخر واحد بقى على الطاولة'));
  b.appendChild(c); if (window.SFX) SFX.cheer();
  setBtns2(lP.row, [btn('تعديل', 'ghost', liarsSetup), btn('جولة جديدة 🔄', '', () => { LB = lbNew(shuffle(LB.pl.map(p => ({ id: p.id, name: p.name, bot: p.bot })))); lastHuman = -1; liarsTurn(); }, 2)]);
}

/* ---------- أونلاين ---------- */
const ORev = { key: null, play: null };
window.ONL.renderers.lbtable = (it, c) => {
  const t = el('div', 'lbTable'); t.style.width = '100%';
  const top = el('div', 'lbTop'); top.append(el('div', 'tc', 'ورقة الطاولة'), pcard(it.table, 'big'), el('div', 'tname', CARD[it.table][1])); t.appendChild(top);
  const seats = el('div', 'lbSeats'); it.seats.forEach(s => { const d = el('div', 'lbSeat' + (s.turn ? ' turn' : '') + (s.dead ? ' dead' : '')); const a = el('span', ''); a.innerHTML = esc(s.name) + ' ' + minis(s.n); const bm = el('span', 'bm'); bm.innerHTML = '💣 ' + wires(s.pulls); d.append(a, bm); seats.appendChild(d); }); t.appendChild(seats);
  const key = it.rkey || '', fresh = key && key !== ORev.key; if (key) ORev.key = key;
  const sig = (it.cards || []).length + '|' + it.lastTxt + '|' + it.msg; const newPlay = !key && sig !== ORev.play; ORev.play = key ? ORev.play : sig;
  const last = el('div', 'lbLast'); last.appendChild(el('div', '', it.lastTxt)); const r = el('div', 'row2');
  (it.cards || []).forEach((cc, k) => { const pc = cc.c ? pcard(cc.c, cc.k + (fresh ? ' flipIn' : '')) : pcard(null, newPlay ? 'inn' : ''); pc.style.animationDelay = k * .12 + 's'; r.appendChild(pc); });
  last.appendChild(r); t.appendChild(last);
  if (newPlay && (it.cards || []).length && window.SFX) SFX.deal(it.cards.length);
  if (it.verdict) {
    const vd = el('div', 'lbMsg', it.lie ? '😈 كان يكذب!' : '😇 كان صادق!'); last.appendChild(vd);
    const bomb = el('div', 'bomb2' + (fresh ? ' shake' : ''), fresh ? '💣' : it.bomb); t.appendChild(bomb);
    const out = el('div', 'lbMsg', fresh ? it.loser + ' يسحب سلك من قنبلته…' : it.verdict); t.appendChild(out);
    if (fresh) {
      if (window.SFX) { SFX.liar(); setTimeout(() => SFX[it.lie ? 'wrong' : 'correct'](), 500); setTimeout(() => SFX.drumroll(1.4), 900); }
      setTimeout(() => { if (!bomb.isConnected) return; bomb.classList.remove('shake'); bomb.textContent = it.bomb; out.textContent = it.verdict; if (window.SFX) SFX[it.boom ? 'boom' : 'safe'](); if (it.boom) buzz([300, 100, 400]); }, window.__fast ? 20 : 2400);
    }
  }
  t.appendChild(el('div', 'lbMsg', it.msg || '')); c.appendChild(t);
};
window.ONL.renderers.lbhand = (it, c, sendAct) => {
  const h = el('div', 'lbHand'); h.style.width = '100%'; const sel = [];
  const pb = btn('نزّل ⬇️', '', () => { if (!sel.length) { buzz(80); return; } pb.disabled = true; sendAct({ a: 'opt', v: sel.join(',') }); }); pb.disabled = true; pb.style.width = '100%';
  it.hand.forEach((cc, i) => { const d = pcard(cc); if (it.can) d.onclick = () => { if (sel.includes(i)) sel.splice(sel.indexOf(i), 1); else if (sel.length < 3) sel.push(i); d.classList.toggle('sel', sel.includes(i)); pb.disabled = !sel.length; pb.textContent = 'نزّل ' + (sel.length || '') + ' ⬇️'; if (window.SFX) SFX.select(); }; h.appendChild(d); });
  c.appendChild(h); if (it.can) { pb.style.marginTop = '10px'; c.appendChild(pb); }
};
function makeLB() {
  const O = window.ONL; const G = {};
  G.start = () => { G.g = lbNew(shuffle(O.active().map(p => ({ id: p.id, name: p.name })))); G.awarded = false; };
  const idx = id => G.g.pl.findIndex(p => p.id === id);
  G.leave = p => { const i = idx(p.id); if (i >= 0 && G.g.pl[i].alive) { G.g.pl[i].alive = false; G.g.pl[i].hand = []; if (G.g.phase === 'play' && G.g.turn === i) G.g.turn = nextTurn(G.g, i); if (aliveN(G.g) <= 1 && G.g.phase !== 'over') { G.g.phase = 'over'; G.g.winner = G.g.pl.findIndex(x => x.alive); } } };
  G.view = p => {
    const g = G.g, i = idx(p.id), me = g.pl[i];
    const base = { table: g.table, seats: g.pl.map((q, k) => ({ name: q.name, n: q.hand.length, pulls: q.pulls, dead: !q.alive, turn: g.phase === 'play' && k === g.turn })), msg: g.msg };
    if (g.phase === 'over') { if (!G.awarded) { G.awarded = true; const w = O.P(g.pl[g.winner].id); if (w) w.score += 2; } return { title: '🃏 بار الكذابين', items: [{ t: 'win good', v: '🏆 ' + g.pl[g.winner].name + ' فاز!' }], scores: O.scoresList() }; }
    if (g.phase === 'reveal') {
      const r = g.res;
      return { title: '🃏 بار الكذابين', items: [Object.assign(base, { t: 'lbtable', lastTxt: g.pl[r.caller].name + ' قال كذاب على ' + g.pl[r.liar].name + '!', cards: r.cards.map(c => ({ c, k: isOk(c, g.table) ? 'true' : 'lie' })), verdict: g.pl[r.loser].name + (r.boom ? ' 💥 انفجرت قنبلته وطلع!' : ' سحب سلك ونجا 😮‍💨'), lie: r.lie, boom: r.boom, loser: g.pl[r.loser].name, rkey: g.round + ':' + r.caller + ':' + r.liar, bomb: r.boom ? '💥' : '😮‍💨' })] };
    }
    const lastTxt = g.last ? 'ورق ' + g.pl[g.last.pi].name + ' 👇' : 'ما أحد نزّل للحين';
    const v = { title: '🃏 بار الكذابين', items: [Object.assign(base, { t: 'lbtable', lastTxt, cards: g.last ? g.last.cards.map(() => ({})) : [] })] };
    if (!me) { v.items.push({ t: 'lab', v: 'تتفرج 👀' }); return v; }
    const myTurn = g.turn === i && me.alive;
    v.items.push({ t: 'lab', v: !me.alive ? 'طلعت من اللعبة 💥 تتفرج' : myTurn ? 'دورك! اختار ١-٣ أوراق ونزّلها، أو قول كذاب' : 'ورقك (دور ' + g.pl[g.turn].name + ')' });
    if (me.alive) v.items.push({ t: 'lbhand', hand: me.hand, can: myTurn && me.hand.length > 0 });
    if (myTurn && g.last && g.last.pi !== i) v.btns = [{ id: 'liar', label: 'كذاب! 🫵', cls: 'red' }];
    return v;
  };
  G.hostBtns = () => G.g.phase === 'reveal' ? [{ id: 'h:next', label: 'كمّل ←', flex: 2 }] : G.g.phase === 'over' ? [{ id: 'h:again', label: 'لعبة جديدة 🔄', flex: 2 }] : [];
  G.act = (p, m) => {
    const g = G.g, i = idx(p.id);
    if (m.v === 'h:again') return G.start();
    if (m.v === 'h:next') return lbAfter(g);
    if (i < 0) return;
    if (m.a === 'opt') { const ids = String(m.v).split(',').map(Number).filter(n => n >= 0 && n < g.pl[i].hand.length); lbPlay(g, i, [...new Set(ids)]); return; }
    if (m.v === 'liar') lbCall(g, i);
  };
  return G;
}
window.ONL.register('lb', { e: '🃏', n: 'بار الكذابين', d: 'كل واحد ورقه على جواله', min: 2, make: makeLB });

/* ---------- تسجيل ---------- */
const k = GAMES.findIndex(x => x.id === 'uno');
GAMES.splice(k + 1, 0, { id: 'lb', e: '🃏', n: 'بار الكذابين', d: 'نزّل ورقك واكذب… أو اكشف الكذاب', min: 0, t: '١٥ دقيقة' });
RULES.lb = ['فيه ٢٠ ورقة: ٦ شايب (K)، ٦ بنت (Q)، ٦ إكة (A)، و٢ جوكر (الجوكر ينحسب أي ورقة). كل واحد ياخذ ٥ أوراق.', 'كل جولة تطلع "ورقة الطاولة"، مثلاً الشايب.', 'بدورك تنزّل ١ لين ٣ أوراق مقلوبة وتقول إنها كلها شياب. تقدر تقول الصدق… أو تكذب 😏', 'اللي بعدك يا يصدقك وينزّل ورقه، يا يقول "كذاب! 🫵" وتنكشف الأوراق.', 'إذا كنت تكذب أنت تخسر، وإذا كنت صادق اللي اتهمك يخسر. الخسران يسحب سلك من قنبلته 💣 (٦ أسلاك، واحد منها ينفجر).', 'إذا انفجرت قنبلتك تطلع. آخر واحد يبقى يفوز. تقدر تلعب ضد الكمبيوتر 🤖 أو أونلاين وكل واحد ورقه على جواله.'];
window.EXTRA.lb = liarsSetup;
window.__lb = () => ({ LB, lbNew, lbPlay, lbCall, lbAfter, lbBot, isOk });
renderHome();
})();
