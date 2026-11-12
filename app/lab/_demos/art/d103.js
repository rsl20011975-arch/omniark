/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/delay-hold-loop/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 시간을 다루는 값 세 가지: 지연(기다렸다 시작) · 홀드(가다 멈춤) · 루프(반복). 화면은 시간 t 의 함수다.
const DELAY = .8;                 // 지연: 시작 신호 뒤 기다리는 시간(초)
const HOLD = .7;                  // 홀드: 중간에 멈춰 있는 시간(초)
const LOOPS = 3;                  // 루프: 왕복 반복 횟수
const T0 = .4, CYC = 1.2;
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);
const DURT = 6.4;
const W = 560;                                    // 시간 막대 폭(px) = 전체 6.4초
const tx = (t) => (t / DURT) * W;
const HATCH = 'repeating-linear-gradient(135deg, rgba(255,255,255,.55) 0 4px, rgba(255,255,255,.12) 4px 8px)';

function panel(sp, y, title, css, color) {
  const p = el('div', null, sp);
  box(p, { position: 'absolute', left: '14px', top: y + 'px', width: '612px', height: '104px', borderRadius: '10px', background: 'rgba(255,255,255,.045)', border: '1px solid rgba(255,255,255,.09)' });
  const nm = el('div', null, p, title);
  box(nm, { position: 'absolute', left: '14px', top: '10px', font: "700 14px/1 'IBM Plex Sans KR',sans-serif", color: '#fff' });
  const cs = el('div', null, p, css);
  box(cs, { position: 'absolute', left: '14px', top: '30px', font: "500 11px/1 'JetBrains Mono',monospace", color: 'rgba(255,255,255,.5)' });
  const val = el('div', null, p, '');
  box(val, { position: 'absolute', right: '14px', top: '12px', font: "500 12px/1 'JetBrains Mono',monospace", color });
  const track = el('div', null, p);
  box(track, { position: 'absolute', left: '40px', top: '56px', width: '532px', height: '2px', background: 'rgba(255,255,255,.14)' });
  const ball = el('div', null, p);
  box(ball, { position: 'absolute', top: '45px', width: '24px', height: '24px', borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #fff, ${color} 62%)`, boxShadow: '0 4px 10px rgba(0,0,0,.45)' });
  const bar = el('div', null, p);
  box(bar, { position: 'absolute', left: '26px', top: '86px', width: W + 'px', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,.12)', overflow: 'hidden' });
  const head = el('div', null, p);
  box(head, { position: 'absolute', top: '82px', width: '3px', height: '16px', borderRadius: '2px', background: '#fff', boxShadow: '0 0 8px rgba(255,255,255,.7)' });
  return { p, val, ball, bar, head };
}
function seg2(bar, t0, t1, bg) {
  const d = el('div', null, bar);
  box(d, { position: 'absolute', top: '0', height: '8px', left: tx(t0) + 'px', width: Math.max(1, tx(t1) - tx(t0)) + 'px', background: bg });
}

const demo = {
  dur: DURT, rest: 5.6, noCompare: false, levels: 4,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: 'linear-gradient(160deg,#0b0f1a 0%,#161d30 100%)' });
    const gr = el('div', null, bg);
    box(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.06', mixBlendMode: 'overlay' });
    const A = panel(sp, 12, '지연 · 기다렸다 시작', 'animation-delay', '#7fd6ff');
    const B = panel(sp, 124, '홀드 · 가다가 멈춤', 'keyframe 사이의 정지', '#ffe27a');
    const C = panel(sp, 236, '루프 · 왕복 반복', 'animation-iteration-count', '#c79bff');
    return { A, B, C };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 4 : lv);   // 1 = 모두 한 번에 바로, 2 = + 지연, 3 = + 홀드, 4 = + 루프
    const dly = L >= 2 ? DELAY : 0, hld = L >= 3 ? HOLD : 0, lps = L >= 4 ? LOOPS : 1;
    const X0 = 40, X1 = 40 + 532 - 24;
    // 시간 막대와 구간은 매번 다시 그린다(값이 바뀌면 구간이 달라지므로)
    [s.A, s.B, s.C].forEach((r) => { r.bar.innerHTML = ''; });
    // A: 지연
    const aS = T0 + dly, aE = aS + 1.2;
    if (dly > 0) seg2(s.A.bar, T0, aS, HATCH);
    seg2(s.A.bar, aS, aE, '#7fd6ff');
    s.A.ball.style.left = (X0 + E.outC(seg(t, aS, aE)) * (X1 - X0)) + 'px';
    s.A.val.textContent = dly > 0 ? `기다림 ${dly.toFixed(1)}초 → 이동 1.2초` : '기다림 없이 바로 이동 1.2초';
    // B: 홀드
    const b1 = T0 + 1.0, b2 = b1 + hld, b3 = b2 + 1.0;
    seg2(s.B.bar, T0, b1, '#ffe27a');
    if (hld > 0) seg2(s.B.bar, b1, b2, HATCH);
    seg2(s.B.bar, b2, b3, '#ffe27a');
    const mid = X0 + (X1 - X0) * .5;
    let bx;
    if (hld > 0) bx = t < b2 ? lerp(X0, mid, E.outC(seg(t, T0, b1))) : lerp(mid, X1, E.outC(seg(t, b2, b3)));
    else bx = lerp(X0, X1, E.inOutC(seg(t, T0, T0 + 2.0)));
    s.B.ball.style.left = bx + 'px';
    s.B.val.textContent = hld > 0 ? `중간에 ${hld.toFixed(1)}초 멈춤` : '멈춤 없이 쭉 이동';
    // C: 루프
    for (let i = 0; i < lps; i++) seg2(s.C.bar, T0 + i * CYC, T0 + (i + 1) * CYC, i % 2 ? 'rgba(199,155,255,.55)' : '#c79bff');
    const cyc = Math.min(lps - 1, Math.max(0, Math.floor((t - T0) / CYC)));
    const ph = seg(t, T0 + cyc * CYC, T0 + (cyc + 1) * CYC);
    const pp = ph < .5 ? ph * 2 : 2 - ph * 2;
    const cx = t >= T0 + lps * CYC ? 0 : E.inOutC(pp);
    s.C.ball.style.left = (X0 + cx * (X1 - X0)) + 'px';
    s.C.val.textContent = lps > 1 ? `반복 ${Math.min(lps, cyc + 1)}/${lps}번` : '한 번만 움직임';
    [s.A, s.B, s.C].forEach((r) => { r.head.style.left = (26 + tx(t) - 1) + 'px'; });
  },
};
export default demo;
