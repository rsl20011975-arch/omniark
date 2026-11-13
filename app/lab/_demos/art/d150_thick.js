/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/shape-primitives/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

const PAL = { bg0: '#1b0e17', bg1: '#2b1424', ink: '#f6e9ee', muted: '#b095a3', accent: '#ff7aa8', accent2: '#ffd0a0', surface: '#26121f', line: 'rgba(246,233,238,.16)' };
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

// 도형 프리미티브: 사각형·둥근 사각형·원·타원·선·꺾은선·다각형은 숫자 몇 개로 정해진다. 선은 두께와 끝 모양까지 정한다. 화면은 시간 t 의 함수다.
const STEP = .25;                 // 도형이 하나씩 나타나는 간격(초)
const SW = 14;                     // 선 두께(px)
const T0 = .3;
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);
const NS = 'http://www.w3.org/2000/svg';
const sv = (tag, at, par) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (par) par.appendChild(e); return e; };
const MONO = "'JetBrains Mono',monospace";
const COL = [PAL.accent, PAL.accent2, '#d79bff', '#ff9d7a', '#ffe3b8', '#ff5f8f', '#c8b0ff', '#ffb86b'];   // 칸마다 다른 색 8가지(와인 톤)
// 칸마다: 이름 · 태그 · 값 · 도형 · 손잡이(점 d, 치수선 m: [x1,y1,x2,y2,글자,글자x,글자y])
const HEX = [0, 1, 2, 3, 4, 5].map((i) => [72 + 34 * Math.cos(Math.PI / 3 * i - Math.PI / 2), 50 + 34 * Math.sin(Math.PI / 3 * i - Math.PI / 2)]);
const CELLS = [
  { nm: '사각형', tag: '<rect>', val: 'x y width height', sh: ['rect', { x: 24, y: 22, width: 70, height: 56 }], d: [[24, 22]], m: [[24, 88, 94, 88, 'width', 59, 98], [104, 22, 104, 78, 'height', 122, 54]] },
  { nm: '둥근 사각형', tag: '<rect>', val: 'rx=18 (모서리)', sh: ['rect', { x: 24, y: 22, width: 70, height: 56, rx: 18 }], d: [[94, 22]], m: [[76, 22, 94, 22, 'rx', 85, 15]] },
  { nm: '원', tag: '<circle>', val: 'cx cy r', sh: ['circle', { cx: 72, cy: 50, r: 32 }], d: [[72, 50]], m: [[72, 50, 104, 50, 'r', 90, 44]] },
  { nm: '타원', tag: '<ellipse>', val: 'cx cy rx ry', sh: ['ellipse', { cx: 72, cy: 50, rx: 42, ry: 24 }], d: [[72, 50]], m: [[72, 50, 114, 50, 'rx', 94, 63], [72, 50, 72, 26, 'ry', 61, 33]] },
  { nm: '선', tag: '<line>', val: 'x1 y1 x2 y2', line: ['line', { x1: 28, y1: 74, x2: 116, y2: 26 }], d: [[28, 74], [116, 26]], m: [] },
  { nm: '꺾은선', tag: '<polyline>', val: 'points', line: ['polyline', { points: '24,72 50,28 76,64 102,24 120,52', fill: 'none' }], d: [[24, 72], [50, 28], [76, 64], [102, 24], [120, 52]], m: [] },
  { nm: '다각형', tag: '<polygon>', val: 'points(닫힘)', sh: ['polygon', { points: HEX.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ') }], d: HEX, m: [[HEX[5][0], HEX[5][1], HEX[0][0], HEX[0][1], '', 0, 0]] },
  { nm: '선 끝 모양', tag: 'stroke-linecap', val: '', caps: true, d: [], m: [] },
];

const demo = {
  dur: 4, rest: 3.4, noCompare: false, levels: 3,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: `linear-gradient(160deg,${PAL.bg0} 0%,${PAL.bg1} 100%)` });
    box(el('div', null, bg), { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.06', mixBlendMode: 'overlay' });
    const svg = sv('svg', { width: 640, height: 360, viewBox: '0 0 640 360' }, sp);
    box(svg, { position: 'absolute', left: '0', top: '0' });
    const defs = sv('defs', {}, svg);
    COL.forEach((c, i) => { const g = sv('linearGradient', { id: 'spg' + i, x1: 0, y1: 0, x2: 1, y2: 1 }, defs); sv('stop', { offset: 0, 'stop-color': c }, g); sv('stop', { offset: 1, 'stop-color': c, 'stop-opacity': .55 }, g); });
    const cells = CELLS.map((c, i) => {
      const gx = 20 + (i % 4) * 152, gy = 50 + Math.floor(i / 4) * 146;
      const g = sv('g', { transform: `translate(${gx},${gy})` }, svg);
      sv('rect', { x: 0, y: 0, width: 144, height: 138, rx: 12, fill: rgba(PAL.surface, .88), stroke: PAL.line }, g);
      const art = sv('g', {}, g), body = sv('g', {}, art), hd = sv('g', {}, art);
      const col = COL[i];
      if (c.sh) sv(c.sh[0], { ...c.sh[1], fill: `url(#spg${i})`, stroke: rgba(PAL.ink, .7), 'stroke-width': 1.4, 'stroke-linejoin': 'round' }, body);
      const lines = [];
      if (c.line) lines.push(sv(c.line[0], { fill: 'none', ...c.line[1], stroke: col, 'stroke-width': SW, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, body));
      if (c.caps) ['butt', 'round', 'square'].forEach((cap, k) => {
        sv('line', { x1: 36, y1: 26 + k * 24, x2: 84, y2: 26 + k * 24, stroke: col, 'stroke-width': Math.max(SW, 8), 'stroke-linecap': cap, opacity: .95 }, body);
        sv('line', { x1: 36, y1: 14 + k * 24, x2: 36, y2: 38 + k * 24, stroke: rgba(PAL.ink, .75), 'stroke-width': 1, 'stroke-dasharray': '2 2' }, hd);
        sv('line', { x1: 84, y1: 14 + k * 24, x2: 84, y2: 38 + k * 24, stroke: rgba(PAL.ink, .75), 'stroke-width': 1, 'stroke-dasharray': '2 2' }, hd);
        const tx = sv('text', { x: 100, y: 29 + k * 24, fill: rgba(PAL.ink, .85), 'font-size': 9.5, 'font-family': MONO }, hd); tx.textContent = cap;
      });
      c.m.forEach(([x1, y1, x2, y2, lab, lx, ly]) => {
        sv('line', { x1, y1, x2, y2, stroke: rgba(PAL.ink, .85), 'stroke-width': 1.2, 'stroke-dasharray': lab ? '3 2' : '4 3' }, hd);
        if (lab) { const tx = sv('text', { x: lx, y: ly, fill: PAL.accent2, 'font-size': 10, 'font-family': MONO, 'text-anchor': 'middle' }, hd); tx.textContent = lab; }
      });
      c.d.forEach(([x, y]) => sv('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: 3.4, fill: PAL.ink, stroke: PAL.bg0, 'stroke-width': 1.5 }, hd));
      const nm = sv('text', { x: 10, y: 112, fill: PAL.ink, 'font-size': 12.5, 'font-weight': 700, 'font-family': "'IBM Plex Sans KR',sans-serif" }, g); nm.textContent = c.nm;
      const code = sv('g', {}, g);
      const t1 = sv('text', { x: 10, y: 127, 'font-size': 9, 'font-family': MONO, fill: PAL.muted }, code);
      const ts = sv('tspan', { fill: col }, t1); ts.textContent = c.tag + ' ';
      const tv = sv('tspan', {}, t1); tv.textContent = c.val;
      return { art, hd, code, lines };
    });
    // 이름표(vertical): 왼쪽 가장자리 세로쓰기. 단계는 muted, 지금 보여 주는 내용은 ink
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '4px', top: '50px', writingMode: 'vertical-rl', font: "500 12px/1 'IBM Plex Sans KR',sans-serif", letterSpacing: '.06em', whiteSpace: 'nowrap', color: PAL.ink, zIndex: 5 });
    const pk = el('span', null, pill); box(pk, { color: PAL.muted, marginInlineEnd: '10px' });
    const pv = el('span', null, pill);
    return { cells, pill, pk, pv };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 모양만, 2 = + 모양을 정하는 숫자(손잡이·태그), 3 = + 하나씩 차례로 나타남
    s.cells.forEach((c, i) => {
      let k = 1, op = 1;
      if (L >= 3) { const u = seg(t, T0 + i * STEP, T0 + i * STEP + .45); k = .55 + .45 * E.outBack(u); op = Math.min(1, u * 4); }
      c.art.setAttribute('transform', `translate(${(72 * (1 - k)).toFixed(2)},${(50 * (1 - k)).toFixed(2)}) scale(${k.toFixed(3)})`);
      c.art.style.opacity = op;
      c.hd.style.display = L >= 2 ? 'block' : 'none';
      c.code.style.display = L >= 2 ? 'block' : 'none';
      c.code.style.opacity = L >= 3 ? seg(t, T0 + i * STEP + .2, T0 + i * STEP + .5) : 1;
    });
    s.pk.textContent = L <= 1 ? '연출 전' : `단계 ${L}/3`;
    s.pv.textContent = L <= 1 ? '모양만, 숫자는 안 보임' : L === 2 ? '점, 반지름, 치수선 표시' : `하나씩 등장, 선 ${SW}px`;
  },
};
export default demo;
