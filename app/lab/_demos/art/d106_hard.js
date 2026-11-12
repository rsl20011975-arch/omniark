/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/matte-transitions/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 장면 3개를 '컷 → 도형 매트 → 루마 페이드' 순서로 잇는다. 매트는 "다음 장면이 보일 자리"를 알려 주는 흑백 지도이고, 화면은 시간 t 의 함수다.
const T1 = 1.4, D1 = 1.0;     // 도형 매트 전환이 시작하는 시각 · 길이(초)
const SHAPE = 'circle';       // 매트 도형: 'circle'(원) 또는 'diamond'(마름모)
const T2 = 4.0, D2 = 1.4;     // 루마 페이드가 시작하는 시각 · 길이(초)
const SOFT = .05;             // 루마 페이드 경계의 부드러움(0 = 칼같이, 1 = 아주 넓게 번짐)
const DUR = 6.6;
const FONT = '40px "Black Han Sans"';
const SC = [
  { n: 'MORNING', c: '오전 9:00 · 사무실', top: '#16233a', mid: '#2c4568', bot: '#8fa6c6', glow: '190,215,255', gx: .78, gy: .2, hill: '#0e1a2e' },
  { n: 'SUNSET', c: '오후 6:30 · 퇴근길', top: '#2a1b3d', mid: '#b4525c', bot: '#f6b873', glow: '255,205,140', gx: .24, gy: .3, hill: '#26142a' },
  { n: 'NIGHT', c: '밤 11:00 · 집', top: '#070a18', mid: '#1b2150', bot: '#4b3f8c', glow: '170,160,255', gx: .7, gy: .22, hill: '#05060f' },
];
const LW = 160, LH = 90;

function cv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

function paint(c, d, grain) {
  const x = c.getContext('2d'), W = 1280, H = 720;
  let g = x.createLinearGradient(0, 0, W * .35, H);
  g.addColorStop(0, d.top); g.addColorStop(.58, d.mid); g.addColorStop(1, d.bot);
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  [[760, .5], [260, .38]].forEach(([r, a]) => {      // 빛은 반경이 다른 두 겹
    const rg = x.createRadialGradient(W * d.gx, H * d.gy, 0, W * d.gx, H * d.gy, r);
    rg.addColorStop(0, `rgba(${d.glow},${a})`); rg.addColorStop(1, `rgba(${d.glow},0)`);
    x.fillStyle = rg; x.fillRect(0, 0, W, H);
  });
  [[470, .5, '#fff', .1, 1.1], [560, .8, d.hill, .9, .8]].forEach(([base, amp, col, al, f], i) => {   // 먼 능선과 가까운 능선
    x.beginPath(); x.moveTo(0, H);
    for (let px = 0; px <= W; px += 16) x.lineTo(px, base + Math.sin(px / 170 * f + i * 2) * 34 * amp + Math.sin(px / 61 + i) * 9);
    x.lineTo(W, H); x.closePath();
    x.globalAlpha = al; x.fillStyle = col; x.fill(); x.globalAlpha = 1;
  });
  x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 30; x.shadowOffsetY = 8;
  x.fillStyle = '#fff'; x.textAlign = 'left'; x.font = '150px "Black Han Sans", sans-serif'; x.fillText(d.n, 70, 230);
  x.shadowColor = 'transparent';
  x.fillStyle = 'rgba(255,255,255,.92)'; x.font = '500 40px "IBM Plex Sans KR", sans-serif'; x.fillText(d.c, 76, 290);
  x.globalCompositeOperation = 'overlay'; x.globalAlpha = .12;
  for (let px = 0; px < W; px += 256) for (let py = 0; py < H; py += 256) x.drawImage(grain, px, py);
  x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
}

function shapePath(x, cx, cy, r) {
  x.beginPath();
  if (SHAPE === 'circle') x.arc(cx, cy, r, 0, Math.PI * 2);
  else { x.moveTo(cx, cy - r); x.lineTo(cx + r, cy); x.lineTo(cx, cy + r); x.lineTo(cx - r, cy); x.closePath(); }
}

