/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/explain-unit-five-steps/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 한 설명 단위를 시작 상태, 변화 원인, 변형, 결과, 정리 다섯 칸으로 짠다. 연출 전은 '65에서 75로 커지는 걸 보여 줘'라고만 시킨 결과(표시가 처음부터 한꺼번에).
// 대사 구절의 시각은 이 데모가 가정한 값이고, 도착 오차와 선공개 수는 아래 데이터에서 코드가 센다. 화면은 시간 t 의 함수다.
const FROM_INCH = 65;          // 시작 화면 크기(인치)
const TO_INCH = 85;            // 도착 화면 크기(인치)
const SHELF_CM = 200;          // 거실장 폭(cm). 축척의 기준이라 단위 안에서 바뀌지 않는다
const MOVE_DUR = 1.1;          // 변형(커지기)에 걸리는 시간(초)
const CLEAN_DUR = 1.0;         // 정리(표시 지우기)에 걸리는 시간(초)
const KEY_TOL = 0.2;           // 도착이 핵심 낱말 끝에서 벗어나도 되는 시간(초) [기록: 제작 목표]
const DUR = 7.2;

const PAL = { bg0: '#1b0e17', bg1: '#2b1424', ink: '#f6e9ee', muted: '#b095a3', accent: '#ff7aa8', accent2: '#ffd0a0', surface: '#26121f', line: 'rgba(246,233,238,.16)' };
const GOOD = '#8fe0b2', MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif', HAN = '"Black Han Sans", sans-serif';
const FW = 320, FH = 180, FS = 1.125, FX = 42, FY = 52;
const PXCM = 160 / SHELF_CM, SHELF_TOP = 122, BASE = SHELF_TOP - 4, CX = FW / 2;
const cm = (d) => d * 2.54 * 16 / Math.hypot(16, 9);
const DW = Math.round(cm(TO_INCH) - cm(FROM_INCH)), DPCT = Math.round(((TO_INCH / FROM_INCH) ** 2 - 1) * 100), DIN = TO_INCH - FROM_INCH;

// 대사: 구절 시작 t0, 핵심 낱말이 끝나는 시각 key(도착 목표). 줄바꿈은 시각표 안에 넣으려는 것
const SAY = [
  { name: '시작 상태', say: `벽 가운데\n${FROM_INCH}인치 TV가 있고`, t0: 0.2, key: 1.3 },
  { name: '변화 원인', say: `대각선이\n${DIN}인치 늘어나면`, t0: 1.4, key: 2.4 },
  { name: '변형', say: `화면이\n${TO_INCH}인치로 커져서`, t0: 2.5, key: 3.6 },
  { name: '결과', say: `폭은 ${DW}cm,\n면적은 ${DPCT}% 늘고`, t0: 3.7, key: 5.0 },
  { name: '정리', say: `다음은\n시야각입니다`, t0: 5.1, key: 6.2 },
];
const G0 = SAY[2].t0, C0 = SAY[4].t0, W_AT = 4.3;   // 커지기 시작, 정리 시작, 폭 숫자를 붙이는 시각
// 도착 시각: 연출 후는 모델에서, 연출 전은 한꺼번에 띄우고 한 번 바꾼 값
const ARR_AFTER = [SAY[0].key, SAY[1].key, G0 + MOVE_DUR, SAY[3].key, C0 + CLEAN_DUR];
const ARR_BEFORE = [0, 0, G0, 0, Infinity];
const START_AFTER = [SAY[0].t0, SAY[1].t0, G0, SAY[3].t0, C0], START_BEFORE = [0, 0, G0, 0, 0];
const NUM_AT_AFTER = [SAY[1].key, W_AT, SAY[3].key], NUM_AT_BEFORE = [0, 0, 0];   // 숫자 글자(+10인치, 폭, 면적)가 뜨는 시각
const NUM_STEP = [1, 3, 3];                                                       // 위 숫자가 속한 대사 칸
const TAGS = ['여섯 단어 전부', '시작과 원인', '대상이 변형', '도착한 뒤 숫자', '정리와 읽는 정지'];
const reach = (L) => [0, 2, 3, 4, 5][L];                                          // 단계별로 보이는 칸 수

