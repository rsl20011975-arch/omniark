/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/design-tokens-one-file/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 앱 화면 하나를 '값을 직접 박은 파일'과 '토큰 한 파일을 읽는 화면'으로 나란히 보여 준다.
// 직접 쓴 값 개수, 같은 뜻인데 다른 값의 종류, 글자 대비, 토큰 상태는 모두 코드가 이 장면에서 센다. 화면은 시간 t 의 함수다.
const RADIUS = 20;             // radius.m 모서리(px)
const SPACE = 20;              // space.4 카드 안쪽 여백(px)
const BODY = 14;               // text.body 본문 글자(px)
const SWITCH_T = 3.0;          // 라이트에서 다크로 바뀌기 시작하는 시각(초)
const ACCENT_L = '#d92b12';    // color.accent 라이트 값
const FADE = 0.6;              // 모드 전환 시간(초)
const MIN_RATIO = 4.5;         // 글자 대비 기준(WCAG 일반 글자)
const PAL = { bg0: '#f2f2f0', bg1: '#e4e4e1', ink: '#111111', muted: '#666666', accent: '#ff3b1f', accent2: '#111111', surface: '#ffffff', line: 'rgba(17,17,17,.16)' };
const ACC_INK = '#b3260f', OK_INK = '#1f7a3d', WARN_INK = '#8a5a00';   // 작은 글자용 짙은 색(흰 바탕 대비 5.4, 5.4, 5.9 이상)
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif', HAN = '"Black Han Sans", sans-serif';

