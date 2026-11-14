/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/first-30-seconds/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 롱폼 앞 30초: 장면표를 코드가 읽어 결과·요점이 처음 나오는 시각, 정지 시간, 열린 질문, 6장 칸을 센다.
// 화면의 초와 퍼센트와 칸 수는 전부 아래 장면표에서 계산한다. 장면표는 이 데모가 정한 가정이고 실제 편의 값이 아니다.
const HOOK_S = 30;        // 앞 구간 길이(초)
const RESULT_LEN = 4.5;   // 결과 장면 길이(초)
const POINT_LEN = 4.5;    // 요점 한 줄 장면 길이(초)
const RACE_LEN = 14;       // 두 결과가 동시에 도는 장면 길이(초)
const ASK_LEN = 7;        // 열린 질문 장면 길이(초)
const CHAP_LEN = 1.8;     // 장 표지 길이(초)
const RESULT_BY = 1.5;    // 결과가 화면에 나와야 하는 시각(초)
const POINT_BY = 10;      // 요점 한 줄이 나와야 하는 시각(초)
const STILL_MAX = 50;     // 앞 30초 정지 비율 상한(%)
const VIEW_S = 40;        // 띠가 보여 주는 전체 구간(초)
const PAL = { bg0: '#1f3a8a', bg1: '#172a63', ink: '#f3f6ff', muted: '#aebcf0', accent: '#ffd166', accent2: '#7fe0ff', surface: '#1b3274', line: 'rgba(243,246,255,.20)' };
const GOOD = '#7fe6a8', BAD = '#ff9a8a', DIM = '#3d5498', SCBG = '#102060';
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif', HAN = '"Black Han Sans", sans-serif';
const FR = [0, 5, 10, 15, 20, 30];      // 장면표 6장의 시각(초)
const RACE = [6.03, 2.57];              // [기록] 두 실제 영상의 빈 시간 합(초), 각 1회 측정

// 장면 종류: still 정지, res 약속한 결과가 보임, pt 요점 한 줄이 보임, q 열린 질문
const KIND = {
  cmp: { n: '비교 정지', still: 1 }, circle: { n: '원 그리기' }, chapter: { n: '장 표지', still: 1 }, explain: { n: '정지+자막', still: 1, pt: 1 },
  demo: { n: '움직이는 시연', res: 1 }, result: { n: '결과 먼저', res: 1 }, point: { n: '요점 한 줄', pt: 1 }, race: { n: '두 결과 경주', res: 1 }, ask: { n: '열린 질문', q: 1 },
};
const BEFORE = [['cmp', 0, 7], ['circle', 7, 11], ['cmp', 11, 18], ['chapter', 18, 19.8], ['explain', 19.8, 36], ['demo', 36, VIEW_S]];
function afterList() {
  let t = 0; const L = [];
  [['result', RESULT_LEN], ['point', POINT_LEN], ['race', RACE_LEN], ['ask', ASK_LEN], ['chapter', CHAP_LEN]].forEach(([k, d]) => { L.push([k, t, t + d]); t += d; });
  L.push(['demo', t, Math.max(VIEW_S, t + 1)]); return L;
}
const sceneAt = (L, t) => L.find((s) => t >= s[1] && t < s[2]) || L[L.length - 1];
const firstOf = (L, f) => { const s = L.find((q) => KIND[q[0]][f]); return s ? s[1] : null; };
const stillPct = (L) => L.reduce((a, [k, s, e]) => a + (KIND[k].still ? Math.max(0, Math.min(e, HOOK_S) - Math.min(s, HOOK_S)) : 0), 0) / HOOK_S * 100;
const askCount = (L) => L.filter(([k, s]) => KIND[k].q && s < HOOK_S).length;
const resFrames = (L) => FR.filter((t) => KIND[sceneAt(L, t)[0]].res).length;
const ROWS = [
  { n: '결과가 처음 보이는 시각', u: '초', std: `${RESULT_BY}초 이하 · 지시`, f: (L) => firstOf(L, 'res'), ok: (v) => v !== null && v <= RESULT_BY, lv: 1, d: 1 },
  { n: '요점 한 줄이 처음 보이는 시각', u: '초', std: `${POINT_BY}초 이하 · 제안`, f: (L) => firstOf(L, 'pt'), ok: (v) => v !== null && v <= POINT_BY, lv: 2, d: 1 },
  { n: '앞 30초 중 정지한 시간', u: '%', std: `${STILL_MAX}% 이하 · 잠정`, f: stillPct, ok: (v) => v <= STILL_MAX, lv: 2, d: 0 },
  { n: '앞 30초 안의 열린 질문', u: '개', std: '1개 이상 · 제안', f: askCount, ok: (v) => v >= 1, lv: 3, d: 0 },
  { n: '6장 중 결과가 보이는 칸', u: '/6', std: '기준 없음 · 참고', f: resFrames, ok: null, lv: 3, d: 0 },
];
const fmt = (v, d, u) => (v === null ? '없음' : v.toFixed(d) + u);

