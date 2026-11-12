/* eslint-disable */
// @ts-nocheck
// 만들어진 파일 — 원본: source/pages/ffmpeg-filters/demo.js (build_pages.py). 직접 고치지 않는다
import { seg, lerp, E, rng, canvas, rr } from "./helpers.js";

// ffmpeg 필터 10개가 같은 장면에 하는 일을 칸마다 도식으로 본다. 필터 이름·옵션 이름은 FFmpeg 공식 필터 문서에서 확인한 것이고, 그림은 이 도식이 흉내 낸 것이다(실제 ffmpeg 출력이 아니다). 화면은 시간 t 의 함수다.
const ZOOM_MAX = 1.5;             // zoompan: 최대 확대 배율(문서: 범위 1~10)
const XF_DUR = 0.5;                 // xfade: 전환이 걸리는 시간(초)
const XF_AT = 0.4;                // xfade: 전환이 시작하는 시각(초)
const SANS = '"IBM Plex Sans KR","Malgun Gothic",sans-serif', MONO = '"JetBrains Mono","Malgun Gothic",monospace';
const T = (c, s, x, y, z, col, w, al, f) => { c.save(); c.fillStyle = col; c.font = (w || 500) + " " + z + "px " + (f || SANS); c.textAlign = al || "left"; c.textBaseline = "alphabetic"; c.fillText(s, x, y); c.restore(); };
function grainTile(seed) { const g = document.createElement("canvas"); g.width = g.height = 96; const x = g.getContext("2d"), im = x.createImageData(96, 96), r = rng(seed); for (let i = 0; i < 96 * 96; i++) { const v = (r() * 255) | 0; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } x.putImageData(im, 0, 0); return g; }
function backdrop(c, grain) {
  const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, "#0e1424"); g.addColorStop(1, "#080b13"); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
  const r = c.createRadialGradient(320, 150, 20, 320, 150, 360); r.addColorStop(0, "rgba(70,110,190,.10)"); r.addColorStop(1, "rgba(70,110,190,0)"); c.fillStyle = r; c.fillRect(0, 0, 640, 360);
  c.save(); c.globalAlpha = 0.045; c.fillStyle = c.createPattern(grain, "repeat"); c.fillRect(0, 0, 640, 360); c.restore();
}
function pill(c, s) { c.save(); c.font = "500 12px " + SANS; const w = c.measureText(s).width + 22; rr(c, 14, 12, w, 22, 11); c.fillStyle = "rgba(8,10,20,.78)"; c.fill(); c.strokeStyle = "rgba(255,255,255,.16)"; c.lineWidth = 1; c.stroke(); c.restore(); T(c, s, 25, 27, 12, "#fff", 500); }

