/* ===== تقزيرة: سكرابل (حروف عربية أو أرقام ومعادلات) ضد الكمبيوتر أو أونلاين ===== */
(function () {
'use strict';
const { mkScreen, setBtns2, stepper } = window.UI;
const N = 11, CENTER = 5 * N + 5;
const css = document.createElement('style');
css.textContent = `
.scWrap{width:min(96vw,460px);margin:0 auto}
.scBoard{display:grid;grid-template-columns:repeat(${N},1fr);gap:2px;background:#6b4a2a;padding:4px;border-radius:12px;border:3px solid var(--line);box-shadow:var(--sh);direction:ltr}
.scC{aspect-ratio:1;border-radius:4px;background:#efe3c3;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:700;color:rgba(0,0,0,.45);position:relative;cursor:pointer;user-select:none;-webkit-user-select:none}
.scC.DL{background:#a9d4ee}.scC.TL{background:#2f7fc1;color:#fff}.scC.DW{background:#f2b8b2}.scC.TW{background:#d0453a;color:#fff}.scC.ST{background:#f2b8b2;font-size:14px;color:#c0392b}
.sct{position:absolute;inset:0;border-radius:4px;background:linear-gradient(160deg,#ffe9b8,#e8c27a);box-shadow:inset 0 -2px 0 #b98e43,0 1px 2px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;color:#2b1d12;font-family:'Lalezar','Tajawal';font-size:min(5.4vw,24px);line-height:1}
.sct sub{position:absolute;bottom:1px;right:2px;font-size:8px;font-family:'Tajawal';font-weight:700}
.sct.pend{background:linear-gradient(160deg,#fff7c2,#f2d35a);box-shadow:0 0 0 2px #e67e22}
.sct.last{box-shadow:inset 0 -2px 0 #b98e43,0 0 0 2px #2c7a6b}
.scRack{display:flex;gap:5px;justify-content:center;margin:10px 0 4px;min-height:52px;direction:ltr}
.scRack .rt{width:46px;height:50px;position:relative;cursor:pointer;flex:none}
.scRack .rt .sct{font-size:26px}
.scRack .rt.sel .sct{transform:translateY(-8px);box-shadow:0 0 0 3px var(--red),0 4px 6px rgba(0,0,0,.4)}
.scRack .rt.used{opacity:.25;pointer-events:none}
.scRack .rt.ex .sct{background:linear-gradient(160deg,#ddd,#aaa)}
.scScore{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-bottom:8px}
.scScore span{background:var(--paper);border:2px solid var(--line);border-radius:999px;padding:2px 10px;font-weight:700;font-size:13px}
.scScore span.turn{background:var(--yel);color:#2b1d12}
.scMsg{text-align:center;font-weight:700;min-height:22px;font-size:14px;margin:4px 0}
.scBtns{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.scBtns button{font-size:14px;padding:9px 2px}
`;
document.head.appendChild(css);

/* ---------- المربعات المميزة ---------- */
const PREM = Array(N * N).fill('');
const setP = (t, arr) => arr.forEach(([r, c]) => PREM[r * N + c] = t);
setP('TW', [[0, 2], [2, 0], [0, 8], [8, 0], [2, 10], [10, 2], [8, 10], [10, 8]]);
setP('DW', [[1, 1], [1, 9], [9, 1], [9, 9], [3, 3], [3, 7], [7, 3], [7, 7]]);
setP('TL', [[0, 0], [0, 10], [10, 0], [10, 10], [4, 4], [4, 6], [6, 4], [6, 6]]);
setP('DL', [[2, 4], [2, 6], [4, 2], [6, 2], [4, 8], [6, 8], [8, 4], [8, 6], [1, 5], [5, 1], [5, 9], [9, 5]]);
PREM[CENTER] = 'ST';
const PLAB = { DL: '٢ح', TL: '٣ح', DW: '٢ك', TW: '٣ك', ST: '★' };

/* ---------- الحروف والأرقام ---------- */
const AR_BAG = 'ا9:1 ل6:1 ي5:1 م5:1 و5:1 ن4:1 ت4:1 ر4:1 ه3:2 ب3:2 ع3:2 د3:2 س3:2 ة2:2 أ2:2 ف2:3 ق2:3 ك2:3 ح2:3 ى1:3 ج2:4 ش1:4 ص1:5 خ1:5 ز1:5 ط1:5 ء1:5 ذ1:8 ض1:8 ث1:8 غ1:8 ظ1:10';
const MATH_BAG = '0:5:1 1:6:1 2:6:1 3:5:1 4:5:2 5:4:2 6:4:2 7:3:3 8:3:3 9:3:3 +:5:2 −:5:2 ×:4:3 ÷:3:3 =:10:1';
function parseBag(spec, math) {
  const bag = [];
  if (math) spec.split(' ').forEach(tok => { const [c, n, v] = tok.split(':'); for (let i = 0; i < +n; i++) bag.push({ c, v: +v }); });
  else spec.split(' ').forEach(tok => { const m = tok.match(/^(\S)(\d+):(\d+)$/); for (let i = 0; i < +m[2]; i++) bag.push({ c: m[1], v: +m[3] }); });
  return bag;
}
const norm = s => s.replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/ة/g, 'ه');

/* ---------- القاموس ---------- */
const EXTRA_WORDS = `اب ام اخ اخت ابن بنت جد جده عم خال بيت باب دار غرفه سقف جدار ارض سما شمس قمر نجم بحر نهر بر جبل رمل حجر شجر ورد زهر عشب ماء نار هوا ريح مطر برد حر ثلج يوم ليل صبح ظهر عصر مغرب فجر سنه شهر اسبوع ساعه دقيقه وقت عمر اكل شرب نوم لعب قراءه كتابه درس علم عمل شغل مال ذهب فضه حديد خشب ورق قلم كتاب دفتر لوح كرسي طاوله سرير باب شباك مفتاح قفل حبل كيس صندوق علبه كوب صحن قدر سكين ملعقه شوكه خبز رز لحم سمك دجاج بيض حليب لبن جبن زبده عسل سكر ملح فلفل زيت تمر عنب تين موز تفاح خوخ رمان ليمون بطيخ قلب راس عين اذن انف فم سن يد رجل ظهر بطن صدر كتف ركبه اصبع شعر وجه جلد دم عظم روح نفس حب ود فرح حزن خوف امل صبر شكر حمد ذكر صلاه صوم حج زكاه دين علم قران نبي رسول ملك امير شيخ رجل امراه ولد طفل صبي بنت شاب كبير صغير طويل قصير جميل حلو مر حار بارد جديد قديم سهل صعب قريب بعيد كثير قليل ابيض اسود احمر اخضر ازرق اصفر لون شكل خط نقطه دائره مربع حرف كلمه جمله سؤال جواب قصه شعر بيت قصيده غنا رقص لعبه كره ملعب فريق هدف فوز خساره حكم لاعب جري سباحه سفر طريق شارع سياره باص قطار طياره سفينه قارب جسر مدينه قريه بلد دوله سوق محل مطعم مقهى مسجد مدرسه جامعه مستشفى طبيب دواء مرض صحه قوه ضعف عقل فكر راي سر خبر صوت صوره فيلم هاتف جوال رساله بريد ورقه نور ظل باب سيف رمح درع خيمه بئر واحه نخله جمل خيل حصان كلب قط اسد نمر ذيب ثعلب ارنب فار غزال طير صقر نسر حمام بطه ديك نحله نمله فراشه دود سمكه حوت قرش اخطبوط سلحفاه ضفدع ثعبان عقرب عنكبوت زرافه فيل قرد دب كتب درس لعب اكل شرب نام قام جلس مشى جرى طار سبح قرا كتب فتح سد ضرب رمى اخذ اعطى جاء ذهب رجع دخل خرج سال قال سمع راى عرف فهم حفظ نسي حب كره ضحك بكى صاح غنى رسم بنى هدم زرع حصد طبخ غسل لبس`;
let DICT = null, DICT_LIST = null;
function dict() {
  if (DICT) return DICT;
  const src = [];
  Object.values(TOPICS).forEach(ws => ws.forEach(w => src.push(w)));
  Object.values(SECRET_WORDS).forEach(ws => ws.forEach(w => src.push(w)));
  EXTRA_WORDS.split(/\s+/).forEach(w => src.push(w));
  DICT = new Set(); DICT_LIST = [];
  src.forEach(w => { if (/[\s()a-zA-Z0-9]/.test(w)) return; const n = norm(w); if (n.length >= 2 && n.length <= 8 && !DICT.has(n)) { DICT.add(n); DICT_LIST.push(n); } });
  return DICT;
}
function wordOk(w) { const d = dict(), n = norm(w); if (d.has(n)) return true; if (n.startsWith('ال') && d.has(n.slice(2))) return true; if (n.length > 2 && n.endsWith('ه') && d.has(n.slice(0, -1) + 'ه')) return true; return false; }

/* ---------- المعادلات ---------- */
function evalSide(s) { // يرجع [بسط، مقام] أو null
  const toks = s.match(/\d+|[+−×÷]/g); if (!toks || toks.join('') !== s) return null;
  if (!/\d/.test(toks[0]) || !/\d/.test(toks[toks.length - 1])) return null;
  for (let i = 0; i < toks.length; i++) { const isNum = /\d/.test(toks[i]); if (isNum !== (i % 2 === 0)) return null; if (isNum && toks[i].length > 1 && toks[i][0] === '0') return null; }
  const fr = (a, b) => { const g = (x, y) => y ? g(y, x % y) : Math.abs(x); const k = g(a, b) || 1; return b < 0 ? [-a / k, -b / k] : [a / k, b / k]; };
  let terms = [], cur = [+toks[0], 1], sign = 1;
  for (let i = 1; i < toks.length; i += 2) {
    const op = toks[i], n = +toks[i + 1];
    if (op === '×') cur = fr(cur[0] * n, cur[1]);
    else if (op === '÷') { if (!n) return null; cur = fr(cur[0], cur[1] * n); }
    else { terms.push([sign * cur[0], cur[1]]); cur = [n, 1]; sign = op === '+' ? 1 : -1; }
  }
  terms.push([sign * cur[0], cur[1]]);
  return terms.reduce((a, t) => fr(a[0] * t[1] + t[0] * a[1], a[1] * t[1]), [0, 1]);
}
function eqOk(s) { const parts = s.split('='); if (parts.length < 2 || parts.some(p => !p)) return false; const v = parts.map(evalSide); if (v.some(x => !x)) return false; return v.every(x => x[0] * v[0][1] === v[0][0] * x[1]); }
let EQ_LIST = null;
function eqList() {
  if (EQ_LIST) return EQ_LIST; const L = new Set();
  for (let a = 0; a <= 20; a++) for (let b = 0; b <= 20; b++) {
    const add = (x, op, y, z) => { if (z < 0 || z > 99 || !Number.isInteger(z)) return; L.add(x + op + y + '=' + z); L.add(z + '=' + x + op + y); };
    add(a, '+', b, a + b); add(a, '−', b, a - b); add(a, '×', b, a * b); if (b) add(a, '÷', b, a / b);
  }
  for (let a = 0; a <= 99; a++) L.add(a + '=' + a);
  EQ_LIST = [...L].filter(s => s.length <= 9); return EQ_LIST;
}

/* ---------- المحرك ---------- */
function scNew(mode, players) {
  const bag = shuffle(parseBag(mode === 'math' ? MATH_BAG : AR_BAG, mode === 'math'));
  const g = { mode, board: Array(N * N).fill(null), bag, pl: players.map(p => ({ id: p.id, name: p.name, bot: p.bot || 0, rack: [], score: 0 })), turn: 0, passes: 0, over: false, last: null, msg: '' };
  g.pl.forEach(p => refill(g, p)); g.turn = rnd(g.pl.length); return g;
}
function refill(g, p) {
  // في المعادلات نضمن إن عندك علامة = وعلامة عملية، عشان تقدر تسوي معادلة
  if (g.mode === 'math') { const need = c => !p.rack.some(t => t.c === c) && p.rack.length < 7; const pull = test => { const k = g.bag.findIndex(test); if (k >= 0) p.rack.push(g.bag.splice(k, 1)[0]); };
    if (need('=')) pull(t => t.c === '='); if (!p.rack.some(t => /[+−×÷]/.test(t.c)) && p.rack.length < 7) pull(t => /[+−×÷]/.test(t.c)); }
  while (p.rack.length < 7 && g.bag.length) p.rack.push(g.bag.pop());
}
const rtl = g => g.mode !== 'math';
function lineWord(g, board, i, dir) { // dir 'h' or 'v' — يرجع {cells:[], str}
  const r = i / N | 0, c = i % N, at = (rr, cc) => rr >= 0 && rr < N && cc >= 0 && cc < N ? board[rr * N + cc] : null;
  let cells = [];
  if (dir === 'v') { let rr = r; while (at(rr - 1, c)) rr--; while (at(rr, c)) { cells.push(rr * N + c); rr++; } }
  else { let cc = c; while (at(r, cc - 1)) cc--; while (at(r, cc)) { cells.push(r * N + cc); cc++; } if (rtl(g)) cells.reverse(); }
  return { cells, str: cells.map(k => board[k].c).join('') };
}
function evaluate(g, places) { // places: [{i, t}] — يرجع {ok, err, score, words}
  if (!places.length) return { ok: false, err: 'حط حرف واحد على الأقل' };
  const B = g.board.slice(); for (const p of places) { if (B[p.i]) return { ok: false, err: 'المربع مو فاضي' }; B[p.i] = p.t; }
  const rows = new Set(places.map(p => p.i / N | 0)), cols = new Set(places.map(p => p.i % N));
  if (rows.size > 1 && cols.size > 1) return { ok: false, err: 'لازم الحروف تكون بصف واحد أو عمود واحد' };
  const empty = g.board.every(x => !x);
  if (empty && !places.some(p => p.i === CENTER)) return { ok: false, err: 'أول كلمة لازم تمر على النجمة ★' };
  let dir = rows.size === 1 && cols.size === 1 ? null : rows.size === 1 ? 'h' : 'v';
  if (!dir) { const h = lineWord(g, B, places[0].i, 'h'), v = lineWord(g, B, places[0].i, 'v'); dir = h.cells.length >= v.cells.length ? 'h' : 'v'; }
  const main = lineWord(g, B, places[0].i, dir);
  if (!places.every(p => main.cells.includes(p.i))) return { ok: false, err: 'الحروف لازم تكون متصلة بدون فراغ' };
  if (main.cells.length < 2) return { ok: false, err: 'الكلمة لازم تكون حرفين أو أكثر' };
  const words = [main];
  places.forEach(p => { const w = lineWord(g, B, p.i, dir === 'h' ? 'v' : 'h'); if (w.cells.length >= 2) words.push(w); });
  if (!empty) { const touches = words.some(w => w.cells.some(k => g.board[k])); if (!touches) return { ok: false, err: 'لازم تلمس الحروف اللي على اللوحة' }; }
  const newSet = new Set(places.map(p => p.i)), bad = [];
  let total = 0;
  words.forEach(w => {
    const valid = g.mode === 'math' ? eqOk(w.str) : wordOk(w.str);
    if (!valid) bad.push(w.str);
    let s = 0, wm = 1;
    w.cells.forEach(k => { const t = B[k], pr = newSet.has(k) ? PREM[k] : ''; s += t.v * (pr === 'DL' ? 2 : pr === 'TL' ? 3 : 1); if (pr === 'DW' || pr === 'ST') wm *= 2; if (pr === 'TW') wm *= 3; });
    w.score = s * wm; total += w.score;
  });
  if (places.length === 7) total += 50;
  return { ok: !bad.length, bad, err: bad.length ? (g.mode === 'math' ? 'المعادلة مو صحيحة: ' : 'مو في قاموسي: ') + bad.join('، ') : '', score: total, words, bingo: places.length === 7 };
}
function commit(g, pi, places, ev) {
  const p = g.pl[pi];
  places.forEach(pl => { g.board[pl.i] = pl.t; const k = p.rack.indexOf(pl.t); if (k >= 0) p.rack.splice(k, 1); });
  p.score += ev.score; g.passes = 0; g.ex = 0; refill(g, p);
  g.last = { cells: places.map(x => x.i), pi, score: ev.score };
  g.msg = p.name + ': ' + ev.words.map(w => w.str).join(' + ') + ' = ' + ev.score + (ev.bingo ? ' (+٥٠ بنقو!)' : '');
  if (!p.rack.length && !g.bag.length) return finish(g, pi);
  g.turn = (g.turn + 1) % g.pl.length;
}
function scPass(g, pi, why) { g.passes++; g.msg = g.pl[pi].name + ' ' + (why || 'مرر'); if (g.passes >= g.pl.length * 2) return finish(g, -1); g.turn = (g.turn + 1) % g.pl.length; }
function scExchange(g, pi, idxs) { const p = g.pl[pi]; if (g.bag.length < idxs.length || !idxs.length) return false; const out = idxs.sort((a, b) => b - a).map(i => p.rack.splice(i, 1)[0]); g.bag = shuffle(g.bag); refill(g, p); g.bag.push(...out); g.bag = shuffle(g.bag); g.ex = (g.ex || 0) + 1; g.msg = p.name + ' بدّل ' + out.length; if (g.ex >= g.pl.length * 4) return finish(g, -1); g.turn = (g.turn + 1) % g.pl.length; return true; }
function finish(g, fin) {
  let sum = 0; g.pl.forEach((p, i) => { if (i === fin) return; const v = p.rack.reduce((a, t) => a + t.v, 0); p.score -= v; sum += v; });
  if (fin >= 0) g.pl[fin].score += sum;
  g.over = true; const best = Math.max(...g.pl.map(p => p.score)); g.winners = g.pl.filter(p => p.score === best).map(p => p.name);
}
/* ---------- الكمبيوتر ---------- */
function botMoves(g, pi) {
  const p = g.pl[pi], rack = p.rack, cands = g.mode === 'math' ? eqList() : (dict(), DICT_LIST);
  const moves = [], seen = new Set();
  const rackCount = {}; rack.forEach(t => { const k = g.mode === 'math' ? t.c : norm(t.c); rackCount[k] = (rackCount[k] || 0) + 1; });
  const keyOf = ch => g.mode === 'math' ? ch : norm(ch);
  const tryPlace = (word, cells) => {
    const used = {}, places = [];
    for (let j = 0; j < word.length; j++) {
      const k = cells[j]; if (k < 0) return; const b = g.board[k], ch = word[j];
      if (b) { if (keyOf(b.c) !== ch) return; continue; }
      used[ch] = (used[ch] || 0) + 1; if (used[ch] > (rackCount[ch] || 0)) return;
      places.push({ i: k, ch });
    }
    if (!places.length) return;
    const sig = places.map(x => x.i + x.ch).join(); if (seen.has(sig)) return; seen.add(sig);
    const pool = rack.slice(); const real = places.map(x => { const ti = pool.findIndex(t => keyOf(t.c) === x.ch); const t = pool.splice(ti, 1)[0]; return { i: x.i, t }; });
    const ev = evaluate(g, real); if (ev.ok) moves.push({ places: real, score: ev.score });
  };
  const cellsFor = (r0, c0, dir, len, j) => { // الخانة j تقع على (r0,c0)
    const out = [];
    for (let t = 0; t < len; t++) {
      let r = r0, c = c0; const d = t - j;
      if (dir === 'v') r += d; else c += rtl(g) ? -d : d;
      out.push(r >= 0 && r < N && c >= 0 && c < N ? r * N + c : -1);
    }
    return out;
  };
  const empty = g.board.every(x => !x);
  const anchors = empty ? [CENTER] : g.board.map((x, i) => x ? i : -1).filter(i => i >= 0);
  const T0 = Date.now();
  for (const w of cands) {
    if (Date.now() - T0 > 900) break;
    if (w.length > 8) continue;
    for (const a of anchors) {
      const r0 = a / N | 0, c0 = a % N, ach = empty ? null : keyOf(g.board[a].c);
      for (let j = 0; j < w.length; j++) {
        if (ach !== null && w[j] !== ach) continue;
        tryPlace(w, cellsFor(r0, c0, 'h', w.length, j)); tryPlace(w, cellsFor(r0, c0, 'v', w.length, j));
      }
    }
  }
  return moves.sort((a, b) => b.score - a.score);
}
function botPlay(g) {
  const pi = g.turn, p = g.pl[pi], mv = botMoves(g, pi);
  if (mv.length) {
    const lvl = p.bot; const k = lvl >= 3 ? 0 : lvl === 2 ? Math.min(mv.length - 1, rnd(Math.max(1, Math.ceil(mv.length * .25)))) : Math.min(mv.length - 1, Math.floor(mv.length * (.4 + Math.random() * .5)));
    const m = mv[k]; commit(g, pi, m.places, evaluate(g, m.places)); return;
  }
  if (g.bag.length >= 3) scExchange(g, pi, shuffle([...p.rack.keys()]).slice(0, Math.min(4, p.rack.length)));
  else scPass(g, pi);
}

/* ---------- واجهة اللوحة (مشتركة) ---------- */
function boardUI(g, me, canPlay, onSubmit, opts) {
  opts = opts || {};
  const wrap = el('div', 'scWrap');
  const sc = el('div', 'scScore'); g.pl.forEach((p, i) => sc.appendChild(el('span', i === g.turn && !g.over ? 'turn' : '', p.name + ': ' + p.score))); sc.appendChild(el('span', '', '🎒 ' + g.bag.length)); wrap.appendChild(sc);
  const pend = []; let sel = -1, exMode = false; const exSel = new Set();
  const rack = me ? me.rack.slice() : [];
  const bd = el('div', 'scBoard'), cellsEls = [];
  const msg = el('div', 'scMsg', g.msg || '');
  const tileEl = (t, cls) => { const d = el('div', 'sct' + (cls ? ' ' + cls : ''), t.c); d.appendChild(el('sub', '', t.v)); return d; };
  const drawBoard = () => {
    bd.innerHTML = '';
    for (let i = 0; i < N * N; i++) {
      const c = el('div', 'scC ' + PREM[i], PLAB[PREM[i]] || '');
      const t = g.board[i], pp = pend.find(x => x.i === i);
      if (t) c.appendChild(tileEl(t, g.last && g.last.cells.includes(i) ? 'last' : ''));
      else if (pp) c.appendChild(tileEl(rack[pp.r], 'pend'));
      c.onclick = () => {
        if (!canPlay || exMode) return;
        if (pp) { pend.splice(pend.indexOf(pp), 1); drawAll(); return; }
        if (t || sel < 0) return;
        pend.push({ i, r: sel }); sel = -1; beep(700, .03); drawAll();
      };
      bd.appendChild(c);
    }
  };
  const rk = el('div', 'scRack');
  const drawRack = () => {
    rk.innerHTML = '';
    rack.forEach((t, k) => { const used = pend.some(x => x.r === k); const d = el('div', 'rt' + (sel === k ? ' sel' : '') + (used ? ' used' : '') + (exSel.has(k) ? ' ex' : '')); d.appendChild(tileEl(t)); d.onclick = () => { if (!canPlay) return; if (exMode) { exSel.has(k) ? exSel.delete(k) : exSel.add(k); } else sel = sel === k ? -1 : k; drawRack(); }; rk.appendChild(d); });
  };
  const preview = () => { if (!pend.length) { msg.textContent = g.msg || ''; return; } const ev = evaluate(g, pend.map(x => ({ i: x.i, t: rack[x.r] }))); msg.textContent = ev.ok ? '✅ ' + ev.words.map(w => w.str).join(' + ') + ' = ' + ev.score + ' نقطة' : '⚠️ ' + ev.err; msg.style.color = ev.ok ? 'var(--grn)' : 'var(--red)'; };
  const drawAll = () => { drawBoard(); drawRack(); preview(); };
  wrap.append(bd, msg);
  if (me) wrap.appendChild(rk);
  drawAll();
  if (canPlay) {
    const bs = el('div', 'scBtns');
    const submit = btn('تأكيد ✓', 'grn', () => {
      if (exMode) { if (!exSel.size) return; onSubmit({ kind: 'ex', idx: [...exSel] }); return; }
      const places = pend.map(x => ({ i: x.i, t: rack[x.r] })); const ev = evaluate(g, places);
      if (!ev.ok && !(ev.bad && ev.bad.length && g.mode !== 'math' && opts.allowUnknown && ev.err && !/لازم|مو فاضي|النجمة|متصلة|حرفين/.test(ev.err))) { buzz(120); preview(); return; }
      if (!ev.ok) { if (!submit.dataset.c) { submit.dataset.c = 1; msg.textContent = '⚠️ ' + ev.err + ' — إذا متأكدين إنها كلمة صح، اضغطوا تأكيد مرة ثانية'; msg.style.color = 'var(--yel)'; return; } }
      onSubmit({ kind: 'play', places: pend.map(x => ({ i: x.i, r: x.r })), force: !ev.ok });
    });
    const recall = btn('رجّع ↩️', 'ghost', () => { pend.length = 0; sel = -1; exMode = false; exSel.clear(); delete submit.dataset.c; drawAll(); });
    const ex = btn('بدّل 🔄', 'ghost', () => { pend.length = 0; exMode = !exMode; exSel.clear(); ex.classList.toggle('on', exMode); msg.textContent = exMode ? 'اختار الحروف اللي تبي تبدلها واضغط تأكيد' : ''; drawAll(); });
    const ps = btn('مرر ⏭️', 'ghost', () => onSubmit({ kind: 'pass' }));
    bs.append(submit, recall, ex, ps); wrap.appendChild(bs);
    const sh = btn('🔀 خربط الحروف', 'ghost small', () => { if (pend.length) return; const s2 = shuffle(rack.map((t, i) => i)); const nr = s2.map(i => rack[i]); rack.splice(0, rack.length, ...nr); if (opts.onShuffle) opts.onShuffle(s2); sel = -1; drawAll(); });
    sh.style.margin = '8px auto 0'; sh.style.display = 'block'; wrap.appendChild(sh);
  }
  return wrap;
}

/* ---------- جوال واحد ---------- */
const xS = mkScreen('scrSetup', '🔠 سكرابل');
const xP = mkScreen('scrabble', '🔠 سكرابل');
let SC = null, lastHuman = -1;
function scSetup() {
  S.scMode = S.scMode || 'ar'; S.scBots = S.scBots === undefined ? 1 : S.scBots; S.scLvl = S.scLvl || 2; S.scHum = (S.scHum || S.players.slice(0, 1)).filter(p => S.players.includes(p));
  const b = xS.body; b.innerHTML = '';
  const box = el('div', 'box'); box.appendChild(el('h2', '', 'النوع'));
  const ch = el('div', 'chips'); [['ar', '🔤 حروف وكلمات عربية'], ['math', '🔢 أرقام ومعادلات']].forEach(([k, n]) => { const c = el('button', 'chip' + (S.scMode === k ? ' sel' : ''), n); c.onclick = () => { S.scMode = k; save(); scSetup(); }; ch.appendChild(c); }); box.appendChild(ch);
  const box2 = el('div', 'box'); box2.appendChild(el('h2', '', 'اللاعبين (لين ٤)'));
  const ch2 = el('div', 'chips'); S.players.forEach(p => { const c = el('button', 'chip' + (S.scHum.includes(p) ? ' sel' : ''), p); c.onclick = () => { if (S.scHum.includes(p)) S.scHum.splice(S.scHum.indexOf(p), 1); else if (S.scHum.length + S.scBots < 4) S.scHum.push(p); save(); scSetup(); }; ch2.appendChild(c); }); box2.appendChild(ch2);
  box2.appendChild(stepper('🤖 كمبيوتر', () => S.scBots, v => { S.scBots = v; scSetup(); }, () => 0, () => Math.max(0, 4 - S.scHum.length)));
  box2.appendChild(stepper('مستوى الكمبيوتر', () => S.scLvl, v => S.scLvl = v, () => 1, () => 3, v => ['', 'سهل', 'متوسط', 'صعب'][v]));
  box2.appendChild(el('div', 'lab', 'تبي تلعب مع ربعك كل واحد من جواله؟ سوّ غرفة أونلاين 🌐'));
  const err = el('div', 'err', '');
  b.append(box, box2, err);
  setBtns2(xS.row, [btn('ابدأ ▶', '', () => {
    const pl = S.scHum.map(n => ({ id: n, name: n })); if (!pl.length) pl.push({ id: 'me', name: 'أنت' });
    const bn = ['🤖 سالم', '🤖 فهد', '🤖 مريم']; for (let i = 0; i < S.scBots; i++) pl.push({ id: 'bot' + i, name: bn[i], bot: S.scLvl });
    if (pl.length < 2) { err.textContent = 'لازم لاعبين على الأقل (حط كمبيوتر)'; return; }
    SC = scNew(S.scMode, pl); lastHuman = -1; scTurn();
  })]);
  show('scrSetup');
}
const humanN = () => SC.pl.filter(p => !p.bot).length;
function scTurn() {
  if (SC.over) return scOver();
  const p = SC.pl[SC.turn];
  if (!p.bot && humanN() > 1 && lastHuman !== SC.turn) return scPassScreen(p);
  scDraw();
  if (p.bot) setTimeout(() => { if (!$('scrabble').classList.contains('on')) return; botPlay(SC); beep(800, .05); scTurn(); }, window.__fast ? 10 : 900);
}
function scPassScreen(p) { const b = xP.body; b.innerHTML = ''; const c = el('div', 'bigcard'); c.append(el('div', 'lab', 'عط الجوال لـ'), el('div', 'nm', p.name), el('div', 'lab', SC.msg || '')); b.appendChild(c); setBtns2(xP.row, [btn('أنا ' + p.name + ' ✋', '', () => { lastHuman = SC.turn; scDraw(); })]); show('scrabble'); }
function scDraw() {
  const p = SC.pl[SC.turn], me = p.bot ? (SC.pl.find(x => !x.bot) || p) : p;
  const b = xP.body; b.innerHTML = '';
  xP.h.textContent = SC.mode === 'math' ? '🔢 سكرابل المعادلات' : '🔠 سكرابل';
  b.appendChild(boardUI(SC, me, !p.bot, mv => {
    const pi = SC.turn;
    if (mv.kind === 'pass') scPass(SC, pi);
    else if (mv.kind === 'ex') { if (!scExchange(SC, pi, mv.idx)) { buzz(100); return; } }
    else { const places = mv.places.map(x => ({ i: x.i, t: p.rack[x.r] })); const ev = evaluate(SC, places); if (!ev.ok && !mv.force) return; commit(SC, pi, places, ev); beep(1100, .12); }
    scTurn();
  }, { allowUnknown: true }));
  setBtns2(xP.row, p.bot ? [btn('🤖 ' + p.name + ' يفكر…', 'ghost', () => { })] : []);
  show('scrabble');
}
function scOver() {
  const b = xP.body; b.innerHTML = ''; const c = el('div', 'bigcard');
  c.append(el('div', 'win good', '🏆 ' + SC.winners.join(' و ')), el('div', 'lab', 'خلصت اللعبة'));
  const r = el('div', 'reslist'); SC.pl.slice().sort((a, b2) => b2.score - a.score).forEach(p => { const d = el('div', ''); d.append(el('span', '', p.name), el('b', '', p.score)); r.appendChild(d); }); c.appendChild(r);
  b.appendChild(c); b.appendChild(boardUI(SC, null, false));
  setBtns2(xP.row, [btn('تعديل', 'ghost', scSetup), btn('لعبة جديدة 🔄', '', () => { SC = scNew(SC.mode, SC.pl.map(p => ({ id: p.id, name: p.name, bot: p.bot }))); lastHuman = -1; scTurn(); }, 2)]);
}

/* ---------- أونلاين ---------- */
window.ONL.renderers.scboard = (it, c, sendAct) => {
  const g = it.g; const me = it.me >= 0 ? g.pl[it.me] : null;
  c.appendChild(boardUI(g, me, it.can, mv => { c.querySelectorAll('button').forEach(b => b.disabled = true); sendAct({ a: 'opt', v: JSON.stringify(mv) }); }, { allowUnknown: true }));
};
function makeSC(mode) {
  const O = window.ONL; const G = {};
  G.start = () => { G.g = scNew(mode, shuffle(O.active().map(p => ({ id: p.id, name: p.name })))); G.awarded = false; };
  const idx = id => G.g.pl.findIndex(p => p.id === id);
  G.leave = p => { const g = G.g, i = idx(p.id); if (i >= 0 && g.turn === i && !g.over) scPass(g, i, 'طلع'); };
  G.view = p => {
    const g = G.g, i = idx(p.id);
    if (g.over && !G.awarded) { G.awarded = true; g.pl.forEach(q => { if (g.winners.includes(q.name) && O.P(q.id)) O.P(q.id).score += 2; }); }
    const gv = JSON.parse(JSON.stringify(g)); gv.bag = Array(g.bag.length).fill(0); gv.pl.forEach((q, k) => { if (k !== i) q.rack = q.rack.map(() => ({ c: '?', v: 0 })); });
    const items = [];
    if (g.over) items.push({ t: 'win good', v: '🏆 ' + g.winners.join(' و ') });
    else items.push({ t: 'lab', v: g.turn === i ? 'دورك! حط الحروف واضغط تأكيد' : 'دور ' + g.pl[g.turn].name });
    items.push({ t: 'scboard', g: gv, me: i, can: !g.over && g.turn === i });
    return { title: mode === 'math' ? '🔢 سكرابل المعادلات' : '🔠 سكرابل', items, scores: g.over ? O.scoresList() : null };
  };
  G.hostBtns = () => G.g.over ? [{ id: 'h:again', label: 'لعبة جديدة 🔄', flex: 2 }] : [];
  G.act = (p, m) => {
    const g = G.g, i = idx(p.id);
    if (m.v === 'h:again') return G.start();
    if (g.over || i !== g.turn || m.a !== 'opt') return;
    let mv; try { mv = JSON.parse(m.v); } catch (e) { return; }
    if (mv.kind === 'pass') return scPass(g, i);
    if (mv.kind === 'ex') return scExchange(g, i, mv.idx);
    const places = (mv.places || []).map(x => ({ i: x.i, t: g.pl[i].rack[x.r] })).filter(x => x.t && x.i >= 0 && x.i < N * N);
    if (new Set(places.map(x => x.t)).size !== places.length) return;
    const ev = evaluate(g, places); if (ev.ok || (mv.force && mode !== 'math' && ev.bad && ev.bad.length)) commit(g, i, places, ev);
  };
  return G;
}
window.ONL.register('scr', { e: '🔠', n: 'سكرابل (حروف)', d: 'كل واحد حروفه على جواله', min: 2, make: () => makeSC('ar') });
window.ONL.register('scrm', { e: '🔢', n: 'سكرابل المعادلات', d: 'أرقام ومعادلات', min: 2, make: () => makeSC('math') });

/* ---------- تسجيل ---------- */
const k = GAMES.findIndex(x => x.id === 'sudoku');
GAMES.splice(k + 1, 0, { id: 'scrabble', e: '🔠', n: 'سكرابل', d: 'حروف عربية أو أرقام ومعادلات، ضد الكمبيوتر', min: 0, t: '٢٠-٤٠ دقيقة' });
RULES.scrabble = ['كل واحد عنده ٧ حروف (أو أرقام). بدورك تحط كلمة على اللوحة بصف واحد أو عمود واحد، وتضغط تأكيد.', 'أول كلمة لازم تمر على النجمة ★، وبعدها كل كلمة لازم تلمس اللي على اللوحة. الكلمات العربية تنقرى من اليمين لليسار ومن فوق لتحت.', 'المربعات الملونة تضاعف: ٢ح و٣ح للحرف، و٢ك و٣ك للكلمة كلها. وإذا استخدمت الحروف السبعة كلها تاخذ +٥٠!', 'سكرابل المعادلات: بدل الكلمات تسوي معادلات صحيحة، مثل 3+4=7 أو 12=3×4.', 'إذا الكلمة مو في قاموس اللعبة، يطلع لك تنبيه، وإذا متأكدين إنها صح اضغطوا تأكيد مرة ثانية.', 'تقدر تبدّل حروفك أو تمرر. تخلص اللعبة لما تخلص الحروف أو الكل يمرر، واللي عنده نقاط أكثر يفوز. العب ضد الكمبيوتر 🤖 أو أونلاين مع ربعك.'];
window.EXTRA.scrabble = scSetup;
window.__sc = () => ({ SC, scNew, evaluate, commit, botPlay, botMoves, eqOk, wordOk, dict, eqList, N, CENTER });
renderHome();
})();
