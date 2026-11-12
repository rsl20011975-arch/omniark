/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/speed-ramp-freeze/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 농구공이 림으로 날아가는 장면의 '재생 속도'만 바꾼다. 같은 장면을 ① 일정한 속도 ② 느려졌다 빨라지는 속도 램프 ③ 림에 닿는 순간 멈춘 정지 프레임으로 비교한다. 화면은 시간 t 의 함수다.
const SLOW = .3;              // 슬로모션 구간의 재생 속도(1 = 원래 속도)
const FAST = 1.4;             // 램프가 끝난 뒤의 재생 속도
const FREEZE = .8;            // 정지 프레임이 멈춰 있는 시간(초)
const VIGN = .55;             // 정지하는 동안 화면 가장자리를 어둡게 하는 정도(0~1)
const FZ = 2.0;               // 멈추는 지점(장면 시간, 공이 림에 닿는 순간)
const T_START = .3;           // 영상이 시작하고 공이 움직이기 전까지 기다리는 시간(초)
const DUR = 6.6, HZ = 240, TEND = 3.2;
const FONT = '40px "Black Han Sans"';
const RIM = [500, 168];       // 림 중심(640×360 기준)

function cv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

function prof(c) {            // 장면 시간 c 에서의 재생 속도 곡선(시간 리매핑 그래프)
  if (c < .8) return 1;
  if (c < 1.2) return lerp(1, SLOW, E.inOutC((c - .8) / .4));
  if (c < 1.9) return SLOW;
  if (c < 2.3) return lerp(SLOW, FAST, E.inOutC((c - 1.9) / .4));
  return FAST;
}

function sim(mode) {          // 실제 시간 t → 장면 시간 τ 표를 미리 계산(0 = 일정, 1 = 램프, 2 = 램프 + 정지)
  const n = Math.ceil(DUR * HZ) + 2, tau = new Float32Array(n);
  let c = 0, held = 0, fs = -1, fe = -1;
  for (let i = 0; i < n; i++) {
    tau[i] = c;
    if (i / HZ < T_START) continue;
    if (mode === 2 && c >= FZ && held < FREEZE) { if (fs < 0) fs = i / HZ; held += 1 / HZ; fe = i / HZ; continue; }
    c += (mode === 0 ? 1 : prof(c)) / HZ;
    if (mode === 2 && held === 0 && c > FZ) c = FZ;
    c = Math.min(c, TEND);
  }
  return { tau, fs, fe: fe < 0 ? -1 : fe + 1 / HZ };
}

function ballAt(c) {          // 장면 시간 c 에서 공의 위치(640×360 기준)
  const k = Math.min(c, TEND);
  if (k <= 2) { const u = k / 2; return [lerp(80, RIM[0], u), lerp(300, RIM[1], u) - 4 * 150 * u * (1 - u)]; }
  const s = k - 2, sf = .412;
  if (s < sf) return [RIM[0] + 6 * s, RIM[1] + 150 * s + 520 * s * s];
  const d = Math.min(1, (s - sf) / .7), g = d * 2 - 1;
  return [RIM[0] + 6 * s, 318 - 80 * (1 - g * g)];
}

function paintBg(c, r) {
  const x = c.getContext('2d'), W = 1280, H = 720;
  let g = x.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#0b0f1a'); g.addColorStop(.55, '#1a2238'); g.addColorStop(.62, '#2a1d14'); g.addColorStop(1, '#14100c');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  for (let i = 0; i < 28; i++) {                                // 관중석 불빛(반경이 다른 보케)
    const px = r() * W, py = 30 + r() * 330, rad = 14 + r() * 38, hue = [[255, 190, 110], [150, 190, 255], [255, 140, 120]][Math.floor(r() * 3)];
    const rg = x.createRadialGradient(px, py, 0, px, py, rad); rg.addColorStop(0, `rgba(${hue},${.14 + r() * .2})`); rg.addColorStop(1, `rgba(${hue},0)`);
    x.fillStyle = rg; x.fillRect(px - rad, py - rad, rad * 2, rad * 2);
  }
  const fl = x.createLinearGradient(0, 600, 0, H);              // 나무 바닥
  fl.addColorStop(0, '#8a5a30'); fl.addColorStop(1, '#3c2412');
  x.fillStyle = fl; x.fillRect(0, 600, W, H - 600);
  x.strokeStyle = 'rgba(0,0,0,.25)'; x.lineWidth = 2;
  for (let i = -6; i < 24; i++) { x.beginPath(); x.moveTo(640 + (i - 9) * 40, 600); x.lineTo(640 + (i - 9) * 150, H); x.stroke(); }
  const gl = x.createLinearGradient(0, 600, 0, 640); gl.addColorStop(0, 'rgba(255,230,190,.35)'); gl.addColorStop(1, 'rgba(255,230,190,0)');
  x.fillStyle = gl; x.fillRect(0, 600, W, 40);
  const [rx, ry] = RIM.map((v) => v * 2);
  x.fillStyle = '#2c3140'; x.fillRect(rx + 84, ry + 8, 18, 640 - ry - 8 - 40);          // 기둥
  const bb = x.createLinearGradient(rx + 60, 0, rx + 140, 0); bb.addColorStop(0, 'rgba(210,225,245,.42)'); bb.addColorStop(1, 'rgba(160,185,220,.22)');
  x.fillStyle = bb; x.fillRect(rx + 56, ry - 150, 78, 190);                                // 백보드
  x.strokeStyle = 'rgba(255,255,255,.75)'; x.lineWidth = 4; x.strokeRect(rx + 56, ry - 150, 78, 190); x.strokeRect(rx + 66, ry - 40, 48, 46);
  x.strokeStyle = '#e8641c'; x.lineWidth = 9;                                            // 림 뒤쪽 반
  x.beginPath(); x.ellipse(rx, ry, 48, 12, 0, Math.PI, Math.PI * 2); x.stroke();
  x.fillStyle = '#e8641c'; x.fillRect(rx + 44, ry - 6, 16, 10);
}

