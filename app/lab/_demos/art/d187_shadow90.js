/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/alpha-channel/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, rng, canvas, rr } from "./helpers.js";

// 같은 그림을 ① 색(RGB) ② 알파 ③ 체커보드 위 ④ 사진 위로 나눠 보며 알파 채널이 하는 일을 본다. 도식이며, 화면은 시간 t 의 함수다.
const SHADOW = 0.9;               // 그림자 알파의 가장 진한 값(0 = 없음, 1 = 완전 불투명)
const BG_NIGHT = 0;               // 1 이면 합성할 사진 배경이 노을 하늘 대신 밤하늘이 된다
const SANS = '"IBM Plex Sans KR","Malgun Gothic",sans-serif', MONO = '"JetBrains Mono","Malgun Gothic",monospace';
const T = (c, s, x, y, z, col, w, al, f) => { c.save(); c.fillStyle = col; c.font = (w || 500) + " " + z + "px " + (f || SANS); c.textAlign = al || "left"; c.textBaseline = "alphabetic"; c.fillText(s, x, y); c.restore(); };
function grainTile(seed) { const g = document.createElement("canvas"); g.width = g.height = 96; const x = g.getContext("2d"), im = x.createImageData(96, 96), r = rng(seed); for (let i = 0; i < 96 * 96; i++) { const v = (r() * 255) | 0; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } x.putImageData(im, 0, 0); return g; }
function backdrop(c, grain) {
  const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, "#0e1424"); g.addColorStop(1, "#080b13"); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
  const r = c.createRadialGradient(320, 150, 20, 320, 150, 360); r.addColorStop(0, "rgba(70,110,190,.10)"); r.addColorStop(1, "rgba(70,110,190,0)"); c.fillStyle = r; c.fillRect(0, 0, 640, 360);
  c.save(); c.globalAlpha = 0.045; c.fillStyle = c.createPattern(grain, "repeat"); c.fillRect(0, 0, 640, 360); c.restore();
}
function pill(c, s) { c.save(); c.font = "500 12px " + SANS; const w = c.measureText(s).width + 22; rr(c, 14, 12, w, 22, 11); c.fillStyle = "rgba(8,10,20,.78)"; c.fill(); c.strokeStyle = "rgba(255,255,255,.16)"; c.lineWidth = 1; c.stroke(); c.restore(); T(c, s, 25, 27, 12, "#fff", 500); }

