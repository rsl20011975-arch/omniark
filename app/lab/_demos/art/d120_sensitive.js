/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/retention-drop/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng, canvas, rr } from "./helpers.js";

// 60초 영상의 ‘시청 유지율’ 곡선에서 시청자가 빠져나가는 구간을 찾는 장면. 숫자는 모두 설명용으로 만든 가상 데이터다. 화면은 시간 t 의 함수다.
const DIP = 3;                  // 3초 사이에 이만큼(%p) 이상 줄면 ‘이탈 구간’으로 표시한다
const CMP = 1;                  // 1 이면 비슷한 길이 영상의 평균 곡선과 겹쳐 비교한다
const SPIKE = 4;                // 2초 사이에 이만큼(%p) 이상 오르면 ‘다시 본 구간’으로 표시한다
const LEN = 60;

const TAU = Math.PI * 2;
const INK = "#f4efe4", SEC = "#c3c2b7", MUT = "#8b94a3", GRID = "rgba(255,255,255,.09)", AXIS = "rgba(255,255,255,.3)";
const BLUE = "#3987e5", BLUE_L = "#86b6ef", ORG = "#ff8a3d", AQUA = "#199e70";
const SANS = '"IBM Plex Sans KR","Malgun Gothic",sans-serif', HAN = '"Black Han Sans","Malgun Gothic",sans-serif', MONO = '"JetBrains Mono","Malgun Gothic",monospace';
const T = (c, s, x, y, z, col, w, al, f) => { c.save(); c.fillStyle = col; c.font = (w || 500) + " " + z + "px " + (f || SANS); c.textAlign = al || "left"; c.textBaseline = "alphabetic"; c.fillText(s, x, y); c.restore(); };
function grainTile(seed) { const g = document.createElement("canvas"); g.width = g.height = 96; const x = g.getContext("2d"), im = x.createImageData(96, 96), r = rng(seed); for (let i = 0; i < 96 * 96; i++) { const v = (r() * 255) | 0; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } x.putImageData(im, 0, 0); return g; }
function pill(c, s, col) { c.save(); c.font = "500 12px " + SANS; const w = c.measureText(s).width + 22; rr(c, 14, 12, w, 22, 11); c.fillStyle = "rgba(8,10,20,.78)"; c.fill(); c.strokeStyle = "rgba(255,255,255,.16)"; c.lineWidth = 1; c.stroke(); c.fillStyle = col || INK; c.textBaseline = "alphabetic"; c.fillText(s, 25, 27.5); c.restore(); }
const interp = (K, x) => { for (let i = 0; i < K.length - 1; i++) if (x <= K[i + 1][0]) return lerp(K[i][1], K[i + 1][1], (x - K[i][0]) / (K[i + 1][0] - K[i][0])); return K[K.length - 1][1]; };
const KF = [[0, 100], [3, 83], [6, 73], [12, 66], [18, 64], [22, 50], [26, 48], [30, 45], [34, 44], [36, 51], [40, 47], [44, 45], [48, 39], [52, 38], [56, 34], [60, 31]];
const TY = [[0, 100], [3, 86], [6, 76], [12, 68], [22, 60], [36, 53], [48, 46], [60, 40]];   // 비슷한 길이 영상의 평균(가상)
const X0 = 62, X1 = 598, YT = 98, YB = 292;
const gx = (s) => X0 + s / LEN * (X1 - X0), gy = (v) => YB - v / 100 * (YB - YT);

