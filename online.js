/* ===== تقزيرة: الأونلاين (غرفة + كود، وربعك يدخلون من المتصفح) =====
   المضيف (اللي سوى الغرفة) هو اللي يدير اللعبة، والباقين يشوفون شاشاتهم ويرسلون اختياراتهم.
   الاتصال مباشر بين الجوالات عن طريق PeerJS (WebRTC). */
(function () {
'use strict';
const { mkScreen, setBtns2 } = window.UI;
const PUBLIC_URL = 'https://mhadi209.github.io/game-jma3ih/';
const css = document.createElement('style');
css.textContent = `
.onlineBox{background:linear-gradient(135deg,var(--grn),#1f5f53);color:#fff;border:2px solid var(--line);border-radius:16px;padding:14px;margin-bottom:16px;box-shadow:var(--sh)}
.onlineBox h2{font-family:'Lalezar';font-weight:400;font-size:22px;margin-bottom:4px}
.onlineBox p{font-size:13px;opacity:.9;margin-bottom:10px}
.onlineBox .row button{flex:1;background:#fff;color:#1f5f53}
.code{font-family:'Lalezar';font-size:64px;letter-spacing:10px;text-align:center;color:var(--red);line-height:1.1;direction:ltr}
.link{direction:ltr;font-size:13px;background:var(--paper);border:2px dashed var(--line);border-radius:10px;padding:8px;word-break:break-all;text-align:center;user-select:all;-webkit-user-select:all}
.plist{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
.plist span{background:var(--paper);border:2px solid var(--line);border-radius:999px;padding:4px 12px;font-weight:700}
.plist span.off{opacity:.4;text-decoration:line-through}
.plist span.ok{background:var(--grn);color:#fff}
.ogames{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.ogames button{background:var(--card);color:var(--txt);text-align:right;display:flex;flex-direction:column;gap:2px;padding:10px}
.ogames button b{font-family:'Lalezar';font-weight:400;font-size:18px}
.ogames button small{color:var(--mut);font-size:12px;font-weight:400}
.status{text-align:center;font-weight:700;padding:6px;border-radius:10px;margin-bottom:10px}
.status.ok{background:#d6efe3;color:#1f6b4f}.status.bad{background:#f8d7d4;color:#9a2b20}
body.dark .status.ok{background:#1f3b31;color:#9fe3c4}body.dark .status.bad{background:#4a2420;color:#ffb3a9}
.secretBox{width:100%;border:2px dashed var(--line);border-radius:14px;padding:18px;background:var(--paper);cursor:pointer;user-select:none;-webkit-user-select:none}
.secretBox.hid .in{filter:blur(14px)}
.bigBuzz{width:220px;height:220px;border-radius:50%;font-family:'Lalezar';font-size:42px;margin:10px auto;display:block;background:radial-gradient(circle at 35% 30%,#ff7b6b,#c94a3b 60%,#7a1f15);box-shadow:0 10px 0 #5a160f,0 14px 20px rgba(0,0,0,.4);border:4px solid var(--line)}
.bigBuzz:active{transform:translateY(8px);box-shadow:0 2px 0 #5a160f}
.bigBuzz:disabled{filter:grayscale(1);opacity:.6}
.onlTag{display:block;width:max-content;margin:-6px auto 10px;background:var(--grn);color:#fff;border-radius:999px;padding:2px 12px;font-size:12px;font-weight:700;border:2px solid var(--line)}
`;
document.head.appendChild(css);

/* ---------- النقل: PeerJS أو BroadcastChannel (للتجربة) ---------- */
let peerLib = null;
function loadPeer() {
  if (window.Peer) return Promise.resolve();
  if (peerLib) return peerLib;
  const srcs = ['https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js', 'https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js'];
  peerLib = new Promise((res, rej) => { let i = 0; const tryNext = () => { if (i >= srcs.length) return rej(new Error('load')); const s = document.createElement('script'); s.src = srcs[i++]; s.onload = () => res(); s.onerror = () => { s.remove(); tryNext(); }; document.head.appendChild(s); }; tryNext(); });
  return peerLib;
}
const ICE = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }, { urls: 'stun:global.stun.twilio.com:3478' }, { urls: 'turn:openrelay.metered.ca:80', username: 'openrelayproject', credential: 'openrelayproject' }, { urls: 'turn:openrelay.metered.ca:443', username: 'openrelayproject', credential: 'openrelayproject' }] };
const useBC = () => /[?&]bc=1/.test(location.search) || window.__bc;
const rid = () => Math.random().toString(36).slice(2, 10);
const Net = {
  async host(code, h) {
    if (useBC()) {
      const ch = new BroadcastChannel('tqz-' + code); Net._ch = ch; const known = new Set();
      ch.onmessage = e => { const m = e.data; if (m.to !== 'host') return; if (!known.has(m.from)) { known.add(m.from); } if (m.msg.t === 'bye') { known.delete(m.from); return h.leave(m.from); } h.msg(m.from, m.msg); };
      Net.send = (pid, msg) => ch.postMessage({ to: pid, msg });
      Net.close = () => { ch.postMessage({ to: '*', msg: { t: 'closed' } }); ch.close(); };
      return code;
    }
    await loadPeer();
    return new Promise((res, rej) => {
      const peer = new Peer('taqzeera-' + code, { config: ICE }); Net._peer = peer; const conns = {};
      peer.on('open', () => res(code));
      peer.on('error', err => { if (err.type === 'unavailable-id') rej(new Error('taken')); else if (!Net._opened) rej(err); else h.error && h.error(err); });
      peer.on('connection', conn => {
        conns[conn.peer] = conn;
        conn.on('data', d => h.msg(conn.peer, d));
        conn.on('close', () => { delete conns[conn.peer]; h.leave(conn.peer); });
        conn.on('error', () => { });
      });
      peer.on('disconnected', () => { try { peer.reconnect(); } catch (e) { } });
      Net.send = (pid, msg) => { const c = conns[pid]; if (c && c.open) c.send(msg); };
      Net.close = () => { Object.values(conns).forEach(c => { try { c.send({ t: 'closed' }); c.close(); } catch (e) { } }); peer.destroy(); };
    });
  },
  async join(code, h) {
    if (useBC()) {
      const ch = new BroadcastChannel('tqz-' + code), me = rid(); Net._ch = ch;
      ch.onmessage = e => { const m = e.data; if (m.to === me || m.to === '*') h.msg(m.msg); };
      Net.toHost = msg => ch.postMessage({ to: 'host', from: me, msg });
      Net.close = () => { Net.toHost({ t: 'bye' }); ch.close(); };
      setTimeout(() => h.open(), 30); return;
    }
    await loadPeer();
    return new Promise((res, rej) => {
      const peer = new Peer({ config: ICE }); Net._peer = peer; let done = false;
      const fail = e => { if (!done) { done = true; rej(e); } else h.close(); };
      peer.on('error', e => fail(e));
      peer.on('open', () => {
        const conn = peer.connect('taqzeera-' + code, { reliable: true }); Net._conn = conn;
        const to = setTimeout(() => fail(new Error('timeout')), 15000);
        conn.on('open', () => { clearTimeout(to); done = true; Net.toHost = m => { if (conn.open) conn.send(m); }; h.open(); res(); });
        conn.on('data', d => h.msg(d));
        conn.on('close', () => h.close());
        conn.on('error', e => fail(e));
      });
      Net.close = () => { try { peer.destroy(); } catch (e) { } };
    });
  }
};

