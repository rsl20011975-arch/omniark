import Link from "next/link";

const articles = [
  {
    title: "What Is a CPU? A Practical Guide",
    description:
      "Learn what a CPU is, what it does, and how the central processing unit works inside digital devices.",
    href: "/technology/articles/what-is-a-cpu",
  },
  {
    title: "What Is an Operating System? A Practical Guide",
    description:
      "Learn what an operating system does and how it manages hardware, software, files, and processes.",
    href: "/technology/articles/what-is-an-operating-system",
  },
  {
    title: "How Does Computer Memory Work? A Practical Guide",
    description:
      "Understand computer memory, RAM, storage, and why memory matters when applications are running.",
    href: "/technology/articles/how-does-computer-memory-work",
  },
  {
    title: "What Is Cloud Computing? A Practical Guide",
    description:
      "Learn what cloud computing means, how cloud services work, and why cloud technology is widely used.",
    href: "/technology/articles/what-is-cloud-computing",
  },
];

export const metadata = {
  title: "Technology",
  description:
    "Practical guides explaining computers, software, hardware, cloud computing, and everyday digital technology.",
  alternates: {
    canonical: "https://omniark.co/technology",
  },
};

export default function TechnologyPage() {
  return (
    <main className="category-page">
      <section>
        <p>TECHNOLOGY</p>

        <h1>Technology Guides</h1>

        <p>
          Clear explanations of computers, software, hardware, cloud computing,
          and the technologies used in everyday digital life.
        </p>
      </section>

      <section>
        <h2>Guides</h2>

        {articles.map((article) => (
          <article key={article.href}>
            <h3>
              <Link href={article.href}>{article.title}</Link>
            </h3>

            <p>{article.description}</p>

            <Link href={article.href}>Read guide →</Link>
          </article>
        ))}
      </section>

      <section>
        <h2>Explore Other Topics</h2>

        <p>
          <Link href="/ai-digital-tools">AI & Digital Tools →</Link>
        </p>

        <p>
          <Link href="/productivity">Productivity →</Link>
        </p>

        <p>
          <Link href="/web-internet">Web & Internet →</Link>
        </p>
      </section>
    </main>
  );
}