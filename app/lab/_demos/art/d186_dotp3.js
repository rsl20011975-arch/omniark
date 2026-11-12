/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/color-space/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, rng, canvas, rr } from "./helpers.js";

// CIE 1931 xy 색도 도표 위에 sRGB(=Rec.709 원색) · Display P3 · Rec.2020 의 삼각형을 겹쳐 색 영역의 크기를 본다. 화면은 시간 t 의 함수다.
// 삼각형 꼭짓점 좌표는 위키백과에서 확인한 값. 말발굽 윤곽은 설명용 근사 곡선이다(정확한 측정값이 아니다).
const DOT_X = 0.265;              // 색 점의 도착 위치 x
const DOT_Y = 0.690;              // 색 점의 도착 위치 y
const SHOW_2020 = 1;              // 1 이면 Rec.2020 삼각형도 그린다
const SANS = '"IBM Plex Sans KR","Malgun Gothic",sans-serif', MONO = '"JetBrains Mono","Malgun Gothic",monospace';
const T = (c, s, x, y, z, col, w, al, f) => { c.save(); c.fillStyle = col; c.font = (w || 500) + " " + z + "px " + (f || SANS); c.textAlign = al || "left"; c.textBaseline = "alphabetic"; c.fillText(s, x, y); c.restore(); };
function grainTile(seed) { const g = document.createElement("canvas"); g.width = g.height = 96; const x = g.getContext("2d"), im = x.createImageData(96, 96), r = rng(seed); for (let i = 0; i < 96 * 96; i++) { const v = (r() * 255) | 0; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } x.putImageData(im, 0, 0); return g; }
function backdrop(c, grain) {
  const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, "#0e1424"); g.addColorStop(1, "#080b13"); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
  const r = c.createRadialGradient(200, 190, 20, 200, 190, 360); r.addColorStop(0, "rgba(70,110,190,.12)"); r.addColorStop(1, "rgba(70,110,190,0)"); c.fillStyle = r; c.fillRect(0, 0, 640, 360);
  c.save(); c.globalAlpha = 0.045; c.fillStyle = c.createPattern(grain, "repeat"); c.fillRect(0, 0, 640, 360); c.restore();
}
function pill(c, s) { c.save(); c.font = "500 12px " + SANS; const w = c.measureText(s).width + 22; rr(c, 14, 12, w, 22, 11); c.fillStyle = "rgba(8,10,20,.78)"; c.fill(); c.strokeStyle = "rgba(255,255,255,.16)"; c.lineWidth = 1; c.stroke(); c.restore(); T(c, s, 25, 27, 12, "#fff", 500); }

