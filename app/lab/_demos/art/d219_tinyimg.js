/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/shorts-cover-frame/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 쇼츠 대표 이미지: 유튜브가 고른 프레임에는 제목이 없을 수 있다. 직접 지정은 컴퓨터 Studio 에서만 되고 API 지정은 한 번의 기록에서 Studio 목록이 비었다.
// 그래서 모든 프레임에 제목 띠를 둔다. 띠 영역의 프레임 차와 규격 비교는 코드가 화면을 그려 직접 잰다. 장면은 코드로 그린 예시다.
const TITLE_PX = 96;      // 제목 글자 크기(1080 폭 기준)
const PICK_T = 20.3;      // 유튜브가 자동으로 고른 프레임의 시각(초), 제작 기록 1건
const OUT_W = 270, OUT_H = 480;   // 표지로 지정하려는 이미지 크기(px)
const CLIP = 40.6;        // 예시 영상 길이(초)
const REC_W = 2160, REC_H = 3840, MIN_H = 640;   // 공식 도움말의 권장 크기와 최소 높이
const BAND_OK = 3;        // 띠 영역 평균 프레임 차가 이 값보다 작아야 통과(제작 기록의 검수 기준)
const PAL = { bg0: '#a9402c', bg1: '#8f3322', ink: '#fff4ec', muted: '#ffd9c9', accent: '#ffe27a', accent2: '#1d1a16', surface: '#b24a34', line: 'rgba(255,244,236,.28)' };
const INK2 = 'rgba(255,244,236,.84)', OKC = '#b8f0c8', BADC = '#ffd0c0';
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif';
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const TIMES = [0.5, 1, 3, CLIP / 2, CLIP - 0.3];       // 검수에서 뽑는 다섯 프레임: 0.5, 1, 3초, 중간, 끝
const SHOTS = [[0, 0], [2.4, 1], [15, 2], [32, 3]];     // [시작 초, 장면 번호]
const SUNX = [215, 100, 250, 150];

