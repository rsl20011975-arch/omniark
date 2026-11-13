/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/code-vs-ai-video/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

const PAL = { bg0: '#f2f2f0', bg1: '#e4e4e1', ink: '#111111', muted: '#666666', accent: '#ff3b1f', accent2: '#111111', surface: '#ffffff', line: '#c9c9c4' };

// 정지 사진 한 장(5개 층으로 잘린 해 질 녘 호수)을 코드로만 움직일 때 되는 것과 안 되는 것. 화면은 시간 t 의 함수다.
const ZOOM_END = 1.28;    // 카메라가 4.0초 동안 올라가는 확대 배율(1.3 을 넘기면 흐려진다)
const PAN_END = 48;       // 옆으로 훑는 거리(그림 폭 960 기준 단위, 48 = 폭의 5%)
const PAR = 3;            // 시차 세기(1 = 가까운 층일수록 그만큼 더 옮김, 3 = 3배)
const CLOUD_PX = 70;      // 구름 띠를 6초 동안 밀어내는 거리(단위)
const BOAT_DX = 230;      // 배가 나아가는 거리(단위)
const ZT = 4.0, DUR = 6;

const FW = 960, FH = 540, OX = 48, OY = 27, LW = FW + 2 * OX, LH = FH + 2 * OY, R = 1.25;
const SW = 1280, SH = 664, MW = 64, MH = 33, HZ = 318;
const LAY = [
  { n: 'sky', d: 0, cut: 1 }, { n: 'cloud', d: .12, cloud: 1 }, { n: 'far', d: .25, cut: 1 },
  { n: 'mid', d: .45, cut: 1 }, { n: 'lake', d: .6, cut: 1 }, { n: 'fg', d: 1 }
];
const LAKE_I = 4;
const box = (e, o) => Object.assign(e.style, o);
const cvs = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

function layerCtx() {
  const c = cvs(Math.round(LW * R), Math.round(LH * R));
  const x = c.getContext('2d', { willReadFrequently: true });
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
  path(1.8); x.fillStyle = 'rgba(240,170,135,.85)'; x.fill();
  const g = x.createLinearGradient(0, baseY - h, 0, baseY); g.addColorStop(0, '#2f2d37'); g.addColorStop(1, '#131217');
  path(0); x.fillStyle = g; x.fill();
}

