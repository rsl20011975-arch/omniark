/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/script-volume-table/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 롱폼 대본 분량표: 길이와 말 속도와 해설 점유에서 글자 수와 줄 수를 계산하고, 실제 만든 4편의 값과 나란히 놓는다.
// 화면의 글자 수와 초와 비율은 전부 코드가 계산한다. 4편은 줄별 시작과 길이를 합쳐 다시 계산한 값이다.
const TARGET_S = 180;     // 만들려는 영상 길이(초)
const CPS = 6.0;          // 말 속도 가정(공백 뺀 글자 / 초). 가전 롱폼 기록값
const OCC = 0.85;         // 해설 점유: 말하는 시간 / 영상 길이
const ASKED = 1500;       // 분량 없이 ‘3분 대본’이라고만 시켜 받았다고 가정한 글자 수
const PAL = { bg0: '#eef2f7', bg1: '#dfe6f0', ink: '#0f1b2d', muted: '#5a6a80', accent: '#2b6cff', accent2: '#ff8a3d', surface: '#ffffff', line: 'rgba(15,27,45,.16)' };
const MUTED2 = '#4a5a70', ACC_INK = '#1f56d6', BAD = '#b42318', GOOD = '#14683d';
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif', HAN = '"Black Han Sans", sans-serif';
// 실제 만든 교육 롱폼 4편: 영상 길이(초), 공백 뺀 글자 수, 말한 시간 합(초), 줄 수, 줄 글자 수(공백 포함) 중앙과 최대
const EPS = [
  { id: 'A', len: 307.881, chars: 1767, spoken: 261.681, lines: 70, med: 34, max: 77 },
  { id: 'B', len: 243.451, chars: 1414, spoken: 207.851, lines: 47, med: 38, max: 83 },
  { id: 'C', len: 129.431, chars: 743, spoken: 107.481, lines: 25, med: 38, max: 57 },
  { id: 'D', len: 204.703, chars: 1399, spoken: 170.553, lines: 44, med: 42, max: 58 },
];
const rowOf = (e) => ({ name: e.id, len: e.len, cps: e.chars / e.spoken, occ: e.spoken / e.len, cpm: e.chars / e.len * 60, per: e.chars / e.lines });
const AVG_LINE = EPS.reduce((a, e) => a + e.chars, 0) / EPS.reduce((a, e) => a + e.lines, 0);   // 줄당 평균 글자(공백 뺀)
const PLAN = (() => { const chars = Math.round(TARGET_S * CPS * OCC), speak = chars / CPS, lines = Math.round(chars / AVG_LINE);
  return { chars, speak, lines, perLine: speak / lines, cpm: chars / TARGET_S * 60, max: TARGET_S * CPS }; })();
const ASK = (() => { const speak = ASKED / CPS; return { chars: ASKED, speak, occ: speak / TARGET_S, lines: Math.round(ASKED / AVG_LINE) }; })();
const MAXED = Math.max(...EPS.map((e) => e.max)), MINED = Math.min(...EPS.map((e) => e.max));
const rowsT = EPS.map(rowOf).concat([{ name: '계획', len: TARGET_S, cps: CPS, occ: OCC, cpm: PLAN.cpm, per: AVG_LINE, plan: 1 }]);
const f0 = (v) => Math.round(v).toLocaleString('en-US');

function rr(x, X, Y, W, H, r) { x.beginPath(); x.roundRect(X, Y, Math.max(0, W), Math.max(0, H), Math.max(0, Math.min(r, W / 2, H / 2))); }
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.textBaseline = 'alphabetic'; x.fillText(s, X, Y); }
function card(x, X, Y, W, H, r, fill, stroke) {   // 겹쳐 그린 반투명 사각형 그림자 + 면 + 가는 선
  for (let i = 3; i >= 1; i--) { x.fillStyle = `rgba(15,27,45,${0.035 + (4 - i) * 0.012})`; rr(x, X - i * 0.5, Y + i * 1.3, W + i, H + i, r + i); x.fill(); }
  x.fillStyle = fill || PAL.surface; rr(x, X, Y, W, H, r); x.fill(); x.strokeStyle = stroke || PAL.line; x.lineWidth = 1; rr(x, X + 0.5, Y + 0.5, W - 1, H - 1, r); x.stroke();
}
function strip(x, X, Y, W, H, n, speak, axis, prog, over) {   // 시간 축 위에 줄 n 개의 말하는 구간을 놓는다
  x.fillStyle = 'rgba(15,27,45,.07)'; rr(x, X, Y, W, H, 4); x.fill();
  const px = (s) => X + s / axis * W, gap = speak >= TARGET_S ? 0.25 : (TARGET_S - speak) / (n + 1), d = speak / n;
  let t0 = speak >= TARGET_S ? 0 : gap;
  for (let i = 0; i < n; i++) {
    const k = Math.max(0, Math.min(1, prog * n - i)), a = t0, b = t0 + d * k;
    if (k > 0) { x.fillStyle = a >= TARGET_S ? BAD : PAL.accent; x.globalAlpha = a >= TARGET_S ? 0.9 : 0.88; x.fillRect(px(a), Y + 3, Math.max(0.6, px(b) - px(a) - 0.6), H - 6); x.globalAlpha = 1; }
    t0 += d + gap;
  }
  x.strokeStyle = PAL.ink; x.lineWidth = 1.2; x.beginPath(); x.moveTo(px(TARGET_S), Y - 3); x.lineTo(px(TARGET_S), Y + H + 3); x.stroke();
}

