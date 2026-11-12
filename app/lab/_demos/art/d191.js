/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/js-graphics-libs/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, rng, canvas, rr } from "./helpers.js";

// 같은 움직임(공 하나가 오른쪽으로 가다 끝에서 감속)을 Three.js · Babylon.js · p5.js · D3 가 각각 어떤 코드로 그리는지 본다. 화면은 시간 t 의 함수다.
// 코드 모양은 각 공식 문서에서 확인한 문법이다. easeOut(t) 는 직접 만든 함수라고 코드에 적어 두었다.
const DIST = 480;                 // 공이 오른쪽으로 가는 거리
const DUR = 1.2;                  // 움직이는 시간(초)
const DELAY = 0.4;                // 출발 전 기다리는 시간(초)
const SANS = '"IBM Plex Sans KR","Malgun Gothic",sans-serif', MONO = '"JetBrains Mono","Malgun Gothic",monospace';
const T = (c, s, x, y, z, col, w, al, f) => { c.save(); c.fillStyle = col; c.font = (w || 500) + " " + z + "px " + (f || SANS); c.textAlign = al || "left"; c.textBaseline = "alphabetic"; c.fillText(s, x, y); c.restore(); };
function grainTile(seed) { const g = document.createElement("canvas"); g.width = g.height = 96; const x = g.getContext("2d"), im = x.createImageData(96, 96), r = rng(seed); for (let i = 0; i < 96 * 96; i++) { const v = (r() * 255) | 0; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } x.putImageData(im, 0, 0); return g; }
function backdrop(c, grain) {
  const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, "#0e1424"); g.addColorStop(1, "#080b13"); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
  const r = c.createRadialGradient(320, 150, 20, 320, 150, 360); r.addColorStop(0, "rgba(70,110,190,.10)"); r.addColorStop(1, "rgba(70,110,190,0)"); c.fillStyle = r; c.fillRect(0, 0, 640, 360);
  c.save(); c.globalAlpha = 0.045; c.fillStyle = c.createPattern(grain, "repeat"); c.fillRect(0, 0, 640, 360); c.restore();
}
function pill(c, s) { c.save(); c.font = "500 12px " + SANS; const w = c.measureText(s).width + 22; rr(c, 14, 12, w, 22, 11); c.fillStyle = "rgba(8,10,20,.78)"; c.fill(); c.strokeStyle = "rgba(255,255,255,.16)"; c.lineWidth = 1; c.stroke(); c.restore(); T(c, s, 25, 27, 12, "#fff", 500); }
function ball(c, x, y, r) {
  const sh = c.createRadialGradient(x + 3, y + r + 4, 1, x + 3, y + r + 4, r * 1.3); sh.addColorStop(0, "rgba(0,0,0,.5)"); sh.addColorStop(1, "rgba(0,0,0,0)");
  c.save(); c.translate(0, y + r + 4); c.scale(1, 0.28); c.translate(0, -(y + r + 4)); c.fillStyle = sh; c.beginPath(); c.arc(x + 3, y + r + 4, r * 1.3, 0, 7); c.fill(); c.restore();
  const g = c.createRadialGradient(x - r * 0.38, y - r * 0.42, 1, x, y, r); g.addColorStop(0, "#fff7e6"); g.addColorStop(0.28, "#ffb066"); g.addColorStop(0.72, "#df553a"); g.addColorStop(1, "#5e1c20");
  c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
}
function flat(c, x, y, r, stroke) {
  const g = c.createRadialGradient(x - r * 0.3, y - r * 0.35, 1, x, y, r); g.addColorStop(0, "#ffd9a8"); g.addColorStop(1, "#ff8a4d");
  c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.strokeStyle = stroke; c.lineWidth = 1.4; c.stroke();
}
function codeLine(c, line, x, y) {
  const re = /("[^"]*"|'[^']*'|\/\/.*|\d+\.?\d*|[A-Za-z_.]+(?=\())/g; let last = 0, m, cx = x;
  c.font = "500 10px " + MONO; c.textBaseline = "alphabetic"; c.textAlign = "left";
  const put = (s, col) => { c.fillStyle = col; c.fillText(s, cx, y); cx += c.measureText(s).width; };
  while ((m = re.exec(line))) {
    if (m.index > last) put(line.slice(last, m.index), "#c9d1e0");
    const k = m[0]; put(k, k[0] === '"' || k[0] === "'" ? "#9be7a5" : (k.startsWith("//") ? "#7d8aa3" : (/^\d/.test(k) ? "#ffb870" : "#8ec1ff")));
    last = m.index + k.length;
  }
  if (last < line.length) put(line.slice(last), "#c9d1e0");
}
const f1 = (v) => String(+v.toFixed(1));
const CELL = [[14, 40], [320, 40], [14, 196], [320, 196]], CW = 306, CH = 150;

