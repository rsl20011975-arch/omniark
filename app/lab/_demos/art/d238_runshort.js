/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/same-layout-repeat/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 같은 화면 틀 반복: 장면마다 배치 이름을 붙이고, 같은 배치가 이어진 길이와 차지한 비율과 종류 수를 코드가 센다.
// 장면 길이는 한 편의 타임라인에서 가져온 19개(합 204.7초)이고, 고친 배정표는 이 데모가 정한 것이다.
const RUN_MAX = 15;       // 같은 배치가 이어지는 길이의 상한(초)
const SHARE_MAX = 25;     // 한 배치가 전체에서 차지하는 비율의 상한(%)
const KINDS_MIN = 6;      // 배치 종류 수의 하한
const AFTER = 'FCTCAFPALTCFCLCSPAS';   // 고친 배정표: 장면 19개의 배치 문자
const DUR = [11.6, 1.8, 16.9, 6.0, 19.0, 17.8, 17.7, 18.4, 19.1, 9.7, 1.8, 9.2, 1.8, 15.9, 1.8, 8.7, 9.2, 7.5, 10.8];   // 장면 길이(초)
const PAL = { bg0: '#f4efe4', bg1: '#e9e2d3', ink: '#1d1a16', muted: '#6b6458', accent: '#d4472b', accent2: '#2b5d8a', surface: '#fbf8f1', line: 'rgba(29,26,22,.20)' };
const BAD = '#b42318', GOOD = '#14683d', MUTED2 = '#574f44';
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif', HAN = '"Black Han Sans", sans-serif';
const KINDS = [['S', '글자+작은 사진', '#d4472b'], ['F', '전체 화면', '#2b5d8a'], ['T', '좌우 비교', '#3f8a73'], ['A', '화면 위 주석', '#c58a1f'], ['L', '타임라인', '#7b5ea7'], ['P', '휴대폰 셋', '#2a8aa0'], ['C', '장 표지', '#6b6458']];
const COL = Object.fromEntries(KINDS.map(([k, , c]) => [k, c]));
const TOTAL = DUR.reduce((a, b) => a + b, 0);
const BEFORE = 'S'.repeat(DUR.length);

function stats(code) {   // 배정표에서 연속 길이, 종류별 비율, 종류 수를 센다
  let best = 0, bs = 0, be = 0, run = 0, rs = 0, t = 0;
  const share = {};
  [...code].forEach((k, i) => {
    if (i > 0 && code[i - 1] === k) run += DUR[i]; else { run = DUR[i]; rs = t; }
    if (run > best) { best = run; bs = rs; be = t + DUR[i]; }
    share[k] = (share[k] || 0) + DUR[i]; t += DUR[i];
  });
  const pct = Object.fromEntries(Object.entries(share).map(([k, v]) => [k, v / TOTAL * 100]));
  return { run: best, bs, be, pct, top: Math.max(...Object.values(pct)), kinds: Object.keys(share).length };
}
const f1 = (v) => v.toFixed(1);