const hx = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const mixc = (a, b, p) => { const A = hx(a), B = hx(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], p)).toString(16).padStart(2, '0')).join(''); };
function rr(x, X, Y, W, H, r) { x.beginPath(); x.roundRect(X, Y, Math.max(0, W), Math.max(0, H), Math.max(0, Math.min(r, W / 2, H / 2))); }
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.textBaseline = 'alphabetic'; x.fillText(s, X, Y); }
function bar(x, X, Y, w, h, col, a) { x.save(); x.globalAlpha = a == null ? 1 : a; x.fillStyle = col; rr(x, X, Y, w, h, Math.min(h / 2, 5)); x.fill(); x.restore(); }
function lift(x, X, Y, W, H, r, fill, n) {   // 겹쳐 그린 반투명 사각형 그림자(blur 그림자는 헤드리스에서 캔버스를 지울 수 있어 쓰지 않는다)
  for (let i = n || 3; i >= 1; i--) { x.fillStyle = `rgba(4,10,40,${0.07 + (4 - i) * 0.02})`; rr(x, X - i * 0.6, Y + i * 1.1, W + i * 1.2, H + i * 1.2, r + i); x.fill(); }
  x.fillStyle = fill; rr(x, X, Y, W, H, r); x.fill();
}

function pageMock(x, X, Y, W, H, good, k) {   // 홈페이지 목업 한 장. good 이면 짜임새 있는 쪽, k 는 빛이 훑는 위치(0~1)
  lift(x, X, Y, W, H, 3, good ? '#f6f1e7' : '#dcdcdc', 2);
  const s = W / 100;
  bar(x, X + 6 * s, Y + 5 * s, 22 * s, 4 * s, good ? '#1d1a16' : '#8a8a8a', 0.9);
  [0, 1, 2].forEach((i) => bar(x, X + W - (10 + i * 14) * s, Y + 5.5 * s, 10 * s, 3 * s, good ? '#6b6458' : '#9a9a9a', 0.8));
  bar(x, X + 6 * s, Y + 15 * s, 62 * s, 7 * s, good ? '#1d1a16' : '#7a7a7a', 0.92);
  bar(x, X + 6 * s, Y + 25 * s, 42 * s, 3.5 * s, good ? '#6b6458' : '#9a9a9a', 0.8);
  const hy = Y + 34 * s, hh = H - 34 * s - 28 * s;
  if (good) {
    const g = x.createLinearGradient(X, hy, X + W, hy + hh); g.addColorStop(0, '#c4381e'); g.addColorStop(1, '#ff8f5f');
    x.fillStyle = g; rr(x, X + 6 * s, hy, W - 12 * s, hh, 4); x.fill();
    x.save(); rr(x, X + 6 * s, hy, W - 12 * s, hh, 4); x.clip();
    const sx = X + lerp(-30 * s, W, k), lg = x.createLinearGradient(sx, 0, sx + 30 * s, 0); lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(0.5, 'rgba(255,255,255,.28)'); lg.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = lg; x.fillRect(sx, hy, 30 * s, hh); x.restore();
    bar(x, X + 12 * s, hy + hh * 0.3, 40 * s, 4 * s, '#fff', 0.95); bar(x, X + 12 * s, hy + hh * 0.55, 28 * s, 3 * s, '#fff', 0.8);
  } else { x.fillStyle = '#b4b4b4'; rr(x, X + 6 * s, hy, W - 12 * s, hh, 2); x.fill(); }
  const cw = (W - 12 * s - 2 * 4 * s) / 3, cy = Y + H - 24 * s;
  for (let i = 0; i < 3; i++) { const cx = X + 6 * s + i * (cw + 4 * s); if (good) lift(x, cx, cy, cw, 19 * s, 2, '#ffffff', 1); else { x.fillStyle = '#c8c8c8'; rr(x, cx, cy, cw, 19 * s, 1); x.fill(); } bar(x, cx + 3 * s, cy + 5 * s, cw * 0.6, 3 * s, good ? '#1d1a16' : '#8c8c8c', 0.8); }
}

