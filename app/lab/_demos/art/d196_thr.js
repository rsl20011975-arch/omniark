/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/zoom-speed-reads-as-still/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

const PAL = { bg0: '#1b0e17', bg1: '#2b1424', ink: '#f6e9ee', muted: '#b095a3', accent: '#ff7aa8', accent2: '#ffd0a0', surface: '#26121f', line: '#4a2a40' };
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const box = (e, o) => Object.assign(e.style, o);

// 같은 사진을 서로 다른 속도로 밀어 보고, 프레임 차 자(10fps, 64px 회색, 차이 0.5 미만이면 정지)로 코드가 직접 잰다.
const BASE_SPEED = 2;      // 연출 전: 느린 드리프트의 속도(%/초)
const SPEED = 6;           // 연출 후: 밀기 속도(%/초)
const STILL_THR = 1.0;     // 이 값보다 프레임 차가 작으면 그 0.1초는 정지로 센다
const SHOT = 2.4, T0 = .3; // 한 샷의 길이(초), 샷 시작 시각
const FPS = 10, N = Math.round(SHOT * FPS);
const SPEEDS = [1, 2, 3, 4, 5, 6, 7, 8, 10];
const REF = { 2: [54, 71], 6: [0, 4] };   // 제작자 기록의 정지 비율 범위(%)
const SRC_W = 1664, SRC_H = 936, MAXD = 5;   // 프레임 차 막대의 끝값

function ridge(r, n, rough) {
  const v = new Array(n + 1).fill(0); v[0] = r() - .5; v[n] = r() - .5;
  let step = n, amp = 1;
  while (step > 1) { const h = step / 2; for (let i = h; i < n; i += step) v[i] = (v[i - h] + v[i + h]) / 2 + (r() - .5) * amp; amp *= rough; step = h; }
  const m = Math.max(...v.map(Math.abs)) || 1;
  return v.map((x) => x / m);
}

