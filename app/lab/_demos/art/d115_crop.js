/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/tracking-stabilize/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 손으로 들고 찍어 흔들리는 거리 영상에서 ① 표지판을 트래킹해 글자 카드를 붙이고 ② 그 경로를 거꾸로 써서 떨림을 보정(스태빌라이즈)한다. 화면은 시간 t 의 함수다.
const SHAKE = 10;             // 손떨림 크기(px, 가로 기준. 세로는 0.7배)
const PAN = 60;               // 카메라가 천천히 오른쪽으로 움직이는 거리(px, 의도한 움직임)
const MODE = 'smooth';        // 보정 방식: 'smooth'(떨림만 없앰) 또는 'lock'(모든 움직임을 없애 한 자리에 고정)
const SMOOTH = .6;            // 'smooth' 에서 이동 평균을 내는 시간 폭(초)
const CROP = 1.25;             // 보정 뒤 화면을 확대해 잘라내는 배율
const DUR = 6.0, HZ = 120;
const SIGN = [500, 235];      // 표지판 중심(세계 좌표)
const WX = 160, WY = 90;      // 카메라가 가운데 있을 때 화면 왼쪽 위가 놓이는 세계 좌표
const FONT = '40px "Black Han Sans"';
const PAL = { bg0: '#a9402c', bg1: '#8f3322', ink: '#fff4ec', muted: '#ffd9c9', accent: '#ffe27a', accent2: '#1d1a16', surface: '#b24a34', line: 'rgba(255,244,236,.3)' };
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

function cv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

function path() {             // 카메라 위치 표 c(t) = 천천한 이동 + 떨림, 이동 평균(smooth) 표
  const n = Math.ceil(DUR * HZ) + 1, cx = new Float32Array(n), cy = new Float32Array(n), ax = new Float32Array(n), ay = new Float32Array(n);
  const T = Math.PI * 2;
  for (let i = 0; i < n; i++) {
    const t = i / HZ;
    cx[i] = PAN * t / DUR + SHAKE * (.5 * Math.sin(T * 3.1 * t + 1.3) + .3 * Math.sin(T * 7.3 * t + .4) + .2 * Math.sin(T * 11.7 * t + 2.2));
    cy[i] = SHAKE * .7 * (.5 * Math.sin(T * 2.6 * t + .2) + .3 * Math.sin(T * 6.1 * t + 1.9) + .2 * Math.sin(T * 10.3 * t + .7));
  }
  const h = Math.round(SMOOTH * HZ / 2);
  for (let i = 0; i < n; i++) {
    let sx = 0, sy = 0, c = 0;
    for (let k = Math.max(0, i - h); k <= Math.min(n - 1, i + h); k++) { sx += cx[k]; sy += cy[k]; c++; }
    ax[i] = sx / c; ay[i] = sy / c;
  }
  return { cx, cy, ax, ay };
}

