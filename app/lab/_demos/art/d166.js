/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/physics-engine/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, rng, canvas, rr } from "./helpers.js";

// 물리 엔진이 하는 일: 일정한 시간 간격(여기서는 1/120초)마다 ① 중력으로 속도를 더하고 ② 위치를 옮기고 ③ 겹친 것을 밀어내며 튕긴다. 결과를 미리 계산해 두고 t 로 찾아 쓴다.
const GRAVITY = 900;    // 중력 가속도(px/초²)
const BOUNCE = 0.55;    // 반발 계수(1 이면 안 잃고 튕김, 0 이면 붙음)
const STEP = 1 / 120;   // 물리 계산 간격(초)
const FLOOR = 322, WL = 40, WR = 600;
const PLANKS = [[60, 130, 270, 200], [580, 112, 370, 185]];   // 비스듬한 판 두 개(x1, y1, x2, y2)
const NB = 34, SPAWN = .05, HEAVY_T = 2.2, DUR = 4.4, REC = 2;       // REC 번 계산마다 한 장씩 기록(1/60초)
const COLS = [['255,122,89', 0], ['255,194,77', 0], ['53,208,192', 0], ['155,123,255', 0], ['90,176,255', 0]];

function sim(L) {      // L: 1 = 중력·튕김만, 2 = + 공끼리 충돌, 3 = + 무거운 공
  const r = rng(13), n = NB + 1, B = [];
  for (let i = 0; i < NB; i++) B.push({ r: [13, 16, 19][i % 3], x: 120 + r() * 400, y: -30, vx: (r() - .5) * 60, vy: 0, ts: i * SPAWN, rho: 1, a: 0 });
  B.push({ r: 30, x: 320, y: -40, vx: 0, vy: 0, ts: HEAVY_T, rho: 2.4, a: 0, heavy: true });
  const N = L >= 3 ? n : NB;
  B.forEach((b) => { b.m = b.r * b.r * b.rho; });
  const frames = Math.round(DUR / (STEP * REC)) + 2, X = new Float32Array(frames * n).fill(-9999), Y = new Float32Array(frames * n).fill(-9999), A = new Float32Array(frames * n);
  const x0 = B.map((b) => b.x); let t = 0;
  for (let step = 0; step <= frames * REC; step++, t += STEP) {
    for (let i = 0; i < N; i++) {
      const b = B[i]; if (t < b.ts) continue;
      b.vy += GRAVITY * STEP; b.x += b.vx * STEP; b.y += b.vy * STEP; b.vx *= .9995; b.vy *= .9995;
      if (b.y + b.r > FLOOR) { b.y = FLOOR - b.r; if (b.vy > 0) b.vy = -b.vy * BOUNCE; b.vx *= .992; if (Math.abs(b.vy) < 25) b.vy = 0; }
      if (b.x - b.r < WL) { b.x = WL + b.r; b.vx = Math.abs(b.vx) * BOUNCE; }
      if (b.x + b.r > WR) { b.x = WR - b.r; b.vx = -Math.abs(b.vx) * BOUNCE; }
      for (const [x1, y1, x2, y2] of PLANKS) {      // 판은 두께 5px 의 막대: 가장 가까운 점에서 밀어낸다
        const dx = x2 - x1, dy = y2 - y1, u = Math.max(0, Math.min(1, ((b.x - x1) * dx + (b.y - y1) * dy) / (dx * dx + dy * dy))), px = x1 + dx * u, py = y1 + dy * u;
        const ex = b.x - px, ey = b.y - py, d = Math.hypot(ex, ey), min = b.r + 5;
        if (d < min && d > 1e-6) { const nx = ex / d, ny = ey / d; b.x += nx * (min - d); b.y += ny * (min - d); const vn = b.vx * nx + b.vy * ny; if (vn < 0) { b.vx -= (1 + BOUNCE) * vn * nx; b.vy -= (1 + BOUNCE) * vn * ny; const tx = -ny, ty = nx, vt = b.vx * tx + b.vy * ty; b.vx -= vt * .03 * tx; b.vy -= vt * .03 * ty; } }
      }
    }
    if (L >= 2) for (let pass = 0; pass < 3; pass++) for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      const p = B[i], q = B[j]; if (t < p.ts || t < q.ts) continue;
      const dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy), min = p.r + q.r;
      if (d < min && d > 1e-6) {
        const nx = dx / d, ny = dy / d, im = 1 / p.m, jm = 1 / q.m, w = im + jm, ov = (min - d) * .9;
        p.x -= nx * ov * im / w; p.y -= ny * ov * im / w; q.x += nx * ov * jm / w; q.y += ny * ov * jm / w;
        const vn = (q.vx - p.vx) * nx + (q.vy - p.vy) * ny;
        if (vn < 0) { const J = -(1 + BOUNCE * .8) * vn / w; p.vx -= J * nx * im; p.vy -= J * ny * im; q.vx += J * nx * jm; q.vy += J * ny * jm; }
      }
    }
    for (let i = 0; i < N; i++) { const b = B[i]; if (t >= b.ts) { if (Math.hypot(b.vx, b.vy) < 8 && b.y + b.r > FLOOR - 40) { b.vx *= .8; } b.a += b.vx * STEP / b.r; } }
    if (step % REC === 0) { const f = step / REC; if (f < frames) for (let i = 0; i < N; i++) { const b = B[i]; if (t >= b.ts) { X[f * n + i] = b.x; Y[f * n + i] = b.y; A[f * n + i] = b.a; } } }
  }
  return { X, Y, A, frames, n, x0 };
}
const pillDraw = (c, text) => {
  c.font = "500 14px 'IBM Plex Sans KR',sans-serif"; const w = c.measureText(text).width + 26;
  rr(c, 16, 14, w, 28, 14); c.fillStyle = 'rgba(8,10,20,.78)'; c.fill();
  c.fillStyle = '#fff'; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillText(text, 29, 29);
};

