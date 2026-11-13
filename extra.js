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
    if (t.life) { const l = el('div', 'tl'); [['swap', '🔄'], ['dbl', '✖️٢'], ['hint', '💡']].forEach(([k, e]) => { const s = el('span', t.life[k] ? '' : 'used', e); l.appendChild(s); }); d.appendChild(l); }
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
.dblx{background:var(--red);color:var(--cream);border-radius:999px;padding:0 12px;font-family:'Lalezar'}
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
.bottlebox .nm{position:absolute;transform:translate(-50%,-50%);background:var(--card);border:2px solid var(--line);border-radius:999px;padding:2px 10px;font-weight:700;font-size:14px;white-space:nowrap;box-shadow:2px 2px 0 var(--line);transition:.3s}
.bottlebox .nm.hitA{background:var(--grn);color:#fff;transform:translate(-50%,-50%) scale(1.25)}
.bottlebox .nm.hitB{background:var(--red);color:#fff;transform:translate(-50%,-50%) scale(1.25)}
.bottle{position:absolute;left:50%;top:50%;width:46px;height:170px;margin:-85px 0 0 -23px;transition:transform 3.2s cubic-bezier(.12,.75,.15,1)}
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
const DRAW_CATS = ['حيوانات 🐾', 'أكل وشرب 🍽️', 'نباتات وفواكه وخضار 🌿', 'سيارات ومواصلات 🚗', 'أماكن 📍', 'أغراض وأجهزة 🏠', 'جسم الإنسان 🫀', 'فضاء وطبيعة 🌙', 'مهن 👨‍⚕️', 'ملابس وماركات 👕', 'شخصيات كرتون 📺'].filter(c => TOPICS[c]);
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
    ? '<div class="emo">🤫</div><div class="t2 bad">أنت الامبوستر!</div><div class="t1">' + (S.hint ? 'الموضوع: <b>' + esc(cat) + '</b>' : 'ارسم شي عام وحاول تفهم وش يرسمون') + '</div>'
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
  const w = Math.min(window.innerWidth - 32, 488), h = Math.round(w * 1.15);
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
function sjSetup() {
  S.sjcats = (S.sjcats || []).filter(c => SJ[c]);
  const b = sjS.body; b.innerHTML = '';
  const tb = el('div', 'box'); teamInputs(tb);
  const cb = el('div', 'box'); const h = el('h2', '', ''); const cnt = el('span', '', ''); h.append(cnt);
  const rnd6 = btn('🎲 عشوائي', 'ghost small', () => { S.sjcats = []; const used = new Set(); while (S.sjcats.length < 6) { const c = draw('sjcats', SJCATS); if (!used.has(c)) { used.add(c); S.sjcats.push(c); } } sjSetup(); }); rnd6.style.flex = 'none'; h.appendChild(rnd6);
  const chips = el('div', 'chips'); cb.append(h, chips);
  const upd = () => { cnt.textContent = 'المواضيع (' + S.sjcats.length + ' من ٦)'; save(); };
  chipSet(chips, SJCATS, S.sjcats, 6, upd); upd();
  const err = el('div', 'err', '');
  b.append(tb, cb, err);
  setBtns2(sjS.row, [btn('ابدأ 🎯', '', () => { if (S.sjcats.length < 1) { err.textContent = 'اختار موضوع واحد على الأقل'; return; } sjStart(); })]);
  show('sjSetup');
}
function sjStart() {
  const cats = S.sjcats.slice(), cells = {};
  cats.forEach(c => { cells[c] = {}; [200, 400, 600].forEach(l => { const a = draw('sj_' + c + '_' + l, SJ[c][l]); let b2 = draw('sj_' + c + '_' + l, SJ[c][l]); cells[c][l] = [a, b2]; }); });
  SG = { cats, cells, used: {}, turn: 0, teams: teamNames().map(n => ({ n, s: 0, life: { swap: 1, dbl: 1, hint: 1 } })) };
  sjBoard();
}
function sjBoard() {
  const b = sjB.body; b.innerHTML = '';
  const hd = el('div', ''); scoreHead(hd, SG.teams, SG.turn); b.appendChild(hd);
  b.appendChild(el('div', 'sub', 'دور ' + SG.teams[SG.turn].n + ': اختاروا سؤال'));
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
  setBtns2(sjB.row, [btn('إنهاء اللعبة 🏁', 'ghost', sjEnd)]);
  show('sjBoard');
  if (!left) sjEnd();
}
function sjAsk(c, l, i) {
  const t = SG.teams[SG.turn]; let q = SG.cells[c][l][i]; let dbl = false, hint = false, revealed = false;
  const render = () => {
    stopTimer();
    const b = sjQ.body; b.innerHTML = '';
    const hd = el('div', ''); scoreHead(hd, SG.teams, SG.turn); b.appendChild(hd);
    const card = el('div', 'bigcard'); b.appendChild(card);
    const tag = el('div', 'lab', c + ' · ' + l + ' نقطة'); card.appendChild(tag);
    if (dbl) card.appendChild(el('span', 'dblx', 'دبل ✖️٢ = ' + (l * 2)));
    card.appendChild(el('div', 'txt', q.q));
    if (hint && q.h) card.appendChild(el('div', 'hintx', '💡 ' + q.h));
    if (!revealed) {
      const tm = el('div', 'timer'); tm.id = 'sjT'; card.appendChild(tm); countdownTimer(60, 'sjT', () => {});
      const life = el('div', 'life');
      const bs = btn('🔄 غيّر', 'ghost', () => { if (!t.life.swap) return; t.life.swap = 0; q = draw('sj_' + c + '_' + l, SJ[c][l]); render(); });
      const bd = btn('✖️٢ دبل', 'ghost', () => { if (!t.life.dbl) return; t.life.dbl = 0; dbl = true; render(); });
      const bh = btn('💡 تلميح', 'ghost', () => { if (!t.life.hint) return; t.life.hint = 0; hint = true; render(); });
      bs.disabled = !t.life.swap; bd.disabled = !t.life.dbl || dbl; bh.disabled = !t.life.hint || hint;
      life.append(bs, bd, bh); card.appendChild(el('div', 'lab', 'وسائل المساعدة لـ ' + t.n + ' (مرة وحدة باللعبة):')); card.appendChild(life);
      setBtns2(sjQ.row, [btn('اكشف الجواب 👀', '', () => { revealed = true; render(); })]);
    } else {
      card.appendChild(el('div', 'lab', 'الجواب'));
      card.appendChild(el('div', 'ans', q.a));
      card.appendChild(el('div', 'lab', 'مين جاوب صح؟'));
      const done = who => {
        SG.used[c + '|' + l + '|' + i] = 1;
        if (who !== null) { SG.teams[who].s += (who === SG.turn && dbl) ? l * 2 : l; beep(1200, .15); } else beep(250, .25);
        SG.turn = 1 - SG.turn; sjBoard();
      };
      setBtns2(sjQ.row, [btn(SG.teams[0].n + ' ✅', 'grn', () => done(0)), btn(SG.teams[1].n + ' ✅', 'grn', () => done(1)), btn('ولا أحد ❌', 'ghost', () => done(null))]);
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
      FG.open[i] = true; FG.bank += a.p; beep(1100, .12);
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
    card.appendChild(el('div', 'lab', 'اللي يضغط الجرس أول ويجاوب أحسن، فريقه يلعب. مين بيلعب؟'));
    setBtns2(fP.row, FG.teams.map((t, i) => btn(t.n + ' 🎤', '', () => { FG.play = i; FG.phase = 'play'; feudDraw(); })));
  } else if (FG.phase === 'play') {
    card.appendChild(el('div', 'lab', 'لما يقولون جواب موجود، اضغطوا عليه. إذا غلط، اضغطوا ✖'));
    setBtns2(fP.row, [btn('✖ غلط', 'red', () => { FG.strikes++; beep(140, .5, .3); buzz(300); if (FG.strikes >= 3) { FG.phase = 'steal'; } feudDraw(); })]);
  } else if (FG.phase === 'steal') {
    card.appendChild(el('div', 'lab', '٣ أغلاط! فرصة ' + FG.teams[1 - FG.play].n + ' يسرقون النقاط بجواب واحد. إذا جاوبوا صح اضغطوا على الجواب.'));
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
function renderDie(cv, sides, q, label) {
  const sh = SHAPES[sides], x = cv.getContext('2d'), W = cv.width, H = cv.height, R = W * 0.36;
  x.clearRect(0, 0, W, H);
  const pv = sh.v.map(p => Qt.rot(q, p));
  const base = DCOL[sides], light = V.norm([-0.4, -0.6, 1]);
  const vis = sh.faces.map((f, i) => ({ i, f, n: Qt.rot(q, f.n), c: Qt.rot(q, f.c) })).filter(o => o.n[2] > 0.02).sort((a, b) => a.c[2] - b.c[2]);
  const P = p => [W / 2 + p[0] * R, H / 2 - p[1] * R];
  // ظل
  x.fillStyle = 'rgba(0,0,0,.18)'; x.beginPath(); x.ellipse(W / 2 + 6, H / 2 + R * 1.05, R * .8, R * .18, 0, 0, 7); x.fill();
  vis.forEach(o => {
    const sh2 = Math.max(.35, V.dot(o.n, light));
    x.beginPath(); o.f.f.forEach((vi, k) => { const p = P(pv[vi]); k ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]); }); x.closePath();
    x.fillStyle = shade(base, sh2); x.fill(); x.strokeStyle = 'rgba(0,0,0,.55)'; x.lineWidth = W / 110; x.stroke();
    const c = P(o.c), num = label(o.i), fs = W * (sides >= 12 ? .12 : sides === 10 ? .12 : .17) * (0.55 + 0.45 * o.n[2]);
    x.font = 'bold ' + fs + 'px Lalezar, Tajawal, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillStyle = sides === 6 ? '#2b1d12' : '#fff'; x.globalAlpha = Math.min(1, o.n[2] * 1.6);
    x.fillText(num + ((num === 6 || num === 9) && sides > 6 ? '.' : ''), c[0], c[1]); x.globalAlpha = 1;
  });
}
function shade(hex, k) { const n = parseInt(hex.slice(1), 16); const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255; const f = v => Math.round(Math.min(255, v * (0.55 + 0.6 * k))); return 'rgb(' + f(r) + ',' + f(g) + ',' + f(b) + ')'; }
const dcS = mkScreen('dice', '🎲 النرد');
let DICE = [];
function diceScreen() {
  S.dside = S.dside || 6; S.dcount = S.dcount || 1;
  const b = dcS.body; b.innerHTML = '';
  const box = el('div', 'box'); const ch = el('div', 'chips');
  [4, 6, 8, 10, 12, 20].forEach(n => { const c = el('button', 'chip' + (S.dside === n ? ' sel' : ''), 'D' + n); c.onclick = () => { S.dside = n; save(); diceScreen(); }; ch.appendChild(c); });
  box.append(el('h2', '', 'نوع النرد'), ch, stepper('كم نرد', () => S.dcount, v => { S.dcount = v; diceScreen(); }, () => 1, () => 4));
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
function targetQ(d, val) { const f = SHAPES[d.sides].faces[val - 1]; let q = Qt.fromTo(f.n, [0, 0, 1]); q = Qt.mul(Qt.axis([0, 0, 1], (Math.random() - .5) * 0.8), q); q = Qt.mul(Qt.axis([1, -1, 0], d.sides === 4 ? 0.2 : 0.32), q); return Qt.norm(q); }
let rolling = false;
function rollDice() {
  if (rolling) return; rolling = true; $('dTot').textContent = '';
  const T1 = 900, T2 = 550, t0 = performance.now();
  DICE.forEach(d => { d.qe = d.q; d.val = 1 + rnd(d.sides); d.tq = targetQ(d, d.val); d.ax = V.norm([Math.random() - .5, Math.random() - .5, Math.random() - .5]); d.sp = 18 + Math.random() * 10; d.q0 = d.q; });
  let lastTick = 0;
  const frame = now => {
    const t = now - t0;
    DICE.forEach(d => {
      if (t < T1) { const k = 1 - t / T1; d.q = Qt.norm(Qt.mul(Qt.axis(d.ax, d.sp * k * 0.016), d.q)); d.qe = d.q; }
      else { const u = Math.min(1, (t - T1) / T2), e = 1 - Math.pow(1 - u, 3); d.q = Qt.slerp(d.qe, d.tq, e); }
      renderDie(d.cv, d.sides, d.q, fi => fi + 1);
    });
    if (t - lastTick > 90 && t < T1) { beep(300 + Math.random() * 300, .03, .06); lastTick = t; }
    if (t < T1 + T2) requestAnimationFrame(frame);
    else { rolling = false; buzz(60); const vals = DICE.map(d => d.val); $('dTot').textContent = vals.length > 1 ? vals.join(' + ') + ' = ' + vals.reduce((a, b) => a + b) : vals[0]; }
  };
  requestAnimationFrame(frame);
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
  const W = Math.min(window.innerWidth - 32, 488), gap = W / CP.n;
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
  $('cpInfo').textContent = 'ركّز… الكورة تحت هذا الكوب 👀';
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
    beep(500 + rnd(200), .03, .05);
    await Promise.all([pa, pb]); A.style.transform = 'translate(' + xb + 'px,0)'; B.style.transform = 'translate(' + xa + 'px,0)';
  }
  CP.busy = false; $('cpInfo').textContent = 'وين الكورة؟ اضغط على الكوب 👇';
}
async function cupPick(i) {
  if (!CP || CP.busy) return; CP.busy = true;
  const ball = $('cpBall'); ball.style.left = (CP.x(CP.slots[CP.ball]) + CP.cw / 2 - 17) + 'px'; ball.style.visibility = 'visible';
  await lift(i, true);
  if (i === CP.ball) { CP.streak++; if (CP.streak > CP.best) { CP.best = CP.streak; LS.set('cupsBest', CP.best); } beep(1200, .2); $('cpInfo').textContent = 'صح! 🎉 السلسلة: ' + CP.streak + ' · أحسن سلسلة: ' + CP.best; }
  else { await lift(CP.ball, true); CP.streak = 0; beep(200, .4); buzz(200); $('cpInfo').textContent = 'غلط 😅 الكورة كانت هنا · أحسن سلسلة: ' + CP.best; }
  setBtns2(cpS.row, [btn('مرة ثانية 🔀', '', async () => { await Promise.all(CP.cups.map((_, k) => lift(k, false))); $('cpBall').style.visibility = 'hidden'; cupsGo(); })]);
}

/* =================================================================
   🍾 لف القارورة
   ================================================================= */
const btS = mkScreen('bottle', '🍾 لف القارورة');
const BOTTLE_SVG = '<svg viewBox="0 0 46 170"><rect x="17" y="0" width="12" height="14" rx="3" fill="#c9861f" stroke="#2b1d12" stroke-width="3"/><path d="M17 14 L17 46 Q4 60 4 80 L4 160 Q4 168 12 168 L34 168 Q42 168 42 160 L42 80 Q42 60 29 46 L29 14 Z" fill="#2c7a6b" stroke="#2b1d12" stroke-width="4"/><rect x="8" y="95" width="30" height="40" rx="4" fill="#f3ead6" stroke="#2b1d12" stroke-width="3"/><path d="M12 70 Q10 100 12 150" stroke="rgba(255,255,255,.45)" stroke-width="5" fill="none"/></svg>';
let BT = { ang: 0 };
function bottleScreen() {
  const b = btS.body; b.innerHTML = '';
  const box = el('div', 'bottlebox'); const n = S.players.length;
  S.players.forEach((p, i) => { const a = i / n * 2 * Math.PI - Math.PI / 2; const d = el('div', 'nm', p); d.style.left = (50 + 43 * Math.cos(a)) + '%'; d.style.top = (50 + 43 * Math.sin(a)) + '%'; box.appendChild(d); });
  const bt = el('div', 'bottle'); bt.innerHTML = BOTTLE_SVG; bt.style.transform = 'rotate(' + BT.ang + 'deg)'; box.appendChild(bt);
  const res = el('div', 'sub', 'رأس القارورة 🟢 يجاوب · وتحتها 🔴 يسأل'); res.id = 'btRes';
  b.append(box, res);
  setBtns2(btS.row, [btn('لف 🔄', '', () => {
    const add = 1080 + rnd(1440) + Math.random() * 360; BT.ang += add; bt.style.transform = 'rotate(' + BT.ang + 'deg)';
    box.querySelectorAll('.nm').forEach(x => x.className = 'nm'); $('btRes').textContent = '…'; beep(600, .05);
    setTimeout(() => {
      const top = ((BT.ang % 360) + 360) % 360; // 0 = لفوق
      const idx = a => { const k = Math.round(((a + 360) % 360) / 360 * n) % n; return k; };
      const A = idx(top), B0 = idx(top + 180); const B = B0 === A ? (A + Math.floor(n / 2)) % n : B0;
      const nms = box.querySelectorAll('.nm'); nms[A].classList.add('hitA'); nms[B].classList.add('hitB');
      $('btRes').innerHTML = ''; $('btRes').append(el('b', 'bad', S.players[B]), ' يسأل 👉 ', el('b', 'good', S.players[A])); beep(1000, .15); buzz(80);
    }, 3300);
  })]);
  show('bottle');
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
    inn.style.transform = 'rotateY(' + CO.rot + 'deg)'; res.textContent = ''; beep(900, .05);
    setTimeout(() => { if (head) CO.a++; else CO.b++; res.textContent = head ? '👑 ملك' : '✍️ كتابة'; st.textContent = 'ملك: ' + CO.a + ' · كتابة: ' + CO.b; beep(1200, .12); }, 2000);
  })]);
  show('coin');
}

