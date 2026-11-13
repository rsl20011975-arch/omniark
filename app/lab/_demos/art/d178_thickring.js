/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/computed-numbers/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng, rr } from "./helpers.js";

const PAL = { bg0: '#e6f2ec', bg1: '#d4e8de', ink: '#0f2a22', muted: '#4f6e63', accent: '#0f9d6b', accent2: '#c2410c', surface: '#f6fbf8', line: 'rgba(15,42,34,.16)' };
const al = (h, a) => `rgba(${[1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(',')},${a})`;   // PAL 색에 투명도를 준다

// 도넛 차트의 각도·라벨·합계를 손으로 적지 않고 데이터에서 코드가 계산하면, 데이터가 바뀌어도 화면 숫자가 어긋나지 않는다. 1단계는 손으로 적은 라벨, 2단계는 계산한 라벨, 3단계는 합계 100%까지 맞춘 라벨이다. 화면은 시간 t 의 함수다.
const DATA_OLD = [120, 90, 60, 30];       // 처음 데이터(합 300). 손으로 적은 라벨 40·30·20·10% 는 이 데이터에서 나온 값이다
const DATA_NEW = [196, 84, 63, 31];       // 1.0~2.1초에 바뀌는 새 데이터(합 374)
const HOLE = 0.3;                        // 도넛 구멍 반지름 비율(안쪽 반지름 ÷ 바깥 반지름). 라벨 위치도 여기서 계산한다
const START_DEG = -90;                    // 첫 조각이 시작하는 각도(도). -90 은 12시 방향
const HAND = ['40%', '30%', '20%', '10%'], HAND_SUM = 300;   // 손으로 적어 둔 라벨과 가운데 합계(데이터가 바뀌어도 안 바뀐다)
const NAMES = ['쇼츠', '블로그', 'SNS', '기타'], COLS = [['#ffb27f', '#ff8a3d'], ['#9fe0ff', '#4fb8f0'], ['#cdbdff', '#9378f0'], ['#7fe3b4', '#2fb97c']];
const T_A = 1.0, T_B = 2.1;
const CX = 160, CY = 182, R = 100;
const SANS = "'IBM Plex Sans KR','Malgun Gothic',sans-serif", MONO = "'JetBrains Mono',monospace", DISP = "'Black Han Sans','Malgun Gothic',sans-serif";
const TX2 = '#44625a', INK = PAL.ink, TAU = Math.PI * 2, OK = '#0b7a52', NG = '#b42318', WARN = '#8a5200';   // 밝은 배경에서 작은 글자도 4.5:1 이 넘도록 어둡게 맞춘 상태색

// ---- 데이터에서 계산하는 값들 ----
const rad = (deg) => deg * Math.PI / 180;   // MDN: canvas 의 arc 각도는 라디안
function calc(vals) {   // 합계·비율·각도를 데이터에서 계산
  const sum = vals.reduce((p, q) => p + q, 0);
  let cum = 0; return { sum, rows: vals.map((v, i) => { const share = v / sum, a0 = START_DEG + cum / sum * 360, deg = share * 360; cum += v; return { v, share, deg, a0, a1: a0 + deg, mid: a0 + deg / 2 }; }) };
}
function labelsInt(shares, fix) {   // 퍼센트 라벨(정수). fix 이면 큰 소수 나머지부터 1씩 올려 합이 100 이 되게 한다
  const raw = shares.map((s) => s * 100);
  if (!fix) return raw.map(Math.round);
  const fl = raw.map(Math.floor); let left = 100 - fl.reduce((p, q) => p + q, 0);
  raw.map((r, i) => [r - fl[i], i]).sort((a, b) => b[0] - a[0]).slice(0, left).forEach(([, i]) => fl[i]++);
  return fl;
}

// ---- 그리기 도구 ----
function tx(c, s, x, y, size, col, wt, al, font) { c.save(); c.fillStyle = col; c.font = (wt || 500) + ' ' + size + 'px ' + (font || SANS); c.textAlign = al || 'left'; c.textBaseline = 'alphabetic'; c.fillText(s, x, y); c.restore(); }
function bgFill(c, grain) {
  const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, PAL.bg0); g.addColorStop(.25, PAL.bg0); g.addColorStop(1, PAL.bg1); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
  const r = c.createRadialGradient(470, 120, 10, 470, 120, 330); r.addColorStop(0, al(PAL.accent, .12)); r.addColorStop(1, al(PAL.accent, 0)); c.fillStyle = r; c.fillRect(0, 0, 640, 360);
  c.globalAlpha = .05; c.fillStyle = c.createPattern(grain, 'repeat'); c.fillRect(0, 0, 640, 360); c.globalAlpha = 1;
}
function panel(c, x, y, w, h) { rr(c, x, y, w, h, 8); c.save(); c.shadowColor = al(PAL.ink, .12); c.shadowBlur = 10; c.shadowOffsetY = 3; c.fillStyle = PAL.surface; c.fill(); c.restore(); c.strokeStyle = PAL.line; c.lineWidth = 1; c.stroke(); }
function mark(c, x, y, ok, col) {   // 체크·가위표를 선으로 직접 그린다
  c.save(); c.translate(x, y); c.strokeStyle = col; c.lineWidth = 2; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath();
  if (ok) { c.moveTo(-4.5, .5); c.lineTo(-1.2, 3.8); c.lineTo(5, -4); } else { c.moveTo(-4, -4); c.lineTo(4, 4); c.moveTo(4, -4); c.lineTo(-4, 4); }
  c.stroke(); c.restore();
}

