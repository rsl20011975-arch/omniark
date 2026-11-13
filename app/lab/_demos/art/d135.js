/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/korean-line-break/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 같은 안내문을 폭이 줄어드는 두 칸에 넣는다. 왼쪽은 word-break: normal(기본), 오른쪽은 단계마다 keep-all → overflow-wrap: anywhere → 제목 text-wrap: balance 를 더한다.
// 글자는 실제 CSS 가 적용된 DOM 글자이고, 단어 중간에서 끊긴 곳은 글자별 위치를 재서 주황 표시로 찍는다. 화면은 시간 t 의 함수다.
const PAL = { bg0: '#1f3a8a', bg1: '#172a63', ink: '#f3f6ff', muted: '#aebcf0', accent: '#ffd166', accent2: '#7fe0ff', surface: '#1b3274', line: '#3d5bb5' };
const WARN = '#ff8a78';           // 단어 중간 끊김·넘침을 나타내는 경고색(의미색)
const MIN_W = 160;                // 폭이 가장 좁아졌을 때 글 상자 폭(px)
const BODY_PX = 13;               // 본문 글자 크기(px)
const MAX_W = 254;                // 폭이 줄기 전 글 상자 폭(px)
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgba = (h, a) => 'rgba(' + hex(h).join(',') + ',' + a + ')';
const mixH = (a, b, p) => '#' + hex(a).map((v, i) => Math.round(lerp(v, hex(b)[i], p)).toString(16).padStart(2, '0')).join('');
const HEAD = '개인정보처리방침 개정 안내 및 동의 요청';
const BODY = '저희 서비스는 개인정보처리방침을 개정했습니다. 자세한 내용은 아래 주소에서 확인하세요.';
const URL_ = 'https://example.com/privacy/2026';
const SIDES = [{ name: 'word-break: normal', x: 28 }, { name: 'word-break: keep-all', x: 326 }];

