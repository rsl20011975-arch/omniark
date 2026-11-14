/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/shorts-safe-zone/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 1080×1920 쇼츠 화면에서 앱의 글자·버튼이 덮을 수 있는 가장자리를 '안전영역'으로 두고, 제목·자막·스티커가 그 안에 있는지 코드가 잰다.
// 공장이 채택한 값(위 240, 아래 420, 왼 72, 오른 150)과 다른 출처의 값을 겹쳐 놓고 같은 요소가 어느 값에서 몇 px 넘는지 센다.
// 앱 UI 그림은 설명용 모형이다(실제 앱 위치는 이 페이지가 재지 않았다). 화면은 시간 t 의 함수다.
const SAFE_T = 380;       // 위쪽 여백(px). 공장 채택값 [기록, 공식 수치 아님]
const SAFE_B = 420;       // 아래쪽 여백(px)
const SAFE_L = 72;        // 왼쪽 여백(px)
const SAFE_R = 150;       // 오른쪽 여백(px)
const W = 1080, H = 1920;
const PAL = { bg0: '#0b0f1a', bg1: '#161d30', ink: '#f4efe4', muted: '#8b94a3', accent: '#ffb36b', accent2: '#ffd27a', surface: '#131a2b', line: 'rgba(244,239,228,.16)' };
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif', BLACK = '"Black Han Sans", sans-serif';

// 비교하는 여백 값. null 은 그 출처가 숫자를 주지 않은 변
const SETS = () => [
  { k: 'A', name: '채택값', t: SAFE_T, b: SAFE_B, l: SAFE_L, r: SAFE_R, col: '#ffb36b', grade: '기록' },
  { k: 'B', name: '광고 안내 인용', t: 288, b: 672, l: 48, r: 192, col: '#7fe0ff', grade: '2차' },
  { k: 'C', name: '릴스 인용', t: 269, b: 672, l: 65, r: 65, col: '#c9a6ff', grade: '2차' },
  { k: 'D', name: 'vidpros', t: 380, b: 380, l: null, r: null, col: '#8be28b', grade: '2차' },
  { k: 'E', name: 'blitzcut', t: null, b: 480, l: null, r: 216, col: '#ff8fa8', grade: '2차' },
];
// 요소 위치(1080×1920 좌표). 틀 없이 놓은 것과 채택값 안에 놓은 것
const ELS = [
  { id: '제목 띠', naive: { x0: 150, y0: 110, x1: 930, y1: 302 }, fit: { x0: 150, y0: 264, x1: 930, y1: 456 } },
  { id: '말자막', naive: { x0: 162, y0: 1566, x1: 918, y1: 1674 }, fit: { x0: 162, y0: 1166, x1: 918, y1: 1274 } },
  { id: '스티커', naive: { x0: 800, y0: 1080, x1: 1040, y1: 1200 }, fit: { x0: 690, y0: 1080, x1: 930, y1: 1200 } },
];
// 설명용 앱 UI 모형(실측 아님): 위 막대, 오른쪽 버튼 줄, 아래 제목·채널 칸
const MOCK = [{ x0: 0, y0: 0, x1: 1080, y1: 150 }, { x0: 960, y0: 1000, x1: 1056, y1: 1560 }, { x0: 0, y0: 1560, x1: 1080, y1: 1920 }];

const area = (r) => Math.max(0, r.x1 - r.x0) * Math.max(0, r.y1 - r.y0);
const inter = (a, b) => area({ x0: Math.max(a.x0, b.x0), y0: Math.max(a.y0, b.y0), x1: Math.min(a.x1, b.x1), y1: Math.min(a.y1, b.y1) });
const covered = (r) => MOCK.reduce((s, m) => s + inter(r, m), 0) / area(r);
function intrusion(r, s) {       // 요소가 그 값의 여백을 넘은 가장 큰 px, 값이 없는 변은 건너뜀
  const v = [];
  if (s.t != null) v.push(s.t - r.y0);
  if (s.b != null) v.push(r.y1 - (H - s.b));
  if (s.l != null) v.push(s.l - r.x0);
  if (s.r != null) v.push(r.x1 - (W - s.r));
  return Math.max(0, ...v);
}
const mix = (a, b, p) => ({ x0: lerp(a.x0, b.x0, p), y0: lerp(a.y0, b.y0, p), x1: lerp(a.x1, b.x1, p), y1: lerp(a.y1, b.y1, p) });

