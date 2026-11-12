/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/clip-repeat/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 1.2초짜리 구간(공이 왼쪽 끝에서 오른쪽 끝으로 굴러감)을 여러 번 되풀이해 재생한다. ① 한 번만 → ② 그대로 반복(끝에서 처음으로 튐) → ③ 왕복(정방향·역방향 번갈아, 튐 없음). 화면은 시간 t 의 함수다.
const CLIP = .6;             // 되풀이할 구간의 길이(초)
const REPEAT = 3;             // 되풀이 횟수(구간을 모두 몇 번 재생할지)
const T0 = .4;                // 영상이 시작하고 구간이 재생되기 시작하는 시각(초)
const DUR = 6.4;              // 데모 길이 = 타임라인이 나타내는 시간(초)
const XA = 120, XB = 480;     // 구간의 첫 프레임·끝 프레임에서 공의 위치(px, 640×360 기준)
const TX = 40, TW = 560;      // 타임라인 가로 시작·폭
const FONT = '12px "IBM Plex Sans KR"';

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
  x.fillStyle = `rgba(0,0,0,${(.35 * shadowK).toFixed(3)})`; x.beginPath(); x.ellipse(px, 188, 24, 6, 0, 0, 7); x.fill();
  const g = x.createRadialGradient(px - 7, y - 8, 2, px, y, 24); g.addColorStop(0, '#fff0c8'); g.addColorStop(.45, '#ffb04a'); g.addColorStop(1, '#b8501a');
  x.fillStyle = g; x.beginPath(); x.arc(px, y, 20, 0, 7); x.fill();
  x.strokeStyle = 'rgba(80,30,6,.55)'; x.lineWidth = 1.3; x.beginPath(); x.arc(px, y, 20, 0, 7); x.stroke();
}

