/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/depth-parallax/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

const PAL = { bg0: '#171615', bg1: '#232120', ink: '#f2efe9', muted: '#9a958c', accent: '#5ad1c8', accent2: '#f2b84b', surface: '#1f1d1b', line: '#3a3733' };

// 정지 사진 두 장(바다 풍경, 창이 있는 건물 벽)을 코드로 그리고, 깊이 지도로 가까운 곳은 많이 · 먼 곳은 적게 밀어 시차를 만든다.
const K_FULL = 3;       // 깊이 지도로 밀 때 시차 배율(2·3단계)
const K_SAFE = 1.1;     // 4단계에서 줄인 시차 배율
const BLUR_SHARP = 4;   // 2단계 깊이 지도 경계 블러 크기(px)
const BLUR_SOFT = 8;   // 3단계부터 쓰는 깊이 지도 경계 블러 크기(px)
const AMP = 0.02;       // 카메라가 좌우로 오가는 폭(화면 폭 대비)
const FLAT = 18;        // 1단계에서 사진 한 장을 통째로 미는 폭(px)
const DUR = 10, PERIOD = 5;           // 풍경 5초 + 건물 5초, 카메라는 한 장면당 한 번 오간다
const W = 640, H = 360, MX = 60, SW = W + MX * 2, SH = H;   // 보이는 화면 · 그림 전체(좌우 여유 60px)
const REF = 0.35;       // 깊이 0.35 보다 가까우면 한쪽으로, 멀면 반대쪽으로 민다(셰이더의 d-.35)
const STEPS = ['사진 한 장을 통째로 민다', '깊이 지도로 층마다 다르게 민다', '깊이 지도의 경계를 흐린다', '시차량을 3에서 1.1로 줄인다'];

const sm = (x, a, b) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

function boxBlur(src, w, h, sigma) {      // 상자 흐림 3번 = 가우시안 근사
  const r = Math.max(1, Math.floor(Math.sqrt(12 * sigma * sigma / 3 + 1) / 2));
  let a = Float32Array.from(src), b = new Float32Array(w * h);
  for (let p = 0; p < 3; p++) {
    for (let y = 0; y < h; y++) {
      const o = y * w; let acc = 0;
      for (let i = -r; i <= r; i++) acc += a[o + Math.min(w - 1, Math.max(0, i))];
      for (let x = 0; x < w; x++) { b[o + x] = acc / (2 * r + 1); acc += a[o + Math.min(w - 1, x + r + 1)] - a[o + Math.max(0, x - r)]; }
    }
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let i = -r; i <= r; i++) acc += b[Math.min(h - 1, Math.max(0, i)) * w + x];
      for (let y = 0; y < h; y++) { a[y * w + x] = acc / (2 * r + 1); acc += b[Math.min(h - 1, y + r + 1) * w + x] - b[Math.max(0, y - r) * w + x]; }
    }
  }
  return a;
}

function readGray(cv) {
  const d = cv.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, cv.width, cv.height).data, o = new Float32Array(cv.width * cv.height);
  for (let i = 0; i < o.length; i++) o[i] = d[i * 4] / 255;
  return o;
}

