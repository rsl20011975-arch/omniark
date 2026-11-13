/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/color-meaning/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 막대마다 다른 색(의미 없음) → 모두 한 색(기본) → 가장 중요한 한 곳만 주황(강조). 색마다 '약속'을 정해 주는 장면이다. 화면은 시간 t 의 함수다.
// 틀(배경·카드·이름표)은 회색 계열만 쓴다. 주황은 '강조 한 곳'이 내용이라 틀에는 한 번도 쓰지 않는다.
const PAL = { bg0: '#f2f2f0', bg1: '#e4e4e1', ink: '#111111', muted: '#666666', accent: '#ff3b1f', accent2: '#111111', surface: '#ffffff', line: 'rgba(17,17,17,.14)' };
const ACCENT = '#3b82f6';         // 강조색: 화면 전체에서 '지금 볼 것' 한 곳에만 쓴다
const BASE = '#5b6a86';           // 기본색: 나머지 전부
const HI = [5];                   // 강조할 막대 번호(0부터). 하나만 두는 것이 약속이다
const box = (e, o) => Object.assign(e.style, o);
const RAINBOW = ['#e5484d', '#f5a524', '#f2d75a', '#3fb950', '#3b82f6', '#9b6bdf'];
const DATA = [['2월', 4.2], ['3월', 5.1], ['4월', 6], ['5월', 7.4], ['6월', 9], ['7월', 12.4]];
const MAXV = 12.4, MAXH = 186, BASEY = 300, BW = 44, GAP = 20, X0 = 28;
const FONT = "'IBM Plex Sans KR',sans-serif", MONO = "'JetBrains Mono',monospace";
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, p) => 'rgb(' + hex(a).map((v, i) => Math.round(lerp(v, hex(b)[i], p))).join(',') + ')';

