/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/echo-motion-blur/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, rng, canvas, rr } from "./helpers.js";

// 같은 움직임을 두 줄에 놓는다. 위 줄: 잔상(지나간 순간의 복사본을 띄엄띄엄 남김), 아래 줄: 모션 블러(셔터가 열려 있는 동안 지나간 위치를 이어 칠함).
const PAL = { bg0: '#f2f2f0', bg1: '#e4e4e1', ink: '#111111', muted: '#666666', accent: '#ff3b1f', accent2: '#111111', surface: '#ffffff', line: '#c4c4c0' };
const ECHOES = 5;         // 잔상 복사본 개수
const ECHO_GAP = 0.015;    // 복사본 사이의 시간 간격(초)
const SHUTTER = 180;      // 셔터 각도(도). 노출 시간 = 각도 / 360 x 한 프레임 시간
const FPS = 24;           // 영상 프레임 수(1초에 몇 장)
const SAMPLES = 16;       // 노출 시간 안에서 위치를 몇 번 찍어 겹칠지
const R = 32;             // 공 반지름(px)
const X0 = 80, X1 = 560;  // 출발 · 도착 x
const GO = 0.4, MOVE = 0.6, BACK = 2.0;   // 갈 때 출발 시각 · 이동 시간 · 돌아올 때 출발 시각
const LANES = [118, 250];
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, p) => { const x = rgb(a), y = rgb(b); return '#' + x.map((v, i) => Math.round(lerp(v, y[i], p)).toString(16).padStart(2, '0')).join(''); };
const rgba = (h, al) => { const [r, g, b] = rgb(h); return `rgba(${r},${g},${b},${al})`; };
const DUR = 3.2;

const pos = (t) => (t < 1.7 ? lerp(X0, X1, E.inOutC(seg(t, GO, GO + MOVE))) : lerp(X1, X0, E.inOutC(seg(t, BACK, BACK + MOVE))));
const sprite = (kind, hue) => {   // kind 0 = 빛과 그림자가 있는 공, 1 = 가장자리가 번진 잔상 조각
  const S = 96, cv = document.createElement('canvas'); cv.width = cv.height = S; const x = cv.getContext('2d');
  let g;
  if (kind === 0) {
    g = x.createRadialGradient(S * .38, S * .34, 2, S / 2, S / 2, S / 2); g.addColorStop(0, mix(PAL.accent, '#ffffff', .82)); g.addColorStop(.22, mix(PAL.accent, '#ffffff', .4)); g.addColorStop(.7, PAL.accent); g.addColorStop(1, mix(PAL.accent, '#000000', .55));
    x.beginPath(); x.arc(S / 2, S / 2, S / 2 - 1, 0, 6.2832); x.fillStyle = g; x.fill();
    g = x.createRadialGradient(S * .5, S * .62, S * .2, S * .5, S * .62, S * .62); g.addColorStop(0, 'rgba(40,10,10,0)'); g.addColorStop(1, 'rgba(40,10,10,.34)');
    x.beginPath(); x.arc(S / 2, S / 2, S / 2 - 1, 0, 6.2832); x.fillStyle = g; x.fill();
  } else {
    const c0 = (hue ? PAL.ink : PAL.accent).replace('#', '').match(/../g).map((v) => parseInt(v, 16)).join(',');   // hue 1 = 오래된 복사본(먹색), 0 = 새 복사본(주황빨강)
    g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2); g.addColorStop(0, `rgba(${c0},.95)`); g.addColorStop(.7, `rgba(${c0},.75)`); g.addColorStop(1, `rgba(${c0},0)`);
    x.fillStyle = g; x.fillRect(0, 0, S, S);
  }
  return cv;
};
const captionDraw = (c, text) => {      // 왼쪽 아래, 배경 없는 작은 설명글 + 위에 얇은 선
  c.font = "400 12px 'JetBrains Mono',monospace"; const w = c.measureText(text).width;
  c.fillStyle = PAL.line; c.fillRect(30, 326, w, 1);
  c.fillStyle = PAL.muted; c.textBaseline = 'alphabetic'; c.textAlign = 'left'; c.fillText(text, 30, 345);
};

