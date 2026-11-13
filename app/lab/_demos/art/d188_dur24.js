/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/js-motion-libs/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, rng, canvas, rr } from "./helpers.js";

// 같은 움직임(공 하나가 오른쪽으로 가다 끝에서 감속)을 GSAP · anime.js · Theatre.js 가 각각 어떻게 적는지 본다. 화면은 시간 t 의 함수다.
// 공의 움직임은 이 도식이 직접 계산한 것이고, 각 라이브러리의 곡선 이름이 정확히 같은 곡선이라는 뜻은 아니다.
const DIST = 480;                 // 공이 오른쪽으로 가는 거리(px)
const DUR = 2.4;                  // 움직이는 시간(초)
const DELAY = 0.4;                // 출발 전 기다리는 시간(초)
const PAL = { bg0: "#f2f2f0", bg1: "#e4e4e1", ink: "#111111", muted: "#666666", accent: "#ff3b1f", accent2: "#111111", surface: "#ffffff", line: "rgba(17,17,17,.2)" };
const SANS = '"IBM Plex Sans KR","Malgun Gothic",sans-serif', MONO = '"JetBrains Mono","Malgun Gothic",monospace';
const T = (c, s, x, y, z, col, w, al, f) => { c.save(); c.fillStyle = col; c.font = (w || 500) + " " + z + "px " + (f || SANS); c.textAlign = al || "left"; c.textBaseline = "alphabetic"; c.fillText(s, x, y); c.restore(); };
function grainTile(seed) { const g = document.createElement("canvas"); g.width = g.height = 96; const x = g.getContext("2d"), im = x.createImageData(96, 96), r = rng(seed); for (let i = 0; i < 96 * 96; i++) { const v = (r() * 255) | 0; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } x.putImageData(im, 0, 0); return g; }
function backdrop(c, grain) {
  const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, PAL.bg0); g.addColorStop(1, PAL.bg1); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
  const r = c.createRadialGradient(320, 150, 20, 320, 150, 360); r.addColorStop(0, "rgba(255,255,255,.6)"); r.addColorStop(1, "rgba(255,255,255,0)"); c.fillStyle = r; c.fillRect(0, 0, 640, 360);
  c.save(); c.globalAlpha = 0.045; c.fillStyle = c.createPattern(grain, "repeat"); c.fillRect(0, 0, 640, 360); c.restore();
}
// 왼쪽 가장자리 세로 이름표(vertical-rl 처럼 글자를 위에서 아래로 세워 쌓는다). 지금 단계만 ink, 나머지는 muted
function vlabel(c, items, cur) {
  c.save(); c.textBaseline = "middle"; c.textAlign = "center";
  c.fillStyle = PAL.line; c.fillRect(13, 44, 1, 300);
  let y = 46;
  items.forEach((s, i) => {
    const on = i === cur, adv = (ch) => (ch === " " ? 6 : (/[A-Za-z0-9.]/.test(ch) ? 9 : 13.5));
    const len = [...s].reduce((a, ch) => a + adv(ch), 0);
    if (on) { c.fillStyle = PAL.accent; c.fillRect(12, y - 2, 3, len + 4); }
    c.font = (on ? 600 : 500) + " 12px " + SANS; c.fillStyle = on ? PAL.ink : PAL.muted;
    let yy = y; [...s].forEach((ch) => { if (ch !== " ") c.fillText(ch, 24, yy + adv(ch) / 2); yy += adv(ch); });
    y += len + 20;
  });
  c.restore();
}
function ball(c, x, y, r) {
  const sh = c.createRadialGradient(x + 3, y + r + 5, 1, x + 3, y + r + 5, r * 1.3); sh.addColorStop(0, "rgba(17,17,17,.38)"); sh.addColorStop(1, "rgba(0,0,0,0)");
  c.save(); c.translate(0, y + r + 5); c.scale(1, 0.28); c.translate(0, -(y + r + 5)); c.fillStyle = sh; c.beginPath(); c.arc(x + 3, y + r + 5, r * 1.3, 0, 7); c.fill(); c.restore();
  const g = c.createRadialGradient(x - r * 0.38, y - r * 0.42, 1, x, y, r); g.addColorStop(0, "#fff1e8"); g.addColorStop(0.28, "#ff8a62"); g.addColorStop(0.72, "#e0301a"); g.addColorStop(1, "#6b1208");
  c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
  const rim = c.createRadialGradient(x + r * 0.5, y + r * 0.55, 1, x + r * 0.4, y + r * 0.45, r); rim.addColorStop(0, "rgba(255,200,150,.35)"); rim.addColorStop(1, "rgba(255,200,150,0)");
  c.fillStyle = rim; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
}
// 한 줄 코드 색칠: 글자열 · 숫자 · 함수 이름 · 주석
function codeLine(c, line, x, y) {
  const re = /("[^"]*"|'[^']*'|\/\/.*|\d+\.?\d*|[A-Za-z_.]+(?=\())/g; let last = 0, m, cx = x;
  c.font = "500 10px " + MONO; c.textBaseline = "alphabetic"; c.textAlign = "left";
  const put = (s, col) => { c.fillStyle = col; c.fillText(s, cx, y); cx += c.measureText(s).width; };
  while ((m = re.exec(line))) {
    if (m.index > last) put(line.slice(last, m.index), "#2b2b29");
    const k = m[0]; put(k, k[0] === '"' || k[0] === "'" ? "#1f7a3f" : (k.startsWith("//") ? "#6b6b66" : (/^\d/.test(k) ? "#b4530b" : "#1d4ed8")));
    last = m.index + k.length;
  }
  if (last < line.length) put(line.slice(last), "#2b2b29");
}
const f1 = (v) => String(+v.toFixed(1));
const LH = 100, LY = (i) => 44 + i * 104, CX = 36, CW = 300, TX = 352, TW = 274;