function paintFg(c) {
  const x = c.getContext('2d'), [rx, ry] = RIM.map((v) => v * 2);
  x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 2.5;                              // 그물
  for (let i = 0; i <= 8; i++) { const a = i / 8, tx = lerp(-46, 46, a), bx = lerp(-26, 26, a); x.beginPath(); x.moveTo(rx + tx, ry + 4); x.lineTo(rx + bx, ry + 90); x.stroke(); }
  for (let j = 1; j <= 4; j++) { const q = j / 4.5, w = lerp(46, 26, q); x.beginPath(); x.ellipse(rx, ry + 4 + 86 * q, w, 5, 0, 0, Math.PI); x.stroke(); }
  x.strokeStyle = '#ff7a2a'; x.lineWidth = 9;                                              // 림 앞쪽 반
  x.beginPath(); x.ellipse(rx, ry, 48, 12, 0, 0, Math.PI); x.stroke();
  x.strokeStyle = 'rgba(255,230,200,.55)'; x.lineWidth = 2;
  x.beginPath(); x.ellipse(rx, ry - 1, 47, 11, 0, .15, Math.PI - .15); x.stroke();
}

function drawBall(x, px, py, rot, a) {
  const R = 14;
  x.save(); x.globalAlpha = a; x.translate(px, py);
  x.beginPath(); x.arc(0, 0, R, 0, Math.PI * 2); x.clip();
  const g = x.createRadialGradient(-R * .4, -R * .45, 1, 0, 0, R * 1.15);
  g.addColorStop(0, '#ffc78a'); g.addColorStop(.45, '#ea7a24'); g.addColorStop(1, '#8a3a0c');
  x.fillStyle = g; x.fillRect(-R, -R, R * 2, R * 2);
  x.rotate(rot); x.strokeStyle = 'rgba(40,16,4,.8)'; x.lineWidth = 1.3;
  x.beginPath(); x.moveTo(-R, 0); x.lineTo(R, 0); x.moveTo(0, -R); x.lineTo(0, R); x.stroke();
  x.beginPath(); x.arc(-R * 1.5, 0, R * 1.1, -1, 1); x.moveTo(0, 0); x.arc(R * 1.5, 0, R * 1.1, Math.PI - 1, Math.PI + 1); x.stroke();
  x.restore();
}

