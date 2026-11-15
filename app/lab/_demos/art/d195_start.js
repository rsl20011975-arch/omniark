/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/still-camera-zoom/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

const PAL = { bg0: '#1f3a8a', bg1: '#172a63', ink: '#f3f6ff', muted: '#aebcf0', accent: '#ffd166', accent2: '#7fe0ff', surface: '#1b3274', line: '#3b57b0' };
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

// 정지 사진 한 장을 0초부터 밀어 넣는다. 화면은 시간 t 의 함수고, 속도·선명도 숫자는 아래 장면에서 코드가 직접 계산한다.
const ZEND = 1.30;   // 도착 확대 배율(원본 사진이 허락하는 한도)
const Z0 = 1.00;     // 0초의 시작 배율. 이미 확대된 채로 출발한다
const DUR = 2.6;     // 밀어 넣는 시간(초)
const OUT_W = 1280, SRC_W = 1664, SRC_H = 936;   // 출력 가로, 원본 사진 가로·세로(px)
const FX = .56, FY = .60;                        // 4단계에서 중심이 향하는 곳(호수 건너 오두막)
const SPEED_MAX = 60;                            // 속도 그래프 세로축(%/초)
const box = (e, o) => Object.assign(e.style, o);

function ridge(r, n, rough) {   // 중점 변위로 능선 높이 -1..1 배열을 만든다
  const v = new Array(n + 1).fill(0);
  v[0] = r() - .5; v[n] = r() - .5;
  let step = n, amp = 1;
  while (step > 1) {
    const h = step / 2;
    for (let i = h; i < n; i += step) v[i] = (v[i - h] + v[i + h]) / 2 + (r() - .5) * amp;
    amp *= rough; step = h;
  }
  const m = Math.max(...v.map(Math.abs)) || 1;
  return v.map((x) => x / m);
}

function pine(g, r, x, y, h) {   // 가지 층이 어긋난 소나무 실루엣
  const tiers = 7 + Math.floor(r() * 4), w = h * .26;
  g.beginPath(); g.moveTo(x, y - h);
  for (let i = 1; i <= tiers; i++) {
    const f = i / tiers, yy = y - h * (1 - f), ww = w * f;
    g.lineTo(x + ww * (.7 + .3 * r()), yy - h * .01);
    g.lineTo(x + ww * .38, yy + h * .012);
  }
  for (let i = tiers; i >= 1; i--) {
    const f = i / tiers, yy = y - h * (1 - f), ww = w * f;
    g.lineTo(x - ww * .38, yy + h * .012);
    g.lineTo(x - ww * (.7 + .3 * r()), yy - h * .01);
  }
  g.closePath(); g.fill();
  g.fillRect(x - h * .012, y - h * .05, h * .024, h * .08);
}

