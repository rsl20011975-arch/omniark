/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/pose-single-frame-vs-sheet/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 걷기 한 걸음(8포즈)을 시트 한 장에 그리게 할 때와, 포즈마다 낱장으로 만들어 코드가 발 기준선에 조립할 때를 코드로 그려 견준다.
// 그림은 전부 코드로 그린 예시다. AI 가 만든 결과가 아니라, 화면의 숫자(방향 일치, 발 어긋남)만 이 장면에서 계산한 값이다.
const FRAMES = 8;         // 한 걸음을 나눈 프레임 수
const FACING = -1;         // 1 이면 오른쪽, -1 이면 왼쪽을 보는 옆모습
const STRIDE = 1;         // 걸음 폭 배율(1 = 보통 걷기)
const ALIGN_FEET = 1;     // 1 이면 3단계에서 발 기준선에 맞춘다
const FLIPS = [2, 5, 6];  // 시트 한 장 예시에서 반대쪽을 보게 그려 둔 프레임 번호
const PAL = { bg0: '#0c1814', bg1: '#15271f', ink: '#e8f1ea', muted: '#86a091', accent: '#7fe0a8', accent2: '#e8d27a', surface: '#12231c', line: 'rgba(134,160,145,.28)' };
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif';
const S = 1.3, BASE = 226, X0 = 28, W = 584, TOP = 46, PH = 206;   // 그림 배율, 발 기준선 y, 줄 영역
const NAMES = ['접지', '내림', '통과', '올림'];
const STEP = ['시트 한 장에 요청', '프레임마다 포즈 하나씩', '코드가 발 기준선에 조립'];
const HEAD = ['한 걸음을 한 장에 그려 달라고 한 줄', '포즈마다 따로 요청한 낱장', '낱장을 발 기준선에 맞춰 한 줄로 조립'];
const DEG = Math.PI / 180;

const mix = (a, b, t) => {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)), x = p(a), y = p(b);
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
};
const HOOD = PAL.accent, PANTS = mix(PAL.bg1, PAL.ink, 0.38), SKIN = mix(PAL.accent2, PAL.ink, 0.5), HAIR = mix(PAL.bg0, PAL.ink, 0.22), SHOE = mix(PAL.bg0, PAL.ink, 0.8);

// 포즈 네 개: 가까운 다리 허벅지·무릎, 먼 다리 허벅지·무릎, 가까운 팔, 먼 팔(도). 앞쪽이 +. 뒤 네 개는 좌우를 바꾼 것
const POSE4 = [[22, 0, -18, 4, -22, 22], [12, 32, -12, 38, -14, 14], [0, 0, 20, 50, -3, 3], [-10, 6, 26, 6, 12, -12]];
function poseOf(k) {
  const q = POSE4[k % 4].map((v) => v * STRIDE);
  return k >= 4 ? { nT: q[2], nK: q[3], fT: q[0], fK: q[1], nA: q[5], fA: q[4] } : { nT: q[0], nK: q[1], fT: q[2], fK: q[3], nA: q[4], fA: q[5] };
}
const leg = (T, K) => { const kx = 26 * Math.sin(T * DEG), ky = 26 * Math.cos(T * DEG); return [kx, ky, kx + 26 * Math.sin((T - K) * DEG), ky + 26 * Math.cos((T - K) * DEG)]; };

let MC = null, MK = '';
function metrics() {      // 프레임별 키, 키 차이, 발 기준선에 맞추지 않았을 때의 발 위치를 계산한다
  const key = FRAMES + '|' + STRIDE;
  if (MK === key) return MC;
  const n = FRAMES, idx = [], P = [], H = [];
  for (let i = 0; i < n; i++) {
    const k = Math.floor(i * 8 / n), p = poseOf(k), a = leg(p.nT, p.nK), b = leg(p.fT, p.fK);
    idx.push(k); P.push(p); H.push(Math.max(a[3], b[3]) + 57);
  }
  const hs = [...H].sort((x, y) => x - y), med = (hs[(n - 1) >> 1] + hs[n >> 1]) / 2;
  const mean = H.reduce((s, v) => s + v, 0) / n, U = H.map((h) => BASE - mean * S + h * S);
  const spread = (Math.max(...H) - Math.min(...H)) * S, diff = (Math.max(...H) - Math.min(...H)) / med;
  const flips = Array.from({ length: n }, (_, i) => FLIPS.includes(i));
  MK = key; MC = { n, idx, P, H, U, spread, diff, flips, mism: flips.filter(Boolean).length };
  return MC;
}