/* ---------- شاشة الأونلاين ---------- */
const on = mkScreen('online', '🌐 أونلاين');
on.el.querySelector('.help').onclick = () => { CUR = { id: 'online', e: '🌐', n: 'أونلاين' }; openHelp(); };
RULES.online = ['أنت تسوي غرفة، ويطلع لك كود ورابط.', 'ترسل الرابط لربعك (واتساب مثلاً)، يفتحونه من المتصفح ويكتبون أساميهم، بدون ما ينزلون شي.', 'لما يدخلون، تختار اللعبة من جوالك (أنت المضيف)، وكل واحد يشوف شاشته على جواله.', 'لازم نت عند الكل. إذا ما اتصل أحد، جربوا تكونون على نفس الواي فاي.', 'خل التطبيق مفتوح على جوالك (لا تطلع منه) لين تخلصون، لأن جوالك هو اللي يدير الغرفة.'];
let ROLE = null;   // 'host' | 'guest'
let ME = null;     // pid
let tagEl = null;
function setTag(t) { if (!tagEl) { tagEl = el('div', 'onlTag'); on.el.insertBefore(tagEl, on.el.children[1]); } tagEl.textContent = t; tagEl.style.display = t ? '' : 'none'; }
on.back.onclick = () => { if (ROLE && !confirmLeave()) return; leaveRoom(); renderHome(); show('home'); };
let leaveArmed = 0;
function confirmLeave() { const now = Date.now(); if (now - leaveArmed < 2500) return true; leaveArmed = now; status('اضغط → مرة ثانية عشان تطلع من الغرفة', 'bad'); return false; }
function leaveRoom() { try { Net.close && Net.close(); } catch (e) { } ROLE = null; ME = null; H = null; setTag(''); }
function status(t, k) { let s = $('onStatus'); if (!s) { s = el('div', 'status'); s.id = 'onStatus'; on.body.prepend(s); } s.className = 'status ' + (k || 'ok'); s.textContent = t; if (!t) s.remove(); }

/* ---------- عرض الشاشة (مشترك بين المضيف والضيوف) ---------- */
let lastView = null, drawCtx = null;
const ONL_R = {};
function renderView(v, sendAct) {
  lastView = v; const b = on.body; b.innerHTML = ''; on.h.textContent = v.title || '🌐 أونلاين';
  if (v.status) { const s = el('div', 'status ' + (v.status[1] || 'ok'), v.status[0]); s.id = 'onStatus'; b.appendChild(s); }
  const c = el('div', 'bigcard'); b.appendChild(c);
  (v.items || []).forEach(it => {
    if (ONL_R[it.t]) { ONL_R[it.t](it, c, sendAct); return; }
    if (it.t === 'img') { const i = el('img', 'drawThumb'); i.src = it.v; c.appendChild(i); return; }
    if (it.t === 'list') { const r = el('div', 'reslist'); it.v.forEach(([n, val, best]) => { const d = el('div', best ? 'best' : ''); d.append(el('span', '', n), el('b', '', val)); r.appendChild(d); }); c.appendChild(r); return; }
    if (it.t === 'plist') { const r = el('div', 'plist'); it.v.forEach(([n, k]) => r.appendChild(el('span', k || '', n))); c.appendChild(r); return; }
    const d = el('div', it.t, it.v); if (it.color) d.style.color = it.color; c.appendChild(d);
  });
  if (v.secret) { const sb = el('div', 'secretBox hid'); const inn = el('div', 'in'); inn.innerHTML = v.secret; sb.append(el('div', 'lab', '👆 اضغط عشان تشوف / تخبي'), inn); sb.onclick = () => sb.classList.toggle('hid'); c.appendChild(sb); }
  if (v.canvas) {
    const cv = el('canvas', 'paper'); const w = Math.min(window.innerWidth - 48, 460), h = Math.round(w * 1.15), dpr = window.devicePixelRatio || 1;
    cv.width = w * dpr; cv.height = h * dpr; cv.style.width = w + 'px'; cv.style.height = h + 'px'; c.appendChild(cv);
    drawCtx = { cv, strokes: v.canvas.strokes || [], cur: null, can: v.canvas.can, color: v.canvas.color };
    paintCv();
    if (v.canvas.can) {
      const pos = e => { const r = cv.getBoundingClientRect(); return [+((e.clientX - r.left) / r.width).toFixed(3), +((e.clientY - r.top) / r.height).toFixed(3)]; };
      let buf = [], tmr = null; const flush = fin => { if (buf.length || fin) sendAct({ a: 'stroke', v: buf, fin: !!fin }); buf = []; };
      cv.addEventListener('pointerdown', e => { if (!drawCtx.can) return; e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (_) { } drawCtx.cur = { c: drawCtx.color, pts: [pos(e)] }; drawCtx.strokes.push(drawCtx.cur); buf.push(pos(e)); paintCv(); tmr = setInterval(() => flush(false), 120); });
      cv.addEventListener('pointermove', e => { if (!drawCtx.cur) return; const p = pos(e); drawCtx.cur.pts.push(p); buf.push(p); paintCv(); });
      const up = () => { if (!drawCtx.cur) return; drawCtx.cur = null; drawCtx.can = false; clearInterval(tmr); flush(true); };
      cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    }
  }
  if (v.opts) { const o = el('div', 'opts'); if (v.opts.length > 3) o.style.gridTemplateColumns = '1fr 1fr'; v.opts.forEach(op => { const x = btn(op.label, op.cls || '', () => { o.querySelectorAll('button').forEach(bb => bb.disabled = true); x.className = 'ok'; sendAct({ a: 'opt', v: op.id }); }); x.disabled = !!op.dis; o.appendChild(x); }); c.appendChild(o); }
  if (v.input) { const inp = el('input'); inp.type = v.input.kind === 'number' ? 'number' : 'text'; if (v.input.kind === 'number') inp.inputMode = 'decimal'; inp.className = 'bigin'; inp.placeholder = v.input.ph || ''; inp.maxLength = 60; c.appendChild(inp); const go = () => { const val = inp.value.trim(); if (!val || (v.input.kind === 'number' && isNaN(parseFloat(val)))) { buzz(80); return; } sendAct({ a: 'input', v: v.input.kind === 'number' ? parseFloat(val) : val }); inp.disabled = true; }; inp.onkeydown = e => { if (e.key === 'Enter') go(); }; const g = btn(v.input.btn || 'إرسال ✓', '', go); g.style.width = '100%'; g.style.marginTop = '8px'; c.appendChild(g); }
  if (v.buzz) { const bz = el('button', 'bigBuzz', v.buzz.label || '🔔'); bz.disabled = !!v.buzz.dis; bz.addEventListener('pointerdown', e => { e.preventDefault(); if (bz.disabled) return; bz.disabled = true; buzz(120); sendAct({ a: 'buzz' }); }); c.appendChild(bz); }
  if (v.scores) { const r = el('div', 'reslist'); r.style.marginTop = '8px'; const mx = Math.max(...v.scores.map(x => x[1])); v.scores.forEach(([n, s]) => { const d = el('div', s === mx && s > 0 ? 'best' : ''); d.append(el('span', '', n), el('b', '', s)); r.appendChild(d); }); c.appendChild(el('div', 'lab', 'النقاط 🏆')); c.appendChild(r); }
  setBtns2(on.row, (v.btns || []).map(bb => btn(bb.label, bb.cls || '', () => sendAct({ a: 'btn', v: bb.id }), bb.flex || 1)));
  if (v.beep) beep(v.beep, .12);
}
function paintCv() {
  const D = drawCtx; if (!D) return; const x = D.cv.getContext('2d'), W = D.cv.width, H2 = D.cv.height;
  x.clearRect(0, 0, W, H2); x.lineCap = 'round'; x.lineJoin = 'round'; x.lineWidth = Math.max(4, W / 90);
  D.strokes.forEach(s => { x.strokeStyle = s.c; x.beginPath(); s.pts.forEach((p, i) => i ? x.lineTo(p[0] * W, p[1] * H2) : x.moveTo(p[0] * W, p[1] * H2)); if (s.pts.length === 1) x.lineTo(s.pts[0][0] * W + .1, s.pts[0][1] * H2); x.stroke(); });
}

