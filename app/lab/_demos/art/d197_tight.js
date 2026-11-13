/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/hold-camera/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

const PAL = { bg0: '#a9402c', bg1: '#8f3322', ink: '#fff4ec', muted: '#ffd9c9', accent: '#ffe27a', accent2: '#1d1a16', surface: '#b24a34', line: '#e08a6c' };
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const box = (e, o) => Object.assign(e.style, o);

// 도착해서 멈춘 그림 한 장(HOLD_LEN초)을 샷으로 잘라 밀기와 당기기를 번갈아 건다. 정지 비율과 컷 경계의 프레임 차는 장면에서 코드가 센다.
const MAX_SHOT = 2.4;     // 한 샷의 최대 길이(초)
const SPEED = .07;        // 샷 안에서 배율이 변하는 평균 속도(0.07 = 7%/초)
const TIGHT = 1.15;        // 홀수 샷이 시작하는 배율(타이트)
const HOLD_LEN = 7.2;     // 그림이 멈춰 있는 시간(초)
const ORIGINS = [[.3, .45], [.7, .45]];   // 당기기 샷의 기준점(가로, 세로 비율)
const STILL_THR = 0.5, CUT_THR = 25, FPS = 10;   // 10fps, 64px 회색 자: 프레임 차 0.5 미만 = 정지, 25 이상 = 컷
const SRC_W = 1664, SRC_H = 936, OUT_W = 1280;

function ridge(r, n, rough) {
  const v = new Array(n + 1).fill(0); v[0] = r() - .5; v[n] = r() - .5;
  let step = n, amp = 1;
  while (step > 1) { const h = step / 2; for (let i = h; i < n; i += step) v[i] = (v[i - h] + v[i + h]) / 2 + (r() - .5) * amp; amp *= rough; step = h; }
  const m = Math.max(...v.map(Math.abs)) || 1;
  return v.map((x) => x / m);
}

