/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/screen-kickoff-three/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 앱·웹 화면을 짓기 전의 착공 3종(벤치마크, 시안, 합격선)을 칸으로 보여 주고, 칸이 채워졌는지, 시안이 서로 다른 방향인지,
// 합격선 문장이 채점 가능한지를 코드가 이 장면의 데이터에서 세서 착공 가능 여부를 낸다. 화면은 시간 t 의 함수다.
const BENCH_N = 3;             // 벤치마크 개수
const TOP_N = 1;               // 그중 그 분야 상위권 실물 개수
const SKETCH_N = 3;            // 시안 개수
const DIFF_T = 0.30;           // 시안 두 장의 칸 채움이 이만큼(비율) 달라야 서로 다른 방향으로 센다
const PAL = { bg0: '#1f3a8a', bg1: '#172a63', ink: '#f3f6ff', muted: '#aebcf0', accent: '#ffd166', accent2: '#7fe0ff', surface: '#1b3274', line: 'rgba(243,246,255,.22)' };
const PASS = PAL.accent2, FAIL = '#ff9f8a';
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif';
const VAGUE = ['예쁘', '세련', '멋진', '고급', '촌스', '전문가', '제대로', '최고 수준', '완성도', '프로페셔널'];
const FIELDS = ['이름', '주소', '잘하는 것', '가져올 것'];

// 시안의 배치: [x, y, 폭, 높이] 를 0~1 단위로. 칸 채움을 24x14 격자로 비교한다
const SK = {
  A: [[0, 0, 1, .12], [.05, .2, .9, .3], [.05, .56, .43, .22], [.52, .56, .43, .22]],
  B: [[0, 0, 1, .12], [0, .12, .28, .88], [.34, .2, .62, .12], [.34, .38, .62, .52]],
  C: [[0, 0, 1, .12], [.04, .2, .92, .08], [.04, .34, .92, .1], [.04, .5, .92, .1], [.04, .66, .92, .1], [.04, .82, .92, .1]],
  D1: [[0, 0, 1, .12], [.04, .25, .28, .5], [.36, .25, .28, .5], [.68, .25, .28, .5]],
  D2: [[0, 0, 1, .12], [.04, .25, .28, .55], [.36, .25, .28, .55], [.68, .25, .28, .55]],
  D3: [[0, 0, 1, .12], [.05, .27, .27, .5], [.37, .27, .27, .5], [.69, .27, .27, .5]],
};
const GX = 24, GY = 14;
const occ = (R) => { const o = []; for (let j = 0; j < GY; j++) for (let i = 0; i < GX; i++) { const cx = (i + 0.5) / GX, cy = (j + 0.5) / GY; o.push(R.some(([x, y, w, h]) => cx >= x && cx <= x + w && cy >= y && cy <= y + h) ? 1 : 0); } return o; };
const dist = (a, b) => { const p = occ(SK[a]), q = occ(SK[b]); let d = 0; for (let i = 0; i < p.length; i++) if (p[i] !== q[i]) d++; return d / p.length; };
function directions(keys) {      // 거리가 DIFF_T 미만인 시안끼리 묶어 서로 다른 방향의 수를 센다
  const par = keys.map((_, i) => i), find = (i) => (par[i] === i ? i : (par[i] = find(par[i])));
  for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) if (dist(keys[i], keys[j]) < DIFF_T) par[find(j)] = find(i);
  return new Set(keys.map((_, i) => find(i))).size;
}
const minDist = (keys, i) => { const o = keys.filter((_, j) => j !== i).map((k) => dist(keys[i], k)); return o.length ? Math.min(...o) : null; };

const AFTER_LINES = [['목표', '신규 주문 현황 화면 1개'], ['누가', '모바일로 보는 매장 직원'], ['만들 것', '폭 320, 768, 1440 화면'], ['성공', '가로 스크롤 0, 대비 4.5 미만 0곳'], ['실패', '빈 상태 없음 또는 콘솔 오류 1건 이상']];
const BEFORE_LINES = [['목표', '멋진 화면'], ['누가', ''], ['만들 것', ''], ['성공', '예쁘고 세련되게'], ['실패', '촌스러우면 실패']];
const scorable = (s) => s.length > 0 && /\d/.test(s) && !VAGUE.some((w) => s.includes(w));
const lineState = (txt, i) => (txt === '' ? 'empty' : (i >= 3 ? (scorable(txt) ? 'scored' : 'vague') : (VAGUE.some((w) => txt.includes(w)) ? 'vague' : 'filled')));

