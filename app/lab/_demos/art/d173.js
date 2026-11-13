/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/search-autocomplete/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, el, rr, rng } from "./helpers.js";

const PAL = { bg0: '#f2f2f0', bg1: '#e4e4e1', ink: '#111111', muted: '#666666', accent: '#ff3b1f', accent2: '#111111', surface: '#ffffff', line: 'rgba(17,17,17,.14)' };

// 검색창에 글자를 하나씩 치면 추천어 목록이 열리고 좁혀지며, 화살표 키로 고르고 Enter 로 확정한다. 가상 커서 대신 키 입력(키캡)을 보여 준다. 화면은 시간 t 의 함수다.
const TYPE_STEP = .35;    // 글자(음절) 하나를 치는 간격(초)
const DEBOUNCE = .15;     // 마지막 입력 뒤 이만큼 쉬어야 목록이 갱신된다(초)
const SHOWN = 5;          // 한 번에 보여 주는 추천어 개수
const T0 = .5, T_DOWN1 = 3.0, T_DOWN2 = 3.45, T_ENTER = 4.0;
const SANS = "'IBM Plex Sans KR','Malgun Gothic',sans-serif", MONO = "'JetBrains Mono',monospace";
const TYPED = ['서', '서울', '서울 ', '서울 맛', '서울 맛집'];
const ALL = ['서울 맛집', '서울 맛집 지도', '서울 맛집 예약', '서울 날씨', '서울 지하철 노선도', '서울 맛집 추천', '서울숲 산책', '서울역 주차'];
const RES = [['#ff3b1f', '성수동 인기 식당 12곳', '리뷰 2,418개 · 평점 4.6'], ['#111111', '한강 근처 브런치 카페 7곳', '리뷰 1,093개 · 평점 4.5'], ['#8a8a85', '종로 한식당 지도에서 보기', '리뷰 3,260개 · 평점 4.7']];
const BX = 100, BY = 64, BW = 440, BH = 46;
const T = (c, s, x, y, size, col, w = 500, al = 'left', f = SANS) => { c.save(); c.fillStyle = col; c.font = `${w} ${size}px ${f}`; c.textAlign = al; c.textBaseline = 'alphabetic'; c.fillText(s, x, y); c.restore(); };
const lg = (c, x0, y0, x1, y1, stops) => { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, col]) => g.addColorStop(o, col)); return g; };
const drop = (c, x, y, w, h, r, dy, blur, al) => { c.save(); for (let i = 0; i < 8; i++) { const g = blur * (i + 1) / 8; c.fillStyle = `rgba(17,17,17,${(al * .32 / 8).toFixed(3)})`; rr(c, x - g, y + dy - g, w + 2 * g, h + 2 * g, r + g); c.fill(); } c.restore(); };
function grainTile(seed) {
  const g = document.createElement('canvas'); g.width = g.height = 128;
  const x = g.getContext('2d'), im = x.createImageData(128, 128), r = rng(seed);
  for (let i = 0; i < im.data.length; i += 4) { const v = r() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
  x.putImageData(im, 0, 0); return g;
}
function mag(c, x, y, col) { c.save(); c.strokeStyle = col; c.lineWidth = 1.8; c.lineCap = 'round'; c.beginPath(); c.arc(x, y, 5.5, 0, 6.2832); c.stroke(); c.beginPath(); c.moveTo(x + 4, y + 4); c.lineTo(x + 9, y + 9); c.stroke(); c.restore(); }
function clock(c, x, y, col) { c.save(); c.strokeStyle = col; c.lineWidth = 1.6; c.lineCap = 'round'; c.beginPath(); c.arc(x + 4, y + 4, 6.5, 0, 6.2832); c.stroke(); c.beginPath(); c.moveTo(x + 4, y + 1); c.lineTo(x + 4, y + 4.5); c.lineTo(x + 7, y + 6); c.stroke(); c.restore(); }
function keycap(c, x, y, w, h, on, label, arrow) {   // 작은 키캡(눌리는 동안 내려가고 밝아진다)
  const dy = on * 2.5; drop(c, x, y + 3, w, h, 6, 2, 3, .45);
  rr(c, x, y + 3, w, h, 6); c.fillStyle = '#111111'; c.fill();
  rr(c, x, y + dy, w, h, 6); c.fillStyle = lg(c, 0, y + dy, 0, y + dy + h, on ? [[0, '#ff6a50'], [1, PAL.accent]] : [[0, '#ffffff'], [1, '#dcdcd8']]); c.fill();
  c.strokeStyle = 'rgba(17,17,17,.3)'; c.lineWidth = 1; rr(c, x + .5, y + dy + .5, w - 1, h - 1, 6); c.stroke();
  if (arrow) { c.save(); c.strokeStyle = PAL.ink; c.lineWidth = 2; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(x + w / 2, y + dy + 6); c.lineTo(x + w / 2, y + dy + h - 6); c.moveTo(x + w / 2 - 5, y + dy + h - 11); c.lineTo(x + w / 2, y + dy + h - 6); c.lineTo(x + w / 2 + 5, y + dy + h - 11); c.stroke(); c.restore(); }
  else T(c, label, x + w / 2, y + dy + h / 2 + 4.5, 12, PAL.ink, 700, 'center', MONO);
}

const demo = {
  dur: 5.2, rest: 4.6, noCompare: false, levels: 4,
  mount(sp) {
    const cv = el('canvas', null, sp); cv.width = 1280; cv.height = 720; cv.style.cssText = 'position:absolute;left:0;top:0;width:640px;height:360px';
    return { c: cv.getContext('2d'), grain: grainTile(9) };
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 4 : lv);   // 1 = 글자만 침(목록 없음), 2 = + 추천어 목록이 열리고 좁혀짐, 3 = + 입력한 부분 구분·아이콘, 4 = + 화살표 키 선택·Enter 확정
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    c.fillStyle = lg(c, 0, 0, 0, 360, [[0, PAL.bg0], [1, PAL.bg1]]); c.fillRect(0, 0, 640, 360);
    const gl = c.createRadialGradient(320, 80, 10, 320, 80, 320); gl.addColorStop(0, 'rgba(255,255,255,.6)'); gl.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = gl; c.fillRect(0, 0, 640, 360);
    // 입력 상태
    const kt = TYPED.map((_, i) => T0 + i * TYPE_STEP);
    let n = -1; kt.forEach((k, i) => { if (t >= k) n = i; });
    const enterOn = t >= T_ENTER, kb = L >= 4;
    const picked = kb && enterOn ? ALL[1] : null;
    const text = picked || (n >= 0 ? TYPED[n] : '');
    // 목록(디바운스 뒤 갱신)
    let sn = -1; kt.forEach((k, i) => { if (t >= k + DEBOUNCE) sn = i; });
    const q = sn >= 0 ? TYPED[sn] : '', items = ALL.filter((x) => x.startsWith(q)).slice(0, SHOWN);
    const open = L >= 2 && sn >= 0 && !enterOn, act = kb ? (t >= T_DOWN2 ? 1 : (t >= T_DOWN1 ? 0 : -1)) : -1;
    // 검색창
    const focus = n >= 0 || t >= T0 - .2;
    drop(c, BX, BY, BW, BH, 23, 6, 12, .5); rr(c, BX, BY, BW, BH, 23); c.fillStyle = lg(c, 0, BY, 0, BY + BH, [[0, '#ffffff'], [1, '#f7f7f5']]); c.fill();
    rr(c, BX + .5, BY + .5, BW - 1, BH - 1, 22.5); c.strokeStyle = focus ? PAL.accent : PAL.line; c.lineWidth = focus ? 1.6 : 1; c.stroke();
    mag(c, BX + 24, BY + 21, PAL.muted);
    if (text) T(c, text, BX + 48, BY + 29, 17, PAL.ink, 500); else T(c, '검색어를 입력하세요', BX + 48, BY + 29, 17, PAL.muted, 500);
    c.font = `500 17px ${SANS}`; const tw = text ? c.measureText(text).width : 0;
    if (Math.floor(t * 2) % 2 === 0 && !enterOn) { c.fillStyle = PAL.accent; c.fillRect(BX + 49 + tw, BY + 13, 1.8, 21); }
    // 추천어 목록
    if (open) {
      const rh = 38, ph = items.length * rh + 14, py = BY + BH + 8, pa = L >= 2 ? E.outC(seg(t, kt[0] + DEBOUNCE, kt[0] + DEBOUNCE + .18)) : 1;
      c.save(); c.globalAlpha = pa; c.translate(0, (1 - pa) * -6);
      drop(c, BX, py, BW, ph, 16, 8, 14, .55); rr(c, BX, py, BW, ph, 16); c.fillStyle = lg(c, 0, py, 0, py + ph, [[0, '#ffffff'], [1, '#f7f7f5']]); c.fill(); c.strokeStyle = PAL.line; c.lineWidth = 1; c.stroke();
      items.forEach((it, i) => { const y = py + 7 + i * rh;
        if (i === act) { rr(c, BX + 8, y, BW - 16, rh - 2, 10); c.fillStyle = 'rgba(255,59,31,.1)'; c.fill(); rr(c, BX + 8, y + 7, 3, rh - 16, 1.5); c.fillStyle = PAL.accent; c.fill(); }
        if (L >= 3) { (i === 0 ? clock : mag)(c, BX + 24, y + (i === 0 ? 11 : 12), PAL.muted); }
        const tx = BX + (L >= 3 ? 52 : 28), ty = y + 24, m = it.startsWith(q) ? q : '';
        if (L >= 3) { T(c, m, tx, ty, 16, PAL.muted, 500); c.font = `500 16px ${SANS}`; T(c, it.slice(m.length), tx + c.measureText(m).width, ty, 16, PAL.ink, 700); }
        else T(c, it, tx, ty, 16, PAL.ink, 500); });
      c.restore();
    }
    // 결과(Enter 뒤)
    if (enterOn) { const u = E.outC(seg(t, T_ENTER, T_ENTER + .35)), shown = picked || text;
      c.save(); c.globalAlpha = u; c.translate(0, (1 - u) * 14);
      T(c, `‘${shown}’ 검색 결과`, BX + 6, 144, 14, PAL.muted, 600);
      RES.forEach(([col, a1, a2], i) => { const y = 158 + i * 54; drop(c, BX, y, BW, 46, 12, 3, 6, .35); rr(c, BX, y, BW, 46, 12); c.fillStyle = PAL.surface; c.fill();
        rr(c, BX + 10, y + 8, 40, 30, 8); c.fillStyle = lg(c, BX, y, BX + 50, y + 40, [[0, col], [1, '#d4d4d0']]); c.fill();
        T(c, a1, BX + 62, y + 21, 14, PAL.ink, 600); T(c, a2, BX + 62, y + 37, 12, PAL.muted, 500); });
      c.restore(); }
    // 키 입력(키캡): 목록을 고르는 동안
    if (kb) { const hot = (k) => Math.max(0, 1 - Math.abs(t - k - .06) / .14);
      T(c, '누른 키', 462, 343, 11, PAL.muted, 500, 'right'); keycap(c, 470, 326, 28, 24, hot(T_DOWN1), '', true); keycap(c, 504, 326, 28, 24, hot(T_DOWN2), '', true); keycap(c, 538, 326, 62, 24, hot(T_ENTER), 'Enter', false); }
    c.globalCompositeOperation = 'overlay'; c.globalAlpha = .06; c.fillStyle = c.createPattern(s.grain, 'repeat'); c.fillRect(0, 0, 640, 360); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
    const lab = ['연출 전: 목록 없음', '1단계: 글자만 침', '2단계: 추천어 열림과 좁힘', '3단계: 입력 부분 구분, 아이콘', '4단계: 화살표 선택과 Enter'][L];
    c.font = `600 12px ${SANS}`; const tw2 = c.measureText(lab).width + 24, tx2 = 624 - tw2;
    drop(c, tx2, 12, tw2, 24, 2, 2, 4, .5); rr(c, tx2, 12, tw2, 24, 2); c.fillStyle = PAL.surface; c.fill(); c.fillStyle = PAL.accent; c.fillRect(tx2, 12, 3, 24); T(c, lab, tx2 + 14, 28, 12, PAL.ink, 600);
  },
};
export default demo;
