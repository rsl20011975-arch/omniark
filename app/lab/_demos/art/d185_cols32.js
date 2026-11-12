/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/bitrate/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, rng, canvas, rr } from "./helpers.js";

// 비트레이트(1초에 쓰는 정보량)가 낮아질수록 블록 안에 남는 정보가 줄어드는 일반 원리를 도식으로 본다. 실제 코덱을 흉내 낸 것이 아니다. 화면은 시간 t 의 함수다.
const LOW_CELLS = 1;              // 가장 낮은 단계에서 블록 한 개 안에 남기는 정보 칸(가로·세로 개수)
const COLS = 32;                  // 블록을 가로로 몇 개로 나누는가(세로는 16:9 에 맞춰 자동)
const HOLD = 0.7, GAP = 1.0, FADE = 0.45;   // 처음 멈춤(초), 단계 사이 간격(초), 단계가 바뀌는 데 걸리는 시간(초)
const LADDER = [8, 4, 2, 1];      // 정보 칸 단계(가로·세로 개수)
const SW = 800, SH = 450;
const SANS = '"IBM Plex Sans KR","Malgun Gothic",sans-serif', MONO = '"JetBrains Mono","Malgun Gothic",monospace';
const T = (c, s, x, y, z, col, w, al, f) => { c.save(); c.fillStyle = col; c.font = (w || 500) + " " + z + "px " + (f || SANS); c.textAlign = al || "left"; c.textBaseline = "alphabetic"; c.fillText(s, x, y); c.restore(); };
function grainTile(seed) { const g = document.createElement("canvas"); g.width = g.height = 96; const x = g.getContext("2d"), im = x.createImageData(96, 96), r = rng(seed); for (let i = 0; i < 96 * 96; i++) { const v = (r() * 255) | 0; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } x.putImageData(im, 0, 0); return g; }
function backdrop(c, grain) {
  const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, "#0e1424"); g.addColorStop(1, "#080b13"); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
  const r = c.createRadialGradient(320, 150, 20, 320, 150, 360); r.addColorStop(0, "rgba(70,110,190,.10)"); r.addColorStop(1, "rgba(70,110,190,0)"); c.fillStyle = r; c.fillRect(0, 0, 640, 360);
  c.save(); c.globalAlpha = 0.045; c.fillStyle = c.createPattern(grain, "repeat"); c.fillRect(0, 0, 640, 360); c.restore();
}
function pill(c, s) { c.save(); c.font = "500 12px " + SANS; const w = c.measureText(s).width + 22; rr(c, 14, 12, w, 22, 11); c.fillStyle = "rgba(8,10,20,.78)"; c.fill(); c.strokeStyle = "rgba(255,255,255,.16)"; c.lineWidth = 1; c.stroke(); c.restore(); T(c, s, 25, 27, 12, "#fff", 500); }

