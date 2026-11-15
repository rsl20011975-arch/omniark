/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/prompt-labels-short-lines/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 꽃 그림 지시문 한 벌을 장문 한 문단에서 라벨 줄로 고쳐 가며, 코드가 줄 수 · 문장 단위 · 한 문장 속 빛 효과 수를 센다.
// 화면의 글은 예시 지시문이다. AI 가 그린 그림은 없다. 화면은 시간 t 의 함수다.
const LINES = 7;     // 라벨 줄 수(8이면 꽃잎연출 줄이 붙는다)
const TIME = 0;      // 시간대: 0 노을 지는 저녁, 1 새벽, 2 깊은 밤
const GLOW = 1;      // 3단계에서 남기는 빛 표현: 1 꽃 전체가 빛난다, 2 빛 입자가 떠다닌다
const DOT = 0;       // 2단계부터 줄마다 마침표를 붙인다(0이면 붙이지 않는다)
const PAL = { bg0: '#171615', bg1: '#232120', ink: '#f2efe9', muted: '#9a958c', accent: '#5ad1c8', accent2: '#f2b84b', surface: '#1f1d1b', line: '#3d3a36' };
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif';
const TIMES = [
  { t: '노을 지는 저녁', w: '보슬비가 내리는 날', tone: '밝은' },
  { t: '새벽', w: '푸르스름한 새벽빛', tone: '어두운' },
  { t: '깊은 밤', w: '별빛이 은은하게 빛나는 깊은 밤', tone: '어두운' },
];
const GLOWS = ['꽃 전체가 은은하게 빛난다', '은은한 빛 입자가 꽃 주변에 반짝이며 떠다닌다'];
const BOTH = '꽃 전체가 은은하게 빛나고 빛 입자가 떠다닌다';
const FX = [/투명한 꽃잎/, /꽃 전체가 은은하게 빛[가-힣]*/, /빛 입자/];   // 빛·투명 효과를 알리는 말 세 가지
const STEP = ['장문 한 문단', '라벨 줄로 나누기', '줄마다 마침표', '한 줄에 효과 하나'];
const CX = 58, CY = 12, CW = 524, TX = CX + 46, TW = CW - 62, RH = 22;   // 카드 자리, 글 시작 x, 글 폭, 줄 높이

function doc(L) {   // 단계별 지시문: 줄 목록 [{ lab, txt }] 또는 장문 한 문단
  const v = TIMES[Math.max(0, Math.min(2, TIME))], dot = L >= 2 && DOT ? '.' : '';
  if (L === 0) return [{ lab: '', txt: `맑고 투명한 꽃잎을 가진 별수국 서너 송이가 이끼 낀 숲, ${v.t}, ${v.w} 속에 피어 있고 꽃 전체가 은은하게 빛나며 빛 입자가 떠다니는 9:16 비율의 화면 약 40% 크기의 힐링감성용 그림으로, 상단 빈 공간으로 이어지는 ${v.tone} 톤의 그라데이션 연출이고 텍스트, 서명, 워터마크는 없다.` }];
  const glow = L === 3 ? GLOWS[GLOW === 2 ? 1 : 0] : BOTH, sep = L >= 2 && DOT ? '. ' : ', ';
  const out = [{ lab: '꽃', txt: `맑고 투명한 꽃잎의 별수국 서너 송이${sep}${glow}${dot}` }];
  if (LINES >= 8) out.push({ lab: '꽃잎연출', txt: `꽃술에서부터 은은한 자수정 보라빛이 퍼진다${dot}` });
  out.push({ lab: '장소', txt: `이끼 낀 숲${dot}` }, { lab: '날씨', txt: `${v.w}${dot}` }, { lab: '시간', txt: `${v.t}${dot}` },
    { lab: '비율', txt: `9:16 비율의 화면 약 40%${dot}` }, { lab: '감성', txt: `힐링감성용${dot}` },
    { lab: '특이사항', txt: L >= 2 && DOT ? `상단 빈 공간으로 이어지는 ${v.tone} 톤의 그라데이션 연출. 텍스트, 서명, 워터마크 없음.` : `상단 빈 공간으로 이어지는 ${v.tone} 톤의 그라데이션 연출, 텍스트, 서명, 워터마크 없음` });
  return out;
}

let MEAS = null;
function measure() { if (!MEAS) MEAS = document.createElement('canvas').getContext('2d'); MEAS.font = `500 13px ${SANS}`; return MEAS; }
function wrap(txt, w) {   // 낱말(띄어쓰기) 단위로 줄을 꺾고, 낱말 하나가 너무 길 때만 글자 단위로 꺾는다
  const m = measure(), rows = []; let cur = '';
  for (const word of txt.split(' ')) {
    const trial = cur ? `${cur} ${word}` : word;
    if (m.measureText(trial).width <= w) { cur = trial; continue; }
    if (cur) rows.push(cur);
    cur = word;
    while (m.measureText(cur).width > w) { let k = cur.length; while (k > 1 && m.measureText(cur.slice(0, k)).width > w) k--; rows.push(cur.slice(0, k)); cur = cur.slice(k); }
  }
  if (cur) rows.push(cur); return rows;
}
function layout(L) {   // 화면에 놓을 줄 목록과 센 값
  const rows = [], lines = doc(L);
  lines.forEach((ln) => {
    const full = ln.lab ? `${ln.lab}: ${ln.txt}` : ln.txt;
    const parts = L >= 2 ? full.split(/(?<=\.) /) : [full];   // 마침표가 있으면 문장마다 줄을 바꾼다
    parts.forEach((p, pi) => wrap(p, pi === 0 ? TW : TW - 28).forEach((r, ri) => rows.push({ txt: r, ind: pi || (ri && ln.lab) ? 28 : 0 })));
  });
  let u = 0; rows.forEach((r) => { r.unit = u; if (r.txt.endsWith('.')) u++; });
  const nUnit = (u && rows[rows.length - 1].txt.endsWith('.')) ? u : u + 1;
  const fx = Array.from({ length: nUnit }, (_, k) => { const s = rows.filter((r) => r.unit === k).map((r) => r.txt).join(' '); return FX.filter((f) => f.test(s)).length; });
  return { rows, nUnit, fx, maxFx: Math.max(...fx), nLine: L === 0 ? 1 : lines.length };
}

