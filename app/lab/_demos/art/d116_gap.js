/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/intro-outro/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 총 9.0초 영상의 구조를 '본편만 → 인트로(앞) 추가 → 아웃트로(끝 화면) 추가' 순서로 비교한다. 구간 길이의 합은 늘 총 길이와 같다. 화면은 시간 t 의 함수다.
const INTRO = 2.0;            // 인트로 길이(초)
const OUTRO = 3.0;            // 아웃트로(끝 화면) 길이(초)
const TOTAL = 9.0;            // 영상 총 길이(초)
const DUR = 9.4;
const GAP = .6;              // 아웃트로: 다음 영상 카드가 하나씩 올라오는 시간 간격(초)
const FONT = '40px "Black Han Sans"';
const PAL = { bg0: '#a9402c', bg1: '#8f3322', ink: '#fff4ec', muted: '#ffd9c9', accent: '#ffe27a', accent2: '#1d1a16', surface: '#b24a34', line: 'rgba(255,244,236,.3)' };
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const SEG = { intro: ['#ff9a6b', '인트로'], main: [PAL.accent, '본편'], outro: [PAL.ink, '아웃트로'] };
const CARDS = [['다음 편', '레이어 쉽게 배우기', '#2a1410', '#c4603c'], ['추천', '속도 램프 만들기', '#1d1a16', '#e0a040']];

function plan(L) {            // 구간 목록: [종류, 시작, 끝]
  const i = L >= 2 ? INTRO : 0, o = L >= 3 ? OUTRO : 0, p = [];
  if (i) p.push(['intro', 0, i]);
  p.push(['main', i, TOTAL - o]);
  if (o) p.push(['outro', TOTAL - o, TOTAL]);
  return p;
}

function rr(x, a, b, w, h, r) { x.beginPath(); x.roundRect(a, b, w, h, r); }

function content(x, ct, rect, mount) {      // 본편 장면. rect = 화면 위 놓일 곳(640×360 기준)
  const [rx, ry, rw, rh] = rect, k = rw / 640;
  x.save(); rr(x, rx, ry, rw, rh, mount ? 8 : 0); x.clip();
  x.translate(rx, ry); x.scale(k, k);
  const g = x.createLinearGradient(0, 0, 260, 360); g.addColorStop(0, '#4a1a14'); g.addColorStop(.55, '#c4603c'); g.addColorStop(1, '#ffd9a0');
  x.fillStyle = g; x.fillRect(0, 0, 640, 360);
  [[330, .5], [110, .45]].forEach(([r, a]) => {
    const cx = 380 + 90 * Math.sin(ct * .6), cy = 120 + 20 * Math.cos(ct * .5), rg = x.createRadialGradient(cx, cy, 0, cx, cy, r);
    rg.addColorStop(0, `rgba(255,243,200,${a})`); rg.addColorStop(1, 'rgba(255,243,200,0)'); x.fillStyle = rg; x.fillRect(0, 0, 640, 360);
  });
  x.beginPath(); x.moveTo(0, 360);
  for (let px = 0; px <= 640; px += 10) x.lineTo(px, 292 + Math.sin(px / 90 + ct * .2) * 14 + Math.sin(px / 33) * 4);
  x.lineTo(640, 360); x.closePath(); x.fillStyle = rgba(PAL.accent2, .82); x.fill();
  x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 24; x.shadowOffsetY = 6;
  x.fillStyle = PAL.ink; x.textAlign = 'left'; x.font = '400 118px "Black Han Sans", sans-serif'; x.fillText('본편', 40, 190);
  x.shadowColor = 'transparent'; x.font = '500 30px "JetBrains Mono", monospace'; x.fillStyle = rgba(PAL.ink, .92);
  const m = Math.max(0, ct); x.fillText(`00:${String(Math.floor(m)).padStart(2, '0')}.${Math.floor((m % 1) * 10)}`, 44, 236);
  x.restore();
}

