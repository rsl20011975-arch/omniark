/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/offset-path/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 경로 따라 이동: offset-path 에 곡선을 주고 offset-distance 를 0% → 100% 로 바꾸면 요소가 곡선 위를 지나간다. 화면은 시간 t 의 함수다.
const DUR = 2.4;                  // 곡선을 한 번 지나가는 시간(초)
const ROT = 'auto';               // offset-rotate 값('auto' = 진행 방향으로 돎, 'auto 90deg' = 진행 방향에서 90° 더 돎)
const T0 = .5;
const PATH = 'M 60 270 C 160 60, 260 60, 320 190 S 500 330, 580 110';
const A = [60, 270], B = [580, 110];
const CW = 96, CH = 54;
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);
const NS = 'http://www.w3.org/2000/svg';
const sv = (tag, at, par) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (par) par.appendChild(e); return e; };
const MONO = "'JetBrains Mono',monospace";

const demo = {
  dur: 4, rest: 3.4, noCompare: false, levels: 3,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: 'linear-gradient(160deg,#0b0f1a 0%,#161d30 100%)' });
    box(el('div', null, bg), { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.06', mixBlendMode: 'overlay' });
    const svg = sv('svg', { width: 640, height: 360, viewBox: '0 0 640 360' }, sp);
    box(svg, { position: 'absolute', left: '0', top: '0' });
    const defs = sv('defs', {}, svg);
    const lg = sv('linearGradient', { id: 'opg', x1: 0, y1: 0, x2: 1, y2: 0 }, defs);
    sv('stop', { offset: 0, 'stop-color': '#7fd6ff' }, lg); sv('stop', { offset: 1, 'stop-color': '#c79bff' }, lg);
    const gb = sv('filter', { id: 'opb', x: '-30%', y: '-30%', width: '160%', height: '160%' }, defs);
    sv('feGaussianBlur', { stdDeviation: 4 }, gb);
    sv('path', { d: PATH, fill: 'none', stroke: 'rgba(255,255,255,.16)', 'stroke-width': 2, 'stroke-dasharray': '2 7', 'stroke-linecap': 'round' }, svg);
    const line = sv('line', { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: 'rgba(255,255,255,.28)', 'stroke-width': 2, 'stroke-dasharray': '6 6' }, svg);
    const glow = sv('path', { d: PATH, fill: 'none', stroke: '#9fb4ff', 'stroke-width': 9, pathLength: 100, 'stroke-linecap': 'round', filter: 'url(#opb)', opacity: .45 }, svg);
    const trail = sv('path', { d: PATH, fill: 'none', stroke: 'url(#opg)', 'stroke-width': 3.4, pathLength: 100, 'stroke-linecap': 'round' }, svg);
    const ref = sv('path', { d: PATH, fill: 'none', stroke: 'none' }, svg), len = ref.getTotalLength();
    [0, 25, 50, 75, 100].forEach((q) => {
      const pt = ref.getPointAtLength(len * q / 100);
      sv('circle', { cx: pt.x, cy: pt.y, r: 3.2, fill: '#0b0f1a', stroke: 'rgba(255,255,255,.6)', 'stroke-width': 1.4 }, svg);
      const tx = sv('text', { x: pt.x + (q === 50 ? -24 : 0), y: pt.y + (q === 0 || q === 100 ? 20 : q === 50 ? 14 : -12), fill: 'rgba(255,255,255,.62)', 'font-size': 10, 'font-family': MONO, 'text-anchor': 'middle' }, svg); tx.textContent = q + '%';
    });
    // 움직이는 카드(앞쪽을 가리키는 꺾쇠가 있어 어느 쪽이 앞인지 보인다)
    const card = el('div', null, sp);
    box(card, { position: 'absolute', left: '0', top: '0', width: CW + 'px', height: CH + 'px', borderRadius: '12px', background: 'linear-gradient(150deg,#8ab4ff 0%,#5b6bff 55%,#7a45e6 100%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.55), inset 0 -8px 14px rgba(40,20,120,.35), 0 10px 22px rgba(0,0,0,.5)' });
    card.innerHTML = "<svg width='96' height='54' viewBox='0 0 96 54' style='position:absolute;left:0;top:0'><path d='M64 15 L82 27 L64 39' fill='none' stroke='#fff' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/><rect x='14' y='17' width='34' height='6' rx='3' fill='rgba(255,255,255,.75)'/><rect x='14' y='31' width='22' height='6' rx='3' fill='rgba(255,255,255,.4)'/></svg>";
    const rd = el('div', null, sp);
    box(rd, { position: 'absolute', left: '20px', bottom: '14px', font: "500 12px/1.5 'JetBrains Mono',monospace", color: 'rgba(255,255,255,.75)' });
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', top: '14px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.66)', color: '#fff', font: "500 14px/1 'IBM Plex Sans KR',sans-serif", zIndex: 5 });
    return { card, rd, pill, line, trail, glow };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = translate 직선 이동, 2 = + offset-path(곡선 따라 이동, 방향은 그대로), 3 = + offset-rotate(진행 방향으로 돎)
    const p = E.inOutC(seg(t, T0, T0 + DUR));
    const c = s.card.style;
    if (L <= 1) {
      c.offsetPath = 'none'; c.offsetDistance = '0%'; c.offsetRotate = 'auto';
      c.transform = `translate(${(lerp(A[0], B[0], p) - CW / 2).toFixed(1)}px,${(lerp(A[1], B[1], p) - CH / 2).toFixed(1)}px)`;
    } else {
      c.transform = 'none';
      c.offsetPath = `path("${PATH}")`; c.offsetDistance = (p * 100).toFixed(2) + '%'; c.offsetRotate = L >= 3 ? ROT : '0deg';
    }
    s.line.style.opacity = L <= 1 ? 1 : 0;
    const tl = L <= 1 ? 0 : p * 100;
    [s.trail, s.glow].forEach((e) => { e.setAttribute('stroke-dasharray', `${tl.toFixed(2)} 200`); e.style.opacity = tl <= 0 ? 0 : (e === s.glow ? .45 : 1); });
    s.rd.innerHTML = L <= 1 ? 'transform: translate(x, y)<br>곡선과 상관없이 직선으로 이동' : `offset-path: path(…)<br>offset-distance: ${(p * 100).toFixed(0)}%  ·  offset-rotate: ${L >= 3 ? ROT : '0deg'}`;
    s.pill.textContent = L <= 1 ? '연출 전 · translate 로 직선 이동(곡선을 벗어남)' : L === 2 ? 'offset-path · 곡선 위로 이동, 카드 방향은 그대로' : 'offset-rotate · 곡선의 방향에 맞춰 카드가 돎';
  },
};
export default demo;
