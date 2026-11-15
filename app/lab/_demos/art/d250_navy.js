/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/chroma-screen-color-pick/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 코드로 그린 예시 그림이다. 같은 캐릭터를 초록 시트와 마젠타 시트에 얹고, 제작 도구와 같은 규칙(색상각 허용 폭, 채도 하한)으로 배경을 지워 본다.
// 옷이 지워진 비율과 배경이 남은 비율은 화면에 그려진 픽셀을 코드가 센 값이다.
const ROBE = '#27327a';       // 로브 색(초록 계열). 팁이 남색으로 바꾼다
const OUTFIT = '남색 로브';    // 옷 설명 글. 시트 색을 고르는 낱말 대조에 쓴다
const HUE_TOL = 30;           // 배경으로 지우는 색상각 허용 폭(± 도)
const SAT_MIN = 0.18, VAL_MIN = 0.04;   // 이보다 흐리거나 어두운 픽셀은 배경으로 보지 않는다
const GREEN_HINTS = ['초록', '녹색', '연두', 'green'];
const PAL = { bg0: '#1b0e17', bg1: '#2b1424', ink: '#f6e9ee', muted: '#b095a3', accent: '#ff7aa8', accent2: '#ffd0a0', surface: '#26121f', line: 'rgba(246,233,238,.18)' };
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif', BLACK = '"Black Han Sans", sans-serif';
const S = 480, P = 240;       // 계산용 그림 한 변(px)과 화면에서 한 장의 크기

