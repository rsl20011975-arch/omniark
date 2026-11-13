/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/inner-shadow/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 같은 입력 화면을 '평평한 테두리'에서 '안쪽 그림자로 움푹 들어간 홈'으로 바꾸고, 버튼이 눌리면 바깥 그림자가 안쪽 그림자로 바뀐다. 화면은 시간 t 의 함수다.
const PAL = { bg0: '#1b0e17', bg1: '#2b1424', ink: '#f6e9ee', muted: '#b095a3', accent: '#ff7aa8', accent2: '#ffd0a0', surface: '#26121f', line: 'rgba(246,233,238,.2)' };
const PINK = ['#ff9bbd', '#e8507f'];   // 막대 채움·스위치 켜짐·버튼에 쓰는 분홍(PAL.accent 에서 위아래로 파생)
const FILL = .62;                 // 진행 막대가 차는 비율(1 = 100%)
const INSET = 1;                  // 안쪽 그림자 깊이 배율(1 = 100%)
const LIGHT = -1;                  // 빛이 오는 쪽: 1 = 위에서(그림자가 위쪽 안쪽 가장자리), -1 = 아래에서
const box = (e, o) => Object.assign(e.style, o);
const FONT = "'IBM Plex Sans KR',sans-serif", MONO = "'JetBrains Mono',monospace";

// 안쪽 그림자: 가까이 붙는 진한 그림자 + 넓게 퍼지는 옅은 그림자 + 반대쪽 가장자리의 흰 하이라이트 (모두 inset)
const well = (k = 1) => `inset 0 ${LIGHT * 2 * INSET * k}px ${3 * INSET * k}px rgba(0,0,0,.62), inset 0 ${LIGHT * 6 * INSET * k}px ${12 * INSET * k}px rgba(0,0,0,.38), inset 0 ${-LIGHT}px 0 rgba(255,220,235,.16)`;
const raised = `0 ${LIGHT * 6}px 12px rgba(0,0,0,.5), 0 2px 3px rgba(0,0,0,.45), inset 0 ${LIGHT * 2}px 0 rgba(255,255,255,.4), inset 0 ${-LIGHT * 3}px 0 rgba(90,10,40,.22)`;
const pressed = () => `inset 0 ${LIGHT * 5 * INSET}px ${9 * INSET}px rgba(70,5,30,.6), inset 0 ${-LIGHT}px 0 rgba(255,220,235,.3)`;
const FLAT = 'inset 0 0 0 1px rgba(246,233,238,.3)';
const WELL_BG = '#1d0e18';

