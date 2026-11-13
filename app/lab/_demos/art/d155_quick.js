/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/paper-tear-curl/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

const PAL = { bg0: '#eef2f7', bg1: '#dfe6f0', ink: '#0f1b2d', muted: '#5a6a80', accent: '#2b6cff', accent2: '#ff8a3d', surface: '#ffffff', line: 'rgba(15,27,45,.2)' };
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

// 종이 찢기 + 페이지 말림: 찢기는 들쭉날쭉한 선을 따라 두 조각이 위쪽부터 벌어지고, 말림은 종이를 원통에 감듯 열이 옮겨 가는 위치를 계산한다. 화면은 시간 t 의 함수다.
const TEAR = 0.6;                 // 위에서 아래까지 찢는 데 걸리는 시간(초)
const RADIUS = 28;                // 종이가 말리는 원통 반지름(px)
const T0 = .4;
const PW = 190, PH = 226;         // 종이 크기(px)
const OX = [69, 381], OY = 50;    // 두 종이의 왼쪽 위
const CURL_END = 80;              // 말림이 끝났을 때 말림 선의 x(종이 왼쪽 끝 기준)
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);

function paperImg(c1, c2, seed, back) {   // 종이 한 장(앞면 또는 뒷면)을 한 번 그려 둔다(2배 해상도)
  const cv = document.createElement('canvas'); cv.width = PW * 2; cv.height = PH * 2;
  const g = cv.getContext('2d'), r = rng(seed), w = PW * 2, h = PH * 2;
  const bgc = g.createLinearGradient(0, 0, w, h); bgc.addColorStop(0, back ? '#f3eee2' : '#fbf7ec'); bgc.addColorStop(1, back ? '#e2d9c4' : '#ece3cf');
  g.fillStyle = bgc; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 900; i++) { const x = r() * w, y = r() * h, a = r() * 6.28, l = 4 + r() * 9; g.strokeStyle = `rgba(120,100,70,${(.03 + r() * .05).toFixed(3)})`; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
  if (back) { g.fillStyle = 'rgba(80,70,60,.07)'; for (let k = 0; k < 7; k++) g.fillRect(40, 70 + k * 56, w - 80 - (k % 3) * 40, 12); return cv; }
  const hg = g.createLinearGradient(0, 0, w, 0); hg.addColorStop(0, c1); hg.addColorStop(1, c2);
  g.fillStyle = hg; g.fillRect(24, 26, w - 48, 84);
  g.fillStyle = 'rgba(255,255,255,.92)'; g.fillRect(44, 48, 170, 14); g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(44, 74, 110, 10);
  const rg = g.createRadialGradient(w / 2 - 18, 178, 8, w / 2, 196, 60); rg.addColorStop(0, '#fff'); rg.addColorStop(.25, c2); rg.addColorStop(1, c1);
  g.fillStyle = rg; g.beginPath(); g.arc(w / 2, 196, 54, 0, 6.2832); g.fill();
  g.fillStyle = 'rgba(60,55,50,.55)'; for (let k = 0; k < 5; k++) g.fillRect(34, 282 + k * 30, w - 68 - ((k * 37) % 90), 9);
  return cv;
}
function tearLine(seed) {   // 들쭉날쭉한 찢김 선(위에서 아래로) + 섬유 가닥
  const r = rng(seed), pts = [], fib = [];
  for (let y = 0; y <= PH; y += 3) {
    const x = PW / 2 + 7 * Math.sin(y / 23 + 1) + 4 * Math.sin(y / 9) + (r() - .5) * 5;
    pts.push([x, y]);
    if (r() < .55) fib.push([x, y, (r() - .5) * 6, 2 + r() * 5, r()]);
  }
  return { pts, fib };
}
function polyPath(c, pts) { c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); }

