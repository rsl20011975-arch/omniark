/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/flow-vector-field/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, rng, canvas, rr } from "./helpers.js";

// 벡터 필드: 화면의 모든 자리에 '그 자리에서 움직이는 방향과 세기'를 주는 함수. 점들이 그 방향을 따라 흐르며 남긴 길이 '선 흐름'이다.
const EDDY = 1.6;       // 화면 가로로 지나가는 소용돌이 물결 수(클수록 소용돌이가 작고 많아진다)
const TRAIL = 0.45;     // 점이 남기는 꼬리의 길이(초)
const SPEED = 90;       // 필드 세기 1 이 뜻하는 속도(px/초)
const COUNT = 420;      // 흐르는 점의 개수
const GRID = 32;        // 화살표 격자 간격(px)
const DUR = 4.4, PRE = 1.5, DT = 1 / 30;
const W = 640, H = 360;

const K = EDDY * Math.PI;
function field(x, y) {                 // 화면 좌표(px) -> [가로 세기, 세로 세기] (정규화된 단위)
  const X = x / W * 2, Y = y / H, a = K * X + .6, b = K * Y + .3, c = 1.7 * K * X - 1.3 * K * Y + 1.1;
  const dX = K * Math.cos(a) * Math.sin(b) + .45 * 1.7 * K * Math.cos(c), dY = K * Math.sin(a) * Math.cos(b) - .45 * 1.3 * K * Math.cos(c);
  return [dY / K + .35, -dX / K];      // 흐름 함수의 기울기에서 얻는 소용돌이 + 오른쪽으로 가는 약한 바람
}
const cls = (m) => (m < .55 ? 0 : m < 1.1 ? 1 : 2);
const COL = ['70,140,255', '60,220,230', '255,176,90'];
const pillDraw = (c, text) => {
  c.font = "500 14px 'IBM Plex Sans KR',sans-serif"; const w = c.measureText(text).width + 26;
  rr(c, 16, 14, w, 28, 14); c.fillStyle = 'rgba(8,10,20,.78)'; c.fill();
  c.fillStyle = '#fff'; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillText(text, 29, 29);
};

