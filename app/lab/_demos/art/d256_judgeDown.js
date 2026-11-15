/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/ai-image-vision-gate/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 같은 그림 6장을 채점 기준만 바꿔 가며 통과·탈락으로 가르는 장면이다. 그림은 코드로 그린 예시이고 AI 가 만든 것이 아니다.
// 점수는 이 화면이 정한 가상 채점 규칙이 계산한 값이다. 실제 비전 모델이 준 점수가 아니다. 화면은 시간 t 의 함수다.
const PASS = 70;         // 통과선(점)
const HARD_RULES = 4;    // 점수와 상관없이 바로 탈락시키는 사유의 수(1 테두리, 2 어수선함, 3 깨진 글자, 4 눈에 띄는 결함)
const JUDGE_DOWN = 1;    // 1이면 채점 장치가 답을 못 준 장면(심사 실패는 통과로 처리한다)
const PAL = { bg0: '#0b0f1a', bg1: '#161d30', ink: '#f4efe4', muted: '#8b94a3', accent: '#ffb36b', accent2: '#ffd27a', surface: '#131a2b', line: '#2a3350' };
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif';
const STEP = ['화풍을 못 박은 채점', '화풍은 채점에서 뺀다', '탈락 사유를 못 박는다', '사유를 한 문장으로 받는다'];
const STYLE = { water: '수채화풍', flat: '평면 벡터풍', pop: '팝아트풍' };
const RULES = ['border', 'chaotic', 'garble', 'glitch'];                 // 탈락 사유를 적어 둔 차례
const WHY = { border: '테두리가 보인다', chaotic: '빈 자리 없이 어수선하다', garble: '깨진 글자가 있다' };
const PEN = { border: 14, chaotic: 30, garble: 20, busy: 14 };           // 결함마다 깎는 점수
const IMGS = [
  { id: 'A', st: 'water', fl: [] }, { id: 'B', st: 'flat', fl: [] }, { id: 'C', st: 'pop', fl: [], soft: 'busy' },
  { id: 'D', st: 'water', fl: ['border'] }, { id: 'E', st: 'flat', fl: ['garble'] }, { id: 'F', st: 'water', fl: ['chaotic'] },
];
const CW = 172, CH = 100, AH = 50, GX = 14, GY = 14, X0 = 48, Y0 = 36;

function craft(img, j) { return Math.round(94 + j - img.fl.reduce((s, f) => s + PEN[f], 0) - (img.soft ? PEN[img.soft] : 0)); }   // 결함은 점수를 깎고, 조금 어수선한 것(soft)은 결함이 아니라 점수만 깎는다
function judge(img, L, j) {   // 단계마다 채점 규칙이 한 겹씩 늘어난다
  if (JUDGE_DOWN) return { score: -1, pass: true, why: '채점 실패, 통과 처리' };
  const c = craft(img, j), enforced = RULES.slice(0, HARD_RULES);
  if (L === 0) {   // 수채화 하나로 못 박은 기준: 다른 화풍은 화풍이 다르다는 이유로 0점
    const hard = img.st === 'water' && (img.fl.includes('border') || img.fl.includes('chaotic'));
    return { score: img.st === 'water' ? c : 0, pass: img.st === 'water' && c >= PASS && !hard, why: img.st === 'water' ? '' : '수채화가 아니다' };
  }
  const hit = L >= 2 ? img.fl.find((f) => enforced.includes(f)) : null;
  const pass = c >= PASS && !hit;
  return { score: c, pass, why: hit ? WHY[hit] : (c < PASS ? '점수가 통과선 아래다' : '사유 없음') };
}

