/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/emphasis-chain/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

const PAL = { bg0: '#171615', bg1: '#232120', ink: '#f2efe9', muted: '#9a958c', accent: '#5ad1c8', accent2: '#f2b84b', surface: '#1f1d1b', line: '#3a3733' };
const rgba = (h, a) => `rgba(${parseInt(h.slice(1, 3), 16)},${parseInt(h.slice(3, 5), 16)},${parseInt(h.slice(5, 7), 16)},${a})`;

// 말이 부르는 순서대로 요소 하나씩 강조하고, 부르지 않는 요소는 한 단계 물러난다. 화면은 시간 t 의 함수다.
const PUNCH = 1.07;       // 강조 때 커지는 배율(1 = 그대로)
const DIM = 0.35;         // 말하지 않는 요소가 물러나는 밝기(1 = 그대로, 낮을수록 어둡다)
const STAGGER = 0.15;     // 요소가 차례로 들어오는 간격(초)
const HOLD = 0.9;         // 강조를 붙들고 있는 시간(초)
const OVER = 2.4;         // 강조가 목표를 지나쳤다 돌아오는 세기
const CUES = [1.6, 3.0, 4.4, 5.8];   // 말이 각 요소를 부르는 시각(초)
const NAMES = ['사진', '가격', '평점', '위치'];
const DUR = 7.4;

