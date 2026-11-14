/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/episode-set-cadence/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 하루 묶음의 공개 순서를 06:00~24:00 시간축에 놓고, 롱폼 공개 뒤에야 쇼츠를 잇는다는 제약을 분 단위로 센다. 화면은 시간 t 의 함수다.
const LONG_AT = 660;        // 롱폼 공개 시각(분, 하루 0시 기준) 08:00
const CONNECT_MIN = 30;     // 쇼츠를 롱폼에 잇는 연결 작업에 드는 시간(분, 기록에 없어 가정한 값)
const SHORTS_AT = [600, 750, 1170];   // 쇼츠 공개 10:00, 12:30, 19:30
const CARD_AT = 720, THREAD_AT = 1260;   // 인스타 카드 12:00, 스레드 21:00
const SHORTS_PER_EP = 3;    // 한 편마다 하루에 내보내는 쇼츠 수
const PAL = { bg0: '#0c1814', bg1: '#15271f', ink: '#e8f1ea', muted: '#86a091', accent: '#7fe0a8', accent2: '#e8d27a', surface: '#12231c', line: 'rgba(232,241,234,.16)' };
const BAD = '#ff9a8a';
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif', HAN = '"Black Han Sans", sans-serif';
const CAP = ['롱폼이 저녁에 나가고 쇼츠가 먼저 나간 날', '롱폼을 08:00 에 먼저 공개', '연결 작업 뒤에 쇼츠 세 편을 잇는다', '카드와 스레드까지 하루 묶음 6칸', '공개 간격 셋을 14일에 놓아 본다'];
const LONG_BEFORE = 1200;   // 연출 전: 롱폼을 20:00 에 올린 날(가정)
const X0 = 56, X1 = 620, H0 = 6 * 60, H1 = 24 * 60;
const LANE = { long: 66, shorts: 98, card: 130, thread: 162 };
const GAPS = [[1, '하루 1편'], [3, '3일 간격'], [7, '주 1편']], DAYS = 14;

