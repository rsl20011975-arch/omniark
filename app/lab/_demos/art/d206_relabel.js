/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/image-source-ledger/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 이미지 4장이 만들어질 때 사이드카 JSON 한 줄이 옆에 생기고, 장부 표에 올라가고, 공개 영상에는 own 과 generated 만 남는다.
// 기록은 데모용 예시 값이다. 영상에 쓸 수 있는 장수는 코드가 장부 값에서 세어 보여 준다. 화면은 시간 t 의 함수다.
const R_DUNES = 'licensed';          // dunes.png 의 권리 칸
const PINES_PROOF = false;      // pines.png 의 생성 스크립트 같은 증거를 찾았는가(false 면 사이드카가 없다 = unknown)
const ALLOWED = ['own', 'generated'];   // 공개 영상에 써도 되는 권리
const T_WRITE = [1.0, 2.2, 3.4, 4.6];   // 이미지마다 사이드카가 써지는 시각(초)
const T_DROP = 6.0;             // 공개 영상 줄에서 쓸 수 없는 이미지가 빠지기 시작하는 시각(초)
const PAL = { bg0: '#f4efe4', bg1: '#e9e2d3', ink: '#1d1a16', muted: '#6b6458', accent: '#d4472b', accent2: '#2b5d8a', surface: '#fbf8f1', line: 'rgba(29,26,22,.18)' };
const AMBER = '#8a5a00';
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif';
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

const IMGS = [
  { file: 'lake.png', scene: 0, rec: { factory: 'factory-a', method: '생성 모델, 프롬프트 기록', date: '2026-11-05', rights: 'generated' } },
  { file: 'dunes.png', scene: 1, rec: { factory: 'factory-b', method: R_DUNES === 'own' ? '직접 제작' : '받아 옴, 라이선스 확인', date: '2026-11-05', rights: R_DUNES } },
  { file: 'city.png', scene: 2, rec: { factory: 'factory-b', method: '받아 옴, 원본 주소 기록', date: '2026-11-05', rights: 'third-party' } },
  { file: 'pines.png', scene: 3, rec: PINES_PROOF ? { factory: 'factory-a', method: '생성 스크립트 발견', date: '2026-11-05', rights: 'generated' } : null },
];
const rightsOf = (im) => (im.rec ? im.rec.rights : 'unknown');
const usable = (im) => ALLOWED.includes(rightsOf(im));
const KIND = { own: [rgba('#2b5d8a', 0.14), '#1f4a73'], generated: [rgba('#2b5d8a', 0.14), '#1f4a73'], licensed: [rgba('#8a5a00', 0.14), AMBER], 'third-party': [rgba('#8a5a00', 0.14), AMBER], unknown: [rgba('#d4472b', 0.14), '#b53a1f'] };

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

let GRAIN = null;
function thumb(x, i, X, Y, W, H) {     // 정지 사진 느낌의 작은 이미지: 광원 있는 장면, 그레인, 가장자리 어둡힘, 접지 그림자
  x.save(); x.shadowColor = 'rgba(29,26,22,.32)'; x.shadowBlur = 8; x.shadowOffsetY = 3; x.fillStyle = '#222'; x.beginPath(); x.roundRect(X, Y, W, H, 3); x.fill(); x.restore();
  x.save(); x.beginPath(); x.roundRect(X, Y, W, H, 3); x.clip(); x.translate(X, Y); x.scale(W / 320, H / 180); SCENES[i](x);
  const v = x.createRadialGradient(160, 90, 80, 160, 90, 220); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.3)'); x.fillStyle = v; x.fillRect(0, 0, 320, 180);
  x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.16; x.drawImage(GRAIN, 0, 0, 320, 180); x.restore();
}
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function card(x, X, Y, W, H) { x.save(); x.shadowColor = 'rgba(29,26,22,.12)'; x.shadowBlur = 8; x.shadowOffsetY = 2; x.fillStyle = PAL.surface; x.beginPath(); x.roundRect(X, Y, W, H, 5); x.fill(); x.restore(); x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.roundRect(X, Y, W, H, 5); x.stroke(); }
function chip(x, s, X, Y, kind, al) {
  const [bg, fg] = KIND[kind] || [rgba('#6b6458', 0.12), PAL.muted]; x.font = `600 10.5px ${MONO}`; const w = x.measureText(s).width + 14;
  x.save(); x.globalAlpha = al == null ? 1 : al; x.fillStyle = bg; x.beginPath(); x.roundRect(X, Y, w, 17, 8.5); x.fill(); x.strokeStyle = rgba(fg, 0.5); x.lineWidth = 1; x.stroke(); T(x, s, X + 7, Y + 12, 10.5, fg, 600, 'left', MONO); x.restore(); return w;
}
const P = (t, a, d) => seg(t, a, a + d);

