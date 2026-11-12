/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/high-low-angle/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng, canvas, rr } from "./helpers.js";

// 같은 영웅 조각상을 눈높이 → 하이 앵글(위에서 내려다봄) → 로우 앵글(아래에서 올려다봄)로 찍어 본다. 카메라 높이·각도에 따라 피사체의 크기와 인상이 달라진다. 코드로 계산한 3D 장면이다. 화면은 시간 t 의 함수다.
const HIGH = 45;                // 하이 앵글: 위에서 내려다보는 각도(도)
const LOW = 12;                 // 로우 앵글: 아래에서 올려다보는 각도(도)

const TAU = Math.PI * 2;
const INK = "#f4efe4", SEC = "#c3c2b7", MUT = "#8b94a3", ORG = "#ff8a3d", BLUE_L = "#86b6ef";
const SANS = '"IBM Plex Sans KR","Malgun Gothic",sans-serif', MONO = '"JetBrains Mono","Malgun Gothic",monospace';
const T = (c, s, x, y, z, col, w, al, f) => { c.save(); c.fillStyle = col; c.font = (w || 500) + " " + z + "px " + (f || SANS); c.textAlign = al || "left"; c.textBaseline = "alphabetic"; c.fillText(s, x, y); c.restore(); };
function grainTile(seed) { const g = document.createElement("canvas"); g.width = g.height = 96; const x = g.getContext("2d"), im = x.createImageData(96, 96), r = rng(seed); for (let i = 0; i < 96 * 96; i++) { const v = (r() * 255) | 0; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } x.putImageData(im, 0, 0); return g; }
function pill(c, s, col) { c.save(); c.font = "500 12px " + SANS; const w = c.measureText(s).width + 22; rr(c, 14, 12, w, 22, 11); c.fillStyle = "rgba(8,10,20,.78)"; c.fill(); c.strokeStyle = "rgba(255,255,255,.16)"; c.lineWidth = 1; c.stroke(); c.fillStyle = col || INK; c.textBaseline = "alphabetic"; c.fillText(s, 25, 27.5); c.restore(); }
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const shadeHex = (h, k) => "#" + hex(h).map((q) => Math.max(0, Math.min(255, Math.round(q * k))).toString(16).padStart(2, "0")).join("");
const mixc = (a, b, p) => { const A = hex(a), B = hex(b); return "rgb(" + A.map((v, i) => Math.round(lerp(v, B[i], p))).join(",") + ")"; };
const F = 300, CXs = 320, CYs = 188, LD = (() => { const v = [-0.45, 0.75, -0.5], n = Math.hypot(...v); return v.map((q) => q / n); })();

function boxFaces(cx, cy, cz, w, h, d, col) {
  const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2, z0 = cz - d / 2, z1 = cz + d / 2;
  const fs = [
    { n: [0, 0, -1], v: [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]] }, { n: [0, 0, 1], v: [[x1, y0, z1], [x0, y0, z1], [x0, y1, z1], [x1, y1, z1]] },
    { n: [-1, 0, 0], v: [[x0, y0, z1], [x0, y0, z0], [x0, y1, z0], [x0, y1, z1]] }, { n: [1, 0, 0], v: [[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]] },
    { n: [0, 1, 0], v: [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]] }, { n: [0, -1, 0], v: [[x0, y0, z1], [x1, y0, z1], [x1, y0, z0], [x0, y0, z0]] },
  ];
  return fs.map((f) => ({ ...f, col, c: [cx + f.n[0] * w / 2, cy + f.n[1] * h / 2, cz + f.n[2] * d / 2] }));
}
function makeCam(el, R, ty) { const e = el * Math.PI / 180; return { e, P: [0, ty + R * Math.sin(e), -R * Math.cos(e)], f: [0, -Math.sin(e), Math.cos(e)], up: [0, Math.cos(e), Math.sin(e)] }; }
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
function toScreen(cam, p) { const d = [p[0] - cam.P[0], p[1] - cam.P[1], p[2] - cam.P[2]], cz = dot(d, cam.f); if (cz < 0.25) return null; return [CXs + F * d[0] / cz, CYs - F * dot(d, cam.up) / cz, cz]; }

