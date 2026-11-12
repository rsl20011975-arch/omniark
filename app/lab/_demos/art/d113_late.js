/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/overlap-sound-sync/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 소리는 들을 수 없으므로 '소리의 모양(파형·크기)'으로 보여 준다. 화면이 바뀌는 시각과 소리가 바뀌는 시각을 어긋나게 겹쳐(J컷·L컷) 이어 붙이고, 쾅 소리의 정점을 화면 컷에 맞춘다. 화면은 시간 t 의 함수다.
const P1 = 3.0, P2 = 5.6;     // 화면이 바뀌는 시각(초): 카페→거리, 거리→문 앞
const TRAIL = .8;             // L컷: 앞 장면 소리가 새 화면 위로 더 이어지는 시간(초)
const RISE = .8;              // 문 앞 장면 소리가 점점 커져 쾅 하는 정점에 이르기까지의 시간(초)
const HIT = 5.2;              // 3단계: 쾅 소리의 정점을 놓는 시각(초)
const ROUGH = .45;            // 2단계: 소리를 대충 앞으로 당긴 시간(초) — 정점이 화면보다 늦게 도착한다
const DUR = 7.2, TEND = 7.0;
const FONT = '40px "Black Han Sans"';
const X0 = 76, TW = 544, SC = TW / TEND;
const NAMES = ['대화', '거리', '쾅·음악'], COLS = ['#6fb3ff', '#6fe0a8', '#ffb066'];
const PICS = [
  { n: '카페', c: '대화 장면', a: '#2b1d16', b: '#c88a52' }, { n: '거리', c: '걸어가는 장면', a: '#10343a', b: '#4aa0b4' }, { n: '문', c: '닫히는 장면', a: '#1a1030', b: '#7a52b8' },
];

function clips(L) {
  if (L <= 1) return [[0, P1], [P1, P2], [P2, TEND, P2 + RISE]];
  if (L === 2) return [[0, P1 + TRAIL], [P1, P2], [P2 - ROUGH, TEND, P2 - ROUGH + RISE]];
  return [[0, P1 + TRAIL], [P1, P2], [HIT - RISE, TEND, HIT]];
}

function env(k, tau, len, hitL) {          // 소리 크기(0~1) 곡선
  let v;
  if (k === 0) v = .25 + .55 * Math.abs(Math.sin(tau * 6.1)) * (.6 + .4 * Math.sin(tau * 1.9 + 1));
  else if (k === 1) v = .38 + .12 * Math.sin(tau * 1.3) + .1 * Math.sin(tau * 7.7);
  else v = tau < hitL ? .08 + .55 * Math.pow(tau / hitL, 2) : .45 + .55 * Math.exp(-(tau - hitL) * 7) + .08 * Math.sin(tau * 12.6);
  return Math.max(0, v * Math.min(1, tau / .08, (len - tau) / .08));
}

