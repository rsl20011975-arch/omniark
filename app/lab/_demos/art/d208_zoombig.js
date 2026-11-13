/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/still-to-video-recipe/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

const PAL = { bg0: '#eef2f7', bg1: '#dfe6f0', ink: '#0f1b2d', muted: '#5a6a80', accent: '#2b6cff', accent2: '#ff8a3d', surface: '#ffffff', line: '#c3cddc' };

// 정지 사진 한 장이 여섯 걸음을 거쳐 영상이 되어 가는 모습. 화면은 시간 t 의 함수이고, 아래 정지 비율은 이 장면에서 코드가 직접 센 값이다.
const ZOOM_END = 1.28;    // 2단계: 4.0초 동안 올라가는 확대 배율
const PAN_END = 24;       // 2단계: 옆으로 훑는 거리(그림 폭 960 기준 단위)
const LEAD = 0.15;        // 4단계: 화면 반응이 말보다 앞서는 시간(초)
const LOOP_PUSH = 0.55;   // 5단계: 마지막 0.5초에 더 들어가는 확대량
const HOLD_Z = 0.10;      // 6단계: 4.0초 뒤에도 이어 가는 확대량
const HOLD_PAN = 14;      // 6단계: 4.0초 뒤에도 이어 가는 옆 이동(단위)
const BOAT_DX = 230;      // 3단계: 배가 나아가는 거리(단위)
const DIM = 0.5;          // 3단계: 강조할 때 주변을 어둡게 하는 정도(0.5 = 50%)
const STILL_BELOW = 0.5;  // 프레임 차가 이 값보다 작으면 정지로 센다
const ZT = 4.0, DUR = 6;
const SPEECH = [1.2, 2.2, 3.2, 4.2];
const WORDS = ['해 질 녘', '고요한 호수에', '배 한 척이', '지나갑니다'];

const FW = 960, FH = 540, OX = 48, OY = 27, LW = FW + 2 * OX, LH = FH + 2 * OY, R = 1.25;
const SW = 1280, SH = 592, MW = 64, MH = 30, HZ = 318, SCENE_H = 296, BOAT_Y = 346;
const LAY = [{ d: 0 }, { d: .12, cloud: 1 }, { d: .25 }, { d: .45 }, { d: .6 }, { d: 1 }];
const LAKE_I = 4;
const box = (e, o) => Object.assign(e.style, o);
const cvs = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

function layerCtx() {
  const c = cvs(Math.round(LW * R), Math.round(LH * R));
  const x = c.getContext('2d');
  x.scale(R, R); x.translate(OX, OY);
  return [c, x];
}
function ridge(r, base, amp, ph) {
  const pts = [];
  for (let px = -OX - 30; px <= FW + OX + 30; px += 6) {
    const u = px / FW;
    const h = (1 - Math.abs(Math.sin(u * 4.3 + ph[0]))) * .55 + (1 - Math.abs(Math.sin(u * 9.1 + ph[1]))) * .27 + (Math.sin(u * 23 + ph[2]) * .5 + .5) * .1 + r() * .05;
    pts.push([px, base - amp * h]);
  }
  return pts;
}
function fillRidge(x, pts, top, bottom, rim) {
  const path = (dy) => { x.beginPath(); x.moveTo(pts[0][0], FH + OY + 10); pts.forEach(p => x.lineTo(p[0], p[1] + dy)); x.lineTo(pts[pts.length - 1][0], FH + OY + 10); x.closePath(); };
  path(-1.6); x.fillStyle = rim; x.fill();
  const g = x.createLinearGradient(0, 200, 0, HZ + 6); g.addColorStop(0, top); g.addColorStop(1, bottom);
  path(0); x.fillStyle = g; x.fill();
}
function pine(x, cx, baseY, h, w, seed) {
  const r = rng(seed), n = Math.max(8, Math.round(h / 17)), half = [];
  for (let i = 0; i < n; i++) half.push(w * .5 * Math.pow(1 - i / n, .85) * (.72 + .5 * r()) + 3);
  const tiers = (sg) => { const out = []; for (let i = 0; i < n; i++) { const y = baseY - h * (.1 + .9 * i / n); out.push([cx + sg * half[i], y + h / n * .75], [cx + sg * half[i] * .3, y]); } return out; };
  const L = tiers(-1), Rr = tiers(1);
  const path = (dx) => { x.beginPath(); x.moveTo(cx - 4 + dx, baseY + 40); L.forEach(p => x.lineTo(p[0] + dx, p[1])); x.lineTo(cx + dx, baseY - h); Rr.reverse().forEach(p => x.lineTo(p[0] + dx, p[1])); x.lineTo(cx + 4 + dx, baseY + 40); x.closePath(); Rr.reverse(); };
  path(-1.8); x.fillStyle = 'rgba(255,205,170,.8)'; x.fill();
  const g = x.createLinearGradient(0, baseY - h, 0, baseY); g.addColorStop(0, '#2a3446'); g.addColorStop(1, '#0f141d');
  path(0); x.fillStyle = g; x.fill();
}

