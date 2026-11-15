/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/short-caption-chunks/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 말하는 문장 하나를 자막 조각으로 나누고, 조각이 뜨는 시각을 말이 나오는 속도에 맞춘다. 화면은 시간 t 의 함수다.
// 조각 나누기는 제작 코드(최대 어절 수, 한 줄 폭, 마지막 한 어절 합치기)와 같은 순서로 계산하고, 속도와 어긋남도 코드가 잰다.
const SENTENCE = '청소기 먼지통에 쌓인 머리카락부터 빼내야 흡입력이 다시 살아납니다';
const EMPH = '머리카락';        // 노랑으로 칠할 낱말(포함하는 어절 하나)
const MAX_WORDS = 3;            // 한 조각의 최대 어절 수
const MAX_W = 756;              // 한 줄 최대 폭(1080 화면 기준 px)
const SIZE = 64;                // 자막 글자 크기(px)
const SPEECH_CPS = 7.5;         // 말이 나오는 속도(자/초), 이 데모의 가정값
const S0 = 0.3;                 // 말이 시작하는 시각(초)
const POP = 0.22;               // 조각이 튀어나오는 시간(초)
const POP_FROM = 0.62;          // 튀어나오기 시작할 때의 크기 배율(1.0 으로 오버슈트 후 안착)
const ADV = 0.864, SPACE = 0.22;   // 한글 한 글자와 띄어쓰기 폭(글자 크기 대비, 제작 글꼴 파일을 PIL 로 잰 값)
const STROKE = 10, CENTER_Y = 1220;   // 외곽선 두께, 자막 중심 y(1080×1920 화면)
const PAL = { bg0: '#1f3a8a', bg1: '#172a63', ink: '#f3f6ff', muted: '#aebcf0', accent: '#ffd166', accent2: '#7fe0ff', surface: '#1b3274', line: 'rgba(243,246,255,.18)' };
const C = { text: '#FAFAFA', hot: '#FFD640', ink: '#0C0D10' };   // 영상 위 자막 색(제작 값)
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif', HEAVY = '"Black Han Sans", "IBM Plex Sans KR", sans-serif';
const PX = 30, PY = 10, PH = 340, PW = Math.round(PH * 9 / 16), S = PH / 1920;
const adv = (s, size) => [...s].reduce((w, c) => w + size * (c === ' ' ? SPACE : /[가-힣]/.test(c) ? ADV : /[0-9]/.test(c) ? 0.626 : 0.57), 0);
const units = (s) => s.replace(/[^가-힣A-Za-z0-9]/g, '').length;

function chunksOf(text) {       // 제작 코드와 같은 순서: 3어절 또는 폭 초과면 끊고, 마지막이 한 어절이면 앞 조각의 끝 낱말을 넘긴다
  const out = []; let cur = [];
  for (const w of text.split(' ')) {
    const trial = cur.concat([w]).join(' ');
    if (cur.length && (cur.length >= MAX_WORDS || adv(trial, SIZE) > MAX_W)) { out.push(cur); cur = [w]; } else cur.push(w);
  }
  if (cur.length) out.push(cur);
  if (out.length > 1 && out[out.length - 1].length === 1 && out[out.length - 2].length >= 2) out[out.length - 1].unshift(out[out.length - 2].pop());
  return out.map((c) => c.join(' '));
}
function plan(L) {              // 단계마다 조각 목록과 자막이 뜨는 구간
  const total = units(SENTENCE) / SPEECH_CPS;
  if (L === 1) {
    const lines = []; let cur = '';       // 글자 수로 자르기: 폭이 차면 낱말 가운데서도 끊는다
    for (const ch of SENTENCE) { if (adv(cur + ch, SIZE) > MAX_W && ch !== ' ') { lines.push(cur.trim()); cur = ch; } else cur += ch; }
    lines.push(cur.trim());
    let split = 0, pos = 0; const words = SENTENCE.split(' '), bounds = []; let acc = 0; lines.forEach((l) => { acc += l.replace(/ /g, '').length; bounds.push(acc); });
    words.forEach((w) => { const a = pos, b = pos + w.length; if (bounds.some((e) => e > a && e < b)) split++; pos = b; });
    return { kind: 'whole', lines, split, total };
  }
  const cs = chunksOf(SENTENCE), ns = cs.map(units), all = ns.reduce((a, b) => a + b, 0);
  let acc = 0;
  const rows = cs.map((txt, i) => {
    const sp0 = S0 + acc / SPEECH_CPS, sp1 = S0 + (acc + ns[i]) / SPEECH_CPS; acc += ns[i];
    const c0 = L === 2 ? S0 + (i / cs.length) * total : sp0, c1 = L === 2 ? S0 + ((i + 1) / cs.length) * total : sp1;
    return { txt, n: ns[i], words: txt.split(' ').length, w: adv(txt, SIZE), sp0, sp1, c0, c1, cps: ns[i] / (c1 - c0), gap: Math.abs(c0 - sp0), over: adv(txt, SIZE) > MAX_W };
  });
  return { kind: 'chunks', rows, total, all, gapMax: Math.max(...rows.map((r) => r.gap)), lo: Math.min(...rows.map((r) => r.cps)), hi: Math.max(...rows.map((r) => r.cps)) };
}

