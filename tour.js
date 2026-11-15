/* ===== تقزيرة: بطولة الليلة 🏆 + كمّل اللعبة اللي ما خلصت =====
   البطولة: تلعبون أي ألعاب، وبعد كل لعبة تسجلون الأول والثاني والثالث (٣ / ٢ / ١)، والنقاط تتجمع لين تتوّجون بطل الليلة. */
(function () {
'use strict';
const { mkScreen, setBtns2 } = window.UI;
const css = document.createElement('style');
css.textContent = `
.tourBox{background:linear-gradient(135deg,var(--yel),#a8690f);color:#2b1d12;border:2px solid var(--line);border-radius:16px;padding:14px;margin-bottom:16px;box-shadow:var(--sh)}
.tourBox h2{font-family:'Lalezar';font-weight:400;font-size:22px;margin-bottom:4px;display:flex;justify-content:space-between;align-items:center}
.tourBox p{font-size:13.5px;margin-bottom:10px;line-height:1.7}
.tourBox .row button{flex:1;background:var(--paper);color:var(--txt)}
.tourTop{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}
.tourTop span{background:var(--paper);color:var(--txt);border:2px solid var(--line);border-radius:999px;padding:2px 12px;font-weight:700}
.resBox{background:var(--card);border:2px dashed var(--line);border-radius:14px;padding:12px;margin-bottom:14px}
.resBox b{font-family:'Lalezar';font-weight:400;font-size:19px}
.resBox small{display:block;color:var(--mut);margin:2px 0 8px}
.tRow{display:flex;align-items:center;gap:8px;padding:8px 2px;border-bottom:1px dashed var(--dash);font-weight:700}
.tRow:last-child{border:0}
.tRow .rk{font-family:'Lalezar';width:30px;text-align:center;font-size:20px}
.tRow .nm2{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tRow .pt{font-family:'Lalezar';font-size:24px;min-width:34px;text-align:center}
.tRow button{width:38px;height:38px;padding:0;font-size:20px;flex:none!important}
.medRow{display:flex;align-items:center;gap:6px;padding:7px 0;border-bottom:1px dashed var(--dash)}
.medRow:last-child{border:0}
.medRow .nm2{flex:1;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.medRow button{width:46px;height:42px;padding:0;font-size:22px;flex:none;background:var(--paper);box-shadow:2px 2px 0 var(--line);filter:grayscale(1);opacity:.55}
.medRow button.on{filter:none;opacity:1;background:var(--yel)}
.logRow{display:flex;gap:8px;align-items:flex-start;padding:8px 0;border-bottom:1px dashed var(--dash);font-size:15px;line-height:1.7}
.logRow:last-child{border:0}
.logRow div{flex:1}
.logRow button{flex:none!important;padding:2px 10px;font-size:14px}
.podium{display:flex;align-items:flex-end;justify-content:center;gap:10px;width:100%;margin-top:8px}
.podium .st{flex:1;max-width:150px;border:2px solid var(--line);border-radius:12px 12px 0 0;background:var(--paper);text-align:center;padding:8px 4px;box-shadow:var(--sh)}
.podium .st .m{font-size:40px;line-height:1.2}
.podium .st .n{font-family:'Lalezar';font-size:20px;word-break:break-word}
.podium .st .p{color:var(--mut);font-weight:700}
.podium .s1{min-height:170px;background:var(--yel)}.podium .s2{min-height:130px}.podium .s3{min-height:100px}
@media (min-width:700px){.medRow button{width:60px;height:52px;font-size:28px}.tRow .pt{font-size:30px}.podium .st{max-width:210px}.podium .st .m{font-size:60px}.podium .st .n{font-size:28px}.podium .s1{min-height:240px}.podium .s2{min-height:185px}.podium .s3{min-height:140px}}
`;
document.head.appendChild(css);

const nGames = n => n === 1 ? 'لعبة وحدة' : n === 2 ? 'لعبتين' : n >= 3 && n <= 10 ? n + ' ألعاب' : n + ' لعبة';
const nPts = n => n === 1 ? 'نقطة وحدة' : n === 2 ? 'نقطتين' : n >= 3 && n <= 10 ? n + ' نقاط' : n + ' نقطة';
const MED = [['g', '🥇', 3], ['s', '🥈', 2], ['b', '🥉', 1]];
const T = () => S.tour;
const pts = () => { const o = {}; S.players.forEach(p => o[p] = 0); (T().log || []).forEach(e => Object.entries(e.r).forEach(([n, v]) => o[n] = (o[n] || 0) + v)); Object.entries(T().adj || {}).forEach(([n, v]) => o[n] = (o[n] || 0) + v); return o; };
const standing = () => Object.entries(pts()).sort((a, b) => b[1] - a[1]);
const rankOf = arr => { let r = 0, last = null; return arr.map(([n, v], i) => { if (v !== last) { r = i + 1; last = v; } return [n, v, r]; }); };

/* ---------- الصندوق في الرئيسية ---------- */
function renderBox() {
  const box = $('tourBox'); if (!box) return; box.innerHTML = '';
  const d = el('div', 'tourBox');
  if (!T() || !T().on) {
    d.innerHTML = '<h2>🏆 بطولة الليلة</h2><p>العبوا أي ألعاب تبغونها، وبعد كل لعبة سجلوا الأول والثاني والثالث. النقاط تتجمع، وفي الأخير يتتوّج بطل الليلة.</p>';
    const r = el('div', 'row'); r.appendChild(btn('ابدأ بطولة 🏁', '', () => { if (S.players.length < 2) { $('homeErr').textContent = 'البطولة تبغى لاعبين اثنين على الأقل'; return; } S.tour = { on: true, log: [], adj: {}, t: Date.now() }; save(); renderBox(); })); d.appendChild(r);
  } else {
    const st = rankOf(standing()); const n = T().log.length;
    const h = el('h2', '', '🏆 بطولة الليلة'); h.appendChild(el('span', '', n ? nGames(n) : 'توها بادية')); h.lastChild.style.cssText = 'font-family:inherit;font-size:14px;font-weight:700';
    d.appendChild(h);
    const top = el('div', 'tourTop'); st.slice(0, 4).forEach(([nm, v, r]) => top.appendChild(el('span', '', (r === 1 && v > 0 ? '👑 ' : '') + nm + ' ' + v))); d.appendChild(top);
    const r = el('div', 'row'); r.append(btn('الترتيب والسجل 📋', '', openTour), btn('توّج البطل 🏆', '', crown)); d.appendChild(r);
  }
  box.appendChild(d);
}

/* ---------- كمّل اللعبة ---------- */
function renderResume() {
  const box = $('resume'); if (!box) return; box.innerHTML = '';
  (window.RESUMES || []).forEach(R => {
    const g = LS.get(R.key, null); if (!g) return; let info = ''; try { info = R.info(g); } catch (e) { LS.set(R.key, null); return; }
    const d = el('div', 'resBox'); d.append(el('b', '', R.label + ': عندكم لعبة ما خلصت'), el('small', '', info));
    const r = el('div', 'row'); r.append(btn('كمّلوها ▶', 'grn', () => R.go(), 2), btn('امسحها ✖', 'ghost', () => { LS.set(R.key, null); renderResume(); })); d.appendChild(r); box.appendChild(d);
  });
}

/* ---------- تسجيل نتيجة لعبة ---------- */
let modal = null;
function closeModal() { if (modal) { modal.remove(); modal = null; } }
function askResult(gname, pre) {
  closeModal();
  modal = el('div', 'modal'); const bx = el('div', 'box'); modal.appendChild(bx);
  bx.appendChild(el('h2', '', '🏆 منهو فاز في ' + gname + '؟'));
  const tip = el('div', 'lab', 'اختاروا 🥇 الأول (٣ نقاط) و🥈 الثاني (٢) و🥉 الثالث (١). إدا لعبتوا فرق أو صار تعادل، عطوا نفس الميدالية لأكثر من واحد.'); tip.style.cssText = 'color:var(--mut);font-size:14px;line-height:1.7;margin-bottom:8px'; bx.appendChild(tip);
  const sel = Object.assign({}, pre || {});
  const rows = el('div', ''); bx.appendChild(rows);
  const draw2 = () => { rows.innerHTML = ''; S.players.forEach(p => { const r = el('div', 'medRow'); r.appendChild(el('span', 'nm2', p)); MED.forEach(([k, e]) => { const b = el('button', sel[p] === k ? 'on' : '', e); b.onclick = () => { if (sel[p] === k) delete sel[p]; else sel[p] = k; draw2(); }; r.appendChild(b); }); rows.appendChild(r); }); };
  draw2();
  const err = el('div', 'err', ''); bx.appendChild(err);
  const r = el('div', 'row'); r.style.marginTop = '8px';
  r.append(btn('ما نبغى نسجلها', 'ghost', closeModal), btn('سجّل ✅', 'grn', () => {
    if (!Object.keys(sel).length) { err.textContent = 'اختاروا واحد على الأقل، أو اضغطوا "ما نبغى نسجلها"'; return; }
    const res = {}; Object.entries(sel).forEach(([n, k]) => res[n] = MED.find(m => m[0] === k)[2]);
    T().log.push({ g: gname, r: res, t: Date.now() }); save(); closeModal(); window.SFX && SFX.ding ? SFX.ding() : beep(1200, .15); renderBox();
  }, 2));
  bx.appendChild(r); document.body.appendChild(modal);
}
// نرتب النقاط اللي سجلتها اللعبة نفسها (إدا فيه) عشان نعبّي الميداليات جاهزة
function prefill(sc) {
  if (!sc || typeof sc !== 'object') return null;
  const e = Object.entries(sc).filter(([n, v]) => S.players.includes(n) && typeof v === 'number' && v > 0).sort((a, b) => b[1] - a[1]);
  if (!e.length) return null; const vals = [...new Set(e.map(x => x[1]))].slice(0, 3), out = {};
  e.forEach(([n, v]) => { const i = vals.indexOf(v); if (i >= 0) out[n] = MED[i][0]; }); return out;
}
let cur = null; // اللعبة اللي انفتحت الحين
const _launch = launch;
launch = function (g) { if (g && !g.tool && g.id !== 'online') { cur = { g, t: Date.now() }; window.TOURSC = null; } else cur = null; return _launch(g); };
window.onShowScreen = id => {
  if (id !== 'home' || !cur) return; const c = cur; cur = null;
  if (!T() || !T().on || S.players.length < 2) return;
  const sc = window.TOURSC; if (Date.now() - c.t < 45000 && !prefill(sc)) return; // دخل وطلع بسرعة بدون ما يلعب
  setTimeout(() => askResult(c.g.e + ' ' + c.g.n, prefill(sc)), 150);
};

/* ---------- شاشة الترتيب ---------- */
const ts = mkScreen('tour', '🏆 بطولة الليلة');
RULES.tour = ['اكتبوا أساميكم في الرئيسية واضغطوا "ابدأ بطولة".', 'العبوا أي لعبة من التطبيق. لما تخلصونها وترجعون للرئيسية، يطلع لكم سؤال: منهو الأول والثاني والثالث؟', '🥇 الأول ياخد ٣ نقاط، 🥈 الثاني ٢، 🥉 الثالث ١. إدا اللعبة فيها نقاط، الميداليات تتعبى بروحها وتقدرون تعدلونها.', 'في ألعاب الفرق (مثل سين جيم وفاميلي فيود) عطوا 🥇 لكل أعضاء الفريق الفايز.', 'من "الترتيب والسجل" تقدرون تزيدون أو تنقصون نقطة لأي لاعب، أو تمسحون لعبة تسجلت بالغلط.', 'النقاط محفوظة حتى لو سكرتوا التطبيق. ولما تخلصون اضغطوا "توّج البطل".'];
function openTour() {
  CUR = { id: 'tour', e: '🏆', n: 'بطولة الليلة' };
  const b = ts.body; b.innerHTML = '';
  const st = rankOf(standing());
  const bx = el('div', 'box'); bx.appendChild(el('h2', '', 'الترتيب'));
  st.forEach(([n, v, r]) => {
    const row = el('div', 'tRow'); row.append(el('span', 'rk', r === 1 && v > 0 ? '👑' : r), el('span', 'nm2', n), el('span', 'pt', v));
    const adj = d => { T().adj = T().adj || {}; T().adj[n] = (T().adj[n] || 0) + d; save(); openTour(); };
    row.append(btn('−', 'ghost', () => adj(-1)), btn('+', 'ghost', () => adj(1))); bx.appendChild(row);
  });
  b.appendChild(bx);
  const lg = el('div', 'box'); lg.appendChild(el('h2', '', 'سجل الألعاب (' + T().log.length + ')'));
  if (!T().log.length) lg.appendChild(el('div', 'lab', 'ما تسجلت ولا لعبة للحين. روحوا العبوا وارجعوا 😄'));
  T().log.slice().reverse().forEach(e => {
    const row = el('div', 'logRow'); const d = el('div', '');
    d.appendChild(el('b', '', e.g)); d.appendChild(el('br'));
    d.appendChild(document.createTextNode(MED.map(([k, em, p]) => { const w = Object.entries(e.r).filter(x => x[1] === p).map(x => x[0]); return w.length ? em + ' ' + w.join('، ') : ''; }).filter(Boolean).join('  ')));
    let armed = 0; const x = btn('✖', 'ghost', () => { if (Date.now() - armed < 3000) { T().log.splice(T().log.indexOf(e), 1); save(); openTour(); return; } armed = Date.now(); x.textContent = 'امسح؟'; }); row.append(d, x); lg.appendChild(row);
  });
  b.appendChild(lg);
  let armedEnd = 0; const endB = btn('إلغاء البطولة ✖', 'ghost', () => { if (Date.now() - armedEnd < 3000) { S.tour = null; save(); renderHome(); show('home'); return; } armedEnd = Date.now(); endB.textContent = 'متأكد؟ اضغط مرة ثانية'; });
  setBtns2(ts.row, [endB, btn('توّج البطل 🏆', '', crown, 1.4)]);
  show('tour');
}
function crown() {
  CUR = { id: 'tour', e: '🏆', n: 'بطولة الليلة' };
  const st = rankOf(standing()); const b = ts.body; b.innerHTML = '';
  const card = el('div', 'bigcard'); b.appendChild(card);
  if (!st.length || st[0][1] <= 0) { card.append(el('div', 'bomb', '🤷'), el('div', 'txt', 'ما فيه نقاط للحين'), el('div', 'lab', 'العبوا لعبة وحدة على الأقل وسجلوا نتيجتها.')); setBtns2(ts.row, [btn('رجوع', 'ghost', () => { renderHome(); show('home'); })]); show('tour'); return; }
  const champs = st.filter(x => x[2] === 1).map(x => x[0]);
  card.append(el('div', 'lab', 'بطل الليلة 👑'), el('div', 'win good', champs.join(' و ')), el('div', 'lab', nPts(st[0][1]) + ' في ' + nGames(T().log.length)));
  const pod = el('div', 'podium'); const by = r => st.filter(x => x[2] === r && x[1] > 0);
  [[2, '🥈', 's2'], [1, '🥇', 's1'], [3, '🥉', 's3']].forEach(([r, m, c]) => { const a = by(r); if (!a.length) return; const d = el('div', 'st ' + c); d.append(el('div', 'm', m), el('div', 'n', a.map(x => x[0]).join(' و ')), el('div', 'p', nPts(a[0][1]))); pod.appendChild(d); });
  card.appendChild(pod);
  const rest = st.filter(x => x[2] > 3 || x[1] <= 0); if (rest.length) { const bx = el('div', 'box'); bx.style.marginTop = '14px'; rest.forEach(([n, v, r]) => { const row = el('div', 'tRow'); row.append(el('span', 'rk', r), el('span', 'nm2', n), el('span', 'pt', v)); bx.appendChild(row); }); b.appendChild(bx); }
  if (window.SFX && SFX.win) SFX.win(); else { beep(880, .15); setTimeout(() => beep(1175, .15), 160); setTimeout(() => beep(1568, .3), 320); }
  setBtns2(ts.row, [btn('نكمل البطولة', 'ghost', () => { renderHome(); show('home'); }), btn('بطولة جديدة 🔄', '', () => { S.tour = { on: true, log: [], adj: {}, t: Date.now() }; save(); renderHome(); show('home'); }, 1.3)]);
  show('tour');
}

const _rh = renderHome;
renderHome = function () { _rh(); renderBox(); renderResume(); };
renderBox(); renderResume();
window.TOUR = { ask: askResult, open: openTour };
})();