function paintWorld(c) {      // 960×540 세계(2배 해상도): 하늘·건물·길·표지판
  const x = c.getContext('2d'); x.setTransform(2, 0, 0, 2, 0, 0);
  const r = rng(40);
  let g = x.createLinearGradient(0, 0, 0, 340); g.addColorStop(0, PAL.bg1); g.addColorStop(.7, '#d0714a'); g.addColorStop(1, '#ffc98a');
  x.fillStyle = g; x.fillRect(0, 0, 960, 540);
  [[190, .22, '#c47a5e'], [230, .35, '#8a4a3c']].forEach(([top, al, col], k) => {      // 먼 건물 실루엣
    x.fillStyle = col; x.globalAlpha = al * 2;
    for (let px = -20 + k * 40; px < 980; px += 70 + r() * 30) x.fillRect(px, top - r() * 50, 60 + r() * 20, 400);
    x.globalAlpha = 1;
  });
  const cols = ['#2a1e1b', '#3a2824', '#33211d', '#40302a'];
  let px = -30;
  while (px < 990) {
    const w = 92 + Math.floor(r() * 40), h = 170 + Math.floor(r() * 100), top = 390 - h;
    const bg = x.createLinearGradient(px, top, px + w, top + h); bg.addColorStop(0, cols[Math.floor(r() * 4)]); bg.addColorStop(1, '#1a1210');
    x.fillStyle = bg; x.fillRect(px, top, w, h);
    for (let wy = top + 14; wy < 360; wy += 26) for (let wx = px + 10; wx < px + w - 14; wx += 22) {
      const lit = r() > .45;
      x.fillStyle = lit ? `rgba(255,${200 + Math.floor(r() * 40)},${100 + Math.floor(r() * 40)},.9)` : 'rgba(14,8,6,.55)'; x.fillRect(wx, wy, 12, 15);
    }
    x.fillStyle = 'rgba(255,244,236,.1)'; x.fillRect(px, top, 3, h);
    px += w + 4;
  }
  g = x.createLinearGradient(0, 390, 0, 540); g.addColorStop(0, '#3a2c28'); g.addColorStop(1, '#1a1210');
  x.fillStyle = g; x.fillRect(0, 390, 960, 150);
  x.fillStyle = '#7a5a4e'; x.fillRect(0, 390, 960, 14);
  x.fillStyle = 'rgba(255,244,236,.55)'; for (let dx = 20; dx < 960; dx += 90) x.fillRect(dx, 470, 50, 5);
  // 가로등
  x.fillStyle = '#1a1210'; x.fillRect(250, 210, 5, 180); x.fillRect(250, 210, 28, 4);
  const lg = x.createRadialGradient(280, 218, 0, 280, 218, 40); lg.addColorStop(0, 'rgba(255,226,122,.8)'); lg.addColorStop(1, 'rgba(255,226,122,0)'); x.fillStyle = lg; x.fillRect(240, 178, 80, 80);
  x.fillStyle = '#fff0b8'; x.beginPath(); x.arc(280, 218, 6, 0, 7); x.fill();
  // 표지판(추적할 대상): 기둥 + 둥근 간판
  x.fillStyle = '#1a1210'; x.fillRect(SIGN[0] - 3, SIGN[1] + 26, 6, 220);
  const sg = x.createRadialGradient(SIGN[0] - 8, SIGN[1] - 10, 2, SIGN[0], SIGN[1], 34); sg.addColorStop(0, PAL.accent); sg.addColorStop(1, '#d9a020');
  x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = 10; x.shadowOffsetY = 4;
  x.fillStyle = sg; x.beginPath(); x.arc(SIGN[0], SIGN[1], 33, 0, 7); x.fill(); x.shadowColor = 'transparent';
  x.fillStyle = PAL.ink; x.beginPath(); x.arc(SIGN[0], SIGN[1], 25, 0, 7); x.fill();
  x.fillStyle = '#3a1d10'; x.textAlign = 'center'; x.font = '400 17px "Black Han Sans", sans-serif'; x.fillText('CAFE', SIGN[0], SIGN[1] + 6);
  x.strokeStyle = 'rgba(255,255,255,.6)'; x.lineWidth = 1.4; x.beginPath(); x.arc(SIGN[0], SIGN[1], 33, 3.5, 5); x.stroke();
}

