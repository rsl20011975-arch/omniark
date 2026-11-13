/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/aspect-ratio/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, rng, canvas, rr } from "./helpers.js";

// 16:9 로 찍은 같은 장면을 1:1 · 4:5 · 9:16 틀에 넣으면 어디가 잘리는지 본다. 도식이며, 화면은 시간 t 의 함수다.
const CROP_X = 0.15;               // 잘라 낼 틀의 가로 위치(0 = 맨 왼쪽, 0.5 = 가운데, 1 = 맨 오른쪽)
const TALL_W = 9;                 // 세로 틀의 폭 비율
const TALL_H = 16;                // 세로 틀의 높이 비율
const SW = [0.9, 2.5, 4.1], MV = 0.55;   // 틀이 바뀌기 시작하는 시각(초), 바뀌는 데 걸리는 시간(초)
const PAL = { bg0: "#e6f2ec", bg1: "#d4e8de", ink: "#0f2a22", muted: "#4f6e63", accent: "#0f9d6b", accent2: "#c2410c", surface: "#f6fbf8", line: "rgba(15,42,34,.24)" };
const SANS = '"IBM Plex Sans KR","Malgun Gothic",sans-serif', MONO = '"JetBrains Mono","Malgun Gothic",monospace', HAN = '"Black Han Sans","Malgun Gothic",sans-serif';
const T = (c, s, x, y, z, col, w, al, f) => { c.save(); c.fillStyle = col; c.font = (w || 500) + " " + z + "px " + (f || SANS); c.textAlign = al || "left"; c.textBaseline = "alphabetic"; c.fillText(s, x, y); c.restore(); };
function grainTile(seed) { const g = document.createElement("canvas"); g.width = g.height = 96; const x = g.getContext("2d"), im = x.createImageData(96, 96), r = rng(seed); for (let i = 0; i < 96 * 96; i++) { const v = (r() * 255) | 0; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } x.putImageData(im, 0, 0); return g; }
function hatchTile() { const g = document.createElement("canvas"); g.width = g.height = 8; const x = g.getContext("2d"); x.strokeStyle = "rgba(255,255,255,.5)"; x.lineWidth = 1; x.beginPath(); x.moveTo(0, 8); x.lineTo(8, 0); x.stroke(); return g; }
function backdrop(c, grain) {
  const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, PAL.bg0); g.addColorStop(1, PAL.bg1); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
  const r = c.createRadialGradient(320, 150, 20, 320, 150, 360); r.addColorStop(0, "rgba(255,255,255,.55)"); r.addColorStop(1, "rgba(255,255,255,0)"); c.fillStyle = r; c.fillRect(0, 0, 640, 360);
  c.save(); c.globalAlpha = 0.045; c.fillStyle = c.createPattern(grain, "repeat"); c.fillRect(0, 0, 640, 360); c.restore();
}
function tag(c, s) {   // 오른쪽 위 이름표: 왼쪽 3px 액센트 줄, 거의 직각
  c.save(); c.font = "600 12px " + SANS; const w = c.measureText(s).width + 24, x = 626 - w, y = 12;
  c.shadowColor = "rgba(15,42,34,.18)"; c.shadowBlur = 6; c.shadowOffsetY = 2; rr(c, x, y, w, 24, 2); c.fillStyle = PAL.surface; c.fill(); c.restore();
  c.save(); rr(c, x, y, w, 24, 2); c.strokeStyle = PAL.line; c.lineWidth = 1; c.stroke(); c.fillStyle = PAL.accent; c.fillRect(x, y, 3, 24); c.restore();
  T(c, s, x + 13, y + 16, 12, PAL.ink, 600);
}

