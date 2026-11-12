/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/line-height-align/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 같은 문단을 "행간 1.0 · 가운데 정렬" 에서 시작해, 행간 → 정렬 → 제목 행간 순서로 읽기 좋게 고친다. 화면은 시간 t 의 함수다.
const LH = 1.7;                   // 본문 행간(글자 크기의 몇 배인가). 연출 전은 1.0
const JUSTIFY = 1;                // 1 이면 2단계에서 왼쪽 정렬 대신 양쪽 정렬(justify)을 쓴다
const BODY_PX = 15;               // 본문 글자 크기(px)
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);
const TXT = '행간은 줄과 줄 사이의 간격입니다. 너무 좁으면 윗줄과 아랫줄이 붙어서 읽다가 줄을 놓치기 쉽고, 너무 넓으면 한 덩어리로 보이지 않습니다. 본문은 글자 크기의 1.5배 안팎에서 시작해 보세요.';
const COL = { position: 'absolute', left: '0', top: '0', width: '344px', fontSize: BODY_PX + 'px', color: '#d5dbe8', wordBreak: 'keep-all', fontFamily: "'IBM Plex Sans KR',sans-serif", fontWeight: '400' };

const demo = {
  dur: 4.6, rest: 3.9, noCompare: false, levels: 4,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: 'linear-gradient(160deg,#0b0f1a 0%,#1a2238 100%)', overflow: 'hidden' });
    const gr = el('div', null, bg);
    box(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.06', mixBlendMode: 'overlay' });
    const card = el('div', null, sp);
    box(card, { position: 'absolute', left: '28px', top: '58px', width: '584px', height: '276px', borderRadius: '14px', background: 'linear-gradient(160deg,#222c47 0%,#151c31 100%)', border: '1px solid rgba(255,255,255,.12)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.14), 0 18px 32px rgba(0,0,0,.45)' });
    const title = el('div', null, card, '읽기 편한 글을<br>만드는 두 가지');
    box(title, { position: 'absolute', left: '28px', top: '18px', width: '344px', font: "400 24px 'Black Han Sans',sans-serif", color: '#fff', wordBreak: 'keep-all' });
    const wrap = el('div', null, card);
    box(wrap, { position: 'absolute', left: '28px', width: '344px' });
    const guides = [];
    for (let i = 0; i < 12; i++) {
      const g = el('div', null, wrap);
      box(g, { position: 'absolute', left: '-8px', width: '360px', height: '1px', background: 'rgba(110,200,255,.28)' });
      guides.push(g);
    }
    const pa = el('div', null, wrap, TXT);
    box(pa, COL); pa.style.position = 'relative'; pa.style.textAlign = 'center';
    const pb = el('div', null, wrap, TXT);
    box(pb, COL); pb.style.textAlign = JUSTIFY ? 'justify' : 'left';
    const edge = el('div', null, wrap);
    box(edge, { position: 'absolute', left: '-6px', top: '0', width: '2px', background: 'linear-gradient(180deg,#ffb36b,#ff6a4d)', borderRadius: '2px', opacity: '0' });
    const spec = el('div', null, card);
    box(spec, { position: 'absolute', left: '412px', top: '22px', width: '150px', borderLeft: '1px solid rgba(255,255,255,.14)', paddingLeft: '14px', font: "500 11px/1.5 'JetBrains Mono',monospace", color: '#9aa4ba' });
    const rows = ['본문 line-height', '본문 text-align', '제목 line-height'].map((k) => {
      const r = el('div', null, spec); box(r, { marginBottom: '16px' });
      el('div', null, r, k);
      const v = el('div', null, r); box(v, { color: '#e6eaf3', fontSize: '13px' });
      return v;
    });
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', top: '14px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.66)', color: '#fff', font: "500 15px/1 'IBM Plex Sans KR',sans-serif" });
    return { title, wrap, guides, pa, pb, edge, rows, pill };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv - 1);   // 단계 1 은 기법을 쓰지 않은 기본 모습(= 연출 전)   // 1 = 행간, 2 = + 정렬, 3 = + 제목 행간
    const lh = L >= 1 ? lerp(1.0, LH, E.outC(seg(t, .6, 1.7))) : 1.0;
    const pc = L >= 2 ? E.outC(seg(t, 2.1, 2.8)) : 0;
    const tl = L >= 3 ? lerp(1.7, 1.2, E.outC(seg(t, 3.1, 3.8))) : 1.7;
    s.title.style.lineHeight = tl.toFixed(3);
    const titleH = 24 * tl * 2;
    s.wrap.style.top = (18 + titleH + 10).toFixed(1) + 'px';
    [s.pa, s.pb].forEach((p) => { p.style.lineHeight = lh.toFixed(3); });
    s.pa.style.opacity = (1 - pc).toFixed(3);
    s.pb.style.opacity = pc.toFixed(3);
    const h = s.pa.offsetHeight, pitch = lh * BODY_PX;
    s.guides.forEach((g, i) => {
      const y = i * pitch;
      g.style.top = y.toFixed(1) + 'px';
      g.style.opacity = y <= h + .5 ? '1' : '0';
    });
    s.edge.style.height = h + 'px';
    s.edge.style.opacity = (pc * (JUSTIFY ? 0 : 1)).toFixed(2);
    s.rows[0].textContent = lh.toFixed(2);
    s.rows[1].textContent = pc > .5 ? (JUSTIFY ? 'justify' : 'left') : 'center';
    s.rows[2].textContent = tl.toFixed(2);
    const stage = t < 1.9 ? 1 : (t < 3.0 ? 2 : 3);
    const names = ['', '1단계 · 행간을 1.0 → ' + LH.toFixed(1), '2단계 · 정렬을 바꿈', '3단계 · 제목은 촘촘하게'];
    s.pill.textContent = L === 0 ? '연출 전 · 행간 1.0 · 가운데 정렬' : names[Math.min(stage, L)];
  },
};
export default demo;