function paintTown(W, H) {   // 밤 도시 골목(코드로 그린 사진 같은 정지 장면): 창문·벽 질감이 많아 프레임 차가 정직하게 나온다
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d'), r = rng(196), ST = H * .86;
  const sky = g.createLinearGradient(0, 0, 0, H * .7);
  sky.addColorStop(0, '#12081a'); sky.addColorStop(.45, '#3a1a3c'); sky.addColorStop(.8, '#8c3a5e'); sky.addColorStop(1, '#ff9a78');
  g.fillStyle = sky; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 120; i++) { g.fillStyle = rgba('#ffffff', .15 + r() * .5); g.fillRect(r() * W, r() * H * .3, 1.4, 1.4); }
  [[300, .22], [120, .4], [46, .9]].forEach(([rad, a]) => {   // 달과 달무리
    const rg = g.createRadialGradient(W * .78, H * .15, 0, W * .78, H * .15, rad);
    rg.addColorStop(0, rgba('#ffe6d0', a)); rg.addColorStop(1, rgba('#ffe6d0', 0)); g.fillStyle = rg; g.fillRect(0, 0, W, H * .6);
  });
  [{ n: 60, y0: H * .42, h: 220, col: '#4c2447', al: .9 }, { n: 28, y0: H * .5, h: 260, col: '#2e1630', al: 1 }].forEach((L) => {   // 먼 건물 두 겹
    let x = -20;
    while (x < W) { const w = 30 + r() * 90, h = 60 + r() * L.h; g.fillStyle = rgba(L.col, L.al); g.fillRect(x, ST - h - (L.y0 > H * .45 ? 0 : 90), w, h + 90); x += w + r() * 6; }
  });
  const hz = g.createLinearGradient(0, H * .4, 0, ST); hz.addColorStop(0, rgba('#ff9a78', 0)); hz.addColorStop(1, rgba('#ff9a78', .22));
  g.fillStyle = hz; g.fillRect(0, H * .4, W, ST - H * .4);
  const lit = [];
  let bx = -30;
  for (let b = 0; b < 7; b++) {   // 앞쪽 건물 일곱 채
    const bw = 210 + r() * 120, bh = H * (.4 + r() * .3), top = ST - bh;
    const fg = g.createLinearGradient(bx, top, bx + bw, ST);
    const tone = ['#5e2c47', '#4d2340', '#68324a', '#4a2438'][b % 4];
    fg.addColorStop(0, tone); fg.addColorStop(1, '#1b0d18'); g.fillStyle = fg; g.fillRect(bx, top, bw, bh);
    for (let y = top; y < ST; y += 7) { g.fillStyle = rgba('#000000', .05 + r() * .07); g.fillRect(bx, y, bw, 1); }   // 벽돌 줄눈
    for (let i = 0; i < 160; i++) { g.fillStyle = rgba(r() < .5 ? '#000000' : '#ffb59a', .03 + r() * .05); g.fillRect(bx + r() * bw, top + r() * bh, 4 + r() * 22, 3 + r() * 12); }
    g.fillStyle = rgba('#ffd0b0', .18); g.fillRect(bx, top, 2, bh);
    g.fillStyle = '#25101f'; g.fillRect(bx - 4, top - 10, bw + 8, 12);
    const cw = 34, ch = 47, cols = Math.floor((bw - 16) / cw);
    for (let row = 0; top + 28 + row * ch + 34 < ST - 96; row++) for (let col = 0; col < cols; col++) {
      const wx = bx + 12 + col * cw + 5, wy = top + 28 + row * ch;
      const on = r() < .3, cool = on && r() < .18;
      const wg = g.createLinearGradient(0, wy, 0, wy + 32);
      if (on) { wg.addColorStop(0, cool ? '#bfe0ff' : '#ffe2b0'); wg.addColorStop(1, cool ? '#6aa0e0' : '#ff9a62'); if (!cool) lit.push([wx + 11, wy + 16]); } else { wg.addColorStop(0, '#4a3560'); wg.addColorStop(1, '#1d1230'); }
      g.fillStyle = '#12091a'; g.fillRect(wx - 3, wy - 3, 28, 38);
      g.fillStyle = wg; g.fillRect(wx, wy, 22, 32);
      g.fillStyle = rgba('#12091a', .75); g.fillRect(wx + 10, wy, 2, 32); g.fillRect(wx, wy + 14, 22, 2);
      if (on && r() < .5) { g.fillStyle = rgba('#7a2a3a', .55); g.fillRect(wx, wy, 7 + r() * 6, 32); }
      if (!on) { g.fillStyle = rgba('#c8a0ff', .1); g.beginPath(); g.moveTo(wx, wy + 32); g.lineTo(wx + 9, wy); g.lineTo(wx + 16, wy); g.lineTo(wx + 6, wy + 32); g.fill(); }
      if (r() < .16) { g.fillStyle = '#6a5562'; g.fillRect(wx + 1, wy + 36, 20, 6); g.fillStyle = rgba('#000000', .4); g.fillRect(wx + 1, wy + 40, 20, 2); }
    }
    g.fillStyle = '#160a15'; g.fillRect(bx, ST - 92, bw, 92);   // 1층 가게
    for (let sx = bx + 14; sx + 76 < bx + bw; sx += 92) {
      const warm = r() < .7;
      g.fillStyle = '#0c050b'; g.fillRect(sx - 3, ST - 80, 82, 74);
      const sg = g.createLinearGradient(0, ST - 76, 0, ST - 8); sg.addColorStop(0, warm ? '#ffd9a0' : '#bfe0ff'); sg.addColorStop(1, warm ? '#c8643c' : '#46709e');
      g.fillStyle = sg; g.fillRect(sx, ST - 77, 76, 68); if (warm) lit.push([sx + 38, ST - 44]);
      for (let k = 0; k < 6; k++) { g.fillStyle = k % 2 ? '#e8e0d8' : '#c03a56'; g.fillRect(sx - 4 + k * 14, ST - 92, 14, 14); }
    }
    if (b % 3 === 1) {   // 간판
      g.fillStyle = '#1c0b18'; g.fillRect(bx + 20, ST - 142, bw - 60, 34);
      g.fillStyle = '#ff7aa8'; g.fillRect(bx + 28, ST - 135, bw - 76, 20);
      lit.push([bx + bw / 2, ST - 125]);
    }
    bx += bw + 6 + r() * 6;
  }
  g.globalCompositeOperation = 'lighter';
  lit.forEach(([x, y]) => { const rg = g.createRadialGradient(x, y, 0, x, y, 46); rg.addColorStop(0, rgba('#ff9a62', .3)); rg.addColorStop(1, rgba('#ff9a62', 0)); g.fillStyle = rg; g.fillRect(x - 46, y - 46, 92, 92); });
  g.globalCompositeOperation = 'source-over';
  const st = g.createLinearGradient(0, ST, 0, H); st.addColorStop(0, '#2a1426'); st.addColorStop(1, '#0a050c');
  g.fillStyle = st; g.fillRect(0, ST, W, H - ST);
  lit.forEach(([x, y]) => {   // 젖은 길바닥에 비친 불빛 줄기
    const len = (H - ST) * (.5 + r() * .5), rg = g.createLinearGradient(0, ST, 0, ST + len);
    rg.addColorStop(0, rgba('#ff9a62', .22)); rg.addColorStop(1, rgba('#ff9a62', 0)); g.fillStyle = rg; g.fillRect(x - 5, ST, 10, len);
  });
  for (let i = 0; i < 160; i++) { g.fillStyle = rgba(r() < .5 ? '#ffd0a0' : '#000000', .04 + r() * .1); g.fillRect(r() * W, ST + 4 + r() * (H - ST), 20 + r() * 110, 1 + r() * 2); }
  const vg = g.createRadialGradient(W / 2, H / 2, W * .3, W / 2, H / 2, W * .8); vg.addColorStop(0, rgba('#0a040a', 0)); vg.addColorStop(1, rgba('#0a040a', .55));
  g.fillStyle = vg; g.fillRect(0, 0, W, H);
  const id = g.getImageData(0, 0, W, H), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const n = (r() - .5) * 11; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  g.putImageData(id, 0, 0);
  return c;
}

