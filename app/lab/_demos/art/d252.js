/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/seamless-tile-blend/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 코드로 그린 예시 그림이다. 한쪽으로 밝기가 기운 잔디 타일을 만들고, 제작 도구와 같은 방식(반 칸 굴려 가장자리를 가운데 내용으로 바꾸기)으로 가로, 세로 차례로 섞는다.
// 이음매 지표는 맞은편 가장자리 픽셀 차이의 평균을 255로 나눈 값이다(0 에 가까울수록 이음매가 없다). 화면의 수치는 모두 코드가 그린 타일에서 센 값이다.
const SLOPE = 0.5;        // 타일 왼쪽과 오른쪽의 밝기 차이(50%). 클수록 이음매가 또렷하다
const LANDMARK = 0;       // 눈에 띄는 큰 돌의 개수(0 또는 1)
const N = 252;            // 타일 한 변(px). 화면에서는 절반 크기로 2×2 로 깐다
const PAL = { bg0: '#e6f2ec', bg1: '#d4e8de', ink: '#0f2a22', muted: '#4f6e63', accent: '#0f9d6b', accent2: '#c2410c', surface: '#f6fbf8', line: 'rgba(15,42,34,.2)' };
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif';
const BS = N, B1X = 44, B2X = 344, BY = 50;   // 2×2 한 장의 크기와 놓이는 자리(화면 px)

function noise2(seed, gx, gy) {         // 부드러운 값 잡음(0~1). 타일이 이어지게 하는 처리는 일부러 하지 않는다
  const r = rng(seed), g = new Float32Array((gx + 1) * (gy + 1)); for (let i = 0; i < g.length; i++) g[i] = r();
  return (u, v) => {
    const x = Math.min(u, 0.9999) * gx, y = Math.min(v, 0.9999) * gy, x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0;
    const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy), W1 = gx + 1;
    const a = g[y0 * W1 + x0], b = g[y0 * W1 + x0 + 1], c = g[(y0 + 1) * W1 + x0], d = g[(y0 + 1) * W1 + x0 + 1];
    return lerp(lerp(a, b, sx), lerp(c, d, sx), sy);
  };
}
function makeTile() {                   // Uint8ClampedArray RGB(N×N×3). 잔디 질감에 밝기 기울기를 곱한다
  const n1 = noise2(11, 3, 3), n2 = noise2(12, 7, 7), n3 = noise2(13, 15, 15), nb = noise2(14, 90, 16), ns = noise2(15, 120, 120);
  const out = new Float32Array(N * N * 3), D = [58, 122, 52], Lt = [158, 204, 84];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const u = x / N, v = y / N;
    let q = 0.45 * n1(u, v) + 0.3 * n2(u, v) + 0.25 * n3(u, v);
    q = Math.min(1, Math.max(0, q * 0.7 + nb(u, v) * 0.45 - 0.08));
    let c = [lerp(D[0], Lt[0], q), lerp(D[1], Lt[1], q), lerp(D[2], Lt[2], q)];
    const sp = ns(u, v); if (sp < 0.2) c = c.map((w) => w * 0.78);      // 짙은 점
    if (LANDMARK >= 1) {                                                // 눈에 띄는 큰 돌 하나
      const cx = 0.3 * N, cy = 0.62 * N, rr = 0.13 * N, d = Math.hypot(x - cx, y - cy);
      const sh = Math.hypot(x - cx - 7, y - cy - 8);
      if (sh < rr * 1.05 && d >= rr) c = c.map((w) => w * 0.55);        // 그림자
      if (d < rr) { const l = 0.55 + 0.45 * Math.min(1, Math.max(0, 1 - ((x - cx) + (y - cy)) / (2.2 * rr))); const g = 175 * l; c = [g, g * 0.98, g * 0.94]; }
    }
    const m = 1 + SLOPE * (u - 0.5) + SLOPE * 0.5 * (v - 0.5);        // 왼쪽이 어둡고 오른쪽이 밝다
    const i = (y * N + x) * 3; out[i] = c[0] * m; out[i + 1] = c[1] * m; out[i + 2] = c[2] * m;
  }
  return out;
}
const toU8 = (f) => { const o = new Uint8ClampedArray(f.length); for (let i = 0; i < f.length; i++) o[i] = f[i] + 0.5; return o; };
function seamGaps(u8) {                 // 맞은편 가장자리 차이(가로, 세로)를 0~1 로
  let h = 0, v = 0;
  for (let y = 0; y < N; y++) for (let c = 0; c < 3; c++) h += Math.abs(u8[(y * N) * 3 + c] - u8[(y * N + N - 1) * 3 + c]);
  for (let x = 0; x < N; x++) for (let c = 0; c < 3; c++) v += Math.abs(u8[x * 3 + c] - u8[((N - 1) * N + x) * 3 + c]);
  return { h: h / (N * 3) / 255, v: v / (N * 3) / 255, score: (h / (N * 3) + v / (N * 3)) / 2 / 255 };
}
function weight(i) { const x = Math.abs(i - (N - 1) / 2) / ((N - 1) / 2); return x * x * (3 - 2 * x); }   // 가운데 0, 가장자리 1
function blendAxis(f, axis) {           // 반 칸 굴린 사본과 가중 평균
  const out = new Float32Array(f.length), half = N >> 1;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const sx = axis === 1 ? (x - half + N) % N : x, sy = axis === 0 ? (y - half + N) % N : y, w = weight(axis === 1 ? x : y);
    for (let c = 0; c < 3; c++) out[(y * N + x) * 3 + c] = f[(y * N + x) * 3 + c] * (1 - w) + f[(sy * N + sx) * 3 + c] * w;
  }
  return out;
}
function toCanvas(u8) {
  const c = document.createElement('canvas'); c.width = c.height = N; const x = c.getContext('2d'), id = x.createImageData(N, N);
  for (let i = 0, j = 0; i < u8.length; i += 3, j += 4) { id.data[j] = u8[i]; id.data[j + 1] = u8[i + 1]; id.data[j + 2] = u8[i + 2]; id.data[j + 3] = 255; }
  x.putImageData(id, 0, 0); return c;
}
let GRAIN = null;
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function block(x, cv, bx, by, alpha) {  // 타일 2×2
  x.save(); x.globalAlpha = alpha;
  x.fillStyle = 'rgba(15,42,34,.16)'; x.fillRect(bx + 3, by + 6, BS, BS); x.fillStyle = 'rgba(15,42,34,.1)'; x.fillRect(bx + 1, by + 3, BS, BS);
  for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) x.drawImage(cv, bx + i * BS / 2, by + j * BS / 2, BS / 2, BS / 2);
  x.strokeStyle = PAL.line; x.lineWidth = 1; x.strokeRect(bx + 0.5, by + 0.5, BS - 1, BS - 1);
  x.restore();
}
const STEP = ['보정 전 2×2', '맞은편 끝 차이를 잰다', '가로로 먼저 섞는다', '이어서 세로로 섞는다'];

