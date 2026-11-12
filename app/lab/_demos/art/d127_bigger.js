/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/screen-record-zoom/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng, canvas, rr } from "./helpers.js";

// 앱 화면을 녹화한 영상에 ‘자동 줌·팬’을 더한다: 커서가 클릭할 곳으로 확대해 들어가고, 커서를 따라 화면이 이동하고, 끝나면 전체로 물러난다. 앱 화면은 설명용으로 그린 가짜 화면이다. 화면은 시간 t 의 함수다.
const ZOOM = 3.2;               // 확대 배율
const LEAD = 0.3;               // 클릭하기 몇 초 전에 확대를 끝내 두는가(초)

const TAU = Math.PI * 2;
const INK = "#f4efe4", SEC = "#c3c2b7", MUT = "#8b94a3", ORG = "#ff8a3d", BLUE = "#3987e5", BLUE_L = "#86b6ef", AQUA = "#199e70";
const SANS = '"IBM Plex Sans KR","Malgun Gothic",sans-serif', MONO = '"JetBrains Mono","Malgun Gothic",monospace';
const T = (c, s, x, y, z, col, w, al, f) => { c.save(); c.fillStyle = col; c.font = (w || 500) + " " + z + "px " + (f || SANS); c.textAlign = al || "left"; c.textBaseline = "alphabetic"; c.fillText(s, x, y); c.restore(); };
function grainTile(seed) { const g = document.createElement("canvas"); g.width = g.height = 96; const x = g.getContext("2d"), im = x.createImageData(96, 96), r = rng(seed); for (let i = 0; i < 96 * 96; i++) { const v = (r() * 255) | 0; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } x.putImageData(im, 0, 0); return g; }
function pill(c, s, col) { c.save(); c.font = "500 12px " + SANS; const w = c.measureText(s).width + 22; rr(c, 14, 12, w, 22, 11); c.fillStyle = "rgba(8,10,20,.82)"; c.fill(); c.strokeStyle = "rgba(255,255,255,.18)"; c.lineWidth = 1; c.stroke(); c.fillStyle = col || INK; c.textBaseline = "alphabetic"; c.fillText(s, 25, 27.5); c.restore(); }
const TC = [2.0, 4.2, 6.0];                                          // 클릭하는 시각
const WP = [[0.4, 150, 300], [0.8, 150, 300], [1.8, 516, 49], [3.0, 516, 49], [3.9, 586, 122], [4.8, 586, 122], [5.7, 532, 273]];   // 커서 경로(도착 시각, x, y)
function cursor(t) {
  if (t <= WP[0][0]) return [WP[0][1], WP[0][2]];
  for (let i = 0; i < WP.length - 1; i++) if (t <= WP[i + 1][0]) { const u = E.inOutC(seg(t, WP[i][0], WP[i + 1][0])); return [lerp(WP[i][1], WP[i + 1][1], u), lerp(WP[i][2], WP[i + 1][2], u)]; }
  return [WP[WP.length - 1][1], WP[WP.length - 1][2]];
}
function zoomEnv(t, L) {
  if (L < 2) return 0; const R = 0.7, Fo = 0.7;
  if (L === 2) { let e = 0; TC.forEach((tc) => { const up = E.inOutC(seg(t, tc - LEAD - R, tc - LEAD)), dn = E.inOutC(seg(t, tc + 0.5, tc + 0.5 + Fo)); e = Math.max(e, up * (1 - dn)); }); return e; }
  return E.inOutC(seg(t, TC[0] - LEAD - R, TC[0] - LEAD)) * (1 - E.inOutC(seg(t, TC[2] + 0.9, TC[2] + 1.8)));
}
const DA = [38, 42, 40, 47, 52, 50, 58, 61, 57, 66, 72, 78], DB = [58, 66, 62, 74, 82, 76, 90, 96, 90, 104, 110, 118];