// 칸마다 배경(그 도구가 그리는 장면의 분위기)과 공 모양
const STRIP = {
  three(c, x, y, w, h) {
    const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, "#0a0f1e"); g.addColorStop(1, "#18213d"); c.fillStyle = g; rr(c, x, y, w, h, 8); c.fill();
    c.save(); rr(c, x, y, w, h, 8); c.clip(); c.strokeStyle = "rgba(120,160,255,.25)"; c.lineWidth = 1; c.beginPath();
    for (let i = -6; i <= 6; i++) { c.moveTo(x + w / 2 + i * 14, y + h * 0.62); c.lineTo(x + w / 2 + i * 62, y + h); }
    for (let k = 0; k < 3; k++) { const yy = y + h * (0.62 + 0.13 * k * k * 0.9 + 0.05 * k); c.moveTo(x, yy); c.lineTo(x + w, yy); }
    c.stroke(); c.restore();
  },
  babylon(c, x, y, w, h) {
    c.save(); rr(c, x, y, w, h, 8); c.clip(); const g = c.createLinearGradient(0, y, 0, y + h * 0.62); g.addColorStop(0, "#27406e"); g.addColorStop(1, "#7f9bd0"); c.fillStyle = g; c.fillRect(x, y, w, h);
    const gg = c.createLinearGradient(0, y + h * 0.62, 0, y + h); gg.addColorStop(0, "#394a68"); gg.addColorStop(1, "#1b2438"); c.fillStyle = gg; c.fillRect(x, y + h * 0.62, w, h * 0.38); c.restore();
  },
  p5(c, x, y, w, h) { c.fillStyle = "#e7e9ef"; rr(c, x, y, w, h, 8); c.fill(); },
  d3(c, x, y, w, h) {
    c.fillStyle = "#101a30"; rr(c, x, y, w, h, 8); c.fill(); c.strokeStyle = "rgba(255,255,255,.35)"; c.lineWidth = 1; c.beginPath(); c.moveTo(x + 14, y + h - 12.5); c.lineTo(x + w - 14, y + h - 12.5);
    for (let i = 0; i <= 5; i++) { c.moveTo(x + 14 + i * (w - 28) / 5, y + h - 12.5); c.lineTo(x + 14 + i * (w - 28) / 5, y + h - 8); } c.stroke();
  },
};

