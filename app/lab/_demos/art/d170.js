/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/device-mockup/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rr, rng } from "./helpers.js";

const PAL = { bg0: '#a9402c', bg1: '#8f3322', ink: '#fff4ec', muted: '#ffd9c9', accent: '#ffe27a', accent2: '#1d1a16', surface: '#b24a34', line: 'rgba(255,244,236,.3)' };

// 같은 앱 화면을 '캡처만 놓기'와 '폰·노트북 틀에 넣기'로 비교한다. 일반적인 둥근 사각 기기이며 실존 제품을 닮게 그리지 않는다. 화면은 시간 t 의 함수다.
const BEZEL = 9;          // 폰 베젤(화면 둘레 검은 테두리) 두께 px. 노트북은 이 값의 60%
const GLOSS = .18;        // 유리 반사 세기(0~1 투명도). 0 이면 반사 없음
const RADIUS = 34;        // 폰 몸체 모서리 반지름 px
const GROUND = 304;       // 두 기기가 서 있는 바닥선 y
const SANS = "'IBM Plex Sans KR','Malgun Gothic',sans-serif", MONO = "'JetBrains Mono',monospace";
const T = (c, s, x, y, size, col, w = 500, al = 'left', f = SANS) => { c.save(); c.fillStyle = col; c.font = `${w} ${size}px ${f}`; c.textAlign = al; c.textBaseline = 'alphabetic'; c.fillText(s, x, y); c.restore(); };
const lg = (c, x0, y0, x1, y1, stops) => { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, col]) => g.addColorStop(o, col)); return g; };

// shadowBlur 대신 겹쳐 그린 부드러운 그림자(일부 렌더러에서 shadowBlur 가 캔버스를 지워 버리는 문제를 피한다)
const drop = (c, x, y, w, h, r, dy, blur, a) => { c.save(); for (let i = 0; i < 8; i++) { const g = blur * (i + 1) / 8; c.fillStyle = `rgba(0,0,0,${(a / 8).toFixed(3)})`; rr(c, x - g, y + dy - g, w + 2 * g, h + 2 * g, r + g); c.fill(); } c.restore(); };

