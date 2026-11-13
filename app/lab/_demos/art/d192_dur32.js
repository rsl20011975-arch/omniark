/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/blender-ae/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, rng, canvas, rr } from "./helpers.js";

// 왼쪽 Blender: 키프레임 두 개와 보간 방식(Linear · Bézier)이 큐브의 움직임을 정한다. 오른쪽 After Effects: 영상 위에 글자 그래픽을 겹쳐 얹는 합성. 도식이며 화면은 시간 t 의 함수다.
// 키프레임·보간 설명은 Blender 설명서에서, After Effects 가 하는 일은 Adobe 소개 페이지에서 확인한 내용이다. 위치 값 3 · 20 은 이 데모의 예시다.
const X_END = 20;                 // 두 번째 키프레임의 위치 값(m)
const HANDLE = 0.4;               // Bézier 손잡이 길이(구간 길이의 비율, 0 에 가까울수록 직선)
const F0 = 1, F1 = 36;           // 키프레임의 프레임 번호
const T0 = 0.4;                   // 움직이기 시작하는 시각(초)
const DUR = 3.2;                  // 움직이는 시간(초)
const PAL = { bg0: "#a9402c", bg1: "#8f3322", ink: "#fff4ec", muted: "#ffd9c9", accent: "#ffe27a", accent2: "#1d1a16", surface: "#b24a34", line: "rgba(255,244,236,.3)" };
const SANS = '"IBM Plex Sans KR","Malgun Gothic",sans-serif', MONO = '"JetBrains Mono","Malgun Gothic",monospace', HAN = '"Black Han Sans","Malgun Gothic",sans-serif';
const T = (c, s, x, y, z, col, w, al, f) => { c.save(); c.fillStyle = col; c.font = (w || 500) + " " + z + "px " + (f || SANS); c.textAlign = al || "left"; c.textBaseline = "alphabetic"; c.fillText(s, x, y); c.restore(); };
function grainTile(seed) { const g = document.createElement("canvas"); g.width = g.height = 96; const x = g.getContext("2d"), im = x.createImageData(96, 96), r = rng(seed); for (let i = 0; i < 96 * 96; i++) { const v = (r() * 255) | 0; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } x.putImageData(im, 0, 0); return g; }
function backdrop(c, grain) {
  const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, PAL.bg0); g.addColorStop(1, PAL.bg1); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
  const r = c.createRadialGradient(320, 150, 20, 320, 150, 360); r.addColorStop(0, "rgba(255,226,122,.10)"); r.addColorStop(1, "rgba(255,226,122,0)"); c.fillStyle = r; c.fillRect(0, 0, 640, 360);
  c.save(); c.globalAlpha = 0.045; c.fillStyle = c.createPattern(grain, "repeat"); c.fillRect(0, 0, 640, 360); c.restore();
}
function caption(c, s) {   // 왼쪽 아래, 배경 없이 mono 12px muted, 위에 1px 선
  c.save(); c.font = "500 12px " + MONO; const w = c.measureText(s).width;
  c.fillStyle = PAL.line; c.fillRect(14, 343, Math.min(300, w), 1); c.restore();
  T(c, s, 14, 355, 12, PAL.muted, 500, "left", MONO);
}
function bez(u, ox, oy, ix, iy) {
  let lo = 0, hi = 1, s = u;
  for (let k = 0; k < 28; k++) { s = (lo + hi) / 2; const x = 3 * (1 - s) * (1 - s) * s * ox + 3 * (1 - s) * s * s * ix + s * s * s; if (x < u) lo = s; else hi = s; }
  return 3 * (1 - s) * (1 - s) * s * oy + 3 * (1 - s) * s * s * iy + s * s * s;
}
const poly = (c, pts, fill) => { c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.closePath(); c.fillStyle = fill; c.fill(); };
// 3D 처럼 보이는 큐브(윗면 · 앞면 · 옆면을 따로 밝기를 줘서 칠함)
function cube(c, x, y, s) {
  const dx = s * 0.42, dy = -s * 0.32;
  const sh = c.createRadialGradient(x + s / 2 + 6, y + 4, 2, x + s / 2 + 6, y + 4, s * 1.1); sh.addColorStop(0, "rgba(0,0,0,.55)"); sh.addColorStop(1, "rgba(0,0,0,0)");
  c.save(); c.translate(0, y + 4); c.scale(1, 0.26); c.translate(0, -(y + 4)); c.fillStyle = sh; c.beginPath(); c.arc(x + s / 2 + 6, y + 4, s * 1.1, 0, 7); c.fill(); c.restore();
  const f = c.createLinearGradient(x, y - s, x + s, y); f.addColorStop(0, "#d9dde6"); f.addColorStop(1, "#aab1c2");
  poly(c, [[x, y], [x + s, y], [x + s, y - s], [x, y - s]], f);
  const sd = c.createLinearGradient(x + s, 0, x + s + dx, 0); sd.addColorStop(0, "#7d869b"); sd.addColorStop(1, "#656e84");
  poly(c, [[x + s, y], [x + s + dx, y + dy], [x + s + dx, y - s + dy], [x + s, y - s]], sd);
  const tp = c.createLinearGradient(0, y - s + dy, 0, y - s); tp.addColorStop(0, "#f4f6fb"); tp.addColorStop(1, "#dfe3ec");
  poly(c, [[x, y - s], [x + s, y - s], [x + s + dx, y - s + dy], [x + dx, y - s + dy]], tp);
  c.strokeStyle = "rgba(20,24,40,.35)"; c.lineWidth = 1; c.beginPath(); c.moveTo(x, y - s); c.lineTo(x + s, y - s); c.lineTo(x + s, y); c.moveTo(x + s, y - s); c.lineTo(x + s + dx, y - s + dy); c.stroke();
}
function sceneBlender(c, x, y, w, h) {
  c.save(); rr(c, x, y, w, h, 10); c.clip();
  const bg = c.createLinearGradient(0, y, 0, y + h); bg.addColorStop(0, "#3a2420"); bg.addColorStop(0.5, "#4a2e27"); bg.addColorStop(1, "#27171a"); c.fillStyle = bg; c.fillRect(x, y, w, h);
  const hz = y + h * 0.42, vx = x + w / 2;
  const fl = c.createLinearGradient(0, hz, 0, y + h); fl.addColorStop(0, "#5a3a31"); fl.addColorStop(1, "#2e1c1b"); c.fillStyle = fl; c.fillRect(x, hz, w, y + h - hz);
  c.strokeStyle = "rgba(255,244,236,.16)"; c.lineWidth = 1; c.beginPath();
  for (let i = -10; i <= 10; i++) { c.moveTo(vx + i * 6, hz); c.lineTo(vx + i * 40, y + h); }
  for (let k = 1; k <= 5; k++) { const yy = hz + (y + h - hz) * Math.pow(k / 5, 1.7); c.moveTo(x, yy + 0.5); c.lineTo(x + w, yy + 0.5); }
  c.stroke(); c.restore();
}
function sceneAE(c, x, y, w, h, t) {
  c.save(); rr(c, x, y, w, h, 10); c.clip();
  const sky = c.createLinearGradient(0, y, 0, y + h); sky.addColorStop(0, "#25356b"); sky.addColorStop(0.5, "#8a5a8e"); sky.addColorStop(0.8, "#f0955f"); sky.addColorStop(1, "#ffd08c"); c.fillStyle = sky; c.fillRect(x, y, w, h);
  const pan = -t * 6, sun = c.createRadialGradient(x + w * 0.7 + pan, y + h * 0.62, 2, x + w * 0.7 + pan, y + h * 0.62, 80); sun.addColorStop(0, "rgba(255,240,200,1)"); sun.addColorStop(0.2, "rgba(255,210,150,.6)"); sun.addColorStop(1, "rgba(255,180,120,0)"); c.fillStyle = sun; c.fillRect(x, y, w, h);
  const m1 = c.createLinearGradient(0, y + h * 0.55, 0, y + h); m1.addColorStop(0, "#6b4a7e"); m1.addColorStop(1, "#3a2a58"); c.fillStyle = m1;
  c.beginPath(); c.moveTo(x, y + h * 0.78); [[0.12, 0.62], [0.26, 0.72], [0.4, 0.58], [0.58, 0.76], [0.74, 0.64], [0.88, 0.74], [1, 0.6]].forEach((p) => c.lineTo(x + w * p[0] + pan * 0.4, y + h * p[1])); c.lineTo(x + w + 20, y + h); c.lineTo(x - 20, y + h); c.fill();
  const m2 = c.createLinearGradient(0, y + h * 0.7, 0, y + h); m2.addColorStop(0, "#2a2046"); m2.addColorStop(1, "#110c22"); c.fillStyle = m2;
  c.beginPath(); c.moveTo(x - 20, y + h * 0.86); c.quadraticCurveTo(x + w * 0.3 + pan * 0.8, y + h * 0.74, x + w * 0.6, y + h * 0.88); c.quadraticCurveTo(x + w * 0.85, y + h * 0.94, x + w + 20, y + h * 0.84); c.lineTo(x + w + 20, y + h); c.lineTo(x - 20, y + h); c.fill();
  c.restore();
}

