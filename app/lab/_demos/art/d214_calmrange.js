/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/speech-rate-cps/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 쇼츠 해설 8줄을 녹음했다고 가정하고, 줄마다 글자 수 ÷ 말한 초(자/초)를 코드가 직접 계산한다.
// 1단계 = 지시 없이 녹음한 그대로, 2단계 = 녹음 지시를 붙임, 3단계 = 줄마다 배속을 목표 범위에 맞춤. 화면은 시간 t 의 함수다.
const LO = 5.3, HI = 6.0;   // 목표 범위(자/초): 공용 코드 값. 아래 한도 때문에 범위 밖에 남는 줄이 생긴다
const NOTE_MIN = 20;        // 녹음 지시를 붙이는 줄의 최소 글자 수(짧은 줄은 지시문을 읽을 위험이 있어 안 붙인다)
const SLOWER = 1.0;         // 마지막에 전체에 곱하는 배속(공구·차 공장은 0.94)
const NAT = 4.3, FAST = 8.61;   // 지시 없는 원음 속도, 지시를 붙인 원음 속도(자/초). 이 데모가 정한 가정값
const MIN_T = 0.85, MAX_T = 1.45;   // 줄마다 걸 수 있는 배속 한도
const BREATH = 0.45;        // 줄마다 앞뒤 숨(0.15 + 0.3초)
const WALL = [15, 50];      // 편 길이 벽(초)
const PAL = { bg0: '#1b0e17', bg1: '#2b1424', ink: '#f6e9ee', muted: '#b095a3', accent: '#ff7aa8', accent2: '#ffd0a0', surface: '#26121f', line: 'rgba(246,233,238,.16)' };
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif';
const TEXTS = [
  '샌더 버리기 전에 이것부터 보세요',
  '전원 스위치를 눌러도 반응이 없다면 먼지가 범인일 수 있습니다',
  '집진 구멍 안쪽에 쌓인 톱밥이 모터를 막고 있었던 겁니다',
  '고무 링을 빼면 바로 보입니다',
  '솔로 안쪽까지 털어 내고 다시 끼우면 됩니다',
  '이 과정은 십 초면 끝나고 비용은 들지 않습니다',
  '버리기 전에 이 부분만 확인해 보세요',
  '먼지 구멍이 막혀 있는지 보는 것이 첫 번째입니다',
];
const units = (s) => s.replace(/[^가-힣A-Za-z0-9]/g, '').length;   // 공백과 문장부호를 뺀 글자 수
const N = TEXTS.map(units);
const F = (() => { const r = rng(14); return TEXTS.map(() => 0.9 + 0.2 * r()); })();   // 줄마다 원음 속도가 조금씩 다르다(±10%)

function lineAt(i, L) {      // 줄 i 의 길이와 속도: L=1 지시 없음, 2 지시 붙임, 3 배속 맞춤
  const noted = L >= 2 && N[i] >= NOTE_MIN, raw = (noted ? FAST : NAT) * F[i];
  let sec = N[i] / raw, tempo = 1;
  if (L >= 3) {
    if (raw < LO) tempo = Math.min(MAX_T, LO / raw); else if (raw > HI) tempo = Math.max(MIN_T, HI / raw);
    sec = sec / tempo / SLOWER;
  }
  const cps = N[i] / sec, clamped = L >= 3 && (tempo === MAX_T || tempo === MIN_T);
  return { n: N[i], sec, cps, tempo, noted, clamped, ok: cps >= LO - 0.005 && cps <= HI + 0.005 };
}
function sumAt(L) {
  const ls = TEXTS.map((_, i) => lineAt(i, L)), chars = ls.reduce((s, l) => s + l.n, 0), talk = ls.reduce((s, l) => s + l.sec, 0);
  return { ls, cps: chars / talk, total: talk + BREATH * ls.length, okN: ls.filter((l) => l.ok).length, clampN: ls.filter((l) => l.clamped).length };
}

