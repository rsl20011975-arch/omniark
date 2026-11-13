/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/globe/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, rng, canvas, rr } from "./helpers.js";

// 지구본 = 평평한 정방형 지도(경도·위도 격자)를 구에 감은 것. 화면의 구 위 한 점마다 '이 점이 지도의 어디인지'를 거꾸로 계산해 색을 가져온다(정사영).
const PAL = { bg0: '#1f3a8a', bg1: '#172a63', ink: '#f3f6ff', muted: '#aebcf0', accent: '#ffd166', accent2: '#7fe0ff', surface: '#1b3274', line: '#3c58b0' };
const TILT = 23.5;      // 자전축이 기울어진 각도(도)
const SPIN = 20;        // 자전 속도(도/초, 왼쪽에서 오른쪽으로)
const RG = 140;         // 구의 반지름(px)
const PITCH = .3;       // 카메라가 위에서 내려다보는 각도(rad)
const TW = 384, TH = 192, BS = 300, CX = 320, CY = 187;
const LS = (() => { const v = [-.55, .35, .76], l = Math.hypot(...v); return v.map((x) => x / l); })();
const PINS = [[48, -100, '핀 1'], [-12, 40, '핀 2'], [18, 150, '핀 3']];   // [위도, 경도] — 가상 행성의 임의 지점

const PERM = (() => { const r = rng(17), p = Array.from({ length: 256 }, (_, i) => i); for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; } return Uint8Array.from([...p, ...p]); })();
const sm = (x) => x * x * (3 - 2 * x), h3 = (x, y, z) => PERM[PERM[PERM[x & 255] + y & 255] + z & 255] / 255;
function n3(x, y, z) {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z), fx = sm(x - ix), fy = sm(y - iy), fz = sm(z - iz);
  const l = (a, b, t) => a + (b - a) * t;
  return l(l(l(h3(ix, iy, iz), h3(ix + 1, iy, iz), fx), l(h3(ix, iy + 1, iz), h3(ix + 1, iy + 1, iz), fx), fy), l(l(h3(ix, iy, iz + 1), h3(ix + 1, iy, iz + 1), fx), l(h3(ix, iy + 1, iz + 1), h3(ix + 1, iy + 1, iz + 1), fx), fy), fz);
}
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mixh = (a, b, p) => '#' + rgb(a).map((v, i) => Math.round(v + (rgb(b)[i] - v) * p).toString(16).padStart(2, '0')).join('');
const rgba = (h, al) => { const [r, g, b] = rgb(h); return `rgba(${r},${g},${b},${al})`; };
const INK = rgb(PAL.ink), ACC = rgb(PAL.accent), RIM = rgb(PAL.accent2);
const mix3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
function makeTexture() {          // 가상 행성: 바다 · 대륙 · 극지 얼음 · 어두운 쪽의 도시 불빛
  const tex = new Uint8Array(TW * TH * 3), lights = new Uint8Array(TW * TH), ocean = new Uint8Array(TW * TH), THR = .5;
  for (let j = 0; j < TH; j++) for (let i = 0; i < TW; i++) {
    const lon = (i / TW - .5) * 6.2832, lat = (.5 - (j + .5) / TH) * Math.PI, cl = Math.cos(lat), x = cl * Math.sin(lon), y = Math.sin(lat), z = cl * Math.cos(lon);
    let nn = 0, amp = .5, f = 1.7, nrm = 0; for (let o = 0; o < 4; o++) { nn += amp * n3(x * f + 7, y * f + 3, z * f + 11); nrm += amp; amp *= .5; f *= 2; } nn /= nrm;
    const det = .9 + .2 * n3(x * 14, y * 14, z * 14), k = j * TW + i; let col;
    if (nn < THR) { col = mix3([44, 138, 176], [8, 34, 88], Math.min(1, (THR - nn) * 5)); ocean[k] = 255; }
    else { const e = (nn - THR) / (1 - THR); col = e < .1 ? [216, 202, 142] : e < .4 ? mix3([72, 148, 84], [128, 150, 84], (e - .1) / .3) : e < .65 ? mix3([128, 150, 84], [150, 118, 94], (e - .4) / .25) : mix3([150, 118, 94], [232, 234, 238], Math.min(1, (e - .65) / .15)); col = col.map((c) => c * det);
      const hf = n3(x * 38 + 2, y * 38, z * 38 + 5); lights[k] = e < .5 && Math.abs(lat) < 1.05 ? Math.max(0, Math.min(1, (hf - .62) / .16)) * 255 : 0; }
    const ice = Math.max(0, Math.min(1, (Math.abs(lat) * 57.3 - 62) / 14)); col = mix3(col, [240, 246, 252], ice);
    tex[k * 3] = col[0]; tex[k * 3 + 1] = col[1]; tex[k * 3 + 2] = col[2]; if (ice > .3) ocean[k] = 0;
  }
  return { tex, lights, ocean };
}
const mm = (A, B) => [0, 1, 2].map((i) => [0, 1, 2].map((j) => A[i][0] * B[0][j] + A[i][1] * B[1][j] + A[i][2] * B[2][j]));
const Rx = (a) => [[1, 0, 0], [0, Math.cos(a), -Math.sin(a)], [0, Math.sin(a), Math.cos(a)]], Rz = (a) => [[Math.cos(a), -Math.sin(a), 0], [Math.sin(a), Math.cos(a), 0], [0, 0, 1]], Ry = (a) => [[Math.cos(a), 0, Math.sin(a)], [0, 1, 0], [-Math.sin(a), 0, Math.cos(a)]];
const tagDraw = (c, text) => {      // 오른쪽 위 직각 이름표: 왼쪽에 accent 줄
  c.font = "600 12px 'IBM Plex Sans KR',sans-serif"; const w = c.measureText(text).width + 26, x = 640 - 16 - w;
  rr(c, x, 14, w, 26, 2); c.fillStyle = rgba(PAL.surface, .96); c.fill(); c.strokeStyle = PAL.line; c.lineWidth = 1; c.stroke();
  c.fillStyle = PAL.accent; c.fillRect(x, 14, 3, 26);
  c.fillStyle = PAL.ink; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillText(text, x + 14, 27.5);
};