function logo(x, cx, cy, s, p) {             // 채널 로고: 둥근 사각형 + 그려지는 흰 고리 + 재생 삼각형
  x.save(); x.translate(cx, cy); x.scale(s, s);
  const g = x.createLinearGradient(-48, -48, 48, 48); g.addColorStop(0, PAL.accent); g.addColorStop(1, '#ff9a6b');
  x.shadowColor = 'rgba(255,226,122,.55)'; x.shadowBlur = 26; rr(x, -48, -48, 96, 96, 24); x.fillStyle = g; x.fill(); x.shadowColor = 'transparent';
  const gl = x.createLinearGradient(0, -48, 0, 0); gl.addColorStop(0, 'rgba(255,255,255,.35)'); gl.addColorStop(1, 'rgba(255,255,255,0)'); rr(x, -48, -48, 96, 48, 24); x.fillStyle = gl; x.fill();
  x.strokeStyle = PAL.accent2; x.lineWidth = 9; x.lineCap = 'round';
  x.beginPath(); x.arc(0, 0, 30, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p); x.stroke();
  x.fillStyle = `rgba(29,26,22,${p})`; x.beginPath(); x.moveTo(-8, -13); x.lineTo(14, 0); x.lineTo(-8, 13); x.closePath(); x.fill();
  x.restore();
}

function intro(x, it) {
  const bg = x.createLinearGradient(0, 0, 640, 360); bg.addColorStop(0, '#5a1f14'); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
  [[300, .45], [110, .4]].forEach(([r, a]) => { const rg = x.createRadialGradient(230, 180, 0, 230, 180, r); rg.addColorStop(0, `rgba(255,180,120,${a})`); rg.addColorStop(1, 'rgba(255,180,120,0)'); x.fillStyle = rg; x.fillRect(0, 0, 640, 360); });
  const p = E.inOutC(seg(it, .05, .55)), sc = lerp(.6, 1, E.outBack(seg(it, .05, .65)));
  logo(x, 170, 180, sc, p);
  const q = E.outC(seg(it, .3, .8));
  x.save(); x.globalAlpha = q; x.translate((1 - q) * 30, 0);
  x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 18; x.fillStyle = PAL.ink; x.textAlign = 'left'; x.font = '400 58px "Black Han Sans", sans-serif'; x.fillText('마루 채널', 246, 192);
  x.shadowColor = 'transparent'; x.fillStyle = rgba(PAL.ink, .88); x.font = '500 20px "IBM Plex Sans KR", sans-serif'; x.fillText('오늘의 주제 · 레이어 쉽게 배우기', 248, 224);
  x.restore();
  const fl = Math.max(0, 1 - seg(it, .5, .8)) * (it > .5 ? 1 : 0); if (fl > 0) { x.fillStyle = `rgba(255,255,255,${(.25 * fl).toFixed(3)})`; x.fillRect(0, 0, 640, 360); }
}

function outro(x, ot, ct) {
  const bg = x.createLinearGradient(0, 0, 640, 360); bg.addColorStop(0, '#4a180f'); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
  const p = E.inOutC(seg(ot, 0, .5)), rect = [lerp(0, 24, p), lerp(0, 52, p), lerp(640, 256, p), lerp(360, 144, p)];
  content(x, ct, rect, true);
  if (p > .02) { x.strokeStyle = `rgba(255,244,236,${(.6 * p).toFixed(2)})`; x.lineWidth = 1.5; rr(x, rect[0], rect[1], rect[2], rect[3], 8); x.stroke(); }
  x.fillStyle = `rgba(255,244,236,${E.outC(seg(ot, .3, .6)).toFixed(2)})`; x.textAlign = 'left'; x.font = '600 15px "IBM Plex Sans KR", sans-serif'; x.fillText('다음 영상', 304, 44);
  CARDS.forEach(([h, t2, a, b], i) => {
    const q = seg(ot, .4 + i * GAP, .4 + i * GAP + .45), u = E.outBack(q), cx = 304 + i * 160, cy = 56 + (1 - u) * 18;
    x.save(); x.globalAlpha = Math.min(1, q * 2.2);
    const g = x.createLinearGradient(cx, cy, cx + 150, cy + 84); g.addColorStop(0, a); g.addColorStop(1, b);
    x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 12; x.shadowOffsetY = 4; rr(x, cx, cy, 150, 84, 8); x.fillStyle = g; x.fill(); x.shadowColor = 'transparent';
    const gl = x.createRadialGradient(cx + 120, cy + 16, 0, cx + 120, cy + 16, 70); gl.addColorStop(0, 'rgba(255,255,255,.3)'); gl.addColorStop(1, 'rgba(255,255,255,0)'); rr(x, cx, cy, 150, 84, 8); x.fillStyle = gl; x.fill();
    x.fillStyle = PAL.ink; x.font = '400 30px "Black Han Sans", sans-serif'; x.fillText(h, cx + 12, cy + 40);
    x.font = '500 13px "IBM Plex Sans KR", sans-serif'; x.fillStyle = rgba(PAL.ink, .95); x.fillText(t2, cx + 12, cy + 66);
    x.restore();
  });
  const bq = seg(ot, .9, 1.3), bu = E.outBack(bq);
  x.save(); x.globalAlpha = Math.min(1, bq * 2.2); x.translate(0, (1 - bu) * 14);
  const bg2 = x.createLinearGradient(0, 160, 0, 200); bg2.addColorStop(0, '#fff0a0'); bg2.addColorStop(1, '#f0b830');
  x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 14; rr(x, 304, 160, 310, 40, 20); x.fillStyle = bg2; x.fill(); x.shadowColor = 'transparent';
  x.fillStyle = PAL.accent2; x.textAlign = 'center'; x.font = '600 17px "IBM Plex Sans KR", sans-serif'; x.fillText('구독하기', 459, 186); x.restore();
}

