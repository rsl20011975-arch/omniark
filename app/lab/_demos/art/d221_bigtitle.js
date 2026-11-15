/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/type-scale-values/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 앱 화면 한 장의 글자 크기 여섯 개를 (1) 마음대로 쓴 값 (2) 가까운 칸으로 옮긴 값 (3) 역할마다 칸 하나로 고정한 값으로 바꾸고,
// 칸 밖 개수와 서로 다른 크기 개수, 다섯 곳 눈금의 겹침을 코드가 그 자리에서 센다. 화면은 시간 t 의 함수다.
const R_TITLE = 48;       // 3단계 역할 크기: 제목(px)
const R_SUB = 20;         // 3단계 역할 크기: 부제(px)
const R_BODY = 16;        // 3단계 역할 크기: 본문 두 줄(px)
const R_META = 14;        // 3단계 역할 크기: 보조(px)
const R_BTN = 14;         // 3단계 역할 크기: 버튼 글자(px)
const SNAP_AT = 0.6, SNAP_LEN = 1.0;    // 2단계: 가까운 칸으로 옮기기 시작(초), 걸리는 시간(초)
const ROLE_AT = 3.2, ROLE_LEN = 0.8;    // 3단계: 역할 크기로 고정하기 시작(초), 걸리는 시간(초)
const RAW = [38, 22, 17, 15, 13, 11];   // 마음대로 쓴 크기: 제목, 부제, 본문 1, 본문 2, 보조, 버튼
const SCALE = [12, 14, 16, 20, 24, 32, 48, 64];   // 기준 문서의 글자 크기 칸 [기록]
const PAL = { bg0: '#1b0e17', bg1: '#2b1424', ink: '#f6e9ee', muted: '#b095a3', accent: '#ff7aa8', accent2: '#ffd0a0', surface: '#26121f', line: 'rgba(246,233,238,.18)' };
const SCREEN = '#2e1a29';
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif', HAN = '"Black Han Sans", sans-serif';
const SRC = [   // 값이 적힌 곳, 근거 등급, 값(px)
  { n: '기준 문서', g: '기록', v: [12, 14, 16, 20, 24, 32, 48, 64] },
  { n: '배포용 CSS', g: '기록', v: [12, 14, 16, 20, 24, 32, 48] },
  { n: '옛 복사본', g: '기록', v: [14, 16, 18, 22, 26, 34, 50] },
  { n: 'Material 3', g: '공식', v: [11, 12, 14, 16, 22, 24, 28, 32, 36, 45, 57] },   // rem 값 × 16
  { n: 'Tailwind', g: '공식', v: [12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72, 96, 128] },
];
const CSSM = [   // 2026-11-14 에 센 값: font-size 를 px 로 글자 그대로 적은 선언 수, 그중 칸 안인 수
  ['이 사이트 틀', 16, 16], ['제작물 A 배포용', 31, 12], ['제작물 A 옛 복사본', 41, 13], ['제작물 B', 305, 81], ['제작물 C', 39, 16],
];
const LINES = [['내 일정', 700, 1.2], ['11월 14일', 500, 1.35], ['3시 디자인 점검', 400, 1.5], ['5시 배포 확인', 400, 1.5], ['동기화 2분 전', 400, 1.4], ['일정 추가', 700, 1]];
const AX0 = 10, AX1 = 64;   // 눈금 축(px, 로그)

const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const snap = (v) => { let b = SCALE[0], bd = 1e9; SCALE.forEach((s) => { const d = Math.abs(v - s); if (d < bd || (d === bd && s > b)) { b = s; bd = d; } }); return b; };
const SNAPPED = RAW.map(snap);
const ROLES = [R_TITLE, R_SUB, R_BODY, R_BODY, R_META, R_BTN];
const common = SRC.reduce((a, s) => a.filter((v) => s.v.includes(v)), SRC[0].v);   // 다섯 곳이 모두 가진 값

