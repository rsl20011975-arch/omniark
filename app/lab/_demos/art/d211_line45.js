/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/swipe-away-rate/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 쇼츠 43편(조회 100 이상, 2026-09-29~11-02)에서 ‘안 넘긴 비율’(engagedViews ÷ views)과 조회의 관계를 코드가 직접 계산해 그린다.
// 점 하나가 한 편이다. 조회는 절대값이 아니라 그 43편 중앙값으로 나눈 배수만 쓴다. 화면은 시간 t 의 함수다.
const BANDS = 3;           // 비율 순으로 나누는 등분 수(3단계)
const LINE = 0.45;         // 세로 기준선: 안 넘긴 비율 35% (아는 물건 시험의 합격선 [지시])
const Y_LOG = 1;           // 1 이면 조회 배수를 로그 눈금으로, 0 이면 선형 눈금으로
const PAL = { bg0: '#e6f2ec', bg1: '#d4e8de', ink: '#0f2a22', muted: '#4f6e63', accent: '#0f9d6b', accent2: '#c2410c', surface: '#f6fbf8', line: 'rgba(15,42,34,.18)' };
const ACC_INK = '#0a7550', ORG_INK = '#a8360a';
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif', BLACK = '"Black Han Sans", sans-serif';

// [안 넘긴 비율, 조회 배수(43편 중앙값=1), 평균 시청 비율(%)] 한 편씩 [측정 2026-11-02 분석 보고서]
const N43 = [[0.326, 1.446, 94.0], [0.359, 1.373, 122.9], [0.403, 1.355, 75.6], [0.537, 1.330, 79.1], [0.357, 1.229, 70.7], [0.272, 1.209, 79.8], [0.433, 1.206, 100.4], [0.267, 1.200, 57.5], [0.385, 1.179, 72.2], [0.306, 1.167, 148.1], [0.525, 1.167, 66.7], [0.275, 1.167, 75.3], [0.326, 1.162, 88.5], [0.408, 1.161, 97.2], [0.314, 1.154, 54.4], [0.258, 1.127, 98.7], [0.208, 1.114, 75.5], [0.307, 1.098, 143.0], [0.245, 1.097, 95.5], [0.264, 1.086, 117.3], [0.112, 1.037, 141.8], [0.387, 1.000, 86.6], [0.279, 0.977, 97.1], [0.186, 0.964, 58.3], [0.180, 0.946, 56.2], [0.326, 0.929, 64.0], [0.210, 0.849, 169.4], [0.372, 0.799, 57.6], [0.257, 0.748, 64.7], [0.183, 0.668, 161.7], [0.301, 0.611, 79.9], [0.237, 0.586, 54.7], [0.290, 0.395, 193.0], [0.141, 0.367, 116.4], [0.188, 0.350, 61.1], [0.099, 0.281, 35.6], [0.172, 0.274, 76.5], [0.143, 0.272, 91.6], [0.147, 0.232, 46.0], [0.390, 0.206, 47.4], [0.125, 0.178, 119.3], [0.140, 0.172, 121.1], [0.058, 0.128, 51.7]];
// 아는 물건 쇼츠 10편: [안 넘긴 비율, 조회 배수(10편 중앙값=1), 번호] [측정 2026-11-09, 09와 10은 하루치만]
const K10 = [[0.445, 3.533, '01'], [0.353, 1.157, '02'], [0.274, 0.564, '03'], [0.506, 0.098, '04'], [0.335, 1.231, '05'], [0.407, 1.012, '06'], [0.400, 0.017, '07'], [0.352, 1.517, '08'], [0.371, 0.079, '09'], [0.443, 0.988, '10']];

const median = (a) => { const s = [...a].sort((p, q) => p - q), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
function pearson(xs, ys) { const n = xs.length, mx = xs.reduce((p, q) => p + q, 0) / n, my = ys.reduce((p, q) => p + q, 0) / n; let sxy = 0, sxx = 0, syy = 0; for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; } return sxy / Math.sqrt(sxx * syy); }
const ln = (v) => Math.log(v);

let GRAIN = null;
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function TH(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.textAlign = al || 'left'; x.lineJoin = 'round'; x.lineWidth = 3.5; x.strokeStyle = 'rgba(246,251,248,.95)'; x.strokeText(s, X, Y); x.fillStyle = col; x.fillText(s, X, Y); }   // 무늬 위에서도 읽히게 둘레를 칠한 글자
function card(x, X, Y, W, H) { x.save(); x.shadowColor = 'rgba(15,42,34,.13)'; x.shadowBlur = 8; x.shadowOffsetY = 2; x.fillStyle = PAL.surface; x.beginPath(); x.roundRect(X, Y, W, H, 6); x.fill(); x.restore(); x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.roundRect(X, Y, W, H, 6); x.stroke(); }

