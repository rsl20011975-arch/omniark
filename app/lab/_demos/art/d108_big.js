/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/shutter-shatter/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 장면 3개를 '컷 → 셔터(가로 막대가 차례로 돌아감) → 파편(금이 가고 조각이 흩어짐)' 순서로 잇는다. 화면은 시간 t 의 함수다.
const SLATS = 8;              // 셔터 막대 개수
const T1 = 1.2, TOTAL1 = 1.0, FLIP = .5;   // 셔터 시작 시각 · 전체 길이 · 막대 하나가 도는 시간(초)
const T2 = 3.9, CRACK = .25;  // 파편 시작 시각 · 금이 퍼지는 시간(초)
const COLS = 5;              // 파편: 가로 칸 수(세로는 비율에 맞춰 자동. 한 칸을 삼각형 2개로 쪼갬)
const GRAV = 900;             // 조각이 떨어지는 중력(px/s²)
const DUR = 6.6;
const FONT = '40px "Black Han Sans"';
const PAL = { bg0: '#1f3a8a', bg1: '#172a63', ink: '#f3f6ff', muted: '#aebcf0', accent: '#ffd166', accent2: '#7fe0ff', surface: '#1b3274', line: 'rgba(243,246,255,.24)' };
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const SC = [
  { n: 'OPEN', c: '아침 8:00 · 가게 문을 열다', top: PAL.bg1, mid: PAL.bg0, bot: '#8fa6e8', glow: '174,188,240', gx: .78, gy: .2, hill: '#0e1a4a' },
  { n: 'NOON', c: '낮 12:00 · 손님이 몰리다', top: '#1f4a9a', mid: '#3f8fd0', bot: '#ffe9a8', glow: '255,225,150', gx: .24, gy: .22, hill: '#0d2a5e' },
  { n: 'CLOSE', c: '밤 9:00 · 문을 닫다', top: '#0b1236', mid: PAL.bg1, bot: '#3a4fb0', glow: '127,224,255', gx: .7, gy: .22, hill: '#060b24' },
];

function cv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

function paint(c, d, grain) {
  const x = c.getContext('2d'), W = 1280, H = 720;
  let g = x.createLinearGradient(0, 0, W * .35, H);
  g.addColorStop(0, d.top); g.addColorStop(.58, d.mid); g.addColorStop(1, d.bot);
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  [[760, .5], [260, .38]].forEach(([r, a]) => {
    const rg = x.createRadialGradient(W * d.gx, H * d.gy, 0, W * d.gx, H * d.gy, r);
    rg.addColorStop(0, `rgba(${d.glow},${a})`); rg.addColorStop(1, `rgba(${d.glow},0)`);
    x.fillStyle = rg; x.fillRect(0, 0, W, H);
  });
  [[470, .5, '#fff', .1, 1.1], [560, .8, d.hill, .9, .8]].forEach(([base, amp, col, al, f], i) => {
    x.beginPath(); x.moveTo(0, H);
    for (let px = 0; px <= W; px += 16) x.lineTo(px, base + Math.sin(px / 170 * f + i * 2) * 34 * amp + Math.sin(px / 61 + i) * 9);
    x.lineTo(W, H); x.closePath();
    x.globalAlpha = al; x.fillStyle = col; x.fill(); x.globalAlpha = 1;
  });
  x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 30; x.shadowOffsetY = 8;
  x.fillStyle = PAL.ink; x.textAlign = 'left'; x.font = '170px "Black Han Sans", sans-serif'; x.fillText(d.n, 70, 250);
  x.shadowColor = 'transparent';
  x.fillStyle = rgba(PAL.ink, .92); x.font = '500 40px "IBM Plex Sans KR", sans-serif'; x.fillText(d.c, 76, 312);
  x.globalCompositeOperation = 'overlay'; x.globalAlpha = .12;
  for (let px = 0; px < W; px += 256) for (let py = 0; py < H; py += 256) x.drawImage(grain, px, py);
  x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
}

