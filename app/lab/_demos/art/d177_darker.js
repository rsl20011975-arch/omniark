/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/contrast-ratio-auto/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng, rr } from "./helpers.js";

// 글자색·배경색 두 색에서 WCAG 의 상대 휘도·대비비 식을 코드로 그대로 계산해 숫자로 보여 주고, 기준(4.5:1 · 3:1)과 비교해 통과·실패를 판정한다. 화면은 시간 t 의 함수다.
const TEXT_FG = '#595959';   // 첫 견본의 글자색(연한 회색). 팁이 이 값을 바꾼다
const FONT_PX = 16;          // 견본 글자 크기(px). 24px(=18pt) 이상이면 WCAG 의 '큰 글자'라서 3:1 기준을 쓴다
const LARGE_PX = 24;         // 큰 글자의 기준 크기(18pt = 24px)
const PAIRS = [[TEXT_FG, '#ffffff', '연한 회색 글자'], ['#ffffff', '#ff8a3d', '흰 글자 + 주황 배경'], ['#0b0f1a', '#ff8a3d', '어두운 글자 + 같은 주황 배경'], ['#777777', '#ffffff', '#777777 회색 글자']];
const T0 = .3, SLOT = 1.5;   // 견본 하나가 머무는 시간(초)
const SANS = "'IBM Plex Sans KR','Malgun Gothic',sans-serif", MONO = "'JetBrains Mono',monospace", DISP = "'Black Han Sans','Malgun Gothic',sans-serif";
const TX2 = '#98a2b5', TAU = Math.PI * 2, OK = '#3ecf8e', NG = '#ff6b6b';

// ---- WCAG 식 그대로 ----
const lin = (v8) => { const s = v8 / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };   // sRGB 한 채널을 선형 값으로
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
function lum(h) { const [r, g, b] = rgb(h).map(lin); return { r, g, b, L: 0.2126 * r + 0.7152 * g + 0.0722 * b }; }   // 상대 휘도
function contrast(a, b) { const hi = Math.max(a.L, b.L), lo = Math.min(a.L, b.L); return (hi + 0.05) / (lo + 0.05); }   // 대비비 = (밝은 L + 0.05) / (어두운 L + 0.05)

// ---- 그리기 도구 ----
function tx(c, s, x, y, size, col, wt, al, font) { c.save(); c.fillStyle = col; c.font = (wt || 500) + ' ' + size + 'px ' + (font || SANS); c.textAlign = al || 'left'; c.textBaseline = 'alphabetic'; c.fillText(s, x, y); c.restore(); }
function bgFill(c, grain) {
  const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, '#0b0f1a'); g.addColorStop(1, '#070a12'); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
  const r = c.createRadialGradient(470, 120, 10, 470, 120, 330); r.addColorStop(0, 'rgba(255,138,61,.07)'); r.addColorStop(1, 'rgba(255,138,61,0)'); c.fillStyle = r; c.fillRect(0, 0, 640, 360);
  c.globalAlpha = .05; c.fillStyle = c.createPattern(grain, 'repeat'); c.fillRect(0, 0, 640, 360); c.globalAlpha = 1;
}
function panel(c, x, y, w, h) { rr(c, x, y, w, h, 8); c.fillStyle = 'rgba(255,255,255,.035)'; c.fill(); c.strokeStyle = 'rgba(255,255,255,.09)'; c.lineWidth = 1; c.stroke(); }
function mark(c, x, y, ok, col, k) {   // 통과(체크)·실패(가위표)를 선으로 직접 그린다
  c.save(); c.translate(x, y); c.scale(k, k); c.strokeStyle = col; c.lineWidth = 2.2; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath();
  if (ok) { c.moveTo(-4.5, 0.5); c.lineTo(-1.2, 3.8); c.lineTo(5, -4); } else { c.moveTo(-4, -4); c.lineTo(4, 4); c.moveTo(4, -4); c.lineTo(-4, 4); }
  c.stroke(); c.restore();
}
const f3 = (v) => v.toFixed(3);

