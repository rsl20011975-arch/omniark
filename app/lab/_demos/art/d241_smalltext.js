/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/longform-thumbnail-title/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rng } from "./helpers.js";

// 롱폼 한 편의 포장(썸네일, 제목)을 점검하고 3안을 시청 시간으로 고르는 과정. 규격 판정, 제목 판정, 시험 막대의 숫자는 코드가 그 자리에서 계산한다.
// 시험 결과(노출, 클릭률, 평균 시청)는 가상 예시이며 실제 시험 결과가 아니다. 화면은 시간 t 의 함수다.
const IMPRESSIONS = 5000;      // 안마다 노출 수(가상). 같게 나뉜다고 가정한 계산이다
const CTR = [0.040, 0.061, 0.048];   // 안 A, B, C 의 클릭률(가상 예시)
const AVG_MIN = [3.9, 2.1, 4.4];     // 안 A, B, C 의 클릭한 사람의 평균 시청 분(가상 예시)
const PROMISE_BAD_S = 40.6;    // 약속한 결과가 처음 나온 시각(초): 자체 제작 기록 [측정] 롱폼 한 편
const PROMISE_GOOD_S = 12;     // 고친 뒤의 예시 값(초)
const HOOK_S = 30;             // 앞 30초 선 [추정: 제작자 기준 문서의 체크 항목, 공식 지표 Intro 와 이름이 같다]
const KEY_FRONT = 12;          // 검색어가 들어 있어야 하는 앞쪽 글자 수 [지시 2026-11-04]
const TITLE_BAD = '이거 아시나요? 홈페이지 만드는 법 이렇게 쉬울까요?';
const TITLE_GOOD = '홈페이지가 싸 보이는 이유, 고치는 단어 5개';
const KEYWORD = '홈페이지';
const MARKET = { q: ['×0.35', 23], num: ['×1.10', 535] };   // AI 관련 국내 롱폼 945편 중앙 조회 12,050 대비 [재계산 2026-11-14, 상관]
const FILE_BAD = { w: 1000, h: 1000, type: 'PNG', mb: 3.4 };   // 연출 전 파일(가상)
const FILE_GOOD = { w: 1280, h: 720, type: 'JPG', mb: 0.08 };  // 고친 뒤: 제작 기록의 실제 파일 규격
const PX_REC = 3840 * 2160;    // 공식이 권장하는 화소 수
const HEAD_PX = 14;            // 시안 큰 글자의 높이(px, 320x180 장면 좌표 기준)

const PAL = { bg0: '#e6f2ec', bg1: '#d4e8de', ink: '#0f2a22', muted: '#4f6e63', accent: '#0f9d6b', accent2: '#c2410c', surface: '#f6fbf8', line: 'rgba(15,42,34,.18)' };
const MUTED2 = '#47635a', ACC_INK = '#0a6e4a', BAD = '#b3200a', GOOD = '#0a6e4a', ORG_INK = '#a8360a';
const MONO = '"JetBrains Mono", monospace', SANS = '"IBM Plex Sans KR", sans-serif', HAN = '"Black Han Sans", sans-serif';
const VAR = [   // 시안 세 장. 안 A 와 어느 칸이 다른지를 코드가 센다
  { id: 'A', text: ['싸 보이는', '홈페이지'], layout: 'split', color: '#ffe066', size: HEAD_PX },
  { id: 'B', text: ['단어', '5개로 끝'], layout: 'split', color: '#ffe066', size: HEAD_PX },
  { id: 'C', text: ['싸 보이는', '홈페이지'], layout: 'result', color: '#ffe066', size: HEAD_PX },
];
const VAR_BAD = { id: 'A', text: ['AI 티 없애는 법 홈페이지 디자인', '초보 가이드 2026 최신 총정리', '꿀팁 모음 지금 확인'], layout: 'split', color: '#b9a8ff', size: 8.5 };
const DIFF_NAME = { text: '문구', layout: '구도', color: '색', size: '글자 크기' };
const NUM = ['0', '1', '2', '3', '4'];
const DESC = ['막연하게 만든 한 장', '규격과 제목을 맞춘다', '3안을 한 가지씩만 다르게', '시청 시간으로 고른다', '제목의 약속이 앞 30초에서 지켜지나'];

