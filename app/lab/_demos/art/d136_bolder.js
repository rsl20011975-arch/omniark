/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/icon-sets/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 아이콘 6개를 '굵기·끝 모양·크기·색이 제각각인 상태'에서 '한 세트의 규칙(24 격자·선 2·둥근 끝)'으로 맞춘다. 그림은 직접 그린 선 경로이고, 화면은 시간 t 의 함수다.
const STROKE = 3.6;                 // 선 굵기(24 격자 기준 칸 수). 24px 로 볼 때 2px
const ICON_PX = 48;               // 화면에 보이는 아이콘 크기(px). 24 격자를 2배로
const COLOR = '#e8ecf4';          // 한 세트의 아이콘 색
const box = (e, o) => Object.assign(e.style, o);
const NS = 'http://www.w3.org/2000/svg';

// 24×24 격자 위에 직접 그린 선 경로(바깥 여백 1칸 이상)
const ICONS = [
  { n: '홈', d: ['M3.5 11 L12 3.8 L20.5 11', 'M5.5 9.6 V20 H18.5 V9.6', 'M10 20 V14.2 H14 V20'] },
  { n: '검색', d: ['M17 10.5 A6.5 6.5 0 1 1 4 10.5 A6.5 6.5 0 0 1 17 10.5', 'M15.2 15.2 L20.5 20.5'] },
  { n: '알림', d: ['M6 16 V11 A6 6 0 0 1 18 11 V16 L20 18.2 H4 L6 16 Z', 'M10 21 A2 2 0 0 0 14 21'] },
  { n: '좋아요', d: ['M12 20.2 C5.5 15.2 3.2 12.4 3.2 9 A4.6 4.6 0 0 1 12 7 A4.6 4.6 0 0 1 20.8 9 C20.8 12.4 18.5 15.2 12 20.2 Z'] },
  { n: '메일', d: ['M5 5.5 H19 A2 2 0 0 1 21 7.5 V16.5 A2 2 0 0 1 19 18.5 H5 A2 2 0 0 1 3 16.5 V7.5 A2 2 0 0 1 5 5.5 Z', 'M3.6 7.6 L12 13.4 L20.4 7.6'] },
  { n: '내 정보', d: ['M16 8 A4 4 0 1 1 8 8 A4 4 0 0 1 16 8', 'M4.6 20.5 C4.6 16.6 8 14.2 12 14.2 C16 14.2 19.4 16.6 19.4 20.5'] },
];
// 연출 전: 아이콘마다 굵기·크기·채움·색·끝 모양이 다르다
const MIX = [
  { sw: 1, px: 34, dy: -7, fill: 0, c: '#e8ecf4' }, { sw: 3.4, px: 58, dy: 5, fill: 0, c: '#ffb36b' },
  { sw: 1.5, px: 44, dy: 0, fill: 1, c: '#9ec5ff' }, { sw: 2.8, px: 62, dy: -5, fill: 1, c: '#e8ecf4' },
  { sw: 1, px: 38, dy: 8, fill: 0, c: '#b6f0c0' }, { sw: 3.8, px: 52, dy: 2, fill: 0, c: '#ffd7d7' },
];
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, p) => 'rgb(' + hex(a).map((v, i) => Math.round(lerp(v, hex(b)[i], p))).join(',') + ')';
const GRID = (() => { let s = ''; for (let i = 0; i <= 24; i += 2) s += `M${i} 0V24M0 ${i}H24`; return s; })();

