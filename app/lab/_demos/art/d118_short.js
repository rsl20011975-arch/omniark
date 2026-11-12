/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/countdown/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng, canvas, rr } from "./helpers.js";

// 5초 카운트다운 뒤에 새 시리즈 공개 카드가 나온다. 숫자·링·정적·번쩍임이 한 가지씩 더해진다. 화면은 시간 t 의 함수다. (가상 예시 문구)
const FROM = 3;                 // 몇 부터 세는가
const TICK = 1;                 // 숫자 하나가 머무는 시간(초)
const HOLD = 0.4;               // 마지막 숫자 뒤, 공개 직전의 정적(초). 0 이면 바로 공개
const T0 = 0.4;

const TAU = Math.PI * 2;
const INK = "#f4efe4", SEC = "#c3c2b7", MUT = "#8b94a3", BLUE_L = "#86b6ef", ORG = "#ff8a3d";
const SANS = '"IBM Plex Sans KR","Malgun Gothic",sans-serif', HAN = '"Black Han Sans","Malgun Gothic",sans-serif';
const T = (c, s, x, y, z, col, w, al, f) => { c.save(); c.fillStyle = col; c.font = (w || 500) + " " + z + "px " + (f || SANS); c.textAlign = al || "left"; c.textBaseline = "alphabetic"; c.fillText(s, x, y); c.restore(); };
function grainTile(seed) { const g = document.createElement("canvas"); g.width = g.height = 96; const x = g.getContext("2d"), im = x.createImageData(96, 96), r = rng(seed); for (let i = 0; i < 96 * 96; i++) { const v = (r() * 255) | 0; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } x.putImageData(im, 0, 0); return g; }
function pill(c, s, col) { c.save(); c.font = "500 12px " + SANS; const w = c.measureText(s).width + 22; rr(c, 14, 12, w, 22, 11); c.fillStyle = "rgba(8,10,20,.78)"; c.fill(); c.strokeStyle = "rgba(255,255,255,.16)"; c.lineWidth = 1; c.stroke(); c.fillStyle = col || INK; c.textBaseline = "alphabetic"; c.fillText(s, 25, 27.5); c.restore(); }
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
    const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, "#0e1424"); g.addColorStop(1, "#070a12"); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
    const glowA = L >= 2 && counting ? 0.10 + 0.18 * heat : (t >= TR ? 0.16 : 0.07);
    const gl = c.createRadialGradient(CX, CY, 10, CX, CY, 300); gl.addColorStop(0, "rgba(255,138,61," + glowA.toFixed(3) + ")"); gl.addColorStop(1, "rgba(255,138,61,0)"); c.fillStyle = gl; c.fillRect(0, 0, 640, 360);
    c.save(); c.globalAlpha = 0.045; c.fillStyle = c.createPattern(s.grain, "repeat"); c.fillRect(0, 0, 640, 360); c.restore();
    // 위쪽 점: 남은 숫자 표시
    if (L >= 2 && t >= T0 && t < TR) {
      for (let i = 0; i < FROM; i++) { const x = CX + (i - (FROM - 1) / 2) * 22, on = t >= TE ? false : i >= idx; c.beginPath(); c.arc(x, 56, 4.5, 0, TAU); c.fillStyle = on ? (i === idx ? ORG : "rgba(255,255,255,.55)") : "rgba(255,255,255,.14)"; c.fill(); }
      T(c, t >= TE ? "0" : "남은 " + n + "초", CX, 78, 12, SEC, 700, "center");
    }
    // 링과 눈금
    if (L >= 2 && t >= T0 && t < TR) {
      for (let i = 0; i < 60; i++) { const ang = i / 60 * TAU - Math.PI / 2, r0 = R + 10, r1 = R + (i % 5 ? 13 : 17); c.strokeStyle = "rgba(255,255,255," + (i % 5 ? 0.12 : 0.28) + ")"; c.lineWidth = 1; c.beginPath(); c.moveTo(CX + Math.cos(ang) * r0, CY + Math.sin(ang) * r0); c.lineTo(CX + Math.cos(ang) * r1, CY + Math.sin(ang) * r1); c.stroke(); }
      c.lineWidth = 7; c.strokeStyle = "rgba(255,255,255,.12)"; c.beginPath(); c.arc(CX, CY, R, 0, TAU); c.stroke();
      const rem = t >= TE ? 0 : 1 - E.inOutC(fr);
      if (rem > 0.002) { c.lineCap = "round"; c.strokeStyle = mix(BLUE_L, ORG, heat); c.shadowColor = mix(BLUE_L, ORG, heat); c.shadowBlur = 10; c.beginPath(); c.arc(CX, CY, R, -Math.PI / 2, -Math.PI / 2 + TAU * rem); c.stroke(); c.shadowBlur = 0; c.lineCap = "butt"; }
    }
    // 숫자
    if (counting) {
      const f = L >= 2 ? fr : 0.5, ein = L >= 2 ? E.outC(seg(f, 0, 0.28)) : 1, eout = L >= 2 ? E.inC(seg(f, 0.82, 1)) : 0;
      const sc = L >= 2 ? lerp(1.55, 1, ein) * lerp(1, 0.86, eout) : 1, al = L >= 2 ? Math.min(1, seg(f, 0, 0.12)) * (1 - eout) : 1;
      const col = L >= 2 ? mix("#dfe9f7", ORG, heat) : INK;
      c.save(); c.translate(CX, CY + 54); c.scale(sc, sc); c.globalAlpha = al;
      if (L >= 2) { c.shadowColor = "rgba(255,138,61," + (0.25 + 0.4 * heat).toFixed(2) + ")"; c.shadowBlur = 28; }
      T(c, String(n), 0, 0, 150, col, 400, "center", HAN); c.restore();
    }
    // 정적(공개 직전)
    if (L >= 3 && t >= TE && t < TR) {
      const q = seg(t, TE, TR), rr2 = 3 + 5 * E.outC(q);
      c.fillStyle = "rgba(255,255,255," + (0.9 - 0.5 * q).toFixed(2) + ")"; c.beginPath(); c.arc(CX, CY, rr2, 0, TAU); c.fill();
      T(c, "…", CX, CY + 40, 22, MUT, 500, "center");
    }
    // 공개
    if (t >= TR) {
      const q = L === 0 ? 1 : seg(t, TR, TR + 0.55), sc = L >= 2 ? lerp(0.6, 1, E.outBack(q)) : 1;
      c.save(); c.translate(CX, CY); c.scale(sc, sc); c.globalAlpha = L >= 2 ? Math.min(1, q * 3) : 1;
      c.shadowColor = "rgba(0,0,0,.5)"; c.shadowBlur = 26; c.shadowOffsetY = 12;
      const cg = c.createLinearGradient(0, -70, 0, 70); cg.addColorStop(0, "#2d3a5c"); cg.addColorStop(1, "#171f35"); rr(c, -190, -70, 380, 140, 18); c.fillStyle = cg; c.fill();
      c.shadowColor = "transparent"; c.shadowBlur = 0; c.shadowOffsetY = 0; c.strokeStyle = "rgba(255,255,255,.18)"; c.lineWidth = 1; c.stroke();
      c.fillStyle = "rgba(255,255,255,.2)"; c.fillRect(-176, -69, 352, 1);
      const ob = c.createLinearGradient(0, -70, 0, 70); ob.addColorStop(0, "#ffb36b"); ob.addColorStop(1, "#ff6a4d"); rr(c, -190, -70, 9, 140, 4); c.fillStyle = ob; c.fill();
      T(c, "새 시리즈 공개", -160, 8, 44, INK, 400, "left", HAN);
      T(c, "1화 · 오늘 저녁 8시", -160, 42, 17, SEC, 500, "left");
      c.restore();
      if (L >= 3) {
        const fq = seg(t, TR, TR + 0.4);
        if (fq > 0 && fq < 1) { const fa = Math.pow(1 - fq, 2) * 0.85; const fg = c.createRadialGradient(CX, CY, 0, CX, CY, 330); fg.addColorStop(0, "rgba(255,244,225," + fa.toFixed(3) + ")"); fg.addColorStop(1, "rgba(255,200,140,0)"); c.fillStyle = fg; c.fillRect(0, 0, 640, 360); }
        const sq = E.outExpo(seg(t, TR, TR + 0.9));
        if (sq < 1) { c.strokeStyle = "rgba(255,190,120," + (0.8 * (1 - sq)).toFixed(2) + ")"; c.lineWidth = 2 + 4 * (1 - sq); c.beginPath(); c.arc(CX, CY, 50 + 260 * sq, 0, TAU); c.stroke(); c.strokeStyle = "rgba(255,255,255," + (0.5 * (1 - sq)).toFixed(2) + ")"; c.lineWidth = 1.5; c.beginPath(); c.arc(CX, CY, 30 + 200 * sq, 0, TAU); c.stroke(); }
        s.rays.forEach(([ang, len]) => { const rq = E.outExpo(seg(t, TR, TR + 0.7)); if (rq >= 1) return; const r0 = 100 + 150 * rq, r1 = r0 + 40 * len * (1 - rq) + 6; c.strokeStyle = "rgba(255,220,170," + (0.75 * (1 - rq)).toFixed(2) + ")"; c.lineWidth = 2; c.beginPath(); c.moveTo(CX + Math.cos(ang) * r0, CY + Math.sin(ang) * r0 * 0.75); c.lineTo(CX + Math.cos(ang) * r1, CY + Math.sin(ang) * r1 * 0.75); c.stroke(); });
      }
    }
    const tag = L === 0 ? "연출 전 · 카운트다운 없이 바로 공개" : t >= TR ? "공개 · " + (L >= 3 ? "번쩍임과 퍼지는 고리" : L === 2 ? "카드가 튀어 나옴" : "카드가 그냥 나타남") : t >= TE ? "정적 " + HOLD + "초 · 숨을 멈추는 구간" : L === 1 ? "숫자만 같은 크기로 바뀜 · " + FROM + "→1" : "카운트다운 · 숫자가 튀어 들어오고 링이 줄어듦";
    pill(c, tag, L === 0 ? "#ffd9b0" : INK);
    T(c, "가상 예시 문구입니다", 320, 350, 10, MUT, 500, "center");
  },
};
export default demo;