const hx = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const mixc = (a, b, p) => { const A = hx(a), B = hx(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], p)).toString(16).padStart(2, '0')).join(''); };
function rr(x, X, Y, W, H, r) { x.beginPath(); x.roundRect(X, Y, Math.max(0, W), Math.max(0, H), Math.max(0, Math.min(r, W / 2, H / 2))); }
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.textBaseline = 'alphabetic'; x.fillText(s, X, Y); }
function card(x, X, Y, W, H, r, fill) {   // 겹쳐 그린 반투명 사각형 그림자와 면과 가는 선
  for (let i = 3; i >= 1; i--) { x.fillStyle = `rgba(60,40,20,${0.04 + (4 - i) * 0.012})`; rr(x, X - i * 0.4, Y + i * 1.2, W + i * 0.8, H + i * 1.1, r + i); x.fill(); }
  x.fillStyle = fill || PAL.surface; rr(x, X, Y, W, H, r); x.fill(); x.strokeStyle = PAL.line; x.lineWidth = 1; rr(x, X + 0.5, Y + 0.5, W - 1, H - 1, r); x.stroke();
}
function photo(x, X, Y, W, H, v) {   // 사진처럼 보이는 작은 풍경: 하늘 그라디언트, 산 두 겹, 해의 번짐
  x.save(); rr(x, X, Y, W, H, 2); x.clip();
  const g = x.createLinearGradient(0, Y, 0, Y + H); g.addColorStop(0, v ? '#9db9cf' : '#e9b98e'); g.addColorStop(0.6, v ? '#e7d6bd' : '#f4dcb4'); g.addColorStop(1, '#c9b79a'); x.fillStyle = g; x.fillRect(X, Y, W, H);
  const sg = x.createRadialGradient(X + W * 0.72, Y + H * 0.3, 0, X + W * 0.72, Y + H * 0.3, H * 0.7); sg.addColorStop(0, 'rgba(255,248,226,.9)'); sg.addColorStop(1, 'rgba(255,248,226,0)'); x.fillStyle = sg; x.fillRect(X, Y, W, H);
  [[0.62, '#5d7a73'], [0.76, '#34504a']].forEach(([f, c], i) => { x.fillStyle = c; x.beginPath(); x.moveTo(X, Y + H); x.lineTo(X, Y + H * f); x.quadraticCurveTo(X + W * (0.3 + i * 0.2), Y + H * (f - 0.3 + i * 0.12), X + W * 0.6, Y + H * f); x.quadraticCurveTo(X + W * 0.85, Y + H * (f + 0.1), X + W, Y + H * (f - 0.08)); x.lineTo(X + W, Y + H); x.fill(); });
  x.restore();
}
function wf(x, k, X, Y, W, H) {   // 배치 한 칸의 와이어프레임
  card(x, X, Y, W, H, 3, '#fffdf8'); const p = W * 0.06;
  const bars = (bx, by, bw, n, h, col) => { for (let i = 0; i < n; i++) { x.fillStyle = col; rr(x, bx, by + i * (h + 2), bw * (i === n - 1 ? 0.6 : 1), h, 1); x.fill(); } };
  if (k === 'S') { bars(X + p, Y + H * 0.14, W * 0.42, 3, H * 0.1, '#1d1a16'); photo(x, X + W * 0.58, Y + H * 0.16, W * 0.34, H * 0.42, 0); x.fillStyle = 'rgba(29,26,22,.82)'; x.fillRect(X + p, Y + H * 0.8, W - 2 * p, H * 0.09); }
  else if (k === 'F') { photo(x, X + 2, Y + 2, W - 4, H - 4, 1); x.fillStyle = 'rgba(255,255,255,.88)'; rr(x, X + p * 2, Y + H * 0.68, W * 0.5, H * 0.16, 1); x.fill(); }
  else if (k === 'T') { photo(x, X + p, Y + H * 0.14, W * 0.43, H * 0.66, 0); photo(x, X + W * 0.51, Y + H * 0.14, W * 0.43, H * 0.66, 1); bars(X + W * 0.3, Y + H * 0.86, W * 0.4, 1, H * 0.06, '#1d1a16'); }
  else if (k === 'A') { photo(x, X + 2, Y + 2, W - 4, H - 4, 0); x.strokeStyle = '#d4472b'; x.lineWidth = 1.4; rr(x, X + W * 0.5, Y + H * 0.3, W * 0.32, H * 0.3, 2); x.stroke(); x.fillStyle = '#d4472b'; x.beginPath(); x.arc(X + W * 0.5, Y + H * 0.3, 1.8, 0, 7); x.fill(); bars(X + W * 0.14, Y + H * 0.7, W * 0.3, 1, H * 0.07, '#fff'); }
  else if (k === 'L') { photo(x, X + p, Y + H * 0.12, W * 0.88, H * 0.46, 1); x.fillStyle = '#1d1a16'; x.fillRect(X + p, Y + H * 0.72, W * 0.88, 1.5); [0.12, 0.38, 0.66, 0.9].forEach((f) => { x.beginPath(); x.arc(X + W * f, Y + H * 0.72 + 0.7, 2, 0, 7); x.fill(); }); }
  else if (k === 'P') { [0.1, 0.38, 0.66].forEach((f, i) => { rr(x, X + W * f, Y + H * 0.1, W * 0.24, H * 0.8, 2); x.fillStyle = '#26221d'; x.fill(); photo(x, X + W * f + 1.5, Y + H * 0.16, W * 0.24 - 3, H * 0.68, i % 2); }); }
  else { x.fillStyle = '#26221d'; rr(x, X + 2, Y + 2, W - 4, H - 4, 2); x.fill(); T(x, '01', X + W / 2, Y + H * 0.62, H * 0.4, '#fbf8f1', 400, 'center', HAN); x.fillStyle = '#d4472b'; x.fillRect(X + W * 0.32, Y + H * 0.74, W * 0.36, 1.6); }
}
function drawStrip(x, code, X, Y, W, H, prog, named, st, warn) {   // 장면 띠
  let t = 0; const px = (v) => X + v / TOTAL * W;
  [...code].forEach((k, i) => {
    const a = px(t), b = px(t + DUR[i]), vis = Math.max(0, Math.min(1, (prog * TOTAL - t) / DUR[i]));
    if (vis > 0) {
      const col = named ? COL[k] : '#b0a893', w = (b - a - 1) * vis;
      x.fillStyle = col; x.fillRect(a, Y, w, H);
      const hg = x.createLinearGradient(0, Y, 0, Y + H); hg.addColorStop(0, 'rgba(255,255,255,.22)'); hg.addColorStop(1, 'rgba(0,0,0,.10)'); x.fillStyle = hg; x.fillRect(a, Y, w, H);
      if (warn && SA.pct[k] > SHARE_MAX) { x.fillStyle = 'rgba(180,35,24,.72)'; x.fillRect(a, Y, w, H); }
      if (warn && DUR[i] > RUN_MAX) { x.strokeStyle = BAD; x.lineWidth = 2; x.strokeRect(a + 1, Y + 1, w - 2, H - 2); }
    }
    t += DUR[i];
  });
  if (st && named && prog >= 1) {   // 가장 긴 연속 구간을 괄호로
    const a = px(st.bs), b = px(st.be), over = st.run > RUN_MAX, col = over ? BAD : GOOD;
    x.strokeStyle = col; x.lineWidth = 1.5; x.beginPath(); x.moveTo(a + 0.5, Y + H + 3); x.lineTo(a + 0.5, Y + H + 8); x.lineTo(b - 0.5, Y + H + 8); x.lineTo(b - 0.5, Y + H + 3); x.stroke();
    T(x, `가장 긴 연속 ${f1(st.run)}초`, Math.min(Math.max((a + b) / 2, X + 70), X + W - 70), Y + H + 19, 11, col, 700, 'center', MONO);
  }
}

