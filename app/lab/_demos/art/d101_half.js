/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/animatable-properties/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 같은 카드 한 장이 12칸에서 서로 다른 값 하나만 바꿔 왕복한다. 화면은 시간 t 의 함수다.
const PERIOD = 2.4;               // 한 번 왕복(갔다 오기)에 걸리는 시간(초)
const AMP = 0.5;                    // 변화 폭의 배율. 1 이면 기본 폭 100%
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);
const mix = (a, b, p) => `rgb(${a.map((x, i) => Math.round(lerp(x, b[i], p))).join(',')})`;

// 칸마다: 한글 이름, CSS 이름, 묶음(1 = 움직임 변형, 2 = 겉모습, 3 = 모양), 값을 카드에 적용하는 함수(v: 0~1, a: 폭 배율)와 보여 줄 값 문자열
const CELLS = [
  { n: '위치', css: 'translate', g: 1, f: (c, v, a) => { const x = (v - .5) * 80 * a; c.style.transform = `translateX(${x.toFixed(1)}px)`; return `translateX(${x.toFixed(0)}px)`; } },
  { n: '크기', css: 'scale', g: 1, f: (c, v, a) => { const k = 1 + (lerp(.7, 1.25, v) - 1) * a; c.style.transform = `scale(${k.toFixed(2)})`; return `scale(${k.toFixed(2)})`; } },
  { n: '회전', css: 'rotate', g: 1, f: (c, v, a) => { const d = (v - .5) * 70 * a; c.style.transform = `rotate(${d.toFixed(0)}deg)`; return `rotate(${d.toFixed(0)}deg)`; } },
  { n: '기울임', css: 'skew', g: 1, f: (c, v, a) => { const d = (v - .5) * 48 * a; c.style.transform = `skewX(${d.toFixed(0)}deg)`; return `skewX(${d.toFixed(0)}deg)`; } },
  { n: '투명도', css: 'opacity', g: 2, f: (c, v, a) => { const o = 1 - (1 - lerp(.15, 1, v)) * a; c.style.opacity = o.toFixed(2); return `opacity: ${o.toFixed(2)}`; } },
  { n: '블러', css: 'filter: blur', g: 2, f: (c, v, a) => { const b = (1 - v) * 6 * a; c.style.filter = `blur(${b.toFixed(1)}px)`; return `blur(${b.toFixed(1)}px)`; } },
  { n: '필터', css: 'filter', g: 2, f: (c, v, a) => { const h = v * 120 * a, br = 1 + v * .3 * a; c.style.filter = `hue-rotate(${h.toFixed(0)}deg) brightness(${br.toFixed(2)})`; return `hue-rotate(${h.toFixed(0)}deg)`; } },
  { n: '색', css: 'background-color', g: 2, f: (c, v, a) => { const col = mix([111, 211, 255], [255, 138, 61], v * a); c.style.background = col; c.style.backgroundImage = 'none'; return col.replace('rgb', 'rgb'); } },
  { n: '클립', css: 'clip-path', g: 3, f: (c, v, a) => { const i = 50 * (1 - v * a); c.style.clipPath = `inset(${i.toFixed(0)}%)`; return `inset(${i.toFixed(0)}%)`; } },
  { n: '너비·높이', css: 'width', g: 3, f: (c, v, a) => { const w = lerp(24, 70, 1 - (1 - v) * a); c.style.width = `${w.toFixed(0)}px`; return `width: ${w.toFixed(0)}px`; } },
  { n: '둥근 모서리', css: 'border-radius', g: 3, f: (c, v, a) => { const r = v * 50 * a; c.style.borderRadius = `${r.toFixed(0)}%`; return `radius: ${r.toFixed(0)}%`; } },
  { n: '변형 기준점', css: 'transform-origin', g: 1, f: (c, v, a, pv) => { const d = (v - .5) * 60 * a; c.style.transformOrigin = '0% 0%'; c.style.transform = `rotate(${d.toFixed(0)}deg)`; pv.style.opacity = 1; return `origin 0% 0%`; } },
];

