/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/sound-compressor/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng, rr } from "./helpers.js";

// 크기가 들쭉날쭉한 말소리 비슷한 소리에 컴프레서(큰 소리를 눌러 크기 차이를 줄이는 도구)를 한 가지씩 더해 가며, 파형·줄인 양(게인 리덕션)·입출력 곡선이 어떻게 바뀌는지 코드로 계산해 보여 준다. 재생은 없다.
const THRESH_DB = -18;       // 이 크기(dB)를 넘는 부분부터 누르기 시작한다
const RATIO = 12;             // 비율 4:1 = 임계값을 4dB 넘으면 출력은 1dB만 넘는다
const ATTACK_MS = 10;        // 어택: 누르기 시작하는 데 걸리는 시간(ms)
const RELEASE_MS = 150;      // 릴리스: 누르기를 푸는 데 걸리는 시간(ms)
const KNEE_DB = 6;           // 소프트 니: 임계값 앞뒤로 부드럽게 시작하는 폭(dB)
const FAST_ATT = 1, FAST_REL = 10;   // 2단계에서 일부러 너무 빠르게 둔 값(ms)
const TOT = 3.0, SR = 16000, TAU = Math.PI * 2;
const SYL = [[.2, .75, .12], [.85, 1.4, .8], [1.5, 2.05, .25], [2.15, 2.7, .6]];   // [시작, 끝, 상대 크기]
const SANS = "'IBM Plex Sans KR','Malgun Gothic',sans-serif", MONO = "'JetBrains Mono',monospace";
const TX2 = '#98a2b5';

// ---- 신호 처리 도구 ----
const mk = (s) => new Float32Array(Math.round(s * SR));
const ix = (s) => Math.round(s * SR);
const dbOf = (a) => 20 * Math.log10(Math.max(a, 1e-5));
function peakOf(d) { let p = 0; for (let i = 0; i < d.length; i++) { const a = Math.abs(d[i]); if (a > p) p = a; } return p; }
const g2 = (f, c, bw) => Math.exp(-Math.pow((f - c) / bw, 2));
function source() {
  const N = ix(TOT), d = mk(TOT); let ph = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR; let e = 0;
    for (const [a, b, A] of SYL) if (t >= a && t < b) e = A * Math.min(1, (t - a) / .015) * Math.exp(-(t - a) / .35) * Math.min(1, (b - t) / .04);
    const f0 = 150 + 10 * Math.sin(TAU * .8 * t); ph += TAU * f0 / SR;
    if (e > 0) { let s = 0; for (let h = 1; h <= 20; h++) s += Math.sin(ph * h) * Math.pow(h, -.8) * (.9 * g2(f0 * h, 500, 220) + .6 * g2(f0 * h, 1500, 400) + .06); d[i] = s * e; }
  }
  const k = .8 / peakOf(d); for (let i = 0; i < N; i++) d[i] *= k; return d;
}
function gainDb(over, ratio, knee) {   // 정적 곡선: 입력이 임계값보다 over(dB) 높을 때 더해지는 이득(dB, 0 이하)
  if (knee > 0 && 2 * over > -knee && 2 * over < knee) return -(1 - 1 / ratio) * Math.pow(over + knee / 2, 2) / (2 * knee);
  return over > 0 ? -(1 - 1 / ratio) * over : 0;
}
function comp(x, o) {   // 컴프레서: 순간 크기(dB) → 정적 곡선 → 어택·릴리스로 부드럽게 → 이득 적용
  const y = new Float32Array(x.length), gr = new Float32Array(x.length), ca = Math.exp(-1 / (o.att * SR / 1000)), cr = Math.exp(-1 / (o.rel * SR / 1000)), mu = Math.pow(10, (o.makeup || 0) / 20);
  let g = 0;
  for (let i = 0; i < x.length; i++) { const gt = gainDb(dbOf(Math.abs(x[i])) - o.th, o.ratio, o.knee); g = gt < g ? ca * g + (1 - ca) * gt : cr * g + (1 - cr) * gt; gr[i] = g; y[i] = x[i] * Math.pow(10, g / 20) * mu; }
  return { y, gr };
}
function segRms(d) { return SYL.map(([a]) => { let s = 0; const n = ix(.3); for (let i = 0; i < n; i++) s += d[ix(a) + i] * d[ix(a) + i]; return 10 * Math.log10(s / n + 1e-12); }); }
function peaks(d, w, abs) { const mn = new Float32Array(w), mx = new Float32Array(w), n = d.length; for (let x = 0; x < w; x++) { let lo = abs ? 0 : 1, hi = abs ? -99 : -1; const a = Math.floor(x * n / w), b = Math.max(a + 1, Math.floor((x + 1) * n / w)); for (let i = a; i < b; i++) { if (d[i] < lo) lo = d[i]; if (d[i] > hi) hi = d[i]; } mn[x] = lo; mx[x] = hi; } return { mn, mx }; }
function build() {
  const raw = source(), th = THRESH_DB, rawPk = peakOf(raw);
  const c2 = comp(raw, { th, ratio: RATIO, knee: 0, att: FAST_ATT, rel: FAST_REL });
  const c3 = comp(raw, { th, ratio: RATIO, knee: 0, att: ATTACK_MS, rel: RELEASE_MS });
  const c4a = comp(raw, { th, ratio: RATIO, knee: KNEE_DB, att: ATTACK_MS, rel: RELEASE_MS }), makeup = dbOf(rawPk / peakOf(c4a.y));
  const c4 = comp(raw, { th, ratio: RATIO, knee: KNEE_DB, att: ATTACK_MS, rel: RELEASE_MS, makeup });
  const lv = [{ y: raw, gr: new Float32Array(raw.length), knee: 0, mk: 0 }, { ...c2, knee: 0, mk: 0 }, { ...c3, knee: 0, mk: 0 }, { ...c4, knee: KNEE_DB, mk: makeup }];
  const rr0 = segRms(raw);
  const st = lv.map((l) => { const r = segRms(l.y); let mn = 0, sm = 0, n = 0; for (let i = 0; i < raw.length; i++) { if (l.gr[i] < mn) mn = l.gr[i]; if (Math.abs(raw[i]) > .02) { sm += l.gr[i]; n++; } } return { spread: Math.max(...r) - Math.min(...r), soft: Math.min(...r), loud: Math.max(...r), grMax: mn, grAvg: n ? sm / n : 0 }; });
  return { raw, lv, st, rr0, pkW: lv.map((l) => peaks(l.y, 330)), pkG: lv.map((l) => { const p = peaks(l.gr, 330); return p.mn; }) };
}