const OX = 50, OY = 338, S = 340;
const px = (x) => OX + x * S, py = (y) => OY - y * S;
// 말발굽(분광 궤적) 윤곽의 설명용 근사 점들과 자주색 선(마지막 → 처음)
const HORSE = [[0.1741, 0.005], [0.1714, 0.0051], [0.1644, 0.0109], [0.144, 0.0297], [0.1241, 0.0578], [0.0913, 0.1327], [0.0454, 0.295], [0.0082, 0.5384], [0.0139, 0.7502], [0.0743, 0.8338], [0.1547, 0.8059], [0.2296, 0.7543], [0.3016, 0.6923], [0.3731, 0.6245], [0.4441, 0.5547], [0.5125, 0.4866], [0.5752, 0.4242], [0.627, 0.3725], [0.6658, 0.334], [0.6915, 0.3083], [0.726, 0.274], [0.7347, 0.2653]];
const SETS = [
  { n: "sRGB · Rec.709", col: "#6ea8ff", fill: "rgba(110,168,255,.20)", hi: "rgba(110,168,255,.46)", P: [[0.64, 0.33], [0.30, 0.60], [0.15, 0.06]], t0: 0.2 },
  { n: "Display P3", col: "#ffb454", fill: "rgba(255,180,84,.15)", hi: "rgba(255,180,84,.46)", P: [[0.68, 0.32], [0.265, 0.69], [0.15, 0.06]], t0: 1.5 },
  { n: "Rec.2020", col: "#6be29a", fill: "rgba(107,226,154,.11)", hi: "rgba(107,226,154,.46)", P: [[0.708, 0.292], [0.17, 0.797], [0.131, 0.046]], t0: 2.8 },
];
const WHITE = [0.3127, 0.3290];
const inside = (p, P) => { const s = (a, b, c) => (a[0] - c[0]) * (b[1] - c[1]) - (b[0] - c[0]) * (a[1] - c[1]); const d1 = s(p, P[0], P[1]), d2 = s(p, P[1], P[2]), d3 = s(p, P[2], P[0]); return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0)); };
function horseshoe(c) {
  c.beginPath(); const n = HORSE.length;
  c.moveTo(px(HORSE[0][0]), py(HORSE[0][1]));
  for (let i = 1; i < n - 1; i++) { const mx = (HORSE[i][0] + HORSE[i + 1][0]) / 2, my = (HORSE[i][1] + HORSE[i + 1][1]) / 2; c.quadraticCurveTo(px(HORSE[i][0]), py(HORSE[i][1]), px(mx), py(my)); }
  c.lineTo(px(HORSE[n - 1][0]), py(HORSE[n - 1][1])); c.closePath();
}
function tri(c, set, p, hl) {
  const P = set.P, pts = P.map((q) => [px(q[0]), py(q[1])]);
  if (p <= 0) return;
  const len = [0, 1, 2].map((i) => Math.hypot(pts[(i + 1) % 3][0] - pts[i][0], pts[(i + 1) % 3][1] - pts[i][1])), tot = len[0] + len[1] + len[2];
  c.save(); c.lineJoin = "round";
  if (p >= 1) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); c.lineTo(pts[1][0], pts[1][1]); c.lineTo(pts[2][0], pts[2][1]); c.closePath(); c.fillStyle = set.fill; c.fill(); if (hl) { c.fillStyle = set.hi; c.fill(); } }
  let rem = p * tot; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
  for (let i = 0; i < 3 && rem > 0; i++) { const a = pts[i], b = pts[(i + 1) % 3], f = Math.min(1, rem / len[i]); c.lineTo(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f); rem -= len[i]; }
  c.strokeStyle = set.col; c.lineWidth = 2; c.shadowColor = set.col; c.shadowBlur = 8; c.stroke(); c.restore();
  if (p >= 1) pts.forEach((q, i) => { c.fillStyle = ["#ff6a6a", "#52d98a", "#6b94ff"][i]; c.beginPath(); c.arc(q[0], q[1], 3.5, 0, 7); c.fill(); c.strokeStyle = "rgba(0,0,0,.5)"; c.lineWidth = 1; c.stroke(); });
}
function mark(c, x, y, ok, col) { c.save(); c.lineWidth = 2; c.lineCap = "round"; c.strokeStyle = col; c.beginPath(); if (ok) { c.moveTo(x - 4, y); c.lineTo(x - 1, y + 3); c.lineTo(x + 5, y - 4); } else { c.moveTo(x - 4, y - 4); c.lineTo(x + 4, y + 4); c.moveTo(x + 4, y - 4); c.lineTo(x - 4, y + 4); } c.stroke(); c.restore(); }

