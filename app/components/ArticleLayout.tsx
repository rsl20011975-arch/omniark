import Link from "next/link";

type ArticleLayoutProps = {
  category: string;
  categoryHref: string;
  title: string;
  description: string;
  articleUrl: string;
  children: React.ReactNode;
};

export default function ArticleLayout({
  category,
  categoryHref,
  title,
  description,
  articleUrl,
  children,
}: ArticleLayoutProps) {
  const siteUrl = "https://omniark.co";

  const categoryUrl = `${siteUrl}${categoryHref}`;

  return (
    <article className="article-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description,
            author: {
              "@type": "Organization",
              name: "OMNIARK",
              url: siteUrl,
            },
            publisher: {
              "@type": "Organization",
              name: "OMNIARK",
              url: siteUrl,
            },
            mainEntityOfPage: `${siteUrl}${articleUrl}`,
            articleSection: category,
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: siteUrl,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: category,
                item: categoryUrl,
              },
            ],
          }),
        }}
      />

      <div className="article-breadcrumb">
        <Link href="/">Home</Link>
        <span> / </span>
        <Link href={categoryHref}>{category}</Link>
      </div>

      <header className="article-header">
        <p className="article-category">{category}</p>

        <h1>{title}</h1>

        <p className="article-description">{description}</p>
      </header>

      <div className="article-body">{children}</div>
    </article>
  );
}