const ioq = (u) => (u < .5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u));       // power1.inOut 곡선
const zoomShot = (spd, u) => 1 + spd / 100 * SHOT * ioq(u);                  // 샷 하나의 배율. 평균 속도 = spd %/초
const zoomAt = (spd, t) => zoomShot(spd, seg(t, T0, T0 + SHOT));

function makeMeter(src) {   // 사진 → 256×144 → 64×36 회색(자가 보는 그림). 두 번에 나눠 줄여 모래알 같은 흔들림을 막는다
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d', { willReadFrequently: true }); g.imageSmoothingQuality = 'high'; return [c, g]; };
  const [c1, g1] = mk(256, 144), [c2, g2] = mk(64, 36), cache = {};
  const gray = (z) => {
    const sw = SRC_W / z, sh = SRC_H / z;
    g1.drawImage(src, (SRC_W - sw) / 2, (SRC_H - sh) / 2, sw, sh, 0, 0, 256, 144);
    g2.drawImage(c1, 0, 0, 256, 144, 0, 0, 64, 36);
    const d = g2.getImageData(0, 0, 64, 36).data, o = new Float32Array(2304);
    for (let i = 0; i < 2304; i++) o[i] = .299 * d[i * 4] + .587 * d[i * 4 + 1] + .114 * d[i * 4 + 2];
    return o;
  };
  return (spd) => {   // 속도 하나의 샷: 프레임 25장과 프레임 차 24개
    if (cache[spd]) return cache[spd];
    const fr = [], df = [];
    for (let k = 0; k <= N; k++) fr.push(gray(zoomShot(spd, k / N)));
    for (let k = 0; k < N; k++) { let s = 0; for (let i = 0; i < 2304; i++) s += Math.abs(fr[k + 1][i] - fr[k][i]); df.push(s / 2304); }
    return (cache[spd] = { fr, df });
  };
}