const demo = {
  dur: 4.8, rest: 1.2, noCompare: false, levels: 4,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: 'linear-gradient(160deg,#0b0f1a 0%,#171f33 100%)' });
    const gr = el('div', null, bg);
    box(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.06', mixBlendMode: 'overlay' });
    const cells = CELLS.map((d, i) => {
      const col = i % 4, row = Math.floor(i / 4);
      const t = el('div', null, sp);
      box(t, { position: 'absolute', left: (14 + col * 156) + 'px', top: (14 + row * 114) + 'px', width: '144px', height: '102px', borderRadius: '10px', background: 'rgba(255,255,255,.045)', border: '1px solid rgba(255,255,255,.09)', overflow: 'hidden' });
      const stage = el('div', null, t);
      box(stage, { position: 'absolute', left: '0', top: '0', width: '144px', height: '52px' });
      const card = el('div', null, stage);
      box(card, { position: 'absolute', left: '50px', top: '10px', width: '44px', height: '32px', borderRadius: '8px', background: 'linear-gradient(150deg,#8fe0ff 0%,#6f7bff 100%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.55), 0 6px 14px rgba(0,0,0,.4)', transformOrigin: '50% 50%' });
      const line = el('div', null, card);
      box(line, { position: 'absolute', left: '7px', top: '8px', right: '12px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,.75)' });
      const pv = el('div', null, stage);
      box(pv, { position: 'absolute', left: '47px', top: '7px', width: '7px', height: '7px', borderRadius: '50%', background: '#ffb347', boxShadow: '0 0 8px #ffb347', opacity: '0' });
      const nm = el('div', null, t, d.n);
      box(nm, { position: 'absolute', left: '10px', top: '55px', font: "700 13px/1 'IBM Plex Sans KR',sans-serif", color: '#fff' });
      const cs = el('div', null, t, d.css);
      box(cs, { position: 'absolute', left: '10px', top: '72px', font: "500 10.5px/1 'JetBrains Mono',monospace", color: 'rgba(255,255,255,.55)' });
      const val = el('div', null, t, '');
      box(val, { position: 'absolute', left: '10px', top: '86px', font: "500 10.5px/1 'JetBrains Mono',monospace", color: '#ffb347' });
      return { card, pv, nm, cs, val, t };
    });
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '0', right: '0', bottom: '3px', textAlign: 'center', font: "500 11px/1 'IBM Plex Sans KR',sans-serif", color: 'rgba(255,255,255,.7)' });
    return { cells, pill };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 4 : lv);   // 1 = 투명도만, 2 = + 움직임 변형, 3 = + 겉모습, 4 = + 모양
    const ph = (t % (2 * PERIOD)) / PERIOD;
    const v = E.inOutC(ph <= 1 ? ph : 2 - ph);  // 갔다가 돌아오는 0 → 1 → 0
    CELLS.forEach((d, i) => {
      const c = s.cells[i];
      const on = L >= 2 && d.g === 1 || L >= 3 && d.g === 2 || L >= 4 && d.g === 3 || d.css === 'opacity';
      ['transform', 'opacity', 'filter', 'clipPath', 'borderRadius', 'transformOrigin'].forEach((p) => { c.card.style[p] = ''; });
      c.card.style.width = '44px';
      c.card.style.background = 'linear-gradient(150deg,#8fe0ff 0%,#6f7bff 100%)';
      c.pv.style.opacity = '0';
      if (on) {
        c.val.textContent = d.f(c.card, v, AMP, c.pv);
        c.cs.style.color = 'rgba(255,255,255,.55)'; c.val.style.color = '#ffb347';
      } else {                                   // 아직 이 칸의 값을 안 쓰는 단계: 투명도만 바뀐다
        const o = lerp(.15, 1, v);
        c.card.style.opacity = o.toFixed(2);
        c.val.textContent = `opacity: ${o.toFixed(2)}`;
        c.cs.style.color = 'rgba(255,255,255,.3)'; c.val.style.color = 'rgba(255,255,255,.4)';
      }
    });
    s.pill.textContent = L <= 1 ? '연출 전 · 12칸 모두 투명도만 바뀜' : `한 칸에 한 가지 값만 바뀜 · 한 번 왕복 ${PERIOD}초`;
  },
};
export default demo;
