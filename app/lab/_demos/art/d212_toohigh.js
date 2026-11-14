/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/title-band-two-line/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 9:16 쇼츠 화면 위의 제목을 세 가지로 비교한다: 제목 없음, 글자만 얹기, 검정 띠 두 줄. 화면은 시간 t 의 함수다.
// 크기, 띠 높이, 글자 대비, 5개 프레임의 띠 영역 차이는 코드가 장면에서 직접 계산한다.
const LINE1 = '샌더 버리기 전에';          // 제목 첫째 줄(흰색)
const LINE2 = '고무 링부터 보세요';         // 제목 둘째 줄(노랑)
const BAND_TOP = 190;                       // 띠가 시작하는 y(1080×1920 화면 기준). 위 안전영역 240px 바로 아래
const SIZES = [120, 88, 64];                // 글자 크기 후보(큰 것부터 상자 폭에 들어가는 첫 값)
const MAX_CH = 12;                          // 한 줄 최대 글자 수(띄어쓰기 포함)
const SAFE_TOP = 240;                       // 위 안전영역(공식 수치가 아니라 제작 채택값)
const BOX_L = 72, BOX_R = 930;              // 글자 상자 좌우(폭 858)
const RULE = 6, PAD = 28, GAP = 8;          // 위 줄 두께, 위아래 여백, 두 줄 사이
const ADV = 0.864, SPACE = 0.22;            // 한글 한 글자와 띄어쓰기 폭(글자 크기 대비, 제작 글꼴 파일을 PIL 로 잰 값)
const C = { band: '#0C0D10', l1: '#FAFAFA', l2: '#FFD640' };   // 영상 위 색: 판, 첫 줄, 둘째 줄(강조색)
const PAL = { bg0: '#1b0e17', bg1: '#2b1424', ink: '#f6e9ee', muted: '#b095a3', accent: '#ff7aa8', accent2: '#ffd0a0', surface: '#26121f', line: 'rgba(246,233,238,.16)' };
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif', HEAVY = '"Black Han Sans", "IBM Plex Sans KR", sans-serif';
const PX = 30, PY = 10, PH = 340, PW = Math.round(PH * 9 / 16), S = PH / 1920;   // 무대 안 세로 틀 위치와 크기, 1080×1920 → 무대 배율
const FRAME_T = [0.5, 1, 3, 6, 11.7];       // 검수할 프레임 시각(0.5초, 1초, 3초, 중간, 끝). 영상 길이는 12초로 가정
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const lum = (h) => { const n = parseInt(h.slice(1), 16), f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(n >> 16) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255); };
const ratio = (la, lb) => (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
const adv = (s, size) => [...s].reduce((w, c) => w + size * (c === ' ' ? SPACE : /[가-힣]/.test(c) ? ADV : /[0-9]/.test(c) ? 0.626 : 0.57), 0);

function fit() {            // 두 줄이 상자 폭에 들어가는 가장 큰 크기. 못 들어가면 마지막 크기와 넘침 표시
  for (const s of SIZES) if (adv(LINE1, s) <= BOX_R - BOX_L && adv(LINE2, s) <= BOX_R - BOX_L) return { size: s, over: false };
  return { size: SIZES[SIZES.length - 1], over: true };
}
function geo(size) { const lh = size * 1.25; return { lh, h: RULE + PAD * 2 + lh * 2 + GAP }; }

function scene(g) {         // 에어프라이어 망 클로즈업: 구멍 난 철판, 눌어붙은 기름, 비네트. 1080×1920 좌표
  const bg = g.createLinearGradient(0, 0, 0, 1920); bg.addColorStop(0, '#4a4d55'); bg.addColorStop(0.5, '#34363c'); bg.addColorStop(1, '#222328'); g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  const r = rng(5);
  for (let row = -1; row < 17; row++) for (let col = -1; col < 9; col++) {
    const cx = col * 150 + (row % 2 ? 75 : 0) + 20, cy = row * 130 + 40, rad = 44 + (r() - 0.5) * 3;
    const hole = g.createRadialGradient(cx - 6, cy - 8, 6, cx, cy, rad); hole.addColorStop(0, '#08090b'); hole.addColorStop(0.8, '#14151a'); hole.addColorStop(1, '#30333a');
    g.fillStyle = hole; g.beginPath(); g.arc(cx, cy, rad, 0, 7); g.fill();
    g.strokeStyle = 'rgba(210,214,224,.38)'; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, rad + 1.5, 0.15 * Math.PI, 0.95 * Math.PI); g.stroke();
    g.strokeStyle = 'rgba(0,0,0,.5)'; g.beginPath(); g.arc(cx, cy, rad + 1.5, 1.15 * Math.PI, 1.9 * Math.PI); g.stroke();
  }
  const blobs = [[560, 560, 330, '#f0cd78', 0.9], [560, 640, 520, '#c4912f', 0.45], [330, 1000, 360, '#8a5a1c', 0.7], [760, 1120, 300, '#4a2c10', 0.8]];
  for (let i = 0; i < 14; i++) blobs.push([200 + r() * 700, 380 + r() * 760, 70 + r() * 110, r() < 0.6 ? '#d9a84a' : '#5b3512', 0.45 + r() * 0.35]);
  blobs.forEach(([x, y, rr, c, a]) => {
    const q = g.createRadialGradient(x, y, 0, x, y, rr); q.addColorStop(0, rgba(c, a)); q.addColorStop(0.6, rgba(c, a * 0.45)); q.addColorStop(1, rgba(c, 0)); g.fillStyle = q; g.fillRect(x - rr, y - rr, rr * 2, rr * 2);
  });
  for (let i = 0; i < 260; i++) { const x = r() * 1080, y = 300 + r() * 1100, k = r(); g.fillStyle = k < 0.5 ? 'rgba(40,22,8,.5)' : 'rgba(255,230,160,.35)'; g.beginPath(); g.arc(x, y, 2 + r() * 7, 0, 7); g.fill(); }
  const v = g.createRadialGradient(540, 900, 500, 540, 960, 1300); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)'); g.fillStyle = v; g.fillRect(0, 0, 1080, 1920);
}
function zoomAt(t) { return 1 + 0.015 * t; }
function frame(g, t, L, size, sc) {    // 1080×1920 좌표에 한 프레임: 장면(천천히 확대), 아래 자막, 제목
  g.save(); g.translate(540, 960); g.scale(zoomAt(t), zoomAt(t)); g.translate(-540, -960); scene(g); g.restore();
  g.fillStyle = 'rgba(12,13,16,.62)'; g.beginPath(); g.roundRect(120, 1180, 840, 230, 28); g.fill();
  g.fillStyle = '#f2f2f2'; g.textAlign = 'center'; g.font = `700 60px ${SANS}`; g.fillText('에어프라이어 묵은', 540, 1262); g.fillText('기름때를 닦아도 코팅이', 540, 1345);
  if (L >= 2) title(g, L, size, sc);
}
function line(g, text, cx, y, size, col, stroke) {   // 제작 글꼴 폭(adv)에 맞춰 가로로 눌러 그린다
  const w = adv(text, size); g.save(); g.font = `800 ${size}px ${HEAVY}`; g.textBaseline = 'alphabetic'; g.textAlign = 'left';
  const k = w / g.measureText(text).width; g.translate(cx - w / 2, y); g.scale(k, 1);
  if (stroke) { g.lineJoin = 'round'; g.strokeStyle = C.band; g.lineWidth = stroke / k; g.strokeText(text, 0, 0); }
  g.fillStyle = col; g.fillText(text, 0, 0); g.restore();
}
function title(g, L, size, sc) {
  const cx = (BOX_L + BOX_R) / 2, G = geo(size);
  if (L >= 3) {
    g.fillStyle = C.band; g.fillRect(0, BAND_TOP, 1080, G.h); g.fillStyle = C.l2; g.fillRect(0, BAND_TOP, 1080, RULE);
    line(g, LINE1, cx, BAND_TOP + RULE + PAD + size * 0.98, size, C.l1, 0);
    line(g, LINE2, cx, BAND_TOP + RULE + PAD + G.lh + GAP + size * 0.98, size, C.l2, 0);
  } else {
    g.save(); g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 28 * sc; g.shadowOffsetY = 6 * sc;
    line(g, LINE1, cx, BAND_TOP + size * 0.98, 88, C.l1, 9); line(g, LINE2, cx, BAND_TOP + 88 * 1.25 + 8 + 88 * 0.98, 88, C.l2, 9); g.restore();
  }
}