const demo = {
  dur: 3.0, rest: 3.0, noCompare: false, levels: 4,
  mount(sp) {
    const src = paintTown(SRC_W, SRC_H), meter = makeMeter(src);
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: `linear-gradient(160deg,${PAL.bg0},${PAL.bg1})` });
    const fr = el('div', null, sp);
    box(fr, { position: 'absolute', left: '14px', top: '14px', width: '372px', height: '209px', borderRadius: '6px', overflow: 'hidden', boxShadow: `0 10px 24px rgba(0,0,0,.5), 0 0 0 1px ${PAL.line}` });
    const cv = el('canvas', null, fr); cv.width = 1280; cv.height = 720; box(cv, { width: '372px', height: '209px', display: 'block' });
    const ov = el('canvas', null, sp); ov.width = 1280; ov.height = 720; box(ov, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const tx = (txt, o) => { const e = el('div', null, sp, txt); box(e, Object.assign({ position: 'absolute', whiteSpace: 'nowrap', font: "500 11px/1.2 'JetBrains Mono',monospace", color: PAL.muted }, o)); return e; };
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '24px', top: '24px', padding: '5px 11px', borderRadius: '999px', background: rgba(PAL.surface, .88), color: PAL.ink, border: `1px solid ${PAL.line}`, font: "600 12px/1 'IBM Plex Sans KR',sans-serif" });
    const t = {
      mlab: tx('프레임 차(0.1초 간격)', { left: '14px', top: '229px' }),
      mval: tx('', { left: '216px', top: '227px', font: "500 14px/1 'JetBrains Mono',monospace", color: PAL.ink }),
      mver: tx('', { left: '286px', top: '228px', font: "700 13px/1 'IBM Plex Sans KR',sans-serif" }),
      mthr: tx(String(STILL_THR), { left: (14 + STILL_THR / MAXD * 372 - 8) + 'px', top: '260px', color: PAL.accent2, font: "500 10px/1 'JetBrains Mono',monospace" }),
      slab: tx('0.1초 칸 24개 (회색 정지, 분홍 움직임)', { left: '14px', top: '277px' }),
      s1: tx('', { left: '14px', top: '312px', color: PAL.ink, font: "500 12px/1.3 'IBM Plex Sans KR',sans-serif" }),
      s2: tx('', { left: '14px', top: '330px', font: "500 11px/1.3 'IBM Plex Sans KR',sans-serif" }),
      c1: tx('자가 보는 그림', { left: '402px', top: '82px' }),
      c2: tx('변한 곳(×8)', { left: '514px', top: '82px' }),
      thead: tx('속도별 정지 비율(이 장면의 계산)', { left: '402px', top: '106px', color: PAL.ink, font: "500 12px/1 'IBM Plex Sans KR',sans-serif" }),
      none: tx('재지 않은 상태: 이 속도가 정지로 읽히는지 아직 모른다', { left: '402px', top: '40px', whiteSpace: 'normal', width: '210px', font: "500 12px/1.5 'IBM Plex Sans KR',sans-serif" }),
      tnote: tx('', { left: '402px', top: '307px', font: "500 10px/1.45 'IBM Plex Sans KR',sans-serif", whiteSpace: 'normal', width: '228px' }),
    };
    const rows = SPEEDS.map((v, i) => ({ lab: tx(v + '%/초', { left: '402px', top: (127 + i * 19) + 'px' }), val: tx('', { left: '598px', top: (127 + i * 19) + 'px', color: PAL.ink }) }));
    const th = document.createElement('canvas'); th.width = 64; th.height = 36;
    return { src, meter, cv, ctx: cv.getContext('2d'), ov: ov.getContext('2d'), pill, t, rows, th: th.getContext('2d') };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 4 : lv);
    const spd = L >= 2 ? SPEED : BASE_SPEED, z = zoomAt(spd, t);
    const g = s.ctx; g.imageSmoothingQuality = 'high';
    const sw = SRC_W / z, sh = SRC_H / z;
    g.drawImage(s.src, (SRC_W - sw) / 2, (SRC_H - sh) / 2, sw, sh, 0, 0, 1280, 720);
    const o = s.ov; o.clearRect(0, 0, 1280, 720);
    const names = [`느린 드리프트 ${BASE_SPEED}%/초 (재지 않음)`, `같은 ${BASE_SPEED}%/초를 자로 잰다`, `${SPEED}%/초로 올려 다시 잰다`, `샷 24칸 전체를 본다`, `속도별로 표를 만든다`];
    s.pill.textContent = names[L];
    const set = (e, on, txt) => { e.style.visibility = on ? 'visible' : 'hidden'; if (txt != null) e.textContent = txt; };
    const m = s.meter(spd), f = Math.floor((t - T0) / (1 / FPS) + 1e-9), cur = Math.min(N - 1, f);
    const diff = cur >= 0 ? m.df[cur] : 0, still = diff < STILL_THR;
    const measuring = L >= 1;
    set(s.t.none, !measuring);
    ['mlab', 'mval', 'mver', 'mthr', 'c1', 'c2'].forEach((k) => set(s.t[k], measuring));
    s.t.mval.textContent = cur >= 0 ? diff.toFixed(2) : '—';
    s.t.mver.textContent = cur >= 0 ? (still ? '정지' : '움직임') : ''; s.t.mver.style.color = still ? PAL.muted : PAL.accent;
    if (measuring) {   // 자가 보는 64×36 그림과 변한 곳
      const k1 = Math.max(0, cur + 1), im = s.th.createImageData(64, 36), im2 = s.th.createImageData(64, 36);
      for (let i = 0; i < 2304; i++) {
        const v = m.fr[k1][i], dv = Math.min(255, Math.abs(m.fr[k1][i] - m.fr[Math.max(0, k1 - 1)][i]) * 8);
        im.data.set([v, v, v, 255], i * 4); im2.data.set([dv, dv * .5, dv * .7, 255], i * 4);
      }
      const tmp = document.createElement('canvas'); tmp.width = 64; tmp.height = 36; const tg = tmp.getContext('2d');
      o.imageSmoothingEnabled = false;
      tg.putImageData(im, 0, 0); o.drawImage(tmp, 804, 28, 208, 117);
      tg.putImageData(im2, 0, 0); o.drawImage(tmp, 1028, 28, 208, 117);
      o.strokeStyle = PAL.line; o.lineWidth = 2; o.strokeRect(804, 28, 208, 117); o.strokeRect(1028, 28, 208, 117);
      const bw = 372 * 2, bx = 28, by = 496;   // 프레임 차 막대(0~5)
      o.fillStyle = rgba(PAL.surface, 1); o.fillRect(bx, by, bw, 20); o.strokeRect(bx, by, bw, 20);
      o.fillStyle = still ? PAL.muted : PAL.accent; o.fillRect(bx, by, Math.min(bw, diff / MAXD * bw), 20);
      o.fillStyle = PAL.accent2; o.fillRect(bx + STILL_THR / MAXD * bw - 1.5, by - 8, 3, 36);
    }
    const strip = L >= 3;
    ['slab', 's1', 's2'].forEach((k) => set(s.t[k], strip));
    if (strip) {
      let c = 0, run = 0, best = 0, pk = 0;
      for (let k = 0; k <= cur; k++) { pk = Math.max(pk, m.df[k]); if (m.df[k] < STILL_THR) { c++; run++; best = Math.max(best, run); } else run = 0; }
      const cw = 372 * 2 / N;
      for (let k = 0; k < N; k++) {
        const done = k <= cur, st = m.df[k] < STILL_THR;
        o.fillStyle = !done ? rgba(PAL.surface, 1) : st ? rgba(PAL.muted, .85) : PAL.accent;
        o.fillRect(28 + k * cw + 1, 582, cw - 3, 26);
      }
      const n = Math.max(1, cur + 1);
      s.t.s1.textContent = `지금까지 정지 ${c}칸 / ${cur + 1}칸 = ${(c / n * 100).toFixed(0)}%`;
      s.t.s2.textContent = `가장 길게 이어진 정지 ${(best / FPS).toFixed(1)}초, 최대 프레임 차 ${pk.toFixed(2)}`;
    }
    const tab = L >= 4;
    set(s.t.thead, tab); set(s.t.tnote, tab);
    s.rows.forEach((rw, i) => {
      const v = SPEEDS[i], d = s.meter(v).df, p = d.filter((x) => x < STILL_THR).length / N * 100;
      set(rw.lab, tab); set(rw.val, tab, p.toFixed(0) + '%');
      if (!tab) return;
      const x0 = 444 * 2, w = 146 * 2, y = (127 + i * 19) * 2;
      o.fillStyle = rgba(PAL.surface, 1); o.fillRect(x0, y - 2, w, 20);
      o.fillStyle = v === SPEED ? PAL.accent : rgba(PAL.muted, .9); o.fillRect(x0, y - 2, p / 100 * w, 20);
      if (REF[v]) { o.fillStyle = PAL.accent2; o.fillRect(x0 + REF[v][0] / 100 * w, y + 20, Math.max(4, (REF[v][1] - REF[v][0]) / 100 * w), 4); }
    });
    s.t.tnote.textContent = '금색 가는 선 = 제작자 기록(2%/초 54~71%, 6%/초 0~4%). 막대는 이 장면을 브라우저가 줄여 계산한 값이라 같지 않을 수 있다.';
  },
};
export default demo;
