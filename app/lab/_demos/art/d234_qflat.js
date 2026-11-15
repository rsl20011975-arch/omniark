/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/chapter-map-structure/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 장 나누기와 장 표지: 한 편의 장 7개와 장 표지 시간(자체 제작 4편, 시각표에서 계산)을 보고,
// 설명형 롱폼의 다른 틀(질문 장 N개 + 앞뒤 고정 구간, 제작 문서의 설계값 (추정))과 같은 시간축에서 대 본다. 화면은 시간 t 의 함수다.
const N_Q = 3;             // 가전 틀의 질문 장 수 (설계 문서)
const Q_LO = 60;           // 질문 장 하나의 아래쪽 끝(초) (설계 문서)
const Q_HI = 60;          // 질문 장 하나의 위쪽 끝(초) (설계 문서)
const MIN_FLAG = 20;       // 이 초 미만인 장에 ‘짧은 장’ 표시를 하는 가정(표시용 값, 유튜브 최소 10초와 다름) (추정)
const COLD = 20, MAPS = 10, COMPARE = 30, FLOW = 30;   // 질문 장 앞뒤 고정 구간(초) (설계 문서)
const MID_S = 480;         // 중간 광고 최소 길이 8분 (공식)
const AX_S = 840;          // 아래 시간축의 끝(초)
const PAL = { bg0: '#1b0e17', bg1: '#2b1424', ink: '#f6e9ee', muted: '#b095a3', accent: '#ff7aa8', accent2: '#ffd0a0', surface: '#26121f', line: 'rgba(246,233,238,.16)' };
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif';

// 자체 제작 롱폼 4편의 장면 길이(초). h 앞머리, c 장 표지, b 본문, e 끝 (시각표에서 재계산)
const EPS_RAW = [
  'h18.05,c1.80,b39.86,c7.64,b17.23,b19.14,b16.43,b16.67,b13.82,c1.80,b12.03,c1.80,b8.98,b31.47,c1.80,b40.12,c1.80,b15.39,b11.61,b10.43,e20.02',
  'h12.99,c1.80,b30.47,c6.93,b13.43,b18.95,b10.68,b10.55,b21.65,b20.02,c1.80,b13.49,c1.80,b31.18,c1.80,b10.70,b9.13,b10.05,e16.03',
  'h13.65,c1.80,b15.35,b14.98,b15.07,c1.80,b10.71,c1.80,b22.16,c1.80,b15.69,e14.62',
  'h11.62,c1.80,b16.89,c5.99,b19.00,b17.78,b17.73,b18.45,b19.10,b9.68,c1.80,b9.24,c1.80,b15.88,c1.80,b8.66,b9.23,b7.45,e10.81',
];
const NAMES1 = ['들어가며', '문제 증명', '고치는 단어 5개', '복사용 5줄', '실제로 넣어 보기', '따라 하기', '팁 3개'];

const sum = (a) => a.reduce((p, q) => p + q, 0);
function parse(raw) {
  const sc = raw.split(',').map((q) => ({ k: q[0], d: parseFloat(q.slice(1)) }));
  let acc = 0; const ch = [{ t0: 0, card: 0, len: 0 }];
  sc.forEach((z) => { if (z.k === 'c') ch.push({ t0: acc, card: z.d, len: 0 }); acc += z.d; });
  ch.forEach((c, i) => { c.len = (i + 1 < ch.length ? ch[i + 1].t0 : acc) - c.t0; });
  return { sc, ch, tot: acc, cards: sum(ch.map((c) => c.card)) };
}
const EPS = EPS_RAW.map(parse).sort((p, q) => q.tot - p.tot);
const E1 = EPS[0];
const stamp = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;   // 소수점 버림(시각표 도구와 같은 방식)
const mmss = (s) => { const r = Math.round(s); return `${Math.floor(r / 60)}:${String(r % 60).padStart(2, '0')}`; };

let GRAIN = null;
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function card(x, X, Y, W, H) { x.fillStyle = 'rgba(0,0,0,.2)'; x.fillRect(X + 1, Y + 3, W, H); x.fillStyle = 'rgba(0,0,0,.14)'; x.fillRect(X, Y + 2, W, H); x.fillStyle = PAL.surface; x.beginPath(); x.roundRect(X, Y, W, H, 4); x.fill(); x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.roundRect(X + .5, Y + .5, W - 1, H - 1, 4); x.stroke(); }
function hatch(x, X, Y, W, H, col, gap) { if (W < 1) return; x.save(); x.beginPath(); x.rect(X, Y, W, H); x.clip(); x.strokeStyle = col; x.lineWidth = 1; x.beginPath(); for (let k = -H; k < W; k += gap) { x.moveTo(X + k, Y + H); x.lineTo(X + k + H, Y); } x.stroke(); x.restore(); }

