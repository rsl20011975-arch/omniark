/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/sound-ui-feedback/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng, rr } from "./helpers.js";

const PAL = { bg0: '#171615', bg1: '#232120', ink: '#f2efe9', muted: '#9a958c', accent: '#5ad1c8', accent2: '#f2b84b', surface: '#1f1d1b', line: 'rgba(242,239,233,.14)' };
const al = (h, a) => `rgba(${[1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(',')},${a})`;   // PAL 색에 투명도를 준다
const C_N = PAL.accent2, C_S = PAL.accent, C_F = '#ff7a8a';   // 알림, 성공, 실패 줄 색

// 알림·성공·실패 세 가지 안내음이 처음에는 똑같은 삑 소리인 상태에서, 음의 방향(올라감/내려감)과 모티프·부드러움을 단계별로 더한 소리의 '모양'을 코드로 합성해 파형·스펙트럼·음높이 수치로 보여 준다. 재생은 없다.
const NOTE_DUR = 0.4;        // 음 하나의 소리가 줄어드는 시간상수(초). 클수록 길게 울린다
const RISE_SEMI = 7;         // 성공음에서 둘째 음이 첫째 음보다 올라가는 폭(반음 수). 7 = 완전5도
const FAIL_LP = 1400;        // 실패음의 높은 소리를 깎는 저역통과 주파수(Hz). 클수록 날카롭다
const N_T = 0.2, S_T = 1.35, F_T = 2.5, TOT = 3.6;
const REF = 31;              // 스펙트럼 색 눈금의 기준 크기(dB). 이 합성 결과의 가장 센 값에 맞춘 표시용 눈금
const SR = 16000, TAU = Math.PI * 2;
const SANS = "'IBM Plex Sans KR','Malgun Gothic',sans-serif", MONO = "'JetBrains Mono',monospace";
const TX2 = PAL.muted, INK = PAL.ink;

// ---- 신호 처리 도구 ----
const mk = (s) => new Float32Array(Math.round(s * SR));
const ix = (s) => Math.round(s * SR);
function lpCoef(f, Q) { const w = TAU * f / SR, cs = Math.cos(w), al = Math.sin(w) / (2 * Q), a0 = 1 + al; return [(1 - cs) / 2 / a0, (1 - cs) / a0, (1 - cs) / 2 / a0, -2 * cs / a0, (1 - al) / a0]; }
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
function pitch(d, i0, n) {   // 그 구간에서 가장 센 주파수(Hz): 15Hz 간격으로 훑고 3Hz, 1Hz 간격으로 차례로 다듬는다
  let bf = 0, bp = -1;
  for (let f = 150; f <= 1500; f += 15) { const p = gp(d, i0, n, f); if (p > bp) { bp = p; bf = f; } }
  for (let f = bf - 15; f <= bf + 15; f += 3) { const p = gp(d, i0, n, f); if (p > bp) { bp = p; bf = f; } }
  for (let f = bf - 2; f <= bf + 2; f++) { const p = gp(d, i0, n, f); if (p > bp) { bp = p; bf = f; } }
  return bf;
}
function tailMs(d, t0) {   // 소리 시작에서 최대 크기의 -40dB(1%) 아래로 마지막으로 내려가는 시각까지(ms)
  const w = ix(.005); let pk = 0; const e = [];
  for (let i = ix(t0); i + w < d.length; i += w) { let s = 0; for (let j = 0; j < w; j++) s += d[i + j] * d[i + j]; const r = Math.sqrt(s / w); e.push([i, r]); if (r > pk) pk = r; }
  let end = ix(t0); for (const [i, r] of e) if (r > pk * .01) end = i; return (end - ix(t0)) / SR * 1000;
}