// 잔 디테일이 많은 원본 그림(고층 건물의 창, 줄무늬 현수막, 가는 글자, 풀잎)
function drawSource(c) {
  const R = rng(5);
  const sky = c.createLinearGradient(0, 0, 0, 340); sky.addColorStop(0, "#0f2a4d"); sky.addColorStop(0.55, "#2b7a94"); sky.addColorStop(1, "#f2a65a");
  c.fillStyle = sky; c.fillRect(0, 0, SW, SH);
  const sun = c.createRadialGradient(600, 250, 4, 600, 250, 150); sun.addColorStop(0, "rgba(255,244,214,1)"); sun.addColorStop(0.3, "rgba(255,206,140,.7)"); sun.addColorStop(1, "rgba(255,170,100,0)");
  c.fillStyle = sun; c.fillRect(0, 0, SW, SH);
  c.strokeStyle = "rgba(255,246,220,.55)"; c.lineWidth = 1;
  for (let r = 14; r < 80; r += 7) { c.beginPath(); c.arc(600, 250, r, 0, 7); c.stroke(); }
  let x = 0;
  while (x < SW) {
    const w = 34 + ((R() * 30) | 0), h = 90 + ((R() * 140) | 0);
    c.fillStyle = "#0c1322"; c.fillRect(x, 340 - h, w, h + 30);
    for (let wy = 340 - h + 8; wy < 336; wy += 9) for (let wx = x + 5; wx < x + w - 6; wx += 7) { c.fillStyle = R() > 0.55 ? "#ffd98a" : "#19233a"; c.fillRect(wx, wy, 4, 6); }
    x += w + 2;
  }
  c.save(); c.beginPath(); c.rect(50, 52, 300, 70); c.clip(); c.fillStyle = "#101a30"; c.fillRect(50, 52, 300, 70);
  c.lineWidth = 3; for (let i = -80; i < 320; i += 9) { c.strokeStyle = (i / 9) % 2 ? "#ffffff" : "#e0457b"; c.beginPath(); c.moveTo(50 + i, 122); c.lineTo(50 + i + 70, 52); c.stroke(); }
  c.fillStyle = "rgba(10,16,30,.78)"; c.fillRect(50, 66, 300, 42); c.restore();
  T(c, "DETAIL 2468", 200, 96, 30, "#fff", 700, "center", MONO);
  const g = c.createLinearGradient(0, 340, 0, SH); g.addColorStop(0, "#1c3a2c"); g.addColorStop(1, "#0a1a14"); c.fillStyle = g; c.fillRect(0, 340, SW, SH - 340);
  for (let i = 0; i < 700; i++) { const gx = R() * SW, gy = 340 + R() * 110, l = 6 + R() * 16; c.strokeStyle = R() > 0.5 ? "#4f9a5c" : "#2b6b3e"; c.lineWidth = 1; c.beginPath(); c.moveTo(gx, gy); c.lineTo(gx + (R() - 0.5) * 8, gy - l); c.stroke(); }
}
// 블록마다 m×m 칸으로 나눠 칸 평균색만 남긴다(m 이 작을수록 정보가 적다)
function quantize(d, m) {
  const o = document.createElement("canvas"); o.width = SW; o.height = SH; const oc = o.getContext("2d");
  const bw = SW / COLS, rows = Math.ceil(SH / bw);
  for (let by = 0; by < rows; by++) for (let bx = 0; bx < COLS; bx++) for (let cy = 0; cy < m; cy++) for (let cx = 0; cx < m; cx++) {
    const x0 = Math.round(bx * bw + cx * bw / m), x1 = Math.min(SW, Math.round(bx * bw + (cx + 1) * bw / m));
    const y0 = Math.round(by * bw + cy * bw / m), y1 = Math.min(SH, Math.round(by * bw + (cy + 1) * bw / m));
    if (x1 <= x0 || y1 <= y0) continue;
    let r = 0, gg = 0, b = 0, n = 0;
    for (let y = y0; y < y1; y++) for (let xx = x0; xx < x1; xx++) { const i = (y * SW + xx) * 4; r += d[i]; gg += d[i + 1]; b += d[i + 2]; n++; }
    oc.fillStyle = "rgb(" + Math.round(r / n) + "," + Math.round(gg / n) + "," + Math.round(b / n) + ")"; oc.fillRect(x0, y0, x1 - x0, y1 - y0);
  }
  return o;
}
function build(s) {
  const src = document.createElement("canvas"); src.width = SW; src.height = SH; const sc = src.getContext("2d", { willReadFrequently: true }); drawSource(sc);
  const d = sc.getImageData(0, 0, SW, SH).data;   // 한 번만 읽는다
  s.cv = { 0: src }; LADDER.forEach((m) => { s.cv[m] = quantize(d, m); });
}

