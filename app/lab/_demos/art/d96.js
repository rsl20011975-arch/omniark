/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/match-cut/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, E, el } from "./helpers.js";

// 밤하늘의 달에서 한낮의 해로, 같은 자리·같은 크기의 동그란 빛으로 컷한다. 화면은 시간 t 의 함수다.
const CUT = 2.6;                  // 컷이 일어나는 시각(초)
const DRIFT = .12;                // 컷 앞뒤 1초 동안 이어지는 크기 변화(0.12 = 1.0↔1.12)
const CUT_BLEND = 0;              // 컷 순간에 겹치는 디졸브 길이(초). 0 이면 순수한 컷
const CX = 320, CY = 138, D = 150; // 달·해의 중심 위치와 지름(px)
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);

function shot(sp, o) {
  const s = el('div', null, sp);
  box(s, { position: 'absolute', inset: '0', background: o.sky, overflow: 'hidden' });
  const glowWide = el('div', null, s), glowTight = el('div', null, s);       // 빛은 반경이 다른 두 겹
  const disk = el('div', null, s);
  const g = el('div', null, s);
  box(g, { position: 'absolute', left: '-40px', right: '-40px', bottom: '-70px', height: '170px', borderRadius: '50% 50% 0 0 / 60px 60px 0 0', background: o.ground, boxShadow: '0 -10px 40px rgba(0,0,0,.25)' });
  const cap = el('div', null, s, o.cap);
  box(cap, { position: 'absolute', left: '0', right: '0', bottom: '34px', textAlign: 'center', font: "500 20px/1 'IBM Plex Sans KR',sans-serif", color: 'rgba(255,255,255,.92)', textShadow: '0 2px 10px rgba(0,0,0,.45)' });
  const gr = el('div', null, s);
  box(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.07', mixBlendMode: 'overlay' });
  return { s, glowWide, glowTight, disk };
}
function place(sh, o, k, cx, cy, d) {
  const w = d * k;
  box(sh.disk, { position: 'absolute', left: (cx - w / 2) + 'px', top: (cy - w / 2) + 'px', width: w + 'px', height: w + 'px', borderRadius: '50%', background: o.disk, boxShadow: o.shadow });
  box(sh.glowWide, { position: 'absolute', left: (cx - w * 1.7) + 'px', top: (cy - w * 1.7) + 'px', width: (w * 3.4) + 'px', height: (w * 3.4) + 'px', borderRadius: '50%', background: `radial-gradient(circle, ${o.glow}, transparent 62%)` });
  box(sh.glowTight, { position: 'absolute', left: (cx - w * .85) + 'px', top: (cy - w * .85) + 'px', width: (w * 1.7) + 'px', height: (w * 1.7) + 'px', borderRadius: '50%', background: `radial-gradient(circle, ${o.glow2}, transparent 66%)` });
}
const NIGHT = { sky: 'linear-gradient(180deg,#050912 0%,#0f1c3a 55%,#27406e 100%)', ground: 'linear-gradient(180deg,#0b101c,#05070d)', cap: '밤 · 달',
  disk: 'radial-gradient(circle at 36% 32%, #fffaf0, #e9dfc6 52%, #b9aa88 100%)', shadow: 'inset -10px -12px 26px rgba(80,70,50,.35)', glow: 'rgba(210,225,255,.34)', glow2: 'rgba(255,248,225,.55)' };
const DAY = { sky: 'linear-gradient(180deg,#5aa6ec 0%,#9fd0f7 52%,#ffe6b4 100%)', ground: 'linear-gradient(180deg,#2e6a45,#18402a)', cap: '낮 · 해',
  disk: 'radial-gradient(circle at 50% 50%, #fffdf0, #ffe98a 55%, #ffb73f 100%)', shadow: '0 0 30px rgba(255,200,80,.8)', glow: 'rgba(255,214,120,.5)', glow2: 'rgba(255,244,200,.7)' };

const demo = {
  dur: 5.2, rest: 4.6, noCompare: false, levels: 3,
  mount(sp) {
    const a = shot(sp, NIGHT), b = shot(sp, DAY);
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', top: '18px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.66)', color: '#fff', font: "500 15px/1 'IBM Plex Sans KR',sans-serif", zIndex: 5 });
    const ring = el('div', null, sp);   // 두 장면의 중심·지름이 같다는 것을 보여 주는 점선 고리(컷 순간 근처에서만)
    box(ring, { position: 'absolute', left: (CX - D / 2 - 8) + 'px', top: (CY - D / 2 - 8) + 'px', width: (D + 16) + 'px', height: (D + 16) + 'px', borderRadius: '50%', border: '2px dashed rgba(255,255,255,.75)', opacity: '0', zIndex: 4 });
    return { a, b, pill, ring };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 위치·크기가 안 맞는 컷, 2 = 위치·크기를 맞춤, 3 = 움직임(크기 변화)까지 이어 붙임
    const matched = L >= 2, drift = L >= 3;
    const kA = drift ? 1 + DRIFT * E.inOutC(seg(t, CUT - 1, CUT)) : 1;
    const kB = drift ? 1 + DRIFT * (1 - E.inOutC(seg(t, CUT, CUT + 1))) : 1;
    place(s.a, NIGHT, kA, CX, CY, D);
    if (matched) place(s.b, DAY, kB, CX, CY, D); else place(s.b, DAY, .5, 470, 96, D);
    const half = CUT_BLEND / 2;
    const bo = CUT_BLEND > 0 ? seg(t, CUT - half, CUT + half) : (t >= CUT ? 1 : 0);
    s.b.s.style.opacity = bo;
    const near = Math.abs(t - CUT) < .6;
    s.ring.style.opacity = matched && near ? '1' : '0';
    s.pill.textContent = !matched ? (t >= CUT ? '컷 · 해가 다른 자리·크기라 이어지지 않음' : '밤 · 달') : (near ? '매치컷 · 같은 자리·같은 크기의 동그란 빛' : (t < CUT ? '밤 · 달' : '낮 · 해'));
  },
};
export default demo;
