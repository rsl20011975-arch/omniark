/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/youtube-chapter-markers/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 유튜브 챕터 표시 규칙: 설명란 시각 목록이 공식 규칙(첫 줄 0:00, 3개 이상, 오름차순, 각 10초 이상)을 지키는지
// 코드가 줄마다 판정한다. 목록은 자체 제작 한 편의 시각표(장 표지 시작 시각)에서 소수점을 버려 만든다. 화면은 시간 t 의 함수다.
const MIN_LEN = 10;        // 각 장의 최소 길이(초), 공식 규칙
const FIRST_AT = 0;        // 첫 줄의 시각(초). 규칙은 00:00
const MIN_N = 3;           // 최소 장 수, 공식 규칙
const TOTAL = 307.881;     // 영상 전체 길이(초), 시각표에서 읽은 값
const PAL = { bg0: '#0b0f1a', bg1: '#161d30', ink: '#f4efe4', muted: '#9aa3b2', accent: '#ffb36b', accent2: '#ffd27a', surface: '#131a2b', line: 'rgba(244,239,228,.16)' };
const OKC = '#8fd8a8', BADC = '#ff7a6b';
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif';

// 시각표의 장 시작 시각(초, 첫 장은 0). 장 표지 장면이 시작하는 시각
const T0 = [0, 18.05, 59.70, 150.63, 164.46, 206.72, 248.63];
const NAMES = ['들어가며', '문제 증명', '고치는 단어 5개', '복사용 5줄', '실제로 넣어 보기', '따라 하기', '팁 3개'];
// 연출 전: 손으로 적다 틀린 목록(정수 초). 첫 줄 0:05, 18에서 25는 7초, 150 다음이 140
const BAD = [5, 18, 25, 150, 140, 206];
const BAD_NAMES = ['들어가며', '문제 증명', '고치는 단어 5개', '복사용 5줄', '실제로 넣어 보기', '따라 하기'];

const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const floorList = (arr) => arr.map((v, i) => (i === 0 ? FIRST_AT : Math.floor(v)));

// 규칙 판정: 목록(정수 초)과 영상 길이를 받아 줄마다 결과를 돌려준다
function judge(stamps, total) {
  const lens = stamps.map((v, i) => (i + 1 < stamps.length ? stamps[i + 1] : total) - v);
  const r1 = stamps[0] === 0;
  const r2 = stamps.length >= MIN_N;
  const badOrder = stamps.map((v, i) => i > 0 && v <= stamps[i - 1]);
  const r3 = !badOrder.some(Boolean);
  const shortRow = lens.map((l) => l < MIN_LEN);
  const r4 = !shortRow.some(Boolean);
  return { lens, r1, r2, badOrder, r3, shortRow, r4, minLen: Math.min(...lens) };
}

let GRAIN = null;
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function card(x, X, Y, W, H) { x.fillStyle = 'rgba(0,0,0,.22)'; x.fillRect(X + 1, Y + 3, W, H); x.fillStyle = 'rgba(0,0,0,.16)'; x.fillRect(X, Y + 2, W, H); x.fillStyle = PAL.surface; x.beginPath(); x.roundRect(X, Y, W, H, 6); x.fill(); x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.roundRect(X + .5, Y + .5, W - 1, H - 1, 6); x.stroke(); }
function mark(x, cx, cy, ok) {   // 통과(체크)와 실패(가위표)를 선으로 그린다
  x.fillStyle = ok ? 'rgba(143,216,168,.18)' : 'rgba(255,122,107,.18)'; x.beginPath(); x.arc(cx, cy, 9, 0, 7); x.fill();
  x.strokeStyle = ok ? OKC : BADC; x.lineWidth = 1.9; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
  if (ok) { x.moveTo(cx - 4, cy + .2); x.lineTo(cx - 1, cy + 3.2); x.lineTo(cx + 4.4, cy - 3.2); } else { x.moveTo(cx - 3.4, cy - 3.4); x.lineTo(cx + 3.4, cy + 3.4); x.moveTo(cx + 3.4, cy - 3.4); x.lineTo(cx - 3.4, cy + 3.4); }
  x.stroke();
}

