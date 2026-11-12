/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/montage/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, E, el } from "./helpers.js";

// 100일 동안의 푸시업 기록을 짧은 컷 5개로 압축한다. 화면은 시간 t 의 함수다.
const SHOT = 1.0;                 // 컷 하나의 길이(초)
const BLEND = 0;                  // 컷과 컷 사이를 겹쳐 녹이는 시간(초). 0 이면 바로 붙임
const T0 = .4;
const SHOTS = [
  { d: 1, n: 3, bg: 'linear-gradient(160deg,#101521 0%,#2c3447 58%,#7d889c 100%)', glow: 'rgba(200,215,240,.35)' },
  { d: 20, n: 12, bg: 'linear-gradient(160deg,#17202b 0%,#33546f 58%,#9bbad0 100%)', glow: 'rgba(190,225,245,.45)' },
  { d: 45, n: 25, bg: 'linear-gradient(160deg,#1f2a2a 0%,#3f7a6a 58%,#b4dcc7 100%)', glow: 'rgba(200,245,220,.5)' },
  { d: 70, n: 38, bg: 'linear-gradient(160deg,#2b2218 0%,#a0702f 58%,#f0cd88 100%)', glow: 'rgba(255,225,160,.55)' },
  { d: 100, n: 50, bg: 'linear-gradient(160deg,#2c1810 0%,#c4552b 56%,#ffb36b 100%)', glow: 'rgba(255,200,130,.65)' },
];
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);

function shot(sp, o) {
  const s = el('div', null, sp);
  box(s, { position: 'absolute', inset: '0', background: o.bg, overflow: 'hidden' });
  const g1 = el('div', null, s), g2 = el('div', null, s);
  box(g1, { position: 'absolute', inset: '0', background: `radial-gradient(circle at 78% 22%, ${o.glow}, transparent 55%)` });
  box(g2, { position: 'absolute', inset: '0', background: `radial-gradient(circle at 78% 22%, rgba(255,255,255,.3), transparent 15%)` });
  const d = el('div', null, s, o.d + '일차');
  box(d, { position: 'absolute', left: '44px', top: '70px', font: "400 112px/1 'Black Han Sans',sans-serif", color: '#fff', textShadow: '0 6px 28px rgba(0,0,0,.35)' });
  const c = el('div', null, s, '푸시업 ' + o.n + '회');
  box(c, { position: 'absolute', left: '48px', top: '200px', font: "500 24px/1 'IBM Plex Sans KR',sans-serif", color: 'rgba(255,255,255,.95)', textShadow: '0 2px 12px rgba(0,0,0,.4)' });
  const tr = el('div', null, s), fl = el('div', null, tr);
  box(tr, { position: 'absolute', left: '48px', top: '246px', width: '340px', height: '12px', borderRadius: '6px', background: 'rgba(255,255,255,.28)' });
  box(fl, { width: (o.n / 50 * 100) + '%', height: '12px', borderRadius: '6px', background: '#fff', boxShadow: '0 0 14px rgba(255,255,255,.6)' });
  const gr = el('div', null, s);
  box(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.07', mixBlendMode: 'overlay' });
  return s;
}

const demo = {
  dur: 6.6, rest: 3.6, noCompare: false, levels: 3,
  mount(sp) {
    const sh = SHOTS.map((o) => shot(sp, o));
    const card = el('div', null, sp, '<div style="font:500 26px/1.6 \'IBM Plex Sans KR\',sans-serif">100일 동안 푸시업이<br>3회에서 50회로 늘었다</div><div style="margin-top:14px;font:500 16px/1.5 \'IBM Plex Sans KR\',sans-serif;opacity:.7">(말로만 설명한 한 줄)</div>');
    box(card, { position: 'absolute', inset: '0', background: 'linear-gradient(160deg,#10151f,#2a3140)', color: '#fff', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' });
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', top: '18px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.66)', color: '#fff', font: "500 15px/1 'IBM Plex Sans KR',sans-serif", zIndex: 30 });
    const ruler = el('div', null, sp);
    box(ruler, { position: 'absolute', left: '20px', right: '100px', bottom: '20px', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,.25)', zIndex: 30 });
    const marks = SHOTS.map((o) => {
      const m = el('div', null, ruler);
      box(m, { position: 'absolute', top: '-3px', width: '3px', height: '14px', borderRadius: '2px', background: '#fff', left: (o.d / 100 * 100) + '%' });
      return m;
    });
    const head = el('div', null, ruler);
    box(head, { position: 'absolute', top: '-6px', width: '14px', height: '20px', marginLeft: '-7px', borderRadius: '4px', background: '#ffd66b', boxShadow: '0 0 10px rgba(255,214,107,.8)' });
    const readout = el('div', null, sp);
    box(readout, { position: 'absolute', right: '20px', top: '18px', padding: '7px 12px', borderRadius: '8px', background: 'rgba(8,10,20,.66)', color: '#fff', font: "500 14px/1 'JetBrains Mono',monospace", zIndex: 30 });
    return { sh, card, pill, ruler, head, readout };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 말로만 설명, 2 = 짧은 컷 5개, 3 = 100일 눈금자와 압축 표시
    const n = SHOTS.length;
    const idx = Math.max(0, Math.min(n - 1, Math.floor((t - T0) / SHOT)));
    s.card.style.display = L <= 1 ? 'flex' : 'none';
    s.sh.forEach((e, i) => {
      const st = T0 + i * SHOT;
      const o = i === 0 ? 1 : (BLEND > 0 ? seg(t, st - BLEND, st) : (t >= st ? 1 : 0));
      e.style.opacity = o; e.style.zIndex = i;
    });
    const day = SHOTS[idx].d;
    s.ruler.style.display = L >= 3 ? 'block' : 'none';
    s.readout.style.display = L >= 3 ? 'block' : 'none';
    s.head.style.left = day + '%';
    const total = (n * SHOT);
    s.readout.textContent = `100일 → ${total.toFixed(1)}초`;
    s.pill.textContent = L <= 1 ? '말로만 설명 · 변화가 안 보임' : (t < T0 ? '시작' : `몽타주 · 컷 ${idx + 1}/${n} · ${day}일차`);
  },
};
export default demo;
