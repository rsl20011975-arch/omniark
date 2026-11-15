/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/sheet-no-gridlines/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 코드로 그린 예시 그림이다. 4열 2행 캐릭터 시트에 검은 격자선을 넣고, 제작 도구와 같은 순서(배경 지우기, 얇은 선 지우기, 행과 칸 찾기)로 칸을 센다.
// 찾은 칸 수, 한도별 결과 칩은 이 화면에 그려진 픽셀을 코드가 센 값이다.
const LINE_W = 6;         // 검은 격자선 두께(px)
const LIMIT = 24;         // 이 두께 이하의 가로선·세로선을 지운다(px)
const COLS = 4;           // 시트의 열 수(행은 2)
const ROWS = 2, W = 800, H = 440, CW = W / COLS, CH = H / ROWS;   // 시트 800×440
const KS = [4, 6, 8, 12, 16, 20, 24];                                          // 한도 값 표에 올리는 후보
const PAL = { bg0: '#eef2f7', bg1: '#dfe6f0', ink: '#0f1b2d', muted: '#5a6a80', accent: '#2b6cff', accent2: '#ff8a3d', surface: '#ffffff', line: 'rgba(15,27,45,.18)' };
const OK = '#1d4fd8', BAD = '#c2410c';
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif';
const SX = 100, SY = 52, SC = 0.55;   // 화면에서 시트가 놓이는 자리와 축소 배율(440×242)

function hsv(r, g, b) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0;
  if (d > 0) { if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
  return [h, mx ? d / mx : 0, mx / 255];
}
const hueDist = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };

// ---- 시트 그리기 ----
function sprite(x, cx, base) {          // 높이 130 캐릭터(몸통 65×87, 머리 43×44, 가는 지팡이)
  const bw = 65, bh = 87;
  const sg = x.createLinearGradient(cx + 35, 0, cx + 41, 0); sg.addColorStop(0, '#8b6a42'); sg.addColorStop(1, '#4a2f18');
  x.fillStyle = sg; x.fillRect(cx + 36, base - 120, 5, 121);
  x.fillStyle = '#e8d890'; x.fillRect(cx + 36, base - 123, 5, 4);
  const g = x.createLinearGradient(cx - 32, 0, cx + 33, 0); g.addColorStop(0, '#4a3f66'); g.addColorStop(0.35, '#2a2240'); g.addColorStop(1, '#14101f');
  x.fillStyle = g; x.fillRect(cx - 32, base - bh + 1, bw, bh);
  x.strokeStyle = 'rgba(0,0,0,.35)'; x.lineWidth = 2; [-14, 2, 16].forEach((o) => { x.beginPath(); x.moveTo(cx + o, base - bh + 16); x.lineTo(cx + o - 3, base - 2); x.stroke(); });
  x.fillStyle = 'rgba(190,170,240,.35)'; x.fillRect(cx - 32, base - bh + 1, 2, bh);
  x.fillStyle = '#6b4aa0'; x.fillRect(cx - 32, base - 38, bw, 6);
  const hg = x.createRadialGradient(cx - 8, base - 118, 3, cx, base - 108, 26); hg.addColorStop(0, '#8d68c8'); hg.addColorStop(1, '#4a3070');
  x.fillStyle = hg; x.beginPath(); x.ellipse(cx + 0.5, base - 108, 21.5, 22, 0, 0, 7); x.fill();
  x.fillStyle = '#120c1c'; x.beginPath(); x.ellipse(cx, base - 104, 12, 11, 0, 0, 7); x.fill();
  x.fillStyle = '#ffe58a'; x.fillRect(cx - 7, base - 106, 4, 3); x.fillRect(cx + 3, base - 106, 4, 3);
}
function lines(x, w, color) {           // 시트를 가로지르는 격자선(칸 경계마다)
  x.fillStyle = color;
  for (let c = 1; c < COLS; c++) x.fillRect(c * CW - (w >> 1) + 1, 0, w, H);
  for (let r = 1; r < ROWS; r++) x.fillRect(0, r * CH - (w >> 1) + 1, W, w);
}
function sheet(withLines) {
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, W, H * 0.4); g.addColorStop(0, 'hsl(136,100%,36%)'); g.addColorStop(1, 'hsl(146,100%,33%)');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  for (let r = 0; r < ROWS; r++) for (let q = 0; q < COLS; q++) sprite(x, q * CW + CW / 2, r * CH + CH - 20);
  if (withLines) lines(x, LINE_W, '#000');
  return c;
}