/* =================================================================
   المضيف
   ================================================================= */
let H = null;
const PCOL = ['#d7263d', '#1b6ca8', '#2e8b57', '#f29e0c', '#7b2cbf', '#e75a9c', '#00a6a6', '#6b4226', '#222222', '#8db600', '#ff6b35', '#3d5a80'];
function hostStart() {
  const code = String(1000 + rnd(9000));
  ROLE = 'host'; ME = 'host';
  H = { code, players: [{ id: 'host', name: S.myName || S.players[0] || 'المضيف', on: true, score: 0 }], game: null };
  status('جاري تجهيز الغرفة…', 'ok'); show('online');
  Net.host(code, { msg: hostMsg, leave: hostLeave }).then(() => { setTag('🌐 غرفة ' + code); hostLobby(); }).catch(e => {
    if (e && e.message === 'taken') return hostStart();
    ROLE = null; on.body.innerHTML = ''; status('ما قدرت أسوي الغرفة. تأكد إن النت شغال وجرب مرة ثانية.', 'bad'); setBtns2(on.row, [btn('جرب مرة ثانية 🔄', '', hostStart)]);
  });
}
const P = id => H.players.find(p => p.id === id);
const active = () => H.players.filter(p => p.on);
function hostMsg(pid, m) {
  if (!H) return;
  if (m.t === 'hello') {
    let name = String(m.name || 'لاعب').slice(0, 16).trim() || 'لاعب';
    let p = H.players.find(x => x.name === name && !x.on);
    if (p) { p.id = pid; p.on = true; }
    else { while (H.players.some(x => x.name === name)) name += '٢'; p = { id: pid, name, on: true, score: 0 }; H.players.push(p); }
    Net.send(pid, { t: 'welcome', name: p.name, code: H.code }); beep(1000, .08);
    if (H.game && H.game.join) H.game.join(p);
    return push();
  }
  if (m.t === 'act') return hostAct(pid, m);
}
function hostLeave(pid) { const p = P(pid); if (p) { p.on = false; if (H.game && H.game.leave) H.game.leave(p); push(); } }
function hostAct(pid, m) {
  const p = P(pid); if (!p) return;
  if (m.a === 'btn' && String(m.v).startsWith('h:') && pid !== 'host') return;
  if (m.a === 'btn' && m.v === 'h:lobby') { H.game = null; return push(); }
  if (H.game) H.game.act(p, m); else if (m.a === 'btn' && pid === 'host' && GAMES_ON[m.v]) { H.game = GAMES_ON[m.v].make(); H.game.start(); }
  push();
}
function push() {
  if (!H) return;
  H.players.forEach(p => {
    if (!p.on) return;
    const v = viewFor(p);
    if (p.id === 'host') renderView(v, a => hostAct('host', a)); else Net.send(p.id, { t: 'view', v });
  });
}
const scoresList = () => H.players.map(p => [p.name + (p.on ? '' : ' (طلع)'), p.score]).sort((a, b) => b[1] - a[1]);
function joinUrl() { const base = /github\.io/.test(location.host) ? location.origin + location.pathname : PUBLIC_URL; return base + '?r=' + H.code; }
function viewFor(p) {
  if (H.game) { const v = H.game.view(p); if (p.id === 'host') { v.btns = (v.btns || []).concat(H.game.hostBtns ? H.game.hostBtns() : []); v.btns.push({ id: 'h:lobby', label: '🏠 الغرفة', cls: 'ghost' }); } return v; }
  if (p.id !== 'host') return { title: '🌐 غرفة ' + H.code, items: [{ t: 'win good', v: 'دخلت الغرفة ✅' }, { t: 'lab', v: 'انتظر ' + H.players[0].name + ' يختار اللعبة…' }, { t: 'plist', v: active().map(x => [x.name, x.id === p.id ? 'ok' : '']) }], scores: H.players.some(x => x.score) ? scoresList() : null };
  return { title: '🌐 غرفتك', items: [] , lobby: true };
}
function hostLobby() {
  const v = viewFor(P('host'));
  if (!v.lobby) return push();
  const b = on.body; b.innerHTML = ''; on.h.textContent = '🌐 غرفتك';
  const c = el('div', 'box'); c.style.textAlign = 'center';
  c.append(el('div', 'lab', 'كود الغرفة'), el('div', 'code', H.code));
  const link = el('div', 'link', joinUrl()); c.appendChild(link);
  const r = el('div', 'row'); r.style.marginTop = '10px';
  const cp = btn('📋 انسخ الرابط', 'ghost', async () => { try { await navigator.clipboard.writeText(joinUrl()); cp.textContent = 'تم النسخ ✓'; } catch (e) { const sel = window.getSelection(), rg = document.createRange(); rg.selectNodeContents(link); sel.removeAllRanges(); sel.addRange(rg); cp.textContent = 'انسخه من فوق 👆'; } });
  const wa = el('a', ''); wa.href = 'https://wa.me/?text=' + encodeURIComponent('تعالوا العبوا معي في تقزيرة 🎲 ادخلوا من هنا: ' + joinUrl()); wa.target = '_blank'; wa.rel = 'noopener'; const wb = el('button', 'grn', '🟢 أرسل بالواتساب'); wb.style.width = '100%'; wa.appendChild(wb); wa.style.flex = '1';
  r.append(cp, wa); c.appendChild(r);
  const nm = el('div', 'row'); nm.style.marginTop = '10px'; const ni = el('input'); ni.type = 'text'; ni.value = H.players[0].name; ni.maxLength = 16; ni.placeholder = 'اسمك'; ni.oninput = () => { H.players[0].name = ni.value.trim() || 'المضيف'; S.myName = H.players[0].name; save(); }; nm.append(el('b', '', 'اسمك: '), ni); c.appendChild(nm);
  b.appendChild(c);
  const pb = el('div', 'box'); pb.append(el('h2', '', 'اللي دخلوا (' + active().length + ')')); const pl = el('div', 'plist'); H.players.forEach(p => pl.appendChild(el('span', p.on ? '' : 'off', p.name + (p.id === 'host' ? ' 👑' : '')))); pb.appendChild(pl);
  if (active().length < 2) pb.appendChild(el('div', 'lab', 'انتظر ربعك يدخلون من الرابط…'));
  b.appendChild(pb);
  const gb = el('div', 'box'); gb.appendChild(el('h2', '', 'اختار اللعبة'));
  const g = el('div', 'ogames');
  Object.entries(GAMES_ON).forEach(([id, G2]) => { const x = el('button', ''); x.append(el('b', '', G2.e + ' ' + G2.n), el('small', '', G2.d + ' · ' + G2.min + '+ لاعبين')); x.onclick = () => { if (active().length < G2.min) { status(G2.n + ' تبي ' + G2.min + ' لاعبين على الأقل', 'bad'); return; } hostAct('host', { a: 'btn', v: id }); }; g.appendChild(x); });
  gb.appendChild(g); b.appendChild(gb);
  if (H.players.some(x => x.score)) { const sb = el('div', 'box'); sb.appendChild(el('h2', '', 'النقاط 🏆')); sb.appendChild(resList2(scoresList())); const z = btn('تصفير النقاط', 'ghost small', () => { H.players.forEach(p => p.score = 0); hostLobby(); }); z.style.marginTop = '8px'; sb.appendChild(z); b.appendChild(sb); }
  setBtns2(on.row, [btn('سكّر الغرفة ✖', 'ghost', () => { leaveRoom(); renderHome(); show('home'); })]);
  show('online');
}
function resList2(arr) { const r = el('div', 'reslist'); arr.forEach(([n, v]) => { const d = el('div', ''); d.append(el('span', '', n), el('b', '', v)); r.appendChild(d); }); return r; }
// لما تتغير قائمة اللاعبين واحنا في اللوبي نعيد الرسم
const _push = push;
function pushWrap() { if (H && !H.game && ROLE === 'host') { hostLobby(); H.players.forEach(p => { if (p.on && p.id !== 'host') Net.send(p.id, { t: 'view', v: viewFor(p) }); }); } else _push(); }

