/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/light-leak/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, E, el, lerp } from "./helpers.js";

// 필름 틈으로 새어 든 빛처럼 따뜻한 빛이 화면을 쓸고 가며 가운데에서 가장 밝아지고, 그 밝은 순간에 장면이 바뀐다. 화면은 시간 t 의 함수다.
const T0 = 1.5, DUR = 1.2;        // 빛 번짐이 시작하는 시각 · 길이(초)
const LEAK = '255,140,60';        // 빛의 색(R,G,B)
const PEAK = 1;                   // 가장 밝은 순간의 세기(0~1)
const SCENES = [
  { n: '출발', c: '새벽 5:40 · 공항', bg: 'linear-gradient(160deg,#0a1424 0%,#1d3f66 58%,#8fb4d8 100%)', glow: 'rgba(190,220,255,.5)', gx: '76%', gy: '20%', side: 'left' },
  { n: '도착', c: '오후 3:10 · 해변', bg: 'linear-gradient(160deg,#16363a 0%,#2a8f8a 56%,#f6e3a8 100%)', glow: 'rgba(255,240,190,.6)', gx: '24%', gy: '22%', side: 'right' },
];
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);

function scene(sp, d) {
  const s = el('div', null, sp);
  box(s, { position: 'absolute', inset: '0', background: d.bg, overflow: 'hidden' });
  const g1 = el('div', null, s), g2 = el('div', null, s);
  box(g1, { position: 'absolute', inset: '0', background: `radial-gradient(circle at ${d.gx} ${d.gy}, ${d.glow}, transparent 52%)` });
  box(g2, { position: 'absolute', inset: '0', background: `radial-gradient(circle at ${d.gx} ${d.gy}, rgba(255,255,255,.35), transparent 16%)` });
  const n = el('div', null, s, d.n);
  box(n, { position: 'absolute', [d.side]: '44px', top: '96px', textAlign: d.side, font: "400 128px/1 'Black Han Sans',sans-serif", color: '#fff', textShadow: '0 6px 28px rgba(0,0,0,.35)' });
  const c = el('div', null, s, d.c);
  box(c, { position: 'absolute', [d.side]: '48px', top: '236px', textAlign: d.side, font: "500 22px/1.2 'IBM Plex Sans KR',sans-serif", color: 'rgba(255,255,255,.92)' });
  const gr = el('div', null, s);
  box(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.07', mixBlendMode: 'overlay' });
  return s;
}

const demo = {
  dur: 4.6, rest: 4.0, noCompare: false, levels: 3,
  mount(sp) {
    const sc = SCENES.map((d) => scene(sp, d));
    const blobs = [60, 170, 280].map((y) => {
      const b = el('div', null, sp);
      box(b, { position: 'absolute', top: (y - 190) + 'px', width: '380px', height: '380px', borderRadius: '50%', mixBlendMode: 'screen', zIndex: 3, opacity: '0', background: `radial-gradient(circle, rgba(${LEAK},.95), rgba(${LEAK},.35) 45%, transparent 70%)` });
      return b;
    });
    const wash = el('div', null, sp);
    box(wash, { position: 'absolute', inset: '0', mixBlendMode: 'screen', zIndex: 4, opacity: '0' });
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', top: '18px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.66)', color: '#fff', font: "500 15px/1 'IBM Plex Sans KR',sans-serif", zIndex: 6 });
    const track = el('div', null, sp);
    box(track, { position: 'absolute', left: '20px', right: '100px', bottom: '22px', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,.25)', zIndex: 6 });
    const zone = el('div', null, track);
    box(zone, { position: 'absolute', top: '0', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,.9)', left: (T0 / 4.6 * 100) + '%', width: (DUR / 4.6 * 100) + '%' });
    const head = el('div', null, track);
    box(head, { position: 'absolute', top: '-4px', width: '3px', height: '16px', borderRadius: '2px', background: '#fff', boxShadow: '0 0 8px rgba(255,255,255,.7)' });
    return { sc, blobs, wash, pill, zone, head };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 컷, 2 = 빛이 쓸고 감(약하게), 3 = 가운데에서 거의 하얗게 되며 장면이 바뀜
    const q = seg(t, T0, T0 + DUR);
    const bell = Math.sin(Math.PI * q);
    const leak = L >= 2;
    const xc = lerp(-160, 800, E.inOutC(q));
    const swapped = q >= .5;
    s.sc[0].style.zIndex = swapped ? 0 : 2; s.sc[1].style.zIndex = swapped ? 2 : 1;
    s.blobs.forEach((b, i) => {
      b.style.left = (xc - 190 + (i - 1) * 70) + 'px';
      b.style.opacity = leak ? (PEAK * bell * .9).toFixed(3) : '0';
    });
    const strength = (L >= 3 ? .95 : .3) * PEAK * Math.pow(bell, 2.2);
    s.wash.style.background = `radial-gradient(circle at ${xc}px 50%, rgba(255,250,240,.98), rgba(${LEAK},.85) 50%, rgba(${LEAK},.5))`;
    s.wash.style.opacity = leak ? strength.toFixed(3) : '0';
    s.pill.textContent = !leak ? (swapped ? '컷 · 도착' : '출발') : (q > 0 && q < 1 ? '빛 번짐 전환 · 새어 든 빛이 장면을 가림' : (swapped ? '도착' : '출발'));
    s.zone.style.display = leak ? 'block' : 'none';
    s.head.style.left = `calc(${(t / 4.6 * 100).toFixed(2)}% - 1px)`;
  },
};
export default demo;
