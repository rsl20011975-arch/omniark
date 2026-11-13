/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/honest-graphic/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

const PAL = { bg0: '#0c1814', bg1: '#15271f', ink: '#e8f1ea', muted: '#86a091', accent: '#7fe0a8', accent2: '#e8d27a', surface: '#12231c', line: '#2b4a3a' };
const WARN = '#ff9d86';     // 어긋남을 알리는 글자색(배경 대비 8:1 이상)

// 사진을 밀고 훑는 카메라와, 그 움직임을 설명하는 작은 도해(속도 곡선, 층 막대). 도해가 카메라의 값을 읽는지 따로 시계를 가졌는지 비교한다.
const Z0 = 1.10;          // 카메라 시작 줌
const PUSH_Z = 0.16;      // 밀기로 늘어나는 줌의 양
const MIX = 0.9;         // 밀기 곡선에 섞는 가속(처음에 느리게 시작) 곡선의 비율
const PUSH_T0 = 0.6, PUSH_D = 2.0;   // 밀기 시작 시각 · 길이(초)
const PAN_T0 = 1.4, PAN_D = 2.0;     // 훑기 시작 시각 · 길이(초)
const R = [10, 32, 70];              // 먼 층 · 가운데 층 · 앞 층이 훑을 때 움직이는 px
const OWN_T0 = 0.3, OWN_D = 1.4;     // 도해가 제 시간표를 가질 때 점의 시작 · 길이(초)
const BAR_T0 = 1.0, BAR_D = 1.4;     // 도해가 제 시간표를 가질 때 막대의 시작 · 길이(초)
const DUR = 4.6;

const io = E.inOutC;
const BL = (k) => Math.min(1, MIX * k * k * k + (1 - MIX) * io(k));    // 카메라가 쓰는 밀기 곡선
const box = (e, o) => Object.assign(e.style, o);
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";

// 한 시각의 모든 값. lv: 0 도해가 제 시계, 1 점이 카메라 시계를 읽음, 2 곡선과 점 높이가 카메라 식, 3 막대도 카메라 값
function vals(t, lv) {
  const k = seg(t, PUSH_T0, PUSH_T0 + PUSH_D), camP = BL(k), pan = io(seg(t, PAN_T0, PAN_T0 + PAN_D));
  const own = seg(t, OWN_T0, OWN_T0 + OWN_D);
  const dotX = lv === 0 ? own : k, dotY = lv === 0 ? own : lv === 1 ? k : camP;
  const bar = lv >= 3 ? pan : seg(t, BAR_T0, BAR_T0 + BAR_D);
  return { k, camP, pan, dotX, dotY, bar, z: Z0 + PUSH_Z * camP };
}
function maxGap(lv) {
  let a = 0, b = 0;
  for (let t = 0; t <= DUR; t += .02) { const v = vals(t, lv); a = Math.max(a, Math.abs(v.dotY - v.camP)); b = Math.max(b, Math.abs(v.bar - v.pan)); }
  return [Math.round(a * 100), Math.round(b * 100)];
}

