/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/retry-same-seed-trap/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 같은 단어를 12번 다시 시도할 때 꽃 이름을 고르는 방법 네 가지를 코드가 직접 뽑아 보여 준다.
// 타일에 적힌 것은 코드가 지시문에 넣을 꽃 이름이다. AI 가 그린 그림이 아니다. 화면은 시간 t 의 함수다.
const TRIES = 12;     // 같은 단어로 다시 시도하는 횟수
const POOL = 8;      // 가방(꽃 목록)의 칸 수. 제작 코드의 꽃 목록이 30칸이다
const WORD = '촉촉하다';   // 다시 시도하는 단어
const PAL = { bg0: '#1f3a8a', bg1: '#172a63', ink: '#f3f6ff', muted: '#aebcf0', accent: '#ffd166', accent2: '#7fe0ff', surface: '#1b3274', line: '#3b57ad' };
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif';
const FLOWERS = ['장미', '튤립', '백합', '작약', '별수국', '난초', '나팔꽃', '프리지아', '플루메리아', '카네이션', '데이지', '둥굴레꽃', '금낭화', '민들레', '양귀비', '안개꽃', '은방울꽃', '붓꽃', '칼라 릴리', '스파티필럼', '할미꽃', '수선화', '상사화', '히아신스', '민들레', '호접란', '봉선화', '코스모스', '도라지꽃', '미니장미'];
const METHOD = ['단어 해시', '진짜 랜덤', '가방 뽑기', '가방 저장'];
const NOTE = ['같은 단어는 해시가 같아서 같은 칸', '매번 새로 뽑지만 같은 꽃이 또 나올 수 있다', '가방을 비울 때까지 같은 칸을 안 뽑는다', '껐다 켜도 가방 상태를 이어 쓴다'];

function crc32(str) {   // 제작 코드가 쓴 zlib.crc32 와 같은 값(UTF-8 바이트 기준)
  let c, crc = 0xFFFFFFFF; const b = new TextEncoder().encode(str);
  for (let i = 0; i < b.length; i++) { c = (crc ^ b[i]) & 0xFF; for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xEDB88320 : c >>> 1; crc = (crc >>> 8) ^ c; }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}
const nameOf = (i) => FLOWERS[i];
const hue = (i) => { const n = FLOWERS[i]; return (FLOWERS.indexOf(n) * 47) % 360; };

