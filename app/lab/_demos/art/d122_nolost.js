/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/sankey-funnel/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng, canvas, rr } from "./helpers.js";
const PAL = { bg0: "#0b0f1a", bg1: "#161d30", ink: "#f4efe4", muted: "#8b94a3", accent: "#ffb36b", accent2: "#ffd27a", surface: "#131a2b", line: "rgba(244,239,228,.16)" };

// 같은 1만 명의 방문자를 퍼널(단계마다 줄어드는 모양)과 산키(어디서 와서 어디로 갔는지 흐름의 굵기)로 본다. 숫자는 모두 설명용 가상 데이터다. 화면은 시간 t 의 함수다.
const ALPHA = 0.55;             // 산키 흐름 띠의 투명도(1 = 불투명)
const SHOW_LOST = 0;            // 1 이면 퍼널에서 빠져나간 사람(이탈)을 회색 삼각형과 숫자로 보여 준다

const TAU = Math.PI * 2;
const INK = PAL.ink, SEC = "#c3c2b7", MUT = PAL.muted, GRID = "rgba(255,255,255,.09)", ORG = PAL.accent;
const SANS = '"IBM Plex Sans KR","Malgun Gothic",sans-serif', MONO = '"JetBrains Mono","Malgun Gothic",monospace';
const T = (c, s, x, y, z, col, w, al, f) => { c.save(); c.fillStyle = col; c.font = (w || 500) + " " + z + "px " + (f || SANS); c.textAlign = al || "left"; c.textBaseline = "alphabetic"; c.fillText(s, x, y); c.restore(); };
function grainTile(seed) { const g = document.createElement("canvas"); g.width = g.height = 96; const x = g.getContext("2d"), im = x.createImageData(96, 96), r = rng(seed); for (let i = 0; i < 96 * 96; i++) { const v = (r() * 255) | 0; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } x.putImageData(im, 0, 0); return g; }
function pill(c, s, col) { c.save(); c.font = "500 12px " + SANS; const w = c.measureText(s).width + 22; rr(c, 14, 12, w, 22, 11); c.fillStyle = "rgba(19,26,43,.88)"; c.fill(); c.strokeStyle = PAL.line; c.lineWidth = 1; c.stroke(); c.fillStyle = col || INK; c.textBaseline = "alphabetic"; c.fillText(s, 25, 27.5); c.restore(); }
const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const hexA = (h, a) => { const v = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); return "rgba(" + v.join(",") + "," + a + ")"; };

const STAGES = [["방문", 10000], ["상세 열람", 4200], ["가입", 1800], ["구매", 600]];
const SRC = [["검색", 5000, "#3987e5"], ["SNS", 3000, "#199e70"], ["광고", 2000, "#9085e9"]];
const OUT = ["구매", "가입만", "이탈"];
const FLOW = [[360, 640, 4000], [120, 360, 2520], [120, 200, 1680]];   // 출처별 → 구매 / 가입만 / 이탈 (합계는 퍼널과 같다)
const FW = 170;                 // 퍼널에서 가장 넓은 막대(방문)의 폭(px)
const FX = 118, FY = 98, FH = 28, FG = 28, LX = FX + FW / 2 + 9;   // LX = 막대 오른쪽 글자 위치
const bw = (v) => Math.max(8, FW * v / 10000);
const SX0 = 430, SX1 = 566, SY0 = 98, SK = 0.015, SGAP = 10, SGR = 22;   // SGR = 오른쪽 결과 막대 사이 간격(글자 두 줄이 겹치지 않게 넓힘)

