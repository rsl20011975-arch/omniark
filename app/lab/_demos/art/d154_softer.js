/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/soft-body/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

const PAL = { bg0: '#f4efe4', bg1: '#e9e2d3', ink: '#1d1a16', muted: '#6b6458', accent: '#d4472b', accent2: '#2b5d8a', surface: '#fbf8f1', line: 'rgba(29,26,22,.22)' };
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

// 스프링-질량 소프트바디: 질량 점 35개를 스프링으로 격자처럼 이으면, 떨어져 닿을 때 스프링이 줄었다 늘었다 하며 젤리처럼 출렁인다. mount 에서 미리 계산해 t 로 찾아 쓴다.
const K = 500;                    // 스프링 세기(클수록 단단함)
const DAMP = 6;                   // 감쇠(클수록 출렁임이 빨리 멎음)
const T0 = .3;                    // 떨어지기 시작하는 시각(초)
const NX = 7, NY = 5, S = 22, G = 1400, FLOOR = 300, DT = 1 / 240, FRAMES = 230;   // 격자 · 간격 · 중력 · 바닥 높이 · 계산 간격 · 저장 프레임 수(60Hz)
const CX = 240, CY0 = 92;          // 젤리 중심 x · 처음 중심 y
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);
const NS = 'http://www.w3.org/2000/svg';
const sv = (tag, at, par) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (par) par.appendChild(e); return e; };
const MONO = "'JetBrains Mono',monospace", SANS = "'IBM Plex Sans KR',sans-serif";
const idx = (x, y) => y * NX + x;
const BOUND = [];   // 바깥 테두리 점 순서(시계 방향)
for (let x = 0; x < NX; x++) BOUND.push(idx(x, 0));
for (let y = 1; y < NY; y++) BOUND.push(idx(NX - 1, y));
for (let x = NX - 2; x >= 0; x--) BOUND.push(idx(x, NY - 1));
for (let y = NY - 2; y >= 1; y--) BOUND.push(idx(0, y));

