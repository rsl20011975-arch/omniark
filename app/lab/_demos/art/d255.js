/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/idle-amplitude-exaggerate/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 서 있는 인물의 숨쉬기 두 극단(들숨 정점, 날숨 정점)을 코드로 그리고, 두 그림을 겹쳐 안 겹치는 면적과 키 차이를 센다.
// 그림은 전부 코드로 그린 예시다. AI 가 만든 결과가 아니라, 화면의 숫자(키 차이, 달라진 면적)만 이 장면에서 계산한 값이다.
const AMP = 0.09;          // 두 극단의 키 차이 비율(과장해서 지시했을 때)
const AMP_BASE = 0.012;    // 막연히 '숨쉬기'라고만 했을 때를 가정한 키 차이 비율
const FACE_LOCK = 1;       // 1 이면 표정을 참조와 똑같이 고정한다
const FRAME_SEC = 0.6;     // 프레임 하나를 보여 주는 시간(초)
const PHASE = [1, 0.5, 0, 0.5];   // 4프레임의 숨 위치: 들숨 정점, 내려오는 중, 날숨 정점, 올라가는 중
const PAL = { bg0: '#a9402c', bg1: '#8f3322', ink: '#fff4ec', muted: '#ffd9c9', accent: '#ffe27a', accent2: '#1d1a16', surface: '#b24a34', line: 'rgba(255,244,236,.3)' };
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif', HAN = '"Black Han Sans", sans-serif';
const STEP = ['막연히 숨쉬기만 시킨다', '들숨과 날숨을 극단으로 쓴다', '표정을 참조대로 고정한다'];
const H0 = 116;            // 인물 키(그림 단위)

const mix = (a, b, t) => {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)), x = p(a), y = p(b);
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
};
const HOOD = mix(PAL.accent2, PAL.bg0, 0.2), PANTS = mix(PAL.ink, PAL.bg1, 0.3), SKIN = mix(PAL.accent, PAL.ink, 0.55), HAIR = PAL.accent2;

function geo(q, A) {      // q=1 들숨 정점, q=0 날숨 정점. 어깨가 오르내리고 가슴 폭이 달라진다
  const lift = A * H0 * (q - 0.5), ys = -86 - lift, w = 17 + 24 * A * (2 * q - 1);
  return { ys, w, hc: ys - 16, arm: 1 + 2 * q };
}
function body(g, o, mask) {      // 앞모습 인물. mask 면 한 가지 색으로만 채워 면적을 센다
  const G = o.g, lg = (x0, x1, c0, c1) => { const k = g.createLinearGradient(x0, 0, x1, 0); k.addColorStop(0, c0); k.addColorStop(1, c1); return k; };
  const fill = (c0, c1, x0, x1) => (mask ? '#000' : lg(x0, x1, c0, c1));
  [-1, 1].forEach((sd) => {
    g.fillStyle = fill(mix(PANTS, '#ffffff', 0.2), mix(PANTS, '#000000', 0.35), sd * 8 - 5, sd * 8 + 5); g.beginPath(); g.roundRect(sd * 8 - 5.5, -48, 11, 46, 3); g.fill();
    g.fillStyle = mask ? '#000' : mix(PAL.accent2, '#ffffff', 0.05); g.beginPath(); g.roundRect(sd * 8 - 7, -5, 14, 6, 3); g.fill();
  });
  g.fillStyle = mask ? '#000' : mix(HOOD, '#000000', 0.4); g.beginPath(); g.arc(0, G.hc, 17.5, 0, 7); g.fill();
  [-1, 1].forEach((sd) => {
    g.save(); g.translate(sd * (G.w + 2), G.ys + 4); g.rotate(sd * 0.03 * G.arm);
    g.fillStyle = fill(mix(HOOD, '#ffffff', sd < 0 ? 0.1 : 0), mix(HOOD, '#000000', 0.35), -4.5, 4.5); g.beginPath(); g.roundRect(-4.5, 0, 9, 34, 4.5); g.fill();
    g.fillStyle = mask ? '#000' : SKIN; g.beginPath(); g.arc(0, 36, 4, 0, 7); g.fill(); g.restore();
  });
  g.fillStyle = fill(mix(HOOD, '#ffffff', 0.3), mix(HOOD, '#000000', 0.32), -G.w, G.w); g.beginPath(); g.roundRect(-G.w, G.ys, G.w * 2, -46 - G.ys, 9); g.fill();
  if (!mask) { g.strokeStyle = 'rgba(0,0,0,.2)'; g.lineWidth = 1; g.beginPath(); g.moveTo(-G.w, -52); g.lineTo(G.w, -52); g.stroke(); }
  g.fillStyle = mask ? '#000' : SKIN; g.beginPath(); g.arc(0, G.hc, 13.5, 0, 7); g.fill();
  if (mask) return;
  const hg = g.createRadialGradient(-4, G.hc - 4, 2, 0, G.hc, 15); hg.addColorStop(0, mix(SKIN, '#ffffff', 0.4)); hg.addColorStop(1, mix(SKIN, '#000000', 0.25));
  g.fillStyle = hg; g.beginPath(); g.arc(0, G.hc, 13.5, 0, 7); g.fill();
  g.fillStyle = HAIR; g.beginPath(); g.arc(0, G.hc - 1, 14.2, Math.PI * 1.04, Math.PI * 1.96); g.lineTo(11, G.hc - 6); g.lineTo(-11, G.hc - 6); g.fill();
  face(g, 0, G.hc, 1, o.worry);
}
function face(g, cx, cy, k, worry) {      // 눈, 눈썹, 입. worry 0 이면 참조와 같은 무표정, 1 이면 걱정스러운 얼굴
  g.save(); g.translate(cx, cy); g.scale(k, k); g.lineCap = 'round';
  g.fillStyle = '#1d1a16'; [-5, 5].forEach((x) => { g.beginPath(); g.arc(x, 1 + worry * 0.8, 1.7 + worry * 0.5, 0, 7); g.fill(); });
  g.strokeStyle = '#1d1a16'; g.lineWidth = 1.1;
  if (worry > 0) { g.beginPath(); g.moveTo(-8, -3.2 + worry * 1.2); g.lineTo(-3, -6.4 * worry - 1.5); g.moveTo(8, -3.2 + worry * 1.2); g.lineTo(3, -6.4 * worry - 1.5); g.stroke(); }
  g.beginPath(); g.moveTo(-3.5, 7.2 + worry * 1.4); g.quadraticCurveTo(0, 7.2 + 1.6 * (0.5 - worry * 3.2), 3.5, 7.2 + worry * 1.4); g.stroke();
  g.restore();
}