const demo = {
  dur: 4.4, rest: 2.6, noCompare: false, levels: 4,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: `radial-gradient(70% 90% at 15% 0%, ${rgba(PAL.accent2, 0.15)}, rgba(0,0,0,0) 65%), linear-gradient(160deg,${PAL.bg0} 0%,${PAL.bg1} 100%)`, overflow: 'hidden' });
    const gr = el('div', null, bg);
    box(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.07', mixBlendMode: 'overlay' });
    const panels = SIDES.map((S) => {
      const p = el('div', null, sp);
      box(p, { position: 'absolute', left: S.x + 'px', top: '52px', width: '286px', height: '292px', borderRadius: '14px', background: `linear-gradient(160deg,${mixH(PAL.surface, PAL.ink, 0.1)} 0%,${PAL.surface} 100%)`, border: `1px solid ${PAL.line}`, boxShadow: `inset 0 1px 0 ${rgba(PAL.ink, 0.2)}, 0 2px 4px rgba(6,12,40,.35), 0 20px 30px -8px rgba(6,12,40,.6)`, overflow: 'hidden' });
      const cap = el('div', null, p);
      box(cap, { position: 'absolute', left: '16px', top: '12px', right: '12px', font: "500 11px/1.4 'JetBrains Mono',monospace", color: PAL.muted, whiteSpace: 'pre' });
      const b = el('div', null, p);
      box(b, { position: 'absolute', left: '16px', top: '56px', boxSizing: 'content-box', borderRight: `2px solid ${PAL.accent}`, background: rgba(PAL.ink, 0.05), paddingBottom: '8px' });
      const h = el('div', null, b, HEAD);
      box(h, { font: "700 17px/1.4 'IBM Plex Sans KR',sans-serif", color: PAL.ink, marginBottom: '8px' });
      const pr = el('div', null, b, BODY);
      box(pr, { font: `400 ${BODY_PX}px/1.55 'IBM Plex Sans KR',sans-serif`, color: mixH(PAL.ink, PAL.surface, 0.12), marginBottom: '8px' });
      const u = el('div', null, b, URL_);
      box(u, { font: "500 11px/1.5 'JetBrains Mono',monospace", color: PAL.accent });
      const marks = [];
      for (let k = 0; k < 14; k++) {
        const m = el('div', null, b);
        box(m, { position: 'absolute', width: '3px', height: '16px', borderRadius: '2px', background: WARN, boxShadow: `0 0 6px ${rgba(WARN, 0.9)}`, opacity: '0' });
        marks.push(m);
      }
      const st = el('div', null, p);
      box(st, { position: 'absolute', left: '16px', top: '30px', right: '12px', font: "500 11px/1.5 'JetBrains Mono',monospace", color: PAL.ink, whiteSpace: 'pre' });
      return { cap, b, h, pr, u, marks, st };
    });
    // 이름표(vertical): 왼쪽 가장자리 세로쓰기. 지금 단계만 ink, 나머지는 muted
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '8px', top: '52px', height: '300px', writingMode: 'vertical-rl', display: 'flex', gap: '14px', font: "500 12px/1 'IBM Plex Sans KR',sans-serif", letterSpacing: '.14em' });
    const items = ['연출 전', 'keep-all', 'anywhere', 'balance'].map((k) => el('span', null, pill, k));
    return { panels, pill, items };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv - 1);   // 단계 1 은 기법을 쓰지 않은 기본 모습(= 연출 전)   // 1 = keep-all, 2 = + overflow-wrap: anywhere, 3 = + 제목 text-wrap: balance
    const w = t < .4 ? MAX_W : (t < 2 ? lerp(MAX_W, MIN_W, E.inOutC(seg(t, .4, 2))) : (t < 3.2 ? MIN_W : lerp(MIN_W, MAX_W, E.inOutC(seg(t, 3.2, 4.2)))));
    s.panels.forEach((P, i) => {
      const right = i === 1;
      const brk = right && L >= 1 ? 'keep-all' : 'normal';
      const ow = right && L >= 2 ? 'anywhere' : 'normal';
      const bal = right && L >= 3 ? 'balance' : 'wrap';
      P.b.style.width = w.toFixed(1) + 'px';
      [P.h, P.pr, P.u].forEach((e) => { e.style.wordBreak = brk; e.style.overflowWrap = ow; });
      P.h.style.textWrap = bal;
      P.cap.textContent = !right ? 'word-break: normal' : (L >= 2 ? 'keep-all + anywhere' + (L >= 3 ? ' + balance' : '') : 'word-break: ' + brk);
      // 제목·본문 글자별 위치를 재서, 줄이 바뀌는 곳이 띄어쓰기가 아닌 단어 중간이면 표시한다
      const br = P.b.getBoundingClientRect(), sc = br.width / P.b.offsetWidth || 1;
      const r = document.createRange();
      let cnt = 0;
      [P.h, P.pr].forEach((e) => {
        const node = e.firstChild, txt = node.data;
        let prev = null;
        for (let k = 0; k < txt.length; k++) {
          r.setStart(node, k); r.setEnd(node, k + 1);
          const q = r.getClientRects()[0];
          if (!q) continue;
          if (prev && q.top - prev.top > 4 && txt[k - 1] !== ' ' && txt[k] !== ' ') {
            if (cnt < P.marks.length) { const m = P.marks[cnt]; m.style.left = ((prev.right - br.left) / sc + 1).toFixed(1) + 'px'; m.style.top = ((prev.top - br.top) / sc - 1).toFixed(1) + 'px'; }
            cnt++;
          }
          prev = q;
        }
      });
      P.marks.forEach((m, k) => { m.style.opacity = k < cnt ? '1' : '0'; });
      const over = P.u.scrollWidth > P.b.clientWidth + 1 || P.b.scrollWidth > P.b.clientWidth + 1;
      P.st.textContent = '폭 ' + w.toFixed(0) + 'px, 단어 중간 끊김 ' + cnt + '곳, 주소 ' + (over ? '넘침' : '정상');
      P.st.style.color = over ? '#ff9a8a' : PAL.ink;
    });
    s.items.forEach((it, k) => { it.style.color = k === L ? PAL.ink : PAL.muted; it.style.fontWeight = k === L ? '700' : '500'; });
  },
};
export default demo;