const demo = {
  dur: 6.6, rest: 6.2, noCompare: false, levels: 3,
  mount(sp) { const c = canvas(sp); c.canvas.style.cssText = "width:640px;height:360px;display:block"; return { c, grain: grainTile(53) }; },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 퍼널 막대, 2 = 단계별 남은 비율과 이탈·가장 낮은 단계 강조, 3 = 산키로 출처별 흐름
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1;
    const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, PAL.bg0); g.addColorStop(1, PAL.bg1); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
    const rg = c.createRadialGradient(330, 170, 20, 330, 170, 340); rg.addColorStop(0, "rgba(100,130,210,.10)"); rg.addColorStop(1, "rgba(100,130,210,0)"); c.fillStyle = rg; c.fillRect(0, 0, 640, 360);
    c.save(); c.globalAlpha = 0.045; c.fillStyle = c.createPattern(s.grain, "repeat"); c.fillRect(0, 0, 640, 360); c.restore();
    T(c, "방문자 1만 명의 단계별 남은 수", 24, 80, 13, SEC, 700);
    const conv = STAGES.map((st, i) => (i ? st[1] / STAGES[i - 1][1] : 1)), low = conv.indexOf(Math.min(...conv.slice(1)));
    const ramp = ["#86b6ef", "#5f9fe8", "#3987e5", "#2a6fc4"];
    if (L === 0) {
      const q = E.outC(seg(t, 0.5, 1.4)); c.save(); c.globalAlpha = q;
      STAGES.forEach((st, i) => { const y = 118 + i * 38; T(c, st[0], 28, y, 14, SEC, 500); T(c, fmt(st[1]) + "명", 300, y, 15, INK, 700, "right", MONO); c.strokeStyle = GRID; c.beginPath(); c.moveTo(28, y + 12.5); c.lineTo(300, y + 12.5); c.stroke(); });
      T(c, "숫자만 있어서 어디서 많이 빠지는지 계산해야 안다", 28, 290, 12.5, "#ffb36b", 700); c.restore();
    } else {
      STAGES.forEach((st, i) => {
        const u = E.outC(seg(t, 0.5 + i * 0.5, 1.1 + i * 0.5)), y = FY + i * (FH + FG), w = bw(st[1]) * u;
        if (i > 0) { const pw = bw(STAGES[i - 1][1]), cu = E.outC(seg(t, 0.5 + i * 0.5, 1.1 + i * 0.5)); c.save(); c.globalAlpha = cu; const yy = y - FG, w2 = bw(st[1]);
          if (L >= 2 && SHOW_LOST) { c.fillStyle = "rgba(139,148,163,.34)"; c.strokeStyle = "rgba(180,188,200,.85)"; c.setLineDash([3, 3]); c.lineWidth = 1; [-1, 1].forEach((sd) => { c.beginPath(); c.moveTo(FX + sd * pw / 2, yy); c.lineTo(FX + sd * w2 / 2, y); c.lineTo(FX + sd * pw / 2, y); c.closePath(); c.fill(); c.stroke(); }); c.setLineDash([]); }
          const cg = c.createLinearGradient(0, yy, 0, y); cg.addColorStop(0, hexA(ramp[i - 1], 0.45)); cg.addColorStop(1, hexA(ramp[i], 0.45));
          c.beginPath(); c.moveTo(FX - pw / 2, yy); c.lineTo(FX + pw / 2, yy); c.lineTo(FX + w2 / 2, y); c.lineTo(FX - w2 / 2, y); c.closePath(); c.fillStyle = cg; c.fill(); c.restore(); }
        const hot = L >= 2 && i === low, col = hot ? ORG : ramp[i];
        const bg = c.createLinearGradient(0, y, 0, y + FH); bg.addColorStop(0, col); bg.addColorStop(1, hot ? "#f0914a" : col);
        rr(c, FX - w / 2, y, w, FH, 5); c.fillStyle = bg; c.fill(); c.fillStyle = "rgba(255,255,255,.28)"; c.fillRect(FX - w / 2 + 3, y + 1, Math.max(0, w - 6), 1);
        c.save(); c.globalAlpha = u; c.font = "700 13px " + SANS; const nw = c.measureText(st[0]).width; T(c, st[0], LX, y + 19, 13, INK, 700); T(c, fmt(st[1]) + "명", LX + nw + 8, y + 19, 12, SEC, 500, "left", MONO); c.restore();
        if (L >= 2 && i > 0) { const cu = E.outC(seg(t, 1.2 + i * 0.5, 1.8 + i * 0.5)); c.save(); c.globalAlpha = cu; const lost = STAGES[i - 1][1] - st[1];
          T(c, Math.round(conv[i] * 100) + "% 남음" + (SHOW_LOST ? " · " + fmt(lost) + " 이탈" : ""), LX, y - FG / 2 + 4, 12, hot ? ORG : SEC, 700); c.restore(); }
      });
    }
    // 오른쪽
    T(c, L >= 3 ? "출처에서 결과까지 흐름 (띠 굵기 = 사람 수)" : "출처별 결과 숫자표", 350, 80, 13, SEC, 700);
    if (L < 3) {
      const q = E.outC(seg(t, 1.6, 2.4)); c.save(); c.globalAlpha = q;
      SRC.forEach((sr, i) => { const y = 118 + i * 52; T(c, sr[0] + " " + fmt(sr[1]), 354, y, 14, INK, 700); T(c, "구매 " + FLOW[i][0] + " · 가입만 " + FLOW[i][1] + " · 이탈 " + fmt(FLOW[i][2]), 354, y + 19, 12, SEC, 500); c.strokeStyle = GRID; c.beginPath(); c.moveTo(354, y + 31.5); c.lineTo(620, y + 31.5); c.stroke(); });
      T(c, "어느 출처가 잘 구매하는지 눈에 안 들어온다", 354, 290, 12.5, L === 0 ? "#ffb36b" : MUT, 700); c.restore();
    } else {
      // 왼쪽 노드 위치
      let ly = SY0; const lpos = SRC.map((sr) => { const o = { y: ly, h: sr[1] * SK }; ly += o.h + SGAP; return o; });
      let ry = SY0; const rv = OUT.map((_, j) => FLOW.reduce((p, f) => p + f[j], 0)), rpos = rv.map((v) => { const o = { y: ry, h: v * SK }; ry += o.h + SGR; return o; });
      const wipe = SX0 + E.inOutC(seg(t, 3.3, 5.1)) * (SX1 - SX0 + 4);
      c.save(); c.beginPath(); c.rect(SX0 - 2, 0, wipe - SX0 + 2, 360); c.clip(); const mx = (SX0 + SX1) / 2;
      SRC.forEach((sr, i) => { let acc = 0;
        FLOW[i].forEach((v, j) => { const th = v * SK, yl = lpos[i].y + acc, yr = rpos[j].y + FLOW.slice(0, i).reduce((p, f) => p + f[j] * SK, 0); acc += th;
          c.beginPath(); c.moveTo(SX0, yl); c.bezierCurveTo(mx, yl, mx, yr, SX1, yr); c.lineTo(SX1, yr + th); c.bezierCurveTo(mx, yr + th, mx, yl + th, SX0, yl + th); c.closePath(); c.fillStyle = hexA(sr[2], ALPHA); c.fill(); }); });
      c.restore();
      const nq = E.outC(seg(t, 3.0, 3.6)); c.save(); c.globalAlpha = nq;
      SRC.forEach((sr, i) => { const p = lpos[i]; rr(c, SX0 - 8, p.y, 8, p.h, 2); c.fillStyle = sr[2]; c.fill(); T(c, sr[0], SX0 - 14, p.y + p.h / 2 - 1, 12.5, INK, 700, "right"); T(c, fmt(sr[1]), SX0 - 14, p.y + p.h / 2 + 13, 12, SEC, 500, "right", MONO); });
      OUT.forEach((n, j) => { const p = rpos[j]; rr(c, SX1, p.y, 8, Math.max(3, p.h), 2); c.fillStyle = j === 2 ? "#5a6578" : "#e8e3d6"; c.fill(); const ty = j === 0 ? p.y + 4 : p.y + p.h / 2; T(c, n, SX1 + 14, ty, 12.5, INK, 700); T(c, fmt(rv[j]), SX1 + 14, ty + 14, 12, SEC, 500, "left", MONO); });
      c.restore();
    }
    const cap = L === 0 ? "연출 전 · 숫자만 나열: 단계가 줄어드는 모양도 흐름도 보이지 않는다" : L === 1 ? "퍼널: 막대 폭 = 그 단계에 남은 사람 수 · 아래로 갈수록 좁아진다" : L === 2 ? "퍼널 + 단계별 남는 비율: 가장 많이 놓치는 곳을 찾는다" : "산키: 띠가 굵을수록 그 길로 간 사람이 많다 (출처 → 결과)";
    T(c, cap, 320, 328, 13, L === 0 ? "#ffb36b" : INK, 700, "center");
    T(c, "가상 예시 데이터입니다", 320, 351, 10, MUT, 500, "center");
    pill(c, L === 0 ? "연출 전 · 숫자만 나열" : L === 1 ? "퍼널 · 단계마다 좁아지는 모양" : L === 2 ? "퍼널 · 남는 비율과 이탈" : "산키 · 출처에서 결과까지 흐름", L === 0 ? "#ffb36b" : INK);
  },
};
export default demo;
