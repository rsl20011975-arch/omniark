/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/defocus-transition/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, E, el } from "./helpers.js";

// 초점이 풀려 흐려진 뒤 다음 장면에서 다시 맞춰진다. 가장 흐린 순간에 장면이 바뀐다. 화면은 시간 t 의 함수다.
const T0 = 1.2, DUR = 1.6;       // 시작 시각 · 전체 길이(초). 앞 절반은 흐려지고 뒤 절반은 또렷해진다
const BL = 28;                    // 가장 흐릴 때의 흐림(px)
const DREAM = 0;                  // 빛 번짐(0~1). 0 이면 없음
const SCENES = [
  { n: '14:00', c: '책상 · 마감 직전', bg: 'linear-gradient(160deg,#10151f 0%,#2f3b4d 58%,#8b98a8 100%)', glow: 'rgba(210,225,240,.4)', gx: '74%', gy: '20%', side: 'left' },
  { n: '꿈', c: '바닷가 · 어린 시절', bg: 'linear-gradient(160deg,#3b2a63 0%,#d27fa7 56%,#ffd9b0 100%)', glow: 'rgba(255,225,190,.7)', gx: '30%', gy: '24%', side: 'right' },
];
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);

function scene(sp, d) {
  const s = el('div', null, sp);
  box(s, { position: 'absolute', inset: '0', background: d.bg, overflow: 'hidden' });
  const g1 = el('div', null, s), g2 = el('div', null, s);
  box(g1, { position: 'absolute', inset: '0', background: `radial-gradient(circle at ${d.gx} ${d.gy}, ${d.glow}, transparent 52%)` });
  box(g2, { position: 'absolute', inset: '0', background: `radial-gradient(circle at ${d.gx} ${d.gy}, rgba(255,255,255,.35), transparent 16%)` });
  const n = el('div', null, s, d.n);
  box(n, { position: 'absolute', [d.side]: '44px', top: '96px', textAlign: d.side, font: "400 128px/1 'Black Han Sans',sans-serif", color: '#fff', textShadow: '0 6px 28px rgba(0,0,0,.35)' });
  const c = el('div', null, s, d.c);
  box(c, { position: 'absolute', [d.side]: '48px', top: '236px', textAlign: d.side, font: "500 22px/1.2 'IBM Plex Sans KR',sans-serif", color: 'rgba(255,255,255,.92)' });
  const gr = el('div', null, s);
  box(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.07', mixBlendMode: 'overlay' });
  return s;
}

const demo = {
  dur: 4.6, rest: 4.0, noCompare: false, levels: 3,
  mount(sp) {
    const sc = SCENES.map((d) => scene(sp, d));
    const veil = el('div', null, sp);
    box(veil, { position: 'absolute', inset: '0', background: 'radial-gradient(circle at 50% 45%, rgba(255,255,255,.95), rgba(255,235,245,.55) 55%, rgba(255,255,255,0) 90%)', opacity: '0', zIndex: 4 });
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', top: '18px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.66)', color: '#fff', font: "500 15px/1 'IBM Plex Sans KR',sans-serif", zIndex: 5 });
    const track = el('div', null, sp);
    box(track, { position: 'absolute', left: '20px', right: '100px', bottom: '22px', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,.25)', zIndex: 5 });
    const zone = el('div', null, track);
    box(zone, { position: 'absolute', top: '0', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,.9)', left: (T0 / 4.6 * 100) + '%', width: (DUR / 4.6 * 100) + '%' });
    const head = el('div', null, track);
    box(head, { position: 'absolute', top: '-4px', width: '3px', height: '16px', borderRadius: '2px', background: '#fff', boxShadow: '0 0 8px rgba(255,255,255,.7)' });
    return { sc, veil, pill, zone, head };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);     // 1 = 컷, 2 = 흐려졌다 또렷해짐(등속), 3 = 이징 + 밝아졌다 돌아옴
    const q = seg(t, T0, T0 + DUR);
    const blurOn = L >= 2, ease = L >= 3 ? E.inOutC : (x) => x;
    const half = q < .5;
    const k = blurOn ? (half ? ease(q * 2) : 1 - ease((q - .5) * 2)) : 0;
    const swapped = q >= .5;
    s.sc[0].style.zIndex = swapped ? 0 : 2;
    s.sc[1].style.zIndex = swapped ? 2 : 1;
    const f = (e) => {
      e.style.filter = blurOn ? `blur(${(BL * k).toFixed(1)}px) brightness(${(1 + (L >= 3 ? .35 : 0) * k).toFixed(3)})` : 'none';
      e.style.transform = blurOn ? `scale(${(1 + .05 * k).toFixed(3)})` : 'none';
    };
    f(s.sc[0]); f(s.sc[1]);
    s.veil.style.opacity = blurOn ? (DREAM * Math.sin(Math.PI * q)).toFixed(3) : '0';
    s.pill.textContent = !blurOn ? (swapped ? '컷 · 꿈' : '14:00') : (q > 0 && q < 1 ? '흐림 전환 · 초점이 풀렸다 맞춰짐' : (swapped ? '꿈' : '14:00'));
    s.zone.style.display = blurOn ? 'block' : 'none';
    s.head.style.left = `calc(${(t / 4.6 * 100).toFixed(2)}% - 1px)`;
  },
};
export default demo;
