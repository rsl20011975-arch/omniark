// 003 스크롤 데모: 효과 세 가지(reveal 스크롤 리빌 · stagger 스태거 · parallax 패럴랙스)를 켜고 끄는 가짜 베이커리 홈페이지.
// 효과는 전부 '스크롤 위치 y 의 함수'다(CSS 스크롤 연동 애니메이션 view() 와 같은 생각) - 되감기·건너뛰기·영상 렌더가 그대로 되고, 켜기/끄기로 레이아웃이 흔들리지 않는다.
//   const sd = ScrollDemo(호스트 div, { virtual }); sd.set(["reveal", ...]); sd.render(y)
//   virtual=true: 브라우저 스크롤 대신 내용을 위로 밀어 보인다(영상용, 호스트 크기 고정). false: 실제 스크롤 + scroll 이벤트(블로그 플레이어)
// 움직임 줄이기 설정(prefers-reduced-motion)이면 실제 스크롤 모드에서는 효과를 켜지 않는다.
window.ScrollDemo = (host, { virtual = false } = {}) => {
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  host.classList.add("sd");
  host.innerHTML = `<div class="sd-page"><div class="sd-in">
    <section class="sec hero"><div class="bg" data-speed=".5">06<i>:</i>00</div>
      <nav><b>하루제빵소</b><span>빵</span><span>이야기</span><span>오시는 길</span></nav>
      <div class="hd"><small>EST. 2019 · 가상의 가게</small><h1>하루 한 번,<br>정직한 반죽.</h1><p>매일 아침 6시, 갓 구운 빵이 나옵니다.</p></div></section>
    <section class="sec" id="s-cards"><h2 class="rv" data-i="0">오늘의 빵</h2>
      <div class="cards"><div class="card c1 rv" data-i="1"><em>3,800</em><b>소금빵</b><span>겉은 바삭, 속은 쫄깃.</span></div><div class="card c2 rv" data-i="2"><em>4,500</em><b>크루아상</b><span>버터 향이 층층이.</span></div><div class="card c3 rv" data-i="3"><em>6,200</em><b>식빵</b><span>아침 토스트에 딱.</span></div></div></section>
    <section class="sec" id="s-row"><div class="row"><div class="pic rv" data-i="0"><span>밀가루</span><span>물</span><span>소금</span><span>시간</span></div><div class="txt"><h2 class="rv" data-i="0">천천히, 정직하게</h2><p class="rv" data-i="1">첨가물 없이 하루 한 번 반죽합니다.</p><p class="rv" data-i="2">매장에서 구워 바로 드립니다.</p></div></div></section>
    <section class="sec" id="s-info"><h2 class="rv" data-i="0">찾아오시는 길</h2><div class="cards two"><div class="card c1 rv" data-i="1"><b>영업시간</b><em>06:00–18:00</em></div><div class="card c2 rv" data-i="2"><b>위치</b><span>가상의 주소 · 예시용 페이지</span></div></div></section>
    <div class="foot">하루제빵소 · 예시용 가상의 가게입니다.</div>
  </div></div>`;
  const page = host.firstElementChild, inn = page.firstElementChild;
  if (virtual) host.classList.add("fix");   // 영상·썸네일: 창 크기(vw·vh)와 상관없이 호스트 크기로 고정(1920 창에서 글자가 커지던 것 - 실측)
  const hero = inn.querySelector(".hero"), fit = () => { hero.style.minHeight = host.clientHeight + "px" }; fit(); if (!virtual) addEventListener("resize", () => { fit(); api.render() });
  const rv = [...inn.querySelectorAll(".rv")], sp = [...inn.querySelectorAll("[data-speed]")];
  const pos = e => { let y = 0; for (; e && e !== inn; e = e.offsetParent) y += e.offsetTop; return y };
  let on = new Set(), cache = null;
  const tops = () => cache || (cache = new Map(rv.map(e => [e, pos(e)])));
  const reduce = !virtual && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const api = {
    set(list) { on = new Set(reduce ? [] : list); api.render(api.y) },
    on: () => [...on],
    pos: sel => pos(inn.querySelector(sel)),                        // 그 요소가 페이지 맨 위에서 몇 px 아래인지(영상이 스크롤 목표를 잡을 때)
    maxY: () => inn.scrollHeight - host.clientHeight,
    y: 0,
    render(y) {
      cache = null; const H = host.clientHeight;
      if (virtual) { y = y == null ? 0 : y; inn.style.transform = `translateY(${-y}px)` } else y = page.scrollTop;
      api.y = y;
      const T = tops();
      rv.forEach(e => {
        if (!on.has("reveal")) { e.style.opacity = ""; e.style.transform = ""; return }
        const i = on.has("stagger") ? +e.dataset.i || 0 : 0;      // 스태거: 같은 줄의 형제를 i 번째마다 60px 늦게 시작
        const t = clamp((y + H - T.get(e) - 40 - i * 60) / 220), k = 1 - Math.pow(1 - t, 3);
        e.style.opacity = k; e.style.transform = `translateY(${(1 - k) * 44}px)`;
      });
      sp.forEach(e => e.style.transform = on.has("parallax") ? `translateY(${y * +e.dataset.speed * .5}px)` : "");   // 배경은 스크롤의 1/4·1/8 만큼 따라 내려와 느리게 뒤처진다
    },
  };
  if (!virtual) page.addEventListener("scroll", () => api.render(), { passive: true });
  return api;
};