const demo = {
  dur: 8.0, rest: 7.6, noCompare: false, levels: 4,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(31), gc = document.createElement('canvas'); gc.width = 160; gc.height = 90;
    const gx = gc.getContext('2d'), gd = gx.createImageData(160, 90);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    return { main };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 4 : lv);   // 0 = 연출 전, 1 = 출처 없이 쌓임, 2 = 사이드카 생김, 3 = 장부에 올림, 4 = 공개 영상에서 걸러냄
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'multiply'; x.globalAlpha = 0.08; for (let gx0 = 0; gx0 < 640; gx0 += 160) for (let gy0 = 0; gy0 < 360; gy0 += 90) x.drawImage(GRAIN, gx0, gy0, 160, 90); x.restore();
    const written = (i) => L >= 2 && t >= T_WRITE[i];
    const known = (i) => written(i) && IMGS[i].rec;
    // 왼쪽: 이미지 목록
    T(x, '이미지 4장', 20, 24, 10.5, PAL.muted, 500, 'left', MONO);
    IMGS.forEach((im, i) => {
      const Y = 32 + i * 59, ap = E.outC(P(t, 0.1 + i * 0.12, 0.45)); x.save(); x.globalAlpha = ap; x.translate(0, (1 - ap) * 10);
      thumb(x, im.scene, 20, Y, 84, 47);
      T(x, im.file, 114, Y + 15, 12, PAL.ink, 600, 'left', MONO);
      if (written(i)) {
        const k = P(t, T_WRITE[i] + 0.1, 0.4); chip(x, rightsOf(im), 114, Y + 24, rightsOf(im), E.outC(k));
        if (usable(im) && L >= 3) T(x, '영상에 쓸 수 있음', 114, Y + 54, 10, '#1f4a73', 500);
      } else chip(x, L >= 2 ? '확인 중' : '출처 모름', 114, Y + 24, null, 1);
      x.restore();
    });
    // 오른쪽 위: 사이드카 JSON 카드
    card(x, 330, 20, 290, 130);
    let cur = -1; for (let i = 0; i < 4; i++) if (written(i)) cur = i;
    T(x, cur < 0 ? '사이드카 JSON' : IMGS[cur].file.replace('.png', '.json') + '  (예시 기록)', 342, 38, 10.5, PAL.muted, 500, 'left', MONO);
    if (cur < 0) {
      T(x, L >= 2 ? '곧 이미지 옆에 써진다' : '사이드카 없음', 342, 80, 13, PAL.ink, 600);
      T(x, '파일만 봐서는 누가 어떻게', 342, 102, 11.5, PAL.muted, 500); T(x, '만든 이미지인지 알 수 없다', 342, 118, 11.5, PAL.muted, 500);
    } else if (!IMGS[cur].rec) {
      const k = E.outC(P(t, T_WRITE[cur], 0.4)); x.save(); x.globalAlpha = k;
      T(x, `${IMGS[cur].file.replace('.png', '.json')} 없음`, 342, 80, 14, '#b53a1f', 700, 'left', MONO);
      T(x, '만든 곳, 방식, 날짜, 권리를', 342, 102, 11.5, PAL.ink, 500); T(x, '적은 기록이 없어 unknown', 342, 118, 11.5, PAL.ink, 500); x.restore();
    } else {
      const rc = IMGS[cur].rec, lines = ['{', `  "factory": "${rc.factory}",`, `  "method": "${rc.method}",`, `  "date": "${rc.date}",`, `  "rights": "${rc.rights}"`, '}'];
      lines.forEach((ln, j) => {
        const k = E.outC(P(t, T_WRITE[cur] + j * 0.07, 0.3)), isR = j === 4; x.save(); x.globalAlpha = k;
        T(x, ln, 342 + (1 - k) * 8, 58 + j * 15, 11.5, isR ? '#1f4a73' : PAL.ink, isR ? 700 : 500, 'left', MONO); x.restore();
      });
    }
    // 오른쪽 아래: 장부 표
    card(x, 330, 158, 290, 118);
    T(x, '장부(assets)', 342, 176, 10.5, PAL.muted, 500, 'left', MONO); T(x, '권리', 470, 176, 10.5, PAL.muted, 500, 'left', MONO); T(x, '공개 영상', 596, 176, 10.5, PAL.muted, 500, 'right', MONO);
    x.strokeStyle = PAL.line; x.beginPath(); x.moveTo(340, 182.5); x.lineTo(610, 182.5); x.stroke();
    let rows = 0, unk = 0, ok = 0;
    IMGS.forEach((im, i) => {
      const tr = T_WRITE[i] + 0.6; if (!(L >= 3 && t >= tr)) return;
      const Y = 197 + rows * 17, k = E.outC(P(t, tr, 0.35)); rows++;
      x.save(); x.globalAlpha = k; T(x, im.file, 342, Y, 11, PAL.ink, 500, 'left', MONO);
      T(x, rightsOf(im), 470, Y, 11, KIND[rightsOf(im)][1], 700, 'left', MONO);
      T(x, usable(im) ? '쓴다' : (L >= 4 && t >= T_DROP ? '뺀다' : '아직'), 596, Y, 11, usable(im) ? '#1f4a73' : '#b53a1f', 600, 'right'); x.restore();
      if (!im.rec) unk++; if (usable(im)) ok++;
    });
    if (L >= 3) T(x, `장부 ${IMGS.filter((im, i) => im.rec && t >= T_WRITE[i] + 0.6).length}줄, 기록 없음 ${unk}장`, 342, 269, 10.5, PAL.muted, 500, 'left', MONO);
    // 아래: 공개 영상에 들어가는 이미지 줄
    T(x, '공개 영상에 들어가는 이미지', 20, 292, 10.5, PAL.muted, 500, 'left', MONO);
    const sh = L >= 4 ? E.outC(P(t, T_DROP, 0.5)) : 0, cnt = IMGS.filter((im) => usable(im)).length;
    T(x, L >= 4 && t >= T_DROP + 0.2 ? `${IMGS.length}장 중 ${cnt}장 사용` : `${IMGS.length}장 사용`, 620, 292, 10.5, L >= 4 && t >= T_DROP ? '#1f4a73' : PAL.muted, 600, 'right', MONO);
    IMGS.forEach((im, i) => {
      const SX = 20 + i * 150, out = !usable(im) && L >= 4, dy = out ? sh * 12 : 0, al = out ? 1 - 0.65 * sh : 1;
      x.save(); x.globalAlpha = al; x.translate(0, dy); thumb(x, im.scene, SX, 298, 46, 26); T(x, im.file, SX + 54, 309, 10.5, PAL.ink, 600, 'left', MONO); x.restore();
      const gone = out && sh > 0.6;
      T(x, gone ? `제외 ${rightsOf(im)}` : (L >= 2 && t >= T_WRITE[i] ? rightsOf(im) : '출처 모름'), SX + 54, 321 + dy, 10, gone ? '#b53a1f' : PAL.muted, out ? 700 : 500, 'left', MONO);
      if (out && sh > 0.2) { x.strokeStyle = '#b53a1f'; x.lineWidth = 1.6; x.beginPath(); x.moveTo(SX - 2, 311 + dy); x.lineTo(SX - 2 + 140 * sh, 311 + dy); x.stroke(); }
    });
    // 이름표(caption-bl): 왼쪽 아래, 배경 없이 mono 12px muted, 위에 1px 선
    const cap = ['연출 전: 이미지만 있고 출처 칸이 모두 모름', '1단계: 출처를 적지 않은 이미지 4장', '2단계: 만드는 순간 사이드카 JSON 한 줄', '3단계: 사이드카를 장부 표에 한 줄씩 올림', '4단계: 장부 기준으로 공개 영상에서 걸러냄'][L];
    x.font = `500 12px ${MONO}`; const cw = Math.min(600, x.measureText(cap).width);
    x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.moveTo(20, 334.5); x.lineTo(20 + cw, 334.5); x.stroke(); T(x, cap, 20, 350, 12, PAL.muted, 500, 'left', MONO);
  },
};
export default demo;
