/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/narrative-series/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng, canvas, rr } from "./helpers.js";

// 5편짜리 시리즈의 ‘떡밥 지도’: 어느 편에서 떡밥을 심고(●), 중간에 슬쩍 상기시키고(◐), 어느 편에서 회수하는지(★) 줄로 이어 본다. 화면은 시간 t 의 함수다. (가상 예시)
const SEEDS = 3;                // 심어 두는 떡밥 개수(최대 5)
const HOOK = 1;                 // 1 이면 각 편 끝에 ‘다음 편 궁금’ 훅을 둔다
const T0 = 0.5, STEP = 0.75;    // 첫 편이 켜지는 시각, 편과 편 사이 간격(초)

const TAU = Math.PI * 2;
const INK = "#f4efe4", SEC = "#c3c2b7", MUT = "#8b94a3", RED = "#e66767", ORG = "#ff8a3d";
const SANS = '"IBM Plex Sans KR","Malgun Gothic",sans-serif', HAN = '"Black Han Sans","Malgun Gothic",sans-serif', MONO = '"JetBrains Mono","Malgun Gothic",monospace';
const T = (c, s, x, y, z, col, w, al, f) => { c.save(); c.fillStyle = col; c.font = (w || 500) + " " + z + "px " + (f || SANS); c.textAlign = al || "left"; c.textBaseline = "alphabetic"; c.fillText(s, x, y); c.restore(); };
function grainTile(seed) { const g = document.createElement("canvas"); g.width = g.height = 96; const x = g.getContext("2d"), im = x.createImageData(96, 96), r = rng(seed); for (let i = 0; i < 96 * 96; i++) { const v = (r() * 255) | 0; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } x.putImageData(im, 0, 0); return g; }
function pill(c, s, col, x, right) { c.save(); c.font = "500 12px " + SANS; const w = c.measureText(s).width + 22, x0 = right ? x - w : x; rr(c, x0, 12, w, 22, 11); c.fillStyle = "rgba(8,10,20,.78)"; c.fill(); c.strokeStyle = "rgba(255,255,255,.16)"; c.lineWidth = 1; c.stroke(); c.fillStyle = col || INK; c.textBaseline = "alphabetic"; c.fillText(s, x0 + 11, 27.5); c.restore(); }
function star(c, x, y, R, r0) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r0 : R; c.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad); } c.closePath(); }

const EPS = ["도착", "의심", "단서", "배신", "결말"];
const CX = [138, 240, 342, 444, 546];
const COL = ["#3987e5", "#199e70", "#9085e9", "#c98500", "#d55181"];
const DATA = [   // 떡밥 이름, 심는 편, 상기하는 편, 회수하는 편 (0부터 센다)
  { n: "붉은 열쇠", p: 0, r: [2], k: 3 },
  { n: "낡은 지도", p: 1, r: [3], k: 4 },
  { n: "이름 없는 편지", p: 0, r: [2], k: 4 },
  { n: "깨진 시계", p: 1, r: [2], k: 4 },
  { n: "검은 우산", p: 2, r: [3], k: 4 },
];

