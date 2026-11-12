/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/text-morph/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 글자→글자 모핑: 두 글자의 윤곽을 같은 수의 점으로 나누고, 점 i 를 점 i 로 옮기며 모양을 바꾼다. 점의 짝(시작점·방향)이 맞아야 깔끔하다. 화면은 시간 t 의 함수다.
const MORPH = 1.0;                // 글자가 바뀌는 데 걸리는 시간(초)
const PTS = 6;                   // 글자 윤곽을 나눈 점 수
const T0 = .5;
const CX = 320, CY = 168;
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);
const NS = 'http://www.w3.org/2000/svg';
const sv = (tag, at, par) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (par) par.appendChild(e); return e; };
const MONO = "'JetBrains Mono',monospace", SANS = "'IBM Plex Sans KR',sans-serif";
const GN = [[-62, 82], [-62, -82], [62, 82], [62, -82]];                       // N 의 중심선(왼쪽 아래에서 시작)
const GM = [[-74, 82], [-74, -82], [0, 20], [74, -82], [74, 82]];              // M 의 중심선(왼쪽 아래에서 시작)
function resample(poly, n) {
  const cum = [0];
  for (let i = 1; i < poly.length; i++) cum.push(cum[i - 1] + Math.hypot(poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1]));
  const out = [];
  for (let i = 0; i < n; i++) {
    const s = cum[cum.length - 1] * i / (n - 1);
    let k = 1; while (k < cum.length - 1 && cum[k] < s) k++;
    const f = (s - cum[k - 1]) / (cum[k] - cum[k - 1]);
    out.push([lerp(poly[k - 1][0], poly[k][0], f), lerp(poly[k - 1][1], poly[k][1], f)]);
  }
  return out;
}
const toD = (pts) => 'M ' + pts.map((p) => `${(CX + p[0]).toFixed(1)} ${(CY + p[1]).toFixed(1)}`).join(' L ');
const DOTC = ['#ff7a8a', '#ffb36b', '#ffe27a', '#7fffd0', '#7fd6ff'];