const demo = {
  dur: DUR, rest: 2.2, noCompare: false, levels: 3,
  mount(sp) {
    const css = (e, o) => Object.assign(e.style, o);
    const main = el('canvas', null, sp);
    main.width = 1280; main.height = 720; css(main, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const pill = el('div', null, sp);
    css(pill, { position: 'absolute', left: '20px', top: '14px', padding: '7px 14px', borderRadius: '999px', background: 'rgba(8,10,20,.76)', color: '#fff', font: "500 15px/1 'IBM Plex Sans KR',sans-serif" });
    return { main, pill };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 한 번만, 2 = 그대로 반복, 3 = 왕복
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, '#0f1626'); bg.addColorStop(.6, '#1e2a48'); bg.addColorStop(1, '#0b0f1a');
    x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    const fl = x.createLinearGradient(0, 176, 0, 224); fl.addColorStop(0, '#3a2f4f'); fl.addColorStop(1, '#1a1426'); x.fillStyle = fl; x.fillRect(20, 176, 600, 48);
    const gw = x.createRadialGradient(320, 110, 0, 320, 110, 260); gw.addColorStop(0, 'rgba(120,150,255,.22)'); gw.addColorStop(1, 'rgba(120,150,255,0)'); x.fillStyle = gw; x.fillRect(20, 48, 600, 176);
    x.strokeStyle = 'rgba(255,255,255,.25)'; x.lineWidth = 2; x.beginPath(); x.moveTo(XA, 192); x.lineTo(XB, 192); x.stroke();
    [[XA, '첫 프레임'], [XB, '끝 프레임']].forEach(([gx, lb]) => {
      x.setLineDash([4, 4]); x.strokeStyle = 'rgba(255,255,255,.5)'; x.lineWidth = 1.5; x.beginPath(); x.arc(gx, 150, 20, 0, 7); x.stroke(); x.setLineDash([]);
      x.fillStyle = 'rgba(255,255,255,.8)'; x.textAlign = 'center'; x.font = '500 11px "IBM Plex Sans KR", sans-serif'; x.fillText(lb, gx, 212);
    });
    const [bx, k, rev, since] = ballPos(L, t), n = L <= 1 ? 1 : REPEAT;
    ball(x, bx, 1);
    if (L === 2 && since < .18 && k > 0) {                       // 그대로 반복: 끝에서 처음으로 튀는 순간
      x.strokeStyle = `rgba(255,90,90,${(1 - since / .18).toFixed(2)})`; x.lineWidth = 3; x.beginPath(); x.arc(XA, 150, 26 + since * 90, 0, 7); x.stroke();
      x.fillStyle = '#ff7a7a'; x.textAlign = 'center'; x.font = '700 18px "IBM Plex Sans KR", sans-serif'; x.fillText(`튐! ${XB - XA}px`, 300, 108);
    }
    if (L >= 3 && since < .3 && k > 0) { x.fillStyle = `rgba(123,232,160,${(1 - since / .3).toFixed(2)})`; x.textAlign = 'center'; x.font = '700 16px "IBM Plex Sans KR", sans-serif'; x.fillText('방향이 바뀜 · 튐 없음', 300, 108); }
    // 아래: 타임라인(원본 구간 + 결과)
    x.fillStyle = 'rgba(8,10,20,.62)'; rr(x, 20, 232, 600, 118, 8); x.fill();
    const px = (v) => TX + v / DUR * TW, cw = CLIP / DUR * TW;
    x.fillStyle = 'rgba(255,255,255,.8)'; x.textAlign = 'left'; x.font = '500 10.5px "IBM Plex Sans KR", sans-serif'; x.fillText('원본', 26, 258); x.fillText('결과', 26, 292);
    rr(x, px(T0), 244, cw, 20, 4); x.fillStyle = '#2a9d9a'; x.fill();
    x.strokeStyle = '#fff'; x.lineWidth = 1.2; x.stroke();
    x.fillStyle = '#fff'; x.textAlign = 'left'; x.font = '500 10px "IBM Plex Sans KR", sans-serif'; x.fillText(`구간 ${CLIP.toFixed(1)}초`, px(T0) + 6, 258);
    for (let i = 0; i < n; i++) {
      const bw = cw - 1, bxx = px(T0 + i * CLIP), r2 = L >= 3 && i % 2 === 1;
      rr(x, bxx, 274, bw, 26, 4); const g = x.createLinearGradient(bxx, 0, bxx + bw, 0);
      g.addColorStop(0, r2 ? '#e0883a' : '#2a9d9a'); g.addColorStop(1, r2 ? '#2a9d9a' : '#e0883a'); x.fillStyle = g; x.globalAlpha = .9; x.fill(); x.globalAlpha = 1;
      x.strokeStyle = i === k && t >= T0 && t < T0 + n * CLIP ? '#ffd166' : 'rgba(255,255,255,.7)'; x.lineWidth = i === k && t >= T0 ? 2 : 1; x.stroke();
      x.fillStyle = '#fff'; x.textAlign = 'center'; x.font = '500 11px "IBM Plex Sans KR", sans-serif'; x.fillText(bw < 80 ? `${i + 1}회` : (r2 ? `${i + 1}회 역방향` : `${i + 1}회 정방향`), bxx + bw / 2, 291);
      if (i > 0) {                                                                       // 이음새 표시
        const ok = L >= 3;
        x.fillStyle = ok ? '#7be8a0' : '#ff6a6a'; x.beginPath(); x.arc(bxx, 274, 4.5, 0, 7); x.fill();
        x.textAlign = 'center'; x.font = '500 10px "IBM Plex Sans KR", sans-serif'; x.fillText(ok ? '맞음' : `튐 ${XB - XA}px`, bxx, 316);
      }
    }
    x.fillStyle = '#fff'; x.fillRect(px(Math.min(t, DUR)) - 1, 240, 2, 76);
    x.textAlign = 'left'; x.font = '500 11px "JetBrains Mono", monospace'; x.fillStyle = '#ffd9a0';
    x.fillText(`반복 ${n}회 × 구간 ${CLIP.toFixed(1)}초 = 결과 ${(n * CLIP).toFixed(1)}초`, 26, 340);
    s.pill.textContent = L <= 1 ? '한 번만 재생 · 1회' : L === 2 ? `반복 재생(루프) · ${Math.min(n, k + 1)}/${n}회 · 끝에서 처음으로 튐` : `왕복 재생(핑퐁) · ${Math.min(n, k + 1)}/${n}회 · ${rev ? '역방향' : '정방향'}`;
  },
};
export default demo;
