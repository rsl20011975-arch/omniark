/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/speech-bubble/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 같은 대화를 "글만 떠 있는" 상태에서 시작해, 말풍선 → 생각 풍선 → 외침 풍선을 차례로 입힌다. 풍선은 글 크기를 DOM 에서 재서 SVG 경로로 그린다. 화면은 시간 t 의 함수다.
const PAL = { bg0: '#0b0f1a', bg1: '#161d30', ink: '#f4efe4', muted: '#8b94a3', accent: '#ffb36b', accent2: '#ffd27a', surface: '#131a2b', line: '#2a3550' };
const TAIL = 22;                  // 말풍선 꼬리 길이(px). 꼬리 끝이 말하는 사람을 가리킨다
const PAD = 16;                   // 글과 풍선 테두리 사이 여백(px)
const BX = 190;                   // 풍선 왼쪽 위치(px). 아바타(지름 58px)에서 이만큼 떨어져 있다
const NS = 'http://www.w3.org/2000/svg';
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgba = (h, a) => 'rgba(' + hex(h).join(',') + ',' + a + ')';
const mixH = (a, b, p) => '#' + hex(a).map((v, i) => Math.round(lerp(v, hex(b)[i], p)).toString(16).padStart(2, '0')).join('');
const ROWS = [
  { kind: '말풍선', who: '민', txt: '오늘 저녁에 같이 볼래?', font: "500 17px/22px 'IBM Plex Sans KR',sans-serif", ink: PAL.bg0, fill: [PAL.ink, mixH(PAL.ink, PAL.muted, .3)], t0: .5 },
  { kind: '생각 풍선', who: '서', txt: '가고 싶은데 일이 아직 남았네', font: "500 17px/22px 'IBM Plex Sans KR',sans-serif", ink: PAL.bg0, fill: [mixH(PAL.ink, PAL.muted, .15), mixH(PAL.ink, PAL.muted, .55)], t0: 1.5 },
  { kind: '외침 풍선', who: '준', txt: '당장 출발하자!', font: "400 24px/28px 'Black Han Sans',sans-serif", ink: mixH(PAL.bg0, PAL.accent, .1), fill: [PAL.accent2, PAL.accent], t0: 2.5 },
];
const RH = 96, R0 = 58;           // 한 줄 높이, 첫 줄 시작 y

function speechPath(bx, by, W, H, tail) {
  const r = Math.min(16, H / 2), y1 = by + H * .4, y2 = by + H * .68, tx = bx - tail, ty = by + H * .64;
  return `M${bx + r},${by} H${bx + W - r} Q${bx + W},${by} ${bx + W},${by + r} V${by + H - r} Q${bx + W},${by + H} ${bx + W - r},${by + H} H${bx + r} Q${bx},${by + H} ${bx},${by + H - r} V${y2} Q${bx - tail * .4},${y2} ${tx},${ty} Q${bx - tail * .25},${y1 + 3} ${bx},${y1} V${by + r} Q${bx},${by} ${bx + r},${by} Z`;
}
// 둥근 직사각형 둘레를 일정 간격으로 나누고, 점 사이를 바깥으로 볼록한 호로 이어 구름 모양을 만든다
function cloudPath(bx, by, W, H) {
  const r = H / 2, Ls = W - H, C = 2 * Ls + Math.PI * H, N = Math.max(10, Math.round(C / 24)), step = C / N, rho = step * .62;
  const pt = (d) => {
    d = ((d % C) + C) % C;
    if (d < Ls) return [bx + r + d, by];
    d -= Ls;
    if (d < Math.PI * r) { const a = -Math.PI / 2 + d / r; return [bx + W - r + r * Math.cos(a), by + r + r * Math.sin(a)]; }
    d -= Math.PI * r;
    if (d < Ls) return [bx + W - r - d, by + H];
    d -= Ls;
    const a = Math.PI / 2 + d / r; return [bx + r + r * Math.cos(a), by + r + r * Math.sin(a)];
  };
  let d = '';
  for (let i = 0; i <= N; i++) { const p = pt(i * step); d += (i ? `A${rho.toFixed(1)},${rho.toFixed(1)} 0 0 1 ` : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1) + ' '; }
  return d + 'Z';
}
function burstPath(cx, cy, rx, ry, tail, bx) {
  const N = 22; let d = '';
  for (let i = 0; i < N * 2; i++) {
    const a = Math.PI * i / N - Math.PI / 2, out = i % 2 === 0, k = out ? 1 + .07 * Math.sin(i * 2.3) : .8;
    d += (i ? 'L' : 'M') + (cx + rx * k * Math.cos(a)).toFixed(1) + ',' + (cy + ry * k * Math.sin(a)).toFixed(1) + ' ';
  }
  // 왼쪽(말하는 사람 쪽)에 뾰족한 꼬리 하나를 더한다
  return d + 'Z M' + (bx + 4) + ',' + (cy - 7) + ' L' + (bx - tail) + ',' + (cy + 12) + ' L' + (bx + 6) + ',' + (cy + 8) + ' Z';
}

