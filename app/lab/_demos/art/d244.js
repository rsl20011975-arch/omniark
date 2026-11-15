/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/longform-review-frames/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 롱폼 한 편의 검수: 프레임을 몇 장 어디서 뽑았나, 점검 도구가 무엇을 세나, 사람 몫은 무엇인가. 같은 산식을 이 데모의 가짜 신호에 돌려 코드가 센다.
const TOTAL = 308;          // 영상 길이(초) 5:08
const FPS = 4;              // 점검 도구가 영상을 다시 뽑는 초당 프레임 수
const STILL_T = 0.8;        // 프레임 차이가 이보다 작으면 정지로 센다
const CUT_T = 20;           // 프레임 차이가 이보다 크면 컷으로 센다
const STILL_SEC = 3;        // 정지가 이 초를 넘게 이어지면 한 번으로 센다
const LUFS_IN = -16.2;      // 이 가짜 영상의 통합 음량(LUFS)
const FIRST30 = [0, 5, 10, 15, 20, 30];   // 앞 30초 장면표에 뽑는 시각(초)
const REP_AT = 1.2;         // 챕터 대표 프레임은 챕터 시작 몇 초 뒤인가
const CHAPS = [0, 18, 59, 150, 164, 206, 248];   // 챕터 시작(초)
const STILLS = [[96, 109], [200, 202.5]];        // 이 가짜 영상의 정지 구간(초)
const PAL = { bg0: '#a9402c', bg1: '#8f3322', ink: '#fff4ec', muted: '#ffd9c9', accent: '#ffe27a', accent2: '#1d1a16', surface: '#b24a34', line: 'rgba(255,244,236,.3)' };
const DK = '#1d1a16', WARM = '#ff9c86';
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif';
const STEPS = ['4장만', '앞30초', '챕터별', '도구5칸', '사람칸'];
const BX = 34, BW = 592;
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const tx = (sec) => BX + sec / TOTAL * BW;

let SIG = null, GRAIN = null;
function makeSignal() {         // 4fps 프레임 차이 신호: 보통 움직임 + 컷 16번 + 정지 구간
  const r = rng(404), n = TOTAL * FPS - 1, d = new Float32Array(n), cuts = new Set();
  for (let k = 0; k < 16; k++) { let c = Math.round(((k + 0.5) * TOTAL / 16 + (r() - 0.5) * 6) * FPS); if (STILLS.some(([a, b]) => c / FPS > a - 1 && c / FPS < b + 1)) c += 40 * FPS; cuts.add(Math.min(n - 1, c)); }
  for (let i = 0; i < n; i++) {
    const t = i / FPS; d[i] = 2.2 + 1.1 * Math.sin(t / 6) + r() * 1.3 + (t < 30 ? 1.1 : 0);
    if (STILLS.some(([a, b]) => t >= a && t < b)) d[i] = 0.1 + r() * 0.4;
    if (cuts.has(i)) d[i] = 24 + r() * 8;
  }
  return d;
}
function gate(d) {              // 점검 도구와 같은 산식
  const n30 = 30 * FPS, h = Array.from(d.slice(0, n30)), f30 = h.reduce((p, c) => p + c, 0) / n30, f30s = h.filter((v) => v < STILL_T).length / n30;
  const segs = []; let st = -1;
  for (let i = 0; i <= d.length; i++) { const s = i < d.length && d[i] < STILL_T; if (s && st < 0) st = i; if (!s && st >= 0) { if (i - st >= STILL_SEC * FPS + 1) segs.push([st / FPS, i / FPS]); st = -1; } }
  const cuts = Array.from(d).filter((v) => v > CUT_T).length, cut = d.length / FPS / Math.max(cuts, 1);
  return { f30, f30s, st3: segs.length, segs, cut, cuts };
}
function reps() { return CHAPS.map((s, i) => Math.min(s + REP_AT, (i + 1 < CHAPS.length ? CHAPS[i + 1] : TOTAL) - 0.3)); }