const hours = (i) => IMPRESSIONS * CTR[i] * AVG_MIN[i] / 60;
const diffs = (v) => Object.keys(DIFF_NAME).filter((k) => JSON.stringify(v[k]) !== JSON.stringify(VAR[0][k]));
const argmax = (a) => a.indexOf(Math.max(...a));
const checks = (title, f, promise) => ({
  title: [!title.trim().endsWith('?'), /\d/.test(title), title.indexOf(KEYWORD) >= 0 && title.indexOf(KEYWORD) + KEYWORD.length <= KEY_FRONT, promise == null ? null : promise <= HOOK_S],
  file: [Math.abs(f.w / f.h - 16 / 9) < 0.01, f.w >= 640, f.mb <= 2, f.w >= 1280 && f.h >= 720],
});

function rr(x, X, Y, W, H, r) { x.beginPath(); x.roundRect(X, Y, W, H, Math.max(0, Math.min(r, W / 2, H / 2))); }
function T(x, s, X, Y, size, col, w, al, font) { x.font = `${w || 500} ${size}px ${font || SANS}`; x.fillStyle = col; x.textAlign = al || 'left'; x.textBaseline = 'alphabetic'; x.fillText(s, X, Y); }
function layers(x, X, Y, W, H, r, fill, steps) {
  steps.forEach(([dy, g, a]) => { x.fillStyle = `rgba(15,42,34,${a})`; rr(x, X - g, Y + dy - g, W + 2 * g, H + 2 * g, r + g); x.fill(); });
  x.fillStyle = fill; rr(x, X, Y, W, H, r); x.fill();
}
function mock(x, kind, X, Y, W, H) {   // 썸네일 속 홈페이지 화면: 'ai' 는 보라 그라데이션 공식, 'fix' 는 돌색 종이와 포인트 하나
  x.save(); x.beginPath(); x.rect(X, Y, W, H); x.clip();
  if (kind === 'ai') {
    const g = x.createLinearGradient(X, Y, X + W, Y + H); g.addColorStop(0, '#5b3df5'); g.addColorStop(1, '#c04df0'); x.fillStyle = g; x.fillRect(X, Y, W, H);
    const rg = x.createRadialGradient(X + W * 0.7, Y + H * 0.35, 4, X + W * 0.7, Y + H * 0.35, W * 0.6); rg.addColorStop(0, 'rgba(255,255,255,.38)'); rg.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = rg; x.fillRect(X, Y, W, H);
    x.fillStyle = 'rgba(255,255,255,.22)'; rr(x, X + 10, Y + 10, W - 20, 12, 6); x.fill();
    x.fillStyle = 'rgba(255,255,255,.92)'; rr(x, X + 14, Y + 40, W * 0.62, 12, 4); x.fill(); rr(x, X + 14, Y + 58, W * 0.45, 12, 4); x.fill();
    [0, 1, 2].forEach((i) => { x.fillStyle = 'rgba(255,255,255,.18)'; rr(x, X + 14 + i * (W * 0.3), Y + 86, W * 0.26, 44, 8); x.fill(); x.fillStyle = 'rgba(255,255,255,.55)'; rr(x, X + 22 + i * (W * 0.3), Y + 96, W * 0.12, 7, 3); x.fill(); });
  } else {
    const g = x.createLinearGradient(X, Y, X, Y + H); g.addColorStop(0, '#efeadf'); g.addColorStop(1, '#e0d9ca'); x.fillStyle = g; x.fillRect(X, Y, W, H);
    x.fillStyle = 'rgba(28,26,23,.85)'; rr(x, X + 10, Y + 12, 38, 6, 3); x.fill(); x.fillStyle = 'rgba(28,26,23,.35)'; [0, 1, 2].forEach((i) => { rr(x, X + W - 70 + i * 22, Y + 12, 16, 6, 3); x.fill(); });
    x.fillStyle = '#1c1a17'; rr(x, X + 14, Y + 40, W * 0.66, 14, 3); x.fill(); rr(x, X + 14, Y + 60, W * 0.5, 14, 3); x.fill();
    x.fillStyle = '#8c2f1c'; rr(x, X + 14, Y + 86, 52, 16, 3); x.fill();
    [0, 1, 2].forEach((i) => { x.strokeStyle = 'rgba(28,26,23,.25)'; x.lineWidth = 1; rr(x, X + 14 + i * (W * 0.3), Y + 112, W * 0.26, 40, 4); x.stroke(); });
  }
  x.restore();
}
function headline(x, lines, size, col, X, Y) {   // 굵은 글자는 어두운 외곽선을 둘러 어느 바탕에서도 읽히게
  x.save(); x.font = `400 ${size}px ${HAN}`; x.textAlign = 'left'; x.textBaseline = 'alphabetic'; x.lineJoin = 'round';
  lines.forEach((ln, i) => { const y = Y + i * size * 1.06; x.lineWidth = Math.max(1, size * 0.2); x.strokeStyle = 'rgba(12,14,12,.9)'; x.strokeText(ln, X, y); x.fillStyle = col; x.fillText(ln, X, y); });
  x.restore();
}
function thumb(x, X, Y, W, v, bad) {   // 320x180 장면 좌표를 W 폭으로
  const k = W / 320, H = k * 180;
  x.save(); rr(x, X, Y, W, H, 5); x.clip(); x.translate(X, Y); x.scale(k, k);
  if (v.layout === 'split') {
    mock(x, 'ai', 0, 0, 320, 180); x.save(); x.beginPath(); x.moveTo(184, 0); x.lineTo(320, 0); x.lineTo(320, 180); x.lineTo(150, 180); x.closePath(); x.clip(); mock(x, 'fix', 0, 0, 320, 180); x.restore();
    x.strokeStyle = '#ffffff'; x.lineWidth = 3; x.beginPath(); x.moveTo(184, 0); x.lineTo(150, 180); x.stroke();
    if (!bad) { [['AI 티', 12, '#e5484d'], ['고친 뒤', 250, '#1f9d5b']].forEach(([s, px, c]) => { x.fillStyle = c; rr(x, px, 10, s.length > 3 ? 58 : 48, 20, 10); x.fill(); T(x, s, px + (s.length > 3 ? 29 : 24), 24.5, 11, '#ffffff', 700, 'center'); }); }
    const sc = x.createLinearGradient(0, 100, 0, 180); sc.addColorStop(0, 'rgba(0,0,0,0)'); sc.addColorStop(1, 'rgba(0,0,0,.62)'); x.fillStyle = sc; x.fillRect(0, 100, 320, 80);
    headline(x, v.text, v.size, v.color, 14, bad ? 142 : 138 + (v.size > 20 ? 0 : 0));
  } else {   // 결과만 크게: 왼쪽은 글자 판, 오른쪽은 고친 화면
    mock(x, 'fix', 150, 0, 170, 180);
    const pg = x.createLinearGradient(0, 0, 0, 180); pg.addColorStop(0, '#2b2824'); pg.addColorStop(1, '#171512'); x.fillStyle = pg; x.fillRect(0, 0, 168, 180);
    const eg = x.createLinearGradient(168, 0, 190, 0); eg.addColorStop(0, 'rgba(0,0,0,.45)'); eg.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = eg; x.fillRect(168, 0, 22, 180);
    x.fillStyle = '#8c2f1c'; x.fillRect(0, 0, 6, 180);
    headline(x, v.text, v.size, v.color, 16, 92 - (v.text.length - 1) * v.size * 0.5);
  }
  x.restore();
  x.strokeStyle = 'rgba(15,42,34,.28)'; x.lineWidth = 1; rr(x, X + 0.5, Y + 0.5, W - 1, H - 1, 5); x.stroke();
}