const MK = 4, MW = 400, MH = 620, MX = 200, MG = 592;      // 면적을 세는 작은 도화지(1단위 = 4px)
const CACHE = {};
function measure(A) {      // 들숨 정점과 날숨 정점의 실루엣을 겹쳐 키 차이와 안 겹치는 면적을 센다
  const key = A.toFixed(4);
  if (CACHE[key]) return CACHE[key];
  const masks = [1, 0].map((q) => {
    const c = document.createElement('canvas'); c.width = MW; c.height = MH; const g = c.getContext('2d', { willReadFrequently: true });
    g.translate(MX, MG); g.scale(MK, MK); body(g, { g: geo(q, A) }, true);
    return g.getImageData(0, 0, MW, MH).data;
  });
  const xc = document.createElement('canvas'); xc.width = MW; xc.height = MH; const xg = xc.getContext('2d'), im = xg.createImageData(MW, MH);
  let xor = 0, uni = 0; const top = [MH, MH], rgb = [255, 226, 122];
  for (let i = 0; i < MW * MH; i++) {
    const a = masks[0][i * 4 + 3] > 128, b = masks[1][i * 4 + 3] > 128, y = Math.floor(i / MW);
    if (a) top[0] = Math.min(top[0], y); if (b) top[1] = Math.min(top[1], y);
    if (a || b) uni++;
    if (a !== b) { xor++; im.data[i * 4] = rgb[0]; im.data[i * 4 + 1] = rgb[1]; im.data[i * 4 + 2] = rgb[2]; im.data[i * 4 + 3] = 235; }
  }
  xg.putImageData(im, 0, 0);
  const h = top.map((v) => MG - v);
  return (CACHE[key] = { xc, area: xor / uni, hdiff: (h[0] - h[1]) / h[1] });
}

function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
let GRAIN = null;