function vgrad(g, y0, y1, stops) { const q = g.createLinearGradient(0, y0, 0, y1); stops.forEach(([o, c]) => q.addColorStop(o, c)); return q; }
function glow(g, x, y, r, c, a) { const q = g.createRadialGradient(x, y, 0, x, y, r); q.addColorStop(0, rgba(c, a)); q.addColorStop(1, rgba(c, 0)); g.fillStyle = q; g.fillRect(x - r, y - r, r * 2, r * 2); }
function trees(g, y0, step, hmin, hmax, col, seed) {
  const r = rng(seed); g.fillStyle = col; g.beginPath(); g.moveTo(-5, 190); let x = -5;
  while (x < 325) { const w = step * (0.7 + r() * 0.9), h = (hmin + r() * (hmax - hmin)) * (0.55 + 0.45 * Math.sin(x * 0.045 + seed) * Math.sin(x * 0.013)); g.lineTo(x, y0); g.lineTo(x + w * 0.5, y0 - h); x += w; }
  g.lineTo(325, y0); g.lineTo(325, 190); g.fill();
}
function ridge(g, y0, a1, f1, p1, col, seed) { const r = rng(seed); g.fillStyle = col; g.beginPath(); g.moveTo(-5, 190); for (let x = -5; x <= 325; x += 5) g.lineTo(x, y0 - a1 * Math.sin(x * f1 + p1) - 5 * Math.sin(x * 0.1) + r() * 2); g.lineTo(325, 190); g.fill(); }
function strokes(g, n, seed, y0, span, cols) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) { const f = Math.pow(r(), 1.3), y = y0 + f * span, len = 8 + r() * 30 * (0.4 + f), x = r() * 320; g.strokeStyle = cols[i % cols.length].replace('A', (0.08 + 0.14 * r()).toFixed(2)); g.lineWidth = 0.6 + f; g.beginPath(); g.moveTo(x - len / 2, y); g.lineTo(x + len / 2, y); g.stroke(); }
}
const SCENES = [
  function lake(g) {
    g.fillStyle = vgrad(g, 0, 108, [[0, '#2a3a6e'], [0.55, '#8a6a9a'], [0.9, '#f3a98a'], [1, '#ffd9a8']]); g.fillRect(0, 0, 320, 110);
    glow(g, 215, 100, 90, '#ffe0b0', 0.55); glow(g, 215, 100, 34, '#fff2d0', 0.8);
    ridge(g, 96, 12, 0.03, 1, '#7b6a98', 3); ridge(g, 104, 15, 0.021, 2.2, '#3f4a74', 4); trees(g, 109, 2.6, 6, 15, '#3a3a66', 15); trees(g, 111, 3.4, 8, 22, '#14203a', 5);
    g.fillStyle = vgrad(g, 108, 180, [[0, '#d58a82'], [0.25, '#7d6a90'], [1, '#1c2d58']]); g.fillRect(0, 108, 320, 72);
    strokes(g, 90, 6, 110, 66, ['rgba(255,226,190,A)', 'rgba(14,24,52,A)']);
  },
  function dunes(g) {
    g.fillStyle = vgrad(g, 0, 100, [[0, '#35345f'], [0.5, '#d9728a'], [1, '#ffbf7a']]); g.fillRect(0, 0, 320, 105); glow(g, 80, 96, 80, '#ffd08a', 0.5);
    ['#e9966f', '#b9546a', '#7a2f55', '#46203f', '#1f0f26'].forEach((c, i) => {
      const base = 98 + i * 17, a = 9 + i * 4, f = 0.012 + i * 0.004, ph = i * 1.7;
      g.fillStyle = c; g.beginPath(); g.moveTo(-5, 190); for (let x = -5; x <= 325; x += 4) g.lineTo(x, base - a * (0.5 + 0.5 * Math.sin(x * f + ph)) - 4 * Math.sin(x * 0.05 + i)); g.lineTo(325, 190); g.fill();
    });
    strokes(g, 80, 7, 136, 44, ['rgba(255,200,160,A)', 'rgba(30,10,26,A)']);
  },
  function city(g) {
    g.fillStyle = vgrad(g, 0, 112, [[0, '#0b1230'], [0.6, '#3a2a6a'], [1, '#e0708a']]); g.fillRect(0, 0, 320, 118);
    const r = rng(8); for (let i = 0; i < 50; i++) { g.fillStyle = `rgba(255,255,240,${0.25 + 0.6 * r()})`; g.fillRect(r() * 320, r() * 70, 0.9, 0.9); }
    glow(g, 250, 36, 40, '#cfd8ff', 0.5); g.fillStyle = '#f2f1e6'; g.beginPath(); g.arc(250, 36, 9, 0, 7); g.fill();
    [['#1a2147', 24, 56, 7], ['#0d1128', 34, 84, 11]].forEach(([c, hmin, hmax, sd], k) => {
      const q = rng(sd); let x = -4;
      while (x < 324) { const w = 12 + q() * 18, h = hmin + q() * (hmax - hmin); g.fillStyle = c; g.fillRect(x, 118 - h, w, h); for (let wy = 118 - h + 4; wy < 114; wy += 5) for (let wx = x + 3; wx < x + w - 3; wx += 5) if (q() < 0.34) { g.fillStyle = `rgba(255,217,138,${k ? 0.9 : 0.55})`; g.fillRect(wx, wy, 2.2, 2.6); } x += w + 1; }
    });
    g.fillStyle = vgrad(g, 118, 180, [[0, '#2a2350'], [1, '#080c1e']]); g.fillRect(0, 118, 320, 62); strokes(g, 70, 9, 120, 56, ['rgba(255,217,138,A)', 'rgba(224,112,138,A)']);
  },
  function pines(g) {
    g.fillStyle = vgrad(g, 0, 120, [[0, '#9fb4c2'], [1, '#ece6d6']]); g.fillRect(0, 0, 320, 130); glow(g, 150, 60, 90, '#fffbe8', 0.5);
    trees(g, 112, 4, 14, 30, '#9db0b4', 11); g.fillStyle = vgrad(g, 70, 130, [[0, 'rgba(236,230,214,0)'], [1, 'rgba(236,230,214,.72)']]); g.fillRect(0, 70, 320, 60);
    trees(g, 128, 5.4, 22, 44, '#587681', 12); g.fillStyle = vgrad(g, 96, 150, [[0, 'rgba(236,230,214,0)'], [1, 'rgba(236,230,214,.5)']]); g.fillRect(0, 96, 320, 54);
    trees(g, 152, 8, 34, 70, '#1f3b41', 13); g.fillStyle = vgrad(g, 140, 190, [[0, '#dfe8ee'], [1, '#a9bccb']]); g.fillRect(0, 146, 320, 40); strokes(g, 50, 14, 150, 30, ['rgba(255,255,255,A)', 'rgba(70,96,120,A)']);
  },
];
const sceneAt = (t) => { let k = 0; SHOTS.forEach(([s, i]) => { if (t >= s) k = i; }); return k; };

