/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/reused-content-policy/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 남의 영상을 재편집하는 쇼츠 한 편: 원본 그대로 올린 상태에서 시작해, 해설을 더하고, 설명란에 원본을 적고, 소재를 거른다.
// 화면의 줄 수·통과 수는 모두 코드가 상수와 후보 값에서 계산한다. 후보 5개는 예시이고 거르는 기준 숫자는 제작 기록의 값이다.
const NARR = 4;           // 해설 자막 줄 수(줄마다 원본에 없는 사실 1개)
const FACT_MIN = 2;       // 원본에 없는 사실 최소 개수(제작 기록의 지시)
const KR_LIMIT = 10000;   // 이번 달 한국어로 같은 소재가 이 조회 이상 돌았으면 뺀다
const DAY_CAP = 1;        // 같은 원작자는 하루 이 편수까지
const WEEK_CAP = 3;       // 같은 원작자는 7일에 이 편수까지
const MIN_H = 1900;       // 원본 세로 픽셀 하한
const PAL = { bg0: '#f4efe4', bg1: '#e9e2d3', ink: '#1d1a16', muted: '#6b6458', accent: '#d4472b', accent2: '#2b5d8a', surface: '#fbf8f1', line: 'rgba(29,26,22,.18)' };
const GOOD = '#1f4a73', BAD = '#b53a1f';
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif';
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

const LINES = ['국내에서는 이 압력을 psi 로 말합니다', '이 부품이 낡으면 이런 소리가 납니다', '공식 자료의 점검 주기는 이렇습니다', '원본에 없는 주의사항 한 가지입니다'];
const URL0 = 'https://example.com/원본-영상', WHO = 'maker_a', NAME = '시연 원작자';
const NOTE = '이 영상은 원작자의 시연 영상에 한국어 해설과 국내 기준 정보를 더해 다시 편집했습니다.';
const CANDS = [
  { id: '후보 1', who: 'maker_a', today: 0, week: 1, kr: 0, h: 1912 },
  { id: '후보 2', who: 'maker_a', today: 1, week: 2, kr: 0, h: 1920 },
  { id: '후보 3', who: 'maker_b', today: 0, week: 0, kr: 82000, h: 1920 },
  { id: '후보 4', who: 'maker_c', today: 0, week: 0, kr: 23000, h: 1920 },
  { id: '후보 5', who: 'maker_d', today: 0, week: 1, kr: 0, h: 1280 },
];
const manTxt = (n) => (n >= 10000 ? (n / 10000) + '만' : String(n));
function why(c) {         // 거르는 이유 하나(없으면 null)
  if (c.today >= DAY_CAP) return `같은 원작자 오늘 ${c.today}편 이미`;
  if (c.week >= WEEK_CAP) return `7일 ${c.week}편 이미`;
  if (c.kr >= KR_LIMIT) return `한국어 같은 소재 ${manTxt(c.kr)}회, 상한 ${manTxt(KR_LIMIT)}`;
  if (c.h < MIN_H) return `세로 ${c.h}px, 하한 ${MIN_H}`;
  return null;
}