const demo = {
  dur: 3.6, rest: 3.2, noCompare: false, levels: 3,
  mount(sp) { const c = canvas(sp); c.canvas.style.cssText = "width:640px;height:360px;display:block"; return { c, grain: grainTile(31) }; },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = GSAP 등속, 2 = GSAP 감속(ease), 3 = + anime.js · Theatre.js
    const eased = L >= 2, count = L >= 3 ? 3 : 1;
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1; backdrop(c, s.grain);
    const ease = eased ? E.outC : E.lin, pr = ease(seg(t, DELAY, DELAY + DUR));
    const travel = DIST * 0.45;
    const lanes = [
      { n: "GSAP", col: "#4f8f00", lines: ['gsap.to(".ball", {', "  x: " + DIST + ", duration: " + f1(DUR) + ",", "  delay: " + f1(DELAY) + ", ease: " + (eased ? '"power2.out"' : '"none"') + ",", "});"], key: false },
      { n: "anime.js", col: "#e0453a", lines: ["animate('.ball', {", "  x: " + DIST + ", duration: " + Math.round(DUR * 1000) + ",", "  delay: " + Math.round(DELAY * 1000) + ", ease: 'outCubic',", "});"], key: false },
      { n: "Theatre.js", col: "#7c5ce6", lines: ["const ball = sheet.object('Ball', { x: 0 })", "ball.onValuesChange((values) => {", "  el.style.left = values.x + 'px'", "})", "sheet.sequence.play()", "// 키프레임은 Studio 화면에서 찍는다"], key: true },
    ];
    lanes.slice(0, count).forEach((ln, i) => {
      const y = LY(i);
      c.save(); c.shadowColor = "rgba(17,17,17,.12)"; c.shadowBlur = 8; c.shadowOffsetY = 2; c.fillStyle = PAL.surface; rr(c, CX, y, CW, LH, 10); c.fill(); c.restore(); c.strokeStyle = PAL.line; c.lineWidth = 1; rr(c, CX, y, CW, LH, 10); c.stroke();
      c.fillStyle = ln.col; rr(c, CX + 10, y + 9, 8, 8, 2); c.fill(); T(c, ln.n, CX + 24, y + 17, 12, PAL.ink, 700);
      ln.lines.forEach((l, k) => codeLine(c, l, CX + 12, y + 31 + k * 12.2));
      // 트랙
      c.fillStyle = "rgba(17,17,17,.04)"; rr(c, TX - 4, y, TW + 8, LH, 10); c.fill(); c.strokeStyle = PAL.line; c.stroke();
      const x0 = TX + 22, by = y + 34;
      c.strokeStyle = "rgba(17,17,17,.25)"; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(x0, by + 18); c.lineTo(x0 + travel, by + 18); c.stroke(); c.setLineDash([]);
      c.strokeStyle = "rgba(17,17,17,.45)"; c.beginPath(); c.moveTo(x0 + travel + 0.5, by + 8); c.lineTo(x0 + travel + 0.5, by + 28); c.stroke();
      ball(c, x0 + travel * pr, by, 13);
      // 시간 눈금 0 ~ 3.2초
      const rx = TX + 8, rw = TW - 16, ry = y + 82, tx = (v) => rx + rw * v / 3.2;
      c.strokeStyle = "rgba(17,17,17,.35)"; c.beginPath(); c.moveTo(rx, ry + 0.5); c.lineTo(rx + rw, ry + 0.5); for (let v = 0; v <= 3.2001; v += 0.4) { c.moveTo(tx(v) + 0.5, ry - 3); c.lineTo(tx(v) + 0.5, ry + 3); } c.stroke();
      c.fillStyle = ln.col; c.globalAlpha = 0.55; rr(c, tx(DELAY), ry - 2.5, tx(DELAY + DUR) - tx(DELAY), 5, 2.5); c.fill(); c.globalAlpha = 1;
      if (ln.key) [DELAY, DELAY + DUR].forEach((v) => { c.fillStyle = "#fff"; c.beginPath(); c.moveTo(tx(v), ry - 6); c.lineTo(tx(v) + 5, ry); c.lineTo(tx(v), ry + 6); c.lineTo(tx(v) - 5, ry); c.closePath(); c.fill(); c.strokeStyle = ln.col; c.lineWidth = 1.5; c.stroke(); });
      const px = tx(Math.min(3.2, t)); c.strokeStyle = PAL.accent; c.lineWidth = 1.8; c.beginPath(); c.moveTo(px, ry - 9); c.lineTo(px, ry + 9); c.stroke();
      T(c, f1(DELAY) + "초 대기 → " + f1(DUR) + "초 이동", TX + 8, y + 18, 10.5, PAL.muted, 500, "left", MONO);
    });
    if (count < 3) {
      c.fillStyle = "rgba(17,17,17,.03)"; rr(c, CX, LY(1) + 6, 590, 200, 12); c.fill(); c.strokeStyle = PAL.line; c.setLineDash([4, 5]); c.stroke(); c.setLineDash([]);
      T(c, "같은 움직임을 anime.js 와 Theatre.js 는 어떻게 적을까?  (3단계에서)", 330, LY(1) + 108, 13, PAL.muted, 500, "center");
    }
    const names = ["등속", "감속", "세 도구"], cur = L <= 1 ? 0 : L - 1;
    names[cur] = L === 0 ? "연출 전 · 등속" : (L === 1 ? "GSAP 등속" : (L === 2 ? "GSAP 감속" : "세 도구 비교"));
    vlabel(c, names, cur);
  },
};
export default demo;