const STEP = ['장 일곱 개로 나누기', '장 표지가 쓰는 시간', '질문 장 틀과 대 보기'];
const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(52), gc = document.createElement('canvas'); gc.width = gc.height = 128;
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

    T(x, '롱폼을 장으로 나누기', 24, 28, 15, PAL.ink, 700);
    T(x, L === 0 ? '장이 없는 한 덩어리 화면' : '시각표에서 코드가 센 값과 설계 문서의 값을 나란히 놓는다', 24, 46, 11, PAL.muted, 500);

    if (L === 0) {
      const gr = E.outC(seg(t, 0.2, 1.6)), bx = 24, bw = 592 * gr;
      T(x, `한 편 ${mmss(E1.tot)} (${E1.tot.toFixed(1)}초)`, 24, 82, 12, PAL.ink, 700);
      const g = x.createLinearGradient(0, 92, 0, 130); g.addColorStop(0, '#d9608a'); g.addColorStop(1, '#a8446a');
      x.fillStyle = g; x.fillRect(bx, 92, bw, 38);
      x.fillStyle = 'rgba(255,255,255,.18)'; x.fillRect(bx, 92, bw, 1.4);
      T(x, '장 경계 없음, 시각표 없음', 36, 116, 12, '#fff3f6', 700);
      T(x, '0:00', 24, 148, 11, PAL.muted, 500, 'left', MONO); T(x, mmss(E1.tot), 616, 148, 11, PAL.muted, 500, 'right', MONO);
      card(x, 24, 170, 592, 160);
      T(x, '이 화면에 없는 것', 38, 194, 12, PAL.ink, 700);
      ['시청자가 지금 어디쯤인지 알려 주는 장 표지', '장마다 몇 초를 쓰는지 센 숫자', '장 수와 장 길이를 정한 이유', '가전 설명형처럼 질문 장을 쌓는 다른 틀'].forEach((ln, i) => T(x, ln, 38, 216 + i * 17, 11, PAL.muted, 500));
      T(x, '장을 나누지 않으면 5분이 한 줄의 말로만 이어지기 쉽다(추정)', 38, 310, 11, PAL.accent2, 700);
    } else {
      const p3 = L >= 3 ? E.inOutC(seg(t, 3.0, 3.6)) : 0, o1 = 1 - p3;
      if (o1 > 0.004) {
        // 1단계: 장 일곱 개
        const rows = E1.ch, Y0 = 70, RH = 24, PX = 1.6, BX = 176;
        T(x, `한 편의 장 ${rows.length}개`, 24, 64, 12, PAL.ink, 700);
        rows.forEach((c, i) => {
          const Y = Y0 + 6 + i * RH, k = E.outC(seg(t, 0.2 + i * 0.1, 0.9 + i * 0.1)), flag = c.len < MIN_FLAG;
          x.save(); x.globalAlpha = k * o1;
          if (flag) { x.fillStyle = 'rgba(255,208,160,.17)'; x.fillRect(20, Y - 3, 372, 20); }
          T(x, stamp(c.t0), 24, Y + 11, 11, PAL.muted, 600, 'left', MONO);
          T(x, NAMES1[i] || `장 ${i + 1}`, 66, Y + 11, 12, PAL.ink, 500);
          const w = c.len * PX * k, cw = L >= 2 ? Math.min(w, c.card * PX) : 0;
          if (L >= 2) { x.fillStyle = PAL.accent2; x.fillRect(BX, Y, cw, 14); }
          const g = x.createLinearGradient(0, Y, 0, Y + 14); g.addColorStop(0, '#ff8fb6'); g.addColorStop(1, '#d9608a');
          x.fillStyle = g; x.fillRect(BX + cw, Y, Math.max(0, w - cw), 14);
          T(x, `${c.len.toFixed(0)}초`, BX + c.len * PX + 6, Y + 11, 11, flag ? PAL.accent2 : PAL.ink, 700, 'left', MONO);
          x.restore();
        });
        const nFlag = rows.filter((c) => c.len < MIN_FLAG).length;
        x.save(); x.globalAlpha = o1;
        T(x, `${MIN_FLAG}초 미만 ${nFlag}개는 ‘짧은 장’으로 표시한다`, 24, Y0 + 6 + rows.length * RH + 14, 11, PAL.accent2, 600);
        x.restore();

        // 2단계: 장 표지 시간 표
        if (L >= 2) {
          const k = E.outC(seg(t, 1.8, 2.6));
          x.save(); x.globalAlpha = k * o1;
          card(x, 404, 56, 212, 150);
          T(x, '편마다 장 표지 시간', 416, 76, 12, PAL.ink, 700);
          ['편', '장', '표지 합', '비율'].forEach((h, i) => T(x, h, [416, 474, 546, 604][i], 94, 10, PAL.muted, 600, i < 1 ? 'left' : 'right'));
          EPS.forEach((ep, i) => {
            const Y = 114 + i * 19;
            T(x, `편 ${i + 1}`, 416, Y, 11, PAL.ink, 600, 'left', MONO);
            T(x, String(ep.ch.length), 474, Y, 11, PAL.ink, 600, 'right', MONO);
            T(x, `${ep.cards.toFixed(1)}초`, 548, Y, 11, PAL.ink, 600, 'right', MONO);
            T(x, `${(100 * ep.cards / ep.tot).toFixed(1)}%`, 604, Y, 11, PAL.accent2, 700, 'right', MONO);
          });
          T(x, '표지는 대개 1.8초이고,', 416, 192, 10, PAL.muted, 500);
          T(x, '길게 쓴 표지는 3편에 1장씩', 416, 205, 10, PAL.muted, 500);
          x.restore();
        }
      }

      // 3단계: 질문 장 틀과 같은 축에서(앞 내용과 바꿔 보인다)
      if (L >= 3 && p3 > 0.004) {
        const AX0 = 24, PXS = 592 / AX_S, xs = (v) => AX0 + v * PXS, gw = E.outC(seg(t, 3.4, 4.8));
        const FIX = COLD + MAPS + COMPARE + FLOW, mn = FIX + N_Q * Q_LO, mxx = FIX + N_Q * Q_HI;
        const need = (q) => Math.ceil((MID_S - FIX) / q);
        x.save(); x.globalAlpha = p3;
        T(x, '다른 틀: 질문 장을 쌓는 설계값', 24, 76, 13, PAL.ink, 700);
        const plan = (Y, H, qlen, tag) => {
          let acc = 0;
          const pos = (v) => AX0 + (v * PXS) * gw;
          const draw = (len, col) => { x.fillStyle = col; x.fillRect(pos(acc), Y, Math.max(0.4, len * PXS * gw - 0.8), H); acc += len; };
          draw(COLD, '#ffd0a0'); draw(MAPS, '#ff9fbf');
          for (let q = 0; q < N_Q; q++) {
            draw(qlen, '#ff7aa8');
            if (gw > 0.9) { x.fillStyle = PAL.accent2; x.beginPath(); x.moveTo(pos(acc) - 8, Y + H - 1); x.lineTo(pos(acc) - 1, Y + H - 1); x.lineTo(pos(acc) - 4.5, Y + H - 7); x.closePath(); x.fill(); }
          }
          draw(COMPARE, '#ffd0a0'); draw(FLOW, '#ff9fbf');
          T(x, `${tag} ${Math.round(acc)}초 (${mmss(acc)})`, 24, Y - 6, 11, PAL.ink, 700, 'left', MONO);
        };
        x.strokeStyle = PAL.accent2; x.lineWidth = 1.2; x.setLineDash([4, 3]); x.beginPath(); x.moveTo(xs(MID_S) + .5, 94); x.lineTo(xs(MID_S) + .5, 230); x.stroke(); x.setLineDash([]);
        T(x, '8분', xs(MID_S) + 5, 92, 11, PAL.accent2, 700);
        plan(112, 20, Q_LO, '최소');
        plan(150, 20, Q_HI, '최대');
        E1.ch.forEach((c) => { x.fillStyle = c.len < MIN_FLAG ? PAL.accent2 : 'rgba(176,149,163,.9)'; x.fillRect(AX0 + c.t0 * PXS * gw, 188, Math.max(0.4, c.len * PXS * gw - 1.2), 36); });
        T(x, `편 1  ${mmss(E1.tot)}, 짧은 장 ${E1.ch.filter((c) => c.len < MIN_FLAG).length}개(${MIN_FLAG}초 미만)`, 24, 184, 11, PAL.ink, 700, 'left', MONO);
        x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.moveTo(AX0, 230.5); x.lineTo(AX0 + 592, 230.5); x.stroke();
        for (let m = 0; m <= AX_S / 60; m += 2) { x.beginPath(); x.moveTo(xs(m * 60) + .5, 230); x.lineTo(xs(m * 60) + .5, 234); x.stroke(); T(x, m === 0 ? '0분' : String(m), xs(m * 60), 245, 10, PAL.muted, 500, 'center', MONO); }
        [['#ffd0a0', '콜드 오픈·비교판'], ['#ff9fbf', '지도·순서도'], ['#ff7aa8', '질문 장']].forEach((q, i) => { x.fillStyle = q[0]; x.fillRect(24 + i * 130, 256, 10, 10); T(x, q[1], 39 + i * 130, 265, 11, PAL.muted, 500); });
        x.fillStyle = PAL.accent2; x.beginPath(); x.moveTo(414, 256); x.lineTo(422, 256); x.lineTo(418, 263); x.closePath(); x.fill();
        T(x, '장 끝의 다음 장 예고', 428, 265, 11, PAL.muted, 500);
        card(x, 24, 278, 592, 68);
        T(x, `질문 ${N_Q}개이면 합계 ${mn}~${mxx}초, 8분에 닿으려면 질문 ${need(Q_HI)}~${need(Q_LO)}개`, 38, 296, 12, PAL.ink, 700);
        T(x, `편 1 은 ${E1.tot.toFixed(1)}초에 장 ${E1.ch.length}개, 최소 합계(${mn}초)와 ${Math.abs(mn - E1.tot).toFixed(0)}초 차이`, 38, 313, 11, PAL.muted, 500);
        T(x, '질문 장 틀의 숫자는 설계 문서의 값이고 시청 성과로 확인된 적이 없다', 38, 330, 11, PAL.accent2, 700);
        x.restore();
      }
    }
    s.pill.textContent = L === 0 ? '연출 전 · 장 없이 한 덩어리' : `단계 ${L} · ${STEP[L - 1]}`;
  },
};
export default demo;
