/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/fisheye-distortion/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng, canvas, rr } from "./helpers.js";

// 똑바른 격자 벽과 과녁을 표준 렌즈 → 광각 → 어안 렌즈로 찍으면 어떻게 휘는지 코드로 계산해 보여 준다(점마다 중심에서 멀수록 안쪽으로 당기는 통 모양 왜곡). 실제 렌즈의 값이 아니다. 화면은 시간 t 의 함수다.
const K_FISH = 1.8;               // 어안 왜곡의 세기(0 = 왜곡 없음). 클수록 휘어짐이 크다
const SUBJ_X = 0;               // 과녁(피사체)의 가로 위치(-1 ~ 1, 0 = 화면 한가운데)
const K_WIDE = 0.3;             // 광각 단계의 왜곡 세기

const TAU = Math.PI * 2;
const INK = "#f4efe4", SEC = "#c3c2b7", MUT = "#8b94a3", ORG = "#ff8a3d", BLUE = "#3987e5", CYAN = "#6fd3ff";
const SANS = '"IBM Plex Sans KR","Malgun Gothic",sans-serif', MONO = '"JetBrains Mono","Malgun Gothic",monospace';
const T = (c, s, x, y, z, col, w, al, f) => { c.save(); c.fillStyle = col; c.font = (w || 500) + " " + z + "px " + (f || SANS); c.textAlign = al || "left"; c.textBaseline = "alphabetic"; c.fillText(s, x, y); c.restore(); };
function grainTile(seed) { const g = document.createElement("canvas"); g.width = g.height = 96; const x = g.getContext("2d"), im = x.createImageData(96, 96), r = rng(seed); for (let i = 0; i < 96 * 96; i++) { const v = (r() * 255) | 0; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } x.putImageData(im, 0, 0); return g; }
function pill(c, s, col) { c.save(); c.font = "500 12px " + SANS; const w = c.measureText(s).width + 22; rr(c, 14, 12, w, 22, 11); c.fillStyle = "rgba(8,10,20,.78)"; c.fill(); c.strokeStyle = "rgba(255,255,255,.16)"; c.lineWidth = 1; c.stroke(); c.fillStyle = col || INK; c.textBaseline = "alphabetic"; c.fillText(s, 25, 27.5); c.restore(); }
const RD = Math.hypot(320, 180), C0 = 0.76;
// 중심에서 멀수록 안쪽으로 당긴다: 가운데는 커지고 가장자리는 줄어든다
const warp = (x, y, k) => { const dx = x - 320, dy = y - 180, r = Math.hypot(dx, dy) / RD, s = (1 + k * C0) / (1 + k * r * r); return [320 + dx * s, 180 + dy * s]; };
function path(c, pts, k, close) { pts.forEach((p, i) => { const w = warp(p[0], p[1], k); i ? c.lineTo(w[0], w[1]) : c.moveTo(w[0], w[1]); }); if (close) c.closePath(); }
const line = (x0, y0, x1, y1, n) => { const o = []; for (let i = 0; i <= n; i++) o.push([lerp(x0, x1, i / n), lerp(y0, y1, i / n)]); return o; };
const rect = (x0, y0, x1, y1, n) => [...line(x0, y0, x1, y0, n), ...line(x1, y0, x1, y1, n).slice(1), ...line(x1, y1, x0, y1, n).slice(1), ...line(x0, y1, x0, y0, n).slice(1)];
const circle = (cx, cy, r, n) => { const o = []; for (let i = 0; i < n; i++) o.push([cx + Math.cos(i / n * TAU) * r, cy + Math.sin(i / n * TAU) * r]); return o; };

