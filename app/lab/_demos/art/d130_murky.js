/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/type-contrast/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 주황 배너 위의 흰 글씨(대비 부족)를 글자색만 바꿔 WCAG 기준(큰 글씨 3:1 · 작은 글씨 4.5:1)에 맞춘다. 대비는 코드에서 실제로 계산해 보여 준다.
const HEAD_COL = "#9a5a38";       // 1단계에서 제목 글자가 바뀌는 색
const NOTE_DIM = "#5a3a22";       // 3단계에서 보조 문구가 바뀌는 색(조금 연하게)
const HEAD_PX = 34;               // 제목 글자 크기(px). 24px 이상(굵으면 18.5px 이상)이면 큰 글씨로 본다
const NOTE_PX = 17;               // 보조 문구 글자 크기(px)
const BG = ["#ff9a5a", "#ffd27a"]; // 배너 바탕 그라디언트의 양 끝 색(글자가 올라앉는 가장 어두운 곳·밝은 곳)
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mixA = (a, b, p) => rgb(a).map((v, i) => lerp(v, rgb(b)[i], p));
const css = (c) => 'rgb(' + c.map(Math.round).join(',') + ')';
const lin = (v) => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
const lum = (c) => .2126 * lin(c[0]) + .7152 * lin(c[1]) + .0722 * lin(c[2]);
const ratio = (c1, c2) => { const a = lum(c1), b = lum(c2); return (Math.max(a, b) + .05) / (Math.min(a, b) + .05); };
// 글자가 올라앉는 배경의 양 끝 중 더 나쁜 쪽 대비
const worst = (c) => Math.min(...BG.map((b) => ratio(c, rgb(b))));
const need = (px, bold) => (px >= 24 || (px >= 18.5 && bold)) ? 3 : 4.5;
const WHITE = '#ffffff';

