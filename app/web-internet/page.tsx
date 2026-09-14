import Link from "next/link";

export const metadata = {
  title: "Web & Internet",
  description:
    "Practical guides explaining web browsers, URLs, websites, search engines, and basic internet concepts.",
  alternates: {
    canonical: "https://omniark.co/web-internet",
  },
};

const articles = [
  {
    title: "What Is a Web Browser? A Practical Guide",
    description:
      "Learn what a web browser is, how browsers retrieve and display websites, and what common browser features do.",
    href: "/web-internet/articles/what-is-a-web-browser",
  },
  {
    title: "What Is a URL? A Practical Guide",
    description:
      "Learn what a URL is, what its main parts mean, and how web addresses are used to locate resources online.",
    href: "/web-internet/articles/what-is-a-url",
  },
  {
    title: "How Do Websites Work? A Practical Guide",
    description:
      "Learn how browsers, servers, domains, DNS, HTTP, and web technologies work together to deliver websites.",
    href: "/web-internet/articles/how-do-websites-work",
  },
  {
    title: "What Is a Search Engine? A Practical Guide",
    description:
      "Learn what search engines do, how web pages are discovered and indexed, and how search results work.",
    href: "/web-internet/articles/what-is-a-search-engine",
  },
  {
    title: "What Is the Internet? A Practical Guide",
    description:
      "Learn the basic concepts behind the internet, including networks, devices, servers, and data communication.",
    href: "/web-internet/articles/what-is-the-internet",
  },
];

export default function WebInternetPage() {
  return (
    <main className="container">
      <section className="page-header">
        <p className="eyebrow">Web &amp; Internet</p>

        <h1>Web &amp; Internet</h1>

        <p>
          Clear guides explaining the basic technologies and concepts behind
          websites, browsers, search engines, and the internet.
        </p>
      </section>

      <section className="article-list">
        <h2>Guides</h2>

        {articles.map((article) => (
          <article className="article-card" key={article.href}>
            <h3>
              <Link href={article.href}>{article.title}</Link>
            </h3>

            <p>{article.description}</p>

            <Link href={article.href}>Read guide →</Link>
          </article>
        ))}
      </section>

      <section className="explore-section">
        <h2>Explore Other Topics</h2>

        <div className="explore-links">
          <Link href="/technology">Technology</Link>
          <Link href="/ai-digital-tools">AI &amp; Digital Tools</Link>
          <Link href="/productivity">Productivity</Link>
        </div>
      </section>
    </main>
  );
}