/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/keycap/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rr, rng } from "./helpers.js";

const PAL = { bg0: '#f4efe4', bg1: '#e9e2d3', ink: '#1d1a16', muted: '#6b6458', accent: '#d4472b', accent2: '#2b5d8a', surface: '#fbf8f1', line: 'rgba(29,26,22,.14)' };

// 단축키 Ctrl + S 를 ‘글자’ → ‘납작한 키캡’ → ‘두께 있는 키캡’ → ‘눌리는 키캡’ 순서로 보여 주고, 눌렀을 때 메모 창이 저장되는 장면과 잇는다. 화면은 시간 t 의 함수다.
const DEPTH = 6;          // 키캡 두께(옆면 높이) px
const PRESS = 4;          // 눌렀을 때 키가 가라앉는 거리 px(두께보다 작아야 한다)
const SIZE = 1.5;           // 키캡 전체 크기 배율
const T_CTRL = .9, T_CTRL_UP = 2.1, T_S = 1.3, T_S_UP = 1.7;   // Ctrl 누름·뗌, S 누름·뗌 시각(초)
const SANS = "'IBM Plex Sans KR','Malgun Gothic',sans-serif", MONO = "'JetBrains Mono',monospace";
const KX = 320, KY = 250;                                         // 키캡 줄의 가운데
const T = (c, s, x, y, size, col, w = 500, al = 'left', f = SANS) => { c.save(); c.fillStyle = col; c.font = `${w} ${size}px ${f}`; c.textAlign = al; c.textBaseline = 'alphabetic'; c.fillText(s, x, y); c.restore(); };
const lg = (c, x0, y0, x1, y1, stops) => { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, col]) => g.addColorStop(o, col)); return g; };
const mix = (a, b, p) => a.map((v, i) => Math.round(v + (b[i] - v) * p));
const rgb = (a) => `rgb(${a.join(',')})`;
const drop = (c, x, y, w, h, r, dy, blur, al) => { c.save(); for (let i = 0; i < 8; i++) { const g = blur * (i + 1) / 8; c.fillStyle = `rgba(60,40,20,${(al * .4 / 8).toFixed(3)})`; rr(c, x - g, y + dy - g, w + 2 * g, h + 2 * g, r + g); c.fill(); } c.restore(); };
function grainTile(seed) {
  const g = document.createElement('canvas'); g.width = g.height = 128;
  const x = g.getContext('2d'), im = x.createImageData(128, 128), r = rng(seed);
  for (let i = 0; i < im.data.length; i += 4) { const v = r() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
  x.putImageData(im, 0, 0); return g;
}
const press = (t, t0, t1) => E.outC(seg(t, t0, t0 + .06)) * (1 - E.outC(seg(t, t1, t1 + .12)));   // 0~1: 내려가는 데 0.06초, 올라오는 데 0.12초

// 키캡 하나(중심 cx,cy, 크기 w×h). L: 2 = 납작, 3 이상 = 두께 있음. p: 눌림 0~1
function keycap(c, cx, cy, w, h, label, big, p, L) {
  const x = cx - w / 2, y = cy - h / 2;
  if (L < 3) {
    rr(c, x, y, w, h, 10); c.fillStyle = '#2a2622'; c.fill(); c.strokeStyle = '#8a8276'; c.lineWidth = 1.6; rr(c, x + .8, y + .8, w - 1.6, h - 1.6, 9.2); c.stroke();
    T(c, label, cx, cy + big * .35, big, PAL.surface, 700, 'center', big > 20 ? MONO : SANS); return;
  }
  const trav = L >= 4 ? Math.min(PRESS, DEPTH - 1) * p : 0, ty = y - DEPTH + trav;
  drop(c, x, y + 6, w, h, 12, 2, 8, .55);
  if (L >= 4 && p > 0) { const g = c.createRadialGradient(cx, cy, 4, cx, cy, w * .9); g.addColorStop(0, `rgba(212,71,43,${(.5 * p).toFixed(2)})`); g.addColorStop(1, 'rgba(212,71,43,0)'); c.fillStyle = g; c.fillRect(cx - w, cy - w, 2 * w, 2 * w); }
  rr(c, x, y, w, h, 12); c.fillStyle = lg(c, 0, y, 0, y + h, [[0, '#3a342d'], [1, '#14110e']]); c.fill();          // 옆면(두께)
  rr(c, x + 2, ty, w - 4, h - 2, 11); c.fillStyle = rgb(mix([66, 58, 50], [212, 71, 43], p * .85)); c.fill();                // 윗면 바탕
  rr(c, x + 2, ty, w - 4, h - 2, 11); c.fillStyle = lg(c, 0, ty, 0, ty + h, [[0, 'rgba(255,255,255,.2)'], [.4, 'rgba(255,255,255,0)'], [1, 'rgba(0,0,0,.22)']]); c.fill();
  c.strokeStyle = 'rgba(255,255,255,.3)'; c.lineWidth = 1; rr(c, x + 2.5, ty + .5, w - 5, h - 3, 10.5); c.stroke();
  rr(c, x + 9, ty + 8, w - 18, h - 20, 8); c.fillStyle = lg(c, 0, ty + 8, 0, ty + h - 12, [[0, 'rgba(0,0,0,.2)'], [1, 'rgba(255,255,255,.08)']]); c.fill();   // 오목한 윗면
  T(c, label, cx, ty + (h - 2) / 2 + big * .35, big, PAL.surface, 700, 'center', big > 20 ? MONO : SANS);
}

const demo = {
  dur: 5.0, rest: 4.0, noCompare: false, levels: 4,
  mount(sp) {
    const cv = el('canvas', null, sp); cv.width = 1280; cv.height = 720; cv.style.cssText = 'position:absolute;left:0;top:0;width:640px;height:360px';
    return { c: cv.getContext('2d'), grain: grainTile(21) };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 4 : lv);   // 1 = 글자로만, 2 = + 납작한 키캡, 3 = + 두께·윗면 빛, 4 = + 눌림·글로우·저장 알림
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    c.fillStyle = lg(c, 0, 0, 0, 360, [[0, PAL.bg0], [1, PAL.bg1]]); c.fillRect(0, 0, 640, 360);
    const gl = c.createRadialGradient(320, 260, 10, 320, 260, 300); gl.addColorStop(0, 'rgba(255,255,255,.55)'); gl.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = gl; c.fillRect(0, 0, 640, 360);
    // 메모 창
    const WX = 130, WY = 52, WW = 380, WH = 132, saved = t >= T_S + .04;
    drop(c, WX, WY, WW, WH, 14, 8, 14, .55); rr(c, WX, WY, WW, WH, 14); c.fillStyle = lg(c, 0, WY, 0, WY + WH, [[0, PAL.surface], [1, '#f1ece0']]); c.fill(); c.strokeStyle = PAL.line; c.lineWidth = 1; c.stroke();
    c.fillStyle = 'rgba(29,26,22,.1)'; c.fillRect(WX, WY + 32, WW, 1);
    T(c, '메모.txt', WX + 16, WY + 21, 13.5, PAL.ink, 600);
    const dot = saved ? [43, 93, 138] : [212, 71, 43], ring = L >= 4 ? seg(t, T_S + .04, T_S + .5) : 0;
    c.font = `600 12px ${SANS}`; const lab = saved ? '저장됨' : '저장 안 됨', lw = c.measureText(lab).width, cw = lw + 32, cxp = WX + WW - 16 - cw;
    rr(c, cxp, WY + 7, cw, 20, 10); c.fillStyle = 'rgba(29,26,22,.06)'; c.fill();
    c.fillStyle = rgb(dot); c.beginPath(); c.arc(cxp + 12, WY + 17, 4, 0, 6.2832); c.fill();
    if (ring > 0 && ring < 1) { c.beginPath(); c.arc(cxp + 12, WY + 17, 4 + 12 * E.outC(ring), 0, 6.2832); c.strokeStyle = `rgba(43,93,138,${(.7 * (1 - ring)).toFixed(2)})`; c.lineWidth = 1.5; c.stroke(); }
    T(c, lab, cxp + 22, WY + 21, 12, saved ? PAL.accent2 : '#a63a22', 600);
    T(c, '오늘 할 일', WX + 20, WY + 58, 15, PAL.ink, 700);
    [[72, 300], [92, 252], [112, 280]].forEach(([dy, w]) => { rr(c, WX + 20, WY + dy, w, 8, 4); c.fillStyle = 'rgba(29,26,22,.12)'; c.fill(); });
    // 저장 알림(4단계)
    if (L >= 4) { const u = E.outBack(seg(t, T_S + .1, T_S + .55)), fo = 1 - seg(t, 3.2, 3.6);
      if (u > 0 && fo > 0) { c.save(); c.globalAlpha = fo; c.translate(0, (1 - u) * 18); drop(c, WX + WW - 168, WY + WH - 46, 152, 34, 10, 4, 8, .5); rr(c, WX + WW - 168, WY + WH - 46, 152, 34, 10); c.fillStyle = PAL.surface; c.fill(); c.strokeStyle = PAL.line; c.stroke();
        c.fillStyle = PAL.accent2; c.beginPath(); c.arc(WX + WW - 148, WY + WH - 29, 8, 0, 6.2832); c.fill(); c.strokeStyle = PAL.surface; c.lineWidth = 2; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(WX + WW - 152, WY + WH - 29); c.lineTo(WX + WW - 149, WY + WH - 26); c.lineTo(WX + WW - 144, WY + WH - 32); c.stroke();
        T(c, '저장했어요', WX + WW - 134, WY + WH - 24.5, 13, PAL.ink, 600); c.restore(); } }
    // 키캡 줄
    c.save(); c.translate(KX, KY); c.scale(SIZE, SIZE); c.translate(-KX, -KY);
    const pC = L >= 4 ? press(t, T_CTRL, T_CTRL_UP) : 0, pS = L >= 4 ? press(t, T_S, T_S_UP) : 0;
    if (L < 2) { T(c, 'Ctrl + S', KX, KY + 14, 40, PAL.ink, 500, 'center', MONO); }
    else { keycap(c, KX - 66, KY, 104, 66, 'Ctrl', 20, pC, L); T(c, '+', KX, KY + 10, 28, PAL.muted, 500, 'center'); keycap(c, KX + 66, KY, 66, 66, 'S', 30, pS, L); }
    c.restore();
    T(c, '저장', KX, 334 - 0, 15, PAL.ink, 700, 'center');
    if (L >= 2) { c.font = `500 12px ${MONO}`; const code = '<kbd><kbd>Ctrl</kbd>+<kbd>S</kbd></kbd>', w2 = c.measureText(code).width + 20; rr(c, KX - w2 / 2, 340, w2, 18, 9); c.fillStyle = 'rgba(43,93,138,.1)'; c.fill(); T(c, code, KX, 353, 12, PAL.accent2, 500, 'center', MONO); }
    c.globalCompositeOperation = 'overlay'; c.globalAlpha = .06; c.fillStyle = c.createPattern(s.grain, 'repeat'); c.fillRect(0, 0, 640, 360); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
    const labp = ['연출 전: 단축키를 글자로만 적음', '1단계: 글자로만 · Ctrl + S', '2단계: + 납작한 키캡', '3단계: + 두께 · 윗면 빛', '4단계: + 눌림 · 글로우 · 저장 알림'][L];
    c.font = `500 14px ${SANS}`; const pw = c.measureText(labp).width + 24; rr(c, 16, 14, pw, 26, 13); c.fillStyle = PAL.surface; c.fill(); c.strokeStyle = PAL.line; c.lineWidth = 1; c.stroke(); T(c, labp, 28, 32, 14, PAL.ink, 500);
  },
};
export default demo;
