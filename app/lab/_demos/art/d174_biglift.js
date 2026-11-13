/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/drag-drop/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rr, rng } from "./helpers.js";

const PAL = { bg0: '#171615', bg1: '#232120', ink: '#f2efe9', muted: '#9a958c', accent: '#5ad1c8', accent2: '#f2b84b', surface: '#1f1d1b', line: 'rgba(242,239,233,.12)' };

// 칸반 보드에서 가상 커서가 카드 하나를 집어 다른 칸으로 옮긴다. 기본은 놓는 순간 옮겨지고, 단계마다 들어 올림·놓을 자리 표시·이웃 카드 비켜남을 더한다. 화면은 시간 t 의 함수다.
const LIFT = 1.25;        // 집어 든 카드의 크기 배율(1 = 그대로)
const TILT = 3;           // 집어 든 카드가 기울어지는 각도(도)
const SETTLE = .25;       // 놓은 뒤 제자리에 안착하는 시간(초)
const T_GRAB = 1.0, T_HOVER = 1.7, T_DROP = 2.9;   // 집는 시각 · 다른 칸 위로 들어선 시각 · 놓는 시각(초)
const SANS = "'IBM Plex Sans KR','Malgun Gothic',sans-serif";
const COLX = [42, 232, 422], CW = 176, CARDW = 160, CARDH = 50, SY = (i) => 94 + i * 58, COLTOP = 58, COLH = 268;
const NAMES = ['할 일', '진행 중', '완료'];
const CARDS = {   // [제목, 보조 글, 색]
  A: ['로그인 화면 만들기', '담당 · 지아', '#5ad1c8'], B: ['버튼 색 정리', '담당 · 민준', '#f2b84b'], C: ['아이콘 교체', '담당 · 서연', '#e07a5f'], G: ['문서 정리', '담당 · 하준', '#9a958c'],
  D: ['오류 문구 수정', '담당 · 지아', '#5ad1c8'], E: ['배포 점검', '담당 · 민준', '#f2b84b'], F: ['회원가입 테스트', '담당 · 서연', '#9a958c'],
};
const SRC = [130, SY(2) + CARDH / 2], DST = [COLX[1] + CW / 2, SY(1) + CARDH / 2];   // 집은 카드의 처음 중심, 놓을 칸의 중심
const GRAB = [110, SRC[1] + 6], OFF = [GRAB[0] - SRC[0], GRAB[1] - SRC[1]], HOVER_AT = [DST[0] + 24, DST[1] - 34];   // 커서가 잡은 자리, 놓는 순간 카드 중심(슬롯보다 살짝 위)
const T = (c, s, x, y, size, col, w = 500, al = 'left', f = SANS) => { c.save(); c.fillStyle = col; c.font = `${w} ${size}px ${f}`; c.textAlign = al; c.textBaseline = 'alphabetic'; c.fillText(s, x, y); c.restore(); };
const lg = (c, x0, y0, x1, y1, stops) => { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, col]) => g.addColorStop(o, col)); return g; };
const drop = (c, x, y, w, h, r, dy, blur, al) => { c.save(); for (let i = 0; i < 8; i++) { const g = blur * (i + 1) / 8; c.fillStyle = `rgba(0,0,0,${(al / 8).toFixed(3)})`; rr(c, x - g, y + dy - g, w + 2 * g, h + 2 * g, r + g); c.fill(); } c.restore(); };
function grainTile(seed) {
  const g = document.createElement('canvas'); g.width = g.height = 128;
  const x = g.getContext('2d'), im = x.createImageData(128, 128), r = rng(seed);
  for (let i = 0; i < im.data.length; i += 4) { const v = r() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
  x.putImageData(im, 0, 0); return g;
}
function card(c, k, cx, cy, sc, rot, lift) {   // 카드 한 장(중심 cx,cy). lift 0~1 은 들어 올린 정도(그림자가 커진다)
  const [ti, sub, col] = CARDS[k], w = CARDW, h = CARDH;
  c.save(); c.translate(cx, cy); c.rotate(rot * Math.PI / 180); c.scale(sc, sc);
  drop(c, -w / 2, -h / 2, w, h, 12, 3 + 14 * lift, 5 + 14 * lift, .3 + .3 * lift);
  rr(c, -w / 2, -h / 2, w, h, 12); c.fillStyle = lg(c, 0, -h / 2, 0, h / 2, [[0, '#34312e'], [1, '#272422']]); c.fill();
  c.strokeStyle = `rgba(242,239,233,${(.14 + .3 * lift).toFixed(2)})`; c.lineWidth = 1; rr(c, -w / 2 + .5, -h / 2 + .5, w - 1, h - 1, 11.5); c.stroke();
  rr(c, -w / 2 + 8, -h / 2 + 10, 4, h - 20, 2); c.fillStyle = col; c.fill();
  T(c, ti, -w / 2 + 22, -3, 14, PAL.ink, 600); T(c, sub, -w / 2 + 22, 15, 11.5, PAL.muted, 500);
  c.restore();
}
function cursor(c, x, y, sc) {
  c.save(); c.translate(x, y); c.scale(sc, sc); c.beginPath();
  [[0, 0], [0, 17], [4.4, 13.2], [7.4, 20], [10, 18.9], [7, 12.2], [12.6, 12.2]].forEach(([a, b], i) => i ? c.lineTo(a, b) : c.moveTo(a, b));
  c.closePath(); c.fillStyle = PAL.ink; c.fill(); c.lineWidth = 1.2; c.strokeStyle = PAL.bg0; c.lineJoin = 'round'; c.stroke(); c.restore();
}
const bow = (p, q, u, k) => [lerp(p[0], q[0], u) + Math.sin(u * Math.PI) * k * .35, lerp(p[1], q[1], u) - Math.sin(u * Math.PI) * k];
function curPos(t) {   // 커서 경로: 시작 → 카드 잡기 → 다른 칸으로 끌기 → 놓고 떠나기
  const P0 = [586, 318], CU = [HOVER_AT[0] + OFF[0], HOVER_AT[1] + OFF[1]];
  if (t < T_GRAB) return bow(P0, GRAB, E.inOutC(seg(t, .35, .95)), 14);
  if (t < T_DROP) return bow(GRAB, CU, E.inOutC(seg(t, T_GRAB + .05, 2.4)), 30);
  return bow(CU, [560, 312], E.inOutC(seg(t, T_DROP + .15, 3.7)), 12);
}

const demo = {
  dur: 5.0, rest: 4.2, noCompare: false, levels: 4,
  mount(sp) {
    const cv = el('canvas', null, sp); cv.width = 1280; cv.height = 720; cv.style.cssText = 'position:absolute;left:0;top:0;width:640px;height:360px';
    return { c: cv.getContext('2d'), grain: grainTile(13) };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 4 : lv);   // 1 = 끌어도 그대로·놓으면 옮겨짐(커서만), 2 = + 들어 올린 카드가 따라옴, 3 = + 놓을 칸 강조·빈 자리 표시, 4 = + 이웃 카드 비켜남·안착·개수 갱신
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    c.fillStyle = lg(c, 0, 0, 0, 360, [[0, PAL.bg0], [1, PAL.bg1]]); c.fillRect(0, 0, 640, 360);
    const gl = c.createRadialGradient(320, 200, 10, 320, 200, 320); gl.addColorStop(0, 'rgba(90,209,200,.1)'); gl.addColorStop(1, 'rgba(90,209,200,0)'); c.fillStyle = gl; c.fillRect(0, 0, 640, 360);
    const dropped = t >= T_DROP, hov = L >= 3 && t >= T_HOVER && !dropped, smooth = L >= 4;
    // 칸
    COLX.forEach((x, k) => { const on = k === 1 && hov;
      rr(c, x, COLTOP, CW, COLH, 14); c.fillStyle = on ? 'rgba(90,209,200,.14)' : 'rgba(242,239,233,.05)'; c.fill();
      c.strokeStyle = on ? 'rgba(90,209,200,.95)' : PAL.line; c.lineWidth = on ? 1.6 : 1; if (on) c.setLineDash([6, 4]); rr(c, x + .5, COLTOP + .5, CW - 1, COLH - 1, 13.5); c.stroke(); c.setLineDash([]);
      const n = k === 0 ? (dropped ? 3 : 4) : (k === 1 ? (dropped ? 3 : 2) : 1), pop = smooth && k < 2 ? 1 + .35 * Math.sin(Math.PI * seg(t, T_DROP, T_DROP + .3)) : 1;
      T(c, NAMES[k], x + 16, COLTOP + 28, 14, PAL.ink, 700);
      c.save(); c.translate(x + CW - 22, COLTOP + 23); c.scale(pop, pop); rr(c, -11, -10, 22, 20, 10); c.fillStyle = 'rgba(242,239,233,.14)'; c.fill(); T(c, String(n), 0, 4.5, 12, PAL.ink, 700, 'center'); c.restore(); });
    // 이웃 카드: 비켜나는 시각 — 3단계까지는 즉시, 4단계는 부드럽게
    const mv = (from, to, t0) => lerp(from, to, smooth ? E.outC(seg(t, t0, t0 + .25)) : (t >= t0 ? 1 : 0));
    const tG = L >= 3 ? T_GRAB : T_DROP, tE = L >= 3 ? T_HOVER : T_DROP;
    const pos = { A: [0, SY(0)], B: [0, SY(1)], G: [0, mv(SY(3), SY(2), tG)], D: [1, SY(0)], E: [1, mv(SY(1), SY(2), tE)], F: [2, SY(0)] };
    if (L >= 3 && t >= T_GRAB && !dropped && !smooth) { c.setLineDash([5, 4]); c.strokeStyle = 'rgba(242,239,233,.2)'; rr(c, COLX[0] + 8, SY(2), CARDW, CARDH, 12); c.stroke(); c.setLineDash([]); }
    Object.entries(pos).forEach(([k, [col, y]]) => card(c, k, COLX[col] + CW / 2, y + CARDH / 2, 1, 0, 0));
    // 놓을 자리 표시(점선 빈칸)
    if (L >= 3 && hov) { const u = E.outC(seg(t, T_HOVER, T_HOVER + .2)); c.save(); c.globalAlpha = u; c.setLineDash([6, 4]); rr(c, COLX[1] + 8, SY(1), CARDW, CARDH, 12); c.fillStyle = 'rgba(90,209,200,.16)'; c.fill(); c.strokeStyle = PAL.accent; c.lineWidth = 1.6; c.stroke(); c.restore(); c.setLineDash([]); }
    // 집은 카드
    const cur = curPos(t); let cx = SRC[0], cy = SRC[1], sc = 1, rot = 0, lift = 0;
    if (L >= 2 && t >= T_GRAB && !dropped) { cx = cur[0] - OFF[0]; cy = cur[1] - OFF[1]; lift = E.outC(seg(t, T_GRAB, T_GRAB + .15)); sc = 1 + (LIFT - 1) * lift; rot = TILT * lift; }
    else if (t >= T_DROP) { cx = DST[0]; cy = DST[1];
      if (L >= 2 && smooth) { const u = seg(t, T_DROP, T_DROP + SETTLE), q = E.outBack(u); cx = lerp(HOVER_AT[0], DST[0], q); cy = lerp(HOVER_AT[1], DST[1], q); lift = 1 - E.outC(u); sc = 1 + (LIFT - 1) * lift; rot = TILT * lift; } }
    card(c, 'C', cx, cy, sc, rot, lift);
    // 커서
    if (L >= 1) { let cs = 1; if (t > T_GRAB - .1 && t < T_GRAB + .2) cs = 1 - .14 * Math.sin(Math.PI * seg(t, T_GRAB - .1, T_GRAB + .2)); if (t > T_DROP - .05 && t < T_DROP + .2) cs = 1 - .14 * Math.sin(Math.PI * seg(t, T_DROP - .05, T_DROP + .2));
      cursor(c, cur[0], cur[1], cs); }
    if (L >= 4) T(c, '끌기만 쓰지 말고 ‘이동’ 버튼이나 메뉴로도 옮길 수 있게 하세요', 320, 346, 11.5, PAL.muted, 500, 'center');
    c.globalCompositeOperation = 'overlay'; c.globalAlpha = .06; c.fillStyle = c.createPattern(s.grain, 'repeat'); c.fillRect(0, 0, 640, 360); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
    const lab = ['연출 전: 카드가 놓는 순간 옮겨짐(커서 없음)', '1단계: 끌어도 카드는 그대로, 놓으면 옮겨짐', '2단계: + 들어 올린 카드가 커서를 따라옴', '3단계: + 놓을 칸 강조 · 빈 자리 표시', '4단계: + 이웃 카드 비켜남 · 안착 · 개수 갱신'][L];
    c.font = `500 14px ${SANS}`; const pw = c.measureText(lab).width + 24; rr(c, 16, 14, pw, 26, 13); c.fillStyle = PAL.surface; c.fill(); c.strokeStyle = PAL.line; c.lineWidth = 1; c.stroke(); T(c, lab, 28, 32, 14, PAL.ink, 500);
  },
};
export default demo;
