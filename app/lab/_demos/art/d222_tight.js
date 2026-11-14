/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/spacing-scale-4px/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 카드 한 장의 간격 여섯 개(안쪽 여백 1, 요소 사이 5)를 (1) 마음대로 쓴 값 (2) 가까운 칸으로 옮긴 값 (3) 묶음 안과 묶음 사이 관계로 정한 값으로 바꾸고,
// 4의 배수가 아닌 개수와 묶음 간격 비율, 여러 곳의 눈금 겹침을 코드가 그 자리에서 센다. 화면은 시간 t 의 함수다.
const GAP_IN = 8;         // 3단계: 한 묶음 안의 간격(px)
const GAP_OUT = 24;       // 3단계: 묶음 사이의 간격(px)
const PAD = 24;           // 3단계: 카드 안쪽 여백(px)
const SNAP_AT = 0.6, SNAP_LEN = 1.0;    // 2단계: 가까운 칸으로 옮기기 시작(초), 걸리는 시간(초)
const ROLE_AT = 3.2, ROLE_LEN = 0.8;    // 3단계: 관계로 정하기 시작(초), 걸리는 시간(초)
const RAW = [13, 6, 20, 10, 14, 7];     // 마음대로 쓴 값: 안쪽 여백, 제목~부제, 부제~목록, 목록 줄 사이 둘, 목록~버튼
const SCALE = [4, 8, 12, 16, 24, 32, 48, 64, 96];   // 기준 문서의 간격 칸 [기록]
const NAMES = ['안쪽 여백', '제목과 부제', '부제와 목록', '목록 첫째와 둘째', '목록 둘째와 셋째', '목록과 버튼'];
const PAL = { bg0: '#e6f2ec', bg1: '#d4e8de', ink: '#0f2a22', muted: '#4f6e63', accent: '#0f9d6b', accent2: '#c2410c', surface: '#f6fbf8', line: 'rgba(15,42,34,.18)' };
const OK = '#0a7550', SUNK = '#e8f2ed';
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif';
const SRC = [   // 값이 적힌 곳, 근거 등급, 값(px)
  { n: '기준 문서', g: '기록', v: [4, 8, 12, 16, 24, 32, 48, 64, 96] },
  { n: '영상 규격', g: '기록', v: [8, 16, 24, 32, 48, 64, 96, 128] },
  { n: '모바일 앱', g: '기록', v: [4, 8, 16, 24, 32] },
  { n: 'Atlassian', g: '공식', v: [2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80] },
];
const CSSM = [   // 2026-11-14 에 센 값: padding, margin, gap 에 px 로 글자 그대로 적은 값의 수, 그중 4의 배수인 수
  ['이 사이트 틀', 51, 51], ['제작물 A 배포용', 25, 12], ['제작물 A 옛 복사본', 102, 70], ['제작물 B', 728, 349], ['제작물 C', 123, 40],
];
const AXMAX = 100;
const CARD = { x: 40, y: 22, w: 240 };
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const snap = (v) => { let b = SCALE[0], bd = 1e9; SCALE.forEach((s) => { const d = Math.abs(v - s); if (d < bd || (d === bd && s > b)) { b = s; bd = d; } }); return b; };
const SNAPPED = RAW.map(snap);
const ROLES = [PAD, GAP_IN, GAP_OUT, GAP_IN, GAP_IN, GAP_OUT];
const common = SRC.reduce((a, s) => a.filter((v) => s.v.includes(v)), SRC[0].v);   // 네 곳이 모두 가진 값

function valsAt(t, L) {      // 시각 t, 단계 L 의 간격 여섯 개
  let a = RAW;
  if (L >= 2) { const p = E.outC(seg(t, SNAP_AT, SNAP_AT + SNAP_LEN)); a = RAW.map((v, i) => lerp(v, SNAPPED[i], p)); }
  if (L >= 3) { const p = E.outC(seg(t, ROLE_AT, ROLE_AT + ROLE_LEN)); a = a.map((v, i) => lerp(v, ROLES[i], p)); }
  return a;
}
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function rr(x, X, Y, W, H, r) { x.beginPath(); x.roundRect(X, Y, W, H, r); }
function panel(x, X, Y, W, H) {
  x.save(); x.shadowColor = 'rgba(15,42,34,.10)'; x.shadowBlur = 12; x.shadowOffsetY = 3; rr(x, X, Y, W, H, 10); x.fillStyle = PAL.surface; x.fill(); x.restore();
  rr(x, X, Y, W, H, 10); x.strokeStyle = PAL.line; x.lineWidth = 1; x.stroke();
}
const axl = (v, X0, W) => X0 + v / AXMAX * W;
let GRAIN = null;

