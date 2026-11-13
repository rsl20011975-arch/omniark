/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/device-3d-mockup/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rr, rng } from "./helpers.js";

const PAL = { bg0: '#1f3a8a', bg1: '#172a63', ink: '#f3f6ff', muted: '#aebcf0', accent: '#ffd166', accent2: '#7fe0ff', surface: '#1b3274', line: 'rgba(243,246,255,.3)' };

// 3D 기기 목업: 둥근 사각 판(폰)을 직접 3차원으로 돌려 보여 준다. 점을 회전·원근 투영하고, 화면 이미지는 삼각형 조각으로 입힌다. 화면은 시간 t 의 함수다.
const ROT = 32;           // 좌우로 돌아가는 최대 각도(도)
const DEPTH = 10;         // 기기 두께 px (옆면 길이)
const PERSP = 700;        // 카메라까지의 거리. 작을수록 원근이 세다
const PITCH = 8;          // 위에서 내려다보는 각도(도)
const SANS = "'IBM Plex Sans KR','Malgun Gothic',sans-serif", MONO = "'JetBrains Mono',monospace";
const PW = 110, PH = 226, PR = 20, BZ = 7;       // 폰 몸체 가로·세로·모서리 반지름·베젤
const CX = 352, CY = 164;                         // 화면에서 폰 중심
const T = (c, s, x, y, size, col, w = 500, al = 'left', f = SANS) => { c.save(); c.fillStyle = col; c.font = `${w} ${size}px ${f}`; c.textAlign = al; c.textBaseline = 'alphabetic'; c.fillText(s, x, y); c.restore(); };
const lg = (c, x0, y0, x1, y1, stops) => { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, col]) => g.addColorStop(o, col)); return g; };
const mk = (w, h) => { const k = document.createElement('canvas'); k.width = w; k.height = h; return k; };

