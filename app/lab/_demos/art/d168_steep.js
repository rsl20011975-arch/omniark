/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/pointcloud-terrain/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, rng, canvas, rr } from "./helpers.js";

// 점 구름 = 3D 점(x, y, z)의 모음. 지형 = 높이 지도(흑백 그림의 밝기)를 점의 높이 y 로 바꾼 것. 점을 가로줄로 이으면 지형의 면이 된다.
const AMP = 2.2;          // 높이 배율(높이 지도 값 1 당 올라가는 높이)
const RES = 72;         // 높이 지도 한 변의 칸 수 = 점 한 줄의 개수
const OCT = 4;          // 높이 지도를 만드는 노이즈 겹침 횟수
const CAM_D = 5.2;      // 카메라까지 거리
const PITCH = .55;      // 카메라가 내려다보는 각도(rad)
const SWAY = .32;       // 카메라가 좌우로 흔들리는 폭(rad)
const F = 430, CX = 320, CY = 186;
const RAMP = [[28, 64, 150], [38, 130, 190], [60, 190, 170], [150, 214, 110], [244, 214, 140], [255, 255, 255]];
const col = (h) => { const x = Math.max(0, Math.min(.9999, h)) * (RAMP.length - 1), i = Math.floor(x), f = x - i; return RAMP[i].map((v, k) => v + (RAMP[i + 1][k] - v) * f); };
const T = new Float32Array(64 * 64); { const r = rng(5); for (let i = 0; i < T.length; i++) T[i] = r(); }
const sm5 = (x) => x * x * x * (x * (x * 6 - 15) + 10);
function vn(x, y) { const ix = Math.floor(x), iy = Math.floor(y), fx = sm5(x - ix), fy = sm5(y - iy), i0 = ix & 63, j0 = iy & 63, i1 = (ix + 1) & 63, j1 = (iy + 1) & 63; const a = T[j0 * 64 + i0], b = T[j0 * 64 + i1], c = T[j1 * 64 + i0], d = T[j1 * 64 + i1]; return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy; }
function height(u, v) { let s = 0, amp = .5, f = 1, n = 0; for (let o = 0; o < OCT; o++) { s += amp * vn(u * 3.4 * f + 1.7, v * 3.4 * f + 4.1); n += amp; f *= 2; amp *= .5; } const h = s / n, x = Math.max(0, Math.min(1, (h - .3) / .45)); return x * x * (3 - 2 * x); }
const pillDraw = (c, text) => {
  c.font = "500 14px 'IBM Plex Sans KR',sans-serif"; const w = c.measureText(text).width + 26;
  rr(c, 16, 14, w, 28, 14); c.fillStyle = 'rgba(8,10,20,.78)'; c.fill();
  c.fillStyle = '#fff'; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillText(text, 29, 29);
};

