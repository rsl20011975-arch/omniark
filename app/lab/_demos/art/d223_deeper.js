/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/radius-shadow-scale/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 앱 화면 한 장의 모서리 값(8곳)과 그림자(6곳)를 (1) 제각각 (2) 모서리 칸 4개로 역할마다 고정 (3) 그림자 두 단계로 나누고,
// 모서리 종류, 그림자가 붙은 곳, 최대 번짐을 코드가 그 자리에서 센다. 일곱 곳의 모서리 눈금과 그림자 값 표는 참고 자료다. 화면은 시간 t 의 함수다.
const R_BUTTON = 10;      // 2단계: 버튼 모서리(px)
const RAISE_A = 0.30;     // 3단계: 주인공 카드 그림자 각 겹의 불투명도
const R_SMALL = 6, R_MID = 10, R_LARGE = 14, R_PILL = 999;   // 모서리 칸 4개 [기록]
const RADIUS_AT = 0.6, RADIUS_LEN = 1.0;   // 2단계: 모서리를 칸으로 옮기기 시작(초), 걸리는 시간(초)
const SHADOW_AT = 3.2, SHADOW_LEN = 0.8;   // 3단계: 그림자를 두 단계로 나누기 시작(초), 걸리는 시간(초)
const HEAVY = [[10, 40, 0.5]];                                  // 크고 검고 흐릿한 한 겹: 세로 이동, 번짐, 불투명도
const REST = [[1, 2, 0.06], [8, 24, 0.06]];                    // 평평한 카드: 옅은 두 겹
const RAISED = [[1, 1, RAISE_A], [3, 6, RAISE_A], [12, 24, RAISE_A]];   // 주인공 카드: 세 겹
const PAL = { bg0: '#f4efe4', bg1: '#e9e2d3', ink: '#1d1a16', muted: '#6b6458', accent: '#d4472b', accent2: '#2b5d8a', surface: '#fbf8f1', line: 'rgba(29,26,22,.16)' };
const HOT = '#b83a1f', SUNK = '#ece5d6', INK_RGB = '29,26,22';
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif';
// 화면 요소: 위치, 처음(마음대로) 모서리, 칸으로 옮긴 모서리, 그림자(처음은 모두 같은 한 겹)
const EL = [
  { id: 'hero', x: 40, y: 24, w: 244, h: 120, raw: 22, to: R_LARGE, tier: RAISED },
  { id: 'cardA', x: 40, y: 158, w: 118, h: 64, raw: 9, to: R_MID, tier: REST },
  { id: 'cardB', x: 166, y: 158, w: 118, h: 64, raw: 13, to: R_MID, tier: REST },
  { id: 'input', x: 40, y: 236, w: 244, h: 36, raw: 5, to: R_SMALL, tier: null },
  { id: 'btnA', x: 40, y: 284, w: 124, h: 36, raw: 18, to: R_BUTTON, tier: null },
  { id: 'btnB', x: 172, y: 284, w: 112, h: 36, raw: 7, to: R_BUTTON, tier: null },
  { id: 'chipA', x: 68, y: 102, w: 46, h: 22, raw: 11, to: R_PILL, tier: undefined },
  { id: 'chipB', x: 120, y: 102, w: 46, h: 22, raw: 11, to: R_PILL, tier: undefined },
];
const RAD = [   // 값이 적힌 곳, 근거 등급, 모서리 값(px), 알약(완전 둥금) 값이 있는지
  ['기준 문서', '기록', [6, 10, 14], true],
  ['옛 복사본', '기록', [4, 6, 8], true],
  ['웹 도구 C', '기록', [8, 12, 16], true],
  ['관리 화면 D', '기록', [8, 16, 24], false],
  ['모바일 앱', '기록', [12, 16, 20, 28], false],
  ['Tailwind', '공식', [2, 4, 6, 8, 12, 16, 24, 32], true],
  ['Material 3', '공식', [4, 8, 12, 16, 28], true],
];
const SH = [    // 값이 적힌 곳, 근거 등급, 그림자 겹[세로 이동, 번짐, 불투명도]
  ['블로그 틀', '기록', [[1, 2, 0.06], [8, 24, 0.06]]],
  ['배포용 라이트', '기록', [[1, 1, 0.06], [3, 6, 0.06], [12, 24, 0.06]]],
  ['배포용 다크', '기록', [[1, 2, 0.35], [6, 16, 0.3]]],
  ['옛 복사본', '기록', [[1, 2, 0.05], [4, 12, 0.04]]],
  ['제작물 C', '기록', [[8, 28, 0.45]]],
  ['영상 규격', '기록', [[6, 14, 0.59], [6, 36.4, 0.31]]],
  ['Tailwind md', '공식', [[4, 6, 0.1], [2, 4, 0.1]]],
];
const CSSM = [   // 2026-11-14 에 센 값: border-radius 에 px 로 글자 그대로 적은 값의 가짓수, 선언 수
  ['이 사이트 틀', 1, 2], ['제작물 A 배포용', 7, 11], ['제작물 A 옛 복사본', 9, 14], ['제작물 B', 20, 78], ['제작물 C', 1, 1],
];
const AXMAX = 32;
const common = RAD.reduce((a, r) => a.filter((v) => r[2].includes(v)), RAD[0][2]);
const countBy = {}; RAD.forEach((r) => r[2].forEach((v) => { countBy[v] = (countBy[v] || 0) + 1; }));
const top = Object.entries(countBy).sort((a, b) => b[1] - a[1] || a[0] - b[0]);
const topN = top.filter((e) => e[1] === top[0][1]).map((e) => e[0]);
const pillN = RAD.filter((r) => r[3]).length;

