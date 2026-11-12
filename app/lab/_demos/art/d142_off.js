/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/color-match/demo.js (build_pages.py). 직접 고치지 않는다
import { cl, seg, lerp, E, el } from "./helpers.js";

// 같은 장소를 다른 조명에서 찍은 두 컷. ① 회색 패치를 재서 색 치우침을 맞추고(컬러 매칭) ② 움직이는 차를 따라 라벨이 붙게 한다(모션 트래킹). 화면은 시간 t 의 함수다.
const MATCH = 0;                  // 컬러 매칭을 얼마나 적용할지(1 = 100%)
const LAG = 0;                    // 라벨이 추적점을 따라가는 지연(초). 0 이면 차에 딱 붙는다
const CAST = [1.2, .95, .55];    // 오른쪽 컷의 색 치우침(백열등처럼 붉고 노란 쪽). 1 = 치우침 없음
const PW = 308, PH = 174, CY0 = 106, X0 = 30, X1 = 214, M0 = .6, M1 = 3;   // 칸 크기 · 차 높이 · 차 출발·도착 x · 이동 시작·끝(초)
const PATCH = [26, 32, 34, 24];   // 회색 패치(x, y, 너비, 높이) — 두 컷 모두 같은 자리
const FONT = "'IBM Plex Sans KR',sans-serif", MONO = "'JetBrains Mono',monospace";
const carX = (t) => lerp(X0, X1, E.inOutC(seg(t, M0, M1)));

function scene(c, x, t) {
  c.setTransform(2, 0, 0, 2, 0, 0);
  const wg = c.createLinearGradient(0, 0, 0, 120); wg.addColorStop(0, '#c9d3e2'); wg.addColorStop(1, '#a9b6ca'); c.fillStyle = wg; c.fillRect(0, 0, PW, 122);
  c.fillStyle = '#d0d6e2'; c.fillRect(112, 18, 64, 46); c.strokeStyle = '#8d9ab0'; c.lineWidth = 3; c.strokeRect(112, 18, 64, 46); c.beginPath(); c.moveTo(144, 18); c.lineTo(144, 64); c.moveTo(112, 41); c.lineTo(176, 41); c.stroke();
  c.fillStyle = '#2f5fa8'; c.beginPath(); c.roundRect(238, 34, 40, 90, [4, 4, 0, 0]); c.fill(); c.fillStyle = '#e6c04a'; c.beginPath(); c.arc(246, 82, 2.4, 0, 6.3); c.fill();
  c.fillStyle = '#3f8a52'; [[290, 112, 18], [276, 116, 14], [300, 118, 12]].forEach(([px, py, r]) => { c.beginPath(); c.arc(px, py, r, 0, 6.3); c.fill(); });
  c.fillStyle = '#dcdcdc'; c.fillRect(PATCH[0] - 3, PATCH[1] - 3, PATCH[2] + 6, PATCH[3] + 6); c.fillStyle = '#808080'; c.fillRect(PATCH[0], PATCH[1], PATCH[2], PATCH[3]);
  const rg = c.createLinearGradient(0, 122, 0, PH); rg.addColorStop(0, '#6a7183'); rg.addColorStop(1, '#3c4250'); c.fillStyle = rg; c.fillRect(0, 122, PW, PH - 122);
  c.fillStyle = '#9aa3b4'; c.fillRect(0, 120, PW, 3); c.fillStyle = 'rgba(255,255,255,.55)'; for (let i = 0; i < 6; i++) c.fillRect(8 + i * 54, 158, 28, 3);
  const bob = .7 * Math.sin(t * 17) * Math.min(1, Math.abs(carX(t + .02) - carX(t - .02)) * 6);
  const y = CY0 + bob;
  c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(x + 37, CY0 + 38, 40, 5, 0, 0, 6.3); c.fill();
  const bg = c.createLinearGradient(0, y + 12, 0, y + 34); bg.addColorStop(0, '#e0483a'); bg.addColorStop(1, '#a92a20'); c.fillStyle = bg; c.beginPath(); c.roundRect(x, y + 12, 74, 22, 7); c.fill();
  c.fillStyle = '#c93a2e'; c.beginPath(); c.moveTo(x + 14, y + 13); c.lineTo(x + 24, y + 1); c.lineTo(x + 52, y + 1); c.lineTo(x + 63, y + 13); c.closePath(); c.fill();
  c.fillStyle = '#bcd7ee'; c.beginPath(); c.moveTo(x + 19, y + 13); c.lineTo(x + 26, y + 4); c.lineTo(x + 37, y + 4); c.lineTo(x + 37, y + 13); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(x + 41, y + 13); c.lineTo(x + 41, y + 4); c.lineTo(x + 51, y + 4); c.lineTo(x + 58, y + 13); c.closePath(); c.fill();
  c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(x + 6, y + 15, 60, 1.6);
  c.fillStyle = '#ffe9a8'; c.fillRect(x + 68, y + 18, 5, 4);
  [16, 58].forEach((wx) => { c.fillStyle = '#14161c'; c.beginPath(); c.arc(x + wx, y + 34, 7.5, 0, 6.3); c.fill(); c.fillStyle = '#a9aeb9'; c.beginPath(); c.arc(x + wx, y + 34, 3.6, 0, 6.3); c.fill(); });
}
function patchMean(d, w) {
  const o = [0, 0, 0]; let n = 0;
  for (let yy = PATCH[1] * 2 + 2; yy < (PATCH[1] + PATCH[3]) * 2 - 2; yy++) for (let xx = PATCH[0] * 2 + 2; xx < (PATCH[0] + PATCH[2]) * 2 - 2; xx++) { const i = (yy * w + xx) * 4; o[0] += d[i]; o[1] += d[i + 1]; o[2] += d[i + 2]; n++; }
  return o.map((v) => v / n);
}

