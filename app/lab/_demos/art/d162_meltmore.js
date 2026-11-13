/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/shader-glsl-sdf/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, rng, canvas, rr } from "./helpers.js";

// 셰이더는 '화면의 모든 픽셀이 각자 같은 식으로 색을 계산하는 작은 프로그램'이다. 여기서는 그 식을 픽셀마다 직접 계산해 보여 준다.
// 물결 = 노이즈를 여러 크기로 겹친 fbm, 블롭 = 원까지의 거리(SDF)를 부드럽게 합친 모양, 가장자리 빛 = 프레넬.
const PAL = { bg0: '#f4efe4', bg1: '#e9e2d3', ink: '#1d1a16', muted: '#6b6458', accent: '#d4472b', accent2: '#2b5d8a', surface: '#fbf8f1', line: '#cfc6b4' };
const OCT = 4;          // fbm 에서 노이즈를 겹치는 횟수(옥타브)
const FREQ = 6;         // 물결 줄무늬 밀도
const BLEND = 70;       // 블롭끼리 부드럽게 합쳐지는 폭(px)
const RW = 224, RH = 126, SC = 640 / 224;   // 계산 해상도(224x126) → 화면(640x360)으로 확대
const R1 = 46, R2 = 38, R3 = 32;      // 원 세 개의 반지름(px)

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mixc = (a, b, p) => { const x = rgb(a), y = rgb(b); return x.map((v, i) => v + (y[i] - v) * p); };
const hex = (a) => '#' + a.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const rgba = (h, al) => { const [r, g, b] = rgb(h); return `rgba(${r},${g},${b},${al})`; };
const WC0 = mixc(PAL.accent2, PAL.ink, .5), WC1 = mixc(PAL.accent2, PAL.surface, .35), WC2 = mixc(PAL.accent2, PAL.surface, .8);   // 물결 색: 깊은 곳, 중간, 마루 쪽
const SUR = rgb(PAL.surface), ACC = rgb(PAL.accent), ACC_RIM = mixc(PAL.accent, PAL.surface, .35);
const T = new Float32Array(64 * 64); { const r = rng(21); for (let i = 0; i < T.length; i++) T[i] = r(); }
const sm5 = (x) => x * x * x * (x * (x * 6 - 15) + 10);
function vn(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = sm5(x - ix), fy = sm5(y - iy), i0 = ix & 63, j0 = iy & 63, i1 = (ix + 1) & 63, j1 = (iy + 1) & 63;
  const a = T[j0 * 64 + i0], b = T[j0 * 64 + i1], c = T[j1 * 64 + i0], d = T[j1 * 64 + i1];
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}
function fbm(x, y) { let s = 0, amp = .5, f = 1; for (let o = 0; o < OCT; o++) { s += amp * vn(x * f, y * f); f *= 2; amp *= .5; } return s / (1 - Math.pow(.5, OCT)) * .5 + .0; }
let WR = 0, WG = 0, WB = 0;
function water(X, Y, t) {
  const u = X / 360, v = Y / 360, w = fbm(u * 1.6 + t * .07 + 3, v * 1.6 + t * .05 + 7);
  const b = .5 + .5 * Math.sin(FREQ * (v * .8 + w * 1.3) + t * .8);
  let m = b * .7 + w * .6 - .1; m = m < 0 ? 0 : m > 1 ? 1 : m;
  const rid = Math.pow(1 - Math.abs(2 * b - 1), 8) * .5;
  const A = m < .5 ? WC0 : WC1, B = m < .5 ? WC1 : WC2, k = m < .5 ? m * 2 : (m - .5) * 2, q = Math.min(1, rid * 1.5);
  WR = (A[0] + (B[0] - A[0]) * k) * (1 - q) + SUR[0] * q; WG = (A[1] + (B[1] - A[1]) * k) * (1 - q) + SUR[1] * q; WB = (A[2] + (B[2] - A[2]) * k) * (1 - q) + SUR[2] * q;
}
const smin = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * .25; };
function blobs(t) { return [[320 + 62 * Math.cos(.8 * t), 185 + 34 * Math.sin(1.1 * t), R1], [320 + 70 * Math.cos(.8 * t + 2.1), 185 + 36 * Math.sin(1.1 * t + 2.1), R2], [320 + 66 * Math.cos(.8 * t + 4.2), 185 + 30 * Math.sin(1.1 * t + 4.2), R3]]; }
const sdf = (B, X, Y) => smin(smin(Math.hypot(X - B[0][0], Y - B[0][1]) - B[0][2], Math.hypot(X - B[1][0], Y - B[1][1]) - B[1][2], BLEND), Math.hypot(X - B[2][0], Y - B[2][1]) - B[2][2], BLEND);
const tagDraw = (c, text) => {      // 오른쪽 위 직각 이름표: 왼쪽에 accent 줄
  c.font = "600 12px 'IBM Plex Sans KR',sans-serif"; const w = c.measureText(text).width + 26, x = 640 - 16 - w;
  rr(c, x, 14, w, 26, 2); c.fillStyle = rgba(PAL.surface, .96); c.fill(); c.strokeStyle = PAL.line; c.lineWidth = 1; c.stroke();
  c.fillStyle = PAL.accent; c.fillRect(x, 14, 3, 26);
  c.fillStyle = PAL.ink; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillText(text, x + 14, 27.5);
};
const LX = -.5, LY = -.62, LZ = .6, LN = Math.hypot(LX, LY, LZ);

