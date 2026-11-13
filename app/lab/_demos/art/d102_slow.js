/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/easing-power-curves/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, E, el } from "./helpers.js";

const PAL = { bg0: '#f4efe4', bg1: '#e9e2d3', ink: '#1d1a16', muted: '#6b6458', accent: '#d4472b', accent2: '#2b5d8a', surface: '#fbf8f1', line: '#cfc6b3' };
const rgba = (h, a) => `rgba(${parseInt(h.slice(1, 3), 16)},${parseInt(h.slice(3, 5), 16)},${parseInt(h.slice(5, 7), 16)},${a})`;

// 같은 거리를 같은 시간에 가는 공 6개: outQuad · outCubic · outQuart · outQuint · outExpo · inOutExpo. 화면은 시간 t 의 함수다.
const DUR = 2.4;                  // 한 번 이동하는 시간(초)
const MAIN = 'outExpo';           // 맨 아래 큰 카드가 쓰는 이징(지시문에 적은 것)
const T0 = .5;
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);
const F = {
  linear: (x) => x,
  outQuad: (x) => 1 - Math.pow(1 - x, 2),
  outCubic: (x) => 1 - Math.pow(1 - x, 3),
  outQuart: (x) => 1 - Math.pow(1 - x, 4),
  outQuint: (x) => 1 - Math.pow(1 - x, 5),
  outExpo: (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)),
  inOutExpo: (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x < .5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2),
};
const ROWS = [
  { k: 'outQuad', c: '#2b5d8a' }, { k: 'outCubic', c: '#0b7a6a' }, { k: 'outQuart', c: '#8f6208' },
  { k: 'outQuint', c: '#c43d22' }, { k: 'outExpo', c: '#a8336e' }, { k: 'inOutExpo', c: '#5a45b0' },
];
const startSpeed = (f) => (f(.01) - f(0)) / .01;      // 맨 처음의 속도(평균 속도의 몇 배인가)
const svgNS = 'http://www.w3.org/2000/svg';