// 푸른 시간대(해 진 뒤 하늘이 아직 푸른 때)의 호수 풍경. 층마다 뒤쪽까지 그려 둔 장면이라 시차를 걸어도 틈이 보이지 않는다.
function buildLayers() {
  const full = LAY.map(() => layerCtx());
  const r = rng(23);
  let x = full[0][1];
  let g = x.createLinearGradient(0, -OY, 0, HZ); g.addColorStop(0, '#6a8ab6'); g.addColorStop(.45, '#a9bdd6'); g.addColorStop(.8, '#e3d3d0'); g.addColorStop(1, '#f2c7a4');
  x.fillStyle = g; x.fillRect(-OX, -OY, LW, HZ + OY); x.fillStyle = '#f2c7a4'; x.fillRect(-OX, HZ, LW, FH + OY - HZ);
  g = x.createRadialGradient(330, 300, 0, 330, 300, 420); g.addColorStop(0, 'rgba(255,214,170,.6)'); g.addColorStop(.4, 'rgba(255,190,150,.25)'); g.addColorStop(1, 'rgba(255,190,150,0)');
  x.fillStyle = g; x.fillRect(-OX, -OY, LW, LH);
  g = x.createRadialGradient(330, 296, 0, 330, 296, 26); g.addColorStop(0, '#fffaf0'); g.addColorStop(.7, '#ffe6c8'); g.addColorStop(1, '#ffb98a');
  x.fillStyle = g; x.beginPath(); x.arc(330, 296, 26, 0, 7); x.fill();
  x = full[1][1];
  for (let pass = 0; pass < 2; pass++) for (let i = 0; i < 40; i++) {
    const rad = 50 + r() * 90, cx = -OX + rad + r() * (LW - 2 * rad), cy = 60 + r() * 130, a = (pass ? .3 : .5) * (.5 + r() * .5);
    x.save(); x.translate(cx, cy + (pass ? 10 : 0)); x.scale(1, .26);
    const cg = x.createRadialGradient(0, 0, 0, 0, 0, rad); const col = pass ? '70,86,120' : '250,240,236';
    cg.addColorStop(0, `rgba(${col},${a})`); cg.addColorStop(1, `rgba(${col},0)`);
    x.fillStyle = cg; x.fillRect(-rad, -rad, rad * 2, rad * 2); x.restore();
  }
  const farPts = ridge(r, 318, 78, [1.4, 2.8, .5]);
  fillRidge(full[2][1], farPts, '#8191ad', '#c3b3b6', 'rgba(255,214,184,.75)');
  const midPts = ridge(r, 330, 66, [.3, 1.2, 3.1]);
  fillRidge(full[3][1], midPts, '#4a5878', '#7f7d93', 'rgba(255,196,160,.6)');
  x = full[4][1];
  g = x.createLinearGradient(0, HZ, 0, FH + OY); g.addColorStop(0, '#dcb5a2'); g.addColorStop(.2, '#8e96ae'); g.addColorStop(1, '#2f3e5a');
  x.fillStyle = g; x.fillRect(-OX, HZ, LW, FH + OY - HZ);
  x.save(); x.filter = 'blur(3px)'; x.globalAlpha = .4; x.fillStyle = '#34405c';
  x.beginPath(); x.moveTo(midPts[0][0], HZ); midPts.forEach(p => x.lineTo(p[0], 2 * HZ - p[1] - 4)); x.lineTo(midPts[midPts.length - 1][0], HZ); x.closePath(); x.fill(); x.restore();
  for (let i = 0; i < 70; i++) {
    const yy = HZ + 4 + Math.pow(i / 70, 1.5) * 190, wd = 30 + r() * 110 * (1 - i / 120), a = .16 + .36 * r() * (1 - i / 90);
    x.fillStyle = `rgba(255,232,206,${a.toFixed(2)})`; x.fillRect(330 - wd / 2 + (r() - .5) * 30, yy, wd, 1.2 + r() * 1.8);
  }
  x.fillStyle = 'rgba(255,238,220,.5)'; x.fillRect(-OX, HZ - .5, LW, 1.2);
  x = full[5][1];
  const rock = [[-OX - 20, FH + OY + 10], [-OX - 20, 478], [20, 450], [96, 462], [170, 492], [236, 540], [260, FH + OY + 10]];
  const rp = (dy) => { x.beginPath(); rock.forEach((p, i) => i ? x.lineTo(p[0], p[1] + dy) : x.moveTo(p[0], p[1] + dy)); x.closePath(); };
  rp(-2); x.fillStyle = 'rgba(255,205,170,.75)'; x.fill();
  g = x.createLinearGradient(0, 440, 0, 560); g.addColorStop(0, '#2e394d'); g.addColorStop(1, '#10151e'); rp(0); x.fillStyle = g; x.fill();
  pine(x, 690, FH + 4, 220, 100, 21); pine(x, 790, FH + 4, 310, 130, 33); pine(x, 890, FH + 4, 420, 160, 47); pine(x, 985, FH + 4, 300, 130, 58);
  g = x.createLinearGradient(0, FH - 10, 0, FH + OY); g.addColorStop(0, '#182030'); g.addColorStop(1, '#0d1118');
  x.fillStyle = g; x.fillRect(260, FH - 4, LW - 260, OY + 8);
  return full.map(f => f[0]);
}

