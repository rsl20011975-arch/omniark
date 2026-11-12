import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import "./studio.css";



export const metadata: Metadata = {
  metadataBase: new URL("https://omniark.co"),

  verification: {
    google: "Cz9GASrTO3jWMSsvfR_yiie1JN5x5H5daEntUcrrFEI",
    // 네이버 서치어드바이저 사이트 소유확인(2026-11-11)
    other: { "naver-site-verification": "90481442587e1db2a035242ea233fe9941282426" },
  },

  title: {
    default: "OMNIARK | 필요한 것을 직접 만드는 개발 스튜디오",
    template: "%s | OMNIARK",
  },

  description:
    "직접 만든 소프트웨어와 실제 개발 시행착오를 기록하는 OMNIARK 개발 스튜디오입니다.",

  keywords: [
    "technology",
    "AI",
    "digital tools",
    "productivity",
    "web",
    "internet",
    "digital knowledge",
  ],

  authors: [{ name: "OMNIARK" }],
  creator: "OMNIARK",
  publisher: "OMNIARK",

  openGraph: {
    type: "website",
    siteName: "OMNIARK",
    locale: "ko_KR",
    title: "OMNIARK | 필요한 것을 직접 만드는 개발 스튜디오",
    description:
      "직접 만든 소프트웨어와 실제 개발 시행착오를 기록합니다.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

const navigation = [
  { name: "제품·서비스", href: "/products" },
  { name: "소개", href: "/about" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="google-adsense-account" content="ca-pub-2615575361893703" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2615575361893703"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <div className="site-shell">
          <header className="site-header">
            <div className="container header-inner">
              <Link href="/" className="brand">
                OMNIARK
              </Link>

              <nav className="main-navigation" aria-label="Main navigation">
                {navigation.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </header>

          <main className="site-main">{children}</main>

          <footer className="site-footer">
            <div className="container footer-inner">
              <div>
                <Link href="/" className="footer-brand">
                  OMNIARK
                </Link>

                <p>
                  Practical knowledge for understanding the digital world.
                </p>
              </div>

              <nav className="footer-navigation" aria-label="Footer navigation">
                <Link href="/products">Products</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms of Use</Link>
                <Link href="/cookie-policy">Cookie Policy</Link>
              </nav>
            </div>

            <div className="container footer-bottom">
              <p>© {new Date().getFullYear()} OMNIARK. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