let GRAIN = null;
const demo = {
  dur: 6.0, rest: 6.0, noCompare: false, levels: 4,
  mount(sp) {
    const main = el('canvas', null, sp); main.width = 1280; main.height = 720;
    Object.assign(main.style, { position: 'absolute', left: '0', top: '0', width: '640px', height: '360px' });
    const r = rng(47), gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const gx = gc.getContext('2d'), gd = gx.createImageData(128, 128);
    for (let q = 0; q < gd.data.length; q += 4) { const v = r() * 255; gd.data[q] = gd.data[q + 1] = gd.data[q + 2] = v; gd.data[q + 3] = 255; }
    gx.putImageData(gd, 0, 0); GRAIN = gc;
    const lab = el('div', null, sp);   // 이름표(numeral): 왼쪽 위 큰 숫자와 옆 설명
    Object.assign(lab.style, { position: 'absolute', left: '20px', top: '10px', display: 'flex', alignItems: 'center', gap: '10px', zIndex: '4', whiteSpace: 'nowrap' });
    const num = el('span', null, lab), desc = el('span', null, lab);
    Object.assign(num.style, { font: "400 40px/1 'Black Han Sans',sans-serif", color: ACC_INK, minWidth: '26px' });
    Object.assign(desc.style, { font: "600 13px/1.3 'IBM Plex Sans KR',sans-serif", color: PAL.ink });
    return { main, num, desc };
  },
  render(s, t, a, lv) {
    t = t > 0 ? t : 0;
    const L = !a ? 0 : (lv == null ? 4 : lv), x = s.main.getContext('2d');
    x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.setLineDash([]);
    const bg = x.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, PAL.bg0); bg.addColorStop(1, PAL.bg1); x.fillStyle = bg; x.fillRect(0, 0, 640, 360);
    x.save(); x.globalCompositeOperation = 'multiply'; x.globalAlpha = 0.07;
    for (let gx0 = 0; gx0 < 640; gx0 += 128) for (let gy0 = 0; gy0 < 360; gy0 += 128) x.drawImage(GRAIN, gx0, gy0, 128, 128);
    x.restore();
    const prog = (lvl, a0, b0) => (L > lvl ? 1 : L === lvl ? E.outC(seg(t, a0, b0)) : 0);   // 그 단계가 시작된 뒤의 진행
    const TW = 188, TH = TW * 9 / 16, TX = [20, 226, 432], TY = 56;
    // 시안 세 칸
    const fixA = L >= 1 ? prog(1, 0.1, 0.9) : 0, vA = VAR[0];
    layers(x, TX[0], TY, TW, TH, 5, '#ffffff', [[3, 2, 0.08]]);
    thumb(x, TX[0], TY, TW, VAR_BAD, true);
    if (fixA > 0) { x.save(); x.globalAlpha = fixA; thumb(x, TX[0], TY, TW, vA, false); x.restore(); }
    const cur = L >= 1 ? vA : VAR_BAD;
    [1, 2].forEach((i) => {
      const p = L >= 2 ? prog(2, 0.1 + 0.25 * i, 0.7 + 0.25 * i) : 0;
      if (p <= 0.01) {
        x.save(); x.strokeStyle = 'rgba(15,42,34,.35)'; x.lineWidth = 1.2; x.setLineDash([4, 3]); rr(x, TX[i] + 0.5, TY + 0.5, TW - 1, TH - 1, 5); x.stroke(); x.restore();
        T(x, `${VAR[i].id}안 없음`, TX[i] + TW / 2, TY + TH / 2 + 4, 11, PAL.muted, 600, 'center', MONO);
      } else { x.save(); x.globalAlpha = p; layers(x, TX[i], TY + (1 - p) * 8, TW, TH, 5, '#ffffff', [[3, 2, 0.08]]); thumb(x, TX[i], TY + (1 - p) * 8, TW, VAR[i], false); x.restore(); }
    });
    // 안 이름과 A 와 다른 칸, 글자 크기
    [0, 1, 2].forEach((i) => {
      const v = i === 0 ? cur : VAR[i], on = i === 0 || L >= 2; if (!on) return;
      const d = i === 0 ? [] : diffs(VAR[i]), pct = v.size / 180 * 100;
      T(x, `${VAR[i].id}${i === 0 ? ' 기준' : ` ${d.map((k) => DIFF_NAME[k]).join('·')}만 다름(${d.length}칸)`}`, TX[i], TY + TH + 14, 10.5, PAL.ink, 600, 'left', MONO);
      T(x, `글자 높이 ${pct.toFixed(1)}%, ${v.text.length}줄`, TX[i], TY + TH + 27, 10, pct >= 10 && v.text.length <= 2 ? GOOD : BAD, 500, 'left', MONO);
    });
    // 시험 결과(가상)
    const rp = prog(3, 0.2, 1.3), win = argmax([0, 1, 2].map(hours)), ctrTop = argmax(CTR), maxH = Math.max(...[0, 1, 2].map(hours)), maxC = Math.max(...CTR);
    if (L >= 3) {
      [0, 1, 2].forEach((i) => {
        const X = TX[i], Y = TY + TH + 36;
        T(x, `클릭률 ${(CTR[i] * 100).toFixed(1)}%`, X, Y + 8, 10, ORG_INK, 600, 'left', MONO); x.fillStyle = 'rgba(15,42,34,.12)'; rr(x, X + 72, Y, TW - 72, 6, 3); x.fill(); x.fillStyle = PAL.accent2; rr(x, X + 72, Y, Math.max(2, (TW - 72) * CTR[i] / maxC * rp), 6, 3); x.fill();
        T(x, `시청 ${hours(i).toFixed(1)}시간`, X, Y + 23, 10, ACC_INK, 700, 'left', MONO); x.fillStyle = 'rgba(15,42,34,.12)'; rr(x, X + 72, Y + 15, TW - 72, 6, 3); x.fill(); x.fillStyle = PAL.accent; rr(x, X + 72, Y + 15, Math.max(2, (TW - 72) * hours(i) / maxH * rp), 6, 3); x.fill();
      });
      if (rp > 0.8) {
        x.save(); x.strokeStyle = PAL.accent; x.lineWidth = 2.5; rr(x, TX[win] - 2, TY - 2, TW + 4, TH + 4, 7); x.stroke(); x.restore();
        const chips = [[win, ctrTop === win ? '클릭률·시청 1등' : '시청 시간 1등', PAL.accent, '#ffffff']]; if (ctrTop !== win) chips.push([ctrTop, '클릭률 1등', PAL.accent2, '#ffffff']);
        chips.forEach(([i, s2, bgc, fg], j) => { x.font = `700 10px ${SANS}`; const w = x.measureText(s2).width + 12; x.fillStyle = bgc === PAL.accent ? ACC_INK : '#a8360a'; rr(x, TX[i] + TW - w - 6, TY + 6 + j * 0, w, 16, 3); x.fill(); T(x, s2, TX[i] + TW - w / 2 - 6, TY + 17.5, 10, fg, 700, 'center'); });
      }
      T(x, '시험 결과는 가상 예시(노출 같게 가정)', 20, TY + TH + 76, 10, MUTED2, 500, 'left', MONO);
    } else T(x, L >= 2 ? '시청 시간 비교 전' : '', 20, TY + TH + 50, 10, MUTED2, 500, 'left', MONO);
    // 아래: 제목 판정과 파일 판정, 앞 30초
    const BY = 268, promise = L >= 4 ? lerp(PROMISE_BAD_S, PROMISE_GOOD_S, E.inOutC(seg(t, 0.3, 1.6))) : null;
    const title = L >= 1 ? TITLE_GOOD : TITLE_BAD, file = L >= 1 ? FILE_GOOD : FILE_BAD, ck = checks(title, file, promise);
    layers(x, 20, BY - 8, 290, 96, 6, PAL.surface, [[2, 1, 0.07]]); x.strokeStyle = PAL.line; x.lineWidth = 1; rr(x, 20.5, BY - 7.5, 289, 95, 6); x.stroke();
    T(x, `제목 ${title.length}자`, 30, BY + 5, 10, PAL.muted, 500, 'left', MONO);
    T(x, title, 30, BY + 20, title.length > 24 ? 11 : 12.5, PAL.ink, 700);
    const rows = ['물음표로 끝나지 않는다', '숫자가 들어 있다', `검색어가 앞 ${KEY_FRONT}자 안`, `약속한 결과가 앞 ${HOOK_S}초 안`];
    rows.forEach((nm, i) => {
      const Y = BY + 37 + i * 14, v = ck.title[i], col = v == null ? PAL.muted : v ? GOOD : BAD;
      T(x, nm, 30, Y, 11.5, PAL.ink, 500); T(x, v == null ? '—' : v ? '통과' : '걸림', 300, Y, 11.5, col, 700, 'right');
    });
    layers(x, 322, BY - 8, 298, 96, 6, PAL.surface, [[2, 1, 0.07]]); x.strokeStyle = PAL.line; rr(x, 322.5, BY - 7.5, 297, 95, 6); x.stroke();
    T(x, `파일 ${file.w}×${file.h} ${file.type} ${file.mb}MB, 권장 화소의 ${(100 * file.w * file.h / PX_REC).toFixed(0)}%`, 332, BY + 5, 10, PAL.muted, 500, 'left', MONO);
    [['16:9', ck.file[0]], ['폭 640 이상', ck.file[1]], ['2MB 이하', ck.file[2]], ['720p 이상', ck.file[3]]].forEach(([nm, v], i) => {
      const X = 332 + (i % 2) * 144, Y = BY + 21 + Math.floor(i / 2) * 15;
      T(x, nm, X, Y, 11.5, PAL.ink, 500); T(x, v ? '통과' : '걸림', X + 134, Y, 11.5, v ? GOOD : BAD, 700, 'right');
    });
    const AX = 332, AW = 278, AY = BY + 56, PXS = AW / 60;
    if (promise == null) T(x, '약속한 결과가 처음 나온 시각: 점검 전', AX, AY + 8, 10, PAL.muted, 500, 'left', MONO);
    else {
      T(x, `약속한 결과가 처음 나온 시각 ${promise.toFixed(1)}초`, AX, AY - 1, 10, promise <= HOOK_S ? GOOD : BAD, 600, 'left', MONO);
      x.fillStyle = 'rgba(15,42,34,.14)'; rr(x, AX, AY + 5, AW, 6, 3); x.fill(); x.fillStyle = promise <= HOOK_S ? PAL.accent : '#d4432b'; rr(x, AX, AY + 5, Math.max(2, promise * PXS), 6, 3); x.fill();
      x.fillStyle = PAL.ink; x.fillRect(AX + HOOK_S * PXS - 0.5, AY + 2, 1, 12); T(x, `${HOOK_S}초`, AX + HOOK_S * PXS, AY + 25, 10, PAL.muted, 500, 'center', MONO);
      T(x, '0', AX, AY + 25, 10, PAL.muted, 500, 'left', MONO); T(x, '60초', AX + AW, AY + 25, 10, PAL.muted, 500, 'right', MONO);
    }
    s.num.textContent = NUM[L]; s.desc.textContent = DESC[L];
  },
};
export default demo;
