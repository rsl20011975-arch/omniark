// 개발노트 'lab' 형식의 공용 동작: 지시문 복사, 줄인 화면 맞추기, 아이콘(Lucide) 그리기.
// 글마다 다른 동작은 그 글의 script(예: /lab/<slug>/page.js)에 둔다.
(() => {
  document.querySelectorAll(".journal--lab .copy").forEach((b) => b.addEventListener("click", async () => {
    const text = b.parentElement.querySelector("code")?.innerText ?? "";
    try { await navigator.clipboard.writeText(text); b.textContent = "복사됨"; }
    catch { b.textContent = "직접 드래그해 복사하세요"; }
    setTimeout(() => (b.textContent = "복사"), 1600);
  }));

  const fit = () => document.querySelectorAll(".journal--lab .lab-screen").forEach((s) => {
    const f = s.querySelector("iframe");
    if (f) f.style.transform = `scale(${s.clientWidth / 1280})`;
  });
  addEventListener("resize", fit);
  fit();

  if (document.querySelector(".journal--lab [data-lucide]")) {
    const s = document.createElement("script");
    s.src = "https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js";
    s.onload = () => window.lucide.createIcons();
    document.head.appendChild(s);
  }
})();
