/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/jump-cut/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, E, el } from "./helpers.js";

// 같은 자리에서 찍은 한 장면에서 중간을 잘라 내 시간이 훌쩍 건너뛰게 한다. 화면은 시간 t 의 함수다.
const HOLD = 1.2;                 // 한 컷의 길이(초)
const SHOW_JUMP = 0;              // 컷마다 건너뛴 시간을 보여 주는 정도(0~1)
const T0 = .4;
const TIMES = ['09:00', '09:07', '09:19', '09:42'];
const JUMPS = ['', '+7분', '+12분', '+23분'];
const SHIFT = [[0, 0, 1], [7, -4, 1.02], [-6, 5, .99], [4, -3, 1.015]];   // 컷마다 카메라 위치가 아주 조금 달라진다(x, y, 배율)
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);

const demo = {
  dur: 6.0, rest: 5.4, noCompare: false, levels: 3,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: 'linear-gradient(160deg,#0e1424 0%,#243a5e 58%,#6f8fb8 100%)', overflow: 'hidden' });
    const world = el('div', null, bg);
    box(world, { position: 'absolute', inset: '-30px', transformOrigin: '50% 50%' });
    const g1 = el('div', null, world), g2 = el('div', null, world);
    box(g1, { position: 'absolute', inset: '0', background: 'radial-gradient(circle at 74% 26%, rgba(255,214,150,.55), transparent 50%)' });
    box(g2, { position: 'absolute', inset: '0', background: 'radial-gradient(circle at 74% 26%, rgba(255,255,255,.5), transparent 11%)' });
    const clock = el('div', null, world, '09:00');
    box(clock, { position: 'absolute', left: '74px', top: '120px', font: "400 118px/1 'Black Han Sans',sans-serif", color: '#fff', textShadow: '0 6px 28px rgba(0,0,0,.4)', letterSpacing: '.02em' });
    const cap = el('div', null, world, '책상 · 같은 자리에서 한 번에 찍은 영상');
    box(cap, { position: 'absolute', left: '78px', top: '250px', font: "500 20px/1 'IBM Plex Sans KR',sans-serif", color: 'rgba(255,255,255,.92)', textShadow: '0 2px 12px rgba(0,0,0,.4)' });
    const gr = el('div', null, bg);
    box(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.07', mixBlendMode: 'overlay' });
    const jump = el('div', null, sp);
    box(jump, { position: 'absolute', right: '30px', top: '90px', font: "400 60px/1 'Black Han Sans',sans-serif", color: '#ffd66b', textShadow: '0 4px 20px rgba(0,0,0,.45)', opacity: '0', zIndex: 5 });
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', top: '18px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.66)', color: '#fff', font: "500 15px/1 'IBM Plex Sans KR',sans-serif", zIndex: 6 });
    const track = el('div', null, sp);
    box(track, { position: 'absolute', left: '20px', right: '100px', bottom: '22px', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,.2)', zIndex: 6 });
    const segs = TIMES.map((_, i) => {
      const z = el('div', null, track);
      box(z, { position: 'absolute', top: '0', height: '8px', background: i % 2 ? 'rgba(255,214,107,.95)' : 'rgba(143,180,216,.95)', borderRight: '2px solid rgba(8,10,20,.6)', left: ((T0 + i * HOLD) / 6.0 * 100) + '%', width: (HOLD / 6.0 * 100) + '%' });
      return z;
    });
    const head = el('div', null, track);
    box(head, { position: 'absolute', top: '-4px', width: '3px', height: '16px', borderRadius: '2px', background: '#fff', boxShadow: '0 0 8px rgba(255,255,255,.7)' });
    return { world, clock, jump, pill, segs, head };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 이어서 찍은 그대로, 2 = 중간을 잘라 시간이 건너뜀, 3 = 컷마다 카메라 위치가 조금 달라짐
    const n = TIMES.length;
    const idx = Math.max(0, Math.min(n - 1, Math.floor((t - T0) / HOLD)));
    const phase = t - (T0 + idx * HOLD);
    if (L <= 1) {                              // 자르지 않고 그대로: 시간이 천천히 흘러 09:00 → 09:42
      const mins = Math.round(42 * seg(t, T0, T0 + n * HOLD));
      s.clock.textContent = '09:' + String(mins).padStart(2, '0');
      s.world.style.transform = 'none';
    } else {
      s.clock.textContent = TIMES[idx];
      const sh = L >= 3 ? SHIFT[idx] : [0, 0, 1];
      s.world.style.transform = `translate(${sh[0]}px,${sh[1]}px) scale(${sh[2]})`;
    }
    const showJ = L >= 2 && idx > 0 && phase >= 0 && phase < .6;
    s.jump.textContent = JUMPS[idx];
    s.jump.style.opacity = showJ ? String(SHOW_JUMP * (1 - seg(phase, .3, .6))) : '0';
    s.pill.textContent = L <= 1 ? '이어서 찍은 그대로 · 시간이 천천히 흐름' : (t < T0 ? '시작' : `점프컷 · 컷 ${idx + 1}/${n}`);
    s.segs.forEach((z) => { z.style.display = L >= 2 ? 'block' : 'none'; });
    s.head.style.left = `calc(${(t / 6.0 * 100).toFixed(2)}% - 1px)`;
  },
};
export default demo;
