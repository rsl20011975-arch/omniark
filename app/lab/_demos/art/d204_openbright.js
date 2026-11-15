/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/loop-seam-shot/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 5초짜리 세로 영상(바다 장면 → 창 있는 숙소 장면)이 끝나고 처음으로 돌아가는 자리(이음)를 만든다.
// 화면은 시간 t 의 함수다. 이음의 프레임 차는 코드가 이 장면을 64×114 회색으로 그려 마지막 프레임과 첫 프레임을 직접 비교해 구한다.
const LOOP = 5.0;         // 영상 한 바퀴 길이(초)
const END_EXP = 0.2;      // 마지막 구간 끝에서 화면 밝기에 곱하는 배율(0.2배)
const END_ZOOM = 0.5;     // 마지막 구간에서 카메라가 더 들어가는 줌(+0.5)
const OPEN_EXP = 0.8;    // 첫 장면이 열릴 때의 밝기 배율
const TAIL = 0.5;         // 끝 처리가 걸리는 시간(초)
const OPEN = 0.9;         // 첫 장면이 밝아지는 데 걸리는 시간(초)
const CUT = 25;           // 프레임 차가 이 값을 넘으면 컷(장면이 툭 바뀜)으로 센다
const TB = 2.5;           // 바다 장면에서 숙소 장면으로 바뀌는 시각(초)
const DUR = 8.0;          // 데모 길이 = 한 바퀴 반(초)
const GW = 64, GH = 114;  // 프레임 차를 재는 회색 화면 크기(px)
const PAL = { bg0: '#0c1814', bg1: '#15271f', ink: '#e8f1ea', muted: '#86a091', accent: '#7fe0a8', accent2: '#e8d27a', surface: '#12231c', line: 'rgba(232,241,234,.16)' };
const BAD = '#ff9a8a';
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif', HEAD = '"Black Han Sans", sans-serif';

const P = (t, a, d) => seg(t, a, a + d);
const out4 = (x) => 1 - Math.pow(1 - x, 4);

function cam(tt, L) {     // 시각 tt 의 카메라: 어느 장면인가, 줌, 중심, 밝기 배율
  const dip = E.inC(P(tt, TB - 0.5, 0.5));
  if (tt < TB) {
    const open = L >= 4 ? lerp(OPEN_EXP, 1, out4(P(tt, 0, OPEN))) : 1;
    return { room: false, z: 1.10 + 0.20 * out4(P(tt, 0, 2.0)) + 0.55 * dip, cx: 0.48 + 0.05 * E.inOutC(P(tt, 1.0, 1.5)), cy: 0.56 - 0.03 * out4(P(tt, 0, 2.0)) - 0.02 * dip, exp: open * (1 - 0.85 * dip) };
  }
  const a = P(tt, TB, 1.1), b = E.inOutC(P(tt, 3.3, 1.2)), fin = E.inC(P(tt, LOOP - TAIL, TAIL));
  return { room: true, z: 1.0 + 0.28 * b + (L >= 3 ? END_ZOOM * fin : 0), cx: 0.5 + 0.03 * b, cy: lerp(0.5, 0.43, b), exp: lerp(0.1, 1, out4(a)) * (L >= 2 ? 1 - (1 - END_EXP) * fin : 1) };
}