function ui(c, t) {
  c.fillStyle = "#121827"; c.fillRect(0, 0, 640, 360);
  c.fillStyle = "#0d1220"; c.fillRect(0, 0, 640, 24); [["#e66767", 12], ["#d9a13a", 26], ["#3fb27f", 40]].forEach(([col, x]) => { c.fillStyle = col; c.beginPath(); c.arc(x, 12, 4, 0, TAU); c.fill(); });
  T(c, "채널 스튜디오 · 통계", 320, 15.5, 10.5, MUT, 500, "center");
  c.fillStyle = "#0f1424"; c.fillRect(0, 24, 96, 336); c.fillStyle = "rgba(255,255,255,.06)"; c.fillRect(96, 24, 1, 336);
  ["대시보드", "영상", "통계", "댓글", "설정"].forEach((n, i) => { const y = 52 + i * 30, on = i === 2; if (on) { rr(c, 8, y - 14, 80, 24, 6); c.fillStyle = "rgba(57,135,229,.22)"; c.fill(); } c.strokeStyle = on ? BLUE_L : MUT; c.lineWidth = 1.3; rr(c, 16, y - 8, 11, 11, 3); c.stroke(); T(c, n, 36, y + 1, 11, on ? INK : SEC, on ? 700 : 500); });
  T(c, "채널 통계", 112, 56, 16, INK, 700);
  // 기간 드롭다운(첫 번째 클릭 대상)
  const c1 = t >= TC[0] + 0.05; rr(c, 468, 36, 100, 26, 7); c.fillStyle = "#222c45"; c.fill(); c.strokeStyle = t >= TC[0] && t < TC[0] + 0.3 ? ORG : "rgba(255,255,255,.18)"; c.lineWidth = 1.2; c.stroke();
  T(c, c1 ? "최근 7일" : "최근 28일", 480, 53, 11.5, INK, 500); c.fillStyle = SEC; c.beginPath(); c.moveTo(551, 47); c.lineTo(559, 47); c.lineTo(555, 52); c.closePath(); c.fill();
  // 숫자 카드
  [["조회수", "12.4만", "+8%"], ["시청 시간", "3,280시간", "+5%"], ["구독자", "+820", "+12%"]].forEach(([n, v, d], i) => { const x = 112 + i * 108; rr(c, x, 76, 100, 54, 8); c.fillStyle = "#1a2236"; c.fill(); c.strokeStyle = "rgba(255,255,255,.08)"; c.lineWidth = 1; c.stroke(); T(c, n, x + 10, 94, 10.5, MUT, 500); T(c, v, x + 10, 114, 15, INK, 700); T(c, d, x + 90, 124, 10, "#7fe0b0", 700, "right", MONO); });
  // 차트
  rr(c, 112, 142, 316, 160, 8); c.fillStyle = "#1a2236"; c.fill(); c.strokeStyle = "rgba(255,255,255,.08)"; c.stroke(); T(c, "일별 조회수", 124, 162, 11.5, SEC, 700); T(c, c1 ? "최근 7일" : "최근 28일", 416, 162, 10.5, MUT, 500, "right");
  const m = E.outC(seg(t, TC[0] + 0.05, TC[0] + 0.7)), D = DA.map((v, i) => lerp(v, DB[i], m));
  [0, 1, 2].forEach((i) => { const y = 180 + i * 38; c.strokeStyle = "rgba(255,255,255,.07)"; c.beginPath(); c.moveTo(124, y + 0.5); c.lineTo(416, y + 0.5); c.stroke(); });
  const px = (i) => 130 + i * 25.4, py = (v) => 288 - v * 1.0;
  const fg = c.createLinearGradient(0, 180, 0, 288); fg.addColorStop(0, "rgba(57,135,229,.4)"); fg.addColorStop(1, "rgba(57,135,229,0)"); c.beginPath(); c.moveTo(px(0), 288); D.forEach((v, i) => c.lineTo(px(i), py(v))); c.lineTo(px(11), 288); c.closePath(); c.fillStyle = fg; c.fill();
  c.beginPath(); D.forEach((v, i) => (i ? c.lineTo(px(i), py(v)) : c.moveTo(px(i), py(v)))); c.strokeStyle = BLUE_L; c.lineWidth = 2; c.lineJoin = "round"; c.stroke();
  // 설정 패널
  rr(c, 440, 76, 184, 224, 8); c.fillStyle = "#1a2236"; c.fill(); c.strokeStyle = "rgba(255,255,255,.08)"; c.stroke(); T(c, "내보내기 설정", 454, 98, 12, INK, 700);
  T(c, "자동 자막 포함", 454, 126, 11.5, SEC, 500); const tp = E.outBack(seg(t, TC[1], TC[1] + 0.3)), tq = Math.min(1, Math.max(0, tp));
  rr(c, 568, 113, 38, 18, 9); c.fillStyle = tq > 0.5 ? AQUA : "#3a4560"; c.fill(); c.fillStyle = "#f4efe4"; c.beginPath(); c.arc(lerp(577, 597, tp), 122, 6.5, 0, TAU); c.fill();
  c.strokeStyle = "rgba(255,255,255,.07)"; [140, 176, 212].forEach((y) => { c.beginPath(); c.moveTo(454, y + 0.5); c.lineTo(610, y + 0.5); c.stroke(); });
  T(c, "해상도", 454, 162, 11.5, SEC, 500); T(c, "1080p", 610, 162, 11.5, INK, 700, "right", MONO); T(c, "형식", 454, 198, 11.5, SEC, 500); T(c, "MP4", 610, 198, 11.5, INK, 700, "right", MONO); T(c, "저장 위치", 454, 234, 11.5, SEC, 500); T(c, "내 폴더", 610, 234, 11.5, INK, 700, "right");
  const pr = seg(t, TC[2], TC[2] + 0.15) * (1 - seg(t, TC[2] + 0.15, TC[2] + 0.35)), sc = 1 - 0.05 * pr; c.save(); c.translate(532, 273); c.scale(sc, sc);
  const bg = c.createLinearGradient(0, -15, 0, 15); bg.addColorStop(0, "#ffa564"); bg.addColorStop(1, "#e86a32"); rr(c, -78, -15, 156, 30, 8); c.fillStyle = bg; c.fill(); c.fillStyle = "rgba(255,255,255,.3)"; c.fillRect(-70, -14, 140, 1); T(c, t >= TC[2] + 0.1 ? "내보내는 중…" : "내보내기", 0, 4.5, 12.5, "#2a1208", 700, "center"); c.restore();
  const tu = E.outBack(seg(t, TC[2] + 0.25, TC[2] + 0.65)); if (tu > 0) { c.save(); c.globalAlpha = Math.min(1, tu * 2); const ox = (1 - Math.min(1, tu)) * 40; rr(c, 400 + ox, 318, 224, 30, 8); c.fillStyle = "#223048"; c.fill(); c.strokeStyle = AQUA; c.lineWidth = 1.2; c.stroke(); c.fillStyle = AQUA; c.beginPath(); c.arc(416 + ox, 333, 4.5, 0, TAU); c.fill(); T(c, "내보내기를 시작했어요 (1080p · MP4)", 428 + ox, 337, 11, INK, 500); c.restore(); }
}