// ---- 제작 도구와 같은 분할 순서 ----
function estimateKeyHue(d) {
  const m = 4, bins = new Map();
  for (let y = 0; y < H; y++) for (let xx = 0; xx < W; xx++) {
    if (!(y < m || y >= H - m || xx < m || xx >= W - m)) { xx = W - m - 1; continue; }
    const i = (y * W + xx) * 4, k = (d[i] >> 4) * 256 + (d[i + 1] >> 4) * 16 + (d[i + 2] >> 4);
    const e = bins.get(k) || [0, 0, 0, 0]; e[0]++; e[1] += d[i]; e[2] += d[i + 1]; e[3] += d[i + 2]; bins.set(k, e);
  }
  let best = null; bins.forEach((e) => { if (!best || e[0] > best[0]) best = e; });
  return hsv(best[1] / best[0], best[2] / best[0], best[3] / best[0])[0];
}
function fgMask(c) {
  const d = c.getContext('2d').getImageData(0, 0, W, H).data, kh = estimateKeyHue(d), m = new Uint8Array(W * H);
  for (let p = 0, i = 0; p < W * H; p++, i += 4) {
    const [h, s, v] = hsv(d[i], d[i + 1], d[i + 2]);
    m[p] = (hueDist(h, kh) <= 30 && s >= 0.18 && v >= 0.04) ? 0 : 1;
  }
  return m;
}
function morph(m, k, horiz, erode) {      // 길이 k 한 줄짜리 막대로 침식(erode)이나 팽창
  const out = new Uint8Array(W * H), a = k >> 1, b = k - 1 - a, len = horiz ? W : H, n = horiz ? H : W, cs = new Int32Array(len + 1);
  for (let l = 0; l < n; l++) {
    for (let i = 0; i < len; i++) cs[i + 1] = cs[i] + m[horiz ? l * W + i : i * W + l];
    for (let i = 0; i < len; i++) {
      const lo = Math.max(0, i - a), hi = Math.min(len - 1, i + b), cnt = cs[hi + 1] - cs[lo];
      out[horiz ? l * W + i : i * W + l] = erode ? (cnt === hi - lo + 1 ? 1 : 0) : (cnt > 0 ? 1 : 0);
    }
  }
  return out;
}
const open1 = (m, k, horiz) => morph(morph(m, k, horiz, true), k, horiz, false);
function strip(m, k) { return open1(open1(m, k, false), k, true); }   // 세로 막대 열기(가로선 제거) 다음 가로 막대 열기(세로선 제거)
function spans(prof, minSpan, gap) {
  let mx = 0; for (const v of prof) if (v > mx) mx = v;
  const th = Math.max(mx * 0.015, 1e-9), runs = [];
  let s = -1;
  for (let i = 0; i <= prof.length; i++) { const on = i < prof.length && prof[i] > th; if (on && s < 0) s = i; if (!on && s >= 0) { runs.push([s, i]); s = -1; } }
  const merged = [];
  runs.forEach(([a, b]) => { if (merged.length && a - merged[merged.length - 1][1] < gap) merged[merged.length - 1][1] = b; else merged.push([a, b]); });
  return merged.filter(([a, b]) => b - a >= minSpan);
}
function absorb(sp, frac) {
  sp = sp.map((q) => q.slice());
  while (sp.length > 1) {
    const sizes = sp.map((q) => q[1] - q[0]).sort((p, q) => p - q), med = sizes[sizes.length >> 1];
    const i = sp.findIndex((q) => q[1] - q[0] < med * frac);
    if (i < 0) break;
    const pg = i > 0 ? sp[i][0] - sp[i - 1][1] : null, ng = i < sp.length - 1 ? sp[i + 1][0] - sp[i][1] : null;
    const toPrev = ng === null || (pg !== null && pg <= ng), j = toPrev ? i - 1 : i + 1, lo = Math.min(i, j), hi = Math.max(i, j);
    sp[lo] = [sp[lo][0], sp[hi][1]]; sp.splice(hi, 1);
  }
  return sp;
}
function detect(m) {                      // [{y0,y1,cells:[[x0,x1],...]}]
  const rowProf = new Float64Array(H), rows = [];
  for (let y = 0; y < H; y++) { let s = 0; for (let x = 0; x < W; x++) s += m[y * W + x]; rowProf[y] = s / W; }
  absorb(spans(rowProf, Math.max(Math.floor(H * 0.03), 4), 4), 0.3).forEach(([y0, y1]) => {
    const cp = new Float64Array(W);
    for (let x = 0; x < W; x++) { let s = 0; for (let y = y0; y < y1; y++) s += m[y * W + x]; cp[x] = s / (y1 - y0); }
    rows.push({ y0, y1, cells: absorb(spans(cp, Math.max(Math.floor(W * 0.01), 3), 12), 0.3) });
  });
  return rows;
}
const count = (rows) => rows.reduce((s, r) => s + r.cells.length, 0);

let GRAIN = null;
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
const STEP = ['격자선 그대로', '얇은 선을 두께로 지운다', '한도 값을 고른다', '요청에서 선을 뺀다'];