const NUM = ['0', '1', '2', '3', '4'];
const DESC = ['‘3분 대본’이라고만 시킨 결과', '길이와 말 속도로 글자 한도를 구한다', '말하는 시간의 비율을 곱한다', '줄 수와 줄당 시간으로 나눈다', '실제로 만든 4편과 나란히 놓는다'];
const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 4,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(23), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0);
    const lab = el('div', null, sp);   // 이름표(numeral): 왼쪽 위 큰 숫자와 옆 설명
    Object.assign(lab.style, { position: 'absolute', left: '20px', top: '6px', display: 'flex', alignItems: 'center', gap: '10px', zIndex: '4', whiteSpace: 'nowrap' });
    const num = el('span', null, lab), desc = el('span', null, lab);
    Object.assign(num.style, { font: "400 40px/1 'Black Han Sans',sans-serif", color: PAL.accent, minWidth: '26px' });
    Object.assign(desc.style, { font: "500 13px/1.3 'IBM Plex Sans KR',sans-serif", color: PAL.ink });
    return { main, num, desc, gc };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 0 : (lv == null ? 4 : lv);
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.setLineDash([]);
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'multiply'; x.globalAlpha = 0.07;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(s.gc, gx0, gy0, 128, 128);
    x.restore();
    const CX = 20, CW = 288;
    card(x, CX, 54, CW, 292, 10);
    // 계산 사슬: 길이, 말 속도, 점유, 줄 수
    const chips = [
      { lv: 0, lab: '영상 길이', f: `${f0(TARGET_S)}초 (${(TARGET_S / 60).toFixed(0)}분)`, r: `${f0(TARGET_S)}초` },
      { lv: 1, lab: '× 말 속도', f: `${CPS.toFixed(1)}자/초, 쉬지 않고 말하면`, r: `${f0(PLAN.max)}자` },
      { lv: 2, lab: '× 해설 점유', f: `말하는 시간 ${(OCC * 100).toFixed(0)}%`, r: L >= 4 ? `${f0(ASK.chars)} → ${f0(PLAN.chars)}자` : `${f0(PLAN.chars)}자` },
      { lv: 3, lab: '÷ 줄당 글자', f: `평균 ${AVG_LINE.toFixed(1)}자, 줄당 ${PLAN.perLine.toFixed(1)}초`, r: L >= 4 ? `${ASK.lines} → ${PLAN.lines}줄` : `${PLAN.lines}줄` },
    ];
    chips.forEach((c, i) => {
      const y = 62 + i * 41, vis = L >= c.lv, k = vis ? (L === c.lv ? E.outC(seg(t, 0.2, 0.8)) : 1) : 0;
      x.save(); x.globalAlpha = vis ? 0.3 + 0.7 * k : 0.5; card(x, CX + 8, y, CW - 16, 36, 7, '#f7f9fc');
      T(x, c.lab, CX + 18, y + 14, 10, MUTED2, 600); T(x, c.f, CX + 18, y + 28, 10, PAL.ink, 500, 'left', MONO);
      if (vis) T(x, c.r, CX + CW - 18, y + 24, 15, ACC_INK, 700, 'right', MONO); else T(x, '—', CX + CW - 18, y + 24, 14, MUTED2, 600, 'right', MONO);
      x.restore();
    });
    if (L >= 1) {   // 받은 대본이 한도를 넘는가
      const over = ASK.chars > PLAN.max, kk = L === 1 ? E.outC(seg(t, 0.5, 1.1)) : 1;
      x.save(); x.globalAlpha = 0.2 + 0.8 * kk; T(x, `받은 ${f0(ASK.chars)}자 ${over ? '>' : '≤'} 한도 ${f0(PLAN.max)}자`, CX + CW - 18, 238, 10, over ? BAD : GOOD, 700, 'right', MONO); x.restore();
    }
    // 시간 띠 둘: 받은 대본, 맞춘 대본
    const axis = Math.max(TARGET_S, ASK.speak) * 1.04, SX = CX + 12, SW = CW - 24, pr = E.outC(seg(t, 0.3, 1.8));
    T(x, `받은 대본: ${f0(ASK.chars)}자를 읽으면 ${f0(ASK.speak)}초, 길이의 ${(ASK.occ * 100).toFixed(0)}%`, SX, 256, 10, ASK.occ > 1 ? BAD : PAL.ink, 600);
    strip(x, SX, 262, SW, 22, ASK.lines, ASK.speak, axis, pr, true);
    if (L >= 2) {
      const p2 = L === 2 ? E.outC(seg(t, 0.4, 1.9)) : 1;
      T(x, `맞춘 대본: ${f0(PLAN.chars)}자를 읽으면 ${f0(PLAN.speak)}초, 길이의 ${(OCC * 100).toFixed(0)}%`, SX, 304, 10, PAL.ink, 600);
      strip(x, SX, 310, SW, 22, PLAN.lines, PLAN.speak, axis, p2, false);
    } else T(x, '맞춘 대본은 2단계에서 계산한다', SX, 304, 10, MUTED2, 500);
    T(x, '세로선 = 영상 끝, 빨간 칸 = 영상 끝 뒤로 넘친 말', SX, 342, 9, MUTED2, 500, 'left', MONO);
    // 오른쪽: 실제 4편 표와 분당 글자 막대
    const RX = 324, RW = 296;
    card(x, RX, 54, RW, 292, 10);
    const k4 = L >= 4 ? E.outC(seg(t, 0.2, 0.9)) : 0, kp = L === 2 ? E.outC(seg(t, 0.8, 1.4)) : 1;
    const cols = [['편', 14, 'left'], ['길이', 78, 'right'], ['자/초', 124, 'right'], ['점유', 168, 'right'], ['분당 글자', 230, 'right'], ['줄당 자', 282, 'right']];
    cols.forEach(([h, ox, al]) => T(x, h, RX + ox, 72, 9.5, MUTED2, 600, al));
    x.fillStyle = PAL.line; x.fillRect(RX + 10, 77, RW - 20, 1);
    rowsT.forEach((r, i) => {
      const y = 80 + i * 20, col = r.plan ? ACC_INK : PAL.ink, yy = y + 13;
      if (r.plan) { x.fillStyle = 'rgba(43,108,255,.10)'; rr(x, RX + 8, y, RW - 16, 19, 4); x.fill(); x.strokeStyle = PAL.accent; x.lineWidth = 1; rr(x, RX + 8.5, y + 0.5, RW - 17, 18, 4); x.stroke(); }
      const cells = [r.name, `${f0(r.len)}초`, r.cps.toFixed(2), `${(r.occ * 100).toFixed(0)}%`, f0(r.cpm), r.per.toFixed(1)];
      cells.forEach((c, ci) => {
        const need = r.plan ? [0, 0, 1, 2, 2, 3][ci] : (ci === 0 ? 0 : 4), vis = L >= need, al = cols[ci][2], k = need === 4 ? k4 : (need === 2 && L === 2 ? kp : 1);
        x.save(); x.globalAlpha = vis ? 0.25 + 0.75 * k : 1;
        if (vis) T(x, c, RX + cols[ci][1], yy, 11, col, ci === 4 || ci === 0 ? 700 : 500, al, MONO); else T(x, '—', RX + cols[ci][1], yy, 11, MUTED2, 500, al, MONO);
        x.restore();
      });
    });
    if (L >= 4) T(x, `줄 글자 수(공백 포함) 중앙 ${Math.min(...EPS.map((e) => e.med))}~${Math.max(...EPS.map((e) => e.med))}자, 최대 ${MINED}~${MAXED}자`, RX + 14, 204, 9.5, MUTED2, 500, 'left', MONO);
    else T(x, '4편은 4단계에서, 계획 줄은 단계마다 채워진다', RX + 14, 204, 9.5, MUTED2, 500, 'left', MONO);
    T(x, '분당 글자 = 글자 수 / 영상 길이 x 60', RX + 14, 228, 10, PAL.ink, 600);
    const mx = 450, BX = RX + 44, BW = RW - 100;
    rowsT.forEach((r, i) => {
      const y = 236 + i * 20, vis = r.plan ? L >= 2 : L >= 4, k = r.plan ? (L === 2 ? kp : 1) : k4;
      const w = vis ? r.cpm / mx * BW * E.outC(seg(L >= 4 ? t : 9, 0.3 + i * 0.1, 1.2 + i * 0.1)) * (r.plan && L < 4 ? k : 1) : 0;
      T(x, r.name, RX + 14, y + 11, 10, r.plan ? ACC_INK : PAL.ink, 700, 'left', MONO);
      x.fillStyle = 'rgba(15,27,45,.07)'; rr(x, BX, y, BW, 14, 3); x.fill();
      if (w > 0) { x.fillStyle = r.plan ? PAL.accent2 : PAL.accent; rr(x, BX, y, w, 14, 3); x.fill(); }
      if (vis) T(x, f0(r.cpm), BX + BW + 8, y + 11, 10.5, PAL.ink, 700, 'left', MONO); else T(x, '—', BX + BW + 8, y + 11, 10.5, MUTED2, 500, 'left', MONO);
    });
    s.num.textContent = NUM[L]; s.desc.textContent = DESC[L];
  },
};
export default demo;
