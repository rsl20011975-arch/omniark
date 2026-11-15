/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/longform-length-by-depth/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 롱폼 길이: 시장 가전 롱폼 121편의 길이 분포, 중간 광고 8분, 자체 제작 4편의 장면 합을 한 분 단위 축에 놓는다.
// 숫자(중앙값, 사분위, 8분 이상 편 수, 모자라는 초)는 전부 코드가 아래 원자료에서 센다. 화면은 시간 t 의 함수다.
const BIN_W = 1;           // 시장 길이 막대 한 칸의 폭(분)
const GOAL_MIN = 8;        // 가정한 목표 길이(분). 정답 길이가 아니라 비교용 가정 [추정]
const MID_MIN = 8;         // 중간 광고를 켤 수 있는 최소 길이(분) [공식 2026-11-14]
const TARGET_BEFORE = 10;  // 연출 전: 근거 없이 먼저 정한 목표 길이(분)
const FILT_LO = 4, FILT_HI = 20;   // 시장 표본을 모을 때 건 길이 필터(분) [기록: 검색 설정 videoDuration=medium, 4~20분]
const PAL = { bg0: '#171615', bg1: '#232120', ink: '#f2efe9', muted: '#9a958c', accent: '#5ad1c8', accent2: '#f2b84b', surface: '#1f1d1b', line: 'rgba(242,239,233,.16)' };
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif';

// 시장 가전 롱폼 121편의 길이(초). 한국·2025-10 이후·조회순 검색어 6개의 합본에서 겹침을 뺀 값 [측정, 원자료 재계산]
const MKT = [295,307,333,359,363,364,372,375,398,414,421,422,446,468,472,495,503,512,522,524,528,532,538,540,541,551,554,571,575,581,583,589,594,595,597,600,604,615,621,623,627,631,641,641,650,661,662,668,675,686,696,711,712,714,714,741,745,753,765,772,773,773,776,789,794,794,798,800,802,813,813,814,818,819,820,829,832,836,848,848,852,857,859,866,869,870,875,884,900,920,932,932,939,944,965,969,972,987,988,997,999,1004,1016,1041,1053,1055,1060,1082,1083,1086,1091,1097,1104,1109,1112,1122,1135,1141,1149,1170,1188];
// 자체 제작 롱폼 4편의 장면 길이(초). 첫 글자: h 앞머리, c 장 표지, b 본문, e 끝. 시각표에서 계산 [측정, 재계산]
const EPS_RAW = [
  'h18.05,c1.80,b39.86,c7.64,b17.23,b19.14,b16.43,b16.67,b13.82,c1.80,b12.03,c1.80,b8.98,b31.47,c1.80,b40.12,c1.80,b15.39,b11.61,b10.43,e20.02',
  'h12.99,c1.80,b30.47,c6.93,b13.43,b18.95,b10.68,b10.55,b21.65,b20.02,c1.80,b13.49,c1.80,b31.18,c1.80,b10.70,b9.13,b10.05,e16.03',
  'h13.65,c1.80,b15.35,b14.98,b15.07,c1.80,b10.71,c1.80,b22.16,c1.80,b15.69,e14.62',
  'h11.62,c1.80,b16.89,c5.99,b19.00,b17.78,b17.73,b18.45,b19.10,b9.68,c1.80,b9.24,c1.80,b15.88,c1.80,b8.66,b9.23,b7.45,e10.81',
];

const sum = (a) => a.reduce((p, q) => p + q, 0);
const sorted = [...MKT].sort((p, q) => p - q);
const qt = (p) => { const n = sorted.length, pos = (n + 1) * p; const i = Math.floor(pos); const f = pos - i; return i < 1 ? sorted[0] : i >= n ? sorted[n - 1] : sorted[i - 1] + f * (sorted[i] - sorted[i - 1]); };
const MED = qt(0.5) / 60, Q1 = qt(0.25) / 60, Q3 = qt(0.75) / 60;
const OVER8 = MKT.filter((s) => s >= MID_MIN * 60).length;
const EPS = EPS_RAW.map((r) => r.split(',').map((q) => ({ k: q[0], d: parseFloat(q.slice(1)) }))).map((sc) => ({ sc, tot: sum(sc.map((z) => z.d)) })).sort((p, q) => q.tot - p.tot);

