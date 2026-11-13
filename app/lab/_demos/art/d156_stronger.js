/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/svg-displacement/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

const PAL = { bg0: '#1f3a8a', bg1: '#172a63', ink: '#f3f6ff', muted: '#aebcf0', accent: '#ffd166', accent2: '#7fe0ff', surface: '#1b3274', line: 'rgba(243,246,255,.2)' };
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

// SVG 필터: feTurbulence 가 노이즈 그림(색이 곧 이동량)을 만들고, feDisplacementMap 이 그 색만큼 원본 그림의 픽셀을 밀어 일렁이게 한다. 화면은 시간 t 의 함수다.
const SCALE = 80;                 // feDisplacementMap scale — 최대 이동량(px)의 2배
const FREQ = .02;                 // feTurbulence baseFrequency(가로). 클수록 일렁임이 잘고 촘촘함
const T0 = .4;
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);
const NS = 'http://www.w3.org/2000/svg';
const sv = (tag, at, par) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (par) par.appendChild(e); return e; };
const MONO = "'JetBrains Mono',monospace", SANS = "'IBM Plex Sans KR',sans-serif";
const RX = 218, RY = 50, RW = 408, RH = 296, MX = 20, MY = 96, MS = 168;   // 오른쪽 작품 영역 · 왼쪽 노이즈 미리보기 영역
const freqOf = (t, L) => { const f = FREQ * (1 + (L >= 3 ? .22 * Math.sin(t * 1.7) : 0)); return `${f.toFixed(5)} ${(f * 2.5).toFixed(5)}`; };

