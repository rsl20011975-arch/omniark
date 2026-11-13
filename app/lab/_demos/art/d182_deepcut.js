/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/sound-eq/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng, rr } from "./helpers.js";

const PAL = { bg0: '#0c1814', bg1: '#15271f', ink: '#e8f1ea', muted: '#86a091', accent: '#7fe0a8', accent2: '#e8d27a', surface: '#12231c', line: 'rgba(232,241,234,.14)' };
const al = (h, a) => `rgba(${[1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(',')},${a})`;   // PAL 색에 투명도를 준다
const C_LOW = '#8ab8ff', C_MID = PAL.accent2, C_HI = '#ff8fb0';   // 웅웅, 먹먹, 쉬익 구간과 필터 색

// '웅웅거리는 저음 + 먹먹한 중저음 + 쉬익 고음'이 섞인 목소리 비슷한 소리에 EQ 필터를 한 가지씩 더해 가며, 필터 곡선과 소리의 주파수 모양이 어떻게 바뀌는지 코드로 계산해 보여 준다. 재생은 없다.
const HPF_HZ = 90;           // 이 주파수보다 낮은 소리를 깎는 고역통과 필터(저음 자르기)의 기준 주파수(Hz)
const CUT_DB = -12;           // 280Hz 부근 먹먹한 대역을 줄이는 피킹 필터의 세기(dB). 음수는 줄이기
const SHELF_DB = 4;          // 4500Hz 위를 통째로 올리는 하이쉘프 필터의 세기(dB)
const CUT_HZ = 280, CUT_Q = 1.1, SHELF_HZ = 4500;
const TOT = 3.0;
const SR = 16000, TAU = Math.PI * 2;
const SANS = "'IBM Plex Sans KR','Malgun Gothic',sans-serif", MONO = "'JetBrains Mono',monospace";
const TX2 = PAL.muted, INK = PAL.ink;
const F0 = 25, F1 = 7500, NB = 40, T = 30, W = 1024;
const REF_DB = -21;          // 주파수 모양 그림의 위쪽 기준 크기(dB). 이 시험 소리의 가장 센 값에 맞춘 표시용 눈금
const FR = Array.from({ length: NB }, (_, b) => F0 * Math.pow(F1 / F0, b / (NB - 1)));
const BANDS = [['웅웅', 40, 90, C_LOW], ['먹먹', 200, 400, C_MID], ['쉬익', 4000, 7000, C_HI]];

