/* ===== تقزيرة: الإعدادات، المفضلة، وألعاب جديدة ===== */
(function () {
'use strict';
const { mkScreen, stepper, chipSet, setBtns2 } = window.UI;

/* ---------- CSS ---------- */
const css = document.createElement('style');
css.textContent = `
.homeBtns{position:absolute;top:calc(14px + env(safe-area-inset-top));left:16px;display:flex;gap:8px;z-index:3}
.homeBtns .back{position:static;font-size:20px}
.game .star{position:absolute;top:6px;left:6px;width:34px;height:34px;padding:0;border-radius:50%;font-size:18px;background:var(--paper);color:var(--txt);box-shadow:2px 2px 0 var(--line);line-height:1}
.game .star.on{background:var(--yel)}
.game.fav{outline:3px solid var(--yel);outline-offset:-3px}
.tiles{display:grid;gap:6px;justify-content:center;margin:6px auto}
.tile{width:var(--tw,52px);height:var(--tw,52px);border:2px solid var(--line);border-radius:10px;background:var(--paper);display:flex;align-items:center;justify-content:center;font-family:'Lalezar','Tajawal';font-size:calc(var(--tw,52px) * .54);color:var(--txt);transition:transform .3s}
.tile.g{background:#2f8f5b;color:#fff;border-color:#1d5c3a}.tile.y{background:#d7a632;color:#2b1d12;border-color:#9a7419}.tile.x{}
.tile.cur{border-color:var(--red);box-shadow:0 0 0 2px var(--red)}
.tile.flip{animation:tflip .45s ease}
@keyframes tflip{0%{transform:rotateX(0)}50%{transform:rotateX(90deg)}100%{transform:rotateX(0)}}
.kb{display:flex;flex-direction:column;gap:6px;margin-top:8px;direction:rtl}
.kb .kr{display:flex;gap:4px;justify-content:center}
.kb button{flex:1;min-width:0;padding:11px 0;font-size:19px;border-radius:8px;box-shadow:2px 2px 0 var(--line);background:var(--paper);color:var(--txt)}
.kb button.wide{flex:1.6;font-size:15px}
.kb button.g{background:#2f8f5b;color:#fff}.kb button.y{background:#d7a632;color:#2b1d12}.kb button.x{}
.bigin{width:100%;font-size:22px!important;text-align:center;padding:14px!important}
.reslist{width:100%;display:flex;flex-direction:column;gap:6px}
.reslist div{display:flex;justify-content:space-between;align-items:center;background:var(--paper);border:2px solid var(--line);border-radius:10px;padding:6px 12px;font-weight:700}
.reslist div.best{background:var(--grn);color:#fff}
.bigLetter{font-family:'Lalezar';font-size:110px;line-height:1;color:var(--red);text-shadow:3px 3px 0 var(--yel)}
.flagBig{font-size:120px;line-height:1.1}
.emojiBig{font-size:64px;letter-spacing:6px;line-height:1.3;direction:ltr}
.scr{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;direction:rtl}
.scr span{width:48px;height:56px;border:2px solid var(--line);border-radius:10px;background:var(--yel);color:#2b1d12;display:flex;align-items:center;justify-content:center;font-family:'Lalezar';font-size:30px;box-shadow:2px 2px 0 var(--line);animation:pop .3s ease backwards}
@keyframes pop{from{transform:scale(.3) rotate(-20deg);opacity:0}}
/* المليون */
.mil{background:radial-gradient(ellipse at top,#1d2f6b,#0b1233 70%);color:#fff;border-radius:18px;border:2px solid #c9a227;padding:14px;box-shadow:var(--sh)}
.mil .mq{background:linear-gradient(90deg,#0d1a4a,#1f3a8a,#0d1a4a);border:2px solid #c9a227;border-radius:999px;padding:14px 18px;text-align:center;font-size:19px;font-weight:700;line-height:1.6}
.mil .mo{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
.mil .mo button{background:linear-gradient(90deg,#0d1a4a,#1a2f75);border:2px solid #c9a227;border-radius:999px;color:#fff;font-family:'Tajawal';font-weight:700;font-size:16px;padding:12px 8px;box-shadow:none}
.mil .mo button b{color:#f5c84b;margin-left:6px}
.mil .mo button.sel{background:#d98a1f;color:#fff}.mil .mo button.ok{background:#1f9a54}.mil .mo button.no{background:#b3261e}
.mil .mo button.gone{visibility:hidden}
.mil .life{display:flex;justify-content:center;gap:10px;margin-bottom:10px}
.mil .life button{background:#0d1a4a;border:2px solid #c9a227;color:#fff;border-radius:999px;padding:6px 12px;font-size:15px;box-shadow:none;font-family:'Tajawal'}
.mil .life button:disabled{opacity:.3;text-decoration:line-through}
.mil .prize{text-align:center;color:#f5c84b;font-family:'Lalezar';font-size:24px;margin-bottom:8px}
.ladder{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-top:12px;direction:rtl}
.ladder span{font-size:11px;text-align:center;border:1px solid #3a4c8f;border-radius:6px;padding:3px 0;color:#9fb1e8}
.ladder span.safe{color:#fff;border-color:#c9a227}.ladder span.now{background:#d98a1f;color:#fff}.ladder span.done{background:#1f3a8a;color:#fff}
.aud{display:flex;align-items:flex-end;justify-content:space-around;height:110px;margin:8px 0}
.aud div{width:18%;background:#f5c84b;border-radius:6px 6px 0 0;position:relative;transition:height .8s}
.aud div span{position:absolute;top:-20px;left:0;right:0;text-align:center;font-size:12px;color:#fff}
.aud div b{position:absolute;bottom:-20px;left:0;right:0;text-align:center;color:#f5c84b}
/* الجرس */
.buzzArena{position:fixed;inset:0;display:grid;z-index:10;background:var(--bg)}
.buzzArena.p2{grid-template-rows:1fr auto 1fr}
.buzzArena.p3,.buzzArena.p4{grid-template-columns:1fr 1fr;grid-template-rows:1fr auto 1fr}
.bz{border:0;border-radius:0;box-shadow:none;font-family:'Lalezar';font-size:30px;color:#fff;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px;user-select:none;-webkit-user-select:none;touch-action:none}
.bz.flipped{transform:rotate(180deg)}
.bz.lock{filter:grayscale(1) brightness(.6)}
.bz.win{animation:winp .5s ease 3}
@keyframes winp{50%{filter:brightness(1.5)}}
.bz .sc{font-size:22px;background:rgba(0,0,0,.25);border-radius:999px;padding:0 14px}
.bzMid{grid-column:1/-1;background:var(--card);border-top:3px solid var(--line);border-bottom:3px solid var(--line);padding:10px 14px;text-align:center;position:relative}
.bzMid .q{font-size:18px;font-weight:700;line-height:1.5}
.bzMid .a{font-family:'Lalezar';font-size:24px;color:var(--grn)}
.bzMid .row{margin-top:8px}
.bzMid button{padding:8px 10px;font-size:15px}
/* إكس أو */
.xo{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:min(86vw,360px);margin:10px auto;direction:ltr}
.xo button{aspect-ratio:1;background:var(--paper);border-radius:18px;padding:0;display:flex;align-items:center;justify-content:center}
.xo button svg{width:72%;height:72%}
.xo button.w{background:var(--yel)}
.xo .dx{stroke-dasharray:120;stroke-dashoffset:120;animation:dr .35s forwards}
.xo .do{stroke-dasharray:190;stroke-dashoffset:190;animation:dr .45s forwards}
@keyframes dr{to{stroke-dashoffset:0}}
.setrow{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px dashed var(--dash)}
.setrow:last-child{border:0}
`;
document.head.appendChild(css);

const norm = s => s.replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/ة/g, 'ه');
function passCard(add, name, msg) { add('lab', 'عط التلفون لـ'); add('nm', name); add('lab', msg || 'وخل الباقين ما يشوفون الشاشة 🤫'); }
const sc0 = () => { const o = {}; S.players.forEach(p => o[p] = 0); return o; };

/* =================================================================
   ⚙️ الإعدادات
   ================================================================= */
const stS = mkScreen('settings', '⚙️ الإعدادات');
stS.el.querySelector('.help').style.visibility = 'hidden';
const TSET = [['cha', '🎭 تمثيل بدون كلام', 10, 30, 180], ['tab', '🚫 الكلمة الممنوعة', 10, 30, 180], ['hot', '🪑 الكرسي الساخن', 15, 30, 300], ['let', '🔤 إنسان حيوان نبات', 10, 20, 180], ['bombMin', '💣 القنبلة (أقل وقت)', 5, 5, 60], ['bombMax', '💣 القنبلة (أكثر وقت)', 5, 10, 120], ['sj', '🧠 سين جيم', 10, 10, 180], ['five', '⏱️ ٥ ثواني', 1, 3, 30], ['chain', '🔗 سلسلة الكلمات', 1, 3, 60], ['scr', '🔀 الحروف المخربطة', 5, 10, 120], ['flag', '🚩 خمن الدولة', 5, 5, 60], ['mil', '💰 من سيربح المليون', 5, 10, 120]];
function settingsScreen() {
  S.times = S.times || {};
  const b = stS.body; b.innerHTML = '';
  const box = el('div', 'box'); box.appendChild(el('h2', '', '⏱️ أوقات الألعاب (بالثواني)'));
  TSET.forEach(([k, label, step, mn, mx]) => {
    const r = el('div', 'setrow'); r.appendChild(el('b', '', label));
    const st = el('div', 'stepper'), m = el('button', 'ghost', '−'), v = el('span', ''), p = el('button', 'ghost', '+');
    const upd = () => v.textContent = TIME(k);
    m.onclick = () => { S.times[k] = Math.max(mn, TIME(k) - step); upd(); save(); };
    p.onclick = () => { S.times[k] = Math.min(mx, TIME(k) + step); upd(); save(); };
    st.append(m, v, p); r.appendChild(st); box.appendChild(r); upd();
  });
  const rs = btn('رجّع الأوقات الأصلية', 'ghost', () => { S.times = {}; save(); settingsScreen(); });
  rs.style.width = '100%'; rs.style.marginTop = '10px'; box.appendChild(rs);
  const b2 = el('div', 'box'); b2.appendChild(el('h2', '', '🧹 أشياء ثانية'));
  const clr = btn('صفّر الأسئلة اللي انلعبت (ترجع من جديد)', 'ghost', () => { Object.keys(localStorage).filter(k => k.startsWith('u_')).forEach(k => { try { localStorage.removeItem(k); } catch (e) { } }); clr.textContent = 'تم ✓'; });
  clr.style.width = '100%'; b2.appendChild(clr);
  if (window.SFX_VOL_UI) b.appendChild(window.SFX_VOL_UI());
  if (window.EASY_UI) b.appendChild(window.EASY_UI());
  b.append(box, b2); setBtns2(stS.row, []); show('settings');
}

/* =================================================================
   ⭐ المفضلة + زر الإعدادات في الرئيسية
   ================================================================= */
const homeEl = $('home'), oldTheme = $('themeBtn');
const hb = el('div', 'homeBtns'); homeEl.insertBefore(hb, homeEl.firstChild); hb.appendChild(oldTheme); oldTheme.classList.remove('themeBtn');
const setB = el('button', 'back', '⚙️'); setB.onclick = settingsScreen; hb.appendChild(setB);
window.renderHome = function () {
  $('players').innerHTML = '';
  S.players.forEach((p, i) => { const d = el('div', 'pl'); d.appendChild(el('span', '', p)); const x = el('b', '', '×'); x.onclick = () => { S.players.splice(i, 1); renderHome(); }; d.appendChild(x); $('players').appendChild(d); });
  $('pc').textContent = S.players.length ? S.players.length + ' لاعب' : '';
  $('games').innerHTML = ''; $('tools').innerHTML = '';
  S.favs = S.favs || [];
  const list = GAMES.slice().sort((a, b) => { const fa = S.favs.indexOf(a.id), fb = S.favs.indexOf(b.id); if (fa >= 0 && fb >= 0) return fa - fb; if (fa >= 0) return -1; if (fb >= 0) return 1; return GAMES.indexOf(a) - GAMES.indexOf(b); });
  list.forEach(g => {
    const fav = S.favs.includes(g.id);
    const b = el('button', 'game' + (fav ? ' fav' : '')); b.append(el('span', 'e', g.e), el('span', 'n', g.n), el('span', 'd', g.d)); b.onclick = () => openGame(g);
    const st = el('button', 'star' + (fav ? ' on' : ''), fav ? '⭐' : '☆');
    st.onclick = e => { e.stopPropagation(); if (fav) S.favs.splice(S.favs.indexOf(g.id), 1); else S.favs.push(g.id); beep(fav ? 500 : 1000, .06); renderHome(); };
    b.appendChild(st); $(g.tool ? 'tools' : 'games').appendChild(b);
  });
  save();
};

/* =================================================================
   🎤 منهو قالها
   ================================================================= */
const wsS = mkScreen('whosaid', '🎤 منهو قالها؟');
let WS = null;
function whoStart() { WS = { sc: sc0() }; whoRound(); }
function whoRound() {
  WS.q = draw('whosaid', WHO_SAID); WS.ans = []; WS.order = shuffle(S.players); WS.i = 0; whoWrite();
}
function whoWrite() {
  const b = wsS.body; b.innerHTML = ''; const c = el('div', 'bigcard'); b.appendChild(c);
  const add = (k, t) => { const d = el('div', k, t); c.appendChild(d); return d; };
  const p = WS.order[WS.i];
  add('lab', 'السؤال'); add('txt', WS.q);
  passCard(add, p, 'اكتب جوابك بالسر، وبعدين عطه اللي بعده');
  const inp = el('input'); inp.type = 'text'; inp.className = 'bigin'; inp.maxLength = 60; inp.placeholder = 'جوابك…'; c.appendChild(inp);
  setBtns2(wsS.row, [btn('تم ✓', '', () => {
    const v = inp.value.trim(); if (!v) { inp.focus(); buzz(80); return; }
    WS.ans.push({ p, t: v }); WS.i++; inp.value = '';
    if (WS.i < WS.order.length) whoWrite(); else { WS.ans = shuffle(WS.ans); WS.k = 0; WS.gq = shuffle(S.players); WS.gi = 0; whoGuess(); }
  })]);
  show('whosaid'); setTimeout(() => inp.focus(), 50);
}
function whoGuess() {
  const a = WS.ans[WS.k]; let g = WS.gq[WS.gi % WS.gq.length]; if (g === a.p) { WS.gi++; g = WS.gq[WS.gi % WS.gq.length]; }
  const b = wsS.body; b.innerHTML = ''; const c = el('div', 'bigcard'); b.appendChild(c);
  c.append(el('div', 'lab', WS.q), el('div', 'lab', 'جواب ' + (WS.k + 1) + ' من ' + WS.ans.length + ':'), el('div', 'txt', '«' + a.t + '»'), el('div', 'lab', 'يخمن منهو كاتبه:'), el('div', 'nm', g));
  const o = el('div', 'opts'); o.style.gridTemplateColumns = '1fr 1fr';
  S.players.filter(x => x !== g).forEach(x => o.appendChild(btn(x, '', () => {
    o.querySelectorAll('button').forEach(bb => { bb.disabled = true; if (bb.textContent === a.p) bb.className = 'ok'; });
    if (x === a.p) { WS.sc[g]++; beep(1200, .15); c.appendChild(el('div', 'win good', 'صح! +١ لـ ' + g)); }
    else { WS.sc[a.p]++; beep(200, .3); c.querySelector('.opts').querySelectorAll('button').forEach(bb => { if (bb.textContent === x) bb.className = 'no'; }); c.appendChild(el('div', 'win bad', 'غلط! +١ لـ ' + a.p + ' لأنه ضيّعك')); }
    WS.gi++; WS.k++;
    setBtns2(wsS.row, [btn(WS.k < WS.ans.length ? 'الجواب اللي بعده ←' : 'النتيجة 🏆', '', () => WS.k < WS.ans.length ? whoGuess() : whoEnd())]);
  })));
  c.appendChild(o); setBtns2(wsS.row, []);
}
function whoEnd() {
  const b = wsS.body; b.innerHTML = ''; const c = el('div', 'bigcard'); b.appendChild(c); c.appendChild(el('div', 'lab', 'النقاط'));
  c.appendChild(resList(WS.sc));
  setBtns2(wsS.row, [btn('سؤال جديد 🔄', '', whoRound)]);
}
function resList(sc, best) {
  const r = el('div', 'reslist'); const arr = Object.entries(sc).sort((a, b) => b[1] - a[1]); const mx = arr.length ? arr[0][1] : 0;
  arr.forEach(([n, v]) => { const d = el('div', (best !== false && v === mx && v > 0) ? 'best' : ''); d.append(el('span', '', n), el('b', '', v)); r.appendChild(d); }); return r;
}

/* =================================================================
   🔐 الرقم السري / 🔤 الكلمة السرية (خانات ٣ أو ٤ أو ٥)
   ================================================================= */
const cbS = mkScreen('codebreak', '🔐 الرقم السري');
const AR_KB = [['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج'], ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'], ['ذ', 'ء', 'ر', 'ى', 'ة', 'و', 'ز', 'ظ', 'د', 'أ']];
const NUM_KB = [['1', '2', '3', '4', '5'], ['6', '7', '8', '9', '0']];
let CB = null;
function cbSetup(mode) {
  S.cbLen = S.cbLen || 4; S.cbSetter = S.cbSetter || 'rnd';
  CB = { mode };
  cbS.h.textContent = mode === 'num' ? '🔐 الرقم السري' : '🔤 الكلمة السرية';
  const b = cbS.body; b.innerHTML = '';
  const box = el('div', 'box');
  const mx = mode === 'num' ? 8 : 5; if (S.cbLen > mx) S.cbLen = mx;
  box.appendChild(stepper('عدد الخانات', () => S.cbLen, v => S.cbLen = v, () => 3, () => mx));
  const t = el('div', 'toggle'); t.appendChild(el('b', '', 'منهو يختار ' + (mode === 'num' ? 'الرقم' : 'الكلمة') + '؟'));
  const ch = el('div', 'chips');
  [['rnd', '🎲 التطبيق'], ['player', '🙋 لاعب']].forEach(([k, l]) => { const c = el('button', 'chip' + (S.cbSetter === k ? ' sel' : ''), l); c.onclick = () => { S.cbSetter = k; save(); cbSetup(mode); }; ch.appendChild(c); });
  t.appendChild(ch); box.appendChild(t);
  const info = el('div', 'box', ''); info.style.fontSize = '14px'; info.style.lineHeight = '1.8'; info.style.color = 'var(--mut)';
  info.innerHTML = '🟩 في مكانه الصح<br>🟨 موجود بس في مكان ثاني<br>(اللي ما يتلوّن ما نقول لكم عنه شي 😏)<br>عندكم ' + (mode === 'num' ? '٨' : '٦') + ' محاولات، وتتناوبون على التخمين.';
  b.append(box, info);
  setBtns2(cbS.row, [btn('ابدأ ▶', '', cbStart)]);
  show('codebreak');
}
function cbStart() {
  const mode = CB.mode, L = Math.min(S.cbLen, mode === 'num' ? 8 : 5);
  CB = { mode, L, rows: mode === 'num' ? 8 : 6, guesses: [], cur: '', setter: null, keys: {}, turnQ: null, sc: CB.sc || sc0() };
  if (S.cbSetter === 'player' && S.players.length >= 2) { CB.setter = pick(S.players); cbSecretInput(); }
  else { CB.secret = mode === 'num' ? Array.from({ length: L }, () => rnd(10)).join('') : pick(SECRET_WORDS[L]); cbPlay(); }
}
function cbSecretInput() {
  const b = cbS.body; b.innerHTML = ''; const c = el('div', 'bigcard'); b.appendChild(c);
  const add = (k, t) => { const d = el('div', k, t); c.appendChild(d); return d; };
  passCard(add, CB.setter, 'اختار ' + (CB.mode === 'num' ? 'رقم من ' : 'كلمة من ') + CB.L + ' خانات بالسر');
  CB.cur = ''; const tl = el('div', 'tiles'); c.appendChild(tl);
  const draw1 = () => { tl.innerHTML = ''; tl.style.gridTemplateColumns = 'repeat(' + CB.L + ',' + tileW() + 'px)'; tl.style.setProperty('--tw', tileW() + 'px'); for (let i = 0; i < CB.L; i++) { const t = el('div', 'tile' + (i === CB.cur.length ? ' cur' : ''), CB.cur[i] ? '•' : ''); tl.appendChild(t); } };
  draw1();
  b.appendChild(cbKeyboard(k => { if (k === '⌫') CB.cur = CB.cur.slice(0, -1); else if (k === '✓') { if (CB.cur.length === CB.L) { CB.secret = CB.cur; CB.cur = ''; cbPlay(); return; } buzz(80); } else if (CB.cur.length < CB.L) CB.cur += k; draw1(); }, true));
  setBtns2(cbS.row, []);
}
function cbKeyboard(onKey, plain) {
  const kb = el('div', 'kb'); kb.style.direction = CB.mode === 'num' ? 'ltr' : 'rtl'; const rows = CB.mode === 'num' ? NUM_KB : AR_KB;
  rows.forEach(r => { const row = el('div', 'kr'); r.forEach(k => { const b = el('button', plain ? '' : (CB.keys[norm(k)] || ''), k); b.onclick = () => onKey(k); row.appendChild(b); }); kb.appendChild(row); });
  const last = el('div', 'kr'); const ok = el('button', 'wide', '✓ دخّل'); ok.style.background = 'var(--grn)'; ok.style.color = '#fff'; ok.onclick = () => onKey('✓');
  const del = el('button', 'wide', '⌫ امسح'); del.onclick = () => onKey('⌫'); last.append(ok, del); kb.appendChild(last);
  return kb;
}
function tileW() { return Math.floor(Math.min(52, (Math.min(window.innerWidth - 40, TABW(440)) - (CB.L - 1) * 6) / CB.L)); }
function score(guess, secret) {
  const g = [...guess].map(norm), s = [...secret].map(norm), res = Array(g.length).fill('x'), left = {};
  s.forEach((ch, i) => { if (g[i] === ch) res[i] = 'g'; else left[ch] = (left[ch] || 0) + 1; });
  g.forEach((ch, i) => { if (res[i] !== 'g' && left[ch] > 0) { res[i] = 'y'; left[ch]--; } });
  return res;
}
function cbPlay() {
  if (!CB.turnQ) { const pl = S.players.filter(p => p !== CB.setter); CB.order = pl.length ? shuffle(pl) : ['إنت']; CB.ti = 0; CB.turnQ = 1; }
  const b = cbS.body; b.innerHTML = '';
  const who = CB.order[CB.ti % CB.order.length];
  const info = el('div', 'sub', ''); info.innerHTML = 'دور <b style="color:var(--red);font-size:20px">' + esc(who) + '</b> يخمن · محاولة ' + (CB.guesses.length + 1) + ' من ' + CB.rows + (CB.setter ? ' · اللي اختار: ' + esc(CB.setter) : '');
  const tl = el('div', 'tiles'); tl.style.gridTemplateColumns = 'repeat(' + CB.L + ',' + tileW() + 'px)'; tl.style.setProperty('--tw', tileW() + 'px'); tl.style.direction = CB.mode === 'num' ? 'ltr' : 'rtl';
  CB.guesses.forEach((g, gi) => { [...g.w].forEach((ch, i) => { const t = el('div', 'tile ' + g.r[i] + (gi === CB.guesses.length - 1 && CB.justAdded ? ' flip' : ''), ch); if (CB.justAdded && gi === CB.guesses.length - 1) t.style.animationDelay = (i * 0.12) + 's'; tl.appendChild(t); }); });
  if (CB.guesses.length < CB.rows && !CB.done) for (let i = 0; i < CB.L; i++) tl.appendChild(el('div', 'tile' + (i === CB.cur.length ? ' cur' : ''), CB.cur[i] || ''));
  for (let r = CB.guesses.length + 1; r < CB.rows && !CB.done; r++) for (let i = 0; i < CB.L; i++) { const t = el('div', 'tile'); t.style.opacity = '.4'; tl.appendChild(t); }
  CB.justAdded = false;
  b.append(info, tl);
  if (CB.done) return cbEnd();
  b.appendChild(cbKeyboard(k => {
    if (k === '⌫') CB.cur = CB.cur.slice(0, -1);
    else if (k === '✓') {
      if (CB.cur.length !== CB.L) { buzz(80); return; }
      const r = score(CB.cur, CB.secret); CB.guesses.push({ w: CB.cur, r, by: who });
      const rank = { g: 3, y: 2, x: 1 }; [...CB.cur].forEach((ch, i) => { const n = norm(ch), cur = CB.keys[n], v = r[i]; if (!cur || rank[v] > rank[cur]) CB.keys[n] = v; });
      CB.cur = ''; CB.justAdded = true; if (window.SFX) { const L = CB.L || 4; for (let i = 0; i < Math.min(L, 8); i++) setTimeout(() => SFX.flip(), i * 90); } else beep(800, .05);
      if (r.every(x => x === 'g')) { CB.done = 'win'; CB.winner = who; if (CB.sc[who] !== undefined) CB.sc[who] += CB.rows - CB.guesses.length + 1; }
      else if (CB.guesses.length >= CB.rows) { CB.done = 'lose'; if (CB.setter) CB.sc[CB.setter] += 3; }
      else CB.ti++;
    } else if (CB.cur.length < CB.L) CB.cur += k;
    cbPlay();
  }));
  setBtns2(cbS.row, [btn('استسلموا 🏳️', 'ghost', () => { CB.done = 'lose'; if (CB.setter) CB.sc[CB.setter] += 3; cbPlay(); })]);
}
function cbEnd() {
  const b = cbS.body; const c = el('div', 'bigcard'); c.style.marginTop = '12px';
  if (CB.done === 'win') { c.append(el('div', 'win good', '🎉 ' + CB.winner + ' جابها!'), el('div', 'lab', 'في ' + CB.guesses.length + ' محاولات')); beep(1200, .2); }
  else c.append(el('div', 'win bad', 'ما جبتوها 😅'), el('div', 'lab', CB.mode === 'num' ? 'الرقم كان' : 'الكلمة كانت'), el('div', 'txt good', CB.secret));
  c.appendChild(resList(CB.sc));
  b.appendChild(c);
  setBtns2(cbS.row, [btn('تعديل', 'ghost', () => cbSetup(CB.mode)), btn('جولة جديدة 🔄', '', cbStart, 2)]);
}

/* =================================================================
   🎯 أقرب رقم
   ================================================================= */
const clS = mkScreen('closest', '🎯 أقرب رقم');
let CL = null;
function clStart() { CL = { sc: sc0() }; clRound(); }
function clRound() { CL.q = draw('closest', CLOSEST); CL.g = {}; CL.order = shuffle(S.players); CL.i = 0; clAsk(); }
function clAsk() {
  const b = clS.body; b.innerHTML = ''; const c = el('div', 'bigcard'); b.appendChild(c);
  const add = (k, t) => { const d = el('div', k, t); c.appendChild(d); return d; };
  add('lab', 'السؤال'); add('txt', CL.q.q); const p = CL.order[CL.i]; passCard(add, p, 'اكتب تخمينك بالسر');
  const inp = el('input'); inp.type = 'number'; inp.inputMode = 'decimal'; inp.className = 'bigin'; inp.placeholder = 'رقم…'; c.appendChild(inp);
  setBtns2(clS.row, [btn('تم ✓', '', () => { const v = parseFloat(inp.value); if (isNaN(v)) { buzz(80); inp.focus(); return; } CL.g[p] = v; CL.i++; if (CL.i < CL.order.length) clAsk(); else clReveal(); })]);
  show('closest'); setTimeout(() => inp.focus(), 50);
}
function clReveal() {
  const b = clS.body; b.innerHTML = ''; const c = el('div', 'bigcard'); b.appendChild(c);
  c.append(el('div', 'lab', CL.q.q), el('div', 'lab', 'الجواب'), el('div', 'bigLetter', String(CL.q.a)), el('div', 'lab', CL.q.u));
  const arr = Object.entries(CL.g).map(([p, v]) => [p, v, Math.abs(v - CL.q.a)]).sort((a, b) => a[2] - b[2]); const best = arr[0][2];
  const r = el('div', 'reslist'); arr.forEach(([p, v, d]) => { const x = el('div', d === best ? 'best' : ''); x.append(el('span', '', p + (d === best ? ' 🏆' : '')), el('b', '', v + '  (فرق ' + (+d.toFixed(2)) + ')')); r.appendChild(x); if (d === best) CL.sc[p]++; });
  c.appendChild(r); beep(1100, .15);
  setBtns2(clS.row, [btn('النقاط', 'ghost', () => { const c2 = el('div', 'box'); c2.appendChild(resList(CL.sc)); b.appendChild(c2); }), btn('السؤال اللي بعده ←', '', clRound, 2)]);
}

/* =================================================================
   🗳️ الأغلبية
   ================================================================= */
const mjS = mkScreen('majority', '🗳️ الأغلبية');
let MJ = null;
function mjStart() { MJ = { sc: sc0() }; mjRound(); }
function mjRound() { MJ.q = draw('majority', WYR); MJ.v = {}; MJ.order = shuffle(S.players); MJ.i = 0; mjAsk(); }
function mjAsk() {
  const b = mjS.body; b.innerHTML = ''; const c = el('div', 'bigcard'); b.appendChild(c);
  const add = (k, t) => { const d = el('div', k, t); c.appendChild(d); return d; };
  add('lab', 'لو خيروك… ويش بيختار أغلب الجماعة؟'); const p = MJ.order[MJ.i]; passCard(add, p, 'اختار بالسر. اللي مع الأغلبية ياخد نقطة!');
  const o = el('div', 'opts'); MJ.q.forEach((t, k) => o.appendChild(btn(t, '', () => { MJ.v[p] = k; MJ.i++; beep(900, .05); if (MJ.i < MJ.order.length) mjAsk(); else mjReveal(); }))); c.appendChild(o);
  setBtns2(mjS.row, []); show('majority');
}
function mjReveal() {
  const b = mjS.body; b.innerHTML = ''; const c = el('div', 'bigcard'); b.appendChild(c);
  const g = [[], []]; Object.entries(MJ.v).forEach(([p, k]) => g[k].push(p));
  const win = g[0].length === g[1].length ? -1 : (g[0].length > g[1].length ? 0 : 1);
  MJ.q.forEach((t, k) => { const d = el('div', 'box'); d.style.width = '100%'; d.style.background = win === k ? 'var(--grn)' : 'var(--paper)'; d.style.color = win === k ? '#fff' : 'var(--txt)'; d.append(el('div', 'txt', t + ' (' + g[k].length + ')')); d.querySelector('.txt').style.fontSize = '20px'; d.append(el('div', '', g[k].join('، ') || '—')); c.appendChild(d); });
  if (win < 0) c.appendChild(el('div', 'win', 'تعادل! 🤝 ولا أحد ياخد نقطة')); else { g[win].forEach(p => MJ.sc[p]++); c.appendChild(el('div', 'win good', '+١ للأغلبية')); }
  c.appendChild(resList(MJ.sc)); beep(1000, .12);
  setBtns2(mjS.row, [btn('السؤال اللي بعده ←', '', mjRound)]);
}

/* =================================================================
   🔗 سلسلة الكلمات
   ================================================================= */
const chS = mkScreen('chain', '🔗 سلسلة الكلمات');
let CH2 = null;
const START_LETTERS = ['ب', 'ت', 'ج', 'ح', 'د', 'ر', 'س', 'ش', 'ع', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];
function lastLetter(w) { const s = norm(w.trim()).replace(/[^ء-ي]/g, ''); let ch = s[s.length - 1]; if (ch === 'ء') ch = s[s.length - 2] || 'ا'; return ch; }
function chStart() { CH2 = { alive: shuffle(S.players), used: new Set(), letter: pick(START_LETTERS), ptr: 0, last: '' }; chTurn(); }
function chTurn() {
  stopTimer();
  if (CH2.alive.length === 1) return chEnd();
  const p = CH2.alive[CH2.ptr];
  const b = chS.body; b.innerHTML = ''; const c = el('div', 'bigcard'); b.appendChild(c);
  c.append(el('div', 'lab', 'دور'), el('div', 'nm', p), el('div', 'lab', CH2.last ? 'الكلمة اللي قبل: ' + CH2.last : 'أول كلمة'), el('div', 'lab', 'قول كلمة تبدأ بحرف'), el('div', 'bigLetter', CH2.letter));
  const tm = el('div', 'timer'); tm.id = 'chT'; c.appendChild(tm);
  const inp = el('input'); inp.type = 'text'; inp.className = 'bigin'; inp.placeholder = 'اكتب الكلمة…'; c.appendChild(inp);
  const err = el('div', 'err', ''); c.appendChild(err);
  const submit = () => {
    const w = inp.value.trim(); if (!w) return;
    if (norm(w.replace(/^ال/, ''))[0] !== norm(CH2.letter) && norm(w)[0] !== norm(CH2.letter)) { err.textContent = 'لازم تبدأ بحرف ' + CH2.letter; buzz(100); return; }
    if (CH2.used.has(norm(w))) { err.textContent = 'هادي انقالت قبل!'; buzz(100); return; }
    if ([...w].length < 2) { err.textContent = 'كلمة أطول شوي'; return; }
    CH2.used.add(norm(w)); CH2.last = w; CH2.letter = lastLetter(w) || pick(START_LETTERS); CH2.ptr = (CH2.ptr + 1) % CH2.alive.length; beep(1000, .06); chTurn();
  };
  inp.onkeydown = e => { if (e.key === 'Enter') submit(); };
  setBtns2(chS.row, [btn('ما عرفت ❌', 'ghost', () => chOut(p)), btn('تم ✓', '', submit, 2)]);
  show('chain'); setTimeout(() => inp.focus(), 50);
  countdownTimer(TIME('chain'), 'chT', () => chOut(p));
}
function chOut(p) {
  stopTimer(); buzz(300); beep(150, .5, .25);
  const idx = CH2.alive.indexOf(p); CH2.alive.splice(idx, 1); if (idx < CH2.ptr) CH2.ptr--; if (CH2.ptr >= CH2.alive.length) CH2.ptr = 0;
  const b = chS.body; b.innerHTML = ''; const c = el('div', 'bigcard'); b.appendChild(c);
  c.append(el('div', 'win bad', p + ' طلع! 💥'), el('div', 'lab', 'باقي: ' + CH2.alive.join('، ')));
  setBtns2(chS.row, [btn(CH2.alive.length > 1 ? 'كمّلوا ←' : 'النتيجة 🏆', '', chTurn)]);
}
function chEnd() { const b = chS.body; b.innerHTML = ''; const c = el('div', 'bigcard'); b.appendChild(c); c.append(el('div', 'lab', 'الفايز'), el('div', 'win good', '🏆 ' + CH2.alive[0]), el('div', 'lab', 'عدد الكلمات: ' + CH2.used.size)); setBtns2(chS.row, [btn('جولة جديدة 🔄', '', chStart)]); }

/* =================================================================
   ⏱️ ٥ ثواني
   ================================================================= */
const fvS = mkScreen('five', '⏱️ ٥ ثواني');
let FV = null;
function fvStart() { FV = { sc: sc0(), q: turnQueue() }; fvTurn(); }
function fvTurn() {
  const p = FV.q(), t = draw('five', FIVE_SEC);
  fvS.h.textContent = '⏱️ ' + TIME('five') + ' ثواني';
  const b = fvS.body; b.innerHTML = ''; const c = el('div', 'bigcard'); b.appendChild(c);
  c.append(el('div', 'lab', 'الدور على'), el('div', 'nm', p), el('div', 'txt', t));
  const box = el('div', 'box'); box.appendChild(resList(FV.sc)); b.appendChild(box);
  setBtns2(fvS.row, [btn('ابدأ ⏱️', '', () => {
    box.remove(); const tm = el('div', 'timer'); tm.id = 'fvT'; tm.style.fontSize = '90px'; c.appendChild(tm);
    const done = () => setBtns2(fvS.row, [btn('ما لحق ❌', 'ghost', fvTurn), btn('قالها ✅', 'grn', () => { FV.sc[p]++; beep(1200, .15); fvTurn(); }, 2)]);
    setBtns2(fvS.row, [btn('خلّص بدري ✋', 'ghost', () => { stopTimer(); done(); })]);
    countdownTimer(TIME('five'), 'fvT', done);
  })]);
  show('five');
}

/* =================================================================
   💰 من سيربح المليون
   ================================================================= */
const mlS = mkScreen('million', '💰 من سيربح المليون');
const PRIZES = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];
const SAFE = [4, 9];
let MI = null;
const fmt = n => n.toLocaleString('en-US');
function milStart() {
  const b = mlS.body; b.innerHTML = ''; const c = el('div', 'bigcard'); b.appendChild(c);
  c.append(el('div', 'lab', 'منهو بيلعب؟'));
  const o = el('div', 'opts'); o.style.gridTemplateColumns = '1fr 1fr';
  (S.players.length ? S.players : ['أني']).forEach(p => o.appendChild(btn(p, '', () => { MI = { p, lvl: 0, life: { f: 1, a: 1, c: 1 } }; milQ(); })));
  c.appendChild(o); setBtns2(mlS.row, []); show('million');
}
function milPick(lvl) {
  if (lvl >= milHardFrom()) { const q = draw('milhard', MIL_HARD); return { q: q[0], r: q[1], w: q.slice(2) }; }
  const q = draw('triv', TRIVIA); return { q: q[0], r: q[1], w: q.slice(2) };
}
function milQ() {
  const Q = milPick(MI.lvl); MI.Q = Q; MI.opts = shuffle([Q.r, ...Q.w]); MI.gone = []; MI.locked = false;
  milDraw();
}
function milDraw(extra) {
  stopTimer();
  const b = mlS.body; b.innerHTML = ''; const m = el('div', 'mil'); b.appendChild(m);
  m.appendChild(el('div', 'prize', MI.p + ' · سؤال ' + (MI.lvl + 1) + ' على ' + fmt(PRIZES[MI.lvl])));
  const life = el('div', 'life');
  const lf = (k, t, fn) => { const x = btn(t, '', fn); x.disabled = !MI.life[k] || MI.locked; life.appendChild(x); };
  lf('f', '٥٠:٥٠', () => { MI.life.f = 0; MI.gone = shuffle(MI.Q.w).slice(0, 2); milDraw(); });
  lf('a', '👥 الجمهور', () => { MI.life.a = 0; milDraw('aud'); });
  lf('c', '📞 صديق', () => { MI.life.c = 0; milDraw('call'); });
  m.appendChild(life);
  m.appendChild(el('div', 'mq', MI.Q.q));
  if (extra === 'aud') {
    const pr = Math.max(.35, .75 - MI.lvl * .03), vals = {}; let left = 100 - Math.round(pr * 100); vals[MI.Q.r] = Math.round(pr * 100);
    const others = MI.opts.filter(o => o !== MI.Q.r && !MI.gone.includes(o)); others.forEach((o, i) => { const v = i === others.length - 1 ? left : rnd(left + 1); vals[o] = v; left -= v; });
    MI.gone.forEach(o => vals[o] = 0);
    const au = el('div', 'aud'); MI.opts.forEach((o, i) => { const d = el('div'); d.style.height = '0%'; d.append(el('span', '', (vals[o] || 0) + '%'), el('b', '', 'أبجد'[i])); au.appendChild(d); setTimeout(() => d.style.height = (vals[o] || 0) + '%', 50); }); m.appendChild(au);
  }
  if (extra === 'call') {
    const right = Math.random() < Math.max(.4, .9 - MI.lvl * .04); const cand = MI.opts.filter(o => !MI.gone.includes(o)); const ans = right ? MI.Q.r : pick(cand.filter(o => o !== MI.Q.r));
    const d = el('div', 'mq', '📞 رفيقك يقول: "' + (right ? 'متأكد تقريباً إنها: ' : 'أظن… يمكن: ') + ans + '"'); d.style.marginTop = '10px'; d.style.fontSize = '16px'; m.appendChild(d);
  }
  const mo = el('div', 'mo');
  MI.opts.forEach((o, i) => { const x = el('button', MI.gone.includes(o) ? 'gone' : ''); x.innerHTML = '<b>' + 'أبجد'[i] + ':</b>' + esc(o); x.onclick = () => milAnswer(o, x, mo); mo.appendChild(x); });
  m.appendChild(mo);
  const tm = el('div', 'timer'); tm.id = 'mlT'; tm.style.color = '#f5c84b'; tm.style.textAlign = 'center'; tm.style.fontSize = '40px'; tm.style.marginTop = '8px'; m.appendChild(tm);
  const lad = el('div', 'ladder'); PRIZES.slice().reverse().forEach((p, ri) => { const i = 14 - ri; lad.appendChild(el('span', (SAFE.includes(i) ? 'safe ' : '') + (i === MI.lvl ? 'now' : i < MI.lvl ? 'done' : ''), fmt(p))); }); m.appendChild(lad);
  setBtns2(mlS.row, [btn('انسحب بـ ' + fmt(MI.lvl ? PRIZES[MI.lvl - 1] : 0) + ' 🏳️', 'ghost', () => milEnd(MI.lvl ? PRIZES[MI.lvl - 1] : 0, 'انسحبت'))]);
  countdownTimer(TIME('mil'), 'mlT', () => milEnd(MI.lvl > 4 ? PRIZES[MI.lvl > 9 ? 9 : 4] : 0, 'خلص الوقت ⏰'));
}
function milAnswer(o, x, mo) {
  if (MI.locked) return; MI.locked = true; stopTimer(); x.classList.add('sel'); beep(500, .2);
  setTimeout(() => {
    mo.querySelectorAll('button').forEach(bb => { if (bb.textContent.slice(2) === MI.Q.r) bb.classList.add('ok'); });
    if (o === MI.Q.r) { beep(1200, .25); buzz(60); setTimeout(() => { if (MI.lvl === 14) milEnd(PRIZES[14], 'فزت بالمليون!! 🎉🎉'); else { MI.lvl++; milQ(); } }, 1300); }
    else { x.classList.remove('sel'); x.classList.add('no'); beep(150, .6, .3); buzz(300); setTimeout(() => milEnd(MI.lvl > 9 ? PRIZES[9] : MI.lvl > 4 ? PRIZES[4] : 0, 'جواب غلط 😢'), 1600); }
  }, 1300);
}
function milEnd(won, why) {
  stopTimer(); const best = LS.get('milBest', {}); if (!best[MI.p] || won > best[MI.p]) { best[MI.p] = won; LS.set('milBest', best); }
  const b = mlS.body; b.innerHTML = ''; const m = el('div', 'mil'); b.appendChild(m);
  m.append(el('div', 'prize', why), el('div', 'mq', MI.p + ' طلع بـ ' + fmt(won) + ' 💰'));
  const lb = el('div', 'reslist'); lb.style.marginTop = '12px'; Object.entries(best).sort((a, c) => c[1] - a[1]).forEach(([n, v]) => { const d = el('div', ''); d.append(el('span', '', n), el('b', '', fmt(v))); lb.appendChild(d); });
  m.append(el('div', 'prize', 'أحسن نتيجة لكل واحد'), lb);
  setBtns2(mlS.row, [btn('لاعب جديد 🔄', '', milStart)]);
}

/* =================================================================
   🔔 الجرس (على تلفون واحد)
   ================================================================= */
const bzS = mkScreen('buzzer', '🔔 الجرس');
const BZC = ['#c94a3b', '#1f4f8a', '#2c7a6b', '#c9861f'];
let BZ = null;
function bzSetup() {
  S.bzN = S.bzN || 2;
  const b = bzS.body; b.innerHTML = '';
  const box = el('div', 'box'); box.appendChild(stepper('چم لاعب أو فريق (على نفس التلفون)', () => S.bzN, v => S.bzN = v, () => 2, () => 4));
  const nb = el('div', 'box'); nb.appendChild(el('h2', '', 'الأسامي'));
  S.bzNames = S.bzNames || [];
  for (let i = 0; i < 4; i++) { const inp = el('input'); inp.type = 'text'; inp.style.width = '100%'; inp.style.marginBottom = '6px'; inp.value = S.bzNames[i] || S.players[i] || ('لاعب ' + (i + 1)); inp.oninput = () => { S.bzNames[i] = inp.value; save(); }; S.bzNames[i] = inp.value; nb.appendChild(inp); }
  const info = el('div', 'box'); info.style.color = 'var(--mut)'; info.style.fontSize = '14px'; info.textContent = 'حطوا التلفون بالنص، كل واحد ياخد زاوية. يطلع سؤال، وأول واحد يضغط زره يجاوب. عندكم ' + TIME('buzz') + ' ثانية لكل سؤال.';
  b.append(box, nb, info);
  setBtns2(bzS.row, [btn('ابدأ 🔔', '', () => { BZ = { n: S.bzN, names: S.bzNames.slice(0, S.bzN), sc: Array(S.bzN).fill(0) }; bzQ(); })]);
  show('buzzer');
}
function bzPickQ() { const cats = Object.keys(SJ); const c = draw('bzcat', cats); const l = pick([200, 200, 400]); const q = draw('sj_' + c + '_' + l, SJ[c][l]); return { q: q.q, a: q.a, c }; }
function bzQ() {
  BZ.q = bzPickQ(); BZ.lock = null; BZ.out = [];
  let ar = $('bzArena'); if (ar) ar.remove();
  ar = el('div', 'buzzArena p' + BZ.n); ar.id = 'bzArena'; bzS.el.appendChild(ar); BZ.revealed = false;
  const mk = i => { const b = el('button', 'bz'); b.style.background = BZC[i]; b.append(el('span', '', BZ.names[i]), el('span', 'sc', BZ.sc[i])); if ((BZ.n === 2 && i === 0) || (BZ.n > 2 && i < 2)) b.classList.add('flipped'); b.addEventListener('pointerdown', e => { e.preventDefault(); bzHit(i); }); b.dataset.i = i; return b; };
  const mid = el('div', 'bzMid'); mid.id = 'bzMid';
  if (BZ.n === 2) ar.append(mk(0), mid, mk(1));
  else { ar.append(mk(0), mk(1), mid, mk(2)); if (BZ.n === 4) ar.appendChild(mk(3)); else { const e = el('div'); ar.appendChild(e); } }
  bzMid();
}
function bzMid(msg) {
  const mid = $('bzMid'); mid.innerHTML = '';
  mid.append(el('div', 'lab', BZ.q.c), el('div', 'q', BZ.q.q));
  const tm = el('div', 'timer'); tm.id = 'bzT'; tm.style.fontSize = '28px';
  if (msg) mid.appendChild(el('div', 'win', msg)); else mid.appendChild(tm);
  const row = el('div', 'row');
  if (BZ.lock !== null) { row.append(btn('✅ صح', 'grn', () => bzJudge(true)), btn('❌ غلط', 'red', () => bzJudge(false))); }
  else row.append(btn('اكشف الجواب', 'ghost', bzReveal), btn('خروج', 'ghost', bzExit));
  mid.appendChild(row);
  if (!msg && BZ.lock === null) countdownTimer(TIME('buzz'), 'bzT', bzReveal);
}
function bzHit(i) {
  if (BZ.lock !== null || BZ.out.includes(i) || BZ.revealed) return;
  BZ.lock = i; stopTimer(); beep(1400, .25, .3); buzz(150);
  document.querySelectorAll('.bz').forEach(b => { if (+b.dataset.i !== i) b.classList.add('lock'); else b.classList.add('win'); });
  bzMid('🔔 ' + BZ.names[i] + ' يجاوب!');
}
function bzJudge(ok) {
  const i = BZ.lock;
  if (ok) { BZ.sc[i]++; beep(1200, .2); bzReveal(BZ.names[i] + ' +١ 🎉'); return; }
  beep(200, .3); BZ.out.push(i); BZ.lock = null;
  document.querySelectorAll('.bz').forEach(b => { b.classList.remove('lock', 'win'); if (BZ.out.includes(+b.dataset.i)) b.classList.add('lock'); });
  if (BZ.out.length >= BZ.n) bzReveal('ولا أحد جابها'); else bzMid();
}
function bzReveal(msg) {
  stopTimer(); BZ.revealed = true;
  const mid = $('bzMid'); mid.innerHTML = '';
  mid.append(el('div', 'q', BZ.q.q), el('div', 'a', '✔ ' + BZ.q.a));
  if (typeof msg === 'string') mid.appendChild(el('div', 'lab', msg));
  document.querySelectorAll('.bz .sc').forEach((s, k) => s.textContent = BZ.sc[+s.parentNode.dataset.i]);
  const row = el('div', 'row'); row.append(btn('خروج', 'ghost', bzExit), btn('السؤال اللي بعده ←', '', () => { BZ.revealed = false; bzQ(); })); mid.appendChild(row);
}
function bzExit() { stopTimer(); const a = $('bzArena'); if (a) a.remove(); const b = bzS.body; b.innerHTML = ''; const c = el('div', 'bigcard'); c.appendChild(el('div', 'lab', 'النتيجة')); const sc = {}; BZ.names.forEach((n, i) => sc[n] = BZ.sc[i]); c.appendChild(resList(sc)); b.appendChild(c); setBtns2(bzS.row, [btn('تعديل', 'ghost', bzSetup), btn('لعبة جديدة 🔄', '', () => { BZ.sc = BZ.sc.map(() => 0); bzQ(); }, 2)]); show('buzzer'); }

/* =================================================================
   🚩 خمن الدولة (علم أو إيموجي)
   ================================================================= */
const flS = mkScreen('flags', '🚩 خمن الدولة');
let FL = null;
function flSetup() {
  S.flMode = S.flMode || 'mix';
  const b = flS.body; b.innerHTML = '';
  const box = el('div', 'box'); box.appendChild(el('h2', '', 'نوع الأسئلة'));
  const ch = el('div', 'chips'); [['flag', '🚩 أعلام'], ['emoji', '😀 إيموجي'], ['mix', '🔀 مخلوط']].forEach(([k, l]) => { const c = el('button', 'chip' + (S.flMode === k ? ' sel' : ''), l); c.onclick = () => { S.flMode = k; save(); flSetup(); }; ch.appendChild(c); });
  box.appendChild(ch); b.appendChild(box);
  setBtns2(flS.row, [btn('ابدأ ▶', '', () => { FL = { sc: sc0(), q: turnQueue() }; flQ(); })]);
  show('flags');
}
function flQ() {
  const mode = S.flMode === 'mix' ? (Math.random() < .55 ? 'flag' : 'emoji') : S.flMode;
  const p = S.players.length ? FL.q() : 'إنت';
  let shown, right, pool;
  if (mode === 'flag') { const f = draw('flags', FLAGS); shown = el('div', 'flagBig', flagEmoji(f.code)); right = f.name; pool = FLAGS.map(x => x.name); }
  else { const f = draw('emojic', EMOJI_COUNTRIES); shown = el('div', 'emojiBig', f.e); right = f.name; pool = FLAGS.map(x => x.name).concat(EMOJI_COUNTRIES.map(x => x.name)); }
  const opts = shuffle([right, ...shuffle([...new Set(pool)].filter(x => x !== right)).slice(0, 3)]);
  const b = flS.body; b.innerHTML = ''; const c = el('div', 'bigcard'); b.appendChild(c);
  c.append(el('div', 'lab', 'السؤال لـ'), el('div', 'nm', p), el('div', 'lab', mode === 'flag' ? 'علم أي دولة؟' : 'أي دولة يوصفونها هالإيموجي؟'), shown);
  const tm = el('div', 'timer'); tm.id = 'flT'; tm.style.fontSize = '36px'; c.appendChild(tm);
  const o = el('div', 'opts'); o.style.gridTemplateColumns = '1fr 1fr';
  const fin = (chosen) => { stopTimer(); o.querySelectorAll('button').forEach(bb => { bb.disabled = true; if (bb.textContent === right) bb.className = 'ok'; else if (bb.textContent === chosen) bb.className = 'no'; }); if (chosen === right) { if (FL.sc[p] !== undefined) FL.sc[p]++; beep(1200, .15); } else beep(200, .3); setBtns2(flS.row, [btn('النقاط', 'ghost', () => { const bx = el('div', 'box'); bx.appendChild(resList(FL.sc)); b.appendChild(bx); }), btn('اللي بعده ←', '', flQ, 2)]); };
  opts.forEach(x => o.appendChild(btn(x, '', () => fin(x))));
  c.appendChild(o); setBtns2(flS.row, []);
  countdownTimer(TIME('flag'), 'flT', () => fin(null));
}

/* =================================================================
   🔀 الحروف المخربطة
   ================================================================= */
const srS = mkScreen('scramble', '🔀 الحروف المخربطة');
let SR = null;
function srStart() { SR = { sc: sc0() }; srQ(); }
function srWord() {
  for (let k = 0; k < 50; k++) { const [c, w] = topicWord(Object.keys(TOPICS)); const n = [...w].length; if (!/\s|\(/.test(w) && n >= 3 && n <= 7) return [c, w]; }
  return ['حيوانات 🐾', 'زرافة'];
}
function srQ() {
  const [c, w] = srWord(); let letters = [...w], sh;
  for (let k = 0; k < 10; k++) { sh = shuffle(letters); if (sh.join('') !== w) break; }
  SR.w = w; SR.c = c; SR.hint = 0;
  const b = srS.body; b.innerHTML = ''; const card = el('div', 'bigcard'); b.appendChild(card);
  card.append(el('div', 'lab', 'الموضوع: ' + c), el('div', 'lab', 'رتّبوا الحروف! أول واحد يعرفها يصارخ 🗣️'));
  const s = el('div', 'scr'); sh.forEach((ch, i) => { const sp = el('span', '', ch); sp.style.animationDelay = (i * 0.06) + 's'; s.appendChild(sp); }); card.appendChild(s);
  const hint = el('div', 'hintx hidden', ''); card.appendChild(hint);
  const tm = el('div', 'timer'); tm.id = 'srT'; card.appendChild(tm);
  const reveal = (who) => { stopTimer(); card.querySelectorAll('.opts').forEach(x => x.remove()); card.append(el('div', 'lab', 'الكلمة'), el('div', 'txt good', w), el('div', 'desc', descOf(c, w))); if (who) { SR.sc[who]++; card.appendChild(el('div', 'win good', '+١ لـ ' + who)); beep(1200, .15); } setBtns2(srS.row, [btn('النقاط', 'ghost', () => { const bx = el('div', 'box'); bx.appendChild(resList(SR.sc)); b.appendChild(bx); }), btn('كلمة جديدة ←', '', srQ, 2)]); };
  card.appendChild(el('div', 'lab', 'منهو جابها؟'));
  const o = el('div', 'opts'); o.style.gridTemplateColumns = '1fr 1fr'; S.players.forEach(p => o.appendChild(btn(p, '', () => reveal(p)))); card.appendChild(o);
  setBtns2(srS.row, [btn('💡 تلميح', 'ghost', () => { SR.hint = Math.min(SR.hint + 1, [...w].length - 1); hint.classList.remove('hidden'); hint.textContent = 'تبدأ بـ: ' + [...w].slice(0, SR.hint).join(''); }), btn('اكشف 👀', '', () => reveal(null), 1.3)]);
  show('scramble'); countdownTimer(TIME('scr'), 'srT', () => reveal(null));
}

/* =================================================================
   ❌⭕ إكس أو
   ================================================================= */
const xoS = mkScreen('xo', '❌⭕ إكس أو');
let XO = null;
const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
const winOf = b => { for (const l of LINES) if (b[l[0]] && b[l[0]] === b[l[1]] && b[l[1]] === b[l[2]]) return l; return null; };
const SVGX = '<svg viewBox="0 0 100 100"><path class="dx" d="M20 20 L80 80 M80 20 L20 80" stroke="#c94a3b" stroke-width="14" stroke-linecap="round" fill="none"/></svg>';
const SVGO = '<svg viewBox="0 0 100 100"><circle class="do" cx="50" cy="50" r="30" stroke="#1f4f8a" stroke-width="13" fill="none"/></svg>';
function xoSetup() {
  S.xoMode = S.xoMode || 'pvp';
  const b = xoS.body; b.innerHTML = '';
  const box = el('div', 'box'); box.appendChild(el('h2', '', 'ضد منهو؟'));
  const ch = el('div', 'chips'); [['pvp', '👥 لاعبين'], ['easy', '🤖 كمبيوتر سهل'], ['hard', '🧠 كمبيوتر صعب']].forEach(([k, l]) => { const c = el('button', 'chip' + (S.xoMode === k ? ' sel' : ''), l); c.onclick = () => { S.xoMode = k; save(); xoSetup(); }; ch.appendChild(c); });
  box.appendChild(ch); b.appendChild(box);
  setBtns2(xoS.row, [btn('ابدأ ▶', '', () => { XO = { sc: { X: 0, O: 0, '=': 0 }, first: 'X' }; xoNew(); })]);
  show('xo');
}
function xoNew() { XO.b = Array(9).fill(null); XO.t = XO.first; XO.over = false; XO.first = XO.first === 'X' ? 'O' : 'X'; xoDraw(); if (S.xoMode !== 'pvp' && XO.t === 'O') setTimeout(xoBot, 500); }
function xoName(s) { if (S.xoMode !== 'pvp') return s === 'X' ? 'إنت' : 'الكمبيوتر'; const p = S.players; return s === 'X' ? (p[0] || 'إكس') : (p[1] || 'أو'); }
function xoDraw(line) {
  const b = xoS.body; b.innerHTML = '';
  const hd = el('div', 'tscore'); [['X', '#c94a3b'], ['O', '#1f4f8a']].forEach(([s, c]) => { const d = el('div', 'tbox' + (XO.t === s && !XO.over ? ' turn' : '')); const n = el('div', 'tn', (s === 'X' ? '❌ ' : '⭕ ') + xoName(s)); d.append(n, el('div', 'ts', XO.sc[s])); hd.appendChild(d); }); b.appendChild(hd);
  const g = el('div', 'xo');
  XO.b.forEach((v, i) => { const c = el('button', line && line.includes(i) ? 'w' : ''); if (v) c.innerHTML = v === 'X' ? SVGX : SVGO; c.onclick = () => xoMove(i, true); g.appendChild(c); });
  b.appendChild(g);
  const st = el('div', 'sub', XO.over ? XO.msg : 'دور ' + xoName(XO.t)); st.style.fontSize = '20px'; b.appendChild(st);
  setBtns2(xoS.row, XO.over ? [btn('تعديل', 'ghost', xoSetup), btn('جولة جديدة 🔄', '', xoNew, 2)] : [btn('تعادلات: ' + XO.sc['='], 'ghost', () => { })]);
}
function xoMove(i, human) {
  if (XO.over || XO.b[i]) return; if (human && S.xoMode !== 'pvp' && XO.t === 'O') return;
  XO.b[i] = XO.t; if (window.SFX) SFX.place(); else beep(700, .06);
  const w = winOf(XO.b);
  if (w) { XO.over = true; XO.sc[XO.t]++; XO.msg = '🎉 ' + xoName(XO.t) + ' فاز!'; beep(1200, .2); return xoDraw(w); }
  if (XO.b.every(x => x)) { XO.over = true; XO.sc['=']++; XO.msg = 'تعادل 🤝'; return xoDraw(); }
  XO.t = XO.t === 'X' ? 'O' : 'X'; xoDraw();
  if (S.xoMode !== 'pvp' && XO.t === 'O') setTimeout(xoBot, 450);
}
function minimax(b, me) {
  const w = winOf(b); if (w) return { s: b[w[0]] === 'O' ? 10 : -10 }; if (b.every(x => x)) return { s: 0 };
  let best = { s: me === 'O' ? -99 : 99, i: -1 };
  b.forEach((v, i) => { if (v) return; b[i] = me; const r = minimax(b, me === 'O' ? 'X' : 'O'); b[i] = null; const s = r.s - Math.sign(r.s) * 0; if (me === 'O' ? s > best.s : s < best.s) best = { s, i }; });
  return best;
}
function xoBot() {
  if (XO.over) return; const free = XO.b.map((v, i) => v ? -1 : i).filter(i => i >= 0);
  let i;
  if (S.xoMode === 'easy' && Math.random() < .55) i = pick(free); else i = minimax(XO.b.slice(), 'O').i;
  if (i < 0 || i === undefined) i = pick(free);
  xoMove(i, false);
}

/* ---------- تسجيل الألعاب ---------- */
const at = (id, g) => { const k = GAMES.findIndex(x => x.id === id); GAMES.splice(k >= 0 ? k + 1 : GAMES.length, 0, g); };
at('sj', { id: 'mil', e: '💰', n: 'من سيربح المليون', d: '١٥ سؤال لين المليون ووسائل مساعدة', min: 0, t: '١٠ دقايق' });
at('mil', { id: 'buzz', e: '🔔', n: 'الجرس', d: 'أسرع واحد يضغط يجاوب', min: 0, t: 'مفتوح' });
at('feud', { id: 'whosaid', e: '🎤', n: 'منهو قالها؟', d: 'كل واحد يكتب بالسر… وتخمنون منهو', min: 3, t: '١٠ دقايق' });
at('whosaid', { id: 'major', e: '🗳️', n: 'الأغلبية', d: 'كن مع الأغلبية تاخد نقطة', min: 3, t: 'مفتوح' });
at('major', { id: 'closest', e: '🎯', n: 'أقرب رقم', d: 'اللي تخمينه أقرب ياخد النقطة', min: 2, t: 'مفتوح' });
at('closest', { id: 'num', e: '🔐', n: 'الرقم السري', d: 'من ٣ لين ٨ خانات… خمّنوه', min: 0, t: '٥ دقايق' });
at('num', { id: 'word', e: '🔤', n: 'الكلمة السرية', d: 'وردل بالعربي: ٣ أو ٤ أو ٥ حروف', min: 0, t: '٥ دقايق' });
at('word', { id: 'flags', e: '🚩', n: 'خمن الدولة', d: 'من العلم أو الإيموجي', min: 0, t: 'مفتوح' });
at('flags', { id: 'scr', e: '🔀', n: 'الحروف المخربطة', d: 'رتبوا الحروف قبل الوقت', min: 2, t: 'مفتوح' });
at('scr', { id: 'chain', e: '🔗', n: 'سلسلة الكلمات', d: 'كلمة تبدأ بآخر حرف… بسرعة!', min: 2, t: 'مفتوح' });
at('chain', { id: 'five', e: '⏱️', n: '٥ ثواني', d: 'قول ٣ أشياء قبل لا يخلص الوقت', min: 2, t: 'مفتوح' });
at('five', { id: 'xo', e: '❌', n: 'إكس أو', d: 'ضد رفيقك أو الكمبيوتر', min: 0, t: 'دقيقة' });
Object.assign(RULES, {
  mil: ['اختاروا منهو بيلعب. فيه ١٥ سؤال، كل واحد أصعب من اللي قبله، لين المليون.', 'كل سؤال له ٤ خيارات ووقت محدد (تعدله من ⚙️).', 'وسائل المساعدة مرة وحدة: ٥٠:٥٠ يشيل جوابين غلط، 👥 الجمهور يعطيك نسب، 📞 صديق يقول لك ويش يظن.', 'المحطات الآمنة: ١٠٠٠ و٣٢٠٠٠. إدا غلطت ترجع لآخر محطة آمنة.', 'تقدر تنسحب بأي وقت وتاخد اللي جمعته.'],
  buzz: ['اختاروا چم لاعب أو فريق (٢ لين ٤)، وحطوا التلفون بالنص. كل واحد له زر ملوّن.', 'يطلع سؤال بالنص، وأول واحد يضغط زره يجاوب بصوت عالي.', 'اللي يدير اللعبة يضغط ✅ صح أو ❌ غلط. إدا غلط، ينقفل زره والباقين يقدرون يضغطون.', 'كل جواب صح بنقطة.'],
  whosaid: ['يطلع سؤال، مثل "ويش أغرب أكلة جربتها؟".', 'التلفون يدور: كل واحد يكتب جوابه بالسر.', 'بعدين الأجوبة تطلع وحدة وحدة، وكل مرة واحد يخمن منهو كاتب الجواب.', 'إدا خمن صح ياخد نقطة. وإدا غلط، صاحب الجواب ياخد نقطة لأنه ضيّعه 😏'],
  major: ['يطلع سؤال "لو خيروك" بخيارين.', 'التلفون يدور وكل واحد يختار بالسر.', 'اللي يطلع مع الأغلبية ياخد نقطة. يعني فكر: ويش بيختارون الباقين؟'],
  closest: ['يطلع سؤال جوابه رقم، مثل "چم طول برج خليفة؟".', 'التلفون يدور وكل واحد يكتب تخمينه بالسر.', 'اللي تخمينه أقرب للجواب الصح ياخد نقطة.'],
  num: ['اختاروا عدد الخانات (من ٣ لين ٨)، ومنهو يختار الرقم: التطبيق أو لاعب بالسر.', 'تتناوبون على التخمين، وبعد كل تخمين الألوان تقول لكم: 🟩 الرقم في مكانه، 🟨 موجود بس بمكان ثاني. اللي ما يتلون ما نقول لكم عنه شي!', 'عندكم ٨ محاولات. اللي يجيبه ياخد نقاط أكثر كل ما كان أسرع. وإدا ما جبتوه، اللي اختاره ياخد ٣ نقاط.'],
  word: ['نفس فكرة "وردل" بس بالعربي: كلمة من ٣ أو ٤ أو ٥ حروف.', 'التطبيق يختار الكلمة، أو لاعب يكتبها بالسر.', 'تتناوبون على التخمين: 🟩 الحرف في مكانه، 🟨 موجود بمكان ثاني، والكيبورد يتلون وياكم. اللي ما يتلون ما نقول لكم عنه شي.', 'الهمزات والتاء المربوطة تنحسب مثل أخواتها (أ=ا، ة=ه، ى=ي). عندكم ٦ محاولات.'],
  flags: ['اختاروا: أعلام، أو إيموجي (مثل 🍕🍝🛵 = إيطاليا)، أو مخلوط.', 'كل واحد بدوره يجاوب من ٤ خيارات قبل لا يخلص الوقت.', 'كل جواب صح بنقطة.'],
  scr: ['تطلع كلمة حروفها ملخبطة ووياها الموضوع.', 'أول واحد يعرفها يصارخ فيها، واضغطوا على اسمه ياخد نقطة.', 'إدا علقتوا، اضغطوا 💡 تلميح يطلع لكم أول حرف.'],
  chain: ['كل واحد بدوره يكتب كلمة تبدأ بآخر حرف من الكلمة اللي قبلها.', 'عندك وقت قصير (تعدله من ⚙️)، وممنوع تكرر كلمة انقالت.', 'اللي يخلص وقته أو ما يعرف يطلع، وآخر واحد يبقى هو الفايز.', 'كلمة تبدأ بـ "ال" مقبولة إدا اللي بعدها يبدأ بالحرف المطلوب.'],
  five: ['يطلع لك تحدي مثل "قول ٣ أنواع سيارات".', 'اضغط ابدأ، وعندك ٥ ثواني بس (تقدر تغير الوقت من ⚙️).', 'إدا قلتها كلها قبل لا يخلص الوقت، الجماعة يضغطون ✅ وتاخد نقطة.'],
  xo: ['لاعبين على نفس التلفون، أو ضد الكمبيوتر (سهل أو صعب).', 'أول واحد يكمّل ٣ بخط (عرض أو طول أو مايل) يفوز.']
});
Object.assign(window.EXTRA, {
  mil: milStart, buzz: bzSetup, whosaid: whoStart, major: mjStart, closest: clStart, num: () => cbSetup('num'), word: () => cbSetup('word'),
  flags: flSetup, scr: srStart, chain: chStart, five: fvStart, xo: xoSetup
});
window.__t3 = () => ({ WS, CB, CL, MJ, CH2, FV, MI, BZ, FL, SR, XO, score, norm, lastLetter });
renderHome();
})();
