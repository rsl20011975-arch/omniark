/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/flip-3d-transitions/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 장면 3개를 '컷 → 큐브 회전 → 페이지 넘김' 순서로 잇는다. 화면 안에 3D 공간(원근감)을 만들고 장면을 판처럼 돌린다. 화면은 시간 t 의 함수다.
const PERSP = 900;            // 원근감: 보는 사람과 화면 사이 거리(px). 작을수록 가까워서 기울기가 과장된다
const T1 = 1.2, D1 = 1.0;     // 큐브 회전이 시작하는 시각 · 길이(초)
const T2 = 3.8, D2 = 1.2;     // 페이지 넘김이 시작하는 시각 · 길이(초)
const HINGE = 'right';         // 페이지를 넘길 때 축이 되는 모서리: 'left' 또는 'right'
const PAGE_END = 100;         // 페이지가 최종적으로 넘어가는 각도(도)
const DUR = 6.4;
const SC = [
  { n: 'DAY 1', c: '서울 · 아침 8:00', bg: 'linear-gradient(160deg,#16233a 0%,#2c4568 55%,#8fa6c6 100%)', glow: 'rgba(190,215,255,.55)', gx: '78%', gy: '16%', side: 'left' },
  { n: 'DAY 2', c: '부산 · 낮 1:00', bg: 'linear-gradient(160deg,#10343a 0%,#2a8f8a 56%,#f2e3a6 100%)', glow: 'rgba(255,240,190,.6)', gx: '24%', gy: '20%', side: 'right' },
  { n: 'DAY 3', c: '제주 · 저녁 6:00', bg: 'linear-gradient(160deg,#2a1b3d 0%,#b4525c 56%,#f6b873 100%)', glow: 'rgba(255,205,140,.6)', gx: '70%', gy: '22%', side: 'left' },
];
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const css = (e, o) => Object.assign(e.style, o);