const demo = {
  dur: DUR, rest: 3.9, noCompare: false, levels: 4,
  mount(sp) {
    sp.style.background = '#0b0f1a';
    const c = canvas(sp), sims = [null, sim(1), sim(2), sim(3)], spec = [];
    for (let i = 0; i < NB; i++) spec.push({ r: [13, 16, 19][i % 3], x0: sims[1].x0[i], ts: i * SPAWN, col: COLS[i % COLS.length][0] });
    const gr = document.createElement('canvas'); gr.width = gr.height = 128; const gx = gr.getContext('2d'), gi = gx.createImageData(128, 128), q = rng(3);
    for (let i = 0; i < 128 * 128; i++) { const v = q() > .5 ? 255 : 0; gi.data[i * 4] = gi.data[i * 4 + 1] = gi.data[i * 4 + 2] = v; gi.data[i * 4 + 3] = 12 + q() * 12; }
    gx.putImageData(gi, 0, 0);
    return { c, sims, spec, gr };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv - 1);   // 0 = 물리 없음(직선 낙하), 1 = 중력·바닥·판 튕김, 2 = + 공끼리 충돌, 3 = + 무거운 공
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, 640, 360);
    let g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, '#0b0f1a'); g.addColorStop(1, '#161e36'); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
    // 바닥과 벽, 판
    g = c.createLinearGradient(0, FLOOR, 0, 360); g.addColorStop(0, '#2a3552'); g.addColorStop(1, '#10152a'); c.fillStyle = g; c.fillRect(0, FLOOR, 640, 360 - FLOOR); c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(0, FLOOR, 640, 1.5);
    c.fillStyle = '#0f152a'; c.fillRect(0, 0, WL, FLOOR); c.fillRect(WR, 0, 640 - WR, FLOOR); c.fillStyle = 'rgba(255,255,255,.08)'; c.fillRect(WL - 1, 0, 1, FLOOR); c.fillRect(WR, 0, 1, FLOOR);
    for (const [x1, y1, x2, y2] of PLANKS) {
      c.lineCap = 'round'; c.strokeStyle = '#0a0e1c'; c.lineWidth = 14; c.beginPath(); c.moveTo(x1, y1 + 3); c.lineTo(x2, y2 + 3); c.stroke();
      c.strokeStyle = '#3d4a6e'; c.lineWidth = 10; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
      c.strokeStyle = 'rgba(190,210,255,.55)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x1, y1 - 3); c.lineTo(x2, y2 - 3); c.stroke();
    }
    const balls = [];      // [x, y, r, 색, 회전, 무거움]
    if (L === 0) {
      for (const b of s.spec) { const y = Math.min(FLOOR - b.r, -30 + 260 * Math.max(0, t - b.ts)); if (t >= b.ts) balls.push([b.x0, y, b.r, b.col, 0, 0]); }
    } else {
      const S = s.sims[L], tt = Math.max(0, t), f = Math.min(S.frames - 2, Math.floor(tt * 60)), u = Math.min(1, Math.max(0, tt * 60 - f)), n = S.n;
      for (let i = 0; i < (L >= 3 ? n : NB); i++) {
        const k0 = f * n + i, k1 = (f + 1) * n + i; if (S.X[k0] < -9000) continue;
        const x = S.X[k1] < -9000 ? S.X[k0] : lerp(S.X[k0], S.X[k1], u), y = S.Y[k1] < -9000 ? S.Y[k0] : lerp(S.Y[k0], S.Y[k1], u);
        if (i < NB) balls.push([x, y, s.spec[i].r, s.spec[i].col, S.A[k0], 0]); else balls.push([x, y, 30, '70,82,110', S.A[k0], 1]);
      }
    }
    for (const [x, y, r, col] of balls) {          // 접지 그림자: 바닥에 가까울수록 진하고 작다
      const h = Math.max(0, FLOOR - (y + r)), al = Math.max(0, .55 - h / 230);
      if (al > 0) { c.save(); c.translate(x, FLOOR); c.scale(1, .2); const sg = c.createRadialGradient(0, 0, 0, 0, 0, r * 1.5); sg.addColorStop(0, `rgba(0,0,0,${al})`); sg.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = sg; c.beginPath(); c.arc(0, 0, r * 1.5, 0, 6.2832); c.fill(); c.restore(); }
    }
    for (const [x, y, r, col, ang, heavy] of balls) {
      const g2 = c.createRadialGradient(x - r * .35, y - r * .4, r * .08, x, y, r);
      if (heavy) { g2.addColorStop(0, '#d3dcf2'); g2.addColorStop(.25, '#7b88aa'); g2.addColorStop(1, '#232a40'); } else { g2.addColorStop(0, 'rgba(255,255,255,1)'); g2.addColorStop(.2, `rgba(${col},1)`); g2.addColorStop(.85, `rgba(${col},1)`); g2.addColorStop(1, 'rgba(0,0,0,1)'); }
      c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.fillStyle = g2; c.fill();
      if (!heavy) { c.save(); c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.clip(); const g3 = c.createRadialGradient(x - r * .35, y - r * .4, r * .1, x, y, r * 1.05); g3.addColorStop(0, 'rgba(0,0,0,0)'); g3.addColorStop(1, 'rgba(10,6,30,.55)'); c.fillStyle = g3; c.fillRect(x - r, y - r, r * 2, r * 2); c.restore(); }
      c.beginPath(); c.arc(x + Math.cos(ang) * r * .55, y + Math.sin(ang) * r * .55, r * .13, 0, 6.2832); c.fillStyle = heavy ? 'rgba(255,255,255,.55)' : 'rgba(40,20,60,.35)'; c.fill();
    }
    // 중력 표시
    c.strokeStyle = 'rgba(255,255,255,.7)'; c.fillStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 2; c.beginPath(); c.moveTo(610, 60); c.lineTo(610, 100); c.stroke(); c.beginPath(); c.moveTo(603, 94); c.lineTo(610, 106); c.lineTo(617, 94); c.closePath(); c.fill();
    c.font = "500 11px 'JetBrains Mono',monospace"; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(L ? '중력' : '중력 없음', 610, 120); if (L) c.fillText(String(GRAVITY), 610, 134);
    c.fillStyle = c.createPattern(s.gr, 'repeat'); c.fillRect(0, 0, 640, 360);
    c.fillStyle = 'rgba(8,10,20,.62)'; c.fillRect(0, 336, 640, 24);
    c.font = "500 12px 'IBM Plex Sans KR',sans-serif"; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillStyle = '#e8eefc';
    c.fillText(['물리 없음: 일정한 속도로 직선 낙하, 서로 판을 통과함', `중력 ${GRAVITY}px/초² 로 속도가 늘고, 바닥·벽·판에서 반발 ${BOUNCE} 로 튕김`, '+ 공끼리 충돌: 겹치면 밀어내고 운동량을 주고받음(무거울수록 덜 밀림)', '+ 무거운 공(질량 약 8배)이 떨어져 쌓인 공들을 밀어냄'][L], 14, 348);
    pillDraw(c, ['연출 전: 물리 없음(직선 낙하)', '1단계: 중력과 튕김(공끼리는 통과)', '2단계: + 공끼리 충돌', '3단계: + 무거운 공 낙하'][L]);
  },
};
export default demo;
