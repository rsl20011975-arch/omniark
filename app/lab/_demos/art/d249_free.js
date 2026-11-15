/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/reference-upload-silent-fail/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 참조 이미지를 올린 뒤 언제 생성 버튼을 누르느냐에 따라 결과가 어떻게 갈리는지를 시간 축 하나에 그린다.
// 화면의 그림은 전부 코드로 그린 예시다. 발사 시각, 그때 진행률, 붙음 여부는 아래 상수에서 코드가 계산한다.
const SPEED = 2.2;          // 화면 1초 = 장면 속 2.2초(장면 속 초는 표의 가로축)
const UP_SEC = 15;          // 큰 시트 업로드가 걸리는 시간(가정한 값)
const FIXED_WAIT = 3;       // 옛 자동화의 고정 대기(초)
const ATTACH_SEC = 2;       // 프롬프트에 붙이는 단계가 걸리는 시간(가정한 값)
const MAX_WAIT = 60;        // 업로드가 끝나기를 기다리는 최대 시간(초)
const ATTACH_CHECK = 1;     // 1 이면 프롬프트에 붙은 것을 확인한 뒤에만 생성한다
const FIDELITY = 2;         // 충실도 0 엄수, 1 균형, 2 자유
const AXIS = 20;            // 가로축 길이(초)
const PAL = { bg0: '#f2f2f0', bg1: '#e4e4e1', ink: '#111111', muted: '#666666', accent: '#ff3b1f', accent2: '#111111', surface: '#ffffff', line: 'rgba(17,17,17,.2)' };
const RED = '#c4200a';      // 글자용 짙은 빨강(밝은 바탕에서 대비 4.5 이상)
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif';
const STEP = ['고정 3초 뒤 발사', '업로드가 끝나면 발사', '붙은 것을 확인하고 발사', '충실도 문구를 더한다'];
const FID = ['엄수', '균형', '자유'], FIDN = ['얼굴·머리·색을 그대로', '알아볼 만큼만 비슷하게', '분위기만 참고'];

const mix = (a, b, t) => {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)), x = p(a), y = p(b);
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
};
const SKIN = mix(PAL.accent, '#ffffff', 0.74);
const SPEC = {      // 참조 인물과 결과 인물의 색·머리 모양
  ref: { hood: PAL.accent, hair: PAL.ink, pants: mix(PAL.ink, '#ffffff', 0.18), spike: 0, strap: 0, str: 1, k: 1 },
  foreign: { hood: mix(PAL.muted, PAL.ink, 0.1), hair: mix(PAL.accent, '#f2f2f0', 0.45), pants: mix(PAL.accent, PAL.ink, 0.62), spike: 1, strap: 1, str: 0, k: 1 },
  close: { hood: mix(PAL.accent, PAL.ink, 0.2), hair: PAL.ink, pants: mix(PAL.ink, '#ffffff', 0.18), spike: 0, strap: 0, str: 0, k: 1 },
  loose: { hood: mix(PAL.accent, '#ffbb22', 0.5), hair: mix(PAL.ink, PAL.muted, 0.5), pants: mix(PAL.ink, '#ffffff', 0.3), spike: 1, strap: 0, str: 0, k: 1.06 },
};
SPEC.same = SPEC.ref;

