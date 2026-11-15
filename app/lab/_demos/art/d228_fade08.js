/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/reduced-motion-fallback/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 같은 스크롤 홈페이지를 두 번 그린다. 왼쪽은 '움직임 줄이기'가 꺼진 사람의 화면(리빌 0.6초, 스태거 0.1초, 배경 절반 속도)이고,
// 오른쪽은 그 설정을 켠 사람의 화면이다. 오른쪽을 단계마다 고치고, 두 화면을 같은 자(코드가 시간을 훑어 센 값)로 잰다.
const PARALLAX_REDUCED = 1;   // 2단계부터 설정을 켠 화면의 배경 속도(스크롤의 몇 배). 1 이면 글자와 같은 속도
const FADE_S = 0.8;           // 3단계 대체 효과: 이동 없이 불투명도만 바꾸는 시간(초)
const PARALLAX_ON = 0.5;      // 설정이 꺼진 화면의 배경 속도(스크롤의 몇 배)
const RISE = 24;              // 설정이 꺼진 화면에서 카드가 떠오르는 거리(px)
const REVEAL_S = 0.6;         // 설정이 꺼진 화면의 리빌 시간(초)
const STAGGER_S = 0.1;        // 같은 줄 카드가 어긋나는 간격(초)
const DUR = 7.0;
const PAL = { bg0: '#a9402c', bg1: '#8f3322', ink: '#fff4ec', muted: '#ffd9c9', accent: '#ffe27a', accent2: '#1d1a16', surface: '#b24a34', line: 'rgba(255,244,236,.28)' };
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif', BLACK = '"Black Han Sans", sans-serif';
const FW = 190, FH = 300, FY = 44, FX = [12, 210];                       // 두 화면의 틀
const HERO = 170, ROWS = [220, 294, 368], CH = 62, CW = 79, PAGE_H = 454, MAXSC = PAGE_H - FH, EDGE = FH - 24;
const NAMES = ['식빵', '바게트', '크루아상', '단팥빵', '소금빵', '쿠키'], PRICE = ['4,500', '3,800', '3,200', '2,500', '2,800', '2,000'];
const CARDS = NAMES.map((n, i) => ({ n, p: PRICE[i], col: i % 2, x: 12 + (i % 2) * (CW + 8), y: ROWS[(i / 2) | 0] }));
const STEP = ['animation 만 지워서 카드가 투명', '끝 상태로 바로 보이기', '큰 움직임·반복 움직임 끄기', '대체: 이동 없이 짧은 페이드'];

const scrollAt = (t) => MAXSC * E.inOutC(seg(t, 1.0, 4.6));
// 카드가 화면 안에 들어오는 시각(리빌이 시작되는 시각)을 스크롤 곡선에서 미리 구한다
const REVEAL_AT = CARDS.map((c) => { let t = 0; while (t < DUR && c.y >= scrollAt(t) + EDGE) t += 0.01; return Math.max(0.3, t); });

function cardState(L, i, t) {                       // L: -1 = 설정이 꺼진 화면, 0~3 = 설정이 켜진 화면의 단계
  const c = CARDS[i], t0 = REVEAL_AT[i];
  if (L === -1) { const p = E.outC(seg(t, t0 + STAGGER_S * c.col, t0 + STAGGER_S * c.col + REVEAL_S)); return { op: p, ty: RISE * (1 - p) }; }
  if (L === 0) return { op: 0, ty: RISE };          // animation: none 만 썼다: 시작값이 남는다
  if (L <= 2) return { op: 1, ty: 0 };
  return { op: E.outC(seg(t, t0, t0 + FADE_S)), ty: 0 };
}
const bgRatio = (L) => (L === -1 ? PARALLAX_ON : L >= 2 ? PARALLAX_REDUCED : PARALLAX_ON);
const looping = (L) => (L === -1 || L < 2 ? 1 : 0);

function measure(L) {                               // 시간을 0.05초씩 훑어 센 값
  let move = 0, bg = 0;
  for (let t = 0; t <= DUR; t += 0.05) {
    CARDS.forEach((c, i) => { const s = cardState(L, i, t); if (s.op > 0.02) move = Math.max(move, Math.abs(s.ty)); });
    bg = Math.max(bg, Math.abs(scrollAt(t) * (1 - bgRatio(L))));
  }
  return { seen: CARDS.filter((c, i) => cardState(L, i, DUR).op >= 0.99).length, move, bg, loop: looping(L) };
}