function sea(g) {         // 해 질 녘 바다 사진 느낌: 하늘 층, 해, 구름, 수평선 안개, 물결과 햇빛 반짝임
  const H = 200;
  let s = g.createLinearGradient(0, -40, 0, H);
  s.addColorStop(0, '#17233f'); s.addColorStop(0.45, '#4a4f7a'); s.addColorStop(0.8, '#d98a78'); s.addColorStop(1, '#ffd7a0');
  g.fillStyle = s; g.fillRect(-20, -40, 240, H + 40);
  [[90, 0.3], [48, 0.45], [22, 0.75]].forEach(([r, al]) => {
    const q = g.createRadialGradient(100, H - 4, 0, 100, H - 4, r * 2); q.addColorStop(0, `rgba(255,236,190,${al})`); q.addColorStop(1, 'rgba(255,200,140,0)');
    g.fillStyle = q; g.fillRect(-20, -40, 240, H + 40);
  });
  const r = rng(5);
  for (let i = 0; i < 9; i++) {
    const y = 55 + r() * 120, x = r() * 200, w = 30 + r() * 70, near = y > 130;
    g.fillStyle = near ? `rgba(255,170,140,${0.16 + 0.12 * r()})` : `rgba(110,110,165,${0.18 + 0.14 * r()})`;
    g.beginPath(); g.ellipse(x, y, w, 2.2 + r() * 3, 0, 0, 7); g.fill();
  }
  g.save(); g.beginPath(); g.rect(-20, 0, 240, H); g.clip();
  const sd = g.createRadialGradient(100, H - 6, 2, 100, H - 6, 15); sd.addColorStop(0, '#fff8e6'); sd.addColorStop(0.8, '#ffe3b0'); sd.addColorStop(1, 'rgba(255,220,160,0)');
  g.fillStyle = sd; g.beginPath(); g.arc(100, H - 6, 15, 0, 7); g.fill(); g.restore();
  s = g.createLinearGradient(0, H, 0, 400);
  s.addColorStop(0, '#e79a7c'); s.addColorStop(0.06, '#8b6f86'); s.addColorStop(0.25, '#2f4a6a'); s.addColorStop(1, '#0e1c2e');
  g.fillStyle = s; g.fillRect(-20, H, 240, 200);
  for (let i = 0; i < 46; i++) {
    const f = i / 45, y = H + 3 + Math.pow(f, 1.7) * 150, len = 10 + f * 50, x = r() * 200, al = 0.05 + 0.12 * r();
    g.strokeStyle = r() < 0.5 ? `rgba(255,215,170,${al})` : `rgba(8,18,34,${al * 1.6})`; g.lineWidth = 0.5 + f * 1.4;
    g.beginPath(); g.moveTo(x - len / 2, y); g.lineTo(x + len / 2, y); g.stroke();
  }
  for (let i = 0; i < 70; i++) {
    const f = i / 69, y = H + 2 + Math.pow(f, 1.5) * 150, sp = 4 + f * 38, x = 100 + (r() - 0.5) * sp * 2, len = 2 + f * 14;
    g.strokeStyle = `rgba(255,235,190,${0.5 * (1 - f * 0.6) * (0.4 + 0.6 * r())})`; g.lineWidth = 0.6 + f;
    g.beginPath(); g.moveTo(x - len / 2, y); g.lineTo(x + len / 2, y); g.stroke();
  }
  const hz = g.createLinearGradient(0, H - 8, 0, H + 10); hz.addColorStop(0, 'rgba(255,220,180,0)'); hz.addColorStop(0.5, 'rgba(255,225,190,.5)'); hz.addColorStop(1, 'rgba(255,200,160,0)');
  g.fillStyle = hz; g.fillRect(-20, H - 8, 240, 18);
}