/* =================================================================
   الألعاب الأونلاين (منطق المضيف)
   ================================================================= */
const shuffleP = () => shuffle(active());
const allDone = (m) => active().every(p => m[p.id] !== undefined);
const waitTxt = (m) => 'انتظر الباقين… (' + active().filter(p => m[p.id] !== undefined).length + ' من ' + active().length + ')';

// 🕵️ الامبوستر + 🎨 الرسم
function makeImp(drawMode) {
  const G3 = { phase: 'reveal' };
  G3.start = () => {
    const pool = drawMode ? ['حيوانات 🐾', 'أكل وشرب 🍽️', 'نباتات وفواكه وخضار 🌿', 'سيارات ومواصلات 🚗', 'أماكن 📍', 'أغراض وأجهزة 🏠', 'فضاء وطبيعة 🌙', 'مهن 👨‍⚕️'].filter(c => TOPICS[c]) : Object.keys(TOPICS);
    [G3.cat, G3.word] = topicWord(pool);
    const ps = active(); G3.ids = ps.map(p => p.id); const n = ps.length >= 7 ? 2 : 1;
    G3.imps = shuffle(G3.ids).slice(0, n); G3.seen = {}; G3.votes = {}; G3.guess = {}; G3.phase = 'reveal';
    G3.col = {}; G3.ids.forEach((id, i) => G3.col[id] = PCOL[i % PCOL.length]); G3.strokes = []; G3.pts = {};
  };
  const nm = id => (P(id) || {}).name || '؟';
  const isImp = id => G3.imps.includes(id);
  G3.leave = () => { };
  G3.view = p => {
    const title = drawMode ? '🎨 ارسم وصيد الامبوستر' : '🕵️ الامبوستر';
    if (!G3.ids.includes(p.id)) return { title, items: [{ t: 'lab', v: 'الجولة بدأت قبل لا تدخل، انتظر الجولة الجاية 🙏' }] };
    if (G3.phase === 'reveal') {
      const sec = isImp(p.id) ? '<div class="emo" style="font-size:50px">🤫</div><div class="t2 bad" style="font-family:Lalezar;font-size:32px">أنت الامبوستر!</div><div class="lab">الموضوع: ' + esc(G3.cat) + '</div>' : '<div class="lab">' + esc(G3.cat) + '</div><div style="font-family:Lalezar;font-size:36px;color:var(--grn)">' + esc(G3.word) + '</div><div class="desc">' + esc(descOf(G3.cat, G3.word)) + '</div>';
      return { title, items: [{ t: 'lab', v: 'كلمتك السرية (خل جوالك بعيد عن عيون الباقين 👀)' }], secret: sec, btns: G3.seen[p.id] ? [] : [{ id: 'seen', label: 'شفت ✓ جاهز' }], status: G3.seen[p.id] ? [waitTxt(G3.seen)] : null };
    }
    if (G3.phase === 'ask') {
      const [a, b] = G3.pairs[G3.k];
      return { title, items: [{ t: 'lab', v: 'جولة الأسئلة ' + (G3.k + 1) + ' من ' + G3.pairs.length }, { t: 'nm', v: nm(a) }, { t: 'lab', v: 'يسأل 👇' }, { t: 'nm', v: nm(b), color: 'var(--grn)' }, { t: 'lab', v: 'الموضوع: ' + G3.cat }, { t: 'lab', v: 'اسأل سؤال عن الكلمة بصوت عالي بدون ما تفضحها' }] };
    }
    if (G3.phase === 'draw') {
      const t = G3.turns[G3.ti], mine = t.id === p.id;
      return { title, items: [{ t: 'lab', v: 'الجولة ' + (t.r + 1) + ' من ' + G3.rounds + ' · الموضوع: ' + G3.cat }, { t: 'nm', v: mine ? 'دورك! ارسم خط واحد ✏️' : 'دور ' + nm(t.id) + ' يرسم', color: G3.col[t.id] }], canvas: { strokes: G3.strokes, can: mine && !G3.drawn, color: G3.col[p.id] }, btns: mine && G3.drawn ? [{ id: 'drawn', label: 'تم ✓', flex: 2 }] : [] };
    }
    if (G3.phase === 'vote') {
      const img = drawMode ? [{ t: 'img', v: G3.img }] : [];
      if (G3.votes[p.id] !== undefined) return { title, items: img.concat([{ t: 'win good', v: 'صوّتت ✓' }]), status: [waitTxt(G3.votes)] };
      return { title, items: img.concat([{ t: 'lab', v: 'مين تشك إنه الامبوستر؟ (تصويت سري)' }]), opts: G3.ids.filter(id => id !== p.id && P(id)).map(id => ({ id, label: nm(id) })) };
    }
    if (G3.phase === 'guess') {
      const pend = G3.imps.filter(id => G3.guess[id] === undefined);
      if (isImp(p.id) && G3.guess[p.id] === undefined) return { title, items: [{ t: 'lab', v: 'أنت الامبوستر! وش كانت الكلمة؟ إذا جبتها تاخذ +١' }], opts: G3.gopts.map(w => ({ id: w, label: w })) };
      return { title, items: [{ t: 'lab', v: 'التصويت خلص… الامبوستر الحين يخمن الكلمة 🤔' }].concat(G3.tallyItems), status: [pend.length ? 'ننتظر ' + pend.map(nm).join(' و ') : 'خلصنا'] };
    }
    if (G3.phase === 'end') {
      return { title: '🏁 النتيجة', items: [{ t: 'lab', v: 'الامبوستر كان' }, { t: 'nm', v: G3.imps.map(nm).join(' و ') }, { t: 'lab', v: 'والكلمة' }, { t: 'txt good', v: G3.word }, { t: 'desc', v: descOf(G3.cat, G3.word) }].concat(G3.tallyItems).concat([{ t: 'lab', v: 'نقاط هالجولة' }, { t: 'list', v: G3.ids.filter(id => P(id)).map(id => [nm(id), '+' + (G3.pts[id] || 0), (G3.pts[id] || 0) > 0]) }]), scores: scoresList() };
    }
  };
  G3.hostBtns = () => {
    if (G3.phase === 'reveal') return [{ id: 'h:go', label: drawMode ? 'يلا نرسم ←' : 'يلا الأسئلة ←', flex: 2 }];
    if (G3.phase === 'ask') return [{ id: 'h:next', label: G3.k < G3.pairs.length - 1 ? 'اللي بعده ←' : 'جولة ثانية 🔁', flex: 2 }, { id: 'h:vote', label: 'التصويت 🗳️', cls: 'red' }];
    if (G3.phase === 'draw') return [{ id: 'h:vote', label: '🗳️ وقفوا وصوتوا', cls: 'ghost' }];
    if (G3.phase === 'vote') return [{ id: 'h:tally', label: 'اكشف النتيجة (حتى لو باقي أحد)', cls: 'ghost' }];
    if (G3.phase === 'guess') return [{ id: 'h:end', label: 'شوف النتيجة 🏁', cls: 'ghost' }];
    if (G3.phase === 'end') return [{ id: 'h:again', label: 'جولة جديدة 🔄', flex: 2 }];
    return [];
  };
  const toAsk = () => { const ids = shuffle(G3.ids.filter(id => P(id) && P(id).on)); G3.pairs = ids.map((a, i) => [a, ids[(i + 1) % ids.length]]); G3.k = 0; G3.phase = 'ask'; };
  const toDraw = () => { const ids = shuffle(G3.ids.filter(id => P(id) && P(id).on)); G3.rounds = 2; G3.turns = []; for (let r = 0; r < G3.rounds; r++) ids.forEach(id => G3.turns.push({ id, r })); G3.ti = 0; G3.drawn = false; G3.phase = 'draw'; };
  const toVote = () => { G3.phase = 'vote'; if (drawMode) G3.img = snapshot(G3.strokes); };
  const tally = () => {
    const cnt = {}; Object.values(G3.votes).forEach(t => cnt[t] = (cnt[t] || 0) + 1);
    Object.entries(G3.votes).forEach(([v, t]) => { if (isImp(v)) return; if (isImp(t)) G3.pts[v] = (G3.pts[v] || 0) + 1; else G3.imps.forEach(i => G3.pts[i] = (G3.pts[i] || 0) + 1); });
    G3.tallyItems = [{ t: 'lab', v: 'الأصوات' }, { t: 'list', v: G3.ids.filter(id => P(id)).map(id => [nm(id) + (isImp(id) ? ' 🤫' : ''), cnt[id] || 0, false]).sort((a, b) => b[1] - a[1]) }];
    G3.gopts = shuffle([G3.word, ...shuffle(TOPICS[G3.cat].filter(w => w !== G3.word)).slice(0, 5)]);
    G3.phase = 'guess'; if (G3.imps.every(id => !P(id) || !P(id).on)) finish();
  };
  const finish = () => { if (G3.phase === 'end') return; Object.entries(G3.pts).forEach(([id, v]) => { const pp = P(id); if (pp) pp.score += v; }); G3.phase = 'end'; };
  G3.act = (p, m) => {
    const id = p.id;
    if (G3.phase === 'reveal') { if (m.v === 'seen') G3.seen[id] = 1; if (m.v === 'h:go' || G3.ids.every(x => G3.seen[x] || !P(x) || !P(x).on)) drawMode ? toDraw() : toAsk(); return; }
    if (G3.phase === 'ask') { if (m.v === 'h:next') { if (G3.k < G3.pairs.length - 1) G3.k++; else toAsk(); } if (m.v === 'h:vote') toVote(); return; }
    if (G3.phase === 'draw') {
      const t = G3.turns[G3.ti];
      if (m.a === 'stroke' && t.id === id && !G3.drawn) { if (!G3.curS) { G3.curS = { c: G3.col[id], pts: [] }; G3.strokes.push(G3.curS); } G3.curS.pts.push(...(m.v || [])); if (m.fin) { G3.curS = null; G3.drawn = true; } else { liveCanvas(); return 'nopush'; } }
      if (m.v === 'drawn' && t.id === id && G3.drawn) { G3.ti++; G3.drawn = false; if (G3.ti >= G3.turns.length) toVote(); }
      if (m.v === 'h:vote') toVote();
      return;
    }
    if (G3.phase === 'vote') { if (m.a === 'opt' && G3.ids.includes(m.v) && m.v !== id) G3.votes[id] = m.v; if (m.v === 'h:tally' || G3.ids.every(x => G3.votes[x] !== undefined || !P(x) || !P(x).on)) tally(); return; }
    if (G3.phase === 'guess') { if (m.a === 'opt' && isImp(id) && G3.guess[id] === undefined) { G3.guess[id] = m.v; if (m.v === G3.word) G3.pts[id] = (G3.pts[id] || 0) + 1; } if (m.v === 'h:end' || G3.imps.every(x => G3.guess[x] !== undefined || !P(x) || !P(x).on)) finish(); return; }
    if (G3.phase === 'end' && m.v === 'h:again') G3.start();
  };
  function liveCanvas() { H.players.forEach(pp => { if (!pp.on) return; if (pp.id === 'host') { if (drawCtx && pp.id !== G3.turns[G3.ti].id) { drawCtx.strokes = G3.strokes.map(s => ({ c: s.c, pts: s.pts.slice() })); paintCv(); } } else if (pp.id !== G3.turns[G3.ti].id) Net.send(pp.id, { t: 'strokes', s: G3.strokes }); }); }
  return G3;
}
function snapshot(strokes) {
  try { const cv = document.createElement('canvas'); cv.width = 460; cv.height = 529; const x = cv.getContext('2d'); x.fillStyle = '#fffdf7'; x.fillRect(0, 0, 460, 529); x.lineCap = 'round'; x.lineJoin = 'round'; x.lineWidth = 5;
    strokes.forEach(s => { x.strokeStyle = s.c; x.beginPath(); s.pts.forEach((p, i) => i ? x.lineTo(p[0] * 460, p[1] * 529) : x.moveTo(p[0] * 460, p[1] * 529)); x.stroke(); }); return cv.toDataURL('image/jpeg', .7); } catch (e) { return ''; }
}