const demo = {
  dur: DUR, rest: 5.4, noCompare: false, levels: 3,
  mount(sp) {
    const css = (e, o) => Object.assign(e.style, o);
    const main = el('canvas', null, sp);
    main.width = 1280; main.height = 720; css(main, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const pill = el('div', null, sp);
    css(pill, { position: 'absolute', left: '20px', top: '14px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.72)', color: '#fff', font: "500 15px/1 'IBM Plex Sans KR',sans-serif" });
    const R = rng(8), jit = Array.from({ length: 400 }, () => R());
    return { main, pill, jit, ok: null };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 소리와 화면이 같이 바뀜, 2 = J컷·L컷(대충), 3 = + 쾅 소리 정점을 컷에 맞춤
    const x = s.main.getContext('2d'), cl = clips(L);
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
    x.fillStyle = '#0b0f1a'; x.fillRect(0, 0, 640, 360);
    const pi = t < P1 ? 0 : t < P2 ? 1 : 2, pc = PICS[pi];
    const g = x.createLinearGradient(20, 50, 320, 218); g.addColorStop(0, pc.a); g.addColorStop(1, pc.b);
    x.save(); x.beginPath(); x.roundRect(20, 50, 300, 168, 10); x.clip();
    x.fillStyle = g; x.fillRect(20, 50, 300, 168);
    const rg = x.createRadialGradient(270, 80, 0, 270, 80, 140); rg.addColorStop(0, 'rgba(255,255,255,.3)'); rg.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = rg; x.fillRect(20, 50, 300, 168);
    const since = t - P2, shake = pi === 2 && since < .22 ? (1 - since / .22) * 7 * Math.sin(since * 90) : 0;
    x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 16; x.shadowOffsetY = 4;
    x.fillStyle = '#fff'; x.textAlign = 'left'; x.font = '400 78px "Black Han Sans", sans-serif'; x.fillText(pc.n + (pi === 2 ? '!' : ''), 36 + shake, 140);
    x.shadowColor = 'transparent'; x.font = '500 18px "IBM Plex Sans KR", sans-serif'; x.fillStyle = 'rgba(255,255,255,.92)'; x.fillText(`화면 ${pi + 1} · ${pc.c}`, 38, 172);
    if (pi === 2 && since < .12) { x.fillStyle = `rgba(255,255,255,${(.55 * (1 - since / .12)).toFixed(3)})`; x.fillRect(20, 50, 300, 168); }
    x.restore();
    x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 1.5; x.beginPath(); x.roundRect(20, 50, 300, 168, 10); x.stroke();
    // 오른쪽: 지금 들리는 소리 크기
    x.fillStyle = 'rgba(8,10,20,.62)'; x.beginPath(); x.roundRect(336, 50, 284, 168, 10); x.fill();
    x.fillStyle = '#fff'; x.textAlign = 'left'; x.font = '500 12px "IBM Plex Sans KR", sans-serif'; x.fillText('지금 나는 소리의 크기(파형으로 본 값)', 348, 68);
    const lv3 = cl.map((c, k) => (t >= c[0] && t < c[1] ? env(k, t - c[0], c[1] - c[0], c[2] ? c[2] - c[0] : 0) : 0));
    lv3.forEach((v, k) => {
      const y = 76 + k * 28;
      x.fillStyle = 'rgba(255,255,255,.85)'; x.font = '500 11px "IBM Plex Sans KR", sans-serif'; x.fillText(NAMES[k], 348, y + 13);
      x.fillStyle = 'rgba(255,255,255,.12)'; x.fillRect(404, y, 204, 17);
      x.fillStyle = COLS[k]; x.fillRect(404, y, 204 * Math.min(1, v), 17);
    });
    const hit = cl[2][2], lag = hit - P2, trail = cl[0][1] - P1, lead = P2 - cl[2][0];
    const okLag = Math.abs(lag) < .04;
    x.font = '500 11.5px "IBM Plex Sans KR", sans-serif'; x.fillStyle = 'rgba(255,255,255,.92)';
    x.fillText(trail > .01 ? `L컷: 대화 소리가 거리 화면 위로 ${trail.toFixed(2)}초 더 이어짐` : '카페→거리: 소리와 화면이 같은 순간에 바뀜', 348, 172);
    x.fillText(lead > .01 ? `J컷: 쾅·음악이 문 화면보다 ${lead.toFixed(2)}초 먼저 시작` : '거리→문: 소리와 화면이 같은 순간에 바뀜', 348, 188);
    x.fillStyle = okLag ? '#7be8a0' : '#ff8a8a'; x.font = '600 12px "IBM Plex Sans KR", sans-serif';
    x.fillText(okLag ? '쾅 소리의 정점 = 화면 컷 (동기)' : `쾅 소리가 화면보다 ${Math.abs(lag).toFixed(2)}초 ${lag > 0 ? '늦음' : '빠름'}`, 348, 206);
    // 아래: 타임라인(영상 1줄 + 소리 3줄)
    x.fillStyle = 'rgba(8,10,20,.6)'; x.beginPath(); x.roundRect(20, 228, 600, 116, 8); x.fill();
    x.font = '500 10px "IBM Plex Sans KR", sans-serif'; x.textAlign = 'left';
    const rows = [236, 262, 288, 314];
    x.fillStyle = 'rgba(255,255,255,.8)'; x.fillText('화면', 26, rows[0] + 14);
    NAMES.forEach((n, k) => x.fillText(n, 26, rows[k + 1] + 15));
    [[0, P1], [P1, P2], [P2, TEND]].forEach(([a0, a1], i) => {
      const gg = x.createLinearGradient(0, 0, 0, 1); x.fillStyle = PICS[i].b; x.globalAlpha = .85;
      x.beginPath(); x.roundRect(X0 + a0 * SC, rows[0], (a1 - a0) * SC - 1, 20, 3); x.fill(); x.globalAlpha = 1;
      x.fillStyle = '#fff'; x.font = '500 10px "IBM Plex Sans KR", sans-serif'; x.fillText(PICS[i].n, X0 + a0 * SC + 5, rows[0] + 14);
    });
    cl.forEach((c, k) => {
      const y = rows[k + 1], len = c[1] - c[0];
      x.fillStyle = 'rgba(255,255,255,.07)'; x.fillRect(X0 + c[0] * SC, y, len * SC, 22);
      x.strokeStyle = COLS[k]; x.lineWidth = 1; x.strokeRect(X0 + c[0] * SC + .5, y + .5, len * SC - 1, 21);
      for (let b = 0; b < len * SC / 3; b++) {
        const tau = b * 3 / SC, v = env(k, tau, len, c[2] ? c[2] - c[0] : 0) * (.6 + .4 * s.jit[(b * 7 + k * 53) % 400]), h = Math.max(1, v * 20), played = c[0] + tau <= t;
        x.fillStyle = COLS[k]; x.globalAlpha = played ? 1 : .45; x.fillRect(X0 + c[0] * SC + b * 3, y + 11 - h / 2, 2, h);
      }
      x.globalAlpha = 1;
    });
    x.setLineDash([3, 3]); x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 1;                // 화면 컷 위치
    [P1, P2].forEach((p) => { x.beginPath(); x.moveTo(X0 + p * SC, rows[0] - 4); x.lineTo(X0 + p * SC, rows[3] + 24); x.stroke(); });
    x.setLineDash([]);
    const hx = X0 + hit * SC;                                                                      // 쾅 정점 표시
    x.fillStyle = okLag ? '#7be8a0' : '#ff7a7a'; x.beginPath(); x.moveTo(hx - 5, rows[3] - 3); x.lineTo(hx + 5, rows[3] - 3); x.lineTo(hx, rows[3] + 5); x.closePath(); x.fill();
    if (!okLag) { x.strokeStyle = '#ff7a7a'; x.lineWidth = 2; x.beginPath(); x.moveTo(X0 + P2 * SC, rows[3] - 6); x.lineTo(hx, rows[3] - 6); x.stroke(); }
    x.fillStyle = '#fff'; x.fillRect(X0 + Math.min(t, TEND) * SC - 1, rows[0] - 6, 2, 124);
    s.pill.textContent = L <= 1 ? '소리와 화면이 같이 바뀜 · 컷' : L === 2 ? 'J컷·L컷 · 소리를 화면과 어긋나게 이어 붙임' : 'J컷·L컷 + 쾅 소리 정점을 컷에 맞춤';
  },
};
export default demo;
