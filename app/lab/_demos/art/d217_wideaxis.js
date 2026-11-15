/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/topic-format-menu/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 소재 후보 8장을 쇼츠 틀 메뉴(A 버리기 전에, B 단계 실험, C 요령)에 맞춰 분류하고, 틀마다 시안 대본의 줄 길이를
// 글자 수로 세어 길이를 추정해 제작 기록의 실제 길이와 나란히 놓는다. 메뉴에 틀이 하나씩 늘면 틀이 있는 후보가 몇 장인지 코드가 센다.
// 화면의 분류 규칙은 제작 기록의 설명을 단순화한 그림이다. 후보 8장은 기록에서 이름을 가져온 예이고 실제 후보 51개의 비율이 아니다.
const CPS = 6.7;            // 말 속도(공백과 부호를 뺀 글자 수 / 초) [기록]
const GAP = 0.12, TAIL = 0.7;   // 줄 사이, 마지막 줄 뒤(초) [기록]
const AXIS = 50;            // 가로축 끝(초)
const FLOOR = 15;           // 쇼츠 공장 코드의 길이 벽 하한(초) [기록]
const PAL = { bg0: '#0c1814', bg1: '#15271f', ink: '#e8f1ea', muted: '#86a091', accent: '#7fe0a8', accent2: '#e8d27a', surface: '#12231c', line: '#2f5a47' };
const COL = { A: PAL.accent, B: PAL.accent2, C: '#9ad7f0' };
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif';
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

const FORMATS = [   // 시안 대본(착공 시점의 줄), 제작 기록의 실제 길이, 실제로 올린 편 수와 1만 이상 편 수
  { id: 'A', name: '버리기 전에', flow: '고장, 범인, 고침', real: 14.0, posted: 6, big: 1,
    lines: ['샌더 안 돌면 버리지 마세요', '안 켜지거나 판이 꽉 막혔다면', '바닥판부터 풀어 보세요', '범인은 이 안쪽 고무 링입니다', '빠져서 돌면 기계 전체를 붙잡아요', '빼기만 해도 다시 돕니다', '원래는 브레이크라 새 걸로 끼우면 끝'] },
  { id: 'B', name: '단계 실험', flow: '결과, 조건 고정, 값 단계', real: 18.3, posted: 1, big: 0,
    lines: ['바람 빠진 채 턱 넘으면 이렇게 됩니다', '같은 차, 같은 턱. 공기압만 바꿨습니다', '3바는 딱딱하게 튀고', '1바부터 옆면이 찌그러지고', '0.5바, 약 7psi면 휠이 턱에 닿기 직전', '이대로 포트홀 밟으면 휠이 찍힙니다', '적정값은 운전석 문 안쪽 스티커에'] },
  { id: 'C', name: '요령', flow: '막힘, 요령, 풀림', real: 10.0, posted: 2, big: 1,
    lines: ['헛도는 나사, 드릴로 뚫지 마세요', '얇은 헤라를 머리 밑에 밀어 넣고', '들어 올리면서 역회전', '2초면 쏙 빠집니다', '통을 부술 필요 없습니다'] },
];
const CANDS = [    // 소재 후보 8장: 모양(attr)에 따라 틀이 정해진다
  { n: '샌더 고무 링', sub: '고장 원인이 있다', kind: 'culprit' },
  { n: '공기압 3바에서 0.5바', sub: '값을 바꿔 가며 비교한다', kind: 'steps' },
  { n: '헛도는 나사 빼기', sub: '요령 한 가지로 푼다', kind: 'trick' },
  { n: '막힌 산소 센서 전용 소켓', sub: '요령 한 가지로 푼다', kind: 'trick' },
  { n: '좁은 곳 렌치 우회', sub: '요령 한 가지로 푼다', kind: 'trick' },
  { n: '커넥터 케이블 타이', sub: '요령 한 가지로 푼다', kind: 'trick' },
  { n: '자동차 팁 모음', sub: '팁을 늘어놓은 모음', kind: 'list' },
  { n: '나라별 교통 규칙', sub: '규칙을 늘어놓은 모음', kind: 'list' },
];
const WHICH = { culprit: 'A', steps: 'B', trick: 'C', list: null };   // 모양 → 틀. 틀 없음은 만들지 않는다
const units = (s) => (s.match(/[가-힣A-Za-z0-9]/g) || []).length;