function paintCanyon(W, H) {   // 해 질 녘 협곡(코드로 그린 사진 같은 정지 장면): 층리 있는 바위산, 기둥 바위, 선인장
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d'), r = rng(197), HZ = H * .6, SX = W * .74;
  const sky = g.createLinearGradient(0, 0, 0, HZ);
  sky.addColorStop(0, '#6d2f3c'); sky.addColorStop(.42, '#c8604a'); sky.addColorStop(.8, '#f7b27a'); sky.addColorStop(1, '#ffe0a8');
  g.fillStyle = sky; g.fillRect(0, 0, W, HZ + 2);
  [[640, .45], [300, .6], [120, .85]].forEach(([rad, a]) => {
    const rg = g.createRadialGradient(SX, HZ - 70, 0, SX, HZ - 70, rad); rg.addColorStop(0, rgba('#fff0c0', a)); rg.addColorStop(1, rgba('#fff0c0', 0)); g.fillStyle = rg; g.fillRect(0, 0, W, HZ);
  });
  g.fillStyle = '#fff6d8'; g.beginPath(); g.arc(SX, HZ - 70, 30, 0, 7); g.fill();
  g.filter = 'blur(10px)';
  for (let i = 0; i < 12; i++) { g.fillStyle = rgba(i % 2 ? '#ffd0a0' : '#8a3a4a', .16 + r() * .16); g.beginPath(); g.ellipse(r() * W, HZ * (.12 + r() * .55), 150 + r() * 320, 5 + r() * 10, (r() - .5) * .05, 0, 7); g.fill(); }
  g.filter = 'none';
  const mesas = [{ b: HZ + 6, a: 150, c0: '#d58c6e', c1: '#c27a5c', k: .5, s: 4 }, { b: HZ + 30, a: 210, c0: '#b5583f', c1: '#9a4632', k: .55, s: 5 }, { b: HZ + 70, a: 270, c0: '#8a3828', c1: '#5e231c', k: .6, s: 4 }];
  mesas.forEach((L, li) => {   // 꼭대기가 평평한 바위산 세 겹(멀수록 옅다)
    const n = 128, v = ridge(r, n, L.k), ys = v.map((x) => { const q = Math.round((.5 + .5 * x) * L.s) / L.s; return L.b - L.a * (.15 + .85 * q); });
    const sm = ys.map((y, i) => (ys[Math.max(0, i - 1)] + 2 * y + ys[Math.min(n, i + 1)]) / 4);
    const top = Math.min(...sm), gr = g.createLinearGradient(0, top, 0, L.b); gr.addColorStop(0, L.c0); gr.addColorStop(1, L.c1);
    g.save(); g.beginPath(); g.moveTo(0, H); sm.forEach((y, i) => g.lineTo(i * W / n, y)); g.lineTo(W, H); g.closePath(); g.clip();
    g.fillStyle = gr; g.fillRect(0, top, W, H - top);
    for (let y = top; y < L.b + 60; y += 9 + r() * 12) { g.fillStyle = rgba(r() < .5 ? '#2a0d0a' : '#ffc08a', .05 + r() * .1); g.fillRect(0, y, W, 2 + r() * 5); }   // 층리
    for (let i = 0; i < 90; i++) { const x = r() * W, y0 = top + r() * (L.b - top); g.fillStyle = rgba('#2a0d0a', .06 + r() * .1); g.fillRect(x, y0, 1 + r() * 2, 20 + r() * 90); }   // 빗물 자국
    const lt = g.createLinearGradient(0, 0, W, 0); lt.addColorStop(0, rgba('#1a0808', .32)); lt.addColorStop(.7, rgba('#ffc890', 0)); lt.addColorStop(1, rgba('#ffd7a0', .22));
    g.fillStyle = lt; g.fillRect(0, top, W, H - top);
    g.restore();
    const hz = g.createLinearGradient(0, L.b - 200, 0, L.b + 30); hz.addColorStop(0, rgba('#ffc890', 0)); hz.addColorStop(1, rgba('#ffc890', .18 - li * .04)); g.fillStyle = hz; g.fillRect(0, L.b - 200, W, 230);
  });
  const gd = g.createLinearGradient(0, HZ + 80, 0, H); gd.addColorStop(0, '#d9946a'); gd.addColorStop(.4, '#b86a46'); gd.addColorStop(1, '#6e3320');
  g.fillStyle = gd; g.fillRect(0, HZ + 78, W, H - HZ - 78);
  for (let i = 0; i < 260; i++) { const y = HZ + 90 + Math.pow(r(), 1.4) * (H - HZ - 90), d = (y - HZ) / (H - HZ); g.strokeStyle = rgba(r() < .5 ? '#ffd9a0' : '#3a150e', .05 + r() * .1); g.lineWidth = .8 + d * 1.6; const x = r() * W, w = 40 + d * 220 * r(); g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + w / 2, y - 3 - d * 7, x + w, y); g.stroke(); }
  const GY = HZ + 230, PX = W * .3;   // 기둥 바위(왼쪽 3분의 1 지점)와 긴 그림자
  g.fillStyle = rgba('#2a0d0a', .34); g.beginPath(); g.moveTo(PX - 30, GY); g.lineTo(PX - 520, GY + 40); g.lineTo(PX - 510, GY + 62); g.lineTo(PX + 30, GY + 22); g.closePath(); g.fill();
  const pil = [[PX - 46, GY], [PX - 40, GY - 150], [PX - 28, GY - 250], [PX - 56, GY - 285], [PX - 78, GY - 330], [PX - 40, GY - 352], [PX + 20, GY - 356], [PX + 66, GY - 336], [PX + 52, GY - 292], [PX + 28, GY - 250], [PX + 36, GY - 140], [PX + 52, GY]];
  const pg = g.createLinearGradient(PX - 70, 0, PX + 70, 0); pg.addColorStop(0, '#6a2a1f'); pg.addColorStop(.55, '#b4583c'); pg.addColorStop(1, '#f0a070');
  g.save(); g.beginPath(); pil.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.clip();
  g.fillStyle = pg; g.fillRect(PX - 100, GY - 370, 200, 380);
  for (let y = GY - 360; y < GY; y += 7 + r() * 9) { g.fillStyle = rgba(r() < .5 ? '#2a0d0a' : '#ffd0a0', .08 + r() * .14); g.fillRect(PX - 100, y, 200, 2 + r() * 4); }
  g.restore();
  g.strokeStyle = rgba('#ffe0b0', .55); g.lineWidth = 2; g.beginPath(); pil.slice(5, 10).forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke();
  const CXA = W * .7, CYA = HZ + 250;   // 선인장(오른쪽 3분의 1 지점)
  g.fillStyle = rgba('#2a0d0a', .3); g.beginPath(); g.ellipse(CXA - 150, CYA + 8, 190, 12, 0, 0, 7); g.fill();
  g.lineCap = 'round'; g.lineJoin = 'round';
  [['#1f2c22', 34, 0], ['#3f5a40', 28, -6], ['#6f8f62', 7, -10]].forEach(([col, w, dx]) => {
    g.strokeStyle = col; g.lineWidth = w;
    g.beginPath(); g.moveTo(CXA + dx, CYA); g.lineTo(CXA + dx, CYA - 230); g.stroke();
    g.beginPath(); g.moveTo(CXA + dx, CYA - 80); g.lineTo(CXA - 60 + dx, CYA - 80); g.lineTo(CXA - 60 + dx, CYA - 170); g.stroke();
    g.beginPath(); g.moveTo(CXA + dx, CYA - 120); g.lineTo(CXA + 56 + dx, CYA - 120); g.lineTo(CXA + 56 + dx, CYA - 190); g.stroke();
  });
  for (let i = 0; i < 80; i++) { g.fillStyle = rgba('#ffe9b0', .5); g.fillRect(CXA - 70 + r() * 140, CYA - 230 + r() * 230, 1.4, 1.4); }
  for (let i = 0; i < 46; i++) { const x = r() * W, y = GY + 20 + r() * (H - GY - 30), s = 6 + r() * 26; g.fillStyle = rgba('#3a150e', .8); g.beginPath(); g.ellipse(x, y, s, s * .5, 0, 0, 7); g.fill(); g.fillStyle = rgba('#ffb880', .28); g.beginPath(); g.ellipse(x + s * .25, y - s * .12, s * .5, s * .22, 0, 0, 7); g.fill(); }
  const vg = g.createRadialGradient(W / 2, H / 2, W * .3, W / 2, H / 2, W * .8); vg.addColorStop(0, rgba('#1a0808', 0)); vg.addColorStop(1, rgba('#1a0808', .5)); g.fillStyle = vg; g.fillRect(0, 0, W, H);
  const id = g.getImageData(0, 0, W, H), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const n = (r() - .5) * 12; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  g.putImageData(id, 0, 0);
  return c;
}

