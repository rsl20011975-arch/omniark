/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/inner-shadow/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 같은 입력 화면을 '평평한 테두리'에서 '안쪽 그림자로 움푹 들어간 홈'으로 바꾸고, 버튼이 눌리면 바깥 그림자가 안쪽 그림자로 바뀐다. 화면은 시간 t 의 함수다.
const INSET = 1;                  // 안쪽 그림자 깊이 배율(1 = 100%)
const LIGHT = -1;                  // 빛이 오는 쪽: 1 = 위에서(그림자가 위쪽 안쪽 가장자리), -1 = 아래에서
const box = (e, o) => Object.assign(e.style, o);
const FONT = "'IBM Plex Sans KR',sans-serif", MONO = "'JetBrains Mono',monospace";

// 안쪽 그림자: 가까이 붙는 진한 그림자 + 넓게 퍼지는 옅은 그림자 + 반대쪽 가장자리의 흰 하이라이트 (모두 inset)
const well = (k = 1) => `inset 0 ${LIGHT * 2 * INSET * k}px ${3 * INSET * k}px rgba(30,40,80,.42), inset 0 ${LIGHT * 6 * INSET * k}px ${12 * INSET * k}px rgba(30,40,80,.22), inset 0 ${-LIGHT}px 0 rgba(255,255,255,.95)`;
const raised = `0 ${LIGHT * 6}px 12px rgba(190,70,10,.35), 0 2px 3px rgba(190,70,10,.35), inset 0 ${LIGHT * 2}px 0 rgba(255,255,255,.45), inset 0 ${-LIGHT * 3}px 0 rgba(0,0,0,.14)`;
const pressed = () => `inset 0 ${LIGHT * 5 * INSET}px ${9 * INSET}px rgba(120,40,0,.55), inset 0 ${-LIGHT}px 0 rgba(255,255,255,.3)`;
const FLAT = 'inset 0 0 0 1px #b4bdd0';

