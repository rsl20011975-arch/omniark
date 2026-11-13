/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/glitch-rgb-split/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 화면이 두 번 순간적으로 깨진다: 빨강·파랑 색 층이 좌우로 어긋나고(RGB 분리), 가로 띠가 밀려나고(줄 찢기), 주사선이 얹힌다. 화면은 시간 t 의 함수다.
const SPLIT = 14;   // R·B 색 층이 어긋나는 거리(px, 640×360 기준)
const BURST = 1.0;   // 글리치 한 번이 이어지는 시간(초)
const TEAR = 60;    // 줄 찢기: 띠가 좌우로 밀리는 최대 거리(px)
const NB = 16;      // 줄 찢기 띠 개수
const FPS = 12;     // 글리치 값이 바뀌는 횟수(초당) — 뚝뚝 끊겨 보이게
const T1 = 1.2, T2 = 3.0;   // 두 번의 글리치가 시작하는 시각(초)
const W = 1280, H = 720;
const FONT = '40px "Black Han Sans"';
const PAL = { bg0: '#0c1814', bg1: '#15271f', ink: '#e8f1ea', muted: '#86a091', accent: '#7fe0a8', accent2: '#e8d27a', surface: '#12231c', line: 'rgba(232,241,234,.22)' };
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

function cv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

function paint(c) {
  const x = c.getContext('2d');
  let g = x.createLinearGradient(0, 0, W * .55, H);
  g.addColorStop(0, PAL.bg0); g.addColorStop(1, PAL.bg1);
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  [[.5, .5, 620, .26], [.5, .5, 240, .3]].forEach(([gx, gy, r, a]) => {     // 빛은 반경이 다른 두 겹
    const rg = x.createRadialGradient(W * gx, H * gy, 0, W * gx, H * gy, r);
    rg.addColorStop(0, rgba(PAL.accent, a)); rg.addColorStop(1, rgba(PAL.accent, 0));
    x.fillStyle = rg; x.fillRect(0, 0, W, H);
  });
  x.strokeStyle = rgba(PAL.ink, .55); x.lineWidth = 4;                 // 뷰파인더 모서리
  [[70, 60, 1, 1], [W - 70, 60, -1, 1], [70, H - 60, 1, -1], [W - 70, H - 60, -1, -1]].forEach(([px, py, sx, sy]) => {
    x.beginPath(); x.moveTo(px, py + 56 * sy); x.lineTo(px, py); x.lineTo(px + 56 * sx, py); x.stroke();
  });
  x.textAlign = 'center'; x.textBaseline = 'alphabetic';
  x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = 40; x.shadowOffsetY = 12;
  x.fillStyle = PAL.ink; x.font = '280px "Black Han Sans", sans-serif'; x.fillText('SIGNAL', W / 2, 430);
  x.shadowColor = 'transparent';
  x.fillStyle = rgba(PAL.ink, .88); x.font = '500 38px "IBM Plex Sans KR", sans-serif'; x.fillText('수신 상태를 확인하는 중', W / 2, 520);
  x.fillStyle = rgba(PAL.ink, .7); x.font = '500 28px "JetBrains Mono", monospace'; x.fillText('CH 07 · 00:42:18', W / 2, 580);
  // 필름 그레인: 그라디언트 밴딩을 풀어 준다(고정 시드)
  const r = rng(5), id = x.getImageData(0, 0, W, H), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const n = (r() - .5) * 5; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  x.putImageData(id, 0, 0);
}

function tint(src, col) {
  const c = cv(W, H), x = c.getContext('2d');
  x.drawImage(src, 0, 0); x.globalCompositeOperation = 'multiply'; x.fillStyle = col; x.fillRect(0, 0, W, H);
  return c;
}

