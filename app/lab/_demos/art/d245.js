/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/ai-image-text-overlay/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 글자 없는 그림 위에 글꼴로 문구를 얹는다. 글씨 크기는 세 상한 중 가장 작은 값이다. 그림은 코드로 그린 예시다.
const PHRASE = '고마워요 오늘도 행복해요 내일도';   // 얹을 문구
const MAXC = 7;       // 한 줄 최대 글자 수(띄어쓰기에서만 접는다)
const CAP_B = 0.30;   // 글씨 덩어리 높이 상한(그림 높이의 비율)
const CAP_H = 0.11;   // 글씨 한 글자 높이 상한(그림 높이의 비율)
const CAP_W = 0.70;   // 폭 상한(그림 폭의 비율)
const CY = 0.18;      // 글씨 덩어리 가운데(위에서 그림 높이의 비율)
const PITCH = 1.18;   // 상한 식의 줄 간격 배수
const TILT = -1;      // 기울기(도)
const W0 = 768, H0 = 1376;   // 그림 크기(9:16, 1K 값)
const PAL = { bg0: '#a9402c', bg1: '#8f3322', ink: '#fff4ec', muted: '#ffd9c9', accent: '#ffe27a', accent2: '#1d1a16', surface: '#b24a34', line: 'rgba(255,244,236,.3)' };
const INK = '#1e1a18';
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif', HAN = '"Black Han Sans", sans-serif';
const FX = 424, FY = 38, FH = 312, S = FH / H0, FW = W0 * S;   // 그림 틀의 무대 위치와 축척
const DESC = ['고정 크기, 한 줄', `한 줄 ${MAXC}자로 접기`, `폭 ${Math.round(CAP_W * 100)}% 상한`, `높이 ${Math.round(CAP_B * 100)}% 상한`];

let GRAIN = null;
function wrap(term, max) {              // 띄어쓰기 단위로만 접는다. 낱말 하나는 쪼개지 않는다
  const words = term.split(' ').filter(Boolean);
  if (words.length <= 1) return [term];
  const lines = []; let cur = '';
  for (const w of words) {
    const cand = (cur + ' ' + w).trim();
    if (cand.length > max && cur) { lines.push(cur); cur = w; } else cur = cand;
  }
  if (cur) lines.push(cur);
  return lines;
}
function plan(L, x) {                   // 단계 L 에서 글씨 크기와 줄 배치를 계산한다
  const lines = L >= 1 ? wrap(PHRASE, MAXC) : [PHRASE];
  const longest = Math.max(...lines.map((l) => l.length));
  const cH = Math.floor(H0 * CAP_H), cW = Math.floor(W0 * CAP_W / longest), cB = Math.floor(H0 * CAP_B / (lines.length * PITCH));
  let size = cH; if (L >= 2) size = Math.min(size, cW); if (L >= 3) size = Math.min(size, cB);
  x.font = `${size}px ${HAN}`;
  const maxW = Math.max(...lines.map((l) => x.measureText(l).width));
  const blockH = lines.length * size * PITCH, top = H0 * CY - blockH / 2;
  return { lines, longest, cH, cW, cB, size, maxW, blockH, top, cutTop: Math.max(0, -top), cutBot: Math.max(0, top + blockH - H0), overW: Math.max(0, Math.round(maxW - W0)) };
}
function rr(x, X, Y, W, H, r) { x.beginPath(); x.roundRect(X, Y, W, H, Math.max(0, Math.min(r, W / 2, H / 2))); }
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.textBaseline = 'alphabetic'; x.fillText(s, X, Y); }

