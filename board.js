/* ===== تقزيرة: لودو وأونو ===== */
(function () {
'use strict';
const { mkScreen, setBtns2 } = window.UI;
function shade(hex, k) { const n = parseInt(hex.slice(1), 16); const f = v => Math.round(Math.max(0, Math.min(255, v * k))); return 'rgb(' + f((n >> 16) & 255) + ',' + f((n >> 8) & 255) + ',' + f(n & 255) + ')'; }
const css = document.createElement('style');
css.textContent = `
.seats{display:flex;flex-direction:column;gap:8px}
.seat{display:flex;align-items:center;gap:8px;background:var(--paper);border:2px solid var(--line);border-radius:12px;padding:6px 8px}
.seat .sw2{width:26px;height:26px;border-radius:50%;border:2px solid var(--line);flex:none}
.seat input{flex:1;min-width:0;padding:8px!important;font-size:15px!important}
.seat select{font:inherit;font-size:14px;border:2px solid var(--line);border-radius:8px;background:var(--card);color:var(--txt);padding:6px}
.ludoWrap{position:relative;width:min(94vw,470px);margin:0 auto}
.ludoWrap svg{width:100%;height:auto;display:block;filter:drop-shadow(4px 4px 0 rgba(0,0,0,.35));border-radius:14px}
.ludoBar{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:10px 0}
.ludoBar .who{font-family:'Lalezar';font-size:24px}
.ludoBar canvas{width:100px;height:100px;cursor:pointer;flex:none}
.tok{cursor:pointer;transition:transform .15s}
.tok.can{animation:bob2 .7s infinite}
@keyframes bob2{50%{transform:translateY(-.12px)}}
/* أونو */
.unoTable{background:radial-gradient(ellipse at center,#2f7a52,#1b4d33 75%);border:3px solid var(--line);border-radius:22px;padding:12px;box-shadow:var(--sh);color:#fff}
.opps{display:flex;justify-content:space-around;gap:6px;flex-wrap:wrap;margin-bottom:8px}
.opp{background:rgba(0,0,0,.25);border-radius:12px;padding:4px 10px;text-align:center;font-weight:700;font-size:14px;border:2px solid transparent}
.opp.turn{border-color:#ffd54a;background:rgba(255,213,74,.25)}
.opp .mini{display:flex;justify-content:center;margin-top:3px}
.opp .mini i{width:14px;height:20px;border-radius:3px;background:linear-gradient(135deg,#222,#444);border:1px solid #fff;margin-left:-6px;display:block}
.center{display:flex;justify-content:center;align-items:center;gap:22px;margin:10px 0}
.ucard{width:74px;height:110px;border-radius:12px;border:3px solid #fff;position:relative;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(0,0,0,.45);flex:none;user-select:none;font-family:'Lalezar','Tajawal'}
.ucard .ov{position:absolute;inset:14px 8px;background:#fff;border-radius:50%;transform:rotate(-28deg)}
.ucard .v{position:relative;font-size:38px;line-height:1;text-shadow:2px 2px 0 rgba(0,0,0,.25)}
.ucard .c1,.ucard .c2{position:absolute;font-size:15px;color:#fff;line-height:1}
.ucard .c1{top:5px;left:7px}.ucard .c2{bottom:5px;right:7px;transform:rotate(180deg)}
.ucard.r{background:#d72631}.ucard.g{background:#239b56}.ucard.b{background:#1f6fd1}.ucard.y{background:#f2b705}
.ucard.r .v{color:#d72631}.ucard.g .v{color:#239b56}.ucard.b .v{color:#1f6fd1}.ucard.y .v{color:#e0a400}
.ucard.w{background:#151515}
.ucard.w .ov{background:conic-gradient(#d72631 0 25%,#1f6fd1 0 50%,#239b56 0 75%,#f2b705 0)}
.ucard.w .v{color:#fff;text-shadow:2px 2px 0 #000}
.ucard.back{background:#151515}
.ucard.back .ov{background:#d72631}
.ucard.back .v{color:#ffd54a;font-size:15px;text-shadow:2px 2px 0 #000;transform:rotate(-28deg)}
.ucard.big{width:96px;height:142px}.ucard.big .v{font-size:50px}
.hand{display:flex;overflow-x:auto;padding:16px 10px 10px;gap:0;scroll-snap-type:x proximity}
.hand .ucard{margin-left:-22px;transition:transform .15s;cursor:pointer}
.hand .ucard:first-child{margin-left:0}
.hand .ucard.ok{transform:translateY(-12px);box-shadow:0 0 0 3px #ffd54a,0 6px 12px rgba(0,0,0,.5)}
.hand .ucard.no{filter:brightness(.6)}
.colorPick{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%}
.colorPick button{height:70px;border-radius:14px}
.unoMsg{text-align:center;font-family:'Lalezar';font-size:22px;min-height:30px;color:#ffd54a}
.curColor{width:22px;height:22px;border-radius:50%;border:3px solid #fff;display:inline-block;vertical-align:middle}
`;
document.head.appendChild(css);

function seatsUI(box, key, cols, names) {
  S[key] = S[key] || cols.map((c, i) => ({ on: i < 2 || (S.players.length > i), kind: 'h', name: S.players[i] || names[i] }));
  box.innerHTML = ''; box.appendChild(el('h2', '', 'اللاعبين'));
  const list = el('div', 'seats');
  S[key].forEach((st, i) => {
    const r = el('div', 'seat'); const sw = el('span', 'sw2'); sw.style.background = cols[i];
    const inp = el('input'); inp.type = 'text'; inp.value = st.name; inp.maxLength = 14; inp.oninput = () => { st.name = inp.value.trim() || names[i]; save(); };
    const sel = el('select'); [['h', '🙋 لاعب'], ['c', '🤖 كمبيوتر'], ['off', '— بدون']].forEach(([v, l]) => { const o = el('option', '', l); o.value = v; sel.appendChild(o); });
    sel.value = st.on ? st.kind : 'off'; sel.onchange = () => { if (sel.value === 'off') st.on = false; else { st.on = true; st.kind = sel.value; } save(); };
    r.append(sw, inp, sel); list.appendChild(r);
  });
  box.appendChild(list);
}

const SP = () => window.__fast ? 0.02 : 1;
/* =================================================================
   🎲 لودو
   ================================================================= */
const ldS = mkScreen('ludoSetup', '🎲 لودو');
const ldP = mkScreen('ludo', '🎲 لودو');
const LC = ['#d72631', '#239b56', '#f2b705', '#1f6fd1'];   // أحمر، أخضر، أصفر، أزرق
const LCL = ['#f6c5c8', '#c4ead2', '#fbe7a8', '#c5daf6'];
const LNAME = ['الأحمر', 'الأخضر', 'الأصفر', 'الأزرق'];
const TRACK = [];
(function () {
  const seg = (r0, c0, dr, dc, n) => { for (let k = 0; k < n; k++) TRACK.push([r0 + dr * k, c0 + dc * k]); };
  seg(6, 1, 0, 1, 5); seg(5, 6, -1, 0, 6); seg(0, 7, 0, 1, 2); seg(1, 8, 1, 0, 5); seg(6, 9, 0, 1, 6); seg(7, 14, 1, 0, 2);
  seg(8, 13, 0, -1, 5); seg(9, 8, 1, 0, 6); seg(14, 7, 0, -1, 2); seg(13, 6, -1, 0, 5); seg(8, 5, 0, -1, 6); seg(7, 0, -1, 0, 2);
})();
const START = [0, 13, 26, 39], SAFE = [0, 8, 13, 21, 26, 34, 39, 47];
const HOMECOL = [k => [7, 1 + k], k => [1 + k, 7], k => [7, 13 - k], k => [13 - k, 7]];
const YARD = [[[1.9, 1.9], [1.9, 4.1], [4.1, 1.9], [4.1, 4.1]], [[1.9, 10.9], [1.9, 13.1], [4.1, 10.9], [4.1, 13.1]], [[10.9, 10.9], [10.9, 13.1], [13.1, 10.9], [13.1, 13.1]], [[10.9, 1.9], [10.9, 4.1], [13.1, 1.9], [13.1, 4.1]]];
const FIN = [[7.5, 6.5], [6.5, 7.5], [7.5, 8.5], [8.5, 7.5]];
let LD = null;
function ludoSetup() {
  const b = ldS.body; b.innerHTML = '';
  const box = el('div', 'box'); seatsUI(box, 'ludoSeats', LC, LNAME); b.appendChild(box);
  const err = el('div', 'err', ''); b.appendChild(err);
  setBtns2(ldS.row, [btn('ابدأ 🎲', '', () => { const on = S.ludoSeats.map((s, i) => s.on ? i : -1).filter(i => i >= 0); if (on.length < 2) { err.textContent = 'لازم لاعبين على الأقل'; return; } ludoStart(on); })]);
  show('ludoSetup');
}
function ludoStart(on) {
  LD = { seats: on, pl: {}, ti: 0, roll: null, busy: false, sixes: 0, winners: [] };
  on.forEach(c => LD.pl[c] = { name: S.ludoSeats[c].name, bot: S.ludoSeats[c].kind === 'c', tok: [-1, -1, -1, -1] });
  ludoDrawUI(); show('ludo'); ludoTurnStart();
}
const cur = () => LD.seats[LD.ti];
function cellOf(c, s) { if (s < 0) return null; if (s <= 50) return TRACK[(START[c] + s) % 52]; if (s <= 55) return HOMECOL[c](s - 51); return null; }
function ludoSVG() {
  const D = (c, l) => `<linearGradient id="${c}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${l[0]}"/><stop offset="1" stop-color="${l[1]}"/></linearGradient>`;
  const LG = [['#ff5a5f', '#b3121d'], ['#3ccf7c', '#157a40'], ['#ffd34d', '#d49a00'], ['#4a9bff', '#174fa6']];
  let g = '<svg viewBox="-0.4 -0.4 15.8 15.8" xmlns="http://www.w3.org/2000/svg"><defs>';
  LG.forEach((l, i) => { g += D('qg' + i, l); g += `<linearGradient id="pg${i}" x1="0" x2="1"><stop offset="0" stop-color="${shade(LC[i], 0.55)}"/><stop offset=".35" stop-color="${shade(LC[i], 1.25)}"/><stop offset=".6" stop-color="${LC[i]}"/><stop offset="1" stop-color="${shade(LC[i], 0.35)}"/></linearGradient><radialGradient id="ph${i}" cx="35%" cy="30%"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="${shade(LC[i], 1.25)}"/><stop offset="1" stop-color="${shade(LC[i], 0.4)}"/></radialGradient>`; });
  g += '<linearGradient id="wood" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#a8703f"/><stop offset=".5" stop-color="#7a4a24"/><stop offset="1" stop-color="#5a3317"/></linearGradient>';
  g += '<radialGradient id="yd"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#e9e2d2"/></radialGradient></defs>';
  g += '<rect x="-0.4" y="-0.4" width="15.8" height="15.8" rx=".7" fill="url(#wood)"/><rect x="-0.05" y="-0.05" width="15.1" height="15.1" rx=".35" fill="#fffdf6" stroke="#3a220f" stroke-width=".08"/>';
  [[0, 0], [0, 9], [9, 9], [9, 0]].forEach(([r, c], i) => {
    g += `<rect x="${c + .1}" y="${r + .1}" width="5.8" height="5.8" rx=".55" fill="url(#qg${i})" stroke="rgba(0,0,0,.35)" stroke-width=".06"/>`;
    g += `<rect x="${c + .85}" y="${r + .85}" width="4.3" height="4.3" rx=".9" fill="url(#yd)" stroke="rgba(0,0,0,.25)" stroke-width=".06"/>`;
    YARD[i].forEach(([yr, yc]) => g += `<circle cx="${yc}" cy="${yr}" r=".66" fill="${LCL[i]}" stroke="${LC[i]}" stroke-width=".12"/><circle cx="${yc}" cy="${yr}" r=".4" fill="none" stroke="rgba(255,255,255,.8)" stroke-width=".05"/>`);
  });
  const STAR = (cx, cy, r, col) => { let p = ''; for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r * .45 : r; p += (cx + Math.cos(a) * rr).toFixed(3) + ',' + (cy + Math.sin(a) * rr).toFixed(3) + ' '; } return `<polygon points="${p}" fill="${col}"/>`; };
  TRACK.forEach(([r, c], idx) => {
    const si = START.indexOf(idx);
    g += `<rect x="${c + .05}" y="${r + .05}" width=".9" height=".9" rx=".14" fill="${si >= 0 ? `url(#qg${si})` : '#fff'}" stroke="#cbbf9f" stroke-width=".05"/>`;
    if (SAFE.includes(idx) && si < 0) g += STAR(c + .5, r + .5, .32, '#c9b98f');
    if (si >= 0) g += STAR(c + .5, r + .5, .3, '#fff');
  });
  for (let i = 0; i < 4; i++) for (let k = 0; k < 5; k++) { const [r, c] = HOMECOL[i](k); g += `<rect x="${c + .05}" y="${r + .05}" width=".9" height=".9" rx=".14" fill="url(#qg${i})" stroke="rgba(0,0,0,.2)" stroke-width=".05"/>`; }
  g += `<polygon points="6,6 7.5,7.5 6,9" fill="url(#qg0)"/><polygon points="6,6 9,6 7.5,7.5" fill="url(#qg1)"/><polygon points="9,6 9,9 7.5,7.5" fill="url(#qg2)"/><polygon points="6,9 9,9 7.5,7.5" fill="url(#qg3)"/>`;
  g += '<rect x="6" y="6" width="3" height="3" fill="none" stroke="rgba(0,0,0,.3)" stroke-width=".06"/><circle cx="7.5" cy="7.5" r=".55" fill="#fffdf6" stroke="rgba(0,0,0,.3)" stroke-width=".06"/><text x="7.5" y="7.78" font-size=".7" text-anchor="middle">🏠</text>';
  g += '<g id="toks"></g></svg>';
  return g;
}
// بيدق 3D: قاعدة + جسم + راس، بتدرج ولمعة
function pawn(c, x, y, s, glow) {
  const k = s || 1;
  return `<g transform="translate(${x},${y}) scale(${k})">` + (glow ? `<ellipse cx="0" cy=".3" rx=".46" ry=".18" fill="#ffd54a" opacity=".85"><animate attributeName="opacity" values=".9;.3;.9" dur="1s" repeatCount="indefinite"/></ellipse>` : '') +
    `<ellipse cx=".05" cy=".33" rx=".33" ry=".1" fill="rgba(0,0,0,.35)"/>` +
    `<path d="M-.3 .28 Q-.3 .16 -.18 .12 Q-.08 .02 -.1 -.12 L.1 -.12 Q.08 .02 .18 .12 Q.3 .16 .3 .28 Z" fill="url(#pg${c})" stroke="rgba(0,0,0,.55)" stroke-width=".035"/>` +
    `<ellipse cx="0" cy=".28" rx=".3" ry=".08" fill="url(#pg${c})" stroke="rgba(0,0,0,.55)" stroke-width=".03"/>` +
    `<ellipse cx="0" cy="-.12" rx=".14" ry=".05" fill="${shade(LC[c], .7)}"/>` +
    `<circle cx="0" cy="-.26" r=".17" fill="url(#ph${c})" stroke="rgba(0,0,0,.55)" stroke-width=".035"/></g>`;
}
function ludoDrawUI() {
  const b = ldP.body; b.innerHTML = '';
  const bar = el('div', 'ludoBar'); const who = el('div', 'who', ''); who.id = 'ldWho';
  const cv = el('canvas'); cv.id = 'ldDie'; const dpr = window.devicePixelRatio || 1; cv.width = 100 * dpr; cv.height = 100 * dpr; cv.onclick = ludoRoll;
  bar.append(who, cv);
  const wrap = el('div', 'ludoWrap'); wrap.innerHTML = ludoSVG();
  const msg = el('div', 'sub', ''); msg.id = 'ldMsg';
  b.append(bar, wrap, msg);
  window.DIE.draw(cv, 6);
  setBtns2(ldP.row, [btn('ارمي النرد 🎲', '', ludoRoll)]);
  ludoTokens();
}
function ludoTokens(movable) {
  const gEl = document.getElementById('toks'); if (!gEl) return; let g = '';
  const occ = {};
  LD.seats.forEach(c => LD.pl[c].tok.forEach((s, t) => { let pos; if (s < 0) pos = YARD[c][t]; else if (s >= 56) pos = FIN[c]; else { const [r, cc] = cellOf(c, s); pos = [r + .5, cc + .5]; } const key = pos.join(','); (occ[key] = occ[key] || []).push([c, t, pos]); }));
  const items = [];
  Object.values(occ).forEach(list => list.forEach(([c, t, pos], k) => {
    const off = list.length > 1 ? (k - (list.length - 1) / 2) * .24 : 0;
    const can = movable && c === cur() && movable.includes(t);
    items.push({ y: pos[0] + off * .3, svg: `<g class="tok${can ? ' can' : ''}" data-c="${c}" data-t="${t}">` + pawn(c, pos[1] + off, pos[0] + off * .3 - .05, list.length > 2 ? .75 : .95, can) + `<rect x="${pos[1] + off - .45}" y="${pos[0] - .55}" width=".9" height="1.05" fill="transparent"/></g>` });
  }));
  items.sort((a, b) => a.y - b.y).forEach(i => g += i.svg);
  gEl.innerHTML = g;
  gEl.querySelectorAll('.tok').forEach(t => t.addEventListener('click', () => { const c = +t.dataset.c, k = +t.dataset.t; if (LD.waitPick && c === cur() && LD.movable.includes(k)) ludoMove(k); }));
}
function ludoTurnStart() {
  const c = cur(), p = LD.pl[c];
  const who = $('ldWho'); who.textContent = 'دور ' + p.name + (p.bot ? ' 🤖' : ''); who.style.color = LC[c];
  $('ldMsg').textContent = p.bot ? '' : 'اضغط على النرد';
  LD.roll = null; LD.waitPick = false; LD.busy = false;
  ldP.row.querySelector('button').disabled = p.bot;
  if (p.bot) setTimeout(ludoRoll, 700 * SP());
}
function legal(c, v) { const P = LD.pl[c]; return P.tok.map((s, t) => { if (s >= 56) return -1; if (s < 0) return v === 6 ? t : -1; return s + v <= 56 ? t : -1; }).filter(t => t >= 0); }
function ludoRoll() {
  if (!LD || LD.busy || LD.roll !== null || !$('ludo').classList.contains('on')) return; LD.busy = true;
  const v = 1 + rnd(6);
  window.DIE.roll($('ldDie'), v, () => {
    LD.roll = v; const c = cur(), mv = legal(c, v); LD.movable = mv;
    if (v === 6) LD.sixes++; else LD.sixes = 0;
    if (LD.sixes === 3) { $('ldMsg').textContent = '٣ ستات ورا بعض! يروح الدور 😅'; LD.sixes = 0; return setTimeout(ludoNext, 1200 * SP()); }
    if (!mv.length) { $('ldMsg').textContent = 'طلع ' + v + '، ما فيه حركة'; return setTimeout(() => v === 6 ? ludoAgain() : ludoNext(), 1100 * SP()); }
    LD.busy = false;
    if (LD.pl[c].bot) { LD.waitPick = true; ludoTokens(mv); return setTimeout(() => ludoMove(botPick(c, v, mv)), 600 * SP()); }
    const uniq = [...new Set(mv.map(t => LD.pl[c].tok[t]))];
    if (uniq.length === 1) { LD.waitPick = true; return ludoMove(mv[0]); }
    LD.waitPick = true; $('ldMsg').textContent = 'طلع ' + v + ' — اختار القطعة اللي تتحرك'; ludoTokens(mv);
  });
}
function botPick(c, v, mv) {
  const P = LD.pl[c]; let best = mv[0], bs = -1e9;
  mv.forEach(t => { const s = P.tok[t], ns = s < 0 ? 0 : s + v; let sc = ns; if (ns === 56) sc += 100; if (s < 0) sc += 60; const cell = ns <= 50 ? (START[c] + ns) % 52 : -1;
    if (cell >= 0 && !SAFE.includes(cell)) LD.seats.forEach(o => { if (o !== c) LD.pl[o].tok.forEach(os => { if (os >= 0 && os <= 50 && (START[o] + os) % 52 === cell) sc += 80; }); });
    if (cell >= 0 && SAFE.includes(cell)) sc += 15; if (sc > bs) { bs = sc; best = t; } });
  return best;
}
function ludoMove(t) {
  if (!LD.waitPick || !$('ludo').classList.contains('on')) return; LD.waitPick = false; LD.busy = true;
  const c = cur(), P = LD.pl[c], v = LD.roll; const from = P.tok[t];
  const steps = from < 0 ? 1 : v; let k = 0;
  const step = () => {
    if (from < 0) P.tok[t] = 0; else P.tok[t]++;
    if (window.SFX) SFX.step(); ludoTokens(); k++;
    if (k < steps) return setTimeout(step, 140 * SP());
    let extra = v === 6, msg = '';
    const s = P.tok[t];
    if (s <= 50) { const cell = (START[c] + s) % 52; if (!SAFE.includes(cell)) LD.seats.forEach(o => { if (o === c) return; LD.pl[o].tok.forEach((os, ot) => { if (os >= 0 && os <= 50 && (START[o] + os) % 52 === cell) { LD.pl[o].tok[ot] = -1; extra = true; msg = '💥 ' + P.name + ' أكل قطعة ' + LD.pl[o].name + '!'; beep(180, .4, .3); buzz(200); } }); }); }
    if (s === 56) { extra = true; msg = '🏠 قطعة وصلت البيت!'; if (window.SFX) SFX.home(); }
    if (msg && msg.indexOf('💥') >= 0 && window.SFX) SFX.capture();
    ludoTokens(); $('ldMsg').textContent = msg;
    if (P.tok.every(x => x >= 56)) { LD.winners.push(c); return ludoWin(c); }
    setTimeout(() => extra ? ludoAgain() : ludoNext(), msg ? 900 : 350);
  };
  step();
}
function ludoAgain() { LD.roll = null; LD.busy = false; const p = LD.pl[cur()]; $('ldMsg').textContent = (p.bot ? '' : 'ارمي مرة ثانية! 🎲'); if (p.bot) setTimeout(ludoRoll, 600 * SP()); }
function ludoNext() { LD.sixes = 0; do { LD.ti = (LD.ti + 1) % LD.seats.length; } while (LD.winners.includes(cur()) && LD.winners.length < LD.seats.length); ludoTurnStart(); }
function ludoWin(c) {
  $('ldMsg').innerHTML = ''; const w = el('div', 'win good', '🏆 ' + LD.pl[c].name + ' فاز!'); w.style.color = LC[c]; $('ldMsg').appendChild(w); beep(1200, .3);
  setBtns2(ldP.row, [btn('تعديل', 'ghost', ludoSetup), btn('لعبة جديدة 🔄', '', () => ludoStart(LD.seats), 2)]);
}

/* =================================================================
   🃏 أونو
   ================================================================= */
const unS = mkScreen('unoSetup', '🃏 أونو');
const unP = mkScreen('uno', '🃏 أونو');
const UC = { r: 'الأحمر', g: 'الأخضر', b: 'الأزرق', y: 'الأصفر' };
const UCOL = { r: '#d72631', g: '#239b56', b: '#1f6fd1', y: '#f2b705' };
let UN = null;
function newDeck() { const d = []; for (const c of 'rgby') { d.push({ c, v: '0' }); for (let n = 1; n <= 9; n++) d.push({ c, v: '' + n }, { c, v: '' + n }); for (const a of ['skip', 'rev', '+2']) d.push({ c, v: a }, { c, v: a }); } for (let i = 0; i < 4; i++) d.push({ c: 'w', v: 'wild' }, { c: 'w', v: '+4' }); return shuffle(d); }
const sym = v => ({ skip: '⊘', rev: '⇄', '+2': '+2', wild: '★', '+4': '+4' }[v] || v);
function cardEl(card, big) {
  const d = el('div', 'ucard ' + card.c + (big ? ' big' : ''));
  d.append(el('div', 'ov'), el('div', 'v', sym(card.v)), el('div', 'c1', sym(card.v)), el('div', 'c2', sym(card.v)));
  if (card.c === 'w' && card.chosen) d.style.boxShadow = '0 0 0 4px ' + UCOL[card.chosen] + ',0 4px 10px rgba(0,0,0,.45)';
  return d;
}
function backEl() { const d = el('div', 'ucard back'); d.append(el('div', 'ov'), el('div', 'v', 'تقزيرة')); return d; }
function unoSetup() {
  const b = unS.body; b.innerHTML = '';
  const box = el('div', 'box'); seatsUI(box, 'unoSeats', ['#d72631', '#1f6fd1', '#239b56', '#f2b705'], ['لاعب ١', 'لاعب ٢', 'لاعب ٣', 'لاعب ٤']); b.appendChild(box);
  const err = el('div', 'err', ''); b.appendChild(err);
  setBtns2(unS.row, [btn('ابدأ 🃏', '', () => { const on = S.unoSeats.filter(s => s.on); if (on.length < 2) { err.textContent = 'لازم لاعبين على الأقل'; return; } UN = { score: {} }; on.forEach(s => UN.score[s.name] = 0); unoDeal(on); })]);
  show('unoSetup');
}
function unoDeal(on) {
  Object.assign(UN, { deck: newDeck(), pile: [], dir: 1, ti: 0, pl: on.map(s => ({ name: s.name, bot: s.kind === 'c', hand: [] })), drew: false, lastHuman: null, msg: '' });
  UN.pl.forEach(p => { for (let i = 0; i < 7; i++) p.hand.push(UN.deck.pop()); });
  let top; do { top = UN.deck.pop(); if (top.c === 'w' || isNaN(+top.v)) UN.deck.unshift(top); } while (top.c === 'w' || isNaN(+top.v));
  UN.pile.push(top); UN.color = top.c; UN.ti = rnd(UN.pl.length); show('uno'); unoTurn();
}
const topCard = () => UN.pile[UN.pile.length - 1];
const playable = c => c.c === 'w' || c.c === UN.color || c.v === topCard().v;
function drawCard(p) { if (!UN.deck.length) { const t = UN.pile.pop(); UN.deck = shuffle(UN.pile.map(c => ({ c: c.c, v: c.v }))); UN.pile = [t]; } if (UN.deck.length) p.hand.push(UN.deck.pop()); }
function nextIdx(k) { const n = UN.pl.length; return ((UN.ti + UN.dir * (k || 1)) % n + n) % n; }
const humans = () => UN.pl.filter(p => !p.bot).length;
function unoTurn() {
  if (!$('uno').classList.contains('on')) return;
  const p = UN.pl[UN.ti]; UN.drew = false;
  if (!p.bot && humans() > 1 && UN.lastHuman !== UN.ti) return unoPass(p);
  unoDraw();
  if (p.bot) setTimeout(unoBot, 900 * SP());
}
function unoPass(p) {
  const b = unP.body; b.innerHTML = ''; const c = el('div', 'bigcard');
  c.append(el('div', 'lab', 'عط التلفون لـ'), el('div', 'nm', p.name), el('div', 'lab', 'وخل الباقين ما يشوفون ورقك 🤫'));
  if (UN.msg) c.append(el('div', 'lab', UN.msg));
  const tc = cardEl(topCard()); tc.style.margin = '6px auto'; c.appendChild(tc);
  b.appendChild(c);
  setBtns2(unP.row, [btn('أني ' + p.name + '، وريني ورقي 👀', '', () => { UN.lastHuman = UN.ti; unoDraw(); })]);
}
function unoDraw() {
  const p = UN.pl[UN.ti], me = p.bot ? (UN.pl.find(x => !x.bot) || p) : p;
  const b = unP.body; b.innerHTML = ''; const t = el('div', 'unoTable'); b.appendChild(t);
  const ops = el('div', 'opps');
  UN.pl.forEach((o, i) => { if (o === me) return; const d = el('div', 'opp' + (i === UN.ti ? ' turn' : '')); d.append(el('div', '', o.name + (o.bot ? ' 🤖' : '') + ' · ' + o.hand.length)); const mini = el('div', 'mini'); for (let k = 0; k < Math.min(o.hand.length, 10); k++) mini.appendChild(el('i')); d.appendChild(mini); ops.appendChild(d); });
  t.appendChild(ops);
  const ctr = el('div', 'center');
  const dk = backEl(); dk.style.cursor = 'pointer'; dk.onclick = () => unoHumanDraw();
  const tc = cardEl(topCard(), true);
  ctr.append(dk, tc); t.appendChild(ctr);
  const cc = el('div', 'unoMsg'); cc.innerHTML = 'اللون: <span class="curColor" style="background:' + UCOL[UN.color] + '"></span> ' + UC[UN.color] + ' · ' + (UN.dir > 0 ? '↺' : '↻'); t.appendChild(cc);
  const msg = el('div', 'unoMsg', UN.msg || ''); msg.id = 'unMsg'; t.appendChild(msg);
  const isMine = !p.bot;
  const hd = el('div', 'unoMsg', (isMine ? 'ورقك يا ' : 'ورق ') + me.name + ' (' + me.hand.length + ')'); hd.style.fontSize = '16px'; hd.style.color = '#fff'; t.appendChild(hd);
  const hand = el('div', 'hand');
  me.hand.forEach((card, i) => { const ok = isMine && playable(card); const d = cardEl(card); if (isMine) d.classList.add(ok ? 'ok' : 'no'); if (ok) d.onclick = () => unoPlay(i); hand.appendChild(d); });
  t.appendChild(hand);
  if (!isMine) { setBtns2(unP.row, [btn('🤖 ' + p.name + ' يلعب…', 'ghost', () => { })]); unP.row.querySelector('button').disabled = true; return; }
  const any = p.hand.some(playable);
  if (UN.drew) setBtns2(unP.row, [btn('مرر الدور ⏭️', 'ghost', () => { UN.msg = p.name + ' سحب ومرر'; unoAdvance(1); })]);
  else setBtns2(unP.row, [btn(any ? 'اسحب ورقة 🃏' : 'ما عندك لعب، اسحب ورقة 🃏', any ? 'ghost' : '', unoHumanDraw)]);
}
function unoHumanDraw() { const p = UN.pl[UN.ti]; if (p.bot || UN.drew) return; drawCard(p); UN.drew = true; if (window.SFX) SFX.deal(1); UN.msg = ''; if (!p.hand.some(playable)) { UN.msg = p.name + ' سحب ومرر'; unoDraw(); return setTimeout(() => unoAdvance(1), 700 * SP()); } unoDraw(); }
function unoPlay(i, chosen) {
  const p = UN.pl[UN.ti], card = p.hand[i];
  if (card.c === 'w' && !chosen) return unoPickColor(i);
  p.hand.splice(i, 1); const pc = { c: card.c, v: card.v }; if (card.c === 'w') pc.chosen = chosen; UN.pile.push(pc);
  UN.color = card.c === 'w' ? chosen : card.c; if (window.SFX) { SFX.flip(); if (/\+|skip|rev/.test(card.v)) SFX.pop(); }
  UN.msg = p.name + ' لعب ' + sym(card.v) + (card.c === 'w' ? ' واختار ' + UC[chosen] : '');
  if (p.hand.length === 1) { UN.msg += ' — أونو! 📢'; if (window.SFX) SFX.uno(); buzz(80); }
  if (!p.hand.length) return unoWin(p);
  let skip = 1;
  if (card.v === 'skip') { skip = 2; UN.msg += ' · ' + UN.pl[nextIdx()].name + ' انحرم من دوره'; }
  else if (card.v === 'rev') { if (UN.pl.length === 2) skip = 2; else UN.dir *= -1; }
  else if (card.v === '+2' || card.v === '+4') { const n = UN.pl[nextIdx()]; const k = card.v === '+2' ? 2 : 4; for (let j = 0; j < k; j++) drawCard(n); UN.msg += ' · ' + n.name + ' سحب ' + k; skip = 2; }
  unoAdvance(skip);
}
function unoPickColor(i) {
  const t = unP.body.querySelector('.unoTable'); const box = el('div', 'colorPick'); box.style.marginTop = '10px';
  'rgby'.split('').forEach(c => { const b = btn(UC[c], '', () => unoPlay(i, c)); b.style.background = UCOL[c]; box.appendChild(b); });
  t.appendChild(el('div', 'unoMsg', 'اختار اللون')); t.appendChild(box); box.scrollIntoView({ behavior: 'smooth' });
}
function unoAdvance(k) { UN.ti = nextIdx(k); setTimeout(unoTurn, 250 * SP()); }
function unoBot() {
  if (!$('uno').classList.contains('on')) return;
  const p = UN.pl[UN.ti]; if (!p.bot) return;
  let opts = p.hand.map((c, i) => [c, i]).filter(([c]) => playable(c));
  if (!opts.length) { drawCard(p); opts = p.hand.map((c, i) => [c, i]).filter(([c]) => playable(c)); if (!opts.length) { UN.msg = p.name + ' سحب ومرر'; unoDraw(); return setTimeout(() => unoAdvance(1), 700 * SP()); } }
  const rank = c => c.c === 'w' ? (c.v === '+4' ? 1 : 2) : (isNaN(+c.v) ? 6 : 5);
  opts.sort((a, b) => rank(b[0]) - rank(a[0]));
  const [card, i] = opts[0]; let chosen;
  if (card.c === 'w') { const cnt = { r: 0, g: 0, b: 0, y: 0 }; p.hand.forEach(c => { if (c.c !== 'w') cnt[c.c]++; }); chosen = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0]; }
  unoPlay(i, chosen);
}
function unoWin(p) {
  let pts = 0; UN.pl.forEach(o => o.hand.forEach(c => pts += c.c === 'w' ? 50 : isNaN(+c.v) ? 20 : +c.v));
  UN.score[p.name] = (UN.score[p.name] || 0) + pts;
  const b = unP.body; b.innerHTML = ''; const c = el('div', 'bigcard');
  c.append(el('div', 'win good', '🏆 ' + p.name + ' فاز!'), el('div', 'lab', '+' + pts + ' نقطة من ورق الباقين'));
  const r = el('div', 'reslist'); Object.entries(UN.score).sort((a, b) => b[1] - a[1]).forEach(([n, v]) => { const d = el('div', ''); d.append(el('span', '', n), el('b', '', v)); r.appendChild(d); }); c.appendChild(r);
  b.appendChild(c); beep(1200, .3);
  setBtns2(unP.row, [btn('تعديل', 'ghost', unoSetup), btn('جولة جديدة 🔄', '', () => unoDeal(S.unoSeats.filter(s => s.on)), 2)]);
}

/* ---------- تسجيل ---------- */
const k = GAMES.findIndex(g => g.id === 'xo');
GAMES.splice(k + 1, 0, { id: 'ludo', e: '🎲', n: 'لودو', d: '٢ لين ٤، وفيه كمبيوتر', min: 0, t: '٢٠ دقيقة' }, { id: 'uno', e: '🃏', n: 'أونو', d: 'لعبة الورق الملوّن، وفيه كمبيوتر', min: 0, t: '١٥ دقيقة' });
Object.assign(RULES, {
  ludo: ['اختاروا الألوان: كل لون لاعب أو 🤖 كمبيوتر أو بدون.', 'ارمِ النرد: لازم يطلع ٦ عشان تطلّع قطعة من البيت.', 'تمشي القطعة على الطريق باتجاه عقارب الساعة، وبعدين تدخل الممر الملوّن حقها لين المثلث بالنص.', 'إدا وقفت على قطعة خصمك ترجّعها لبيتها وتلعب مرة ثانية. المربعات اللي فيها ★ والبدايات آمنة.', 'إدا طلع ٦ أو وصلت قطعة للبيت أو أكلت قطعة، تلعب مرة ثانية. لكن ٣ ستات ورا بعض يروح عليك الدور.', 'لازم الرقم يكون بالضبط عشان توصل النهاية. أول واحد يوصّل قطعه الأربع يفوز.'],
  uno: ['كل واحد ياخد ٧ أوراق. لازم تنزل ورقة بنفس اللون أو نفس الرقم أو الرمز اللي فوق.', 'الأوراق الخاصة: ⊘ يحرم اللي بعدك من دوره، ⇄ يعكس الاتجاه، +2 اللي بعدك يسحب ورقتين ويروح دوره.', '★ تختار فيها أي لون، و+4 تختار اللون واللي بعدك يسحب ٤ ويروح دوره.', 'إدا ما عندك لعب، اسحب ورقة. إدا تنفع تقدر تلعبها، وإلا يمر الدور.', 'إدا لاعبين على نفس التلفون، يطلع لكم شاشة "عط التلفون لـ" عشان محد يشوف ورق الثاني.', 'أول واحد يخلص ورقه يفوز، وياخد نقاط ورق الباقين (الرقم بقيمته، الخاصة ٢٠، الملونة ٥٠).']
});
Object.assign(window.EXTRA, { ludo: ludoSetup, uno: unoSetup });
window.LUDO = { svg: ludoSVG, pawn, TRACK, START, SAFE, HOMECOL, YARD, FIN, LC, cellOf };
window.UNOK = { newDeck, sym, cardEl, backEl, UC, UCOL };
window.__tb = () => ({ LD, UN, TRACK, legal, cellOf });
renderHome();
})();
