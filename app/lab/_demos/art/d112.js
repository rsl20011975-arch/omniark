/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/cut-rhythm/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 같은 8초 영상을 ① 감으로 자른 컷 ② 박자(BPM)에 맞춘 컷 ③ 길이가 변하는 컷 리듬으로 비교한다. 컷 길이는 '박자 수 × 한 박자 길이'로 정한다. 화면은 시간 t 의 함수다.
const BPM = 120;                          // 음악 빠르기(1분에 몇 박자). 한 박자 = 60 / BPM 초
const FLAT = [4, 4, 4, 4];                // 2단계: 컷마다 4박자씩(박자 수)
const PATTERN = [4, 3, 2, 1, 1, 1, 1, 3]; // 3단계: 컷 길이를 박자 수로 적은 리듬
const FREE = [1.7, 2.2, 1.3, 2.8];       // 1단계: 감으로 정한 컷 길이(초)
const DUR = 8.6, TL = 10;                 // 데모 길이 · 타임라인이 나타내는 시간 범위(초)
const SHOTS = [
  { n: '전체 · 주방', a: '#16233a', b: '#3d5f8f' }, { n: '칼질', a: '#2b1d16', b: '#b5683c' }, { n: '재료', a: '#10343a', b: '#3aa08e' },
  { n: '불꽃', a: '#3a1410', b: '#e0663a' }, { n: '소스', a: '#2a1b3d', b: '#a8527a' }, { n: '담기', a: '#1f2a1a', b: '#7a9a4a' },
  { n: '식탁', a: '#2b2410', b: '#c9a24a' }, { n: '완성', a: '#16233a', b: '#e8d8b8' },
];
const PAL = { bg0: '#f2f2f0', bg1: '#e4e4e1', ink: '#111111', muted: '#666666', accent: '#ff3b1f', accent2: '#111111', surface: '#ffffff', line: 'rgba(17,17,17,.18)', accentInk: '#c4210a' };
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const css = (e, o) => Object.assign(e.style, o);
const px = (t) => (t / TL * 600) + 'px';

function plan(L) {                         // 단계별 컷 길이(초) 목록
  const spb = 60 / BPM;
  return L <= 1 ? FREE.slice() : (L === 2 ? FLAT : PATTERN).map((b) => b * spb);
}

