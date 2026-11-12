/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/snow-rain/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, rng, canvas, rr } from "./helpers.js";

// 눈(왼쪽)과 비(오른쪽): 입자 하나하나의 위치를 '번호와 시간'으로 계산한다. 눈은 느리고 흔들리는 점, 비는 빠르고 기울어진 줄이다.
const COUNT = 260;       // 한쪽 화면에 떨어지는 입자 수
const WIND = 40;        // 가로 바람 속도(px/초, 눈 기준. 비는 낙하가 빨라서 3배로 밀린다)
const EXPO = .04;       // 비 한 줄의 길이를 정하는 노출 시간(초): 줄 길이 = 낙하 속도 x 0.04
const HW = 320;         // 한쪽 화면 폭
const GY = 292;         // 땅 높이
const SPL = .3;         // 땅에 닿은 뒤 튀김·흔적이 보이는 시간(초)
const DUR = 4;

const fr = (x) => x - Math.floor(x);
const hash = (i, n) => fr(Math.sin(i * 12.9898 + n * 78.233) * 43758.5453);
const dot = (r, soft) => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 48; const x = cv.getContext('2d'), g = x.createRadialGradient(24, 24, 0, 24, 24, 24);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(soft ? .15 : .55, 'rgba(255,255,255,' + (soft ? .8 : .95) + ')'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 48, 48); return cv;
};
const pillDraw = (c, text) => {
  c.font = "500 14px 'IBM Plex Sans KR',sans-serif"; const w = c.measureText(text).width + 26;
  rr(c, 16, 14, w, 28, 14); c.fillStyle = 'rgba(8,10,20,.78)'; c.fill();
  c.fillStyle = '#fff'; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillText(text, 29, 29);
};