// ---- 그리기 도구 ----
function tx(c, s, x, y, size, col, wt, al, font) { c.save(); c.fillStyle = col; c.font = (wt || 500) + ' ' + size + 'px ' + (font || SANS); c.textAlign = al || 'left'; c.textBaseline = 'alphabetic'; c.fillText(s, x, y); c.restore(); }
function bgFill(c, grain) {
  const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, '#0b0f1a'); g.addColorStop(1, '#070a12'); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
  const r = c.createRadialGradient(470, 120, 10, 470, 120, 330); r.addColorStop(0, 'rgba(255,138,61,.07)'); r.addColorStop(1, 'rgba(255,138,61,0)'); c.fillStyle = r; c.fillRect(0, 0, 640, 360);
  c.globalAlpha = .05; c.fillStyle = c.createPattern(grain, 'repeat'); c.fillRect(0, 0, 640, 360); c.globalAlpha = 1;
}
function panel(c, x, y, w, h) { rr(c, x, y, w, h, 6); c.fillStyle = 'rgba(255,255,255,.035)'; c.fill(); c.strokeStyle = 'rgba(255,255,255,.09)'; c.lineWidth = 1; c.stroke(); }
function wave(c, pk, x, y, w, h, col, rev, gain) {
  panel(c, x, y, w, h); const mid = y + h / 2, k = h / 2 * gain;
  for (let i = 0; i < pk.mn.length; i++) { c.fillStyle = i / pk.mn.length <= rev ? col : col + '4d'; const a = mid - pk.mx[i] * k, b = mid - pk.mn[i] * k; c.fillRect(x + i, a, 1, Math.max(1, b - a)); }
  c.fillStyle = 'rgba(255,255,255,.14)'; c.fillRect(x, mid - .3, w, .6);
}

