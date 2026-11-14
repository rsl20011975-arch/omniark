/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/dark-mode-two-palettes/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 같은 화면의 다크 두 가지를 라이트 옆에 놓고 비교한다: 라이트 색을 채널별로 뒤집은 다크(뒤집음)와 따로 정한 다크(따로).
// 모든 수치(밝기 L*, 색상각, 대비)는 화면에 그려진 색에서 코드가 계산한다. 라이트와 다크의 색값은 이 사이트 블로그 틀의 값이고, 버튼 글자색은 이 데모가 정했다.
const DARK_BG = '#141210';     // 따로 설계한 다크의 배경
const DARK_CARD = '#1d1a17';   // 다크의 카드(배경보다 한 단계 밝게)
const DARK_ACC = '#fb923c';    // 다크의 강조색(라이트의 #c2410c 와 같은 계열)
const PAL = { bg0: '#171615', bg1: '#232120', ink: '#f2efe9', muted: '#9a958c', accent: '#5ad1c8', accent2: '#f2b84b', surface: '#1f1d1b', line: 'rgba(242,239,233,.16)' };
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif';
const OKC = '#7fe3b0', NOC = '#ff9b8a';
const LIGHT = { bg: '#faf8f5', card: '#ffffff', ink: '#1d1a17', ink3: '#6f685f', line: '#e6e0d6', accent: '#c2410c', on: '#ffffff' };
const DARK = { bg: DARK_BG, card: DARK_CARD, ink: '#f2eee9', ink3: '#978f86', line: '#34302b', accent: DARK_ACC, on: '#1d1a17' };
// 서로 다른 제작 프로젝트의 다크 일곱 벌: [이름, 배경, 카드, 글자, 강조, 다크만 있는지]
const PALS = [['A 블로그 틀', '#141210', '#1d1a17', '#f2eee9', '#fb923c', 0], ['B 학습 사이트', '#2f2852', '#433b78', '#f6f3ff', '#b9a2ff', 0], ['C 학습 옛 사본', '#0c0e14', '#191e2b', '#f3f4f6', '#ff9a56', 0],
  ['D 음성 훈련 앱', '#121219', '#1c1c27', '#ededf4', '#9b9bf7', 1], ['E 이미지 도구', '#0b0d10', '#161a20', '#eaeef4', '#4da3ff', 1], ['F 운영 콘솔', '#0b0e14', '#151a23', '#f3f4f6', '#10b981', 1], ['G 사이트 지시문', '#0f1320', '#181e30', '#e6e9f0', '#ff9a4d', 0]];