function addGrain(cv, seed, amt) {
  const x = cv.getContext('2d', { willReadFrequently: true }), im = x.getImageData(0, 0, cv.width, cv.height), d = im.data, r = rng(seed);
  for (let i = 0; i < d.length; i += 4) { const n = (r() + r() - 1) * amt; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  x.putImageData(im, 0, 0);
}

function frond(c, dc, bx, by, ang, len, droop, leaf, seed) {   // 야자잎: 줄기 하나에 잎살이 양쪽으로 갈라진다
  const r = rng(seed), N = 34;
  const P = (u) => [bx + Math.cos(ang) * len * u, by + Math.sin(ang) * len * u + droop * len * u * u];
  for (const [ctx, gray] of [[dc, 'rgb(236,236,236)'], [c, null]]) {
    ctx.lineCap = 'round';
    ctx.strokeStyle = gray || '#183a2c'; ctx.lineWidth = gray ? 12 : 2.6;
    ctx.beginPath(); for (let i = 0; i <= N; i++) { const [x, y] = P(i / N); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
  }
  for (let i = 3; i <= N; i++) {
    const u = i / N, [x, y] = P(u), [x2, y2] = P(Math.min(1, u + .03)), tg = Math.atan2(y2 - y, x2 - x);
    for (const side of [-1, 1]) {
      const L = leaf * Math.pow(Math.sin(Math.PI * Math.min(1, u * .96 + .02)), .55) * (.85 + r() * .3), a = tg + side * (.95 + r() * .15), ex = x + Math.cos(a) * L, ey = y + Math.sin(a) * L + L * .35;
      dc.strokeStyle = 'rgb(236,236,236)'; dc.lineWidth = 11; dc.beginPath(); dc.moveTo(x, y); dc.lineTo(ex, ey); dc.stroke();
      const lit = side < 0 ? 1 : 0, g = c.createLinearGradient(x, y, ex, ey);
      g.addColorStop(0, lit ? '#1f4d38' : '#10281f'); g.addColorStop(1, lit ? '#6aa06a' : '#1d4733');
      c.strokeStyle = g; c.lineWidth = 2.3 - u * .8; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo((x + ex) / 2, (y + ey) / 2 - 2, ex, ey); c.stroke();
      if (lit && r() > .55) { c.strokeStyle = 'rgba(242,184,75,.55)'; c.lineWidth = .9; c.beginPath(); c.moveTo(ex - Math.cos(a) * 6, ey - Math.sin(a) * 6); c.lineTo(ex, ey); c.stroke(); }
    }
  }
}

function paintSea() {
  const c = mk(SW, SH), x = c.getContext('2d'), d = mk(SW, SH), dx = d.getContext('2d'), r = rng(11), yh = 150, sunX = 450;
  dx.fillStyle = '#000'; dx.fillRect(0, 0, SW, SH);
  let g = x.createLinearGradient(0, 0, 0, yh);
  g.addColorStop(0, '#17232f'); g.addColorStop(.45, '#3a5666'); g.addColorStop(.8, '#c98f62'); g.addColorStop(1, '#f1c27d');
  x.fillStyle = g; x.fillRect(0, 0, SW, yh);
  for (const [rad, a, col] of [[300, .32, '255,170,90'], [130, .5, '255,196,120'], [44, .8, '255,230,180'], [14, 1, '255,250,235']]) {
    g = x.createRadialGradient(sunX, yh - 6, 0, sunX, yh - 6, rad); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`);
    x.fillStyle = g; x.fillRect(0, 0, SW, yh);
  }
  for (let i = 0; i < 9; i++) {           // 구름: 납작하게 눌린 부드러운 덩어리, 아랫면은 어둡고 윗면은 해에 물든다
    const cx = r() * SW, cy = 28 + r() * 90, rw = 70 + r() * 120;
    x.save(); x.translate(cx, cy); x.scale(1, .13 + r() * .06);
    g = x.createRadialGradient(0, -rw * .2, 0, 0, 0, rw); g.addColorStop(0, 'rgba(255,205,150,.5)'); g.addColorStop(.5, 'rgba(120,100,110,.35)'); g.addColorStop(1, 'rgba(60,70,90,0)');
    x.fillStyle = g; x.beginPath(); x.arc(0, 0, rw, 0, 7); x.fill(); x.restore();
  }
  x.fillStyle = 'rgba(0,0,0,0)';
  // 먼 섬
  x.beginPath(); x.moveTo(130, yh);
  for (let i = 0; i <= 40; i++) { const u = i / 40, px = 130 + u * 220, hh = 36 * Math.sin(Math.PI * u) ** .8 + 5 * Math.sin(u * 23) + 3 * Math.sin(u * 51); x.lineTo(px, yh - Math.max(0, hh)); }
  x.lineTo(350, yh); x.closePath(); g = x.createLinearGradient(0, yh - 42, 0, yh); g.addColorStop(0, '#5b6d73'); g.addColorStop(1, '#a9a089'); x.fillStyle = g; x.fill();
  dx.fillStyle = 'rgb(56,56,56)'; dx.beginPath(); dx.moveTo(130, yh);
  for (let i = 0; i <= 40; i++) { const u = i / 40, hh = 36 * Math.sin(Math.PI * u) ** .8 + 5 * Math.sin(u * 23) + 3 * Math.sin(u * 51); dx.lineTo(130 + u * 220, yh - Math.max(0, hh)); }
  dx.lineTo(350, yh); dx.closePath(); dx.fill();
  // 바다
  g = x.createLinearGradient(0, yh, 0, SH);
  g.addColorStop(0, '#e0a56a'); g.addColorStop(.08, '#7a8f86'); g.addColorStop(.3, '#2f7a80'); g.addColorStop(1, '#0c3138');
  x.fillStyle = g; x.fillRect(0, yh, SW, SH - yh);
  g = dx.createLinearGradient(0, yh, 0, SH);
  for (let i = 0; i <= 8; i++) { const u = i / 8, v = Math.round(Math.pow(sm(yh + u * (SH - yh), .3 * SH, SH), 1.2) * .85 * 255); g.addColorStop(u, `rgb(${v},${v},${v})`); }
  dx.fillStyle = g; dx.fillRect(0, yh, SW, SH - yh);
  for (let i = 0; i < 420; i++) {          // 해가 비친 길: 가까울수록 굵고 넓다
    const yy = yh + 2 + Math.pow(r(), 1.6) * (SH - yh - 8), k = (yy - yh) / (SH - yh), wid = 8 + k * 110, xx = sunX + (r() - .5) * wid * (1.3 - k * .3);
    x.fillStyle = `rgba(255,${210 + r() * 40 | 0},${150 + r() * 60 | 0},${.12 + r() * .5 * (1 - k * .5)})`; x.fillRect(xx, yy, 3 + r() * (6 + k * 26), .8 + k * 1.6);
  }
  for (let i = 0; i < 70; i++) { const yy = yh + 6 + r() * (SH - yh - 10); x.fillStyle = `rgba(190,235,230,${.04 + r() * .06})`; x.fillRect(r() * SW, yy, 40 + r() * 140, 1); }
  // 앞쪽 바위
  x.beginPath(); x.moveTo(0, SH); x.lineTo(0, 268); x.bezierCurveTo(40, 250, 90, 262, 120, 285); x.bezierCurveTo(150, 300, 190, 318, 210, SH); x.closePath();
  g = x.createLinearGradient(0, 250, 0, SH); g.addColorStop(0, '#4b4540'); g.addColorStop(.5, '#201d1c'); g.addColorStop(1, '#0c0b0b'); x.fillStyle = g; x.fill();
  x.strokeStyle = 'rgba(242,184,75,.55)'; x.lineWidth = 1.4; x.beginPath(); x.moveTo(0, 268); x.bezierCurveTo(40, 250, 90, 262, 120, 285); x.stroke();
  dx.fillStyle = 'rgb(205,205,205)'; dx.beginPath(); dx.moveTo(0, SH); dx.lineTo(0, 268); dx.bezierCurveTo(40, 250, 90, 262, 120, 285); dx.bezierCurveTo(150, 300, 190, 318, 210, SH); dx.closePath(); dx.fill();
  // 오른쪽 위에서 늘어진 야자잎
  frond(x, dx, 790, -16, 2.55, 330, .55, 62, 3);
  frond(x, dx, 790, -16, 2.1, 300, .9, 56, 5);
  frond(x, dx, 790, -16, 2.85, 250, .25, 50, 8);
  g = x.createRadialGradient(SW / 2, SH / 2, 150, SW / 2, SH / 2, 460); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(8,10,12,.5)'); x.fillStyle = g; x.fillRect(0, 0, SW, SH);
  addGrain(c, 21, 14);
  return { c, d };
}

function paintWall() {
  const c = mk(SW, SH), x = c.getContext('2d'), d = mk(SW, SH), dx = d.getContext('2d'), r = rng(31);
  dx.fillStyle = 'rgb(150,150,150)'; dx.fillRect(0, 0, SW, SH);
  let g = x.createLinearGradient(0, 0, SW, SH * .6); g.addColorStop(0, '#d2c1a2'); g.addColorStop(1, '#a8957a'); x.fillStyle = g; x.fillRect(0, 0, SW, SH);
  for (let i = 0; i < 5200; i++) { x.fillStyle = r() > .5 ? 'rgba(255,245,220,.05)' : 'rgba(70,50,30,.06)'; x.fillRect(r() * SW, r() * SH, 1 + r() * 3, 1 + r() * 2); }
  for (let i = 0; i < 40; i++) { x.fillStyle = `rgba(80,60,40,${.015 + r() * .02})`; x.fillRect(r() * SW, 0, 1 + r() * 2, SH); }
  g = x.createLinearGradient(0, 0, 0, 40); g.addColorStop(0, 'rgba(30,20,12,.55)'); g.addColorStop(1, 'rgba(30,20,12,0)'); x.fillStyle = g; x.fillRect(0, 0, SW, 40);
  const wx = 200, wy = 44, ww = 400, wh = 258, f = 14, mxv = wx + ww / 2 - 5, myh = wy + 112;       // 창 위치 · 틀 두께 · 가운데 세로살 · 가로살
  x.fillStyle = 'rgba(40,28,16,.34)'; x.fillRect(wx - 6, wy - 4, ww + 20, wh + 22);      // 창 둘레 벽에 드리운 그림자
  x.fillStyle = '#ece5d4'; x.fillRect(wx - f, wy - f, ww + f * 2, wh + f * 2);
  dx.fillStyle = 'rgb(95,95,95)'; dx.fillRect(wx - f, wy - f, ww + f * 2, wh + f * 2);
  const panes = [[wx, wy, ww, wh]];
  for (const [px, py, pw, ph] of panes) {
    g = x.createLinearGradient(0, py, 0, py + ph);
    g.addColorStop(0, '#7fa9c4'); g.addColorStop(.42, '#e6d9b6'); g.addColorStop(.44, '#3d8397'); g.addColorStop(.62, '#2a6679'); g.addColorStop(.63, '#4a443f'); g.addColorStop(.8, '#3a3632'); g.addColorStop(.81, '#6a9440'); g.addColorStop(1, '#4a7030');
    x.fillStyle = g; x.fillRect(px, py, pw, ph);
    const bands = [[0, .43, 0], [.43, .62, 8], [.62, .8, 30], [.8, 1, 62]];
    for (const [a, b, v] of bands) { dx.fillStyle = `rgb(${v},${v},${v})`; dx.fillRect(px, py + ph * a, pw, ph * (b - a)); }
    x.save(); x.beginPath(); x.rect(px, py, pw, ph); x.clip();
    g = x.createLinearGradient(px, py, px + pw * .6, py + ph); g.addColorStop(0, 'rgba(255,255,255,.18)'); g.addColorStop(.4, 'rgba(255,255,255,.02)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(px, py, pw, ph); x.restore();
  }
  x.fillStyle = '#ece5d4'; x.fillRect(mxv, wy, 10, wh); x.fillRect(wx, myh, ww, 10);
  dx.fillStyle = 'rgb(95,95,95)'; dx.fillRect(mxv, wy, 10, wh); dx.fillRect(wx, myh, ww, 10);
  x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 1.2; x.strokeRect(wx - f + .6, wy - f + .6, ww + f * 2 - 1.2, wh + f * 2 - 1.2);
  x.strokeStyle = 'rgba(80,66,48,.55)'; x.lineWidth = 1.6; x.strokeRect(wx - .8, wy - .8, ww + 1.6, wh + 1.6);
  x.fillStyle = 'rgba(80,66,48,.4)'; x.fillRect(mxv - 1, wy, 1.5, wh); x.fillRect(mxv + 10, wy, 1.5, wh); x.fillRect(wx, myh - 1, ww, 1.5); x.fillRect(wx, myh + 10, ww, 1.5);
  const sy = wy + wh + f;                                                        // 창턱
  g = x.createLinearGradient(0, sy, 0, sy + 18); g.addColorStop(0, '#f4eddc'); g.addColorStop(1, '#bfb49c'); x.fillStyle = g; x.fillRect(wx - 26, sy, ww + 52, 18);
  g = x.createLinearGradient(0, sy + 18, 0, sy + 46); g.addColorStop(0, 'rgba(30,20,10,.5)'); g.addColorStop(1, 'rgba(30,20,10,0)'); x.fillStyle = g; x.fillRect(wx - 26, sy + 18, ww + 52, 28);
  dx.fillStyle = 'rgb(190,190,190)'; dx.fillRect(wx - 26, sy, ww + 52, 18);
  g = x.createLinearGradient(0, 0, 100, 0); g.addColorStop(0, '#5a4a39'); g.addColorStop(.8, '#85735c'); g.addColorStop(1, '#a8957a'); x.fillStyle = g; x.fillRect(0, 0, 100, SH);   // 기둥
  g = x.createLinearGradient(100, 0, 150, 0); g.addColorStop(0, 'rgba(30,20,10,.45)'); g.addColorStop(1, 'rgba(30,20,10,0)'); x.fillStyle = g; x.fillRect(100, 0, 50, SH);
  dx.fillStyle = 'rgb(215,215,215)'; dx.fillRect(0, 0, 100, SH);
  addGrain(c, 41, 12);
  return { c, d };
}

function toSrc(cv) { const im = cv.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, SW, SH); return im.data; }

function sceneData(p) {
  const raw = readGray(p.d), thumb = (arr) => {
    const t = mk(120, 68), tx = t.getContext('2d'), im = tx.createImageData(120, 68);
    for (let y = 0; y < 68; y++) for (let x = 0; x < 120; x++) { const v = arr[Math.floor(y * SH / 68) * SW + MX + Math.floor(x * W / 120)] * 255, i = (y * 120 + x) * 4; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
    tx.putImageData(im, 0, 0); return t;
  };
  const sharp = boxBlur(raw, SW, SH, BLUR_SHARP), soft = boxBlur(raw, SW, SH, BLUR_SOFT);
  return { src: toSrc(p.c), sharp, soft, tSharp: thumb(sharp), tSoft: thumb(soft) };
}

const sway = (t) => Math.sin(2 * Math.PI * (((t % PERIOD) + PERIOD) % PERIOD) / PERIOD);   // 이징 없는 등속이 아니라 사인 곡선으로 오간다
const shiftPx = (d, s, K) => -s * AMP * 2.2 * (d - REF) * K * W;     // 셰이더 s=uv+par*(d-.35)*K 의 par = -(cx-.5)*2.2

function metrics(sc, L, K, wall) {      // 카메라가 끝까지 갔을 때(sway=1) 이 장면에서 직접 잰 값
  if (L <= 1) return { gap: 0, bend: 0, jump: 0 };
  const dep = L === 2 ? sc.sharp : sc.soft;
  let lo = 9, hi = -9;
  for (let y = 0; y < SH; y += 6) for (let x = MX; x < MX + W; x += 6) { const v = shiftPx(dep[y * SW + x], 1, K); lo = Math.min(lo, v); hi = Math.max(hi, v); }
  if (!wall) return { gap: hi - lo, bend: null, jump: null };
  const xe = 200 - 14, xs = [];
  let jump = 0;
  for (let y = 44; y <= 302; y += 6) {      // 창틀 왼쪽 바깥 세로선이 화면에서 어디에 나타나는지 찾는다
    let prev = null, hit = null;
    for (let x = xe - 80; x <= xe + 80; x++) {
      const D = shiftPx(dep[y * SW + x], 1, K), v = x + D - xe;
      if (prev && prev[1] <= 0 && v > 0 && hit === null) hit = x - 1 + (-prev[1]) / (v - prev[1]);
      if (prev) jump = Math.max(jump, Math.abs(D - prev[2]));
      prev = [x, v, D];
    }
    if (hit !== null) xs.push(hit);
  }
  return { gap: hi - lo, bend: xs.length ? Math.max(...xs) - Math.min(...xs) : 0, jump };
}

const demo = {
  dur: DUR, rest: 6.25, noCompare: false, levels: 4,
  mount(sp) {
    const css = (e, o) => Object.assign(e.style, o);
    const sea = sceneData(paintSea()), wall = sceneData(paintWall());
    const main = el('canvas', null, sp);
    main.width = 1280; main.height = 720; css(main, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const lo = mk(W, H), loCtx = lo.getContext('2d'), im = loCtx.createImageData(W, H);
    const lab = el('div', null, sp);
    css(lab, { position: 'absolute', left: '12px', top: '10px', display: 'flex', alignItems: 'center', gap: '10px', padding: '5px 14px 5px 11px', borderRadius: '6px', background: 'rgba(23,22,21,.62)', boxShadow: '0 0 0 1px rgba(58,55,51,.9)', zIndex: 5 });
    const num = el('span', null, lab), txt = el('span', null, lab);
    css(num, { font: "400 40px/1 'Black Han Sans',sans-serif", color: PAL.accent });
    css(txt, { font: "500 13px/1.2 'IBM Plex Sans KR',sans-serif", color: PAL.ink });
    const cache = {};
    return { main, lo, loCtx, im, num, txt, sea, wall, cache };
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 4 : lv);
    const wallScene = t >= PERIOD, sc = wallScene ? s.wall : s.sea, sw = sway(t);
    const K = L >= 4 ? K_SAFE : K_FULL, dep = L === 2 ? sc.sharp : sc.soft, out = s.im.data, src = sc.src;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        let sx = x + MX;
        sx += L <= 1 ? FLAT * sw : shiftPx(dep[y * SW + sx], sw, K);
        sx = Math.min(SW - 1.001, Math.max(0, sx));
        const i0 = Math.floor(sx), f = sx - i0, p = (y * SW + i0) * 4, o = (y * W + x) * 4;
        out[o] = src[p] * (1 - f) + src[p + 4] * f; out[o + 1] = src[p + 1] * (1 - f) + src[p + 5] * f; out[o + 2] = src[p + 2] * (1 - f) + src[p + 6] * f; out[o + 3] = 255;
      }
    }
    s.loCtx.putImageData(s.im, 0, 0);
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
    x.drawImage(s.lo, 0, 0, W, H);
    const dip = Math.max(0, 1 - Math.abs(t - PERIOD) / .22);     // 장면이 바뀌는 5초 앞뒤로 잠깐 어두워졌다 밝아진다
    if (dip > 0) { x.fillStyle = `rgba(23,22,21,${(E.inOutC(dip)).toFixed(3)})`; x.fillRect(0, 0, W, H); }
    // 깊이 지도 작은 창
    const bx = W - 140, by = H - 90;
    x.fillStyle = 'rgba(23,22,21,.78)'; x.fillRect(bx - 6, by - 20, 132, 98);
    x.strokeStyle = PAL.line; x.lineWidth = 1; x.strokeRect(bx - 5.5, by - 19.5, 131, 97);
    x.fillStyle = PAL.muted; x.font = "500 10px 'IBM Plex Sans KR',sans-serif"; x.textAlign = 'left'; x.textBaseline = 'alphabetic';
    x.fillText(L <= 1 ? '깊이 지도 없음' : `깊이 지도(블러 ${L === 2 ? BLUR_SHARP : BLUR_SOFT}px)`, bx, by - 7);
    if (L <= 1) { x.fillStyle = '#2b2927'; x.fillRect(bx, by, 120, 68); x.strokeStyle = PAL.line; x.beginPath(); x.moveTo(bx, by); x.lineTo(bx + 120, by + 68); x.moveTo(bx + 120, by); x.lineTo(bx, by + 68); x.stroke(); }
    else x.drawImage(L === 2 ? sc.tSharp : sc.tSoft, bx, by);
    // 이 장면에서 직접 잰 값
    const key = (wallScene ? 'w' : 's') + L + '_' + K;
    const m = s.cache[key] || (s.cache[key] = metrics(sc, L, K, wallScene));
    x.fillStyle = 'rgba(23,22,21,.78)'; x.fillRect(12, H - 52, 372, 40);
    x.strokeStyle = PAL.line; x.strokeRect(12.5, H - 51.5, 371, 39);
    x.font = "500 11px 'JetBrains Mono',monospace"; x.fillStyle = PAL.ink;
    x.fillText(L <= 1 ? `통째로 밀기 ${FLAT}px · 층 구분 없음` : `시차 K ${K} · 깊이 경계 블러 ${L === 2 ? BLUR_SHARP : BLUR_SOFT}px`, 20, H - 35);
    x.fillStyle = PAL.accent2;
    const f1 = (v) => v.toFixed(1);
    x.fillText(`앞뒤 어긋남 ${f1(m.gap)}px · 틀 휨 ${m.bend == null ? '건물에서 측정' : f1(m.bend) + 'px'}${m.jump == null || L <= 1 ? '' : ' · 단차 ' + m.jump.toFixed(2)}`, 20, H - 20);
    const li = L - 1;
    s.num.textContent = String(L); s.txt.textContent = STEPS[li];
  },
};
export default demo;