const demo = {
  dur: DUR, rest: 4.2, noCompare: false, levels: 3,
  mount(sp) {
    const css = (e, o) => Object.assign(e.style, o);
    const main = el('canvas', null, sp);
    main.width = 1280; main.height = 720; css(main, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const pill = el('div', null, sp);                        // 왼쪽 아래 캡션: 배경 없이 얇은 선 + 모노 12px
    css(pill, { position: 'absolute', left: '20px', bottom: '12px', paddingTop: '6px', borderTop: `1px solid ${PAL.line}`, color: PAL.muted, font: "500 12px/1.3 'JetBrains Mono','IBM Plex Sans KR',monospace", letterSpacing: '.02em', textShadow: '0 1px 4px rgba(0,0,0,.75)' });
    const s = { main, pill, p: path(), world: cv(1920, 1080), fr: cv(1280, 720), ok: null };
    paintWorld(s.world);
    return s;
  },
  render(s, t, a, lv) {
    const okNow = document.fonts.check(FONT);
    if (s.ok !== okNow) { s.ok = okNow; paintWorld(s.world); }
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 흔들리는 원본(카드 고정), 2 = 트래킹, 3 = + 스태빌라이즈
    const P = s.p, n = P.cx.length;
    const at = (tt) => Math.min(n - 1, Math.max(0, Math.round(tt * HZ)));
    const crop = L >= 3 ? CROP : 1;
    const out = (tt) => {                      // 시각 tt 에 표지판이 화면(출력)에서 놓이는 곳
      const i = at(tt), fx = SIGN[0] - WX - P.cx[i], fy = SIGN[1] - WY - P.cy[i];
      if (L < 3) return [fx, fy];
      const tx = MODE === 'lock' ? P.cx[0] : P.ax[i], ty = MODE === 'lock' ? P.cy[0] : P.ay[i], dx = P.cx[i] - tx, dy = P.cy[i] - ty;
      return [(fx - 320 + dx) * crop + 320, (fy - 180 + dy) * crop + 180];
    };
    const i = at(t), x = s.main.getContext('2d');
    s.fr.getContext('2d').drawImage(s.world, (WX + P.cx[i]) * 2, (WY + P.cy[i]) * 2, 1280, 720, 0, 0, 1280, 720);
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    x.fillStyle = '#000'; x.fillRect(0, 0, 640, 360);
    x.save();
    if (L >= 3) {
      const tx = MODE === 'lock' ? P.cx[0] : P.ax[i], ty = MODE === 'lock' ? P.cy[0] : P.ay[i];
      x.translate(320, 180); x.scale(crop, crop); x.translate(-320 + (P.cx[i] - tx), -180 + (P.cy[i] - ty));
    }
    x.drawImage(s.fr, 0, 0, 640, 360);
    x.restore();
    const [sx, sy] = out(t);
    const tag = (px, py, dim) => {                       // 글자 카드
      x.save(); x.globalAlpha = dim; x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 10; x.shadowOffsetY = 3;
      const g = x.createLinearGradient(0, py - 18, 0, py + 14); g.addColorStop(0, '#ffffff'); g.addColorStop(1, PAL.muted);
      x.fillStyle = g; x.beginPath(); x.roundRect(px - 62, py - 18, 124, 30, 8); x.moveTo(px - 6, py + 12); x.lineTo(px, py + 20); x.lineTo(px + 6, py + 12); x.fill(); x.shadowColor = 'transparent';
      x.fillStyle = '#3a1d10'; x.textAlign = 'center'; x.font = '600 13px "IBM Plex Sans KR", sans-serif'; x.fillText('영업 중 · 9–21시', px, py + 2); x.restore();
    };
    if (L <= 1) { const [fx, fy] = out(0); tag(fx, fy - 52, 1); }
    else {
      x.strokeStyle = rgba(PAL.accent, .85); x.lineWidth = 1.5; x.beginPath();
      for (let k = 15; k >= 0; k--) { const [qx, qy] = out(Math.max(0, t - k * .05)); k === 15 ? x.moveTo(qx, qy) : x.lineTo(qx, qy); }
      x.stroke();
      for (let k = 15; k >= 0; k--) { const [qx, qy] = out(Math.max(0, t - k * .05)); x.fillStyle = `rgba(255,226,122,${(1 - k / 16).toFixed(2)})`; x.beginPath(); x.arc(qx, qy, 2.2, 0, 7); x.fill(); }
      const b = 30, c = 9; x.strokeStyle = PAL.accent; x.lineWidth = 2.2;
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([ux, uy]) => { x.beginPath(); x.moveTo(sx + ux * b, sy + uy * (b - c)); x.lineTo(sx + ux * b, sy + uy * b); x.lineTo(sx + ux * (b - c), sy + uy * b); x.stroke(); });
      tag(sx, sy - 56 * crop, 1);
    }
    let lo = [1e9, 1e9], hi = [-1e9, -1e9];
    for (let k = 0; k <= 10; k++) { const q = out(Math.max(0, t - k * .05)); lo = [Math.min(lo[0], q[0]), Math.min(lo[1], q[1])]; hi = [Math.max(hi[0], q[0]), Math.max(hi[1], q[1])]; }
    x.fillStyle = rgba(PAL.accent2, .84); x.beginPath(); x.roundRect(398, 12, 230, L >= 3 ? 62 : 46, 6); x.fill(); x.strokeStyle = PAL.line; x.lineWidth = 1; x.stroke();
    x.fillStyle = PAL.accent; x.textAlign = 'left'; x.font = '500 11px "IBM Plex Sans KR", sans-serif'; x.fillText('표지판이 화면에서 움직인 범위(최근 0.5초)', 408, 28);
    x.fillStyle = PAL.ink; x.font = '500 12.5px "JetBrains Mono", monospace'; x.fillText(`가로 ${(hi[0] - lo[0]).toFixed(1)}px · 세로 ${(hi[1] - lo[1]).toFixed(1)}px`, 408, 46);
    if (L >= 3) x.fillText(`확대 ×${CROP.toFixed(2)} · ${MODE === 'lock' ? '완전 고정' : '부드럽게'}`, 408, 64);
    s.pill.textContent = L <= 1 ? '01 / 흔들리는 원본, 글자 카드가 화면에 고정돼 어긋남' : L === 2 ? '02 / 트래킹, 표지판을 따라가며 글자 카드가 붙음' : MODE === 'lock' ? '03 / 스태빌라이즈(완전 고정), 모든 움직임을 지움' : '03 / 스태빌라이즈(부드럽게), 떨림만 거꾸로 보정';
  },
};
export default demo;
