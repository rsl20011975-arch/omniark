/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/path-boolean/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

const PAL = { bg0: '#0b0f1a', bg1: '#161d30', ink: '#f4efe4', muted: '#8b94a3', accent: '#ffb36b', accent2: '#ffd27a', surface: '#131a2b', line: 'rgba(244,239,228,.16)' };
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

// 패스와 불리언: 도형은 점(앵커)과 방향선(핸들)으로 이은 패스이고, 불리언은 겹친 두 패스를 합치기·빼기·교집합·제외로 새 패스 하나로 만든다. 화면은 시간 t 의 함수다.
const SHIFT = 44;                 // 두 도형 중심 사이 거리(px)
const MOVE = .8;                  // 두 도형이 서로 다가와 겹치는 시간(초)
const T0 = .3;
const R = 38, BW = 74, BR = 10, CY = 62, SEPX = 22, K = .5523;
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);
const NS = 'http://www.w3.org/2000/svg';
const sv = (tag, at, par) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (par) par.appendChild(e); return e; };
const MONO = "'JetBrains Mono',monospace", SANS = "'IBM Plex Sans KR',sans-serif";
const OPS = [
  { nm: '합치기', en: 'Unite', how: '두 도형을 한 덩어리로', c: ['#ffe9a8', '#ffb36b'] },
  { nm: '빼기', en: 'Subtract', how: 'A 에서 B 가 덮은 부분을 오려 냄', c: ['#fbf6ea', '#9aa4b8'] },
  { nm: '교집합', en: 'Intersect', how: '겹친 부분만 남김', c: ['#ffc58a', '#e0743a'] },
  { nm: '제외', en: 'Exclude', how: '겹친 부분만 비움(evenodd)', c: ['#f4efe4', '#d9a25a'] },
];
const cxA = (u) => 95 - SHIFT / 2 - (1 - u) * SEPX, cxB = (u) => 95 + SHIFT / 2 + (1 - u) * SEPX;
const circP = (cx) => `M ${cx - R} ${CY} a ${R} ${R} 0 1 0 ${2 * R} 0 a ${R} ${R} 0 1 0 ${-2 * R} 0 Z`;
const rectP = (cx) => { const x = cx - BW / 2, y = CY - BW / 2, r = BR; return `M ${x + r} ${y} H ${x + BW - r} A ${r} ${r} 0 0 1 ${x + BW} ${y + r} V ${y + BW - r} A ${r} ${r} 0 0 1 ${x + BW - r} ${y + BW} H ${x + r} A ${r} ${r} 0 0 1 ${x} ${y + BW - r} V ${y + r} A ${r} ${r} 0 0 1 ${x + r} ${y} Z`; };
const setC = (e, cx) => { e.setAttribute('cx', cx.toFixed(1)); e.setAttribute('cy', CY); e.setAttribute('r', R); };
const setB = (e, cx) => { e.setAttribute('x', (cx - BW / 2).toFixed(1)); e.setAttribute('y', CY - BW / 2); e.setAttribute('width', BW); e.setAttribute('height', BW); e.setAttribute('rx', BR); };
const GH = { fill: 'none', stroke: rgba(PAL.ink, .6), 'stroke-width': 1.2, 'stroke-dasharray': '3 3' };