function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function card(x, X, Y, W, H) { x.fillStyle = PAL.surface; x.beginPath(); x.roundRect(X, Y, W, H, 6); x.fill(); x.strokeStyle = PAL.line; x.lineWidth = 1; x.stroke(); }
function tri(x, X, Y, up, col) { x.fillStyle = col; x.beginPath(); if (up) { x.moveTo(X - 3.5, Y + 3); x.lineTo(X + 3.5, Y + 3); x.lineTo(X, Y - 3); } else { x.moveTo(X - 3.5, Y - 3); x.lineTo(X + 3.5, Y - 3); x.lineTo(X, Y + 3); } x.fill(); }
let GRAIN = null;

const STEP = ['지시 없이 녹음한 그대로', '녹음 지시를 붙임', '줄마다 배속 맞춤'];
const demo = {
  dur: 4.2, rest: 4.2, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(33), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const lab = el('div', null, sp);   // 이름표(caption-bl): 왼쪽 아래, 배경 없음, 위에 얇은 선
    Object.assign(lab.style, { position: 'absolute', left: '24px', bottom: '10px', width: '372px', borderTop: `1px solid ${PAL.line}`, paddingTop: '10px', zIndex: '4' });
    const pill = el('span', null, lab);
    Object.assign(pill.style, { color: PAL.muted, font: "500 12px/1 'JetBrains Mono',monospace" });
    return { main, pill };
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 3 : lv), S = sumAt(L), x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.1;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();
    // 왼쪽: 줄마다 길이 막대(이 화면의 주인공)
    T(x, '같은 대본 8줄, 줄마다 말한 시간', 24, 26, 12, PAL.muted, 500, 'left', MONO);
    const BX = 138, PX = 16;   // 막대 시작 x, 1초당 px
    S.ls.forEach((l, i) => {
      const Y = 36 + i * 31, p = E.outC(seg(t, 0.15 + i * 0.07, 0.95 + i * 0.07)), col = l.ok ? PAL.accent2 : PAL.accent;
      card(x, 24, Y, 400, 26);
      T(x, String(i + 1), 34, Y + 17.5, 11, PAL.muted, 500, 'left', MONO);
      T(x, TEXTS[i].slice(0, 7) + '…', 50, Y + 17.5, 11.5, PAL.ink, 500);
      x.fillStyle = col; x.globalAlpha = 0.22 + 0.78 * p; x.beginPath(); x.roundRect(BX, Y + 6, Math.max(2, l.sec * PX * p), 14, 3); x.fill(); x.globalAlpha = 1;
      x.fillStyle = PAL.bg0; x.globalAlpha = 0.5 * p;    // 글자 하나마다 눈금: 촘촘할수록 빠르다
      for (let k = 1; k < l.n; k++) x.fillRect(BX + (k / l.n) * l.sec * PX * p, Y + 6, 0.8, 14);
      x.globalAlpha = 1;
      if (l.noted) { x.strokeStyle = PAL.ink; x.lineWidth = 1.4; x.beginPath(); x.arc(BX - 9, Y + 13, 3, 0, 7); x.stroke(); }
      const q = seg(t, 0.8 + i * 0.07, 1.2 + i * 0.07);
      x.globalAlpha = q;
      T(x, `${l.n}자 ${l.sec.toFixed(1)}초`, 338, Y + 17.5, 11, PAL.muted, 500, 'right', MONO);
      T(x, l.cps.toFixed(1), 384, Y + 18, 14, col, 700, 'right', MONO);
      if (!l.ok) tri(x, 406, Y + 13, l.cps > HI, PAL.accent);
      x.globalAlpha = 1;
    });
    T(x, '○ 녹음 지시를 붙인 줄, 삼각형 = 범위 밖(위쪽은 너무 빠름)', 24, 300, 10.5, PAL.muted, 500);
    T(x, '막대 눈금 하나 = 글자 하나. 속도 = 글자 수 ÷ 말한 초', 24, 315, 10.5, PAL.muted, 500);
    // 오른쪽: 큰 숫자 셋(전체 속도, 편 길이, 목표 범위 안인 줄)과 눈금 둘
    const RX = 440, RW = 188, ap = seg(t, 0.9, 1.7), g0 = RX, gw = RW, gv = (v) => g0 + (v - 3) / 7 * gw;
    x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.moveTo(RX, 122.5); x.lineTo(RX + RW, 122.5); x.moveTo(RX, 222.5); x.lineTo(RX + RW, 222.5); x.stroke();
    T(x, '전체 속도(자/초)', RX, 40, 12, PAL.ink, 600);
    T(x, S.cps.toFixed(2), RX + RW, 62, 30, S.cps >= LO - 0.005 && S.cps <= HI + 0.005 ? PAL.accent2 : PAL.accent, 700, 'right', MONO);
    const gy = 90;
    x.fillStyle = 'rgba(246,233,238,.12)'; x.beginPath(); x.roundRect(g0, gy, gw, 8, 3); x.fill();
    x.fillStyle = PAL.accent2; x.globalAlpha = 0.45; x.fillRect(gv(LO), gy, gv(HI) - gv(LO), 8); x.globalAlpha = 1;
    [4.82, 5.99].forEach((v) => { x.strokeStyle = PAL.muted; x.lineWidth = 1; x.beginPath(); x.moveTo(gv(v), gy - 3); x.lineTo(gv(v), gy + 11); x.stroke(); T(x, v.toFixed(2), gv(v), gy + 25, 10, PAL.muted, 500, 'center', MONO); });
    const mk = gv(Math.max(3, Math.min(10, lerp(3, S.cps, E.outC(ap))))); x.fillStyle = PAL.ink; x.beginPath(); x.roundRect(mk - 1.5, gy - 6, 3, 20, 1.5); x.fill();
    T(x, '띠 = 목표 범위, 눈금 = 낭독 연구 값', RX, 78, 10.5, PAL.muted, 500);
    T(x, '편 길이(초)', RX, 142, 12, PAL.ink, 600);
    const inWall = S.total >= WALL[0] && S.total <= WALL[1];
    T(x, S.total.toFixed(1), RX + RW, 168, 30, inWall ? PAL.accent2 : PAL.accent, 700, 'right', MONO);
    const wy = 184, wv = (v) => g0 + v / 60 * gw;
    x.fillStyle = 'rgba(246,233,238,.12)'; x.beginPath(); x.roundRect(g0, wy, gw, 8, 3); x.fill();
    x.fillStyle = inWall ? PAL.accent2 : PAL.accent; x.beginPath(); x.roundRect(g0, wy, Math.max(3, (wv(S.total) - g0) * E.outC(ap)), 8, 3); x.fill();
    WALL.forEach((v) => { x.strokeStyle = PAL.ink; x.lineWidth = 1.4; x.beginPath(); x.moveTo(wv(v), wy - 4); x.lineTo(wv(v), wy + 12); x.stroke(); T(x, String(v), wv(v), wy + 25, 10, PAL.muted, 500, 'center', MONO); });
    T(x, '목표 범위 안인 줄', RX, 242, 12, PAL.ink, 600);
    T(x, `${S.okN} / ${S.ls.length}`, RX + RW, 268, 30, S.okN === S.ls.length ? PAL.accent2 : PAL.accent, 700, 'right', MONO);
    T(x, L >= 3 ? `배속 한도(${MIN_T}~${MAX_T})에 막힌 줄 ${S.clampN}` : `범위 ${LO}~${HI}자/초`, RX, 290, 10.5, PAL.muted, 500);
    T(x, '원음 속도와 길이는 가정값이다', RX, 312, 10.5, PAL.muted, 500);
    s.pill.textContent = `0${L}  ${STEP[L - 1]}`;
  },
};
demo.calc = sumAt;
export default demo;