function scene(g) {             // 작업대 앞 구멍판 벽과 나무 작업대: 따뜻한 빛, 구멍 그림자, 나뭇결
  const wall = g.createLinearGradient(0, 0, 0, 1150); wall.addColorStop(0, '#b9a982'); wall.addColorStop(1, '#8f7f5c'); g.fillStyle = wall; g.fillRect(0, 0, 1080, 1150);
  for (let y = 40; y < 1150; y += 90) for (let x = 40; x < 1080; x += 90) {
    const h = g.createRadialGradient(x - 3, y - 3, 1, x, y, 15); h.addColorStop(0, '#2b2316'); h.addColorStop(1, '#5a4a30'); g.fillStyle = h; g.beginPath(); g.arc(x, y, 14, 0, 7); g.fill();
    g.strokeStyle = 'rgba(255,240,200,.4)'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, 15.5, 0.2 * Math.PI, 0.9 * Math.PI); g.stroke();
  }
  const bench = g.createLinearGradient(0, 1150, 0, 1920); bench.addColorStop(0, '#9a6a3c'); bench.addColorStop(0.4, '#76492a'); bench.addColorStop(1, '#4a2b16'); g.fillStyle = bench; g.fillRect(0, 1150, 1080, 770);
  const r = rng(9);
  for (let i = 0; i < 160; i++) { const y = 1160 + r() * 750, x = r() * 1080, len = 120 + r() * 520; g.strokeStyle = r() < 0.5 ? `rgba(40,20,8,${0.12 + 0.2 * r()})` : `rgba(230,180,120,${0.08 + 0.12 * r()})`; g.lineWidth = 1 + r() * 3 * ((y - 1100) / 800); g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + len * 0.3, y + (r() - 0.5) * 8, x + len * 0.7, y + (r() - 0.5) * 8, x + len, y); g.stroke(); }
  const edge = g.createLinearGradient(0, 1120, 0, 1200); edge.addColorStop(0, 'rgba(0,0,0,0)'); edge.addColorStop(0.5, 'rgba(20,10,4,.55)'); edge.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = edge; g.fillRect(0, 1120, 1080, 80);
  const lamp = g.createRadialGradient(240, 220, 0, 240, 220, 900); lamp.addColorStop(0, 'rgba(255,238,190,.5)'); lamp.addColorStop(1, 'rgba(255,238,190,0)'); g.fillStyle = lamp; g.fillRect(0, 0, 1080, 1920);
  const v = g.createRadialGradient(540, 960, 520, 540, 960, 1300); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.5)'); g.fillStyle = v; g.fillRect(0, 0, 1080, 1920);
}
function word(g, text, x, y, col, k, sc) {   // 제작 글꼴 폭에 맞춰 가로로 눌러 그린 낱말: 그림자 두 겹, 외곽선, 글자
  g.save(); g.font = `800 ${SIZE}px ${HEAVY}`; g.textBaseline = 'alphabetic'; g.textAlign = 'left';
  const w = adv(text, SIZE), kx = w / g.measureText(text).width; g.translate(x, y); g.scale(kx, 1); g.lineJoin = 'round';
  [[2.6, 0.31], [1, 0.59]].forEach(([m, al]) => { g.save(); g.shadowColor = `rgba(0,0,0,${al})`; g.shadowBlur = 14 * m * sc; g.shadowOffsetY = 6 * sc; g.strokeStyle = 'rgba(0,0,0,.01)'; g.lineWidth = STROKE / kx; g.strokeText(text, 0, 0); g.restore(); });
  g.strokeStyle = C.ink; g.lineWidth = STROKE / kx; g.strokeText(text, 0, 0); g.fillStyle = col; g.fillText(text, 0, 0); g.restore();
}
function caption(g, txt, cx, cy, k, sc, hot) {   // 조각 하나(한 줄)를 가운데 정렬로, 강조어만 노랑
  const w = adv(txt, SIZE), sp = SIZE * SPACE; let x = cx - w / 2;
  g.save(); g.translate(cx, cy); g.scale(k, k); g.translate(-cx, -cy); x = cx - w / 2;
  txt.split(' ').forEach((wd) => { word(g, wd, x, cy + SIZE * 0.34, hot && wd.includes(EMPH) ? C.hot : C.text, 1, sc); x += adv(wd, SIZE) + sp; });
  g.restore();
}
function frame(g, t, L, P, sc) {
  scene(g);
  if (P.kind === 'whole') {
    if (t >= S0) { const lh = SIZE * 1.25; P.lines.forEach((ln, i) => { const w = adv(ln, SIZE); let x = 540 - w / 2; ln.split(' ').forEach((wd) => { word(g, wd, x, CENTER_Y - lh * (P.lines.length - 1) / 2 + i * lh + SIZE * 0.34, C.text, 1, sc); x += adv(wd, SIZE) + SIZE * SPACE; }); }); }
    return;
  }
  const act = P.rows.filter((r) => t >= r.c0 - 1e-6 && t < r.c1).pop() || (t >= P.rows[P.rows.length - 1].c1 ? P.rows[P.rows.length - 1] : null);
  if (!act || t < S0) return;
  const k = L >= 3 ? lerp(POP_FROM, 1, E.outBack(seg(t, act.c0, act.c0 + POP))) : 1;
  caption(g, act.txt, 540, CENTER_Y, k, sc, L >= 3);
}