let GRAIN = null;
function frame(g, X, Y, W, H, t, band, fx) {      // 세로 틀 한 장: 장면을 꽉 채우고, 띠가 있으면 위에서 264px(1080 기준) 아래에 검정 두 줄 띠를 얹는다
  const si = sceneAt(t), k = H / 180, vw = W / k, x0 = Math.max(0, Math.min(320 - vw, SUNX[si] - vw / 2));
  g.save(); g.beginPath(); g.rect(X, Y, W, H); g.clip(); g.translate(X, Y);
  g.save(); g.scale(k, k); g.translate(-x0, 0); SCENES[si](g); g.restore();
  if (fx) {
    const v = g.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.32)'); g.fillStyle = v; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'overlay'; g.globalAlpha = 0.14; g.drawImage(GRAIN, 0, 0, W, H); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  }
  if (band) {
    const s = W / 1080, y0 = 264 * s, h = (2 * 1.22 * TITLE_PX + 56) * s;
    g.fillStyle = '#0d0b0a'; g.fillRect(0, y0, W, h);
    g.textAlign = 'center'; g.textBaseline = 'alphabetic'; const fs = TITLE_PX * s;
    g.font = `800 ${fs}px ${SANS}`;
    [['샌더 버리기 전에', '#ffffff'], ['고무 링부터 보세요', '#ffd400']].forEach(([s2, c], i) => { g.fillStyle = c; g.fillText(s2, W / 2, y0 + 28 * s + 1.0 * fs + i * 1.22 * fs); });
  }
  g.restore();
}
const BAND_CACHE = {};
function bandDiff() {       // 다섯 프레임을 180×320 으로 그려 띠 영역(띠 안쪽 행)의 평균 밝기 차를 잰다. 가장 큰 값
  const key = TITLE_PX; if (BAND_CACHE[key] != null) return BAND_CACHE[key];
  const W = 180, H = 320, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d', { willReadFrequently: true });
  const s = W / 1080, y0 = Math.ceil(264 * s), y1 = Math.floor(264 * s + (2 * 1.22 * TITLE_PX + 56) * s);
  const ims = TIMES.map((t) => { g.clearRect(0, 0, W, H); frame(g, 0, 0, W, H, t, true, false); return g.getImageData(0, 0, W, H).data; });
  let worst = 0;
  for (let k = 1; k < ims.length; k++) {
    let sum = 0, n = 0;
    for (let y = y0; y < y1; y++) for (let xx = 0; xx < W; xx++) { const i = (y * W + xx) * 4; sum += Math.abs(0.299 * (ims[k][i] - ims[0][i]) + 0.587 * (ims[k][i + 1] - ims[0][i + 1]) + 0.114 * (ims[k][i + 2] - ims[0][i + 2])); n++; }
    worst = Math.max(worst, sum / n);
  }
  return (BAND_CACHE[key] = worst);
}
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function card(x, X, Y, W, H) { x.save(); x.shadowColor = 'rgba(40,10,4,.35)'; x.shadowBlur = 10; x.shadowOffsetY = 3; x.fillStyle = PAL.surface; x.beginPath(); x.roundRect(X, Y, W, H, 6); x.fill(); x.restore(); x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.roundRect(X, Y, W, H, 6); x.stroke(); }
function mark(x, kind, X, Y) {
  x.save(); x.strokeStyle = kind === 'ok' ? OKC : kind === 'bad' ? BADC : INK2; x.lineWidth = 2; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
  if (kind === 'ok') { x.moveTo(X - 4, Y); x.lineTo(X - 1, Y + 3.5); x.lineTo(X + 5, Y - 4); } else if (kind === 'bad') { x.moveTo(X - 4, Y - 4); x.lineTo(X + 4, Y + 4); x.moveTo(X + 4, Y - 4); x.lineTo(X - 4, Y + 4); } else { x.moveTo(X - 4, Y); x.lineTo(X + 4, Y); }
  x.stroke(); x.restore();
}
function sizeBox(x, X, Y, ap, H, compact) {   // 권장 크기(바깥 점선)와 내 이미지(안쪽 채움), 최소 높이선을 같은 축척으로 그린다
  const sc = H / REC_H, bw = REC_W * sc, bh = REC_H * sc;
  x.save(); x.globalAlpha = ap; x.setLineDash([4, 3]); x.strokeStyle = INK2; x.lineWidth = 1; x.strokeRect(X + 0.5, Y + 0.5, bw, bh); x.setLineDash([]);
  const w = OUT_W * sc, h = OUT_H * sc; x.fillStyle = rgba('#ffe27a', 0.88); x.fillRect(X + 0.5, Y + 0.5 + bh - h, w, h);
  x.strokeStyle = '#1d1a16'; x.lineWidth = 1.4; x.beginPath(); const my = Y + 0.5 + bh - MIN_H * sc; x.moveTo(X - 4, my); x.lineTo(X + bw + 4, my); x.stroke();
  T(x, `권장 ${REC_W}×${REC_H}`, X + bw / 2, Y - 6, 9.5, PAL.ink, 600, 'center');
  T(x, `${OUT_W}×${OUT_H}`, X + bw / 2, Y + bh + 13, 9.5, PAL.accent, 700, 'center', MONO);
  if (!compact) T(x, `최소 높이 ${MIN_H}px`, X + bw + 8, my + 3, 10, PAL.ink, 600);
  x.restore();
}
const P = (t, a, d) => seg(t, a, a + d);
const STEP = ['유튜브가 고른 프레임', 'Studio 에서 직접 지정', 'API 로 지정한 기록', '모든 프레임에 제목 띠'];