function drawScene(x, kind, X, Y, W, H, lt, big) {   // 장면 한 칸(thumbs 와 큰 미리보기가 같이 쓴다)
  x.save(); rr(x, X, Y, W, H, 4); x.clip();
  const g = x.createLinearGradient(0, Y, 0, Y + H); g.addColorStop(0, '#16307a'); g.addColorStop(1, SCBG); x.fillStyle = g; x.fillRect(X, Y, W, H);
  const k = (lt * 0.35) % 1;
  if (kind === 'cmp' || kind === 'circle') {
    pageMock(x, X + W * 0.05, Y + H * 0.1, W * 0.42, H * 0.78, false, 0); pageMock(x, X + W * 0.53, Y + H * 0.1, W * 0.42, H * 0.78, true, 0);
    if (kind === 'circle') { const p = E.inOutC(seg(lt, 0, 3.2)); x.strokeStyle = PAL.accent; x.lineWidth = big ? 3 : 1.6; x.beginPath(); x.ellipse(X + W * 0.74, Y + H * 0.5, W * 0.25, H * 0.42, 0, -Math.PI / 2, -Math.PI / 2 + p * Math.PI * 2); x.stroke(); }
  } else if (kind === 'chapter') {
    if (big) T(x, '01', X + W / 2, Y + H * 0.58, H * 0.42, PAL.ink, 400, 'center', HAN); else T(x, '01', X + W / 2, Y + H * 0.64, H * 0.36, PAL.ink, 400, 'center', HAN);
    bar(x, X + W * 0.3, Y + H * 0.74, W * 0.4 * E.outC(seg(lt, 0.1, 0.8)), Math.max(2, H * 0.03), PAL.accent, 1);
  } else if (kind === 'explain') {
    pageMock(x, X + W * 0.08, Y + H * 0.08, W * 0.5, H * 0.66, true, 0);
    bar(x, X + W * 0.64, Y + H * 0.16, W * 0.28, H * 0.05, PAL.ink, 0.8); bar(x, X + W * 0.64, Y + H * 0.3, W * 0.22, H * 0.04, PAL.muted, 0.7);
    x.fillStyle = 'rgba(8,16,52,.78)'; x.fillRect(X, Y + H * 0.82, W, H * 0.18); bar(x, X + W * 0.1, Y + H * 0.88, W * 0.8, H * 0.05, PAL.ink, 0.85);
  } else if (kind === 'demo') {
    pageMock(x, X + W * 0.06, Y + H * 0.1, W * 0.4, H * 0.78, true, k); pageMock(x, X + W * 0.54, Y + H * 0.1, W * 0.4, H * 0.78, true, (k + 0.5) % 1);
  } else if (kind === 'result') {
    pageMock(x, X + W * 0.14, Y + H * 0.17, W * 0.72, H * 0.8, true, k * 1.4 % 1);
    x.fillStyle = 'rgba(8,16,52,.72)'; rr(x, X + W * 0.1, Y + H * 0.03, W * 0.8, H * 0.18, 3); x.fill();
    if (big) T(x, '단어 5개면 이렇게 바뀐다', X + W / 2, Y + H * 0.165, H * 0.1, PAL.accent, 700, 'center'); else bar(x, X + W * 0.2, Y + H * 0.09, W * 0.6, H * 0.06, PAL.accent, 0.95);
  } else if (kind === 'point') {
    const a = E.outC(seg(lt, 0.1, 0.7)), b = E.outC(seg(lt, 0.5, 1.2));
    lift(x, X + W * 0.06, Y + H * 0.2, W * 0.36, H * 0.6, 3, '#f6f1e7', 2); lift(x, X + W * 0.58, Y + H * 0.2, W * 0.36, H * 0.6, 3, '#f6f1e7', 2);
    bar(x, X + W * 0.1, Y + H * 0.42, W * 0.28 * a, H * 0.07, '#1d1a16', 0.9);
    [0, 1, 2, 3].forEach((i) => bar(x, X + W * 0.62, Y + H * (0.3 + i * 0.11), W * 0.28 * b, H * 0.06, '#d4472b', 0.9));
    if (big) { T(x, '한 줄', X + W * 0.24, Y + H * 0.17, H * 0.08, PAL.ink, 600, 'center'); T(x, '숫자 네 개', X + W * 0.76, Y + H * 0.17, H * 0.08, PAL.ink, 600, 'center'); }
    T(x, 'vs', X + W / 2, Y + H * 0.54, big ? H * 0.09 : H * 0.14, PAL.accent, 700, 'center', MONO);
  } else if (kind === 'race') {
    const p = E.inOutC(seg(lt, 0.2, RACE_LEN * 0.85));
    [0, 1].forEach((i) => {
      const bx = X + W * (0.05 + i * 0.5);
      pageMock(x, bx, Y + H * 0.08, W * 0.4, H * 0.58, i === 1, (k + i * 0.3) % 1);
      bar(x, bx, Y + H * 0.76, W * 0.4, H * 0.07, 'rgba(243,246,255,.18)', 1); bar(x, bx, Y + H * 0.76, W * 0.4 * p * (RACE[i] / RACE[0]), H * 0.07, i ? PAL.accent2 : BAD, 1);
      if (big) T(x, `빈 시간 ${(RACE[i] * p).toFixed(1)}초`, bx, Y + H * 0.95, H * 0.075, PAL.ink, 600, 'left', MONO);
    });
  } else if (kind === 'ask') {
    const a = E.outBack(seg(lt, 0, 0.8));
    x.save(); x.translate(X + W / 2, Y + H * 0.56); x.scale(a, a); T(x, big ? '뭐가 달랐을까?' : '?', 0, big ? H * 0.12 : H * 0.18, big ? H * 0.17 : H * 0.62, PAL.ink, big ? 700 : 400, 'center', big ? SANS : HAN); x.restore();
  }
  x.restore();
}
const segCol = (k) => (KIND[k].res ? PAL.accent : KIND[k].q || (KIND[k].pt && !KIND[k].still) ? PAL.accent2 : KIND[k].still ? DIM : 'rgba(243,246,255,.55)');