const demo = {
  dur: 4, rest: 3.6, noCompare: false, levels: 3,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: `linear-gradient(160deg,${PAL.bg0} 0%,${PAL.bg1} 100%)` });
    const grain = el('div', null, sp);
    box(grain, { position: 'absolute', inset: '0', opacity: '.12', mixBlendMode: 'multiply', backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' seed='7'/><feColorMatrix type='saturate' values='0'/></filter><rect width='120' height='120' filter='url(%23n)'/></svg>\")" });
    const put = (css, text, par) => { const e = el('div', null, par || sp, text); box(e, Object.assign({ position: 'absolute' }, css)); return e; };
    put({ left: '12px', top: '50px', width: '424px', height: '298px', borderRadius: '14px', background: PAL.accent2, boxShadow: '0 18px 30px rgba(17,17,17,.26), 0 2px 5px rgba(17,17,17,.22), inset 0 1px 0 rgba(255,255,255,.14)' }, '');
    put({ left: '28px', top: '58px', font: `700 15px/1 ${FONT}`, color: PAL.surface }, '월별 신규 구독자 (만 명)');
    put({ left: '20px', width: '410px', top: BASEY + 'px', height: '1px', background: 'rgba(255,255,255,.2)' }, '');
    const bars = DATA.map(([m, v], i) => {
      const h = v / MAXV * MAXH, x = X0 + i * (BW + GAP);
      const b = put({ left: x + 'px', top: (BASEY - h) + 'px', width: BW + 'px', height: h + 'px', borderRadius: '6px 6px 2px 2px', transformOrigin: '50% 100%', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.25)' }, '');
      const val = put({ left: (x - 10) + 'px', width: (BW + 20) + 'px', textAlign: 'center', top: (BASEY - h - 22) + 'px', font: `500 13px/1 ${MONO}`, color: 'rgba(255,255,255,.7)', transformOrigin: '50% 100%' }, v.toFixed(1));
      put({ left: (x - 10) + 'px', width: (BW + 20) + 'px', textAlign: 'center', top: (BASEY + 8) + 'px', font: `500 12px/1 ${FONT}`, color: 'rgba(255,255,255,.62)' }, m);
      return { b, val, h, x };
    });
    const last = HI[HI.length - 1], lb = bars[last];
    const chip = put({ left: (lb.x - 14) + 'px', top: (BASEY - lb.h - 58) + 'px', width: (BW + 28) + 'px', height: '26px', borderRadius: '13px', background: ACCENT, color: '#1a0f06', font: `700 13px/26px ${FONT}`, textAlign: 'center', transformOrigin: '50% 100%', boxShadow: '0 6px 14px rgba(0,0,0,.4)' }, '최고 +38%');
    const card = put({ left: '448px', top: '50px', width: '172px', height: '298px', borderRadius: '14px', background: `linear-gradient(170deg,${PAL.surface},#f0f0ee)`, border: `1px solid ${PAL.line}`, boxShadow: '0 14px 24px rgba(17,17,17,.14), 0 2px 4px rgba(17,17,17,.12), inset 0 1px 0 #fff' }, '');
    put({ left: '16px', top: '16px', font: `700 14px/1 ${FONT}`, color: PAL.ink }, '이 화면의 색 약속', card);
    const rows = [0, 1].map((i) => {
      const y = 52 + i * 84;
      const sw = put({ left: '16px', top: (y + 2) + 'px', width: '22px', height: '22px', borderRadius: '6px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.3), 0 0 0 1px rgba(17,17,17,.12)' }, '', card);
      const t1 = put({ left: '48px', top: y + 'px', font: `700 13px/1.1 ${FONT}`, color: PAL.ink }, '', card);
      const t2 = put({ left: '16px', top: (y + 32) + 'px', width: '142px', font: `400 12px/1.4 ${FONT}`, color: PAL.muted }, '', card);
      return { sw, t1, t2 };
    });
    const pill = put({ left: '20px', top: '16px', padding: '7px 14px', borderRadius: '999px', background: PAL.accent2, color: PAL.surface, font: `500 15px/1 ${FONT}` }, '');
    return { bars, chip, rows, pill, last };
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 3 : lv);   // 1 = 막대마다 다른 색, 2 = 한 색으로 통일, 3 = 중요한 곳만 주황
    const g2 = L >= 2 ? E.inOutC(seg(t, 1.5, 2.1)) : 0;    // 무지개 → 기본색
    const g3 = L >= 3 ? E.inOutC(seg(t, 2.3, 2.8)) : 0;    // 기본색 → 주황(강조 막대만)
    s.bars.forEach((o, i) => {
      const p = E.outC(seg(t, .2 + i * .09, .75 + i * .09));
      const hi = HI.includes(i);
      let col = mix(RAINBOW[i], BASE, g2);
      if (hi && g3 > 0) col = mix(BASE, ACCENT, g3);
      o.b.style.background = col;
      o.b.style.transform = `scaleY(${p.toFixed(3)})`;
      o.val.style.opacity = p.toFixed(2);
      o.val.style.transform = `translateY(${((1 - p) * 8).toFixed(1)}px)`;
      const pop = hi && L >= 3 ? 1 + .28 * E.outBack(seg(t, 2.4, 2.9)) - .28 : 1;
      o.val.style.fontSize = (13 * pop).toFixed(1) + 'px';
      o.val.style.color = hi && g3 > .5 ? ACCENT : 'rgba(255,255,255,.7)';
      o.val.style.fontWeight = hi && g3 > .5 ? '700' : '500';
    });
    const cp = L >= 3 ? E.outBack(seg(t, 2.6, 3.1)) : 0;
    s.chip.style.opacity = cp > 0 ? Math.min(1, cp).toFixed(2) : '0';
    s.chip.style.transform = `scale(${Math.max(0, cp).toFixed(3)})`;
    const [r0, r1] = s.rows;
    const on2 = L >= 2 && g2 > .5, on3 = L >= 3 && g3 > .5;
    r0.sw.style.background = on2 ? BASE : 'conic-gradient(' + RAINBOW.join(',') + ',' + RAINBOW[0] + ')';
    r0.t1.textContent = on2 ? '기본: 회청색' : '약속 없음';
    r0.t2.textContent = on2 ? '나머지 막대와 숫자는 모두 이 색 하나.' : '막대마다 다른 색이라 어디를 봐야 할지 알 수 없다.';
    r1.sw.style.background = on3 ? ACCENT : 'rgba(17,17,17,.08)';
    r1.sw.style.opacity = on3 ? '1' : '.5';
    r1.t1.textContent = on3 ? '강조: 한 가지 색' : '강조: 비어 있음';
    r1.t1.style.opacity = on3 ? '1' : '.5';
    r1.t2.textContent = on3 ? '지금 볼 한 곳에만. 막대·숫자·칩 모두 같은 주황.' : '아직 정하지 않았다.';
    r1.t2.style.opacity = on3 ? '1' : '.5';
    s.pill.textContent = on3 ? '의미 있는 한 곳만 강조색' : (on2 ? '한 가지 색으로 통일' : '막대마다 다른 색, 의미 없음');
  },
};
export default demo;