let GRAIN = null;
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function rr(x, X, Y, W, H, R) { x.beginPath(); x.roundRect(X, Y, W, H, R); }
function blob(x, cx, cy, r, h, s, l, a) {   // 물감 번짐: 가장자리에 안료가 고이는 반투명 원을 여러 겹
  [[1, a], [0.7, a * 0.7], [0.4, a * 0.6]].forEach(([k, al]) => {
    const g = x.createRadialGradient(cx, cy, 0, cx, cy, r * k);
    g.addColorStop(0, `hsla(${h},${s}%,${l + 8}%,${al * 0.55})`); g.addColorStop(0.75, `hsla(${h},${s}%,${l}%,${al})`); g.addColorStop(1, `hsla(${h},${s}%,${l - 10}%,0)`);
    x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r * k, 0, 7); x.fill();
  });
}
function art(x, im, X, Y, W, H) {   // 그림 한 장을 코드로 그린다(시드가 정해져 늘 같은 그림)
  const r = rng(im.id.charCodeAt(0) * 7);
  x.save(); rr(x, X, Y, W, H, 6); x.clip();
  if (im.st === 'water') {
    x.fillStyle = '#f3ece0'; x.fillRect(X, Y, W, H);
    const n = im.fl.includes('chaotic') ? 15 : 5, hs = im.fl.includes('border') ? [200, 335, 40] : [172, 12, 38, 205];
    for (let i = 0; i < n; i++) {
      const cx = X + (im.fl.includes('chaotic') ? r() * W : W * (0.45 + r() * 0.5)), cy = Y + (im.fl.includes('chaotic') ? r() * H : H * (0.25 + r() * 0.6));
      blob(x, cx, cy, 14 + r() * 16, hs[i % hs.length] + (im.fl.includes('chaotic') ? r() * 90 : 0), 55, 58, 0.55);
    }
  } else if (im.st === 'flat') {
    x.fillStyle = '#cfe6dc'; x.fillRect(X, Y, W, H);
    x.fillStyle = '#f2b66d'; x.beginPath(); x.arc(X + W * 0.72, Y + H * 0.42, H * 0.34, 0, 7); x.fill();
    [['#7fb59b', 0.62, 0.0], ['#4f8f7a', 0.78, 0.5], ['#2f6a5c', 0.9, 1.1]].forEach(([c, hh, ph]) => {
      x.fillStyle = c; x.beginPath(); x.moveTo(X, Y + H);
      for (let k = 0; k <= 12; k++) x.lineTo(X + k / 12 * W, Y + H * (hh + 0.07 * Math.sin(k * 0.8 + ph)));
      x.lineTo(X + W, Y + H); x.closePath(); x.fill();
    });
    if (im.fl.includes('garble')) {   // 깨진 글자: 획이 엉키고 겹친 가짜 글자
      for (let i = 0; i < 6; i++) {
        const gx = X + 52 + i * 19 + (r() - 0.5) * 5, gy = Y + 13 + (r() - 0.5) * 4;
        for (let pass = 0; pass < 2; pass++) {
          x.strokeStyle = pass ? 'rgba(20,30,40,0.35)' : '#15202b'; x.lineWidth = pass ? 4 : 2.2; x.lineCap = 'round'; x.beginPath();
          const o = pass ? 3 : 0; x.moveTo(gx + o, gy + r() * 12);
          for (let k = 0; k < 4; k++) x.lineTo(gx + r() * 16 + o, gy + r() * 22);
          x.stroke();
        }
      }
    }
  } else {
    x.fillStyle = '#ffd23f'; x.fillRect(X, Y, W, H);
    for (let gy = 0; gy < 8; gy++) for (let gx = 0; gx < 22; gx++) {
      const d = 1 + 2.6 * (gx / 21); x.fillStyle = '#e63946'; x.beginPath(); x.arc(X + 6 + gx * 8 + (gy % 2) * 4, Y + 4 + gy * 7, d * 0.85, 0, 7); x.fill();
    }
    x.fillStyle = '#111'; x.beginPath(); x.moveTo(X + W * 0.1, Y + H); x.lineTo(X + W * 0.34, Y); x.lineTo(X + W * 0.5, Y); x.lineTo(X + W * 0.26, Y + H); x.closePath(); x.fill();
    x.fillStyle = '#2ec4e6'; x.fillRect(X + W * 0.66, Y + H * 0.2, W * 0.26, H * 0.62);
    x.strokeStyle = '#111'; x.lineWidth = 2; x.strokeRect(X + W * 0.66, Y + H * 0.2, W * 0.26, H * 0.62);
  }
  x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.16;   // 종이 결: 옅은 그레인
  for (let gx0 = 0; gx0 < W; gx0 += 128) x.drawImage(GRAIN, X + gx0, Y, 128, 128);
  x.restore();
  if (im.fl.includes('border')) { x.strokeStyle = '#4a2f22'; x.lineWidth = 2; rr(x, X + 4, Y + 4, W - 8, H - 8, 3); x.stroke(); x.lineWidth = 0.8; rr(x, X + 7, Y + 7, W - 14, H - 14, 2); x.stroke(); }
}

