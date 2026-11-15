/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/ai-tell-screen-checklist/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 습관 앱 첫 화면 목업을 'AI 티 신호 8개가 다 있는 화면'에서 한 단계씩 고쳐 간다.
// 오른쪽 점검표의 숫자(강조색 가짓수, 카드 폭, 테두리 수, 그림자 단계, 글자 대비)는 지금 그려진 화면의 값에서 코드가 계산한다.
// 신호가 있는지 없는지는 사람 눈의 'AI 같다'가 아니라 이 숫자가 기준을 넘는지로만 정한다.
const BRAND = '#c2410c';      // 브랜드 색(바탕과 글자를 뺀 눈에 띄는 색은 이것 하나)
const MAIN_RATIO = 1.6;       // 주인공 카드 폭 / 나머지 카드 폭
const PAPER = '#f7f5ef', INK = '#1d201c', MUTED_LIGHT = '#a8a5b6', MUTED_DARK = '#4a4d45';
const GRAD = ['#5b3df5', '#2b6cff'], GLOW = '#ff4fd8', CTA_G = ['#ff5fa2', '#a855f7'], STICKER = ['#ff8a3d', '#22c55e', '#3b82f6'], GRAD_TEXT = '#bdb9ec';
const T_STEP = [1.2, 2.9, 4.6], MORPH = 1.0;
const PAL = { bg0: '#0c1814', bg1: '#15271f', ink: '#e8f1ea', muted: '#86a091', accent: '#7fe0a8', accent2: '#e8d27a', surface: '#12231c', line: 'rgba(232,241,234,.22)' };
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif';
const M = { x: 12, y: 12, w: 360, h: 308 };
const CAP = ['AI 티 신호 8개가 다 있는 화면', '색과 아이콘', '카드 위계와 여백', '정렬, 글자 대비, 배지'];
const FEATURES = [['이어진 날', '달력으로', 'bars'], ['알림', '저녁 9시', 'bell'], ['기록 저장', '파일로', 'down']];

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (a) => '#' + a.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const mix = (a, b, p) => { const x = hex(a), y = hex(b); return toHex(x.map((v, i) => lerp(v, y[i], p))); };
const rgba = (h, a) => { const [r, g, b] = hex(h); return `rgba(${r},${g},${b},${a.toFixed(3)})`; };
const lum = (h) => { const [r, g, b] = hex(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const p = lum(a), q = lum(b); return (Math.max(p, q) + 0.05) / (Math.min(p, q) + 0.05); };
const hueBucket = (h) => { const [r, g, b] = hex(h).map((v) => v / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; if (d < 0.2) return -1; let H = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; H = (H * 60 + 360) % 360; return Math.floor(H / 30); };

function stateAt(t, L) {                                   // 지금 시각의 화면 값(단계마다 한 겹씩 섞여 들어온다)
  const p = [1, 2, 3].map((k) => (L >= k ? E.inOutC(seg(t, T_STEP[k - 1], T_STEP[k - 1] + MORPH)) : 0));
  const [p1, p2, p3] = p, g = 1 - p1, a = 1 - p3, r = lerp(1, MAIN_RATIO, p2), gap = 10, s = (320 - 2 * gap) / (r + 2);
  const widths = [r * s, s, s], heights = [lerp(78, 86, p2), 78, 78];
  const blur = [lerp(22, 28, p2), lerp(22, 4, p2), lerp(22, 4, p2)], offY = [lerp(10, 12, p2), lerp(10, 1, p2), lerp(10, 1, p2)];
  const textCol = mix(mix(GRAD_TEXT, MUTED_LIGHT, p1), MUTED_DARK, p3);
  return { p1, p2, p3, g, a, r, s, widths, heights, blur, offY, textCol, bg: mix(PAPER, mix(GRAD[0], GRAD[1], 0.5), g), borderA: 1 - p2, sticker: 1 - p1, badgeA: 1 - p3 };
}
function signals(S) {                                      // 점검표 8줄: [이름, 고치는 값, 지금 값(문자열), 신호가 있는가]
  const hues = new Set(), add = (list) => list.forEach((c) => { const b = hueBucket(c); if (b >= 0) hues.add(b); });
  if (S.g > 0.5) add([...GRAD, GLOW, ...CTA_G]); if (S.sticker > 0.5) add(STICKER); if (S.p1 > 0.5) add([BRAND]);
  const w = S.widths, avg = (w[0] + w[1] + w[2]) / 3, spread = (Math.max(...w) - Math.min(...w)) / avg;
  const borders = S.borderA > 0.5 ? 1 + FEATURES.length : 0, tiers = new Set(S.blur.map((b) => Math.round(b / 10))).size, cr = contrast(S.textCol, S.bg);
  return [
    ['보라·파랑 그라디언트, 네온', '색은 바탕, 글자, 브랜드 1개', `강조색 ${hues.size}가지`, S.g > 0.5],
    ['이모지·스티커 아이콘', '선 아이콘 한 세트', S.sticker > 0.5 ? '색 스티커형' : '선 아이콘 한 세트', S.sticker > 0.5],
    ['똑같은 카드 3장', '주인공 하나만 크게', `카드 폭 ${w.map((v) => Math.round(v)).join('·')}`, spread < 0.2],
    ['칸마다 테두리', '여백으로 묶기', `테두리 있는 칸 ${borders}곳`, borders >= 3],
    ['모든 카드 같은 그림자', '두 단계만', `그림자 단계 ${tiers}개`, tiers === 1],
    ['모든 것을 가운데 정렬', '본문은 왼쪽 정렬', S.a > 0.5 ? '가운데' : '왼쪽', S.a > 0.5],
    ['옅은 회색 글씨', '대비 4.5 : 1 이상', `글자 대비 ${cr.toFixed(1)} : 1`, cr < 4.5],
    ['제목 위 작은 알약 배지', '신호 이름을 콕 집어 빼기', S.badgeA > 0.5 ? '배지 1개' : '배지 없음', S.badgeA > 0.5],
  ];
}

let GRAIN = null;
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function rr(x, X, Y, W, H, r) { x.beginPath(); x.roundRect(X, Y, W, H, r); }
function soft(x, X, Y, W, H, r, blur, oy, al) {            // 번진 그림자: 반경이 다른 반투명 사각형을 열네 겹 쌓는다
  const n = 14; for (let i = n; i >= 1; i--) { const k = i / n, g = blur * k; x.fillStyle = `rgba(8,6,20,${(al / n * 1.7 * (1.1 - k * 0.7)).toFixed(3)})`; rr(x, X - g * 0.28, Y + oy - g * 0.25, W + g * 0.56, H + g * 0.6, r + g * 0.3); x.fill(); }
}
function card(x, X, Y, Wd, Ht) { x.save(); x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 10; x.shadowOffsetY = 3; x.fillStyle = PAL.surface; rr(x, X, Y, Wd, Ht, 6); x.fill(); x.restore(); x.strokeStyle = PAL.line; x.lineWidth = 1; rr(x, X, Y, Wd, Ht, 6); x.stroke(); }

function glyph(x, kind, cx, cy, sz) {                      // 직접 그린 아이콘 모양(글리프 폰트 아님)
  const u = sz / 24; x.save(); x.translate(cx, cy); x.scale(u, u); x.beginPath();
  if (kind === 'bars') { [[-6, 0], [0, -5], [6, -9]].forEach(([bx, top]) => { x.moveTo(bx, 7); x.lineTo(bx, top); }); }
  else if (kind === 'bell') { x.moveTo(-7, 5); x.quadraticCurveTo(-5, 2, -5, -3); x.bezierCurveTo(-5, -9, 5, -9, 5, -3); x.quadraticCurveTo(5, 2, 7, 5); x.lineTo(-7, 5); x.moveTo(-2.4, 8.5); x.quadraticCurveTo(0, 10.5, 2.4, 8.5); }
  else { x.moveTo(0, -8); x.lineTo(0, 4); x.moveTo(-5, -1); x.lineTo(0, 4); x.lineTo(5, -1); x.moveTo(-8, 8); x.lineTo(8, 8); }
  x.restore(); x.save(); x.translate(cx, cy); x.scale(u, u); x.lineCap = 'round'; x.lineJoin = 'round';
}
function drawIcon(x, kind, X, Y, S, main) {                // 스티커형(색 칠한 둥근 사각형 + 하이라이트) 과 선 아이콘을 같은 자리에서 섞는다
  const cx = X + 13, cy = Y + 13, i = FEATURES.findIndex((f) => f[2] === kind);
  if (S.sticker > 0.01) {
    x.save(); x.globalAlpha = S.sticker; const c = STICKER[i], gg = x.createLinearGradient(0, Y, 0, Y + 26); gg.addColorStop(0, mix(c, '#ffffff', 0.25)); gg.addColorStop(1, c);
    x.fillStyle = 'rgba(0,0,0,.25)'; rr(x, X, Y + 3, 26, 26, 8); x.fill(); x.fillStyle = gg; rr(x, X, Y, 26, 26, 8); x.fill(); x.fillStyle = 'rgba(255,255,255,.32)'; rr(x, X + 2, Y + 1.5, 22, 9, 5); x.fill();
    glyph(x, kind, cx, cy, 16); x.strokeStyle = '#fff'; x.lineWidth = 2.6; x.stroke(); x.restore(); x.restore();
  }
  if (S.p1 > 0.01) { x.save(); x.globalAlpha = S.p1; glyph(x, kind, cx, cy, 20); x.strokeStyle = main ? BRAND : INK; x.lineWidth = 1.8; x.stroke(); x.restore(); x.restore(); }
}
function drawMock(x, t, L, S) {
  x.save(); x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = 22; x.shadowOffsetY = 10; x.fillStyle = PAPER; rr(x, M.x, M.y, M.w, M.h, 10); x.fill(); x.restore();
  x.save(); rr(x, M.x, M.y, M.w, M.h, 10); x.clip(); x.translate(M.x, M.y);
  x.fillStyle = PAPER; x.fillRect(0, 0, M.w, M.h);
  if (S.g > 0.002) {                                       // 보라→파랑 그라디언트 + 네온 번짐 + 그레인
    x.save(); x.globalAlpha = S.g; const gg = x.createLinearGradient(0, 0, M.w, M.h); gg.addColorStop(0, GRAD[0]); gg.addColorStop(1, GRAD[1]); x.fillStyle = gg; x.fillRect(0, 0, M.w, M.h);
    [[290, 40, 150, GLOW, 0.55], [30, 280, 130, '#27d3ff', 0.4]].forEach(([cx, cy, rad, c, al]) => { const q = x.createRadialGradient(cx, cy, 0, cx, cy, rad); q.addColorStop(0, rgba(c, al)); q.addColorStop(1, rgba(c, 0)); x.fillStyle = q; x.fillRect(cx - rad, cy - rad, rad * 2, rad * 2); });
    x.globalCompositeOperation = 'overlay'; x.globalAlpha = S.g * 0.18; for (let gx = 0; gx < M.w; gx += 128) for (let gy = 0; gy < M.h; gy += 128) x.drawImage(GRAIN, gx, gy, 128, 128); x.restore();
  }
  const ink = mix('#ffffff', INK, S.p1), dy = -16 * S.p3, al = S.a;
  const ctr = (str, y, size, w, col) => { x.font = `${w} ${size}px ${SANS}`; const tw = x.measureText(str).width; T(x, str, lerp(20, 180 - tw / 2, al), y, size, col, w); };
  // 위 줄: 로고와 링크(아래 선은 '칸마다 테두리' 신호의 한 곳)
  x.fillStyle = BRAND; rr(x, 20, 12, 16, 16, 5); x.fill(); T(x, '한줄', 42, 25, 14, ink, 800); T(x, '기능', 292, 25, 10.5, mix(ink, S.bg, 0.35), 600, 'right'); T(x, '가격', 338, 25, 10.5, mix(ink, S.bg, 0.35), 600, 'right');
  x.fillStyle = mix('#ffffff', '#d9d5c9', S.p1); x.globalAlpha = S.borderA * lerp(0.3, 1, S.p1); x.fillRect(0, 39, M.w, 1); x.globalAlpha = 1;
  if (S.badgeA > 0.01) {                                   // 제목 위 알약 배지
    x.save(); x.globalAlpha = S.badgeA; x.font = `700 10px ${SANS}`; const lab = '매일 한 줄, 그게 다예요', tw = x.measureText(lab).width + 26, bx = lerp(20, 180 - tw / 2, al);
    x.fillStyle = mix('#ffffff', '#e8efe9', S.p1); x.globalAlpha = S.badgeA * lerp(0.18, 1, S.p1); rr(x, bx, 54, tw, 20, 10); x.fill(); x.globalAlpha = S.badgeA;
    x.fillStyle = mix('#ffd6f2', BRAND, S.p1); x.beginPath(); x.arc(bx + 12, 64, 3, 0, 7); x.fill(); T(x, lab, bx + 20, 67.5, 10, mix('#ffffff', BRAND, S.p1), 700); x.restore();
  }
  ctr('하루 한 줄로', 100 + dy, 24, 800, ink); ctr('습관 남기기', 128 + dy, 24, 800, ink);
  ctr('오늘 한 일을 한 줄로 적으면', 152 + dy, 11, 500, S.textCol); ctr('이어진 날을 세어 줍니다', 167 + dy, 11, 500, S.textCol);
  const cw = 116, cx0 = lerp(20, 180 - cw / 2, al), cy0 = 180 + dy;                         // 시작 버튼
  if (S.g > 0.01) { x.save(); x.globalAlpha = S.g; soft(x, cx0, cy0, cw, 34, 17, 22, 8, 0.5); const bg2 = x.createLinearGradient(cx0, 0, cx0 + cw, 0); bg2.addColorStop(0, CTA_G[0]); bg2.addColorStop(1, CTA_G[1]); x.fillStyle = bg2; rr(x, cx0, cy0, cw, 34, 17); x.fill(); x.restore(); }
  if (S.p1 > 0.01) { x.save(); x.globalAlpha = S.p1; soft(x, cx0, cy0, cw, 34, 10, 8, 3, 0.16); x.fillStyle = BRAND; rr(x, cx0, cy0, cw, 34, 10); x.fill(); x.restore(); }
  x.font = `700 13px ${SANS}`; x.fillStyle = '#fff'; x.textAlign = 'center'; x.fillText('첫 줄 쓰기', cx0 + cw / 2, cy0 + 22);
  // 기능 카드 3장
  let cx = 20;
  FEATURES.forEach(([ti, de, kind], i) => {
    const w = S.widths[i], h = S.heights[i], y = 302 - h, big = i === 0 && S.p2 > 0.5;
    const glass = lerp(0.14, 1, S.p1), shA = lerp(0.5, i === 0 ? 0.3 : 0.1, S.p2);
    soft(x, cx, y, w, h, 10, S.blur[i], S.offY[i], shA);
    x.fillStyle = `rgba(255,255,255,${glass.toFixed(3)})`; rr(x, cx, y, w, h, 10); x.fill();
    if (S.p2 > 0.2 && i === 0) { x.save(); rr(x, cx, y, w, h, 10); x.clip(); x.fillStyle = BRAND; x.globalAlpha = S.p2; x.fillRect(cx, y, w, 3); x.restore(); }
    x.save(); x.globalAlpha = S.borderA; x.strokeStyle = mix('#ffffff', '#d9d5c9', S.p1); x.lineWidth = 1; x.globalAlpha = S.borderA * lerp(0.3, 1, S.p1); rr(x, cx + 0.5, y + 0.5, w - 1, h - 1, 10); x.stroke(); x.restore();
    const ix = lerp(cx + 10, cx + w / 2 - 13, al);
    drawIcon(x, kind, ix, y + 10, S, i === 0);
    x.font = `700 10.5px ${SANS}`; const tw = x.measureText(ti).width, tx = lerp(cx + 10, cx + w / 2 - tw / 2, al);
    T(x, ti, tx, y + 54, 10.5, ink, 700); x.font = `500 10px ${SANS}`; const dw = x.measureText(de).width;
    x.globalAlpha = 0.8; T(x, de, lerp(cx + 10, cx + w / 2 - dw / 2, al), y + 68, 10, mix(ink, S.bg, 0.2), 500); x.globalAlpha = 1; void big;
    cx += w + 10;
  });
  x.restore();
  x.strokeStyle = 'rgba(232,241,234,.28)'; x.lineWidth = 1; rr(x, M.x + 0.5, M.y + 0.5, M.w - 1, M.h - 1, 10); x.stroke();
}

const demo = {
  dur: 6.4, rest: 6.4, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(229), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const cap = el('div', null, sp);                       // 이름표(caption-bl): 왼쪽 아래, 배경 없음, 위에 얇은 선
    Object.assign(cap.style, { position: 'absolute', left: '12px', bottom: '.7em', width: '360px', paddingTop: '.4em', borderTop: `1px solid ${PAL.line}`, font: "500 12px/1.2 'JetBrains Mono',monospace", color: PAL.muted, whiteSpace: 'nowrap', zIndex: '4' });
    return { main, cap };
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
    const S = stateAt(t, L), sig = signals(S);
    drawMock(x, t, L, S);

    const PX = 384, PW = 244, n = sig.filter((q) => q[3]).length;
    card(x, PX, 12, PW, 336);
    T(x, '화면의 AI 티 점검표', PX + 14, 36, 13, PAL.ink, 700);
    sig.forEach(([nm, , val, on], i) => {
      const Y = 64 + i * 31;
      x.fillStyle = on ? '#ff9b7a' : PAL.accent; x.beginPath(); x.arc(PX + 18, Y - 4, 3.5, 0, 7); x.fill();
      T(x, nm, PX + 28, Y, 11, on ? PAL.ink : PAL.muted, 600);
      T(x, on ? '있음' : '없음', PX + PW - 14, Y, 11, on ? '#ff9b7a' : PAL.accent, 700, 'right');
      T(x, val, PX + 28, Y + 13, 10, on ? '#ffd2c4' : PAL.muted, 600, 'left', MONO);
    });
    T(x, `신호 ${n} / ${sig.length}`, PX + 14, 322, 20, n ? '#ff9b7a' : PAL.accent, 700, 'left', MONO);
    T(x, '한 신호는 증거가 아니고 묶음이 신호다', PX + 14, 340, 10, PAL.muted, 500);
    s.cap.textContent = `${L ? L + '단계' : '연출 전'} · ${CAP[L]}`;
  },
};
export default demo;
