/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/photo-repeat-trap/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

const PAL = { bg0: '#0b0f1a', bg1: '#161d30', ink: '#f4efe4', muted: '#8b94a3', accent: '#ffb36b', accent2: '#ffd27a', surface: '#131a2b', line: '#2a3450' };

// 사진 한 장(주방 조리대의 에어프라이어)을 10초 영상으로 만든다. 같은 장면을 그대로 4번 쓰면 어떻게 읽히는지를 이 장면에서 직접 잰다.
const DRIFT = 1.01;     // 1단계: 장면마다 사진이 1.00에서 이 배율까지만 아주 느리게 밀린다(기록에 이 값은 없어 추정)
const SCENES4 = 4;      // 1~3단계 장면 수(한 장면 2.5초)
const SCENES8 = 8;      // 4단계 장면 수(한 장면 1.25초)
const PUNCH = 0.26;     // 펀치인: 0.45초 동안 이만큼 확대(+26%)
const PUSH = 1.5;      // 푸시인·풀아웃 끝 배율
const DUR = 10;         // 데모 길이(초). 10초당 컷 수를 바로 읽도록 10초로 맞춤
const STILL = 0.5, CUT = 25;    // 10fps·64px 자: 프레임 차 0.5 미만 = 정지, 25 초과 = 컷
const FLOOR = { still: 20, cuts: 3.8, motion: 4.89 };    // 가전 쇼츠 성공 30편의 바닥값(정지 %, 10초당 컷, 움직임)
const STEPS = ['사진 1장을 4장면에 그대로 쓴다', '장면마다 다른 구도로 자른다', '장면마다 카메라 무브를 단다', '장면을 8개로 쪼갠다'];
const CAP4 = ['예열 3분', '180도 12분', '중간에 뒤집기', '완성'];
const CAP8 = ['예열', '바스켓', '온도', '시간', '뒤집기', '꺼내기', '담기', '완성'];
const MOVES4 = ['push', 'punch', 'pan', 'pull'], MOVES8 = ['push', 'pan', 'punch', 'pull', 'drift', 'push', 'pan', 'pull'];
// 잘라 쓰는 구도(1280×720 그림 기준 [중심 x, 중심 y, 폭]; 높이는 16:9)
const C0 = [640, 360, 1280];
const CROP4 = [[560, 300, 640], [590, 210, 340], [1030, 450, 420], C0];
const CROP8 = [C0, [560, 300, 640], [590, 210, 340], [600, 400, 360], [1030, 450, 420], [150, 360, 380], [880, 500, 560], C0];

const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const ctx2 = (c) => c.getContext('2d', { willReadFrequently: true });
function rr(x, a, b, w, h, r) { x.beginPath(); x.roundRect(a, b, w, h, r); }
function ell(x, cx, cy, rx, ry, rot = 0) { x.beginPath(); x.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2); }