function rr(x, X, Y, W, H, r) { x.beginPath(); x.roundRect(X, Y, W, H, Math.max(0, Math.min(r, W / 2, H / 2))); }
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.textBaseline = 'alphabetic'; x.fillText(s, X, Y); }
function layers(x, X, Y, W, H, r, fill, steps) {
  steps.forEach(([dy, g, a]) => { x.fillStyle = `rgba(0,0,0,${a})`; rr(x, X - g, Y + dy - g, W + 2 * g, H + 2 * g, r + g); x.fill(); });
  x.fillStyle = fill; rr(x, X, Y, W, H, r); x.fill();
}
function room(x) {
  const w = x.createLinearGradient(0, 0, 0, FH); w.addColorStop(0, '#33243a'); w.addColorStop(1, '#241829'); x.fillStyle = w; x.fillRect(0, 0, FW, FH);
  const f = x.createLinearGradient(0, SHELF_TOP + 16, 0, FH); f.addColorStop(0, '#1b1119'); f.addColorStop(1, '#140c12'); x.fillStyle = f; x.fillRect(0, SHELF_TOP + 16, FW, FH);
  const sw = SHELF_CM * PXCM, sx = CX - sw / 2;
  [[9, 7, 0.05], [5, 4, 0.09], [2, 1.5, 0.16]].forEach(([dy, g, a]) => { x.fillStyle = `rgba(0,0,0,${a})`; rr(x, sx - g, SHELF_TOP + 8 + dy - g, sw + 2 * g, 8 + g, 3); x.fill(); });
  const bd = x.createLinearGradient(0, SHELF_TOP, 0, SHELF_TOP + 16); bd.addColorStop(0, '#a78560'); bd.addColorStop(0.18, '#74583b'); bd.addColorStop(1, '#4c3a27');
  x.fillStyle = bd; rr(x, sx, SHELF_TOP, sw, 16, 2); x.fill(); x.fillStyle = 'rgba(255,255,255,.22)'; x.fillRect(sx + 1, SHELF_TOP, sw - 2, 1);
}
function tv(x, w, h) {
  const top = BASE - 4 - h;
  [[7, 6, 0.05], [4, 3, 0.09], [2, 1, 0.16]].forEach(([dy, g, al]) => { x.fillStyle = `rgba(0,0,0,${al})`; rr(x, CX - w / 2 - g, BASE - 4 + dy - g, w + 2 * g, 5 + g, 2); x.fill(); });
  x.fillStyle = '#2a2830'; rr(x, CX - 14, BASE - 8, 28, 4, 1); x.fill(); x.fillStyle = '#383640'; x.fillRect(CX - 4, BASE - 12, 8, 6);
  const bz = x.createLinearGradient(0, top, 0, top + h); bz.addColorStop(0, '#2e2c35'); bz.addColorStop(1, '#0d0c10'); x.fillStyle = bz; rr(x, CX - w / 2, top, w, h, 2); x.fill();
  const sg = x.createLinearGradient(CX - w / 2, top, CX + w / 2, top + h); sg.addColorStop(0, '#6a7fa8'); sg.addColorStop(0.55, '#33466a'); sg.addColorStop(1, '#1a2132');
  x.fillStyle = sg; rr(x, CX - w / 2 + 2, top + 2, w - 4, h - 4, 1); x.fill();
  const hz = x.createLinearGradient(0, top + h * 0.55, 0, top + h); hz.addColorStop(0, 'rgba(255,196,140,0)'); hz.addColorStop(1, 'rgba(255,196,140,.30)'); x.fillStyle = hz; x.fillRect(CX - w / 2 + 2, top + h * 0.55, w - 4, h * 0.45 - 2);
  x.save(); x.beginPath(); x.rect(CX - w / 2 + 2, top + 2, w - 4, h - 4); x.clip(); x.fillStyle = 'rgba(255,255,255,.10)';
  x.beginPath(); x.moveTo(CX - w / 2, top); x.lineTo(CX - w / 2 + w * 0.42, top); x.lineTo(CX - w / 2 + w * 0.18, top + h); x.lineTo(CX - w / 2, top + h); x.fill(); x.restore();
}
function chip(x, s, X, Y, al) {   // 표시 글자: 어두운 반투명 바탕 위에 호박색
  x.save(); x.globalAlpha = al; x.font = `700 9px ${MONO}`; const tw = x.measureText(s).width;
  x.fillStyle = 'rgba(20,10,18,.82)'; rr(x, X - 3, Y - 10, tw + 6, 13, 2); x.fill(); T(x, s, X, Y, 9, PAL.accent2, 700, 'left', MONO); x.restore();
}