const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(29), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const pill = el('div', null, sp);   // 이름표(tag-tr): 오른쪽 위, 모서리 거의 직각, 왼쪽에 3px 강조 줄
    Object.assign(pill.style, { position: 'absolute', right: '12px', top: '8px', padding: '5px 10px 5px 9px', background: PAL.surface, borderLeft: `3px solid ${PAL.accent}`, borderRadius: '2px', color: PAL.ink, font: "600 12px/1.2 'IBM Plex Sans KR',sans-serif", zIndex: '4' });
    const jr = rng(5), jit = IMGS.map(() => Math.round((jr() - 0.5) * 6));
    return { main, pill, jit };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv), x = s.main.getContext('2d');
    t = t > 0 ? t : 0;
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.08;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();
    T(x, `같은 그림 6장 · 통과선 ${PASS}점`, X0, 24, 13, PAL.ink, 600);

    let nFail = 0, nGoodFail = 0, nBadPass = 0;
    IMGS.forEach((im, i) => {
      const J = judge(im, L, s.jit[i]), c = i % 3, rw = Math.floor(i / 3);
      const X = X0 + c * (CW + GX), Y = Y0 + rw * (CH + GY);
      const k = seg(t, 0.2 + i * 0.22, 0.2 + i * 0.22 + 0.5), pop = E.outBack(k), sc = E.outC(seg(t, 0.55 + i * 0.22, 1.5 + i * 0.22)), st = E.outBack(seg(t, 1.5 + i * 0.22, 1.9 + i * 0.22));
      if (!J.pass) nFail++;
      if (!J.pass && !im.fl.length) nGoodFail++;
      if (J.pass && im.fl.length) nBadPass++;
      if (k <= 0) return;
      const cx = X + CW / 2, cy = Y + CH / 2, z = lerp(0.92, 1, pop);
      x.save(); x.translate(cx, cy); x.scale(z, z); x.translate(-cx, -cy); x.globalAlpha = Math.min(1, k * 2);
      x.fillStyle = 'rgba(0,0,0,0.30)'; rr(x, X - 1, Y + 4, CW + 2, CH, 8); x.fill();   // 접지 그림자
      x.fillStyle = PAL.surface; rr(x, X, Y, CW, CH, 7); x.fill();
      x.strokeStyle = PAL.line; x.lineWidth = 1; rr(x, X + 0.5, Y + 0.5, CW - 1, CH - 1, 7); x.stroke();
      art(x, im, X + 3, Y + 3, CW - 6, AH);
      if (st > 0.2 && !J.pass) { x.fillStyle = 'rgba(11,15,26,0.42)'; rr(x, X + 3, Y + 3, CW - 6, AH, 6); x.fill(); }
      const sv = J.score < 0 ? -1 : Math.round(J.score * sc);
      T(x, String(sv), X + 10, Y + AH + 26, 20, J.pass ? PAL.ink : PAL.muted, 700, 'left', MONO);
      const chip = J.pass ? '통과' : '탈락', cw = 38, chx = X + CW - cw - 8, chy = Y + AH + 9;
      x.save(); x.translate(chx + cw / 2, chy + 9); x.scale(lerp(0.6, 1, st), lerp(0.6, 1, st)); x.globalAlpha = Math.min(1, st * 1.5);
      x.fillStyle = J.pass ? PAL.accent2 : 'rgba(139,148,163,0.22)'; rr(x, -cw / 2, -9, cw, 18, 3); x.fill();
      T(x, chip, 0, 4, 11, J.pass ? '#1a1206' : PAL.muted, 700, 'center'); x.restore();
      x.font = `600 10px ${SANS}`; const sw = x.measureText(STYLE[im.st]).width + 10;   // 화풍 이름표: 그림 왼쪽 위
      x.fillStyle = 'rgba(11,15,26,0.62)'; rr(x, X + 8, Y + 8, sw, 16, 3); x.fill(); T(x, STYLE[im.st], X + 13, Y + 19.5, 10, PAL.ink, 600);
      if (L >= 3 || J.why === '수채화가 아니다') T(x, J.why, X + 10, Y + AH + 42, 11, J.pass ? PAL.muted : PAL.accent, 600, 'left');
      x.restore();
    });
    const ND = 288, d = E.outC(seg(t, 2.4, 3.4));
    [[`${Math.round(nFail * d)} / 6`, '탈락', PAL.ink], [String(Math.round(nGoodFail * d)), '멀쩡한데 탈락', nGoodFail ? PAL.accent : PAL.ink], [String(Math.round(nBadPass * d)), '결함 있는데 통과', nBadPass ? PAL.accent : PAL.ink]].forEach(([v, lab, col], i) => {
      const X = X0 + [0, 176, 352][i]; T(x, v, X, ND, 28, col, 700, 'left', MONO); T(x, lab, X, ND + 18, 12, PAL.muted, 500);
    });
    T(x, '그림은 코드로 그린 예시이고 점수는 이 화면의 가상 채점 규칙이 계산한다. 실제 모델이 준 점수가 아니다.', X0, 350, 10, PAL.muted, 500);
    s.pill.textContent = STEP[L];
  },
};
export default demo;