const demo = {
  dur: 4.2, rest: 3.8, noCompare: false, levels: 4,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: 'linear-gradient(160deg,#0b0f1a 0%,#1a2238 100%)', overflow: 'hidden' });
    const gr = el('div', null, bg);
    box(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.06', mixBlendMode: 'overlay' });
    const ban = el('div', null, sp);
    box(ban, { position: 'absolute', left: '28px', top: '62px', width: '372px', height: '232px', borderRadius: '16px', background: `linear-gradient(120deg,${BG[0]} 0%,${BG[1]} 100%)`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,.5), 0 18px 32px rgba(0,0,0,.5)', overflow: 'hidden' });
    const gl = el('div', null, ban);
    box(gl, { position: 'absolute', inset: '0', background: 'radial-gradient(circle at 85% 12%, rgba(255,255,255,.35), transparent 50%)' });
    const gg = el('div', null, ban);
    box(gg, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.07', mixBlendMode: 'multiply' });
    const head = el('div', null, ban, '오늘만 무료 배송');
    box(head, { position: 'absolute', left: '28px', top: '48px', font: `400 ${HEAD_PX}px/1.2 'Black Han Sans',sans-serif`, whiteSpace: 'nowrap' });
    const note = el('div', null, ban, '5만 원 이상 주문 시<br>일부 지역 제외');
    box(note, { position: 'absolute', left: '28px', top: '108px', font: `500 ${NOTE_PX}px/1.5 'IBM Plex Sans KR',sans-serif`, whiteSpace: 'nowrap' });
    const hexl = el('div', null, sp);
    box(hexl, { position: 'absolute', left: '28px', top: '304px', font: "500 11px/1.4 'JetBrains Mono',monospace", color: '#9aa4ba' });
    const meters = [['제목', 0], ['보조 문구', 1]].map(([k, i]) => {
      const m = el('div', null, sp);
      box(m, { position: 'absolute', left: '424px', top: (66 + i * 112) + 'px', width: '188px', height: '100px', borderRadius: '12px', background: 'linear-gradient(160deg,#222c47,#151c31)', border: '1px solid rgba(255,255,255,.12)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.12)' });
      const lab = el('div', null, m, k);
      box(lab, { position: 'absolute', left: '14px', top: '10px', font: "500 12px/1 'IBM Plex Sans KR',sans-serif", color: '#aeb7cb' });
      const num = el('div', null, m);
      box(num, { position: 'absolute', left: '14px', top: '26px', font: "500 28px/1 'JetBrains Mono',monospace", color: '#fff' });
      const track = el('div', null, m);
      box(track, { position: 'absolute', left: '14px', top: '64px', width: '160px', height: '14px', borderRadius: '7px', background: 'rgba(255,255,255,.12)' });
      const fill = el('div', null, track);
      box(fill, { position: 'absolute', left: '0', top: '0', bottom: '0', borderRadius: '7px' });
      const tick = el('div', null, track);
      box(tick, { position: 'absolute', top: '-4px', width: '2px', height: '22px', background: '#fff' });
      const needEl = el('div', null, m);
      box(needEl, { position: 'absolute', left: '14px', top: '84px', font: "500 11px/1 'JetBrains Mono',monospace", color: '#9aa4ba' });
      const badge = el('div', null, m);
      box(badge, { position: 'absolute', right: '12px', top: '10px', padding: '3px 9px', borderRadius: '999px', font: "700 11px/1.2 'IBM Plex Sans KR',sans-serif" });
      return { num, fill, tick, need: needEl, badge };
    });
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', top: '14px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.66)', color: '#fff', font: "500 15px/1 'IBM Plex Sans KR',sans-serif" });
    return { head, note, hexl, meters, pill };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv - 1);   // 단계 1 은 기법을 쓰지 않은 기본 모습(= 연출 전)   // 1 = 제목 글자색, 2 = + 보조 문구 글자색, 3 = + 보조 문구 살짝 연하게
    const hc = L >= 1 ? mixA(WHITE, HEAD_COL, E.outC(seg(t, .6, 1.4))) : rgb(WHITE);
    let nc = rgb(WHITE);
    if (L >= 2) nc = mixA(WHITE, '#2a1208', E.outC(seg(t, 1.8, 2.5)));
    if (L >= 3) nc = mixA('#2a1208', NOTE_DIM, E.outC(seg(t, 2.9, 3.6)));
    s.head.style.color = css(hc);
    s.note.style.color = css(nc);
    const items = [[hc, need(HEAD_PX, true), HEAD_PX], [nc, need(NOTE_PX, false), NOTE_PX]];
    items.forEach(([c, th, px], i) => {
      const r = worst(c), ok = r >= th, m = s.meters[i];
      m.num.textContent = r.toFixed(1) + ' : 1';
      m.num.style.color = ok ? '#ffffff' : '#ff9a8a';
      m.fill.style.width = (Math.min(1, r / 10) * 160).toFixed(1) + 'px';
      m.fill.style.background = ok ? 'linear-gradient(90deg,#3fbf7a,#7be0a6)' : 'linear-gradient(90deg,#e0503f,#ff8a78)';
      m.tick.style.left = (th / 10 * 160 - 1) + 'px';
      m.need.textContent = '기준 ' + th + ' : 1 (' + px + 'px)';
      m.badge.textContent = ok ? '통과' : '미달';
      m.badge.style.background = ok ? 'rgba(63,191,122,.2)' : 'rgba(224,80,63,.22)';
      m.badge.style.color = ok ? '#7be0a6' : '#ff9a8a';
    });
    s.hexl.textContent = '배경 ' + BG[0] + ' ~ ' + BG[1] + ' · 둘 중 나쁜 쪽 대비';
    const stage = t < 1.7 ? 1 : (t < 2.8 ? 2 : 3);
    const names = ['', '1단계 · 제목 글자색을 바꿈', '2단계 · 보조 문구도 바꿈', '3단계 · 보조 문구를 살짝 연하게'];
    s.pill.textContent = L === 0 ? '연출 전 · 주황 배경에 흰 글씨' : names[Math.min(stage, L)];
  },
};
export default demo;
