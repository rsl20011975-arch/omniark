/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/explainer-slide-trap/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 같은 6초 설명을 두 방식으로 그린다. 연출 전은 제목과 카드와 자막만 바뀌는 해설 슬라이드(위에 장식 움직임만 얹음),
// 단계가 오를수록 설명 대상(TV)이 직접 커진다. 오른쪽 숫자 넷은 전부 이 장면에서 코드가 센다. 화면은 시간 t 의 함수다.
const FROM_INCH = 65;          // 시작 화면 크기(인치)
const TO_INCH = 85;            // 도착 화면 크기(인치)
const GROW_T = 1.0;            // 커지기 시작하는 시각(초)
const GROW_DUR = 1.8;          // 커지는 데 걸리는 시간(초)
const SHELF_CM = 150;          // 거실장 폭(cm). 이 폭이 화면 200px 와 같은 축척의 기준이다
const SWEEP_EVERY = 2.0;       // 연출 전의 빛 줄기가 지나가는 간격(초)
const ZOOM_MAX = 1.04;         // 연출 전의 전체 화면 확대 끝값
const STILL_BELOW = 0.5;       // 이웃 프레임 차이가 이 값 미만이면 저변화로 센다
const TOTAL_S = 443;           // 한 편의 길이(초): 7분 23초 [기록]
const SLIDE_LIMIT = 20;        // 해설 슬라이드형 구간 허용 비율(%) [추정]

const PAL = { bg0: '#f2f2f0', bg1: '#e4e4e1', ink: '#111111', muted: '#666666', accent: '#ff3b1f', accent2: '#111111', surface: '#ffffff', line: 'rgba(17,17,17,.16)' };
const BAD = '#b3200a', GOOD = '#14683d', MUTED2 = '#555553';   // 작은 글자용 짙은 색(바탕 대비 5 이상)
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif', HAN = '"Black Han Sans", sans-serif';
const FW = 320, FH = 180, FS = 1.25, FX = 20, FY = 56;   // 영상 틀의 장면 좌표(320x180)와 무대 배율
const MW = 64, MH = 36, MFPS = 10, MSEC = 6;            // 프레임 차 자: 가로 64px 회색, 초당 10장, 6초 창
const PXCM = 160 / SHELF_CM, SHELF_TOP = 122;
const SUBS = ['65인치와 85인치는 20인치 차이인데', '화면 면적은 약 71% 커집니다', '그래서 인치 숫자만 보고 주문하면'];
const STRIP = {   // 한 편의 구간표(초, 종류). 합계 비율만 기록값이고 칸 위치는 예시다
  before: [['obj', 20], ['slide', 340], ['obj', 60], ['slide', 20], ['obj', 3]],
  after: [['obj', 40], ['slide', 15], ['obj', 70], ['slide', 12], ['obj', 85], ['slide', 18], ['obj', 90], ['slide', 14], ['obj', 74], ['slide', 12], ['obj', 13]],
};
const TAGS = ['제목 + 카드 + 자막', '대상이 주인공', '대상이 직접 커진다', '도착한 뒤에 숫자', '글자 없이도 읽히나'];

const cm = (d) => d * 2.54 * 16 / Math.hypot(16, 9);
const sumBy = (arr, k) => arr.filter((s) => s[0] === k).reduce((p, s) => p + s[1], 0);
const sharePct = (arr) => 100 * sumBy(arr, 'slide') / arr.reduce((p, s) => p + s[1], 0);
function sizeAt(t, L) {          // 시각 t 의 화면 크기. L 이 2 보다 작으면 커지지 않는다
  const k = L >= 2 ? E.inOutC(seg(t, GROW_T, GROW_T + GROW_DUR)) : 0;
  const d = lerp(FROM_INCH, TO_INCH, k), w = cm(d) * PXCM;
  return { d, k, w, h: w * 9 / 16 };
}
function qtyChanged(L) {         // 6초 동안 값이 달라진 설명 항목(대각선, 폭, 면적) 수
  if (L === 0) return 0;
  const a = sizeAt(0, L), b = sizeAt(MSEC, L);
  return [[a.d, b.d], [a.w, b.w], [a.w * a.h, b.w * b.h]].filter(([p, q]) => Math.abs(q - p) / p > 0.02).length;
}
function newArea(L) {            // 글자 없이도 보이는 변화: 새로 덮인 화면 면적(틀 대비 %)
  if (L === 0) return 0;
  const a = sizeAt(0, L), b = sizeAt(MSEC, L);
  return Math.max(0, 100 * (b.w * b.h - a.w * a.h) / (FW * FH));
}

