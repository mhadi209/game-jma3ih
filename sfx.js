/* ===== تقزيرة: مؤثرات صوتية (كلها مركّبة بالكود، بدون ملفات) ===== */
(function () {
'use strict';
let master = null, comp = null, nbuf = null, actx = null;
const VOLS = [0, .35, .7, 1];
const vol = () => VOLS[S.sfxVol === undefined ? 2 : S.sfxVol];
function ctx() {
  try {
    actx = (typeof audioCtx === 'function') ? audioCtx() : (actx || new (window.AudioContext || window.webkitAudioContext)());
    if (actx.state === 'suspended') actx.resume();
    if (!master || master.context !== actx) {
      comp = actx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; comp.connect(actx.destination);
      master = actx.createGain(); master.connect(comp);
      const n = actx.sampleRate * 2; nbuf = actx.createBuffer(1, n, actx.sampleRate); const d = nbuf.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    }
    master.gain.value = vol();
    return actx;
  } catch (e) { return null; }
}
const ok = () => vol() > 0 && !window.__mute;
function env(g, t, a, d, peak) { g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(peak, .0002), t + a); g.gain.exponentialRampToValueAtTime(.0001, t + a + d); }
function tone(f, d, o) {
  o = o || {}; const c = ctx(); if (!c) return; const t = c.currentTime + (o.at || 0);
  const os = c.createOscillator(); os.type = o.type || 'sine'; os.frequency.setValueAtTime(f, t);
  if (o.slide) os.frequency.exponentialRampToValueAtTime(o.slide, t + (o.a || .005) + d);
  if (o.vib) { const l = c.createOscillator(), lg = c.createGain(); l.frequency.value = o.vib; lg.gain.value = f * .02; l.connect(lg); lg.connect(os.frequency); l.start(t); l.stop(t + d + .1); }
  const g = c.createGain(); env(g, t, o.a || .005, d, o.v === undefined ? .25 : o.v);
  let node = os; if (o.lp) { const fl = c.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = o.lp; os.connect(fl); node = fl; }
  node.connect(g); g.connect(master); os.start(t); os.stop(t + (o.a || .005) + d + .05);
}
function noise(d, o) {
  o = o || {}; const c = ctx(); if (!c) return; const t = c.currentTime + (o.at || 0);
  const s = c.createBufferSource(); s.buffer = nbuf;
  const fl = c.createBiquadFilter(); fl.type = o.type || 'bandpass'; fl.frequency.setValueAtTime(o.f || 1000, t); if (o.f2) fl.frequency.exponentialRampToValueAtTime(o.f2, t + d); fl.Q.value = o.q || 1;
  const g = c.createGain(); env(g, t, o.a || .003, d, o.v === undefined ? .25 : o.v);
  s.connect(fl); fl.connect(g); g.connect(master); s.start(t, Math.random()); s.stop(t + (o.a || .003) + d + .05);
}
let lastRes = 0; const res = () => { lastRes = Date.now(); };
const notes = (arr, o) => arr.forEach(([f, at, d]) => tone(f, d || .15, Object.assign({}, o, { at })));
const SFX = {
  tap() { tone(560, .035, { type: 'triangle', v: .07 }); noise(.015, { f: 3500, v: .025 }); },
  select() { tone(820, .05, { type: 'triangle', v: .12, slide: 1150 }); },
  pop() { tone(320, .07, { v: .2, slide: 950 }); },
  tick(hi) { tone(hi ? 1750 : 1250, .025, { v: .14 }); tone(hi ? 3500 : 2500, .015, { v: .04 }); },
  spinTick() { tone(1900, .012, { v: .07, type: 'triangle' }); noise(.008, { f: 5000, type: 'highpass', v: .04 }); },
  count() { tone(988, .09, { type: 'triangle', v: .2 }); },
  correct() { res(); notes([[880, 0, .1], [1320, .085, .28]], { type: 'triangle', v: .22 }); tone(2640, .25, { at: .085, v: .05 }); },
  wrong() { res(); tone(220, .3, { type: 'sawtooth', v: .14, slide: 140, lp: 1100 }); tone(233, .3, { type: 'square', v: .06, slide: 150, lp: 900 }); },
  win() { res(); notes([[523, 0, .12], [659, .1, .12], [784, .2, .12], [1047, .32, .5]], { type: 'triangle', v: .22 }); notes([[1047, .32, .5], [1319, .32, .5]], { type: 'sine', v: .08 }); for (let i = 0; i < 6; i++) tone(2000 + Math.random() * 2500, .08, { at: .4 + i * .07, v: .04 }); },
  lose() { res(); notes([[392, 0, .22], [370, .25, .22], [349, .5, .22]], { type: 'sawtooth', v: .1, lp: 1300 }); tone(330, .7, { at: .75, type: 'sawtooth', v: .1, lp: 1300, vib: 6 }); },
  strike() { res(); tone(110, .55, { type: 'square', v: .13, lp: 900 }); tone(117, .55, { type: 'sawtooth', v: .12, lp: 900 }); },
  timesUp() { res(); [0, .22, .44].forEach((at, i) => { tone(i < 2 ? 660 : 523, i < 2 ? .14 : .5, { at, type: 'square', v: .09, lp: 2200 }); }); },
  boom() { res(); noise(1.5, { type: 'lowpass', f: 1500, f2: 50, v: .9, q: .7 }); tone(95, .9, { slide: 28, v: .7 }); tone(55, 1.3, { v: .45, at: .02 }); noise(.4, { type: 'highpass', f: 3000, v: .2 }); },
  fuse(hi) { noise(.03, { f: hi ? 5500 : 4000, type: 'highpass', v: .14 }); tone(hi ? 2200 : 1700, .02, { v: .07 }); },
  whoosh() { noise(.32, { f: 350, f2: 3200, q: .8, v: .22 }); },
  swish() { noise(.09, { f: 2400, f2: 5200, q: 1.3, v: .22 }); },
  flip() { noise(.05, { f: 1600, q: 2, v: .28 }); tone(480, .03, { v: .06 }); },
  deal(n) { for (let i = 0; i < (n || 1); i++) { noise(.08, { at: i * .11, f: 2200, f2: 4800, q: 1.2, v: .22 }); tone(300, .03, { at: i * .11 + .07, v: .08 }); } },
  place() { tone(420, .06, { v: .28, slide: 290 }); noise(.02, { f: 1300, v: .12 }); },
  step() { tone(700, .03, { v: .12, type: 'triangle' }); },
  bell() { res(); tone(1568, .7, { v: .24 }); tone(2350, .55, { v: .09 }); tone(3136, .3, { v: .05 }); },
  ding() { res(); tone(1047, .55, { type: 'triangle', v: .24 }); tone(2093, .45, { v: .07 }); },
  turn() { notes([[660, 0, .09], [990, .1, .18]], { type: 'triangle', v: .17 }); },
  join() { notes([[700, 0, .07], [1050, .08, .12]], { type: 'triangle', v: .16 }); },
  leave() { notes([[1050, 0, .07], [700, .08, .12]], { type: 'triangle', v: .14 }); },
  start() { notes([[523, 0, .08], [784, .08, .08], [1047, .16, .18]], { type: 'triangle', v: .16 }); },
  reveal() { noise(.6, { type: 'highpass', f: 5000, v: .12 }); tone(196, .35, { v: .3, slide: 98 }); },
  drumroll(sec) { sec = sec || 1.5; const n = Math.floor(sec / .035); for (let i = 0; i < n; i++) noise(.03, { at: i * .035, type: 'lowpass', f: 600 + i * 6, v: .08 + .12 * i / n }); },
  suspense() { this.drumroll(1.2); },
  dice() { for (let i = 0; i < 7; i++) { const at = i * .075 + Math.random() * .03; noise(.03, { at, f: 1700 + Math.random() * 1600, q: 4, v: .22 }); tone(280 + Math.random() * 220, .03, { at, type: 'triangle', v: .1 }); } tone(140, .12, { at: .6, v: .28, slide: 80 }); noise(.06, { at: .6, type: 'lowpass', f: 900, v: .22 }); },
  diceHit() { noise(.03, { f: 1800 + Math.random() * 1500, q: 4, v: .2 }); tone(250 + Math.random() * 200, .03, { type: 'triangle', v: .09 }); },
  coinToss() { this.whoosh(); [0, .1, .2, .3].forEach((at, i) => tone(2600 + i * 120, .06, { at, v: .07 })); },
  coinLand() { res(); tone(2400, .5, { v: .13 }); tone(3700, .35, { v: .06 }); tone(2400, .25, { at: .14, v: .07 }); tone(2400, .15, { at: .24, v: .04 }); },
  safe() { res(); tone(900, .03, { v: .25, type: 'square', lp: 2500 }); noise(.5, { at: .08, type: 'lowpass', f: 900, f2: 250, v: .18 }); tone(1175, .3, { at: .12, type: 'triangle', v: .15 }); },
  liar() { res(); tone(130, .35, { type: 'sawtooth', v: .14, lp: 800 }); tone(155, .35, { type: 'sawtooth', v: .12, lp: 800 }); tone(98, .5, { at: .25, type: 'sawtooth', v: .14, lp: 700 }); },
  uno() { notes([[880, 0, .09], [1175, .1, .2]], { type: 'square', v: .09, lp: 3000 }); },
  capture() { res(); tone(330, .06, { slide: 900, v: .2 }); tone(600, .25, { at: .07, type: 'sawtooth', v: .1, slide: 180, lp: 1500 }); },
  home() { notes([[784, 0, .08], [988, .08, .08], [1319, .16, .25]], { type: 'triangle', v: .18 }); },
  night() { [220, 262, 330].forEach(f => tone(f, 1.4, { a: .35, v: .07 })); },
  day() { notes([[523, 0, .25], [659, .14, .25], [784, .28, .5]], { type: 'triangle', v: .14 }); },
  cheer() { res(); for (let i = 0; i < 40; i++) noise(.05 + Math.random() * .08, { at: Math.random() * 1.4, f: 900 + Math.random() * 2200, q: 2, v: .05 + Math.random() * .05 }); this.win(); },
  type() { tone(1500 + Math.random() * 300, .012, { v: .05, type: 'square', lp: 4000 }); },
  open() { tone(400, .12, { v: .1, slide: 700, type: 'triangle' }); noise(.12, { f: 1200, f2: 3500, v: .06 }); },
  recent: () => Date.now() - lastRes < 450,
  ok
};
// كل نداء قديم لـ beep(تردد، مدة) يتحول لصوت مناسب
window.beep = function (f, d, v) {
  if (!ok()) return; f = f || 880; d = d || .08;
  try {
    if (f <= 130 && d >= .6) return SFX.boom();
    if (f <= 160 && d >= .45) return SFX.strike();
    if (f <= 320 && d >= .5) return SFX.timesUp();
    if (f <= 320 && d >= .2) return SFX.wrong();
    if (f <= 320) return SFX.flip();
    if (f >= 1350 && d >= .2) return SFX.bell();
    if (f >= 1100 && d >= .25) return SFX.win();
    if (f >= 1100 && d >= .1) return SFX.correct();
    if (f === 660) return SFX.count();
    if (d <= .035) return SFX.spinTick();
    if (f <= 520 && d >= .15) return SFX.suspense();
    return SFX.select();
  } catch (e) { }
};
const S2 = {};
Object.keys(SFX).forEach(k => { const fn = SFX[k]; S2[k] = typeof fn === 'function' && k !== 'recent' && k !== 'ok' ? function () { if (!ok()) return; try { return fn.apply(SFX, arguments); } catch (e) { } } : fn; });
window.SFX = S2;

// صوت خفيف لكل ضغطة زر
document.addEventListener('pointerdown', e => { const b = e.target.closest && e.target.closest('button,.chip,.pcard,.ucard,.tok'); if (b && !b.disabled && !b.dataset.nosfx) S2.tap(); }, true);

// نتيجة جديدة تطلع على الشاشة (صح/غلط/فوز) — تشتغل للألعاب العادية والأونلاين
let seen = new Set();
function scanWins() {
  const scr = document.querySelector('.screen.on'); if (!scr) return;
  const now = new Set(); let snd = null;
  scr.querySelectorAll('.win').forEach(w => {
    const t = w.className + '|' + w.textContent; now.add(t);
    if (seen.has(t)) return;
    const tx = w.textContent;
    if (/🏆|فاز|فزت|بطل/.test(tx)) snd = 'win';
    else if (/💥|بوووم|انفجر/.test(tx)) snd = snd || 'boom';
    else if (w.classList.contains('good') || /صح|🎉|جابوها|جبتها/.test(tx)) snd = snd || 'correct';
    else if (w.classList.contains('bad') || /غلط|خلص الوقت|ما لحق/.test(tx)) snd = snd || 'wrong';
    else snd = snd || 'pop';
  });
  seen = now;
  if (snd && !SFX.recent()) S2[snd]();
}
let scanT = 0;
new MutationObserver(() => { if (!scanT) scanT = setTimeout(() => { scanT = 0; scanWins(); }, 40); }).observe(document.body, { childList: true, subtree: true });

// زر الصوت في الرئيسية + الإعدادات
const hb = document.querySelector('.homeBtns');
if (hb) {
  const sb = el('button', 'back'); const upd = () => sb.textContent = vol() > 0 ? '🔊' : '🔇'; upd();
  sb.onclick = () => { S.sfxVol = vol() > 0 ? 0 : 2; save(); upd(); if (vol() > 0) S2.start(); };
  sb.dataset.nosfx = 1; hb.appendChild(sb); window.__sfxBtn = upd;
}
window.SFX_VOL_UI = () => {
  const box = el('div', 'box'); box.appendChild(el('h2', '', '🔊 الأصوات'));
  const ch = el('div', 'chips'); [['🔇 بدون', 0], ['🔈 واطي', 1], ['🔉 وسط', 2], ['🔊 عالي', 3]].forEach(([t, v]) => { const c = el('button', 'chip' + ((S.sfxVol === undefined ? 2 : S.sfxVol) === v ? ' sel' : ''), t); c.dataset.nosfx = 1; c.onclick = () => { S.sfxVol = v; save(); ch.querySelectorAll('.chip').forEach(x => x.classList.remove('sel')); c.classList.add('sel'); if (window.__sfxBtn) window.__sfxBtn(); S2.correct(); }; ch.appendChild(c); });
  box.appendChild(ch); return box;
};
})();