const demo = {
  dur: 4.0, rest: 3.4, noCompare: false, levels: 4,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: `radial-gradient(70% 90% at 80% 0%, ${rgba(PAL.accent, 0.08)}, rgba(0,0,0,0) 65%), linear-gradient(160deg,${PAL.bg0} 0%,${PAL.bg1} 100%)`, overflow: 'hidden' });
    const gr = el('div', null, bg);
    box(gr, { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.06', mixBlendMode: 'overlay' });
    const rows = ROWS.map((R, i) => {
      const top = R0 + i * RH;
      const g = el('div', null, sp);
      box(g, { position: 'absolute', left: '0', top: top + 'px', width: '640px', height: RH + 'px' });
      const av = el('div', null, g, R.who);
      box(av, { position: 'absolute', left: '36px', top: '18px', width: '58px', height: '58px', borderRadius: '50%', background: `radial-gradient(circle at 35% 28%, ${mixH(PAL.muted, PAL.ink, .2)}, ${mixH(PAL.muted, PAL.surface, .7)} 72%)`, boxShadow: `inset 0 1px 0 ${rgba(PAL.ink, 0.4)}, 0 8px 16px rgba(0,0,0,.45)`, color: PAL.ink, font: "400 26px/58px 'Black Han Sans',sans-serif", textAlign: 'center' });
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('width', '640'); svg.setAttribute('height', String(RH));
      svg.style.cssText = 'position:absolute;left:0;top:0;overflow:visible;filter:drop-shadow(0 8px 10px rgba(0,0,0,.4))';
      const defs = document.createElementNS(NS, 'defs');
      defs.innerHTML = `<linearGradient id="bg${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${R.fill[0]}"/><stop offset="1" stop-color="${R.fill[1]}"/></linearGradient>`;
      svg.appendChild(defs);
      const grp = document.createElementNS(NS, 'g');
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('fill', `url(#bg${i})`);
      path.setAttribute('fill-rule', 'nonzero');
      grp.appendChild(path);
      const dots = [0, 1, 2].map(() => { const c = document.createElementNS(NS, 'circle'); c.setAttribute('fill', `url(#bg${i})`); grp.appendChild(c); return c; });
      svg.appendChild(grp);
      g.appendChild(svg);
      const tx = el('div', null, g, R.txt);
      box(tx, { position: 'absolute', whiteSpace: 'nowrap', font: R.font, color: PAL.ink });
      const lab = el('div', null, g);
      box(lab, { position: 'absolute', left: '470px', top: '30px', width: '150px', font: "500 11px/1.6 'JetBrains Mono',monospace", color: PAL.muted, whiteSpace: 'pre' });
      return { g, path, dots, tx, lab, svg };
    });
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', right: '20px', top: '14px', padding: '7px 12px 7px 11px', borderRadius: '2px', background: PAL.surface, borderLeft: `3px solid ${PAL.accent}`, boxShadow: '0 1px 2px rgba(0,0,0,.4), 0 6px 12px -4px rgba(0,0,0,.5)', color: PAL.ink, font: "600 12px/1.2 'IBM Plex Sans KR',sans-serif" });
    return { rows, pill };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv - 1);   // 단계 1 은 기법을 쓰지 않은 기본 모습(= 연출 전)   // 1 = 말풍선, 2 = + 생각 풍선, 3 = + 외침 풍선
    s.rows.forEach((o, i) => {
      const R = ROWS[i], on = L >= i + 1;
      const tw = o.tx.offsetWidth, th = o.tx.offsetHeight;
      const W = tw + 2 * PAD, H = th + 2 * PAD, by = RH / 2 - H / 2;
      const p = on ? seg(t, R.t0, R.t0 + .6) : 0, sc = on ? Math.max(0, E.outBack(p)) : 0;
      const tipx = BX - (i === 1 ? TAIL * .7 : TAIL), tipy = by + H * .64;
      o.tx.style.left = (BX + PAD) + 'px';
      o.tx.style.top = (by + PAD) + 'px';
      // 글은 풍선이 없을 때는 흰색, 풍선이 나오면 풍선 색에 맞는 짙은 색으로
      const ink = on ? seg(t, R.t0 + .1, R.t0 + .35) : 0;
      const m = (c, d, k) => { const h = (x) => [1, 3, 5].map((j) => parseInt(x.slice(j, j + 2), 16)); return 'rgb(' + h(c).map((v, j) => Math.round(lerp(v, h(d)[j], k))).join(',') + ')'; };
      o.tx.style.color = m(PAL.ink, R.ink, ink);
      o.tx.style.transformOrigin = (tipx - BX - PAD) + 'px ' + (tipy - by - PAD) + 'px';
      o.tx.style.transform = on ? `scale(${Math.max(.01, sc).toFixed(3)})` : 'none';
      o.tx.style.opacity = on ? (ink > 0 || sc > .3 ? '1' : '0') : '1';
      if (i === 0) o.path.setAttribute('d', speechPath(BX, by, W, H, TAIL));
      else if (i === 1) o.path.setAttribute('d', cloudPath(BX, by, W, H));
      else o.path.setAttribute('d', burstPath(BX + W / 2, by + H / 2, W / 2 + 18, H / 2 + 14, TAIL, BX));
      const grp = o.path.parentNode;
      grp.setAttribute('transform', `translate(${tipx.toFixed(1)} ${tipy.toFixed(1)}) scale(${sc.toFixed(3)}) translate(${(-tipx).toFixed(1)} ${(-tipy).toFixed(1)})`);
      grp.style.opacity = on ? '1' : '0';
      // 생각 풍선의 꼬리: 점점 작아지는 방울 세 개가 화자 쪽으로 내려간다
      o.dots.forEach((c, j) => {
        const k = TAIL / 22;
        c.setAttribute('cx', (BX - (6 + 15 * j) * k).toFixed(1));
        c.setAttribute('cy', (by + H * (.72 + .13 * j)).toFixed(1));
        c.setAttribute('r', ((7 - 2 * j) * Math.max(.4, k)).toFixed(1));
        c.style.display = i === 1 ? 'block' : 'none';
      });
      o.lab.textContent = on ? R.kind + '\n꼬리 ' + (i === 1 ? '방울 3개' : TAIL + 'px') + ', 여백 ' + PAD + 'px' : R.kind + ' 없음\n글만 떠 있음';
    });
    const stage = t < 1.4 ? 1 : (t < 2.4 ? 2 : 3);
    const names = ['', '1단계: 말풍선(꼬리가 말하는 사람을 가리킴)', '2단계: 생각 풍선(꼬리 자리에 방울)', '3단계: 외침 풍선(뾰족한 테두리)'];
    s.pill.textContent = L === 0 ? '연출 전: 글만으로는 누가 어떻게 말하는지 알 수 없음' : names[Math.min(stage, L)];
  },
};
export default demo;