const ioq = (u) => (u < .5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u));   // power1.inOut
const SHOTS = (() => { const cuts = [0]; let last = 0; while (HOLD_LEN - last > MAX_SHOT + 1e-9) { last += MAX_SHOT; cuts.push(last); } cuts.push(HOLD_LEN); return cuts.slice(0, -1).map((a, k) => ({ a, b: cuts[k + 1], k })); })();
const shotAt = (t) => SHOTS.find((x) => t < x.b) || SHOTS[SHOTS.length - 1];

function viewAt(t, L) {   // 단계별 카메라: 배율 s 와 기준점(ox, oy)
  if (L <= 0) return { s: 1, ox: .5, oy: .5 };
  if (L === 1) return { s: 1 + SPEED * HOLD_LEN * seg(t, 0, HOLD_LEN), ox: .5, oy: .5 };   // 자르지 않고 끝까지 민다
  const sh = shotAt(t), d = sh.b - sh.a, travel = SPEED * d;
  const u = L >= 4 ? ioq(seg(t, sh.a, sh.b)) : seg(t, sh.a, sh.b);
  if (L >= 3 && sh.k % 2 === 1) { const o = ORIGINS[(sh.k >> 1) % 2]; return { s: lerp(TIGHT, TIGHT * (1 - travel / 2), u), ox: o[0], oy: o[1] }; }   // 홀수 샷: 타이트에서 당기기
  return { s: lerp(1, 1 + travel, u), ox: .5, oy: .5 };   // 짝수 샷: 넓게 밀기
}
const crop = (v) => { const w = SRC_W / v.s, h = SRC_H / v.s; return [v.ox * SRC_W * (1 - 1 / v.s), v.oy * SRC_H * (1 - 1 / v.s), w, h]; };