function simulate() {
  const n = NX * NY, p = new Float64Array(2 * n), v = new Float64Array(2 * n), sp = [];
  for (let y = 0; y < NY; y++) for (let x = 0; x < NX; x++) { p[2 * idx(x, y)] = CX - (NX - 1) * S / 2 + x * S; p[2 * idx(x, y) + 1] = CY0 - (NY - 1) * S / 2 + y * S; }
  const add = (a, b, kind) => sp.push([a, b, Math.hypot(p[2 * a] - p[2 * b], p[2 * a + 1] - p[2 * b + 1]), kind]);
  for (let y = 0; y < NY; y++) for (let x = 0; x < NX; x++) {
    if (x + 1 < NX) add(idx(x, y), idx(x + 1, y), 0);
    if (y + 1 < NY) add(idx(x, y), idx(x, y + 1), 0);
    if (x + 1 < NX && y + 1 < NY) { add(idx(x, y), idx(x + 1, y + 1), 1); add(idx(x + 1, y), idx(x, y + 1), 1); }
    if (x + 2 < NX) add(idx(x, y), idx(x + 2, y), 2);
    if (y + 2 < NY) add(idx(x, y), idx(x, y + 2), 2);
  }
  const frames = [Float32Array.from(p)], per = Math.round(1 / 60 / DT), f = new Float64Array(2 * n);
  for (let step = 1; step <= FRAMES * per; step++) {
    f.fill(0);
    for (let i = 0; i < n; i++) f[2 * i + 1] += G;
    for (let k = 0; k < sp.length; k++) {
      const [a, b, r] = sp[k], dx = p[2 * b] - p[2 * a], dy = p[2 * b + 1] - p[2 * a + 1], l = Math.hypot(dx, dy) || 1e-6, ux = dx / l, uy = dy / l;
      const fs = K * (l - r) + DAMP * ((v[2 * b] - v[2 * a]) * ux + (v[2 * b + 1] - v[2 * a + 1]) * uy);
      f[2 * a] += fs * ux; f[2 * a + 1] += fs * uy; f[2 * b] -= fs * ux; f[2 * b + 1] -= fs * uy;
    }
    for (let i = 0; i < n; i++) {
      v[2 * i] += f[2 * i] * DT; v[2 * i + 1] += f[2 * i + 1] * DT;
      p[2 * i] += v[2 * i] * DT; p[2 * i + 1] += v[2 * i + 1] * DT;
      if (p[2 * i + 1] > FLOOR) { p[2 * i + 1] = FLOOR; if (v[2 * i + 1] > 0) v[2 * i + 1] = 0; v[2 * i] *= .9; }
    }
    if (step % per === 0) frames.push(Float32Array.from(p));
  }
  return { frames, sp };
}
function spline(pts) {   // 닫힌 곡선(Catmull-Rom → 3차 베지어)
  const n = pts.length; let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    d += ` C ${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + ' Z';
}

const demo = {
  dur: 4, rest: 3.4, noCompare: false, levels: 3,
  mount(sp) {
    const sim = simulate();
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: `linear-gradient(160deg,${PAL.bg0} 0%,${PAL.bg1} 100%)` });
    box(el('div', null, bg), { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.09', mixBlendMode: 'multiply' });
    const svg = sv('svg', { width: 640, height: 360, viewBox: '0 0 640 360' }, sp);
    box(svg, { position: 'absolute', left: '0', top: '0' });
    const defs = sv('defs', {}, svg);
    const jg = sv('linearGradient', { id: 'sbj', x1: 0, y1: 0, x2: 0.4, y2: 1 }, defs);
    sv('stop', { offset: 0, 'stop-color': '#f2866b' }, jg); sv('stop', { offset: 1, 'stop-color': '#b8321a' }, jg);
    const hg = sv('linearGradient', { id: 'sbh', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    sv('stop', { offset: 0, 'stop-color': '#fff', 'stop-opacity': .55 }, hg); sv('stop', { offset: 1, 'stop-color': '#fff', 'stop-opacity': 0 }, hg);
    const bl = sv('filter', { id: 'sbb', x: '-30%', y: '-60%', width: '160%', height: '220%' }, defs); sv('feGaussianBlur', { stdDeviation: 6 }, bl);
    const fg = sv('linearGradient', { id: 'sbf', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    sv('stop', { offset: 0, 'stop-color': 'rgba(29,26,22,.12)' }, fg); sv('stop', { offset: 1, 'stop-color': 'rgba(29,26,22,0)' }, fg);
    sv('rect', { x: 20, y: FLOOR, width: 440, height: 56, fill: 'url(#sbf)' }, svg);
    sv('line', { x1: 20, y1: FLOOR, x2: 460, y2: FLOOR, stroke: rgba(PAL.ink, .4) }, svg);
    const shadow = sv('ellipse', { cx: CX, cy: FLOOR + 3, rx: 70, ry: 8, fill: rgba(PAL.ink, .5), filter: 'url(#sbb)' }, svg);
    const jelly = sv('g', {}, svg);
    const body = sv('path', { fill: 'url(#sbj)', stroke: 'rgba(255,225,210,.6)', 'stroke-width': 1.4, 'stroke-linejoin': 'round', 'fill-opacity': .94 }, jelly);
    const inner = sv('path', { fill: 'url(#sbh)', transform: 'translate(-3,-5)' }, jelly);
    const spec = sv('ellipse', { rx: 13, ry: 4.5, fill: 'rgba(255,255,255,.75)' }, jelly);
    const rigid = sv('rect', { x: CX - 66 - 11, width: 154, height: 110, rx: 10, fill: 'url(#sbj)', stroke: 'rgba(255,225,210,.6)' }, svg);
    const skel = sv('g', {}, svg);
    const sl = [0, 1, 2].map((k) => sv('path', { fill: 'none', stroke: [PAL.muted, PAL.accent2, PAL.accent][k], 'stroke-width': 1.3, opacity: [.6, .95, .95][k] }, skel));
    const dots = Array.from({ length: NX * NY }, () => sv('circle', { r: 3, fill: PAL.surface, stroke: PAL.ink, 'stroke-width': 1 }, skel));
    // 오른쪽: 스프링 하나(훅의 법칙)
    sv('rect', { x: 480, y: 50, width: 150, height: 296, rx: 12, fill: rgba(PAL.surface, .9), stroke: PAL.line }, svg);
    const tx = (x, y, s, sz, fill, f, a) => { const e = sv('text', { x, y, fill, 'font-size': sz, 'font-family': f || SANS, 'text-anchor': a || 'start' }, svg); e.textContent = s; return e; };
    tx(492, 72, '스프링 하나', 12.5, PAL.ink).setAttribute('font-weight', 700);
    tx(492, 88, '(맨 아랫줄 가운데)', 9.5, PAL.muted);
    const zz = sv('path', { fill: 'none', stroke: PAL.accent, 'stroke-width': 2.4, 'stroke-linejoin': 'round' }, svg);
    const m1 = sv('circle', { cx: 520, r: 6, fill: PAL.surface, stroke: PAL.ink, 'stroke-width': 1.5 }, svg), m2 = sv('circle', { cx: 520, r: 6, fill: PAL.surface, stroke: PAL.ink, 'stroke-width': 1.5 }, svg);
    const rd = [0, 1, 2, 3].map((k) => tx(552, 120 + k * 15, '', 10, k === 3 ? PAL.accent : PAL.ink, MONO));
    const nt = [0, 1, 2, 3].map((k) => tx(492, 262 + k * 14, '', 9.5, PAL.muted));
    // 이름표(numeral): 왼쪽 위에 큰 단계 숫자 + 옆에 13px 설명
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', top: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px', zIndex: 5 });
    const pk = el('div', null, pill); box(pk, { font: "400 40px/1 'Black Han Sans',sans-serif", color: PAL.accent });
    const pv = el('div', null, pill); box(pv, { width: '104px', paddingTop: '2px', font: "500 13px/1.3 'IBM Plex Sans KR',sans-serif", color: PAL.ink });
    return { sim, shadow, body, inner, spec, jelly, rigid, skel, sl, dots, zz, m1, m2, rd, nt, pill, pk, pv };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 딱딱한 상자, 2 = + 스프링-질량 격자(뼈대), 3 = + 젤리 표면
    const u = Math.max(0, Math.min(FRAMES - 1e-6, (t - T0) * 60)), i0 = Math.floor(u), fr = u - i0, A = s.sim.frames[i0], B = s.sim.frames[i0 + 1];
    const P = (i) => [lerp(A[2 * i], B[2 * i], fr), lerp(A[2 * i + 1], B[2 * i + 1], fr)];
    const pts = Array.from({ length: NX * NY }, (_, i) => P(i));
    s.jelly.style.display = L >= 3 ? 'block' : 'none'; s.skel.style.display = L >= 2 ? 'block' : 'none'; s.rigid.style.display = L <= 1 ? 'block' : 'none';
    // 딱딱한 상자: 같은 높이에서 떨어져 닿으면 그대로 멈춤
    const tt = Math.max(0, t - T0), top0 = CY0 - (NY - 1) * S / 2 - 11, hh = (NY - 1) * S + 22;
    s.rigid.setAttribute('y', Math.min(top0 + .5 * G * tt * tt, FLOOR - hh).toFixed(1)); s.rigid.setAttribute('height', hh);
    const bp = BOUND.map((i) => pts[i]);
    const cen = bp.reduce((q, p) => [q[0] + p[0] / bp.length, q[1] + p[1] / bp.length], [0, 0]);
    const grow = (p, k) => [cen[0] + (p[0] - cen[0]) * k, cen[1] + (p[1] - cen[1]) * k];   // 점 테두리를 살짝 바깥으로
    s.body.setAttribute('d', spline(bp.map((p) => grow(p, 1.1)))); s.inner.setAttribute('d', spline(bp.map((p) => grow(p, .7))));
    const sc = grow(pts[idx(2, 0)], 1.1); s.spec.setAttribute('cx', (sc[0] + 4).toFixed(1)); s.spec.setAttribute('cy', (sc[1] + 11).toFixed(1)); s.spec.setAttribute('transform', `rotate(-14 ${sc[0] + 4} ${sc[1] + 11})`);
    // 뼈대
    const d = ['', '', ''];
    s.sim.sp.forEach(([i, j, r, kind]) => {
      if (kind === 2) return;
      const l = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]) / r, c = l < .9 ? 1 : l > 1.1 ? 2 : 0;
      d[c] += `M ${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} L ${pts[j][0].toFixed(1)} ${pts[j][1].toFixed(1)} `;
    });
    s.sl.forEach((e, k) => e.setAttribute('d', d[k] || 'M 0 0'));
    s.skel.style.opacity = L >= 3 ? .1 : 1;
    s.dots.forEach((c, i) => { c.setAttribute('cx', pts[i][0].toFixed(1)); c.setAttribute('cy', pts[i][1].toFixed(1)); });
    const low = Math.max(...pts.map((p) => p[1]));
    const wid = Math.max(...pts.map((p) => p[0])) - Math.min(...pts.map((p) => p[0]));
    const rig = L <= 1 ? Math.min(top0 + .5 * G * tt * tt, FLOOR - hh) + hh : low + 11;
    s.shadow.setAttribute('rx', (L <= 1 ? 74 : wid * .55).toFixed(1)); s.shadow.style.opacity = Math.max(.2, 1 - (FLOOR - rig) / 200).toFixed(2);
    // 스프링 하나(맨 아랫줄 가운데): 원래 길이 대비 지금 길이
    const a1 = idx(3, 3), b1 = idx(3, 4), sp1 = s.sim.sp.find((q) => q[0] === a1 && q[1] === b1), r0 = sp1[2], l1 = Math.hypot(pts[a1][0] - pts[b1][0], pts[a1][1] - pts[b1][1]), x1 = l1 - r0;
    const y0 = 112, yb = y0 + l1 * 4.6; s.m1.setAttribute('cy', y0); s.m2.setAttribute('cy', yb.toFixed(1));
    let zd = `M 520 ${y0 + 6}`; const n = 8, h2 = (yb - 6) - (y0 + 6);
    for (let k = 0; k < n; k++) zd += ` L ${520 + (k % 2 ? -12 : 12)} ${(y0 + 6 + h2 * (k + .5) / n).toFixed(1)}`;
    zd += ` L 520 ${(yb - 6).toFixed(1)}`; s.zz.setAttribute('d', L >= 2 ? zd : 'M 0 0'); s.zz.setAttribute('stroke', x1 < -.5 ? PAL.accent2 : x1 > .5 ? PAL.accent : PAL.muted);
    s.m1.style.display = s.m2.style.display = L >= 2 ? 'block' : 'none';
    const rdt = L >= 2 ? [`원래 ${r0.toFixed(0)}px`, `지금 ${l1.toFixed(1)}px`, `x = ${x1.toFixed(1)}px`, `F = ${Math.round(K * x1)}`] : ['', '', '', ''];
    s.rd.forEach((e, k) => { e.textContent = rdt[k]; });
    const nts = L >= 2 ? ['힘 F = k × x (k=스프링 세기)', '줄면 밀어내고(파랑)', '늘면 당깁니다(빨강).', `k = ${K}, 감쇠 ${DAMP}`] : ['', '', '', ''];
    s.nt.forEach((e, k) => { e.textContent = nts[k]; });
    s.pk.textContent = String(Math.max(1, L));
    s.pv.textContent = L <= 1 ? (a ? '딱딱한 상자가 닿으면 멈춤' : '연출 전: 딱딱한 상자') : L === 2 ? `점 ${NX * NY}개를 스프링으로 이은 격자` : '젤리 표면: 눌렸다 출렁이며 멎음';
  },
};
export default demo;
