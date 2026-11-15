// 용어 사전 '여백' 글 전용: 바꿔 보기 막대(여백 배율 4단계)
(() => {
  const steps = [[0.15, "빽빽하게"], [0.5, "조금"], [1, "알맞게"], [2.2, "너무 넓게"]];
  const live = document.getElementById("live"), k = document.getElementById("k"), kl = document.getElementById("kl");
  if (!live || !k || !kl) return;
  const apply = () => { const [v, t] = steps[k.value]; live.style.setProperty("--k", v); kl.textContent = t; };
  k.addEventListener("input", apply); apply();
})();