const demo = {
  dur: 8.4, rest: 8.0, noCompare: false, levels: 3,
  mount(sp) { const c = canvas(sp); c.canvas.style.cssText = "width:640px;height:360px;display:block"; return { c, grain: grainTile(83) }; },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 원본 그대로(확대 없음), 2 = 클릭마다 확대했다가 물러남, 3 = 확대를 유지한 채 커서를 따라 이동 + 가장자리 어둡게
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1;
    const env = zoomEnv(t, L), Z = 1 + (ZOOM - 1) * env, cu = cursor(t), fp = cursor(t - 0.12);
    const fx = Math.min(640 - 320 / Z, Math.max(320 / Z, fp[0])), fy = Math.min(360 - 180 / Z, Math.max(180 / Z, fp[1])), vx = lerp(320, fx, env), vy = lerp(180, fy, env);
    c.save(); c.translate(320, 180); c.scale(Z, Z); c.translate(-vx, -vy);
    ui(c, t);
    // 클릭 물결
    TC.forEach((tc, i) => { const q = E.outExpo(seg(t, tc, tc + 0.55)), p = WP[[2, 4, 6][i]]; if (q > 0 && q < 1) { c.strokeStyle = "rgba(255,138,61," + (0.9 * (1 - q)).toFixed(2) + ")"; c.lineWidth = 2.2; c.beginPath(); c.arc(p[1], p[2], 4 + 24 * q, 0, TAU); c.stroke(); c.fillStyle = "rgba(255,138,61," + (0.25 * (1 - q)).toFixed(2) + ")"; c.fill(); } });
    // 커서
    const ca = Math.min(1, seg(t, 0.35, 0.7)), dn = TC.some((tc) => t >= tc && t < tc + 0.12) ? 0.9 : 1; c.save(); c.globalAlpha = ca; c.translate(cu[0], cu[1]); c.scale(dn, dn); c.shadowColor = "rgba(0,0,0,.5)"; c.shadowBlur = 4; c.shadowOffsetY = 1.5;
    c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 15); c.lineTo(3.8, 11.5); c.lineTo(6.6, 17.2); c.lineTo(9, 16); c.lineTo(6.3, 10.6); c.lineTo(11, 10.4); c.closePath(); c.fillStyle = "#fff"; c.fill(); c.shadowColor = "transparent"; c.strokeStyle = "#0b0e16"; c.lineWidth = 1.2; c.lineJoin = "round"; c.stroke(); c.restore();
    c.restore();
    // 줌 중 가장자리 어둡게(3단계)
    if (L >= 3) { const vg = c.createRadialGradient(320, 180, 120, 320, 180, 400); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0," + (0.5 * env).toFixed(2) + ")"); c.fillStyle = vg; c.fillRect(0, 0, 640, 360); }
    c.save(); c.globalAlpha = 0.04; c.fillStyle = c.createPattern(s.grain, "repeat"); c.fillRect(0, 0, 640, 360); c.restore();
    // 화면 배율과 ‘지금 보이는 영역’ 작은 지도
    if (L >= 2) { rr(c, 14, 286, 102, 64, 8); c.fillStyle = "rgba(8,10,20,.82)"; c.fill(); c.strokeStyle = "rgba(255,255,255,.18)"; c.lineWidth = 1; c.stroke(); T(c, "보이는 영역", 22, 301, 10.5, SEC, 700); T(c, "×" + Z.toFixed(1), 108, 301, 11, env > 0.02 ? "#ffb27f" : INK, 700, "right", MONO);
      const mx = 22, my = 307, mw = 86, mh = 36; c.fillStyle = "rgba(255,255,255,.1)"; c.fillRect(mx, my, mw, mh); c.strokeStyle = "rgba(255,255,255,.3)"; c.strokeRect(mx + 0.5, my + 0.5, mw, mh);
      c.strokeStyle = ORG; c.lineWidth = 1.6; c.strokeRect(mx + (vx - 320 / Z) / 640 * mw, my + (vy - 180 / Z) / 360 * mh, mw / Z, mh / Z); }
    const tag = L === 0 ? "연출 전 · 녹화 원본 그대로: 글씨가 작아 클릭 위치를 놓치기 쉽다" : L === 1 ? "원본 그대로 · 확대 없음" : L === 2 ? "자동 줌 · 클릭마다 확대했다가 물러남" : "자동 줌·팬 · 확대를 유지한 채 커서를 따라 이동";
    pill(c, tag, L === 0 ? "#ffd9b0" : INK);
    T(c, "가짜 앱 화면입니다 (설명용)", 626, 350, 10, "rgba(255,255,255,.6)", 500, "right");
  },
};
export default demo;
