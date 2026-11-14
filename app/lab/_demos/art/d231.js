/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/screen-qa-three-widths/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 같은 앱 화면을 폭 320, 768, 1440 세 틀로 열어 가로 넘침, 대비, 상태 화면, 글꼴, 글자 크기, 여백을 센다.
// 틀 안의 배치와 넘친 px, 대비 비율, 채점 7칸의 숫자는 전부 코드가 이 장면에서 계산한다. 화면은 시간 t 의 함수다.
const W1 = 320, W2 = 768, W3 = 1440;   // 틀 폭(css px)
const VH = 800;                // 틀 높이(css px)
const SCALE = 0.2;             // 무대 배율: 틀 폭 x 0.2
const PADX = 16;               // 화면 좌우 여백(px)
const TABLE_W = 480;           // 연출 전 주문 표의 고정 폭(px)
const CARD_MIN = 140;          // 카드 한 칸 최소 폭(px)
const GAP = 16;                // 카드 사이(px)
const SWITCH_T = 3.0;          // 라이트에서 다크로 바뀌기 시작하는 시각(초)
const FADE = 0.6;              // 모드 전환 시간(초)
const STEP_S = 1.4;            // 자료, 빈 상태, 로딩, 오류가 바뀌는 간격(초)
const MIN_RATIO = 4.5;         // 글자 대비 기준
const PAL = { bg0: '#eef2f7', bg1: '#dfe6f0', ink: '#0f1b2d', muted: '#5a6a80', accent: '#2b6cff', accent2: '#ff8a3d', surface: '#ffffff', line: 'rgba(15,27,45,.16)' };
const MUTED2 = '#4a5a70', ACC_INK = '#1f56d6', BAD = '#b42318', GOOD = '#14683d';   // 작은 글자용 짙은 색(바탕 대비 5.2 이상)
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif', HAN = '"Black Han Sans", sans-serif';
const SYS_FONTS = ['Arial', '맑은 고딕', 'Malgun Gothic', '굴림', 'Times New Roman'];
const SCALE_T = [12, 14, 16, 20, 24, 32, 48, 64];