// ---- 소리 합성: 단계(L)마다 세 안내음의 모양이 달라진다 ----
function note(d, t0, f, harsh) {
  for (let i = ix(t0); i < ix(t0) + ix(NOTE_DUR * 5) && i < d.length; i++) {
    const k = (i - ix(t0)) / SR; let v = 0;
    if (harsh) for (let h = 1; h <= 15; h++) v += Math.sin(TAU * f * h * k) / Math.pow(h, .8); else v = Math.sin(TAU * f * k) + .3 * Math.sin(TAU * 2 * f * k) + .1 * Math.sin(TAU * 3 * f * k);
    d[i] += v * Math.min(1, k / .004) * Math.exp(-k / NOTE_DUR);
  }
}
const semi = (f, n) => f * Math.pow(2, n / 12);
function recipe(kind, L) {   // [음 목록 [시작 오프셋, 주파수]], 거친 소리 여부, 고역 깎기
  if (L === 1 || (kind === 'n' && L === 2)) return { notes: [[0, 660]], harsh: false, lp: 0 };
  if (kind === 'n') return { notes: [[0, 659.25], [.1, 783.99], [.2, 659.25]], harsh: false, lp: 0 };
  if (kind === 's') return { notes: [[0, 523.25], [.12, semi(523.25, RISE_SEMI)]], harsh: false, lp: 0 };
  return { notes: [[0, 392], [.14, semi(392, -5)]], harsh: true, lp: L >= 3 ? FAIL_LP : 7000 };
}
function build(L) {
  const T0 = { n: N_T, s: S_T, f: F_T }, out = {}, mix = mk(TOT), st = {};
  [['n', 'n'], ['s', 's'], ['f', 'f']].forEach(([key, kind]) => {
    const rc = recipe(kind, L), d = mk(TOT);
    rc.notes.forEach(([o, f]) => note(d, T0[key] + o, f, rc.harsh));
    if (rc.lp) { run(lpCoef(rc.lp, .7), d); run(lpCoef(rc.lp, .7), d); }   // 두 번 겹쳐 더 가파르게 깎는다
    scale(d, .6 / peakOf(d)); out[key] = d;
    const a = rc.notes[0], b = rc.notes[rc.notes.length - 1], t0 = T0[key];
    const p0 = pitch(d, ix(t0 + a[0] + .012), ix(.06)), p1 = pitch(d, ix(t0 + b[0] + .012), ix(.06));
    st[key] = { n: rc.notes.length, p0, p1, tail: tailMs(d, t0), dir: p1 > p0 * 1.04 ? '올라감' : p1 < p0 * .96 ? '내려감' : '그대로' };
  });
  for (let i = 0; i < mix.length; i++) mix[i] = out.n[i] + out.s[i] + out.f[i];
  const k = Math.min(1, .9 / peakOf(mix)), fade = ix(.025);
  [out.n, out.s, out.f, mix].forEach((d) => { scale(d, k); for (let i = 0; i < fade; i++) d[d.length - 1 - i] *= i / fade; });
  return { ...out, mix, st };
}

// ---- 그리기 도구 ----
function tx(c, s, x, y, size, col, wt, al, font) { c.save(); c.fillStyle = col; c.font = (wt || 500) + ' ' + size + 'px ' + (font || SANS); c.textAlign = al || 'left'; c.textBaseline = 'alphabetic'; c.fillText(s, x, y); c.restore(); }
function bgFill(c, grain) {
  const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, PAL.bg0); g.addColorStop(1, PAL.bg1); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
  const r = c.createRadialGradient(470, 120, 10, 470, 120, 330); r.addColorStop(0, al(PAL.accent2, .07)); r.addColorStop(1, al(PAL.accent2, 0)); c.fillStyle = r; c.fillRect(0, 0, 640, 360);
  c.globalAlpha = .05; c.fillStyle = c.createPattern(grain, 'repeat'); c.fillRect(0, 0, 640, 360); c.globalAlpha = 1;
}
function panel(c, x, y, w, h) { rr(c, x, y, w, h, 6); c.fillStyle = PAL.surface; c.fill(); c.strokeStyle = PAL.line; c.lineWidth = 1; c.stroke(); }
function wave(c, pk, x, y, w, h, col, rev, gain) {
  panel(c, x, y, w, h); const mid = y + h / 2, k = h / 2 * gain;
  for (let i = 0; i < pk.mn.length; i++) { c.fillStyle = i / pk.mn.length <= rev ? col : col + '4d'; const a = mid - pk.mx[i] * k, b = mid - pk.mn[i] * k; c.fillRect(x + i, a, 1, Math.max(1, b - a)); }
  c.fillStyle = al(PAL.ink, .16); c.fillRect(x, mid - .3, w, .6);
}
function heat(v) {
  const S = [[0, 23, 22, 21], [.3, 30, 88, 96], [.6, 90, 209, 200], [.85, 242, 184, 75], [1, 255, 244, 214]];
  for (let i = 1; i < S.length; i++) if (v <= S[i][0]) { const p = (v - S[i - 1][0]) / (S[i][0] - S[i - 1][0]); return `rgb(${Math.round(lerp(S[i - 1][1], S[i][1], p))},${Math.round(lerp(S[i - 1][2], S[i][2], p))},${Math.round(lerp(S[i - 1][3], S[i][3], p))})`; }
  return 'rgb(255,238,196)';
}
function specDraw(c, v, T, x, y, w, h, ref, rev) {
  panel(c, x, y, w, h); const cw = w / T, ch = h / 32;
  for (let t = 0; t < T; t++) { c.globalAlpha = t / T <= rev ? 1 : .35; for (let b = 0; b < 32; b++) { const u = Math.pow(Math.max(0, Math.min(1, (v[t * 32 + b] - ref + 50) / 50)), .7); if (u < .03) continue; c.fillStyle = heat(u); c.fillRect(x + t * cw, y + h - (b + 1) * ch, cw + .5, ch + .5); } }
  c.globalAlpha = 1;
}
const fy = (f, y, h) => y + h - Math.log(f / 80) / Math.log(7000 / 80) * h;