/* =================================================================
   👥 تقسيم الفرق + مين يبدأ
   ================================================================= */
const tmS = mkScreen('teams', '👥 تقسيم الفرق');
const TCOL = ['#c94a3b', '#2c7a6b', '#c9861f', '#5b4a9c'];
function teamsScreen() {
  S.tcount = S.tcount || 2;
  const b = tmS.body; b.innerHTML = '';
  const box = el('div', 'box'); box.appendChild(stepper('عدد الفرق', () => S.tcount, v => S.tcount = v, () => 2, () => Math.max(2, Math.min(4, S.players.length))));
  const out = el('div', ''); out.id = 'tmOut'; const pk = el('div', 'picker', ''); pk.id = 'tmPick';
  b.append(box, pk, out);
  setBtns2(tmS.row, [btn('🎯 مين يبدأ؟', 'ghost', () => {
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
add({ id: 'bottle', e: '🍾', n: 'لف القارورة', d: 'مين يسأل مين؟', min: 2, tool: 1 });
add({ id: 'coin', e: '🪙', n: 'ملك ولا كتابة', d: 'اقلب العملة', min: 0, tool: 1 });
add({ id: 'teams', e: '👥', n: 'تقسيم الفرق', d: 'قسّم الجماعة ومين يبدأ', min: 2, tool: 1 });
Object.assign(RULES, {
  drw: ['كل واحد يسحب الشاشة ويشوف الكلمة، إلا الامبوستر ما يعرفها (وإذا شغلتوا الخيار يشوف الموضوع بس).', 'بعدين الجوال يدور: كل واحد يرسم **خط واحد بس** على نفس الورقة (تحط إصبعك وترسم وترفعه). كل لاعب له لون.', 'ارسم شي يثبت إنك تعرف الكلمة، بس لا تكون واضح وايد عشان الامبوستر ما يعرفها!', 'الامبوستر يحاول يرسم شي يمشي مع رسمتكم بدون ما ينكشف.', 'إذا غلطت، اضغط ↩️ تراجع وارسم من جديد قبل لا تعطي الجوال.', 'بعد آخر جولة، أو إذا ضغطتوا 🗳️ وقفوا، يبدأ التصويت السري ونفس نقاط الامبوستر: اللي يصوت صح +١، وكل صوت غلط +١ للامبوستر، والامبوستر +١ إذا خمّن الكلمة.'].map(x => x.replace(/\*\*/g, '')),
  sj: ['تنقسمون فريقين، وتختارون لين ٦ مواضيع (أو اضغطوا 🎲 عشوائي).', 'كل موضوع فيه ٦ أسئلة: ٢ بـ ٢٠٠ (مقدور عليها)، ٢ بـ ٤٠٠ (صعبة)، ٢ بـ ٦٠٠ (صعبة وايد).', 'الفريق اللي عليه الدور يختار سؤال من اللوحة، ويقراه واحد بصوت عالي. عندهم دقيقة يفكرون.', 'وسائل المساعدة (كل فريق مرة وحدة باللعبة): 🔄 غيّر السؤال بسؤال ثاني من نفس الموضوع والنقاط، ✖️٢ دبل يضاعف نقاط السؤال إذا جاوبتوا صح، 💡 تلميح.', 'اضغطوا "اكشف الجواب" واختاروا مين جاوب صح. إذا الفريق الثاني جاوب صح ياخذ النقاط (بدون الدبل).', 'الدور ينتقل بعد كل سؤال، واللي عنده نقاط أكثر في الأخير يفوز. الأسئلة ما تتكرر لين تخلص.'],
  feud: ['تنقسمون فريقين. كل جولة فيها سؤال "سألنا ١٠٠ شخص" ووراه ٦ أجوبة مخفية بنقاطها.', 'بالبداية واحد من كل فريق يتواجهون، واللي يجاوب الجواب الأعلى يختار فريقه يلعب. اضغطوا على اسم الفريق اللي بيلعب.', 'الفريق يقول أجوبة: إذا الجواب موجود اضغطوا على مربعه ينكشف وتنضاف نقاطه، وإذا مو موجود اضغطوا ✖ غلط.', 'إذا كشفوا كل الأجوبة ياخذون نقاط الجولة. وإذا وصلوا ٣ أغلاط، الفريق الثاني عنده فرصة وحدة يسرق كل النقاط بجواب صح.', 'آخر جولة نقاطها دبل! واللي يجمع أكثر في الأخير يفوز.'],
  dice: ['اختار نوع النرد: D4 أو D6 أو D8 أو D10 أو D12 أو D20، وكم نرد تبي (لين ٤).', 'اضغط "ارمي" أو اضغط على النرد نفسه، ويطلع المجموع تحت.'],
  cups: ['تشوف الكورة تحت كوب، بعدين الأكواب تتلخبط.', 'تابع الكوب بعيونك، ولما يوقفون اضغط على الكوب اللي تظن الكورة تحته.', 'كل ما جبتها صح تزيد سلسلتك. تقدر تزيد عدد الأكواب والصعوبة.'],
  bottle: ['حطوا الجوال على الطاولة بالنص، والأسامي حوله بنفس ترتيب قعدتكم تقريباً.', 'اضغطوا لف: رأس القارورة 🟢 يأشر على اللي يجاوب، وتحتها 🔴 على اللي يسأل. تنفع مع صراحة ولا جرأة!'],
  coin: ['اضغط اقلب، والعملة تطير وتطيح على ملك أو كتابة. تنفع لما تختلفون على شي!'],
  teams: ['اختار كم فريق، واضغط قسّم: اللعبة توزع اللاعبين عشوائي وبالتساوي.', 'وزر "مين يبدأ؟" يختار واحد عشوائي يبدأ اللعبة.']
});
RULES.triv = RULES.triv;
window.__t = () => ({ DR, SG, FG, DICE, SHAPES, Qt, CP, CO });
window.EXTRA = { drw: drawSetup, sj: sjSetup, feud: feudSetup, dice: diceScreen, cups: cupsScreen, bottle: bottleScreen, coin: coinScreen, teams: teamsScreen };
// الرجوع من شاشة الكشف في الرسم
renderHome();
})();