const hx = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const toHex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const mix = (a, b, p) => { const A = hx(a), B = hx(b); return toHex(A.map((v, i) => lerp(v, B[i], p))); };
const rgba = (h, a) => { const c = hx(h); return `rgba(${c[0]},${c[1]},${c[2]},${a})`; };
const lum = (h) => { const [r, g, b] = hx(h).map((v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

// 토큰: [이름, 라이트 값, 다크 값, 종류, 상태, 메모]. 별칭은 값이 {이름} 모양이다.
const TOK = [
  ['color.bg', '#f5f4f1', '#15161a', 'color', 'adopted', ''],
  ['color.surface', '#ffffff', '#1f2127', 'color', 'adopted', ''],
  ['color.ink', '#1b1b1a', '#f1f0ec', 'color', 'adopted', ''],
  ['color.ink-muted', '#62605b', '#a3a29c', 'color', 'adopted', ''],
  ['color.accent', ACCENT_L, '#ff7a5c', 'color', 'adopted', ''],
  ['color.on-accent', '#ffffff', '#15161a', 'color', 'adopted', ''],
  ['space.4', SPACE, SPACE, 'num', 'adopted', ''],
  ['radius.m', RADIUS, RADIUS, 'num', 'conflict', '복사본 6px'],
  ['text.body', BODY, BODY, 'num', 'unverified', '정본 대기'],
  ['text.display', 32, 32, 'num', 'adopted', ''],
  ['btn.bg', '{color.accent}', '{color.accent}', 'alias', 'adopted', ''],
];
function resolve(name, mode, depth) {          // 별칭을 따라가 실제 값을 얻는다. 순환이면 멈춘다
  const d = depth || 0;
  const row = TOK.find((r) => r[0] === name);
  if (!row || d > 4) throw new Error('토큰 별칭 순환 또는 없음: ' + name);
  const v = row[mode ? 2 : 1];
  return typeof v === 'string' && v[0] === '{' ? resolve(v.slice(1, -1), mode, d + 1) : v;
}
const tokAt = (name, mp) => { const a = resolve(name, 0), b = resolve(name, 1); return typeof a === 'number' ? a : mix(a, b, mp); };

// 직접 쓴 값 13개: [이름표, 역할, 직접 쓴 값, 토큰]
const DECLS = [
  ['hero.bg', 'accent', ACCENT_L, 'color.accent'], ['hero.radius', 'radius', RADIUS, 'radius.m'],
  ['card1.bg', 'card', '#ffffff', 'color.surface'], ['card1.radius', 'radius', 6, 'radius.m'],
  ['card2.bg', 'card', '#fbfbfa', 'color.surface'], ['card2.radius', 'radius', 8, 'radius.m'],
  ['btn.bg', 'accent', mix(ACCENT_L, '#000000', 0.08), 'color.accent'], ['btn.radius', 'radius', RADIUS, 'radius.m'],
  ['input.radius', 'radius', 6, 'radius.m'], ['muted.color', 'muted', '#6b6b6b', 'color.ink-muted'],
  ['card.pad', 'pad', 14, 'space.4'], ['body.size', 'size', 15, 'text.body'], ['hero.num', 'disp', 34, 'text.display'],
];
const STAG = 0.11, FLIP = 0.4, T0 = 0.3;
const prog = (i, t, L) => (L >= 2 ? 1 : L === 1 ? E.outC(seg(t, T0 + i * STAG, T0 + i * STAG + FLIP)) : 0);
function curVal(i, p, mp) {                    // 직접 쓴 값에서 토큰 값으로 가는 중인 현재 값
  const [, , lit, tok] = DECLS[i], tv = tokAt(tok, mp);
  return typeof lit === 'number' ? lerp(lit, tv, p) : mix(lit, tv, p);
}
const fmtV = (v) => (typeof v === 'number' ? Math.round(v) + 'px' : v);

function rr(x, X, Y, W, H, r) { x.beginPath(); x.roundRect(X, Y, W, H, Math.max(0, Math.min(r, W / 2, H / 2))); }
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.textBaseline = 'alphabetic'; x.fillText(s, X, Y); }
function cardBox(x, X, Y, W, H, r, fill) {     // 얇은 그림자 세 겹 + 면
  x.save();
  [[0, 1, 2, 0.08], [0, 4, 10, 0.07], [0, 14, 30, 0.06]].forEach(([dx, dy, b, a]) => { x.shadowColor = `rgba(17,17,17,${a})`; x.shadowOffsetX = dx; x.shadowOffsetY = dy; x.shadowBlur = b; x.fillStyle = fill; rr(x, X, Y, W, H, r); x.fill(); });
  x.restore(); x.fillStyle = fill; rr(x, X, Y, W, H, r); x.fill();
}

let GRAIN = null;
function drawApp(x, X, Y, W, H, C, V) {       // 이 화면은 C(색)와 V(숫자)만 읽는다
  cardBox(x, X, Y, W, H, 14, C.bg);
  x.save(); rr(x, X, Y, W, H, 14); x.clip();
  T(x, '주문 현황', X + 16, Y + 26, 13, C.ink, 700);
  T(x, '오늘', X + W - 16, Y + 26, 12, C.muted, 500, 'right');
  const ix = X + 14, iw = W - 28;
  // 주인공 카드 하나
  const hy = Y + 40, hh = 84;
  x.fillStyle = C.hero; rr(x, ix, hy, iw, hh, V.rHero); x.fill();
  const hg = x.createLinearGradient(0, hy, 0, hy + hh); hg.addColorStop(0, 'rgba(255,255,255,.14)'); hg.addColorStop(0.5, 'rgba(255,255,255,0)'); hg.addColorStop(1, 'rgba(0,0,0,.10)');
  x.fillStyle = hg; rr(x, ix, hy, iw, hh, V.rHero); x.fill();
  T(x, '오늘 들어온 주문', ix + V.pad, hy + V.pad + V.body * 0.8, V.body, C.on, 500);
  T(x, '128', ix + V.pad, hy + hh - V.pad, V.disp, C.on, 400, 'left', HAN);
  // 작은 카드 둘
  const cy = hy + hh + 12, cw = (iw - 12) / 2, ch = 66;
  [[ix, C.c1, V.r1, '대기 중', '34건'], [ix + cw + 12, C.c2, V.r2, '배송 중', '71건']].forEach(([cx, fill, r, a, b]) => {
    x.save(); x.shadowColor = 'rgba(17,17,17,.10)'; x.shadowBlur = 8; x.shadowOffsetY = 2; x.fillStyle = fill; rr(x, cx, cy, cw, ch, r); x.fill(); x.restore();
    x.fillStyle = fill; rr(x, cx, cy, cw, ch, r); x.fill();
    T(x, a, cx + V.pad, cy + V.pad + V.body * 0.75, V.body, C.muted, 500);
    T(x, b, cx + V.pad, cy + ch - V.pad + 2, V.body + 2, C.ink, 700);
  });
  // 입력칸
  const ny = cy + ch + 12;
  x.fillStyle = C.c1; rr(x, ix, ny, iw, 38, V.rIn); x.fill();
  x.strokeStyle = rgba(C.ink, 0.18); x.lineWidth = 1; rr(x, ix + 0.5, ny + 0.5, iw - 1, 37, V.rIn); x.stroke();
  T(x, '주문번호 검색', ix + V.pad, ny + 24, V.body, C.muted, 500);
  // 버튼
  const by = ny + 38 + 10;
  x.fillStyle = C.btn; rr(x, ix, by, iw, 36, V.rBtn); x.fill();
  T(x, '새 주문 받기', ix + iw / 2, by + 23, V.body, C.on, 700, 'center');
  x.restore();
}

function stats(L, P, mp) {
  const cur = DECLS.map((_, i) => curVal(i, P[i], mp));
  const roleSet = (role) => new Set(DECLS.map((d, i) => (d[1] === role ? (typeof cur[i] === 'number' ? Math.round(cur[i]) : cur[i].toLowerCase()) : null)).filter((v) => v != null)).size;
  return { lit: P.filter((p) => p < 0.5).length, named: P.filter((p) => p >= 0.5).length, rad: roleSet('radius'), card: roleSet('card'), acc: roleSet('accent') };
}

const CAP = ['00 · 값을 직접 박은 화면', '01 · 이름을 붙이고 이름으로 읽기', '02 · 이름은 그대로, 값만 두 벌', '03 · 값마다 상태를 달기'];
const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(77), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const lab = el('div', null, sp);   // 이름표(caption-bl): 왼쪽 아래, 배경 없음, 위에 1px 선
    Object.assign(lab.style, { position: 'absolute', left: '20px', bottom: '8px', paddingTop: '5px', borderTop: `1px solid ${PAL.line}`, minWidth: '280px', zIndex: '4' });
    const pill = el('span', null, lab);
    Object.assign(pill.style, { color: PAL.muted, font: "500 12px/1 'JetBrains Mono',monospace", whiteSpace: 'nowrap' });
    return { main, pill };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 0 : (lv == null ? 3 : lv);
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'multiply'; x.globalAlpha = 0.07;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();
    const mp = L >= 2 ? E.inOutC(seg(t, SWITCH_T, SWITCH_T + FADE)) : 0;
    const P = DECLS.map((_, i) => prog(i, t, L));
    const cur = DECLS.map((_, i) => curVal(i, P[i], mp));
    const c = (name) => tokAt(name, mp), live = (i) => cur[i];
    // 오른쪽: 이 화면은 위에서 정해진 값만 읽는다
    const C = { bg: c('color.bg'), ink: c('color.ink'), muted: live(9), on: c('color.on-accent'), hero: live(0), btn: live(6), c1: live(2), c2: live(4) };
    const V = { rHero: live(1), r1: live(3), r2: live(5), rBtn: live(7), rIn: live(8), pad: live(10), body: live(11), disp: live(12) };
    drawApp(x, 326, 18, 294, 300, C, V);
    // 왼쪽 패널
    const PX = 20, PY = 18, PW = 292, PH = 300;
    cardBox(x, PX, PY, PW, PH, 10, PAL.surface);
    const st = stats(L, P, mp);
    if (L === 0 || (L === 1 && t < 2.9)) {
      const al = L === 1 ? 1 - E.inOutC(seg(t, 2.4, 2.9)) : 1;
      x.save(); x.globalAlpha = al;
      T(x, 'styles.css', PX + 14, PY + 24, 12, PAL.ink, 600, 'left', MONO);
      T(x, L === 0 ? '값을 직접 씀' : '이름으로 바꾸는 중', PX + PW - 14, PY + 24, 11, L === 0 ? ACC_INK : OK_INK, 600, 'right');
      DECLS.forEach((d, i) => {
        const y = PY + 46 + i * 19.6, q = E.inOutC(seg(P[i], 0.3, 0.7));
        T(x, d[0], PX + 14, y, 11, PAL.muted, 500, 'left', MONO);
        const lit = typeof d[2] === 'number' ? d[2] + 'px' : d[2], name = '{' + d[3] + '}';
        x.globalAlpha = al * (1 - q); T(x, lit, PX + 132, y, 11, ACC_INK, 600, 'left', MONO);
        x.globalAlpha = al * q; T(x, name, PX + 132, y, 11, OK_INK, 600, 'left', MONO);
        x.globalAlpha = al;
      });
      x.restore();
    }
    if (L >= 1 && !(L === 1 && t < 2.4)) {
      const al = L === 1 ? E.inOutC(seg(t, 2.4, 2.9)) : 1;
      x.save(); x.globalAlpha = al;
      T(x, 'tokens.json', PX + 14, PY + 24, 12, PAL.ink, 600, 'left', MONO);
      T(x, L === 3 ? '값마다 상태' : (L === 2 ? '라이트 | 다크' : '값은 한 곳'), PX + PW - 14, PY + 24, 11, PAL.muted, 500, 'right');
      x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.moveTo(PX + 14, PY + 32.5); x.lineTo(PX + PW - 14, PY + 32.5); x.stroke();
      TOK.forEach((r, i) => {
        const y = PY + 52 + i * 22;
        T(x, r[0], PX + 14, y, 10, PAL.ink, 500, 'left', MONO);
        const sw = (col, X) => { x.fillStyle = col; rr(x, X, y - 9, 9, 9, 2); x.fill(); x.strokeStyle = PAL.line; rr(x, X + 0.5, y - 8.5, 8, 8, 2); x.stroke(); };
        const val = (v, X) => {
          if (typeof v === 'number') T(x, v + 'px', X, y, 10, PAL.muted, 500, 'left', MONO);
          else { sw(v, X); T(x, v.toLowerCase(), X + 13, y, 10, PAL.muted, 500, 'left', MONO); }
        };
        if (L === 3) {
          const sc = r[4] === 'adopted' ? OK_INK : r[4] === 'unverified' ? WARN_INK : ACC_INK;
          T(x, r[4], PX + 138, y, 10, sc, 600, 'left', MONO);
          if (r[5]) T(x, r[5], PX + 204, y, 10, PAL.muted, 500);
        } else if (r[3] === 'alias') {
          T(x, r[1], PX + 138, y, 10, OK_INK, 600, 'left', MONO);
          if (L >= 2) T(x, '양쪽 따라감', PX + 230, y, 10, PAL.muted, 500);
        } else if (L === 1) val(resolve(r[0], 0), PX + 138);
        else { val(resolve(r[0], 0), PX + 138); val(resolve(r[0], 1), PX + 216); }
      });
      x.restore();
    }
    // 오른쪽 아래 한 줄: 코드가 센 값
    const SY = 346;
    if (L === 0) T(x, `직접 쓴 값 ${st.lit} · 모서리 ${st.rad}종 · 카드 바탕 ${st.card}종`, 326, SY, 11, ACC_INK, 600, 'left', MONO);
    else if (L === 1) T(x, `직접 쓴 값 ${st.lit} · 이름으로 읽기 ${st.named} · 별칭 1`, 326, SY, 11, st.lit ? ACC_INK : OK_INK, 600, 'left', MONO);
    else if (L === 2) {
      const bgc = c('color.bg'), items = [['ink', ratio(c('color.ink'), bgc)], ['muted', ratio(live(9), bgc)], ['버튼', ratio(c('color.on-accent'), live(0))]];
      let X = 326; T(x, '대비', X, SY, 11, PAL.muted, 500, 'left', MONO); X += 30;
      items.forEach(([n, v]) => { const col = v >= MIN_RATIO ? OK_INK : ACC_INK; const txt = `${n} ${v.toFixed(1)}`; T(x, txt, X, SY, 11, col, 600, 'left', MONO); X += txt.length * 6.9 + 12; });
      T(x, `(${MIN_RATIO}+)`, X, SY, 11, PAL.muted, 500, 'left', MONO);
    } else {
      const n = (k) => TOK.filter((r) => r[4] === k).length;
      T(x, `토큰 ${TOK.length} · adopted ${n('adopted')} · unverified ${n('unverified')} · conflict ${n('conflict')}`, 326, SY, 11, PAL.ink, 600, 'left', MONO);
    }
    s.pill.textContent = CAP[L];
  },
};
export default demo;