function buildLayers() {
  const full = LAY.map(() => layerCtx());
  const r = rng(11);
  // 하늘
  let [, x] = full[0];
  let g = x.createLinearGradient(0, -OY, 0, HZ); g.addColorStop(0, '#9ea6b4'); g.addColorStop(.42, '#d6d0cf'); g.addColorStop(.75, '#f1c3a2'); g.addColorStop(1, '#f6a779');
  x.fillStyle = g; x.fillRect(-OX, -OY, LW, HZ + OY); x.fillStyle = '#f6a779'; x.fillRect(-OX, HZ, LW, FH + OY - HZ);
  g = x.createRadialGradient(560, 296, 0, 560, 296, 430); g.addColorStop(0, 'rgba(255,200,150,.55)'); g.addColorStop(.35, 'rgba(255,150,100,.28)'); g.addColorStop(1, 'rgba(255,150,100,0)');
  x.fillStyle = g; x.fillRect(-OX, -OY, LW, LH);
  g = x.createRadialGradient(560, 292, 0, 560, 292, 140); g.addColorStop(0, 'rgba(255,240,220,.7)'); g.addColorStop(1, 'rgba(255,200,150,0)');
  x.fillStyle = g; x.fillRect(-OX, -OY, LW, LH);
  g = x.createRadialGradient(560, 292, 0, 560, 292, 34); g.addColorStop(0, '#fff6e8'); g.addColorStop(.7, '#ffd9b8'); g.addColorStop(1, '#ff8b5c');
  x.fillStyle = g; x.beginPath(); x.arc(560, 292, 34, 0, 7); x.fill();
  // 구름 띠(옆으로 넓게)
  x = full[1][1];
  for (let pass = 0; pass < 2; pass++) for (let i = 0; i < 40; i++) {
    const rad = 50 + r() * 90, cx = -OX + rad + r() * (LW - 2 * rad), cy = 70 + r() * 120, a = (pass ? .3 : .55) * (.5 + r() * .5);
    x.save(); x.translate(cx, cy + (pass ? 10 : 0)); x.scale(1, .26);
    const cg = x.createRadialGradient(0, 0, 0, 0, 0, rad); const col = pass ? '120,112,140' : '255,236,224';
    cg.addColorStop(0, `rgba(${col},${a})`); cg.addColorStop(1, `rgba(${col},0)`);
    x.fillStyle = cg; x.fillRect(-rad, -rad, rad * 2, rad * 2); x.restore();
  }
  // 먼 능선, 가까운 능선
  const farPts = ridge(r, 318, 78, [.6, 2.1, 4.0]);
  fillRidge(full[2][1], farPts, '#a09eae', '#d3a9a0', 'rgba(255,214,184,.8)');
  const midPts = ridge(r, 330, 66, [3.0, .4, 1.7]);
  fillRidge(full[3][1], midPts, '#6a687b', '#a48b97', 'rgba(255,190,150,.65)');
  // 호수
  x = full[4][1];
  g = x.createLinearGradient(0, HZ, 0, FH + OY); g.addColorStop(0, '#f2b08c'); g.addColorStop(.18, '#c4949a'); g.addColorStop(1, '#4a4e5f');
  x.fillStyle = g; x.fillRect(-OX, HZ, LW, FH + OY - HZ);
  x.save(); x.filter = 'blur(3px)'; x.globalAlpha = .4; x.fillStyle = '#4b4a5c';
  x.beginPath(); x.moveTo(midPts[0][0], HZ); midPts.forEach(p => x.lineTo(p[0], 2 * HZ - p[1] - 4)); x.lineTo(midPts[midPts.length - 1][0], HZ); x.closePath(); x.fill(); x.restore();
  for (let i = 0; i < 70; i++) {
    const yy = HZ + 4 + Math.pow(i / 70, 1.5) * 190, wd = 30 + r() * 110 * (1 - i / 120), a = .18 + .4 * r() * (1 - i / 90);
    x.fillStyle = `rgba(255,228,196,${a.toFixed(2)})`; x.fillRect(560 - wd / 2 + (r() - .5) * 30, yy, wd, 1.2 + r() * 1.8);
  }
  x.fillStyle = 'rgba(255,236,214,.55)'; x.fillRect(-OX, HZ - .5, LW, 1.2);
  // 앞쪽 바위와 소나무
  x = full[5][1];
  const rock = [[FW + OX + 20, FH + OY + 10], [FW + OX + 20, 478], [940, 450], [864, 462], [790, 492], [724, 540], [700, FH + OY + 10]];
  const rp = (dy) => { x.beginPath(); rock.forEach((p, i) => i ? x.lineTo(p[0], p[1] + dy) : x.moveTo(p[0], p[1] + dy)); x.closePath(); };
  rp(-2); x.fillStyle = 'rgba(240,170,135,.8)'; x.fill();
  g = x.createLinearGradient(0, 440, 0, 560); g.addColorStop(0, '#383640'); g.addColorStop(1, '#16151b'); rp(0); x.fillStyle = g; x.fill();
  pine(x, 360, FH + 4, 210, 90, 21); pine(x, 270, FH + 4, 300, 120, 33); pine(x, 170, FH + 4, 410, 150, 47); pine(x, 70, FH + 4, 300, 120, 58);
  g = x.createLinearGradient(0, FH - 10, 0, FH + OY); g.addColorStop(0, '#1d1c23'); g.addColorStop(1, '#101014');
  x.fillStyle = g; x.fillRect(-OX, FH - 4, 700 + OX, OY + 8);
  return full;
}

function makeCuts(full) {
  const W = full[0][0].width, H = full[0][0].height, near = new Uint8Array(W * H), cuts = LAY.map(() => null);
  let prev = -1;
  for (const i of [5, 4, 3, 2, 0]) {
    if (prev >= 0) { const d = full[prev][1].getImageData(0, 0, W, H).data; for (let p = 0; p < near.length; p++) if (d[p * 4 + 3] >= 235) near[p] = 1; }
    if (i < 5) {
      const id = full[i][1].getImageData(0, 0, W, H), d = id.data;
      for (let p = 0; p < near.length; p++) if (near[p]) d[p * 4 + 3] = 0;
      const c = cvs(W, H); c.getContext('2d').putImageData(id, 0, 0); cuts[i] = c;
    }
    prev = i;
  }
  return cuts;
}

function cam(t, L) {
  const on = L >= 2, t0 = Math.max(0, t - .1);
  const at = (tt) => ({
    z: on ? lerp(1, ZOOM_END, E.outC(seg(tt, 0, ZT))) : 1,
    pan: on ? PAN_END * E.inOutC(seg(tt, 0, ZT)) : 0,
    cloud: L >= 4 ? CLOUD_PX * E.inOutC(seg(tt, 0, DUR)) : 0,
    bx: 420 + (L >= 4 ? BOAT_DX * E.inOutC(seg(tt, .6, 5.4)) : 0)
  });
  const c = at(t), p = at(t0);
  return Object.assign(c, { par: L >= 3, move: L >= 4, pin: L >= 4 ? E.outBack(seg(t, 1.6, 2.0)) : 0, bv: (c.bx - p.bx) * 10, t, L, zprev: p.z, mark: L >= 5 });
}