function layers(frame, W, H) {       // 사진처럼 보이는 정지 장면을 세 층으로 그린다(층마다 따로 움직일 수 있게)
  const OV = 80, WW = W + 2 * OV, r = rng(11), hz = Math.round(H * .62);
  const ridge = (base, amp, f, ph) => { let d = `M0 ${hz}`; for (let i = 0; i <= 64; i++) { const u = i / 64; d += ` L${(u * WW).toFixed(1)} ${(base + amp * (Math.sin(u * f + ph) * .6 + Math.sin(u * f * 2.3 + ph * 1.7) * .3 + (r() - .5) * .3)).toFixed(1)}`; } return d + ` L${WW} ${hz} Z`; };
  const far = ridge(hz - 62, 30, 5.2, .6), mid = ridge(hz - 30, 26, 7.1, 2.2), near = ridge(hz - 6, 12, 9, 4.1);
  let stars = '', ripples = '', pines = '';
  for (let i = 0; i < 30; i++) stars += `<circle cx="${(r() * WW).toFixed(1)}" cy="${(r() * hz * .5).toFixed(1)}" r="${(.4 + r() * .6).toFixed(2)}" fill="#fff" opacity="${(.25 + r() * .5).toFixed(2)}"/>`;
  for (let i = 0; i < 40; i++) { const yy = hz + 6 + r() * (H - hz - 8), x0 = r() * WW, ln = 14 + r() * 60; ripples += `<rect x="${x0.toFixed(1)}" y="${yy.toFixed(1)}" width="${ln.toFixed(1)}" height="${(.6 + (yy - hz) / (H - hz) * 1.4).toFixed(2)}" rx=".6" fill="#ffd9b8" opacity="${(.06 + r() * .1).toFixed(2)}"/>`; }
  for (let i = 0; i < 9; i++) { const x = 20 + i * (WW - 40) / 8 + (r() - .5) * 26, h = 46 + r() * 40, b = H - 6 + r() * 6; pines += `<path d="M${x} ${b - h} L${x + 9} ${b - h * .62} L${x + 4} ${b - h * .62} L${x + 13} ${b - h * .3} L${x + 6} ${b - h * .3} L${x + 16} ${b} L${x - 16} ${b} L${x - 6} ${b - h * .3} L${x - 13} ${b - h * .3} L${x - 4} ${b - h * .62} L${x - 9} ${b - h * .62}Z" fill="#0a0e1b"/>`; }
  const mk = (inner, defs = '') => { const d = el('div', null, frame); box(d, { position: 'absolute', left: -OV + 'px', top: '0', width: WW + 'px', height: H + 'px' }); d.innerHTML = `<svg width="${WW}" height="${H}" viewBox="0 0 ${WW} ${H}" style="display:block"><defs>${defs}<filter id="bl"><feGaussianBlur stdDeviation="1.6"/></filter><clipPath id="lc"><rect x="0" y="${hz}" width="${WW}" height="${H - hz}"/></clipPath></defs>${inner}</svg>`; return d; };
  const mirror = (p) => `<g clip-path="url(#lc)"><g transform="translate(0,${2 * hz}) scale(1,-1)" opacity=".5" filter="url(#bl)">${p}</g></g>`;
  const grads = `<linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2745"/><stop offset=".55" stop-color="#6b6a90"/><stop offset=".85" stop-color="#e29b7c"/><stop offset="1" stop-color="#f6c79a"/></linearGradient>
    <radialGradient id="sn" cx="${(WW * .6 / WW).toFixed(2)}" cy="${(hz / H).toFixed(3)}" r=".4"><stop offset="0" stop-color="#fff0cf" stop-opacity=".95"/><stop offset=".18" stop-color="#ffc58f" stop-opacity=".6"/><stop offset="1" stop-color="#ff9a6a" stop-opacity="0"/></radialGradient>
    <linearGradient id="lk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9a47f"/><stop offset=".3" stop-color="#7c6b8e"/><stop offset="1" stop-color="#1b2340"/></linearGradient>
    <linearGradient id="m1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a789a"/><stop offset="1" stop-color="#c58d8a"/></linearGradient>
    <linearGradient id="m2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4768"/><stop offset="1" stop-color="#8d6c80"/></linearGradient>
    <linearGradient id="m3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d2036"/><stop offset="1" stop-color="#3b3350"/></linearGradient>
    <linearGradient id="bk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1220" stop-opacity="0"/><stop offset="1" stop-color="#070a14"/></linearGradient>`;
  const back = mk(`<rect width="${WW}" height="${hz}" fill="url(#sk)"/><rect width="${WW}" height="${hz}" fill="url(#sn)"/>${stars}<path d="${far}" fill="url(#m1)"/><rect y="${hz}" width="${WW}" height="${H - hz}" fill="url(#lk)"/>${mirror(`<path d="${far}" fill="url(#m1)"/><path d="${mid}" fill="url(#m2)"/>`)}${ripples}<rect y="${hz}" width="${WW}" height="1" fill="#ffe3c2" opacity=".35"/>`, grads);
  const midL = mk(`<path d="${mid}" fill="url(#m2)"/>`, grads);
  const front = mk(`<path d="${near}" fill="url(#m3)"/><rect y="${H - 34}" width="${WW}" height="34" fill="url(#bk)"/>${pines}`, grads);
  return [back, midL, front];
}

