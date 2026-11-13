/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/lottie-rive/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, rng, canvas, rr } from "./helpers.js";

// 같은 공 움직임을 Lottie(움직임이 적힌 JSON 파일)와 Rive(상태 머신으로 재생)가 어떻게 다루는지 본다. 화면은 시간 t 의 함수다.
// JSON 의 키(a · k · t · s · o · i · fr · ip · op)와 Rive 코드 모양은 공식 문서에서 확인한 것이다. 숫자는 이 데모의 예시 값이다.
const OX = 0.33;                  // 시작 쪽 손잡이 o 의 x(0~1)
const OY = 0;                     // 시작 쪽 손잡이 o 의 y(0 이면 천천히 출발, 1 이면 빠르게 출발)
const IX = 0.67;                  // 도착 쪽 손잡이 i 의 x
const IY = 1;                     // 도착 쪽 손잡이 i 의 y
const CLICK_AT = 0.8;             // Rive: 사용자가 클릭하는 시각(초)
const END_F = 36, FPS = 30;       // Lottie: 마지막 키프레임의 프레임 번호, 초당 프레임
const T0 = 0.4;                   // 두 공이 시작을 기다리는 시간(초)
const PAL = { bg0: "#0b0f1a", bg1: "#161d30", ink: "#f4efe4", muted: "#8b94a3", accent: "#ffb36b", accent2: "#ffd27a", surface: "#131a2b", line: "rgba(244,239,228,.2)" };
const SANS = '"IBM Plex Sans KR","Malgun Gothic",sans-serif', MONO = '"JetBrains Mono","Malgun Gothic",monospace';
const T = (c, s, x, y, z, col, w, al, f) => { c.save(); c.fillStyle = col; c.font = (w || 500) + " " + z + "px " + (f || SANS); c.textAlign = al || "left"; c.textBaseline = "alphabetic"; c.fillText(s, x, y); c.restore(); };
function grainTile(seed) { const g = document.createElement("canvas"); g.width = g.height = 96; const x = g.getContext("2d"), im = x.createImageData(96, 96), r = rng(seed); for (let i = 0; i < 96 * 96; i++) { const v = (r() * 255) | 0; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } x.putImageData(im, 0, 0); return g; }
function backdrop(c, grain) {
  const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, PAL.bg0); g.addColorStop(1, PAL.bg1); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
  const r = c.createRadialGradient(320, 150, 20, 320, 150, 360); r.addColorStop(0, "rgba(255,179,107,.08)"); r.addColorStop(1, "rgba(255,179,107,0)"); c.fillStyle = r; c.fillRect(0, 0, 640, 360);
  c.save(); c.globalAlpha = 0.045; c.fillStyle = c.createPattern(grain, "repeat"); c.fillRect(0, 0, 640, 360); c.restore();
}
function caption(c, s) {   // 왼쪽 아래, 배경 없이 mono 12px muted, 위에 1px 선
  c.save(); c.font = "500 12px " + MONO; const w = c.measureText(s).width;
  c.fillStyle = PAL.line; c.fillRect(14, 343, Math.min(300, w), 1); c.restore();
  T(c, s, 14, 355, 12, PAL.muted, 500, "left", MONO);
}
function ball(c, x, y, r) {
  const sh = c.createRadialGradient(x + 3, y + r + 5, 1, x + 3, y + r + 5, r * 1.3); sh.addColorStop(0, "rgba(0,0,0,.5)"); sh.addColorStop(1, "rgba(0,0,0,0)");
  c.save(); c.translate(0, y + r + 5); c.scale(1, 0.28); c.translate(0, -(y + r + 5)); c.fillStyle = sh; c.beginPath(); c.arc(x + 3, y + r + 5, r * 1.3, 0, 7); c.fill(); c.restore();
  const g = c.createRadialGradient(x - r * 0.38, y - r * 0.42, 1, x, y, r); g.addColorStop(0, "#fff7e6"); g.addColorStop(0.28, "#ffb066"); g.addColorStop(0.72, "#df553a"); g.addColorStop(1, "#5e1c20");
  c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
  const rim = c.createRadialGradient(x + r * 0.5, y + r * 0.55, 1, x + r * 0.4, y + r * 0.45, r); rim.addColorStop(0, "rgba(255,200,150,.35)"); rim.addColorStop(1, "rgba(255,200,150,0)");
  c.fillStyle = rim; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
}
function codeLine(c, line, x, y, hot) {
  const re = /("[^"]*"(?=\s*:)|"[^"]*"|\/\/.*|\d+\.?\d*|[A-Za-z_.]+(?=\())/g; let last = 0, m, cx = x;
  if (hot) { c.fillStyle = "rgba(255,210,122,.16)"; c.fillRect(x - 6, y - 10, 292, 13); }
  c.font = "500 10px " + MONO; c.textBaseline = "alphabetic"; c.textAlign = "left";
  const put = (s, col) => { c.fillStyle = col; c.fillText(s, cx, y); cx += c.measureText(s).width; };
  while ((m = re.exec(line))) {
    if (m.index > last) put(line.slice(last, m.index), PAL.ink);
    const k = m[0]; put(k, k.startsWith("//") ? PAL.muted : (/^\d/.test(k) ? PAL.accent : (k[0] === '"' && /^\s*:/.test(line.slice(m.index + k.length)) ? "#8ec1ff" : (k[0] === '"' ? "#9be7a5" : "#8ec1ff"))));
    last = m.index + k.length;
  }
  if (last < line.length) put(line.slice(last), PAL.ink);
}
// 3차 베지어(0,0)-(ox,oy)-(ix,iy)-(1,1)로 진행도 u 를 변환 — 키프레임의 o · i 손잡이가 하는 일
function bez(u, ox, oy, ix, iy) {
  let lo = 0, hi = 1, s = u;
  for (let k = 0; k < 28; k++) { s = (lo + hi) / 2; const x = 3 * (1 - s) * (1 - s) * s * ox + 3 * (1 - s) * s * s * ix + s * s * s; if (x < u) lo = s; else hi = s; }
  return 3 * (1 - s) * (1 - s) * s * oy + 3 * (1 - s) * s * s * iy + s * s * s;
}
function arrow(c, x1, y1, x2, y2, col) {
  c.save(); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
  const an = Math.atan2(y2 - y1, x2 - x1); c.beginPath(); c.moveTo(x2, y2); c.lineTo(x2 - 7 * Math.cos(an - 0.45), y2 - 7 * Math.sin(an - 0.45)); c.lineTo(x2 - 7 * Math.cos(an + 0.45), y2 - 7 * Math.sin(an + 0.45)); c.closePath(); c.fill(); c.restore();
}
function node(c, x, y, w, h, label, on, col) {
  c.save(); if (on) { c.shadowColor = col; c.shadowBlur = 12; }
  c.fillStyle = on ? col : "rgba(244,239,228,.07)"; rr(c, x, y, w, h, h / 2); c.fill(); c.restore();
  c.strokeStyle = on ? col : "rgba(244,239,228,.28)"; c.lineWidth = 1.2; rr(c, x, y, w, h, h / 2); c.stroke();
  T(c, label, x + w / 2, y + h / 2 + 4, 12, on ? PAL.bg0 : PAL.ink, 700, "center");
}

const demo = {
  dur: 4.2, rest: 3.8, noCompare: false, levels: 3,
  mount(sp) { const c = canvas(sp); c.canvas.style.cssText = "width:640px;height:360px;display:block"; return { c, grain: grainTile(41) }; },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = Lottie 직선(같은 속도), 2 = Lottie 곡선 손잡이, 3 = + Rive 상태 머신
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1; backdrop(c, s.grain);
    const curved = L >= 2, ox = curved ? OX : 0, oy = curved ? OY : 0, ix = curved ? IX : 1, iy = curved ? IY : 1;
    const frame = Math.round(seg(t, T0, T0 + END_F / FPS) * END_F), u = seg(t, T0, T0 + END_F / FPS), p = bez(u, ox, oy, ix, iy);
    // ── 왼쪽: Lottie
    const LX = 14, LW = 300;
    T(c, "Lottie", LX, 62, 14, PAL.ink, 700); T(c, "움직임이 적힌 JSON 파일", LX + 54, 62, 11, PAL.muted, 500);
    c.fillStyle = PAL.surface; rr(c, LX, 70, LW, 66, 10); c.fill(); c.strokeStyle = PAL.line; c.lineWidth = 1; c.stroke();
    const sx = (v) => LX + 14 + v * 0.43;
    c.strokeStyle = "rgba(244,239,228,.2)"; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(sx(40), 122); c.lineTo(sx(560), 122); c.stroke(); c.setLineDash([]);
    for (let k = 0; k <= END_F; k += 3) {   // 3프레임마다 남기는 잔상: 간격이 좁을수록 느리게 가는 구간
      const gx = sx(lerp(40, 560, bez(k / END_F, ox, oy, ix, iy))), gg = c.createRadialGradient(gx - 2, 122 - 2, 0.5, gx, 122, 6.5);
      gg.addColorStop(0, "rgba(255,230,190,.9)"); gg.addColorStop(1, "rgba(223,85,58,.7)"); c.globalAlpha = 0.7; c.fillStyle = gg; c.beginPath(); c.arc(gx, 122, 6, 0, 7); c.fill(); c.globalAlpha = 1;
    }
    ball(c, sx(lerp(40, 560, p)), 92, 14);
    T(c, "프레임 " + frame + " / " + END_F, LX + LW, 62, 11, PAL.accent2, 700, "right", MONO);
    c.fillStyle = PAL.surface; rr(c, LX, 144, LW, 194, 10); c.fill(); c.strokeStyle = PAL.line; c.stroke();
    const f2 = (v) => String(+v.toFixed(2));
    const lines = ['"fr": ' + FPS + ', "ip": 0, "op": 60,', '"p": {', '  "a": 1,', '  "k": [', '    { "t": 0, "s": [40, 60],', '      "o": { "x": [' + f2(ox) + '], "y": [' + f2(oy) + '] },', '      "i": { "x": [' + f2(ix) + '], "y": [' + f2(iy) + '] } },', '    { "t": ' + END_F + ', "s": [560, 60] }', "  ]", "}"];
    const seg0 = frame < END_F;   // 첫 키프레임 구간을 지나는 중이면 그 키프레임 줄을 강조
    lines.forEach((ln, k) => codeLine(c, ln, LX + 14, 164 + k * 12.5, (seg0 && k >= 4 && k <= 6) || (!seg0 && k === 7)));
    const keys = [["t", "키프레임이 놓인 프레임"], ["s", "그 프레임에서의 값(위치)"], ["o · i", "구간의 시작·끝 곡선 손잡이"]];
    keys.forEach((kv, k) => { T(c, kv[0], LX + 14, 298 + k * 13, 10, PAL.accent2, 700, "left", MONO); T(c, kv[1], LX + 56, 298 + k * 13, 10.5, PAL.ink, 500); });
    // ── 오른쪽: Rive
    const RX = 326, RW = 300;
    if (L >= 3) {
      T(c, "Rive", RX, 62, 14, PAL.ink, 700); T(c, "편집기에서 만들고 상태 머신으로 재생", RX + 42, 62, 11, PAL.muted, 500);
      c.fillStyle = PAL.surface; rr(c, RX, 70, RW, 66, 10); c.fill(); c.strokeStyle = PAL.line; c.stroke();
      const mv = seg(t, CLICK_AT, CLICK_AT + 1.2), pr = E.inOutC(mv), moving = t >= CLICK_AT && t < CLICK_AT + 1.2;
      const rx = (v) => RX + 14 + v * 0.43, breathe = moving ? 0 : Math.sin(t * 4.2) * 1.1;
      c.strokeStyle = "rgba(244,239,228,.2)"; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(rx(40), 122); c.lineTo(rx(560), 122); c.stroke(); c.setLineDash([]);
      ball(c, rx(lerp(40, 560, pr)), 92 + breathe, 14 + (moving ? 0 : breathe * 0.25));
      if (t >= CLICK_AT - 0.35 && t < CLICK_AT + 0.35) {   // 클릭 표시
        const k = seg(t, CLICK_AT, CLICK_AT + 0.35), cxp = rx(40) + 4, cyp = 104;
        c.strokeStyle = "rgba(255,210,122," + (1 - k).toFixed(2) + ")"; c.lineWidth = 2; c.beginPath(); c.arc(cxp, cyp, 6 + 14 * k, 0, 7); c.stroke();
        c.fillStyle = PAL.ink; c.strokeStyle = PAL.bg0; c.lineWidth = 1; c.beginPath(); c.moveTo(cxp, cyp); c.lineTo(cxp, cyp + 15); c.lineTo(cxp + 4, cyp + 11); c.lineTo(cxp + 8, cyp + 19); c.lineTo(cxp + 11, cyp + 17.5); c.lineTo(cxp + 7, cyp + 10); c.lineTo(cxp + 12, cyp + 10); c.closePath(); c.fill(); c.stroke();
      }
      c.fillStyle = PAL.surface; rr(c, RX, 144, RW, 100, 10); c.fill(); c.strokeStyle = PAL.line; c.stroke();
      T(c, "상태 머신(State machine)", RX + 12, 160, 11, PAL.ink, 700);
      const isMove = moving;
      node(c, RX + 12, 182, 48, 22, "Entry", false, PAL.muted);
      node(c, RX + 100, 174, 74, 38, "Idle", !isMove, PAL.accent2);
      node(c, RX + 214, 174, 74, 38, "Move", isMove, PAL.accent);
      arrow(c, RX + 60, 193, RX + 98, 193, "rgba(244,239,228,.5)");
      arrow(c, RX + 176, 185, RX + 212, 185, isMove ? PAL.accent : "rgba(244,239,228,.5)");
      arrow(c, RX + 212, 204, RX + 176, 204, "rgba(244,239,228,.5)");
      T(c, "클릭", RX + 194, 177, 10.5, PAL.accent2, 700, "center"); T(c, "타임라인 끝(Exit Time)", RX + 194, 222, 10, PAL.muted, 500, "center");
      T(c, isMove ? "지금: Move 상태 — 공이 움직이는 중" : "지금: Idle 상태 — 클릭을 기다리며 숨쉬는 중", RX + 12, 238, 11, PAL.ink, 500);
      c.fillStyle = PAL.surface; rr(c, RX, 252, RW, 86, 10); c.fill(); c.strokeStyle = PAL.line; c.stroke();
      const rl = ["const r = new rive.Rive({", '  src: "ball.riv",', '  canvas: document.getElementById("canvas"),', '  autoplay: true, stateMachine: "ball_logic",', "});"];
      rl.forEach((ln, k) => codeLine(c, ln, RX + 14, 272 + k * 12.5, false));
      T(c, "화면에 띄우는 코드(문서 예시와 같은 모양)", RX + 14, 333, 10.5, PAL.muted, 500);
    } else {
      c.fillStyle = "rgba(244,239,228,.03)"; rr(c, RX, 50, RW, 288, 12); c.fill(); c.strokeStyle = PAL.line; c.setLineDash([4, 5]); c.stroke(); c.setLineDash([]);
      T(c, "Rive 는 3단계에서", RX + RW / 2, 204, 13, PAL.muted, 500, "center");
    }
    caption(c, L === 0 ? "연출 전: 직선 키프레임 두 개" : (L === 1 ? "Lottie: 손잡이가 직선(같은 속도)" : (L === 2 ? "Lottie: 손잡이로 곡선을 줌" : "Lottie 와 Rive, 움직임을 담는 두 방식")));
  },
};
export default demo;
