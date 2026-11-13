const base = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeLinecap: "round" as const, "aria-hidden": true };

export const SearchIcon = () => (
  <svg {...base} strokeWidth={2}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const CheckIcon = () => (
  <svg {...base} strokeWidth={2.4} strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);
export const ArrowIcon = () => (
  <svg {...base} width={16} height={16} strokeWidth={2.2} strokeLinejoin="round"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
);
export const DownloadIcon = () => (
  <svg {...base} width={18} height={18} strokeWidth={2.2} strokeLinejoin="round"><path d="M12 4v11m-5-5 5 5 5-5M5 20h14" /></svg>
);
