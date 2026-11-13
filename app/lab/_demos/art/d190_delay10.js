/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/code-video-tools/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, rng, canvas, rr } from "./helpers.js";

// 같은 움직임(공 하나가 오른쪽으로 가다 끝에서 감속)을 Remotion · Motion Canvas · Manim 이 코드로 어떻게 적고 어떻게 프레임이 되는지 본다. 화면은 시간 t 의 함수다.
// 코드 모양은 각 공식 문서에서 확인한 문법이다. 공의 움직임은 이 도식이 직접 계산한 것이다.
const DIST = 480;                 // 공이 오른쪽으로 가는 거리(px, Manim 은 장면 단위로 환산해 적는다)
const DUR = 1.2;                  // 움직이는 시간(초)
const DELAY = 1.0;                // 출발 전 기다리는 시간(초)
const FPS = 30;                   // 초당 프레임 수
const PAL = { bg0: "#f2f2f0", bg1: "#e4e4e1", ink: "#111111", muted: "#666666", accent: "#ff3b1f", accent2: "#111111", surface: "#ffffff", line: "rgba(17,17,17,.2)" };
const SANS = '"IBM Plex Sans KR","Malgun Gothic",sans-serif', MONO = '"JetBrains Mono","Malgun Gothic",monospace';
const T = (c, s, x, y, z, col, w, al, f) => { c.save(); c.fillStyle = col; c.font = (w || 500) + " " + z + "px " + (f || SANS); c.textAlign = al || "left"; c.textBaseline = "alphabetic"; c.fillText(s, x, y); c.restore(); };
function grainTile(seed) { const g = document.createElement("canvas"); g.width = g.height = 96; const x = g.getContext("2d"), im = x.createImageData(96, 96), r = rng(seed); for (let i = 0; i < 96 * 96; i++) { const v = (r() * 255) | 0; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } x.putImageData(im, 0, 0); return g; }
function backdrop(c, grain) {
  const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, PAL.bg0); g.addColorStop(1, PAL.bg1); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
  const r = c.createRadialGradient(320, 150, 20, 320, 150, 360); r.addColorStop(0, "rgba(255,255,255,.6)"); r.addColorStop(1, "rgba(255,255,255,0)"); c.fillStyle = r; c.fillRect(0, 0, 640, 360);
  c.save(); c.globalAlpha = 0.045; c.fillStyle = c.createPattern(grain, "repeat"); c.fillRect(0, 0, 640, 360); c.restore();
}
function tag(c, s) {   // 오른쪽 위 이름표: 거의 직각, 왼쪽 3px 액센트 줄
  c.save(); c.font = "600 12px " + SANS; const w = c.measureText(s).width + 24, x = 626 - w, y = 10;
  c.shadowColor = "rgba(17,17,17,.16)"; c.shadowBlur = 6; c.shadowOffsetY = 2; rr(c, x, y, w, 22, 2); c.fillStyle = PAL.surface; c.fill(); c.restore();
  c.save(); rr(c, x, y, w, 22, 2); c.strokeStyle = PAL.line; c.lineWidth = 1; c.stroke(); c.fillStyle = PAL.accent; c.fillRect(x, y, 3, 22); c.restore();
  T(c, s, x + 13, y + 15, 12, PAL.ink, 600);
}
function ball(c, x, y, r, dim) {
  const sh = c.createRadialGradient(x + 3, y + r + 4, 1, x + 3, y + r + 4, r * 1.3); sh.addColorStop(0, "rgba(17,17,17,.4)"); sh.addColorStop(1, "rgba(0,0,0,0)");
  c.save(); c.globalAlpha = dim == null ? 1 : dim; c.save(); c.translate(0, y + r + 4); c.scale(1, 0.28); c.translate(0, -(y + r + 4)); c.fillStyle = sh; c.beginPath(); c.arc(x + 3, y + r + 4, r * 1.3, 0, 7); c.fill(); c.restore();
  const g = c.createRadialGradient(x - r * 0.38, y - r * 0.42, 1, x, y, r); g.addColorStop(0, "#fff1e8"); g.addColorStop(0.28, "#ff8a62"); g.addColorStop(0.72, "#e0301a"); g.addColorStop(1, "#6b1208");
  c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.restore();
}
function codeLine(c, line, x, y) {
  const re = /("[^"]*"|'[^']*'|\/\/.*|#.*|\d+\.?\d*|[A-Za-z_.]+(?=\())/g; let last = 0, m, cx = x;
  c.font = "500 10px " + MONO; c.textBaseline = "alphabetic"; c.textAlign = "left";
  const put = (s, col) => { c.fillStyle = col; c.fillText(s, cx, y); cx += c.measureText(s).width; };
  while ((m = re.exec(line))) {
    if (m.index > last) put(line.slice(last, m.index), "#2b2b29");
    const k = m[0]; put(k, k[0] === '"' || k[0] === "'" ? "#1f7a3f" : (k.startsWith("//") || k[0] === "#" ? "#6b6b66" : (/^\d/.test(k) ? "#b4530b" : "#1d4ed8")));
    last = m.index + k.length;
  }
  if (last < line.length) put(line.slice(last), "#2b2b29");
}
const f1 = (v) => String(+v.toFixed(1));
const LH = 104, LY = (i) => 40 + i * 106, CX = 14, CW = 336, TX = 358, TW = 268;
const FR = [0, 1, 2, 3, 4, 5, 6];   // 필름 칸 7개(0.2초 간격)

