/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/gpu-particles-instancing/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, rng, canvas, rr } from "./helpers.js";

// 입자 수천 개의 위치를 '번호 i 와 시간 t'만으로 계산하고(GPU 파티클), 같은 도형 하나를 위치·크기·색만 바꿔 수천 번 복제해 그린다(인스턴싱).
const COUNT = 4000;     // 입자(복제본) 개수
const SIZE = 2.2;         // 입자 크기 배율(1 = 기본)
const CAM_D = 3.2;      // 카메라까지 거리
const PITCH = .5;       // 카메라가 내려다보는 각도(rad)
const ORBIT = .25;      // 카메라가 장면 둘레를 도는 속도(rad/초)
const F = 680;          // 투영 배율(원근감을 주는 초점 거리)
const BASE = 200;       // 연출 전에 보이는 입자 수
const DUR = 4;

const HUES = ['255,176,104', '255,140,110', '255,120,160', '210,130,255', '150,150,255', '110,170,255', '100,205,255', '120,235,235'];
function sphereSprite(col) {
  const S = 48, cv = document.createElement('canvas'); cv.width = cv.height = S; const x = cv.getContext('2d');
  let g = x.createRadialGradient(S * .36, S * .32, 1, S / 2, S / 2, S / 2); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.25, `rgba(${col},1)`); g.addColorStop(.78, `rgba(${col},1)`); g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g; x.beginPath(); x.arc(S / 2, S / 2, S / 2, 0, 6.2832); x.fill();
  g = x.createRadialGradient(S * .36, S * .32, S * .15, S / 2, S / 2, S / 2); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(10,8,30,.62)'); x.fillStyle = g; x.beginPath(); x.arc(S / 2, S / 2, S / 2 - 1, 0, 6.2832); x.fill();
  return cv;
}
const pillDraw = (c, text) => {
  c.font = "500 14px 'IBM Plex Sans KR',sans-serif"; const w = c.measureText(text).width + 26;
  rr(c, 16, 14, w, 28, 14); c.fillStyle = 'rgba(8,10,20,.78)'; c.fill();
  c.fillStyle = '#fff'; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillText(text, 29, 29);
};