const demo = {
  dur: 4.6, rest: 4.0, noCompare: false, levels: 4,
  mount(sp) {
    sp.style.background = '#0b0f1a';
    const c = canvas(sp), H = new Float32Array(RES * RES);
    for (let j = 0; j < RES; j++) for (let i = 0; i < RES; i++) H[j * RES + i] = height(i / (RES - 1), j / (RES - 1));
    const ins = document.createElement('canvas'); ins.width = ins.height = RES; const ix = ins.getContext('2d'), im = ix.createImageData(RES, RES);
    for (let j = 0; j < RES; j++) for (let i = 0; i < RES; i++) { const v = Math.round(H[(RES - 1 - j) * RES + i] * 255), k = (j * RES + i) * 4; im.data[k] = im.data[k + 1] = im.data[k + 2] = v; im.data[k + 3] = 255; }
    ix.putImageData(im, 0, 0);
    const gr = document.createElement('canvas'); gr.width = gr.height = 128; const gx = gr.getContext('2d'), gi = gx.createImageData(128, 128), q = rng(3);
    for (let i = 0; i < 128 * 128; i++) { const v = q() > .5 ? 255 : 0; gi.data[i * 4] = gi.data[i * 4 + 1] = gi.data[i * 4 + 2] = v; gi.data[i * 4 + 3] = 12 + q() * 12; }
    gx.putImageData(gi, 0, 0);
    return { c, H, ins, gr, X: new Float32Array(RES * RES), Y: new Float32Array(RES * RES), D: new Float32Array(RES * RES) };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv - 1);   // 0 = 높이 0 인 점 격자, 1 = 높이 지도만큼 솟음, 2 = + 높이별 색·깊이별 크기, 3 = + 줄을 이은 면(숨은선 처리)
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, 640, 360);
    let g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, '#0b0f1a'); g.addColorStop(1, '#161f3a'); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
    const yaw = SWAY * Math.sin(.9 * t + .8), cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(PITCH), sp = Math.sin(PITCH), { X, Y, D, H } = s;
    for (let j = 0; j < RES; j++) {
      const v = j / (RES - 1), rise = L === 0 ? 0 : E.outC(seg(t, .3 + .8 * v, 1.1 + .8 * v));
      for (let i = 0; i < RES; i++) {
        const k = j * RES + i, wx = (i / (RES - 1) - .5) * 3.4, wz = (v - .5) * 3.4, wy = AMP * (H[k] - .35) * .9 * rise;
        const x1 = wx * cy + wz * sy, z1 = -wx * sy + wz * cy, y2 = wy * cp + z1 * sp, z2 = -wy * sp + z1 * cp, pr = F / (CAM_D + z2);
        X[k] = CX + x1 * pr; Y[k] = CY - y2 * pr; D[k] = z2;
      }
    }
    if (L >= 3) {          // 먼 줄부터 그리며, 줄 아래를 배경색으로 채워 앞줄이 뒷줄을 가리게 한다(숨은선 처리)
      for (let j = RES - 1; j >= 0; j--) {
        c.beginPath(); c.moveTo(X[j * RES], 400); for (let i = 0; i < RES; i++) c.lineTo(X[j * RES + i], Y[j * RES + i]); c.lineTo(X[j * RES + RES - 1], 400); c.closePath();
        const hm = H[j * RES + (RES >> 1)], dk = 1 - j / RES * .5; c.fillStyle = `rgb(${12 + 16 * hm | 0},${18 + 20 * hm | 0},${40 + 30 * hm | 0})`; c.fill();
        const P = Array.from({ length: 6 }, () => new Path2D());
        for (let i = 0; i < RES - 1; i++) { const k = j * RES + i, cls = Math.min(5, Math.floor((H[k] + H[k + 1]) / 2 * 6)); P[cls].moveTo(X[k], Y[k]); P[cls].lineTo(X[k + 1], Y[k + 1]); }
        c.lineWidth = 1; P.forEach((p, ci) => { const cc = col((ci + .5) / 6); c.strokeStyle = `rgba(${cc[0] | 0},${cc[1] | 0},${cc[2] | 0},.9)`; c.stroke(p); });
      }
    }
    // 점
    const G = 2 * 12, B = Array.from({ length: G }, () => []);
    for (let k = 0; k < RES * RES; k++) { const near = D[k] < 0 ? 1 : 0, cls = Math.min(11, Math.floor(H[k] * 12)); B[cls * 2 + near].push(k); }
    c.globalCompositeOperation = L >= 3 ? 'source-over' : 'lighter';
    for (let b = 0; b < G; b++) {
      const cls = b >> 1, near = b & 1, cc = L >= 2 ? col((cls + .5) / 12) : [205, 224, 255], sz = L === 0 ? 1.6 : (L >= 2 ? (near ? 2.6 : 1.4) : 2);
      c.fillStyle = L >= 3 ? `rgb(${cc[0] | 0},${cc[1] | 0},${cc[2] | 0})` : `rgba(${cc[0] | 0},${cc[1] | 0},${cc[2] | 0},${L === 0 ? .5 : .85})`;
      for (const k of B[b]) c.fillRect(X[k] - sz / 2, Y[k] - sz / 2, sz, sz);
    }
    c.globalCompositeOperation = 'source-over';
    if (L >= 1) {          // 높이 지도(흑백 그림)와 지금 솟아오르는 줄
      rr(c, 524, 52, 100, 112, 8); c.fillStyle = 'rgba(8,10,20,.74)'; c.fill();
      c.imageSmoothingEnabled = false; c.drawImage(s.ins, 532, 60, 84, 84); c.imageSmoothingEnabled = true;
      c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 1; c.strokeRect(532.5, 60.5, 83, 83);
      const front = Math.max(0, Math.min(1, (t - .3) / .8)); c.strokeStyle = '#ffb36b'; c.lineWidth = 1.5; c.beginPath(); const yy = 144 - front * 84; c.moveTo(532, yy); c.lineTo(616, yy); c.stroke();
      c.font = "500 11px 'IBM Plex Sans KR',sans-serif"; c.fillStyle = 'rgba(255,255,255,.9)'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('높이 지도(흰색 = 높음)', 574, 154);
    }
    c.fillStyle = c.createPattern(s.gr, 'repeat'); c.fillRect(0, 0, 640, 360);
    c.fillStyle = 'rgba(8,10,20,.62)'; c.fillRect(0, 330, 640, 30);
    c.font = "500 13px 'JetBrains Mono',monospace"; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillStyle = '#e8eefc';
    c.fillText([`점 ${RES}x${RES} = ${RES * RES}개 · 모두 높이 y = 0`, `y = 높이 지도 값 x ${AMP} · 점 ${RES * RES}개`, `+ 높이별 색 · 가까운 점은 크게(2.6px), 먼 점은 작게(1.4px)`, `+ 점 ${RES}개씩 가로줄로 이어 면처럼 · 앞줄이 뒷줄을 가림`][L], 18, 345);
    pillDraw(c, ['연출 전: 높이 0 의 평평한 점 격자', '1단계: 점이 높이 지도 값만큼 솟아오름', '2단계: + 높이별 색 · 깊이별 크기', '3단계: + 줄을 이은 면(숨은선 처리)'][L]);
  },
};
export default demo;