function rr(x, X, Y, W, H, r) { x.beginPath(); x.roundRect(X, Y, W, H, Math.max(0, Math.min(r, W / 2, H / 2))); }
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.textBaseline = 'alphabetic'; x.fillText(s, X, Y); }
function panel(x, X, Y, W, H, fill) {
  x.save();
  [[0, 1, 2, 0.28], [0, 4, 10, 0.2], [0, 12, 24, 0.16]].forEach(([dx, dy, b, a]) => { x.shadowColor = `rgba(5,12,40,${a})`; x.shadowOffsetY = dy; x.shadowBlur = b; x.fillStyle = fill; rr(x, X, Y, W, H, 8); x.fill(); });
  x.restore(); x.fillStyle = fill; rr(x, X, Y, W, H, 8); x.fill(); x.strokeStyle = PAL.line; x.lineWidth = 1; rr(x, X + 0.5, Y + 0.5, W - 1, H - 1, 8); x.stroke();
}
function dashed(x, X, Y, W, H, label) {
  x.save(); x.strokeStyle = 'rgba(174,188,240,.5)'; x.lineWidth = 1.2; x.setLineDash([5, 4]); rr(x, X + 0.5, Y + 0.5, W - 1, H - 1, 8); x.stroke(); x.restore();
  if (label) T(x, label, X + W / 2, Y + H / 2 + 4, 10, PAL.muted, 500, 'center', MONO);
}
function wrap(x, text, maxW, size) {
  x.font = `500 ${size}px ${SANS}`; const out = []; let cur = '';
  for (const ch of text) { if (x.measureText(cur + ch).width > maxW && cur) { out.push(cur); cur = ch; } else cur += ch; }
  if (cur) out.push(cur); return out;
}
function mark(x, kind, X, Y) {     // 글꼴 글리프 대신 직접 그린 표시
  x.save(); x.lineWidth = 2; x.lineCap = 'round'; x.lineJoin = 'round';
  if (kind === 'scored') { x.strokeStyle = PASS; x.beginPath(); x.moveTo(X - 5, Y); x.lineTo(X - 1.5, Y + 4); x.lineTo(X + 5, Y - 4); x.stroke(); }
  else if (kind === 'vague') { x.strokeStyle = FAIL; x.beginPath(); x.moveTo(X - 4, Y - 4); x.lineTo(X + 4, Y + 4); x.moveTo(X + 4, Y - 4); x.lineTo(X - 4, Y + 4); x.stroke(); }
  else if (kind === 'filled') { x.fillStyle = PAL.muted; x.beginPath(); x.arc(X, Y, 2.5, 0, 7); x.fill(); }
  x.restore();
}
function lock(x, X, Y, open, ok) {   // 자물쇠: 몸통과 걸쇠를 직접 그린다
  const c = ok ? PASS : FAIL;
  x.save(); x.strokeStyle = c; x.lineWidth = 2.4; x.lineCap = 'round';
  const lift = open * 6;
  x.beginPath(); x.moveTo(X + 4, Y + 9 - lift * 0.5); x.lineTo(X + 4, Y + 5 - lift); x.arc(X + 10, Y + 5 - lift, 6, Math.PI, 0); x.lineTo(X + 16, Y + 9 - lift * (open > 0.5 ? 1 : 0.5) * (open > 0.5 ? 0.6 : 1)); x.stroke();
  const g = x.createLinearGradient(0, Y + 9, 0, Y + 25); g.addColorStop(0, ok ? '#b6f1ff' : '#ffc7b8'); g.addColorStop(1, c);
  x.fillStyle = g; rr(x, X, Y + 9, 20, 15, 4); x.fill();
  x.fillStyle = PAL.bg1; x.beginPath(); x.arc(X + 10, Y + 15.5, 2.2, 0, 7); x.fill(); x.fillRect(X + 9, Y + 16, 2, 4);
  x.restore();
}

