/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/postprocessing/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, rng, canvas, rr } from "./helpers.js";

// 후처리: 장면을 한 장의 그림으로 먼저 그린 뒤, 그 그림 전체에 효과를 한 겹씩 덧씌운다(블룸 → 피사계 심도 → 색수차·비네트 → 필름 그레인).
const BLOOM = 0.9;      // 블룸 세기(밝은 곳이 번져 더해지는 양)
const CA = 5;           // 색수차: 화면 가장자리에서 빨강·파랑이 어긋나는 거리(px)
const VIG = 1.0;       // 비네트: 모서리가 어두워지는 정도(0~1)
const GRAIN = 0.06;     // 필름 그레인 세기
const RW = 320, RH = 180, N = RW * RH, K = RW / 640;

function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function farLayer(x, bokeh, r) {
  x.save(); x.scale(K, K); let g;
  if (!bokeh) {
  g = x.createLinearGradient(0, 0, 0, 216); g.addColorStop(0, '#060917'); g.addColorStop(.6, '#150f33'); g.addColorStop(1, '#4a1a55'); x.fillStyle = g; x.fillRect(0, 0, 640, 216);
  g = x.createRadialGradient(330, 216, 10, 330, 216, 320); g.addColorStop(0, 'rgba(255,90,170,.35)'); g.addColorStop(1, 'rgba(255,90,170,0)'); x.fillStyle = g; x.fillRect(0, 60, 640, 160);
  let bx = -10; const rb = rng(31);
  while (bx < 640) {                              // 먼 빌딩과 창문
    const w = 38 + rb() * 54, h = 48 + rb() * 96; g = x.createLinearGradient(0, 216 - h, 0, 216); g.addColorStop(0, '#111733'); g.addColorStop(1, '#0a0e22'); x.fillStyle = g; x.fillRect(bx, 216 - h, w, h);
    x.fillStyle = 'rgba(255,255,255,.07)'; x.fillRect(bx, 216 - h, w, 1.5);
    for (let wy = 216 - h + 8; wy < 208; wy += 9) for (let wx = bx + 6; wx < bx + w - 6; wx += 8) { const q = rb(); if (q < .34) { x.fillStyle = q < .06 ? '#7fe3ff' : `rgba(255,${200 + Math.floor(q * 40)},140,${(.55 + q).toFixed(2)})`; x.fillRect(wx, wy, 3.5, 4.5); } }
    bx += w + 3 + rb() * 4;
  }
  x.fillStyle = '#080b1b'; x.fillRect(0, 216, 640, 144);   // 길
  g = x.createLinearGradient(0, 216, 0, 360); g.addColorStop(0, '#16193a'); g.addColorStop(1, '#05070f'); x.fillStyle = g; x.fillRect(0, 216, 640, 144);
  x.strokeStyle = '#ff4fd8'; x.lineWidth = 3.2; x.strokeRect(452, 104, 92, 34); x.strokeStyle = '#ffc0f0'; x.lineWidth = 1.2; x.strokeRect(452, 104, 92, 34);   // 먼 곳 네온 간판
  }
  const cols = ['255,236,200', '255,236,200', '120,230,255', '255,90,120', '255,150,80', '255,100,220'];
  for (let i = 0; i < 34; i++) {                  // 먼 불빛들(DOF 에서 보케가 된다)
    const lx = 14 + r() * 612, ly = 176 + r() * 56, col = cols[i % cols.length], R = 1.8 + r() * 1.6, R2 = 9 + r() * 6;
    if (bokeh) { x.globalCompositeOperation = 'lighter'; g = x.createRadialGradient(lx, ly, R2 * .55, lx, ly, R2); g.addColorStop(0, `rgba(${col},.42)`); g.addColorStop(.85, `rgba(${col},.55)`); g.addColorStop(1, `rgba(${col},0)`); x.fillStyle = g; x.beginPath(); x.arc(lx, ly, R2, 0, 6.2832); x.fill(); x.globalCompositeOperation = 'source-over'; }
    else { x.fillStyle = `rgb(${col})`; x.beginPath(); x.arc(lx, ly, R, 0, 6.2832); x.fill(); }
    if (bokeh) continue;
    g = x.createLinearGradient(0, 218, 0, 300); g.addColorStop(0, `rgba(${col},.30)`); g.addColorStop(1, `rgba(${col},0)`); x.fillStyle = g; x.fillRect(lx - 1.2, 218, 2.4, 82);   // 젖은 길에 비친 빛
  }
  x.restore();
}
function nearLayer(x) {
  x.save(); x.scale(K, K);
  x.save(); x.translate(320, 300); x.scale(1, .22); const sg = x.createRadialGradient(0, 0, 10, 0, 0, 96); sg.addColorStop(0, 'rgba(0,0,0,.85)'); sg.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = sg; x.fillRect(-100, -100, 200, 200); x.restore();
  x.lineCap = 'round'; x.strokeStyle = 'rgb(40,200,255)'; x.lineWidth = 9; x.beginPath(); x.arc(320, 222, 98, 3.5, 5.9); x.stroke();     // 구슬 뒤의 네온 링
  x.strokeStyle = '#d9fbff'; x.lineWidth = 3.4; x.beginPath(); x.arc(320, 222, 98, 3.5, 5.9); x.stroke();
  let g = x.createRadialGradient(296, 202, 3, 322, 236, 66); g.addColorStop(0, '#f3f8ff'); g.addColorStop(.18, '#a9c1ea'); g.addColorStop(.55, '#33456f'); g.addColorStop(1, '#0a1022');
  x.beginPath(); x.arc(320, 240, 62, 0, 6.2832); x.fillStyle = g; x.fill();
  g = x.createRadialGradient(320, 300, 8, 320, 288, 66); g.addColorStop(0, 'rgba(255,90,200,.55)'); g.addColorStop(1, 'rgba(255,90,200,0)'); x.save(); x.beginPath(); x.arc(320, 240, 62, 0, 6.2832); x.clip(); x.fillStyle = g; x.fillRect(250, 220, 140, 90); x.restore();
  x.strokeStyle = 'rgba(120,230,255,.75)'; x.lineWidth = 3; x.beginPath(); x.arc(320, 240, 57, 2.2, 3.2); x.stroke();
  x.fillStyle = '#ffffff'; x.beginPath(); x.ellipse(298, 210, 11, 6, -.7, 0, 6.2832); x.fill();
  x.restore();
}
function floats(cv) { const d = cv.getContext('2d').getImageData(0, 0, RW, RH).data, o = [new Float32Array(N), new Float32Array(N), new Float32Array(N)]; for (let i = 0; i < N; i++) { o[0][i] = d[i * 4] / 255; o[1][i] = d[i * 4 + 1] / 255; o[2][i] = d[i * 4 + 2] / 255; } return o; }
function boxBlur(a, r, iter) {      // 가로·세로로 평균을 내는 번짐을 iter 번 되풀이(여러 번 하면 가우시안에 가까워진다)
  let src = Float32Array.from(a), tmp = new Float32Array(N); const w = 2 * r + 1;
  for (let it = 0; it < iter; it++) {
    for (let y = 0; y < RH; y++) { let sm = 0; const o = y * RW; for (let i = -r; i <= r; i++) sm += src[o + Math.min(RW - 1, Math.max(0, i))]; for (let x = 0; x < RW; x++) { tmp[o + x] = sm / w; sm += src[o + Math.min(RW - 1, x + r + 1)] - src[o + Math.max(0, x - r)]; } }
    for (let x = 0; x < RW; x++) { let sm = 0; for (let i = -r; i <= r; i++) sm += tmp[Math.min(RH - 1, Math.max(0, i)) * RW + x]; for (let y = 0; y < RH; y++) { src[y * RW + x] = sm / w; sm += tmp[Math.min(RH - 1, y + r + 1) * RW + x] - tmp[Math.max(0, y - r) * RW + x]; } }
  }
  return src;
}
function bloomOf(ch) {       // 밝은 곳만 뽑아(bright pass) 작게·크게 두 번 번지게 한 뒤 합친다
  const lum = (i) => .3 * ch[0][i] + .59 * ch[1][i] + .11 * ch[2][i], bp = [new Float32Array(N), new Float32Array(N), new Float32Array(N)];
  for (let i = 0; i < N; i++) { const w = Math.max(0, Math.min(1, (lum(i) - .6) / .4)), k = w * w; bp[0][i] = ch[0][i] * k; bp[1][i] = ch[1][i] * k; bp[2][i] = ch[2][i] * k; }
  return bp.map((b) => { const s = boxBlur(b, 3, 2), l = boxBlur(b, 11, 3), o = new Float32Array(N); for (let i = 0; i < N; i++) o[i] = .7 * s[i] + 1.5 * l[i]; return o; });
}
const pillDraw = (c, text) => {
  c.font = "500 14px 'IBM Plex Sans KR',sans-serif"; const w = c.measureText(text).width + 26;
  rr(c, 16, 14, w, 28, 14); c.fillStyle = 'rgba(8,10,20,.78)'; c.fill();
  c.fillStyle = '#fff'; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillText(text, 29, 29);
};

