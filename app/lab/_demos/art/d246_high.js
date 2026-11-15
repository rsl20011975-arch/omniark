/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/night-ink-auto-switch/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 글자를 얹기 직전에 그림 위쪽 35% 영역의 밝기를 재서 글자색을 고른다. 두 장면은 코드로 그린 예시 그림이다.
const THRESH = 200;     // 평균 밝기(0~255)가 이 값 이상이면 먹색, 아니면 흰색
const DAY = 200;        // 낮 하늘의 기본 밝기값(0~255)
const NIGHT = 60;       // 밤 하늘의 기본 밝기값(0~255)
const PASS = 4.5;       // 일반 글자의 대비비 기준
const WORD = '고마워요';
const PAL = { bg0: '#0b0f1a', bg1: '#161d30', ink: '#f4efe4', muted: '#8b94a3', accent: '#ffb36b', accent2: '#ffd27a', surface: '#131a2b', line: 'rgba(244,239,228,.22)' };
const DARK = [30, 26, 24], WHITE = [250, 250, 250];
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif', HAN = '"Black Han Sans", sans-serif';
const CW = 276, CH = 173, CY0 = 54, CX = [30, 334];   // 장면 두 장의 위치와 크기
const TAGS = ['글자색은 먹색 하나로 고정', '위쪽 35% 평균 밝기를 잰다', `평균 ${THRESH} 이상이면 먹색, 아니면 흰색`, '고른 색의 대비비를 확인한다'];

let GRAIN = null, STARS = null;
const cl = (v) => Math.max(0, Math.min(255, Math.round(v)));
const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
const ratio = (a, b) => { const p = lum(a), q = lum(b); return (Math.max(p, q) + 0.05) / (Math.min(p, q) + 0.05); };
const rgb = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;
const mix = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)].map(Math.round);
function rr(x, X, Y, W, H, r) { x.beginPath(); x.roundRect(X, Y, W, H, Math.max(0, Math.min(r, W / 2, H / 2))); }
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.textBaseline = 'alphabetic'; x.fillText(s, X, Y); }

function scene(x, X, Y, kind) {          // 위쪽 35% 영역만 잘라 낸 하늘 장면
  const base = kind === 'day' ? DAY : NIGHT, tn = kind === 'day' ? [1, 0.92, 0.76] : [0.62, 0.72, 1.15];
  const col = (k) => `rgb(${cl(base * tn[0] * k)},${cl(base * tn[1] * k)},${cl(base * tn[2] * k)})`;
  x.save(); rr(x, X, Y, CW, CH, 8); x.clip();
  const g = x.createLinearGradient(0, Y, 0, Y + CH); g.addColorStop(0, col(0.92)); g.addColorStop(1, col(1.08)); x.fillStyle = g; x.fillRect(X, Y, CW, CH);
  if (kind === 'day') {
    const sun = x.createRadialGradient(X + CW * 0.8, Y + CH * 0.3, 0, X + CW * 0.8, Y + CH * 0.3, 130); sun.addColorStop(0, 'rgba(255,246,220,.6)'); sun.addColorStop(1, 'rgba(255,246,220,0)');
    x.fillStyle = sun; x.fillRect(X, Y, CW, CH);
    [[0.2, 0.72, 70, 0.3], [0.5, 0.86, 90, 0.26], [0.74, 0.7, 60, 0.28]].forEach(([px, py, r, al]) => {
      x.save(); x.translate(X + CW * px, Y + CH * py); x.scale(1, 0.34);
      const cg = x.createRadialGradient(0, 0, 0, 0, 0, r); cg.addColorStop(0, `rgba(255,255,255,${al})`); cg.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = cg; x.fillRect(-r, -r, r * 2, r * 2); x.restore();
    });
  } else {
    const mn = x.createRadialGradient(X + CW * 0.82, Y + CH * 0.3, 0, X + CW * 0.82, Y + CH * 0.3, 70); mn.addColorStop(0, 'rgba(230,236,255,.4)'); mn.addColorStop(1, 'rgba(230,236,255,0)');
    x.fillStyle = mn; x.fillRect(X, Y, CW, CH);
    STARS.forEach(([sx, sy, sr, sa]) => { x.fillStyle = `rgba(255,252,235,${sa})`; x.beginPath(); x.arc(X + sx * CW, Y + sy * CH, sr, 0, Math.PI * 2); x.fill(); });
    x.fillStyle = 'rgba(255,248,225,.95)'; x.beginPath(); x.arc(X + CW * 0.82, Y + CH * 0.3, 12, 0, Math.PI * 2); x.fill();
    x.fillStyle = col(0.7); x.beginPath(); x.arc(X + CW * 0.82 + 5, Y + CH * 0.3 - 3, 10, 0, Math.PI * 2); x.fill();
  }
  x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.12;
  for (let gx0 = 0; gx0 < CW; gx0 += 64) for (let gy0 = 0; gy0 < CH; gy0 += 64) x.drawImage(GRAIN, X + gx0, Y + gy0, 64, 64);
  x.restore();
  x.restore();
}
function measure(x, X, Y) {              // 글자를 얹기 전 픽셀을 읽어 회색 밝기와 평균 색을 낸다
  const d = x.getImageData(X * 2, Y * 2, CW * 2, CH * 2).data, n = d.length / 4;
  let r = 0, g = 0, b = 0;
  for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
  r /= n; g /= n; b /= n;
  return { gray: 0.299 * r + 0.587 * g + 0.114 * b, avg: [r, g, b] };
}

