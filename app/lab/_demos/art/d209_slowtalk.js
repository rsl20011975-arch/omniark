/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/shorts-length-wall/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 쇼츠 길이: 플랫폼이 쇼츠로 치는 상한(180초)과 제작자가 정한 벽(15~50초)을 한 시간축에 겹쳐 놓고,
// 박자 길이 = max(말할 시간 + 숨, 보여 줄 시간) 으로 초안 합계를 코드가 계산해 벽과 대 본다. 화면은 시간 t 의 함수다.
const CPS = 6.0;           // 말 속도(자/초). 제작 코드의 공용 목표 [기록]
const BREATH = 0.45;       // 박자 앞 0.15초 + 뒤 0.3초 숨 [기록]
const WALL_MIN = 15;       // 제작 벽 아래쪽(초) [기록]
const WALL_MAX = 50;       // 제작 벽 위쪽(초) [지시 2026-10-07, 60에서 내림]
const PLATFORM = 180;      // 플랫폼이 쇼츠로 분류하는 길이 상한(초) [공식 안내 확인]
const KEEP = 9;            // 줄인 계획이 남기는 박자 수
const PAL = { bg0: '#eef2f7', bg1: '#dfe6f0', ink: '#0f1b2d', muted: '#5a6a80', accent: '#2b6cff', accent2: '#ff8a3d', surface: '#ffffff', line: 'rgba(15,27,45,.16)' };
const ACC_INK = '#1a4fc4', ORG_INK = '#a83c08';
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif';

// 박자 초안: [말 글자 수, 장면이 끝까지 보여야 하는 초]
const DRAFT = [[34, 3], [28, 3], [36, 3], [30, 3], [26, 4.5], [38, 3], [32, 3], [29, 3], [35, 3], [31, 3], [27, 5], [33, 3]];
// 잘 된 한국어 재편집 쇼츠 18편의 길이(초). 조회 100만 이상·구독 1천 이상에서 눈으로 고른 표본 [측정 2026-10-06]
const SAMPLE = [9.7, 13.3, 14.3, 15.4, 20.4, 23.8, 24.8, 28.5, 29.1, 31.0, 33.2, 34.5, 34.7, 35.0, 39.8, 47.7, 48.1, 59.4];
const TOOLCAR_MED = 24.9;  // 공구·자동차 쇼츠 상위 29편 길이 중앙값 [측정 2026-11-02]
const ROBOT = { med: 47, lo: 11.5, hi: 139.8 };   // 한국 로봇 쇼츠 히트 14편 길이 중앙값과 범위 [측정 2026-11-09]