function room(g) {        // 창이 있는 숙소: 따뜻한 벽, 창밖 바다, 커튼 주름, 창틀 그림자, 바닥에 번진 빛
  let s = g.createLinearGradient(0, 0, 0, 300); s.addColorStop(0, '#cdb99a'); s.addColorStop(1, '#a89071');
  g.fillStyle = s; g.fillRect(-20, -60, 240, 400);
  const wg = g.createRadialGradient(100, 150, 10, 100, 150, 150); wg.addColorStop(0, 'rgba(255,214,160,.55)'); wg.addColorStop(1, 'rgba(255,214,160,0)');
  g.fillStyle = wg; g.fillRect(-20, -60, 240, 400);
  g.save(); g.beginPath(); g.rect(40, 62, 120, 180); g.clip(); g.translate(40, 62); g.scale(0.6, 0.6); g.translate(0, -55); sea(g); g.restore();
  const sh = g.createLinearGradient(0, 62, 0, 90); sh.addColorStop(0, 'rgba(20,12,6,.38)'); sh.addColorStop(1, 'rgba(20,12,6,0)'); g.fillStyle = sh; g.fillRect(40, 62, 120, 28);
  g.strokeStyle = 'rgba(255,255,255,.07)'; g.lineWidth = 9; g.beginPath(); g.moveTo(52, 240); g.lineTo(110, 64); g.stroke();
  g.strokeStyle = '#f1ebe0'; g.lineWidth = 5; g.strokeRect(38, 60, 124, 184);
  g.fillStyle = '#e6dfd0'; g.fillRect(97.5, 62, 5, 180); g.fillRect(40, 115.5, 120, 5);
  g.strokeStyle = 'rgba(60,40,20,.35)'; g.lineWidth = 1; g.strokeRect(35.5, 57.5, 129, 189);
  s = g.createLinearGradient(0, 246, 0, 255); s.addColorStop(0, '#f4eee2'); s.addColorStop(1, '#cbbda3'); g.fillStyle = s; g.fillRect(28, 246, 144, 9);
  const ss = g.createLinearGradient(0, 255, 0, 275); ss.addColorStop(0, 'rgba(40,24,10,.35)'); ss.addColorStop(1, 'rgba(40,24,10,0)'); g.fillStyle = ss; g.fillRect(28, 255, 144, 20);
  const vb = g.createRadialGradient(118, 229, 1, 120, 232, 12); vb.addColorStop(0, '#f2dcc0'); vb.addColorStop(1, '#8f6a4c');
  g.fillStyle = vb; g.beginPath(); g.ellipse(120, 236, 8, 11, 0, 0, 7); g.fill();
  g.strokeStyle = '#4a3a22'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(120, 226); g.quadraticCurveTo(124, 200, 132, 186); g.moveTo(120, 226); g.quadraticCurveTo(114, 204, 108, 192); g.stroke();
  [[-20, 36], [164, 220]].forEach(([a, b]) => {
    for (let i = 0; i < 8; i++) {
      const x0 = a + (b - a) * i / 8, w = (b - a) / 8, cg = g.createLinearGradient(x0, 0, x0 + w, 0);
      cg.addColorStop(0, i % 2 ? '#8a6c58' : '#5f4637'); cg.addColorStop(1, i % 2 ? '#5f4637' : '#8a6c58'); g.fillStyle = cg; g.fillRect(x0, -60, w + 0.5, 400);
    }
  });
  g.fillStyle = 'rgba(30,18,8,.28)'; g.fillRect(36, -60, 3, 400); g.fillRect(161, -60, 3, 400);
  s = g.createLinearGradient(0, 292, 0, 420); s.addColorStop(0, '#6a4a33'); s.addColorStop(1, '#2e1f15'); g.fillStyle = s; g.fillRect(-20, 292, 240, 140);
  g.strokeStyle = 'rgba(20,10,4,.35)'; g.lineWidth = 0.8;
  for (let i = -6; i <= 6; i++) { g.beginPath(); g.moveTo(100 + i * 9, 292); g.lineTo(100 + i * 34, 420); g.stroke(); }
  g.fillStyle = '#e6dccb'; g.fillRect(-20, 286, 240, 6);
  const sp = g.createLinearGradient(0, 292, 0, 400); sp.addColorStop(0, 'rgba(255,214,160,.32)'); sp.addColorStop(1, 'rgba(255,214,160,0)');
  g.fillStyle = sp; g.beginPath(); g.moveTo(40, 292); g.lineTo(160, 292); g.lineTo(210, 400); g.lineTo(-10, 400); g.fill();
}

let GRAIN = null;
function paint(g, tt, L, m, big) {   // m = [가로배율, 세로배율, x이동, y이동]. 논리 크기 200×356 의 한 프레임
  const c = cam(tt, L);
  g.save(); g.setTransform(m[0], 0, 0, m[1], m[2], m[3]);
  g.save(); g.translate(100, 178); g.scale(c.z, c.z); g.translate(-c.cx * 200, -c.cy * 356);
  if (c.room) room(g); else sea(g);
  g.restore();
  if (big) {
    const v = g.createRadialGradient(100, 178, 90, 100, 178, 230); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.34)'); g.fillStyle = v; g.fillRect(0, 0, 200, 356);
    g.globalCompositeOperation = 'overlay'; g.globalAlpha = 0.14;
    for (let gx = 0; gx < 200; gx += 100) for (let gy = 0; gy < 356; gy += 100) g.drawImage(GRAIN, gx, gy, 100, 100);
    g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  }
  g.fillStyle = `rgba(4,8,10,${(1 - c.exp).toFixed(4)})`; g.fillRect(0, 0, 200, 356);
  g.restore();
}

