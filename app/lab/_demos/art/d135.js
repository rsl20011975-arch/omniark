/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/korean-line-break/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 같은 안내문을 폭이 줄어드는 두 칸에 넣는다. 왼쪽은 word-break: normal(기본), 오른쪽은 단계마다 keep-all → overflow-wrap: anywhere → 제목 text-wrap: balance 를 더한다.
// 글자는 실제 CSS 가 적용된 DOM 글자이고, 단어 중간에서 끊긴 곳은 글자별 위치를 재서 주황 표시로 찍는다. 화면은 시간 t 의 함수다.
const MIN_W = 160;                // 폭이 가장 좁아졌을 때 글 상자 폭(px)
const BODY_PX = 13;               // 본문 글자 크기(px)
const MAX_W = 254;                // 폭이 줄기 전 글 상자 폭(px)
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);
const HEAD = '개인정보처리방침 개정 안내 및 동의 요청';
const BODY = '저희 서비스는 개인정보처리방침을 개정했습니다. 자세한 내용은 아래 주소에서 확인하세요.';
const URL_ = 'https://example.com/privacy/2026';
const SIDES = [{ name: 'word-break: normal', x: 28 }, { name: 'word-break: keep-all', x: 326 }];

const demo = {
  dur: 4.4, rest: 2.6, noCompare: false, levels: 4,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: 'linear-gradient(160deg,#0b0f1a 0%,#1a2238 100%)', overflow: 'hidden' });
    const gr = el('div', null, bg);
    box(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.06', mixBlendMode: 'overlay' });
    const panels = SIDES.map((S) => {
      const p = el('div', null, sp);
      box(p, { position: 'absolute', left: S.x + 'px', top: '52px', width: '286px', height: '292px', borderRadius: '14px', background: 'linear-gradient(160deg,#222c47 0%,#151c31 100%)', border: '1px solid rgba(255,255,255,.12)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.14), 0 16px 28px rgba(0,0,0,.42)', overflow: 'hidden' });
      const cap = el('div', null, p);
      box(cap, { position: 'absolute', left: '16px', top: '12px', right: '12px', font: "500 11px/1.4 'JetBrains Mono',monospace", color: '#9aa4ba', whiteSpace: 'pre' });
      const b = el('div', null, p);
      box(b, { position: 'absolute', left: '16px', top: '56px', boxSizing: 'content-box', borderRight: '2px solid #ffb36b', background: 'rgba(255,255,255,.04)', paddingBottom: '8px' });
      const h = el('div', null, b, HEAD);
      box(h, { font: "700 17px/1.4 'IBM Plex Sans KR',sans-serif", color: '#fff', marginBottom: '8px' });
      const pr = el('div', null, b, BODY);
      box(pr, { font: `400 ${BODY_PX}px/1.55 'IBM Plex Sans KR',sans-serif`, color: '#cfd6e6', marginBottom: '8px' });
      const u = el('div', null, b, URL_);
      box(u, { font: "500 11px/1.5 'JetBrains Mono',monospace", color: '#ffb36b' });
      const marks = [];
      for (let k = 0; k < 14; k++) {
        const m = el('div', null, b);
        box(m, { position: 'absolute', width: '3px', height: '16px', borderRadius: '2px', background: '#ff6a4d', boxShadow: '0 0 6px rgba(255,106,77,.9)', opacity: '0' });
        marks.push(m);
      }
      const st = el('div', null, p);
      box(st, { position: 'absolute', left: '16px', top: '30px', right: '12px', font: "500 11px/1.5 'JetBrains Mono',monospace", color: '#e6eaf3', whiteSpace: 'pre' });
      return { cap, b, h, pr, u, marks, st };
    });
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', top: '14px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.66)', color: '#fff', font: "500 15px/1 'IBM Plex Sans KR',sans-serif" });
    return { panels, pill };
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
      P.st.textContent = '폭 ' + w.toFixed(0) + 'px · 단어 중간 끊김 ' + cnt + '곳 · 주소 ' + (over ? '넘침' : '정상');
      P.st.style.color = over ? '#ff9a8a' : '#e6eaf3';
    });
    const names = ['연출 전 · 양쪽 모두 기본 줄바꿈(normal)', '1단계 · 오른쪽에 keep-all(단어 단위)', '2단계 · + overflow-wrap: anywhere(긴 주소)', '3단계 · + 제목 text-wrap: balance'];
    s.pill.textContent = names[L];
  },
};
export default demo;
