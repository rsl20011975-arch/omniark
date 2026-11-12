import Link from "next/link";

const TABS = [
  { href: "/lab", label: "용어 사전" },
  { href: "/lab/elements", label: "요소 사전" },
  { href: "/lab/prompts", label: "지시 문장" },
  { href: "/lab/clips", label: "예시 영상" },
  { href: "/lab/fonts", label: "글꼴" },
];

/** 사전의 갈래를 오가는 줄. 지금 보는 곳만 aria-current. */
export default function LabTabs({ current }: { current: string }) {
  return (
    <nav className="ltabs" aria-label="사전 종류">
      {TABS.map((t) => (
        <Link key={t.href} href={t.href} aria-current={t.href === current ? "page" : undefined}>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