const demo = {
  dur: 4, rest: 3.4, noCompare: false, levels: 3,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: `linear-gradient(160deg,${PAL.bg0} 0%,${PAL.bg1} 100%)` });
    box(el('div', null, bg), { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.06', mixBlendMode: 'overlay' });
    const svg = sv('svg', { width: 640, height: 360, viewBox: '0 0 640 360' }, sp);
    box(svg, { position: 'absolute', left: '0', top: '0' });
    const defs = sv('defs', {}, svg);
    const root = sv('g', { transform: 'translate(0,-30)' }, svg);   // 아래쪽 이름표 자리를 비우려고 전체를 위로 올린다
    // 왼쪽 패널: 원본 두 도형(패스)
    sv('rect', { x: 16, y: 50, width: 200, height: 296, rx: 14, fill: rgba(PAL.surface, .9), stroke: PAL.line }, root);
    const tl = sv('text', { x: 28, y: 72, fill: PAL.ink, 'font-size': 13, 'font-weight': 700, 'font-family': SANS }, root); tl.textContent = '원본: 패스 2개';
    const L0 = sv('g', { transform: 'translate(16,90)' }, root);
    const lA = sv('path', { fill: rgba(PAL.ink, .62), stroke: PAL.ink, 'stroke-width': 1.6 }, L0), lB = sv('path', { fill: rgba(PAL.accent, .5), stroke: PAL.accent, 'stroke-width': 1.6 }, L0);
    const anc = sv('g', {}, L0);
    const la = sv('text', { x: 14, y: 130, fill: PAL.ink, 'font-size': 11, 'font-family': SANS }, L0); la.textContent = 'A 원';
    const lb = sv('text', { x: 176, y: 130, fill: PAL.accent, 'font-size': 11, 'font-family': SANS, 'text-anchor': 'end' }, L0); lb.textContent = 'B 둥근 사각형';
    const dTx = [0, 1, 2, 3].map((k) => { const e = sv('text', { x: 28, y: 250 + k * 18, fill: k === 0 ? rgba(PAL.ink, .8) : PAL.muted, 'font-size': 9.5, 'font-family': k ? MONO : SANS }, root); return e; });
    // 오른쪽: 결과 타일 4개
    const tiles = OPS.map((op, i) => {
      const gx = 232 + (i % 2) * 198, gy = 50 + Math.floor(i / 2) * 150;
      const g = sv('g', { transform: `translate(${gx},${gy})` }, root);
      sv('rect', { x: 0, y: 0, width: 190, height: 142, rx: 12, fill: rgba(PAL.surface, .9), stroke: PAL.line }, g);
      const lgd = sv('linearGradient', { id: 'pbg' + i, gradientUnits: 'userSpaceOnUse', x1: 0, y1: 20, x2: 0, y2: 104 }, defs);
      sv('stop', { offset: 0, 'stop-color': op.c[0] }, lgd); sv('stop', { offset: 1, 'stop-color': op.c[1] }, lgd);
      const raw = sv('g', {}, g), res = sv('g', {}, g);
      const ra = sv('circle', { fill: rgba(PAL.ink, .62), stroke: PAL.ink, 'stroke-width': 1.4 }, raw), rb = sv('rect', { fill: rgba(PAL.accent, .5), stroke: PAL.accent, 'stroke-width': 1.4 }, raw);
      const o = { ra, rb, raw, res };
      const fill = `url(#pbg${i})`;
      if (i === 0) { o.a = sv('circle', { fill }, res); o.b = sv('rect', { fill }, res); }
      if (i === 1) {
        const mk = sv('mask', { id: 'pbm1', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: 190, height: 142 }, defs);
        sv('rect', { x: 0, y: 0, width: 190, height: 142, fill: '#fff' }, mk); o.mb = sv('rect', { fill: '#000' }, mk);
        o.a = sv('circle', { fill, mask: 'url(#pbm1)' }, res); o.gb = sv('rect', GH, res);
      }
      if (i === 2) {
        const cp = sv('clipPath', { id: 'pbc2' }, defs); o.cb = sv('rect', {}, cp);
        o.ga = sv('circle', GH, res); o.gb = sv('rect', GH, res); o.a = sv('circle', { fill, 'clip-path': 'url(#pbc2)' }, res);
      }
      if (i === 3) o.p = sv('path', { fill, 'fill-rule': 'evenodd' }, res);
      o.t1 = sv('text', { x: 12, y: 121, fill: PAL.ink, 'font-size': 12.5, 'font-weight': 700, 'font-family': SANS }, g);
      o.t2 = sv('text', { x: 12, y: 135, fill: PAL.muted, 'font-size': 10, 'font-family': SANS }, g);
      return o;
    });
    // 이름표(caption-bl): 왼쪽 아래, 배경 없음, 위에 1px 얇은 선
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', bottom: '12px', paddingTop: '6px', borderTop: `1px solid ${PAL.line}`, color: PAL.muted, font: "500 12px/1.3 'JetBrains Mono','IBM Plex Sans KR',monospace", zIndex: 5 });
    return { tiles, lA, lB, anc, dTx, pill };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 겹쳐 놓기만 함, 2 = + 불리언 4가지 결과, 3 = + 패스(점·방향선·d 문자열)
    const u = E.inOutC(seg(t, T0, T0 + MOVE)), A = cxA(u), B = cxB(u);
    // 왼쪽 원본
    s.lA.setAttribute('d', circP(A)); s.lB.setAttribute('d', rectP(B));
    s.anc.innerHTML = '';
    if (L >= 3) {
      const dots = [[A - R, CY], [A, CY - R], [A + R, CY], [A, CY + R]];
      const hs = [[A - R, CY - K * R], [A - R, CY + K * R], [A - K * R, CY - R], [A + K * R, CY - R], [A + R, CY - K * R], [A + R, CY + K * R], [A - K * R, CY + R], [A + K * R, CY + R]];
      const ln = (p, q) => sv('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], stroke: PAL.accent2, 'stroke-width': 1.2 }, s.anc);
      [[0, 0], [0, 1], [1, 2], [1, 3], [2, 4], [2, 5], [3, 6], [3, 7]].forEach(([d, h]) => ln(dots[d], hs[h]));
      hs.forEach((h) => sv('circle', { cx: h[0].toFixed(1), cy: h[1].toFixed(1), r: 2.4, fill: PAL.accent2 }, s.anc));
      dots.forEach((d) => sv('rect', { x: (d[0] - 3.2).toFixed(1), y: (d[1] - 3.2).toFixed(1), width: 6.4, height: 6.4, fill: PAL.ink, stroke: PAL.bg0, 'stroke-width': 1.2 }, s.anc));
      const bx = B - BW / 2, by = CY - BW / 2;
      [[bx + BR, by], [bx + BW - BR, by], [bx + BW, by + BR], [bx + BW, by + BW - BR], [bx + BW - BR, by + BW], [bx + BR, by + BW], [bx, by + BW - BR], [bx, by + BR]].forEach((d) => sv('rect', { x: (d[0] - 3.2).toFixed(1), y: (d[1] - 3.2).toFixed(1), width: 6.4, height: 6.4, fill: PAL.ink, stroke: PAL.bg0, 'stroke-width': 1.2 }, s.anc));
    }
    const r2 = (n) => Math.round(n);
    const txt = L >= 3 ? ['흰 네모 = 점(앵커), 노란 점 = 방향선(핸들)', `A  M ${r2(A - R)} ${CY} C ${r2(A - R)} ${r2(CY - K * R)} ${r2(A - K * R)} ${r2(CY - R)} ${r2(A)} ${r2(CY - R)} …`, `B  M ${r2(B - BW / 2 + BR)} ${r2(CY - BW / 2)} H ${r2(B + BW / 2 - BR)} A 10 10 …`, '→ 불리언 결과도 점으로 이은 패스 1개'] : ['도형 2개가 겹쳐 있을 뿐,', '아직 하나로 합쳐지지 않았습니다.', '', ''];
    s.dTx.forEach((e, k) => { e.textContent = txt[k]; });
    // 오른쪽 타일
    s.tiles.forEach((o, i) => {
      const r = L >= 2 ? E.inOutC(seg(t, T0 + MOVE + .15 + i * .12, T0 + MOVE + .6 + i * .12)) : 0;
      o.raw.style.opacity = 1 - r; o.res.style.opacity = r;
      setC(o.ra, A); setB(o.rb, B);
      if (o.a && i !== 3) setC(o.a, A);
      if (i === 0) setB(o.b, B);
      if (i === 1) { setB(o.mb, B); setB(o.gb, B); }
      if (i === 2) { setB(o.cb, B); setB(o.gb, B); setC(o.ga, A); }
      if (i === 3) o.p.setAttribute('d', circP(A) + ' ' + rectP(B));
      o.t1.textContent = L >= 2 ? `${OPS[i].nm}  ${OPS[i].en}` : '겹쳐 놓기만 한 상태';
      o.t2.textContent = L >= 2 ? OPS[i].how : '도형 2개가 따로 남아 있음';
      o.t1.setAttribute('fill', L >= 2 ? PAL.ink : PAL.muted);
    });
    s.pill.textContent = L <= 1 ? '연출 전 / 두 도형을 겹쳐 놓기만 함' : L === 2 ? '불리언 / 같은 두 도형에서 결과 4가지' : '패스 / 도형은 점과 방향선으로 이은 선';
  },
};
export default demo;