const STEP = ['그냥 뒤집은 다크', '표면을 단계로', '글자와 강조를 따로', '두 모드 대비 점검'];

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (a) => '#' + a.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('');
const mixHex = (a, b, p) => { const A = hex(a), B = hex(b); return toHex(A.map((v, i) => lerp(v, B[i], p))); };
const invHex = (h) => toHex(hex(h).map((v) => 255 - v));
const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const lum = (h) => { const [r, g, b] = hex(h); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const Lstar = (h) => { const y = lum(h); return 116 * (y > 0.008856 ? Math.cbrt(y) : 7.787 * y + 16 / 116) - 16; };
function hsl(h) { const [r, g, b] = hex(h).map((v) => v / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, l = (mx + mn) / 2; let H = 0, S = 0; if (d) { S = d / (1 - Math.abs(2 * l - 1)); H = mx === r ? ((g - b) / d) % 6 : (mx === g ? (b - r) / d + 2 : (r - g) / d + 4); H = (H * 60 + 360) % 360; } return { h: H, s: S * 100 }; }
const hueGap = (a, b) => { const d = Math.abs(a - b) % 360; return Math.min(d, 360 - d); };
const FLIP = Object.fromEntries(Object.entries(LIGHT).map(([k, v]) => [k, invHex(v)]));
const signed = (v) => (v > 0 ? '+' : '') + v.toFixed(1);

// 측정표의 칸. f = 색에서 값을 계산, ok = 합격 판정(없으면 중립)
const ROWS = [
  { lv: 1, n: '배경 L*', f: (t) => Lstar(t.bg), fmt: (v) => v.toFixed(1) },
  { lv: 1, n: '카드 L*', f: (t) => Lstar(t.card), fmt: (v) => v.toFixed(1) },
  { lv: 1, n: '카드−배경', f: (t) => Lstar(t.card) - Lstar(t.bg), fmt: signed, ok: (v) => v > 0 },
  { lv: 1, n: '#000 쓴 곳', f: (t) => [t.bg, t.card].filter((c) => c.toLowerCase() === '#000000').length, fmt: (v) => String(v), ok: (v) => v === 0 },
  { lv: 2, n: '강조 색상각', f: (t) => hsl(t.accent).h, fmt: (v) => Math.round(v) + '°', ok: (v, ref) => hueGap(v, ref) <= 30 },
  { lv: 2, n: '강조 채도', f: (t) => hsl(t.accent).s, fmt: (v) => Math.round(v) + '%' },
  { lv: 3, n: '글자/배경', f: (t) => ratio(t.ink, t.bg), fmt: (v) => v.toFixed(1) + ':1', ok: (v) => v >= 4.5 },
  { lv: 3, n: '보조/배경', f: (t) => ratio(t.ink3, t.bg), fmt: (v) => v.toFixed(1) + ':1', ok: (v) => v >= 4.5 },
  { lv: 3, n: '강조/배경', f: (t) => ratio(t.accent, t.bg), fmt: (v) => v.toFixed(1) + ':1', ok: (v) => v >= 4.5 },
  { lv: 3, n: '버튼/강조', f: (t) => ratio(t.on, t.accent), fmt: (v) => v.toFixed(1) + ':1', ok: (v) => v >= 4.5 },
];

let GRAIN = null;
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function rr(x, X, Y, Wd, Ht, r) { x.beginPath(); x.roundRect(X, Y, Wd, Ht, r); }
function phone(x, X, Y, tk) {      // 같은 앱 화면을 토큰으로 그린다
  const W = 148, H = 220, soft = Lstar(tk.bg) > 50;
  x.save(); x.shadowColor = soft ? 'rgba(0,0,0,.35)' : 'rgba(0,0,0,.55)'; x.shadowBlur = 20; x.shadowOffsetY = 7; x.fillStyle = tk.bg; rr(x, X, Y, W, H, 18); x.fill(); x.restore();
  x.save(); rr(x, X, Y, W, H, 18); x.clip();
  x.fillStyle = tk.ink3; x.globalAlpha = 0.5; rr(x, X + 57, Y + 7, 34, 6, 3); x.fill(); x.globalAlpha = 1;
  T(x, '이번 주 방문', X + 12, Y + 32, 11, tk.ink, 700);
  const ag = x.createRadialGradient(X + W - 20, Y + 24, 1, X + W - 18, Y + 27, 9); ag.addColorStop(0, tk.accent); ag.addColorStop(1, mixHex(tk.accent, tk.bg, 0.4)); x.fillStyle = ag; x.beginPath(); x.arc(X + W - 18, Y + 27, 8, 0, 7); x.fill();
  const card = (cx, cy, cw, ch, r) => { x.save(); if (soft) { x.shadowColor = 'rgba(29,26,23,.14)'; x.shadowBlur = 9; x.shadowOffsetY = 2; } x.fillStyle = tk.card; rr(x, cx, cy, cw, ch, r); x.fill(); x.restore(); x.strokeStyle = tk.line; x.lineWidth = 1; rr(x, cx + 0.5, cy + 0.5, cw - 1, ch - 1, r); x.stroke(); };
  card(X + 10, Y + 44, 128, 70, 10);
  T(x, '지난주와 비교', X + 20, Y + 60, 8.5, tk.ink3, 500);
  [14, 22, 18, 30, 24, 38, 28].forEach((h, i) => { x.fillStyle = i === 5 ? tk.accent : tk.ink3; x.globalAlpha = i === 5 ? 1 : 0.4; rr(x, X + 20 + i * 15.6, Y + 104 - h, 10, h, 3); x.fill(); }); x.globalAlpha = 1;
  [['새 댓글 도착', '새 글'], ['주문 확인 필요', '확인']].forEach(([a, b], i) => {
    const yy = Y + 122 + i * 28; card(X + 10, yy, 128, 24, 8);
    x.fillStyle = tk.accent; x.beginPath(); x.arc(X + 22, yy + 12, 3.5, 0, 7); x.fill(); T(x, a, X + 32, yy + 15.5, 9, tk.ink, 600);
    x.fillStyle = mixHex(tk.card, tk.accent, 0.18); rr(x, X + 98, yy + 5, 33, 14, 7); x.fill(); T(x, b, X + 114.5, yy + 15, 8, mixHex(tk.accent, tk.ink, 0.25), 700, 'center');
  });
  const bg = x.createLinearGradient(0, Y + 180, 0, Y + 208); bg.addColorStop(0, mixHex(tk.accent, '#ffffff', 0.12)); bg.addColorStop(1, tk.accent); x.fillStyle = bg; rr(x, X + 10, Y + 180, 128, 28, 12); x.fill();
  T(x, '리포트 보기', X + 74, Y + 198, 10, tk.on, 700, 'center');
  x.fillStyle = tk.ink3; x.globalAlpha = 0.5; rr(x, X + 54, Y + 213, 40, 3, 1.5); x.fill(); x.globalAlpha = 1;
  x.restore();
  x.strokeStyle = soft ? 'rgba(29,26,23,.18)' : 'rgba(242,239,233,.14)'; x.lineWidth = 1; rr(x, X + 0.5, Y + 0.5, W - 1, H - 1, 18); x.stroke();
}

const demo = {
  dur: 5.0, rest: 5.0, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(41), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const tag = el('div', null, sp);   // 이름표(tag-tr): 오른쪽 위, 거의 직각, 왼쪽 accent 줄
    Object.assign(tag.style, { position: 'absolute', right: '12px', top: '8px', padding: '5px 11px 5px 10px', borderRadius: '2px', borderLeft: `3px solid ${PAL.accent}`, background: PAL.surface, color: PAL.ink, font: "600 12px/1.2 'IBM Plex Sans KR',sans-serif", zIndex: '4', whiteSpace: 'nowrap' });
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

    const u1 = L >= 1 ? E.outC(seg(t, 0.6, 1.4)) : 0, u2 = L >= 2 ? E.outC(seg(t, 1.8, 2.6)) : 0;
    const dk = {}; Object.keys(DARK).forEach((k) => { const p = (k === 'bg' || k === 'card' || k === 'line') ? u1 : u2; dk[k] = mixHex(FLIP[k], DARK[k], p); });
    T(x, '같은 화면, 다크 두 가지: 색만 뒤집은 것과 따로 정한 것', 16, 17, 10, PAL.muted, 500);
    [[16, LIGHT, '라이트'], [176, dk, L === 0 ? '다크: 색만 뒤집음' : '다크: 따로 설계']].forEach(([X, tk, nm], i) => {
      const pr = E.outC(seg(t, 0.04 + 0.1 * i, 0.55 + 0.1 * i)); if (pr < 0.004) return;       // 투명도 0 에서 그림자를 그리면 브라우저가 캔버스를 지워 버린다
      x.save(); x.globalAlpha = pr; x.translate(0, (1 - pr) * 8); phone(x, X, 34, tk); T(x, nm, X + 74, 276, 10, PAL.ink, 600, 'center'); x.restore();
    });

    // 오른쪽: 측정표(라이트 / 뒤집음 / 따로)
    if (L >= 1) {
      const cols = [[LIGHT, 478, '라이트'], [FLIP, 548, '뒤집음'], [DARK, 618, '따로']], t0 = [0, 1.0, 2.2, 3.0];
      T(x, '색에서 코드가 계산한 값', 340, 48, 10.5, PAL.ink, 700);
      cols.forEach(([, cx, nm]) => T(x, nm, cx, 48, 9, PAL.muted, 600, 'right'));
      x.fillStyle = PAL.line; x.fillRect(340, 54, 286, 1);
      let yy = 70; const sums = [0, 0, 0];
      ROWS.forEach((rw) => {
        if (L < rw.lv) return;
        const k = E.outC(seg(t, t0[rw.lv], t0[rw.lv] + 0.5)); x.save(); x.globalAlpha = k;
        T(x, rw.n, 340, yy, 9.5, PAL.ink, 500);
        const ref = rw.f(LIGHT);
        cols.forEach(([tk, cx], ci) => {
          const v = rw.f(tk), good = rw.ok ? rw.ok(v, ref) : null;
          if (rw.lv === 3 && good) sums[ci]++;
          T(x, rw.fmt(v), cx, yy, 10, good === null ? PAL.ink : (good ? OKC : NOC), 700, 'right', MONO);
        });
        x.restore(); yy += 17;
      });
      if (L >= 3) {
        const k = E.outC(seg(t, 3.6, 4.3)); x.save(); x.globalAlpha = k;
        x.fillStyle = PAL.line; x.fillRect(340, yy - 8, 286, 1);
        T(x, `대비 4칸 중 통과: 라이트 ${sums[0]}, 뒤집음 ${sums[1]}, 따로 ${sums[2]}`, 340, yy + 6, 9.5, PAL.accent, 600);
        if (sums[1] === sums[2]) T(x, '대비 점수만으로는 둘을 가를 수 없다', 340, yy + 20, 9.5, PAL.muted, 500);
        x.restore();
      }
    }
    if (L === 0) {          // 연출 전: 뒤집은 색이 어떤 값인지 코드가 적어 준다
      const k = E.outC(seg(t, 0.5, 1.2)); x.save(); x.globalAlpha = k;
      T(x, '색만 뒤집으면', 360, 70, 12, PAL.ink, 700);
      [['배경', 'bg'], ['카드', 'card'], ['강조', 'accent']].forEach(([n, key], i) => {
        const yy = 98 + i * 30; T(x, n, 360, yy, 10, PAL.muted, 500); T(x, LIGHT[key], 410, yy, 11, PAL.ink, 600, 'left', MONO); x.strokeStyle = PAL.muted; x.lineWidth = 1.4; x.lineCap = 'round'; x.beginPath(); x.moveTo(478, yy - 4); x.lineTo(494, yy - 4); x.moveTo(490, yy - 8); x.lineTo(494, yy - 4); x.lineTo(490, yy); x.stroke(); T(x, FLIP[key], 505, yy, 11, PAL.accent, 700, 'left', MONO);
        x.fillStyle = FLIP[key]; x.strokeStyle = 'rgba(242,239,233,.3)'; rr(x, 575, yy - 11, 22, 14, 3); x.fill(); x.stroke();
      });
      T(x, '라이트의 각 채널을 255에서 뺀 값', 360, 200, 10, PAL.muted, 500); T(x, `카드가 배경보다 L* ${signed(Lstar(FLIP.card) - Lstar(FLIP.bg))}`, 360, 218, 10, NOC, 600); T(x, `강조 색상각 ${Math.round(hsl(LIGHT.accent).h)}°에서 ${Math.round(hsl(FLIP.accent).h)}°로`, 360, 234, 10, NOC, 600);
      x.restore();
    }
    // 아래: 서로 다른 제작 프로젝트의 다크 일곱 벌
    if (L >= 1 && t > 1.02) {
      const k = E.outC(seg(t, 1.0, 1.7)), cw = 82, gp = (612 - 7 * cw) / 6;
      x.save(); x.globalAlpha = k;
      PALS.forEach(([nm, b, c, ink, ac, only], i) => {
        const X = 14 + i * (cw + gp), Y = 286;
        x.save(); x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 8; x.shadowOffsetY = 2; x.fillStyle = b; rr(x, X, Y, cw, 28, 5); x.fill(); x.restore();
        x.fillStyle = c; rr(x, X + 6, Y + 6, 26, 16, 3); x.fill(); x.fillStyle = ink; rr(x, X + 10, Y + 12, 14, 3, 1.5); x.fill();
        x.fillStyle = ink; x.globalAlpha = k * 0.7; rr(x, X + 40, Y + 9, 30, 3, 1.5); x.fill(); rr(x, X + 40, Y + 16, 20, 3, 1.5); x.fill(); x.globalAlpha = k;
        x.fillStyle = ac; x.beginPath(); x.arc(X + 74, Y + 21, 3.5, 0, 7); x.fill();
        x.strokeStyle = 'rgba(242,239,233,.2)'; x.lineWidth = 1; rr(x, X + 0.5, Y + 0.5, cw - 1, 27, 5); x.stroke();
        if (only) { x.fillStyle = 'rgba(242,184,75,.2)'; rr(x, X + cw - 31, Y - 4, 29, 12, 3); x.fill(); T(x, '다크만', X + cw - 16.5, Y + 5, 8, PAL.accent2, 700, 'center'); }
        T(x, nm, X, Y + 42, 8.5, PAL.ink, 600);
        if (L >= 3) { const k3 = E.outC(seg(t, 3.4 + 0.05 * i, 3.9 + 0.05 * i)); x.save(); x.globalAlpha = k * k3; T(x, `L* ${Lstar(b).toFixed(1)} / ${signed(Lstar(c) - Lstar(b))}`, X, Y + 54, 8.5, PAL.muted, 500, 'left', MONO); T(x, `글자 ${ratio(ink, b).toFixed(1)}:1`, X, Y + 64, 8.5, PAL.muted, 500, 'left', MONO); x.restore(); }
      });
      x.restore();
    }
    if (L >= 3) { x.save(); x.globalAlpha = E.outC(seg(t, 3.4, 4.0)); T(x, '견본 밑 숫자: 배경 L* / 카드−배경, 글자 대비', 340, 276, 9, PAL.muted, 500); x.restore(); }
    s.tag.textContent = STEP[L === 0 ? 0 : Math.min(L, 1 + (t >= 1.8 ? 1 : 0) + (t >= 3.0 ? 1 : 0))];
  },
};
export default demo;
