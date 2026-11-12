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
const css = (e, o) => Object.assign(e.style, o);
const px = (t) => (t / TL * 600) + 'px';

function plan(L) {                         // 단계별 컷 길이(초) 목록
  const spb = 60 / BPM;
  return L <= 1 ? FREE.slice() : (L === 2 ? FLAT : PATTERN).map((b) => b * spb);
}

const demo = {
  dur: DUR, rest: 5.2, noCompare: false, levels: 3,
  mount(sp) {
    const spb = 60 / BPM, pv = el('div', null, sp);
    css(pv, { position: 'absolute', left: '20px', top: '54px', width: '300px', height: '169px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 0 0 1.5px rgba(255,255,255,.35), 0 10px 26px rgba(0,0,0,.45)' });
    const num = el('div', null, pv), cap = el('div', null, pv), len = el('div', null, pv), gr = el('div', null, pv);
    css(num, { position: 'absolute', left: '16px', top: '8px', font: "400 84px/1 'Black Han Sans',sans-serif", color: '#fff', textShadow: '0 4px 18px rgba(0,0,0,.4)' });
    css(cap, { position: 'absolute', left: '18px', bottom: '34px', font: "500 20px/1.2 'IBM Plex Sans KR',sans-serif", color: 'rgba(255,255,255,.95)' });
    css(len, { position: 'absolute', left: '18px', bottom: '12px', font: "500 13px/1 'JetBrains Mono',monospace", color: 'rgba(255,255,255,.85)' });
    css(gr, { position: 'absolute', inset: '0', background: 'radial-gradient(circle at 80% 18%, rgba(255,255,255,.28), transparent 45%)' });
    const end = el('div', null, pv, '끝');
    css(end, { position: 'absolute', inset: '0', background: '#0b0f1a', color: '#fff', display: 'none', alignItems: 'center', justifyContent: 'center', font: "400 40px/1 'Black Han Sans',sans-serif", flexDirection: 'column' });
    const pulse = el('div', null, sp);
    css(pulse, { position: 'absolute', left: '292px', top: '66px', width: '18px', height: '18px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #fff, #ffb066 55%, #d9641c)', boxShadow: '0 0 12px rgba(255,170,90,.8)' });
    const pill = el('div', null, sp);
    css(pill, { position: 'absolute', left: '20px', top: '18px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.72)', color: '#fff', font: "500 15px/1 'IBM Plex Sans KR',sans-serif" });
    const met = el('div', null, sp);
    css(met, { position: 'absolute', left: '340px', top: '54px', width: '280px', height: '169px', boxSizing: 'border-box', padding: '12px 16px', borderRadius: '10px', background: 'rgba(8,10,20,.62)', color: '#fff', font: "500 14px/1.9 'IBM Plex Sans KR',sans-serif" });
    const tl = el('div', null, sp);
    css(tl, { position: 'absolute', left: '20px', top: '246px', width: '600px', height: '76px', borderRadius: '8px', background: 'rgba(8,10,20,.6)' });
    for (let k = 0; k * spb <= TL + .001; k++) {                      // 박자선(4박자마다 굵게)
      const tk = el('div', null, tl);
      css(tk, { position: 'absolute', left: px(k * spb), top: k % 4 ? '30px' : '24px', width: k % 4 ? '1px' : '2px', height: k % 4 ? '30px' : '38px', background: k % 4 ? 'rgba(255,255,255,.22)' : 'rgba(255,255,255,.5)' });
    }
    const blocks = Array.from({ length: 8 }, () => {
      const b = el('div', null, tl), t = el('div', null, b);
      css(b, { position: 'absolute', top: '34px', height: '24px', borderRadius: '4px', boxSizing: 'border-box', border: '1.5px solid rgba(255,255,255,.85)', overflow: 'hidden' });
      css(t, { font: "500 11px/21px 'JetBrains Mono',monospace", color: '#fff', textAlign: 'center', textShadow: '0 1px 3px rgba(0,0,0,.7)', whiteSpace: 'nowrap' });
      b.t = t; return b;
    });
    const dots = Array.from({ length: 8 }, () => {
      const d = el('div', null, tl); css(d, { position: 'absolute', top: '22px', width: '9px', height: '9px', borderRadius: '50%', marginLeft: '-4px' }); return d;
    });
    const bar = el('div', null, tl);
    css(bar, { position: 'absolute', top: '4px', height: '16px', borderRadius: '4px', background: 'rgba(255,200,120,.28)', border: '1px solid rgba(255,200,120,.7)', color: '#ffe3b8', font: "500 10px/14px 'IBM Plex Sans KR',sans-serif", textAlign: 'center', display: 'none', whiteSpace: 'nowrap', overflow: 'hidden' });
    const head = el('div', null, tl);
    css(head, { position: 'absolute', top: '2px', width: '2px', height: '70px', background: '#fff', boxShadow: '0 0 8px rgba(255,255,255,.8)', zIndex: 3 });
    return { pv, num, cap, len, end, pulse, pill, met, blocks, dots, bar, head };
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
      b.style.display = 'block'; css(b, { left: px(cuts[i]), width: (d[i] / TL * 600) + 'px', background: `linear-gradient(150deg, ${SHOTS[i % 8].a}, ${SHOTS[i % 8].b})`, outline: i === idx && !over ? '2px solid #ffd166' : 'none' });
      b.t.textContent = d[i] >= .45 ? d[i].toFixed(1) : '';
      const dv = i ? Math.abs(cuts[i] - Math.round(cuts[i] / spb) * spb) : 0, ok = dv < .02;
      s.dots[i].style.display = i ? 'block' : 'none'; css(s.dots[i], { left: px(cuts[i]), background: ok ? '#5ee08a' : '#ff5a5a', boxShadow: ok ? '0 0 6px #5ee08a' : '0 0 6px #ff5a5a' });
      if (i && !ok) off++;
    });
    const fast = L >= 3 ? d.map((v, i) => (v <= spb * 1.01 ? i : -1)).filter((i) => i >= 0) : [];
    s.bar.style.display = fast.length ? 'block' : 'none';
    if (fast.length) { css(s.bar, { left: px(cuts[fast[0]]), width: ((cuts[fast[fast.length - 1] + 1] - cuts[fast[0]]) / TL * 600) + 'px' }); s.bar.textContent = '몽타주식 빠른 구간'; }
    s.head.style.left = px(Math.min(t, TL));
    const mn = Math.min(...d), avg = total / d.length;
    s.met.innerHTML = `<span style="color:#ffd9a0">${BPM} BPM</span> · 한 박자 ${spb.toFixed(3).replace(/0$/, '')}초<br>컷 수 <b>${d.length}</b>개 · 평균 컷 길이 <b>${avg.toFixed(2)}</b>초<br>가장 짧은 컷 <b>${mn.toFixed(2)}</b>초<br>총 길이 <b>${total.toFixed(1)}</b>초<br>박자와 어긋난 컷 <b style="color:${off ? '#ff8a8a' : '#7be8a0'}">${off}</b>개`;
    s.pill.textContent = L <= 1 ? `감으로 자른 컷 · ${d.length}컷` : L === 2 ? '박자에 맞춘 컷 · 모두 4박자' : '컷 리듬 · 길이가 줄었다 늘어남';
  },
};
export default demo;