function plan(F) {      // 대본 줄마다 초 = 글자 수 / 말 속도 + 줄 사이(마지막은 끝 여백)
  const segs = F.lines.map((s, i) => ({ u: units(s), sec: units(s) / CPS + (i < F.lines.length - 1 ? GAP : TAIL) }));
  return { segs, total: segs.reduce((a, q) => a + q.sec, 0) };
}

let GRAIN = null;
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function card(x, X, Y, W, H, a) { x.fillStyle = PAL.surface; x.beginPath(); x.roundRect(X, Y, W, H, 4); x.fill(); x.strokeStyle = PAL.line; x.lineWidth = 1; x.globalAlpha = a == null ? 1 : a; x.stroke(); x.globalAlpha = 1; }

const STEP = ['A 틀 하나로 끼우기', 'B 틀을 메뉴에 더하기', 'C 틀을 메뉴에 더하기'];
const demo = {
  dur: 5.0, rest: 5.0, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(21), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const lab = el('div', null, sp);   // 이름표(caption-bl): 왼쪽 아래, 배경 없음, 위에 1px 얇은 선, 모노 12px muted
    Object.assign(lab.style, { position: 'absolute', left: '14px', bottom: '10px', width: '270px', borderTop: `1px solid ${PAL.line}`, paddingTop: '.5em', color: PAL.muted, font: "500 12px/1.2 'JetBrains Mono',monospace", zIndex: '4', whiteSpace: 'nowrap' });
    return { main, lab, plans: FORMATS.map(plan) };
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 3 : lv), x = s.main.getContext('2d');
    t = t > 0 ? t : 0;
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.1;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();
    const have = (id) => FORMATS.findIndex((F) => F.id === id) < L;     // 단계 L 의 메뉴에 틀이 있는가
    // 왼쪽: 소재 후보 8장
    T(x, '소재 후보 8장 (기록에서 이름을 가져온 예)', 14, 30, 10, PAL.muted, 500, 'left', MONO);
    let matched = 0;
    CANDS.forEach((c, i) => {
      const Y = 40 + i * 33, w = WHICH[c.kind], ok = w && have(w), p = seg(t, 0.25 + i * 0.16, 0.65 + i * 0.16);
      if (ok) matched += p >= 1 ? 1 : 0;
      card(x, 10, Y, 290, 30);
      x.fillStyle = ok ? COL[w] : PAL.line; x.fillRect(10, Y + 4, 3, 22);
      T(x, c.n, 22, Y + 13, 11.5, PAL.ink, 600);
      T(x, c.sub, 22, Y + 26, 10, PAL.muted, 500);
      const tag = ok ? w : w ? '?' : '없음', tw = ok ? 22 : 40, k = ok ? E.outBack(p) : p;
      const TX = 290 - tw, cx = TX + tw / 2, cy = Y + 15;
      x.save(); x.translate(cx, cy); x.scale(lerp(0.4, 1, k), lerp(0.4, 1, k)); x.globalAlpha = Math.min(1, p * 1.6);
      x.fillStyle = ok ? COL[w] : 'rgba(134,160,145,.18)'; x.beginPath(); x.roundRect(-tw / 2, -9, tw, 18, 3); x.fill();
      T(x, tag, 0, 4, ok ? 12 : 10, ok ? '#0c1814' : PAL.muted, 700, 'center', MONO);
      x.restore();
      T(x, ok ? '' : (w ? '메뉴에 없음' : '만들지 않음'), 230, Y + 26, 10, PAL.muted, 500, 'right');
    });
    // 오른쪽: 틀 메뉴(큰 요소) — 줄마다 길이 막대와 기록의 실제 길이
    const RX = 316, RW = 312, BX = RX + 10, BW = RW - 20, px = (sec) => BX + Math.min(sec, AXIS) / AXIS * BW, RH = 68;
    FORMATS.forEach((F, i) => {
      const Y = 40 + i * RH, on = have(F.id), p = seg(t, 0.2 + i * 0.25, 0.9 + i * 0.25), P = s.plans[i];
      card(x, RX, Y, RW, 62, on ? 1 : 0.5);
      if (!on) { T(x, `${F.id}  ${F.name}`, RX + 10, Y + 20, 11.5, PAL.muted, 600); T(x, '아직 메뉴에 없음', RX + 10, Y + 40, 10, PAL.muted, 500); return; }
      T(x, F.id, RX + 10, Y + 17, 14, COL[F.id], 700, 'left', MONO);
      T(x, F.name, RX + 28, Y + 17, 11.5, PAL.ink, 600);
      T(x, `줄 ${F.lines.length}  추정 ${P.total.toFixed(1)}초  기록 ${F.real.toFixed(1)}초`, RX + RW - 8, Y + 17, 10, PAL.ink, 500, 'right', MONO);
      x.fillStyle = 'rgba(232,210,122,.2)'; x.fillRect(BX, Y + 24, px(FLOOR) - BX, 22);   // 벽 하한 아래 구역
      let acc = 0;
      P.segs.forEach((q, j) => {
        const x0 = px(acc * p), x1 = px((acc + q.sec) * p), w = Math.max(0, x1 - x0 - 1);
        x.fillStyle = j === 0 ? COL[F.id] : j === P.segs.length - 1 ? rgba(COL[F.id], 0.38) : rgba(COL[F.id], 0.68);
        x.fillRect(x0, Y + 26, w, 18);
        if (w > 12 && p > 0.9) T(x, String(q.u), x0 + w / 2, Y + 39, 10, '#0c1814', 700, 'center', MONO);
        acc += q.sec;
      });
      const rx = px(F.real * p);
      x.strokeStyle = PAL.ink; x.lineWidth = 1.6; x.beginPath(); x.moveTo(rx, Y + 23); x.lineTo(rx, Y + 47); x.stroke();
      T(x, F.flow, RX + 10, Y + 58, 10, PAL.muted, 500);
    });
    // 벽 하한 선
    const fy1 = 40 + RH * 3 - 6;
    x.setLineDash([3, 3]); x.strokeStyle = PAL.accent2; x.lineWidth = 1; x.beginPath(); x.moveTo(px(FLOOR) + 0.5, 38); x.lineTo(px(FLOOR) + 0.5, 42);
    FORMATS.forEach((F, i) => { x.moveTo(px(FLOOR) + 0.5, 40 + i * RH + 22); x.lineTo(px(FLOOR) + 0.5, 40 + i * RH + 48); });
    x.stroke(); x.setLineDash([]);
    T(x, `벽 하한 ${FLOOR}초`, px(FLOOR) + 4, 35, 10, PAL.accent2, 600, 'left', MONO);
    const step = AXIS <= 30 ? 6 : 10;
    for (let v = 0; v <= AXIS; v += step) T(x, v + 's', px(v), fy1 + 14, 10, PAL.muted, 500, v === 0 ? 'left' : 'center', MONO);
    // 틀이 있는 후보 수
    const shown = Math.round(matched);
    card(x, RX, 268, RW, 58);
    T(x, '틀이 있는 후보', RX + 12, 286, 10, PAL.muted, 500);
    T(x, `${shown}/${CANDS.length}`, RX + 12, 314, 26, shown === CANDS.length ? PAL.accent : PAL.ink, 700, 'left', MONO);
    const noFmt = CANDS.filter((c) => !WHICH[c.kind]).length, wait = CANDS.filter((c) => WHICH[c.kind] && !have(WHICH[c.kind])).length;
    T(x, `메뉴에 없어 못 만드는 후보 ${wait}장`, RX + 100, 302, 10.5, wait ? PAL.accent2 : PAL.ink, 600);
    T(x, `모음이라 틀이 없는 후보 ${noFmt}장`, RX + 100, 317, 10.5, PAL.muted, 500);
    s.lab.textContent = `0${L}  ${STEP[L - 1]}`;
  },
};
export default demo;
