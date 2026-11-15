/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/image-aspect-pixel-table/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 비율마다 모델이 주는 크기가 다르다. 표 한 장에 공식 크기, 우리가 센 크기, 영상 틀에 맞춘 결과를 차례로 얹는다.
const ROW = '9:16';           // 눈여겨볼 비율
const TIER = '1K';            // 눈여겨볼 화질 단계
const FRAME = [1080, 1920];   // 영상 틀(가로, 세로 px)
const TIERS = ['1K', '2K', '4K'];
const RATIOS = ['1:1', '4:5', '3:4', '2:3', '9:16', '16:9'];
const TABLE = {   // 공식 크기 표(gemini-3.1-flash-image), 가로×세로 px
  '1:1': [[1024, 1024], [2048, 2048], [4096, 4096]], '4:5': [[928, 1152], [1856, 2304], [3712, 4608]],
  '3:4': [[896, 1200], [1792, 2400], [3584, 4800]], '2:3': [[848, 1264], [1696, 2528], [3392, 5056]],
  '9:16': [[768, 1376], [1536, 2752], [3072, 5504]], '16:9': [[1376, 768], [2752, 1536], [5504, 3072]],
};
const ASSUME = { '1:1': [1080, 1080], '4:5': [1080, 1350], '3:4': [1080, 1440], '2:3': [1080, 1620], '9:16': [1080, 1920], '16:9': [1920, 1080] };   // 연출 전: 흔히 가정하는 둥근 크기
const MEASURED = [[768, 1376, 1027, '카드 그림 원본'], [1024, 1024, 604, '포스터 그림'], [4096, 4096, 170, '캐릭터 시트'], [3072, 5504, 1, '긴 세로 참조']];   // 제작 폴더에서 센 크기와 장수
const OFFTABLE = [[757, 949, 11], [4096, 2291, 2]];   // 표에 없는 크기
const PAL = { bg0: '#f4efe4', bg1: '#e9e2d3', ink: '#1d1a16', muted: '#6b6458', accent: '#d4472b', accent2: '#2b5d8a', surface: '#fbf8f1', line: 'rgba(29,26,22,.2)' };
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif', HAN = '"Black Han Sans", sans-serif';
const PILLS = ['연출 전 · 가정한 크기', '1단계 · 공식 1K 값', '2단계 · 2K, 4K와 대문자 K', '3단계 · 우리 폴더에서 센 크기', '4단계 · 영상 틀에 맞춰 보기'];
const TX = 20, TW = 430, C0 = 90, CWID = 113, HY = 54, HH = 28, RY = 82, RH = 38;   // 표 위치
const PX = 462, PW = 160, PY = 54, PHT = 266;   // 오른쪽 칸