const demo = {
  dur: 3.6, rest: 3.2, noCompare: false, levels: 3,
  mount(sp) { const c = canvas(sp); c.canvas.style.cssText = "width:640px;height:360px;display:block"; return { c, grain: grainTile(51) }; },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = Remotion 직선(기본 easing), 2 = Remotion 감속, 3 = + Motion Canvas · Manim
    const eased = L >= 2, count = L >= 3 ? 3 : 1;
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1; backdrop(c, s.grain);
    const ease = eased ? E.outC : E.lin, prog = (tt) => ease(seg(tt, DELAY, DELAY + DUR));
    const travel = DIST * 0.45, fa = Math.round(DELAY * FPS), fb = fa + Math.round(DUR * FPS), frame = Math.min(Math.round(t * FPS), 119);
    const lanes = [
      { n: "Remotion", sub: "React · TypeScript", col: "#2563eb", lines: ["const frame = useCurrentFrame();", "const x = interpolate(frame, [" + fa + ", " + fb + "], [0, " + DIST + "], {"].concat(eased ? ["  easing: Easing.out(Easing.cubic),"] : []).concat(["  extrapolateLeft: 'clamp',", "  extrapolateRight: 'clamp',", "});"]) },
      { n: "Motion Canvas", sub: "TypeScript · 편집기", col: "#d6336c", lines: ["yield* waitFor(" + f1(DELAY) + ");", "yield* tween(" + f1(DUR) + ", value => {", "  ball().position.x(easeOutCubic(value, 0, " + DIST + "));", "});", "// 편집기에서 저장하면 바로 미리보기"] },
      { n: "Manim", sub: "Python · 수학 애니메이션", col: "#0f8f76", lines: ["self.wait(" + f1(DELAY) + ")", "self.play(", "    ball.animate.shift(" + (DIST / 100).toFixed(1) + " * RIGHT),", "    run_time=" + f1(DUR) + ",", "    rate_func=rate_functions.ease_out_cubic,", ")"] },
    ];
    lanes.slice(0, count).forEach((ln, i) => {
      const y = LY(i);
      c.save(); c.shadowColor = "rgba(17,17,17,.12)"; c.shadowBlur = 8; c.shadowOffsetY = 2; c.fillStyle = PAL.surface; rr(c, CX, y, CW, LH, 10); c.fill(); c.restore(); c.strokeStyle = PAL.line; c.lineWidth = 1; rr(c, CX, y, CW, LH, 10); c.stroke();
      c.fillStyle = ln.col; rr(c, CX + 10, y + 9, 8, 8, 2); c.fill(); T(c, ln.n, CX + 24, y + 17, 12, PAL.ink, 700); T(c, ln.sub, CX + 24 + (ln.n.length * 7.6 + 8), y + 17, 10.5, PAL.muted, 500);
      ln.lines.forEach((l, k) => codeLine(c, l, CX + 12, y + 32 + k * 12.2));
      c.fillStyle = "rgba(17,17,17,.04)"; rr(c, TX, y, TW, LH, 10); c.fill(); c.strokeStyle = PAL.line; c.stroke();
      const x0 = TX + 24, by = y + 28;
      c.strokeStyle = "rgba(17,17,17,.28)"; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(x0, by + 17); c.lineTo(x0 + travel, by + 17); c.stroke(); c.setLineDash([]);
      c.strokeStyle = "rgba(17,17,17,.45)"; c.beginPath(); c.moveTo(x0 + travel + 0.5, by + 7); c.lineTo(x0 + travel + 0.5, by + 27); c.stroke();
      ball(c, x0 + travel * prog(t), by, 12);
      // 필름: 0.2초마다 한 칸씩 ‘렌더된 프레임’
      const fw = 33, gap = 5, fx0 = TX + (TW - (FR.length * fw + (FR.length - 1) * gap)) / 2, fy = y + 62;
      FR.forEach((k) => {
        const tk = DELAY + k * 0.2, fx = fx0 + k * (fw + gap), done = t >= tk, cur = done && (k === FR.length - 1 || t < DELAY + (k + 1) * 0.2);
        c.fillStyle = done ? PAL.ink : "rgba(17,17,17,.05)"; rr(c, fx, fy, fw, 22, 3); c.fill();
        c.strokeStyle = cur ? PAL.accent : "rgba(17,17,17,.25)"; c.lineWidth = cur ? 2.2 : 1; rr(c, fx, fy, fw, 22, 3); c.stroke();
        if (done) { const bx = fx + 6 + (fw - 12) * prog(tk); ball(c, bx, fy + 11, 3.6, 1); }
      });
      T(c, "프레임 " + frame + "  (" + FPS + "fps)", TX + 12, y + 17, 10.5, PAL.accent, 700, "left", MONO);
      T(c, "렌더된 프레임이 쌓여 영상이 된다", TX + TW / 2, y + 96, 10, PAL.muted, 500, "center");
    });
    if (count < 3) {
      c.fillStyle = "rgba(17,17,17,.03)"; rr(c, CX, LY(1) + 4, 612, 210, 12); c.fill(); c.strokeStyle = PAL.line; c.setLineDash([4, 5]); c.stroke(); c.setLineDash([]);
      T(c, "같은 움직임을 Motion Canvas 와 Manim 은 어떻게 적을까?  (3단계에서)", 320, LY(1) + 114, 13, PAL.muted, 500, "center");
    }
    tag(c, L === 0 ? "연출 전 · 같은 속도로 가는 공(기본 easing 은 직선)" : (L === 1 ? "Remotion · 같은 속도(interpolate 기본)" : (L === 2 ? "Remotion · 끝에서 감속(Easing.out)" : "같은 공, 코드로 영상을 만드는 세 방식")));
  },
};
export default demo;