const hx = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const toHex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const mix = (a, b, p) => { const A = hx(a), B = hx(b); return toHex(A.map((v, i) => lerp(v, B[i], p))); };
const lum = (h) => { const [r, g, b] = hx(h).map((v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

// 검사받는 화면 두 벌: 연출 전(고치기 전)과 고친 뒤. 모드마다 색 한 벌
const LIGHT = { bg: '#f5f4f1', surface: '#ffffff', ink: '#1b1b1a', muted: '#62605b', accent: '#d92b12', on: '#ffffff' };
const DARK = { bg: '#15161a', surface: '#1f2127', ink: '#f1f0ec', muted: '#a3a29c', accent: '#ff7a5c', on: '#15161a' };
const BEFORE_LIGHT = { bg: '#f5f4f1', surface: '#ffffff', ink: '#1b1b1a', muted: '#a3a3a3', accent: '#e8553a', on: '#ffffff' };
const SPEC = {
  before: { fonts: ['Arial', '맑은 고딕'], sizes: [12, 13, 14, 15, 17, 26], gaps: [5, 12, 14, 16, 30], modes: [BEFORE_LIGHT], states: 0 },
  after: { fonts: ['Pretendard'], sizes: [12, 14, 16, 24], gaps: [8, 12, 16, 24], modes: [LIGHT, DARK], states: 3 },
};

function layout(W, fixed) {      // 틀 폭 W 에서 내용의 배치와 오른쪽으로 넘친 px
  const cw = Math.min(W - 2 * PADX, 1040), x0 = Math.max(PADX, (W - cw) / 2);
  const n = fixed ? Math.max(1, Math.floor((cw + GAP) / (CARD_MIN + GAP))) : 3;
  const needed = fixed ? CARD_MIN : Math.max(TABLE_W, 3 * CARD_MIN + 2 * GAP);
  const over = Math.max(0, Math.round(x0 + needed - W));
  return { cw, x0, n, over, culprit: fixed ? 'cards' : 'table' };
}
function metrics(ver) {          // 채점 7칸의 값. 모두 위 데이터에서 센다
  const sp = SPEC[ver], fixed = ver === 'after';
  const low = sp.modes.reduce((s, m) => s + [[m.ink, m.bg], [m.muted, m.bg], [m.on, m.accent]].filter(([a, b]) => ratio(a, b) < MIN_RATIO).length, 0);
  return [
    sp.fonts.filter((f) => SYS_FONTS.includes(f)).length, sp.sizes.filter((v) => !SCALE_T.includes(v)).length,
    sp.gaps.filter((v) => v % 4 !== 0).length, low, sp.modes.length, [W1, W2, W3].filter((W) => layout(W, fixed).over > 0).length, sp.states,
  ];
}
const CELLS = [['시스템 글꼴', '개', 4, '도구 없음'], ['스케일 밖 글자', '개', 4, '도구 없음'], ['4배수 아닌 여백', '개', 4, '도구 없음'],
  ['대비 4.5 미만', '곳', 2, '도구 없음'], ['라이트·다크', '/2', 2, '캡처만 함, 세지 않음'], ['3폭 가로 넘침', '폭', 1, '가로 스크롤만 셈'], ['빈·로딩·오류', '/3', 3, '도구 없음']];
const GOODV = [(v) => v === 0, (v) => v === 0, (v) => v === 0, (v) => v === 0, (v) => v === 2, (v) => v === 0, (v) => v === 3];

function rr(x, X, Y, W, H, r) { x.beginPath(); x.roundRect(X, Y, W, H, Math.max(0, Math.min(r, W / 2, H / 2))); }
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.textBaseline = 'alphabetic'; x.fillText(s, X, Y); }
function bar(x, X, Y, w, h, col, al) { x.save(); x.globalAlpha = al == null ? 1 : al; x.fillStyle = col; rr(x, X, Y, w, h, Math.min(h / 2, 6)); x.fill(); x.restore(); }
function cardBox(x, X, Y, W, H, r, fill) {
  x.save();
  [[0, 1, 2, 0.1], [0, 4, 10, 0.08], [0, 12, 26, 0.07]].forEach(([dx, dy, b, a]) => { x.shadowColor = `rgba(15,27,45,${a})`; x.shadowOffsetX = dx; x.shadowOffsetY = dy; x.shadowBlur = b; x.fillStyle = fill; rr(x, X, Y, W, H, r); x.fill(); });
  x.restore(); x.fillStyle = fill; rr(x, X, Y, W, H, r); x.fill();
}

let GRAIN = null;
function page(x, W, fixed, C, st, t) {   // 한 틀 안의 화면을 css px 좌표로 그린다(바깥에서 배율을 건다)
  const lo = layout(W, fixed), { cw, x0, n } = lo;
  const flat = (X, Y, w, h, r, fill) => { x.fillStyle = fill; rr(x, X, Y, w, h, r); x.fill(); x.strokeStyle = rgbaOf(C.ink, 0.1); x.lineWidth = 1.5; rr(x, X, Y, w, h, r); x.stroke(); };   // 틀 안은 그림자 없이(작은 배율에서 보이지 않고, 클립 안 그림자는 일부 환경에서 배경을 지운다)
  x.fillStyle = C.bg; x.fillRect(0, 0, W, VH);
  x.fillStyle = C.surface; x.fillRect(0, 0, W, 56); bar(x, PADX, 20, 72, 16, C.ink, 0.9);
  if (W >= 768) [0, 1, 2].forEach((i) => bar(x, W - PADX - 56 - i * 72, 23, 56, 10, C.muted, 0.8)); else [0, 1, 2].forEach((i) => bar(x, W - PADX - 22, 20 + i * 8, 22, 4, C.ink, 0.8));
  bar(x, x0, 78, Math.min(cw, 360), 26, C.ink, 0.92); bar(x, x0, 114, Math.min(cw, 260), 12, C.muted, 0.9);
  x.fillStyle = C.accent; rr(x, x0, 140, cw, 100, 14); x.fill();
  const hg = x.createLinearGradient(0, 140, 0, 240); hg.addColorStop(0, 'rgba(255,255,255,.16)'); hg.addColorStop(1, 'rgba(0,0,0,.10)'); x.fillStyle = hg; rr(x, x0, 140, cw, 100, 14); x.fill();
  bar(x, x0 + 20, 160, Math.min(cw - 40, 120), 12, C.on, 0.85); bar(x, x0 + 20, 186, Math.min(cw - 40, 200), 30, C.on, 0.95);
  // 표 자리(고친 화면은 자료, 빈 상태, 로딩, 오류가 돌아가며 들어온다)
  const TY = 256, TH = 124, tw = fixed ? cw : TABLE_W;
  if (fixed && st === 1) {
    x.save(); x.strokeStyle = rgbaOf(C.muted, 0.7); x.lineWidth = 2; x.setLineDash([10, 8]); rr(x, x0 + 1, TY + 1, tw - 2, TH - 2, 10); x.stroke(); x.restore();
    bar(x, x0 + tw / 2 - 70, TY + 30, 140, 14, C.ink, 0.8); bar(x, x0 + tw / 2 - 48, TY + 54, 96, 10, C.muted, 0.8); bar(x, x0 + tw / 2 - 40, TY + 80, 80, 26, C.accent, 1);
  } else if (fixed && st === 2) {
    flat(x, x0, TY, tw, TH, 10, C.surface);
    const k = E.inOutC((t / 1.0) % 1), sx = x0 - 60 + k * (tw + 120);
    for (let r = 0; r < 4; r++) bar(x, x0 + 16, TY + 16 + r * 26, Math.min(tw - 32, 200 + (r % 2) * 90), 12, C.muted, 0.28);
    x.save(); rr(x, x0, TY, tw, TH, 10); x.clip(); const sg = x.createLinearGradient(sx - 50, 0, sx + 50, 0); sg.addColorStop(0, rgbaOf(C.surface, 0)); sg.addColorStop(0.5, rgbaOf(C.surface, 0.75)); sg.addColorStop(1, rgbaOf(C.surface, 0)); x.fillStyle = sg; x.fillRect(sx - 50, TY, 100, TH); x.restore();
  } else if (fixed && st === 3) {
    x.fillStyle = 'rgba(180,35,24,.12)'; rr(x, x0, TY, tw, TH, 10); x.fill(); x.fillStyle = '#b42318'; rr(x, x0, TY, 6, TH, 3); x.fill();
    bar(x, x0 + 24, TY + 28, Math.min(tw - 48, 220), 14, C.ink, 0.85); bar(x, x0 + 24, TY + 54, Math.min(tw - 48, 300), 10, C.muted, 0.85);
    x.strokeStyle = C.ink; x.globalAlpha = 0.7; x.lineWidth = 2; rr(x, x0 + 24, TY + 80, 96, 26, 8); x.stroke(); x.globalAlpha = 1;
  } else {
    const tabW = fixed ? Math.max(TABLE_W, cw) : TABLE_W;
    x.save(); rr(x, x0, TY, fixed ? cw : TABLE_W, TH, 10); if (fixed) x.clip();
    flat(x, x0, TY, tabW, TH, 10, C.surface);
    [16, 130, 270, 390].forEach((cx) => bar(x, x0 + cx, TY + 11, 60, 8, C.muted, 0.9));
    for (let r = 0; r < 4; r++) { const y = TY + 34 + r * 22; x.fillStyle = rgbaOf(C.ink, 0.08); x.fillRect(x0 + 12, y - 5, tabW - 24, 1); bar(x, x0 + 16, y, 70, 9, C.ink, 0.85); bar(x, x0 + 130, y, 80, 9, C.ink, 0.6); bar(x, x0 + 270, y, 50, 9, C.ink, 0.6); bar(x, x0 + 390, y, 40, 9, C.accent, 0.9); }
    x.restore();
    if (fixed && TABLE_W > cw) bar(x, x0 + 8, TY + TH - 8, cw * (cw / TABLE_W), 4, C.accent, 0.8);
  }
  // 카드: 연출 전은 3열 고정, 고친 화면은 칸 수가 폭에 맞춰진다
  const CY = TY + TH + 16;
  const cwid = fixed ? Math.max(CARD_MIN, (cw - (n - 1) * GAP) / n) : CARD_MIN;
  for (let i = 0; i < 6; i++) {
    const c = i % n, r = Math.floor(i / n), cx = x0 + c * (cwid + GAP), cy = CY + r * 88;
    flat(x, cx, cy, cwid, 72, 10, C.surface); bar(x, cx + 14, cy + 16, Math.min(cwid - 28, 70), 10, C.muted, 0.9); bar(x, cx + 14, cy + 38, Math.min(cwid - 28, 90), 16, C.ink, 0.9);
  }
  return { rows: Math.ceil(6 / n), CY };
}
function rgbaOf(h, a) { const c = hx(h); return `rgba(${c[0]},${c[1]},${c[2]},${a})`; }

function frame(x, fx, fy, W, fixed, C, st, t, dim) {
  const w = W * SCALE, h = VH * SCALE, lo = layout(W, fixed);
  cardBox(x, fx, fy, w, h, 5, C.bg);
  x.save(); rr(x, fx, fy, w, h, 5); x.clip(); x.translate(fx, fy); x.scale(SCALE, SCALE);
  const info = page(x, W, fixed, C, st, t);
  x.restore();
  if (lo.over > 0 && !dim) {      // 틀 밖으로 삐져나간 부분
    const y0 = fy + (lo.culprit === 'table' ? 256 : info.CY) * SCALE, y1 = fy + (lo.culprit === 'table' ? 380 : Math.min(VH, info.CY + info.rows * 88)) * SCALE, ow = lo.over * SCALE;
    x.save(); x.fillStyle = 'rgba(180,35,24,.16)'; x.fillRect(fx + w, y0, ow, y1 - y0);
    x.strokeStyle = BAD; x.lineWidth = 1; x.setLineDash([3, 2]); x.strokeRect(fx + w + 0.5, y0 + 0.5, ow, y1 - y0 - 1);
    x.setLineDash([]); x.beginPath(); x.rect(fx + w, y0, ow, y1 - y0); x.clip(); x.beginPath();
    for (let k = -(y1 - y0); k < ow; k += 5) { x.moveTo(fx + w + k, y1); x.lineTo(fx + w + k + (y1 - y0), y0); }
    x.strokeStyle = 'rgba(180,35,24,.35)'; x.stroke();
    x.restore();
  }
  if (dim) { x.save(); x.fillStyle = 'rgba(238,242,247,.82)'; rr(x, fx - 1, fy - 1, w + 2, h + 2, 6); x.fill(); x.restore(); T(x, '안 열어 봄', fx + w / 2, fy + h / 2 + 4, 10, MUTED2, 600, 'center', MONO); }
  return lo;
}

const NUM = ['0', '1', '2', '3', '4'];
const DESC = ['폭 하나만 열어 본 화면', '세 폭으로 열어 가로 넘침을 센다', '라이트와 다크 둘 다, 대비를 센다', '빈 상태, 로딩, 오류까지 연다', '고친 뒤 같은 7칸을 다시 센다'];
const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 4,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(31), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const lab = el('div', null, sp);   // 이름표(numeral): 왼쪽 위 큰 숫자와 옆 설명
    Object.assign(lab.style, { position: 'absolute', left: '20px', top: '6px', display: 'flex', alignItems: 'center', gap: '10px', zIndex: '4', whiteSpace: 'nowrap' });
    const num = el('span', null, lab), desc = el('span', null, lab);
    Object.assign(num.style, { font: "400 40px/1 'Black Han Sans',sans-serif", color: PAL.accent, minWidth: '26px' });
    Object.assign(desc.style, { font: "500 13px/1.3 'IBM Plex Sans KR',sans-serif", color: PAL.ink });
    return { main, num, desc };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 0 : (lv == null ? 4 : lv), fixed = L >= 4;
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.setLineDash([]);
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'multiply'; x.globalAlpha = 0.07;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();
    const mp = fixed && L >= 2 ? E.inOutC(seg(t, SWITCH_T, SWITCH_T + FADE)) : 0;
    const C = fixed ? Object.fromEntries(Object.keys(LIGHT).map((k) => [k, mix(LIGHT[k], DARK[k], mp)])) : BEFORE_LIGHT;
    const st = fixed && L >= 3 ? Math.floor(t / STEP_S) % 4 : 0;
    const FX = [20]; FX.push(FX[0] + W1 * SCALE + 44); FX.push(FX[1] + W2 * SCALE + 24);
    const FY = 62, Ws = [W1, W2, W3];
    const los = Ws.map((W, i) => frame(x, FX[i], FY, W, fixed, C, st, t, L === 0 && i < 2));
    // 틀 아래 글: 폭, 넘침, 카드 열
    Ws.forEach((W, i) => {
      const lo = los[i], y = FY + VH * SCALE + 16;
      if (L === 0 && i < 2) { T(x, `${W}`, FX[i], y, 10, PAL.muted, 500, 'left', MONO); T(x, '—', FX[i], y + 12, 10, PAL.muted, 500, 'left', MONO); return; }
      const ok = lo.over === 0;
      T(x, `${W} 넘침 ${lo.over}px`, FX[i], y, 10, ok ? GOOD : BAD, 600, 'left', MONO);
      if (L >= 1) T(x, fixed ? `카드 ${lo.n}열` : '카드 3열 고정', FX[i], y + 12, 10, MUTED2, 500, 'left', MONO);
    });
    // 오른쪽 위: 지금 모드와 상태
    if (L >= 2) {
      const dark = mp > 0.5;
      const mtxt = fixed ? `모드 ${dark ? '다크' : '라이트'}` : (t >= SWITCH_T ? '다크로 바꿔도 그대로' : '모드 라이트');
      T(x, mtxt, 620, 22, 11, fixed ? MUTED2 : (t >= SWITCH_T ? BAD : MUTED2), 600, 'right', MONO);
    }
    if (L >= 3) T(x, fixed ? `상태 ${['자료', '빈 화면', '로딩', '오류'][st]}` : '상태 화면 없음', 620, 38, 11, fixed ? MUTED2 : BAD, 600, 'right', MONO);
    // 아래: 채점 7칸
    T(x, '채점 7칸 (칸 아래: 이 사이트의 점검 도구가 세는가)', 20, 270, 10, MUTED2, 500, 'left', MONO);
    const b = metrics('before'), f = metrics('after');
    CELLS.forEach(([name, unit, lvl, note], i) => {
      const col = i % 4, row = Math.floor(i / 4), cx = 20 + col * 150, cy = 276 + row * 38, vis = L >= lvl;
      const k = vis ? (L === lvl ? E.outC(seg(t, 0.3, 0.9)) : 1) : 0;
      x.save(); x.globalAlpha = vis ? 1 : 0.55; x.fillStyle = PAL.surface; rr(x, cx, cy, 144, 32, 6); x.fill(); x.strokeStyle = PAL.line; x.lineWidth = 1; rr(x, cx + 0.5, cy + 0.5, 143, 31, 6); x.stroke(); x.restore();
      T(x, name, cx + 8, cy + 13, 11, PAL.ink, 600);
      T(x, note, cx + 8, cy + 26, 9, MUTED2, 500);
      x.save(); x.globalAlpha = vis ? 0.2 + 0.8 * k : 1;
      if (!vis) T(x, '—', cx + 136, cy + 13, 11, MUTED2, 600, 'right', MONO);
      else {
        const bv = b[i], fv = f[i], before = `${bv}${unit === '/2' ? '/2' : unit === '/3' ? '/3' : unit}`, after = `${fv}${unit === '/2' ? '/2' : unit === '/3' ? '/3' : unit}`;
        if (L >= 4) {
          const okA = GOODV[i](fv);
          T(x, `${before} → ${after}`, cx + 136, cy + 13, 11, okA ? GOOD : BAD, 700, 'right', MONO);
        } else T(x, before, cx + 136, cy + 13, 11, GOODV[i](bv) ? GOOD : BAD, 700, 'right', MONO);
      }
      x.restore();
    });
    s.num.textContent = NUM[L]; s.desc.textContent = DESC[L];
  },
};
export default demo;