const demo = {
  dur: 4, rest: 3.4, noCompare: false, levels: 3,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: `linear-gradient(160deg,${PAL.bg0} 0%,${PAL.bg1} 100%)` });
    box(el('div', null, bg), { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.06', mixBlendMode: 'overlay' });
    const svg = sv('svg', { width: 640, height: 360, viewBox: '0 0 640 360' }, sp);
    box(svg, { position: 'absolute', left: '0', top: '0' });
    const defs = sv('defs', {}, svg);
    // 필터 1: 일렁임(노이즈 → 밀어내기)
    const fd = sv('filter', { id: 'sdf', filterUnits: 'userSpaceOnUse', x: RX, y: RY, width: RW, height: RH, 'color-interpolation-filters': 'sRGB' }, defs);
    const t1 = sv('feTurbulence', { type: 'fractalNoise', baseFrequency: '0.02 0.05', numOctaves: 2, seed: 4, result: 'noise' }, fd);
    const dm = sv('feDisplacementMap', { in: 'SourceGraphic', in2: 'noise', scale: SCALE, xChannelSelector: 'R', yChannelSelector: 'G' }, fd);
    // 필터 2: 같은 노이즈를 눈에 보이게(알파 1)
    const fm = sv('filter', { id: 'sdm', filterUnits: 'userSpaceOnUse', x: MX, y: MY, width: MS, height: MS, 'color-interpolation-filters': 'sRGB' }, defs);
    const t2 = sv('feTurbulence', { type: 'fractalNoise', baseFrequency: '0.02 0.05', numOctaves: 2, seed: 4 }, fm);
    sv('feColorMatrix', { values: '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0 1' }, fm);
    // 작품에 쓰는 그라디언트와 마스크
    const sg = sv('linearGradient', { id: 'sds', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    sv('stop', { offset: 0, 'stop-color': PAL.accent }, sg); sv('stop', { offset: .55, 'stop-color': '#ff8a6b' }, sg); sv('stop', { offset: 1, 'stop-color': '#d44f7a' }, sg);
    const bgg = sv('linearGradient', { id: 'sdb', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    sv('stop', { offset: 0, 'stop-color': '#0d1a4a' }, bgg); sv('stop', { offset: 1, 'stop-color': '#132463' }, bgg);
    const tg = sv('linearGradient', { id: 'sdt', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    sv('stop', { offset: 0, 'stop-color': PAL.ink }, tg); sv('stop', { offset: 1, 'stop-color': PAL.accent2 }, tg);
    const mk = sv('mask', { id: 'sdk', maskUnits: 'userSpaceOnUse', x: 330, y: 60, width: 184, height: 180 }, defs);
    sv('rect', { x: 330, y: 60, width: 184, height: 180, fill: '#fff' }, mk);
    [[158, 4], [172, 6], [187, 8], [203, 10], [220, 12]].forEach(([y, h]) => sv('rect', { x: 330, y, width: 184, height: h, fill: '#000' }, mk));
    sv('rect', { x: RX, y: RY, width: RW, height: RH, rx: 12, fill: 'url(#sdb)', stroke: PAL.line }, svg);
    const cp = sv('clipPath', { id: 'sdclip' }, defs); sv('rect', { x: RX, y: RY, width: RW, height: RH, rx: 12 }, cp);
    const art = sv('g', {}, sv('g', { 'clip-path': 'url(#sdclip)' }, svg));
    sv('circle', { cx: 422, cy: 150, r: 84, fill: 'url(#sds)', mask: 'url(#sdk)' }, art);
    for (let k = 0; k < 6; k++) sv('line', { x1: RX + 10, x2: RX + RW - 10, y1: 236 + k * k * 2.6 + k * 3, y2: 236 + k * k * 2.6 + k * 3, stroke: rgba(PAL.accent2, .75), 'stroke-width': 1.4 }, art);
    for (let k = -6; k <= 6; k++) sv('line', { x1: 422, y1: 236, x2: 422 + k * 70, y2: 346, stroke: rgba(PAL.accent2, .6), 'stroke-width': 1.4 }, art);
    const tx = sv('text', { x: 422, y: 318, fill: 'url(#sdt)', stroke: 'rgba(8,16,52,.75)', 'stroke-width': 3, 'paint-order': 'stroke', 'font-size': 66, 'font-family': "'Black Han Sans',sans-serif", 'text-anchor': 'middle' }, art); tx.textContent = 'FLOW';
    // 왼쪽 패널
    sv('rect', { x: 14, y: 50, width: 196, height: 296, rx: 12, fill: rgba(PAL.surface, .9), stroke: PAL.line }, svg);
    const T = (x, y, s, sz, fill, f, w) => { const e = sv('text', { x, y, fill, 'font-size': sz, 'font-family': f || SANS, 'font-weight': w || 400 }, svg); e.textContent = s; return e; };
    T(26, 72, '① feTurbulence(노이즈 지도)', 11.5, PAL.ink, SANS, 700);
    const rr = sv('rect', { x: MX, y: MY, width: MS, height: MS, fill: '#000', rx: 6, filter: 'url(#sdm)' }, svg);
    const rd = [T(26, 88, '', 9.5, PAL.accent2, MONO), T(26, 274, '', 9.5, PAL.ink, MONO), T(26, 289, '', 9.5, PAL.ink, MONO), T(26, 304, '', 9.5, PAL.accent, MONO)];
    T(26, 322, '빨강 → 가로, 초록 → 세로로 이동', 9.5, PAL.muted); T(26, 336, '회색(0.5)이면 안 움직여요', 9.5, PAL.muted);
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', top: '12px', padding: '7px 14px', borderRadius: '999px', background: rgba(PAL.bg1, .82), border: `1px solid ${PAL.line}`, color: PAL.ink, font: "500 14px/1 'IBM Plex Sans KR',sans-serif", zIndex: 5 });
    const cap = el('div', null, sp);
    box(cap, { position: 'absolute', right: '20px', top: '24px', font: "500 10.5px/1 'JetBrains Mono',monospace", color: PAL.ink, textAlign: 'right' });
    return { art, t1, t2, dm, rd, pill, cap };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 원본, 2 = + 노이즈로 밀어내기(고정), 3 = + 시간에 따라 일렁임
    const ramp = E.outC(seg(t, T0, T0 + 1)), sc = L <= 1 ? 0 : L === 2 ? SCALE : SCALE * ramp * (.85 + .15 * Math.sin(t * 3));
    const fq = freqOf(t, L);
    s.t1.setAttribute('baseFrequency', fq); s.t2.setAttribute('baseFrequency', fq); s.dm.setAttribute('scale', sc.toFixed(2));
    s.art.setAttribute('filter', L >= 2 ? 'url(#sdf)' : 'none');
    s.rd[0].textContent = `baseFrequency ${fq.split(' ').map((v) => (+v).toFixed(3)).join(' ')}`;
    s.rd[1].textContent = `numOctaves 2, seed 4`; s.rd[2].textContent = `scale ${sc.toFixed(0)}`; s.rd[3].textContent = `최대 이동 ±${(sc / 2).toFixed(0)}px`;
    s.cap.textContent = L <= 1 ? '② 원본 그림' : '② feDisplacementMap 결과';
    s.pill.textContent = L <= 1 ? '연출 전: 필터 없이 원본 그대로' : L === 2 ? '필터 적용: 픽셀이 밀려 일그러짐' : 'scale 과 주파수가 변해 물결처럼 일렁임';
  },
};
export default demo;
