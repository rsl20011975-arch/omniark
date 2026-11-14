/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/empty-loading-error-states/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 같은 '주문 목록' 화면의 빈 상태·로딩·에러 카드 셋. 앞쪽(연출 전)은 안내 없는 화면, 뒤쪽은 이유와 다음 행동이 있는 화면이다.
// 점검표의 칸(안내·이유·행동·이동 px·대비)은 카드에 실제로 그려진 값에서 코드가 센다. 모든 내용은 예시 데이터이고 화면 문구는 모형이다.
const LOAD_END = 4.0;          // 로딩이 끝나고 실제 줄이 나타나는 시각(초)
const LOAD_ROWS = 3;           // 뼈대 줄 수(실제 줄 수와 같게)
const ROW_H = 34;              // 줄 높이(px). 뼈대와 실제 줄이 같다
const EMPTY_KIND = 'first';    // 빈 상태 종류: 'first' = 처음 사용, 'filter' = 필터 결과 없음
const PAL = { bg0: '#1b0e17', bg1: '#2b1424', ink: '#f6e9ee', muted: '#b095a3', accent: '#ff7aa8', accent2: '#ffd0a0', surface: '#26121f', line: 'rgba(246,233,238,.16)' };
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif';
const PX = [14, 222, 430], PY = 40, PW = 196, PH = 200, HD = 30, UP = [0.5, 0.9, 1.3];
const BAD_TXT = '#7a6672', ERR = '#ff9a9a', BTN_INK = '#2a0f1c', OKC = '#8fe0a8', NOC = '#ff9a9a';
const TEXTS = {
  first: { t: '아직 주문이 없어요', d: ['첫 주문이 들어오면', '여기에 모여요'], b: '주문 만들기' },
  filter: { t: '조건에 맞는 주문이 없어요', d: ['필터를 바꾸거나 지우면', '다시 보여요'], b: '필터 지우기' },
};
const STEP = ['안내 없는 화면 셋', '빈 화면: 이유와 다음 행동', '로딩: 같은 높이 뼈대', '에러: 이유와 다시 시도'];
const CHK = ['안내 문장', '이유 한 줄', '다음 행동', '이동', '최저 대비'];

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lum = (h) => { const [r, g, b] = hex(h).map((v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const minRatio = (pairs) => Math.min(...pairs.map(([a, b]) => ratio(a, b)));
const footerY = (badLayout, loaded) => PY + HD + 8 + (badLayout && !loaded ? 56 : LOAD_ROWS * ROW_H + 6);   // 아래 '총 건수' 줄의 y

// 카드마다 지금 그려진 상태를 숫자로 적은 것. 점검표가 이것을 읽는다
function desc(kind, good) {
  const S = PAL.surface;
  if (kind === 0) return good ? { msg: 1, why: 1, act: 2, shift: 0, cr: minRatio([[PAL.ink, S], [PAL.muted, S], [BTN_INK, PAL.accent]]) } : { msg: 0, why: 0, act: 0, shift: 0, cr: null };
  if (kind === 1) return good ? { msg: 1, why: -1, act: -1, shift: footerY(false, true) - footerY(false, false), cr: minRatio([[PAL.muted, S], [PAL.ink, S]]) } : { msg: 1, why: -1, act: -1, shift: footerY(true, true) - footerY(true, false), cr: ratio(BAD_TXT, S) };
  return good ? { msg: 1, why: 1, act: 2, shift: 0, cr: minRatio([[PAL.ink, S], [PAL.muted, S], [BTN_INK, PAL.accent]]) } : { msg: 1, why: 0, act: 1, shift: 0, cr: ratio(ERR, S) };
}

let GRAIN = null;
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function rr(x, X, Y, Wd, Ht, r) { x.beginPath(); x.roundRect(X, Y, Wd, Ht, r); }
function btn(x, cx, y, w, h, label, primary) {
  if (x.globalAlpha < 0.004) return;       // 투명도 0 에서 그림자를 그리면 브라우저가 캔버스를 지워 버린다
  if (primary) { const g = x.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#ff97bb'); g.addColorStop(1, PAL.accent); x.save(); x.shadowColor = 'rgba(255,122,168,.35)'; x.shadowBlur = 8; x.shadowOffsetY = 2; x.fillStyle = g; rr(x, cx - w / 2, y, w, h, h / 2); x.fill(); x.restore(); T(x, label, cx, y + h / 2 + 3.5, 10.5, BTN_INK, 700, 'center'); }
  else { x.strokeStyle = PAL.line; x.lineWidth = 1; rr(x, cx - w / 2, y, w, h, h / 2); x.stroke(); T(x, label, cx, y + h / 2 + 3.5, 10.5, PAL.ink, 600, 'center'); }
}
function inbox(x, cx, cy, k) {
  if (x.globalAlpha < 0.004) return;                  // 보관함 그림: 접지 그림자, 몸통 그라디언트, 열린 입구, 삐져나온 종이
  x.save(); x.translate(cx, cy); x.scale(k, k);
  x.fillStyle = 'rgba(0,0,0,.35)'; x.beginPath(); x.ellipse(0, 22, 30, 5, 0, 0, 7); x.fill();
  x.save(); x.rotate(-0.12); x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 6; x.fillStyle = '#fbeff3'; rr(x, -14, -22, 26, 30, 3); x.fill(); x.shadowColor = 'transparent';
  [[-17, 14], [-11, 14], [-5, 9]].forEach(([o, w]) => { x.fillStyle = 'rgba(176,149,163,.6)'; rr(x, -9, o, w, 2, 1); x.fill(); }); x.restore();
  const g = x.createLinearGradient(0, -2, 0, 22); g.addColorStop(0, '#ffe3c4'); g.addColorStop(1, '#d9a47c');
  x.fillStyle = g; x.beginPath(); x.moveTo(-30, 0); x.lineTo(-16, -6); x.lineTo(16, -6); x.lineTo(30, 0); x.lineTo(30, 18); x.quadraticCurveTo(30, 22, 26, 22); x.lineTo(-26, 22); x.quadraticCurveTo(-30, 22, -30, 18); x.closePath(); x.fill();
  const lg = x.createLinearGradient(0, -6, 0, 6); lg.addColorStop(0, 'rgba(255,255,255,.55)'); lg.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = lg; x.beginPath(); x.moveTo(-30, 0); x.lineTo(-16, -6); x.lineTo(16, -6); x.lineTo(30, 0); x.closePath(); x.fill();
  x.fillStyle = 'rgba(120,70,60,.55)'; x.beginPath(); x.moveTo(-14, 6); x.quadraticCurveTo(0, 12, 14, 6); x.lineTo(14, 8); x.quadraticCurveTo(0, 14, -14, 8); x.closePath(); x.fill();
  x.restore();
}
function funnel(x, cx, cy, k) {
  if (x.globalAlpha < 0.004) return;                // 필터 그림: 깔때기, 접지 그림자, 위쪽 빛
  x.save(); x.translate(cx, cy); x.scale(k, k);
  x.fillStyle = 'rgba(0,0,0,.35)'; x.beginPath(); x.ellipse(0, 24, 22, 4.5, 0, 0, 7); x.fill();
  const g = x.createLinearGradient(0, -20, 0, 22); g.addColorStop(0, '#ffe3c4'); g.addColorStop(1, '#c98f72');
  x.fillStyle = g; x.beginPath(); x.moveTo(-26, -18); x.lineTo(26, -18); x.quadraticCurveTo(28, -18, 26, -14); x.lineTo(7, 4); x.lineTo(7, 20); x.quadraticCurveTo(7, 23, 4, 22); x.lineTo(-4, 18); x.quadraticCurveTo(-7, 17, -7, 14); x.lineTo(-7, 4); x.lineTo(-26, -14); x.quadraticCurveTo(-28, -18, -26, -18); x.closePath(); x.fill();
  const hl = x.createLinearGradient(0, -18, 0, -8); hl.addColorStop(0, 'rgba(255,255,255,.6)'); hl.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = hl; x.fillRect(-25, -18, 50, 9);
  x.strokeStyle = 'rgba(42,15,28,.55)'; x.lineWidth = 2.2; x.lineCap = 'round'; x.beginPath(); x.moveTo(-16, -7); x.lineTo(16, -7); x.stroke();
  x.restore();
}
function warn(x, cx, cy, k) {
  if (x.globalAlpha < 0.004) return;                   // 경고 삼각형: 안쪽 빛, 접지 그림자, 느낌표는 직접 그린 막대와 점
  x.save(); x.translate(cx, cy); x.scale(k, k);
  x.fillStyle = 'rgba(0,0,0,.35)'; x.beginPath(); x.ellipse(0, 22, 24, 4.5, 0, 0, 7); x.fill();
  const g = x.createLinearGradient(0, -20, 0, 20); g.addColorStop(0, '#ffb0a8'); g.addColorStop(1, '#e86a78');
  x.lineJoin = 'round'; x.fillStyle = g; x.strokeStyle = g; x.lineWidth = 8; x.beginPath(); x.moveTo(0, -16); x.lineTo(19, 15); x.lineTo(-19, 15); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle = 'rgba(255,255,255,.45)'; x.lineWidth = 1.4; x.beginPath(); x.moveTo(-14, 11); x.lineTo(-1, -12); x.stroke();
  x.fillStyle = '#4a1422'; rr(x, -2, -6, 4, 12, 2); x.fill(); x.beginPath(); x.arc(0, 11, 2.3, 0, 7); x.fill();
  x.restore();
}
function mark(x, cx, cy, kind) {                // 맞음 표시, 틀림 표시, 해당 없음을 직접 그린다
  x.save(); x.lineCap = 'round'; x.lineWidth = 1.7;
  if (kind === 1) { x.strokeStyle = OKC; x.beginPath(); x.moveTo(cx - 4, cy); x.lineTo(cx - 1, cy + 3); x.lineTo(cx + 4, cy - 3.5); x.stroke(); }
  else if (kind === 0) { x.strokeStyle = NOC; x.beginPath(); x.moveTo(cx - 3.2, cy - 3.2); x.lineTo(cx + 3.2, cy + 3.2); x.moveTo(cx + 3.2, cy - 3.2); x.lineTo(cx - 3.2, cy + 3.2); x.stroke(); }
  else { x.strokeStyle = PAL.muted; x.globalAlpha = 0.6; x.beginPath(); x.moveTo(cx - 3, cy); x.lineTo(cx + 3, cy); x.stroke(); }
  x.restore();
}
function panel(x, i) {                           // 카드 바탕: 접지 그림자, 머리줄
  const X = PX[i];
  x.save(); x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 18; x.shadowOffsetY = 6; x.fillStyle = PAL.surface; rr(x, X, PY, PW, PH, 14); x.fill(); x.restore();
  x.save(); rr(x, X, PY, PW, PH, 14); x.clip(); x.fillStyle = 'rgba(246,233,238,.05)'; x.fillRect(X, PY, PW, HD); x.fillStyle = PAL.line; x.fillRect(X, PY + HD, PW, 1); x.restore();
  T(x, '주문 목록', X + 14, PY + 19, 11, PAL.ink, 700);
  x.fillStyle = PAL.muted; x.globalAlpha = 0.5; [0, 7, 14].forEach((d) => { x.beginPath(); x.arc(X + PW - 38 + d, PY + 15, 1.8, 0, 7); x.fill(); }); x.globalAlpha = 1;
  x.strokeStyle = PAL.line; x.lineWidth = 1; rr(x, X + 0.5, PY + 0.5, PW - 1, PH - 1, 14); x.stroke();
}
function bodyClip(x, i) { x.save(); rr(x, PX[i], PY, PW, PH, 14); x.clip(); }
function emptyCard(x, t, a, good) {
  const X = PX[0], cx = X + PW / 2, c = TEXTS[EMPTY_KIND];
  if (!good) { return; }
  const k = (d) => E.outC(seg(t, UP[0] + d, UP[0] + d + 0.45)), ik = 0.8 + 0.2 * E.outBack(seg(t, UP[0], UP[0] + 0.6));
  x.save(); x.globalAlpha = a * k(0); (EMPTY_KIND === 'filter' ? funnel : inbox)(x, cx, PY + 78 - (1 - k(0)) * 6, ik); x.restore();
  x.save(); x.globalAlpha = a * k(0.1); T(x, c.t, cx, PY + 126 + (1 - k(0.1)) * 6, 12.5, PAL.ink, 700, 'center'); x.restore();
  x.save(); x.globalAlpha = a * k(0.18); T(x, c.d[0], cx, PY + 143 + (1 - k(0.18)) * 6, 10, PAL.muted, 500, 'center'); T(x, c.d[1], cx, PY + 156, 10, PAL.muted, 500, 'center'); x.restore();
  x.save(); x.globalAlpha = a * k(0.26); btn(x, cx, PY + 166 + (1 - k(0.26)) * 6, 96, 24, c.b, true); x.restore();
}
function loadCard(x, t, a, good) {
  const X = PX[1], arrived = t >= LOAD_END, names = ['A', 'B', 'C', 'D', 'E'];
  const bodyY = PY + HD + 8;
  if (!good) {
    if (!arrived) T(x, 'Loading...', X + PW / 2, PY + HD + 34, 11, BAD_TXT, 500, 'center');
    else for (let r = 0; r < LOAD_ROWS; r++) { x.fillStyle = 'rgba(176,149,163,.28)'; x.beginPath(); x.arc(X + 26, bodyY + 4 + r * ROW_H + 13, 10, 0, 7); x.fill(); T(x, `예시 주문 ${names[r]}`, X + 44, bodyY + 4 + r * ROW_H + 17, 10.5, PAL.ink, 600); }
    T(x, `총 ${LOAD_ROWS}건`, X + 14, footerY(true, arrived) + 8, 9.5, PAL.muted, 600, 'left', MONO);
    return;
  }
  const fade = E.outC(seg(t, LOAD_END, LOAD_END + 0.3)), sk = 1 - fade, sweep = ((t / 1.1) % 1);
  for (let r = 0; r < LOAD_ROWS; r++) {
    const y = bodyY + 4 + r * ROW_H;
    x.save(); x.globalAlpha = a * sk;
    x.fillStyle = 'rgba(246,233,238,.15)'; x.beginPath(); x.arc(X + 26, y + 13, 10, 0, 7); x.fill(); rr(x, X + 44, y + 5, 92, 8, 4); x.fill(); rr(x, X + 44, y + 18, 56, 7, 3.5); x.fill(); rr(x, X + PW - 54, y + 8, 40, 16, 8); x.fill();
    x.save(); x.beginPath(); x.arc(X + 26, y + 13, 10, 0, 7); x.rect(X + 44, y + 5, 92, 8); x.rect(X + 44, y + 18, 56, 7); x.rect(X + PW - 54, y + 8, 40, 16); x.clip();
    const sx = X + 10 + E.inOutC(sweep) * 150, sg = x.createLinearGradient(sx - 24, 0, sx + 24, 0); sg.addColorStop(0, 'rgba(246,233,238,0)'); sg.addColorStop(0.5, 'rgba(246,233,238,.2)'); sg.addColorStop(1, 'rgba(246,233,238,0)');
    x.fillStyle = sg; x.fillRect(X, y, PW, ROW_H); x.restore(); x.restore();
    const e = E.outC(seg(t, LOAD_END + 0.06 * r, LOAD_END + 0.06 * r + 0.4));
    x.save(); x.globalAlpha = a * e;
    const ag = x.createRadialGradient(X + 23, y + 10, 1, X + 26, y + 13, 11); ag.addColorStop(0, '#ffc2d6'); ag.addColorStop(1, '#b5476e'); x.fillStyle = ag; x.beginPath(); x.arc(X + 26, y + 13 + (1 - e) * 5, 10, 0, 7); x.fill();
    T(x, `예시 주문 ${names[r]}`, X + 44, y + 17 + (1 - e) * 5, 10.5, PAL.ink, 600);
    x.fillStyle = 'rgba(255,208,160,.2)'; rr(x, X + PW - 54, y + 8 + (1 - e) * 5, 40, 16, 8); x.fill(); T(x, '준비 중', X + PW - 34, y + 19.5 + (1 - e) * 5, 9, PAL.accent2, 600, 'center'); x.restore();
  }
  x.save(); x.globalAlpha = a * (0.5 + 0.5 * seg(t, 0.2, 0.7)); T(x, `총 ${LOAD_ROWS}건`, X + 14, footerY(false, true) + 8, 9.5, PAL.muted, 600, 'left', MONO); x.restore();
  x.save(); x.globalAlpha = a * sk; T(x, '불러오는 중', X + PW - 14, footerY(false, true) + 8, 9, PAL.muted, 500, 'right'); x.restore();
}
function errCard(x, t, a, good) {
  const X = PX[2], cx = X + PW / 2;
  if (!good) { T(x, 'Error', cx, PY + 96, 12, ERR, 600, 'center'); x.fillStyle = 'rgba(176,149,163,.2)'; rr(x, cx - 24, PY + 112, 48, 22, 5); x.fill(); T(x, '확인', cx, PY + 127, 10, PAL.muted, 600, 'center'); return; }
  const k = (d) => E.outC(seg(t, UP[2] + d, UP[2] + d + 0.45)), wk = 0.8 + 0.2 * E.outBack(seg(t, UP[2], UP[2] + 0.6));
  x.save(); x.globalAlpha = a * k(0); warn(x, cx, PY + 70 - (1 - k(0)) * 6, wk); x.restore();
  x.save(); x.globalAlpha = a * k(0.1); T(x, '주문 목록을 불러오지', cx, PY + 118 + (1 - k(0.1)) * 6, 12, PAL.ink, 700, 'center'); T(x, '못했어요', cx, PY + 133 + (1 - k(0.1)) * 6, 12, PAL.ink, 700, 'center'); x.restore();
  x.save(); x.globalAlpha = a * k(0.18); T(x, '서버가 10초 안에 답하지 않았어요', cx, PY + 150, 9.5, PAL.muted, 500, 'center'); x.restore();
  x.save(); x.globalAlpha = a * k(0.26); btn(x, cx - 34, PY + 162 + (1 - k(0.26)) * 6, 70, 24, '다시 시도', true); btn(x, cx + 42, PY + 162 + (1 - k(0.26)) * 6, 56, 24, '문의하기', false); x.restore();
}

const demo = {
  dur: 5.0, rest: 5.0, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(41), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const pill = el('div', null, sp);   // 이름표(pill): 왼쪽 위 알약
    Object.assign(pill.style, { position: 'absolute', left: '14px', top: '9px', display: 'flex', alignItems: 'center', gap: '6px', height: '22px', padding: '0 11px 0 9px', borderRadius: '11px', background: 'rgba(38,18,31,.92)', border: '1px solid rgba(246,233,238,.16)', zIndex: '4', font: "600 11px/1 'IBM Plex Sans KR',sans-serif", color: PAL.ink, whiteSpace: 'nowrap' });
    const dot = el('span', null, pill); Object.assign(dot.style, { width: '7px', height: '7px', borderRadius: '50%', background: PAL.accent, flex: 'none' });
    const txt = el('span', null, pill);
    return { main, txt };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 0 : (lv == null ? 3 : lv);
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.1;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();

    const up = [0, 1, 2].map((i) => (L >= i + 1 ? E.outC(seg(t, UP[i], UP[i] + 0.5)) : 0));
    const goodNow = up.map((u) => u > 0.5);
    for (let i = 0; i < 3; i++) {
      const pr = E.outC(seg(t, 0.02 + 0.08 * i, 0.5 + 0.08 * i));
      if (pr < 0.004) continue;
      x.save(); x.globalAlpha = pr; x.translate(0, (1 - pr) * 8); panel(x, i);
      bodyClip(x, i);
      const bad = 1 - up[i], gd2 = up[i];
      if (i === 0) emptyCard(x, t, gd2, true);       // 연출 전의 빈 카드는 아무것도 그리지 않는다
      if (i === 1) { x.save(); x.globalAlpha = bad; loadCard(x, t, 1, false); x.restore(); loadCard(x, t, gd2, true); }
      if (i === 2) { x.save(); x.globalAlpha = bad; errCard(x, t, 1, false); x.restore(); errCard(x, t, gd2, true); }
      x.restore(); x.restore();
    }
    // 연출 전에는 로딩이 끝나는 순간 아래 줄이 밀려 내려온다: 그 이동 거리를 표시
    if (L < 2 && t >= LOAD_END && t < LOAD_END + 1.2) {
      const sh = desc(1, false).shift, k = 1 - seg(t, LOAD_END + 0.5, LOAD_END + 1.2), X = PX[1] + PW - 22;
      x.save(); x.globalAlpha = k; x.strokeStyle = ERR; x.lineWidth = 1.4; x.setLineDash([3, 3]); x.beginPath(); x.moveTo(X, footerY(true, false) + 2); x.lineTo(X, footerY(true, true) + 2); x.stroke(); x.setLineDash([]);
      T(x, `+${sh}px`, X - 5, (footerY(true, false) + footerY(true, true)) / 2 + 5, 10, ERR, 700, 'right', MONO); x.restore();
    }
    // 점검표: 카드에 그려진 값에서 센다
    if (L >= 1) {
      const fadeIn = E.outC(seg(t, 0.15, 0.5)), ty = PY + PH + 18;
      for (let i = 0; i < 3; i++) {
        const d = desc(i, goodNow[i]), cx0 = PX[i] + 4;
        const cells = [d.msg, d.why, d.act === 2 ? 1 : (d.act === -1 ? -1 : 0), d.shift === 0 ? 1 : 0, d.cr == null ? -1 : (d.cr >= 4.5 ? 1 : 0)];
        const ok = cells.filter((c) => c === 1).length, tot = cells.filter((c) => c !== -1).length;
        x.save(); x.globalAlpha = fadeIn;
        T(x, '점검표', cx0, ty - 4, 10, PAL.ink, 700); T(x, `${ok}/${tot}`, PX[i] + PW - 4, ty - 4, 11, ok === tot ? OKC : PAL.accent, 700, 'right', MONO);
        x.fillStyle = PAL.line; x.fillRect(cx0, ty + 1, PW - 8, 1);
        CHK.forEach((nm, r) => {
          const y = ty + 17 + r * 16;
          T(x, nm, cx0 + 18, y, 10, cells[r] === -1 ? PAL.muted : PAL.ink, 500); mark(x, cx0 + 6, y - 3.5, cells[r]);
          if (r === 3) T(x, d.shift === 0 ? '0px' : `${d.shift}px`, PX[i] + PW - 4, y, 10, d.shift === 0 ? OKC : NOC, 700, 'right', MONO);
          if (r === 4 && d.cr != null) T(x, `${d.cr.toFixed(1)}:1`, PX[i] + PW - 4, y, 10, d.cr >= 4.5 ? OKC : NOC, 700, 'right', MONO);
        });
        x.restore();
      }
    }
    T(x, '예시 화면 · 가상 데이터(실제 주문 아님)', 626, 354, 9, PAL.muted, 500, 'right');
    s.txt.textContent = STEP[L === 0 ? 0 : Math.min(L, 1 + (t >= UP[1] ? 1 : 0) + (t >= UP[2] ? 1 : 0))];
  },
};
export default demo;