function cam(t, L) {
  const hold = L >= 6, on = L >= 2;
  const z = (on ? lerp(1, ZOOM_END, E.outC(seg(t, 0, ZT))) : 1) + (hold ? HOLD_Z * E.inOutC(seg(t, ZT, 5.5)) : 0) + (L >= 5 ? LOOP_PUSH * E.inC(seg(t, DUR - .5, DUR)) : 0);
  const pan = (on ? PAN_END * E.inOutC(seg(t, 0, ZT)) : 0) + (hold ? HOLD_PAN * E.inOutC(seg(t, ZT, 5.5)) : 0);
  const mv = L >= 3;
  return {
    z, pan, par: on, t, L,
    cloud: mv ? 40 * E.inOutC(seg(t, 0, DUR)) : 0,
    bx: 250 + (mv ? BOAT_DX * E.inOutC(seg(t, .6, 5.4)) : 0),
    bv: mv ? BOAT_DX * (E.inOutC(seg(t, .6, 5.4)) - E.inOutC(seg(t - .1, .6, 5.4))) * 10 : 0,
    pin: mv ? E.outBack(seg(t, 1.6, 2.0)) : 0,
    dim: mv ? DIM * E.inOutC(seg(t, 2.4, 2.9)) * (1 - E.inOutC(seg(t, 4.4, 4.9))) : 0,
    veil: L >= 5 ? Math.max(.54 * (1 - E.outC(seg(t, 0, .5))), .85 * E.inC(seg(t, DUR - .5, DUR))) : 0,
    bo: [0, 0]
  };
}

