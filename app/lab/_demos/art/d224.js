/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/breakpoint-three-widths/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 같은 쇼핑 화면 한 장을 세 폭(320, 가운데, 1440)에서 열고, 가로 스크롤이 생기는 폭(넘침 px)을 코드가 잰다.
// 배치는 이 데모의 모형이다(제작자의 실제 중단점이 아니다). 화면은 시간 t 의 함수이고, 그림은 실제 폭의 1/5 이다.
const W_MID = 768;        // 가운데 점검 폭(px). 나머지 둘은 320 과 1440
const CARD_MIN = 240;     // 카드 한 장이 가질 수 있는 가장 좁은 폭(px). 이보다 좁아지면 열을 줄인다
const TABLE_W = 720;      // 표의 본래 폭(px): 6칸 × 120
const PAL = { bg0: '#0b0f1a', bg1: '#161d30', ink: '#f4efe4', muted: '#8b94a3', accent: '#ffb36b', accent2: '#ffd27a', surface: '#131a2b', line: 'rgba(244,239,228,.16)' };
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif';
const S = 0.2, VH = 1000;                 // 그림 배율(실제 폭 × 0.2), 보이는 높이(px)
const FY = 26, FH = VH * S, FX0 = 40, GAP = 16;
const CSSW = [[640, 6], [760, 1], [820, 1], [860, 3], [960, 2], [1100, 2]];   // 배포용 CSS 의 max-width 값과 쓰인 횟수 [측정, 이번 조사]
const STEP = ['그냥 열기', '폭 재기', '본문 맞춤', '표 칸'];
const PG = { bg: '#f4efe4', card: '#fffdf8', line: 'rgba(29,26,22,.14)', ink: '#2a2620', mute: '#9a9284', acc0: '#ffc27d', acc1: '#e8873a' };

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const mixR = (a, b, p) => ({ x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), w: lerp(a.w, b.w, p), h: lerp(a.h, b.h, p), a: lerp(a.a, b.a, p) });
const R = (x, y, w, h, a) => ({ x, y, w, h, a: a == null ? 1 : a });

// 폭 W 에서 모드별 배치(실제 px). 모드 0 = 고정 폭으로 그린 데스크톱 화면, 1 = 본문을 폭에 맞춤, 2 = 표를 제 칸 안에 가둠
function layout(W, mode) {
  const pad = mode === 0 ? 24 : (W < 400 ? 16 : 24);
  const cw = mode === 0 ? 0 : Math.min(W - 2 * pad, 1200), ox = mode === 0 ? pad : Math.round((W - cw) / 2);
  const o = {};
  if (mode === 0) {
    o.head = R(0, 0, 704, 64); o.logo = R(pad, 16, 96, 32); o.nav = R(152, 24, 384, 16); o.cta = R(568, 12, 112, 40); o.burger = R(W - pad - 44, 10, 44, 44, 0);
    o.heroText = R(pad, 96, 320, 200); o.heroImg = R(pad + 352, 80, 480, 240);
    for (let i = 0; i < 4; i++) o['card' + i] = R(pad + i * 304, 352, 280, 112, i < 3 ? 1 : 0);
    o.tblLabel = R(pad, 496, 120, 14); o.tbl = R(pad, 520, TABLE_W, 160);
  } else {
    const collapse = 2 * pad + 96 + 32 + 384 + 32 + 112 > W;
    o.head = R(0, 0, W, 64); o.logo = R(ox, 16, 96, 32);
    o.nav = R(ox + 128, 24, 384, 16, collapse ? 0 : 1); o.cta = R(ox + cw - 112, 12, 112, 40, collapse ? 0 : 1); o.burger = R(ox + cw - 44, 10, 44, 44, collapse ? 1 : 0);
    const two = cw >= 672;
    let hb;
    if (two) { const tw = Math.floor((cw - 32) / 2); o.heroText = R(ox, 96, tw, 200); o.heroImg = R(ox + tw + 32, 80, cw - tw - 32, 240); hb = 320; }
    else { const ih = Math.round(cw * 0.4); o.heroText = R(ox, 88, cw, 170); o.heroImg = R(ox, 274, cw, ih); hb = 274 + ih; }
    const cols = clamp(Math.floor((cw + 24) / (CARD_MIN + 24)), 1, 4), cwid = (cw - 24 * (cols - 1)) / cols, y0 = hb + 32;
    const ch = cols === 1 ? 72 : 112, pitch = ch + 16;   // 한 열일 때는 카드를 낮고 가로로 길게
    for (let i = 0; i < 4; i++) o['card' + i] = R(ox + (i % cols) * (cwid + 24), y0 + Math.floor(i / cols) * pitch, cwid, ch);
    const cb = y0 + Math.ceil(4 / cols) * pitch;
    o.tblLabel = R(ox, cb + 16, 120, 14); o.tbl = R(ox, cb + 40, mode === 2 ? cw : TABLE_W, 160);
    o.cols = cols; o.collapse = collapse;
  }
  return o;
}
const scrollW = (W, L) => Math.max(W, ...Object.values(L).filter((r) => typeof r === 'object' && r.a > 0.5).map((r) => r.x + r.w));
function lay(W, m) {                       // m: 0~2 사이 실수 모드. 두 모드 사이를 섞는다
  const a = layout(W, Math.floor(m)), b = layout(W, Math.min(2, Math.ceil(m))), f = m - Math.floor(m), r = {};
  Object.keys(a).forEach((k) => { r[k] = typeof a[k] === 'object' ? mixR(a[k], b[k], f) : (f < 0.5 ? a[k] : b[k]); });
  r.sw = lerp(scrollW(W, a), scrollW(W, b), f);
  r.end = scrollW(W, layout(W, Math.round(m)));
  return r;
}

