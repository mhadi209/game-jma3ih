/* ===== تقزيرة: بار الكذابين (جوال واحد مع كمبيوتر + أونلاين) =====
   ورق اللعبة: ٦ ملك، ٦ ملكة، ٦ آص، و٢ جوكر. الطاولة تختار ورقة، وكل واحد ينزل ١-٣ أوراق ويقول إنها منها.
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
.pcard{width:58px;height:84px;border-radius:9px;background:linear-gradient(160deg,#fffdf6,#efe3c6);border:2px solid #2b1d12;color:#2b1d12;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;box-shadow:0 3px 6px rgba(0,0,0,.45);font-family:'Lalezar','Tajawal';user-select:none;-webkit-user-select:none;flex:none;transition:transform .15s}
.pcard .e{font-size:28px;line-height:1}.pcard .t{font-size:13px}
.pcard .cr{position:absolute;top:3px;right:5px;font-size:12px}
.pcard.J{background:linear-gradient(160deg,#2b1d12,#5a3b20);color:#ffd54a}
.pcard.back{background:repeating-linear-gradient(45deg,#7a1f15 0 6px,#9a2b20 6px 12px);border-color:#fff}
.pcard.sel{transform:translateY(-14px);box-shadow:0 0 0 3px #ffd54a,0 6px 10px rgba(0,0,0,.5)}
.pcard.lie{box-shadow:0 0 0 4px #e53935}.pcard.true{box-shadow:0 0 0 4px #2ecc71}
.lbHand{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;padding-top:16px}
.lbMsg{text-align:center;font-family:'Lalezar';font-size:20px;color:#ffd54a;min-height:28px}
.bomb2{font-size:70px;line-height:1;text-align:center}
.bomb2.shake{animation:shake .15s infinite}
`;
document.head.appendChild(css);

/* ---------- المحرك ---------- */
const CARD = { K: ['👑', 'ملك'], Q: ['👸', 'ملكة'], A: ['⭐', 'آص'], J: ['🃏', 'جوكر'] };
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
  g.msg = p.name + ' نزّل ' + cards.length + ' ' + CARD[g.table][1] + (cards.length > 1 ? ' (يقول)' : ' (يقول)');
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
function pcard(c, cls) { const d = el('div', 'pcard ' + (c || 'back') + (cls ? ' ' + cls : '')); if (c) { d.append(el('div', 'e', CARD[c][0]), el('div', 't', CARD[c][1])); } return d; }

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
  if (p.bot) setTimeout(() => { if (!$('liars').classList.contains('on')) return; lbBot(LB); beep(LB.phase === 'reveal' ? 300 : 700, .06); liarsTurn(); }, (window.__fast ? 20 : 1300));
}
function liarsPass(p) {
  const b = lP.body; b.innerHTML = ''; const c = el('div', 'bigcard');
  c.append(el('div', 'lab', 'عط الجوال لـ'), el('div', 'nm', p.name), el('div', 'lab', 'وخل الباقين ما يشوفون ورقك 🤫'), el('div', 'lab', LB.msg));
  b.appendChild(c); setBtns2(lP.row, [btn('أنا ' + p.name + '، وريني ورقي 👀', '', () => { lastHuman = LB.turn; liarsDraw(); })]);
  show('liars');
}
function tableBox(viewer) {
  const t = el('div', 'lbTable');
  const top = el('div', 'lbTop'); top.append(el('div', 'tc', 'ورقة الطاولة:'), pcard(LB.table)); t.appendChild(top);
  const seats = el('div', 'lbSeats');
  LB.pl.forEach((p, i) => { const d = el('div', 'lbSeat' + (i === LB.turn && LB.phase === 'play' ? ' turn' : '') + (p.alive ? '' : ' dead')); d.append(el('span', '', p.name + ' · ' + p.hand.length + '🂠'), el('span', 'bm', '💣' + '■'.repeat(p.pulls) + '□'.repeat(6 - p.pulls))); seats.appendChild(d); });
  t.appendChild(seats);
  const last = el('div', 'lbLast');
  if (LB.last) { last.appendChild(el('div', '', LB.pl[LB.last.pi].name + ' نزّل ' + LB.last.n + ' ويقول إنها ' + CARD[LB.table][1])); const r = el('div', 'row2'); LB.last.cards.forEach(() => r.appendChild(pcard(null))); last.appendChild(r); }
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
  me.hand.forEach((c, i) => { const d = pcard(c, picked.includes(i) ? 'sel' : ''); if (isMine) d.onclick = () => { if (picked.includes(i)) picked.splice(picked.indexOf(i), 1); else if (picked.length < 3) picked.push(i); else buzz(60); beep(800, .02); liarsDraw(); }; hand.appendChild(d); });
  t.appendChild(hand);
  if (!isMine) { setBtns2(lP.row, [btn('🤖 ' + p.name + ' يفكر…', 'ghost', () => { })]); lP.row.querySelector('button').disabled = true; show('liars'); return; }
  const bs = [];
  if (LB.last && LB.last.pi !== LB.turn) bs.push(btn('كذاب! 🫵', 'red', () => { lbCall(LB, LB.turn); beep(300, .2); liarsTurn(); }));
  if (p.hand.length) { const pb = btn('نزّل ' + (picked.length || '') + ' ' + CARD[LB.table][1] + ' ⬇️', '', () => { if (!picked.length) { buzz(80); return; } lbPlay(LB, LB.turn, picked.slice()); beep(700, .05); liarsTurn(); }, 1.4); pb.disabled = !picked.length; bs.push(pb); }
  setBtns2(lP.row, bs); show('liars');
}
function liarsReveal() {
  const r = LB.res, b = lP.body; b.innerHTML = '';
  const t = tableBox(); b.appendChild(t);
  const last = t.querySelector('.lbLast'); last.innerHTML = '';
  last.appendChild(el('div', '', LB.pl[r.caller].name + ' قال كذاب على ' + LB.pl[r.liar].name + '!'));
  const row = el('div', 'row2'); r.cards.forEach(c => row.appendChild(pcard(c, isOk(c, LB.table) ? 'true' : 'lie'))); last.appendChild(row);
  last.appendChild(el('div', 'lbMsg', r.lie ? '😈 كان يكذب!' : '😇 كان صادق!'));
  const bomb = el('div', 'bomb2 shake', '💣'); t.appendChild(bomb);
  const out = el('div', 'lbMsg', LB.pl[r.loser].name + ' يسحب سلك من قنبلته…'); t.appendChild(out);
  setBtns2(lP.row, []);
  setTimeout(() => {
    bomb.classList.remove('shake');
    if (r.boom) { bomb.textContent = '💥'; out.textContent = 'بوووم! ' + LB.pl[r.loser].name + ' طلع من اللعبة'; beep(100, .8, .35); buzz([300, 100, 400]); }
    else { bomb.textContent = '😮‍💨'; out.textContent = 'نجا ' + LB.pl[r.loser].name + '! (' + LB.pl[r.loser].pulls + ' من ٦ أسلاك)'; beep(1000, .15); }
    setBtns2(lP.row, [btn('كمّل ←', '', () => { lbAfter(LB); lastHuman = -1; liarsTurn(); })]);
    if (LB.pl.every(p => p.bot || !p.alive)) setTimeout(() => { if (LB.phase === 'reveal' && $('liars').classList.contains('on')) { lbAfter(LB); liarsTurn(); } }, window.__fast ? 20 : 1500);
  }, window.__fast ? 20 : 1800);
  show('liars');
}
function liarsOver() {
  const b = lP.body; b.innerHTML = ''; const c = el('div', 'bigcard');
  c.append(el('div', 'bomb2', '🏆'), el('div', 'win good', LB.pl[LB.winner].name + ' فاز!'), el('div', 'lab', 'آخر واحد بقى على الطاولة'));
  b.appendChild(c); beep(1200, .3);
  setBtns2(lP.row, [btn('تعديل', 'ghost', liarsSetup), btn('جولة جديدة 🔄', '', () => { LB = lbNew(shuffle(LB.pl.map(p => ({ id: p.id, name: p.name, bot: p.bot })))); lastHuman = -1; liarsTurn(); }, 2)]);
}

