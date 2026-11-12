/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/stroke-draw/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 선 그리기: stroke-dasharray 로 선을 '보이는 조각 + 빈 조각'으로 만들고, stroke-dashoffset 을 100 에서 0 으로 줄이면 선이 처음부터 그려진다. 화면은 시간 t 의 함수다.
const DRAW = 1.8;                 // 한 획을 그리는 시간(초)
const GAP = .25;                  // 다음 획이 시작하기까지의 간격(초)
const T0 = .4;
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);
const NS = 'http://www.w3.org/2000/svg';
const sv = (tag, at, par) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (par) par.appendChild(e); return e; };
const txt = (par, x, y, s, size, fill, font, anchor) => { const e = sv('text', { x, y, fill, 'font-size': size, 'font-family': font || "'IBM Plex Sans KR',sans-serif", 'text-anchor': anchor || 'start' }, par); e.textContent = s; return e; };
const MONO = "'JetBrains Mono',monospace";
const STROKES = [   // 전구 라인아트: 유리 윤곽 · 필라멘트 · 밑동 3줄 · 빛줄기
  'M 456 226 C 456 200, 424 184, 424 148 C 424 108, 452 82, 480 82 C 508 82, 536 108, 536 148 C 536 184, 504 200, 504 226 Z',
  'M 468 226 L 468 172 Q 474 156 480 172 Q 486 156 492 172 L 492 226',
  'M 458 240 H 502', 'M 460 254 H 500', 'M 466 268 H 494',
  'M 480 50 V 66 M 432 62 L 442 74 M 528 62 L 518 74 M 396 118 L 410 124 M 564 118 L 550 124',
];
const startOf = (i, L) => (L >= 3 ? T0 + i * GAP : T0);

