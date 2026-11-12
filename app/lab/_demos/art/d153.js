/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/fluid-splash-bubble/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 입자 유체: 물을 작은 입자 수백 개로 보고, 입자마다 이웃 입자와의 거리로 밀도를 구해 눌린 곳만 서로 밀어낸다(SPH 계열). mount 에서 미리 계산해 두고 t 로 찾아 쓴다.
const DROP_V = 450;               // 물방울이 떨어지기 시작할 때 아래쪽 속도(px/초)
const BUBBLES = 18;               // 부딪힐 때 말려 들어가 올라오는 거품 수
const T0 = .2;                    // 물방울이 떨어지기 시작하는 시각(초)
const SLOW = 1.4;                 // 계산 시간 1초를 화면에서 몇 초로 늘려 보여 주는가(슬로모션)
const D = 8, H = 17, G = 1300, DT = 1 / 60, STEPS = 80, ITER = 3, MAXN = 40, DR = 34, ROWS = 4, VISC = .3;   // 입자 간격 · 이웃 반경 · 중력 · 시간 간격 · 단계 수 · 반복 수 · 이웃 최대 · 물방울 반지름
const SC = 1.3, BY = 344;   // 탱크를 1.3배로 크게 그린다(계산은 그대로)
const X0 = 210, X1 = 430, Y1 = 308, XL = X0 + D / 2, XR = X1 - D / 2, YB = Y1 - D / 2, SURF = 280;
const P6 = 4 / (Math.PI * Math.pow(H, 8)), SPK = -30 / (Math.PI * Math.pow(H, 5));
const w6 = (r2) => { const a = H * H - r2; return a > 0 ? P6 * a * a * a : 0; };
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);
const NS = 'http://www.w3.org/2000/svg';
const sv = (tag, at, par) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (par) par.appendChild(e); return e; };
const MONO = "'JetBrains Mono',monospace", SANS = "'IBM Plex Sans KR',sans-serif";

