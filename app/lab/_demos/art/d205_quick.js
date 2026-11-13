/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/still-ratio-ruler/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 사진 장면(호수, 사막, 야경, 눈 숲)을 줌으로 움직여 4.5초 영상을 만들고, 영상 계측 자(10fps, 64px 회색, 프레임 차)로
// 정지 비율, 10초당 컷, 움직임을 코드가 직접 계산해 시장 성공작의 바닥값과 비교한다. 화면은 시간 t 의 함수다.
const SLOW = 0.02;        // 1단계 줌 속도: 1초에 2%
const FAST = 0.06;        // 2단계부터의 줌 속도: 1초에 6%
const SHOT = 0.9;         // 3단계에서 한 컷이 이어지는 시간(초)
const CLIP = 4.5;         // 영상 길이(초)
const STILL_T = 0.5;      // 프레임 차가 이 값보다 작으면 정지 프레임
const CUT_T = 25;         // 프레임 차가 이 값보다 크면 컷
const FLOOR_STILL = 0.20, FLOOR_CUT = 3.8, FLOOR_MOVE = 4.89;   // 시장 성공 30편의 바닥값(정지 최대, 컷 최소, 움직임 최소)
const GW = 64, GH = 36;   // 자가 보는 회색 화면 크기(px)
const PAL = { bg0: '#e6f2ec', bg1: '#d4e8de', ink: '#0f2a22', muted: '#4f6e63', accent: '#0f9d6b', accent2: '#c2410c', surface: '#f6fbf8', line: 'rgba(15,42,34,.18)' };
const ACC_INK = '#0a7550';
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif';
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

function trees(g, y0, step, hmin, hmax, col, seed, wav) {   // 침엽수 줄: 폭과 키가 제각각인 삼각형을 이어 세우고 뭉쳐 자라게 한다
  const r = rng(seed); g.fillStyle = col; g.beginPath(); g.moveTo(-5, 190);
  let x = -5;
  while (x < 325) {
    const w = step * (0.7 + r() * 0.9), clump = 0.55 + 0.45 * Math.sin(x * 0.045 + seed) * Math.sin(x * 0.013), h = (hmin + r() * (hmax - hmin)) * clump + wav * Math.sin(x * 0.02);
    g.lineTo(x, y0); g.lineTo(x + w * (0.4 + r() * 0.2), y0 - h); x += w;
  }
  g.lineTo(325, y0); g.lineTo(325, 190); g.fill();
}
function ridge(g, y0, a1, f1, p1, a2, f2, col, seed) {      // 멀리 있는 능선
  const r = rng(seed); g.fillStyle = col; g.beginPath(); g.moveTo(-5, 190);
  for (let x = -5; x <= 325; x += 5) g.lineTo(x, y0 - a1 * Math.sin(x * f1 + p1) - a2 * Math.sin(x * f2) + r() * 2.2);
  g.lineTo(325, 190); g.fill();
}
function strokes(g, n, seed, y0, span, wmin, wmax, cols) {   // 물결, 모래 결, 반사 같은 잔결
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const f = Math.pow(r(), 1.3), y = y0 + f * span, len = wmin + r() * (wmax - wmin) * (0.4 + f), x = r() * 320;
    g.strokeStyle = cols[i % cols.length].replace('A', (0.07 + 0.14 * r()).toFixed(2)); g.lineWidth = 0.5 + f * 0.9;
    g.beginPath(); g.moveTo(x - len / 2, y); g.lineTo(x + len / 2, y); g.stroke();
  }
}
function glow(g, x, y, r, c, a) { const q = g.createRadialGradient(x, y, 0, x, y, r); q.addColorStop(0, rgba(c, a)); q.addColorStop(1, rgba(c, 0)); g.fillStyle = q; g.fillRect(x - r, y - r, r * 2, r * 2); }
function vgrad(g, y0, y1, stops) { const q = g.createLinearGradient(0, y0, 0, y1); stops.forEach(([o, c]) => q.addColorStop(o, c)); return q; }