function drawCard(x, v) {
  const pad = Math.round(v[0]), g = v.slice(1).map(Math.round), cx = CARD.x + pad, cw = CARD.w - 2 * pad;
  const H = { title: 24, sub: 20, row: 28, btn: 36 };
  let y = CARD.y + pad; const pos = {}; const gaps = [];
  pos.title = y; y += H.title; gaps.push([y, g[0]]); y += g[0];
  pos.sub = y; y += H.sub; gaps.push([y, g[1]]); y += g[1];
  pos.rows = [];
  for (let i = 0; i < 3; i++) { pos.rows.push(y); y += H.row; if (i < 2) { gaps.push([y, g[2 + i]]); y += g[2 + i]; } }
  gaps.push([y, g[4]]); y += g[4];
  pos.btn = y; y += H.btn;
  const cardH = y + pad - CARD.y;
  x.save(); x.shadowColor = 'rgba(15,42,34,.10)'; x.shadowBlur = 3; x.shadowOffsetY = 1; rr(x, CARD.x, CARD.y, CARD.w, cardH, 14); x.fillStyle = PAL.surface; x.fill(); x.restore();
  x.save(); x.shadowColor = 'rgba(15,42,34,.14)'; x.shadowBlur = 26; x.shadowOffsetY = 10; rr(x, CARD.x, CARD.y, CARD.w, cardH, 14); x.fillStyle = PAL.surface; x.fill(); x.restore();
  rr(x, CARD.x, CARD.y, CARD.w, cardH, 14); x.strokeStyle = PAL.line; x.lineWidth = 1; x.stroke();
  T(x, '이번 주 할 일', cx, pos.title + 19, 20, PAL.ink, 700);
  T(x, '금요일까지 3건', cx, pos.sub + 15, 14, PAL.muted, 400);
  ['디자인 점검', '배포 확인', '문서 정리'].forEach((s, i) => {
    const Y = pos.rows[i];
    rr(x, cx, Y, cw, H.row, 8); x.fillStyle = SUNK; x.fill();
    rr(x, cx + 9, Y + 7, 14, 14, 4); x.strokeStyle = i === 0 ? OK : PAL.muted; x.lineWidth = 1.5; x.stroke();
    if (i === 0) { x.fillStyle = OK; rr(x, cx + 9, Y + 7, 14, 14, 4); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 1.6; x.beginPath(); x.moveTo(cx + 12, Y + 14.5); x.lineTo(cx + 15.2, Y + 17.5); x.lineTo(cx + 20, Y + 11); x.stroke(); }
    T(x, s, cx + 32, Y + 18.5, 14, PAL.ink, 400);
  });
  x.save(); x.shadowColor = rgba(OK, .35); x.shadowBlur = 8; x.shadowOffsetY = 3; rr(x, cx, pos.btn, 120, H.btn, 10); x.fillStyle = OK; x.fill(); x.restore();
  T(x, '일정 추가', cx + 60, pos.btn + 23, 14, '#ffffff', 700, 'center');
  // 간격 띠: 4의 배수면 초록, 아니면 주황
  const bands = [[CARD.y, pad, 0, true]].concat(gaps.map(([gy, gh], i) => [gy, gh, i + 1, false]));
  const padOk = pad % 4 === 0, padC = padOk ? OK : PAL.accent2;
  x.save(); rr(x, CARD.x, CARD.y, CARD.w, cardH, 14); x.clip();
  [[CARD.y, true], [CARD.y + cardH - pad, true]].forEach(([by]) => { x.fillStyle = rgba(padC, .2); x.fillRect(CARD.x, by, CARD.w, pad); x.fillStyle = rgba(padC, .75); x.fillRect(CARD.x, by + (by === CARD.y ? pad - 1 : 0), CARD.w, 1); });
  gaps.forEach(([gy, gh]) => { const c = gh % 4 === 0 ? OK : PAL.accent2; x.fillStyle = rgba(c, .2); x.fillRect(cx, gy, cw, gh); x.fillStyle = rgba(c, .75); x.fillRect(cx, gy, cw, 1); x.fillRect(cx, gy + gh - 1, cw, 1); });
  x.restore();
  bands.forEach(([by, bh, i, pd]) => {
    const val = pd ? pad : bh, ok = val % 4 === 0, c = ok ? OK : PAL.accent2;
    const AX = CARD.x + CARD.w + 10, cy = by + bh / 2;
    x.strokeStyle = c; x.lineWidth = 1.4; x.beginPath(); x.moveTo(AX, by); x.lineTo(AX, by + bh); x.moveTo(AX - 3, by + 0.5); x.lineTo(AX + 3, by + 0.5); x.moveTo(AX - 3, by + bh - 0.5); x.lineTo(AX + 3, by + bh - 0.5); x.stroke();
    T(x, String(val), AX + 8, cy + 4, 11, c, 700, 'left', MONO);
  });
}