const demo = {
  dur: DUR, rest: 6.0, noCompare: false, levels: 3,
  mount(sp) {
    const r = rng(5), grain = cv(256, 256), gx = grain.getContext('2d'), gd = gx.createImageData(256, 256);
    for (let i = 0; i < gd.data.length; i += 4) { const v = r() * 255; gd.data[i] = gd.data[i + 1] = gd.data[i + 2] = v; gd.data[i + 3] = 255; }
    gx.putImageData(gd, 0, 0);
    const luma = new Float32Array(LW * LH), blobs = Array.from({ length: 9 }, () => [r() * LW, r() * LH, 12 + r() * 26, .5 + r() * .5]);
    for (let j = 0; j < LH; j++) for (let i = 0; i < LW; i++) {
      let v = .25 * (1 - j / LH) + .1 * r();
      blobs.forEach(([bx, by, br, bv]) => { v += bv * Math.exp(-(((i - bx) ** 2 + (j - by) ** 2) / (2 * br * br))); });
      luma[j * LW + i] = v;
    }
    let lo = 9, hi = -9; luma.forEach((v) => { lo = Math.min(lo, v); hi = Math.max(hi, v); });
    for (let i = 0; i < luma.length; i++) luma[i] = (luma[i] - lo) / (hi - lo);
    const main = el('canvas', null, sp);
    main.width = 1280; main.height = 720; Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const th = el('canvas', null, sp);
    th.width = 224; th.height = 126; Object.assign(th.style, { position: 'absolute', left: '508px', top: '253px', width: '112px', height: '63px', borderRadius: '6px', boxShadow: '0 0 0 1.5px rgba(255,255,255,.85), 0 6px 18px rgba(0,0,0,.5)', opacity: '0' });
    const thl = el('div', null, sp, '매트(흰 곳 = 다음 장면)');
    Object.assign(thl.style, { position: 'absolute', right: '20px', bottom: '110px', color: '#fff', font: "500 11px/1 'IBM Plex Sans KR',sans-serif", textShadow: '0 1px 4px rgba(0,0,0,.8)', opacity: '0' });
    const pill = el('div', null, sp);
    Object.assign(pill.style, { position: 'absolute', left: '20px', top: '18px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.7)', color: '#fff', font: "500 15px/1 'IBM Plex Sans KR',sans-serif" });
    const track = el('div', null, sp);
    Object.assign(track.style, { position: 'absolute', left: '20px', right: '100px', bottom: '22px', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,.25)' });
    const z = [[T1, D1], [T2, D2]].map(([t0, d]) => {
      const e = el('div', null, track);
      Object.assign(e.style, { position: 'absolute', top: '0', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,.9)', left: (t0 / DUR * 100) + '%', width: (d / DUR * 100) + '%' });
      return e;
    });
    const head = el('div', null, track);
    Object.assign(head.style, { position: 'absolute', top: '-4px', width: '3px', height: '16px', borderRadius: '2px', background: '#fff', boxShadow: '0 0 8px rgba(255,255,255,.7)' });
    const s = { scenes: SC.map(() => cv(1280, 720)), tmp: cv(1280, 720), mk: cv(LW, LH), luma, main, th, thl, pill, z, head, grain, ok: null };
    s.repaint = () => SC.forEach((d, i) => paint(s.scenes[i], d, grain));
    s.repaint();
    return s;
  },
  render(s, t, a, lv) {
    const okNow = document.fonts.check(FONT);
    if (s.ok !== okNow) { s.ok = okNow; s.repaint(); }
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 컷, 2 = 도형 매트, 3 = + 루마 페이드
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
    const cut1 = T1 + D1 / 2, cut2 = T2 + D2 / 2;
    const p1 = E.inOutC(seg(t, T1, T1 + D1)), p2 = E.inOutC(seg(t, T2, T2 + D2));
    const shapeOn = L >= 2 && t > T1 && t < T1 + D1, lumaOn = L >= 3 && t > T2 && t < T2 + D2;
    x.drawImage(s.scenes[0], 0, 0, 640, 360);
    const rmax = SHAPE === 'circle' ? 385 : 520, r1 = p1 * rmax;
    if (L >= 2 ? t >= T1 + D1 : t >= cut1) x.drawImage(s.scenes[1], 0, 0, 640, 360);
    else if (shapeOn) {
      x.save(); shapePath(x, 320, 180, r1); x.clip(); x.drawImage(s.scenes[1], 0, 0, 640, 360); x.restore();
      x.save(); shapePath(x, 320, 180, r1);
      x.shadowColor = 'rgba(0,0,0,.55)'; x.shadowBlur = 22; x.lineWidth = 5; x.strokeStyle = '#ffd166'; x.stroke(); x.restore();
    }
    if (L >= 3 ? t >= T2 + D2 : t >= cut2) x.drawImage(s.scenes[2], 0, 0, 640, 360);
    const mx = s.mk.getContext('2d'), md = mx.createImageData(LW, LH);
    if (lumaOn) {
      const prog = p2 * (1 + SOFT);
      for (let i = 0; i < LW * LH; i++) {
        const q = Math.min(1, Math.max(0, (prog - (1 - s.luma[i])) / SOFT)), sm = q * q * (3 - 2 * q);
        md.data[i * 4] = md.data[i * 4 + 1] = md.data[i * 4 + 2] = 255; md.data[i * 4 + 3] = Math.round(sm * 255);
      }
      mx.putImageData(md, 0, 0);
      const tx = s.tmp.getContext('2d');
      tx.globalCompositeOperation = 'source-over'; tx.clearRect(0, 0, 1280, 720); tx.drawImage(s.scenes[2], 0, 0);
      tx.globalCompositeOperation = 'destination-in'; tx.imageSmoothingEnabled = true; tx.imageSmoothingQuality = 'high'; tx.drawImage(s.mk, 0, 0, 1280, 720);
      tx.globalCompositeOperation = 'source-over';
      x.drawImage(s.tmp, 0, 0, 640, 360);
    }
    const on = shapeOn || lumaOn, tc = s.th.getContext('2d');
    s.th.style.opacity = on ? 1 : 0; s.thl.style.opacity = on ? 1 : 0;
    if (on) {
      tc.setTransform(224 / 640, 0, 0, 126 / 360, 0, 0); tc.fillStyle = '#000'; tc.fillRect(0, 0, 640, 360);
      if (shapeOn) { shapePath(tc, 320, 180, r1); tc.fillStyle = '#fff'; tc.fill(); }
      else { tc.setTransform(1, 0, 0, 1, 0, 0); tc.imageSmoothingEnabled = true; tc.drawImage(s.mk, 0, 0, 224, 126); }
    }
    s.pill.textContent = L <= 1 ? '컷 · 효과 없음' : shapeOn ? `도형 매트 · ${SHAPE === 'circle' ? '큰 원' : '큰 마름모'}이 커지며 다음 장면이 보임` : lumaOn ? '루마 페이드 · 밝은 곳부터 다음 장면' : t < T1 ? '장면 1' : t < T2 ? '장면 2' : '장면 3';
    s.z[0].style.display = L >= 2 ? 'block' : 'none'; s.z[1].style.display = L >= 3 ? 'block' : 'none';
    s.head.style.left = `calc(${(t / DUR * 100).toFixed(2)}% - 1px)`;
  },
};
export default demo;
