/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/short-audio-mix/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 8초짜리 쇼츠의 소리 네 겹(해설, 음악, 현장음, 효과음)을 코드로 만든 시험 신호로 쌓고, 해설이 나올 때 음악을 누르는 덕킹과
// 음량 맞추기가 파형과 숫자로 어떻게 보이는지 코드가 직접 계산해 보여 준다. 소리는 들을 수 없으니 재생은 없다.
// 신호는 모양을 보이려고 만든 시험용 합성이고, 덕킹 값과 배율은 제작 코드에 적힌 값이다(효과가 증명된 값은 아니다).
const MUSIC_VOL = 0.5;      // 음악 배율
const FIELD_VOL = 0.32;     // 원본 현장음 배율
const THRESH = 0.12;        // 음악 덕킹 임계(선형 진폭, 해설 신호 기준)
const RATIO = 3;            // 음악 덕킹 비율
const ATTACK = 20;          // 음악 덕킹 어택(ms)
const RELEASE = 400;        // 음악 덕킹 릴리스(ms)
const F_THRESH = 0.05, F_RATIO = 4, F_ATTACK = 15, F_RELEASE = 300;   // 현장음 덕킹
const TARGET = -14;         // 목표 음량(이 데모는 RMS 근사. LUFS 가 아니다)
const PEAK_CEIL = 0.841;    // 최대 진폭 천장(-1.5 dB)
const CLIP = 8.0, SR = 3000;
const LINES = [[0.35, 2.05, 0.1], [2.5, 4.3, 0.4], [4.8, 6.2, 0.7], [6.65, 7.7, 0.2]];   // 해설 네 줄(시작, 끝, 위상)
const SFX = { hit: 0.50, whoosh: 0.55, riser: 0.45 };   // 녹음 효과음 배율 표
const PEAK_LINE = 2;        // 공개 직전 줄(상승음 1.1초 뒤 타격)
const PAL = { bg0: '#0c1814', bg1: '#15271f', ink: '#e8f1ea', muted: '#86a091', accent: '#7fe0a8', accent2: '#e8d27a', surface: '#12231c', line: '#2f5a47' };
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif';
const N = Math.floor(CLIP * SR);
const db = (v) => 20 * Math.log10(Math.max(1e-6, v));

function synth() {
  const r = rng(5), v = new Float32Array(N), m = new Float32Array(N), f = new Float32Array(N), s = new Float32Array(N);
  let ph = 0, y = 0;
  const fr = [110, 138.6, 164.8, 220], am = [0.5, 0.4, 0.35, 0.3];
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const ln = LINES.find((q) => t >= q[0] && t < q[1]);
    if (ln) {
      const u = t - ln[0], d = ln[1] - ln[0], edge = Math.min(1, u / 0.04, (d - u) / 0.06);
      const syl = Math.pow(Math.abs(Math.sin(Math.PI * (5.2 * u + ln[2]))), 0.6);
      ph += 2 * Math.PI * (128 + 14 * Math.sin(2 * Math.PI * 0.8 * t + ln[2] * 3)) / SR;
      let w = 0; for (let h = 1; h <= 9; h++) w += Math.sin(h * ph) / Math.pow(h, 0.9);
      v[i] = 0.26 * edge * (0.25 + 0.75 * syl) * w;
    }
    let ms = 0; for (let k = 0; k < 4; k++) ms += am[k] * Math.sin(2 * Math.PI * fr[k] * t);
    m[i] = 0.3 * ms * (0.62 + 0.38 * (0.5 + 0.5 * Math.cos(2 * Math.PI * 2 * t)));
    y += 0.25 * ((r() * 2 - 1) - y); f[i] = 0.9 * y * (0.65 + 0.35 * Math.sin(2 * Math.PI * 9 * t)) * (0.7 + 0.3 * Math.sin(2 * Math.PI * 0.6 * t));
  }
  const ev = [['hit', 0, 0.8], ['whoosh', LINES[1][0] - 0.12, 0.7], ['whoosh', LINES[3][0] - 0.12, 0.7], ['riser', LINES[PEAK_LINE][0] - 1.1, 0.6], ['hit', LINES[PEAK_LINE][0], 0.9]];
  ev.forEach(([k, t0, g]) => {
    const len = k === 'hit' ? 0.35 : k === 'whoosh' ? 0.55 : 1.1;
    let yy = 0;
    for (let i = Math.max(0, Math.floor(t0 * SR)); i < Math.min(N, Math.floor((t0 + len) * SR)); i++) {
      const u = i / SR - t0, p = u / len, n = r() * 2 - 1;
      let sh;
      if (k === 'hit') sh = Math.exp(-u / 0.09) * (0.8 * Math.sin(2 * Math.PI * 70 * u) + 0.5 * n);
      else if (k === 'whoosh') { yy += (0.1 + 0.5 * Math.sin(Math.PI * p)) * (n - yy); sh = Math.sin(Math.PI * p) * yy * 2.2; }
      else { yy += (0.05 + 0.6 * p) * (n - yy); sh = p * p * yy * 2.4; }
      s[i] += SFX[k] * g * sh;
    }
  });
  return { v, m, f, s };
}