let GRAIN = null;
const CAP = ['연출 전 · 한 마디로 시킨 화면', '1 · 벤치마크 3개', '2 · 시안 2~3개', '3 · 합격선 5줄'];
const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(55), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const pill = el('div', null, sp);   // 이름표(pill): 왼쪽 위 둥근 알약, 색은 팔레트에서
    Object.assign(pill.style, { position: 'absolute', left: '16px', top: '10px', height: '22px', padding: '0 12px 0 10px', borderRadius: '11px', background: PAL.surface, border: `1px solid ${PAL.line}`, color: PAL.ink, font: "600 12px/20px 'IBM Plex Sans KR',sans-serif", whiteSpace: 'nowrap', zIndex: '4', display: 'flex', alignItems: 'center', gap: '.7em' });
    const dot = el('span', null, pill), txt = el('span', null, pill);
    Object.assign(dot.style, { width: '.6em', height: '.6em', borderRadius: '50%', background: PAL.accent, display: 'inline-block' });
    return { main, pill: txt };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 0 : (lv == null ? 3 : lv);
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.setLineDash([]);
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.1;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();
    // 이 단계에서 칸에 들어 있는 것
    const benchOn = L >= 1, sketchOn = L >= 2, lineOn = L >= 3;
    const nB = benchOn ? BENCH_N : 0, top = benchOn ? Math.min(TOP_N, BENCH_N) : 0, filledB = nB * FIELDS.length;
    const skeys = L === 0 ? ['D1', 'D2', 'D3'] : (sketchOn ? ['A', 'B', 'C'].slice(0, SKETCH_N) : []);
    const dirs = directions(skeys);
    const lines = L === 0 ? BEFORE_LINES : (lineOn ? AFTER_LINES : null);
    const states = lines ? lines.map(([, tx], i) => lineState(tx, i)) : [];
    const filledL = states.filter((q) => q !== 'empty').length, scoredN = states.filter((q) => q === 'scored').length;
    const colX = [16, 222, 428], CW = 196;
    const ap = (i, base) => (L === base ? E.outC(seg(t, 0.3 + i * 0.28, 0.75 + i * 0.28)) : 1);   // 새로 들어오는 칸만 차례로 나타난다
    // 열 머리글
    T(x, '① 벤치마크 3개', colX[0], 52, 12, PAL.ink, 700);
    T(x, `${filledB}/${BENCH_N * FIELDS.length} 칸`, colX[0] + CW, 52, 11, filledB === BENCH_N * FIELDS.length ? PASS : FAIL, 600, 'right', MONO);
    T(x, '② 시안 2~3개', colX[1], 52, 12, PAL.ink, 700);
    T(x, skeys.length ? `다른 방향 ${dirs}/${skeys.length}` : '0개', colX[1] + CW, 52, 11, skeys.length && dirs === skeys.length ? PASS : FAIL, 600, 'right', MONO);
    T(x, '③ 합격선 5줄', colX[2], 52, 12, PAL.ink, 700);
    T(x, lines ? `채점 가능 ${scoredN}/2` : '0/2', colX[2] + CW, 52, 11, scoredN === 2 ? PASS : FAIL, 600, 'right', MONO);
    // ① 벤치마크 카드: 이름, 주소, 잘하는 것, 가져올 것 네 칸
    for (let i = 0; i < BENCH_N; i++) {
      const y = 60 + i * 82;
      if (!benchOn) { dashed(x, colX[0], y, CW, 74, i === 0 ? '비어 있음' : ''); continue; }
      const al = ap(i, 1);
      x.save(); x.globalAlpha = al; x.translate(0, (1 - al) * 8);
      panel(x, colX[0], y, CW, 74, PAL.surface);
      FIELDS.forEach((f, k) => { T(x, f, colX[0] + 12, y + 17 + k * 15, 10, PAL.muted, 500); x.fillStyle = 'rgba(243,246,255,.55)'; rr(x, colX[0] + 74, y + 10 + k * 15, [88, 104, 70, 80][k] - (i === 1 ? 10 : 0), 7, 3); x.fill(); });
      if (i < top) { x.fillStyle = PAL.accent; rr(x, colX[0] + CW - 62, y + 7, 54, 15, 7.5); x.fill(); T(x, '상위권 실물', colX[0] + CW - 35, y + 18, 10, '#172a63', 700, 'center'); }
      x.restore();
    }
    // ② 시안: 칸 채움 격자로 비교하는 배치 그림
    for (let i = 0; i < 3; i++) {
      const y = 60 + i * 82, key = skeys[i];
      if (!key) { dashed(x, colX[1], y, CW, 74, i === 0 ? '비어 있음' : ''); continue; }
      const al = ap(i, 2);
      x.save(); x.globalAlpha = al; x.translate(0, (1 - al) * 8);
      panel(x, colX[1], y, CW, 74, PAL.surface);
      const sx = colX[1] + 8, sy = y + 8, sw = 104, sh = 58;
      x.fillStyle = PAL.ink; rr(x, sx, sy, sw, sh, 4); x.fill();
      SK[key].forEach(([rx, ry, rw, rh], k) => { x.fillStyle = k === 0 ? PAL.bg0 : (k === 1 && key === 'A' ? PAL.accent : 'rgba(31,58,138,.22)'); rr(x, sx + rx * sw + (k ? 1 : 0), sy + ry * sh + (k ? 1 : 0), rw * sw - (k ? 2 : 0), rh * sh - (k ? 2 : 0), 2); x.fill(); });
      T(x, L === 0 ? `시안 ${i + 1}` : `시안 ${'ABC'[i]}`, sx + sw + 10, y + 22, 11, PAL.ink, 700);
      const md = minDist(skeys, i);
      if (md != null) { T(x, '다른 시안과', sx + sw + 10, y + 40, 10, PAL.muted, 500); T(x, `${Math.round(md * 100)}% 다름`, sx + sw + 10, y + 56, 11, md >= DIFF_T ? PASS : FAIL, 700, 'left', MONO); }
      x.restore();
    }
    // ③ 합격선 5줄
    for (let i = 0; i < 5; i++) {
      const y = 60 + i * 49, rowH = 43;
      if (!lines) { dashed(x, colX[2], y, CW, rowH, i === 0 ? '비어 있음' : ''); continue; }
      const al = ap(i, 3), [lab, txt] = lines[i], st = states[i];
      x.save(); x.globalAlpha = al; x.translate(0, (1 - al) * 8);
      panel(x, colX[2], y, CW, rowH, PAL.surface);
      T(x, lab, colX[2] + 10, y + 15, 10, PAL.accent, 700, 'left', MONO);
      if (st === 'empty') T(x, '(비어 있음)', colX[2] + 52, y + 15, 10, PAL.muted, 500);
      else wrap(x, txt, CW - 52 - 26, 10).slice(0, 3).forEach((ln, k) => T(x, ln, colX[2] + 52, y + 15 + k * 12, 10, PAL.ink, 500));
      mark(x, st, colX[2] + CW - 14, y + rowH / 2);
      x.restore();
    }
    // 아래 게이트: 세 조건을 코드가 센 뒤 착공 가능 여부를 낸다
    const ruleB = nB === 3 && top >= 1 && filledB === nB * FIELDS.length, ruleS = skeys.length >= 2 && skeys.length <= 3 && dirs === skeys.length, ruleL = !!lines && filledL === 5 && scoredN === 2;
    const ok = ruleB && ruleS && ruleL;
    panel(x, 16, 306, 608, 44, PAL.surface);
    const open = ok && L === 3 ? E.outBack(seg(t, 2.6, 3.4)) : (ok ? 1 : 0);
    lock(x, 28, 314, open, ok);
    const miss = [['벤치마크', ruleB], ['시안', ruleS], ['합격선', ruleL]].filter(([, q]) => !q).map(([n]) => n).join(', ');
    T(x, ok ? '착공 가능' : '착공 금지', 62, 334, 17, ok ? PAL.accent : FAIL, 700, 'left');
    T(x, ok ? '세 칸이 모두 채워졌다. 이제 코드를 쓴다' : `비어 있는 것: ${miss}`, 612, 333, 12, ok ? PASS : PAL.muted, 600, 'right');
    s.pill.textContent = CAP[L];
  },
};
export default demo;