const X0 = 40, X1 = 600, PXS = (X1 - X0) / PLATFORM;
const xs = (s) => X0 + s * PXS;
const beatLen = (b) => Math.max(b[0] / CPS + BREATH, b[1]);
const median = (a) => { const s = [...a].sort((p, q) => p - q), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const sum = (a) => a.reduce((p, q) => p + q, 0);

let GRAIN = null;
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function card(x, X, Y, W, H) { x.save(); x.shadowColor = 'rgba(15,27,45,.12)'; x.shadowBlur = 8; x.shadowOffsetY = 2; x.fillStyle = PAL.surface; x.beginPath(); x.roundRect(X, Y, W, H, 6); x.fill(); x.restore(); x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.roundRect(X, Y, W, H, 6); x.stroke(); }

const STEP = ['상한과 박자 초안', '제작 벽과 줄인 계획', '실제 쇼츠 18편과 대 보기'];
const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 3,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(33), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const tag = el('div', null, sp);   // 이름표(tag-tr): 오른쪽 위, 거의 직각, 왼쪽 3px 강조줄, surface 배경
    Object.assign(tag.style, { position: 'absolute', right: '10px', top: '10px', padding: '4px 9px 4px 8px', borderLeft: `3px solid ${PAL.accent}`, borderRadius: '2px', background: PAL.surface, color: PAL.ink, font: "600 12px/1.3 'IBM Plex Sans KR',sans-serif", boxShadow: '0 1px 4px rgba(15,27,45,.14)', zIndex: '4', whiteSpace: 'nowrap' });
    return { main, tag };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 1 : (lv == null ? 3 : lv);
    const x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'multiply'; x.globalAlpha = 0.07;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();

    // 계산: 초안 박자 길이, 줄인 계획, 벽 대비
    const lens = DRAFT.map(beatLen), draftTot = sum(lens), planTot = sum(lens.slice(0, KEEP));
    const trim = L >= 2 ? E.inOutC(seg(t, 2.4, 3.2)) : 0;          // 줄이는 동작(2단계부터)
    const wallIn = L >= 2 ? E.outC(seg(t, 1.9, 2.6)) : 0;          // 벽 띠가 나타나는 정도
    const sampIn = L >= 3 ? seg(t, 3.3, 4.6) : 0;                  // 표본 점이 나타나는 정도
    const wx0 = xs(WALL_MIN), wx1 = xs(WALL_MAX);

    T(x, '쇼츠 한 편의 길이', 24, 26, 14, PAL.ink, 700);
    T(x, '값마다 [확인]·[지시]·[기록]·[측정] 표시', 24, 40, 10, PAL.muted, 500);

    // 제작 벽 세로 띠(모든 줄 뒤에)
    if (wallIn > 0) {
      x.save(); x.globalAlpha = wallIn;
      const g = x.createLinearGradient(0, 56, 0, 300); g.addColorStop(0, 'rgba(43,108,255,.34)'); g.addColorStop(1, 'rgba(43,108,255,.14)');
      x.fillStyle = g; x.fillRect(wx0, 56, wx1 - wx0, 244);
      x.strokeStyle = PAL.accent; x.lineWidth = 1.2; x.beginPath(); x.moveTo(wx0 + .5, 56); x.lineTo(wx0 + .5, 300); x.moveTo(wx1 - .5, 56); x.lineTo(wx1 - .5, 300); x.stroke();
      T(x, `벽 ${WALL_MIN}~${WALL_MAX}초 [지시]`, (wx0 + wx1) / 2, 305, 10.5, ACC_INK, 700, 'center');
      x.restore();
    }
    // 시간축
    x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.moveTo(X0, 71.5); x.lineTo(X1, 71.5); x.stroke();
    for (let m = 0; m <= PLATFORM; m += 30) { x.beginPath(); x.moveTo(xs(m) + .5, 71); x.lineTo(xs(m) + .5, 75); x.stroke(); T(x, m === 0 ? '0초' : String(m), xs(m), 66, 9.5, PAL.muted, 500, 'center', MONO); }

    // 1줄: 플랫폼 분류 상한
    const bx = X0, bw = (X1 - X0) * E.outC(seg(t, 0.05, 0.7));
    x.fillStyle = 'rgba(90,106,128,.16)'; x.beginPath(); x.roundRect(bx, 79, bw, 17, 3); x.fill();
    x.save(); x.beginPath(); x.rect(bx, 79, bw, 17); x.clip(); T(x, `플랫폼이 쇼츠로 분류하는 상한 ${PLATFORM}초 [확인]`, X0 + 6, 91, 10.5, PAL.ink, 600); x.restore();

    // 2줄: 박자 막대
    const planned = trim > 0.5 ? KEEP : DRAFT.length;
    T(x, L >= 2 && trim > 0.5 ? `줄인 계획 ${KEEP}박자` : `박자 초안 ${DRAFT.length}박자`, X0, 113, 10.5, PAL.ink, 700);
    let acc = 0;
    lens.forEach((d, i) => {
      const keep = i < KEEP, on = E.outC(seg(t, 0.3 + 0.12 * i, 0.3 + 0.12 * i + 0.4)), fade = keep ? 1 : 1 - trim;
      const sx = xs(acc), w = (xs(acc + d) - sx) * on;
      if (fade > 0.01 && w > 0.1) {
        x.save(); x.globalAlpha = fade;
        const overStart = xs(WALL_MAX), cut = (L >= 2) ? Math.max(0, Math.min(w, sx + w - overStart)) : 0;
        const baseCol = i % 2 ? '#7a9cf0' : PAL.accent;
        x.fillStyle = baseCol; x.fillRect(sx, 118, w - cut, 28);
        if (cut > 0) { x.fillStyle = PAL.accent2; x.fillRect(sx + w - cut, 118, cut, 28); }
        x.fillStyle = 'rgba(255,255,255,.55)'; x.fillRect(sx + w - 0.8, 118, 0.8, 28);
        x.restore();
      }
      acc += d;
    });
    const tot = (L >= 2 && trim > 0.5) ? planTot : draftTot;
    const over = tot - WALL_MAX;
    {   // 박자 길이 계산 예: 말할 시간이 큰 박자와 보여 줄 시간이 큰 박자
      const k = E.outC(seg(t, 0.9, 1.6)), ex = [0, 4];
      x.save(); x.globalAlpha = k; card(x, 322, 100, 306, 56);
      T(x, '박자 길이 = 말할 시간 + 숨, 보여 줄 시간 중 큰 쪽', 332, 115, 10, PAL.ink, 700);
      ex.forEach((i, r) => {
        const [n, pic] = DRAFT[i], talk = n / CPS + BREATH, big = Math.max(talk, pic), picWins = pic > talk;
        T(x, `박자 ${i + 1}: ${n} ÷ ${CPS} + ${BREATH} = ${talk.toFixed(2)}초, 보여 줄 ${pic.toFixed(1)}초`, 332, 130 + r * 12.5, 9, PAL.muted, 500, 'left', MONO);
        T(x, `→ ${big.toFixed(2)}`, 618, 130 + r * 12.5, 9, picWins ? ORG_INK : ACC_INK, 700, 'right', MONO);
      });
      x.restore();
    }
    // 합계 표시(코드가 센 값)
    T(x, `합계 ${tot.toFixed(1)}초`, X0, 165, 12.5, PAL.ink, 700, 'left', MONO);
    if (L >= 2 && wallIn > 0.6) {
      const ok = tot <= WALL_MAX && tot >= WALL_MIN;
      T(x, ok ? `벽 안, ${(WALL_MAX - tot).toFixed(1)}초 여유` : `벽 ${over.toFixed(1)}초 초과`, X0 + 108, 165, 11, ok ? ACC_INK : ORG_INK, 700);
      if (trim > 0.5) T(x, `초안 ${draftTot.toFixed(1)}초에서 ${DRAFT.length - KEEP}박자를 뺀 값`, X0 + 230, 165, 10, PAL.muted, 500);
    } else {
      T(x, '벽이 없으니 몇 초든 막는 곳이 없다', X0 + 108, 165, 10.5, PAL.muted, 500);
    }

    // 3줄: 실제 표본
    if (sampIn > 0) {
      x.save(); x.globalAlpha = Math.min(1, sampIn * 1.6);
      T(x, '잘 된 한국어 재편집 쇼츠 18편의 길이 [측정 2026-10-06]', X0, 190, 10.5, PAL.ink, 700);
      const r = rng(5);
      let inside = 0;
      SAMPLE.forEach((v, i) => {
        const on = E.outC(seg(sampIn, i / 22, i / 22 + 0.3)), ins = v >= WALL_MIN && v <= WALL_MAX; if (ins) inside++;
        const py = 206 + (i % 3) * 12 + (r() - 0.5) * 2, px = xs(v);
        x.fillStyle = ins ? PAL.accent : PAL.accent2; x.globalAlpha = on * Math.min(1, sampIn * 1.6);
        x.beginPath(); x.arc(px, py - 6 * (1 - on), 4.2, 0, 7); x.fill();
        x.strokeStyle = '#fff'; x.lineWidth = 1; x.stroke();
      });
      x.globalAlpha = Math.min(1, sampIn * 1.6);
      const med = median(SAMPLE), mx = xs(med);
      x.strokeStyle = PAL.ink; x.lineWidth = 1.4; x.beginPath(); x.moveTo(mx, 197); x.lineTo(mx, 238); x.stroke();
      T(x, `중앙 ${med.toFixed(2)}초`, mx, 249, 9.5, PAL.ink, 700, 'center', MONO);
      // 다른 표본의 중앙값
      const my = 270;
      x.strokeStyle = 'rgba(15,27,45,.35)'; x.lineWidth = 1; x.beginPath(); x.moveTo(xs(ROBOT.lo), my); x.lineTo(xs(ROBOT.hi), my); x.stroke();
      x.fillStyle = PAL.ink; x.beginPath(); x.arc(xs(ROBOT.med), my, 3.6, 0, 7); x.fill();
      T(x, `로봇 쇼츠 히트 14편 중앙 ${ROBOT.med}초 (${ROBOT.lo}~${ROBOT.hi.toFixed(0)})`, xs(ROBOT.lo), my - 6, 9.5, PAL.ink, 600);
      const ty = 288;
      x.fillStyle = PAL.ink; x.beginPath(); x.arc(xs(TOOLCAR_MED), ty, 3.6, 0, 7); x.fill();
      T(x, `공구·차 쇼츠 상위 29편 중앙 ${TOOLCAR_MED}초`, xs(TOOLCAR_MED) + 8, ty + 3.5, 9.5, PAL.ink, 600);
      x.restore();
      // 벽 대비 요약(오른쪽 카드)
      x.save(); x.globalAlpha = Math.min(1, sampIn * 1.6);
      card(x, 392, 312, 236, 40);
      T(x, `18편 중 ${inside}편이 벽 안`, 402, 328, 12, PAL.ink, 700);
      T(x, `밖 ${SAMPLE.length - inside}편: ${SAMPLE.filter((v) => v < WALL_MIN).length}편 짧고 ${SAMPLE.filter((v) => v > WALL_MAX).length}편 김`, 402, 344, 10.5, ORG_INK, 600);
      x.restore();
    } else {
      card(x, 24, 312, 296, 40);
      T(x, '벽 15~50초는 공식 규칙이 아니라 제작 설정', 34, 328, 11, PAL.ink, 700);
      T(x, '길이가 조회를 좌우한다는 증거는 아직 없다', 34, 344, 10.5, PAL.muted, 500);
    }
    if (L === 2 && wallIn > 0.9) {
      const k = E.outC(seg(t, 3.0, 3.8));
      x.save(); x.globalAlpha = k; card(x, 300, 188, 328, 100);
      T(x, '벽이 하는 일', 312, 206, 11.5, PAL.ink, 700);
      ['합계가 50초를 넘으면 박자를 줄인다', '15초 아래면 재료가 모자란 편으로 탈락', '180초 상한은 허용 범위일 뿐 목표가 아니다', '이 벽은 제작자의 설정, 공식 규칙이 아니다'].forEach((ln, i) => T(x, ln, 312, 224 + i * 15, 10.5, i === 3 ? ORG_INK : PAL.muted, i === 3 ? 700 : 500));
      x.restore();
    }
    s.tag.textContent = `단계 ${L} · ${STEP[L - 1]}`;
  },
};
export default demo;