const demo = {
  dur: DUR, rest: 3.6, noCompare: false, levels: 4,
  mount(sp) {
    sp.style.background = '#0b0f1a';
    const c = canvas(sp), r = rng(9), NS = Math.round((DUR + PRE) / DT) + 3;
    const px = new Float32Array(COUNT * NS), py = new Float32Array(COUNT * NS), cl = new Uint8Array(COUNT * NS), fa = new Float32Array(COUNT * NS), br = new Uint8Array(COUNT * NS);
    for (let p = 0; p < COUNT; p++) {          // 점마다 길을 미리 계산(수명이 끝나거나 화면 밖으로 나가면 새 자리에서 다시 시작)
      let x = r() * W, y = r() * H, age = r() * 2, life = 1.8 + r() * 1.8;
      for (let k = 0; k < NS; k++) {
        const i = p * NS + k, [u1, v1] = field(x, y), [u2, v2] = field(x + u1 * SPEED * DT, y + v1 * SPEED * DT);
        px[i] = x; py[i] = y; cl[i] = cls(Math.hypot(u1, v1)); fa[i] = Math.min(1, age / .35) * Math.min(1, (life - age) / .45);
        x += (u1 + u2) / 2 * SPEED * DT; y += (v1 + v2) / 2 * SPEED * DT; age += DT;
        if (age > life || x < -12 || x > W + 12 || y < -12 || y > H + 12) { x = r() * W; y = r() * H; age = 0; life = 1.8 + r() * 1.8; if (k + 1 < NS) br[i + 1] = 1; }
      }
    }
    const lin = Array.from({ length: COUNT }, () => { const ang = r() * 6.2832, v = 25 + r() * 70; return { x: r() * W, y: r() * H, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v }; });
    const arrows = [];
    for (let gy = GRID / 2; gy < H; gy += GRID) for (let gx = GRID / 2; gx < W; gx += GRID) { const [u, v] = field(gx, gy), m = Math.hypot(u, v); arrows.push({ gx, gy, u, v, m, c: cls(m) }); }
    const gr = document.createElement('canvas'); gr.width = gr.height = 128; const gx = gr.getContext('2d'), gi = gx.createImageData(128, 128), q = rng(3);
    for (let i = 0; i < 128 * 128; i++) { const v = q() > .5 ? 255 : 0; gi.data[i * 4] = gi.data[i * 4 + 1] = gi.data[i * 4 + 2] = v; gi.data[i * 4 + 3] = 12 + q() * 12; }
    gx.putImageData(gi, 0, 0);
    return { c, NS, px, py, cl, fa, br, lin, arrows, gr };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv - 1);   // 0 = 필드 없이 직선, 1 = 화살표 격자 + 따라 흐르는 점, 2 = + 꼬리(선 흐름), 3 = + 속도 색·빛 번짐
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, 640, 360);
    let g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, '#0b0f1a'); g.addColorStop(1, '#131b30'); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
    if (L === 0) {
      c.fillStyle = 'rgba(255,255,255,.8)';
      for (const p of s.lin) { const x = ((p.x + p.vx * t) % W + W) % W, y = ((p.y + p.vy * t) % H + H) % H; c.beginPath(); c.arc(x, y, 2, 0, 6.2832); c.fill(); }
    } else {
      if (L === 1) {          // 화살표 격자: 방향 = 화살 방향, 세기 = 화살 길이
        const P = [new Path2D(), new Path2D(), new Path2D()];
        for (const ar of s.arrows) {
          const ang = Math.atan2(ar.v, ar.u), len = Math.min(GRID * .9, 6 + ar.m * 12), p = P[ar.c], x2 = ar.gx + Math.cos(ang) * len / 2, y2 = ar.gy + Math.sin(ang) * len / 2, x1 = ar.gx - Math.cos(ang) * len / 2, y1 = ar.gy - Math.sin(ang) * len / 2;
          p.moveTo(x1, y1); p.lineTo(x2, y2); p.moveTo(x2 - Math.cos(ang - .5) * 5, y2 - Math.sin(ang - .5) * 5); p.lineTo(x2, y2); p.lineTo(x2 - Math.cos(ang + .5) * 5, y2 - Math.sin(ang + .5) * 5);
        }
        c.lineWidth = 1.3; c.lineCap = 'round'; c.lineJoin = 'round';
        P.forEach((p, i) => { c.strokeStyle = `rgba(${COL[i]},.62)`; c.stroke(p); });
      }
      const kf = (t + PRE) / DT, k0 = Math.floor(kf), fk = kf - k0, NS = s.NS, n = Math.round(TRAIL / DT);
      if (L >= 2) {
        if (L >= 3) c.globalCompositeOperation = 'lighter';
        const nb = 4, paths = Array.from({ length: nb * 3 }, () => new Path2D());
        for (let p = 0; p < COUNT; p++) {
          const base = p * NS;
          let hx = s.px[base + k0] + (s.px[base + k0 + 1] - s.px[base + k0]) * fk, hy = s.py[base + k0] + (s.py[base + k0 + 1] - s.py[base + k0]) * fk;
          if (s.br[base + k0 + 1]) { hx = s.px[base + k0]; hy = s.py[base + k0]; }
          let lx = hx, ly = hy;
          for (let j = 0; j < n && k0 - j >= 0; j++) {
            const i = base + k0 - j; if (s.br[i + 1] && j > 0) break;
            const b = Math.min(nb - 1, Math.floor(j / n * nb)), pth = paths[b * 3 + (L >= 3 ? s.cl[i] : 1)];
            pth.moveTo(lx, ly); lx = s.px[i]; ly = s.py[i]; pth.lineTo(lx, ly);
          }
        }
        c.lineCap = 'round'; c.lineWidth = L >= 3 ? 1.6 : 1.4;
        const AL = [.95, .6, .34, .14];
        for (let b = 0; b < nb; b++) for (let k = 0; k < 3; k++) { c.strokeStyle = L >= 3 ? `rgba(${COL[k]},${AL[b]})` : `rgba(170,215,255,${AL[b] * .9})`; c.stroke(paths[b * 3 + k]); }
        c.globalCompositeOperation = 'source-over';
      }
      for (let p = 0; p < COUNT; p++) {          // 점의 머리
        const i = p * NS + k0, hx = s.px[i] + (s.px[i + 1] - s.px[i]) * fk, hy = s.py[i] + (s.py[i + 1] - s.py[i]) * fk;
        if (s.br[i + 1] && fk > 0) continue;
        c.globalAlpha = s.fa[i]; c.fillStyle = L >= 3 ? `rgb(${COL[s.cl[i]]})` : '#fff'; c.beginPath(); c.arc(hx, hy, L >= 3 ? 1.9 : 2.1, 0, 6.2832); c.fill();
      }
      c.globalAlpha = 1;
    }
    c.fillStyle = c.createPattern(s.gr, 'repeat'); c.fillRect(0, 0, 640, 360);
    pillDraw(c, ['연출 전: 점이 제각각 직선으로 움직임(필드 없음)', '1단계: 화살표 격자(벡터 필드)와 그 방향을 따르는 점', '2단계: 점이 지나간 길을 꼬리로 남김(선 흐름)', '3단계: + 속도 색(파랑 느림 → 주황 빠름) · 빛 번짐'][L]);
    if (L >= 3) {
      c.font = "500 12px 'IBM Plex Sans KR',sans-serif"; c.textBaseline = 'middle'; c.textAlign = 'left';
      [['느림', 0], ['보통', 1], ['빠름', 2]].forEach(([tx, i]) => { const x = 20 + i * 72; c.fillStyle = `rgb(${COL[i]})`; c.fillRect(x, 332, 14, 4); c.fillStyle = 'rgba(255,255,255,.85)'; c.fillText(tx, x + 20, 334); });
    }
  },
};
export default demo;