function grainTile(seed) {
  const g = document.createElement('canvas'); g.width = g.height = 128;
  const x = g.getContext('2d'), im = x.createImageData(128, 128), r = rng(seed);
  for (let i = 0; i < im.data.length; i += 4) { const v = r() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
  x.putImageData(im, 0, 0); return g;
}

// 기기 안에 들어가는 앱 화면(두 기기 공통). compact=true 이면 폰용 한 줄 배치
function app(c, x, y, w, h, sc, compact) {
  c.save(); rr(c, x, y, w, h, 0); c.clip();
  c.fillStyle = '#f1ddd0'; c.fillRect(x, y, w, h);
  const sb = compact ? 0 : 40, mx = x + sb, mw = w - sb;
  c.translate(0, -sc);
  if (!compact) { c.fillStyle = lg(c, 0, y, 0, y + 400, [[0, '#2d2420'], [1, PAL.accent2]]); c.fillRect(x, y + sc, sb, h);
    for (let i = 0; i < 4; i++) { c.fillStyle = i === 0 ? PAL.accent : 'rgba(255,255,255,.28)'; rr(c, x + 12, y + sc + 16 + i * 26, 16, 16, 5); c.fill(); } }
  const hh = compact ? 62 : 46;
  c.fillStyle = lg(c, mx, y, mx + mw, y + hh, [[0, PAL.bg0], [1, PAL.bg1]]); c.fillRect(mx, y, mw, hh);
  T(c, '이번 주 요약', mx + 12, y + (compact ? 38 : 28), compact ? 14 : 15, PAL.ink, 700);
  if (compact) { T(c, '12:30', x + 10, y + 14, 10, PAL.ink, 500, 'left', MONO); }
  const n = compact ? 2 : 3, gap = 8, cw = (mw - 24 - gap * (n - 1)) / n, cy = y + hh + 10;
  const stats = [['방문', '1,284', '+12%'], ['주문', '342', '+5%'], ['환불', '8', '-2%']];
  for (let i = 0; i < n; i++) { const cx = mx + 12 + i * (cw + gap);
    drop(c, cx, cy, cw, 52, 8, 2, 4, .12); rr(c, cx, cy, cw, 52, 8); c.fillStyle = PAL.ink; c.fill();
    T(c, stats[i][0], cx + 7, cy + 16, compact ? 10 : 10.5, '#7a5446', 500);
    T(c, stats[i][1], cx + 7, cy + 35, compact ? 12.5 : 16, PAL.accent2, 500, 'left', MONO);
    T(c, stats[i][2], cx + cw - 8, cy + 46, 10, i === 2 ? PAL.bg0 : PAL.accent2, 700, 'right', MONO); }
  const by = cy + 62, bh = compact ? 84 : 76;
  drop(c, mx + 12, by, mw - 24, bh, 8, 2, 4, .12); rr(c, mx + 12, by, mw - 24, bh, 8); c.fillStyle = PAL.ink; c.fill();
  const bars = [.42, .6, .5, .78, .66, .92, .74], bw = (mw - 24 - 24) / 7;
  bars.forEach((v, i) => { const hh2 = (bh - 22) * v; c.fillStyle = lg(c, 0, by + bh - 10 - hh2, 0, by + bh - 10, [[0, '#cf6a50'], [1, PAL.bg0]]);
    rr(c, mx + 24 + i * bw + 2, by + bh - 10 - hh2, bw - 6, hh2, 3); c.fill(); });
  const rows = compact ? ['#1042 결제', '#1041 배송', '#1040 환불', '#1039 결제', '#1038 완료'] : ['주문 #1042 결제 완료', '주문 #1041 배송 중', '주문 #1040 환불 요청', '주문 #1039 결제 완료', '주문 #1038 배송 완료'], ry = by + bh + 10;
  const cols = [PAL.bg0, PAL.accent2, '#d9a21b', PAL.bg1, PAL.accent2];
  rows.forEach((s, i) => { const yy = ry + i * 38;
    drop(c, mx + 12, yy, mw - 24, 32, 8, 1, 3, .1); rr(c, mx + 12, yy, mw - 24, 32, 8); c.fillStyle = PAL.ink; c.fill();
    c.fillStyle = cols[i]; c.beginPath(); c.arc(mx + (compact ? 24 : 28), yy + 16, compact ? 6 : 8, 0, 6.2832); c.fill();
    T(c, s, mx + (compact ? 36 : 44), yy + 20, compact ? 10.5 : 11.5, PAL.accent2, 500); });
  c.restore();
}

function sheen(c, x, y, w, h, t, L) {   // 화면 위 유리 반사: 고정 면 + 한 번 지나가는 줄
  if (L < 3 || GLOSS <= 0) return;
  c.save(); c.globalCompositeOperation = 'screen';
  c.fillStyle = lg(c, x, y, x + w * .8, y + h * .6, [[0, `rgba(255,255,255,${GLOSS * .9})`], [.5, `rgba(255,255,255,${GLOSS * .22})`], [1, 'rgba(255,255,255,0)']]);
  c.beginPath(); c.moveTo(x, y); c.lineTo(x + w * .78, y); c.lineTo(x, y + h * .5); c.closePath(); c.fill();
  const q = L >= 4 ? seg(t, 1.7, 3.0) : 0.62;
  if (q > 0 && q < 1) { const px = lerp(-w * .4, w * 1.3, E.inOutC(q)), a = Math.sin(q * Math.PI) * GLOSS * 1.5;
    c.fillStyle = lg(c, x + px - 26, y, x + px + 26, y + 24, [[0, 'rgba(255,255,255,0)'], [.5, `rgba(255,255,255,${a})`], [1, 'rgba(255,255,255,0)']]);
    c.fillRect(x, y, w, h); }
  c.restore();
}

function phone(c, cx, dy, al, sc, t, L) {
  const w = 132, h = 260, x = cx - w / 2, y = GROUND - h + dy, sx = x + BEZEL, sy = y + BEZEL, sw = w - 2 * BEZEL, sh = h - 2 * BEZEL;
  c.save(); c.globalAlpha = al;
  if (L < 2) { app(c, sx, sy, sw, sh, sc, true); c.restore(); return; }
  if (L >= 3) { const s = c.createRadialGradient(cx, GROUND + 6, 4, cx, GROUND + 6, 90); s.addColorStop(0, 'rgba(0,0,0,.5)'); s.addColorStop(1, 'rgba(0,0,0,0)');
    c.save(); c.translate(cx, GROUND + 6); c.scale(1, .12); c.translate(-cx, -(GROUND + 6)); c.fillStyle = s; c.fillRect(cx - 100, GROUND - 100, 200, 220); c.restore(); }
  [[-2.5, 56, 26], [-2.5, 92, 26], [w - .5, 74, 40]].forEach(([bx, by, bh]) => { c.fillStyle = lg(c, x + bx, 0, x + bx + 3, 0, [[0, '#7a645c'], [1, '#33261f']]); rr(c, x + bx, y + by, 3, bh, 1.5); c.fill(); });
  if (L >= 3) drop(c, x, y, w, h, RADIUS, 16, 24, .7);
  rr(c, x, y, w, h, RADIUS); c.fillStyle = lg(c, x, y, x + w, y + h, [[0, '#7a645c'], [.5, '#33261f'], [1, '#150f0d']]); c.fill();
  rr(c, x + 1.6, y + 1.6, w - 3.2, h - 3.2, RADIUS - 1.6); c.fillStyle = '#0e0908'; c.fill();
  rr(c, x + .6, y + .6, w - 1.2, h - 1.2, RADIUS - .6); c.strokeStyle = 'rgba(255,255,255,.28)'; c.lineWidth = 1; c.stroke();
  c.save(); rr(c, sx, sy, sw, sh, Math.max(6, RADIUS - BEZEL)); c.clip(); app(c, sx, sy, sw, sh, sc, true); sheen(c, sx, sy, sw, sh, t, L); c.restore();
  const g = c.createRadialGradient(cx - 1, sy + 9 - 1, 0, cx, sy + 9, 4.5); g.addColorStop(0, '#46332b'); g.addColorStop(.6, '#0a0605'); g.addColorStop(1, '#17100d');
  c.fillStyle = g; c.beginPath(); c.arc(cx, sy + 9, 4.2, 0, 6.2832); c.fill();
  c.restore();
}

function laptop(c, cx, dy, al, sc, t, L) {
  const LB = Math.max(4, Math.round(BEZEL * .6)), sw = 264, sh = 165, lw = sw + 2 * LB, lh = sh + 2 * LB + 6;
  const x = cx - lw / 2, y = GROUND - 11 - lh + dy, sx = x + LB, sy = y + LB + 4;
  c.save(); c.globalAlpha = al;
  if (L < 2) { app(c, sx, sy, sw, sh, sc, false); c.restore(); return; }
  if (L >= 3) { const s = c.createRadialGradient(cx, GROUND + 4, 6, cx, GROUND + 4, 190); s.addColorStop(0, 'rgba(0,0,0,.5)'); s.addColorStop(1, 'rgba(0,0,0,0)');
    c.save(); c.translate(cx, GROUND + 4); c.scale(1, .08); c.translate(-cx, -(GROUND + 4)); c.fillStyle = s; c.fillRect(cx - 200, GROUND - 200, 400, 420); c.restore(); }
  if (L >= 3) drop(c, x, y, lw, lh, 10, 10, 18, .6);
  rr(c, x, y, lw, lh, 10); c.fillStyle = lg(c, x, y, x + lw, y + lh, [[0, '#6e5a52'], [.5, '#2e221d'], [1, '#17100d']]); c.fill();
  rr(c, x + 1.4, y + 1.4, lw - 2.8, lh - 2.8, 8.6); c.fillStyle = '#0e0908'; c.fill();
  rr(c, x + .6, y + .6, lw - 1.2, lh - 1.2, 9.4); c.strokeStyle = 'rgba(255,255,255,.24)'; c.lineWidth = 1; c.stroke();
  c.save(); rr(c, sx, sy, sw, sh, 3); c.clip(); app(c, sx, sy, sw, sh, sc * .85, false); sheen(c, sx, sy, sw, sh, t, L); c.restore();
  c.fillStyle = '#241915'; c.beginPath(); c.arc(cx, y + LB / 2 + 2.5, 1.7, 0, 6.2832); c.fill();
  const bx = x - 26, bw = lw + 52, by = y + lh;
  if (L >= 3) drop(c, bx, by, bw, 11, 4, 5, 8, .5);
  c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + bw, by); c.lineTo(bx + bw - 4, by + 9); c.arcTo(bx + bw - 6, by + 11, bx + bw - 14, by + 11, 6); c.lineTo(bx + 14, by + 11); c.arcTo(bx + 6, by + 11, bx + 4, by + 9, 6); c.closePath();
  c.fillStyle = lg(c, 0, by, 0, by + 11, [[0, '#ecdcd2'], [.45, '#bba99f'], [1, '#7f6c63']]); c.fill();
  rr(c, cx - 30, by, 60, 4, 2); c.fillStyle = lg(c, 0, by, 0, by + 4, [[0, '#7f6c63'], [1, '#bba99f']]); c.fill();
  c.fillStyle = 'rgba(255,255,255,.55)'; c.fillRect(bx, by, bw, 1);
  c.restore();
}