const demo = {
  dur: 4, rest: 3.4, noCompare: false, levels: 3,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: 'linear-gradient(160deg,#0b0f1a 0%,#161d30 100%)' });
    box(el('div', null, bg), { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.06', mixBlendMode: 'overlay' });
    const svg = sv('svg', { width: 640, height: 360, viewBox: '0 0 640 360' }, sp);
    box(svg, { position: 'absolute', left: '0', top: '0' });
    const defs = sv('defs', {}, svg);
    const lg = sv('linearGradient', { id: 'tmg', gradientUnits: 'userSpaceOnUse', x1: 240, y1: 80, x2: 400, y2: 260 }, defs);
    sv('stop', { offset: 0, 'stop-color': '#7fd6ff' }, lg); sv('stop', { offset: 1, 'stop-color': '#c79bff' }, lg);
    const gb = sv('filter', { id: 'tmb', x: '-30%', y: '-30%', width: '160%', height: '160%' }, defs);
    sv('feGaussianBlur', { stdDeviation: 9 }, gb);
    sv('ellipse', { cx: CX, cy: CY + 8, rx: 190, ry: 120, fill: 'rgba(120,150,255,.07)' }, svg);
    const A = resample(GN, PTS), B = resample(GM, PTS), Br = B.slice().reverse();
    const ghost = (pts) => sv('path', { d: toD(pts), fill: 'none', stroke: 'rgba(255,255,255,.22)', 'stroke-width': 1.4, 'stroke-dasharray': '4 4', 'stroke-linejoin': 'round' }, svg);
    const gh = [ghost(A), ghost(B)];
    const sty = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
    const glow = sv('path', { ...sty, stroke: '#8fa6ff', 'stroke-width': 30, filter: 'url(#tmb)', opacity: .5 }, svg);
    const pn = sv('path', { ...sty, stroke: 'url(#tmg)', 'stroke-width': 20 }, svg), pm = sv('path', { ...sty, stroke: 'url(#tmg)', 'stroke-width': 20 }, svg);
    const corr = DOTC.map((c) => sv('line', { stroke: c, 'stroke-width': 1.1, opacity: .75 }, svg));
    const dots = DOTC.map((c) => sv('circle', { r: 4.6, fill: c, stroke: '#0b0f1a', 'stroke-width': 1.5 }, svg));
    const l1 = sv('text', { x: 28, y: 322, fill: 'rgba(255,255,255,.75)', 'font-size': 11.5, 'font-family': MONO }, svg);
    const l2 = sv('text', { x: 28, y: 340, fill: '#ffe27a', 'font-size': 11.5, 'font-family': SANS }, svg);
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', top: '14px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.66)', color: '#fff', font: "500 14px/1 'IBM Plex Sans KR',sans-serif", zIndex: 5 });
    return { A, B, Br, gh, glow, pn, pm, corr, dots, l1, l2, pill };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 겹쳐서 서서히 바뀜(디졸브), 2 = + 점을 옮기는 모핑(짝이 어긋남), 3 = + 시작점·방향을 맞춤
    const q = E.inOutC(seg(t, T0, T0 + MORPH));
    s.gh.forEach((g) => { g.style.display = L >= 2 ? 'block' : 'none'; });
    s.corr.forEach((c) => { c.style.display = L >= 2 ? 'block' : 'none'; });
    s.dots.forEach((c) => { c.style.display = L >= 2 ? 'block' : 'none'; });
    if (L <= 1) {
      s.pn.setAttribute('d', toD(s.A)); s.pm.setAttribute('d', toD(s.B)); s.glow.setAttribute('d', toD(s.A));
      s.pn.style.opacity = 1 - q; s.pm.style.opacity = q; s.glow.style.opacity = .5 * Math.max(1 - q, q) ;
      s.pm.style.display = 'block';
      s.l1.textContent = '점을 옮기지 않고 두 글자의 투명도만 교차'; s.l2.textContent = '중간에 N 도 M 도 아닌 흐릿한 겹침이 보입니다';
    } else {
      const T = L >= 3 ? s.B : s.Br;
      const mid = s.A.map((p, i) => [lerp(p[0], T[i][0], q), lerp(p[1], T[i][1], q)]);
      const d = toD(mid);
      s.pn.setAttribute('d', d); s.glow.setAttribute('d', d); s.pn.style.opacity = 1; s.glow.style.opacity = .5; s.pm.style.display = 'none';
      DOTC.forEach((c, k) => {
        const i = Math.round(k * (PTS - 1) / 4), p0 = s.A[i], p1 = T[i], pc = mid[i];
        s.corr[k].setAttribute('x1', (CX + p0[0]).toFixed(1)); s.corr[k].setAttribute('y1', (CY + p0[1]).toFixed(1));
        s.corr[k].setAttribute('x2', (CX + p1[0]).toFixed(1)); s.corr[k].setAttribute('y2', (CY + p1[1]).toFixed(1));
        s.dots[k].setAttribute('cx', (CX + pc[0]).toFixed(1)); s.dots[k].setAttribute('cy', (CY + pc[1]).toFixed(1));
      });
      s.l1.textContent = `점 ${PTS}개 · 점 i 를 점 i 로 옮김 (색 점 5개와 선은 짝을 보여 줌)`;
      s.l2.textContent = L >= 3 ? '시작점: N 의 왼쪽 아래 → M 의 왼쪽 아래 (짝이 맞음)' : '시작점: N 의 왼쪽 아래 → M 의 오른쪽 아래 (짝이 어긋나 꼬임)';
    }
    s.pill.textContent = L <= 1 ? '연출 전 · N 이 M 으로 겹치며 흐려졌다 바뀜' : L === 2 ? '모핑 · 점이 어긋나 글자가 꼬이며 변함' : '모핑 · 시작점과 방향을 맞춰 깔끔하게 변함';
  },
};
export default demo;
