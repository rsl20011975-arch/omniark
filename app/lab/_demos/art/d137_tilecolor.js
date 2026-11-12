/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/illustration-pictogram/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 같은 '카페' 뜻을 일러스트(분위기·이야기)와 픽토그램(한눈에 읽히는 기호)으로 그려, 같은 크기로 줄여 가며 비교한다. 그림은 직접 그린 SVG 이고, 화면은 시간 t 의 함수다.
const TILE = '#c2410c';           // 픽토그램 바탕색(안내 표지 파랑)
const FILL = .62;                 // 기호가 타일 한 변에서 차지하는 비율(나머지는 안쪽 여백)
const SIZES = [150, 80, 44, 24];  // 줄여 보는 크기(px)
const box = (e, o) => Object.assign(e.style, o);

// 일러스트: 색·질감·그림자·배경이 있는 장면
const ILLU = `<svg viewBox="0 0 120 120" width="100%" height="100%"><defs>
<linearGradient id="ib" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe6bf"/><stop offset="1" stop-color="#f3ae80"/></linearGradient>
<linearGradient id="iw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd4ff"/><stop offset="1" stop-color="#e5f4ff"/></linearGradient>
<linearGradient id="it" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a8744a"/><stop offset="1" stop-color="#6e4428"/></linearGradient>
<linearGradient id="ic" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e3d6c4"/><stop offset=".35" stop-color="#ffffff"/><stop offset="1" stop-color="#d9c9b4"/></linearGradient>
<radialGradient id="ik" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#8a5530"/><stop offset="1" stop-color="#3d2110"/></radialGradient>
<clipPath id="ir"><rect width="120" height="120" rx="12"/></clipPath></defs>
<g clip-path="url(#ir)"><rect width="120" height="120" fill="url(#ib)"/>
<rect x="12" y="12" width="46" height="42" rx="3" fill="#8a5a3a"/><rect x="15" y="15" width="40" height="36" fill="url(#iw)"/>
<path d="M15 51 C20 40 26 40 30 46 C34 36 42 36 46 44 C49 40 53 42 55 46 V51 Z" fill="#5da05a"/><circle cx="44" cy="24" r="5" fill="#fff6c8"/>
<path d="M35 15 V51 M15 33 H55" stroke="#8a5a3a" stroke-width="2"/>
<path d="M78 14 C84 10 92 10 98 14 L96 30 H80 Z" fill="#d8573c"/><path d="M80 30 H96 V36 H80 Z" fill="#b8402a"/>
<rect y="86" width="120" height="34" fill="url(#it)"/><path d="M0 98 H120 M0 110 H120" stroke="rgba(0,0,0,.18)" stroke-width="1"/>
<ellipse cx="60" cy="92" rx="36" ry="8" fill="rgba(40,20,8,.35)"/><ellipse cx="60" cy="88" rx="32" ry="7" fill="#fff"/><ellipse cx="60" cy="87" rx="26" ry="5" fill="#eadfce"/>
<path d="M82 60 C100 56 100 80 80 78" fill="none" stroke="#e6d8c4" stroke-width="6" stroke-linecap="round"/>
<path d="M36 56 H84 V70 C84 82 74 90 60 90 C46 90 36 82 36 70 Z" fill="url(#ic)"/>
<ellipse cx="60" cy="56" rx="24" ry="6" fill="url(#ik)"/><path d="M60 60 C50 55 52 51 56 52 C58 52 60 54 60 54 C60 54 62 52 64 52 C68 51 70 55 60 60 Z" fill="#f4e4cc"/>
<path d="M48 44 C42 38 54 34 48 26 M62 44 C56 38 68 34 62 24 M74 44 C68 38 80 34 74 28" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="2.4" stroke-linecap="round"/>
<ellipse cx="22" cy="100" rx="5" ry="3.2" fill="#3a1f10"/><ellipse cx="32" cy="106" rx="5" ry="3.2" fill="#4a2814" transform="rotate(30 32 106)"/><ellipse cx="102" cy="102" rx="5" ry="3.2" fill="#3a1f10" transform="rotate(-20 102 102)"/>
</g></svg>`;

