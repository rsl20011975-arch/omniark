/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/area-treemap/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng, canvas, rr } from "./helpers.js";

// 같은 숫자를 두 가지로 본다: 영역 차트(시간에 따른 합계의 변화)와 트리맵(한 시점의 구성을 넓이로). 숫자는 모두 설명용 가상 데이터다. 화면은 시간 t 의 함수다.
const Y_MIN = 0;                // 영역 차트 세로축이 시작하는 값(만 회). 0 이 정직하다
const SHOW_CHILD = 1;           // 1 이면 트리맵에 세부 칸(2단계)까지, 0 이면 출처 3칸(1단계)만
const Y_MAX = 200;

const TAU = Math.PI * 2;
const INK = "#f4efe4", SEC = "#c3c2b7", MUT = "#8b94a3", GRID = "rgba(255,255,255,.09)", AXIS = "rgba(255,255,255,.3)", SURF = "#0b0e16";
const BLUE_L = "#86b6ef", ORG = "#ff8a3d";
const SANS = '"IBM Plex Sans KR","Malgun Gothic",sans-serif', MONO = '"JetBrains Mono","Malgun Gothic",monospace';
const T = (c, s, x, y, z, col, w, al, f) => { c.save(); c.fillStyle = col; c.font = (w || 500) + " " + z + "px " + (f || SANS); c.textAlign = al || "left"; c.textBaseline = "alphabetic"; c.fillText(s, x, y); c.restore(); };
function grainTile(seed) { const g = document.createElement("canvas"); g.width = g.height = 96; const x = g.getContext("2d"), im = x.createImageData(96, 96), r = rng(seed); for (let i = 0; i < 96 * 96; i++) { const v = (r() * 255) | 0; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } x.putImageData(im, 0, 0); return g; }
function pill(c, s, col) { c.save(); c.font = "500 12px " + SANS; const w = c.measureText(s).width + 22; rr(c, 14, 12, w, 22, 11); c.fillStyle = "rgba(8,10,20,.78)"; c.fill(); c.strokeStyle = "rgba(255,255,255,.16)"; c.lineWidth = 1; c.stroke(); c.fillStyle = col || INK; c.textBaseline = "alphabetic"; c.fillText(s, 25, 27.5); c.restore(); }
function squarify(vals, x, y, w, h) {
  const tot = vals.reduce((p, q) => p + q, 0), k = w * h / tot, a = vals.map((v) => v * k), out = []; let i = 0;
  const worst = (r, s) => { const sum = r.reduce((p, q) => p + q, 0), mx = Math.max(...r), mn = Math.min(...r); return Math.max(s * s * mx / (sum * sum), sum * sum / (s * s * mn)); };
  while (i < a.length) {
    const short = Math.min(w, h), horiz = w >= h; let row = [a[i]], j = i + 1;
    while (j < a.length && worst(row.concat(a[j]), short) <= worst(row, short)) { row.push(a[j]); j++; }
    const sum = row.reduce((p, q) => p + q, 0), th = sum / short; let off = 0;
    row.forEach((v) => { const len = v / th; out.push(horiz ? [x, y + off, th, len] : [x + off, y, len, th]); off += len; });
    if (horiz) { x += th; w -= th; } else { y += th; h -= th; }
    i = j;
  }
  return out;
}
const MONTHS = 12;
const SER = [   // 아래부터 쌓는 순서. 값은 월별 조회수(만 회, 가상)
  { n: "구독", col: "#199e70", v: [20, 21, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], kids: [["구독 피드", 22], ["커뮤니티", 8]] },
  { n: "검색", col: "#3987e5", v: [30, 32, 35, 38, 40, 42, 45, 48, 52, 55, 58, 62], kids: [["영상 검색", 34], ["블로그·웹", 18], ["이미지", 10]] },
  { n: "추천", col: "#d95926", v: [10, 12, 15, 20, 26, 30, 38, 46, 55, 66, 78, 90], kids: [["홈 화면", 46], ["다음 영상", 30], ["알림", 14]] },
];
const AX0 = 44, AX1 = 258, YT = 98, YB = 270;
const TX0 = 336, TX1 = 622, TY0 = 98, TY1 = 270;
const gx = (m) => AX0 + m / (MONTHS - 1) * (AX1 - AX0), gy = (v) => YB - (v - Y_MIN) / (Y_MAX - Y_MIN) * (YB - YT);