const demo = {
  dur: 3.4, rest: 3.0, noCompare: false, levels: 4,
  mount(sp) {
    const cv = el('canvas', null, sp); cv.width = 1280; cv.height = 720; cv.style.cssText = 'position:absolute;left:0;top:0;width:640px;height:360px';
    const gc = document.createElement('canvas'); gc.width = gc.height = 96; const g = gc.getContext('2d'), r = rng(3), im = g.createImageData(96, 96);
    for (let i = 0; i < 96 * 96; i++) { const v = Math.round(r() * 255); im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } g.putImageData(im, 0, 0);
    return Object.assign(build(), { ctx: cv.getContext('2d'), grain: gc });
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 4 : lv), c = s.ctx, ph = Math.min(1, t / TOT), X = 72, W = 330, l = s.lv[L - 1], st = s.st[L - 1], s0 = s.st[0];
    c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1; bgFill(c, s.grain);
    const thA = Math.pow(10, THRESH_DB / 20);
    tx(c, '원본', 16, 80, 12, '#9aa3b5', 600); wave(c, s.pkW[0], X, 46, W, 60, '#9aa3b5', ph, 1);
    c.save(); c.setLineDash([4, 3]); c.strokeStyle = 'rgba(111,211,255,.9)'; c.lineWidth = 1; [-1, 1].forEach((sg) => { c.beginPath(); c.moveTo(X, 76 - sg * thA * 30); c.lineTo(X + W, 76 - sg * thA * 30); c.stroke(); }); c.restore();
    tx(c, L > 1 ? '압축 후' : '압축 없음', 16, 146, 12, '#ffb27f', 700); wave(c, s.pkW[L - 1], X, 112, W, 60, '#ff9a55', ph, 1);
    c.save(); c.setLineDash([4, 3]); c.strokeStyle = 'rgba(111,211,255,.5)'; [-1, 1].forEach((sg) => { c.beginPath(); c.moveTo(X, 142 - sg * thA * 30); c.lineTo(X + W, 142 - sg * thA * 30); c.stroke(); }); c.restore();
    tx(c, '줄인 양', 16, 211, 12, '#6fd3ff', 600); panel(c, X, 178, W, 54);
    const gp = s.pkG[L - 1]; for (let i = 0; i < gp.length; i++) { const v = Math.max(-20, gp[i]), h = -v / 20 * 50; c.fillStyle = i / gp.length <= ph ? 'rgba(111,211,255,.85)' : 'rgba(111,211,255,.28)'; c.fillRect(X + i, 180, 1, Math.max(0, h)); }
    tx(c, '0dB', X + 4, 191, 9.5, TX2, 500, 'left', MONO); tx(c, '-20dB', X + 4, 229, 9.5, TX2, 500, 'left', MONO);
    c.fillStyle = 'rgba(255,138,61,.95)'; c.fillRect(X + ph * W - .7, 44, 1.4, 190);
    // 오른쪽: 입력 → 출력 곡선(지금 위치의 점)
    const PX = 438, PY = 70, PW = 170, PH = 146, mx = (v) => PX + (v + 60) / 60 * PW, my = (v) => PY + PH - (v + 60) / 60 * PH;
    panel(c, 416, 46, 208, 188); tx(c, '입력 → 출력 곡선', 424, 60, 11, TX2, 600);
    c.strokeStyle = 'rgba(255,255,255,.08)'; c.lineWidth = 1; [-60, -40, -20, 0].forEach((v) => { c.beginPath(); c.moveTo(mx(v), PY); c.lineTo(mx(v), PY + PH); c.moveTo(PX, my(v)); c.lineTo(PX + PW, my(v)); c.stroke(); });
    [-60, -30, 0].forEach((v) => { tx(c, String(v), mx(v), PY + PH + 11, 9, TX2, 500, 'center', MONO); tx(c, String(v), PX - 3, my(v) + 3, 9, TX2, 500, 'right', MONO); });
    c.save(); c.setLineDash([3, 3]); c.strokeStyle = 'rgba(255,255,255,.28)'; c.beginPath(); c.moveTo(mx(-60), my(-60)); c.lineTo(mx(0), my(0)); c.stroke(); c.restore();
    const kn = L >= 4 ? KNEE_DB : 0, mu = l.mk, curve = (v) => (L > 1 ? v + gainDb(v - THRESH_DB, RATIO, kn) + mu : v);
    c.beginPath(); for (let v = -60; v <= 0.01; v += 1) { const X1 = mx(v), Y1 = my(Math.max(-60, Math.min(0, curve(v)))); v === -60 ? c.moveTo(X1, Y1) : c.lineTo(X1, Y1); }
    c.save(); c.shadowColor = 'rgba(255,138,61,.55)'; c.shadowBlur = 6; c.strokeStyle = '#ffa05a'; c.lineWidth = 2; c.stroke(); c.restore();
    if (L > 1) { c.save(); c.setLineDash([4, 3]); c.strokeStyle = 'rgba(111,211,255,.8)'; c.beginPath(); c.moveTo(mx(THRESH_DB), PY); c.lineTo(mx(THRESH_DB), PY + PH); c.stroke(); c.restore(); tx(c, '임계값', mx(THRESH_DB) - 3, PY + 10, 9.5, '#8fdcff', 600, 'right'); }
    const ci = ix(Math.min(t, TOT - .01)); let pk = 0; for (let i = Math.max(0, ci - 80); i < Math.min(s.raw.length, ci + 80); i++) pk = Math.max(pk, Math.abs(s.raw[i]));
    const inDb = Math.max(-60, dbOf(pk)), outDb = Math.max(-60, Math.min(0, curve(inDb)));
    c.beginPath(); c.arc(mx(inDb), my(outDb), 4.5, 0, TAU); c.fillStyle = '#fff'; c.fill(); c.lineWidth = 2; c.strokeStyle = '#ff8a3d'; c.stroke();
    tx(c, '입력(dB)', PX + PW, PY + PH + 22, 9.5, TX2, 500, 'right'); tx(c, '출력', PX + 2, PY - 4, 9.5, TX2, 500);
    // 숫자(신호에서 계산)
    let y = 256;
    tx(c, `음절 크기 차이(가장 큰 − 가장 작은, RMS)  원본 ${s0.spread.toFixed(1)}dB → 지금 ${st.spread.toFixed(1)}dB`, 16, y, 10.5, '#ffd85c', 500, 'left', MONO); y += 15;
    tx(c, `가장 작은 음절 RMS  원본 ${s0.soft.toFixed(1)}dB → 지금 ${st.soft.toFixed(1)}dB${L >= 4 ? '  (메이크업 +' + l.mk.toFixed(1) + 'dB)' : ''}`, 16, y, 10.5, '#ffb27f', 500, 'left', MONO); y += 15;
    tx(c, `줄인 양  최대 ${st.grMax.toFixed(1)}dB · 소리 나는 구간 평균 ${st.grAvg.toFixed(1)}dB`, 16, y, 10.5, '#8fdcff', 500, 'left', MONO);
    c.save(); c.setLineDash([4, 3]); c.strokeStyle = 'rgba(111,211,255,.9)'; c.beginPath(); c.moveTo(16, 330); c.lineTo(36, 330); c.stroke(); c.restore(); tx(c, `점선 = 임계값 ${THRESH_DB}dB`, 42, 333, 10.5, TX2, 500);
    tx(c, '재생 버튼 없음 · 파형·곡선·수치는 코드로 계산한 값입니다.', 16, 350, 10.5, TX2, 500);
    const post = ['압축 없음 · 원본(음절 크기 차이가 큼)', `① 임계값 ${THRESH_DB}dB · 비율 ${RATIO}:1 · 반응이 너무 빨라(${FAST_ATT}ms/${FAST_REL}ms) 줄인 양이 파형을 따라 떨림`, `② 어택 ${ATTACK_MS}ms · 릴리스 ${RELEASE_MS}ms · 줄인 양이 부드럽게 움직임`, `③ 소프트 니 ${KNEE_DB}dB + 메이크업 게인으로 전체 크기를 다시 올림`][L - 1];
    c.font = '500 12px ' + SANS; const pwd = c.measureText(post).width + 24; rr(c, 14, 12, pwd, 24, 12); c.fillStyle = 'rgba(8,10,20,.78)'; c.fill(); c.strokeStyle = 'rgba(255,255,255,.12)'; c.stroke(); tx(c, post, 26, 28, 12, '#fff', 500);
  },
};
export default demo;
