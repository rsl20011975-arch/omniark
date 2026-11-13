/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/fpv-steadicam/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng, canvas, rr } from "./helpers.js";
const PAL = { bg0: "#eef2f7", bg1: "#dfe6f0", ink: "#0f1b2d", muted: "#5a6a80", accent: "#2b6cff", accent2: "#ff8a3d", surface: "#ffffff", line: "rgba(15,27,45,.16)" };

// 같은 숲길을 세 가지 카메라로 본다: 손으로 들고 걷기(흔들림) → 스테디캠(걸음 흔들림을 걸러 냄) → FPV 드론(빠르게 날며 관문을 통과하고 기울어 선회). 코드로 흉내 낸 효과이며 실제 장비의 값이 아니다. 화면은 시간 t 의 함수다.
const SPEED = 14;               // FPV 드론의 비행 속도(m/초). 걷는 속도는 3m/초
const BANK = 28;                // FPV 가 커브에서 기울이는 최대 각도(도)
const HAND = 1;                 // 손으로 든 카메라의 흔들림 배율(1 = 100%)

const TAU = Math.PI * 2;
const INK = PAL.ink, SEC = "#33435a", MUT = PAL.muted, ORG = PAL.accent2, ORG_T = "#c2410c", BLU_T = "#1f55d6";   // ORG_T, BLU_T = 흰 바탕 글자 대비 4.5:1 이상으로 어둡게 한 값
const SANS = '"IBM Plex Sans KR","Malgun Gothic",sans-serif', MONO = '"JetBrains Mono","Malgun Gothic",monospace';
const T = (c, s, x, y, z, col, w, al, f) => { c.save(); c.fillStyle = col; c.font = (w || 500) + " " + z + "px " + (f || SANS); c.textAlign = al || "left"; c.textBaseline = "alphabetic"; c.fillText(s, x, y); c.restore(); };
function grainTile(seed) { const g = document.createElement("canvas"); g.width = g.height = 96; const x = g.getContext("2d"), im = x.createImageData(96, 96), r = rng(seed); for (let i = 0; i < 96 * 96; i++) { const v = (r() * 255) | 0; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } x.putImageData(im, 0, 0); return g; }
function pill(c, s, col) { c.save(); c.font = "500 12px " + SANS; const w = c.measureText(s).width + 22; c.shadowColor = "rgba(15,27,45,.22)"; c.shadowBlur = 6; c.shadowOffsetY = 2; rr(c, 14, 12, w, 22, 11); c.fillStyle = "rgba(255,255,255,.94)"; c.fill(); c.shadowColor = "transparent"; c.strokeStyle = PAL.line; c.lineWidth = 1; c.stroke(); c.fillStyle = col || INK; c.textBaseline = "alphabetic"; c.fillText(s, 25, 27.5); c.restore(); }
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, p) => { const A = hex(a), B = hex(b); return "rgb(" + A.map((v, i) => Math.round(lerp(v, B[i], p))).join(",") + ")"; };
const cl = (x, a, b) => Math.min(b, Math.max(a, x));
const F = 300, CX = 320, CY = 172, FOG = PAL.bg1;
const xp = (z) => 3.2 * Math.sin(z * 0.09) + 1.2 * Math.sin(z * 0.23);
const dxp = (z) => 3.2 * 0.09 * Math.cos(z * 0.09) + 1.2 * 0.23 * Math.cos(z * 0.23);
const xf = (z) => xp(z) + 1.3 * Math.sin(0.19 * z), dxf = (z) => dxp(z) + 1.3 * 0.19 * Math.cos(0.19 * z);
const yf = (z) => 1.1 + 0.55 * Math.sin(0.075 * z + 1);
const ease0 = (t) => (t < 0.8 ? t * t / 1.6 : t - 0.4);   // 출발할 때 속도가 0 에서 천천히 오른다
const yawF = (z) => Math.atan(dxf(z));

