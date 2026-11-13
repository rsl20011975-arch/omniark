/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/layers-repeat/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 하나의 그림을 투명한 층(레이어) 여러 장을 겹쳐 만든다. ① 쌓는 순서가 틀리면 해와 제목이 가려진다 → ② 순서를 맞추고 뒤쪽 층에 안개·느린 이동으로 깊이를 준다 → ③ 한 층(광선)을 복제해 반복 배치한다. 화면은 시간 t 의 함수다.
const COPIES = 12;            // 반복: 광선을 몇 개 복제할지(각도는 360 ÷ 개수)
const HAZE = .5;              // 깊이: 먼 산에 안개를 덮는 정도(0~1)
const RAY = 260;              // 반복: 광선 하나의 길이(px)
const T_RE = 1.2, T_DEP = 2.2, T_REP = 3.4;   // 순서 바로잡기 · 깊이 주기 · 반복 시작 시각(초)
const DUR = 6.0;
const FONT = '40px "Black Han Sans"';
const WRONG = ['title', 'sun', 'sky', 'far', 'hills'];             // 아래 → 위 (틀린 순서)
const RIGHT = ['sky', 'far', 'rays', 'sun', 'hills', 'title'];     // 아래 → 위 (맞는 순서)
const NAME = { title: '제목 글자', hills: '가까운 언덕', sun: '해', rays: '광선 ×' + COPIES, far: '먼 산', sky: '하늘' };
const PAL = { bg0: '#a9402c', bg1: '#8f3322', ink: '#fff4ec', muted: '#ffd9c9', accent: '#ffe27a', accent2: '#1d1a16', surface: '#b24a34', line: 'rgba(255,244,236,.28)' };
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const CHIP = { title: PAL.ink, hills: '#7a4a38', sun: PAL.accent, rays: '#ffd9a0', far: '#c0684a', sky: '#e7885a' };
const FAR0 = '#45231a', FAR1 = '#d38a55';   // 먼 산의 원래 색 · 안개가 섞이는 하늘빛
const SX = 440, SY = 214;     // 해의 중심(640×360 기준)