const demo = {
  dur: 5, rest: 4.2, noCompare: false, levels: 3,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: 'linear-gradient(160deg,#0b0f1a 0%,#161d30 100%)' });
    box(el('div', null, bg), { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.06', mixBlendMode: 'overlay' });
    const svg = sv('svg', { width: 640, height: 360, viewBox: '0 0 640 360' }, sp);
    box(svg, { position: 'absolute', left: '0', top: '0' });
    const defs = sv('defs', {}, svg);
    const lg = sv('linearGradient', { id: 'sdg', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    sv('stop', { offset: 0, 'stop-color': '#fff1bd' }, lg); sv('stop', { offset: 1, 'stop-color': '#ff9d5c' }, lg);
    const gb = sv('filter', { id: 'sdb', x: '-30%', y: '-30%', width: '160%', height: '160%' }, defs);
    sv('feGaussianBlur', { stdDeviation: 5 }, gb);
    sv('rect', { x: 16, y: 56, width: 296, height: 288, rx: 14, fill: 'rgba(255,255,255,.045)', stroke: 'rgba(255,255,255,.09)' }, svg);
    sv('rect', { x: 328, y: 56, width: 296, height: 288, rx: 14, fill: 'rgba(255,255,255,.045)', stroke: 'rgba(255,255,255,.09)' }, svg);
    sv('ellipse', { cx: 476, cy: 206, rx: 120, ry: 100, fill: 'rgba(255,170,90,.10)', filter: 'url(#sdb)' }, svg);
    txt(svg, 32, 82, '원리 · 점선을 밀어서 선을 그린다', 13, '#fff').setAttribute('font-weight', 700);
    txt(svg, 32, 100, 'pathLength=100 이면 선 전체 길이가 100', 11, 'rgba(255,255,255,.55)');
    // 원리 도식: 검은 틀 = 선 전체(0~100), 주황 막대 = 보이는 조각(dash), 빗금 = 빈 조각(gap)
    sv('rect', { x: 40, y: 128, width: 248, height: 26, rx: 6, fill: 'none', stroke: 'rgba(255,255,255,.55)', 'stroke-dasharray': '3 3' }, svg);
    txt(svg, 40, 122, '선 전체 0', 10, 'rgba(255,255,255,.6)', MONO); txt(svg, 288, 122, '100', 10, 'rgba(255,255,255,.6)', MONO, 'end');
    const cp = sv('clipPath', { id: 'sdc' }, defs); sv('rect', { x: 40, y: 124, width: 248, height: 34 }, cp);
    const dashDim = sv('rect', { y: 132, width: 248, height: 18, rx: 4, fill: 'rgba(255,170,90,.22)' }, svg);
    const dashOn = sv('rect', { y: 132, width: 248, height: 18, rx: 4, fill: '#ffb36b', 'clip-path': 'url(#sdc)' }, svg);
    const hp = sv('pattern', { id: 'sdp', width: 8, height: 8, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs);
    sv('rect', { width: 8, height: 8, fill: 'rgba(255,255,255,.05)' }, hp); sv('rect', { width: 3, height: 8, fill: 'rgba(255,255,255,.28)' }, hp);
    const gapBar = sv('rect', { y: 132, width: 248, height: 18, rx: 4, fill: 'url(#sdp)', 'clip-path': 'url(#sdc)' }, svg);
    txt(svg, 40, 176, 'stroke-dasharray', 11, 'rgba(255,255,255,.55)', MONO); txt(svg, 288, 176, '100 100', 11, '#ffb36b', MONO, 'end');
    txt(svg, 40, 194, 'stroke-dashoffset', 11, 'rgba(255,255,255,.55)', MONO);
    const offTx = txt(svg, 288, 194, '', 11, '#fff', MONO, 'end');
    txt(svg, 32, 226, '획마다 진행률(오프셋 100 → 0)', 11, 'rgba(255,255,255,.55)');
    const bars = STROKES.map((_, i) => {
      txt(svg, 40, 247 + i * 17, `획 ${i + 1}`, 10, 'rgba(255,255,255,.6)', MONO);
      sv('rect', { x: 84, y: 239 + i * 17, width: 204, height: 8, rx: 4, fill: 'rgba(255,255,255,.10)' }, svg);
      return sv('rect', { x: 84, y: 239 + i * 17, width: 0, height: 8, rx: 4, fill: '#ffb36b' }, svg);
    });
    // 오른쪽: 라인아트(빛 번짐 층 + 선 층)
    const ga = sv('g', { transform: 'translate(-4,36)' }, svg), gm = sv('g', { transform: 'translate(-4,36)' }, svg);
    const mk = (par, glow) => STROKES.map((d) => sv('path', { d, pathLength: 100, fill: 'none', stroke: glow ? '#ffb36b' : 'url(#sdg)', 'stroke-width': glow ? 9 : 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': '100 100', ...(glow ? { filter: 'url(#sdb)', opacity: .5 } : {}) }, par));
    const glows = mk(ga, true), mains = mk(gm, false);
    const lens = mains.map((p) => p.getTotalLength());
    const penG = sv('circle', { r: 11, fill: 'rgba(255,230,170,.55)', filter: 'url(#sdb)' }, gm), pen = sv('circle', { r: 4.2, fill: '#fff' }, gm);
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', top: '14px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.66)', color: '#fff', font: "500 14px/1 'IBM Plex Sans KR',sans-serif", zIndex: 5 });
    return { glows, mains, lens, pen, penG, pill, dashDim, dashOn, gapBar, offTx, bars };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 한 번에 나타남, 2 = + dashoffset 으로 그림(동시·등속), 3 = + 획 순서·이징·펜 끝
    let active = -1, done = 0;
    STROKES.forEach((_, i) => {
      const st = startOf(i, L);
      let p;
      if (L <= 1) p = t >= T0 ? 1 : 0;
      else if (L === 2) p = seg(t, st, st + DRAW);
      else p = E.outC(seg(t, st, st + DRAW));
      const off = (1 - p) * 100;
      const vis = L <= 1 ? seg(t, T0, T0 + .12) : (p > 0 ? 1 : 0);
      [s.mains[i], s.glows[i]].forEach((e, k) => { e.setAttribute('stroke-dashoffset', off.toFixed(2)); e.style.opacity = k ? vis * .5 : vis; });
      s.bars[i].setAttribute('width', (204 * p).toFixed(1));
      if (L >= 3 && t >= st && t < st + DRAW) active = i;
      if (p >= 1) done++;
      if (i === 0) {
        const o = L <= 1 ? 0 : off;
        const dx = 40 + (-o / 100) * 248;
        s.dashDim.setAttribute('x', dx); s.dashOn.setAttribute('x', dx); s.gapBar.setAttribute('x', dx + 248);
        s.offTx.textContent = L <= 1 ? '(안 씀)' : o.toFixed(0);
      }
    });
    if (L <= 1) { s.dashDim.setAttribute('x', 40); s.dashOn.setAttribute('x', 40); s.gapBar.setAttribute('x', 288); }
    if (active >= 0) {
      const p = E.outC(seg(t, startOf(active, L), startOf(active, L) + DRAW));
      const pt = s.mains[active].getPointAtLength(s.lens[active] * p);
      s.pen.setAttribute('cx', pt.x); s.pen.setAttribute('cy', pt.y); s.penG.setAttribute('cx', pt.x); s.penG.setAttribute('cy', pt.y);
    }
    s.pen.style.opacity = active >= 0 ? 1 : 0; s.penG.style.opacity = active >= 0 ? 1 : 0;
    s.pill.textContent = L <= 1 ? '연출 전 · 선이 한 번에 나타남' : L === 2 ? '선 6개가 동시에, 같은 속도로 그려짐' : (done >= STROKES.length ? '다 그려짐 · 획 6/6' : `이징 + 펜 끝 · 획 ${Math.min(STROKES.length, done + 1)}/6`);
  },
};
export default demo;