// 960×540 짜리 원본 장면: 노을 하늘, 산, 가운데 제품(구슬), 왼쪽 로고, 오른쪽 문구, 아래 제목
function scene(c) {
  const sky = c.createLinearGradient(0, 0, 0, 540); sky.addColorStop(0, "#26356b"); sky.addColorStop(0.45, "#7d5588"); sky.addColorStop(0.74, "#f0955f"); sky.addColorStop(1, "#ffd08c");
  c.fillStyle = sky; c.fillRect(0, 0, 960, 540);
  const sun = c.createRadialGradient(700, 330, 4, 700, 330, 230); sun.addColorStop(0, "rgba(255,240,200,.95)"); sun.addColorStop(0.18, "rgba(255,214,150,.55)"); sun.addColorStop(1, "rgba(255,180,120,0)");
  c.fillStyle = sun; c.fillRect(0, 0, 960, 540);
  const m1 = c.createLinearGradient(0, 300, 0, 460); m1.addColorStop(0, "#6b4a7e"); m1.addColorStop(1, "#3a2a58");
  c.fillStyle = m1; c.beginPath(); c.moveTo(0, 400); c.lineTo(110, 330); c.lineTo(230, 380); c.lineTo(350, 310); c.lineTo(520, 400); c.lineTo(660, 340); c.lineTo(800, 395); c.lineTo(960, 320); c.lineTo(960, 540); c.lineTo(0, 540); c.fill();
  const m2 = c.createLinearGradient(0, 380, 0, 540); m2.addColorStop(0, "#2a2046"); m2.addColorStop(1, "#110c22");
  c.fillStyle = m2; c.beginPath(); c.moveTo(0, 440); c.quadraticCurveTo(240, 395, 480, 438); c.quadraticCurveTo(720, 478, 960, 420); c.lineTo(960, 540); c.lineTo(0, 540); c.fill();
  const sh = c.createRadialGradient(480, 436, 4, 480, 436, 120); sh.addColorStop(0, "rgba(0,0,0,.6)"); sh.addColorStop(1, "rgba(0,0,0,0)");
  c.save(); c.translate(0, 436); c.scale(1, 0.18); c.translate(0, -436); c.fillStyle = sh; c.fillRect(340, 300, 280, 280); c.restore();
  const o = c.createRadialGradient(445, 290, 6, 480, 335, 100); o.addColorStop(0, "#fff7e2"); o.addColorStop(0.22, "#ffb870"); o.addColorStop(0.68, "#d94a36"); o.addColorStop(1, "#4a141f");
  c.fillStyle = o; c.beginPath(); c.arc(480, 335, 92, 0, 7); c.fill();
  const rim = c.createRadialGradient(540, 395, 10, 520, 380, 90); rim.addColorStop(0, "rgba(255,205,150,.5)"); rim.addColorStop(1, "rgba(255,205,150,0)");
  c.fillStyle = rim; c.beginPath(); c.arc(480, 335, 92, 0, 7); c.fill();
  c.fillStyle = "rgba(255,255,255,.16)"; rr(c, 48, 48, 190, 72, 14); c.fill(); c.strokeStyle = "rgba(255,255,255,.4)"; c.lineWidth = 2; c.stroke();
  T(c, "LOGO", 143, 98, 40, "#fff", 400, "center", HAN);
  c.fillStyle = "rgba(10,10,24,.55)"; rr(c, 700, 430, 220, 62, 31); c.fill(); c.strokeStyle = "rgba(255,255,255,.3)"; c.stroke();
  T(c, "오늘만 50%", 810, 470, 26, "#fff", 700, "center");
  T(c, "2026 SUMMER", 480, 74, 20, "rgba(255,255,255,.85)", 500, "center", MONO);
  T(c, "NEW DROP", 480, 512, 46, "#fff", 400, "center", HAN);
}

const NAMES = ["16:9", "1:1", "4:5", TALL_W + ":" + TALL_H];
const RAT = [16 / 9, 1, 4 / 5, TALL_W / TALL_H];
const SX = 16, SY = 62, SWD = 400, SHT = 225;           // 원본 패널
const OX = 440, OY = 56, OW = 184, OH = 228;            // 결과 틀을 넣는 칸

