/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/isometric-lowpoly/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, rng, canvas, rr } from "./helpers.js";

// 아이소메트릭 = 원근 없이(평행 투영) 카메라를 수평에서 35.264° 내려다보고 45° 돌려 본 3D. 로우폴리 = 면 수가 적고 면마다 한 색으로 칠한 모델.
const TILT = 35.264;    // 카메라가 내려다보는 각도(도). 35.264° 가 정확한 아이소메트릭
const STEP_H = 1.0;     // 지형 한 단계의 높이(한 칸 폭 = 1)
const FACETS = 6;       // 나무 원뿔의 옆면 개수(적을수록 각져 보이는 로우폴리)
const TURN_T0 = 1.8, TURN_D = 2.4;   // 마지막 단계에서 장면이 45°에서 135°까지 돌아가는 시작 시각 · 걸리는 시간(초)
const G = 10, S = 29, CX = 320, CY = 184;
const LHAT = (() => { const v = [-.55, .8, .35], l = Math.hypot(...v); return v.map((x) => x / l); })();
const TOP = [[96, 178, 214], [232, 212, 154], [112, 196, 106], [80, 168, 90], [166, 172, 188]];   // 물, 모래, 풀(낮음), 풀(높음), 바위
const pillDraw = (c, text) => {
  c.font = "500 14px 'IBM Plex Sans KR',sans-serif"; const w = c.measureText(text).width + 26;
  rr(c, 16, 14, w, 28, 14); c.fillStyle = 'rgba(8,10,20,.78)'; c.fill();
  c.fillStyle = '#fff'; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillText(text, 29, 29);
};
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (v) => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };

