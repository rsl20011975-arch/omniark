/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/montage/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, E, el } from "./helpers.js";

const PAL = { bg0: '#1b0e17', bg1: '#2b1424', ink: '#f6e9ee', muted: '#b095a3', accent: '#ff7aa8', accent2: '#ffd0a0', surface: '#26121f', line: '#4a2a40' };
const rgba = (h, a) => `rgba(${parseInt(h.slice(1, 3), 16)},${parseInt(h.slice(3, 5), 16)},${parseInt(h.slice(5, 7), 16)},${a})`;

// 100일 동안의 푸시업 기록을 짧은 컷 5개로 압축한다. 화면은 시간 t 의 함수다.
const SHOT = .55;                 // 컷 하나의 길이(초)
const BLEND = .25;                  // 컷과 컷 사이를 겹쳐 녹이는 시간(초). 0 이면 바로 붙임
const COLOR_SHIFT = 1;            // 컷이 지날수록 색이 바뀌는 정도(1 = 차가운 회색에서 따뜻한 주황으로, 0 = 계속 회색)
const T0 = .4;
const SHOTS = [
  { d: 1, n: 3, bg: 'linear-gradient(160deg,#15121c 0%,#332f43 58%,#8a869b 100%)', glow: 'rgba(205,200,235,.35)' },
  { d: 20, n: 12, bg: 'linear-gradient(160deg,#1a1420 0%,#4a3a55 58%,#a58fa8 100%)', glow: 'rgba(225,200,235,.4)' },
  { d: 45, n: 25, bg: 'linear-gradient(160deg,#1d1119 0%,#6a3350 58%,#c58aa0 100%)', glow: 'rgba(250,200,215,.45)' },
  { d: 70, n: 38, bg: 'linear-gradient(160deg,#231019 0%,#a03e58 58%,#f08a96 100%)', glow: 'rgba(255,205,190,.5)' },
  { d: 100, n: 50, bg: `linear-gradient(160deg,${PAL.bg1} 0%,#c4552b 56%,${PAL.accent2} 100%)`, glow: 'rgba(255,215,160,.62)' },
];
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);

function shot(sp, o) {
  const s = el('div', null, sp);
  box(s, { position: 'absolute', inset: '0', background: SHOTS[0].bg, overflow: 'hidden' });
  const tint = el('div', null, s);   // 컷 순서에 따라 색이 입혀지는 층(COLOR_SHIFT 가 0 이면 안 보인다)
  box(tint, { position: 'absolute', inset: '0', background: o.bg, opacity: o.d === 1 ? '1' : String(COLOR_SHIFT) });
  const g1 = el('div', null, tint), g2 = el('div', null, tint);
  box(g1, { position: 'absolute', inset: '0', background: `radial-gradient(circle at 78% 22%, ${o.glow}, transparent 55%)` });
  box(g2, { position: 'absolute', inset: '0', background: `radial-gradient(circle at 78% 22%, rgba(255,255,255,.3), transparent 15%)` });
  const d = el('div', null, s, o.d + '일차');
  box(d, { position: 'absolute', left: '44px', top: '70px', font: "400 112px/1 'Black Han Sans',sans-serif", color: PAL.ink, textShadow: '0 6px 28px rgba(0,0,0,.4)' });
  const c = el('div', null, s, '푸시업 ' + o.n + '회');
  box(c, { position: 'absolute', left: '48px', top: '200px', font: "500 24px/1 'IBM Plex Sans KR',sans-serif", color: PAL.ink, textShadow: '0 2px 12px rgba(0,0,0,.45)' });
  const tr = el('div', null, s), fl = el('div', null, tr);
  box(tr, { position: 'absolute', left: '48px', top: '246px', width: '340px', height: '12px', borderRadius: '6px', background: rgba(PAL.ink, .28) });
  box(fl, { width: (o.n / 50 * 100) + '%', height: '12px', borderRadius: '6px', background: PAL.ink, boxShadow: `0 0 14px ${rgba(PAL.ink, .5)}` });
  const gr = el('div', null, s);
  box(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.07', mixBlendMode: 'overlay' });
  return s;
}

const demo = {
  dur: 6.6, rest: 3.6, noCompare: false, levels: 3,
  mount(sp) {
    const sh = SHOTS.map((o) => shot(sp, o));
    const card = el('div', null, sp, '<div style="font:500 26px/1.6 \'IBM Plex Sans KR\',sans-serif">100일 동안 푸시업이<br>3회에서 50회로 늘었다</div><div style="margin-top:14px;font:500 16px/1.5 \'IBM Plex Sans KR\',sans-serif;opacity:.7">(말로만 설명한 한 줄)</div>');
    box(card, { position: 'absolute', inset: '0', background: `linear-gradient(160deg,${PAL.bg0},#3a2a42)`, color: PAL.ink, zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' });
    const lab = el('div', null, sp);   // 이름표(numeral): 큰 숫자(현재 컷 번호) + 옆에 한 줄 설명
    box(lab, { position: 'absolute', left: '16px', top: '12px', display: 'flex', alignItems: 'center', gap: '10px', padding: '3px 14px 3px 12px', borderRadius: '6px', background: rgba(PAL.surface, .88), boxShadow: `0 4px 14px rgba(0,0,0,.35), inset 0 0 0 1px ${PAL.line}`, zIndex: 30 });
    const num = el('div', null, lab);
    box(num, { font: "400 40px/1.1 'Black Han Sans',sans-serif", color: PAL.accent });
    const pill = el('div', null, lab);
    box(pill, { color: PAL.ink, font: "500 13px/1.2 'IBM Plex Sans KR',sans-serif" });
    const ruler = el('div', null, sp);
    box(ruler, { position: 'absolute', left: '20px', right: '100px', bottom: '20px', height: '8px', borderRadius: '4px', background: rgba(PAL.ink, .22), boxShadow: `inset 0 0 0 1px ${PAL.line}`, zIndex: 30 });
    const marks = SHOTS.map((o) => {
      const m = el('div', null, ruler);
      box(m, { position: 'absolute', top: '-3px', width: '3px', height: '14px', borderRadius: '2px', background: PAL.muted, left: (o.d / 100 * 100) + '%' });
      return m;
    });
    const head = el('div', null, ruler);
    box(head, { position: 'absolute', top: '-6px', width: '14px', height: '20px', marginLeft: '-7px', borderRadius: '4px', background: PAL.accent2, boxShadow: `0 0 10px ${rgba(PAL.accent2, .8)}` });
    const readout = el('div', null, sp);
    box(readout, { position: 'absolute', right: '20px', top: '18px', padding: '7px 12px', borderRadius: '6px', background: rgba(PAL.surface, .88), color: PAL.ink, boxShadow: `inset 0 0 0 1px ${PAL.line}`, font: "500 14px/1 'JetBrains Mono',monospace", zIndex: 30 });
    return { sh, card, pill, num, ruler, head, readout };
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
    s.num.textContent = L <= 1 ? '0' : (t < T0 ? '0' : String(idx + 1));
    s.pill.textContent = L <= 1 ? '말로만 설명 · 변화가 안 보임' : (t < T0 ? '시작' : `몽타주 · ${n}컷 중 ${idx + 1}번째 · ${day}일차`);
  },
};
export default demo;