function simulate() {   // 위치 기반 유체: 중력 → 예상 위치 → 밀도가 기준보다 높은 곳만 밀어내기를 반복 → 속도 갱신
  const rand = rng(7), pos = [], vel = [], cols = Math.floor((X1 - X0) / D);
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < cols; c++) { pos.push(X0 + D / 2 + c * D + (rand() - .5) * .4, YB - r * D + (rand() - .5) * .4); vel.push(0, 0); }
  const nPool = pos.length / 2;
  for (let gy = -DR; gy <= DR; gy += D) for (let gx = -DR; gx <= DR; gx += D) if (gx * gx + gy * gy <= DR * DR) { pos.push(320 + gx, 140 + gy); vel.push(0, DROP_V); }
  const n = pos.length / 2;
  let rho0 = 0; for (let a = -3; a <= 3; a++) for (let b = -3; b <= 3; b++) rho0 += w6((a * D) * (a * D) + (b * D) * (b * D));
  const wdq = w6((.25 * H) * (.25 * H));
  const X = Float64Array.from(pos), V = Float64Array.from(vel), P = new Float64Array(n * 2), lam = new Float64Array(n), dv = new Float64Array(n * 2);
  const GW = Math.ceil(640 / H) + 2, GH = Math.ceil(360 / H) + 2, head = new Int32Array(GW * GH), nxt = new Int32Array(n), nb = new Int32Array(n * MAXN), nc = new Int32Array(n);
  const frames = [];
  const cellOf = (i) => Math.min(GH - 1, Math.max(0, Math.floor(P[2 * i + 1] / H) + 1)) * GW + Math.min(GW - 1, Math.max(0, Math.floor(P[2 * i] / H) + 1));
  const virt = (i, fn) => {   // 벽 바깥에 입자가 두 줄 더 있는 것처럼 밀도·밀어내기에 더한다
    const x = P[2 * i], y = P[2 * i + 1];
    for (let m = 0; m < 2; m++) for (let k = -2; k <= 2; k++) {
      if (y > YB - H) fn(x + k * D, YB + D + m * D);
      if (x < XL + H) fn(XL - D - m * D, y + k * D);
      if (x > XR - H) fn(XR + D + m * D, y + k * D);
    }
  };
  for (let s = 0; s <= STEPS; s++) {
    frames.push(Float32Array.from(X));
    if (s === STEPS) break;
    for (let i = 0; i < n; i++) { V[2 * i + 1] += G * DT; P[2 * i] = X[2 * i] + V[2 * i] * DT; P[2 * i + 1] = X[2 * i + 1] + V[2 * i + 1] * DT; }
    head.fill(-1);
    for (let i = 0; i < n; i++) { const c = cellOf(i); nxt[i] = head[c]; head[c] = i; }
    for (let i = 0; i < n; i++) {
      let cnt = 0; const c = cellOf(i), cx = c % GW, cy = (c / GW) | 0;
      for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) {
        const xx = cx + ox, yy = cy + oy; if (xx < 0 || yy < 0 || xx >= GW || yy >= GH) continue;
        for (let j = head[yy * GW + xx]; j >= 0; j = nxt[j]) if (j !== i && cnt < MAXN) { const dx = P[2 * i] - P[2 * j], dy = P[2 * i + 1] - P[2 * j + 1]; if (dx * dx + dy * dy < H * H) nb[i * MAXN + cnt++] = j; }
      }
      nc[i] = cnt;
    }
    for (let it = 0; it < ITER; it++) {
      for (let i = 0; i < n; i++) {   // 밀도 → 눌린 정도 C → 보정 계수 λ
        let rho = w6(0), gx = 0, gy = 0, sg = 0; const xi = P[2 * i], yi = P[2 * i + 1];
        const add = (dx, dy, r2) => { rho += w6(r2); const r = Math.sqrt(r2) || 1e-6, g = SPK * (H - r) * (H - r) / rho0 / r; gx += g * dx; gy += g * dy; sg += g * g * r2; };
        for (let k = 0; k < nc[i]; k++) { const j = nb[i * MAXN + k], dx = xi - P[2 * j], dy = yi - P[2 * j + 1]; add(dx, dy, dx * dx + dy * dy); }
        virt(i, (vx, vy) => { const dx = xi - vx, dy = yi - vy, r2 = dx * dx + dy * dy; if (r2 < H * H) add(dx, dy, r2); });
        lam[i] = -Math.max(0, rho / rho0 - 1) / (sg + gx * gx + gy * gy + .5);
      }
      for (let i = 0; i < n; i++) {   // 이웃에게서 멀어지는 방향으로 위치 보정
        let ddx = 0, ddy = 0; const xi = P[2 * i], yi = P[2 * i + 1];
        for (let k = 0; k < nc[i]; k++) {
          const j = nb[i * MAXN + k], ex = xi - P[2 * j], ey = yi - P[2 * j + 1], r2 = ex * ex + ey * ey, r = Math.sqrt(r2) || 1e-6, q = w6(r2) / wdq;
          const g = SPK * (H - r) * (H - r) / rho0 * (lam[i] + lam[j] - .02 * q * q * q * q) / r; ddx += g * ex; ddy += g * ey;
        }
        virt(i, (vx, vy) => { const ex = xi - vx, ey = yi - vy, r2 = ex * ex + ey * ey; if (r2 >= H * H) return; const r = Math.sqrt(r2) || 1e-6, g = SPK * (H - r) * (H - r) / rho0 * 2 * lam[i] / r; ddx += g * ex; ddy += g * ey; });
        P[2 * i] += ddx; P[2 * i + 1] += ddy;
      }
      for (let i = 0; i < n; i++) { P[2 * i] = Math.min(XR, Math.max(XL, P[2 * i])); P[2 * i + 1] = Math.min(YB, P[2 * i + 1]); }
    }
    dv.fill(0);
    for (let i = 0; i < n; i++) { V[2 * i] = (P[2 * i] - X[2 * i]) / DT; V[2 * i + 1] = (P[2 * i + 1] - X[2 * i + 1]) / DT; }
    for (let i = 0; i < n; i++) for (let k = 0; k < nc[i]; k++) { const j = nb[i * MAXN + k], dx = P[2 * i] - P[2 * j], dy = P[2 * i + 1] - P[2 * j + 1], w = VISC * w6(dx * dx + dy * dy) / rho0; dv[2 * i] += (V[2 * j] - V[2 * i]) * w; dv[2 * i + 1] += (V[2 * j + 1] - V[2 * i + 1]) * w; }
    for (let i = 0; i < n; i++) { V[2 * i] += dv[2 * i]; V[2 * i + 1] += dv[2 * i + 1]; X[2 * i] = P[2 * i]; X[2 * i + 1] = P[2 * i + 1]; }
  }
  let nsum = 0; for (let i = 0; i < n; i++) nsum += nc[i];
  return { frames, n, nPool, cols, avgN: nsum / n };
}
function bubbleSet() {   // 거품: 말려 들어간 공기 방울이 올라와 표면에 모이는 자리를 미리 계산
  const r = rng(11), b = [];
  for (let i = 0; i < BUBBLES; i++) b.push({ r: 4 + r() * 6, x0: 290 + r() * 60, t0: T0 + .45 + r() * .5, ph: r() * 6.28, sp: 46 + r() * 30 });
  b.forEach((p) => { p.x = p.x0; p.base = SURF + 2 - p.r * .45; p.y = p.base; });
  for (let it = 0; it < 80; it++) {
    for (let i = 0; i < b.length; i++) for (let j = i + 1; j < b.length; j++) {
      const dx = b[j].x - b[i].x, dy = b[j].y - b[i].y, d = Math.hypot(dx, dy) || .01, ov = b[i].r + b[j].r - d;
      if (ov > 0) { const ux = dx / d, uy = dy / d; b[i].x -= ux * ov / 2; b[i].y -= uy * ov / 2; b[j].x += ux * ov / 2; b[j].y += uy * ov / 2; }
    }
    b.forEach((p) => { p.x += (320 - p.x) * .012; p.y = Math.min(p.y, p.base); p.x = Math.min(XR - p.r, Math.max(XL + p.r, p.x)); });
  }
  b.forEach((p) => { p.ta = p.t0 + Math.max(.2, (YB - 12 - p.base) / p.sp); });   // 표면에 닿는 시각
  return b;
}

