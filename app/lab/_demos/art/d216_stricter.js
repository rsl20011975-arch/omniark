/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/winner-vs-flop-sampling/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 가상 쇼츠 채널 26곳 x 50편을 코드로 만들고, 성공작·실패작을 고르는 세 가지 규칙을 한 겹씩 바꿔 가며
// 같은 컷 값(10초당 컷)의 AUC 가 어떻게 달라지는지 코드가 직접 계산해 보여 준다. 화면은 시간 t 의 함수다.
// 이 데이터는 표본 설계의 원리를 보이려고 만든 가상 값이다. 실제 쇼츠의 값이 아니다.
const REL_HI = 6;         // 성공작: 같은 채널 중앙값의 몇 배 이상
const REL_LO = 0.5;       // 실패작: 같은 채널 중앙값의 몇 배 이하
const CAP = 2;            // 채널당 성공작 상한(편)
const ABS_HI = 100000;    // 성공작 조회수 하한
const ABS_LO = 1000;      // 1단계의 실패작 조회수 상한
const N_S = 30, N_F = 12; // 목표 표본 크기(제작 기록의 성공 30, 실패 12)
const N_CH = 26, N_VID = 50;   // 채널 수, 채널당 편 수
const PAL = { bg0: '#f2f2f0', bg1: '#e4e4e1', ink: '#111111', muted: '#666666', accent: '#ff3b1f', accent2: '#111111', surface: '#ffffff', line: '#c9c9c4' };
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif', HAN = '"Black Han Sans", sans-serif';
const X0 = 20, X1 = 352, LV0 = 1.0, LV1 = 6.6, Y0 = 70, RH = 9.4;   // 점 그림 영역

function gauss(r) { let u = 0; for (let i = 0; i < 6; i++) u += r(); return (u - 3) / 0.7071; }
function world() {         // 채널 26곳, 채널마다 50편: 조회수(log10), 컷 값. 컷 값은 채널 이름값(큼) + 편 안의 작은 영향 + 잡음
  const r = rng(7), chans = [];
  for (let c = 0; c < N_CH; c++) {
    const lm = Math.max(2.4, Math.min(5.0, 3.7 + 0.8 * gauss(r))), vids = [];
    for (let j = 0; j < N_VID; j++) {
      let dev = 0.5 * gauss(r); if (r() < 0.06) dev += 0.6 + 0.8 * r();
      const lv = lm + dev;
      vids.push({ c, j, lv, views: Math.pow(10, lv), cuts: Math.max(0.5, 6 + 3.2 * (lm - 3.7) + 1.0 * dev + 1.8 * gauss(r)), pick: 0 });
    }
    const s = vids.map((v) => v.views).sort((a, b) => a - b);
    chans.push({ med: (s[24] + s[25]) / 2, vids });
  }
  chans.sort((a, b) => a.med - b.med);
  chans.forEach((ch, i) => ch.vids.forEach((v) => { v.c = i; }));
  return chans;
}
function auc(S, F) { let w = 0; for (const a of S) for (const b of F) w += a.cuts > b.cuts ? 1 : a.cuts === b.cuts ? 0.5 : 0; return S.length && F.length ? w / (S.length * F.length) : null; }
function sameCh(S, F) { let w = 0, n = 0; for (const a of S) for (const b of F) if (a.c === b.c) { n++; w += a.cuts > b.cuts ? 1 : a.cuts === b.cuts ? 0.5 : 0; } return { n, v: n ? w / n : null }; }

function pickLevel(ch, L) {   // 단계별 규칙으로 성공작·실패작을 고른다. pick: 1 성공, 2 실패
  const r = rng(11), all = ch.flatMap((c) => c.vids);
  const shuf = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  let sp, fp;
  if (L === 1) { sp = all.filter((v) => v.views >= ABS_HI); fp = all.filter((v) => v.views <= ABS_LO); }
  else {
    sp = all.filter((v) => v.views >= ABS_HI && v.views >= REL_HI * ch[v.c].med);
    const sc = new Set(sp.map((v) => v.c));
    fp = all.filter((v) => sc.has(v.c) && v.views <= REL_LO * ch[v.c].med);
  }
  if (L >= 3) { const cnt = {}; sp = shuf(sp).filter((v) => (cnt[v.c] = (cnt[v.c] || 0) + 1) <= CAP); }
  const S = shuf(sp).slice(0, N_S), F = shuf(fp).slice(0, N_F);
  const rb = rng(99), boot = [];
  for (let k = 0; k < 200 && sp.length && fp.length; k++) {
    const A = [], B = [];
    for (let i = 0; i < S.length; i++) A.push(sp[Math.floor(rb() * sp.length)]);
    for (let i = 0; i < F.length; i++) B.push(fp[Math.floor(rb() * fp.length)]);
    boot.push(auc(A, B));
  }
  boot.sort((a, b) => a - b);
  const mark = new Map(); S.forEach((v) => mark.set(v, 1)); F.forEach((v) => mark.set(v, 2));
  return { S, F, mark, auc: auc(S, F), same: sameCh(S, F), lo: boot.length ? boot[20] : null, hi: boot.length ? boot[180] : null, poolS: sp.length, poolF: fp.length };
}

