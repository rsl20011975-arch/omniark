/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/film-burn/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 옛 필름이 영사기 불빛에 타들어 가듯, 한 점에서 불규칙한 구멍이 번지며 가장자리가 검게 그을고 주황·노랑을 거쳐 하얗게 날아간 뒤 다음 장면이 나타난다. 화면은 시간 t 의 함수다.
const T0 = 1.2, BURN = 1.6;   // 타기 시작하는 시각 · 번지는 데 걸리는 시간(초)
const OX = .5, OY = .5;     // 타기 시작하는 점의 위치(화면 가로·세로 비율, 0~1)
const RANGE = 2, LAG = .5;    // 불길이 훑는 전체 범위 · 하얗게 탄 뒤 다음 장면이 나타나기 시작하는 늦춤(같은 단위)
const SOFT = .16;             // 다음 장면이 나타나는 경계의 폭
const DUR = 4.6;
const FONT = '40px "Black Han Sans"';
const LW = 320, LH = 180;
const PAL = { bg0: '#0c1814', bg1: '#15271f', ink: '#e8f1ea', muted: '#86a091', accent: '#7fe0a8', accent2: '#e8d27a', surface: '#12231c', line: 'rgba(232,241,234,.22)' };
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const A = { n: 'SUMMER 1998', c: '그해 여름 · 할머니 댁', top: '#2a1a10', mid: '#8a5a30', bot: '#e4b878', glow: '255,214,150' };
const B = { n: 'TODAY', c: '오늘 · 서울', top: PAL.bg0, mid: '#1d5a43', bot: '#8fe6b8', glow: '200,255,225' };
const RAMP = [[0, 30, 10, 6], [.05, 70, 20, 8], [.1, 205, 60, 10], [.2, 255, 130, 25], [.32, 255, 205, 80], [.46, 255, 245, 220], [.6, 255, 252, 240]];

function cv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

function paint(c, d, grain) {
  const x = c.getContext('2d'), W = 1280, H = 720;
  const g = x.createLinearGradient(0, 0, W * .4, H);
  g.addColorStop(0, d.top); g.addColorStop(.58, d.mid); g.addColorStop(1, d.bot);
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  [[760, .5], [260, .4]].forEach(([r, a]) => {
    const rg = x.createRadialGradient(W * .72, H * .25, 0, W * .72, H * .25, r);
    rg.addColorStop(0, `rgba(${d.glow},${a})`); rg.addColorStop(1, `rgba(${d.glow},0)`);
    x.fillStyle = rg; x.fillRect(0, 0, W, H);
  });
  x.beginPath(); x.moveTo(0, H);
  for (let px = 0; px <= W; px += 16) x.lineTo(px, 560 + Math.sin(px / 150) * 30 + Math.sin(px / 57) * 8);
  x.lineTo(W, H); x.closePath(); x.fillStyle = rgba(PAL.bg0, .8); x.fill();
  x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 30; x.shadowOffsetY = 8;
  x.fillStyle = PAL.ink; x.textAlign = 'left'; x.font = '140px "Black Han Sans", sans-serif'; x.fillText(d.n, 70, 270);
  x.shadowColor = 'transparent'; x.fillStyle = rgba(PAL.ink, .92); x.font = '500 42px "IBM Plex Sans KR", sans-serif'; x.fillText(d.c, 76, 336);
  x.globalCompositeOperation = 'overlay'; x.globalAlpha = .14;
  for (let px = 0; px < W; px += 256) for (let py = 0; py < H; py += 256) x.drawImage(grain, px, py);
  x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
}

function noiseField(r) {               // 크기가 다른 매끈한 무작위 무늬 3겹 → 0~1
  const out = new Float32Array(LW * LH), oct = [[9, 6, .55], [18, 12, .3], [36, 24, .15]];
  oct.forEach(([gw, gh, wt]) => {
    const g = Array.from({ length: (gw + 1) * (gh + 1) }, () => r());
    for (let j = 0; j < LH; j++) for (let i = 0; i < LW; i++) {
      const u = i / LW * gw, v = j / LH * gh, i0 = Math.floor(u), j0 = Math.floor(v), fu = u - i0, fv = v - j0;
      const su = fu * fu * (3 - 2 * fu), sv = fv * fv * (3 - 2 * fv), G = (a, b) => g[b * (gw + 1) + a];
      out[j * LW + i] += wt * lerp(lerp(G(i0, j0), G(i0 + 1, j0), su), lerp(G(i0, j0 + 1), G(i0 + 1, j0 + 1), su), sv);
    }
  });
  return out;
}