const px = (m) => X0 + (m - H0) / (H1 - H0) * (X1 - X0);
const hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(Math.round(m % 60)).padStart(2, '0')}`;
let GRAIN = null;
function rr(x, X, Y, W, H, r) { x.beginPath(); x.roundRect(X, Y, W, H, Math.max(0, Math.min(r, W / 2, H / 2))); }
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.textBaseline = 'alphabetic'; x.fillText(s, X, Y); }
function marker(x, m, y, col, k) {      // 시각이 적힌 공개 칸. 살짝 튀어 오르며 나타난다
  const cx = px(m), s = 0.6 + 0.4 * E.outBack(k);
  x.save(); x.globalAlpha = Math.min(1, k * 1.6); x.translate(cx, y); x.scale(s, s);
  [1, 2, 3].forEach((q) => { x.fillStyle = 'rgba(0,0,0,0.09)'; rr(x, -20 - q, -9 + q + 1, 40 + 2 * q, 18 + q, 5 + q); x.fill(); });
  const g = x.createLinearGradient(0, -9, 0, 9); g.addColorStop(0, col); g.addColorStop(1, col); x.fillStyle = g; rr(x, -20, -9, 40, 18, 5); x.fill();
  x.fillStyle = 'rgba(255,255,255,.22)'; rr(x, -20, -9, 40, 7, 5); x.fill();
  T(x, hhmm(m), 0, 3.5, 9.5, '#0c1814', 700, 'center', MONO);
  x.restore();
}

const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 4,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(23), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const cap = el('div', null, sp);   // 이름표(caption-bl): 왼쪽 아래, 배경 없이 얇은 선 위에 한 줄
    Object.assign(cap.style, { position: 'absolute', left: '20px', bottom: '8px', width: '600px', borderTop: `1px solid ${PAL.line}`, paddingTop: '5px', font: "500 12px 'JetBrains Mono',monospace", color: PAL.muted, zIndex: '4', whiteSpace: 'nowrap' });
    return { main, cap };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 0 : (lv == null ? 4 : lv);
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.setLineDash([]);
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.07;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();

    // 롱폼 공개 시각: 1단계에서 저녁에서 아침으로 옮겨 간다
    const longAt = L === 0 ? LONG_BEFORE : (L === 1 ? lerp(LONG_BEFORE, LONG_AT, E.inOutC(seg(t, 0.3, 1.7))) : LONG_AT);
    const done = longAt + CONNECT_MIN;
    const unl = SHORTS_AT.map((m) => Math.max(0, Math.round(done - m)));
    const posts = 1 + SHORTS_AT.length + (L >= 3 ? 2 : 0);

    T(x, '하루 06:00 ~ 24:00 (한국 시각)', 20, 38, 10, PAL.muted, 500, 'left', MONO);
    T(x, `공개 칸 ${posts}개`, 620, 38, 10, PAL.ink, 600, 'right', MONO);
    for (let h = 6; h <= 24; h += 2) {       // 시간 눈금
      const gx1 = px(h * 60); x.fillStyle = 'rgba(232,241,234,.09)'; x.fillRect(gx1, 52, 1, 130);
      T(x, String(h).padStart(2, '0'), gx1, 49, 9, PAL.muted, 500, 'center', MONO);
    }
    Object.values(LANE).forEach((y) => { x.fillStyle = 'rgba(232,241,234,.045)'; rr(x, X0, y - 12, X1 - X0, 24, 6); x.fill(); });
    [['롱폼', LANE.long], ['쇼츠', LANE.shorts], ['카드', LANE.card], ['스레드', LANE.thread]].forEach(([n, y]) => T(x, n, 8, y + 3.5, 10, PAL.muted, 600));

    // 연결 막대: 쇼츠가 롱폼 연결보다 먼저 나간 시간
    SHORTS_AT.forEach((m, i) => { if (unl[i] > 0) { x.fillStyle = BAD; rr(x, px(m), LANE.shorts + 11, Math.max(2, px(done) - px(m)), 4, 2); x.fill(); T(x, `연결 전 ${unl[i]}분`, px(m) - 18, LANE.shorts + 25, 8.5, BAD, 700, 'left', MONO); } });
    if (L >= 2) {       // 연결 작업 칸과 호
      const k2 = E.outC(seg(t, 0.2, 0.8));
      x.fillStyle = 'rgba(232,210,122,.2)'; x.fillRect(px(longAt), 54, px(done) - px(longAt), 126);
      T(x, `연결 작업 ${CONNECT_MIN}분(가정)`, px(longAt) + 26, LANE.long + 3.5, 8.5, PAL.accent2, 600, 'left', MONO);
      SHORTS_AT.forEach((m, i) => {
        const p = E.inOutC(seg(t, 0.5 + i * 0.25, 1.4 + i * 0.25)); if (p <= 0) return;
        const ax = px(longAt) + 10, ay = LANE.long + 9, bx = px(m), by = LANE.shorts - 9;
        x.save(); x.strokeStyle = unl[i] === 0 ? PAL.accent : BAD; x.lineWidth = 1.4; x.globalAlpha = 0.9; x.beginPath(); x.moveTo(ax, ay);
        const n = Math.max(2, Math.round(24 * p));
        for (let q = 1; q <= n; q++) { const u = q / 24, v = 1 - u; x.lineTo(v * v * ax + 2 * u * v * ax + u * u * bx, v * v * ay + 2 * u * v * (ay + 14) + u * u * by); }
        x.stroke(); x.restore();
      });
    }
    marker(x, longAt, LANE.long, PAL.accent, 1);
    SHORTS_AT.forEach((m) => marker(x, m, LANE.shorts, PAL.accent2, 1));
    if (L >= 3) { marker(x, CARD_AT, LANE.card, '#9fc6b2', E.outC(seg(t, 0.1, 0.5))); marker(x, THREAD_AT, LANE.thread, '#cdd9d1', E.outC(seg(t, 0.4, 0.8))); }

    if (L < 4) {      // 아래 칸: 쇼츠마다 연결되기 전에 나간 시간
      T(x, '쇼츠가 롱폼 연결 없이 나간 시간', 20, 204, 10, PAL.muted, 500, 'left', MONO);
      SHORTS_AT.forEach((m, i) => {
        const y = 218 + i * 26;
        x.fillStyle = 'rgba(232,241,234,.06)'; rr(x, 20, y, 440, 20, 5); x.fill();
        T(x, `쇼츠 ${i + 1}  ${hhmm(m)}`, 30, y + 14, 10.5, PAL.ink, 600);
        x.fillStyle = 'rgba(232,241,234,.1)'; rr(x, 140, y + 6, 230, 8, 4); x.fill();
        if (unl[i] > 0) { x.fillStyle = BAD; rr(x, 140, y + 6, Math.max(3, Math.min(1, unl[i] / 720) * 230), 8, 4); x.fill(); }
        T(x, unl[i] > 0 ? `${Math.floor(unl[i] / 60)}시간 ${unl[i] % 60}분` : '0분', 452, y + 14, 10.5, unl[i] > 0 ? BAD : PAL.accent, 700, 'right', MONO);
      });
      const sum = unl.reduce((p, c) => p + c, 0);
      T(x, '합계', 488, 224, 10, PAL.muted, 500, 'left', MONO);
      T(x, `${(sum / 60).toFixed(1)}시간`, 488, 252, 26, sum > 0 ? BAD : PAL.accent, 400, 'left', HAN);
      T(x, sum > 0 ? '연결 전 노출 시간' : '연결 전 노출 없음', 488, 270, 9.5, PAL.muted, 500);
      T(x, '연결은 롱폼이 공개된 뒤에만 건다(대상은 공개 또는 일부 공개) [공식]', 20, 308, 9.5, PAL.muted, 500);
      T(x, '연결 뒤 조회가 늘었는지는 확인된 적 없다 [미확인]', 20, 320, 9.5, PAL.accent2, 600);
    } else {          // 4단계: 14일 동안 공개 간격 세 가지
      T(x, `${DAYS}일 동안 새 편이 나가는 날`, 20, 204, 10, PAL.muted, 500, 'left', MONO);
      GAPS.forEach(([gap, name], i) => {
        const y = 222 + i * 28, n = Math.ceil(DAYS / gap);
        x.fillStyle = 'rgba(232,241,234,.06)'; rr(x, 20, y, 600, 22, 5); x.fill();
        T(x, name, 30, y + 15, 10.5, PAL.ink, 600);
        for (let d = 0; d < DAYS; d++) {
          const on = d % gap === 0, k = on ? E.outBack(seg(t, 0.2 + d * 0.03 + i * 0.1, 0.5 + d * 0.03 + i * 0.1)) : 1, cx = 140 + d * 24, cy = y + 11;
          x.beginPath(); x.arc(cx, cy, on ? 5.5 * Math.max(0, k) : 2.5, 0, Math.PI * 2);
          if (on) { x.fillStyle = PAL.accent; x.fill(); } else { x.fillStyle = 'rgba(232,241,234,.25)'; x.fill(); }
        }
        T(x, `롱폼 ${n}편, 쇼츠 ${n * SHORTS_PER_EP}편`, 612, y + 15, 10, PAL.ink, 600, 'right', MONO);
      });
      T(x, '공식 도움말: 권장 편수는 적혀 있지 않다 [공식]', 20, 312, 9.5, PAL.muted, 500);
      T(x, '편수와 조회의 관계: 우리 기록 0건 [미확인]', 20, 324, 9.5, PAL.accent2, 600);
    }
    s.cap.textContent = `${L}  ${CAP[L]}`;
  },
};
export default demo;