function hull(x) {
  x.beginPath(); x.moveTo(-25, -2); x.lineTo(25, -2); x.quadraticCurveTo(21, 9, 8, 10); x.lineTo(-16, 10); x.quadraticCurveTo(-23, 7, -25, -2); x.closePath();
}
function drawElems(x, c) {
  const bx = c.bx, by = BOAT_Y + Math.sin(c.t * 2.1) * 1.1;
  x.save(); x.translate(bx, by);
  x.save(); x.scale(1, -.55); x.globalAlpha = .3; x.filter = 'blur(1.4px)'; x.fillStyle = '#1c2434'; hull(x); x.fill(); x.restore();
  const wk = Math.min(1, Math.abs(c.bv) / 14);
  if (wk > .02) for (const sg of [-1, 1]) {
    const g = x.createLinearGradient(-26, 0, -110, 0); g.addColorStop(0, `rgba(255,244,232,${(.55 * wk).toFixed(2)})`); g.addColorStop(1, 'rgba(255,244,232,0)');
    x.strokeStyle = g; x.lineWidth = 1.2; x.beginPath(); x.moveTo(-26, 7); x.quadraticCurveTo(-60, 7 + sg * 3, -110, 7 + sg * 12); x.stroke();
  }
  const g = x.createLinearGradient(0, -2, 0, 10); g.addColorStop(0, '#2c3648'); g.addColorStop(1, '#10151e');
  hull(x); x.fillStyle = g; x.fill();
  x.strokeStyle = 'rgba(255,200,160,.85)'; x.lineWidth = 1; x.beginPath(); x.moveTo(-25, -2); x.lineTo(25, -2); x.stroke();
  x.fillStyle = '#18202e'; x.beginPath(); x.moveTo(-6, -2); x.lineTo(-4, -12); x.lineTo(10, -12); x.lineTo(12, -2); x.closePath(); x.fill();
  x.fillStyle = '#ffd29b'; x.fillRect(-1, -9.5, 8, 4);
  if (c.pin > 0) {
    x.translate(0, -30); x.scale(c.pin, c.pin);
    x.fillStyle = PAL.surface; x.strokeStyle = PAL.line; x.lineWidth = 1;
    x.beginPath(); x.moveTo(-19, -11); x.lineTo(19, -11); x.quadraticCurveTo(22, -11, 22, -8); x.lineTo(22, 8); x.quadraticCurveTo(22, 11, 19, 11); x.lineTo(4, 11); x.lineTo(0, 17); x.lineTo(-4, 11); x.lineTo(-19, 11); x.quadraticCurveTo(-22, 11, -22, 8); x.lineTo(-22, -8); x.quadraticCurveTo(-22, -11, -19, -11); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = PAL.accent2; x.beginPath(); x.arc(-12, 0, 3.2, 0, 7); x.fill();
    x.fillStyle = PAL.ink; x.font = "600 13px 'IBM Plex Sans KR',sans-serif"; x.textBaseline = 'middle'; x.fillText('배', -4, .5);
  }
  x.restore();
}

function paint(S, ctx, W, H, c) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none';
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = W > 200 ? 'high' : 'low';
  ctx.fillStyle = '#10151e'; ctx.fillRect(0, 0, W, H);
  LAY.forEach((l, i) => {
    const s = c.par ? 1 + (c.z - 1) * (.55 + .9 * l.d) : c.z;
    const w = FW / s, k = W / w, hv = H / k;
    let ox = c.par ? c.pan * l.d : c.pan * .35;
    if (l.cloud) ox -= c.cloud;
    let left = FW / 2 + ox - w / 2, top = FH / 2 - hv / 2;
    if (!l.cloud) left = Math.min(Math.max(left, -OX), FW + OX - w);
    top = Math.min(Math.max(top, -OY), FH + OY - hv);
    ctx.setTransform(k, 0, 0, k, -left * k, -top * k);
    ctx.drawImage(S.full[i], -OX, -OY, LW, LH);
    if (i === LAKE_I) { drawElems(ctx, c); c.bo = [(c.bx - left) * k * SW / W, (BOAT_Y - top) * k * SH / H]; }
  });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function rrect(x, a, b, w, h, r) { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }

function over(ctx, W, H, c) {
  ctx.setTransform(W / SW, 0, 0, H / SH, 0, 0);
  if (c.dim > 0) {
    const [bx, by] = c.bo;
    const g = ctx.createRadialGradient(bx, by - 20, 60, bx, by - 20, 300); g.addColorStop(0, 'rgba(10,18,34,0)'); g.addColorStop(1, `rgba(10,18,34,${c.dim.toFixed(3)})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, SW, SH);
  }
  if (c.L >= 4) {
    const g = ctx.createLinearGradient(0, SH - 170, 0, SH); g.addColorStop(0, 'rgba(10,18,34,0)'); g.addColorStop(1, 'rgba(10,18,34,.8)');
    ctx.fillStyle = g; ctx.fillRect(0, SH - 170, SW, 170);
    ctx.font = "400 46px 'Black Han Sans',sans-serif"; ctx.textBaseline = 'alphabetic';
    const ws = WORDS.map(w => ctx.measureText(w).width), gap = 40, total = ws.reduce((a, b) => a + b, 0) + gap * (WORDS.length - 1);
    let on = -1;
    SPEECH.forEach((s, i) => { if (c.t >= s - LEAD) on = i; });
    if (c.t > 5.4 - LEAD) on = -1;
    let px = (SW - total) / 2;
    WORDS.forEach((w, i) => {
      const act = i === on, base = SH - 58;
      if (act) {
        const p = E.outBack(seg(c.t, SPEECH[i] - LEAD, SPEECH[i] - LEAD + .25));
        ctx.save(); ctx.translate(px + ws[i] / 2, base - 18); ctx.scale(.94 + .06 * p, .94 + .06 * p);
        ctx.fillStyle = PAL.accent2; rrect(ctx, -ws[i] / 2 - 16, -38, ws[i] + 32, 66, 8); ctx.fill();
        ctx.fillStyle = PAL.ink; ctx.fillText(w, -ws[i] / 2, 18); ctx.restore();
      } else { ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.fillText(w, px, base); }
      px += ws[i] + gap;
    });
    if (on >= 0) {
      ctx.font = "500 22px 'JetBrains Mono',monospace"; ctx.fillStyle = '#dbe5f3'; ctx.textAlign = 'center';
      ctx.fillText(`말 ${SPEECH[on].toFixed(2)}초 / 화면 ${(SPEECH[on] - LEAD).toFixed(2)}초 (${LEAD.toFixed(2)}초 먼저)`, SW / 2, SH - 118); ctx.textAlign = 'left';
    }
  }
  if (c.veil > 0) { ctx.fillStyle = `rgba(8,12,20,${c.veil.toFixed(3)})`; ctx.fillRect(0, 0, SW, SH); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function frameAt(S, ctx, W, H, t, L) { const c = cam(t, L); paint(S, ctx, W, H, c); over(ctx, W, H, c); return c; }

// 10fps, 64px 로 줄인 앞뒤 프레임의 밝기 차 평균을 0.1초마다 구해 둔다(단계마다 한 번만 계산).
function curve(S, L) {
  if (S.curves[L]) return S.curves[L];
  const out = []; let prev = null;
  for (let j = 0; j <= 60; j++) {
    frameAt(S, S.mx, MW, MH, j * .1, L);
    const d = S.mx.getImageData(0, 0, MW, MH).data, y = new Float32Array(MW * MH);
    for (let i = 0; i < y.length; i++) y[i] = .299 * d[i * 4] + .587 * d[i * 4 + 1] + .114 * d[i * 4 + 2];
    if (prev) { let s = 0; for (let i = 0; i < y.length; i++) s += Math.abs(y[i] - prev[i]); out.push(s / y.length); }
    prev = y;
  }
  const still = out.filter(v => v < STILL_BELOW).length / out.length * 100;
  let run = 0, best = 0;
  out.forEach(v => { run = v < STILL_BELOW ? run + 1 : 0; best = Math.max(best, run); });
  return (S.curves[L] = { d: out, still, run: best / 10 });
}

const TAGS = ['연출 전: 정지 사진 한 장', '1  이미지 고르기와 출처 기록', '2  카메라 줌과 시차', '3  요소 모션과 강조', '4  말 싱크', '5  전환과 루프', '6  정지 비율 자로 검수'];

const demo = {
  dur: 6, rest: 4.6, noCompare: false, levels: 6,
  mount(sp) {
    const full = buildLayers();
    const cv = el('canvas', null, sp); cv.width = SW; cv.height = SH;
    box(cv, { position: 'absolute', left: '0', top: '0', width: '640px', height: SCENE_H + 'px' });
    const mx = cvs(MW, MH).getContext('2d', { willReadFrequently: true });
    const strip = el('div', null, sp);
    box(strip, { position: 'absolute', left: '0', top: SCENE_H + 'px', width: '640px', height: (360 - SCENE_H) + 'px', background: PAL.bg0, borderTop: `1px solid ${PAL.line}` });
    const info = el('div', null, sp);
    box(info, { position: 'absolute', left: '14px', top: (SCENE_H + 9) + 'px', width: '196px', color: PAL.ink, whiteSpace: 'pre', font: "700 15px/1.35 'JetBrains Mono',monospace" });
    const sub = el('div', null, sp);
    box(sub, { position: 'absolute', left: '14px', top: (SCENE_H + 33) + 'px', width: '196px', color: PAL.muted, whiteSpace: 'pre', font: "400 11px/1.4 'IBM Plex Sans KR',sans-serif" });
    const sk = el('canvas', null, sp); sk.width = 840; sk.height = 96;
    box(sk, { position: 'absolute', left: '214px', top: (SCENE_H + 6) + 'px', width: '420px', height: '48px' });
    const card = el('div', null, sp);
    box(card, { position: 'absolute', left: '12px', top: '12px', width: '206px', padding: '8px 10px', background: PAL.surface, border: `1px solid ${PAL.line}`, borderRadius: '6px', boxShadow: '0 6px 16px rgba(15,27,45,.22)', color: PAL.ink, whiteSpace: 'pre', font: "400 11px/1.55 'JetBrains Mono',monospace", opacity: '0' });
    card.textContent = '출처 기록 (이미지 옆 사이드카)\n만든 곳   직접 생성\n방식      도구와 지시문 기록\n날짜      2026-11-13\n권리      generated';
    const chip = el('div', null, sp, '권리 generated');
    box(chip, { position: 'absolute', left: '12px', top: '12px', padding: '2px 8px', background: PAL.surface, border: `1px solid ${PAL.line}`, borderRadius: '2px', color: PAL.ink, font: "500 11px/1.5 'JetBrains Mono',monospace", opacity: '0' });
    const pill = el('div', null, sp, '');   // 이름표(tag-tr): 오른쪽 위, 왼쪽에 3px 강조 줄
    box(pill, { position: 'absolute', right: '12px', top: '12px', padding: '4px 10px', background: PAL.surface, borderLeft: `3px solid ${PAL.accent}`, borderRadius: '2px', color: PAL.ink, font: "600 12px/1.4 'IBM Plex Sans KR',sans-serif", boxShadow: '0 2px 8px rgba(15,27,45,.2)' });
    return { full, ctx: cv.getContext('2d'), mx, curves: {}, info, sub, sk, card, chip, pill };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 6 : lv);
    frameAt(s, s.ctx, SW, SH, t, L);
    s.pill.textContent = TAGS[L];
    const cr = L >= 1 ? curve(s, L) : curve(s, 1);
    const ok = cr.still <= 20 && cr.run <= 2;
    s.info.textContent = `정지 비율 ${cr.still.toFixed(0)} %`;
    s.sub.textContent = `가장 긴 정지 ${cr.run.toFixed(1)}초  ${ok ? '합격' : '불합격'}\n합격선 20 % 이하, 연속 2초 이하(잠정)`;
    const k = s.sk.getContext('2d'); k.clearRect(0, 0, 840, 96);
    cr.d.forEach((v, i) => {
      const bw = 840 / cr.d.length;
      if (v < STILL_BELOW) { k.fillStyle = '#ffe1cc'; k.fillRect(i * bw, 0, bw, 96); }
    });
    cr.d.forEach((v, i) => {
      const bw = 840 / cr.d.length, h = Math.max(3, Math.min(1, v / 6) * 90);
      k.fillStyle = v < STILL_BELOW ? PAL.accent2 : PAL.accent; k.fillRect(i * bw + 2, 96 - h, bw - 4, h);
    });
    k.fillStyle = PAL.ink; k.fillRect(Math.min(836, t / DUR * 840), 0, 3, 96);
    s.card.style.opacity = L === 1 ? E.outC(seg(t, .2, .9)).toFixed(2) : '0';
    s.card.style.transform = `translateY(${lerp(-10, 0, E.outC(seg(t, .2, .9))).toFixed(1)}px)`;
    s.chip.style.opacity = L >= 2 ? '1' : '0';
  }
};
export default demo;