function build() {
  const polys = [], r = rng(8);
  const lvl = [];
  for (let i = 0; i < G; i++) { lvl.push([]); for (let j = 0; j < G; j++) { const d = Math.hypot(i - 4.5, j - 4.6) / 5.4, h = 4.4 * Math.pow(Math.max(0, 1 - d), 1.15) + (r() - .5) * 1.1; lvl[i].push(Math.max(0, Math.min(4, Math.round(h)))); } }
  const P = (kind, pts, n, col, bias) => polys.push({ kind, pts, n, col, bias: bias || 0 });
  const box = (x0, x1, y0, y1, z0, z1, col, kind, bias, top) => {
    const t = [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]];
    if (top !== false) P(kind, t, [0, 1, 0], col, bias);
    P(kind, [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], [0, 0, 1], col, bias); P(kind, [[x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]], [0, 0, -1], col, bias);
    P(kind, [[x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]], [1, 0, 0], col, bias); P(kind, [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], [-1, 0, 0], col, bias);
  };
  const lv = (i, j) => (i < 0 || j < 0 || i >= G || j >= G ? -1 : lvl[i][j]);
  for (let i = 0; i < G; i++) for (let j = 0; j < G; j++) {
    const l = lvl[i][j], x0 = i - G / 2, z0 = j - G / 2, hh = Math.max(.6, l) * STEP_H * (l === 0 ? .55 / .6 : 1), col = TOP[l === 0 ? 0 : l === 1 ? 1 : l === 2 ? 2 : l === 3 ? 3 : 4];
    P(0, [[x0, hh, z0], [x0 + 1, hh, z0], [x0 + 1, hh, z0 + 1], [x0, hh, z0 + 1]], [0, 1, 0], l === 4 ? [240, 244, 250] : col, 0);
    [[1, 0, [x0 + 1, z0], [x0 + 1, z0 + 1]], [-1, 0, [x0, z0 + 1], [x0, z0]], [0, 1, [x0 + 1, z0 + 1], [x0, z0 + 1]], [0, -1, [x0, z0], [x0 + 1, z0]]].forEach(([dx, dz, a, b]) => {
      const nl = lv(i + dx, j + dz), lo = nl < 0 ? -.7 : Math.max(.6, nl) * STEP_H * (nl === 0 ? .55 / .6 : 1);
      if (nl >= 0 && lo >= hh - 1e-6) return;
      const n = [dx, 0, dz];
      if (nl < 0) { P(0, [[a[0], -.7, a[1]], [b[0], -.7, b[1]], [b[0], 0, b[1]], [a[0], 0, a[1]]], n, [112, 78, 60], 0); P(0, [[a[0], 0, a[1]], [b[0], 0, b[1]], [b[0], hh, b[1]], [a[0], hh, a[1]]], n, col, 0); }
      else P(0, [[a[0], lo, a[1]], [b[0], lo, b[1]], [b[0], hh, b[1]], [a[0], hh, a[1]]], n, col, 0);
    });
  }
  let trees = 0, houseDone = false;
  for (let i = 0; i < G; i++) for (let j = 0; j < G; j++) {
    const l = lvl[i][j], cx = i - G / 2 + .5, cz = j - G / 2 + .5, ht = l * STEP_H, q = r();
    if ((l === 2 || l === 3) && !houseDone && l === 2 && q > .5 && i > 3) { houseDone = true; box(cx - .26, cx + .26, ht, ht + .34, cz - .22, cz + .22, [238, 220, 186], 1, -.2, false);
      const ap = [cx, ht + .62, cz], rc = [[cx - .32, ht + .34, cz - .27], [cx + .32, ht + .34, cz - .27], [cx + .32, ht + .34, cz + .27], [cx - .32, ht + .34, cz + .27]];
      for (let k = 0; k < 4; k++) { const a = rc[k], b = rc[(k + 1) % 4]; let n = nrm(cross(sub(b, a), sub(ap, a))); if (n[1] < 0) n = n.map((x) => -x); P(1, [a, b, ap], n, [208, 78, 70], -.2); } continue; }
    if ((l === 2 || l === 3) && q < .32 && trees < 11) {
      trees++; box(cx - .05, cx + .05, ht, ht + .2, cz - .05, cz + .05, [110, 78, 56], 1, -.2, false);
      [[ht + .16, .3, ht + .62], [ht + .44, .24, ht + .98]].forEach(([y0, rad, y1]) => {
        const ap = [cx, y1, cz];
        for (let k = 0; k < FACETS; k++) {
          const a0 = k / FACETS * 6.2832, a1 = (k + 1) / FACETS * 6.2832, A = [cx + Math.cos(a0) * rad, y0, cz + Math.sin(a0) * rad], B = [cx + Math.cos(a1) * rad, y0, cz + Math.sin(a1) * rad];
          let n = nrm(cross(sub(B, ap), sub(A, ap))); const mid = [(A[0] + B[0]) / 2 - cx, 0, (A[2] + B[2]) / 2 - cz]; if (n[0] * mid[0] + n[2] * mid[2] < 0) n = n.map((x) => -x);
          P(1, [A, B, ap], n, [44 + Math.round(q * 40), 140, 92], -.2);
        }
      });
    } else if (l === 4 && q < .55) {
      const rx = .2, ry = .24, c0 = [cx, ht + ry * 1.05, cz], u = [[cx + rx, ht, cz], [cx, ht, cz + rx], [cx - rx, ht, cz], [cx, ht, cz - rx]];
      for (let k = 0; k < 4; k++) { const a = u[k], b = u[(k + 1) % 4]; let n = nrm(cross(sub(b, a), sub(c0, a))); if (n[1] < 0) n = n.map((x) => -x); P(1, [a, b, c0], n, [138, 144, 162], -.2); }
    }
  }
  return polys;
}