function table(x, v, L, t) {
  const r = v.map(Math.round), bad = r.filter((n) => n % 4 !== 0).length;
  panel(x, 326, 16, 296, 178);
  T(x, '이 카드의 간격 여섯 개, 코드가 센 값', 338, 35, 11, PAL.muted, 500, 'left', MONO);
  r.forEach((n, i) => {
    const Y = 44 + i * 17, ok = n % 4 === 0, c = ok ? OK : PAL.accent2;
    T(x, NAMES[i], 338, Y + 11, 11, PAL.ink, 500);
    T(x, `${n}px`, 470, Y + 11, 12, PAL.ink, 700, 'right', MONO);
    T(x, ok ? `4 × ${n / 4}` : `나머지 ${n % 4}`, 590, Y + 11, 11, c, 700, 'right', MONO);
    x.fillStyle = c; x.fillRect(600, Y + 3, 4, 9);
  });
  T(x, `4의 배수가 아닌 값  ${bad} / ${r.length}개`, 338, 160, 12, bad ? PAL.accent2 : OK, 700);
  const k = L >= 3 ? E.outC(seg(t, ROLE_AT + 0.5, ROLE_AT + 1.1)) : 0;
  if (k > 0) {
    const ratio = GAP_OUT / GAP_IN;
    x.save(); x.globalAlpha = k; T(x, `묶음 안 ${GAP_IN}px, 묶음 사이 ${GAP_OUT}px: ${ratio % 1 ? ratio.toFixed(1) : ratio}배`, 338, 181, 12, PAL.ink, 700); x.restore();
  }
}
function barsCard(x) {   // 1단계: 실제 CSS 에서 센 4의 배수 비율
  panel(x, 326, 204, 296, 140);
  T(x, '실제 CSS 에서 센 4의 배수 비율 [측정]', 338, 222, 11, PAL.muted, 500, 'left', MONO);
  CSSM.forEach(([n, tot, m4], i) => {
    const Y = 230 + i * 21, f = m4 / tot;
    T(x, n, 338, Y + 11, 11, PAL.ink, 500);
    rr(x, 446, Y + 3, 56, 9, 3); x.fillStyle = 'rgba(15,42,34,.1)'; x.fill();
    rr(x, 446, Y + 3, Math.max(3, 56 * f), 9, 3); x.fillStyle = f > 0.95 ? OK : PAL.accent2; x.fill();
    T(x, `${(f * 100).toFixed(0)}%`, 546, Y + 11, 11, PAL.muted, 600, 'right', MONO);
    T(x, `${m4}/${tot}`, 612, Y + 11, 11, PAL.ink, 700, 'right', MONO);
  });
}
function scaleCard(x, v, al) {   // 2단계: 칸 아홉 개 눈금과 지금 값
  x.save(); x.globalAlpha = al; panel(x, 326, 204, 296, 140);
  T(x, '칸 눈금과 이 카드의 값(선형 축, 0에서 100px)', 338, 222, 11, PAL.muted, 500, 'left', MONO);
  const X0 = 342, W = 264, Y = 306;
  x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.moveTo(X0 - 4, Y + 0.5); x.lineTo(X0 + W + 4, Y + 0.5); x.stroke();
  SCALE.forEach((s, i) => { rr(x, axl(s, X0, W) - 1.2, Y - 16, 2.4, 16, 1); x.fillStyle = 'rgba(15,42,34,.6)'; x.fill(); T(x, String(s), axl(s, X0, W), Y + 12 + (i < 4 ? (i % 2) * 11 : 0), 10, PAL.ink, 600, 'center', MONO); });
  v.forEach((n, i) => {
    const X = axl(Math.min(AXMAX, n), X0, W), ok = Math.round(n) % 4 === 0, c = ok ? OK : PAL.accent2, Yt = Y - 22 - (i % 3) * 12;
    x.fillStyle = c; x.beginPath(); x.moveTo(X - 4, Yt - 7); x.lineTo(X + 4, Yt - 7); x.lineTo(X, Yt); x.closePath(); x.fill();
    x.strokeStyle = rgba(c, .5); x.lineWidth = 1; x.beginPath(); x.moveTo(X, Yt); x.lineTo(X, Y - 16); x.stroke();
  });
  T(x, '삼각형 = 이 카드의 간격, 칸 위에 앉으면 초록, 사이에 뜨면 주황', 338, 338, 10, PAL.muted, 500);
  x.restore();
}
function fourCard(x, t, al) {   // 3단계: 네 곳 눈금 겹치기
  x.save(); x.globalAlpha = al; panel(x, 326, 204, 296, 140);
  T(x, '네 곳의 간격 눈금(선형 축, 0에서 100px)', 338, 222, 11, PAL.muted, 500, 'left', MONO);
  const X0 = 432, W = 176, Y0 = 238;
  common.forEach((v) => { rr(x, axl(v, X0, W) - 5, Y0 - 2, 10, SRC.length * 20 + 2, 3); x.fillStyle = rgba(PAL.accent, .2); x.fill(); T(x, String(v), axl(v, X0, W), Y0 - 5, 10, OK, 700, 'center', MONO); });
  SRC.forEach((s, i) => {
    const Y = Y0 + i * 20, p = E.outC(seg(t, 3.9 + i * 0.14, 4.5 + i * 0.14));
    x.save(); x.globalAlpha = al * p; x.translate(0, (1 - p) * 5);
    T(x, s.n, 338, Y + 13, 11, PAL.ink, 600); T(x, s.g, 420, Y + 13, 9, PAL.muted, 600, 'right');
    x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.moveTo(X0, Y + 16.5); x.lineTo(X0 + W, Y + 16.5); x.stroke();
    s.v.forEach((n) => { if (n > AXMAX) return; rr(x, axl(n, X0, W) - 0.8, Y + 4, 1.6, 12, 0.8); x.fillStyle = common.includes(n) ? PAL.ink : PAL.muted; x.fill(); });
    if (s.v.some((n) => n > AXMAX)) { const X = X0 + W + 6; x.strokeStyle = PAL.muted; x.lineWidth = 1.5; x.beginPath(); x.moveTo(X, Y + 7); x.lineTo(X + 4, Y + 10); x.lineTo(X, Y + 13); x.stroke(); }
    x.restore();
  });
  const pf = E.outC(seg(t, 4.9, 5.4));
  x.save(); x.globalAlpha = al * pf;
  T(x, `네 곳이 모두 가진 값: ${common.join(', ')} (${common.length}개)`, 338, 330, 12, PAL.ink, 700);
  x.restore(); x.restore();
}