const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 4,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(52), gc = document.createElement('canvas'); gc.width = 200; gc.height = 360;
    const gx = gc.getContext('2d'), gd = gx.createImageData(200, 360);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const pill = el('div', null, sp);
    Object.assign(pill.style, { position: 'absolute', left: '34px', top: '318px', padding: '4px 10px', borderRadius: '999px', background: PAL.surface, color: PAL.ink, font: "600 11px 'IBM Plex Sans KR',sans-serif", border: `1px solid ${PAL.line}`, zIndex: '4', whiteSpace: 'nowrap' });
    return { main, pill };
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 4 : lv);
    t = t > 0 ? t : 0;
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'multiply'; x.globalAlpha = 0.1; for (let gy0 = 0; gy0 < 360; gy0 += 360) for (let gx0 = 0; gx0 < 640; gx0 += 200) x.drawImage(GRAIN, gx0, gy0, 200, 360); x.restore();
    const band = L >= 4, pickI = TIMES.reduce((b, v, i) => (Math.abs(v - PICK_T) < Math.abs(TIMES[b] - PICK_T) ? i : b), 0);
    const diff = L >= 4 ? bandDiff() : null, minOk = OUT_H >= MIN_H && OUT_W * 16 === OUT_H * 9;
    // 왼쪽: 세로 틀(유튜브가 고른 프레임)
    const FX = 24, FY = 11, FW = 190, FH = 338;
    x.save(); x.shadowColor = 'rgba(40,10,4,.5)'; x.shadowBlur = 16; x.shadowOffsetY = 6; x.fillStyle = '#111'; x.beginPath(); x.roundRect(FX, FY, FW, FH, 9); x.fill(); x.restore();
    x.save(); x.beginPath(); x.roundRect(FX, FY, FW, FH, 9); x.clip(); frame(x, FX, FY, FW, FH, TIMES[pickI], band, true); x.restore();
    // 오른쪽 위: 확인표(코드가 센다)
    const RX = 228, RW = 396;
    card(x, RX, 11, RW, 108);
    const rows = [
      ['제목이 보이는 프레임', `${band ? TIMES.length : 0}/${TIMES.length}`, band ? 'ok' : 'bad', true],
      ['규격: 9대16, 높이 640px 이상', `${OUT_W}×${OUT_H}`, minOk ? 'ok' : 'bad', L >= 2],
      ['권장 2160×3840 와 비교', `${Math.round(OUT_W / REC_W * 100)}%`, OUT_W >= REC_W ? 'ok' : 'dash', L >= 2],
      ['API 로 지정해 본 기록', 'Studio 목록 빈 칸 1건', 'bad', L >= 3],
      ['띠 영역 프레임 차', diff == null ? '-' : `${diff.toFixed(1)} (${BAND_OK} 미만)`, diff != null && diff < BAND_OK ? 'ok' : 'dash', L >= 4],
    ];
    rows.forEach(([nm, val, kd, on], i) => {
      const Y = 29 + i * 18, ap = E.outC(P(t, 0.1 + i * 0.1, 0.35)) * (on ? 1 : 0.6); x.save(); x.globalAlpha = ap;
      mark(x, on ? kd : 'dash', RX + 18, Y - 4); T(x, nm, RX + 32, Y, 11, PAL.ink, 500); T(x, on ? val : '아직', RX + RW - 12, Y, 11, on ? (kd === 'ok' ? OKC : kd === 'bad' ? BADC : PAL.ink) : INK2, 700, 'right', MONO); x.restore();
    });
    // 오른쪽 아래: 단계별 카드
    const CY = 127, CH = 222; card(x, RX, CY, RW, CH);
    const mini = (i, X, Y, w, h, hl, ap) => {
      x.save(); x.globalAlpha = ap; x.shadowColor = 'rgba(40,10,4,.4)'; x.shadowBlur = 6; x.shadowOffsetY = 2; x.fillStyle = '#111'; x.fillRect(X, Y, w, h); x.restore();
      x.save(); x.globalAlpha = ap; frame(x, X, Y, w, h, TIMES[i], band, false); if (hl) { x.strokeStyle = PAL.accent; x.lineWidth = 2.4; x.strokeRect(X - 1, Y - 1, w + 2, h + 2); } x.restore();
      T(x, `${TIMES[i].toFixed(1)}초`, X + w / 2, Y + h + 13, 10, PAL.ink, 600, 'center', MONO);
    };
    if (L === 1 || L === 4) {
      const w = L === 1 ? 62 : 50, h = L === 1 ? 110 : 89, gap = L === 1 ? 14 : 8;
      T(x, L === 1 ? '자동으로 고르는 프레임은 제목과 상관이 없다' : '다섯 프레임 어느 것이 골라져도 제목이 보인다', RX + 12, CY + 19, 11, INK2, 500);
      TIMES.forEach((_, i) => mini(i, RX + 14 + i * (w + gap), CY + 30, w, h, i === pickI && L === 1, E.outC(P(t, 0.3 + i * 0.12, 0.4))));
      if (L === 1) {
        T(x, `${PICK_T}초 지점이 대표 이미지로 골라졌다(제작 기록 1건)`, RX + 12, CY + 176, 11, PAL.accent, 700);
        T(x, '제목이 보이는 프레임 0/5. 어느 장면이 골라질지는 정할 수 없다', RX + 12, CY + 194, 10.5, INK2, 500);
        T(x, '[기록] 표본 1편, 효과 측정 없음', RX + 12, CY + 211, 10, INK2, 500, 'left', MONO);
      } else {
        sizeBox(x, RX + 316, CY + 36, E.outC(P(t, 1.2, 0.5)), 132, true);
        T(x, `320px 폭으로 줄이면 글자 높이 ${(TITLE_PX * 320 / 1080).toFixed(0)}px(계산)`, RX + 12, CY + 170, 11, PAL.ink, 600);
        T(x, `띠 영역 평균 차 ${diff.toFixed(1)} (${BAND_OK} 미만이면 같은 띠)`, RX + 12, CY + 188, 10.5, INK2, 500);
        T(x, '[기록] 시청 성과는 확인되지 않았다', RX + 12, CY + 206, 10, INK2, 500, 'left', MONO);
        ['점선 권장 크기', '노란 면 내 이미지'].forEach((l, i) => T(x, l, RX + RW - 10, CY + 197 + i * 13, 9.5, INK2, 500, 'right'));
      }
    } else if (L === 2) {
      T(x, '컴퓨터의 YouTube Studio 에서만 올릴 수 있다(공식 도움말)', RX + 12, CY + 19, 11, PAL.ink, 600);
      sizeBox(x, RX + 36, CY + 44, E.outC(P(t, 0.4, 0.6)), 128, false);
      const items = ['비율 9대16 권장', `권장 크기 ${REC_W}×${REC_H}`, `최소 높이 ${MIN_H}px`, 'JPG 또는 PNG', '컴퓨터 파일 50MB 이하', '계정 인증 필요'];
      items.forEach((s2, i) => { const ap = E.outC(P(t, 0.6 + i * 0.15, 0.35)); x.save(); x.globalAlpha = ap; T(x, s2, RX + 224, CY + 54 + i * 21, 11, PAL.ink, 500); x.restore(); });
      T(x, `내 이미지 ${OUT_W}×${OUT_H} 는 최소를 넘고 권장의 ${Math.round(OUT_W / REC_W * 100)}%`, RX + 12, CY + 214, 10.5, INK2, 500);
    } else {
      T(x, 'thumbnails.set 으로 세로 1080×1920 프레임을 지정해 본 기록', RX + 12, CY + 19, 11, PAL.ink, 600);
      [['API 응답', '정상', 0], ['이미지 서버 주소', '정상', 1], ['Studio 목록', '하루 뒤에도|빈 회색 칸', 2]].forEach(([nm, st, i]) => {
        const X0 = RX + 14 + i * 126, ap = E.outC(P(t, 0.4 + i * 0.5, 0.5)), bad = i === 2; x.save(); x.globalAlpha = ap;
        x.fillStyle = bad ? 'rgba(20,10,8,.22)' : 'rgba(255,244,236,.1)'; x.beginPath(); x.roundRect(X0, CY + 32, 116, 138, 5); x.fill(); x.strokeStyle = PAL.line; x.stroke();
        T(x, nm, X0 + 58, CY + 49, 11, PAL.ink, 600, 'center');
        if (bad) { x.fillStyle = '#8a8582'; x.fillRect(X0 + 28, CY + 60, 60, 80); x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 1; x.beginPath(); x.moveTo(X0 + 28, CY + 60); x.lineTo(X0 + 88, CY + 140); x.moveTo(X0 + 88, CY + 60); x.lineTo(X0 + 28, CY + 140); x.stroke(); }
        else { x.save(); x.beginPath(); x.rect(X0 + 28, CY + 60, 60, 80); x.clip(); frame(x, X0 + 28, CY + 60, 60, 80, TIMES[0], false, false); x.restore(); }
        mark(x, bad ? 'bad' : 'ok', X0 + 14, CY + 150); st.split('|').forEach((l, j) => T(x, l, X0 + 26, CY + 154 + j * 13, 10.5, bad ? BADC : OKC, 700)); x.restore();
      });
      T(x, '원인은 확인하지 못했다. 되돌리는 API 가 없어 Studio 에서 손으로 되돌렸다', RX + 12, CY + 192, 10.5, INK2, 500);
      T(x, '[기록] 표본 1편, 이후 자동 지정을 껐다', RX + 12, CY + 210, 10, INK2, 500, 'left', MONO);
    }
    s.pill.textContent = `${Math.max(1, L)}. ${STEP[Math.max(1, L) - 1]}`;
  },
};
export default demo;
