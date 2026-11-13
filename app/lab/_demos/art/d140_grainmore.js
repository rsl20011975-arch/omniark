/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/grain-lut/demo.js (build_pages.py). 직접 고치지 않는다
import { cl, seg, lerp, E, el, rng } from "./helpers.js";

// 노을 풍경을 '색 단계가 20개뿐인 화면'(줄무늬=밴딩이 눈에 보이게 일부러 줄임)에 그린 뒤, ①그레인(디더)으로 줄무늬를 풀고 ②작은 3D LUT(9×9×9 색 변환표)를 코드로 적용한다. 화면은 시간 t 의 함수다.
// 장면(노을 바다 풍경)의 색은 이 페이지의 내용이라 그대로 두고, 위에 얹는 카드·이름표만 팔레트(mint)를 쓴다
const PAL = { bg0: '#e6f2ec', bg1: '#d4e8de', ink: '#0f2a22', muted: '#4f6e63', accent: '#0f9d6b', accent2: '#c2410c', surface: '#f6fbf8', line: 'rgba(15,42,34,.22)' };
const CARD = 'rgba(246,251,248,.93)';
const LEVELS = 20;                // 화면이 한 색 성분에 낼 수 있는 단계 수(실제 화면은 256단계 — 여기서는 밴딩을 보이게 줄였다)
const GRAIN = 2.5;                  // 그레인 세기 배율(1 = 단계 하나의 ±0.6배 흔들림)
const LUT_MIX = 1;                // LUT 를 얼마나 적용할지(1 = 100%)
const LOOK = 0;                   // 표의 룩: 0 = 틸&오렌지(그림자 청록·밝은 곳 주황), 1 = 흑백 고대비
const W = 640, H = 360, N = 9, HZ = 210, SX = 440, SY = 198;
const FONT = "'IBM Plex Sans KR',sans-serif", MONO = "'JetBrains Mono',monospace";
const box = (e, o) => Object.assign(e.style, o);
const sm = (x) => x * x * (3 - 2 * x);

// 3D LUT: 입력 (R,G,B) 를 9×9×9 격자점마다 출력 색으로 적어 둔 표. 여기서는 그림자는 청록, 밝은 곳은 주황 쪽으로 미는 '틸&오렌지' 룩을 표로 구워 둔다
const TABLE = new Float32Array(N * N * N * 3);
for (let bi = 0; bi < N; bi++) for (let gi = 0; gi < N; gi++) for (let ri = 0; ri < N; ri++) {
  const r = ri / (N - 1), g = gi / (N - 1), b = bi / (N - 1);
  const l = .2126 * r + .7152 * g + .0722 * b, ws = (1 - l) * (1 - l), wh = l * l;
  const o = LOOK === 1 ? [0, 0, 0].map(() => lerp(l, sm(l), .8)) : [r + wh * .24 - ws * .22, g + wh * .05 + ws * .07, b - wh * .26 + ws * .26].map((v) => lerp(cl(v), sm(cl(v)), .6));
  const i = ((bi * N + gi) * N + ri) * 3;
  TABLE[i] = o[0]; TABLE[i + 1] = o[1]; TABLE[i + 2] = o[2];
}
function lut3(r, g, b, o) {   // 3선형 보간: 입력이 격자점 사이에 있으면 둘레 8개 점의 출력을 섞는다
  const x = cl(r) * (N - 1), y = cl(g) * (N - 1), z = cl(b) * (N - 1);
  const x0 = Math.min(N - 2, x | 0), y0 = Math.min(N - 2, y | 0), z0 = Math.min(N - 2, z | 0);
  const fx = x - x0, fy = y - y0, fz = z - z0;
  const i0 = ((z0 * N + y0) * N + x0) * 3, sx = 3, sy = N * 3, sz = N * N * 3;
  for (let c = 0; c < 3; c++) {
    const a = i0 + c;
    const c00 = TABLE[a] * (1 - fx) + TABLE[a + sx] * fx, c10 = TABLE[a + sy] * (1 - fx) + TABLE[a + sy + sx] * fx;
    const c01 = TABLE[a + sz] * (1 - fx) + TABLE[a + sz + sx] * fx, c11 = TABLE[a + sz + sy] * (1 - fx) + TABLE[a + sz + sy + sx] * fx;
    const v0 = c00 * (1 - fy) + c10 * fy, v1 = c01 * (1 - fy) + c11 * fy;
    o[c] = v0 * (1 - fz) + v1 * fz;
  }
}