const demo = {
  dur: 4, rest: 3, noCompare: false, levels: 4,
  mount(sp) {
    sp.style.background = PAL.bg1;
    const c = canvas(sp), buf = document.createElement('canvas'); buf.width = RW; buf.height = RH;
    const bx = buf.getContext('2d'), im = bx.createImageData(RW, RH);
    return { c, buf, bx, im, u32: new Uint32Array(im.data.buffer) };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv - 1);   // 0 = 평범한 그라디언트 + 단색 원, 1 = + fbm 물결, 2 = + SDF 블롭, 3 = + 법선·프레넬·굴절
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, 640, 360);
    let cap = '';
    if (L === 0) {
      const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, hex(WC1)); g.addColorStop(1, hex(WC0)); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
      c.beginPath(); c.arc(320, 185, 62, 0, 6.2832); c.fillStyle = PAL.accent; c.fill();
      cap = '색 하나씩 칠한 그림 — 계산식이 없다';
    } else {
      const D = s.u32, B = blobs(t); let k = 0;
      for (let y = 0; y < RH; y++) for (let x = 0; x < RW; x++, k++) {
        const X = (x + .5) * SC, Y = (y + .5) * SC;
        let d = 9999;
        if (L >= 2) d = sdf(B, X, Y);
        let r, g, b;
        if (L >= 3 && d < 0) {         // 블롭 안쪽: 법선(= 거리 기울기)로 굴절·빛·프레넬 계산
          const e = 1.2, gx = (sdf(B, X + e, Y) - sdf(B, X - e, Y)) / (2 * e), gy = (sdf(B, X, Y + e) - sdf(B, X, Y - e)) / (2 * e);
          const tin = Math.min(1, -d / 26), nz0 = tin + .06, kk = 1 - tin;
          const nl = Math.hypot(gx * kk, gy * kk, nz0), nx = gx * kk / nl, ny = gy * kk / nl, nz = nz0 / nl;
          water(X + nx * 26, Y + ny * 26, t);               // 굴절: 물결을 법선 방향으로 밀어서 본다
          const dif = Math.max(0, (nx * LX + ny * LY + nz * LZ) / LN);
          const hx = LX / LN, hy = LY / LN, hz = LZ / LN + 1, hl = Math.hypot(hx, hy, hz), spec = Math.pow(Math.max(0, (nx * hx + ny * hy + nz * hz) / hl), 36);
          const fr = Math.pow(1 - nz, 3);                      // 프레넬: 비스듬히 볼수록(가장자리) 더 많이 반사
          const mixO = .6;
          r = (WR * (1 - mixO) + ACC[0] * mixO) * (.5 + .65 * dif) + spec * 200 + fr * 130;
          g = (WG * (1 - mixO) + ACC[1] * mixO) * (.5 + .65 * dif) + spec * 190 + fr * 150;
          b = (WB * (1 - mixO) + ACC[2] * mixO) * (.5 + .65 * dif) + spec * 170 + fr * 170;
        } else {
          let sh = 1;
          if (L >= 3 && d < 30) { const ds = sdf(B, X - 7, Y - 11); sh = 1 - .4 * Math.max(0, Math.min(1, (14 - ds) / 20)); }
          water(X, Y, t); r = WR * sh; g = WG * sh; b = WB * sh;
          if (L === 2 && d < 1.5) { const al = Math.max(0, Math.min(1, .5 - d / 3)); const rim = d > -4 ? .78 : 1; r = r * (1 - al) + ACC[0] * rim * al; g = g * (1 - al) + ACC[1] * rim * al; b = b * (1 - al) + ACC[2] * rim * al; }
          if (L >= 3 && d < 1.5) { const al = Math.max(0, Math.min(1, .5 - d / 3)); r = r * (1 - al) + ACC_RIM[0] * al; g = g * (1 - al) + ACC_RIM[1] * al; b = b * (1 - al) + ACC_RIM[2] * al; }
        }
        D[k] = 0xff000000 | (Math.min(255, b) << 16) | (Math.min(255, g) << 8) | Math.min(255, r);
      }
      s.bx.putImageData(s.im, 0, 0);
      c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high'; c.drawImage(s.buf, 0, 0, 640, 360);
      cap = ['', `fbm 노이즈 ${OCT}옥타브 · 줄무늬 밀도 ${FREQ}`, `d = smin(원1, 원2, 원3, k=${BLEND})  ·  d < 0 이면 블롭 안쪽`, `+ 법선 n = d 의 기울기 · 프레넬(가장자리일수록 밝게) · 굴절`][L];
    }
    c.fillStyle = rgba(PAL.surface, .86); c.fillRect(0, 330, 640, 30); c.fillStyle = PAL.line; c.fillRect(0, 330, 640, 1);
    c.font = "500 13px 'JetBrains Mono',monospace"; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillStyle = PAL.ink; c.fillText(cap, 18, 345);
    tagDraw(c, ['연출 전: 평범한 그라디언트 + 단색 원', '1단계: fbm 노이즈로 만든 물결 무늬', '2단계: + 거리(SDF) 3개를 합친 블롭', '3단계: + 법선 · 프레넬 · 굴절 · 그림자'][L]);
  },
};
export default demo;
