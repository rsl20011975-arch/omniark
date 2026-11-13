/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/text-slice-bounce/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 위 칸: 글자를 가로로 잘라(슬라이스) 어긋난 조각이 제자리로 맞물린다. 아래 칸: 글자가 위에서 떨어져 바닥에 튕긴다(바운스). 마지막 단계에서 조각·글자마다 시차를 둔다. 화면은 시간 t 의 함수다.
const PAL = { bg0: '#eef2f7', bg1: '#dfe6f0', ink: '#0f1b2d', muted: '#5a6a80', accent: '#2b6cff', accent2: '#ff8a3d', surface: '#ffffff', line: '#c3cddc' };
const SLICES = 5;                 // 글자를 가로로 자르는 조각 수
const DROP = 90;                  // 바운스에서 글자가 떨어지기 시작하는 높이(px)
const OFF = 150;                  // 슬라이스 조각이 처음 벗어나 있는 거리(px)
const T1 = .6, D1 = 1.0;          // 슬라이스 시작 시각·걸리는 시간(초)
const T2 = 2.0, D2 = 1.1;         // 바운스 시작 시각·걸리는 시간(초)
const STAG = .09;                 // 3단계: 글자·조각 사이 시차(초)
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgba = (h, a) => 'rgba(' + hex(h).join(',') + ',' + a + ')';
const outBounce = (x) => { const n = 7.5625, d = 2.75; if (x < 1 / d) return n * x * x; if (x < 2 / d) { x -= 1.5 / d; return n * x * x + .75; } if (x < 2.5 / d) { x -= 2.25 / d; return n * x * x + .9375; } x -= 2.625 / d; return n * x * x + .984375; };
const W1 = '쪼개지는 글자', W2 = '통통 튀는 글자';
const FONT = "400 58px/70px 'Black Han Sans',sans-serif";
const PH = 134;                   // 칸 높이