function rr(x, X, Y, W, H, r) { x.beginPath(); x.roundRect(X, Y, W, H, Math.max(0, Math.min(r, W / 2, H / 2))); }
let TXT = true;   // 프레임 차를 잴 때는 글자를 그리지 않는다(글꼴이 준비됐는지에 따라 값이 흔들리지 않게)
function T(x, s, X, Y, size, col, w, al, font) { if (!TXT) return; x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.textBaseline = 'alphabetic'; x.fillText(s, X, Y); }
function layers(x, X, Y, W, H, r, fill, steps) {   // 겹쳐 그린 반투명 사각형 그림자(shadowBlur 는 쓰지 않는다)
  steps.forEach(([dy, g, a]) => { x.fillStyle = `rgba(17,17,17,${a})`; rr(x, X - g, Y + dy - g, W + 2 * g, H + 2 * g, r + g); x.fill(); });
  x.fillStyle = fill; rr(x, X, Y, W, H, r); x.fill();
}

function tv(x, cx, base, w, h, a) {   // 광원 위쪽, 베젤과 화면과 유리 반사와 받침
  x.save(); x.globalAlpha = a;
  [[7, 6, 0.05], [4, 3, 0.09], [2, 1, 0.16]].forEach(([dy, g, al]) => { x.fillStyle = `rgba(0,0,0,${al})`; rr(x, cx - w / 2 - g, base - 4 + dy - g, w + 2 * g, 5 + g, 2); x.fill(); });
  x.fillStyle = '#25272c'; rr(x, cx - 14, base - 8, 28, 4, 1); x.fill();
  x.fillStyle = '#34363c'; x.fillRect(cx - 4, base - 12, 8, 6);
  const top = base - 4 - h, bz = x.createLinearGradient(0, top, 0, top + h); bz.addColorStop(0, '#2c2e34'); bz.addColorStop(1, '#0c0d10');
  x.fillStyle = bz; rr(x, cx - w / 2, top, w, h, 2); x.fill();
  const sg = x.createLinearGradient(cx - w / 2, top, cx + w / 2, top + h); sg.addColorStop(0, '#5e7aa3'); sg.addColorStop(0.55, '#2c4263'); sg.addColorStop(1, '#17212f');
  x.fillStyle = sg; rr(x, cx - w / 2 + 2, top + 2, w - 4, h - 4, 1); x.fill();
  const hz = x.createLinearGradient(0, top + h * 0.55, 0, top + h); hz.addColorStop(0, 'rgba(255,196,140,0)'); hz.addColorStop(1, 'rgba(255,196,140,.32)');
  x.fillStyle = hz; x.fillRect(cx - w / 2 + 2, top + h * 0.55, w - 4, h * 0.45 - 2);
  x.save(); x.beginPath(); x.rect(cx - w / 2 + 2, top + 2, w - 4, h - 4); x.clip();
  x.fillStyle = 'rgba(255,255,255,.10)'; x.beginPath(); x.moveTo(cx - w / 2, top); x.lineTo(cx - w / 2 + w * 0.42, top); x.lineTo(cx - w / 2 + w * 0.18, top + h); x.lineTo(cx - w / 2, top + h); x.fill();
  x.restore(); x.restore();
}