const demo = {
  dur: DUR, rest: 3.0, noCompare: false, levels: 4,
  mount(sp) {
    sp.style.background = PAL.bg1;
    const c = canvas(sp);
    const gr = document.createElement('canvas'); gr.width = gr.height = 128; const gx = gr.getContext('2d'), gi = gx.createImageData(128, 128), q = rng(3);
    for (let i = 0; i < 128 * 128; i++) { const v = q() > .5 ? 255 : 0; gi.data[i * 4] = gi.data[i * 4 + 1] = gi.data[i * 4 + 2] = v; gi.data[i * 4 + 3] = 12 + q() * 12; }
    gx.putImageData(gi, 0, 0);
    return { c, ball: sprite(0), warm: sprite(1, 0), cool: sprite(1, 1), gr };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv - 1);   // 0 = 두 줄 모두 그대로, 1 = + 위 줄 잔상, 2 = + 아래 줄 모션 블러, 3 = + 잔상 색이 오래될수록 먹색으로
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, 640, 360);
    let g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, PAL.bg0); g.addColorStop(1, PAL.bg1); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
    const expo = SHUTTER / 360 / FPS;
    LANES.forEach((ly, lane) => {
      // 길(바닥선)과 눈금: 눈금은 고정돼 있어야 공이 얼마나 번졌는지 잴 수 있다
      c.fillStyle = rgba(PAL.ink, .3); c.fillRect(30, ly + R + 10, 580, 1);
      for (let x = 40; x <= 600; x += 40) c.fillRect(x, ly + R + 10, 1, 6);
      c.font = "500 12px 'IBM Plex Sans KR',sans-serif"; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillStyle = PAL.ink;
      c.fillText(lane === 0 ? '위 줄 · 잔상(echo)' : '아래 줄 · 모션 블러', 30, ly - R - 24);
      const draw = (x, al, scl) => {
        c.globalAlpha = al * .5; const sg = c.createRadialGradient(x, ly + R + 8, 0, x, ly + R + 8, R * 1.1); sg.addColorStop(0, rgba(PAL.ink, .5)); sg.addColorStop(1, rgba(PAL.ink, 0));
        c.save(); c.translate(x, ly + R + 8); c.scale(1, .22); c.translate(-x, -(ly + R + 8)); c.fillStyle = sg; c.fillRect(x - R * 1.3, ly + R + 8 - R * 1.3, R * 2.6, R * 2.6); c.restore();
        c.globalAlpha = al; const r2 = R * (scl || 1); c.drawImage(s.ball, x - r2, ly - r2, r2 * 2, r2 * 2);
      };
      c.textAlign = 'right';
      if (lane === 0 && L >= 1) {                   // 잔상: 지나간 순간의 복사본(뒤로 갈수록 옅게)
        for (let j = ECHOES; j >= 1; j--) {
          const x = pos(Math.max(0, t - j * ECHO_GAP)), al = .5 * (1 - (j - 1) / ECHOES), mix = (j - 1) / Math.max(1, ECHOES - 1);
          c.globalAlpha = al * (L >= 3 ? 1 - mix : 1); c.drawImage(s.warm, x - R, ly - R, R * 2, R * 2);
          if (L >= 3) { c.globalAlpha = al * mix * 1.3; c.drawImage(s.cool, x - R, ly - R, R * 2, R * 2); }
        }
        c.globalAlpha = 1; c.fillStyle = PAL.muted; c.fillText(`복사본 ${ECHOES}개 · ${ECHO_GAP}초 간격`, 610, ly - R - 24);
      }
      if (lane === 1 && L >= 2) {                   // 모션 블러: 노출 시간 동안 지나간 위치를 SAMPLES 번 찍어 겹침
        for (let k = 0; k < SAMPLES; k++) draw(pos(Math.max(0, t - expo * (k / (SAMPLES - 1)))), 2.6 / SAMPLES + .06, 1);
        c.globalAlpha = 1; c.fillStyle = PAL.muted; c.fillText(`셔터 ${SHUTTER}° · ${FPS}fps → 노출 ${expo.toFixed(4)}초`, 610, ly - R - 24);
      } else draw(pos(t), 1, 1);
      c.globalAlpha = 1;
    });
    c.fillStyle = c.createPattern(s.gr, 'repeat'); c.fillRect(0, 0, 640, 360);
    captionDraw(c, ['연출 전: 두 줄 모두 공이 또렷하게 이동만 함', '1단계(기본형): 위 줄에 잔상 복사본 5개', '2단계: + 아래 줄에 모션 블러(노출 시간만큼 번짐)', '3단계: + 잔상이 오래될수록 먹색으로'][L]);
  },
};
export default demo;
