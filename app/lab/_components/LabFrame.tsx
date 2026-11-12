import Link from "next/link";
import { LAB_NAV } from "../_lib/config";
import ThemeToggle from "./ThemeToggle";

/** 저장된 테마를 첫 화면 그리기 전에 적용해 깜빡임을 막는다. */
const THEME_BOOT = `try{var t=localStorage.getItem("lab-theme");if(t==="dark"||t==="light"){document.currentScript.parentElement.dataset.theme=t}}catch(e){}`;

export default function LabFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="lab-root" data-theme="light" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      <header className="tb">
        <div className="in">
          <Link className="brand" href="/" aria-label="옴니아크 홈">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/studio-assets/brand.png" alt="" />
            <span>omniark</span>
          </Link>
          <nav aria-label="주 메뉴">
            {LAB_NAV.map((item) => (
              <Link key={item.href} href={item.href} aria-current={item.href === "/lab" ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
            <ThemeToggle />
          </nav>
        </div>
      </header>
      {children}
      <footer className="ftr">
        <div className="in">
          <span>© {new Date().getFullYear()} OMNIARK · Visual Lab</span>
          <span>
            <Link href="/contact">문의</Link> · <Link href="/privacy">개인정보 처리방침</Link> ·{" "}
            <Link href="/terms">이용약관</Link> · <Link href="/cookie-policy">쿠키 정책</Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