const rgba = (rgb, a) => `rgba(${rgb},${a})`;
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function rr(x, X, Y, W, H, r) { x.beginPath(); x.roundRect(X, Y, W, H, Math.min(r, H / 2, W / 2)); }
function panel(x, X, Y, W, H) {
  x.save(); x.shadowColor = rgba(INK_RGB, .08); x.shadowBlur = 12; x.shadowOffsetY = 3; rr(x, X, Y, W, H, 10); x.fillStyle = PAL.surface; x.fill(); x.restore();
  rr(x, X, Y, W, H, 10); x.strokeStyle = PAL.line; x.lineWidth = 1; x.stroke();
}
function shadow(x, e, r, layers, k, rgb) {   // 번짐과 이동은 캔버스 배율(2)에 맞춰 두 배로 준다. 도형은 화면 밖에 그리고 그림자만 제자리로 보낸다
  layers.forEach(([oy, bl, a]) => {
    if (a * k < 0.004) return;
    x.save(); x.shadowColor = rgba(rgb, a * k); x.shadowBlur = bl * 2; x.shadowOffsetX = 2000; x.shadowOffsetY = oy * 2;
    x.translate(-1000, 0); rr(x, e.x, e.y, e.w, e.h, r); x.fillStyle = '#000'; x.fill(); x.restore();
  });
}
let GRAIN = null;

function state(t, L) {   // 시각 t, 단계 L 에서 요소별 모서리(그리는 값, 이름값)와 그림자 섞임 정도
  const pr = L >= 2 ? E.outC(seg(t, RADIUS_AT, RADIUS_AT + RADIUS_LEN)) : 0;
  const ps = L >= 3 ? E.outC(seg(t, SHADOW_AT, SHADOW_AT + SHADOW_LEN)) : 0;
  return EL.map((e) => {
    const eff = lerp(e.raw, Math.min(e.to, e.h / 2), pr);
    return { e, r: eff, nom: pr >= 0.999 ? e.to : Math.round(eff), ps };
  });
}
function drawEl(x, st) {
  st.forEach(({ e, r, ps }) => {
    if (e.tier !== undefined) {   // 그림자: 처음은 모두 같은 큰 한 겹, 3단계에서 단계별로 바뀐다
      shadow(x, e, r, HEAVY, 1 - ps, '0,0,0');
      if (e.tier) shadow(x, e, r, e.tier, ps, INK_RGB);
    }
    rr(x, e.x, e.y, e.w, e.h, r);
    if (e.id === 'btnA') x.fillStyle = HOT; else if (e.id === 'input') x.fillStyle = SUNK; else if (e.id === 'hero') x.fillStyle = PAL.ink; else if (e.id === 'chipA') x.fillStyle = 'rgba(255,177,153,.2)'; else if (e.id === 'chipB') x.fillStyle = 'rgba(150,190,230,.2)'; else x.fillStyle = PAL.surface;
    x.fill();
    if (e.id === 'input' || e.id === 'btnB') { x.strokeStyle = PAL.line; x.lineWidth = 1; x.stroke(); }
  });
  const hero = EL[0], A = EL[1], B = EL[2], I = EL[3];
  const g = x.createRadialGradient(hero.x + 34, hero.y + 30, 2, hero.x + 34, hero.y + 34, 22); g.addColorStop(0, '#e4795c'); g.addColorStop(1, HOT);
  x.beginPath(); x.arc(hero.x + 34, hero.y + 34, 18, 0, 7); x.fillStyle = g; x.fill();
  T(x, '민', hero.x + 34, hero.y + 40, 16, '#ffffff', 700, 'center');
  T(x, '오늘의 일정', hero.x + 62, hero.y + 32, 16, PAL.bg0, 700);
  T(x, '3건이 남았어요', hero.x + 62, hero.y + 50, 12, '#cdc4b3', 500);
  T(x, '신규', 68 + 23, 102 + 15, 12, '#ffb199', 700, 'center'); T(x, '중요', 120 + 23, 102 + 15, 12, '#a9cdf0', 700, 'center');
  [[A, '완료', '12건'], [B, '대기', '3건']].forEach(([c, a, b]) => { T(x, a, c.x + 14, c.y + 26, 12, PAL.muted, 600); T(x, b, c.x + 14, c.y + 54, 22, PAL.ink, 700); });
  x.strokeStyle = PAL.muted; x.lineWidth = 1.6; x.beginPath(); x.arc(I.x + 20, I.y + 17, 5, 0, 7); x.moveTo(I.x + 24, I.y + 21); x.lineTo(I.x + 29, I.y + 26); x.stroke();
  T(x, '일정 검색', I.x + 38, I.y + 23, 13, PAL.muted, 500);
  T(x, '일정 추가', EL[4].x + EL[4].w / 2, EL[4].y + 23, 14, '#ffffff', 700, 'center'); T(x, '취소', EL[5].x + EL[5].w / 2, EL[5].y + 23, 14, PAL.ink, 600, 'center');
}

