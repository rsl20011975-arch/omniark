// 시연 모션 도구(결정 #37·#38): 말에 맞춰 짚는 장면을 만드는 부품. 모든 함수는 시각 T 를 받아 그 순간 모습을 돌려준다(되감기·건너뛰기 가능).
// - track: 값이 바뀔 때마다 부드럽게 넘어가는 키 목록   - camera: 화면 일부로 줌인/줌아웃
// - Cursor: 곡선으로 가감속하며 이동, 클릭(누름+물결), 동그라미·밑줄을 직접 그리며 따라감, 쉴 때는 손처럼 살짝 흔들림
// - marks: 손으로 그린 듯한 동그라미·밑줄 경로(경로 길이 1로 정규화 → 그린 만큼만 보임)
(() => {
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), p = (t, a, d) => clamp((t - a) / d);
  const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const eo = x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
  const bo = x => { const c = 1.70158, c3 = c + 1; return 1 + c3 * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2) };
  const lerp = (a, b, k) => Array.isArray(a) ? a.map((v, i) => v + (b[i] - v) * k) : a + (b - a) * k;

  // keys: [[시각, 값, 걸리는 초(생략 .7)], ...] 시각 순. 값은 숫자 또는 숫자 배열. 넘어갈 때 가감속.
  function track(T, keys) {
    let v = keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      const [t, nv, d = .7] = keys[i];
      if (T < t) break;
      v = lerp(v, nv, eio(p(T, t, d)));
    }
    return v;
  }

  // 손으로 그린 동그라미: 사각형 둘레를 돌며 시작점을 살짝 넘겨 겹친다. seed 로 흔들림 모양 고정.
  function ring([x, y, w, h], pad = 18, seed = 1) {
    const cx = x + w / 2, cy = y + h / 2, rx = w / 2 + pad, ry = h / 2 + pad, pts = [];
    for (let i = 0; i <= 64; i++) {
      const a = (-110 + i * (380 / 64)) * Math.PI / 180, wob = 1 + .035 * Math.sin(3 * a + seed) + .02 * Math.sin(7 * a + seed * 2);
      pts.push([cx + rx * wob * Math.cos(a), cy + ry * wob * Math.sin(a) * (1 + i / 64 * .06)]);
    }
    return pts;
  }
  // 손으로 그은 밑줄: 살짝 휘고 끝이 올라간다
  function underline(x1, x2, y, seed = 1) {
    const pts = [];
    for (let i = 0; i <= 24; i++) { const k = i / 24; pts.push([x1 + (x2 - x1) * k, y + 4 * Math.sin(k * Math.PI + seed) - 6 * k * k]); }
    return pts;
  }
  const pathD = pts => "M" + pts.map(q => q[0].toFixed(1) + " " + q[1].toFixed(1)).join(" L");
  const along = (pts, k) => { const f = clamp(k) * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(f)), r = f - i; return lerp(pts[i], pts[i + 1], r) };

  // 포인터: acts 는 시각 순 [{t, move:[x,y]} | {t, click:true} | {t, draw:pts, d:초}]. pos(T)·pressed(T)·ripples(T)
  class Cursor {
    constructor(start, acts) { this.start = start; this.acts = acts; }
    pos(T) {
      let at = this.start;
      for (const a of this.acts) {
        if (T < a.t) break;
        if (a.move) {
          const d = a.d || .35 + Math.hypot(a.move[0] - at[0], a.move[1] - at[1]) / 1800, k = eio(p(T, a.t, d));
          // 곡선: 이동 방향의 수직으로 거리의 12% 만큼 휜 2차 곡선(사람 손은 직선으로 안 간다)
          const mx = (at[0] + a.move[0]) / 2, my = (at[1] + a.move[1]) / 2, dx = a.move[0] - at[0], dy = a.move[1] - at[1];
          const c = [mx - dy * .12, my + dx * .12];
          const q = [(1 - k) ** 2 * at[0] + 2 * (1 - k) * k * c[0] + k * k * a.move[0], (1 - k) ** 2 * at[1] + 2 * (1 - k) * k * c[1] + k * k * a.move[1]];
          at = T < a.t + d ? q : a.move;
        } else if (a.draw) {
          const k = eio(p(T, a.t, a.d || 1)); at = along(a.draw, k);
        }
      }
      const idle = [Math.sin(T * 1.7) * 3 + Math.sin(T * .9) * 2, Math.cos(T * 1.3) * 2.5];     // 쉬는 손의 흔들림
      return [at[0] + idle[0], at[1] + idle[1]];
    }
    // 누른 상태: 클릭 직후 0.18초, 또는 hold 를 단 draw(끌기) 동안
    pressed(T) { return this.acts.some(a => (a.click && T >= a.t && T < a.t + .18) || (a.hold && T >= a.t && T < a.t + (a.d || 1))) }
    ripples(T) { return this.acts.filter(a => a.click && T >= a.t && T < a.t + .55).map(a => ({ at: this.pos(a.t), k: eo(p(T, a.t, .55)) })) }
  }

  // 카메라: 무대(sw×sh) 안에 원본 페이지 좌표의 (cx,cy)를 가운데에, base×z 배율로
  const camera = (sw, sh, base, [cx, cy, z]) => `translate(${sw / 2}px,${sh / 2}px) scale(${base * z}) translate(${-cx}px,${-cy}px)`;

  window.Stage = { clamp, p, eio, eo, bo, lerp, track, ring, underline, pathD, along, Cursor, camera };
})();