let GRAIN = null;
const fmt = (n) => Math.round(n).toLocaleString('ko-KR');
const sz = (s) => `${s[0]}×${s[1]}`;
function rr(x, X, Y, W, H, r) { x.beginPath(); x.roundRect(X, Y, W, H, Math.max(0, Math.min(r, W / 2, H / 2))); }
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.textBaseline = 'alphabetic'; x.fillText(s, X, Y); }
function mark(x, cx, cy, ok, col) {
  x.save(); x.strokeStyle = col; x.lineWidth = 2.2; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
  if (ok) { x.moveTo(cx - 4, cy); x.lineTo(cx - 1, cy + 3.5); x.lineTo(cx + 5, cy - 4); } else { x.moveTo(cx - 4, cy - 4); x.lineTo(cx + 4, cy + 4); x.moveTo(cx + 4, cy - 4); x.lineTo(cx - 4, cy + 4); }
  x.stroke(); x.restore();
}
function card(x, X, Y, W, H) {   // 종이 카드: 겹친 반투명 사각형 그림자 + 면
  [1, 2, 3, 4].forEach((q) => { x.fillStyle = 'rgba(60,40,20,.07)'; rr(x, X - q, Y + q * 1.3, W + q * 2, H + q, 8 + q); x.fill(); });
  x.fillStyle = PAL.surface; rr(x, X, Y, W, H, 8); x.fill(); x.strokeStyle = PAL.line; x.lineWidth = 1; rr(x, X + 0.5, Y + 0.5, W - 1, H - 1, 8); x.stroke();
}
function art(x, X, Y, W, H) {    // 틀 위에 겹칠 그림(코드로 그린 예시)
  const g = x.createLinearGradient(0, Y, 0, Y + H); g.addColorStop(0, '#fbe7d4'); g.addColorStop(0.6, '#f2bfa8'); g.addColorStop(1, '#d98a86');
  x.fillStyle = g; x.fillRect(X, Y, W, H);
  const sun = x.createRadialGradient(X + W * 0.7, Y + H * 0.28, 0, X + W * 0.7, Y + H * 0.28, W * 0.5); sun.addColorStop(0, 'rgba(255,250,235,.95)'); sun.addColorStop(1, 'rgba(255,250,235,0)');
  x.fillStyle = sun; x.fillRect(X, Y, W, H);
  [[0.74, '#a85d6a'], [0.84, '#7d4258']].forEach(([py, c], i) => { x.fillStyle = c; x.beginPath(); x.moveTo(X, Y + H); x.lineTo(X, Y + H * py); x.quadraticCurveTo(X + W * (0.35 + i * 0.3), Y + H * (py - 0.1), X + W, Y + H * (py + 0.02)); x.lineTo(X + W, Y + H); x.fill(); });
}
function shapeOf(x, ratio, cx, cy, col) {   // 비율 모양을 작게 그린 도형
  const [a, b] = ratio.split(':').map(Number), m = 22, w = a >= b ? m : m * a / b, h = a >= b ? m * b / a : m;
  x.fillStyle = col; rr(x, cx - w / 2, cy - h / 2, w, h, 2.5); x.fill();
  x.strokeStyle = 'rgba(29,26,22,.45)'; x.lineWidth = 1; rr(x, cx - w / 2 + 0.5, cy - h / 2 + 0.5, w - 1, h - 1, 2.5); x.stroke();
}
function fit(img) {   // 영상 틀 가로에 맞추면 세로가 얼마나 남고 잘리는가
  const k = FRAME[0] / img[0], h = img[1] * k;
  return { k, h, cut: Math.max(0, h - FRAME[1]), gap: Math.max(0, FRAME[1] - h) };
}