const demo = {
  dur: 5.6, rest: 4.9, noCompare: false, levels: 3,
  mount(sp) { const c = canvas(sp); c.canvas.style.cssText = "width:640px;height:360px;display:block"; return { c, grain: grainTile(13) }; },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = sRGB 와 색 점, 2 = + Display P3, 3 = + Rec.2020
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1; backdrop(c, s.grain);
    // 도표
    c.strokeStyle = "rgba(255,255,255,.07)"; c.lineWidth = 1; c.beginPath();
    for (let v = 0; v <= 0.8; v += 0.1) { c.moveTo(px(0), py(v) + 0.5); c.lineTo(px(0.8), py(v) + 0.5); c.moveTo(px(v) + 0.5, py(0)); c.lineTo(px(v) + 0.5, py(0.85)); }
    c.stroke();
    c.save(); horseshoe(c); const hg = c.createRadialGradient(px(0.33), py(0.33), 6, px(0.33), py(0.4), 210); hg.addColorStop(0, "rgba(255,255,255,.13)"); hg.addColorStop(1, "rgba(255,255,255,.03)"); c.fillStyle = hg; c.fill(); c.strokeStyle = "rgba(255,255,255,.5)"; c.lineWidth = 1.5; c.stroke(); c.restore();
    [0, 0.2, 0.4, 0.6].forEach((v) => T(c, v.toFixed(1), px(v), OY + 14, 10, "#8b94a3", 500, "center", MONO));
    [0.2, 0.4, 0.6, 0.8].forEach((v) => T(c, v.toFixed(1), OX - 8, py(v) + 3.5, 10, "#8b94a3", 500, "right", MONO));
    T(c, "x", px(0.78), OY + 14, 10, "#8b94a3", 500, "center", MONO); T(c, "y", OX - 24, py(0.82), 10, "#8b94a3", 500, "center", MONO);
    // 색 영역 삼각형(큰 것부터 아래에). 점이 들어 있는 삼각형은 안쪽이 더 밝다
    const on = [true, L >= 2, L >= 3 && SHOW_2020 === 1];
    const dp = E.inOutC(seg(t, 3.9, 4.8)), sx = 0.30, sy = 0.50;
    const dx = lerp(sx, DOT_X, dp), dy = lerp(sy, DOT_Y, dp);
    const hl = SETS.map((st, i) => a && t > 0.8 && on[i] && inside([dx, dy], st.P));
    for (let i = 2; i >= 0; i--) if (on[i]) tri(c, SETS[i], !a ? 1 : E.inOutC(seg(t, SETS[i].t0, SETS[i].t0 + 0.8)), hl[i]);
    // 흰색 점
    c.strokeStyle = "rgba(255,255,255,.85)"; c.lineWidth = 1.2; c.beginPath(); c.arc(px(WHITE[0]), py(WHITE[1]), 4, 0, 7); c.stroke();
    T(c, "D65 흰색", px(WHITE[0]) + 8, py(WHITE[1]) + 16, 10, "#c9d1e0", 500);
    // 색 점(연출 후): 먼저 sRGB 안에서 시작해 설정한 곳으로 이동
    if (a && t > 0.8) {
      const glow = c.createRadialGradient(px(dx), py(dy), 1, px(dx), py(dy), 16); glow.addColorStop(0, "rgba(255,255,255,.7)"); glow.addColorStop(1, "rgba(255,255,255,0)");
      c.fillStyle = glow; c.beginPath(); c.arc(px(dx), py(dy), 16, 0, 7); c.fill();
      c.fillStyle = "#fff"; c.beginPath(); c.arc(px(dx), py(dy), 4.5, 0, 7); c.fill(); c.strokeStyle = "#0b0f1a"; c.lineWidth = 1.5; c.stroke();
      s.ins = hl;
    } else s.ins = [inside([sx, sy], SETS[0].P), false, false];
    // 오른쪽 표
    const X0 = 370;
    T(c, "삼각형 꼭짓점(CIE xy)", X0, 62, 12, "#fff", 700);
    SETS.forEach((st, i) => {
      const y = 86 + i * 50, shown = on[i] || (i === 0), col = shown ? st.col : "#4b5468";
      c.fillStyle = col; c.fillRect(X0, y - 10, 10, 10);
      T(c, st.n, X0 + 16, y, 12, shown ? "#fff" : "#6b7487", 700);
      const q = st.P; T(c, "R " + q[0][0].toFixed(3) + " " + q[0][1].toFixed(3) + "  G " + q[1][0].toFixed(3) + " " + q[1][1].toFixed(3), X0, y + 16, 10, shown ? "#c9d1e0" : "#6b7487", 500, "left", MONO);
      T(c, "B " + q[2][0].toFixed(3) + " " + q[2][1].toFixed(3), X0, y + 30, 10, shown ? "#c9d1e0" : "#6b7487", 500, "left", MONO);
    });
    // 점의 위치 판정
    const JY = 250;
    T(c, a ? "하얀 색 점은 지금 어느 영역 안일까" : "아직 색 점이 없다(sRGB 한 가지만)", X0, JY, 12, "#fff", 700);
    SETS.forEach((st, i) => {
      const x = X0 + i * 90, ok = s.ins[i] && (a ? true : false), shown = (on[i] && t >= SETS[i].t0 + 0.8) || i === 0;
      const dim = !a || !shown || t <= 0.8;
      c.fillStyle = dim ? "rgba(255,255,255,.04)" : (ok ? "rgba(107,226,154,.14)" : "rgba(255,255,255,.06)"); rr(c, x, JY + 10, 82, 40, 8); c.fill();
      c.strokeStyle = dim ? "rgba(255,255,255,.1)" : (ok ? "#52d98a" : "rgba(255,255,255,.25)"); c.lineWidth = 1; rr(c, x, JY + 10, 82, 40, 8); c.stroke();
      T(c, ["sRGB", "P3", "2020"][i], x + 10, JY + 28, 11, dim ? "#6b7487" : "#fff", 700);
      if (!dim) mark(c, x + 62, JY + 29, ok, ok ? "#52d98a" : "#ff7a7a");
      T(c, dim ? "—" : (ok ? "안" : "밖"), x + 10, JY + 44, 10, dim ? "#6b7487" : (ok ? "#9be7bd" : "#ffb3b3"), 700);
    });
    T(c, "sRGB 와 Rec.709 는 원색·흰색이 같고, 톤 곡선(감마)이 다르다", X0, 330, 10, "#8b94a3", 500);
    const stg = L >= 3 && t >= 2.8 ? 3 : (L >= 2 && t >= 1.5 ? 2 : 1);
    pill(c, !a ? "연출 전 · 색 영역 하나(sRGB)만 아는 상태" : (stg === 1 ? "sRGB 삼각형 · 밖의 색은 표현하지 못한다" : (stg === 2 ? "Display P3 는 sRGB 보다 넓다" : "Rec.2020 은 가장 넓다")));
  },
};
export default demo;