function scene(parent, d) {
  const s = el('div', null, parent);
  css(s, { position: 'absolute', inset: '0', background: d.bg, overflow: 'hidden', backfaceVisibility: 'hidden' });
  const g1 = el('div', null, s), g2 = el('div', null, s);
  css(g1, { position: 'absolute', inset: '0', background: `radial-gradient(circle at ${d.gx} ${d.gy}, ${d.glow}, transparent 52%)` });
  css(g2, { position: 'absolute', inset: '0', background: `radial-gradient(circle at ${d.gx} ${d.gy}, rgba(255,255,255,.35), transparent 16%)` });
  const n = el('div', null, s, d.n);
  css(n, { position: 'absolute', [d.side]: '44px', top: '96px', textAlign: d.side, font: "400 128px/1 'Black Han Sans',sans-serif", color: '#fff', textShadow: '0 6px 28px rgba(0,0,0,.35)' });
  const c = el('div', null, s, d.c);
  css(c, { position: 'absolute', [d.side]: '48px', top: '236px', textAlign: d.side, font: "500 24px/1.2 'IBM Plex Sans KR',sans-serif", color: 'rgba(255,255,255,.92)', textShadow: '0 2px 12px rgba(0,0,0,.4)' });
  const gr = el('div', null, s);
  css(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.07', mixBlendMode: 'overlay' });
  const shade = el('div', null, s);                      // 기울어질수록 어두워지는 막(광원 흉내)
  css(shade, { position: 'absolute', inset: '0', background: '#04060d', opacity: '0' });
  s.shade = shade;
  return s;
}

const demo = {
  dur: DUR, rest: 5.8, noCompare: false, levels: 3,
  mount(sp) {
    const world = el('div', null, sp);
    css(world, { position: 'absolute', inset: '0', overflow: 'hidden', background: '#0b0f1a', perspective: PERSP + 'px', perspectiveOrigin: '50% 50%' });
    const C = scene(world, SC[2]);
    const cShade = el('div', null, world);
    css(cShade, { position: 'absolute', inset: '0', background: 'rgba(0,0,0,.6)', opacity: '0' });
    const cube = el('div', null, world);
    css(cube, { position: 'absolute', inset: '0', transformStyle: 'preserve-3d' });
    const A = scene(cube, SC[0]), B = scene(cube, SC[1]);
    const page = scene(world, SC[1]);
    const pill = el('div', null, sp);
    css(pill, { position: 'absolute', left: '20px', top: '18px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.7)', color: '#fff', font: "500 15px/1 'IBM Plex Sans KR',sans-serif", zIndex: 5 });
    const track = el('div', null, sp);
    css(track, { position: 'absolute', left: '20px', right: '100px', bottom: '22px', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,.25)', zIndex: 5 });
    const z = [[T1, D1], [T2, D2]].map(([t0, d]) => {
      const e = el('div', null, track);
      css(e, { position: 'absolute', top: '0', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,.9)', left: (t0 / DUR * 100) + '%', width: (d / DUR * 100) + '%' });
      return e;
    });
    const head = el('div', null, track);
    css(head, { position: 'absolute', top: '-4px', width: '3px', height: '16px', borderRadius: '2px', background: '#fff', boxShadow: '0 0 8px rgba(255,255,255,.7)' });
    return { world, C, cShade, cube, A, B, page, pill, z, head };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 컷, 2 = 큐브 회전, 3 = + 페이지 넘김
    const cut1 = T1 + D1 / 2, cut2 = T2 + D2 / 2;
    const p1 = E.inOutC(seg(t, T1, T1 + D1)), p2 = E.inOutC(seg(t, T2, T2 + D2));
    const half = 320, th = L >= 2 ? -90 * p1 : (t >= cut1 ? -90 : 0);   // 큐브가 도는 각도(도)
    css(s.cube, { transform: `translateZ(${-half}px) rotateY(${th}deg)` });
    css(s.A, { transform: `rotateY(0deg) translateZ(${half}px)` });
    css(s.B, { transform: `rotateY(90deg) translateZ(${half}px)` });
    s.A.shade.style.opacity = (.62 * Math.abs(Math.sin(th * Math.PI / 180))).toFixed(3);
    s.B.shade.style.opacity = (.62 * Math.abs(Math.sin((th + 90) * Math.PI / 180))).toFixed(3);
    const pageOn = L >= 3 && t >= T2 && t < T2 + D2;
    const cubeOn = L >= 3 ? t < T2 : t < cut2;
    s.cube.style.display = cubeOn ? 'block' : 'none';
    s.page.style.display = pageOn ? 'block' : 'none';
    s.C.style.display = (L >= 3 ? t >= T2 : t >= cut2) ? 'block' : 'none';
    const sign = HINGE === 'left' ? -1 : 1, ang = sign * PAGE_END * p2;
    css(s.page, { transformOrigin: `${HINGE} center`, transform: `rotateY(${ang}deg)` });
    s.page.shade.style.opacity = (.55 * Math.min(1, Math.abs(ang) / 90)).toFixed(3);
    s.cShade.style.display = pageOn ? 'block' : 'none';
    s.cShade.style.opacity = (.65 * (1 - p2)).toFixed(3);
    const inCube = L >= 2 && t > T1 && t < T1 + D1;
    s.pill.textContent = L <= 1 ? '컷 · 효과 없음' : inCube ? '큐브 회전 · 두 장면이 한 상자의 옆면' : pageOn ? `페이지 넘김 · ${HINGE === 'left' ? '왼쪽' : '오른쪽'} 모서리가 축` : t < T1 ? '장면 1' : t < T2 ? '장면 2' : '장면 3';
    s.z[0].style.display = L >= 2 ? 'block' : 'none'; s.z[1].style.display = L >= 3 ? 'block' : 'none';
    s.head.style.left = `calc(${(t / DUR * 100).toFixed(2)}% - 1px)`;
  },
};
export default demo;