function scene(x, t, L, after) {   // 장면 좌표 320x180
  room(x);
  const w65 = cm(FROM_INCH) * PXCM, h65 = w65 * 9 / 16, w75 = cm(TO_INCH) * PXCM, h75 = w75 * 9 / 16;
  const top65 = BASE - 4 - h65, ex = DIN * 2.54 * PXCM;
  const k = after ? E.inOutC(seg(t, G0, G0 + MOVE_DUR)) : (t >= G0 ? 1 : 0), w = lerp(w65, w75, k), h = lerp(h65, h75, k), top = BASE - 4 - h;
  const R = reach(L), all = !after, cl = after && R >= 5 ? E.inOutC(seg(t, C0, C0 + CLEAN_DUR)) : 0, vis = 1 - cl;
  const show = (i) => all || R >= i;                      // i 번째 칸이 이 단계에서 보이는가(1부터)
  const sx = CX - SHELF_CM * PXCM / 2, ex1 = CX + SHELF_CM * PXCM / 2;
  if (after && show(1)) {   // 시작 상태: 기준선(거실장 200cm)과 가운데 축
    const a = E.outC(seg(t, SAY[0].t0, SAY[0].key));
    x.save(); x.globalAlpha = a; x.strokeStyle = PAL.accent2; x.lineWidth = 1;
    x.beginPath(); x.moveTo(sx, SHELF_TOP + 22); x.lineTo(ex1, SHELF_TOP + 22); x.moveTo(sx, SHELF_TOP + 19); x.lineTo(sx, SHELF_TOP + 25); x.moveTo(ex1, SHELF_TOP + 19); x.lineTo(ex1, SHELF_TOP + 25); x.stroke();
    x.setLineDash([2, 3]); x.beginPath(); x.moveTo(CX, 8); x.lineTo(CX, SHELF_TOP); x.stroke(); x.restore(); chip(x, `거실장 ${SHELF_CM}cm`, CX + 6, SHELF_TOP + 36, a);
  }
  if (all || (after && show(1))) {   // 연출 후는 65 가 천천히 들어온다
    const a0 = after ? E.outC(seg(t, SAY[0].t0, SAY[0].key)) : 1; x.save(); x.globalAlpha = a0; tv(x, w, h); x.restore();
  } else tv(x, w, h);
  if ((all || show(3)) && (all ? true : t >= G0 + 0.05)) {   // 이전 윤곽은 남긴다
    x.save(); x.globalAlpha = vis * (all ? 1 : 0.85); x.strokeStyle = 'rgba(246,233,238,.8)'; x.setLineDash([3, 2]); x.lineWidth = 1; x.strokeRect(CX - w65 / 2 + 0.5, top65 + 0.5, w65 - 1, h65 - 1); x.restore();
  }
  if ((all || show(4)) && (all || t >= SAY[3].t0)) {   // 결과: 늘어난 면적을 한 번 채운다
    const a = all ? 0.28 : 0.36 * E.outC(seg(t, SAY[3].t0, SAY[3].t0 + 0.4)) * vis;
    x.save(); x.globalAlpha = a; x.fillStyle = PAL.accent; x.beginPath(); x.rect(CX - w / 2, top, w, h); x.rect(CX - w65 / 2, top65, w65, h65); x.fill('evenodd'); x.restore();
  }
  if (all || show(2)) {   // 변화 원인: 대각선이 자라고 끝에 늘어난 인치가 붙는다
    const p = all ? 1 : E.inOutC(seg(t, SAY[1].t0, SAY[1].key)), ux = w65, uy = -h65, dl = Math.hypot(ux, uy), ax = CX - w65 / 2, ay = top65 + h65;
    const tx = ax + (ux + ex * ux / dl) * p, ty = ay + (uy + ex * uy / dl) * p;
    x.save(); x.globalAlpha = vis; x.strokeStyle = PAL.accent2; x.lineWidth = 1.4; x.beginPath(); x.moveTo(ax, ay); x.lineTo(tx, ty); x.stroke();
    if (p > 0.05) { const an = Math.atan2(ty - ay, tx - ax); x.fillStyle = PAL.accent2; x.beginPath(); x.moveTo(tx, ty); x.lineTo(tx - 6 * Math.cos(an - 0.4), ty - 6 * Math.sin(an - 0.4)); x.lineTo(tx - 6 * Math.cos(an + 0.4), ty - 6 * Math.sin(an + 0.4)); x.fill(); }
    x.restore();
    const na = all ? 1 : E.outC(seg(t, NUM_AT_AFTER[0], NUM_AT_AFTER[0] + 0.3)); if (na > 0) chip(x, `+${DIN}인치`, ax + ux + ex * ux / dl + 6, ty - 4, na * vis);
  }
  if (all || show(4)) {   // 숫자는 해당 대사에서 붙는다
    const wa = all ? 1 : E.outC(seg(t, W_AT, W_AT + 0.3)), aa = all ? 1 : E.outC(seg(t, SAY[3].key, SAY[3].key + 0.3)), dy = Math.max(15, top - 9);
    if (wa > 0) { x.save(); x.globalAlpha = wa * vis; x.strokeStyle = PAL.accent2; x.lineWidth = 1; x.beginPath(); x.moveTo(CX - w / 2, dy); x.lineTo(CX + w / 2, dy); x.moveTo(CX - w / 2, dy - 3); x.lineTo(CX - w / 2, dy + 3); x.moveTo(CX + w / 2, dy - 3); x.lineTo(CX + w / 2, dy + 3); x.stroke(); x.restore(); x.save(); x.font = `700 9px ${MONO}`; const lw = x.measureText(`폭 +${DW}cm`).width; x.restore(); chip(x, `폭 +${DW}cm`, CX - lw / 2, dy - 3, wa * vis); }
    if (aa > 0) chip(x, `면적 +${DPCT}%`, CX - w / 2 + 6, top + 16, aa * vis);
  }
}

