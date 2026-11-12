/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/whip-pan/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, E, el } from "./helpers.js";

// 카메라가 옆으로 아주 빠르게 돌아가며 장면이 가로로 번지고, 가장 빠른 순간에 장면이 바뀐다. 화면은 시간 t 의 함수다.
const T0 = 1.4, WHIP = .35;      // 휩팬이 시작하는 시각 · 길이(초)
const BLUR = 30;                  // 가로 방향 흐림(px). 세로로는 흐리지 않는다
const SCENES = [
  { n: '출근길', c: '08:10 · 지하철 2호선', bg: 'linear-gradient(160deg,#0c1626 0%,#1f4a73 58%,#9cc3e0 100%)', glow: 'rgba(190,225,255,.5)', gx: '78%', gy: '18%', side: 'left' },
  { n: '퇴근길', c: '19:40 · 한강 다리', bg: 'linear-gradient(160deg,#2a1226 0%,#b04a52 56%,#ffb978 100%)', glow: 'rgba(255,190,130,.62)', gx: '26%', gy: '24%', side: 'right' },
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
  box(c, { position: 'absolute', [d.side]: '48px', top: '236px', textAlign: d.side, font: "500 18px/1.2 'JetBrains Mono',monospace", color: 'rgba(255,255,255,.92)' });
  const gr = el('div', null, s);
  box(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.07', mixBlendMode: 'overlay' });
  return s;
}

const demo = {
  dur: 4.2, rest: 3.6, noCompare: false, levels: 3,
  mount(sp) {
    const svg = el('div', null, sp, `<svg width="0" height="0" style="position:absolute"><filter id="whipb" x="-20%" y="0" width="140%" height="100%"><feGaussianBlur stdDeviation="0 0"/></filter></svg>`);
    const sc = SCENES.map((d) => scene(sp, d));
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', top: '18px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.66)', color: '#fff', font: "500 15px/1 'IBM Plex Sans KR',sans-serif", zIndex: 5 });
    return { sc, pill, blur: svg.querySelector('feGaussianBlur') };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);        // 1 = 컷, 2 = 옆으로 쓸어 이동(등속), 3 = 급가속 + 가로 흐림
    const raw = seg(t, T0, T0 + WHIP);
    const p = L >= 3 ? E.inOutExpo(raw) : raw;
    const bell = Math.sin(Math.PI * raw);             // 0 → 1 → 0
    const move = L >= 2, blur = L >= 3;
    const swapped = move ? p >= .5 : t >= T0 + WHIP / 2;
    s.blur.setAttribute('stdDeviation', `${blur ? (BLUR * bell).toFixed(1) : 0} 0`);
    const f = blur ? 'url(#whipb)' : 'none';
    s.sc[0].style.transform = move ? `translateX(${(-p * 640).toFixed(1)}px)` : 'none';
    s.sc[1].style.transform = move ? `translateX(${((1 - p) * 640).toFixed(1)}px)` : 'none';
    s.sc[0].style.filter = f; s.sc[1].style.filter = f;
    s.sc[0].style.zIndex = swapped ? 0 : 2; s.sc[1].style.zIndex = swapped ? 2 : 1;
    const running = t > T0 && t < T0 + WHIP;
    s.pill.textContent = !move ? (running || swapped ? (swapped ? '퇴근길' : '컷 · 전환 효과 없음') : '출근길') : (running ? (blur ? '휩팬 · 카메라가 빠르게 돌아감' : '옆으로 쓸기(등속)') : (t < T0 ? '출근길' : '퇴근길'));
  },
};
export default demo;
