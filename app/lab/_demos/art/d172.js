/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/tab-switch-toggle/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rr, rng } from "./helpers.js";

const PAL = { bg0: '#0c1814', bg1: '#15271f', ink: '#e8f1ea', muted: '#86a091', accent: '#7fe0a8', accent2: '#e8d27a', surface: '#12231c', line: 'rgba(232,241,234,.1)' };

// 설정 카드에서 가상 커서 하나가 탭 → 스위치 → 체크박스를 차례로 누른다. 기본은 눌린 즉시 바뀌고, 단계마다 움직임을 한 가지씩 더한다. 화면은 시간 t 의 함수다.
const TAB_MS = .3;        // 탭 밑줄이 옮겨 가고 내용이 바뀌는 데 걸리는 시간(초)
const SW_MS = .2;         // 스위치 손잡이가 옮겨 가고 체크 표시가 그려지는 데 걸리는 시간(초)
const T_TAB = 1.3, T_SW = 2.9, T_CK = 4.0;   // 세 번 누르는 시각(초)
const SLIDE = 14;         // 탭 내용이 바뀔 때 옆으로 밀리는 거리 px
const SANS = "'IBM Plex Sans KR','Malgun Gothic',sans-serif", MONO = "'JetBrains Mono',monospace";
const X0 = 100, Y0 = 58, CW = 440, CH = 272;              // 카드
const TABS = ['알림', '화면', '개인정보'], TX = [176, 280, 384];   // 탭 가운데 x
const T = (c, s, x, y, size, col, w = 500, al = 'left', f = SANS) => { c.save(); c.fillStyle = col; c.font = `${w} ${size}px ${f}`; c.textAlign = al; c.textBaseline = 'alphabetic'; c.fillText(s, x, y); c.restore(); };
const lg = (c, x0, y0, x1, y1, stops) => { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, col]) => g.addColorStop(o, col)); return g; };
const mix = (a, b, p) => a.map((v, i) => Math.round(v + (b[i] - v) * p));
const rgb = (a) => `rgb(${a.join(',')})`;
const drop = (c, x, y, w, h, r, dy, blur, al) => { c.save(); for (let i = 0; i < 8; i++) { const g = blur * (i + 1) / 8; c.fillStyle = `rgba(0,0,0,${(al / 8).toFixed(3)})`; rr(c, x - g, y + dy - g, w + 2 * g, h + 2 * g, r + g); c.fill(); } c.restore(); };
function grainTile(seed) {
  const g = document.createElement('canvas'); g.width = g.height = 128;
  const x = g.getContext('2d'), im = x.createImageData(128, 128), r = rng(seed);
  for (let i = 0; i < im.data.length; i += 4) { const v = r() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
  x.putImageData(im, 0, 0); return g;
}

function sw(c, cx, cy, p, press) {      // 스위치: p 0=꺼짐 1=켜짐
  const col = mix([52, 72, 63], [127, 224, 168], p), w = 44, h = 24, tw = 20 + press * 6, tx = lerp(cx - w / 2 + 12, cx + w / 2 - 12, p);
  rr(c, cx - w / 2, cy - h / 2, w, h, 12); c.fillStyle = rgb(col); c.fill();
  drop(c, tx - tw / 2, cy - 10, tw, 20, 10, 1.5, 2.5, .35); rr(c, tx - tw / 2, cy - 10, tw, 20, 10); c.fillStyle = rgb(mix([196, 214, 203], [232, 241, 234], p)); c.fill();
  T(c, p > .5 ? '켜짐' : '꺼짐', cx - w / 2 - 10, cy + 4.5, 12, p > .5 ? PAL.accent : PAL.muted, 600, 'right');
}
function ck(c, x, y, p) {               // 체크박스: 왼쪽 위 x,y 20×20
  rr(c, x, y, 20, 20, 5); c.fillStyle = rgb(mix([14, 28, 22], [127, 224, 168], p)); c.fill();
  rr(c, x + 1, y + 1, 18, 18, 4); c.strokeStyle = rgb(mix([100, 128, 112], [127, 224, 168], p)); c.lineWidth = 2; c.stroke();
  if (p > 0) { c.save(); c.strokeStyle = PAL.bg0; c.lineWidth = 2.4; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); const P = [[x + 5, y + 10.5], [x + 8.7, y + 14.2], [x + 15, y + 6.6]], l1 = Math.hypot(3.7, 3.7), l2 = Math.hypot(6.3, 7.6), d = p * (l1 + l2);
    c.moveTo(...P[0]); if (d <= l1) c.lineTo(P[0][0] + (P[1][0] - P[0][0]) * d / l1, P[0][1] + (P[1][1] - P[0][1]) * d / l1); else { c.lineTo(...P[1]); const u = (d - l1) / l2; c.lineTo(P[1][0] + (P[2][0] - P[1][0]) * u, P[1][1] + (P[2][1] - P[1][1]) * u); } c.stroke(); c.restore(); }
}
const row = (c, label, y, ox) => { T(c, label, 124 + ox, y + 5, 15, PAL.ink, 500); c.fillStyle = PAL.line; c.fillRect(124 + ox, y + 22, 392, 1); };