const SKY = [[0, 62, 84, 150], [.55, 150, 112, 170], [1, 255, 186, 128]];
function background(base) {   // 하늘·해·바다를 소수점 정밀도로 계산(미리 계단지지 않은 매끈한 그라디언트)
  let i = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++, i += 3) {
    let r, g, b;
    if (y < HZ) {
      const ty = y / HZ; let k = 0; while (k < 1 && ty > SKY[k + 1][0]) k++;
      const p = (ty - SKY[k][0]) / (SKY[k + 1][0] - SKY[k][0]);
      r = lerp(SKY[k][1], SKY[k + 1][1], p); g = lerp(SKY[k][2], SKY[k + 1][2], p); b = lerp(SKY[k][3], SKY[k + 1][3], p);
      const d = Math.hypot(x - SX, (y - SY) * 1.1), gl = Math.exp(-Math.pow(d / 130, 2)) * .8;
      r = lerp(r, 255, gl * .9); g = lerp(g, 205, gl); b = lerp(b, 130, gl);
      const ds = sm(cl((24 - d) / 6)); r = lerp(r, 255, ds); g = lerp(g, 247, ds); b = lerp(b, 222, ds);
    } else {
      const ty = (y - HZ) / (H - HZ), q = Math.pow(ty, .6);
      r = lerp(215, 38, q); g = lerp(128, 52, q); b = lerp(104, 104, q);
      const wd = 12 + ty * 46, k = Math.exp(-Math.pow((x - SX) / wd, 2)) * (1 - ty * .5) * (.72 + .28 * Math.sin((y - HZ) * .62));
      r = lerp(r, 255, k * .85); g = lerp(g, 214, k * .85); b = lerp(b, 150, k * .85);
    }
    base[i] = r; base[i + 1] = g; base[i + 2] = b;
  }
}
function foreground(base) {   // 곶·등대·돛단배는 알파가 있는 캔버스에 그려 얹는다
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  const hg = x.createLinearGradient(0, 200, 0, 360); hg.addColorStop(0, '#2a2250'); hg.addColorStop(1, '#100e26');
  x.fillStyle = hg; x.beginPath(); x.moveTo(0, 206); x.lineTo(64, 200); x.lineTo(118, 214); x.lineTo(176, 234); x.lineTo(214, 262); x.lineTo(244, 360); x.lineTo(0, 360); x.closePath(); x.fill();
  const bm = x.createLinearGradient(94, 0, 420, 0); bm.addColorStop(0, 'rgba(255,214,130,.26)'); bm.addColorStop(1, 'rgba(255,214,130,0)'); x.fillStyle = bm; x.beginPath(); x.moveTo(94, 136); x.lineTo(420, 96); x.lineTo(420, 186); x.closePath(); x.fill();
  x.fillStyle = '#efe7da'; x.beginPath(); x.moveTo(84, 204); x.lineTo(90, 144); x.lineTo(98, 144); x.lineTo(104, 204); x.closePath(); x.fill();
  x.fillStyle = '#d6523a'; x.beginPath(); x.moveTo(86, 184); x.lineTo(87.5, 170); x.lineTo(100.5, 170); x.lineTo(102, 184); x.closePath(); x.fill();
  x.beginPath(); x.moveTo(88.5, 160); x.lineTo(89.4, 152); x.lineTo(98.6, 152); x.lineTo(99.5, 160); x.closePath(); x.fill();
  x.fillStyle = '#ffd27a'; x.fillRect(89, 138, 8, 7); x.fillStyle = '#3a2a2a'; x.beginPath(); x.moveTo(87, 138); x.lineTo(94, 130); x.lineTo(101, 138); x.closePath(); x.fill();
  x.fillStyle = '#245b3c'; [[140, 232, 20], [162, 244, 24], [190, 262, 28]].forEach(([px, py, h]) => { x.beginPath(); x.moveTo(px, py - h); x.lineTo(px + h * .38, py); x.lineTo(px - h * .38, py); x.closePath(); x.fill(); });
  x.fillStyle = '#f4efe6'; x.beginPath(); x.moveTo(512, 216); x.lineTo(512, 262); x.lineTo(540, 262); x.closePath(); x.fill();
  x.fillStyle = '#e8d6b8'; x.beginPath(); x.moveTo(508, 228); x.lineTo(508, 262); x.lineTo(490, 262); x.closePath(); x.fill();
  x.fillStyle = '#c9382c'; x.beginPath(); x.moveTo(484, 263); x.lineTo(548, 263); x.lineTo(538, 274); x.lineTo(494, 274); x.closePath(); x.fill();
  x.strokeStyle = '#2a1a14'; x.lineWidth = 1.6; x.beginPath(); x.moveTo(512, 212); x.lineTo(512, 263); x.stroke();
  const d = x.getImageData(0, 0, W, H).data;
  for (let p = 0, i = 0; p < W * H; p++, i += 3) {
    const a = d[p * 4 + 3] / 255; if (!a) continue;
    base[i] = base[i] * (1 - a) + d[p * 4] * a; base[i + 1] = base[i + 1] * (1 - a) + d[p * 4 + 1] * a; base[i + 2] = base[i + 2] * (1 - a) + d[p * 4 + 2] * a;
  }
}