const CACHE = {};
function stats(L) {       // 64×114 회색으로 10fps 프레임을 그려 밝기, 프레임 차, 이음의 프레임 차를 구한다
  if (CACHE[L]) return CACHE[L];
  const c = document.createElement('canvas'); c.width = GW; c.height = GH;
  const g = c.getContext('2d', { willReadFrequently: true });
  const gray = (tt) => {
    g.clearRect(0, 0, GW, GH); paint(g, tt, L, [GW / 200, GH / 356, 0, 0], false);
    const d = g.getImageData(0, 0, GW, GH).data, o = new Float32Array(GW * GH);
    for (let i = 0; i < o.length; i++) o[i] = 0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2];
    return o;
  };
  const ts = []; for (let i = 0; i < LOOP * 10; i++) ts.push(i / 10); ts.push(LOOP - 1 / 30);
  const fr = ts.map(gray), lum = fr.map((f) => f.reduce((a, b) => a + b, 0) / f.length);
  const mad = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]); return s / a.length; };
  let sum = 0; for (let i = 1; i < fr.length - 1; i++) sum += mad(fr[i], fr[i - 1]);
  return (CACHE[L] = { ts, lum, seam: mad(fr[fr.length - 1], fr[0]), avg: sum / (fr.length - 2) });
}

function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function card(x, X, Y, W, H) { x.fillStyle = PAL.surface; x.beginPath(); x.roundRect(X, Y, W, H, 6); x.fill(); x.strokeStyle = PAL.line; x.lineWidth = 1; x.stroke(); }