let GRAIN = null;
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function rr(x, X, Y, W, H, R) { x.beginPath(); x.roundRect(X, Y, W, H, R); }

const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(17), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const pill = el('div', null, sp);   // 이름표(caption-bl): 왼쪽 아래, 배경 없음, 위에 얇은 선
    Object.assign(pill.style, { position: 'absolute', left: '18px', bottom: '8px', minWidth: '250px', paddingTop: '5px', borderTop: `1px solid ${PAL.line}`, color: PAL.muted, font: "500 12px/1.2 'JetBrains Mono','IBM Plex Sans KR',monospace", zIndex: '4' });
    return { main, pill, lay: [0, 1, 2, 3].map(layout) };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv), Y = s.lay[Math.max(0, Math.min(3, L))], x = s.main.getContext('2d');
    t = t > 0 ? t : 0;
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.10;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();
    // 카드: 겹친 그림자 두 겹, 위쪽 림 라이트
    const CH = Y.rows.length * RH + 26;
    x.fillStyle = 'rgba(0,0,0,0.22)'; rr(x, CX - 2, CY + 5, CW + 4, CH, 8); x.fill();
    x.fillStyle = 'rgba(0,0,0,0.30)'; rr(x, CX, CY + 2, CW, CH, 8); x.fill();
    x.fillStyle = PAL.surface; rr(x, CX, CY, CW, CH, 8); x.fill();
    x.strokeStyle = PAL.line; x.lineWidth = 1; rr(x, CX + 0.5, CY + 0.5, CW - 1, CH - 1, 8); x.stroke();
    x.strokeStyle = 'rgba(255,255,255,0.10)'; x.beginPath(); x.moveTo(CX + 10, CY + 1.5); x.lineTo(CX + CW - 10, CY + 1.5); x.stroke();

    const PY = CY + 14, nU = Y.nUnit;
    let ui = -1;
    for (let k = 0; k < nU; k++) {   // 문장 단위마다 띠를 깐다: 호박색은 빛 효과가 둘 이상 섞인 문장
      const rs = Y.rows.map((r, i) => [r, i]).filter(([r]) => r.unit === k); if (!rs.length) continue;
      const i0 = rs[0][1], i1 = rs[rs.length - 1][1], bad = Y.fx[k] > 1, col = bad ? PAL.accent2 : PAL.accent;
      const p = E.outC(seg(t, 0.25 + i0 * 0.09, 0.7 + i0 * 0.09)), bx = CX + 6, by = PY + i0 * RH - 3, bh = (i1 - i0 + 1) * RH - 1;
      x.globalAlpha = p; x.fillStyle = bad ? 'rgba(242,184,75,0.12)' : 'rgba(90,209,200,0.07)'; rr(x, bx, by, CW - 12, bh, 4); x.fill();
      x.fillStyle = col; rr(x, bx, by, 3, bh, 1.5); x.fill();
      T(x, String(k + 1), CX + 20, PY + i0 * RH + 12, 10, PAL.muted, 500, 'left', MONO);
      x.globalAlpha = 1; ui = k;
    }
    const m = measure();
    Y.rows.forEach((r, i) => {
      const k = seg(t, 0.3 + i * 0.09, 0.65 + i * 0.09), e = E.outC(k); if (k <= 0) return;
      const X0 = TX + r.ind, Y0 = PY + i * RH + 12 + (1 - e) * 6;
      x.globalAlpha = e;
      FX.forEach((f) => {   // 빛 효과 말에는 바탕과 밑줄을 깐다(글자보다 먼저)
        const mt = f.exec(r.txt); if (!mt) return;
        m.font = `500 13px ${SANS}`; const x1 = X0 + m.measureText(r.txt.slice(0, mt.index)).width, w = m.measureText(mt[0]).width * E.outC(seg(t, 0.6 + i * 0.09, 1.1 + i * 0.09));
        x.fillStyle = 'rgba(242,184,75,0.40)'; rr(x, x1 - 2, Y0 - 13, w + 4, 20, 3); x.fill();
        x.fillStyle = PAL.accent2; x.fillRect(x1, Y0 + 4, w, 2);
      });
      T(x, r.txt, X0, Y0, 13, PAL.ink, 500);
      x.globalAlpha = 1;
    });

    const fin = E.outC(seg(t, 1.4, 2.6)), NY = 291;
    [[Y.nLine, '라벨 줄 수', false], [nU, '문장 단위 수', nU === 1], [Y.maxFx, '한 문장 속 빛 효과 수', Y.maxFx > 1]].forEach(([v, lab, bad], i) => {
      const X = CX + [4, 172, 340][i];
      T(x, String(Math.round(v * fin)), X, NY, 30, bad ? PAL.accent2 : PAL.accent, 700, 'left', MONO);
      T(x, lab, X, NY + 19, 12, PAL.muted, 500);
    });
    T(x, '예시 지시문이다. AI 가 그린 그림이 아니다.', 626, 352, 10, PAL.muted, 500, 'right');
    s.pill.textContent = L === 0 ? STEP[0] : `${L}  ${STEP[L]}`;
    void lerp; void ui;
  },
};
export default demo;
