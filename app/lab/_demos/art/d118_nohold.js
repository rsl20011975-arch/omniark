/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/countdown/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng, canvas, rr } from "./helpers.js";
const PAL = { bg0: "#1b0e17", bg1: "#2b1424", ink: "#f6e9ee", muted: "#b095a3", accent: "#ff7aa8", accent2: "#ffd0a0", surface: "#26121f", line: "rgba(246,233,238,.22)" };

// 5초 카운트다운 뒤에 새 시리즈 공개 카드가 나온다. 숫자·링·정적·번쩍임이 한 가지씩 더해진다. 화면은 시간 t 의 함수다. (가상 예시 문구)
const FROM = 5;                 // 몇 부터 세는가
const TICK = 1;                 // 숫자 하나가 머무는 시간(초)
const HOLD = 0;               // 마지막 숫자 뒤, 공개 직전의 정적(초). 0 이면 바로 공개
const T0 = 0.4;

const TAU = Math.PI * 2;
const INK = PAL.ink, SEC = "#d8c3cd", MUT = PAL.muted, COOL = PAL.accent2, HOT = PAL.accent;
const SANS = '"IBM Plex Sans KR","Malgun Gothic",sans-serif', HAN = '"Black Han Sans","Malgun Gothic",sans-serif', MONO = '"JetBrains Mono","Malgun Gothic",monospace';
const T = (c, s, x, y, z, col, w, al, f) => { c.save(); c.fillStyle = col; c.font = (w || 500) + " " + z + "px " + (f || SANS); c.textAlign = al || "left"; c.textBaseline = "alphabetic"; c.fillText(s, x, y); c.restore(); };
function grainTile(seed) { const g = document.createElement("canvas"); g.width = g.height = 96; const x = g.getContext("2d"), im = x.createImageData(96, 96), r = rng(seed); for (let i = 0; i < 96 * 96; i++) { const v = (r() * 255) | 0; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } x.putImageData(im, 0, 0); return g; }
// 이름표(caption-bl): 왼쪽 아래, 배경 없음, 위에 1px 얇은 선
function caption(c, s) { c.save(); c.font = "500 12px " + MONO; const w = c.measureText(s).width; c.strokeStyle = PAL.line; c.lineWidth = 1; c.beginPath(); c.moveTo(16, 329.5); c.lineTo(16 + w, 329.5); c.stroke(); c.restore(); T(c, s, 16, 345, 12, MUT, 500, "left", MONO); }
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, p) => { const A = hex(a), B = hex(b); return "rgb(" + A.map((v, i) => Math.round(lerp(v, B[i], p))).join(",") + ")"; };
const CX = 320, CY = 190, R = 96;