function plate(sp, x, y, w, h) {
  const p = el('div', null, sp);
  box(p, { position: 'absolute', left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px', borderRadius: '8px', background: `linear-gradient(160deg, #173026 0%, ${PAL.surface} 75%)`, boxShadow: `inset 0 1px 0 rgba(255,255,255,.06), inset 0 0 0 1px ${PAL.line}, 0 2px 3px rgba(0,0,0,.5), 0 14px 24px rgba(0,0,0,.35)` });
  return p;
}
const txt = (p, s, x, y, o = {}) => { const e = el('div', null, p, s); box(e, Object.assign({ position: 'absolute', left: x + 'px', top: y + 'px', font: "500 10px/1 'JetBrains Mono',monospace", color: PAL.muted, whiteSpace: 'nowrap' }, o)); return e; };

const PX0 = 456, PXW = 148, PY0 = 56, PYH = 70;      // 곡선 그림판(밀기 진행 0~1 × 곡선값 0~1)
const BX0 = 488, BXW = 116, BSCALE = (BXW - 14) / R[2];
const curveD = (fn) => 'M' + Array.from({ length: 41 }, (_, i) => `${(PX0 + PXW * i / 40).toFixed(1)} ${(PY0 + PYH * (1 - fn(i / 40))).toFixed(1)}`).join(' L');

const demo = {
  dur: DUR, rest: 2.0, noCompare: false, levels: 3,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: `linear-gradient(160deg,${PAL.bg0} 0%,${PAL.bg1} 100%)` });
    const gg = el('div', null, bg);
    box(gg, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.06', mixBlendMode: 'overlay' });
    // 영상 틀
    const fr = el('div', null, sp);
    box(fr, { position: 'absolute', left: '24px', top: '22px', width: '384px', height: '216px', borderRadius: '8px', overflow: 'hidden', boxShadow: `0 0 0 1px ${PAL.line}, 0 3px 4px rgba(0,0,0,.5), 0 18px 32px rgba(0,0,0,.45)` });
    const cam = el('div', null, fr);
    box(cam, { position: 'absolute', inset: '0', transformOrigin: '50% 62%' });
    const lay = layers(cam, 384, 216);
    const vg = el('div', null, fr);
    box(vg, { position: 'absolute', inset: '0', background: 'radial-gradient(ellipse at 50% 55%, transparent 55%, rgba(0,0,0,.4) 100%)' });
    const gr = el('div', null, fr);
    box(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.08', mixBlendMode: 'overlay' });
    const ztag = el('div', null, fr);
    box(ztag, { position: 'absolute', right: '8px', top: '8px', padding: '4px 7px', borderRadius: '3px', background: 'rgba(8,16,12,.72)', color: PAL.ink, font: "500 11px/1 'JetBrains Mono',monospace" });
    // 속도 곡선 상자
    const pc = plate(sp, 424, 22, 192, 128);
    txt(pc, '속도 곡선(밀기)', 12, 10, { color: PAL.ink, font: "600 11px/1 'IBM Plex Sans KR',sans-serif" });
    txt(pc, (Z0 + PUSH_Z).toFixed(2), 4, 30); txt(pc, Z0.toFixed(2), 4, 90); txt(pc, '시간 →', 118, 106);
    const svg = el('div', null, sp);
    box(svg, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px', pointerEvents: 'none' });
    svg.innerHTML = `<svg width="640" height="360" viewBox="0 0 640 360"><rect x="${PX0}" y="${PY0}" width="${PXW}" height="${PYH}" fill="none" stroke="${PAL.line}"/>
      <path id="cv" fill="none" stroke="${PAL.muted}" stroke-width="1.6" stroke-linecap="round"/><path id="tr" fill="none" stroke="${PAL.accent}" stroke-width="2.6" stroke-linecap="round"/>
      <line id="gd" stroke="${PAL.accent2}" stroke-dasharray="2 3" opacity=".6"/><circle id="gl" r="9" fill="${PAL.accent2}" opacity=".22"/><circle id="dot" r="4.6" fill="${PAL.accent2}" stroke="#0c1814" stroke-width="1.4"/></svg>`;
    // 층 막대 상자
    const pb = plate(sp, 424, 160, 192, 78);
    txt(pb, '층 막대(훑기, px)', 12, 9, { color: PAL.ink, font: "600 11px/1 'IBM Plex Sans KR',sans-serif" });
    const bars = ['먼 층 10', '가운데 32', '앞 층 70'].map((n, i) => {
      const y = 28 + i * 16;
      txt(pb, n, 10, y + 1);
      const tr = el('div', null, pb);
      box(tr, { position: 'absolute', left: (BX0 - 424) + 'px', top: (y + 4) + 'px', width: BXW + 'px', height: '2px', borderRadius: '1px', background: PAL.line });
      const b = el('div', null, pb);
      box(b, { position: 'absolute', left: (BX0 - 424) + 'px', top: y + 'px', width: '14px', height: '10px', borderRadius: '3px', background: `linear-gradient(180deg, ${PAL.accent}, #4fb27c)`, boxShadow: '0 1px 3px rgba(0,0,0,.5)' });
      return b;
    });
    // 읽는 값 · 이름표(caption-bl)
    const r1 = el('div', null, sp), r2 = el('div', null, sp);
    box(r1, { position: 'absolute', left: '24px', top: '258px', width: '592px', font: "500 12px/1.3 'JetBrains Mono',monospace" });
    box(r2, { position: 'absolute', left: '24px', top: '280px', width: '592px', font: "400 11px/1.3 'JetBrains Mono',monospace", color: PAL.muted });
    const cap = el('div', null, sp);
    box(cap, { position: 'absolute', left: '24px', top: '322px', width: '592px', paddingTop: '8px', borderTop: `1px solid ${PAL.line}`, font: "400 12px/1.2 'JetBrains Mono',monospace", color: PAL.muted });
    const gaps = [0, 1, 2, 3].map(maxGap);
    return { cam, lay, ztag, svg, bars, r1, r2, cap, gaps };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);
    const v = vals(t, L);
    s.cam.style.transform = `scale(${v.z.toFixed(4)})`;
    s.lay.forEach((l, i) => { l.style.transform = `translateX(${(-v.pan * R[i]).toFixed(2)}px)`; });
    s.ztag.textContent = `줌 ${v.z.toFixed(3)}x`;
    const q = (id) => s.svg.querySelector('#' + id);
    const sx = (u) => PX0 + PXW * u, sy = (u) => PY0 + PYH * (1 - u);
    q('cv').setAttribute('d', curveD(L >= 2 ? BL : io));
    const pts = [];
    for (let i = 0; i <= 40; i++) { const u = i / 40; if (u <= v.dotX) pts.push(`${sx(u).toFixed(1)} ${sy(L >= 2 ? BL(u) : io(u)).toFixed(1)}`); }
    q('tr').setAttribute('d', pts.length ? 'M' + pts.join(' L') : '');
    const cx = sx(v.dotX), cy = sy(v.dotY);
    ['dot', 'gl'].forEach((id) => { q(id).setAttribute('cx', cx.toFixed(1)); q(id).setAttribute('cy', cy.toFixed(1)); });
    const gd = q('gd'); gd.setAttribute('x1', cx.toFixed(1)); gd.setAttribute('x2', cx.toFixed(1)); gd.setAttribute('y1', cy.toFixed(1)); gd.setAttribute('y2', (PY0 + PYH).toFixed(1));
    s.bars.forEach((b, i) => { b.style.transform = `translateX(${(v.bar * R[i] * BSCALE).toFixed(2)}px)`; });
    const ratio = v.camP > .02 ? v.dotY / v.camP : null;
    const bad1 = ratio != null && Math.abs(ratio - 1) > .005, bad2 = Math.abs(v.bar - v.pan) > .005;
    s.r1.textContent = `밀기  카메라 ${v.camP.toFixed(3)}   도해 ${v.dotY.toFixed(3)}   비율 ${ratio == null ? '-' : ratio.toFixed(2)}`;
    s.r1.style.color = bad1 ? WARN : PAL.accent;
    s.r2.textContent = `훑기  카메라 ${v.pan.toFixed(3)}   막대 ${v.bar.toFixed(3)}   구간 최대 어긋남  밀기 ${s.gaps[L][0]}%  훑기 ${s.gaps[L][1]}%`;
    s.r2.style.color = bad2 ? WARN : PAL.muted;
    s.cap.textContent = ['도해가 제 시간표로 움직임: 카메라와 따로', '점이 카메라의 시계를 읽음: 높이는 아직 직선', '점이 카메라와 같은 곡선 위를 지나감', '막대도 카메라가 훑은 값 그대로'][L];
  },
};
export default demo;