const hx = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mixc = (a, b, p) => { const A = hx(a), B = hx(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * p)).join(',')})`; };
const toHex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
function hsv(r, g, b) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0;
  if (d > 0) { if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
  return [h, mx ? d / mx : 0, mx / 255];
}
const hueDist = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };

// ---- 캐릭터 그리기(240 단위 좌표, 광원은 왼쪽 위) ----
function robePath(x) { x.beginPath(); x.moveTo(98, 104); x.quadraticCurveTo(120, 97, 142, 104); x.lineTo(162, 214); x.quadraticCurveTo(120, 226, 78, 214); x.closePath(); }
function sleevePath(x, s) { x.beginPath(); x.moveTo(120 + s * 22, 106); x.quadraticCurveTo(120 + s * 40, 112, 120 + s * 46, 150); x.lineTo(120 + s * 35, 154); x.quadraticCurveTo(120 + s * 31, 128, 120 + s * 18, 119); x.closePath(); }
function robeFill(x) {
  const g = x.createLinearGradient(78, 0, 162, 0);
  g.addColorStop(0, mixc(ROBE, '#ffffff', 0.28)); g.addColorStop(0.42, mixc(ROBE, '#ffffff', 0.04)); g.addColorStop(1, mixc(ROBE, '#000000', 0.42));
  x.fillStyle = g; robePath(x); x.fill();
  [-1, 1].forEach((s) => { x.fillStyle = s < 0 ? mixc(ROBE, '#ffffff', 0.12) : mixc(ROBE, '#000000', 0.3); sleevePath(x, s); x.fill(); });
}
function drawChar(x) {
  x.save(); x.scale(S / P, S / P);
  // 지팡이
  const sg = x.createLinearGradient(160, 0, 168, 0); sg.addColorStop(0, '#9a6a3c'); sg.addColorStop(1, '#5a3418');
  x.strokeStyle = sg; x.lineWidth = 5; x.lineCap = 'round'; x.beginPath(); x.moveTo(164, 226); x.lineTo(164, 62); x.stroke();
  const og = x.createRadialGradient(161, 49, 1, 164, 52, 10); og.addColorStop(0, '#fff2b8'); og.addColorStop(1, '#d9922e');
  x.fillStyle = og; x.beginPath(); x.arc(164, 52, 9, 0, 7); x.fill();
  robeFill(x);
  // 주름과 가장자리 빛
  x.strokeStyle = 'rgba(0,0,0,.18)'; x.lineWidth = 2; x.lineCap = 'round';
  [[106, 150, 100, 216], [122, 140, 122, 222], [138, 150, 146, 218]].forEach(([a, b, c, d]) => { x.beginPath(); x.moveTo(a, b); x.quadraticCurveTo((a + c) / 2 + 3, (b + d) / 2, c, d); x.stroke(); });
  x.strokeStyle = 'rgba(255,255,255,.22)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(98, 106); x.lineTo(79, 213); x.stroke();
  // 허리띠
  const bg = x.createLinearGradient(0, 144, 0, 154); bg.addColorStop(0, '#a8743f'); bg.addColorStop(1, '#6a4120');
  x.fillStyle = bg; x.beginPath(); x.moveTo(104, 144); x.lineTo(136, 144); x.lineTo(139, 154); x.lineTo(101, 154); x.closePath(); x.fill();
  x.fillStyle = '#f0c15a'; x.fillRect(116, 145, 9, 8);
  // 손
  x.fillStyle = '#e9b88c'; [[78, 157], [162, 157]].forEach(([a, b]) => { x.beginPath(); x.arc(a, b, 6, 0, 7); x.fill(); });
  // 목과 머리
  x.fillStyle = '#c9946a'; x.fillRect(113, 98, 14, 10);
  const hg = x.createRadialGradient(112, 70, 3, 120, 80, 28); hg.addColorStop(0, '#fbe0c0'); hg.addColorStop(1, '#dba274');
  x.fillStyle = hg; x.beginPath(); x.arc(120, 80, 24, 0, 7); x.fill();
  const hr = x.createLinearGradient(96, 52, 146, 92); hr.addColorStop(0, '#c2602f'); hr.addColorStop(1, '#6f2e15');
  x.fillStyle = hr; x.beginPath(); x.arc(120, 78, 26, Math.PI * 0.98, Math.PI * 2.02); x.lineTo(145, 88); x.quadraticCurveTo(138, 66, 120, 70); x.quadraticCurveTo(102, 66, 95, 88); x.closePath(); x.fill();
  x.beginPath(); x.ellipse(96, 90, 5, 11, 0.15, 0, 7); x.ellipse(144, 90, 5, 11, -0.15, 0, 7); x.fill();
  x.fillStyle = '#2a1a22'; x.beginPath(); x.ellipse(112, 84, 2.3, 3.2, 0, 0, 7); x.ellipse(128, 84, 2.3, 3.2, 0, 0, 7); x.fill();
  x.fillStyle = 'rgba(255,120,120,.35)'; x.beginPath(); x.arc(105, 92, 4, 0, 7); x.arc(135, 92, 4, 0, 7); x.fill();
  x.restore();
}
function robeMask(x) {          // 옷 자리만 흰색으로(허리띠 제외)
  x.save(); x.scale(S / P, S / P); x.fillStyle = '#fff'; robePath(x); x.fill(); [-1, 1].forEach((s) => { sleevePath(x, s); x.fill(); });
  x.globalCompositeOperation = 'destination-out'; x.beginPath(); x.moveTo(104, 144); x.lineTo(136, 144); x.lineTo(139, 154); x.lineTo(101, 154); x.closePath(); x.fill(); x.restore();
}
function cv() { const c = document.createElement('canvas'); c.width = S; c.height = S; return c; }
function sheetCanvas(kind, charC) {
  const c = cv(), x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, S, S * 0.3);
  if (kind === 'g') { g.addColorStop(0, 'hsl(134,100%,37%)'); g.addColorStop(1, 'hsl(150,100%,33%)'); }
  else { g.addColorStop(0, 'hsl(290,92%,52%)'); g.addColorStop(1, 'hsl(312,96%,50%)'); }
  x.fillStyle = g; x.fillRect(0, 0, S, S); x.drawImage(charC, 0, 0);
  return c;
}
// 시트 가장자리 최빈색으로 키 색을 잰다(제작 도구와 같은 방식: 가장자리 4px, 16단계 묶음의 최빈 칸 평균)
function estimateKey(d) {
  const m = 4, bins = new Map();
  const add = (i) => { const r = d[i], g = d[i + 1], b = d[i + 2], k = (r >> 4) * 256 + (g >> 4) * 16 + (b >> 4); const e = bins.get(k) || [0, 0, 0, 0]; e[0]++; e[1] += r; e[2] += g; e[3] += b; bins.set(k, e); };
  for (let y = 0; y < S; y++) for (let xx = 0; xx < S; xx++) if (y < m || y >= S - m || xx < m || xx >= S - m) add((y * S + xx) * 4);
  let best = null; bins.forEach((e) => { if (!best || e[0] > best[0]) best = e; });
  return [best[1] / best[0], best[2] / best[0], best[3] / best[0]];
}
function analyze(sheetC, charA, robeA) {
  const x = sheetC.getContext('2d'), id = x.getImageData(0, 0, S, S), d = id.data;
  const key = estimateKey(d), kh = hsv(key[0], key[1], key[2])[0];
  let robeN = 0, robeGone = 0, bgN = 0, bgLeft = 0;
  const out = x.createImageData(S, S), o = out.data;
  for (let i = 0, p = 0; i < d.length; i += 4, p++) {
    const [h, s, v] = hsv(d[i], d[i + 1], d[i + 2]);
    const isBg = hueDist(h, kh) <= HUE_TOL && s >= SAT_MIN && v >= VAL_MIN;
    o[i] = d[i]; o[i + 1] = d[i + 1]; o[i + 2] = d[i + 2]; o[i + 3] = isBg ? 0 : 255;
    if (robeA[p * 4 + 3] > 128) { robeN++; if (isBg) robeGone++; }
    else if (charA[p * 4 + 3] < 10) { bgN++; if (!isBg) bgLeft++; }
  }
  const rc = cv(); rc.getContext('2d').putImageData(out, 0, 0);
  return { sheet: sheetC, res: rc, key, kh, gone: robeGone / robeN, left: bgLeft / bgN };
}
let GRAIN = null;
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }

const STEP = ['초록 시트 그대로', '옷 색에 맞춰 시트 색 바꾸기', '키 색은 가장자리에서 재기', '색상각 겹침 확인하기'];
const demo = {
  dur: 3.6, rest: 3.2, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(23), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const charC = cv(); drawChar(charC.getContext('2d'));
    const robeC = cv(); robeMask(robeC.getContext('2d'));
    const charA = charC.getContext('2d').getImageData(0, 0, S, S).data, robeA = robeC.getContext('2d').getImageData(0, 0, S, S).data;
    const G = analyze(sheetCanvas('g', charC), charA, robeA), M = analyze(sheetCanvas('m', charC), charA, robeA);
    // 옷 색상각: 옷 픽셀의 색상 평균(원형 평균)
    const cd = charC.getContext('2d').getImageData(0, 0, S, S).data;
    let sx = 0, sy = 0, n = 0;
    for (let p = 0; p < S * S; p++) if (robeA[p * 4 + 3] > 128 && cd[p * 4 + 3] > 200) { const hh = hsv(cd[p * 4], cd[p * 4 + 1], cd[p * 4 + 2])[0] * Math.PI / 180; sx += Math.cos(hh); sy += Math.sin(hh); n++; }
    let robeHue = Math.atan2(sy, sx) * 180 / Math.PI; if (robeHue < 0) robeHue += 360;
    const pick = GREEN_HINTS.some((h) => OUTFIT.includes(h)) ? M : G;   // 낱말 대조로 고른 시트
    const lab = el('div', null, sp);   // 이름표(numeral): 왼쪽 위 큰 숫자와 옆 설명
    Object.assign(lab.style, { position: 'absolute', left: '12px', top: '8px', display: 'flex', alignItems: 'center', gap: '10px', zIndex: '4' });
    const num = el('span', null, lab), dsc = el('span', null, lab);
    Object.assign(num.style, { font: `40px/1 ${BLACK}`, color: PAL.accent });
    Object.assign(dsc.style, { font: "600 13px/1.25 'IBM Plex Sans KR',sans-serif", color: PAL.ink, width: '260px' });
    return { main, num, dsc, G, M, pick, robeHue };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 0 : (lv == null ? 3 : lv);
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.1;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();

    const sw = a ? E.inOutC(seg(t, 0.4, 1.5)) : 0;          // 0 = 초록 시트, 1 = 고른 시트
    const A = s.G, B = s.pick;
    const cur = sw > 0.5 ? B : A;
    const PX1 = 36, PX2 = 364, PY = 54;
    // 시트
    x.save(); x.fillStyle = 'rgba(0,0,0,.35)'; x.fillRect(PX1 + 3, PY + 5, P, P); x.fillRect(PX1 + 2, PY + 3, P, P); x.restore();
    x.drawImage(A.sheet, PX1, PY, P, P);
    if (sw > 0 && B !== A) { x.globalAlpha = sw; x.drawImage(B.sheet, PX1, PY, P, P); x.globalAlpha = 1; }
    x.strokeStyle = PAL.line; x.lineWidth = 1; x.strokeRect(PX1 + 0.5, PY + 0.5, P - 1, P - 1);
    // 결과(체크무늬 위)
    x.save(); x.fillStyle = 'rgba(0,0,0,.35)'; x.fillRect(PX2 + 3, PY + 5, P, P); x.restore();
    x.save(); x.beginPath(); x.rect(PX2, PY, P, P); x.clip();
    for (let cy = 0; cy < P; cy += 12) for (let cx = 0; cx < P; cx += 12) { x.fillStyle = ((cx + cy) / 12) % 2 ? '#3a2433' : '#2e1b28'; x.fillRect(PX2 + cx, PY + cy, 12, 12); }
    x.drawImage(A.res, PX2, PY, P, P);
    if (sw > 0 && B !== A) { x.globalAlpha = sw; x.drawImage(B.res, PX2, PY, P, P); x.globalAlpha = 1; }
    x.restore();
    x.strokeStyle = PAL.line; x.strokeRect(PX2 + 0.5, PY + 0.5, P - 1, P - 1);
    // 가운데 화살표
    const ax = 288 + 8 * E.outC(seg(t, 0, 0.6));
    x.strokeStyle = PAL.accent2; x.lineWidth = 2.5; x.lineCap = 'round'; x.lineJoin = 'round';
    x.beginPath(); x.moveTo(ax - 4, PY + 118); x.lineTo(ax + 40, PY + 118); x.moveTo(ax + 31, PY + 109); x.lineTo(ax + 41, PY + 118); x.lineTo(ax + 31, PY + 127); x.stroke();
    T(x, '배경 지우기', ax + 18, PY + 98, 11, PAL.muted, 600, 'center');
    // L2: 가장자리 띠를 보여 준다
    if (L >= 2) {
      const al = E.outC(seg(t, 1.7, 2.3));
      x.save(); x.globalAlpha = al; x.strokeStyle = PAL.ink; x.lineWidth = 2; x.setLineDash([5, 4]); x.strokeRect(PX1 + 4, PY + 4, P - 8, P - 8); x.restore();
    }
    // 캡션
    const sheetName = (sw > 0.5 ? (B === s.M ? '마젠타' : '초록') : '초록') + ' 시트';
    const hex = toHex(cur.key);
    if (L >= 2) { const al = E.outC(seg(t, 1.7, 2.3)); x.globalAlpha = al; x.fillStyle = hex; x.fillRect(PX1, PY + P + 5, 14, 14); x.strokeStyle = PAL.line; x.strokeRect(PX1 + 0.5, PY + P + 5.5, 13, 13); x.globalAlpha = 1; }
    T(x, L >= 2 ? `${sheetName}, 잰 키 색 ${hex}` : sheetName, PX1 + (L >= 2 ? 20 : 0), PY + P + 17, 12, PAL.ink, 600);
    const gone = Math.round(cur.gone * 100), left = Math.round(cur.left * 100);
    T(x, `옷이 ${gone}% 지워짐, 배경 ${left}% 남음`, PX2, PY + P + 17, 12, gone > 5 ? PAL.accent : PAL.ink, 600);
    // L3: 색상각 막대
    if (L >= 3) {
      const al = E.outC(seg(t, 2.0, 2.7)), BX = 36, BW = 568, BY = 327, BH = 10;
      x.save(); x.globalAlpha = al;
      const hg = x.createLinearGradient(BX, 0, BX + BW, 0); for (let h = 0; h <= 360; h += 30) hg.addColorStop(h / 360, `hsl(${h},75%,48%)`);
      x.fillStyle = hg; x.beginPath(); x.roundRect(BX, BY, BW, BH, 5); x.fill();
      const hX = (h) => BX + BW * (h / 360);
      [s.G, s.M].forEach((q) => {
        const x0 = hX(q.kh - HUE_TOL), x1 = hX(q.kh + HUE_TOL);
        x.strokeStyle = PAL.ink; x.lineWidth = 1.5; x.beginPath(); x.moveTo(x0, BY + BH + 3); x.lineTo(x0, BY + BH + 7); x.lineTo(x1, BY + BH + 7); x.lineTo(x1, BY + BH + 3); x.stroke();
      });
      const rx = hX(s.robeHue);
      x.fillStyle = PAL.ink; x.beginPath(); x.moveTo(rx, BY - 1); x.lineTo(rx - 5, BY - 8); x.lineTo(rx + 5, BY - 8); x.closePath(); x.fill();
      const dg = hueDist(s.robeHue, s.G.kh), dm = hueDist(s.robeHue, s.M.kh);
      T(x, `옷 ${Math.round(s.robeHue)}°`, 36, 356, 12, PAL.ink, 700, 'left', MONO);
      T(x, `겹침 기준 ±${HUE_TOL}°`, 108, 356, 11, PAL.muted, 500);
      T(x, `초록 시트와 ${Math.round(dg)}° ${dg <= HUE_TOL ? '겹침' : '안전'}`, 217, 356, 12, dg <= HUE_TOL ? PAL.accent : PAL.ink, 600);
      T(x, `마젠타 시트와 ${Math.round(dm)}° ${dm <= HUE_TOL ? '겹침' : '안전'}`, 479, 356, 12, dm <= HUE_TOL ? PAL.accent : PAL.ink, 600);
      x.restore();
    }
    s.num.textContent = String(L); s.dsc.textContent = STEP[L];
  },
};
export default demo;
