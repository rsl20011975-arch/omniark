/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/morph-target/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, rng, canvas, rr } from "./helpers.js";

// 모프 타깃: 같은 꼭짓점 수·순서를 가진 '다른 모양'들을 미리 만들어 두고, 가중치(0~1)만 조절해 모양 사이를 섞는다.
// 위치 = 기본 모양 + 가중치1 x (타깃1 - 기본) + 가중치2 x (타깃2 - 기본)
const W_CUBE = 1;       // 타깃 1(정육면체)의 최종 가중치
const W_BLOB = 0.8;     // 타깃 2(울퉁불퉁한 덩어리)의 최종 가중치
const BLOB = 0.7;      // 타깃 2 의 돌기 높이(구 반지름 1 기준)
const CUBE_HALF = 0.82; // 타깃 1 의 정육면체 반변 길이
const NLON = 28, NLAT = 18;
const CX = 365, CY = 180, CAM = 4.2, F = 330;
const pillDraw = (c, text) => {
  c.font = "500 14px 'IBM Plex Sans KR',sans-serif"; const w = c.measureText(text).width + 26;
  rr(c, 16, 14, w, 28, 14); c.fillStyle = 'rgba(8,10,20,.78)'; c.fill();
  c.fillStyle = '#fff'; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillText(text, 29, 29);
};
const vid = (i, j) => (i % NLON) * (NLAT + 1) + j;