const demo = {
  dur: 5, rest: 4.6, noCompare: false, levels: 3,
  mount(sp) { const c = canvas(sp); c.canvas.style.cssText = "width:640px;height:360px;display:block"; return { c, grain: grainTile(23) }; },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 떡밥 심기만(회수 없음), 2 = + 중간 상기, 3 = + 회수 연결과 편 끝 훅
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1;
    const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, "#0e1424"); g.addColorStop(1, "#080b13"); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
    const rg = c.createRadialGradient(320, 170, 20, 320, 170, 340); rg.addColorStop(0, "rgba(90,110,190,.10)"); rg.addColorStop(1, "rgba(90,110,190,0)"); c.fillStyle = rg; c.fillRect(0, 0, 640, 360);
    c.save(); c.globalAlpha = 0.045; c.fillStyle = c.createPattern(s.grain, "repeat"); c.fillRect(0, 0, 640, 360); c.restore();
    const pos = Math.max(0, Math.min(4.01, (t - T0) / STEP));   // 지금 어느 편까지 켜졌는가(소수)
    const seeds = DATA.slice(0, SEEDS), rowH = 164 / SEEDS, Y0 = 134;
    // 편 카드와 막(설정·대립·해결)
    EPS.forEach((e, i) => {
      const u = E.outC(seg(pos, i - 0.3, i + 0.3)), x = CX[i], y = 52 + (1 - u) * -8;
      c.save(); c.globalAlpha = u; const cg = c.createLinearGradient(0, y, 0, y + 38); cg.addColorStop(0, "#2b3550"); cg.addColorStop(1, "#1b2238");
      rr(c, x - 46, y, 92, 38, 9); c.fillStyle = cg; c.fill(); c.strokeStyle = "rgba(255,255,255,.16)"; c.lineWidth = 1; c.stroke(); c.fillStyle = "rgba(255,255,255,.16)"; c.fillRect(x - 40, y + 1, 80, 1);
      T(c, (i + 1) + "화", x - 36, y + 17, 15, INK, 400, "left", HAN); T(c, e, x - 36, y + 32, 11, SEC, 500); c.restore();
      c.save(); c.globalAlpha = u; c.strokeStyle = "rgba(255,255,255,.07)"; c.setLineDash([2, 4]); c.beginPath(); c.moveTo(x, Y0 - 8); c.lineTo(x, Y0 + 164); c.stroke(); c.restore();
    });
    if (L >= 1) { [[0, 0, "설정", "#6fd3ff"], [1, 3, "대립", ORG], [4, 4, "해결", "#9085e9"]].forEach(([a0, a1, tx, col]) => { const u = E.outC(seg(pos, a0 - 0.3, a1 + 0.3)); c.save(); c.globalAlpha = u * 0.9; rr(c, CX[a0] - 46, 98, CX[a1] - CX[a0] + 92, 4, 2); c.fillStyle = col; c.fill(); T(c, tx, (CX[a0] + CX[a1]) / 2, 116, 10.5, col, 700, "center"); c.restore(); }); }
    if (L === 0) { const u = E.outC(seg(pos, 3, 4)); c.save(); c.globalAlpha = u; T(c, "각 편이 따로 놀아요 — 앞 편에서 심은 것도, 다음 편에서 이어질 것도 없다", 340, 200, 14, SEC, 700, "center"); c.restore(); }
    // 떡밥 줄
    let planted = 0, paid = 0;
    if (L >= 1) seeds.forEach((d, i) => {
      const y = Y0 + (i + 0.5) * rowH, col = COL[i], appear = E.outC(seg(pos, d.p - 0.2, d.p + 0.1));
      c.save(); c.globalAlpha = Math.min(1, pos / 0.6); T(c, d.n, 18, y + 4, 12, INK, 700); c.restore();
      if (pos >= d.p) planted++;
      const lastCol = L >= 3 ? d.k : (L >= 2 ? d.r[d.r.length - 1] : d.p);
      // 줄: 심은 곳에서 현재 켜진 곳까지
      const endPos = Math.min(pos, lastCol);
      if (endPos > d.p) { const xe = lerp(CX[d.p], CX[Math.min(4, Math.ceil(endPos))], 0) + (endPos - d.p) * 102; c.strokeStyle = col; c.lineWidth = L >= 3 ? 3 : 1.6; c.globalAlpha = 0.9; if (L < 3) c.setLineDash([5, 4]); c.beginPath(); c.moveTo(CX[d.p] + 8, y); c.lineTo(Math.min(xe, CX[4]), y); c.stroke(); c.setLineDash([]); c.globalAlpha = 1; }
      if (L < 3 && pos > d.p) { const fade = seg(pos, d.p + 0.5, d.p + 1.2); const xe = L >= 2 ? CX[d.r[d.r.length - 1]] + 8 : CX[d.p] + 8; if (pos >= 4) { c.save(); c.globalAlpha = 1; T(c, "회수?", Math.max(xe + 12, CX[d.p] + 20), y + 4, 11, RED, 700); c.restore(); } }
      // 심기
      if (appear > 0) { const sc = E.outBack(appear); c.save(); c.translate(CX[d.p], y); c.scale(sc, sc); c.shadowColor = col; c.shadowBlur = 10; c.fillStyle = col; c.beginPath(); c.arc(0, 0, 7, 0, TAU); c.fill(); c.shadowBlur = 0; c.fillStyle = "rgba(255,255,255,.55)"; c.beginPath(); c.arc(-2, -2.4, 2.2, 0, TAU); c.fill(); c.restore(); }
      // 상기
      if (L >= 2) d.r.forEach((rc) => { const u = E.outBack(seg(pos, rc - 0.2, rc + 0.1)); if (u <= 0) return; c.save(); c.translate(CX[rc], y); c.scale(u, u); c.fillStyle = "#0b0e16"; c.beginPath(); c.arc(0, 0, 7, 0, TAU); c.fill(); c.strokeStyle = col; c.lineWidth = 2.4; c.beginPath(); c.arc(0, 0, 5.6, 0, TAU); c.stroke(); c.fillStyle = col; c.beginPath(); c.arc(0, 0, 2.2, 0, TAU); c.fill(); c.restore(); });
      // 회수
      if (L >= 3) { const u = E.outBack(seg(pos, d.k - 0.2, d.k + 0.15)); if (u > 0) { paid++; c.save(); c.translate(CX[d.k], y); c.scale(u, u); c.shadowColor = col; c.shadowBlur = 14; star(c, 0, 0, 11.5, 5); c.fillStyle = col; c.fill(); c.shadowBlur = 0; c.strokeStyle = "rgba(255,255,255,.9)"; c.lineWidth = 1.4; c.stroke(); c.restore(); } }
    });
    // 편 끝 훅
    if (HOOK && L >= 3) EPS.forEach((e, i) => { const u = E.outC(seg(pos, i + 0.1, i + 0.5)); if (u <= 0) return; const x = CX[i], y = 314 + (1 - u) * 6; c.save(); c.globalAlpha = u; rr(c, x - 44, y, 88, 22, 11); c.fillStyle = "rgba(255,138,61,.16)"; c.fill(); c.strokeStyle = "rgba(255,138,61,.7)"; c.lineWidth = 1; c.stroke(); T(c, i < 4 ? "다음 편 궁금" : "시즌 마무리", x - 4, y + 15, 11, "#ffd9b0", 700, "center"); c.fillStyle = ORG; c.beginPath(); c.moveTo(x + 28, y + 7); c.lineTo(x + 36, y + 11); c.lineTo(x + 28, y + 15); c.closePath(); c.fill(); c.restore(); });
    // 범례
    c.save(); c.globalAlpha = L >= 1 ? 1 : 0; const ly = 349;
    c.fillStyle = INK; c.beginPath(); c.arc(30, ly - 4, 5, 0, TAU); c.fill(); T(c, "심기", 40, ly, 11, SEC, 500);
    c.strokeStyle = INK; c.lineWidth = 2; c.beginPath(); c.arc(92, ly - 4, 4.6, 0, TAU); c.stroke(); c.fillStyle = INK; c.beginPath(); c.arc(92, ly - 4, 1.8, 0, TAU); c.fill(); T(c, "중간 상기", 102, ly, 11, SEC, 500);
    star(c, 178, ly - 4, 7.5, 3.4); c.fillStyle = INK; c.fill(); T(c, "회수", 190, ly, 11, SEC, 500);
    T(c, "가상 예시 시리즈 · 제목과 줄거리는 설명용입니다", 626, ly, 10, MUT, 500, "right"); c.restore();
    // 이름표
    const tag = L === 0 ? "연출 전 · 5편이 따로따로, 떡밥 없음" : L === 1 ? "떡밥 심기 · 회수 계획이 없다" : L === 2 ? "중간 상기 · 잊지 않게 슬쩍" : "회수 연결 + 편 끝 훅" + (HOOK ? "" : " 없음");
    pill(c, tag, L === 0 ? "#ffd9b0" : INK, 14, false);
    if (L >= 1) { const done = Math.min(seeds.length, paid); const txt = "심은 떡밥 " + Math.min(planted, seeds.length) + " · 회수 " + done; pill(c, txt, L >= 3 ? "#7fe0b0" : (pos >= 4 ? "#ffa3a3" : INK), 626, true); }
  },
};
export default demo;