const demo = {
  dur: 6.2, rest: 5.4, noCompare: false, levels: 3,
  mount(sp) {
    const c = canvas(sp); c.canvas.style.cssText = "width:640px;height:360px;display:block";
    const src = document.createElement("canvas"); src.width = 960; src.height = 540; scene(src.getContext("2d"));
    return { c, src, ok: false, grain: grainTile(7), hatch: c.createPattern(hatchTile(), "repeat") };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 16:9 하나만(세로 화면에 올리면 띠), 2 = + 1:1 · 4:5, 3 = + 세로 틀
    const n = L >= 3 ? 4 : (L === 2 ? 3 : 1);
    if (!s.ok && document.fonts.check('40px "Black Han Sans"') && document.fonts.check('700 26px "IBM Plex Sans KR"')) { scene(s.src.getContext("2d")); s.ok = true; }   // 글꼴이 준비되면 원본 장면을 다시 그린다
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1; backdrop(c, s.grain);
    let k = 0; for (let i = 0; i < n - 1; i++) k += E.inOutC(seg(t, SW[i], SW[i] + MV));
    const idx = Math.min(Math.floor(k), Math.max(0, n - 2)), f = n > 1 ? k - idx : 0;
    const r = n > 1 ? Math.exp(lerp(Math.log(RAT[idx]), Math.log(RAT[idx + 1]), f)) : RAT[0];
    const ww = Math.min(960, 540 * r), wx = (960 - ww) * CROP_X, name = NAMES[Math.min(n - 1, Math.round(k))];
    const cut = Math.round((1 - ww / 960) * 100);
    // 원본 패널 + 잘리는 부분
    const q = SWD / 960;
    c.save(); c.translate(SX, SY); c.scale(q, q); c.drawImage(s.src, 0, 0); c.restore();
    c.save(); c.beginPath(); c.rect(SX, SY, SWD, SHT); c.clip();
    c.fillStyle = "rgba(15,42,34,.66)"; c.beginPath(); c.rect(SX, SY, SWD, SHT); c.rect(SX + (wx + ww) * q, SY, -ww * q, SHT); c.fill("evenodd");
    c.fillStyle = s.hatch; c.globalAlpha = 0.14; c.fill("evenodd"); c.globalAlpha = 1;
    c.restore();
    c.strokeStyle = "rgba(255,255,255,.85)"; c.lineWidth = 4.5; c.strokeRect(SX + wx * q, SY, ww * q, SHT);
    c.strokeStyle = PAL.accent; c.lineWidth = 2.5; c.strokeRect(SX + wx * q, SY, ww * q, SHT);
    c.strokeStyle = PAL.line; c.lineWidth = 1; c.strokeRect(SX - 0.5, SY - 0.5, SWD + 1, SHT + 1);
    // 결과 틀
    let bw = OW, bh = OW / r; if (bh > OH) { bh = OH; bw = OH * r; }
    const bx = OX + (OW - bw) / 2, by = OY + (OH - bh) / 2;
    if (!a || L === 1) {
      const pw = 126, ph = 224, px = OX + (OW - pw) / 2, py = OY + (OH - ph) / 2;
      c.fillStyle = PAL.ink; rr(c, px, py, pw, ph, 10); c.fill();
      c.save(); rr(c, px, py, pw, ph, 10); c.clip(); const vh = pw * 9 / 16; c.translate(px, py + (ph - vh) / 2); c.scale(pw / 960, pw / 960); c.drawImage(s.src, 0, 0); c.restore();
      c.strokeStyle = "rgba(255,255,255,.35)"; c.lineWidth = 1.5; rr(c, px, py, pw, ph, 10); c.stroke();
      T(c, "세로 화면에 올리면 위아래가 빈다", OX + OW / 2, OY + OH + 22, 11, PAL.muted, 500, "center");
    } else {
      c.save(); c.shadowColor = "rgba(15,42,34,.4)"; c.shadowBlur = 16; c.shadowOffsetY = 6; c.fillStyle = "#000"; c.fillRect(bx, by, bw, bh); c.restore();
      c.save(); c.beginPath(); c.rect(bx, by, bw, bh); c.clip(); c.translate(bx, by); c.scale(bw / ww, bw / ww); c.translate(-wx, 0); c.drawImage(s.src, 0, 0); c.restore();
      c.strokeStyle = PAL.accent; c.lineWidth = 2; c.strokeRect(bx, by, bw, bh);
      T(c, name.replace(":", " : "), OX + OW / 2, OY + OH + 28, 26, PAL.ink, 400, "center", HAN);
    }
    // 이름표와 설명
    const lab = !a || L === 1 ? "연출 전 · 16:9 하나만 만든 영상" : "같은 장면을 " + name + " 틀에 넣기";
    tag(c, lab);
    if (a && L > 1) {
      T(c, "남는 폭 = 높이 540 × 비율 = " + Math.round(ww) + "  (원본 폭 960)", SX, 312, 12, PAL.muted, 500, "left", MONO);
      T(c, "가로로 잘린 부분 " + cut + "%", SX, 334, 15, PAL.accent2, 700);
    } else {
      T(c, "원본 폭 960 · 높이 540 (16:9)", SX, 312, 12, PAL.muted, 500, "left", MONO);
      T(c, "자르지 않으면 잘리는 부분 0%", SX, 334, 15, PAL.accent2, 700);
    }
  },
};
export default demo;
