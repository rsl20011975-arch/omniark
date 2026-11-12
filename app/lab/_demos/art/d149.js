/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/bounce-in/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 바운스 인: 떨어져 바닥에 닿은 뒤 매번 이전 높이의 e² 배로 낮게 튕기다 멎는 등장. 반발 계수 e 가 클수록 높이 오래 튄다. 화면은 시간 t 의 함수다.
const E_REST = .5;                // 반발 계수 e(0~1). 튕김 높이는 이전 높이의 e² 배
const SQUASH = .22;               // 바닥에 닿는 순간 찌그러지는 정도(0 = 안 찌그러짐)
const BOUNCES = 3;                // 튕기는 횟수
const T0 = .3, FALL = .5, H = 300;   // 출발 시각(초) · 처음 떨어지는 시간(초) · 떨어지는 높이(px)
const DURT = 4, GY = 300, CX = 210, CW = 132, CH = 84;
const G = 2 * H / (FALL * FALL);
const IMP = [{ t: FALL, s: 1 }];   // 바닥에 닿는 시각 · 닿는 속도(처음의 몇 배)
for (let n = 1; n <= BOUNCES; n++) IMP.push({ t: IMP[n - 1].t + 2 * Math.pow(E_REST, n) * FALL, s: Math.pow(E_REST, n) });
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);
const NS = 'http://www.w3.org/2000/svg';
const sv = (tag, at, par) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (par) par.appendChild(e); return e; };
const MONO = "'JetBrains Mono',monospace";
function height(tt, nb) {   // 카드 아래쪽 면의 바닥으로부터 높이(px)
  if (tt < 0) return H;
  if (tt < FALL) return H * (1 - (tt / FALL) * (tt / FALL));
  for (let n = 1; n <= nb; n++) {
    const st = IMP[n - 1].t, du = 2 * Math.pow(E_REST, n) * FALL;
    if (tt < st + du) { const tau = tt - st; return G * Math.pow(E_REST, n) * FALL * tau - .5 * G * tau * tau; }
  }
  return 0;
}