// 계산(한 번만): 상관, 추세선, 3등분 묶음
const RATE = N43.map((r) => r[0]), REL = N43.map((r) => r[1]), VPCT = N43.map((r) => r[2]), LREL = REL.map(ln);
const R_VIEW = pearson(VPCT, LREL), R_RATE = pearson(RATE, LREL);
const MED_RATE = median(RATE), MED_VPCT = median(VPCT);
const order = N43.map((_, i) => i).sort((p, q) => RATE[p] - RATE[q]);
function groups(n) { const g = []; for (let b = 0; b < n; b++) { const ids = order.slice(Math.round(b * 43 / n), Math.round((b + 1) * 43 / n)); g.push({ ids, lo: RATE[ids[0]], hi: RATE[ids[ids.length - 1]], med: median(ids.map((i) => REL[i])) }); } return g; }
function ols(xs, ys) { const n = xs.length, mx = xs.reduce((p, q) => p + q, 0) / n, my = ys.reduce((p, q) => p + q, 0) / n; let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; } const b = sxy / sxx; return [my - b * mx, b]; }

const PX0 = 272, PX1 = 612, PY0 = 64, PY1 = 270;
const yOf = (rel) => PY1 - (Y_LOG ? (ln(rel) - ln(0.1)) / (ln(2) - ln(0.1)) : rel / 1.6) * (PY1 - PY0);
const xView = (v) => PX0 + v / 200 * (PX1 - PX0), xRate = (r) => PX0 + r / 0.6 * (PX1 - PX0);