function slide(x, t, withDeco) {  // 해설 슬라이드: 제목, 카드 셋, 하단 자막
  const bg = x.createLinearGradient(0, 0, 0, FH); bg.addColorStop(0, '#1b1d22'); bg.addColorStop(1, '#272a31'); x.fillStyle = bg; x.fillRect(0, 0, FW, FH);
  T(x, '화면 크기, 이렇게 고르세요', 18, 30, 15, '#f1f1ee', 700); x.fillStyle = PAL.accent; x.fillRect(18, 37, 28, 2);
  ['55인치', '65인치', '85인치'].forEach((s, i) => {
    const X = 18 + i * 98;
    layers(x, X, 52, 90, 74, 5, '#30343c', [[3, 2, 0.12], [1, 0.5, 0.22]]);
    T(x, s, X + 8, 70, 11, '#f1f1ee', 700);
    [70, 56, 62].forEach((bw, r) => { x.fillStyle = 'rgba(241,241,238,.30)'; rr(x, X + 8, 80 + r * 11, bw, 5, 2); x.fill(); });
  });
  if (withDeco) {   // 장식 움직임: 빛 줄기. 설명하는 값은 바뀌지 않는다
    const p = (t % SWEEP_EVERY) / SWEEP_EVERY, sx = lerp(-70, FW + 30, E.inOutC(p));
    const sg = x.createLinearGradient(sx - 30, 0, sx + 30, 0); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(0.5, 'rgba(255,255,255,.55)'); sg.addColorStop(1, 'rgba(255,255,255,0)');
    x.save(); x.globalAlpha = 0.16; x.fillStyle = sg; x.beginPath(); x.moveTo(sx - 36, 0); x.lineTo(sx + 44, 0); x.lineTo(sx + 14, FH); x.lineTo(sx - 66, FH); x.fill(); x.restore();
  }
}
function room(x) {
  const w = x.createLinearGradient(0, 0, 0, FH); w.addColorStop(0, '#2c2e34'); w.addColorStop(1, '#202228'); x.fillStyle = w; x.fillRect(0, 0, FW, FH);
  const f = x.createLinearGradient(0, SHELF_TOP + 16, 0, FH); f.addColorStop(0, '#1b1c20'); f.addColorStop(1, '#141519'); x.fillStyle = f; x.fillRect(0, SHELF_TOP + 16, FW, FH);
  const sw = SHELF_CM * PXCM, sx = FW / 2 - sw / 2;
  [[9, 7, 0.05], [5, 4, 0.09], [2, 1.5, 0.16]].forEach(([dy, g, a]) => { x.fillStyle = `rgba(0,0,0,${a})`; rr(x, sx - g, SHELF_TOP + 8 + dy - g, sw + 2 * g, 8 + g, 3); x.fill(); });
  const bd = x.createLinearGradient(0, SHELF_TOP, 0, SHELF_TOP + 16); bd.addColorStop(0, '#9a7a58'); bd.addColorStop(0.18, '#6f5539'); bd.addColorStop(1, '#4a3825');
  x.fillStyle = bd; rr(x, sx, SHELF_TOP, sw, 16, 2); x.fill();
  x.fillStyle = 'rgba(255,255,255,.22)'; x.fillRect(sx + 1, SHELF_TOP, sw - 2, 1);
}
function dimLine(x, x0, x1, y, label, a) {
  x.save(); x.globalAlpha = a; x.strokeStyle = PAL.accent; x.fillStyle = PAL.accent; x.lineWidth = 1;
  x.beginPath(); x.moveTo(x0, y); x.lineTo(x1, y); x.moveTo(x0, y - 3); x.lineTo(x0, y + 3); x.moveTo(x1, y - 3); x.lineTo(x1, y + 3); x.stroke();
  x.font = `700 10px ${MONO}`; const tw = TXT ? x.measureText(label).width : 60; x.fillStyle = 'rgba(27,29,34,.82)'; rr(x, (x0 + x1) / 2 - tw / 2 - 3, y - 16, tw + 6, 13, 2); x.fill();
  T(x, label, (x0 + x1) / 2, y - 6, 10, '#ff9a86', 700, 'center', MONO); x.restore();
}
function scene(x, t, L, full) {    // 장면 좌표 320x180 에 그린다. 바깥에서 배율과 클립을 건다
  if (L === 0) {
    const z = lerp(1, ZOOM_MAX, E.inOutC(seg(t, 0, MSEC)));   // 장식: 전체 화면이 천천히 커진다
    x.save(); x.translate(FW / 2, FH / 2); x.scale(z, z); x.translate(-FW / 2, -FH / 2); slide(x, t, true); x.restore();
  } else {
    room(x);
    const s = sizeAt(t, L), cx = FW / 2, base = SHELF_TOP - 4, a0 = sizeAt(0, L);
    const fromW = cm(FROM_INCH) * PXCM, fromH = fromW * 9 / 16, top0 = base - 4 - fromH;
    const arrive = GROW_T + GROW_DUR, pop = L >= 3 ? E.outC(seg(t, arrive, arrive + 0.4)) : 0;
    tv(x, cx, base, s.w, s.h, 1);
    if (L >= 2) {   // 이전 윤곽은 남기고, 늘어난 면적만 한 번 채운다
      x.save(); x.fillStyle = PAL.accent; x.globalAlpha = 0.34 * pop * (1 - 0.35 * E.outC(seg(t, arrive + 0.4, arrive + 1.2)));
      x.beginPath(); x.rect(cx - s.w / 2, base - 4 - s.h, s.w, s.h); x.rect(cx - fromW / 2, top0, fromW, fromH); x.fill('evenodd'); x.restore();
    }
    if (L >= 2 && s.k > 0.02) { x.save(); x.strokeStyle = 'rgba(241,241,238,.75)'; x.setLineDash([3, 2]); x.lineWidth = 1; x.strokeRect(cx - fromW / 2 + 0.5, top0 + 0.5, fromW - 1, fromH - 1); x.restore(); }
    if (L >= 3 && pop > 0) {
      const top = base - 4 - s.h; dimLine(x, cx - s.w / 2, cx + s.w / 2, Math.max(19, top - 8), `폭 ${Math.round(cm(FROM_INCH))} → ${Math.round(cm(TO_INCH))}cm`, pop);
      x.save(); x.globalAlpha = pop; T(x, `면적 ×${((TO_INCH / FROM_INCH) ** 2).toFixed(2)}`, cx - s.w / 2 + 6, Math.max(top + 14, 36), 10, '#ffd9d2', 700, 'left', MONO); x.restore();
    }
  }
  const sub = SUBS[Math.floor(t / 2) % SUBS.length];   // 자막은 어느 방식에서나 같다
  x.fillStyle = 'rgba(0,0,0,.58)'; rr(x, 18, 148, 284, 22, 4); x.fill(); T(x, sub, FW / 2, 163, 10, '#f6f6f3', 500, 'center');
}

