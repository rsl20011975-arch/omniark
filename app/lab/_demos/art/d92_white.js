/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/dissolve-fade/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, E, el } from "./helpers.js";

const PAL = { bg0: '#eef2f7', bg1: '#dfe6f0', ink: '#0f1b2d', muted: '#5a6a80', accent: '#2b6cff', accent2: '#ff8a3d', surface: '#ffffff', line: '#c5d0e0' };
const rgba = (h, a) => `rgba(${parseInt(h.slice(1, 3), 16)},${parseInt(h.slice(3, 5), 16)},${parseInt(h.slice(5, 7), 16)},${a})`;

// 장면 3개를 '컷 → 디졸브 → 딥 투 블랙' 순서로 이어 붙인다. 화면은 시간 t 의 함수다.
const T1 = 1.8, DIS = 1.0;            // 첫 전환: 디졸브가 시작하는 시각 · 길이(초)
const T2 = 4.4, DIP = .5, HOLD = .2;  // 둘째 전환: 딥 시작 시각 · 사라지는/나타나는 시간 · 완전히 가린 채 머무는 시간
const DIPC = '#fff', DIPN = '화이트';    // 딥에 쓰는 색과 이름
const SCENES = [
  { t: '09:00', c: '사무실 · 회의 시작', bg: `linear-gradient(160deg,${PAL.bg0} 0%,#b9cdee 58%,#7ea2dd 100%)`, glow: 'rgba(255,255,255,.85)', gx: '78%', gy: '16%', side: 'left', y: 92, fg: PAL.ink, sh: 'rgba(255,255,255,.55)' },
  { t: '13:00', c: '카페 · 점심', bg: `linear-gradient(160deg,#fff1e2 0%,#ffc995 55%,${PAL.accent2} 100%)`, glow: 'rgba(255,236,205,.8)', gx: '24%', gy: '20%', side: 'right', y: 56, fg: PAL.ink, sh: 'rgba(255,255,255,.45)' },
  { t: '23:00', c: '집 · 하루 끝', bg: `linear-gradient(160deg,#07101f 0%,${PAL.ink} 45%,#2a3d7a 100%)`, glow: 'rgba(150,175,255,.45)', gx: '70%', gy: '22%', side: 'left', y: 150, fg: '#f4f7ff', sh: 'rgba(0,0,0,.4)' },
];
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";