// ---- 신호 처리 도구 ----
const mk = (s) => new Float32Array(Math.round(s * SR));
function coef(type, f, Q, g) {   // RBJ 오디오 이퀄라이저 쿡북의 이차 필터 계수
  const A = Math.pow(10, (g || 0) / 40), w = TAU * f / SR, cs = Math.cos(w), sn = Math.sin(w), al = sn / (2 * Q), sA = 2 * Math.sqrt(A) * al;
  let b0, b1, b2, a0, a1, a2;
  if (type === 'hp') { b0 = (1 + cs) / 2; b1 = -(1 + cs); b2 = b0; a0 = 1 + al; a1 = -2 * cs; a2 = 1 - al; }
  else if (type === 'lp') { b0 = (1 - cs) / 2; b1 = 1 - cs; b2 = b0; a0 = 1 + al; a1 = -2 * cs; a2 = 1 - al; }
  else if (type === 'peak') { b0 = 1 + al * A; b1 = -2 * cs; b2 = 1 - al * A; a0 = 1 + al / A; a1 = -2 * cs; a2 = 1 - al / A; }
  else { b0 = A * ((A + 1) + (A - 1) * cs + sA); b1 = -2 * A * ((A - 1) + (A + 1) * cs); b2 = A * ((A + 1) + (A - 1) * cs - sA); a0 = (A + 1) - (A - 1) * cs + sA; a1 = 2 * ((A - 1) - (A + 1) * cs); a2 = (A + 1) - (A - 1) * cs - sA; }
  return [b0 / a0, b1 / a0, b2 / a0, a1 / a0, a2 / a0];
}
function run(c, d) { let x1 = 0, x2 = 0, y1 = 0, y2 = 0; for (let i = 0; i < d.length; i++) { const x = d[i], y = c[0] * x + c[1] * x1 + c[2] * x2 - c[3] * y1 - c[4] * y2; x2 = x1; x1 = x; y2 = y1; y1 = y; d[i] = y; } return d; }
function magDb(c, f) {   // 필터가 주파수 f 소리를 몇 dB 키우거나 줄이는지
  const w = TAU * f / SR, nr = c[0] + c[1] * Math.cos(w) + c[2] * Math.cos(2 * w), ni = -c[1] * Math.sin(w) - c[2] * Math.sin(2 * w);
  const dr = 1 + c[3] * Math.cos(w) + c[4] * Math.cos(2 * w), di = -c[3] * Math.sin(w) - c[4] * Math.sin(2 * w);
  return 10 * Math.log10((nr * nr + ni * ni) / (dr * dr + di * di));
}
function peakOf(d) { let p = 0; for (let i = 0; i < d.length; i++) { const a = Math.abs(d[i]); if (a > p) p = a; } return p; }
function gp(d, i0, n, f) {
  const co = 2 * Math.cos(TAU * f / SR); let s1 = 0, s2 = 0;
  for (let i = 0; i < n; i++) { const j = i0 + i, x = (j >= 0 && j < d.length ? d[j] : 0) * (0.5 - 0.5 * Math.cos(TAU * i / (n - 1))), s = x + co * s1 - s2; s2 = s1; s1 = s; }
  return s1 * s1 + s2 * s2 - co * s1 * s2;
}
function frames(d) { const o = []; for (let t = 0; t < T; t++) { const c = Math.round((t + .5) * d.length / T), r = new Float32Array(NB); for (let b = 0; b < NB; b++) r[b] = gp(d, c - W / 2, W, FR[b]); o.push(r); } return o; }
function peaks(d, w) { const mn = new Float32Array(w), mx = new Float32Array(w), n = d.length; for (let x = 0; x < w; x++) { let lo = 1, hi = -1; const a = Math.floor(x * n / w), b = Math.max(a + 1, Math.floor((x + 1) * n / w)); for (let i = a; i < b; i++) { if (d[i] < lo) lo = d[i]; if (d[i] > hi) hi = d[i]; } mn[x] = lo; mx[x] = hi; } return { mn, mx }; }
const g2 = (f, c, bw) => Math.exp(-Math.pow((f - c) / bw, 2));
const db = (p) => 10 * Math.log10(p + 1e-12) + 20 * Math.log10(4 / W);   // 해닝 창 크기로 맞춰, 그 주파수 사인파의 크기(최대 1 = 0dB 기준)에 가깝게