let GRAIN = null;
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function card(x, X, Y, Wd, Ht) { x.save(); x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 10; x.shadowOffsetY = 3; x.fillStyle = PAL.surface; x.beginPath(); x.roundRect(X, Y, Wd, Ht, 6); x.fill(); x.restore(); x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.roundRect(X, Y, Wd, Ht, 6); x.stroke(); }
const FX = 168, FY = 10, FH = 340, K = FH / H, FW = W * K;

function frameArt(x) {          // 영상 한 장면처럼 보이는 배경: 층진 빛, 보케, 비네팅
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2b3350'); g.addColorStop(0.45, '#5a4660'); g.addColorStop(0.8, '#c98a64'); g.addColorStop(1, '#3a2530'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  const r = rng(12);
  [[320, 520, 520, 'rgba(255,214,160,.42)'], [800, 900, 420, 'rgba(160,190,255,.22)'], [420, 1350, 560, 'rgba(255,160,110,.30)']].forEach(([cx, cy, rad, c]) => { const q = x.createRadialGradient(cx, cy, 0, cx, cy, rad); q.addColorStop(0, c); q.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = q; x.fillRect(cx - rad, cy - rad, rad * 2, rad * 2); });
  for (let i = 0; i < 26; i++) { const cx = r() * W, cy = 300 + r() * 1300, rad = 30 + r() * 80; x.fillStyle = `rgba(255,${200 + (r() * 40) | 0},${150 + (r() * 60) | 0},${0.06 + 0.12 * r()})`; x.beginPath(); x.arc(cx, cy, rad, 0, 7); x.fill(); }
  const v = x.createRadialGradient(540, 900, 500, 540, 960, 1300); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)'); x.fillStyle = v; x.fillRect(0, 0, W, H);
}
function mockUI(x, al) {         // 설명용 앱 UI 모형
  x.save(); x.globalAlpha = al;
  let g = x.createLinearGradient(0, 0, 0, 150); g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(1, 'rgba(0,0,0,.22)'); x.fillStyle = g; x.fillRect(0, 0, W, 150);
  g = x.createLinearGradient(0, 1560, 0, H); g.addColorStop(0, 'rgba(0,0,0,.25)'); g.addColorStop(1, 'rgba(0,0,0,.62)'); x.fillStyle = g; x.fillRect(0, 1560, W, H - 1560);
  x.fillStyle = 'rgba(255,255,255,.82)'; [1040, 1200, 1360, 1500].forEach((cy) => { x.beginPath(); x.arc(1008, cy, 40, 0, 7); x.fill(); });
  x.fillStyle = 'rgba(255,255,255,.7)'; x.beginPath(); x.arc(110, 1690, 34, 0, 7); x.fill(); x.fillRect(166, 1672, 300, 30);
  x.fillStyle = 'rgba(255,255,255,.55)'; x.fillRect(72, 1750, 760, 26); x.fillRect(72, 1796, 520, 26);
  x.fillStyle = 'rgba(255,255,255,.9)'; x.beginPath(); x.roundRect(820, 1664, 190, 56, 28); x.fill();
  x.restore();
}
function drawEl(x, id, r) {
  if (id === '제목 띠') {
    x.lineJoin = 'round'; x.textAlign = 'center';
    [['샌더 버리기 전에', '#ffffff', r.y0 + 78], ['고무 링부터 보세요', '#ffd640', r.y0 + 172]].forEach(([s, c, y]) => { x.font = `84px ${BLACK}`; x.lineWidth = 16; x.strokeStyle = 'rgba(10,10,18,.9)'; x.strokeText(s, (r.x0 + r.x1) / 2, y); x.fillStyle = c; x.fillText(s, (r.x0 + r.x1) / 2, y); });
  } else if (id === '말자막') {
    x.textAlign = 'center'; x.font = `800 88px ${SANS}`; x.lineJoin = 'round'; x.lineWidth = 18; x.strokeStyle = 'rgba(10,10,18,.9)'; const cy = (r.y0 + r.y1) / 2 + 30;
    const mw = x.measureText('고무 링이 닳았습니다').width; if (mw > 756) x.font = `800 ${Math.floor(88 * 756 / mw)}px ${SANS}`;   // 폭 756px 안에 들어가게 줄임
    x.strokeText('고무 링이 닳았습니다', 540, cy); x.fillStyle = '#fff'; x.fillText('고무 링이 닳았습니다', 540, cy);
  } else {
    const g = x.createLinearGradient(r.x0, r.y0, r.x0, r.y1); g.addColorStop(0, '#ffc76e'); g.addColorStop(1, '#f08a3c');
    x.save(); x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 24; x.shadowOffsetY = 10; x.fillStyle = g; x.beginPath(); x.roundRect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0, 26); x.fill(); x.restore();
    x.fillStyle = 'rgba(255,255,255,.28)'; x.beginPath(); x.roundRect(r.x0 + 8, r.y0 + 6, r.x1 - r.x0 - 16, 34, 18); x.fill();
    x.textAlign = 'center'; x.fillStyle = '#2a1608'; x.font = `800 38px ${SANS}`; x.fillText('고무 링 3천원', (r.x0 + r.x1) / 2, (r.y0 + r.y1) / 2 + 18);
  }
}
function drawFrame(x, t, a, L) {
  x.save(); x.translate(FX, FY); x.scale(K, K);
  x.save(); x.beginPath(); x.rect(0, 0, W, H); x.clip();
  frameArt(x);
  const mv = a ? E.inOutC(seg(t, 0.5, 1.7)) : 0;
  ELS.forEach((e) => drawEl(x, e.id, mix(e.naive, e.fit, mv)));
  mockUI(x, 0.9);
  if (a && L >= 1) {
    const za = E.outC(seg(t, 1.5, 2.3)), z = SETS()[0], inner = { x0: z.l, y0: z.t, x1: W - z.r, y1: H - z.b };
    x.save(); x.globalAlpha = za * 0.72; x.fillStyle = '#05070d'; x.beginPath(); x.rect(0, 0, W, H); x.rect(inner.x0, inner.y0, inner.x1 - inner.x0, inner.y1 - inner.y0); x.fill('evenodd'); x.restore();
    x.save(); x.globalAlpha = za; x.strokeStyle = z.col; x.lineWidth = 9; x.strokeRect(inner.x0, inner.y0, inner.x1 - inner.x0, inner.y1 - inner.y0);
    x.font = `700 46px ${MONO}`; x.fillStyle = z.col; x.textAlign = 'center';
    x.fillText(String(z.t), 540, z.t / 2 + 16); x.fillText(String(z.b), 540, H - z.b / 2 + 16);
    x.save(); x.translate(z.l / 2 + 4, 960); x.rotate(-Math.PI / 2); x.fillText(String(z.l), 0, 0); x.restore();
    x.save(); x.translate(W - z.r / 2 + 14, 960); x.rotate(-Math.PI / 2); x.fillText(String(z.r), 0, 0); x.restore();
    x.restore();
    if (L >= 2) SETS().slice(1).forEach((s, i) => {
      const on = E.outC(seg(t, 2.4 + 0.3 * i, 2.9 + 0.3 * i)); x.save(); x.globalAlpha = on; x.strokeStyle = s.col; x.lineWidth = 7; x.setLineDash([34, 22]);
      if (s.t != null) { x.beginPath(); x.moveTo(0, s.t); x.lineTo(W, s.t); x.stroke(); }
      if (s.b != null) { x.beginPath(); x.moveTo(0, H - s.b); x.lineTo(W, H - s.b); x.stroke(); }
      if (s.l != null) { x.beginPath(); x.moveTo(s.l, 0); x.lineTo(s.l, H); x.stroke(); }
      if (s.r != null) { x.beginPath(); x.moveTo(W - s.r, 0); x.lineTo(W - s.r, H); x.stroke(); }
      x.restore();
    });
  }
  x.restore();
  x.restore();
  x.save(); x.strokeStyle = 'rgba(244,239,228,.35)'; x.lineWidth = 1.2; x.beginPath(); x.roundRect(FX, FY, FW, FH, 6); x.stroke(); x.restore();
}
const STEP = ['틀 없이 배치', '채택값 틀 안에 놓기', '다른 출처 값과 겹치기', '요소별 넘는 px 재기'];
const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(41), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const lab = el('div', null, sp);   // 이름표(numeral): 왼쪽 위 큰 숫자와 옆 설명
    Object.assign(lab.style, { position: 'absolute', left: '12px', top: '8px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: '4' });
    const num = el('span', null, lab), dsc = el('span', null, lab);
    Object.assign(num.style, { font: `40px/1 ${BLACK}`, color: PAL.accent });
    Object.assign(dsc.style, { font: "600 13px/1.25 'IBM Plex Sans KR',sans-serif", color: PAL.ink, width: '72px' });
    return { main, num, dsc };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 0 : (lv == null ? 3 : lv);
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.1;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();
    drawFrame(x, t, a, L);

    // 왼쪽 안내
    const nt = ['9:16 = 1080×1920px', '앱 UI 는 설명용 모형', '실제 앱 위치는 [미확인]'];
    nt.forEach((ln, i) => T(x, ln, 12, 112 + i * 15, 10, i === 2 ? PAL.muted : PAL.ink, i === 2 ? 500 : 600));
    ELS.forEach((e, i) => { T(x, e.id, 12, 180 + i * 15, 10, PAL.muted, 500); });
    T(x, '제목 띠, 말자막, 스티커를 놓는다', 12, 166, 10, PAL.ink, 600);

    const sets = SETS(), z = sets[0];
    // 오른쪽 패널
    const PX = 366, PW = 266;
    if (L === 0) {
      card(x, PX, 10, PW, 124);
      T(x, '틀 없이 놓았을 때 가려지는 비율', PX + 12, 28, 11, PAL.ink, 700);
      T(x, 'UI 모형 기준, 코드가 센 값', PX + 12, 42, 9.5, PAL.muted, 500);
      ELS.forEach((e, i) => {
        const c = covered(e.naive), Y = 56 + i * 24;
        T(x, e.id, PX + 12, Y + 11, 11, PAL.ink, 600);
        x.fillStyle = 'rgba(244,239,228,.1)'; x.beginPath(); x.roundRect(PX + 74, Y + 2, 120, 10, 4); x.fill();
        x.fillStyle = PAL.accent; x.beginPath(); x.roundRect(PX + 74, Y + 2, Math.max(3, 120 * c * E.outC(seg(t, 0.2 + 0.2 * i, 1))), 10, 4); x.fill();
        T(x, `${(c * 100).toFixed(0)}%`, PX + PW - 12, Y + 12, 12, PAL.accent, 700, 'right', MONO);
      });
      T(x, '안전영역을 정하지 않으면 위치가 감으로 정해진다', PX + 12, 126, 9.5, PAL.muted, 500);
    } else {
      // 1단계: 채택값 카드
      const inW = W - z.l - z.r, inH = H - z.t - z.b;
      card(x, PX, 10, PW, 84);
      T(x, '공장 채택값 [기록]', PX + 12, 28, 11, PAL.ink, 700);
      T(x, '플랫폼 공식 수치가 아니다', PX + PW - 12, 28, 9.5, PAL.accent, 600, 'right');
      [['위', z.t], ['아래', z.b], ['왼', z.l], ['오른', z.r]].forEach(([n, v], i) => { T(x, n, PX + 12 + i * 62, 48, 9.5, PAL.muted, 500); T(x, `${v}`, PX + 12 + i * 62, 64, 15, PAL.accent, 700, 'left', MONO); });
      T(x, `쓸 수 있는 칸 ${inW}×${inH}px = 화면의 ${(inW * inH * 100 / (W * H)).toFixed(1)}%`, PX + 12, 84, 10, PAL.ink, 600, 'left', MONO);
    }
    if (L >= 2) {
      const k = E.outC(seg(t, 2.2, 3.0)), Y0 = 102;
      x.save(); x.globalAlpha = k; card(x, PX, Y0, PW, 122);
      T(x, '출처마다 다른 값', PX + 12, Y0 + 17, 11, PAL.ink, 700);
      T(x, '채택값만 [기록], 나머지는 2차', PX + 100, Y0 + 17, 9, PAL.muted, 500);
      ['위', '아래', '왼', '오른'].forEach((n, i) => T(x, n, PX + 124 + i * 36 + 28, Y0 + 31, 9.5, PAL.muted, 500, 'right'));
      sets.forEach((st, i) => {
        const Y = Y0 + 46 + i * 15;
        x.fillStyle = st.col; x.beginPath(); x.arc(PX + 18, Y - 3.5, 4, 0, 7); x.fill();
        T(x, st.name, PX + 28, Y, 10, PAL.ink, 600);
        [st.t, st.b, st.l, st.r].forEach((v, j) => T(x, v == null ? '–' : String(v), PX + 124 + j * 36 + 28, Y, 10, v == null ? PAL.muted : PAL.ink, 600, 'right', MONO));
      });
      const bs = sets.map((q) => q.b).filter((v) => v != null), ts = sets.map((q) => q.t).filter((v) => v != null);
      T(x, `아래 ${Math.min(...bs)}~${Math.max(...bs)}, 위 ${Math.min(...ts)}~${Math.max(...ts)}로 값이 벌어져 있다`, PX + 12, Y0 + 119, 9.5, PAL.accent, 600);
      x.restore();
    }
    if (L >= 3) {
      const k = E.outC(seg(t, 3.6, 4.5)), Y0 = 232;
      x.save(); x.globalAlpha = k; card(x, PX, Y0, PW, 118);
      T(x, '채택값 위치가 각 값에서 넘는 px', PX + 12, Y0 + 17, 11, PAL.ink, 700);
      sets.forEach((st, j) => { x.fillStyle = st.col; x.beginPath(); x.arc(PX + 98 + j * 33 + 12, Y0 + 30, 4, 0, 7); x.fill(); T(x, st.k, PX + 98 + j * 33 + 21, Y0 + 34, 9, PAL.muted, 600); });
      ELS.forEach((e, i) => {
        const Y = Y0 + 50 + i * 17;
        T(x, e.id, PX + 12, Y, 10, PAL.ink, 600);
        sets.forEach((st, j) => {
          const v = intrusion(e.fit, st), bad = v > 0;
          T(x, bad ? String(Math.round(v)) : '안', PX + 98 + j * 33 + 24, Y, 10, bad ? '#ff9b7a' : '#8fe0a8', 700, 'right', MONO);
        });
      });
      T(x, '0 이면 ‘안’. 값이 없는 변은 재지 않음', PX + 12, Y0 + 106, 9.5, PAL.muted, 500);
      x.restore();
    }
    s.num.textContent = String(L); s.dsc.textContent = STEP[L];
  },
};
export default demo;