const SCENES = [
  function lake(g) {         // 새벽 호수: 하늘 층, 해 번짐, 능선 3겹, 물에 비친 하늘
    g.fillStyle = vgrad(g, -20, 108, [[0, '#2a3a6e'], [0.55, '#8a6a9a'], [0.9, '#f3a98a'], [1, '#ffd9a8']]); g.fillRect(-20, -20, 360, 130);
    glow(g, 215, 100, 90, '#ffe0b0', 0.55); glow(g, 215, 100, 34, '#fff2d0', 0.8);
    ridge(g, 96, 12, 0.03, 1, 5, 0.11, '#7b6a98', 3); ridge(g, 104, 15, 0.021, 2.2, 5, 0.09, '#3f4a74', 4);
    trees(g, 109, 2.6, 6, 15, '#3a3a66', 15, 3); trees(g, 111, 3.4, 8, 22, '#14203a', 5, 6);
    g.fillStyle = vgrad(g, 108, 190, [[0, '#d58a82'], [0.25, '#7d6a90'], [1, '#1c2d58']]); g.fillRect(-20, 108, 360, 90);
    strokes(g, 110, 6, 110, 72, 6, 30, ['rgba(255,226,190,A)', 'rgba(14,24,52,A)']);
    for (let i = 0; i < 40; i++) { const y = 112 + i * 1.8; g.fillStyle = `rgba(255,236,200,${0.5 * (1 - i / 44)})`; g.fillRect(212 - 2 - i * 0.5 + ((i * 7) % 5), y, 4 + i * 0.9, 0.9); }
    g.fillStyle = vgrad(g, 98, 114, [[0, 'rgba(255,225,205,0)'], [0.5, 'rgba(255,225,205,.4)'], [1, 'rgba(255,225,205,0)']]); g.fillRect(-20, 98, 360, 16);
  },
  function dunes(g) {        // 해 질 녘 사막: 모래 언덕 다섯 겹, 능선 하이라이트, 모래 결
    g.fillStyle = vgrad(g, -20, 100, [[0, '#35345f'], [0.5, '#d9728a'], [1, '#ffbf7a']]); g.fillRect(-20, -20, 360, 125);
    glow(g, 80, 96, 80, '#ffd08a', 0.5);
    const cols = ['#e9966f', '#b9546a', '#7a2f55', '#46203f', '#1f0f26'];
    cols.forEach((c, i) => {
      const base = 98 + i * 17, a = 9 + i * 4, f = 0.012 + i * 0.004, ph = i * 1.7;
      g.fillStyle = c; g.beginPath(); g.moveTo(-5, 190);
      for (let x = -5; x <= 325; x += 4) g.lineTo(x, base - a * (0.5 + 0.5 * Math.sin(x * f + ph)) - 4 * Math.sin(x * 0.05 + i));
      g.lineTo(325, 190); g.fill();
      g.strokeStyle = `rgba(255,205,150,${0.32 - i * 0.04})`; g.lineWidth = 0.9; g.beginPath();
      for (let x = -5; x <= 325; x += 4) { const y = base - a * (0.5 + 0.5 * Math.sin(x * f + ph)) - 4 * Math.sin(x * 0.05 + i); x < -4 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke();
    });
    strokes(g, 120, 7, 136, 50, 8, 34, ['rgba(255,200,160,A)', 'rgba(30,10,26,A)']);
  },
  function city(g) {         // 야경: 하늘 층, 달, 별, 건물 두 겹과 불 켜진 창, 강에 비친 불빛
    g.fillStyle = vgrad(g, -20, 112, [[0, '#0b1230'], [0.6, '#3a2a6a'], [1, '#e0708a']]); g.fillRect(-20, -20, 360, 135);
    const r = rng(8); for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(255,255,240,${0.25 + 0.6 * r()})`; g.fillRect(r() * 320, r() * 70, 0.9, 0.9); }
    glow(g, 250, 36, 40, '#cfd8ff', 0.5); g.fillStyle = '#f2f1e6'; g.beginPath(); g.arc(250, 36, 9, 0, 7); g.fill();
    [['#1a2147', 24, 56, 7], ['#0d1128', 34, 84, 11]].forEach(([c, hmin, hmax, sd], k) => {
      const q = rng(sd); let x = -4;
      while (x < 324) {
        const w = 12 + q() * 18, h = hmin + q() * (hmax - hmin); g.fillStyle = c; g.fillRect(x, 118 - h, w, h);
        for (let wy = 118 - h + 4; wy < 114; wy += 5) for (let wx = x + 3; wx < x + w - 3; wx += 5) if (q() < 0.34) { g.fillStyle = `rgba(255,217,138,${k ? 0.9 : 0.55})`; g.fillRect(wx, wy, 2.2, 2.6); }
        x += w + 1;
      }
    });
    g.fillStyle = vgrad(g, 118, 190, [[0, '#2a2350'], [1, '#080c1e']]); g.fillRect(-20, 118, 360, 80);
    strokes(g, 100, 9, 120, 66, 6, 26, ['rgba(255,217,138,A)', 'rgba(224,112,138,A)']);
  },
  function pines(g) {        // 안개 낀 눈 숲: 침엽수 세 겹과 안개 층, 눈 덮인 땅
    g.fillStyle = vgrad(g, -20, 120, [[0, '#9fb4c2'], [1, '#ece6d6']]); g.fillRect(-20, -20, 360, 140);
    glow(g, 150, 60, 90, '#fffbe8', 0.5);
    trees(g, 112, 4, 14, 30, '#9db0b4', 11, 8);
    g.fillStyle = vgrad(g, 70, 130, [[0, 'rgba(236,230,214,0)'], [1, 'rgba(236,230,214,.72)']]); g.fillRect(-20, 70, 360, 60);
    trees(g, 128, 5.4, 22, 44, '#587681', 12, 10);
    g.fillStyle = vgrad(g, 96, 150, [[0, 'rgba(236,230,214,0)'], [1, 'rgba(236,230,214,.5)']]); g.fillRect(-20, 96, 360, 54);
    trees(g, 152, 8, 34, 70, '#1f3b41', 13, 14);
    g.fillStyle = vgrad(g, 140, 190, [[0, '#dfe8ee'], [1, '#a9bccb']]); g.fillRect(-20, 146, 360, 50);
    strokes(g, 70, 14, 150, 38, 10, 40, ['rgba(255,255,255,A)', 'rgba(70,96,120,A)']);
  },
];

let GRAIN = null;
function shotAt(t, L) {      // 시각 t 에서 [장면 번호, 줌]
  t = t > 0 ? t : 0;         // 음수·비수(NaN) 시간이 들어와도 장면 번호가 음수가 되지 않게
  if (L >= 3) { const i = Math.floor(t / SHOT) % SCENES.length, u = t % SHOT; return [i, 1 + FAST * Math.max(0, Math.min(u, SHOT))]; }
  return [0, 1 + (L >= 2 ? FAST : SLOW) * Math.min(t, CLIP)];
}
function paint(g, t, L, m, big) {      // m = [가로배율, 세로배율, x이동, y이동]. 논리 크기 320×180
  const [si, z] = shotAt(t, L);
  g.save(); g.setTransform(m[0], 0, 0, m[1], m[2], m[3]);
  g.save(); g.translate(160, 100); g.scale(z, z); g.translate(-160, -100); SCENES[si](g); g.restore();
  if (big) {
    const v = g.createRadialGradient(160, 90, 100, 160, 90, 230); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.3)'); g.fillStyle = v; g.fillRect(0, 0, 320, 180);
    g.globalCompositeOperation = 'overlay'; g.globalAlpha = 0.14;
    for (let gx = 0; gx < 320; gx += 160) for (let gy = 0; gy < 180; gy += 160) g.drawImage(GRAIN, gx, gy, 160, 160);
    g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  }
  g.restore();
}

const CACHE = {};
function ruler(L) {        // 영상 계측 자: 10fps, 64px 회색, 평균 절대 차. 정지(<0.5), 컷(>25), 움직임(평균)
  if (CACHE[L]) return CACHE[L];
  const c = document.createElement('canvas'); c.width = GW; c.height = GH;
  const g = c.getContext('2d', { willReadFrequently: true });
  const frames = [];
  for (let i = 0; i < CLIP * 10; i++) {
    g.clearRect(0, 0, GW, GH); paint(g, i / 10, L, [GW / 320, GH / 180, 0, 0], false);
    const d = g.getImageData(0, 0, GW, GH).data, o = new Float32Array(GW * GH);
    for (let q = 0; q < o.length; q++) o[q] = 0.299 * d[q * 4] + 0.587 * d[q * 4 + 1] + 0.114 * d[q * 4 + 2];
    frames.push(o);
  }
  const diff = [];
  for (let i = 1; i < frames.length; i++) { let s = 0; for (let q = 0; q < frames[i].length; q++) s += Math.abs(frames[i][q] - frames[i - 1][q]); diff.push(s / frames[i].length); }
  return (CACHE[L] = diff);
}
function summary(d, k) {   // 앞쪽 k 개 프레임 차로 정지 비율, 10초당 컷, 움직임
  const n = Math.max(1, k), a = d.slice(0, n);
  return { still: a.filter((v) => v < STILL_T).length / n, cuts: a.filter((v) => v > CUT_T).length * 100 / (n + 1), move: a.reduce((s, v) => s + v, 0) / n };
}

function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function card(x, X, Y, W, H) { x.fillStyle = PAL.surface; x.beginPath(); x.roundRect(X, Y, W, H, 6); x.fill(); x.strokeStyle = PAL.line; x.lineWidth = 1; x.stroke(); }

const STEP = ['느린 줌 한 컷', '빠른 줌 한 컷', '빠른 줌과 컷'];
const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(21), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const lab = el('div', null, sp);   // 이름표(vertical): 왼쪽 가장자리 세로쓰기, 번호는 muted, 지금 항목은 ink
    Object.assign(lab.style, { position: 'absolute', left: '5px', top: '16px', writingMode: 'vertical-rl', letterSpacing: '.06em', whiteSpace: 'nowrap', lineHeight: '12px', zIndex: '4' });
    const idx = el('span', null, lab), pill = el('span', null, lab);
    Object.assign(idx.style, { color: PAL.muted, font: "500 12px/1 'JetBrains Mono',monospace", marginBottom: '8px' });
    Object.assign(pill.style, { color: PAL.ink, font: "600 12px/1 'IBM Plex Sans KR',sans-serif" });
    return { main, idx, pill };
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 3 : lv);   // 0 은 연출 전(= 1단계와 같은 느린 줌 한 컷), 1 = 느린 줌, 2 = 빠른 줌, 3 = 빠른 줌과 컷
    const d = ruler(L), x = s.main.getContext('2d');
    const tc = Math.min(t, CLIP - 0.001), k = Math.min(d.length, Math.floor(tc * 10)), done = t >= CLIP - 0.05;
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'multiply'; x.globalAlpha = 0.07;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();
    // 영상 화면
    const VX = 30, VY = 16, VW = 288, VH = 162;
    x.save(); x.shadowColor = 'rgba(15,42,34,.35)'; x.shadowBlur = 16; x.shadowOffsetY = 5; x.fillStyle = '#000'; x.beginPath(); x.roundRect(VX, VY, VW, VH, 8); x.fill(); x.restore();
    x.save(); x.beginPath(); x.roundRect(VX, VY, VW, VH, 8); x.clip();
    paint(x, tc, L, [2 * VW / 320, 2 * VH / 180, 2 * VX, 2 * VY], true);
    x.restore(); x.setTransform(2, 0, 0, 2, 0, 0);
    const [, z] = shotAt(tc, L);
    T(x, `줌 ${(z * 100).toFixed(0)}%`, VX + 10, VY + VH - 10, 11, 'rgba(255,255,255,.92)', 600, 'left', MONO);
    // 프레임 차 막대
    card(x, 30, 188, 288, 160);
    T(x, '프레임 차 (10fps, 64×36 회색)', 40, 205, 11, PAL.muted, 500, 'left', MONO);
    const BX = 40, BW = 268, BY = 316, BH = 88, bw = BW / d.length, sc = BH / 32;
    x.strokeStyle = PAL.accent2; x.lineWidth = 1; x.setLineDash([3, 3]); x.beginPath(); x.moveTo(BX, BY - CUT_T * sc + 0.5); x.lineTo(BX + BW, BY - CUT_T * sc + 0.5); x.stroke(); x.setLineDash([]);
    T(x, `컷 ${CUT_T}`, BX + BW, BY - CUT_T * sc - 3, 10, PAL.accent2, 600, 'right', MONO);
    x.strokeStyle = PAL.line; x.beginPath(); x.moveTo(BX, BY + 0.5); x.lineTo(BX + BW, BY + 0.5); x.stroke();
    d.forEach((v, i) => {
      if (i >= k) return;
      const h = Math.max(1.6, Math.min(32, v) * sc);
      x.fillStyle = v < STILL_T ? 'rgba(79,110,99,.55)' : v > CUT_T ? PAL.accent2 : PAL.accent;
      x.fillRect(BX + i * bw + 0.5, BY - h, Math.max(1.2, bw - 1), h);
    });
    T(x, '회색 정지(0.5 미만), 초록 움직임, 주황 컷', 40, 337, 10, PAL.muted, 500, 'left', MONO);
    // 오른쪽: 코드가 잰 값
    const r2 = summary(d, k), SX = 336;
    T(x, '이 장면에서 코드가 잰 값', SX, 28, 11, PAL.muted, 500, 'left', MONO);
    const rows = [
      ['정지 비율', `${(r2.still * 100).toFixed(0)}%`, r2.still / 1, FLOOR_STILL / 1, r2.still <= FLOOR_STILL, `성공 30편 바닥 ${(FLOOR_STILL * 100).toFixed(0)}% 이하`],
      ['10초당 컷', r2.cuts.toFixed(1), r2.cuts / 12, FLOOR_CUT / 12, r2.cuts >= FLOOR_CUT, `성공 30편 바닥 ${FLOOR_CUT} 이상`],
      ['움직임', r2.move.toFixed(2), r2.move / 12, FLOOR_MOVE / 12, r2.move >= FLOOR_MOVE, `성공 30편 바닥 ${FLOOR_MOVE} 이상`],
    ];
    rows.forEach(([name, val, frac, fl, ok, note], i) => {
      const Y0 = 40 + i * 58, col = !done ? PAL.muted : ok ? ACC_INK : PAL.accent2;
      card(x, SX, Y0, 284, 52);
      T(x, name, SX + 12, Y0 + 18, 12, PAL.ink, 600);
      T(x, val, SX + 272, Y0 + 24, 22, col, 700, 'right', MONO);
      x.fillStyle = 'rgba(15,42,34,.1)'; x.beginPath(); x.roundRect(SX + 12, Y0 + 27, 160, 8, 3); x.fill();
      x.fillStyle = col === PAL.muted ? PAL.muted : (ok ? PAL.accent : PAL.accent2); x.beginPath(); x.roundRect(SX + 12, Y0 + 27, Math.max(3, Math.min(1, frac) * 160), 8, 3); x.fill();
      x.strokeStyle = PAL.ink; x.lineWidth = 1.6; x.beginPath(); x.moveTo(SX + 12 + fl * 160, Y0 + 24); x.lineTo(SX + 12 + fl * 160, Y0 + 37); x.stroke();
      T(x, done ? (ok ? '바닥 통과' : '바닥 미달') : '재는 중', SX + 12, Y0 + 48, 10, col, 600);
      T(x, note, SX + 272, Y0 + 48, 10, PAL.muted, 500, 'right');
    });
    card(x, SX, 218, 284, 130);
    T(x, '시장 자(가전 쇼츠 30 대 12, 한국)', SX + 12, 236, 11.5, PAL.ink, 600);
    ['성공작 바닥은 표본 30편의 최솟값이다.', '변별력 AUC: 컷 .71, 움직임 .68, 정지 .63', '(0.5 면 동전 던지기, 1.0 이면 완벽)', '우리 편 2개(42.5% 대 11.2%)는 참고치다.', '64px 자는 작은 움직임을 못 본다.'].forEach((ln, i) => T(x, ln, SX + 12, 256 + i * 17, 11, i === 0 ? PAL.ink : PAL.muted, 500));
    s.idx.textContent = '0' + Math.max(1, L); s.pill.textContent = STEP[Math.max(1, L) - 1];
  },
};
export default demo;
