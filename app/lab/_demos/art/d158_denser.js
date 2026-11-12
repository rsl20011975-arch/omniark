/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/smoke-aura/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, rng, canvas, rr } from "./helpers.js";

// 연기는 입자 수십 개를 위로 올리며 키우고 흐려 사라지게 한 것, 오라는 반지름이 다른 빛무리를 겹쳐 맥박처럼 뛰게 한 것이다. 입자는 mount 에서 미리 뽑고 화면은 시간 t 의 함수다.
const EMIT = 34;        // 연기 입자가 1초에 나오는 개수
const AURA_R = 70;      // 오라 안쪽 빛무리의 반지름(px)
const LIFE = 3.2;       // 입자 하나가 살아 있는 시간(초)
const RISE = 150;       // 입자가 위로 올라가는 거리(px)
const PULSE = 1.6;      // 오라가 한 번 맥박 치는 시간(초)
const SX = 320, SY = 244;   // 불씨 구슬 중심
const DUR = 4.4;

function vnoise(seedN, L) {
  const r = rng(seedN), g = Array.from({ length: L * L }, () => r());
  const sm = (a) => a * a * (3 - 2 * a);
  return (u, v) => {
    const i = Math.floor(u), j = Math.floor(v), fu = sm(u - i), fv = sm(v - j);
    const a = g[(j % L) * L + (i % L)], b = g[(j % L) * L + ((i + 1) % L)], c = g[((j + 1) % L) * L + (i % L)], d = g[((j + 1) % L) * L + ((i + 1) % L)];
    return lerp(lerp(a, b, fu), lerp(c, d, fu), fv);
  };
}
function puff(seedN) {            // 가장자리가 구름처럼 일렁이는 부드러운 연기 조각 그림 하나
  const S = 96, cv = document.createElement('canvas'); cv.width = cv.height = S;
  const x = cv.getContext('2d'), im = x.createImageData(S, S), n = vnoise(seedN, 16);
  for (let y = 0; y < S; y++) for (let xx = 0; xx < S; xx++) {
    const dx = (xx - S / 2) / (S / 2), dy = (y - S / 2) / (S / 2), d = Math.sqrt(dx * dx + dy * dy);
    const nn = .5 * n(xx / S * 3, y / S * 3) + .32 * n(xx / S * 6, y / S * 6) + .18 * n(xx / S * 12, y / S * 12);
    const a = Math.max(0, Math.min(1, (1 - d) * 1.7)) * (.25 + 1.0 * nn);
    const k = (y * S + xx) * 4; im.data[k] = 168; im.data[k + 1] = 176; im.data[k + 2] = 196; im.data[k + 3] = Math.min(255, a * 255);
  }
  x.putImageData(im, 0, 0); return cv;
}
const pillDraw = (c, text) => {
  c.font = "500 14px 'IBM Plex Sans KR',sans-serif"; const w = c.measureText(text).width + 26;
  rr(c, 16, 14, w, 28, 14); c.fillStyle = 'rgba(8,10,20,.74)'; c.fill();
  c.fillStyle = '#fff'; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillText(text, 29, 29);
};