const demo = {
  dur: 4.2, rest: 3.8, noCompare: false, levels: 3,
  mount(sp) { const c = canvas(sp); c.canvas.style.cssText = "width:640px;height:360px;display:block"; return { c, grain: grainTile(71) }; },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = Blender · Linear(직선), 2 = Bézier(부드럽게), 3 = + After Effects
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1; backdrop(c, s.grain);
    const bz = L >= 2, ox = bz ? HANDLE : 0, oy = 0, ix = bz ? 1 - HANDLE : 1, iy = 1;
    const u = seg(t, T0, T0 + DUR), p = bez(u, ox, oy, ix, iy), frame = Math.round(lerp(F0, F1, u)), val = lerp(3, X_END, p);
    // ── 왼쪽: Blender
    T(c, "Blender", 14, 62, 14, PAL.ink, 700); T(c, "무료 오픈소스 3D 제작 도구", 76, 62, 11, PAL.muted, 500);
    const VX = 14, VY = 70, VW = 300, VH = 118;
    sceneBlender(c, VX, VY, VW, VH);
    const px = (v) => VX + 34 + v * 9, base = VY + 92;
    for (let f = F0; f <= F1; f += 5) { const g = lerp(3, X_END, bez((f - F0) / (F1 - F0), ox, oy, ix, iy)); c.fillStyle = "rgba(255,255,255,.28)"; c.beginPath(); c.ellipse(px(g) + 14, base + 8, 3.2, 1.3, 0, 0, 7); c.fill(); }
    cube(c, px(val), base, 30);
    c.strokeStyle = PAL.line; c.lineWidth = 1; rr(c, VX, VY, VW, VH, 10); c.stroke();
    // 보간 방식 버튼
    const modes = ["Constant", "Linear", "Bézier"], act = bz ? 2 : 1;
    modes.forEach((m, i) => {
      const bx = 14 + i * 100, on = i === act;
      c.fillStyle = on ? "rgba(255,226,122,.22)" : PAL.surface; rr(c, bx, 196, 94, 22, 11); c.fill(); c.strokeStyle = on ? PAL.accent : PAL.line; c.lineWidth = 1; rr(c, bx, 196, 94, 22, 11); c.stroke();
      c.strokeStyle = on ? PAL.accent : PAL.muted; c.lineWidth = 1.5; c.beginPath();
      if (i === 0) { c.moveTo(bx + 10, 211); c.lineTo(bx + 16, 211); c.lineTo(bx + 16, 203); c.lineTo(bx + 22, 203); }
      else if (i === 1) { c.moveTo(bx + 10, 211); c.lineTo(bx + 22, 203); }
      else { c.moveTo(bx + 10, 211); c.bezierCurveTo(bx + 17, 211, bx + 15, 203, bx + 22, 203); }
      c.stroke(); T(c, m, bx + 29, 211, 11, on ? PAL.ink : PAL.muted, 700);
    });
    // 그래프(값 대 프레임)
    const GX = 44, GY = 232, GW = 258, GH = 82, gx = (f) => GX + (f - F0) / (F1 - F0) * GW, gy = (v) => GY + GH - v / 24 * GH;
    c.fillStyle = PAL.surface; rr(c, 14, 226, 300, 108, 10); c.fill(); c.strokeStyle = PAL.line; c.stroke();
    c.strokeStyle = "rgba(255,244,236,.14)"; c.lineWidth = 1; c.beginPath(); [0, 8, 16, 24].forEach((v) => { c.moveTo(GX, gy(v) + 0.5); c.lineTo(GX + GW, gy(v) + 0.5); }); c.stroke();
    [0, 8, 16].forEach((v) => T(c, String(v), GX - 6, gy(v) + 3.5, 10, PAL.muted, 500, "right", MONO));
    T(c, "프레임 " + F0, GX, 328, 10.5, PAL.muted, 500, "center", MONO); T(c, String(F1), GX + GW, 328, 10.5, PAL.muted, 500, "center", MONO); T(c, "위치(m)", 20, 243, 10, PAL.muted, 500);
    const pts = []; for (let k = 0; k <= 60; k++) { const uu = k / 60; pts.push([gx(lerp(F0, F1, uu)), gy(lerp(3, X_END, bez(uu, ox, oy, ix, iy)))]); }
    c.beginPath(); pts.forEach((q, i) => (i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]))); c.lineTo(gx(F1), gy(0)); c.lineTo(gx(F0), gy(0)); c.closePath();
    const fg = c.createLinearGradient(0, GY, 0, GY + GH); fg.addColorStop(0, "rgba(255,244,236,.26)"); fg.addColorStop(1, "rgba(255,244,236,.04)"); c.fillStyle = fg; c.fill();
    c.beginPath(); pts.forEach((q, i) => (i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]))); c.strokeStyle = PAL.ink; c.lineWidth = 2.4; c.lineJoin = "round"; c.stroke();
    if (bz) {   // 손잡이
      const k0 = [gx(F0), gy(3)], k1 = [gx(F1), gy(X_END)], h0 = [gx(lerp(F0, F1, HANDLE)), gy(3)], h1 = [gx(lerp(F0, F1, 1 - HANDLE)), gy(X_END)];
      c.strokeStyle = "rgba(255,244,236,.7)"; c.lineWidth = 1.2; c.beginPath(); c.moveTo(k0[0], k0[1]); c.lineTo(h0[0], h0[1]); c.moveTo(k1[0], k1[1]); c.lineTo(h1[0], h1[1]); c.stroke();
      [h0, h1].forEach((q) => { c.fillStyle = PAL.ink; c.beginPath(); c.arc(q[0], q[1], 3, 0, 7); c.fill(); });
    }
    [[F0, 3], [F1, X_END]].forEach((k) => { const q = [gx(k[0]), gy(k[1])]; c.fillStyle = PAL.ink; c.beginPath(); c.moveTo(q[0], q[1] - 6); c.lineTo(q[0] + 6, q[1]); c.lineTo(q[0], q[1] + 6); c.lineTo(q[0] - 6, q[1]); c.closePath(); c.fill(); c.strokeStyle = PAL.accent; c.lineWidth = 1.5; c.stroke(); });
    const cx0 = gx(frame); c.strokeStyle = PAL.accent; c.lineWidth = 1.8; c.beginPath(); c.moveTo(cx0, GY - 4); c.lineTo(cx0, GY + GH); c.stroke();
    c.fillStyle = PAL.ink; c.beginPath(); c.arc(cx0, gy(val), 4, 0, 7); c.fill(); c.strokeStyle = PAL.accent; c.lineWidth = 1.8; c.stroke();
    T(c, "프레임 " + frame + " · " + val.toFixed(1) + " m", GX + 36, 244, 11, PAL.accent, 700, "left", MONO);
    // ── 오른쪽: After Effects
    const RX = 326;
    if (L >= 3) {
      T(c, "After Effects", RX, 62, 14, PAL.ink, 700); T(c, "모션 그래픽 · 합성 도구(Adobe)", RX + 96, 62, 11, PAL.muted, 500);
      const CX = RX, CY = 70, CW = 300, CH = 169;
      sceneAE(c, CX, CY, CW, CH, t);
      const k = E.outC(seg(t, 0.8, 1.6)), cardY = lerp(CY + CH + 4, CY + CH - 70, k), op = seg(t, 0.8, 1.2);
      c.save(); rr(c, CX, CY, CW, CH, 10); c.clip(); c.globalAlpha = op;
      c.fillStyle = "rgba(10,12,28,.62)"; rr(c, CX + 24, cardY, CW - 48, 52, 12); c.fill(); c.strokeStyle = "rgba(255,255,255,.35)"; c.lineWidth = 1.2; c.stroke();
      c.fillStyle = PAL.accent; rr(c, CX + 24, cardY, 6, 52, 3); c.fill();
      T(c, "NEW DROP", CX + 44, cardY + 30, 26, "#fff", 400, "left", HAN); T(c, "여름 한정 · 지금 공개", CX + 44, cardY + 46, 11, "#d7dcea", 500);
      c.restore(); c.strokeStyle = PAL.line; c.lineWidth = 1; rr(c, CX, CY, CW, CH, 10); c.stroke();
      // 겹침 순서
      c.fillStyle = PAL.surface; rr(c, RX, 247, 300, 91, 10); c.fill(); c.strokeStyle = PAL.line; c.stroke();
      T(c, "위에서 아래로 겹쳐 합성", RX + 12, 264, 11, PAL.ink, 700);
      c.fillStyle = PAL.accent; rr(c, RX + 12, 272, 120, 14, 4); c.fill(); T(c, "글자 · 그래픽", RX + 18, 283, 10.5, PAL.accent2, 700);
      c.fillStyle = PAL.muted; rr(c, RX + 12, 290, 120, 14, 4); c.fill(); T(c, "영상", RX + 18, 301, 10.5, PAL.accent2, 700);
      const feats = ["글자 · 그래픽 애니메이션", "합성(겹쳐 얹기)", "트래킹(움직임 따라가기)", "키잉(배경 바꾸기)"];
      feats.forEach((f, i) => { const fx = RX + 150 + 0, fy = 272 + i * 15; c.strokeStyle = PAL.accent; c.lineWidth = 1.8; c.lineCap = "round"; c.beginPath(); c.moveTo(fx, fy - 3); c.lineTo(fx + 3, fy); c.lineTo(fx + 9, fy - 7); c.stroke(); T(c, f, fx + 16, fy, 10.5, PAL.ink, 500); });
      T(c, "Adobe 소개 페이지에서 확인한 기능", RX + 12, 330, 10, PAL.muted, 500);
    } else {
      c.fillStyle = "rgba(255,244,236,.05)"; rr(c, RX, 50, 300, 288, 12); c.fill(); c.strokeStyle = PAL.line; c.setLineDash([4, 5]); c.stroke(); c.setLineDash([]);
      T(c, "After Effects 는 3단계에서", RX + 150, 204, 13, PAL.muted, 500, "center");
    }
    caption(c, L === 0 ? "연출 전: 키프레임 두 개를 Linear 로 잇기" : (L === 1 ? "Blender Linear: 직선이라 속도가 일정" : (L === 2 ? "Blender Bézier: 손잡이로 곡선을 줌" : "Blender 와 After Effects 는 하는 일이 다르다")));
  },
};
export default demo;