function duck(sc, th, ratio, atk, rel) {   // 사이드체인 덕킹을 단순화한 계산: 해설의 10ms 평균 크기가 임계를 넘은 만큼 비율로 줄이고, 어택·릴리스로 부드럽게 따라간다
  const g = new Float32Array(N), w = Math.floor(SR * 0.01), thDb = db(th);
  let acc = 0, cur = 0;
  const aA = Math.exp(-1 / (SR * atk / 1000)), aR = Math.exp(-1 / (SR * rel / 1000));
  for (let i = 0; i < N; i++) {
    acc += sc[i] * sc[i]; if (i >= w) acc -= sc[i - w] * sc[i - w];
    const over = Math.max(0, db(Math.sqrt(Math.max(0, acc) / w)) - thDb), tgt = -over * (1 - 1 / ratio);
    const a = tgt < cur ? aA : aR; cur = a * cur + (1 - a) * tgt; g[i] = cur;
  }
  return g;
}

function build(S, L) {     // 단계 L 의 믹스. gM, gF: dB 로 된 덕킹 이득
  const gM = L >= 2 ? duck(S.v, THRESH, RATIO, ATTACK, RELEASE) : new Float32Array(N);
  const gF = L >= 3 ? duck(S.v, F_THRESH, F_RATIO, F_ATTACK, F_RELEASE) : null;
  const mu = new Float32Array(N), fi = new Float32Array(N), sf = L >= 3 ? S.s : new Float32Array(N), mix = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    mu[i] = S.m[i] * MUSIC_VOL * Math.pow(10, gM[i] / 20);
    fi[i] = gF ? S.f[i] * FIELD_VOL * Math.pow(10, gF[i] / 20) : 0;
    mix[i] = S.v[i] + mu[i] + fi[i] + sf[i];
  }
  let ms = 0, pk = 0; for (let i = 0; i < N; i++) { ms += mix[i] * mix[i]; pk = Math.max(pk, Math.abs(mix[i])); }
  const meas = 10 * Math.log10(ms / N);
  let G = 0, limited = false;
  if (L >= 4) { G = TARGET - meas; if (pk * Math.pow(10, G / 20) > PEAK_CEIL) { G = db(PEAK_CEIL / pk); limited = true; } }
  const k = Math.pow(10, G / 20), out = new Float32Array(N); for (let i = 0; i < N; i++) out[i] = mix[i] * k;
  // 말할 때 음악이 해설보다 몇 dB 낮은가(50ms 창, 해설이 있는 창만)
  const W = Math.floor(SR * 0.05); let sum = 0, cnt = 0;
  for (let a0 = 0; a0 + W <= N; a0 += W) {
    let ev = 0, em = 0; for (let i = a0; i < a0 + W; i++) { ev += S.v[i] * S.v[i]; em += mu[i] * mu[i]; }
    if (10 * Math.log10(ev / W + 1e-12) > -30) { sum += 10 * Math.log10(em / W + 1e-12) - 10 * Math.log10(ev / W + 1e-12); cnt++; }
  }
  let mn = 0; for (let i = 0; i < N; i++) mn = Math.min(mn, gM[i]);
  const at = (t) => gM[Math.min(N - 1, Math.floor(t * SR))];
  return { gM, mu, fi, sf, out, meas, G, limited, pk: pk * k, voiceGap: cnt ? sum / cnt : 0, maxCut: mn, gapA: at(LINES[0][1]), gapB: at(LINES[1][0]), final: meas + G };
}

let CACHE = null;
function model() { if (!CACHE) { const S = synth(); CACHE = { S, L: [null, build(S, 1), build(S, 2), build(S, 3), build(S, 4)] }; } return CACHE; }

function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
function card(x, X, Y, W, H) { x.fillStyle = PAL.surface; x.beginPath(); x.roundRect(X, Y, W, H, 4); x.fill(); x.strokeStyle = PAL.line; x.lineWidth = 1; x.stroke(); }
const fmt = (v, d) => (v < 0 ? '−' : v > 0 ? '+' : '') + Math.abs(v).toFixed(d == null ? 1 : d);