const demo = {
  dur: 3.8, rest: 3.4, noCompare: false, levels: 3,
  mount(sp) {
    const cv = el('canvas', null, sp); cv.width = 1280; cv.height = 720; cv.style.cssText = 'position:absolute;left:0;top:0;width:640px;height:360px';
    const gc = document.createElement('canvas'); gc.width = gc.height = 96; const g = gc.getContext('2d'), r = rng(3), im = g.createImageData(96, 96);
    for (let i = 0; i < 96 * 96; i++) { const v = Math.round(r() * 255); im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } g.putImageData(im, 0, 0);
    const T = 96, W = 384, P = (d) => peaks(d, 500), lv = [];
    return { ctx: cv.getContext('2d'), grain: gc, ref: REF, T, lv, get(L) { return lv[L - 1] || (lv[L - 1] = (() => { const b = build(L); return { b, sp: spec(b.mix, T, W), pk: { n: P(b.n), s: P(b.s), f: P(b.f), mix: P(b.mix) } }; })()); } };
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 3 : lv), c = s.ctx, X = 124, W = 500, ph = Math.min(1, t / TOT), D = s.get(L), b = D.b, pk = D.pk;
    c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1; bgFill(c, s.grain);
    const rows = [['알림', C_N, 'n'], ['성공', C_S, 's'], ['실패', C_F, 'f']];
    rows.forEach(([n, col, key], i) => { const y = 46 + i * 30; tx(c, n, 16, y + 17, 12, col, 600); wave(c, pk[key], X, y, W, 26, col, ph, 1.2); });
    wave(c, pk.mix, X, 140, W, 34, INK, ph, 1);
    tx(c, '합친 소리', 16, 161, 12, INK, 700);
    specDraw(c, D.sp, s.T, X, 182, W, 92, s.ref, ph);
    [[100, '100'], [1000, '1k'], [5000, '5k']].forEach(([f, l]) => tx(c, l, X - 6, fy(f, 182, 92) + 4, 10, TX2, 500, 'right', MONO));
    tx(c, '스펙트럼', 16, 232, 12, PAL.accent2, 700);
    if (L >= 3) {   // 실패음의 높은 소리를 깎는 선(저역통과 주파수)
      const yy = fy(FAIL_LP, 182, 92), x0 = X + F_T / TOT * W; c.fillStyle = 'rgba(255,90,110,.27)'; c.fillRect(x0, 182, X + W - x0, yy - 182); c.save(); c.setLineDash([4, 3]); c.strokeStyle = 'rgba(255,159,176,.9)'; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, yy); c.lineTo(X + W, yy); c.stroke(); c.restore();
      tx(c, `깎는 선 ${FAIL_LP}Hz · 위쪽은 깎여 나감`, X + W - 4, 195, 10, '#ffd0d8', 600, 'right', MONO);
    }
    const xx = X + ph * W; c.fillStyle = al(PAL.ink, .92); c.fillRect(xx - .7, 42, 1.4, 232);
    let y = 292;
    rows.forEach(([n, col, key]) => {
      const q = b.st[key];
      tx(c, `${n}  음 ${q.n}개 · ${q.p0.toFixed(0)}Hz → ${q.p1.toFixed(0)}Hz (${q.dir}) · 소리가 -40dB까지 ${q.tail.toFixed(0)}ms`, 16, y, 10.5, col, 500, 'left', MONO); y += 15;
    });
    tx(c, '재생 버튼 없음. 파형과 스펙트럼은 코드로 합성한 값이며, 소리는 직접 들어 보고 판단하세요.', 624, 26, 10.5, TX2, 500, 'right');
    let post;
    if (L === 1) post = '연출 전 · 알림·성공·실패가 모두 같은 삑 소리';
    else if (t < N_T) post = '곧 알림';
    else if (t < S_T) post = L >= 3 ? '알림: 짧은 세 음 모티프' : '알림: 아직 삑 한 번';
    else if (t < F_T) post = '성공: 음이 위로 올라감';
    else post = L >= 3 ? '실패: 음이 아래로 · 고역을 깎아 부드럽게' : '실패: 음이 아래로 · 날카로움 그대로';
    c.fillStyle = PAL.line; c.fillRect(16, 334, 608, 1); tx(c, post, 16, 350, 12, TX2, 500, 'left', MONO);   // 이름표(caption-bl): 왼쪽 아래, 배경 없이 얇은 선 위에
  },
};
export default demo;