function rr(x, X, Y, W, H, r) { x.beginPath(); x.roundRect(X, Y, W, H, Math.max(0, Math.min(r, W / 2, H / 2))); }
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.textBaseline = 'alphabetic'; x.fillText(s, X, Y); }
function mark(x, cx, cy, ok, col) {
  x.save(); x.strokeStyle = col; x.lineWidth = 2; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
  if (ok) { x.moveTo(cx - 4, cy); x.lineTo(cx - 1, cy + 3.5); x.lineTo(cx + 5, cy - 4); } else { x.moveTo(cx - 4, cy - 4); x.lineTo(cx + 4, cy + 4); x.moveTo(cx + 4, cy - 4); x.lineTo(cx - 4, cy + 4); }
  x.stroke(); x.restore();
}
const SCENES = [['#14213d', '#22345f'], ['#f1ead9', '#e0d6bd'], ['#e9e5dc', '#cfc9bb'], ['#101820', '#1f2d3d'], ['#f4efe4', '#e6dfcf'], ['#dfe9f3', '#c4d4e6'], ['#2b1d17', '#4a2f24']];
function art(x, X, Y, w, h, i) {  // 롱폼 장면 일곱 종류를 코드로 그린 작은 프레임
  const sc = SCENES[i % 7], dark = i % 7 === 0 || i % 7 === 3 || i % 7 === 6, ink = dark ? '#f1ead9' : '#1d1a16', ac = '#e8553a';
  x.save(); rr(x, X, Y, w, h, 3); x.clip();
  const g = x.createLinearGradient(0, Y, 0, Y + h); g.addColorStop(0, sc[0]); g.addColorStop(1, sc[1]); x.fillStyle = g; x.fillRect(X, Y, w, h);
  const b = (px2, py, pw, ph, c, al) => { x.globalAlpha = al == null ? 1 : al; x.fillStyle = c; x.fillRect(X + px2 * w, Y + py * h, pw * w, ph * h); x.globalAlpha = 1; };
  switch (i % 7) {
    case 0: b(0.08, 0.22, 0.7, 0.16, ink); b(0.08, 0.44, 0.46, 0.1, ink, 0.7); b(0.08, 0.64, 0.22, 0.2, ac); break;
    case 1: b(0.08, 0.3, 0.14, 0.4, ac); b(0.28, 0.34, 0.6, 0.12, ink); b(0.28, 0.54, 0.4, 0.08, ink, 0.55); break;
    case 2: b(0.06, 0.14, 0.42, 0.72, '#fff', 0.7); b(0.52, 0.14, 0.42, 0.72, ac, 0.8); b(0.11, 0.26, 0.3, 0.08, ink); b(0.57, 0.26, 0.3, 0.08, '#fff'); break;
    case 3: [0.2, 0.34, 0.48, 0.62, 0.76].forEach((py, k) => b(0.1, py, [0.5, 0.32, 0.6, 0.4, 0.26][k], 0.07, k === 2 ? '#7fe0a8' : '#9fb4c8', 0.9)); break;
    case 4: [0.2, 0.38, 0.3, 0.56, 0.7].forEach((hh, k) => b(0.14 + k * 0.15, 0.82 - hh, 0.1, hh, k === 4 ? ac : ink, k === 4 ? 1 : 0.6)); break;
    case 5: b(0, 0, 1, 0.16, '#fff', 0.8); b(0.08, 0.3, 0.26, 0.5, '#fff', 0.9); b(0.38, 0.3, 0.26, 0.5, '#fff', 0.9); b(0.68, 0.3, 0.26, 0.5, '#fff', 0.9); break;
    default: x.fillStyle = ac; x.beginPath(); x.arc(X + w / 2, Y + h * 0.42, h * 0.2, 0, Math.PI * 2); x.fill(); b(0.3, 0.74, 0.4, 0.08, ink, 0.8);
  }
  const gl = x.createLinearGradient(0, Y, 0, Y + h * 0.5); gl.addColorStop(0, 'rgba(255,255,255,.14)'); gl.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = gl; x.fillRect(X, Y, w, h * 0.5);
  x.restore(); x.strokeStyle = 'rgba(29,26,22,.5)'; x.lineWidth = 1; rr(x, X + 0.5, Y + 0.5, w - 1, h - 1, 3); x.stroke();
}
function thumb(x, X, Y, i, sec, k, tag, hit) {
  const w = 76, h = 43; x.save(); x.globalAlpha = Math.min(1, k * 1.5); x.translate(X + w / 2, Y + h / 2); const s = 0.8 + 0.2 * E.outBack(k); x.scale(s, s); x.translate(-X - w / 2, -Y - h / 2);
  [1, 2, 3].forEach((q) => { x.fillStyle = 'rgba(0,0,0,0.1)'; rr(x, X - q, Y + q, w + 2 * q, h + q, 4 + q); x.fill(); });
  art(x, X, Y, w, h, i); if (hit) { x.fillStyle = 'rgba(255,226,122,.5)'; rr(x, X, Y, w, h, 3); x.fill(); x.strokeStyle = PAL.accent; x.lineWidth = 2; rr(x, X - 1, Y - 1, w + 2, h + 2, 4); x.stroke(); T(x, '정지 안', X + w / 2, Y + h / 2 + 4, 11, '#1d1a16', 800, 'center'); }
  T(x, `${tag}${mmss(sec)}`, X + w / 2, Y + h + 12, 10, PAL.ink, 600, 'center', MONO);
  x.restore();
}
function inStill(sec, segs) { return segs.some(([a, b]) => sec >= a && sec <= b); }