const demo = {
  dur: 5.4, rest: 5.0, noCompare: false, levels: 3,
  mount(sp) {
    const c = canvas(sp); c.canvas.style.cssText = "width:640px;height:360px;display:block";
    const faces = [];
    const B = [[-9, 8, 24, 5, 14, 5, "#2b3658"], [-3.5, 8, 30, 4, 22, 4, "#323f66"], [4, 8, 28, 5, 17, 5, "#2b3658"], [10, 8, 22, 4, 11, 4, "#38466f"], [-14, 8, 18, 4, 9, 4, "#323f66"], [15, 8, 32, 6, 26, 6, "#2b3658"]];
    B.forEach(([x, y, z, w, h, d, col]) => faces.push(...boxFaces(x, h / 2, z, w, h, d, col)));
    faces.push(...boxFaces(0, 0.12, 0, 1.9, 0.24, 1.9, "#6c7384"));                       // 단상
    faces.push(...boxFaces(-0.2, 0.69, 0, 0.3, 0.9, 0.32, "#2a3a64"), ...boxFaces(0.2, 0.69, 0, 0.3, 0.9, 0.32, "#2a3a64"));   // 다리
    faces.push(...boxFaces(0, 1.37, 0.28, 0.8, 0.95, 0.06, "#6b2230"));                  // 망토
    faces.push(...boxFaces(0, 1.28, 0, 0.82, 0.78, 0.42, "#d24c30"));                    // 몸통
    faces.push(...boxFaces(0, 1.71, 0, 0.2, 0.1, 0.2, "#b88460"));                     // 목
    faces.push(...boxFaces(0, 0.92, 0, 0.86, 0.1, 0.46, "#f0c050"));                     // 허리띠
    faces.push(...boxFaces(-0.56, 1.28, 0, 0.22, 0.7, 0.26, "#b8402a"), ...boxFaces(0.56, 1.28, 0, 0.22, 0.7, 0.26, "#b8402a"));   // 팔
    const stars = []; const r = rng(5); for (let i = 0; i < 30; i++) stars.push([r(), r() * 0.6, 0.4 + r() * 0.6]);
    return { c, grain: grainTile(13), faces, stars };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 눈높이만, 2 = + 하이 앵글, 3 = + 로우 앵글
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1;
    const eye = { el: 0, R: 3.8, ty: 1.3 }, hi = { el: HIGH, R: 6.8, ty: 1.0 }, lo = { el: -LOW, R: 1.15 / Math.sin(LOW * Math.PI / 180), ty: 1.3 };
    const p = L >= 2 ? E.inOutC(seg(t, 1.1, 2.0)) : 0, q = L >= 3 ? E.inOutC(seg(t, 3.1, 4.4)) : 0;
    const A = { el: lerp(eye.el, hi.el, p), R: lerp(eye.R, hi.R, p), ty: lerp(eye.ty, hi.ty, p) };
    const K = { el: lerp(A.el, lo.el, q), R: lerp(A.R, lo.R, q), ty: lerp(A.ty, lo.ty, q) };
    const cam = makeCam(K.el, K.R, K.ty), hy = CYs - F * Math.tan(cam.e);
    // 하늘
    const sk = c.createLinearGradient(0, hy - 380, 0, hy); sk.addColorStop(0, "#0f1a38"); sk.addColorStop(0.7, "#4c5c93"); sk.addColorStop(1, "#f0b585"); c.fillStyle = sk; c.fillRect(0, 0, 640, Math.min(360, Math.max(0, hy)) + 1);
    if (hy > 0) { s.stars.forEach(([x, y, a2]) => { const yy = hy - 330 * (1 - y) - 30; if (yy < 0 || yy > hy - 40) return; c.fillStyle = "rgba(255,245,225," + (0.5 * a2).toFixed(2) + ")"; c.fillRect(x * 640, yy, 1.4, 1.4); }); const sg = c.createRadialGradient(470, hy - 8, 4, 470, hy - 8, 200); sg.addColorStop(0, "rgba(255,214,160,.7)"); sg.addColorStop(1, "rgba(255,190,130,0)"); c.fillStyle = sg; c.fillRect(0, Math.max(0, hy - 220), 640, 230); }
    // 땅
    if (hy < 360) { const y0 = Math.max(0, hy), gg = c.createLinearGradient(0, y0, 0, 360); gg.addColorStop(0, mixc("#2c3347", "#d99a6c", hy > 0 ? 0.55 : 0)); gg.addColorStop(0.35, "#232a3b"); gg.addColorStop(1, "#171c29"); c.fillStyle = gg; c.fillRect(0, y0, 640, 360 - y0); }
    // 바닥 격자
    const seg3 = (a3, b3) => { const sa = toScreen(cam, a3), sb = toScreen(cam, b3); if (sa && sb) return [sa, sb]; if (!sa && !sb) return null; const pa = sa ? a3 : b3, pb = sa ? b3 : a3, da = dot([pa[0] - cam.P[0], pa[1] - cam.P[1], pa[2] - cam.P[2]], cam.f), db = dot([pb[0] - cam.P[0], pb[1] - cam.P[1], pb[2] - cam.P[2]], cam.f), u = (0.3 - da) / (db - da), pm = [pa[0] + (pb[0] - pa[0]) * u, pa[1] + (pb[1] - pa[1]) * u, pa[2] + (pb[2] - pa[2]) * u], sm = toScreen(cam, pm); return sm ? [sa || sm, sb || sm] : null; };
    c.lineWidth = 1;
    for (let i = -14; i <= 14; i++) { [[[i, 0, -14], [i, 0, 40]], [[-14 + 0, 0, i + 14], [14, 0, i + 14]]].forEach((ln, k) => { const sg2 = seg3(ln[0], ln[1]); if (!sg2) return; c.strokeStyle = "rgba(120,140,190," + (i % 5 === 0 ? 0.3 : 0.16) + ")"; c.beginPath(); c.moveTo(sg2[0][0], sg2[0][1]); c.lineTo(sg2[1][0], sg2[1][1]); c.stroke(); }); }
    // 그림자(바닥에 비친 타원)
    c.beginPath(); for (let i = 0; i < 28; i++) { const a4 = i / 28 * TAU, pt = toScreen(cam, [0.7 + Math.cos(a4) * 1.15, 0.01, 0.9 + Math.sin(a4) * 0.7]); if (pt) (i ? c.lineTo(pt[0], pt[1]) : c.moveTo(pt[0], pt[1])); } c.closePath(); c.fillStyle = "rgba(0,0,0,.32)"; c.fill();
    // 면 그리기(먼 것부터)
    const items = [];
    s.faces.forEach((f) => { const toCam = [cam.P[0] - f.c[0], cam.P[1] - f.c[1], cam.P[2] - f.c[2]]; if (dot(f.n, toCam) <= 0) return; const d = dot([f.c[0] - cam.P[0], f.c[1] - cam.P[1], f.c[2] - cam.P[2]], cam.f); if (d < 0.3) return; items.push({ d, f }); });
    items.push({ d: dot([0 - cam.P[0], 1.9 - cam.P[1], 0 - cam.P[2]], cam.f), head: true });
    items.sort((x, y) => y.d - x.d).forEach((it) => {
      if (it.head) { const pc = toScreen(cam, [0, 1.92, 0]); if (!pc) return; const r = 0.21 * F / pc[2]; const hg = c.createRadialGradient(pc[0] - r * 0.4, pc[1] - r * 0.45, r * 0.1, pc[0], pc[1], r * 1.05); hg.addColorStop(0, "#f6d2b2"); hg.addColorStop(0.7, "#c58f68"); hg.addColorStop(1, "#7d553e"); c.fillStyle = hg; c.beginPath(); c.arc(pc[0], pc[1], r, 0, TAU); c.fill(); c.strokeStyle = "rgba(255,255,255,.25)"; c.lineWidth = 1; c.beginPath(); c.arc(pc[0], pc[1], r - 0.5, Math.PI * 1.05, Math.PI * 1.55); c.stroke(); return; }
      const f = it.f, pts = f.v.map((v) => toScreen(cam, v)); if (pts.some((q2) => !q2)) return; const lam = Math.max(0, dot(f.n, LD)), k = 0.4 + 0.75 * lam;
      c.beginPath(); pts.forEach((q2, i) => (i ? c.lineTo(q2[0], q2[1]) : c.moveTo(q2[0], q2[1]))); c.closePath(); const fog = Math.min(0.55, Math.max(0, (it.d - 14) / 50));
      c.fillStyle = mixc(shadeHex(f.col, k), "#d99a6c", fog); c.fill();
      c.strokeStyle = "rgba(0,0,0,.28)"; c.lineWidth = 0.8; c.stroke();
      if (f.n[1] === 1) { c.strokeStyle = "rgba(255,255,255,.3)"; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); c.lineTo(pts[1][0], pts[1][1]); c.stroke(); }
    });
    // 비네트·그레인
    const vg = c.createRadialGradient(320, 190, 150, 320, 190, 400); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.5)"); c.fillStyle = vg; c.fillRect(0, 0, 640, 360);
    c.save(); c.globalAlpha = 0.05; c.fillStyle = c.createPattern(s.grain, "repeat"); c.fillRect(0, 0, 640, 360); c.restore();
    // 읽는 값: 카메라 높이, 피사체가 화면에서 차지하는 높이
    const foot = toScreen(cam, [0, 0.24, 0]), top = toScreen(cam, [0, 2.15, 0]), hpct = foot && top ? Math.round(Math.abs(foot[1] - top[1]) / 360 * 100) : 0;
    const deg = K.el, kind = deg > 20 ? "high" : deg < -12 ? "low" : "eye";
    rr(c, 440, 46, 186, 78, 10); c.fillStyle = "rgba(8,10,20,.78)"; c.fill(); c.strokeStyle = "rgba(255,255,255,.16)"; c.lineWidth = 1; c.stroke();
    T(c, "카메라 높이", 452, 66, 11, SEC, 500); T(c, cam.P[1].toFixed(1) + " m", 614, 66, 12, INK, 700, "right", MONO);
    T(c, "피사체의 화면 높이", 452, 84, 11, SEC, 500); T(c, hpct + "%", 614, 84, 12, INK, 700, "right", MONO);
    const imp = kind === "high" ? "작고 약해 보임" : kind === "low" ? "크고 강해 보임" : "중립 · 평범함"; c.fillStyle = kind === "high" ? BLUE_L : kind === "low" ? ORG : "#c3c2b7"; c.beginPath(); c.arc(456, 105, 4.5, 0, TAU); c.fill(); T(c, "인상: " + imp, 468, 109, 12, INK, 700);
    const tag = kind === "high" ? "하이 앵글 · 위에서 " + Math.round(deg) + "° 내려다봄" : kind === "low" ? "로우 앵글 · 아래에서 " + Math.round(-deg) + "° 올려다봄" : (L === 0 ? "연출 전 · " : "") + "눈높이(아이 레벨) · 정면에서 평평하게";
    pill(c, tag, L === 0 ? "#ffd9b0" : INK);
    T(c, "코드로 계산한 장면입니다", 626, 350, 10, "rgba(255,255,255,.55)", 500, "right");
  },
};
export default demo;