let GRAIN = null;
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function rr(x, X, Y, Wd, Ht, r) { x.beginPath(); x.roundRect(X, Y, Wd, Ht, r); }
function bar(x, X, Y, Wd, Ht, col) { x.fillStyle = col; rr(x, X, Y, Math.max(Wd, 0), Ht, Ht / 2); x.fill(); }

function scene(x, r) {                      // 히어로 사진 느낌의 저녁 풍경: 하늘, 해, 겹친 능선
  const g = x.createLinearGradient(0, r.y, 0, r.y + r.h); g.addColorStop(0, '#34406e'); g.addColorStop(0.55, '#c9786f'); g.addColorStop(1, '#f1b27a');
  x.fillStyle = g; rr(x, r.x, r.y, r.w, r.h, 14); x.fill();
  x.save(); rr(x, r.x, r.y, r.w, r.h, 14); x.clip();
  const sx = r.x + r.w * 0.68, sy = r.y + r.h * 0.6, rad = r.h * 0.7, sun = x.createRadialGradient(sx, sy, 0, sx, sy, rad);
  sun.addColorStop(0, 'rgba(255,238,200,.95)'); sun.addColorStop(0.18, 'rgba(255,214,150,.55)'); sun.addColorStop(1, 'rgba(255,170,110,0)'); x.fillStyle = sun; x.fillRect(r.x, r.y, r.w, r.h);
  [['#6d4a63', 0.62, 0.11, 2.1], ['#43304f', 0.74, 0.09, 3.4], ['#241a33', 0.86, 0.07, 1.3]].forEach(([c, base, amp, ph]) => {
    x.fillStyle = c; x.beginPath(); x.moveTo(r.x, r.y + r.h);
    for (let i = 0; i <= 24; i++) { const u = i / 24; x.lineTo(r.x + u * r.w, r.y + r.h * (base + amp * Math.sin(u * 5 + ph) * 0.6 + amp * 0.4 * Math.sin(u * 11 + ph * 2))); }
    x.lineTo(r.x + r.w, r.y + r.h); x.closePath(); x.fill();
  });
  x.restore();
}
function drawBlocks(x, W, Lz) {
  const hd = Lz.head; x.save(); x.shadowColor = 'rgba(29,26,22,.18)'; x.shadowBlur = 14; x.shadowOffsetY = 3; x.fillStyle = PG.card; x.fillRect(0, 0, W, hd.h); x.restore();
  const lg = x.createLinearGradient(0, 16, 0, 48); lg.addColorStop(0, PG.acc0); lg.addColorStop(1, PG.acc1); x.fillStyle = lg; rr(x, Lz.logo.x, Lz.logo.y, 36, 32, 9); x.fill(); bar(x, Lz.logo.x + 48, 26, 44, 12, PG.ink);
  x.save(); x.globalAlpha = Lz.nav.a; for (let i = 0; i < 5; i++) bar(x, Lz.nav.x + i * 80, Lz.nav.y + 2, 64, 12, PG.mute); x.restore();
  x.save(); x.globalAlpha = Lz.cta.a; const cg = x.createLinearGradient(0, Lz.cta.y, 0, Lz.cta.y + 40); cg.addColorStop(0, PG.acc0); cg.addColorStop(1, PG.acc1); x.fillStyle = cg; rr(x, Lz.cta.x, Lz.cta.y, Lz.cta.w, 40, 12); x.fill(); bar(x, Lz.cta.x + 28, Lz.cta.y + 15, 56, 10, 'rgba(255,255,255,.85)'); x.restore();
  x.save(); x.globalAlpha = Lz.burger.a; x.fillStyle = PG.bg; rr(x, Lz.burger.x, Lz.burger.y, 44, 44, 12); x.fill(); [-9, 0, 9].forEach((d) => bar(x, Lz.burger.x + 11, Lz.burger.y + 20 + d, 22, 4, PG.ink)); x.restore();
  const ht = Lz.heroText;
  bar(x, ht.x, ht.y, ht.w * 0.92, 26, PG.ink); bar(x, ht.x, ht.y + 36, ht.w * 0.6, 26, PG.ink);
  [1, 0.94, 0.7].forEach((k, i) => bar(x, ht.x, ht.y + 72 + i * 18, ht.w * k, 10, PG.mute));
  { const by = ht.y + ht.h - 44, bg = x.createLinearGradient(0, by, 0, by + 40); bg.addColorStop(0, PG.acc0); bg.addColorStop(1, PG.acc1); x.fillStyle = bg; rr(x, ht.x, by, Math.min(ht.w, 132), 40, 12); x.fill(); }
  scene(x, Lz.heroImg);
  for (let i = 0; i < 4; i++) {
    const c = Lz['card' + i]; if (c.a < 0.02) continue; x.save(); x.globalAlpha = c.a;
    x.shadowColor = 'rgba(29,26,22,.2)'; x.shadowBlur = 16; x.shadowOffsetY = 5; x.fillStyle = PG.card; rr(x, c.x, c.y, c.w, c.h, 14); x.fill(); x.shadowColor = 'transparent';
    const tg = x.createLinearGradient(c.x, c.y, c.x + c.w, c.y + 60); tg.addColorStop(0, ['#f3b27c', '#9bb3d6', '#c9a0c8', '#9fcaa7'][i]); tg.addColorStop(1, ['#d9755c', '#5d7fb0', '#8e6aa6', '#5f9a74'][i]);
    if (c.h < 100) { x.fillStyle = tg; rr(x, c.x + 10, c.y + 10, 52, c.h - 20, 9); x.fill(); bar(x, c.x + 74, c.y + 22, (c.w - 90) * 0.7, 10, PG.ink); bar(x, c.x + 74, c.y + 40, (c.w - 90) * 0.4, 8, PG.mute); }
    else { x.fillStyle = tg; rr(x, c.x + 10, c.y + 10, c.w - 20, 58, 9); x.fill(); bar(x, c.x + 12, c.y + 80, c.w * 0.6, 10, PG.ink); bar(x, c.x + 12, c.y + 96, c.w * 0.38, 8, PG.mute); }
    x.restore();
  }
  bar(x, Lz.tblLabel.x, Lz.tblLabel.y, 120, 14, PG.ink);
  const tb = Lz.tbl, clipW = tb.w; x.save(); rr(x, tb.x, tb.y, clipW, tb.h, 10); x.clip();
  x.fillStyle = PG.card; x.fillRect(tb.x, tb.y, TABLE_W, tb.h); x.fillStyle = 'rgba(232,135,58,.18)'; x.fillRect(tb.x, tb.y, TABLE_W, 40);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) bar(x, tb.x + c * 120 + 14, tb.y + r * 40 + 15, r === 0 ? 56 : 30 + ((c * 17 + r * 11) % 40), r === 0 ? 11 : 9, r === 0 ? PG.ink : PG.mute);
  x.fillStyle = PG.line; for (let r = 1; r < 4; r++) x.fillRect(tb.x, tb.y + r * 40, TABLE_W, 1.5); x.restore();
  if (tb.w < TABLE_W - 1 && tb.w < W) { x.fillStyle = 'rgba(29,26,22,.12)'; rr(x, tb.x, tb.y + tb.h + 10, tb.w, 8, 4); x.fill(); x.fillStyle = 'rgba(29,26,22,.5)'; rr(x, tb.x, tb.y + tb.h + 10, tb.w * tb.w / TABLE_W, 8, 4); x.fill(); }
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
    const lab = el('div', null, sp);   // 이름표(vertical): 왼쪽 가장자리 세로쓰기
    Object.assign(lab.style, { position: 'absolute', left: '9px', top: '24px', height: '316px', display: 'flex', gap: '8px', writingMode: 'vertical-rl', zIndex: '4', font: "600 12px/1 'IBM Plex Sans KR',sans-serif", letterSpacing: '0.02em', whiteSpace: 'nowrap' });
    const items = STEP.map((s) => { const e = el('span', null, lab); e.textContent = s; e.style.color = PAL.muted; return e; });
    return { main, items };
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

    const widths = [320, W_MID, 1440];
    const pA = L >= 2 ? E.inOutC(seg(t, 1.2, 2.4)) : 0, pB = L >= 3 ? E.inOutC(seg(t, 3.0, 4.0)) : 0, m = pA + pB;
    const meas = L >= 1 ? E.outC(seg(t, 0.7, 1.3)) : 0;
    T(x, '같은 쇼핑 화면 한 장을 세 폭에서 연다 (그림은 실제 폭의 1/5)', FX0, 15, 10, PAL.muted, 500);
    let fx = FX0, pass = 0;
    widths.forEach((W, i) => {
      const Lz = lay(W, m), fw = W * S, pr = E.outC(seg(t, 0.05 + 0.14 * i, 0.65 + 0.14 * i)), fy = FY + (1 - pr) * 8;
      if (pr < 0.004) { fx += fw + GAP; return; }       // 투명도 0 에서 그림자를 그리면 브라우저가 캔버스를 지워 버린다
      const ov = Math.max(0, Math.round(Lz.sw - W)), ovEnd = Math.max(0, Math.round(Lz.end - W)); if (ovEnd === 0) pass++;
      x.save(); x.globalAlpha = pr;
      x.save(); x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 16; x.shadowOffsetY = 5; x.fillStyle = PG.bg; rr(x, fx, fy, fw, FH, 5); x.fill(); x.restore();
      x.save(); rr(x, fx, fy, fw, FH, 5); x.clip(); x.translate(fx, fy); x.scale(S, S);
      x.fillStyle = PG.bg; x.fillRect(0, 0, W, VH); x.save(); x.beginPath(); x.rect(0, 0, W, VH); x.clip(); drawBlocks(x, W, Lz); x.restore(); x.restore();
      x.strokeStyle = 'rgba(244,239,228,.3)'; x.lineWidth = 1; rr(x, fx, fy, fw, FH, 5); x.stroke();
      if (ov > 0) {                                        // 가로로 넘치면 브라우저가 가로 스크롤 줄을 만든다
        x.fillStyle = 'rgba(20,16,12,.35)'; rr(x, fx + 3, fy + FH - 8, fw - 6, 4, 2); x.fill(); x.fillStyle = 'rgba(255,255,255,.8)'; rr(x, fx + 3, fy + FH - 8, (fw - 6) * W / Lz.sw, 4, 2); x.fill();
        if (L >= 1) { const rg = x.createLinearGradient(fx + fw - 14, 0, fx + fw, 0); rg.addColorStop(0, 'rgba(255,110,90,0)'); rg.addColorStop(1, `rgba(255,110,90,${0.6 * meas})`); x.save(); rr(x, fx, fy, fw, FH, 5); x.clip(); x.fillStyle = rg; x.fillRect(fx + fw - 14, fy, 14, FH); x.restore(); }
      }
      x.restore();
      const cx0 = fx, ty = FY + FH + 18;
      T(x, `${W}px`, cx0, ty, 11, PAL.ink, 700, 'left', MONO);
      if (L >= 1) {
        x.save(); x.globalAlpha = meas;
        T(x, '넘침', cx0, ty + 16, 9, PAL.muted, 500); T(x, ov > 0 ? `+${ov}` : '0', cx0 + 24, ty + 16, 13, ov > 0 ? '#ff9b7a' : '#8fe0a8', 700, 'left', MONO);
        if (L >= 2) { x.globalAlpha = meas * E.outC(seg(t, 2.0, 2.8)); const cl = lay(W, 1); T(x, `카드 ${cl.cols}열`, cx0, ty + 30, 9.5, PAL.ink, 600); T(x, cl.collapse ? '메뉴 접힘' : '메뉴 펼침', cx0, ty + 42, 9.5, PAL.muted, 500); }
        x.restore();
      }
      fx += fw + GAP;
    });
    if (L >= 1) {
      x.save(); x.globalAlpha = meas; const done = pass === 3;
      T(x, `넘침 0인 폭 ${pass}/3`, 600, 15, 12, done ? '#8fe0a8' : PAL.accent, 700, 'right', MONO); x.restore();
      // 점검 폭과 이 사이트 CSS 중단점을 한 줄 위에 놓는다
      const ry = 335, mx = (v) => 40 + v * 0.35, same = CSSW.filter(([v]) => widths.includes(v)).length;
      x.save(); x.globalAlpha = meas * E.outC(seg(t, 1.0, 1.8));
      T(x, `배포용 CSS 의 max-width ${CSSW.reduce((q, c) => q + c[1], 0)}곳, 값 ${CSSW.length}가지 [측정]`, 40, 305, 9.5, PAL.muted, 500);
      T(x, `점검 폭과 같은 값 ${same}개`, 600, 305, 9.5, PAL.accent, 600, 'right');
      x.strokeStyle = PAL.line; x.lineWidth = 1.5; x.beginPath(); x.moveTo(40, ry); x.lineTo(600, ry); x.stroke();
      widths.forEach((v) => { x.fillStyle = PAL.accent; x.beginPath(); x.moveTo(mx(v) - 3.5, ry - 8); x.lineTo(mx(v) + 3.5, ry - 8); x.lineTo(mx(v), ry - 2); x.closePath(); x.fill(); T(x, String(v), mx(v), ry - 11, 9, PAL.accent, 600, 'center', MONO); });
      CSSW.forEach(([v, n], i) => { x.fillStyle = PAL.ink; x.beginPath(); x.arc(mx(v), ry, 2 + n * 0.55, 0, 7); x.fill(); T(x, `${v}×${n}`, mx(v), ry + 13 + (i % 2) * 9, 8.5, PAL.muted, 500, 'center', MONO); });
      x.restore();
    }
    const cur = L < 3 ? L : (t < 1.2 ? 1 : (t < 3.0 ? 2 : 3));
    s.items.forEach((e, i) => { e.style.color = i === cur ? PAL.ink : PAL.muted; e.style.fontWeight = i === cur ? '700' : '500'; });
  },
};
export default demo;