function panel(c, i, ox, al, st) {
  if (al <= 0) return; c.save(); c.globalAlpha *= al;
  if (i === 0) { row(c, '푸시 알림', 152, ox); sw(c, 494 + ox, 152, 1, 0); row(c, '이메일 요약', 200, ox); sw(c, 494 + ox, 200, 0, 0); row(c, '방해 금지 시간', 248, ox); sw(c, 494 + ox, 248, 1, 0);
    T(c, '밤 11시부터 아침 7시까지', 124 + ox, 296, 12, PAL.muted); }
  else if (i === 1) {
    row(c, '다크 모드', 152, ox); sw(c, 494 + ox, 152, st.sw, st.press);
    T(c, '표시 항목', 124 + ox, 206, 12, PAL.muted, 600);
    [['제목', 1], ['본문 요약', st.ck], ['시간', 1]].forEach(([s, p], k) => { const y = 218 + k * 32; ck(c, 124 + ox, y, p); T(c, s, 154 + ox, y + 15, 14, PAL.ink, 500); });
    const bg = mix([232, 241, 234], [10, 20, 15], st.sw), fg = mix([196, 214, 203], [40, 62, 50], st.sw);   // 예시 화면(스위치에 따라 밝음↔어두움)
    drop(c, 392 + ox, 196, 124, 108, 10, 3, 6, .4); rr(c, 392 + ox, 196, 124, 108, 10); c.fillStyle = rgb(bg); c.fill(); c.strokeStyle = 'rgba(255,255,255,.14)'; c.lineWidth = 1; c.stroke();
    T(c, '예시 화면', 404 + ox, 216, 11, rgb(mix([70, 100, 84], [160, 190, 172], st.sw)), 600);
    [0, 1, 2].forEach((k) => { rr(c, 404 + ox, 228 + k * 18, k === 1 ? 70 : 100, 9, 4.5); c.fillStyle = rgb(k === 0 ? mix([61, 170, 120], [127, 224, 168], st.sw) : fg); c.fill(); });
    if (st.ck > 0) { rr(c, 404 + ox, 284 - 6, 50 * st.ck, 8, 4); c.fillStyle = rgb(mix([150, 180, 162], [70, 100, 84], st.sw)); c.fill(); }
  } else { row(c, '이름', 152, ox); T(c, '드림', 516 + ox, 157, 14, PAL.muted, 500, 'right'); row(c, '이메일', 200, ox); T(c, 'user@example.com', 516 + ox, 205, 13, PAL.muted, 500, 'right', MONO); row(c, '비밀번호 변경', 248, ox); }
  c.restore();
}

function cursor(c, x, y, sc) {
  c.save(); c.translate(x, y); c.scale(sc, sc);
  const P = [[0, 0], [0, 17], [4.4, 13.2], [7.4, 20], [10, 18.9], [7, 12.2], [12.6, 12.2]];
  c.beginPath(); P.forEach(([a, b], i) => i ? c.lineTo(a, b) : c.moveTo(a, b)); c.closePath(); c.fillStyle = PAL.ink; c.fill(); c.lineWidth = 1.2; c.strokeStyle = PAL.bg0; c.lineJoin = 'round'; c.stroke(); c.restore();
}
const lerp2 = (a, b, p) => [lerp(a[0], b[0], p), lerp(a[1], b[1], p)];
function curPos(t) {   // 가상 커서 경로: 시작 → 탭 → 스위치 → 체크박스(곡선 + 감속)
  const A = [584, 46], B = [TX[1] + 6, 88], C = [498, 158], D = [134, 262];
  const seg1 = E.inOutC(seg(t, .45, 1.2)), seg2 = E.inOutC(seg(t, 1.6, 2.8)), seg3 = E.inOutC(seg(t, 3.3, 3.9));
  const bow = (p, q, u, k) => [lerp(p[0], q[0], u) + Math.sin(u * Math.PI) * k, lerp(p[1], q[1], u) - Math.sin(u * Math.PI) * k];
  if (t < 1.6) return bow(A, B, seg1, 18); if (t < 3.3) return bow(B, C, seg2, 22); return bow(C, D, seg3, -24);
}