function gray(d, i) { return (d[i] * 299 + d[i + 1] * 587 + d[i + 2] * 114) / 1000; }
function measure(L, mc) {          // 10fps, 가로 64px 회색, 6초 창에서 이웃 프레임의 평균 차이
  const x = mc.getContext('2d', { willReadFrequently: true }), n = MFPS * MSEC, diffs = []; let prev = null; TXT = false;
  for (let f = 0; f < n; f++) {
    x.setTransform(MW / FW, 0, 0, MH / FH, 0, 0); x.globalAlpha = 1; x.setLineDash([]); scene(x, f / MFPS, L, false);
    const d = x.getImageData(0, 0, MW, MH).data, g = new Float32Array(MW * MH);
    for (let i = 0; i < g.length; i++) g[i] = gray(d, i * 4);
    if (prev) { let s = 0; for (let i = 0; i < g.length; i++) s += Math.abs(g[i] - prev[i]); diffs.push(s / g.length); }
    prev = g;
  }
  TXT = true;
  return { mean: diffs.reduce((p, q) => p + q, 0) / diffs.length, low: 100 * diffs.filter((v) => v < STILL_BELOW).length / diffs.length };
}

let GRAIN = null;
const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 4,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(41), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const mc = document.createElement('canvas'); mc.width = MW; mc.height = MH;
    const M = [0, 1, 2, 3, 4].map((L) => measure(Math.min(L, 3), mc));   // 4단계의 영상 틀은 3단계와 같다
    const tag = el('div', null, sp);   // 이름표(tag-tr): 오른쪽 위, 직각에 가까운 모서리, 왼쪽 3px 강조 줄
    Object.assign(tag.style, { position: 'absolute', right: '14px', top: '12px', zIndex: '4', padding: '.4em .8em .4em .7em', borderRadius: '2px', borderLeft: `3px solid ${PAL.accent}`, background: PAL.surface, color: PAL.ink, font: "600 12px/1.2 'IBM Plex Sans KR',sans-serif", whiteSpace: 'nowrap', boxShadow: '0 1px 0 rgba(17,17,17,.14)' });
    return { main, tag, M };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 0 : (lv == null ? 4 : lv), x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.setLineDash([]);
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'multiply'; x.globalAlpha = 0.07;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();
    const fw = FW * FS, fh = FH * FS;
    layers(x, FX, FY, fw, fh, 6, '#1b1d22', [[8, 7, 0.04], [4, 3, 0.07], [1, 1, 0.12]]);
    x.save(); rr(x, FX, FY, fw, fh, 6); x.clip(); x.translate(FX, FY); x.scale(FS, FS); scene(x, t, L, true); x.restore();
    T(x, L === 0 ? '영상 한 장면(6초)  제목+카드+자막, 위에 장식 움직임' : '영상 한 장면(6초)  같은 자막, 바뀐 것은 화면', FX, FY - 8, 11, MUTED2, 500, 'left', MONO);
    // 오른쪽: 코드가 세는 숫자 넷(카드 없이 줄과 큰 숫자)
    const m = s.M[L], ch = qtyChanged(L), na = newArea(L), sh = sharePct(L >= 4 ? STRIP.after : STRIP.before);
    const RX = 442, RW = 178, rows = [
      ['프레임 차', m.mean.toFixed(2), `저변화 ${m.low.toFixed(0)}%`, PAL.ink],
      ['값이 달라진 설명 항목', `${ch}/3`, '대각선, 폭, 면적', ch === 3 ? GOOD : BAD],
      ['글자 없이 보이는 변화', `${na.toFixed(1)}%`, '새로 덮인 면적', na > 0 ? GOOD : BAD],
      ['해설 슬라이드형 구간', `${sh.toFixed(0)}%`, `허용 ${SLIDE_LIMIT}% 이하`, sh <= SLIDE_LIMIT ? GOOD : BAD],
    ];
    rows.forEach(([nm, val, note, col], i) => {
      const Y = FY + i * 56;
      x.fillStyle = PAL.line; x.fillRect(RX, Y, RW, 1);
      T(x, nm, RX, Y + 18, 12, MUTED2, 600); T(x, note, RX, Y + 46, 11, MUTED2, 500, 'left', MONO); T(x, val, RX + RW, Y + 48, 26, col, 400, 'right', HAN);
    });
    // 아래: 한 편의 구간표
    const SX = 20, SW = 600, SY = 310, k = L >= 4 ? E.inOutC(seg(t, 0.2, 1.4)) : 0;
    T(x, `한 편 ${TOTAL_S}초(7:23)의 구간표. 칸 위치는 예시이고 슬라이드형 합계만 기록값`, SX, SY - 9, 11, MUTED2, 500, 'left', MONO);
    [[STRIP.before, 1 - k], [STRIP.after, k]].forEach(([arr, al]) => {
      if (al <= 0.01) return; let p = SX; x.save(); x.globalAlpha = al;
      arr.forEach(([kind, sec]) => { const w = SW * sec / TOTAL_S; x.fillStyle = kind === 'slide' ? '#2a2c31' : PAL.accent; x.fillRect(p, SY, Math.max(0, w - 1), 22); p += w; });
      x.restore();
    });
    T(x, '0:00', SX, SY + 37, 10, MUTED2, 500, 'left', MONO); T(x, '7:23', SX + SW, SY + 37, 10, MUTED2, 500, 'right', MONO);
    layers(x, SX + 170, SY + 29, 10, 8, 2, '#2a2c31', []); T(x, '해설 슬라이드형', SX + 186, SY + 37, 10, PAL.ink, 500);
    layers(x, SX + 310, SY + 29, 10, 8, 2, PAL.accent, []); T(x, '대상이 직접 변하는 장면', SX + 326, SY + 37, 10, PAL.ink, 500);
    s.tag.textContent = TAGS[L];
  },
};
export default demo;