function vgrad(g, y0, y1, stops) { const q = g.createLinearGradient(0, y0, 0, y1); stops.forEach(([o, c]) => q.addColorStop(o, c)); return q; }
function glow(g, x, y, r, c, a) { const q = g.createRadialGradient(x, y, 0, x, y, r); q.addColorStop(0, rgba(c, a)); q.addColorStop(1, rgba(c, 0)); g.fillStyle = q; g.fillRect(x - r, y - r, r * 2, r * 2); }
function trees(g, y0, step, hmin, hmax, col, seed) {
  const r = rng(seed); g.fillStyle = col; g.beginPath(); g.moveTo(-5, 190); let x = -5;
  while (x < 325) { const w = step * (0.7 + r() * 0.9), h = (hmin + r() * (hmax - hmin)) * (0.55 + 0.45 * Math.sin(x * 0.045 + seed) * Math.sin(x * 0.013)); g.lineTo(x, y0); g.lineTo(x + w * 0.5, y0 - h); x += w; }
  g.lineTo(325, y0); g.lineTo(325, 190); g.fill();
}
function ridge(g, y0, a1, f1, p1, col, seed) { const r = rng(seed); g.fillStyle = col; g.beginPath(); g.moveTo(-5, 190); for (let x = -5; x <= 325; x += 5) g.lineTo(x, y0 - a1 * Math.sin(x * f1 + p1) - 5 * Math.sin(x * 0.1) + r() * 2); g.lineTo(325, 190); g.fill(); }
function strokes(g, n, seed, y0, span, cols) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) { const f = Math.pow(r(), 1.3), y = y0 + f * span, len = 8 + r() * 30 * (0.4 + f), x = r() * 320; g.strokeStyle = cols[i % cols.length].replace('A', (0.08 + 0.14 * r()).toFixed(2)); g.lineWidth = 0.6 + f; g.beginPath(); g.moveTo(x - len / 2, y); g.lineTo(x + len / 2, y); g.stroke(); }
}
function lake(g) {      // 원작자가 찍은 화면을 대신하는 정지 사진 느낌의 장면: 하늘 층, 해 번짐, 능선, 물결
  g.fillStyle = vgrad(g, 0, 108, [[0, '#2a3a6e'], [0.55, '#8a6a9a'], [0.9, '#f3a98a'], [1, '#ffd9a8']]); g.fillRect(0, 0, 320, 110);
  glow(g, 215, 100, 90, '#ffe0b0', 0.55); glow(g, 215, 100, 34, '#fff2d0', 0.8);
  ridge(g, 96, 12, 0.03, 1, '#7b6a98', 3); ridge(g, 104, 15, 0.021, 2.2, '#3f4a74', 4); trees(g, 109, 2.6, 6, 15, '#3a3a66', 15); trees(g, 111, 3.4, 8, 22, '#14203a', 5);
  g.fillStyle = vgrad(g, 108, 180, [[0, '#d58a82'], [0.25, '#7d6a90'], [1, '#1c2d58']]); g.fillRect(0, 108, 320, 72);
  strokes(g, 90, 6, 110, 66, ['rgba(255,226,190,A)', 'rgba(14,24,52,A)']);
}
let GRAIN = null;
function photo(x, X, Y, W, H) {      // 세로 틀 안에 장면을 꽉 채운다(가운데 해 쪽을 자른다), 가장자리 어둡힘과 그레인
  x.save(); x.beginPath(); x.roundRect(X, Y, W, H, 8); x.clip(); x.translate(X, Y); const k = H / 180; x.scale(k, k); x.translate(-(215 - W / k / 2), 0); lake(x);
  x.setTransform(2, 0, 0, 2, 0, 0); x.translate(X, Y);
  const v = x.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.34)'); x.fillStyle = v; x.fillRect(0, 0, W, H);
  x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.16; x.drawImage(GRAIN, 0, 0, W, H); x.restore();
}
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function card(x, X, Y, W, H) { x.save(); x.shadowColor = 'rgba(29,26,22,.12)'; x.shadowBlur = 8; x.shadowOffsetY = 2; x.fillStyle = PAL.surface; x.beginPath(); x.roundRect(X, Y, W, H, 5); x.fill(); x.restore(); x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.roundRect(X, Y, W, H, 5); x.stroke(); }
function wrap(x, s, maxW) { const out = []; let cur = ''; for (const ch of s) { if (x.measureText(cur + ch).width > maxW && cur) { out.push(cur); cur = ch.trim() ? ch : ''; } else cur += ch; } if (cur) out.push(cur); return out; }
function mark(x, ok, X, Y, a) {      // 체크와 가위표를 선으로 그린다(글꼴 글리프 아님)
  x.save(); x.globalAlpha = a; x.strokeStyle = ok ? GOOD : BAD; x.lineWidth = 2; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
  if (ok) { x.moveTo(X - 4, Y); x.lineTo(X - 1, Y + 3.5); x.lineTo(X + 5, Y - 4); } else { x.moveTo(X - 4, Y - 4); x.lineTo(X + 4, Y + 4); x.moveTo(X + 4, Y - 4); x.lineTo(X - 4, Y + 4); }
  x.stroke(); x.restore();
}
const P = (t, a, d) => seg(t, a, a + d);
const STEP = ['원본 그대로 올림', '한국어 해설을 더함', '설명란에 원본을 적음', '소재를 먼저 거름'];