const STEP = ['첫 줄과 개수와 순서', '각 장 10초 이상', '시각표에서 뽑기'];
const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(63), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const cap = el('div', null, sp);   // 이름표: 왼쪽 아래, 배경 없음, 위에 얇은 선
    Object.assign(cap.style, { position: 'absolute', left: '24px', bottom: '10px', width: '360px', paddingTop: '.4em', borderTop: `1px solid ${PAL.line}`, font: "500 12px/1.2 'JetBrains Mono',monospace", color: PAL.muted, whiteSpace: 'nowrap', zIndex: '4' });
    return { main, cap };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 0 : (lv == null ? 3 : lv);
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'screen'; x.globalAlpha = 0.05;
    for (let g0 = 0; g0 < 640; g0 += 128) for (let g1 = 0; g1 < 360; g1 += 128) x.drawImage(GRAIN, g0, g1, 128, 128);
    x.restore();

    const stamps = L === 0 ? BAD : floorList(T0);
    const names = L === 0 ? BAD_NAMES : NAMES;
    const J = judge(stamps, TOTAL);

    T(x, '설명란 챕터 목록', 24, 30, 17, PAL.ink, 700);
    T(x, L === 0 ? '손으로 적다 틀린 목록' : '시각표에서 뽑은 목록', 24, 48, 11, PAL.muted, 500, 'left', MONO);

    // 가운데 큰 요소: 설명란 상자
    card(x, 24, 60, 372, 260);
    T(x, '설명', 40, 80, 11, PAL.muted, 600);
    [236, 196, 160].forEach((w, i) => { x.fillStyle = 'rgba(244,239,228,.13)'; x.beginPath(); x.roundRect(40, 88 + i * 11, w, 5, 2.5); x.fill(); });
    const RY0 = 140, PIT = 22;
    stamps.forEach((v, i) => {
      const Y = RY0 + i * PIT, k = E.outC(seg(t, 0.15 + i * 0.1, 0.75 + i * 0.1));
      const bad = (L === 0 && (J.badOrder[i] || J.shortRow[i] || (i === 0 && !J.r1))) || (L >= 2 && J.shortRow[i]) || (L >= 1 && i === 0 && !J.r1) || (L >= 1 && J.badOrder[i]);
      x.save(); x.globalAlpha = k;
      if (bad) { x.fillStyle = 'rgba(255,122,107,.26)'; x.fillRect(32, Y - 13, 356, 19); }
      T(x, mmss(v), 40, Y, 12, bad ? BADC : PAL.accent2, 700, 'left', MONO);
      T(x, names[i], 92, Y, 12, PAL.ink, 500);
      if (L >= 2 || L === 0) {
        const len = J.lens[i], lenTxt = len < 0 ? '역순' : `${len.toFixed(0)}초`;
        const w = Math.max(0, Math.min(len, 100)) * 0.4 * k;
        x.fillStyle = J.shortRow[i] ? BADC : 'rgba(255,179,107,.8)'; x.fillRect(262, Y - 8, w, 7);
        T(x, lenTxt, 380, Y, 11, J.shortRow[i] ? BADC : PAL.ink, 700, 'right', MONO);
      }
      x.restore();
    });
    if (L >= 3) {
      const k = E.outC(seg(t, 3.4, 4.2));
      x.save(); x.globalAlpha = k;
      T(x, J.minLen >= MIN_LEN ? `가장 짧은 장 ${J.minLen.toFixed(1)}초, 기준까지 ${(J.minLen - MIN_LEN).toFixed(1)}초 여유` : `가장 짧은 장 ${J.minLen.toFixed(1)}초, 기준에 ${(MIN_LEN - J.minLen).toFixed(1)}초 모자람`, 40, 308, 11, J.minLen >= MIN_LEN ? PAL.muted : BADC, 600);
      x.restore();
    }

    // 오른쪽: 규칙 네 줄(칸 이름과 통과·실패 표시만)
    const rules = [['첫 줄이 0:00', J.r1, 1], [`${MIN_N}개 이상`, J.r2, 1], ['오름차순', J.r3, 1], [`각 장 ${MIN_LEN}초 이상`, J.r4, 2]];
    T(x, '규칙 검사', 420, 76, 12, PAL.muted, 700);
    rules.forEach((rl, i) => {
      const Y = 104 + i * 28, seen = L === 0 || L >= rl[2], k = E.outC(seg(t, 0.9 + i * 0.12, 1.5 + i * 0.12));
      x.save(); x.globalAlpha = seen ? k : 0.4;
      if (seen) mark(x, 430, Y - 4, rl[1]);
      else { x.strokeStyle = PAL.muted; x.lineWidth = 1; x.beginPath(); x.arc(430, Y - 4, 9, 0, 7); x.stroke(); }
      T(x, rl[0], 446, Y, 12, PAL.ink, 600);
      if (!seen) T(x, '아직 안 봄', 614, Y, 10, PAL.muted, 600, 'right');
      x.restore();
    });
    const shown = rules.filter((rl) => L === 0 || L >= rl[2]), allOk = shown.every((rl) => rl[1]);
    const vk = E.outC(seg(t, 1.6, 2.2));
    x.save(); x.globalAlpha = vk;
    x.fillStyle = allOk ? 'rgba(143,216,168,.16)' : BADC; x.beginPath(); x.roundRect(420, 220, 196, 26, 5); x.fill();
    T(x, allOk ? '장으로 읽히는 목록' : '장으로 읽히지 않는 목록', 518, 238, 12, allOk ? OKC : '#1a0d0b', 700, 'center');
    x.restore();

    // 3단계: 시각표에서 뽑을 때 일어나는 일
    if (L >= 3) {
      const k = E.outC(seg(t, 3.4, 4.2));
      x.save(); x.globalAlpha = k;
      card(x, 420, 260, 196, 60);
      T(x, `${T0[2].toFixed(2)}초 → ${mmss(T0[2])} (버림)`, 432, 281, 12, PAL.accent2, 700, 'left', MONO);
      T(x, `도구가 안 세는 것: 개수`, 432, 303, 11, PAL.accent, 700);
      x.restore();
    }
    s.cap.textContent = L === 0 ? '연출 전 · 잘못된 목록' : `단계 ${L} · ${STEP[L - 1]}`;
  },
};
export default demo;