const PW = 110, PH = 62, QW = 220, QH = 124;   // 미리보기 크기, 처리용 2배 크기
function sceneA(c) {   // 노을 장면
  const sky = c.createLinearGradient(0, 0, 0, QH); sky.addColorStop(0, "#26356b"); sky.addColorStop(0.5, "#8a5a8e"); sky.addColorStop(0.8, "#f0955f"); sky.addColorStop(1, "#ffd08c"); c.fillStyle = sky; c.fillRect(0, 0, QW, QH);
  const sun = c.createRadialGradient(150, 72, 2, 150, 72, 60); sun.addColorStop(0, "rgba(255,244,214,1)"); sun.addColorStop(0.25, "rgba(255,214,150,.7)"); sun.addColorStop(1, "rgba(255,180,120,0)"); c.fillStyle = sun; c.fillRect(0, 0, QW, QH);
  const m1 = c.createLinearGradient(0, 70, 0, QH); m1.addColorStop(0, "#6b4a7e"); m1.addColorStop(1, "#3a2a58"); c.fillStyle = m1;
  c.beginPath(); c.moveTo(0, 96); [[26, 70], [54, 88], [86, 62], [120, 92], [152, 72], [184, 90], [220, 66]].forEach((p) => c.lineTo(p[0], p[1])); c.lineTo(QW, QH); c.lineTo(0, QH); c.fill();
  const m2 = c.createLinearGradient(0, 96, 0, QH); m2.addColorStop(0, "#2a2046"); m2.addColorStop(1, "#110c22"); c.fillStyle = m2;
  c.beginPath(); c.moveTo(0, 108); c.quadraticCurveTo(60, 94, 110, 110); c.quadraticCurveTo(170, 124, QW, 104); c.lineTo(QW, QH); c.lineTo(0, QH); c.fill();
}
function sceneB(c) {   // 밤 장면
  const sky = c.createLinearGradient(0, 0, 0, QH); sky.addColorStop(0, "#050c1f"); sky.addColorStop(0.6, "#0c4a63"); sky.addColorStop(1, "#1d8b94"); c.fillStyle = sky; c.fillRect(0, 0, QW, QH);
  const R = rng(3); c.fillStyle = "rgba(255,255,255,.8)"; for (let i = 0; i < 34; i++) { c.beginPath(); c.arc(R() * QW, R() * 60, 0.7 + R() * 0.7, 0, 7); c.fill(); }
  const mg = c.createRadialGradient(54, 34, 2, 54, 34, 40); mg.addColorStop(0, "rgba(235,248,255,.9)"); mg.addColorStop(1, "rgba(160,220,255,0)"); c.fillStyle = mg; c.fillRect(0, 0, QW, QH);
  c.fillStyle = "#f2f8ff"; c.beginPath(); c.arc(54, 34, 11, 0, 7); c.fill();
  const g = c.createLinearGradient(0, 80, 0, QH); g.addColorStop(0, "#0b2030"); g.addColorStop(1, "#050d16"); c.fillStyle = g;
  c.beginPath(); c.moveTo(0, 100); [[30, 84], [64, 96], [100, 78], [140, 96], [180, 82], [220, 94]].forEach((p) => c.lineTo(p[0], p[1])); c.lineTo(QW, QH); c.lineTo(0, QH); c.fill();
}
const mk = (fn) => { const o = document.createElement("canvas"); o.width = QW; o.height = QH; fn(o.getContext("2d", { willReadFrequently: true })); return o; };
function proc(src, fn) {
  const o = document.createElement("canvas"); o.width = QW; o.height = QH; const oc = o.getContext("2d"), im = src.getContext("2d").getImageData(0, 0, QW, QH), d = im.data;
  for (let y = 0; y < QH; y++) for (let x = 0; x < QW; x++) { const i = (y * QW + x) * 4, q = fn(d[i], d[i + 1], d[i + 2], x, y); d[i] = q[0]; d[i + 1] = q[1]; d[i + 2] = q[2]; }
  oc.putImageData(im, 0, 0); return o;
}
// 점들을 부드럽게 잇는 곡선(curves 필터의 key point 개념): 에르미트 보간
function curveFn(P) {
  const n = P.length, m = P.map((p, i) => { const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)]; return (b[1] - a[1]) / (b[0] - a[0] || 1); });
  return (x) => { let i = 0; while (i < n - 2 && x > P[i + 1][0]) i++; const p0 = P[i], p1 = P[i + 1], h = p1[0] - p0[0], u = (x - p0[0]) / h, u2 = u * u, u3 = u2 * u; return Math.max(0, Math.min(1, (2 * u3 - 3 * u2 + 1) * p0[1] + (u3 - 2 * u2 + u) * h * m[i] + (-2 * u3 + 3 * u2) * p1[1] + (u3 - u2) * h * m[i + 1])); };
}
const CR = [[0, 0.11], [0.42, 0.51], [1, 0.95]], CG = [[0, 0], [0.5, 0.48], [1, 1]], CB = [[0, 0.22], [0.49, 0.44], [1, 0.8]];
function miBall(c, x, y, r, a) {
  const g = c.createRadialGradient(x - r * 0.35, y - r * 0.4, 0.5, x, y, r); g.addColorStop(0, "#fff0d6"); g.addColorStop(0.5, "#ff9a5a"); g.addColorStop(1, "#a83a2c");
  c.globalAlpha = a; c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.globalAlpha = 1;
}

const NAMES = ["xfade", "drawtext", "blend", "tblend", "zoompan", "minterpolate", "perspective", "geq", "lut3d", "curves"];
const DESC = [["두 영상 사이", "전환 효과"], ["영상 위에", "글자 그리기"], ["두 영상을", "섞는 모드"], ["앞뒤 프레임을", "섞어 잔상"], ["확대하며", "이동(줌·팬)"], ["움직임을 읽어", "프레임 늘리기"], ["네 모서리를", "옮겨 원근 보정"], ["픽셀마다", "수식 적용"], ["3D LUT 로", "색 입히기"], ["곡선으로", "색 보정"]];
const GROUP = [1, 1, 1, 1, 2, 2, 2, 3, 3, 3];
const TW = 118, TH = 140, TX = (i) => 14 + (i % 5) * 124, TY = (i) => 40 + Math.floor(i / 5) * 146;
const MODES = ["dup", "blend", "mci"];