const demo = {
  dur: DURT, rest: 3.4, noCompare: false, levels: 3,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: 'linear-gradient(160deg,#0b0f1a 0%,#161d30 100%)' });
    box(el('div', null, bg), { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.06', mixBlendMode: 'overlay' });
    const floor = el('div', null, sp);
    box(floor, { position: 'absolute', left: '0', top: GY + 'px', width: '420px', height: (360 - GY) + 'px', background: 'linear-gradient(180deg,rgba(255,255,255,.10),rgba(255,255,255,.02))', borderTop: '1px solid rgba(255,255,255,.28)' });
    const shadow = el('div', null, sp), ring = el('div', null, sp);
    box(shadow, { position: 'absolute', left: (CX - 80) + 'px', top: (GY - 1) + 'px', width: '160px', height: '22px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,0,0,.6), transparent 70%)' });
    box(ring, { position: 'absolute', left: (CX - 40) + 'px', top: (GY - 6) + 'px', width: '80px', height: '14px', borderRadius: '50%', border: '2px solid rgba(255,190,130,.8)', opacity: '0' });
    const card = el('div', null, sp);
    box(card, { position: 'absolute', left: (CX - CW / 2) + 'px', top: (GY - CH) + 'px', width: CW + 'px', height: CH + 'px', borderRadius: '14px', background: 'linear-gradient(155deg,#ffc27d 0%,#ff7a5c 100%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.6), inset 0 -10px 16px rgba(160,40,20,.3), 0 10px 20px rgba(0,0,0,.4)', transformOrigin: '50% 100%' });
    card.innerHTML = "<svg width='132' height='84' viewBox='0 0 132 84' style='position:absolute;left:0;top:0'><circle cx='30' cy='42' r='15' fill='rgba(255,255,255,.92)'/><path d='M23 42 L28.5 47.5 L38 36.5' fill='none' stroke='#ff7a5c' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/><rect x='54' y='30' width='60' height='8' rx='4' fill='rgba(255,255,255,.9)'/><rect x='54' y='46' width='40' height='8' rx='4' fill='rgba(255,255,255,.55)'/></svg>";
    // 오른쪽: 높이-시간 그래프
    const svg = sv('svg', { width: 640, height: 360, viewBox: '0 0 640 360' }, sp);
    box(svg, { position: 'absolute', left: '0', top: '0' });
    sv('rect', { x: 436, y: 50, width: 188, height: 176, rx: 12, fill: 'rgba(255,255,255,.045)', stroke: 'rgba(255,255,255,.09)' }, svg);
    const t1 = sv('text', { x: 448, y: 72, fill: '#fff', 'font-size': 12, 'font-weight': 700, 'font-family': "'IBM Plex Sans KR',sans-serif" }, svg); t1.textContent = '높이 · 시간 그래프';
    sv('line', { x1: 446, y1: 208, x2: 614, y2: 208, stroke: 'rgba(255,255,255,.35)' }, svg);
    const t2 = sv('text', { x: 614, y: 220, fill: 'rgba(255,255,255,.5)', 'font-size': 9, 'font-family': MONO, 'text-anchor': 'end' }, svg); t2.textContent = '바닥(높이 0)';
    const curve = sv('polyline', { fill: 'none', stroke: '#ffb36b', 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, svg);
    const dot = sv('circle', { r: 4.5, fill: '#fff', stroke: '#ff7a5c', 'stroke-width': 2 }, svg);
    const rd = el('div', null, sp);
    box(rd, { position: 'absolute', left: '436px', top: '236px', width: '190px', font: `500 11px/1.6 ${MONO}`, color: 'rgba(255,255,255,.78)' });
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', top: '14px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.66)', color: '#fff', font: "500 14px/1 'IBM Plex Sans KR',sans-serif", zIndex: 5 });
    return { card, shadow, ring, curve, dot, rd, pill };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 떨어져서 멈춤, 2 = + 튕김, 3 = + 찌그러짐·그림자·충격 고리
    const nb = L >= 2 ? BOUNCES : 0, tt = t - T0;
    const h = height(tt, nb);
    const vel = (height(tt + .01, nb) - height(tt - .01, nb)) / .02;
    let sy = 1, sx = 1, q = 0, rg = 0, rs = 0;
    if (L >= 3) {
      IMP.slice(0, nb + 1).forEach((im) => {
        const w = seg(tt, im.t, im.t + .15);
        if (w > 0 && w < 1) q += im.s * Math.sin(Math.PI * w);
        const r = seg(tt, im.t, im.t + .45);
        if (r > 0 && r < 1 && im.s > rs) { rg = r; rs = im.s; }
      });
      const st = .07 * Math.min(1, Math.abs(vel) / (G * FALL)) * (h > 2 ? 1 : 0);
      sy = 1 - SQUASH * Math.min(1, q) + st; sx = 1 + SQUASH * .7 * Math.min(1, q) - st * .6;
    }
    s.card.style.transform = `translateY(${(-h).toFixed(1)}px) scale(${sx.toFixed(3)},${sy.toFixed(3)})`;
    const hs = L >= 3 ? Math.max(0, 1 - h / 220) : 1;
    s.shadow.style.transform = `scale(${(.55 + .45 * hs).toFixed(3)})`; s.shadow.style.opacity = (.35 + .65 * hs).toFixed(3);
    s.ring.style.opacity = L >= 3 && rs > 0 ? ((1 - rg) * .7 * Math.min(1, rs + .3)).toFixed(3) : '0';
    s.ring.style.transform = `scale(${(.6 + 2.0 * rg).toFixed(3)})`;
    const pts = [];
    for (let i = 0; i <= 140; i++) { const tm = i / 140 * DURT; pts.push(`${(446 + tm / DURT * 168).toFixed(1)},${(208 - height(tm - T0, nb) / H * 106).toFixed(1)}`); }
    s.curve.setAttribute('points', pts.join(' '));
    s.dot.setAttribute('cx', (446 + t / DURT * 168).toFixed(1)); s.dot.setAttribute('cy', (208 - Math.min(H, h) / H * 106).toFixed(1));
    const pk = [1, 2, 3].map((n) => Math.round(H * Math.pow(E_REST, 2 * n)));
    s.rd.innerHTML = L >= 2 ? `반발 계수 e = ${E_REST}<br>튕김 높이 = 이전 × e² = ×${(E_REST * E_REST).toFixed(2)}<br>1~3번째 튕김 ${pk.join(' · ')}px` : '튕김 없음<br>닿으면 속도가 0이 되어 멈춤';
    s.pill.textContent = L <= 1 ? '연출 전 · 떨어져서 그대로 멈춤' : L === 2 ? `바운스 · 반발 계수 ${E_REST} · ${BOUNCES}번 튕김` : '찌그러짐·그림자·충격 고리가 튕김에 맞춰 변함';
  },
};
export default demo;