const demo = {
  dur: 5.0, rest: 3.2, noCompare: false, levels: 3,
  mount(sp) {
    const r = rng(21), R = Array.from({ length: 512 }, () => r());
    const base = cv(W, H), chs = [cv(W, H), cv(W, H), cv(W, H)];
    const main = el('canvas', null, sp);
    main.width = W; main.height = H; Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    // 세로 이름표: 왼쪽 가장자리, 번호는 muted, 지금 상태는 ink
    const lab = el('div', null, sp);
    Object.assign(lab.style, { position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', writingMode: 'vertical-rl', letterSpacing: '.1em', font: "500 12px/1 'IBM Plex Sans KR',sans-serif", whiteSpace: 'nowrap', borderRight: `1px solid ${PAL.line}`, paddingRight: '7px', textShadow: '0 1px 6px rgba(0,0,0,.6)' });
    const idx = el('span', null, lab);
    Object.assign(idx.style, { color: PAL.muted, font: "500 12px/1 'JetBrains Mono',monospace", marginBottom: '8px' });
    const pill = el('span', null, lab);
    Object.assign(pill.style, { color: PAL.ink });
    const mono = el('div', null, sp);
    Object.assign(mono.style, { position: 'absolute', right: '20px', top: '18px', padding: '6px 10px', borderRadius: '2px', borderLeft: `3px solid ${PAL.accent}`, background: PAL.surface, color: PAL.ink, font: "600 12px/1 'JetBrains Mono',monospace", opacity: '0' });
    const track = el('div', null, sp);
    Object.assign(track.style, { position: 'absolute', left: '36px', right: '100px', bottom: '22px', height: '6px', borderRadius: '3px', background: rgba(PAL.ink, .2) });
    [T1, T2].forEach((t0) => {
      const z = el('div', null, track);
      Object.assign(z.style, { position: 'absolute', top: '0', height: '6px', borderRadius: '3px', background: PAL.accent, left: (t0 / 5 * 100) + '%', width: (BURST / 5 * 100) + '%' });
    });
    const head = el('div', null, track);
    Object.assign(head.style, { position: 'absolute', top: '-4px', width: '3px', height: '14px', borderRadius: '2px', background: PAL.ink, boxShadow: `0 0 8px ${rgba(PAL.ink, .7)}` });
    const s = { R, base, chs, main, pill, idx, mono, head, ok: null };
    s.repaint = () => { paint(base); [['#ff0000'], ['#00ff00'], ['#0000ff']].forEach(([col], i) => { chs[i] = tint(base, col); }); };
    s.repaint();
    return s;
  },
  render(s, t, a, lv) {
    const okNow = document.fonts.check(FONT);
    if (s.ok !== okNow) { s.ok = okNow; s.repaint(); }
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 효과 없음(기준), 2 = 색 층 분리, 3 = + 줄 찢기·주사선·번쩍임·조각 밀기
    const k = t >= T1 && t < T1 + BURST ? 0 : (t >= T2 && t < T2 + BURST ? 1 : -1);
    const x = s.main.getContext('2d'), R = s.R;
    x.globalCompositeOperation = 'source-over';
    if (L <= 1 || k < 0) {
      x.drawImage(s.base, 0, 0);
    } else {
      const t0 = k ? T2 : T1, q = (t - t0) / BURST, step = Math.floor(t * FPS), amp = 1 - .55 * q;
      const rr = (n) => R[(step * 31 + n * 7) % 512];
      const sx = SPLIT * 2 * amp * (.65 + .7 * rr(1)), sy = L >= 3 ? (rr(2) - .5) * 10 : 0;
      x.fillStyle = '#000'; x.fillRect(0, 0, W, H);
      x.globalCompositeOperation = 'lighter';
      const bh = H / NB;
      [-1, 0, 1].forEach((dir, ci) => {
        for (let i = 0; i < NB; i++) {
          let dx = 0;
          if (L >= 3 && rr(10 + i) > .55) dx = (rr(40 + i) - .5) * 2 * TEAR * 2 * amp;
          x.drawImage(s.chs[ci], 0, i * bh, W, bh, dx + dir * sx, i * bh + (ci === 2 ? sy : 0), W, bh);
        }
      });
      x.globalCompositeOperation = 'source-over';
      if (L >= 3) {
        x.fillStyle = 'rgba(0,0,0,.24)';
        for (let y = 0; y < H; y += 4) x.fillRect(0, y, W, 2);
        if (rr(3) > .72) { x.fillStyle = rgba(PAL.ink, .14); x.fillRect(0, 0, W, H); }
        for (let j = 0; j < 3; j++) {
          const by = Math.floor(rr(60 + j) * 600), bw = 240 + Math.floor(rr(70 + j) * 360), bx = Math.floor(rr(80 + j) * (W - bw)), off = (rr(90 + j) - .5) * 220;
          x.drawImage(s.base, bx, by, bw, 34, bx + off, by, bw, 34);
        }
      }
    }
    s.idx.textContent = L <= 1 ? '01' : k < 0 ? '02' : L === 2 ? '03' : '04';
    s.pill.textContent = L <= 1 ? '원본 효과 없음' : k < 0 ? '정상 화면 대기' : L === 2 ? `RGB 분리 ${SPLIT}px` : 'RGB 분리 + 줄 찢기';
    s.mono.style.opacity = L >= 2 && k >= 0 ? 1 : 0;
    s.mono.textContent = `R −${SPLIT}  B +${SPLIT}`;
    s.head.style.left = `calc(${(t / 5 * 100).toFixed(2)}% - 1px)`;
  },
};
export default demo;