function sizesAt(t, L) {      // 시각 t, 단계 L 의 글자 크기 여섯 개
  let a = RAW;
  if (L >= 2) { const p = E.outC(seg(t, SNAP_AT, SNAP_AT + SNAP_LEN)); a = RAW.map((v, i) => lerp(v, SNAPPED[i], p)); }
  if (L >= 3) { const p = E.outC(seg(t, ROLE_AT, ROLE_AT + ROLE_LEN)); a = a.map((v, i) => lerp(v, ROLES[i], p)); }
  return a;
}
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function rr(x, X, Y, W, H, r) { x.beginPath(); x.roundRect(X, Y, W, H, r); }
function card(x, X, Y, W, H) {
  x.save(); x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 10; x.shadowOffsetY = 2; rr(x, X, Y, W, H, 10); x.fillStyle = PAL.surface; x.fill(); x.restore();
  rr(x, X, Y, W, H, 10); x.strokeStyle = PAL.line; x.lineWidth = 1; x.stroke();
}
const ax = (v, X0, W) => X0 + (Math.log(v) - Math.log(AX0)) / (Math.log(AX1) - Math.log(AX0)) * W;
let GRAIN = null;

function phone(x, sz) {
  const PX = 24, PY = 58, PW = 232, PH = 296;
  x.save(); x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = 30; x.shadowOffsetY = 12; rr(x, PX, PY, PW, PH + 30, 28); x.fillStyle = '#3a2433'; x.fill(); x.restore();
  x.save(); x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 5; x.shadowOffsetY = 1; rr(x, PX, PY, PW, PH + 30, 28); x.fillStyle = '#3a2433'; x.fill(); x.restore();
  const hl = x.createLinearGradient(PX, PY, PX, PY + 40); hl.addColorStop(0, 'rgba(255,255,255,.14)'); hl.addColorStop(1, 'rgba(255,255,255,0)');
  rr(x, PX, PY, PW, 40, 28); x.fillStyle = hl; x.fill();
  const SX = PX + 8, SY = PY + 8, SW = PW - 16, SH = PH - 8;
  rr(x, SX, SY, SW, SH + 30, 21); x.fillStyle = SCREEN; x.fill();
  x.save(); rr(x, SX, SY, SW, SH, 21); x.clip();
  rr(x, SX + SW / 2 - 28, SY + 7, 56, 6, 3); x.fillStyle = 'rgba(246,233,238,.14)'; x.fill();   // 상단 홈 표시 막대
  const lh = sz.map((s, i) => s * LINES[i][2]);
  let y = SY + 30; const L = SX + 16, R = SX + SW - 12;
  const base = (i) => y + lh[i] * 0.5 + sz[i] * 0.36;
  const tag = (i) => {   // 줄 오른쪽에 지금 크기와 칸 안/밖 표시
    const v = Math.round(sz[i]), inn = SCALE.includes(v), by = base(i);
    T(x, String(v), R, by, 10, inn ? PAL.accent : PAL.accent2, 700, 'right', MONO);
    if (!inn) { x.save(); x.setLineDash([2, 2]); x.strokeStyle = PAL.accent2; x.lineWidth = 1; x.beginPath(); x.moveTo(R - 13, by + 3); x.lineTo(R, by + 3); x.stroke(); x.restore(); }
  };
  [0, 1, 2, 3, 4].forEach((i) => {
    T(x, LINES[i][0], L, base(i), sz[i], i === 4 ? PAL.muted : PAL.ink, LINES[i][1]); tag(i);
    y += lh[i] + [4, 12, 0, 12, 20][i];
  });
  const bh = Math.round(sz[5] * 1.4) + 16, bw = 112;
  x.save(); x.shadowColor = rgba(PAL.accent, .35); x.shadowBlur = 10; x.shadowOffsetY = 3; rr(x, L, y, bw, bh, 10); x.fillStyle = PAL.accent; x.fill(); x.restore();
  T(x, LINES[5][0], L + bw / 2, y + bh / 2 + sz[5] * 0.36, sz[5], PAL.bg0, 700, 'center');
  const by = y + bh / 2 + sz[5] * 0.36, v5 = Math.round(sz[5]), in5 = SCALE.includes(v5);
  T(x, String(v5), R, by, 10, in5 ? PAL.accent : PAL.accent2, 700, 'right', MONO);
  if (!in5) { x.save(); x.setLineDash([2, 2]); x.strokeStyle = PAL.accent2; x.beginPath(); x.moveTo(R - 13, by + 3); x.lineTo(R, by + 3); x.stroke(); x.restore(); }
  x.restore();
}