const demo = {
  dur: 3.8, rest: 3.8, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(47), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const f0 = makeTile(), f1 = blendAxis(f0, 1), f2 = blendAxis(f1, 0);
    const u0 = toU8(f0), u1 = toU8(f1), u2 = toU8(f2);
    const pill = el('div', null, sp);   // 이름표(pill): 알약 모양
    Object.assign(pill.style, { position: 'absolute', left: '12px', top: '10px', background: PAL.surface, border: `1px solid ${PAL.line}`, borderRadius: '999px', padding: '4px 12px', font: `600 12px/1.3 ${SANS}`, color: PAL.ink, zIndex: '4' });
    return { main, pill, raw: toCanvas(u0), h: toCanvas(u1), hv: toCanvas(u2), g0: seamGaps(u0), g1: seamGaps(u1), g2: seamGaps(u2) };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 0 : (lv == null ? 3 : lv);
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.12;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();

    const slide = a ? E.inOutC(seg(t, 0.2, 1.0)) : 0;                 // 보정 전 2×2 가 왼쪽으로 비켜 선다
    const b1x = lerp(194, B1X, slide);
    block(x, s.raw, b1x, BY, 1);
    // 레벨 1: 타일 경계선과 끝 차이
    if (L >= 1) {
      const al = E.outC(seg(t, 1.0, 1.7));
      x.save(); x.globalAlpha = al; x.strokeStyle = PAL.accent2; x.lineWidth = 2; x.setLineDash([6, 4]);
      x.beginPath(); x.moveTo(b1x + BS / 2, BY); x.lineTo(b1x + BS / 2, BY + BS); x.moveTo(b1x, BY + BS / 2); x.lineTo(b1x + BS, BY + BS / 2); x.stroke(); x.restore();
    }
    // 보정 결과
    let stageC = null, g = s.g0;
    if (L >= 2) { stageC = s.h; g = s.g1; }
    if (L >= 3 && t >= 2.4) { stageC = s.hv; g = s.g2; }
    const fa = L >= 2 ? E.outC(seg(t, 1.6, 2.3)) : 0;
    if (L >= 2) {
      const base = (L >= 3) ? s.h : s.h;
      block(x, base, B2X, BY, fa);
      if (L >= 3) block(x, s.hv, B2X, BY, E.outC(seg(t, 2.4, 3.2)));
      const ax = 304;                                                  // 가운데 화살표
      x.save(); x.globalAlpha = fa; x.strokeStyle = PAL.accent; x.lineWidth = 2.5; x.lineCap = 'round'; x.lineJoin = 'round';
      x.beginPath(); x.moveTo(ax - 8, BY + 118); x.lineTo(ax + 24, BY + 118); x.moveTo(ax + 15, BY + 109); x.lineTo(ax + 25, BY + 118); x.lineTo(ax + 15, BY + 127); x.stroke(); x.restore();
    }
    // 캡션
    const f2 = (v) => v.toFixed(2);
    const cap = (X, gg, tt, al, col) => {
      x.save(); x.globalAlpha = al;
      T(x, `이음매 지표 ${f2(gg.score)}`, X, BY + BS + 22, 14, col, 700, 'left', SANS);
      T(x, `가로 끝 차이 ${f2(gg.h)}  세로 끝 차이 ${f2(gg.v)}`, X, BY + BS + 40, 11, PAL.muted, 500, 'left', MONO);
      x.restore();
    };
    cap(b1x, s.g0, '', 1, PAL.accent2);
    if (L >= 2) { const gg = (L >= 3 && t >= 2.8) ? s.g2 : s.g1; cap(B2X, gg, '', fa, (gg.score < 0.05) ? PAL.accent : PAL.accent2); }
    s.pill.textContent = STEP[L];
  },
};
export default demo;