const demo = {
  dur: 3.6, rest: 3.2, noCompare: false, levels: 3,
  mount(sp) {
    const base = new Float32Array(W * H * 3); background(base); foreground(base);
    const nz = new Float32Array(W * H * 3), r = rng(11);
    for (let p = 0; p < W * H; p++) { const m = r() + r() - 1; for (let c = 0; c < 3; c++) nz[p * 3 + c] = .85 * m + .15 * (r() + r() - 1); }
    const off = document.createElement('canvas'); off.width = W; off.height = H;
    const cv = el('canvas', null, sp); cv.width = 1280; cv.height = 720;
    const T = (css, text) => { const e = el('div', null, sp, text); box(e, Object.assign({ position: 'absolute', whiteSpace: 'nowrap' }, css)); return e; };
    return {
      base, nz, off, ctx: cv.getContext('2d'), img: off.getContext('2d').createImageData(W, H),
      pill: T({ left: '14px', top: '12px', padding: '7px 13px', borderRadius: '999px', background: CARD, border: `1px solid ${PAL.line}`, boxShadow: '0 4px 12px rgba(15,42,34,.3)', color: PAL.ink, font: `500 14px/1 ${FONT}` }, ''),
      mag: T({ left: '452px', top: '20px', padding: '3px 7px', borderRadius: '6px', background: CARD, color: PAL.ink, font: `500 11px/1 ${MONO}` }, '확대 ×3'),
      pt: T({ left: '24px', top: '51px', font: `700 11px/1 ${MONO}`, color: PAL.ink }, ''),
      pin: T({ left: '124px', top: '71px', font: `500 11px/1.5 ${MONO}`, color: PAL.ink }, ''),
      st: T({ left: '24px', top: '296px', font: `700 11px/1 ${MONO}`, color: PAL.ink }, ''),
      lA: T({ top: '330px', padding: '3px 8px', borderRadius: '6px', background: CARD, color: PAL.ink, font: `500 12px/1 ${FONT}`, opacity: '0' }, 'LUT 적용'),
      lB: T({ top: '330px', padding: '3px 8px', borderRadius: '6px', background: CARD, color: PAL.ink, font: `500 12px/1 ${FONT}`, opacity: '0' }, '원본'),
    };
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 3 : lv);   // 1 = 밴딩이 보이는 하늘, 2 = + 그레인, 3 = + 3D LUT
    const grain = L >= 2 ? E.outC(seg(t, .5, 1.3)) * GRAIN : 0;
    const lp = L >= 3 ? E.inOutC(seg(t, 1.7, 2.7)) : 0;
    const wx = Math.round(lp * W), step = 255 / (LEVELS - 1), o = [0, 0, 0], d = s.img.data, base = s.base, nz = s.nz;
    for (let y = 0, i = 0, q = 0; y < H; y++) for (let x = 0; x < W; x++, i += 3, q += 4) {
      let r = base[i] / 255, g = base[i + 1] / 255, b = base[i + 2] / 255;
      if (x < wx) { lut3(r, g, b, o); r += (o[0] - r) * LUT_MIX; g += (o[1] - g) * LUT_MIX; b += (o[2] - b) * LUT_MIX; }
      const k = grain * step * .6;
      d[q] = Math.round((r * 255 + nz[i] * k) / step) * step; d[q + 1] = Math.round((g * 255 + nz[i + 1] * k) / step) * step; d[q + 2] = Math.round((b * 255 + nz[i + 2] * k) / step) * step; d[q + 3] = 255;
    }
    s.off.getContext('2d').putImageData(s.img, 0, 0);
    const c = s.ctx; c.setTransform(2, 0, 0, 2, 0, 0); c.imageSmoothingEnabled = false;
    c.drawImage(s.off, 0, 0);
    const card = (x, y, w, h) => { c.save(); c.shadowColor = 'rgba(15,42,34,.4)'; c.shadowBlur = 10; c.shadowOffsetY = 3; c.fillStyle = CARD; c.beginPath(); c.roundRect(x, y, w, h, 8); c.fill(); c.restore(); };
    // 확대 상자: 하늘의 한 조각을 4배로 키워 줄무늬/알갱이를 본다
    card(446, 14, 180, 104); c.drawImage(s.off, 250, 52, 57.3, 24.7, 450, 40, 172, 74);
    c.strokeStyle = PAL.surface; c.lineWidth = 3; c.strokeRect(250, 52, 57.3, 24.7); c.strokeStyle = PAL.accent; c.lineWidth = 1.4; c.strokeRect(250, 52, 57.3, 24.7);
    s.mag.style.opacity = '1';
    // 3D LUT 표 보기와 한 점 찾아보기
    const on = L >= 3 && lp >= 1;
    if (L >= 3) {
      if (lp > 0 && lp < 1) {   // 경계선
        c.fillStyle = 'rgba(255,255,255,.95)'; c.fillRect(wx - 1, 0, 2, H);
        c.fillStyle = PAL.surface; c.beginPath(); c.arc(wx, 180, 10, 0, Math.PI * 2); c.fill();
        c.strokeStyle = PAL.ink; c.lineWidth = 1.8; c.lineCap = 'round'; c.beginPath(); c.moveTo(wx - 3, 175); c.lineTo(wx - 6, 180); c.lineTo(wx - 3, 185); c.moveTo(wx + 3, 175); c.lineTo(wx + 6, 180); c.lineTo(wx + 3, 185); c.stroke();
      }
      const pa = E.outC(seg(t, 2.7, 3.1));
      c.globalAlpha = pa;
      card(14, 44, 190, 66);
      const px = 330, py = 150, pi = (py * W + px) * 3, ir = base[pi] / 255, ig = base[pi + 1] / 255, ib = base[pi + 2] / 255;
      lut3(ir, ig, ib, o); const or = ir + (o[0] - ir) * LUT_MIX, og = ig + (o[1] - ig) * LUT_MIX, ob = ib + (o[2] - ib) * LUT_MIX;
      const rgb = (a1, b1, c1) => `rgb(${Math.round(a1 * 255)},${Math.round(b1 * 255)},${Math.round(c1 * 255)})`;
      c.fillStyle = rgb(ir, ig, ib); c.fillRect(22, 70, 30, 30); c.fillStyle = rgb(or, og, ob); c.fillRect(84, 70, 30, 30);
      c.strokeStyle = PAL.ink; c.lineWidth = 1.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(58, 85); c.lineTo(78, 85); c.moveTo(73, 80); c.lineTo(78, 85); c.lineTo(73, 90); c.stroke();
      c.strokeStyle = PAL.surface; c.lineWidth = 3.2; c.beginPath(); c.arc(px, py, 7, 0, Math.PI * 2); c.stroke(); c.strokeStyle = PAL.accent; c.lineWidth = 1.6; c.beginPath(); c.arc(px, py, 7, 0, Math.PI * 2); c.stroke();
      card(14, 290, 190, 62);
      [0, 3, 5, 8].forEach((bi, k) => { for (let gi = 0; gi < N; gi++) for (let ri = 0; ri < N; ri++) { const j = ((bi * N + gi) * N + ri) * 3; c.fillStyle = rgb(TABLE[j], TABLE[j + 1], TABLE[j + 2]); c.fillRect(22 + k * 44 + ri * 4, 310 + gi * 4, 4, 4); } });
      c.globalAlpha = 1;
      s.pt.textContent = pa > .3 ? '입력 → 표에서 찾기 → 출력' : '';
      s.pin.textContent = pa > .3 ? `입력 ${Math.round(ir * 255)} ${Math.round(ig * 255)} ${Math.round(ib * 255)}\n출력 ${Math.round(or * 255)} ${Math.round(og * 255)} ${Math.round(ob * 255)}` : '';
      s.pin.style.whiteSpace = 'pre'; s.pin.style.opacity = s.pt.style.opacity = pa.toFixed(2);
      s.st.textContent = pa > .3 ? '표 속 색(파랑 성분 4칸)' : ''; s.st.style.opacity = pa.toFixed(2);
    } else { s.pt.textContent = s.pin.textContent = s.st.textContent = ''; }
    const sweeping = L >= 3 && lp > 0 && lp < 1;
    s.lA.style.opacity = sweeping ? '1' : '0'; s.lB.style.opacity = sweeping ? '1' : '0';
    s.lA.style.left = Math.max(12, wx - 72) + 'px'; s.lB.style.left = Math.min(W - 52, wx + 16) + 'px';
    s.pill.textContent = lp > 0 ? '3D LUT 적용: 색을 표에서 찾아 바꿈' : (grain > .05 ? '그레인 얹기: 줄무늬가 알갱이로 풀림' : '연출 전: 색 단계 ' + LEVELS + '개뿐인 하늘, 줄무늬(밴딩)');
  },
};
export default demo;