function readout(x, sz) {   // 위쪽 한 줄: 이 화면에서 코드가 센 세 값
  const r = sz.map(Math.round), kinds = new Set(r).size, inn = r.filter((v) => SCALE.includes(v)).length, out = r.length - inn;
  [['서로 다른 크기', kinds, '가지', PAL.ink], ['칸 안', inn, '개', PAL.accent], ['칸 밖', out, '개', out ? PAL.accent2 : PAL.accent]].forEach(([n, v, u, c], i) => {
    const X = 288 + i * 112;
    T(x, n, X, 34, 12, PAL.muted, 600);
    T(x, String(v), X, 66, 30, c, 700, 'left', MONO);
    T(x, u, X + (String(v).length > 1 ? 40 : 22), 66, 12, PAL.muted, 500);
  });
}
const CX = 276, CY = 80, CW = 344, CH = 264;   // 오른쪽 큰 칸

function barsCard(x) {   // 1단계: 실제 CSS 에서 센 칸 안 비율
  card(x, CX, CY, CW, CH);
  T(x, '실제 CSS 에서 센 칸 안 비율', 288, 104, 12, PAL.ink, 600);
  CSSM.forEach(([n, tot, inn], i) => {
    const Y = 120 + i * 39, f = inn / tot;
    T(x, n, 288, Y + 14, 11, PAL.ink, 500);
    rr(x, 410, Y + 4, 120, 12, 4); x.fillStyle = 'rgba(246,233,238,.1)'; x.fill();
    rr(x, 410, Y + 4, Math.max(3, 120 * f), 12, 4); x.fillStyle = f > 0.95 ? PAL.accent : PAL.accent2; x.fill();
    T(x, `${inn}/${tot}`, 612, Y + 14, 11, PAL.ink, 700, 'right', MONO);
    T(x, `${(f * 100).toFixed(0)}%`, 566, Y + 14, 11, PAL.muted, 500, 'right', MONO);
  });
  T(x, 'px 로 글자 그대로 적은 선언만 셈, var() 로 쓴 것은 제외', 288, 334, 10, PAL.muted, 500);
}
function ladderTicks(x, vals, X0, W, Y, col, h) {
  vals.forEach((v) => { if (v < AX0 || v > AX1) return; rr(x, ax(v, X0, W) - 1, Y - h, 2, h, 1); x.fillStyle = col; x.fill(); });
  if (vals.some((v) => v > AX1)) { const X = X0 + W + 6; x.strokeStyle = col; x.lineWidth = 1.5; x.beginPath(); x.moveTo(X, Y - h / 2 - 3); x.lineTo(X + 4, Y - h / 2); x.lineTo(X, Y - h / 2 + 3); x.stroke(); }
}
function scaleCard(x, sz, al) {   // 2단계: 칸 여덟 개 눈금과 지금 크기 표시
  x.save(); x.globalAlpha = al; card(x, CX, CY, CW, CH);
  T(x, '칸 눈금과 이 화면의 글자 크기(로그 축)', 288, 104, 12, PAL.ink, 600);
  const X0 = 296, W = 296, Y = 262;
  x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.moveTo(X0 - 6, Y + 0.5); x.lineTo(X0 + W + 6, Y + 0.5); x.stroke();
  SCALE.forEach((v) => { rr(x, ax(v, X0, W) - 1.5, Y - 30, 3, 30, 1.5); x.fillStyle = 'rgba(246,233,238,.55)'; x.fill(); T(x, String(v), ax(v, X0, W), Y + 18, 11, PAL.ink, 600, 'center', MONO); });
  sz.forEach((v, i) => {
    const X = ax(Math.max(AX0, Math.min(AX1, v)), X0, W), inn = SCALE.includes(Math.round(v)), c = inn ? PAL.accent : PAL.accent2, Yt = Y - 40 - (i % 3) * 16;
    x.fillStyle = c; x.beginPath(); x.moveTo(X - 5, Yt - 9); x.lineTo(X + 5, Yt - 9); x.lineTo(X, Yt); x.closePath(); x.fill();
    x.strokeStyle = rgba(c, .5); x.lineWidth = 1; x.beginPath(); x.moveTo(X, Yt); x.lineTo(X, Y - 31); x.stroke();
  });
  T(x, '삼각형 = 이 화면의 글자 줄, 칸 위에 앉으면 분홍, 칸 사이에 뜨면 살구색', 288, 334, 10, PAL.muted, 500);
  x.restore();
}
function fiveCard(x, t, al) {   // 3단계: 다섯 곳 눈금 겹치기
  x.save(); x.globalAlpha = al; card(x, CX, CY, CW, CH);
  T(x, '다섯 곳의 글자 크기 눈금(로그 축)', 288, 104, 12, PAL.ink, 600);
  const X0 = 392, W = 212, Y0 = 138, RH = 32;
  common.forEach((v) => { rr(x, ax(v, X0, W) - 7, Y0 - 4, 14, SRC.length * RH, 4); x.fillStyle = rgba(PAL.accent, .16); x.fill(); T(x, String(v), ax(v, X0, W), Y0 - 9, 10, PAL.accent, 700, 'center', MONO); });
  SRC.forEach((s, i) => {
    const Y = Y0 + i * RH, p = E.outC(seg(t, 3.9 + i * 0.14, 4.5 + i * 0.14));
    x.save(); x.globalAlpha = al * p; x.translate(0, (1 - p) * 6);
    T(x, s.n, 288, Y + 16, 11, PAL.ink, 600); T(x, s.g, 382, Y + 16, 10, PAL.muted, 600, 'right');
    x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.moveTo(X0, Y + 24.5); x.lineTo(X0 + W, Y + 24.5); x.stroke();
    ladderTicks(x, s.v, X0, W, Y + 24, s.v.some((v) => common.includes(v)) ? PAL.ink : PAL.muted, 16);
    x.restore();
  });
  const pf = E.outC(seg(t, 4.9, 5.4));
  x.save(); x.globalAlpha = al * pf;
  T(x, `다섯 곳이 모두 가진 값: ${common.join(', ')} (${common.length}개)`, 288, 318, 12, PAL.ink, 700);
  T(x, '분홍 띠가 그 자리, 128 까지 있는 Tailwind 는 오른쪽 화살표로 줄였다', 288, 335, 10, PAL.muted, 500);
  x.restore(); x.restore();
}