// 카메라 자세: mode 0 = 손으로 듦, 1 = 스테디캠, 2 = FPV 드론
function camera(t, mode) {
  if (mode === 2) {
    const z = SPEED * ease0(t), yaw = yawF(z + 1), curv = (yawF(z + 2) - yawF(z)) / 2;
    return { z, x: xf(z), y: yf(z), yaw, py: 0, roll: BANK * Math.PI / 180 * cl(curv * 10, -1, 1) };
  }
  const z = 3 * ease0(t), k = mode === 0 ? HAND : 0.08;
  const bob = 6 * Math.sin(TAU * 1.9 * t) + 2.5 * Math.sin(TAU * 3.7 * t + 1.3) + 1.5 * Math.sin(TAU * 7.1 * t + 0.4);
  return { z, x: xp(z) + 0.05 * k * Math.sin(TAU * 0.95 * t) + (mode === 1 ? 0 : 0), y: 1.5 + 0.05 * k * Math.sin(TAU * 1.9 * t), yaw: Math.atan(dxp(z + 4)) + 0.012 * k * Math.sin(TAU * 1.3 * t + 2), py: k * bob, roll: k * 0.018 * (Math.sin(TAU * 1.3 * t) + 0.6 * Math.sin(TAU * 3.1 * t)) };
}
function proj(wx, wy, wz, cam) {
  const rx = wx - cam.x, rz = wz - cam.z, c = Math.cos(cam.yaw), s = Math.sin(cam.yaw), cx = rx * c - rz * s, cz = rx * s + rz * c;
  if (cz < 0.5) return null; const k = F / cz; return [CX + cx * k, CY - (wy - cam.y) * k + cam.py, k, cz];
}
const fogF = (cz) => Math.pow(cl((cz - 5) / 72, 0, 1), 0.8);