function makeAnalyzer(src) {   // 사진을 256×144, 64×36 회색으로 두 번 줄여 프레임 차를 센다(10fps)
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d', { willReadFrequently: true }); g.imageSmoothingQuality = 'high'; return [c, g]; };
  const [c1, g1] = mk(256, 144), [, g2] = mk(64, 36), cache = {};
  const gray = (v) => {
    const [x, y, w, h] = crop(v);
    g1.drawImage(src, x, y, w, h, 0, 0, 256, 144); g2.drawImage(g1.canvas, 0, 0, 256, 144, 0, 0, 64, 36);
    const d = g2.getImageData(0, 0, 64, 36).data, o = new Float32Array(2304);
    for (let i = 0; i < 2304; i++) o[i] = .299 * d[i * 4] + .587 * d[i * 4 + 1] + .114 * d[i * 4 + 2];
    return o;
  };
  return (L) => {
    if (cache[L]) return cache[L];
    const n = Math.round(HOLD_LEN * FPS), fr = [], df = [];
    for (let k = 0; k <= n; k++) fr.push(gray(viewAt(Math.min(k / FPS, HOLD_LEN - 1e-6), L)));
    for (let k = 0; k < n; k++) { let s = 0; for (let i = 0; i < 2304; i++) s += Math.abs(fr[k + 1][i] - fr[k][i]); df.push(s / 2304); }
    let run = 0, best = 0; df.forEach((x) => { run = x < STILL_THR ? run + 1 : 0; best = Math.max(best, run); });
    const cutDiff = SHOTS.slice(1).map((sh) => df[Math.round(sh.a * FPS) - 1]);
    return (cache[L] = { df, still: df.filter((x) => x < STILL_THR).length / n * 100, best: best / FPS, cutMax: cutDiff.length ? Math.max(...cutDiff) : 0, cuts: df.filter((x) => x >= CUT_THR).length });
  };
}

const NAMES = ['멈춘 채로 둔다', '자르지 않고 7.2초 내내 민다', '2.4초 샷으로 잘라 모두 민다', '홀수 샷은 타이트에서 당긴다', 'power1.inOut 이징을 건다'];
const SHORT = ['멈춘 채', '한 샷 밀기', '샷으로 자르기', '밀기와 당기기', '이징 추가'];

