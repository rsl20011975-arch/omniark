/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/will-change/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// will-change: 곧 바뀔 속성을 브라우저에게 미리 알려 주는 '귀띔'. 겉모습은 바뀌지 않고, 귀띔이 켜져 있는 구간(자원을 쓰는 구간)만 달라진다. 화면은 시간 t 의 함수다.
const LEAD = 1.5;                  // 움직이기 몇 초 전에 will-change 를 켜는가(초)
const TAIL = .2;                  // 움직임이 끝난 뒤 몇 초 만에 끄는가(초)
const CARDS = 8;                  // 움직이는 카드(요소) 수
const T0 = 2.0, MOVE = 1.2, STAG = .05;   // 움직임 시작 시각 · 한 카드가 움직이는 시간 · 카드 사이 지연
const DURT = 5;
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);
const MONO = "'JetBrains Mono',monospace";
const LANES = [
  { y: 50, name: '① will-change 안 씀', code: '(아무것도 적지 않음)', c: '127,214,255' },
  { y: 148, name: '② 항상 켜 둠', code: '.card { will-change: transform; }', c: '255,160,110' },
  { y: 246, name: '③ 움직일 때만 켬', code: "el.style.willChange = 'transform'\n… 끝나면 = 'auto'", c: '120,235,170' },
];
const END = T0 + MOVE + (CARDS - 1) * STAG;     // 마지막 카드가 멈추는 시각
const hintWin = (k) => (k === 0 ? null : k === 1 ? [0, DURT] : [T0 - LEAD, END + TAIL]);
const TX = 176, TW = 300;                        // 시간 막대 시작 x · 폭(px)
const tx = (t) => TX + (t / DURT) * TW;

const demo = {
  dur: DURT, rest: 4.4, noCompare: false, levels: 3,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: 'linear-gradient(160deg,#0b0f1a 0%,#161d30 100%)' });
    box(el('div', null, bg), { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.06', mixBlendMode: 'overlay' });
    const lanes = LANES.map((ln) => {
      const p = el('div', null, sp);
      box(p, { position: 'absolute', left: '14px', top: ln.y + 'px', width: '612px', height: '90px', borderRadius: '10px', background: 'rgba(255,255,255,.045)', border: '1px solid rgba(255,255,255,.09)' });
      const tint = el('div', null, p);
      box(tint, { position: 'absolute', inset: '0', borderRadius: '10px', background: `rgba(${ln.c},.2)`, opacity: '0' });
      const nm = el('div', null, p, ln.name);
      box(nm, { position: 'absolute', left: '12px', top: '10px', font: "700 13px/1 'IBM Plex Sans KR',sans-serif", color: '#fff' });
      const cd = el('div', null, p, ln.code.replace('\n', '<br>'));
      box(cd, { position: 'absolute', left: '12px', top: '32px', font: `500 9.5px/1.45 ${MONO}`, color: 'rgba(255,255,255,.55)', width: '152px' });
      const cards = [];
      for (let i = 0; i < CARDS; i++) {
        const c = el('div', null, p);
        box(c, { position: 'absolute', left: (TX - 14 + i * 34) + 'px', top: '12px', width: '26px', height: '34px', borderRadius: '6px', background: `linear-gradient(160deg,rgba(${ln.c},1),rgba(${ln.c},.55))`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,.5), 0 4px 8px rgba(0,0,0,.4)' });
        cards.push(c);
      }
      const bar = el('div', null, p);
      box(bar, { position: 'absolute', left: (TX - 14) + 'px', top: '62px', width: TW + 'px', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,.10)', overflow: 'hidden' });
      const hint = el('div', null, bar);
      const mv = el('div', null, p);
      box(mv, { position: 'absolute', left: (tx(T0) - 14) + 'px', top: '56px', width: (tx(END) - tx(T0)) + 'px', height: '3px', background: '#fff' });
      const head = el('div', null, p);
      box(head, { position: 'absolute', top: '58px', width: '3px', height: '16px', borderRadius: '2px', background: '#fff', boxShadow: '0 0 8px rgba(255,255,255,.7)' });
      const num = el('div', null, p);
      box(num, { position: 'absolute', right: '14px', top: '10px', width: '118px', textAlign: 'right', font: `700 34px/1 ${MONO}`, color: `rgb(${ln.c})` });
      const cap = el('div', null, p);
      box(cap, { position: 'absolute', right: '14px', top: '50px', width: '118px', textAlign: 'right', font: "500 10.5px/1.4 'IBM Plex Sans KR',sans-serif", color: 'rgba(255,255,255,.7)' });
      return { p, tint, cards, hint, head, num, cap };
    });
    const note = el('div', null, sp, '테두리색·바탕색 = 이 데모가 ‘힌트 켜짐’을 알려 주려고 칠한 표시입니다. 실제 화면의 겉모습은 세 줄 모두 똑같습니다.');
    box(note, { position: 'absolute', left: '20px', top: '342px', font: "500 10.5px/1 'IBM Plex Sans KR',sans-serif", color: 'rgba(255,255,255,.62)' });
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', top: '12px', padding: '6px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.66)', color: '#fff', font: "500 14px/1 'IBM Plex Sans KR',sans-serif", zIndex: 5 });
    return { lanes, pill };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 힌트 없음, 2 = + 항상 켜 둠, 3 = + 움직일 때만 켬
    const show = Math.max(1, L);
    s.lanes.forEach((ln, k) => {
      ln.p.style.display = k < show ? 'block' : 'none';
      const w = hintWin(k);
      const on = w && t >= w[0] && t <= w[1];
      ln.tint.style.opacity = on ? 1 : 0;
      ln.cards.forEach((c, i) => {
        const x = E.outC(seg(t, T0 + i * STAG, T0 + i * STAG + MOVE));
        c.style.transform = `translateX(${(x * 52).toFixed(1)}px)`;
        c.style.outline = on ? `2px solid rgba(${LANES[k].c},.95)` : '2px solid transparent';
      });
      ln.hint.innerHTML = '';
      if (w) box(ln.hint, { position: 'absolute', top: '0', height: '8px', left: (tx(w[0]) - TX) + 'px', width: (tx(w[1]) - tx(w[0])) + 'px', background: `rgb(${LANES[k].c})` });
      else box(ln.hint, { position: 'absolute', top: '0', height: '8px', width: '0' });
      ln.head.style.left = (tx(t) - 14 - 1) + 'px';
      ln.num.textContent = on ? String(CARDS) : '0';
      ln.cap.innerHTML = w ? `개 요소에 힌트 켜짐<br>켜진 시간 ${(w[1] - w[0]).toFixed(1)}초 / ${DURT}초` : `개 요소에 힌트 켜짐<br>켜진 시간 0.0초 / ${DURT}초`;
    });
    s.pill.textContent = L <= 1 ? '연출 전 · will-change 를 안 쓴 한 줄' : L === 2 ? '항상 켜 두면 움직이지 않을 때도 계속 켜져 있음' : `움직이기 ${LEAD}초 전에 켜고 끝나면 끔 · 켜진 시간이 가장 짧음`;
  },
};
export default demo;