const STEP = ['마음대로 쓴 크기', '가까운 칸으로 옮기기', '역할마다 칸 하나'];
const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(33), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const lab = el('div', null, sp);   // 이름표(numeral): 왼쪽 위 큰 숫자와 옆의 설명
    Object.assign(lab.style, { position: 'absolute', left: '22px', top: '10px', display: 'flex', alignItems: 'center', gap: '10px', zIndex: '4' });
    const num = el('span', null, lab), txt = el('span', null, lab);
    Object.assign(num.style, { font: "400 40px/1 'Black Han Sans',sans-serif", color: PAL.accent });
    Object.assign(txt.style, { font: "500 13px/1.2 'IBM Plex Sans KR',sans-serif", color: PAL.ink, whiteSpace: 'nowrap' });
    return { main, num, txt };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 1 : (lv == null ? 3 : lv), x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.08;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();
    const sz = sizesAt(t, L);
    phone(x, sz); readout(x, sz);
    if (L === 1) barsCard(x);
    else if (L === 2) scaleCard(x, sz, 1);
    else { const k = E.inOutC(seg(t, 3.6, 4.1)); if (k < 1) scaleCard(x, sz, 1 - k); if (k > 0) fiveCard(x, t, k); }
    s.num.textContent = '0' + L; s.txt.textContent = STEP[L - 1];
  },
};
export default demo;