const CACHE = {};
function lumAt(v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
function measure(L, size) {   // 5개 프레임을 작게 그려 제목 자리의 배경 대비와 프레임 간 차이를 잰다
  const key = [L, size, LINE1, LINE2, BAND_TOP].join('|');
  if (CACHE[key]) return CACHE[key];
  const W = 135, H = 240, k = W / 1080, G = geo(L >= 3 ? size : 88), y0 = Math.floor(BAND_TOP * k), y1 = Math.min(H, Math.floor((BAND_TOP + G.h) * k));
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d', { willReadFrequently: true });
  const grab = (t, lev) => {      // 제목 자리 띠 한 줄 영역의 밝기 배열
    g.setTransform(k, 0, 0, k, 0, 0); g.clearRect(0, 0, 1080, 1920); frame(g, t, lev, size, k);
    const d = g.getImageData(0, y0, W, y1 - y0).data, o = new Float32Array(W * (y1 - y0));
    for (let q = 0; q < o.length; q++) o[q] = 0.299 * d[q * 4] + 0.587 * d[q * 4 + 1] + 0.114 * d[q * 4 + 2];
    return o;
  };
  const lev = L >= 3 ? 3 : 1, frames = FRAME_T.map((t) => grab(t, lev)), back = lev === 1 ? frames[0] : grab(FRAME_T[0], 1);
  const lw = lum(C.l1); let bad = 0, minR = 1e9;
  for (let q = 0; q < back.length; q++) { const r = ratio(lw, lumAt(back[q])); if (r < 3) bad++; if (r < minR) minR = r; }
  let diff = 0;
  for (let i = 1; i < frames.length; i++) { let s = 0; for (let q = 0; q < frames[i].length; q++) s += Math.abs(frames[i][q] - frames[0][q]); diff += s / frames[i].length; }
  return (CACHE[key] = { badShare: bad / back.length, minRatio: minR, diff: diff / (frames.length - 1) });
}

let GRAIN = null;
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function card(x, X, Y, W, H) { x.fillStyle = PAL.surface; x.beginPath(); x.roundRect(X, Y, W, H, 6); x.fill(); x.strokeStyle = PAL.line; x.lineWidth = 1; x.stroke(); }
const STEP = ['제목 없는 화면', '글자만 얹기', '검정 띠 두 줄'];
const demo = {
  dur: 4.2, rest: 4.2, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(41), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const lab = el('div', null, sp);   // 이름표(vertical): 왼쪽 가장자리 세로쓰기, 번호는 muted, 지금 항목은 ink
    Object.assign(lab.style, { position: 'absolute', left: '7px', top: '14px', writingMode: 'vertical-rl', letterSpacing: '.06em', whiteSpace: 'nowrap', lineHeight: '12px', zIndex: '4' });
    const idx = el('span', null, lab), pill = el('span', null, lab);
    Object.assign(idx.style, { color: PAL.muted, font: "500 12px/1 'JetBrains Mono',monospace", marginBottom: '8px' });
    Object.assign(pill.style, { color: PAL.ink, font: "600 12px/1 'IBM Plex Sans KR',sans-serif" });
    return { main, idx, pill };
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 3 : lv), F = fit(), size = F.size, G = geo(L >= 3 ? size : 88), x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.shadowColor = 'transparent';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.1;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();
    // 세로 틀: 그림자, 화면, 안전영역 선
    const tt = Math.max(0, Math.min(t, 4.2)), vt = E.inOutC(seg(tt, 0, 4.2)) * 4;
    x.save(); x.shadowColor = 'rgba(0,0,0,.55)'; x.shadowBlur = 18; x.shadowOffsetY = 6; x.fillStyle = '#0c0d10'; x.beginPath(); x.roundRect(PX, PY, PW, PH, 12); x.fill(); x.restore();
    x.save(); x.beginPath(); x.roundRect(PX, PY, PW, PH, 12); x.clip(); x.translate(PX, PY); x.scale(S, S); frame(x, vt, L, size, 2 * S); x.restore();
    x.setTransform(2, 0, 0, 2, 0, 0);
    x.strokeStyle = 'rgba(255,122,168,.75)'; x.lineWidth = 0.8; x.setLineDash([3, 3]); x.beginPath(); x.moveTo(PX, PY + SAFE_TOP * S); x.lineTo(PX + PW, PY + SAFE_TOP * S); x.stroke(); x.setLineDash([]);
    T(x, '안전영역 240', PX + PW - 3, PY + SAFE_TOP * S - 3, 7.5, '#ffb3cc', 600, 'right', MONO);
    // 오른쪽: 5개 프레임
    const M = measure(L, size), RX = 236, pr = seg(tt, 0.15, 1.6);
    T(x, '프레임 5개 검수(0.5초, 1초, 3초, 중간, 끝)', RX, 22, 11, PAL.muted, 500, 'left', MONO);
    FRAME_T.forEach((ft, i) => {
      const X = RX + i * 50, Y = 30, q = E.outBack(seg(tt, 0.2 + i * 0.12, 0.7 + i * 0.12));
      x.save(); x.translate(X + 21, Y + 37.5); x.scale(Math.max(0.01, q), Math.max(0.01, q)); x.translate(-21, -37.5);
      x.beginPath(); x.roundRect(0, 0, 42, 75, 4); x.clip(); x.scale(42 / 1080, 75 / 1920); frame(x, ft, L, size, 2 * 42 / 1080); x.restore(); x.setTransform(2, 0, 0, 2, 0, 0);
    });
    card(x, 490, 28, 134, 80);
    const shown = L >= 2 ? 5 : 0;
    T(x, '제목이 있는 프레임', 500, 44, 10, PAL.muted, 500);
    T(x, `${Math.round(shown * pr)} / 5`, 614, 70, 24, shown === 5 ? PAL.accent2 : PAL.accent, 700, 'right', MONO);
    T(x, L >= 3 ? `띠 영역 프레임 차 ${(M.diff * pr).toFixed(2)}` : L === 2 ? `제목 자리 프레임 차 ${(M.diff * pr).toFixed(1)}` : '제목 자리가 비어 있다', 500, 92, 9.5, L >= 3 ? PAL.accent2 : PAL.muted, 500);
    // 크기와 띠
    const w1 = adv(LINE1, size), w2 = adv(LINE2, size), W = BOX_R - BOX_L;
    card(x, RX, 118, 188, 100);
    T(x, '글자 크기와 띠 높이', RX + 10, 134, 11, PAL.ink, 600);
    T(x, L >= 3 ? `${size}px` : '띠 없음', RX + 178, 160, 22, L >= 3 ? (F.over ? PAL.accent : PAL.accent2) : PAL.muted, 700, 'right', MONO);
    T(x, L >= 3 ? `띠 높이 ${Math.round(G.h)}px, y ${BAND_TOP}에서 ${Math.round(BAND_TOP + G.h)}` : `글자만, 크기 88px`, RX + 10, 178, 10, PAL.muted, 500);
    T(x, `줄 폭 ${Math.round(w1)}, ${Math.round(w2)} / 상자 ${W}`, RX + 10, 194, 10, w1 > W || w2 > W ? PAL.accent : PAL.muted, 500);
    T(x, `후보 ${SIZES.join(', ')} 중 처음으로 들어가는 크기`, RX + 10, 209, 9, PAL.muted, 500);
    // 글자 대비
    const rb1 = ratio(lum(C.l1), lum(C.band)), rb2 = ratio(lum(C.l2), lum(C.band));
    card(x, 434, 118, 190, 100);
    T(x, '글자와 뒤 배경의 대비', 444, 134, 11, PAL.ink, 600);
    if (L >= 3) { T(x, `${rb1.toFixed(1)} : 1`, 614, 160, 22, PAL.accent2, 700, 'right', MONO); T(x, `흰 글자 ${rb1.toFixed(1)}, 노랑 ${rb2.toFixed(1)} (띠 위)`, 444, 178, 10, PAL.muted, 500); }
    else if (L === 2) { T(x, `${M.minRatio.toFixed(1)} : 1`, 614, 160, 22, PAL.accent, 700, 'right', MONO); T(x, `가장 낮은 곳, 3:1 미만 면적 ${(M.badShare * 100).toFixed(0)}%`, 444, 178, 10, PAL.muted, 500); }
    else { T(x, '글자가 없어 잴 값이 없다', 444, 160, 11, PAL.muted, 500); }
    T(x, '큰 글자는 3:1 이상이 웹 접근성의 자', 444, 194, 9, PAL.muted, 500);
    T(x, L >= 2 ? '(영상 글씨에 그대로 적용되는 법칙은 아니다)' : '', 444, 209, 9, PAL.muted, 500);
    // 줄 글자 수와 안전영역
    const n1 = [...LINE1].length, n2 = [...LINE2].length;
    card(x, RX, 226, 188, 62);
    T(x, '줄 글자 수(띄어쓰기 포함)', RX + 10, 242, 11, PAL.ink, 600);
    T(x, `${n1} / ${MAX_CH}`, RX + 74, 272, 16, n1 > MAX_CH ? PAL.accent : PAL.accent2, 700, 'right', MONO);
    T(x, `${n2} / ${MAX_CH}`, RX + 178, 272, 16, n2 > MAX_CH ? PAL.accent : PAL.accent2, 700, 'right', MONO);
    card(x, 434, 226, 190, 62);
    T(x, '띠 시작과 위 안전영역', 444, 242, 11, PAL.ink, 600);
    T(x, `${BAND_TOP} ${BAND_TOP >= SAFE_TOP ? '>' : '<'} ${SAFE_TOP}`, 614, 272, 16, BAND_TOP >= SAFE_TOP ? PAL.accent2 : PAL.accent, 700, 'right', MONO);
    T(x, '안전영역은 공식 수치가 아니라 제작 채택값이다. 줄 폭은 제작 글꼴 폭을 계산한 값이고', RX, 308, 9.5, PAL.muted, 500);
    T(x, '화면의 글자는 사이트 글꼴이라 모양이 조금 다르다. 색 판정은 장면 픽셀에서 잰다.', RX, 322, 9.5, PAL.muted, 500);
    s.idx.textContent = '0' + L; s.pill.textContent = STEP[L - 1];
  },
};
export default demo;