const NUM = ['0', '1', '2', '3', '4'];
const DESC = ['장면표만 있고 아직 안 잼', '결과가 처음 보이는 시각', '요점 시각과 정지한 시간', '열린 질문과 6장 칸', '고친 장면표로 같은 칸을 다시'];
const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 4,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(11), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0);
    const pill = el('div', null, sp);
    Object.assign(pill.style, { position: 'absolute', left: '20px', top: '10px', padding: '4px 12px', borderRadius: '999px', background: PAL.surface, border: `1px solid ${PAL.line}`, font: "600 12px/1.3 'IBM Plex Sans KR',sans-serif", color: PAL.ink, zIndex: '4', whiteSpace: 'nowrap' });
    return { main, pill, gc };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 0 : (lv == null ? 4 : lv), after = L >= 4;
    const list = after ? afterList() : BEFORE;
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.setLineDash([]);
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.07;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(s.gc, gx0, gy0, 128, 128);
    x.restore();
    const enter = after ? E.outC(seg(t, 0, 0.6)) : 1;
    x.save(); x.globalAlpha = 0.35 + 0.65 * enter;
    // 큰 미리보기: 재생 머리가 지금 있는 장면
    const ph = E.inOutC(seg(t, 0.3, 4.3)) * HOOK_S, cur = sceneAt(list, ph);
    drawScene(x, cur[0], 20, 46, 240, 135, ph - cur[1], true);
    x.fillStyle = 'rgba(8,16,52,.82)'; rr(x, 148, 50, 108, 16, 8); x.fill(); T(x, `${ph.toFixed(1)}초 ${KIND[cur[0]].n}`, 252, 61.5, 9.5, PAL.ink, 600, 'right', MONO);
    // 장면 띠
    const BX = 20, BW = 600, BY = 206, BH = 20, px = (v) => BX + v / VIEW_S * BW;
    T(x, `장면 띠 0~${VIEW_S}초 (노랑 결과, 하늘 질문과 요점 시작, 남색 정지)`, BX, 198, 9, PAL.muted, 500, 'left', MONO);
    list.forEach(([k, s0, e0]) => { const a0 = Math.min(s0, VIEW_S), b0 = Math.min(e0, VIEW_S); if (b0 > a0) bar(x, px(a0) + 0.5, BY, px(b0) - px(a0) - 1, BH, segCol(k), 0.95); });
    list.forEach(([k, s0]) => { if (KIND[k].pt && KIND[k].still && s0 < VIEW_S) { x.fillStyle = PAL.accent2; x.fillRect(px(s0), BY - 3, 3, BH + 6); } });
    x.setLineDash([3, 2]); x.strokeStyle = PAL.ink; x.lineWidth = 1; x.beginPath(); x.moveTo(px(HOOK_S), BY - 4); x.lineTo(px(HOOK_S), BY + BH + 4); x.stroke(); x.setLineDash([]);
    T(x, '30초', px(HOOK_S) + 4, BY + BH + 12, 9, PAL.ink, 600, 'left', MONO);
    x.fillStyle = PAL.ink; x.fillRect(px(ph) - 1, BY - 3, 2, BH + 6);
    // 장면표 6장
    const TW = 90, TH = 50, GAP = (600 - 6 * TW) / 5;
    FR.forEach((ft, i) => {
      const sc = sceneAt(list, ft), tx = BX + i * (TW + GAP), ty = 248, res = KIND[sc[0]].res;
      drawScene(x, sc[0], tx, ty, TW, TH, ft - sc[1], false);
      x.strokeStyle = res ? PAL.accent : PAL.line; x.lineWidth = res ? 2 : 1; rr(x, tx + 0.5, ty + 0.5, TW - 1, TH - 1, 4); x.stroke();
      T(x, `${ft}초`, tx, ty + TH + 13, 10, PAL.ink, 700, 'left', MONO); T(x, KIND[sc[0]].n, tx, ty + TH + 25, 10, PAL.muted, 500);
    });
    x.restore();
    // 오른쪽: 잰 값 5줄
    const RX = 276, RW = 344;
    ROWS.forEach((r, i) => {
      const y = 50 + i * 27, vis = L >= r.lv, k = vis ? (L === r.lv ? E.outC(seg(t, 0.3, 0.9)) : 1) : 0;
      x.save(); x.globalAlpha = vis ? 1 : 0.5; x.fillStyle = 'rgba(8,16,52,.45)'; rr(x, RX, y, RW, 24, 5); x.fill(); x.strokeStyle = PAL.line; x.lineWidth = 1; rr(x, RX + 0.5, y + 0.5, RW - 1, 23, 5); x.stroke(); x.restore();
      T(x, r.n, RX + 8, y + 10, 10.5, PAL.ink, 600); T(x, r.std, RX + 8, y + 20, 8.5, PAL.muted, 500, 'left', MONO);
      x.save(); x.globalAlpha = vis ? 0.25 + 0.75 * k : 1;
      if (!vis) T(x, '—', RX + RW - 8, y + 15, 12, PAL.muted, 600, 'right', MONO);
      else {
        const b = r.f(BEFORE), f = r.f(afterList()), okc = (v) => (r.ok ? (r.ok(v) ? GOOD : BAD) : PAL.ink);
        if (after) { T(x, `${fmt(b, r.d, r.u)} → ${fmt(f, r.d, r.u)}`, RX + RW - 8, y + 15, 12, okc(f), 700, 'right', MONO); }
        else T(x, fmt(b, r.d, r.u), RX + RW - 8, y + 15, 12, okc(b), 700, 'right', MONO);
      }
      x.restore();
    });
    T(x, after ? '후 값은 고친 장면표에서 센 값(이 데모의 가정)' : '장면표는 이 데모의 가정이고 실제 편의 값이 아니다', 20, 348, 9, PAL.muted, 500, 'left', MONO);
    s.pill.textContent = `${NUM[L]}  ${DESC[L]}`;
  },
};
export default demo;