function hull(x) {
  x.beginPath(); x.moveTo(-25, -2); x.lineTo(25, -2); x.quadraticCurveTo(21, 9, 8, 10); x.lineTo(-16, 10); x.quadraticCurveTo(-23, 7, -25, -2); x.closePath();
}
function drawElems(x, c, hatchOnly) {
  const bx = c.bx, by = 392 + Math.sin(c.t * 2.1) * 1.1;
  x.save(); x.translate(bx, by);
  x.save(); x.scale(1, -.55); x.globalAlpha = .3; x.filter = 'blur(1.4px)'; x.fillStyle = '#26242c'; hull(x); x.fill(); x.restore();
  const wk = Math.min(1, Math.abs(c.bv) / 14);
  if (wk > .02) for (const sg of [-1, 1]) {
    const g = x.createLinearGradient(-26, 0, -110, 0); g.addColorStop(0, `rgba(255,240,226,${(.55 * wk).toFixed(2)})`); g.addColorStop(1, 'rgba(255,240,226,0)');
    x.strokeStyle = g; x.lineWidth = 1.2; x.beginPath(); x.moveTo(-26, 7); x.quadraticCurveTo(-60, 7 + sg * 3, -110, 7 + sg * 12); x.stroke();
  }
  const g = x.createLinearGradient(0, -2, 0, 10); g.addColorStop(0, '#34313a'); g.addColorStop(1, '#141318');
  hull(x); x.fillStyle = g; x.fill();
  x.strokeStyle = 'rgba(246,190,150,.85)'; x.lineWidth = 1; x.beginPath(); x.moveTo(-25, -2); x.lineTo(25, -2); x.stroke();
  x.fillStyle = '#1d1b22'; x.beginPath(); x.moveTo(-6, -2); x.lineTo(-4, -12); x.lineTo(10, -12); x.lineTo(12, -2); x.closePath(); x.fill();
  x.fillStyle = '#f6c28f'; x.fillRect(-1, -9.5, 8, 4);
  if (c.pin > 0) {
    x.translate(0, -30); x.scale(c.pin, c.pin);
    x.fillStyle = PAL.surface; x.strokeStyle = PAL.line; x.lineWidth = 1;
    x.beginPath(); x.moveTo(-19, -11); x.lineTo(19, -11); x.quadraticCurveTo(22, -11, 22, -8); x.lineTo(22, 8); x.quadraticCurveTo(22, 11, 19, 11); x.lineTo(4, 11); x.lineTo(0, 17); x.lineTo(-4, 11); x.lineTo(-19, 11); x.quadraticCurveTo(-22, 11, -22, 8); x.lineTo(-22, -8); x.quadraticCurveTo(-22, -11, -19, -11); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = PAL.accent; x.beginPath(); x.arc(-12, 0, 3.2, 0, 7); x.fill();
    x.fillStyle = PAL.ink; x.font = "600 13px 'IBM Plex Sans KR',sans-serif"; x.textBaseline = 'middle'; x.fillText('배', -4, 0.5);
  }
  x.restore();
}

function paint(S, ctx, W, H, c, metric) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none';
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = metric ? 'low' : 'high';
  ctx.fillStyle = metric ? '#00ff00' : (c.mark ? S.hatchA : S.hatch); ctx.fillRect(0, 0, W, H);
  LAY.forEach((l, i) => {
    const s = c.par ? 1 + (c.z - 1) * (.55 + .9 * l.d) : c.z;
    const w = FW / s, k = W / w, hv = H / k;
    let ox = c.par ? c.pan * l.d * PAR : c.pan * .35;
    if (l.cloud) ox -= c.cloud;
    let left = FW / 2 + ox - w / 2, top = FH / 2 - hv / 2;
    if (!l.cloud) left = Math.min(Math.max(left, -OX), FW + OX - w);
    top = Math.min(Math.max(top, -OY), FH + OY - hv);
    ctx.setTransform(k, 0, 0, k, -left * k, -top * k);
    ctx.drawImage(c.par && l.cut ? S.cuts[i] : S.full[i][0], -OX, -OY, LW, LH);
    if (i === LAKE_I) drawElems(ctx, c);
  });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function measure(S, t, L) {
  const read = (c) => {
    paint(S, S.mx, MW, MH, c, true);
    const d = S.mx.getImageData(0, 0, MW, MH).data, y = new Float32Array(MW * MH); let hole = 0;
    for (let i = 0; i < y.length; i++) {
      const r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2];
      y[i] = .299 * r + .587 * g + .114 * b;
      if (g > 200 && r < 90 && b < 90) hole++;
    }
    return [y, hole / y.length];
  };
  const c1 = cam(t, L), c0 = cam(Math.max(0, t - .1), L);
  const [y1, hole] = read(c1), [y0] = read(c0);
  let sum = 0; for (let i = 0; i < y1.length; i++) sum += Math.abs(y1[i] - y0[i]);
  return { diff: sum / y1.length, hole: hole * 100, zs: (c1.z / c1.zprev - 1) * 100 * 10 };
}