const demo = {
  dur: DUR, rest: 4.9, noCompare: false, levels: 3,
  mount(sp) {
    const r = rng(33), css = (e, o) => Object.assign(e.style, o);
    const main = el('canvas', null, sp);
    main.width = 1280; main.height = 720; css(main, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const pill = el('div', null, sp);
    css(pill, { position: 'absolute', left: '20px', top: '18px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.72)', color: '#fff', font: "500 15px/1 'IBM Plex Sans KR',sans-serif" });
    const badge = el('div', null, sp);
    css(badge, { position: 'absolute', right: '20px', top: '14px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(8,10,20,.72)', color: '#fff', font: "500 22px/1 'JetBrains Mono',monospace", minWidth: '88px', textAlign: 'center' });
    const modes = [0, 1, 2].map(sim);
    const s = { main, pill, badge, modes, bg: cv(1280, 720), fg: cv(1280, 720), ok: null };
    paintBg(s.bg, r); paintFg(s.fg);
    return s;
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 일정한 속도(기준), 2 = 속도 램프, 3 = + 정지 프레임
    const mode = L <= 1 ? 0 : L === 2 ? 1 : 2, m = s.modes[mode];
    const i = Math.min(m.tau.length - 2, Math.max(0, Math.round(t * HZ))), tau = m.tau[i];
    const rate = (k) => (mode === 0 ? (k / HZ >= T_START ? 1 : 0) : (m.tau[k + 1] - m.tau[k]) * HZ);   // 그 시각의 재생 속도
    const spd = Math.min(2, rate(i));
    const frozen = mode === 2 && m.fs >= 0 && t >= m.fs && t < m.fe;
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
    x.drawImage(s.bg, 0, 0, 640, 360);
    const [bx, by] = ballAt(tau), floorH = Math.max(0, Math.min(1, (318 - by) / 240));
    x.fillStyle = `rgba(0,0,0,${(.42 - .22 * floorH).toFixed(3)})`;                          // 바닥 그림자
    x.beginPath(); x.ellipse(bx, 326, 17 * (1 - .35 * floorH), 5 * (1 - .3 * floorH), 0, 0, Math.PI * 2); x.fill();
    const tr = Math.min(1, spd) * .045;                                                       // 속도에 비례하는 잔상
    for (let k = 5; k >= 1; k--) { const [gx, gy] = ballAt(Math.max(0, tau - k * tr * (1 + .4 * (spd > 1 ? spd - 1 : 0)))); if (tr > .004) drawBall(x, gx, gy, tau * 6, .1 + .05 * (6 - k)); }
    drawBall(x, bx, by, tau * 6, 1);
    x.drawImage(s.fg, 0, 0, 640, 360);
    if (frozen) {                                                                             // 정지 프레임 강조
      const k = Math.min(1, (t - m.fs) / .12) * (1 - seg(t, m.fe - .15, m.fe));
      const vg = x.createRadialGradient(320, 180, 60, 320, 180, 300); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(0,0,0,${(VIGN * k).toFixed(3)})`);
      x.fillStyle = vg; x.fillRect(0, 0, 640, 360);
      x.globalCompositeOperation = 'saturation'; x.fillStyle = `rgba(128,128,128,${(.55 * k).toFixed(3)})`; x.fillRect(0, 0, 640, 360); x.globalCompositeOperation = 'source-over';
      const fl = Math.max(0, 1 - (t - m.fs) / .16); if (fl > 0) { x.fillStyle = `rgba(255,255,255,${(.38 * fl).toFixed(3)})`; x.fillRect(0, 0, 640, 360); }
      for (let q = 0; q < 2; q++) { const u = ((t - m.fs) * 1.6 + q * .5) % 1; x.strokeStyle = `rgba(255,236,200,${(.7 * (1 - u) * k).toFixed(3)})`; x.lineWidth = 2.5; x.beginPath(); x.arc(bx, by, 18 + u * 80, 0, Math.PI * 2); x.stroke(); }
      const g = x.createRadialGradient(bx, by, 0, bx, by, 46); g.addColorStop(0, `rgba(255,214,150,${(.5 * k).toFixed(3)})`); g.addColorStop(1, 'rgba(255,214,150,0)'); x.fillStyle = g; x.fillRect(bx - 50, by - 50, 100, 100);
      x.globalAlpha = k; x.fillStyle = '#fff'; x.font = '400 40px "Black Han Sans", sans-serif'; x.textAlign = 'left'; x.fillText('FREEZE', 24, 106); x.globalAlpha = 1;
    }
    const gx0 = 20, gy0 = 296, gw = 330, gh = 46;                                             // 재생 속도 그래프
    x.fillStyle = 'rgba(8,10,20,.72)'; x.fillRect(gx0 - 8, gy0 - 14, gw + 16, gh + 22);
    x.fillStyle = 'rgba(255,255,255,.8)'; x.font = '500 10px "JetBrains Mono", monospace'; x.textAlign = 'left'; x.fillText('재생 속도(1× = 원래 속도)', gx0, gy0 - 3);
    const sy = (v) => gy0 + gh - (v / 1.6) * gh;
    x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 1; x.setLineDash([3, 3]); x.beginPath(); x.moveTo(gx0, sy(1)); x.lineTo(gx0 + gw, sy(1)); x.stroke(); x.setLineDash([]);
    x.beginPath(); x.moveTo(gx0, sy(0));
    for (let q = 0; q <= 220; q++) { const ti = Math.min(m.tau.length - 2, Math.round(q / 220 * DUR * HZ)); x.lineTo(gx0 + q / 220 * gw, sy(Math.min(1.6, rate(ti)))); }
    x.lineTo(gx0 + gw, sy(0)); x.closePath();
    const fg = x.createLinearGradient(0, gy0, 0, gy0 + gh); fg.addColorStop(0, 'rgba(255,170,80,.75)'); fg.addColorStop(1, 'rgba(255,170,80,.15)');
    x.fillStyle = fg; x.fill(); x.strokeStyle = '#ffc47a'; x.lineWidth = 1.5; x.stroke();
    x.fillStyle = '#fff'; x.fillRect(gx0 + t / DUR * gw - 1, gy0 - 2, 2, gh + 4);
    s.pill.textContent = L <= 1 ? '일정한 속도 · 1.0배' : frozen ? `정지 프레임 · ${FREEZE.toFixed(1)}초 멈춤` : spd < .7 ? `슬로모션 · ${spd.toFixed(2)}배속` : spd > 1.05 ? `빨라지는 중 · ${spd.toFixed(1)}배속` : `속도 램프 · ${spd.toFixed(2)}배속`;
    s.badge.textContent = frozen ? '정지' : `${spd.toFixed(2)}×`;
    s.badge.style.color = frozen ? '#ffd9a0' : spd < .7 ? '#9fd8ff' : '#fff';
  },
};
export default demo;