function mesh(r) {                      // 흔들어 놓은 격자 위에 삼각형 조각을 만든다
  const rows = Math.round(COLS * 360 / 640), cw = 640 / COLS, ch = 360 / rows, P = [];
  for (let j = 0; j <= rows; j++) { P[j] = []; for (let i = 0; i <= COLS; i++) P[j][i] = [i * cw + (i > 0 && i < COLS ? (r() - .5) * cw * .6 : 0), j * ch + (j > 0 && j < rows ? (r() - .5) * ch * .6 : 0)]; }
  const ix = 330, iy = 170, tris = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < COLS; i++) {
    const a = P[j][i], b = P[j][i + 1], c = P[j + 1][i + 1], d = P[j + 1][i];
    (r() > .5 ? [[a, b, c], [a, c, d]] : [[a, b, d], [b, c, d]]).forEach((p) => tris.push(p));
  }
  let maxd = 1;
  const shards = tris.map((p) => {
    const cx = (p[0][0] + p[1][0] + p[2][0]) / 3, cy = (p[0][1] + p[1][1] + p[2][1]) / 3, dx = cx - ix, dy = cy - iy, dist = Math.hypot(dx, dy);
    maxd = Math.max(maxd, dist);
    const sp = 90 + r() * 200;
    return { p, cx, cy, dist, vx: dx / (dist + 1) * sp + (r() - .5) * 60, vy: dy / (dist + 1) * sp - 60 - r() * 120, spin: (r() - .5) * 9, tilt: r() * 6 };
  });
  shards.forEach((s) => { s.delay = s.dist / maxd * .3; });
  return { shards, maxd, ix, iy };
}

