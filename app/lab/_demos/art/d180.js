/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/sound-glitch-shutter/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng, rr } from "./helpers.js";

const PAL = { bg0: '#0b0f1a', bg1: '#161d30', ink: '#f4efe4', muted: '#8b94a3', accent: '#ffb36b', accent2: '#ffd27a', surface: '#131a2b', line: 'rgba(244,239,228,.14)' };
const al = (h, a) => `rgba(${[1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(',')},${a})`;   // PAL 색에 투명도를 준다
const C_CLEAN = '#7fd6c9', C_GL = PAL.accent2, C_SH = '#ff8fc4', C_DROP = '#ff6b6b';   // 층별 색(파형 줄, 색 띠)

// 깨끗한 4음 + 클릭 한 번(기본)에, 글리치(조각 반복·비트 깎기·무음 구멍)와 2단 셔터 소리를 단계별로 얹은 소리의 '모양'을 코드로 합성해 파형·스펙트럼으로 보여 준다. 재생은 없다.
const GL_SLICE = 0.06;       // 되풀이하는 소리 조각 하나의 길이(초). 작을수록 잘게 떨린다
const GL_REPEAT = 6;         // 같은 조각을 이어 붙이는 횟수
const CRUSH_BITS = 4;        // 비트 깎기 뒤 남기는 해상도(비트). 작을수록 거칠다
const CRUSH_HOLD = 6;        // 비트 깎기에서 같은 값을 붙들고 있는 샘플 수(6이면 16000Hz가 약 2667Hz처럼 거칠어진다)
const SH_GAP = 0.12;         // 셔터 첫 소리와 둘째 막 소리 사이 간격(초) = 노출 시간
const GL_START = 0.7, CR_A = 1.1, CR_B = 1.55, SH_T = 2.2, TOT = 3.6;
const DROPS = [1.3, 1.45], DROP_LEN = 0.03;
const REF = 29;              // 스펙트럼 색 눈금의 기준 크기(dB). 이 합성 결과의 가장 센 값에 맞춘 표시용 눈금
const SR = 16000, TAU = Math.PI * 2;
const SANS = "'IBM Plex Sans KR','Malgun Gothic',sans-serif", MONO = "'JetBrains Mono',monospace", DISP = "'Black Han Sans','Malgun Gothic',sans-serif";
const TX2 = PAL.muted, INK = PAL.ink;

// ---- 신호 처리 도구 ----
const mk = (s) => new Float32Array(Math.round(s * SR));
function coef(type, f, Q) {
  const w = TAU * f / SR, cs = Math.cos(w), al = Math.sin(w) / (2 * Q), a0 = 1 + al;
  const b = type === 'lp' ? [(1 - cs) / 2, 1 - cs, (1 - cs) / 2] : [(1 + cs) / 2, -(1 + cs), (1 + cs) / 2];
  return [b[0] / a0, b[1] / a0, b[2] / a0, -2 * cs / a0, (1 - al) / a0];
}
function run(c, d) { let x1 = 0, x2 = 0, y1 = 0, y2 = 0; for (let i = 0; i < d.length; i++) { const x = d[i], y = c[0] * x + c[1] * x1 + c[2] * x2 - c[3] * y1 - c[4] * y2; x2 = x1; x1 = x; y2 = y1; y1 = y; d[i] = y; } return d; }
function peakOf(d) { let p = 0; for (let i = 0; i < d.length; i++) { const a = Math.abs(d[i]); if (a > p) p = a; } return p; }
function scale(d, k) { for (let i = 0; i < d.length; i++) d[i] *= k; return d; }
function gp(d, i0, n, f) {
  const co = 2 * Math.cos(TAU * f / SR); let s1 = 0, s2 = 0;
  for (let i = 0; i < n; i++) { const j = i0 + i, x = (j >= 0 && j < d.length ? d[j] : 0) * (0.5 - 0.5 * Math.cos(TAU * i / (n - 1))), s = x + co * s1 - s2; s2 = s1; s1 = s; }
  return s1 * s1 + s2 * s2 - co * s1 * s2;
}
const FR = Array.from({ length: 32 }, (_, b) => 80 * Math.pow(7000 / 80, b / 31));
function spec(d, T, W) { const v = new Float32Array(T * 32); for (let t = 0; t < T; t++) { const c = Math.round((t + .5) * d.length / T); for (let b = 0; b < 32; b++) v[t * 32 + b] = 10 * Math.log10(gp(d, c - W / 2, W, FR[b]) + 1e-12); } return v; }
function peaks(d, w) { const mn = new Float32Array(w), mx = new Float32Array(w), n = d.length; for (let x = 0; x < w; x++) { let lo = 1, hi = -1; const a = Math.floor(x * n / w), b = Math.max(a + 1, Math.floor((x + 1) * n / w)); for (let i = a; i < b; i++) { if (d[i] < lo) lo = d[i]; if (d[i] > hi) hi = d[i]; } mn[x] = lo; mx[x] = hi; } return { mn, mx }; }
const ix = (s) => Math.round(s * SR);