const demo = {
  dur: 4.8, rest: 4.4, noCompare: false, levels: 4,
  mount(sp) {
    sp.style.background = '#0b0f1a';
    const gr = document.createElement('canvas'); gr.width = gr.height = 128; const gx = gr.getContext('2d'), gi = gx.createImageData(128, 128), q = rng(3);
    for (let i = 0; i < 128 * 128; i++) { const v = q() > .5 ? 255 : 0; gi.data[i * 4] = gi.data[i * 4 + 1] = gi.data[i * 4 + 2] = v; gi.data[i * 4 + 3] = 12 + q() * 12; }
    gx.putImageData(gi, 0, 0);
    return { c: canvas(sp), polys: build(), gr };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv - 1);   // 0 = 위에서 본 평면, 1 = 아이소메트릭 입체(면 구분 없음), 2 = + 면마다 밝기(평면 셰이딩), 3 = + 로우폴리 나무·집·바위와 회전
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, 640, 360);
    let g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, '#0b0f1a'); g.addColorStop(1, '#1a2340'); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
    const k = L === 0 ? 0 : E.inOutC(seg(t, .3, 1.4)), th = lerp(90, TILT, k) * Math.PI / 180, yawDeg = lerp(0, 45, k) + (L >= 3 ? 90 * E.inOutC(seg(t, TURN_T0, TURN_T0 + TURN_D)) : 0), ps = yawDeg * Math.PI / 180;
    const cp = Math.cos(th), sp = Math.sin(th), cy = Math.cos(ps), sy = Math.sin(ps), sc = lerp(S * 1.05, S, k);
    const rot = (p) => { const x1 = p[0] * cy + p[2] * sy, z1 = -p[0] * sy + p[2] * cy; return [CX + sc * x1, CY - sc * (p[1] * cp + z1 * sp), -p[1] * sp + z1 * cp]; };
    // 바닥 그림자(섬 아래)
    c.save(); c.translate(CX, CY + 60); c.scale(1, .3); g = c.createRadialGradient(0, 0, 10, 0, 0, 230); g.addColorStop(0, 'rgba(0,0,0,.5)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(-240, -240, 480, 480); c.restore();
    const list = [];
    for (const p of s.polys) {
      if (L < 3 && p.kind === 1) continue;
      const nx = p.n[0] * cy + p.n[2] * sy, nz = -p.n[0] * sy + p.n[2] * cy;
      if (-p.n[1] * sp + nz * cp >= -1e-4) continue;                        // 카메라를 등진 면은 그리지 않는다
      const pr = p.pts.map(rot); let d = 0; for (const q of pr) d += q[2]; list.push([d / pr.length + p.bias, pr, p]);
    }
    list.sort((a2, b2) => b2[0] - a2[0]);
    for (const [, pr, p] of list) {
      let col = p.col;
      if (L === 1) col = [206, 214, 232]; else if (L === 0) col = p.col; else { const lam = Math.max(0, p.n[0] * LHAT[0] + p.n[1] * LHAT[1] + p.n[2] * LHAT[2]), kk = .34 + .82 * lam; col = col.map((x) => Math.min(255, x * kk)); }
      c.beginPath(); pr.forEach((q, n) => (n ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]))); c.closePath();
      c.fillStyle = `rgb(${col[0] | 0},${col[1] | 0},${col[2] | 0})`; c.fill();
      c.lineJoin = 'round'; c.lineWidth = L === 1 ? 1.2 : .6; c.strokeStyle = L === 1 ? 'rgba(20,28,52,.85)' : `rgba(${col[0] * .5 | 0},${col[1] * .5 | 0},${col[2] * .5 | 0},.55)`; c.stroke();
    }
    c.fillStyle = c.createPattern(s.gr, 'repeat'); c.fillRect(0, 0, 640, 360);
    c.fillStyle = 'rgba(8,10,20,.62)'; c.fillRect(0, 330, 640, 30);
    c.font = "500 13px 'JetBrains Mono',monospace"; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillStyle = '#e8eefc';
    c.fillText(['위에서 본 평면 · 카메라 90° · 높이 정보가 안 보임', `평행 투영: 카메라 ${TILT}° 내려다봄, 45° 회전 — 멀어도 같은 크기`, `+ 면마다 밝기: 밝기 = 면의 방향 · 빛의 방향`, `+ 로우폴리 모델(나무 옆면 ${FACETS}개) · 45°→135° 회전`][L], 18, 345);
    pillDraw(c, ['연출 전: 위에서 내려다본 평면 지도', '1단계: 아이소메트릭 입체(면 구분 없음)', '2단계: + 면마다 다른 밝기(평면 셰이딩)', '3단계: + 로우폴리 나무·집·바위, 천천히 회전'][L]);
  },
};
export default demo;