const demo = {
  dur: 5.2, rest: 4.2, noCompare: false, levels: 4,
  mount(sp) {
    const cv = el('canvas', null, sp); cv.width = 1280; cv.height = 720; cv.style.cssText = 'position:absolute;left:0;top:0;width:640px;height:360px';
    return { c: cv.getContext('2d'), grain: grainTile(7) };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 4 : lv);   // 1 = 캡처만, 2 = + 기기 틀, 3 = + 그림자·유리 반사, 4 = + 등장·화면 스크롤
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.shadowColor = 'transparent';
    c.fillStyle = lg(c, 0, 0, 0, 360, [[0, PAL.bg0], [1, PAL.bg1]]); c.fillRect(0, 0, 640, 360);
    const gl = c.createRadialGradient(400, 150, 10, 400, 150, 300); gl.addColorStop(0, 'rgba(255,226,122,.22)'); gl.addColorStop(1, 'rgba(255,226,122,0)'); c.fillStyle = gl; c.fillRect(0, 0, 640, 360);
    if (L >= 2) { c.fillStyle = lg(c, 0, GROUND, 0, 360, [[0, 'rgba(255,255,255,.07)'], [1, 'rgba(255,255,255,0)']]); c.fillRect(0, GROUND, 640, 56); }
    const mv = L >= 4;
    const q1 = mv ? E.outC(seg(t, .2, 1.1)) : 1, q2 = mv ? E.outBack(seg(t, .5, 1.4)) : 1;
    const sc = mv ? E.inOutC(seg(t, 2.0, 3.6)) * 112 : 0;
    laptop(c, 400, (1 - q1) * 44, mv ? Math.min(1, q1 * 1.6) : 1, sc, t, L);
    phone(c, 168, (1 - q2) * 56, mv ? Math.min(1, seg(t, .5, 1.0)) : 1, sc * 1.15, t, L);
    c.globalCompositeOperation = 'overlay'; c.globalAlpha = .06; c.fillStyle = c.createPattern(s.grain, 'repeat'); c.fillRect(0, 0, 640, 360); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
    const names = ['연출 전', '캡처만', '기기 틀', '그림자 반사', '등장 스크롤'];
    c.save(); c.font = `500 12px ${SANS}`; if ('letterSpacing' in c) c.letterSpacing = '2px'; c.textBaseline = 'middle';
    c.fillStyle = PAL.line; c.fillRect(9, 16, 1, 300);
    let yy = 18; names.forEach((n, i) => { const w = c.measureText(n).width; c.save(); c.translate(24, yy); c.rotate(Math.PI / 2); c.fillStyle = i === L ? PAL.ink : PAL.muted; c.globalAlpha = i === L ? 1 : .8; c.fillText(n, 0, 0); c.restore(); yy += w + 16; });
    c.restore();
  },
};
export default demo;
