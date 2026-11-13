/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/layered-blur/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 왼쪽은 떠 있는 카드의 그림자, 오른쪽은 켜진 전구의 빛. 둘 다 '블러 한 번'과 '반경이 다른 여러 겹'을 비교한다. 화면은 시간 t 의 함수다.
// 왼쪽 카드의 밝은 바탕(그림자가 보이려면 밝아야 함)과 카드·전구의 색은 이 페이지의 내용이라 그대로 두고, 오른쪽 어두운 바탕·캡션·이름표만 팔레트(deepblue)를 쓴다
const PAL = { bg0: '#1f3a8a', bg1: '#172a63', ink: '#f3f6ff', muted: '#aebcf0', accent: '#ffd166', accent2: '#7fe0ff', surface: '#1b3274', line: 'rgba(243,246,255,.28)' };
const LIFT = 24;                  // 카드가 떠 있는 높이에 해당하는 그림자 오프셋(px). 겹마다 이 값의 1/16·1/8·1/4·1/2·1 배
const GLOW_POWER = 1;            // 빛 번짐 세기 배율(1 = 100%)
const SHADOW_A = .35;              // 그림자 겹 하나의 불투명도
const GLOW_MAX = 64;              // 빛 번짐의 가장 큰 반경(px). 겹마다 이 값의 1/16·3/16·7/16·1 배
const box = (e, o) => Object.assign(e.style, o);
const FONT = "'IBM Plex Sans KR',sans-serif", MONO = "'JetBrains Mono',monospace";
const f1 = (v) => (Math.round(v * 10) / 10).toString();
const SH_F = [1 / 16, 1 / 8, 1 / 4, 1 / 2, 1], GL_F = [1 / 16, 3 / 16, 7 / 16, 1], GL_A = [1, .8, .62, .5], GL_S = [0, 2, 8, 16];