function limb(g, pts, w, col, fc) {
  g.lineCap = 'round'; g.lineJoin = 'round';
  g.strokeStyle = col; g.lineWidth = w; g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.stroke();
  g.save(); g.translate(-fc * 1.3, -0.4); g.strokeStyle = mix(col, '#ffffff', 0.38); g.globalAlpha *= 0.55; g.lineWidth = w * 0.26;
  g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.stroke(); g.restore();
}
function figure(g, P, x, gy, fc, alpha) {      // 옆모습 인물을 코드로 그린다(발이 gy 에 닿는다). 빛은 왼쪽 위
  const a = leg(P.nT, P.nK), b = leg(P.fT, P.fK), hh = Math.max(a[3], b[3]), hy = -hh;
  g.save(); g.globalAlpha = alpha; g.translate(x, gy); g.scale(fc * S, S);
  const sh = g.createRadialGradient(0, 0, 0, 0, 0, 24); sh.addColorStop(0, 'rgba(0,0,0,.5)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
  g.save(); g.scale(1, 0.17); g.fillStyle = sh; g.beginPath(); g.arc(0, 0, 24, 0, 7); g.fill(); g.restore();
  const arm = (ang, col) => {
    const sx = 2, sy = hy - 30, ex = sx + 15 * Math.sin(ang * DEG), ey = sy + 15 * Math.cos(ang * DEG);
    const hx = ex + 14 * Math.sin((ang + 25) * DEG), hy2 = ey + 14 * Math.cos((ang + 25) * DEG);
    limb(g, [[sx, sy], [ex, ey], [hx, hy2]], 5.4, col, fc); g.fillStyle = col === HOOD ? SKIN : mix(SKIN, '#000000', 0.35); g.beginPath(); g.arc(hx, hy2, 3, 0, 7); g.fill();
  };
  const legDraw = (L, T, col, shoe) => {
    limb(g, [[0, hy], [L[0], hy + L[1]], [L[2], hy + L[3]]], 7.2, col, fc);
    g.fillStyle = shoe; g.beginPath(); g.ellipse(L[2] + 3.2, hy + L[3] + 0.5, 6.4, 3.2, 0, 0, 7); g.fill();
  };
  arm(P.fA, mix(HOOD, '#000000', 0.45)); legDraw(b, P.fT, mix(PANTS, '#000000', 0.4), mix(SHOE, '#000000', 0.45));
  g.save(); g.translate(0, hy); g.rotate(4 * DEG);
  const tg = g.createLinearGradient(-fc * 8, 0, fc * 8, 0); tg.addColorStop(0, mix(HOOD, '#ffffff', 0.3)); tg.addColorStop(1, mix(HOOD, '#000000', 0.38));
  g.fillStyle = mix(HOOD, '#000000', 0.5); g.beginPath(); g.arc(-5.5, -33, 6, 0, 7); g.fill();
  g.fillStyle = tg; g.beginPath(); g.roundRect(-8, -35, 16, 38, 6); g.fill();
  g.strokeStyle = 'rgba(0,0,0,.22)'; g.lineWidth = 1; g.beginPath(); g.moveTo(-8, -3); g.lineTo(8, -3); g.stroke(); g.restore();
  const hcx = 3, hcy = hy - 47, hg = g.createRadialGradient(hcx - fc * 3.5, hcy - 4, 1, hcx, hcy, 12); hg.addColorStop(0, mix(SKIN, '#ffffff', 0.35)); hg.addColorStop(1, mix(SKIN, '#000000', 0.3));
  g.fillStyle = hg; g.beginPath(); g.arc(hcx, hcy, 11, 0, 7); g.fill();
  g.fillStyle = HAIR; g.beginPath(); g.arc(hcx, hcy, 11.6, Math.PI * 0.98, Math.PI * 1.98); g.lineTo(hcx - 11, hcy - 1); g.fill();
  g.fillStyle = HAIR; g.beginPath(); g.arc(hcx - 6, hcy - 2, 6, 0, 7); g.fill();
  g.fillStyle = '#10201a'; g.beginPath(); g.arc(hcx + 6, hcy + 0.5, 1.5, 0, 7); g.fill();
  legDraw(a, P.nT, PANTS, SHOE); arm(P.nA, HOOD);
  g.restore();
}

function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function card(x, X, Y, W2, H2, a) {      // 반투명 사각형을 겹쳐 그림자를 만든 카드
  x.save(); x.globalAlpha = a;
  x.fillStyle = 'rgba(0,0,0,.18)'; x.beginPath(); x.roundRect(X + 1, Y + 4, W2, H2, 8); x.fill();
  x.fillStyle = 'rgba(0,0,0,.14)'; x.beginPath(); x.roundRect(X, Y + 2, W2, H2, 8); x.fill();
  const g = x.createLinearGradient(0, Y, 0, Y + H2); g.addColorStop(0, mix(PAL.surface, '#ffffff', 0.05)); g.addColorStop(1, PAL.surface);
  x.fillStyle = g; x.beginPath(); x.roundRect(X, Y, W2, H2, 8); x.fill(); x.strokeStyle = PAL.line; x.lineWidth = 1; x.stroke(); x.restore();
}
let GRAIN = null;

const demo = {
  dur: 6.8, rest: 6.8, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(7), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const cap = el('div', null, sp);      // 이름표(caption-bl): 왼쪽 아래, 배경 없이 위에 얇은 선
    Object.assign(cap.style, { position: 'absolute', left: '28px', bottom: '12px', paddingTop: '6px', borderTop: `1px solid ${PAL.line}`, whiteSpace: 'nowrap', color: PAL.muted, font: "500 12px/1 'JetBrains Mono','IBM Plex Sans KR',monospace", zIndex: '4' });
    return { main, cap };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 1 : (lv == null ? 3 : lv), M = metrics(), n = M.n, cw = W / n, x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.1;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();
    T(x, HEAD[L - 1], X0, 30, 14, PAL.ink, 600);
    const split = L >= 2 ? (L === 2 ? E.inOutC(seg(t, 0.2, 1.1)) : 1) : 0, gap = 8 * split;
    if (split < 1) card(x, X0, TOP, W, PH, 1 - split);
    let aligned = 0, alMin = 1;
    for (let i = 0; i < n; i++) {
      const cx0 = X0 + i * cw, intro = L === 1 ? E.outC(seg(t, 0.05 + i * 0.07, 0.55 + i * 0.07)) : 1;
      if (split > 0) card(x, cx0 + gap / 2, TOP, cw - gap, PH, split);
      const al = L === 3 && ALIGN_FEET ? E.outBack(seg(t, 0.9 + i * 0.09, 1.7 + i * 0.09)) : 0;
      aligned = Math.max(aligned, al); alMin = Math.min(alMin, Math.min(1, al));
      const fy = L === 1 ? BASE : L === 2 ? lerp(BASE, M.U[i], split) : lerp(M.U[i], BASE, al);
      const fc = (L === 1 && M.flips[i] ? -FACING : FACING);
      figure(x, M.P[i], cx0 + cw / 2, fy, fc, intro);
      if (L === 1 && M.flips[i] && intro > 0.9) {
        x.strokeStyle = PAL.accent2; x.lineWidth = 2; x.beginPath(); x.moveTo(cx0 + cw / 2 - 15, BASE + 9); x.lineTo(cx0 + cw / 2 + 15, BASE + 9); x.stroke();
        T(x, '반대', cx0 + cw / 2, BASE + 22, 10, PAL.accent2, 600, 'center');
      }
      if (split > 0.4) { x.globalAlpha = split; T(x, `${i + 1} ${NAMES[M.idx[i] % 4]}`, cx0 + gap / 2 + 7, TOP + 20, 11, PAL.muted, 600, 'left', MONO); x.globalAlpha = 1; }
      if (L === 3 && t > 3.4 && ((Math.floor((t - 3.4) * 6) % n) === i)) {
        x.strokeStyle = PAL.accent; x.lineWidth = 2; x.beginPath(); x.roundRect(cx0 + gap / 2, TOP, cw - gap, PH, 8); x.stroke();
      }
    }
    if (aligned > 0) {
      x.save(); x.globalAlpha = Math.min(1, aligned); x.strokeStyle = PAL.accent; x.lineWidth = 1.5; x.setLineDash([5, 4]);
      x.beginPath(); x.moveTo(X0, BASE + 0.5); x.lineTo(X0 + W, BASE + 0.5); x.stroke(); x.restore();
    }
    // 아래 값 세 개: 코드가 이 장면에서 계산한다
    const feet = L === 3 && ALIGN_FEET ? M.spread * (1 - alMin) : M.spread, ok = L > 1;
    const cols = [
      ['요청 횟수', L === 1 ? '1회' : `${n}회`, PAL.accent, L === 1 ? '시트 한 장에 몰아서' : '포즈마다 한 번씩'],
      ['방향 일치', `${ok ? n : n - M.mism}/${n}`, ok || M.mism === 0 ? PAL.accent : PAL.accent2, '같은 쪽을 본 프레임'],
      ['발 어긋남', L === 1 ? '—' : `${feet.toFixed(0)}px`, L === 1 ? PAL.muted : feet < 0.5 ? PAL.accent : PAL.accent2, L === 1 ? '낱장이 아니라 잴 수 없음' : `프레임 키 차이 최대 ${(M.diff * 100).toFixed(1)}%`],
    ];
    cols.forEach(([name, val, col, note], k) => {
      const X = X0 + k * 196;
      T(x, name, X, 276, 11, PAL.ink, 600); T(x, val, X, 298, 22, col, 700, 'left', MONO); T(x, note, X, 312, 10, PAL.muted, 500);
    });
    s.cap.textContent = `0${L}  ${STEP[L - 1]}  ·  코드로 그린 예시 그림`;
  },
};
export default demo;
