/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/speech-lead-sync/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

const PAL = { bg0: '#f4efe4', bg1: '#e9e2d3', ink: '#1d1a16', muted: '#6b6458', accent: '#d4472b', accent2: '#2b5d8a', surface: '#fbf8f1', line: '#cfc6b3' };
const PASS_INK = '#2b5d8a', FAIL_INK = '#b3361c';   // 글자용(배경 대비 5:1 이상)

// 같은 내레이션 한 줄에 화면 반응을 두 방식으로 단다: A 어절마다 켜기, B 줄 통째로 켜기. 말 시각은 예시 값이고 화면은 시간 t 의 함수다.
const LEAD = 0.15;        // A 방식에서 화면이 어절 시작보다 먼저 반응하는 시간(초)
const UNLIT = 0.7;       // 아직 안 말한 어절의 밝기(1 = 켜진 상태)
const LINE_LEAD = 0;      // B 방식에서 줄이 시작보다 먼저 나타나는 시간(초)
const WORDS = ['사진에', '깊이를', '주고', '천천히', '밀어', '넣습니다'];
const WT = [0.6, 1.2, 1.8, 2.3, 3.0, 3.45];       // 어절이 말해지기 시작하는 시각(예시)
const WEND = [1.14, 1.74, 2.24, 2.94, 3.4, 3.95];
const BIG = ['', '깊이', '', '천천히', '밀어', ''];  // 핵심어(큰 글자로 튀는 어절)
const LINE0 = 0.6, LINE1 = 4.2, FADE = 0.18, FPS = 30, DUR = 5.0;
const PASS_LO = -0.30, PASS_HI = -0.05;             // 화면이 말보다 먼저 와야 하는 범위(초)
const ITEMS = ['정지', '동시', '먼저', '줄 단위', '눈금'];

const box = (e, o) => Object.assign(e.style, o);
const ob = (x, s) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2));
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";

const leadOf = (lv) => (lv >= 2 ? LEAD : 0);
const rtOf = (i, lv) => WT[i] - leadOf(lv);                                    // 화면이 반응하기로 계획한 시각
const tokOp = (i, t, lv) => (lv === 0 ? 1 : lerp(UNLIT, 1, E.outC(seg(t, rtOf(i, lv), rtOf(i, lv) + FADE))));
function observed(i, lv) {     // 결과 화면을 30fps 로 훑어 어절의 밝기가 처음 눈에 띄게 변한 프레임(측정 도구와 같은 방식)
  if (lv === 0) return null;
  for (let f = Math.floor((WT[i] - 1) * FPS); f < (WT[i] + .5) * FPS; f++) {
    if (tokOp(i, f / FPS, lv) - tokOp(i, (f - 1) / FPS, lv) >= .02) return f / FPS;
  }
  return null;
}
const lineOp = (t, lv) => (lv === 0 ? 1 : lv < 3 ? 0 : E.outC(seg(t, LINE0 - LINE_LEAD, LINE0 - LINE_LEAD + .15)) * (1 - seg(t, LINE1, LINE1 + .3)));

