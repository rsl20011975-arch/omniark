/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/description-template/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 롱폼 한 편의 설명란을 줄 번호와 접힘 선과 함께 놓고, 오른쪽 점검 6칸을 코드가 센다. 화면은 시간 t 의 함수다.
const TOTAL = 308;          // 영상 길이(초), 5분 8초
const FOLD_LINES = 3;       // 접힘 선: 위에서 이 줄 수 아래(공식 도움말에 줄 수가 없어 가정한 값)
const LAST_CH = 248;        // 마지막 챕터가 시작하는 시각(초), 4:08
const TEST_LINE = 1;        // 1이면 시험 조건 줄을 넣는다
const MIN_CH = 10;          // 챕터 하나의 최소 길이(초)
const MAX_CHARS = 5000;     // 설명 글자 수 한도
const PAL = { bg0: '#0c1814', bg1: '#15271f', ink: '#e8f1ea', muted: '#86a091', accent: '#7fe0a8', accent2: '#e8d27a', surface: '#12231c', line: 'rgba(232,241,234,.16)' };
const BAD = '#ff9a8a';
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif', HAN = '"Black Han Sans", sans-serif';
const NAMES = ['인사말과 키워드 설명란', '첫 줄에 약속 한 줄', '링크 줄을 접힘 선 위로', '시험 조건과 고지 줄', '챕터 시각표를 맨 아래에'];
const LH = 17.5, CX = 20, CY = 52, CW = 372;

const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const CH_OK = [[0, '들어가며'], [18, "'AI 티'의 정체"], [59, '고치는 단어 5개'], [150, '복사해서 쓰는 5줄'], [164, '실제로 넣어 봤습니다'], [206, '따라 하기'], [LAST_CH, '팁 3개']];
const CH_BAD = [[5, '시작'], [130, '본론']];

function build(L) {          // 단계 L 에서의 설명란 줄 목록: [종류, 글, 초]
  const ls = [];
  if (L < 1) ls.push(['greet', '안녕하세요! 오늘도 와 주셔서 감사합니다'], ['greet', '좋아요와 구독은 큰 힘이 됩니다']);
  else ls.push(['promise', 'AI 홈페이지가 싸 보이는 이유와 고치는 법'], ['comp', '신호 7가지 → 단어 5개 → 시험 → 팁 3개']);
  if (L >= 2) ls.push(['link', '전문과 코드: [블로그 글 주소]']);
  else ls.push(['kw', 'AI 티, 홈페이지, 디자인, 바이브코딩, 꿀팁, 추천'], ['blank', ''], ['link', '링크: [블로그 글 주소]']);
  if (L >= 3) { if (TEST_LINE) ls.push(['test', '시험 조건: 11월 1일, 도구 하나, 1회']); ls.push(['disc', '예시 화면은 재현한 것이며 실제 결과가 아닙니다']); }
  ls.push(['blank', '']);
  (L >= 4 ? CH_OK : CH_BAD).forEach(([s, n]) => ls.push(['ch', `${mmss(s)} ${n}`, s]));
  return ls;
}
function measure(L) {        // 점검 6칸의 값. 모두 줄 목록에서 센다
  const ls = build(L), has = (k) => ls.some((l) => l[0] === k);
  const li = ls.findIndex((l) => l[0] === 'link') + 1;
  const ch = ls.filter((l) => l[0] === 'ch').map((l) => l[2]);
  const lens = ch.map((s, i) => (i + 1 < ch.length ? ch[i + 1] : TOTAL) - s);
  const minLen = lens.length ? Math.min(...lens) : 0, chOk = ch[0] === 0 && ch.length >= 3 && minLen >= MIN_CH;
  const chars = ls.reduce((n, l) => n + l[1].length, 0);
  return [
    { n: '첫 줄', v: ls[0][0] === 'promise' ? '약속 한 줄' : '인사말', ok: ls[0][0] === 'promise' },
    { n: '링크 줄', v: `줄 ${li} / 접힘 ${FOLD_LINES}`, ok: li > 0 && li <= FOLD_LINES },
    { n: '시험 조건 줄', v: has('test') ? '있음' : '없음', ok: has('test') },
    { n: '고지 줄', v: has('disc') ? '있음' : '없음', ok: has('disc') },
    { n: '챕터 시각표', v: `${mmss(ch[0])} · ${ch.length}개 · 최단 ${minLen}초`, ok: chOk },
    { n: '글자 수', v: `${chars}자 / ${MAX_CHARS}`, ok: chars <= MAX_CHARS },
  ];
}