const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 4,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(41), gc = document.createElement('canvas'); gc.width = 192; gc.height = 340;
    const gx = gc.getContext('2d'), gd = gx.createImageData(192, 340);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const lab = el('div', null, sp);   // 이름표(vertical): 왼쪽 가장자리 세로쓰기, 번호는 muted, 지금 항목은 ink
    Object.assign(lab.style, { position: 'absolute', left: '6px', top: '14px', writingMode: 'vertical-rl', letterSpacing: '.06em', whiteSpace: 'nowrap', lineHeight: '12px', zIndex: '4' });
    const idx = el('span', null, lab), pill = el('span', null, lab);
    Object.assign(idx.style, { color: PAL.muted, font: "500 12px/1 'JetBrains Mono',monospace", marginBottom: '8px' });
    Object.assign(pill.style, { color: PAL.ink, font: "600 12px/1 'IBM Plex Sans KR',sans-serif" });
    return { main, idx, pill };
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 4 : lv);   // 0(연출 전)은 1단계와 같은 '원본 그대로'
    t = t > 0 ? t : 0;
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'multiply'; x.globalAlpha = 0.07; for (let gy0 = 0; gy0 < 360; gy0 += 340) for (let gx0 = 0; gx0 < 640; gx0 += 192) x.drawImage(GRAIN, gx0, gy0, 192, 340); x.restore();
    const facts = L >= 2 ? Math.min(NARR, LINES.length) : 0;
    const pass = CANDS.filter((c) => !why(c)).length, facts4 = Math.min(NARR, LINES.length);
    // 왼쪽: 세로 틀(원본 화면 + 해설 자막)
    const FX = 30, FY = 10, FW = 170, FH = 340;
    x.save(); x.shadowColor = 'rgba(29,26,22,.34)'; x.shadowBlur = 14; x.shadowOffsetY = 5; x.fillStyle = '#222'; x.beginPath(); x.roundRect(FX, FY, FW, FH, 9); x.fill(); x.restore();
    photo(x, FX, FY, FW, FH); x.setTransform(2, 0, 0, 2, 0, 0);
    if (L >= 2) {
      const cur = Math.max(0, Math.min(facts - 1, Math.floor((t - 0.7) / 1.0)));
      const k = E.outC(P(t, 0.7 + cur * 1.0, 0.3)); x.font = `800 11px ${SANS}`;
      const ls = wrap(x, LINES[cur], FW - 26); x.save(); x.globalAlpha = Math.min(1, k + (cur > 0 ? 1 : 0)); x.textAlign = 'center'; x.lineJoin = 'round';
      ls.forEach((ln, i) => { const Y = FY + FH * 0.62 + i * 15 + (1 - k) * 4; x.strokeStyle = 'rgba(15,12,10,.85)'; x.lineWidth = 3.4; x.strokeText(ln, FX + FW / 2, Y); x.fillStyle = '#fff'; x.fillText(ln, FX + FW / 2, Y); });
      x.restore();
    }
    T(x, L >= 2 ? '해설 자막이 얹힌 화면' : '원본 화면 그대로', FX + FW / 2, FY + FH - 10, 10, 'rgba(255,255,255,.9)', 600, 'center');
    // 오른쪽 위: 확인표(코드가 센다)
    const RX = 218, RW = 404;
    card(x, RX, 10, RW, 104);
    T(x, '원본과 달라진 곳', RX + 12, 27, 10.5, PAL.muted, 500, 'left', MONO);
    const rows = [
      ['한국어 해설 줄, 원본에 없는 사실', `${facts}개`, facts >= FACT_MIN, L >= 2, `기준 ${FACT_MIN}개 이상`],
      ['설명란에 원본 이름, 아이디, 주소', L >= 3 ? '3칸 모두' : '비어 있음', L >= 3, L >= 3, ''],
      ['설명란 한 줄 문구', L >= 3 ? '있음' : '없음', L >= 3, L >= 3, ''],
      ['소재 거르기', L >= 4 ? `${pass}/${CANDS.length} 통과` : '거르지 않음', L >= 4, L >= 4, ''],
    ];
    rows.forEach(([nm, val, ok, shown, note], i) => {
      const Y = 46 + i * 17, ap = E.outC(P(t, 0.15 + i * 0.12, 0.35)), good = ok && shown;
      x.save(); x.globalAlpha = ap; mark(x, good, RX + 18, Y - 4, 1);
      T(x, nm, RX + 32, Y, 11, PAL.ink, 500); T(x, val, RX + RW - 12 - (note ? 76 : 0), Y, 11, good ? GOOD : BAD, 700, 'right', MONO);
      if (note) T(x, note, RX + RW - 12, Y, 9.5, PAL.muted, 500, 'right');
      x.restore();
    });
    // 오른쪽 아래: 단계별 큰 카드
    const CY = 122, CH = 228; card(x, RX, CY, RW, CH);
    if (L <= 1) {
      T(x, '시청자가 보는 것', RX + 12, CY + 18, 10.5, PAL.muted, 500, 'left', MONO);
      [['원작자 영상', 0], ['내가 올린 영상', 1]].forEach(([nm, k]) => {
        const X0 = RX + 54 + k * 160, ap = E.outC(P(t, 0.3 + k * 0.3, 0.5)); x.save(); x.globalAlpha = ap;
        photo(x, X0, CY + 28, 84, 148); x.setTransform(2, 0, 0, 2, 0, 0); T(x, nm, X0 + 42, CY + 190, 10.5, PAL.ink, 600, 'center'); x.restore();
      });
      T(x, `더한 것: 해설 ${facts}줄, 설명란 0칸, 거르기 없음`, RX + 12, CY + 212, 11, BAD, 600);
    } else if (L === 2) {
      T(x, `해설 ${facts}줄, 줄마다 원본에 없는 사실 1개`, RX + 12, CY + 18, 10.5, PAL.muted, 500, 'left', MONO);
      for (let i = 0; i < Math.max(1, facts); i++) {
        const ap = E.outC(P(t, 0.5 + i * 0.4, 0.4)), Y = CY + 32 + i * 34; x.save(); x.globalAlpha = ap; x.translate((1 - ap) * 10, 0);
        x.fillStyle = rgba('#2b5d8a', 0.12); x.beginPath(); x.roundRect(RX + 12, Y, RW - 24, 28, 4); x.fill();
        T(x, `사실 ${i + 1}`, RX + 22, Y + 18, 10, GOOD, 700, 'left', MONO); T(x, LINES[i], RX + 74, Y + 18, 11.5, PAL.ink, 500); x.restore();
      }
      const okF = facts >= FACT_MIN;
      T(x, `원본에 없는 사실 ${facts}개, 기준 ${FACT_MIN}개 이상(제작자 지시)`, RX + 12, CY + 200, 11, okF ? GOOD : BAD, 700);
      T(x, '해설은 원본 소리를 옮긴 번역이 아니라 새로 쓴 문장이다', RX + 12, CY + 217, 10, PAL.muted, 500);
    } else if (L === 3) {
      T(x, '유튜브 설명란(제작 코드의 형식)', RX + 12, CY + 18, 10.5, PAL.muted, 500, 'left', MONO);
      const body = [LINES[0], '', `원본 영상: ${NAME} (@${WHO}) ${URL0}`, NOTE];
      x.save(); x.fillStyle = PAL.bg0; x.beginPath(); x.roundRect(RX + 12, CY + 28, RW - 24, 134, 4); x.fill(); x.strokeStyle = PAL.line; x.stroke(); x.restore();
      let Y = CY + 46; x.font = `500 11px ${SANS}`; const ap = P(t, 0.4, 1.8); let shown = 0; const total = body.join('').length;
      body.forEach((ln, i) => {
        const wr = ln ? wrap(x, ln, RW - 48) : [''];
        wr.forEach((w) => { const take = Math.max(0, Math.min(w.length, Math.floor(ap * total) - shown)); shown += w.length;
          T(x, w.slice(0, take), RX + 22, Y, 11, i === 2 ? GOOD : PAL.ink, i === 2 ? 700 : 500); Y += 15; });
      });
      const inc = body.join('\n').includes(URL0);
      x.save(); x.globalAlpha = E.outC(P(t, 2.4, 0.4));
      mark(x, inc, RX + 20, CY + 182, 1); T(x, inc ? '원본 주소가 들어 있어 올린다' : '원본 주소가 없어 올리지 않는다', RX + 34, CY + 186, 11, inc ? GOOD : BAD, 700);
      T(x, '제작 코드는 주소가 빠지면 오류로 멈춘다', RX + 12, CY + 212, 10, PAL.muted, 500); x.restore();
    } else {
      T(x, '소재 후보 거르기(후보는 예시, 기준값은 제작 기록)', RX + 12, CY + 18, 10.5, PAL.muted, 500, 'left', MONO);
      CANDS.forEach((c, i) => {
        const Y = CY + 26 + i * 28, ap = E.outC(P(t, 0.3 + i * 0.25, 0.4)), w = why(c); x.save(); x.globalAlpha = ap; x.translate((1 - ap) * 8, 0);
        x.fillStyle = w ? rgba('#d4472b', 0.3) : '#ffffff'; x.beginPath(); x.roundRect(RX + 12, Y, RW - 24, 24, 4); x.fill();
        x.strokeStyle = w ? rgba('#b53a1f', 0.5) : PAL.line; x.lineWidth = 1; x.stroke();
        if (!w) { x.fillStyle = GOOD; x.beginPath(); x.roundRect(RX + 12, Y, 4, 24, 2); x.fill(); }
        T(x, c.id, RX + 24, Y + 16, 10.5, PAL.ink, 700); T(x, '@' + c.who, RX + 72, Y + 16, 10.5, PAL.muted, 500, 'left', MONO);
        T(x, w ? '뺀다' : '통과', RX + 138, Y + 16, 11, w ? BAD : GOOD, 700); T(x, w || `세로 ${c.h}px, 오늘 ${c.today}편`, RX + 174, Y + 16, 10.5, w ? BAD : PAL.ink, 500);
        x.restore();
      });
      T(x, '이 편의 해설', RX + 12, CY + 187, 10.5, PAL.muted, 500, 'left', MONO);
      for (let i = 0; i < facts4; i++) {
        const ap = E.outC(P(t, 1.8 + i * 0.2, 0.4)); x.save(); x.globalAlpha = ap;
        x.fillStyle = rgba('#2b5d8a', 0.22); x.beginPath(); x.roundRect(RX + 96 + i * 76, CY + 173, 70, 20, 4); x.fill();
        T(x, `사실 ${i + 1}`, RX + 131 + i * 76, CY + 187, 10.5, GOOD, 700, 'center'); x.restore();
      }
      T(x, `${CANDS.length}개 중 ${pass}개 통과. 이 숫자는 정책 통과가 아니라 우리 쪽 거름망이다`, RX + 12, CY + 216, 10.5, PAL.muted, 500);
    }
    s.idx.textContent = '0' + Math.max(1, L); s.pill.textContent = STEP[Math.max(1, L) - 1];
  },
};
export default demo;
