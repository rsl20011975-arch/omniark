import Link from "next/link";
import "../journal.css";

const navigation = [
  { href: "/products", label: "제품·서비스" },
  { href: "/blog", label: "개발 노트" },
  { href: "/guides", label: "활용 가이드" },
  { href: "/about", label: "소개" },
];

const footerLinks = [
  ...navigation,
  { href: "/contact", label: "문의" },
  { href: "/privacy", label: "개인정보 처리방침" },
  { href: "/terms", label: "이용약관" },
  { href: "/cookie-policy", label: "쿠키 정책" },
];

/**
 * Dark studio page shell (header + footer) for pages written as real React
 * components. Uses the same `.omni-studio` classes as the product pages, so the
 * shared light layout header/footer is hidden automatically.
 */
export default function StudioShell({
  current,
  children,
}: {
  current?: string;
  children: React.ReactNode;
}) {
  return (
    <div lang="ko" className="omni-studio">
      <header>
        <Link className="brand" href="/" aria-label="옴니아크 홈">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/studio-assets/brand.png" alt="" />
          <span>omniark</span>
        </Link>
        <nav aria-label="메인 메뉴">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={current === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="support" href="/contact">
          문의 <span>↗</span>
        </Link>
      </header>

      <div className="studio-main">{children}</div>

      <footer>
        <div className="footer-top">
          <div>
            <Link className="brand" href="/">
              <span>OMNIARK</span>
            </Link>
            <p className="original-footer-description">
              일상에 쓸모를 더하는 소프트웨어를 만들고, 그 과정에서 배운 것을 기록합니다.
            </p>
          </div>
          <nav className="original-footer-nav" aria-label="하단 메뉴">
            {footerLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} OMNIARK. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