function paintLake(W, H) {   // 해 질 녘 호수와 산(코드로 그린 사진 같은 정지 장면)
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d'), r = rng(195), HZ = H * .62, SX = W * .34;
  const sky = g.createLinearGradient(0, 0, 0, HZ);
  sky.addColorStop(0, PAL.bg1); sky.addColorStop(.36, '#2f4fa6'); sky.addColorStop(.72, '#b58ab8'); sky.addColorStop(1, '#ffc690');
  g.fillStyle = sky; g.fillRect(0, 0, W, HZ + 2);
  for (let i = 0; i < 90; i++) { g.fillStyle = rgba('#ffffff', .2 + r() * .5); const s = r() < .12 ? 2.2 : 1.2; g.fillRect(r() * W, r() * HZ * .42, s, s); }
  [[620, .5], [300, .62], [110, .9]].forEach(([rad, a]) => {   // 반경이 다른 세 겹의 노을빛
    const rg = g.createRadialGradient(SX, HZ - 10, 0, SX, HZ - 10, rad);
    rg.addColorStop(0, rgba('#fff0c8', a)); rg.addColorStop(1, rgba('#fff0c8', 0));
    g.fillStyle = rg; g.fillRect(0, 0, W, HZ);
  });
  g.filter = 'blur(16px)';
  for (let i = 0; i < 18; i++) {
    g.fillStyle = rgba(i % 3 ? '#ffb99a' : '#6f62b4', .14 + r() * .14);
    g.beginPath(); g.ellipse(r() * W, HZ * (.12 + r() * .6), 120 + r() * 300, 7 + r() * 16, (r() - .5) * .08, 0, 7); g.fill();
  }
  g.filter = 'none';
  [{ b: HZ - 96, a: 150, c0: '#8a82bd', c1: '#c79bbb', k: .5 }, { b: HZ - 52, a: 165, c0: '#4a559e', c1: '#8c78ab', k: .52 }, { b: HZ - 8, a: 190, c0: '#1b2866', c1: '#444b8a', k: .55 }].forEach((L, li) => {
    const n = 256, v = ridge(r, n, L.k), ys = v.map((x) => L.b - L.a * (.5 + .5 * x) * (li === 2 ? .85 : 1));
    const top = Math.min(...ys), gr = g.createLinearGradient(0, top, 0, HZ);
    gr.addColorStop(0, L.c0); gr.addColorStop(1, L.c1);
    g.beginPath(); g.moveTo(0, HZ);
    ys.forEach((y, i) => g.lineTo(i * W / n, y));
    g.lineTo(W, HZ); g.closePath(); g.fillStyle = gr; g.fill();
    g.beginPath(); ys.forEach((y, i) => (i ? g.lineTo(i * W / n, y) : g.moveTo(0, y)));
    g.strokeStyle = rgba('#ffd9a8', .3 - li * .06); g.lineWidth = 1.6; g.stroke();
    const hz = g.createLinearGradient(0, HZ - 220, 0, HZ);
    hz.addColorStop(0, rgba('#ffc0a0', 0)); hz.addColorStop(1, rgba('#ffc0a0', .2));
    g.fillStyle = hz; g.fillRect(0, HZ - 220, W, 220);
  });
  const CXA = W * .575, CYA = HZ - 10;   // 호수 건너 낮은 곶과 오두막
  g.fillStyle = '#10163f'; g.beginPath(); g.moveTo(W * .44, HZ);
  const lv = ridge(r, 64, .6);
  lv.forEach((x, i) => g.lineTo(W * (.44 + .27 * i / 64), HZ - 8 - 7 * (.5 + .5 * x) * Math.sin(Math.PI * i / 64)));
  g.lineTo(W * .71, HZ); g.closePath(); g.fill();
  for (let i = 0; i < 26; i++) pine(g, r, W * (.45 + r() * .25), HZ + 1, 16 + r() * 26);
  g.fillStyle = '#1a1a3e'; g.fillRect(CXA - 22, CYA - 14, 44, 22);
  g.fillStyle = '#0b0e2c'; g.beginPath(); g.moveTo(CXA - 28, CYA - 13); g.lineTo(CXA, CYA - 34); g.lineTo(CXA + 28, CYA - 13); g.closePath(); g.fill();
  const lake = g.createLinearGradient(0, HZ, 0, H);
  lake.addColorStop(0, '#f0b08e'); lake.addColorStop(.16, '#b886ac'); lake.addColorStop(.55, '#33478f'); lake.addColorStop(1, PAL.bg1);
  g.fillStyle = lake; g.fillRect(0, HZ, W, H - HZ);
  g.save(); g.beginPath(); g.rect(0, HZ, W, H - HZ); g.clip();
  g.translate(0, 2 * HZ); g.scale(1, -1); g.globalAlpha = .5; g.filter = 'blur(2.5px)';
  g.drawImage(c, 0, 0, W, HZ, 0, 0, W, HZ);
  g.restore(); g.filter = 'none';
  for (let i = 0; i < 320; i++) {
    const y = HZ + 3 + Math.pow(r(), 1.5) * (H - HZ), d = (y - HZ) / (H - HZ);
    g.fillStyle = r() < .5 ? rgba('#ffe0b8', .05 + r() * .14) : rgba('#0e1a4a', .08 + r() * .14);
    g.fillRect(r() * W, y, 20 + r() * (70 + d * 160), 1 + d * 1.8);
  }
  for (let y = HZ + 2; y < H; y += 3) {   // 해가 호수에 부서지는 줄기
    const d = (y - HZ) / (H - HZ), w = 8 + d * 150 * (.4 + r() * .6);
    g.fillStyle = rgba('#fff0c8', .55 * (1 - d) * (.5 + r() * .5)); g.fillRect(SX - w / 2 + (r() - .5) * 14, y, w, 1.6);
  }
  const wg = g.createLinearGradient(0, HZ, 0, HZ + 110);   // 오두막 창이 물에 비친 줄기
  wg.addColorStop(0, rgba('#ffc46a', .55)); wg.addColorStop(1, rgba('#ffc46a', 0));
  g.fillStyle = wg; g.fillRect(CXA - 4, HZ, 8, 110);
  g.globalCompositeOperation = 'lighter';   // 오두막 창의 불빛
  [[46, .35], [20, .6]].forEach(([rad, a]) => {
    const rg = g.createRadialGradient(CXA + 6, CYA - 4, 0, CXA + 6, CYA - 4, rad);
    rg.addColorStop(0, rgba('#ffc46a', a)); rg.addColorStop(1, rgba('#ffc46a', 0));
    g.fillStyle = rg; g.fillRect(CXA - 60, CYA - 60, 130, 130);
  });
  g.globalCompositeOperation = 'source-over';
  g.fillStyle = '#ffe0a0'; g.fillRect(CXA + 2, CYA - 8, 9, 7);
  g.fillStyle = '#05091f';   // 가까운 기슭과 소나무
  const sh = ridge(r, 64, .55);
  g.beginPath(); g.moveTo(0, H);
  sh.forEach((x, i) => g.lineTo(i * W / 64, H - 60 - 26 * (.5 + .5 * x) * (1 - Math.abs(i - 14) / 70)));
  g.lineTo(W, H); g.closePath(); g.fill();
  [[.04, 520], [.12, 400], [.2, 300], [.29, 210], [.9, 480], [.97, 560], [.84, 280], [.76, 170]].forEach(([x, h]) => pine(g, r, W * x, H - 36, h * (.92 + r() * .16)));
  const vg = g.createRadialGradient(W / 2, H / 2, W * .3, W / 2, H / 2, W * .78);   // 가장자리 어둡게
  vg.addColorStop(0, rgba('#050a24', 0)); vg.addColorStop(1, rgba('#050a24', .5));
  g.fillStyle = vg; g.fillRect(0, 0, W, H);
  const id = g.getImageData(0, 0, W, H), d = id.data;   // 그레인: 그라디언트 띠(밴딩)를 지운다
  for (let i = 0; i < d.length; i += 4) { const n = (r() - .5) * 12; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  g.putImageData(id, 0, 0);
  return c;
}

function zoomAt(t, L) {   // 단계별 배율 곡선
  const p = seg(t, 0, DUR);
  if (L <= 0) return 1;
  if (L === 1) return 1 + (ZEND - 1) * p;                                     // 같은 속도
  if (L === 2) return 1 + (ZEND - 1) * (1 - Math.cos(Math.PI * p)) / 2;       // 코사인 가감속
  return Z0 + (ZEND - Z0) * (1 - Math.pow(1 - p, 4));                         // 0초에 최고 속도, 4차 감속
}
const speedAt = (t, L) => {   // 지금 배율에 대한 초당 변화율(%/초). 0.08초 간격의 평균
  if (L <= 0) return 0;
  const t1 = Math.max(0, t - .04), t2 = t1 + .08;
  return Math.max(0, (zoomAt(t2, L) - zoomAt(t1, L)) / .08 / zoomAt(t, L) * 100);
};

const demo = {
  dur: 5.2, rest: 5.0, noCompare: false, levels: 4,
  mount(sp) {
    const src = paintLake(SRC_W, SRC_H);
    const cv = el('canvas', null, sp); cv.width = OUT_W; cv.height = 720;
    box(cv, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const scrim = el('div', null, sp);
    box(scrim, { position: 'absolute', left: '0', top: '0', width: '330px', height: '120px', background: 'radial-gradient(ellipse at 0 0, rgba(11,20,60,.78), rgba(11,20,60,0) 72%)' });
    const num = el('div', null, sp, '0');
    box(num, { position: 'absolute', left: '18px', top: '10px', font: "400 40px/1 'Black Han Sans',sans-serif", color: PAL.accent, textShadow: '0 2px 10px rgba(5,10,40,.6)' });
    const desc = el('div', null, sp, '');
    box(desc, { position: 'absolute', left: '58px', top: '18px', font: "500 13px/1.3 'IBM Plex Sans KR',sans-serif", color: PAL.ink, textShadow: '0 1px 10px rgba(5,10,40,.8)' });
    const read = el('div', null, sp);
    box(read, { position: 'absolute', left: '14px', bottom: '14px', padding: '10px 12px', borderRadius: '10px', background: rgba(PAL.surface, .82), border: `1px solid ${PAL.line}`, font: "500 12px/1.6 'JetBrains Mono',monospace", color: PAL.ink, whiteSpace: 'pre', boxShadow: '0 10px 20px rgba(5,10,40,.4)' });
    const cap = el('div', null, sp, '속도 %/초');
    box(cap, { position: 'absolute', left: '418px', top: '274px', font: "500 11px/1 'JetBrains Mono',monospace", color: PAL.muted });
    const lab6 = el('div', null, sp, '6');
    box(lab6, { position: 'absolute', left: '612px', top: (284 + 54 - 6 / SPEED_MAX * 54 - 5) + 'px', font: "500 10px/1 'JetBrains Mono',monospace", color: PAL.accent2 });
    return { src, cv, ctx: cv.getContext('2d'), num, desc, read };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 4 : lv);
    const z = zoomAt(t, L), p = seg(t, 0, DUR), k = L >= 4 ? 1 - Math.pow(1 - p, 4) : 0;
    const sw = SRC_W / z, sh = SRC_H / z;
    const cx = Math.min(Math.max(lerp(.5, FX, k) * SRC_W, sw / 2), SRC_W - sw / 2), cy = Math.min(Math.max(lerp(.5, FY, k) * SRC_H, sh / 2), SRC_H - sh / 2);
    const g = s.ctx;
    g.imageSmoothingQuality = 'high';
    g.drawImage(s.src, cx - sw / 2, cy - sh / 2, sw, sh, 0, 0, OUT_W, 720);
    const px = 424 * 2, py = 284 * 2, pw = 204 * 2, ph = 54 * 2;   // 속도 그래프 판
    g.fillStyle = rgba(PAL.surface, .84); g.beginPath(); g.roundRect(px - 18, py - 34, pw + 36, ph + 56, 12); g.fill();
    g.strokeStyle = rgba(PAL.line, 1); g.lineWidth = 1.5; g.stroke();
    const yy = (v) => py + ph - Math.min(v, SPEED_MAX) / SPEED_MAX * ph;
    g.strokeStyle = rgba(PAL.accent2, .8); g.setLineDash([8, 6]); g.beginPath(); g.moveTo(px, yy(6)); g.lineTo(px + pw, yy(6)); g.stroke(); g.setLineDash([]);
    g.beginPath();
    for (let i = 0; i <= 80; i++) { const tt = i / 80 * demo.dur, x = px + i / 80 * pw; (i ? g.lineTo(x, yy(speedAt(tt, L))) : g.moveTo(x, yy(speedAt(tt, L)))); }
    g.strokeStyle = rgba(PAL.muted, .95); g.lineWidth = 3; g.stroke();
    const dx = px + t / demo.dur * pw, dy = yy(speedAt(t, L));
    g.fillStyle = PAL.accent; g.beginPath(); g.arc(dx, dy, 7, 0, 7); g.fill();
    const names = ['확대 없음', '같은 속도로 밀기', '코사인 가감속', '0초부터, 4차 감속', '피사체 쪽으로 중심 이동'];
    s.num.textContent = String(L); s.desc.textContent = names[L];
    const ratio = z * OUT_W / SRC_W;
    s.read.textContent = `확대 ${z.toFixed(2)}배   속도 ${speedAt(t, L).toFixed(1)}%/초\n원본 1px → 화면 ${ratio.toFixed(2)}px ${ratio > 1.005 ? '(늘어남: 흐림)' : '(선명)'}`;
  },
};
export default demo;
