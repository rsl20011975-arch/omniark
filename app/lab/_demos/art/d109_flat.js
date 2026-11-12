/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/text-zoom-through/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 큰 글자 "NOW" 의 O 속으로 카메라가 파고든다. 글자와 배경이 함께 커지고, O 의 구멍이 화면을 다 덮으면 그 안에 있던 다음 장면만 남는다. 화면은 시간 t 의 함수다.
const T0 = 1.2, ZDUR = 1.4;   // 확대가 시작하는 시각 · 길이(초)
const ZOOM_END = 12;          // 확대가 끝났을 때의 배율(구멍이 화면을 다 덮을 만큼)
const B_START = 1;          // 구멍 안 다음 장면의 처음 크기(화면 기준, 1 = 원래 크기)
const BLUR = .03;             // 줌 블러 세기(0 = 없음)
const RIN = 48, TH = 26;      // O 고리의 안쪽 반지름 · 두께(px, 640×360 기준)
const DUR = 4.6;
const FONT = '40px "Black Han Sans"';
const A = { top: '#0f1a3a', mid: '#27306e', bot: '#5a3f9a', glow: '150,170,255' };
const B = { top: '#3a1b2c', mid: '#c25b4a', bot: '#f6c079', glow: '255,214,150' };

function cv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

function bg(c, d, grain, label) {
  const x = c.getContext('2d'), W = 1280, H = 720;
  const g = x.createLinearGradient(0, 0, W * .4, H);
  g.addColorStop(0, d.top); g.addColorStop(.58, d.mid); g.addColorStop(1, d.bot);
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  [[760, .5], [250, .4]].forEach(([r, a]) => {
    const rg = x.createRadialGradient(W * .5, H * .45, 0, W * .5, H * .45, r);
    rg.addColorStop(0, `rgba(${d.glow},${a})`); rg.addColorStop(1, `rgba(${d.glow},0)`);
    x.fillStyle = rg; x.fillRect(0, 0, W, H);
  });
  if (label) {
    x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 30; x.shadowOffsetY = 8;
    x.fillStyle = '#fff'; x.textAlign = 'center'; x.font = '110px "Black Han Sans", sans-serif'; x.fillText('NEXT DAY', 640, 375);
    x.shadowColor = 'transparent'; x.fillStyle = 'rgba(255,255,255,.92)'; x.font = '500 34px "IBM Plex Sans KR", sans-serif'; x.fillText('다음 날 아침 8:00', 640, 430);
  }
  x.globalCompositeOperation = 'overlay'; x.globalAlpha = .12;
  for (let px = 0; px < W; px += 256) for (let py = 0; py < H; py += 256) x.drawImage(grain, px, py);
  x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
}

function title(x) {          // 글자 "N ◯ W": O 는 속이 빈 두꺼운 고리로 직접 그린다
  const rout = RIN + TH, cx = 320, cy = 180;
  x.font = '205px "Black Han Sans", sans-serif'; x.textBaseline = 'alphabetic';
  const asc = x.measureText('N').actualBoundingBoxAscent, base = cy + asc / 2;
  const gr = x.createLinearGradient(0, cy - rout, 0, cy + rout);
  gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, '#c9d3ea');
  x.save(); x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 22; x.shadowOffsetY = 6;
  x.fillStyle = gr; x.textAlign = 'right'; x.fillText('N', cx - rout - 12, base);
  x.textAlign = 'left'; x.fillText('W', cx + rout + 12, base);
  x.beginPath(); x.arc(cx, cy, rout, 0, Math.PI * 2); x.arc(cx, cy, RIN, 0, Math.PI * 2, true); x.fill('evenodd');
  x.restore();
  x.lineWidth = 1.2; x.strokeStyle = 'rgba(255,255,255,.7)';
  x.beginPath(); x.arc(cx, cy, RIN, 0, Math.PI * 2); x.stroke();
  x.fillStyle = 'rgba(255,255,255,.9)'; x.textAlign = 'center'; x.font = '500 22px "IBM Plex Sans KR", sans-serif'; x.fillText('오늘의 이야기', cx, cy + rout + 40);
}

