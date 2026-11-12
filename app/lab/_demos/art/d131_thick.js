/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/text-outline-shadow-emboss/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 같은 낱말 "봄맞이" 에 아웃라인 → 그림자 → 엠보싱을 하나씩 더한다. 세 칸 모두 DOM 글자에 CSS(-webkit-text-stroke · text-shadow)를 그대로 건다. 화면은 시간 t 의 함수다.
const STROKE = 12;                 // 아웃라인 두께(px)
const SH_DY = 6;                  // 그림자가 아래로 떨어지는 거리(px)
const SH_BLUR = 6;                // 그림자 번짐(px). 0 이면 딱딱한 그림자
const EMB = 2;                    // 엠보싱 밝은 면·어두운 면의 어긋남(px)
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);
const TILES = [
  { name: '아웃라인', bg: 'linear-gradient(150deg,#ffe58f 0%,#ffb066 100%)', col: '#ffffff' },
  { name: '그림자', bg: 'linear-gradient(150deg,#9db9ff 0%,#6f93ec 100%)', col: '#ffffff' },
  { name: '엠보싱', bg: 'linear-gradient(150deg,#9aa3b8 0%,#7b859c 100%)', col: '#8e98ae' },
];
const X0 = 24, TW = 190, GAP = 11;

const demo = {
  dur: 4.6, rest: 4.2, noCompare: false, levels: 4,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: 'linear-gradient(160deg,#0b0f1a 0%,#1a2238 100%)', overflow: 'hidden' });
    const gr = el('div', null, bg);
    box(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.06', mixBlendMode: 'overlay' });
    const tiles = TILES.map((T, i) => {
      const tile = el('div', null, sp);
      box(tile, { position: 'absolute', left: (X0 + i * (TW + GAP)) + 'px', top: '64px', width: TW + 'px', height: '176px', borderRadius: '14px', background: T.bg, overflow: 'hidden', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.35), 0 14px 26px rgba(0,0,0,.45)' });
      const g = el('div', null, tile);
      box(g, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.09', mixBlendMode: 'multiply' });
      const w = el('div', null, tile, '봄맞이');
      box(w, { position: 'absolute', left: '0', right: '0', top: '42px', textAlign: 'center', font: "400 64px/1.2 'Black Han Sans',sans-serif", color: T.col, whiteSpace: 'nowrap' });
      const cap = el('div', null, sp);
      box(cap, { position: 'absolute', left: (X0 + i * (TW + GAP)) + 'px', top: '254px', width: TW + 'px' });
      const nm = el('div', null, cap, T.name);
      box(nm, { font: "700 15px/1.3 'IBM Plex Sans KR',sans-serif", color: '#fff', marginBottom: '4px' });
      const code = el('div', null, cap);
      box(code, { font: "500 11px/1.5 'JetBrains Mono',monospace", color: '#9aa4ba', whiteSpace: 'pre' });
      return { w, code };
    });
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', top: '14px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.66)', color: '#fff', font: "500 15px/1 'IBM Plex Sans KR',sans-serif" });
    return { tiles, pill };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv - 1);   // 단계 1 은 기법을 쓰지 않은 기본 모습(= 연출 전)   // 1 = 아웃라인, 2 = + 그림자, 3 = + 엠보싱
    const p1 = L >= 1 ? E.outC(seg(t, .6, 1.5)) : 0;
    const p2 = L >= 2 ? E.outC(seg(t, 1.9, 2.8)) : 0;
    const p3 = L >= 3 ? E.outC(seg(t, 3.2, 4.1)) : 0;
    const sw = STROKE * p1;
    const o = s.tiles[0];
    o.w.style.webkitTextStroke = sw.toFixed(2) + 'px #1a2238';
    o.w.style.paintOrder = 'stroke fill';
    o.code.textContent = '-webkit-text-stroke:\n' + sw.toFixed(1) + 'px #1a2238';
    const dy = SH_DY * p2, bl = SH_BLUR * p2;
    const h = s.tiles[1];
    h.w.style.textShadow = p2 > 0 ? `0 ${(dy * .35).toFixed(2)}px 0 rgba(10,18,60,.55), 0 ${dy.toFixed(2)}px ${bl.toFixed(2)}px rgba(0,0,0,${(.55 * p2).toFixed(2)})` : 'none';
    h.code.textContent = 'text-shadow: 0 ' + dy.toFixed(1) + 'px ' + bl.toFixed(1) + 'px\nrgba(0,0,0,.55)';
    const e = EMB * p3, m = s.tiles[2];
    m.w.style.textShadow = p3 > 0 ? `${(-e).toFixed(2)}px ${(-e).toFixed(2)}px 0 rgba(255,255,255,.85), ${e.toFixed(2)}px ${e.toFixed(2)}px 0 rgba(30,36,60,.5)` : 'none';
    m.code.textContent = 'text-shadow:\n' + (-e).toFixed(1) + 'px ' + (-e).toFixed(1) + 'px 0 #fff,\n' + e.toFixed(1) + 'px ' + e.toFixed(1) + 'px 0 #1e243c';
    const stage = t < 1.8 ? 1 : (t < 3.1 ? 2 : 3);
    const names = ['', '1단계 · 아웃라인(글자 테두리)', '2단계 · 그림자', '3단계 · 엠보싱(양각)'];
    s.pill.textContent = L === 0 ? '연출 전 · 세 칸 모두 효과 없음' : names[Math.min(stage, L)];
  },
};
export default demo;