const demo = {
  dur: 4.6, rest: 4.0, noCompare: false, levels: 4,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: `radial-gradient(70% 90% at 80% 0%, rgba(255,255,255,.7), rgba(255,255,255,0) 70%), linear-gradient(160deg,${PAL.bg0} 0%,${PAL.bg1} 100%)`, overflow: 'hidden' });
    const gr = el('div', null, bg);
    box(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.08', mixBlendMode: 'multiply' });
    const panel = (top) => {
      const p = el('div', null, sp);
      box(p, { position: 'absolute', left: '28px', top: top + 'px', width: '584px', height: PH + 'px', borderRadius: '14px', background: `linear-gradient(160deg,${PAL.surface} 0%,#f1f5fb 100%)`, border: `1px solid ${PAL.line}`, boxShadow: `inset 0 1px 0 #fff, 0 2px 4px ${rgba(PAL.ink, 0.08)}, 0 16px 26px -8px ${rgba(PAL.ink, 0.28)}`, overflow: 'hidden' });
      return p;
    };
    const p1 = panel(52), p2 = panel(198);
    const cap = (p, txt) => { const c = el('div', null, p, txt); box(c, { position: 'absolute', left: '16px', top: '114px', font: "500 11px/1 'JetBrains Mono',monospace", color: PAL.muted }); return c; };
    const c1 = cap(p1, ''), c2 = cap(p2, '');
    const strips = [];
    for (let k = 0; k < 8; k++) {
      const d = el('div', null, p1, W1);
      box(d, { position: 'absolute', left: '0', right: '0', top: '40px', textAlign: 'center', font: FONT, color: PAL.ink, whiteSpace: 'nowrap', opacity: '0' });
      strips.push(d);
    }
    const cuts = [];
    for (let k = 0; k < 7; k++) {
      const l = el('div', null, p1);
      box(l, { position: 'absolute', left: '60px', right: '60px', height: '2px', background: `linear-gradient(90deg,transparent,${PAL.accent2},transparent)`, opacity: '0' });
      cuts.push(l);
    }
    const floor = el('div', null, p2);
    box(floor, { position: 'absolute', left: '40px', right: '40px', top: '104px', height: '1px', background: PAL.line });
    const row = el('div', null, p2);
    box(row, { position: 'absolute', left: '0', right: '0', top: '40px', textAlign: 'center', font: FONT, color: PAL.ink, whiteSpace: 'nowrap' });
    const chars = [...W2].map((ch) => {
      const w = el('span', null, row);
      box(w, { position: 'relative', display: 'inline-block' });
      const sh = el('span', null, w);
      box(sh, { position: 'absolute', left: '8%', right: '8%', top: '58px', height: '9px', borderRadius: '50%', background: `radial-gradient(ellipse, ${rgba(PAL.ink, 0.5)}, transparent 70%)`, opacity: '0' });
      const c = el('span', null, w, ch === ' ' ? '&nbsp;' : ch);
      box(c, { display: 'inline-block', opacity: '0' });
      return { c, sh, sp: ch === ' ' };
    });
    // 이름표(numeral): 큰 단계 숫자 + 옆에 13px 설명
    const tag = el('div', null, sp);
    box(tag, { position: 'absolute', left: '28px', top: '5px', display: 'flex', alignItems: 'center', gap: '12px' });
    const num = el('div', null, tag);
    box(num, { font: "400 40px/1 'Black Han Sans',sans-serif", color: PAL.accent, minWidth: '26px' });
    const pill = el('div', null, tag);
    box(pill, { color: PAL.ink, font: "500 13px/1.3 'IBM Plex Sans KR',sans-serif" });
    return { strips, cuts, chars, c1, c2, pill, num };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv - 1);   // 단계 1 은 기법을 쓰지 않은 기본 모습(= 연출 전)   // 1 = 슬라이스, 2 = + 바운스, 3 = + 시차
    const stag = L >= 3 ? STAG : 0, n = SLICES;
    // 위 칸: 슬라이스
    s.strips.forEach((d, k) => {
      if (k >= n) { d.style.opacity = '0'; return; }
      const p = L >= 1 ? E.outExpo(seg(t, T1 + k * stag, T1 + k * stag + D1)) : 1;
      const dir = k % 2 ? 1 : -1;
      d.style.clipPath = `inset(${(k / n * 100).toFixed(2)}% 0 ${((n - k - 1) / n * 100).toFixed(2)}% 0)`;
      d.style.transform = `translateX(${(dir * OFF * (1 - p)).toFixed(2)}px)`;
      d.style.opacity = (L >= 1 ? Math.min(1, seg(t, T1 + k * stag, T1 + k * stag + .25)) : 1).toFixed(2);
    });
    s.cuts.forEach((l, k) => {
      const kk = k + 1;
      if (L < 1 || kk >= n) { l.style.opacity = '0'; return; }
      const q = seg(t, T1 + (kk - 1) * stag, T1 + (kk - 1) * stag + D1 + .3);
      l.style.top = (40 + 35 + (kk / n - .5) * 70) + 'px';
      l.style.opacity = (Math.sin(Math.PI * Math.min(1, q * 1.2)) * .9).toFixed(2);
    });
    // 아래 칸: 바운스
    s.chars.forEach((o, i) => {
      const st = T2 + i * stag, p = seg(t, st, st + D2);
      const hgt = L >= 2 ? (1 - outBounce(p)) * DROP : 0;
      const shown = L >= 2 ? t >= st : true;
      o.c.style.transform = `translateY(${(-hgt).toFixed(2)}px)`;
      o.c.style.opacity = shown ? '1' : '0';
      const k = 1 - Math.min(1, hgt / (DROP + 40)) * .6;
      o.sh.style.transform = `scaleX(${k.toFixed(3)})`;
      o.sh.style.opacity = o.sp || !shown || L < 2 ? '0' : (k * .9).toFixed(2);
    });
    s.c1.textContent = 'clip-path: inset(…) × ' + n + '조각' + (L >= 3 ? ', 조각마다 ' + STAG + '초 시차' : '');
    s.c2.textContent = '떨어지는 높이 ' + DROP + 'px, outBounce' + (L >= 3 ? ', 글자마다 ' + STAG + '초 시차' : '');
    const stage = L >= 2 && t >= T2 - .1 ? 2 : 1;
    const sfx = L >= 3 ? ' + 시차 ' + STAG + '초' : '';
    s.num.textContent = String(L === 0 ? 0 : (L >= 3 ? 3 : stage));
    s.pill.textContent = L === 0 ? '연출 전: 글자가 그냥 놓여 있음' : (stage === 1 ? '슬라이스: 조각이 어긋났다 맞물림' : '바운스: 떨어져 튕김') + sfx;
  },
};
export default demo;
