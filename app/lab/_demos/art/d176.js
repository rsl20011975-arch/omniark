/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/phone-gestures/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rr, rng } from "./helpers.js";

const PAL = { bg0: '#eef2f7', bg1: '#dfe6f0', ink: '#0f1b2d', muted: '#5a6a80', accent: '#2b6cff', accent2: '#ff8a3d', surface: '#ffffff', line: 'rgba(15,27,45,.14)' };

// 폰 화면 위 가상 터치 점으로 스와이프(옆으로 쓸기)와 핀치(두 손가락 벌리기)를 보여 준다. 사진이 손가락을 따라 움직이고, 대체 버튼(‹ › − +)도 함께 둔다. 화면은 시간 t 의 함수다.
const SWIPE_PX = 90;      // 손가락이 왼쪽으로 쓸어 가는 거리 px
const THRESH = 40;        // 이 거리 이상 쓸면 다음 사진으로 넘어가고, 미만이면 되돌아간다
const PINCH_MAX = 1.9;    // 핀치로 확대되는 최대 배율(1.9 = 190%)
const T_DOWN = .65, T_MOVE0 = .75, T_MOVE1 = 1.5, T_REL = 1.55;       // 스와이프: 대고 · 움직이기 시작 · 끝 · 뗌
const T_P_ON = 2.35, T_P0 = 2.55, T_P1 = 3.55, T_P_OFF = 3.65;        // 핀치: 두 손가락 대고 · 벌리기 시작 · 끝 · 뗌
const SANS = "'IBM Plex Sans KR','Malgun Gothic',sans-serif", MONO = "'JetBrains Mono',monospace";
const PX = 440, PY = 195, PW = 156, PH = 300, BZ = 8, PR = 28;          // 폰 가운데·몸체 크기·베젤·모서리
const SW = PW - 2 * BZ, SH = PH - 2 * BZ, SX = PX - SW / 2, SYY = PY - SH / 2, IMH = 180, IY = SYY + 40;   // 화면과 사진 영역
const T = (c, s, x, y, size, col, w = 500, al = 'left', f = SANS) => { c.save(); c.fillStyle = col; c.font = `${w} ${size}px ${f}`; c.textAlign = al; c.textBaseline = 'alphabetic'; c.fillText(s, x, y); c.restore(); };
const lg = (c, x0, y0, x1, y1, stops) => { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, col]) => g.addColorStop(o, col)); return g; };
const drop = (c, x, y, w, h, r, dy, blur, al) => { c.save(); for (let i = 0; i < 8; i++) { const g = blur * (i + 1) / 8; c.fillStyle = `rgba(15,27,45,${(al * .38 / 8).toFixed(3)})`; rr(c, x - g, y + dy - g, w + 2 * g, h + 2 * g, r + g); c.fill(); } c.restore(); };
function grainTile(seed) {
  const g = document.createElement('canvas'); g.width = g.height = 128;
  const x = g.getContext('2d'), im = x.createImageData(128, 128), r = rng(seed);
  for (let i = 0; i < im.data.length; i += 4) { const v = r() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
  x.putImageData(im, 0, 0); return g;
}
const SCENES = [   // 사진 3장: 하늘 그라디언트, 해/달 색, 언덕 두 겹
  { sky: [[0, '#ffb067'], [.5, '#d4547a'], [1, '#3f2f78']], orb: ['#fff1c9', 'rgba(255,190,120,.7)'], ox: .66, oy: .62, h1: '#4a2a6a', h2: '#2a1850', stars: 0 },
  { sky: [[0, '#0b1445'], [1, '#34479f']], orb: ['#fbf7dc', 'rgba(200,220,255,.5)'], ox: .5, oy: .44, h1: '#1d2a72', h2: '#0b1240', stars: 1, lights: 1 },
  { sky: [[0, '#8fe3d2'], [1, '#2f9e8f']], orb: ['#ffffff', 'rgba(255,255,255,.5)'], ox: .72, oy: .3, h1: '#1f7a6e', h2: '#0e4f4a', stars: 0 },
];
function scene(c, k, x, y, w, h, stars) {
  const S = SCENES[k]; c.save(); rr(c, x, y, w, h, 0); c.clip();
  c.fillStyle = lg(c, 0, y, 0, y + h, S.sky); c.fillRect(x, y, w, h);
  if (S.stars) stars.forEach(([a, b, r]) => { c.fillStyle = `rgba(255,255,255,${(.5 + r * .5).toFixed(2)})`; c.beginPath(); c.arc(x + a * w, y + b * h * .6, .6 + r, 0, 6.2832); c.fill(); });
  const ox = x + S.ox * w, oy = y + S.oy * h, g = c.createRadialGradient(ox, oy, 2, ox, oy, 46); g.addColorStop(0, S.orb[1]); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(x, y, w, h);
  c.fillStyle = S.orb[0]; c.beginPath(); c.arc(ox, oy, 11, 0, 6.2832); c.fill();
  [[S.h1, .72, .1], [S.h2, .84, .16]].forEach(([col, base, amp], i) => { c.fillStyle = col; c.beginPath(); c.moveTo(x, y + h);
    for (let u = 0; u <= 1.001; u += .05) c.lineTo(x + u * w, y + h * (base - amp * Math.sin(u * 5 + i * 2) * .5 - amp * .5 * Math.sin(u * 11 + i)));
    c.lineTo(x + w, y + h); c.closePath(); c.fill(); });
  if (S.lights) for (let i = 0; i < 22; i++) { const u = (i * .137 + .05) % 1; c.fillStyle = `rgba(255,222,150,${(.55 + (i % 3) * .2).toFixed(2)})`; c.beginPath(); c.arc(x + u * w, y + h * (.86 + (i % 4) * .028), 1.1 + (i % 2) * .5, 0, 6.2832); c.fill(); }
  c.restore();
}
function touch(c, x, y, k, down) {   // 가상 터치 점: 대는 순간 줄었다 커지는 물결
  if (k <= 0) return; c.save(); c.globalAlpha = Math.min(1, k * 1.2); const r = 15 * (.8 + .2 * k) * (down ? 1 : 1.0);
  c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.fillStyle = 'rgba(255,255,255,.3)'; c.fill(); c.lineWidth = 1.6; c.strokeStyle = 'rgba(255,255,255,.92)'; c.stroke();
  c.beginPath(); c.arc(x, y, 4, 0, 6.2832); c.fillStyle = '#fff'; c.fill(); c.restore();
}
function trail(c, pts) {   // 손가락이 지나간 자리(꼬리)
  for (let i = 1; i < pts.length; i++) { const a = i / pts.length; c.beginPath(); c.moveTo(pts[i - 1][0], pts[i - 1][1]); c.lineTo(pts[i][0], pts[i][1]); c.strokeStyle = `rgba(255,255,255,${(a * .55).toFixed(2)})`; c.lineWidth = 2 + a * 4; c.lineCap = 'round'; c.stroke(); }
}
function btn(c, cx, cy, kind) {   // 대체 버튼(26×26)
  drop(c, cx - 13, cy - 13, 26, 26, 13, 2, 3, .4); c.beginPath(); c.arc(cx, cy, 13, 0, 6.2832); c.fillStyle = 'rgba(255,255,255,.95)'; c.fill();
  c.save(); c.strokeStyle = PAL.ink; c.lineWidth = 2.2; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath();
  if (kind === 'l') { c.moveTo(cx + 2.5, cy - 5); c.lineTo(cx - 2.5, cy); c.lineTo(cx + 2.5, cy + 5); } else if (kind === 'r') { c.moveTo(cx - 2.5, cy - 5); c.lineTo(cx + 2.5, cy); c.lineTo(cx - 2.5, cy + 5); }
  else { c.moveTo(cx - 5, cy); c.lineTo(cx + 5, cy); if (kind === 'p') { c.moveTo(cx, cy - 5); c.lineTo(cx, cy + 5); } } c.stroke(); c.restore();
}
const lab = (c, x, y, w, h, on, done, n, title, l1, l2, extra) => {   // 왼쪽 설명 카드
  drop(c, x, y, w, h, 12, 3, 6, .3); rr(c, x, y, w, h, 12); c.fillStyle = on ? '#e6eeff' : PAL.surface; c.fill();
  c.strokeStyle = on ? PAL.accent : PAL.line; c.lineWidth = on ? 1.6 : 1; rr(c, x + .5, y + .5, w - 1, h - 1, 11.5); c.stroke();
  c.beginPath(); c.arc(x + 20, y + 22, 11, 0, 6.2832); c.fillStyle = done ? PAL.ink : (on ? PAL.accent : 'rgba(15,27,45,.12)'); c.fill();
  if (done) { c.strokeStyle = '#ffffff'; c.lineWidth = 2; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(x + 15, y + 22); c.lineTo(x + 19, y + 26); c.lineTo(x + 25.5, y + 18); c.stroke(); } else T(c, String(n), x + 20, y + 26.5, 12, on ? '#ffffff' : PAL.ink, 700, 'center', MONO);
  T(c, title, x + 40, y + 27, 15, PAL.ink, 700); T(c, l1, x + 16, y + 48, 12.5, PAL.muted, 500); T(c, l2, x + 16, y + 65, 12.5, PAL.muted, 500);
  if (extra) T(c, extra, x + w - 14, y + 27, 12, PAL.accent, 600, 'right', MONO);
};

const demo = {
  dur: 5.0, rest: 4.6, noCompare: false, levels: 4,
  mount(sp) {
    const cv = el('canvas', null, sp); cv.width = 1280; cv.height = 720; cv.style.cssText = 'position:absolute;left:0;top:0;width:640px;height:360px';
    const r = rng(33); return { c: cv.getContext('2d'), grain: grainTile(17), stars: Array.from({ length: 26 }, () => [r(), r(), r()]) };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 4 : lv);   // 1 = 터치 점만 보이고 화면은 즉시 바뀜, 2 = + 스와이프 따라옴·넘김 기준, 3 = + 핀치 확대 따라옴, 4 = + 대체 버튼·터치 영역 표시
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    c.fillStyle = lg(c, 0, 0, 0, 360, [[0, PAL.bg0], [1, PAL.bg1]]); c.fillRect(0, 0, 640, 360);
    const gl = c.createRadialGradient(440, 190, 10, 440, 190, 300); gl.addColorStop(0, 'rgba(255,255,255,.7)'); gl.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = gl; c.fillRect(0, 0, 640, 360);
    // 스와이프 진행: 손가락 위치와 사진 어긋남(off)
    const done = SWIPE_PX >= THRESH, prog = E.inOutC(seg(t, T_MOVE0, T_MOVE1)), fx = SX + SW - 36 - SWIPE_PX * prog;
    const IW = SW - 12;           // 사진 한 장의 가로
    let off = 0, page = 0;
    if (L >= 2) {
      if (t < T_REL) off = SWIPE_PX * prog;
      else if (done) { const u = E.outC(seg(t, T_REL, T_REL + .4)); if (u >= 1) { page = 1; off = 0; } else off = lerp(SWIPE_PX, IW, u); }
      else off = SWIPE_PX * (1 - E.outBack(seg(t, T_REL, T_REL + .4)));
    } else { page = done && t >= T_REL ? 1 : 0; }
    const cur = off > IW / 2 ? 1 : page;
    const zoomP = E.outC(seg(t, T_P0, T_P1)), zoom = L >= 3 ? 1 + (PINCH_MAX - 1) * zoomP : (t >= T_P_OFF ? PINCH_MAX : 1);
    // 폰 몸체
    const x = PX - PW / 2, y = PY - PH / 2;
    drop(c, x, y, PW, PH, PR, 14, 22, .65);
    rr(c, x, y, PW, PH, PR); c.fillStyle = lg(c, x, y, x + PW, y + PH, [[0, '#5a6a80'], [.5, '#26324a'], [1, '#0f1b2d']]); c.fill();
    rr(c, x + 1.6, y + 1.6, PW - 3.2, PH - 3.2, PR - 1.6); c.fillStyle = '#07101e'; c.fill();
    rr(c, x + .6, y + .6, PW - 1.2, PH - 1.2, PR - .6); c.strokeStyle = 'rgba(255,255,255,.28)'; c.lineWidth = 1; c.stroke();
    // 화면
    c.save(); rr(c, SX, SYY, SW, SH, PR - BZ); c.clip(); c.fillStyle = '#0f1b2d'; c.fillRect(SX, SYY, SW, SH);
    T(c, '사진', SX + 14, SYY + 30, 14, '#ffffff', 700); T(c, `${cur + 1} / 3`, SX + SW - 14, SYY + 30, 12, '#b8c4d6', 600, 'right', MONO);
    c.save(); rr(c, SX + 6, IY, SW - 12, IMH, 8); c.clip();
    [0, 1].forEach((k) => { const pxx = SX + 6 + (k - page) * IW - off, cx0 = pxx + IW / 2, cy0 = IY + IMH / 2, z = (k === page) ? zoom : 1;
      c.save(); c.translate(cx0, cy0); c.scale(z, z); c.translate(-cx0, -cy0); scene(c, k, pxx, IY, IW, IMH, s.stars); c.restore(); });
    c.restore();
    if (L >= 3 && zoom > 1.02) { rr(c, SX + SW - 62, IY + 8, 48, 20, 10); c.fillStyle = 'rgba(15,27,45,.78)'; c.fill(); T(c, `${Math.round(zoom * 100)}%`, SX + SW - 38, IY + 22, 12, '#fff', 700, 'center', MONO); }
    [0, 1, 2].forEach((k) => { c.beginPath(); c.arc(SX + SW / 2 + (k - 1) * 12, IY + IMH + 12, k === cur ? 3.4 : 2.6, 0, 6.2832); c.fillStyle = k === cur ? '#fff' : 'rgba(255,255,255,.35)'; c.fill(); });
    if (L >= 4) { const by = SYY + SH - 26, bx = SX + SW / 2; btn(c, bx - 45, by, 'l'); btn(c, bx - 15, by, 'r'); btn(c, bx + 15, by, 'm'); btn(c, bx + 45, by, 'p'); }
    c.restore();
    // 터치 점
    if (L >= 1) {
      const dn = seg(t, T_DOWN, T_DOWN + .12) * (1 - seg(t, T_REL, T_REL + .15));
      if (dn > 0) { const pts = []; if (L >= 2) for (let i = 0; i < 8; i++) { const tt = Math.max(T_MOVE0, t - i * .035), pr = E.inOutC(seg(tt, T_MOVE0, T_MOVE1)); pts.unshift([SX + SW - 36 - SWIPE_PX * pr, IY + IMH * .55 - 6 * Math.sin(pr * Math.PI)]); }
        if (L >= 2) trail(c, pts); touch(c, fx, IY + IMH * .55 - 6 * Math.sin(prog * Math.PI), dn, true); }
      const pd = seg(t, T_P_ON, T_P_ON + .12) * (1 - seg(t, T_P_OFF, T_P_OFF + .15));
      if (pd > 0) { const sc = L >= 3 ? 1 + (PINCH_MAX - 1) * zoomP : (1 + (PINCH_MAX - 1) * (t >= T_P1 ? 1 : 0)), d = 36 * sc / 2, ang = -.6, cx0 = SX + SW / 2, cy0 = IY + IMH / 2;
        const p1 = [cx0 - Math.cos(ang) * d, cy0 - Math.sin(ang) * d], p2 = [cx0 + Math.cos(ang) * d, cy0 + Math.sin(ang) * d];
        if (L >= 3) { c.save(); c.setLineDash([3, 4]); c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(...p1); c.lineTo(...p2); c.stroke(); c.restore(); }
        touch(c, p1[0], p1[1], pd, true); touch(c, p2[0], p2[1], pd, true); }
    }
    // 왼쪽 설명 카드
    if (L >= 1) {
      const a1 = t >= T_DOWN - .1 && t < T_REL + .5, a2 = t >= T_P_ON - .1 && t < T_P_OFF + .3;
      lab(c, 30, 64, 296, 76, a1, t >= T_REL + .5, 1, '스와이프', '손가락 하나로 옆으로 쓸면', `다음 사진으로 넘어가요(기준 ${THRESH}px)`, `${SWIPE_PX}px`);
      lab(c, 30, 150, 296, 76, a2, t >= T_P_OFF + .3, 2, '핀치', '손가락 둘 사이를 벌리면', `사진이 커져요(최대 ${Math.round(PINCH_MAX * 100)}%)`, `×${PINCH_MAX}`);
      if (L >= 4) lab(c, 30, 236, 296, 76, t >= 4.0, false, 3, '대체 버튼', '이전·다음·축소·확대 버튼은 한 번 누르면', '같은 일(버튼 26px, 최소 24px 이상)', '');
    }
    c.globalCompositeOperation = 'overlay'; c.globalAlpha = .06; c.fillStyle = c.createPattern(s.grain, 'repeat'); c.fillRect(0, 0, 640, 360); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
    const labp = ['연출 전: 손가락 없이 결과만 바뀜', '1단계: 터치 점만, 화면은 즉시 바뀜', '2단계: 사진이 손가락을 따라 쓸림', '3단계: 핀치로 사진이 따라 커짐', '4단계: 대체 버튼과 터치 영역'][L];
    c.font = `600 12px ${SANS}`; const tw2 = c.measureText(labp).width + 24, tx2 = 624 - tw2;
    drop(c, tx2, 12, tw2, 24, 2, 2, 4, .5); rr(c, tx2, 12, tw2, 24, 2); c.fillStyle = PAL.surface; c.fill(); c.fillStyle = PAL.accent; c.fillRect(tx2, 12, 3, 24); T(c, labp, tx2 + 14, 28, 12, PAL.ink, 600);
  },
};
export default demo;