function drawTree(c, tr, cam) {
  const b = proj(tr.x, 0, tr.z, cam); if (!b || b[3] > 88) return; const [sx, sy, k, cz] = b, f = fogF(cz), h = tr.h * k, w = tr.w * k;
  c.fillStyle = mix("#4a3a2d", FOG, f); c.fillRect(sx - 0.18 * k, sy - 1.3 * k, 0.36 * k, 1.3 * k);
  for (let i = 0; i < 3; i++) {
    const by = sy - (1.0 + i * tr.h * 0.24) * k, ty = by - tr.h * 0.5 * k, bw = w * (1 - i * 0.22);
    c.fillStyle = mix(tr.tone ? "#3f7a58" : "#37704f", FOG, f); c.beginPath(); c.moveTo(sx, ty); c.lineTo(sx - bw, by); c.lineTo(sx, by); c.closePath(); c.fill();
    c.fillStyle = mix(tr.tone ? "#25513c" : "#21472f", FOG, f); c.beginPath(); c.moveTo(sx, ty); c.lineTo(sx, by); c.lineTo(sx + bw, by); c.closePath(); c.fill();
  }
}
function drawRunner(c, t, cam, zs) {
  const b = proj(xp(zs), 0, zs, cam); if (!b) return; const [sx, sy, k, cz] = b, f = fogF(cz) * 0.5, ph = TAU * 1.9 * t;
  c.save(); c.translate(sx, sy);
  c.fillStyle = "rgba(15,27,45,.30)"; c.beginPath(); c.ellipse(0, 0, 0.55 * k, 0.14 * k, 0, 0, TAU); c.fill();
  c.lineCap = "round";
  [-1, 1].forEach((sd) => { const sw = Math.sin(ph + (sd > 0 ? 0 : Math.PI)), fx = sd * 0.14 * k, ft = Math.max(0, Math.cos(ph + (sd > 0 ? 0 : Math.PI))) * 0.18; c.strokeStyle = mix(sd > 0 ? "#222c46" : "#1b2338", FOG, f); c.lineWidth = 0.19 * k; c.beginPath(); c.moveTo(fx, -0.98 * k); c.lineTo(fx + sw * 0.1 * k, -0.52 * k - ft * 0.2 * k); c.lineTo(fx + sw * 0.2 * k, -0.08 * k - ft * k); c.stroke(); });
  const tg = c.createLinearGradient(-0.3 * k, 0, 0.3 * k, 0); tg.addColorStop(0, mix("#f07a58", FOG, f)); tg.addColorStop(0.6, mix("#d24c30", FOG, f)); tg.addColorStop(1, mix("#9b3322", FOG, f));
  rr(c, -0.27 * k, -1.62 * k, 0.54 * k, 0.78 * k, 0.12 * k); c.fillStyle = tg; c.fill();
  rr(c, -0.17 * k, -1.52 * k, 0.34 * k, 0.5 * k, 0.07 * k); c.fillStyle = mix("#26365a", FOG, f); c.fill();
  c.fillStyle = "rgba(255,255,255,.28)"; c.fillRect(-0.26 * k, -1.58 * k, 0.04 * k, 0.6 * k);
  [-1, 1].forEach((sd) => { const sw = Math.sin(ph + (sd > 0 ? Math.PI : 0)); c.strokeStyle = mix(sd > 0 ? "#b8402a" : "#8f301f", FOG, f); c.lineWidth = 0.13 * k; c.beginPath(); c.moveTo(sd * 0.3 * k, -1.52 * k); c.lineTo(sd * 0.34 * k + sw * 0.05 * k, -1.2 * k); c.lineTo(sd * 0.3 * k + sw * 0.12 * k, -0.98 * k); c.stroke(); });
  const hg = c.createRadialGradient(-0.04 * k, -1.8 * k, 0.01 * k, 0, -1.74 * k, 0.17 * k); hg.addColorStop(0, mix("#f1c4a0", FOG, f)); hg.addColorStop(1, mix("#b88460", FOG, f));
  c.fillStyle = hg; c.beginPath(); c.arc(0, -1.74 * k, 0.14 * k, 0, TAU); c.fill(); c.fillStyle = mix("#1c1812", FOG, f); c.beginPath(); c.arc(0, -1.77 * k, 0.145 * k, Math.PI * 1.02, Math.PI * 1.98); c.fill();
  c.restore();
}