const demo = {
  dur: 4.6, rest: 4.0, noCompare: false, levels: 4,
  mount(sp) {
    sp.style.background = PAL.bg1;
    const c = canvas(sp), T = makeTexture(), rs = rng(23);
    const stars = Array.from({ length: 90 }, () => [rs() * 640, rs() * 330, .4 + rs() * 1.0, .25 + rs() * .6]);
    // 구 위 각 픽셀의 법선(미리 계산): bbox BS x BS 안에서 반지름 RG 의 원
    const idx = [], NX = [], NY = [], NZ = [], COV = [];
    for (let y = 0; y < BS; y++) for (let x = 0; x < BS; x++) {
      const px = (x + .5 - BS / 2) / RG, py = -(y + .5 - BS / 2) / RG, r2 = px * px + py * py, r = Math.sqrt(r2);
      if (r > 1.01) continue;
      const q = Math.min(r, .9995), nz = Math.sqrt(1 - q * q), s = r > 0 ? q / r : 1; idx.push(y * BS + x); NX.push(px * s); NY.push(py * s); NZ.push(nz); COV.push(Math.max(0, Math.min(1, (1 - r) * RG + .5)));
    }
    const flat = document.createElement('canvas'); flat.width = TW; flat.height = TH; const fx = flat.getContext('2d'), fi = fx.createImageData(TW, TH);
    for (let k = 0; k < TW * TH; k++) { fi.data[k * 4] = T.tex[k * 3]; fi.data[k * 4 + 1] = T.tex[k * 3 + 1]; fi.data[k * 4 + 2] = T.tex[k * 3 + 2]; fi.data[k * 4 + 3] = 255; } fx.putImageData(fi, 0, 0);
    const buf = document.createElement('canvas'); buf.width = buf.height = BS; const bx = buf.getContext('2d'), im = bx.createImageData(BS, BS);
    const gr = document.createElement('canvas'); gr.width = gr.height = 128; const gx = gr.getContext('2d'), gi = gx.createImageData(128, 128), q = rng(3);
    for (let i = 0; i < 128 * 128; i++) { const v = q() > .5 ? 255 : 0; gi.data[i * 4] = gi.data[i * 4 + 1] = gi.data[i * 4 + 2] = v; gi.data[i * 4 + 3] = 12 + q() * 12; }
    gx.putImageData(gi, 0, 0);
    return { c, T, stars, idx: Int32Array.from(idx), NX: Float32Array.from(NX), NY: Float32Array.from(NY), NZ: Float32Array.from(NZ), COV: Float32Array.from(COV), flat, buf, bx, im, u32: new Uint32Array(im.data.buffer), gr };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv - 1);   // 0 = 납작한 지도, 1 = 구에 감아 돌리기(빛 없음), 2 = + 빛·터미네이터·대기, 3 = + 축 기울기·격자·핀·야경
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, 640, 360);
    let g = c.createRadialGradient(CX, CY, 20, CX, CY, 420); g.addColorStop(0, PAL.bg0); g.addColorStop(1, PAL.bg1); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
    for (const [x, y, r, al] of s.stars) { c.fillStyle = rgba(PAL.ink, al); c.fillRect(x, y, r, r); }
    let cap = '';
    if (L === 0) {
      c.imageSmoothingEnabled = true; c.drawImage(s.flat, 60, 62, 520, 260); c.strokeStyle = rgba(PAL.ink, .4); c.lineWidth = 1; c.strokeRect(60.5, 62.5, 519, 259);
      cap = '평면 지도(가로 = 경도 360°, 세로 = 위도 180°) · 극지방이 가로로 크게 늘어나 있다';
    } else {
      const spin = (SPIN * t + 40) * Math.PI / 180, tilt = (L >= 3 ? TILT : 0) * Math.PI / 180;
      const F = mm(mm(Rx(PITCH), Rz(tilt)), Ry(spin)), M = [[F[0][0], F[1][0], F[2][0]], [F[0][1], F[1][1], F[2][1]], [F[0][2], F[1][2], F[2][2]]];   // M = F 의 전치(화면 → 지도 쪽 좌표)
      if (L >= 2) {          // 구 바깥으로 번지는 푸른 대기 빛(겹이 다른 두 겹)
        c.globalCompositeOperation = 'lighter';
        [[RG * 1.42, .16], [RG * 1.16, .30]].forEach(([R, al]) => { g = c.createRadialGradient(CX, CY, RG * .96, CX, CY, R); g.addColorStop(0, rgba(PAL.accent2, al)); g.addColorStop(1, rgba(PAL.accent2, 0)); c.fillStyle = g; c.fillRect(CX - R, CY - R, R * 2, R * 2); });
        c.globalCompositeOperation = 'source-over';
      }
      const D = s.u32, { tex, lights, ocean } = s.T, N = s.idx.length, HX = LS[0], HY = LS[1], HZ = LS[2] + 1, HL = Math.hypot(HX, HY, HZ);
      D.fill(0);
      for (let k = 0; k < N; k++) {
        const nx = s.NX[k], ny = s.NY[k], nz = s.NZ[k], px = M[0][0] * nx + M[0][1] * ny + M[0][2] * nz, py = M[1][0] * nx + M[1][1] * ny + M[1][2] * nz, pz = M[2][0] * nx + M[2][1] * ny + M[2][2] * nz;
        const lat = Math.asin(Math.max(-1, Math.min(1, py))), lon = Math.atan2(px, pz);
        let ti = Math.floor((lon / 6.2832 + .5) * TW), tj = Math.floor((.5 - lat / Math.PI) * TH); if (ti >= TW) ti = TW - 1; if (tj >= TH) tj = TH - 1; if (tj < 0) tj = 0;
        const q = tj * TW + ti; let r = tex[q * 3], g2 = tex[q * 3 + 1], b = tex[q * 3 + 2];
        if (L >= 2) {
          const lam = nx * LS[0] + ny * LS[1] + nz * LS[2], day = Math.max(0, Math.min(1, (lam + .06) / .3)), k2 = .12 + .95 * Math.max(0, lam);
          const spec = ocean[q] ? Math.pow(Math.max(0, (nx * HX + ny * HY + nz * HZ) / HL), 200) * .6 * day : 0;
          const fr = Math.pow(1 - nz, 3) * (.25 + .75 * Math.max(0, Math.min(1, (lam + .35) / .9)));
          const nl = lights[q] / 255 * (1 - day) * (L >= 3 ? 1 : 0);
          r = r * k2 + spec * 255 + fr * RIM[0] * .85 + nl * ACC[0]; g2 = g2 * k2 + spec * 255 + fr * RIM[1] * .85 + nl * ACC[1]; b = b * k2 + spec * 240 + fr * RIM[2] * .9 + nl * ACC[2] * .7;
        }
        if (L >= 3) {          // 위경도 격자: 30° 간격의 옅은 선
          const latd = lat * 57.2958, lond = lon * 57.2958, dl = Math.abs(((latd + 15) % 30 + 30) % 30 - 15), dn = Math.abs(((lond + 15) % 30 + 30) % 30 - 15) * Math.cos(lat);
          const ln = Math.max(0, 1 - Math.min(dl, dn) / .55) * .38; r += (INK[0] - r) * ln; g2 += (INK[1] - g2) * ln; b += (INK[2] - b) * ln;
        }
        D[s.idx[k]] = ((Math.round(s.COV[k] * 255)) << 24) | (Math.min(255, b) << 16) | (Math.min(255, g2) << 8) | Math.min(255, r);
      }
      s.bx.putImageData(s.im, 0, 0);
      c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high'; c.drawImage(s.buf, CX - BS / 2, CY - BS / 2, BS, BS);
      if (L >= 3) {          // 핀: 앞면에 있을 때만, 가장자리로 갈수록 옅게
        for (const [la, lo, nm] of PINS) {
          const lt = la * Math.PI / 180, ln = lo * Math.PI / 180, v = [Math.cos(lt) * Math.sin(ln), Math.sin(lt), Math.cos(lt) * Math.cos(ln)];
          const w = [0, 1, 2].map((i) => F[i][0] * v[0] + F[i][1] * v[1] + F[i][2] * v[2]); if (w[2] < .12) continue;
          const al = Math.min(1, (w[2] - .12) / .3), x0 = CX + w[0] * RG, y0 = CY - w[1] * RG, x1 = CX + w[0] * RG * 1.1, y1 = CY - w[1] * RG * 1.1 - 8;
          c.globalAlpha = al; c.strokeStyle = rgba(PAL.ink, .85); c.lineWidth = 1.2; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
          const pr = (t * .9) % 1; c.strokeStyle = rgba(PAL.accent, (.8 * (1 - pr)).toFixed(2)); c.beginPath(); c.ellipse(x0, y0, 3 + 9 * pr, (3 + 9 * pr) * (.35 + .65 * w[2]), 0, 0, 6.2832); c.stroke();
          g = c.createRadialGradient(x1 - 1, y1 - 1, .5, x1, y1, 5); g.addColorStop(0, mixh(PAL.accent, PAL.ink, .75)); g.addColorStop(.5, PAL.accent); g.addColorStop(1, mixh(PAL.accent, '#5a2a00', .6)); c.fillStyle = g; c.beginPath(); c.arc(x1, y1, 4.6, 0, 6.2832); c.fill();
          c.font = "500 11px 'IBM Plex Sans KR',sans-serif"; c.fillStyle = PAL.ink; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(nm, x1 + 8, y1); c.globalAlpha = 1;
        }
      }
      cap = ['', `구에 감음: 화면 (x, y) → 위도 = asin(y), 경도 = atan2(x, z) · 자전 ${SPIN}°/초`, `+ 빛: 밝기 = 법선 · 해 방향, 경계(터미네이터)와 푸른 테두리(프레넬)`, `+ 축 ${TILT}° 기울임 · 30° 격자 · 핀 · 어두운 쪽의 도시 불빛`][L];
    }
    c.fillStyle = c.createPattern(s.gr, 'repeat'); c.fillRect(0, 0, 640, 360);
    c.fillStyle = rgba(PAL.bg1, .82); c.fillRect(0, 330, 640, 30); c.fillStyle = PAL.line; c.fillRect(0, 330, 640, 1);
    c.font = "500 13px 'JetBrains Mono',monospace"; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillStyle = PAL.ink; c.fillText(cap, 18, 345);
    tagDraw(c, ['연출 전: 납작한 평면 지도', '1단계: 지도를 구에 감아 돌림(빛 없음)', '2단계: + 빛과 대기(밝은 쪽·어두운 쪽)', '3단계: + 축 기울기 · 격자 · 핀 · 야경'][L]);
  },
};
export default demo;