const demo = {
  dur: 5.2, rest: 4.6, noCompare: false, levels: 4,
  mount(sp) {
    const cv = el('canvas', null, sp); cv.width = 1280; cv.height = 720; cv.style.cssText = 'position:absolute;left:0;top:0;width:640px;height:360px';
    return { c: cv.getContext('2d'), grain: grainTile(5) };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 4 : lv);   // 1 = 즉시 바뀜(커서만), 2 = + 밑줄 이동, 3 = + 내용 겹쳐 바뀜, 4 = + 스위치·체크 움직임과 포커스 링
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    c.fillStyle = lg(c, 0, 0, 0, 360, [[0, PAL.bg0], [1, PAL.bg1]]); c.fillRect(0, 0, 640, 360);
    const gl = c.createRadialGradient(320, 190, 10, 320, 190, 300); gl.addColorStop(0, 'rgba(127,224,168,.14)'); gl.addColorStop(1, 'rgba(127,224,168,0)'); c.fillStyle = gl; c.fillRect(0, 0, 640, 360);
    drop(c, X0, Y0, CW, CH, 16, 12, 22, .6);
    rr(c, X0, Y0, CW, CH, 16); c.fillStyle = lg(c, 0, Y0, 0, Y0 + CH, [[0, '#1a2e24'], [1, PAL.surface]]); c.fill(); c.strokeStyle = 'rgba(255,255,255,.12)'; c.lineWidth = 1; c.stroke();
    c.fillStyle = PAL.line; c.fillRect(X0 + 12, Y0 + 52, CW - 24, 1);
    // 탭 선택 진행도
    const raw = seg(t, T_TAB, T_TAB + TAB_MS), q = L >= 2 ? E.outC(raw) : (t >= T_TAB ? 1 : 0), cp = L >= 3 ? raw : (t >= T_TAB ? 1 : 0);
    TABS.forEach((s2, i) => { const on = i === 0 ? 1 - q : (i === 1 ? q : 0), col = mix([134, 160, 145], [232, 241, 234], on);
      T(c, s2, TX[i], Y0 + 34, 15, rgb(col), on > .5 ? 700 : 500, 'center'); });
    const ix = lerp(TX[0], TX[1], q), iw = 54;
    rr(c, ix - iw / 2, Y0 + 50, iw, 3, 1.5); c.fillStyle = PAL.accent; c.fill();
    // 스위치·체크 진행도
    const swp = L >= 4 ? E.outC(seg(t, T_SW, T_SW + SW_MS)) : (t >= T_SW ? 1 : 0), ckp = L >= 4 ? E.outC(seg(t, T_CK, T_CK + SW_MS)) : (t >= T_CK ? 1 : 0);
    const press = L >= 4 ? Math.max(0, 1 - Math.abs(t - (T_SW + .05)) / .12) : 0;
    const st = { sw: swp, ck: ckp, press };
    const pe = L >= 3 ? E.outC(cp) : cp;
    panel(c, 0, -SLIDE * pe * (L >= 3 ? 1 : 0), L >= 3 ? 1 - seg(cp, 0, .6) : 1 - cp, st);
    panel(c, 1, SLIDE * (1 - pe) * (L >= 3 ? 1 : 0), L >= 3 ? seg(cp, .4, 1) : cp, st);
    if (L >= 4 && t > T_CK) { const r = Math.min(1, seg(t, T_CK, T_CK + .15)); rr(c, 120, 214 + 32, 28, 28, 7); c.strokeStyle = `rgba(232,210,122,${r.toFixed(2)})`; c.lineWidth = 2; c.stroke();
      T(c, '키보드: Tab 키로 이동, 스페이스바로 켜고 끄기', X0 + CW / 2, Y0 + CH - 12, 11.5, PAL.muted, 500, 'center'); }
    // 커서·눌림 물결
    if (L >= 1) {
      const p = curPos(t); let sc = 1; [T_TAB, T_SW, T_CK].forEach((k) => { if (t > k - .1 && t < k + .25) sc = 1 - .14 * Math.sin(Math.PI * seg(t, k - .1, k + .25)); });
      if (L >= 4) [T_TAB, T_SW, T_CK].forEach((k) => { const u = seg(t, k, k + .45); if (u > 0 && u < 1) { c.beginPath(); c.arc(p[0], p[1], 4 + 16 * E.outC(u), 0, 6.2832); c.strokeStyle = `rgba(232,241,234,${(.6 * (1 - u)).toFixed(2)})`; c.lineWidth = 1.5; c.stroke(); } });
      cursor(c, p[0], p[1], sc);
    }
    c.globalCompositeOperation = 'overlay'; c.globalAlpha = .06; c.fillStyle = c.createPattern(s.grain, 'repeat'); c.fillRect(0, 0, 640, 360); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
    const names = ['연출 전', '즉시 바뀜', '밑줄 이동', '내용 겹침', '스위치 체크'];
    c.save(); c.font = `500 12px ${SANS}`; if ('letterSpacing' in c) c.letterSpacing = '2px'; c.textBaseline = 'middle';
    c.fillStyle = PAL.line; c.fillRect(9, 16, 1, 300);
    let yy = 18; names.forEach((n, i) => { const w = c.measureText(n).width; c.save(); c.translate(24, yy); c.rotate(Math.PI / 2); c.fillStyle = i === L ? PAL.ink : PAL.muted; c.globalAlpha = i === L ? 1 : .85; c.fillText(n, 0, 0); c.restore(); yy += w + 16; });
    c.restore();
  },
};
export default demo;