const demo = {
  dur: 2.4, rest: 2.4, noCompare: false, levels: 4,
  mount(sp) {
    const r = rng(31), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const cv = el('canvas', null, sp); cv.width = 1280; cv.height = 720;
    Object.assign(cv.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const pill = el('div', null, sp);   // 이름표(pill): 둥근 알약
    Object.assign(pill.style, { position: 'absolute', left: '24px', top: '14px', padding: '6px 14px', borderRadius: '999px', background: PAL.surface, boxShadow: `0 2px 8px rgba(60,40,20,.14), inset 0 0 0 1px ${PAL.line}`, font: `600 12.5px/1.2 ${SANS}`, color: PAL.ink, whiteSpace: 'nowrap' });
    return { cv, pill };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 0 : (lv == null ? 4 : lv);
    const x = s.cv.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.setLineDash([]); x.shadowBlur = 0;
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'multiply'; x.globalAlpha = 0.06;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();

    // 표 카드와 머리 줄
    card(x, TX, HY, TW, HH + RH * RATIOS.length + 4);
    const cols = L === 0 ? ['가정한 크기', '공식 크기'] : L === 1 ? ['공식 1K', '가정한 크기'] : TIERS;
    T(x, '비율', TX + 14, HY + 19, 12.5, PAL.muted, 600);
    const tIdx = TIERS.indexOf(TIER);
    cols.forEach((c, i) => {
      const cx = TX + C0 + i * CWID + CWID / 2, on = L >= 2 && i === tIdx;
      if (on) { x.fillStyle = '#b13a22'; rr(x, cx - CWID / 2 + 14, HY + 4, CWID - 28, HH - 8, 11); x.fill(); }
      T(x, c, cx, HY + 19, 12.5, on ? '#fff' : ((i === 1 && L <= 1) ? PAL.muted : PAL.ink), 700, 'center');
    });
    x.fillStyle = PAL.line; x.fillRect(TX + 8, HY + HH, TW - 16, 1);
    RATIOS.forEach((rt, r) => {
      const y = RY + r * RH, hot = rt === ROW, k = E.outC(seg(t, 0.05 + r * 0.06, 0.55 + r * 0.06));
      x.save(); x.globalAlpha = 0.25 + 0.75 * k;
      if (hot && L >= 1) { x.fillStyle = 'rgba(212,71,43,.08)'; rr(x, TX + 6, y + 2, TW - 12, RH - 4, 6); x.fill(); }
      if (r > 0) { x.fillStyle = 'rgba(29,26,22,.08)'; x.fillRect(TX + 8, y, TW - 16, 1); }
      shapeOf(x, rt, TX + 26, y + RH / 2, hot ? 'rgba(212,71,43,.55)' : 'rgba(43,93,138,.28)');
      T(x, rt, TX + 48, y + 24, 14, PAL.ink, hot ? 700 : 600, 'left', MONO);
      const vals = L === 0 ? [ASSUME[rt], '?'] : L === 1 ? [TABLE[rt][0], ASSUME[rt]] : TABLE[rt];
      vals.forEach((v, i) => {
        const cx = TX + C0 + i * CWID + CWID / 2, sel = L >= 1 && hot && ((L === 1 && i === 0) || (L >= 2 && i === tIdx));
        const meas = L >= 3 && MEASURED.some((m) => m[0] === v[0] && m[1] === v[1]);
        if (sel) { x.fillStyle = 'rgba(212,71,43,.16)'; rr(x, cx - CWID / 2 + 6, y + 5, CWID - 12, RH - 10, 5); x.fill(); x.strokeStyle = PAL.accent; x.lineWidth = 1.4; rr(x, cx - CWID / 2 + 6.5, y + 5.5, CWID - 13, RH - 11, 5); x.stroke(); }
        const dim = (L === 1 && i === 1) || (L === 0 && i === 1), txt = typeof v === 'string' ? v : sz(v);
        T(x, txt, cx, y + 24, 13.5, dim ? PAL.muted : PAL.ink, sel ? 700 : 500, 'center', MONO);
        if (dim && L === 1) { x.fillStyle = PAL.muted; x.fillRect(cx - txt.length * 4, y + 19.5, txt.length * 8, 1); }
        if (meas) { x.fillStyle = PAL.accent2; x.beginPath(); x.arc(cx + CWID / 2 - 14, y + 11, 4, 0, Math.PI * 2); x.fill(); }
      });
      x.restore();
    });
    T(x, L >= 3 ? '파란 점은 우리가 받은 크기와 같은 칸이다' : '표: Nano Banana 2 공식 크기 표 · 단위 px', TX, 346, 10.5, PAL.muted, 500, 'left', MONO);
    T(x, '비율 도형은 코드로 그린 예시', TX + TW, 346, 10.5, PAL.muted, 500, 'right', MONO);

    // 오른쪽 칸: 단계마다 다른 내용
    card(x, PX, PY, PW, PHT);
    const hot = TABLE[ROW], off = ASSUME[ROW], one = hot[0], sel = hot[Math.max(0, tIdx)];
    if (L === 0) {
      T(x, '이렇게 요청한다', PX + 12, PY + 22, 11, PAL.muted, 600, 'left', MONO);
      x.fillStyle = 'rgba(43,93,138,.1)'; rr(x, PX + 10, PY + 34, PW - 20, 64, 8); x.fill();
      T(x, `${ROW} 으로`, PX + 20, PY + 58, 15, PAL.ink, 700); T(x, '크게 뽑아 줘', PX + 20, PY + 80, 15, PAL.ink, 700);
      T(x, '받을 크기를 적었나', PX + 12, PY + 130, 11.5, PAL.muted, 600);
      T(x, '모름', PX + 12, PY + 176, 40, PAL.accent, 400, 'left', HAN);
      T(x, `머릿속 값 ${sz(off)}`, PX + 12, PY + 214, 12, PAL.muted, 500, 'left', MONO);
      T(x, '공식 값과 맞는지 모른다', PX + 12, PY + 234, 11.5, PAL.ink, 500);
    } else if (L === 1) {
      T(x, ROW, PX + 12, PY + 40, 30, PAL.ink, 400, 'left', HAN);
      T(x, '가정', PX + 12, PY + 74, 11, PAL.muted, 600, 'left', MONO); T(x, sz(off), PX + 12, PY + 94, 14, PAL.muted, 500, 'left', MONO);
      T(x, '공식 1K', PX + 12, PY + 126, 11, PAL.accent, 700, 'left', MONO); T(x, sz(one), PX + 12, PY + 148, 17, PAL.ink, 700, 'left', MONO);
      T(x, `가로 −${off[0] - one[0]}px`, PX + 12, PY + 190, 15, PAL.accent, 700, 'left', MONO);
      T(x, `세로 −${off[1] - one[1]}px`, PX + 12, PY + 212, 15, PAL.accent, 700, 'left', MONO);
      T(x, '가정보다 작게 나온다', PX + 12, PY + 238, 11.5, PAL.ink, 500);
    } else if (L === 2) {
      T(x, '크기 이름', PX + 12, PY + 22, 11, PAL.muted, 600, 'left', MONO);
      [['1K', true], ['2K', true], ['4K', true], ['1k', false]].forEach(([n, ok], i) => {
        const cy = PY + 36 + i * 38, k = E.outC(seg(t, 0.25 + i * 0.12, 0.75 + i * 0.12));
        x.save(); x.globalAlpha = 0.2 + 0.8 * k;
        x.fillStyle = ok ? 'rgba(15,157,107,.13)' : 'rgba(212,71,43,.12)'; rr(x, PX + 10, cy, PW - 20, 30, 7); x.fill();
        T(x, n, PX + 20, cy + 21, 16, PAL.ink, 700, 'left', MONO);
        mark(x, PX + PW - 56, cy + 15, ok, ok ? '#0f9d6b' : PAL.accent);
        T(x, ok ? '받음' : '거부', PX + PW - 44, cy + 20, 12, ok ? '#0f7a55' : PAL.accent, 700);
        x.restore();
      });
      T(x, '대문자 K 만 받는다', PX + 12, PY + 208, 12, PAL.ink, 700);
      T(x, '아무것도 안 적으면 1K', PX + 12, PY + 230, 11.5, PAL.muted, 500);
    } else if (L === 3) {
      T(x, '우리 폴더에서 센 크기', PX + 10, PY + 20, 11, PAL.muted, 600, 'left', MONO);
      MEASURED.forEach((m, i) => {
        const cy = PY + 30 + i * 46, k = E.outC(seg(t, 0.2 + i * 0.1, 0.7 + i * 0.1));
        x.save(); x.globalAlpha = 0.2 + 0.8 * k;
        x.fillStyle = PAL.accent2; x.beginPath(); x.arc(PX + 16, cy + 9, 4, 0, Math.PI * 2); x.fill();
        T(x, `${m[0]}×${m[1]}`, PX + 26, cy + 14, 13, PAL.ink, 700, 'left', MONO);
        T(x, `${fmt(m[2])}장`, PX + PW - 10, cy + 14, 13, PAL.accent2, 700, 'right', MONO);
        T(x, m[3], PX + 26, cy + 33, 11, PAL.muted, 500);
        x.restore();
      });
      T(x, '표에 없는 크기 예', PX + 10, PY + 226, 11, PAL.accent, 700, 'left', MONO);
      OFFTABLE.forEach((o, i) => T(x, `${o[0]}×${o[1]}  ${o[2]}장`, PX + 10, PY + 244 + i * 16, 11, PAL.ink, 500, 'left', MONO));
    } else {
      const f = fit(sel), sc = Math.min(150 / FRAME[1], 112 / FRAME[0]), fw = FRAME[0] * sc, fh = FRAME[1] * sc, fx = PX + (PW - fw) / 2, fy = PY + 14;
      const ih = sel[1] * f.k * sc, iy = fy + (fh - ih) / 2, kk = E.outC(seg(t, 0.1, 0.9));
      x.save(); x.beginPath(); x.rect(PX + 4, PY + 4, PW - 8, 164); x.clip();
      x.globalAlpha = 0.4 * kk; art(x, fx, iy, fw, ih); x.globalAlpha = 1;   // 틀 밖으로 나간 부분은 옅게
      x.save(); x.beginPath(); x.rect(fx, fy, fw, fh); x.clip(); x.globalAlpha = kk; art(x, fx, iy, fw, ih); x.restore();
      x.restore();
      x.strokeStyle = PAL.ink; x.lineWidth = 1.5; rr(x, fx - 0.5, fy - 0.5, fw + 1, fh + 1, 2); x.stroke();
      T(x, `틀 ${sz(FRAME)}`, PX + 10, PY + 190, 11.5, PAL.muted, 600, 'left', MONO);
      T(x, `${sz(sel)} → ×${f.k.toFixed(2)}`, PX + 10, PY + 208, 11.5, PAL.ink, 700, 'left', MONO);
      T(x, f.cut > 0 ? `세로 ${fmt(f.cut)}px 잘림` : f.gap > 0 ? `세로 ${fmt(f.gap)}px 빈칸` : '딱 맞음', PX + 10, PY + 232, 15, f.cut > 0 || f.gap > 0 ? PAL.accent : PAL.ink, 700);
      T(x, `맞춘 높이 ${fmt(f.h)}px`, PX + 10, PY + 252, 10.5, PAL.muted, 500, 'left', MONO);
    }
    s.pill.textContent = PILLS[L];
  },
};
export default demo;