function flower(x) {                    // 그림 속 꽃(코드로 그린 예시): 줄기, 잎, 반투명 꽃잎 아홉 장
  const cx = 384, cy = 960;
  const stem = x.createLinearGradient(0, cy, 0, H0); stem.addColorStop(0, '#5f8a52'); stem.addColorStop(1, '#2f5a3a');
  x.strokeStyle = stem; x.lineWidth = 15; x.lineCap = 'round';
  x.beginPath(); x.moveTo(cx, cy + 90); x.bezierCurveTo(cx - 34, cy + 240, cx + 30, cy + 330, cx - 6, H0 + 10); x.stroke();
  [[-1, 1180], [1, 1250]].forEach(([d, y]) => {
    x.save(); x.translate(cx + d * 6, y); x.rotate(d * 0.9);
    const lg = x.createLinearGradient(0, -80, 0, 80); lg.addColorStop(0, '#79a566'); lg.addColorStop(1, '#3d6d48');
    x.fillStyle = lg; x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(70, -60, 6, -190); x.quadraticCurveTo(-60, -70, 0, 0); x.fill(); x.restore();
  });
  const halo = x.createRadialGradient(cx, cy, 20, cx, cy, 330); halo.addColorStop(0, 'rgba(255,255,255,.75)'); halo.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = halo; x.fillRect(cx - 340, cy - 340, 680, 680);
  for (let k = 0; k < 9; k++) {
    x.save(); x.translate(cx, cy); x.rotate(k * Math.PI * 2 / 9);
    const pg = x.createLinearGradient(0, -190, 0, 0); pg.addColorStop(0, 'rgba(255,214,228,.88)'); pg.addColorStop(0.6, 'rgba(250,150,180,.7)'); pg.addColorStop(1, 'rgba(255,245,248,.9)');
    x.fillStyle = pg; x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 3;
    x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(-78, -60, -66, -180, 0, -215); x.bezierCurveTo(66, -180, 78, -60, 0, 0); x.fill(); x.stroke();
    x.strokeStyle = 'rgba(255,255,255,.45)'; x.lineWidth = 2; x.beginPath(); x.moveTo(0, -20); x.quadraticCurveTo(-10, -110, 0, -185); x.stroke();
    x.restore();
  }
  const core = x.createRadialGradient(cx - 10, cy - 12, 4, cx, cy, 50); core.addColorStop(0, '#fff6c8'); core.addColorStop(1, '#f2b05e');
  x.fillStyle = core; x.beginPath(); x.arc(cx, cy, 46, 0, Math.PI * 2); x.fill();
}
function picture(x) {                   // 글자가 하나도 없는 그림. 위쪽은 글자가 앉을 밝은 빈 하늘로 남긴다
  const g = x.createLinearGradient(0, 0, 0, H0);
  g.addColorStop(0, '#fff6ec'); g.addColorStop(0.35, '#fde6d6'); g.addColorStop(0.72, '#f6c4b4'); g.addColorStop(1, '#e8a29b');
  x.fillStyle = g; x.fillRect(0, 0, W0, H0);
  [[0.82, 0.1, 360, 'rgba(255,255,255,.7)'], [0.2, 0.3, 300, 'rgba(255,236,214,.6)']].forEach(([px, py, r, c]) => {
    const rg = x.createRadialGradient(W0 * px, H0 * py, 0, W0 * px, H0 * py, r); rg.addColorStop(0, c); rg.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = rg; x.fillRect(0, 0, W0, H0);
  });
  [8, 14, 20].forEach((q, i) => { x.fillStyle = `rgba(150,60,70,${0.05 - i * 0.012})`; x.beginPath(); x.ellipse(384, 1320, 270 - i * 20, 34 - i * 4, 0, 0, Math.PI * 2); x.fill(); });
  flower(x);
}