const demo = {
  dur: 3.4, rest: 3, noCompare: false, levels: 3,
  mount(sp) {
    const put = (css, text, par) => { const e = el('div', null, par || sp, text); box(e, Object.assign({ position: 'absolute' }, css)); return e; };
    put({ left: '0', top: '0', width: '640px', height: '360px', background: 'linear-gradient(170deg,#e4e9f2 0%,#cdd5e5 100%)' }, '');
    const panel = put({ left: '40px', top: '56px', width: '560px', height: '270px', borderRadius: '22px', background: 'linear-gradient(170deg,#eef1f7,#e3e8f1)', boxShadow: '0 18px 36px rgba(40,52,90,.18), inset 0 1px 0 rgba(255,255,255,.9)' }, '');
    const lab = (x, y, txt) => put({ left: x + 'px', top: y + 'px', font: `500 12px/1 ${FONT}`, color: '#4f5b73' }, txt, panel);
    lab(30, 26, '검색');
    const field = put({ left: '30px', top: '46px', width: '300px', height: '46px', borderRadius: '12px', background: '#e1e6f0' }, '', panel);
    put({ left: '16px', top: '0', font: `500 15px/46px ${FONT}`, color: '#1c2233' }, '아메리카노', field);
    put({ right: '14px', top: '12px', width: '22px', height: '22px' }, '', field).innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#4f5b73" stroke-width="2.2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 L21 21"/></svg>';
    lab(30, 116, '로스팅 진행');
    const pct = put({ left: '292px', top: '116px', font: `500 12px/1 ${MONO}`, color: '#4f5b73' }, '', panel);
    const groove = put({ left: '30px', top: '138px', width: '300px', height: '16px', borderRadius: '8px', background: '#e1e6f0', overflow: 'hidden' }, '', panel);
    const fill = put({ left: '0', top: '0', height: '16px', borderRadius: '8px', background: 'linear-gradient(180deg,#ffb36b,#f0701f)' }, '', groove);
    lab(30, 184, '알림 켜기');
    const track = put({ left: '266px', top: '176px', width: '64px', height: '32px', borderRadius: '16px', background: '#e1e6f0' }, '', panel);
    const knob = put({ left: '3px', top: '3px', width: '26px', height: '26px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%,#ffffff,#dfe4ee)' }, '', track);
    lab(372, 26, '주문');
    const btn = put({ left: '372px', top: '46px', width: '158px', height: '54px', borderRadius: '14px', background: 'linear-gradient(180deg,#ff9a52,#f0701f)', color: '#1a0f06', font: `700 17px/54px ${FONT}`, textAlign: 'center' }, '주문하기', panel);
    lab(372, 124, '수량');
    const step = put({ left: '372px', top: '144px', width: '158px', height: '46px', borderRadius: '23px', background: '#e1e6f0' }, '', panel);
    put({ left: '14px', top: '13px', width: '20px', height: '20px' }, '', step).innerHTML = '<svg viewBox="0 0 20 20" width="20" height="20" stroke="#1c2233" stroke-width="2.4" stroke-linecap="round"><path d="M4 10 H16"/></svg>';
    put({ left: '0', width: '158px', top: '0', textAlign: 'center', font: `700 17px/46px ${MONO}`, color: '#1c2233' }, '2', step);
    put({ right: '14px', top: '13px', width: '20px', height: '20px' }, '', step).innerHTML = '<svg viewBox="0 0 20 20" width="20" height="20" stroke="#1c2233" stroke-width="2.4" stroke-linecap="round"><path d="M4 10 H16 M10 4 V16"/></svg>';
    const note = put({ left: '30px', top: '232px', width: '500px', font: `400 12px/1.4 ${FONT}`, color: '#4f5b73' }, '', panel);
    const pill = put({ left: '14px', top: '14px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(24,30,50,.88)', color: '#fff', font: `500 14px/1 ${FONT}` }, '');
    return { field, groove, fill, track, knob, btn, step, note, pill, pct };
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 3 : lv);   // 1 = 평평한 테두리, 2 = + 안쪽 그림자 홈, 3 = + 눌리는 버튼
    const wells = [s.field, s.groove, s.track, s.step];
    wells.forEach((e) => { e.style.boxShadow = L >= 2 ? well(e === s.groove ? .6 : 1) : FLAT; });
    const prog = E.outC(seg(t, .3, 1.5)) * .62;
    s.fill.style.width = (300 * prog).toFixed(1) + 'px';
    s.fill.style.boxShadow = L >= 2 ? 'inset 0 1px 0 rgba(255,255,255,.55), 0 1px 2px rgba(150,60,10,.4)' : 'none';
    s.pct.textContent = Math.round(prog * 100) + '%';
    const on = E.outBack(seg(t, 1.2, 1.7));   // 토글이 켜진다
    s.knob.style.left = (3 + 34 * Math.min(1.08, on)).toFixed(1) + 'px';
    s.knob.style.boxShadow = L >= 2 ? '0 3px 5px rgba(30,40,80,.35), inset 0 1px 0 rgba(255,255,255,.9)' : 'inset 0 0 0 1px #aab4c8';
    const kp = E.outC(seg(t, 1.2, 1.7));
    s.track.style.background = `linear-gradient(180deg,rgb(${Math.round(lerp(225, 255, kp))},${Math.round(lerp(230, 170, kp))},${Math.round(lerp(240, 100, kp))}),rgb(${Math.round(lerp(236, 240, kp))},${Math.round(lerp(240, 112, kp))},${Math.round(lerp(248, 31, kp))}))`;
    const pr = L >= 3 ? E.outC(seg(t, 2.1, 2.3)) : 0;   // 버튼을 누른다
    s.btn.style.transform = `translateY(${(pr * 3).toFixed(1)}px)`;
    s.btn.style.boxShadow = L >= 3 && pr > .5 ? pressed() : (L >= 2 ? raised : FLAT);
    s.btn.style.filter = L >= 3 && pr > .5 ? 'brightness(.93)' : 'none';
    s.note.textContent = L === 1 ? '테두리 한 줄만 있어 입력칸·스위치·버튼이 모두 같은 높이의 평평한 면으로 보입니다.' : (L === 2 ? '입력칸·진행 홈·스위치 홈·수량 칸은 안쪽 그림자로 파인 홈, 손잡이와 막대는 그 위에 얹힌 것으로 보입니다.' : (pr > .5 ? '눌린 버튼: 바깥 그림자가 사라지고 안쪽 그림자가 생겨 눌려 들어갑니다.' : '누르기 전 버튼은 솟아 있습니다(바깥 그림자). 곧 눌립니다.'));
    s.pill.textContent = L === 1 ? '연출 전 · 테두리만 있는 평평한 화면' : (L === 2 ? '안쪽 그림자로 홈을 판 화면' : (pr > .5 ? '누르는 순간 · 바깥 → 안쪽 그림자' : '버튼은 솟아 있다가 눌림'));
  },
};
export default demo;
