/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/clip-repeat/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 1.2초짜리 구간(공이 왼쪽 끝에서 오른쪽 끝으로 굴러감)을 여러 번 되풀이해 재생한다. ① 한 번만 → ② 그대로 반복(끝에서 처음으로 튐) → ③ 왕복(정방향·역방향 번갈아, 튐 없음). 화면은 시간 t 의 함수다.
const CLIP = .6;             // 되풀이할 구간의 길이(초)
const REPEAT = 3;             // 되풀이 횟수(구간을 모두 몇 번 재생할지)
const T0 = .4;                // 영상이 시작하고 구간이 재생되기 시작하는 시각(초)
const DUR = 6.4;              // 데모 길이 = 타임라인이 나타내는 시간(초)
const XA = 120, XB = 480;     // 구간의 첫 프레임·끝 프레임에서 공의 위치(px, 640×360 기준)
const TX = 40, TW = 560;      // 타임라인 가로 시작·폭
const FONT = '12px "IBM Plex Sans KR"';
const PAL = { bg0: '#eef2f7', bg1: '#dfe6f0', ink: '#0f1b2d', muted: '#5a6a80', accent: '#2b6cff', accent2: '#ff8a3d', surface: '#ffffff', line: 'rgba(15,27,45,.18)' };
const BAD = '#d92d20', OKC = '#0f8a47';   // 이음새 판정 표시색(튐 / 맞음)
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

function ballPos(L, t) {      // 시각 t 에서 [공 위치 x, 몇 번째 회, 되감는 중인가, 이음새 뒤 경과시간]
  const n = L <= 1 ? 1 : REPEAT, r = t - T0;
  if (r < 0) return [XA, 0, false, 9];
  const k = Math.min(n - 1, Math.floor(r / CLIP)), u = Math.min(1, (r - k * CLIP) / CLIP);
  const rev = L >= 3 && k % 2 === 1, p = E.inOutC(rev ? 1 - u : u);
  return [lerp(XA, XB, p), k, rev, k > 0 && r < n * CLIP ? r - k * CLIP : 9];
}

function rr(x, a, b, w, h, r) { x.beginPath(); x.roundRect(a, b, w, h, r); }

function ball(x, px, shadowK) {
  const y = 150;
  x.fillStyle = `rgba(15,27,45,${(.3 * shadowK).toFixed(3)})`; x.beginPath(); x.ellipse(px, 188, 24, 6, 0, 0, 7); x.fill();
  const g = x.createRadialGradient(px - 7, y - 8, 2, px, y, 24); g.addColorStop(0, '#fff0d8'); g.addColorStop(.45, PAL.accent2); g.addColorStop(1, '#b8501a');
  x.fillStyle = g; x.beginPath(); x.arc(px, y, 20, 0, 7); x.fill();
  x.strokeStyle = 'rgba(120,50,10,.5)'; x.lineWidth = 1.3; x.beginPath(); x.arc(px, y, 20, 0, 7); x.stroke();
}