const demo = {
  dur: DUR, rest: 3.2, noCompare: false, levels: 4,
  mount(sp) {
    sp.style.background = '#0b0f1a';
    const c = canvas(sp), r = rng(41), n = COUNT;
    const rho = new Float32Array(n), th0 = new Float32Array(n), om = new Float32Array(n), yy = new Float32Array(n), sz = new Float32Array(n), hue = new Uint8Array(n), ph = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const u = r(); rho[i] = .12 + .88 * Math.sqrt(u); const arm = i % 3;
      th0[i] = arm * 2.0944 + rho[i] * 3.2 + (r() - .5) * (.5 + .6 * rho[i]); om[i] = .9 / (.35 + rho[i]);
      yy[i] = (r() - .5) * .16 * (1.1 - rho[i] * .7); sz[i] = .55 + r() * .9; hue[i] = Math.min(7, Math.floor(rho[i] * 7.4 + (r() - .5) * 1.6)); if (hue[i] < 0 || hue[i] > 7) hue[i] = 0; ph[i] = r() * 6.28;
    }
    const gr = document.createElement('canvas'); gr.width = gr.height = 128; const gx = gr.getContext('2d'), gi = gx.createImageData(128, 128), q = rng(3);
    for (let i = 0; i < 128 * 128; i++) { const v = q() > .5 ? 255 : 0; gi.data[i * 4] = gi.data[i * 4 + 1] = gi.data[i * 4 + 2] = v; gi.data[i * 4 + 3] = 12 + q() * 12; }
    gx.putImageData(gi, 0, 0);
    return { c, n, rho, th0, om, yy, sz, hue, ph, sprites: HUES.map(sphereSprite), gr, sx: new Float32Array(n), sy: new Float32Array(n), sd: new Float32Array(n), sr: new Float32Array(n), bin: new Int32Array(n), order: new Int32Array(n) };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv - 1);   // 0 = 입자 200개 점, 1 = 4000개 점(위치 = f(번호, 시간)), 2 = + 인스턴싱(구슬 도형·크기·색), 3 = + 카메라 궤도·깊이 안개
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, 640, 360);
    let g = c.createRadialGradient(320, 200, 10, 320, 200, 380); g.addColorStop(0, '#141b33'); g.addColorStop(1, '#0b0f1a'); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
    const n = L === 0 ? Math.min(BASE, s.n) : s.n;
    const yaw = .6 + (L >= 3 ? ORBIT * t : 0), cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(PITCH), sp = Math.sin(PITCH), NB = 40, cnt = new Int32Array(NB + 1);
    for (let i = 0; i < n; i++) {
      const th = s.th0[i] + s.om[i] * t, x = s.rho[i] * Math.cos(th), z = s.rho[i] * Math.sin(th), y = s.yy[i] + .02 * Math.sin(th * 3 + s.ph[i]);
      const x1 = x * cy + z * sy, z1 = -x * sy + z * cy, y2 = y * cp + z1 * sp, z2 = -y * sp + z1 * cp, pr = F / (CAM_D + z2);
      s.sx[i] = 320 + x1 * pr; s.sy[i] = 205 - y2 * pr; s.sd[i] = z2; s.sr[i] = pr;
      const b = Math.max(0, Math.min(NB - 1, Math.floor((z2 + 1.1) / 2.2 * NB))); s.bin[i] = b; cnt[b + 1]++;
    }
    for (let b = 0; b < NB; b++) cnt[b + 1] += cnt[b];
    for (let i = 0; i < n; i++) s.order[cnt[s.bin[i]]++] = i;      // 먼 것부터 그리도록 깊이 순서로 정렬(계수 정렬)
    if (L >= 3) {      // 은하 중심의 빛(겹이 다른 두 겹)
      c.globalCompositeOperation = 'lighter';
      [[90, .22], [38, .35]].forEach(([R, al]) => { g = c.createRadialGradient(320, 205, 0, 320, 205, R); g.addColorStop(0, `rgba(255,190,120,${al})`); g.addColorStop(1, 'rgba(255,190,120,0)'); c.fillStyle = g; c.fillRect(320 - R, 205 - R, R * 2, R * 2); });
      c.globalCompositeOperation = 'source-over';
    }
    for (let k = 0; k < n; k++) {
      const i = s.order[k];
      if (L <= 1) { c.fillStyle = 'rgba(235,242,255,.9)'; c.fillRect(s.sx[i] - 1, s.sy[i] - 1, 2, 2); continue; }
      const R = Math.max(1.1, SIZE * s.sz[i] * s.sr[i] * .012), fog = L >= 3 ? lerp(1, .3, Math.max(0, Math.min(1, (s.sd[i] + 1) / 2))) : 1;
      c.globalAlpha = fog; c.drawImage(s.sprites[s.hue[i]], s.sx[i] - R, s.sy[i] - R, R * 2, R * 2);
    }
    c.globalAlpha = 1; c.fillStyle = c.createPattern(s.gr, 'repeat'); c.fillRect(0, 0, 640, 360);
    c.fillStyle = 'rgba(8,10,20,.62)'; c.fillRect(0, 330, 640, 30);
    c.font = "500 13px 'JetBrains Mono',monospace"; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillStyle = '#e8eefc';
    c.fillText([`입자 ${n}개 · 같은 점, 같은 색`, `입자 ${n}개 · 위치 = f(번호 i, 시간 t)`, `구슬 도형 1개 x ${n}번 복제 · 복제마다 위치·크기·색`, `+ 카메라 ${ORBIT} rad/초로 회전 · 멀수록 옅게`][L], 18, 345);
    pillDraw(c, ['연출 전: 입자 200개, 같은 점', '1단계: 입자 수천 개의 위치를 번호와 시간으로 계산', '2단계: + 인스턴싱(도형 하나를 복제해 크기·색을 달리)', '3단계: + 카메라 궤도 회전 · 깊이 안개'][L]);
  },
};
export default demo;
