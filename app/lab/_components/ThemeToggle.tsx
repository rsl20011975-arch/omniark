"use client";

/** 라이트/다크 전환. 상태는 화면(.lab-root)의 data-theme 와 localStorage 에만 둔다. */
export default function ThemeToggle() {
  function toggle() {
    const root = document.querySelector<HTMLElement>(".lab-root");
    if (!root) return;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("lab-theme", next);
    } catch {
      /* 저장이 막힌 환경에서는 이번 방문에만 적용 */
    }
  }
  return (
    <button type="button" className="tt" onClick={toggle} aria-label="라이트·다크 전환">
      라이트·다크
    </button>
  );
}