const CAP = ['정지 사진 한 장 · 연출 전', '1  정지 사진 한 장, 코드 0줄', '2  줌과 팬, 카메라만 이동', '3  층을 나눠 시차, 빈 틈이 생김', '4  구름·배·표시 핀 모션', '5  경계, 붉은 빗금은 코드로 못 메움'];

const demo = {
  dur: 6, rest: 4.6, noCompare: false, levels: 5,
  mount(sp) {
    const full = buildLayers(), cuts = makeCuts(full);
    const cv = el('canvas', null, sp); cv.width = SW; cv.height = SH;
    box(cv, { position: 'absolute', left: '0', top: '0', width: '640px', height: '332px' });
    const mc = cvs(MW, MH), mx = mc.getContext('2d', { willReadFrequently: true });
    const hp = cvs(12, 12), hx = hp.getContext('2d');
    hx.fillStyle = '#dededa'; hx.fillRect(0, 0, 12, 12); hx.strokeStyle = '#b4b4ae'; hx.lineWidth = 1.2; hx.beginPath(); hx.moveTo(0, 12); hx.lineTo(12, 0); hx.moveTo(-6, 6); hx.lineTo(6, -6); hx.moveTo(6, 18); hx.lineTo(18, 6); hx.stroke();
    const ctx = cv.getContext('2d');
    const gn = cvs(128, 128), gx = gn.getContext('2d'), id = gx.createImageData(128, 128), r = rng(7);
    for (let i = 0; i < 128 * 128; i++) { const v = r() * 255; id.data[i * 4] = id.data[i * 4 + 1] = id.data[i * 4 + 2] = v; id.data[i * 4 + 3] = 255; }
    gx.putImageData(id, 0, 0);
    const ha = cvs(12, 12), ax = ha.getContext('2d');
    ax.fillStyle = '#ffd8cf'; ax.fillRect(0, 0, 12, 12); ax.strokeStyle = PAL.accent; ax.lineWidth = 1.6; ax.beginPath(); ax.moveTo(0, 12); ax.lineTo(12, 0); ax.moveTo(-6, 6); ax.lineTo(6, -6); ax.moveTo(6, 18); ax.lineTo(18, 6); ax.stroke();
    const S = { full, cuts, mx, hatch: ctx.createPattern(hp, 'repeat'), hatchA: ctx.createPattern(ha, 'repeat'), grain: ctx.createPattern(gn, 'repeat') };
    const strip = el('div', null, sp);
    box(strip, { position: 'absolute', left: '0', top: '332px', width: '640px', height: '28px', background: PAL.bg0 });
    const cap = el('div', null, sp, '');   // 이름표(caption-bl): 왼쪽 아래, 배경 없음, 위에 1px 선
    box(cap, { position: 'absolute', left: '12px', top: '332px', height: '27px', width: '616px', borderTop: `1px solid ${PAL.line}`, font: "400 12px/27px 'JetBrains Mono','IBM Plex Sans KR',monospace", color: PAL.muted, whiteSpace: 'nowrap', overflow: 'hidden' });
    const hud = el('div', null, sp);
    box(hud, { position: 'absolute', left: '10px', top: '10px', padding: '6px 9px', borderRadius: '3px', background: 'rgba(255,255,255,.9)', border: `1px solid ${PAL.line}`, font: "500 11px/1.55 'JetBrains Mono',monospace", color: PAL.ink, whiteSpace: 'pre' });
    return Object.assign(S, { ctx, hud, cap });
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 5 : lv);
    const c = cam(t, L);
    paint(s, s.ctx, SW, SH, c, false);
    s.ctx.globalAlpha = .07; s.ctx.globalCompositeOperation = 'overlay'; s.ctx.fillStyle = s.grain; s.ctx.fillRect(0, 0, SW, SH);
    s.ctx.globalAlpha = 1; s.ctx.globalCompositeOperation = 'source-over';
    const m = measure(s, t, L);
    const still = m.diff < .5;
    s.hud.textContent = `줌 속도  ${m.zs >= 0 ? '+' : ''}${m.zs.toFixed(1)} %/초\n프레임 차  ${m.diff.toFixed(2)}  ${still ? '정지' : '움직임'}\n빈 틈  ${m.hole.toFixed(1)} %${L >= 5 ? '  사진에 없는 부분' : ''}`;
    s.cap.textContent = CAP[L];
  }
};
export default demo;