const demo = {
  dur: 3.4, rest: 3, noCompare: false, levels: 3,
  mount(sp) {
    const put = (css, text, par) => { const e = el('div', null, par || sp, text); box(e, Object.assign({ position: 'absolute' }, css)); return e; };
    put({ left: '0', top: '0', width: '640px', height: '360px', background: `linear-gradient(170deg,${PAL.bg0} 0%,${PAL.bg1} 100%)` }, '');
    const panel = put({ left: '40px', top: '56px', width: '560px', height: '270px', borderRadius: '22px', background: `linear-gradient(170deg,#321a2a,${PAL.surface})`, boxShadow: '0 18px 36px rgba(0,0,0,.5), 0 2px 5px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,220,235,.14)' }, '');
    const lab = (x, y, txt) => put({ left: x + 'px', top: y + 'px', font: `500 12px/1 ${FONT}`, color: PAL.muted }, txt, panel);
    lab(30, 26, '검색');
    const field = put({ left: '30px', top: '46px', width: '300px', height: '46px', borderRadius: '12px', background: WELL_BG }, '', panel);
    put({ left: '16px', top: '0', font: `500 15px/46px ${FONT}`, color: PAL.ink }, '아메리카노', field);
    put({ right: '14px', top: '12px', width: '22px', height: '22px' }, '', field).innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#b095a3" stroke-width="2.2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 L21 21"/></svg>';
    lab(30, 116, '로스팅 진행');
    const pct = put({ left: '292px', top: '116px', font: `500 12px/1 ${MONO}`, color: PAL.muted }, '', panel);
    const groove = put({ left: '30px', top: '138px', width: '300px', height: '16px', borderRadius: '8px', background: WELL_BG, overflow: 'hidden' }, '', panel);
    const fill = put({ left: '0', top: '0', height: '16px', borderRadius: '8px', background: `linear-gradient(180deg,${PINK[0]},${PINK[1]})` }, '', groove);
    lab(30, 184, '알림 켜기');
    const track = put({ left: '266px', top: '176px', width: '64px', height: '32px', borderRadius: '16px', background: WELL_BG }, '', panel);
    const knob = put({ left: '3px', top: '3px', width: '26px', height: '26px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%,#fff6f9,#e5c9d5)' }, '', track);
    lab(372, 26, '주문');
    const btn = put({ left: '372px', top: '46px', width: '158px', height: '54px', borderRadius: '14px', background: `linear-gradient(180deg,${PINK[0]},${PINK[1]})`, color: '#2a0a16', font: `700 17px/54px ${FONT}`, textAlign: 'center' }, '주문하기', panel);
    lab(372, 124, '수량');
    const step = put({ left: '372px', top: '144px', width: '158px', height: '46px', borderRadius: '23px', background: WELL_BG }, '', panel);
    put({ left: '14px', top: '13px', width: '20px', height: '20px' }, '', step).innerHTML = '<svg viewBox="0 0 20 20" width="20" height="20" stroke="#f6e9ee" stroke-width="2.4" stroke-linecap="round"><path d="M4 10 H16"/></svg>';
    put({ left: '0', width: '158px', top: '0', textAlign: 'center', font: `700 17px/46px ${MONO}`, color: PAL.ink }, '2', step);
    put({ right: '14px', top: '13px', width: '20px', height: '20px' }, '', step).innerHTML = '<svg viewBox="0 0 20 20" width="20" height="20" stroke="#f6e9ee" stroke-width="2.4" stroke-linecap="round"><path d="M4 10 H16 M10 4 V16"/></svg>';
    const note = put({ left: '30px', top: '232px', width: '500px', font: `400 12px/1.4 ${FONT}`, color: PAL.muted }, '', panel);
    const pill = put({ right: '14px', top: '14px', padding: '7px 12px 7px 13px', borderRadius: '2px', background: PAL.surface, borderLeft: `3px solid ${PAL.accent}`, boxShadow: '0 4px 10px rgba(0,0,0,.5)', color: PAL.ink, font: `600 12px/1 ${FONT}` }, '');
    return { field, groove, fill, track, knob, btn, step, note, pill, pct };
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 3 : lv);   // 1 = 평평한 테두리, 2 = + 안쪽 그림자 홈, 3 = + 눌리는 버튼
    const wells = [s.field, s.groove, s.track, s.step];
    wells.forEach((e) => { e.style.boxShadow = L >= 2 ? well(e === s.groove ? .6 : 1) : FLAT; });
    const prog = E.outC(seg(t, .3, 1.5)) * FILL;
    s.fill.style.width = (300 * prog).toFixed(1) + 'px';
    s.fill.style.boxShadow = L >= 2 ? 'inset 0 1px 0 rgba(255,255,255,.55), 0 1px 2px rgba(0,0,0,.5)' : 'none';
    s.pct.textContent = Math.round(prog * 100) + '%';
    const on = E.outBack(seg(t, 1.2, 1.7));   // 토글이 켜진다
    s.knob.style.left = (3 + 34 * Math.min(1.08, on)).toFixed(1) + 'px';
    s.knob.style.boxShadow = L >= 2 ? '0 3px 5px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.9)' : 'inset 0 0 0 1px rgba(246,233,238,.4)';
    const kp = E.outC(seg(t, 1.2, 1.7));
    s.track.style.background = `linear-gradient(180deg,rgb(${Math.round(lerp(29, 255, kp))},${Math.round(lerp(14, 155, kp))},${Math.round(lerp(24, 189, kp))}),rgb(${Math.round(lerp(36, 232, kp))},${Math.round(lerp(18, 80, kp))},${Math.round(lerp(30, 127, kp))}))`;
    const pr = L >= 3 ? E.outC(seg(t, 2.1, 2.3)) : 0;   // 버튼을 누른다
    s.btn.style.transform = `translateY(${(pr * 3).toFixed(1)}px)`;
    s.btn.style.boxShadow = L >= 3 && pr > .5 ? pressed() : (L >= 2 ? raised : FLAT);
    s.btn.style.filter = L >= 3 && pr > .5 ? 'brightness(.93)' : 'none';
    s.note.textContent = L === 1 ? '테두리 한 줄만 있어 입력칸, 스위치, 버튼이 모두 같은 높이의 평평한 면으로 보입니다.' : (L === 2 ? '입력칸, 진행 홈, 스위치 홈, 수량 칸은 안쪽 그림자로 파인 홈이고 손잡이와 막대 채움은 그 위에 얹힌 것으로 보입니다.' : (pr > .5 ? '눌린 버튼: 바깥 그림자가 사라지고 안쪽 그림자가 생겨 눌려 들어갑니다.' : '누르기 전 버튼은 솟아 있습니다(바깥 그림자). 곧 눌립니다.'));
    s.pill.textContent = L === 1 ? '연출 전: 테두리만 있는 평평한 화면' : (L === 2 ? '안쪽 그림자로 홈을 판 화면' : (pr > .5 ? '누르는 순간: 바깥에서 안쪽 그림자로' : '버튼은 솟아 있다가 눌림'));
  },
};
export default demo;
