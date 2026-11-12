/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/secondary-action/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 주인공 동작(카드가 떨어져 착지) 하나에, 그것을 거드는 보조 동작(고리·배지·빛줄기·반짝임)을 착지 직후에만 얹는다. 화면은 시간 t 의 함수다.
const SEC = 1.8;                    // 보조 동작의 세기 배율(1 = 100%)
const SEC_DURING = 0;             // 1 이면 보조 동작이 카드가 떨어지는 동안에도 일어난다(주인공을 가린다)
const T0 = .4, FALL = .8;
const TL = T0 + FALL;             // 착지 시각
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);
const CX = 320, CY = 178, CW = 268, CH = 112;
const SPARKS = [[-1, -.55], [-.62, -1], [0, -1.15], [.62, -1], [1, -.55], [.1, -.35]];

const demo = {
  dur: 3.4, rest: 2.6, noCompare: false, levels: 3,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: 'linear-gradient(160deg,#0b0f1a 0%,#1a2238 100%)', overflow: 'hidden' });
    const gl = el('div', null, bg);
    box(gl, { position: 'absolute', inset: '0', background: 'radial-gradient(circle at 50% 70%, rgba(255,150,80,.18), transparent 55%)' });
    const gr = el('div', null, bg);
    box(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.06', mixBlendMode: 'overlay' });
    const ground = el('div', null, sp);
    box(ground, { position: 'absolute', left: '40px', right: '40px', top: (CY + CH / 2 + 18) + 'px', height: '2px', background: 'rgba(255,255,255,.14)' });
    const shadow = el('div', null, sp);
    box(shadow, { position: 'absolute', left: (CX - CW / 2) + 'px', top: (CY + CH / 2 + 8) + 'px', width: CW + 'px', height: '18px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,0,0,.55), transparent 70%)' });
    const ring = el('div', null, sp);
    box(ring, { position: 'absolute', left: (CX - CW / 2) + 'px', top: (CY + CH / 2 + 10) + 'px', width: CW + 'px', height: '14px', borderRadius: '50%', border: '2px solid rgba(255,190,120,.9)', opacity: '0' });
    const card = el('div', null, sp);
    box(card, { position: 'absolute', left: (CX - CW / 2) + 'px', width: CW + 'px', height: CH + 'px', borderRadius: '14px', background: 'linear-gradient(160deg,#2b3550 0%,#1b2238 100%)', border: '1px solid rgba(255,255,255,.14)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.18), 0 18px 32px rgba(0,0,0,.45)', overflow: 'hidden' });
    const bar = el('div', null, card);
    box(bar, { position: 'absolute', left: '0', top: '0', bottom: '0', width: '8px', background: 'linear-gradient(180deg,#ffb36b,#ff6a4d)' });
    const t1 = el('div', null, card, '새 구독자 3명');
    box(t1, { position: 'absolute', left: '28px', top: '30px', font: "700 24px/1.2 'IBM Plex Sans KR',sans-serif", color: '#fff' });
    const t2 = el('div', null, card, '방금 · 채널을 구독했어요');
    box(t2, { position: 'absolute', left: '28px', top: '66px', font: "500 15px/1.2 'IBM Plex Sans KR',sans-serif", color: 'rgba(255,255,255,.65)' });
    const sweep = el('div', null, card);
    box(sweep, { position: 'absolute', top: '-20px', width: '70px', height: (CH + 40) + 'px', background: 'linear-gradient(100deg, transparent, rgba(255,255,255,.55), transparent)', transform: 'skewX(-18deg)', opacity: '0' });
    const badge = el('div', null, sp, '+3');
    box(badge, { position: 'absolute', left: (CX + CW / 2 - 30) + 'px', width: '46px', height: '46px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #ffd9b0, #ff7a4d 68%)', boxShadow: '0 6px 14px rgba(0,0,0,.45)', color: '#2a1208', font: "400 22px/46px 'Black Han Sans',sans-serif", textAlign: 'center', opacity: '0' });
    const sparks = SPARKS.map(() => {
      const d = el('div', null, sp);
      box(d, { position: 'absolute', width: '9px', height: '9px', borderRadius: '50%', background: 'radial-gradient(circle, #fff, rgba(255,200,130,.9) 55%, transparent 75%)', opacity: '0' });
      return d;
    });
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', top: '18px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.66)', color: '#fff', font: "500 15px/1 'IBM Plex Sans KR',sans-serif" });
    return { card, shadow, ring, sweep, badge, sparks, pill };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 주인공만, 2 = + 착지 보조(고리·반짝임), 3 = + 배지·빛줄기
    const p = E.outC(seg(t, T0, TL));
    const y = lerp(-CH - 30, CY - CH / 2, p);
    s.card.style.top = y + 'px';
    s.shadow.style.opacity = (.25 + .75 * p).toFixed(2);
    s.shadow.style.transform = `scaleX(${(.7 + .3 * p).toFixed(2)})`;
    // 보조 동작이 일어나는 시작 시각: 기본은 착지 직후, SEC_DURING 이 1 이면 카드가 떨어지기 시작할 때부터
    const sa = SEC_DURING ? T0 : TL;
    const q = (d) => seg(t, sa, sa + d);
    const on2 = L >= 2, on3 = L >= 3, k = SEC;
    const rq = q(.5);
    s.ring.style.opacity = on2 ? (k * (1 - rq) * (rq > 0 ? .9 : 0)).toFixed(2) : '0';
    s.ring.style.transform = `scale(${(1 + rq * .45 * k).toFixed(3)})`;
    s.sparks.forEach((d, i) => {
      const sq = q(.5);
      const x = CX + SPARKS[i][0] * 120 * sq * k, yy = CY + CH / 2 + 18 + SPARKS[i][1] * 18 * sq * k;   // 바닥선 높이에서 옆으로 퍼진다
      d.style.left = (x - 4.5) + 'px'; d.style.top = (yy - 4.5) + 'px';
      d.style.opacity = on2 ? ((1 - sq) * (sq > 0 ? 1 : 0)).toFixed(2) : '0';
    });
    const bq = seg(t, sa + .1, sa + .5);
    s.badge.style.top = (y - 18) + 'px';
    s.badge.style.transform = `scale(${(on3 ? E.outBack(bq) * k : 0).toFixed(3)})`;
    s.badge.style.opacity = on3 && bq > 0 ? '1' : '0';
    const wq = seg(t, sa + .2, sa + .8);
    s.sweep.style.left = lerp(-80, CW + 30, E.inOutC(wq)) + 'px';
    s.sweep.style.opacity = on3 && wq > 0 && wq < 1 ? Math.min(1, k).toFixed(2) : '0';
    s.pill.textContent = !on2 ? '주인공 동작만 · 떨어져서 착지' : (t < TL ? '주인공: 카드가 떨어짐' + (SEC_DURING ? ' (보조도 같이 움직임)' : '') : '보조 동작: 착지 직후에만');
  },
};
export default demo;
