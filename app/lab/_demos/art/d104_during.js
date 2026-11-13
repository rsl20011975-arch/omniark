/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/secondary-action/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

const PAL = { bg0: '#171615', bg1: '#232120', ink: '#f2efe9', muted: '#9a958c', accent: '#5ad1c8', accent2: '#f2b84b', surface: '#1f1d1b', line: '#3a3733' };
const rgba = (h, a) => `rgba(${parseInt(h.slice(1, 3), 16)},${parseInt(h.slice(3, 5), 16)},${parseInt(h.slice(5, 7), 16)},${a})`;

// 주인공 동작(카드가 떨어져 착지) 하나에, 그것을 거드는 보조 동작(고리·배지·빛줄기·반짝임)을 착지 직후에만 얹는다. 화면은 시간 t 의 함수다.
const SEC = 1;                    // 보조 동작의 세기 배율(1 = 100%)
const SEC_DURING = 1;             // 1 이면 보조 동작이 카드가 떨어지는 동안에도 일어난다(주인공을 가린다)
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
    box(bg, { position: 'absolute', inset: '0', background: `linear-gradient(160deg,${PAL.bg0} 0%,${PAL.bg1} 100%)`, overflow: 'hidden' });
    const gl = el('div', null, bg);
    box(gl, { position: 'absolute', inset: '0', background: 'radial-gradient(circle at 50% 70%, rgba(242,150,60,.16), transparent 55%)' });
    const gr = el('div', null, bg);
    box(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.06', mixBlendMode: 'overlay' });
    const ground = el('div', null, sp);
    box(ground, { position: 'absolute', left: '40px', right: '40px', top: (CY + CH / 2 + 18) + 'px', height: '2px', background: PAL.line });
    const shadow = el('div', null, sp);
    box(shadow, { position: 'absolute', left: (CX - CW / 2) + 'px', top: (CY + CH / 2 + 8) + 'px', width: CW + 'px', height: '18px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,0,0,.55), transparent 70%)' });
    const ring = el('div', null, sp);
    box(ring, { position: 'absolute', left: (CX - CW / 2) + 'px', top: (CY + CH / 2 + 10) + 'px', width: CW + 'px', height: '14px', borderRadius: '50%', border: `2px solid ${rgba(PAL.accent2, .95)}`, opacity: '0' });
    const card = el('div', null, sp);
    box(card, { position: 'absolute', left: (CX - CW / 2) + 'px', width: CW + 'px', height: CH + 'px', borderRadius: '14px', background: `linear-gradient(160deg,#34312d 0%,${PAL.surface} 100%)`, border: `1px solid ${PAL.line}`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,.18), 0 18px 32px rgba(0,0,0,.45)', overflow: 'hidden' });
    const bar = el('div', null, card);
    box(bar, { position: 'absolute', left: '0', top: '0', bottom: '0', width: '8px', background: `linear-gradient(180deg,${PAL.accent2},#e8803a)` });
    const t1 = el('div', null, card, '새 구독자 3명');
    box(t1, { position: 'absolute', left: '28px', top: '30px', font: "700 24px/1.2 'IBM Plex Sans KR',sans-serif", color: PAL.ink });
    const t2 = el('div', null, card, '방금 · 채널을 구독했어요');
    box(t2, { position: 'absolute', left: '28px', top: '66px', font: "500 15px/1.2 'IBM Plex Sans KR',sans-serif", color: PAL.muted });
    const sweep = el('div', null, card);
    box(sweep, { position: 'absolute', top: '-20px', width: '70px', height: (CH + 40) + 'px', background: 'linear-gradient(100deg, transparent, rgba(255,255,255,.55), transparent)', transform: 'skewX(-18deg)', opacity: '0' });
    const badge = el('div', null, sp, '+3');
    box(badge, { position: 'absolute', left: (CX + CW / 2 - 30) + 'px', width: '46px', height: '46px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #ffe3a8, #e8803a 68%)', boxShadow: '0 6px 14px rgba(0,0,0,.45)', color: '#2a1208', font: "400 22px/46px 'Black Han Sans',sans-serif", textAlign: 'center', opacity: '0' });
    const sparks = SPARKS.map(() => {
      const d = el('div', null, sp);
      box(d, { position: 'absolute', width: '9px', height: '9px', borderRadius: '50%', background: 'radial-gradient(circle, #fff, rgba(242,184,75,.9) 55%, transparent 75%)', opacity: '0' });
      return d;
    });
    const pill = el('div', null, sp);   // 이름표(vertical): 왼쪽 가장자리 세로쓰기, 지금 구간만 ink
    box(pill, { position: 'absolute', left: '14px', top: '16px', display: 'flex', flexDirection: 'row', writingMode: 'vertical-rl', gap: '16px', font: "500 12px/1 'IBM Plex Sans KR',sans-serif", letterSpacing: '.14em' });
    const items = ['', ''].map(() => { const e = el('span', null, pill, ''); box(e, { whiteSpace: 'nowrap' }); return e; });
    return { card, shadow, ring, sweep, badge, sparks, pill, items };
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
    s.items[0].textContent = '주인공 동작';
    s.items[1].textContent = on2 ? '보조 동작' : '보조 없음';
    const act0 = t < TL || (!on2), act1 = on2 && (t >= TL || SEC_DURING === 1);
    [act0 ? 1 : 0, act1 ? 1 : 0].forEach((v, i) => { s.items[i].style.color = v ? PAL.ink : PAL.muted; s.items[i].style.fontWeight = v ? '700' : '500'; });
  },
};
export default demo;
