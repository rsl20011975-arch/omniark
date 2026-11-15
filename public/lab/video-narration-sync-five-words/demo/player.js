// 002 블로그 플레이어: Explainer(explainer.js) 위에 재생·시간 막대·연출 켜고 끄기 단추를 얹는다.
// 주소 옵션: ?on=all | sync,zoom,call,spot,note   ?controls=0(조작 막대 숨김)   ?t=초(그 시각에서 멈춤)   ?loop=a-b(그 구간만 되풀이)
(() => {
  const $ = id => document.getElementById(id), stage = $("stage"), q = new URLSearchParams(location.search);
  const ex = Explainer(stage), { TOTAL, TECH, on } = ex;
  ex.set(q.get("on") === "all" ? TECH.map(x => x[0]) : (q.get("on") || "").split(","));
  if (q.get("controls") === "0") $("ctl").style.display = "none";
  const show = T => {
    const { since, longs } = ex.render(T);
    $("still").className = "pill" + (since > 3 ? " warn" : ""); $("still").innerHTML = `<i></i>화면이 멈춘 지 ${since.toFixed(1)}초 · 3초 넘는 정지 ${longs}번`;
    $("on").textContent = "켠 연출: " + (on.size ? TECH.filter(x => on.has(x[0])).map(x => x[1]).join(" · ") : "없음 (멈춘 화면 + 자막)");
  };
  // 조작
  const tgs = $("tgs");
  tgs.innerHTML = `<button class="tg all" id="all"></button>` + TECH.map(([id, name, ic]) => `<button class="tg" data-id="${id}" aria-pressed="false"><i data-lucide="${ic}"></i>${name}</button>`).join("");
  const sync = () => { tgs.querySelectorAll("[data-id]").forEach(b => b.setAttribute("aria-pressed", on.has(b.dataset.id))); $("all").textContent = on.size === TECH.length ? "전부 끄기" : "전부 켜기" };
  tgs.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.id === "all") { const full = on.size === TECH.length; on.clear(); if (!full) TECH.forEach(x => on.add(x[0])) }
    else on.has(b.dataset.id) ? on.delete(b.dataset.id) : on.add(b.dataset.id);
    sync(); ex.set([...on]); show(T);
  });
  lucide.createIcons();
  const fit = () => stage.style.transform = `scale(${$("view").clientWidth / 1280})`;
  addEventListener("resize", fit); fit();

  // loop=a-b: 그 구간만 되풀이(블로그 단어 카드 - 짚는 순간 앞뒤만 보여 문제/해결 차이가 바로 보이게)
  const [LA, LB] = (q.get("loop") || `0-${TOTAL}`).split("-").map(Number);
  let T = +(q.get("t") || LA), playing = !q.has("t"), last = null;
  const setPlay = v => { playing = v; $("play").innerHTML = `<i data-lucide="${v ? "pause" : "play"}"></i>`; lucide.createIcons(); last = null };
  $("play").onclick = () => setPlay(!playing);
  $("seek").oninput = e => { T = e.target.value / 1000 * TOTAL; show(T) };
  function tick(now) {
    if (playing) { if (last != null) { T += (now - last) / 1000; if (T >= LB) T = LA + (T - LB) % (LB - LA) } last = now; show(T) }
    $("seek").value = Math.round(T / TOTAL * 1000); $("tm").textContent = `${T.toFixed(1)}초 / ${TOTAL.toFixed(0)}초`;
    requestAnimationFrame(tick);
  }
  sync(); setPlay(playing); show(T); requestAnimationFrame(tick);
  window.TOTAL = TOTAL; window.render = x => { playing = false; T = x; show(x) };
})();