const demo = {
  dur: 3.2, rest: 2.4, noCompare: false, levels: 2,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: `linear-gradient(160deg,${PAL.bg0} 0%,${PAL.bg1} 100%)` });
    const gr = el('div', null, bg);
    box(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.09', mixBlendMode: 'multiply' });
    // 이름표(numeral): 큰 숫자(현재 단계 번호) + 옆에 한 줄 설명
    const lab = el('div', null, sp);
    box(lab, { position: 'absolute', left: '18px', top: '6px', display: 'flex', alignItems: 'center', gap: '10px' });
    const num = el('div', null, lab);
    box(num, { font: "400 40px/1.1 'Black Han Sans',sans-serif", color: PAL.accent });
    const ml = el('div', null, lab);
    box(ml, { font: "500 13px/1.2 'IBM Plex Sans KR',sans-serif", color: PAL.ink });
    // 왼쪽: 시간(가로) - 위치(세로) 그래프
    const gx = 18, gy = 56, gw = 252, gh = 194;
    const cap = el('div', null, sp, '위치 ↑   시간 →');
    box(cap, { position: 'absolute', left: gx + 'px', top: (gy + gh + 6) + 'px', font: "500 11px/1 'JetBrains Mono',monospace", color: PAL.muted });
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', gw + 20); svg.setAttribute('height', gh + 20);
    box(svg, { position: 'absolute', left: (gx - 6) + 'px', top: (gy - 6) + 'px', overflow: 'visible' });
    sp.appendChild(svg);
    const frame = document.createElementNS(svgNS, 'rect');
    frame.setAttribute('x', 6); frame.setAttribute('y', 6); frame.setAttribute('width', gw); frame.setAttribute('height', gh);
    frame.setAttribute('fill', PAL.surface); frame.setAttribute('stroke', PAL.line); frame.setAttribute('rx', 8);
    svg.appendChild(frame);
    const curves = [];
    const diag = document.createElementNS(svgNS, 'line');   // 연출 전: 등속은 대각선
    diag.setAttribute('x1', 6); diag.setAttribute('y1', 6 + gh); diag.setAttribute('x2', 6 + gw); diag.setAttribute('y2', 6);
    diag.setAttribute('stroke', PAL.ink); diag.setAttribute('stroke-width', 2.4); diag.setAttribute('stroke-dasharray', '6 5');
    svg.appendChild(diag);
    const dots = ROWS.map((r) => {
      const pl = document.createElementNS(svgNS, 'polyline');
      const pts = [];
      for (let i = 0; i <= 60; i++) { const x = i / 60; pts.push(`${(6 + x * gw).toFixed(1)},${(6 + gh - F[r.k](x) * gh).toFixed(1)}`); }
      pl.setAttribute('points', pts.join(' ')); pl.setAttribute('fill', 'none'); pl.setAttribute('stroke', r.c); pl.setAttribute('stroke-width', 2.2); pl.setAttribute('stroke-linecap', 'round'); pl.setAttribute('opacity', '.92');
      svg.appendChild(pl); curves.push(pl);
      const d = document.createElementNS(svgNS, 'circle'); d.setAttribute('r', 4.5); d.setAttribute('fill', r.c); d.setAttribute('stroke', PAL.surface); d.setAttribute('stroke-width', 1.5);
      svg.appendChild(d);
      return d;
    });
    // 오른쪽: 레인 6개
    const lanes = ROWS.map((r, i) => {
      const y = 56 + i * 32;
      const lb = el('div', null, sp, r.k);
      box(lb, { position: 'absolute', left: '292px', top: (y + 2) + 'px', font: "600 11px/1 'JetBrains Mono',monospace", color: r.c });
      const sv = el('div', null, sp, '');
      box(sv, { position: 'absolute', left: '292px', top: (y + 16) + 'px', font: "500 10px/1 'JetBrains Mono',monospace", color: PAL.muted });
      const tr = el('div', null, sp);
      box(tr, { position: 'absolute', left: '388px', top: (y + 15) + 'px', width: '236px', height: '2px', background: PAL.line });
      const b = el('div', null, sp);
      box(b, { position: 'absolute', top: (y + 4) + 'px', width: '22px', height: '22px', borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #fff, ${r.c} 62%)`, boxShadow: `0 4px 8px ${rgba(PAL.ink, .28)}` });
      return { b, sv };
    });
    // 맨 아래: 지시문에 적은 이징으로 움직이는 큰 카드
    const mt = el('div', null, sp);
    box(mt, { position: 'absolute', left: '18px', right: '16px', top: '278px', height: '62px', borderRadius: '10px', background: PAL.surface, border: `1px solid ${PAL.line}` });
    const card = el('div', null, mt);
    box(card, { position: 'absolute', top: '11px', width: '88px', height: '38px', borderRadius: '8px', background: `linear-gradient(150deg,#ee7a58,${PAL.accent})`, boxShadow: `inset 0 1px 0 rgba(255,255,255,.55), 0 6px 12px ${rgba(PAL.ink, .3)}` });
    return { dots, curves, diag, lanes, card, ml, num, gx, gy, gw, gh };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 2 : lv);   // 1 = 모두 등속(linear), 2 = 6가지 이징
    const x = seg(t, T0, T0 + DUR);
    s.curves.forEach((c) => { c.style.display = L >= 2 ? 'block' : 'none'; });
    s.diag.style.display = L >= 2 ? 'none' : 'block';
    ROWS.forEach((r, i) => {
      const f = L >= 2 ? F[r.k] : F.linear;
      const v = f(x);
      s.dots[i].setAttribute('cx', (6 + x * s.gw).toFixed(1));
      s.dots[i].setAttribute('cy', (6 + s.gh - v * s.gh).toFixed(1));
      s.lanes[i].b.style.left = (388 + v * (236 - 22)) + 'px';
      s.lanes[i].sv.textContent = L >= 2 ? `시작 속도 ×${startSpeed(F[r.k]).toFixed(1)}` : '시작 속도 ×1.0(등속)';
    });
    const main = (L >= 2 ? F[MAIN] : F.linear)(x);
    s.card.style.left = (10 + main * 498) + 'px';
    s.num.textContent = L >= 2 ? '2' : '1';
    s.ml.textContent = L >= 2 ? `아래 큰 카드는 ${MAIN} 을 쓴다` : '연출 전 · 전부 등속(linear)이라 기계처럼 일정하게 감';
  },
};
export default demo;
