/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/marquee/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 막대보다 긴 안내문을 마퀴(글이 한 방향으로 흘러가는 띠)로 보여 준다. 연출 전은 잘린 채 멈춘 글, 1단계는 한 번 흘러감, 2단계는 복제해 끊김 없이 반복, 3단계는 가장자리 페이드와 반대 방향 두 번째 줄.
// 화면은 시간 t 의 함수다. 흐르는 거리는 속도를 0 에서 부드럽게 올려 적분한 값이다.
const SPEED = 160;                // 흐르는 속도(px/초)
const GAP = 48;                   // 글과 글 사이(복제본 사이) 간격(px)
const T0 = .6, RAMP = .9;         // 흐르기 시작하는 시각, 속도가 목표에 이르는 시간(초)
const SPEED2 = .7;                // 두 번째 줄 속도 배율(첫 줄 속도 기준)
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);
const TEXTS = ['무료 공연 신청이 곧 마감됩니다 · 접수는 7월 10일까지 · 돗자리는 직접 챙겨 오세요', '다음 공연 8월 2일 · 잔디마당 사전 신청 접수 중'];
const COPIES = 3;
// 속도를 0 에서 SPEED 까지 RAMP 초 동안 부드럽게 올릴 때, 시각 t 까지 흐른 거리(px)
const dist = (t, v) => { const x = Math.max(0, t - T0); return x < RAMP ? v * x * x / (2 * RAMP) : v * (x - RAMP / 2); };

const demo = {
  dur: 6.8, rest: 6.2, noCompare: false, levels: 4,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: 'linear-gradient(160deg,#0b0f1a 0%,#1a2238 100%)', overflow: 'hidden' });
    const gr = el('div', null, bg);
    box(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.06', mixBlendMode: 'overlay' });
    const bars = TEXTS.map((txt, b) => {
      const bar = el('div', null, sp);
      box(bar, { position: 'absolute', left: '28px', top: (b ? 176 : 76) + 'px', width: '584px', height: '72px', borderRadius: '14px', background: 'linear-gradient(160deg,#2b3550 0%,#1b2238 100%)', border: '1px solid rgba(255,255,255,.14)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.16), 0 16px 28px rgba(0,0,0,.45)', overflow: 'hidden' });
      const chip = el('div', null, bar, b ? '예고' : '속보');
      box(chip, { position: 'absolute', left: '14px', top: '16px', width: '64px', height: '40px', borderRadius: '10px', background: 'linear-gradient(180deg,#ffb36b,#ff6a4d)', color: '#2a1208', font: "400 20px/40px 'Black Han Sans',sans-serif", textAlign: 'center', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.5)' });
      const win = el('div', null, bar);
      box(win, { position: 'absolute', left: '92px', top: '0', width: '420px', height: '72px', overflow: 'hidden' });
      const track = el('div', null, win);
      box(track, { position: 'absolute', left: '0', top: '0', height: '72px', display: 'flex', alignItems: 'center', width: 'max-content' });
      const copies = [];
      for (let k = 0; k < COPIES; k++) {
        const c = el('div', null, track);
        box(c, { display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' });
        const tx = el('span', null, c, txt);
        box(tx, { font: "700 20px/1 'IBM Plex Sans KR',sans-serif", color: '#fff' });
        const gp = el('span', null, c);
        box(gp, { display: 'inline-block', position: 'relative', height: '6px' });
        const dot = el('span', null, gp);
        box(dot, { position: 'absolute', left: '50%', top: '0', width: '6px', height: '6px', marginLeft: '-3px', borderRadius: '50%', background: '#ffb36b' });
        copies.push({ c, gp });
      }
      const btn = el('div', null, bar);
      box(btn, { position: 'absolute', right: '14px', top: '20px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.22)', opacity: '0' });
      [10, 17].forEach((x) => { const r = el('div', null, btn); box(r, { position: 'absolute', left: x + 'px', top: '9px', width: '4px', height: '12px', borderRadius: '1px', background: '#fff' }); });
      return { bar, win, track, copies, btn };
    });
    const spec = el('div', null, sp);
    box(spec, { position: 'absolute', left: '28px', top: '268px', width: '584px', font: "500 12px/1.7 'JetBrains Mono',monospace", color: '#9aa4ba', whiteSpace: 'pre' });
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', top: '14px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.66)', color: '#fff', font: "500 15px/1 'IBM Plex Sans KR',sans-serif" });
    return { bars, spec, pill };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv - 1);   // 단계 1 은 기법을 쓰지 않은 기본 모습(= 연출 전)   // 1 = 한 번 흐름, 2 = + 복제 반복, 3 = + 가장자리 페이드·반대 방향 줄
    s.bars.forEach((B, b) => {
      B.bar.style.opacity = b && L < 3 ? '0' : '1';
      B.copies.forEach((o, k) => {
        o.gp.style.width = GAP + 'px';
        o.c.style.visibility = k === 0 || L >= 2 ? 'visible' : 'hidden';
      });
      const P = B.copies[0].c.offsetWidth;
      const v = b ? SPEED * SPEED2 : SPEED;
      const pos = L >= 1 ? dist(t, v) : 0;
      let x;
      if (L >= 2) x = b ? (pos % P) - P : -(pos % P);
      else x = -pos;
      B.track.style.transform = `translateX(${x.toFixed(2)}px)`;
      const fade = 'linear-gradient(90deg, transparent 0, #000 56px, #000 calc(100% - 56px), transparent 100%)';
      B.win.style.webkitMaskImage = L >= 3 ? fade : 'none';
      B.win.style.maskImage = L >= 3 ? fade : 'none';
      B.btn.style.opacity = L >= 3 && !b ? '1' : '0';
    });
    const vnow = L >= 1 ? SPEED * Math.min(1, Math.max(0, t - T0) / RAMP) : 0;
    s.spec.textContent = '속도 ' + vnow.toFixed(0) + 'px/초 · 글 사이 간격 ' + GAP + 'px · 복제본 ' + (L >= 2 ? COPIES : 1) + '개' + (L >= 3 ? ' · 반대 방향 줄 ' + (SPEED * SPEED2).toFixed(0) + 'px/초' : '');
    const names = ['연출 전 · 긴 글이 막대 밖으로 잘림', '1단계 · 왼쪽으로 한 번 흘러감', '2단계 · 복제해 끊김 없이 반복', '3단계 · 가장자리 페이드 + 반대 방향 줄'];
    s.pill.textContent = names[L];
  },
};
export default demo;