const PX = 16, PY = 62, PW = 400, PH = 225;
const demo = {
  dur: 5.6, rest: 4.8, noCompare: false, levels: 3,
  mount(sp) {
    const c = canvas(sp); c.canvas.style.cssText = "width:640px;height:360px;display:block";
    const s = { c, grain: grainTile(9), ok: false }; build(s); return s;
  },
  render(s, t, a, lv) {
    if (!s.ok && document.fonts.check('700 30px "JetBrains Mono"')) { build(s); s.ok = true; }   // 글꼴이 준비되면 원본 그림을 다시 그린다
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 블록으로 나눠 보기만, 2 = 정보 칸을 8×8 → 4×4 로, 3 = 가장 낮은 단계까지
    const low = Math.max(1, LOW_CELLS);
    const ladder = [0].concat(LADDER.filter((m) => (L >= 3 ? m >= low : (L === 2 ? m >= 4 : false))));
    let j = 0; for (let i = 0; i < ladder.length - 1; i++) j += E.inOutC(seg(t, HOLD + i * GAP, HOLD + i * GAP + FADE));
    const i0 = Math.min(Math.floor(j), Math.max(0, ladder.length - 2)), fr = ladder.length > 1 ? j - i0 : 0;
    const m0 = ladder[i0], m1 = ladder[Math.min(i0 + 1, ladder.length - 1)], mNow = ladder[Math.min(ladder.length - 1, Math.round(j))];
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1; backdrop(c, s.grain);
    // 그림
    c.save(); c.shadowColor = "rgba(0,0,0,.55)"; c.shadowBlur = 18; c.shadowOffsetY = 6; c.fillStyle = "#000"; c.fillRect(PX, PY, PW, PH); c.restore();
    c.drawImage(s.cv[m0], PX, PY, PW, PH); if (fr > 0.001) { c.globalAlpha = fr; c.drawImage(s.cv[m1], PX, PY, PW, PH); c.globalAlpha = 1; }
    const bw = SW / COLS, rows = Math.ceil(SH / bw), q = PW / SW;
    if (L >= 1) {
      c.strokeStyle = "rgba(255,255,255,.22)"; c.lineWidth = 1; c.beginPath();
      for (let i = 1; i < COLS; i++) { c.moveTo(PX + i * bw * q + 0.5, PY); c.lineTo(PX + i * bw * q + 0.5, PY + PH); }
      for (let i = 1; i < rows; i++) { const yy = PY + i * bw * q; if (yy < PY + PH) { c.moveTo(PX, yy + 0.5); c.lineTo(PX + PW, yy + 0.5); } }
      c.stroke();
    }
    c.strokeStyle = "rgba(255,255,255,.25)"; c.lineWidth = 1; c.strokeRect(PX - 0.5, PY - 0.5, PW + 1, PH + 1);
    // 확대할 블록
    const col = Math.floor(COLS * 0.56), row = Math.floor(rows * 0.5);
    const rx = PX + col * bw * q, ry = PY + row * bw * q;
    if (L >= 1) { c.strokeStyle = "#ffd27a"; c.lineWidth = 2; c.strokeRect(rx, ry, bw * q, bw * q); }
    // 오른쪽: 블록 하나 확대 + 파일 크기 계산
    const MX = 485, MY = 84, MS = 96;
    T(c, "비트레이트 = 1초에 쓰는 정보량", 440, 62, 12, "#fff", 700);
    c.save(); c.beginPath(); c.rect(MX, MY, MS, MS); c.clip(); c.imageSmoothingEnabled = false;
    const sx = col * bw, sy = row * bw;
    c.drawImage(s.cv[m0], sx, sy, bw, bw, MX, MY, MS, MS); if (fr > 0.001) { c.globalAlpha = fr; c.drawImage(s.cv[m1], sx, sy, bw, bw, MX, MY, MS, MS); c.globalAlpha = 1; }
    c.restore();
    c.strokeStyle = L >= 1 ? "#ffd27a" : "rgba(255,255,255,.3)"; c.lineWidth = 2; c.strokeRect(MX, MY, MS, MS);
    T(c, L >= 1 ? "노란 블록 하나를 확대" : "한 부분을 확대", MX + MS / 2, MY + MS + 16, 11, "#c9d1e0", 500, "center");
    const hi = !a || mNow === 0 || mNow === 8 || L <= 1, lo = a && L >= 2 && !hi;
    const rowc = (y, on, title, val) => { T(c, title, 440, y, 11, on ? "#ffd27a" : "#8b94a3", 700); T(c, val, 440, y + 16, 11, on ? "#ffffff" : "#8b94a3", 500, "left", MONO); };
    rowc(236, hi, "높은 비트레이트 예: 8 Mbit/s", "× 10초 ÷ 8 = 10 MB");
    rowc(276, lo, "낮은 비트레이트 예: 2 Mbit/s", "× 10초 ÷ 8 = 2.5 MB");
    T(c, "예시 숫자이며 실제 화질은 영상·코덱마다 다름", 440, 326, 10, "#8b94a3", 500);
    // 아래 설명
    const nm = mNow === 0 ? "원본 그대로" : (mNow === 1 ? "블록마다 평균색 하나(1×1)" : "블록마다 정보 칸 " + mNow + "×" + mNow);
    T(c, !a || L < 2 ? "정보를 아끼지 않은 상태" : nm, PX, 312, 15, "#ffd27a", 700);
    T(c, !a || L < 2 ? "블록 = 한 번에 다루는 작은 네모(도식)" : (mNow === 0 ? "블록 안의 잔 무늬가 모두 남아 있다" : (mNow === 1 ? "블록이 한 가지 색으로 뭉치고 경계가 보인다" : "블록 안의 잔 무늬가 흐려진다")), PX, 332, 12, "#c9d1e0", 500);
    pill(c, !a ? "연출 전 · 정보를 아끼지 않은 원본" : "비트레이트가 낮아지는 도식(실제 코덱 아님)");
  },
};
export default demo;