function heat(d) {
  for (let k = 1; k < RAMP.length; k++) if (d <= RAMP[k][0]) { const a = RAMP[k - 1], b = RAMP[k], q = (d - a[0]) / (b[0] - a[0]); return [lerp(a[1], b[1], q), lerp(a[2], b[2], q), lerp(a[3], b[3], q)]; }
  return RAMP[RAMP.length - 1].slice(1);
}

const demo = {
  dur: DUR, rest: 4.2, noCompare: false, levels: 3,
  mount(sp) {
    const r = rng(14), grain = cv(256, 256), gx = grain.getContext('2d'), gd = gx.createImageData(256, 256);
    for (let i = 0; i < gd.data.length; i += 4) { const v = r() * 255; gd.data[i] = gd.data[i + 1] = gd.data[i + 2] = v; gd.data[i + 3] = 255; }
    gx.putImageData(gd, 0, 0);
    const nz = noiseField(r), fld = new Float32Array(LW * LH);
    const mx = Math.hypot(Math.max(OX, 1 - OX) * LW, Math.max(OY, 1 - OY) * LH * 1.2);   // 시작점에서 가장 먼 모서리까지 거리
    for (let j = 0; j < LH; j++) for (let i = 0; i < LW; i++) fld[j * LW + i] = Math.hypot(i - OX * LW, (j - OY * LH) * 1.2) / mx + (nz[j * LW + i] - .5) * .5;
    const rnd = Array.from({ length: 400 }, () => r());
    const main = el('canvas', null, sp);
    main.width = 1280; main.height = 720; Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const css = (e, o) => Object.assign(e.style, o);
    // 세로 이름표: 왼쪽 가장자리 탭, 번호는 muted, 지금 상태는 ink
    const lab = el('div', null, sp);
    css(lab, { position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', writingMode: 'vertical-rl', letterSpacing: '.08em', padding: '10px 5px 10px 6px', borderRadius: '0 4px 4px 0', background: rgba(PAL.bg0, .6), borderRight: `1px solid ${PAL.line}`, whiteSpace: 'nowrap' });
    const idx = el('span', null, lab);
    css(idx, { color: PAL.muted, font: "500 12px/1 'JetBrains Mono',monospace", marginBottom: '8px' });
    const pill = el('span', null, lab);
    css(pill, { color: PAL.ink, font: "500 12px/1 'IBM Plex Sans KR',sans-serif" });
    const mono = el('div', null, sp);
    css(mono, { position: 'absolute', right: '20px', top: '18px', padding: '6px 10px', borderRadius: '2px', borderLeft: `3px solid ${PAL.accent}`, background: PAL.surface, color: PAL.ink, font: "600 12px/1 'JetBrains Mono',monospace", opacity: '0' });
    const track = el('div', null, sp);
    css(track, { position: 'absolute', left: '36px', right: '100px', bottom: '22px', height: '6px', borderRadius: '3px', background: rgba(PAL.bg0, .6), boxShadow: `0 0 0 1px ${PAL.line}` });
    const z = el('div', null, track);
    css(z, { position: 'absolute', top: '0', height: '6px', borderRadius: '3px', background: PAL.accent, left: (T0 / DUR * 100) + '%', width: (BURN / DUR * 100) + '%' });
    const head = el('div', null, track);
    css(head, { position: 'absolute', top: '-4px', width: '3px', height: '14px', borderRadius: '2px', background: PAL.ink, boxShadow: `0 0 8px ${rgba(PAL.ink, .7)}` });
    const s = { main, pill, idx, mono, z, head, fld, rnd, grain, a: cv(1280, 720), b: cv(1280, 720), ov: cv(LW, LH), mk: cv(LW, LH), tmp: cv(1280, 720), ok: null };
    s.repaint = () => { paint(s.a, A, grain); paint(s.b, B, grain); };
    s.repaint();
    return s;
  },
  render(s, t, a, lv) {
    const okNow = document.fonts.check(FONT);
    if (s.ok !== okNow) { s.ok = okNow; s.repaint(); }
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 컷, 2 = 타들어 가는 번짐, 3 = + 필름 입자·깜빡임·긁힘·빛 번짐
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1; x.filter = 'none';
    const p1 = E.inOutC(seg(t, T0, T0 + BURN)), F1 = p1 * RANGE, F2 = F1 - LAG;
    const on = L >= 2 && t > T0 && t < T0 + BURN + .6;
    const cut = T0 + BURN / 2;
    let pct = 0;
    if (L < 2) x.drawImage(t >= cut ? s.b : s.a, 0, 0, 640, 360);
    else if (!on) x.drawImage(t <= T0 ? s.a : s.b, 0, 0, 640, 360);
    else {
      const od = s.ov.getContext('2d'), md = s.mk.getContext('2d'), oi = od.createImageData(LW, LH), mi = md.createImageData(LW, LH);
      let burnt = 0;
      for (let i = 0; i < LW * LH; i++) {
        const f = s.fld[i], d1 = F1 - f, d2 = F2 - f;
        if (d1 > 0) {
          burnt++;
          const c = heat(d1);
          oi.data[i * 4] = c[0]; oi.data[i * 4 + 1] = c[1]; oi.data[i * 4 + 2] = c[2];
          const e = Math.min(1, d1 / .025); oi.data[i * 4 + 3] = 255 * e * e * (3 - 2 * e);
        }
        const q = Math.min(1, Math.max(0, d2 / SOFT));
        mi.data[i * 4] = mi.data[i * 4 + 1] = mi.data[i * 4 + 2] = 255; mi.data[i * 4 + 3] = 255 * q * q * (3 - 2 * q);
      }
      pct = Math.round(burnt / (LW * LH) * 100);
      od.putImageData(oi, 0, 0); md.putImageData(mi, 0, 0);
      x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
      x.drawImage(s.a, 0, 0, 640, 360);
      x.drawImage(s.ov, 0, 0, 640, 360);
      if (L >= 3) {                                      // 타는 곳에서 번져 나오는 빛(블러를 겹쳐 더하기)
        x.save(); x.globalCompositeOperation = 'lighter'; x.globalAlpha = .55; x.filter = 'blur(9px)'; x.drawImage(s.ov, 0, 0, 640, 360);
        x.filter = 'blur(22px)'; x.globalAlpha = .4; x.drawImage(s.ov, 0, 0, 640, 360); x.restore();
      }
      const tx = s.tmp.getContext('2d');
      tx.globalCompositeOperation = 'source-over'; tx.clearRect(0, 0, 1280, 720); tx.drawImage(s.b, 0, 0);
      tx.globalCompositeOperation = 'destination-in'; tx.imageSmoothingEnabled = true; tx.imageSmoothingQuality = 'high'; tx.drawImage(s.mk, 0, 0, 1280, 720);
      tx.globalCompositeOperation = 'source-over';
      x.drawImage(s.tmp, 0, 0, 640, 360);
    }
    if (L >= 3) {                                        // 필름 질감: 24프레임 단위로 바뀌는 입자·깜빡임·긁힘
      const fr = Math.floor(t * 24), R = s.rnd, rr = (n) => R[(fr * 13 + n * 5) % 400];
      x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = .14;
      x.drawImage(s.grain, -rr(1) * 200, -rr(2) * 200, 1024, 1024); x.restore();
      x.fillStyle = `rgba(0,0,0,${(.05 * rr(3)).toFixed(3)})`; x.fillRect(0, 0, 640, 360);
      x.fillStyle = 'rgba(255,255,255,.12)';
      for (let k = 0; k < 3; k++) if (rr(10 + k) > .5) x.fillRect(Math.floor(rr(20 + k) * 640), 0, .8, 360);
    }
    s.idx.textContent = L <= 1 ? '01' : on && p1 < 1 ? '02' : on ? '03' : '01';
    s.pill.textContent = L <= 1 ? '컷 효과 없음' : on && p1 < 1 ? '필름 번 타들어 가는 중' : on ? '다음 장면이 나타남' : t <= T0 ? '장면 1 옛 영상' : '장면 2 오늘';
    s.mono.style.opacity = on ? 1 : 0; s.mono.textContent = `화면의 ${pct}% 탐`;
    s.z.style.display = L >= 2 ? 'block' : 'none';
    s.head.style.left = `calc(${(t / DUR * 100).toFixed(2)}% - 1px)`;
  },
};
export default demo;