function scenery(parent, W, H, uid) {       // 사진처럼 보이는 정지 장면: 해 질 녘 호수와 산(코드로 그린 그림)
  const r = rng(11), hz = Math.round(H * .6);
  const ridge = (base, amp, f, ph) => { let d = `M0 ${hz}`; for (let i = 0; i <= 56; i++) { const u = i / 56; d += ` L${(u * W).toFixed(1)} ${(base + amp * (Math.sin(u * f + ph) * .6 + Math.sin(u * f * 2.3 + ph * 1.7) * .3 + (r() - .5) * .3)).toFixed(1)}`; } return d + ` L${W} ${hz} Z`; };
  const far = ridge(hz - 42, 24, 5.2, .6), mid = ridge(hz - 20, 20, 7.1, 2.2), near = ridge(hz - 4, 9, 9, 4.1);
  let stars = '', ripples = '';
  for (let i = 0; i < 22; i++) stars += `<circle cx="${(r() * W).toFixed(1)}" cy="${(r() * hz * .5).toFixed(1)}" r="${(.4 + r() * .6).toFixed(2)}" fill="#fff" opacity="${(.25 + r() * .5).toFixed(2)}"/>`;
  for (let i = 0; i < 26; i++) { const yy = hz + 5 + r() * (H - hz - 7), x0 = r() * W, ln = 12 + r() * 50; ripples += `<rect x="${x0.toFixed(1)}" y="${yy.toFixed(1)}" width="${ln.toFixed(1)}" height="${(.6 + (yy - hz) / (H - hz) * 1.2).toFixed(2)}" rx=".6" fill="#ffd9b8" opacity="${(.06 + r() * .1).toFixed(2)}"/>`; }
  const d = el('div', null, parent);
  box(d, { position: 'absolute', inset: '0', overflow: 'hidden' });
  d.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:block"><defs>
    <linearGradient id="sk${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2745"/><stop offset=".55" stop-color="#6b6a90"/><stop offset=".85" stop-color="#e29b7c"/><stop offset="1" stop-color="#f6c79a"/></linearGradient>
    <radialGradient id="sn${uid}" cx=".64" cy="${(hz / H).toFixed(3)}" r=".55"><stop offset="0" stop-color="#fff0cf" stop-opacity=".95"/><stop offset=".18" stop-color="#ffc58f" stop-opacity=".6"/><stop offset="1" stop-color="#ff9a6a" stop-opacity="0"/></radialGradient>
    <linearGradient id="lk${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9a47f"/><stop offset=".3" stop-color="#7c6b8e"/><stop offset="1" stop-color="#1b2340"/></linearGradient>
    <linearGradient id="m1${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a789a"/><stop offset="1" stop-color="#c58d8a"/></linearGradient>
    <linearGradient id="m2${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4768"/><stop offset="1" stop-color="#8d6c80"/></linearGradient>
    <linearGradient id="m3${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d2036"/><stop offset="1" stop-color="#3b3350"/></linearGradient>
    <filter id="bl${uid}"><feGaussianBlur stdDeviation="1.4"/></filter>
    <clipPath id="lc${uid}"><rect x="0" y="${hz}" width="${W}" height="${H - hz}"/></clipPath></defs>
    <rect width="${W}" height="${hz}" fill="url(#sk${uid})"/><rect width="${W}" height="${hz}" fill="url(#sn${uid})"/>${stars}
    <path d="${far}" fill="url(#m1${uid})"/><path d="${mid}" fill="url(#m2${uid})"/><path d="${near}" fill="url(#m3${uid})"/>
    <rect y="${hz}" width="${W}" height="${H - hz}" fill="url(#lk${uid})"/>
    <g clip-path="url(#lc${uid})"><g transform="translate(0,${2 * hz}) scale(1,-1)" opacity=".5" filter="url(#bl${uid})"><path d="${far}" fill="url(#m1${uid})"/><path d="${mid}" fill="url(#m2${uid})"/><path d="${near}" fill="url(#m3${uid})"/></g></g>
    ${ripples}<rect y="${hz}" width="${W}" height="1" fill="#ffe3c2" opacity=".35"/></svg>`;
  const gr = el('div', null, d);
  box(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.09', mixBlendMode: 'overlay' });
  const vg = el('div', null, d);
  box(vg, { position: 'absolute', inset: '0', background: 'radial-gradient(ellipse at 50% 55%, transparent 55%, rgba(0,0,0,.35) 100%)' });
}

const PX0 = 88, PXW = 532, tx = (t) => PX0 + PXW * t / DUR;

function panel(sp, x, y, w, h, uid, title) {
  const p = el('div', null, sp);
  box(p, { position: 'absolute', left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px', borderRadius: '8px', overflow: 'hidden', boxShadow: `0 0 0 1px ${PAL.line}, 0 2px 3px rgba(60,45,25,.25), 0 12px 22px rgba(60,45,25,.22)` });
  scenery(p, w, h, uid);
  const band = el('div', null, p);
  box(band, { position: 'absolute', left: '0', right: '0', bottom: '0', height: '46px', background: 'linear-gradient(to top, rgba(10,8,18,.72), rgba(10,8,18,0))' });
  const chip = el('div', null, p, title);
  box(chip, { position: 'absolute', left: '8px', top: '8px', padding: '4px 7px', borderRadius: '3px', background: PAL.surface, color: PAL.ink, font: "600 11px/1 'IBM Plex Sans KR',sans-serif", boxShadow: '0 2px 6px rgba(0,0,0,.3)' });
  return p;
}

const demo = {
  dur: DUR, rest: 3.4, noCompare: false, levels: 4,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: `linear-gradient(160deg,${PAL.bg0} 0%,${PAL.bg1} 100%)` });
    const gg = el('div', null, bg);
    box(gg, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.07', mixBlendMode: 'multiply' });
    // 세로 이름표
    const vl = el('div', null, sp);
    box(vl, { position: 'absolute', left: '12px', top: '20px', writingMode: 'vertical-rl', font: "500 12px/1 'IBM Plex Sans KR',sans-serif", letterSpacing: '.18em', color: PAL.muted, display: 'flex', flexDirection: 'row-reverse', gap: '10px' });
    const vis = ITEMS.map((n) => el('span', null, vl, n));
    // 두 패널
    const pa = panel(sp, 40, 18, 282, 142, 'a', 'A 단어 단위'), pb = panel(sp, 338, 18, 282, 142, 'b', 'B 줄 단위');
    const mkRow = (p, cls) => {
      const row = el('div', null, p);
      box(row, { position: 'absolute', left: '0', right: '0', bottom: '10px', textAlign: 'center', font: "600 13px/1 'IBM Plex Sans KR',sans-serif", color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,.6)', whiteSpace: 'nowrap' });
      return row;
    };
    const rowA = mkRow(pa), rowB = mkRow(pb);
    const tokA = WORDS.map((w, i) => { const s = el('span', null, rowA, w); s.style.marginRight = i < 5 ? '6px' : '0'; return s; });
    const tokB = WORDS.map((w, i) => { const s = el('span', null, rowB, w); s.style.marginRight = i < 5 ? '6px' : '0'; return s; });
    const big = el('div', null, pa);
    box(big, { position: 'absolute', left: '0', right: '0', top: '44px', textAlign: 'center', font: "400 42px/1 'Black Han Sans',sans-serif", color: '#fff', textShadow: '0 4px 18px rgba(0,0,0,.55), 0 1px 2px rgba(0,0,0,.5)' });
    const ul = el('div', null, pa);
    box(ul, { position: 'absolute', left: '50%', top: '92px', height: '4px', borderRadius: '2px', background: PAL.accent, boxShadow: '0 0 10px rgba(212,71,43,.6)' });
    const hint = el('div', null, pb, '3단계에서 줄 단위를 놓는다');
    box(hint, { position: 'absolute', inset: '0', background: 'rgba(244,239,228,.62)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: "500 12px/1 'JetBrains Mono',monospace", color: PAL.ink });
    // 눈금: 말 / 화면 A / 화면 B
    const lanes = [['말', 178], ['화면 A', 206], ['화면 B', 234]];
    lanes.forEach(([n, y]) => {
      const lb = el('div', null, sp, n);
      box(lb, { position: 'absolute', left: '40px', top: (y + 5) + 'px', font: "500 10px/1 'JetBrains Mono',monospace", color: PAL.muted });
      const ln = el('div', null, sp);
      box(ln, { position: 'absolute', left: PX0 + 'px', top: (y + 22) + 'px', width: PXW + 'px', height: '1px', background: PAL.line });
    });
    for (let k = 0; k <= 5; k++) {
      const tk = el('div', null, sp, k + 's');
      box(tk, { position: 'absolute', left: (tx(k) - 8) + 'px', top: '262px', width: '16px', textAlign: 'center', font: "400 9px/1 'JetBrains Mono',monospace", color: PAL.muted });
    }
    const blocks = WORDS.map((w, i) => {
      const b = el('div', null, sp, w);
      const x0 = tx(WT[i]), x1 = tx(WEND[i]);
      box(b, { position: 'absolute', left: x0 + 'px', top: '178px', width: (x1 - x0 - 2) + 'px', height: '22px', borderRadius: '4px', background: PAL.surface, boxShadow: `inset 0 0 0 1px ${PAL.line}`, font: "500 10px/22px 'IBM Plex Sans KR',sans-serif", color: PAL.muted, textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap' });
      return b;
    });
    const bands = WORDS.map((w, i) => {
      const b = el('div', null, sp);
      box(b, { position: 'absolute', left: tx(WT[i] + PASS_LO) + 'px', top: '206px', width: (tx(WT[i] + PASS_HI) - tx(WT[i] + PASS_LO)) + 'px', height: '22px', borderRadius: '3px', background: 'rgba(43,93,138,.16)', boxShadow: 'inset 0 0 0 1px rgba(43,93,138,.35)' });
      return b;
    });
    const marks = WORDS.map((w, i) => {
      const m = el('div', null, sp);
      box(m, { position: 'absolute', top: '206px', width: '3px', height: '22px', borderRadius: '1.5px', background: BIG[i] ? PAL.accent : PAL.accent2, boxShadow: '0 1px 3px rgba(0,0,0,.3)' });
      return m;
    });
    const gaps = WORDS.map(() => { const g = el('div', null, sp); box(g, { position: 'absolute', top: '216px', height: '2px', background: PAL.accent2, opacity: '.6' }); return g; });
    const lbar = el('div', null, sp);
    box(lbar, { position: 'absolute', top: '234px', height: '22px', borderRadius: '4px', background: PAL.accent2, boxShadow: '0 1px 3px rgba(0,0,0,.25)', color: '#fff', font: "600 10px/22px 'IBM Plex Sans KR',sans-serif", textAlign: 'center' });
    const head = el('div', null, sp);
    box(head, { position: 'absolute', top: '172px', width: '2px', height: '90px', background: PAL.ink, borderRadius: '1px' });
    const r1 = el('div', null, sp), r2 = el('div', null, sp);
    box(r1, { position: 'absolute', left: '40px', top: '284px', width: '580px', font: "500 12px/1.3 'JetBrains Mono',monospace", color: PAL.ink });
    box(r2, { position: 'absolute', left: '40px', top: '306px', width: '580px', font: "400 11px/1.3 'JetBrains Mono',monospace", color: PAL.muted });
    const wait = el('div', null, sp, '결정 대기');
    box(wait, { position: 'absolute', right: '20px', top: '326px', padding: '4px 8px', borderRadius: '3px', background: PAL.accent, color: '#fff', font: "600 11px/1 'IBM Plex Sans KR',sans-serif", boxShadow: '0 2px 6px rgba(120,40,20,.35)' });
    return { vis, rowA, tokA, tokB, rowB, big, ul, hint, blocks, bands, marks, gaps, lbar, head, r1, r2, wait };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 4 : lv);
    s.vis.forEach((v, i) => box(v, { color: i === L ? PAL.ink : PAL.muted, fontWeight: i === L ? '700' : '500' }));
    // 패널 A: 어절 켜짐 + 핵심어 큰 글자
    s.tokA.forEach((e, i) => { e.style.opacity = tokOp(i, t, L).toFixed(3); });
    let k = -1;
    if (L >= 1) WORDS.forEach((w, i) => { if (BIG[i] && t >= rtOf(i, L)) k = i; });
    if (k >= 0) {
      const u = seg(t, rtOf(k, L), rtOf(k, L) + .3), fo = 1 - seg(t, LINE1, LINE1 + .3);
      s.big.textContent = BIG[k];
      box(s.big, { opacity: (E.outC(seg(t, rtOf(k, L), rtOf(k, L) + .1)) * fo).toFixed(3), transform: `scale(${(.7 + .3 * ob(u, 1.8)).toFixed(3)})` });
      box(s.ul, { width: (70 * E.outC(seg(t, rtOf(k, L) + .08, rtOf(k, L) + .4)) * fo).toFixed(1) + 'px', marginLeft: '-35px', opacity: fo.toFixed(2) });
    } else { s.big.textContent = ''; s.ul.style.width = '0px'; }
    // 패널 B: 줄 통째로
    const lo = lineOp(t, L);
    s.tokB.forEach((e) => { e.style.opacity = '1'; });
    s.rowB.style.opacity = lo.toFixed(3);
    s.hint.style.display = (L >= 1 && L < 3) ? 'flex' : 'none';
    // 눈금
    const obs = WORDS.map((w, i) => observed(i, L));
    s.blocks.forEach((b, i) => { const on = t >= WT[i] && t < WEND[i]; box(b, { background: on ? PAL.ink : PAL.surface, color: on ? '#fff' : PAL.muted }); });
    s.bands.forEach((b) => { b.style.display = L >= 4 ? 'block' : 'none'; });
    s.marks.forEach((m, i) => { m.style.display = obs[i] != null ? 'block' : 'none'; if (obs[i] != null) m.style.left = (tx(obs[i]) - 1.5) + 'px'; });
    s.gaps.forEach((g, i) => { const on = obs[i] != null && WT[i] - obs[i] > .01; g.style.display = on ? 'block' : 'none'; if (on) box(g, { left: tx(obs[i]) + 'px', width: (tx(WT[i]) - tx(obs[i])) + 'px' }); });
    if (L >= 3) { const x0 = tx(LINE0 - LINE_LEAD), x1 = tx(LINE1); box(s.lbar, { display: 'block', left: x0 + 'px', width: (x1 - x0) + 'px' }); s.lbar.textContent = '줄 전체가 한 번에'; } else s.lbar.style.display = 'none';
    s.head.style.left = (tx(Math.min(t, DUR)) - 1) + 'px';
    s.wait.style.display = L >= 3 ? 'block' : 'none';
    // 읽는 값(이 화면에서 코드가 잰 값)
    const diffs = obs.map((o, i) => (o == null ? null : o - WT[i]));
    const okN = diffs.filter((d) => d != null && d >= PASS_LO - 1e-9 && d <= PASS_HI + 1e-9).length;
    let cur = -1;
    obs.forEach((o, i) => { if (o != null && t >= o) cur = i; });
    if (L === 0) { s.r1.textContent = '화면 반응 없음: 자막 줄이 말과 상관없이 처음부터 떠 있다'; s.r1.style.color = PAL.ink; s.r2.textContent = '말 막대만 흐르고 화면은 가만히 있다(측정할 반응이 없음)'; }
    else if (cur < 0) { s.r1.textContent = `대기 중: 첫 어절 ${WT[0].toFixed(2)}초`; s.r1.style.color = PAL.ink; s.r2.textContent = `합격 범위 ${PASS_LO.toFixed(2)}~${PASS_HI.toFixed(2)}초(화면 - 말)`; }
    else {
      const d = diffs[cur], pass = d >= PASS_LO - 1e-9 && d <= PASS_HI + 1e-9;
      s.r1.textContent = `${WORDS[cur]}  말 ${WT[cur].toFixed(2)}초  화면 ${obs[cur].toFixed(2)}초  차 ${d.toFixed(2)}초  ${pass ? '합격' : '범위 밖'}`;
      s.r1.style.color = pass ? PASS_INK : FAIL_INK;
      s.r2.textContent = `A 어절 ${okN}/${WORDS.length} 합격(범위 ${PASS_LO.toFixed(2)}~${PASS_HI.toFixed(2)}초)` + (L >= 3 ? `   B 줄은 ${(LINE0 - LINE_LEAD).toFixed(2)}초에 1번` : '');
    }
  },
};
export default demo;
