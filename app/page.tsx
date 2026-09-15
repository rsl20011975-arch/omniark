import Link from "next/link";

const categories = [
  {
    title: "Technology",
    description:
      "Clear explanations of computing, software, devices, and the technologies used in everyday digital life.",
    href: "/technology",
  },
  {
    title: "AI & Digital Tools",
    description:
      "Practical explanations of artificial intelligence, digital tools, and the technologies changing how people work.",
    href: "/ai-digital-tools",
  },
  {
    title: "Productivity",
    description:
      "Simple ideas and practical guides for organizing digital work, tasks, information, and everyday activities.",
    href: "/productivity",
  },
  {
    title: "Web & Internet",
    description:
      "Understand websites, internet technologies, online systems, and the foundations of the modern web.",
    href: "/web-internet",
  },
];

const featuredArticles = [
  {
    category: "Technology",
    title: "What Is a CPU? A Practical Guide",
    description:
      "Learn what a CPU is, what it does, and how the central processing unit works inside digital devices.",
    href: "/technology/articles/what-is-a-cpu",
  },
  {
    category: "Technology",
    title: "What Is Cloud Computing? A Practical Guide",
    description:
      "Learn what cloud computing means, how cloud services work, and why cloud technology is widely used.",
    href: "/technology/articles/what-is-cloud-computing",
  },
  {
    category: "AI & Digital Tools",
    title: "What Is Generative AI? A Practical Guide",
    description:
      "Understand what generative AI is, how it works at a high level, and how it is used to create digital content.",
    href: "/ai-digital-tools/articles/what-is-generative-ai",
  },
  {
    category: "AI & Digital Tools",
    title: "What Is an AI Model? A Practical Guide",
    description:
      "Learn what an AI model is, how it learns patterns from data, and how models are used in AI applications.",
    href: "/ai-digital-tools/articles/what-is-an-ai-model",
  },
  {
    category: "Productivity",
    title: "What Is Digital Task Management? A Practical Guide",
    description:
      "Learn how digital task management can help organize, prioritize, and review everyday work.",
    href: "/productivity/articles/digital-task-management",
  },
  {
    category: "Productivity",
    title: "What Is Digital Note-Taking? A Practical Guide",
    description:
      "Learn what digital note-taking is, how it works, and how to organize digital notes for easier access and review.",
    href: "/productivity/articles/what-is-digital-note-taking",
  },
  {
    category: "Web & Internet",
    title: "How Do Websites Work? A Practical Guide",
    description:
      "Learn how browsers, servers, domains, DNS, and web technologies work together.",
    href: "/web-internet/articles/how-do-websites-work",
  },
  {
    category: "Web & Internet",
    title: "What Is a Web Browser? A Practical Guide",
    description:
      "Learn what a web browser is, how browsers retrieve and display websites, and what common browser features do.",
    href: "/web-internet/articles/what-is-a-web-browser",
  },
];

export const metadata = {
  title: "Digital Knowledge & Practical Guides",
  description:
    "OMNIARK provides practical and accessible guides about technology, AI and digital tools, productivity, and the web.",
  alternates: {
    canonical: "https://omniark.co",
  },
};

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <p>OMNIARK</p>

        <h1>Understanding the Digital World</h1>

        <p>
          OMNIARK provides practical explanations and accessible guides for
          understanding technology, AI and digital tools, productivity, and
          the web.
        </p>
      </section>

      <section>
        <p>EXPLORE TOPICS</p>

        <h2>Knowledge for the Digital World</h2>

        <p>
          Explore practical information organized around the technologies and
          digital systems people encounter in everyday life.
        </p>

        <div>
          {categories.map((category) => (
            <article key={category.href}>
              <h3>
                <Link href={category.href}>{category.title}</Link>
              </h3>

              <p>{category.description}</p>

              <Link href={category.href}>Explore topic →</Link>
            </article>
          ))}
        </div>
      </section>

      <section>
        <p>FEATURED GUIDES</p>

        <h2>Practical Guides</h2>

        <p>
          Start with these introductory guides to understand some of the
          fundamental ideas behind today's digital technologies.
        </p>

        <div>
          {featuredArticles.map((article) => (
            <article key={article.href}>
              <p>{article.category}</p>

              <h3>
                <Link href={article.href}>{article.title}</Link>
              </h3>

              <p>{article.description}</p>

              <Link href={article.href}>Read guide →</Link>
            </article>
          ))}
        </div>
      </section>

      <section>
        <p>ABOUT OMNIARK</p>

        <h2>Practical Information, Clearly Explained</h2>

        <p>
          Digital technology can sometimes feel unnecessarily complicated.
          OMNIARK focuses on explaining fundamental concepts in clear,
          accessible language so that readers can build a better understanding
          of the digital world.
        </p>

        <p>
          Our guides are organized by topic so readers can explore related
          subjects at their own pace.
        </p>

        <Link href="/about">Learn more about OMNIARK →</Link>
      </section>
    </main>
  );
}