// ---- 시험 소리: 목소리 비슷한 소리 + 웅웅(저음 잡음) + 쉬익(고음 잡음) ----
function source() {
  const N = Math.round(TOT * SR), r = rng(17), v = mk(TOT), rum = mk(TOT), hiss = mk(TOT);
  const syl = [[.25, .85], [1, 1.6], [1.75, 2.35], [2.5, 2.95]], wts = new Float32Array(29); let ph = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR; let e = 0; for (const [a, b] of syl) if (t > a && t < b) e = Math.pow(Math.sin(Math.PI * (t - a) / (b - a)), 2);
    const f0 = 140 + 20 * Math.sin(TAU * .7 * t); ph += TAU * f0 / SR; let s = 0;
    if (i % 64 === 0) for (let h = 1; h <= 28; h++) { const f = f0 * h; wts[h] = Math.pow(h, -.5) * (.9 * g2(f, 500, 200) + .6 * g2(f, 1500, 350) + .35 * g2(f, 2600, 500) + .55 * g2(f, 260, 130) + .05); }   // 모음 모양 가중치는 4ms 마다만 다시 계산
    if (e > 0) for (let h = 1; h <= 28; h++) s += Math.sin(ph * h) * wts[h];
    v[i] = s * e; rum[i] = r() * 2 - 1; hiss[i] = r() * 2 - 1;
  }
  run(coef('lp', 100, .7), rum); run(coef('hp', 4200, .7), hiss);
  const kv = .5 / peakOf(v), kr = .3 / peakOf(rum), kh = .09 / peakOf(hiss), d = mk(TOT);
  for (let i = 0; i < N; i++) { const t = i / SR; d[i] = v[i] * kv + rum[i] * kr + .06 * Math.sin(TAU * 50 * t) + hiss[i] * kh; }
  return d;
}
function filters() {   // 단계(L)마다 걸리는 필터 목록. 1단계는 아무것도 없다
  return [
    { type: 'hp', f: HPF_HZ, Q: .707, g: 0, name: '저음 자르기', label: `${HPF_HZ}Hz 아래 자름`, col: C_LOW },
    { type: 'peak', f: CUT_HZ, Q: CUT_Q, g: CUT_DB, name: '먹먹함 줄이기', label: `${CUT_HZ}Hz ${CUT_DB}dB`, col: C_MID },
    { type: 'hs', f: SHELF_HZ, Q: .707, g: SHELF_DB, name: '고음 올리기', label: `${SHELF_HZ}Hz 위 +${SHELF_DB}dB`, col: C_HI },
  ];
}
function build() {
  const src = source(), F = filters(), lv = [src];
  for (let n = 1; n <= F.length; n++) { const d = Float32Array.from(src); F.slice(0, n).forEach((q) => run(coef(q.type, q.f, q.Q, q.g), d)); lv.push(d); }
  const k = .9 / Math.max(...lv.map(peakOf)); lv.forEach((d) => { for (let i = 0; i < d.length; i++) d[i] *= k; });
  const bandDb = (a, lo, hi) => { let s = 0, n = 0; FR.forEach((f, b) => { if (f >= lo && f <= hi) { s += a[b]; n++; } }); return db(s / n); };
  const cache = [], statCache = [];   // 필요한 단계의 주파수 모양만 그때그때 계산해 둔다
  const info = (i) => cache[i] || (cache[i] = (() => { const fr = frames(lv[i]); return { fr, avg: FR.map((_, b) => fr.reduce((s, r) => s + r[b], 0) / T) }; })());
  const stat = (i) => statCache[i] || (statCache[i] = BANDS.map(([, lo, hi]) => bandDb(info(i).avg, lo, hi)));
  return { lv, F, info, stat, pk: lv.map((d) => peaks(d, 500)), curve: (L) => Array.from({ length: 96 }, (_, i) => { const f = F0 * Math.pow(F1 / F0, i / 95); return [f, F.slice(0, L - 1).reduce((s, q) => s + magDb(coef(q.type, q.f, q.Q, q.g), f), 0)]; }) };
}

// ---- 그리기 도구 ----
function tx(c, s, x, y, size, col, wt, al, font) { c.save(); c.fillStyle = col; c.font = (wt || 500) + ' ' + size + 'px ' + (font || SANS); c.textAlign = al || 'left'; c.textBaseline = 'alphabetic'; c.fillText(s, x, y); c.restore(); }
function bgFill(c, grain) {
  const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, PAL.bg0); g.addColorStop(1, PAL.bg1); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
  const r = c.createRadialGradient(470, 120, 10, 470, 120, 330); r.addColorStop(0, al(PAL.accent, .09)); r.addColorStop(1, al(PAL.accent, 0)); c.fillStyle = r; c.fillRect(0, 0, 640, 360);
  c.globalAlpha = .05; c.fillStyle = c.createPattern(grain, 'repeat'); c.fillRect(0, 0, 640, 360); c.globalAlpha = 1;
}
function panel(c, x, y, w, h) { rr(c, x, y, w, h, 6); c.fillStyle = PAL.surface; c.fill(); c.strokeStyle = PAL.line; c.lineWidth = 1; c.stroke(); }
function wave(c, pk, x, y, w, h, col, rev, gain) {
  panel(c, x, y, w, h); const mid = y + h / 2, k = h / 2 * gain;
  for (let i = 0; i < pk.mn.length; i++) { c.fillStyle = i / pk.mn.length <= rev ? col : col + '4d'; const a = mid - pk.mx[i] * k, b = mid - pk.mn[i] * k; c.fillRect(x + i, a, 1, Math.max(1, b - a)); }
  c.fillStyle = al(PAL.ink, .16); c.fillRect(x, mid - .3, w, .6);
}
const lx = (f, x, w) => x + Math.log(f / F0) / Math.log(F1 / F0) * w;