const demo = {
  dur: 7.6, rest: 7.2, noCompare: false, levels: 3,
  mount(sp) {
    const c = canvas(sp); c.canvas.style.cssText = "width:640px;height:360px;display:block";
    const r = rng(7), rays = []; for (let i = 0; i < 16; i++) rays.push([r() * TAU, 0.5 + r() * 0.5]);
    return { c, grain: grainTile(5), rays };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 숫자만 같은 크기로 바뀜, 2 = 숫자가 튀어 들어오고 링·색이 변함, 3 = 마지막 정적 + 번쩍이며 공개
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1;
    const TE = T0 + FROM * TICK, hold = L >= 3 ? HOLD : 0, TR = L === 0 ? T0 : TE + hold;
    const counting = L >= 1 && t >= T0 && t < TE;
    const idx = Math.min(FROM - 1, Math.max(0, Math.floor((t - T0) / TICK))), n = FROM - idx, fr = seg(t, T0 + idx * TICK, T0 + (idx + 1) * TICK);
    const heat = FROM > 1 ? (FROM - n) / (FROM - 1) : 1;
    // 배경
    const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, PAL.bg0); g.addColorStop(1, PAL.bg1); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
    const glowA = L >= 2 && counting ? 0.10 + 0.20 * heat : (t >= TR ? 0.18 : 0.08);
    const gl = c.createRadialGradient(CX, CY, 10, CX, CY, 300); gl.addColorStop(0, "rgba(255,122,168," + glowA.toFixed(3) + ")"); gl.addColorStop(1, "rgba(255,122,168,0)"); c.fillStyle = gl; c.fillRect(0, 0, 640, 360);
    const gl2 = c.createRadialGradient(CX, CY, 4, CX, CY, 120); gl2.addColorStop(0, "rgba(255,208,160," + (glowA * 0.5).toFixed(3) + ")"); gl2.addColorStop(1, "rgba(255,208,160,0)"); c.fillStyle = gl2; c.fillRect(0, 0, 640, 360);
    c.save(); c.globalAlpha = 0.05; c.fillStyle = c.createPattern(s.grain, "repeat"); c.fillRect(0, 0, 640, 360); c.restore();
    // 위쪽 점: 남은 숫자 표시
    if (L >= 2 && t >= T0 && t < TR) {
      for (let i = 0; i < FROM; i++) { const x = CX + (i - (FROM - 1) / 2) * 22, on = t >= TE ? false : i >= idx; c.beginPath(); c.arc(x, 56, 4.5, 0, TAU); c.fillStyle = on ? (i === idx ? HOT : "rgba(246,233,238,.58)") : "rgba(246,233,238,.16)"; c.fill(); }
      T(c, t >= TE ? "0" : "남은 " + n + "초", CX, 78, 12, SEC, 700, "center");
    }
    // 링과 눈금
    if (L >= 2 && t >= T0 && t < TR) {
      for (let i = 0; i < 60; i++) { const ang = i / 60 * TAU - Math.PI / 2, r0 = R + 10, r1 = R + (i % 5 ? 13 : 17); c.strokeStyle = "rgba(246,233,238," + (i % 5 ? 0.14 : 0.3) + ")"; c.lineWidth = 1; c.beginPath(); c.moveTo(CX + Math.cos(ang) * r0, CY + Math.sin(ang) * r0); c.lineTo(CX + Math.cos(ang) * r1, CY + Math.sin(ang) * r1); c.stroke(); }
      c.lineWidth = 7; c.strokeStyle = "rgba(246,233,238,.13)"; c.beginPath(); c.arc(CX, CY, R, 0, TAU); c.stroke();
      const rem = t >= TE ? 0 : 1 - E.inOutC(fr);
      if (rem > 0.002) { c.lineCap = "round"; c.strokeStyle = mix(COOL, HOT, heat); c.shadowColor = mix(COOL, HOT, heat); c.shadowBlur = 10; c.beginPath(); c.arc(CX, CY, R, -Math.PI / 2, -Math.PI / 2 + TAU * rem); c.stroke(); c.shadowBlur = 0; c.lineCap = "butt"; }
    }
    // 숫자
    if (counting) {
      const f = L >= 2 ? fr : 0.5, ein = L >= 2 ? E.outC(seg(f, 0, 0.28)) : 1, eout = L >= 2 ? E.inC(seg(f, 0.82, 1)) : 0;
      const sc = L >= 2 ? lerp(1.55, 1, ein) * lerp(1, 0.86, eout) : 1, al = L >= 2 ? Math.min(1, seg(f, 0, 0.12)) * (1 - eout) : 1;
      const col = L >= 2 ? mix(COOL, HOT, heat) : INK;
      c.save(); c.translate(CX, CY + 54); c.scale(sc, sc); c.globalAlpha = al;
      if (L >= 2) { c.shadowColor = "rgba(255,122,168," + (0.25 + 0.4 * heat).toFixed(2) + ")"; c.shadowBlur = 28; }
      T(c, String(n), 0, 0, 150, col, 400, "center", HAN); c.restore();
    }
    // 정적(공개 직전)
    if (L >= 3 && t >= TE && t < TR) {
      const q = seg(t, TE, TR), rr2 = 3 + 5 * E.outC(q);
      c.fillStyle = "rgba(246,233,238," + (0.9 - 0.5 * q).toFixed(2) + ")"; c.beginPath(); c.arc(CX, CY, rr2, 0, TAU); c.fill();
      T(c, "…", CX, CY + 40, 22, MUT, 500, "center");
    }
    // 공개
    if (t >= TR) {
      const q = L === 0 ? 1 : seg(t, TR, TR + 0.55), sc = L >= 2 ? lerp(0.6, 1, E.outBack(q)) : 1;
      c.save(); c.translate(CX, CY); c.scale(sc, sc); c.globalAlpha = L >= 2 ? Math.min(1, q * 3) : 1;
      c.shadowColor = "rgba(0,0,0,.55)"; c.shadowBlur = 26; c.shadowOffsetY = 12;
      const cg = c.createLinearGradient(0, -70, 0, 70); cg.addColorStop(0, "#3a1c30"); cg.addColorStop(1, PAL.surface); rr(c, -190, -70, 380, 140, 18); c.fillStyle = cg; c.fill();
      c.shadowColor = "transparent"; c.shadowBlur = 0; c.shadowOffsetY = 0; c.strokeStyle = "rgba(246,233,238,.2)"; c.lineWidth = 1; c.stroke();
      c.fillStyle = "rgba(255,255,255,.2)"; c.fillRect(-176, -69, 352, 1);
      const ob = c.createLinearGradient(0, -70, 0, 70); ob.addColorStop(0, PAL.accent2); ob.addColorStop(1, PAL.accent); rr(c, -190, -70, 9, 140, 4); c.fillStyle = ob; c.fill();
      T(c, "새 시리즈 공개", -160, 8, 44, INK, 400, "left", HAN);
      T(c, "1화 · 오늘 저녁 8시", -160, 42, 17, SEC, 500, "left");
      c.restore();
      if (L >= 3) {
        const fq = seg(t, TR, TR + 0.4);
        if (fq > 0 && fq < 1) { const fa = Math.pow(1 - fq, 2) * 0.85; const fg = c.createRadialGradient(CX, CY, 0, CX, CY, 330); fg.addColorStop(0, "rgba(255,240,236," + fa.toFixed(3) + ")"); fg.addColorStop(1, "rgba(255,160,190,0)"); c.fillStyle = fg; c.fillRect(0, 0, 640, 360); }
        const sq = E.outExpo(seg(t, TR, TR + 0.9));
        if (sq < 1) { c.strokeStyle = "rgba(255,150,185," + (0.8 * (1 - sq)).toFixed(2) + ")"; c.lineWidth = 2 + 4 * (1 - sq); c.beginPath(); c.arc(CX, CY, 50 + 260 * sq, 0, TAU); c.stroke(); c.strokeStyle = "rgba(255,255,255," + (0.5 * (1 - sq)).toFixed(2) + ")"; c.lineWidth = 1.5; c.beginPath(); c.arc(CX, CY, 30 + 200 * sq, 0, TAU); c.stroke(); }
        s.rays.forEach(([ang, len]) => { const rq = E.outExpo(seg(t, TR, TR + 0.7)); if (rq >= 1) return; const r0 = 100 + 150 * rq, r1 = r0 + 40 * len * (1 - rq) + 6; c.strokeStyle = "rgba(255,208,160," + (0.8 * (1 - rq)).toFixed(2) + ")"; c.lineWidth = 2; c.beginPath(); c.moveTo(CX + Math.cos(ang) * r0, CY + Math.sin(ang) * r0 * 0.75); c.lineTo(CX + Math.cos(ang) * r1, CY + Math.sin(ang) * r1 * 0.75); c.stroke(); });
      }
    }
    const tag = L === 0 ? "연출 전 · 카운트다운 없이 바로 공개" : t >= TR ? "공개 · " + (L >= 3 ? "번쩍임과 퍼지는 고리" : L === 2 ? "카드가 튀어 나옴" : "카드가 그냥 나타남") : t >= TE ? "정적 " + HOLD + "초 · 숨을 멈추는 구간" : L === 1 ? "숫자만 같은 크기로 바뀜 · " + FROM + "→1" : "카운트다운 · 숫자가 튀어 들어오고 링이 줄어듦";
    caption(c, tag);
    T(c, "가상 예시 문구입니다", 624, 345, 10, MUT, 500, "right");
  },
};
export default demo;
