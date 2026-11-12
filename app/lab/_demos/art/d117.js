/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/pacing-curve/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng, canvas, rr } from "./helpers.js";

// 60초 영상을 장면 8개로 나눠, 장면 길이(호흡)·감정 곡선·장면당 메시지 수(정보 밀도)를 한 화면에 겹쳐 본다. 화면은 시간 t 의 함수다. (가상 예시)
const FAST = 4;                 // 빠른 장면 하나의 길이(초)
const SLOW = 11;                // 느린 장면 하나의 길이(초)
const SWING = 1;                // 감정 곡선 오르내림 배율(1 = 100%)
const MSG = 1;                  // 장면 하나가 전하는 메시지 수(연출 후)
const BASE_MSG = 4;             // 연출 전: 장면마다 우겨 넣은 메시지 수
const KINDS = "FSFSFSFS";       // F = 빠른 장면, S = 느린 장면
const KEY = [60, 30, 70, 38, 82, 34, 95, 50];   // 장면별 감정 세기(0~100, 가상 점수)
const FLAT = [52, 50, 54, 50, 53, 51, 52, 50];  // 연출 전: 거의 평평한 감정 세기
const NAMES = ["훅", "설명", "전환", "사례", "반전", "정리", "절정", "마무리"];

const TAU = Math.PI * 2;
const INK = "#f4efe4", SEC = "#c3c2b7", MUT = "#8b94a3", GRID = "rgba(255,255,255,.09)", AXIS = "rgba(255,255,255,.3)";
const BLUE = "#3987e5", BLUE_L = "#86b6ef", ORG = "#ff8a3d", ORG_D = "#d95926", GRAY = "#5a6578";
const SANS = '"IBM Plex Sans KR","Malgun Gothic",sans-serif', MONO = '"JetBrains Mono","Malgun Gothic",monospace';
const T = (c, s, x, y, z, col, w, al, f) => { c.save(); c.fillStyle = col; c.font = (w || 500) + " " + z + "px " + (f || SANS); c.textAlign = al || "left"; c.textBaseline = "alphabetic"; c.fillText(s, x, y); c.restore(); };
function grainTile(seed) { const g = document.createElement("canvas"); g.width = g.height = 96; const x = g.getContext("2d"), im = x.createImageData(96, 96), r = rng(seed); for (let i = 0; i < 96 * 96; i++) { const v = (r() * 255) | 0; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } x.putImageData(im, 0, 0); return g; }
function backdrop(c, grain) {
  const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, "#0e1424"); g.addColorStop(1, "#080b13"); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
  const r = c.createRadialGradient(320, 150, 20, 320, 150, 360); r.addColorStop(0, "rgba(70,110,190,.10)"); r.addColorStop(1, "rgba(70,110,190,0)"); c.fillStyle = r; c.fillRect(0, 0, 640, 360);
  c.save(); c.globalAlpha = 0.045; c.fillStyle = c.createPattern(grain, "repeat"); c.fillRect(0, 0, 640, 360); c.restore();
}
function pill(c, s, col) { c.save(); c.font = "500 12px " + SANS; const w = c.measureText(s).width + 22; rr(c, 14, 12, w, 22, 11); c.fillStyle = "rgba(8,10,20,.78)"; c.fill(); c.strokeStyle = "rgba(255,255,255,.16)"; c.lineWidth = 1; c.stroke(); c.fillStyle = col || INK; c.textBaseline = "alphabetic"; c.fillText(s, 25, 27.5); c.restore(); }
function cr(P, u) { const n = P.length - 1; let i = 0; while (i < n - 1 && P[i + 1][0] < u) i++; const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(n, i + 2)]; const f = Math.max(0, Math.min(1, (u - p1[0]) / ((p2[0] - p1[0]) || 1))), f2 = f * f, f3 = f2 * f; return 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * f + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * f2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * f3); }

