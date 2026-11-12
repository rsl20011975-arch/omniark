/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/easing-power-curves/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, E, el } from "./helpers.js";

// 같은 거리를 같은 시간에 가는 공 6개: outQuad · outCubic · outQuart · outQuint · outExpo · inOutExpo. 화면은 시간 t 의 함수다.
const DUR = 1.4;                  // 한 번 이동하는 시간(초)
const MAIN = 'inOutExpo';           // 맨 아래 큰 카드가 쓰는 이징(지시문에 적은 것)
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
  { k: 'outQuad', c: '#7fd6ff' }, { k: 'outCubic', c: '#7fffd0' }, { k: 'outQuart', c: '#ffe27a' },
  { k: 'outQuint', c: '#ffa95e' }, { k: 'outExpo', c: '#ff7a8a' }, { k: 'inOutExpo', c: '#c79bff' },
];
const startSpeed = (f) => (f(.01) - f(0)) / .01;      // 맨 처음의 속도(평균 속도의 몇 배인가)
const svgNS = 'http://www.w3.org/2000/svg';

const demo = {
  dur: 3.2, rest: 2.4, noCompare: false, levels: 2,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: 'linear-gradient(160deg,#0b0f1a 0%,#161d30 100%)' });
    const gr = el('div', null, bg);
    box(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.06', mixBlendMode: 'overlay' });
    // 왼쪽: 시간(가로) - 위치(세로) 그래프
    const gx = 18, gy = 34, gw = 252, gh = 214;
    const cap = el('div', null, sp, '위치 ↑   시간 →');
    box(cap, { position: 'absolute', left: gx + 'px', top: '12px', font: "500 11px/1 'JetBrains Mono',monospace", color: 'rgba(255,255,255,.55)' });
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', gw + 20); svg.setAttribute('height', gh + 20);
    box(svg, { position: 'absolute', left: (gx - 6) + 'px', top: (gy - 6) + 'px', overflow: 'visible' });
    sp.appendChild(svg);
    const frame = document.createElementNS(svgNS, 'rect');
    frame.setAttribute('x', 6); frame.setAttribute('y', 6); frame.setAttribute('width', gw); frame.setAttribute('height', gh);
    frame.setAttribute('fill', 'rgba(255,255,255,.04)'); frame.setAttribute('stroke', 'rgba(255,255,255,.12)'); frame.setAttribute('rx', 8);
    svg.appendChild(frame);
    const curves = [];
    const diag = document.createElementNS(svgNS, 'line');   // 연출 전: 등속은 대각선
    diag.setAttribute('x1', 6); diag.setAttribute('y1', 6 + gh); diag.setAttribute('x2', 6 + gw); diag.setAttribute('y2', 6);
    diag.setAttribute('stroke', 'rgba(255,255,255,.7)'); diag.setAttribute('stroke-width', 2.4); diag.setAttribute('stroke-dasharray', '6 5');
    svg.appendChild(diag);
    const dots = ROWS.map((r) => {
      const pl = document.createElementNS(svgNS, 'polyline');
      const pts = [];
      for (let i = 0; i <= 60; i++) { const x = i / 60; pts.push(`${(6 + x * gw).toFixed(1)},${(6 + gh - F[r.k](x) * gh).toFixed(1)}`); }
      pl.setAttribute('points', pts.join(' ')); pl.setAttribute('fill', 'none'); pl.setAttribute('stroke', r.c); pl.setAttribute('stroke-width', 2.2); pl.setAttribute('stroke-linecap', 'round'); pl.setAttribute('opacity', '.9');
      svg.appendChild(pl); curves.push(pl);
      const d = document.createElementNS(svgNS, 'circle'); d.setAttribute('r', 4.5); d.setAttribute('fill', r.c); d.setAttribute('stroke', '#0b0f1a'); d.setAttribute('stroke-width', 1.5);
      svg.appendChild(d);
      return d;
    });
    // 오른쪽: 레인 6개
    const lanes = ROWS.map((r, i) => {
      const y = 34 + i * 36;
      const lab = el('div', null, sp, r.k);
      box(lab, { position: 'absolute', left: '292px', top: (y + 4) + 'px', font: "500 11px/1 'JetBrains Mono',monospace", color: r.c });
      const sv = el('div', null, sp, '');
      box(sv, { position: 'absolute', left: '292px', top: (y + 18) + 'px', font: "500 10px/1 'JetBrains Mono',monospace", color: 'rgba(255,255,255,.5)' });
      const tr = el('div', null, sp);
      box(tr, { position: 'absolute', left: '388px', top: (y + 16) + 'px', width: '236px', height: '2px', background: 'rgba(255,255,255,.14)' });
      const b = el('div', null, sp);
      box(b, { position: 'absolute', top: (y + 6) + 'px', width: '22px', height: '22px', borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #fff, ${r.c} 62%)`, boxShadow: '0 4px 10px rgba(0,0,0,.45)' });
      return { b, sv };
    });
    // 맨 아래: 지시문에 적은 이징으로 움직이는 큰 카드
    const mt = el('div', null, sp);
    box(mt, { position: 'absolute', left: '18px', right: '16px', top: '272px', height: '58px', borderRadius: '10px', background: 'rgba(255,255,255,.045)', border: '1px solid rgba(255,255,255,.09)' });
    const card = el('div', null, mt);
    box(card, { position: 'absolute', top: '9px', width: '88px', height: '38px', borderRadius: '8px', background: 'linear-gradient(150deg,#ffb36b,#ff6a4d)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.5), 0 6px 14px rgba(0,0,0,.4)' });
    const ml = el('div', null, sp, '');
    box(ml, { position: 'absolute', left: '20px', top: '336px', font: "500 12px/1 'IBM Plex Sans KR',sans-serif", color: 'rgba(255,255,255,.8)' });
    return { dots, curves, diag, lanes, card, ml, gx, gy, gw, gh };
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
    s.ml.textContent = L >= 2 ? `아래 큰 카드는 ${MAIN} 을 씁니다` : '연출 전 · 전부 등속(linear)이라 기계처럼 일정하게 감';
  },
};
export default demo;