const demo = {
  dur: 4, rest: 3.4, noCompare: false, levels: 3,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: `linear-gradient(160deg,${PAL.bg0} 0%,${PAL.bg1} 100%)` });
    box(el('div', null, bg), { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.08', mixBlendMode: 'multiply' });
    [14, 326].forEach((x, i) => {
      const p = el('div', null, sp);
      box(p, { position: 'absolute', left: x + 'px', top: '20px', width: '300px', height: '296px', borderRadius: '12px', background: rgba(PAL.surface, .7), border: `1px solid ${PAL.line}`, boxShadow: `0 8px 20px ${rgba(PAL.ink, .08)}` });
      const h = el('div', null, p, i ? '페이지 말림' : '종이 찢기');
      box(h, { position: 'absolute', left: '14px', top: '10px', font: "700 13px/1 'IBM Plex Sans KR',sans-serif", color: PAL.ink });
    });
    const cv = el('canvas', null, sp); cv.width = 1280; cv.height = 720;
    const rd = [0, 1].map((i) => { const e = el('div', null, sp); box(e, { position: 'absolute', left: (28 + i * 312) + 'px', top: '292px', font: "500 10.5px/1 'JetBrains Mono',monospace", color: PAL.ink }); return e; });
    // 이름표(caption-bl): 왼쪽 아래, 배경 없음, 위에 1px 얇은 선
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', bottom: '14px', paddingTop: '6px', borderTop: `1px solid ${PAL.line}`, color: PAL.muted, font: "500 12px/1.3 'JetBrains Mono','IBM Plex Sans KR',monospace", zIndex: 5 });
    return { ctx: cv.getContext('2d'), rd, pill, A: paperImg(PAL.accent2, '#ffc08a', 3, false), B: paperImg(PAL.accent, '#86a9ff', 5, false), K: paperImg('', '', 9, true), tear: tearLine(21) };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 곧게 자르고 가장자리를 그냥 지움, 2 = + 들쭉날쭉 찢김·섬유, 3 = + 원통에 감기는 말림
    const c = s.ctx; c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 1280, 720);
    // ── 찢기
    const p = E.inOutC(seg(t, T0, T0 + TEAR)), fin = E.outC(seg(t, T0 + TEAR, T0 + TEAR + .7));
    const yt = p * PH, rough = L >= 2;
    const line = rough ? s.tear.pts : [[PW / 2, 0], [PW / 2, PH]];
    const xs = (y) => { if (!rough) return PW / 2; const i = Math.min(line.length - 1, Math.round(y / 3)); return line[i][0]; };
    const upto = rough ? line.filter((q) => q[1] <= yt) : [[PW / 2, 0], [PW / 2, yt]];
    const tip = [xs(yt), yt], phi = (p * 6 + fin * 3) * Math.PI / 180, spread = p * 2 + fin * 4;
    c.setTransform(2, 0, 0, 2, 2 * OX[0], 2 * OY);
    c.save(); c.shadowColor = rgba(PAL.ink, .38); c.shadowBlur = 20; c.shadowOffsetY = 8; c.fillStyle = '#e9e1cf'; c.fillRect(0, yt, PW, PH - yt + .5); c.restore();
    c.save(); c.beginPath(); c.rect(0, yt, PW, PH - yt + 1); c.clip(); c.drawImage(s.A, 0, 0, PW, PH); c.restore();
    const piece = (side) => {
      const edge = upto.length ? upto : [[PW / 2, 0]];
      const poly = side < 0 ? [[0, 0], ...edge, tip, [0, yt]] : [edge[0], [PW, 0], [PW, yt], tip, ...edge.slice().reverse()];
      if (yt < 1) return;
      c.save(); c.translate(tip[0] + side * spread, tip[1]); c.rotate(side * phi); c.translate(-tip[0], -tip[1]);
      c.save(); c.shadowColor = rgba(PAL.ink, .42); c.shadowBlur = 14; c.shadowOffsetY = 6; c.fillStyle = '#ece3cf'; polyPath(c, poly); c.closePath(); c.fill(); c.restore();
      c.save(); polyPath(c, poly); c.closePath(); c.clip(); c.drawImage(s.A, 0, 0, PW, PH);
      if (rough) { c.strokeStyle = 'rgba(255,252,244,.96)'; c.lineWidth = 5; polyPath(c, edge); c.stroke(); }
      c.restore();
      if (rough) { c.strokeStyle = 'rgba(255,252,244,.8)'; c.lineWidth = .8; s.tear.fib.forEach(([x, y, dx, l, q]) => { if (y > yt) return; c.beginPath(); c.moveTo(x, y); c.lineTo(x - side * l * (q > .5 ? 1 : .6), y + dx * .5); c.stroke(); }); }
      c.restore();
    };
    piece(-1); piece(1);
    // ── 말림
    const q = E.inOutC(seg(t, T0, T0 + 1.6)), xc = lerp(PW, CURL_END, q), curl = L >= 3, r = RADIUS;
    c.setTransform(2, 0, 0, 2, 2 * OX[1], 2 * OY);
    c.save(); c.shadowColor = rgba(PAL.ink, .38); c.shadowBlur = 20; c.shadowOffsetY = 8; c.fillStyle = '#e9e1cf'; c.fillRect(0, 0, xc, PH); c.restore();
    c.drawImage(s.B, 0, 0, xc * 2, PH * 2, 0, 0, xc, PH);
    let tail = 0;
    if (curl && xc < PW - .5) {
      const sLen = PW - xc; tail = Math.max(0, sLen - Math.PI * r);
      if (tail > 0) { const g2 = c.createLinearGradient(xc - tail - 14, 0, xc - tail, 0); g2.addColorStop(0, 'rgba(0,0,0,0)'); g2.addColorStop(1, 'rgba(0,0,0,.30)'); c.fillStyle = g2; c.fillRect(xc - tail - 14, 0, 14, PH); c.fillStyle = 'rgba(0,0,0,.20)'; c.fillRect(xc - tail, 0, tail, PH); }
      const sh = c.createLinearGradient(xc, 0, xc + r * 1.3, 0); sh.addColorStop(0, 'rgba(0,0,0,.22)'); sh.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = sh; c.fillRect(xc, 0, r * 1.3, PH);
      const X = (u) => { const sL = u - xc; return sL <= Math.PI * r ? xc + r * Math.sin(sL / r) : xc - (sL - Math.PI * r); };
      for (let u = xc; u < PW; u += .5) {
        const sL = u - xc, th = Math.min(Math.PI, sL / r), x0 = X(u), x1 = X(Math.min(PW, u + .5)), w = Math.abs(x1 - x0) + .35, lx = Math.min(x0, x1) - .1;
        const back = th > Math.PI / 2;
        c.drawImage(back ? s.K : s.B, u * 2, 0, 1, PH * 2, lx, 0, w, PH);
        let dark = 0, hi = 0;
        if (!back) dark = .42 * Math.pow(Math.sin(th), 1.5);
        else if (th < Math.PI) { dark = .04 + .24 * ((th - Math.PI / 2) / (Math.PI / 2)); hi = .55 * Math.exp(-Math.pow((th - 1.95) / .26, 2)); } else dark = .05;
        if (dark > 0) { c.fillStyle = `rgba(20,10,0,${dark.toFixed(3)})`; c.fillRect(lx, 0, w, PH); }
        if (hi > 0) { c.fillStyle = `rgba(255,255,255,${hi.toFixed(3)})`; c.fillRect(lx, 0, w, PH); }
      }
    }
    s.rd[0].textContent = `찢은 길이 ${Math.round(p * 100)}%, ${rough ? '들쭉날쭉한 선과 섬유' : '곧은 선'}`;
    s.rd[1].textContent = curl ? `반지름 ${r}px, 말린 길이 ${Math.round(PW - xc)}px` : `종이가 ${Math.round(100 * xc / PW)}% 남음(말림 없음)`;
    s.pill.textContent = L <= 1 ? '연출 전 / 곧게 잘리고 가장자리가 그냥 사라짐' : L === 2 ? '찢기 / 들쭉날쭉한 선과 흰 섬유가 생김' : '말림 / 종이가 원통에 감기며 뒷면이 보임';
  },
};
export default demo;