const ob = (x, s) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2));   // 목표를 살짝 지나쳤다 안착
const io2 = (x) => (x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const oq = (x) => 1 - (1 - x) * (1 - x);
const box = (e, o) => Object.assign(e.style, o);
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";

const CARD = [{ x: 28, y: 40, w: 300, h: 208 }, { x: 352, y: 40, w: 260, h: 62 }, { x: 352, y: 113, w: 260, h: 62 }, { x: 352, y: 186, w: 260, h: 62 }];
const ENTER0 = 0.1, ENTER_D = 0.55;

// 강조 파형: 커졌다가(오버슈트) 돌아온다 / 물러남 파형: 말하는 동안 다른 요소가 어두워졌다 돌아온다
function emph(t, c) {
  if (t < c) return 0;
  return t < c + HOLD ? ob(seg(t, c, c + .28), OVER) : 1 - io2(seg(t, c + HOLD, c + HOLD + .5));
}
function dimEnv(t, c) { return oq(seg(t, c, c + .3)) * (1 - io2(seg(t, c + HOLD, c + HOLD + .45))); }

// 요소 i 의 값. lv: 0 = 연출 전, 1 강조, 2 물러남, 3 대기 모션, 4 등장 순서
function state(i, t, lv) {
  let sc = 1, op = 1, y = 0, g = 0;
  const enterEnd = lv >= 4 ? ENTER0 + STAGGER * 3 + ENTER_D : 0;
  if (lv >= 4) {
    const s0 = ENTER0 + STAGGER * i, b = ob(seg(t, s0, s0 + ENTER_D), 1.5);
    y = (1 - b) * 26; sc = .9 + .1 * b; op = E.outC(seg(t, s0, s0 + .35));
  }
  if (lv >= 1) { const e = emph(t, CUES[i]); sc *= 1 + (PUNCH - 1) * e; g = Math.max(0, Math.min(1, e)); }
  if (lv >= 2) {
    let d = 0;
    CUES.forEach((c, j) => { if (j !== i) d = Math.max(d, dimEnv(t, c)); });
    op *= 1 - (1 - DIM) * d;
  }
  if (lv >= 3) {
    const b = .5 - .5 * Math.cos(2 * Math.PI * t / 1.7 + i * 1.1);
    sc *= 1 + .025 * b * (1 - g) * seg(t, enterEnd, enterEnd + .4);
  }
  return { sc, op, y, g };
}
function sweepAt(t, lv) {      // 사진 카드 위를 지나가는 빛줄기 위치(0~1), 없으면 -1
  if (lv < 3 || t < .3) return -1;
  const per = 2.4, ph = ((t - .3) % per) / (per * .7);
  return ph > 1 ? -1 : E.inOutC(ph);
}
function stillness(lv) {       // 요소 값이 거의 안 변하는 0.1초 구간의 비율(요소 값 기준이며 영상 프레임 자와는 다르다)
  let still = 0, n = 0, prev = null;
  for (let t = 0; t <= DUR + 1e-9; t += .1) {
    const cur = [0, 1, 2, 3].flatMap((i) => { const s = state(i, t, lv); return [s.sc * 40, s.op * 40, s.y]; }).concat([sweepAt(t, lv) * 80]);
    if (prev) { n++; if (cur.every((v, k) => Math.abs(v - prev[k]) < .02)) still++; }
    prev = cur;
  }
  return Math.round(still / n * 100);
}
function peakScale() { let m = 0; for (let u = 0; u <= 1; u += .005) m = Math.max(m, ob(u, OVER)); return 1 + (PUNCH - 1) * m; }

function scenery(parent, W, H) {       // 사진처럼 보이는 정지 장면: 해 질 녘 호수와 산(코드로 그린 그림)
  const r = rng(11), hz = Math.round(H * .6);
  const ridge = (base, amp, f, ph) => { let d = `M0 ${hz}`; for (let i = 0; i <= 56; i++) { const u = i / 56; d += ` L${(u * W).toFixed(1)} ${(base + amp * (Math.sin(u * f + ph) * .6 + Math.sin(u * f * 2.3 + ph * 1.7) * .3 + (r() - .5) * .3)).toFixed(1)}`; } return d + ` L${W} ${hz} Z`; };
  const far = ridge(hz - 58, 30, 5.2, .6), mid = ridge(hz - 28, 26, 7.1, 2.2), near = ridge(hz - 6, 12, 9, 4.1);
  let stars = '', ripples = '';
  for (let i = 0; i < 26; i++) stars += `<circle cx="${(r() * W).toFixed(1)}" cy="${(r() * hz * .5).toFixed(1)}" r="${(.4 + r() * .6).toFixed(2)}" fill="#fff" opacity="${(.25 + r() * .5).toFixed(2)}"/>`;
  for (let i = 0; i < 34; i++) { const yy = hz + 6 + r() * (H - hz - 8), x0 = r() * W, ln = 14 + r() * 60; ripples += `<rect x="${x0.toFixed(1)}" y="${yy.toFixed(1)}" width="${ln.toFixed(1)}" height="${(.6 + (yy - hz) / (H - hz) * 1.4).toFixed(2)}" rx=".6" fill="#ffd9b8" opacity="${(.06 + r() * .1).toFixed(2)}"/>`; }
  const d = el('div', null, parent);
  box(d, { position: 'absolute', inset: '0', overflow: 'hidden' });
  d.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:block"><defs>
    <linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2745"/><stop offset=".55" stop-color="#6b6a90"/><stop offset=".85" stop-color="#e29b7c"/><stop offset="1" stop-color="#f6c79a"/></linearGradient>
    <radialGradient id="sn" cx=".64" cy="${(hz / H).toFixed(3)}" r=".55"><stop offset="0" stop-color="#fff0cf" stop-opacity=".95"/><stop offset=".18" stop-color="#ffc58f" stop-opacity=".6"/><stop offset="1" stop-color="#ff9a6a" stop-opacity="0"/></radialGradient>
    <linearGradient id="lk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9a47f"/><stop offset=".3" stop-color="#7c6b8e"/><stop offset="1" stop-color="#1b2340"/></linearGradient>
    <linearGradient id="m1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a789a"/><stop offset="1" stop-color="#c58d8a"/></linearGradient>
    <linearGradient id="m2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4768"/><stop offset="1" stop-color="#8d6c80"/></linearGradient>
    <linearGradient id="m3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d2036"/><stop offset="1" stop-color="#3b3350"/></linearGradient>
    <filter id="bl"><feGaussianBlur stdDeviation="1.6"/></filter>
    <clipPath id="lc"><rect x="0" y="${hz}" width="${W}" height="${H - hz}"/></clipPath></defs>
    <rect width="${W}" height="${hz}" fill="url(#sk)"/><rect width="${W}" height="${hz}" fill="url(#sn)"/>${stars}
    <path d="${far}" fill="url(#m1)"/><path d="${mid}" fill="url(#m2)"/><path d="${near}" fill="url(#m3)"/>
    <rect y="${hz}" width="${W}" height="${H - hz}" fill="url(#lk)"/>
    <g clip-path="url(#lc)"><g transform="translate(0,${2 * hz}) scale(1,-1)" opacity=".5" filter="url(#bl)"><path d="${far}" fill="url(#m1)"/><path d="${mid}" fill="url(#m2)"/><path d="${near}" fill="url(#m3)"/></g></g>
    ${ripples}<rect y="${hz}" width="${W}" height="1" fill="#ffe3c2" opacity=".35"/></svg>`;
  const gr = el('div', null, d);
  box(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.09', mixBlendMode: 'overlay' });
  const vg = el('div', null, d);
  box(vg, { position: 'absolute', inset: '0', background: 'radial-gradient(ellipse at 50% 55%, transparent 55%, rgba(0,0,0,.38) 100%)' });
}

const ICON = {
  tag: '<path d="M3 11.2V4.6A1.6 1.6 0 0 1 4.6 3h6.6a1.6 1.6 0 0 1 1.1.5l7.2 7.2a1.6 1.6 0 0 1 0 2.2l-6.6 6.6a1.6 1.6 0 0 1-2.2 0L3.5 12.3A1.6 1.6 0 0 1 3 11.2Z"/><circle cx="8" cy="8" r="1.6" fill="#1f1d1b"/>',
  star: '<path d="M12 2.6l2.9 6 6.5.9-4.7 4.6 1.1 6.5L12 17.5l-5.8 3.1 1.1-6.5L2.6 9.5l6.5-.9z"/>',
  pin: '<path d="M12 2.5a7 7 0 0 0-7 7c0 5 7 12 7 12s7-7 7-12a7 7 0 0 0-7-7Z"/><circle cx="12" cy="9.5" r="2.6" fill="#1f1d1b"/>',
};

function infoCard(parent, c, icon, label, value) {
  const d = el('div', null, parent);
  box(d, { position: 'absolute', left: c.x + 'px', top: c.y + 'px', width: c.w + 'px', height: c.h + 'px', borderRadius: '10px', background: `linear-gradient(160deg, #272422 0%, ${PAL.surface} 70%)`, boxShadow: `inset 0 1px 0 rgba(255,255,255,.07), inset 0 0 0 1px ${PAL.line}, 0 2px 3px rgba(0,0,0,.5), 0 14px 26px rgba(0,0,0,.38)` });
  d.innerHTML = `<svg width="26" height="26" viewBox="0 0 24 24" fill="${PAL.accent2}" style="position:absolute;left:18px;top:18px">${icon}</svg>
    <div style="position:absolute;left:58px;top:12px;font:500 11px/1 'IBM Plex Sans KR',sans-serif;color:${PAL.muted};letter-spacing:.02em">${label}</div>
    <div style="position:absolute;left:58px;top:27px;font:400 26px/1 'Black Han Sans',sans-serif;color:${PAL.ink}">${value}</div>`;
  const gr = el('div', null, d);
  box(gr, { position: 'absolute', inset: '0', borderRadius: '10px', backgroundImage: GRAIN, opacity: '.05', mixBlendMode: 'overlay', pointerEvents: 'none' });
  return d;
}

const demo = {
  dur: DUR, rest: 3.35, noCompare: false, levels: 4,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: `linear-gradient(160deg,${PAL.bg0} 0%,${PAL.bg1} 100%)` });
    const gl = el('div', null, bg);
    box(gl, { position: 'absolute', inset: '0', background: 'radial-gradient(circle at 70% 30%, rgba(242,184,75,.10), transparent 55%)' });
    const gg = el('div', null, bg);
    box(gg, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.06', mixBlendMode: 'overlay' });
    const cards = CARD.map((c, i) => {
      const w = el('div', null, sp);
      box(w, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px', pointerEvents: 'none' });
      const inner = el('div', null, w);
      box(inner, { position: 'absolute', left: c.x + 'px', top: c.y + 'px', width: c.w + 'px', height: c.h + 'px' });
      const rel = { x: 0, y: 0, w: c.w, h: c.h };
      if (i === 0) {
        const f = el('div', null, inner);
        box(f, { position: 'absolute', inset: '0', borderRadius: '12px', overflow: 'hidden', boxShadow: `0 0 0 1px ${PAL.line}, 0 3px 4px rgba(0,0,0,.5), 0 18px 34px rgba(0,0,0,.45)` });
        scenery(f, c.w, c.h);
        const lane = el('div', null, f);
        box(lane, { position: 'absolute', inset: '0', overflow: 'hidden', borderRadius: '12px', pointerEvents: 'none' });
        const bar = el('div', null, lane);
        box(bar, { position: 'absolute', top: '-30px', width: '80px', height: '270px', background: 'linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,.18), rgba(255,255,255,0))', transform: 'skewX(-18deg)', opacity: '0' });
        return { w: inner, bar };
      }
      const ic = [null, ICON.tag, ICON.star, ICON.pin][i], lb = [null, '1박 가격', '평점', '호수까지'][i], vl = [null, '₩84,000', '4.7 / 5', '120m'][i];
      const d = infoCard(inner, { x: 0, y: 0, w: rel.w, h: rel.h }, ic, lb, vl);
      return { w: inner, bar: null, d };
    });
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '28px', top: '10px', padding: '.5em 1em', borderRadius: '999px', background: PAL.surface, color: PAL.ink, boxShadow: `inset 0 0 0 1px ${PAL.line}, 0 3px 10px rgba(0,0,0,.4)`, font: "600 12px/1 'IBM Plex Sans KR',sans-serif", zIndex: 6 });
    const track = el('div', null, sp);
    box(track, { position: 'absolute', left: '28px', top: '299px', width: '584px', height: '2px', borderRadius: '1px', background: PAL.line });
    const ticks = CUES.map((c, i) => {
      const x = 28 + 584 * c / DUR;
      const dot = el('div', null, sp);
      box(dot, { position: 'absolute', left: (x - 5) + 'px', top: '295px', width: '10px', height: '10px', borderRadius: '50%', background: PAL.surface, boxShadow: `0 0 0 1.5px ${PAL.muted}` });
      const lab = el('div', null, sp, NAMES[i]);
      box(lab, { position: 'absolute', left: (x - 30) + 'px', top: '310px', width: '60px', textAlign: 'center', font: "500 11px/1 'IBM Plex Sans KR',sans-serif", color: PAL.muted });
      return { dot, lab };
    });
    const head = el('div', null, sp);
    box(head, { position: 'absolute', top: '288px', width: '2px', height: '24px', borderRadius: '1px', background: PAL.ink, boxShadow: '0 0 0 1px rgba(23,22,21,.8)' });
    const cap = el('div', null, sp);
    box(cap, { position: 'absolute', left: '28px', top: '334px', width: '584px', paddingTop: '10px', borderTop: `1px solid ${PAL.line}`, font: "400 11px/1.2 'JetBrains Mono',monospace", color: PAL.muted });
    const still = [0, 1, 2, 3, 4].map(stillness), pk = peakScale();
    return { cards, pill, ticks, head, cap, still, pk };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 4 : lv);
    let who = -1;
    CUES.forEach((c, i) => { if (t >= c && t < c + HOLD + .3) who = i; });
    CARD.forEach((c, i) => {
      const st = state(i, t, L), n = s.cards[i];
      box(n.w, { transform: `translateY(${st.y.toFixed(2)}px) scale(${st.sc.toFixed(4)})`, transformOrigin: '50% 50%', opacity: st.op.toFixed(3), filter: st.g > .01 ? `drop-shadow(0 0 ${(22 * st.g).toFixed(1)}px ${rgba(PAL.accent2, (.6 * st.g).toFixed(3))})` : 'none' });
      if (n.bar) { const p = sweepAt(t, L); box(n.bar, { opacity: p < 0 ? '0' : '1', left: p < 0 ? '0px' : lerp(-120, c.w + 40, p).toFixed(1) + 'px' }); }
    });
    s.ticks.forEach((k, i) => {
      const on = L >= 1 && t >= CUES[i] && t < CUES[i] + HOLD;
      box(k.dot, { background: on ? PAL.accent2 : PAL.surface, boxShadow: on ? `0 0 0 1.5px ${PAL.accent2}, 0 0 10px ${rgba(PAL.accent2, .6)}` : `0 0 0 1.5px ${PAL.muted}` });
      box(k.lab, { color: on ? PAL.ink : PAL.muted });
    });
    s.head.style.left = (28 + 584 * Math.min(t, DUR) / DUR - 1).toFixed(1) + 'px';
    let label;
    if (L === 0) label = '정지 · 말이 불러도 변하지 않음';
    else if (who >= 0) label = `지금 강조: ${NAMES[who]}`;
    else if (L >= 4 && t < ENTER0 + STAGGER * 3 + ENTER_D) label = '요소가 차례로 등장';
    else label = L >= 3 ? '대기: 숨 쉬며 빛이 훑는 중' : '다음 호출을 기다리는 중';
    s.pill.textContent = label;
    s.cap.textContent = `정지 구간 ${s.still[L]}% (요소 값 기준)   최대 크기 x${(L >= 1 ? s.pk : 1).toFixed(3)}   물러남 밝기 ${L >= 2 ? DIM : 1}`;
  },
};
export default demo;