// 🗳️ الأغلبية / 🎯 أقرب رقم / 🎤 مين قالها
function makeSimple(kind) {
  const G3 = {};
  G3.start = () => { G3.ids = active().map(p => p.id); G3.ans = {}; G3.phase = 'ask'; G3.pts = {}; G3.q = kind === 'major' ? draw('majority', WYR) : kind === 'closest' ? draw('closest', CLOSEST) : draw('whosaid', WHO_SAID); };
  const nm = id => (P(id) || {}).name || '؟';
  const title = { major: '🗳️ الأغلبية', closest: '🎯 أقرب رقم', whosaid: '🎤 مين قالها؟' }[kind];
  G3.view = p => {
    if (!G3.ids.includes(p.id)) return { title, items: [{ t: 'lab', v: 'انتظر الجولة الجاية 🙏' }] };
    const done = G3.ans[p.id] !== undefined;
    if (G3.phase === 'ask') {
      if (kind === 'major') return done ? { title, items: [{ t: 'win good', v: 'اخترت ✓' }], status: [waitTxt(G3.ans)] } : { title, items: [{ t: 'lab', v: 'لو خيروك… وش بتختار الأغلبية؟ اختار بالسر' }], opts: G3.q.map((t, i) => ({ id: i, label: t })) };
      if (kind === 'closest') return done ? { title, items: [{ t: 'txt', v: G3.q.q }, { t: 'win good', v: 'جوابك: ' + G3.ans[p.id] }], status: [waitTxt(G3.ans)] } : { title, items: [{ t: 'txt', v: G3.q.q }], input: { kind: 'number', ph: 'تخمينك (' + G3.q.u + ')' } };
      return done ? { title, items: [{ t: 'txt', v: G3.q }, { t: 'win good', v: 'كتبت جوابك ✓' }], status: [waitTxt(G3.ans)] } : { title, items: [{ t: 'lab', v: 'اكتب جوابك بالسر' }, { t: 'txt', v: G3.q }], input: { kind: 'text', ph: 'جوابك…' } };
    }
    if (G3.phase === 'guessWho') {
      const a = G3.list[G3.k]; const mine = a.id === p.id;
      if (mine) return { title, items: [{ t: 'lab', v: 'هذا جوابك 😏 خلهم يخمنون' }, { t: 'txt', v: '«' + a.t + '»' }], status: [waitTxt(G3.gv)] };
      if (G3.gv[p.id] !== undefined) return { title, items: [{ t: 'txt', v: '«' + a.t + '»' }, { t: 'win good', v: 'خمّنت ✓' }], status: [waitTxt(G3.gv)] };
      return { title, items: [{ t: 'lab', v: G3.q }, { t: 'lab', v: 'جواب ' + (G3.k + 1) + ' من ' + G3.list.length }, { t: 'txt', v: '«' + a.t + '»' }, { t: 'lab', v: 'مين كاتبه؟' }], opts: G3.ids.filter(id => id !== p.id && P(id)).map(id => ({ id, label: nm(id) })) };
    }
    if (G3.phase === 'wres') { const a = G3.list[G3.k]; return { title, items: [{ t: 'txt', v: '«' + a.t + '»' }, { t: 'lab', v: 'كاتبه' }, { t: 'nm', v: nm(a.id) }, { t: 'list', v: Object.entries(G3.gv).map(([g, t]) => [nm(g) + ' قال ' + nm(t), t === a.id ? '✅' : '❌', t === a.id]) }] }; }
    if (G3.phase === 'res') return { title, items: G3.res, scores: scoresList() };
  };
  G3.hostBtns = () => {
    if (G3.phase === 'ask') return [{ id: 'h:reveal', label: 'اكشف (حتى لو باقي أحد)', cls: 'ghost' }];
    if (G3.phase === 'guessWho') return [{ id: 'h:wres', label: 'اكشف مين كاتبه', cls: 'ghost' }];
    if (G3.phase === 'wres') return [{ id: 'h:wnext', label: G3.k < G3.list.length - 1 ? 'الجواب اللي بعده ←' : 'النتيجة 🏆', flex: 2 }];
    if (G3.phase === 'res') return [{ id: 'h:again', label: 'سؤال جديد 🔄', flex: 2 }];
    return [];
  };
  const reveal = () => {
    if (kind === 'major') {
      const g = [[], []]; Object.entries(G3.ans).forEach(([id, k]) => g[k].push(id));
      const win = g[0].length === g[1].length ? -1 : g[0].length > g[1].length ? 0 : 1; if (win >= 0) g[win].forEach(id => { const pp = P(id); if (pp) pp.score++; });
      G3.res = [0, 1].map(k => ({ t: 'list', v: [[G3.q[k] + (win === k ? ' 🏆' : ''), g[k].length, win === k]].concat(g[k].map(id => ['· ' + nm(id), '', false])) })); G3.res.push({ t: 'win', v: win < 0 ? 'تعادل 🤝' : '+١ للأغلبية' }); G3.phase = 'res'; return;
    }
    if (kind === 'closest') {
      const arr = Object.entries(G3.ans).map(([id, v]) => [id, v, Math.abs(v - G3.q.a)]).sort((a, b) => a[2] - b[2]); const best = arr.length ? arr[0][2] : 0;
      arr.forEach(([id, , d]) => { if (d === best) { const pp = P(id); if (pp) pp.score++; } });
      G3.res = [{ t: 'txt', v: G3.q.q }, { t: 'lab', v: 'الجواب' }, { t: 'bigLetter', v: String(G3.q.a) }, { t: 'lab', v: G3.q.u }, { t: 'list', v: arr.map(([id, v, d]) => [nm(id) + (d === best ? ' 🏆' : ''), v, d === best]) }]; G3.phase = 'res'; return;
    }
    G3.list = shuffle(Object.entries(G3.ans).map(([id, t]) => ({ id, t }))); G3.k = 0; G3.gv = {}; G3.phase = G3.list.length ? 'guessWho' : 'res'; G3.res = [];
  };
  const wres = () => { const a = G3.list[G3.k]; Object.entries(G3.gv).forEach(([g, t]) => { if (t === a.id) { const pp = P(g); if (pp) pp.score++; } else { const pp = P(a.id); if (pp) pp.score++; } }); G3.phase = 'wres'; };
  G3.act = (p, m) => {
    const id = p.id;
    if (G3.phase === 'ask') {
      if (G3.ids.includes(id) && G3.ans[id] === undefined && ((kind === 'major' && m.a === 'opt') || (kind !== 'major' && m.a === 'input'))) G3.ans[id] = m.v;
      if (m.v === 'h:reveal' || G3.ids.every(x => G3.ans[x] !== undefined || !P(x) || !P(x).on)) reveal(); return;
    }
    if (G3.phase === 'guessWho') { const a = G3.list[G3.k]; if (m.a === 'opt' && id !== a.id && G3.gv[id] === undefined) G3.gv[id] = m.v; if (m.v === 'h:wres' || G3.ids.every(x => x === a.id || G3.gv[x] !== undefined || !P(x) || !P(x).on)) wres(); return; }
    if (G3.phase === 'wres' && m.v === 'h:wnext') { if (G3.k < G3.list.length - 1) { G3.k++; G3.gv = {}; G3.phase = 'guessWho'; } else { G3.res = [{ t: 'win good', v: 'خلصت الأجوبة!' }]; G3.phase = 'res'; } return; }
    if (G3.phase === 'res' && m.v === 'h:again') G3.start();
  };
  return G3;
}