function shuffled(r, n) { const a = Array.from({ length: n }, (_, i) => i); for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function picks(L) {   // 단계마다 TRIES 번 뽑은 칸 번호와 껐다 켠 뒤(run 2)인지, 가방에 남은 칸 수
  const out = [], half = Math.floor(TRIES / 2), r = rng([0, 42, 43, 46][L]);   // 단계마다 정해 둔 시드(같은 화면이 늘 같게)
  let bag = [];
  for (let i = 0; i < TRIES; i++) {
    let idx;
    if (L === 0) idx = crc32(WORD) % POOL;
    else if (L === 1) idx = Math.floor(r() * POOL);
    else {
      if (L === 2 && i === half) bag = [];            // 저장하지 않으면 다시 켤 때 새 가방이다
      if (!bag.length) bag = shuffled(r, POOL);
      idx = bag.pop();
    }
    out.push({ idx, run2: L >= 2 && i >= half, left: L >= 2 ? bag.length : null });
  }
  const seen = new Set(); out.forEach((p) => { p.dup = seen.has(nameOf(p.idx)); seen.add(nameOf(p.idx)); });
  return out;
}

let GRAIN = null;
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function rr(x, X, Y, W, H, R) { x.beginPath(); x.roundRect(X, Y, W, H, R); }

const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(23), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const lab = el('div', null, sp);   // 이름표(vertical): 왼쪽 가장자리 세로쓰기, 현재 항목만 밝게
    Object.assign(lab.style, { position: 'absolute', left: '14px', top: '16px', display: 'flex', flexDirection: 'row-reverse', gap: '9px', zIndex: '4' });
    const items = METHOD.map((m) => { const e = el('span', null, lab, m); Object.assign(e.style, { writingMode: 'vertical-rl', font: "600 12px/1.2 'IBM Plex Sans KR',sans-serif", letterSpacing: '3px', whiteSpace: 'nowrap', color: PAL.muted }); return e; });
    return { main, items, lv: [0, 1, 2, 3].map(picks) };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv), P = s.lv[Math.max(0, Math.min(3, L))], x = s.main.getContext('2d');
    t = t > 0 ? t : 0;
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.09;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();
    s.items.forEach((e, i) => { e.style.color = i === L ? PAL.ink : PAL.muted; });

    const head = L === 0 ? `단어 “${WORD}” 의 해시를 ${POOL}으로 나눈 나머지 ${crc32(WORD) % POOL}번 칸` : `같은 단어 “${WORD}” 를 ${TRIES}번 다시 시도`;
    T(x, head, 104, 30, 13, PAL.ink, 600);
    T(x, NOTE[L], 104, 46, 11, PAL.muted, 500);

    const GX = 104, GY = 58, GW = 522, GH = 206, GAP = 8, cols = TRIES > 12 ? 5 : 4, rows = Math.ceil(TRIES / cols);
    const tw = (GW - (cols - 1) * GAP) / cols, th = (GH - (rows - 1) * GAP) / rows;
    let shown = 0, dist = new Set(), dups = 0, left = null;
    P.forEach((p, i) => {
      const k = seg(t, 0.3 + i * 0.16, 0.3 + i * 0.16 + 0.4), pop = E.outBack(k);
      const X = GX + (i % cols) * (tw + GAP), Y = GY + Math.floor(i / cols) * (th + GAP);
      if (k <= 0) { x.strokeStyle = PAL.line; x.lineWidth = 1; x.setLineDash([3, 3]); rr(x, X + 0.5, Y + 0.5, tw - 1, th - 1, 6); x.stroke(); x.setLineDash([]); return; }
      shown++; dist.add(nameOf(p.idx)); if (p.dup) dups++; left = p.left;
      const sc = lerp(0.78, 1, pop), cx = X + tw / 2, cy = Y + th / 2;
      x.save(); x.translate(cx, cy); x.scale(sc, sc); x.translate(-cx, -cy); x.globalAlpha = Math.min(1, k * 2.2);
      const h = hue(p.idx), g = x.createLinearGradient(0, Y, 0, Y + th);
      g.addColorStop(0, `hsl(${h},62%,82%)`); g.addColorStop(1, `hsl(${h},55%,66%)`);
      x.fillStyle = 'rgba(8,14,40,0.35)'; rr(x, X, Y + 2.5, tw, th, 6); x.fill();   // 접지 그림자
      x.fillStyle = g; rr(x, X, Y, tw, th, 6); x.fill();
      x.strokeStyle = 'rgba(255,255,255,0.55)'; x.lineWidth = 1; rr(x, X + 0.5, Y + 0.5, tw - 1, th - 1, 6); x.stroke();   // 위쪽 림 라이트
      if (p.run2) { x.strokeStyle = PAL.accent2; x.lineWidth = 2.5; rr(x, X + 1.25, Y + 1.25, tw - 2.5, th - 2.5, 5); x.stroke(); }
      T(x, String(i + 1), X + 7, Y + 14, 10, 'rgba(20,33,79,0.75)', 600, 'left', MONO);
      const nm = nameOf(p.idx); let fs = th > 55 ? 16 : 13; x.font = `700 ${fs}px ${SANS}`;
      while (x.measureText(nm).width > tw - 14 && fs > 10) { fs -= 1; x.font = `700 ${fs}px ${SANS}`; }
      T(x, nm, cx, cy + (th > 55 ? 4 : 2), fs, '#14214f', 700, 'center');
      if (p.dup) { x.fillStyle = PAL.accent; rr(x, X + tw - 34, Y + th - 17, 28, 13, 3); x.fill(); T(x, '겹침', X + tw - 20, Y + th - 7, 10, '#14214f', 700, 'center'); }
      x.restore();
    });

    const dn = Math.round(dist.size), NY = 306;
    T(x, `${dn} / ${shown}`, 104, NY, 30, PAL.accent, 700, 'left', MONO);
    T(x, '다른 꽃 이름 수', 104, NY + 18, 11, PAL.muted, 500);
    T(x, String(dups), 290, NY, 30, dups ? PAL.accent : PAL.ink, 700, 'left', MONO);
    T(x, '겹친 칸', 290, NY + 18, 11, PAL.muted, 500);
    if (L >= 2) { T(x, `${left == null ? POOL : left} / ${POOL}`, 410, NY, 30, PAL.ink, 700, 'left', MONO); T(x, '가방에 남은 칸', 410, NY + 18, 11, PAL.muted, 500); }
    else { T(x, L === 0 ? '해시' : '랜덤', 410, NY, 30, PAL.ink, 700, 'left', SANS); T(x, '꽃을 고르는 방법', 410, NY + 18, 11, PAL.muted, 500); }
    T(x, '꽃 이름은 코드가 고른 값이다. AI 가 그린 그림이 아니다.', 626, 352, 10, PAL.muted, 500, 'right');
    if (L >= 2) T(x, '하늘색 테두리는 껐다 켠 뒤', 104, 352, 10, PAL.accent2, 500);
    x.globalAlpha = 1;
  },
};
export default demo;
