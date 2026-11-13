/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/dark-light-mode/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 같은 화면을 라이트에서 다크로 바꾼다. 연출 전은 색을 그냥 뒤집어 컷으로, 연출 후는 다크 색을 따로 정하고 토글 위치에서 원이 퍼지며 바뀐다. 화면은 시간 t 의 함수다.
const TRANS = .7;                 // 전환 시간(초). 원이 퍼지는 길이
const ORIGIN = [320, 180];         // 원이 시작하는 점(토글 스위치의 가운데)
const T_SW = 1;                   // 토글을 누른 뒤 전환이 시작하는 시각(초)
const DARK_BG = '#0f1320';        // 다크 배경(순검정이 아니라 어두운 남색)
// 장면(주문 현황 화면)의 라이트·다크 색은 이 페이지의 내용이라 그대로 두고, 아래 띠(이름표 자리)만 팔레트를 쓴다
const PAL = { bg0: '#1b0e17', bg1: '#2b1424', ink: '#f6e9ee', muted: '#b095a3', accent: '#ff7aa8', accent2: '#ffd0a0', surface: '#26121f', line: 'rgba(246,233,238,.22)' };
const box = (e, o) => Object.assign(e.style, o);

const LIGHT = { bg: '#eef1f6', card: '#ffffff', text: '#161b26', sub: '#5b6578', line: '#d9dfea', accent: '#e8590c', accentText: '#ffffff', dim: '#cbd3e1', chip: '#e1f5ea', chipText: '#0f6a3e', shadow: '0 4px 14px rgba(20,30,60,.10)' };
const hex3 = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const inv = (h) => '#' + hex3(h).map((v) => (255 - v).toString(16).padStart(2, '0')).join('');
const INVERT = Object.fromEntries(Object.entries(LIGHT).map(([k, v]) => [k, v[0] === '#' ? inv(v) : 'none']));   // CSS invert(1) 과 같은 계산
const DESIGNED = { bg: DARK_BG, card: '#181e30', text: '#e6e9f0', sub: '#98a2b8', line: '#2a3248', accent: '#ff9a4d', accentText: '#1a0f06', dim: '#2f3a55', chip: '#123524', chipText: '#6fdc9c', shadow: 'inset 0 1px 0 rgba(255,255,255,.05)' };
const lum = (h) => { const c = hex3(h).map((v) => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
const BARS = [40, 56, 48, 72, 64, 96, 80];
const FONT = "'IBM Plex Sans KR',sans-serif";

function ui(parent, P, dark) {
  const root = el('div', null, parent);
  box(root, { position: 'absolute', left: '0', top: '0', right: '0', bottom: '44px', background: P.bg, overflow: 'hidden' });
  const put = (css, text, par) => { const e = el('div', null, par || root, text); box(e, Object.assign({ position: 'absolute' }, css)); return e; };
  const hd = put({ left: '0', top: '0', right: '0', height: '44px', background: P.card, borderBottom: '1px solid ' + P.line }, '');
  put({ left: '20px', top: '13px', font: `700 16px/1 ${FONT}`, color: P.text }, '주문 현황');
  const track = put({ left: '556px', top: '10px', width: '48px', height: '24px', borderRadius: '12px', background: dark ? P.accent : P.dim }, '');
  const knob = put({ left: '2px', top: '2px', width: '20px', height: '20px', borderRadius: '50%', background: dark ? P.accentText : '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.35)' }, '', track);
  knob.innerHTML = dark
    ? `<svg viewBox="0 0 20 20" width="20" height="20"><path d="M12.6 4.4 A6 6 0 1 0 15.6 12.4 A5 5 0 0 1 12.6 4.4 Z" fill="${P.accent}"/></svg>`
    : `<svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="3.2" fill="none" stroke="#e8590c" stroke-width="1.6"/><path d="M10 3.2 V5 M10 15 V16.8 M3.2 10 H5 M15 10 H16.8 M5.2 5.2 L6.4 6.4 M13.6 13.6 L14.8 14.8 M14.8 5.2 L13.6 6.4 M6.4 13.6 L5.2 14.8" stroke="#e8590c" stroke-width="1.5" stroke-linecap="round"/></svg>`;
  const card = (x, w) => put({ left: x + 'px', top: '60px', width: w + 'px', height: '190px', borderRadius: '14px', background: P.card, boxShadow: P.shadow, border: '1px solid ' + P.line }, '');
  const c1 = card(20, 300), c2 = card(336, 284);
  put({ left: '18px', top: '16px', font: `500 12px/1 ${FONT}`, color: P.sub }, '오늘 방문자', c1);
  put({ left: '18px', top: '34px', font: `700 36px/1.1 ${FONT}`, color: P.text }, '1,284', c1);
  put({ left: '130px', top: '44px', padding: '4px 9px', borderRadius: '10px', background: P.chip, color: P.chipText, font: `700 12px/1 ${FONT}` }, '+12%', c1);
  const bars = BARS.map((h, i) => put({ left: (18 + i * 40) + 'px', bottom: '16px', width: '28px', height: h + 'px', borderRadius: '5px 5px 2px 2px', background: i === 5 ? P.accent : P.dim, transformOrigin: '50% 100%' }, '', c1));
  put({ left: '18px', top: '16px', font: `700 14px/1 ${FONT}`, color: P.text }, '최근 알림', c2);
  [['새 주문 3건', '방금'], ['후기 2개 도착', '5분 전'], ['재고 부족 1건', '1시간 전']].forEach(([a, b], i) => {
    const y = 48 + i * 46;
    put({ left: '18px', top: y + 'px', width: '248px', height: '1px', background: P.line }, '', c2);
    put({ left: '18px', top: (y + 16) + 'px', width: '9px', height: '9px', borderRadius: '50%', background: i === 0 ? P.accent : P.dim }, '', c2);
    put({ left: '36px', top: (y + 14) + 'px', font: `500 14px/1 ${FONT}`, color: P.text }, a, c2);
    put({ right: '18px', top: (y + 15) + 'px', font: `400 12px/1 ${FONT}`, color: P.sub }, b, c2);
  });
  const btn = put({ left: '20px', top: '268px', width: '150px', height: '42px', borderRadius: '10px', background: P.accent, color: P.accentText, font: `700 15px/42px ${FONT}`, textAlign: 'center' }, '리포트 보기');
  put({ left: '188px', top: '281px', font: `400 12px/1 ${FONT}`, color: P.sub }, '마지막 갱신 10:42', root);
  return { root, knob, bars };
}

const demo = {
  dur: 3.8, rest: 3.4, noCompare: false, levels: 3,
  mount(sp) {
    const lightUI = ui(sp, LIGHT, false);
    const naive = ui(sp, INVERT, true), designed = ui(sp, DESIGNED, true);
    const ring = el('div', null, sp);
    box(ring, { position: 'absolute', borderRadius: '50%', border: '2px solid rgba(255,255,255,.35)', opacity: '0', boxSizing: 'border-box' });
    const bar = el('div', null, sp);
    box(bar, { position: 'absolute', left: '0', right: '0', bottom: '0', height: '44px', background: `linear-gradient(180deg,${PAL.bg1} 0%,${PAL.bg0} 100%)`, borderTop: `1px solid ${PAL.line}` });
    const num = el('div', null, sp);
    box(num, { position: 'absolute', left: '18px', top: '319px', font: "400 40px/1 'Black Han Sans',sans-serif", color: PAL.accent });
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '54px', top: '331px', font: `500 13px/1.2 ${FONT}`, color: PAL.ink });
    const rd = el('div', null, sp);
    box(rd, { position: 'absolute', right: '18px', top: '332px', font: "400 12px/1.2 'JetBrains Mono',monospace", color: PAL.muted });
    return { lightUI, naive, designed, ring, pill, rd, num };
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 3 : lv);   // 1 = 색만 뒤집고 컷, 2 = 다크 색을 따로 정해 컷, 3 = + 원이 퍼지는 전환
    const dk = L >= 2 ? s.designed : s.naive;
    s.naive.root.style.display = L >= 2 ? 'none' : 'block';
    s.designed.root.style.display = L >= 2 ? 'block' : 'none';
    const p = L >= 3 ? E.inOutC(seg(t, T_SW, T_SW + TRANS)) : (t >= T_SW ? 1 : 0);
    const far = Math.max(...[[0, 0], [640, 0], [0, 360], [640, 360]].map(([x, y]) => Math.hypot(x - ORIGIN[0], y - ORIGIN[1])));
    const r = p * far;
    dk.root.style.clipPath = `circle(${r.toFixed(1)}px at ${ORIGIN[0]}px ${ORIGIN[1]}px)`;
    s.ring.style.left = (ORIGIN[0] - r) + 'px'; s.ring.style.top = (ORIGIN[1] - r) + 'px';
    s.ring.style.width = s.ring.style.height = (2 * r) + 'px';
    s.ring.style.opacity = L >= 3 && p > 0 && p < 1 ? (.9 * (1 - p)).toFixed(2) : '0';
    [s.lightUI, s.naive, s.designed].forEach((u) => u.bars.forEach((b, i) => { b.style.transform = `scaleY(${E.outC(seg(t, .1 + i * .07, .6 + i * .07)).toFixed(3)})`; }));
    const kp = E.inOutC(seg(t, T_SW - .3, T_SW));   // 토글을 누르는 동안 손잡이가 오른쪽으로
    s.lightUI.knob.style.left = lerp(2, 26, kp) + 'px';
    dk.knob.style.left = '26px';
    const darkNow = p > .5;
    const P = darkNow ? (L >= 2 ? DESIGNED : INVERT) : LIGHT;
    s.num.textContent = p <= 0 ? '1' : (p < 1 ? '2' : '3');
    s.pill.textContent = L === 1 ? (darkNow ? '색만 뒤집은 다크, 컷으로 전환' : '라이트') : (L === 2 ? (darkNow ? '다크 색을 따로 정함, 컷으로 전환' : '라이트') : (p > 0 && p < 1 ? '전환 중: ' + TRANS + '초 동안 토글에서 원이 퍼짐' : (darkNow ? '다크: 따로 설계한 색' : '라이트')));
    s.rd.textContent = '글자 대비 ' + ratio(P.text, P.card).toFixed(1) + ':1, 배경 ' + P.bg;
  },
};
export default demo;