const demo = {
  dur: 3.4, rest: 3.0, noCompare: false, levels: 4,
  mount(sp) {
    const cv = el('canvas', null, sp); cv.width = 1280; cv.height = 720; cv.style.cssText = 'position:absolute;left:0;top:0;width:640px;height:360px';
    const gc = document.createElement('canvas'); gc.width = gc.height = 96; const g = gc.getContext('2d'), r = rng(3), im = g.createImageData(96, 96);
    for (let i = 0; i < 96 * 96; i++) { const v = Math.round(r() * 255); im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } g.putImageData(im, 0, 0);
    const b = build();
    return Object.assign(b, { ctx: cv.getContext('2d'), grain: gc });
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 4 : lv), c = s.ctx, ph = Math.min(1, t / TOT);
    c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1; bgFill(c, s.grain);
    // 왼쪽: 필터 곡선(EQ 설정 그림)
    const GX = 44, GW = 264, GY = 68, GH = 104, dbY = (v) => GY + GH / 2 - v / 15 * GH / 2;
    panel(c, 16, 46, 300, 140); tx(c, 'EQ 설정(필터 곡선)', 24, 60, 11, TX2, 600);
    c.strokeStyle = al(PAL.ink, .1); c.lineWidth = 1; [-12, -6, 0, 6, 12].forEach((v) => { c.beginPath(); c.moveTo(GX, dbY(v)); c.lineTo(GX + GW, dbY(v)); c.stroke(); tx(c, (v > 0 ? '+' : '') + v, GX - 4, dbY(v) + 3.5, 9.5, TX2, 500, 'right', MONO); });
    [[100, '100'], [1000, '1k'], [5000, '5k']].forEach(([f, l]) => { c.beginPath(); c.moveTo(lx(f, GX, GW), GY + 8); c.lineTo(lx(f, GX, GW), GY + GH); c.stroke(); tx(c, l, lx(f, GX, GW), 181, 9.5, TX2, 500, 'center', MONO); });
    const cur = s.curve(L); c.beginPath(); cur.forEach(([f, v], i) => { const X = lx(f, GX, GW), Y = dbY(Math.max(-15, Math.min(15, v))); i ? c.lineTo(X, Y) : c.moveTo(X, Y); });
    c.save(); c.lineTo(GX + GW, dbY(0)); c.lineTo(GX, dbY(0)); c.closePath(); const fg = c.createLinearGradient(0, GY, 0, GY + GH); fg.addColorStop(0, al(PAL.accent, .30)); fg.addColorStop(.5, al(PAL.accent, .05)); fg.addColorStop(1, al(PAL.accent, .30)); c.fillStyle = fg; c.fill(); c.restore();
    c.beginPath(); cur.forEach(([f, v], i) => { const X = lx(f, GX, GW), Y = dbY(Math.max(-15, Math.min(15, v))); i ? c.lineTo(X, Y) : c.moveTo(X, Y); });
    c.save(); c.shadowColor = al(PAL.accent, .6); c.shadowBlur = 6; c.strokeStyle = PAL.accent; c.lineWidth = 2; c.stroke(); c.restore();
    s.F.slice(0, L - 1).forEach((q, i) => {   // 필터마다 동그란 손잡이와 이름표
      const X = lx(q.f, GX, GW), v = q.type === 'hp' ? 0 : q.g, Y = dbY(Math.max(-14, Math.min(14, v))); c.beginPath(); c.arc(X, Y, 5.5, 0, TAU); c.fillStyle = PAL.bg0; c.fill(); c.lineWidth = 2; c.strokeStyle = q.col; c.stroke();
      tx(c, q.label, Math.min(Math.max(X, GX + 40), GX + GW - 40), q.type === 'hp' ? dbY(0) - 10 : (q.g < 0 ? dbY(q.g) + 20 : dbY(q.g) - 10), 10, q.col, 600, 'center');
    });
    if (L === 1) tx(c, '필터 없음 · 곡선이 평평(0dB)', GX + GW / 2, dbY(0) - 8, 10.5, TX2, 600, 'center');
    // 오른쪽: 지금 위치의 소리 주파수 모양(최근 6칸 평균)
    const SX = 340, SW = 272, SY = 68, SH = 104; panel(c, 326, 46, 298, 140); tx(c, '소리의 주파수 모양(지금 위치)', 334, 60, 11, TX2, 600);
    const idx = Math.min(T - 1, Math.floor(ph * T)), pw = (L0) => FR.map((_, b) => { let sm = 0, n = 0; for (let k = Math.max(0, idx - 5); k <= idx; k++) { sm += s.info(L0).fr[k][b]; n++; } return db(sm / n); });
    const yy = (v) => SY + SH - Math.max(0, Math.min(1, (v - (REF_DB - 62)) / 62)) * SH;
    BANDS.forEach(([n, lo, hi, col]) => { const x0 = lx(lo, SX, SW), x1 = lx(hi, SX, SW); c.fillStyle = col + '24'; c.fillRect(x0, SY, x1 - x0, SH); tx(c, n, (x0 + x1) / 2, SY + 10, 9.5, col, 600, 'center'); });
    const draw = (v, fill, line, wd) => { c.beginPath(); v.forEach((q, b) => { const X = lx(FR[b], SX, SW), Y = yy(q); b ? c.lineTo(X, Y) : c.moveTo(X, Y); }); c.save(); if (fill) { c.lineTo(SX + SW, SY + SH); c.lineTo(SX, SY + SH); c.closePath(); c.fillStyle = fill; c.fill(); } else { c.strokeStyle = line; c.lineWidth = wd; c.stroke(); } c.restore(); };
    const before = pw(0); draw(before, al(PAL.ink, .10)); draw(before, null, PAL.muted, 1.2);
    if (L > 1) { const after = pw(L - 1); draw(after, al(PAL.accent, .20)); c.save(); c.shadowColor = al(PAL.accent, .5); c.shadowBlur = 5; draw(after, null, PAL.accent, 1.8); c.restore(); }
    [[100, '100'], [1000, '1k'], [5000, '5k']].forEach(([f, l]) => tx(c, l, lx(f, SX, SW), 181, 9.5, TX2, 500, 'center', MONO));
    // 아래: 파형 두 줄 + 훑는 선
    const X0 = 124, W0 = 500;
    tx(c, '원본', 16, 211, 12, PAL.muted, 600); wave(c, s.pk[0], X0, 196, W0, 22, PAL.muted, ph, 1);
    tx(c, L > 1 ? 'EQ 후' : 'EQ 없음', 16, 237, 12, PAL.accent, 700); wave(c, s.pk[L - 1], X0, 222, W0, 22, PAL.accent, ph, 1);
    c.fillStyle = al(PAL.ink, .92); c.fillRect(X0 + ph * W0 - .7, 194, 1.4, 52);
    // 숫자(전체 소리에서 계산)
    let y = 266; BANDS.forEach(([n, lo, hi, col], i) => {
      const a0 = s.stat(0)[i], a1 = s.stat(L - 1)[i], dl = a1 - a0;
      tx(c, `${n} ${lo >= 1000 ? lo / 1000 + '~' + hi / 1000 + 'kHz' : lo + '~' + hi + 'Hz'}  평균 ${a0.toFixed(0)}dB → ${a1.toFixed(0)}dB  (${Math.abs(dl) < .05 ? '변화 없음' : (dl > 0 ? '+' : '-') + Math.abs(dl).toFixed(1) + 'dB'})`, 16, y, 10.5, col, 500, 'left', MONO); y += 15;
    });
    c.fillStyle = PAL.muted; c.fillRect(16, 321, 8, 8); tx(c, '원본', 28, 329, 10.5, TX2, 500); c.fillStyle = PAL.accent; c.fillRect(66, 321, 8, 8); tx(c, 'EQ 후', 78, 329, 10.5, TX2, 500);
    tx(c, '재생 버튼 없음 · 곡선과 주파수 모양은 코드로 계산한 값입니다. 소리는 직접 들어 보고 판단하세요.', 16, 348, 10.5, TX2, 500);
    const post = ['EQ 없음 · 원본 그대로(곡선이 평평)', `필터 ① 저음 자르기: ${HPF_HZ}Hz 아래를 깎아 웅웅을 줄임`, `필터 ② 먹먹함 줄이기: ${CUT_HZ}Hz 부근 ${CUT_DB}dB`, `필터 ③ 고음 올리기: ${SHELF_HZ}Hz 위 +${SHELF_DB}dB (쉬익도 같이 커짐)`][L - 1];
    c.font = '500 12px ' + SANS; const pwd = c.measureText(post).width + 24; rr(c, 14, 12, pwd, 24, 12); c.fillStyle = al(PAL.bg0, .9); c.fill(); c.strokeStyle = al(PAL.accent, .5); c.stroke(); tx(c, post, 26, 28, 12, INK, 500);
  },
};
export default demo;