function grainTile(seed) {
  const g = mk(128, 128), x = g.getContext('2d'), im = x.createImageData(128, 128), r = rng(seed);
  for (let i = 0; i < im.data.length; i += 4) { const v = r() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
  x.putImageData(im, 0, 0); return g;
}
function rrPoly(w, h, r, n = 7) {   // 둥근 사각형 윤곽(화면 기준 시계 방향 점들)
  const pts = [], hw = w / 2, hh = h / 2;
  [[hw - r, -hh + r, -90], [hw - r, hh - r, 0], [-hw + r, hh - r, 90], [-hw + r, -hh + r, 180]].forEach(([cx, cy, a0]) => {
    for (let i = 0; i <= n; i++) { const a = (a0 + 90 * i / n) * Math.PI / 180; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } });
  return pts;
}

// 폰 화면 이미지(어두운 앱 화면) — 한 번만 그려 둔다
function phoneTex() {
  const k = mk(192, 424), c = k.getContext('2d'); c.scale(2, 2);
  c.fillStyle = lg(c, 0, 0, 96, 212, [[0, '#f3f6ff'], [1, '#d3ddfa']]); c.fillRect(0, 0, 96, 212);
  c.fillStyle = 'rgba(31,58,138,.07)'; c.beginPath(); c.arc(86, 28, 52, 0, 6.2832); c.fill();
  T(c, '오늘', 12, 40, 18, PAL.bg1, 700); T(c, '목표 3개 중 2개 완료', 12, 56, 8.5, '#3b4c8a', 500);
  c.lineWidth = 9; c.lineCap = 'round'; c.strokeStyle = 'rgba(31,58,138,.16)'; c.beginPath(); c.arc(48, 104, 30, 0, 6.2832); c.stroke();
  c.strokeStyle = lg(c, 20, 80, 80, 130, [[0, PAL.bg0], [1, '#2f86d6']]); c.beginPath(); c.arc(48, 104, 30, -1.5708, -1.5708 + 6.2832 * .72); c.stroke();
  T(c, '72%', 48, 109, 15, PAL.bg1, 700, 'center', MONO);
  [['걸음', '6,420'], ['수면', '7.2h']].forEach(([a, b], i) => { rr(c, 10 + i * 40, 148, 36, 30, 7); c.fillStyle = 'rgba(31,58,138,.1)'; c.fill(); T(c, a, 15 + i * 40, 160, 7.5, '#3b4c8a'); T(c, b, 15 + i * 40, 172, 9.5, PAL.bg1, 700, 'left', MONO); });
  rr(c, 18, 190, 60, 14, 7); c.fillStyle = 'rgba(31,58,138,.2)'; c.fill();
  return k;
}
function cardTex(kind) {
  const k = mk(200, 88), c = k.getContext('2d'); c.scale(2, 2);
  rr(c, 0, 0, 100, 44, 10);
  if (kind === 0) {
    c.fillStyle = PAL.ink; c.fill(); T(c, '방문', 10, 16, 8.5, '#3b4c8a'); T(c, '1,284', 10, 34, 15, PAL.bg1, 700, 'left', MONO); T(c, '+12%', 90, 35, 8.5, PAL.bg0, 700, 'right', MONO);
    c.strokeStyle = '#2f86d6'; c.lineWidth = 1.6; c.beginPath(); [[56, 20], [62, 15], [68, 18], [74, 11], [82, 13]].forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke();
  } else {
    c.fillStyle = lg(c, 0, 0, 0, 44, [[0, '#2a4392'], [1, '#162960']]); c.fill(); c.strokeStyle = 'rgba(255,255,255,.18)'; c.lineWidth = 1; rr(c, .5, .5, 99, 43, 10); c.stroke();
    c.fillStyle = PAL.accent; c.beginPath(); c.arc(14, 15, 4.5, 0, 6.2832); c.fill(); T(c, '새 알림', 24, 18, 9, PAL.ink, 700); T(c, '주문이 도착했어요', 10, 34, 8.5, PAL.muted);
  }
  return k;
}

// 삼각형 하나에 이미지 조각을 아핀 변환으로 입힌다
function tri(c, img, s, d) {
  const [x0, y0] = s[0], [x1, y1] = s[1], [x2, y2] = s[2], [u0, v0] = d[0], [u1, v1] = d[1], [u2, v2] = d[2];
  const det = (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0); if (Math.abs(det) < 1e-6) return;
  const a = ((u1 - u0) * (y2 - y0) - (u2 - u0) * (y1 - y0)) / det, b = ((v1 - v0) * (y2 - y0) - (v2 - v0) * (y1 - y0)) / det;
  const cc = ((x1 - x0) * (u2 - u0) - (x2 - x0) * (u1 - u0)) / det, dd = ((x1 - x0) * (v2 - v0) - (x2 - x0) * (v1 - v0)) / det;
  const mx = (u0 + u1 + u2) / 3, my = (v0 + v1 + v2) / 3;
  c.save(); c.beginPath();
  d.forEach(([u, v], i) => { const dx = u - mx, dy = v - my, l = Math.hypot(dx, dy) || 1, X = u + dx / l * .7, Y = v + dy / l * .7; i ? c.lineTo(X, Y) : c.moveTo(X, Y); });
  c.closePath(); c.clip(); c.transform(a, b, cc, dd, u0 - a * x0 - cc * y0, v0 - b * x0 - dd * y0); c.drawImage(img, 0, 0); c.restore();
}

const demo = {
  dur: 5.0, rest: 4.2, noCompare: false, levels: 4,
  mount(sp) {
    const cv = el('canvas', null, sp); cv.width = 1280; cv.height = 720; cv.style.cssText = 'position:absolute;left:0;top:0;width:640px;height:360px';
    const rc = mk(1280, 720);
    return { c: cv.getContext('2d'), rc, rcx: rc.getContext('2d'), grain: grainTile(11), tex: phoneTex(), cards: [cardTex(0), cardTex(1)], out: rrPoly(PW, PH, PR), mid: rrPoly(PW - 3.2, PH - 3.2, PR - 1.6), scr: rrPoly(PW - 2 * BZ, PH - 2 * BZ, PR - BZ) };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 4 : lv);   // 1 = 정면 평면, 2 = + 회전·원근, 3 = + 두께·모서리 빛, 4 = + 바닥 반사·떠 있는 카드·카메라 접근
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    c.fillStyle = lg(c, 0, 0, 0, 360, [[0, PAL.bg0], [1, PAL.bg1]]); c.fillRect(0, 0, 640, 360);
    const gl = c.createRadialGradient(320, 140, 10, 320, 140, 280); gl.addColorStop(0, 'rgba(127,224,255,.22)'); gl.addColorStop(1, 'rgba(127,224,255,0)'); c.fillStyle = gl; c.fillRect(0, 0, 640, 360);

    const rot = L >= 2;
    const yaw = rot ? (t < 3.0 ? lerp(-ROT, ROT, E.inOutC(seg(t, .3, 3.0))) : lerp(ROT, ROT * .7, E.outC(seg(t, 3.0, 4.4)))) : 0;
    const pitch = rot ? PITCH : 0, zoom = L >= 4 ? 1 + .06 * E.inOutC(seg(t, 0, 4.6)) : 1;
    const D = L >= 3 ? DEPTH : (rot ? 1.5 : 0);
    const ya = yaw * Math.PI / 180, pa = pitch * Math.PI / 180, cy_ = Math.cos(ya), sy_ = Math.sin(ya), cp = Math.cos(pa), sp_ = Math.sin(pa);
    const rotv = (x, y, z) => { const x1 = x * cy_ + z * sy_, z1 = -x * sy_ + z * cy_; return [x1, y * cp - z1 * sp_, y * sp_ + z1 * cp]; };
    const proj = (x, y, z) => { const r = rotv(x, y, z), k = PERSP / (PERSP + r[2]) * zoom; return [CX + r[0] * k, CY + r[1] * k, r[2]]; };
    const LV = (() => { const v = [-.5, -.6, -.62], n = Math.hypot(...v); return v.map((x) => x / n); })();

    const fy = proj(0, PH / 2, 0)[1];     // 바닥선(폰 아래 끝의 화면 높이)
    const drawScene = (g) => {
      g.save();
      const poly = (pts, z) => pts.map(([x, y]) => proj(x, y, z));
      const path = (P) => { g.beginPath(); P.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); };
      const zf = -D / 2;
      // 옆면(두께): 보이는 것만, 먼 쪽부터
      if (D > 2) {
        const n = s.out.length, faces = [];
        for (let i = 0; i < n; i++) {
          const p = s.out[i], q = s.out[(i + 1) % n], ex = q[0] - p[0], ey = q[1] - p[1], l = Math.hypot(ex, ey) || 1;
          const nn = rotv(ey / l, -ex / l, 0), rm = rotv((p[0] + q[0]) / 2, (p[1] + q[1]) / 2, 0);
          if (nn[0] * -rm[0] + nn[1] * -rm[1] + nn[2] * (-PERSP - rm[2]) > 0) {
            const dif = Math.max(0, nn[0] * LV[0] + nn[1] * LV[1] + nn[2] * LV[2]);
            faces.push({ P: [proj(p[0], p[1], zf), proj(q[0], q[1], zf), proj(q[0], q[1], D / 2), proj(p[0], p[1], D / 2)], dif, z: rm[2] });
          }
        }
        faces.sort((u, v) => v.z - u.z).forEach((f) => {
          const k = Math.min(1, .12 + .95 * f.dif), col = [16, 28, 70].map((v, i) => v + ([196, 210, 248][i] - v) * k);
          path(f.P); g.fillStyle = `rgb(${col.map(Math.round)})`; g.fill(); g.strokeStyle = `rgba(255,255,255,${(.25 * f.dif).toFixed(2)})`; g.lineWidth = .6; g.stroke();
        });
      }
      // 앞면: 금속 테두리 → 검은 베젤 → 화면 이미지
      const F = poly(s.out, zf), xs = F.map((p) => p[0]), ys = F.map((p) => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
      path(F); g.fillStyle = lg(g, x0, y0, x1, y1, [[0, '#8496cf'], [.5, '#2a3a78'], [1, '#0c1534']]); g.fill();
      path(poly(s.mid, zf)); g.fillStyle = '#070d24'; g.fill();
      const sw = PW - 2 * BZ, sh = PH - 2 * BZ, S = poly(s.scr, zf - .1);
      g.save(); path(S); g.clip();
      const GX = 6, GY = 12, grid = [];
      for (let j = 0; j <= GY; j++) { grid.push([]); for (let i = 0; i <= GX; i++) grid[j].push(proj(-sw / 2 + sw * i / GX, -sh / 2 + sh * j / GY, zf - .1)); }
      for (let j = 0; j < GY; j++) for (let i = 0; i < GX; i++) {
        const u0 = i * 192 / GX, u1 = (i + 1) * 192 / GX, v0 = j * 424 / GY, v1 = (j + 1) * 424 / GY, A = grid[j][i], B = grid[j][i + 1], C = grid[j + 1][i + 1], Dd = grid[j + 1][i];
        tri(g, s.tex, [[u0, v0], [u1, v0], [u1, v1]], [A, B, C]); tri(g, s.tex, [[u0, v0], [u1, v1], [u0, v1]], [A, C, Dd]); }
      if (L >= 3) { const q = -yaw / ROT * .5 + .5; g.globalCompositeOperation = 'screen';
        g.fillStyle = lg(g, x0 + (x1 - x0) * (q - .4), y0, x0 + (x1 - x0) * (q + .1), y0 + (y1 - y0) * .5, [[0, 'rgba(255,255,255,0)'], [.5, 'rgba(255,255,255,.22)'], [1, 'rgba(255,255,255,0)']]); g.fillRect(x0, y0, x1 - x0, y1 - y0); }
      g.restore();
      const cam = proj(0, -PH / 2 + BZ + 9, zf - .2); g.fillStyle = '#050a1c'; g.beginPath(); g.arc(cam[0], cam[1], 3.4, 0, 6.2832); g.fill();
      path(F); g.strokeStyle = 'rgba(255,255,255,.26)'; g.lineWidth = .8; g.stroke();
      // 떠 있는 카드(원근 때문에 폰보다 크게, 시차가 생긴다)
      if (L >= 4) [[0, 66, -62, -34, 1.05], [1, -68, 56, -62, 1.5]].forEach(([k, px, py, pz, d0]) => {
        const q = E.outBack(seg(t, d0, d0 + .7)), al = Math.min(1, seg(t, d0, d0 + .35)); if (al <= 0) return;
        const z = lerp(zf - 2, pz, q), W = 100 * lerp(.7, 1, q), H = 44 * lerp(.7, 1, q);
        const gr = []; for (let j = 0; j <= 3; j++) { gr.push([]); for (let i = 0; i <= 6; i++) gr[j].push(proj(px - W / 2 + W * i / 6, py - H / 2 + H * j / 3, z)); }
        g.save(); g.globalAlpha *= al;
        const cs = [gr[0][0], gr[0][6], gr[3][6], gr[3][0]]; path(cs); g.fillStyle = 'rgba(0,0,0,.0)'; g.fill();
        for (let j = 0; j < 3; j++) for (let i = 0; i < 6; i++) { const u0 = i * 200 / 6, u1 = (i + 1) * 200 / 6, v0 = j * 88 / 3, v1 = (j + 1) * 88 / 3;
          tri(g, s.cards[k], [[u0, v0], [u1, v0], [u1, v1]], [gr[j][i], gr[j][i + 1], gr[j + 1][i + 1]]); tri(g, s.cards[k], [[u0, v0], [u1, v1], [u0, v1]], [gr[j][i], gr[j + 1][i + 1], gr[j + 1][i]]); }
        g.restore(); });
      g.restore();
    };
    // 바닥: 접촉 그림자 + 흐려지는 반사
    if (L >= 4) {
      const half = Math.abs(cy_) * PW / 2 + Math.abs(sy_) * D / 2 + 16;
      c.save(); c.translate(CX, fy + 2); c.scale(1, .12); const sg = c.createRadialGradient(0, 0, 4, 0, 0, half * 1.5); sg.addColorStop(0, 'rgba(0,0,0,.6)'); sg.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = sg; c.beginPath(); c.arc(0, 0, half * 1.5, 0, 6.2832); c.fill(); c.restore();
      const rg = s.rcx; rg.setTransform(1, 0, 0, 1, 0, 0); rg.globalCompositeOperation = 'source-over'; rg.globalAlpha = 1; rg.clearRect(0, 0, 1280, 720);
      rg.setTransform(2, 0, 0, -2, 0, 4 * fy); drawScene(rg);
      rg.setTransform(1, 0, 0, 1, 0, 0); rg.globalCompositeOperation = 'destination-in'; rg.fillStyle = lg(rg, 0, fy * 2, 0, fy * 2 + 150, [[0, 'rgba(0,0,0,.34)'], [1, 'rgba(0,0,0,0)']]); rg.fillRect(0, 0, 1280, 720);
      rg.globalCompositeOperation = 'destination-out'; rg.fillStyle = '#000'; rg.fillRect(0, 0, 1280, fy * 2 + 2); rg.globalCompositeOperation = 'source-over';
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(s.rc, 0, 0); c.restore();
    }
    drawScene(c);
    c.globalCompositeOperation = 'overlay'; c.globalAlpha = .06; c.fillStyle = c.createPattern(s.grain, 'repeat'); c.fillRect(0, 0, 640, 360); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
    const names = ['연출 전', '평면', '회전 원근', '두께 빛', '반사 카드 접근'];
    c.save(); c.font = `500 12px ${SANS}`; if ('letterSpacing' in c) c.letterSpacing = '2px'; c.textBaseline = 'middle';
    c.fillStyle = PAL.line; c.fillRect(9, 16, 1, 300);
    let yy = 18; names.forEach((n, i) => { const w = c.measureText(n).width; c.save(); c.translate(24, yy); c.rotate(Math.PI / 2); c.fillStyle = i === L ? PAL.ink : PAL.muted; c.globalAlpha = i === L ? 1 : .85; c.fillText(n, 0, 0); c.restore(); yy += w + 16; });
    c.restore();
  },
};
export default demo;