function modelRows(after, L) {   // 시각표의 칸별 시작, 도착, 오차
  const arr = after ? ARR_AFTER : ARR_BEFORE, st = after ? START_AFTER : START_BEFORE, R = after ? reach(L) : 5;
  return SAY.map((s, i) => ({ s, i, on: i < R, st: st[i], arr: arr[i], err: arr[i] - s.key }));
}
function early(after, L) {       // 말보다 먼저 보인 숫자 글자 수
  const at = after ? NUM_AT_AFTER : NUM_AT_BEFORE, R = after ? reach(L) : 5;
  return at.filter((v, i) => NUM_STEP[i] <= R && v < SAY[NUM_STEP[i] - 1].t0 - 0.001).length;
}

let GRAIN = null;
const demo = {
  dur: DUR, rest: DUR, noCompare: false, levels: 4,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(43), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const lab = el('div', null, sp);   // 이름표(vertical): 왼쪽 가장자리 세로쓰기, 지금 칸만 밝게
    Object.assign(lab.style, { position: 'absolute', left: '8px', top: '10px', zIndex: '4', writingMode: 'vertical-rl', font: "500 12px/1 'IBM Plex Sans KR',sans-serif", letterSpacing: '0.16em', whiteSpace: 'nowrap', display: 'flex', gap: '12px', flexDirection: 'row' });
    const items = SAY.map((s) => { const e = el('span', null, lab); e.textContent = s.name; return e; });
    return { main, items };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 0 : (lv == null ? 4 : lv), after = !!a, x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.setLineDash([]);
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'screen'; x.globalAlpha = 0.05;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();
    const fw = FW * FS, fh = FH * FS;
    layers(x, FX, FY, fw, fh, 6, '#241829', [[8, 7, 0.14], [4, 3, 0.2], [1, 1, 0.3]]);
    x.save(); rr(x, FX, FY, fw, fh, 6); x.clip(); x.translate(FX, FY); x.scale(FS, FS); scene(x, t, L, after); x.restore();
    x.strokeStyle = PAL.line; x.lineWidth = 1; rr(x, FX + 0.5, FY + 0.5, fw - 1, fh - 1, 6); x.stroke();
    T(x, after ? '같은 설명 한 단위, 대사 구절마다 한 칸' : '막연하게 시킨 결과: 표시가 처음부터 전부', FX, FY - 8, 10.5, PAL.muted, 500, 'left', MONO);
    // 오른쪽: 칸별 말과 도착
    const RX = 424, RW = 196, rows = modelRows(after, L);
    layers(x, RX, FY, RW, 154, 6, PAL.surface, [[2, 1, 0.2]]); x.strokeStyle = PAL.line; rr(x, RX + 0.5, FY + 0.5, RW - 1, 153, 6); x.stroke();
    T(x, '칸', RX + 10, FY + 16, 10, PAL.muted, 600); T(x, '말 끝', RX + 100, FY + 16, 10, PAL.muted, 600, 'right', MONO); T(x, '도착', RX + 136, FY + 16, 10, PAL.muted, 600, 'right', MONO); T(x, '오차', RX + RW - 10, FY + 16, 10, PAL.muted, 600, 'right', MONO);
    rows.forEach((r2, i) => {
      const Y = FY + 38 + i * 26, cur = r2.on, ok = Math.abs(r2.err) <= KEY_TOL, col = !cur ? PAL.muted : ok ? GOOD : PAL.accent;
      x.fillStyle = PAL.line; x.fillRect(RX + 8, Y - 17, RW - 16, 1);
      T(x, r2.s.name, RX + 10, Y, 11, cur ? PAL.ink : PAL.muted, 600);
      T(x, r2.s.key.toFixed(1), RX + 100, Y, 10.5, PAL.muted, 500, 'right', MONO);
      T(x, !cur ? '—' : Number.isFinite(r2.arr) ? r2.arr.toFixed(1) : '없음', RX + 136, Y, 10.5, col, 600, 'right', MONO);
      T(x, !cur ? '' : Number.isFinite(r2.arr) ? `${r2.err >= 0 ? '+' : ''}${r2.err.toFixed(1)}` : '', RX + RW - 10, Y, 10.5, col, 700, 'right', MONO);
    });
    const early_n = early(after, L), ear = early_n > 0;
    T(x, `허용 ±${KEY_TOL}초 [기록 목표]`, RX, FY + 172, 10, PAL.muted, 500, 'left', MONO);
    T(x, `말보다 먼저 뜬 숫자 ${early_n}개`, RX, FY + 188, 11, ear ? PAL.accent : GOOD, 700);
    // 아래: 대사 구절 시각표와 동작 막대
    const AX = 42, AW = 576, PX = AW / DUR, BY = 276;
    SAY.forEach((s2, i) => {
      const X0 = AX + s2.t0 * PX, W0 = (s2.key - s2.t0) * PX;
      x.fillStyle = i % 2 ? 'rgba(255,122,168,.20)' : 'rgba(255,208,160,.16)'; rr(x, X0, BY, W0 - 1, 30, 3); x.fill();
      s2.say.split('\n').forEach((ln, j) => T(x, ln, X0 + W0 / 2, BY + 12 + j * 11, 9.5, PAL.ink, 500, 'center'));
    });
    rows.forEach((r2, i) => {
      if (!r2.on) return; const yb = BY + 38 + i * 6, ok = Math.abs(r2.err) <= KEY_TOL, col = ok ? GOOD : PAL.accent, x0 = AX + r2.st * PX, x1 = AX + Math.min(r2.arr, DUR) * PX;
      x.fillStyle = 'rgba(246,233,238,.28)'; rr(x, x0, yb, Math.max(2, x1 - x0), 3, 1.5); x.fill();
      if (Number.isFinite(r2.arr)) { x.fillStyle = col; x.beginPath(); x.moveTo(x1, yb - 2); x.lineTo(x1 + 3.5, yb + 1.5); x.lineTo(x1, yb + 5); x.lineTo(x1 - 3.5, yb + 1.5); x.fill(); }
      x.fillStyle = PAL.ink; x.fillRect(AX + SAY[i].key * PX - 0.5, yb - 1, 1, 5);
    });
    for (let sec = 0; sec <= 7; sec++) T(x, `${sec}`, AX + sec * PX, 346, 9.5, PAL.muted, 500, 'center', MONO);
    T(x, '초', AX + DUR * PX + 6, 346, 9.5, PAL.muted, 500, 'left', MONO);
    x.fillStyle = PAL.accent; x.fillRect(AX + Math.min(t, DUR) * PX - 0.75, BY - 6, 1.5, 62);
    const cur = SAY.reduce((p, s2, i) => (t >= s2.t0 ? i : p), -1);
    s.items.forEach((e, i) => { e.style.color = i === cur ? PAL.ink : PAL.muted; e.style.fontWeight = i === cur ? '700' : '500'; });
  },
};
export default demo;
