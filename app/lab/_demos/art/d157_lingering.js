/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/flowmap-mouse/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 플로우맵: 커서가 지나간 자리에 ‘움직인 방향’을 색(빨강=가로, 초록=세로)으로 기록하고, 그 기록만큼 그림의 픽셀을 밀어 시간이 지나면 서서히 사라지게 한다. 화면은 시간 t 의 함수다.
const STRENGTH = 28;              // 그림이 밀리는 최대 거리(px)
const FADE = 3.0;                 // 흔적이 완전히 사라지는 데 걸리는 시간(초)
const T0 = .4, PATHT = 2.6;       // 가상 커서가 움직이기 시작하는 시각 · 한 번 지나가는 시간(초)
const PX = 14, PY = 50, PW = 452, PH = 296;     // 그림 패널 위치와 크기
const IW = 300, IH = 196, GW = 57, GH = 38;      // 그림 해상도 · 플로우맵 칸 수
const SIG = 16, RAD = 3;           // 커서 주변 기록 폭(px) · 기록 범위(σ 배수)
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.5'/></svg>\")";
const box = (e, o) => Object.assign(e.style, o);
const cur = (t) => { const u = E.inOutC(seg(t, T0, T0 + PATHT)); return [56 + 340 * u + 26 * Math.sin(u * 8.5), 148 + 76 * Math.sin(u * 7 + .4)]; };   // 가상 커서 경로(그림 패널 안 좌표)

function artwork() {   // 일그러짐이 잘 보이도록 원·격자·그라디언트로 그린 원본 그림
  const cv = document.createElement('canvas'); cv.width = IW; cv.height = IH;
  const g = cv.getContext('2d'), r = rng(8);
  const bg = g.createLinearGradient(0, 0, IW, IH); bg.addColorStop(0, '#0f2a6b'); bg.addColorStop(.55, '#6b2fb0'); bg.addColorStop(1, '#ea5a7e');
  g.fillStyle = bg; g.fillRect(0, 0, IW, IH);
  const gl = g.createRadialGradient(150, 98, 4, 150, 98, 130); gl.addColorStop(0, 'rgba(255,200,100,.65)'); gl.addColorStop(1, 'rgba(255,200,100,0)');
  g.fillStyle = gl; g.fillRect(0, 0, IW, IH);
  g.strokeStyle = 'rgba(255,255,255,.22)'; g.lineWidth = 1;
  for (let x = 0; x <= IW; x += 20) { g.beginPath(); g.moveTo(x + .5, 0); g.lineTo(x + .5, IH); g.stroke(); }
  for (let y = 0; y <= IH; y += 20) { g.beginPath(); g.moveTo(0, y + .5); g.lineTo(IW, y + .5); g.stroke(); }
  g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 2;
  for (let k = 1; k <= 6; k++) { g.beginPath(); g.arc(150, 98, k * 15, 0, 6.2832); g.stroke(); }
  g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.arc(150, 98, 6, 0, 6.2832); g.fill();
  for (let i = 0; i < 1500; i++) { g.fillStyle = `rgba(255,255,255,${(r() * .05).toFixed(3)})`; g.fillRect(r() * IW, r() * IH, 1, 1); }
  return cv;
}

