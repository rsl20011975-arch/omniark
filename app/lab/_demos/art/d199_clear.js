/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/blur-bg-foreground/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

const PAL = { bg0: '#1b0e17', bg1: '#2b1424', ink: '#f6e9ee', muted: '#b095a3', accent: '#ff7aa8', accent2: '#ffd0a0', surface: '#26121f', line: '#4a2a3e' };

// 흰 제품 사진 한 장을 세로 영상(1080×1920)으로: 같은 사진을 키워 흐리게 깔고(배경), 원본을 그대로 위에 올린 뒤(전경), 느리게 줌한다. 화면은 1/3 크기(360×640)로 그린다.
const SIGMA = 10;      // 배경 가우시안 블러 σ (1080×1920 기준 px)
const DIM = 0.60;      // 배경 밝기 배율(빨강·초록), 파랑은 DIM_B
const DIM_B = 0.68;    // 배경 밝기 배율(파랑)
const MARGIN = 84;     // 전경 좌우 여백(px). 위아래 여백은 이것의 2배씩
const ZOOM = 1.045;    // 4초 동안 끝까지 도달하는 줌 배율
const KEY_SIM = 0.12;  // colorkey 시험에서 흰색과 이 거리 안이면 지운다(이 데모의 0~1 거리)
const SECS = 4, FPS = 30;
const SC = 1 / 3, BW = 360, BH = 640, SRC = 304;       // 1080 → 360 축소 비율 · 작업 화면 크기 · 원본 사진 한 변
const FW = 162, FH = 288, FY = 58, FXR = 458, FXL = 282;   // 무대 위 세로 화면 크기와 위치
const STEPS = ['배경 없이 사각형 사진만 올렸다', '같은 사진을 키워 흐리게 깔았다', '4초 동안 1.045배까지 천천히 민다', '흰색 지우기(colorkey)를 시험했다 폐기'];

const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const ctx2 = (c) => c.getContext('2d', { willReadFrequently: true });

function boxBlur(src, w, h, sigma) {
  const r = Math.max(1, Math.floor(Math.sqrt(12 * sigma * sigma / 3 + 1) / 2));
  let a = Float32Array.from(src), b = new Float32Array(w * h);
  for (let p = 0; p < 3; p++) {
    for (let y = 0; y < h; y++) {
      const o = y * w; let acc = 0;
      for (let i = -r; i <= r; i++) acc += a[o + Math.min(w - 1, Math.max(0, i))];
      for (let x = 0; x < w; x++) { b[o + x] = acc / (2 * r + 1); acc += a[o + Math.min(w - 1, x + r + 1)] - a[o + Math.max(0, x - r)]; }
    }
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let i = -r; i <= r; i++) acc += b[Math.min(h - 1, Math.max(0, i)) * w + x];
      for (let y = 0; y < h; y++) { a[y * w + x] = acc / (2 * r + 1); acc += b[Math.min(h - 1, y + r + 1) * w + x] - b[Math.max(0, y - r) * w + x]; }
    }
  }
  return a;
}

function grain(cv, seed, amt) {
  const x = ctx2(cv), im = x.getImageData(0, 0, cv.width, cv.height), d = im.data, r = rng(seed);
  for (let i = 0; i < d.length; i += 4) { const n = (r() + r() - 1) * amt; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  x.putImageData(im, 0, 0);
}

function ell(x, cx, cy, rx, ry) { x.beginPath(); x.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); }