const demo = {
  dur: 4.6, rest: 4.2, noCompare: false, levels: 4,
  mount(sp) {
    sp.style.background = '#0b0f1a';
    const c = canvas(sp), nv = NLON * (NLAT + 1), base = new Float32Array(nv * 3), cube = new Float32Array(nv * 3), blob = new Float32Array(nv * 3);
    for (let i = 0; i < NLON; i++) for (let j = 0; j <= NLAT; j++) {
      const th = i / NLON * 6.2832, ph = j / NLAT * Math.PI, k = vid(i, j) * 3;
      const x = Math.sin(ph) * Math.cos(th), y = Math.cos(ph), z = Math.sin(ph) * Math.sin(th);
      base[k] = x; base[k + 1] = y; base[k + 2] = z;
      const m = Math.max(Math.abs(x), Math.abs(y), Math.abs(z)); cube[k] = x / m * CUBE_HALF; cube[k + 1] = y / m * CUBE_HALF; cube[k + 2] = z / m * CUBE_HALF;
      const rr2 = 1 + BLOB * Math.sin(5 * th + .4) * Math.sin(3 * ph); blob[k] = x * rr2; blob[k + 1] = y * rr2 * 1.2; blob[k + 2] = z * rr2;
    }
    const faces = [];
    for (let i = 0; i < NLON; i++) for (let j = 0; j < NLAT; j++) {
      const q = [vid(i, j), vid(i + 1, j), vid(i + 1, j + 1), vid(i, j + 1)];
      const cx = q.reduce((s2, v) => s2 + base[v * 3], 0), cy = q.reduce((s2, v) => s2 + base[v * 3 + 1], 0), cz = q.reduce((s2, v) => s2 + base[v * 3 + 2], 0);
      const ax = base[q[2] * 3] - base[q[0] * 3], ay = base[q[2] * 3 + 1] - base[q[0] * 3 + 1], az = base[q[2] * 3 + 2] - base[q[0] * 3 + 2];
      const bx = base[q[3] * 3] - base[q[1] * 3], by = base[q[3] * 3 + 1] - base[q[1] * 3 + 1], bz = base[q[3] * 3 + 2] - base[q[1] * 3 + 2];
      const nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
      faces.push({ q, s: (nx * cx + ny * cy + nz * cz) >= 0 ? 1 : -1 });
    }
    const gr = document.createElement('canvas'); gr.width = gr.height = 128; const gx = gr.getContext('2d'), gi = gx.createImageData(128, 128), qq = rng(3);
    for (let i = 0; i < 128 * 128; i++) { const v = qq() > .5 ? 255 : 0; gi.data[i * 4] = gi.data[i * 4 + 1] = gi.data[i * 4 + 2] = v; gi.data[i * 4 + 3] = 12 + qq() * 12; }
    gx.putImageData(gi, 0, 0);
    return { c, nv, base, cube, blob, faces, gr, P: new Float32Array(nv * 3) };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv - 1);   // 0 = 구 하나, 1 = + 타깃1(정육면체), 2 = + 타깃2(울퉁불퉁) 동시에 섞기, 3 = + 가중치 막대와 원본 구 겹쳐 보기
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, 640, 360);
    let g = c.createRadialGradient(CX, CY, 10, CX, CY, 360); g.addColorStop(0, '#16203a'); g.addColorStop(1, '#0b0f1a'); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
    const w1 = L >= 1 ? W_CUBE * E.inOutC(seg(t, .4, 1.5)) : 0, w2 = L >= 2 ? W_BLOB * E.inOutC(seg(t, 1.9, 3.0)) : 0;
    const yaw = .5 + .5 * t, cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(.35), sp = Math.sin(.35), { base, cube, blob, P } = s;
    const M = new Float32Array(3);
    const PX = new Float32Array(s.nv * 2), PZ = new Float32Array(s.nv), BX = new Float32Array(s.nv * 2);
    for (let v = 0; v < s.nv; v++) {
      const k = v * 3;
      for (let d = 0; d < 3; d++) M[d] = base[k + d] + w1 * (cube[k + d] - base[k + d]) + w2 * (blob[k + d] - base[k + d]);
      let x = M[0], y = M[1], z = M[2], x1 = x * cy + z * sy, z1 = -x * sy + z * cy, y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp, pr = F / (CAM + z2);
      P[k] = x1; P[k + 1] = y2; P[k + 2] = z2; PX[v * 2] = CX + x1 * pr; PX[v * 2 + 1] = CY - y2 * pr; PZ[v] = z2;
      x = base[k]; y = base[k + 1]; z = base[k + 2]; x1 = x * cy + z * sy; z1 = -x * sy + z * cy; y2 = y * cp - z1 * sp; z2 = y * sp + z1 * cp; pr = F / (CAM + z2); BX[v * 2] = CX + x1 * pr; BX[v * 2 + 1] = CY - y2 * pr;
    }
    // 접지 그림자
    c.save(); c.translate(CX, CY + 118); c.scale(1, .18); g = c.createRadialGradient(0, 0, 10, 0, 0, 120); g.addColorStop(0, 'rgba(0,0,0,.6)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(-130, -130, 260, 260); c.restore();
    const LX = -.4, LY = .75, LZ = -.6, LN = Math.hypot(LX, LY, LZ), list = [];
    for (const f of s.faces) {
      const [a0, a1, a2, a3] = f.q, i0 = a0 * 3, i1 = a1 * 3, i2 = a2 * 3, i3 = a3 * 3;
      const ax = P[i2] - P[i0], ay = P[i2 + 1] - P[i0 + 1], az = P[i2 + 2] - P[i0 + 2], bx = P[i3] - P[i1], by = P[i3 + 1] - P[i1 + 1], bz = P[i3 + 2] - P[i1 + 2];
      let nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx; const nl = Math.hypot(nx, ny, nz) || 1; nx *= f.s / nl; ny *= f.s / nl; nz *= f.s / nl;
      const cz = (P[i0 + 2] + P[i1 + 2] + P[i2 + 2] + P[i3 + 2]) / 4;
      const cxv = (P[i0] + P[i1] + P[i2] + P[i3]) / 4, cyv = (P[i0 + 1] + P[i1 + 1] + P[i2 + 1] + P[i3 + 1]) / 4;
      if (nx * -cxv + ny * -cyv + nz * -(cz + CAM) <= 0) continue;     // 뒷면은 그리지 않음(카메라는 z = -CAM 쪽)
      list.push([cz, f, nx, ny, nz]);
    }
    list.sort((p, q) => q[0] - p[0]);
    for (const [, f, nx, ny, nz] of list) {
      const dif = Math.max(0, (nx * LX + ny * LY + nz * LZ) / LN), fill = Math.max(0, (nx * .5 + ny * -.4 + nz * -.4) / .75) * .16;
      const lum = Math.min(1, .06 + .92 * Math.pow(dif, 1.25) + fill); const R = Math.round(lerp(14, 150, lum * lum)), G = Math.round(lerp(42, 238, lum)), B = Math.round(lerp(64, 226, lum));
      c.beginPath(); f.q.forEach((v, n) => { const x = PX[v * 2], y = PX[v * 2 + 1]; n ? c.lineTo(x, y) : c.moveTo(x, y); }); c.closePath();
      c.fillStyle = `rgb(${R},${G},${B})`; c.fill(); c.strokeStyle = 'rgba(4,20,36,.32)'; c.lineWidth = .5; c.stroke();
    }
    if (L >= 3) {       // 원본 구(타깃을 섞기 전의 모양)를 가는 선으로 겹쳐 비교
      c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = .8; c.setLineDash([3, 3]);
      for (let j = 3; j < NLAT; j += 3) { c.beginPath(); for (let i = 0; i <= NLON; i++) { const v = vid(i, j), x = BX[v * 2], y = BX[v * 2 + 1]; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); }
      for (let i = 0; i < NLON; i += 7) { c.beginPath(); for (let j = 0; j <= NLAT; j++) { const v = vid(i, j), x = BX[v * 2], y = BX[v * 2 + 1]; j ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); }
      c.setLineDash([]);
      rr(c, 18, 236, 214, 82, 10); c.fillStyle = 'rgba(8,10,20,.72)'; c.fill();
      c.font = "500 12px 'IBM Plex Sans KR',sans-serif"; c.textBaseline = 'middle'; c.textAlign = 'left';
      [['구 → 정육면체', w1, '#ffb36b'], ['구 → 울퉁불퉁', w2, '#6ad5ff']].forEach(([nm, w, col], n) => {
        const y = 256 + n * 34; c.fillStyle = 'rgba(255,255,255,.88)'; c.fillText(nm, 30, y - 8); c.fillStyle = 'rgba(255,255,255,.14)'; rr(c, 30, y + 2, 140, 8, 4); c.fill();
        c.fillStyle = col; if (w > .005) { rr(c, 30, y + 2, Math.max(8, 140 * w), 8, 4); c.fill(); } c.font = "500 13px 'JetBrains Mono',monospace"; c.fillStyle = '#fff'; c.fillText(w.toFixed(2), 184, y + 6); c.font = "500 12px 'IBM Plex Sans KR',sans-serif";
      });
    }
    c.fillStyle = c.createPattern(s.gr, 'repeat'); c.fillRect(0, 0, 640, 360);
    c.fillStyle = 'rgba(8,10,20,.62)'; c.fillRect(0, 330, 640, 30);
    c.font = "500 13px 'JetBrains Mono',monospace"; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillStyle = '#e8eefc';
    c.fillText(['구 하나 · 모프 타깃 없음', `위치 = 구 + ${w1.toFixed(2)} x (정육면체 - 구)`, `위치 = 구 + ${w1.toFixed(2)} x (정육면체 - 구) + ${w2.toFixed(2)} x (덩어리 - 구)`, `점선 = 섞기 전의 원본 구 · 막대 = 가중치(0~1)`][L], 18, 345);
    pillDraw(c, ['연출 전: 구 하나(타깃 없음)', '1단계: 타깃 1(정육면체)을 0에서 1까지 섞음', '2단계: + 타깃 2(울퉁불퉁)를 함께 섞음', '3단계: + 가중치 막대와 원본 구 겹쳐 보기'][L]);
  },
};
export default demo;