const demo = {
  dur: 6.6, rest: 6.2, noCompare: false, levels: 3,
  mount(sp) {
    const c = canvas(sp); c.canvas.style.cssText = "width:640px;height:360px;display:block";
    const groups = SER.slice().sort((p, q) => q.v[11] - p.v[11]);
    const rects = squarify(groups.map((g) => g.v[11]), TX0, TY0, TX1 - TX0, TY1 - TY0);
    const tiles = groups.map((g, gi) => { const [x, y, w, h] = rects[gi], kids = g.kids.slice().sort((p, q) => q[1] - p[1]); const kr = squarify(kids.map((k) => k[1]), x + 2, y + 17, w - 4, h - 19); return { g, rect: [x, y, w, h], kids: kids.map((k, i) => ({ n: k[0], v: k[1], r: kr[i] })) }; });
    return { c, grain: grainTile(41), tiles };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 합계를 한 덩어리 영역으로, 2 = 출처별로 쌓고 이름 붙이기, 3 = 12월 구성을 트리맵으로
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1;
    const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, "#0e1424"); g.addColorStop(1, "#080b13"); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
    c.save(); c.globalAlpha = 0.045; c.fillStyle = c.createPattern(s.grain, "repeat"); c.fillRect(0, 0, 640, 360); c.restore();
    // 왼쪽: 축
    T(c, "월별 조회수 (만 회)", AX0, 80, 12, SEC, 700);
    const ticks = [Y_MIN, (Y_MIN + Y_MAX) / 2, Y_MAX];
    ticks.forEach((v, i) => { c.strokeStyle = i ? GRID : AXIS; c.lineWidth = 1; c.beginPath(); c.moveTo(AX0, gy(v) + 0.5); c.lineTo(AX1, gy(v) + 0.5); c.stroke(); T(c, String(v), AX0 - 6, gy(v) + 3.5, 10, MUT, 500, "right", MONO); });
    [0, 3, 6, 9, 11].forEach((m) => T(c, (m + 1) + "월", gx(m), YB + 15, 10, MUT, 500, "center", MONO));
    const ph = E.inOutC(seg(t, 0.5, 2.6)), wx = AX0 + ph * (AX1 - AX0);
    c.save(); c.beginPath(); c.rect(AX0 - 1, YT - 2, wx - AX0 + 1, YB - YT + 2); c.clip();
    const cum = [], base = Array(MONTHS).fill(0);
    SER.forEach((sr) => { const top = sr.v.map((v, m) => base[m] + v); cum.push({ sr, lo: base.slice(), hi: top }); top.forEach((v, m) => { base[m] = v; }); });
    const line = (arr, col, w) => { c.beginPath(); arr.forEach((v, m) => (m ? c.lineTo(gx(m), gy(v)) : c.moveTo(gx(m), gy(v)))); c.strokeStyle = col; c.lineWidth = w; c.lineJoin = "round"; c.stroke(); };
    if (L === 0) { SER.forEach((sr) => line(sr.v, sr.col, 2.4)); }
    else if (L === 1) { const tot = base; const fg = c.createLinearGradient(0, YT, 0, YB); fg.addColorStop(0, "rgba(134,182,239,.75)"); fg.addColorStop(1, "rgba(57,135,229,.2)"); c.beginPath(); c.moveTo(gx(0), gy(Y_MIN)); tot.forEach((v, m) => c.lineTo(gx(m), gy(v))); c.lineTo(gx(MONTHS - 1), gy(Y_MIN)); c.closePath(); c.fillStyle = fg; c.fill(); line(tot, BLUE_L, 2.2); }
    else { cum.forEach(({ sr, lo, hi }) => { const fg = c.createLinearGradient(0, YT, 0, YB); fg.addColorStop(0, sr.col); fg.addColorStop(1, sr.col + "cc"); c.beginPath(); hi.forEach((v, m) => (m ? c.lineTo(gx(m), gy(v)) : c.moveTo(gx(m), gy(v)))); for (let m = MONTHS - 1; m >= 0; m--) c.lineTo(gx(m), gy(lo[m])); c.closePath(); c.fillStyle = fg; c.fill(); line(hi, SURF, 2); }); }
    c.restore();
    // 직접 라벨
    const q = E.outC(seg(t, 2.5, 3));
    if (q > 0) { c.save(); c.globalAlpha = q;
      if (L === 0) SER.forEach((sr) => { const y = gy(sr.v[11]); c.fillStyle = sr.col; c.beginPath(); c.arc(AX1 + 9, y - 3.5, 3.5, 0, TAU); c.fill(); T(c, sr.n + " " + sr.v[11], AX1 + 16, y, 11, SEC, 500); });
      else if (L === 1) { const y = gy(base[11]); T(c, "합계", AX1 + 8, y + 4, 11, SEC, 700); T(c, String(base[11]), AX1 + 8, y + 17, 11, INK, 700, "left", MONO); }
      else cum.forEach(({ sr, lo, hi }, i) => { const cut = hi[11] <= Y_MIN, y = cut ? YB - 4 - i * 13 : gy((lo[11] + hi[11]) / 2); c.fillStyle = sr.col; c.beginPath(); c.arc(AX1 + 9, y - 3.5, 3.5, 0, TAU); c.fill(); T(c, sr.n + " " + sr.v[11] + (cut ? " · 잘림" : ""), AX1 + 16, y, 11, cut ? "#ffa3a3" : SEC, 500); });
      c.restore(); }
    // 오른쪽
    if (L < 3) {
      T(c, "12월 숫자표 (만 회)", TX0, 80, 12, SEC, 700);
      const tq = E.outC(seg(t, 2.8, 3.6)); c.save(); c.globalAlpha = tq;
      const rows = [["추천", 90, "홈 화면 46 · 다음 영상 30 · 알림 14"], ["검색", 62, "영상 검색 34 · 블로그·웹 18 · 이미지 10"], ["구독", 30, "구독 피드 22 · 커뮤니티 8"]];
      rows.forEach(([n, v, d], i) => { const y = 116 + i * 52; T(c, n + "  " + v, TX0, y, 15, INK, 700); T(c, d, TX0, y + 20, 11.5, SEC, 500); c.strokeStyle = GRID; c.beginPath(); c.moveTo(TX0, y + 32.5); c.lineTo(TX1, y + 32.5); c.stroke(); });
      T(c, "어느 칸이 가장 큰지 숫자를 읽어야 안다", TX0, 282, 12, "#ffd9b0", 700); c.restore();
    } else {
      T(c, "12월 구성 (칸의 넓이 = 조회수)", TX0, 80, 12, SEC, 700);
      s.tiles.forEach((tl, gi) => {
        const u = E.outBack(seg(t, 3.0 + gi * 0.3, 3.6 + gi * 0.3)), [x, y, w, h] = tl.rect; if (u <= 0) return;
        c.save(); c.translate(x + w / 2, y + h / 2); c.scale(Math.min(1, u), Math.min(1, u)); c.translate(-(x + w / 2), -(y + h / 2)); c.globalAlpha = Math.min(1, u * 1.5);
        const gg = c.createLinearGradient(0, y, 0, y + h); gg.addColorStop(0, tl.g.col); gg.addColorStop(1, tl.g.col + "d9");
        rr(c, x + 1, y + 1, w - 2, h - 2, 7); c.fillStyle = SHOW_CHILD ? tl.g.col + "40" : gg; c.fill(); c.strokeStyle = SHOW_CHILD ? tl.g.col : "rgba(255,255,255,.22)"; c.lineWidth = SHOW_CHILD ? 1.6 : 1; c.stroke();
        if (!SHOW_CHILD) { c.fillStyle = "rgba(255,255,255,.22)"; c.fillRect(x + 6, y + 2, w - 12, 1); T(c, tl.g.n, x + 12, y + 28, 18, "#07101f", 700); T(c, tl.g.v[11] + "만 회 · " + Math.round(tl.g.v[11] / 182 * 100) + "%", x + 12, y + 46, 12, "#07101f", 700); }
        else { T(c, tl.g.n + " " + tl.g.v[11], x + 7, y + 13, 11.5, INK, 700); }
        c.restore();
        if (SHOW_CHILD) tl.kids.forEach((k, ki) => {
          const ku = E.outBack(seg(t, 3.9 + gi * 0.2 + ki * 0.12, 4.4 + gi * 0.2 + ki * 0.12)); if (ku <= 0) return; const [kx, ky, kw, kh] = k.r;
          c.save(); c.translate(kx + kw / 2, ky + kh / 2); c.scale(Math.min(1, ku), Math.min(1, ku)); c.translate(-(kx + kw / 2), -(ky + kh / 2)); c.globalAlpha = Math.min(1, ku * 1.5);
          const kg = c.createLinearGradient(0, ky, 0, ky + kh); kg.addColorStop(0, tl.g.col); kg.addColorStop(1, tl.g.col + "d0"); rr(c, kx + 1, ky + 1, kw - 2, kh - 2, 4); c.fillStyle = kg; c.fill();
          c.fillStyle = "rgba(255,255,255,.22)"; c.fillRect(kx + 4, ky + 1.5, kw - 8, 1);
          if (kw > 46 && kh > 28) { T(c, k.n, kx + 7, ky + 17, 11.5, "#07101f", 700); T(c, String(k.v), kx + 7, ky + 31, 11, "#07101f", 700, "left", MONO); }
          c.restore(); });
      });
    }
    const cap = L === 0 ? "연출 전 · 선 3개와 숫자표: 합계도 구성도 머릿속으로 더해야 한다" : L === 1 ? "영역: 선 아래를 채워 합계가 커지는 모양을 보여 준다 (세로축 " + Y_MIN + "부터)" : L === 2 ? "쌓인 영역: 위 경계 = 합계, 띠의 두께 = 출처별 조회수" : "트리맵: 칸이 클수록 조회수가 크다 · 큰 칸 순서로 배치";
    T(c, cap, 320, 318, 12, L === 0 ? "#ffd9b0" : INK, 700, "center");
    T(c, "가상 예시 데이터입니다", 320, 346, 10, MUT, 500, "center");
    pill(c, L === 0 ? "연출 전 · 선 3개 + 숫자표" : L === 1 ? "영역 · 합계 한 덩어리" : L === 2 ? "영역 · 출처별로 쌓기" : "트리맵 · 12월 구성을 넓이로", L === 0 ? "#ffd9b0" : INK);
  },
};
export default demo;