function mix(a, b, k) {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], k))).join(',')})`;
}

function ridge(x, base, amp, f, ph, ox, fill) {
  x.beginPath(); x.moveTo(-80, 360);
  for (let px = -80; px <= 720; px += 8) x.lineTo(px, base + Math.sin((px - ox) / f + ph) * amp + Math.sin((px - ox) / (f * .37) + ph * 2) * amp * .35);
  x.lineTo(720, 360); x.closePath(); x.fillStyle = fill; x.fill();
}

const demo = {
  dur: DUR, rest: 5.4, noCompare: false, levels: 3,
  mount(sp) {
    const css = (e, o) => Object.assign(e.style, o);
    const main = el('canvas', null, sp);
    main.width = 1280; main.height = 720; css(main, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    // 숫자 이름표: 큰 숫자 = 지금 단계(1 틀린 순서, 2 순서 맞춤과 깊이, 3 반복)
    const lab = el('div', null, sp);
    css(lab, { position: 'absolute', left: '14px', top: '6px', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 2, textShadow: '0 2px 8px rgba(40,10,6,.65)' });
    const num = el('span', null, lab);
    css(num, { color: PAL.accent, font: "40px/1 'Black Han Sans',sans-serif" });
    const pill = el('span', null, lab);
    css(pill, { color: PAL.ink, font: "500 13px/1.2 'IBM Plex Sans KR',sans-serif", whiteSpace: 'nowrap' });
    const r = rng(17), stars = Array.from({ length: 46 }, () => [r() * 640, r() * 150, .4 + r() * 1.1, .3 + r() * .6]);
    return { main, pill, num, stars, ok: null };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 순서가 틀린 기본, 2 = 순서 바로잡기 + 깊이, 3 = + 반복
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
    const re = L >= 2 ? E.inOutC(seg(t, T_RE, T_RE + .6)) : 0, fixed = L >= 2 && t >= T_RE + .3;
    const dp = L >= 2 ? E.inOutC(seg(t, T_DEP, T_DEP + .8)) : 0, dt = L >= 2 ? Math.max(0, t - T_DEP) : 0;
    const stack = fixed ? RIGHT.filter((k) => k !== 'rays' || L >= 3) : WRONG;
    const draw = {
      sky() {
        const g = x.createLinearGradient(0, 0, 0, 300); g.addColorStop(0, '#4f1a14'); g.addColorStop(.55, PAL.bg0); g.addColorStop(1, '#e89a5a');
        x.fillStyle = g; x.fillRect(0, 0, 640, 360);
        s.stars.forEach(([px, py, rr, al]) => { x.fillStyle = `rgba(255,244,236,${al})`; x.beginPath(); x.arc(px, py, rr, 0, 7); x.fill(); });
      },
      far() { ridge(x, 236, 24, 90, 1.2, -dt * 8, mix(FAR0, FAR1, HAZE * dp)); },
      rays() {
        for (let i = 0; i < COPIES; i++) {
          const p = E.outC(seg(t, T_REP + i * .05, T_REP + i * .05 + .4)), len = RAY * p, w = len * .1, al = lerp(.8, .35, i / Math.max(1, COPIES - 1)) * p;
          if (p <= 0) continue;
          x.save(); x.translate(SX, SY); x.rotate(i * Math.PI * 2 / COPIES + t * .1); x.globalCompositeOperation = 'lighter';
          const g = x.createLinearGradient(0, 0, len, 0); g.addColorStop(0, `rgba(255,226,122,${al})`); g.addColorStop(1, 'rgba(255,226,122,0)');
          x.fillStyle = g; x.beginPath(); x.moveTo(0, 0); x.lineTo(len, -w); x.lineTo(len, w); x.closePath(); x.fill(); x.restore();
        }
      },
      sun() {
        const y = SY - (L >= 2 ? seg(t, T_DEP, 5) * 10 : 0);
        [[130, .45], [64, .6]].forEach(([rd, al]) => { const g = x.createRadialGradient(SX, y, 0, SX, y, rd); g.addColorStop(0, `rgba(255,226,122,${al})`); g.addColorStop(1, 'rgba(255,226,122,0)'); x.fillStyle = g; x.fillRect(SX - rd, y - rd, rd * 2, rd * 2); });
        const g = x.createRadialGradient(SX - 10, y - 12, 4, SX, y, 46); g.addColorStop(0, '#fffbe0'); g.addColorStop(.6, PAL.accent); g.addColorStop(1, '#ffb43c');
        x.fillStyle = g; x.beginPath(); x.arc(SX, y, 44, 0, 7); x.fill();
      },
      hills() {
        const g = x.createLinearGradient(0, 250, 0, 360); g.addColorStop(0, '#2b1d17'); g.addColorStop(1, '#0e0b09');
        ridge(x, 282, 26, 120, 2.4, -dt * 18, g);
      },
      title() {
        x.save(); x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = 18; x.shadowOffsetY = 5;
        x.fillStyle = PAL.ink; x.textAlign = 'left'; x.font = '400 96px "Black Han Sans", sans-serif'; x.fillText('LAYER', 150, 160);
        x.restore(); x.fillStyle = rgba(PAL.ink, .92); x.font = '500 20px "IBM Plex Sans KR", sans-serif'; x.fillText('층을 쌓아 만든 한 장의 그림', 154, 190);
      },
    };
    stack.forEach((k) => draw[k]());
    // 레이어 패널(위에 있는 층이 위쪽 줄)
    const rowsW = WRONG.slice().reverse(), rowsR = RIGHT.filter((k) => k !== 'rays' || L >= 3).reverse();
    x.fillStyle = rgba(PAL.accent2, .8); x.beginPath(); x.roundRect(14, 58, 122, 164, 6); x.fill(); x.strokeStyle = PAL.line; x.lineWidth = 1; x.stroke();
    x.fillStyle = PAL.muted; x.font = '500 10px "IBM Plex Sans KR", sans-serif'; x.textAlign = 'left'; x.fillText('레이어(위 = 앞)', 22, 72);
    Object.keys(NAME).forEach((k) => {
      const iw = rowsW.indexOf(k), ir = rowsR.indexOf(k);
      if (ir < 0 || (k === 'rays' && re < 1)) return;      // 아직 쓰지 않는 층은 목록에 없음
      const wi = iw < 0 ? ir : iw, yi = lerp(wi, ir, re);
      const yy = 80 + yi * 23, moving = re > 0 && re < 1 && wi !== ir, dim = k === 'rays' && t < T_REP ? .4 : 1;
      x.globalAlpha = dim;
      x.fillStyle = rgba(PAL.ink, .10); x.beginPath(); x.roundRect(20, yy, 110, 20, 4); x.fill();
      if (moving) { x.strokeStyle = PAL.accent; x.lineWidth = 1.5; x.stroke(); }
      x.fillStyle = CHIP[k]; x.beginPath(); x.roundRect(25, yy + 4, 12, 12, 3); x.fill();
      x.fillStyle = PAL.ink; x.font = '500 11px "IBM Plex Sans KR", sans-serif'; x.fillText(NAME[k], 43, yy + 14);
      x.globalAlpha = 1;
    });
    const rep3 = L >= 3 && t >= T_REP;
    s.num.textContent = rep3 ? 3 : (L >= 2 && fixed) ? 2 : 1;
    s.pill.textContent = L <= 1 ? '순서가 틀린 레이어, 해와 제목이 하늘 뒤에 가려짐' : t < T_RE ? '순서가 틀린 레이어' : !fixed ? '레이어 순서를 맞추는 중' : rep3 ? `반복: 광선 ${COPIES}개, ${(360 / COPIES).toFixed(0)}°씩, 불투명도 80%→35%` : '순서 맞음, 먼 층은 안개와 느린 이동';
  },
};
export default demo;