const demo = {
  dur: DUR, rest: 4.0, noCompare: false, levels: 3,
  mount(sp) {
    const r = rng(9), grain = cv(256, 256), gx = grain.getContext('2d'), gd = gx.createImageData(256, 256);
    for (let i = 0; i < gd.data.length; i += 4) { const v = r() * 255; gd.data[i] = gd.data[i + 1] = gd.data[i + 2] = v; gd.data[i + 3] = 255; }
    gx.putImageData(gd, 0, 0);
    const main = el('canvas', null, sp);
    main.width = 1280; main.height = 720; Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const pill = el('div', null, sp);
    Object.assign(pill.style, { position: 'absolute', left: '20px', top: '18px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.7)', color: '#fff', font: "500 15px/1 'IBM Plex Sans KR',sans-serif" });
    const track = el('div', null, sp);
    Object.assign(track.style, { position: 'absolute', left: '20px', right: '100px', bottom: '22px', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,.25)' });
    const z = el('div', null, track);
    Object.assign(z.style, { position: 'absolute', top: '0', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,.9)', left: (T0 / DUR * 100) + '%', width: (ZDUR / DUR * 100) + '%' });
    const head = el('div', null, track);
    Object.assign(head.style, { position: 'absolute', top: '-4px', width: '3px', height: '16px', borderRadius: '2px', background: '#fff', boxShadow: '0 0 8px rgba(255,255,255,.7)', zIndex: 3 });
    const s = { main, pill, z, head, a: cv(1280, 720), b: cv(1280, 720), fr: cv(1280, 720), grain, ok: null };
    s.repaint = () => { bg(s.a, A, grain, false); bg(s.b, B, grain, true); };
    s.repaint();
    return s;
  },
  render(s, t, a, lv) {
    const okNow = document.fonts.check(FONT);
    if (s.ok !== okNow) { s.ok = okNow; s.repaint(); }
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 컷, 2 = 글자 확대(구멍 안은 앞 배경), 3 = + 구멍 안에 다음 장면
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
    const zp = (u) => E.inOutC(seg(u, T0, T0 + ZDUR));
    const p = zp(t), sc = L >= 2 ? Math.pow(ZOOM_END, p) : 1;
    const done = L >= 2 ? t >= T0 + ZDUR : t >= T0 + ZDUR / 2;
    const f = s.fr.getContext('2d');
    f.setTransform(2, 0, 0, 2, 0, 0); f.globalCompositeOperation = 'source-over'; f.clearRect(0, 0, 640, 360);
    if (done) f.drawImage(s.b, 0, 0, 640, 360);
    else {
      f.save(); f.translate(320, 180); f.scale(sc, sc); f.translate(-320, -180);
      f.drawImage(s.a, 0, 0, 640, 360);
      if (L >= 3) {
        const bs = lerp(B_START, 1, p);
        f.save(); f.beginPath(); f.arc(320, 180, RIN + 1, 0, Math.PI * 2); f.clip();
        f.translate(320, 180); f.scale(bs / sc, bs / sc); f.translate(-320, -180);   // 확대 변형을 되돌려 화면 기준 크기가 bs 가 되게
        f.drawImage(s.b, 0, 0, 640, 360); f.restore();
      }
      title(f);
      f.restore();
    }
    const v = Math.abs(zp(t + .02) - zp(t - .02)) / .04 * Math.log(ZOOM_END);   // 확대 속도(초당 ln 배율)
    const N = 14, spread = L >= 2 ? BLUR * v : 0;
    for (let k = 0; k < N; k++) {
      const ks = Math.exp((k / (N - 1) - .5) * spread);
      x.save(); x.globalAlpha = 1 / (k + 1);
      x.translate(320, 180); x.scale(ks, ks); x.translate(-320, -180);
      x.drawImage(s.fr, 0, 0, 640, 360); x.restore();
    }
    const inZ = L >= 2 && t > T0 && t < T0 + ZDUR;
    s.pill.textContent = L <= 1 ? '컷 · 효과 없음' : inZ ? (L >= 3 ? `글자 확대 ×${sc.toFixed(1)} · O 의 구멍 안이 다음 장면` : `글자 확대 ×${sc.toFixed(1)} · 구멍 안은 앞 배경`) : t < T0 ? '장면 1 · 제목 카드' : '장면 2';
    s.z.style.display = L >= 2 ? 'block' : 'none';
    s.head.style.left = `calc(${(t / DUR * 100).toFixed(2)}% - 1px)`;
  },
};
export default demo;
