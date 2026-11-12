/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/colorblind-sim/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el } from "./helpers.js";

// 같은 '서비스 상태' 화면을 보통 시각과 세 가지 색각 유형(적·녹·청)으로 나란히 본다. 변환은 Machado 등(2009)의 3×3 행렬을 선형 RGB 에 곱한다. 화면은 시간 t 의 함수다.
const SEV = 1;                    // 색각 이상의 정도(1 = 그 색을 전혀 못 보는 경우, 0 = 보통 시각)
const OK_COLOR = '#30a46c';       // 연출 전 '정상' 칩 색(초록)
const ERR_COLOR = '#ff9500';      // 연출 전 '오류' 칩 색(빨강)
const OK2 = '#4aa8ff', ERR2 = '#ffa31a';   // 마지막 단계의 파랑·주황
const PW = 308, PH = 150;         // 칸 하나의 크기(CSS px)
const ROWS = [['결제', 0], ['로그인', 1], ['검색', 0], ['알림', 1], ['업로드', 0]];   // 1 = 오류
const FONT = "'IBM Plex Sans KR',sans-serif";
// Machado, Oliveira, Fernandes (2009) 표 1, 심각도 1.0
const MATS = {
  protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
  tritan: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]],
};
const S2L = new Float32Array(256).map((_, i) => { const v = i / 255; return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); });
const L2S = new Uint8Array(4096).map((_, i) => { const v = i / 4095; return Math.round(255 * (v <= .0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - .055)); });
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mixc = (a, b, p) => 'rgb(' + hex(a).map((v, i) => Math.round(lerp(v, hex(b)[i], p))).join(',') + ')';
const PANELS = [['보통 시각', null], ['적색맹 (Protanopia)', 'protan'], ['녹색맹 (Deuteranopia)', 'deutan'], ['청색맹 (Tritanopia)', 'tritan']];
const POS = [[10, 46], [322, 46], [10, 202], [322, 202]];

function design(c, t, L) {   // 칸 하나 안의 화면. 단계가 올라가면 아이콘·글자, 파랑/주황이 더해진다
  c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, PW, PH);
  c.fillStyle = '#151b2e'; c.beginPath(); c.roundRect(0, 0, PW, PH, 10); c.fill();
  c.font = `700 12px ${FONT}`; c.fillStyle = '#e6e9f0'; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillText('서비스 상태', 14, 15);
  const k2 = L >= 2 ? E.inOutC(seg(t, 2, 2.6)) : 0, k3 = L >= 3 ? E.inOutC(seg(t, 2.8, 3.3)) : 0;
  ROWS.forEach(([n, err], i) => {
    const y = 40 + i * 21;
    c.fillStyle = 'rgba(255,255,255,.07)'; c.fillRect(14, y - 11, PW - 28, 1);
    c.font = `500 12px ${FONT}`; c.fillStyle = '#e6e9f0'; c.textAlign = 'left'; c.fillText(n, 14, y);
    const col = mixc(err ? ERR_COLOR : OK_COLOR, err ? ERR2 : OK2, k3);
    c.fillStyle = col; c.beginPath(); c.roundRect(170, y - 8, 124, 16, 8); c.fill();
    if (k2 > 0) {
      c.globalAlpha = k2; c.strokeStyle = '#0b0f1a'; c.fillStyle = '#0b0f1a'; c.lineWidth = 1.8; c.lineCap = 'round'; c.lineJoin = 'round';
      c.beginPath();
      if (err) { c.moveTo(181, y - 3); c.lineTo(187, y + 3); c.moveTo(187, y - 3); c.lineTo(181, y + 3); } else { c.moveTo(180, y); c.lineTo(183.5, y + 3); c.lineTo(188.5, y - 3); }
      c.stroke();
      c.font = `700 11px ${FONT}`; c.fillText(err ? '오류' : '정상', 198, y + .5); c.globalAlpha = 1;
    }
  });
}
function simulate(src, dst, M) {   // 선형 RGB 에서 행렬을 곱한다
  const s = src.data, d = dst.data;
  for (let i = 0; i < s.length; i += 4) {
    const r = S2L[s[i]], g = S2L[s[i + 1]], b = S2L[s[i + 2]];
    const R = M[0][0] * r + M[0][1] * g + M[0][2] * b, G = M[1][0] * r + M[1][1] * g + M[1][2] * b, B = M[2][0] * r + M[2][1] * g + M[2][2] * b;
    d[i] = L2S[Math.max(0, Math.min(4095, (R * 4095 + .5) | 0))]; d[i + 1] = L2S[Math.max(0, Math.min(4095, (G * 4095 + .5) | 0))]; d[i + 2] = L2S[Math.max(0, Math.min(4095, (B * 4095 + .5) | 0))]; d[i + 3] = s[i + 3];
  }
}

const demo = {
  dur: 3.8, rest: 3.4, noCompare: false, levels: 3,
  mount(sp) {
    const cv = el('canvas', null, sp); cv.width = 1280; cv.height = 720;
    const mk = () => { const o = document.createElement('canvas'); o.width = PW * 2; o.height = PH * 2; return o; };
    const a = mk(), b = mk();
    return { ctx: cv.getContext('2d'), a, b, ac: a.getContext('2d', { willReadFrequently: true }), bc: b.getContext('2d'), dst: new ImageData(PW * 2, PH * 2) };
  },
  render(s, t, a, lv) {
    const L = !a ? 1 : (lv == null ? 3 : lv);   // 1 = 빨강·초록 색만, 2 = + 아이콘·글자, 3 = + 파랑·주황
    const c = s.ctx; c.setTransform(2, 0, 0, 2, 0, 0);
    const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, '#0b0f1a'); g.addColorStop(1, '#171e33'); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
    design(s.ac, t, L);
    const src = s.ac.getImageData(0, 0, PW * 2, PH * 2);
    const sev = SEV * E.inOutC(seg(t, .5, 1.5));
    PANELS.forEach(([name, key], i) => {
      const [x, y] = POS[i];
      if (!key) c.drawImage(s.a, x, y, PW, PH);
      else {
        const M = MATS[key].map((row, r) => row.map((v, q) => lerp(r === q ? 1 : 0, v, sev)));
        simulate(src, s.dst, M); s.bc.putImageData(s.dst, 0, 0); c.drawImage(s.b, x, y, PW, PH);
      }
      c.fillStyle = 'rgba(8,10,20,.8)'; c.font = `500 11px ${FONT}`; const w = c.measureText(name).width + 16;
      c.beginPath(); c.roundRect(x + PW - w - 8, y + 6, w, 18, 9); c.fill();
      c.fillStyle = '#fff'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(name, x + PW - w, y + 15.5);
    });
    const txt = L === 1 ? '연출 전 · 빨강/초록 색으로만 구분' : (t >= 2.8 && L >= 3 ? '모양·글자에 파랑/주황까지 더함' : (t >= 2 ? '아이콘과 글자를 더함' : '빨강/초록 색으로만 구분'));
    c.font = `500 14px ${FONT}`; const pw = c.measureText(txt).width + 28;
    c.fillStyle = 'rgba(8,10,20,.78)'; c.beginPath(); c.roundRect(10, 10, pw, 28, 14); c.fill();
    c.fillStyle = '#fff'; c.textBaseline = 'middle'; c.fillText(txt, 24, 24.5);
  },
};
export default demo;
