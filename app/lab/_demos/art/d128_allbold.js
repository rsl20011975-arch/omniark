/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/type-hierarchy/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 같은 안내문을 "전부 같은 크기·같은 굵기" 에서 시작해, 크기 차이 → 굵기 차이 → 색 농도·간격 순서로 위계를 만든다. 화면은 시간 t 의 함수다.
const PAL = { bg0: '#e6f2ec', bg1: '#d4e8de', ink: '#0f2a22', muted: '#4f6e63', accent: '#0f9d6b', accent2: '#c2410c', surface: '#f6fbf8', line: '#b5cfc3' };
const TITLE_PX = 40;              // 제목 글자 크기(px). 본문은 15px
const ALL_BOLD = 1;               // 1 이면 본문·보조 글까지 전부 굵게(굵은 글이 많아져 위계가 무너진다)
const FLAT = 17;                  // 연출 전: 모든 줄의 공통 크기(px)
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mixH = (a, b, p) => '#' + hex(a).map((v, i) => Math.round(lerp(v, hex(b)[i], p)).toString(16).padStart(2, '0')).join('');
const BODYC = mixH(PAL.ink, PAL.surface, 0.18);
const FLATC = mixH(PAL.ink, PAL.surface, 0.1), FLAT_MB = 10;
const LINES = [
  { k: '제목', txt: '여름 음악 축제', px: TITLE_PX, w2: 400, fam: "'Black Han Sans'", c: PAL.ink, mb: 4 },
  { k: '부제', txt: '7월 19일 토요일 · 저녁 6시', px: 20, w2: 700, fam: "'IBM Plex Sans KR'", c: PAL.accent2, mb: 18 },
  { k: '본문', txt: '한강공원 잔디마당에서 열리는 무료 공연입니다. 돗자리를 챙겨 오세요.', px: 15, w2: ALL_BOLD ? 700 : 400, fam: "'IBM Plex Sans KR'", c: BODYC, mb: 16 },
  { k: '보조', txt: '신청 마감 7월 10일', px: 13, w2: ALL_BOLD ? 700 : 500, fam: "'IBM Plex Sans KR'", c: PAL.muted, mb: 0 },
];

const demo = {
  dur: 4.4, rest: 3.6, noCompare: false, levels: 4,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: `radial-gradient(60% 80% at 20% 0%, rgba(255,255,255,.55), rgba(255,255,255,0) 70%), linear-gradient(160deg,${PAL.bg0} 0%,${PAL.bg1} 100%)`, overflow: 'hidden' });
    const gr = el('div', null, bg);
    box(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.09', mixBlendMode: 'multiply' });
    const card = el('div', null, sp);
    box(card, { position: 'absolute', left: '28px', top: '70px', width: '584px', height: '248px', borderRadius: '14px', background: `linear-gradient(160deg,${mixH(PAL.surface, '#ffffff', 0.7)} 0%,${PAL.surface} 100%)`, border: `1px solid ${PAL.line}`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,.95), 0 2px 4px rgba(15,42,34,.08), 0 20px 34px -10px rgba(15,42,34,.28)' });
    const col = el('div', null, card);
    box(col, { position: 'absolute', left: '28px', top: '26px', width: '350px', wordBreak: 'keep-all' });
    const lines = LINES.map((L) => {
      const d = el('div', null, col, L.txt);
      box(d, { lineHeight: '1.35' });
      return d;
    });
    const spec = el('div', null, card);
    box(spec, { position: 'absolute', left: '400px', top: '26px', width: '164px', borderLeft: `1px solid ${PAL.line}`, paddingLeft: '14px' });
    const rows = LINES.map((L) => {
      const r = el('div', null, spec);
      box(r, { marginBottom: '14px', color: PAL.muted, font: "500 11px/1.5 'JetBrains Mono',monospace" });
      el('div', null, r, L.k);
      const v = el('div', null, r);
      box(v, { color: PAL.ink });
      return v;
    });
    // 이름표(numeral): 큰 단계 숫자 + 옆에 13px 설명
    const tag = el('div', null, sp);
    box(tag, { position: 'absolute', left: '28px', top: '14px', display: 'flex', alignItems: 'center', gap: '12px' });
    const num = el('div', null, tag);
    box(num, { font: "400 40px/1 'Black Han Sans',sans-serif", color: PAL.accent, minWidth: '26px' });
    const pill = el('div', null, tag);
    box(pill, { color: PAL.ink, font: "500 13px/1.3 'IBM Plex Sans KR',sans-serif" });
    return { lines, rows, pill, num };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv - 1);   // 단계 1 은 기법을 쓰지 않은 기본 모습(= 연출 전)   // 1 = 크기, 2 = + 굵기, 3 = + 색 농도·간격
    const stage = t < 1.5 ? 1 : (t < 2.6 ? 2 : 3);
    LINES.forEach((ln, i) => {
      const ps = L >= 1 ? E.outC(seg(t, .5 + .12 * i, 1.3 + .12 * i)) : 0;
      const pw = L >= 2 ? E.outC(seg(t, 1.6 + .12 * i, 2.3 + .12 * i)) : 0;
      const pc = L >= 3 ? E.outC(seg(t, 2.7 + .12 * i, 3.4 + .12 * i)) : 0;
      const px = lerp(FLAT, ln.px, ps);
      const heavy = pw > .5;
      const fam = i === 0 && heavy ? ln.fam : "'IBM Plex Sans KR'";
      const w = heavy ? ln.w2 : 400;
      const d = s.lines[i];
      box(d, { fontFamily: fam + ',sans-serif', fontSize: px.toFixed(1) + 'px', fontWeight: String(w), color: mixH(FLATC, ln.c, pc), marginBottom: lerp(FLAT_MB, ln.mb, pc).toFixed(1) + 'px' });
      s.rows[i].textContent = px.toFixed(0) + 'px / ' + (i === 0 && heavy ? 'Black Han Sans' : '굵기 ' + w);
    });
    const names = ['', '크기만 다르게', '굵기까지 다르게', '색 농도와 간격까지'];
    const cur = Math.min(stage, L);
    s.num.textContent = String(L === 0 ? 0 : cur);
    s.pill.textContent = L === 0 ? '연출 전: 모든 줄이 같은 크기와 굵기' : names[cur];
  },
};
export default demo;