const PW = 144, PH = 128, K = 2, PY = 62, PXS = (i) => 14 + i * 156;
const cl = (x) => Math.max(0, Math.min(1, x));
// 그림 한 장: 구슬 + 부드러운 그림자 + 반투명 유리 칩. 점마다 (색, 알파)를 계산한다
function sample(px, py) {
  const cx = 70, cy = 56, R = 34;
  const d = Math.hypot(px - cx, py - cy), aO = cl((R - d) * K + 0.5);
  const nx = (px - cx) / R, ny = (py - cy) / R, nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
  const lx = -0.5, ly = -0.6, lz = 0.62, ll = Math.hypot(lx, ly, lz), diff = Math.max(0, (nx * lx + ny * ly + nz * lz) / ll);
  const hx = lx / ll, hy = ly / ll, hz = lz / ll + 1, hh = Math.hypot(hx, hy, hz), sp = Math.pow(Math.max(0, (nx * hx + ny * hy + nz * hz) / hh), 36);
  const rim = Math.pow(1 - nz, 3) * 0.35;
  const oc = [Math.min(255, 255 * (0.2 + 0.82 * diff) + 255 * sp * 0.85 + 40 * rim), Math.min(255, 138 * (0.2 + 0.82 * diff) + 255 * sp * 0.85 + 20 * rim), Math.min(255, 58 * (0.2 + 0.82 * diff) + 255 * sp * 0.85 + 60 * rim)];
  const sx = (px - cx - 6) / 46, sy = (py - 99) / 12, aS = SHADOW * Math.exp(-(sx * sx + sy * sy) * 1.6);
  let A = aS, C = [0, 0, 0];
  const A2 = aO + A * (1 - aO); if (A2 > 0) C = [0, 1, 2].map((k) => (oc[k] * aO + C[k] * A * (1 - aO)) / A2); A = A2;
  const qx = Math.abs(px - 115) - 11, qy = Math.abs(py - 88) - 14, sd = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - 7;
  const shape = cl(0.5 - sd * K), edge = sd > -1.6;
  const ga = shape * (edge ? 0.88 : 0.4), gc = edge ? [236, 247, 255] : [120, 208, 255];
  const A3 = ga + A * (1 - ga); if (A3 > 0) C = [0, 1, 2].map((k) => (gc[k] * ga + C[k] * A * (1 - ga)) / A3); A = A3;
  return [C, A];
}
function photo(px, py) {
  const hz = 86 + 9 * Math.sin(px * 0.07) + 5 * Math.sin(px * 0.19 + 1);
  if (py > hz) { const f = (py - hz) / 60; return BG_NIGHT ? [16 - 8 * f, 18 - 8 * f, 34 - 14 * f] : [58 - 28 * f, 38 - 20 * f, 74 - 30 * f]; }
  const f = py / 90, g = Math.exp(-(Math.pow(px - 112, 2) + Math.pow(py - 78, 2)) / 900);
  if (BG_NIGHT) return [Math.min(255, 6 + 24 * f + 80 * g), Math.min(255, 10 + 36 * f + 90 * g), Math.min(255, 26 + 70 * f + 70 * g)];
  return [Math.min(255, 42 + 200 * f + 110 * g), Math.min(255, 54 + 100 * f + 110 * g), Math.min(255, 110 + 20 * f + 70 * g)];
}
function checker(px, py) { return ((Math.floor(px / 8) + Math.floor(py / 8)) & 1) ? [188, 195, 209] : [233, 236, 242]; }
function build(s) {
  const W = PW * K, H = PH * K, n = W * H, A = new Float32Array(n), RGB = new Uint8ClampedArray(n * 4);
  const bg = new Float32Array(n * 3), ck = new Float32Array(n * 3);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x, px = (x + 0.5) / K, py = (y + 0.5) / K, [C, a] = sample(px, py); A[i] = a;
    const col = a > 0.001 ? C : [58, 66, 86]; RGB[i * 4] = col[0]; RGB[i * 4 + 1] = col[1]; RGB[i * 4 + 2] = col[2]; RGB[i * 4 + 3] = 255;
    const b = photo(px, py), k = checker(px, py); for (let q = 0; q < 3; q++) { bg[i * 3 + q] = b[q]; ck[i * 3 + q] = k[q]; }
  }
  const mk = (fn) => { const o = document.createElement("canvas"); o.width = W; o.height = H; const oc = o.getContext("2d"), im = oc.createImageData(W, H); fn(im.data); oc.putImageData(im, 0, 0); return o; };
  const alphaOf = [(i) => 1, (i) => (A[i] > 0.5 ? 1 : 0), (i) => A[i]];
  s.A = [new Float32Array(n).fill(1), A.map((v) => (v > 0.5 ? 1 : 0)), A];
  s.rgb = mk((d) => d.set(RGB));
  s.al = alphaOf.map((f) => mk((d) => { for (let i = 0; i < n; i++) { const v = f(i) * 255; d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = v; d[i * 4 + 3] = 255; } }));
  const over = (back) => alphaOf.map((f) => mk((d) => { for (let i = 0; i < n; i++) { const a = f(i); for (let q = 0; q < 3; q++) d[i * 4 + q] = RGB[i * 4 + q] * a + back[i * 3 + q] * (1 - a); d[i * 4 + 3] = 255; } }));
  s.ck = over(ck); s.ph = over(bg);
}
function panel(c, i, img, title) {
  const x = PXS(i); T(c, title, x, PY - 8, 12, "#fff", 700);
  c.save(); c.shadowColor = "rgba(0,0,0,.5)"; c.shadowBlur = 12; c.shadowOffsetY = 4; rr(c, x, PY, PW, PH, 8); c.fillStyle = "#000"; c.fill(); c.restore();
  c.save(); rr(c, x, PY, PW, PH, 8); c.clip(); img(x, PY); c.restore();
  c.strokeStyle = "rgba(255,255,255,.28)"; c.lineWidth = 1; rr(c, x, PY, PW, PH, 8); c.stroke();
}
function mark(c, x, y, kind, col) { c.save(); c.lineWidth = 2; c.lineCap = "round"; c.lineJoin = "round"; c.strokeStyle = col; c.beginPath(); if (kind === 1) { c.moveTo(x - 5, y); c.lineTo(x - 1, y + 4); c.lineTo(x + 6, y - 5); } else if (kind === 0) { c.moveTo(x - 5, y - 5); c.lineTo(x + 5, y + 5); c.moveTo(x + 5, y - 5); c.lineTo(x - 5, y + 5); } else { c.moveTo(x - 6, y); c.lineTo(x + 6, y); } c.stroke(); c.restore(); }

