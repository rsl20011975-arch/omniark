/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/sound-risers/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng, rr } from "./helpers.js";

const PAL = { bg0: '#1b0e17', bg1: '#2b1424', ink: '#f6e9ee', muted: '#b095a3', accent: '#ff7aa8', accent2: '#ffd0a0', surface: '#26121f', line: 'rgba(246,233,238,.16)' };
const al = (h, a) => `rgba(${[1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(',')},${a})`;   // PAL 색에 투명도를 준다
const C_IMP = PAL.accent2, C_DL = '#9bb8ff', C_ST = PAL.accent;   // 층별 색(파형 줄, 설명 글자)

// 임팩트(쿵) 하나에 다운리프터(에너지가 내려가는 소리)와 스팅어(짧은 마침표)를 단계별로 얹은 소리의 '모양'을 코드로 합성해 파형·스펙트럼으로 보여 준다. 재생은 없다. 화면은 시간 t 의 함수다.
const DL_LEN = 0.6;          // 다운리프터가 내려가는 데 걸리는 시간(초)
const DL_F0 = 3000;          // 다운리프터가 시작할 때의 밝기(대역통과 중심 주파수, Hz). 150Hz까지 내려간다
const STING_DECAY = 0.12;    // 스팅어 소리가 줄어드는 시간상수(초). 작을수록 짧고 날카롭다
const HIT_T = 0.4;           // 임팩트 시각(초)
const STING_T = 2.5;         // 스팅어 시각(초)
const TOT = 3.6;             // 소리 전체 길이(초)
const REF = 36;              // 스펙트럼 색 눈금의 기준 크기(dB). 이 합성 결과의 가장 센 값에 맞춘 표시용 눈금
const SR = 16000, TAU = Math.PI * 2;
const SANS = "'IBM Plex Sans KR','Malgun Gothic',sans-serif", MONO = "'JetBrains Mono',monospace";
const TX2 = PAL.muted, INK = PAL.ink;