function plate(x, s, X, Y, size, col, al, font) {   // 파형 위에 글자를 얹을 때 읽히도록 어두운 받침을 깐다
  x.font = `600 ${size}px ${font || MONO}`; const w = x.measureText(s).width, L0 = al === 'right' ? X - w - 3 : X - 3;
  x.fillStyle = 'rgba(18,35,28,.86)'; x.beginPath(); x.roundRect(L0, Y - size - 1, w + 6, size + 5, 2); x.fill();
  T(x, s, X, Y, size, col, 600, al, font || MONO);
}
function wave(x, arr, X, Y, W, H, amp, col, upto) {   // 파형: 화면 열마다 최솟값과 최댓값을 세로선으로
  const cols = Math.floor(W * 2), n = Math.floor(cols * upto);
  x.fillStyle = col; x.globalAlpha = 0.9;
  for (let c = 0; c < n; c++) {
    const i0 = Math.floor(c / cols * N), i1 = Math.max(i0 + 1, Math.floor((c + 1) / cols * N));
    let lo = 0, hi = 0; for (let i = i0; i < i1; i++) { if (arr[i] < lo) lo = arr[i]; if (arr[i] > hi) hi = arr[i]; }
    const a = Math.max(-1, Math.min(1, hi / amp)), b = Math.max(-1, Math.min(1, lo / amp)), cy = Y + H / 2;
    x.fillRect(X + c / 2, cy - a * H / 2, 0.5, Math.max(0.6, (a - b) * H / 2));
  }
  x.globalAlpha = 1;
}