function scene(sp, d) {
  const s = el('div', null, sp);
  Object.assign(s.style, { position: 'absolute', inset: '0', background: d.bg, overflow: 'hidden' });
  const g1 = el('div', null, s), g2 = el('div', null, s);  // 빛은 반경이 다른 두 겹
  Object.assign(g1.style, { position: 'absolute', inset: '0', background: `radial-gradient(circle at ${d.gx} ${d.gy}, ${d.glow}, transparent 52%)` });
  Object.assign(g2.style, { position: 'absolute', inset: '0', background: `radial-gradient(circle at ${d.gx} ${d.gy}, rgba(255,255,255,.5), transparent 16%)` });
  const n = el('div', null, s, d.t);
  Object.assign(n.style, { position: 'absolute', [d.side]: '44px', top: d.y + 'px', textAlign: d.side, font: "400 118px/1 'Black Han Sans',sans-serif", color: d.fg, letterSpacing: '-.02em', textShadow: `0 6px 28px ${d.sh}` });
  const c = el('div', null, s, d.c);
  Object.assign(c.style, { position: 'absolute', [d.side]: '48px', top: (d.y + 130) + 'px', textAlign: d.side, font: "500 22px/1.2 'IBM Plex Sans KR',sans-serif", color: d.fg, textShadow: `0 2px 12px ${d.sh}` });
  const gr = el('div', null, s);
  Object.assign(gr.style, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.07', mixBlendMode: 'overlay' });
  return s;
}

const demo = {
  dur: 6.6, rest: 6.0, noCompare: false, levels: 3,
  mount(sp) {
    const sc = SCENES.map((d) => scene(sp, d));
    const black = el('div', null, sp);
    Object.assign(black.style, { position: 'absolute', inset: '0', background: DIPC, opacity: '0' });
    // 이름표(numeral): 현재 단계 번호 + 지금 보여 주는 것
    const lab = el('div', null, sp);
    Object.assign(lab.style, { position: 'absolute', left: '16px', top: '12px', display: 'flex', alignItems: 'center', gap: '10px', padding: '3px 14px 3px 12px', borderRadius: '6px', background: rgba(PAL.surface, .9), boxShadow: `0 4px 14px ${rgba(PAL.ink, .22)}, inset 0 0 0 1px ${PAL.line}` });
    const num = el('div', null, lab);
    Object.assign(num.style, { font: "400 40px/1.1 'Black Han Sans',sans-serif", color: PAL.accent });
    const pill = el('div', null, lab);
    Object.assign(pill.style, { font: "500 13px/1.2 'IBM Plex Sans KR',sans-serif", color: PAL.ink });
    const mix = el('div', null, sp);
    Object.assign(mix.style, { position: 'absolute', right: '16px', top: '16px', padding: '6px 10px', borderRadius: '6px', background: rgba(PAL.surface, .9), boxShadow: `inset 0 0 0 1px ${PAL.line}`, color: PAL.ink, font: "500 13px/1 'JetBrains Mono',monospace", opacity: '0' });
    const track = el('div', null, sp);
    Object.assign(track.style, { position: 'absolute', left: '20px', right: '100px', bottom: '22px', height: '8px', borderRadius: '4px', background: rgba(PAL.surface, .6), boxShadow: `inset 0 0 0 1px ${rgba(PAL.ink, .3)}` });
    const z1 = el('div', null, track), z2 = el('div', null, track);
    Object.assign(z1.style, { position: 'absolute', top: '0', height: '8px', borderRadius: '4px', background: PAL.accent, left: (T1 / 6.6 * 100) + '%', width: (DIS / 6.6 * 100) + '%' });
    Object.assign(z2.style, { position: 'absolute', top: '0', height: '8px', borderRadius: '4px', background: DIPC, boxShadow: `0 0 0 1.5px ${rgba(PAL.ink, .6)}`, left: (T2 / 6.6 * 100) + '%', width: ((2 * DIP + HOLD) / 6.6 * 100) + '%' });
    const head = el('div', null, track);
    Object.assign(head.style, { position: 'absolute', top: '-4px', width: '3px', height: '16px', borderRadius: '2px', background: PAL.ink, boxShadow: `0 0 0 1.5px ${PAL.surface}` });
    return { sc, black, pill, num, mix, head, z1, z2 };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);
    const cut1 = T1 + DIS / 2, cut2 = T2 + DIP + HOLD / 2;
    const pd = E.inOutC(seg(t, T1, T1 + DIS));
    s.sc[0].style.opacity = 1;
    s.sc[1].style.opacity = L >= 2 ? pd : (t >= cut1 ? 1 : 0);
    let bo = 0, c = t >= cut2 ? 1 : 0;
    if (L >= 3) {
      c = t >= T2 + DIP ? 1 : 0;
      bo = t < T2 + DIP + HOLD ? E.inOutC(seg(t, T2, T2 + DIP)) : 1 - E.inOutC(seg(t, T2 + DIP + HOLD, T2 + 2 * DIP + HOLD));
    }
    s.sc[2].style.opacity = c;
    s.black.style.opacity = bo;
    const inD = L >= 2 && t > T1 && t < T1 + DIS, inP = L >= 3 && t > T2 && t < T2 + 2 * DIP + HOLD;
    s.num.textContent = String(Math.max(1, L));
    s.pill.textContent = L === 0 || L === 1 ? '컷 · 전환 효과 없음' : inD ? `디졸브 ${DIS.toFixed(1)}초 · 두 장면이 겹침` : inP ? `딥 투 ${DIPN} · 시간이 건너뜀` : t < T1 ? '장면 1' : t < T2 ? '장면 2' : '장면 3';
    s.mix.style.opacity = inD ? 1 : 0;
    if (inD) s.mix.textContent = `앞 ${Math.round((1 - pd) * 100)}% + 뒤 ${Math.round(pd * 100)}%`;
    s.z1.style.display = L >= 2 ? 'block' : 'none';
    s.z2.style.display = L >= 3 ? 'block' : 'none';
    s.head.style.left = `calc(${(t / 6.6 * 100).toFixed(2)}% - 1px)`;
  },
};
export default demo;