const demo = {
  dur: DUR, rest: 5.2, noCompare: false, levels: 3,
  mount(sp) {
    const spb = 60 / BPM;
    const bg = el('div', null, sp), gr0 = el('div', null, sp);               // 종이 같은 바탕 + 옅은 그레인
    css(bg, { position: 'absolute', inset: '0', background: `linear-gradient(160deg, ${PAL.bg0}, ${PAL.bg1})` });
    css(gr0, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.12', mixBlendMode: 'multiply' });
    const pv = el('div', null, sp);
    css(pv, { position: 'absolute', left: '20px', top: '54px', width: '300px', height: '169px', borderRadius: '10px', overflow: 'hidden', boxShadow: `0 0 0 1px ${PAL.ink}, 0 12px 26px rgba(17,17,17,.28), 0 2px 4px rgba(17,17,17,.2)` });
    const num = el('div', null, pv), cap = el('div', null, pv), len = el('div', null, pv), gr = el('div', null, pv);
    css(num, { position: 'absolute', left: '16px', top: '8px', font: "400 84px/1 'Black Han Sans',sans-serif", color: '#fff', textShadow: '0 4px 18px rgba(0,0,0,.4)' });
    css(cap, { position: 'absolute', left: '18px', bottom: '34px', font: "500 20px/1.2 'IBM Plex Sans KR',sans-serif", color: 'rgba(255,255,255,.95)' });
    css(len, { position: 'absolute', left: '18px', bottom: '12px', font: "500 13px/1 'JetBrains Mono',monospace", color: 'rgba(255,255,255,.85)' });
    css(gr, { position: 'absolute', inset: '0', background: 'radial-gradient(circle at 80% 18%, rgba(255,255,255,.28), transparent 45%)' });
    const end = el('div', null, pv, '끝');
    css(end, { position: 'absolute', inset: '0', background: PAL.ink, color: PAL.bg0, display: 'none', alignItems: 'center', justifyContent: 'center', font: "400 40px/1 'Black Han Sans',sans-serif", flexDirection: 'column' });
    const pulse = el('div', null, sp);
    css(pulse, { position: 'absolute', left: '292px', top: '66px', width: '18px', height: '18px', borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #fff, ${PAL.accent} 60%, ${PAL.accentInk})`, boxShadow: `0 0 10px ${rgba(PAL.accent, .6)}` });
    // 세로 이름표: 왼쪽 가장자리, 번호는 muted, 지금 단계는 ink
    const lab = el('div', null, sp);
    css(lab, { position: 'absolute', left: '3px', top: '54px', writingMode: 'vertical-rl', letterSpacing: '.08em', whiteSpace: 'nowrap', lineHeight: '12px', zIndex: 4 });
    const idxEl = el('span', null, lab);
    css(idxEl, { color: PAL.muted, font: "500 12px/1 'JetBrains Mono',monospace", marginBottom: '8px' });
    const pill = el('span', null, lab);
    css(pill, { color: PAL.ink, font: "600 12px/1 'IBM Plex Sans KR',sans-serif" });
    const met = el('div', null, sp);
    css(met, { position: 'absolute', left: '340px', top: '54px', width: '280px', height: '169px', boxSizing: 'border-box', padding: '12px 16px', borderRadius: '4px', borderLeft: `3px solid ${PAL.accent}`, background: PAL.surface, boxShadow: `0 0 0 1px ${PAL.line}, 0 8px 20px rgba(17,17,17,.12)`, color: PAL.ink, font: "500 14px/1.9 'IBM Plex Sans KR',sans-serif" });
    const tl = el('div', null, sp);
    css(tl, { position: 'absolute', left: '20px', top: '246px', width: '600px', height: '76px', borderRadius: '4px', background: PAL.surface, boxShadow: `0 0 0 1px ${PAL.line}, 0 8px 20px rgba(17,17,17,.1)` });
    for (let k = 0; k * spb <= TL + .001; k++) {                      // 박자선(4박자마다 굵게)
      const tk = el('div', null, tl);
      css(tk, { position: 'absolute', left: px(k * spb), top: k % 4 ? '30px' : '24px', width: k % 4 ? '1px' : '2px', height: k % 4 ? '30px' : '38px', background: k % 4 ? rgba(PAL.ink, .16) : rgba(PAL.ink, .5) });
    }
    const blocks = Array.from({ length: 8 }, () => {
      const b = el('div', null, tl), t = el('div', null, b);
      css(b, { position: 'absolute', top: '34px', height: '24px', borderRadius: '4px', boxSizing: 'border-box', border: `1.5px solid ${PAL.ink}`, overflow: 'hidden' });
      css(t, { font: "500 11px/21px 'JetBrains Mono',monospace", color: '#fff', textAlign: 'center', textShadow: '0 1px 3px rgba(0,0,0,.7)', whiteSpace: 'nowrap' });
      b.t = t; return b;
    });
    const dots = Array.from({ length: 8 }, () => {
      const d = el('div', null, tl); css(d, { position: 'absolute', top: '22px', width: '9px', height: '9px', borderRadius: '50%', marginLeft: '-4px' }); return d;
    });
    const bar = el('div', null, tl);
    css(bar, { position: 'absolute', top: '4px', height: '16px', borderRadius: '2px', background: rgba(PAL.accent, .16), border: `1px solid ${PAL.accent}`, color: PAL.ink, font: "500 10px/14px 'IBM Plex Sans KR',sans-serif", textAlign: 'center', display: 'none', whiteSpace: 'nowrap', overflow: 'hidden' });
    const head = el('div', null, tl);
    css(head, { position: 'absolute', top: '2px', width: '2px', height: '70px', background: PAL.accent, boxShadow: `0 0 0 1px ${rgba(PAL.surface, .9)}`, zIndex: 3 });
    return { pv, num, cap, len, end, pulse, pill, idxEl, met, blocks, dots, bar, head };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 감으로 자른 컷, 2 = 박자에 맞춘 컷, 3 = + 길이가 변하는 컷 리듬
    const spb = 60 / BPM, d = plan(L), cuts = [0];
    d.forEach((v) => cuts.push(cuts[cuts.length - 1] + v));
    const total = cuts[cuts.length - 1];
    let idx = d.length - 1; for (let i = 0; i < d.length; i++) if (t < cuts[i + 1]) { idx = i; break; }
    const over = t >= total, sh = SHOTS[idx % SHOTS.length];
    s.pv.style.background = `linear-gradient(150deg, ${sh.a}, ${sh.b})`;
    s.num.textContent = idx + 1; s.cap.textContent = sh.n; s.len.textContent = `컷 길이 ${d[idx].toFixed(2)}초`;
    s.end.style.display = over ? 'flex' : 'none'; s.end.innerHTML = `끝<div style="font:500 14px 'JetBrains Mono',monospace;margin-top:8px">총 ${total.toFixed(1)}초</div>`;
    const ph = (t % spb) / spb, pu = t < total ? Math.exp(-ph * 5) : 0;
    css(s.pulse, { transform: `scale(${(1 + .8 * pu).toFixed(3)})`, opacity: (.35 + .65 * pu).toFixed(3) });
    let off = 0;
    s.blocks.forEach((b, i) => {
      if (i >= d.length) { b.style.display = 'none'; s.dots[i].style.display = 'none'; return; }
      b.style.display = 'block'; css(b, { left: px(cuts[i]), width: (d[i] / TL * 600) + 'px', background: `linear-gradient(150deg, ${SHOTS[i % 8].a}, ${SHOTS[i % 8].b})`, outline: i === idx && !over ? `2px solid ${PAL.accent}` : 'none' });
      b.t.textContent = d[i] >= .45 ? d[i].toFixed(1) : '';
      const dv = i ? Math.abs(cuts[i] - Math.round(cuts[i] / spb) * spb) : 0, ok = dv < .02;
      s.dots[i].style.display = i ? 'block' : 'none'; css(s.dots[i], { left: px(cuts[i]), background: ok ? PAL.ink : PAL.accent, boxShadow: `0 0 0 2px ${PAL.surface}` });
      if (i && !ok) off++;
    });
    const fast = L >= 3 ? d.map((v, i) => (v <= spb * 1.01 ? i : -1)).filter((i) => i >= 0) : [];
    s.bar.style.display = fast.length ? 'block' : 'none';
    if (fast.length) { css(s.bar, { left: px(cuts[fast[0]]), width: ((cuts[fast[fast.length - 1] + 1] - cuts[fast[0]]) / TL * 600) + 'px' }); s.bar.textContent = '몽타주식 빠른 구간'; }
    s.head.style.left = px(Math.min(t, TL));
    const mn = Math.min(...d), avg = total / d.length;
    s.met.innerHTML = `<span style="color:${PAL.accentInk}">${BPM} BPM</span> · 한 박자 ${spb.toFixed(3).replace(/0$/, '')}초<br>컷 수 <b>${d.length}</b>개 · 평균 컷 길이 <b>${avg.toFixed(2)}</b>초<br>가장 짧은 컷 <b>${mn.toFixed(2)}</b>초<br>총 길이 <b>${total.toFixed(1)}</b>초<br>박자와 어긋난 컷 <b style="color:${off ? PAL.accentInk : PAL.ink}">${off}</b>개`;
    s.idxEl.textContent = '0' + Math.max(1, L);
    s.pill.textContent = L <= 1 ? `감으로 자른 컷 ${d.length}컷` : L === 2 ? '박자에 맞춘 컷 모두 4박자' : '컷 리듬 줄었다 늘어남';
  },
};
export default demo;