const demo = {
  dur: 3.2, rest: 2.6, noCompare: false, levels: 5,
  mount(sp) {
    sp.style.background = '#0b0f1a';
    const c = canvas(sp), r = rng(77);
    const far = mk(RW, RH), fx = far.getContext('2d'); farLayer(fx, false, rng(77));
    const farB = mk(RW, RH), bx = farB.getContext('2d'); bx.filter = 'blur(2.2px)'; bx.drawImage(far, 0, 0); bx.filter = 'none';
    const bok = mk(RW, RH), kx = bok.getContext('2d'); farLayer(kx, true, rng(77)); // 같은 장면의 보케 버전에서 불빛 원판만 따로 쓴다
    bx.globalCompositeOperation = 'lighter'; bx.globalAlpha = .55; bx.drawImage(bok, 0, 0); bx.globalAlpha = 1; bx.globalCompositeOperation = 'source-over';
    const A = mk(RW, RH), B = mk(RW, RH), ax = A.getContext('2d'), bx2 = B.getContext('2d');
    ax.drawImage(far, 0, 0); nearLayer(ax); bx2.drawImage(farB, 0, 0); nearLayer(bx2);
    const fa = floats(A), fb = floats(B), ba = bloomOf(fa), bb = bloomOf(fb);
    const vr = new Float32Array(N);
    for (let y = 0; y < RH; y++) for (let x = 0; x < RW; x++) { const nx = (x - RW / 2) / (RW / 2), ny = (y - RH / 2) / (RH / 2), rr2 = Math.hypot(nx, ny) / 1.414; vr[y * RW + x] = Math.pow(rr2, 2.2); }
    const buf = mk(RW, RH), im = buf.getContext('2d').createImageData(RW, RH);
    return { c, fa, fb, ba, bb, vr, buf, im, u32: new Uint32Array(im.data.buffer), C: [new Float32Array(N), new Float32Array(N), new Float32Array(N)] };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 4 : lv - 1);   // 0 = 후처리 없음, 1 = + 블룸, 2 = + DOF, 3 = + 색수차·비네트, 4 = + 필름 그레인
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, 640, 360);
    const ramp = L === 0 ? 0 : E.outC(seg(t, .15, 1.5)), dof = L >= 2 ? ramp : 0, bl = L >= 1 ? BLOOM * ramp : 0, ca = L >= 3 ? CA * K * ramp : 0, vg = L >= 3 ? VIG * ramp : 0, gr = L >= 4 ? GRAIN * ramp : 0;
    const [R, G, Bc] = s.C, fa = s.fa, fb = s.fb, ba = s.ba, bb = s.bb;
    for (let i = 0; i < N; i++) {
      R[i] = fa[0][i] + (fb[0][i] - fa[0][i]) * dof + (ba[0][i] + (bb[0][i] - ba[0][i]) * dof) * bl;
      G[i] = fa[1][i] + (fb[1][i] - fa[1][i]) * dof + (ba[1][i] + (bb[1][i] - ba[1][i]) * dof) * bl;
      Bc[i] = fa[2][i] + (fb[2][i] - fa[2][i]) * dof + (ba[2][i] + (bb[2][i] - ba[2][i]) * dof) * bl;
    }
    const D = s.u32, f = Math.floor(t * 24); let k = 0;
    for (let y = 0; y < RH; y++) for (let x = 0; x < RW; x++, k++) {
      let ri = k, bi = k;
      if (ca > 0) { const ox = Math.round((x - RW / 2) / (RW / 2) * ca), oy = Math.round((y - RH / 2) / (RH / 2) * ca); const xr = Math.min(RW - 1, Math.max(0, x - ox)), yr = Math.min(RH - 1, Math.max(0, y - oy)), xb = Math.min(RW - 1, Math.max(0, x + ox)), yb = Math.min(RH - 1, Math.max(0, y + oy)); ri = yr * RW + xr; bi = yb * RW + xb; }
      const v = 1 - vg * s.vr[k]; let n = 0;
      if (gr > 0) { let h = Math.imul(k ^ Math.imul(f + 1, 2654435761), 0x45d9f3b); h ^= h >>> 16; h = Math.imul(h, 0x45d9f3b); h ^= h >>> 16; n = ((h & 1023) / 1023 - .5) * gr * 2; }
      const r = Math.min(255, Math.max(0, (R[ri] * v + n) * 255)), g = Math.min(255, Math.max(0, (G[k] * v + n) * 255)), b = Math.min(255, Math.max(0, (Bc[bi] * v + n) * 255));
      D[k] = 0xff000000 | (b << 16) | (g << 8) | r;
    }
    s.buf.getContext('2d').putImageData(s.im, 0, 0);
    c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high'; c.drawImage(s.buf, 0, 0, 640, 360);
    pillDraw(c, ['연출 전: 렌더한 그대로(후처리 없음)', '1단계: 블룸 — 밝은 곳이 번져 빛남', '2단계: + 피사계 심도(DOF) — 뒤쪽 불빛이 보케로', '3단계: + 색수차 · 비네트', '4단계: + 필름 그레인'][L]);
  },
};
export default demo;