function person(g, cx, gy, S, o, a) {      // 앞모습 인물. 빛은 왼쪽 위, 발밑에 접지 그림자
  g.save(); g.globalAlpha = a; g.translate(cx, gy); g.scale(S * o.k, S * o.k);
  const sh = g.createRadialGradient(0, 0, 0, 0, 0, 30); sh.addColorStop(0, 'rgba(0,0,0,.34)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
  g.save(); g.scale(1, 0.16); g.fillStyle = sh; g.beginPath(); g.arc(0, 0, 30, 0, 7); g.fill(); g.restore();
  const lg = (x0, x1, c0, c1) => { const q = g.createLinearGradient(x0, 0, x1, 0); q.addColorStop(0, c0); q.addColorStop(1, c1); return q; };
  [-1, 1].forEach((sd) => { g.fillStyle = lg(sd * 8 - 5, sd * 8 + 5, mix(o.pants, '#ffffff', 0.18), mix(o.pants, '#000000', 0.35)); g.beginPath(); g.roundRect(sd * 8 - 5.5, -48, 11, 46, 3); g.fill(); g.fillStyle = PAL.ink; g.beginPath(); g.roundRect(sd * 8 - 7, -5, 14, 6, 3); g.fill(); });
  if (o.strap) { g.fillStyle = mix(o.hood, '#000000', 0.55); g.beginPath(); g.roundRect(-21, -90, 7, 42, 3); g.fill(); }
  g.fillStyle = mix(o.hood, '#000000', 0.5); g.beginPath(); g.arc(0, -99, 17.5, 0, 7); g.fill();
  [-1, 1].forEach((sd) => { g.save(); g.translate(sd * 18, -84); g.rotate(sd * 0.1); g.fillStyle = lg(-4.5, 4.5, mix(o.hood, '#ffffff', sd < 0 ? 0.25 : 0), mix(o.hood, '#000000', 0.42)); g.beginPath(); g.roundRect(-4.5, 0, 9, 32, 4.5); g.fill(); g.fillStyle = SKIN; g.beginPath(); g.arc(0, 34, 4, 0, 7); g.fill(); g.restore(); });
  g.fillStyle = lg(-17, 17, mix(o.hood, '#ffffff', 0.3), mix(o.hood, '#000000', 0.4)); g.beginPath(); g.roundRect(-17, -90, 34, 44, 9); g.fill();
  g.strokeStyle = 'rgba(0,0,0,.22)'; g.lineWidth = 1; g.beginPath(); g.moveTo(-17, -52); g.lineTo(17, -52); g.stroke();
  if (o.str) { g.strokeStyle = PAL.surface; g.lineWidth = 1.6; g.beginPath(); g.moveTo(-4, -86); g.lineTo(-5, -70); g.moveTo(4, -86); g.lineTo(5, -70); g.stroke(); }
  const hg = g.createRadialGradient(-4, -106, 2, 0, -102, 15); hg.addColorStop(0, mix(SKIN, '#ffffff', 0.4)); hg.addColorStop(1, mix(SKIN, '#000000', 0.22));
  g.fillStyle = hg; g.beginPath(); g.arc(0, -102, 13.5, 0, 7); g.fill();
  g.fillStyle = o.hair; g.beginPath(); g.arc(0, -103, 14.2, Math.PI * 1.04, Math.PI * 1.96); g.lineTo(11, -108); g.lineTo(-11, -108); g.fill();
  if (o.spike) { [-9, -3, 4, 10].forEach((x, i) => { g.beginPath(); g.moveTo(x - 4, -113); g.lineTo(x + 0.5, -124 + (i % 2) * 3); g.lineTo(x + 4, -113); g.fill(); }); }
  g.fillStyle = '#1a1a1a'; [-5, 5].forEach((x) => { g.beginPath(); g.arc(x, -101, 1.7, 0, 7); g.fill(); });
  g.restore();
}

function plan(L) {      // 단계마다 언제 발사하고 결과가 어떤지 계산한다
  const p = (s) => Math.min(1, s / UP_SEC);
  if (L === 1) return { fire: FIXED_WAIT, pct: Math.round(100 * p(FIXED_WAIT)), attached: false, res: 'foreign', abort: false };
  if (UP_SEC > MAX_WAIT) return { fire: null, pct: Math.round(100 * p(MAX_WAIT)), attached: false, res: 'none', abort: true };
  if (L >= 3 && ATTACH_CHECK) return { fire: UP_SEC + ATTACH_SEC, pct: 100, attached: true, res: L === 3 ? 'same' : ['same', 'close', 'loose'][FIDELITY], abort: false };
  return { fire: UP_SEC, pct: 100, attached: false, res: 'foreign', abort: false };
}

function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function card(x, X, Y, W, H) {
  x.fillStyle = 'rgba(0,0,0,.05)'; x.beginPath(); x.roundRect(X + 1, Y + 4, W, H, 8); x.fill();
  x.fillStyle = 'rgba(0,0,0,.05)'; x.beginPath(); x.roundRect(X, Y + 2, W, H, 8); x.fill();
  x.fillStyle = PAL.surface; x.beginPath(); x.roundRect(X, Y, W, H, 8); x.fill(); x.strokeStyle = PAL.line; x.lineWidth = 1; x.stroke();
}
let GRAIN = null;

const demo = {
  dur: 9.2, rest: 9.2, noCompare: false, levels: 4,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(11), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const lab = el('div', null, sp);      // 이름표(vertical): 왼쪽 가장자리 세로쓰기
    Object.assign(lab.style, { position: 'absolute', left: '12px', top: '40px', writingMode: 'vertical-rl', letterSpacing: '.06em', whiteSpace: 'nowrap', lineHeight: '12px', zIndex: '4' });
    const idx = el('span', null, lab), pill = el('span', null, lab);
    Object.assign(idx.style, { color: PAL.muted, font: "500 12px/1 'JetBrains Mono',monospace", marginBottom: '10px' });
    Object.assign(pill.style, { color: PAL.ink, font: "600 12px/1 'IBM Plex Sans KR',sans-serif" });
    return { main, idx, pill };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 1 : (lv == null ? 4 : lv), P = plan(L), sn = t * SPEED, x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'multiply'; x.globalAlpha = 0.07;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();
    T(x, '참조 업로드와 생성 버튼을 누른 시각', 56, 30, 14, PAL.ink, 600);
    T(x, '코드로 그린 예시 그림', 612, 30, 10, PAL.muted, 500, 'right');
    // 큰 요소: 업로드 진행률 곡선 하나
    const CX = 56, CY = 40, CW = 316, CH = 216, px0 = 96, px1 = 360, py0 = 78, py1 = 214;
    const X = (sec) => px0 + sec / AXIS * (px1 - px0), Y = (r2) => py1 - r2 * (py1 - py0);
    card(x, CX, CY, CW, CH);
    T(x, '업로드 진행률', CX + 14, CY + 20, 12, PAL.ink, 600);
    [0, 0.5, 1].forEach((v) => { x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.moveTo(px0, Y(v) + 0.5); x.lineTo(px1, Y(v) + 0.5); x.stroke(); T(x, `${v * 100}%`, px0 - 8, Y(v) + 4, 10, PAL.muted, 500, 'right', MONO); });
    [0, 5, 10, 15, 20].forEach((v) => T(x, v === 20 ? '20초' : `${v}`, X(v), py1 + 16, 10, PAL.muted, 500, 'center', MONO));
    if (L === 1) {
      x.fillStyle = 'rgba(17,17,17,.06)'; x.fillRect(X(0), py0 - 6, X(FIXED_WAIT) - X(0), py1 - py0 + 6);
      T(x, `고정 ${FIXED_WAIT}초 대기`, X(FIXED_WAIT) + 8, Y(FIXED_WAIT / UP_SEC) + 20, 10, PAL.muted, 600);
    }
    const end = Math.min(sn, AXIS), pr = (sec) => Math.min(1, sec / UP_SEC);
    const upEnd = P.abort ? Math.min(end, MAX_WAIT) : end;
    const g1 = x.createLinearGradient(0, py0, 0, py1); g1.addColorStop(0, 'rgba(17,17,17,.14)'); g1.addColorStop(1, 'rgba(17,17,17,.02)');
    x.beginPath(); x.moveTo(X(0), Y(0)); for (let q = 0; q <= 60; q++) { const sec = upEnd * q / 60; x.lineTo(X(sec), Y(pr(sec))); } x.lineTo(X(upEnd), Y(0)); x.closePath(); x.fillStyle = g1; x.fill();
    x.strokeStyle = PAL.ink; x.lineWidth = 2.2; x.lineJoin = 'round'; x.beginPath(); for (let q = 0; q <= 60; q++) { const sec = upEnd * q / 60; q ? x.lineTo(X(sec), Y(pr(sec))) : x.moveTo(X(sec), Y(pr(sec))); } x.stroke();
    if (L >= 3 && ATTACH_CHECK && !P.abort && sn > UP_SEC) {
      const e2 = Math.min(sn, UP_SEC + ATTACH_SEC); x.fillStyle = PAL.ink; x.beginPath(); x.roundRect(X(UP_SEC), py1 - 14, X(e2) - X(UP_SEC), 8, 3); x.fill();
      T(x, '붙이는 중', X(UP_SEC) - 4, py1 - 20, 10, PAL.ink, 600, 'right');
    }
    if (P.abort && sn >= MAX_WAIT) {
      const ax = X(Math.min(MAX_WAIT, AXIS)), ay = Y(pr(MAX_WAIT));
      x.strokeStyle = RED; x.lineWidth = 2.4; x.beginPath(); x.moveTo(ax - 5, ay - 5); x.lineTo(ax + 5, ay + 5); x.moveTo(ax + 5, ay - 5); x.lineTo(ax - 5, ay + 5); x.stroke();
      T(x, `${MAX_WAIT}초 넘게 안 끝나 중단`, ax - 8, ay - 12, 11, RED, 700, 'right');
    }
    if (P.fire != null && sn >= P.fire) {
      const fx = X(P.fire), fy = Y(pr(P.fire));
      x.strokeStyle = RED; x.lineWidth = 1.6; x.setLineDash([4, 3]); x.beginPath(); x.moveTo(fx + 0.5, py0 - 10); x.lineTo(fx + 0.5, py1); x.stroke(); x.setLineDash([]);
      x.fillStyle = PAL.surface; x.strokeStyle = RED; x.lineWidth = 2.2; x.beginPath(); x.arc(fx, fy, 5, 0, 7); x.fill(); x.stroke();
      T(x, `발사 ${P.pct}%`, fx + (fx > px1 - 70 ? -10 : 8), py0 - 14, 11, RED, 700, fx > px1 - 70 ? 'right' : 'left');
    }
    // 참조 카드와 결과 카드
    const gy = 232, rv = P.fire == null ? seg(t, 0.2, 0.9) : E.outBack(seg(t, P.fire / SPEED + 0.2, P.fire / SPEED + 1.0));
    card(x, 384, 40, 106, 216); T(x, '참조', 397, 60, 12, PAL.ink, 600);
    person(x, 437, gy, 1.2, SPEC.ref, 1);
    card(x, 500, 40, 112, 216); T(x, '결과', 513, 60, 12, PAL.ink, 600);
    if (P.res === 'none') {
      x.strokeStyle = PAL.line; x.setLineDash([4, 4]); x.beginPath(); x.roundRect(516, 90, 80, 124, 6); x.stroke(); x.setLineDash([]);
      T(x, '생성 안 함', 556, 156, 11, RED, 700, 'center');
    } else if (rv > 0.01) person(x, 556, gy, 1.2 * (0.86 + 0.14 * Math.min(1, rv)), SPEC[P.res], Math.min(1, rv));
    const note = { foreign: '참조 없이 그려진 예시', same: '참조가 붙은 채 그린 예시', close: '충실도 균형으로 그린 예시', loose: '충실도 자유로 그린 예시', none: '' }[P.res];
    if (note && rv > 0.5) T(x, note, 556, 249, 10, PAL.muted, 500, 'center');
    // 아래 값
    const cols = [
      ['생성 발사', P.fire == null ? '중단' : `${P.fire}초`, P.fire == null ? RED : PAL.ink, P.fire == null ? `${MAX_WAIT}초 안에 안 끝남` : L === 1 ? '고정 대기가 끝난 시각' : L === 2 || !ATTACH_CHECK ? '진행률 100%가 된 시각' : '붙은 것을 확인한 시각'],
      ['그때 진행률', `${P.pct}%`, P.pct < 100 ? RED : PAL.ink, '발사 순간 올라간 비율'],
      ['참조 붙음', P.attached ? '예' : '아니오', P.attached ? PAL.ink : RED, P.attached ? '프롬프트 칸에 썸네일' : L === 1 ? '아직 올라가는 중' : '올라갔지만 붙이지 않음'],
    ];
    if (L === 4) cols.push(['충실도', FID[FIDELITY], PAL.ink, FIDN[FIDELITY]]);
    const cwid = 556 / cols.length;
    cols.forEach(([name, val, col, nt], k) => {
      const X2 = 56 + k * cwid;
      T(x, name, X2, 284, 11, PAL.ink, 600); T(x, val, X2, 310, 22, col, 700, 'left', MONO); T(x, nt, X2, 326, 10, PAL.muted, 500);
    });
    s.idx.textContent = '0' + L; s.pill.textContent = STEP[L - 1];
  },
};
export default demo;