const demo = {
  dur: 6.6, rest: 6.2, noCompare: false, levels: 3,
  mount(sp) {
    const cv = el('canvas', null, sp); cv.width = 1280; cv.height = 720; cv.style.cssText = 'position:absolute;left:0;top:0;width:640px;height:360px';
    const gc = document.createElement('canvas'); gc.width = gc.height = 96; const g = gc.getContext('2d'), r = rng(3), im = g.createImageData(96, 96);
    for (let i = 0; i < 96 * 96; i++) { const v = Math.round(r() * 255); im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } g.putImageData(im, 0, 0);
    const P = PAIRS.map(([fg, bg, name]) => { const a = lum(fg), b = lum(bg); return { fg, bg, name, a, b, r: contrast(a, b) }; });
    return { ctx: cv.getContext('2d'), grain: gc, P };
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 3 : lv), c = s.ctx, idx = Math.max(0, Math.min(3, Math.floor((t - T0) / SLOT))), u = Math.max(0, t - T0 - idx * SLOT), p = s.P[idx];
    c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1; bgFill(c, s.grain);
    const enter = E.outC(seg(u, 0, .35));
    // 왼쪽: 견본 카드(글자 + 테두리 있는 화면 부품)
    c.save(); c.globalAlpha = enter; c.translate((1 - enter) * -18, 0);
    c.save(); c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 18; c.shadowOffsetY = 8; rr(c, 16, 52, 280, 150, 14); c.fillStyle = p.bg; c.fill(); c.restore();
    rr(c, 16.5, 52.5, 279, 149, 14); c.strokeStyle = 'rgba(0,0,0,.18)'; c.lineWidth = 1; c.stroke();
    tx(c, '새 소식이 도착했어요', 156, 108 + FONT_PX * .35, FONT_PX, p.fg, 500, 'center');
    rr(c, 106, 140, 100, 34, 8); c.strokeStyle = p.fg; c.lineWidth = 2; c.stroke(); tx(c, '확인', 156, 162, 14, p.fg, 500, 'center');
    c.restore();
    c.globalAlpha = 1;
    // 색 정보
    c.fillStyle = p.fg; rr(c, 16, 214, 14, 14, 3); c.fill(); c.strokeStyle = 'rgba(255,255,255,.4)'; c.lineWidth = 1; c.stroke(); tx(c, `글자색 ${p.fg}`, 36, 225.5, 11, '#d5dbe8', 500, 'left', MONO);
    c.fillStyle = p.bg; rr(c, 16, 234, 14, 14, 3); c.fill(); c.strokeStyle = 'rgba(255,255,255,.4)'; c.stroke(); tx(c, `배경색 ${p.bg}`, 36, 245.5, 11, '#d5dbe8', 500, 'left', MONO);
    tx(c, `글자 크기 ${FONT_PX}px`, 176, 225.5, 11, '#d5dbe8', 500, 'left', MONO);
    // 오른쪽
    panel(c, 312, 52, 312, 196);
    if (L === 1) {   // 눈대중: 숫자 없이 견본 네 개만
      tx(c, '눈으로만 비교하면?', 324, 70, 11, TX2, 600);
      s.P.forEach((q, i) => {
        const x = 324 + (i % 2) * 150, y = 80 + Math.floor(i / 2) * 78, cur = i === idx;
        rr(c, x, y, 140, 68, 8); c.fillStyle = q.bg; c.fill(); c.lineWidth = cur ? 2.5 : 1; c.strokeStyle = cur ? '#ff8a3d' : 'rgba(255,255,255,.25)'; c.stroke();
        tx(c, '새 소식 도착', x + 70, y + 40, 15, q.fg, 500, 'center'); tx(c, String(i + 1), x + 10, y + 16, 11, q.fg, 700, 'left', MONO);
      });
      tx(c, '읽기 어려운 것은? 사람마다 답이 다릅니다.', 324, 240, 11, '#d5dbe8', 500);
      tx(c, '숫자가 없으면 기준에 맞는지 확인할 수 없습니다.', 16, 290, 12, '#d5dbe8', 500);
    } else {
      const rw = E.outC(seg(u, .35, .85)), cnt = E.outC(seg(u, .85, 1.25)), rat = lerp(1, p.r, cnt);
      tx(c, '① 상대 휘도 L (밝기를 0~1 로)', 324, 70, 11, TX2, 600);
      [[p.fg, p.a, '글자색', 86], [p.bg, p.b, '배경색', 118]].forEach(([h, q, n, y]) => {
        c.globalAlpha = rw; c.fillStyle = h; rr(c, 324, y, 12, 12, 3); c.fill(); c.strokeStyle = 'rgba(255,255,255,.4)'; c.stroke();
        tx(c, `${n} ${h}`, 342, y + 10, 11, '#d5dbe8', 500, 'left', MONO); tx(c, `L = ${f3(q.L)}`, 612, y + 10, 12, '#ffd9b0', 700, 'right', MONO);
        tx(c, `R ${f3(q.r)} · G ${f3(q.g)} · B ${f3(q.b)} (선형화 뒤)`, 342, y + 24, 10, TX2, 500, 'left', MONO); c.globalAlpha = 1;
      });
      tx(c, `L = 0.2126·R + 0.7152·G + 0.0722·B`, 324, 156, 10, TX2, 500, 'left', MONO);
      c.globalAlpha = seg(u, .6, 1); tx(c, '② 대비비 = (밝은 L + 0.05) ÷ (어두운 L + 0.05)', 324, 176, 11, TX2, 600);
      tx(c, `= (${f3(Math.max(p.a.L, p.b.L))} + 0.05) ÷ (${f3(Math.min(p.a.L, p.b.L))} + 0.05)`, 324, 192, 11, '#d5dbe8', 500, 'left', MONO); c.globalAlpha = 1;
      c.font = '400 40px ' + DISP; tx(c, `${rat.toFixed(2)} : 1`, 324, 236, 40, '#ffffff', 400, 'left', DISP);
    }
    if (L >= 2) {   // 1~21 눈금 위에 지금 대비비
      const bx = (r) => 16 + Math.log(r) / Math.log(21) * 608, by = 270, cnt = E.outC(seg(u, .85, 1.25)), rat = lerp(1, p.r, cnt);
      rr(c, 16, by, 608, 8, 4); c.fillStyle = 'rgba(255,255,255,.1)'; c.fill();
      const gr = c.createLinearGradient(16, 0, 624, 0); gr.addColorStop(0, 'rgba(255,107,107,.65)'); gr.addColorStop(.4, 'rgba(255,200,92,.65)'); gr.addColorStop(1, 'rgba(62,207,142,.7)'); rr(c, 16, by, bx(rat) - 16 + 1, 8, 4); c.fillStyle = gr; c.fill();
      [1, 21].forEach((v) => tx(c, String(v), bx(v), by + 22, 10, TX2, 500, v === 1 ? 'left' : 'right', MONO));
      if (L >= 3) [[3, '3'], [4.5, '4.5'], [7, '7']].forEach(([v, l]) => { c.fillStyle = 'rgba(255,255,255,.7)'; c.fillRect(bx(v) - .5, by - 4, 1, 16); tx(c, l, bx(v), by + 22, 10, '#d5dbe8', 600, 'center', MONO); });
      c.beginPath(); c.moveTo(bx(rat), by - 2); c.lineTo(bx(rat) - 5, by - 10); c.lineTo(bx(rat) + 5, by - 10); c.closePath(); c.fillStyle = '#ff8a3d'; c.fill();
    }
    if (L >= 3) {   // 기준과 비교한 판정
      const big = FONT_PX >= LARGE_PX, pop = E.outBack(seg(u, 1.15, 1.45));
      [['일반 글자', 4.5, !big], ['큰 글자', 3, big], ['화면 부품(테두리)', 3, false]].forEach(([n, th, cur], i) => {
        const ok = p.r >= th, x = 16 + i * 206, y = 306, col = ok ? OK : NG;
        c.save(); c.translate(x + 98, y + 12); c.scale(pop, pop); c.translate(-98, -12);
        rr(c, 0, 0, 196, 26, 13); c.fillStyle = ok ? 'rgba(62,207,142,.14)' : 'rgba(255,107,107,.14)'; c.fill(); c.lineWidth = cur ? 2 : 1; c.strokeStyle = cur ? '#ffffff' : col; c.stroke();
        mark(c, 16, 13, ok, col, 1); tx(c, `${n} ${th}:1 이상`, 30, 17.5, 11, '#e6ebf5', 600); tx(c, ok ? '통과' : '실패', 184, 17.5, 11, col, 700, 'right');
        c.restore();
      });
    }
    tx(c, '식은 W3C 의 WCAG 정의 그대로이고, 모든 숫자는 코드가 계산한 값입니다.' + (L >= 3 ? ' 흰 테두리 = 지금 글자 크기에 해당' : ''), 16, 353, 10.5, TX2, 500);
    const post = L === 1 ? '눈대중으로만 보기 · 숫자 없음' : (L === 2 ? `코드가 계산: 상대 휘도 → 대비비 (견본 ${idx + 1}/4 · ${p.name})` : `자동 판정: 기준과 비교 (견본 ${idx + 1}/4 · ${p.name})`);
    c.font = '500 12px ' + SANS; const pw = c.measureText(post).width + 24; rr(c, 14, 12, pw, 24, 12); c.fillStyle = 'rgba(8,10,20,.78)'; c.fill(); c.strokeStyle = 'rgba(255,255,255,.12)'; c.stroke(); tx(c, post, 26, 28, 12, '#fff', 500);
  },
};
export default demo;