const SEG = { 0: 'abcdef', 1: 'bc', 2: 'abdeg', 3: 'abcdg', 4: 'bcfg', 5: 'acdfg', 6: 'acdefg', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' };
function digit(x, px, py, h, d, col) {       // 7세그먼트 숫자: 빛번짐 세 겹 + 밝은 심
  const w = h * .55, th = h * .13, P = { a: [px + th, py, w - 2 * th, th], d: [px + th, py + h - th, w - 2 * th, th], g: [px + th, py + h / 2 - th / 2, w - 2 * th, th], f: [px, py + th, th, h / 2 - th], b: [px + w - th, py + th, th, h / 2 - th], e: [px, py + h / 2, th, h / 2 - th], c: [px + w - th, py + h / 2, th, h / 2 - th] };
  for (const [g, a] of [[7, .1], [3.5, .22], [0, 1]]) for (const k of SEG[d]) { const [a0, b0, c0, d0] = P[k]; x.fillStyle = col.replace('A', a); x.fillRect(a0 - g, b0 - g, c0 + 2 * g, d0 + 2 * g); }
}

function leaf(x, bx, by, ang, len, wid, col) {
  x.save(); x.translate(bx, by); x.rotate(ang);
  const g = x.createLinearGradient(0, 0, len, 0); g.addColorStop(0, col[0]); g.addColorStop(1, col[1]);
  x.fillStyle = g; x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(len * .45, -wid, len, 0); x.quadraticCurveTo(len * .45, wid, 0, 0); x.fill();
  x.strokeStyle = 'rgba(220,255,200,.35)'; x.lineWidth = 1; x.beginPath(); x.moveTo(0, 0); x.lineTo(len * .92, 0); x.stroke(); x.restore();
}

function paintKitchen() {
  const c = mk(2560, 1440), x = ctx2(c), r = rng(5);
  x.scale(2, 2);
  x.fillStyle = '#e8e2d6'; x.fillRect(0, 0, 1280, 720);
  for (let row = 0; row < 11; row++) for (let col = -1; col < 17; col++) {      // 지하철 타일 벽
    const tx = col * 80 + (row % 2 ? 40 : 0), ty = row * 38, v = r() * 10 - 5;
    const g = x.createLinearGradient(0, ty, 0, ty + 38); g.addColorStop(0, `rgb(${238 + v},${233 + v},${222 + v})`); g.addColorStop(1, `rgb(${222 + v},${216 + v},${203 + v})`);
    x.fillStyle = g; x.fillRect(tx + 1.5, ty + 1.5, 77, 35); x.fillStyle = 'rgba(255,255,255,.35)'; x.fillRect(tx + 1.5, ty + 1.5, 77, 2);
  }
  let g = x.createRadialGradient(130, -60, 40, 130, -60, 980); g.addColorStop(0, 'rgba(255,244,214,.75)'); g.addColorStop(.5, 'rgba(255,238,200,.22)'); g.addColorStop(1, 'rgba(255,238,200,0)'); x.fillStyle = g; x.fillRect(0, 0, 1280, 420);
  g = x.createLinearGradient(0, 400, 0, 720); g.addColorStop(0, '#c08c5a'); g.addColorStop(.5, '#a37046'); g.addColorStop(1, '#6e4528'); x.fillStyle = g; x.fillRect(0, 400, 1280, 320);   // 조리대
  for (let i = 0; i < 170; i++) { const y0 = 404 + r() * 316, wv = r() * 4; x.strokeStyle = r() > .5 ? 'rgba(70,40,20,.14)' : 'rgba(255,225,180,.10)'; x.lineWidth = .6 + r() * 1.4; x.beginPath(); x.moveTo(0, y0); for (let k = 1; k <= 8; k++) x.lineTo(k * 160, y0 + Math.sin(k * 1.3 + i) * wv); x.stroke(); }
  g = x.createLinearGradient(0, 398, 0, 414); g.addColorStop(0, 'rgba(255,230,190,.85)'); g.addColorStop(1, 'rgba(255,230,190,0)'); x.fillStyle = g; x.fillRect(0, 398, 1280, 16);
  g = x.createLinearGradient(0, 380, 0, 400); g.addColorStop(0, 'rgba(60,40,20,0)'); g.addColorStop(1, 'rgba(60,40,20,.3)'); x.fillStyle = g; x.fillRect(0, 380, 1280, 20);
  // 화분
  for (let i = 0; i < 7; i++) { x.fillStyle = 'rgba(40,25,10,.06)'; ell(x, 165, 552, 92 + i * 5, 14 + i * 2.2); x.fill(); }
  for (let i = 0; i < 17; i++) leaf(x, 150, 420, -Math.PI / 2 + (i - 8) * .17 + (r() - .5) * .1, 120 + r() * 70, 18 + r() * 10, ['#1f5530', i % 3 ? '#6cae55' : '#9acb6a']);
  g = x.createLinearGradient(95, 0, 215, 0); g.addColorStop(0, '#c4653a'); g.addColorStop(.45, '#a9502b'); g.addColorStop(1, '#7a3419');
  x.fillStyle = g; x.beginPath(); x.moveTo(98, 440); x.lineTo(206, 440); x.lineTo(192, 540); x.quadraticCurveTo(150, 552, 112, 540); x.closePath(); x.fill();
  x.fillStyle = '#d0794a'; rr(x, 92, 428, 122, 20, 6); x.fill(); x.fillStyle = 'rgba(255,255,255,.22)'; x.fillRect(100, 430, 40, 3);
  // 에어프라이어
  for (let i = 0; i < 10; i++) { x.fillStyle = 'rgba(30,18,8,.06)'; ell(x, 570, 536, 235 + i * 6, 22 + i * 3.4); x.fill(); }
  g = x.createLinearGradient(380, 0, 760, 0); g.addColorStop(0, '#41434b'); g.addColorStop(.12, '#2b2d33'); g.addColorStop(.6, '#1b1c20'); g.addColorStop(1, '#0f1013');
  x.fillStyle = g; rr(x, 380, 118, 380, 420, 48); x.fill();
  g = x.createLinearGradient(0, 118, 0, 170); g.addColorStop(0, 'rgba(255,255,255,.2)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; rr(x, 380, 118, 380, 56, 48); x.fill();
  x.fillStyle = 'rgba(255,236,200,.42)'; rr(x, 381, 150, 3, 330, 2); x.fill();
  x.fillStyle = '#08090b'; rr(x, 410, 160, 320, 108, 16); x.fill(); x.strokeStyle = 'rgba(255,255,255,.1)'; x.lineWidth = 1; rr(x, 410.5, 160.5, 319, 107, 16); x.stroke();
  x.fillStyle = '#05070a'; rr(x, 490, 176, 160, 50, 6); x.fill();
  const amber = 'rgba(255,179,107,A)';
  digit(x, 508, 186, 30, 1, amber); digit(x, 532, 186, 30, 8, amber); digit(x, 556, 186, 30, 0, amber);
  for (const [dx, dy] of [[0, 8], [0, 22]]) { x.fillStyle = 'rgba(255,179,107,.9)'; x.fillRect(588 + dx, 186 + dy, 4, 4); }
  digit(x, 598, 190, 22, 1, amber); digit(x, 614, 190, 22, 2, amber);
  for (const kx of [452, 688]) {              // 다이얼 두 개
    for (let i = 0; i < 11; i++) { const a = -2.4 + i * .48; x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(kx + Math.cos(a) * 34, 214 + Math.sin(a) * 34); x.lineTo(kx + Math.cos(a) * 39, 214 + Math.sin(a) * 39); x.stroke(); }
    const kg = x.createRadialGradient(kx - 8, 204, 3, kx, 214, 30); kg.addColorStop(0, '#f2f4f6'); kg.addColorStop(.5, '#9ea3ab'); kg.addColorStop(1, '#4b4f57'); x.fillStyle = kg; ell(x, kx, 214, 26, 26); x.fill();
    x.strokeStyle = 'rgba(0,0,0,.5)'; x.lineWidth = 1.5; ell(x, kx, 214, 26, 26); x.stroke();
    x.strokeStyle = 'rgba(40,42,48,.9)'; x.lineWidth = 3; x.lineCap = 'round'; x.beginPath(); x.moveTo(kx - 4, 205); x.lineTo(kx - 12, 193); x.stroke();
  }
  for (const bx of [520, 560, 600, 640]) { const bg = x.createRadialGradient(bx - 2, 248, 1, bx, 250, 9); bg.addColorStop(0, '#6a6e77'); bg.addColorStop(1, '#25272c'); x.fillStyle = bg; ell(x, bx, 250, 9, 9); x.fill(); }
  g = x.createLinearGradient(410, 0, 730, 0); g.addColorStop(0, '#202227'); g.addColorStop(1, '#0d0e10'); x.fillStyle = g; rr(x, 408, 290, 324, 212, 22); x.fill();
  x.strokeStyle = 'rgba(255,255,255,.08)'; x.lineWidth = 1.5; rr(x, 408.5, 290.5, 323, 211, 22); x.stroke();
  g = x.createLinearGradient(0, 330, 0, 352); g.addColorStop(0, '#f3f5f7'); g.addColorStop(.5, '#aeb3ba'); g.addColorStop(1, '#6a6f77'); x.fillStyle = g; rr(x, 450, 330, 240, 22, 11); x.fill();
  x.fillStyle = 'rgba(0,0,0,.35)'; rr(x, 452, 354, 236, 6, 3); x.fill();
  g = x.createLinearGradient(410, 290, 700, 500); g.addColorStop(0, 'rgba(255,255,255,.13)'); g.addColorStop(.35, 'rgba(255,255,255,.02)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; rr(x, 408, 290, 324, 212, 22); x.fill();
  // 그릇과 감자튀김
  for (let i = 0; i < 9; i++) { x.fillStyle = 'rgba(30,18,8,.07)'; ell(x, 1045, 560, 120 + i * 7, 18 + i * 3.4); x.fill(); }
  g = x.createLinearGradient(890, 0, 1170, 0); g.addColorStop(0, '#fbf7ef'); g.addColorStop(.6, '#e6dfd0'); g.addColorStop(1, '#b9b09e');
  x.fillStyle = g; x.beginPath(); x.moveTo(892, 446); x.bezierCurveTo(900, 520, 950, 556, 1030, 556); x.bezierCurveTo(1110, 556, 1160, 520, 1168, 446); x.closePath(); x.fill();
  x.fillStyle = '#cdc3b0'; ell(x, 1030, 446, 140, 36); x.fill();
  x.save(); x.beginPath(); x.rect(880, 380, 300, 66); ell(x, 1030, 446, 138, 34); x.rect(880, 380, 300, 66); x.clip();
  for (let i = 0; i < 46; i++) {
    const fx = 940 + r() * 180, fy = 440 - r() * 46 * Math.min(1, 1.3 - Math.abs(fx - 1030) / 130), a = (r() - .5) * 2.2;
    x.save(); x.translate(fx, fy); x.rotate(a); const fg = x.createLinearGradient(0, -6, 0, 6); fg.addColorStop(0, '#f6cf6a'); fg.addColorStop(1, '#c58a2e'); x.fillStyle = fg; rr(x, -34, -6, 68, 12, 4); x.fill();
    x.fillStyle = 'rgba(120,70,15,.35)'; x.fillRect(-20 + r() * 30, -4, 6 + r() * 8, 3); x.restore();
  }
  x.restore();
  x.strokeStyle = '#fffdf8'; x.lineWidth = 6; x.beginPath(); x.ellipse(1030, 446, 140, 36, 0, .02, Math.PI - .02); x.stroke();
  x.strokeStyle = 'rgba(0,0,0,.12)'; x.lineWidth = 1.5; x.beginPath(); x.ellipse(1030, 449, 138, 34, 0, .1, Math.PI - .1); x.stroke();
  g = x.createRadialGradient(1280 * .5, 360, 380, 640, 360, 900); g.addColorStop(0, 'rgba(10,8,6,0)'); g.addColorStop(1, 'rgba(10,8,6,.42)'); x.fillStyle = g; x.fillRect(0, 0, 1280, 720);
  const im = x.getImageData(0, 0, 2560, 1440), d = im.data, rg = rng(77);
  for (let i = 0; i < d.length; i += 4) { const n = (rg() + rg() - 1) * 7; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  x.setTransform(1, 0, 0, 1, 0, 0); x.putImageData(im, 0, 0);
  return c;
}

function camera(L, t) {       // 시각 t 에 어느 장면의 어느 부분을 보여 주는가
  t = t > 0 ? t : 0;          // 음수·비수(NaN) 시간이 들어와도 장면 번호가 벗어나지 않게
  const N = L >= 4 ? SCENES8 : SCENES4, sd = DUR / N, k = Math.min(N - 1, Math.floor(t / sd)), tt = Math.min(sd, t - k * sd), u = tt / sd;
  const crop = L <= 1 ? C0 : (L >= 4 ? CROP8 : CROP4)[k];
  let z = 1, pan = 0;
  if (L <= 1) z = lerp(1, DRIFT, E.inOutC(u));
  else if (L >= 3) {
    const mv = (L >= 4 ? MOVES8 : MOVES4)[k];
    if (mv === 'push') z = lerp(1, PUSH, E.inOutC(u));
    else if (mv === 'pull') z = lerp(PUSH, 1, E.inOutC(u));
    else if (mv === 'punch') z = 1 + PUNCH * E.outBack(seg(tt, 0, .45));
    else if (mv === 'pan') { z = 1.16; pan = lerp(-.14, .14, E.inOutC(u)); }
    else z = lerp(1.08, 1.22, E.inOutC(u));
  }
  const cw = crop[2] / z, ch = cw * 9 / 16;
  const sx = Math.min(1280 - cw, Math.max(0, crop[0] + pan * crop[2] - cw / 2)), sy = Math.min(720 - ch, Math.max(0, crop[1] - ch / 2));
  return { sx, sy, cw, ch, k, N, cap: (L >= 4 ? CAP8 : CAP4)[k] };
}

function drawFrame(x, src, w, h, L, t) {      // 사진 칸(w×h)에 장면과 자막을 그린다. 화면과 측정이 같은 함수를 쓴다
  const c = camera(L, t);
  x.save();
  x.drawImage(src, c.sx * 2, c.sy * 2, c.cw * 2, c.ch * 2, 0, 0, w, h);
  const s = w / 384, pw = (c.cap.length * 11 + 22) * s;
  x.fillStyle = 'rgba(11,15,26,.72)'; rr(x, 10 * s, h - 30 * s, pw, 20 * s, 4 * s); x.fill();
  x.fillStyle = PAL.ink; x.font = `600 ${11 * s}px 'IBM Plex Sans KR',sans-serif`; x.textBaseline = 'middle'; x.fillText(c.cap, 21 * s, h - 20 * s);
  x.restore();
  return c;
}

function measure(s, L) {       // 10fps·64px 회색 프레임의 차이를 101장으로 재서 정지 비율·움직임·컷 수를 센다
  if (s.cache[L]) return s.cache[L];
  const cv = s.tmp, x = ctx2(cv), bars = []; let prev = null;
  for (let i = 0; i <= DUR * 10; i++) {
    x.clearRect(0, 0, 64, 36); drawFrame(x, s.src, 64, 36, L, i / 10);
    const d = x.getImageData(0, 0, 64, 36).data, gr = new Float32Array(64 * 36);
    for (let k = 0; k < gr.length; k++) gr[k] = .299 * d[k * 4] + .587 * d[k * 4 + 1] + .114 * d[k * 4 + 2];
    if (prev) { let sum = 0; for (let k = 0; k < gr.length; k++) sum += Math.abs(gr[k] - prev[k]); bars.push(sum / gr.length); }
    prev = gr;
  }
  return s.cache[L] = { bars, still: bars.filter((v) => v < STILL).length / bars.length * 100, motion: bars.reduce((p, v) => p + v, 0) / bars.length, cuts: bars.filter((v) => v > CUT).length };
}

const demo = {
  dur: DUR, rest: 9.9, noCompare: false, levels: 4,
  mount(sp) {
    const css = (e, o) => Object.assign(e.style, o);
    const main = el('canvas', null, sp);
    main.width = 1280; main.height = 720; css(main, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const pill = el('div', null, sp);
    css(pill, { position: 'absolute', right: '16px', top: '14px', padding: '.55em 1em .55em .9em', borderRadius: '2px', background: PAL.surface, color: PAL.ink, borderLeft: `3px solid ${PAL.accent}`, boxShadow: `0 0 0 1px ${PAL.line}, 0 4px 14px rgba(0,0,0,.4)`, font: "600 12px/1 'IBM Plex Sans KR',sans-serif", zIndex: 5 });
    const gr = mk(256, 256); { const g2 = ctx2(gr), d = g2.createImageData(256, 256), r = rng(3); for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } g2.putImageData(d, 0, 0); }
    return { main, pill, gr, src: paintKitchen(), cache: {}, tmp: mk(64, 36) };
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 4 : lv);
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.textBaseline = 'alphabetic'; x.textAlign = 'left'; x.imageSmoothingQuality = 'high';
    const g = x.createLinearGradient(0, 0, 640, 360); g.addColorStop(0, PAL.bg0); g.addColorStop(1, PAL.bg1); x.fillStyle = g; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = .1;
    for (let gx = 0; gx < 640; gx += 128) for (let gy = 0; gy < 360; gy += 128) x.drawImage(s.gr, gx, gy, 128, 128);
    x.restore();
    // 사진 칸
    x.fillStyle = 'rgba(0,0,0,.4)'; x.fillRect(19, 55, 384, 216); x.fillStyle = 'rgba(0,0,0,.25)'; x.fillRect(17, 51, 384, 216);
    x.save(); x.translate(16, 48); x.beginPath(); x.rect(0, 0, 384, 216); x.clip(); x.scale(.5, .5);
    const cam = drawFrame(x, s.src, 768, 432, L, Math.min(t, DUR)); x.restore();
    x.strokeStyle = PAL.line; x.lineWidth = 1; x.strokeRect(15.5, 47.5, 385, 217);
    x.fillStyle = PAL.muted; x.font = "500 11px 'IBM Plex Sans KR',sans-serif"; x.fillText(`장면 ${cam.k + 1}/${cam.N} · 사진은 한 장`, 16, 40);
    // 이 장면에서 직접 잰 값
    const m = measure(s, L);
    const px = 412, py = 48;
    x.fillStyle = 'rgba(19,26,43,.85)'; x.fillRect(px, py, 212, 216); x.strokeStyle = PAL.line; x.strokeRect(px + .5, py + .5, 211, 215);
    x.fillStyle = PAL.ink; x.font = "600 12px 'IBM Plex Sans KR',sans-serif"; x.fillText('10fps·64px 프레임 차로 잰 값', px + 12, py + 24);
    x.fillStyle = PAL.muted; x.font = "500 10px 'IBM Plex Sans KR',sans-serif"; x.fillText('바닥 = 가전 쇼츠 성공 30편의 최저값', px + 12, py + 40);
    const rows = [['정지 비율', `${m.still.toFixed(0)}%`, `≤${FLOOR.still}%`, m.still <= FLOOR.still], ['움직임', m.motion.toFixed(2), `≥${FLOOR.motion}`, m.motion >= FLOOR.motion], ['10초당 컷', m.cuts.toFixed(1), `≥${FLOOR.cuts}`, m.cuts >= FLOOR.cuts]];
    rows.forEach(([lb, val, fl, ok], i) => {
      const yy = py + 76 + i * 50;
      x.fillStyle = PAL.muted; x.font = "500 11px 'IBM Plex Sans KR',sans-serif"; x.fillText(lb, px + 12, yy - 14);
      x.fillStyle = ok ? PAL.accent2 : PAL.ink; x.font = "700 26px 'JetBrains Mono',monospace"; x.fillText(val, px + 12, yy + 12);
      x.fillStyle = ok ? PAL.accent : PAL.muted; x.font = "500 12px 'IBM Plex Sans KR',sans-serif"; x.fillText(`${ok ? '넘음' : '아래'} ${fl}`, px + 118, yy + 10);
    });
    // 프레임 차 막대
    const by0 = 282, bh = 56, bx0 = 16, bwid = 540, n = m.bars.length, sc = (v) => Math.min(1, Math.sqrt(v / 40)) * bh;
    x.fillStyle = 'rgba(0,0,0,.28)'; x.fillRect(bx0 - 2, by0 - 4, bwid + 52, bh + 8);
    m.bars.forEach((v, i) => { const h = Math.max(1, sc(v)); x.fillStyle = v < STILL ? PAL.muted : (v > CUT ? PAL.accent2 : PAL.accent); x.fillRect(bx0 + i * bwid / n, by0 + bh - h, Math.max(1, bwid / n - 1.2), h); });
    x.setLineDash([3, 3]); x.lineWidth = 1; x.strokeStyle = 'rgba(244,239,228,.45)';
    for (const [v, lb] of [[STILL, '정지 0.5'], [CUT, '컷 25']]) { const yy = by0 + bh - sc(v); x.beginPath(); x.moveTo(bx0, yy); x.lineTo(bx0 + bwid, yy); x.stroke(); x.fillStyle = PAL.ink; x.font = "500 10px 'IBM Plex Sans KR',sans-serif"; x.fillText(lb, bx0 + bwid + 6, yy + 3); }
    x.setLineDash([]);
    const phx = bx0 + Math.min(1, t / DUR) * bwid; x.fillStyle = PAL.ink; x.fillRect(phx - .75, by0 - 4, 1.5, bh + 8);
    const ticks = cam.N; for (let i = 1; i < ticks; i++) { x.fillStyle = 'rgba(244,239,228,.35)'; x.fillRect(bx0 + i / ticks * bwid, by0 + bh + 1, 1, 4); }
    x.fillStyle = PAL.muted; x.font = "500 10px 'IBM Plex Sans KR',sans-serif"; x.fillText('프레임 차(10fps) 한 칸 = 0.1초 · 아래 눈금 = 장면 경계', bx0, by0 + bh + 14);
    s.pill.textContent = `${L}단계 · ${STEPS[L - 1]}`;
  },
};
export default demo;
