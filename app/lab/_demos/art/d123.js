/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/bullet-gantt/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng, canvas, rr } from "./helpers.js";

// 채널 운영의 이번 달 목표(불릿 그래프)와 영상 제작 일정(간트 차트)을 한 화면에 놓는다. 숫자는 모두 설명용 가상 데이터다. 화면은 시간 t 의 함수다.
const TARGET_SUBS = 1000;       // 구독자 목표(명). 불릿의 목표 눈금과 배경 3단이 이 값에 맞춰 바뀐다
const TODAY = 3.4;              // 간트의 ‘오늘’ 위치(주)
const WEEKS = 6;                // 일정 칸의 주 수(가로축 길이)

const TAU = Math.PI * 2;
const INK = "#f4efe4", SEC = "#c3c2b7", MUT = "#8b94a3", GRID = "rgba(255,255,255,.09)", AXIS = "rgba(255,255,255,.3)", ORG = "#ff8a3d", ORG_D = "#d95926", BLUE = "#3987e5", BLUE_L = "#86b6ef";
const SANS = '"IBM Plex Sans KR","Malgun Gothic",sans-serif', MONO = '"JetBrains Mono","Malgun Gothic",monospace';
const T = (c, s, x, y, z, col, w, al, f) => { c.save(); c.fillStyle = col; c.font = (w || 500) + " " + z + "px " + (f || SANS); c.textAlign = al || "left"; c.textBaseline = "alphabetic"; c.fillText(s, x, y); c.restore(); };
function grainTile(seed) { const g = document.createElement("canvas"); g.width = g.height = 96; const x = g.getContext("2d"), im = x.createImageData(96, 96), r = rng(seed); for (let i = 0; i < 96 * 96; i++) { const v = (r() * 255) | 0; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } x.putImageData(im, 0, 0); return g; }
function pill(c, s, col) { c.save(); c.font = "500 12px " + SANS; const w = c.measureText(s).width + 22; rr(c, 14, 12, w, 22, 11); c.fillStyle = "rgba(8,10,20,.78)"; c.fill(); c.strokeStyle = "rgba(255,255,255,.16)"; c.lineWidth = 1; c.stroke(); c.fillStyle = col || INK; c.textBaseline = "alphabetic"; c.fillText(s, 25, 27.5); c.restore(); }
const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const BANDS = ["#222b3f", "#303b57", "#42527a"];   // 어두울수록 부족, 밝을수록 좋음 (한 색 계열)
const BX0 = 118, BX1 = 520;
const TASKS = [["기획", 0, 1, 100, "1주차"], ["촬영", 1, 2, 100, "2~3주차"], ["편집", 2.5, 2, 70, "3~5주차"], ["검수", 4.5, 1, 0, "5~6주차"], ["업로드", 5.5, 0.5, 0, "6주차"]];   // 이름, 시작(주), 길이(주), 진행률(%), 글자 표기
const GX0 = 120, GX1 = 610, gw = (w) => GX0 + w / WEEKS * (GX1 - GX0);