const demo = {
  dur: 6, rest: 5.6, noCompare: false, levels: 3,
  mount(sp) {
    const c = canvas(sp); c.canvas.style.cssText = "width:640px;height:360px;display:block";
    const r = rng(3), ret = [], typ = [];
    for (let i = 0; i <= LEN; i++) { ret.push(Math.min(100, interp(KF, i) + (i > 0 && i < LEN ? (r() - 0.5) * 1.2 : 0))); typ.push(interp(TY, i)); }
    const mean = ret.reduce((p, q) => p + q, 0) / ret.length;
    // 이탈 구간(3초 사이 DIP 이상 감소)을 묶는다
    const dips = []; let cur = null;
    for (let i = 0; i < LEN - 2; i++) { const d = ret[i] - ret[i + 3]; if (d >= DIP) { if (cur && i <= cur.e) cur.e = i + 3; else { cur = { s: i, e: i + 3 }; dips.push(cur); } } }
    dips.forEach((d) => { d.drop = ret[d.s] - ret[d.e]; });
    const spikes = []; let cs = null;
    for (let i = 0; i < LEN - 1; i++) { const d = ret[i + 2] - ret[i]; if (d >= SPIKE) { if (cs && i <= cs.e) cs.e = i + 2; else { cs = { s: i, e: i + 2 }; spikes.push(cs); } } }
    const big = dips.slice().sort((p, q) => q.drop - p.drop).slice(0, 2);
    return { c, grain: grainTile(31), ret, typ, mean, dips, spikes, big };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 곡선만, 2 = + 이탈·다시 본 구간 표시, 3 = + 비슷한 영상과 비교해 고칠 곳 찍기
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1;
    const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, "#0e1424"); g.addColorStop(1, "#080b13"); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
    c.save(); c.globalAlpha = 0.045; c.fillStyle = c.createPattern(s.grain, "repeat"); c.fillRect(0, 0, 640, 360); c.restore();
    if (L === 0) {
      const u = E.outC(seg(t, 0.4, 1.2)), m = Math.round(s.mean);
      c.save(); c.globalAlpha = u; rr(c, 150, 70, 340, 200, 18); const cg = c.createLinearGradient(0, 70, 0, 270); cg.addColorStop(0, "#2b3550"); cg.addColorStop(1, "#1b2238"); c.fillStyle = cg; c.fill(); c.strokeStyle = "rgba(255,255,255,.16)"; c.stroke();
      T(c, "평균 시청 유지율", 320, 112, 15, SEC, 700, "center"); T(c, m + "%", 320, 192, 88, INK, 400, "center", HAN);
      rr(c, 190, 214, 260, 12, 6); c.fillStyle = "rgba(255,255,255,.12)"; c.fill(); rr(c, 190, 214, Math.max(12, 260 * m / 100 * E.outC(seg(t, 0.8, 1.8))), 12, 6); c.fillStyle = BLUE; c.fill();
      T(c, "숫자 하나로는 어디서 떠났는지 알 수 없다", 320, 252, 13, "#ffd9b0", 700, "center"); c.restore();
      T(c, "가상 예시 데이터입니다 (60초 영상)", 320, 350, 10, MUT, 500, "center"); pill(c, "연출 전 · 평균 한 숫자만 본다", "#ffd9b0"); return;
    }
    T(c, "시청 유지율 (%)  ·  가상 예시 데이터, 60초 영상", X0, 56, 12, SEC, 700);
    [0, 25, 50, 75, 100].forEach((v) => { c.strokeStyle = v ? GRID : AXIS; c.lineWidth = 1; c.beginPath(); c.moveTo(X0, gy(v) + 0.5); c.lineTo(X1, gy(v) + 0.5); c.stroke(); T(c, v + "%", X0 - 8, gy(v) + 3.5, 10, MUT, 500, "right", MONO); });
    for (let sc = 0; sc <= LEN; sc += 10) T(c, sc + "초", gx(sc), YB + 16, 10, MUT, 500, "center", MONO);
    const ph = E.inOutC(seg(t, 0.5, 3.6)), hx = X0 + ph * (X1 - X0), n = s.ret.length;
    const upto = (arr) => { const p = []; for (let i = 0; i < n; i++) { if (gx(i) <= hx) p.push([gx(i), gy(arr[i])]); } return p; };
    // 비슷한 길이 영상 평균과 사이 면(L3)
    if (L >= 3 && CMP) {
      const q = E.outC(seg(t, 3.7, 4.6));
      if (q > 0) { c.save(); c.globalAlpha = q; for (let i = 0; i < n - 1; i++) { const d0 = s.ret[i] - s.typ[i], d1 = s.ret[i + 1] - s.typ[i + 1], below = (d0 + d1) / 2 < 0; c.beginPath(); c.moveTo(gx(i), gy(s.typ[i])); c.lineTo(gx(i + 1), gy(s.typ[i + 1])); c.lineTo(gx(i + 1), gy(s.ret[i + 1])); c.lineTo(gx(i), gy(s.ret[i])); c.closePath(); c.fillStyle = below ? "rgba(255,138,61,.22)" : "rgba(25,158,112,.30)"; c.fill(); }
        c.setLineDash([5, 4]); c.strokeStyle = "#aab3c2"; c.lineWidth = 1.6; c.beginPath(); for (let i = 0; i < n; i++) (i ? c.lineTo(gx(i), gy(s.typ[i])) : c.moveTo(gx(i), gy(s.typ[i]))); c.stroke(); c.setLineDash([]);
        T(c, "비슷한 길이 영상 평균 (가상)", gx(48), gy(s.typ[48]) - 12, 11, "#c9d0dc", 700, "center"); c.restore(); }
    }
    // 이탈 구간 띠(L2~)
    if (L >= 2) {
      s.dips.forEach((d) => { const u = E.outC(seg(t, 3.7 + (d.s / LEN) * 0.4, 4.3 + (d.s / LEN) * 0.4)); if (u <= 0) return; c.save(); c.globalAlpha = u; const bg = c.createLinearGradient(0, YT, 0, YB); bg.addColorStop(0, "rgba(255,138,61,.05)"); bg.addColorStop(1, "rgba(255,138,61,.30)"); c.fillStyle = bg; c.fillRect(gx(d.s), YT, gx(d.e) - gx(d.s), YB - YT); c.fillStyle = ORG; c.fillRect(gx(d.s), YT, 1.5, YB - YT); c.restore(); });
      s.spikes.forEach((d) => { const u = E.outC(seg(t, 4.2, 4.8)); if (u <= 0) return; c.save(); c.globalAlpha = u; c.fillStyle = "rgba(25,158,112,.28)"; c.fillRect(gx(d.s) - 2, YT, gx(d.e) - gx(d.s) + 4, YB - YT); c.fillStyle = AQUA; c.fillRect(gx(d.s) - 2, YT, 1.5, YB - YT); c.restore(); });
    }
    // 곡선
    const pts = upto(s.ret);
    if (pts.length > 1) {
      const fg = c.createLinearGradient(0, YT, 0, YB); fg.addColorStop(0, "rgba(57,135,229,.42)"); fg.addColorStop(1, "rgba(57,135,229,0)");
      c.beginPath(); c.moveTo(pts[0][0], YB); pts.forEach((p) => c.lineTo(p[0], p[1])); c.lineTo(pts[pts.length - 1][0], YB); c.closePath(); c.fillStyle = fg; c.fill();
      c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.strokeStyle = BLUE_L; c.lineWidth = 2.6; c.lineJoin = "round"; c.stroke();
      if (ph < 1) { const h = pts[pts.length - 1]; c.fillStyle = "#0b0e16"; c.beginPath(); c.arc(h[0], h[1], 5, 0, TAU); c.fill(); c.fillStyle = INK; c.beginPath(); c.arc(h[0], h[1], 3.4, 0, TAU); c.fill(); }
    }
    // 이름표·설명 문구
    if (L >= 2) {
      s.big.forEach((d, k) => { const u = E.outC(seg(t, 4.4 + k * 0.25, 5)); if (u <= 0) return; const xm = (gx(d.s) + gx(d.e)) / 2, w = 118; c.save(); c.globalAlpha = u;
        const bx = Math.max(X0 + 2, Math.min(X1 - w - 2, xm - w / 2)); rr(c, bx, 66, w, 22, 7); c.fillStyle = "rgba(8,10,20,.9)"; c.fill(); c.strokeStyle = ORG; c.lineWidth = 1.2; c.stroke();
        T(c, "−" + Math.round(d.drop) + "%p · " + d.s + "~" + d.e + "초", bx + w / 2, 81, 11.5, ORG, 700, "center"); c.strokeStyle = "rgba(255,138,61,.6)"; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(xm, 88); c.lineTo(xm, YT); c.stroke(); c.setLineDash([]); c.restore(); });
      s.spikes.forEach((d) => { const u = E.outC(seg(t, 4.6, 5.1)); if (u <= 0) return; const xm = (gx(d.s) + gx(d.e)) / 2; c.save(); c.globalAlpha = u; T(c, "다시 본 구간", xm, gy(s.ret[d.e]) - 12, 11, "#7fe0b0", 700, "center"); c.restore(); });
    }
    if (L >= 3) { const u = E.outC(seg(t, 5, 5.5)); if (u > 0 && s.big[0]) { const dd = s.dips.filter((x) => x.s > 10).sort((p, q) => q.drop - p.drop)[0] || s.big[0]; c.save(); c.globalAlpha = u; rr(c, 120, 318, 400, 26, 13); c.fillStyle = "rgba(255,138,61,.16)"; c.fill(); c.strokeStyle = "rgba(255,138,61,.7)"; c.stroke(); T(c, "먼저 열어 볼 곳: " + dd.s + "~" + dd.e + "초 — 이 구간에 무엇이 나오는지 확인", 320, 335, 12, "#ffd9b0", 700, "center"); c.restore(); } }
    if (L < 3) T(c, "가상 예시 데이터입니다", 320, 350, 10, MUT, 500, "center"); else T(c, "가상 예시 데이터입니다", 320, 354, 10, MUT, 500, "center");
    const tag = L === 1 ? "곡선 · 시간에 따라 몇 %가 남는지" : L === 2 ? "이탈 구간 · 3초에 " + DIP + "%p 이상 줄어든 곳" : "비교 · " + (CMP ? "비슷한 영상 평균보다 낮은 곳은 주황" : "비교 곡선 없음");
    pill(c, tag, INK);
  },
};
export default demo;