// ---- 소리 합성 ----
function phrase() {   // 깨끗한 4음(E4 G4 B4 E5)
  const d = mk(TOT), notes = [[.1, 329.63], [.4, 392], [.7, 493.88], [1.15, 659.25]];
  notes.forEach(([t0, f]) => { for (let i = ix(t0); i < ix(t0 + .9) && i < d.length; i++) { const k = (i - ix(t0)) / SR; let v = 0; for (let h = 1; h <= 4; h++) v += Math.sin(TAU * f * h * k) / Math.pow(h, 1.3); d[i] += v * Math.min(1, k / .004) * Math.exp(-k / .22); } });
  return scale(d, .8 / peakOf(d));
}
function glitch(src) {   // 순서: 조각 반복 → 비트 깎기 → 무음 구멍
  const d = Float32Array.from(src), s0 = ix(GL_START), n = ix(GL_SLICE), piece = d.slice(s0, s0 + n);
  for (let r = 0; r < GL_REPEAT; r++) for (let i = 0; i < n; i++) d[s0 + r * n + i] = piece[i];
  let rep = 1; for (; rep < 40; rep++) { let same = true; for (let i = 0; i < n && same; i++) if (d[s0 + rep * n + i] !== piece[i]) same = false; if (!same) break; }
  const stut = Float32Array.from(d), lv = Math.pow(2, CRUSH_BITS - 1); let held = 0;
  for (let i = ix(CR_A); i < ix(CR_B); i++) { if ((i - ix(CR_A)) % CRUSH_HOLD === 0) held = Math.round(d[i] * lv) / lv; d[i] = held; }
  DROPS.forEach((t0) => { for (let i = ix(t0); i < ix(t0 + DROP_LEN); i++) d[i] = 0; });
  return { d, rep };
}
function zeroRuns(d, a, b, minN) { let runs = 0, len = 0; for (let i = a; i < b; i++) { if (d[i] === 0) len++; else { if (len >= minN) runs++; len = 0; } } return runs + (len >= minN ? 1 : 0); }
function distinct(d, a, b) { const s = new Set(); for (let i = a; i < b; i++) s.add(d[i]); return s.size; }
function thud(d, t0, amp) { let ph = 0; const o = ix(t0); for (let i = 0; i < ix(.15) && o + i < d.length; i++) { const k = i / SR; ph += TAU * (60 + 90 * Math.exp(-k / .03)) / SR; d[o + i] += Math.sin(ph) * Math.exp(-k / .03) * amp * Math.min(1, k / .002); } }
function click(d, t0, amp, r) {   // 막이 부딪히는 소리: 아주 짧은 고역 잡음 + 짧은 울림
  const tmp = mk(.08), o = ix(t0);
  for (let i = 0; i < tmp.length; i++) { const k = i / SR; tmp[i] = (r() * 2 - 1) * Math.exp(-k / .004) * Math.min(1, k / .0005); }
  run(coef('hp', 1800, .7), tmp);
  for (let i = 0; i < tmp.length && o + i < d.length; i++) { const k = i / SR; d[o + i] += (tmp[i] * 1.4 + .35 * Math.sin(TAU * 2600 * k) * Math.exp(-k / .006)) * amp; }
}
function onsets(d) {   // 2kHz 이상 소리가 갑자기 커지는 시각(ms). 50ms 안의 되풀이는 한 번으로 센다
  const h = Float32Array.from(d); run(coef('hp', 2000, .7), h); const w = ix(.001), e = []; let mx = 0;
  for (let i = 0; i + w < h.length; i += w) { let s = 0; for (let j = 0; j < w; j++) s += h[i + j] * h[i + j]; const r = Math.sqrt(s / w); e.push(r); if (r > mx && e.length > 2000) mx = r; }
  const out = []; let hold = 0; for (let i = 0; i < e.length; i++) { if (hold > 0) { hold--; continue; } if (e[i] > mx * .25 && i > 2000) { out.push(i); hold = 50; } } return out;
}
function synth() {
  const r = rng(21), clean = phrase(), g = glitch(clean);
  const c1 = mk(TOT), sh = mk(TOT); click(c1, SH_T, 1, r);
  thud(sh, SH_T, .8); click(sh, SH_T, 1, r); click(sh, SH_T + SH_GAP, .75, r); thud(sh, SH_T + SH_GAP + .035, .5);
  const gd = g.d, N = clean.length, m1 = mk(TOT), m2 = mk(TOT), m3 = mk(TOT);
  for (let i = 0; i < N; i++) { m1[i] = clean[i] + c1[i]; m2[i] = gd[i] + c1[i]; m3[i] = gd[i] + sh[i]; }
  const k = .9 / Math.max(peakOf(m1), peakOf(m2), peakOf(m3)), fade = ix(.025);
  const st = { rep: g.rep, holes0: zeroRuns(clean, ix(.15), ix(1.9), ix(.01)), holes1: zeroRuns(gd, ix(.15), ix(1.9), ix(.01)), v0: distinct(clean, ix(CR_A), ix(CR_B)), v1: distinct(gd, ix(CR_A), ix(CR_B)), on1: onsets(m1), on3: onsets(m3) };
  [clean, gd, c1, sh, m1, m2, m3].forEach((d) => { scale(d, k); for (let i = 0; i < fade; i++) d[N - 1 - i] *= i / fade; });
  return { clean, gd, c1, sh, mix: [m1, m2, m3], st };
}