const demo = {
  dur: 3.6, rest: 3.2, noCompare: false, levels: 5,
  mount(sp) { const c = canvas(sp); c.canvas.style.cssText = "width:640px;height:360px;display:block"; return { c, grain: grainTile(61) }; },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 5 : lv);   // 1 = Three.js 직선, 2 = 감속, 3 = + Babylon.js, 4 = + p5.js, 5 = + D3
    const eased = L >= 2, count = L >= 5 ? 4 : (L === 4 ? 3 : (L === 3 ? 2 : 1));
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1; backdrop(c, s.grain);
    const u = seg(t, DELAY, DELAY + DUR), pr = eased ? E.outC(u) : u, travel = DIST * 0.4, fn = eased ? "easeOut( t )" : "t";
    const lab = "// t=(시간-" + f1(DELAY) + ")/" + f1(DUR) + ": 0~1, easeOut=직접 작성";
    const mm = (DIST / 100).toFixed(1);
    const cells = [
      { n: "Three.js", d: "WebGL 3D 라이브러리", col: "#7cc7ff", key: "three", ball: 0, lines: [lab, "function animate( time ) {", "  mesh.position.x = " + mm + " * " + fn + ";", "  renderer.render( scene, camera );", "} renderer.setAnimationLoop( animate );"] },
      { n: "Babylon.js", d: "3D 웹 그래픽 엔진", col: "#ffb44d", key: "babylon", ball: 0, lines: [lab, "engine.runRenderLoop(function () {", "  sphere.position.x = " + mm + " * " + fn + ";", "  scene.render();", "});"] },
      { n: "p5.js", d: "draw() 가 반복 실행", col: "#ff6b9a", key: "p5", ball: 1, lines: [lab, "function draw() {", "  let x = lerp( 0, " + DIST + ", " + fn + " );", "  circle( x, 180, 40 );", "}"] },
      { n: "D3", d: "데이터 시각화 라이브러리", col: "#9be7a5", key: "d3", ball: 2, lines: ['d3.select("circle").transition()', "  .delay(" + Math.round(DELAY * 1000) + ").duration(" + Math.round(DUR * 1000) + ")", "  .ease(d3.easeCubicOut)", '  .attr("cx", ' + DIST + ");"] },
    ];
    cells.forEach((cl, i) => {
      const [x, y] = CELL[i];
      if (i >= count) {
        c.fillStyle = "rgba(255,255,255,.03)"; rr(c, x, y, CW, CH, 10); c.fill(); c.strokeStyle = "rgba(255,255,255,.1)"; c.lineWidth = 1; c.setLineDash([4, 5]); c.stroke(); c.setLineDash([]);
        T(c, cl.n + " — " + (i + 2) + "단계에서", x + CW / 2, y + CH / 2 + 4, 12, "#6f7a8f", 500, "center"); return;
      }
      c.fillStyle = "rgba(255,255,255,.055)"; rr(c, x, y, CW, CH, 10); c.fill(); c.strokeStyle = "rgba(255,255,255,.12)"; c.lineWidth = 1; c.stroke();
      c.fillStyle = cl.col; rr(c, x + 10, y + 8, 8, 8, 2); c.fill(); T(c, cl.n, x + 24, y + 16, 12, "#fff", 700); T(c, cl.d, x + 24 + cl.n.length * 7.4 + 8, y + 16, 10.5, "#a9b3c4", 500);
      const sx = x + 10, sy = y + 24, sw = CW - 20, sh = 56;
      STRIP[cl.key](c, sx, sy, sw, sh);
      const bx = sx + 30 + travel * pr, by = sy + (cl.key === "d3" ? 22 : 24);
      if (cl.ball === 0) ball(c, bx, by, 10); else if (cl.ball === 1) flat(c, bx, by + 2, 10.5, "#1d2433"); else flat(c, bx, by, 10, "#ffffff");
      cl.lines.forEach((l, k) => codeLine(c, l, x + 12, y + 96 + k * 11.8));
    });
    pill(c, L === 0 ? "연출 전 · 같은 속도로 가는 공(직선)" : (L === 1 ? "Three.js · 프레임마다 위치를 직접 계산(직선)" : (L === 2 ? "Three.js · 끝에서 감속(easeOut)" : (L === 3 ? "Babylon.js 도 같은 방식(렌더 루프)" : (L === 4 ? "p5.js · draw() 가 반복 실행되는 스케치" : "D3 · 전환(transition)이 보간을 대신 해 준다")))));
  },
};
export default demo;