const demo = {
  dur: 3.6, rest: 3.2, noCompare: false, levels: 3,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: 'linear-gradient(160deg,#0b0f1a 0%,#171e33 100%)' });
    const guide = el('div', null, sp);
    box(guide, { position: 'absolute', left: '28px', right: '28px', top: '154px', height: '0', borderTop: '1px dashed rgba(255,255,255,.18)' });
    const cells = ICONS.map((ic, i) => {
      const x = 44 + i * 92;
      const c = el('div', null, sp);
      box(c, { position: 'absolute', left: x + 'px', top: '84px', width: '84px', height: '140px', borderRadius: '16px', background: 'linear-gradient(170deg,#222b45,#161c30)', border: '1px solid rgba(255,255,255,.1)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.12), 0 14px 24px rgba(0,0,0,.38)' });
      const wrap = el('div', null, sp);
      box(wrap, { position: 'absolute', left: (x + 42) + 'px', top: '154px', width: '0', height: '0' });
      wrap.innerHTML = `<svg viewBox="0 0 24 24" style="position:absolute;overflow:visible;left:0;top:0"><path class="gr" d="${GRID}" stroke="#9ec5ff" stroke-width=".08" fill="none" opacity="0"/><rect class="sf" x="1" y="1" width="22" height="22" rx="1" fill="none" stroke="#ff8a3d" stroke-width=".18" stroke-dasharray=".7 .5" opacity="0"/><g class="ic" fill="none">${ic.d.map((d) => `<path d="${d}"/>`).join('')}</g></svg>`;
      const svg = wrap.firstChild;
      const lab = el('div', null, sp, ic.n);
      box(lab, { position: 'absolute', left: x + 'px', width: '84px', top: '196px', textAlign: 'center', font: "500 13px/1 'IBM Plex Sans KR',sans-serif", color: 'rgba(255,255,255,.72)' });
      return { wrap, svg, g: svg.querySelector('.ic'), gr: svg.querySelector('.gr'), sf: svg.querySelector('.sf') };
    });
    const chips = [['선 굵기 ' + STROKE + 'px로 통일', 2], ['끝·꺾임 둥글게', 2], ['크기 ' + ICON_PX + 'px · 한 색', 3]].map(([w, lv], i) => {
      const x = 44 + i * 188;
      const c = el('div', null, sp);
      box(c, { position: 'absolute', left: x + 'px', top: '254px', width: '172px', height: '38px', borderRadius: '19px', border: '1px solid rgba(255,255,255,.18)', background: 'rgba(8,10,20,.5)' });
      c.innerHTML = `<svg viewBox="0 0 24 24" style="position:absolute;left:10px;top:7px;width:24px;height:24px"><circle class="dot" cx="12" cy="12" r="9" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="2"/><path class="ck" d="M7.8 12.4 L10.7 15.2 L16.4 9.2" fill="none" stroke="#0b0f1a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" opacity="0"/></svg>`;
      const t = el('div', null, c, w);
      box(t, { position: 'absolute', left: '42px', top: '0', lineHeight: '38px', font: "500 14px/38px 'IBM Plex Sans KR',sans-serif", color: '#fff' });
      return { c, lv, dot: c.querySelector('.dot'), ck: c.querySelector('.ck') };
    });
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', top: '18px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.66)', color: '#fff', font: "500 15px/1 'IBM Plex Sans KR',sans-serif" });
    const note = el('div', null, sp);
    box(note, { position: 'absolute', left: '44px', right: '44px', top: '312px', font: "400 13px/1.4 'IBM Plex Sans KR',sans-serif", color: 'rgba(255,255,255,.62)' });
    return { cells, chips, pill, note, guide };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 제각각, 2 = + 굵기·끝 통일, 3 = + 크기·색 통일과 격자
    const p2 = L >= 2 ? E.outC(seg(t, .4, 1.2)) : 0;
    const p3 = L >= 3 ? E.outC(seg(t, 1.5, 2.3)) : 0;
    s.cells.forEach((c, i) => {
      const m = MIX[i];
      const sw = lerp(m.sw, STROKE, p2);
      const px = lerp(m.px, ICON_PX, p3);
      const dy = lerp(m.dy, 0, p3);
      const col = mix(m.c, COLOR, p3);
      c.svg.style.width = c.svg.style.height = px + 'px';
      c.svg.style.left = (-px / 2) + 'px';
      c.svg.style.top = (-px / 2 + dy) + 'px';
      c.g.setAttribute('stroke', col);
      c.g.setAttribute('stroke-width', sw.toFixed(2));
      c.g.setAttribute('stroke-linecap', p2 > .45 ? 'round' : (i % 2 ? 'square' : 'butt'));
      c.g.setAttribute('stroke-linejoin', p2 > .45 ? 'round' : 'miter');
      c.g.setAttribute('fill', col);
      c.g.setAttribute('fill-opacity', (m.fill * (1 - p2) * .85).toFixed(2));
      c.gr.setAttribute('opacity', (p3 * .5).toFixed(2));
      c.sf.setAttribute('opacity', (p3 * .9).toFixed(2));
    });
    s.guide.style.opacity = (.35 + .65 * p3).toFixed(2);
    s.chips.forEach((c) => {
      const on = L >= c.lv && (c.lv === 2 ? p2 > .5 : p3 > .5);
      c.dot.setAttribute('fill', on ? '#ff8a3d' : 'none');
      c.dot.setAttribute('stroke', on ? '#ff8a3d' : 'rgba(255,255,255,.3)');
      c.ck.setAttribute('opacity', on ? '1' : '0');
      c.c.style.borderColor = on ? 'rgba(255,138,61,.7)' : 'rgba(255,255,255,.18)';
    });
    s.pill.textContent = L === 0 ? '연출 전 · 굵기·크기·채움이 제각각' : (p3 > .5 ? '한 세트 · 24 격자 위에 크기·색까지 통일' : (p2 > .3 ? '규칙 적용 중 · 선 굵기와 끝 모양' : '규칙 없이 모은 아이콘'));
    s.note.textContent = L >= 3 && p3 > .5 ? '점선 사각형은 안쪽 여백 1칸, 옅은 격자는 24×24 칸입니다. 모든 아이콘이 이 안에 들어옵니다.' : '같은 이름의 아이콘이어도 세트가 다르면 굵기와 크기가 달라 한 화면에서 어색해 보입니다.';
  },
};
export default demo;