// 픽토그램: 한 색 면, 단순한 도형. 기호는 100×100 칸을 가득 채우게 그린 뒤 FILL 비율로 줄여 타일에 앉힌다
const SYM = {
  cafe: `<path d="M12 38 H68 V60 Q68 82 46 82 H34 Q12 82 12 60 Z"/><path d="M68 46 H78 Q88 46 88 56 Q88 68 76 68 H66" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 92 H78" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="M28 10 Q22 17 28 23 Q34 29 28 33 M50 10 Q44 17 50 23 Q56 29 50 33" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>`,
  wc: `<circle cx="28" cy="14" r="9"/><rect x="16" y="28" width="24" height="36" rx="6"/><rect x="18" y="62" width="8" height="30" rx="3"/><rect x="30" y="62" width="8" height="30" rx="3"/><circle cx="74" cy="14" r="9"/><path d="M74 28 L92 72 H56 Z" stroke="#fff" stroke-width="4" stroke-linejoin="round"/><rect x="66" y="70" width="6" height="22" rx="3"/><rect x="76" y="70" width="6" height="22" rx="3"/><path d="M50 10 V92" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
  info: `<circle cx="50" cy="50" r="42" fill="none" stroke="#fff" stroke-width="8"/><circle cx="50" cy="28" r="6.5"/><rect x="43.5" y="40" width="13" height="34" rx="3"/>`,
};
const picto = (k) => `<svg viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" rx="14" fill="${TILE}"/><g fill="#fff" transform="translate(50 50) scale(${FILL}) translate(-50 -50)">${SYM[k]}</g></svg>`;
const NAMES = { cafe: '카페', wc: '화장실', info: '안내' };

const demo = {
  dur: 4.8, rest: 4.4, noCompare: false, levels: 3,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: 'linear-gradient(160deg,#0b0f1a 0%,#171e33 100%)' });
    const floor = el('div', null, sp);
    box(floor, { position: 'absolute', left: '40px', right: '40px', top: '268px', height: '1px', background: 'rgba(255,255,255,.16)' });
    const mk = (html, x, y, px, lab) => {
      const w = el('div', null, sp);
      box(w, { position: 'absolute', left: x + 'px', top: y + 'px', width: px + 'px', height: px + 'px', transformOrigin: '50% 100%', filter: 'drop-shadow(0 8px 10px rgba(0,0,0,.4))' });
      w.innerHTML = html;
      const l = el('div', null, sp, lab);
      box(l, { position: 'absolute', left: (x - 20) + 'px', width: (px + 40) + 'px', top: (y + px + 8) + 'px', textAlign: 'center', font: "500 12px/1 'JetBrains Mono',monospace", color: 'rgba(255,255,255,.7)' });
      return { w, l };
    };
    const total = SIZES.reduce((a, b) => a + b, 0) + (SIZES.length - 1) * 36;
    let x = (640 - total) / 2;
    const row = (html) => SIZES.map((px) => { const o = mk(html, x, 268 - 6 - px, px, px + 'px'); x += px + 36; return o; });
    const ill = row(ILLU);
    x = (640 - total) / 2;
    const pic = row(picto('cafe'));
    const keys = ['cafe', 'wc', 'info'];
    const bigs = keys.map((k, i) => { const o = mk(picto(k), 100 + i * 160, 62, 120, NAMES[k] + ' · 120px'); return o; });
    const smalls = keys.map((k, i) => { const o = mk(picto(k), 100 + i * 160 + 46, 218, 28, '28px'); return o; });
    const cap = el('div', null, sp);
    box(cap, { position: 'absolute', left: '40px', right: '40px', top: '312px', textAlign: 'center', font: "400 13px/1.4 'IBM Plex Sans KR',sans-serif", color: 'rgba(255,255,255,.66)' });
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', top: '18px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.66)', color: '#fff', font: "500 15px/1 'IBM Plex Sans KR',sans-serif" });
    return { ill, pic, bigs, smalls, cap, pill, floor };
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 3 : lv);   // 1 = 일러스트만, 2 = 픽토그램으로 교체, 3 = 픽토그램 세트
    const show = (o, k, base) => {   // o: {w,l}, k: 0~1 보이는 정도
      o.w.style.opacity = o.l.style.opacity = k.toFixed(3);
      o.w.style.transform = `scale(${(base * (.8 + .2 * k)).toFixed(3)})`;
    };
    const s2 = L >= 2 ? E.inOutC(seg(t, 1.9, 2.5)) : 0;   // 일러스트 → 픽토그램
    const s3 = L >= 3 ? E.inOutC(seg(t, 3.4, 4.0)) : 0;   // 픽토그램 한 개 → 세트
    s.ill.forEach((o, i) => show(o, E.outC(seg(t, .2 + i * .25, .6 + i * .25)) * (1 - s2), 1));
    s.pic.forEach((o, i) => show(o, Math.min(1, seg(t, 1.9 + i * .12, 2.4 + i * .12)) * (L >= 2 ? 1 : 0) * (1 - s3), 1));
    s.bigs.forEach((o, i) => show(o, Math.min(1, seg(t, 3.4 + i * .12, 3.9 + i * .12)) * (L >= 3 ? 1 : 0), 1));
    s.smalls.forEach((o, i) => show(o, Math.min(1, seg(t, 3.6 + i * .12, 4.1 + i * .12)) * (L >= 3 ? 1 : 0), 1));
    s.floor.style.opacity = String(1 - s3);
    s.pill.textContent = s3 > .5 ? '픽토그램 세트 · 바탕·여백·선 굵기를 맞춤' : (s2 > .5 ? '픽토그램 · 한 색과 단순한 도형' : '일러스트 · 크기를 줄여 보기');
    s.cap.textContent = s3 > .5 ? '같은 바탕색, 같은 안쪽 여백(' + Math.round(FILL * 100) + '%), 같은 선 굵기로 맞추면 한 표지판 계열로 읽힙니다.' : (s2 > .5 ? '150px 에서 24px 까지 줄여도 컵과 김이 한눈에 읽힙니다.' : '150px 에서는 멋지지만 24px 로 줄이면 창·탁자·김·컵을 구분하기 어렵습니다.');
  },
};
export default demo;