const SB = stats(BEFORE), SA = stats(AFTER);
const CAP = ['0  틀 이름을 안 붙인 편, 장면 19개', '1  장면마다 배치 이름을 붙인다', '2  같은 배치가 이어진 길이를 센다', '3  장면마다 바꿔 배정한다', '4  같은 세 칸을 다시 센다'];
const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 4,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(7), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0);
    const cap = el('div', null, sp);   // 이름표(caption-bl): 왼쪽 아래, 배경 없이, 위에 1px 선
    Object.assign(cap.style, { position: 'absolute', left: '20px', bottom: '10px', paddingTop: '.3em', borderTop: `1px solid ${PAL.line}`, font: "500 12px/1.3 'JetBrains Mono',monospace", color: PAL.muted, zIndex: '4', whiteSpace: 'nowrap', minWidth: '260px' });
    return { main, cap, gc };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 0 : (lv == null ? 4 : lv), after = L >= 3;
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.setLineDash([]);
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'multiply'; x.globalAlpha = 0.08;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(s.gc, gx0, gy0, 128, 128);
    x.restore();
    // 배치 이름표 일곱 칸
    const lk = L >= 1 ? E.outC(seg(t, L === 1 ? 0.2 : 0, L === 1 ? 0.9 : 0.01)) : 0;
    KINDS.forEach(([k, n], i) => {
      const X0 = 20 + i * 86, used = L >= 4 ? SA.pct[k] > 0 : (L >= 3 ? SA.pct[k] > 0 || k === 'S' : k === 'S');
      x.save(); x.globalAlpha = L >= 1 ? (L >= 3 || k === 'S' ? 0.25 + 0.75 * lk : 0.45 * lk + 0.15) : 0.35;
      wf(x, k, X0, 12, 64, 36); x.restore();
      x.fillStyle = L >= 1 ? COL[k] : '#b0a893'; x.fillRect(X0, 53, 8, 8);
      T(x, n, X0 + 12, 61, 10, L >= 1 ? PAL.ink : MUTED2, 600);
    });
    // 띠 둘
    const SX = 20, SW = 600, p1 = E.inOutC(seg(t, 0.15, 2.0)), named1 = L >= 1;
    T(x, '전  제작 기록의 한 편, 장면 19개', SX, 80, 12, PAL.ink, 700);
    drawStrip(x, BEFORE, SX, 86, SW, 30, p1, named1, L >= 2 ? SB : null, false);
    T(x, after ? '후  이웃과 다른 배치로 바꿔 배정' : '후  3단계에서 배정한다', SX, 160, 12, after ? PAL.ink : MUTED2, after ? 700 : 500);
    if (after) { const p2 = L === 3 ? E.inOutC(seg(t, 0.2, 2.2)) : 1; drawStrip(x, AFTER, SX, 166, SW, 30, p2, true, L >= 3 ? SA : null, true); }
    else { x.fillStyle = 'rgba(29,26,22,.06)'; rr(x, SX, 166, SW, 30, 3); x.fill(); }
    // 세 칸: 연속 길이, 한 배치의 비율, 종류 수
    const CY = 224, CH = 98;
    const cells = [{ x: 20, w: 192 }, { x: 224, w: 192 }, { x: 428, w: 192 }];
    cells.forEach((c) => card(x, c.x, CY, c.w, CH, 8));
    const show = L >= 2, k2 = L === 2 ? E.outC(seg(t, 0.4, 1.1)) : 1;
    const num = (b, f, fmt, ok) => (L >= 4 ? [`${fmt(b)} → ${fmt(f)}`, ok(f) ? GOOD : BAD] : [fmt(b), ok(b) ? GOOD : BAD]);
    const big = L >= 4 ? 17 : 24;
    const cur = L >= 4 ? SA : SB;
    // 칸 1
    T(x, '같은 배치가 이어진 길이', 32, CY + 20, 12, PAL.ink, 700); T(x, `기준 ${RUN_MAX}초 이하`, 32, CY + 36, 11, MUTED2, 500, 'left', MONO);
    x.save(); x.globalAlpha = show ? 0.2 + 0.8 * k2 : 1;
    if (show) { const [tx, col] = num(SB.run, SA.run, (v) => `${f1(v)}초`, (v) => v <= RUN_MAX); T(x, tx, 32, CY + 66, big, col, 700, 'left', MONO); } else T(x, '—', 32, CY + 66, 24, MUTED2, 600, 'left', MONO);
    x.restore();
    const bw = 168, bv = cur.run / TOTAL * bw;
    x.fillStyle = 'rgba(29,26,22,.08)'; rr(x, 32, CY + 78, bw, 8, 4); x.fill();
    if (show) { x.fillStyle = cur.run > RUN_MAX ? BAD : GOOD; rr(x, 32, CY + 78, Math.max(2, bv * k2), 8, 4); x.fill(); }
    x.fillStyle = PAL.ink; x.fillRect(32 + RUN_MAX / TOTAL * bw - 0.5, CY + 75, 1.5, 14);
    // 칸 2
    T(x, '한 배치가 차지한 비율', 236, CY + 20, 12, PAL.ink, 700); T(x, `기준 ${SHARE_MAX}% 이하`, 236, CY + 36, 11, MUTED2, 500, 'left', MONO);
    x.save(); x.globalAlpha = show ? 0.2 + 0.8 * k2 : 1;
    if (show) { const [tx, col] = num(SB.top, SA.top, (v) => `${v.toFixed(0)}%`, (v) => v <= SHARE_MAX); T(x, tx, 236, CY + 66, big, col, 700, 'left', MONO); } else T(x, '—', 236, CY + 66, 24, MUTED2, 600, 'left', MONO);
    x.restore();
    x.fillStyle = 'rgba(29,26,22,.08)'; rr(x, 236, CY + 78, bw, 8, 4); x.fill();
    if (show) { x.fillStyle = cur.top > SHARE_MAX ? BAD : GOOD; rr(x, 236, CY + 78, Math.max(2, cur.top / 100 * bw * k2), 8, 4); x.fill(); }
    x.fillStyle = PAL.ink; x.fillRect(236 + SHARE_MAX / 100 * bw - 0.5, CY + 75, 1.5, 14);
    // 칸 3
    T(x, '배치 종류 수', 440, CY + 20, 12, PAL.ink, 700); T(x, `기준 ${KINDS_MIN}종 이상`, 440, CY + 36, 11, MUTED2, 500, 'left', MONO);
    x.save(); x.globalAlpha = show ? 0.2 + 0.8 * k2 : 1;
    if (show) { const [tx, col] = num(SB.kinds, SA.kinds, (v) => `${v}종`, (v) => v >= KINDS_MIN); T(x, tx, 440, CY + 66, big, col, 700, 'left', MONO); } else T(x, '—', 440, CY + 66, 24, MUTED2, 600, 'left', MONO);
    x.restore();
    KINDS.forEach(([k, n, c], i) => { const on = show && (cur.pct[k] > 0); x.fillStyle = on ? c : 'rgba(29,26,22,.12)'; rr(x, 440 + i * 24, CY + 76, 18, 12, 3); x.fill(); });
    s.cap.textContent = CAP[L];
  },
};
export default demo;
