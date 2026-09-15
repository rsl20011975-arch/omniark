import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://omniark.co"),

  title: {
    default: "OMNIARK | Digital Knowledge & Practical Guides",
    template: "%s | OMNIARK",
  },

  description:
    "OMNIARK provides practical and accessible guides about technology, AI and digital tools, productivity, and the web.",

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
    title: "OMNIARK | Digital Knowledge & Practical Guides",
    description:
      "Practical guides about technology, AI and digital tools, productivity, and the web.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

const navigation = [
  {
    name: "Technology",
    href: "/technology",
  },
  {
    name: "AI & Digital Tools",
    href: "/ai-digital-tools",
  },
  {
    name: "Productivity",
    href: "/productivity",
  },
  {
    name: "Web & Internet",
    href: "/web-internet",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2615575361893703"
          crossOrigin="anonymous"
        ></script>
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