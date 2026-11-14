/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/daily-slots-per-day/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 하루 한 번 가동해 만든 쇼츠를 공개 칸 세 개의 가장 이른 빈 칸부터 채운다. 칸이 비는 이유(가동이 늦음, 상한이 낮음)를 코드가 계산해 구분하고,
// 마지막 단계에서 제작 기록 11편의 칸별 48시간 조회(중앙값 대비 배수)를 점으로 찍어 보여 준다. 화면은 시간 t 의 함수다.
const PROD_H = 6.5;       // 가동 시각(시). 6.5 는 06:30
const DAILY_N = 3;        // 하루에 만드는 편수 상한
const ONE_PER_AUTHOR = true;   // true 면 같은 원작자는 첫 편만 센다
const PRE_PROD_H = 10, PRE_N = 2;   // 연출 전과 1단계의 값(10:00 가동, 상한 2)
const MID_N = 2;          // 2단계의 상한(가동만 06:30 으로 당긴 상태)
const SLOTS = [9.5, 12.5, 18.5];    // 공개 칸 09:30, 12:30, 18:30(한국 시각)
const PAL = { bg0: '#171615', bg1: '#232120', ink: '#f2efe9', muted: '#9a958c', accent: '#5ad1c8', accent2: '#f2b84b', surface: '#1f1d1b', line: 'rgba(242,239,233,.16)' };
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif', GRAY = '#6f6a62', REDC = '#ff8f7a';
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
// 제작 기록: 공구·자동차 공장 장부 27편 중 48시간 조회가 있는 11편. 조회는 11편 중앙값으로 나눈 배수, day 는 11월의 날짜
const DOTS = [
  { slot: 0, r: 1.00, who: 'a1', day: 3 }, { slot: 1, r: 0.72, who: 'a2', day: 3 }, { slot: 2, r: 0.00, who: 'a3', day: 6 },
  { slot: 0, r: 0.80, who: 'a1', day: 7 }, { slot: 1, r: 13.19, who: 'a3', day: 7 }, { slot: 0, r: 1.02, who: 'a2', day: 8 },
  { slot: 1, r: 21.21, who: 'a3', day: 8 }, { slot: 2, r: 0.60, who: 'a4', day: 8 }, { slot: 1, r: 3.81, who: 'a5', day: 9 },
  { slot: 2, r: 1.68, who: 'a5', day: 9 }, { slot: 0, r: 1.00, who: 'a6', day: 10 },
];
const HOT = 'a3';         // 가장 높은 두 편의 원작자
const hh = (h) => `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;
function plan(prodH, n) {   // 칸마다 상태와 이유, 편마다 들어간 칸을 계산한다
  const avail = SLOTS.map((s, i) => [s, i]).filter(([s]) => s > prodH);
  const clips = Array.from({ length: n }, (_, k) => (avail[k] ? avail[k][1] : -1));
  const slots = SLOTS.map((s, i) => {
    if (s <= prodH) return { st: 'miss', why: `가동 ${hh(prodH)} 보다 먼저 지나간다` };
    if (clips.includes(i)) return { st: 'fill', why: `편 ${clips.indexOf(i) + 1} 이 들어간다` };
    return { st: 'empty', why: `하루 상한 ${n}편이 이미 찼다` };
  });
  return { clips, slots, filled: slots.filter((q) => q.st === 'fill').length, lost: clips.filter((c) => c < 0).length };
}
function dots() {
  const first = {}; DOTS.slice().sort((p, q) => p.day - q.day).forEach((d) => { if (first[d.who] == null) first[d.who] = d; });
  return ONE_PER_AUTHOR ? DOTS.filter((d) => first[d.who] === d) : DOTS;
}
const median = (v) => { const a = v.slice().sort((p, q) => p - q), m = a.length >> 1; return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; };
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function card(x, X, Y, W, H) { x.save(); x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 10; x.shadowOffsetY = 3; x.fillStyle = PAL.surface; x.beginPath(); x.roundRect(X, Y, W, H, 6); x.fill(); x.restore(); x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.roundRect(X, Y, W, H, 6); x.stroke(); }
const P = (t, a, d) => seg(t, a, a + d);
const STEP = ['10:00 가동, 상한 2편', '가동을 06:30 으로', '상한을 3편으로', '칸별 48시간 조회'];
let GRAIN = null;

const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 4,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(63), gc = document.createElement('canvas'); gc.width = 160; gc.height = 90;
    const gx = gc.getContext('2d'), gd = gx.createImageData(160, 90);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const pill = el('div', null, sp);
    Object.assign(pill.style, { position: 'absolute', right: '12px', bottom: '8px', padding: '4px 11px', borderRadius: '999px', background: PAL.surface, color: PAL.ink, font: "600 11px 'IBM Plex Sans KR',sans-serif", border: `1px solid ${PAL.line}`, zIndex: '4', whiteSpace: 'nowrap' });
    return { main, pill };
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 4 : lv);
    t = t > 0 ? t : 0;
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'screen'; x.globalAlpha = 0.05; for (let gx0 = 0; gx0 < 640; gx0 += 160) for (let gy0 = 0; gy0 < 360; gy0 += 90) x.drawImage(GRAIN, gx0, gy0, 160, 90); x.restore();
    const prodH = L <= 1 ? PRE_PROD_H : PROD_H, n = L <= 1 ? PRE_N : L === 2 ? MID_N : DAILY_N, pl = plan(prodH, n);
    // 위: 하루 시간 축, 가동 표시, 편마다 칸으로 가는 줄
    const AX0 = 44, AX1 = 604, hx = (h) => AX0 + (h - 6) / 18 * (AX1 - AX0);
    card(x, 20, 10, 600, 124);
    T(x, '하루 한 번 가동해서 가장 이른 빈 칸에 넣는다(한국 시각)', 32, 28, 10.5, PAL.muted, 500, 'left', MONO);
    T(x, `하루 ${n}편, 채운 칸 ${pl.filled}/${SLOTS.length}`, 608, 28, 11.5, pl.filled === SLOTS.length ? PAL.accent : PAL.accent2, 700, 'right', MONO);
    x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.moveTo(AX0, 66.5); x.lineTo(AX1, 66.5); x.stroke();
    for (let h = 6; h <= 24; h += 3) { x.beginPath(); x.moveTo(hx(h), 66); x.lineTo(hx(h), 71); x.stroke(); T(x, String(h).padStart(2, '0'), hx(h), 82, 9.5, PAL.muted, 500, 'center', MONO); }
    SLOTS.forEach((sh, i) => {
      const st = pl.slots[i].st, X = hx(sh), ap = E.outC(P(t, 0.1 + i * 0.12, 0.4)); x.save(); x.globalAlpha = ap;
      T(x, hh(sh), X, 47, 10.5, st === 'miss' ? PAL.muted : PAL.ink, 700, 'center', MONO);
      x.beginPath(); x.arc(X, 58, 6, 0, 7); x.lineWidth = 2;
      if (st === 'fill') { x.fillStyle = PAL.accent; x.fill(); x.strokeStyle = PAL.accent; x.stroke(); }
      else if (st === 'empty') { x.strokeStyle = PAL.accent2; x.setLineDash([3, 2]); x.stroke(); x.setLineDash([]); }
      else { x.strokeStyle = GRAY; x.stroke(); x.beginPath(); x.moveTo(X - 4, 54); x.lineTo(X + 4, 62); x.stroke(); }
      x.restore();
    });
    const px = hx(prodH), pk = E.outC(P(t, 0.2, 0.5));
    x.save(); x.strokeStyle = PAL.ink; x.lineWidth = 1.5; x.beginPath(); x.moveTo(px, 72 + (1 - pk) * 8); x.lineTo(px, 121); x.stroke();
    x.fillStyle = PAL.ink; x.beginPath(); x.moveTo(px - 4, 72); x.lineTo(px + 4, 72); x.lineTo(px, 78); x.fill(); x.restore();
    T(x, `가동 ${hh(prodH)}`, Math.min(px + 6, 560), 130, 10, PAL.ink, 600, 'left', MONO);
    for (let k = 0; k < n; k++) {
      const c = pl.clips[k], Y = 91 + k * 10, q = E.inOutC(P(t, 0.4 + k * 0.25, 0.8));
      if (c >= 0) { const X1 = lerp(px, hx(SLOTS[c]), q); x.fillStyle = rgba('#5ad1c8', 0.9); x.beginPath(); x.roundRect(px, Y, Math.max(2, X1 - px), 7, 3); x.fill(); if (q > 0.95) T(x, `편 ${k + 1}`, hx(SLOTS[c]) + 8, Y + 7, 9, PAL.muted, 600, 'left', MONO); }
      else { x.fillStyle = rgba('#f2b84b', 0.85); x.beginPath(); x.roundRect(px, Y, 26 * q, 7, 3); x.fill(); if (q > 0.9) T(x, `편 ${k + 1}: 들어갈 칸이 없다`, px + 34, Y + 7, 9, PAL.accent2, 600, 'left', MONO); }
    }
    // 아래: 1~3단계는 칸별 상태, 4단계는 칸별 조회 점
    card(x, 20, 142, 600, 208);
    if (L <= 3) {
      T(x, '공개 칸 상태(가동 시각과 하루 상한으로 코드가 계산)', 32, 160, 10.5, PAL.muted, 500, 'left', MONO);
      const NM = { fill: '채움', empty: '비었다', miss: '지나감' }, CL = { fill: PAL.accent, empty: PAL.accent2, miss: PAL.muted };
      SLOTS.forEach((sh, i) => {
        const Y = 170 + i * 36, q = pl.slots[i], ap = E.outC(P(t, 0.3 + i * 0.2, 0.4)); x.save(); x.globalAlpha = ap; x.translate((1 - ap) * 8, 0);
        x.fillStyle = 'rgba(242,239,233,.06)'; x.beginPath(); x.roundRect(32, Y, 576, 30, 4); x.fill();
        T(x, hh(sh), 44, Y + 20, 13, PAL.ink, 700, 'left', MONO);
        x.fillStyle = q.st === 'fill' ? rgba('#5ad1c8', 0.22) : q.st === 'empty' ? rgba('#f2b84b', 0.22) : rgba('#9a958c', 0.2); x.beginPath(); x.roundRect(110, Y + 6, 58, 18, 9); x.fill();
        T(x, NM[q.st], 139, Y + 19, 11, CL[q.st], 700, 'center');
        T(x, q.why, 184, Y + 20, 11.5, PAL.ink, 500); x.restore();
      });
      const NOTE = [
        ['10:00 에 가동하면 09:30 칸은 그날 이미 지나가 있고, 상한이 2편이라 소재가 있어도 칸이 남는다.', '[기록] 2026-11-10 기록에서는 하루 0~2편이던 것이 소재가 아니라 상한 2가 막은 것이었다(미시도 후보 32개).'],
        ['가동을 06:30 으로 당기면 09:30 칸이 열린다. 상한 2는 그대로라 18:30 칸이 비었다.', '[기록] 가동 시각과 상한은 따로 고치는 값이다. 한쪽만 고치면 다른 쪽이 칸을 막는다.'],
        ['상한을 3편으로 올려 칸 3개를 모두 쓴다. 오늘 장부에 이미 3편이 있으면 그날 실행은 만들지 않고 끝난다.', '[지시] 2026-11-10 제작자 지시. 하루 3편이 시청 성과에 더 낫다는 증거는 아직 없다.'],
      ][L - 1];
      T(x, NOTE[0], 32, 296, 11, PAL.ink, 500); T(x, NOTE[1], 32, 316, 10.5, PAL.muted, 500);
    } else {
      const ds = dots(), PX0 = 62, PY0 = 166, PY1 = 316, ly = (v) => PY1 - Math.log(Math.max(v, 0.4) / 0.4) / Math.log(30 / 0.4) * (PY1 - PY0);
      T(x, '칸별 48시간 조회, 같은 표본 중앙값 대비 배수(로그 축)', 32, 160, 10.5, PAL.muted, 500, 'left', MONO);
      [0.5, 1, 2, 5, 10, 20].forEach((v) => { x.strokeStyle = v === 1 ? 'rgba(242,239,233,.34)' : PAL.line; x.setLineDash(v === 1 ? [] : [2, 3]); x.beginPath(); x.moveTo(PX0, ly(v) + 0.5); x.lineTo(420, ly(v) + 0.5); x.stroke(); x.setLineDash([]); T(x, String(v), PX0 - 6, ly(v) + 3, 9.5, PAL.muted, 500, 'right', MONO); });
      T(x, '0', PX0 - 6, PY1 + 6, 9.5, PAL.muted, 500, 'right', MONO);
      const meds = [];
      SLOTS.forEach((sh, i) => {
        const cx = 130 + i * 118, mine = ds.filter((d) => d.slot === i), md = mine.length ? median(mine.map((d) => d.r)) : 0; meds.push(md);
        const bh = Math.max(1, PY1 - ly(md)) * E.outC(P(t, 0.3 + i * 0.2, 0.6));
        x.fillStyle = rgba('#5ad1c8', 0.34); x.fillRect(cx - 34, PY1 - bh, 68, bh); x.strokeStyle = PAL.accent; x.lineWidth = 1.6; x.beginPath(); x.moveTo(cx - 34, PY1 - bh); x.lineTo(cx + 34, PY1 - bh); x.stroke();
        mine.forEach((d, j) => {
          const dx = cx + (j - (mine.length - 1) / 2) * 15, ap = E.outC(P(t, 0.8 + (i * 4 + j) * 0.06, 0.4)), Y = d.r <= 0 ? PY1 + 4 : ly(d.r);
          x.save(); x.globalAlpha = ap; x.lineWidth = 2; x.beginPath(); x.arc(dx, Y, 5, 0, 7);
          if (d.r <= 0) { x.strokeStyle = PAL.ink; x.stroke(); } else { x.fillStyle = d.who === HOT ? PAL.accent2 : PAL.ink; x.fill(); }
          x.restore();
        });
        T(x, hh(sh), cx, 338, 11, PAL.ink, 700, 'center', MONO); T(x, `${mine.length}편`, cx, 349, 9.5, PAL.muted, 500, 'center', MONO);
      });
      T(x, `점 ${ds.length}개`, 424, 166, 11, PAL.ink, 700, 'left', MONO);
      ['막대 = 칸의 중앙값', ...SLOTS.map((sh, i) => `${hh(sh)} 중앙 ${meds[i].toFixed(2)}배`)].forEach((l, i) => T(x, l, 424, 184 + i * 15, 10.5, i ? PAL.ink : PAL.muted, i ? 600 : 500, 'left', i ? MONO : SANS));
      [['주황 점은 같은 원작자의 편이고', PAL.accent2], ['가장 높은 두 편이 둘 다 12:30 이다.', PAL.accent2], ['칸의 효과와 소재의 효과를 가를 수 없다.', PAL.ink], ['속 빈 점은 조회 0으로 기록된 1편.', PAL.muted], ['[측정] 표본 11편, 참고치', PAL.muted]].forEach(([l, c], i) => T(x, l, 424, 252 + i * 16, 10.5, c, i === 2 ? 700 : 500));
    }
    s.pill.textContent = `${Math.max(1, L)}. ${STEP[Math.max(1, L) - 1]}`;
  },
};
export default demo;
