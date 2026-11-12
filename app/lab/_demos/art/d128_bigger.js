/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/type-hierarchy/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 같은 안내문을 "전부 같은 크기·같은 굵기" 에서 시작해, 크기 차이 → 굵기 차이 → 색 농도·간격 순서로 위계를 만든다. 화면은 시간 t 의 함수다.
const TITLE_PX = 56;              // 제목 글자 크기(px). 본문은 15px
const ALL_BOLD = 0;               // 1 이면 본문·보조 글까지 전부 굵게(굵은 글이 많아져 위계가 무너진다)
const FLAT = 17;                  // 연출 전: 모든 줄의 공통 크기(px)
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, p) => 'rgb(' + hex(a).map((v, i) => Math.round(lerp(v, hex(b)[i], p))).join(',') + ')';
const LINES = [
  { k: '제목', txt: '여름 음악 축제', px: TITLE_PX, w2: 400, fam: "'Black Han Sans'", c: '#ffffff', mb: 4 },
  { k: '부제', txt: '7월 19일 토요일 · 저녁 6시', px: 20, w2: 700, fam: "'IBM Plex Sans KR'", c: '#ffb36b', mb: 18 },
  { k: '본문', txt: '한강공원 잔디마당에서 열리는 무료 공연입니다. 돗자리를 챙겨 오세요.', px: 15, w2: ALL_BOLD ? 700 : 400, fam: "'IBM Plex Sans KR'", c: '#c4cbdb', mb: 16 },
  { k: '보조', txt: '신청 마감 7월 10일', px: 13, w2: ALL_BOLD ? 700 : 500, fam: "'IBM Plex Sans KR'", c: '#8d97ad', mb: 0 },
];
const FLATC = '#e6eaf3', FLAT_MB = 10;

const demo = {
  dur: 4.4, rest: 3.6, noCompare: false, levels: 4,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: 'linear-gradient(160deg,#0b0f1a 0%,#1a2238 100%)', overflow: 'hidden' });
    const gr = el('div', null, bg);
    box(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.06', mixBlendMode: 'overlay' });
    const card = el('div', null, sp);
    box(card, { position: 'absolute', left: '28px', top: '70px', width: '584px', height: '248px', borderRadius: '14px', background: 'linear-gradient(160deg,#222c47 0%,#151c31 100%)', border: '1px solid rgba(255,255,255,.12)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.14), 0 18px 32px rgba(0,0,0,.45)' });
    const col = el('div', null, card);
    box(col, { position: 'absolute', left: '28px', top: '26px', width: '350px', wordBreak: 'keep-all' });
    const lines = LINES.map((L) => {
      const d = el('div', null, col, L.txt);
      box(d, { lineHeight: '1.35' });
      return d;
    });
    const spec = el('div', null, card);
    box(spec, { position: 'absolute', left: '400px', top: '26px', width: '164px', borderLeft: '1px solid rgba(255,255,255,.14)', paddingLeft: '14px' });
    const rows = LINES.map((L) => {
      const r = el('div', null, spec);
      box(r, { marginBottom: '14px', color: '#9aa4ba', font: "500 11px/1.5 'JetBrains Mono',monospace" });
      el('div', null, r, L.k);
      const v = el('div', null, r);
      box(v, { color: '#e6eaf3' });
      return v;
    });
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', top: '14px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.66)', color: '#fff', font: "500 15px/1 'IBM Plex Sans KR',sans-serif" });
    return { lines, rows, pill };
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
      box(d, { fontFamily: fam + ',sans-serif', fontSize: px.toFixed(1) + 'px', fontWeight: String(w), color: mix(FLATC, ln.c, pc), marginBottom: lerp(FLAT_MB, ln.mb, pc).toFixed(1) + 'px' });
      s.rows[i].textContent = px.toFixed(0) + 'px · ' + (i === 0 && heavy ? 'Black Han Sans' : '굵기 ' + w);
    });
    const names = ['', '1단계 · 크기만 다르게', '2단계 · 굵기까지 다르게', '3단계 · 색 농도와 간격까지'];
    s.pill.textContent = L === 0 ? '연출 전 · 모든 줄이 같은 크기·굵기' : names[Math.min(stage, L)];
  },
};
export default demo;