function paintProduct() {      // 흰색 로봇청소기를 비스듬히 위에서 본 사진 느낌: 배경과 제품을 따로 그려 제품 영역(마스크)을 안다
  const bg = mk(SRC, SRC), b = ctx2(bg), P = mk(SRC, SRC), p = ctx2(P), cx = 150, cy = 140;
  let g = b.createLinearGradient(0, 0, 0, SRC); g.addColorStop(0, '#fefdfb'); g.addColorStop(1, '#eceae3'); b.fillStyle = g; b.fillRect(0, 0, SRC, SRC);
  g = b.createRadialGradient(80, 40, 10, 80, 40, 260); g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(1, 'rgba(255,255,255,0)'); b.fillStyle = g; b.fillRect(0, 0, SRC, SRC);
  for (let i = 0; i < 9; i++) { b.fillStyle = 'rgba(70,60,50,.05)'; ell(b, cx + 18, 196, 112 + i * 7, 26 + i * 3.4); b.fill(); }   // 바닥에 닿는 부드러운 그림자: 크기가 다른 겹 아홉 장
  b.fillStyle = 'rgba(70,60,50,.16)'; ell(b, cx + 6, 178, 100, 16); b.fill();
  const H = 30;                                                      // 본체 옆면 두께
  g = p.createLinearGradient(cx - 100, 0, cx + 100, 0); g.addColorStop(0, '#e6dfcf'); g.addColorStop(.28, '#cdc4b0'); g.addColorStop(1, '#8d8470');
  p.fillStyle = g; ell(p, cx, cy + H, 100, 80); p.fill(); p.fillRect(cx - 100, cy, 200, H);
  p.fillStyle = 'rgba(0,0,0,.13)'; ell(p, cx, cy + H, 100, 80); p.fill();
  g = p.createLinearGradient(cx - 100, 0, cx + 100, 0); g.addColorStop(0, '#ebe4d4'); g.addColorStop(.22, '#d4cbb7'); g.addColorStop(1, '#948b77'); p.fillStyle = g; p.fillRect(cx - 100, cy, 200, H);
  p.fillStyle = 'rgba(255,255,255,.55)'; p.fillRect(cx - 78, cy + 4, 7, H - 8);
  g = p.createRadialGradient(cx - 38, cy - 34, 8, cx, cy, 130); g.addColorStop(0, '#ffffff'); g.addColorStop(.5, '#f7f2e6'); g.addColorStop(1, '#d6cdbb');
  p.fillStyle = g; ell(p, cx, cy, 100, 80); p.fill();
  p.strokeStyle = '#c5bba6'; p.lineWidth = 1.6; ell(p, cx, cy, 91, 72); p.stroke();
  p.strokeStyle = 'rgba(255,255,255,.9)'; p.lineWidth = 1; ell(p, cx - .8, cy - .8, 93, 74); p.stroke();
  for (let i = 0; i < 6; i++) { p.strokeStyle = `rgba(120,110,92,${.38 - i * .04})`; p.lineWidth = 1.3; p.beginPath(); p.ellipse(cx + 24, cy + 4, 58 + i * 5, 44 + i * 4, 0, -.6, .15); p.stroke(); }   // 오른쪽 배기구 홈
  p.fillStyle = '#b0a691'; ell(p, cx - 2, cy - 18 + 11, 27, 21); p.fill(); p.fillRect(cx - 29, cy - 18, 54, 11);
  g = p.createLinearGradient(cx - 27, 0, cx + 27, 0); g.addColorStop(0, '#d9d0bc'); g.addColorStop(1, '#a29984'); p.fillStyle = g; p.fillRect(cx - 29, cy - 18, 54, 11);
  g = p.createRadialGradient(cx - 12, cy - 30, 3, cx - 2, cy - 18, 30); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ddd4c1'); p.fillStyle = g; ell(p, cx - 2, cy - 18, 27, 21); p.fill();
  g = p.createLinearGradient(0, cy - 26, 0, cy - 10); g.addColorStop(0, '#4a4650'); g.addColorStop(1, '#25222b'); p.fillStyle = g; ell(p, cx - 2, cy - 18, 14, 10); p.fill();
  p.fillStyle = 'rgba(255,255,255,.55)'; ell(p, cx - 7, cy - 22, 5, 2.4); p.fill();
  for (const [dx, dy] of [[-30, 36], [0, 42], [30, 36]]) {
    g = p.createRadialGradient(cx + dx - 2, cy + dy - 2, 1, cx + dx, cy + dy, 8); g.addColorStop(0, '#fbf8f0'); g.addColorStop(1, '#cfc6b3'); p.fillStyle = g; ell(p, cx + dx, cy + dy, 9, 6.5); p.fill();
    p.strokeStyle = '#b8ae99'; p.lineWidth = .8; ell(p, cx + dx, cy + dy, 9, 6.5); p.stroke();
  }
  p.fillStyle = PAL.accent; ell(p, cx, cy + 42, 2.2, 1.6); p.fill();
  const src = mk(SRC, SRC), s = ctx2(src); s.drawImage(bg, 0, 0); s.drawImage(P, 0, 0); grain(src, 7, 6);
  return { src, P };
}


const zAt = (t, L) => L >= 3 ? 1 + (ZOOM - 1) * Math.min(1, Math.floor(t * FPS) / (SECS * FPS)) : 1;   // 프레임마다 같은 양씩 늘어난다(이징 없음)