const STEP = ['마음대로 쓴 간격', '가까운 칸으로 옮기기', '관계로 정하기'];
const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(41), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const lab = el('div', null, sp);   // 이름표(vertical): 왼쪽 가장자리 세로쓰기, 번호는 muted, 지금 항목은 ink
    Object.assign(lab.style, { position: 'absolute', left: '10px', top: '22px', writingMode: 'vertical-rl', letterSpacing: '.06em', whiteSpace: 'nowrap', lineHeight: '12px', zIndex: '4' });
    const idx = el('span', null, lab), pill = el('span', null, lab);
    Object.assign(idx.style, { color: PAL.muted, font: "500 12px/1 'JetBrains Mono',monospace", marginBottom: '8px' });
    Object.assign(pill.style, { color: PAL.ink, font: "600 12px/1 'IBM Plex Sans KR',sans-serif" });
    return { main, idx, pill };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 1 : (lv == null ? 3 : lv), x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'multiply'; x.globalAlpha = 0.07;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();
    const v = valsAt(t, L);
    drawCard(x, v); table(x, v, L, t);
    if (L === 1) barsCard(x);
    else if (L === 2) scaleCard(x, v, 1);
    else { const k = E.inOutC(seg(t, 3.6, 4.1)); if (k < 1) scaleCard(x, v, 1 - k); if (k > 0) fourCard(x, t, k); }
    s.idx.textContent = '0' + L; s.pill.textContent = STEP[L - 1];
  },
};
export default demo;