const demo = {
  dur: 2.4, rest: 2.4, noCompare: false, levels: 3,
  mount(sp) {
    const r = rng(23), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const rs = rng(5); STARS = []; for (let i = 0; i < 34; i++) STARS.push([rs(), rs(), 0.5 + rs() * 0.9, 0.4 + rs() * 0.5]);
    const cv = el('canvas', null, sp); cv.width = 1280; cv.height = 720;
    Object.assign(cv.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const tag = el('div', null, sp);   // 이름표(tag-tr): 오른쪽 위, 거의 직각, 왼쪽 3px 강조 줄
    Object.assign(tag.style, { position: 'absolute', right: '16px', top: '12px', padding: '6px 12px 6px 11px', borderRadius: '2px', background: PAL.surface, borderLeft: `3px solid ${PAL.accent}`, boxShadow: `0 3px 10px rgba(0,0,0,.35), inset 0 0 0 1px ${PAL.line}`, font: `600 12px/1.2 ${SANS}`, color: PAL.ink, whiteSpace: 'nowrap' });
    return { cv, ctx: cv.getContext('2d', { willReadFrequently: true }), tag };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 0 : (lv == null ? 3 : lv);
    const x = s.ctx;
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.setLineDash([]); x.shadowBlur = 0;
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.05;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();
    T(x, '위쪽 35% 영역만 잘라서 본다', 30, 40, 11.5, PAL.muted, 500, 'left', MONO);

    const scan = L === 1 ? E.inOutC(seg(t, 0.15, 1.1)) : 1;
    ['day', 'night'].forEach((kind, i) => {
      const X = CX[i], Y = CY0, name = kind === 'day' ? '낮 장면' : '밤 장면';
      [1, 2, 3, 4].forEach((q) => { x.fillStyle = 'rgba(0,0,0,.14)'; rr(x, X - q, Y + q, CW + q * 2, CH + q, 8 + q); x.fill(); });
      scene(x, X, Y, kind);
      const m = measure(x, X, Y);       // 글자를 얹기 전에 읽는다
      const ink = m.gray >= THRESH ? DARK : WHITE;
      const sw = L >= 2 ? E.inOutC(seg(t, 0.12, 0.85)) : 0;
      const col = mix(DARK, ink, sw);
      x.save(); rr(x, X, Y, CW, CH, 8); x.clip();
      x.font = `52px ${HAN}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = rgb(col);
      x.fillText(WORD, X + CW / 2, Y + CH / 2 + 2);
      if (L === 1 && scan < 1) { x.fillStyle = 'rgba(255,179,107,.16)'; x.fillRect(X, Y, CW * scan, CH); x.fillStyle = PAL.accent; x.fillRect(X + CW * scan - 1, Y, 2, CH); }
      x.restore();
      x.strokeStyle = L >= 1 ? PAL.accent : 'rgba(244,239,228,.28)'; x.lineWidth = L >= 1 ? 1.5 : 1; rr(x, X + 0.5, Y + 0.5, CW - 1, CH - 1, 8); x.stroke();

      const by = Y + CH;
      T(x, name, X, by + 20, 13, PAL.ink, 600);
      if (L === 0) T(x, '먹색 고정', X + CW, by + 20, 12, PAL.muted, 500, 'right', MONO);
      if (L === 0 && i === 1) T(x, '‘위쪽은 늘 밝다’고 보고 먹색으로 정해 둔 경우', 320, 296, 12.5, PAL.muted, 500, 'center');
      if (L >= 1) T(x, `평균 ${Math.round(m.gray * scan)}`, X + CW, by + 21, 15, PAL.accent2, 700, 'right', MONO);
      if (L >= 1) {   // 0~255 막대와 평균 위치
        const gy = by + 30, gg = x.createLinearGradient(X, 0, X + CW, 0); gg.addColorStop(0, '#000'); gg.addColorStop(1, '#fff');
        x.fillStyle = gg; rr(x, X, gy, CW, 8, 4); x.fill(); x.strokeStyle = PAL.line; x.lineWidth = 1; rr(x, X + 0.5, gy + 0.5, CW - 1, 7, 4); x.stroke();
        const mx = X + CW * (m.gray * scan) / 255;
        x.fillStyle = PAL.accent; x.beginPath(); x.moveTo(mx - 5, gy + 16); x.lineTo(mx + 5, gy + 16); x.lineTo(mx, gy + 9); x.closePath(); x.fill();
        if (L >= 2) {
          const tx = X + CW * THRESH / 255; x.fillStyle = PAL.ink; x.fillRect(tx - 1, gy - 4, 2, 16);
          T(x, `기준 ${THRESH}`, Math.min(tx, X + CW - 30), gy + 28, 10.5, PAL.muted, 500, 'center', MONO);
        }
      }
      if (L >= 3) {
        const cD = ratio(DARK, m.avg), cW = ratio(WHITE, m.avg), cho = m.gray >= THRESH ? cD : cW, ok = cho >= PASS, k = E.outC(seg(t, 0.2 + i * 0.12, 0.8 + i * 0.12));
        x.save(); x.globalAlpha = k;
        T(x, `먹색 ${cD.toFixed(1)} : 1`, X, by + 84, 13, m.gray >= THRESH ? PAL.accent2 : PAL.muted, m.gray >= THRESH ? 700 : 500, 'left', MONO);
        T(x, `흰색 ${cW.toFixed(1)} : 1`, X + CW, by + 84, 13, m.gray >= THRESH ? PAL.muted : PAL.accent2, m.gray >= THRESH ? 500 : 700, 'right', MONO);
        const my = by + 103;
        x.strokeStyle = ok ? '#7fe0a8' : '#ff8a7a'; x.lineWidth = 2.4; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
        if (ok) { x.moveTo(X + 2, my); x.lineTo(X + 7, my + 5); x.lineTo(X + 16, my - 6); } else { x.moveTo(X + 3, my - 5); x.lineTo(X + 13, my + 5); x.moveTo(X + 13, my - 5); x.lineTo(X + 3, my + 5); }
        x.stroke();
        T(x, `고른 글자색 ${cho.toFixed(1)} : 1 ${ok ? '통과' : '탈락'}(기준 ${PASS})`, X + 24, my + 4, 12.5, ok ? '#7fe0a8' : '#ff8a7a', 700);
        x.restore();
      }
    });
    T(x, '그림은 코드로 그린 예시 · 평균은 회색 밝기(0~255)', 30, 350, 10.5, PAL.muted, 500, 'left', MONO);
    s.tag.textContent = `${L}  ${TAGS[L]}`;
  },
};
export default demo;