const X0 = 44, X1 = 616, AX_MAX = 21, PXM = (X1 - X0) / AX_MAX;
const xm = (m) => X0 + m * PXM;
const mmss = (s) => { const r = Math.round(s); return `${Math.floor(r / 60)}:${String(r % 60).padStart(2, '0')}`; };
const SEGCOL = { h: PAL.accent2, c: PAL.ink, b: PAL.accent, e: PAL.muted };

let GRAIN = null;
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function hatch(x, X, Y, W, H, col, gap) { if (W < 1) return; x.save(); x.beginPath(); x.rect(X, Y, W, H); x.clip(); x.strokeStyle = col; x.lineWidth = 1; x.beginPath(); for (let k = -H; k < W; k += gap) { x.moveTo(X + k, Y + H); x.lineTo(X + k + H, Y); } x.stroke(); x.restore(); }
function card(x, X, Y, W, H) { x.fillStyle = 'rgba(0,0,0,.18)'; x.fillRect(X + 1, Y + 3, W, H); x.fillStyle = 'rgba(0,0,0,.14)'; x.fillRect(X, Y + 2, W, H); x.fillStyle = PAL.surface; x.beginPath(); x.roundRect(X, Y, W, H, 4); x.fill(); x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.roundRect(X + .5, Y + .5, W - 1, H - 1, 4); x.stroke(); }
function segBar(x, sc, X, Y, H, grow) {   // 장면 막대: 장면마다 색, 장면 사이에 가는 틈
  let acc = 0;
  sc.forEach((z, i) => { const sx = xm(acc / 60), w = (xm((acc + z.d) / 60) - sx) * grow; if (w > 0.2) { x.fillStyle = SEGCOL[z.k]; x.globalAlpha = z.k === 'b' ? (i % 2 ? 0.78 : 1) : 1; x.fillRect(sx, Y, Math.max(0.3, w - 0.8), H); } acc += z.d; });
  x.globalAlpha = 1;
}