const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 4,
  mount(sp) {
    SIG = makeSignal();
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(7), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const vert = el('div', null, sp);   // 이름표(vertical): 왼쪽 가장자리 세로쓰기, 지금 단계만 밝게
    Object.assign(vert.style, { position: 'absolute', left: '10px', top: '14px', writingMode: 'vertical-rl', font: "600 12px 'IBM Plex Sans KR',sans-serif", letterSpacing: '2px', whiteSpace: 'nowrap', zIndex: '4' });
    const items = STEPS.map((n) => { const s2 = el('span', null, vert); s2.textContent = n; Object.assign(s2.style, { display: 'inline-block', marginInlineEnd: '12px' }); return s2; });
    return { main, items };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 0 : (lv == null ? 4 : lv);
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.setLineDash([]);
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.09;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();

    const G = gate(SIG), rp = reps();
    const row1 = L === 0 ? [[0, 0, ''], [1, 1, ''], [2, TOTAL / 2, ''], [6, TOTAL - 1, '']] : FIRST30.map((q, i) => [i, q, '']);
    const row2 = L >= 2 ? rp.map((q, i) => [i + 1, q, `장${i + 1} `]) : [];
    const samples = row1.map((q) => q[1]).concat(row2.map((q) => q[1])), hits = samples.filter((q) => inStill(q, G.segs)).length;
    T(x, L === 0 ? '확인 프레임: 0.0초, 1.0초, 가운데, 끝' : `앞 30초 장면표(${FIRST30.length}장)`, BX, 13, 10.5, PAL.muted, 500, 'left', MONO);
    row1.forEach(([i, q, tg], k) => thumb(x, BX + k * 84.5, 18, i, q, L >= 2 ? 1 : E.outC(seg(t, 0.1 + k * 0.07, 0.5 + k * 0.07)), tg, inStill(q, G.segs)));
    if (L === 0) {
      const ok = row1.every((q) => !inStill(q[1], G.segs));
      x.fillStyle = 'rgba(29,26,22,.7)'; rr(x, BX + 4 * 84.5 + 6, 22, 238, 40, 6); x.fill();
      T(x, ok ? '네 장 모두 정상으로 보임' : '정지가 보임', BX + 4 * 84.5 + 16, 40, 12, PAL.accent, 700);
      T(x, '그래서 ‘다 봤다’고 보고한다', BX + 4 * 84.5 + 16, 55, 10.5, PAL.ink, 500);
    }
    if (L >= 2) {
      T(x, `챕터 대표 프레임(챕터 시작 ${REP_AT}초 뒤)`, BX, 84, 10.5, PAL.muted, 500, 'left', MONO);
      row2.forEach(([i, q, tg], k) => thumb(x, BX + k * 84.5, 88, i, q, L === 2 ? E.outC(seg(t, 0.1 + k * 0.08, 0.5 + k * 0.08)) : 1, tg, inStill(q, G.segs)));
    }

    // 프레임 차이 띠
    const BY = 165, BH = 42;
    T(x, '프레임 차이, 4fps 가짜 신호', BX, 158, 10.5, PAL.muted, 500, 'left', MONO);
    x.fillStyle = 'rgba(29,26,22,.62)'; rr(x, BX, BY, BW, BH, 5); x.fill();
    if (L === 0) T(x, '움직임은 재지 않음', BX + BW / 2, BY + 25, 12, PAL.muted, 600, 'center');
    else {
      const rev = L >= 3 ? E.outC(seg(t, 0.2, 1.6)) : 1, lim = L >= 3 ? BX + rev * BW : BX + 30 / TOTAL * BW;
      for (let c = 0; c < BW; c += 1) {
        const px0 = BX + c; if (px0 > lim) break;
        const f0 = Math.floor(c / BW * SIG.length), f1 = Math.max(f0 + 1, Math.floor((c + 1) / BW * SIG.length));
        let mx = 0; for (let f = f0; f < f1; f++) mx = Math.max(mx, SIG[f]);
        const sec = c / BW * TOTAL, stl = G.segs.some(([a2, b2]) => sec >= a2 && sec <= b2), short = mx < STILL_T && !stl;
        const hh = Math.max(2, Math.min(mx / 6, 1) * (BH - 8));
        x.fillStyle = mx > CUT_T ? PAL.ink : (stl && L >= 3 ? PAL.accent : (short && L >= 3 ? 'rgba(255,217,201,.5)' : 'rgba(255,217,201,.78)'));
        x.fillRect(px0, BY + BH - 4 - hh, 1, hh);
      }
      if (L >= 3) G.segs.forEach(([a2, b2]) => { x.fillStyle = 'rgba(255,226,122,.42)'; x.fillRect(tx(a2), BY - 12, tx(b2) - tx(a2), BH + 18); });
      if (L >= 3) G.segs.forEach(([a2, b2]) => T(x, `정지 ${(b2 - a2).toFixed(1)}초`, tx(a2) + 2, BY - 2, 10.5, '#1d1a16', 800, 'left', MONO));
      if (L < 3) { x.fillStyle = 'rgba(29,26,22,.55)'; x.fillRect(lim, BY + 1, BX + BW - lim, BH - 2); T(x, '재지 않은 구간', lim + 8, BY + 25, 10.5, PAL.muted, 600); }
      if (L >= 2) CHAPS.forEach((q) => { x.fillStyle = 'rgba(255,244,236,.22)'; x.fillRect(tx(q), BY, 1, BH); });
      samples.forEach((q) => { const sx = tx(q), hit = inStill(q, G.segs); x.fillStyle = hit ? WARM : PAL.ink; x.fillRect(sx - 0.5, BY - 1, 1.5, BH + 2); x.beginPath(); x.moveTo(sx - 3, BY + BH + 5); x.lineTo(sx + 3, BY + BH + 5); x.lineTo(sx, BY + BH); x.fill(); });
    }
    for (let m = 0; m <= 5; m++) T(x, `${m}:00`, tx(m * 60), BY + BH + 16, 10, PAL.muted, 500, 'center', MONO);
    if (L >= 2) T(x, `눈금 ${samples.length}개 중 정지 구간 안 ${hits}개`, BX + BW, 158, 10.5, PAL.ink, 600, 'right', MONO);

    // 점검 도구 5칸
    const cells = [
      { n: '앞 30초 움직임', v: G.f30.toFixed(2), th: '2.0 이상', ok: G.f30 >= 2.0 },
      { n: '앞 30초 정지', v: `${(G.f30s * 100).toFixed(0)}%`, th: '50% 이하', ok: G.f30s <= 0.5 },
      { n: `${STILL_SEC}초 넘는 정지`, v: `${G.st3}번`, th: '0번', ok: G.st3 <= 0 },
      { n: '컷 간격', v: `${G.cut.toFixed(1)}초`, th: '20초 이하', ok: G.cut <= 20 },
      { n: '통합 음량', v: LUFS_IN.toFixed(1), th: '-14 ±1.5', ok: Math.abs(LUFS_IN + 14) <= 1.5 },
    ], pass = cells.filter((c) => c.ok).length, CW = (BW - 32) / 5;
    T(x, '점검 도구가 세는 5칸', BX, 242, 10.5, PAL.muted, 500, 'left', MONO);
    if (L >= 3) T(x, `5칸 중 ${pass}칸 통과`, BX + BW, 242, 11, PAL.ink, 600, 'right', MONO);
    cells.forEach((c, i) => {
      const cx = BX + i * (CW + 8), cy = 247, vis = L >= 3, k = vis ? E.outC(seg(t, 0.5 + i * 0.12, 1.0 + i * 0.12)) : 0;
      x.save(); x.globalAlpha = vis ? 0.25 + 0.75 * k : 0.5; x.fillStyle = vis ? 'rgba(29,26,22,.78)' : 'rgba(29,26,22,.3)'; rr(x, cx, cy, CW, 44, 6); x.fill();
      if (vis) { x.fillStyle = c.ok ? 'rgba(255,226,122,.26)' : 'rgba(150,20,12,.6)'; rr(x, cx, cy, CW, 44, 6); x.fill(); }
      if (!vis) { x.setLineDash([3, 3]); x.strokeStyle = PAL.line; x.lineWidth = 1; rr(x, cx + 0.5, cy + 0.5, CW - 1, 43, 6); x.stroke(); x.setLineDash([]); }
      T(x, c.n, cx + 8, cy + 16, 11, PAL.ink, 600);
      if (vis) { const col = c.ok ? PAL.accent : WARM; T(x, c.v, cx + 8, cy + 36, 15, col, 700, 'left', MONO); mark(x, cx + CW - 15, cy + 29, c.ok, col); }
      else T(x, '—', cx + 8, cy + 36, 15, PAL.muted, 600, 'left', MONO);
      x.restore();
    });
    // 사람 몫 4칸
    const hum = ['소리를 듣는다', '앞 30초 약속한 결과', '글자가 읽히는가', '전환이 어색한가'];
    T(x, '도구가 못 세는 칸', BX, 307, 10.5, PAL.muted, 500, 'left', MONO);
    hum.forEach((n, i) => {
      const cw = (BW - 24) / 4, cx = BX + i * (cw + 8), cy = 313, vis = L >= 4, k = vis ? E.outC(seg(t, 0.2 + i * 0.12, 0.7 + i * 0.12)) : 0;
      x.save(); x.globalAlpha = vis ? 0.3 + 0.7 * k : 0.5; x.fillStyle = vis ? 'rgba(29,26,22,.78)' : 'rgba(29,26,22,.3)'; rr(x, cx, cy, cw, 40, 6); x.fill();
      x.setLineDash([3, 3]); x.strokeStyle = vis ? PAL.accent : PAL.line; x.lineWidth = 1; rr(x, cx + 0.5, cy + 0.5, cw - 1, 39, 6); x.stroke(); x.setLineDash([]);
      T(x, n, cx + 8, cy + 16, 11, PAL.ink, 600);
      T(x, vis ? '미판정 → 사람' : '—', cx + 8, cy + 32, 11, vis ? PAL.accent : PAL.muted, 700, 'left', MONO);
      x.restore();
    });
    s.items.forEach((it, i) => { it.style.color = i === L ? PAL.ink : PAL.muted; it.style.fontWeight = i === L ? '700' : '500'; it.style.opacity = i === L ? '1' : '0.8'; });
  },
};
export default demo;