function readout(x, st) {   // 위쪽 한 줄: 이 화면에서 코드가 센 세 값
  const kinds = new Set(st.map((s) => s.nom)).size;
  let n = 0, maxB = 0;
  st.forEach(({ e, ps }) => {
    if (e.tier === undefined) return;
    const lay = [];
    if (1 - ps > 0.02) lay.push(...HEAVY.map((l) => [l[1], l[2] * (1 - ps)]));
    if (e.tier && ps > 0.02) lay.push(...e.tier.map((l) => [l[1], l[2] * ps]));
    const vis = lay.filter(([, a]) => a > 0.02);
    if (vis.length) { n++; maxB = Math.max(maxB, ...vis.map(([b]) => b)); }
  });
  [['모서리 종류', kinds, '가지'], ['그림자 붙은 곳', n, '곳'], ['최대 번짐', maxB, 'px']].forEach(([lb, v, u], i) => {
    const X = 328 + i * 100;
    T(x, lb, X, 36, 12, PAL.muted, 600);
    T(x, String(v), X, 68, 30, i === 2 ? PAL.accent2 : HOT, 700, 'left', MONO);
    T(x, u, X + String(v).length * 18 + 4, 68, 12, PAL.muted, 500);
  });
}
const CX = 316, CY = 80, CW = 306, CH = 264;   // 오른쪽 큰 칸
function barsCard(x) {   // 1단계: 실제 CSS 에서 센 모서리 가짓수
  panel(x, CX, CY, CW, CH);
  T(x, '실제 CSS 에서 px 로 적은 모서리 값', 328, 104, 12, PAL.ink, 600);
  CSSM.forEach(([n, d, c], i) => {
    const Y = 118 + i * 35;
    T(x, n, 328, Y + 13, 11, PAL.ink, 500);
    rr(x, 452, Y + 4, 88, 11, 4); x.fillStyle = 'rgba(29,26,22,.08)'; x.fill();
    rr(x, 452, Y + 4, Math.max(3, 88 * d / 20), 11, 4); x.fillStyle = d > 5 ? HOT : PAL.accent2; x.fill();
    T(x, `${d}가지`, 584, Y + 13, 11, PAL.ink, 700, 'right', MONO); T(x, `${c}곳`, 612, Y + 13, 11, PAL.muted, 500, 'right', MONO);
  });
  T(x, 'var() 변수로 쓴 값은 세지 않았다. 이 사이트 틀은 6, 10, 14px 를', 328, 316, 10, PAL.muted, 500);
  T(x, '변수로 써서 직접 적은 값이 999 하나뿐이다', 328, 331, 10, PAL.muted, 500);
}
const axr = (v, X0, W) => X0 + v / AXMAX * W;
function ladderCard(x, al) {   // 2단계: 일곱 곳의 모서리 눈금
  x.save(); x.globalAlpha = al; panel(x, CX, CY, CW, CH);
  T(x, '일곱 곳의 모서리 눈금(0에서 32px)', 328, 104, 12, PAL.ink, 600);
  const X0 = 428, W = 162, Y0 = 116, RH = 26;
  RAD[0][2].forEach((v) => { rr(x, axr(v, X0, W) - 5, Y0 - 1, 10, RAD.length * RH + 1, 3); x.fillStyle = rgba('43,93,138', .14); x.fill(); });
  RAD.forEach(([n, g, vs, full], i) => {
    const Y = Y0 + i * RH;
    T(x, n, 328, Y + 17, 11, PAL.ink, 600); T(x, g, 416, Y + 17, 10, PAL.muted, 600, 'right');
    x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.moveTo(X0, Y + 22.5); x.lineTo(X0 + W, Y + 22.5); x.stroke();
    vs.forEach((v) => { rr(x, axr(v, X0, W) - 0.9, Y + 7, 1.8, 15, 0.9); x.fillStyle = RAD[0][2].includes(v) ? PAL.accent2 : PAL.ink; x.fill(); });
    if (full) { x.beginPath(); x.arc(X0 + W + 14, Y + 14, 4.5, 0, 7); x.strokeStyle = PAL.ink; x.lineWidth = 1.5; x.stroke(); }
  });
  T(x, `일곱 곳이 모두 가진 값: ${common.length}개`, 328, 318, 12, PAL.ink, 700);
  T(x, `가장 많은 곳에 있는 값: ${topN.join(', ')} (${top[0][1]}곳씩), 동그라미는 알약이 있는 ${pillN}곳`, 328, 334, 10, PAL.muted, 500);
  x.restore();
}
function shadowCard(x, t, al) {   // 3단계: 그림자 값 표
  x.save(); x.globalAlpha = al; panel(x, CX, CY, CW, CH);
  T(x, '일곱 곳의 그림자 값(세로 이동/번짐 불투명도)', 328, 104, 12, PAL.ink, 600);
  const hist = {};
  SH.forEach(([n, g, ly], i) => {
    const Y = 116 + i * 26, p = E.outC(seg(t, 3.9 + i * 0.12, 4.5 + i * 0.12));
    hist[ly.length] = (hist[ly.length] || 0) + 1;
    x.save(); x.globalAlpha = al * p; x.translate(0, (1 - p) * 5);
    T(x, n, 328, Y + 17, 11, PAL.ink, 600); T(x, `${ly.length}겹`, 412, Y + 17, 11, ly.length === 3 ? HOT : PAL.accent2, 700, 'left', MONO);
    T(x, ly.map(([o, b, a]) => `${o}/${Math.round(b)} ${String(a).replace('0.', '.')}`).join(' + '), 444, Y + 17, 10, PAL.muted, 500, 'left', MONO);
    x.restore();
  });
  const pf = E.outC(seg(t, 4.9, 5.4));
  x.save(); x.globalAlpha = al * pf;
  T(x, `겹 수: ${Object.keys(hist).map((k) => `${k}겹 ${hist[k]}곳`).join(', ')}`, 328, 318, 12, PAL.ink, 700);
  T(x, '이 화면은 옅은 2겹과 주인공 3겹 두 단계만 쓴다', 328, 334, 10, PAL.muted, 500);
  x.restore(); x.restore();
}

const STEP = ['제각각 값', '모서리 칸 4개', '그림자 두 단계'];
const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(52), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    return { main };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 1 : (lv == null ? 3 : lv), x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'multiply'; x.globalAlpha = 0.07;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();
    const st = state(t, L);
    drawEl(x, st); readout(x, st);
    if (L === 1) barsCard(x);
    else if (L === 2) ladderCard(x, 1);
    else { const k = E.inOutC(seg(t, 3.6, 4.1)); if (k < 1) ladderCard(x, 1 - k); if (k > 0) shadowCard(x, t, k); }
    const cap = `0${L}  ${STEP[L - 1]}`;   // 이름표(caption-bl): 왼쪽 아래, 배경 없음, 위에 1px 얇은 선
    x.font = `500 12px ${MONO}`; const w = Math.min(280, x.measureText(cap).width);
    x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.moveTo(24, 333.5); x.lineTo(24 + w, 333.5); x.stroke();
    T(x, cap, 24, 349, 12, PAL.muted, 500, 'left', MONO);
  },
};
export default demo;