const demo = {
  dur: 2.4, rest: 2.4, noCompare: false, levels: 3,
  mount(sp) {
    const r = rng(11), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const cv = el('canvas', null, sp); cv.width = 1280; cv.height = 720;
    Object.assign(cv.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const lab = el('div', null, sp);   // 이름표(numeral): 큰 단계 번호와 지금 보여 주는 것
    Object.assign(lab.style, { position: 'absolute', left: '24px', top: '14px', display: 'flex', alignItems: 'center', gap: '12px' });
    const num = el('div', null, lab);
    Object.assign(num.style, { font: `400 40px/1 ${HAN}`, color: PAL.accent });
    const desc = el('div', null, lab);
    Object.assign(desc.style, { font: `500 13px/1.2 ${SANS}`, color: PAL.ink });
    return { cv, num, desc };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 0 : (lv == null ? 3 : lv);
    const x = s.cv.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.setLineDash([]); x.shadowBlur = 0;
    const bg = x.createLinearGradient(0, 0, 640, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.07;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();

    const P = plan(L, x);
    const k = E.outC(seg(t, 0.05, 0.9));

    // 크기 계산 세 줄(그림 크기 768×1376 기준 px)
    const rows = [
      { on: true, lab: `높이 ${Math.round(CAP_H * 100)}%`, v: P.cH },
      { on: L >= 2, lab: `폭 ${Math.round(CAP_W * 100)}% ÷ 가장 긴 줄 ${P.longest}자`, v: P.cW },
      { on: L >= 3, lab: `높이 ${Math.round(CAP_B * 100)}% ÷ (${P.lines.length}줄 × ${PITCH})`, v: P.cB },
    ];
    rows.forEach((q, i) => {
      const RY = 84 + i * 46, win = q.on && q.v === P.size;
      x.save(); x.globalAlpha = q.on ? 1 : 0.38;
      x.fillStyle = win ? 'rgba(255,226,122,.18)' : PAL.surface; rr(x, 24, RY, 366, 38, 6); x.fill();
      x.strokeStyle = win ? PAL.accent : PAL.line; x.lineWidth = win ? 1.6 : 1; rr(x, 24.5, RY + 0.5, 365, 37, 6); x.stroke();
      T(x, q.lab, 38, RY + 24, 13.5, PAL.ink, 500);
      T(x, q.on ? `${q.v}px` : '쓰지 않음', 376, RY + 25, q.on ? 17 : 12, win ? PAL.accent : (q.on ? PAL.ink : PAL.muted), 700, 'right', MONO);
      x.restore();
    });

    // 결과: 글씨 크기와 넘침·잘림
    T(x, L >= 3 ? '글씨 크기 (세 값 중 가장 작은 것)' : '글씨 크기', 24, 242, 12, PAL.muted, 500);
    T(x, `${P.size}px`, 24, 290, 44, PAL.ink, 400, 'left', HAN);
    const warn = P.overW > 0 || P.cutTop > 0 || P.cutBot > 0;
    let l1, l2;
    if (P.overW > 0) { l1 = `폭 ${W0}px 보다 ${P.overW.toLocaleString('ko-KR')}px 넘침`; l2 = '글자가 그림 양쪽 밖으로 나간다'; }
    else if (P.cutTop > 0) { l1 = `위쪽 ${Math.round(P.cutTop)}px 잘림`; l2 = `${P.lines.length}줄 덩어리가 그림 위로 나간다`; }
    else { l1 = '잘림 0px'; l2 = `${P.lines.length}줄이 위에서 ${Math.round(P.top / H0 * 100)}%~${Math.round((P.top + P.blockH) / H0 * 100)}% 안에 든다`; }
    T(x, l1, 190, 276, 16, warn ? PAL.accent : PAL.ink, 700);
    if (!warn) { x.save(); x.strokeStyle = PAL.accent; x.lineWidth = 2.4; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); x.moveTo(332, 270); x.lineTo(337, 275); x.lineTo(346, 264); x.stroke(); x.restore(); }
    T(x, l2, 190, 296, 12, PAL.muted, 500);
    T(x, `단위는 ${W0}×${H0} 그림 기준 px · 그림은 코드로 그린 예시`, 24, 344, 10.5, PAL.muted, 500, 'left', MONO);

    // 그림 틀: 그림자(겹친 반투명 사각형) → 그림 → 글자
    [1, 2, 3, 4, 5].forEach((q) => { x.fillStyle = 'rgba(40,10,6,.1)'; rr(x, FX - q * 1.2, FY + q * 1.6, FW + q * 2.4, FH + q * 1.6, 6 + q); x.fill(); });
    const ghost = (cx0, ink, al) => {   // 틀 밖으로 나간 글자를 옅게 보여 준다
      x.save(); x.beginPath(); x.rect(FX - 26, FY - 34, FW + 52, FH + 34); x.clip();
      x.globalAlpha = al; textBlock(x, P, ink, k); x.restore();
    };
    function textBlock(c, Q, ink, kk) {
      c.save(); c.translate(FX, FY); c.scale(S, S); c.translate(W0 / 2, H0 * CY); c.rotate(TILT * Math.PI / 180);
      c.font = `${Q.size}px ${HAN}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = ink;
      Q.lines.forEach((ln, i) => {
        const dy = (i - (Q.lines.length - 1) / 2) * Q.size * PITCH, lk = E.outC(seg(t, 0.15 + i * 0.12, 0.8 + i * 0.12));
        c.globalAlpha *= 1; const prev = c.globalAlpha; c.globalAlpha = prev * lk; c.fillText(ln, 0, dy + (1 - lk) * 14); c.globalAlpha = prev;
      });
      c.restore();
    }
    if (warn) ghost(0, PAL.accent, 0.55);
    x.save(); rr(x, FX, FY, FW, FH, 5); x.clip();
    x.save(); x.translate(FX, FY); x.scale(S, S); picture(x); x.restore();
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.1;
    for (let gx0 = 0; gx0 < FW; gx0 += 64) for (let gy0 = 0; gy0 < FH; gy0 += 64) x.drawImage(GRAIN, FX + gx0, FY + gy0, 64, 64);
    x.restore();
    if (L >= 1) { x.setLineDash([4, 4]); x.strokeStyle = 'rgba(120,50,40,.45)'; x.lineWidth = 1; x.strokeRect(FX + 5.5, FY + 5.5, FW - 11, FH * 0.35 - 6); x.setLineDash([]); }
    textBlock(x, P, INK, k);
    x.restore();
    x.strokeStyle = 'rgba(255,244,236,.55)'; x.lineWidth = 1; rr(x, FX + 0.5, FY + 0.5, FW - 1, FH - 1, 5); x.stroke();

    s.num.textContent = String(L);
    s.desc.textContent = DESC[L];
  },
};
export default demo;