const demo = {
  dur: 4.2, rest: 3.6, noCompare: false, levels: 3,
  mount(sp) {
    const cv = el('canvas', null, sp); cv.width = 1280; cv.height = 720; cv.style.cssText = 'position:absolute;left:0;top:0;width:640px;height:360px';
    const gc = document.createElement('canvas'); gc.width = gc.height = 96; const g = gc.getContext('2d'), r = rng(3), im = g.createImageData(96, 96);
    for (let i = 0; i < 96 * 96; i++) { const v = Math.round(r() * 255); im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } g.putImageData(im, 0, 0);
    return { ctx: cv.getContext('2d'), grain: gc };
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 3 : lv), c = s.ctx, k = E.inOutC(seg(t, T_A, T_B)), changed = t >= T_B;
    const vals = DATA_OLD.map((v, i) => lerp(v, DATA_NEW[i], k)), D = calc(vals), r0 = R * HOLE, rMid = (R + r0) / 2;
    c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1; bgFill(c, s.grain);
    tx(c, `데이터(값)  [${vals.map((v) => Math.round(v)).join(', ')}]`, 16, 68, 11.5, INK, 500, 'left', MONO);
    // 도넛: 조각 각도는 항상 데이터에서 계산
    c.save(); c.shadowColor = al(PAL.ink, .32); c.shadowBlur = 20; c.shadowOffsetY = 9; c.beginPath(); c.arc(CX, CY, R, 0, TAU); c.fillStyle = PAL.surface; c.fill(); c.restore();
    D.rows.forEach((w, i) => {
      const g = c.createLinearGradient(CX - R, CY - R, CX + R, CY + R); g.addColorStop(0, COLS[i][0]); g.addColorStop(1, COLS[i][1]);
      c.beginPath(); c.arc(CX, CY, R, rad(w.a0), rad(w.a1)); c.arc(CX, CY, r0, rad(w.a1), rad(w.a0), true); c.closePath(); c.fillStyle = g; c.fill(); c.lineWidth = 2; c.strokeStyle = PAL.surface; c.stroke();
    });
    const sh = c.createRadialGradient(CX - 30, CY - 40, 10, CX, CY, R); sh.addColorStop(0, 'rgba(255,255,255,.16)'); sh.addColorStop(.6, 'rgba(255,255,255,0)'); sh.addColorStop(1, al(PAL.ink, .14));
    c.beginPath(); c.arc(CX, CY, R, 0, TAU); c.arc(CX, CY, r0, 0, TAU, true); c.fillStyle = sh; c.fill();
    // 라벨: 1단계 = 손으로 적은 값, 2단계 = 계산(반올림), 3단계 = 계산 + 합 100 보정
    const lab = L === 1 ? HAND : labelsInt(D.rows.map((w) => w.share), L >= 3).map((n) => n + '%');
    D.rows.forEach((w, i) => { const x = CX + rMid * Math.cos(rad(w.mid)), y = CY + rMid * Math.sin(rad(w.mid)); tx(c, lab[i], x, y + 5, 15, PAL.ink, 700, 'center', MONO); });
    const cs = Math.max(14, Math.min(24, r0 * .42));   // 가운데 글자 크기도 구멍 반지름에서 계산
    if (r0 >= 40) tx(c, '합계', CX, CY - cs * .15, 11, TX2, 600, 'center'); tx(c, L === 1 ? String(HAND_SUM) : String(Math.round(D.sum)), CX, CY + (r0 >= 40 ? cs * .9 : cs * .35), cs, INK, 400, 'center', DISP);
    // 오른쪽 표
    panel(c, 322, 70, 302, 198);
    if (L === 1) {
      tx(c, '손으로 적은 숫자(처음에 한 번 적고 그대로)', 334, 90, 11, TX2, 600);
      NAMES.forEach((n, i) => { const y = 112 + i * 28; c.fillStyle = COLS[i][1]; c.beginPath(); c.arc(342, y - 4, 5, 0, TAU); c.fill(); tx(c, n, 354, y, 12, INK, 500); tx(c, HAND[i], 612, y, 14, INK, 700, 'right', MONO); });
      tx(c, '합계', 354, 228, 12, INK, 500); tx(c, `${HAND_SUM}  (손으로 적음)`, 612, 228, 12, INK, 600, 'right', MONO);
      tx(c, '데이터가 바뀌어도 이 숫자는 안 바뀝니다', 334, 252, 11, TX2, 500);
    } else {
      tx(c, '코드가 계산한 값', 334, 88, 11, TX2, 600);
      [['값', 438], ['비율', 500], ['각도', 560], ['라벨', 614]].forEach(([n, x]) => tx(c, n, x, 88, 10.5, TX2, 600, 'right'));
      D.rows.forEach((w, i) => {
        const y = 110 + i * 25; c.fillStyle = COLS[i][1]; c.beginPath(); c.arc(342, y - 4, 5, 0, TAU); c.fill(); tx(c, NAMES[i], 354, y, 12, INK, 500);
        tx(c, String(Math.round(w.v)), 438, y, 11.5, INK, 500, 'right', MONO); tx(c, (w.share * 100).toFixed(1) + '%', 500, y, 11.5, INK, 500, 'right', MONO);
        tx(c, w.deg.toFixed(1) + '°', 560, y, 11.5, INK, 500, 'right', MONO); tx(c, lab[i], 614, y, 12, PAL.accent2, 700, 'right', MONO);
      });
      const sumDeg = D.rows.reduce((p, q) => p + q.deg, 0), sumShare = D.rows.reduce((p, q) => p + q.share, 0) * 100, sumLab = lab.reduce((p, q) => p + parseInt(q, 10), 0), y = 218;
      c.fillStyle = PAL.line; c.fillRect(334, y - 14, 280, 1);
      tx(c, '합', 354, y + 2, 12, INK, 600); tx(c, String(Math.round(D.sum)), 438, y + 2, 11.5, INK, 700, 'right', MONO); tx(c, sumShare.toFixed(1) + '%', 500, y + 2, 11.5, INK, 700, 'right', MONO);
      tx(c, sumDeg.toFixed(1) + '°', 560, y + 2, 11.5, INK, 700, 'right', MONO); tx(c, sumLab + '%', 614, y + 2, 12, sumLab === 100 ? OK : NG, 700, 'right', MONO);
      tx(c, '각도 = 값 ÷ 합 × 360°', 334, 246, 10.5, TX2, 500, 'left', MONO); tx(c, L >= 3 ? '라벨 = 값 ÷ 합 × 100, 합이 100 이 되게 보정' : '라벨 = 값 ÷ 합 × 100 을 반올림', 334, 260, 10.5, TX2, 500, 'left', MONO);
    }
    // 아래 상태 띠
    let msg, col, ok = null;
    if (L === 1) { if (changed) { msg = '데이터는 바뀌었는데 라벨·합계는 처음 값 그대로 → 어긋남'; col = NG; ok = false; } else { msg = '지금은 라벨이 맞아 보이지만 손으로 적은 값입니다'; col = TX2; } }
    else { const sl = lab.reduce((p, q) => p + parseInt(q, 10), 0); if (sl !== 100) { msg = `라벨 합 ${sl}% — 반올림 때문에 100이 안 됨`; col = WARN; ok = false; } else { msg = '라벨 합 100% · 각도 합 360° — 데이터를 바꿔도 같이 바뀜'; col = OK; ok = true; } }
    rr(c, 16, 288, 608, 30, 15); c.fillStyle = ok === null ? al(PAL.ink, .05) : al(col, .12); c.fill(); c.lineWidth = 1; c.strokeStyle = ok === null ? PAL.line : col; c.stroke();
    if (ok !== null) mark(c, 34, 303, ok, col); tx(c, msg, ok === null ? 30 : 48, 307.5, 12, ok === null ? INK : col, 600);
    tx(c, '화면의 각도·비율·합계·라벨 위치(반지름)는 모두 데이터에서 코드가 계산한 값입니다.', 16, 340, 10.5, TX2, 500);
    const post = L === 1 ? '손으로 적은 라벨, 데이터가 바뀌어도 그대로' : (L === 2 ? '코드가 계산한 라벨, 반올림만 하면 합이 어긋날 수 있음' : '계산에 합 100% 보정까지, 데이터를 바꾸면 전부 같이 바뀜');
    tx(c, String(L), 16, 46, 40, PAL.accent, 400, 'left', DISP); tx(c, post, 50, 38, 13, INK, 500);   // 이름표(numeral): 큰 단계 번호와 한 줄 설명
  },
};
export default demo;
