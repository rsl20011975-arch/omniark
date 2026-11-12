/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/css-3d/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// CSS 3D: 부모에 perspective(원근), 자식에 transform-style: preserve-3d 와 rotateX/rotateY/translateZ 를 주면 평면 요소가 입체 공간에 놓인다. 화면은 시간 t 의 함수다.
const PERSP = 600;                // perspective 거리(px). 작을수록 원근이 강하다
const GAP = 90;                   // 오른쪽 층 카드가 앞뒤로 벌어지는 거리 translateZ(px)
const T0 = .4, SPIN = 2.4;
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);
const FACES = [   // [이름, 변형, 색 위(밝음) → 아래(어두움)]
  ['앞', 'rotateY(0deg) translateZ(60px)', ['#8fd0ff', '#4a8be8']], ['뒤', 'rotateY(180deg) translateZ(60px)', ['#3b5fb5', '#26418a']],
  ['오른쪽', 'rotateY(90deg) translateZ(60px)', ['#6aa6f2', '#3b6fd0']], ['왼쪽', 'rotateY(-90deg) translateZ(60px)', ['#5a8fe0', '#3059b8']],
  ['위', 'rotateX(90deg) translateZ(60px)', ['#c8e6ff', '#8fc4f5']], ['아래', 'rotateX(-90deg) translateZ(60px)', ['#2a458f', '#1e3270']],
];
const LAYERS = [   // 층 카드: [이름, 너비, 높이, 배경, 글자색, 글자 위치]
  ['배경판', 196, 124, 'linear-gradient(150deg,#35b8a8,#1d6f7a)', '#eaffff'],
  ['카드', 150, 84, 'linear-gradient(150deg,#ffc27d,#ff7a5c)', '#3a1408'],
  ['버튼', 84, 34, 'linear-gradient(180deg,#ffffff,#dfe6f5)', '#1a2238'],
];

const demo = {
  dur: 4, rest: 3.4, noCompare: false, levels: 4,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: 'linear-gradient(160deg,#0b0f1a 0%,#161d30 100%)' });
    box(el('div', null, bg), { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.06', mixBlendMode: 'overlay' });
    const mkPanel = (x, title) => {
      const p = el('div', null, sp);
      box(p, { position: 'absolute', left: x + 'px', top: '56px', width: '296px', height: '288px', borderRadius: '14px', background: 'rgba(255,255,255,.045)', border: '1px solid rgba(255,255,255,.09)' });
      const h = el('div', null, p, title);
      box(h, { position: 'absolute', left: '14px', top: '12px', font: "700 13px/1 'IBM Plex Sans KR',sans-serif", color: '#fff' });
      return p;
    };
    const pa = mkPanel(16, '큐브 · 면 6개를 입체로 세운다'), pb = mkPanel(328, '층 카드 · translateZ 로 앞뒤 간격');
    const sh = el('div', null, pa);
    box(sh, { position: 'absolute', left: '66px', top: '214px', width: '164px', height: '30px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,0,0,.55), transparent 70%)' });
    const sceneA = el('div', null, pa);
    box(sceneA, { position: 'absolute', left: '0', top: '10px', width: '296px', height: '230px' });
    const cube = el('div', null, sceneA);
    box(cube, { position: 'absolute', left: '88px', top: '55px', width: '120px', height: '120px' });
    const faces = FACES.map(([nm, tr, [c1, c2]]) => {
      const f = el('div', null, cube, nm);
      box(f, { position: 'absolute', left: '0', top: '0', width: '120px', height: '120px', boxSizing: 'border-box', borderRadius: '6px', background: `linear-gradient(160deg,${c1},${c2})`, border: '1px solid rgba(255,255,255,.45)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.5)', color: 'rgba(8,20,50,.8)', font: "400 28px/118px 'Black Han Sans',sans-serif", textAlign: 'center', transform: tr });
      return f;
    });
    const sceneB = el('div', null, pb);
    box(sceneB, { position: 'absolute', left: '0', top: '10px', width: '296px', height: '230px' });
    const deck = el('div', null, sceneB);
    box(deck, { position: 'absolute', left: '50px', top: '53px', width: '196px', height: '124px' });
    const layers = LAYERS.map(([nm, w, h, bgc, col], i) => {
      const f = el('div', null, deck, nm);
      box(f, { position: 'absolute', left: ((196 - w) / 2) + 'px', top: ((124 - h) / 2) + 'px', width: w + 'px', height: h + 'px', borderRadius: i === 2 ? '17px' : '12px', background: bgc, color: col, font: "700 13px/1 'IBM Plex Sans KR',sans-serif", textAlign: i === 2 ? 'center' : 'left', lineHeight: i === 2 ? h + 'px' : '1', padding: i === 2 ? '0' : '10px', boxSizing: 'border-box', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.55), 0 6px 14px rgba(0,0,0,.35)' });
      return f;
    });
    const rda = el('div', null, pa), rdb = el('div', null, pb);
    box(rda, { position: 'absolute', left: '14px', bottom: '12px', font: "500 11px/1.55 'JetBrains Mono',monospace", color: 'rgba(255,255,255,.75)' });
    box(rdb, { position: 'absolute', left: '14px', bottom: '12px', font: "500 11px/1.55 'JetBrains Mono',monospace", color: 'rgba(255,255,255,.75)' });
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', top: '14px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.66)', color: '#fff', font: "500 14px/1 'IBM Plex Sans KR',sans-serif", zIndex: 5 });
    return { sceneA, sceneB, cube, deck, faces, layers, rda, rdb, pill };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 4 : lv);   // 1 = 평면, 2 = + 회전·preserve-3d(원근 없음), 3 = + perspective, 4 = + translateZ 층
    const u = E.inOutC(seg(t, T0, T0 + SPIN));
    const ry = lerp(25, 135, u), rx = -22, dy = lerp(-30, -50, u), dx = -14;
    const persp = L >= 3 ? PERSP + 'px' : 'none';
    s.sceneA.style.perspective = persp; s.sceneB.style.perspective = persp;
    const three = L >= 2;
    s.cube.style.transformStyle = three ? 'preserve-3d' : 'flat';
    s.deck.style.transformStyle = three ? 'preserve-3d' : 'flat';
    s.cube.style.transform = three ? `rotateX(${rx}deg) rotateY(${ry.toFixed(1)}deg)` : 'none';
    s.deck.style.transform = three ? `rotateX(${dx}deg) rotateY(${dy.toFixed(1)}deg)` : 'none';
    s.faces.forEach((f, i) => { f.style.display = three || i === 0 ? 'block' : 'none'; });
    const z = L >= 4 ? GAP : .5;
    s.layers.forEach((f, i) => { f.style.transform = `translateZ(${((i - 1) * z).toFixed(1)}px)`; });
    s.rda.innerHTML = `perspective: ${L >= 3 ? PERSP + 'px' : 'none'}<br>${three ? `rotateX(${rx}deg) rotateY(${ry.toFixed(0)}deg)` : 'transform: none'}`;
    s.rdb.innerHTML = `translateZ: ${L >= 4 ? `-${GAP}px · 0 · +${GAP}px` : '0 (모두 같은 평면)'}<br>${three ? `rotateY(${dy.toFixed(0)}deg)` : 'transform: none'}`;
    s.pill.textContent = L <= 1 ? '연출 전 · 평면(회전·원근 없음)' : L === 2 ? 'rotateX·rotateY + preserve-3d · 원근은 아직 없음' : L === 3 ? `perspective ${PERSP}px · 멀수록 작아짐` : 'translateZ · 층이 앞뒤로 벌어짐';
  },
};
export default demo;