let GRAIN = null;
function rr(x, X, Y, W, H, r) { x.beginPath(); x.roundRect(X, Y, W, H, Math.max(0, Math.min(r, W / 2, H / 2))); }
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.textBaseline = 'alphabetic'; x.fillText(s, X, Y); }
function shadow(x, X, Y, W, H, r) { for (let k = 1; k <= 5; k++) { x.fillStyle = 'rgba(0,0,0,0.07)'; rr(x, X - k * 1.5, Y + 2 + k * 0.8, W + k * 3, H + k * 3, r + k * 1.5); x.fill(); } }
function mark(x, cx, cy, ok, col) {      // 통과는 갈고리, 탈락은 가위표 (글자 모양에 기대지 않고 선으로 그린다)
  x.save(); x.strokeStyle = col; x.lineWidth = 2; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
  if (ok) { x.moveTo(cx - 4, cy); x.lineTo(cx - 1, cy + 3.5); x.lineTo(cx + 5, cy - 4); } else { x.moveTo(cx - 4, cy - 4); x.lineTo(cx + 4, cy + 4); x.moveTo(cx + 4, cy - 4); x.lineTo(cx - 4, cy + 4); }
  x.stroke(); x.restore();
}

const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 4,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(11), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const tag = el('div', null, sp);   // 이름표(tag-tr): 오른쪽 위, 거의 직각, 왼쪽 accent 줄
    Object.assign(tag.style, { position: 'absolute', right: '14px', top: '10px', background: PAL.surface, borderLeft: `3px solid ${PAL.accent}`, borderRadius: '2px', padding: '.4em .9em .4em .7em', font: "600 12px 'IBM Plex Sans KR',sans-serif", color: PAL.ink, zIndex: '4', whiteSpace: 'nowrap' });
    return { main, tag };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 0 : (lv == null ? 4 : lv);
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.setLineDash([]);
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.07;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();

    const ls = build(L), prev = L > 0 ? build(L - 1).map((l) => l[0] + l[1]) : [], H = 30 + ls.length * LH + 8;
    T(x, `롱폼 설명란 예시 · 길이 ${mmss(TOTAL)}`, CX, 38, 11, PAL.muted, 500, 'left', MONO);
    shadow(x, CX, CY, CW, H, 8);
    const cg = x.createLinearGradient(0, CY, 0, CY + H); cg.addColorStop(0, '#1a3228'); cg.addColorStop(1, PAL.surface);
    x.fillStyle = cg; rr(x, CX, CY, CW, H, 8); x.fill(); x.strokeStyle = PAL.line; x.lineWidth = 1; rr(x, CX + 0.5, CY + 0.5, CW - 1, H - 1, 8); x.stroke();
    let n = 0;
    ls.forEach((l, i) => {
      const fresh = L > 0 && !prev.includes(l[0] + l[1]), k = fresh ? E.outC(seg(t, 0.15 + (n++) * 0.1, 0.65 + n * 0.1)) : 1;
      const y = CY + 24 + i * LH, below = i >= FOLD_LINES;
      x.save(); x.globalAlpha = (below ? 0.7 : 1) * (0.1 + 0.9 * k);
      if (fresh && L > 0) { x.fillStyle = PAL.accent; x.globalAlpha *= 1 - seg(t, 0.9, 2.4); x.fillRect(CX + 1, y - 11, 3, LH - 2); x.globalAlpha = (below ? 0.7 : 1) * (0.1 + 0.9 * k); }
      T(x, String(i + 1), CX + 20, y, 10, PAL.muted, 500, 'right', MONO);
      const ox = 30 + (1 - k) * 10, kind = l[0];
      if (kind === 'link') { x.fillStyle = PAL.accent; x.beginPath(); x.moveTo(CX + ox, y - 9); x.lineTo(CX + ox, y); x.lineTo(CX + ox + 7, y - 4.5); x.closePath(); x.fill(); T(x, l[1], CX + ox + 12, y, 11.5, PAL.accent, 600); }
      else if (kind === 'ch') {
        const idx = ls.filter((q) => q[0] === 'ch').indexOf(l), ch = ls.filter((q) => q[0] === 'ch'), len = (idx + 1 < ch.length ? ch[idx + 1][2] : TOTAL) - l[2], bad = len < MIN_CH;
        const sp1 = l[1].indexOf(' ');
        if (bad) { x.fillStyle = 'rgba(255,120,100,.34)'; x.fillRect(CX + 6, y - 12, CW - 12, LH - 1); }
        T(x, l[1].slice(0, sp1), CX + ox, y, 11, bad ? '#ffd3cb' : PAL.accent, 600, 'left', MONO); T(x, l[1].slice(sp1 + 1), CX + ox + 38, y, 11.5, bad ? '#ffd3cb' : PAL.ink, 400);
        if (bad) T(x, `${len}초`, CX + CW - 12, y, 10, '#ffd3cb', 600, 'right', MONO);
      }
      else T(x, l[1], CX + ox, y, 11.5, kind === 'promise' ? PAL.ink : (kind === 'greet' || kind === 'kw' ? PAL.muted : PAL.ink), kind === 'promise' ? 700 : 400);
      x.restore();
    });
    const fy = CY + 24 + FOLD_LINES * LH - 12;       // 접힘 선
    x.save(); x.strokeStyle = PAL.accent2; x.lineWidth = 1; x.setLineDash([4, 3]); x.beginPath(); x.moveTo(CX + 6, fy); x.lineTo(CX + CW - 6, fy); x.stroke(); x.restore();
    T(x, `접힘 선 · 위에서 ${FOLD_LINES}줄`, CX + CW - 8, fy + 11, 10, PAL.accent2, 600, 'right', MONO);
    T(x, '접힘 줄 수는 공식 도움말에 없어 가정한 값', CX, CY + H + 17, 10, PAL.muted, 500);

    const M = measure(L), pass = M.filter((m) => m.ok).length;      // 오른쪽 점검표
    const RX = 410, RW = 212;
    T(x, '점검 6칸', RX, 50, 11, PAL.muted, 500, 'left', MONO);
    M.forEach((m, i) => {
      const y = 58 + i * 38, col = m.ok ? PAL.accent : BAD;
      x.fillStyle = m.ok ? 'rgba(232,241,234,.06)' : 'rgba(255,120,100,.3)'; rr(x, RX, y, RW, 33, 6); x.fill();
      x.fillStyle = col; rr(x, RX, y + 4, 3, 25, 1.5); x.fill();
      mark(x, RX + 17, y + 16.5, m.ok, col);
      T(x, m.n, RX + 32, y + 14, 12, PAL.ink, 600);
      T(x, m.v, RX + 32, y + 28, 11, col, 600, 'left', MONO);
    });
    T(x, `통과 ${pass}/6`, RX, 308, 26, pass === 6 ? PAL.accent : PAL.accent2, 400, 'left', HAN);
    T(x, '통과는 조회가 늘어난다는 뜻이 아니다', RX, 328, 10, PAL.muted, 500);
    s.tag.textContent = `${L}  ${NAMES[L]}`;
  },
};
export default demo;