const demo = {
  dur: DUR, rest: 7.5, noCompare: false, levels: 3,
  mount(sp) {
    const css = (e, o) => Object.assign(e.style, o);
    const main = el('canvas', null, sp);
    main.width = 1280; main.height = 720; css(main, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const pill = el('div', null, sp);                        // 왼쪽 아래 캡션: 배경 없이 얇은 선 + 모노 12px
    css(pill, { position: 'absolute', left: '20px', bottom: '44px', paddingTop: '6px', borderTop: `1px solid ${PAL.line}`, color: PAL.muted, font: "500 12px/1.3 'JetBrains Mono','IBM Plex Sans KR',monospace", letterSpacing: '.02em', textShadow: '0 1px 4px rgba(0,0,0,.75)' });
    return { main, pill, ok: null };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 본편만(기준), 2 = + 인트로, 3 = + 아웃트로
    const x = s.main.getContext('2d'), P = plan(L);
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const tt = Math.min(t, TOTAL - .001), cur = P.find((q) => tt >= q[1] && tt < q[2]) || P[P.length - 1];
    const mainStart = P.find((q) => q[0] === 'main')[1], ct = tt - mainStart;
    if (cur[0] === 'intro') {
      const it = tt - cur[1], fade = seg(it, INTRO - .25, INTRO);
      content(x, 0, [0, 0, 640, 360], false); x.globalAlpha = 1 - fade; intro(x, it); x.globalAlpha = 1;
    } else if (cur[0] === 'main') content(x, ct, [0, 0, 640, 360], false);
    else outro(x, tt - cur[1], ct);
    // 아래: 구간 막대
    x.fillStyle = rgba(PAL.accent2, .84); rr(x, 14, 326, 612, 28, 6); x.fill();
    P.forEach(([k, a0, a1]) => {
      const bx = 20 + a0 / TOTAL * 600, bw = (a1 - a0) / TOTAL * 600 - 1;
      x.fillStyle = SEG[k][0]; rr(x, bx, 331, bw, 18, 3); x.fill();
      x.fillStyle = PAL.accent2; x.textAlign = 'center'; x.font = '600 10.5px "IBM Plex Sans KR", sans-serif'; x.fillText(`${SEG[k][1]} ${(a1 - a0).toFixed(1)}초`, bx + bw / 2, 344);
    });
    x.fillStyle = PAL.ink; x.fillRect(20 + Math.min(t, TOTAL) / TOTAL * 600 - 2, 326, 4, 28); x.fillStyle = PAL.accent2; x.fillRect(20 + Math.min(t, TOTAL) / TOTAL * 600 - 1, 327, 2, 26);
    const sum = P.reduce((v, q) => v + q[2] - q[1], 0);
    x.fillStyle = rgba(PAL.accent2, .84); rr(x, 462, 14, 166, 24, 4); x.fill();
    x.fillStyle = PAL.ink; x.textAlign = 'left'; x.font = '500 12px "JetBrains Mono", monospace'; x.fillText(`구간 합 = 총 ${sum.toFixed(1)}초`, 472, 31);
    s.pill.textContent = L <= 1 ? '01 / 본편만, 인트로와 아웃트로 없음' : cur[0] === 'intro' ? `02 / 인트로 ${INTRO.toFixed(1)}초` : cur[0] === 'main' ? '03 / 본편' : `04 / 아웃트로, 끝 화면 ${OUTRO.toFixed(1)}초`;
  },
};
export default demo;