// 🔔 الجرس
function makeBuzz() {
  const G3 = {};
  G3.start = () => { const c = draw('bzcat', Object.keys(SJ)); const l = pick([200, 200, 400]); const q = draw('sj_' + c + '_' + l, SJ[c][l]); G3.q = q; G3.c = c; G3.lock = null; G3.out = []; G3.phase = 'q'; G3.msg = ''; };
  const nm = id => (P(id) || {}).name || '؟';
  G3.view = p => {
    const base = [{ t: 'lab', v: G3.c }, { t: 'txt', v: G3.q.q }];
    if (G3.phase === 'ans') return { title: '🔔 الجرس', items: base.concat([{ t: 'lab', v: 'الجواب' }, { t: 'txt good', v: G3.q.a }, { t: 'win', v: G3.msg }]), scores: scoresList() };
    if (G3.lock) return { title: '🔔 الجرس', items: base.concat([{ t: 'win', v: '🔔 ' + nm(G3.lock) + ' يجاوب!' }]), beep: 1300, buzz: { label: G3.lock === p.id ? 'جاوب! 🗣️' : '🔒', dis: true } };
    return { title: '🔔 الجرس', items: base.concat(G3.msg ? [{ t: 'lab', v: G3.msg }] : []), buzz: { label: G3.out.includes(p.id) ? '🔒' : '🔔 اضغط!', dis: G3.out.includes(p.id) } };
  };
  G3.hostBtns = () => G3.phase === 'ans' ? [{ id: 'h:next', label: 'السؤال اللي بعده ←', flex: 2 }] : G3.lock ? [{ id: 'h:ok', label: '✅ صح', cls: 'grn' }, { id: 'h:no', label: '❌ غلط', cls: 'red' }] : [{ id: 'h:show', label: 'اكشف الجواب', cls: 'ghost' }];
  G3.act = (p, m) => {
    if (m.a === 'buzz' && G3.phase === 'q' && !G3.lock && !G3.out.includes(p.id)) { G3.lock = p.id; return; }
    if (m.v === 'h:ok' && G3.lock) { P(G3.lock).score++; G3.msg = nm(G3.lock) + ' +١ 🎉'; G3.phase = 'ans'; return; }
    if (m.v === 'h:no' && G3.lock) { G3.out.push(G3.lock); G3.msg = nm(G3.lock) + ' غلط ❌'; G3.lock = null; if (active().every(x => G3.out.includes(x.id))) { G3.phase = 'ans'; G3.msg = 'ولا أحد جابها'; } return; }
    if (m.v === 'h:show') { G3.phase = 'ans'; G3.msg = G3.msg || 'ولا أحد جاوب'; return; }
    if (m.v === 'h:next') G3.start();
  };
  return G3;
}