const demo = {
  dur: DUR, rest: 3.6, noCompare: false, levels: 4,
  mount(sp) {
    sp.style.background = '#0b0f1a';
    const c = canvas(sp), r = rng(7), N = Math.ceil((DUR + LIFE) * EMIT);
    const sprites = [puff(11), puff(23), puff(37)];
    const ps = Array.from({ length: N }, (_, k) => ({
      ts: -LIFE + k / EMIT, dir: r() * 2 - 1, amp: 8 + r() * 16, fr: .8 + r() * 1.1, ph: r() * 6.28, rot: (r() * 2 - 1) * 1.2, rot0: r() * 6.28,
      sz: .8 + r() * .5, spr: sprites[k % 3],
    }));
    const gr = document.createElement('canvas'); gr.width = gr.height = 128; const gx = gr.getContext('2d'), gi = gx.createImageData(128, 128), q = rng(3);
    for (let i = 0; i < 128 * 128; i++) { const v = q() > .5 ? 255 : 0; gi.data[i * 4] = gi.data[i * 4 + 1] = gi.data[i * 4 + 2] = v; gi.data[i * 4 + 3] = 14 + q() * 12; }
    gx.putImageData(gi, 0, 0);
    return { c, ps, gr };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv - 1);   // 0 = 불씨만, 1 = 연기(직선·같은 크기), 2 = + 퍼지고 흔들리며 사라짐, 3 = + 오라
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, 640, 360);
    let g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, '#0b0f1a'); g.addColorStop(1, '#141c30'); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
    g = c.createRadialGradient(SX, SY + 30, 10, SX, SY + 30, 300); g.addColorStop(0, 'rgba(255,140,70,.10)'); g.addColorStop(1, 'rgba(255,140,70,0)'); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
    // 바닥과 받침대(접지 그림자 + 윗면에 닿는 빛)
    g = c.createLinearGradient(0, 284, 0, 360); g.addColorStop(0, '#1b2438'); g.addColorStop(1, '#0d1220'); c.fillStyle = g; c.fillRect(0, 284, 640, 76);
    c.fillStyle = 'rgba(255,255,255,.07)'; c.fillRect(0, 284, 640, 1);
    g = c.createRadialGradient(SX, 292, 4, SX, 292, 70); g.addColorStop(0, 'rgba(0,0,0,.6)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    c.save(); c.translate(0, 292); c.scale(1, .22); c.translate(0, -292); c.fillStyle = g; c.fillRect(SX - 80, 200, 160, 180); c.restore();
    g = c.createLinearGradient(SX - 38, 0, SX + 38, 0); g.addColorStop(0, '#222c44'); g.addColorStop(.45, '#344059'); g.addColorStop(1, '#1a2236');
    rr(c, SX - 36, 268, 72, 20, 4); c.fillStyle = g; c.fill();
    c.fillStyle = 'rgba(255,255,255,.16)'; c.fillRect(SX - 33, 268, 66, 2);
    // 불씨 구슬(광원 왼쪽 위, 중심 밝고 가장자리 어두움, 작은 반사점)
    g = c.createRadialGradient(SX - 5, SY - 6, 1, SX, SY, 21); g.addColorStop(0, '#fff6d6'); g.addColorStop(.35, '#ffb347'); g.addColorStop(.8, '#e5532d'); g.addColorStop(1, '#7a1d12');
    c.beginPath(); c.arc(SX, SY + 4, 21, 0, 6.2832); c.fillStyle = g; c.fill();
    c.beginPath(); c.arc(SX - 8, SY - 4, 4, 0, 6.2832); c.fillStyle = 'rgba(255,255,255,.75)'; c.fill();

    if (L >= 1) {
      for (const p of s.ps) {
        const age = t - p.ts; if (age < 0 || age > LIFE) continue;
        const u = age / LIFE;
        if (L === 1) {          // 기본 연기: 직선으로 올라가고 크기·진하기가 그대로이다가 갑자기 사라짐
          const y = SY - 26 - RISE * u;
          c.globalAlpha = .55; c.beginPath(); c.arc(SX, y, 14, 0, 6.2832); c.fillStyle = '#9aa3b8'; c.fill(); c.globalAlpha = 1;
          continue;
        }
        const y = SY - 26 - RISE * (1 - Math.pow(1 - u, 1.5));
        const x = SX + p.dir * 70 * u + 30 * u * u + p.amp * 1.4 * Math.sin(p.fr * u * 6.2832 + p.ph) * (.25 + u);
        const rad = (11 + 40 * Math.pow(u, .8)) * p.sz;
        const al = .62 * seg(u, 0, .14) * Math.pow(1 - u, 1.4);
        c.globalAlpha = al; c.save(); c.translate(x, y); c.rotate(p.rot0 + p.rot * u);
        c.drawImage(p.spr, -rad, -rad, rad * 2, rad * 2); c.restore();
      }
      c.globalAlpha = 1;
    }
    if (L >= 3) {
      c.globalCompositeOperation = 'lighter';
      [[1, .5, '255,150,70'], [1.8, .26, '255,120,60'], [3, .13, '255,170,110']].forEach(([m, al, col], i) => {
        const ph = .5 + .5 * Math.sin(6.2832 * (t / PULSE - i * .18)), R = AURA_R * m * (1 + .09 * ph);
        g = c.createRadialGradient(SX, SY, R * .05, SX, SY, R); g.addColorStop(0, `rgba(${col},${(al * (.75 + .25 * ph)).toFixed(3)})`); g.addColorStop(1, `rgba(${col},0)`);
        c.fillStyle = g; c.fillRect(SX - R, SY - R, R * 2, R * 2);
      });
      const pr = (t / PULSE) % 1, R2 = AURA_R * (.6 + 1.8 * E.outC(pr));      // 바깥으로 퍼져 나가는 얇은 링
      c.strokeStyle = `rgba(255,190,130,${(.55 * (1 - pr)).toFixed(3)})`; c.lineWidth = 1.5; c.beginPath(); c.arc(SX, SY, R2, 0, 6.2832); c.stroke();
      c.globalCompositeOperation = 'source-over';
    }
    c.globalAlpha = 1; c.fillStyle = c.createPattern(s.gr, 'repeat'); c.fillRect(0, 0, 640, 360);
    pillDraw(c, ['연출 전: 불씨 하나, 연기·오라 없음', '1단계: 같은 크기 연기가 일직선으로 올라감', '2단계: 퍼지고 흔들리며 사라지는 연기', '3단계: + 오라(반지름 다른 빛무리 3겹)'][L]);
  },
};
export default demo;