const demo = {
  dur: DUR, rest: 6.0, noCompare: false, levels: 3,
  mount(sp) {
    const r = rng(11), grain = cv(256, 256), gx = grain.getContext('2d'), gd = gx.createImageData(256, 256);
    for (let i = 0; i < gd.data.length; i += 4) { const v = r() * 255; gd.data[i] = gd.data[i + 1] = gd.data[i + 2] = v; gd.data[i + 3] = 255; }
    gx.putImageData(gd, 0, 0);
    const main = el('canvas', null, sp);
    main.width = 1280; main.height = 720; Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const pill = el('div', null, sp);
    Object.assign(pill.style, { position: 'absolute', left: '20px', top: '18px', padding: '7px 14px', borderRadius: '999px', background: rgba(PAL.surface, .88), border: `1px solid ${PAL.line}`, boxShadow: '0 4px 14px rgba(0,0,0,.28)', color: PAL.ink, font: "500 15px/1 'IBM Plex Sans KR',sans-serif" });
    const track = el('div', null, sp);
    Object.assign(track.style, { position: 'absolute', left: '20px', right: '100px', bottom: '22px', height: '8px', borderRadius: '4px', background: rgba(PAL.ink, .2) });
    const z = [[T1, TOTAL1], [T2, CRACK + 1.5]].map(([t0, d]) => {
      const e = el('div', null, track);
      Object.assign(e.style, { position: 'absolute', top: '0', height: '8px', borderRadius: '4px', background: PAL.accent, left: (t0 / DUR * 100) + '%', width: (d / DUR * 100) + '%' });
      return e;
    });
    const head = el('div', null, track);
    Object.assign(head.style, { position: 'absolute', top: '-4px', width: '3px', height: '16px', borderRadius: '2px', background: PAL.ink, boxShadow: `0 0 8px ${rgba(PAL.ink, .7)}` });
    const s = { scenes: SC.map(() => cv(1280, 720)), main, pill, z, head, grain, m: mesh(rng(3)), ok: null };
    s.repaint = () => SC.forEach((d, i) => paint(s.scenes[i], d, grain));
    s.repaint();
    return s;
  },
  render(s, t, a, lv) {
    const okNow = document.fonts.check(FONT);
    if (s.ok !== okNow) { s.ok = okNow; s.repaint(); }
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 컷, 2 = 셔터, 3 = + 파편
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
    const cut1 = T1 + TOTAL1 / 2, cut2 = T2 + .6;
    const [A, B, C] = s.scenes, draw = (im) => x.drawImage(im, 0, 0, 640, 360);
    const shutterOn = L >= 2 && t >= T1 && t < T1 + TOTAL1, shatterOn = L >= 3 && t >= T2 && t < T2 + CRACK + 1.5;
    // 아래층: 지금 '뒤에 깔린' 장면
    if (L >= 3 ? t >= T2 + CRACK : t >= cut2) draw(C);
    else if (L >= 2 ? t >= T1 + TOTAL1 : t >= cut1) draw(B);
    else draw(shutterOn ? B : A);
    if (L >= 2 && !shutterOn && t < T1) {            // 닫혀 있는 셔터(막대 사이 틈 선)
      const h = 360 / SLATS;
      x.fillStyle = 'rgba(0,0,0,.4)';
      for (let i = 1; i < SLATS; i++) x.fillRect(0, i * h - .6, 640, 1.2);
    }
    if (shutterOn) {
      const h = 360 / SLATS, stag = (TOTAL1 - FLIP) / Math.max(1, SLATS - 1);
      for (let i = 0; i < SLATS; i++) {
        const ph = Math.PI / 2 * E.inOutC(seg(t, T1 + i * stag, T1 + i * stag + FLIP));
        if (ph >= Math.PI / 2 - .001) continue;
        const k = Math.cos(ph), hh = h * k, cy = i * h + h / 2;
        x.drawImage(A, 0, i * h * 2, 1280, h * 2, 0, cy - hh / 2, 640, hh);
        x.fillStyle = `rgba(8,14,44,${(.6 * Math.sin(ph)).toFixed(3)})`; x.fillRect(0, cy - hh / 2, 640, hh);
        const hl = x.createLinearGradient(0, cy - hh / 2, 0, cy + hh / 2);        // 금속판 느낌의 위·아래 반사
        hl.addColorStop(0, 'rgba(255,255,255,.35)'); hl.addColorStop(.12, 'rgba(255,255,255,0)'); hl.addColorStop(.9, 'rgba(0,0,0,0)'); hl.addColorStop(1, 'rgba(0,0,0,.45)');
        x.fillStyle = hl; x.fillRect(0, cy - hh / 2, 640, hh);
      }
    }
    const m = s.m;
    if (L >= 3 && t >= T2 && t < T2 + CRACK) {       // 금이 퍼지는 중: 장면은 아직 한 장
      draw(B);
      const rad = seg(t, T2, T2 + CRACK) * m.maxd;
      x.lineWidth = 1.1; x.strokeStyle = rgba(PAL.ink, .8); x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 3;
      x.beginPath();
      m.shards.forEach((sh) => sh.p.forEach((pt, k) => {
        const q = sh.p[(k + 1) % 3], mx = (pt[0] + q[0]) / 2, my = (pt[1] + q[1]) / 2;
        if (Math.hypot(mx - m.ix, my - m.iy) < rad) { x.moveTo(pt[0], pt[1]); x.lineTo(q[0], q[1]); }
      }));
      x.stroke(); x.shadowColor = 'transparent';
      const fl = x.createRadialGradient(m.ix, m.iy, 0, m.ix, m.iy, 46 * (1 - seg(t, T2, T2 + CRACK) * .4));
      fl.addColorStop(0, 'rgba(255,255,255,.9)'); fl.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = fl; x.fillRect(m.ix - 50, m.iy - 50, 100, 100);
    } else if (shatterOn) {
      const t0 = T2 + CRACK;
      m.shards.forEach((sh) => {
        const u = Math.max(0, t - t0 - sh.delay);
        const al = 1 - seg(u, .55, 1.15);
        if (al <= 0) return;
        const px = sh.cx + sh.vx * u, py = sh.cy + sh.vy * u + .5 * GRAV * u * u, rot = sh.spin * u;
        x.save();
        x.globalAlpha = al;
        x.translate(px, py); x.rotate(rot); x.translate(-sh.cx, -sh.cy);
        x.beginPath(); sh.p.forEach((pt, k) => (k ? x.lineTo(pt[0], pt[1]) : x.moveTo(pt[0], pt[1]))); x.closePath();
        x.save(); x.clip(); x.drawImage(B, 0, 0, 640, 360);
        x.fillStyle = `rgba(0,0,0,${(.32 * Math.abs(Math.sin(rot * 1.4 + sh.tilt))).toFixed(3)})`; x.fillRect(0, 0, 640, 360);
        x.restore();
        x.lineWidth = 1; x.strokeStyle = 'rgba(255,255,255,.4)'; x.stroke();
        x.restore();
      });
    }
    s.pill.textContent = L <= 1 ? '컷 / 효과 없음' : shutterOn ? `셔터 / 막대 ${SLATS}개가 차례로 돌아감` : t >= T2 && t < T2 + CRACK && L >= 3 ? '파편 / 금이 퍼지는 중' : shatterOn ? `파편 / 조각 ${m.shards.length}개가 흩어짐` : t < T1 ? '장면 1' : t < T2 ? '장면 2' : '장면 3';
    s.z[0].style.display = L >= 2 ? 'block' : 'none'; s.z[1].style.display = L >= 3 ? 'block' : 'none';
    s.head.style.left = `calc(${(t / DUR * 100).toFixed(2)}% - 1px)`;
  },
};
export default demo;