// ---- 그리기 도구 ----
function tx(c, s, x, y, size, col, wt, al, font) { c.save(); c.fillStyle = col; c.font = (wt || 500) + ' ' + size + 'px ' + (font || SANS); c.textAlign = al || 'left'; c.textBaseline = 'alphabetic'; c.fillText(s, x, y); c.restore(); }
function bgFill(c, grain) {
  const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, PAL.bg0); g.addColorStop(1, PAL.bg1); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
  const r = c.createRadialGradient(470, 120, 10, 470, 120, 330); r.addColorStop(0, al(PAL.accent, .08)); r.addColorStop(1, al(PAL.accent, 0)); c.fillStyle = r; c.fillRect(0, 0, 640, 360);
  c.globalAlpha = .05; c.fillStyle = c.createPattern(grain, 'repeat'); c.fillRect(0, 0, 640, 360); c.globalAlpha = 1;
}
function panel(c, x, y, w, h) { rr(c, x, y, w, h, 6); c.fillStyle = PAL.surface; c.fill(); c.strokeStyle = PAL.line; c.lineWidth = 1; c.stroke(); }
function wave(c, pk, x, y, w, h, col, rev, gain) {
  panel(c, x, y, w, h); const mid = y + h / 2, k = h / 2 * gain;
  for (let i = 0; i < pk.mn.length; i++) { c.fillStyle = i / pk.mn.length <= rev ? col : col + '4d'; const a = mid - pk.mx[i] * k, b = mid - pk.mn[i] * k; c.fillRect(x + i, a, 1, Math.max(1, b - a)); }
  c.fillStyle = al(PAL.ink, .16); c.fillRect(x, mid - .3, w, .6);
}
function heat(v) {
  const S = [[0, 11, 15, 26], [.3, 62, 40, 124], [.6, 222, 92, 62], [.85, 255, 170, 70], [1, 255, 238, 196]];
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
    return { ctx: cv.getContext('2d'), grain: gc, b, sps: [], ref: REF, T, spec(L) { return this.sps[L - 1] || (this.sps[L - 1] = spec(this.b.mix[L - 1], T, W)); }, pk: { clean: P(b.clean), gd: P(b.gd), c1: P(b.c1), sh: P(b.sh), mix: b.mix.map(P) } };
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 3 : lv), c = s.ctx, X = 124, W = 500, ph = Math.min(1, t / TOT), q = s.b.st, px = (sec) => X + sec / TOT * W;
    c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1; bgFill(c, s.grain);
    const lanes = [['깨끗한 4음', C_CLEAN, s.pk.clean, 1], ['글리치 처리', C_GL, s.pk.gd, 2], [L >= 3 ? '셔터(2단)' : '클릭 1번', C_SH, L >= 3 ? s.pk.sh : s.pk.c1, 1]];
    lanes.forEach(([n, col, pk, need], i) => {
      const y = 46 + i * 30, on = L >= need;
      tx(c, n, 16, y + 17, 12, on ? col : TX2, 600);
      if (on) wave(c, pk, X, y, W, 26, col, ph, 1.3); else { panel(c, X, y, W, 26); tx(c, '아직 없음', X + 10, y + 17, 11, TX2, 500); }
    });
    if (L >= 2) {   // 글리치 줄 위에 어디가 어떻게 바뀌었는지 색 띠로 표시
      const y = 76; c.fillStyle = PAL.accent; c.fillRect(px(GL_START), y, GL_REPEAT * GL_SLICE / TOT * W, 3);
      c.fillStyle = C_CLEAN; c.fillRect(px(CR_A), y, (CR_B - CR_A) / TOT * W, 3);
      c.fillStyle = C_DROP; DROPS.forEach((t0) => c.fillRect(px(t0) - 1, y - 1, Math.max(3, DROP_LEN / TOT * W), 28));
    }
    wave(c, s.pk.mix[L - 1], X, 140, W, 34, INK, ph, 1);
    tx(c, '합친 소리', 16, 161, 12, INK, 700);
    specDraw(c, s.spec(L), s.T, X, 182, W, 92, s.ref, ph);
    [[100, '100'], [1000, '1k'], [5000, '5k']].forEach(([f, l]) => tx(c, l, X - 6, fy(f, 182, 92) + 4, 11, TX2, 500, 'right', MONO));
    tx(c, '스펙트럼', 16, 232, 12, PAL.accent, 700);
    if (L >= 3 && q.on3.length > 1) {   // 첫 소리 ~ 둘째 막 소리 사이(셔터가 열려 있는 시간)를 띠로 표시
      const x0 = px(q.on3[0] / 1000), x1 = px(q.on3[1] / 1000);
      c.fillStyle = al(C_SH, .32); c.fillRect(x0, 106, x1 - x0, 168); c.fillStyle = al(C_SH, .85); c.fillRect(x0 - .5, 106, 1, 168); c.fillRect(x1 - .5, 106, 1, 168);
      if (x1 - x0 > 56) tx(c, '노출 시간', (x0 + x1) / 2, 197, 11, '#ffc4e0', 600, 'center');
    }
    const xx = X + ph * W; c.fillStyle = al(PAL.accent, .95); c.fillRect(xx - .7, 42, 1.4, 232);
    // 아래 칸: 소리 신호에서 직접 세어 낸 값 4개. 칸 왼쪽 색 띠는 글리치 줄의 색 띠와 같은 색이다
    const on = L >= 3 ? q.on3 : q.on1, gl = L >= 2;
    const cards = [
      [PAL.accent, `${(GL_SLICE * 1000).toFixed(0)}ms 조각 반복`, gl ? `연속 ${q.rep}번` : '없음'],
      [C_CLEAN, '비트 깎기 · 값 가짓수', gl ? `${q.v0} → ${q.v1}` : '없음'],
      [C_DROP, '무음 구멍', gl ? `${q.holes0}개 → ${q.holes1}개` : '없음'],
      [C_SH, L >= 3 ? '셔터 두 소리 간격' : '클릭 소리', L >= 3 ? `${on.length > 1 ? on[1] - on[0] : 0}ms` : `1번 · ${on[0]}ms`],
    ];
    cards.forEach(([col, lab, val], i) => {
      const x = 16 + i * 154, y0 = 284, live = i === 3 || gl;
      panel(c, x, y0, 146, 52); c.fillStyle = live ? col : al(col, .35); c.fillRect(x, y0 + 6, 3, 40);
      tx(c, lab, x + 12, y0 + 19, 11, live ? TX2 : al(TX2, .7), 500);
      tx(c, val, x + 12, y0 + 42, 18, live ? INK : TX2, 600, 'left', MONO);
    });
    tx(c, '재생 버튼 없음 · 파형·스펙트럼은 코드로 합성한 값입니다.', 16, 353, 11, TX2, 500);
    let post;
    if (L === 1) post = '연출 전 · 깨끗한 4음 + 클릭 한 번';
    else if (t < GL_START) post = '글리치 전 · 깨끗한 음';
    else if (t < GL_START + GL_REPEAT * GL_SLICE) post = '글리치 ①: 같은 조각을 반복(스터터)';
    else if (t >= CR_A && t < CR_B) post = '글리치 ②: 비트 깎기 + 무음 구멍';
    else if (t < SH_T) post = '글리치 구간이 끝남 · 다음은 셔터';
    else if (L >= 3) post = t < SH_T + SH_GAP ? '셔터 ①: 거울 + 첫 막 소리' : '셔터 ②: 둘째 막 소리(간격 = 노출 시간)';
    else post = '클릭 한 번 · 기본';
    tx(c, String(L), 16, 34, 40, PAL.accent, 400, 'left', DISP); tx(c, post, 50, 26, 13, INK, 500);   // 이름표(numeral): 큰 단계 번호와 한 줄 설명
  },
};
export default demo;