let GRAIN = null;
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function card(x, X, Y, W, H) { x.fillStyle = PAL.surface; x.beginPath(); x.roundRect(X, Y, W, H, 4); x.fill(); x.strokeStyle = PAL.line; x.lineWidth = 1; x.stroke(); }
const px = (lv) => X0 + (lv - LV0) / (LV1 - LV0) * (X1 - X0);
const median = (a) => { const s = a.slice().sort((p, q) => p - q), n = s.length; return n ? (n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2) : 0; };

const STEP = ['어느 채널이든 조회수로', '같은 채널 중앙값에 대고', '채널당 두 편까지만'];
const RULE = [
  ['성공  조회 10만 이상', '실패  조회 1천 이하', '채널은 따지지 않는다'],
  ['성공  10만 이상, 채널 중앙값의 ' + REL_HI + '배 이상', '실패  같은 채널 중앙값의 ' + REL_LO + '배 이하', '채널 이름값을 같은 채널 안에서 뺀다'],
  ['성공  위 규칙에 채널당 ' + CAP + '편까지', '실패  위 규칙 그대로', '한 채널이 표본을 채우지 못하게 한다'],
];
const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(21), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const lab = el('div', null, sp);   // 이름표(numeral): 큰 단계 번호 + 13px 설명
    Object.assign(lab.style, { position: 'absolute', left: '16px', top: '10px', display: 'flex', alignItems: 'center', gap: '10px', zIndex: '4' });
    const idx = el('span', null, lab), pill = el('span', null, lab);
    Object.assign(idx.style, { color: PAL.accent, font: "400 40px/1 'Black Han Sans',sans-serif" });
    Object.assign(pill.style, { color: PAL.ink, font: "600 13px/1 'IBM Plex Sans KR',sans-serif" });
    const ch = world();
    return { main, idx, pill, ch, lv: [null, pickLevel(ch, 1), pickLevel(ch, 2), pickLevel(ch, 3)] };
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 3 : lv);
    const M = s.lv[Math.max(1, Math.min(3, L))], ch = s.ch, x = s.main.getContext('2d');
    t = t > 0 ? t : 0;
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'multiply'; x.globalAlpha = 0.07;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();
    // 점 그림: 채널 한 줄에 영상 50개
    card(x, 10, 62, 362, 278);
    T(x, '채널 26곳(중앙값 순) · 점 하나가 영상 한 편', 18, 75, 10, PAL.muted, 500, 'left', MONO);
    [2, 3, 4, 5, 6].forEach((v) => { const X = px(v); x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.moveTo(X + 0.5, 82); x.lineTo(X + 0.5, 336); x.stroke(); T(x, ['100', '1천', '1만', '10만', '100만'][v - 2], X, 335, 10, PAL.muted, 500, 'center', MONO); });
    x.setLineDash([3, 3]); x.strokeStyle = PAL.accent; x.beginPath(); x.moveTo(px(5) + 0.5, 82); x.lineTo(px(5) + 0.5, 326); x.stroke(); x.setLineDash([]);
    ch.forEach((c, i) => {
      const y = Y0 + 16 + i * RH, p = seg(t, 0.15 + i * 0.1, 0.5 + i * 0.1), lm = Math.log10(c.med);
      if (L >= 2) {
        x.fillStyle = `rgba(255,59,31,${0.12 * p})`; const hx = px(Math.min(LV1, Math.log10(REL_HI * c.med))); x.fillRect(hx, y - 4, X1 - hx, 8);
        x.fillStyle = `rgba(17,17,17,${0.17 * p})`; const lx = px(Math.max(LV0, Math.log10(REL_LO * c.med))); x.fillRect(X0, y - 4, lx - X0, 8);
      }
      x.strokeStyle = PAL.muted; x.lineWidth = 1; x.beginPath(); x.moveTo(px(lm) + 0.5, y - 4); x.lineTo(px(lm) + 0.5, y + 4); x.stroke();
      c.vids.forEach((v) => {
        const k = M.mark.get(v), X = px(v.lv);
        if (!k) { x.fillStyle = 'rgba(17,17,17,.24)'; x.beginPath(); x.arc(X, y, 1.7, 0, 7); x.fill(); return; }
        if (p <= 0) { x.fillStyle = 'rgba(17,17,17,.24)'; x.beginPath(); x.arc(X, y, 1.7, 0, 7); x.fill(); return; }
        const rr = lerp(1.7, 3.3, E.outBack(p));
        x.fillStyle = k === 1 ? PAL.accent : PAL.ink; x.beginPath(); x.arc(X, y, rr, 0, 7); x.fill();
        x.strokeStyle = PAL.surface; x.lineWidth = 1; x.stroke();
      });
    });
    // 오른쪽 한 칸: 고른 규칙, 표본 크기, AUC 와 두 가지 확인값
    const RX = 384, done = seg(t, 3.4, 5.0), nS = M.S.length, nF = M.F.length;
    card(x, RX, 62, 246, 278);
    RULE[L - 1].forEach((ln, i) => T(x, ln, RX + 12, 82 + i * 16, 10.5, i === 2 ? PAL.muted : PAL.ink, i === 2 ? 500 : 600));
    x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.moveTo(RX + 12, 124.5); x.lineTo(RX + 234, 124.5); x.stroke();
    const SX = RX + 66, SW = 166, vmax = 22;   // 고른 표본의 10초당 컷 값 분포(성공, 실패)
    [[M.S, 146, PAL.accent, '성공', nS], [M.F, 172, PAL.ink, '실패', nF]].forEach(([arr, yy, col, nm, n]) => {
      x.strokeStyle = PAL.line; x.beginPath(); x.moveTo(SX, yy + 0.5); x.lineTo(SX + SW, yy + 0.5); x.stroke();
      T(x, `${nm} ${n}편`, RX + 12, yy + 4, 10.5, col, 600);
      arr.forEach((v, i) => { const jy = yy + ((i * 7) % 5 - 2) * 3.4; x.fillStyle = col; x.globalAlpha = 0.85 * done; x.beginPath(); x.arc(SX + Math.min(vmax, v.cuts) / vmax * SW, jy, 2.8, 0, 7); x.fill(); x.globalAlpha = 1; });
      const m = median(arr.map((v) => v.cuts)); if (arr.length && done > 0.5) { const mx = SX + m / vmax * SW; x.strokeStyle = col; x.lineWidth = 1.6; x.beginPath(); x.moveTo(mx, yy - 12); x.lineTo(mx, yy + 12); x.stroke(); x.lineWidth = 1; }
    });
    [0, 10, 20].forEach((v) => T(x, v === 0 ? '컷 0' : String(v), SX + v / vmax * SW, 198, 10, PAL.muted, 500, 'center', MONO));
    T(x, '성공이 실패보다 컷이 많을 확률 (AUC)', RX + 12, 222, 10, PAL.muted, 500);
    const av = M.auc == null ? 0.5 : lerp(0.5, M.auc, E.outC(done));
    T(x, M.auc == null ? '—' : av.toFixed(2), RX + 12, 258, 38, L === 1 ? PAL.accent : PAL.ink, 700, 'left', MONO);
    T(x, '0.5 는 동전 던지기', RX + 234, 254, 10, PAL.muted, 500, 'right');
    const sc = M.same;
    T(x, `같은 채널 안 쌍만  ${sc.v == null ? '쌍 없음' : sc.v.toFixed(2) + ' (쌍 ' + sc.n + ')'}`, RX + 12, 284, 11, PAL.ink, 500);
    T(x, M.lo == null ? '' : `200번 다시 뽑으면  ${M.lo.toFixed(2)} ~ ${M.hi.toFixed(2)}`, RX + 12, 302, 11, PAL.ink, 500);
    T(x, '가상 세계의 값이다', RX + 234, 330, 10, PAL.muted, 500, 'right');
    s.idx.textContent = String(L); s.pill.textContent = STEP[L - 1];
  },
};
export default demo;