const demo = {
  dur: 4.8, rest: 4.8, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(5), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    return { main };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 1 : (lv == null ? 3 : lv), A = L === 1 ? AMP_BASE : AMP, M = measure(A), x = s.main.getContext('2d');
    const worry = L >= 2 && !(L >= 3 && FACE_LOCK) ? 1 : 0;
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.1;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();
    // 이름표(numeral): 큰 단계 번호와 설명
    T(x, String(L), 28, 62, 40, PAL.accent, 400, 'left', HAN); T(x, STEP[L - 1], 62, 50, 13, PAL.ink, 600);
    T(x, '코드로 그린 예시 그림', 62, 66, 10, PAL.muted, 500);
    // 가운데 큰 인물: 4프레임이 FRAME_SEC 마다 바뀐다
    const fi = Math.floor(t / FRAME_SEC) % 4, q = PHASE[fi], S = 2.1, CXm = 210, GY = 338, k = S / MK;
    x.save(); x.translate(CXm, GY); x.scale(S, S);
    const sh = x.createRadialGradient(0, 0, 0, 0, 0, 30); sh.addColorStop(0, 'rgba(0,0,0,.4)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
    x.save(); x.scale(1, 0.16); x.fillStyle = sh; x.beginPath(); x.arc(0, 0, 30, 0, 7); x.fill(); x.restore();
    x.restore();
    x.save(); x.globalAlpha = 0.92; x.drawImage(M.xc, CXm - MX * k, GY - MG * k, MW * k, MH * k); x.restore();
    x.save(); x.translate(CXm, GY); x.scale(S, S);
    body(x, { g: geo(q, A), worry: worry * (1 - q) }, false); x.restore();
    // 오른쪽: 두 극단의 얼굴, 프레임 표시, 값 세 개
    const fcx = [452, 560];
    [1, 0].forEach((qq, i) => {
      const wv = worry * (1 - qq);
      x.fillStyle = 'rgba(0,0,0,.14)'; x.beginPath(); x.arc(fcx[i], 124, 46, 0, 7); x.fill();
      x.fillStyle = PAL.surface; x.beginPath(); x.arc(fcx[i], 120, 46, 0, 7); x.fill(); x.strokeStyle = wv > 0 ? PAL.accent : PAL.line; x.lineWidth = wv > 0 ? 3 : 1; x.stroke();
      const hg = x.createRadialGradient(fcx[i] - 14, 106, 4, fcx[i], 120, 44); hg.addColorStop(0, mix(SKIN, '#ffffff', 0.4)); hg.addColorStop(1, mix(SKIN, '#000000', 0.22));
      x.fillStyle = hg; x.beginPath(); x.arc(fcx[i], 120, 40, 0, 7); x.fill();
      x.fillStyle = HAIR; x.beginPath(); x.arc(fcx[i], 117, 42, Math.PI * 1.04, Math.PI * 1.96); x.lineTo(fcx[i] + 32, 101); x.lineTo(fcx[i] - 32, 101); x.fill();
      face(x, fcx[i], 124, 3.6, wv);
      T(x, i ? '날숨 정점 얼굴' : '들숨 정점 얼굴', fcx[i], 184, 11, PAL.ink, 600, 'center');
    });
    [0, 1, 2, 3].forEach((i) => {
      const cx = 408 + i * 22 + 4; x.fillStyle = i === fi ? PAL.accent : 'rgba(255,244,236,.18)'; x.beginPath(); x.arc(cx, 207, 8, 0, 7); x.fill();
      T(x, String(i + 1), cx, 211, 10, i === fi ? PAL.accent2 : PAL.ink, 700, 'center', MONO);
    });
    T(x, `프레임 ${fi + 1} / 4`, 506, 211, 11, PAL.muted, 500, 'left', MONO);
    const rows = [
      ['키 차이', `${(M.hdiff * 100).toFixed(1)}%`, M.hdiff >= 0.05 ? PAL.accent : PAL.muted, '들숨과 날숨 그림의 키'],
      ['달라진 면적', `${(M.area * 100).toFixed(1)}%`, M.area >= 0.05 ? PAL.accent : PAL.muted, '겹쳤을 때 안 겹친 노란 부분'],
      ['표정', worry ? '달라짐' : '같음', worry ? PAL.accent : PAL.ink, worry ? '날숨 얼굴이 걱정스럽다' : '두 얼굴이 참조와 같다'],
    ];
    rows.forEach(([name, val, col, nt], i) => {
      const Y0 = 236 + i * 40;
      x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.moveTo(404, Y0 - 19.5); x.lineTo(612, Y0 - 19.5); x.stroke();
      T(x, name, 404, Y0, 12, PAL.ink, 600); T(x, val, 612, Y0 + 2, 22, col, 700, 'right', MONO); T(x, nt, 404, Y0 + 14, 10, PAL.muted, 500);
    });
  },
};
export default demo;
