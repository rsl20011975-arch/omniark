/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/cross-cutting/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, E, el } from "./helpers.js";

// 같은 시각에 벌어지는 두 일(A: 열쇠 찾기, B: 열차 출발까지 카운트다운)을 번갈아 보여 주며 컷 길이를 점점 줄인다. 화면은 시간 t 의 함수다.
const RHYTHM = [1.2, 1.0, .8, .6, .45, .35, .3, .3];   // 컷 하나하나의 길이(초). 점점 짧아지면 긴장이 오른다
const PIP = 1;                                           // 안 보이는 쪽 상태를 구석에 작게 보여 주는 정도(0~1)
const T0 = .6;
const TOTAL = RHYTHM.reduce((a, b) => a + b, 0);
const ST = RHYTHM.map((_, i) => T0 + RHYTHM.slice(0, i).reduce((a, b) => a + b, 0));
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);
const R = 74, C = 2 * Math.PI * R;

function base(sp, bg, glow, gx, gy) {
  const s = el('div', null, sp);
  box(s, { position: 'absolute', inset: '0', background: bg, overflow: 'hidden' });
  const g1 = el('div', null, s), g2 = el('div', null, s);
  box(g1, { position: 'absolute', inset: '0', background: `radial-gradient(circle at ${gx} ${gy}, ${glow}, transparent 52%)` });
  box(g2, { position: 'absolute', inset: '0', background: `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,.3), transparent 16%)` });
  const gr = el('div', null, s);
  box(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.07', mixBlendMode: 'overlay' });
  return s;
}
function label(s, txt, side) {
  const c = el('div', null, s, txt);
  box(c, { position: 'absolute', [side]: '44px', bottom: '74px', font: "500 22px/1.2 'IBM Plex Sans KR',sans-serif", color: 'rgba(255,255,255,.95)', textShadow: '0 2px 12px rgba(0,0,0,.4)' });
}

const demo = {
  dur: 7.4, rest: 7.1, noCompare: false, levels: 3,
  mount(sp) {
    const A = base(sp, 'linear-gradient(160deg,#2a1810 0%,#a6532c 56%,#f3b66f 100%)', 'rgba(255,196,120,.6)', '22%', '24%');
    A.insertAdjacentHTML('beforeend', `<svg width="190" height="190" viewBox="0 0 190 190" style="position:absolute;left:225px;top:56px"><circle cx="95" cy="95" r="${R}" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="12"/><circle class="ring" cx="95" cy="95" r="${R}" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}" transform="rotate(-90 95 95)"/></svg>`);
    const pa = el('div', null, A, '0%');
    box(pa, { position: 'absolute', left: '225px', width: '190px', top: '116px', textAlign: 'center', font: "400 56px/1 'Black Han Sans',sans-serif", color: '#fff', textShadow: '0 4px 20px rgba(0,0,0,.35)' });
    label(A, 'A · 열쇠를 찾는 중', 'left');
    const B = base(sp, 'linear-gradient(160deg,#0a1424 0%,#1d3f66 58%,#8fb4d8 100%)', 'rgba(190,220,255,.5)', '76%', '20%');
    const pb = el('div', null, B, '00:12');
    box(pb, { position: 'absolute', left: '0', right: '0', top: '92px', textAlign: 'center', font: "400 120px/1 'Black Han Sans',sans-serif", color: '#fff', textShadow: '0 6px 28px rgba(0,0,0,.4)' });
    label(B, 'B · 열차 출발까지', 'right');
    const Cc = base(sp, 'linear-gradient(160deg,#10281f 0%,#2c7d59 58%,#b9e8c9 100%)', 'rgba(200,255,220,.5)', '50%', '30%');
    const pc = el('div', null, Cc, '탑승');
    box(pc, { position: 'absolute', left: '0', right: '0', top: '96px', textAlign: 'center', font: "400 128px/1 'Black Han Sans',sans-serif", color: '#fff', textShadow: '0 6px 28px rgba(0,0,0,.35)' });
    label(Cc, '문이 열렸고 열차가 아직 떠나지 않았다', 'left');
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', top: '18px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.66)', color: '#fff', font: "500 15px/1 'IBM Plex Sans KR',sans-serif", zIndex: 5 });
    const pip = el('div', null, sp);
    box(pip, { position: 'absolute', right: '20px', top: '18px', padding: '7px 12px', borderRadius: '8px', background: 'rgba(8,10,20,.66)', color: '#fff', font: "500 14px/1 'JetBrains Mono',monospace", zIndex: 5, opacity: '0' });
    const track = el('div', null, sp);
    box(track, { position: 'absolute', left: '20px', right: '100px', bottom: '22px', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,.2)', zIndex: 5 });
    const segs = RHYTHM.map((len, i) => {
      const z = el('div', null, track);
      box(z, { position: 'absolute', top: '0', height: '8px', background: i % 2 ? 'rgba(143,180,216,.95)' : 'rgba(255,196,120,.95)', left: (ST[i] / 7.4 * 100) + '%', width: (len / 7.4 * 100) + '%', borderRight: '2px solid rgba(8,10,20,.55)' });
      return z;
    });
    const head = el('div', null, track);
    box(head, { position: 'absolute', top: '-4px', width: '3px', height: '16px', borderRadius: '2px', background: '#fff', boxShadow: '0 0 8px rgba(255,255,255,.7)' });
    return { A, B, Cc, pa, pb, ring: A.querySelector('.ring'), pill, pip, segs, head };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = A 를 다 보여 주고 B 를 다 보여 줌, 2 = 번갈아 보여 줌(컷 길이 일정), 3 = 컷 길이를 점점 줄임
    const half = T0 + TOTAL / 2, end = T0 + TOTAL;
    const p = seg(t, T0, end);
    const setA = (v) => { s.ring.setAttribute('stroke-dashoffset', String(C * (1 - v))); s.pa.textContent = Math.round(v * 100) + '%'; };
    const setB = (v) => { s.pb.textContent = '00:' + String(Math.ceil((1 - v) * 12)).padStart(2, '0'); };
    let show = 'A', len = 0, tag = '';
    if (t >= end) { show = 'C'; tag = '합류 · 두 일이 한 곳에서 만남'; setA(1); setB(1); }
    else if (L <= 1) {                        // 이어 붙이기: A 가 끝난 뒤에야 B 가 시작한다(같은 시각이 아님)
      if (t < half) { show = 'A'; setA(seg(t, T0, half)); setB(0); tag = 'A 를 다 보여 준 뒤'; }
      else { show = 'B'; setA(1); setB(seg(t, half, end)); tag = 'B 를 이어서 보여 줌 · 동시에 벌어지는 일처럼 안 보임'; }
    } else {                                   // 번갈아 보여 주기: 두 일이 같은 시각에 진행된다
      setA(p); setB(p);
      let i = 0;
      ST.forEach((st, k) => { if (t >= st) i = k; });
      const idx = L >= 3 ? i : Math.min(Math.floor((t - T0) / (TOTAL / RHYTHM.length)), RHYTHM.length - 1);
      show = (t < T0 ? 0 : idx) % 2 ? 'B' : 'A';
      len = L >= 3 ? RHYTHM[i] : TOTAL / RHYTHM.length;
      tag = t < T0 ? 'A' : `크로스컷 · A ↔ B 번갈아 · 컷 길이 ${len.toFixed(2)}초`;
    }
    s.A.style.zIndex = show === 'A' ? 2 : 0; s.B.style.zIndex = show === 'B' ? 2 : 0; s.Cc.style.zIndex = show === 'C' ? 2 : 0;
    s.pill.textContent = tag || 'A';
    const other = show === 'A' ? `B 00:${String(Math.ceil((1 - p) * 12)).padStart(2, '0')}` : `A ${Math.round(p * 100)}%`;
    s.pip.textContent = '지금 ' + other;
    s.pip.style.opacity = L >= 2 && show !== 'C' ? String(PIP) : '0';
    s.segs.forEach((z, i) => { z.style.display = L >= 2 ? 'block' : 'none'; if (L === 2) { z.style.left = (T0 + i * TOTAL / RHYTHM.length) / 7.4 * 100 + '%'; z.style.width = (TOTAL / RHYTHM.length / 7.4 * 100) + '%'; } else { z.style.left = (ST[i] / 7.4 * 100) + '%'; z.style.width = (RHYTHM[i] / 7.4 * 100) + '%'; } });
    s.head.style.left = `calc(${(t / 7.4 * 100).toFixed(2)}% - 1px)`;
  },
};
export default demo;