const STEP = ['01 시청 비율만 본다', '02 안 넘긴 비율로 바꾼다', '03 3등분과 10편 대 보기'];
const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(52), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const lab = el('div', null, sp);   // 이름표(caption-bl): 왼쪽 아래, 배경 없음, 위에 1px 선
    Object.assign(lab.style, { position: 'absolute', left: '18px', bottom: '10px', width: '208px', paddingTop: '10px', borderTop: `1px solid ${PAL.line}`, color: PAL.muted, font: "500 12px/1.2 'JetBrains Mono',monospace", whiteSpace: 'nowrap', zIndex: '4' });
    return { main, lab };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 1 : (lv == null ? 3 : lv);
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'multiply'; x.globalAlpha = 0.07;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();

    const m = L >= 2 ? E.inOutC(seg(t, 2.0, 3.2)) : 0;           // 가로축을 시청 비율에서 안 넘긴 비율로 옮기는 정도
    const bandIn = L >= 3 ? E.outC(seg(t, 3.8, 4.6)) : 0;
    const knIn = L >= 3 ? seg(t, 4.4, 5.4) : 0;

    // 왼쪽 열: 조회 100번 격자(1·2단계), 3단계에서는 아는 물건 10편 산점도로 바뀐다
    const stay = Math.round(MED_RATE * 100);
    const gridA = 1 - Math.min(1, knIn * 2.2);
    x.save(); x.globalAlpha = gridA;
    T(x, '첫 화면에서 넘기는 비율', 20, 30, 14, PAL.ink, 700);
    T(x, '쇼츠 43편, 조회 100 이상 [측정]', 20, 47, 10.5, PAL.muted, 500);
    for (let i = 0; i < 100; i++) {
      const cx = 22 + (i % 10) * 17.4, cy = 62 + Math.floor(i / 10) * 17.4, on = E.outC(seg(t, 0.15 + i * 0.008, 0.15 + i * 0.008 + 0.35));
      x.fillStyle = i < stay ? PAL.accent : 'rgba(79,110,99,.28)'; x.beginPath(); x.arc(cx + 7.5, cy + 7.5, 6.2 * on, 0, 7); x.fill();
    }
    T(x, `${stay}%`, 20, 274, 30, ACC_INK, 700, 'left', MONO);
    T(x, '계속 봄', 20, 290, 11, PAL.muted, 500);
    T(x, `${100 - stay}%`, 122, 274, 30, PAL.muted, 700, 'left', MONO);
    T(x, '첫 화면에서 넘김', 122, 290, 11, PAL.muted, 500);
    T(x, `조회 100번 중 ${stay}번만 계속 본다(중앙 편)`, 20, 314, 11, PAL.ink, 600);
    x.restore();

    if (knIn > 0) {
      x.save(); x.globalAlpha = Math.min(1, knIn * 2);
      T(x, '아는 물건 10편 [측정]', 20, 30, 14, PAL.ink, 700);
      T(x, '비율이 높은데 조회가 낮은 편이 있다', 20, 47, 10.5, PAL.muted, 500);
      const kx0 = 58, kx1 = 232, ky0 = 84, ky1 = 262, xk = (r) => kx0 + (r - 0.2) / 0.4 * (kx1 - kx0), yk = (v) => ky1 - (ln(v) - ln(0.01)) / (ln(5) - ln(0.01)) * (ky1 - ky0);
      x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.moveTo(kx0, ky1 + .5); x.lineTo(kx1, ky1 + .5); x.moveTo(kx0 + .5, ky0); x.lineTo(kx0 + .5, ky1); x.stroke();
      [0.2, 0.4, 0.6].forEach((r) => T(x, `${Math.round(r * 100)}%`, xk(r), ky1 + 14, 10, PAL.muted, 500, 'center', MONO));
      [0.1, 1].forEach((v) => { T(x, `×${v}`, kx0 - 5, yk(v) + 4, 10, PAL.muted, 500, 'right', MONO); x.beginPath(); x.moveTo(kx0, yk(v) + .5); x.lineTo(kx1, yk(v) + .5); x.stroke(); });
      K10.forEach(([r, v, id], i) => {
        const on = E.outC(seg(knIn, i / 14, i / 14 + 0.35)), hi = id === '04' || id === '07';
        x.globalAlpha = on * Math.min(1, knIn * 2); x.fillStyle = hi ? PAL.accent2 : PAL.accent; x.beginPath(); x.arc(xk(r), yk(v), 4.4, 0, 7); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 1; x.stroke();
        if (hi) T(x, `${id}: ${(r * 100).toFixed(1)}%인데 ${v.toFixed(2)}배`, xk(r) - 8, yk(v) - 7, 10, ORG_INK, 700, 'right');
      });
      x.globalAlpha = Math.min(1, knIn * 2);
      const rk = pearson(K10.map((k) => k[0]), K10.map((k) => ln(k[1])));
      T(x, `r = ${rk.toFixed(2)}`, 20, 306, 15, PAL.ink, 700, 'left', MONO);
      T(x, '10편 안에서는 비율이 높아도 조회는 따로', 20, 322, 10.5, PAL.muted, 500);
      x.restore();
    }

    // 오른쪽: 산점도(이 화면의 주인공)
    card(x, 244, 10, 384, 322);
    const showRate = m > 0.5, rr = showRate ? R_RATE : R_VIEW;
    T(x, showRate ? '안 넘긴 비율과 조회' : '평균 시청 비율과 조회', 258, 34, 14, PAL.ink, 700);
    T(x, `r = ${rr.toFixed(2)}`, 618, 36, 22, showRate ? ACC_INK : PAL.muted, 700, 'right', MONO);
    T(x, '(조회의 로그와 잰 상관)', 618, 51, 10, PAL.muted, 500, 'right');
    x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.moveTo(PX0, PY1 + .5); x.lineTo(PX1, PY1 + .5); x.moveTo(PX0 + .5, PY0 - 4); x.lineTo(PX0 + .5, PY1); x.stroke();
    (Y_LOG ? [0.1, 0.25, 0.5, 1, 2] : [0, 0.5, 1, 1.5]).forEach((v) => { const yy = v === 0 ? PY1 : yOf(v); T(x, `×${v}`, PX0 - 5, yy + 4, 10, PAL.muted, 500, 'right', MONO); if (v) { x.beginPath(); x.moveTo(PX0, Math.round(yy) + .5); x.lineTo(PX1, Math.round(yy) + .5); x.stroke(); } });
    x.save(); x.globalAlpha = 1 - m; [0, 50, 100, 150, 200].forEach((v) => T(x, `${v}%`, xView(v), PY1 + 14, 10, PAL.muted, 500, 'center', MONO)); T(x, '가로: 평균 시청 비율(영상 길이 대비, 반복이 있으면 100% 넘음)', PX0, PY1 + 29, 10, PAL.muted, 500); x.restore();
    x.save(); x.globalAlpha = m; [0, 0.2, 0.4, 0.6].forEach((v) => T(x, `${Math.round(v * 100)}%`, xRate(v), PY1 + 14, 10, PAL.muted, 500, 'center', MONO)); T(x, '가로: 안 넘긴 비율 = engagedViews ÷ views', PX0, PY1 + 29, 10, PAL.muted, 500); x.restore();
    T(x, '세로: 조회 배수(중앙값 = 1)', PX0, PY1 + 42, 10, PAL.muted, 500);

    // 3등분 띠
    const G = groups(BANDS);
    if (bandIn > 0) {
      G.forEach((g, b) => {
        const lo = b === 0 ? 0 : (G[b - 1].hi + g.lo) / 2, hi = b === BANDS - 1 ? 0.6 : (g.hi + G[b + 1].lo) / 2;
        x.save(); x.globalAlpha = bandIn; x.fillStyle = b % 2 ? 'rgba(15,157,107,.05)' : 'rgba(15,157,107,.24)'; x.fillRect(xRate(lo), PY0, xRate(hi) - xRate(lo), PY1 - PY0);
        x.strokeStyle = ACC_INK; x.lineWidth = 1.6; x.beginPath(); x.moveTo(xRate(lo) + 2, yOf(g.med)); x.lineTo(xRate(hi) - 2, yOf(g.med)); x.stroke();
        TH(x, `×${g.med.toFixed(2)}`, (xRate(lo) + xRate(hi)) / 2, PY0 + 14, 12, ACC_INK, 700, 'center', MONO);
        TH(x, `${g.ids.length}편`, (xRate(lo) + xRate(hi)) / 2, PY0 + 28, 10, PAL.muted, 500, 'center');
        x.restore();
      });
    }
    // 기준선
    const cnt = RATE.filter((v) => v >= LINE).length;
    if (bandIn > 0) {
      x.save(); x.globalAlpha = bandIn; x.save(); x.beginPath(); x.rect(xRate(LINE), PY0, PX1 - xRate(LINE), PY1 - PY0); x.clip(); x.strokeStyle = 'rgba(168,54,10,.42)'; x.lineWidth = 1.4; x.beginPath();
      for (let hx = xRate(LINE) - 140; hx < PX1; hx += 6) { x.moveTo(hx, PY1); x.lineTo(hx + 140, PY0); } x.stroke(); x.restore();   // 기준선 오른쪽 사선 무늬
      x.strokeStyle = ORG_INK; x.lineWidth = 1.3; x.setLineDash([4, 3]); x.beginPath(); x.moveTo(xRate(LINE) + .5, PY0); x.lineTo(xRate(LINE) + .5, PY1); x.stroke(); x.setLineDash([]);
      TH(x, `${Math.round(LINE * 100)}% 이상 ${cnt}편 / 43`, xRate(LINE) + 4, PY1 - 8, 10.5, ORG_INK, 700);
      x.restore();
    }
    // 추세선
    if (L >= 2) {
      const k = E.outC(seg(t, 3.2, 3.9)), [b0, b1] = ols(RATE, Y_LOG ? LREL : REL);
      x.save(); x.globalAlpha = k * 0.9; x.strokeStyle = PAL.ink; x.lineWidth = 1.4; x.beginPath();
      [0.05, 0.55].forEach((r, i) => { const v = b0 + b1 * r, rel = Y_LOG ? Math.exp(v) : v, yy = Math.max(PY0, Math.min(PY1, yOf(Math.max(rel, 0.001)))); i ? x.lineTo(xRate(r), yy) : x.moveTo(xRate(r), yy); });
      x.stroke(); x.restore();
    }
    // 점
    N43.forEach((r, i) => {
      const on = E.outC(seg(t, 0.25 + i * 0.022, 0.25 + i * 0.022 + 0.4)), px = lerp(xView(r[2]), xRate(r[0]), m), py = yOf(r[1]);
      const hot = bandIn > 0 && r[0] >= LINE;
      x.globalAlpha = on; x.fillStyle = hot ? PAL.ink : 'rgba(15,42,34,.38)'; x.beginPath(); x.arc(px, py - 5 * (1 - on), hot ? 4.4 : 3.8, 0, 7); x.fill();
      x.strokeStyle = '#fff'; x.lineWidth = 1; x.stroke(); x.globalAlpha = 1;
    });
    s.lab.textContent = STEP[L - 1];
  },
};
export default demo;