const demo = {
  dur: DUR, rest: 3.0, noCompare: false, levels: 4,
  mount(sp) {
    sp.style.background = '#0b0f1a';
    const c = canvas(sp), r = rng(5);
    const mk = () => Array.from({ length: COUNT }, (_, i) => ({ i, d: r(), off: r(), ph: r() * 6.28, f: .6 + r() * .9 }));
    const gr = document.createElement('canvas'); gr.width = gr.height = 128; const gx = gr.getContext('2d'), gi = gx.createImageData(128, 128), q = rng(3);
    for (let i = 0; i < 128 * 128; i++) { const v = q() > .5 ? 255 : 0; gi.data[i * 4] = gi.data[i * 4 + 1] = gi.data[i * 4 + 2] = v; gi.data[i * 4 + 3] = 12 + q() * 12; }
    gx.putImageData(gi, 0, 0);
    return { c, snow: mk(), rain: mk(), hard: dot(0, false), soft: dot(0, true), gr };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv - 1);   // 0 = 같은 점이 같은 속도로, 1 = 눈·비의 성격, 2 = + 깊이 층, 3 = + 가로등 빛과 땅의 흔적
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, 640, 360);
    let g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, '#0b0f1a'); g.addColorStop(1, '#19233b'); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
    for (let side = 0; side < 2; side++) {
      const ox = side * HW, lx = HW / 2;
      c.save(); c.beginPath(); c.rect(ox, 0, HW, 360); c.clip(); c.translate(ox, 0);
      // 땅: 눈 쌓인 바닥(왼쪽) / 젖은 아스팔트(오른쪽)
      g = c.createLinearGradient(0, GY, 0, 360); g.addColorStop(0, side ? '#151c30' : '#35415f'); g.addColorStop(1, side ? '#0c1121' : '#222c47'); c.fillStyle = g; c.fillRect(0, GY, HW, 360 - GY);
      c.fillStyle = side ? 'rgba(160,190,255,.10)' : 'rgba(255,255,255,.22)'; c.fillRect(0, GY, HW, 1);
      // 가로등 기둥과 전구
      g = c.createLinearGradient(lx - 3, 0, lx + 3, 0); g.addColorStop(0, '#0a0d17'); g.addColorStop(.5, '#2a3350'); g.addColorStop(1, '#0a0d17'); c.fillStyle = g; c.fillRect(lx - 2.5, 112, 5, GY - 112);
      rr(c, lx - 14, 104, 28, 10, 4); c.fillStyle = '#232c47'; c.fill();
      if (L >= 3) {   // 빛줄기(원뿔)와 땅에 비친 빛 — 겹을 달리해서 한 겹 원으로 보이지 않게
        c.globalCompositeOperation = 'lighter';
        [[98, .07], [80, .08], [62, .09], [44, .1]].forEach(([hw, al]) => {
          const bm = c.createLinearGradient(0, 114, 0, GY); bm.addColorStop(0, `rgba(255,214,150,${al * 2.4})`); bm.addColorStop(1, `rgba(255,214,150,${al * .3})`);
          c.fillStyle = bm; c.beginPath(); c.moveTo(lx - 8, 114); c.lineTo(lx + 8, 114); c.lineTo(lx + hw, GY); c.lineTo(lx - hw, GY); c.closePath(); c.fill();
        });
        [[150, .22], [70, .30], [26, .55]].forEach(([R, al]) => { const rg = c.createRadialGradient(lx, 112, 0, lx, 112, R); rg.addColorStop(0, `rgba(255,222,170,${al})`); rg.addColorStop(1, 'rgba(255,222,170,0)'); c.fillStyle = rg; c.fillRect(lx - R, 112 - R, R * 2, R * 2); });
        c.save(); c.translate(lx, GY + 18); c.scale(1, .22); const pg = c.createRadialGradient(0, 0, 0, 0, 0, 120); pg.addColorStop(0, side ? 'rgba(255,214,150,.55)' : 'rgba(255,214,150,.38)'); pg.addColorStop(1, 'rgba(255,214,150,0)'); c.fillStyle = pg; c.fillRect(-120, -120, 240, 240); c.restore();
        c.globalCompositeOperation = 'source-over';
      }
      c.beginPath(); c.arc(lx, 109, 4.5, 0, 6.2832); c.fillStyle = '#ffe3b0'; c.fill();
      // 입자
      const arr = side ? s.rain : s.snow;
      for (const p of arr) {
        const d = L >= 2 ? p.d : .5, gy = L >= 2 ? GY + 4 + d * 44 : GY + 24;
        let sp, vx, rad, al;
        if (L === 0) { sp = 60; vx = 0; rad = 2; al = .8; }
        else if (side === 0) { sp = L >= 2 ? lerp(22, 74, d) : 44; vx = WIND * (L >= 2 ? .4 + .6 * d : .7); rad = L >= 2 ? lerp(1.2, 3.8, d) : 2.4; al = L >= 2 ? lerp(.4, .95, d) : .85; }
        else { sp = L >= 2 ? lerp(300, 640, d) : 460; vx = WIND * 3 * (L >= 2 ? .6 + .4 * d : .8); rad = L >= 2 ? lerp(.9, 2, d) : 1.5; al = L >= 2 ? lerp(.4, .95, d) : .8; }
        const P = (gy + 20) / sp, T = P + SPL, tt = t + p.off * T, n = Math.floor(tt / T), u = tt - n * T, xs = hash(p.i, n) * (HW + 60) - 30;
        const wrap = (x) => ((x + 30) % (HW + 60) + HW + 60) % (HW + 60) - 30;
        if (u < P) {
          const y = -20 + sp * u;
          let x = xs + vx * u; if (L >= 1 && side === 0) x += (L >= 2 ? lerp(4, 14, d) : 8) * Math.sin(p.f * u * 2.4 + p.ph);
          x = wrap(x);
          let boost = 1;
          if (L >= 3) { const dd = Math.hypot(x - lx, y - 112); boost = 1 + 1.4 * Math.max(0, 1 - dd / 150); }
          const A = Math.min(1, al * boost);
          if (side === 0 || L === 0) {
            const big = L >= 2 && d > .72, R = rad * (big ? 2.4 : 1.7);
            c.globalAlpha = A * (big ? .75 : 1); c.drawImage(big ? s.soft : s.hard, x - R, y - R, R * 2, R * 2);
          } else {
            const len = sp * EXPO;
            c.globalAlpha = A; c.strokeStyle = boost > 1.2 ? '#fff1d6' : '#b9ccee'; c.lineWidth = rad; c.lineCap = 'round';
            c.beginPath(); c.moveTo(x, y); c.lineTo(x - vx * EXPO, y - len); c.stroke();
          }
        } else if (L >= 3) {      // 땅에 닿은 뒤: 비는 납작한 물튀김 고리, 눈은 번지는 흔적
          const w = (u - P) / SPL, x = wrap(xs + vx * P), y = gy;
          if (side) { c.globalAlpha = .55 * (1 - w) * lerp(.5, 1, d); c.strokeStyle = '#cfe0ff'; c.lineWidth = .9; c.beginPath(); c.ellipse(x, y, 2 + 8 * E.outC(w), .8 + 2.6 * E.outC(w), 0, 0, 6.2832); c.stroke(); }
          else { c.globalAlpha = .5 * (1 - w); c.fillStyle = '#fff'; c.beginPath(); c.ellipse(x, y, 1.5 + 3 * w, .8 + .5 * w, 0, 0, 6.2832); c.fill(); }
        }
      }
      c.globalAlpha = 1; c.restore();
    }
    c.fillStyle = 'rgba(255,255,255,.16)'; c.fillRect(HW - .5, 0, 1, 360);
    c.globalAlpha = 1; c.fillStyle = c.createPattern(s.gr, 'repeat'); c.fillRect(0, 0, 640, 360);
    c.font = "500 12px 'IBM Plex Sans KR',sans-serif"; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = 'rgba(255,255,255,.78)';
    c.fillText(L === 0 ? '눈(왼쪽) · 비(오른쪽) — 구분 없음' : '눈 · 느리게 흔들리며', HW / 2, 340); c.fillText(L === 0 ? '' : '비 · 빠르고 길게', HW + HW / 2, 340);
    pillDraw(c, ['연출 전: 같은 점이 같은 속도로 일직선 낙하', '1단계: 눈은 느리게 흔들리고, 비는 기울어진 줄', '2단계: + 깊이 층(멀수록 작고 느리고 옅게)', '3단계: + 가로등 빛과 땅의 물튀김·흔적'][L]);
  },
};
export default demo;