const demo = {
  dur: 6.4, rest: 6.0, noCompare: false, levels: 3,
  mount(sp) { const c = canvas(sp); c.canvas.style.cssText = "width:640px;height:360px;display:block"; return { c, grain: grainTile(67) }; },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 목표는 불릿 그래프로, 2 = 일정을 간트 막대로, 3 = 오늘 선·진행률·지연·이어짐
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1;
    const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, "#0e1424"); g.addColorStop(1, "#080b13"); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
    c.save(); c.globalAlpha = 0.045; c.fillStyle = c.createPattern(s.grain, "repeat"); c.fillRect(0, 0, 640, 360); c.restore();
    const K = [
      { n: "구독자", act: 820, tg: TARGET_SUBS, mx: TARGET_SUBS * 1.25, e: [TARGET_SUBS * 0.6, TARGET_SUBS * 0.9], txt: fmt(820) + " / " + fmt(TARGET_SUBS) + "명" },
      { n: "월 조회수", act: 38, tg: 50, mx: 60, e: [25, 40], txt: "38 / 50만 회" },
      { n: "월 업로드", act: 7, tg: 8, mx: 10, e: [4, 7], txt: "7 / 8편" },
    ];
    T(c, L === 0 ? "이번 달 목표 (게이지)" : "이번 달 목표 달성도 (불릿 그래프)", 24, 58, 12, SEC, 700);
    if (L === 0) {   // 연출 전: 반원 게이지 3개
      K.forEach((k, i) => { const cx = 110 + i * 210, cy = 130, r = 46, u = E.outC(seg(t, 0.5 + i * 0.2, 1.4 + i * 0.2)), ratio = Math.min(1, k.act / k.tg) * u;
        c.lineCap = "round"; c.lineWidth = 12; c.strokeStyle = "#2a3447"; c.beginPath(); c.arc(cx, cy, r, Math.PI, TAU); c.stroke();
        c.strokeStyle = BLUE; c.beginPath(); c.arc(cx, cy, r, Math.PI, Math.PI + Math.PI * ratio); c.stroke(); c.lineCap = "butt";
        T(c, String(k.act), cx, cy - 6, 20, INK, 700, "center", MONO); T(c, k.n, cx, cy + 14, 12, SEC, 500, "center"); });
      T(c, "목표가 얼마인지, 어디부터 ‘좋음’인지 알 수 없고 자리를 많이 차지한다", 24, 168, 11.5, "#ffd9b0", 700);
    } else {
      K.forEach((k, i) => {
        const yc = 82 + i * 28, u = E.outC(seg(t, 0.5 + i * 0.2, 1.1 + i * 0.2)), xv = (v) => BX0 + v / k.mx * (BX1 - BX0);
        T(c, k.n, 24, yc + 4, 12.5, INK, 700);
        const edges = [0, k.e[0], k.e[1], k.mx];
        for (let b = 0; b < 3; b++) { const x0 = xv(edges[b]), x1 = xv(edges[b + 1]), w = (x1 - x0) * u; if (w > 0) { c.fillStyle = BANDS[b]; c.fillRect(x0, yc - 9, w, 18); } }
        const au = E.outC(seg(t, 1.1 + i * 0.2, 1.9 + i * 0.2)), aw = (xv(k.act) - BX0) * au;
        const bg = c.createLinearGradient(0, yc - 4, 0, yc + 4); bg.addColorStop(0, "#a6cbf5"); bg.addColorStop(1, "#5a9be6"); rr(c, BX0, yc - 4, Math.max(0, aw), 8, 2.5); c.fillStyle = bg; c.fill();
        const tu = E.outBack(seg(t, 1.8 + i * 0.2, 2.3 + i * 0.2)); if (tu > 0) { c.save(); c.translate(xv(k.tg), yc); c.scale(1, tu); c.fillStyle = INK; c.fillRect(-1.4, -9, 2.8, 18); c.restore(); }
        c.save(); c.globalAlpha = au; T(c, k.txt, 528, yc + 4, 11.5, SEC, 500, "left", MONO); c.restore();
      });
      c.save(); c.globalAlpha = E.outC(seg(t, 1.9, 2.5)); T(c, "막대 = 실제 · 흰 세로선 = 목표 · 배경 어두움 → 밝음 = 부족 → 좋음", 24, 164, 10.5, MUT, 500); c.restore();
    }
    // 아래: 일정
    T(c, L >= 2 ? "영상 제작 일정 (간트 차트, 주 단위)" : "영상 제작 일정", 24, 188, 12, SEC, 700);
    if (L < 2) {
      const q = E.outC(seg(t, 1.8, 2.6)); c.save(); c.globalAlpha = q;
      TASKS.forEach((k, i) => { const y = 214 + i * 19; T(c, k[0], 24, y, 12.5, INK, 700); T(c, k[4], 120, y, 12.5, SEC, 500); });
      T(c, "겹치는 기간과 지금 어디쯤인지 글자만으로는 한눈에 안 보인다", 300, 232, 11.5, "#ffd9b0", 700); c.restore();
    } else {
      const RY = (i) => 212 + i * 20;
      for (let w = 0; w <= WEEKS; w++) { c.strokeStyle = w ? GRID : AXIS; c.lineWidth = 1; c.beginPath(); c.moveTo(gw(w) + 0.5, 196); c.lineTo(gw(w) + 0.5, RY(4) + 17); c.stroke(); if (w < WEEKS) T(c, (w + 1) + "주", (gw(w) + gw(w + 1)) / 2, 205, 10, MUT, 500, "center", MONO); }
      const od = (k) => L >= 3 && (k[1] + k[2] <= TODAY) && k[3] < 100;
      TASKS.forEach((k, i) => {
        const y = RY(i), u = E.outC(seg(t, 2.4 + i * 0.22, 3.0 + i * 0.22)), x0 = gw(k[1]), w = (gw(k[1] + k[2]) - x0) * u;
        T(c, k[0], 24, y + 12, 12.5, INK, 700);
        if (w > 0) { rr(c, x0, y, w, 15, 4); c.fillStyle = "#334162"; c.fill(); }
        if (L >= 3) { const pu = E.outC(seg(t, 3.3 + i * 0.12, 4.1 + i * 0.12)), pw = (gw(k[1] + k[2]) - x0) * k[3] / 100 * pu; if (pw > 1) { const late = od(k); const pg = c.createLinearGradient(0, y, 0, y + 15); pg.addColorStop(0, late ? "#ff9a5c" : "#a6cbf5"); pg.addColorStop(1, late ? ORG_D : "#4f90df"); rr(c, x0, y, pw, 15, 4); c.fillStyle = pg; c.fill(); } }
        else if (w > 0) { rr(c, x0, y, w, 15, 4); const bg = c.createLinearGradient(0, y, 0, y + 15); bg.addColorStop(0, "#6aa7ee"); bg.addColorStop(1, "#3987e5"); c.fillStyle = bg; c.fill(); }
        if (L >= 3 && u >= 1) { const late = od(k); T(c, late ? "지연 " + k[3] + "%" : k[3] + "%", gw(k[1] + k[2]) + 6, y + 12, 11, late ? "#ffb27f" : SEC, 700, "left", MONO); }
        if (L >= 3 && i < 4) { const nx = TASKS[i + 1]; if (nx[1] >= k[1] + k[2] - 0.001) { const du = E.outC(seg(t, 5.0 + i * 0.1, 5.5 + i * 0.1)); if (du > 0) { const ex = gw(k[1] + k[2]), ny = RY(i + 1) + 7.5; c.save(); c.globalAlpha = du; c.strokeStyle = "rgba(195,194,183,.7)"; c.lineWidth = 1.2; c.beginPath(); c.moveTo(ex, y + 15); c.lineTo(ex, ny); c.lineTo(gw(nx[1]) - 2, ny); c.stroke(); c.fillStyle = "rgba(195,194,183,.85)"; c.beginPath(); c.moveTo(gw(nx[1]) - 1, ny); c.lineTo(gw(nx[1]) - 6, ny - 3); c.lineTo(gw(nx[1]) - 6, ny + 3); c.closePath(); c.fill(); c.restore(); } } }
      });
      if (L >= 3) { const tu = E.outC(seg(t, 4.2, 5.0)), tx = gw(lerp(0, TODAY, tu)); c.strokeStyle = INK; c.lineWidth = 1.5; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(tx, 196); c.lineTo(tx, RY(4) + 20); c.stroke(); c.setLineDash([]); rr(c, tx - 21, RY(4) + 19, 42, 15, 7); c.fillStyle = INK; c.fill(); T(c, "오늘", tx, RY(4) + 30, 10.5, "#0a0f1a", 700, "center"); }
    }
    const cap = L === 0 ? "연출 전 · 게이지와 글자 일정: 목표 눈금도 기간의 겹침도 안 보인다" : L === 1 ? "불릿: 막대 하나에 실제·목표·부족/보통/좋음 범위를 함께 담는다" : L === 2 ? "간트: 막대의 위치와 길이 = 일정의 시작과 기간" : "오늘 선 · 진행률 · 지연(주황) · 다음 작업으로 이어짐";
    T(c, cap, 320, 346, 12, L === 0 ? "#ffd9b0" : INK, 700, "center");
    T(c, "가상 예시 데이터입니다", 626, 27, 10.5, MUT, 500, "right");
    pill(c, L === 0 ? "연출 전 · 게이지 + 글자 일정" : L === 1 ? "불릿 · 실제 대 목표" : L === 2 ? "간트 · 기간을 막대로" : "간트 · 오늘 선과 지연", L === 0 ? "#ffd9b0" : INK);
  },
};
export default demo;