// ---- 신호 처리 도구 ----
const mk = (s) => new Float32Array(Math.round(s * SR));
function coef(type, f, Q) {
  const w = TAU * f / SR, cs = Math.cos(w), al = Math.sin(w) / (2 * Q);
  const a0 = 1 + al, a1 = -2 * cs, a2 = 1 - al;
  const b = type === 'lp' ? [(1 - cs) / 2, 1 - cs, (1 - cs) / 2] : [(1 + cs) / 2, -(1 + cs), (1 + cs) / 2];
  return [b[0] / a0, b[1] / a0, b[2] / a0, a1 / a0, a2 / a0];
}
function run(c, d) { let x1 = 0, x2 = 0, y1 = 0, y2 = 0; for (let i = 0; i < d.length; i++) { const x = d[i], y = c[0] * x + c[1] * x1 + c[2] * x2 - c[3] * y1 - c[4] * y2; x2 = x1; x1 = x; y2 = y1; y1 = y; d[i] = y; } return d; }
function svfBP(Q) { let lo = 0, bd = 0; const q1 = 1 / Q; return (x, fc) => { const f = 2 * Math.sin(Math.PI * Math.min(fc, SR / 5.3) / SR); lo += f * bd; const hi = x - lo - q1 * bd; bd += f * hi; return bd; }; }
function peakOf(d) { let p = 0; for (let i = 0; i < d.length; i++) { const a = Math.abs(d[i]); if (a > p) p = a; } return p; }
function scale(d, k) { for (let i = 0; i < d.length; i++) d[i] *= k; return d; }
function gp(d, i0, n, f) {   // 한 주파수의 세기(해닝 창, Goertzel)
  const co = 2 * Math.cos(TAU * f / SR); let s1 = 0, s2 = 0;
  for (let i = 0; i < n; i++) { const j = i0 + i, x = (j >= 0 && j < d.length ? d[j] : 0) * (0.5 - 0.5 * Math.cos(TAU * i / (n - 1))), s = x + co * s1 - s2; s2 = s1; s1 = s; }
  return s1 * s1 + s2 * s2 - co * s1 * s2;
}
const FR = Array.from({ length: 32 }, (_, b) => 80 * Math.pow(7000 / 80, b / 31));
function spec(d, T, W) {
  const v = new Float32Array(T * 32);
  for (let t = 0; t < T; t++) { const c = Math.round((t + .5) * d.length / T); for (let b = 0; b < 32; b++) v[t * 32 + b] = 10 * Math.log10(gp(d, c - W / 2, W, FR[b]) + 1e-12); }
  return v;
}
function cent(d, i0, n) { let a = 0, b = 0; for (let k = 0; k < 32; k++) { const p = gp(d, i0, n, FR[k]); a += p * FR[k]; b += p; } return a / (b || 1); }
function rmsDb(d, i0, n) { let s = 0; for (let i = 0; i < n; i++) s += d[i0 + i] * d[i0 + i]; return 10 * Math.log10(s / n + 1e-12); }
function envMs(d, from) {    // 최대치까지 걸린 시간(ms), 최대치의 -30dB 아래로 내려갈 때까지(ms)
  const w = Math.round(.005 * SR), e = []; let pk = 0, pi = from;
  for (let i = from; i + w < d.length; i += 16) { let s = 0; for (let j = 0; j < w; j += 2) s += d[i + j] * d[i + j]; const r = Math.sqrt(s / (w / 2)); e.push([i, r]); if (r > pk) { pk = r; pi = i; } }
  let st = from; for (const [i, r] of e) if (r > pk * .1) { st = i; break; }
  let en = pi; for (const [i, r] of e) if (i > pi && r > pk * .0316) en = i;
  return { atk: Math.max(0, (pi - st) / SR * 1000), dec: (en - pi) / SR * 1000 };
}
function peaks(d, w) { const mn = new Float32Array(w), mx = new Float32Array(w), n = d.length; for (let x = 0; x < w; x++) { let lo = 1, hi = -1; const a = Math.floor(x * n / w), b = Math.max(a + 1, Math.floor((x + 1) * n / w)); for (let i = a; i < b; i++) { if (d[i] < lo) lo = d[i]; if (d[i] > hi) hi = d[i]; } mn[x] = lo; mx[x] = hi; } return { mn, mx }; }