const demo = {
  dur: 4, rest: 3.4, noCompare: false, levels: 4,
  mount(sp) {
    const sim = simulate(), bub = bubbleSet();
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: 'linear-gradient(160deg,#0b0f1a 0%,#161d30 100%)' });
    box(el('div', null, bg), { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.06', mixBlendMode: 'overlay' });
    const svg = sv('svg', { width: 640, height: 360, viewBox: '0 0 640 360' }, sp);
    box(svg, { position: 'absolute', left: '0', top: '0' });
    const defs = sv('defs', {}, svg);
    const gf = sv('filter', { id: 'fsbgoo', 'color-interpolation-filters': 'sRGB', x: '-5%', y: '-5%', width: '110%', height: '110%' }, defs);
    sv('feGaussianBlur', { stdDeviation: 5 }, gf); sv('feColorMatrix', { values: '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10' }, gf);
    const wg = sv('linearGradient', { id: 'fsbw', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    sv('stop', { offset: 0, 'stop-color': '#3f8fe6' }, wg); sv('stop', { offset: 1, 'stop-color': '#1b4a96' }, wg);
    const sg = sv('g', { transform: `translate(${320 * (1 - SC)},${BY * (1 - SC)}) scale(${SC})` }, svg);
    sv('rect', { x: X0, y: Y1 - 8, width: X1 - X0, height: 34, fill: 'url(#fsbw)' }, sg);   // 탱크 바닥 쪽 물(고정)
    const cvS = el('canvas', null, sp), cvG = el('canvas', null, sp), cvD = el('canvas', null, sp), cvB = el('canvas', null, sp);
    [cvS, cvG, cvD, cvB].forEach((c) => { c.width = 1280; c.height = 720; });
    cvS.style.filter = 'url(#fsbgoo)'; cvG.style.filter = 'url(#fsbgoo)';
    const svg2 = sv('svg', { width: 640, height: 360, viewBox: '0 0 640 360' }, sp); box(svg2, { position: 'absolute', left: '0', top: '0' });
    const sg2 = sv('g', { transform: `translate(${320 * (1 - SC)},${BY * (1 - SC)}) scale(${SC})` }, svg2);
    sv('rect', { x: X0 - 4, y: 232, width: X1 - X0 + 8, height: 112, rx: 8, fill: 'rgba(190,225,255,.05)', stroke: 'rgba(210,235,255,.5)', 'stroke-width': 1.6 }, sg2);
    sv('rect', { x: X0 - 6, y: 229, width: X1 - X0 + 12, height: 5, fill: '#0f1424' }, sg2);   // 탱크 윗면은 열려 있다
    // 왼쪽 패널: 커널
    sv('rect', { x: 10, y: 50, width: 138, height: 296, rx: 12, fill: 'rgba(255,255,255,.045)', stroke: 'rgba(255,255,255,.09)' }, svg2);
    const t = (x, y, s, sz, fill, f, w, a) => { const e = sv('text', { x, y, fill, 'font-size': sz, 'font-family': f || SANS, 'font-weight': w || 400, 'text-anchor': a || 'start' }, svg2); e.textContent = s; return e; };
    t(20, 72, 'SPH 입자 유체', 12.5, '#fff', SANS, 700);
    const info = [t(20, 92, '', 10, 'rgba(255,255,255,.75)', MONO), t(20, 107, '', 10, 'rgba(255,255,255,.75)', MONO), t(20, 122, '', 10, 'rgba(255,255,255,.75)', MONO)];
    t(20, 148, '이웃의 영향(커널)', 11, '#ffe27a');
    const kp = []; for (let i = 0; i <= 40; i++) { const r = i / 40 * H; kp.push(`${(24 + r / H * 110).toFixed(1)},${(228 - w6(r * r) / w6(0) * 62).toFixed(1)}`); }
    sv('polyline', { points: kp.join(' '), fill: 'none', stroke: '#7fd6ff', 'stroke-width': 2 }, svg2);
    sv('line', { x1: 24, y1: 228, x2: 134, y2: 228, stroke: 'rgba(255,255,255,.4)' }, svg2);
    t(24, 241, '0', 9, 'rgba(255,255,255,.6)', MONO); t(134, 241, `h=${H}px`, 9, 'rgba(255,255,255,.6)', MONO, 400, 'end');
    t(20, 259, '가까운 이웃은 크게,', 9.5, 'rgba(255,255,255,.7)'); t(20, 272, '먼 이웃은 작게 더해', 9.5, 'rgba(255,255,255,.7)'); t(20, 285, '밀도를 구해요.', 9.5, 'rgba(255,255,255,.7)');
    const dens = t(20, 309, '', 10, '#7fffd0', MONO), dens2 = t(20, 324, '', 9, 'rgba(255,255,255,.6)');
    // 오른쪽 패널
    sv('rect', { x: 492, y: 50, width: 138, height: 296, rx: 12, fill: 'rgba(255,255,255,.045)', stroke: 'rgba(255,255,255,.09)' }, svg2);
    t(502, 72, '스플래시 · 거품', 12.5, '#fff', SANS, 700);
    const rd = [t(502, 94, '', 10, 'rgba(255,255,255,.8)', MONO), t(502, 111, '', 15, '#ffe27a', MONO, 700), t(502, 128, '', 10, 'rgba(255,255,255,.8)', MONO), t(502, 143, '', 10, 'rgba(255,255,255,.8)', MONO)];
    const nt = [0, 1, 2, 3, 4].map((k) => t(502, 176 + k * 14, '', 9.5, 'rgba(255,255,255,.68)'));
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', top: '12px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.66)', color: '#fff', font: "500 14px/1 'IBM Plex Sans KR',sans-serif", zIndex: 5 });
    return { sim, bub, cvS, cvG, cvD, cvB, info, dens, dens2, rd, nt, pill };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 4 : lv);   // 1 = 입자 없이 퍼지는 물결만, 2 = + 입자(점)로 계산, 3 = + 매끈한 액체 표면, 4 = + 거품
    const { sim, bub } = s, n = sim.n;
    const ctx = { S: s.cvS.getContext('2d'), G: s.cvG.getContext('2d'), D: s.cvD.getContext('2d'), B: s.cvB.getContext('2d') };
    Object.values(ctx).forEach((c) => { c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 1280, 720); c.setTransform(2 * SC, 0, 0, 2 * SC, 640 * (1 - SC), 688 * (1 - SC)); });
    const u = Math.max(0, Math.min(STEPS - 1e-6, (t - T0) / SLOW * 60)), i0 = Math.floor(u), f = u - i0, A = sim.frames[i0], B = sim.frames[i0 + 1];
    const px = (i) => lerp(A[2 * i], B[2 * i], f), py = (i) => lerp(A[2 * i + 1], B[2 * i + 1], f);
    const pv = (i) => Math.hypot(B[2 * i] - A[2 * i], B[2 * i + 1] - A[2 * i + 1]) * 60;
    let above = 0, top = SURF;
    for (let i = 0; i < n; i++) { const y = py(i); if (y < SURF - 10) above++; if (y < top) top = y; }
    if (L <= 1) {   // 입자 없이: 물방울이 수면에 닿으면 퍼지는 타원 물결 두 겹
      const th = (-DROP_V + Math.sqrt(DROP_V * DROP_V + 2 * G * (SURF - DR - 140))) / G, tt = Math.max(0, t - T0) / SLOW, yc = 140 + DROP_V * tt + .5 * G * tt * tt;
      const c = ctx.D; c.fillStyle = '#3f8fe6'; c.fillRect(X0, SURF, X1 - X0, Y1 - SURF + 4);
      if (tt < th) { const g = c.createRadialGradient(320 - 8, yc - 8, 2, 320, yc, DR); g.addColorStop(0, '#d9f1ff'); g.addColorStop(1, '#3f8fe6'); c.fillStyle = g; c.beginPath(); c.arc(320, yc, DR, 0, 6.2832); c.fill(); }
      else { [0, .16].forEach((d) => { const q = Math.max(0, Math.min(1, (tt - th - d) / .5)); if (q > 0 && q < 1) { c.strokeStyle = `rgba(190,230,255,${(1 - q) * .8})`; c.lineWidth = 2; c.beginPath(); c.ellipse(320, SURF, 14 + q * 100, 3 + q * 9, 0, 0, 6.2832); c.stroke(); } }); }
    } else {
      if (L >= 3) for (let i = 0; i < n; i++) {
        const x = px(i), y = py(i), k = Math.min(1, pv(i) / 420), h = Math.max(0, Math.min(1, (YB - y) / 70));
        const c1 = [lerp(54, 170, k * .8 + h * .3), lerp(130, 224, k * .8 + h * .3), lerp(228, 255, k * .6 + h * .3)].map(Math.round);
        ctx.S.fillStyle = 'rgb(20,60,140)'; ctx.S.beginPath(); ctx.S.arc(x, y + 2.2, 8.6, 0, 6.2832); ctx.S.fill();
        ctx.G.fillStyle = `rgb(${c1})`; ctx.G.beginPath(); ctx.G.arc(x, y, 8.4, 0, 6.2832); ctx.G.fill();
      }
      if (L === 2) for (let i = 0; i < n; i++) { const k = Math.min(1, pv(i) / 420); ctx.D.fillStyle = `rgb(${Math.round(lerp(70, 200, k))},${Math.round(lerp(150, 235, k))},255)`; ctx.D.beginPath(); ctx.D.arc(px(i), py(i), 3.4, 0, 6.2832); ctx.D.fill(); }
      // 밀도를 재는 입자 하나와 이웃 반경
      const q = 3 * sim.cols + Math.round((346 - X0 - D / 2) / D), qx = px(q), qy = py(q);
      let rho = w6(0), cnt = 0, rho0 = 0; for (let a2 = -3; a2 <= 3; a2++) for (let b2 = -3; b2 <= 3; b2++) rho0 += w6((a2 * D) * (a2 * D) + (b2 * D) * (b2 * D));
      for (let i = 0; i < n; i++) if (i !== q) { const dx = px(i) - qx, dy = py(i) - qy, r2 = dx * dx + dy * dy; if (r2 < H * H) { rho += w6(r2); cnt++; if (L === 2) { ctx.D.fillStyle = '#fff'; ctx.D.beginPath(); ctx.D.arc(px(i), py(i), 3.4, 0, 6.2832); ctx.D.fill(); } } }
      ctx.D.strokeStyle = '#ffe27a'; ctx.D.lineWidth = 1.4; ctx.D.setLineDash([3, 3]); ctx.D.beginPath(); ctx.D.arc(qx, qy, H, 0, 6.2832); ctx.D.stroke(); ctx.D.setLineDash([]);
      ctx.D.fillStyle = '#ffe27a'; ctx.D.beginPath(); ctx.D.arc(qx, qy, 3.2, 0, 6.2832); ctx.D.fill();
      s.dens.textContent = `점선 입자 밀도 ${(rho / rho0).toFixed(2)}배`; s.dens2.textContent = `이웃 ${cnt}개 · 1.00 = 정지한 물`;
    }
    if (L < 2) { s.dens.textContent = ''; s.dens2.textContent = ''; }
    // 거품
    let got = 0;
    if (L >= 4) bub.forEach((p) => {
      const q = seg(t, p.t0, p.ta), x = lerp(p.x0, p.x, E.inOutC(Math.min(1, q))) + Math.sin(t * 5 + p.ph) * 2.5 * (1 - q), y = lerp(YB - 12, p.y, E.outC(q));
      if (t < p.t0) return; if (q >= 1) got++;
      const c = ctx.B, r = p.r, g = c.createRadialGradient(x - r * .3, y - r * .35, r * .1, x, y, r);
      g.addColorStop(0, 'rgba(255,255,255,.28)'); g.addColorStop(.65, 'rgba(150,215,255,.10)'); g.addColorStop(.92, 'rgba(210,240,255,.5)'); g.addColorStop(1, 'rgba(255,255,255,.85)');
      c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.fill();
      c.fillStyle = 'rgba(255,255,255,.9)'; c.beginPath(); c.ellipse(x - r * .38, y - r * .42, r * .22, r * .13, -.6, 0, 6.2832); c.fill();
    });
    s.info[0].textContent = L >= 2 ? `입자 ${n}개` : '입자 없음'; s.info[1].textContent = L >= 2 ? `이웃 반경 h=${H}px` : '물결만 그림'; s.info[2].textContent = L >= 2 ? `이웃 평균 ${sim.avgN.toFixed(1)}개` : '';
    s.rd[0].textContent = L >= 2 ? '튀어 오른 높이' : '튀어 오름 없음'; s.rd[1].textContent = L >= 2 ? `${Math.max(0, Math.round(SURF - top))}px` : '';
    s.rd[2].textContent = L >= 2 ? `수면 위 ${above}개` : ''; s.rd[3].textContent = L >= 4 ? `모인 거품 ${got}/${BUBBLES}` : '';
    const notes = L <= 1 ? ['물방울이 닿으면', '타원 고리가 퍼지다', '사라질 뿐, 물이', '튀지도 솟지도', '않습니다.'] : L === 2 ? ['점 하나가 물 입자', '노란 원 안 이웃만', '밀도에 반영돼요.', '눌리면 서로', '밀어냅니다.'] : L === 3 ? ['같은 입자를 합쳐', '칠하면 매끈한', '액체 표면이 돼요.', '솟는 벽이 왕관', '모양입니다.'] : ['말려 든 공기가', '방울로 올라와', '수면에 모이면', '거품이 돼요.', '서로 붙어 있어요.'];
    s.nt.forEach((e, k) => { e.textContent = notes[k]; });
    s.pill.textContent = L <= 1 ? '연출 전 · 입자 계산 없이 물결 고리만' : L === 2 ? `SPH 계열 · 입자 ${n}개를 점으로 표시` : L === 3 ? '액체 표면 · 왕관 모양으로 솟았다 떨어짐' : '거품 · 말려 든 공기가 올라와 수면에 모임';
  },
};
export default demo;