const demo = {
  dur: DUR, rest: 7.4, noCompare: false, levels: 4,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(9), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    return { main };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 4 : lv);   // 0 = 연출 전, 1 = 아무 처리 없음, 2 = 끝 어둡게, 3 = + 줌, 4 = + 첫 장면 어둡게 열기
    const Le = Math.max(1, L), st = stats(Le), x = s.main.getContext('2d');
    const tm = t % LOOP, lap = Math.floor(t / LOOP) + 1, since = t >= LOOP ? t - LOOP : 9;
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.1;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();
    const hit = st.seam > CUT;
    // 오른쪽: 세로 영상 화면
    const PX = 428, PY = 14, k = 186 / 200;
    x.save(); x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 18; x.shadowOffsetY = 6; x.fillStyle = '#000'; x.beginPath(); x.roundRect(PX, PY, 186, 331, 16); x.fill(); x.restore();
    x.save(); x.beginPath(); x.roundRect(PX, PY, 186, 331, 16); x.clip();
    paint(x, tm, Le, [2 * k, 2 * k, 2 * PX, 2 * PY], true);
    x.restore(); x.setTransform(2, 0, 0, 2, 0, 0);
    const fl = since < 0.5 ? 1 - since / 0.5 : 0;
    x.lineWidth = 1 + 3 * fl; x.strokeStyle = since < 0.5 ? (hit ? BAD : PAL.accent) : 'rgba(232,241,234,.28)'; x.beginPath(); x.roundRect(PX, PY, 186, 331, 16); x.stroke();
    if (since < 0.5) T(x, hit ? '툭!' : '이어짐', PX + 93, PY + 30, 22, hit ? BAD : PAL.accent, 700, 'center');
    T(x, `${lap}바퀴째 ${tm.toFixed(1)}초`, PX + 93, PY + 322, 11, 'rgba(255,255,255,.85)', 500, 'center', MONO);
    // 왼쪽 위 이름표(numeral): 현재 단계 번호 + 설명
    const desc = ['연출 전: 밝은 끝 장면에서 곧바로 첫 프레임', '아무 처리 없이 끝나고 다시 시작', `끝 ${TAIL}초 동안 밝기 ${END_EXP}배로`, `같은 ${TAIL}초에 줌 +${END_ZOOM}로 들어가기`, `첫 장면도 밝기 ${OPEN_EXP}배로 열기`][L];
    T(x, String(L), 20, 50, 40, PAL.accent, 400, 'left', HEAD);
    T(x, desc, 54, 36, 13, PAL.ink, 600);
    // 밝기 그래프
    card(x, 20, 64, 388, 128);
    T(x, '화면 평균 밝기 (0~255)', 30, 82, 11, PAL.muted, 500, 'left', MONO);
    const gx0 = 32, gw = 364, gy0 = 92, gh = 80, X = (v) => gx0 + v / DUR * gw, Y = (v) => gy0 + gh - Math.min(160, v) / 160 * gh;
    x.strokeStyle = PAL.line; x.lineWidth = 1; [0, 80, 160].forEach((v) => { x.beginPath(); x.moveTo(gx0, Y(v) + 0.5); x.lineTo(gx0 + gw, Y(v) + 0.5); x.stroke(); });
    const n = st.ts.length - 1, segA = st.ts.map((u, i) => [u, st.lum[i]]).concat([[LOOP, st.lum[n]]]);
    const segB = [[LOOP, st.lum[0]]]; for (let i = 1; i < n && LOOP + st.ts[i] <= DUR + 1e-6; i++) segB.push([LOOP + st.ts[i], st.lum[i]]);
    x.strokeStyle = PAL.accent; x.lineWidth = 1.8; x.lineJoin = 'round';
    [segA, segB].forEach((sg) => {
      x.beginPath(); let first = true;
      sg.forEach(([u, v]) => { if (u <= t + 1e-6) { first ? x.moveTo(X(u), Y(v)) : x.lineTo(X(u), Y(v)); first = false; } });
      x.stroke();
    });
    const endL = st.lum[st.lum.length - 1], startL = st.lum[0];
    x.setLineDash([3, 3]); x.strokeStyle = hit ? BAD : PAL.accent2; x.lineWidth = 1.2; x.beginPath(); x.moveTo(X(LOOP) + 0.5, gy0 - 2); x.lineTo(X(LOOP) + 0.5, gy0 + gh); x.stroke(); x.setLineDash([]);
    if (t >= LOOP) { x.strokeStyle = hit ? BAD : PAL.accent2; x.lineWidth = 2.2; x.beginPath(); x.moveTo(X(LOOP), Y(endL)); x.lineTo(X(LOOP), Y(startL)); x.stroke(); }
    const hv = tm > LOOP - 0.05 ? st.lum[n] : st.lum[Math.min(n - 1, Math.round(tm * 10))];
    x.fillStyle = PAL.ink; x.beginPath(); x.arc(X(t), Y(hv), 3.4, 0, 7); x.fill();
    T(x, `끝 ${endL.toFixed(0)} → 처음 ${startL.toFixed(0)}`, 398, 82, 11, hit ? BAD : PAL.accent2, 600, 'right', MONO);
    T(x, '0초', gx0, gy0 + gh + 11, 10, PAL.muted, 500, 'left', MONO); T(x, '5.0초에서 처음으로', X(LOOP) + 5, gy0 + gh + 11, 10, PAL.muted, 500, 'left', MONO);
    // 이음 프레임 차 눈금
    card(x, 20, 200, 388, 148);
    T(x, '이음 프레임 차: 마지막 프레임과 첫 프레임', 30, 218, 11, PAL.muted, 500, 'left', MONO);
    const bx = 34, bw = 352, SC = 70, pv = st.seam * E.outC(P(t, LOOP, 0.5));
    x.fillStyle = 'rgba(232,241,234,.1)'; x.beginPath(); x.roundRect(bx, 230, bw, 14, 3); x.fill();
    if (pv > 0.05) { x.fillStyle = hit ? BAD : PAL.accent; x.beginPath(); x.roundRect(bx, 230, Math.max(4, Math.min(1, pv / SC) * bw), 14, 3); x.fill(); }
    x.strokeStyle = PAL.accent2; x.lineWidth = 2; x.beginPath(); x.moveTo(bx + CUT / SC * bw, 226); x.lineTo(bx + CUT / SC * bw, 248); x.stroke();
    T(x, `컷 선 ${CUT}`, bx + CUT / SC * bw + 5, 258, 10.5, PAL.accent2, 600, 'left', MONO);
    T(x, '0', bx, 258, 10, PAL.muted, 500, 'left', MONO);
    T(x, pv.toFixed(1), 34, 297, 28, hit ? BAD : PAL.accent, 700, 'left', MONO);
    T(x, hit ? '컷 선을 넘는다. 장면이 툭 바뀌는 크기' : '컷 선 아래. 컷으로 세어지지 않는다', 130, 288, 12.5, PAL.ink, 600);
    T(x, '64×114 회색, 이 장면을 그려 코드가 계산한 값', 34, 334, 10.5, PAL.muted, 500, 'left', MONO);
  },
};
export default demo;
