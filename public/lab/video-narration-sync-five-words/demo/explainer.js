// 002 설명 화면 부품: 매출 대시보드 + 자막 위에 연출 다섯 가지(내레이션 싱크·줌인·콜아웃·스포트라이트·화면 주석)를 켜고 끈다.
// 모든 모습은 시각 T 의 함수라 블로그 플레이어(player.js)와 롱폼 장면이 같은 부품을 쓴다.
//   const ex = Explainer(무대 div(1280×720), { timing }); ex.set(["zoom", ...]); ex.render(T) → { since(멈춘 초), longs(3초 넘는 정지 수) }
//   timing: 녹음한 줄마다 { t: 시작, d: 길이, w: 짚을 말이 나오는 시각 } (없으면 글자 수로 어림), total: 전체 초
window.Explainer = (stage, opts = {}) => {
  const DASH = Explainer.DASH;
  const { clamp, p, eio, bo, track, ring, underline, Cursor } = Stage;
  const TECH = Explainer.TECH = [["sync", "내레이션 싱크", "audio-lines"], ["zoom", "줌인", "zoom-in"], ["call", "콜아웃", "message-square-text"], ["spot", "스포트라이트", "flashlight"], ["note", "화면 주석", "pen-line"]];
  const RATE = 5.2, GAP = .55, LEAD = .6, TAIL = 1.6, LAG = 2.4;   // 말 속도(공백 뺀 글자/초) · 줄 사이 · 첫 줄 앞 · 끝 여운 · 싱크 없을 때 늦는 초
  // 대사 = 자막. key = 화면이 짚을 말, to = 짚을 곳, box = 줌인할 곳, tag = 콜아웃 글, mark = 주석 모양
  const LINES = [
    { text: "이 화면은 이번 달 매출을 한눈에 보여 줍니다." },
    { text: "맨 위 큰 숫자는, 지난달보다 12% 올랐다는 뜻이에요.", key: "12%", to: "delta", box: "kpi", tag: ["지난달 대비 +12%", "핵심 숫자"], side: "right", mark: "ring" },
    { text: "아래 막대그래프에서는 수요일이 가장 높죠.", key: "수요일", to: "wed", box: "chart", tag: ["가장 높은 날", "수요일"], mark: "ring" },
    { text: "환불된 주문은 표에서 빨간 줄로 표시됩니다.", key: "빨간", to: "refund", box: "table", tag: ["빨간 줄 = 환불", "표 셋째 줄"], mark: "under" },
    { text: "자세한 자료는 오른쪽 위 내보내기 버튼으로 받으세요.", key: "내보내기", to: "exp", box: "head", tag: ["자료 받기", "누르면 엑셀 파일"], mark: "click" },
  ];
  const chars = s => s.replace(/\s/g, "").length;
  let t = LEAD;
  LINES.forEach((L, i) => { L.t = t; L.d = chars(L.text) / RATE; if (L.key) L.w = t + chars(L.text.slice(0, L.text.indexOf(L.key))) / RATE; t += L.d + GAP;
    if (opts.timing) Object.assign(L, opts.timing[i]) });
  const TOTAL = opts.total || t - GAP + TAIL;

  // 화면 짓기
  const scr = Screen(stage, [0, 0, 1280, 720], 1280, "#f6f4ef");
  scr.el.style.zIndex = 1; scr.content.insertAdjacentHTML("beforeend", DASH); lucide.createIcons();
  stage.insertAdjacentHTML("beforeend", '<div class="cap"></div>'); const cap = stage.querySelector(".cap");
  const spot = document.createElement("div"); spot.className = "spot"; scr.content.appendChild(spot);
  // 페이지 좌표로 잰다: offset 을 페이지까지 더한다(틀을 줄이거나 기울여도 값이 같다 - 화면 크기 기준으로 재면 기울인 썸네일에서 어긋났다)
  const R = id => { let e = scr.content.querySelector("#" + id), x = 0, y = 0; const w = e.offsetWidth, h = e.offsetHeight;
    while (e && e !== scr.content) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent } return [x, y, w, h] };
  const RECT = { head: [700, 20, 560, 150] };
  ["delta", "kpi", "wed", "chart", "refund", "table", "exp"].forEach(id => RECT[id] = R(id));
  const pad = ([x, y, w, h], n) => [x - n, y - n, w + 2 * n, h + 2 * n];
  const cx = r => r[0] + r[2] / 2, cy = r => r[1] + r[3] / 2;
  const camOf = r => { const z = Math.min(2, .82 * 1280 / r[2], .74 * 720 / r[3]), hw = 640 / z, hh = 360 / z;   // 페이지 밖(빈 곳)이 보이지 않게 가운데를 가둔다
    return [clamp(cx(r), hw, 1280 - hw), clamp(cy(r), hh, 720 - hh), z] };
  const HOME = [640, 360, 1];

  const on = new Set();

  // 켠 연출로 짚을 순간들을 계산한다
  let plan;
  // T0: 연출을 켠 순간(설명 화면 시각). 이미 지나간 짚기라도 그 순간부터 새로 짚는다 - '해결' 이름이 나오는 순간 화면이 고쳐지게(결정 #47)
  function build(T0) {
    const cues = LINES.filter(L => L.key && L.w < 900).map(L => ({ L, tc: Math.min(on.has("sync") ? L.w : L.w + LAG, TOTAL - 1.4) }));
    cues.forEach((c, i) => c.end = i < cues.length - 1 ? cues[i + 1].tc - .15 : TOTAL - .9);
    cues.forEach(c => c.cam = c.tc);   // 카메라는 원래 흐름 그대로(켜는 순간으로 옮기면 앞 장면으로 튀었다가 다시 갔다 - 2차 시안 실측)
    if (T0 != null) cues.forEach(c => { if (c.tc - .6 < T0 && T0 < c.end) c.tc = T0 + .3 });
    const vis = ["zoom", "call", "spot", "note"].some(x => on.has(x));
    const cam = [[0, HOME]];
    if (on.has("zoom")) { cues.forEach(c => cam.push([c.cam - .25, camOf(pad(RECT[c.L.box], 24)), .75])); cam.push([TOTAL - .9, HOME, .8]) }
    const marks = [], tags = [], acts = [];
    cues.forEach((c, i) => {
      const r = RECT[c.L.to];
      if (on.has("call")) { const side = c.L.side || (r[1] < 130 ? "down" : "up"), at = { up: [r[0], r[1] - 82], down: [r[0] - 40, r[1] + r[3] + 22], right: [r[0] + r[2] + 30, r[1] - 4] }[side];
        tags.push({ html: `${c.L.tag[0]}<small>${c.L.tag[1]}</small>`, at, on: c.tc + .1, off: c.end, cls: "see " + side }) }
      if (on.has("note")) {
        if (c.L.mark === "ring") { const pts = ring(r, 16, i + 2); marks.push({ pts, t: c.tc, d: .6, off: c.end, col: "#6d28d9", w: 6 }); acts.push({ t: c.tc - .55, move: pts[0], d: .5 }, { t: c.tc, draw: pts, d: .6 }) }
        if (c.L.mark === "under") { const pts = underline(r[0] + 16, r[0] + r[2] - 16, r[1] + r[3] + 8, i); marks.push({ pts, t: c.tc, d: .5, off: c.end, col: "#6d28d9", w: 6 }); acts.push({ t: c.tc - .55, move: pts[0], d: .5 }, { t: c.tc, draw: pts, d: .5 }) }
        if (c.L.mark === "click") acts.push({ t: c.tc - .55, move: [cx(r) - 10, cy(r) + 4], d: .5 }, { t: c.tc, click: true });
      }
    });
    // 움직이는 구간(멈춤 재기용): 짚는 순간 앞뒤, 줌인이면 마지막 되돌아오기
    const moves = vis ? cues.map(c => [c.tc - .6, c.tc + .8]) : [];
    if (on.has("zoom")) moves.push([0, cues[0].tc], ...cues.map(c => [c.tc, c.end + .8]));
    let last = 0, longs = 0;
    moves.sort((x, y) => x[0] - y[0]).concat([[TOTAL, TOTAL]]).forEach(([a, b]) => { if (a - last > 3) longs++; last = Math.max(last, b) });
    plan = { cues, cam, marks, tags, moves, longs, cursor: on.has("note") ? new Cursor([1190, 690], acts) : null };
  }

  // 줌인이 켜져 있으면 머무는 동안에도 카메라가 아주 천천히 다가간다(멈춘 화면 방지). 다음 이동이 시작되면 그만큼을 풀어 끊김이 없게
  const drift = (T, P) => {
    const segs = [[0, (P.cues[0] ? P.cues[0].tc : TOTAL) - .25, .04]].concat(P.cues.map(c => [c.tc + .5, c.end - .1, .05]));
    return segs.reduce((s, [a, b, amt]) => s + amt * eio(p(T, a, Math.max(.1, b - a))) * (1 - eio(p(T, b, .75))), 0);
  };

  function render(T) {
    const P = plan, cam = (on.has("zoom") ? track(T, P.cam) : HOME).slice();
    if (on.has("zoom")) cam[2] *= 1 + drift(T, P);
    scr.frame(T, { cam, marks: P.marks, tags: P.tags, cursor: P.cursor });
    const c = on.has("spot") && P.cues.find(c => T >= c.tc - .1 && T < c.end + .3);
    if (c) { const r = pad(RECT[c.L.to], 12), v = eio(p(T, c.tc - .1, .35)) * (1 - eio(p(T, c.end, .3))); Object.assign(spot.style, { left: r[0] + "px", top: r[1] + "px", width: r[2] + "px", height: r[3] + "px", opacity: v }) }
    else spot.style.opacity = 0;
    const L = [...LINES].reverse().find(L => T >= L.t - .05);
    if (L && T < L.t + L.d + .45) { const s = L.key && T >= L.w ? L.text.replace(L.key, `<em>${L.key}</em>`) : L.text; cap.innerHTML = s; cap.style.opacity = clamp((T - L.t + .05) / .15) }
    else cap.style.opacity = 0;
    const moving = P.moves.some(([a, b]) => T >= a && T < b), since = moving ? 0 : T - Math.max(0, ...P.moves.filter(m => m[1] <= T).map(m => m[1]));
    return { since, longs: P.longs };
  }

  const set = (list, T0) => { on.clear(); list.forEach(x => TECH.some(y => y[0] === x) && on.add(x)); build(T0) };
  build();
  return { TOTAL, LINES, TECH, RECT, on, set, render, cues: () => plan.cues };
};
Explainer.DASH = `
<div class="dash">
    <h1>이번 달 매출</h1><div class="dsub">11월 1일 – 30일 · 가상의 숫자</div>
    <div class="exp" id="exp"><i data-lucide="download"></i>내보내기</div>
    <div class="card" id="kpi" style="left:56px;top:124px;width:520px;height:270px">
      <div style="position:absolute;left:32px;top:30px" class="lbl">매출</div>
      <div style="position:absolute;left:30px;top:68px" class="kpi-n">4,820,000<small>원</small></div>
      <div style="position:absolute;left:32px;top:152px" class="delta" id="delta"><i data-lucide="trending-up"></i>지난달보다 12%</div>
      <div style="position:absolute;left:32px;top:214px;font-size:16px;color:#6f685f;font-weight:500">지난달 4,300,000원</div>
    </div>
    <div class="card" id="chart" style="left:604px;top:124px;width:620px;height:270px">
      <div style="position:absolute;left:32px;top:30px" class="lbl">요일별 주문</div>
      <div class="bars">
        <div><i style="height:52%"></i><span>월</span></div><div><i style="height:61%"></i><span>화</span></div>
        <div class="top" id="wed"><i style="height:100%"></i><span>수</span></div><div><i style="height:66%"></i><span>목</span></div>
        <div><i style="height:58%"></i><span>금</span></div><div><i style="height:40%"></i><span>토</span></div><div><i style="height:33%"></i><span>일</span></div>
      </div>
    </div>
    <div class="card" id="table" style="left:56px;top:418px;width:1168px;height:262px">
      <div class="row h" style="top:16px"><span>주문 번호</span><span>상품</span><span class="r">금액</span><span class="r">상태</span></div>
      <div class="row" style="top:62px"><b>#2041</b><span>원목 도마 세트</span><span class="r">64,000원</span><span class="r">결제 완료</span></div>
      <div class="row" style="top:110px"><b>#2040</b><span>리넨 앞치마</span><span class="r">38,000원</span><span class="r">배송 중</span></div>
      <div class="row refund" id="refund" style="top:158px"><b>#2039</b><span>유리 밀폐 용기 6종</span><span class="r">−89,000원</span><span class="r">환불</span></div>
      <div class="row" style="top:206px"><b>#2038</b><span>무쇠 팬 24cm</span><span class="r">72,000원</span><span class="r">결제 완료</span></div>
    </div>
  </div>
`;
