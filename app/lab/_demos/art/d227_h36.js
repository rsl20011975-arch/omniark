/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/focus-ring-touch-target/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 주문서 화면 목업(폭 352px, 1:1 크기)에서 Tab 으로 칸을 옮겨 가며 세 가지를 코드가 잰다: 포커스 링이 보이는가, 눌리는 칸이 24px·44px 이상인가, 고정 헤더가 포커스 칸을 가리는가.
// 화면은 시간 t 의 함수다. 목업의 크기와 판정은 전부 이 코드가 계산한다(손으로 적은 숫자 없음).
const MIN_H = 36;        // 연출 후 눌리는 칸 최소 높이(px). 입력칸·버튼·아이콘 눌리는 영역에 모두 쓴다
const SCROLL_PAD = 72;   // 연출 후 scroll-padding-top(px). 고정 헤더 56px 보다 크게 둔다
const RING_W = 2;        // 포커스 링 두께(px)
const RING_GAP = 2;      // 링과 칸 사이 간격(px)
const HEADER_H = 56;     // 고정 헤더 높이(px)
const SMALL = 32, ICON = 20, ICON_D = 22;   // 연출 전: 칸 높이, 아이콘 크기, 아이콘 두 개의 중심 간격
const PAL = { bg0: '#0c1814', bg1: '#15271f', ink: '#e8f1ea', muted: '#86a091', accent: '#7fe0a8', accent2: '#e8d27a', surface: '#12231c', line: 'rgba(232,241,234,.22)' };
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif';
const WIN = { x: 12, y: 44, w: 352, h: 304 };                       // 목업 창
const C = { bg: '#f4f7f3', head: '#ffffff', ink: '#1c2a22', sub: '#4a5d52', edge: '#9fb1a5', pay: '#14684a', ring: '#1d4ed8', bad: '#b42318' };
const FIELDS = [['받는 사람', '김하나'], ['연락처', '010-2345-6789'], ['주소', '서울 마포구 월드컵로 12'], ['상세 주소', '302호'], ['배송 메모', '문 앞에 놓아 주세요']];
const ROW0 = 80, ROW_STEP = 76, BTN_Y = 460, CONTENT_H = 528, MAX_SCROLL = CONTENT_H - WIN.h;
const STOPS = [{ id: 'i1', t: 0.5 }, { id: 'i2', t: 1.0 }, { id: 'f0', t: 1.5 }, { id: 'f1', t: 2.0 }, { id: 'pay', t: 3.0 }, { id: 'f1', t: 4.6 }];
const STEP = ['링 없음 · 작은 칸 · 헤더 가림', '포커스 링 켜기', '눌리는 칸 키우기', '고정 헤더 피하기'];

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lum = (h) => { const [r, g, b] = hex(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const p = lum(a), q = lum(b); return (Math.max(p, q) + 0.05) / (Math.min(p, q) + 0.05); };

function layout(L) {
  const ch = L >= 2 ? MIN_H : SMALL, hit = L >= 2 ? MIN_H : ICON, d = L >= 2 ? hit + 8 : ICON_D;
  const fields = FIELDS.map((f, i) => ({ id: 'f' + i, kind: '입력칸', x: 16, y: ROW0 + i * ROW_STEP, w: 320, h: ch, label: f[0], value: f[1] }));
  const cancel = { id: 'cancel', kind: '버튼', x: 16, y: BTN_Y, w: 150, h: ch, label: '취소' };
  const pay = { id: 'pay', kind: '버튼', x: 174, y: BTN_Y, w: 162, h: ch, label: '결제하기' };
  const cx2 = WIN.w - 30, cx1 = cx2 - d;
  const ic = (id, cx, shape) => ({ id, kind: '아이콘', shape, x: cx - hit / 2, y: HEADER_H / 2 - hit / 2, w: hit, h: hit, fixed: true });
  const icons = [ic('i1', cx1, 'search'), ic('i2', cx2, 'menu')];
  return { ch, hit, d, fields, cancel, pay, icons, all: [...icons, ...fields, cancel, pay] };
}
// WCAG 2.5.8: 24×24 이상이거나, 24px 지름 원이 다른 칸(작은 칸은 그 칸의 원)과 겹치지 않으면 통과
function pass24(t, all) {
  if (t.w >= 24 && t.h >= 24) return true;
  const c = { x: t.x + t.w / 2, y: t.y + t.h / 2 };
  return all.every((o) => {
    if (o === t) return true;
    if (o.w < 24 || o.h < 24) return Math.hypot(c.x - (o.x + o.w / 2), c.y - (o.y + o.h / 2)) >= 24;
    const dx = Math.max(o.x - c.x, 0, c.x - (o.x + o.w)), dy = Math.max(o.y - c.y, 0, c.y - (o.y + o.h));
    return Math.hypot(dx, dy) >= 12;
  });
}
const scrollAt = (t, pad) => {
  const tgt = Math.max(0, ROW0 + ROW_STEP - pad);
  if (t < 3.0) return 0;
  if (t < 3.7) return lerp(0, MAX_SCROLL, E.inOutC(seg(t, 3.0, 3.7)));
  if (t < 4.6) return MAX_SCROLL;
  return lerp(MAX_SCROLL, tgt, E.inOutC(seg(t, 4.6, 5.3)));
};
const coverOf = (fieldTop, ch) => Math.max(0, Math.min(fieldTop + ch, HEADER_H) - Math.max(fieldTop, 0)) / ch;

let GRAIN = null;
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function rr(x, X, Y, W, H, r) { x.beginPath(); x.roundRect(X, Y, W, H, r); }
function card(x, X, Y, Wd, Ht) { x.save(); x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 10; x.shadowOffsetY = 3; x.fillStyle = PAL.surface; rr(x, X, Y, Wd, Ht, 6); x.fill(); x.restore(); x.strokeStyle = PAL.line; x.lineWidth = 1; rr(x, X, Y, Wd, Ht, 6); x.stroke(); }

function drawIcon(x, ic) {
  const cx = ic.x + ic.w / 2, cy = ic.y + ic.h / 2;
  x.save(); x.strokeStyle = C.ink; x.lineWidth = 2; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
  if (ic.shape === 'search') { x.arc(cx - 1.5, cy - 1.5, 5.5, 0, 7); x.moveTo(cx + 2.6, cy + 2.6); x.lineTo(cx + 7, cy + 7); }
  else { [-5, 0, 5].forEach((o) => { x.moveTo(cx - 7, cy + o); x.lineTo(cx + 7, cy + o); }); }
  x.stroke(); x.restore();
}
function drawControl(x, c) {
  if (c.kind === '입력칸') {
    T(x, c.label, c.x, c.y - 7, 12, C.sub, 600);
    x.save(); x.shadowColor = 'rgba(20,50,35,.10)'; x.shadowBlur = 3; x.shadowOffsetY = 1; x.fillStyle = '#fff'; rr(x, c.x, c.y, c.w, c.h, 8); x.fill(); x.restore();
    x.strokeStyle = C.edge; x.lineWidth = 1; rr(x, c.x + 0.5, c.y + 0.5, c.w - 1, c.h - 1, 8); x.stroke();
    T(x, c.value, c.x + 12, c.y + c.h / 2 + 5, 14, C.ink, 500);
  } else if (c.id === 'pay') {
    x.save(); x.shadowColor = 'rgba(10,60,40,.35)'; x.shadowBlur = 8; x.shadowOffsetY = 3; const g = x.createLinearGradient(0, c.y, 0, c.y + c.h); g.addColorStop(0, '#198059'); g.addColorStop(1, C.pay); x.fillStyle = g; rr(x, c.x, c.y, c.w, c.h, 8); x.fill(); x.restore();
    T(x, c.label, c.x + c.w / 2, c.y + c.h / 2 + 5, 15, '#fff', 700, 'center');
  } else {
    x.strokeStyle = C.edge; x.lineWidth = 1; rr(x, c.x + 0.5, c.y + 0.5, c.w - 1, c.h - 1, 8); x.stroke();
    T(x, c.label, c.x + c.w / 2, c.y + c.h / 2 + 5, 15, C.ink, 600, 'center');
  }
}
function drawRing(x, c, age) {
  const pop = 1 - E.outC(seg(age, 0, 0.2)), g = RING_GAP + 4 * pop;           // 처음에 살짝 벌어졌다 안착
  x.save(); x.globalAlpha = 0.35 + 0.65 * E.outC(seg(age, 0, 0.12)); x.strokeStyle = C.ring; x.lineWidth = RING_W;
  const o = g + RING_W / 2; rr(x, c.x - o, c.y - o, c.w + 2 * o, c.h + 2 * o, 8 + o); x.stroke(); x.restore();
}

function drawWindow(x, t, L) {
  const lay = layout(L), pad = L >= 3 ? SCROLL_PAD : 0, sc = scrollAt(t, pad);
  const cur = [...STOPS].reverse().find((s) => t >= s.t), tg = cur && lay.all.find((c) => c.id === cur.id), age = cur ? t - cur.t : 0;
  x.save(); x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = 24; x.shadowOffsetY = 10; x.fillStyle = C.bg; rr(x, WIN.x, WIN.y, WIN.w, WIN.h, 12); x.fill(); x.restore();
  x.save(); rr(x, WIN.x, WIN.y, WIN.w, WIN.h, 12); x.clip(); x.translate(WIN.x, WIN.y);
  x.save(); x.translate(0, -sc);                                           // 스크롤되는 본문
  T(x, '배송 정보', 16, 52, 20, C.ink, 800);
  [...lay.fields, lay.cancel, lay.pay].forEach((c) => drawControl(x, c));
  if (L >= 1 && tg && !tg.fixed) drawRing(x, tg, age);
  if (L >= 3 && t > 4.4) { x.save(); x.globalAlpha = E.outC(seg(t, 4.6, 5.2)); x.strokeStyle = '#c2610a'; x.lineWidth = 1; x.setLineDash([5, 4]); x.beginPath(); x.moveTo(0, sc + pad + 0.5); x.lineTo(WIN.w, sc + pad + 0.5); x.stroke(); T(x, `scroll-padding-top ${pad}`, WIN.w - 10, sc + pad - 5, 10, '#c2610a', 700, 'right', MONO); x.restore(); }
  x.restore();
  // 고정 헤더(본문 위에 그려 가린다)
  x.save(); x.shadowColor = 'rgba(20,40,30,.18)'; x.shadowBlur = 8; x.shadowOffsetY = 2; x.fillStyle = C.head; x.fillRect(0, 0, WIN.w, HEADER_H); x.restore();
  x.fillStyle = 'rgba(20,40,30,.06)'; x.fillRect(0, HEADER_H - 1, WIN.w, 1);
  T(x, '주문서', 16, 34, 17, C.ink, 800);
  lay.icons.forEach((ic) => {
    drawIcon(x, ic);
    if (L >= 2) { x.save(); x.strokeStyle = 'rgba(20,90,65,.45)'; x.lineWidth = 1; x.setLineDash([3, 3]); x.strokeRect(ic.x + 0.5, ic.y + 0.5, ic.w - 1, ic.h - 1); x.restore(); }
  });
  if (L < 2) { const a0 = lay.icons[0], a1 = lay.icons[1]; T(x, `${Math.round(a0.w)}×${Math.round(a0.h)}, 중심 간격 ${Math.round(a1.x + a1.w / 2 - a0.x - a0.w / 2)}px`, a1.x + a1.w, HEADER_H - 5, 10, C.bad, 700, 'right', MONO); }
  if (L >= 1 && tg && tg.fixed) drawRing(x, tg, age);
  x.restore();
  x.strokeStyle = 'rgba(232,241,234,.28)'; x.lineWidth = 1; rr(x, WIN.x + 0.5, WIN.y + 0.5, WIN.w - 1, WIN.h - 1, 12); x.stroke();
  return { lay, pad, sc };
}

const demo = {
  dur: 7.0, rest: 7.0, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(27), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const pill = el('div', null, sp);
    Object.assign(pill.style, { position: 'absolute', left: '12px', top: '10px', height: '24px', padding: '0 12px 0 10px', borderRadius: '999px', background: PAL.surface, color: PAL.ink, font: "600 12px/24px 'IBM Plex Sans KR',sans-serif", boxShadow: `inset 0 0 0 1px ${PAL.line}, 0 3px 10px rgba(0,0,0,.3)`, whiteSpace: 'nowrap', zIndex: '4' });
    return { main, pill };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 0 : (lv == null ? 3 : lv);
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.setLineDash([]);
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.1;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();
    const { lay, pad } = drawWindow(x, t, L);

    // 최종 상태에서 코드가 재는 값
    const fail24 = lay.all.filter((c) => !pass24(c, lay.all)).length, below44 = lay.all.filter((c) => Math.min(c.w, c.h) < 44).length;
    const fTop = ROW0 + ROW_STEP - Math.max(0, ROW0 + ROW_STEP - pad), cover = coverOf(fTop, lay.ch);
    // 오른쪽: 지금 단계의 점검 카드 한 장만 보인다
    const PX = 380, PW = 252, PY = 58, PH = 200;
    const stage = t < 1.8 ? 1 : (t < 4.4 ? 2 : 3);
    const cardAlpha = (k) => {
      const inA = k === 1 ? E.outC(seg(t, 0.15, 0.55)) : E.outC(seg(t, k === 2 ? 1.8 : 4.4, (k === 2 ? 1.8 : 4.4) + 0.45));
      const outA = (k < L) ? E.outC(seg(t, k === 1 ? 1.8 : 4.4, (k === 1 ? 1.8 : 4.4) + 0.3)) : 0;
      return (L >= k ? inA : 0) * (1 - outA);
    };
    const rowTxt = (k, v, Y, col) => { T(x, k, PX + 16, Y, 12, PAL.ink, 600); T(x, v, PX + PW - 16, Y, 14, col, 700, 'right', MONO); };
    if (L === 0) {
      card(x, PX, PY, PW, PH);
      T(x, '지금 화면을 재면', PX + 16, PY + 28, 14, PAL.ink, 700);
      T(x, 'outline: none, 20px 아이콘, 고정 헤더', PX + 16, PY + 48, 10, PAL.muted, 500);
      [['보이는 포커스 링', `0 / ${STOPS.length}곳`], ['24px 미만 눌리는 칸', `${fail24}개`], ['헤더에 가린 비율', `${(cover * 100).toFixed(0)}%`]].forEach(([k, v], i) => rowTxt(k, v, PY + 86 + i * 32, '#ff9b7a'));
      T(x, 'Tab 을 눌러도 어디에 있는지 알 수 없다', PX + 16, PY + 182, 10, PAL.muted, 500);
    }
    if (cardAlpha(1) > 0.004) {
      x.save(); x.globalAlpha = cardAlpha(1); card(x, PX, PY, PW, PH);
      T(x, '포커스 링', PX + 16, PY + 28, 14, PAL.ink, 700);
      const o = RING_GAP, w0 = 320, h0 = lay.ch, area = (w0 + 2 * (o + RING_W)) * (h0 + 2 * (o + RING_W)) - (w0 + 2 * o) * (h0 + 2 * o), base = w0 * h0 - (w0 - 4) * (h0 - 4);
      T(x, `두께 ${RING_W}px, 칸에서 ${RING_GAP}px 띄움`, PX + 16, PY + 52, 12, PAL.ink, 600, 'left', MONO);
      rowTxt('바탕과 색 대비', `${contrast(C.ring, C.bg).toFixed(1)} : 1`, PY + 92, PAL.accent);
      rowTxt('링 면적', `${(area / base).toFixed(2)}배`, PY + 124, PAL.accent);
      T(x, '기준은 2px 둘레 면적, 대비는 3 : 1 이상', PX + 16, PY + 182, 10, PAL.muted, 500);
      x.restore();
    }
    if (cardAlpha(2) > 0.004) {
      x.save(); x.globalAlpha = cardAlpha(2); card(x, PX, PY, PW, PH);
      T(x, '눌리는 칸 크기', PX + 16, PY + 28, 14, PAL.ink, 700);
      ['크기', '24↑', '44↑'].forEach((n, i) => T(x, n, PX + 128 + i * 40 + 34, PY + 54, 11, PAL.muted, 500, 'right'));
      [['아이콘', lay.icons[0]], ['입력칸', lay.fields[0]], ['버튼', lay.pay]].forEach(([n, c], i) => {
        const Y = PY + 84 + i * 26, ok24 = pass24(c, lay.all), ok44 = Math.min(c.w, c.h) >= 44;
        T(x, n, PX + 16, Y, 12, PAL.ink, 600);
        T(x, `${Math.round(c.w)}×${Math.round(c.h)}`, PX + 128 + 34, Y, 12, PAL.ink, 600, 'right', MONO);
        T(x, ok24 ? '통과' : '미달', PX + 128 + 40 + 34, Y, 12, ok24 ? '#8fe0a8' : '#ff9b7a', 700, 'right');
        T(x, ok44 ? '통과' : '미달', PX + 128 + 80 + 34, Y, 12, ok44 ? '#8fe0a8' : PAL.accent2, 700, 'right');
      });
      T(x, `24px 미만 ${fail24}개, 44px 미만 ${below44}개`, PX + 16, PY + 174, 12, PAL.accent, 700);
      T(x, `칸 ${lay.all.length}개를 모두 잰 결과`, PX + 16, PY + 190, 10, PAL.muted, 500);
      x.restore();
    }
    if (cardAlpha(3) > 0.004) {
      x.save(); x.globalAlpha = cardAlpha(3); card(x, PX, PY, PW, PH);
      T(x, `고정 헤더 ${HEADER_H}px 가림 점검`, PX + 16, PY + 28, 14, PAL.ink, 700);
      T(x, `scroll-padding-top ${pad}px`, PX + 16, PY + 52, 12, PAL.ink, 600, 'left', MONO);
      rowTxt('칸 윗변, 화면 위에서', `${Math.round(fTop)}px`, PY + 86, PAL.ink);
      rowTxt('헤더에 가린 비율', `${(cover * 100).toFixed(0)}%`, PY + 114, cover > 0 ? '#ff9b7a' : '#8fe0a8');
      rowTxt('44px 미만 칸', `${below44}개`, PY + 142, below44 > 0 ? PAL.accent2 : '#8fe0a8');
      T(x, cover >= 1 ? '완전히 가림: 2.4.11 불통과' : cover > 0 ? '일부만 가림: 통과지만 다 보이지는 않음' : '가리지 않음', PX + 16, PY + 168, 11, PAL.muted, 600);
      T(x, `72 = 헤더 ${HEADER_H} + 여유 16, 정한 값`, PX + 16, PY + 188, 10, PAL.muted, 500);
      x.restore();
    }
    s.pill.textContent = L === 2 ? `눌리는 칸 ${MIN_H}px` : STEP[L];
  },
};
export default demo;
