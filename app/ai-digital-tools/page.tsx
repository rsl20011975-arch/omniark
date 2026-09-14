import Link from "next/link";

const articles = [
  {
    title: "What Is Generative AI? A Practical Guide",
    description:
      "Understand what generative AI is, how it creates content, and how it is used in everyday digital tools.",
    href: "/ai-digital-tools/articles/what-is-generative-ai",
  },
  {
    title: "What Is an AI Model? A Practical Guide",
    description:
      "Learn what an AI model is, how it learns patterns from data, and how models are used in AI applications.",
    href: "/ai-digital-tools/articles/what-is-an-ai-model",
  },
  {
    title: "What Is a Prompt? A Practical Guide",
    description:
      "Learn what a prompt is, why instructions matter, and how prompts affect AI responses.",
    href: "/ai-digital-tools/articles/what-is-a-prompt",
  },
  {
    title: "How Do AI Assistants Work? A Practical Guide",
    description:
      "Learn how AI assistants process instructions, use context, generate responses, and interact with digital tools.",
    href: "/ai-digital-tools/articles/how-do-ai-assistants-work",
  },
  {
    title: "How to Evaluate AI-Generated Information",
    description:
      "Learn practical ways to check AI-generated information and verify important claims.",
    href: "/ai-digital-tools/articles/how-to-evaluate-ai-generated-information",
  },
];

export const metadata = {
  title: "AI & Digital Tools",
  description:
    "Practical guides explaining generative AI, AI models, prompts, and digital tools.",
  alternates: {
    canonical: "https://omniark.co/ai-digital-tools",
  },
};

export default function AIDigitalToolsPage() {
  return (
    <main className="category-page">
      <section>
        <p>AI & DIGITAL TOOLS</p>
        <h1>AI & Digital Tools Guides</h1>
        <p>
          Clear explanations of artificial intelligence, generative AI, AI
          models, prompts, and the digital tools people use in everyday life.
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
          <Link href="/technology">Technology →</Link>
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