const GAMES_ON = {
  imp: { e: '🕵️', n: 'الامبوستر', d: 'كل واحد يشوف كلمته على جواله', min: 3, make: () => makeImp(false) },
  drw: { e: '🎨', n: 'ارسم وصيد الامبوستر', d: 'كل واحد يرسم من جواله', min: 3, make: () => makeImp(true) },
  major: { e: '🗳️', n: 'الأغلبية', d: 'تصويت سري من الجوالات', min: 3, make: () => makeSimple('major') },
  closest: { e: '🎯', n: 'أقرب رقم', d: 'كل واحد يكتب تخمينه', min: 2, make: () => makeSimple('closest') },
  whosaid: { e: '🎤', n: 'مين قالها؟', d: 'اكتب جوابك وخلهم يخمنون', min: 3, make: () => makeSimple('whosaid') },
  buzz: { e: '🔔', n: 'الجرس', d: 'كل جوال صار زر جرس', min: 2, make: makeBuzz }
};
// نعدل push عشان اللوبي ينرسم صح
push = function () { if (!H) return; if (!H.game && ROLE === 'host') { hostLobby(); H.players.forEach(p => { if (p.on && p.id !== 'host') Net.send(p.id, { t: 'view', v: viewFor(p) }); }); return; } H.players.forEach(p => { if (!p.on) return; const v = viewFor(p); if (p.id === 'host') renderView(JSON.parse(JSON.stringify(v)), a => hostAct('host', a)); else Net.send(p.id, { t: 'view', v }); }); };
const _hostAct = hostAct;
hostAct = function (pid, m) { const p = P(pid); if (!p) return; if (m.a === 'btn' && String(m.v).startsWith('h:') && pid !== 'host') return; if (m.a === 'btn' && m.v === 'h:lobby') { H.game = null; return push(); }
  let r; if (H.game) r = H.game.act(p, m); else if (m.a === 'btn' && pid === 'host' && GAMES_ON[m.v]) { H.game = GAMES_ON[m.v].make(); H.game.start(); }
  if (r !== 'nopush') push(); };