// ---- 소리 합성 ----
function synth() {
  const N = Math.round(TOT * SR), r = rng(7);
  const imp = mk(TOT), dl = mk(TOT), st = mk(TOT);
  const i0 = Math.round(HIT_T * SR); let ph = 0; const lp = coef('lp', 700, .7); const nz = mk(TOT);
  for (let i = i0; i < N; i++) { const k = (i - i0) / SR; ph += TAU * (45 + 75 * Math.exp(-k / .05)) / SR; imp[i] = Math.sin(ph) * Math.exp(-k / .22) * Math.min(1, k / .003); nz[i] = (r() * 2 - 1) * Math.exp(-k / .07) * .5; }
  run(lp, nz); for (let i = 0; i < N; i++) imp[i] += nz[i];
  const d0 = Math.round((HIT_T + .05) * SR), dn = Math.round(DL_LEN * SR), bp = svfBP(2.2); let p2 = 0;
  for (let i = 0; i < dn && d0 + i < N; i++) { const u = i / dn, fc = DL_F0 * Math.pow(150 / DL_F0, u); p2 += TAU * 700 * Math.pow(120 / 700, u) / SR; dl[d0 + i] = (bp(r() * 2 - 1, fc) + .1 * Math.sin(p2)) * Math.pow(1 - u, 1.4) * Math.min(1, i / (.02 * SR)); }
  const s0 = Math.round(STING_T * SR), notes = [220, 261.63, 329.63, 440], hn = mk(TOT);
  for (let i = s0; i < N; i++) { const k = (i - s0) / SR; let v = 0; for (const f of notes) for (let h = 1; h <= 5; h++) v += Math.sin(TAU * f * h * k) / h; st[i] = v * Math.min(1, k / .003) * Math.exp(-k / STING_DECAY); hn[i] = (r() * 2 - 1) * Math.exp(-k / .01) * 3; }
  run(coef('hp', 3000, .7), hn); run(coef('lp', 3200, .7), st); for (let i = 0; i < N; i++) st[i] += hn[i] * .3;
  scale(imp, .9 / peakOf(imp)); scale(dl, .5 / peakOf(dl)); scale(st, .7 / peakOf(st));
  const m3 = mk(TOT), m2 = mk(TOT), m1 = mk(TOT);
  for (let i = 0; i < N; i++) { m1[i] = imp[i]; m2[i] = imp[i] + dl[i]; m3[i] = m2[i] + st[i]; }
  const k = .9 / peakOf(m3), fade = Math.round(.025 * SR);
  [imp, dl, st, m1, m2, m3].forEach((d) => { scale(d, k); for (let i = 0; i < fade; i++) d[N - 1 - i] *= i / fade; });
  return { imp, dl, st, mix: [m1, m2, m3] };
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
function heat(v) {
  const S = [[0, 27, 14, 23], [.3, 96, 32, 92], [.6, 226, 84, 112], [.85, 255, 172, 124], [1, 255, 236, 214]];
  for (let i = 1; i < S.length; i++) if (v <= S[i][0]) { const p = (v - S[i - 1][0]) / (S[i][0] - S[i - 1][0]); return `rgb(${Math.round(lerp(S[i - 1][1], S[i][1], p))},${Math.round(lerp(S[i - 1][2], S[i][2], p))},${Math.round(lerp(S[i - 1][3], S[i][3], p))})`; }
  return 'rgb(255,238,196)';
}
function specDraw(c, v, T, x, y, w, h, ref, rev) {
  panel(c, x, y, w, h); const cw = w / T, ch = h / 32;
  for (let t = 0; t < T; t++) { c.globalAlpha = t / T <= rev ? 1 : .35; for (let b = 0; b < 32; b++) { const u = Math.max(0, Math.min(1, (v[t * 32 + b] - ref + 50) / 50)); if (u < .03) continue; c.fillStyle = heat(u); c.fillRect(x + t * cw, y + h - (b + 1) * ch, cw + .5, ch + .5); } }
  c.globalAlpha = 1;
}
const fy = (f, y, h) => y + h - Math.log(f / 80) / Math.log(7000 / 80) * h;

const demo = {
  dur: 3.8, rest: 3.4, noCompare: false, levels: 3,
  mount(sp) {
    const cv = el('canvas', null, sp); cv.width = 1280; cv.height = 720; cv.style.cssText = 'position:absolute;left:0;top:0;width:640px;height:360px';
    const gc = document.createElement('canvas'); gc.width = gc.height = 96; const g = gc.getContext('2d'), r = rng(3), im = g.createImageData(96, 96);
    for (let i = 0; i < 96 * 96; i++) { const v = Math.round(r() * 255); im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } g.putImageData(im, 0, 0);
    const b = synth(), T = 96, W = 384, P = (d) => peaks(d, 500);
    const sig = { imp: envMs(b.imp, 0), st: envMs(b.st, Math.round(STING_T * SR) - 200) };
    const d0 = Math.round((HIT_T + .05) * SR), dn = Math.round(DL_LEN * SR), w2 = Math.round(.2 * SR);
    sig.c0 = cent(b.dl, d0, w2); sig.c1 = cent(b.dl, d0 + dn - w2, w2); sig.r0 = rmsDb(b.dl, d0, w2); sig.r1 = rmsDb(b.dl, d0 + dn - w2, w2);
    return { ctx: cv.getContext('2d'), grain: gc, b, sps: [], ref: REF, T, sig, spec(L) { return this.sps[L - 1] || (this.sps[L - 1] = spec(this.b.mix[L - 1], T, W)); }, pk: { imp: P(b.imp), dl: P(b.dl), st: P(b.st), mix: b.mix.map(P) } };
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 3 : lv), c = s.ctx, X = 124, W = 500, ph = Math.min(1, t / TOT);
    c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1; bgFill(c, s.grain);
    const lanes = [['임팩트', C_IMP, s.pk.imp, 1], ['다운리프터', C_DL, s.pk.dl, 2], ['스팅어', C_ST, s.pk.st, 3]];
    lanes.forEach(([n, col, pk, need], i) => {
      const y = 46 + i * 30, on = L >= need;
      tx(c, n, 16, y + 17, 12, on ? col : TX2, 600);
      if (on) wave(c, pk, X, y, W, 26, col, ph, 1.5); else { panel(c, X, y, W, 26); tx(c, '아직 없음', X + 10, y + 17, 11, TX2, 500); }
    });
    wave(c, s.pk.mix[L - 1], X, 140, W, 34, INK, ph, 1);
    tx(c, '합친 소리', 16, 161, 12, INK, 700);
    specDraw(c, s.spec(L), s.T, X, 182, W, 92, s.ref, ph);
    [[100, '100'], [1000, '1k'], [5000, '5k']].forEach(([f, l]) => tx(c, l, X - 6, fy(f, 182, 92) + 4, 10, TX2, 500, 'right', MONO));
    tx(c, '스펙트럼', 16, 232, 12, PAL.accent2, 700);
    if (L >= 2) {   // 다운리프터가 이어지는 구간을 옅은 띠로 표시
      const x0 = X + (HIT_T + .05) / TOT * W, x1 = X + (HIT_T + .05 + DL_LEN) / TOT * W;
      c.fillStyle = al(C_DL, .12); c.fillRect(x0, 76, x1 - x0, 198); c.fillStyle = al(C_DL, .75); c.fillRect(x0 - .5, 76, 1, 198); c.fillRect(x1 - .5, 76, 1, 198);
      if (x1 - x0 > 60) tx(c, `다운리프터 구간 ${DL_LEN.toFixed(1)}초`, (x0 + x1) / 2, 198, 10.5, '#bcd0ff', 600, 'center');
    }
    const px = X + ph * W; c.fillStyle = al(PAL.ink, .92); c.fillRect(px - .7, 42, 1.4, 232);
    const q = s.sig; let y = 292;
    tx(c, `임팩트  최대까지 ${q.imp.atk.toFixed(0)}ms · 최대치의 -30dB 아래로 내려가기까지 ${q.imp.dec.toFixed(0)}ms`, 16, y, 10.5, TX2, 500, 'left', MONO); y += 15;
    if (L >= 2) tx(c, `다운리프터  밝기(무게중심) ${q.c0.toFixed(0)}Hz → ${q.c1.toFixed(0)}Hz · 크기 ${q.r0.toFixed(0)}dB → ${q.r1.toFixed(0)}dB`, 16, y, 10.5, '#bcd0ff', 500, 'left', MONO); y += 15;
    if (L >= 3) tx(c, `스팅어  최대까지 ${q.st.atk.toFixed(0)}ms · -30dB 아래까지 ${q.st.dec.toFixed(0)}ms`, 16, y, 10.5, C_ST, 500, 'left', MONO);
    tx(c, '재생 버튼 없음. 파형과 스펙트럼은 코드로 합성한 값입니다.', 16, 24, 10.5, TX2, 500);
    const post = t < HIT_T ? '임팩트 직전' : (L >= 2 && t < STING_T ? '다운리프터: 임팩트 뒤 에너지가 아래로 내려감' : (L >= 3 ? '스팅어: 짧고 날카로운 마침표' : (L >= 2 ? '다운리프터가 끝남' : '임팩트 하나만 · 뒤가 이어지지 않음')));
    c.fillStyle = PAL.line; c.fillRect(16, 334, 608, 1); tx(c, post, 16, 350, 12, TX2, 500, 'left', MONO);   // 이름표(caption-bl): 왼쪽 아래, 배경 없이 얇은 선 위에
  },
};
export default demo;