const demo = {
  dur: 6, rest: 5.4, noCompare: false, levels: 3,
  mount(sp) { const c = canvas(sp); c.canvas.style.cssText = "width:640px;height:360px;display:block"; const s = { c, grain: grainTile(21) }; build(s); return s; },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 알파 없음(불투명), 2 = 켜짐/꺼짐 두 가지, 3 = 0~1 사이 값(부드러움)
    const F = 0.35;
    let f = 0;                                    // 0 불투명 → 1 켜짐/꺼짐 → 2 부드러운 알파 (연속 값)
    if (L === 2) f = E.inOutC(seg(t, 1.0, 1.0 + F)); else if (L >= 3) f = E.inOutC(seg(t, 1.0, 1.0 + F)) + E.inOutC(seg(t, 2.2, 2.2 + F));
    const v0 = Math.min(2, Math.floor(f + 1e-6)), v1 = Math.min(2, v0 + 1), fr = f - v0, stage = Math.round(f);
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1; backdrop(c, s.grain);
    const blend = (arr) => (x, y) => { c.drawImage(arr[v0], x, y, PW, PH); if (fr > 0.001 && v1 !== v0) { c.globalAlpha = fr; c.drawImage(arr[v1], x, y, PW, PH); c.globalAlpha = 1; } };
    panel(c, 0, (x, y) => c.drawImage(s.rgb, x, y, PW, PH), "색 (RGB)");
    panel(c, 1, blend(s.al), "알파 (투명도)");
    panel(c, 2, blend(s.ck), "체커보드 위");
    panel(c, 3, blend(s.ph), "사진 위");
    // 읽는 점
    const pp = E.inOutC(seg(t, 2.8, 5.2)), qx = lerp(8, 108, pp), qy = 96;
    const ix = Math.min(PW * K - 1, Math.floor(qx * K)), iy = Math.min(PH * K - 1, Math.floor(qy * K)), idx = iy * PW * K + ix;
    const al = lerp(lerp(s.A[0][idx], s.A[1][idx], cl(f)), s.A[2][idx], cl(f - 1));
    for (let i = 0; i < 4 && a && t >= 2.7; i++) {
      const x = PXS(i) + qx, y = PY + qy;
      c.strokeStyle = "#ffd27a"; c.lineWidth = 1.6; c.beginPath(); c.arc(x, y, 5, 0, 7); c.stroke(); c.fillStyle = "rgba(255,210,122,.25)"; c.fill();
    }
    // 아래 왼쪽: 알파 읽기
    c.fillStyle = "rgba(255,255,255,.05)"; rr(c, 14, 204, 288, 142, 10); c.fill(); c.strokeStyle = "rgba(255,255,255,.12)"; c.stroke();
    T(c, "노란 점 한 곳의 알파(α)", 28, 226, 12, "#fff", 700);
    const bg = c.createLinearGradient(28, 0, 276, 0); bg.addColorStop(0, "#05070d"); bg.addColorStop(1, "#ffffff");
    rr(c, 28, 238, 248, 12, 6); c.fillStyle = bg; c.fill(); c.strokeStyle = "rgba(255,255,255,.3)"; c.stroke();
    const mx = 28 + 248 * (a && t >= 2.8 ? al : 0); c.fillStyle = "#ffd27a"; c.beginPath(); c.moveTo(mx, 252); c.lineTo(mx - 6, 262); c.lineTo(mx + 6, 262); c.closePath(); c.fill();
    T(c, "0 투명", 28, 276, 10, "#8b94a3", 500); T(c, "0.5", 152, 276, 10, "#8b94a3", 500, "center"); T(c, "불투명 1", 276, 276, 10, "#8b94a3", 500, "right");
    T(c, "α = " + (a && t >= 2.8 ? al.toFixed(2) : "—"), 28, 306, 22, "#ffd27a", 700, "left", MONO);
    T(c, "결과색 = 앞색 × α + 뒤색 × (1 − α)", 28, 330, 12, "#c9d1e0", 500);
    // 아래 오른쪽: 파일 형식
    c.fillStyle = "rgba(255,255,255,.05)"; rr(c, 314, 204, 312, 142, 10); c.fill(); c.strokeStyle = "rgba(255,255,255,.12)"; c.stroke();
    const rows = [["JPEG", "알파 채널이 없다 → 사각 배경이 남는다", 0], ["GIF", "투명한 색을 하나 지정(켜짐/꺼짐)", 2], ["PNG · AVIF", "알파 채널이 있다(0~1 사이 값)", 1]];
    rows.forEach((r, i) => {
      const y = 214 + i * 42, on = stage === i;
      if (on) { c.fillStyle = "rgba(255,210,122,.14)"; rr(c, 322, y, 296, 36, 8); c.fill(); c.strokeStyle = "#ffd27a"; c.lineWidth = 1.2; rr(c, 322, y, 296, 36, 8); c.stroke(); }
      mark(c, 340, y + 18, r[2], r[2] === 1 ? "#52d98a" : (r[2] === 0 ? "#ff7a7a" : "#ffc266"));
      T(c, r[0], 358, y + 15, 13, on ? "#fff" : "#c9d1e0", 700); T(c, r[1], 358, y + 30, 11, on ? "#fff" : "#a9b3c4", 500);
    });
    pill(c, stage === 0 ? "연출 전 · 알파 없음: 사각 배경이 그대로 보인다" : (stage === 1 ? "알파가 켜짐/꺼짐 두 가지뿐: 가장자리가 거칠다" : "알파가 0~1 사이 값: 그림자·유리가 자연스럽다"));
  },
};
export default demo;