const demo = {
  dur: HOLD_LEN, rest: 6.9, noCompare: false, levels: 4,
  mount(sp) {
    const src = paintCanyon(SRC_W, SRC_H), an = makeAnalyzer(src);
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: `linear-gradient(160deg,${PAL.bg0},${PAL.bg1})` });
    const fr = el('div', null, sp);
    box(fr, { position: 'absolute', left: '14px', top: '18px', width: '372px', height: '209px', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 10px 24px rgba(40,10,5,.5), 0 0 0 1px ' + PAL.line });
    const cv = el('canvas', null, fr); cv.width = OUT_W; cv.height = 720; box(cv, { width: '372px', height: '209px', display: 'block' });
    const ov = el('canvas', null, sp); ov.width = 1280; ov.height = 720; box(ov, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const tx = (txt, o) => { const e = el('div', null, sp, txt); box(e, Object.assign({ position: 'absolute', whiteSpace: 'nowrap', font: "500 11px/1.25 'JetBrains Mono',monospace", color: PAL.muted }, o)); return e; };
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '24px', top: '28px', padding: '5px 11px', borderRadius: '999px', background: rgba(PAL.bg1, .88), color: PAL.ink, border: '1px solid ' + PAL.line, font: "600 12px/1 'IBM Plex Sans KR',sans-serif" });
    const t = {
      head: tx('정지 비율(10fps, 64px 자)', { left: '402px', top: '20px', color: PAL.ink, font: "600 12px/1 'IBM Plex Sans KR',sans-serif" }),
      live: tx('', { left: '14px', top: '298px', color: PAL.ink }),
      lab: tx('', { left: '14px', top: '320px', whiteSpace: 'normal', width: '372px', font: "500 11px/1.4 'IBM Plex Sans KR',sans-serif" }),
      info: tx('', { left: '402px', top: '240px', whiteSpace: 'normal', width: '226px', color: PAL.ink, font: "500 11px/1.5 'IBM Plex Sans KR',sans-serif" }),
    };
    const rows = NAMES.map((n, i) => ({ lab: tx(SHORT[i], { left: '402px', top: (44 + i * 40) + 'px', font: "500 11px/1 'IBM Plex Sans KR',sans-serif" }), val: tx('', { left: '584px', top: (44 + i * 40) + 'px', color: PAL.ink }) }));
    return { src, an, cv, ctx: cv.getContext('2d'), ov: ov.getContext('2d'), pill, t, rows };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 4 : lv);
    const v = viewAt(t, L), [cx, cy, cw, ch] = crop(v), g = s.ctx; g.imageSmoothingQuality = 'high';
    g.drawImage(s.src, cx, cy, cw, ch, 0, 0, OUT_W, 720);
    s.pill.textContent = NAMES[L];
    const o = s.ov; o.clearRect(0, 0, 1280, 720);
    const bx = 28, bw = 744, by = 496, bh = 40;   // 샷 띠(0~HOLD_LEN초)
    o.fillStyle = rgba(PAL.bg1, .8); o.fillRect(bx, by, bw, bh); o.strokeStyle = PAL.line; o.lineWidth = 2; o.strokeRect(bx, by, bw, bh);
    const blocks = L <= 1 ? [{ a: 0, b: HOLD_LEN, k: 0 }] : SHOTS;
    blocks.forEach((sh) => {
      const x0 = bx + sh.a / HOLD_LEN * bw, x1 = bx + sh.b / HOLD_LEN * bw, pull = L >= 3 && sh.k % 2 === 1;
      o.fillStyle = L === 0 ? rgba(PAL.muted, .25) : pull ? PAL.muted : PAL.accent; o.fillRect(x0 + 3, by + 6, x1 - x0 - 6, bh - 12);
      o.fillStyle = PAL.accent2; o.font = "600 22px 'IBM Plex Sans KR',sans-serif"; o.textBaseline = 'middle';
      o.fillText(L === 0 ? '멈춤' : pull ? '당기기' : '밀기', x0 + 14, by + bh / 2 + 1);
    });
    o.fillStyle = PAL.muted; o.font = "500 18px 'JetBrains Mono',monospace"; o.textBaseline = 'top';
    (L <= 1 ? [0, HOLD_LEN] : [...SHOTS.map((x) => x.a), HOLD_LEN]).forEach((x) => { const px = bx + x / HOLD_LEN * bw; o.fillText(x.toFixed(1), Math.min(px, bx + bw - 34), by + bh + 6); });
    o.fillStyle = PAL.ink; o.fillRect(bx + t / HOLD_LEN * bw - 2, by - 8, 4, bh + 16);
    const sh = shotAt(t), pull = L >= 3 && sh.k % 2 === 1, ratio = v.s * OUT_W / SRC_W;
    s.t.live.textContent = L === 0 ? `멈춤 ${t.toFixed(1)}초째  배율 1.00` : `${L <= 1 ? '샷 1/1' : `샷 ${sh.k + 1}/${SHOTS.length}`} ${pull ? '당기기' : '밀기'}  배율 ${v.s.toFixed(2)}  원본 1px → 화면 ${ratio.toFixed(2)}px${ratio > 1.005 ? ' (흐림)' : ''}`;
    s.t.lab.textContent = L <= 1 ? '샷 경계가 없다' : `샷 길이 ${SHOTS.map((x) => (x.b - x.a).toFixed(1)).join(' + ')} = ${HOLD_LEN.toFixed(1)}초`;
    s.rows.forEach((rw, i) => {
      const on = i <= L, m = on ? s.an(i) : null, y = (58 + i * 40) * 2, x0 = 402 * 2, w = 190 * 2;
      rw.lab.style.visibility = rw.val.style.visibility = on ? 'visible' : 'hidden';
      if (!on) return;
      rw.val.textContent = m.still.toFixed(0) + '%';
      o.fillStyle = rgba(PAL.bg1, .8); o.fillRect(x0, y, w, 14);
      o.fillStyle = i === L ? PAL.accent : rgba(PAL.muted, .85); o.fillRect(x0, y, m.still / 100 * w, 14);
    });
    const m = s.an(L);
    s.t.info.textContent = `이 구성(${NAMES[L]})\n가장 길게 이어진 정지 ${m.best.toFixed(1)}초\n샷 경계의 프레임 차 ${L <= 1 ? '없음' : m.cutMax.toFixed(1) + ' (컷 기준 ' + CUT_THR + ')'}\n프레임 차 25 이상인 칸 ${m.cuts}개`;
    s.t.info.style.whiteSpace = 'pre-line';
  },
};
export default demo;