const demo = {
  dur: 3.4, rest: 3, noCompare: false, levels: 3,
  mount(sp) {
    const put = (css, text, par) => { const e = el('div', null, par || sp, text); box(e, Object.assign({ position: 'absolute' }, css)); return e; };
    const L = put({ left: '0', top: '0', width: '320px', height: '360px', overflow: 'hidden', background: 'linear-gradient(170deg,#eef1f7 0%,#d3dae8 100%)' }, '');
    const R = put({ left: '320px', top: '0', width: '320px', height: '360px', overflow: 'hidden', background: `linear-gradient(170deg,${PAL.bg0} 0%,${PAL.bg1} 100%)` }, '');
    const card = put({ left: '85px', top: '78px', width: '150px', height: '196px', borderRadius: '18px', background: 'linear-gradient(170deg,#ffffff 0%,#f1f4fa 100%)', border: '1px solid rgba(255,255,255,.9)' }, '', L);
    const img = put({ left: '8px', top: '8px', width: '132px', height: '94px', borderRadius: '12px', background: 'radial-gradient(circle at 35% 30%,#e3b078 0%,#b97a45 50%,#6e3f22 100%)', overflow: 'hidden' }, '', card);
    [[22, 50, -30], [62, 28, 20], [96, 56, 50], [48, 70, 80]].forEach(([x, y, r]) => put({ left: x + 'px', top: y + 'px', width: '26px', height: '15px', borderRadius: '50%', background: 'radial-gradient(circle at 40% 30%,#6b3d20,#2c160a)', transform: `rotate(${r}deg)`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,.2)' }, '', img));
    put({ left: '12px', top: '112px', font: `700 15px/1 ${FONT}`, color: '#1c2233' }, '에티오피아 원두', card);
    put({ left: '12px', top: '134px', font: `400 12px/1.3 ${FONT}`, color: '#5b6578' }, '200g · 라이트 로스트', card);
    put({ left: '12px', top: '166px', font: `700 16px/1 ${FONT}`, color: '#1c2233' }, '18,000원', card);
    put({ right: '12px', top: '160px', padding: '6px 14px', borderRadius: '999px', background: '#e8590c', color: '#fff', font: `700 12px/1 ${FONT}` }, '담기', card);
    const capL = put({ left: '0', width: '320px', top: '300px', textAlign: 'center', font: `500 12px/1.4 ${MONO}`, color: PAL.bg1, whiteSpace: 'pre' }, '', L);
    put({ left: '159px', top: '0', width: '2px', height: '112px', background: 'linear-gradient(180deg,#8fa0d6,#6f82c4)' }, '', R);
    const sock = put({ left: '143px', top: '182px', width: '34px', height: '28px', borderRadius: '3px 3px 8px 8px', background: 'linear-gradient(90deg,#4b5266,#9aa3b8 40%,#5a6278 70%,#3a4052)', boxShadow: '0 6px 10px rgba(0,0,0,.4)' }, '', R);
    [8, 14, 20].forEach((y) => put({ left: '0', top: y + 'px', width: '34px', height: '1px', background: 'rgba(0,0,0,.35)' }, '', sock));
    put({ left: '150px', top: '172px', width: '20px', height: '14px', background: 'linear-gradient(90deg,#b8c2d6,#8b95ab)', borderRadius: '2px' }, '', R);
    const bulb = put({ left: '132px', top: '112px', width: '56px', height: '56px', borderRadius: '50%', background: 'radial-gradient(circle at 50% 44%,#7d8cc0 0%,#4a5a96 100%)' }, '', R);
    const lit = put({ left: '0', top: '0', width: '56px', height: '56px', borderRadius: '50%', background: 'radial-gradient(circle at 50% 44%,#fffbe8 0%,#ffe08a 38%,#ffb347 76%,#e8801f 100%)' }, '', bulb);
    put({ left: '12px', top: '8px', width: '18px', height: '9px', borderRadius: '50%', background: 'rgba(255,255,255,.55)', transform: 'rotate(-28deg)' }, '', bulb);
    const capR = put({ left: '0', width: '320px', top: '300px', textAlign: 'center', font: `500 12px/1.4 ${MONO}`, color: PAL.ink, whiteSpace: 'pre' }, '', R);
    const pill = put({ right: '14px', top: '14px', padding: '7px 12px 7px 13px', borderRadius: '2px', background: PAL.surface, borderLeft: `3px solid ${PAL.accent}`, boxShadow: '0 4px 10px rgba(8,16,50,.45)', color: PAL.ink, font: `600 12px/1 ${FONT}` }, '');
    return { card, bulb, lit, capL, capR, pill };
  },
  render(s, t, a, lv) {
    const Lv = !a ? 1 : (lv == null ? 3 : lv);   // 1 = 둘 다 한 겹, 2 = 그림자 여러 겹, 3 = + 빛 여러 겹
    const hp = E.outBack(seg(t, .3, 1.1)), h = lerp(0, LIFT, Math.min(1.12, hp));   // 카드가 떠오르며 그림자가 커진다
    s.card.style.transform = `translateY(${(-hp * 14).toFixed(1)}px)`;
    const sh = Lv >= 2
      ? SH_F.map((f) => `0 ${f1(h * f)}px ${f1(h * f * 2)}px rgba(20,28,64,${SHADOW_A})`).join(',')
      : `0 ${f1(h)}px ${f1(h * 2)}px rgba(20,28,64,${Math.min(.9, SHADOW_A * 2.25).toFixed(2)})`;
    s.card.style.boxShadow = sh;
    const on = E.outC(seg(t, 1.3, 2.1));
    const gl = Lv >= 3
      ? GL_F.map((f, i) => `0 0 ${f1(GLOW_MAX * f)}px ${GL_S[i]}px rgba(255,${190 - i * 8},${90 + i * 6},${Math.min(1, GL_A[i] * on * GLOW_POWER).toFixed(2)})`).join(',')
      : `0 0 ${GLOW_MAX}px 16px rgba(255,180,80,${Math.min(1, .7 * on * GLOW_POWER).toFixed(2)})`;
    s.bulb.style.boxShadow = gl;
    s.lit.style.opacity = on.toFixed(3);
    const l = (v) => f1(v);
    s.capL.textContent = Lv >= 2 ? `그림자 5겹\n블러 ${SH_F.map((f) => l(LIFT * f * 2)).join(', ')}px` : `그림자 1겹\n블러 ${LIFT * 2}px 하나`;
    s.capR.textContent = Lv >= 3 ? `빛 4겹\n반경 ${GL_F.map((f) => l(GLOW_MAX * f)).join(', ')}px` : `빛 1겹\n블러 ${GLOW_MAX}px 하나`;
    s.pill.textContent = Lv === 1 ? '연출 전: 블러 한 번씩' : (Lv === 2 ? '그림자만 여러 겹' : '그림자와 빛 모두 여러 겹');
  },
};
export default demo;