const demo = {
  dur: DUR, rest: 2.2, noCompare: false, levels: 3,
  mount(sp) {
    const css = (e, o) => Object.assign(e.style, o);
    const main = el('canvas', null, sp);
    main.width = 1280; main.height = 720; css(main, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const pill = el('div', null, sp);                        // 오른쪽 위 태그: 직각에 가까운 모서리 + 왼쪽 accent 줄
    css(pill, { position: 'absolute', right: '20px', top: '14px', padding: '7px 12px 7px 11px', borderRadius: '2px', borderLeft: `3px solid ${PAL.accent}`, background: PAL.surface, boxShadow: `0 0 0 1px ${PAL.line}, 0 4px 12px rgba(15,27,45,.12)`, color: PAL.ink, font: "600 12px/1 'IBM Plex Sans KR',sans-serif" });
    const r = rng(7), grain = document.createElement('canvas'); grain.width = grain.height = 256;
    const gx = grain.getContext('2d'), gd = gx.createImageData(256, 256);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0);
    return { main, pill, grain };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 한 번만, 2 = 그대로 반복, 3 = 왕복
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1);
    x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = .14;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(s.grain, gx0, gy0, 128, 128);
    x.restore();
    const fl = x.createLinearGradient(0, 176, 0, 224); fl.addColorStop(0, '#ffffff'); fl.addColorStop(1, '#c5d1e4'); x.fillStyle = fl; x.fillRect(20, 176, 600, 48);
    x.fillStyle = 'rgba(15,27,45,.08)'; x.fillRect(20, 220, 600, 4);
    const gw = x.createRadialGradient(320, 110, 0, 320, 110, 260); gw.addColorStop(0, 'rgba(43,108,255,.12)'); gw.addColorStop(1, 'rgba(43,108,255,0)'); x.fillStyle = gw; x.fillRect(20, 48, 600, 176);
    x.strokeStyle = rgba(PAL.ink, .22); x.lineWidth = 2; x.beginPath(); x.moveTo(XA, 192); x.lineTo(XB, 192); x.stroke();
    [[XA, '첫 프레임'], [XB, '끝 프레임']].forEach(([gx, lb]) => {
      x.setLineDash([4, 4]); x.strokeStyle = rgba(PAL.ink, .5); x.lineWidth = 1.5; x.beginPath(); x.arc(gx, 150, 20, 0, 7); x.stroke(); x.setLineDash([]);
      x.fillStyle = PAL.muted; x.textAlign = 'center'; x.font = '500 11px "IBM Plex Sans KR", sans-serif'; x.fillText(lb, gx, 212);
    });
    const [bx, k, rev, since] = ballPos(L, t), n = L <= 1 ? 1 : REPEAT;
    ball(x, bx, 1);
    if (L === 2 && since < .18 && k > 0) {                       // 그대로 반복: 끝에서 처음으로 튀는 순간
      x.strokeStyle = `rgba(217,45,32,${(1 - since / .18).toFixed(2)})`; x.lineWidth = 3; x.beginPath(); x.arc(XA, 150, 26 + since * 90, 0, 7); x.stroke();
      x.fillStyle = BAD; x.textAlign = 'center'; x.font = '700 18px "IBM Plex Sans KR", sans-serif'; x.fillText(`튐! ${XB - XA}px`, 300, 108);
    }
    if (L >= 3 && since < .3 && k > 0) { x.fillStyle = `rgba(15,138,71,${(1 - since / .3).toFixed(2)})`; x.textAlign = 'center'; x.font = '700 16px "IBM Plex Sans KR", sans-serif'; x.fillText('방향이 바뀜 · 튐 없음', 300, 108); }
    // 아래: 타임라인(원본 구간 + 결과)
    x.fillStyle = rgba(PAL.surface, .92); rr(x, 20, 232, 600, 118, 6); x.fill(); x.strokeStyle = PAL.line; x.lineWidth = 1; x.stroke();
    const px = (v) => TX + v / DUR * TW, cw = CLIP / DUR * TW;
    x.fillStyle = PAL.muted; x.textAlign = 'left'; x.font = '500 10.5px "IBM Plex Sans KR", sans-serif'; x.fillText('원본', 26, 258); x.fillText('결과', 26, 292);
    rr(x, px(T0), 244, cw, 20, 4); x.fillStyle = rgba(PAL.accent, .3); x.fill();
    x.strokeStyle = PAL.accent; x.lineWidth = 1.2; x.stroke();
    x.fillStyle = PAL.ink; x.textAlign = 'left'; x.font = '500 10px "IBM Plex Sans KR", sans-serif'; x.fillText(`구간 ${CLIP.toFixed(1)}초`, px(T0) + 6, 258);
    for (let i = 0; i < n; i++) {
      const bw = cw - 1, bxx = px(T0 + i * CLIP), r2 = L >= 3 && i % 2 === 1;
      rr(x, bxx, 274, bw, 26, 4); const g = x.createLinearGradient(bxx, 0, bxx + bw, 0);
      g.addColorStop(0, rgba(r2 ? PAL.accent2 : PAL.accent, .38)); g.addColorStop(1, rgba(r2 ? PAL.accent : PAL.accent2, .38)); x.fillStyle = g; x.fill();
      x.strokeStyle = i === k && t >= T0 && t < T0 + n * CLIP ? PAL.accent : rgba(PAL.ink, .45); x.lineWidth = i === k && t >= T0 ? 2 : 1; x.stroke();
      x.fillStyle = PAL.ink; x.textAlign = 'center'; x.font = '500 11px "IBM Plex Sans KR", sans-serif'; x.fillText(bw < 80 ? `${i + 1}회` : (r2 ? `${i + 1}회 역방향` : `${i + 1}회 정방향`), bxx + bw / 2, 291);
      if (i > 0) {                                                                       // 이음새 표시
        const ok = L >= 3;
        x.fillStyle = ok ? OKC : BAD; x.beginPath(); x.arc(bxx, 274, 4.5, 0, 7); x.fill();
        x.textAlign = 'center'; x.font = '500 10px "IBM Plex Sans KR", sans-serif'; x.fillStyle = ok ? OKC : BAD; x.fillText(ok ? '맞음' : `튐 ${XB - XA}px`, bxx, 316);
      }
    }
    x.fillStyle = PAL.ink; x.fillRect(px(Math.min(t, DUR)) - 1, 240, 2, 76);
    x.textAlign = 'left'; x.font = '500 11px "JetBrains Mono", monospace'; x.fillStyle = PAL.ink;
    x.fillText(`반복 ${n}회 × 구간 ${CLIP.toFixed(1)}초 = 결과 ${(n * CLIP).toFixed(1)}초`, 26, 340);
    s.pill.textContent = L <= 1 ? '한 번만 재생, 1회' : L === 2 ? `반복 재생(루프) ${Math.min(n, k + 1)}/${n}회, 끝에서 처음으로 튐` : `왕복 재생(핑퐁) ${Math.min(n, k + 1)}/${n}회, ${rev ? '역방향' : '정방향'}`;
  },
};
export default demo;