const X0 = 52, X1 = 612, W = X1 - X0;
const demo = {
  dur: 8, rest: 7.6, noCompare: false, levels: 3,
  mount(sp) { const c = canvas(sp); c.canvas.style.cssText = "width:640px;height:360px;display:block"; return { c, grain: grainTile(11) }; },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 장면 길이가 모두 같음, 2 = 빠름·느림을 번갈아 + 감정 곡선, 3 = 장면당 메시지 1개로 줄임
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1; backdrop(c, s.grain);
    const alt = L >= 2, lens = KINDS.split("").map((k) => (alt ? (k === "F" ? FAST : SLOW) : 7.5));
    const total = lens.reduce((p, q) => p + q, 0);
    const edges = [0]; lens.forEach((l) => edges.push(edges[edges.length - 1] + l / total));
    const gx = (u) => X0 + u * W;
    const ph = E.inOutC(seg(t, 0.5, 7.0)), px = X0 + ph * W;
    const vals = KEY.map((v, i) => { const base = alt ? 50 + (v - 50) * SWING : FLAT[i]; return Math.max(4, Math.min(100, base)); });
    const msgs = L >= 3 ? MSG : BASE_MSG;
    const lab = (txt, y) => T(c, txt, X0, y, 11, SEC, 700);
    // 1 장면 길이
    lab("장면 길이 (초)", 50);
    // 2 감정 곡선
    const Y2a = 124, Y2b = 232; lab("감정 세기 (가상 점수 0~100)", 112);
    [0, 50, 100].forEach((v) => { const y = Y2b - v / 100 * (Y2b - Y2a); c.strokeStyle = v ? GRID : AXIS; c.lineWidth = 1; c.beginPath(); c.moveTo(X0, y + 0.5); c.lineTo(X1, y + 0.5); c.stroke(); T(c, String(v), X0 - 6, y + 3.5, 10, MUT, 500, "right", MONO); });
    // 3 정보 밀도
    const Y3b = 336; lab("장면 하나가 전하는 메시지 수", 262);
    c.strokeStyle = AXIS; c.beginPath(); c.moveTo(X0, Y3b + 0.5); c.lineTo(X1, Y3b + 0.5); c.stroke();
    c.save(); c.beginPath(); c.rect(0, 0, px, 360); c.clip();
    // 장면 블록
    lens.forEach((l, i) => {
      const xa = gx(edges[i]) + 1, xb = gx(edges[i + 1]) - 1, f = KINDS[i] === "F";
      const col = !alt ? GRAY : (f ? ORG : BLUE);
      const g = c.createLinearGradient(0, 56, 0, 92); g.addColorStop(0, alt ? (f ? "#ffa564" : "#5b9be8") : "#6c778b"); g.addColorStop(1, col);
      rr(c, xa, 56, xb - xa, 36, 6); c.fillStyle = g; c.fill();
      c.fillStyle = "rgba(255,255,255,.22)"; c.fillRect(xa + 4, 57, Math.max(0, xb - xa - 8), 1);
      const lbl = (l % 1 ? l.toFixed(1) : l) + "초";
      T(c, lbl, (xa + xb) / 2, 78, 11, "#0a0f1a", 700, "center", MONO);
    });
    // 감정 곡선
    const P = [[X0, vals[0]]]; vals.forEach((v, i) => P.push([gx((edges[i] + edges[i + 1]) / 2), v])); P.push([X1, vals[7]]);
    const yv = (v) => Y2b - v / 100 * (Y2b - Y2a);
    const pts = []; for (let x = X0; x <= X1; x += 3) pts.push([x, yv(Math.max(0, Math.min(100, cr(P, x))))]);
    const fg = c.createLinearGradient(0, Y2a, 0, Y2b); fg.addColorStop(0, alt ? "rgba(57,135,229,.50)" : "rgba(139,148,163,.32)"); fg.addColorStop(1, "rgba(57,135,229,0)");
    c.beginPath(); c.moveTo(X0, Y2b); pts.forEach((p) => c.lineTo(p[0], p[1])); c.lineTo(X1, Y2b); c.closePath(); c.fillStyle = fg; c.fill();
    c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.strokeStyle = alt ? BLUE_L : "#aab3c2"; c.lineWidth = 2.4; c.lineJoin = "round"; c.stroke();
    vals.forEach((v, i) => { const x = gx((edges[i] + edges[i + 1]) / 2), y = yv(v); c.fillStyle = "#0b0e16"; c.beginPath(); c.arc(x, y, 4.2, 0, TAU); c.fill(); c.fillStyle = alt && v >= 90 ? ORG : INK; c.beginPath(); c.arc(x, y, 3, 0, TAU); c.fill(); });
    if (alt) {
      const pi = vals.indexOf(Math.max(...vals)), vi = vals.indexOf(Math.min(...vals));
      T(c, "절정 " + Math.round(vals[pi]), gx((edges[pi] + edges[pi + 1]) / 2), yv(vals[pi]) - 10, 11, ORG, 700, "center");
      T(c, "숨 고르기 " + Math.round(vals[vi]), gx((edges[vi] + edges[vi + 1]) / 2), yv(vals[vi]) + 18, 11, BLUE_L, 700, "center");
    } else T(c, "거의 평평 — 오르내림이 없다", gx(0.5), yv(50) - 18, 11, SEC, 700, "center");
    // 메시지 블록
    lens.forEach((l, i) => {
      const cx = (gx(edges[i]) + gx(edges[i + 1])) / 2, bw = Math.min(26, (gx(edges[i + 1]) - gx(edges[i])) - 8);
      for (let k = 0; k < msgs; k++) { const y = Y3b - 4 - (k + 1) * 11; rr(c, cx - bw / 2, y, bw, 9, 2.5); c.fillStyle = k === 0 ? BLUE : ORG_D; c.fill(); }
      T(c, String(msgs), cx, Y3b - 10 - msgs * 11 - 3, 11, msgs > 1 ? ORG : BLUE_L, 700, "center", MONO);
    });
    c.restore();
    // 목표 줄: 메시지 1개
    const yt = Y3b - 4 - 11; c.save(); c.setLineDash([4, 4]); c.strokeStyle = "rgba(255,255,255,.4)"; c.beginPath(); c.moveTo(X0, yt - 1.5); c.lineTo(X1, yt - 1.5); c.stroke(); c.restore();
    T(c, "점선 = 목표 1개", X1, 262, 10, MUT, 500, "right");
    // 재생 위치
    if (ph > 0 && ph < 1) { c.strokeStyle = "rgba(255,255,255,.85)"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(px, 50); c.lineTo(px, Y3b); c.stroke(); }
    const name = L >= 3 ? "정보 밀도 · 장면당 메시지 " + MSG + "개" : L === 2 ? "호흡 · 빠름 " + FAST + "초 ↔ 느림 " + SLOW + "초 교차" : "연출 전 · 장면이 모두 7.5초, 메시지 " + BASE_MSG + "개씩";
    pill(c, name, L >= 2 ? INK : "#ffd9b0");
    T(c, "가상 예시 영상 · 숫자는 설명용으로 정한 값입니다", 320, 354, 10, MUT, 500, "center");
  },
};
export default demo;