let GRAIN = null;
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function card(x, X, Y, W, H) { x.fillStyle = PAL.surface; x.beginPath(); x.roundRect(X, Y, W, H, 6); x.fill(); x.strokeStyle = PAL.line; x.lineWidth = 1; x.stroke(); }
const STEP = ['글자 수로 자른 통자막', '어절 조각으로 나눔', '말 시각에 맞춰 넘김'];
const demo = {
  dur: 4.6, rest: 4.6, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(52), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const pill = el('div', null, sp);   // 이름표(pill): 오른쪽 아래, 둥근 알약
    Object.assign(pill.style, { position: 'absolute', right: '16px', bottom: '10px', padding: '4px 12px', borderRadius: '999px', background: PAL.surface, border: `1px solid ${PAL.line}`, color: PAL.ink, font: "600 11.5px/1.2 'IBM Plex Sans KR',sans-serif", zIndex: '4' });
    return { main, pill };
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 3 : lv), P = plan(L), x = s.main.getContext('2d'), tt = Math.max(0, Math.min(t, 4.6));
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.shadowColor = 'transparent';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.1;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();
    x.save(); x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 18; x.shadowOffsetY = 6; x.fillStyle = '#0c0d10'; x.beginPath(); x.roundRect(PX, PY, PW, PH, 12); x.fill(); x.restore();
    x.save(); x.beginPath(); x.roundRect(PX, PY, PW, PH, 12); x.clip(); x.translate(PX, PY); x.scale(S, S); frame(x, tt, L, P, 2 * S); x.restore();
    x.setTransform(2, 0, 0, 2, 0, 0); x.shadowColor = 'transparent';
    const RX = 236, RW = 388;
    // 조각 표(큰 요소 하나): 조각 글, 폭, 읽는 속도만 남긴다
    const COL = { w: RX + 292, v: RX + RW - 12 };
    card(x, RX, 10, RW, 142);
    if (P.kind === 'whole') {
      T(x, '글자 수로 자른 줄', RX + 12, 30, 12, PAL.ink, 600);
      P.lines.forEach((ln, i) => T(x, `${i + 1}  ${ln}`, RX + 14, 54 + i * 18, 13, PAL.ink, 500));
      T(x, `낱말이 줄 사이에서 끊긴 곳 ${P.split}`, RX + RW - 12, 30, 12, PAL.accent, 700, 'right');
      T(x, '조각 단위가 없어 말 시각에 맞출 수 없다', RX + 14, 138, 11, PAL.muted, 500);
    } else {
      T(x, '조각', RX + 14, 30, 11, PAL.muted, 500, 'left', MONO);
      T(x, '폭 px', COL.w, 30, 11, PAL.muted, 500, 'right', MONO);
      T(x, '자/초', COL.v, 30, 11, PAL.muted, 500, 'right', MONO);
      P.rows.forEach((r, i) => {
        const Y = 52 + i * 17, on = tt >= r.c0 && tt < r.c1, p = E.outC(seg(tt, 0.2 + i * 0.1, 0.8 + i * 0.1));
        if (on) { x.fillStyle = 'rgba(243,246,255,.1)'; x.beginPath(); x.roundRect(RX + 6, Y - 13, RW - 12, 17, 3); x.fill(); }
        x.globalAlpha = 0.3 + 0.7 * p;
        T(x, String(i + 1), RX + 14, Y, 11, PAL.muted, 500, 'left', MONO);
        T(x, r.txt, RX + 32, Y, 12.5, PAL.ink, 500);
        T(x, String(Math.round(r.w)), COL.w, Y, 12, r.over ? PAL.accent : PAL.ink, r.over ? 700 : 500, 'right', MONO);
        T(x, r.cps.toFixed(1), COL.v, Y, 12, r.cps > 12 ? PAL.accent : PAL.accent2, 700, 'right', MONO);
        x.globalAlpha = 1;
      });
    }
    // 시간표: 말과 자막 조각
    card(x, RX, 160, RW, 80);
    const TX = RX + 52, TW = RW - 66, tv = (v) => TX + (v / 4.6) * TW;
    T(x, '말과 자막이 놓인 시간', RX + 12, 177, 12, PAL.ink, 600);
    T(x, '말', RX + 14, 197, 11, PAL.muted, 500, 'left', MONO);
    T(x, '자막', RX + 14, 217, 11, PAL.muted, 500, 'left', MONO);
    const sp0 = S0, sp1 = S0 + P.total, rows = P.kind === 'chunks' ? P.rows : null;
    x.fillStyle = 'rgba(243,246,255,.1)'; x.fillRect(TX, 187, TW, 12); x.fillRect(TX, 207, TW, 12);
    const gp = E.outC(seg(tt, 0.1, 0.9));
    if (rows) rows.forEach((r, i) => {
      const col = i % 2 ? PAL.accent2 : PAL.accent;
      x.fillStyle = col; x.globalAlpha = 0.85; x.fillRect(tv(r.sp0), 187, Math.max(1, (tv(r.sp1) - tv(r.sp0) - 1.5) * gp), 12);
      x.globalAlpha = tt >= r.c0 && tt < r.c1 ? 1 : 0.55; x.fillRect(tv(r.c0), 207, Math.max(1, (tv(r.c1) - tv(r.c0) - 1.5) * gp), 12); x.globalAlpha = 1;
    }); else { x.fillStyle = PAL.accent2; x.globalAlpha = 0.85; x.fillRect(tv(sp0), 187, (tv(sp1) - tv(sp0)) * gp, 12); x.fillStyle = PAL.muted; x.globalAlpha = 0.6; x.fillRect(tv(S0), 207, (tv(sp1) - tv(S0)) * gp, 12); x.globalAlpha = 1; }
    [0, 1, 2, 3, 4].forEach((v) => { x.fillStyle = PAL.muted; x.fillRect(tv(v), 222, 1, 4); T(x, String(v), tv(v), 236, 10, PAL.muted, 500, 'center', MONO); });
    // 큰 숫자 둘: 읽는 속도, 시각 차
    T(x, '조각을 읽는 속도(자/초)', RX + 4, 266, 12, PAL.ink, 600);
    if (rows) T(x, `${P.lo.toFixed(1)} ~ ${P.hi.toFixed(1)}`, RX + 4, 300, 30, P.hi - P.lo < 0.05 ? PAL.accent2 : PAL.accent, 700, 'left', MONO);
    else T(x, '조각이 없어 잴 수 없다', RX + 4, 296, 12, PAL.muted, 500);
    T(x, '조각 시각과 말 시각의 차', RX + 204, 266, 12, PAL.ink, 600);
    if (rows) T(x, `최대 ${P.gapMax.toFixed(2)}초`, RX + 204, 300, 30, P.gapMax < 0.005 ? PAL.accent2 : PAL.accent, 700, 'left', MONO);
    else T(x, '말 시각을 모른다', RX + 204, 296, 12, PAL.muted, 500);
    T(x, `최대 ${MAX_WORDS}어절, 폭 ${MAX_W}px, 글자 ${SIZE}px. 노란 폭은 상자 초과`, RX + 4, 322, 10.5, PAL.muted, 500);
    T(x, '말 속도와 문장은 가정값이다', RX + 4, 340, 10.5, PAL.muted, 500);
    s.pill.textContent = `0${L}  ${STEP[L - 1]}`;
  },
};
export default demo;