/* =================================================================
   الضيف (يدخل من المتصفح)
   ================================================================= */
function guestJoin(code) {
  const b = on.body; b.innerHTML = ''; on.h.textContent = '🌐 ادخل غرفة';
  const c = el('div', 'box'); c.style.textAlign = 'center';
  c.append(el('div', 'lab', 'كود الغرفة'));
  const ci = el('input'); ci.type = 'text'; ci.inputMode = 'numeric'; ci.maxLength = 4; ci.value = code || ''; ci.className = 'bigin'; ci.style.direction = 'ltr'; ci.style.letterSpacing = '8px'; ci.style.fontSize = '30px';
  const ni = el('input'); ni.type = 'text'; ni.className = 'bigin'; ni.maxLength = 16; ni.placeholder = 'اكتب اسمك'; ni.value = S.myName || ''; ni.style.marginTop = '10px';
  c.append(ci, ni); b.appendChild(c);
  const err = el('div', 'err', ''); b.appendChild(err);
  setBtns2(on.row, [btn('ادخل 🚪', '', () => {
    const cd = ci.value.trim(), nm = ni.value.trim(); if (!/^\d{4}$/.test(cd)) { err.textContent = 'الكود ٤ أرقام'; return; } if (!nm) { err.textContent = 'اكتب اسمك'; return; }
    S.myName = nm; save(); err.textContent = ''; status('جاري الاتصال بالغرفة…', 'ok');
    ROLE = 'guest';
    Net.join(cd, {
      open: () => { Net.toHost({ t: 'hello', name: nm }); },
      msg: m => {
        if (m.t === 'welcome') { ME = m.name; setTag('🌐 ' + m.name + ' · غرفة ' + m.code); status('', 'ok'); }
        else if (m.t === 'view') renderView(m.v, a => Net.toHost(Object.assign({ t: 'act' }, a)));
        else if (m.t === 'strokes' && drawCtx && !drawCtx.cur) { drawCtx.strokes = m.s; paintCv(); }
        else if (m.t === 'closed') guestLost('المضيف سكّر الغرفة');
      },
      close: () => guestLost('انقطع الاتصال بالغرفة 😕')
    }).catch(() => { ROLE = null; status('ما قدرت أدخل. تأكد من الكود وإن صاحب الغرفة فاتح التطبيق، وإن النت شغال.', 'bad'); });
  })]);
  show('online');
}
function guestLost(t) { if (ROLE !== 'guest') return; ROLE = null; setTag(''); on.body.innerHTML = ''; status(t, 'bad'); setBtns2(on.row, [btn('ادخل مرة ثانية 🔄', '', () => guestJoin(''))]); }

/* ---------- زر الأونلاين في الرئيسية ---------- */
const box = el('div', 'onlineBox');
box.innerHTML = '<h2>🌐 العب أونلاين مع ربعك</h2><p>سوّ غرفة وأرسل الرابط، وربعك يدخلون من المتصفح بدون ما ينزلون شي. كل واحد على جواله.</p>';
const r = el('div', 'row'); r.append(btn('سوّ غرفة 🏠', '', () => { CUR = { id: 'online', e: '🌐', n: 'أونلاين' }; hostStart(); }), btn('ادخل غرفة 🚪', '', () => { CUR = { id: 'online', e: '🌐', n: 'أونلاين' }; guestJoin(''); }));
box.appendChild(r);
const homeBox = $('home').querySelector('.box'); $('home').insertBefore(box, homeBox);
// لو فتح الرابط فيه ?r=1234 ندخله على طول
const m = location.search.match(/[?&]r=(\d{4})/);
if (m) { CUR = { id: 'online', e: '🌐', n: 'أونلاين' }; setTimeout(() => guestJoin(m[1]), 0); }
window.ONL = { register: (id, def) => { GAMES_ON[id] = def; }, renderers: ONL_R, P: id => P(id), active: () => active(), scoresList: () => scoresList(), host: () => H, liveSend: (id, msg) => Net.send(id, msg), push: () => push() };
window.__on = () => ({ H, ROLE, ME, Net, lastView, hostStart, guestJoin, push });
})();