let GRAIN = null;
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function rr(x, X, Y, W, H, r) { x.beginPath(); x.roundRect(X, Y, W, H, r); }
function card(x, X, Y, Wd, Ht) { x.save(); x.shadowColor = 'rgba(40,10,4,.45)'; x.shadowBlur = 10; x.shadowOffsetY = 3; x.fillStyle = PAL.surface; rr(x, X, Y, Wd, Ht, 6); x.fill(); x.restore(); x.strokeStyle = PAL.line; x.lineWidth = 1; rr(x, X, Y, Wd, Ht, 6); x.stroke(); }

function heroArt(x, off) {                          // 배경 층: 하늘, 해, 먼 언덕, 가까운 언덕(스크롤보다 느리게 움직이는 층)
  x.save(); x.translate(0, off);
  const g = x.createLinearGradient(0, -90, 0, HERO); g.addColorStop(0, '#f3c79a'); g.addColorStop(0.55, '#e59a6a'); g.addColorStop(1, '#b4553a'); x.fillStyle = g; x.fillRect(0, -90, FW, HERO + 90);
  const sun = x.createRadialGradient(140, 40, 2, 140, 40, 70); sun.addColorStop(0, 'rgba(255,246,214,1)'); sun.addColorStop(0.25, 'rgba(255,230,160,.9)'); sun.addColorStop(1, 'rgba(255,200,120,0)'); x.fillStyle = sun; x.fillRect(60, -40, 160, 160);
  x.fillStyle = '#9a4630'; x.beginPath(); x.moveTo(0, 118); x.bezierCurveTo(40, 82, 80, 100, 120, 92); x.bezierCurveTo(150, 86, 170, 104, FW, 96); x.lineTo(FW, HERO + 10); x.lineTo(0, HERO + 10); x.fill();
  x.fillStyle = '#7a3524'; x.beginPath(); x.moveTo(0, 140); x.bezierCurveTo(50, 118, 90, 146, 130, 130); x.bezierCurveTo(160, 120, 176, 134, FW, 128); x.lineTo(FW, HERO + 10); x.lineTo(0, HERO + 10); x.fill();
  x.restore();
}
function drawCard(x, c, s) {
  if (s.op <= 0.004) return;
  x.save(); x.globalAlpha = Math.min(1, s.op); x.translate(c.x, c.y + s.ty);
  [[5, 0.05], [3, 0.06], [1.5, 0.08]].forEach(([d, al]) => { x.fillStyle = `rgba(60,30,10,${al})`; rr(x, -d * 0.4, d * 0.5, CW + d * 0.8, CH + d * 0.9, 8 + d * 0.4); x.fill(); });   // 번진 접지 그림자(겹겹이 쌓은 반투명 사각형)
  x.fillStyle = '#fff'; rr(x, 0, 0, CW, CH, 8); x.fill();
  const g = x.createLinearGradient(0, 0, 0, 30); g.addColorStop(0, '#e8c28a'); g.addColorStop(1, '#c98f55');
  x.save(); rr(x, 0, 0, CW, CH, 8); x.clip(); x.fillStyle = g; x.fillRect(0, 0, CW, 30); x.fillStyle = 'rgba(255,255,255,.28)'; x.beginPath(); x.ellipse(CW * 0.32, 12, 18, 9, 0, 0, 7); x.fill(); x.restore();
  T(x, c.n, 8, 46, 11, '#1d1a16', 700); T(x, `${c.p}원`, 8, 58, 10, '#6b5a4a', 600, 'left', MONO);
  x.restore();
}
function drawPage(x, X, L, t) {
  const sc = scrollAt(t), r = bgRatio(L);
  x.save(); x.shadowColor = 'rgba(30,6,2,.5)'; x.shadowBlur = 22; x.shadowOffsetY = 9; x.fillStyle = '#fbf8f1'; rr(x, X, FY, FW, FH, 10); x.fill(); x.restore();
  x.save(); rr(x, X, FY, FW, FH, 10); x.clip(); x.translate(X, FY - sc);
  x.save(); x.beginPath(); x.rect(0, 0, FW, HERO); x.clip(); heroArt(x, sc * (1 - r)); x.restore();
  x.save(); x.shadowColor = 'rgba(40,10,4,.5)'; x.shadowBlur = 12; x.shadowOffsetY = 3; T(x, '동네 빵집', 14, 108, 32, '#fff6e6', 400, 'left', BLACK); x.restore();
  T(x, '매일 아침 7시에 문을 엽니다', 14, 128, 11, '#fff1e0', 600);
  if (looping(L)) { const b = 3 * Math.sin(t * 5.2); x.save(); x.strokeStyle = '#fff1e0'; x.lineWidth = 2; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); x.moveTo(FW - 26, HERO - 24 + b); x.lineTo(FW - 20, HERO - 18 + b); x.lineTo(FW - 14, HERO - 24 + b); x.stroke(); x.restore(); }
  T(x, '오늘 구운 빵', 12, 204, 14, '#1d1a16', 800);
  CARDS.forEach((c, i) => drawCard(x, c, cardState(L, i, t)));
  x.restore();
  x.fillStyle = 'rgba(29,26,22,.22)'; rr(x, X + FW - 6, FY + 6, 3, FH - 12, 2); x.fill();     // 스크롤 위치
  x.fillStyle = 'rgba(29,26,22,.7)'; const th = (FH - 12) * FH / PAGE_H; rr(x, X + FW - 6, FY + 6 + (FH - 12 - th) * sc / MAXSC, 3, th, 2); x.fill();
  x.strokeStyle = 'rgba(255,244,236,.3)'; x.lineWidth = 1; rr(x, X + 0.5, FY + 0.5, FW - 1, FH - 1, 10); x.stroke();
}

