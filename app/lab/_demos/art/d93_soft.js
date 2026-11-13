/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/wipe-push/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, E, el } from "./helpers.js";

const PAL = { bg0: '#171615', bg1: '#232120', ink: '#f2efe9', muted: '#9a958c', accent: '#5ad1c8', accent2: '#f2b84b', surface: '#1f1d1b', line: '#3a3733' };

// 두 장면을 4번 번갈아 바꾼다: 직선 와이프 → 아이리스(원형) → 시계 방향 → 푸시. 화면은 시간 t 의 함수다.
const HOLD = .6, DUR = .9;      // 한 장면이 머무는 시간 · 전환 하나의 길이(초)
const EDGE = 160;                  // 경계선의 부드러움(px). 0 이면 날카롭다
const OLD_MOVE = 1;              // 푸시에서 앞 장면이 밀려나는 정도(1 = 같이 밀림, 0 = 제자리)
const NAMES = ['와이프(직선)', '아이리스 와이프(원형)', '와이프(시계 방향)', '푸시(밀어내기)'];
const ST = [0, 1, 2, 3].map((i) => HOLD + i * (HOLD + DUR));
const SCENES = [
  { n: '서울', c: '37.57° N · 126.98° E', bg: `linear-gradient(155deg,${PAL.bg0} 0%,#1d6a63 50%,#9aeadf 100%)`, glow: 'rgba(120,235,225,.5)', gx: '80%', gy: '18%', side: 'left', y: 96 },
  { n: '부산', c: '35.18° N · 129.08° E', bg: `linear-gradient(155deg,${PAL.bg1} 0%,#5c340a 56%,#b87a1c 100%)`, glow: 'rgba(255,205,120,.55)', gx: '22%', gy: '22%', side: 'right', y: 96 },
];
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";

function scene(sp, d) {
  const s = el('div', null, sp);
  Object.assign(s.style, { position: 'absolute', inset: '0', background: d.bg, overflow: 'hidden' });
  const g1 = el('div', null, s), g2 = el('div', null, s);
  Object.assign(g1.style, { position: 'absolute', inset: '0', background: `radial-gradient(circle at ${d.gx} ${d.gy}, ${d.glow}, transparent 52%)` });
  Object.assign(g2.style, { position: 'absolute', inset: '0', background: `radial-gradient(circle at ${d.gx} ${d.gy}, rgba(255,255,255,.35), transparent 16%)` });
  const n = el('div', null, s, d.n);
  Object.assign(n.style, { position: 'absolute', [d.side]: '44px', top: d.y + 'px', textAlign: d.side, font: "400 128px/1 'Black Han Sans',sans-serif", color: PAL.ink, textShadow: '0 6px 28px rgba(0,0,0,.35)' });
  const c = el('div', null, s, d.c);
  Object.assign(c.style, { position: 'absolute', [d.side]: '48px', top: (d.y + 140) + 'px', textAlign: d.side, font: "500 17px/1.2 'JetBrains Mono',monospace", color: 'rgba(255,255,255,.9)', letterSpacing: '.04em' });
  const gr = el('div', null, s);
  Object.assign(gr.style, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.07', mixBlendMode: 'overlay' });
  return s;
}
const box = (e, o) => Object.assign(e.style, o);

const demo = {
  dur: 6.8, rest: 6.5, noCompare: false, levels: 4,
  mount(sp) {
    const sc = SCENES.map((d) => scene(sp, d));
    const pill = el('div', null, sp);   // 이름표(tag-tr): 오른쪽 위, 왼쪽 accent 줄
    box(pill, { position: 'absolute', right: '16px', top: '14px', padding: '7px 12px 7px 11px', borderRadius: '2px', background: PAL.surface, color: PAL.ink, borderLeft: `3px solid ${PAL.accent}`, boxShadow: '0 4px 14px rgba(0,0,0,.35)', font: "600 12px/1 'IBM Plex Sans KR',sans-serif", zIndex: 5 });
    const track = el('div', null, sp);
    box(track, { position: 'absolute', left: '20px', right: '100px', bottom: '22px', height: '8px', borderRadius: '4px', background: 'rgba(23,22,21,.55)', boxShadow: `inset 0 0 0 1px ${PAL.line}`, zIndex: 5 });
    const zs = ST.map((st) => {
      const z = el('div', null, track);
      box(z, { position: 'absolute', top: '0', height: '8px', borderRadius: '4px', background: PAL.accent, left: (st / 6.8 * 100) + '%', width: (DUR / 6.8 * 100) + '%' });
      return z;
    });
    const head = el('div', null, track);
    box(head, { position: 'absolute', top: '-4px', width: '3px', height: '16px', borderRadius: '2px', background: PAL.ink, boxShadow: '0 0 0 1.5px rgba(23,22,21,.8)' });
    return { sc, pill, zs, head };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 4 : lv);
    let k = -1;
    ST.forEach((st, i) => { if (t >= st) k = i; });
    s.sc.forEach((e) => box(e, { zIndex: 1, transform: 'none', filter: 'none', webkitMaskImage: 'none', maskImage: 'none' }));
    let label = k < 0 || k % 2 === 1 ? SCENES[0].n : SCENES[1].n;
    if (k >= 0) {
      const inc = s.sc[k % 2 === 0 ? 1 : 0], out = s.sc[k % 2 === 0 ? 0 : 1];
      const p = E.inOutC(seg(t, ST[k], ST[k] + DUR));
      label = SCENES[k % 2 === 0 ? 1 : 0].n;
      if (k >= L) {            // 아직 효과를 안 얹은 전환은 컷
        inc.style.zIndex = t >= ST[k] + DUR / 2 ? 2 : 0;
        if (t < ST[k] + DUR / 2) out.style.zIndex = 2;
      } else {
        inc.style.zIndex = 2; out.style.zIndex = 1;
        let m = 'none';
        if (k === 0) { const x = p * (640 + EDGE); m = `linear-gradient(to right,#000 ${x - EDGE}px,transparent ${x}px)`; }
        if (k === 1) { const r = p * (420 + EDGE); m = `radial-gradient(circle at 50% 50%,#000 ${r - EDGE}px,transparent ${r}px)`; }
        if (k === 2) { const ang = p * (360 + EDGE / 4); m = `conic-gradient(from 0deg at 50% 50%,#000 ${ang - EDGE / 4}deg,transparent ${ang}deg)`; }
        inc.style.webkitMaskImage = m; inc.style.maskImage = m;
        if (k === 3) {
          inc.style.transform = `translateX(${(1 - p) * 640}px)`;
          inc.style.filter = `blur(${((1 - p) * 6).toFixed(1)}px)`;   // 밀려 들어오며 초점이 맺힌다
          out.style.transform = `translateX(${-p * 640 * OLD_MOVE}px)`;
        }
      }
      if (k < L && p > 0 && p < 1) label = NAMES[k];
      else if (k >= L && p > 0 && p < 1) label = '컷 · 전환 효과 없음';
    }
    s.pill.textContent = label;
    s.zs.forEach((z, i) => { z.style.display = i < L ? 'block' : 'none'; });
    s.head.style.left = `calc(${(t / 6.8 * 100).toFixed(2)}% - 1px)`;
  },
};
export default demo;