const STEP = ['시장 길이 분포', '8분 선과 우리 4편', '목표 길이와의 차이'];
const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(41), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const pill = el('div', null, sp);
    Object.assign(pill.style, { position: 'absolute', right: '10px', top: '10px', padding: '.25em 11px', borderRadius: '999px', background: PAL.surface, border: `1px solid ${PAL.line}`, color: PAL.ink, font: "600 11px/1.4 'IBM Plex Sans KR',sans-serif", zIndex: '4', whiteSpace: 'nowrap' });
    return { main, pill };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 0 : (lv == null ? 3 : lv);
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'screen'; x.globalAlpha = 0.05;
    for (let g0 = 0; g0 < 640; g0 += 128) for (let g1 = 0; g1 < 360; g1 += 128) x.drawImage(GRAIN, g0, g1, 128, 128);
    x.restore();

    T(x, '롱폼 길이는 무엇이 정하나', 24, 26, 14, PAL.ink, 700);
    T(x, L === 0 ? '목표 길이를 먼저 정한 화면' : '시장 분포와 우리 네 편을 한 축에 놓는다', 24, 40, 10, PAL.muted, 500, 'left', MONO);

    const tickAxis = (Y, maxM, alpha) => {
      x.save(); x.globalAlpha = alpha; x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.moveTo(X0, Y + .5); x.lineTo(xm(maxM), Y + .5); x.stroke();
      for (let m = 0; m <= maxM; m += 2) { x.beginPath(); x.moveTo(xm(m) + .5, Y); x.lineTo(xm(m) + .5, Y + 4); x.stroke(); T(x, m === 0 ? '0분' : String(m), xm(m), Y + 14, 10, PAL.muted, 500, 'center', MONO); }
      x.restore();
    };

    if (L === 0) {   // 연출 전: 목표 먼저, 모자란 곳은 채움
      const ep = EPS[0], fill0 = TARGET_BEFORE * 60 - ep.tot, grow = E.outC(seg(t, 0.2, 1.4)), fk = E.inOutC(seg(t, 1.2, 3.0));
      T(x, `목표 ${TARGET_BEFORE}분, 근거 없이 정한 값`, X0, 76, 11, PAL.ink, 700);
      const bx = xm(0), bw = xm(TARGET_BEFORE) - bx;
      x.fillStyle = 'rgba(242,239,233,.06)'; x.fillRect(bx, 88, bw, 40);
      segBar(x, ep.sc, bx, 88, 40, grow);
      const cx = xm(ep.tot / 60);
      x.save(); x.globalAlpha = fk; hatch(x, cx, 88, (bw - (cx - bx)) * fk, 40, PAL.accent2, 5); x.restore();
      x.strokeStyle = PAL.muted; x.lineWidth = 1; x.beginPath(); x.rect(bx + .5, 88.5, bw - 1, 39); x.stroke();
      tickAxis(138, 10, 1);
      const fill = fill0 * fk;
      T(x, `내용 ${ep.tot.toFixed(1)}초`, X0, 176, 12, PAL.ink, 700, 'left', MONO);
      T(x, `채움 ${fill.toFixed(1)}초 (${(100 * fill / (TARGET_BEFORE * 60)).toFixed(0)}%)`, X0, 194, 12, PAL.accent2, 700, 'left', MONO);
      T(x, '빗금은 새 내용이 아니라 길이를 맞추려고 넣은 구간', X0 + 190, 194, 10, PAL.muted, 500);
      card(x, 24, 220, 592, 110);
      T(x, '이 화면에 없는 것', 38, 240, 11.5, PAL.ink, 700);
      ['시장 가전 롱폼 121편은 몇 분이었나', '8분이라는 숫자는 무엇의 조건인가', '내 편은 몇 개 장면의 합이었나', '목표 10분은 어디서 나온 값인가'].forEach((ln, i) => T(x, ln, 38, 260 + i * 15, 10.5, PAL.muted, 500));
      T(x, '길이를 먼저 박으면 모자란 만큼을 되풀이로 채우기 쉽다(추정)', 38, 322, 10.5, PAL.accent2, 700);
    } else {
      // 1단계: 시장 분포 막대
      const base = 168, hmax = 92, nb = Math.ceil(AX_MAX / BIN_W), cnt = new Array(nb).fill(0);
      MKT.forEach((v) => { cnt[Math.min(nb - 1, Math.floor(v / 60 / BIN_W))]++; });
      const mx = Math.max(...cnt);
      const hIn = E.outC(seg(t, 0.15, 1.3));
      // 조사 밖 구간
      hatch(x, xm(0), 62, xm(FILT_LO) - xm(0), base - 62, 'rgba(154,149,140,.55)', 6);
      hatch(x, xm(FILT_HI), 62, xm(AX_MAX) - xm(FILT_HI), base - 62, 'rgba(154,149,140,.55)', 6);
      T(x, '필터 밖', xm(FILT_LO / 2), 112, 10, PAL.muted, 600, 'center');
      T(x, '(4분 미만)', xm(FILT_LO / 2), 124, 10, PAL.muted, 500, 'center');
      // 가운데 절반 띠와 막대
      x.fillStyle = 'rgba(90,209,200,.13)'; x.fillRect(xm(Q1), 62, xm(Q3) - xm(Q1), base - 62);
      cnt.forEach((c, i) => {
        if (!c) return;
        const bx = xm(i * BIN_W), bw = xm((i + 1) * BIN_W) - bx, bh = hmax * (c / mx) * hIn;
        const g = x.createLinearGradient(0, base - bh, 0, base); g.addColorStop(0, '#7be3da'); g.addColorStop(1, '#3da79f');
        x.fillStyle = g; x.fillRect(bx + 1, base - bh, bw - 2, bh);
        x.fillStyle = 'rgba(255,255,255,.22)'; x.fillRect(bx + 1, base - bh, bw - 2, 1.2);
      });
      x.strokeStyle = PAL.ink; x.lineWidth = 1.4; x.beginPath(); x.moveTo(xm(MED) + .5, 64); x.lineTo(xm(MED) + .5, base); x.stroke();
      tickAxis(base, AX_MAX, 1);
      const infoA = E.outC(seg(t, 1.0, 1.6));
      x.save(); x.globalAlpha = infoA;
      T(x, `시장 ${MKT.length}편  중앙 ${MED.toFixed(1)}분  가운데 절반 ${Q1.toFixed(1)}~${Q3.toFixed(1)}분`, X0, 56, 10.5, PAL.ink, 700);
      x.restore();

      // 2단계: 8분 선, 우리 4편
      if (L >= 2) {
        const lk = E.outC(seg(t, 1.8, 2.5)), mxp = xm(MID_MIN);
        x.save(); x.globalAlpha = lk; x.strokeStyle = PAL.accent2; x.lineWidth = 1.4; x.setLineDash([4, 3]);
        x.beginPath(); x.moveTo(mxp + .5, 60); x.lineTo(mxp + .5, 296); x.stroke(); x.restore();
        x.save(); x.globalAlpha = lk;
        T(x, `8분 이상 ${OVER8}/${MKT.length}편 (${(100 * OVER8 / MKT.length).toFixed(0)}%)`, X1, 56, 10.5, PAL.accent2, 700, 'right');
        x.restore();
        T(x, `중간 광고 ${MID_MIN}분`, mxp + 4, 196, 10, PAL.accent2, 700);
        T(x, '자체 제작 롱폼 4편: 장면을 이어 붙인 길이', X0, 208, 10.5, PAL.ink, 700);
        EPS.forEach((ep, i) => {
          const Y = 214 + i * 19, gr = E.outC(seg(t, 2.3 + i * 0.18, 3.4 + i * 0.18));
          T(x, `편 ${i + 1}`, 10, Y + 10.5, 10, PAL.muted, 600, 'left', MONO);
          segBar(x, ep.sc, xm(0), Y, 13, gr);
          x.save(); x.globalAlpha = gr; T(x, `${mmss(ep.tot)} · 장면 ${ep.sc.length}개`, 306, Y + 10.5, 10, PAL.ink, 600, 'left', MONO); x.restore();
        });
        const lg = E.outC(seg(t, 3.4, 4.0));
        x.save(); x.globalAlpha = lg;
        [['h', '앞머리'], ['c', '장 표지'], ['b', '본문'], ['e', '끝']].forEach((q, i) => { x.fillStyle = SEGCOL[q[0]]; x.fillRect(X0 + i * 66, 300, 9, 9); T(x, q[1], X0 + i * 66 + 13, 308, 10, PAL.muted, 500); });
        x.restore();
      }
      // 3단계: 가정한 목표 길이와의 차이
      if (L >= 3) {
        const k = E.outC(seg(t, 4.0, 5.0)), gxp = xm(GOAL_MIN);
        EPS.forEach((ep, i) => {
          const Y = 214 + i * 19, gap = GOAL_MIN * 60 - ep.tot;
          if (gap > 0) { x.save(); x.globalAlpha = k; hatch(x, xm(ep.tot / 60), Y, (gxp - xm(ep.tot / 60)) * k, 13, PAL.accent2, 4); x.restore(); }
          x.save(); x.globalAlpha = k;
          T(x, gap > 0 ? `${gap.toFixed(0)}초 모자람` : `${(-gap).toFixed(0)}초 넘음`, 440, Y + 10.5, 10, gap > 0 ? PAL.accent2 : PAL.accent, 700, 'left', MONO);
          x.restore();
        });
        x.save(); x.globalAlpha = k; x.strokeStyle = PAL.ink; x.lineWidth = 1.2; x.beginPath(); x.moveTo(gxp + .5, 210); x.lineTo(gxp + .5, 292); x.stroke();
        T(x, `가정 ${GOAL_MIN}분`, gxp + 4, 295, 10, PAL.ink, 700, 'left', MONO); x.restore();
        x.save(); x.globalAlpha = k; card(x, 300, 296, 316, 54);
        T(x, '빗금 = 목표까지 새 내용이 더 있어야 하는 초', 310, 313, 10, PAL.ink, 700);
        T(x, '채우기 전에 질문 목록이 끝났는지부터 센다', 310, 328, 10, PAL.muted, 500);
        T(x, '목표선은 가정한 값이고 정답 길이가 아니다', 310, 342, 10, PAL.accent2, 600);
        x.restore();
      }
    }
    s.pill.textContent = L === 0 ? '연출 전 · 목표 길이부터' : `단계 ${L} · ${STEP[L - 1]}`;
  },
};
export default demo;