const demo = {
  dur: 6, rest: 5, noCompare: false, levels: 3,
  mount(sp) {
    const c = canvas(sp); c.canvas.style.cssText = "width:640px;height:360px;display:block";
    const s = { c, grain: grainTile(81), ok: false };
    s.A = mk(sceneA); s.B = mk(sceneB);
    s.geq = proc(s.A, (r, g, b, x, y) => [x / QW * r, (1 - x / QW) * g, (QH - y) / QH * b]);
    const fr = curveFn(CR), fg = curveFn(CG), fb = curveFn(CB);
    s.curves = proc(s.A, (r, g, b) => [fr(r / 255) * 255, fg(g / 255) * 255, fb(b / 255) * 255]);
    s.lut = proc(s.A, (r, g, b) => { const l = (0.3 * r + 0.59 * g + 0.11 * b) / 255, k = Math.min(1, l * 1.2); return [lerp(r, lerp(18, 255, k), 0.5), lerp(g, lerp(80, 170, k), 0.5), lerp(b, lerp(110, 90, k), 0.5)]; });
    return s;
  },
  render(s, t, a, lv) {
    const L = !a ? 0 : (lv == null ? 3 : lv);   // 1 = 합치기 · 그리기 4개, 2 = + 움직임 · 시간 3개, 3 = + 색 · 수식 3개
    const c = s.c; c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1; backdrop(c, s.grain);
    const sweep = (k) => E.inOutC(seg(t, 0.8 + k * 0.4, 3 + k * 0.4));
    const PREV = [
      (k) => { c.drawImage(s.A, 0, 0, PW, PH); c.globalAlpha = E.inOutC(seg(t, XF_AT, XF_AT + XF_DUR)); c.drawImage(s.B, 0, 0, PW, PH); c.globalAlpha = 1; },
      (k) => { c.drawImage(s.A, 0, 0, PW, PH); const al = seg(t, 0.6, 1.4), sc = 0.7 + 0.3 * E.outBack(seg(t, 0.6, 1.4)); c.save(); c.globalAlpha = al; c.translate(PW / 2, PH / 2 + 4); c.scale(sc, sc); c.font = "700 15px " + SANS; c.textAlign = "center"; c.lineWidth = 3; c.strokeStyle = "rgba(20,10,40,.8)"; c.strokeText("hello world", 0, 0); c.fillStyle = "#fff"; c.fillText("hello world", 0, 0); c.restore(); },
      (k) => { c.drawImage(s.A, 0, 0, PW, PH); c.save(); c.globalCompositeOperation = "difference"; c.drawImage(s.B, lerp(-34, 0, E.inOutC(seg(t, 0.5, 3.5))), 0, PW, PH); c.restore(); },
      (k) => { c.fillStyle = "#0a1224"; c.fillRect(0, 0, PW, PH); const f = (tt) => 55 + 38 * Math.sin(tt * 2.4); miBall(c, f(t - 0.2), 31, 8, 0.5); miBall(c, f(t), 31, 8, 0.5); },
      (k) => { const z = 1 + (ZOOM_MAX - 1) * E.inOutC(seg(t, 0.4, 4.6)); c.translate(PW / 2, PH / 2); c.scale(z, z); c.translate(-PW / 2, -PH / 2); c.drawImage(s.A, 0, 0, PW, PH); },
      (k) => {
        c.fillStyle = "#0a1224"; c.fillRect(0, 0, PW, PH);
        const mode = t < 1.7 ? 0 : (t < 3 ? 1 : 2), fx = [4, 39, 74], lab = ["원본 1", "새 프레임", "원본 2"];
        fx.forEach((x, i) => { c.fillStyle = "#17223d"; rr(c, x, 6, 32, 36, 3); c.fill(); c.strokeStyle = i === 1 ? "#ffd27a" : "rgba(255,255,255,.25)"; c.lineWidth = i === 1 ? 1.5 : 1; c.stroke(); T(c, lab[i], x + 16, 54, 9, i === 1 ? "#ffd27a" : "#a9b3c4", 700, "center"); });
        miBall(c, 4 + 9, 6 + 26, 5, 1); miBall(c, 74 + 23, 6 + 10, 5, 1);
        if (mode === 0) miBall(c, 39 + 9, 6 + 26, 5, 1); else if (mode === 1) { miBall(c, 39 + 9, 6 + 26, 5, 0.5); miBall(c, 39 + 23, 6 + 10, 5, 0.5); } else miBall(c, 39 + 16, 6 + 18, 5, 1);
      },
      (k) => { c.fillStyle = "#0a1224"; c.fillRect(0, 0, PW, PH); const ins = 0.2 * E.inOutC(seg(t, 0.5, 3.5)); for (let r = 0; r < PH; r++) { const e = ins * PW * (1 - r / PH), w = PW - 2 * e; c.drawImage(s.A, 0, r * 2, QW, 2, e, r, w, 1.2); } },
      (k) => { c.drawImage(s.A, 0, 0, PW, PH); const sx = sweep(0) * PW; c.save(); c.beginPath(); c.rect(0, 0, sx, PH); c.clip(); c.drawImage(s.geq, 0, 0, PW, PH); c.restore(); split(sx); },
      (k) => { c.drawImage(s.A, 0, 0, PW, PH); const sx = sweep(1) * PW; c.save(); c.beginPath(); c.rect(0, 0, sx, PH); c.clip(); c.drawImage(s.lut, 0, 0, PW, PH); c.restore(); split(sx); },
      (k) => { c.drawImage(s.A, 0, 0, PW, PH); const sx = sweep(2) * PW; c.save(); c.beginPath(); c.rect(0, 0, sx, PH); c.clip(); c.drawImage(s.curves, 0, 0, PW, PH); c.restore(); split(sx); },
    ];
    const split = (sx) => { if (sx <= 0.5 || sx >= PW - 0.5) return; c.strokeStyle = "rgba(255,255,255,.9)"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(sx, 0); c.lineTo(sx, PH); c.stroke(); c.fillStyle = "#fff"; c.beginPath(); c.arc(sx, PH / 2, 3, 0, 7); c.fill(); };
    const mode = t < 1.7 ? 0 : (t < 3 ? 1 : 2);
    const OPT = ["fade:duration=" + XF_DUR, "text='hello world'", "all_mode=difference", "all_mode=average", "z=min(zoom+…," + ZOOM_MAX + ")", "mi_mode=" + (L >= 2 ? MODES[mode] : "mci"), "x0:y0:x1:y1:…", "r='X/W*r(X,Y)'", "file=grade.cube", "preset=vintage"];
    NAMES.forEach((nm, i) => {
      const x = TX(i), y = TY(i), on = L >= GROUP[i];
      c.fillStyle = on || !a ? "rgba(255,255,255,.055)" : "rgba(255,255,255,.025)"; rr(c, x, y, TW, TH, 9); c.fill(); c.strokeStyle = on || !a ? "rgba(255,255,255,.14)" : "rgba(255,255,255,.08)"; c.lineWidth = 1; if (!(on || !a)) c.setLineDash([4, 4]); c.stroke(); c.setLineDash([]);
      const px = x + 4, py = y + 4;
      if (!a) { c.save(); rr(c, px, py, PW, PH, 6); c.clip(); c.translate(px, py); c.drawImage(s.A, 0, 0, PW, PH); c.restore(); }
      else if (on) { c.save(); rr(c, px, py, PW, PH, 6); c.clip(); c.translate(px, py); PREV[i](); c.restore(); c.strokeStyle = "rgba(255,255,255,.25)"; c.lineWidth = 1; rr(c, px, py, PW, PH, 6); c.stroke(); }
      else { c.fillStyle = "rgba(255,255,255,.03)"; rr(c, px, py, PW, PH, 6); c.fill(); T(c, GROUP[i] + "단계에서", px + PW / 2, py + PH / 2 + 4, 11, "#6f7a8f", 500, "center"); }
      const vis = on || !a;
      T(c, nm, x + 6, y + 82, 11.5, vis ? "#fff" : "#6f7a8f", 700, "left", MONO);
      T(c, a && on ? OPT[i] : "(필터 없음)", x + 6, y + 95, 9, vis ? (a && on ? "#ffd27a" : "#8b94a3") : "#566074", 500, "left", MONO);
      T(c, DESC[i][0], x + 6, y + 110, 10.5, vis ? "#c9d1e0" : "#6f7a8f", 500); T(c, DESC[i][1], x + 6, y + 124, 10.5, vis ? "#c9d1e0" : "#6f7a8f", 500);
    });
    T(c, 'ffmpeg -i in.mp4 -vf "필터=옵션" out.mp4', 14, 352, 10.5, "#8b94a3", 500, "left", MONO);
    pill(c, L === 0 ? "연출 전 · 필터를 걸기 전의 같은 장면" : (L === 1 ? "합치기 · 그리기 필터 4개" : (L === 2 ? "+ 움직임 · 시간 필터 3개" : "+ 색 · 수식 필터 3개")));
  },
};
export default demo;