const demo = {
  dur: DUR, rest: DUR, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(228), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const tag = el('div', null, sp);
    Object.assign(tag.style, { position: 'absolute', right: '12px', top: '10px', padding: '.55em .8em .55em .75em', borderRadius: '2px', background: PAL.surface, color: PAL.ink, borderLeft: `3px solid ${PAL.accent}`, boxShadow: `inset 0 0 0 1px ${PAL.line}, 0 4px 12px rgba(40,10,4,.35)`, font: "600 12px/1.2 'IBM Plex Sans KR',sans-serif", whiteSpace: 'nowrap', zIndex: '4' });
    return { main, tag };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 0 : (lv == null ? 3 : lv);
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.1;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();
    T(x, '움직임 줄이기 꺼짐', FX[0], 34, 12, PAL.ink, 700); T(x, '움직임 줄이기 켜짐', FX[1], 34, 12, PAL.accent, 700);
    drawPage(x, FX[0], -1, t); drawPage(x, FX[1], L, t);

    // 두 화면을 같은 자로 잰 값(시간을 훑어 코드가 계산)
    const m0 = measure(-1), m1 = measure(L), PX = 410, PW = 220, C0 = PX + 150, C1 = PX + PW - 14;
    card(x, PX, 56, PW, 236);
    T(x, '같은 자로 잰 값', PX + 14, 84, 14, PAL.ink, 700);
    T(x, '꺼짐', C0, 108, 11, PAL.muted, 600, 'right'); T(x, '켜짐', C1, 108, 11, PAL.accent, 700, 'right');
    const rows = [['끝에 보이는 카드', `${m0.seen}/6`, `${m1.seen}/6`, m1.seen < 6], ['카드 이동 최대', `${m0.move.toFixed(0)}px`, `${m1.move.toFixed(0)}px`, false], ['배경 따로 움직임', `${m0.bg.toFixed(0)}px`, `${m1.bg.toFixed(0)}px`, false], ['반복 움직임', `${m0.loop}개`, `${m1.loop}개`, false]];
    rows.forEach(([k, v0, v1, bad], i) => {
      const Y = 136 + i * 28; T(x, k, PX + 14, Y, 12, PAL.ink, 600);
      T(x, v0, C0, Y, 13, PAL.muted, 700, 'right', MONO); T(x, v1, C1, Y, 13, bad ? '#ffb4a0' : PAL.accent, 700, 'right', MONO);
    });
    const pass = m1.seen === 6;
    x.fillStyle = PAL.line; x.fillRect(PX + 14, 252, PW - 28, 1);
    T(x, '합격선: 내용이 다 보임', PX + 14, 274, 12, PAL.ink, 600);
    T(x, pass ? '통과' : '실패', C1, 274, 14, pass ? PAL.accent : '#ffb4a0', 800, 'right');
    s.tag.textContent = STEP[L];
  },
};
export default demo;