const demo = {
  dur: 5, rest: 4.3, noCompare: false, levels: 3,
  mount(sp) {
    const bg = el('div', null, sp);
    box(bg, { position: 'absolute', inset: '0', background: 'linear-gradient(160deg,#0b0f1a 0%,#161d30 100%)' });
    box(el('div', null, bg), { position: 'absolute', inset: '0', backgroundImage: GRAIN, opacity: '.06', mixBlendMode: 'overlay' });
    const side = el('div', null, sp);
    box(side, { position: 'absolute', left: '478px', top: '50px', width: '148px', height: '296px', borderRadius: '12px', background: 'rgba(255,255,255,.045)', border: '1px solid rgba(255,255,255,.09)' });
    const cv = el('canvas', null, sp); cv.width = 1280; cv.height = 720;
    const tx = (x, y, s, sz, col, f, w) => { const e = el('div', null, sp, s); box(e, { position: 'absolute', left: x + 'px', top: y + 'px', font: `${w || 400} ${sz}px/1.3 ${f || "'IBM Plex Sans KR',sans-serif"}`, color: col, width: '132px' }); return e; };
    tx(488, 58, '플로우맵', 12.5, '#fff', null, 700); tx(488, 76, '커서가 지나간 방향 기록', 9.5, 'rgba(255,255,255,.62)');
    const rd = [0, 1, 2, 3].map((k) => tx(488, 190 + k * 15, '', 10, k === 0 ? '#ffe27a' : 'rgba(255,255,255,.8)', "'JetBrains Mono',monospace"));
    const nt = [0, 1, 2, 3].map((k) => tx(488, 262 + k * 14, '', 9.5, 'rgba(255,255,255,.68)'));
    const pill = el('div', null, sp);
    box(pill, { position: 'absolute', left: '20px', top: '12px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.66)', color: '#fff', font: "500 14px/1 'IBM Plex Sans KR',sans-serif", zIndex: 5 });
    const art = artwork(), sctx = art.getContext('2d'), src = sctx.getImageData(0, 0, IW, IH).data;
    const smp = []; for (let i = 0; i <= 5 * 30; i++) { const ts = i / 30, p = cur(ts), q = cur(Math.max(0, ts - 1 / 30)); smp.push({ ts, x: p[0], y: p[1], vx: (p[0] - q[0]) * 30 / 500, vy: (p[1] - q[1]) * 30 / 500 }); }
    const off = document.createElement('canvas'); off.width = IW; off.height = IH;
    const fm = document.createElement('canvas'); fm.width = GW; fm.height = GH;
    return { cv, ctx: cv.getContext('2d'), art, src, off, fm, smp, F: new Float32Array(GW * GH * 2), rd, nt, pill };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 가상 커서만, 2 = + 플로우맵 기록, 3 = + 그 기록만큼 그림을 밀어 일그러뜨림
    const c = s.ctx, F = s.F; F.fill(0);
    c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, 640, 360);
    // 플로우맵 기록: 지나간 자리마다 속도 방향을 더하고 시간이 지날수록 약해진다
    let maxv = 0, cells = 0;
    const cw = PW / (GW - 1), chh = PH / (GH - 1);
    if (L >= 2) {
      s.smp.forEach((p) => {
        const age = t - p.ts; if (age < 0 || age >= FADE) return;
        const w = Math.pow(1 - age / FADE, 2) * 1.1, gx0 = Math.max(0, Math.floor((p.x - SIG * RAD) / cw)), gx1 = Math.min(GW - 1, Math.ceil((p.x + SIG * RAD) / cw)), gy0 = Math.max(0, Math.floor((p.y - SIG * RAD) / chh)), gy1 = Math.min(GH - 1, Math.ceil((p.y + SIG * RAD) / chh));
        for (let gy = gy0; gy <= gy1; gy++) for (let gx = gx0; gx <= gx1; gx++) { const dx = gx * cw - p.x, dy = gy * chh - p.y, k = Math.exp(-(dx * dx + dy * dy) / (2 * SIG * SIG)) * w, i = (gy * GW + gx) * 2; F[i] += p.vx * k; F[i + 1] += p.vy * k; }
      });
      for (let i = 0; i < GW * GH; i++) { const m = Math.hypot(F[2 * i], F[2 * i + 1]); if (m > 1) { F[2 * i] /= m; F[2 * i + 1] /= m; } if (m > .02) cells++; maxv = Math.max(maxv, Math.min(1, m)); }
    }
    // 그림(필요하면 밀어서)
    const octx = s.off.getContext('2d');
    if (L >= 3 && maxv > .004) {
      const out = octx.createImageData(IW, IH), o = out.data, S = s.src, k = STRENGTH * IW / PW;
      for (let y = 0; y < IH; y++) for (let x = 0; x < IW; x++) {
        const gxf = x / (IW - 1) * (GW - 1), gyf = y / (IH - 1) * (GH - 1), gx = Math.min(GW - 2, gxf | 0), gy = Math.min(GH - 2, gyf | 0), fx = gxf - gx, fy = gyf - gy, i = (gy * GW + gx) * 2;
        const vx = (F[i] * (1 - fx) + F[i + 2] * fx) * (1 - fy) + (F[i + GW * 2] * (1 - fx) + F[i + GW * 2 + 2] * fx) * fy, vy = (F[i + 1] * (1 - fx) + F[i + 3] * fx) * (1 - fy) + (F[i + GW * 2 + 1] * (1 - fx) + F[i + GW * 2 + 3] * fx) * fy;
        const sx = Math.min(IW - 1.001, Math.max(0, x - k * vx)), sy = Math.min(IH - 1.001, Math.max(0, y - k * vy)), x0 = sx | 0, y0 = sy | 0, ax = sx - x0, ay = sy - y0, j = (y * IW + x) * 4;
        for (let ch = 0; ch < 3; ch++) { const q = (y0 * IW + x0) * 4 + ch; o[j + ch] = (S[q] * (1 - ax) + S[q + 4] * ax) * (1 - ay) + (S[q + IW * 4] * (1 - ax) + S[q + IW * 4 + 4] * ax) * ay; }
        o[j + 3] = 255;
      }
      octx.putImageData(out, 0, 0);
    } else { octx.drawImage(s.art, 0, 0); }
    c.save(); c.beginPath(); c.rect(PX, PY, PW, PH); c.clip(); c.imageSmoothingQuality = 'high'; c.drawImage(s.off, PX, PY, PW, PH); c.restore();
    c.strokeStyle = 'rgba(255,255,255,.12)'; c.lineWidth = 1; c.strokeRect(PX + .5, PY + .5, PW - 1, PH - 1);
    // 오른쪽 작은 플로우맵(빨강 = 가로, 초록 = 세로, 회색 = 흐름 없음)
    const fctx = s.fm.getContext('2d'), fi = fctx.createImageData(GW, GH);
    for (let i = 0; i < GW * GH; i++) { fi.data[4 * i] = 128 + 127 * F[2 * i]; fi.data[4 * i + 1] = 128 + 127 * F[2 * i + 1]; fi.data[4 * i + 2] = 128; fi.data[4 * i + 3] = 255; }
    fctx.putImageData(fi, 0, 0);
    c.save(); c.beginPath(); c.rect(486, 100, 132, 86); c.clip(); c.imageSmoothingEnabled = true; c.drawImage(s.fm, 486, 100, 132, 86); c.restore();
    c.strokeStyle = 'rgba(255,255,255,.25)'; c.strokeRect(486.5, 100.5, 131, 85);
    // 가상 커서(꼬리 + 화살표)
    const [cx0, cy0] = cur(t), cx = PX + cx0, cy = PY + cy0;
    for (let k = 12; k >= 1; k--) { const p = cur(Math.max(0, t - k / 30)), q = cur(Math.max(0, t - (k - 1) / 30)); c.strokeStyle = `rgba(255,255,255,${((1 - k / 13) * .55).toFixed(3)})`; c.lineWidth = 4 * (1 - k / 14); c.lineCap = 'round'; c.beginPath(); c.moveTo(PX + p[0], PY + p[1]); c.lineTo(PX + q[0], PY + q[1]); c.stroke(); }
    const rg = c.createRadialGradient(cx, cy, 2, cx, cy, 18); rg.addColorStop(0, 'rgba(160,230,255,.55)'); rg.addColorStop(1, 'rgba(160,230,255,0)'); c.fillStyle = rg; c.beginPath(); c.arc(cx, cy, 18, 0, 6.2832); c.fill();
    c.save(); c.translate(cx, cy); c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 6; c.fillStyle = '#fff'; c.strokeStyle = '#0b0f1a'; c.lineWidth = 1.4; c.lineJoin = 'round';
    c.beginPath(); [[0, 0], [0, 17], [4.4, 13], [7.4, 19.6], [10.2, 18.4], [7.3, 12], [12.8, 12]].forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.closePath(); c.fill(); c.stroke(); c.restore();
    const sp0 = Math.hypot(cx0 - cur(Math.max(0, t - 1 / 30))[0], cy0 - cur(Math.max(0, t - 1 / 30))[1]) * 30;
    s.rd[0].textContent = `커서 속도 ${Math.round(sp0)}px/초`; s.rd[1].textContent = L >= 2 ? `기록된 칸 ${cells}개` : '기록 안 함'; s.rd[2].textContent = L >= 3 ? `최대 이동 ${STRENGTH}px` : '그림 안 밀림'; s.rd[3].textContent = L >= 2 ? `흔적 지속 ${FADE}초` : '';
    const nts = L <= 1 ? ['커서 위치만 따라 빛이', '움직입니다. 지나간 방향은', '어디에도 남지 않아', '그림이 그대로예요.'] : ['회색 = 흐름 없음', '빨강 = 가로 방향', '초록 = 세로 방향', '시간이 지나면 회색으로'];
    s.nt.forEach((e, k) => { e.textContent = nts[k]; });
    s.pill.textContent = L <= 1 ? '연출 전 · 가상 커서만 움직이고 그림은 그대로' : L === 2 ? '커서가 지난 방향을 플로우맵에 기록' : '플로우맵만큼 그림이 밀렸다가 제자리로 돌아옴';
  },
};
export default demo;