const STEP = ['해설 위에 음악 깔기', '해설 때 음악 누르기', '현장음과 효과음 더하기', '음량 -14 로 맞추기'];
const demo = {
  dur: 8.0, rest: 8.0, noCompare: false, levels: 4,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const tag = el('div', null, sp);   // 이름표(tag-tr): 오른쪽 위, 직각에 가까운 모서리, 왼쪽 3px accent 줄
    Object.assign(tag.style, { position: 'absolute', right: '10px', top: '8px', padding: '6px 10px 6px 11px', background: PAL.surface, borderLeft: `3px solid ${PAL.accent}`, borderRadius: '2px', color: PAL.ink, font: "600 12px/1 'IBM Plex Sans KR',sans-serif", zIndex: '4', whiteSpace: 'nowrap' });
    return { main, tag };
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 4 : lv), M = model(), D = M.L[Math.max(1, Math.min(4, L))], S = M.S, x = s.main.getContext('2d');
    t = t > 0 ? t : 0;
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    const tc = Math.min(t, CLIP), upto = tc / CLIP, done = t >= CLIP - 0.05;
    // 트랙: 해설, 음악(+이득 곡선), 현장음, 효과음, 믹스
    const LX = 14, LW = 422;
    const rows = [
      ['해설', S.v, 42, 0.5, PAL.accent, true], ['음악', D.mu, 66, 0.5, PAL.accent2, true], ['현장음', D.fi, 36, 0.5, PAL.muted, L >= 3],
      ['효과음  (녹음 파일 자리)', D.sf, 34, 0.5, PAL.ink, L >= 3], ['믹스', D.out, 58, 1.0, PAL.accent, true],
    ];
    let Y = 40;
    rows.forEach(([name, arr, h, amp, col, on]) => {
      card(x, LX - 4, Y - 2, LW + 8, h + 4);
      x.strokeStyle = PAL.line; x.lineWidth = 1; x.beginPath(); x.moveTo(LX, Y + h / 2 + 0.5); x.lineTo(LX + LW, Y + h / 2 + 0.5); x.stroke();
      if (on) wave(x, arr, LX, Y, LW, h, amp, col, upto); else T(x, '아직 없음', LX + LW / 2, Y + h / 2 + 4, 10, PAL.muted, 500, 'center');
      if (name === '음악' && L >= 2) {      // 음악 이득(dB) 곡선
        x.strokeStyle = PAL.ink; x.lineWidth = 1.2; x.setLineDash([2, 2]); x.beginPath();
        const n = Math.floor(LW * upto);
        for (let c = 0; c <= n; c += 1) { const gi = Math.min(N - 1, Math.floor(c / LW * N)), yy = Y + 6 + (-D.gM[gi] / 14) * (h - 12); c ? x.lineTo(LX + c, yy) : x.moveTo(LX, yy); }
        x.stroke(); x.setLineDash([]); plate(x, '이득 0에서 −14 dB', LX + LW - 4, Y + 10, 9, PAL.ink, 'right');
      }
      plate(x, name, LX + 4, Y + 10, 9.5, PAL.muted, 'left');
      Y += h + 6;
    });
    // 시간축과 재생선
    [0, 2, 4, 6, 8].forEach((v) => { const X = LX + v / CLIP * LW; T(x, v + 's', X, 311, 9.5, PAL.muted, 500, v === 0 ? 'left' : v === 8 ? 'right' : 'center', MONO); });
    x.strokeStyle = PAL.accent2; x.lineWidth = 1.4; const PX = LX + upto * LW; x.beginPath(); x.moveTo(PX, 38); x.lineTo(PX, 301); x.stroke();
    // 결정 대기 카드
    card(x, LX - 4, 318, LW + 8, 38);
    T(x, '결정 대기  쇼츠 공장 코드는 덕킹으로 깐다 [기록]', LX + 4, 332, 9.5, PAL.ink, 600);
    T(x, '이미지→영상 연출 기준은 목소리가 있으면 배경음 없음 [지시]', LX + 4, 347, 9.5, PAL.muted, 500);
    // 오른쪽 읽기값
    const RX = 448, RW = 184, c0 = done ? PAL.ink : PAL.muted;
    card(x, RX, 40, RW, 70);
    T(x, '덕킹 값  [기록]', RX + 8, 54, 10, PAL.accent, 600);
    const l1 = L < 2 ? `음악 ${MUSIC_VOL.toFixed(2)}배 고정, 덕킹 꺼짐` : `음악 ${MUSIC_VOL.toFixed(2)}배, 임계 ${THRESH}, 비율 ${RATIO}`;
    const l2 = L < 2 ? '해설과 상관없이 같은 크기' : `어택 ${ATTACK}ms, 릴리스 ${RELEASE}ms`;
    const l3 = L < 3 ? '현장음과 효과음은 아직 없음' : `현장음 ${FIELD_VOL.toFixed(2)}배, 비율 ${F_RATIO}, 릴리스 ${F_RELEASE}ms`;
    T(x, l1, RX + 8, 69, 9.5, PAL.ink, 500, 'left', MONO); T(x, l2, RX + 8, 83, 9.5, PAL.ink, 500, 'left', MONO); T(x, l3, RX + 8, 97, 9, PAL.muted, 500, 'left', MONO);
    card(x, RX, 116, RW, 94);
    T(x, '말할 때 음악 − 해설', RX + 8, 130, 10, PAL.muted, 500);
    T(x, done ? fmt(D.voiceGap) + ' dB' : '재는 중', RX + 8, 154, 22, c0, 700, 'left', MONO);
    T(x, `음악이 가장 눌린 양  ${done ? fmt(D.maxCut) + ' dB' : '...'}`, RX + 8, 172, 9.5, c0, 500);
    T(x, `첫 줄 끝에서 다음 줄 시작까지`, RX + 8, 187, 9, PAL.muted, 500);
    T(x, `${done ? fmt(D.gapA) + ' → ' + fmt(D.gapB) + ' dB' : '...'}  (간격 ${(LINES[1][0] - LINES[0][1]).toFixed(2)}초)`, RX + 8, 201, 9.5, c0, 500, 'left', MONO);
    card(x, RX, 216, RW, 140);
    T(x, '믹스 근사 음량  (RMS, LUFS 아님)', RX + 8, 230, 9.5, PAL.muted, 500);
    const shown = done ? D.final : null;
    T(x, shown == null ? '재는 중' : fmt(shown) + ' dB', RX + 8, 254, 22, c0, 700, 'left', MONO);
    // 막대: -30 ~ -5, 목표 표시
    const bx = RX + 8, bw = RW - 16, ax = (v) => bx + (Math.max(-30, Math.min(-5, v)) + 30) / 25 * bw;
    x.fillStyle = 'rgba(232,241,234,.12)'; x.beginPath(); x.roundRect(bx, 264, bw, 7, 3); x.fill();
    if (shown != null) { x.fillStyle = L >= 4 && !D.limited ? PAL.accent : PAL.accent2; x.beginPath(); x.roundRect(bx, 264, Math.max(3, ax(shown) - bx), 7, 3); x.fill(); }
    x.strokeStyle = PAL.ink; x.lineWidth = 1.6; x.beginPath(); x.moveTo(ax(TARGET), 260); x.lineTo(ax(TARGET), 275); x.stroke();
    T(x, `목표 ${TARGET}`, ax(TARGET), 286, 9, PAL.ink, 600, 'center', MONO);
    const need = TARGET - D.meas;
    T(x, L < 4 ? `맞추기 전, 목표까지 ${done ? fmt(need) + ' dB' : '...'}` : (D.limited ? '진폭 천장에 걸려 목표에 못 닿음' : '목표에 닿음'), RX + 8, 302, 9.5, L >= 4 && D.limited ? PAL.accent2 : PAL.ink, 600);
    T(x, `최대 진폭 ${done ? D.pk.toFixed(3) : '...'}  천장 ${PEAK_CEIL}`, RX + 8, 317, 9.5, c0, 500, 'left', MONO);
    T(x, '근사: K 가중과 게이팅 없음', RX + 8, 332, 9, PAL.muted, 500);
    T(x, '시험 신호의 값이다', RX + 8, 346, 9, PAL.muted, 500);
    s.tag.textContent = `0${L}  ${STEP[L - 1]}`;
  },
};
export default demo;