const demo = {
  dur: 5.2, rest: 4.8, noCompare: false, levels: 3,
  mount(sp) { const c = canvas(sp); c.canvas.style.cssText = "width:640px;height:360px;display:block"; return { c, grain: grainTile(29) }; },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 표준 렌즈(직선은 직선), 2 = 광각(살짝 휨), 3 = 어안(크게 휨)
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1;
    const wide = K_WIDE * E.inOutC(seg(t, 1.0, 2.0)), kk = L >= 3 ? lerp(wide, K_FISH, E.inOutC(seg(t, 3.0, 4.2))) : (L === 2 ? wide : 0);
    c.fillStyle = "#05070d"; c.fillRect(0, 0, 640, 360);
    // 화면 틀(왜곡된 사각형)로 잘라서 그린다
    c.save(); c.beginPath(); path(c, rect(0, 0, 640, 360, 40), kk, true); c.clip();
    // 벽 타일
    for (let j = 0; j < 9; j++) for (let i = 0; i < 16; i++) { const x0 = i * 40, y0 = j * 40; c.beginPath(); path(c, rect(x0, y0, x0 + 40, y0 + 40, 4), kk, true); c.fillStyle = (i + j) % 2 ? "#1d2740" : "#252f4b"; c.fill(); }
    c.strokeStyle = "rgba(111,140,200,.42)"; c.lineWidth = 1;
    for (let i = 0; i <= 16; i++) { c.beginPath(); path(c, line(i * 40, 0, i * 40, 360, 36), kk, false); c.stroke(); }
    for (let j = 0; j <= 9; j++) { c.beginPath(); path(c, line(0, j * 40, 640, j * 40, 64), kk, false); c.stroke(); }
    // 기준선: 화면 안쪽의 곧은 사각형
    c.strokeStyle = CYAN; c.lineWidth = 2; c.beginPath(); path(c, rect(40, 40, 600, 320, 56), kk, true); c.stroke();
    // 과녁
    const sx = 320 + SUBJ_X * 220, rad = [70, 56, 42, 28, 14], col = [ORG, "#f4efe4", BLUE, "#f4efe4", ORG];
    rad.forEach((r, i) => { c.beginPath(); path(c, circle(sx, 180, r, 56), kk, true); c.fillStyle = col[i]; c.fill(); });
    c.strokeStyle = "rgba(255,255,255,.45)"; c.lineWidth = 1; c.beginPath(); path(c, line(sx - 70, 180, sx + 70, 180, 28), kk, false); c.stroke();
    c.beginPath(); path(c, line(sx, 110, sx, 250, 28), kk, false); c.stroke();
    c.save(); c.globalAlpha = 0.055; c.fillStyle = c.createPattern(s.grain, "repeat"); c.fillRect(0, 0, 640, 360); c.restore();
    c.restore();
    // 틀 가장자리
    c.strokeStyle = "rgba(255,255,255,.3)"; c.lineWidth = 1.2; c.beginPath(); path(c, rect(0, 0, 640, 360, 40), kk, true); c.stroke();
    const vg = c.createRadialGradient(320, 180, 160, 320, 180, 400); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.4)"); c.fillStyle = vg; c.fillRect(0, 0, 640, 360);
    // 읽는 값: 곧은 선(x=40)이 얼마나 휘었는가, 가운데 배율
    const top = warp(40, 40, kk), mid = warp(40, 180, kk), bend = Math.abs(mid[0] - top[0]), mag = (1 + kk * C0);
    rr(c, 440, 46, 186, 62, 10); c.fillStyle = "rgba(8,10,20,.8)"; c.fill(); c.strokeStyle = "rgba(255,255,255,.16)"; c.lineWidth = 1; c.stroke();
    T(c, "왜곡 세기", 452, 66, 11, SEC, 500); T(c, kk.toFixed(2), 614, 66, 12, INK, 700, "right", MONO);
    T(c, "화면 한가운데 배율", 452, 83, 11, SEC, 500); T(c, "×" + mag.toFixed(2), 614, 83, 12, INK, 700, "right", MONO);
    T(c, "하늘색 직선이 휜 정도", 452, 100, 11, SEC, 500); T(c, bend.toFixed(0) + "px", 614, 100, 12, bend > 3 ? "#ffb27f" : INK, 700, "right", MONO);
    const tag = kk < 0.04 ? (L === 0 ? "연출 전 · " : "") + "표준 렌즈 · 직선은 직선으로 보인다" : kk < 0.55 ? "광각 렌즈 · 가장자리가 살짝 휘고 줄어든다" : "어안 렌즈 · 가운데는 크게, 가장자리는 둥글게 휘어 작아진다";
    pill(c, tag, L === 0 ? "#ffd9b0" : INK);
    const cap = kk < 0.04 ? "격자도 하늘색 사각형도 곧다" : Math.abs(SUBJ_X) < 0.3 ? "과녁이 가운데라 둥글게 보이고, 가장자리 격자가 휜다" : "가장자리에 놓인 과녁은 늘어나고 한쪽으로 쏠려 일그러진다";
    c.save(); c.font = "700 12px " + SANS; const cw = c.measureText(cap).width + 24; c.restore(); rr(c, 320 - cw / 2, 331, cw, 22, 11); c.fillStyle = "rgba(8,10,20,.78)"; c.fill();
    T(c, cap, 320, 346, 12, INK, 700, "center");
  },
};
export default demo;