/* ---------- أونلاين ---------- */
window.ONL.renderers.lbtable = (it, c) => {
  const t = el('div', 'lbTable'); t.style.width = '100%';
  const top = el('div', 'lbTop'); top.append(el('div', 'tc', 'ورقة الطاولة:'), pcard(it.table)); t.appendChild(top);
  const seats = el('div', 'lbSeats'); it.seats.forEach(s => { const d = el('div', 'lbSeat' + (s.turn ? ' turn' : '') + (s.dead ? ' dead' : '')); d.append(el('span', '', s.name + ' · ' + s.n + '🂠'), el('span', 'bm', '💣' + '■'.repeat(s.pulls) + '□'.repeat(6 - s.pulls))); seats.appendChild(d); }); t.appendChild(seats);
  const last = el('div', 'lbLast'); last.appendChild(el('div', '', it.lastTxt)); const r = el('div', 'row2'); (it.cards || []).forEach(cc => r.appendChild(cc.c ? pcard(cc.c, cc.k) : pcard(null))); last.appendChild(r); if (it.verdict) last.appendChild(el('div', 'lbMsg', it.verdict)); t.appendChild(last);
  if (it.bomb) { t.appendChild(el('div', 'bomb2', it.bomb)); }
  t.appendChild(el('div', 'lbMsg', it.msg || '')); c.appendChild(t);
};
window.ONL.renderers.lbhand = (it, c, sendAct) => {
  const h = el('div', 'lbHand'); h.style.width = '100%'; const sel = [];
  const pb = btn('نزّل ⬇️', '', () => { if (!sel.length) { buzz(80); return; } pb.disabled = true; sendAct({ a: 'opt', v: sel.join(',') }); }); pb.disabled = true; pb.style.width = '100%';
  it.hand.forEach((cc, i) => { const d = pcard(cc); if (it.can) d.onclick = () => { if (sel.includes(i)) sel.splice(sel.indexOf(i), 1); else if (sel.length < 3) sel.push(i); d.classList.toggle('sel', sel.includes(i)); pb.disabled = !sel.length; pb.textContent = 'نزّل ' + (sel.length || '') + ' ⬇️'; beep(800, .02); }; h.appendChild(d); });
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
      return { title: '🃏 بار الكذابين', items: [Object.assign(base, { t: 'lbtable', lastTxt: g.pl[r.caller].name + ' قال كذاب على ' + g.pl[r.liar].name + '!', cards: r.cards.map(c => ({ c, k: isOk(c, g.table) ? 'true' : 'lie' })), verdict: (r.lie ? '😈 كان يكذب!' : '😇 كان صادق!') + ' — ' + g.pl[r.loser].name + (r.boom ? ' 💥 انفجرت قنبلته وطلع!' : ' سحب سلك ونجا 😮‍💨'), bomb: r.boom ? '💥' : '😮‍💨' })], beep: r.boom ? 120 : 900 };
    }
    const lastTxt = g.last ? g.pl[g.last.pi].name + ' نزّل ' + g.last.n + ' ويقول إنها ' + CARD[g.table][1] : 'ما أحد نزّل للحين';
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
RULES.lb = ['فيه ٢٠ ورقة: ٦ ملك 👑، ٦ ملكة 👸، ٦ آص ⭐، و٢ جوكر 🃏 (الجوكر ينحسب أي ورقة). كل واحد ياخذ ٥ أوراق.', 'كل جولة تطلع "ورقة الطاولة"، مثلاً الملك.', 'بدورك تنزّل ١ لين ٣ أوراق مقلوبة وتقول إنها كلها ملوك. تقدر تقول الصدق… أو تكذب 😏', 'اللي بعدك يا يصدقك وينزّل ورقه، يا يقول "كذاب! 🫵" وتنكشف الأوراق.', 'إذا كنت تكذب أنت تخسر، وإذا كنت صادق اللي اتهمك يخسر. الخسران يسحب سلك من قنبلته 💣 (٦ أسلاك، واحد منها ينفجر).', 'إذا انفجرت قنبلتك تطلع. آخر واحد يبقى يفوز. تقدر تلعب ضد الكمبيوتر 🤖 أو أونلاين وكل واحد ورقه على جواله.'];
window.EXTRA.lb = liarsSetup;
window.__lb = () => ({ LB, lbNew, lbPlay, lbCall, lbAfter, lbBot, isOk });
renderHome();
})();