const demo = {
  dur: 3.6, rest: 3.2, noCompare: false, levels: 3,
  mount(sp) {
    const cv = el('canvas', null, sp); cv.width = 1280; cv.height = 720;
    const mk = () => { const o = document.createElement('canvas'); o.width = PW * 2; o.height = PH * 2; return o; };
    const A = mk(), B = mk();
    return { ctx: cv.getContext('2d'), A, B, ac: A.getContext('2d', { willReadFrequently: true }), bc: B.getContext('2d', { willReadFrequently: true }) };
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 3 : lv);   // 1 = 색 안 맞고 라벨 고정, 2 = + 컬러 매칭, 3 = + 모션 트래킹
    const c = s.ctx;
    scene(s.ac, X1 - 20, 0);   // 기준 컷: 차가 서 있다
    const rmean = patchMean(s.ac.getImageData(0, 0, PW * 2, PH * 2).data, PW * 2);
    scene(s.bc, carX(t), t);
    const img = s.bc.getImageData(0, 0, PW * 2, PH * 2), d = img.data;
    for (let i = 0; i < d.length; i += 4) { d[i] = Math.min(255, d[i] * CAST[0]); d[i + 1] = Math.min(255, d[i + 1] * CAST[1]); d[i + 2] = Math.min(255, d[i + 2] * CAST[2]); }
    const bmean = patchMean(d, PW * 2);
    const gain = rmean.map((v, k) => v / bmean[k]);
    const p2 = L >= 2 ? E.outC(seg(t, 1, 1.8)) * MATCH : 0;
    const ge = gain.map((g) => lerp(1, g, p2));
    for (let i = 0; i < d.length; i += 4) { d[i] = Math.min(255, d[i] * ge[0]); d[i + 1] = Math.min(255, d[i + 1] * ge[1]); d[i + 2] = Math.min(255, d[i + 2] * ge[2]); }
    s.bc.putImageData(img, 0, 0);
    c.setTransform(2, 0, 0, 2, 0, 0);
    const bgr = c.createLinearGradient(0, 0, 0, 360); bgr.addColorStop(0, '#0b0f1a'); bgr.addColorStop(1, '#171e33'); c.fillStyle = bgr; c.fillRect(0, 0, 640, 360);
    const PX = [10, 322], PY = 48;
    c.drawImage(s.A, PX[0], PY, PW, PH); c.drawImage(s.B, PX[1], PY, PW, PH);
    const chip = (txt, x, y, col) => { c.font = `500 11px ${FONT}`; const w = c.measureText(txt).width + 14; c.fillStyle = 'rgba(8,10,20,.8)'; c.beginPath(); c.roundRect(x, y, w, 18, 9); c.fill(); c.fillStyle = col || '#fff'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(txt, x + 7, y + 9.5); };
    chip('기준 컷', PX[0] + 8, PY + PH - 26); chip('맞출 컷', PX[1] + 8, PY + PH - 26);
    // 패치 측정 표시
    if (L >= 2) { const pa = E.outC(seg(t, .7, 1.1)); c.globalAlpha = pa; c.strokeStyle = '#ff8a3d'; c.lineWidth = 1.4; PX.forEach((x0) => c.strokeRect(x0 + PATCH[0] - 4, PY + PATCH[1] - 4, PATCH[2] + 8, PATCH[3] + 8)); c.globalAlpha = 1; }
    // 라벨(SALE) · 추적
    const tw = Math.max(M0 - .2, t - LAG), lx = (L >= 3 ? carX(tw) : X0) + 37, ly = CY0 - 30;
    const pop = E.outBack(seg(t, .25, .65));
    const bx = PX[1] + lx, by = PY + ly;
    if (L >= 3) {
      for (let k = 1; k <= 9; k++) { const tk = t - k * .16; if (tk < M0) break; c.fillStyle = `rgba(255,138,61,${(.75 - k * .075).toFixed(2)})`; c.beginPath(); c.arc(PX[1] + carX(tk) + 37, PY + CY0 + 6, 2.2, 0, 6.3); c.fill(); }
      const tx = PX[1] + carX(t) + 37, ty = PY + CY0 + 6;
      c.strokeStyle = '#ff8a3d'; c.lineWidth = 1.6; c.lineCap = 'round';
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { c.beginPath(); c.moveTo(tx + sx * 14, ty + sy * 9 - sy * 5); c.lineTo(tx + sx * 14, ty + sy * 9); c.lineTo(tx + sx * 14 - sx * 6, ty + sy * 9); c.stroke(); });
      c.beginPath(); c.moveTo(tx - 4, ty); c.lineTo(tx + 4, ty); c.moveTo(tx, ty - 4); c.lineTo(tx, ty + 4); c.stroke();
    }
    c.save(); c.translate(bx, by); c.scale(Math.max(0, pop), Math.max(0, pop));
    c.fillStyle = '#ff8a3d'; c.beginPath(); c.roundRect(-34, -15, 68, 30, 8); c.fill(); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(-32, -14, 64, 1.6);
    c.fillStyle = '#1a0f06'; c.font = "400 21px 'Black Han Sans',sans-serif"; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('SALE', 0, 1.5); c.restore();
    // 아래 판: 컬러 매칭 / 모션 트래킹 숫자
    const card = (x, w) => { c.fillStyle = 'rgba(20,26,44,.9)'; c.beginPath(); c.roundRect(x, 232, w, 118, 10); c.fill(); c.strokeStyle = 'rgba(255,255,255,.1)'; c.lineWidth = 1; c.stroke(); };
    card(10, 308); card(322, 308);
    c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = '#fff'; c.font = `700 13px ${FONT}`;
    c.fillText('① 컬러 매칭 — 회색 패치 맞추기', 22, 248); c.fillText('② 모션 트래킹 — 라벨을 차에 붙이기', 334, 248);
    const rgb = (m) => `rgb(${m.map((v) => Math.round(v)).join(',')})`;
    const on2 = L >= 2 && p2 > .01;
    c.font = `500 11px ${MONO}`; c.fillStyle = '#cfd6e4';
    const sw = (x, col, lab) => { c.fillStyle = col; c.beginPath(); c.roundRect(x, 262, 30, 30, 6); c.fill(); c.strokeStyle = 'rgba(255,255,255,.3)'; c.stroke(); c.fillStyle = '#cfd6e4'; c.textAlign = 'center'; c.fillText(lab, x + 15, 304); c.textAlign = 'left'; };
    sw(22, rgb(bmean), '맞출 컷'); sw(102, rgb(rmean), '기준');
    c.strokeStyle = '#fff'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(60, 277); c.lineTo(94, 277); c.moveTo(88, 272); c.lineTo(94, 277); c.lineTo(88, 282); c.stroke();
    c.fillStyle = on2 ? '#fff' : 'rgba(255,255,255,.45)'; c.font = `500 12px ${MONO}`;
    c.fillText(`패치 측정 rgb(${bmean.map((v) => Math.round(v)).join(',')})`, 146, 270); c.fillText(`기준 값  rgb(${rmean.map((v) => Math.round(v)).join(',')})`, 146, 286);
    c.fillStyle = on2 ? '#ff8a3d' : 'rgba(255,255,255,.45)'; c.fillText(`게인 R×${gain[0].toFixed(2)} G×${gain[1].toFixed(2)} B×${gain[2].toFixed(2)}`, 22, 324);
    c.fillStyle = on2 ? '#fff' : 'rgba(255,255,255,.45)'; c.font = `500 11px ${FONT}`; c.fillText('적용 ' + Math.round(MATCH * 100) + '% — 컷 전체에 곱함', 22, 340);
    const on3 = L >= 3;
    c.font = `500 12px ${MONO}`; c.fillStyle = on3 ? '#fff' : 'rgba(255,255,255,.45)';
    c.fillText(on3 ? `추적점  x=${Math.round(carX(t) + 37)}  y=${CY0 + 6}` : '추적점  없음', 334, 270);
    c.fillText(on3 ? `라벨 오프셋  (0, -${6 + 30})` : '라벨은 처음 자리에 고정', 334, 286);
    c.fillStyle = on3 ? '#ff8a3d' : 'rgba(255,255,255,.45)'; c.fillText(on3 ? `지연 ${LAG.toFixed(2)}초 — 차 이동 ${Math.round(carX(t) - X0)}px 를 그대로 따라감` : `차는 ${Math.round(carX(t) - X0)}px 움직였지만 라벨은 0px`, 334, 324);
    c.fillStyle = on3 ? '#fff' : 'rgba(255,255,255,.45)'; c.font = `500 11px ${FONT}`; c.fillText(on3 ? '주황 점은 지난 프레임의 추적 위치' : '추적을 켜지 않으면 라벨이 어긋남', 334, 340);
    const txt = L === 1 ? '연출 전 · 색이 안 맞고 라벨이 제자리에 고정' : (L === 2 ? (on2 ? '컬러 매칭 · 회색 패치로 게인 계산' : '색이 안 맞고 라벨이 제자리에 고정') : (t > 1.8 ? '모션 트래킹 · 라벨이 차를 따라감' : '컬러 매칭 · 회색 패치로 게인 계산'));
    c.font = `500 14px ${FONT}`; const pw = c.measureText(txt).width + 28;
    c.fillStyle = 'rgba(8,10,20,.78)'; c.beginPath(); c.roundRect(10, 10, pw, 28, 14); c.fill(); c.fillStyle = '#fff'; c.textBaseline = 'middle'; c.fillText(txt, 24, 24.5);
  },
};
export default demo;