const demo = {
  dur: SECS, rest: SECS, noCompare: false, levels: 4,
  mount(sp) {
    const css = (e, o) => Object.assign(e.style, o);
    const { src, P } = paintProduct();
    // 제품 영역 위에서 colorkey 를 흉내 낸다: 흰색과의 거리가 KEY_SIM 안이면 투명
    const sd = ctx2(src).getImageData(0, 0, SRC, SRC), md = ctx2(P).getImageData(0, 0, SRC, SRC), kd = new ImageData(new Uint8ClampedArray(sd.data), SRC, SRC);
    let prod = 0, eaten = 0;
    for (let i = 0; i < SRC * SRC; i++) {
      const o = i * 4, dist = Math.hypot(255 - sd.data[o], 255 - sd.data[o + 1], 255 - sd.data[o + 2]) / (255 * Math.sqrt(3)), isP = md.data[o + 3] > 128;
      if (dist < KEY_SIM) kd.data[o + 3] = 0;
      if (isP) { prod++; if (dist < KEY_SIM) eaten++; }
    }
    const keyed = mk(SRC, SRC); ctx2(keyed).putImageData(kd, 0, 0);
    // 배경: 사진을 화면 높이에 맞게 키워 가운데를 잘라 흐리게, 어둡게
    const cov = mk(BW, BH), cv = ctx2(cov), side = BH; cv.drawImage(src, (BW - side) / 2, 0, side, side);
    const im = cv.getImageData(0, 0, BW, BH), ch = [0, 1, 2].map((k) => { const a = new Float32Array(BW * BH); for (let i = 0; i < a.length; i++) a[i] = im.data[i * 4 + k]; return boxBlur(a, BW, BH, SIGMA * SC); });
    const mul = [DIM, DIM, DIM_B];
    for (let i = 0; i < BW * BH; i++) for (let k = 0; k < 3; k++) im.data[i * 4 + k] = ch[k][i] * mul[k];
    cv.putImageData(im, 0, 0);
    const flat = mk(BW, BH), fx = ctx2(flat), fg = fx.createLinearGradient(0, 0, 0, BH); fg.addColorStop(0, PAL.bg1); fg.addColorStop(1, PAL.bg0); fx.fillStyle = fg; fx.fillRect(0, 0, BW, BH);
    const m = MARGIN * SC, fw = BW - 2 * m, fy = (BH - fw) / 2;       // 전경: (W-2m)×(H-4m) 안에 맞춘 정사각형을 가운데에
    const build = (base, fgImg) => { const c = mk(BW, BH), x = ctx2(c); x.drawImage(base, 0, 0); x.drawImage(fgImg, m, fy, fw, fw); return c; };
    const comp = { c1: build(flat, src), c2: build(cov, src), ck: build(cov, keyed) };
    const main = el('canvas', null, sp);
    main.width = 1280; main.height = 720; css(main, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const pill = el('div', null, sp);
    css(pill, { position: 'absolute', right: '16px', top: '14px', padding: '7px 12px 7px 11px', borderRadius: '2px', background: PAL.surface, color: PAL.ink, borderLeft: `3px solid ${PAL.accent}`, boxShadow: `0 0 0 1px ${PAL.line}, 0 4px 14px rgba(0,0,0,.4)`, font: "600 12px/1 'IBM Plex Sans KR',sans-serif", zIndex: 5 });
    const gr = mk(256, 256); { const g2 = ctx2(gr), d = g2.createImageData(256, 256), r = rng(3); for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } g2.putImageData(d, 0, 0); }
    return { main, pill, src, comp, gr, cache: {}, key: { prod, eaten }, tmp: mk(64, 114) };
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 4 : lv);
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.textBaseline = 'alphabetic'; x.textAlign = 'left';
    const g = x.createLinearGradient(0, 0, 640, 360); g.addColorStop(0, PAL.bg0); g.addColorStop(1, PAL.bg1); x.fillStyle = g; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = .1;
    for (let gx = 0; gx < 640; gx += 128) for (let gy = 0; gy < 360; gy += 128) x.drawImage(s.gr, gx, gy, 128, 128);
    x.restore();
    const z = zAt(t, L);
    const frame = (canvas, fx, zz, label, tone) => {
      x.fillStyle = 'rgba(0,0,0,.35)'; x.fillRect(fx - 2 + 5, FY - 2 + 7, FW + 4, FH + 4);      // 접지 그림자
      x.fillStyle = 'rgba(0,0,0,.22)'; x.fillRect(fx - 2 + 2, FY - 2 + 3, FW + 4, FH + 4);
      x.save(); x.beginPath(); x.rect(fx, FY, FW, FH); x.clip(); x.translate(fx + FW / 2, FY + FH / 2); x.scale(zz, zz); x.drawImage(canvas, -FW / 2, -FH / 2, FW, FH); x.restore();
      x.strokeStyle = PAL.line; x.lineWidth = 1; x.strokeRect(fx - .5, FY - .5, FW + 1, FH + 1);
      x.fillStyle = tone; x.font = "600 11px 'IBM Plex Sans KR',sans-serif"; x.fillText(label, fx, FY - 8);
    };
    frame(L >= 2 ? s.comp.c2 : s.comp.c1, FXR, z, L >= 4 ? '사각형 오버레이(쓰는 방식)' : '결과 화면', PAL.ink);
    if (L >= 4) frame(s.comp.ck, FXL, 1, 'colorkey 시도(폐기)', PAL.accent);
    else { x.setLineDash([4, 4]); x.strokeStyle = PAL.line; x.strokeRect(FXL + .5, FY + .5, FW - 1, FH - 1); x.setLineDash([]); x.fillStyle = PAL.muted; x.font = "500 11px 'IBM Plex Sans KR',sans-serif"; x.textAlign = 'center'; x.fillText('4단계에서', FXL + FW / 2, FY + FH / 2 - 4); x.fillText('흰색 지우기 시험', FXL + FW / 2, FY + FH / 2 + 12); x.textAlign = 'left'; }
    // 원본 사진
    x.fillStyle = PAL.muted; x.font = "500 11px 'IBM Plex Sans KR',sans-serif"; x.fillText('원본 사진 (정사각형)', 14, 52);
    x.fillStyle = 'rgba(0,0,0,.35)'; x.fillRect(16, 61, 112, 112); x.drawImage(s.src, 14, 58, 112, 112);
    x.strokeStyle = PAL.line; x.strokeRect(13.5, 57.5, 113, 113);
    // 이 장면에서 직접 계산한 값
    const ruler = (() => {
      const key = L >= 3 ? 'z' : 'n'; if (s.cache[key]) return s.cache[key];
      const bars = [], c = s.tmp, cx = ctx2(c); let prev = null;
      for (let i = 0; i <= SECS * 10; i++) {
        cx.fillStyle = '#000'; cx.fillRect(0, 0, 64, 114);
        cx.save(); cx.translate(32, 57); const zz = zAt(i / 10, L >= 3 ? 3 : 1); cx.scale(zz, zz); cx.drawImage(s.comp.c2, -32, -57, 64, 114); cx.restore();
        const d = cx.getImageData(0, 0, 64, 114).data, gray = new Float32Array(64 * 114);
        for (let k = 0; k < gray.length; k++) gray[k] = .299 * d[k * 4] + .587 * d[k * 4 + 1] + .114 * d[k * 4 + 2];
        if (prev) { let sum = 0; for (let k = 0; k < gray.length; k++) sum += Math.abs(gray[k] - prev[k]); bars.push(sum / gray.length); }
        prev = gray;
      }
      return s.cache[key] = { bars, still: bars.filter((v) => v < .5).length / bars.length, motion: bars.reduce((p, v) => p + v, 0) / bars.length };
    })();
    x.font = "500 10.5px 'JetBrains Mono',monospace";
    const lines = [];
    lines.push([L >= 2 ? `배경 블러 σ ${SIGMA} · 밝기 ×${DIM.toFixed(2)}/${DIM.toFixed(2)}/${DIM_B.toFixed(2)}` : '배경 없음 (단색)', PAL.ink]);
    lines.push([`전경 ${1080 - MARGIN * 2}×${1080 - MARGIN * 2} · 좌우 여백 ${MARGIN}px`, PAL.ink]);
    if (L >= 3) lines.push([`줌 ${z.toFixed(3)} / ${ZOOM.toFixed(3)} · 초당 ${((ZOOM - 1) / SECS * 100).toFixed(1)}%`, PAL.accent2]);
    if (L >= 4) lines.push([`colorkey: 제품 ${(100 * s.key.eaten / s.key.prod).toFixed(0)}% 지워짐 (거리 ${KEY_SIM})`, PAL.accent]);
    lines.forEach(([tx, col], i) => { x.fillStyle = col; x.fillText(tx, 14, 192 + i * 15); });
    // 10fps·64px 프레임 차 막대
    const by0 = 286, bh = 40, bw = 232 / ruler.bars.length;
    x.fillStyle = 'rgba(0,0,0,.28)'; x.fillRect(14, by0 - 4, 238, bh + 8);
    ruler.bars.forEach((v, i) => { const h = Math.min(bh, v / 1.5 * bh); x.fillStyle = v < .5 ? PAL.muted : PAL.accent2; x.fillRect(17 + i * bw, by0 + bh - Math.max(1, h), Math.max(1, bw - 1.5), Math.max(1, h)); });
    x.strokeStyle = PAL.accent; x.lineWidth = 1; x.setLineDash([3, 3]); const ly = by0 + bh - .5 / 1.5 * bh; x.beginPath(); x.moveTo(14, ly); x.lineTo(252, ly); x.stroke(); x.setLineDash([]);
    x.fillStyle = PAL.muted; x.font = "500 9.5px 'JetBrains Mono',monospace"; x.fillText('프레임 차(10fps·64px) · 점선 0.5 아래 = 정지', 14, by0 - 10);
    x.fillStyle = PAL.ink; x.font = "500 10.5px 'JetBrains Mono',monospace"; x.fillText(`정지 ${(ruler.still * 100).toFixed(0)}% · 움직임 ${ruler.motion.toFixed(2)}`, 14, by0 + bh + 17);
    s.pill.textContent = `${L}단계 · ${STEPS[L - 1]}`;
  },
};
export default demo;