const demo = {
  dur: 5, rest: 4.4, noCompare: false, levels: 3,
  mount(sp) {
    const c = canvas(sp), r = rng(91), trees = []; c.canvas.style.cssText = "width:640px;height:360px;display:block";
    for (let z = 3; z < 280; z += 3.1) [-1, 1].forEach((sd) => { const zz = z + r() * 1.6, off = 3.6 + r() * 7; trees.push({ z: zz, x: xp(zz) + sd * off, h: 5 + r() * 4, w: 1.1 + r() * 0.5, tone: r() > 0.5 }); });
    trees.sort((a, b) => b.z - a.z);
    const streaks = []; for (let i = 0; i < 46; i++) streaks.push([r() * TAU, r(), 0.4 + r() * 0.6]);
    return { c, grain: grainTile(77), trees, streaks };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 손으로 들고 따라가기, 2 = 스테디캠, 3 = FPV 드론
    const mode = L >= 3 ? 2 : (L === 2 ? 1 : 0), cam = camera(t, mode), c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1;
    const rot = -cam.roll, zoom = 1 + Math.abs(rot) * 0.95;
    c.save(); c.translate(CX, 180); c.rotate(rot); c.scale(zoom, zoom); c.translate(-CX, -180);
    const hor = CY + cam.py + Math.tan(0) * 0;
    // 하늘과 먼 산
    const sk = c.createLinearGradient(0, 0, 0, hor); sk.addColorStop(0, "#b9cff0"); sk.addColorStop(0.55, "#d3e1f4"); sk.addColorStop(1, PAL.bg0); c.fillStyle = sk; c.fillRect(-120, -120, 880, hor + 120);
    const sh = -cam.yaw * F * 0.9, sg = c.createRadialGradient(CX + sh + 90, hor - 6, 4, CX + sh + 90, hor - 6, 190); sg.addColorStop(0, "rgba(255,250,238,.9)"); sg.addColorStop(1, "rgba(255,244,222,0)"); c.fillStyle = sg; c.fillRect(-120, hor - 200, 880, 230);
    [["#c4d0e2", 22, 0.012, 1.3, 0.8], ["#a9b9cf", 13, 0.02, 4.1, 1]].forEach(([col, amp, fq, ph, par]) => { c.fillStyle = col; c.beginPath(); c.moveTo(-120, hor + 2); for (let x = -120; x <= 760; x += 8) c.lineTo(x, hor - amp - amp * 0.7 * Math.sin((x - sh * par) * fq + ph) - amp * 0.4 * Math.sin((x - sh * par) * fq * 2.7 + ph)); c.lineTo(760, hor + 2); c.closePath(); c.fill(); });
    // 땅
    const gg = c.createLinearGradient(0, hor, 0, 420); gg.addColorStop(0, mix("#6f8a6c", FOG, 0.72)); gg.addColorStop(0.3, "#5b7a58"); gg.addColorStop(1, "#334a35"); c.fillStyle = gg; c.fillRect(-120, hor, 880, 420 - hor);
    // 길
    for (let z = cam.z + 90; z > cam.z + 0.7; z -= 1.5) {
      const z2 = z - 1.5, a1 = proj(xp(z) - 2.2, 0, z, cam), b1 = proj(xp(z) + 2.2, 0, z, cam), a2 = proj(xp(z2) - 2.2, 0, Math.max(z2, cam.z + 0.55), cam), b2 = proj(xp(z2) + 2.2, 0, Math.max(z2, cam.z + 0.55), cam);
      if (!a1 || !b1 || !a2 || !b2) continue; const f = fogF(z - cam.z);
      c.fillStyle = mix(((Math.floor(z / 1.5)) % 2) ? "#d2c6ad" : "#c7bba2", FOG, f); c.beginPath(); c.moveTo(a1[0], a1[1]); c.lineTo(b1[0], b1[1]); c.lineTo(b2[0], b2[1]); c.lineTo(a2[0], a2[1]); c.closePath(); c.fill();
    }
    // 나무, 인물, 관문
    const rings = []; if (L >= 3) for (let k = 1; k < 24; k++) { const zr = 14 * k; if (zr > cam.z + 0.6 && zr < cam.z + 80) rings.push(zr); }
    const zs = cam.z + 6.5;
    const items = s.trees.filter((tr) => tr.z > cam.z + 0.6 && tr.z < cam.z + 88).map((tr) => ({ z: tr.z, d: () => drawTree(c, tr, cam) }));
    if (L < 3) items.push({ z: zs, d: () => drawRunner(c, t, cam, zs) });
    rings.forEach((zr) => items.push({ z: zr, d: () => { const p = proj(xf(zr), yf(zr), zr, cam); if (!p) return; const r = 1.25 * p[2], f = fogF(p[3]); c.save(); c.strokeStyle = "rgba(15,27,45," + (0.34 - 0.2 * f).toFixed(2) + ")"; c.lineWidth = Math.max(3.5, 0.14 * p[2] + 2.5); c.beginPath(); c.arc(p[0], p[1], r, 0, TAU); c.stroke(); c.strokeStyle = "rgba(255,138,61," + (0.98 - 0.45 * f).toFixed(2) + ")"; c.shadowColor = ORG; c.shadowBlur = 8; c.lineWidth = Math.max(2, 0.14 * p[2]); c.beginPath(); c.arc(p[0], p[1], r, 0, TAU); c.stroke(); c.shadowBlur = 0; c.strokeStyle = "rgba(255,255,255," + (0.8 - 0.45 * f).toFixed(2) + ")"; c.lineWidth = Math.max(1, 0.04 * p[2]); c.beginPath(); c.arc(p[0], p[1], r - 0.07 * p[2], 0, TAU); c.stroke(); c.restore(); } }));
    items.sort((p, q) => q.z - p.z).forEach((it) => it.d());
    // 속도선(FPV)
    if (L >= 3) { const sp = cl(SPEED / 14, 0.3, 2) * seg(t, 0.2, 1.2); s.streaks.forEach(([ang, r0, ln]) => { const q = (r0 + t * SPEED * 0.05) % 1, d0 = 100 + 170 * q, d1 = d0 + 40 * ln * sp; c.strokeStyle = "rgba(15,27,45," + (0.4 * q * sp).toFixed(3) + ")"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(CX + Math.cos(ang) * d0 * 1.5, 180 + Math.sin(ang) * d0 * 0.9); c.lineTo(CX + Math.cos(ang) * d1 * 1.5, 180 + Math.sin(ang) * d1 * 0.9); c.stroke(); }); }
    c.restore();
    // 비네트와 그레인
    const vg = c.createRadialGradient(CX, 180, 140, CX, 180, 400); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(15,27,45,.30)"); c.fillStyle = vg; c.fillRect(0, 0, 640, 360);
    c.save(); c.globalAlpha = 0.05; c.fillStyle = c.createPattern(s.grain, "repeat"); c.fillRect(0, 0, 640, 360); c.restore();
    // 흔들림 그래프(최근 2초)
    const gx0 = 16, gy0 = 292, gw = 196, gh = 50; rr(c, gx0, gy0, gw, gh, 8); c.save(); c.shadowColor = "rgba(15,27,45,.25)"; c.shadowBlur = 8; c.shadowOffsetY = 2; c.fillStyle = "rgba(255,255,255,.94)"; c.fill(); c.restore(); c.strokeStyle = PAL.line; c.lineWidth = 1; c.stroke();
    const N = 40, vals = []; for (let i = 0; i <= N; i++) { const tt = Math.max(0, t - 2 + 2 * i / N), cm = camera(tt, mode); vals.push(mode === 2 ? cm.roll * 180 / Math.PI : cm.py); }
    const sc = mode === 2 ? Math.max(8, BANK + 4) : 12, my = gy0 + 33;
    c.strokeStyle = "rgba(15,27,45,.22)"; c.beginPath(); c.moveTo(gx0 + 8, my + 0.5); c.lineTo(gx0 + gw - 8, my + 0.5); c.stroke();
    c.beginPath(); vals.forEach((v, i) => { const x = gx0 + 8 + (gw - 16) * i / N, y = my - cl(v / sc, -1, 1) * 13; i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.strokeStyle = mode === 2 ? ORG_T : PAL.accent; c.lineWidth = 1.8; c.lineJoin = "round"; c.stroke();
    const amp = Math.max(...vals.map(Math.abs));
    T(c, mode === 2 ? "기울기 · 최근 2초" : "위아래 흔들림 · 2초", gx0 + 8, gy0 + 13, 10.5, SEC, 700);
    T(c, mode === 2 ? "최대 " + amp.toFixed(0) + "°" : "최대 ±" + amp.toFixed(1) + "px", gx0 + gw - 8, gy0 + 13, 10.5, mode === 2 ? ORG_T : BLU_T, 700, "right", MONO);
    const tag = L <= 1 ? (L === 0 ? "연출 전 · " : "") + "손으로 들고 따라가기 · 걸음마다 화면이 흔들림" : L === 2 ? "스테디캠 · 걸음 흔들림을 걸러 미끄러지듯 따라감" : "FPV 드론 · " + SPEED + "m/초로 관문을 통과하며 기울여 선회";
    pill(c, tag, L === 0 ? ORG_T : INK);
    T(c, "코드로 흉내 낸 장면입니다 (실제 장비의 값이 아님)", 626, 350, 10, "rgba(255,255,255,.8)", 500, "right");
  },
};
export default demo;