const demo = {
  dur: 3.8, rest: 3.8, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(31), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const lined = sheet(true), clean = sheet(false);
    const mL = fgMask(lined), mC = fgMask(clean);
    const stripped = strip(mL, LIMIT);
    const tint = document.createElement('canvas'); tint.width = W; tint.height = H;      // 지운 뒤 남은 마스크를 파랗게 덧칠한 층
    const tx = tint.getContext('2d'), td = tx.createImageData(W, H);
    for (let p = 0; p < W * H; p++) if (stripped[p]) { td.data[p * 4] = 43; td.data[p * 4 + 1] = 108; td.data[p * 4 + 2] = 255; td.data[p * 4 + 3] = 120; }
    tx.putImageData(td, 0, 0);
    const R = { raw: detect(mL), strip: detect(stripped), clean: detect(mC) };
    const chips = KS.map((k) => { const q = detect(strip(mL, k)); return { k, rows: q.length, n: count(q) }; });
    const tag = el('div', null, sp);   // 이름표(tag-tr): 오른쪽 위, 왼쪽 3px 선
    Object.assign(tag.style, { position: 'absolute', right: '12px', top: '10px', background: PAL.surface, borderLeft: `3px solid ${PAL.accent}`, borderRadius: '2px', padding: '4px 10px', font: `600 12px/1.3 ${SANS}`, color: PAL.ink, zIndex: '4', boxShadow: '0 1px 3px rgba(15,27,45,.15)' });
    return { main, tag, lined, clean, tint, R, chips };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 0 : (lv == null ? 3 : lv);
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.12;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();

    const pT = L >= 1 ? E.inOutC(seg(t, 0.5, 1.4)) : 0;        // 얇은 선을 지운 마스크가 올라오는 정도
    const pC = L >= 3 ? E.inOutC(seg(t, 2.6, 3.4)) : 0;        // 선 없는 시트로 바뀌는 정도
    const rows = pC > 0.5 ? s.R.clean : (pT > 0.5 ? s.R.strip : s.R.raw);
    const n = count(rows), want = COLS * ROWS, good = n === want;
    // 시트 그림
    x.save(); x.fillStyle = 'rgba(15,27,45,.16)'; x.fillRect(SX + 3, SY + 6, W * SC, H * SC); x.fillStyle = 'rgba(15,27,45,.12)'; x.fillRect(SX + 1, SY + 3, W * SC, H * SC); x.restore();
    x.drawImage(s.lined, SX, SY, W * SC, H * SC);
    if (pC > 0) { x.globalAlpha = pC; x.drawImage(s.clean, SX, SY, W * SC, H * SC); x.globalAlpha = 1; }
    if (pT > 0) { x.globalAlpha = pT * (1 - pC); x.drawImage(s.tint, SX, SY, W * SC, H * SC); x.globalAlpha = 1; }
    // 찾은 칸 상자
    rows.forEach((r, ri) => r.cells.forEach(([x0, x1], ci) => {
      const al = E.outC(seg(t, 0.15 + 0.05 * ci, 0.5 + 0.05 * ci));
      x.save(); x.globalAlpha = (pT > 0 && pT < 1 ? 1 : al) * (pC > 0 && pC < 1 ? 1 : 1);
      x.strokeStyle = good ? OK : BAD; x.lineWidth = 2.5; x.strokeRect(SX + x0 * SC, SY + r.y0 * SC, (x1 - x0) * SC, (r.y1 - r.y0) * SC); x.restore();
    }));
    x.strokeStyle = PAL.line; x.lineWidth = 1; x.strokeRect(SX + 0.5, SY + 0.5, W * SC - 1, H * SC - 1);
    // 머리글: 찾은 칸 수
    T(x, `찾은 칸 ${n}개`, 12, 30, 17, good ? OK : BAD, 700, 'left', SANS);
    T(x, `정답 ${want}개, 행 ${rows.length}`, 12, 47, 12, PAL.muted, 600, 'left', MONO);
    // 아래줄: 값 세 가지 또는 한도 표
    const cp = L >= 2 ? E.outC(seg(t, 1.6, 2.2)) : 0;
    if (cp < 1) {
      x.save(); x.globalAlpha = 1 - cp;
      const lw = pC > 0.5 ? 0 : LINE_W;
      [[`선 두께 ${lw}px`, 100], [L >= 1 ? `지우는 한도 ${LIMIT}px` : '지우는 한도 없음', 250], [`몸통 폭 65px`, 450]].forEach(([q, X]) => T(x, q, X, 338, 12, PAL.ink, 600, 'left', MONO));
      x.restore();
    }
    if (cp > 0) {
      x.save(); x.globalAlpha = cp;
      T(x, '지우는 한도별 찾은 칸 수 (선 두께 ' + LINE_W + 'px)', 63, 313, 11, PAL.muted, 600);
      s.chips.forEach((c, i) => {
        const CX = 63 + i * 74, ok = c.n === want, on = c.k === LIMIT;
        x.fillStyle = PAL.surface; x.beginPath(); x.roundRect(CX, 320, 70, 26, 4); x.fill();
        x.strokeStyle = on ? PAL.ink : PAL.line; x.lineWidth = on ? 2 : 1; x.beginPath(); x.roundRect(CX, 320, 70, 26, 4); x.stroke();
        T(x, `${c.k}px`, CX + 6, 337, 12, PAL.ink, 700, 'left', MONO);
        T(x, `${c.n}칸`, CX + 64, 337, 12, ok ? OK : BAD, 700, 'right', MONO);
      });
      x.restore();
    }
    s.tag.textContent = STEP[L];
  },
};
export default demo;
